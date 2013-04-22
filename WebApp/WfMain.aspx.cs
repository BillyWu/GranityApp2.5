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
	/// WebForm1 ��ժҪ˵����
	/// </summary>
    public partial class WfMain : BasePage
	{
		protected QueryDataRes _query;
        private TemplateModule editTp;		//�༭ģ��
		
		protected void Page_Load(object sender, System.EventArgs e)
		{
			if (Session["userid"] == null)
			{
				this.Response.Write("<script language=\"javascript\">");
				this.Response.Write("alert('��δ������¼�����¼����ʹ��,лл��')");
				this.Response.Write("</script>");
				//this.Response.Redirect("default.aspx");
                this.Response.Redirect("index.htm");
				return;
			}
			if(this.IsPostBack)	return;
            User user = this.PgUserRight;

            if (user.DeptmentName != null && user.DeptmentName != "" && user.UserName != "ע��")
            {
                if (user.DeptSup != null && user.DeptSup != "")
                {
                    if (user.DeptSup != user.DeptmentName)
                        this.userinfo.InnerText = "��ӭ����" + user.DeptSup + "-" + user.DeptmentName + ":" + user.UserName;
                    else
                        this.userinfo.InnerText = "��ӭ����" + user.UnitName + "-" + user.DeptmentName + ":" + user.UserName;
                }
                else
                    this.userinfo.InnerText = "��ӭ����" + user.UnitName + ":" + user.UserName;
            }
            else
            {
                if (user.UserName == "ע��")
                    this.userinfo.InnerText = "��ӭ��ʹ��ϵͳע��,лл��";
                else
                    this.userinfo.InnerText = "��ӭ����" + user.DeptmentName +":"+user.UserName;
            }

            //return;
            //for (int i = 0; i < this.PgUserControlList.Count; i++)
            //{
            //    BaseControl ctrl = this.PgUserControlList[i];
            //    if (null == ctrl) continue;
            //    ctrl.CtrlDataBind();

            //}
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

        #region  �ĸ���Ҫ����
        /// <summary>
        /// ���״�����ʱ,��session�ж�ȡ����д��ҳ���ǩ;
        /// �ڻش�ʱ,�ӱ�ǩȡ������
        /// </summary>
        /// <param name="e">�����¼����ݵ� EventArgs ����</param>
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
            //�ҵ���ɫ�ڵ�͵�Ԫ�ڵ�
            string strXPath = "//Node[contains(Tag,'@����=��λ') and contains(Tag,'@����={0}')]"
                + "/Nodes/Node[contains(Tag,'@����=��ɫ') and contains(Tag,'@����={1}')]/.//Node[contains(Tag,'@����=����������')]";
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
        /// ��ʼ����̬�ؼ�
        /// </summary>
        /// <param name="e"></param>
        protected override void PgWfInit(EventArgs e)
        {
            return;
        }
        /// <summary>
        /// ���ɹ���Grid�Ĳ���Js����
        /// </summary>
        protected override void PgBuildJs()
        {
            string strScript = "<script language=javascript></script>";
            this.Response.Write(strScript);
        }


        #endregion
    
    }
}
