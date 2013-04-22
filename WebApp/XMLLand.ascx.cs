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

/// <summary>
/// 生成数据岛数据
/// </summary>
public partial class XMLLand : BaseControl
{
    private WorkItem _workItem = null;
    //产生数据岛的ID名称
    private string _xmllandID = "xmlIsland";
    ///是否使用viewstate
    private bool _enablevs = true;
    //控件属性节点
    private XmlNode _attrNodeCtrl = null;

    #region 控件内事件函数
    protected void XMLLand_Load(object sender, System.EventArgs e)
    {
        // 在此处放置用户代码以初始化页面
        if (null != this.ViewState["xmlCtrlNode"] && null == this._attrNodeCtrl)
        {
            string strxml = this.ViewState["xmlCtrlNode"].ToString();
            XmlDocument xmldoc = new XmlDocument();
            xmldoc.LoadXml(strxml);
            this.SetAttribute(xmldoc.DocumentElement);
        }
        if (null != this.ViewState["XmlLand"])
        {
            this.CtrlXmlLand.Document = new XmlDocument();
            this.CtrlXmlLand.Document.LoadXml(this.ViewState["XmlLand"].ToString());
        }
        else if (this.IsPostBack && !this._enablevs)
        {
            this.CtrlDataBind();
        }
    }


    private void XMLLand_PreRender(object sender, System.EventArgs e)
    {
        if (null != this.CtrlXmlLand.Document && this._enablevs)
        {
            this.ViewState["XmlLand"] = this.CtrlXmlLand.Document.OuterXml;
        }
        else
            this.ViewState["XmlLand"] = null;
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
        this.Load += new EventHandler(XMLLand_Load);
        this.PreRender += new EventHandler(XMLLand_PreRender);
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

    #endregion

    #region 基类的数据绑定实现


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

        return;
    }


    /// <summary>
    /// 根据xml控件节点设置属性,可以设置多个:<Property name="" value="" />
    /// 属性名称:name="width";name="height";name="visible";name="hiddenhead"
    /// </summary>
    /// <param name="ctrlNode"></param>
    public override void SetAttribute(XmlNode ctrlNode)
    {
        try
        {
            if (null != ctrlNode.Attributes["id"] && "" != ctrlNode.Attributes["id"].Value)
                this.CtrlXmlID = ctrlNode.Attributes["id"].Value;
            XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='enableviewstate']");
            if (null != xmlProperty && "false" == xmlProperty.Attributes["value"].Value)
                this._enablevs = false;

            this._attrNodeCtrl = ctrlNode;
            this.ViewState["xmlCtrlNode"] = ctrlNode.OuterXml;
        }
        catch (Exception ex)
        {
            ExceptionManager.Publish(ex);
            return;
        }

    }

    #endregion

    #region 分页命令

    /// <summary>
    /// 翻到第一页
    /// </summary>
    public void CtrlSetNavFirst()
    {
        this.NavClick("first");
    }

    /// <summary>
    /// 翻到前一页
    /// </summary>
    public void CtrlSetNavPrev()
    {
        this.NavClick("prev");
    }

    /// <summary>
    /// 翻到下一页
    /// </summary>
    public void CtrlSetNavNext()
    {
        this.NavClick("next");
    }

    /// <summary>
    /// 翻到最后一页
    /// </summary>
    public void CtrlSetNavLast()
    {
        this.NavClick("last");
    }

    /// <summary>
    /// 跳转到指定页
    /// </summary>
    /// <param name="PageNum">跳转页码</param>
    public void CtrlSetNavJump(int iPageNum)
    {
        this.NavClick(iPageNum.ToString());
    }

    #endregion

    #region 内部函数

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


    /// <summary>
    /// 翻页导航:next,prev,last,first,跳转PageNum
    /// </summary>
    private void NavClick(string arg)
    {
        //arg 为next,prev,last,first,选中的数字
        //tbname 为操作的翻页控件
        // WorkItem workitem,UltraWebGrid oGrid,UltraWebToolbar tb_status
        // 翻页时，首先要判断是哪个GRID触发的事件，同tbname获取
        //在此增加，如果
        BasePage page = this.Page as BasePage;

        //UltraWebToolbar tb_status = this.tbrGdStatus;
        NameObjectList paramlist = BuildParamList.BuildParams(page.PgParamXmlDoc);
        string spageindex = "1", spagesize = "10", stotalpages = "1";
        if (null != this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])
            spageindex = this.ViewState["PageIndex" + CtrlWorkItem.DataSrc].ToString();
        if (null != this.ViewState["PageSize" + CtrlWorkItem.DataSrc])
            spagesize = this.ViewState["PageSize" + CtrlWorkItem.DataSrc].ToString();
        if (null != this.ViewState["TotalPages" + CtrlWorkItem.DataSrc])
            stotalpages = this.ViewState["TotalPages" + CtrlWorkItem.DataSrc].ToString();
        int pageindex, pagesize, totalpages;
        pageindex = Convert.ToInt32(spageindex);
        pagesize = Convert.ToInt32(spagesize);
        totalpages = Convert.ToInt32(stotalpages);
        switch (arg)
        {
            case "next":
                if (pageindex < totalpages) pageindex += 1;
                break;
            case "prev":
                if (pageindex > 0) pageindex -= 1;
                break;
            case "last":
                pageindex = totalpages;
                break;
            case "first":
                pageindex = 1;
                break;
            default:
                pageindex = System.Convert.ToInt32(arg);
                if (pageindex == 0) pageindex = 1;
                break;
        }
        if (pageindex <= 0) pageindex = 1;
        ViewState["PageIndex" + CtrlWorkItem.DataSrc] = pageindex.ToString();
    }

    #endregion

    #region 基类事件,在页面回传事件调用
    
    /// <summary>
    /// 基类事件,在页面回传事件调用
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public override void ExecutCommand(object sender, System.EventArgs e)
    {
        string str = this.hlb_cmd.Value.ToLower();
        string[] arrCmd = str.Split(";".ToCharArray());
        string strCmd = arrCmd[0];
        switch (strCmd)
        {
            case "cmd_nav:first":
                this.CtrlSetNavFirst();
                this.CtrlDataBind();
                break;
            case "cmd_nav:prev":
                this.CtrlSetNavPrev();
                this.CtrlDataBind();
                break;
            case "cmd_nav:next":
                this.CtrlSetNavNext();
                this.CtrlDataBind();
                break;
            case "cmd_nav:last":
                this.CtrlSetNavLast();
                this.CtrlDataBind();
                break;
            case "cmd_nav:jump":
                this.CtrlSetNavJump(Convert.ToInt16(arrCmd[1]));
                this.CtrlDataBind();
                break;
        }
        this.hlb_cmd.Value = "";
    }

    #endregion

}
