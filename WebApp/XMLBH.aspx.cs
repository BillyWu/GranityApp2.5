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
	/// XMLBH 的摘要说明。
	/// </summary>
    public partial class XMLBH : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
			SqlConnection CN = new SqlConnection();
			try 
			{
				//初始化连接字符串
                string strCn = DataAccRes.DefaultDataConnInfo.Value;
				CN.ConnectionString=strCn;
				CN.Open();
				string strfile = this.Request.QueryString["file"];
                string strsql = "exec GenSn '" + strfile + "'";
                SqlDataAdapter adp = new SqlDataAdapter(strsql, CN);
                adp.MissingSchemaAction = MissingSchemaAction.AddWithKey;
                DataTable dt = new DataTable();
                adp.Fill(dt);
                string bh = dt.Rows[0]["bh"].ToString();
                if (CN.State == ConnectionState.Open) CN.Close();
                this.Response.Write(bh);
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
