using System;
using System.IO;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using Estar.Business.DataManager;

public partial class wfImgValidate : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string      strRegionCode=CodeBuilder.GetRegionCode();
        string strRegionCodeDt = this.Request.QueryString["temp"];
        this.Session["RegionCode"] = strRegionCode;
        if (strRegionCodeDt == null)
            this.Session["RegionCodeDt"] = DateTime.Now;
        else
            this.Session["RegionCodeDt"] = DateTime.Now;
        Bitmap image = CodeBuilder.GenerateValidateImg(strRegionCode);
        if (null == image) return;
        
        MemoryStream ms = new MemoryStream();
        image.Save(ms, ImageFormat.Gif);
        Response.ClearContent(); //需要输出图象信息 要修改HTTP头 
        this.Response.ContentType = "image/Gif";
        Response.BinaryWrite(ms.ToArray());
        image.Dispose();
        //Response.End();
    }
}
