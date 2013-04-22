//给程序访问excel赋权
//a.	运行dcomcnfg命令
//	 	
//b.	在分布式com配置属性里选中microsoft excel应用程序
// 
//c.	点击属性，选择安全性页签
// 
//d.	对于选择的三个选项均添加everyone用户


// 打印更改：将原来传入的主，副GRID改为数据源，以TAB的形式传入

using System;
using System.IO;
using System.Xml;
using Estar.Business.UserRight;
using Estar.Common.Tools;

namespace Estar.WebApp
{
	/// <summary>
	/// csPrint 的摘要说明。
	/// </summary>
	public class csPrint
	{

		/// <summary>
		/// 给<PageSetup>赋值prnunit,prnname
		/// </summary>
		/// <param name="xmldoc"></param>
		public static void setpageSetup(XmlDocument	xmldoc,string userid)
		{
			XmlNamespaceManager	xmlNsmgl=new XmlNamespaceManager(xmldoc.NameTable);
			xmlNsmgl.AddNamespace("docpro","urn:schemas-microsoft-com:office:excel");
			//遍历PageSetup下的所有子节点
			XmlNodeList nodelist = xmldoc.DocumentElement.SelectSingleNode("//docpro:PageSetup",xmlNsmgl).ChildNodes;
			for(int i=0; i<nodelist.Count;i++)
			{
				for(int j=0;j<nodelist[i].Attributes.Count;j++)
				{
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnname",getParam("prnname",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnman",getParam("prnman",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[姓名]",getParam("&[姓名]",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnunit",getParam("prnunit",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[日期]",getParam("&[日期]",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[date]",getParam("&[date]",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[单位]",getParam("&[单位]",userid));
					nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[部门]",getParam("&[部门]",userid));
				}
			}
		}

		public static string getParam(string param,string userid)
		{
			
			string str="";
			User userRight=new User(userid);
			//所属单位
			string unit = userRight.SubDeptName;
			//所属部门
			string dept = userRight.SubDeptName;
			//用户名
			string unsername = userRight.UserName;
			//用户帐号
			string useraccount = userRight.UserAccounts;
			switch(param)
			{
				case "&[date]":
				case "&[日期]": str = DateTime.Now.ToString("yyyy年MM月dd日");
					break;
				case "&[单位]": str = unit;
					break;
				case "&[部门]": 
				case "prnunit": str = dept;
					break;
				case "prnname":
				case "prnman":
				case "&[姓名]": str = unsername;
					break;
				default:
					str = "";
					break;
			}
			return str;
		}


		/// <summary>
		///   
		///		<PageBreaks xmlns="urn:schemas-microsoft-com:office:excel">
		///		<RowBreaks>
		///		<RowBreak>
		///		<Row>12</Row>  //行号
		///		</RowBreak>
		///		</RowBreaks>
		///		</PageBreaks>

		/// </summary>
		public static void creatpagebreak(string pagebreakRows,XmlDocument	xmldoc)
		{
			char[] sep={';'};
			string[] strbreaks=pagebreakRows.Split(sep);
			string nsp = "urn:schemas-microsoft-com:office:excel";
			XmlNamespaceManager	xmlNsmgl=new XmlNamespaceManager(xmldoc.NameTable);
			xmlNsmgl.AddNamespace("docpro","urn:schemas-microsoft-com:office:spreadsheet");
			XmlNode root=xmldoc.DocumentElement.SelectSingleNode("//docpro:Worksheet",xmlNsmgl);
			XmlElement xe = xmldoc.CreateElement("PageBreaks",nsp);
			xe.SetAttribute("xmlns",nsp);//设置该节点属性
            XmlElement xesub0 = xmldoc.CreateElement("","RowBreaks",nsp);
			for(int i=0;i<strbreaks.Length;i++)
			{
				XmlElement xesub1 = xmldoc.CreateElement("","RowBreak",nsp);
				XmlElement xesub2 = xmldoc.CreateElement("","Row",nsp);
				xesub2.InnerText = strbreaks[i];
				xesub1.AppendChild(xesub2);
				xesub0.AppendChild(xesub1);
			}
			xe.AppendChild(xesub0);
			root.AppendChild(xe);
		}

/// <summary>
/// 
/// </summary>
/// <param name="startrow"></param>
/// <param name="endrow"></param>
/// <param name="NodesRow"></param>
/// <param name="sumsign"></param>
/// <param name="sumfld"></param>
/// <param name="arrfld"></param>

		public static string[] getExcelFields(XmlNode FldNode)
		{
			XmlNodeList xnodelist = FldNode.ChildNodes;
			char[] sep  = {';'};
			string str = "",fld="";
			for(int j=0;j<xnodelist.Count;j++)
			{
				if(xnodelist[j].InnerText!="" && xnodelist[j].InnerText.IndexOf("S合计:")<0  && xnodelist[j].InnerText.IndexOf("S合计：")<0)
				{
					fld = xnodelist[j].InnerText.Replace("sum(","");
					fld = fld.Replace("SUM(","");
					fld = fld.Replace("sum（","");
					fld = fld.Replace("SUM（","");
					fld = fld.Replace(")","");
					fld = fld.Replace("）","");
					str = str  + ";" + fld;
				}
			}
			
			if(str!="")
			{
				str = str.Remove(0,1);
				return str.Split(sep);
			}
			else
				return null;
		}

		public static int toInt(string str)
		{
			int val=0;
			if(str==null){return 0;}
			if(str==""){return 0;};
			val=int.Parse(str.Replace("px",""));
			return val;
		}

		/// <summary>
		/// 遍历Row节点，查找与参数名相同的值
		/// </summary>
		/// <param name="arrParams"></param>
		/// <param name="strArea"></param>
		public static void initExcelTemp(string[] arrParams, string strArea)
		{

		}


		/// <summary>
		/// 得到明细参数1: <Detail>4,2,10
		/// </summary>
		/// <param name="str"></param>
		/// <returns></returns>
		public static string[] getSubAreaArray(string str)
		{
			char[] sep = {','};
			return str.Split(sep);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="strDefine"></param>
		/// <returns></returns>
		public static string[] getArrPos(string strPrn)
		{
			if(strPrn.IndexOf("<Detail>")>-1 || strPrn.IndexOf("<明细>")>-1)
			{
				strPrn	=	strPrn.Replace("<Detail>","");
				strPrn	=	strPrn.Replace("<明细>","");
				strPrn	=	strPrn.Replace("<Area>","");
				strPrn	=	strPrn.Replace("<区域>","");
				strPrn	=	strPrn.Replace("<参数>","");
				char[] sep  = {';'};
				return  strPrn.Split(sep); //得到两个段名下的值
			}
			else
				return null;
		}

		/// <summary>
		/// S组合计:;<别名>总体形象进度;<范围>分类!=建安
		/// </summary>
		/// <param name="strDefine"></param>
		/// <returns></returns>
		public static string[] getArrSUM(string strPrn)
		{
			if(strPrn.IndexOf("<Detail>")>-1 || strPrn.IndexOf("<明细>")>-1)
			{
				strPrn	=	strPrn.Replace("<Detail>","");
				strPrn	=	strPrn.Replace("<别名>","");
				strPrn	=	strPrn.Replace("<范围>","");
				char[] sep  = {';'};
				return  strPrn.Split(sep); //得到两个段名下的值
			}
			else
				return null;
		}

		/// <summary>
		/// 将生成的数据转为excel输出
		/// </summary>
		/// <param name="xmldoc">生成的数据xml文档</param>
		public static void outXML2ExcelDown(XmlDocument	xmldoc,string strfile,string stropenfile)
		{
			xmldoc.Save(strfile);
			System.Web.HttpContext.Current.Response.Write("<script language='javascript'>window.open('"+stropenfile+"')</script>");
		}


		/// <summary>
		/// 将生成的数据转为excel输出
		/// </summary>
		/// <param name="xmldoc">生成的数据xml文档</param>
		public static void outXML2Excel(XmlDocument	xmldoc,string strfile)
		{
			//strfile = strfile.Replace("@","");
			MemoryStream ExcelStream=new MemoryStream();
			xmldoc.Save(ExcelStream);

			Byte[] bytearray = (Byte[])Array.CreateInstance(typeof(byte), ExcelStream.Length);

			ExcelStream.Position = 0; // Star the stream at position 0
			ExcelStream.Read (bytearray, 0, (int)ExcelStream.Length); // Read the stream into the Byte[]
			ExcelStream.Close(); // Close the stream

			System.Web.HttpContext.Current.Response.Clear(); // Clear the Response Object
			System.Web.HttpContext.Current.Response.ClearHeaders();
			System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
			System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
			System.Web.HttpContext.Current.Response.Charset="gb2321";
			string strUrl = strfile;
			strUrl= strUrl.ToString();
            string prnmode = DataAccRes.AppSettings("prnmode");
            if (prnmode.ToLower() == "inline")
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "inline; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
            else
			    System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename="+System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
			//System.Web.HttpContext.Current.Response.AppendHeader("content-disposition","attachment; filename=print.xls"); // set the Content Header
			
			System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
//			System.Web.HttpContext.Current.Response.SuppressContent=false;
//			System.Web.HttpContext.Current.Response.Flush();
			//System.Web.HttpContext.Current.Response.End();
		}

		public static void outXML2Word(XmlDocument	xmldoc,string strfile)
		{
			//strfile = strfile.Replace("@","");
			MemoryStream ExcelStream=new MemoryStream();
			xmldoc.Save(ExcelStream);

			Byte[] bytearray = (Byte[])Array.CreateInstance(typeof(byte), ExcelStream.Length);

			ExcelStream.Position = 0; // Star the stream at position 0
			ExcelStream.Read (bytearray, 0, (int)ExcelStream.Length); // Read the stream into the Byte[]
			ExcelStream.Close(); // Close the stream

			System.Web.HttpContext.Current.Response.Clear(); // Clear the Response Object
			System.Web.HttpContext.Current.Response.ClearHeaders();
			System.Web.HttpContext.Current.Response.ContentType = "application/msword";
			System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
			System.Web.HttpContext.Current.Response.Charset="gb2321";
			string strUrl = strfile;
			strUrl= strUrl.ToString();
            string prnmode = DataAccRes.AppSettings("prnmode");
            if (prnmode.ToLower() == "inline")
			    System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "inline; filename="+System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
			else
                System.Web.HttpContext.Current.Response.AppendHeader("content-disposition", "attachment; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString())); // set the Content Header
			
			System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
			//			System.Web.HttpContext.Current.Response.SuppressContent=false;
			//			System.Web.HttpContext.Current.Response.Flush();
			//System.Web.HttpContext.Current.Response.End();
		}

		//备注
		//					cType = oGrid.Columns.FromKey(fldname).DataType;
		//					switch(cType)
		//					{
		//						case "System.Boolean":
		//							break;
		//						case "System.DateTime":
		//							break;
		//						case "System.Int32":
		//							vallist[j].ChildNodes[0].Attributes.Item(0).InnerText="Number";
		//							break;
		//						case "System.Double":
		//							vallist[j].ChildNodes[0].Attributes.Item(0).InnerText="Number";
		//							break;
		//						default:
		//							break;
		//					}
	}
}
