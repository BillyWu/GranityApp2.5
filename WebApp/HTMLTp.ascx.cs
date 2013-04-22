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
/// �������ݵ�����
/// </summary>
public partial class HTMLTp : BaseControl
{
    private WorkItem _workItem = null;
    //HTMLģ���ļ�
    private string _htmlFile = "";

    #region �ؼ����¼�����
    protected void HTMLTp_Load(object sender, System.EventArgs e)
    {
        // �ڴ˴������û������Գ�ʼ��ҳ��
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
    /// �ؼ�ִ������
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
        this.Load += new EventHandler(HTMLTp_Load);
        this.PreRender += new EventHandler(HTMLTp_PreRender);
        this.btCommand.Click += new EventHandler(btCommand_Click);
    }
    #endregion

    #region �ڲ�����

    /// <summary>
    /// ��ȡ��Ӧ�Ĺ�����Ŀ
    /// </summary>
    public WorkItem CtrlWorkItem
    {
        get { return this._workItem; }
    }

    #endregion

    #region ��������ݰ�ʵ��


    /// <summary>
    /// ����Ҫ�ṩ���ݻ��������ݰ�
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
    /// ����xml�ؼ��ڵ���������,�������ö��:<Property name="" value="" />
    /// ��������:name="width";name="height";name="visible";name="hiddenhead"
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
