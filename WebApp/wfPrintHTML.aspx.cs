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
	/// wfPrintHTML ��ժҪ˵����
	/// </summary>
	public partial class wfPrintHTML : System.Web.UI.Page
	{
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// �ڴ˴������û������Գ�ʼ��ҳ��
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
