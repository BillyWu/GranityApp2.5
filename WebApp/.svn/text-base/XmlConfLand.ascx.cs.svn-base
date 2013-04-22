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
	///		数据岛控件
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
		///		gd_work.InitializeRow += new Infragistics.WebUI.UltraWebGrid.InitializeRowEventHandler(this.gd_work_InitializeRow);
		/// </summary>
		private void InitializeComponent()
		{
			BasePage			page=this.Page as BasePage;
			//表格行集合的key要与数据源的绑定DataTable名称一致
			this._workItem=page.PgGetWorkItem(this.CtrlItemName);
		}
		#endregion

		#region 内部对象
		/// <summary>
		/// 控件内的Grid控件
		/// </summary>
		public Xml CtrlXmlLand
		{
			get{return this.xmlLandConf;}
		}

		/// <summary>
		/// 对应的工作项目
		/// </summary>
		public WorkItem	CtrlWorkItem
		{
			get{return this._workItem;}
		}

		/// <summary>
		/// 读取或设置页面数据岛ID
		/// </summary>
		public string	CtrlXmlID
		{
			get{return this._xmllandID;}
			set{this._xmllandID=value;}
		}
		
		#endregion

		#region 基类的数据绑定实现

		/// <summary>
		/// 依据table提供的数据环境绑定数据
		/// </summary>
		/// <param name="workGrid">提供参数的数据环境</param>
		public override	 void		CtrlDataBind(DataRow dr)
		{
			this.CtrlDataBind();
			return;
		}


		/// <summary>
		/// 不需要提供数据环境的数据绑定
        ///  xmlNode = <UnitItem name="blank" templatetype="Main" datasrcfile="/DataSource/规划局/dataitem.xml" 
        ///          dictcolfile="/DataSource/规划局/db_template.xml" gridtemplate="/DataSource/规划局/Template/消息通知.htm">
        ///    <Item name="消息提示" relation="M" linkcol="" dataitem="消息提示" columnkey="ID" />
        ///     </UnitItem>
		/// </summary>
		public override	 void		CtrlDataBind()
		{
			BasePage			page=this.Page as BasePage;
            if (page.PgUnitItem == null) return;
            //创建一个xmlnode
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
		/// 依据table提供的数据环境,绑定字典类型数据
        /// </summary>
		/// <param name="workGrid">提供参数的数据环境</param>
		public override	 void		CtrlDataBindDict(DataRow dr)
		{
			return;
		}

		/// <summary>
		/// 字典类型的数据绑定
		/// </summary>
		public override	 void		CtrlDataBindDict()
		{
			return;
		}


		/// <summary>
		/// 根据xml控件节点设置属性,可以设置多个:<Property name="" value="" />
		/// 属性名称:name="width";name="height";name="visible";name="hiddenhead"
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

		#region  内部函数

	
		/// <summary>
		/// 对单元的xml节点检查，去掉不需要展示到页面的元素和属性
		/// </summary>
		/// <param name="node">需要检查的Xml节点</param>
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
			//如果页面不需要这个元素,就移除该元素,如果页面不需要包含该属性就移除
			if(isMove)
			{
				node.ParentNode.RemoveChild(node);
				return;
			}
			else
			{
				//没有包含属性就删掉
				for(int i=node.Attributes.Count-1;i>-1;i--)
                    if (strAttrNames[iAttr].IndexOf(node.Attributes[i].LocalName.ToLower() + ",") < 0)
                        node.Attributes.RemoveAt(i);
				//递归处理子节点
				for(int i=node.ChildNodes.Count-1;i>-1;i--)
					this.CheckNode(node.ChildNodes[i]);
			}
		}
		
		#endregion

	}
}
