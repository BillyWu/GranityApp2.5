using System;
using System.Data;
using System.Xml;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Common.WebControlTools;
using Estar.Business.DataManager;
using Estar.Business.UserRight;
using System.Collections.Specialized;
using ComponentArt.Web.UI;

public partial class TreeLand : BaseControl
{
    private WorkItem _workItem = null;
    //控件模板
    private XmlDocument _xmltpdoc = new XmlDocument();
    private XmlNamespaceManager _xmlNsMglSchema = null;
    //产生数据岛的ID名称
    private string _xmllandID = "xmlIslandTree";
    private string _ctrlAlertID = "";	//校验提示的控件
    //控件模板文件,默认一个文件,树控件没有模板文件
    private string _tpGridFile = "";
    //数据岛的所有字典数据集
    private DataSet _dsDict     = new DataSet("Dict");
    //树节点的ID字段名称
    private string _idField     = "ID";
    //树节点的父ID字段名称
    private string _pidField    = "PID";
    //树节点的文本
    private string _selfidField = "";
    private string _keyField    = "";
    private string _txtField    = "";
    private string _nameField   = "";
    private string _valueField  = "";
    private string _typeField   = "";

    private string _nTag = "ntag";
    //树同一父节点的子节点排序字段
    private string _orderField = "";

    private bool _enablevs = false;      //是否使用viewstate
    private bool _isexpand = false;
    //控件属性节点
    private XmlNode _attrNodeCtrl = null;

