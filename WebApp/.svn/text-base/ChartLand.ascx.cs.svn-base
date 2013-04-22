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
    ///		Chart图表,服务端不关联数据
    /// </summary>
    public partial class ChartLand : BaseControl
    {
        //控件显示的容器,脚本的容器

        //控件模板,用于页面展现
        private XmlDocument _xmltpdoc = new XmlDocument();
        //控件模板文件,默认一个文件
        private string _tpGridFile = "ControlTemplate/Chart/ChartDefault.htm";
        private string _chartID = "ChartLand";
        private string _offsetx = "0";
        private string _offsety = "0";
        //控件属性节点
        private XmlNode _attrNodeCtrl = null;

        #region 控件内事件函数
        private void GridLand_Load(object sender, System.EventArgs e)
        {
        }


        private void GridLand_PreRender(object sender, System.EventArgs e)
        {
            this.setTpSchema();
            //注册Chart
            string strScript = "<script language=javascript>"
                + " var myChart=new Chart('"+this.CtrlItemName+"',document.getElementById('" + this.CtrlChartID + "'));"
                + "</script>";

            if (null != this._xmltpdoc && null != this._xmltpdoc.DocumentElement)
            {
                this.ltHTML.Text = this._xmltpdoc.DocumentElement.OuterXml;
                this.ltScript.Text = strScript;
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
            this.Load += new EventHandler(GridLand_Load);
            this.PreRender += new EventHandler(GridLand_PreRender);
        }
        #endregion

        #region 内部对象

        /// <summary>
        /// 读取或设置Chart样式模板文件路径
        /// </summary>
        public string CtrlTpFile
        {
            get { return this._tpGridFile; }
            set { this._tpGridFile = value; }
        }

        /// <summary>
        ///  读取和设置Chart图表ID;
        /// </summary>
        public string CtrlChartID
        {
            get { return this._chartID; }
            set { this._chartID = value; }
        }

        #endregion

        #region 基类的数据绑定实现

        /// <summary>
        /// 如果有单据编号,是主表的就对新记录设置新的编号;是明细的并且是关联字段的按照主表的编号关联更新;
        /// 在页面使用时;先调用主Grid的SetLinkUpdate();然后再调用明细的
        /// </summary>
        public override void SetLinkUpdate()
        {
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
                    this.CtrlChartID = ctrlNode.Attributes["id"].Value;

                XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='tpfile']");
                if (null != xmlProperty && "" != xmlProperty.Attributes["value"].Value)
                    this.CtrlTpFile = xmlProperty.Attributes["value"].Value;

                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='width']");
                if (null != xmlProperty)
                    this.GridDiv.Width = Unit.Parse(xmlProperty.Attributes["value"].Value);
                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='height']");
                if (null != xmlProperty)
                    this.GridDiv.Height = Unit.Parse(xmlProperty.Attributes["value"].Value);
                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='offsetx']");
                if (null != xmlProperty)
                    this._offsetx = xmlProperty.Attributes["value"].Value;
                xmlProperty = ctrlNode.SelectSingleNode("Property[@name='offsety']");
                if (null != xmlProperty)
                    this._offsety = xmlProperty.Attributes["value"].Value;

                this._attrNodeCtrl = ctrlNode;
                this.CtrlType = "Chart";
                //读取Grid模板
                this._xmltpdoc.Load(this.Server.MapPath(this.CtrlTpFile));
            }
            catch (Exception ex)
            {
                ExceptionManager.Publish(ex);
                return;
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
                    this.CtrlDataBind();
                    break;
                case "cmd_nav:prev":
                    this.CtrlDataBind();
                    break;
                case "cmd_nav:next":
                    this.CtrlDataBind();
                    break;
                case "cmd_nav:last":
                    this.CtrlDataBind();
                    break;
                case "cmd_nav:jump":
                    this.CtrlDataBind();
                    break;
            }
        }

        #endregion

        #region  内部方法


        /// <summary>
        /// 设置模板属性
        /// </summary>
        private void setTpSchema()
        {
            XmlNode xmlGroup = this._xmltpdoc.SelectSingleNode("//*[@chartElement='chart']");
            XmlNode xmlChartDiv = this._xmltpdoc.SelectSingleNode("//*[@chartElement='chartDiv']");
            if (null == xmlGroup) return;
            //图表控件ID
            if (null == xmlGroup.Attributes["id"])
                xmlGroup.Attributes.Append(xmlGroup.OwnerDocument.CreateAttribute("id"));
            xmlGroup.Attributes["id"].Value = this.CtrlChartID;
            //图表控件宽高
            if (null == xmlGroup.Attributes["coordsize"])
                xmlGroup.Attributes.Append(xmlGroup.OwnerDocument.CreateAttribute("coordsize"));
            xmlGroup.Attributes["coordsize"].Value = Convert.ToInt16(this.GridDiv.Width.Value).ToString() + "," 
                                                    + Convert.ToInt16(this.GridDiv.Height.Value).ToString();
            if (null == xmlGroup.Attributes["style"])
                xmlGroup.Attributes.Append(xmlGroup.OwnerDocument.CreateAttribute("style"));
            xmlGroup.Attributes["style"].Value += ";width:" + Convert.ToInt16(this.GridDiv.Width.Value).ToString() + ";"
                                                    + "height:" + Convert.ToInt16(this.GridDiv.Height.Value).ToString() + ";";
            if (null != xmlChartDiv)
            {
                if (null == xmlChartDiv.Attributes["style"])
                    xmlChartDiv.Attributes.Append(xmlChartDiv.OwnerDocument.CreateAttribute("style"));
                xmlChartDiv.Attributes["style"].Value += ";width:" + (Convert.ToInt16(this.GridDiv.Width.Value)+5).ToString() + ";"
                                                    + "height:" + (Convert.ToInt16(this.GridDiv.Height.Value)+5).ToString() + ";";
            }
            //图表控件原点
            if (null == xmlGroup.Attributes["coordorigin"])
                xmlGroup.Attributes.Append(xmlGroup.OwnerDocument.CreateAttribute("coordorigin"));
            xmlGroup.Attributes["coordorigin"].Value = this._offsetx + "," + this._offsety;

            //图表控件的其他属性:X,Y轴坐标放大比例;X,Y轴起点数值;序列字段,Legend字段
            string[] ProList ={ "scalex", "scaley", "scaled", "scaler", "spacx", "spacy", "spacdd", "spacd", "radixposx", "radixposy", "radixposd", "offsetd",
                        "maxx", "maxy", "maxd", "charttype", "dataviewpoint", "series","dialanglestart","dialangleend",
                        "legend", "legendx", "legendy", "legenddisp", "legendspac", "legendwidth",
                        "labeldisp", "labelwx", "labelhx", "labelwy", "labelhy" };
            for (int i = 0; i < ProList.Length; i++)
            {
                XmlNode xmlProperty = this._attrNodeCtrl.SelectSingleNode("Property[@name='"+ProList[i]+"' and @value]");
                if (null == xmlProperty) continue;
                if (null == xmlGroup.Attributes[ProList[i]])
                    xmlGroup.Attributes.Append(xmlGroup.OwnerDocument.CreateAttribute(ProList[i]));
                xmlGroup.Attributes[ProList[i]].Value = xmlProperty.Attributes["value"].Value;
            }

        }

        #endregion

    }
}