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
	/// XMLSQL 的摘要说明。
	/// </summary>
	public partial class XMLSQL : System.Web.UI.Page
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
                string exectype = this.Request.QueryString["exectype"];
                if (exectype == "exe")
                {
                    SqlCommand command = new SqlCommand(strsql, CN);
                    command.ExecuteNonQuery();
                    if (CN.State == ConnectionState.Open) CN.Close();
                    return;
                }

				SqlDataAdapter adp = new SqlDataAdapter(strsql,CN);
                adp.MissingSchemaAction = MissingSchemaAction.AddWithKey;
				DataSet ds=new DataSet();
                adp.Fill(ds);

                string colnames = "";
                string datatypes = "";
                string datalens = "";
                for (int i = 0; i < ds.Tables[0].Columns.Count; i++)
                {
                    colnames = colnames + "," + ds.Tables[0].Columns[i].ColumnName;
                    datatypes = datatypes + "," + ds.Tables[0].Columns[i].DataType.ToString();
                    datalens = datalens + "," + ds.Tables[0].Columns[i].MaxLength.ToString();
                }
                string tablename = ds.Tables[0].TableName;

                colnames = colnames.Substring(1, colnames.Length - 1);
                datatypes = datatypes.Substring(1, datatypes.Length - 1);
                datalens = datalens.Substring(1, datalens.Length - 1);

                DataTable tbl = ds.Tables.Add("xstructs");
                DataColumn col0 = tbl.Columns.Add("name");
                DataColumn col1 = tbl.Columns.Add("datatype");
                DataColumn col2 = tbl.Columns.Add("len");
                DataRow row = ds.Tables["xstructs"].NewRow();
                row["name"] = colnames;
                row["datatype"] = datatypes.Replace("System.", "");
                row["len"] = datalens;
                ds.Tables["xstructs"].Rows.Add(row);
                Response.ContentType = "text/xml";
                Response.Expires = -1;
                Response.Clear();
                Response.Write("<?xml   version='1.0'   encoding='GB2312'?>");
                Response.Write(ds.GetXml().ToString());
                Response.End();   

			}
			catch (Exception ex)
			{
                if (CN.State == ConnectionState.Open) CN.Close();
				this.Response.Write(""); 
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
