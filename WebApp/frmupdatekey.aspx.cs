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
using Estar.Business.UserRight;
using System.Data.SqlClient;
using System.Configuration;

namespace Estar.WebApp
{
	/// <summary>
	/// frmupdatekey ��ժҪ˵����
	/// </summary>
	public partial class frmupdatekey : System.Web.UI.Page
	{
		protected System.Web.UI.WebControls.Button btCancel;

		private	User			_userRight;//�û�Ȩ��
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// �ڴ˴������û������Գ�ʼ��ҳ��
			if (Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('��δ������¼�����¼����ʹ��,лл��')");
				this.Response.Write("</script>");
				this.Response.Redirect("index.htm",true);
			}
            string str = this.Request.ServerVariables["SERVER_NAME"];

			this._userRight=new User(this.Session["userid"].ToString());
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

		protected void btnOK_Click(object sender, System.EventArgs e)
		{
//			this._userRight=new User(this.Session["userid"].ToString());
//			_userRight.ModifyPassword(this.txtoldKey.Text,this.txtnewKey1.Text);

			if(this.txtnewKey1.Value!=this.txtnewkey.Value){
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('������û�б�ȷ��,��������ȷ�����벻��������������룡')");
				this.Response.Write("</script>");
				return;
			}
			if(this.Session["userid"].ToString()=="") return;
            string  strPwd=this.txtnewkey.Value;
            if(strPwd.Length<6 || "abc123"==strPwd.ToLower() || "123abc"==strPwd.ToLower())
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('�����벻���㸴�Ӷ�Ҫ�����������룡')");
                this.Response.Write("</script>");
                return;
            }
            try
            {
                string[] strnum={"0","1","2","3","4","5","6","7","8","9"};
                int i=0;
                for(i=0;i<strnum.Length;i++)
                    if(strPwd.Contains(strnum[i]))
                        break;
                Int64 ilong = 0;
                if (10 > i)
                    ilong = Convert.ToInt64(strPwd);
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('�����벻���㸴�Ӷ�Ҫ�����������룡')");
                this.Response.Write("</script>");
                return;
            }catch{}
            if (!this._userRight.login(this.txtoldKey.Value))
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('�������������������룡')");
                this.Response.Write("</script>");
                return;
            }
            bool bModify = this._userRight.ModifyPassword(this.txtoldKey.Value, this.txtnewkey.Value);
			if(!bModify)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('�������޸��������������룡')");
				this.Response.Write("</script>");
			}else{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('�����޸ĳɹ���');");
                this.Response.Write("	usGetTopFrame().history.go(-2);			");


                this.Response.Write("	function usGetTopFrame()		");
                this.Response.Write("	{		");
                this.Response.Write("		var win=window;		");
                this.Response.Write("		while(win.parent)		");
                this.Response.Write("		{		");
                this.Response.Write("			if(win===win.parent) break;		");
                this.Response.Write("			win=win.parent;		");
                this.Response.Write("		}		");
                this.Response.Write("		return win;		");
                this.Response.Write("	}		");
                this.Response.Write("	</script>								");
			}
		}

		private void btnCancel_Click(object sender, System.EventArgs e)
		{
			this.Response.Write("	<script language=\"javascript\">		");
            this.Response.Write("	usGetTopFrame.history.back();			");		
			

			this.Response.Write("	function usGetTopFrame()		");
			this.Response.Write("	{		");
			this.Response.Write("		var win=window;		");
			this.Response.Write("		while(win.parent)		");
			this.Response.Write("		{		");
			this.Response.Write("			if(win===win.parent) break;		");
			this.Response.Write("			win=win.parent;		");
			this.Response.Write("		}		");
			this.Response.Write("		return win;		");
			this.Response.Write("	}		");
			this.Response.Write("	</script>								");
		}
	}
}