    #region 控件内事件函数
    protected void TreeLand_Load(object sender, System.EventArgs e)
    {
        // 在此处放置用户代码以初始化页面
        string strIsPostBackFull = leofun.valtag(this.hlbState.Value, "IsPostBackFull");
        if (null != this.ViewState["XmlSchema"])
        {
            this.CtrlXmlLand.Document = new XmlDocument();
            if (null != this.ViewState["XmlLand"] && "true" != strIsPostBackFull)
                this.CtrlXmlLand.Document.LoadXml(this.ViewState["XmlLand"].ToString());
            else
            {
                this.CtrlXmlLand.Document.LoadXml("<" + this.CtrlItemName + "/>");
                XmlDocument xmldoc = this.CtrlXmlLand.Document;
                XmlAttribute xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
                xmlAtt.Value = this.CtrlXmlID;
                xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
                xmlAtt.Value = this.CtrlItemName;
                xmlAtt = xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
                xmlAtt.Value = "Data";
            }
            this.CtrlDBXmlDoc = this.CtrlXmlLand.Document;
            this.CtrlXmlDelete.Document = new XmlDocument();
            if (null != this.ViewState["XmlDelete"] && "true" != strIsPostBackFull)
                this.CtrlXmlDelete.Document.LoadXml(this.ViewState["XmlDelete"].ToString());
            else
            {
                this.CtrlXmlDelete.Document.LoadXml("<" + this.CtrlItemName + "/>");
                XmlDocument xmldocDel = this.CtrlXmlDelete.Document;
                XmlAttribute xmlAtt = xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("id"));
                xmlAtt.Value = this.CtrlXmlID + "_Delete";
                xmlAtt = xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("typexml"));
                xmlAtt.Value = "Delete";
                xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("itemname"));
                xmlAtt.Value = this.CtrlItemName;
            }
            this.CtrlXmlSchema.Document = new XmlDocument();
            this.CtrlXmlSchema.Document.LoadXml(this.ViewState["XmlSchema"].ToString());
            this.CtrlDBSchema = this.CtrlXmlSchema.Document;
            this.CtrlXmlCount.Document = new XmlDocument();
            if (null != this.ViewState["XmlCount"])
                this.CtrlXmlCount.Document.LoadXml(this.ViewState["XmlCount"].ToString());
            this.CtrlXmlDict.Document = new XmlDocument();
            if (null != this.ViewState["XmlDict"])
                this.CtrlXmlDict.Document.LoadXml(this.ViewState["XmlDict"].ToString());
            if (null == this._xmlNsMglSchema)
            {
                XmlNamespaceManager xmlNsMgl = new XmlNamespaceManager(this.CtrlXmlSchema.Document.NameTable);
                XmlNode xmlRootEle = this.CtrlXmlSchema.Document.DocumentElement;
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
            }
            this.setChanged();
        }
        else if (this.IsPostBack && !this._enablevs)
        {
            this.CtrlDataBind();
            this.setChanged();
        }
    }


    private void TreeLand_PreRender(object sender, System.EventArgs e)
    {
        string strScript = "<script language=javascript>"
                         + " var myTree=new Tree(" + this.trvLand.UniqueID.Replace(":", "_").Replace("$", "_") + ",'" + this.CtrlXmlID + "');"
                         + "</script>";

        if (null != this.CtrlXmlLand.Document)
        {
            this.ltScript.Text = strScript;
        }
        if (this.IsPostBack)
            this.hlbState.Value = leofun.setvaltag(this.hlbState.Value, "IsPostBack", "true");
        if (null != this.CtrlXmlLand.Document)
        {
            //如果没有记录;就增加一条空记录;在客户端页面载入后js初始化时删除
            XmlNode xmlRowInit; XmlNodeList xmlColFormat; string strXPathCol;
            if (this.CtrlXmlLand.Document.DocumentElement.ChildNodes.Count < 1)
            {
                XmlDocument xmldoc = this.CtrlXmlLand.Document;
                xmlRowInit = xmldoc.CreateElement(this.CtrlWorkItem.DataSrc);
                xmlRowInit.Attributes.Append(xmldoc.CreateAttribute("state"));
                xmlRowInit.Attributes["state"].Value = "init";
                xmldoc.DocumentElement.AppendChild(xmlRowInit);
                strXPathCol = "//xs:element[@name='" + this.CtrlWorkItem.DataSrc + "']//xs:sequence//xs:element";
                xmlColFormat = this.CtrlXmlSchema.Document.SelectNodes(strXPathCol, this._xmlNsMglSchema);
                for (int i = 0; i < xmlColFormat.Count; i++)
                {
                    XmlNode xmlNode = xmlRowInit.AppendChild(xmlRowInit.OwnerDocument.CreateElement(xmlColFormat[i].Attributes["name"].Value));
                    if (null != xmlColFormat[i].Attributes["formatfld"] && "" != xmlColFormat[i].Attributes["formatfld"].Value)
                        xmlRowInit.AppendChild(xmlRowInit.OwnerDocument.CreateElement(xmlColFormat[i].Attributes["formatfld"].Value));
                }
            }
        }
        if (null != this.CtrlXmlLand.Document && this._enablevs)
        {
            string strIsPostBackFull = leofun.valtag(this.hlbState.Value, "IsPostBackFull");
            if ("true" != strIsPostBackFull)
            {
                this.ViewState["XmlLand"] = this.CtrlXmlLand.Document.OuterXml;
                this.ViewState["XmlDelete"] = this.CtrlXmlDelete.Document.OuterXml;
            }
            else
            {
                this.ViewState["XmlLand"] = null;
                this.ViewState["XmlDelete"] = null;
            }
            this.ViewState["XmlSchema"] = this.CtrlXmlSchema.Document.OuterXml;
            if ("" != this.CtrlXmlDict.Document.OuterXml)
                this.ViewState["XmlDict"] = this.CtrlXmlDict.Document.OuterXml;
            else
                this.ViewState["XmlDict"] = null;
            if ("" != this.CtrlXmlCount.Document.OuterXml)
                this.ViewState["XmlCount"] = this.CtrlXmlCount.Document.OuterXml;
            else
                this.ViewState["XmlCount"] = null;
        }else{
            this.ViewState["XmlLand"] = null;
            this.ViewState["XmlCount"] = null;
            this.ViewState["XmlDelete"] = null;
            this.ViewState["XmlSchema"] = null;
            this.ViewState["XmlDict"] = null;
        }
    }


    #endregion

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
    ///		设计器支持所需的方法 - 不要使用代码编辑器
    ///		修改此方法的内容。
    /// </summary>
    private void InitializeComponent()
    {
        BasePage page = this.Page as BasePage;
        //表格行集合的key要与数据源的绑定DataTable名称一致
        this._workItem = page.PgGetWorkItem(this.CtrlItemName);
        //控件关联事件
        this.Load += new EventHandler(TreeLand_Load);
        this.PreRender += new EventHandler(TreeLand_PreRender);
    }
    #endregion

    #region 内部对象

    /// <summary>
    /// 获取控件内的数据岛
    /// </summary>
    public Xml CtrlXmlLand
    {
        get { return this.xmlland; }
    }

    /// <summary>
    /// 获取控件内的统计数据岛
    /// </summary>
    public Xml CtrlXmlCount
    {
        get { return this.xmlCount; }
    }

    /// <summary>
    /// 删除区数据
    /// </summary>
    public Xml CtrlXmlDelete
    {
        get { return this.xmlDelete; }
    }

    /// <summary>
    /// 获取工作项目的数据结构及配置属性
    /// </summary>
    public Xml CtrlXmlSchema
    {
        get { return this.xmlSchema; }
    }

    /// <summary>
    /// 读取结构名称空间
    /// </summary>
    public XmlNamespaceManager CtrlXmlNsMgr
    {
        get { return this._xmlNsMglSchema; }
    }

    /// <summary>
    /// 获取工作项目的字典列数据岛
    /// </summary>
    public Xml CtrlXmlDict
    {
        get { return this.xmlDict; }
    }

    //读取字典内容
    public DataSet CtrlDsDict
    {
        get { return this._dsDict; }
    }

    /// <summary>
    /// 获取对应的工作项目
    /// </summary>
    public WorkItem CtrlWorkItem
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

    /// <summary>
    /// 读取或设置Grid样式模板文件路径
    /// </summary>
    public string CtrlTpFile
    {
        get { return this._tpGridFile; }
        set { this._tpGridFile = value; }
    }

    #endregion

    #region 基类的数据绑定实现

    /// <summary>
    /// 如果有单据编号,是主表的就对新记录设置新的编号;是明细的并且是关联字段的按照主表的编号关联更新;
    /// 在页面使用时;先调用主Grid的SetLinkUpdate();然后再调用明细的
    /// </summary>
    public override void SetLinkUpdate()
    {
        string strXPath = "//xs:sequence//xs:element[@name='单据编号']";
        BasePage page = this.Page as BasePage;
        if (null == page) return;
        XmlNode xmlNodeDjbh = this.CtrlXmlSchema.Document.SelectSingleNode(strXPath, this._xmlNsMglSchema);
        if (null == xmlNodeDjbh) return;
        XmlNodeList xmlNodesDjbh = this.CtrlXmlLand.Document.SelectNodes("/*/*[@state='new']/单据编号");
        NameValueCollection dictDjbh = null;
        if (WorkItemType.MasterData == this.CtrlWorkItem.ItemType)
            this.CtrlDictDjbh.Clear();
        else
        {
            for (int i = 0; i < page.PgUserControlList.Count; i++)
            {
                BaseControl land = page.PgUserControlList[i];
                if (null == land) continue;
                WorkItem workItem = page.PgGetWorkItem(page.PgUserControlList[i].CtrlItemName);
                if (null == workItem || WorkItemType.MasterData != workItem.ItemType)
                    continue;
                dictDjbh = land.CtrlDictDjbh; break;
            }
            if (null == dictDjbh) return;
        }
        //生成单据编号
        for (int i = 0; i < xmlNodesDjbh.Count; i++)
        {
            if (null == xmlNodesDjbh[i].FirstChild || XmlNodeType.Text != xmlNodesDjbh[i].FirstChild.NodeType)
                continue;
            if (WorkItemType.MasterData == this.CtrlWorkItem.ItemType && "单据编号" == this.CtrlWorkItem.LinkCol)
            {
                string strDJBH = CodeBuilder.GetBillSn(page.PgUnitItem.BillType, page.PgUserRight.DeptmentCode);
                this.CtrlDictDjbh[xmlNodesDjbh[i].FirstChild.Value] = strDJBH;
                xmlNodesDjbh[i].FirstChild.Value = strDJBH;
            }
            if (WorkItemType.DetailData == this.CtrlWorkItem.ItemType && null != dictDjbh[xmlNodesDjbh[i].FirstChild.Value])
                xmlNodesDjbh[i].FirstChild.Value = dictDjbh[xmlNodesDjbh[i].FirstChild.Value];
        }
    }

    /// <summary>
    /// 数据更新,默认重置状态
    /// </summary>
    /// <returns></returns>
    public override bool Update()
    {
        return this.Update(true);
    }


    /// <summary>
    /// 数据更新,和设置数据岛数据状态
    /// </summary>
    /// <param name="bIsReset">是否重置状态</param>
    /// <returns></returns>
    public override bool Update(bool bIsReset)
    {
        BasePage page = this.Page as BasePage;
        NameObjectList[] paramInsList = this.CreateInsParamLists();
        NameObjectList[] paramUptList = this.CreateUptParamLists();
        NameObjectList[] paramDelList = this.CreateDelParamLists();

        bool bSuccess = page.PgQuery.ExecuteNonQuery(this.CtrlWorkItem.DataSrc, paramInsList, paramUptList, paramDelList, this.getStrParams());
        if (false == bSuccess)
            throw (new Exception("保存项目失败：请检查配置和错误日志!"));
        if (bIsReset) this.ResetState();
        return true;
    }

    /// <summary>
    /// 数据更新,带有权限的更新,并设置是否清除数据状态
    /// </summary>
    /// <param name="bIsReset">是否重置状态</param>
    /// <param name="currentUser">当前的权限用户</param>
    /// <returns></returns>
    public override bool Update(bool bIsReset, User currentUser)
    {
        BasePage page = this.Page as BasePage;
        NameObjectList[] paramInsList = this.CreateInsParamLists();
        NameObjectList[] paramUptList = this.CreateUptParamLists();
        NameObjectList[] paramDelList = this.CreateDelParamLists();

        if (!currentUser.HasRight(page.PgUnitName, OperationType.Insert) && paramInsList.Length > 0)
            throw (new Exception("您没有增加权限!"));
        if (!currentUser.HasRight(page.PgUnitName, OperationType.Delete) && paramDelList.Length > 0)
            throw (new Exception("您没有删除权限!"));
        if (!currentUser.HasRight(page.PgUnitName, OperationType.Update) && paramUptList.Length > 0)
            throw (new Exception("您没有修改权限!"));

        bool bSuccess = page.PgQuery.ExecuteNonQuery(this.CtrlWorkItem.DataSrc, paramInsList, paramUptList, paramDelList, this.getStrParams());
        if (false == bSuccess)
            throw (new Exception("保存项目失败：请检查配置和错误日志!"));
        if (bIsReset) this.ResetState();
        return true;
    }

    /// <summary>
    /// 重置数据修改状态
    /// </summary>
    /// <returns></returns>
    public override bool ResetState()
    {
        XmlNodeList xmlRowList = this.CtrlXmlLand.Document.SelectNodes("//*[@state and @state!='init']");
        for (int i = 0; i < xmlRowList.Count; i++)
        {
            xmlRowList[i].Attributes.RemoveNamedItem("state");
            xmlRowList[i].Attributes.RemoveNamedItem("keyvalue");
        }
        this.CtrlXmlDelete.Document.DocumentElement.InnerXml = "";
        return true;
    }

    /// <summary>
    /// 依据table提供的数据环境绑定数据
    /// </summary>
    /// <param name="workGrid">提供参数的数据环境</param>
    public override void CtrlDataBind(DataRow dr)
    {
        this.CtrlDataBind();
    }


    /// <summary>
    /// 不需要提供数据环境的数据绑定
    /// </summary>
    public override void CtrlDataBind()
    {
        BasePage page = this.Page as BasePage;
        //if(!page.PgUserRight.HasRight(page.PgUnitName,OperationType.Selecte))
        //	return;
        this.ViewState["sendpage"] = "";
        this.hlbState.Value = "";
        NameObjectList paramlist = BuildParamList.BuildParams(page.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        int iPageSize = 0, iRecordCount = 0;
        //分页,汇总数据
        DataSet dsCount = new DataSet("汇总");
        dsCount.EnforceConstraints = false;
        if (null != this.CtrlWorkItem.CountDataSrc && string.Empty != this.CtrlWorkItem.CountDataSrc)
        {
            page.PgDictQuery.FillDataSet(this.CtrlWorkItem.CountDataSrc, paramlist, strParams, dsCount);
        }
        this.CtrlXmlCount.Document = new XmlDataDocument(dsCount);
        DataTable counttab = null;
        if (dsCount.Tables.Count > 0) counttab = dsCount.Tables[0];
        XmlDocument xmldocCount = this.CtrlXmlCount.Document;
        if (counttab != null)
        {
            if (null != this.CtrlWorkItem.PageSize && string.Empty != this.CtrlWorkItem.PageSize)
            {
                this.ViewState["PageSize" + CtrlWorkItem.DataSrc] = this.CtrlWorkItem.PageSize;
                iPageSize = Convert.ToInt32(this.CtrlWorkItem.PageSize);
                this.ViewState["RecordCount" + CtrlWorkItem.DataSrc] = counttab.Rows[0]["记录数量"].ToString();
                iRecordCount = Convert.ToInt32(counttab.Rows[0]["记录数量"]);

                //考虑iRecordCount<=iPageSize,时,并且：this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])>1，要刷新页面

                if (iPageSize > 0)
                {
                    if (this.ViewState["PageIndex" + CtrlWorkItem.DataSrc] != null)
                    {
                        if (iRecordCount <= iPageSize && Convert.ToInt32(this.ViewState["PageIndex" + CtrlWorkItem.DataSrc].ToString()) > 1)
                        {
                            this.ViewState["TotalPages" + CtrlWorkItem.DataSrc] = 1;
                            this.ViewState["PageIndex" + CtrlWorkItem.DataSrc] = 1;
                        }
                        else
                            this.ViewState["TotalPages" + CtrlWorkItem.DataSrc] = (int)Math.Ceiling((double)iRecordCount / iPageSize);
                    }
                    else
                        this.ViewState["TotalPages" + CtrlWorkItem.DataSrc] = (int)Math.Ceiling((double)iRecordCount / iPageSize);
                }
            }
        }
        else
            xmldocCount.LoadXml("<DataSet><DataTableCount/></DataSet>");
        xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("id"));
        xmldocCount.DocumentElement.Attributes["id"].Value = this.CtrlXmlID + "_Sum";
        xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("typexml"));
        xmldocCount.DocumentElement.Attributes["typexml"].Value = "Count";
        xmldocCount.DocumentElement.Attributes.Append(xmldocCount.CreateAttribute("itemname"));
        xmldocCount.DocumentElement.Attributes["itemname"].Value = this.CtrlItemName;
        //当前页数据
        DataSet ds = new DataSet(this.CtrlXmlLand.ClientID);
        ds.EnforceConstraints = false;
        strParams = this.getStrParams();
        page.PgQuery.FillDataSet(this.CtrlWorkItem.DataSrc, paramlist, strParams, ds);
        this.CtrlDataSource = ds.Tables[this.CtrlWorkItem.DataSrc];
        //增加行光标列
        if (null != this.CtrlDataSource && !this.CtrlDataSource.Columns.Contains("RowNum"))
            this.CtrlDataSource.Columns.Add("RowNum", Type.GetType("System.Int32"));
        if (iPageSize < 1) iPageSize = 10;
        int iPageIndex = 1;
        if (null != this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])
            iPageIndex = Convert.ToInt32(this.ViewState["PageIndex" + CtrlWorkItem.DataSrc]);
        for (int i = 0; null != this.CtrlDataSource && i < this.CtrlDataSource.Rows.Count; i++)
            this.CtrlDataSource.Rows[i]["RowNum"] = i + 1 + (iPageIndex - 1) * iPageSize;
        //如果是数字类型,值是0的,改为空的
        for (int i = 0; null != this.CtrlDataSource && i < this.CtrlDataSource.Columns.Count; i++)
        {
            DataColumn col = this.CtrlDataSource.Columns[i];
            if ("rownum" == col.ColumnName.ToLower()) continue;
            if ("Decimal" != col.DataType.Name && "Double" != col.DataType.Name && "Int16" != col.DataType.Name
                    && "Int32" != col.DataType.Name && "Int64" != col.DataType.Name && "Single" != col.DataType.Name
                     && "UInt16" != col.DataType.Name && "UInt32" != col.DataType.Name && "UInt64" != col.DataType.Name)
                continue;
            DataRow[] drs = this.CtrlDataSource.Select(col.ColumnName + "=0");
            for (int j = 0; j < drs.Length; j++)
                drs[j][i] = DBNull.Value;
        }
        //生成数据文档
        this.CtrlXmlLand.Document = new XmlDataDocument(ds);
        this.CtrlDBXmlDoc = this.CtrlXmlLand.Document;
        XmlDocument xmldoc = this.CtrlXmlLand.Document;
        if (xmldoc.DocumentElement == null)
            xmldoc.AppendChild(xmldoc.CreateElement(this.CtrlXmlLand.ClientID));
        if (null == xmldoc.DocumentElement.Attributes["id"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
        if (null == xmldoc.DocumentElement.Attributes["itemname"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
        if (null == xmldoc.DocumentElement.Attributes["typexml"])
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
        xmldoc.DocumentElement.Attributes["id"].Value = this.CtrlXmlID;
        xmldoc.DocumentElement.Attributes["itemname"].Value = this.CtrlItemName;
        xmldoc.DocumentElement.Attributes["typexml"].Value = "Data";
        if (iRecordCount < this.CtrlDataSource.Rows.Count)
            iRecordCount = this.CtrlDataSource.Rows.Count;
        //当前页码,行记录个数
        //在XmlCount数据岛增加TotalPage;PageIndex;PageSize,RecordCount数据
        XmlNode xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("TotalPage"));
        xmlNode.InnerText = (null == this.ViewState["TotalPages" + CtrlWorkItem.DataSrc]) ? "1" : this.ViewState["TotalPages" + CtrlWorkItem.DataSrc].ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("PageIndex"));
        xmlNode.InnerText = (null == this.ViewState["PageIndex" + CtrlWorkItem.DataSrc]) ? "1" : this.ViewState["PageIndex" + CtrlWorkItem.DataSrc].ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("PageSize"));
        xmlNode.InnerText = iPageSize.ToString();
        xmlNode = xmldocCount.DocumentElement.FirstChild.AppendChild(xmldocCount.CreateElement("RecordCount"));
        xmlNode.InnerText = iRecordCount.ToString();
        //删除区数据
        this.CtrlXmlDelete.Document = new XmlDocument();
        XmlDocument xmldocDel = this.CtrlXmlDelete.Document;
        xmldocDel.AppendChild(xmldocDel.CreateElement(xmldoc.DocumentElement.LocalName));
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("id"));
        xmldocDel.DocumentElement.Attributes["id"].Value = this.CtrlXmlID + "_Delete";
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("typexml"));
        xmldocDel.DocumentElement.Attributes["typexml"].Value = "Delete";
        xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("itemname"));
        xmldocDel.DocumentElement.Attributes["itemname"].Value = this.CtrlItemName;

        //数据岛结构信息
        this.CtrlXmlSchema.Document = new XmlDocument();
        this.CtrlXmlSchema.Document.LoadXml(ds.GetXmlSchema());
        this.CtrlDBSchema = this.CtrlXmlSchema.Document;
        this.setSchema();
        //字典绑定
        this.CtrlDataBindDict();
        //处理输出的字段格式
        this.setFormatXmlLand(xmldoc, ds);

        //读取控件模板,绑定树
        if(""!=this._tpGridFile)
            this._xmltpdoc.Load(this.Server.MapPath(this._tpGridFile));
        //
        for (int i = 0; i < this.CtrlXmlLand.Document.DocumentElement.ChildNodes.Count; i++)
            this.bindTree(this.CtrlXmlLand.Document.DocumentElement.ChildNodes[i]);
        this.trvLand.ExpandAll();
        return;
    }

    /// <summary>
    /// 依据table提供的数据环境,绑定字典类型数据
    /// </summary>
    /// <param name="workGrid">提供参数的数据环境</param>
    public override void CtrlDataBindDict(DataRow dr)
    {
        BasePage page = this.Page as BasePage;

        NameObjectList paramlist = BuildParamList.BuildParams(page.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        page.PgQuery.SetItem(this.CtrlWorkItem.DataSrc);
        NameParamCollection dbParamList = page.PgQuery.SelParamList;
        for (int i = 0; i < dbParamList.Count; i++)
        {
            string strParamName = dbParamList[i].ParameterName;
            if (dr.Table.Columns.Contains(strParamName))
                paramlist[strParamName] = dr[strParamName];
        }
        QueryDataRes dictQuery = page.PgDictQuery;
        DataSet ds = this.CtrlDsDict;
        //初始化字典列
        ds.EnforceConstraints = false;
        for (int j = 0; j < this.CtrlWorkItem.DictCol.Length; j++)
        {
            DictColumn dictcol = this.CtrlWorkItem.DictCol[j];
            //多次使用字典数据,只需加载一次字典
            if (dictcol.DataSrc.Trim().Length > 0)
            {
                bool isContinue = false;
                for (int k = 0; k < j; k++)
                    if (dictcol.DataSrc == this.CtrlWorkItem.DictCol[k].DataSrc)
                    {
                        isContinue = true; break;
                    }
                if (isContinue) continue;
                dictQuery.FillDataSet(dictcol.DataSrc, paramlist, strParams, ds);
            }
        }
        this.CtrlXmlDict.Document = new XmlDocument();
        XmlDocument xmldoc = this.CtrlXmlDict.Document;
        xmldoc.LoadXml(ds.GetXml());
        if (xmldoc.DocumentElement != null)
        {
            if (null == xmldoc.DocumentElement.Attributes["id"])
                xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
            if (null == xmldoc.DocumentElement.Attributes["typexml"])
                xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
            xmldoc.DocumentElement.Attributes["id"].Value = this.CtrlXmlID + "_dict";
            xmldoc.DocumentElement.Attributes["typexml"].Value = "Dict";
        }
        return;
    }


    /// <summary>
    /// 字典类型的数据绑定
    /// </summary>
    public override void CtrlDataBindDict()
    {
        BasePage page = this.Page as BasePage;

        NameObjectList paramlist = BuildParamList.BuildParams(page.PgParamXmlDoc);
        string[] strParams = this.getStrParams();
        QueryDataRes dictQuery = page.PgDictQuery;
        DataSet ds = this.CtrlDsDict;
        //初始化字典列
        ds.EnforceConstraints = false;
        for (int j = 0; j < this.CtrlWorkItem.DictCol.Length; j++)
        {
            DictColumn dictcol = this.CtrlWorkItem.DictCol[j];
            if (dictcol.DataSrc.Trim().Length > 0)
            {
                bool isContinue = false;
                for (int k = 0; k < j; k++)
                    if (dictcol.DataSrc == this.CtrlWorkItem.DictCol[k].DataSrc)
                    {
                        isContinue = true; break;
                    }
                if (isContinue) continue;
                dictQuery.FillDataSet(dictcol.DataSrc, paramlist, strParams, ds);
            }
        }
        this.CtrlXmlDict.Document = new XmlDocument();
        XmlDocument xmldoc = this.CtrlXmlDict.Document;
        xmldoc.LoadXml(ds.GetXml());
        if (xmldoc.DocumentElement != null)
        {
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("itemname"));
            xmldoc.DocumentElement.Attributes["id"].Value = this.CtrlXmlID + "_dict";
            xmldoc.DocumentElement.Attributes["typexml"].Value = "Dict";
            xmldoc.DocumentElement.Attributes["itemname"].Value = this.CtrlItemName;
        }
        return;
    }


    /// <summary>
    /// 根据xml控件节点设置属性,可以设置多个:<Property name="" value="" />
    /// 属性名称:name="width";name="height";name="visible";name="hiddenhead"
    /// </summary>
    /// <param name="ctrlNode"></param>
    public override void SetAttribute(XmlNode ctrlNode)
    {
        //try
        //{
            if (null != ctrlNode.Attributes["id"] && "" != ctrlNode.Attributes["id"].Value)
                this.CtrlXmlID = ctrlNode.Attributes["id"].Value;

            XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='tpfile']");
            if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                this.CtrlTpFile = xmlProperty.Attributes["value"].Value;

            xmlProperty = ctrlNode.SelectSingleNode("Property[@name='ctrlalert']");
            if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                this._ctrlAlertID = xmlProperty.Attributes["value"].Value;

            xmlProperty = ctrlNode.SelectSingleNode("Property[@name='width']");
            if (null != xmlProperty)
            {
//                在此考虑100%
//                if(xmlProperty.Attributes["value"].Value.IndexOf("%")>-1)
//                    this.trvLand.Width = 
                this.trvLand.Width = Unit.Parse(xmlProperty.Attributes["value"].Value);
            }
            xmlProperty = ctrlNode.SelectSingleNode("Property[@name='height']");
            if (null != xmlProperty)
                this.trvLand.Height = Unit.Parse(xmlProperty.Attributes["value"].Value);
            
            xmlProperty = ctrlNode.SelectSingleNode("Property[@name='enableviewstate']");

            if (null != xmlProperty && "true" == xmlProperty.Attributes["value"].Value)
            {
                this._enablevs = true;
                this.trvLand.EnableViewState = true;
            }



            xmlProperty = ctrlNode.SelectSingleNode("Property[@name='trvfld']");
            if (null != xmlProperty)
            {
                if (null != xmlProperty.Attributes["idfld"])
                    this._idField = xmlProperty.Attributes["idfld"].Value;
                
                if (null != xmlProperty.Attributes["pidfld"])
                    this._pidField = xmlProperty.Attributes["pidfld"].Value;

                if (null != xmlProperty.Attributes["selfid"])
                    this._selfidField = xmlProperty.Attributes["selfid"].Value;
                
                if (null != xmlProperty.Attributes["txtfld"])
                    this._txtField = xmlProperty.Attributes["txtfld"].Value;

                if (null != xmlProperty.Attributes["namefld"])
                    this._nameField = xmlProperty.Attributes["namefld"].Value;

                if (null != xmlProperty.Attributes["valuefld"])
                    this._valueField = xmlProperty.Attributes["valuefld"].Value;
                
                if (null != xmlProperty.Attributes["typefld"])
                    this._typeField = xmlProperty.Attributes["typefld"].Value;

                if (null != xmlProperty.Attributes["orderfld"])
                    this._orderField = xmlProperty.Attributes["orderfld"].Value;
                
                if (null != xmlProperty.Attributes["ntag"])
                    this._nTag = xmlProperty.Attributes["ntag"].Value;

                if (null != xmlProperty.Attributes["keyfld"])
                    this._keyField = xmlProperty.Attributes["keyfld"].Value;

                if (null != xmlProperty.Attributes["noexpand"] && xmlProperty.Attributes["noexpand"].Value == "true")
                    this._isexpand = false;
                else
                    this._isexpand = true;
            }

            this._attrNodeCtrl = ctrlNode;
        //}
        //catch (Exception ex)
        //{
        //    ExceptionManager.Publish(ex);
        //    return;
        //}

    }

    #endregion

    #region  内部方法

    /// <summary>
    /// 把前台的更新的xml标签内容设置到数据岛中
    /// </summary>
    private void setChanged()
    {
        //没有设置主键的不更新
        if ("" == this.hlbChanged.Value)
            return;
        if (null == this.CtrlXmlSchema.Document.DocumentElement.Attributes["columnkey"])
        {
            this.hlbChanged.Value = "";
            return;
        }
        string strKey = this.CtrlXmlSchema.Document.DocumentElement.Attributes["columnkey"].Value;
        if ("" == strKey)
        {
            this.hlbChanged.Value = "";
            return;
        }
        //建立增删改数据行
        XmlDocument xmldoc = new XmlDocument();
        xmldoc.AppendChild(xmldoc.CreateElement(this.CtrlXmlDelete.Document.DocumentElement.LocalName));
        xmldoc.DocumentElement.InnerXml = this.hlbChanged.Value;
        string strXmlRowModify = "";
        string strXmlRowDelete = "";
        string strXmlRowNew = "";
        string strXmlRowOther = "";
        XmlNodeList xmlRowList = xmldoc.SelectNodes("//*[../*[@state]]");
        for (int i = 0; i < xmlRowList.Count; i++)
        {
            if (null == xmlRowList[i].Attributes["state"])
            {
                strXmlRowOther += xmlRowList[i].OuterXml;
                continue;
            }
            if ("delete" == xmlRowList[i].Attributes["state"].Value)
                strXmlRowDelete += xmlRowList[i].OuterXml;
            else if ("new" == xmlRowList[i].Attributes["state"].Value)
                strXmlRowNew += xmlRowList[i].OuterXml;
            else if ("modify" == xmlRowList[i].Attributes["state"].Value)
                strXmlRowModify += xmlRowList[i].OuterXml;
            else
                strXmlRowOther += xmlRowList[i].OuterXml;
        }

        //把改变的数据行放入对应的数据岛中
        XmlDocument xmldocLand = this.CtrlXmlLand.Document;
        XmlDocument xmldocDelete = this.CtrlXmlDelete.Document;
        XmlNode xmlChModify = xmldocLand.DocumentElement.AppendChild(xmldocLand.CreateElement("DataModify"));
        XmlNode xmlChDelete = xmldocDelete.DocumentElement.AppendChild(xmldocDelete.CreateElement("DataDelete"));
        XmlNode xmlChNew = xmldocLand.DocumentElement.AppendChild(xmldocLand.CreateElement("DataNew"));
        XmlNode xmlChOther = xmldocLand.DocumentElement.AppendChild(xmldocLand.CreateElement("DataOther"));
        xmlChModify.InnerXml = strXmlRowModify;
        xmlChDelete.InnerXml = strXmlRowDelete;
        xmlChNew.InnerXml = strXmlRowNew;
        xmlChOther.InnerXml = strXmlRowOther;
        //修改行更新,新行增加,删除行删掉原来行
        xmlRowList = xmlChOther.SelectNodes("./*");
        for (int i = xmlRowList.Count - 1; i > -1; i--)
        {
            XmlNode xmlRow = null;
            string strPath = "", strValue = "";
            XmlNode xmlValueKey = null;
            if ("" != strKey )
            {
                xmlValueKey = xmlRowList[i].SelectSingleNode(strKey);
                if (null != xmlValueKey) strValue = xmlValueKey.InnerText;
                strPath = "/*/*[" + strKey + "='" + strValue + "']";
                xmlRow = xmldocLand.SelectSingleNode(strPath);
            }
            if (null == xmlRow)
                xmlRow = xmlChOther.ParentNode.AppendChild(xmlRowList[i]);
        }
        xmlChOther.ParentNode.RemoveChild(xmlChOther);
        xmlRowList = xmlChModify.SelectNodes("./*");
        for (int i = xmlRowList.Count - 1; i > -1; i--)
        {
            XmlNode xmlRow = null;
            string strPath = "";
            if ("" != strKey && null != xmlRowList[i].Attributes["keyvalue"])
            {
                strPath = "/*/*[" + strKey + "='" + xmlRowList[i].Attributes["keyvalue"].Value + "']";
                xmlRow = xmldocLand.SelectSingleNode(strPath);
            }
            if (null == xmlRow)
                xmlRow = xmlChModify.ParentNode.AppendChild(xmlRowList[i]);
            else
            {
                xmlRow.ParentNode.InsertBefore(xmlRowList[i], xmlRow);
                xmlRow.ParentNode.RemoveChild(xmlRow);
            }
        }
        xmlChModify.ParentNode.RemoveChild(xmlChModify);
        xmlRowList = xmlChNew.SelectNodes("./*");
        XmlNode xmlNodePosition = null;
        for (int i = xmlRowList.Count - 1; i > -1; i--)
        {
            string strValueKey = "";
            XmlNode xmlNodeKey = xmlRowList[i].SelectSingleNode(strKey);
            if (null != xmlNodeKey && null != xmlNodeKey.FirstChild && XmlNodeType.Text == xmlNodeKey.FirstChild.NodeType)
                strValueKey = xmlNodeKey.FirstChild.Value;
            if ("" == strValueKey)
            {
                if (null == xmlNodeKey)
                    xmlNodeKey = xmlRowList[i].AppendChild(xmlRowList[i].OwnerDocument.CreateElement(strKey));
                xmlNodeKey.AppendChild(xmlNodeKey.OwnerDocument.CreateTextNode(Guid.NewGuid().ToString()));
                xmlChNew.ParentNode.AppendChild(xmlRowList[i]);
                continue;
            }
            string strPath = "/*/*[" + strKey + "='" + strValueKey + "']";
            XmlNode xmlRow = xmldocLand.SelectSingleNode(strPath);
            if (null == xmlRow)
                xmlNodePosition = xmlChNew.ParentNode.InsertBefore(xmlRowList[i], xmlNodePosition);
            else
            {
                xmlRow.ParentNode.InsertBefore(xmlRowList[i], xmlRow);
                xmlRow.ParentNode.RemoveChild(xmlRow);
            }

        }
        xmlChNew.ParentNode.RemoveChild(xmlChNew);
        xmlRowList = xmlChDelete.SelectNodes("./*");
        for (int i = xmlRowList.Count - 1; i > -1; i--)
        {
            if (null == xmlRowList[i].Attributes["keyvalue"])
                continue;
            XmlNode xmlRow = null;
            string strPath = "";
            if (null != xmlRowList[i].Attributes["keyvalue"])
            {
                strPath = "/*/*[" + strKey + "='" + xmlRowList[i].Attributes["keyvalue"].Value + "']";
                xmlRow = this.CtrlXmlLand.Document.SelectSingleNode(strPath);
            }
            if (null != xmlRow)
                xmlRow.ParentNode.RemoveChild(xmlRow);
            xmlChDelete.ParentNode.AppendChild(xmlRowList[i]);
        }
        xmlChDelete.ParentNode.RemoveChild(xmlChDelete);
        this.hlbChanged.Value = "";
    }


    /// <summary>
    /// 根据数据集对应的数据文档,按照结构定义的格式,设置日期、数字、空数据的数据岛格式
    /// </summary>
    /// <param name="xmldoc">数据集的数据文档</param>
    /// <param name="ds">数据集</param>
    private void setFormatXmlLand(XmlDocument xmldoc, DataSet ds)
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
                XmlNode xmlColD = this.CtrlXmlSchema.Document.SelectSingleNode(strXPath, this._xmlNsMglSchema);
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
            XmlNodeList xmlColFormat = this.CtrlXmlSchema.Document.SelectNodes(strXPathCol, this._xmlNsMglSchema);
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
                        if ("" != strDataItem && this.CtrlDsDict.Tables.Contains(strDataItem))
                        {
                            string strXPath = string.Format("/*/{0}[{1}='{2}']", strDataItem, strValueFld, strValue);
                            XmlNode xmlNodeDict = this.CtrlXmlDict.Document.SelectSingleNode(strXPath);
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

    }


    /// <summary>
    /// 设置数据集的结构及定义属性
    /// 需要输出到客户端的项目属性,列属性;name,relation,linkcol,columnkey,printtype,pagesize,
    /// 系统属性:id,typexml,ctrlAlter,ctrlchanged,ctrlschema,ctrlstate,ctrlhlbcmd,ctrlbtcommand,catalog,class,itemname,;
    /// 用户自定义的属性不能与其相同
    /// </summary>
    private void setSchema()
    {
        //数据岛结构信息
        BasePage page = this.Page as BasePage;
        if (null == this.CtrlXmlSchema.Document)
            return;
        string itemAttrs = "name,relation,linkcol,columnkey,printtype,pagesize,";
        string ctrlAttrs = "name,relation,linkcol,columnkey,printtype,pagesize,"
                            + "id,typexml,ctrlAlter,ctrlchanged,ctrlschema,ctrlstate,ctrlhlbcmd,ctrlbtcommand,catalog,class,itemname,";

        XmlDocument xmldocSchema = this.CtrlXmlSchema.Document;

        #region 控件本身使用属性:
        //结构数据岛ID,数据岛类型,客户端提示标签,数据更新标签,结构更新(列宽度)标签,状态标签,命令标签,命令按钮,树节点ID字段,父ID字段,排序字段
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
        if (null == xmldocSchema.DocumentElement.Attributes["idfld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("idfld"));
        if (null == xmldocSchema.DocumentElement.Attributes["pidfld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("pidfld"));

        if (null == xmldocSchema.DocumentElement.Attributes["txtfld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("txtfld"));

        if (null == xmldocSchema.DocumentElement.Attributes["namefld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("namefld"));

        if (null == xmldocSchema.DocumentElement.Attributes["selfid"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("selfid"));

        if (null == xmldocSchema.DocumentElement.Attributes["valuefld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("valuefld"));

        if (null == xmldocSchema.DocumentElement.Attributes["typefld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("typefld"));
        
        if (null == xmldocSchema.DocumentElement.Attributes["orderfld"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("orderfld"));
        
        if (null == xmldocSchema.DocumentElement.Attributes["ntag"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("ntag"));

        if (null == xmldocSchema.DocumentElement.Attributes["keyfid"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("keyfid"));

        if (null == xmldocSchema.DocumentElement.Attributes["noexpand"])
            xmldocSchema.DocumentElement.Attributes.Append(xmldocSchema.CreateAttribute("noexpand"));

        xmldocSchema.DocumentElement.Attributes["id"].Value             = this.CtrlXmlID + "_Schema";
        xmldocSchema.DocumentElement.Attributes["typexml"].Value        = "Schema";
        xmldocSchema.DocumentElement.Attributes["ctrlAlert"].Value      = this._ctrlAlertID;
        xmldocSchema.DocumentElement.Attributes["ctrlchanged"].Value    = this.hlbChanged.ClientID;
        xmldocSchema.DocumentElement.Attributes["ctrlschema"].Value     = this.hlbWidth.ClientID;
        xmldocSchema.DocumentElement.Attributes["ctrlstate"].Value      = this.hlbState.ClientID;
        xmldocSchema.DocumentElement.Attributes["ctrlhlbcmd"].Value     = this.hlb_cmd.ClientID;
        xmldocSchema.DocumentElement.Attributes["ctrlbtcommand"].Value  = page.PgBtCmd.ClientID;
        xmldocSchema.DocumentElement.Attributes["idfld"].Value          = this._idField;
        xmldocSchema.DocumentElement.Attributes["pidfld"].Value         = this._pidField;
        xmldocSchema.DocumentElement.Attributes["selfid"].Value         = this._selfidField;
        xmldocSchema.DocumentElement.Attributes["keyfid"].Value         = this._keyField;   //人工关键字段
        xmldocSchema.DocumentElement.Attributes["txtfld"].Value         = this._txtField;
        xmldocSchema.DocumentElement.Attributes["namefld"].Value        = this._nameField;
        xmldocSchema.DocumentElement.Attributes["valuefld"].Value       = this._valueField;
        xmldocSchema.DocumentElement.Attributes["typefld"].Value        = this._typeField;
        xmldocSchema.DocumentElement.Attributes["orderfld"].Value       = this._orderField;
        xmldocSchema.DocumentElement.Attributes["ntag"].Value           = this._nTag;
        if (this._isexpand)
            xmldocSchema.DocumentElement.Attributes["noexpand"].Value = "false";
        else
            xmldocSchema.DocumentElement.Attributes["noexpand"].Value = "true";
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
        XmlNode xmlNodeWorkItem = page.PgUnitItem.UnitNode.SelectSingleNode(".//Item[@name='" + this.CtrlItemName + "']");
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

        #region  列规则属性

        XmlNodeList xmlColNodeList = xmldocSchema.SelectNodes("//xs:sequence//xs:element", xmlNsMgl);
        for (int i = 0; i < xmlColNodeList.Count; i++)
        {
            XmlNode xmlColSchema = xmlColNodeList[i];
            string colName = xmlColSchema.Attributes["name"].Value;
            //自定义属性,如果自定义属性为空,忽略处理
            XmlNode xmlCol = page.PgUnitItem.UnitNode.SelectSingleNode(".//Item[@name='" + this.CtrlItemName + "']/Column[@name='" + colName + "']");
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
            if (null != xmlColSchema.Attributes["dataitem"] && "" != xmlColSchema.Attributes["dataitem"].Value
                && null != xmlColSchema.Attributes["textcol"] && "" != xmlColSchema.Attributes["textcol"].Value
                && null != xmlColSchema.Attributes["valuecol"] && "" != xmlColSchema.Attributes["valuecol"].Value
                && xmlColSchema.Attributes["valuecol"].Value != xmlColSchema.Attributes["textcol"].Value)
            {
                xmlColSchema.Attributes.SetNamedItem(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
                xmlColSchema.Attributes["formatfld"].Value = colName + "_显示";
            }
        }//for(int i=0;i<xmlColNodeList.Count;i++)
        #endregion

    }

    /// <summary>
    /// 根据数据XmlDoc绑定树节点:节点ID,节点文本;如果该行对应的树节点已经建立就直接返回该节点
    /// </summary>
    /// <param name="xmlNodeRow">数据源行节点</param>
    /// <returns>如成功返回对应的树节点,否则返回null</returns>
    private TreeViewNode bindTree(XmlNode xmlNodeRow)
    {
        if ("" == this._idField || "" == this._pidField || "" == this._txtField || null == xmlNodeRow)
            return null;
        XmlNode xmlNodeID = xmlNodeRow.SelectSingleNode(this._idField);
        XmlNode xmlNodePid = xmlNodeRow.SelectSingleNode(this._pidField);
        XmlNode xmlNodeTxt = xmlNodeRow.SelectSingleNode(this._txtField);
        XmlNode xmlNodeTag = null;
        if(this._nTag!="")
            xmlNodeTag = xmlNodeRow.SelectSingleNode(this._nTag);
        if (null == xmlNodeID || null == xmlNodeID.FirstChild || XmlNodeType.Text != xmlNodeID.FirstChild.NodeType)
            return null;
        //已经存在节点直接返回;
        TreeViewNode trvNode = this.getTrvNodeByID(xmlNodeID.FirstChild.Value);
        if (null != trvNode)       return trvNode;
        //没有该节点,就先创建父节点
        trvNode = new TreeViewNode();
        if (null != xmlNodeTxt && null != xmlNodeTxt.FirstChild)
            trvNode.Text = xmlNodeTxt.FirstChild.Value;
        if (null != xmlNodeTag && null != xmlNodeTag.FirstChild)
            trvNode.Value = xmlNodeTag.FirstChild.Value;
        else
            trvNode.Value = leofun.setvaltag("", this._idField, trvNode.PageViewId);
        trvNode.PageViewId = xmlNodeID.FirstChild.Value; //代替原来的DataKey
        string tag = leofun.setvaltag("", this._idField, trvNode.PageViewId);
        XmlNode xmlNodeRowParent = null;
        if(null!=xmlNodePid && null!=xmlNodePid.FirstChild && XmlNodeType.Text==xmlNodePid.FirstChild.NodeType)
            xmlNodeRowParent= xmlNodeRow.ParentNode.SelectSingleNode("*[" + this._idField + "='" + xmlNodePid.FirstChild.Value + "']");
        

        TreeViewNode nodeParent = null;

        if (null != xmlNodeRowParent)
            nodeParent = this.bindTree(xmlNodeRowParent);

        //有父节点就加入父节点之下,没有的直接加入树的跟节点
        if (null != nodeParent)
            nodeParent.Nodes.Add(trvNode);
        else
            this.trvLand.Nodes.Add(trvNode);
        if (null == xmlNodeTag)
            trvNode.Value = tag;
        trvNode.ID = trvNode.PageViewId;
        return trvNode;
    }

    /// <summary>
    /// 根据节点ID对应于树的datakey;找到树节点
    /// </summary>
    /// <param name="strid">节点ID值</param>
    /// <returns>返回对应的树节点;没有找到返回null</returns>
    private TreeViewNode getTrvNodeByID(string strid)
    {
        TreeViewNode trvNode = null;
        if(this.trvLand.Nodes.Count>0)
            trvNode=this.trvLand.Nodes[0];
        while (null != trvNode)
        {
            if (trvNode.PageViewId.Equals(strid))
                return trvNode;
            if (trvNode.Nodes.Count > 0)
                trvNode = trvNode.Nodes[0];
            else if (null != trvNode.NextSibling)
                trvNode = trvNode.NextSibling;
            else if (null != trvNode.ParentNode)
                while (null != trvNode && null != trvNode.ParentNode)
                {
                    if (null != trvNode.ParentNode.NextSibling)
                    {
                        trvNode = trvNode.ParentNode.NextSibling;
                        break;
                    }
                    else if (null != trvNode.ParentNode.ParentNode)
                        trvNode = trvNode.ParentNode;
                    else
                        trvNode = null;
                }
            else
                trvNode = null;
        }
        return null;
    }

    /// <summary>
    /// 生成增加参数数组
    /// </summary>
    /// <returns></returns>
    private NameObjectList[] CreateInsParamLists()
    {
        BasePage page = this.Page as BasePage;
        XmlNodeList xmlNodeRows = this.CtrlXmlLand.Document.SelectNodes("//*[@state='new']");
        if (xmlNodeRows.Count < 1) return new NameObjectList[0];
        XmlNodeList xmlColList = this.CtrlXmlSchema.Document.SelectNodes("//xs:sequence//xs:element", this._xmlNsMglSchema);
        NameObjectList[] paramList = new NameObjectList[xmlNodeRows.Count];
        NameObjectList param = BuildParamList.BuildParams(page.PgParamXmlDoc);
        for (int i = 0; i < xmlNodeRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < param.Count; j++)
                paramList[i][param.Keys[j]] = param[param.Keys[j]];
            for (int j = 0; j < xmlColList.Count; j++)
            {
                XmlNode xmlNodeValue = xmlNodeRows[i].SelectSingleNode(xmlColList[j].Attributes["name"].Value);
                this.setParam(paramList[i], xmlNodeValue, xmlColList[j]);
            }
        }
        return paramList;
    }


    /// <summary>
    /// 生成更新参数数组
    /// </summary>
    /// <returns></returns>
    private NameObjectList[] CreateUptParamLists()
    {
        BasePage page = this.Page as BasePage;
        XmlNodeList xmlNodeRows = this.CtrlXmlLand.Document.SelectNodes("//*[@state='modify']");
        if (xmlNodeRows.Count < 1) return new NameObjectList[0];
        XmlNodeList xmlColList = this.CtrlXmlSchema.Document.SelectNodes("//xs:sequence//xs:element", this._xmlNsMglSchema);
        NameObjectList[] paramList = new NameObjectList[xmlNodeRows.Count];
        NameObjectList param = BuildParamList.BuildParams(page.PgParamXmlDoc);
        for (int i = 0; i < xmlNodeRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < param.Count; j++)
                paramList[i][param.Keys[j]] = param[param.Keys[j]];
            for (int j = 0; j < xmlColList.Count; j++)
            {
                XmlNode xmlNodeValue = xmlNodeRows[i].SelectSingleNode(xmlColList[j].Attributes["name"].Value);
                this.setParam(paramList[i], xmlNodeValue, xmlColList[j]);
            }
        }

        return paramList;
    }


    /// <summary>
    /// 生成删除参数数组
    /// </summary>
    /// <returns></returns>
    private NameObjectList[] CreateDelParamLists()
    {
        BasePage page = this.Page as BasePage;
        XmlNodeList xmlNodeRows = this.CtrlXmlDelete.Document.SelectNodes("//*[@state='delete']");
        if (xmlNodeRows.Count < 1) return new NameObjectList[0];
        XmlNodeList xmlColList = this.CtrlXmlSchema.Document.SelectNodes("//xs:sequence//xs:element", this._xmlNsMglSchema);
        NameObjectList[] paramList = new NameObjectList[xmlNodeRows.Count];
        NameObjectList param = BuildParamList.BuildParams(page.PgParamXmlDoc);
        for (int i = 0; i < xmlNodeRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < param.Count; j++)
                paramList[i][param.Keys[j]] = param[param.Keys[j]];
            for (int j = 0; j < xmlColList.Count; j++)
            {
                XmlNode xmlNodeValue = xmlNodeRows[i].SelectSingleNode(xmlColList[j].Attributes["name"].Value);
                this.setParam(paramList[i], xmlNodeValue, xmlColList[j]);
            }
        }
        return paramList;
    }


    /// <summary>
    /// 设置节点值参数
    /// </summary>
    /// <param name="param">参数表</param>
    /// <param name="xmlNodeValue">值节点</param>
    /// <param name="xmlNodeCol">列结构节点</param>
    private void setParam(NameObjectList param, XmlNode xmlNodeValue, XmlNode xmlNodeCol)
    {
        if (null == param || null == xmlNodeCol || null == xmlNodeCol.Attributes["name"])
            return;
        string colname = xmlNodeCol.Attributes["name"].Value;
        string strvalue = "";
        if (null == xmlNodeValue)
        {
            param[colname] = DBNull.Value;
            return;
        }
        if (null != xmlNodeValue.FirstChild && XmlNodeType.Text == xmlNodeValue.FirstChild.NodeType)
            strvalue = xmlNodeValue.FirstChild.Value;
        string strDBType = "";
        if (null != xmlNodeCol.Attributes["msdata:DataType"] && xmlNodeCol.Attributes["msdata:DataType"].Value.StartsWith("System.Guid"))
            strDBType = "guid";
        if ("ID" == colname.ToUpper())
            strDBType = "guid";
        if ("" == strDBType)
            strDBType = xmlNodeCol.Attributes["type"].Value.ToLower();
        if ("" == strvalue && "guid" != strDBType)
        {
            param[colname] = DBNull.Value;
            return;
        }
        try
        {
            switch (strDBType)
            {
                case "xs:string":
                    if (null != xmlNodeCol.Attributes["msdata:DataType"] && xmlNodeCol.Attributes["msdata:DataType"].Value.StartsWith("System.Guid"))
                    {
                        if ("" == strvalue)
                            param[colname] = DBNull.Value;
                        else
                            param[colname] = new Guid(strvalue);
                    }
                    else
                        param[colname] = strvalue;
                    break;
                case "xs:int":
                    param[colname] = Convert.ToInt16(strvalue);
                    break;
                case "xs:double":
                case "xs:decimal":
                case "xs:float":
                    param[colname] = Convert.ToDecimal(strvalue);
                    break;
                case "xs:datetime":
                case "xs:date":
                    param[colname] = DateTime.Parse(strvalue);
                    break;
                case "xs:boolean":
                    if ("0" == strvalue || "false" == strvalue.ToLower())
                    {
                        xmlNodeValue.FirstChild.Value = "false";
                        strvalue = "false";
                    }
                    else
                    {
                        xmlNodeValue.FirstChild.Value = "true";
                        strvalue = "true";
                    }
                    param[colname] = Convert.ToBoolean(strvalue);
                    break;
                case "guid":
                    if ("" == strvalue)
                    {
                        strvalue = Guid.NewGuid().ToString();
                        xmlNodeValue.InnerText = strvalue;
                    }
                    if (null != xmlNodeCol.Attributes["msdata:DataType"] && xmlNodeCol.Attributes["msdata:DataType"].Value.StartsWith("System.Guid"))
                        param[colname] = new Guid(strvalue);
                    else
                        param[colname] = strvalue;
                    break;
                default:
                    param[colname] = strvalue;
                    break;
            }
        }
        catch
        {
            param[colname] = DBNull.Value;
        }//try
    }


    /// <summary>
    /// 获取参数数组
    /// </summary>
    private string[] getStrParams()
    {
        BasePage page = this.Page as BasePage;
        string QW = "", FW = "", FGroup = "", FSumcol = "", FWhere = "", spagesize = "10", spageindex = "1";

        //取页面参数 basePage
        if (null != page.ViewStates["QW" + CtrlWorkItem.DataSrc]) QW = page.ViewStates["QW" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FW" + CtrlWorkItem.DataSrc]) FW = page.ViewStates["FW" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FG" + CtrlWorkItem.DataSrc]) FGroup = page.ViewStates["FG" + CtrlWorkItem.DataSrc].ToString();

        if (null != page.ViewStates["SumCol" + CtrlWorkItem.DataSrc]) FSumcol = page.ViewStates["SumCol" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FG" + CtrlWorkItem.DataSrc]) FWhere = page.ViewStates["Where" + CtrlWorkItem.DataSrc].ToString();

        //取用户控件参数
        if (null != this.ViewState["PageSize" + CtrlWorkItem.DataSrc]) spagesize = this.ViewState["PageSize" + CtrlWorkItem.DataSrc].ToString();
        if (null != this.ViewState["PageIndex" + CtrlWorkItem.DataSrc]) spageindex = this.ViewState["PageIndex" + CtrlWorkItem.DataSrc].ToString();

        int pageindex = Convert.ToInt32(spageindex);
        int valx = (pageindex - 1) * (Convert.ToInt32(spagesize));
        int topnum = (pageindex) * (Convert.ToInt32(spagesize));
        int endnum = valx;

        string[] strParams = new string[] { spagesize, valx.ToString(), QW, FW, FGroup, FSumcol, FWhere, topnum.ToString(),this.CtrlWorkItem.InitFilter };
        return strParams;
    }

    #endregion

    #region 基类回传事件,在页面回传事件调用

    /// <summary>
    /// 基类事件,在页面回传事件调用
    /// 执行回传命令:命令参数样式: @key=value,@key=value,@key=value
    /// 参数内容: CtrlID 触发事件的控件, Cmd 命令参数; TabID Tab页ID;CmdFull 全命令参数;CmdP 其他命令参数
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public override void ExecutCommand(object sender, System.EventArgs e)
    {
        string[] strTagName ={ "CtrlID", "Cmd", "TabID", "CmdFull", "CmdP" };
        BasePage page = this.Page as BasePage;
        string strCmd = leofun.valtag(page.PgStrCmd, "Cmd");
        string strCmdP = leofun.valtag(page.PgStrCmd, "CmdP");
        switch (strCmd)
        {
            case "cmd_nav:first":
                break;
            case "cmd_nav:prev":
                break;
            case "cmd_nav:next":
                break;
            case "cmd_nav:last":
                break;
            case "cmd_nav:jump":
                break;
        }
    }
    #endregion

}
