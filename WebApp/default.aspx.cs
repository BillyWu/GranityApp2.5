using System;
using System.Net;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Business.UserRight;

namespace Estar.WebApp
{
	/// <summary>
    /// Web首页:根据首页单元定制不同的首页,
    /// 首页必须有两个输入框:tbUserAccount,tbPassword
    /// 可选输入框:hlbModel:帐套选择, tbValidateCode:校验码
	/// </summary>
    public partial class Default : System.Web.UI.Page
	{
        /// <summary>
        /// 用户登录
        /// </summary>
        protected void Login()
        {
            string strModel = this.Request.Form["hlbModel"];
            //会话切换帐套
            if (!string.IsNullOrEmpty(strModel))
                this.Session["AppModel"] = strModel;
            //系统切换帐套
            if (!string.IsNullOrEmpty(strModel))
                DataAccRes.SwitchModelConfig(strModel);
            srvWeather srv = new srvWeather();
            /*
            string strMsg = this.validateCode();
            if ("" != strMsg)
            {
                this.Response.Write(strMsg);
                return;
            }
             */
            if(null!=this.Request.ServerVariables["http_referer"])
                if (!this.Request.ServerVariables["http_referer"].Contains(this.Request.ServerVariables["server_name"]))
                {
                    this.Response.Write("严禁外部提交数据!");
                    return;
                }
            HttpCookie cookieUser = this.Request.Cookies["userid"];
            HttpCookie cookieKey = this.Request.Cookies["erpkey"];
            HttpCookie cookieVali = this.Request.Cookies["vali"];
            string strUserAccounts = (cookieUser==null)?"":cookieUser.Value;
            string strPassword = (cookieKey == null) ? "" : cookieKey.Value;

            //string strUserAccounts = this.Request.QueryString["user"];
            //string strPassword = this.Request.QueryString["key"];

            //string strUserAccounts = this.Request.Form["tbUserAccount"];
            //string strPassword = this.Request.Form["tbPassword"];
            if (Request.Cookies["userid"] != null)
            {
                HttpCookie myCookie = new HttpCookie("userid");
                myCookie.Expires = DateTime.Now.AddDays(-1d);
                Response.Cookies.Add(myCookie);
                myCookie = new HttpCookie("erpkey");
                myCookie.Expires = DateTime.Now.AddDays(-1d);
                Response.Cookies.Add(myCookie);
            }
            string regBtn = "";
            if (this.Request.Form.AllKeys.Length == 5) regBtn = this.Request.Form.AllKeys[5];
            if (regBtn!=null && regBtn.IndexOf("btTest") > -1)
            {
                //设置一个缺省用户:名称:注册,帐号:register,密码:reg
                //给用户名和密码直接赋值
                strUserAccounts = "register";
                strPassword = "abc123";
            }

            Boolean blBad = false;
            User user = new User(strUserAccounts,true,ref blBad);
            if (blBad == true)
            {
                this.Response.Write("dberror");
                return;
            }
            if (strUserAccounts == "test")
            {
                this.Response.Redirect("testform.htm");
                return;
            }

            if ((strUserAccounts != "12345678" || !user.IfFirstLogin()) && user.login(strPassword))
            {
                if (!user.VisitOut && ("127.0.0.1" != this.Request.UserHostAddress && "::1" != this.Request.UserHostAddress))
                {
                    IPAddress[] ipAddressList = Dns.GetHostAddresses(Dns.GetHostName());
                    int i = 0;
                    for (; i < ipAddressList.Length; i++)
                        if (this.Request.UserHostAddress.Contains(ipAddressList[i].ToString().Substring(0, 8)))
                            break;
                    if (i >= ipAddressList.Length)
                    {
                        this.Response.Write("<script language=\"javascript\">alert(\"该用户不允许公网访问!\");</script>");
                        this.Response.Write("该用户不允许公网访问!");
                        return;
                    }
                }
                this.Session["userid"] = user.UserAccounts;
                this.Session["userkey"] = strPassword;
                if (strUserAccounts == "register") 
                    this.Response.Redirect("WfMain.aspx");
                if (DataAccRes.AppSettings("screentype") == "cs")
                    this.Response.Write("<script language=\"javascript\">window.opener=null;window.open('', '_self');window.close();window.open('wfmain.aspx','','height='+(690)+',width='+(1014)+',left=0,top=0,status=yes,toolbar=no,menubar=no,resizable=yes,center:yes')</script>");
                else
                    this.Response.Write("WfMain.aspx");
                    //this.Response.Redirect("WfMain.aspx");
            }
            else if (user.IfFirstLogin() && strUserAccounts == "12345678")
            {
                //如果是第一次使用本系统，则返回true,用admin,123登录系统
                this.Session["userid"] = "12345678";
                this.Response.Redirect("WfMain.aspx");
                if (DataAccRes.AppSettings("screentype") == "cs")
                    this.Response.Write("<script language=\"javascript\">window.opener=null;window.open('', '_self');window.close();window.open('wfmain.aspx','','height='+(screen.height-78)+',width='+(screen.width-10)+',left=0,top=0,status=yes,toolbar=no,menubar=no;')</script>");
                else
                    this.Response.Redirect("WfMain.aspx");
            }
            else
            {
                //this.Response.Write("error");
                this.Response.Write("没有此帐号或口令错误!");
            }
            
        }
        
        /// <summary>
        /// 检查校验码
        /// </summary>
        /// <returns>成功返回空字符,失败返回原因</returns>
        protected string validateCode()
        {
            //bool isRegionCode = false;
            //for (int i = 0; i < this.Request.Form.Count; i++)
            //{
            //    if ("tbValidateCode" != this.Request.Form.Keys[i])
            //        continue;
            //    isRegionCode = true;
            //    break;
            //}
            //if (!isRegionCode) return "";
            string strRegionCode = this.Request.QueryString["vali"]; ;// this.Request.Form["tbValidateCode"];
            if (null == this.Session["RegionCode"] || null == this.Session["RegionCodeDt"])
                return "校验码超时失效!";
            DateTime regionDt = Convert.ToDateTime(this.Session["RegionCodeDt"]);
            if (regionDt.Add(new TimeSpan(0, 5, 0)) < DateTime.Now)
                return "校验码超时失效!";
            if(strRegionCode!=this.Session["RegionCode"].ToString())
                return "校验码不匹配!";
            return "";
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            /*
            //for logging to file
            log4net.ILog logger = log4net.LogManager.GetLogger("File");

            //for emailing
            //log4net.ILog logger = log4net.LogManager.GetLogger("EmailLog");

            logger.Info("Starting page load");
            */

            Login();
        }
}
}
