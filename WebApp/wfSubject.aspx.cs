using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Xml;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Business.DataManager;
using Estar.Business.UserRight;
using Estar.Common.Tools;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;


namespace Estar.WebApp
{
    /// <summary>
    /// 网站主题页面轻量级应用:不进行以数据为中心的操作(不上传文件,不保存更新数据,不导入数据)
    /// 页面统一内容:单元结构,无参数数据岛
    /// 页面只展示HTML内容,链接页面采用get方式传递参数,不通过后台处理参数,不回传页面
    /// 默认模板 网站模板.htm
    /// </summary>
    public partial class wfSubject : BasePage
    {
        private TemplateModule editTp;		//编辑模板

        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.IsPostBack) return;

            for (int i = 0; i < this.PgUserControlList.Count; i++)
            {
                BaseControl ctrl = this.PgUserControlList[i];
                if (null == ctrl) continue;
                ctrl.CtrlDataBind();
            }

        }

		/// <summary>
		/// 最终初始化Js脚本
		/// </summary>
		/// <param name="sender">事件源</param>
		/// <param name="e">包含事件数据的EventArgs 对象</param>
        private void frmPreRender(object sender, System.EventArgs e)
        {
            this.PgBuildJs();
        }

        #region Web窗体设计器生成的代码
        override protected void OnInit(EventArgs e)
        {
            //
            // CODEGEN: 该调用是 ASP.NET Web 窗体设计器所必需的。
            //
            InitializeComponent();

            this.PgInitRequestParams();
            this.PgUnitName = BuildParamList.getValue(this.PgParamXmlDoc, "UnitName");
            if (string.IsNullOrEmpty(this.PgUnitName))
                this.PgUnitName = "网站首页";
            this.PgUnitItem = new UnitItem(this.MapPath(DataAccRes.AppSettings("WorkConfig")), this.PgUnitName);
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
            //动态创建控件
            this.PgWfInit(e);

            this.PreRender += new EventHandler(this.frmPreRender);
            this.Load += new EventHandler(this.Page_Load);
        }

        /// <summary>
        /// 设计器支持所需的方法 - 不要使用代码编辑器修改
        /// 此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {

        }
        #endregion

        #region  四个重要函数
        /// <summary>
        /// 在首次载入时,从session中读取参数写入页面标签;
        /// 在回传时,从标签取出参数
        /// </summary>
        /// <param name="e">包含事件数据的 EventArgs 对象。</param>
        protected override void PgInitRequestParams()
        {
            this.PgParamXmlDoc = new XmlDocument();
            if (this.IsPostBack)
                this.PgParamXmlDoc.LoadXml(this.Request.Form["hlbRequestParams"]);
            else
            {
                if (null == this.Session["sysparam"])
                    this.PgParamXmlDoc.LoadXml("<D/>");
                else
                    this.PgParamXmlDoc.LoadXml(this.Session["sysparam"].ToString());
                //加入传递参数:舍弃源参数中的传递参数(避免传递性),按照优先级取参数名的唯一值
                if (null != this.Session[BuildParamList.SessionNameTrans])
                {
                    XmlNode xntemp = this.PgParamXmlDoc.CreateElement("Temp");
                    xntemp = this.PgParamXmlDoc.DocumentElement.AppendChild(xntemp);
                    xntemp.InnerXml = this.Session[BuildParamList.SessionNameTrans].ToString();
                    //去掉系统参数,源参数的传递参数,无名参数
                    XmlNodeList xnlist = xntemp.SelectNodes(".//PL[@t='S']");
                    for (int i = xnlist.Count - 1; i > -1; i--)
                        xnlist[i].ParentNode.RemoveChild(xnlist[i]);
                    xnlist = xntemp.SelectNodes(".//PL/L[@t='Ts']");
                    for (int i = xnlist.Count - 1; i > -1; i--)
                        xnlist[i].ParentNode.RemoveChild(xnlist[i]);
                    xnlist = xntemp.SelectNodes(".//P[not(@n)]");
                    for (int i = xnlist.Count - 1; i > -1; i--)
                        xnlist[i].ParentNode.RemoveChild(xnlist[i]);
                    //按照优先级舍弃参数
                    string[] PRlist ={ ".//PL[@t='P']", ".//PL[@t='B']" };
                    string[] PLlist ={ "L[@t='D']", "L[@t='C']", "L[@t='T']" };
                    for (int a = 0; a < PRlist.Length; a++)
                    {
                        XmlNodeList xnPRlist = xntemp.SelectNodes(PRlist[a]);
                        for (int b = 0; b < PLlist.Length; b++)
                            for (int i = 0; i < xnPRlist.Count; i++)
                            {
                                XmlNodeList xnPLlist = xnPRlist[i].SelectNodes(PLlist[b]);
                                for (int j = 0; j < xnPLlist.Count; j++)
                                    for (int k = xnPLlist[j].ChildNodes.Count - 1; k > -1; k--)
                                    {
                                        XmlNode xnP = xnPLlist[j].ChildNodes[k];
                                        XmlNodeList xnPPlist = xntemp.SelectNodes(".//P[@n='" + xnP.Attributes["n"].Value + "']");
                                        if (xnPPlist.Count > 1)
                                            xnP.ParentNode.RemoveChild(xnP);
                                    }
                            }
                    }
                    XmlElement xePg = this.PgParamXmlDoc.CreateElement("PL");
                    xePg = this.PgParamXmlDoc.DocumentElement.AppendChild(xePg) as XmlElement;
                    xePg.SetAttribute("t", "P");
                    XmlElement xePL = this.PgParamXmlDoc.CreateElement("L");
                    xePL = xePg.AppendChild(xePL) as XmlElement;
                    xePL.SetAttribute("t", "Ts");
                    xnlist = xntemp.SelectNodes(".//P");
                    for (int i = xnlist.Count - 1; i > -1; i--)
                        xePL.AppendChild(xnlist[i]);
                    xntemp.ParentNode.RemoveChild(xntemp);
                }
            }
            this.xmlParam.Document = this.PgParamXmlDoc;
        }

        /// <summary>
        /// 初始化动态控件
        /// </summary>
        /// <param name="e"></param>
        protected override void PgWfInit(EventArgs e)
        {
            this.PgBtCmd = this.bt_PostBack;
            string strTpFile = this.PgUnitItem.FileEditTp;
            if (null == strTpFile || string.Empty == strTpFile)
                strTpFile = "Template/网站模板.htm";
            editTp = new TemplateModule(TemplateType.HtmlControlTp, this.MapPath(strTpFile));
            this.etpTemplate.Controls.Add(editTp);
            editTp.Initialize();
            XmlNodeList ctrlList = editTp.XmlNodeControlList;
            foreach (XmlNode ctrlNode in ctrlList)
            {
                string itemName = ""; WorkItem workItem = null;
                if (null == ctrlNode.Attributes["itemname"] || string.IsNullOrEmpty(ctrlNode.Attributes["itemname"].Value))
                    itemName = (this.PgUnitItem.WorkItemList.Length > 0) ? this.PgUnitItem.WorkItemList[0].ItemName : "";
                else
                    itemName = ctrlNode.Attributes["itemname"].Value;
                for (int i = 0; i < this.PgUnitItem.WorkItemList.Length; i++)
                    if (itemName == this.PgUnitItem.WorkItemList[i].ItemName)
                    {
                        workItem = this.PgUnitItem.WorkItemList[i];
                        break;
                    }
                if (null == workItem)
                {
                    ctrlNode.ParentNode.RemoveChild(ctrlNode);
                    continue;
                }
                BaseControl detailTp = this.LoadControl(ctrlNode.Attributes["catalog"].Value) as BaseControl; //自定义控件基类控件
                if (null == detailTp) continue; //判断是否放置该控件
                detailTp.ID = ctrlNode.Attributes["id"].Value;
                detailTp.CtrlItemName = itemName;
                editTp.Controls.Add(detailTp);
                detailTp.CtrlRegister(detailTp.CtrlItemName);
                this.PgUserControlList.Add(detailTp.ID, detailTp);
                detailTp.SetAttribute(ctrlNode);
            }
        }
        
        /// <summary>
        /// 生成关于Grid的操作Js代码
        /// </summary>
        protected override void PgBuildJs()
        {
            string strScript = "<script language=javascript></script>";
            this.Response.Write(strScript);
        }

        #endregion

        #region 自定义事件的执行

        /// <summary>
        /// 执行回传命令:命令参数样式: @key=value,@key=value,@key=value
        /// 参数内容: CtrlID 触发事件的控件, Cmd 命令参数; TabID Tab页ID;CmdFull 全命令参数;CmdP 其他命令参数
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void bt_PostBack_Click(object sender, System.EventArgs e)
        {
            string[] strTagName ={ "CtrlID", "Cmd", "CmdFull", "CmdP" };
            this.PgStrCmd = this.hlb_cmd.Value;
            this.hlb_cmd.Value = "";
            string strCtrlID = leofun.valtag(this.PgStrCmd, strTagName[0]);
            if (null != strCtrlID && "" != strCtrlID)
            {
                BaseControl ctrl = this.PgUserControlList[strCtrlID];
                if (null == ctrl) return;
                ctrl.ExecutCommand(sender, e);
                return;
            }
            string strCmd = leofun.valtag(this.PgStrCmd, strTagName[1]);

            switch (strCmd)
            {
                case "cmd_save":
                case "cmd_save;1":
                    break;
                default:
                    break;
            }
        }


       #endregion

    }

}