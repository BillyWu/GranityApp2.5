using System;
using System.Collections;
using System.ComponentModel;
using System.Web.Configuration;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Business.UserRight;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;

namespace Estar.WebApp
{
	/// <summary>
	/// WebForm1 的摘要说明。
	/// </summary>
    public partial class WfMain : BasePage
	{
		protected QueryDataRes _query;
        private TemplateModule editTp;		//编辑模板
		
		protected void Page_Load(object sender, System.EventArgs e)
		{
			if (Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
				this.Response.Write("</script>");
				//this.Response.Redirect("default.aspx");
                this.Response.Redirect("index.htm");
				return;
			}
			if(this.IsPostBack)	return;
            User user = this.PgUserRight;

            if (user.DeptmentName != null && user.DeptmentName != "" && user.UserName != "注册")
            {
                if (user.DeptSup != null && user.DeptSup != "")
                {
                    if (user.DeptSup != user.DeptmentName)
                        this.userinfo.InnerText = "欢迎您，" + user.DeptSup + "-" + user.DeptmentName + ":" + user.UserName;
                    else
                        this.userinfo.InnerText = "欢迎您，" + user.UnitName + "-" + user.DeptmentName + ":" + user.UserName;
                }
                else
                    this.userinfo.InnerText = "欢迎您，" + user.UnitName + ":" + user.UserName;
            }
            else
            {
                if (user.UserName == "注册")
                    this.userinfo.InnerText = "欢迎您使用系统注册,谢谢！";
                else
                    this.userinfo.InnerText = "欢迎您：" + user.DeptmentName +":"+user.UserName;
            }

            //return;
            //for (int i = 0; i < this.PgUserControlList.Count; i++)
            //{
            //    BaseControl ctrl = this.PgUserControlList[i];
            //    if (null == ctrl) continue;
            //    ctrl.CtrlDataBind();

            //}
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

        #region  四个重要函数
        /// <summary>
        /// 在首次载入时,从session中读取参数写入页面标签;
        /// 在回传时,从标签取出参数
        /// </summary>
        /// <param name="e">包含事件数据的 EventArgs 对象。</param>
        protected override void PgInitRequestParams()
        {
            User    user = this.PgUserRight;
            this.Session.Remove("sysparam");
            this.Session.Remove(BuildParamList.SessionNameTrans);
            if (user.DsDeptRight==null) return;
            string strStartDate = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");
            string strEndDate = DateTime.Now.Date.ToString("yyyy-MM-dd");
            string strXML = "<D><PL t='S'><L t='D'>"
                            + "<P n='StartDate' v='{0}' t='d'/><P n='EndDate' v='{1}' t='d'/></L></PL></D>";
            strXML = string.Format(strXML, strStartDate, strEndDate);
            this.PgParamXmlDoc = new XmlDocument();
            this.PgParamXmlDoc.LoadXml(strXML);
            this.PgParamXmlDoc.DocumentElement.SetAttribute("id", this.xmlparam.UniqueID);
            this.PgParamXmlDoc.DocumentElement.SetAttribute("typexml", "Param");
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "UserAccounts", user.UserAccounts);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "UserSn", user.UserSerialNum);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "UserName", user.UserName);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "Company", user.Company);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "OPTUnitID", user.OPTUnitID);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "UnitCode", user.UnitCode);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DWName", user.UnitName);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DWSupName", user.UnitSup);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DeptSaleName", user.DeptSaleName);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DeptSupName", user.DeptSup);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DeptName", user.DeptmentName);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "DeptCode", user.DeptmentCode);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "Rights", user.Rights);
            string urlpath = this.Request.Url.ToString().Substring(0, this.Request.Url.ToString().LastIndexOf('/') + 1);
            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, ParamUseType.Data, "syspath", urlpath);

            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.System, "", ParamUseType.Data, "LimitDays", user.LimitDays.ToString(), DBTypeCommon.Int);
            this.Session["sysparam"] = this.PgParamXmlDoc.OuterXml;

            BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.Page, ParamUseType.Trans, "UnitName", "blank");
            this.xmlparam.Document = this.PgParamXmlDoc;
            string strDeptID = "";
            if ("" != user.SubDeptCode)
                strDeptID = user.SubDeptCode;
            else if ("" != user.DeptmentCode)
                strDeptID = user.DeptmentCode;
            else if ("" != user.UnitCode)
                strDeptID = user.UnitCode;
            if ("" == strDeptID || "" == user.RoleName)
                return;


            return;
            //找到角色节点和单元节点
            string strXPath = "//Node[contains(Tag,'@类型=单位') and contains(Tag,'@代码={0}')]"
                + "/Nodes/Node[contains(Tag,'@类型=角色') and contains(Tag,'@名称={1}')]/.//Node[contains(Tag,'@类型=基本操作集')]";
            strXPath = string.Format(strXPath, strDeptID.ToLower(), user.RoleName.ToLower());
            XmlNodeList xmlNodeList = user.XmlDocDeptRight.SelectNodes(strXPath);
            if (xmlNodeList.Count < 1)          return;
            XmlDocument xmldocWork = new XmlDocument();
            xmldocWork.Load(this.MapPath(DataAccRes.AppSettings("WorkConfig")));
            
            foreach(XmlNode xmlNode in xmlNodeList)
            {
                XmlNode xmlNodeTag = xmlNode.SelectSingleNode("Tag");
                string strname = leofun.valtag(xmlNodeTag.InnerText, "itemname");
                XmlNode xmlNodeUnit = xmldocWork.DocumentElement.SelectSingleNode("//UnitItem[@name='"+strname+"']");
                if (null == xmlNodeUnit || null == xmlNodeUnit.Attributes["templatetype"] || "main" != xmlNodeUnit.Attributes["templatetype"].Value.ToLower())
                    continue;
                BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.Page, ParamUseType.Trans, "UnitName", xmlNodeUnit.Attributes["name"].Value);
                break;
            }
        }

        /// <summary>
        /// 初始化动态控件
        /// </summary>
        /// <param name="e"></param>
        protected override void PgWfInit(EventArgs e)
        {
            return;
        }
        /// <summary>
        /// 生成关于Grid的操作Js代码
        /// </summary>
        protected override void PgBuildJs()
        {
            string strScript = "<script language=javascript></script>";
            this.Response.Write(strScript);
        }


        #endregion
    
    }
}
