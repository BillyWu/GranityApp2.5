using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using Estar.Common.Tools;

/// <summary>
/// JsonBuild JSON数据处理工具类
/// </summary>
public static class JsonBuild
{
    /// <summary>
    /// XML文档转换成JSON数据
    /// </summary>
    /// <param name="xmldoc">XML数据文件</param>
    /// <returns>返回JSON格式数据记录，以数组方式返回</returns>
    public static string ToJson(XmlDocument xmldoc)
    {
        if (null == xmldoc || null == xmldoc.DocumentElement)
            return "";
        XmlNode xn = xmldoc.SelectSingleNode("/././.");
        if (null == xn)
            return "[]";
        List<string> tables = new List<string>();
        XmlNodeList xnlist = xmldoc.SelectNodes("/./.");
        tables.Add(xnlist[0].Name);
        foreach (XmlNode xnnode in xnlist)
        {
            bool isexist = false;
            foreach (string t in tables)
            {
                isexist = xnnode.Name == t;
                if (isexist) break;
            }
            if (isexist) continue;
            tables.Add(xnnode.Name);
        }
        StringBuilder sb = new StringBuilder();
        string ft = "\"{0}\":\"{1}\"";
        if (tables.Count > 1)
            sb.Append("{");
        foreach (string t in tables)
        {
            if (tables.Count > 1)
            {
                if (t == tables[0])
                    sb.AppendFormat("\"{0}\":", t);
                else
                    sb.AppendFormat(",\"{0}\":", t);
            }
            XmlNodeList xnrowlist = xmldoc.SelectNodes("/./" + t);
            sb.Append("[");
            foreach (XmlNode xnrow in xnrowlist)
            {
                if (xnrowlist[0] == xnrow)
                    sb.Append("{");
                else
                    sb.Append(",{");
                if (null != xnrow.FirstChild)
                    sb.AppendFormat(ft, xnrow.FirstChild.Name, xnrow.FirstChild.InnerText.Replace("\"", "\\\""));
                for (int i = 1; i < xnrow.ChildNodes.Count; i++)
                    sb.AppendFormat("," + ft, xnrow.ChildNodes[i].Name, xnrow.ChildNodes[i].InnerText.Replace("\"", "\\\""));
                sb.Append("}");
            }
            sb.Append("]");
        }
        if (tables.Count > 1)
            sb.Append("}");
        return sb.ToString();
    }
    /// <summary>
    /// 从json格式数据解析为参数数组
    /// </summary>
    /// <param name="data">json格式数据</param>
    /// <returns>返回参数数组</returns>
    public static NameObjectList[] buildParamList(string data)
    {
        if (string.IsNullOrEmpty(data))
            return new NameObjectList[0];
        List<string> values = new List<string>();
        int pstart = data.IndexOf("{");
        int pend = data.Length;
        while (pstart > 0 && pstart < pend)
        {
            pend = data.IndexOf("}", pstart);
            if (pend < 0 || pend <= pstart)
                break;
            values.Add(data.Substring(pstart + 1, pend - pstart - 1));
            pstart = data.IndexOf("{", pend);
        }
        if(values.Count<1)
            return new NameObjectList[0];
        List<NameObjectList> pslist = new List<NameObjectList>();
        foreach (string psvalue in values)
        {
            string v = psvalue.Replace("\\\"", "&quot;");
            string[] vs = v.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            NameObjectList param = new NameObjectList();
            for (int i = 0; i < vs.Length; i++)
            {
                string[] p = vs[i].Split(":".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                string k = p[0];
                v = p.Length > 0 ? p[1] : "";
                if (k.StartsWith("\""))
                    k = k.Substring(1);
                if (k.EndsWith("\""))
                    k = k.Substring(0, k.Length - 1);
                if (string.IsNullOrEmpty(k))
                    continue;
                if (v.StartsWith("\""))
                    v = v.Substring(1);
                if (v.EndsWith("\""))
                    v = v.Substring(0, v.Length - 1);
                v = v.Replace("&quot;", "\"");
                param[k] = v;
            }
            if (param.Count > 0)
                pslist.Add(param);
        }
        return pslist.ToArray();
    }
}
