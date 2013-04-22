using System;
using System.Collections.Generic;
using System.Web;
using System.Timers;
using System.Net;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Collections.Specialized;
using System.Xml;
using System.Configuration;
using System.Data.SqlClient;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using System.Data;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using System.Threading;
public delegate void myDelegate();
public partial class xmlweather : System.Web.UI.Page
{
    public event myDelegate myEvent;
    protected void Page_Load(object sender, EventArgs e)
    {

        Thread thd = new Thread(new ThreadStart(doEvent));
        thd.IsBackground = true;
        thd.Start();  
    }
    private void doEvent()
    {
        while (true)
        {
            DateTime now = DateTime.Now;
            if (now.Hour == 1 || now.Hour == 4)
            {
                myapp();
            }
            Thread.Sleep(600000);
        }
    }
    private void myapp()
    {
        string strsql = "";
        SqlConnection CN = new SqlConnection();
        try
        {
            string strCn = DataAccRes.DefaultDataConnInfo.Value;
            CN.ConnectionString = strCn;
            if (CN.State == ConnectionState.Open) CN.Close();
            CN.Open();
            DataSet ds = new DataSet();
            SqlDataAdapter adp;
            strsql = "select distinct name,code from dizhi where isnull(ntype,'')!='省' and sz_code!=code";
            adp = new SqlDataAdapter(strsql, CN);
            adp.Fill(ds, "table");
            if (ds == null || ds.Tables.Count == 0) return;
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                string addr = ds.Tables[0].Rows[i]["name"].ToString();
                if (addr == "") continue;
                if (addr.Substring(addr.Length - 1, 1) == "市") addr = addr.Substring(0, addr.Length - 1);
                string tmp = GetWeather(addr);
                if (tmp == "") continue;
                strsql = "update dizhi set weather='{0}' where name='{1}' and isnull(ntype,'')!='省'";
                strsql = string.Format(strsql, tmp, ds.Tables[0].Rows[i]["name"].ToString());
                SqlCommand command = new SqlCommand(strsql, CN);
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            if (CN.State == ConnectionState.Open) CN.Close();
            NameValueCollection errInfo = new NameValueCollection();
            errInfo["数据源"] = strsql;
            ExceptionManager.Publish(ex, errInfo);
        }
        finally
        {
            if (CN.State == ConnectionState.Open) CN.Close();
        }
    }
    private static Regex regSpan = new Regex("<span.*?>(.*?)</span>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static Regex regLi = new Regex(@"<li>(.*?)</li>", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public string GetWeather(string city)
    {
        string addr = city;
        string weacherhtml = string.Empty;
        //转换输入参数的编码类型
        string mycity = System.Web.HttpUtility.UrlEncode(city, System.Text.UnicodeEncoding.GetEncoding("GB2312"));
        //初始化新的 WebRequest
        HttpWebRequest webrt = (HttpWebRequest)WebRequest.Create("http://php.weather.sina.com.cn/search.php?city=" + mycity);
        HttpWebResponse webrs = (HttpWebResponse)webrt.GetResponse();
        //从Internet资源返回数据流 
        Stream stream = webrs.GetResponseStream();
        //读取数据流
        StreamReader srm = new StreamReader(stream, System.Text.Encoding.Default);
        //读取数据
        weacherhtml = srm.ReadToEnd();
        srm.Close();
        stream.Close();
        webrs.Close();
        //针对不同的网站，请查看HTML源文件
        Regex r = new Regex(@"sent_to_vb\('" + addr.ToString() + @"','([^']+)'\)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
        if (!r.IsMatch(weacherhtml)) return "";
        DateTime dt = DateTime.Now;
        Match m = r.Match(weacherhtml);
        string[] tmpArr = m.Groups[1].Value.Split('，');
        return m.Groups[1].Value;
    }
    private string RemoveHTML(string v)
    {
        if (string.IsNullOrEmpty(v)) return "";
        return Regex.Replace(v, "<[^>]+>", "", RegexOptions.Compiled).Trim();
    }
    private string weatherImg(string strw)
    {
        string strimg = "duoyun_0.gif";
        switch(strw)
        {
            case "晴转多云": strimg = "qing_0.gif+duoyun_0.gif";
                break;
        }
        return strimg;
    }

}
