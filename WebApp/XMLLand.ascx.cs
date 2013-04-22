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
/// �������ݵ�����
/// </summary>
public partial class XMLLand : BaseControl
{
    private WorkItem _workItem = null;
    //�������ݵ���ID����
    private string _xmllandID = "xmlIsland";
    ///�Ƿ�ʹ��viewstate
    private bool _enablevs = true;
    //�ؼ����Խڵ�
    private XmlNode _attrNodeCtrl = null;

    #region �ؼ����¼�����
    protected void XMLLand_Load(object sender, System.EventArgs e)
    {
        // �ڴ˴������û������Գ�ʼ��ҳ��
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

    #region Web ������������ɵĴ���
    override protected void OnInit(EventArgs e)
    {
        //
        // CODEGEN: �õ����� ASP.NET Web ���������������ġ�
        //
        InitializeComponent();
        base.OnInit(e);
    }

    /// <summary>
    ///		�����֧������ķ��� - ��Ҫʹ�ô���༭��
    ///		�޸Ĵ˷��������ݡ�
    /// </summary>
    private void InitializeComponent()
    {
        BasePage page = this.Page as BasePage;
        //����м��ϵ�keyҪ������Դ�İ�DataTable����һ��
        this._workItem = page.PgGetWorkItem(this.CtrlItemName);
        //�ؼ������¼�
        this.Load += new EventHandler(XMLLand_Load);
        this.PreRender += new EventHandler(XMLLand_PreRender);
    }

    #endregion

    #region �ڲ�����

    /// <summary>
    /// ��ȡ�ؼ��ڵ����ݵ�
    /// </summary>
    public Xml CtrlXmlLand
    {
        get { return this.xmlland; }
    }

    /// <summary>
    /// ��ȡ�ؼ��ڵ�ͳ�����ݵ�
    /// </summary>
    public Xml CtrlXmlCount
    {
        get { return this.xmlCount; }
    }

    /// <summary>
    /// ��ȡ��Ӧ�Ĺ�����Ŀ
    /// </summary>
    public WorkItem CtrlWorkItem
    {
        get { return this._workItem; }
    }

    /// <summary>
    /// ��ȡ������ҳ�����ݵ�ID
    /// </summary>
    public string CtrlXmlID
    {
        get { return this._xmllandID; }
        set { this._xmllandID = value; }
    }

    #endregion

    #region ��������ݰ�ʵ��


    /// <summary>
    /// ����Ҫ�ṩ���ݻ��������ݰ�
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
        //��ҳ,��������
        DataSet dsCount = new DataSet("����");
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
                this.ViewState["RecordCount" + CtrlWorkItem.DataSrc] = counttab.Rows[0]["��¼����"].ToString();
                iRecordCount = Convert.ToInt32(counttab.Rows[0]["��¼����"]);

                //����iRecordCount<=iPageSize,ʱ,���ң�this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])>1��Ҫˢ��ҳ��

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
        //��ǰҳ����
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
        //��ǰҳ��,�м�¼����
        //��XmlCount���ݵ�����TotalPage;PageIndex;PageSize,RecordCount����
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
    /// ����xml�ؼ��ڵ���������,�������ö��:<Property name="" value="" />
    /// ��������:name="width";name="height";name="visible";name="hiddenhead"
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

    #region ��ҳ����

    /// <summary>
    /// ������һҳ
    /// </summary>
    public void CtrlSetNavFirst()
    {
        this.NavClick("first");
    }

    /// <summary>
    /// ����ǰһҳ
    /// </summary>
    public void CtrlSetNavPrev()
    {
        this.NavClick("prev");
    }

    /// <summary>
    /// ������һҳ
    /// </summary>
    public void CtrlSetNavNext()
    {
        this.NavClick("next");
    }

    /// <summary>
    /// �������һҳ
    /// </summary>
    public void CtrlSetNavLast()
    {
        this.NavClick("last");
    }

    /// <summary>
    /// ��ת��ָ��ҳ
    /// </summary>
    /// <param name="PageNum">��תҳ��</param>
    public void CtrlSetNavJump(int iPageNum)
    {
        this.NavClick(iPageNum.ToString());
    }

    #endregion

    #region �ڲ�����

    /// <summary>
    /// ��ȡ��������
    /// </summary>
    private string[] getStrParams()
    {
        BasePage page = this.Page as BasePage;
        string QW = "", FW = "", FGroup = "", FSumcol = "", FWhere = "", spagesize = "10", spageindex = "1";

        //ȡҳ����� basePage
        if (null != page.ViewStates["QW" + CtrlWorkItem.DataSrc]) QW = page.ViewStates["QW" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FW" + CtrlWorkItem.DataSrc]) FW = page.ViewStates["FW" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FG" + CtrlWorkItem.DataSrc]) FGroup = page.ViewStates["FG" + CtrlWorkItem.DataSrc].ToString();

        if (null != page.ViewStates["SumCol" + CtrlWorkItem.DataSrc]) FSumcol = page.ViewStates["SumCol" + CtrlWorkItem.DataSrc].ToString();
        if (null != page.ViewStates["FG" + CtrlWorkItem.DataSrc]) FWhere = page.ViewStates["Where" + CtrlWorkItem.DataSrc].ToString();

        //ȡ�û��ؼ�����
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
    /// ��ҳ����:next,prev,last,first,��תPageNum
    /// </summary>
    private void NavClick(string arg)
    {
        //arg Ϊnext,prev,last,first,ѡ�е�����
        //tbname Ϊ�����ķ�ҳ�ؼ�
        // WorkItem workitem,UltraWebGrid oGrid,UltraWebToolbar tb_status
        // ��ҳʱ������Ҫ�ж����ĸ�GRID�������¼���ͬtbname��ȡ
        //�ڴ����ӣ����
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

    #region �����¼�,��ҳ��ش��¼�����
    
    /// <summary>
    /// �����¼�,��ҳ��ش��¼�����
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
