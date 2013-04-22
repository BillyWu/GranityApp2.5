using System;
using System.IO;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;


namespace Estar.WebApp
{
	/// <summary>
	/// ��ܴ��ڴ��ݲ���,����ϵͳ����,��ȫ���ƵĲ��������޸�
    /// ϵͳ��������sessionֵ,����ϵͳ�������ش��ݲ����б���
	/// </summary>
    public partial class ParamList : System.Web.UI.Page
	{
        UnitItem unitItem = null;    //��Ԫ��Ŀ
		protected void Page_Load(object sender, System.EventArgs e)
		{
            //���鵱ǰϵͳ�������û�id�Ƿ���Ч
            if (null == this.Session["sysparam"] || null==this.Session["userid"])
                return;
			string		strWinType="";
            string      strAppendName = "";
			XmlDocument		xmldoc=new XmlDocument();
			WorkUnitType	worktype=WorkUnitType.OtherItem;
			string			strWorkUnit="";
            //UnitItem        unitItem = null;    //��Ԫ��Ŀ
			//��ȡ�û�����
			StreamReader streamreader=new StreamReader(this.Request.InputStream,Encoding.UTF8);
            string strxml = streamreader.ReadToEnd();
            if (string.IsNullOrEmpty(strxml))
                return;
            xmldoc.PreserveWhitespace = false;
            //ȡ��Ԫ���Ʋ���,������Ч
            try
            {
                xmldoc.LoadXml(strxml);
                strWorkUnit = BuildParamList.getValue(xmldoc, "UnitName");
                strWinType = BuildParamList.getValue(xmldoc, "WinType");
                strAppendName = BuildParamList.getValue(xmldoc, "AppendItem");
                if (string.IsNullOrEmpty(strWorkUnit))
                    return;
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), strWorkUnit);
                worktype = unitItem.UnitType;
            }
            catch (Exception ex)
            {
                ExceptionManager.Publish(ex);
                return;
            }

            //����ϵͳ����:�Զ���/��ʱϵͳ����ÿ�ζ����
            XmlDocument xmldocSys = new XmlDocument();
            xmldocSys.LoadXml(this.Session["sysparam"].ToString());
            XmlNode xnLDSys = xmldocSys.SelectSingleNode("/*/PL[@t='S']/L[@t='D']");
            XmlNodeList xnlist = xnLDSys.ParentNode.SelectNodes("L[@t='C' or @t='T']");
            for (int i = xnlist.Count - 1; i > -1; i--)
                xnlist[i].ParentNode.RemoveChild(xnlist[i]);
            //�µ�ϵͳ����
            XmlNode xnSystem = xmldoc.SelectSingleNode("/*/PL[@t='S']");
            if (null != xnSystem)
            {
                XmlNode xnL = xnSystem.SelectSingleNode("L[@t='D']");
                XmlNode xntemp = xmldocSys.CreateElement("Temp");
                xntemp = xmldocSys.DocumentElement.AppendChild(xntemp);
                foreach (XmlNode xnP in xnL.ChildNodes)
                {
                    string key = xnP.Attributes["n"].Value;
                    if (BuildParamList.IsSensitivity(key))
                        continue;
                    XmlNode xnPT = xnSystem.SelectSingleNode(string.Format("L[@t='C' or @t='T']/P[@n='{0}']", key));
                    if (null != xnPT) continue;
                    XmlNode xnSys = xnLDSys.SelectSingleNode("P[@n='" + key + "']");
                    if (null != xnSys)
                        xnSys.ParentNode.RemoveChild(xnSys);
                    xntemp.InnerXml = xnP.OuterXml;
                    xnLDSys.AppendChild(xntemp.FirstChild);
                }
                xntemp.ParentNode.RemoveChild(xntemp);
                //���Զ���/��ʱ�ֲ���������ϵͳ����
                xnlist = xnSystem.SelectNodes("L[@t='C' or @t='T']");
                for (int i = xnlist.Count - 1; i > -1; i--)
                    xnLDSys.ParentNode.AppendChild(xnlist[i]);
            }
            //ͨ��session����
            if(xnSystem!=null)
                xmldoc.DocumentElement.RemoveChild(xnSystem);
            this.Session["sysparam"] = xmldocSys.OuterXml;
            this.Session.Remove(BuildParamList.SessionNameTrans);
            //xmldoc.InnerXml=xmldoc.InnerXml.Replace("&#xD;&#xA;", "");
            this.Session[BuildParamList.SessionNameTrans] = xmldoc.OuterXml;
			//�����û���Ҫ��ת��URL;���ȸ��ݵ�Ԫ����ȷ��URL,�ٸ��ݴ�������ȷ��URL,
			string  ls_workurl=this.getUrlByWorkType(worktype);
            string  ls_winurl = this.getUrlByWinType(unitItem, strWinType, strAppendName);
			string	strURL=(string.Empty==ls_winurl)?ls_workurl:ls_winurl;
			

