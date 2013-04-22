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
	public partial class XmlDataLandEx : System.Web.UI.Page
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
            this.paramlist["LocalIP"] = this.Request.UserHostAddress;
            this.paramlist["Localhost"] = this.Request.UserHostName;
            if ("127.0.0.1" == this.Request.UserHostAddress)
            {
                this.paramlist["Localhost"] = Dns.GetHostName();
                IPAddress[] ips = Dns.GetHostAddresses(Dns.GetHostName());
                if (ips.Length > 0)
                    this.paramlist["LocalIP"] = ips[0].ToString();
            }
            if ("::1" == this.Request.UserHostAddress && this.Request.IsLocal)
            {
                this.paramlist["Localhost"] = Dns.GetHostName();
                IPAddress[] ipaddress = Dns.GetHostAddresses(Dns.GetHostName());
                if (ipaddress.Length > 0)
                    this.paramlist["LocalIP"] = ipaddress[ipaddress.Length - 1].ToString();
            }
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
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
				return;
			}
            string  workItemName="";
            if (null != paramlist["WorkItem"])
                workItemName=paramlist["WorkItem"].ToString();
            query = new QueryDataRes(paramlist["DataSrcFile"].ToString());
            if (paramlist["DataSrcFile"].ToString() == paramlist["DictSrcFile"].ToString())
                dictQuery = query;
            else
                dictQuery = new QueryDataRes(paramlist["DictSrcFile"].ToString());
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
            DataSet ds = new DataSet(this.paramlist["UnitName"].ToString());
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
            //NameObjectList lst = leofun.NameValueTag(this.paramlist["DictCol"].ToString());
            //for (int i = 0; i < lst.Count; i++)
            //{
            //    try
            //    {
            //        string strdict = lst.AllStringValues[i].Split('+')[0];
            //        dictQuery.FillDataSet(strdict, paramlist, this._dictds);         //this._dictds
            //    }
            //    catch { }
            //}
            XmlDataDocument xmldocData = new XmlDataDocument(ds);
            this.setFormatXmlLand(xmldocData, ds);
            this.Response.ContentType = "text/xml; charset=gb2312";
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

        private Boolean IsData(string tablename)
        {
            Boolean isdata = false;
            string itemdata = this.paramlist["DataItem"].ToString();
            string[] dataItemList = itemdata.Split(",".ToCharArray());
            for (int m = 0; m < dataItemList.Length; m++)
            {
                if (dataItemList[m] == tablename)
                {
                    isdata = true; break;
                }
            }
            return isdata;
        }
        /// <summary>
        /// 根据数据集对应的数据文档,按照结构定义的格式,设置日期、数字、空数据的数据岛格式
        /// </summary>
        /// <param name="xmldoc">数据集的数据文档</param>
        /// <param name="ds">数据集</param>
        private void setFormatXmlLand(XmlDocument xmldoc, DataSet ds)
        {
            ////处理输出的字段格式
            if (xmldoc.DocumentElement == null) return;
            for (int i = 0; i < ds.Tables.Count; i++)
            {
                if (!IsData(ds.Tables[i].TableName)) continue;
                //对所有行进行处理,让它包含所有字段,没有数据的字段增加空节点ds.Tables[i].Rows.Count
                for (int j = 0; j < 1; j++)
                {
                    XmlNode xmlNodeRow = xmldoc.DocumentElement.ChildNodes[j];
                    if (xmlNodeRow == null) break;
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
                NameObjectList xmlColFormat = leofun.NameValueTag(this.paramlist["FmtCol"].ToString());
                //NameObjectList dicts = leofun.NameValueTag(this.paramlist["DictCol"].ToString());
                for (int j = 0; j < xmlColFormat.Count; j++)
                {
                    string strColName = xmlColFormat.AllKeys[j];
                    string strDataItem = "", strTextFld = "", strValueFld = "";
                    string strFormat = xmlColFormat.AllStringValues[j].Split('+')[0];
                    string strColFormatName = xmlColFormat.AllStringValues[j].Split('+')[1];
                    //if (null != dicts[strColName] && "" != dicts[strColName].ToString())
                    //{
                    //    string[] dictitems = dicts[strColName].ToString().Split('+');
                    //    if (dictitems.Length == 3)
                    //    {
                    //        strDataItem = dicts[strColName].ToString().Split('+')[0];
                    //        strTextFld = dicts[strColName].ToString().Split('+')[1];
                    //        strValueFld = dicts[strColName].ToString().Split('+')[2];
                    //    }
                    //}
                    DataColumn col = ds.Tables[i].Columns[strColName];
                    XmlNodeList xmlNodeList = xmldoc.SelectNodes("/*/" + ds.Tables[i].TableName + "/" + strColName);
                    for (int k = 0; k < xmlNodeList.Count; k++)
                    {
                        string strValue = "";
                        if (null != xmlNodeList[k].FirstChild && XmlNodeType.Text == xmlNodeList[k].FirstChild.NodeType)
                            strValue = xmlNodeList[k].FirstChild.Value;
                        try
                        {
                            if ("" != strFormat && "" != strValue)
                                switch (col.DataType.Name)
                                {
                                    case "DateTime":
                                        strValue = Convert.ToDateTime(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "Int16":
                                        strValue = Convert.ToInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "Int32":
                                        strValue = Convert.ToInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "Int64":
                                        strValue = Convert.ToInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "UInt16":
                                        strValue = Convert.ToUInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "UInt32":
                                        strValue = Convert.ToUInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "UInt64":
                                        strValue = Convert.ToUInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "Decimal":
                                        strValue = Convert.ToDecimal(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    case "Double":
                                        strValue = Convert.ToDouble(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                        break;
                                    default:
                                        strValue = xmlNodeList[k].FirstChild.Value;
                                        break;
                                }
                            //if ("" != strDataItem && this._dictds.Tables.Contains(strDataItem)
                            //    && this._dictds.Tables[strDataItem].Columns.Contains(strTextFld))
                            //{
                            //    DataRow[] drs = this._dictds.Tables[strDataItem].Select(strValueFld + "='" + strValue + "'");
                            //    if (drs.Length > 0 && null != drs[0][strTextFld])
                            //        strValue = drs[0][strTextFld].ToString();
                            //}
                        }
                        catch (Exception ex)
                        {
                            ExceptionManager.Publish(ex);
                        }
                        finally
                        {
                            //格式字段值加入文档节点
                            try
                            {
                                XmlNode xmlNodeNew = xmlNodeList[k].ParentNode.AppendChild(xmldoc.CreateElement(strColFormatName));
                                if ("" != strValue && null != xmlNodeNew)
                                    xmlNodeNew.AppendChild(xmldoc.CreateTextNode(strValue));
                            }
                            catch { }
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
            NameObjectList macroParam = BuildParamList.BuildParamMacro(xmldoc, this.paramlist["WorkItem"].ToString());
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
            if(this.workitem!=null)
                strParams[8] = this.workitem.InitFilter;
            if ("" != this.paramlist["PageSize"].ToString())
                strParams[0] = this.paramlist["PageSize"].ToString();

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
