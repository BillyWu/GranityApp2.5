using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.IO;
using System.Text;
using Estar.Common.Tools;
using System.Configuration;
using System.Data.SqlClient;
using Estar.Business.UserRight;


public partial class xmldataset : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["userid"] == null)
        {
            this.Response.Write("<script language=\"javascript\">");
            this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
            this.Response.Write("</script>");
            this.Response.Redirect("index.htm");
        }
        string strcn = DataAccRes.DefaultDataConnInfo.Value;
        SqlConnection CN = new SqlConnection(strcn);
        XmlDocument xmldoc = new XmlDocument();
        //读取用户参数
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        xmldoc.LoadXml(streamreader.ReadToEnd());
        if (xmldoc == null) return;
        string strcmd = xmldoc.SelectSingleNode("//all/command").InnerText;
        string strdata = xmldoc.SelectSingleNode("//all/data").InnerText;
        string xmlstr = "";
        switch (strcmd)
        {
            case "pwd":
                User user = new User(this.Session["userid"].ToString());
                string oldpwd = basefun.valtag(strdata,"pwdold");
                if (this.Session["userkey"].ToString() != oldpwd)
                {
                    xmlstr = "<table><result>原密码不正确！</result></table>";
                    break;
                }
                string newpwd = basefun.valtag(strdata, "pwdnew");
                bool bModify = user.ModifyPassword(oldpwd, newpwd);
                if (!bModify)
                {
                    xmlstr = "<table><result>修改失败！</result></table>";
                }
                else
                {
                    xmlstr = "<table><result>修改成功！</result></table>";
                }
         
                break;
            case "querydb":
                string systemdb = DataAccRes.AppSettings("SystemDB");
                xmlstr = "<table><svr>" + CN.DataSource + "</svr><userdb>" + CN.Database + "</userdb><sysdb>" + systemdb + "</sysdb></table>";
                break;
            case "updatedb":
                WriteWebConfig(strdata);
                xmlstr = "<table><result>修改成功！</result></table>";
                break;
        }

        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.Clear();
        Response.Write("<?xml version='1.0' encoding='GB2312'?>");
        Response.Write(xmlstr);
        //Response.End();
    }

    private void WriteWebConfig(string str)
    {
        System.Configuration.Configuration cfg = DataAccRes.DefaultConfiguration;
        System.IO.FileInfo FileInfo = new System.IO.FileInfo(cfg.FilePath);
        if (!FileInfo.Exists)
            return;
        XmlDocument xmldoc = new XmlDocument();
        xmldoc.Load(FileInfo.FullName);
        string strcn = basefun.valtag(str, "userdb");
        XmlNode node = xmldoc.SelectSingleNode("//appSettings");
        XmlNode cnn = xmldoc.SelectSingleNode("//CustomSection//DataSource//add[@name='default']");
        cnn.Attributes.GetNamedItem("value").Value = strcn;

        string strsysdb = basefun.valtag(str, "sysdb");
        string key = "SystemDB";
        XmlElement addElem = (XmlElement)node.SelectSingleNode("//add[@key='" + key + "']");
        if (addElem != null)
        {
            addElem.Attributes.GetNamedItem("value").Value = strsysdb;
        }
        xmldoc.Save(FileInfo.FullName);
    }
}
