using System;
using System.IO;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Xml;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using Estar.Business.UserRight;


/// <summary>
/// 更新数据服务页面:返回值:@key=value,@key=value 形式;
/// @成功=true|false ,@提示=结果信息,如保存失败及原因
/// </summary>
public partial class xmlDataUpdate : System.Web.UI.Page
{
    UnitItem unitItem = null;
    private XmlNamespaceManager _xmlNsMglSchema = null;

    protected void Page_Load(object sender, EventArgs e)
    {
        string strResult = "";
        if (null == this.Session["userid"])
        {
            strResult = leofun.setvaltag("", "成功", "false");
            strResult = leofun.setvaltag(strResult, "提示", "无效用户,请重新登录!");
            this.Response.Write(leofun.Escape(strResult));
            return;
        }
        //User userInfo = new User(this.Session["userid"].ToString());

        XmlDocument xmldoc = new XmlDocument();
        //读取用户参数
        StreamReader streamreader = new StreamReader(this.Request.InputStream, Encoding.UTF8);
        xmldoc.LoadXml(streamreader.ReadToEnd());
        NameObjectList paramlist = BuildParamList.BuildParams(xmldoc);

        string[] dataItems = BuildParamList.getValue(xmldoc, "workdataitems").Split(',');
        string datasrcFile = BuildParamList.getValue(xmldoc, "DataSrcFile");
        QueryDataRes query = new QueryDataRes(datasrcFile);
        //QueryDataRes query = new QueryDataRes(unitItem.DataSrcFile);
        try
        {
            query.BeginTransaction();
            for (int i = 0; i < dataItems.Length; i++)
            {
                //WorkItem workItem = this.unitItem.WorkItemList[i];
                //检测一
                //强行置入ip地址做为参数
                BuildParamList.setValue(xmldoc, "ip", HttpContext.Current.Request.UserHostAddress);

                //NameObjectList[] paramInsList = this.CreateParamLists("new", xmldoc, paramlist, workItem);
                NameObjectList[] paramInsList = this.CreateParamLists("new", xmldoc, paramlist, dataItems[i]);
                NameObjectList[] paramUptList = this.CreateParamLists("modify", xmldoc, paramlist, dataItems[i]);
                NameObjectList[] paramDelList = this.CreateParamLists("delete", xmldoc, paramlist, dataItems[i]);
                bool bSuccess = query.ExecuteNonQuery(dataItems[i], paramInsList, paramUptList, paramDelList);
                if (false == bSuccess)
                    throw (new Exception("保存项目失败：请检查配置和错误日志!"));
                if ("系统数据源" == Path.GetFileName(datasrcFile).ToLower() && "系统信息配置" == dataItems[i])
                {
                    this.ConfigSystem(paramInsList);
                    this.ConfigSystem(paramUptList);
                }
            }
            query.Commit();
            strResult = leofun.setvaltag("", "成功", "true");
            strResult = leofun.setvaltag(strResult, "提示", "保存成功!");
            this.Response.Write(leofun.Escape(strResult));
        }
        catch (Exception ex)
        {
            query.RollbackAndClose();
            strResult = leofun.setvaltag("", "成功", "false");
            strResult = leofun.setvaltag(strResult, "提示", ex.Message);
            this.Response.Write(leofun.Escape(strResult));
        }
        finally
        {
            query.Close();
        }
    }

