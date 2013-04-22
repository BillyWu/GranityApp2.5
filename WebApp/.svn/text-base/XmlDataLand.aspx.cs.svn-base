using System;
using System.IO;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Xml;
using System.Text;
using System.Drawing;
using System.Web;
using System.Net;
using System.Configuration;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Estar.Common.WebControlTools;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Business.DataManager;
//using Estar.WebApp.WebService;

namespace Estar.WebApp
{
	/// <summary>
	/// XmlDataLand 与前端业务交互的服务页面;前端需要传递的固定参数:UnitName,Command,WorkItem,DataItem
    /// UnitItem是工作单元,Command是执行功能项,WorkItem,执行项的当前工作环境;DataItem是前端需要的数据项
    /// 如果是查询数据是数据项列表,如果是命令项是cmdsql项名称
	/// </summary>
	public partial class XmlDataLand : System.Web.UI.Page
	{
		XmlDocument	xmldocSchema=new XmlDocument();
		private		XmlNamespaceManager		_xmlNsMglSchema=null;
		private		DataSet			_dictds=new DataSet("Dict");

        XmlDocument xmlDocParam = new XmlDocument();
        UnitItem unitItem = null;
        WorkItem workitem = null;
        private NameObjectList paramlist = null;     //页面参数
        private QueryDataRes query = null;
        private QueryDataRes dictQuery = null;

		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			//读取用户参数
            string strCommand = "",strDataItem="";
			StreamReader streamreader=new StreamReader(this.Request.InputStream,Encoding.UTF8);
            //if (streamreader.ReadToEnd() == "") return;
            //try
            //{
                this.xmlDocParam.LoadXml(streamreader.ReadToEnd());
            //}
            //catch
            //{
            //    return;
            //}
            
