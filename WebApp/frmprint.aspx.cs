using System;
using System.Collections;
using System.ComponentModel;
using System.Web.Configuration;
using System.IO;
using System.Text;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;

namespace Estar.WebApp
{
	/// <summary>
	/// frmprint 的摘要说明。
	/// </summary>
	public partial class frmprint : BasePage
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
            string reportItemName = BuildParamList.getValue(this.PgParamXmlDoc, "AppendItem");
            string workItemName = BuildParamList.getValue(this.PgParamXmlDoc, "WorkItem");
            string PrnTmp = BuildParamList.getValue(this.PgParamXmlDoc, "PrnTmp");
            if (!string.IsNullOrEmpty(reportItemName))
            {
                this.printReport(reportItemName);
                return;
            }

            UnitItem unititem = ((Estar.Common.WebControlTools.BasePage)(this)).PgUnitItem;
            if (unititem.PrintType == PrintType.Excel && (unititem.FilePrnTp!=null || unititem.FilePrnTp!=""))
            {
                printexcel();
                return;
            }

            if (!string.IsNullOrEmpty(workItemName))
            {
                for (int i = 0; i < PgWorkItemList.Length; i++)
                {
                    if (PgWorkItemList[i].ItemName != workItemName)
                        continue;
                    switch (this.PgWorkItemList[i].PrintType)
                    {
                        case PrintType.Word:
                            printword("0", PgWorkItemList[i]);
                            break;
                        case PrintType.Excel:
                            printexcel("0", PgWorkItemList[i], PrnTmp);
                            break;
                        case PrintType.HTML:
                            break;
                    }
                }
                return;
            }
            #region 打印默认项
            for (int i=0;i<PgWorkItemList.Length;i++)
			{
				if(PgWorkItemList.Length==1)
				{
					switch(this.PgWorkItemList[i].PrintType)
					{
						case PrintType.Word:
							printword("0",PgWorkItemList[i]);
							break;
						case PrintType.Excel:
                            printexcel("0", PgWorkItemList[i]);
							break;
						case PrintType.HTML:
							break;
					}
					break;
				}
                if (PgWorkItemList.Length > 1 && PgWorkItemList[i].print == true && WorkItemType.DetailData == PgWorkItemList[i].ItemType)
				{
					switch(this.PgWorkItemList[i].PrintType)
					{
						case PrintType.Word:
							printword("0",PgWorkItemList[i]);
							break;
						case PrintType.Excel:
                            printexcel("0", PgWorkItemList[i]);
							break;
						case PrintType.HTML:
							break;
					}
					break;
				}
				else if(PgWorkItemList.Length>1 && PgWorkItemList[i].print==true)
				{
					switch(this.PgWorkItemList[i].PrintType)
					{
						case PrintType.Word:
							printword("0",PgWorkItemList[i]);
							break;
						case PrintType.Excel:
                            printexcel("0", PgWorkItemList[i]);
							break;
						case PrintType.HTML:
							break;
					}
					break;
				}
            }
            #endregion
            return;
		}


		#region Web 窗体设计器生成的代码
		override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: 该调用是 ASP.NET Web 窗体设计器所必需的。
			//
			InitializeComponent();
			base.OnInit(e);
		}
		
		/// <summary>
		/// 设计器支持所需的方法 - 不要使用代码编辑器修改
		/// 此方法的内容。
		/// </summary>
		private void InitializeComponent()
		{    
		}
		#endregion

		#region 页面基类继承处理
		/// <summary>
		/// 初始化动态控件;不添加控件
		/// </summary>
		/// <param name="e"></param>
		protected override void PgWfInit(EventArgs e)
		{
		}


		/// <summary>
		/// 只读出参数列表,不加载参数到页面标签上
		/// </summary>
		protected  override	 void	PgInitRequestParams()
		{
            this.PgParamXmlDoc = new XmlDocument();
            if (null == this.Session["sysparam"])
                this.PgParamXmlDoc.LoadXml("<D/>");
            else
                this.PgParamXmlDoc.LoadXml(this.Session["sysparam"].ToString());
            //加入传递参数
            if (null != this.Session[BuildParamList.SessionNameTrans])
            {
                XmlNode xntemp = this.PgParamXmlDoc.CreateElement("Temp");
                xntemp = this.PgParamXmlDoc.DocumentElement.AppendChild(xntemp);
                xntemp.InnerXml = this.Session[BuildParamList.SessionNameTrans].ToString();
                XmlNodeList xnPLList = xntemp.SelectNodes(".//PL");
                for (int i = xnPLList.Count - 1; i > -1; i--)
                    xntemp.ParentNode.AppendChild(xnPLList[i]);
                xntemp.ParentNode.RemoveChild(xntemp);
            }

		}


		/// <summary>
		/// 不产生js页面代码
		/// </summary>
		protected override	void	PgBuildJs()
		{

		}

		#endregion

        /// <summary>
        /// 打印函数
        /// 例子：<明细>7,2,8,10;<区域>A2:I8;<参数>&[日期],&[单位];<主表>单据编号,合计
        /// 说明：<明细>区域为(7行，第2列开始，共8列数据，每页10行)
        ///       <区域>A2到I8间为数据区，以便于搜索</区域>
        ///       <参数>&[日期]等，取系统参数赋值</参数>
        ///       <主表>后数据为主表数据，从主表中取</主表>
        ///       未尽事宜，分组打印
        ///       按两种方式打印，一是清单，即只打主表列表，this.PgWorkItemList[0].ItemName
        ///       二是打印表单，模板名称为this.PgWorkItemList[0].ItemName + "表单"
        /// </summary>
        /// <param name="mrowIndex">主表当前行号,一般为0</param>
        private void printexcel(string mrowIndex, WorkItem workitem,string PrnTmp)
        {
            QueryDataRes query = this.PgQuery;
            if (!string.IsNullOrEmpty(BuildParamList.getValue(this.PgParamXmlDoc, "MIndex")))
                mrowIndex = BuildParamList.getValue(this.PgParamXmlDoc, "MIndex");
            //获取模板中的原始SQL, 得到从表TAB
            //需要知道itemName
            string printname = "", itemname = "";

            if (PrnTmp!=null && PrnTmp != "") printname = PrnTmp.Replace(".xml", "");
            else printname = workitem.printname;
            itemname = workitem.ItemName;

            if (printname == "" || printname == null) printname = itemname;
            printname = printname.ToLower();
            if (printname.IndexOf(".xml") > -1) printname = printname.Replace(".xml", "");
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
            string SourceFile = printname + ".XML"; //源文件名称
            string SrcFile = TemplatePath + "\\" + SourceFile; //源文件名称
            string DestFile = printname + Session["userid"] + ".XLS";
            if (!File.Exists(SrcFile) == true)
            {
                SourceFile = printname + ".xls";
                if (!File.Exists(SrcFile) == true)
                {
                    string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                    this.Response.Write("<script language=\"javascript\">");
                    this.Response.Write("alert('" + strMSG + "')");
                    this.Response.Write("</script>");
                    return;
                }
            }
            NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);


            //得到主表TAB
            WorkItem masterItem = new WorkItem();
            DataTable tabMaster = null;
            if (this.PgWorkItemList.Length > 1)
            {
                for (int i = 0; i < this.PgWorkItemList.Length; i++)
                {
                    if (WorkItemType.MasterData != this.PgWorkItemList[i].ItemType)
                        continue;
                    masterItem = this.PgWorkItemList[i];
                    string[] strParams = getStrParams(this.PgParamXmlDoc, this.PgWorkItemList[i]);
                    strParams[8] = workitem.InitFilter;
                    tabMaster = this.PgQuery.getTable(this.PgWorkItemList[i].DataSrc, paramlist, strParams);
                    break;
                }
                //if (workitem.LinkCol != "" && workitem.LinkCol != null && tabMaster.Rows[0][workitem.LinkCol] != null)
                //    paramlist.Add(workitem.LinkCol, tabMaster.Rows[0][workitem.LinkCol]);
                for (int i = 0; i < tabMaster.Columns.Count; i++)
                    paramlist.Add(tabMaster.Columns[i].ColumnName, tabMaster.Rows[0][tabMaster.Columns[i].ColumnName]);
            }
            DataTable tab = query.getTable(workitem.DataSrc, paramlist, this.getStrParams(this.PgParamXmlDoc, workitem));
            if (tab == null)
            {
                leofun.Alert("[" + workitem.DataSrc + "]数据发生错误，请检查！", this);
                return;
            }

            if (tabMaster == null) tabMaster = tab;
            if (null == tab) return;
            if (tab.Rows.Count < 1) return;

            XmlDocument xmldoc = csPrintData.makeprint(masterItem, workitem,SourceFile, DestFile, tab, tabMaster, leofun.toIntval(mrowIndex), this.Session["userid"].ToString(), paramlist);
            csPrintData.outXML2Excel(xmldoc, printname+".xls");
        }

        private void printexcel(string mrowIndex, WorkItem workitem)
        {
            QueryDataRes query = this.PgQuery;
            if (!string.IsNullOrEmpty(BuildParamList.getValue(this.PgParamXmlDoc, "MIndex")))
                mrowIndex = BuildParamList.getValue(this.PgParamXmlDoc, "MIndex");
            //获取模板中的原始SQL, 得到从表TAB
            //需要知道itemName
            string printname = "", itemname = "";

            printname = workitem.printname;
            itemname = workitem.ItemName;

            if (printname == "" || printname == null) printname = itemname;

            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
            string SourceFile = printname + ".XML"; //源文件名称
            string SrcFile = TemplatePath + "\\" + SourceFile; //源文件名称
            string DestFile = printname + Session["userid"] + ".XLS";
            if (!File.Exists(SrcFile) == true)
            {
                SourceFile = printname + ".xls";
                if (!File.Exists(SrcFile) == true)
                {
                    string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                    this.Response.Write("<script language=\"javascript\">");
                    this.Response.Write("alert('" + strMSG + "')");
                    this.Response.Write("</script>");
                    return;
                }
            }
            NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);


            //得到主表TAB
            WorkItem masterItem = new WorkItem();
            DataTable tabMaster = null;
            if (this.PgWorkItemList.Length > 1)
            {
                for (int i = 0; i < this.PgWorkItemList.Length; i++)
                {
                    if (WorkItemType.MasterData != this.PgWorkItemList[i].ItemType)
                        continue;
                    masterItem = this.PgWorkItemList[i];
                    string[] strParams = getStrParams(this.PgParamXmlDoc, this.PgWorkItemList[i]);
                    strParams[8] = workitem.InitFilter;
                    tabMaster = this.PgQuery.getTable(this.PgWorkItemList[i].DataSrc, paramlist, strParams);
                    break;
                }
                if (workitem.LinkCol != "" && workitem.LinkCol != null && tabMaster.Rows[0][workitem.LinkCol] != null)
                    paramlist.Add(workitem.LinkCol, tabMaster.Rows[0][workitem.LinkCol]);
            }
            DataTable tab = query.getTable(workitem.DataSrc, paramlist, this.getStrParams(this.PgParamXmlDoc, workitem));
            if (tab == null)
            {
                leofun.Alert("[" + workitem.DataSrc + "]数据发生错误，请检查！", this);
                return;
            }

            if (tabMaster == null) tabMaster = tab;
            if (null == tab) return;
            if (tab.Rows.Count < 1) return;

            XmlDocument xmldoc = csPrintData.makeprint(masterItem, workitem, SourceFile, DestFile, tab, tabMaster, leofun.toIntval(mrowIndex), this.Session["userid"].ToString(), paramlist);
            csPrintData.outXML2Excel(xmldoc, printname + ".xls");
        }

        private void printexcel()
        {
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
            //重新读入数据源，按全部数据方式读入。打印完成后还原分页方式
            UnitItem unititem = ((Estar.Common.WebControlTools.BasePage)(this)).PgUnitItem;
            string SourceFile = unititem.FilePrnTp; //源文件名称
            if (SourceFile.IndexOf(".xml") < 0)
                SourceFile = SourceFile + ".xml";
            string SrcFile = TemplatePath + "\\" + SourceFile; //源文件名称
            if (System.IO.File.Exists(SrcFile) == true)
            {

                XmlDocument xmldoc = csPrintData.makeprint(unititem, this.PgParamXmlDoc, Session["userid"].ToString());
                csPrintData.outXML2Excel(xmldoc, SourceFile.ToUpper().Replace("XML","xls"));
            }
            else
            {
                string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                leofun.Alert(strMSG, this);
            }
        }
		
		private void printword(string mrowIndex)
		{
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。

			//需要知道itemName
			string printname = this.PgWorkItemList[0].printname;
			if(printname=="" || printname==null) printname = this.PgWorkItemList[0].ItemName;

			string SourceFile	= printname + ".XML"; //源文件名称
			string SrcFile		= TemplatePath +"\\"+ SourceFile; //源文件名称
			string DestFile		= printname + Session["userid"] + ".XLS";

			if(System.IO.File.Exists(SrcFile)==true)
			{				
				QueryDataRes query	=this.PgQuery;
                NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
            
				//获取模板中的原始SQL
				DataSet			ds=new DataSet(this.PgUnitName);
				WorkItem	workItem=this.PgWorkItemList[0];
				string  strRowCount=this.getRecordCountParam(workItem);
				query.FillDataSet(this.PgWorkItemList[0].DataSrc,paramlist,getStrParams(this.PgParamXmlDoc,this.PgWorkItemList[0]),ds);

				PrintWord	printdoc=new PrintWord();
                printdoc.TemplateFileName = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath") + "\\" + workItem.printname + ".xml");
				printdoc.DataSource=ds;
				printdoc.DataBind();
				printdoc.RemoveXmlLable();
				csPrint.outXML2Word(printdoc.PrintXmlDoc,"print.doc");
			}
			else
			{
				string strMSG = "打印模板 ["+SourceFile+"] 不存在，请联系系统管理员建立打印模板!";
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('"+ strMSG +"')");
				this.Response.Write("</script>");
			}
		}

        /// <summary>
        /// 打印报表项
        /// </summary>
        /// <param name="appendItem"></param>
        private void printReport(string appendItemName)
        {
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。

            //需要知道itemName
            AppendItem appendItem = this.PgUnitItem.GetAppendItem(appendItemName);
            if (null == appendItem) return;
            string printname = appendItem.PrintTpName;
            if (printname == "" || printname == null) 
                printname = appendItem.ItemName;

            string SourceFile = printname + ".XML"; //源文件名称
            string SrcFile = TemplatePath + "\\" + SourceFile; //源文件名称
            string DestFile = printname + Session["userid"] + ".XLS";
            if (System.IO.File.Exists(SrcFile) == true)
            {
                //获取模板中的原始SQL
                QueryDataRes query = this.PgQuery;
                NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
                DataSet ds = new DataSet(appendItem.ItemName);
                string schemaFile = TemplatePath + "\\" + printname + ".xsd";
                UnitItem appendUnit = this.PgUnitItem;
                if (!string.IsNullOrEmpty(appendItem.UnitName))
                {
                    appendUnit = new UnitItem(this.Server.MapPath(DataAccRes.AppSettings("WorkConfig")), appendItem.UnitName);
                    if (null == appendUnit) return;
                    query = new QueryDataRes(appendUnit.DataSrcFile);
                }
                if (File.Exists(schemaFile))
                {
                    ds.ReadXmlSchema(schemaFile);
                    for (int i = 0; i < ds.Tables.Count; i++)
                    {
                        WorkItem tabItem = null;
                        for (int j = 0; j < appendUnit.WorkItemList.Length; j++)
                            if (ds.Tables[i].TableName == appendUnit.WorkItemList[j].DataSrc)
                            {
                                tabItem = appendUnit.WorkItemList[j];
                                break;
                            }
                        if (null == tabItem)
                            query.FillDataSet(ds.Tables[i].TableName, paramlist, ds);
                        else
                        {
                            query.FillDataSet(ds.Tables[i].TableName, paramlist, this.getStrParams(this.PgParamXmlDoc,tabItem), ds);
                            if (null != ds.Tables[i] && !string.IsNullOrEmpty(tabItem.printcountmin))
                                ds.Tables[i].ExtendedProperties[PrintWord.ExProMinRowCountName] = tabItem.printcountmin;
                        }
                    }///for (int i = 0; i < ds.Tables.Count; i++)
                }
                else
                {
                    if (string.IsNullOrEmpty(appendItem.UnitName))
                    {
                        query.FillDataSet(appendItem.DataSrc, paramlist, ds);
                        if (null != ds.Tables[appendItem.DataSrc] && !string.IsNullOrEmpty(appendItem.PrintCountMin))
                            ds.Tables[appendItem.DataSrc].ExtendedProperties[PrintWord.ExProMinRowCountName] = appendItem.PrintCountMin;
                    }
                    else if (null != appendUnit)
                    {
                        for (int i = 0; i < appendUnit.WorkItemList.Length; i++)
                        {
                            WorkItem    workitem=appendUnit.WorkItemList[i];
                            query.FillDataSet(workitem.DataSrc, paramlist, this.getStrParams(this.PgParamXmlDoc,appendUnit.WorkItemList[i]), ds);
                            if (null != ds.Tables[workitem.DataSrc] && !string.IsNullOrEmpty(workitem.printcountmin))
                                ds.Tables[workitem.DataSrc].ExtendedProperties[PrintWord.ExProMinRowCountName] = workitem.printcountmin;
                        }
                    }
                }
                if (ds == null) return;
                if (ds.Tables[0] == null) return;
                if (ds.Tables[0].Rows.Count < 1) return;

                if (appendItem.PrintType == PrintType.Word)
                {
                    PrintWord printdoc = new PrintWord();
                    printdoc.TemplateFileName = SrcFile;
                    printdoc.DataSource = ds;
                    printdoc.DataBind();
                    printdoc.RemoveXmlLable();
                    csPrint.outXML2Word(printdoc.PrintXmlDoc, "print.doc");
                }
                else
                {
                    XmlDocument xmldoc = csPrintData.makeprint(null,null,SourceFile, DestFile, ds.Tables[0], ds.Tables[0], 0, Session["userid"].ToString(), paramlist);
                    csPrintData.outXML2Excel(xmldoc, "print.xls");
                }
            }
            else
            {
                string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('" + strMSG + "')");
                this.Response.Write("</script>");
            }
        }

        /// <summary>
        /// 对于需要字符宏替换的:分页参数,过滤查询参数,Chart图参数
        /// 参数的类型要声明为宏: type="macro";
        /// </summary>
        /// <param name="xmldoc">参数文档</param>
        /// <returns></returns>
        private string[] getStrParams(XmlDocument xmldoc, WorkItem  workItem)
        {
            string[] strParams ={ "", "", "", "", "", "", "", "", "" };
            NameObjectList macroParam = BuildParamList.BuildParamMacro(xmldoc,workItem.ItemName);
            for (int i = 0; i < macroParam.Count; i++)
            {
                string strName = macroParam.Keys[i];
                if ("firstrowold" == strName.ToLower())
                    strParams[1] = macroParam[i].ToString();
                if ("firstrow" == strName.ToLower())
                    strParams[1] = macroParam[i].ToString();
                if ("lastrow" == strName.ToLower())
                    strParams[7] = macroParam[i].ToString();
                if ("filterfast" == strName.ToLower())
                    strParams[2] = macroParam[i].ToString();
                if ("filter" == strName.ToLower())
                    strParams[3] = macroParam[i].ToString();
            }
            if ( null!=workItem )
            {
                strParams[8] = workItem.InitFilter;
                if ("" != workItem.PageSize)
                    strParams[0] = workItem.PageSize;
            }
            if ("" == strParams[0])
                strParams[0] = "10";
            if ("" == strParams[1])
                strParams[1] = "0";
            if ("" == strParams[7])
                strParams[7] = strParams[0];
            string recordcount = BuildParamList.getValue(xmldoc, workItem.ItemName, "RecordCount");
            if (string.IsNullOrEmpty(recordcount) || recordcount=="0")
                recordcount = BuildParamList.getValue(this.PgParamXmlDoc, "RecordCount");
            if (!string.IsNullOrEmpty(recordcount))
            {
                strParams[1] = "0";
                strParams[7] = strParams[0] = recordcount;
            }

            return strParams;
        }

		private string getRecordCountParam(WorkItem workitem)
		{
            return BuildParamList.getValue(this.PgParamXmlDoc, "RecordCount", workitem.ItemName);
            //////wrcawrca
            //string			strParam=string.Empty;
            //XmlDocument		xmldoc=new XmlDocument();
            //XmlElement		xmlele=null;
            //if(null==this.PgRequestParams["QueryStr"] || ""==this.PgRequestParams["QueryStr"])
            //    xmldoc.LoadXml("<ParameterList/>");
            //else
            //    xmldoc.LoadXml(this.PgRequestParams["QueryStr"]);
            //xmlele=xmldoc.DocumentElement.SelectSingleNode("Parameter[@name='RecordCount"+datasrc+"']") as XmlElement;
            //    if(null==xmlele)
            //        strParam="";
            //    else
            //        strParam=xmlele.Attributes["value"].Value;
            //return strParam;
		}


		//为什么是PgWorkItemList[1].ItemType ?
		private void printword(string mrowIndex,WorkItem workitem)
		{
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。

			string printname = "", itemname="";
			printname = workitem.printname;
			itemname  = workitem.ItemName;
			if(string.IsNullOrEmpty(printname))
                printname= itemname;
			string SourceFile	= printname + ".XML"; //源文件名称
			string SrcFile		= TemplatePath +"\\"+ SourceFile; //源文件名称
			string DestFile		= printname + Session["userid"] + ".XLS";
            string schemaFile = TemplatePath + "\\" + printname + ".xsd";
            if (!File.Exists(SrcFile))
            {
                string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('" + strMSG + "')");
                this.Response.Write("</script>");
                return;
            }
            QueryDataRes query = this.PgQuery;
            NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
            DataSet ds = new DataSet(this.PgUnitItem.UnitName);
            if (File.Exists(schemaFile))
            {
                ds.ReadXmlSchema(schemaFile);
                for (int i = 0; i < ds.Tables.Count; i++)
                {
                    WorkItem tabItem = null;
                    for (int j = 0; j < this.PgUnitItem.WorkItemList.Length; j++)
                        if (ds.Tables[i].TableName == this.PgUnitItem.WorkItemList[j].DataSrc)
                        {
                            tabItem = this.PgUnitItem.WorkItemList[j];
                            break;
                        }
                    if (null == tabItem)
                        query.FillDataSet(ds.Tables[i].TableName, paramlist, ds);
                    else
                    {
                        query.FillDataSet(ds.Tables[i].TableName, paramlist, this.getStrParams(this.PgParamXmlDoc,tabItem), ds);
                        if (!string.IsNullOrEmpty(tabItem.printcountmin))
                            ds.Tables[i].ExtendedProperties[PrintWord.ExProMinRowCountName] = tabItem.printcountmin;
                    }
                }///for (int i = 0; i < ds.Tables.Count; i++)
            }
            else
            {
                query.FillDataSet(workitem.DataSrc, paramlist, this.getStrParams(this.PgParamXmlDoc,workitem), ds);
                if (null != ds.Tables[workitem.DataSrc] && !string.IsNullOrEmpty(workitem.printcountmin))
                    ds.Tables[workitem.DataSrc].ExtendedProperties[PrintWord.ExProMinRowCountName] = workitem.printcountmin;
            }
            if (ds == null) return;
            if (ds.Tables[0] == null) return;
            if (ds.Tables[0].Rows.Count < 1) return;

            PrintWord printdoc = new PrintWord();
            printdoc.TemplateFileName = SrcFile;
            printdoc.DataSource = ds;
            printdoc.DataBind();
            printdoc.RemoveXmlLable();
            csPrint.outXML2Word(printdoc.PrintXmlDoc, printname + ".doc");
        }

	}
}
