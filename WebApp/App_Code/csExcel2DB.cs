//风筝5.0 说：
//using System.Collections.Specialized;
//风筝5.0 说：
//XmlAttribute attrib=xmlNodeClone.OwnerDocument.CreateAttribute("state");
//attrib.Value="databinded";
//xmlFieldList[k].Attributes.SetNamedItem(attrib);

using System;
using System.IO;
using System.Xml;
using Estar.Business.UserRight;
using System.Collections.Specialized;
using Estar.Common.Tools;
using Estar.Business.DataManager;

namespace Estar.WebApp
{
	/// <summary>
	/// csExcel3DB 的摘要说明。
	/// </summary>
	public class csExcel2DB
	{
		/// <summary>
		/// 从模板文件和采集文件生成参数列表
		/// </summary>13842688585
		/// <param name="tpFileName">模板文件</param>
		/// <param name="srcFileName">采集文件</param>
		/// <returns></returns>
		public static NameObjectList[] CreateParamsList(string	tpFileName,string srcFileName)
		{
			//写入Excel的方法：
			//定义需要参数。
			
			//<明细>6,3,10,16;<区域>A2:M23;<参数>&[日期],&[单位];<主表>;<空列>1;<方式>1;<结束文字标志>建安形象进度;<结束行数标志>5
			//初始化XML命名空间, 建立一个XML文档,并调入模板文件取出模板参数
			string nsp = "urn:schemas-microsoft-com:office:spreadsheet";
			XmlDocument	xmldoc	=	new XmlDocument();

			xmldoc.Load(tpFileName);
			XmlElement	xmlRootEle=xmldoc.DocumentElement;

			XmlNamespaceManager	xmlNsmgl=new XmlNamespaceManager(xmldoc.NameTable);
			for(int i=0;i<xmlRootEle.Attributes.Count;i++)
			{
				string	strPrefix=xmlRootEle.Attributes[i].Prefix;
				string	strLocalName=xmlRootEle.Attributes[i].LocalName;
				string	strURI=xmlRootEle.Attributes[i].Value;
				if("xmlns"==strLocalName)
					xmlNsmgl.AddNamespace(string.Empty,strURI);
				if("xmlns"!=strPrefix)	continue;
				xmlNsmgl.AddNamespace(strLocalName,strURI);
			}
			
			//初始化EXCEL模板定位参数
			XmlNodeList xmlNodesRows=xmldoc.DocumentElement.SelectNodes("//ss:Row",xmlNsmgl);
			string strSysParam="";
			NameValueCollection		sysParamPosList=new NameValueCollection();
			
			for(int i=0; i<xmlNodesRows.Count;i++)
			{
				XmlAttribute attribrow = xmlNodesRows[i].OwnerDocument.CreateAttribute("行号");
				attribrow.Value = (i+1).ToString();
				xmlNodesRows[i].Attributes.SetNamedItem(attribrow);

				int cellIndex=0;
				XmlNodeList	Celllist=xmlNodesRows[i].SelectNodes("ss:Cell",xmlNsmgl);
				for(int j=0; j<Celllist.Count; j++)
				{
					if(Celllist[j].Attributes["ss:Index"]!=null)
						cellIndex = toInt(Celllist[j].Attributes["ss:Index"].Value);
					else
						cellIndex++;
					XmlAttribute attrib = Celllist[j].OwnerDocument.CreateAttribute("列号");
					attrib.Value = cellIndex.ToString();
					Celllist[j].Attributes.SetNamedItem(attrib);
				}
			}
			
			
			//读出"Cell"节点中的定义值，得到循环数据区位置值
			string strpos = "//ss:Row[@行号='1']/ss:Cell[@列号='2']";
			XmlNode xmlNodeUnit=xmldoc.DocumentElement.SelectSingleNode(strpos,xmlNsmgl);

			//定义一个has表存贮和字段名,数据
			NameValueCollection		ParamList=new NameValueCollection();
			
			//取出第一个有值单元格的数据，解读即定参数
			string[] arrPos	= leofun.getArrayFromString(xmlNodeUnit.InnerText,";");
			
			//得到需要转入的数据库名称
			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<数据库>")>-1)
				{
					ParamList.Add("数据库",arrPos[i].Replace("<数据库>",""));
					break;
				}
			}

			//得到明细的区域位置值,该部分暂未用,主要用于打印;
			string[] arrDetail	=	null;
			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<数据表明细>")>-1)
				{
					arrDetail = leofun.getArrayFromString(arrPos[i].Replace("<数据表明细>",""),",");
					break;
				}
			}            

