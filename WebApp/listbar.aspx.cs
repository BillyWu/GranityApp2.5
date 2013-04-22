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
using System.Data.SqlClient;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using System.Configuration;
using Estar.Business.UserRight;
using System.Xml;
using ComponentArt.Web.UI;
namespace Estar.WebApp
{
	/// <summary>
	/// listbar ��ժҪ˵����
	/// </summary>
	public partial class listbar : System.Web.UI.Page
	{
		protected QueryDataRes _query;
        private string _idField = "ID";
        //���ڵ�ĸ�ID�ֶ�����
        private string _pidField = "PID";
        //���ڵ���ı�
        private string _txtField = "text";
        private string _nTag = "ntag";
        //��ͬһ���ڵ���ӽڵ������ֶ�
        private string _orderField = "";
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// �ڴ˴������û������Գ�ʼ��ҳ��
			if(Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('��δ������¼�����¼����ʹ��,лл��')");
				this.Response.Write("</script>");
				//this.Response.Redirect("default.aspx");
                this.Response.Redirect("index.htm");
			}
			if(this.IsPostBack)		return;
			createTreeMenu();
		}

		private void createTreeMenu()
		{
			User user=new User(Session["userid"].ToString());
			this.ViewState["strItemsGrp"]   = "";
			this.ViewState["navpage"]       = "";
			this.ViewState["startitem"]     = "";
            string strDeptID = "";
            if ("" != user.SubDeptCode)
                strDeptID = user.SubDeptCode;
            else if ("" != user.DeptmentCode)
                strDeptID = user.DeptmentCode;
            else if ("" != user.UnitCode)
                strDeptID = user.UnitCode;
            if ("" == strDeptID || "" == user.RoleName)
                return;
			//�ҵ���ɫ�ڵ�͵�Ԫ�ڵ�
            //string strXPath = "//Node[contains(Tag,'@����=��λ') and contains(Tag,'@����={0}')]"
            //    +"/Nodes/Node[contains(Tag,'@����=��ɫ') and contains(Tag,'@����={1}')]/Nodes/Node";
            //strXPath=string.Format(strXPath,strDeptID.ToLower(),user.RoleName);

            if (user.DsDeptRight == null)
            {
                this.Response.Write("<script language=\"javascript\">alert(\"ϵͳ���ϣ��������Ȩ���ļ��Ƿ���ȷ��\");parent.parent.location.href=\"default.htm\";</script>");
                return;
            }

			//��user.TabDeptRight�������ṹ
            Xml CtrlXmlLand = new Xml();
            CtrlXmlLand.Document = new XmlDataDocument(user.DsDeptRight);
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml   version='1.0'   encoding='GB2312'?>");
            Response.Write(CtrlXmlLand.Document.InnerXml);
            //Response.End();   
		}
		
		#region Web ������������ɵĴ���
		override protected void OnInit(EventArgs e)
		{
			base.OnInit(e);
		}
		
		#endregion
	}
}