			this.paramlist=BuildParamList.BuildParams(this.xmlDocParam);
			try
			{
                if (null==this.paramlist["UnitName"])
                    return;
                if (null==this.paramlist["Command"])
                    return;
				string	unitName=this.paramlist["UnitName"].ToString();
                strCommand = this.paramlist["Command"].ToString();
                if (null==this.paramlist["DataItem"])
                    strDataItem = "";
                else
                    strDataItem = this.paramlist["DataItem"].ToString();
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), unitName);
                //unitItem = new UnitItem(paramlist, unitName);

			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
				return;
			}
            string  workItemName="";
            if (null != paramlist["WorkItem"])
                workItemName=paramlist["WorkItem"].ToString();
            for (int i = 0; i < unitItem.WorkItemList.Length; i++)
                if (workItemName == unitItem.WorkItemList[i].ItemName)
                {
                    workitem = unitItem.WorkItemList[i];
                    break;
                }

            if (workitem==null)
            {
                string strResult = leofun.setvaltag("", "成功", "false");
                this.Response.Write(leofun.Escape(strResult));
                return;
            }
            query = new QueryDataRes(unitItem.DataSrcFile);
            if (unitItem.DataSrcFile == unitItem.DictColSrcFile)
                dictQuery = query;
            else
                dictQuery = new QueryDataRes(unitItem.DictColSrcFile);
            switch (strCommand.ToLower())
            {
                case    "query":
                    this.QueryData(strDataItem);
                    break;
                case "queryincserialwatch":
                    //this.QueryIncSerialWatch();
                    break;
                case "cmd_cmd":
                    this.ExcutCmd(strDataItem);
                    break;
                case "cmd_cmdbits":
                    //首先执行命令,然后根据数据库表记录的需要备份文件列表,把列表传送给目地服务器,目地服务器调用后台智能传输服务备份文件。
                    //WSBits 是WebService对象，调用远程方法
                    this.ExcutCmd(strDataItem);
                    QueryDataRes querySys = QueryDataRes.CreateQuerySys();
                    NameObjectList paramBits = new NameObjectList();
                    string struri = this.Request.Url.AbsoluteUri;
                    paramBits["地址"] = struri.Substring(0, struri.IndexOf(this.Request.Url.LocalPath));
                    DataTable tabTrans = querySys.getTable("后台文件归档", paramBits);
                    WSBits bitsTrans = new WSBits();
                    if (bitsTrans.AddFileList(tabTrans))
                        querySys.ExecuteDelete("后台文件归档", paramBits);
                    break;
                case "switchmodel":
                    bool bSucc = false;
                    string strResult = "";
                    if (null != paramlist["WorkItem"] && "SetModel" == paramlist["WorkItem"].ToString())
                        bSucc = DataAccRes.SwitchModelConfig(strDataItem);
                    else
                        bSucc = DataAccRes.SwitchDefaultModel();
                    if (bSucc)
                        strResult = leofun.setvaltag("", "成功", "true");
                    else
                    {
                        strResult = leofun.setvaltag("", "成功", "false");
                        strResult = leofun.setvaltag(strResult, "提示", "执行命令失败,请查找原因再重试!");
                    }
                    this.Response.Write(leofun.Escape(strResult));
                    break;
                default:
                    break;
            }
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

        /// <summary>
        /// 查询数据
        /// 如果未初始化页面的XmlLandData则补充
        /// </summary>
        public void QueryData(string itemdata)
        {
            DataSet ds = new DataSet(unitItem.UnitName);
            ds.EnforceConstraints = false;
            string[] dataItemList = itemdata.Split(",".ToCharArray());
            string[] strParams = this.getStrParams(this.xmlDocParam);
            int iStartRow = 0;
            if ("" != strParams[1])
                try { iStartRow = Convert.ToInt16(strParams[1]); }
                catch { }
            for (int i = 0; i < dataItemList.Length; i++)
            {
                if ("" == dataItemList[i]) continue;
                query.FillDataSet(dataItemList[i], paramlist, strParams, ds);
                //增加行光标列
                if (null != ds.Tables[dataItemList[i]] && !ds.Tables[dataItemList[i]].Columns.Contains("RowNum"))
                    ds.Tables[dataItemList[i]].Columns.Add("RowNum", Type.GetType("System.Int32"));
                for (int j = 0; null != ds.Tables[dataItemList[i]] && j < ds.Tables[dataItemList[i]].Rows.Count; j++)
                    ds.Tables[dataItemList[i]].Rows[j]["RowNum"] = iStartRow + j + 1;
            }
            //数字是0的,改为空值显示
            for (int s = 0; s < ds.Tables.Count; s++)
            {
                DataTable tab = ds.Tables[s];
                if (null == tab) continue;
                for (int i = 0; i < tab.Columns.Count; i++)
                {
                    DataColumn col = tab.Columns[i];
                    if ("RowNum" == col.ColumnName) continue;
                    if ("Decimal" != col.DataType.Name && "Double" != col.DataType.Name && "Int16" != col.DataType.Name
                            && "Int32" != col.DataType.Name && "Int64" != col.DataType.Name && "Single" != col.DataType.Name
                             && "UInt16" != col.DataType.Name && "UInt32" != col.DataType.Name && "UInt64" != col.DataType.Name)
                        continue;
                    DataRow[] drs = tab.Select(col.ColumnName + "=0");
                    for (int j = 0; j < drs.Length; j++)
                        drs[j][i] = DBNull.Value;
                }
            }

            this.xmldocSchema.LoadXml(ds.GetXmlSchema());
            XmlNamespaceManager xmlNsMgl = new XmlNamespaceManager(this.xmldocSchema.NameTable);
            XmlNode xmlRootEle = this.xmldocSchema.DocumentElement;
            for (int i = 0; i < xmlRootEle.Attributes.Count; i++)
            {
                string strPrefix = xmlRootEle.Attributes[i].Prefix;
                string strLocalName = xmlRootEle.Attributes[i].LocalName;
                string strURI = xmlRootEle.Attributes[i].Value;
                if ("xmlns" == strLocalName)
                    xmlNsMgl.AddNamespace(string.Empty, strURI);
                if ("xmlns" != strPrefix) continue;
                xmlNsMgl.AddNamespace(strLocalName, strURI);
            }
            this._xmlNsMglSchema = xmlNsMgl;
            this.setSchema(ds);

            for (int i = 0; i < workitem.DictCol.Length; i++)
            {
                DictColumn dictcol = workitem.DictCol[i];
                if (dictcol.DataSrc.Trim().Length > 0)
                {
                    bool isContinue = false;
                    for (int k = 0; k < i; k++)
                        if (dictcol.DataSrc == workitem.DictCol[k].DataSrc)
                        {
                            isContinue = true; break;
                        }
                    if (isContinue) continue;
                    try
                    {
                        string str = dictcol.DataSrc.Replace(" ", "_x0020_");
                        dictQuery.FillDataSet(str, paramlist, this._dictds);
                    }
                    catch { }
                }
            }

            XmlDataDocument xmldocData = new XmlDataDocument(ds);
            this.setFormatXmlLand(xmldocData, ds);
            this.Response.ContentType = "text/xml; charset=gb2312";
            

            //如果结构未初始化，则建立数据包
            //<XML id="MasterTab" itemname="建筑审批导航" typexml="Data">
            //<XML id="MasterTab_Sum" typexml="Count" itemname="建筑审批导航">

            string strXPath = "//P[@n='tpid' and @v='" + this.workitem.TempId + "']";
            XmlNode xmlNodeif = this.xmlDocParam.SelectSingleNode(strXPath);
            if (xmlNodeif != null)
                xmldocData = buildXmlDoc(xmldocData);                
            xmldocData.Save(this.Response.Output);
        }

        private XmlDataDocument buildXmlDoc(XmlDataDocument xmldata)
        {
            XmlDataDocument xmldoc = new XmlDataDocument();
            //建立数据xml结构

            //xmldoc.LoadXml("<XML><etpTemplate_" + this.workitem.TempId + "_xmlland><" + this.unitItem.UnitName + ">" + ((System.Xml.XmlDocument)(xmldata)).DocumentElement.InnerXml + "</" + this.unitItem.UnitName + "></etpTemplate_" + this.workitem.TempId + "_xmlland></XML>");
            xmldoc.LoadXml("<XML><etpTemplate_" + this.workitem.TempId + "_xmlland>" + ((System.Xml.XmlDocument)(xmldata)).DocumentElement.InnerXml + "</etpTemplate_" + this.workitem.TempId + "_xmlland></XML>");
            XmlAttribute xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
            xmlAtt.Value = this.workitem.TempId;
            xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
            xmlAtt.Value = this.workitem.ItemName;
            xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
            xmlAtt.Value = "Data";
            
            return xmldoc;
        }
        /// <summary>
        /// 读取串口监控数据,取自内存DataSet数据集
        /// </summary>
        /// 
        /*
        public void QueryIncSerialWatch()
        {
            if (null == this.unitItem || string.IsNullOrEmpty(this.unitItem.UnitName))
                return;
            if (null == this.workitem || string.IsNullOrEmpty(this.workitem.ItemName) || string.IsNullOrEmpty(this.workitem.Where))
                return;
            DataSet ds = SerialWatchService.DataSetList[this.unitItem.UnitName] as DataSet;
            if (null == ds) return;
            DataTable tab = ds.Tables[this.workitem.DataSrc];
            if (null == tab) return;
            string where = BuildParamList.getValue(this.xmlDocParam, "Where");
            string sort = BuildParamList.getValue(this.xmlDocParam, "Sort");
            NameObjectList paramMacroList = BuildParamList.BuildParamMacro(this.xmlDocParam, this.workitem.ItemName);
            for (int i = 0; i < paramMacroList.Count; i++)
            {
                where = where.Replace("{" + paramMacroList.Keys[i] + "}", paramMacroList[i].ToString());
                sort = sort.Replace("{" + paramMacroList.Keys[i] + "}", paramMacroList[i].ToString());
            }
            DataTable tabNew = tab.Clone();
            DataRow[] drs = tab.Select(where, sort);
            for (int i = 0; i < drs.Length; i++)
                tabNew.Rows.Add(drs[i].ItemArray);
            ds = new DataSet(this.unitItem.UnitName);
            ds.Tables.Add(tabNew);
            //增加行光标列
            string[] strParams = this.getStrParams(this.xmlDocParam);
            int iStartRow = 0;
            if ("" != strParams[1])
                try { iStartRow = Convert.ToInt16(strParams[1]); }
                catch { }
            if (!tabNew.Columns.Contains("RowNum"))
                tabNew.Columns.Add("RowNum", Type.GetType("System.Int32"));
            for (int j = 0; j < tabNew.Rows.Count; j++)
                tabNew.Rows[j]["RowNum"] = iStartRow + j + 1;
            //数字是0的,改为空值显示
            for (int i = 0; i < tabNew.Columns.Count; i++)
            {
                DataColumn col = tabNew.Columns[i];
                if ("RowNum" == col.ColumnName) continue;
                if ("Decimal" != col.DataType.Name && "Double" != col.DataType.Name && "Int16" != col.DataType.Name
                        && "Int32" != col.DataType.Name && "Int64" != col.DataType.Name && "Single" != col.DataType.Name
                         && "UInt16" != col.DataType.Name && "UInt32" != col.DataType.Name && "UInt64" != col.DataType.Name)
                    continue;
                drs = tabNew.Select(col.ColumnName + "=0");
                for (int j = 0; j < drs.Length; j++)
                    drs[j][i] = DBNull.Value;
            }
            ds.EnforceConstraints = false;
            this.xmldocSchema.LoadXml(ds.GetXmlSchema());
            XmlNamespaceManager xmlNsMgl = new XmlNamespaceManager(this.xmldocSchema.NameTable);
            XmlNode xmlRootEle = this.xmldocSchema.DocumentElement;
            for (int i = 0; i < xmlRootEle.Attributes.Count; i++)
            {
                string strPrefix = xmlRootEle.Attributes[i].Prefix;
                string strLocalName = xmlRootEle.Attributes[i].LocalName;
                string strURI = xmlRootEle.Attributes[i].Value;
                if ("xmlns" == strLocalName)
                    xmlNsMgl.AddNamespace(string.Empty, strURI);
                if ("xmlns" != strPrefix) continue;
                xmlNsMgl.AddNamespace(strLocalName, strURI);
            }
            this._xmlNsMglSchema = xmlNsMgl;
            this.setSchema(ds);
            for (int i = 0; i < this.workitem.DictCol.Length; i++)
            {
                DictColumn dictcol = this.workitem.DictCol[i];
                if (dictcol.DataSrc.Trim().Length > 0)
                {
                    bool isContinue = false;
                    for (int k = 0; k < i; k++)
                        if (dictcol.DataSrc == workitem.DictCol[k].DataSrc)
                        {
                            isContinue = true; break;
                        }
                    if (isContinue) continue;
                    try
                    {
                        dictQuery.FillDataSet(dictcol.DataSrc, paramlist, this._dictds);
                    }
                    catch { }
                }
            }

            XmlDataDocument xmldocData = new XmlDataDocument(ds);
            this.setFormatXmlLand(xmldocData, ds);
            this.Response.ContentType = "text/xml; charset=gb2312";
            xmldocData.Save(this.Response.Output);
        }
        */
        public void ExcutCmd(string cmditem)
        {
            CommandItem[] cmdList = this.unitItem.CommandItemList;
            CommandItem cmdCur = null;
            for (int i = 0; i < cmdList.Length; i++)
            {
                if (cmditem.ToLower() != cmdList[i].ItemName.ToLower())
                    continue;
                cmdCur = cmdList[i]; break;
            }
            if (null == cmdCur || null == cmdCur.ItemName || "" == cmdCur.ItemName)
                return;
            if (AppendFunType.SqlCmd == cmdCur.FunType)
            {
                bool bSucc = this.query.ExecuteNonQuery(cmdCur.DataSrc, this.paramlist, this.paramlist, this.paramlist);
                string strResult = "";
                if (bSucc)
                    strResult = leofun.setvaltag("", "成功", "true");
                else
                {
                    strResult = leofun.setvaltag("", "成功", "false");
                    strResult = leofun.setvaltag(strResult, "提示", "执行命令失败,请查找原因再重试!");
                }
                this.Response.Write(leofun.Escape(strResult));
            }
        }

        /// <summary>
        /// 切换帐套
        /// </summary>
        public void SwitchModel()
        {
            bool bSucc = DataAccRes.SwitchDefaultModel();
            string strResult = "";
            if (bSucc)
                strResult = leofun.setvaltag("", "成功", "true");
            else
            {
                strResult = leofun.setvaltag("", "成功", "false");
                strResult = leofun.setvaltag(strResult, "提示", "执行命令失败,请查找原因再重试!");
            }
            this.Response.Write(leofun.Escape(strResult));
        }

        #region 内部函数
        /// <summary>
		/// 设置数据集的结构及定义属性
		/// </summary>
		private void	setSchema(DataSet	ds)
		{
			//需要输出到客户端的项目属性,列属性
			if(null==this.unitItem)
				return;
			//workitem定义列属性
			XmlNodeList xmlColNodeList=this.xmldocSchema.SelectNodes("//xs:sequence//xs:element",this._xmlNsMglSchema);
			for(int i=0;i<xmlColNodeList.Count;i++)
			{
				XmlNode	xmlColSchema=xmlColNodeList[i];
				string	colName=xmlColSchema.Attributes["name"].Value;
				//自定义属性,如果自定义属性为空,忽略处理
				XmlNode	xmlNodeTable=xmlColSchema.SelectSingleNode("../../..");
				if(null==xmlNodeTable)		continue;
				string		strXPath=".//Item[@dataitem='"+xmlNodeTable.Attributes["name"].Value+"']";
				XmlNode		xmlItem=this.unitItem.UnitNode.SelectSingleNode(strXPath);
				if(null==xmlItem)
				{
					strXPath=".//AppendItem[@dataitem='"+xmlNodeTable.Attributes["name"].Value+"']";
					xmlItem=this.unitItem.UnitNode.SelectSingleNode(strXPath);
				}
				if(null==xmlItem)	continue;
				XmlNode		xmlCol=xmlItem.SelectSingleNode("Column[@name='"+colName+"']");
				for(int j=0;null!=xmlCol && j<xmlCol.Attributes.Count;j++)
				{
					string	localName=xmlCol.Attributes[j].LocalName;
					if(null!=xmlColSchema.Attributes[localName])
						continue;
					if(""==xmlCol.Attributes[j].Value)
						continue;
					XmlAttribute attr=xmlColSchema.OwnerDocument.CreateAttribute(localName);
					attr.Value=xmlCol.Attributes[j].Value;
					xmlColSchema.Attributes.Append(attr);
				}
				//字段列如果有显示格式,说明格式列的字段名称
				if(null!=xmlColSchema.Attributes["format"] && ""!=xmlColSchema.Attributes["format"].Value)
				{
					xmlColSchema.Attributes.Append(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
					xmlColSchema.Attributes["formatfld"].Value=colName+"_格式";
				}
				//字段列如果是字典列,并且text列和value列不同,使用格式显示列
				if(null!=xmlColSchema.Attributes["dataitem"] && ""!=xmlColSchema.Attributes["dataitem"].Value
					&& null!=xmlColSchema.Attributes["textcol"] && ""!=xmlColSchema.Attributes["textcol"].Value
					&& null!=xmlColSchema.Attributes["valuecol"] && ""!=xmlColSchema.Attributes["valuecol"].Value	
					&& xmlColSchema.Attributes["valuecol"].Value!=xmlColSchema.Attributes["textcol"].Value)
				{
					xmlColSchema.Attributes.SetNamedItem(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
					xmlColSchema.Attributes["formatfld"].Value=colName+"_显示";
				}
			}//for(int i=0;i<xmlColNodeList.Count;i++)
		}

	
		/// <summary>
		/// 根据数据集对应的数据文档,按照结构定义的格式,设置日期、数字、空数据的数据岛格式
		/// </summary>
		/// <param name="xmldoc">数据集的数据文档</param>
		/// <param name="ds">数据集</param>
		private	void	setFormatXmlLand(XmlDocument xmldoc,DataSet	ds)
		{
			//处理输出的字段格式
			for(int i=0;i<ds.Tables.Count;i++)
			{
				//处理日期:默认全部按照:yyyy-MM-dd格式输出
				for(int j=0;j<ds.Tables[i].Columns.Count;j++)
				{
					DataColumn	col=ds.Tables[i].Columns[j];
					if("DateTime"!=col.DataType.Name)
						continue;
                    string strXPath = "//xs:element[@name='" + ds.Tables[i].TableName
                                                + "']//xs:sequence//xs:element[@name='" + col.ColumnName + "' and @formatfld]";
                    XmlNode xmlColD = this.xmldocSchema.SelectSingleNode(strXPath, this._xmlNsMglSchema);
                    if (null != xmlColD) continue;
                    //该日期字段的所有行
					XmlNodeList		nodeDateList=xmldoc.SelectNodes("/*/"+ds.Tables[i].TableName+"/"+col.ColumnName);
					try
					{
						for(int k=0;k<nodeDateList.Count;k++)
							if(null!=nodeDateList[k].FirstChild && XmlNodeType.Text==nodeDateList[k].FirstChild.NodeType)
								nodeDateList[k].FirstChild.Value=DateTime.Parse(nodeDateList[k].FirstChild.Value).ToString("yyyy-MM-dd");
					}
					catch{}
				}
                //对所有行进行处理,让它包含所有字段,没有数据的字段增加空节点ds.Tables[i].Rows.Count
                for (int j = 0; j < 1; j++)
                {
                    if (xmldoc.DocumentElement == null) continue;
                    XmlNode xmlNodeRow = xmldoc.DocumentElement.ChildNodes[j];
                    if (xmlNodeRow==null) break;
                    for (int k = 0; k < ds.Tables[i].Columns.Count; k++)
                    {
                        if (null == ds.Tables[i].Rows[j][k] || DBNull.Value == ds.Tables[i].Rows[j][k])
                        {
                            DataColumn col = ds.Tables[i].Columns[k];
                            xmlNodeRow.AppendChild(xmldoc.CreateElement(col.ColumnName));
                        }
                    }
                }
                //对自定义格式的字段,增加列转换输出;对字典字段也增加一个格式字段输出
				//这个格式字段在formatfld属性说明
				string			strXPathCol="//xs:element[@name='"+ds.Tables[i].TableName+"']//xs:sequence//xs:element[@formatfld]";
				XmlNodeList		xmlColFormat=this.xmldocSchema.SelectNodes(strXPathCol,this._xmlNsMglSchema);
				for(int j=0;j<xmlColFormat.Count;j++)
				{
					string		strColName=xmlColFormat[j].Attributes["name"].Value;
					string		strFormat="";
					string		strDataItem="",strTextFld="",strValueFld="";
					if(null!=xmlColFormat[j].Attributes["format"] && ""!=xmlColFormat[j].Attributes["format"].Value)
						strFormat=xmlColFormat[j].Attributes["format"].Value;
					if(null!=xmlColFormat[j].Attributes["dataitem"] && ""!=xmlColFormat[j].Attributes["dataitem"].Value
						&& null!=xmlColFormat[j].Attributes["textcol"] && ""!=xmlColFormat[j].Attributes["textcol"].Value
						&& null!=xmlColFormat[j].Attributes["valuecol"] && ""!=xmlColFormat[j].Attributes["valuecol"].Value	)
					{
						strDataItem=xmlColFormat[j].Attributes["dataitem"].Value;
						strTextFld=xmlColFormat[j].Attributes["textcol"].Value;
						strValueFld=xmlColFormat[j].Attributes["valuecol"].Value;
					}
					string		strColFormatName=xmlColFormat[j].Attributes["formatfld"].Value;
					DataColumn	col=ds.Tables[i].Columns[strColName];

					XmlNodeList		xmlNodeList=xmldoc.SelectNodes("/*/"+ds.Tables[i].TableName+"/"+strColName);
					for(int k=0;k<xmlNodeList.Count;k++)
					{
						string		strValue="";
						if(null!=xmlNodeList[k].FirstChild && XmlNodeType.Text==xmlNodeList[k].FirstChild.NodeType)
							strValue=xmlNodeList[k].FirstChild.Value;
						try
						{
							if(""!=strFormat && ""!=strValue)
								switch(col.DataType.Name)
								{
									case "DateTime":
										strValue=Convert.ToDateTime(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int16":
										strValue=Convert.ToInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int32":
										strValue=Convert.ToInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int64":
										strValue=Convert.ToInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt16":
										strValue=Convert.ToUInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt32":
										strValue=Convert.ToUInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt64":
										strValue=Convert.ToUInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Decimal":
										strValue=Convert.ToDecimal(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Double":
										strValue=Convert.ToDouble(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									default:
										strValue=xmlNodeList[k].FirstChild.Value;
										break;
								}
							if(""!=strDataItem && this._dictds.Tables.Contains(strDataItem) 
								&& this._dictds.Tables[strDataItem].Columns.Contains(strTextFld))
							{
								DataRow[]		drs=this._dictds.Tables[strDataItem].Select(strValueFld+"='"+strValue+"'");
								if(drs.Length>0 && null!=drs[0][strTextFld])
									strValue=drs[0][strTextFld].ToString();
							}
						}catch(Exception ex){
							ExceptionManager.Publish(ex);
						}finally{
							//格式字段值加入文档节点
							try
							{
								XmlNode		xmlNodeNew=xmlNodeList[k].ParentNode.AppendChild(xmldoc.CreateElement(strColFormatName));
								if(""!=strValue && null!=xmlNodeNew)
									xmlNodeNew.AppendChild(xmldoc.CreateTextNode(strValue));
							}catch{}
						}//try-catch-finally
					}
				}//for(int j=0;j<xmlColFormat.Count;j++)
			}//for(int i=0;i<ds.Tables.Count;i++)
			
		}

        /// <summary>
        /// 对于需要字符宏替换的:分页参数,过滤查询参数,Chart图参数
        /// 参数的类型要声明为宏: type="macro";pt="M" 
        /// </summary>
        /// <param name="xmldoc">参数文档</param>
        /// <returns></returns>
        private string[] getStrParams(XmlDocument  xmldoc)
        {
            
            string[]    strParams={"","","","","","","","",""};
            NameObjectList macroParam = BuildParamList.BuildParamMacro(xmldoc, workitem.ItemName);
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
            if (null != this.workitem)
            {
                strParams[8] = this.workitem.InitFilter;
                if ("" != this.workitem.PageSize)
                    strParams[0] = this.workitem.PageSize;
            }
            if ("" == strParams[0])
                strParams[0] = "10";
            if ("" == strParams[1])
                strParams[1] = "0";
            if ("" == strParams[7])
                strParams[7] = strParams[0];
            
            return strParams;
        }

        #endregion

    }
}
