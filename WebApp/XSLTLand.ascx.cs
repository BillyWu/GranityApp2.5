using System;
using System.Data;
using System.Collections.Specialized;
using System.Drawing;
using System.Web;
using System.Xml;
using System.Web.UI;
using System.Configuration;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Common.WebControlTools;
using Estar.Business.DataManager;
using Estar.Business.UserRight;


namespace Estar.WebApp
{
    /// <summary>
    ///		XML��ʽ��չʾ
    /// </summary>
    public partial class XSLTLand : BaseControl
    {
        //�ؼ���ʾ������,�ű�������

        private WorkItem _workItem = null;
        //�������ݵ���ID����
        private string _xmllandID = "xmlIsland";
        private string _ctrlAlertID = "";	//У����ʾ�Ŀؼ�
        //�ؼ�ģ���ļ�,Ĭ��һ���ļ�
        private string _xsltFile = "TrvIsland.xslt";
        ///�Ƿ�ʹ��viewstate
        private bool _enablevs = false;
        //�ؼ����Խڵ�
        private XmlNode _attrNodeCtrl = null;

        #region �ؼ����¼�����
        private void GridLand_Load(object sender, System.EventArgs e)
        {
            string strIsPostBackFull = leofun.valtag(this.hlbState.Value, "IsPostBackFull");
            if (null != this.ViewState["XmlLand"])
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
            }
            else if (this.IsPostBack && !this._enablevs)
            {
                this.CtrlDataBind();
            }
        }


        private void GridLand_PreRender(object sender, System.EventArgs e)
        {
            //ע��Grid,ע����ҪForm�ύ�Ŀؼ�
            string strScript = "<script language=javascript>"
                + "</script>";

                this.ltScript.Text = strScript;
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
            //Grid�и��µĹ����¼�
            this.Load += new EventHandler(GridLand_Load);
            this.PreRender += new EventHandler(GridLand_PreRender);
            //this.ltbCmd.SelectedIndexChanged += new EventHandler(ltbCmd_Command);
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

        /// <summary>
        /// ��ȡ������XSLT��ʽģ���ļ�·��
        /// </summary>
        public string CtrlXSLTFile
        {
            get { return this._xsltFile; }
            set { this._xsltFile = value; }
        }

        #endregion

        #region ��������ݰ�ʵ��

        /// <summary>
        /// ����е��ݱ��,������ľͶ��¼�¼�����µı��;����ϸ�Ĳ����ǹ����ֶεİ�������ı�Ź�������;
        /// ��ҳ��ʹ��ʱ;�ȵ�����Grid��SetLinkUpdate();Ȼ���ٵ�����ϸ��
        /// </summary>
        public override void SetLinkUpdate()
        {
            return;
        }

        /// <summary>
        /// ���ݸ���,Ĭ������״̬
        /// </summary>
        /// <returns></returns>
        public override bool Update()
        {
            return this.Update(true);
        }


        /// <summary>
        /// ���ݸ���,���������ݵ�����״̬
        /// </summary>
        /// <param name="bIsReset">�Ƿ�����״̬</param>
        /// <returns></returns>
        public override bool Update(bool bIsReset)
        {
            return true;
        }

        /// <summary>
        /// ���ݸ���,����Ȩ�޵ĸ���,�������Ƿ��������״̬
        /// </summary>
        /// <param name="bIsReset">�Ƿ�����״̬</param>
        /// <param name="currentUser">��ǰ��Ȩ���û�</param>
        /// <returns></returns>
        public override bool Update(bool bIsReset, User currentUser)
        {
            return true;
        }

        /// <summary>
        /// ���������޸�״̬
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
            return true;
        }

        /// <summary>
        /// ����table�ṩ�����ݻ���������
        /// </summary>
        /// <param name="workGrid">�ṩ���������ݻ���</param>
        public override void CtrlDataBind(DataRow dr)
        {
            this.CtrlDataBind();
        }


