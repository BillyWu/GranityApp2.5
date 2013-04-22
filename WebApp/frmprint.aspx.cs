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
	/// frmprint ��ժҪ˵����
	/// </summary>
	public partial class frmprint : BasePage
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// �ڴ˴������û������Գ�ʼ��ҳ��
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
            #region ��ӡĬ����
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


		#region Web ������������ɵĴ���
		override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: �õ����� ASP.NET Web ���������������ġ�
			//
			InitializeComponent();
			base.OnInit(e);
		}
		
		/// <summary>
		/// �����֧������ķ��� - ��Ҫʹ�ô���༭���޸�
		/// �˷��������ݡ�
		/// </summary>
		private void InitializeComponent()
		{    
		}
		#endregion

		#region ҳ�����̳д���
		/// <summary>
		/// ��ʼ����̬�ؼ�;����ӿؼ�
		/// </summary>
		/// <param name="e"></param>
		protected override void PgWfInit(EventArgs e)
		{
		}


		/// <summary>
		/// ֻ���������б�,�����ز�����ҳ���ǩ��
		/// </summary>
		protected  override	 void	PgInitRequestParams()
		{
            this.PgParamXmlDoc = new XmlDocument();
            if (null == this.Session["sysparam"])
                this.PgParamXmlDoc.LoadXml("<D/>");
            else
                this.PgParamXmlDoc.LoadXml(this.Session["sysparam"].ToString());
            //���봫�ݲ���
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
		/// ������jsҳ�����
		/// </summary>
		protected override	void	PgBuildJs()
		{

		}

		#endregion

        /// <summary>
        /// ��ӡ����
        /// ���ӣ�<��ϸ>7,2,8,10;<����>A2:I8;<����>&[����],&[��λ];<����>���ݱ��,�ϼ�
        /// ˵����<��ϸ>����Ϊ(7�У���2�п�ʼ����8�����ݣ�ÿҳ10��)
        ///       <����>A2��I8��Ϊ���������Ա�������</����>
        ///       <����>&[����]�ȣ�ȡϵͳ������ֵ</����>
        ///       <����>������Ϊ�������ݣ���������ȡ</����>
        ///       δ�����ˣ������ӡ
        ///       �����ַ�ʽ��ӡ��һ���嵥����ֻ�������б�this.PgWorkItemList[0].ItemName
        ///       ���Ǵ�ӡ����ģ������Ϊthis.PgWorkItemList[0].ItemName + "��"
        /// </summary>
        /// <param name="mrowIndex">����ǰ�к�,һ��Ϊ0</param>
        private void printexcel(string mrowIndex, WorkItem workitem,string PrnTmp)
        {
            QueryDataRes query = this.PgQuery;
            if (!string.IsNullOrEmpty(BuildParamList.getValue(this.PgParamXmlDoc, "MIndex")))
                mrowIndex = BuildParamList.getValue(this.PgParamXmlDoc, "MIndex");
            //��ȡģ���е�ԭʼSQL, �õ��ӱ�TAB
            //��Ҫ֪��itemName
            string printname = "", itemname = "";

            if (PrnTmp!=null && PrnTmp != "") printname = PrnTmp.Replace(".xml", "");
            else printname = workitem.printname;
            itemname = workitem.ItemName;

            if (printname == "" || printname == null) printname = itemname;
            printname = printname.ToLower();
            if (printname.IndexOf(".xml") > -1) printname = printname.Replace(".xml", "");
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����
            string SourceFile = printname + ".XML"; //Դ�ļ�����
            string SrcFile = TemplatePath + "\\" + SourceFile; //Դ�ļ�����
            string DestFile = printname + Session["userid"] + ".XLS";
            if (!File.Exists(SrcFile) == true)
            {
                SourceFile = printname + ".xls";
                if (!File.Exists(SrcFile) == true)
                {
                    string strMSG = "��ӡģ�� [" + SourceFile + "] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
                    this.Response.Write("<script language=\"javascript\">");
                    this.Response.Write("alert('" + strMSG + "')");
                    this.Response.Write("</script>");
                    return;
                }
            }
            NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);


            //�õ�����TAB
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
                leofun.Alert("[" + workitem.DataSrc + "]���ݷ����������飡", this);
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
            //��ȡģ���е�ԭʼSQL, �õ��ӱ�TAB
            //��Ҫ֪��itemName
            string printname = "", itemname = "";

            printname = workitem.printname;
            itemname = workitem.ItemName;

            if (printname == "" || printname == null) printname = itemname;

            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����
            string SourceFile = printname + ".XML"; //Դ�ļ�����
            string SrcFile = TemplatePath + "\\" + SourceFile; //Դ�ļ�����
            string DestFile = printname + Session["userid"] + ".XLS";
            if (!File.Exists(SrcFile) == true)
            {
                SourceFile = printname + ".xls";
                if (!File.Exists(SrcFile) == true)
                {
                    string strMSG = "��ӡģ�� [" + SourceFile + "] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
                    this.Response.Write("<script language=\"javascript\">");
                    this.Response.Write("alert('" + strMSG + "')");
                    this.Response.Write("</script>");
                    return;
                }
            }
            NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);


            //�õ�����TAB
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
                leofun.Alert("[" + workitem.DataSrc + "]���ݷ����������飡", this);
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
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����
            //���¶�������Դ����ȫ�����ݷ�ʽ���롣��ӡ��ɺ�ԭ��ҳ��ʽ
            UnitItem unititem = ((Estar.Common.WebControlTools.BasePage)(this)).PgUnitItem;
            string SourceFile = unititem.FilePrnTp; //Դ�ļ�����
            if (SourceFile.IndexOf(".xml") < 0)
                SourceFile = SourceFile + ".xml";
            string SrcFile = TemplatePath + "\\" + SourceFile; //Դ�ļ�����
            if (System.IO.File.Exists(SrcFile) == true)
            {

                XmlDocument xmldoc = csPrintData.makeprint(unititem, this.PgParamXmlDoc, Session["userid"].ToString());
                csPrintData.outXML2Excel(xmldoc, SourceFile.ToUpper().Replace("XML","xls"));
            }
            else
            {
                string strMSG = "��ӡģ�� [" + SourceFile + "] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
                leofun.Alert(strMSG, this);
            }
        }
		
		private void printword(string mrowIndex)
		{
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����

			//��Ҫ֪��itemName
			string printname = this.PgWorkItemList[0].printname;
			if(printname=="" || printname==null) printname = this.PgWorkItemList[0].ItemName;

			string SourceFile	= printname + ".XML"; //Դ�ļ�����
			string SrcFile		= TemplatePath +"\\"+ SourceFile; //Դ�ļ�����
			string DestFile		= printname + Session["userid"] + ".XLS";

			if(System.IO.File.Exists(SrcFile)==true)
			{				
				QueryDataRes query	=this.PgQuery;
                NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
            
				//��ȡģ���е�ԭʼSQL
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
				string strMSG = "��ӡģ�� ["+SourceFile+"] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('"+ strMSG +"')");
				this.Response.Write("</script>");
			}
		}

        /// <summary>
        /// ��ӡ������
        /// </summary>
        /// <param name="appendItem"></param>
        private void printReport(string appendItemName)
        {
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����

            //��Ҫ֪��itemName
            AppendItem appendItem = this.PgUnitItem.GetAppendItem(appendItemName);
            if (null == appendItem) return;
            string printname = appendItem.PrintTpName;
            if (printname == "" || printname == null) 
                printname = appendItem.ItemName;

            string SourceFile = printname + ".XML"; //Դ�ļ�����
            string SrcFile = TemplatePath + "\\" + SourceFile; //Դ�ļ�����
            string DestFile = printname + Session["userid"] + ".XLS";
            if (System.IO.File.Exists(SrcFile) == true)
            {
                //��ȡģ���е�ԭʼSQL
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
                string strMSG = "��ӡģ�� [" + SourceFile + "] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('" + strMSG + "')");
                this.Response.Write("</script>");
            }
        }

        /// <summary>
        /// ������Ҫ�ַ����滻��:��ҳ����,���˲�ѯ����,Chartͼ����
        /// ����������Ҫ����Ϊ��: type="macro";
        /// </summary>
        /// <param name="xmldoc">�����ĵ�</param>
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


		//Ϊʲô��PgWorkItemList[1].ItemType ?
		private void printword(string mrowIndex,WorkItem workitem)
		{
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //���Դ�ļ����ļ���·����

			string printname = "", itemname="";
			printname = workitem.printname;
			itemname  = workitem.ItemName;
			if(string.IsNullOrEmpty(printname))
                printname= itemname;
			string SourceFile	= printname + ".XML"; //Դ�ļ�����
			string SrcFile		= TemplatePath +"\\"+ SourceFile; //Դ�ļ�����
			string DestFile		= printname + Session["userid"] + ".XLS";
            string schemaFile = TemplatePath + "\\" + printname + ".xsd";
            if (!File.Exists(SrcFile))
            {
                string strMSG = "��ӡģ�� [" + SourceFile + "] �����ڣ�����ϵϵͳ����Ա������ӡģ��!";
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
