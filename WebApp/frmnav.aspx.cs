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
	/// frmnav ��ժҪ˵����
	/// </summary>
	public partial class frmnav :BasePage
	{
		private	TemplateModule	editTp;
		//protected Estar.Common.WebControls.EditTemplate etpTemplate;
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// �ڴ˴������û������Գ�ʼ��ҳ��
		}


		/// <summary>
		/// ��ʼ����̬�ؼ�
		/// </summary>
		/// <param name="e"></param>
		protected override void PgWfInit(EventArgs e)
		{
            string strTpFile = this.PgUnitItem.FileEditTp;
			if(null==strTpFile || string.Empty==strTpFile)
				strTpFile="Template/��ϸ��һ�廯ģ��.htm";
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
                BaseControl detailTp = this.LoadControl(ctrlNode.Attributes["catalog"].Value) as BaseControl; //�Զ���ؼ�����ؼ�
				if(null==detailTp)	continue; //�ж��Ƿ���øÿؼ�
				detailTp.ID=ctrlNode.Attributes["id"].Value;
                detailTp.CtrlItemName = itemName;
				editTp.Controls.Add(detailTp);
				detailTp.CtrlRegister(detailTp.CtrlItemName);
				this.PgUserControlList.Add(detailTp.ID,detailTp);

			}
		}
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
		/// �����֧������ķ��� - ��Ҫʹ�ô���༭���޸�
		/// �˷��������ݡ�
		/// </summary>
		private void InitializeComponent()
		{    

		}
		#endregion
	}
}
