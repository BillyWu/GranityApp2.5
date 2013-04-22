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
	/// 框架窗口传递参数,对于系统参数,安全限制的参数不能修改
    /// 系统参数更新session值,不是系统参数加载传递参数列表中
	/// </summary>
    public partial class ParamList : System.Web.UI.Page
	{
        UnitItem unitItem = null;    //单元项目
		protected void Page_Load(object sender, System.EventArgs e)
		{
            //检验当前系统参数及用户id是否有效
            if (null == this.Session["sysparam"] || null==this.Session["userid"])
                return;
			string		strWinType="";
            string      strAppendName = "";
			XmlDocument		xmldoc=new XmlDocument();
			WorkUnitType	worktype=WorkUnitType.OtherItem;
			string			strWorkUnit="";
            //UnitItem        unitItem = null;    //单元项目
			//读取用户参数
			StreamReader streamreader=new StreamReader(this.Request.InputStream,Encoding.UTF8);
            string strxml = streamreader.ReadToEnd();
            if (string.IsNullOrEmpty(strxml))
                return;
            xmldoc.PreserveWhitespace = false;
            //取单元名称参数,否则无效
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

            //更新系统参数:自定义/临时系统参数每次都清空
            XmlDocument xmldocSys = new XmlDocument();
            xmldocSys.LoadXml(this.Session["sysparam"].ToString());
            XmlNode xnLDSys = xmldocSys.SelectSingleNode("/*/PL[@t='S']/L[@t='D']");
            XmlNodeList xnlist = xnLDSys.ParentNode.SelectNodes("L[@t='C' or @t='T']");
            for (int i = xnlist.Count - 1; i > -1; i--)
                xnlist[i].ParentNode.RemoveChild(xnlist[i]);
            //新的系统参数
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
                //把自定义/临时局部参数加入系统参数
                xnlist = xnSystem.SelectNodes("L[@t='C' or @t='T']");
                for (int i = xnlist.Count - 1; i > -1; i--)
                    xnLDSys.ParentNode.AppendChild(xnlist[i]);
            }
            //通过session传递
            if(xnSystem!=null)
                xmldoc.DocumentElement.RemoveChild(xnSystem);
            this.Session["sysparam"] = xmldocSys.OuterXml;
            this.Session.Remove(BuildParamList.SessionNameTrans);
            //xmldoc.InnerXml=xmldoc.InnerXml.Replace("&#xD;&#xA;", "");
            this.Session[BuildParamList.SessionNameTrans] = xmldoc.OuterXml;
			//返回用户需要跳转的URL;首先根据单元类型确定URL,再根据窗口类型确定URL,
			string  ls_workurl=this.getUrlByWorkType(worktype);
            string  ls_winurl = this.getUrlByWinType(unitItem, strWinType, strAppendName);
			string	strURL=(string.Empty==ls_winurl)?ls_workurl:ls_winurl;
			

			this.Response.Write(leofun.Escape(strURL));
		}


		#region Web 窗体设计器生成的代码
		override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: 该调用是 ASP.NET Web 窗体设计器所必需的。
			//
			InitializeComponent();
			base.OnInit(e);
            this.Load += new EventHandler(this.Page_Load);
        }
		
		/// <summary>
		/// 设计器支持所需的方法 - 不要使用代码编辑器修改
		/// 此方法的内容。
		/// </summary>
		private void InitializeComponent()
		{    

		}
		#endregion

		#region 内部函数

		/// <summary>
		/// 根据工作单元类型返回对应的URL
		/// </summary>
		/// <param name="workType">工作单元</param>
		/// <returns>打开工作单元主窗口的URL</returns>
        /// 增加自定义Html类型，如果为自定义，则取出HTML模板路径及文件
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
				//操作集设计
				case WorkUnitType.SysItem:
					ls_workurl="frmXMLset.aspx";
					break;
				case WorkUnitType.SysOptions:
					ls_workurl="frmoptiSet.aspx";
					break;
					// 权限管理 - 定义本独立单位的权限 	
				case WorkUnitType.SysOptRight:
					ls_workurl="frmOptright.aspx";
					break;
					// 定义组织机构 
				case WorkUnitType.SysOrganize:
					ls_workurl="frmorganize.aspx";
					break;
					// 定义为独立单位分配操作集
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
		/// 根据窗口类型返回URL;应用于主窗口的附加功能
		/// </summary>
		/// <param name="winType">窗口类型</param>
		/// <returns>打开工作单元附加功能窗口的URL</returns>
        private string getUrlByWinType(UnitItem unitItem, string winType, string strAppendName)
		{
			string	ls_workurl="";
			switch(winType.ToLower())
			{
					//当前单元的明细内容
				case "detail":
                    string strTp = unitItem.FileEditTp;
					if(null==strTp || string.Empty==strTp)
						break;
					else
						ls_workurl="wfIndepend.aspx";
					break;
					//当前单元的附加项内容
				case "appenditem":
                    AppendItem appendItem = unitItem.GetAppendItem(strAppendName);
                    //取得appenditem的url,如果为HTML,则返回HTML路径
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
					//其他弹出窗口
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
				//单独打开的单元
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
