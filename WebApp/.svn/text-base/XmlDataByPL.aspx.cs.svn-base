using System;
using System.IO;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Xml;
using System.Text;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using System.Configuration;

namespace Estar.WebApp
{
	/// <summary>
	/// XmlDataLand 的摘要说明。
	/// </summary>
	public partial class XmlDataByPL : System.Web.UI.Page
	{
		XmlDocument		xmldocSchema=new XmlDocument();
		UnitItem		unitItem=null;
		private		XmlNamespaceManager		_xmlNsMglSchema=null;
		private		DataSet			_dictds=new DataSet("Dict");

		protected void Page_Load(object sender, System.EventArgs e)
		{
			// 在此处放置用户代码以初始化页面
			XmlDocument		xmldoc=new XmlDocument();
			//读取用户参数
			StreamReader streamreader=new StreamReader(this.Request.InputStream,Encoding.UTF8);
			xmldoc.LoadXml(streamreader.ReadToEnd());
			NameObjectList[]	paramlist=BuildParamList.BuildParamsList(xmldoc);
			try
			{
				string	unitName=paramlist[0]["UnitName"].ToString();
                unitItem = new UnitItem(this.MapPath(DataAccRes.AppSettings("WorkConfig")), unitName);
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
				return;
			}

			QueryDataRes	query=new QueryDataRes(unitItem.DataSrcFile);
			DataSet			ds=new DataSet(unitItem.UnitName);
			ds.EnforceConstraints=false;
			string			itemdata=paramlist[0]["DataItem"].ToString();
			string[]		dataItemList=itemdata.Split(",".ToCharArray());

			for(int i=0;i<dataItemList.Length;i++)
			{
				if(""==dataItemList[i])		continue;
                for(int j=0;j<paramlist.Length;j++)
                {
                    DataTable tab = query.getTable(dataItemList[i], paramlist[j]);
                    ds.Merge(tab);
                }
			}
            //增加行光标列
            for (int i = 0; i < ds.Tables.Count; i++)
            {
                DataTable tab = ds.Tables[i];
                if (null != tab && !tab.Columns.Contains("RowNum"))
                    tab.Columns.Add("RowNum", Type.GetType("System.Int32"));
                for (int j = 0; null != tab && j < tab.Rows.Count; j++)
                    tab.Rows[j]["RowNum"] = j + 1;
            }
            //数字是0的,改为空值显示
            for (int s = 0; s < ds.Tables.Count; s++)
            {
                DataTable tab = ds.Tables[s];
                if (null == tab) continue;
                for (int i = 0; i < tab.Columns.Count; i++)
                {
                    DataColumn col = tab.Columns[i];
                    if ("RowNum" == col.ColumnName) continue;
                    if ("Decimal" != col.DataType.Name && "Double" != col.DataType.Name && "Int16" != col.DataType.Name
                            && "Int32" != col.DataType.Name && "Int64" != col.DataType.Name && "Single" != col.DataType.Name
                             && "UInt16" != col.DataType.Name && "UInt32" != col.DataType.Name && "UInt64" != col.DataType.Name)
                        continue;
                    for (int j = 0; j < tab.Rows.Count; j++)
                    {
                        if (null == tab.Rows[j][i] || DBNull.Value == tab.Rows[j][i])
                            continue;
                        decimal num = Convert.ToDecimal(tab.Rows[j][i]);
                        if (0 == num)
                            tab.Rows[j][i] = DBNull.Value;
                    }
                }
            }

            this.xmldocSchema.LoadXml(ds.GetXmlSchema());
			XmlNamespaceManager		xmlNsMgl=new XmlNamespaceManager(this.xmldocSchema.NameTable);
			XmlNode	xmlRootEle=this.xmldocSchema.DocumentElement;
			for(int i=0;i<xmlRootEle.Attributes.Count;i++)
			{
				string	strPrefix=xmlRootEle.Attributes[i].Prefix;
				string	strLocalName=xmlRootEle.Attributes[i].LocalName;
				string	strURI=xmlRootEle.Attributes[i].Value;
				if("xmlns"==strLocalName)	
					xmlNsMgl.AddNamespace(string.Empty,strURI);
				if("xmlns"!=strPrefix)	continue;
				xmlNsMgl.AddNamespace(strLocalName,strURI);
			}
			this._xmlNsMglSchema=xmlNsMgl;
			this.setSchema(ds);

			QueryDataRes	dictQuery=new QueryDataRes(unitItem.DictColSrcFile);
			WorkItem	workitem=null;
			for(int i=0;i<unitItem.WorkItemList.Length;i++)
				if(unitItem.WorkItemList[i].ItemName==paramlist[0]["WorkItem"].ToString())
				{
					workitem=unitItem.WorkItemList[i];
					break;
				}
			for(int i=0;i<workitem.DictCol.Length;i++)
			{
				DictColumn	dictcol=workitem.DictCol[i];
                if (dictcol.DataSrc.Trim().Length > 0)
                {
                    bool isContinue = false;
                    for (int k = 0; k < i; k++)
                        if (dictcol.DataSrc == workitem.DictCol[k].DataSrc)
                        {
                            isContinue = true; break;
                        }
                    if (isContinue) continue;
                    dictQuery.FillDataSet(dictcol.DataSrc, paramlist, this._dictds);
                }
			}

			XmlDataDocument	xmldocData=new XmlDataDocument(ds);
			this.setFormatXmlLand(xmldocData,ds);
            this.Response.ContentType = "text/xml; charset=gb2312";
			xmldocData.Save(this.Response.Output);
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

		/// <summary>
		/// 设置数据集的结构及定义属性
		/// </summary>
		private void	setSchema(DataSet	ds)
		{
			//需要输出到客户端的项目属性,列属性
			if(null==this.unitItem)
				return;
			//workitem定义列属性
			XmlNodeList xmlColNodeList=this.xmldocSchema.SelectNodes("//xs:sequence//xs:element",this._xmlNsMglSchema);
            
			for(int i=0;i<xmlColNodeList.Count;i++)
			{
				XmlNode	xmlColSchema=xmlColNodeList[i];
				string	colName=xmlColSchema.Attributes["name"].Value;
				//自定义属性,如果自定义属性为空,忽略处理
				XmlNode	xmlNodeTable=xmlColSchema.SelectSingleNode("../../..");
				if(null==xmlNodeTable)		continue;
				string		strXPath=".//Item[@dataitem='"+xmlNodeTable.Attributes["name"].Value+"']";
				XmlNode		xmlItem=this.unitItem.UnitNode.SelectSingleNode(strXPath);
				if(null==xmlItem)
				{
					strXPath=".//AppendItem[@dataitem='"+xmlNodeTable.Attributes["name"].Value+"']";
					xmlItem=this.unitItem.UnitNode.SelectSingleNode(strXPath);
				}
				if(null==xmlItem)	continue;
				XmlNode		xmlCol=xmlItem.SelectSingleNode("Column[@name='"+colName+"']");
				for(int j=0;null!=xmlCol && j<xmlCol.Attributes.Count;j++)
				{
					string	localName=xmlCol.Attributes[j].LocalName;
					if(null!=xmlColSchema.Attributes[localName])
						continue;
					if(""==xmlCol.Attributes[j].Value)
						continue;
					XmlAttribute attr=xmlColSchema.OwnerDocument.CreateAttribute(localName);
					attr.Value=xmlCol.Attributes[j].Value;
					xmlColSchema.Attributes.Append(attr);
				}
				//字段列如果有显示格式,说明格式列的字段名称
				if(null!=xmlColSchema.Attributes["format"] && ""!=xmlColSchema.Attributes["format"].Value)
				{
					xmlColSchema.Attributes.Append(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
					xmlColSchema.Attributes["formatfld"].Value=colName+"_格式";
				}
				//字段列如果是字典列,并且text列和value列不同,使用格式显示列
				if(null!=xmlColSchema.Attributes["dataitem"] && ""!=xmlColSchema.Attributes["dataitem"].Value
					&& null!=xmlColSchema.Attributes["textcol"] && ""!=xmlColSchema.Attributes["textcol"].Value
					&& null!=xmlColSchema.Attributes["valuecol"] && ""!=xmlColSchema.Attributes["valuecol"].Value	
					&& xmlColSchema.Attributes["valuecol"].Value!=xmlColSchema.Attributes["textcol"].Value)
				{
					xmlColSchema.Attributes.SetNamedItem(xmlColSchema.OwnerDocument.CreateAttribute("formatfld"));
					xmlColSchema.Attributes["formatfld"].Value=colName+"_显示";
				}
			}//for(int i=0;i<xmlColNodeList.Count;i++)
		}

	
		/// <summary>
		/// 根据数据集对应的数据文档,按照结构定义的格式,设置日期、数字、空数据的数据岛格式
		/// </summary>
		/// <param name="xmldoc">数据集的数据文档</param>
		/// <param name="ds">数据集</param>
		private	void	setFormatXmlLand(XmlDocument xmldoc,DataSet	ds)
		{
			//处理输出的字段格式
			for(int i=0;i<ds.Tables.Count;i++)
			{
				//处理日期:默认全部按照:yyyy-MM-dd格式输出
				for(int j=0;j<ds.Tables[i].Columns.Count;j++)
				{
					DataColumn	col=ds.Tables[i].Columns[j];
					if("DateTime"!=col.DataType.Name)
						continue;
					//该日期字段的所有行
					XmlNodeList		nodeDateList=xmldoc.SelectNodes("/*/"+ds.Tables[i].TableName+"/"+col.ColumnName);
					try
					{
						for(int k=0;k<nodeDateList.Count;k++)
							if(null!=nodeDateList[k].FirstChild && XmlNodeType.Text==nodeDateList[k].FirstChild.NodeType)
								nodeDateList[k].FirstChild.Value=DateTime.Parse(nodeDateList[k].FirstChild.Value).ToString("yyyy-MM-dd");
					}
					catch{}
				}
				//对所有行进行处理,让它包含所有字段,没有数据的字段增加空节点
                for (int j = 0; j < ds.Tables[i].Rows.Count; j++)
                {
                    XmlNode xmlNodeRow = xmldoc.DocumentElement.ChildNodes[j];
                    for (int k = 0; k < ds.Tables[i].Columns.Count; k++)
                    {
                        if (null == ds.Tables[i].Rows[j][k] || DBNull.Value == ds.Tables[i].Rows[j][k])
                        {
                            DataColumn col = ds.Tables[i].Columns[k];
                            xmlNodeRow.AppendChild(xmldoc.CreateElement(col.ColumnName));
                        }
                    }
                }
                //对自定义格式的字段,增加列转换输出;对字典字段也增加一个格式字段输出
				//这个格式字段在formatfld属性说明
				string			strXPathCol="//xs:element[@name='"+ds.Tables[i].TableName+"']//xs:sequence//xs:element[@formatfld]";
				XmlNodeList		xmlColFormat=this.xmldocSchema.SelectNodes(strXPathCol,this._xmlNsMglSchema);
				for(int j=0;j<xmlColFormat.Count;j++)
				{
					string		strColName=xmlColFormat[j].Attributes["name"].Value;
					string		strFormat="";
					string		strDataItem="",strTextFld="",strValueFld="";
					if(null!=xmlColFormat[j].Attributes["format"] && ""!=xmlColFormat[j].Attributes["format"].Value)
						strFormat=xmlColFormat[j].Attributes["format"].Value;
					if(null!=xmlColFormat[j].Attributes["dataitem"] && ""!=xmlColFormat[j].Attributes["dataitem"].Value
						&& null!=xmlColFormat[j].Attributes["textcol"] && ""!=xmlColFormat[j].Attributes["textcol"].Value
						&& null!=xmlColFormat[j].Attributes["valuecol"] && ""!=xmlColFormat[j].Attributes["valuecol"].Value	)
					{
						strDataItem=xmlColFormat[j].Attributes["dataitem"].Value;
						strTextFld=xmlColFormat[j].Attributes["textcol"].Value;
						strValueFld=xmlColFormat[j].Attributes["valuecol"].Value;
					}
					string		strColFormatName=xmlColFormat[j].Attributes["formatfld"].Value;
					DataColumn	col=ds.Tables[i].Columns[strColName];

					XmlNodeList		xmlNodeList=xmldoc.SelectNodes("/*/"+ds.Tables[i].TableName+"/"+strColName);
					for(int k=0;k<xmlNodeList.Count;k++)
					{
						string		strValue="";
						if(null!=xmlNodeList[k].FirstChild && XmlNodeType.Text==xmlNodeList[k].FirstChild.NodeType)
							strValue=xmlNodeList[k].FirstChild.Value;
						try
						{
							if(""!=strFormat && ""!=strValue)
								switch(col.DataType.Name)
								{
									case "DateTime":
										strValue=Convert.ToDateTime(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int16":
										strValue=Convert.ToInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int32":
										strValue=Convert.ToInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Int64":
										strValue=Convert.ToInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt16":
										strValue=Convert.ToUInt16(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt32":
										strValue=Convert.ToUInt32(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "UInt64":
										strValue=Convert.ToUInt64(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Decimal":
										strValue=Convert.ToDecimal(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									case "Double":
										strValue=Convert.ToDouble(xmlNodeList[k].FirstChild.Value).ToString(strFormat);
										break;
									default:
										strValue=xmlNodeList[k].FirstChild.Value;
										break;
								}
							if(""!=strDataItem && this._dictds.Tables.Contains(strDataItem) 
								&& this._dictds.Tables[strDataItem].Columns.Contains(strTextFld))
							{
								DataRow[]		drs=this._dictds.Tables[strDataItem].Select(strValueFld+"='"+strValue+"'");
								if(drs.Length>0 && null!=drs[0][strTextFld])
									strValue=drs[0][strTextFld].ToString();
							}
						}catch(Exception ex){
							ExceptionManager.Publish(ex);
						}finally{
							//格式字段值加入文档节点
							try
							{
								XmlNode		xmlNodeNew=xmlNodeList[k].ParentNode.AppendChild(xmldoc.CreateElement(strColFormatName));
								if(""!=strValue && null!=xmlNodeNew)
									xmlNodeNew.AppendChild(xmldoc.CreateTextNode(strValue));
							}catch{}
						}//try-catch-finally
					}
				}//for(int j=0;j<xmlColFormat.Count;j++)
			}//for(int i=0;i<ds.Tables.Count;i++)
			
		}
		

	}
}
