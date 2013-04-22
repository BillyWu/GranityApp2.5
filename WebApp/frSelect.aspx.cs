using System;
using System.IO;
using System.Data;
using System.Xml;
using System.Text;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Business.DataManager;

namespace Estar.WebApp
{
    public partial class frSelect : System.Web.UI.Page
    {

        XmlDocument xmldocSchema = new XmlDocument();
        UnitItem unitItem = null; WorkItem workitem = null;
        private XmlNamespaceManager _xmlNsMglSchema = null;

        protected void Page_Load(object sender, EventArgs e)
        {
            XmlDocument xmldoc = new XmlDocument();
            //读取用户参数
            StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
            try
            {
                xmldoc.LoadXml(streamreader.ReadToEnd());
            }
            catch { };
            string[] strParams = this.getStrParams(xmldoc);
            NameObjectList paramlist = BuildParamList.BuildParams(xmldoc);
            string unitName = BuildParamList.getValue(xmldoc, "UnitName");
            if (unitName == "") return;
            string workItemName = BuildParamList.getValue(xmldoc, "WorkItem");
            //得出workItemName对应的InitFilter=strParams[8]和PageSize=strParams[0]
            //for (int i = 0; i < unitItem.WorkItemList.Length; i++)
            //    if (workItemName == unitItem.WorkItemList[i].ItemName)
            //    {
            //        workitem = unitItem.WorkItemList[i];
            //        strParams[8] = unitItem.WorkItemList[i].InitFilter;
            //        if ("" != unitItem.WorkItemList[i].PageSize)
            //            strParams[0] = unitItem.WorkItemList[i].PageSize;
            //        break;
            //    }
            QueryDataRes query = new QueryDataRes(paramlist["DataSrcFile"].ToString());
            
            DataSet ds = new DataSet(unitName);
            ds.EnforceConstraints = false;
            string itemdata = paramlist["FilterData"].ToString();
            string[] dataItemList = itemdata.Split(",".ToCharArray());
            for (int i = 0; i < dataItemList.Length; i++)
            {
                if ("" == dataItemList[i]) continue;
                query.FillDataSet(dataItemList[i], paramlist, strParams, ds);
            }
            XmlDataDocument xmldocData = new XmlDataDocument(ds);
            this.Response.ContentType = "text/xml; charset=gb2312";
            xmldocData.Save(this.Response.Output);
        }

        /// <summary>
        /// 对于需要字符宏替换的:分页参数,过滤查询参数,Chart图参数
        /// 参数的类型要声明为宏: type="macro";
        /// </summary>
        /// <param name="xmldoc">参数文档</param>
        /// <returns></returns>
        private string[] getStrParams(XmlDocument xmldoc)
        {
            string[] strParams ={ "", "", "", "", "", "", "", "", "" };
            NameObjectList macroParam = BuildParamList.BuildParamMacro(xmldoc);
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
            if ( null!=this.workitem )
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

    }
}