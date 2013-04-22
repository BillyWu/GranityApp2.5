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
    public partial class XMLFiles : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }
            //@"D:\HMAPP\DataSource"
            //当前传入的为虚拟目录\\DataSource\\template返回的是文件
            string strdir =this.Request.QueryString["svrdir"];
            string strOp = this.Request.QueryString["type"];
            if (strOp == "del")
            {
                string path = System.Web.HttpContext.Current.Request.MapPath(strdir);
                if (File.Exists(path))
                {
                    File.Delete(path);
                    this.Response.Write("del");
                }
                else
                {
                    this.Response.Write("nofile");
                }
                return;
            }
            string[] files = Directory.GetFiles(System.Web.HttpContext.Current.Request.MapPath(strdir));
            string strs = "";
            for (int i = 0; i < files.Length; i++)
            {
                string s1 = files[i].ToLower();
                FileInfo fileinfo = new FileInfo(s1);
                    strs = strs + strdir+"/"+fileinfo.Name + ",";
            }
            //string spath = 
            
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
