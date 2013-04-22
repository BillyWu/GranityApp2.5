using System;
using System.Collections;
using System.ComponentModel;
using System.Web.Configuration;
using System.Data;
using System.Xml;
using System.Drawing;
using System.IO;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Business.UserRight;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;
using Microsoft.ApplicationBlocks.ExceptionManagement;

public partial class sysxml : System.Web.UI.Page
{
    private WorkUnitType _worktype = WorkUnitType.SimpleBank;
    private string _ctrlAlertID = "";	//校验提示的控件
    private XmlNamespaceManager _xmlNsMglSchema = null;
    private XmlNode _attrNodeCtrl = null;
    public bool CtrlHiddenGrid;
    //数据访问实例
    private QueryDataRes _query;
    private QueryDataRes _dictquery;
    private QueryDataRes _sysquery;
    private string _sworkunit;
    private UnitItem _unititem;			//代替当前页面的WorkUnit
    private WorkItem[] _workitemlist;		//当前工作单元内的工作项目列表
    private User _userRight;			//用户权限

    private BaseControlCollection _ctrllist;
    private XmlDocument _pagePXml=new XmlDocument();        //页面参数XMLDocument

    private XmlDocument _printXmlDoc = null;		//打印用的xml文档

    private Button _btcmd = null;         //回传命令按钮;


    #region 十四个默认公共对象


    /// <summary>
    /// 读取或设置页面的工作单元类型
    /// </summary>
    public WorkUnitType WorkType
    {
        get { return this._worktype; }
        set { this._worktype = value; }
    }


    /// <summary>
    /// 读取或设置当前的数据查询组件
    /// </summary>
    public QueryDataRes PgQuery
    {
        get { return this._query; }
        set { this._query = value; }
    }

    /// <summary>
    /// 读取或设置字典查询组件
    /// </summary>
    public QueryDataRes PgDictQuery
    {
        get { return this._dictquery; }
        set { this._dictquery = value; }
    }

    /// <summary>
    /// 读取系统查询组件
    /// </summary>
    public QueryDataRes PgSysQuery
    {
        get
        {
            if (null == this._sysquery)
                this._sysquery = QueryDataRes.CreateQuerySys();
            return this._sysquery;
        }
    }

    /// <summary>
    /// 读取当前页内用户控件
    /// </summary>
    public BaseControlCollection PgUserControlList
    {
        get { return this._ctrllist; }
    }

    /// <summary>
    /// 读取或设置工作单元名称
    /// </summary>
    public string PgUnitName
    {
        get { return this._sworkunit; }
        set { this._sworkunit = value; }
    }

    /// <summary>
    /// 读取和设置当前单元项目
    /// </summary>
    public UnitItem PgUnitItem
    {
        get { return this._unititem; }
        set { this._unititem = value; }
    }

    /// <summary>
    /// 读取或设置当前页面参数文档
    /// </summary>
    public XmlDocument PgParamXmlDoc
    {
        get { return this._pagePXml; }
        set { this._pagePXml = value; }
    }

    /// <summary>
    /// 读取或设置当前页面需要打印的xml格式文档
    /// </summary>
    public XmlDocument PgPrintXmlDoc
    {
        get { return this._printXmlDoc; }
        set { this._printXmlDoc = value; }
    }

    /// <summary>
    /// 读取或设置包含的工作项目列表
    /// </summary>
    public WorkItem[] PgWorkItemList
    {
        get { return this._workitemlist; }
        set { this._workitemlist = value; }
    }
    /// <summary>
    /// 读取或设置当前的用户权限
    /// </summary>
    public User PgUserRight
    {
        get { return this._userRight; }
        set { this._userRight = value; }
    }
    /// <summary>
    /// 读取页面视图状态
    /// </summary>
    public StateBag ViewStates
    {
        get { return this.ViewState; }
    }

    /// <summary>
    /// 读取或设置页面命令按钮
    /// </summary>
    public Button PgBtCmd
    {
        get { return this._btcmd; }
        set { this._btcmd = value; }
    }



    #endregion

    private WorkItem _workItem = null;
    private string _xmllandID = "";
    static private string[] strEleNames ={ "UnitItem", "Item", "AppendItem", "Column", "CommandItem" };
    static private string[] strAttrNames =
            {"name,billtype,savetype,templatetype,workflow,confpro,tpath",
             "name,barstep,baroffsetx,baroffsety,relation,linkcol,linkcolm,columnkey,printitem,printtype,printname,dataitem,dataitempage,countdataitem,import,masteritem,rightcol,where,sort,tpid,manualrefresh,idfld, pidfld, txtfld, namefld, noexpand, selfid, typefld, orderfld, ntag, keyfid,valuefld",
             "name,barstep,baroffsetx,baroffsety,funtype,unitgroup,unitname,linkcol,",
             "name,barheight,barwidth,barcolor,bartitle,expright,",
             "name,funtype,"
			};

    #region 内部对象
    /// <summary>
    /// 控件内的Grid控件
    /// </summary>
    public Xml CtrlXmlLand
    {
        get { return this.xmlLandConf; }
    }

    /// <summary>
    /// 对应的工作项目
    /// </summary>
    public WorkItem workitem
    {
        get { return this._workItem; }
    }

    /// <summary>
    /// 读取或设置页面数据岛ID
    /// </summary>
    public string CtrlXmlID
    {
        get { return this._xmllandID; }
        set { this._xmllandID = value; }
    }

