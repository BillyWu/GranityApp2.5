using System;
using System.IO;
using System.Collections;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Estar.Common.Tools;

namespace Estar.WebApp
{
	/// <summary>
	/// wfPrintHTML 的摘要说明。
	/// </summary>
	public partial class wfPrintHTML : System.Web.UI.Page
	{
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			if(null==this.Request.Params["printfile"] || string.Empty==this.Request.Params["printfile"]
				|| ""==this.Request.Params["printfile"].Trim())
				return ;
            string strFileName = DataAccRes.AppSettings("DefaultFilePath") + this.Request.Params["printfile"];
			strFileName=this.Server.MapPath(strFileName);
			if(!File.Exists(strFileName))
				return;
			StreamReader	fread=File.OpenText(strFileName);
			string	strContext=fread.ReadToEnd();
			fread.Close();
			File.Delete(strFileName);
			this.ltPrintHtml.Text=strContext;
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
