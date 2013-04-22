using System;
using System.IO;
using System.Data;
using System.Text;
using System.Configuration;
using System.Collections.Specialized;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Estar.Business.DataManager;
using Estar.Common.Tools;

public partial class frDJBH : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        string      str=streamreader.ReadToEnd();
        NameObjectList tag = leofun.NameValueTag(str);
        QueryDataRes    query = QueryDataRes.CreateQuerySys();
        object objResult = query.ExecuteScalar(tag["¿‡–Õ"].ToString(), tag);
        if (null != objResult)
            this.Response.Write(leofun.Escape(objResult.ToString()));
        return;
    }
}
