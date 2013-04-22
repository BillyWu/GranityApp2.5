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
    ///		XML样式表展示
    /// </summary>
    public partial class XSLTLand : BaseControl
    {
        //控件显示的容器,脚本的容器

        private WorkItem _workItem = null;
        //产生数据岛的ID名称
        private string _xmllandID = "xmlIsland";
        private string _ctrlAlertID = "";	//校验提示的控件
        //控件模板文件,默认一个文件
        private string _xsltFile = "TrvIsland.xslt";
        ///是否使用viewstate
        private bool _enablevs = false;
        //控件属性节点
        private XmlNode _attrNodeCtrl = null;

        #region 控件内事件函数
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
            //注册Grid,注册需要Form提交的控件
            string strScript = "<script language=javascript>"
                + "</script>";

                this.ltScript.Text = strScript;
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
        /// 读取或设置XSLT样式模板文件路径
        /// </summary>
        public string CtrlXSLTFile
        {
            get { return this._xsltFile; }
            set { this._xsltFile = value; }
        }

        #endregion

        #region 基类的数据绑定实现

        /// <summary>
        /// 如果有单据编号,是主表的就对新记录设置新的编号;是明细的并且是关联字段的按照主表的编号关联更新;
        /// 在页面使用时;先调用主Grid的SetLinkUpdate();然后再调用明细的
        /// </summary>
        public override void SetLinkUpdate()
        {
            return;
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
            DataTable counttab = null;
            if (dsCount.Tables.Count > 0)
                counttab = dsCount.Tables[0];
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
            return;
        }

        /// <summary>
        /// 依据table提供的数据环境,绑定字典类型数据
        /// </summary>
        /// <param name="workGrid">提供参数的数据环境</param>
        public override void CtrlDataBindDict(DataRow dr)
        {
            return;
        }


        /// <summary>
        /// 字典类型的数据绑定
        /// </summary>
        public override void CtrlDataBindDict()
        {
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