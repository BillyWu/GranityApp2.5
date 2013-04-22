<%@ WebHandler Language="C#" Class="hdlDateNow" %>

using System;
using System.Web;

public class hdlDateNow : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        context.Response.Write(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}