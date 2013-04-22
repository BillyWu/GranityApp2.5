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
using System.IO;
using System.Configuration;
using System.Data.SqlClient;
using Estar.Common.Tools;

namespace Estar.WebApp
{
	/// <summary>
    /// XMLFiles 的摘要说明。
    /// 方法一：string sPath = System.IO.Path.GetDirectoryName(Page.Request.PhysicalPath)
    /// 方法二：string sPath = System.Web.HttpContext.Current.Request.MapPath("images/")     //("images/")是当前虚拟目录下的任意目录
    /// 方法三：string sPath = Page.Server.MapPath("images/");    //("images/")是当前虚拟目录下的任意目录
	/// </summary>
    public partial class XMLPaths : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
            //@"D:\HMAPP\DataSource"
            //当前传入的为虚拟目录\\DataSource\\template返回的是文件
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }            
            string strdir =this.Request.QueryString["svrdir"];
            strdir = System.Web.HttpContext.Current.Request.MapPath(strdir);
            DirectoryInfo dirs = Directory.GetParent(strdir);
            
            //第一级目录：
            string dir0 = dirs.ToString();

            //第一级目录下的所有子目录
            string[] paths = Directory.GetDirectories(dir0);
            
            string strs = "";
            for (int i = 0; i < paths.Length; i++)
                strs = strs + paths[i] + ",";
            strs = strs.Substring(0, strs.Length - 1);
            this.Response.Write(strs); 
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