        /// <summary>
        /// ����Ҫ�ṩ���ݻ��������ݰ�
        /// </summary>
        public override void CtrlDataBind()
        {
            BasePage page = this.Page as BasePage;
            this.ViewState["sendpage"] = "";
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
            DataTable counttab = null;
            if (dsCount.Tables.Count > 0)
                counttab = dsCount.Tables[0];
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
            //��ǰҳ����
            DataSet ds = new DataSet(this.CtrlXmlLand.ClientID);
            ds.EnforceConstraints = false;
            strParams = this.getStrParams();
            page.PgQuery.FillDataSet(this.CtrlWorkItem.DataSrc, paramlist, strParams, ds);
            this.CtrlDataSource = ds.Tables[this.CtrlWorkItem.DataSrc];
            //�����й����
            if (null != this.CtrlDataSource && !this.CtrlDataSource.Columns.Contains("RowNum"))
                this.CtrlDataSource.Columns.Add("RowNum", Type.GetType("System.Int32"));
            if (iPageSize < 1) iPageSize = 10;
            int iPageIndex = 1;
            if (null != this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])
                iPageIndex = Convert.ToInt32(this.ViewState["PageIndex" + CtrlWorkItem.DataSrc]);
            for (int i = 0; null != this.CtrlDataSource && i < this.CtrlDataSource.Rows.Count; i++)
                this.CtrlDataSource.Rows[i]["RowNum"] = i + 1 + (iPageIndex - 1) * iPageSize;
            //�������������,ֵ��0��,��Ϊ�յ�
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
            //���������ĵ�
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
            return;
        }

        /// <summary>
        /// ����table�ṩ�����ݻ���,���ֵ���������
        /// </summary>
        /// <param name="workGrid">�ṩ���������ݻ���</param>
        public override void CtrlDataBindDict(DataRow dr)
        {
            return;
        }


        /// <summary>
        /// �ֵ����͵����ݰ�
        /// </summary>
        public override void CtrlDataBindDict()
        {
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

                XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='tpfile']");
                if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                    this.CtrlXSLTFile = xmlProperty.Attributes["value"].Value;
                if (null != this.CtrlWorkItem && !string.IsNullOrEmpty(this.CtrlWorkItem.TemplateEdit))
                    this.CtrlXSLTFile = this.CtrlWorkItem.TemplateEdit;
                this.CtrlXmlLand.TransformSource = this.CtrlXSLTFile;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='ctrlalert']");
                if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                    this._ctrlAlertID = xmlProperty.Attributes["value"].Value;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='enableviewstate']");
                if (null != xmlProperty && "true" == xmlProperty.Attributes["value"].Value)
                    this._enablevs = true;
                else if (null != xmlProperty && "false" == xmlProperty.Attributes["value"].Value)
                    this._enablevs = false;

                this._attrNodeCtrl = ctrlNode;
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

        #region  �ڲ�����

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

            string[] strParams = new string[] { spagesize, valx.ToString(), QW, FW, FGroup, FSumcol, FWhere, topnum.ToString(), this._workItem.InitFilter };
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

        #region ����Ļش������¼�
        /// <summary>
        /// �����¼�,��ҳ��ش��¼�����
        /// ִ�лش�����:���������ʽ: @key=value,@key=value,@key=value
        /// ��������: CtrlID �����¼��Ŀؼ�, Cmd �������; TabID TabҳID;CmdFull ȫ�������;CmdP �����������
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public override void ExecutCommand(object sender, EventArgs e)
        {
            string[] strTagName ={ "CtrlID", "Cmd", "TabID", "CmdFull", "CmdP" };
            BasePage page = this.Page as BasePage;
            string strCmd = leofun.valtag(page.PgStrCmd, "Cmd");
            string strCmdP = leofun.valtag(page.PgStrCmd, "CmdP");
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
                    this.CtrlSetNavJump(Convert.ToInt16(strCmdP));
                    this.CtrlDataBind();
                    break;
            }
        }

        #endregion
    }
}