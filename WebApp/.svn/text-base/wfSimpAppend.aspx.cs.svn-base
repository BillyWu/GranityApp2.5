using System;
using System.IO;
using System.Text;
using System.Data;
using System.Xml;
using System.Web.Configuration;
using System.Collections;
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
    /// 附加项内容窗口,从一个单元跳转到另一个单元项
    /// </summary>
    public partial class wfSimpAppend : BasePage
    {
        private TemplateModule editTp;		//编辑模板

        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.IsPostBack) 
                return;
            this.xmlConf.CtrlDataBind();
            for (int i = 0; i < this.PgUserControlList.Count; i++)
            {
                BaseControl ctrl = this.PgUserControlList[i];
                if (null == ctrl) continue;
                ctrl.CtrlDataBind();
            }

        }

        #region Web 窗体设计器生成的代码

        /// <summary>
        /// 改写BasePage起点定位单元规则,不继承父类规则
        /// </summary>
        /// <param name="e"></param>
        override protected void OnInit(EventArgs e)
        {
            //
            // CODEGEN: 该调用是 ASP.NET Web 窗体设计器所必需的。
            //
            if (Session["userid"] == null)
            {
                this.Response.Write("<script language=\"javascript\">");
                this.Response.Write("alert('您未正常登录，请登录后再使用,谢谢！')");
                this.Response.Write("</script>");
                this.Response.Redirect("default.htm");
            }
            this.PgInitRequestParams();
            this.PgUnitName = BuildParamList.getValue(this.PgParamXmlDoc, "UnitName");
            UnitItem parentUnit = new UnitItem(DataAccRes.AppSettings("WorkConfig"), this.PgUnitName);
            AppendItem appendItem = parentUnit.GetAppendItem( BuildParamList.getValue(this.PgParamXmlDoc,"AppendItem"));
            if (null != appendItem && (null == appendItem.UnitName || "" == appendItem.UnitName.Trim()))
            {
                this.PgUnitItem = new UnitItem();
                WorkItem workitem = new WorkItem();
                this.PgUnitItem.UnitName = appendItem.ItemName;
                this.PgUnitItem.DataSrcFile = parentUnit.DataSrcFile;
                this.PgUnitItem.DictColSrcFile = parentUnit.DictColSrcFile;
                workitem.ItemName = appendItem.ItemName;
                workitem.DataSrc = appendItem.DataSrc;
                workitem.ItemType = WorkItemType.MasterData;
                workitem.AliasList = new System.Collections.Specialized.NameValueCollection();
                workitem.DictCol = new DictColumn[0];
                workitem.Validities = new Validity[0];
                this.PgUnitItem.WorkItemList = new WorkItem[1];
                this.PgUnitItem.WorkItemList[0] = workitem;
                string strXmlItem = "<Item name='{0}' relation='D' linkcol='' dataitem='{1}'/>";
                strXmlItem = string.Format(strXmlItem, workitem.ItemName, workitem.DataSrc);
                this.PgUnitItem.UnitNode.InnerXml = strXmlItem;
            }
            else if (null != appendItem)
            {
                this.PgUnitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), appendItem.UnitName);
                this.PgUnitName = appendItem.UnitName;
                BuildParamList.setValue(this.PgParamXmlDoc, ParamRangeType.Page, ParamUseType.Data, "UnitName", appendItem.UnitName);
            }
            else if (null == appendItem)
            {
                this.PgUnitItem = parentUnit;
                this.PgUnitName = parentUnit.UnitName;
            }
            this.PgQuery = new QueryDataRes(this.PgUnitItem.DataSrcFile);
            this.PgDictQuery = new QueryDataRes(this.PgUnitItem.DictColSrcFile);
            this.PgWorkItemList = this.PgUnitItem.WorkItemList;
            this.PgUserRight = new Estar.Business.UserRight.User(this.Session["userid"].ToString());
            //动态创建控件
            this.PgWfInit(e);

            InitializeComponent();
            //base.OnInit(e);
        }

        /// <summary>
        /// 设计器支持所需的方法 - 不要使用代码编辑器修改
        /// 此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.PreRender += new System.EventHandler(SimpAppendPreRender);
        }

        #endregion

        private void SimpAppendPreRender(object sender, System.EventArgs e)
        {
            this.PgBuildJs();
        }

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
                    xnlist = xntemp.SelectNodes(".//P[not(@n)]");
                    for (int i = xnlist.Count - 1; i > -1; i--)
                        xnlist[i].ParentNode.RemoveChild(xnlist[i]);
                    //按照优先级舍弃参数
                    string[] PRlist ={ ".//PL[@t='P']", ".//PL[@t='B']" };
                    string[] PLlist ={ "L[@t='Ts']", "L[@t='D']", "L[@t='C']", "L[@t='T']" };
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
                strTpFile = "Template/明细表一体化模板.htm";
            editTp = new TemplateModule(TemplateType.HtmlControlTp, this.MapPath(strTpFile));
            this.etpTemplate.Controls.Add(editTp);
            editTp.Initialize();
            XmlNodeList ctrlList = editTp.XmlNodeControlList;
            foreach (XmlNode ctrlNode in ctrlList)
            {
                string itemName = ""; WorkItem workItem = null;
                if (null == ctrlNode.Attributes["itemname"] || string.Empty == ctrlNode.Attributes["itemname"].Value
                    || "" == ctrlNode.Attributes["itemname"].Value)
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
                    Save();
                    break;
                case "cmd_gnrtxm":
                    this.GeneralTXM();
                    break;
                default:
                    break;
            }
        }


        /// <summary>
        /// 执行从xml格式的Excel文件导入数据操作
        /// 文件上报设计说明：
        /// 模板文件管理
        ///		内容包括：
        ///		上报主题: 上报主题是指上报的文件存在数据库后，通过操作上报主题的名子
        ///		，即子项名，打开上报后的数据浏览界面；
        ///		上报文件模板:上报的文件是基于模板进行解析的，模板固定存放于一个指定
        /// 	的文件夹中；
        ///		上报模板数据库名称：模板文件中有数据库的名称，不需要另外设置。
        ///		上报主题的目的是为了给远程上报者一个直观的报表标题，不能使用抽象的数据库名称，
        ///		上报主题与上报模板一一对应；
        ///
        ///	上报文件：上报文件是指按上报即定的格式上报的文件，通过上报报表登记界面进行上报，上报后存于指定的服务器文件夹中；
        ///			有关的上报时间等参数用于存放在数据库中对应的字段。
        /// 上报文件存放于"/DataSource/水利局/upload/"中，
        /// </summary>
        /// <param name="cmdCur">当前的命令项目</param>
        private void exeXmlToDB(CommandItem cmdCur)
        {
            //获取模板文件和当前上报文件
            QueryDataRes query = this.PgSysQuery;
            NameObjectList paramList = new NameObjectList();

            //step 1 得到报表主题: 读表[报表上传登记],得到报表主题和报表模板文件fileNameTp = 模板文件名,根据约定的文档存贮路径，得到数据文件。

            paramList.Add("主题名称", cmdCur.Topic);
            DataTable tab = query.getTable("报表文件配置", paramList);
            if (null == tab || tab.Rows.Count < 1) return;
            string fileNameTp = tab.Rows[0]["上报模板"].ToString();

            NameObjectList paramListUp = BuildParamList.BuildParams(this.PgParamXmlDoc);
            paramListUp.Add("主题名称", cmdCur.Topic);
            DataTable tabUpLoad = query.getTable("上报报表文件", paramListUp);
            if (null == tabUpLoad || tabUpLoad.Rows.Count < 1 || null == tabUpLoad.Rows[0]["文件"])
                return;
            string fileNameUp = tabUpLoad.Rows[0]["文件"].ToString();

            fileNameTp = this.Server.MapPath(DataAccRes.AppSettings("TpFilePath") + fileNameTp);
            fileNameUp = this.Server.MapPath(DataAccRes.AppSettings("DocFilePath") + fileNameUp);
            bool brtn = this.PgQuery.ExecuteInsert(cmdCur.DataSrc, csExcel2DB.CreateParamsList(fileNameTp, fileNameUp));
            if (true == brtn)
                leofun.Alert("您已成功执行了 [" + cmdCur.ItemName + "] 操作! ", this);
            else
                leofun.Alert("操作失败! 请检查", this);
            return;
        }

        /// <summary>
        /// 保存数据
        /// </summary>
        private bool Save()
        {
            ////如果有文件控件,先保存上传文件
            //for (int i = 0; i < this.PgUserControlList.Count; i++)
            //{
            //    FileUpLoad fileupload = this.PgUserControlList[i] as FileUpLoad;
            //    if (null == fileupload) continue;
            //    try
            //    {
            //        fileupload.SaveFile();
            //    }
            //    catch (Exception ex)
            //    {
            //        this.Response.Write("<script language=\"javascript\">alert(\"" + ex.Message + "\");</script>");
            //        return false;
            //    }
            //}
            //如果是转换类型保存,首先把grid状态设置为new
            string stroptype = BuildParamList.getValue(this.PgParamXmlDoc, "operation");
            if (null == stroptype || "" == stroptype || string.Empty == stroptype)
                stroptype = "modify";

            if (SaveType.TransSave == this.PgUnitItem.SaveOPType
                && (null == this.ViewState["transsave"] || "finish" != this.ViewState["transsave"].ToString()))
            {
                stroptype = "add";
            }
            //首先保存主表

            try
            {
                this.PgQuery.BeginTransaction();
                //设置级联更新
                for (int i = 0; i < this.PgUserControlList.Count; i++)
                {
                    WorkItem workItem = this.PgGetWorkItem(this.PgUserControlList[i].CtrlItemName);
                    if (WorkItemType.MasterData == workItem.ItemType)
                        this.PgUserControlList[i].SetLinkUpdate();
                }
                for (int i = 0; i < this.PgUserControlList.Count; i++)
                {
                    WorkItem workItem = this.PgGetWorkItem(this.PgUserControlList[i].CtrlItemName);
                    if (WorkItemType.MasterData != workItem.ItemType)
                        this.PgUserControlList[i].SetLinkUpdate();
                }
                //保存主表
                for (int i = 0; i < this.PgUserControlList.Count; i++)
                {
                    WorkItem workItem = this.PgGetWorkItem(this.PgUserControlList[i].CtrlItemName);
                    if (WorkItemType.MasterData == workItem.ItemType)
                        this.PgUserControlList[i].Update(false, this.PgUserRight);
                }
                //保存从表
                for (int i = 0; i < this.PgUserControlList.Count; i++)
                {
                    WorkItem workItem = this.PgGetWorkItem(this.PgUserControlList[i].CtrlItemName);
                    if (WorkItemType.MasterData != workItem.ItemType)
                        this.PgUserControlList[i].Update(false, this.PgUserRight);
                }
                for (int i = 0; i < this.PgUserControlList.Count; i++)
                    this.PgUserControlList[i].ResetState();
                this.PgQuery.Commit();
                //导入文件数据
                if (!this.importDB())
                    throw new Exception("数据载入失败,请检查配设和错误日志!");
                if (SaveType.TransSave == this.PgUnitItem.SaveOPType)
                    this.ViewState["transsave"] = "finish";
            }
            catch (Exception ex)
            {
                this.PgQuery.RollbackAndClose();
                if (!ex.Message.StartsWith("您"))
                    ExceptionManager.Publish(ex);
                string alertMsg = "<script language=\"javascript\">alert(\"" + ex.Message + "\");</script>";
                this.Response.Write(alertMsg);
            }
            finally
            {
                this.PgQuery.Close();
            }
            return true;
        }

        /// <summary>
        /// 上传的数据文件保存入数据库
        /// </summary>
        /// <returns></returns>
        private bool importDB()
        {
            //TransDB myImport = new TransDB();
            //for (int i = 0; i < this.PgUserControlList.Count; i++)
            //{
            //    FileUpLoad fileupload = this.PgUserControlList[i] as FileUpLoad;
            //    if (null == fileupload) continue;
            //    //找到保存的文件位置
            //    for (int j = 0; j < fileupload.FileNameList.Count; j++)
            //    {
            //        string filename = "";
            //        if (null == fileupload.FilePathList[fileupload.FileNameList.Keys[j]] || string.Empty == fileupload.FilePathList[fileupload.FileNameList.Keys[j]] ||
            //            "" == fileupload.FilePathList[fileupload.FileNameList.Keys[j]].Trim())
            //            filename = fileupload.FilePath + fileupload.FileNameList.Keys[j];
            //        else
            //            filename = fileupload.FilePathList[fileupload.FileNameList.Keys[j]] + fileupload.FileNameList.Keys[j];
            //        if (filename.IndexOf(":") < 0) 
            //            filename = this.Server.MapPath(filename);
            //        //根据上传服务端文件名找到对应行记录
            //        for (int m = 0; m < this.PgUserControlList.Count; m++)
            //        {
            //            BaseControl bctrl = this.PgUserControlList[m];
            //            if (bctrl.CtrlItemName != fileupload.CtrlItemName)
            //                continue;
            //            if (null == bctrl.CtrlDBXmlDoc || null == bctrl.CtrlDBSchema)
            //                continue;
            //            GridLand grid = bctrl as GridLand;
            //            if (null == grid) continue;
            //            string strXPath = "//xs:sequence//xs:element[@name='" + fileupload.ColNameServer + "']";
            //            XmlNode xmlNodeTest = grid.CtrlDBSchema.SelectSingleNode(strXPath, grid.CtrlXmlNsMgr);
            //            if (null == xmlNodeTest) continue;
            //            strXPath = "//xs:sequence//xs:element[@name='" + fileupload.ColNameClient + "']";
            //            xmlNodeTest = grid.CtrlDBSchema.SelectSingleNode(strXPath, grid.CtrlXmlNsMgr);
            //            if (null == xmlNodeTest) continue;

            //            strXPath = "/*/*[" + fileupload.ColNameServer + "='" + fileupload.FileNameList.Keys[j] + "']";
            //            XmlNode xmlNodeRow = grid.CtrlDBXmlDoc.SelectSingleNode(strXPath);
            //            if (null == xmlNodeRow) continue;
            //            NameObjectList paramReport = grid.CreateParamRow(xmlNodeRow);
            //            myImport.ImportDB(paramReport, filename);
            //        }
            //    }
            //}
            return true;
        }

        //产生新增加款号的条形码;在裁床管理单元使用
        //isOldType是否使用采用老方式12位条码;false时新方式14位条码,
        private void GeneralTXM()
        {
            string strXmlParam = BuildParamList.getValue(this.PgParamXmlDoc, "条码参数表");
            if ("" == strXmlParam || string.Empty == strXmlParam)
                return;
            //建立参数列表
            XmlDocument xmldoc = new XmlDocument();
            xmldoc.LoadXml(strXmlParam);
            NameObjectList[] paramlist = BuildParamList.BuildParamsList(xmldoc);
            if (paramlist.Length < 1)
                return;

            string itemNameTM = paramlist[0]["WorkItem"].ToString();
            BaseControl ctrlD = null, ctrlTM = null;
            for (int i = 0; i < this.PgUserControlList.Count; i++)
            {
                BaseControl ctrl = this.PgUserControlList[i];
                if (null != ctrl && itemNameTM == ctrl.CtrlItemName && "data" == ctrl.CtrlType.ToLower())
                    ctrlTM = ctrl;
            }
            if (null == ctrlTM || null == ctrlTM.CtrlDBXmlDoc)
                return;
            WorkItem workItemTM = this.PgGetWorkItem(itemNameTM);
            DataSet ds = new DataSet(this.PgUnitName);
            string itemdata = paramlist[0]["DataItem"].ToString();
            string[] dataItemList = itemdata.Split(",".ToCharArray());
            for (int i = 0; i < dataItemList.Length; i++)
            {
                if ("" == dataItemList[i]) continue;
                for (int j = 0; j < paramlist.Length; j++)
                {
                    DataTable tab = this.PgQuery.getTable(dataItemList[i], paramlist[j]);
                    ds.Merge(tab);
                }
            }
            if (ds.Tables.Count < 1 || null == ds.Tables[0])
                return;

            XmlDataDocument xmldbDoc = new XmlDataDocument(ds);
            if (null == xmldbDoc.DocumentElement)
                return;
            XmlElement xmlNodeNew = ctrlTM.CtrlDBXmlDoc.CreateElement("TMNew");
            xmlNodeNew = ctrlTM.CtrlDBXmlDoc.DocumentElement.AppendChild(xmlNodeNew) as XmlElement;
            xmlNodeNew.InnerXml = xmldbDoc.DocumentElement.InnerXml;
            XmlNodeList xmlRowList = xmlNodeNew.SelectNodes("./*");
            for (int i = 0; i < xmlRowList.Count; i++)
            {
                XmlElement xmlRow = xmlNodeNew.OwnerDocument.CreateElement(workItemTM.DataSrc);
                xmlRow.InnerXml = xmlRowList[i].InnerXml;
                xmlRow.SetAttribute("state", "new");
                xmlNodeNew.ParentNode.AppendChild(xmlRow);
            }
            xmlNodeNew.ParentNode.RemoveChild(xmlNodeNew);
        }

        #endregion


    }
}