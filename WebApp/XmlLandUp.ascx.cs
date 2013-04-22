namespace Estar.WebApp
{
	using System;
	using System.IO;
	using System.Data;
	using System.Drawing;
	using System.Web;
	using System.Xml;
	using System.Text;
	using System.Web.UI.WebControls;
	using System.Web.UI.HtmlControls;
	using Microsoft.ApplicationBlocks.ExceptionManagement;
	using Estar.Common.Tools;
	using Estar.Common.WebControlTools;

	/// <summary>
	///		UpXmlLand 的摘要说明。
	/// </summary>
	public partial class UpXmlLand : BaseControl
	{

		private		string		_xmllandID="";

		#region 控件内事件函数
		
		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			if(null!=this.ViewState["xmlCtrlNode"])
			{
				string	strxml=this.ViewState["xmlCtrlNode"].ToString();
				XmlDocument		xmldoc=new XmlDocument();
				xmldoc.LoadXml(strxml);
				this.SetAttribute(xmldoc.DocumentElement);
			}
		}


		protected void UpXmlLand_PreRender(object sender, System.EventArgs e)
		{
            BasePage page = this.Page as BasePage;
			string	strUserContrl="<XMLLANDUP ControlID={0} ClientData={1} HlbCommand={2} BtCommand={3} />";
            if (this.ltHTMLUp.Text.Length > 3)
                this.ltScript.Text = string.Format(strUserContrl, this.CtrlXmlID, this.CtrlXmlID, this.hlb_cmd.ClientID, page.PgBtCmd.ClientID);
            else
                this.ltScript.Text = string.Format(strUserContrl, this.CtrlXmlID, "''", this.hlb_cmd.ClientID, page.PgBtCmd.ClientID);
		}


		#endregion

		#region 内部对象

		/// <summary>
		/// 读取或设置页面包含数据岛元素的ID
		/// </summary>
		public string	CtrlXmlID
		{
			get{return this._xmllandID;}
			set{this._xmllandID=value;}
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
			this.PreRender += new System.EventHandler(this.UpXmlLand_PreRender);

		}
		#endregion

		#region 基类的数据绑定实现

		/// <summary>
		/// 依据table提供的数据环境绑定数据
		/// </summary>
		/// <param name="workGrid">提供参数的数据环境</param>
		public override	 void		CtrlDataBind(DataRow dr)
		{
			return;
		}


		/// <summary>
		/// 不需要提供数据环境的数据绑定
		/// </summary>
		public override	 void		CtrlDataBind()
		{
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
		/// 根据xml控件节点设置属性,可以设置多个:filenameupload:上传文件名;  filenameinput:编辑页面用户文件名;	pathupload:上传web路径
		/// <Property name="FileColumn" pathupload="" filenameupload="" filenameinput="" />
		/// 根据文件类型设置保存路径：<Property name="filetype" value="img" />
		/// </summary>
		/// <param name="ctrlNode"></param>
		public override	 void		SetAttribute(XmlNode ctrlNode)
		{
			this.ViewState["xmlCtrlNode"]=ctrlNode.OuterXml;
			try
			{
				if(null!=ctrlNode.Attributes["id"] && ""!=ctrlNode.Attributes["id"].Value)
					this.CtrlXmlID=ctrlNode.Attributes["id"].Value;
				XmlNode	 xmlNodeWidth=ctrlNode.SelectSingleNode("Property[@name='width']");
				if(null!=xmlNodeWidth && null!=xmlNodeWidth.Attributes["value"] && ""!=xmlNodeWidth.Attributes["value"].Value)
					this.fXmlLand.Style.Add("width",xmlNodeWidth.Attributes["value"].Value);
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
		/// 把上传文件转换为数据岛内容;把XML元素的ID名称加上_Up后缀;避免页面元素重名
		/// </summary>
		public void		TransXmlLand()
		{
			//没有设置路径的,采用默认路径,有具体指定路径的使用特定路径
			HttpPostedFile		postFile=this.fXmlLand.PostedFile;
			if(null==postFile || postFile.ContentLength<1)	return;
			try
			{
				StreamReader	xmlRead=new StreamReader(postFile.InputStream,Encoding.GetEncoding("GB2312"));
				string			strXml=xmlRead.ReadToEnd();
				XmlDocument			xmldoc=new XmlDocument();
				xmldoc.LoadXml(strXml);
				if(xmldoc.DocumentElement!=null)
				{
					if(null==xmldoc.DocumentElement.Attributes["id"])
						xmldoc.DocumentElement.Attributes.SetNamedItem(xmldoc.CreateAttribute("id"));
					xmldoc.DocumentElement.Attributes["id"].Value=this.CtrlXmlID;
					XmlNodeList		xmlNodeXMLList=xmldoc.SelectNodes("//XML[@id]");
					for(int i=0;i<xmlNodeXMLList.Count;i++)
						xmlNodeXMLList[i].Attributes["id"].Value=xmlNodeXMLList[i].Attributes["id"].Value+"_Up";
					xmlNodeXMLList=xmldoc.SelectNodes("//XML[@typexml]");
					for(int i=0;i<xmlNodeXMLList.Count;i++)
						xmlNodeXMLList[i].Attributes["typexml"].Value=xmlNodeXMLList[i].Attributes["typexml"].Value+"_Up";
				}
				this.ltHTMLUp.Text=xmldoc.OuterXml;
			}
			catch{}
			this.hlb_cmd.Value="";
		}


		#endregion

        #region 基类的回传命令事件
        
        /// <summary>
        /// 基类事件,在页面回传事件调用
        /// 执行回传命令:命令参数样式: @key=value,@key=value,@key=value
        /// 参数内容: CtrlID 触发事件的控件, Cmd 命令参数; TabID Tab页ID;CmdFull 全命令参数;CmdP 其他命令参数
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public override void ExecutCommand(object sender, System.EventArgs e)
        {
            string[] strTagName ={ "CtrlID", "Cmd", "TabID", "CmdFull", "CmdP" };
            BasePage page = this.Page as BasePage;
            string strCmd = leofun.valtag(page.PgStrCmd, "Cmd");
            string strCmdP = leofun.valtag(page.PgStrCmd, "CmdP");
            switch (strCmd)
            {
                case "xmllandup":
                    this.TransXmlLand();
                    break;
                default:
                    break;
            }
            this.hlb_cmd.Value = "";

        }

        #endregion

    }
}
