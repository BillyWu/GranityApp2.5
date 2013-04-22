using System;
using System.IO;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Collections.Specialized;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using System.Xml;
using System.Text;
using System.Configuration;
using System.Data.SqlClient;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using Estar.DataAccess.SqlClientDataAccess;

namespace Estar.WebApp
{
	/// <summary>
	/// XMLdom 的摘要说明。
	/// </summary>
	public partial class XMLdom : System.Web.UI.Page
	{
		protected void Page_Load(object sender, System.EventArgs e)
		{
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("index.htm");
            }
			SqlConnection CN = new SqlConnection();
            string strsql = ""; string exectype = "";
            //try 
            //{
				//初始化连接字符串
                string strCn = DataAccRes.DefaultDataConnInfo.Value;
				CN.ConnectionString=strCn;
				CN.Open();

                XmlDocument xmldoc = new XmlDocument();
                //读取用户参数
                StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
                string strxml = streamreader.ReadToEnd();
                if (string.IsNullOrEmpty(strxml))
                    return;
                xmldoc.LoadXml(strxml);
                if(xmldoc==null) return;
                XmlNodeList cmnodes = xmldoc.SelectNodes("//all/command");
                XmlNodeList sqlnodes = xmldoc.SelectNodes("//all/sql");
                XmlNodeList prnnodes = xmldoc.SelectNodes("//all/print");
                XmlNodeList prnnames = xmldoc.SelectNodes("//all/printname");
                if (cmnodes == null || sqlnodes == null) return;
                strsql = sqlnodes[0].InnerText;
                string prncmd = "";
                string prnname = "";
                if (prnnodes != null && prnnodes.Count>0)
                    prncmd = prnnodes[0].InnerText;
                if (prnnames != null && prnnames.Count > 0)
                    prnname = prnnames[0].InnerText;
                exectype = cmnodes[0].InnerText;
                string item = "";
                if (exectype == "undefined") exectype = "";
                if (exectype.IndexOf("item.") > -1)
                {
                    item = exectype.Replace("item.", "");
                    if (Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.UnitHash.Contains(item))
                    {
                        Response.Clear();
                        Response.ContentType = "text/xml; charset=gb2312";
                        Response.Expires = -1;
                        XmlDataDocument outdoc = new XmlDataDocument();
                        outdoc.LoadXml(Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.UnitHash[item].ToString());
                        outdoc.Save(Response.OutputStream);
                        //Response.End();
                        return;
                    }
                }
                if (exectype == "cache")
                {
                    Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.IsCache = true;
                    Estar.Common.Tools.UnitItem.IsCache = true;
                    string xmlstr = "<table>ok</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                if (exectype == "nocache")
                {
                    Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.IsCache = false;
                    Estar.Common.Tools.UnitItem.IsCache = false;
                    string xmlstr = "<table>ok</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                if (exectype == "htmlfiles")
                {
                    string[] files = Directory.GetFiles(System.Web.HttpContext.Current.Request.MapPath("html"));
                    string strs = "";
                    for (int i = 0; i < files.Length; i++)
                    {
                        string s1 = files[i].ToLower();
                        FileInfo fileinfo = new FileInfo(s1);
                        strs = strs + "," + fileinfo.Name;
                    }
                    strs = strs.Substring(1, strs.Length - 1);
                    string xmlstr = "<table>"+strs+"</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                if (exectype == "prnfiles")
                {
                    string[] files = Directory.GetFiles(System.Web.HttpContext.Current.Request.MapPath("DataSource\\ExcelTemplate"));
                    string strs = "";
                    for (int i = 0; i < files.Length; i++)
                    {
                        string s1 = files[i].ToLower();
                        FileInfo fileinfo = new FileInfo(s1);
                        strs = strs + "," + fileinfo.Name;
                    }
                    strs = strs.Substring(1, strs.Length - 1);
                    string xmlstr = "<table>" + strs + "</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                if (exectype == "iconfiles")
                {
                    string[] files = Directory.GetFiles(System.Web.HttpContext.Current.Request.MapPath("html\\Images"));
                    string strs = "";
                    for (int i = 0; i < files.Length; i++)
                    {
                        string s1 = files[i].ToLower();
                        FileInfo fileinfo = new FileInfo(s1);
                        strs = strs + "," + fileinfo.Name;
                    }
                    strs = strs.Substring(1, strs.Length - 1);
                    string xmlstr = "<table>" + strs + "</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                if (exectype == "1")
                {
                    strsql = strsql.Replace("\r\n", " ");
                    SqlCommand command = new SqlCommand(strsql, CN);
                    command.ExecuteNonQuery();
                    if (CN.State == ConnectionState.Open) CN.Close();
                    string xmlstr = "<table>ok</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }

                if (exectype == "xml")
                {
                    strsql = sqlnodes[0].InnerXml;
                    SqlCommand command = new SqlCommand(strsql, CN);
                    command.ExecuteNonQuery();
                    if (CN.State == ConnectionState.Open) CN.Close();
                    string xmlstr = "<table>ok</table>";
                    Response.ContentType = "text/xml";
                    Response.Expires = -1;
                    Response.Clear();
                    Response.Write("<?xml version='1.0' encoding='GB2312'?>");
                    Response.Write(xmlstr);
                    //Response.End();
                    return;
                }
                DataSet ds = new DataSet();
                SqlDataAdapter adp;
                if (strsql.ToLower().IndexOf("select ") < 0 && strsql.ToLower().IndexOf("exec ") < 0 && strsql.ToLower().IndexOf("execute ") < 0)
                {
                    //按数据源方式
                    QueryDataRes query = new QueryDataRes();
                    NameObjectList paramlist = null;
                    query.FillDataSet(strsql, paramlist, ds);
                    if(ds.Tables!=null && ds.Tables.Count>0)
                        ds.Tables[0].TableName = "table";
                }
                else
                {
                    adp = new SqlDataAdapter(strsql, CN);
                    adp.Fill(ds,"table");
                }
                if (prncmd == "prn")
                {
                    string SourceFile = prnname;
                    string TemplatePath = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
                    string SrcFile = TemplatePath + "\\" + SourceFile; //源文件名称
                    string DestFile = "print.XLS";
                    if (!File.Exists(SrcFile) == true)
                    {
                        if (!File.Exists(SrcFile) == true)
                        {
                            string strMSG = "打印模板 [" + SourceFile + "] 不存在，请联系系统管理员建立打印模板!";
                            this.Response.Write("<script language=\"javascript\">");
                            this.Response.Write("alert('" + strMSG + "')");
                            this.Response.Write("</script>");
                            return;
                        }
                    }
                    DataTable tab = ds.Tables[0];
                    XmlDocument xmlPrintDoc = csPrintData.makeprint(null, null, SourceFile, DestFile, tab, tab, 0, this.Session["userid"].ToString(), null);
                    //csPrintData.outXML2ExcelDown(xmlPrintDoc, SourceFile,null);
                    //csPrintData.outXML2Excel(xmlPrintDoc, SourceFile);
                    //System.Web.HttpContext.Current.Response.Write("<script language='javascript'>window.open('" + xmlPrintDoc + "')</script>");
                    return;
                }
                string colnames = "";
                string datatypes = "";
                string datalens = "";
                for (int i = 0; i < ds.Tables[0].Columns.Count; i++)
                {
                    colnames = colnames + "," + ds.Tables[0].Columns[i].ColumnName;
                    datatypes = datatypes + "," + ds.Tables[0].Columns[i].DataType.ToString();
                    datalens = datalens + "," + ds.Tables[0].Columns[i].MaxLength.ToString();
                }
                string tablename = ds.Tables[0].TableName;

                colnames = colnames.Substring(1, colnames.Length - 1);
                datatypes = datatypes.Substring(1, datatypes.Length - 1);
                datalens = datalens.Substring(1, datalens.Length - 1);

                DataTable tbl = ds.Tables.Add("xstructs");
                DataColumn col0 = tbl.Columns.Add("name");
                DataColumn col1 = tbl.Columns.Add("datatype");
                DataColumn col2 = tbl.Columns.Add("len");
                DataRow row = ds.Tables["xstructs"].NewRow();
                row["name"] = colnames;
                row["datatype"] = datatypes.Replace("System.", "");
                row["len"] = datalens;
                ds.Tables["xstructs"].Rows.Add(row);
                Response.Clear();
                Response.ContentType = "text/xml; charset=gb2312";
                Response.Expires = -1;
                XmlDataDocument outdoc1 = new XmlDataDocument(ds);
                outdoc1.Save(Response.OutputStream);
                if (item != "" && Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.IsCache == true)
                {
                    Estar.DataAccess.SqlClientDataAccess.SqlQueryDAO.UnitHash.Add(item, outdoc1.InnerXml);
                }
                //Response.Write("<?xml   version='1.0'   encoding='GB2312'?>");
                //Response.Write(ds.GetXml().ToString());
                //Response.End();
            if (CN.State == ConnectionState.Open) CN.Close();

            //}
            //catch (Exception ex)
            //{
            //    if (CN.State == ConnectionState.Open) CN.Close();
            //    this.Response.Write("");
            //    NameValueCollection errInfo = new NameValueCollection();
            //    errInfo["数据源"] = strsql;
            //    errInfo["操作类型"] = exectype;
            //    ExceptionManager.Publish(ex, errInfo);
            //}
            //finally 
            //{
			}
        //}

		#region Web 窗体设计器生成的代码
		override protected void OnInit(EventArgs e)
		{
			//
			// CODEGEN: 该调用是 ASP.NET Web 窗体设计器所必需的。
			//
			InitializeComponent();
			base.OnInit(e);
		}
		
		/// <summary>
		/// 设计器支持所需的方法 - 不要使用代码编辑器修改
		/// 此方法的内容。
		/// </summary>
		private void InitializeComponent()
		{    

		}
		#endregion
	}
}

//SqlCommand.Parameters.add(name,value)

//sc.Parameters.Add(parameterName,sqlDbType,size)   
//  第一个是参数名,第二个是参数类型,第三个是长度   
//  这是对应的你的SQL语句里的参数如:   
//  SqlCommand   sc=new   SqlCommand("select   *   from   User   Where   UserID=@@UserID",conn)   
//  sc.Parameters.Add(@@UserID,SqlDbType.Int,4)   
//  sc.Parameters["@@UserID"].Value=1;   
      
//  第二种方式:   
//  SqlCommand   sc=new   SqlCommand("select   *   from   User   Where   UserID=@@UserID",conn)   
//  sc.Parameters.Add(@@UserID,1) 
