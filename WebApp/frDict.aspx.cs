using System;
using System.IO;
using System.Data;
using System.Xml;
using System.Text;
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
using Estar.Business.DataManager;

public partial class frDict : System.Web.UI.Page
{
    XmlDocument xmldocSchema = new XmlDocument();
    UnitItem unitItem = null;
    private XmlNamespaceManager _xmlNsMglSchema = null;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["userid"] == null)
        {
            this.Response.Write("<script language=\"javascript\">");
            this.Response.Write("alert('��δ������¼�����¼����ʹ��,лл��')");
            this.Response.Write("</script>");
            this.Response.Redirect("index.htm");
        }
        XmlDocument xmldoc = new XmlDocument();
        //��ȡ�û�����
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        xmldoc.LoadXml(streamreader.ReadToEnd());
        string[] strParams = this.getStrParams(xmldoc);
        NameObjectList paramlist = BuildParamList.BuildParams(xmldoc);
        try
        {
            string unitName = paramlist["UnitName"].ToString();
            if (paramlist["DictSrcFile"]==null)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), unitName);
        }
        catch (Exception ex)
        {
            ExceptionManager.Publish(ex);
            return;
        }
        string workItemName = ""; WorkItem workitem = null;
        QueryDataRes query;
        if (paramlist["DataSrcFile"]!=null)
            query = new QueryDataRes(paramlist["DictSrcFile"].ToString());
        else
            query = new QueryDataRes(unitItem.DictColSrcFile);
        DataSet ds = new DataSet("Dict");
        ds.EnforceConstraints = false;
        //htmҳ��ؼ��ֵ���˹�ָ���ֵ�
        string itemdatas = paramlist["htmldict"].ToString();
        string itemdata = paramlist["htmldict"].ToString();
        string itemtable = itemdata;
        if(itemdatas.IndexOf(";")>-1)
        {
            string[] arr = leofun.getArrayFromString(itemdatas,";");
            itemdata    = arr[0];
            itemtable   = arr[1];
        }
        if (itemdata != "")
        {
            query.FillDataSet(itemdata, paramlist, strParams, ds);
        }
        else
        {
            for (int i = 0; i < unitItem.WorkItemList.Length; i++)
            {
                for (int j = 0; j < unitItem.WorkItemList[i].DictCol.Length; j++)
                {
                    string dictsrcs = unitItem.WorkItemList[i].DictCol[j].DataSrc;
                    string dictsrc = unitItem.WorkItemList[i].DictCol[j].DataSrc;
                    itemtable = dictsrc;
                    if (dictsrcs == "" || dictsrcs == null) continue;
                    if (dictsrcs.IndexOf(";") > -1)
                    {
                        string[] arr = leofun.getArrayFromString(dictsrcs, ";");
                        dictsrc = arr[0];
                        itemtable = arr[1];
                    }
                    query.FillDataSet(dictsrc, paramlist, strParams, ds);
                }
            }
        }
        if (ds.Tables.Count > 0 && itemtable != "") ds.Tables[0].TableName = itemtable;
        XmlDataDocument xmldocData = new XmlDataDocument(ds);
        this.Response.ContentType = "text/xml; charset=gb2312";
        xmldocData.Save(this.Response.Output);

    }

    /// <summary>
    /// ������Ҫ�ַ����滻��:��ҳ����,���˲�ѯ����,Chartͼ����
    /// ����������Ҫ����Ϊ��: type="macro";
    /// </summary>
    /// <param name="xmldoc">�����ĵ�</param>
    /// <returns></returns>
    private string[] getStrParams(XmlDocument xmldoc)
    {

        string[] strParams ={ "", "", "", "", "", "", "", "", "" };
        XmlNodeList xmlNodeParamMico = xmldoc.SelectNodes("//Param[@type='macro' and @name and @value]");
        for (int i = xmlNodeParamMico.Count - 1; i > -1; i--)
        {
            string strName = xmlNodeParamMico[i].Attributes["name"].Value;
            if ("firstrowold" == strName.ToLower())
                strParams[1] = xmlNodeParamMico[i].Attributes["value"].Value;
            if ("firstrow" == strName.ToLower())
                strParams[1] = xmlNodeParamMico[i].Attributes["value"].Value;
            if ("lastrow" == strName.ToLower())
                strParams[7] = xmlNodeParamMico[i].Attributes["value"].Value;
            if ("filterfast" == strName.ToLower())
                strParams[2] = xmlNodeParamMico[i].Attributes["value"].Value;
            if ("filter" == strName.ToLower())
                strParams[3] = xmlNodeParamMico[i].Attributes["value"].Value;
            xmlNodeParamMico[i].ParentNode.RemoveChild(xmlNodeParamMico[i]);
        }

        return strParams;
    }

}
