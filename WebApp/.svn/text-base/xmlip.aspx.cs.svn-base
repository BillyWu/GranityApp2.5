using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Collections.Specialized;
using System.Xml;
using System.Configuration;

namespace Estar.WebApp
{
    /// <summary>
    /// XMLIP 的摘要说明。
    /// </summary>
    public partial class XMLIP : System.Web.UI.Page
    {
        protected void Page_Load(object sender, System.EventArgs e)
        {
            string IP = HttpContext.Current.Request.UserHostAddress;
            string cmpname = HttpContext.Current.Request.UserHostName;
            System.Net.IPAddress ip = System.Net.IPAddress.Parse(Request.UserHostAddress);      //根据目标ip地址的获取ip对象
            System.Net.IPHostEntry ihe = System.Net.Dns.GetHostEntry(ip);                       //根据ip对象创建主机对象
            cmpname = ihe.HostName;
            string xmlstr = "<table>" + IP + "," + cmpname + "</table>";
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml version='1.0' encoding='GB2312'?>");
            Response.Write(xmlstr);
            Response.End();
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
    }
}
