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
using Estar.Common.Tools;
using System.Configuration;

namespace Estar.WebApp
{
    /// <summary>
    /// XMLIP 的摘要说明。
    /// </summary>
    public partial class XMLSYSDB : System.Web.UI.Page
    {
        protected void Page_Load(object sender, System.EventArgs e)
        {
            string systemdb = DataAccRes.AppSettings("SystemDB");
            if (systemdb == "" || systemdb == null) systemdb = "hmsys";
            string xmlstr = "<table>" + systemdb+ "</table>";
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml version='1.0' encoding='GB2312'?>");
            Response.Write(xmlstr);
            //Response.End();
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