    /// <summary>
    /// 根据xml文档创建指定类型的参数数组;
    /// </summary>
    /// <param name="OPType">参数类型:new,modify,delete</param>
    /// <param name="xmldoc">xml文档</param>
    /// <param name="paramSys">系统参数</param>
    /// <param name="workItem">工作项目名称</param>
    /// <returns>返回参数数组</returns>
    private NameObjectList[] CreateParamLists(string   OPType,XmlDocument xmldoc, NameObjectList paramSys, WorkItem    workItem)
    {
        //XmlNode xnP = BuildParamList.getXmlNode(xmldoc, workItem.ItemName, "Command");
        XmlNodeList xmlRows = BuildParamList.getXmlComNode(xmldoc, "Command", workItem.DataSrc, OPType);
        //XmlNode xnP = BuildParamList.getXmlComNode(xmldoc, "Command", workItem.DataSrc);
        if (xmlRows == null) return new NameObjectList[0];

        //xnP = xnP.ParentNode;
        //XmlNodeList xmlRows = xnP.SelectNodes(".//*[@state='"+OPType+"']");
        
        if (xmlRows.Count < 1) return new NameObjectList[0];

        NameObjectList[] paramList = new NameObjectList[xmlRows.Count];
        for (int i = 0; i < xmlRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < paramSys.Count; j++)
                paramList[i].Add(paramSys.Keys[j], paramSys[j]);
            for (int j = 0; j < xmlRows[i].ChildNodes.Count; j++)
            {
                XmlNode     xmlNode=xmlRows[i].ChildNodes[j];
                if (null != xmlNode.FirstChild && XmlNodeType.Text == xmlNode.FirstChild.NodeType)
                    paramList[i][xmlNode.LocalName] = xmlNode.FirstChild.Value;
                else
                    paramList[i][xmlNode.LocalName] = DBNull.Value;
            }
        }
        paramList[xmlRows.Count-1].Add("ip", HttpContext.Current.Request.UserHostAddress);
        return paramList;
    }

    /// <summary>
    /// 根据xml文档创建指定类型的参数数组;
    /// </summary>
    /// <param name="OPType">参数类型:new,modify,delete</param>
    /// <param name="xmldoc">xml文档</param>
    /// <param name="paramSys">系统参数</param>
    /// <param name="workItem">工作项目名称</param>
    /// <returns>返回参数数组</returns>
    private NameObjectList[] CreateParamLists(string OPType, XmlDocument xmldoc, NameObjectList paramSys, string datasrc)
    {
        //XmlNode xnP = BuildParamList.getXmlNode(xmldoc, workItem.ItemName, "Command");
        XmlNodeList xmlRows = BuildParamList.getXmlComNode(xmldoc, "Command", datasrc, OPType);
        //XmlNode xnP = BuildParamList.getXmlComNode(xmldoc, "Command", workItem.DataSrc);
        if (xmlRows == null) return new NameObjectList[0];

        //xnP = xnP.ParentNode;
        //XmlNodeList xmlRows = xnP.SelectNodes(".//*[@state='"+OPType+"']");

        if (xmlRows.Count < 1) return new NameObjectList[0];

        NameObjectList[] paramList = new NameObjectList[xmlRows.Count];
        for (int i = 0; i < xmlRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < paramSys.Count; j++)
                paramList[i].Add(paramSys.Keys[j], paramSys[j]);
            for (int j = 0; j < xmlRows[i].ChildNodes.Count; j++)
            {
                XmlNode xmlNode = xmlRows[i].ChildNodes[j];
                if (null != xmlNode.FirstChild && XmlNodeType.Text == xmlNode.FirstChild.NodeType)
                    paramList[i][xmlNode.LocalName] = xmlNode.FirstChild.Value;
                else
                    paramList[i][xmlNode.LocalName] = DBNull.Value;
            }
        }
        paramList[xmlRows.Count - 1].Add("ip", HttpContext.Current.Request.UserHostAddress);
        return paramList;
    }

    private NameObjectList[] CreateParamListOP(string OPType, XmlDocument xmldoc, NameObjectList paramSys, WorkItem workItem)
    {
        XmlNode xnP = BuildParamList.getXmlNode(xmldoc, workItem.ItemName, "Command");
        if (null == xnP) return new NameObjectList[0];
        xnP = xnP.ParentNode;
        XmlNodeList xmlRows = xnP.SelectNodes(".//*[@state='" + OPType + "']");
        if (xmlRows.Count < 1) return new NameObjectList[0];
        NameObjectList[] paramList = new NameObjectList[xmlRows.Count];
        for (int i = 0; i < xmlRows.Count; i++)
        {
            if (null == paramList[i]) paramList[i] = new NameObjectList();
            for (int j = 0; j < paramSys.Count; j++)
                paramList[i].Add(paramSys.Keys[j], paramSys[j]);
            for (int j = 0; j < xmlRows[i].ChildNodes.Count; j++)
            {
                XmlNode xmlNode = xmlRows[i].ChildNodes[j];
                if (null != xmlNode.FirstChild && XmlNodeType.Text == xmlNode.FirstChild.NodeType)
                    paramList[i][xmlNode.LocalName] = xmlNode.FirstChild.Value;
                else
                    paramList[i][xmlNode.LocalName] = DBNull.Value;
            }
        }
        return paramList;
    }

    /// <summary>
    /// 根据参数设置系统信息配置,修改配置文件
    /// 在系统数据源文件是system,数据源是"系统信息配置"
    /// </summary>
    /// <param name="param">系统配置参数</param>
    private void ConfigSystem(NameObjectList[] paramList)
    {
        Configuration   config=DataAccRes.DefaultConfiguration;
        KeyValueConfigurationCollection settings = config.AppSettings.Settings;
        DataConnSection connsection = config.GetSection("CustomSection") as DataConnSection;
        int icount = paramList.Length;
        for (int i = 0; i < icount; i++)
        {
            NameObjectList param = paramList[i];
            if ("appSettings" == param["配置类别"].ToString())
            {
                string strname = param["名称"].ToString();
                if (null == settings[strname])
                    settings.Add(strname, param["配置值"].ToString());
                else
                    settings[strname].Value = param["配置值"].ToString();
            }
            else
            {
                string strname = param["名称"].ToString();
                DataConnInfo conn = connsection.DataConnList[strname];
                if (null == conn)
                {
                    conn = new DataConnInfo(strname, param["数据库类别"].ToString(), param["配置值"].ToString());
                    connsection.DataConnList.Add(conn);
                }
                else
                {
                    conn.DbType = param["数据库类别"].ToString();
                    conn.Value = param["配置值"].ToString();
                }
                
            }
        }
        config.Save();
    }
}
