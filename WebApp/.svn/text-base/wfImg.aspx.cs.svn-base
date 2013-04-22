using System;
using System.IO;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.Configuration;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Estar.Common.Tools;

namespace Estar.WebApp
{
	/// <summary>
	/// wfImg 的摘要说明。
	/// </summary>
	public partial class wfImg : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
            string filename = this.Request.Params["img"];
            string isOrg = this.Request.Params["org"];
            string stylesize = this.Request.Params["size"];
            if (null == filename || "" == filename.Trim())
                return;
            string loadtype = this.Request.Params["load"];
            string filepath = "";
            string filetype = "";
            if (loadtype == "1") 
            {
                filepath = this.Server.MapPath(filename);
                this.Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(filename));
                this.Response.WriteFile(filepath);
                return;
            }
            filepath = this.Server.MapPath(DataAccRes.AppSettings("ImgFilePath") + filename);
            string Thumb_filepath = this.Server.MapPath(DataAccRes.AppSettings("ImgFilePath") + "Thumb_" + filename);
            filetype = this.Request.Params["type"];
            if (null != filetype && "" != filetype.Trim())
            {
                string mypath = DataAccRes.AppSettings(filetype);
                if (mypath.IndexOf(":") > -1)
                    filepath = mypath + filename;
                else
                    filepath = this.Server.MapPath(DataAccRes.AppSettings(filetype) + filename);
                string fileExten = Path.GetExtension(filename).ToLower();

                if ("jpg" == fileExten || "gif" == fileExten || "bmp" == fileExten || "jpeg" == fileExten || "jpe" == fileExten || "jfif" == fileExten
                    || "tif" == fileExten || "png" == fileExten || "ico" == fileExten || "dib" == fileExten || "wmf" == fileExten || "emf" == fileExten)
                    fileExten = "";
                else
                    this.Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(filename));
            }
            if (File.Exists(Thumb_filepath) && isOrg!="1")
            {
                this.Response.WriteFile(Thumb_filepath);
            }
            else if (File.Exists(filepath))
            {
                this.Response.WriteFile(filepath);
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
