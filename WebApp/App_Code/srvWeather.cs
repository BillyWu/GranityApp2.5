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

/// <summary>
///srvWeather 的摘要说明
/// </summary>
public class srvWeather
{
    private static Timer tmRefresh = new Timer();
    private static Regex regSpan = new Regex("<span.*?>(.*?)</span>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static Regex regLi = new Regex(@"<li>(.*?)</li>", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public srvWeather()
    {
    }
    /// <summary>
    /// 定时器是否在执行
    /// </summary>
    static bool isExecting = false;
    /// <summary>
    /// 定时获取,默认凌晨4点
    /// </summary>
    static int fixHour = 4;

    /// <summary>
    /// 静态构造函数初始化服务
    /// </summary>
    static srvWeather()
    {
        return;
        //定时半个小时
        long inv = 180000;
        try { fixHour = Convert.ToInt32(DataAccRes.AppSettings("timerweather")); }
        catch { }
        try { inv = Convert.ToInt64(DataAccRes.AppSettings("weathertimerInterval")); }
        catch { }
        tmRefresh.Interval = inv;
        tmRefresh.Elapsed += new ElapsedEventHandler(tmRefresh_Elapsed);
        tmRefresh.Enabled = true;
    }
    /// <summary>
    /// 服务定时触发执行
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    static void tmRefresh_Elapsed(object sender, ElapsedEventArgs e)
    {
        if (fixHour != DateTime.Now.Hour || isExecting)
            return;

        isExecting = true;
        //初始化连接字符串
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
            if (ds == null || ds.Tables.Count < 1)
            {
                isExecting = false;
                return;
            }
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                DataRow dr = ds.Tables[0].Rows[i];
                if (DBNull.Value == dr["name"])
                    continue;
                string city = Convert.ToString(dr["name"]);
                if (string.IsNullOrEmpty(city))
                    continue;
                string addr = city;
                if (addr.Substring(addr.Length - 1, 1) == "市")
                    addr = addr.Substring(0, addr.Length - 1);
                string tmp = GetWeather(addr);
                if (string.IsNullOrEmpty(tmp))
                    continue;
                strsql = "exec FE_天气预报 '{0}','{1}'";
                strsql = string.Format(strsql, tmp, city);
                SqlCommand command = new SqlCommand(strsql, CN);
                command.ExecuteNonQuery();
            }
        }
        catch (Exception ex)
        {
            NameValueCollection errInfo = new NameValueCollection();
            errInfo["数据源"] = strsql;
            try { ExceptionManager.Publish(ex, errInfo); }
            catch { }
        }
        finally
        {
            try
            {
                if (CN.State == ConnectionState.Open)
                    CN.Close();
            }
            catch { }
        }
        isExecting = false;
    }

    // <li>风向：北风</li>
    private static Regex dir = new Regex("<li>\\s*风向：([^<]+)</li>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    //<div class="box_c weather_date">
    private static Regex dsrx = new Regex("<div\\s+class=\"box_c\\s*weather_date\"\\s*>([\\s\\S]+?)</div>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static Regex tbrx = new Regex("<table\\s+class=\"cell\"[^>]*>([\\s\\S]+?)</table>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static Regex tdrx = new Regex("<td>([\\s\\S]+?)</td>", RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public static string GetWeather(string city)
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

    private static string RemoveHTML(string v)
    {
        if (string.IsNullOrEmpty(v)) return "";
        return Regex.Replace(v, "<[^>]+>", "", RegexOptions.Compiled).Trim();
    }

}
