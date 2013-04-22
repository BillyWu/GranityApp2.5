using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Xml;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Common.WebControls;
using Estar.Common.WebControlTools;
using System.Configuration;
using System.Data.SqlClient;


namespace Estar.WebApp
{
	
	/// <summary>
	/// frmnav 的摘要说明。
	/// </summary>
	public partial class frmnav :BasePage
	{
		private	TemplateModule	editTp;
		//protected Estar.Common.WebControls.EditTemplate etpTemplate;
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
		}


		/// <summary>
		/// 初始化动态控件
		/// </summary>
		/// <param name="e"></param>
		protected override void PgWfInit(EventArgs e)
		{
            string strTpFile = this.PgUnitItem.FileEditTp;
			if(null==strTpFile || string.Empty==strTpFile)
				strTpFile="Template/明细表一体化模板.htm";
			editTp=new TemplateModule(TemplateType.HtmlControlTp,this.MapPath(strTpFile));
            this.etpTemplate.Controls.Add(editTp);
            editTp.Initialize();
            XmlNodeList ctrlList = editTp.XmlNodeControlList;
			foreach(XmlNode ctrlNode in ctrlList)
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
				if(null==detailTp)	continue; //判断是否放置该控件
				detailTp.ID=ctrlNode.Attributes["id"].Value;
                detailTp.CtrlItemName = itemName;
				editTp.Controls.Add(detailTp);
				detailTp.CtrlRegister(detailTp.CtrlItemName);
				this.PgUserControlList.Add(detailTp.ID,detailTp);

			}
		}
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
		/// 设计器支持所需的方法 - 不要使用代码编辑器修改
		/// 此方法的内容。
		/// </summary>
		private void InitializeComponent()
		{    

		}
		#endregion
	}
}
