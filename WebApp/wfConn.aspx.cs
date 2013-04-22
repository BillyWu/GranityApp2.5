using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace Estar.WebApp
{
    /// <summary>
    /// 客户页面连接测试页面
    /// </summary>
    public partial class wfConn : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string strResult = "";
            if (null == this.Session["userid"])
            {
                strResult = leofun.setvaltag("", "成功", "false");
                strResult = leofun.setvaltag(strResult, "提示", "连接超时,请重新登录!");
                this.Response.Write(leofun.Escape(strResult));
                return;
            }else
                this.Response.Write(leofun.Escape(leofun.setvaltag("", "成功", "true")));

            WSBits bitsTrans = new WSBits();
            bitsTrans.TransFile();
            return;

        }
    }
}