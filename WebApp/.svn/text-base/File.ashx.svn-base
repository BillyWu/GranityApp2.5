<%@ WebHandler Language="c#" Class="File_WebHandler" Debug="true" %>

using System;
using System.Web;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections.Generic;

using Estar.Common.Tools;

public class File_WebHandler : IHttpHandler
{    
    private const int UploadFileLimit = 3;//上传文件数量限制
	
    private string _msg = "上传成功！";//返回信息

    public void ProcessRequest(HttpContext context)
    {
        
        int iTotal = context.Request.Files.Count;
        string fn = "";
        if (iTotal == 0)
        {
            _msg = "没有数据";
        }
        else
        {
            int iCount = 0;
            List<string> files = new List<string>();
            for (int i = 0; i < iTotal; i++)
            {
                HttpPostedFile file = context.Request.Files[i];
                
                if (file.ContentLength > 0 || !string.IsNullOrEmpty(file.FileName))
                {
                    //保存文件
                    string mypath = DataAccRes.AppSettings("ImgFilePath");

                    fn = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    files.Add(fn);
                    string spath = System.Web.HttpContext.Current.Server.MapPath(mypath + "/" + fn);
                    file.SaveAs(spath);
                    //建立Thumb小文件
                    string fileNameExten = "";
                    fileNameExten = Path.GetExtension(spath).ToLower();
                    if (fileNameExten.EndsWith("jpg") || fileNameExten.EndsWith("jpeg") || fileNameExten.EndsWith("jpe")
                        || fileNameExten.EndsWith("gif") || fileNameExten.EndsWith("jfif") || fileNameExten.EndsWith("dib")
                        || fileNameExten.EndsWith("bmp") || fileNameExten.EndsWith("png") || fileNameExten.EndsWith("tif") || fileNameExten.EndsWith("tiff")
                        || fileNameExten.EndsWith("ico"))
                    {
                        try
                        {
                            System.Drawing.Image img = System.Drawing.Image.FromStream(file.InputStream, true);
                            int w = img.Width;
                            int h = img.Height;
                            double scale = Convert.ToDouble(w) / Convert.ToDouble(h);
                            if (scale > 1)    //宽度大于高度
                            {
                                if (img.Width > 160)
                                {
                                    w = 160;
                                    h = Convert.ToInt32(Convert.ToDouble(w) / scale);
                                }
                            }
                            else
                            {
                                //高度大于宽度
                                if (img.Height > 160)
                                {
                                    h = 160;
                                    w = Convert.ToInt32(Convert.ToDouble(h) * scale);
                                }
                            }
                            img = img.GetThumbnailImage(w, h, null, IntPtr.Zero);
                            string filename = Path.GetDirectoryName(spath) + "\\Thumb_" + Path.GetFileNameWithoutExtension(spath) + fileNameExten;
                            img.Save(filename);
                        }
                        catch { }
                    }
                    //这里可以根据实际设置其他限制
                    if (++iCount > UploadFileLimit)
                    {
                        _msg = "超过上传限制：" + UploadFileLimit;
                        break;
                    }
                }
            }
        }
        context.Response.Write("<script>window.parent.Finish('" + _msg + "','" + fn + "');</script>");
    }

    /// <summary>
    /// 修补汉字字符串中的单字节字符
    /// </summary>
    /// <param name="src"></param>
    /// <returns></returns>
    private string trHzChar(string src)
    {
        string s = "";
        string[] strs = new string[src.Length];
        for (int i = 0; i < strs.Length; i++)
        {
            strs[i] = src.Substring(i, 1);
            string schar = Regex.Match(strs[i], "([[\\u4e00-\\u9fa5|\\s](&nbsp;)?)*").Value;
            if (schar == "") strs[i] = strs[i] + " ";
            s = s + strs[i];
        }
        return s;
    }

    private string OnlyChinese(string hztext)     {

        return Regex.Replace(hztext, "[^\u4e00-\u9fa5]", "");     
    }
    
    private string OnlyEn(string hztext)     {
        string sfile = Regex.Replace(hztext, "([[\\u4e00-\\u9fa5|\\s](&nbsp;)?)*", "");
        if (sfile == "") sfile = "hm";
        return sfile;     }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}