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
using Estar.Common.Tools;
using System.Diagnostics;
using System.ServiceProcess;


namespace Estar.WebApp
{
    /// <summary>
    /// XMLIP 的摘要说明。
    /// </summary>
    public partial class XMLIIS : System.Web.UI.Page
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
            ServiceController sc = new ServiceController("iisadmin");
            /*
             * 启动、回收、停止应用程序池

            DirectoryEntry appPool = new DirectoryEntry("IIS://localhost/W3SVC/AppPools");
            DirectoryEntry findPool = appPool.Children.Find(AppPoolName,"IIsApplicationPool");
            findPool.Invoke("Start",new object[] { }); // 启动
            appPool.CommitChanges();
            appPool.Close();



            DirectoryEntry appPool = new DirectoryEntry("IIS://localhost/W3SVC/AppPools");
            DirectoryEntry findPool = appPool.Children.Find(AppPoolName,"IIsApplicationPool");
            findPool.Invoke("Stop",new object[] { }); // 停止
            appPool.CommitChanges();
            appPool.Close();


            DirectoryEntry appPool = new DirectoryEntry("IIS://localhost/W3SVC/AppPools");
            DirectoryEntry findPool = appPool.Children.Find(AppPoolName,"IIsApplicationPool");
            findPool.Invoke("Recycle",new object[] { }); // 回收
            appPool.CommitChanges();
            appPool.Close();



            if (sc.Status == ServiceControllerStatus.Running)
            {
                sc.Stop();//停止
            }
            sc.Start();//启动
             */
            Process.Start("iisreset");//重启
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