    #endregion
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["userid"] == null)
        {
            this.Response.Write("<script language=\"javascript\">");
            this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
            this.Response.Write("</script>");
            this.Response.Redirect("index.htm");
        }
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        string strxml = streamreader.ReadToEnd();
        if (!string.IsNullOrEmpty(strxml))
            this.PgParamXmlDoc.LoadXml(strxml);
        string strcn = DataAccRes.DefaultDataConnInfo.Value;
        SqlConnection CN = new SqlConnection(strcn);
        this.PgUnitName = this.Request.QueryString["unititem"];
        string mydataitem = this.Request.QueryString["dataitem"];
        string datafile = this.Request.QueryString["datafile"];
        string xmlstr = "";
        if (mydataitem != null)
        {
            this.PgQuery = new QueryDataRes(datafile);
            xmlstr = CtrlDataBind(mydataitem);
            Response.ContentType = "text/xml";
            Response.Expires = -1;
            Response.Clear();
            Response.Write("<?xml   version='1.0'   encoding='GB2312'?>");
            Response.Write(xmlstr);
            //Response.End();
            return;
        }

        //this.PgUnitName = BuildParamList.getValue(this.PgParamXmlDoc, "UnitName");
        if (this.PgUnitName == "") return;
        //更改成新模式
        this.PgUnitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), this.PgUnitName);
        if ("" == this.PgUnitItem.DataSrcFile || String.Empty == this.PgUnitItem.DataSrcFile)
            this.PgQuery = QueryDataRes.CreateQuerySys();
        else
            this.PgQuery = new QueryDataRes(this.PgUnitItem.DataSrcFile);
        if ("" == this.PgUnitItem.DictColSrcFile || String.Empty == this.PgUnitItem.DictColSrcFile)
            this.PgDictQuery = QueryDataRes.CreateQuerySys();
        else if (this.PgUnitItem.DictColSrcFile == this.PgUnitItem.DataSrcFile)
            this.PgDictQuery = this.PgQuery;
        else
            this.PgDictQuery = new QueryDataRes(this.PgUnitItem.DictColSrcFile);


        this.PgWorkItemList = this.PgUnitItem.WorkItemList;
        XmlDocument _xmldoc = CtrlConfBind();
        string strxmlConf = "";
        if(_xmldoc!=null)
            strxmlConf = _xmldoc.InnerXml;
        string strXmlParam = string.Format("<XML id=\"xmlparam\" typexml=\"Param\"><D><PL t=\"P\"><L t=\"Ts\"><P n=\"RecordCount\" v=\"\" t=\"s\" pt=\"M\"/>"
        + "<P n=\"Command\" v=\"TransParam\" t=\"s\"/><P n=\"UnitName\" v=\"{0}\" t=\"s\"/></L></PL></D></XML>", this.PgUnitName);
        string xmlStr = strXmlParam + strxmlConf;
        for (int i = 0; i < this.PgWorkItemList.Length; i++)
        {
            WorkItem workitem = this.PgWorkItemList[i];
            string workitemdrc = workitem.DataSrc;
            if (workitemdrc.IndexOf(":") > -1)
                workitemdrc = workitemdrc.Substring(workitemdrc.IndexOf(":")+1, workitemdrc.Length-workitemdrc.IndexOf(":")-1);

            xmlStr = xmlStr + CtrlDataBind(workitem);
            //string _strbtn = "<DIV id=\"etpTemplate_service_DivForm\" style=\"DISPLAY: none\">"
            //                + "<INPUT id=\"etpTemplate_service_hlbChanged\" type=\"hidden\" name=\"etpTemplate:service:hlbChanged\">"
            //                + "<INPUT id=\"etpTemplate_service_hlbWidth\" type=\"hidden\" name=\"etpTemplate:service:hlbWidth\">"
            //                + "<INPUT id=\"etpTemplate_service_hlbState\" type=\"hidden\" name=\"etpTemplate:service:hlbState\">"
            //                + "<INPUT id=\"etpTemplate_service_hlb_cmd\" type=\"hidden\" name=\"etpTemplate:service:hlb_cmd\"></DIV>";
            //_strbtn = _strbtn.Replace("service", workitemdrc + "Tab");
            //xmlStr = xmlStr + _strbtn;
        }

        //string _strinput = "<div style=\"display:none\" ><input name=\"hlb_cmd\" type=\"hidden\" id=\"hlb_cmd\" />"
        //                  + "<input type=\"submit\" name=\"bt_PostBack\" value=\"PostBack\" id=\"bt_PostBack\" style=\"height:1px;\" />"
        //                  + "<input name=\"hlbRequestParams\" type=\"hidden\" id=\"hlbRequestParams\" /></div>";
        //xmlStr = xmlStr + _strinput;
        string strsql = string.Format("execute dbo.updateSysParams '{0}','{1}'", this.PgUnitName, xmlStr);
        string err = "";
        Boolean blok = ExecuteNonQuery(strsql,ref err);
        xmlstr = "<table>模板保存成功！</table>";
        if(!blok)
            xmlstr = "<table>保存失败！</table>";
        Response.ContentType = "text/xml";
        Response.Expires = -1;
        Response.Clear();
        Response.Write("<?xml version='1.0' encoding='GB2312'?>");
        Response.Write(xmlstr);
        //Response.End();
    }

    public bool ExecuteNonQuery(string sql,ref string err)
    {
        bool flag = true;
        SqlConnection CN = new SqlConnection();
        string strCn = DataAccRes.DefaultDataConnInfo.Value;
        try
        {
            if (CN.State != ConnectionState.Open)
            {
                CN.ConnectionString = strCn;
                CN.Open();
            }
            SqlCommand command = new SqlCommand(sql, CN);
            command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            err = ex.ToString();
            if (CN.State == ConnectionState.Open) CN.Close();
            flag = false;
        }
        finally
        {
            if (CN.State == ConnectionState.Open) CN.Close();
        }
        return flag;
    }
    public string CtrlDataBind(WorkItem workitem)
    {
        this.ViewState["sendpage"] = "";
        NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        int iPageSize = 0, iRecordCount = 0;
        string workitemdrc = workitem.DataSrc;
        if (workitemdrc.IndexOf(":") > -1)
            workitemdrc = workitemdrc.Substring(workitemdrc.IndexOf(":")+1, workitemdrc.Length-workitemdrc.IndexOf(":")-1);
        //分页,汇总数据
        DataSet dsCount = new DataSet("汇总");
        dsCount.EnforceConstraints = false;
        if (null != workitem.CountDataSrc && string.Empty != workitem.CountDataSrc)
        {
            this.PgDictQuery.FillDataSet(workitem.CountDataSrc, paramlist, strParams, dsCount);
        }
        Xml CtrlXmlCount = new Xml();
        CtrlXmlCount.Document = new XmlDataDocument(dsCount);
        DataTable counttab = null;
        if (dsCount.Tables.Count > 0) counttab = dsCount.Tables[0];
        XmlDocument xmldocCount = CtrlXmlCount.Document;
        if (counttab != null)
        {
            if (null != workitem.PageSize && string.Empty != workitem.PageSize)
            {
                this.ViewState["PageSize" + workitemdrc] = workitem.PageSize;
                iPageSize = Convert.ToInt32(workitem.PageSize);
                if (counttab.Rows.Count == 0)
                {
                    this.ViewState["RecordCount" + workitemdrc] = null;
                    iRecordCount = 0;
                }
                else
                {
                    this.ViewState["RecordCount" + workitemdrc] = counttab.Rows[0]["记录数量"].ToString();
                    iRecordCount = Convert.ToInt32(counttab.Rows[0]["记录数量"]);
                }
                //考虑iRecordCount<=iPageSize,时,并且：this.ViewState["PageIndex" + workitem.DataSrc])>1，要刷新页面

                if (iPageSize > 0)
                {
                    if (this.ViewState["PageIndex" + workitemdrc] != null)
                    {
                        if (iRecordCount <= iPageSize && Convert.ToInt32(this.ViewState["PageIndex" + workitemdrc].ToString()) > 1)
                        {
                            this.ViewState["TotalPages" + workitemdrc] = 1;
                            this.ViewState["PageIndex" + workitemdrc] = 1;
                        }
                        else
                            this.ViewState["TotalPages" + workitemdrc] = (int)Math.Ceiling((double)iRecordCount / iPageSize);
                    }
                    else
                        this.ViewState["TotalPages" + workitemdrc] = (int)Math.Ceiling((double)iRecordCount / iPageSize);
                }
            }
        }
        else
            xmldocCount.LoadXml("<DataSet><DataTableCount/></DataSet>");
        if (xmldocCount.DocumentElement != null)
        {
            xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("id"));
            xmldocCount.DocumentElement.Attributes["id"].Value = workitemdrc + "Tab_Sum";
            xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("typexml"));
            xmldocCount.DocumentElement.Attributes["typexml"].Value = "Count";
            xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("itemname"));
            xmldocCount.DocumentElement.Attributes["itemname"].Value = workitem.ItemName;
        }
        
        //当前页数据
        DataSet ds = new DataSet("etpTemplate_" + workitemdrc + "Tab_xmlland");
        ds.EnforceConstraints = false;
        strParams = this.getStrParams();
        this.PgQuery.FillDataSet(workitem.DataSrc, paramlist, strParams, ds);
        DataTable drc = ds.Tables[workitem.DataSrc];
        if (drc == null) return "";

        //增加行光标列
        if (null != drc && !drc.Columns.Contains("RowNum"))
            drc.Columns.Add("RowNum", Type.GetType("System.Int32"));
        
        if (iPageSize < 1) iPageSize = 10;
        int iPageIndex = 1;
        if (null != this.ViewState["PageIndex" + workitemdrc])
            iPageIndex = Convert.ToInt32(this.ViewState["PageIndex" + workitemdrc]);
        for (int i = 0; null != drc && i < drc.Rows.Count; i++)
            drc.Rows[i]["RowNum"] = i + 1 + (iPageIndex - 1) * iPageSize;
        //如果是数字类型,值是0的,改为空的
        for (int i = 0; null != drc && i < drc.Columns.Count; i++)
        {
            DataColumn col = drc.Columns[i];
            if ("rownum" == col.ColumnName.ToLower()) continue;
            if ("Decimal" != col.DataType.Name && "Double" != col.DataType.Name && "Int16" != col.DataType.Name
                    && "Int32" != col.DataType.Name && "Int64" != col.DataType.Name && "Single" != col.DataType.Name
                     && "UInt16" != col.DataType.Name && "UInt32" != col.DataType.Name && "UInt64" != col.DataType.Name)
                continue;
            DataRow[] drs = drc.Select("["+col.ColumnName + "]=0");
            for (int j = 0; j < drs.Length; j++)
                drs[j][i] = DBNull.Value;
        }
        //生成数据文档
        this.CtrlXmlLand.Document = new XmlDataDocument(ds);
        XmlDocument CtrlDBXmlDoc = this.CtrlXmlLand.Document;
        XmlDocument xmldoc = this.CtrlXmlLand.Document;
        if (xmldoc.DocumentElement == null)
            xmldoc.AppendChild(xmldoc.CreateElement("etpTemplate_" + workitemdrc + "Tab_xmlland"));
        if (null == xmldoc.DocumentElement.Attributes["id"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
        if (null == xmldoc.DocumentElement.Attributes["itemname"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
        if (null == xmldoc.DocumentElement.Attributes["typexml"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
        xmldoc.DocumentElement.Attributes["id"].Value = workitemdrc + "Tab";
        xmldoc.DocumentElement.Attributes["itemname"].Value = workitem.ItemName;
        xmldoc.DocumentElement.Attributes["typexml"].Value = "Data";

        try
        {
            if (iRecordCount < drc.Rows.Count)
                iRecordCount = drc.Rows.Count;
        }
        catch
        {
            iRecordCount = 0;
        }
        //当前页码,行记录个数
        //在XmlCount数据岛增加TotalPage;PageIndex;PageSize,RecordCount数据
        XmlNode xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("TotalPage"));
        xmlNode.InnerText = (null == this.ViewState["TotalPages" + workitemdrc]) ? "1" : this.ViewState["TotalPages" + workitemdrc].ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("PageIndex"));
        xmlNode.InnerText = (null == this.ViewState["PageIndex" + workitemdrc]) ? "1" : this.ViewState["PageIndex" + workitemdrc].ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("PageSize"));
        xmlNode.InnerText = iPageSize.ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("RecordCount"));
        xmlNode.InnerText = iRecordCount.ToString();

        string _s = "";
        string xmlstr1 = "";
        XmlNode xmlcountNode = xmldocCount.SelectSingleNode("//DataSet");

        if (xmlcountNode == null)
        {
            xmlcountNode = xmldocCount.SelectSingleNode("//汇总");
            _s = (xmlcountNode == null) ? "" : xmlcountNode.InnerXml;
            xmlstr1 = string.Format("<XML id=\"{0}Tab_Sum\" typexml=\"Count\" itemname=\"{1}\"><汇总>{2}</汇总></XML>", workitemdrc, workitem.ItemName, _s);
        }
        else
        {
            _s = (xmlcountNode == null) ? "" : xmlcountNode.InnerXml;
            xmlstr1 = string.Format("<XML id=\"{0}Tab_Sum\" typexml=\"Count\" itemname=\"{1}\"><DataSet>{2}</DataSet></XML>", workitemdrc, workitem.ItemName, _s);
        }
        //删除区数据
        Xml CtrlXmlDelete = new Xml();
        CtrlXmlDelete.Document = new XmlDocument();
        XmlDocument xmldocDel = CtrlXmlDelete.Document;
        xmldocDel.AppendChild(xmldocDel.CreateElement(xmldoc.DocumentElement.LocalName));
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("id"));
        xmldocDel.DocumentElement.Attributes["id"].Value = workitemdrc + "Tab_Delete";
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("typexml"));
        xmldocDel.DocumentElement.Attributes["typexml"].Value = "Delete";
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("itemname"));
        xmldocDel.DocumentElement.Attributes["itemname"].Value = workitem.ItemName;


        string xmlstr2 = string.Format("<XML id=\"{0}Tab_Delete\" typexml=\"Delete\" itemname=\"{1}\"><etpTemplate_{2}Tab_xmlland></etpTemplate_{3}Tab_xmlland></XML>",
            workitemdrc, workitem.ItemName, workitemdrc, workitemdrc);

        //数据岛结构信息
        Xml CtrlXmlSchema = new Xml();
        CtrlXmlSchema.Document = new XmlDocument();
        CtrlXmlSchema.Document.LoadXml(ds.GetXmlSchema());
        XmlDocument CtrlDBSchema = CtrlXmlSchema.Document;
        this.setSchema(CtrlXmlSchema,workitem);
        
        //字典绑定
        Xml CtrlXmlDict = new Xml();
        DataSet CtrlDsDict = this.CtrlDataBindDict(workitem, ref CtrlXmlDict);
        
        string xmlstr3 = string.Format("<XML id=\"{0}Tab_dict\" typexml=\"Dict\" itemname=\"{1}\"></XML>",
            workitemdrc, workitem.ItemName);
        string xmlstr4 = string.Format("<XML id=\"{0}Tab\" typexml=\"Data\" itemname=\"{1}\"></XML>",
            workitemdrc, workitem.ItemName);
        //处理输出的字段格式
        XmlDocument XmlSchema = this.setFormatXmlLand(xmldoc, ds, CtrlXmlSchema, CtrlDsDict, CtrlXmlDict);

        string strXPath = "//xs:schema";
        string strschema = "<XML><xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:msdata=\"urn:schemas-microsoft-com:xml-msdata\">{0}</xs:schema></XML>";
        XmlDocument xmlLandSchema = new XmlDocument();
        xmlLandSchema.LoadXml(strschema);
        XmlNode _xmlschema = CtrlXmlSchema.Document.SelectSingleNode(strXPath, this._xmlNsMglSchema);
        string strdrc = (workitem.DataSrc).Replace(":", "_x003A_");
        _xmlschema.InnerXml = (_xmlschema.InnerXml).Replace(workitem.DataSrc,strdrc);
        int isep = 0;
        for (int i = 0; i < _xmlschema.Attributes.Count; i++)
        {
            if (_xmlschema.Attributes[i].Name.IndexOf("xmlns") > -1) continue;
            xmlLandSchema.DocumentElement.Attributes.Append(xmlLandSchema.CreateAttribute(_xmlschema.Attributes[i].Name));
            xmlLandSchema.DocumentElement.Attributes[isep].Value = _xmlschema.Attributes[i].Value;
            isep++;
        }


        strXPath = "//xs:element[@name='" + strdrc + "']//xs:sequence";
        _xmlschema = CtrlXmlSchema.Document.SelectSingleNode(strXPath, this._xmlNsMglSchema);
        string _ixml = _xmlschema.InnerXml.Replace("xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"", "");
        _ixml = _ixml.Replace("minOccurs=\"0\"","");
        string xmlstr5 = string.Format(xmlLandSchema.InnerXml, _ixml);
        /*
        if (this.CtrlHiddenGrid)
        {
            this.GridDiv.Style["display"] = "none";
            return;
        }
        //读取Grid模板
        this._xmltpdoc.Load(this.Server.MapPath(this._tpGridFile));
        //设定标题列
        this.setTitle();
        //设定明细列
        this.setDetail();
        //设定脚注列
        this.setFoot();
         */
        return xmlstr1 + xmlstr2 + xmlstr3 + xmlstr4 + xmlstr5;
    }

    /// <summary>
    /// 字典类型的数据绑定
    /// </summary>
    public DataSet CtrlDataBindDict(WorkItem workitem, ref Xml CtrlXmlDict)
    {
        NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        QueryDataRes dictQuery = this.PgDictQuery;
        DataSet ds = new DataSet(); ;
        //初始化字典列
        ds.EnforceConstraints = false;
        for (int j = 0; j < workitem.DictCol.Length; j++)
        {
            DictColumn dictcol = workitem.DictCol[j];
            //多次使用字典数据,只需加载一次字典
            //补充形式可能为 datasrc;paramitem:param
            //
            if (dictcol.DataSrc.Trim().Length > 0)
            {
                bool isContinue = false;
                for (int k = 0; k < j; k++)
                {
                    string dictsrc = workitem.DictCol[k].DataSrc;
                    /*
                    char[] sep ={ ';' };
                    string[] arrdictsrc = dictsrc.Split(sep);
                    string paramItem = "";
                    string param = "";
                    if (arrdictsrc.Length > 0)
                    {
                        dictsrc = arrdictsrc[0];
                        if(arrdictsrc.Length > 1)
                        {
                            char[] sep1 ={ ':' };
                            string[] arrParam = arrdictsrc[1].Split(sep1);
                            if (arrParam.Length > 0)
                            {
                                paramItem = arrParam[0];
                                if(arrParam.Length > 1)
                                    param = arrParam[1];
                            }
                        };
                    }
                    */
                    if (dictcol.DataSrc == dictsrc)
                    {
                        isContinue = true; break;
                    }
                }
                if (isContinue) continue;

                dictQuery.FillDataSet(dictcol.DataSrc, paramlist, strParams, ds);
            }
        }
        CtrlXmlDict.Document = new XmlDocument();
        XmlDocument xmldoc = CtrlXmlDict.Document;
        xmldoc.LoadXml(ds.GetXml());
        if (xmldoc.DocumentElement != null)
        {
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
            xmldoc.DocumentElement.Attributes["id"].Value = workitem.ItemName + "Tab_dict";
            xmldoc.DocumentElement.Attributes["typexml"].Value = "Dict";
            xmldoc.DocumentElement.Attributes["itemname"].Value = workitem.ItemName;
        }
        return ds;
    }

    /// <summary>
    /// 获取参数数组
    /// </summary>
    private string[] getStrParams()
    {
        string[] strParams = new string[] {"0","0","","","","","","0",""};
        return strParams;
    }


    public XmlDocument CtrlConfBind()
    {
        if (this.PgUnitItem == null) return null;
        //创建一个xmlnode
        string _xml = "<XML><UnitItem></UnitItem></XML>";
        XmlDocument _xmldoc = new XmlDocument();
        
        string strXml = "<UnitItem></UnitItem>";
        //            CreateXmlNode();
        if (this.PgUnitItem.UnitNode == null) return null;
        XmlNode xmlNode = this.PgUnitItem.UnitNode.CloneNode(true);
        this.CheckNode(xmlNode);
        this.CtrlXmlLand.Document = new XmlDocument();
        XmlDocument xmldoc = this.CtrlXmlLand.Document;
        xmldoc.LoadXml(xmlNode.OuterXml);
        _xmldoc.LoadXml(_xml);

        if (null == xmldoc.DocumentElement.Attributes["id"])
             xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
        if (null == xmldoc.DocumentElement.Attributes["typexml"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
        if (null == xmldoc.DocumentElement.Attributes["confpro"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("confpro"));
        xmldoc.DocumentElement.Attributes["id"].Value = ("" == this.CtrlXmlID) ? this.xmlLandConf.ClientID : this.CtrlXmlID;
        xmldoc.DocumentElement.Attributes["confpro"].Value = "";
        xmldoc.DocumentElement.Attributes["typexml"].Value = "ConfProperty";
        xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("tpath"));
        xmldoc.DocumentElement.Attributes["tpath"].Value = this.PgUnitItem.FileEditTp;
        xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("DataSrcFile"));
        xmldoc.DocumentElement.Attributes["DataSrcFile"].Value = this.PgUnitItem.DataSrcFile;
        xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("DictColSrcFile"));
        xmldoc.DocumentElement.Attributes["DictColSrcFile"].Value = this.PgUnitItem.DictColSrcFile;
        for (int i = 0; i < xmldoc.DocumentElement.Attributes.Count; i++)
        {
            _xmldoc.DocumentElement.Attributes.Append(_xmldoc.CreateAttribute(xmldoc.DocumentElement.Attributes[i].Name));
            if (xmldoc.DocumentElement.Attributes[i].Name == "id") 
                _xmldoc.DocumentElement.Attributes[i].Value = "xmlConf_" + xmldoc.DocumentElement.Attributes[i].Value;
            else
                _xmldoc.DocumentElement.Attributes[i].Value = xmldoc.DocumentElement.Attributes[i].Value;
        }

        _xmldoc.SelectSingleNode("//UnitItem").InnerXml = xmldoc.SelectSingleNode("//UnitItem").InnerXml;
        XmlNodeList items = _xmldoc.SelectNodes("//UnitItem/Item");
        for (int i = 0; i < items.Count; i++)
        {
            for (int j = items[i].ChildNodes.Count - 1; j > -1; j--)
                items[i].RemoveChild(items[i].ChildNodes[j]);
        }
        return _xmldoc;
    }
    /// <summary>
    /// 对单元的xml节点检查，去掉不需要展示到页面的元素和属性
    /// </summary>
    /// <param name="node">需要检查的Xml节点</param>
    private void CheckNode(XmlNode node)
    {
        if (XmlNodeType.Element != node.NodeType)
            return;
        bool isMove = true; int iAttr = 0;
        for (int i = 0; i < strEleNames.Length; i++)
        {
            if (node.LocalName.Equals(strEleNames[i]))
            {
                isMove = false; iAttr = i;
                break;
            }
        }
        //如果页面不需要这个元素,就移除该元素,如果页面不需要包含该属性就移除
        if (isMove)
        {
            node.ParentNode.RemoveChild(node);
            return;
        }
        else
        {
            //没有包含属性就删掉
            for (int i = node.Attributes.Count - 1; i > -1; i--)
                if (strAttrNames[iAttr].IndexOf(node.Attributes[i].LocalName.ToLower() + ",") < 0)
                    node.Attributes.RemoveAt(i);
            //递归处理子节点
            for (int i = node.ChildNodes.Count - 1; i > -1; i--)
                this.CheckNode(node.ChildNodes[i]);
        }
    }
		


    protected void PgInitRequestParams()
    {
    }

    /// <summary>
    /// 设置数据集的结构及定义属性
    /// 需要输出到客户端的项目属性,列属性;name,relation,linkcol,columnkey,printtype,pagesize,
    /// 系统属性:id,typexml,ctrlAlter,ctrlchanged,ctrlschema,ctrlstate,ctrlhlbcmd,ctrlbtcommand,catalog,class,itemname,;
    /// 用户自定义的属性不能与其相同
    /// cmd.Parameters[0].ParameterName
    /// </summary>
    private void setSchema(Xml CtrlXmlSchema,WorkItem workitem)
    {
        //数据岛结构信息
        if (null == CtrlXmlSchema.Document)
            return;
        string itemAttrs = "name,relation,linkcol,columnkey,printitem,printtype,printname,pagesize,manualrefresh,idfld, pidfld, txtfld, namefld, noexpand, selfid, typefld, orderfld, ntag, keyfid,valuefld";
        string ctrlAttrs = "name,relation,linkcol,columnkey,printitem,printtype,printname,pagesize,manualrefresh,idfld, pidfld, txtfld, namefld, noexpand, selfid, typefld, orderfld, ntag, keyfid,valuefld,"
                            + "id,typexml,ctrlAlter,ctrlchanged,ctrlschema,ctrlstate,ctrlhlbcmd,ctrlbtcommand,catalog,class,itemname,";

        XmlDocument xmldocSchema = CtrlXmlSchema.Document;
        string workitemdrc = workitem.DataSrc;
        if (workitemdrc.IndexOf(":") > -1)
            workitemdrc = workitemdrc.Substring(workitemdrc.IndexOf(":")+1, workitemdrc.Length-workitemdrc.IndexOf(":")-1);

        #region 控件本身使用属性
        if (null == xmldocSchema.DocumentElement.Attributes["id"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("id"));
        if (null == xmldocSchema.DocumentElement.Attributes["typexml"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("typexml"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlAlter"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlAlert"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlchanged"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlchanged"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlschema"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlschema"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlstate"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlstate"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlhlbcmd"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlhlbcmd"));
        if (null == xmldocSchema.DocumentElement.Attributes["ctrlbtcommand"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ctrlbtcommand"));
        xmldocSchema.DocumentElement.Attributes["id"].Value = workitemdrc + "Tab_Schema";
        xmldocSchema.DocumentElement.Attributes["typexml"].Value = "Schema";
        xmldocSchema.DocumentElement.Attributes["ctrlAlert"].Value = this._ctrlAlertID;
        xmldocSchema.DocumentElement.Attributes["ctrlchanged"].Value = "etpTemplate_" + workitemdrc + "Tab_hlbChanged";//this.hlbChanged.ClientID;
        xmldocSchema.DocumentElement.Attributes["ctrlschema"].Value = "etpTemplate_" + workitemdrc + "Tab_hlbWidth"; //etpTemplate_MasterTab_hlbWidth
        xmldocSchema.DocumentElement.Attributes["ctrlstate"].Value = "etpTemplate_" + workitemdrc + "Tab_hlbState";
        xmldocSchema.DocumentElement.Attributes["ctrlhlbcmd"].Value = "etpTemplate_" + workitemdrc + "Tab_hlb_cmd";
        xmldocSchema.DocumentElement.Attributes["ctrlbtcommand"].Value = "bt_PostBack";
        #endregion

        #region workitem定义列属性
        XmlNamespaceManager xmlNsMgl = new XmlNamespaceManager(xmldocSchema.NameTable);
        XmlNode xmlRootEle = xmldocSchema.DocumentElement;
        for (int i = 0; i < xmlRootEle.Attributes.Count; i++)
        {
            string strPrefix = xmlRootEle.Attributes[i].Prefix;
            string strLocalName = xmlRootEle.Attributes[i].LocalName;
            string strURI = xmlRootEle.Attributes[i].Value;
            if ("xmlns" == strLocalName)
                xmlNsMgl.AddNamespace(string.Empty, strURI);
            if ("xmlns" != strPrefix) continue;
            xmlNsMgl.AddNamespace(strLocalName, strURI);
        }

        this._xmlNsMglSchema = xmlNsMgl;
        //定义的项目属性,不需要输出的属性不输出
        XmlNode xmlNodeWorkItem = this.PgUnitItem.UnitNode.SelectSingleNode(".//Item[@name='" + workitem.ItemName + "']");
        for (int i = 0; i < xmlNodeWorkItem.Attributes.Count; i++)
        {
            string localName = xmlNodeWorkItem.Attributes[i].LocalName;
            if (null != xmldocSchema.DocumentElement.Attributes[localName])
                continue;
            if (itemAttrs.IndexOf(localName + ",") < 0)
                continue;
            XmlAttribute attr = xmldocSchema.CreateAttribute(localName);
            attr.Value = xmlNodeWorkItem.Attributes[i].Value;
            xmldocSchema.DocumentElement.Attributes.Append(attr);
        }
        #endregion
        /*
        //页面控件节点自定义属性;
        for (int i = 0; i < this._attrNodeCtrl.Attributes.Count; i++)
        {
            string strAttrName = this._attrNodeCtrl.Attributes[i].Name;
            if (ctrlAttrs.IndexOf(strAttrName + ",") >= 0)
                continue;
            XmlAttribute attrTempCtrl = xmlRootEle.Attributes[strAttrName];
            if (null != attrTempCtrl) continue;
            attrTempCtrl = xmlRootEle.Attributes.Append(xmldocSchema.CreateAttribute(strAttrName));
            attrTempCtrl.Value = this._attrNodeCtrl.Attributes[i].Value;
        }
        */
        #region  列规则属性
        //定义宽度
        NameObjectList paramColWidth = new NameObjectList();
        paramColWidth["菜单名称"] = this.PgUnitItem.UnitName;
        paramColWidth["表格名"] = workitem.ItemName;

        XmlNodeList xmlColNodeList = xmldocSchema.SelectNodes("//xs:sequence//xs:element", xmlNsMgl);
        for (int i = 0; i < xmlColNodeList.Count; i++)
        {
            XmlNode xmlColSchema = xmlColNodeList[i];
            string colName = xmlColSchema.Attributes["name"].Value;
            DataRow[] drs = new DataRow[0];
            //自定义属性,如果自定义属性为空,忽略处理
            XmlNode xmlCol = this.PgUnitItem.UnitNode.SelectSingleNode(".//Item[@name='" + workitem.ItemName + "']/Column[@name='" + colName + "']");
            for (int j = 0; null != xmlCol && j < xmlCol.Attributes.Count; j++)
            {
                string localName = xmlCol.Attributes[j].LocalName;
                if (null != xmlColSchema.Attributes[localName])
                    continue;
                if ("" == xmlCol.Attributes[j].Value)
                    continue;
                XmlAttribute attr = xmlColSchema.OwnerDocument.CreateAttribute(localName);
                attr.Value = xmlCol.Attributes[j].Value;
                xmlColSchema.Attributes.Append(attr);
            }
            if ("RowNum" == colName)
            {
                if (null == xmlColSchema.Attributes["visible"])
                    xmlColSchema.Attributes.SetNamedItem(xmlColSchema.OwnerDocument.CreateAttribute("visible"));
                xmlColSchema.Attributes["visible"].Value = "1";
            }
            //字段列如果有显示格式,说明格式列的字段名称
            if (null != xmlColSchema.Attributes["format"] && "" != xmlColSchema.Attributes["format"].Value)
            {
                xmlColSchema.Attributes.Append(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
                xmlColSchema.Attributes["formatfld"].Value = colName + "_格式";
            }
            //字段列如果是字典列,并且text列和value列不同,使用格式显示列
            //if (null != xmlColSchema.Attributes["dataitem"] && "" != xmlColSchema.Attributes["dataitem"].Value
            //    && null != xmlColSchema.Attributes["textcol"] && "" != xmlColSchema.Attributes["textcol"].Value
            //    && null != xmlColSchema.Attributes["valuecol"] && "" != xmlColSchema.Attributes["valuecol"].Value
            //    && xmlColSchema.Attributes["valuecol"].Value != xmlColSchema.Attributes["textcol"].Value)
            //{
            //    xmlColSchema.Attributes.SetNamedItem(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
            //    xmlColSchema.Attributes["formatfld"].Value = colName + "_显示";
            //}
        }//for(int i=0;i<xmlColNodeList.Count;i++)
        #endregion

    }

    /// <summary>
    /// 根据数据集对应的数据文档,按照结构定义的格式,设置日期、数字、空数据的数据岛格式
    /// </summary>
    /// <param name="xmldoc">数据集的数据文档</param>
    /// <param name="ds">数据集</param>
    private XmlDocument setFormatXmlLand(XmlDocument xmldoc, DataSet ds, Xml CtrlXmlSchema, DataSet CtrlDsDict, Xml CtrlXmlDict)
    {
        //处理输出的字段格式
        for (int i = 0; i < ds.Tables.Count; i++)
        {
            //处理日期:默认全部按照:yyyy-MM-dd格式输出
            for (int j = 0; j < ds.Tables[i].Columns.Count; j++)
            {
                //不是日期字段,定义显示格式的不做默认处理
                DataColumn col = ds.Tables[i].Columns[j];
                if ("DateTime" != col.DataType.Name)
                    continue;
                string strXPath = "//xs:element[@name='" + ds.Tables[i].TableName
                                            + "']//xs:sequence//xs:element[@name='" + col.ColumnName + "' and @formatfld]";
                XmlNode xmlColD = CtrlXmlSchema.Document.SelectSingleNode(strXPath, this._xmlNsMglSchema);
                if (null != xmlColD) continue;
                //该日期字段的所有行
                XmlNodeList nodeDateList = xmldoc.SelectNodes("/*/" + ds.Tables[i].TableName + "/" + col.ColumnName);
                for (int k = 0; k < nodeDateList.Count; k++)
                    try
                    {
                        if (null != nodeDateList[k].FirstChild && XmlNodeType.Text == nodeDateList[k].FirstChild.NodeType)
                        {
                            nodeDateList[k].FirstChild.Value = DateTime.Parse(nodeDateList[k].FirstChild.Value).ToString("yyyy-MM-dd");
                        }
                    }
                    catch { }
            }
            //对所有行进行处理,让它包含所有字段,没有数据的字段增加空节点
            for (int j = 0; j < ds.Tables[i].Rows.Count; j++)
            {
                XmlNode xmlNodeRow = xmldoc.DocumentElement.ChildNodes[j];
                for (int k = 0; k < ds.Tables[i].Columns.Count; k++)
                {
                    if (null == ds.Tables[i].Rows[j][k] || DBNull.Value == ds.Tables[i].Rows[j][k])
                    {
                        DataColumn col = ds.Tables[i].Columns[k];
                        xmlNodeRow.AppendChild(xmldoc.CreateElement(col.ColumnName));
                    }
                }
            }
            //对自定义格式的字段,增加列转换输出;对字典字段也增加一个格式字段输出
            //这个格式字段在formatfld属性说明
            string strXPathCol = "//xs:element[@name='" + ds.Tables[i].TableName + "']//xs:sequence//xs:element[@formatfld]";
            XmlNodeList xmlColFormat = CtrlXmlSchema.Document.SelectNodes(strXPathCol, this._xmlNsMglSchema);
            for (int j = 0; j < xmlColFormat.Count; j++)
            {
                string strColName = xmlColFormat[j].Attributes["name"].Value;
                string strFormat = "";
                string strDataItem = "", strTextFld = "", strValueFld = "";
                if (null != xmlColFormat[j].Attributes["format"] && "" != xmlColFormat[j].Attributes["format"].Value)
                    strFormat = xmlColFormat[j].Attributes["format"].Value;
                if (null != xmlColFormat[j].Attributes["dataitem"] && "" != xmlColFormat[j].Attributes["dataitem"].Value
                    && null != xmlColFormat[j].Attributes["textcol"] && "" != xmlColFormat[j].Attributes["textcol"].Value
                    && null != xmlColFormat[j].Attributes["valuecol"] && "" != xmlColFormat[j].Attributes["valuecol"].Value)
                {
                    strDataItem = xmlColFormat[j].Attributes["dataitem"].Value;
                    strTextFld = xmlColFormat[j].Attributes["textcol"].Value;
                    strValueFld = xmlColFormat[j].Attributes["valuecol"].Value;
                }
                string strColFormatName = xmlColFormat[j].Attributes["formatfld"].Value;
                DataColumn col = ds.Tables[i].Columns[strColName];

                XmlNodeList xmlNodeList = xmldoc.SelectNodes("/*/" + ds.Tables[i].TableName + "/" + strColName);
                for (int k = 0; k < xmlNodeList.Count; k++)
                {
                    string strValue = "";
                    if (null != xmlNodeList[k].FirstChild && XmlNodeType.Text == xmlNodeList[k].FirstChild.NodeType)
                        strValue = xmlNodeList[k].FirstChild.Value;
                    try
                    {
                        if ("" != strFormat && "" != strValue)
                            switch (col.DataType.Name)
                            {
                                case "DateTime":
                                    strValue = Convert.ToDateTime(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
                                    break;
                                case "Int16":
                                    Int16 ivalue16 = Convert.ToInt16(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalue16 || 0 < ivalue16)
                                        strValue = ivalue16.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "Int32":
                                    Int32 ivalue32 = Convert.ToInt32(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalue32 || 0 < ivalue32)
                                        strValue = ivalue32.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "Int64":
                                    Int64 ivalue64 = Convert.ToInt64(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalue64 || 0 < ivalue64)
                                        strValue = ivalue64.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "UInt16":
                                    UInt16 ivalueU16 = Convert.ToUInt16(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalueU16 || 0 < ivalueU16)
                                        strValue = ivalueU16.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "UInt32":
                                    UInt32 ivalueU32 = Convert.ToUInt32(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalueU32 || 0 < ivalueU32)
                                        strValue = ivalueU32.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "UInt64":
                                    UInt64 ivalueU64 = Convert.ToUInt64(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalueU64 || 0 < ivalueU64)
                                        strValue = ivalueU64.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "Decimal":
                                    Decimal ivalueD = Convert.ToDecimal(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalueD || 0 < ivalueD)
                                        strValue = ivalueD.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                case "Double":
                                    Double ivalueDu = Convert.ToDouble(xmlNodeList[k].FirstChild.Value);
                                    if (0 > ivalueDu || 0 < ivalueDu)
                                        strValue = ivalueDu.ToString(strFormat);
                                    else
                                        strValue = "";
                                    break;
                                default:
                                    strValue = xmlNodeList[k].FirstChild.Value;
                                    break;
                            }
                        if ("" != strDataItem && CtrlDsDict.Tables.Contains(strDataItem))
                        {
                            string str = strDataItem.Replace(" ", "_x0020_");
                            string strXPath = string.Format("/*/{0}[{1}='{2}']", str, strValueFld, strValue);
                            XmlNode xmlNodeDict = CtrlXmlDict.Document.SelectSingleNode(strXPath);
                            if (null != xmlNodeDict)
                            {
                                XmlNode xmlNodeValue = xmlNodeDict.SelectSingleNode(strTextFld);
                                if (null != xmlNodeValue)
                                    strValue = xmlNodeValue.InnerText;
                            }
                        }
                        //格式字段值加入文档节点
                    }
                    catch (Exception ex)
                    {
                        ExceptionManager.Publish(ex);
                    }
                    finally
                    {
                        //格式字段值加入文档节点
                        try
                        {
                            XmlNode xmlNodeNew = xmlNodeList[k].ParentNode.AppendChild(xmldoc.CreateElement(strColFormatName));
                            if ("" != strValue && null != xmlNodeNew)
                                xmlNodeNew.AppendChild(xmldoc.CreateTextNode(strValue));
                        }
                        catch { }
                    }//try-catch-finally
                }
            }//for(int j=0;j<xmlColFormat.Count;j++)
        }//for(int i=0;i<ds.Tables.Count;i++)
        return CtrlXmlSchema.Document;
    }

    public string CtrlDataBind(string dataitem)
    {
        NameObjectList paramlist = BuildParamList.BuildParams(this.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        int iPageSize = 0, iRecordCount = 0;
        //当前页数据
        DataSet ds = new DataSet(dataitem);
        ds.EnforceConstraints = false;
        strParams = this.getStrParams();
        this.PgQuery.FillDataSet(dataitem, paramlist, strParams, ds);
        DataTable drc = ds.Tables[dataitem];
        string xmlstr = "";
        if (drc == null)
            xmlstr = "<table>字段获取失败！</table>";
        else
        {
            string colnames = "";
            string datatypes = "";
            string datalens = "";
            for (int i = 0; i < drc.Columns.Count; i++)
            {
                colnames = colnames + "," + ds.Tables[0].Columns[i].ColumnName;
                datatypes = datatypes + "," + ds.Tables[0].Columns[i].DataType.ToString();
                datalens = datalens + "," + ds.Tables[0].Columns[i].MaxLength.ToString();
            }
            colnames = colnames.Substring(1, colnames.Length - 1);
            datatypes = datatypes.Substring(1, datatypes.Length - 1);
            datalens = datalens.Substring(1, datalens.Length - 1);
            xmlstr = "<result><table>字段获取成功！</table><data>" + colnames + ";" + datatypes + ";" + datalens + "</data></result>";
        } 
        return xmlstr;
    }

}
