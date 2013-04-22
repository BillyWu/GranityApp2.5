using System;
using System.Collections;
using System.ComponentModel;
using System.Web.Configuration;
using System.IO;
using System.Text;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using Estar.Business.UserRight;

namespace Estar.WebApp
{
    public partial class frmprintc : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }
            string[] strsqls = (this.Request.QueryString["sql"] == null) ? null : this.Request.QueryString["sql"].Split(';');
            string prnname = this.Request.QueryString["prn"];
            string prntype = this.Request.QueryString["prntype"];
            string prnpms = this.Request.QueryString["pms"];
            string relation = this.Request.QueryString["relation"];
            NameObjectList paramlist = new NameObjectList();
            string[] parammacro = { "10", "0", "", "", "", "", "", "", "" };
            if (prnpms != null)
            {
                paramlist = createParam(prnpms);
                parammacro = createMacro(prnpms);
            }
            string[] prndatasrcs = null;
            if (this.Request.QueryString["datasrc"] != null)
                prndatasrcs = this.Request.QueryString["datasrc"].Split(';');
            if (prntype == null) prntype = "excel";
            if (prndatasrcs == null) prndatasrcs = new String[] { "table" };
            string strCn = DataAccRes.DefaultDataConnInfo.Value;
            DataSet ds = new DataSet();
            //初始化连接字符串
            if (strsqls != null && strsqls.Length > 0)
            {
                SqlConnection CN = new SqlConnection();
                try
                {
                    CN.ConnectionString = strCn;
                    CN.Open();
                    for (int i = 0; i < strsqls.Length; i++)
                    {
                        if (strsqls[i] == "") continue;
                        SqlDataAdapter adp = new SqlDataAdapter(strsqls[i], CN);
                        adp.Fill(ds, prndatasrcs[i]);
                    }
                    CN.Close();
                }
                catch (Exception ex)
                {
                    if (CN.State == ConnectionState.Open) CN.Close();
                    this.Response.Write("");
                    return;
                }
            }
            else if (null != prndatasrcs && prndatasrcs.Length > 0)
            {
                QueryDataRes query = null;
                for (int i = 0; i < prndatasrcs.Length; i++)
                {
                    if (string.IsNullOrEmpty(prndatasrcs[i]))
                        continue;
                    string[] src = prndatasrcs[i].Split(".".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    if (src.Length < 2)
                        continue;
                    query = new QueryDataRes(src[0]);
                    query.FillDataSet(src[1], paramlist, parammacro, ds);
                }
            }
            if (!ds.Tables.Contains("参数表"))
            {
                User user = new User(Convert.ToString(Session["userid"]));
                string[,] colmap = { { "公司名称", user.Company }, { "部门代码", user.DeptmentCode }, { "部门名称", user.DeptmentName }, 
                                     { "上级部门", user.DeptSup }, { "单位名称", user.UnitName }, { "用户名称", user.UserName } };
                for (int i = 0; i < colmap.GetLength(0); i++)
                {
                    if (null == paramlist[colmap[i, 0]])
                        paramlist[colmap[i, 0]] = colmap[i, 1];
                }
                DataTable tabm = new DataTable("参数表");
                foreach (string key in paramlist.AllKeys)
                    tabm.Columns.Add(key);
                DataRow drm = tabm.NewRow();
                foreach (string key in paramlist.AllKeys)
                    drm[key] = Convert.ToString(paramlist[key]);
                tabm.Rows.Add(drm);
                ds.Tables.Add(tabm);
            }
            //表关系：master.col~child.col;
            if (!string.IsNullOrEmpty(relation))
            {
                string[] relts = relation.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                for (int i = 0; i < relts.Length; i++)
                {
                    string[] rlt = relts[i].Split("~".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    if (rlt.Length < 2) continue;
                    string[] rltm = rlt[0].Split(".".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    string[] rltd = rlt[1].Split(".".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    if (!ds.Tables.Contains(rltm[0]) || !ds.Tables.Contains(rltd[0]))
                        continue;
                    if (!ds.Tables[rltm[0]].Columns.Contains(rltm[1]) || !ds.Tables[rltd[0]].Columns.Contains(rltd[1]))
                        continue;
                    DataTable tabm = ds.Tables[rltm[0]];
                    DataTable tabd = ds.Tables[rltd[0]];
                    tabm.ChildRelations.Add(tabm.Columns[rltm[1]], tabd.Columns[rltd[1]]);
                }
            }
            string SourceFile = prnname;
            string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
            string SrcFile = TemplatePath + SourceFile; //源文件名称
            string DestFile = "print.XLS";
            if (!string.IsNullOrEmpty(SourceFile) && !File.Exists(SrcFile))
            {
                string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('" + strMSG + "')");
                this.Response.Write("</script>");
                return;
            }
            switch (prntype)
            {
                case "word":
                    PrintWord printdoc = new PrintWord();
                    printdoc.TemplateFileName = SrcFile;
                    printdoc.DataSource = ds;
                    printdoc.DataBind();
                    printdoc.RemoveXmlLable();
                    csPrint.outXML2Word(printdoc.PrintXmlDoc, "print.doc");
                    break;
                case "excel":
                    //DataTable tab = (ds.Tables.Count == 0) ? null : ds.Tables[0];
                    //XmlDocument xmlPrintDoc = csPrintData.makeprint(null, null, SourceFile, DestFile, tab, tab, 0, this.Session["userid"].ToString(), paramlist);
                    if (string.IsNullOrEmpty(SourceFile) || !File.Exists(SrcFile))
                    {
                        SrcFile = "";
                        ds.Tables.Remove("参数表");
                    }
                    PrintExcel printexcel = new PrintExcel();
                    printexcel.DataSource = ds;
                    printexcel.TemplateFileName = SrcFile;
                    printexcel.DataBind();
                    csPrintData.outXML2Excel(printexcel.PrintXmlDoc, DestFile);
                    break;
                case "html":
                    break;
            }
        }
        private static Regex regex = new Regex(@"@([\u4E00-\u9FA5\s\w$]+)=", RegexOptions.Compiled);
        /// <summary>
        /// 根据tag标记创建参数
        /// </summary>
        /// <param name="tag">包含参数的tag标记</param>
        /// <returns>返回新建立的参数</returns>
        public static NameObjectList createParam(string tag)
        {
            MatchCollection matchs = regex.Matches(tag);
            NameObjectList ps = new NameObjectList();
            foreach (Match m in matchs)
            {
                string key = m.Groups[1].Value;
                if (key.StartsWith("#"))
                    continue;
                ps[key] = basefun.valtag(tag, key);
            }
            return ps;
        }
        /// <summary>
        /// 根据tag标记创建宏参数
        /// </summary>
        /// <param name="tag">包含参数的tag标记</param>
        /// <returns>返回宏参数</returns>
        private static string[] createMacro(string tag)
        {
            string[] strParams = { "10", "0", "", "", "", "", "", "", "" };
            MatchCollection matchs = regex.Matches(tag);
            foreach (Match m in matchs)
            {
                string name = m.Groups[1].Value;
                if (!name.StartsWith("$"))
                    continue;
                string key = name.Substring(1).ToLower();
                string val = basefun.valtag(tag, name);
                if ("firstrowold" == key)
                    strParams[1] = val;
                if ("firstrow" == key)
                    strParams[1] = val;
                if ("lastrow" == key || "recordcount" == key)
                    strParams[7] = val;
                if ("filterfast" == key)
                    strParams[2] = val;
                if ("filter" == key)
                    strParams[3] = val;
            }
            if ("" == strParams[7])
                strParams[7] = strParams[0];
            return strParams;
        }
    }
}
