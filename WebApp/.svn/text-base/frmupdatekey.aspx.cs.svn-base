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
	/// frmupdatekey 的摘要说明。
	/// </summary>
	public partial class frmupdatekey : System.Web.UI.Page
	{
		protected System.Web.UI.WebControls.Button btCancel;

		private	User			_userRight;//用户权限
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			if (Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
				this.Response.Write("</script>");
				this.Response.Redirect("index.htm",true);
			}
            string str = this.Request.ServerVariables["SERVER_NAME"];

			this._userRight=new User(this.Session["userid"].ToString());
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

		protected void btnOK_Click(object sender, System.EventArgs e)
		{
//			this._userRight=new User(this.Session["userid"].ToString());
//			_userRight.ModifyPassword(this.txtoldKey.Text,this.txtnewKey1.Text);

			if(this.txtnewKey1.Value!=this.txtnewkey.Value){
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('新密码没有被确认,新密码与确认密码不相符，请重新输入！')");
				this.Response.Write("</script>");
				return;
			}
			if(this.Session["userid"].ToString()=="") return;
            string  strPwd=this.txtnewkey.Value;
            if(strPwd.Length<6 || "abc123"==strPwd.ToLower() || "123abc"==strPwd.ToLower())
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('新密码不满足复杂度要求，请重新输入！')");
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
                this.Response.Write("alert('新密码不满足复杂度要求，请重新输入！')");
                this.Response.Write("</script>");
                return;
            }catch{}
            if (!this._userRight.login(this.txtoldKey.Value))
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('旧密码有误，请重新输入！')");
                this.Response.Write("</script>");
                return;
            }
            bool bModify = this._userRight.ModifyPassword(this.txtoldKey.Value, this.txtnewkey.Value);
			if(!bModify)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('新密码修改有误，请重新输入！')");
				this.Response.Write("</script>");
			}else{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('密码修改成功！');");
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
