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
    /// �ͻ�ҳ�����Ӳ���ҳ��
    /// </summary>
    public partial class wfConn : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string strResult = "";
            if (null == this.Session["userid"])
            {
                strResult = leofun.setvaltag("", "�ɹ�", "false");
                strResult = leofun.setvaltag(strResult, "��ʾ", "���ӳ�ʱ,�����µ�¼!");
                this.Response.Write(leofun.Escape(strResult));
                return;
            }else
                this.Response.Write(leofun.Escape(leofun.setvaltag("", "�ɹ�", "true")));

            WSBits bitsTrans = new WSBits();
            bitsTrans.TransFile();
            return;

        }
    }
}