			//循环数据区起始位置:起始行
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始行=")>-1)
					{
						ParamList.Add("数据起始行",arrDetail[i].Replace("起始行=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:起始列
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始列=")>-1)
					{
						ParamList.Add("数据起始列",arrDetail[i].Replace("起始列=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("读入列数=")>-1)
					{
						ParamList.Add("数据读入列数",arrDetail[i].Replace("读入列数=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("分页行数=")>-1)
					{
						ParamList.Add("分页行数",arrDetail[i].Replace("分页行数=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("字段总数=")>-1)
					{
						ParamList.Add("字段总数",arrDetail[i].Replace("字段总数=",""));
						break;
					}
				}
			}


			//实际起始列（XML中，只要有数据，系统缺省认为是起始列，但不是实际的）
			int realcol0 =0;
			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<区域空列>")>-1)
				{
					ParamList.Add("区域空列",arrPos[i].Replace("<区域空列>",""));
					break;
				}
			}

			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<竖循环组>")>-1)
				{
					ParamList.Add("竖循环组",arrPos[i].Replace("<竖循环组>",""));
					break;
				}
			}

			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<结束文字标志>")>-1)
				{
					ParamList.Add("结束文字标志",arrPos[i].Replace("<结束文字标志>",""));
					break;
				}
			}

			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<结束行数标志>")>-1)
				{
					ParamList.Add("结束行数标志",arrPos[i].Replace("<结束行数标志>",""));
					break;
				}
			}
		
			//<模板读入规则>起始行=5,起始列=2,读入列数=1,组间隔=2;
			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<模板读入规则>")>-1)
				{
					arrDetail = leofun.getArrayFromString(arrPos[i].Replace("<模板读入规则>",""),",");
					break;
				}
			}


			//循环数据区起始位置:起始行
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始行=")>-1)
					{
						ParamList.Add("模板起始行",arrDetail[i].Replace("起始行=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:起始列
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始列=")>-1)
					{
						ParamList.Add("模板起始列",arrDetail[i].Replace("起始列=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("读入列数=")>-1)
					{
						ParamList.Add("模板读入列数",arrDetail[i].Replace("读入列数=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("组间隔=")>-1)
					{
						ParamList.Add("模板组间隔",arrDetail[i].Replace("组间隔=",""));
						break;
					}
				}
			}

			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<模板字段名位置>")>-1)
				{
					arrDetail = leofun.getArrayFromString(arrPos[i].Replace("<模板字段名位置>",""),",");
					break;
				}
			}

			//循环数据区起始位置:字段读入行数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始行=")>-1)
					{
						ParamList.Add("模板字段行起始位置",arrDetail[i].Replace("起始行=",""));
						break;
					}
				}
			}

			//循环数据区起始位置:数据读入列数
			if(arrDetail!=null && arrDetail.Length>0)
			{
				for(int i=0;i<arrDetail.Length;i++)
				{
					if(arrDetail[i].IndexOf("起始列=")>-1)
					{
						ParamList.Add("模板字段列起始位置",arrDetail[i].Replace("起始列=",""));
						break;
					}
				}
			}


            //取模板中系统参数字段的位置，并根据位置得到对应数据文件的实际值,约定：参数由参数行规定
			for(int i=0;i<arrPos.Length;i++)
			{
				if(arrPos[i].IndexOf("<参数>")>-1)
				{
					strSysParam = arrPos[i].Replace("<参数>","");
					strSysParam = strSysParam.Replace(" ","");
					strSysParam = strSysParam.Trim();					
					break;
				}
			}
	

			//取到循环体的字段名
			NameValueCollection		FieldNameList=new NameValueCollection();
			int fieldrow = toInt(ParamList["模板字段行起始位置"]);
			int fieldcol = toInt(ParamList["模板字段列起始位置"]);
			
			//定义数据源参数，置入在HAS表中，以供INSERT使用
			
			for(int i=0; i<toInt(ParamList["字段总数"]); i++)
			{
				strpos = "//ss:Row[@行号='"+ fieldrow.ToString() +"']/ss:Cell[@列号='"+(fieldcol+i).ToString()+"']";
				xmlNodeUnit = xmldoc.DocumentElement.SelectSingleNode(strpos,xmlNsmgl);

				string strcolname = xmlNodeUnit.InnerText;
				FieldNameList.Add(strcolname,"");
			}


			//第三种方式:一页有多列方式,如:分类,项目,人数  分类,项目,人数  分类,项目,人数
			//处理方法:考虑到合并的可能性,先读模板,从模板中读出合并项,如分类;竖Z字方式读入,循环列数为ParamList["模板读入列数"],ParamList["模板循环间隔"]
			string strEmpty="", strVal="";
			int splitnum = toInt(ParamList["字段总数"]);
			int sumCount = toInt(ParamList["竖循环组"])*(xmlNodesRows.Count-fieldrow-1);//-1因为最后一行有个合计行
            string [,] arrFieldVals = new String[sumCount,splitnum];
			
			string	strGroupValue="";
			for(int ix=0; ix<toInt(ParamList["竖循环组"]);ix++)
			{
				string	strColValue="";
				for(int i=0; i<toInt(ParamList["模板读入列数"]);i++)
				{
					strEmpty = "";
					string	strRowValue="";
					for(int j=0; j<xmlNodesRows.Count-fieldrow-1; j++)
					{
						strpos = "//ss:Row[@行号='"+ (fieldrow+j+1-1).ToString() +"']/ss:Cell[@列号='"+(fieldcol+i+ix*splitnum).ToString()+"']";
						xmlNodeUnit = xmldoc.DocumentElement.SelectSingleNode(strpos,xmlNsmgl);
						strEmpty = xmlNodeUnit.InnerText;
						strRowValue += ","+xmlNodeUnit.InnerText;
					}
					if(strRowValue!="")
						strColValue +=";"+strRowValue.Remove(0,1);
				}
				if(strColValue!="")
					strGroupValue += "@"+strColValue.Remove(0,1);
			}
			if(strGroupValue!="")
				strGroupValue=strGroupValue.Remove(0,1);

			//调入新的数据XML文件, 给数据文件进行强制定位。原则：合计数不读
			xmldoc.Load(srcFileName);
			xmlNodesRows=xmldoc.DocumentElement.SelectNodes("//ss:Row",xmlNsmgl);
//			NameValueCollection		sysParamPosList=new NameValueCollection();
			
			for(int i=0; i<xmlNodesRows.Count;i++)
			{
				XmlAttribute attribrow = xmlNodesRows[i].OwnerDocument.CreateAttribute("行号");
				attribrow.Value = (i+1).ToString();
				xmlNodesRows[i].Attributes.SetNamedItem(attribrow);

				int cellIndex=0;
				XmlNodeList	Celllist=xmlNodesRows[i].SelectNodes("ss:Cell",xmlNsmgl);
				for(int j=0; j<Celllist.Count; j++)
				{
					if(Celllist[j].Attributes["ss:Index"]!=null)
						cellIndex = toInt(Celllist[j].Attributes["ss:Index"].Value);
					else
						cellIndex++;
					XmlAttribute attrib = Celllist[j].OwnerDocument.CreateAttribute("列号");
					attrib.Value = cellIndex.ToString();
					Celllist[j].Attributes.SetNamedItem(attrib);
				}
			}
			//获的数据值数据组
			NameValueCollection		sysParamList=new NameValueCollection();
			strVal="";

			splitnum = toInt(ParamList["字段总数"]);
			fieldcol = toInt(ParamList["数据起始列"]);
			string strDBGroupValue="";
			for(int ix=0; ix<toInt(ParamList["竖循环组"]);ix++)
			{
				string	strColValue="";
				for(int i=0; i<toInt(ParamList["数据读入列数"]);i++)
				{
					strEmpty = "";
					string	strRowValue="";
					for(int j=0; j<xmlNodesRows.Count-fieldrow-1; j++)
					{
						strpos = "//ss:Row[@行号='"+ (fieldrow+j+1-1).ToString() +"']/ss:Cell[@列号='"+(fieldcol+i+ix*splitnum).ToString()+"']";
						xmlNodeUnit = xmldoc.DocumentElement.SelectSingleNode(strpos,xmlNsmgl);
						strEmpty = xmlNodeUnit.InnerText;
						strRowValue += ","+xmlNodeUnit.InnerText;
					}
					if(strRowValue!="")
						strColValue +=";"+strRowValue.Remove(0,1);
				}
				if(strColValue!="")
					strDBGroupValue += "@"+strColValue.Remove(0,1);
			}
			if(strDBGroupValue!="")
				strDBGroupValue=strDBGroupValue.Remove(0,1);

			//把读取数据放入
			//FieldNameList 字段列表	strGroupValue 模板数据(字段)		strDBGroupValue 报表数据
			//,分割单元格值 ;分割列值	@分割组值
			// 1,2,3;2,3,4;4,5,4@1,2,3;2,3,4;4,5,4
			// 2,2,3@4,3,5

			//确定行数
			int	 iposgroup	=	strGroupValue.IndexOf("@");
			int  iposcol	=	strGroupValue.IndexOf(";");
			int  icollen	=	(iposcol<iposgroup)? iposcol : iposgroup;
			if(iposcol<0 || iposgroup<0)
				icollen=(iposcol<0 && iposgroup<0)? strGroupValue.Length : ((iposcol<0)?iposgroup:iposcol);

			int	 irowcount=strGroupValue.Substring(0,icollen).Split(",".ToCharArray()).Length;
			int  ig = irowcount*strDBGroupValue.Split("@".ToCharArray()).Length;
			NameObjectList[]	paramslist=new NameObjectList[ig];

			//读取合并后的单元格数据
			//取分组，即如果有分组的话,取分的组数进行循环。先取字段分组，后取数据分组
			string[]	strTpGroupList=leofun.getArrayFromString(strGroupValue,"@");
			string[]	strDBGroupList=leofun.getArrayFromString(strDBGroupValue,"@");
			int irowindex=0;	//读取分组时的当前组基点行数
			//单组时，strTpGroupList.Length=1,多组间用@分开
			//"水库名称;一月;二月;三月;四月上旬;四月中旬;四月下旬;五月上旬;五月中旬;五月下旬;六月上旬;六月中旬;六月下旬;七月上旬;七月中旬;七月下旬;八月上旬;八月中旬;八月下旬;九月上旬;九月中旬;九月下旬;十月上旬;十月中旬;十月下旬;十一月;十二月"
			//"长诏,巧英,南山,辽湾,坂头,剡源,前岩,丰潭,平水江,陈蔡,石壁,安华,青山,五泄,征天;
			//7216.00,,,,,,,,,,,,,,;
			//7254.00,,,,,,,,,,,,,,;
			//8771.00,,,,,,,,,,,,,,;
			//9860.00,,,,,,,,,,,,,,;
			//11603.00,,,,,,,,,,,,,,;
			//11488.00,,,,,,,,,,,,,,;
			//11488.01,,,,,,,,,,,,,,;
			//11488.02,,,,,,,,,,,,,,;
			//11488.03,,,,,,,,,,,,,,;
			//11488.04,,,,,,,,,,,,,,;11488.05,,,,,,,,,,,,,,;11488.06,,,,,,,,,,,,,,;11488.07,,,,,,,,,,,,,,;11488.08,,,,,,,,,,,,,,;11488.09,,,,,,,,,,,,,,;11488.10,,,,,,,,,,,,,,;11488.11,,,,,,,,,,,,,,;11488.12,,,,,,,,,,,,,,;11488.13,,,,,,,,,,,,,,;11488.14,,,,,,,,,,,,,,;11488.15,,,,,,,,,,,,,,;11488.16,,,,,,,,,,,,,,;11488.17,,,,,,,,,,,,,,;11488.18,,,,,,,,,,,,,,;11488.19,,,,,,,,,,,,,,;11488.20,,,,,,,,,,,,,,"
//			for(int i=0;i<FieldNameList.Count;i++)
//			{
//				paramslist[i]
//			}
//			for(int i=0;i<strTpGroupList.Length;i++)
//			{
//				//string		strColNew=strTpGroupList[i]+";"+strDBGroupList[i];
//				string		strColNew=strDBGroupList[i];
//				string[]	strColList=strColNew.Split(";".ToCharArray());
//				//从两个文件合并列值,然后再每列分到行上即单元格
//				for(int icol=0;icol<strColList.Length;icol++)
//				{
//					string[]	strCellList=strColList[icol].Split(",".ToCharArray());
//					for(int irow=0;irow<strCellList.Length;irow++)
//					{
//						if(null==paramslist[irow+irowindex])
//							paramslist[irow+irowindex]=new NameObjectList();
//						paramslist[irow+irowindex].Add(FieldNameList.Keys[icol],strCellList[irow]);
//					}
//				}
//				irowindex=irowcount*(i+1);
//			}
			return paramslist;
		}


		private bool sendtoDB(NameValueCollection sysParamList,NameValueCollection FieldNameList,NameValueCollection FieldValList)
		{
            string strfields="";
			return true;
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
		/// 得到明细参数1: <Detail>4,2,10
		/// </summary>
		/// <param name="str"></param>
		/// <returns></returns>
		public static string[] getSubAreaArray(string str)
		{
			char[] sep = {','};
			return str.Split(sep);
		}

	}


}
