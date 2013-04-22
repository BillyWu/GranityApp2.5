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
	/// listbar 的摘要说明。
	/// </summary>
	public partial class listbar : System.Web.UI.Page
	{
		protected QueryDataRes _query;
        private string _idField = "ID";
        //树节点的父ID字段名称
        private string _pidField = "PID";
        //树节点的文本
        private string _txtField = "text";
        private string _nTag = "ntag";
        //树同一父节点的子节点排序字段
        private string _orderField = "";
	
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			if(Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
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
			//找到角色节点和单元节点
            //string strXPath = "//Node[contains(Tag,'@类型=单位') and contains(Tag,'@代码={0}')]"
            //    +"/Nodes/Node[contains(Tag,'@类型=角色') and contains(Tag,'@名称={1}')]/Nodes/Node";
            //strXPath=string.Format(strXPath,strDeptID.ToLower(),user.RoleName);

            if (user.DsDeptRight == null)
            {
                this.Response.Write("<script language=\"javascript\">alert(\"系统故障，请检查管理权限文件是否正确！\");parent.parent.location.href=\"default.htm\";</script>");
                return;
            }

			//用user.TabDeptRight生成树结构
            Xml CtrlXmlLand = new Xml();
            CtrlXmlLand.Document = new XmlDataDocument(user.DsDeptRight);
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml   version='1.0'   encoding='GB2312'?>");
            Response.Write(CtrlXmlLand.Document.InnerXml);
            //Response.End();   
		}
		
		#region Web 窗体设计器生成的代码
		override protected void OnInit(EventArgs e)
		{
			base.OnInit(e);
		}
		
		#endregion
	}
}
