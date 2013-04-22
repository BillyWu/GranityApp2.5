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
using Estar.Business.DataManager;
using Estar.Common.Tools;

public partial class xmlUptGridW : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string strResult = "";
        XmlDocument xmldoc = new XmlDocument();
        //读取用户参数
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        xmldoc.LoadXml(streamreader.ReadToEnd());
        XmlNamespaceManager xmlNsMgl = new XmlNamespaceManager(xmldoc.NameTable);
        XmlNode xmlRootEle = xmldoc.DocumentElement;
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
        XmlNodeList xmlColList = xmldoc.SelectNodes("//xs:element[@width and @name]", xmlNsMgl);
        if (xmlColList.Count < 1)
        {
            strResult = leofun.setvaltag("", "成功", "true");
            strResult += leofun.setvaltag(strResult, "提示", "保存成功!");
            this.Response.Write(leofun.Escape(strResult));
            return;
        }
        NameObjectList paramColWidth = new NameObjectList();
        paramColWidth["菜单名称"] = xmlRootEle.Attributes["UnitItem"].Value;
        paramColWidth["表格名"] = xmlRootEle.Attributes["ItemName"].Value;
        QueryDataRes querySys = QueryDataRes.CreateQuerySys();
        DataTable tabColWidth = null;
        //querySys.getTable("表格列宽度", paramColWidth);
        if (null == tabColWidth) return;
        for (int i = 0; i < xmlColList.Count; i++)
        {
            int iwidth = 0;
            try
            {
                iwidth = int.Parse(xmlColList[i].Attributes["width"].Value);
            }
            catch { continue; }
            string colname = xmlColList[i].Attributes["name"].Value;
            DataRow dr = null;
            DataRow[] drs = tabColWidth.Select("列名='" + colname + "'");
            if (drs.Length > 0)
                dr = drs[0];
            else
            {
                dr = tabColWidth.NewRow();
                dr["id"] = Guid.NewGuid();
                dr["菜单名称"] = paramColWidth["菜单名称"];
                dr["表格名"] = paramColWidth["表格名"];
                dr["列名"] = colname;
                tabColWidth.Rows.Add(dr);
            }
            dr["宽度"] = iwidth;
        }
        bool    bSucc=querySys.Update("表格列宽度", tabColWidth);
        if (true == bSucc)
        {
            strResult = leofun.setvaltag("", "成功", "true");
            strResult += leofun.setvaltag(strResult, "提示", "保存成功!");
            this.Response.Write(leofun.Escape(strResult));
        }else{
            strResult = leofun.setvaltag("", "成功", "false");
            strResult += leofun.setvaltag(strResult, "提示", "宽度保存失败,请登录后重试!");
            this.Response.Write(leofun.Escape(strResult));
        }
    }
}
