using System;
using System.Collections;
using System.Diagnostics;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.Configuration;
using System.Web.Configuration;
using Estar.Common.Tools;
using System.Data.SqlClient;
namespace Estar.WebApp
{
	/// <summary>
	/// webtools 的摘要说明。
	/// </summary>
	public partial class webtools : System.Web.UI.Page
	{
        string exePath = "";
        protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }
            exePath = this.Request.PhysicalApplicationPath;                         // "D:\\hmcrm\\HMApp\\"
            string bakPath = this.Request.PhysicalApplicationPath + "backup\\";     // "D:\\hmcrm\\HMApp\backup"
            string userkey = this.Request.QueryString["userkey"];
            string dbsvr = this.Request.QueryString["dbsvr"];
            string dbname = this.Request.QueryString["dbname"];
            string dbuser = this.Request.QueryString["dbuser"];
            string dbpwd = this.Request.QueryString["dbpwd"];
            string abook = this.Request.QueryString["abook"];
            string abookval = this.Request.QueryString["abookval"];
            string dbpath = this.Request.QueryString["dbpath"];
            string xmlstr = "";
            if (!CreateDataBaseByBak(dbsvr, dbuser, dbpwd, dbname, dbpath, bakPath))
            {
                xmlstr = "<table><result>数据库建立失败！</result></table>";
                Response.ContentType = "text/xml";
                Response.Expires = -1;
                Response.Clear();
                Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                Response.Write(xmlstr);
                //Response.End();
                return;
            }
            //根据sendkey来返回web.config的配置信息
            if (userkey != null)
            {
                return;
            }

            
            Process.Start("iisreset");

            Configuration config = DataAccRes.DefaultConfiguration;
            System.IO.FileInfo FileInfo = new System.IO.FileInfo(config.FilePath);
            if (!FileInfo.Exists)
                return;
            KeyValueConfigurationCollection settings = config.AppSettings.Settings;
            AppSettingsSection appSettings = (AppSettingsSection)config.GetSection("appSettings");
            string[] appKeys = appSettings.Settings.AllKeys;
            DataConnSection connsection = config.GetSection("CustomSection") as DataConnSection;
            DataConnInfo conn = connsection.DataConnList[dbname];
            string dbtype = "SqlClient";
            string strcn = String.Format("server={0};user id={1};password={2};database={3};Min Pool Size=10;Connection Lifetime=240;Connection Timeout=120;"
            , dbsvr, dbuser, dbpwd);
            if (null == conn)
            {
                conn = new DataConnInfo(dbuser, dbtype, strcn);
                connsection.DataConnList.Add(conn);
            }
            else
            {
                conn.DbType = dbtype;
                conn.Value = strcn;
            }
            config.Save();
            SqlConnection CN = new SqlConnection();
            string strCn = DataAccRes.DefaultDataConnInfo.Value;
            CN.ConnectionString = strCn;
            CN.Open();
            if (CN.State == ConnectionState.Open) CN.Close();
            xmlstr = "<table><result>数据库建立成功！</result></table>";
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml version='1.0' encoding='GB2312'?>");
            Response.Write(xmlstr);
            //Response.End();

		}

        #region 从备份文件恢复数据库及数据库表
        /// <summary>
        /// 从备份文件恢复数据库及数据库表
        /// </summary>
        /// <param name="DBName">数据库名</param>
        /// <param name="bakfile">备份文件,一般放在hmapp\backup中</param>
        /// <param name="assemblyName">配件中数据库脚本资源的名称</param>
        /// <returns>创建成功返回真</returns>
        private bool CreateDataBaseByBak(string dbsvr,string dbuser,string dbpwd,string DBName, string DBPath, string bakPath)
        {
            string strConn = "server=" + dbsvr + ";user id=" + dbuser + ";password=" + dbpwd + ";database=master;Min Pool Size=10;Connection Lifetime=500;Connection Timeout=500;";
            SqlConnection myConn = new SqlConnection(strConn);
            DBPath = DBPath + "\\";
            string str
                    = "RESTORE DATABASE " + DBName + " FROM  "
                    + "DISK = N'" + bakPath + "hmerp.bak' "
                    + "WITH  FILE = 1,  MOVE N'hmerp' TO N'" + DBPath + DBName + ".mdf',  MOVE N'hmerp_log' TO N'" + DBPath + DBName + "_log.ldf',  "
                    + "NOUNLOAD, REPLACE, STATS = 10; ";
            SqlCommand myCommand = new SqlCommand(str, myConn);
            try
            {
                myConn.Open();
                myCommand.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                myConn.Close();
                return false;
            }
            finally
            {
                myConn.Close();
            }
            return true;
        }

        #endregion
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
