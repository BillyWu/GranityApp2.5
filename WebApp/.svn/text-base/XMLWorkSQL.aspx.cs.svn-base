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
using System.Data.SqlClient;
using Estar.Common.Tools;

namespace Estar.WebApp
{
	/// <summary>
	/// XMLESQL 的摘要说明。
	/// </summary>
    public partial class XMLWorkSQL : System.Web.UI.Page
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
			SqlConnection CN = new SqlConnection();
			try 
			{
				//初始化连接字符串
                string strCn = DataAccRes.DefaultDataConnInfo.Value;
				CN.ConnectionString=strCn;
				CN.Open();
				string strsql = this.Request.QueryString["strsql"];
                SqlCommand command = new SqlCommand(strsql, CN);
                command.ExecuteNonQuery();
                if (CN.State == ConnectionState.Open) CN.Close();
                this.Response.Write("ok");
			}
			catch (Exception ex)
			{
                if (CN.State == ConnectionState.Open) CN.Close();
				this.Response.Write("error"); 
			}
			finally 
			{
                if (CN.State == ConnectionState.Open) CN.Close();
			}
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
