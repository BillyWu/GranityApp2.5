
// 打印更改：将原来传入的主，副GRID改为数据源，以TAB的形式传入

using System;
using System.IO;
using System.Xml;
using System.Data;
using System.Web;
using Estar.Business.UserRight;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Estar.Common.WebControlTools;
using System.Collections;

namespace Estar.WebApp
{
	/// <summary>
	/// csPrint 的摘要说明。
	/// </summary>
	public class csPrintData
	{
        /// <summary>
        /// 打印函数说明
        /// 设置说明：<明细>起始行,起始列,字段数量,分页数
        /// </summary>
        /// <param name="SourceFile">打印模板文件</param>
        /// <param name="destFile">结果存贮文件，暂无用</param>
        /// <param name="oData">打印数据明细表 DataTable</param>
        /// <param name="MData">主表 DataTable</param>
        /// <param name="mcurrow">主表当前行</param>
        /// <param name="userid">用户ID</param>
        /// <param name="paramlist">打印参数集</param>
        /// 修改：<明细>改为@dataitem name,每个记录改为@dataitem name.字段,包括合计项
        /// 对应修改：传入项为：
        /// 1 计算最多页数：分析所有DATAITEM项,根据定义的每页数量和记录总数计算出需要的总页面数,maxpage
        /// 2 开始循环,以
        ///<returns></returns>
        public static XmlDocument makeprint(WorkItem masterItem, WorkItem workitem, string SourceFile, string destFile, DataTable oData, DataTable MData, int mcurrow, string userid, NameObjectList paramlist)
		{
			//写入Excel的方法：
			//定义需要参数。<明细>5,2,10,15;

            string TemplatePath = HttpContext.Current.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。

			//副本的文件名，不带路径。
			string TempFileName = destFile;
			//初始化XML命名空间
			string nsp = "urn:schemas-microsoft-com:office:spreadsheet";
			XmlDocument	xmldoc=new XmlDocument();
			try
			{
				xmldoc.Load(TemplatePath+"\\"+SourceFile);
			}
			catch
			{
				string strMSG = "请关闭正在打开的模板文件"+SourceFile+"!";
				System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
				System.Web.HttpContext.Current.Response.Write("alert('"+ strMSG +"')");
				System.Web.HttpContext.Current.Response.Write("	</script>							");
				return null;
			}
			XmlNamespaceManager		xmlNsmgl=new XmlNamespaceManager(xmldoc.NameTable);
			xmlNsmgl.AddNamespace("docpro",nsp);
            User userRight = null;
            bool isbad = false;
            if (string.IsNullOrEmpty(Convert.ToString(paramlist["DWName"])))
                userRight = new User(userid, ref isbad);
			//读出"Cell"节点中的定义值，得到循环数据区位置值
			XmlNodeList	xmlNodes=xmldoc.DocumentElement.SelectNodes("//docpro:Cell",xmlNsmgl);
			//取出第一个有值单元格的数据，解读即定参数
			string[] arrPos	= leofun.getArrayFromString(xmlNodes[0].InnerText,";");
			xmlNodes[0].InnerText="";
			//得到明细的区域位置值
            //修改：<明细>改为@dataitem name
            string[] arrDetail = masterdatas(arrPos, "<明细>");
            int startrow = (arrDetail == null || arrDetail.Length < 1) ? 0 : toInt(arrDetail[0]) - 1;  //起始行号   6,2,3,23,5(并列从第5列开始第二次),8（从8列开始第三次）;
            int startcol = (arrDetail == null || arrDetail.Length < 2) ? 0 : toInt(arrDetail[1]);      //起始列号
            int fldcount = (arrDetail == null || arrDetail.Length < 3) ? 0 : toInt(arrDetail[2]);      //字段数量
            int prnPageSize = (arrDetail == null || arrDetail.Length < 4) ? 0 : toInt(arrDetail[3]);   //每页行数(分页数量)
            int startcol2 = 0;
            int startcol3 = 0;
            int startcol4 = 0;
            int repeatcols = (arrDetail == null || arrDetail.Length < 3) ? 0 : (arrDetail.Length - 3);
            if(repeatcols==2) startcol2 = toInt(arrDetail[4]);
            if (repeatcols == 3)
            {
                startcol2 = toInt(arrDetail[4]);
                startcol3 = toInt(arrDetail[5]);
            }
            if (repeatcols == 4)
            {
                startcol2 = toInt(arrDetail[4]);
                startcol3 = toInt(arrDetail[5]);
                startcol4 = toInt(arrDetail[6]);
            }

			//得到模板用到的所有参数
            string sparam = "";
            if (paramlist != null)
            {
                for (int i = 0; i < paramlist.Count; i++)
                {
                    sparam = sparam + ",&[" + paramlist.AllKeys[i] + "]";
                }
            }
            
            string[] arrParams	=	leofun.getArrayFromString(prnparamlist()+sparam,",");
            string[] arrMData = masterdatas(arrPos, "<主表>");
            int EmptyCol = otherdatas(arrPos, "<空列>");
            int PrnType = otherdatas(arrPos, "<方式>");
		
            //新的处理方式：搜索参数，用数据代替

			//搜索主表及参数，用实际数据代替
			//搜索页合计及合计行，分别复制到模板node,在数据循环至该页最大行数前，算出页合计值，并插入到最后一行，同时，累计总数，插入最后行。
			//subsumNode
			//sumNode
			XmlNode subsumNode = null;
			XmlNode subgsumNode = null;
			XmlNode sumNode = null;
			XmlNode avgNode = null;

			for(int i=0;i<xmlNodes.Count;i++)
			{
				if(arrParams==null) continue;
				for(int j=0;j<arrParams.Length;j++)
				{
					if(xmlNodes[i].InnerText.IndexOf(arrParams[j])>-1)
					{
						string nval = xmlNodes[i].ChildNodes[0].InnerText.Trim();
						string strParam = getParam(arrParams[j],userRight,paramlist);
						nval = nval.Replace(arrParams[j],strParam);
						xmlNodes[i].ChildNodes[0].InnerText = nval;
					}
				}
				if(MData == null || arrMData==null) continue;
                if(mcurrow > MData.Rows.Count) mcurrow=0;
				for(int m=0;m<arrMData.Length;m++)
				{
					string strM  = arrMData[m];
					string strM1 = strM.Replace("[","");
					strM1 = strM1.Replace("]","");
					
					if(xmlNodes[i].InnerText.IndexOf(strM)>-1 || xmlNodes[i].InnerText.IndexOf(strM1)>-1) 
					{
						strM1 = strM1.Replace("#","");
						if(MData.Rows[mcurrow][strM1]==null) continue;
                        string valfld = (null == MData.Rows[mcurrow][strM1]) ? "" : MData.Rows[mcurrow][strM1].ToString();
                        string fieldname = MData.Columns[strM1].DataType.Name;
                        switch (MData.Columns[strM1].DataType.Name)
                        {
                            case "Double":
                            case "Decimal":
                                if (valfld != "")
                                {
                                    if (Convert.ToDouble(valfld) == 0) valfld = "";
                                    else
                                        valfld = Convert.ToDouble(valfld).ToString("#0.00");
                                }
                                break;
                            case "DateTime":
                                if (valfld == "") break;
                                valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM-dd");

                                if (fieldname == "年" || fieldname == "年份")
                                    valfld = Convert.ToDateTime(valfld).ToString("yyyy");

                                if (fieldname.IndexOf("月份") > -1 || fieldname.IndexOf("月度") > -1 || fieldname.IndexOf("年月") > -1)
                                    valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM");

                                break;
                        }

                        string str = xmlNodes[i].ChildNodes[0].InnerText.Replace(arrMData[m],valfld);
                        str = str.Replace("#", "");
						xmlNodes[i].ChildNodes[0].InnerText=str;
					}
				}
			}


			//得到循环区的节点，并替换成实际的数据
			XmlNodeList	xmlNodesRow=xmldoc.DocumentElement.SelectNodes("//docpro:Row",xmlNsmgl);
			string strExprgroup="";
			for(int i=0;i<xmlNodesRow.Count;i++)
			{
				if(xmlNodesRow[i].InnerText.IndexOf("S页合计")>-1 || xmlNodesRow[i].InnerText.IndexOf("S页合计")>-1) 
					subsumNode = xmlNodesRow[i];
				if(xmlNodesRow[i].InnerText.IndexOf("S组合计")>-1 || xmlNodesRow[i].InnerText.IndexOf("S组合计")>-1)
				{
					subgsumNode = xmlNodesRow[i];
					for(int j=0; j<subgsumNode.ChildNodes.Count; j++)
					{
						if(subgsumNode.ChildNodes[j].InnerText.IndexOf("S组合计:")>-1)
						{
							string[] arrSUMCndition = leofun.getArrayFromString(subgsumNode.ChildNodes[j].InnerText,";");
							for(int m=0; m<arrSUMCndition.Length;m++)
							{
								if(arrSUMCndition[m].IndexOf("<范围>")>-1)
									strExprgroup = arrSUMCndition[m].Replace("<范围>","");
							}
						}
					}
					
				}
                if (xmlNodesRow[i].InnerText.IndexOf("S合计:") > -1 || xmlNodesRow[i].InnerText.IndexOf("S合计：")>-1 || xmlNodesRow[i].InnerText.IndexOf("S合计") > -1)
					sumNode    = xmlNodesRow[i];
				else if(xmlNodesRow[i].InnerText.IndexOf("S平均值:")>-1 || xmlNodesRow[i].InnerText.IndexOf("S平均值：")>-1)
					avgNode    = xmlNodesRow[i];
			}
			
			
			//获的合计分组条件：
			strExprgroup = strExprgroup.Replace(" ","").Trim();
			strExprgroup = strExprgroup.Replace("[","");
			strExprgroup = strExprgroup.Replace("]","");
			string[] arrExprgroup		=	leofun.getArrayFromString(strExprgroup,",");
			string[] arrExprgroup_field =	null;
			string[] arrExprgroup_val	=	null;
			if(arrExprgroup!=null)
			{
				arrExprgroup_field =	new string[arrExprgroup.Length];
				arrExprgroup_val	=	new string[arrExprgroup.Length];
				for(int i=0;i<arrExprgroup.Length;i++)
				{
					string[] arr=leofun.getArrayFromString(arrExprgroup[i],"=");
					arrExprgroup_field[i]	=	arr[0];
					arrExprgroup_val[i]		=	arr[1];
				}
			}
			//
			xmlNodesRow=xmldoc.DocumentElement.SelectNodes("//docpro:Row",xmlNsmgl);
			if(xmlNodesRow[startrow]==null)
			{
				string strMSG = "起始行="+(startrow+1).ToString()+" 引起字段定位错误: !";
				System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
				System.Web.HttpContext.Current.Response.Write("alert('"+ strMSG +"')");
				System.Web.HttpContext.Current.Response.Write("	</script>							");				
				return null;	          		
			}
			XmlNode rowboot = xmlNodesRow[startrow].ParentNode;
			
			string[] arrfld		= null;
			string[] arrsubsumfld	= null;
			string[] arrsubgsumfld	= null;
			string[] arrsumfld	= null;
			string[] arravgfld	= null;

            arrfld = getExcelFields(xmlNodesRow[startrow]);
            if (subsumNode != null) arrsubsumfld = getExcelFields(subsumNode);
            if (subgsumNode != null) arrsubgsumfld = getExcelFields(subgsumNode);
            if (sumNode != null) arrsumfld = getExcelFields(sumNode);
            if (avgNode != null) arravgfld = getExcelFields(avgNode);

			//定义分页行
			string pagebreakRows=""; 
			//写明细数据,返回插入的辅助行数
			int seprow = 0;
			int xmod=0;

            int printnum = 0;
            if(prnPageSize!=0)
                printnum = (oData == null) ? 0 : oData.Rows.Count + (prnPageSize - ((oData == null) ? 0 : oData.Rows.Count) % prnPageSize);
            if (repeatcols > 1) printnum = prnPageSize;
			if(PrnType!=1)
			{
                for (int i = 1; i < printnum; i++)
				{
					XmlNode baknode = xmlNodesRow[startrow].CloneNode(true);
					int icurrow = startrow + i + seprow -1 ;
					rowboot.InsertAfter(baknode,xmlNodesRow[icurrow]);
					xmod = (i+1) % prnPageSize;
                    if(i == printnum + seprow -1) break;
					if(xmod==0 && i!=0)
					{
						if(subsumNode!=null)
						{
							XmlNode xsub = subsumNode.Clone();
							rowboot.InsertAfter(xsub,xmlNodesRow[startrow+i+seprow]);
							seprow=seprow+1;
						}
						int pagenum = startrow+seprow + i + 1 ;
						pagebreakRows = pagebreakRows + ";" + pagenum.ToString();
					}
				}
			}
			//建立分页
			if(pagebreakRows.Length>0)
			{
				pagebreakRows = pagebreakRows.Remove(0,1);
				creatpagebreak(pagebreakRows,xmldoc);
			}

			XmlNodeList xnode = null;

			//初始化合计数组
			double[] sumfld		= null;
			double[] subsumfld	= null;
			double[] avgfld		= null;
			double[] subgsumfld	= null;
			if(arrsumfld!=null)
			{
				sumfld			= new double[arrsumfld.Length];
				for(int i=0;i<arrsumfld.Length;i++) sumfld[i]=0.0;
			}

			if(arravgfld!=null)
			{
				sumfld			= new double[arravgfld.Length];
				for(int i=0;i<arravgfld.Length;i++) sumfld[i]=0.0;
			}

			if(arrsubsumfld!=null) 
			{
				subsumfld		= new double[arrsubsumfld.Length];
				for(int i=0;i<arrsubsumfld.Length;i++) subsumfld[i]=0;
			}
			if(arrsubgsumfld!=null)
			{
				subgsumfld		= new double[arrsubgsumfld.Length];
				for(int i=0;i<arrsubgsumfld.Length;i++) subgsumfld[i]=0.0;
			}
				

			string fldname="";

			//取最大的数据记录数量
			int rowcount=prnPageSize;
			if(prnPageSize < ((oData==null)?0:oData.Rows.Count)) rowcount=(oData==null)?0:oData.Rows.Count;
            rowcount = printnum;
			seprow =0;
            if (repeatcols > 1) rowcount = prnPageSize;
            //如果多列打印，则最大循环行数为分页数
            for (int ir = 0; ir < repeatcols; ir++)
            {
                for (int i = 0; i < rowcount; i++)
                {
                    //ROW为空时，中断循环
                    switch (ir)
                    {
                        case 2: EmptyCol = ir * EmptyCol;
                            break;
                        case 3: EmptyCol = ir * EmptyCol;
                            break;
                        case 4: EmptyCol = ir * EmptyCol;
                            break;
                    }
                    int idata = (i + ir * prnPageSize);
                    if (xmlNodesRow[startrow + i + seprow] == null) break;
                    //如果存在页合计
                    if (xmlNodesRow[startrow + i + seprow].InnerText.IndexOf("S页合计") > -1
                        || xmlNodesRow[startrow + i + seprow].InnerText.IndexOf("S组合计") > -1)
                    {
                        //写入页合计：
                        if (arrsubsumfld != null)
                        {
                            setsummary(startrow + i + seprow - prnPageSize, startrow + i + seprow, xmlNodesRow, 
                                "S页合计", subsumfld, arrsubsumfld, oData);
                            //页合计清0
                            for (int k = 0; k < arrsubsumfld.Length; k++) subsumfld[k] = 0;
                        }

                        if (arrsubgsumfld != null)
                        {
                            setsummary(startrow + i + seprow - prnPageSize, startrow + i + seprow, xmlNodesRow,
                                "S组合计", subgsumfld, arrsubgsumfld, oData);
                            //组合计清0
                            for (int k = 0; k < arrsumfld.Length; k++) subgsumfld[k] = 0;
                        }
                        seprow = seprow + 1;
                        //列数
                        xnode = xmlNodesRow[startrow + i + seprow].ChildNodes;
                        if (fldcount > xnode.Count) fldcount = xnode.Count;
                        for (int j = 0 + ir * fldcount; j < (ir+1) * fldcount - EmptyCol; j++)
                        {
                            fldname = xnode[j + EmptyCol].InnerText.ToString().Trim();
                            if (fldname == "序号") {
                                xnode[j + EmptyCol].ChildNodes[0].InnerText=(idata + 1).ToString(); 
                                fldname = "SN"; 
                            }
                            for (int ic = 0; ic < ((oData==null)?0:oData.Columns.Count); ic++)
                            {
                                string strColumnName = oData.Columns[ic].ColumnName;
                                if (fldname == strColumnName) break;
                                else if (ic == oData.Columns.Count - 1) fldname = "";
                            }

                            if (fldname == "") continue;
                            string valfld = "";
                            string fm = "";
                            if (i < rowcount)
                            {
                                valfld = (oData==null || null == oData.Rows[idata][fldname]) ? "" : oData.Rows[idata][fldname].ToString();
                                switch ((oData==null)?"":oData.Columns[fldname].DataType.Name)
                                {
                                    case "Double":
                                    case "Decimal":

                                        if (valfld != "")
                                        {
                                            if (workitem != null)
                                            {
                                                for (int ix = 0; ix < workitem.DictCol.Length; ix++)
                                                {
                                                    if (fldname == workitem.DictCol[ix].ColumnName && workitem.DictCol[ix].Formate != "")
                                                    { fm = workitem.DictCol[ix].Formate; break; }
                                                }
                                            }
                                            if (fm != "" && fm.IndexOf(".") > -1)
                                            {
                                                fm = fm.Substring(fm.IndexOf(".") + 1, fm.Length - fm.IndexOf(".") - 1);
                                                if (fm.Length > 0)
                                                    valfld = Convert.ToDouble(valfld).ToString("#0." + fm);
                                                else
                                                    valfld = Convert.ToDouble(valfld).ToString("#0");
                                            }
                                            else
                                                valfld = Convert.ToDouble(valfld).ToString("#0.00");
                                            if (Convert.ToDouble(valfld) == 0) valfld = "";

                                        }
                                        break;
                                    case "DateTime":
                                        if (valfld == "") break;
                                        if (fldname == "年" || fldname == "年份")
                                        {
                                            valfld = Convert.ToDateTime(valfld).ToString("yyyy"); break;
                                        }

                                        if (fldname.IndexOf("月份") > -1 || fldname.IndexOf("月度") > -1 || fldname.IndexOf("年月") > -1)
                                        { valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM"); break; }
                                        if (workitem != null)
                                        {
                                            for (int ix = 0; ix < workitem.DictCol.Length; ix++)
                                            {
                                                if (fldname == workitem.DictCol[ix].ColumnName && workitem.DictCol[ix].Formate != "")
                                                { fm = workitem.DictCol[ix].Formate; break; }
                                            }
                                        }
                                        if (fm != "")
                                            valfld = Convert.ToDateTime(valfld).ToString(fm);
                                        //valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM-dd hh:mm:ss");
                                        else
                                            valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM-dd");

                                        break;
                                }
                            }

                            if (valfld.Trim().Length == 0) xnode[j + EmptyCol].ChildNodes[0].InnerText = " ";
                            else xnode[j + EmptyCol].ChildNodes[0].InnerText = valfld;

                            if (EmptyCol == 0)
                            {
                                if (xnode[0].ChildNodes[0].InnerText == "序号")
                                    xnode[0].ChildNodes[0].InnerText = (i + 1).ToString();
                            }
                            else if (xnode[EmptyCol - 1].ChildNodes[0] != null)
                            {
                                if (xnode[EmptyCol - 1].ChildNodes[0].InnerText == "序号")
                                    xnode[EmptyCol - 1].ChildNodes[0].InnerText = (i + 1).ToString();
                            }
                            //计算合计
                            if (i > rowcount) continue;

                            if (arrsumfld != null)
                            {
                                for (int m = 0; m < arrsumfld.Length; m++)
                                {
                                    if (fldname != arrsumfld[m]) continue;
                                    if (valfld == null || valfld == "")
                                        valfld = "0";
                                    sumfld[m] = sumfld[m] + double.Parse(valfld);
                                    if (subsumfld != null) subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                    if (subgsumfld != null)
                                    {
                                        if (oData.Columns["分类"] != null)
                                            if (null != oData.Rows[idata]["分类"] && oData.Rows[idata]["分类"].ToString() == "总计")
                                                subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                            else
                                                subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);
                                    }
                                }
                            }
                            else
                                if (arrsubsumfld != null)
                                {
                                    for (int m = 0; m < arrsubsumfld.Length; m++)
                                    {
                                        if (fldname != arrsubsumfld[m]) continue;
                                        if (valfld == null || valfld == "")
                                            valfld = "0";
                                        sumfld[m] = sumfld[m] + double.Parse(valfld);
                                        if (subsumfld != null) subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                        if (subgsumfld != null)
                                        {
                                            if (oData.Columns["分类"] != null)
                                                if (null != oData.Rows[idata]["分类"] && oData.Rows[idata]["分类"].ToString() == "总计")
                                                    subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                                else
                                                    subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);
                                        }
                                    }
                                }
                        }
                    }
                    else
                    {
                        xnode = xmlNodesRow[startrow + i + seprow].ChildNodes;
                        if (fldcount > xnode.Count) fldcount = xnode.Count;
                        for (int j = 0 + ir * fldcount; j < (ir + 1) * fldcount - EmptyCol; j++)
                        {
                            fldname = xnode[j + EmptyCol].InnerText.ToString().Trim();
                            if (fldname == "序号")
                            {
                                xnode[j + EmptyCol].ChildNodes[0].InnerText = (idata + 1).ToString();
                                fldname = "SN";
                            }

                            for (int ic = 0; ic < oData.Columns.Count; ic++)
                            {
                                string strColumnName = oData.Columns[ic].ColumnName;
                                if (fldname == strColumnName)
                                    break;
                                else if (ic == oData.Columns.Count - 1)
                                    fldname = "";
                            }
                            if (fldname == "") continue;
                            string valfld = "";
                            string fm = "";
                            if (i < rowcount)
                            {
                                if (idata > oData.Rows.Count - 1) valfld = "";
                                else
                                    valfld = (null == oData.Rows[idata][fldname]) ? "" : oData.Rows[idata][fldname].ToString();
                                switch (oData.Columns[fldname].DataType.Name)
                                {
                                    case "Double":
                                    case "Decimal":

                                        if (valfld != "")
                                        {
                                            if (workitem != null)
                                            {
                                                for (int ix = 0; ix < workitem.DictCol.Length; ix++)
                                                {
                                                    if (fldname == workitem.DictCol[ix].ColumnName && workitem.DictCol[ix].Formate != "")
                                                    { fm = workitem.DictCol[ix].Formate; break; }
                                                }
                                            }
                                            if (fm != "" && fm.IndexOf(".") > -1)
                                            {
                                                fm = fm.Substring(fm.IndexOf(".") + 1, fm.Length - fm.IndexOf(".") - 1);
                                                if (fm.Length > 0)
                                                    valfld = Convert.ToDouble(valfld).ToString("#0." + fm);
                                                else
                                                    valfld = Convert.ToDouble(valfld).ToString("#0");
                                            }
                                            else
                                                valfld = Convert.ToDouble(valfld).ToString("#0.00");
                                            if (Convert.ToDouble(valfld) == 0) valfld = "";

                                        }
                                        break;
                                    case "DateTime":
                                        if (valfld == "") break;
                                        if (fldname == "年" || fldname == "年份")
                                        {
                                            valfld = Convert.ToDateTime(valfld).ToString("yyyy"); break;
                                        }

                                        if (fldname.IndexOf("月份") > -1 || fldname.IndexOf("月度") > -1 || fldname.IndexOf("年月") > -1)
                                        { valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM"); break; }
                                        if (workitem != null)
                                        {
                                            for (int ix = 0; ix < workitem.DictCol.Length; ix++)
                                            {
                                                if (fldname == workitem.DictCol[ix].ColumnName && workitem.DictCol[ix].Formate != "")
                                                { fm = workitem.DictCol[ix].Formate; break; }
                                            }
                                        }
                                        if (fm != "")
                                            valfld = Convert.ToDateTime(valfld).ToString(fm);
                                        //valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM-dd hh:mm:ss");
                                        else
                                            valfld = Convert.ToDateTime(valfld).ToString("yyyy-MM-dd");

                                        break;
                                }
                            }

                            if (valfld.Trim().Length == 0) xnode[j + EmptyCol].ChildNodes[0].InnerText = " ";
                            else xnode[j + EmptyCol].ChildNodes[0].InnerText = valfld;

                            if (EmptyCol == 0)
                            {

                                if (xnode[0].ChildNodes[0].InnerText == "序号")
                                    xnode[0].ChildNodes[0].InnerText = (i + 1).ToString();
                            }
                            else if (xnode[EmptyCol - 1].ChildNodes[0] != null)
                            {
                                if (xnode[EmptyCol - 1].ChildNodes[0].InnerText == "序号")
                                    xnode[EmptyCol - 1].ChildNodes[0].InnerText = (i + 1).ToString();
                            }
                            //计算合计
                            if (i >= rowcount) continue;
                            if (arrsumfld != null)
                            {
                                for (int m = 0; m < arrsumfld.Length; m++)
                                {
                                    if (fldname == arrsumfld[m])
                                    {
                                        if (valfld == null || valfld == "")
                                            valfld = "0";
                                        sumfld[m] = sumfld[m] + double.Parse(valfld);
                                        if (subsumfld != null) subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                        if (subgsumfld != null && arrExprgroup_field != null)
                                        {

                                            if (arrExprgroup_field.Length == 1)
                                                if (null != oData.Rows[idata][arrExprgroup_field[0]] && oData.Rows[idata][arrExprgroup_field[0]].ToString() == arrExprgroup_val[0])
                                                    subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);

                                            if (arrExprgroup_field.Length == 2)
                                                if ((null != oData.Rows[idata][arrExprgroup_field[0]] && oData.Rows[idata][arrExprgroup_field[0]].ToString() == arrExprgroup_val[0]) ||
                                                    (null != oData.Rows[idata][arrExprgroup_field[1]] && oData.Rows[idata][arrExprgroup_field[1]].ToString() == arrExprgroup_val[1]))
                                                    subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);
                                        }
                                    }
                                }
                            }
                            else
                                if (arravgfld != null)
                                {
                                    for (int m = 0; m < arravgfld.Length; m++)
                                    {
                                        if (fldname == arravgfld[m])
                                        {
                                            if (valfld == null || valfld == "") valfld = "0";
                                            sumfld[m] = sumfld[m] + double.Parse(valfld);
                                            if (subsumfld != null) subsumfld[m] = subsumfld[m] + double.Parse(valfld);
                                            if (subgsumfld != null && arrExprgroup_field != null)
                                            {
                                                if (arrExprgroup_field.Length == 1)
                                                    if (null != oData.Rows[idata][arrExprgroup_field[0]] && oData.Rows[idata][arrExprgroup_field[0]].ToString() == arrExprgroup_val[0])
                                                        subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);

                                                if (arrExprgroup_field.Length == 2)
                                                    if ((null != oData.Rows[idata][arrExprgroup_field[0]] && oData.Rows[idata][arrExprgroup_field[0]].ToString() == arrExprgroup_val[0]) ||
                                                         (null != oData.Rows[idata][arrExprgroup_field[1]] && oData.Rows[idata][arrExprgroup_field[1]].ToString() == arrExprgroup_val[1]))
                                                        subgsumfld[m] = subgsumfld[m] + double.Parse(valfld);
                                            }
                                        }
                                    }
                                }

                        }
                    }
                }
            }

			if(subsumfld!=null)
			{
				//置入最后一个分页合计
                setsummary(startrow + printnum + seprow - 1, xmlNodesRow.Count - 1, xmlNodesRow, "S页合计", subsumfld, arrsubsumfld, oData);
			}

			if(subgsumfld!=null)
			{
				//置入最后一个分组合计
                setsummary(startrow + printnum + seprow - 1, xmlNodesRow.Count - 1, xmlNodesRow, "S组合计", subgsumfld, arrsubgsumfld, oData);
			}
			
			if(sumfld!=null)
			{
				//置入合计项
                setsummary(startrow + printnum + seprow, xmlNodesRow.Count - 1, xmlNodesRow, "S合计", sumfld, arrsumfld, oData);
			}

			if(sumfld!=null)
			{
				//置入平均值
                setsummary(startrow + printnum + seprow, xmlNodesRow.Count - 1, xmlNodesRow, "S平均值", sumfld, arravgfld, oData);
			}

			//得到Table节点的ss:ExpandedRowCount属性，随着循环区行数的增加页增值
            if (startrow != 0)
            {
                XmlNode xn = xmldoc.DocumentElement.SelectSingleNode("//docpro:Table", xmlNsmgl);
                xn.Attributes["ss:ExpandedRowCount"].Value = Convert.ToString((Convert.ToInt32(xn.Attributes["ss:ExpandedRowCount"].Value) + printnum + seprow - 1));
            }
			//给<PageSetup>赋值
            
			setpageSetup(xmldoc,userRight,paramlist);
			//string DownloadFilePath=DownloadPath+"\\"+destFile;
			//string strpath= "ExcelDownload/"+TempFileName;
			//outXML2Excel(xmldoc,"print.xls");
			return xmldoc;
			

		}

        public static XmlDocument makeprint(UnitItem UnitItem,XmlDocument xmlsys,string UserId)
        {
            //写入Excel的方法：
            //定义需要参数。<明细>5,2,10,15;
            string TemplatePath = HttpContext.Current.Server.MapPath(DataAccRes.AppSettings("TpFilePath"));    //存放源文件的文件夹路径。
            //初始化XML命名空间
            string nsp = "urn:schemas-microsoft-com:office:spreadsheet";
            XmlDocument xmldoc = new XmlDocument();
            try
            {
                xmldoc.Load(TemplatePath + "\\" + UnitItem.FilePrnTp);
            }
            catch
            {
                string strMSG = "请关闭正在打开的模板文件" + UnitItem.FilePrnTp + "!";
                System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
                System.Web.HttpContext.Current.Response.Write("alert('" + strMSG + "')");
                System.Web.HttpContext.Current.Response.Write("	</script>							");
                return null;
            }
            XmlNamespaceManager xmlNsmgl = new XmlNamespaceManager(xmldoc.NameTable);
            xmlNsmgl.AddNamespace("docpro", nsp);

            //读出"Cell"节点中的定义值，得到循环数据区位置值
            XmlNodeList xmlNodes = xmldoc.DocumentElement.SelectNodes("//docpro:Cell", xmlNsmgl);

            //修改：<明细>改为#dataitem name,ItemHash存贮dataitem name, 起始(行，列),列数,每页行数
            Hashtable ItemHash = PrnDataItems(xmlNodes);
            //得到模板用到的所有参数
            
            QueryDataRes query = new QueryDataRes(UnitItem.DataSrcFile);
            NameObjectList paramlist = BuildParamList.BuildParams(xmlsys);
            XmlNodeList xmlNodesRow = xmldoc.DocumentElement.SelectNodes("//docpro:Row", xmlNsmgl);
            XmlNodeList xnode = null;
            User userRight = new User(UserId);
            SetParamData(xmlNodes,userRight,paramlist);
            //先处理主表，并将主表记录做为参数记录在paramlist
            paramlist = SetMasterData(UnitItem,xmlsys,query,xmlNodes, UserId, paramlist);
            setpageSetup(xmldoc, userRight, paramlist);
            for (int i = 0; i < UnitItem.WorkItemList.Length; i++)
            {
                if (UnitItem.WorkItemList[i].ItemType == WorkItemType.MasterData) continue;
                string dataname = UnitItem.WorkItemList[i].DataSrc;
                if (ItemHash["[table]" + dataname] != null || ItemHash["[dtable]" + dataname] != null || ItemHash["[mtable]" + dataname] != null)
                {
                    DataTable oData = query.getTable(dataname, paramlist, getStrParams(xmlsys, UnitItem.WorkItemList[i]));
                    string[] arrDetail = null;
                    if(ItemHash["[table]" + dataname] != null)
                        arrDetail = leofun.getArrayFromString(ItemHash["[table]" + dataname].ToString(), ",");
                    if (ItemHash["[dtable]" + dataname] != null)
                        arrDetail = leofun.getArrayFromString(ItemHash["[dtable]" + dataname].ToString(), ",");
                    if (ItemHash["[mtable]" + dataname] != null)
                        arrDetail = leofun.getArrayFromString(ItemHash["[mtable]" + dataname].ToString(), ",");

                    int startrow = toInt(arrDetail[0]) - 1;
                    int startcol = toInt(arrDetail[1]);
                    int fldcount = toInt(arrDetail[2]);
                    int prnPageSize = toInt(arrDetail[3]);
                    
                    XmlNode rowboot = xmlNodesRow[startrow].ParentNode;

                    string[] arrfld = null;
                    arrfld = getExcelFields(xmlNodesRow[startrow]); //当为散步分布时，不能取出字段名
                    for (int m = 0; m < oData.Rows.Count; m++)
                    {if (prnPageSize == 1) continue;
                        XmlNode baknode = xmlNodesRow[startrow].CloneNode(true);
                        xnode = xmlNodesRow[startrow + m].ChildNodes;
                        for (int n = 0; n < fldcount; n++)
                            if (xnode[n].ChildNodes[0] == null) xnode[n].AppendChild(baknode.ChildNodes[n].ChildNodes[0]);
                    }
                    if ((ItemHash["[dtable]" + dataname] != null || ItemHash["[mtable]" + dataname] != null) && oData.Rows.Count>0)
                        SetMTableData(dataname, oData, xmlNodes);
                    else
                    {
                        for (int m = 0; m < oData.Rows.Count; m++)
                        {
                            xnode = xmlNodesRow[startrow + m].ChildNodes;
                            for (int n = 0; n < fldcount; n++)
                            {
                                string fldname = arrfld[n].Replace(dataname+".","");
                                //处理单表格数据
                                string valfld="";
                                if (m>oData.Rows.Count)
                                    valfld = (null == oData.Rows[m][fldname]) ? "" : oData.Rows[m][fldname].ToString();
                                switch (oData.Columns[fldname].DataType.Name)
                                {
                                    case "Double":
                                        if (valfld != "")
                                            valfld = Convert.ToDouble(valfld).ToString("#0.00");
                                        break;
                                    case "DateTime":
                                        if (valfld == "") break;
                                        valfld = Convert.ToDateTime(valfld).ToString("hh:mm");
                                        break;
                                }
                                if (xnode[n] != null && xnode[n].ChildNodes[0] != null)
                                    xnode[n].ChildNodes[0].InnerText = valfld;
                            }
                        }

                    }

                }
            }

            return xmldoc;
        }



        private static NameObjectList SetMasterData(UnitItem unititem,XmlDocument xmlsys,QueryDataRes query,XmlNodeList xmlNodes, string userid, NameObjectList paramlist)
        {
            for (int m = 0; m < unititem.WorkItemList.Length; m++)
            {
                if (unititem.WorkItemList[m].ItemType != WorkItemType.MasterData) continue;
                string dataname = unititem.WorkItemList[m].DataSrc;
                DataTable MData = query.getTable(dataname, paramlist, getStrParams(xmlsys, unititem.WorkItemList[m]));

                for (int n = 0; n < MData.Columns.Count; n++)
                {
                    string strM = MData.Columns[n].ColumnName;
                    paramlist.Add(strM, MData.Rows[0][strM].ToString());
                }

                for (int i = 0; i < xmlNodes.Count; i++)
                {
                    for (int j = 0; j < MData.Columns.Count; j++)
                    {
                        string strM = MData.Columns[j].ColumnName;
                        if (xmlNodes[i].InnerText==dataname + "." + strM)
                        {
                            if (MData.Rows[0][strM] == null) continue;
                            xmlNodes[i].ChildNodes[0].InnerText = MData.Rows[0][strM].ToString(); ;
                        }
                    }
                }

            }

            return paramlist;

        }

        private static void SetParamData(XmlNodeList xmlNodes, User userright, NameObjectList paramlist)
        {
            string[] arrParams = leofun.getArrayFromString(prnparamlist(), ",");
            for (int i = 0; i < xmlNodes.Count; i++)
            {
                if (arrParams == null) continue;
                for (int j = 0; j < arrParams.Length; j++)
                {
                    if (xmlNodes[i].InnerText==arrParams[j])
                    {
                        string nval = xmlNodes[i].ChildNodes[0].InnerText.Trim();
                        string strParam = getParam(arrParams[j], userright, paramlist);
                        nval = nval.Replace(arrParams[j], strParam);
                        xmlNodes[i].ChildNodes[0].InnerText = nval;
                    }
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="MData">DataTable名称</param>
        private static void SetMTableData(string DataSrc,DataTable MData,XmlNodeList xmlNodes)
        {
            for (int i = 0; i < xmlNodes.Count; i++)
            {
                for (int j = 0; j < MData.Columns.Count; j++)
                {
                    string strM = MData.Columns[j].ColumnName;
                    if (xmlNodes[i].InnerText==DataSrc+"." + strM)
                    {
                        if (MData.Rows[0][strM] == null) continue;
                        xmlNodes[i].ChildNodes[0].InnerText = MData.Rows[0][strM].ToString(); 
                     }
                }
            }

        }

        /// <summary>
        /// 分为几种：[Mtable]为主表,[Dtable]为不规则散布单表,[table]为列表
        /// </summary>
        /// <param name="xmlNodes"></param>
        /// <returns></returns>
        public static Hashtable PrnDataItems(XmlNodeList xmlNodes)
        {
            Hashtable ItemHash = new Hashtable();
            XmlNodeList removenodes = null;
            ArrayList iarray = new ArrayList();
            
            for (int i = 0; i < xmlNodes.Count; i++)
            {
                if (xmlNodes[i].InnerText.IndexOf("[table]") > -1 || xmlNodes[i].InnerText.IndexOf("[dtable]") > -1 || xmlNodes[i].InnerText.IndexOf("[mtable]") > -1)
                {
                    string nval = xmlNodes[i].ChildNodes[0].InnerText.Trim();
                    string iKey = getiKey(nval);
                    string iVal = getiVal(nval);
                    ItemHash.Add(iKey, iVal);
                    xmlNodes[i].ChildNodes[0].InnerText = "";
                    iarray.Add(i);
                }
            }
            for (int i = 0; i < iarray.Count; i++)
            {
                int ix = toInt(iarray[i].ToString()); ;
                xmlNodes[ix].ParentNode.ParentNode.RemoveChild(xmlNodes[ix].ParentNode);
            }

            return ItemHash;
        }

        public static DataSet PrnDataSet(UnitItem unititem, Hashtable itemhash, XmlDocument xmlsys)
        {
            DataSet dataset = new DataSet();
            QueryDataRes query = new QueryDataRes(unititem.DataSrcFile);
            NameObjectList paramlist = BuildParamList.BuildParams(xmlsys);
            DataTable tab = new DataTable();
            for (int i = 0; i < unititem.WorkItemList.Length; i++)
            {
                string dataname = unititem.WorkItemList[i].DataSrc;
                if (itemhash["[table]" + dataname] != null)
                {
                    tab = query.getTable(dataname, paramlist, getStrParams(xmlsys, unititem.WorkItemList[i]));
                    dataset.Tables.Add(tab);
                }
                if (itemhash["[dtable]" + dataname] != null)
                {
                    tab = query.getTable(dataname, paramlist, getStrParams(xmlsys, unititem.WorkItemList[i]));
                    dataset.Tables.Add(tab);
                }
                if (itemhash["[mtable]" + dataname] != null)
                {
                    tab = query.getTable(dataname, paramlist, getStrParams(xmlsys, unititem.WorkItemList[i]));
                    dataset.Tables.Add(tab);
                }
                
            }
            return dataset;
        }

        public static string getiKey(string str)
        {
            str = str.Substring(0, str.IndexOf(";"));
            return str;
        }

        public static string getiVal(string str)
        {
            str = str.Substring(str.IndexOf(";")+1);
            return str;
        }

		/// <summary>
		/// 给<PageSetup>赋值prnunit,prnname
		/// </summary>
		/// <param name="xmldoc"></param>
        public static void setpageSetup(XmlDocument xmldoc, User userright, NameObjectList paramlist)
		{
            if (paramlist == null) return;
			XmlNamespaceManager	xmlNsmgl=new XmlNamespaceManager(xmldoc.NameTable);
			xmlNsmgl.AddNamespace("docpro","urn:schemas-microsoft-com:office:excel");
			//遍历PageSetup下的所有子节点
            if (xmldoc.DocumentElement.SelectSingleNode("//docpro:PageSetup", xmlNsmgl) == null) return;
			XmlNodeList nodelist = xmldoc.DocumentElement.SelectSingleNode("//docpro:PageSetup",xmlNsmgl).ChildNodes;
			for(int i=0; i<nodelist.Count;i++)
			{
				for(int j=0;j<nodelist[i].Attributes.Count;j++)
				{
					string nval = nodelist[i].Attributes[j].Value;
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnname", getParam("prnname", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnman", getParam("prnman", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[姓名]", getParam("&[姓名]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("prnunit", getParam("prnunit", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[日期]", getParam("&[日期]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[date]", getParam("&[date]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[单位]", getParam("&[单位]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[部门]", getParam("&[部门]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[年月]", getParam("&[年月]", userright, paramlist));
                    nodelist[i].Attributes[j].Value = nodelist[i].Attributes[j].Value.Replace("&[年]", getParam("&[年]", userright, paramlist));
				}
			}
		}

        public static string getParam(string param, User userright, NameObjectList paramlist)
		{
			string str="";
			//所属单位
            string unit = (userright == null) ? paramlist["DWName"].ToString() : userright.UnitName;
			//所属部门
            string dept = (userright == null) ? paramlist["DeptName"].ToString() : userright.SubDeptName;
			//用户名
            string unsername = (userright == null) ? paramlist["UserName"].ToString() : userright.UserName;
			//用户帐号
            string useraccount = (userright == null) ? paramlist["UserAccounts"].ToString() : userright.UserAccounts;
			//月份
            if(param.IndexOf("&[半年起始月")>-1) str = getHYfirstmonth(param);
			

			DateTime	dt=DateTime.Now;
			switch(param)
			{
				case "&[date]":
				case "&[日期]": 
					str = DateTime.Now.ToString("yyyy年MM月dd日");
                    if (paramlist != null)
                    {
                        if (null != paramlist["日期"]) str = paramlist["日期"].ToString();
                        else
                        {
                            if (null != paramlist["EndDate"])
                                dt = (DateTime)paramlist["EndDate"];
                            str = dt.ToString("yyyy年MM月dd日");
                        }
                    }
					break;
                case "&[datemonth]":
                    str = DateTime.Now.ToString("yyyy年MM月dd日") + " " + System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(DateTime.Now.DayOfWeek);
                    break;
				case "&[年月]": str = DateTime.Now.ToString("yyyy年MM月");
                    if (paramlist != null)
                    {
                        if (null != paramlist["年月"])
                            str = paramlist["年月"].ToString();
                        else
                        {
                            if (null != paramlist["EndDate"])
                                dt = (DateTime)paramlist["EndDate"];
                            str = dt.ToString("yyyy年MM月");
                        }
                    }
					break;
				case "&[年]": str = DateTime.Now.ToString("yyyy年");
                    if (paramlist != null)
                    {
                        if (null != paramlist["年"])
                            str = paramlist["年"].ToString();
                        else
                        {
                            if (null != paramlist["EndDate"])
                                dt = (DateTime)paramlist["EndDate"];
                            str = dt.ToString("yyyy年");
                        }
                    }
					break;
                case "&[月]": str = DateTime.Now.ToString("MM");
                    break;
                case "&[日]": str = DateTime.Now.ToString("dd");
                    break;
                case "&[时]": str = DateTime.Now.ToString("hh");
                    break;
                case "&[分]": str = DateTime.Now.ToString("mm");
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
				case "&[账号]": 
				case "&[帐号]": 
					str = useraccount;
					break;
                default:
                    string ss = param.Substring(param.IndexOf("&"));
                    if (paramlist != null)
                        str = paramlist[ss.Replace("&[", "").Replace("]", "")].ToString();
                    break;

			}
			return str;
		}




		public static string getHYfirstmonth(string str)
		{
			BasePage	page=System.Web.HttpContext.Current.Handler as BasePage;
			DateTime	d_date=DateTime.Now;
			if(!string.IsNullOrEmpty(BuildParamList.getValue(page.PgParamXmlDoc,"EndDate")))
                d_date = DateTime.Parse(BuildParamList.getValue(page.PgParamXmlDoc, "EndDate"));
			string strmonth = d_date.ToString("MM");
			int imonth = leofun.toIntval(strmonth);
			string strm="";
			if(str.IndexOf("&[半年起始月]-&[半年起始月+1]")>-1)
			{
				if(imonth<7) strm = "1-2";
				else strm = "7-8";
				str = str.Replace("&[半年起始月]-&[半年起始月+1]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+2]-&[半年起始月+3]")>-1)
			{
				if(imonth<7) strm = "3-4";
				else strm = "9-10";
				str = str.Replace("&[半年起始月+2]-&[半年起始月+3]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+4]-&[半年起始月+5]")>-1)
			{
				if(imonth<7) strm = "5-6";
				else strm = "11-12";
				str = str.Replace("&[半年起始月+4]-&[半年起始月+5]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+1]")>-1)
			{
				if(imonth<7) strm = "2";
				else strm = "8";
				str = str.Replace("&[半年起始月+1]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+2]")>-1)
			{
				if(imonth<7) strm = "3";
				else strm = "9";
				str = str.Replace("&[半年起始月+2]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+3]")>-1)
			{
				if(imonth<7) strm = "4";
				else strm = "10";
				str = str.Replace("&[半年起始月+3]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+4]")>-1)
			{
				if(imonth<7) strm = "5";
				else strm = "11";
				str = str.Replace("&[半年起始月+4]",strm);
				return str;
			}

			if(str.IndexOf("&[半年起始月+5]")>-1)
			{
				if(imonth<7) strm = "6";
				else strm = "12";
				str = str.Replace("&[半年起始月+4]",strm);
				return str;
			}
			
			return str;
		}
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

		public static void setsummary(int startrow,int endrow,XmlNodeList NodesRow,string sumsign,double[] sumfld, string[] arrfld, DataTable oData)
		{
			//置入合计项
			XmlNodeList xnode = null;
			//for(int i=startrow;i<=endrow;i++)
			for(int i=0;i<=endrow;i++)
			{
				if(NodesRow[i].InnerText.IndexOf(sumsign)>-1)
				{
					xnode = NodesRow[i].ChildNodes;
					for(int j=0;j<xnode.Count;j++)
					{
						string sfld = xnode[j].InnerText;
						for(int m=0;m<arrfld.Length;m++)
						{
							if(!oData.Columns.Contains(arrfld[m]))
								continue;
							if(sfld == "sum("+arrfld[m]+")" || sfld == "SUM("+arrfld[m]+")")
							{
                                if (oData.Columns[arrfld[m]].DataType.Name == "Double" || oData.Columns[arrfld[m]].DataType.Name == "Decimal")
								{
									xnode[j].ChildNodes[0].InnerText = sumfld[m].ToString("#0.00"); 
								}
								else
								{
									xnode[j].ChildNodes[0].InnerText = sumfld[m].ToString(); 
								}
								break;
							}
							else
							{
								if(sfld == "avg("+arrfld[m]+")" || sfld == "AVG("+arrfld[m]+")")
								{
                                    if (oData.Columns[arrfld[m]].DataType.Name == "Double" || oData.Columns[arrfld[m]].DataType.Name == "Decimal")
									{
										double val = sumfld[m]/oData.Rows.Count;
										xnode[j].ChildNodes[0].InnerText = val.ToString("#0.00"); 
									}
									else
									{
										double val = sumfld[m]/oData.Rows.Count;
										xnode[j].ChildNodes[0].InnerText = val.ToString(); 
									}
									break;
								}
							}
						}
						if(xnode[j].InnerText.IndexOf("S合计")>-1)
						{
							string[] arrSummary	= leofun.getArrayFromString(xnode[j].InnerText,";");
							xnode[j].ChildNodes[0].InnerText = "合计:";
							for(int ints = 0;ints < arrSummary.Length; ints++)
							{
								if(arrSummary[ints].IndexOf("<别名>")>-1) xnode[j].ChildNodes[0].InnerText = arrSummary[ints].Replace("<别名>","");
							}
							
						}

						if(xnode[j].InnerText.IndexOf("S平均值")>-1)
						{
							string[] arrSummary	= leofun.getArrayFromString(xnode[j].InnerText,";");
							xnode[j].ChildNodes[0].InnerText = "平均值:";
							for(int ints = 0;ints < arrSummary.Length; ints++)
							{
								if(arrSummary[ints].IndexOf("<别名>")>-1) xnode[j].ChildNodes[0].InnerText = arrSummary[ints].Replace("<别名>","");
							}
							
						}

						if(xnode[j].InnerText.IndexOf("S页合计")>-1) 
						{
							string[] arrsubSummary	= leofun.getArrayFromString(xnode[j].InnerText,";");
							xnode[j].ChildNodes[0].InnerText = "页合计:";
							for(int ints = 0;ints < arrsubSummary.Length; ints++)
							{
								if(arrsubSummary[ints].IndexOf("<别名>")>-1) xnode[j].ChildNodes[0].InnerText = arrsubSummary[ints].Replace("<别名>","");
							}
						}
						if(xnode[j].InnerText.IndexOf("S组合计")>-1) 
						{
							string[] arrsubSummary	= leofun.getArrayFromString(xnode[j].InnerText,";");
							xnode[j].ChildNodes[0].InnerText = "小计:";
							for(int ints = 0;ints < arrsubSummary.Length; ints++)
							{
								if(arrsubSummary[ints].IndexOf("<别名>")>-1) xnode[j].ChildNodes[0].InnerText = arrsubSummary[ints].Replace("<别名>","");
							}
						}
					}
				}
			}
		}

		public static string[] getExcelFields(XmlNode FldNode)
		{
			XmlNodeList xnodelist = FldNode.ChildNodes;
			char[] sep  = {';'};
			string str = "",fld="";
            //if (cols == null) cols = xnodelist.Count;
			for(int j=0;j<xnodelist.Count;j++)
			{
				string strnode = xnodelist[j].InnerText;
				if(xnodelist[j].InnerText=="") continue;
				if(xnodelist[j].InnerText.IndexOf("S合计")<0 && xnodelist[j].InnerText.IndexOf("S平均")<0  && xnodelist[j].InnerText.IndexOf("S页合计")<0  && xnodelist[j].InnerText.IndexOf("S组合计")<0)
				{
					fld = xnodelist[j].InnerText.Replace("sum(","");
					fld = fld.Replace("SUM(","");
					fld = fld.Replace("sum（","");
					fld = fld.Replace("SUM（","");

					fld = fld.Replace("avg(","");
					fld = fld.Replace("AVG(","");
					fld = fld.Replace("avg（","");
					fld = fld.Replace("AVG（","");

					
					fld = fld.Replace(")","");
					fld = fld.Replace("）","");

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
/*
        private void OutExcel(GridView dg, string name)
        {
            dg.Visible = true;
            Response.Clear();
            Response.Buffer = true;
            Response.Charset = "GB2312";
            name = "attachment;filename=" + name;
            Response.AppendHeader("Content-Disposition", name);
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");
            Response.ContentType = "application/ms-excel";
            dg.EnableViewState = false;
            System.IO.StringWriter oStringWriter = new System.IO.StringWriter();
            System.Web.UI.HtmlTextWriter oHtmlTextWriter = new System.Web.UI.HtmlTextWriter(oStringWriter);
            dg.RenderControl(oHtmlTextWriter);
            Response.Write(oStringWriter.ToString());
            Response.End();
        }
*/
		/// <summary>
		/// 将生成的数据转为excel输出
		/// </summary>
		/// <param name="xmldoc">生成的数据xml文档</param>
		public static void outXML2ExcelDown(XmlDocument	xmldoc,string strfile,string stropenfile)
		{
			xmldoc.Save(strfile);
            System.Web.HttpContext.Current.Response.Write("<script language='javascript'>window.open('" + strfile + "')</script>");
		}

        public static void outXML2Excel(XmlDocument xmldoc, string strfile)
        {
            //strfile = strfile.Replace("@","");
            if (xmldoc == null) return;
            MemoryStream ExcelStream = new MemoryStream();
            xmldoc.Save(ExcelStream);

            Byte[] bytearray = (Byte[])Array.CreateInstance(typeof(byte), ExcelStream.Length);

            ExcelStream.Position = 0; // Star the stream at position 0
            ExcelStream.Read(bytearray, 0, (int)ExcelStream.Length); // Read the stream into the Byte[]
            ExcelStream.Close(); // Close the stream

            System.Web.HttpContext.Current.Response.Clear(); // Clear the Response Object
            System.Web.HttpContext.Current.Response.ClearHeaders();
            System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
            System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
            System.Web.HttpContext.Current.Response.Charset = "gb2321";
            string strUrl = strfile;
            strUrl = strUrl.ToString();
            string prnmode = DataAccRes.AppSettings("prnmode");
            if (prnmode.ToLower() == "inline")
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "inline; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
            else
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
            //System.Web.HttpContext.Current.Response.AppendHeader("content-disposition","attachment; filename=print.xls"); // set the Content Header

            System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
            System.Web.HttpContext.Current.Response.SuppressContent = false;
            System.Web.HttpContext.Current.Response.Flush();
            System.Web.HttpContext.Current.ApplicationInstance.CompleteRequest();
        }

		/// <summary>
		/// 将生成的数据转为excel输出
		/// </summary>
		/// <param name="xmldoc">生成的数据xml文档</param>
        //public static void outXML2Excel(XmlDocument	xmldoc,string strfile)
        //{
        //    try
        //    {
        //        Byte[] bytearray = (Byte[])Array.CreateInstance(typeof(byte), ExcelStream.Length);
        //        System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
        //        System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
        //        System.Web.HttpContext.Current.Response.Charset = "gb2321";
        //        string prnmode = DataAccRes.AppSettings("prnmode");
        //        if (prnmode.ToLower() == "inline")
        //            System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "inline; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
        //        else
        //            System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + System.Web.HttpUtility.UrlEncode(strUrl.ToString()));

        //        //System.Web.HttpContext.Current.Response.AppendHeader("content-disposition", "attachment; filename=" + HttpUtility.UrlEncode(strfile)); 
        //        //xmldoc.Save(System.Web.HttpContext.Current.Response.Output);
        //        //System.Web.HttpContext.Current.Response.Output.Close();
        //        System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
        //        //			System.Web.HttpContext.Current.Response.SuppressContent=false;
        //        //			System.Web.HttpContext.Current.Response.Flush();
        //        System.Web.HttpContext.Current.Response.End();

        //    }
        //    catch
        //    {
        //        string strMSG = "请关闭正在打开的模板文件：" + strfile + "!";
        //        System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
        //        System.Web.HttpContext.Current.Response.Write("alert('" + strMSG + "')");
        //        System.Web.HttpContext.Current.Response.Write("	</script>							");
        //    }
        //    return;

        //    //strfile = strfile.Replace("@","");
        //    MemoryStream ExcelStream=new MemoryStream();
        //    xmldoc.Save(ExcelStream);

        //    Byte[] bytearray = (Byte[])Array.CreateInstance(typeof(byte), ExcelStream.Length);

        //    ExcelStream.Position = 0; // Star the stream at position 0
        //    ExcelStream.Read (bytearray, 0, (int)ExcelStream.Length); // Read the stream into the Byte[]
        //    ExcelStream.Close(); // Close the stream

        //    System.Web.HttpContext.Current.Response.Clear(); // Clear the Response Object
        //    System.Web.HttpContext.Current.Response.ClearHeaders();
        //    System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
        //    System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
        //    System.Web.HttpContext.Current.Response.Charset="gb2321";
        //    string strUrl = strfile;
        //    strUrl= strUrl.ToString();
			
        //    System.Web.HttpContext.Current.Response.AppendHeader("content-disposition","attachment; filename=print.xls"); // set the Content Header
        //    System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
        //    System.Web.HttpContext.Current.Response.SuppressContent=false;
        //    System.Web.HttpContext.Current.Response.Flush();
        //    System.Web.HttpContext.Current.Response.Clear();
        //    System.Web.HttpContext.Current.Response.End();
        //}

		public static void outXML2Word(XmlDocument	xmldoc,string strfile)
		{
			System.Web.HttpContext.Current.Response.ContentType = "application/msword";
			System.Web.HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
			System.Web.HttpContext.Current.Response.Charset="gb2321";
			System.Web.HttpContext.Current.Response.AppendHeader("content-disposition","inline; filename="+System.Web.HttpUtility.UrlEncode(strfile)); // set the Content Header
			xmldoc.Save(System.Web.HttpContext.Current.Response.Output);
			System.Web.HttpContext.Current.Response.Output.Close();
			return;

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
			
			System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename="+System.Web.HttpUtility.UrlEncode(strUrl.ToString()));
			//System.Web.HttpContext.Current.Response.AppendHeader("content-disposition","attachment; filename=print.xls"); // set the Content Header
			
			System.Web.HttpContext.Current.Response.BinaryWrite(bytearray); // Write the Byte[] to the output stream
			//			System.Web.HttpContext.Current.Response.SuppressContent=false;
			//			System.Web.HttpContext.Current.Response.Flush();
			System.Web.HttpContext.Current.Response.End();
		}


		public static string prnparamlist()
		{
			return "&[半年起始月]-&[半年起始月+1],&[半年起始月+2]-&[半年起始月+3],&[半年起始月+4]-&[半年起始月+5]"
					+ ",&[半年起始月+1],&[半年起始月+2],&[半年起始月+3],&[半年起始月+4]"
			        + ",&[半年起始月+5],&[半年起始月]"
                    + ",&[date],&[日期],&[年月],&[年],&[月],&[日],&[时],&[分],&[单位],&[部门],prnunit,prnname"
                    + ",prnman,&[姓名],&[账号],&[帐号],&[datemonth]";
		}


        /// <summary>
        /// 对于需要字符宏替换的:分页参数,过滤查询参数,Chart图参数
        /// 参数的类型要声明为宏: type="macro";
        /// </summary>
        /// <param name="xmldoc">参数文档</param>
        /// <returns></returns>
        private  static string[] getStrParams(XmlDocument xmldoc, WorkItem workItem)
        {
            string[] strParams ={ "", "", "", "", "", "", "", "", "" };
            NameObjectList macroParam = BuildParamList.BuildParamMacro(xmldoc, workItem.ItemName);
            for (int i = 0; i < macroParam.Count; i++)
            {
                string strName = macroParam.Keys[i];
                if ("firstrowold" == strName.ToLower())
                    strParams[1] = macroParam[i].ToString();
                if ("firstrow" == strName.ToLower())
                    strParams[1] = macroParam[i].ToString();
                if ("lastrow" == strName.ToLower())
                    strParams[7] = macroParam[i].ToString();
                if ("filterfast" == strName.ToLower())
                    strParams[2] = macroParam[i].ToString();
                if ("filter" == strName.ToLower())
                    strParams[3] = macroParam[i].ToString();
            }
            if (null != workItem)
            {
                strParams[8] = workItem.InitFilter;
                if ("" != workItem.PageSize)
                    strParams[0] = workItem.PageSize;
            }
            if ("" == strParams[0])
                strParams[0] = "10";
            if ("" == strParams[1])
                strParams[1] = "0";
            if ("" == strParams[7])
                strParams[7] = strParams[0];
            string recordcount = BuildParamList.getValue(xmldoc, workItem.ItemName, "RecordCount");
            if (string.IsNullOrEmpty(recordcount))
                recordcount = BuildParamList.getValue(xmldoc, "RecordCount");
            if (!string.IsNullOrEmpty(recordcount))
            {
                strParams[1] = "0";
                strParams[7] = strParams[0] = recordcount;
            }

            return strParams;
        }

        private static string[] masterdatas(string[] pospms,string strmark)
        {
            if (pospms == null) return null;
            for (int i = 0; i < pospms.Length; i++)
            {
                if (pospms[i].IndexOf(strmark) < 0) continue;
                return leofun.getArrayFromString(pospms[i].Replace(strmark, ""), ",");
            }
            return null;
        }
        private static int otherdatas(string[] pospms, string strmark)
        {
            if (pospms == null) return 0;
            for (int i = 0; i < pospms.Length; i++)
            {
                if (pospms[i].IndexOf(strmark) < 0) continue;
                return leofun.toIntval(pospms[i].Replace("<空列>", ""));
            }
            return 0;
        }

	}
}
