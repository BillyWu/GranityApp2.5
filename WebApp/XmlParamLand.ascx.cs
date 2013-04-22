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
    public partial class XmlParamLand : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        /// <summary>
        /// 读取参数数据岛
        /// </summary>
        public Xml CtrlXmlParam
        {
            get { return this.XmlParam; }
        }
    }

}