			this.Response.Write(leofun.Escape(strURL));
		}


		#region Web ������������ɵĴ���
		override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: �õ����� ASP.NET Web ���������������ġ�
			//
			InitializeComponent();
			base.OnInit(e);
            this.Load += new EventHandler(this.Page_Load);
        }
		
		/// <summary>
		/// �����֧������ķ��� - ��Ҫʹ�ô���༭���޸�
		/// �˷��������ݡ�
		/// </summary>
		private void InitializeComponent()
		{    

		}
		#endregion

		#region �ڲ�����

		/// <summary>
		/// ���ݹ�����Ԫ���ͷ��ض�Ӧ��URL
		/// </summary>
		/// <param name="workType">������Ԫ</param>
		/// <returns>�򿪹�����Ԫ�����ڵ�URL</returns>
        /// �����Զ���Html���ͣ����Ϊ�Զ��壬��ȡ��HTMLģ��·�����ļ�
		private string	getUrlByWorkType(WorkUnitType	workType)
		{
			string	ls_workurl="";
			switch(workType)
			{
                case WorkUnitType.SimpleBank:
                    ls_workurl = "wfSimple.aspx"; 
                    break;
                case WorkUnitType.SimpleBankLeft:
                    ls_workurl = "wfSimpMDTP.aspx"; 
                    break;
                case WorkUnitType.VmlChartTp:
                    ls_workurl = "wfVmlChart.aspx";
                    break;
				case WorkUnitType.ReportItem:
					break;
				case WorkUnitType.OtherItem:
					break;
				case WorkUnitType.Updatekey:
					ls_workurl="frmupdatekey.aspx";
					break;
				case WorkUnitType.HomePage:
					ls_workurl="frmstart.aspx";
					break;
				case WorkUnitType.NavPage:
					ls_workurl="frmnav.aspx";
					break;
				case WorkUnitType.VmlMapPage:
					ls_workurl="wfVMLTp.aspx";
					break;
			    //leo fixed
				//���������
				case WorkUnitType.SysItem:
					ls_workurl="frmXMLset.aspx";
					break;
				case WorkUnitType.SysOptions:
					ls_workurl="frmoptiSet.aspx";
					break;
					// Ȩ�޹��� - ���屾������λ��Ȩ�� 	
				case WorkUnitType.SysOptRight:
					ls_workurl="frmOptright.aspx";
					break;
					// ������֯���� 
				case WorkUnitType.SysOrganize:
					ls_workurl="frmorganize.aspx";
					break;
					// ����Ϊ������λ���������
				case WorkUnitType.SysAssign:
					ls_workurl="frmassign.aspx";
					break;
                case WorkUnitType.HtmlBankLeft:
                    ls_workurl = unitItem.FileEditTp;
                    break;
            }
			return ls_workurl;
		}


		/// <summary>
		/// ���ݴ������ͷ���URL;Ӧ���������ڵĸ��ӹ���
		/// </summary>
		/// <param name="winType">��������</param>
		/// <returns>�򿪹�����Ԫ���ӹ��ܴ��ڵ�URL</returns>
        private string getUrlByWinType(UnitItem unitItem, string winType, string strAppendName)
		{
			string	ls_workurl="";
			switch(winType.ToLower())
			{
					//��ǰ��Ԫ����ϸ����
				case "detail":
                    string strTp = unitItem.FileEditTp;
					if(null==strTp || string.Empty==strTp)
						break;
					else
						ls_workurl="wfIndepend.aspx";
					break;
					//��ǰ��Ԫ�ĸ���������
				case "appenditem":
                    AppendItem appendItem = unitItem.GetAppendItem(strAppendName);
                    //ȡ��appenditem��url,���ΪHTML,�򷵻�HTML·��
                    if (appendItem.HTMLURL == "")
                    {
                        switch (appendItem.FunType)
                        {
                            case AppendFunType.Browse:
                                ls_workurl = @"wfSimpAppend.aspx?";
                                break;
                            case AppendFunType.Import:
                                ls_workurl = @"wfSimpAppend.aspx?";
                                break;
                            case AppendFunType.Report:
                                break;
                            default:
                                ls_workurl = @appendItem.HTMLURL + "?";
                                break;
                        }
                    }
                    else
                    {
                        ls_workurl = @appendItem.HTMLURL+"?";
                    }
					ls_workurl +=appendItem.DialogHeight+","+appendItem.DialogWidth;
					break;
					//������������
				case "chart":
					ls_workurl="wfChartModal.aspx";
					break;
				case "print":
                    string prnmode = DataAccRes.AppSettings("prnmode");
                    if (prnmode!=null)
                    {
                        if (prnmode.ToLower() == "inline")
                            ls_workurl = "frmprint.aspx";
                        else
                            ls_workurl = "frmprint.aspx?100,200";
                    }
                    else
                        ls_workurl = "frmprint.aspx?100,200";
					break;
				//�����򿪵ĵ�Ԫ
				case "newwinitem":
                    ls_workurl = @"wfSimpAppend.aspx?";
					break;
				default:
					ls_workurl=string.Empty;break;
			}
			return ls_workurl;
		}


		#endregion
	}
}
