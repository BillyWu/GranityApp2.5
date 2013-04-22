namespace Estar.WebApp
{
	using System;
	using System.Data;
	using System.Drawing;
	using System.Web;
	using System.Xml;
	using System.Web.UI;
	using System.Web.UI.WebControls;
	using System.Web.UI.HtmlControls;
	using Microsoft.ApplicationBlocks.ExceptionManagement;
	using Estar.Common.Tools;
	using Estar.Common.WebControlTools;
	using Estar.Business.DataManager;
	using Estar.Business.UserRight;


	/// <summary>
	///		���ݵ��ؼ�
	/// </summary>
	public partial class XmlConfLand : BaseControl
	{
        static private string[] strEleNames ={ "UnitItem", "Item", "AppendItem", "Column", "CommandItem" };
        static private string[] strAttrNames =
            {"name,billtype,savetype,templatetype,workflow,",
             "name,barstep,baroffsetx,baroffsety,relation,linkcol,linkcolm,columnkey,printtype,dataitem,dataitempage,countdataitem,import,masteritem,rightcol,where,sort,tpid,manualrefresh,",
             "name,barstep,baroffsetx,baroffsety,funtype,unitgroup,unitname,linkcol,",
             "name,barheight,barwidth,barcolor,bartitle,expright,",
             "name,funtype,"
			};

		private		WorkItem	_workItem=null;
		private		string		_xmllandID="";

		protected void Page_Load(object sender, System.EventArgs e)
		{
            if ("" == this._xmllandID)
                this.SetAttribute(null);
            if(null==this.CtrlXmlLand.Document)
                this.CtrlDataBind();
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
		///		�����֧������ķ��� - ��Ҫʹ�ô���༭��
		///		�޸Ĵ˷��������ݡ�
		///		gd_work.InitializeRow += new Infragistics.WebUI.UltraWebGrid.InitializeRowEventHandler(this.gd_work_InitializeRow);
		/// </summary>
		private void InitializeComponent()
		{
			BasePage			page=this.Page as BasePage;
			//����м��ϵ�keyҪ������Դ�İ�DataTable����һ��
			this._workItem=page.PgGetWorkItem(this.CtrlItemName);
		}
		#endregion

		#region �ڲ�����
		/// <summary>
		/// �ؼ��ڵ�Grid�ؼ�
		/// </summary>
		public Xml CtrlXmlLand
		{
			get{return this.xmlLandConf;}
		}

		/// <summary>
		/// ��Ӧ�Ĺ�����Ŀ
		/// </summary>
		public WorkItem	CtrlWorkItem
		{
			get{return this._workItem;}
		}

		/// <summary>
		/// ��ȡ������ҳ�����ݵ�ID
		/// </summary>
		public string	CtrlXmlID
		{
			get{return this._xmllandID;}
			set{this._xmllandID=value;}
		}
		
		#endregion

		#region ��������ݰ�ʵ��

		/// <summary>
		/// ����table�ṩ�����ݻ���������
		/// </summary>
		/// <param name="workGrid">�ṩ���������ݻ���</param>
		public override	 void		CtrlDataBind(DataRow dr)
		{
			this.CtrlDataBind();
			return;
		}


		/// <summary>
		/// ����Ҫ�ṩ���ݻ��������ݰ�
        ///  xmlNode = <UnitItem name="blank" templatetype="Main" datasrcfile="/DataSource/�滮��/dataitem.xml" 
        ///          dictcolfile="/DataSource/�滮��/db_template.xml" gridtemplate="/DataSource/�滮��/Template/��Ϣ֪ͨ.htm">
        ///    <Item name="��Ϣ��ʾ" relation="M" linkcol="" dataitem="��Ϣ��ʾ" columnkey="ID" />
        ///     </UnitItem>
		/// </summary>
		public override	 void		CtrlDataBind()
		{
			BasePage			page=this.Page as BasePage;
            if (page.PgUnitItem == null) return;
            //����һ��xmlnode
            string strXml = "<UnitItem></UnitItem>";
//            CreateXmlNode();
            if (page.PgUnitItem.UnitNode == null) return;
			XmlNode	xmlNode=page.PgUnitItem.UnitNode.CloneNode(true);
			this.CheckNode(xmlNode);
			this.CtrlXmlLand.Document=new XmlDocument();
			XmlDocument		xmldoc=this.CtrlXmlLand.Document;
			xmldoc.LoadXml(xmlNode.OuterXml);

			if(null==xmldoc.DocumentElement.Attributes["id"])
				xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("id"));
			if(null==xmldoc.DocumentElement.Attributes["typexml"])
				xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("typexml"));
			if(null==xmldoc.DocumentElement.Attributes["confpro"])
				xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("confpro"));
			xmldoc.DocumentElement.Attributes["id"].Value=(""==this.CtrlXmlID)?this.xmlLandConf.ClientID:this.CtrlXmlID;
			xmldoc.DocumentElement.Attributes["confpro"].Value=this.CtrlItemName;
			xmldoc.DocumentElement.Attributes["typexml"].Value="ConfProperty";
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("tpath"));
            xmldoc.DocumentElement.Attributes["tpath"].Value = page.PgUnitItem.FileEditTp;
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("DataSrcFile"));
            xmldoc.DocumentElement.Attributes["DataSrcFile"].Value = page.PgUnitItem.DataSrcFile;
            xmldoc.DocumentElement.Attributes.Append(xmldoc.CreateAttribute("DictColSrcFile"));
            xmldoc.DocumentElement.Attributes["DictColSrcFile"].Value = page.PgUnitItem.DictColSrcFile;
            return;
		}


		/// <summary>
		/// ����table�ṩ�����ݻ���,���ֵ���������
        /// </summary>
		/// <param name="workGrid">�ṩ���������ݻ���</param>
		public override	 void		CtrlDataBindDict(DataRow dr)
		{
			return;
		}

		/// <summary>
		/// �ֵ����͵����ݰ�
		/// </summary>
		public override	 void		CtrlDataBindDict()
		{
			return;
		}


		/// <summary>
		/// ����xml�ؼ��ڵ���������,�������ö��:<Property name="" value="" />
		/// ��������:name="width";name="height";name="visible";name="hiddenhead"
		/// </summary>
		/// <param name="ctrlNode"></param>
		public override	 void		SetAttribute(XmlNode ctrlNode)
		{
            BasePage page = this.Page as BasePage;
            if (page.PgUnitName == null || page.PgUnitName == "") return;
            ctrlNode = page.PgUnitItem.UnitNode;
            if (ctrlNode == null) return;
            try
			{
				if(null!=ctrlNode.Attributes["id"] && ""!=ctrlNode.Attributes["id"].Value)
					this.CtrlXmlID=ctrlNode.Attributes["id"].Value;
				else
					this.CtrlXmlID=this.xmlLandConf.ClientID;
                this.CtrlType = "Config";
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
				return ;
			}

		}
		
		#endregion

		#region  �ڲ�����

	
		/// <summary>
		/// �Ե�Ԫ��xml�ڵ��飬ȥ������Ҫչʾ��ҳ���Ԫ�غ�����
		/// </summary>
		/// <param name="node">��Ҫ����Xml�ڵ�</param>
		private	void  CheckNode(XmlNode		node)
		{
			if(XmlNodeType.Element!=node.NodeType)
				return;
			bool	isMove=true;	int		iAttr=0;
			for(int i=0;i<strEleNames.Length;i++)
			{
				if(node.LocalName.Equals(strEleNames[i]))
				{
					isMove=false;iAttr=i;
					break;
				}
			}
			//���ҳ�治��Ҫ���Ԫ��,���Ƴ���Ԫ��,���ҳ�治��Ҫ���������Ծ��Ƴ�
			if(isMove)
			{
				node.ParentNode.RemoveChild(node);
				return;
			}
			else
			{
				//û�а������Ծ�ɾ��
				for(int i=node.Attributes.Count-1;i>-1;i--)
                    if (strAttrNames[iAttr].IndexOf(node.Attributes[i].LocalName.ToLower() + ",") < 0)
                        node.Attributes.RemoveAt(i);
				//�ݹ鴦���ӽڵ�
				for(int i=node.ChildNodes.Count-1;i>-1;i--)
					this.CheckNode(node.ChildNodes[i]);
			}
		}
		
		#endregion

	}
}
