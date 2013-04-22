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
    ///		具有分页功能的Grid工作项目控件
    /// </summary>
    public partial class GridLand : BaseControl
    {
        //控件显示的容器,脚本的容器

        private WorkItem _workItem = null;
        //控件模板,用于页面展现
        private XmlDocument _xmltpdoc = new XmlDocument();
        private XmlNamespaceManager _xmlNsMglSchema = null;
        //产生数据岛的ID名称
        private string _xmllandID = "xmlIsland";
        private string _ctrlAlertID = "";	//校验提示的控件
        //控件模板文件,默认一个文件
        private string _tpGridFile = "ControlTemplate/GridDef.htm";
        //数据岛的所有字典数据集
        private DataSet _dsDict = new DataSet("Dict");
        //标题头是否隐藏,是否显示Grid,是否使用视图状态
        private bool _hiddenHead = false;
        private bool _hiddenGrid = false;
        ///是否使用viewstate
        private bool _enablevs = false;
        //控件属性节点
        private XmlNode _attrNodeCtrl = null;
        private string swidth = "10%";
        private string lastcol = "";
        #region 控件内事件函数
        private void GridLand_Load(object sender, System.EventArgs e)
        {
            string strIsPostBackFull = leofun.valtag(this.hlbState.Value, "IsPostBackFull");
            if (null != this.ViewState["XmlSchema"])
            {
                this.CtrlXmlLand.Document = new XmlDocument();
                if (null != this.ViewState["XmlLand"] && "true" != strIsPostBackFull)
                    this.CtrlXmlLand.Document.LoadXml(this.ViewState["XmlLand"].ToString());
                else
                {
                    //建立数据xml结构
                    this.CtrlXmlLand.Document.LoadXml("<" + this.CtrlItemName + "/>");
                    XmlDocument xmldoc = this.CtrlXmlLand.Document;
                    XmlAttribute xmlAtt= xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
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
                    xmlAtt= xmldocDel.DocumentElement.Attributes.Append(xmldocDel.CreateAttribute("typexml"));
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
            else if (this.IsPostBack && !this._enablevs )
            {
                this.CtrlDataBind();
                this.setChanged();
            }
        }


        private void GridLand_PreRender(object sender, System.EventArgs e)
        {
            //注册Grid,注册需要Form提交的控件
            string strScript = "<script language=javascript>"
                + " var myGrid=new Grid('" + this.CtrlXmlID + "',document.getElementById('" + this.GridDiv.ClientID + "'),'',true);"
                + "</script>";

            if (null != this._xmltpdoc && null != this._xmltpdoc.DocumentElement && this._enablevs)
                this.ViewState["GridHTML"] = this._xmltpdoc.DocumentElement.OuterXml;
            if (null != this.ViewState["GridHTML"])
            {
                this.ltHTML.Text = this.ViewState["GridHTML"].ToString();
                this.ltScript.Text = strScript;
            }else if (null != this._xmltpdoc && null != this._xmltpdoc.DocumentElement)
            {
                this.ltHTML.Text = this._xmltpdoc.DocumentElement.OuterXml;
                this.ltScript.Text = strScript;
            }
            if(this.IsPostBack)
                this.hlbState.Value=leofun.setvaltag(this.hlbState.Value, "IsPostBack", "true");
            if (null != this.CtrlXmlLand.Document)
            {
                //如果没有记录;就增加一条空记录;在客户端页面载入后js初始化时删除
                XmlNode xmlRowInit; XmlNodeList xmlColFormat; string strXPathCol;
                if (this.CtrlXmlLand.Document.DocumentElement.ChildNodes.Count < 1)
                {
                    XmlDocument xmldoc = this.CtrlXmlLand.Document;
                    xmlRowInit = xmldoc.CreateElement(this.CtrlWorkItem.DataSrc.Trim());
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
                }else{
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
            }
            else
            {
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
            //Grid行更新的关联事件
            this.Load += new EventHandler(GridLand_Load);
            this.PreRender += new EventHandler(GridLand_PreRender);
            //this.ltbCmd.SelectedIndexChanged += new EventHandler(ltbCmd_Command);
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

        /// <summary>
        /// 读取或设置是否隐藏标题
        /// </summary>
        public bool CtrlHiddenHead
        {
            get { return this._hiddenHead; }
            set { this._hiddenHead = value; }
        }

        /// <summary>
        /// 读取或设置是否生成显示表格
        /// </summary>
        public bool CtrlHiddenGrid
        {
            get { return this._hiddenGrid; }
            set { this._hiddenGrid = value; }
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
            this.ViewState["sendpage"] = "";
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
            if (this.CtrlDataSource == null) return;

            //增加行光标列
            if(null!=this.CtrlDataSource && !this.CtrlDataSource.Columns.Contains("RowNum"))
                this.CtrlDataSource.Columns.Add("RowNum",Type.GetType("System.Int32"));
            if (iPageSize < 1) iPageSize = 10;
            int iPageIndex=1;
            if(null!=this.ViewState["PageIndex" + CtrlWorkItem.DataSrc])
                iPageIndex = Convert.ToInt32(this.ViewState["PageIndex" + CtrlWorkItem.DataSrc]);
            for (int i = 0; null != this.CtrlDataSource && i < this.CtrlDataSource.Rows.Count; i++)
                this.CtrlDataSource.Rows[i]["RowNum"] = i + 1+(iPageIndex-1)*iPageSize;
            //如果是数字类型,值是0的,改为空的
            for (int i = 0;null!=this.CtrlDataSource && i < this.CtrlDataSource.Columns.Count; i++)
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
            
            try
            {
                if (iRecordCount < this.CtrlDataSource.Rows.Count)
                    iRecordCount = this.CtrlDataSource.Rows.Count;
            }
            catch
            {
                iRecordCount = 0;
            }
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
                //多次使用字典数据,只需加载一次字典
                //补充形式可能为 datasrc;paramitem:param
                //
                if (dictcol.DataSrc.Trim().Length > 0)
                {
                    bool isContinue = false;
                    for (int k = 0; k < j; k++)
                    {
                        string dictsrc = this.CtrlWorkItem.DictCol[k].DataSrc;
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
            try
            {
                if (null != ctrlNode.Attributes["id"] && "" != ctrlNode.Attributes["id"].Value)
                    this.CtrlXmlID = ctrlNode.Attributes["id"].Value;

                XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='tpfile']");
                if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                    this.CtrlTpFile = xmlProperty.Attributes["value"].Value;
                if (null!=this.CtrlWorkItem && !string.IsNullOrEmpty(this.CtrlWorkItem.TemplateEdit))
                    this.CtrlTpFile = this.CtrlWorkItem.TemplateEdit;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='ctrlalert']");
                if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                    this._ctrlAlertID = xmlProperty.Attributes["value"].Value;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='hiddenhead']");
                if (null != xmlProperty && "true" == xmlProperty.Attributes["value"].Value)
                    this.CtrlHiddenHead = true;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='hiddengrid']");
                if (null != xmlProperty && "true" == xmlProperty.Attributes["value"].Value)
                {
                    this.CtrlHiddenGrid = true;
                    this.GridDiv.Style["display"] = "none";
                }

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='enableviewstate']");
                if (null != xmlProperty && "true" == xmlProperty.Attributes["value"].Value)
                    this._enablevs = true;
                else if (null != xmlProperty && "false" == xmlProperty.Attributes["value"].Value)
                    this._enablevs = false;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='width']");
                if (null != xmlProperty)
                {
                    this.GridDiv.Width = Unit.Parse(xmlProperty.Attributes["value"].Value);
                    //if (this.GridDiv.Width.ToString().IndexOf("%") > -1)

                }
                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='height']");
                if (null != xmlProperty)
                    this.GridDiv.Height = Unit.Parse(xmlProperty.Attributes["value"].Value);

                this._attrNodeCtrl = ctrlNode;
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
                string strPath = "",strValue="";
                XmlNode xmlValueKey = null;
                if ("" != strKey)
                {
                    xmlValueKey = xmlRowList[i].SelectSingleNode(strKey);
                    if (null != xmlValueKey) strValue = xmlValueKey.InnerText;
                    strPath = "/*/*[" + strKey + "='" + strValue + "']";
                    xmlRow = xmldocLand.SelectSingleNode(strPath);
                }
                if (null == xmlRow)
                    xmlRow =xmlChOther.ParentNode.AppendChild(xmlRowList[i]);
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
                                string str = strDataItem.Replace(" ", "_x0020_");
                                string strXPath = string.Format("/*/{0}[{1}='{2}']", str, strValueFld, strValue);
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
            string itemAttrs = "name,relation,linkcol,columnkey,printtype,pagesize,manualrefresh,";
            string ctrlAttrs = "name,relation,linkcol,columnkey,printtype,pagesize,manualrefresh,"
                                + "id,typexml,ctrlAlter,ctrlchanged,ctrlschema,ctrlstate,ctrlhlbcmd,ctrlbtcommand,catalog,class,itemname,";

            XmlDocument xmldocSchema = this.CtrlXmlSchema.Document;
            
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
            xmldocSchema.DocumentElement.Attributes["id"].Value = this.CtrlXmlID + "_Schema";
            xmldocSchema.DocumentElement.Attributes["typexml"].Value = "Schema";
            xmldocSchema.DocumentElement.Attributes["ctrlAlert"].Value = this._ctrlAlertID;
            xmldocSchema.DocumentElement.Attributes["ctrlchanged"].Value = this.hlbChanged.ClientID;
            xmldocSchema.DocumentElement.Attributes["ctrlschema"].Value = this.hlbWidth.ClientID;
            xmldocSchema.DocumentElement.Attributes["ctrlstate"].Value = this.hlbState.ClientID;
            xmldocSchema.DocumentElement.Attributes["ctrlhlbcmd"].Value = this.hlb_cmd.ClientID;
            xmldocSchema.DocumentElement.Attributes["ctrlbtcommand"].Value = page.PgBtCmd.ClientID;
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
                string      strAttrName=this._attrNodeCtrl.Attributes[i].Name;
                if (ctrlAttrs.IndexOf(strAttrName + ",") >= 0)
                    continue;
                XmlAttribute attrTempCtrl = xmlRootEle.Attributes[strAttrName];
                if (null != attrTempCtrl) continue;
                attrTempCtrl = xmlRootEle.Attributes.Append(xmldocSchema.CreateAttribute(strAttrName));
                attrTempCtrl.Value = this._attrNodeCtrl.Attributes[i].Value;
            }
            
            #region  列规则属性
            //定义宽度
            NameObjectList paramColWidth = new NameObjectList();
            paramColWidth["菜单名称"] = page.PgUnitItem.UnitName;
            paramColWidth["表格名"] = this.CtrlItemName;
            
            XmlNodeList xmlColNodeList = xmldocSchema.SelectNodes("//xs:sequence//xs:element", xmlNsMgl);
            for (int i = 0; i < xmlColNodeList.Count; i++)
            {
                XmlNode xmlColSchema = xmlColNodeList[i];
                string colName = xmlColSchema.Attributes["name"].Value;
                DataRow[] drs = new DataRow[0];
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
        /// 设置标题,读取模板文件后设置
        /// </summary>
        private void setTitle()
        {
            XmlNode xmlTabTitle = this._xmltpdoc.SelectSingleNode("//*[@tabType='title']");
            if (null == xmlTabTitle) return;
            XmlNode xmlRowTitle = xmlTabTitle.SelectSingleNode("//*[@rowType='title']");
            XmlNode xmlRowTitleName = xmlTabTitle.SelectSingleNode("//*[@rowType='titlename']");
            //不显示列标题
            if (this.CtrlHiddenHead)
            {
                xmlRowTitle.ParentNode.RemoveChild(xmlRowTitle);
                return;
            }
            XmlNode xmlTdTitle = xmlRowTitle.SelectSingleNode(".//*[@tdType='coltitle']");
            XmlNode xmlTdTitleTp = xmlTdTitle;
            //定位列标题位置,并去掉模板列标题
            XmlNode xmlNextColTitle = null;
            while (null != xmlTdTitle)
            {
                xmlNextColTitle = xmlTdTitle.NextSibling;
                xmlTdTitle.ParentNode.RemoveChild(xmlTdTitle);
                xmlTdTitle = xmlRowTitle.SelectSingleNode(".//*[@tdType='coltitle']");
            }
            //建立列标题,
            if (null == xmlTdTitleTp.Attributes["colname"])
                xmlTdTitleTp.Attributes.Append(xmlTdTitleTp.OwnerDocument.CreateAttribute("colname"));
            if (null == xmlTdTitleTp.Attributes["datatype"])
                xmlTdTitleTp.Attributes.Append(xmlTdTitleTp.OwnerDocument.CreateAttribute("datatype"));
            if (null == xmlTdTitleTp.Attributes["width"])
                xmlTdTitleTp.Attributes.Append(xmlTdTitleTp.OwnerDocument.CreateAttribute("width"));
            int nw = 0;
            if (this.CtrlDataSource!=null)
            {
                for (int iw = 0; iw < this.CtrlDataSource.Columns.Count; iw++)
                {
                    string colName = this.CtrlDataSource.Columns[iw].ColumnName;
                    XmlNode xmlCol = this.CtrlXmlSchema.Document.SelectSingleNode("//xs:sequence//xs:element[@name='" + colName + "']", this._xmlNsMglSchema);
                    if (this.CtrlWorkItem.ColumnKey == colName || (null != xmlCol.Attributes["visible"] && "1" == xmlCol.Attributes["visible"].Value))
                        continue;
                    lastcol = colName;
                    nw++;
                }
                swidth = String.Format("{0:F}", (100.0 / nw)) + "%";
                for (int i = 0; i < this.CtrlDataSource.Columns.Count; i++)
                {
                    string colName = this.CtrlDataSource.Columns[i].ColumnName;
                    XmlNode xmlCol = this.CtrlXmlSchema.Document.SelectSingleNode("//xs:sequence//xs:element[@name='" + colName + "']", this._xmlNsMglSchema);
                    if (this.CtrlWorkItem.ColumnKey == colName || (null != xmlCol.Attributes["visible"] && "1" == xmlCol.Attributes["visible"].Value))
                        continue;
                    XmlNode xmlTdNew = xmlRowTitle.InsertBefore(xmlTdTitleTp.Clone(), xmlNextColTitle);
                    xmlTdNew.Attributes["colname"].Value = colName;
                    xmlTdNew.Attributes["datatype"].Value = xmlCol.Attributes["type"].Value;
                    if (null != xmlCol.Attributes["width"] && "" != xmlCol.Attributes["width"].Value)
                        xmlTdNew.Attributes["width"].Value = xmlCol.Attributes["width"].Value;
                    else
                        if (lastcol == colName) xmlTdNew.Attributes["width"].Value = "";
                        else xmlTdNew.Attributes["width"].Value = swidth;
                        
                    XmlNode xmlTitleLb = xmlTdNew.SelectSingleNode(".//*[@colname]");
                    if (null == xmlTitleLb) continue;
                    xmlTitleLb.Attributes["colname"].Value = this.CtrlDataSource.Columns[i].ColumnName;
                    if ("INPUT" == xmlTitleLb.LocalName.ToUpper())
                    {
                        if (null == xmlTitleLb.Attributes["value"])
                            xmlTitleLb.Attributes.Append(xmlTitleLb.OwnerDocument.CreateAttribute("value"));
                        if (null != xmlCol.Attributes["title"] && "" != xmlCol.Attributes["title"].Value)
                            xmlTitleLb.Attributes["value"].Value = xmlCol.Attributes["title"].Value;
                        else
                            xmlTitleLb.Attributes["value"].Value = this.CtrlDataSource.Columns[i].ColumnName;
                    }
                    else
                    {
                        if (null != xmlCol.Attributes["title"] && "" != xmlCol.Attributes["title"].Value)
                            xmlTitleLb.InnerXml = xmlCol.Attributes["title"].Value;
                        else
                            xmlTitleLb.InnerText = this.CtrlDataSource.Columns[i].ColumnName;
                    }
                }
            }
            //是否显示标题行
            if (this.CtrlHiddenHead)
            {
                if (null == xmlRowTitle.Attributes["style"])
                    xmlRowTitle.Attributes.Append(xmlRowTitle.OwnerDocument.CreateAttribute("style"));
                xmlRowTitle.Attributes["style"].Value += ";display:none;";
                if (xmlRowTitleName!=null)
                {
                    if (null == xmlRowTitleName.Attributes["style"])
                        xmlRowTitleName.Attributes.Append(xmlRowTitleName.OwnerDocument.CreateAttribute("style"));
                    xmlRowTitleName.Attributes["style"].Value += ";display:none;";
                }
            }
            if (xmlRowTitleName != null)
            {

                if (null == xmlRowTitleName.ChildNodes[0].Attributes["colspan"])
                    xmlRowTitleName.ChildNodes[0].Attributes.Append(xmlRowTitleName.ChildNodes[0].OwnerDocument.CreateAttribute("colspan"));
                xmlRowTitleName.ChildNodes[0].Attributes["colspan"].Value = (nw + 1).ToString();
                BasePage page = this.Page as BasePage;
                xmlRowTitleName.ChildNodes[0].InnerText = page.PgUnitItem.UnitName;//this.CtrlWorkItem.ItemName;
            }
            XmlNode xmlDivTitle = this._xmltpdoc.SelectSingleNode("//*[@divtype='title']");
            if (null == xmlDivTitle.Attributes["width"])
                xmlDivTitle.Attributes.Append(xmlDivTitle.OwnerDocument.CreateAttribute("width"));
            xmlDivTitle.Attributes["style"].Value += ";width:" + this.GridDiv.Width.ToString();
        }


        /// <summary>
        /// 设置明细,读取模板文件后设置
        /// </summary>
        private void setDetail()
        {
            XmlNode xmlTableDetail = this._xmltpdoc.SelectSingleNode("//*[@tabType='detail']");
            XmlNode xmlRowDetail = xmlTableDetail.SelectSingleNode("//*[@rowType='detail']");
            XmlNode xmlTdDetail = xmlRowDetail.SelectSingleNode(".//*[@tdType='coldata']");
            XmlNode xmlTdNext = null;
            while (null != xmlTdDetail)
            {
                xmlTdNext = xmlTdDetail.NextSibling;
                xmlTdDetail.ParentNode.RemoveChild(xmlTdDetail);
                xmlTdDetail = xmlRowDetail.SelectSingleNode(".//*[@tdType='coldata']");
            }
            //建立的明细区的列单元格
            //if (this.CtrlDataSource == null) return;
            for (int i = 0; i < this.CtrlDataSource.Columns.Count; i++)
                this.setCol(this.CtrlDataSource.Columns[i], xmlRowDetail, xmlTdNext,i);
            XmlNode xmlRowTp = xmlTableDetail.SelectSingleNode("thead");
            if (null != xmlRowTp)
                xmlRowTp.ParentNode.RemoveChild(xmlRowTp);
            XmlNodeList xmlTdNodeList = xmlRowDetail.SelectNodes("td");
            if (null != xmlTableDetail)
            {
                if (null == xmlTableDetail.Attributes["datasrc"])
                    xmlTableDetail.Attributes.Append(xmlTableDetail.OwnerDocument.CreateAttribute("datasrc"));
                xmlTableDetail.Attributes["datasrc"].Value = "#" + this.CtrlXmlID;
            }
            XmlNode xmlDivDetail = this._xmltpdoc.SelectSingleNode("//*[@divtype='detail']");
            if (null == xmlDivDetail.Attributes["width"])
                xmlDivDetail.Attributes.Append(xmlDivDetail.OwnerDocument.CreateAttribute("width"));
            xmlDivDetail.Attributes["style"].Value += ";width:" + this.GridDiv.Width.ToString();
        }


        /// <summary>
        /// 设置明细列,读取模板文件后设置
        /// </summary>
        /// <param name="col">列</param>
        /// <param name="xmlRow">明细行</param>
        /// <param name="xmlTdNext">列单元格位置</param>
        private XmlNode setCol(DataColumn col, XmlNode xmlRow, XmlNode xmlTdNext,int ni)
        {
            XmlNode xmlCol = this.CtrlXmlSchema.Document.SelectSingleNode("//xs:sequence//xs:element[@name='" + col.ColumnName + "']", this._xmlNsMglSchema);
            if (this.CtrlWorkItem.ColumnKey == col.ColumnName || (null != xmlCol.Attributes["visible"] && "1" == xmlCol.Attributes["visible"].Value))
                return null;
            string strDbType = xmlCol.Attributes["type"].Value;
            switch (strDbType.ToLower())
            {
                case "xs:string":
                    strDbType = "string";
                    break;
                case "xs:int":
                case "xs:integer":
                    strDbType = "int";
                    break;
                case "xs:decimal":
                case "xs:double":
                case "xs:float":
                    strDbType = "decimal";
                    break;
                case "xs:money":
                    strDbType = "decimal";
                    break;
                case "xs:date":
                case "xs:datetime":
                    strDbType = "date";
                    break;
                case "xs:boolean":
                    strDbType = "bool";
                    break;
                default:
                    strDbType = "string";
                    break;
            }
            //检查是否属于字典类型
            if (null != xmlCol.Attributes["dataitem"] && null != xmlCol.Attributes["textcol"] && null != xmlCol.Attributes["valuecol"]
                && "" != xmlCol.Attributes["dataitem"].Value && "" != xmlCol.Attributes["textcol"].Value && "" != xmlCol.Attributes["valuecol"].Value)
            {
                string strDataItem = xmlCol.Attributes["dataitem"].Value;
                if (null != this.CtrlDsDict.Tables[strDataItem] &&
                        this.CtrlDsDict.Tables[strDataItem].Columns.Contains(xmlCol.Attributes["textcol"].Value) &&
                        this.CtrlDsDict.Tables[strDataItem].Columns.Contains(xmlCol.Attributes["valuecol"].Value))
                    strDbType = "select";
            }
            string strDbTypeTmp = strDbType;
            if (null != xmlCol.Attributes["datastyle"] && "" != xmlCol.Attributes["datastyle"].Value)
                strDbType = xmlCol.Attributes["datastyle"].Value;

            XmlNode xmlTd = null;
            if (null != xmlCol.Attributes["isreadonly"]
                    && ("true" == xmlCol.Attributes["isreadonly"].Value || "1" == xmlCol.Attributes["isreadonly"].Value))
            {
                XmlNode xmlRowReadOnly = this._xmltpdoc.SelectSingleNode("//*[@rowType='readonly']");
                xmlTd = xmlRowReadOnly.SelectSingleNode(".//*[@datatype='" + strDbType + "']");
                if (null == xmlTd && strDbTypeTmp != strDbType)
                {
                    strDbType = strDbTypeTmp;
                    xmlTd = xmlRowReadOnly.SelectSingleNode(".//*[@datatype='" + strDbType + "']");
                }
                if (null == xmlTd)
                {
                    xmlTd = xmlRowReadOnly.SelectSingleNode(".//*[@datatype='string']");
                    strDbType = "string";
                }
            }
            else
            {
                XmlNode xmlRowEdit = this._xmltpdoc.SelectSingleNode("//*[@rowType='edit']");
                xmlTd = xmlRowEdit.SelectSingleNode(".//*[@datatype='" + strDbType + "']");
                if (null == xmlTd && strDbTypeTmp != strDbType)
                {
                    strDbType = strDbTypeTmp;
                    xmlTd = xmlRowEdit.SelectSingleNode(".//*[@datatype='" + strDbType + "']");
                }
                if (null == xmlTd)
                {
                    xmlTd = xmlRowEdit.SelectSingleNode(".//*[@datatype='string']");
                    strDbType = "string";
                }
            }
            if (null == xmlTd.Attributes["colname"])
                xmlTd.Attributes.Append(xmlTd.OwnerDocument.CreateAttribute("colname"));
            if (null == xmlTd.Attributes["width"])
                xmlTd.Attributes.Append(xmlTd.OwnerDocument.CreateAttribute("width"));
            else
                if (lastcol == col.ColumnName) xmlTd.Attributes["width"].Value = "";
                else xmlTd.Attributes["width"].Value = swidth;

            //模板单元格作为列单元,//如果是字典列;处理绑定数据
            XmlNode xmlTdNew = xmlRow.InsertBefore(xmlTd.Clone(), xmlTdNext);
            xmlTdNew.Attributes["colname"].Value = col.ColumnName;
            //字段列对格式的处理,增加格式列字段名属性
            if (null == xmlTdNew.Attributes["format"] && null != xmlCol.Attributes["format"] && "" != xmlCol.Attributes["format"].Value)
            {
                xmlTdNew.Attributes.Append(xmlTdNew.OwnerDocument.CreateAttribute("format"));
                xmlTdNew.Attributes["format"].Value = xmlCol.Attributes["format"].Value;
            }
            if (null == xmlTdNew.Attributes["formatfld"] && null != xmlCol.Attributes["formatfld"] && "" != xmlCol.Attributes["formatfld"].Value)
            {
                xmlTdNew.Attributes.Append(xmlTdNew.OwnerDocument.CreateAttribute("formatfld"));
                xmlTdNew.Attributes["formatfld"].Value = xmlCol.Attributes["formatfld"].Value;
            }
            if (null != xmlCol.Attributes["width"] && "" != xmlCol.Attributes["width"].Value)
                xmlTdNew.Attributes["width"].Value = xmlCol.Attributes["width"].Value;
            //具有valuefld属性的控件,绑定指定的列字段:用于超链接类型,没有值就绑定字段自己
            XmlNodeList xmlCtrlList = xmlTdNew.SelectNodes(".//*[@valuefld]");
            for (int i = 0; i < xmlCtrlList.Count; i++)
            {
                XmlNode xmlNodeValue = xmlCtrlList[i];
                if (null == xmlNodeValue.Attributes["datafld"])
                    xmlNodeValue.Attributes.Append(xmlNodeValue.OwnerDocument.CreateAttribute("datafld"));
                if (null == xmlCol.Attributes["valuefld"])
                    xmlNodeValue.Attributes["datafld"].Value = "";
                else
                    xmlNodeValue.Attributes["datafld"].Value = xmlCol.Attributes["valuefld"].Value;
                xmlNodeValue.Attributes["valuefld"].Value = xmlCtrlList[i].Attributes["datafld"].Value;
                //把当前列workitem定义的属性赋值给控件模板
                for (int k = 0; k < xmlCol.Attributes.Count; k++)
                {
                    string attname = xmlCol.Attributes[k].LocalName;
                    if ("datafld" == attname || "valuefld" == attname)
                        continue;
                    if (null != xmlNodeValue.Attributes[xmlCol.Attributes[k].LocalName])
                        xmlNodeValue.Attributes[xmlCol.Attributes[k].LocalName].Value = xmlCol.Attributes[k].Value;
                }
            }
            xmlCtrlList = xmlTdNew.SelectNodes(".//*[@colname]");
            for (int i = 0; i < xmlCtrlList.Count; i++)
            {
                if (null == xmlCtrlList[i].Attributes["datafld"])
                    xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("datafld"));
                //有格式列字段,首先显示格式列字段,是select控件的直接绑定字段
                if (null != xmlCol.Attributes["formatfld"] && "" != xmlCol.Attributes["formatfld"].Value)
                {
                    xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("formatfld"));
                    xmlCtrlList[i].Attributes["formatfld"].Value = xmlCol.Attributes["formatfld"].Value;
                    if ("select" != xmlCtrlList[i].LocalName.ToLower())
                        xmlCtrlList[i].Attributes["datafld"].Value = xmlCol.Attributes["formatfld"].Value;
                    else
                        xmlCtrlList[i].Attributes["datafld"].Value = col.ColumnName;
                }
                else
                    xmlCtrlList[i].Attributes["datafld"].Value = col.ColumnName;
                xmlCtrlList[i].Attributes["colname"].Value = col.ColumnName;
                if (null != xmlCol.Attributes["maxlength"] && "" != xmlCol.Attributes["maxlength"].Value)
                {
                    if (null == xmlCtrlList[i].Attributes["maxlength"])
                        xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("maxlength"));
                    xmlCtrlList[i].Attributes["maxlength"].Value = xmlCol.Attributes["maxlength"].Value;
                }
                //字典列数据,填充字典内容
                if (("select" == strDbType || "selectbtn" == strDbType) && "select" == xmlCtrlList[i].LocalName.ToLower())
                {
                    if (null == xmlCtrlList[i].Attributes["DataSource"])
                        xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("DataSource"));
                    xmlCtrlList[i].Attributes["DataSource"].Value = xmlCol.Attributes["dataitem"].Value;
                    if (null == xmlCtrlList[i].Attributes["DataTextField"])
                        xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("DataTextField"));
                    xmlCtrlList[i].Attributes["DataTextField"].Value = xmlCol.Attributes["textcol"].Value;
                    if (null == xmlCtrlList[i].Attributes["DataValueField"])
                        xmlCtrlList[i].Attributes.Append(xmlCtrlList[i].OwnerDocument.CreateAttribute("DataValueField"));
                    xmlCtrlList[i].Attributes["DataValueField"].Value = xmlCol.Attributes["valuecol"].Value;
                    xmlCtrlList[i].AppendChild(xmlCtrlList[i].OwnerDocument.CreateElement("option"));
                    for (int j = 0; j < this.CtrlDsDict.Tables[xmlCol.Attributes["dataitem"].Value].Rows.Count; j++)
                    {
                        DataRow dr = this.CtrlDsDict.Tables[xmlCol.Attributes["dataitem"].Value].Rows[j];
                        if (null == dr[xmlCol.Attributes["textcol"].Value] || DBNull.Value == dr[xmlCol.Attributes["textcol"].Value]
                            || null == dr[xmlCol.Attributes["valuecol"].Value] || DBNull.Value == dr[xmlCol.Attributes["valuecol"].Value])
                            continue;
                        XmlNode xmloption = xmlCtrlList[i].OwnerDocument.CreateElement("option");
                        XmlAttribute attrValue = xmlCtrlList[i].OwnerDocument.CreateAttribute("value");
                        attrValue.Value = dr[xmlCol.Attributes["valuecol"].Value].ToString();
                        xmloption.InnerXml = dr[xmlCol.Attributes["textcol"].Value].ToString();
                        xmloption.Attributes.Append(attrValue);
                        xmlCtrlList[i].AppendChild(xmloption);
                    }
                }//if("select"==strDbType && "select"==xmlCtrlList[i].LocalName.ToLower())
            }//for(int i=0;i<xmlCtrlList.Count;i++)
            return xmlTdNew;
        }


        /// <summary>
        /// 设置脚注
        /// </summary>
        private void setFoot()
        {
            XmlNode xmlTableFoot = this._xmltpdoc.SelectSingleNode("//*[@tabType='foot']");
            if (null == xmlTableFoot) return;
            XmlNode xmlRowFoot = xmlTableFoot.SelectSingleNode("//*[@rowType='foot']");
            XmlNode xmlTdFoot = xmlRowFoot.SelectSingleNode(".//*[@tdType='coldata']");
            XmlNode xmlTdFootTp = xmlTdFoot;
            //定位列标题位置,并去掉模板列标题
            XmlNode xmlNextColFoot = null;
            while (null != xmlTdFoot)
            {
                xmlNextColFoot = xmlTdFoot.NextSibling;
                xmlTdFoot.ParentNode.RemoveChild(xmlTdFoot);
                xmlTdFoot = xmlRowFoot.SelectSingleNode(".//*[@tdType='coldata']");
            }
            //建立列标题,
            if (null == xmlTdFootTp.Attributes["colname"])
                xmlTdFootTp.Attributes.Append(xmlTdFootTp.OwnerDocument.CreateAttribute("colname"));
            if (null == xmlTdFootTp.Attributes["datatype"])
                xmlTdFootTp.Attributes.Append(xmlTdFootTp.OwnerDocument.CreateAttribute("datatype"));

            if (null == xmlTdFootTp.Attributes["width"])
                xmlTdFootTp.Attributes.Append(xmlTdFootTp.OwnerDocument.CreateAttribute("width"));

            //if (this.CtrlDataSource == null) return;
            for (int i = 0; i < this.CtrlDataSource.Columns.Count; i++)
            {
                string colName = this.CtrlDataSource.Columns[i].ColumnName;
                XmlNode xmlCol = this.CtrlXmlSchema.Document.SelectSingleNode("//xs:sequence//xs:element[@name='" + colName + "']", this._xmlNsMglSchema);
                if (this.CtrlWorkItem.ColumnKey == colName || (null != xmlCol.Attributes["visible"] && "1" == xmlCol.Attributes["visible"].Value))
                    continue;
                XmlNode xmlTdNew = xmlRowFoot.InsertBefore(xmlTdFootTp.Clone(), xmlNextColFoot);
                XmlNode xmlFootLb = xmlTdNew.SelectSingleNode(".//*[@colname]");
                xmlTdNew.Attributes["colname"].Value = colName;
                if (null != xmlCol.Attributes["width"] && "" != xmlCol.Attributes["width"].Value)
                    xmlTdNew.Attributes["width"].Value = xmlCol.Attributes["width"].Value;
                else
                    if (lastcol == colName) xmlTdNew.Attributes["width"].Value = "";
                    else xmlTdNew.Attributes["width"].Value = swidth;

                if (null == xmlFootLb) continue;
                //设置列的格式及数据类型属性
                XmlAttribute attrFormate = xmlCol.Attributes["format"];
                if (null != attrFormate && "" != attrFormate.Value && null == xmlTdNew.Attributes["formate"])
                    xmlTdNew.Attributes.Append(xmlTdNew.OwnerDocument.CreateAttribute("formate"));
                if (null != attrFormate && null != xmlTdNew.Attributes["formate"])
                    xmlTdNew.Attributes["formate"].Value = attrFormate.Value;
                if (null == xmlTdNew.Attributes["formatfld"] && null != xmlCol.Attributes["formatfld"] && "" != xmlCol.Attributes["formatfld"].Value)
                {
                    xmlTdNew.Attributes.Append(xmlTdNew.OwnerDocument.CreateAttribute("formatfld"));
                    xmlTdNew.Attributes["formatfld"].Value = xmlCol.Attributes["formatfld"].Value;
                }
                else if (null == xmlTdNew.Attributes["formatfld"] && null != xmlCol.Attributes["formatfoot"] && "" != xmlCol.Attributes["formatfoot"].Value)
                {
                    xmlTdNew.Attributes.Append(xmlTdNew.OwnerDocument.CreateAttribute("formatfld"));
                    xmlTdNew.Attributes["formatfld"].Value = xmlCol.Attributes["name"].Value + "_格式";
                }
                //不是计算字段不进行绑定
                string strType = xmlCol.Attributes["type"].Value;
                switch (strType.ToLower())
                {
                    case "xs:string":
                        strType = "string";
                        break;
                    case "xs:int":
                    case "xs:integer":
                        strType = "int";
                        break;
                    case "xs:decimal":
                    case "xs:double":
                    case "xs:float":
                        strType = "decimal";
                        break;
                    case "xs:money":
                        strType = "decimal";
                        break;
                    case "xs:date":
                    case "xs:datetime":
                        strType = "date";
                        break;
                    case "xs:boolean":
                        strType = "bool";
                        break;
                }
                xmlTdNew.Attributes["datatype"].Value = strType;
                if ("int" != strType && "decimal" != strType && "string"!=strType)
                    continue;
                if (null == xmlFootLb.Attributes["datafld"])
                    xmlFootLb.Attributes.Append(xmlFootLb.OwnerDocument.CreateAttribute("datafld"));
                if (null != xmlCol.Attributes["formatfld"] && "" != xmlCol.Attributes["formatfld"].Value)
                    xmlFootLb.Attributes["datafld"].Value = xmlCol.Attributes["formatfld"].Value;
                else if (null != xmlCol.Attributes["formatfoot"] && "" != xmlCol.Attributes["formatfoot"].Value)
                    xmlFootLb.Attributes["datafld"].Value = xmlCol.Attributes["name"].Value + "_格式";
                xmlFootLb.Attributes["colname"].Value = colName;
                if ("INPUT" == xmlFootLb.LocalName.ToUpper())
                {
                    if (null == xmlFootLb.Attributes["value"])
                        xmlFootLb.Attributes.Append(xmlFootLb.OwnerDocument.CreateAttribute("value"));
                    xmlFootLb.Attributes["value"].Value = "";
                }
                else
                {
                    xmlFootLb.InnerText = "　";
                }
            }//for(int i=0;i<this.CtrlDataSource.Columns.Count;i++)
        }

        /// <summary>
        /// 生成行参数
        /// </summary>
        /// <param name="xmlNodeRow"></param>
        /// <returns></returns>
        public NameObjectList CreateParamRow(XmlNode xmlNodeRow)
        {
            BasePage page = this.Page as BasePage;
            XmlNodeList xmlColList = this.CtrlXmlSchema.Document.SelectNodes("//xs:sequence//xs:element", this._xmlNsMglSchema);
            NameObjectList param = BuildParamList.BuildParams(page.PgParamXmlDoc);
            for (int j = 0; j < xmlColList.Count; j++)
            {
                XmlNode xmlNodeValue = xmlNodeRow.SelectSingleNode(xmlColList[j].Attributes["name"].Value);
                this.setParam(param, xmlNodeValue, xmlColList[j]);
            }
            return param;
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
                    case "xs:money":
                        param[colname] = String.Format("{0:C}", Convert.ToDecimal(strvalue));
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

            string[] strParams = new string[] { spagesize, valx.ToString(), QW, FW, FGroup, FSumcol, FWhere, topnum.ToString(), this._workItem.InitFilter };
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

        /// <summary>
        /// 导入到指定数据岛上数据
        /// </summary>
        private void importLand()
        {
            BasePage page = this.Page as BasePage;
            if (null == page) return;
            AppendItem appendItem = page.PgUnitItem.GetAppendItem(BuildParamList.getValue(page.PgParamXmlDoc,"AppendItem"));
            NameObjectList[] paramList = BuildParamList.BuildParamsList(page.PgParamXmlDoc);
            DataSet ds = new DataSet(appendItem.ItemName);
            page.PgQuery.FillDataSet(appendItem.DataSrc, paramList, ds);
            if (ds.Tables.Count < 1 || null == ds.Tables[0])
                return;
            DataTable tab = ds.Tables[0];
            string strXPath = "//xs:sequence//xs:element[@name!='RowNum']";
            XmlNodeList xmlColList = this.CtrlDBSchema.SelectNodes(strXPath);
            int icount = this.CtrlDBSchema.DocumentElement.ChildNodes.Count;
            for (int i = 0; i <tab.Rows.Count; i++)
            {
                XmlNode     xmlRow=this.CtrlDBXmlDoc.DocumentElement.AppendChild(this.CtrlDBXmlDoc.CreateElement(this.CtrlWorkItem.DataSrc));
                XmlNode xmlNode = xmlRow.AppendChild(xmlRow.OwnerDocument.CreateElement("RowNum"));
                xmlNode.AppendChild(xmlNode.OwnerDocument.CreateTextNode(Convert.ToString( icount + i+1)));

                for (int j = 0; j < xmlColList.Count; j++)
                {
                    string  colname=xmlColList[j].Attributes["name"].Value;
                    xmlNode=xmlRow.AppendChild(xmlRow.OwnerDocument.CreateElement(colname));
                    if (!tab.Columns.Contains(colname))
                        continue;
                    else
                        xmlNode.AppendChild(xmlNode.OwnerDocument.CreateTextNode((null == tab.Rows[i][colname]) ? "" : tab.Rows[i][colname].ToString()));
                    DataColumn col = tab.Columns[colname];
                    if ("DateTime" != col.DataType.Name)
                        continue;
                    if (null != xmlColList[j].Attributes["formatfld"]) continue;
                    //该日期字段的所有行
                    if (null !=xmlNode.FirstChild && XmlNodeType.Text == xmlNode.FirstChild.NodeType)
                        xmlNode.FirstChild.Value = DateTime.Parse(xmlNode.FirstChild.Value).ToString("yyyy-MM-dd");
                }
            }
        }

        #endregion

        #region 基类的回传命令事件
        /// <summary>
        /// 基类事件,在页面回传事件调用
        /// 执行回传命令:命令参数样式: @key=value,@key=value,@key=value
        /// 参数内容: CtrlID 触发事件的控件, Cmd 命令参数; TabID Tab页ID;CmdFull 全命令参数;CmdP 其他命令参数
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