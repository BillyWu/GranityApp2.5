using System;
using System.Data;
using System.Xml;
using System.Configuration;
using System.Collections;
using System.IO;
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
public partial class HTMLTp : BaseControl
{
    private WorkItem _workItem = null;
    //HTML模板文件
    private string _htmlFile = "";

    #region 控件内事件函数
    protected void HTMLTp_Load(object sender, System.EventArgs e)
    {
        // 在此处放置用户代码以初始化页面
        if (null != this.ViewState["xmlCtrlNode"])
        {
            string strxml = this.ViewState["xmlCtrlNode"].ToString();
            XmlDocument xmldoc = new XmlDocument();
            xmldoc.LoadXml(strxml);
            this.SetAttribute(xmldoc.DocumentElement);
        }
        if (null != this.ViewState["HTML"])
        {
            this.ltHTML.Text = this.ViewState["HTML"].ToString();
        }
    }


    private void HTMLTp_PreRender(object sender, System.EventArgs e)
    {
        if ("" != this.ltHTML.Text || string.Empty != this.ltHTML.Text)
            this.ViewState["XmlLand"] = this.ltHTML.Text;
        else
            this.ViewState["XmlLand"] = null;
    }


    /// <summary>
    /// 控件执行命令
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void btCommand_Click(object sender, System.EventArgs e)
    {
        string str = this.hlb_cmd.Value.ToLower();
        string[] arrCmd = str.Split(";".ToCharArray());
        string strCmd = arrCmd[0];
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
        this.Load += new EventHandler(HTMLTp_Load);
        this.PreRender += new EventHandler(HTMLTp_PreRender);
        this.btCommand.Click += new EventHandler(btCommand_Click);
    }
    #endregion

    #region 内部对象

    /// <summary>
    /// 获取对应的工作项目
    /// </summary>
    public WorkItem CtrlWorkItem
    {
        get { return this._workItem; }
    }

    #endregion

    #region 基类的数据绑定实现


    /// <summary>
    /// 不需要提供数据环境的数据绑定
    /// </summary>
    public override void CtrlDataBind()
    {
        BasePage page = this.Page as BasePage;
        this.hlbState.Value = "";
        if ("" == this._htmlFile || !File.Exists(this._htmlFile))
            this.ltHTML.Text = "";
        else
        {
            StreamReader sr = File.OpenText(this._htmlFile);
            this.ltHTML.Text = sr.ReadToEnd();
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
            XmlNode xmlProperty = ctrlNode.SelectSingleNode("Property[@name='htmlfile']");
            if (null != xmlProperty && null != xmlProperty.Attributes["value"].Value && "" != xmlProperty.Attributes["value"].Value)
            {
                string strFileName = this.Server.MapPath(xmlProperty.Attributes["value"].Value);
                if (File.Exists(strFileName))
                    this._htmlFile = strFileName;
            }
            this.ViewState["xmlCtrlNode"] = ctrlNode.OuterXml;
        }
        catch (Exception ex)
        {
            ExceptionManager.Publish(ex);
            return;
        }

    }

    #endregion

}
