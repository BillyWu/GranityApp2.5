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
    /// XMLFiles ��ժҪ˵����
    /// ����һ��string sPath = System.IO.Path.GetDirectoryName(Page.Request.PhysicalPath)
    /// ��������string sPath = System.Web.HttpContext.Current.Request.MapPath("images/")     //("images/")�ǵ�ǰ����Ŀ¼�µ�����Ŀ¼
    /// ��������string sPath = Page.Server.MapPath("images/");    //("images/")�ǵ�ǰ����Ŀ¼�µ�����Ŀ¼
	/// </summary>
    public partial class XMLFiles : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('��δ������¼�����¼����ʹ��,лл��')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }
            //@"D:\HMAPP\DataSource"
            //��ǰ�����Ϊ����Ŀ¼\\DataSource\\template���ص����ļ�
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
	}
}
