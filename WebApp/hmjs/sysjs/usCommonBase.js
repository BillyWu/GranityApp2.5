//现场定义表格属性，该事件在ControlTemplate中定义
function $U(){return document.UnitItem;}
function us_tablepro(xmlID)
{
	var oband=GridUtil.FindBand(xmlID);
	if(!oband)   return;
    var xmldoc=$U().ParamXmldoc;			
    ToolUtil.setParamValue(xmldoc, "pUnitName", $U().UnitName, "s", "P", "", "Ts","");
    ToolUtil.setParamValue(xmldoc, "pItemName", oband.ItemName, "s", "P", "", "Ts","");
	oband.setModalContent("表格属性");		
}

function	ue_bandinsert(xmlID)
{
	var band=GridUtil.FindBand(xmlID);
	if(!band)   return;
	if( band.RecordCount() >0)
	    var rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	else
	    var rowIndex=-1;
	var strMsg=band.CalXmlLand.ValidateRow(rowIndex);
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.NewRecord(rowIndex);
	band.setCurrentRow(rowIndex);
	return;
}
function ue_bandadd(xmlID)
{
	var band=GridUtil.FindBand(xmlID);if(!band) return false;
	var rowIndex=0;
    if("function"==typeof(ts_beforeadd))
        if(!ts_beforeadd(band)) return;
	if(band.RecordCount()>0) rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	else rowIndex=-1;
	var strMsg=band.CalXmlLand.ValidateRow(rowIndex);
	if(strMsg && ""!=strMsg){alert(strMsg);return false;}
	band.NewRecord();
	if(band.Grid)
	{
        if(band.Grid.Table.dataSrc==null || band.Grid.Table.dataSrc=="")
            ue_GridAdd(band);	//考虑到非数据岛绑定表格
	    window.setTimeout(_setRow(band),150);
	}
    if("function"==typeof(ts_Afteradd))
        if(!ts_Afteradd(band)) return;	
	return true;
}
function _setRow(oband)
{return function(){x_setRow(oband);}}

function x_setRow(oband)
{
    if(!oband.Grid || oband.RecordCount()==0) return;
    oband.setCurrentRow(oband.XmlLandData.recordset.AbsolutePosition-1);
    oband.Grid.DivDetail.scrollTop = oband.Grid.DivDetail.scrollHeight;
    if(oband.Grid) oband.Grid.setFocus();	   
}

function ue_GridAdd(band)
{
    var myTable = band.Grid.Table;
    var tbIndex = band.XmlLandData.recordset.AbsolutePosition - 1 ;
    var objRow = myTable.insertRow(tbIndex);
    objRow.rowType="detail";
    for(var j = 0; j < band.Grid.Cols.length; j++)
    {
        var colitem     = band.ColObj(band.Grid.Cols[j]);
        var objCel = objRow.insertCell(j);
        var colvalues="";
        var colxml="";
        colvalues = band.getFldStrValue(colitem.name);
        if(colvalues=="") colvalues="　";
        objCel.className = "cellStyle";
        objCel.datatype  = colitem.datatype;
        switch(colitem.datatype)
        {
            case "string":
                if(colitem.datastyle.indexOf("link")>-1) 
                {
                    colvalues="<a style='color: #804000' href='#' class='gridlink' target='_self' onclick='"+colitem.onclick+"'>"+colvalues+"</a>";
                    objCel.align="center";
                }
                break;
            case "boolean":
                colvalues = '<input type="checkbox" id="chk'+i+'">';objCel.align="center";
                break;
            default:
                if(colitem.name=="RowNum") {objCel.align="center";objCel.className = "cellwb_btn";objCel.datatype="";}
                else {objCel.align="right";}
                break;
        }
        var _id = band.ItemName + colitem.name + "_" + tbIndex;
        objCel.ID = _id ;
        objCel.colname = colitem.name;
        objCel.attachEvent("onclick",GridUtil.usOnCellFocusHandle);
        objCel.innerHTML = colvalues;
    }
}

function ue_banddelete(xmlID)
{
	var band=GridUtil.FindBand(xmlID);
	if(!band) return false;
    if($U().Right!="增删改") {alert("没有修改权限！");return;}
    if("function"==typeof(beforeDelete)) if(!beforeDelete()) return;
	if(!band.Grid)
	{
		band.DeleteRecord();
		return true;
	}

	if(band.Grid.Table.rows.length<1)
	{
	    alert("没有记录可被删除！");
		return false;
    }
	grid=band.Grid;
	if(!grid.curTd)
		curTd=ToolUtil.getCtrlByTagD(false,grid.Table,"TD","colname");
	else
		curTd=grid.curTd;
	var cellIndex=curTd.cellIndex;

	if(grid.RowSelectedList.length==0 || cellIndex<0)
	{
	    alert("请选择要删除的行！");
	    return false;
	}	
	//找到删除后焦点的当前行
	var curTrNew=null;
    var rowspan = 1;
    if(grid.Table.rows.length>0)
        rowspan = grid.Table.rows[0].cells[0].rowSpan;
	
	for(var i=grid.Table.rows.length-rowspan;i>-1;i=i-rowspan)
	{
		var row=grid.Table.rows[i];
		if(!curTrNew && true==row.isSelected)
		{	
			if(i<grid.Table.rows.length - rowspan)
			{
				curTrNew=grid.Table.rows[i + rowspan];
				break;
			}
			curTrNew=row;
		}else if(curTrNew && !row.isSelected)
		{
			curTrNew=row;
			break;
		}
	}
	grid.DelRowSelected();
	if(!curTrNew) return;
	var curTd=curTrNew.cells[cellIndex];
	grid.setActiveCell(curTd);
	grid.setFocus();
	return true;
}

function	ue_bandcmd_nav(nav,pageindex)
{
	if("next"!=nav && "prev"!=nav && "first"!=nav && "last"!=nav && "jump"!=nav)
		return;
	var band=GridUtil.FindBand();
	if(!band)   return;
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
	band.cmd_nav(nav,pageindex);
    ctrlsrc.disabled=null;
    document.isPost=null;
}

function	ue_bandsearch(value,isNext,xmlID)
{
	if(null==value || ""==value)
		return;
	if(null==isNext)	isNext=false;
	var band=GridUtil.FindBand(xmlID);
	if(!band)   return;
	if( band.RecordCount() >0)
	    var rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	else
	    var rowIndex=-1;
	var strMsg=band.CalXmlLand.ValidateRow(rowIndex);
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	var rowIndex=0,cellIndex=0,isSearch=false,isBreak=false;
	if(!isNext || !band.nextCell)
	{
		band.nextCell=null;
		rowIndex=0;
		cellIndex=0;
	}else{
		var tr=ToolUtil.getCtrlByTagU(false,band.nextCell,"TR","rowType","detail");
		if(tr && tr.rowIndex)
		    rowIndex=tr.rowIndex;
		cellIndex=band.nextCell.cellIndex;
	}
	if(rowIndex>=band.Grid.Table.rows.length)
	{	rowIndex=0;cellIndex=0;}
	for(var i=rowIndex;i<band.Grid.Table.rows.length;i++)
	{
		var row=band.Grid.Table.rows[i];
		if(i!=rowIndex || isSearch)
			cellIndex=0;
		for(var j=cellIndex;j<row.cells.length;j++)
		{
			//重新回到band.nextCell时退出
			var cell=row.cells[j];
			if(false==isSearch && band.nextCell==cell)
			{
				isSearch=true;continue;
			}
			isSearch=true;
			if(true==isSearch && band.nextCell==cell)
			{
				isBreak=true;break;
			}
			if(!row.cells[j].colname || ""==row.cells[j].colname)
				continue;
			for(var k=0;k<cell.childNodes.length;k++)
			{
				//if(cell.childNodes[k].style && "none"==cell.childNodes[k].style.display || "hidden"==cell.childNodes[k].style.visibility)
				//	continue;
				var ctrl=cell.childNodes[k];
				if("INPUT"==ctrl.tagName && "text"!=ctrl.type)
					continue;
				var strValue="";
				if("INPUT"==ctrl.tagName || "SELECT"==ctrl.tagName)
					strValue=ctrl.value;
				else if(ctrl.innerText)
					strValue=ctrl.innerText;
                else strValue=ctrl.nodeValue;
			    if(!strValue) continue;
				if(strValue.indexOf(value)>-1)
				{
					band.nextCell=cell;
					isBreak=true;break;
				}
			}
			if(true==isBreak)	break;
			//如果搜索到最后一个单元格时,再从开头查找直到band.nextCell;
			if(i==band.Grid.Table.rows.length-1 && j==row.cells.length-1 && band.nextCell && true!=isBreak)
				i=-1;
		}
		if(true==isBreak)	break;
	}
	if(band.nextCell)
		band.Grid.setActiveCell(band.nextCell);
		
	if(band.Grid && band.Grid.curTd)
	{
		for(var i=0;i<band.Grid.curTd.childNodes.length;i++)
		{
			ctrl=band.Grid.curTd.childNodes[i];
			if(ctrl && ctrl.style &&"none"!=ctrl.style.display && "hidden"!=ctrl.style.visibility)
				try{ctrl.focus();}catch(ex){}
		}
	}
	return isBreak;
}
//树类型的数据段，模糊搜索匹配值的节点;
function	ue_bandTreeSearch(value,isNext,xmlID)
{
	var band=GridUtil.FindBand(xmlID);
    if(!band || !band.Tree)       return;
    var rowIndex=band.SearchRowIndex(value,isNext);
    if(rowIndex<0)  return;
    var nodeID=band.getFldStrValue(band.Tree.IDField,rowIndex);
    var trvNode=band.Tree.getTrvNodeByID(nodeID);
    if(null==trvNode)   return;
    trvNode.ParentTreeView.SelectNodeById(nodeID);
    //trvNode.setSelected(true);
}

function mhHover(tbl, idx, cls)
{
	var t, d;
	if (document.getElementById)
		t = document.getElementById(tbl);
	else
		t = document.all(tbl);
	if (t == null) return;
	if (t.getElementsByTagName)
		d = t.getElementsByTagName("td");
	else
		d = t.all.tags("td");
	if (d == null) return;
	if (d.length <= idx) return;
	d[idx].className = cls;
}

//Tab页的切换:Tab标签页使用Table的Td单元格做成,显示内容用一个大的单元格来显示;
//一个Tab页控件对应于一个Table;使用样式表:tab,selTab;
//用于显示内容的是tdType属性为tabContents的单元格;用于存放不显示内容的用tdType属性为tabHidden的单元格;
ControlUtil.ChangeTabs=function(tabid)
{
	if(!tabid || ""==tabid)		return;
	var tabActive=document.getElementById(tabid);
	if(!tabActive)	return;
	var tabTable=ToolUtil.getCtrlByTagU(false,tabActive,"TABLE");
	if(!tabTable)	return;
	
	if(!tabTable.currentTab)
		tabTable.currentTab=tabTable.rows[0].cells[0];
	if(tabTable.currentTab && tabTable.currentTab!=tabActive)
	{
		tabTable.currentTab.className = "tab";
		var lbctrl= ToolUtil.getCtrlByTagD(false,tabTable.currentTab,"INPUT");
		if(lbctrl)
			lbctrl.className="tab";
		var tabContent = document.getElementById(tabTable.currentTab.content);
		if(tabContent)
			tabContent.style.display="none";
	}
	
	if(tabActive && tabActive!=tabTable.currentTab)
	{
		tabActive.className = "selTab";
		var lbctrl= ToolUtil.getCtrlByTagD(false,tabActive,"INPUT");
		if(lbctrl)
			lbctrl.className="selTab";
		var tabContent = document.getElementById(tabActive.content);
		if(tabContent)
			tabContent.style.display="";
		tabTable.currentTab=tabActive;
	}
	return;
}


//高级特性的影子函数,在实际调用时程序自动调用高级特性脚本覆盖影子函数
//影子函数
function ue_report()
{
    CommonLoadjs(GridUtil.CommAdv,arguments,"ue_report");
}


function usPrintHTML()
{
    CommonLoadjs(GridUtil.CommAdv,arguments,"usPrintHTML");
}

function _myrefresh()
{
    CommonLoadjs(GridUtil.CommAdv,arguments,"_myrefresh");
}


//beforesave事件用于保存前条件处理,noafter - true:不进行保存后计划
function ue_save(hint,noafter,nochk)
{
    if($U().Right!="增删改") {alert("没有修改权限！");return;}
    if("function"==typeof(beforesave)) if(!beforesave()) return;
    if($U().IsModify()==false)
    {
        if(hint=="") return true;
        alert("已保存！")
        return true;
    }
    var ctrlsrc = {};
    if(event && event.srcElement)
        var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return false;
    ctrlsrc.disabled=true;
    document.isPost=true;
    if(!nochk){
	    var	 strMsg = $U().ValidatityAll(true);
	    if(strMsg && ""!=strMsg)
	    {
		    alert(strMsg);
		    //定焦：
    //		ValidatityFocus(strMsg);
		    {ctrlsrc.disabled=null;document.isPost=null;return false;}
	    }
	}
	//处理自动编号
	if(!ue_setBh()) return;
    var strResult=$U().saveData();
    
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"==success)
    {
        if(hint && hint!="") 
        {
            if(hint.toLowerCase()!="false") alert(hint);
        }
        else if(hint=="")
        {}
        else 
            alert("保存成功!");
        if("function"==typeof(usAfterSave) && !noafter) usAfterSave();
        if("saverefresh"==$U().SaveType)
        {
            var bandR=($U().BandMaster)?$U().BandMaster:$U().Bands[0];
            if(bandR)   bandR.Query();
            for(var i=0;i<$U().Bands.length;i++)
            {
                if("General"==$U().Bands[i].itemType)
                    $U().Bands[i].Query();
            }
        }
        ctrlsrc.disabled=false;
        document.isPost=null;
        return true;
    }else{
        alert(ToolUtil.valueTag(strResult,"提示"));
        ctrlsrc.disabled=false;
        document.isPost=null;
        return false;
    }
}

function ue_setBh()
{
    var bands = $U().Bands;
    for(var i=0;i<bands.length;i++)
    {
        if(!bands[i].XmlSchema || bands[i].RecordCount()==0) continue;
        var colList=bands[i].XmlSchema.XMLDocument.selectNodes("//xs:element[@bhrule!='']");
        for(var j=0;j<colList.length;j++)
        {
            var bhfield = colList[j].attributes.getNamedItem("name").text;
            var bh=bands[i].getFldStrValue(bhfield);
            if(!bh || ""==bh || bh.length<4)
            {
                //+"."+bands[i].ItemName+"."+bhfield
	            //[品牌编码]1001
    	        var rule = colList[j].attributes.getNamedItem("bhrule").text;
    	        for(var m=0;m<bands[i].ColNames.length;m++)
    	        {
    	            var colitem     = bands[i].ColObj(bands[i].Col(bands[i].ColNames[m]));
    	            colvalue=bands[i].getFldStrValue(bands[i].ColNames[m]);
    	            if(colitem.format.indexOf("yyyy")>-1)
    	            {
    	                colvalue=colvalue.substring(2,4);
    	                if(colitem.name=="定款年份")
    	                    colvalue=ToolUtil.Convert(colvalue,"int")+7;
    	            }
    	            if(rule.indexOf("["+bands[i].ColNames[m]+"]")>-1)
    	            {
    	                rule = rule.replace("["+bands[i].ColNames[m]+"]",pad(colvalue,2));
    	            }
    	        }
    	        if(rule=="") rule=$U().UnitName;
                var rtn = ws_getbh(rule);
    	        if(rtn=="error" || rtn=="") {alert("编号生成错误，请检查！");
                    if(event.srcElement) event.srcElement.disabled=false;
	                document.isPost=null;return false}
                bands[i].setFldStrValue(null,bhfield,rtn,bh);
            }            
        }
    }
    return true;
}
////字符串补位
//function pad(num, n) {
//  return Array(n>num?(n-(''+num).length+1):0).join(0)+num;
//}
//ajax获取编号
function ws_getbh(bhitem,rule)
{
    xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
    try{
    xmlhttp.open("Post",ue_path()+"/xmlbh.aspx?file="+bhitem,false);
	xmlhttp.send(null);
	}catch(ex){}
	return xmlhttp.responseText;
}
function ue_xsave()
{
    CommonLoadjs(GridUtil.CommAdv,arguments,"ue_xsave");
}


function ue_savewidth()
{
    CommonLoadjs(GridUtil.CommAdv,arguments,"ue_savewidth");
}
/*
function calendar()
{
    CommonLoadjs(GridUtil.Calendar30,arguments,"calendar");
}
*/
function ue_cmd(menuitem,itemName,isRefresh,noAlert,o)
{
    var ctrlsrc=Xent(o);
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var myUnitItem=$U();
    if(!itemName || ""==itemName)
        var band=(myUnitItem.BandMaster)?myUnitItem.BandMaster:((myUnitItem.Bands.length>0)?myUnitItem.Bands[0]:null);
    else
        var band=myUnitItem.getBandByItemName(itemName);
    //无刷新方式的执行
    
    var strResult=band.ExecutCmd(menuitem);
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"==success)
    {
        if(!noAlert)
            alert("操作成功!");
        if(true==isRefresh)
            band.XQuery(isRefresh);
    }else{
        if(!noAlert)
            alert(ToolUtil.valueTag(strResult,"提示"));
    }
    ctrlsrc.disabled=false;document.isPost=null;
    return strResult;
}

var g_tabid="";
function ExeCtrlPostCmd(ctrlID,cmdArg)
{
    if(!cmdArg) cmdArg="";
    if(ctrlID && ""!=ctrlID)
        cmdArg=ToolUtil.setValueTag(cmdArg,"CtrlID",ctrlID);
	document.getElementById("hlb_cmd").value=cmdArg;
	__doPostBack('bt_PostBack','');
}

function ue_returnok()
{
    	if(window.dialogArguments)
		$U().CheckInParentUnit();
}
//prntmp为动态指定的打印模板
function ue_print(xmlID,prntmp)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var xmldoc=$U().ParamXmldoc;
    var band=GridUtil.FindBand(xmlID);
    if(!band) band=$band(xmlID);
    if("html"==$U().printType)
    {
        usPrintHTML();
        {ctrlsrc.disabled=null;document.isPost=null;return;}
    }else{
	    if(!band)
	    {
	        ToolUtil.delParam(xmldoc, "WorkItem");
	        if(prntmp) ToolUtil.delParam(xmldoc, "PrnTmp");
	    }
	    else{
	        ToolUtil.setParamValue(xmldoc, "WorkItem", band.ItemName, "", "P", null, "T");
	        if(prntmp)
	            ToolUtil.setParamValue(xmldoc, "PrnTmp", prntmp, "", "P", null, "T");
	    }
	    ToolUtil.delParam(xmldoc, "AppendItem");
	    ToolUtil.setParamValue(xmldoc, "WinType", "Print", "", "P", "", "T");
        var uri=ue_path()+"/"+$U().TransParams();
        ControlUtil.TopFrame.OpenPrnWin(uri);
    }
    {ctrlsrc.disabled=null;document.isPost=null;return;}
}

function ux_print(ItemName)
{
    var ob=GridUtil.FindBand();
    if(!ob) ob=$band(ItemName);
    if(!ob) {alert("配置错误!");return;};
    if(!ob.PrnSql || ob.PrnSql==""){ue_print();return;}
    if(ob.PrnTmp=="" || ob.printType!="excel"){alert("没有打印模板!");return;};
    var filter = ToolUtil.getParamValue($XD(),"Filter","P",ob.ItemName,"C");
    var sql = ob.PrnSql.replaceAll("\"","'");
    if(filter!="") sql = sql.replaceAll("(2>0)",filter);
    if(sql.indexOf("@")>-1)
    {
        var strsql = sql.substring(0,sql.indexOf("@"));
        var strpms = sql.substring(sql.indexOf("@"),sql.length);
        var arrfld = strpms.split(",");
        var s="";
        for(var i=0;i<arrfld.length;i++)
        {
            var parm = arrfld[i].replace("@","");
            if(parm=="'(1>0)'" || parm=="'(2>0)'")
                s=s+","+parm
            else{
                if(ob && ob.Col(parm))
                    s=s+",'"+ob.getFldStrValue(parm)+"'";
                else
                    s=s+",'"+$SP(parm)+"'"; //取系统参数
            }
        }
        s=s.substring(1,s.length);
        sql=strsql + s;
    }
    var pms="";
    //应传入打印模板(ob.PrnTmp,sql,主表或环境参数)
    if("function"==typeof(tsBeforePrint))
    {
        pms = "&pms=" + tsBeforePrint();
        if(pms.indexOf("@UnitName")<0)
            pms = pms + ","+ue_sysprn;
    }
    else pms = "&pms="+ue_sysprn;
    url=ue_path()+"/frmprintc.aspx?prn=" + ob.PrnTmp + "&sql=" + sql + pms;
    window.open(url);
    //,"","height=100,width=100,left=0,top=0,menu=yes,status=yes,resizable=no,scrollbars=no"
}
//获取顶级窗口引用资源
function usGetTopFrame()
{
	var win=window;
	while(win.parent)
	{
		if(win===win.parent) break;
		win=win.parent;
	}
	return win;
}

//加载脚本
function CommonLoadjs(filename,args,funname)
{
    if(!args || !funname || !filename)
        return;
    GridUtil.Loadjs(filename);
    this.tempfun=function(){};
    eval('this.tempfun='+funname);
    if("function"!=typeof(this.tempfun))
        return;
    return this.tempfun.apply(this,args);
}

//通用定制查询
//定义规则：
//在查询值的控件上指定下列值：
// name="字段名",filter="or"(关系式，或者'and'),value为查询的值,datatype=字段类型(number,char,varchar,string,date,datetime)
// exp :>,<,=,<>,%

//替换
function ue_replace(xmlID)
{
	if(!xmlID)
	{
		var tab=ToolUtil.getCtrlByTagU(false,event.srcElement,"TABLE","tabType","grid");
		if(!tab)	return;
		var tabDetail=ToolUtil.getCtrlByTagD(true,tab,"TABLE","tabType","detail");
		if(!tabDetail || !tabDetail.Grid)
			return;
		var band=$U().getBandByItemName(tabDetail.Grid.ItemName);
	}else{
		var xmlland=document.getElementById(xmlID);
		if(!xmlland)	return;
		var band=$U().getBandByItemName(xmlland.itemname);
	}
	if(!band || !band.XmlSchema)    return;
	var rtn = window.showModalDialog("frmreplace.HTM",band,"dialogHeight: 245px; dialogWidth: 400px; edge: Raised; center: Yes; help: No; resizable: No status: No;"); 
	if(rtn=="" || rtn==null) return 1;	 
}

    function exchangeOther(oband,nRowIndex,iRowIndex,xf)
    {
    
        var ov=oband.getFldStrValue(xf,iRowIndex);
        var nv=oband.getFldStrValue(xf,nRowIndex);
        var of = oband.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@formatfld='"+xf+"_格式']");
        var od = oband.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@formatfld='"+xf+"_显示']");
        if(of || od)
        {
                
            window.setTimeout(_setExchange(oband,nRowIndex,xf,ov),1000);
            window.setTimeout(_setExchange(oband,iRowIndex,xf,nv),2000);
        }
        {
//            window.setTimeout(_setExchange(oband,nRowIndex,xf,ov),1000);
//            window.setTimeout(_setExchange(oband,iRowIndex,xf,nv),2000);
            oband.setFldStrValue(nRowIndex,xf,ov);
            oband.setFldStrValue(iRowIndex,xf,nv);
        }
    }
	
    function _setExchange(oband,_RowIndex,_f,_v)
    {
        return function()
        {
            x_setExchange(oband,_RowIndex,_f,_v);
        }
    }

    function x_setExchange(oband,_RowIndex,_f,_v)
    {
        oband.setFldStrValue(_RowIndex,_f,_v);
    }


	
	//direct -1 向下，1向上移
	function ue_move(xmlID,direct)
	{
	
	    var oband=GridUtil.FindBand(xmlID);
	    if(!oband)   return;
		if(!direct) direct = 1;
	    var iRowIndex = parseInt(oband.getFldStrValue("RowNum"))-1;
	    var icell=1;
	    if(oband.Grid.curTd!=null) 
	        icell = oband.Grid.curTd.cellIndex;
	    if(direct==1)
		    if(iRowIndex==0) return;
		 if(direct==-1)
	    	if(iRowIndex==(oband.RecordCount()-1)) return;
   
	    
	    var nRowIndex = iRowIndex - direct;
	    for(var i=0;i<oband.XmlLandData.recordset.Fields.Count-1;i++)
	    {
	        var fn = oband.XmlLandData.recordset.Fields(i).Name;
	        if(fn=="RowNum") continue;
	        exchangeOther(oband,nRowIndex,iRowIndex,fn);        
	    }
		oband.setCurrentRow(nRowIndex);
		
		var cell = oband.Grid.Table.rows[nRowIndex].cells[icell];
		oband.Grid.setActiveCell(cell);
	}    

	function ue_copy(xmlID)
	{
	    var oband=GridUtil.FindBand(xmlID);
	    if(!oband)   return;
	    oband.copyindex = oband.getCurrentRow();
	}    

	function ue_paste(xmlID)
	{
	    var oband=GridUtil.FindBand(xmlID);
	    if(!oband || oband.copyindex==null)   return;
	    ue_bandadd();
	    for(var i=0;i<oband.XmlLandData.recordset.Fields.Count-1;i++)
	    {
	        if(oband.nocopys) oband.nocopys = ","+oband.nocopys+",";
	        var fn = oband.XmlLandData.recordset.Fields(i).Name;
	        if(fn=="RowNum" || fn==oband.keyCol || oband.nocopys.indexOf(","+fn+",")>-1) continue;
	        
	        var ov=oband.getFldStrValue(fn,oband.copyindex);
	        if(oband.getFldStrValue(fn)=="")
	            oband.setFldStrValue(null,fn,ov);
	    }
	    return true;
	}    
function Xent(o)
{
    var es = "";
    if(!event) es = o?o.src:"";
    else es = event.srcElement;
    return es;
}
//以编号作为主删除键
function ue_deleteitem(xmlID,refresh,o)
{
    
    var es = Xent(o);
    if(es.innerText=="" || es.innerText=="　") return;
    GridUtil.usOnCellRFocusHandle(o);
	var band=GridUtil.FindBand(xmlID,o);
	var str=band.getFldStrValue("名称");
	if(str!="") str="【"+str+"】";
	var result = confirm(" 是否删除选择的"+str+"记录 ?     ");
	if(!result) return;
	if(!band)   return;
	ue_cmd("deleteitem",null,null,null,o);
	if(!band.Grid)
	{
		band.DeleteRecord();
		return;
	}
	if(band.Grid.Table.rows.length<1)
		return;
	grid=band.Grid;
	if(!grid.curTd)
		curTd=ToolUtil.getCtrlByTagD(false,grid.Table,"TD","colname");
	else
		curTd=grid.curTd;
	var cellIndex=curTd.cellIndex;
	//找到删除后焦点的当前行
	var curTrNew=null;
	for(var i=grid.Table.rows.length-1;i>-1;i--)
	{
		var row=grid.Table.rows[i];
		if(!curTrNew && true==row.isSelected)
		{	
			if(i<grid.Table.rows.length-1)
			{
				curTrNew=grid.Table.rows[i+1];
				break;
			}
			curTrNew=row;
		}else if(curTrNew && !row.isSelected)
		{
			curTrNew=row;
			break;
		}
	}
	grid.DelRowSelected();
	if(!curTrNew)	return;
	var curTd=curTrNew.cells[cellIndex];
	grid.setActiveCell(curTd);
	grid.setFocus();
	if(refresh) band.Query();
	return;
}

function ue_refresh(item)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var xmldoc=$U().ParamXmldoc;
    if(item) var oband=$band(item);
    else var oband=GridUtil.FindBand();
    if(oband) ToolUtil.setParamValue(xmldoc, "Filter", "", "", "P", oband.ItemName, "C","M");
	if($U())
		$U().Query();
    ctrlsrc.disabled=false;
    document.isPost=null;
}
function ue_reQuery(item)
{
    if("function"==typeof(ts_BeforeQuery))
        ts_BeforeQuery();
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var xmldoc=$U().ParamXmldoc;
    if(item) var oband=$band(item);
    else var oband=GridUtil.FindBand();
    if(oband) {ToolUtil.setParamValue(xmldoc, "Filter", "", "", "P", oband.ItemName, "C","M");
    oband.XQuery(true);
    };
    if("function"==typeof(ts_AfterReQuery))
        ts_AfterReQuery(oband);
    ctrlsrc.disabled=false;
    document.isPost=null;
}

function ValidatityFocus(oMsg)
{
	var pos1 = oMsg.indexOf("[");
	if(pos1>-1)
	{
	    var pos2 = oMsg.indexOf("]");
	    var alertfield = oMsg.substring(pos1+1,pos2);
	    var _objs = document.getElementsByTagName("INPUT");
	    var _nofield = true;
	    if(_objs)
	    {
	        for(var i=0;i<_objs.length;i++)
	        {
	            if(_objs[i].dataFld==alertfield) 
	            {
	                try{
	                _objs[i].focus();   //.fireEvent("onfocus");
	                }catch(ex){break;}
	                _nofield = false;
	                break;
	            }
	        }
	    }
	    if(_nofield)
	    {
	        _objs = document.getElementsByTagName("SELECT");
	        if(_objs)
	        {
	            for(var i=0;i<_objs.length;i++)
	            {
	                if(_objs[i].dataFld==alertfield) 
	                {
	                    _objs[i].focus();
	                    _nofield = false;
	                    break;
	                }
	            }
	        }		        
	    }
	}
}

function ws_location(item,keytable)
{
	var oband = $U().getBandByItemName(item);
	var xmldoc=oband .UnitItem.ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "islocation", "1", "s", "P", "", "Ts","");
	ue_tfilter(item,keytable);
}

//创建xmlhttp对象
function CreateHTTP()
{
    var arr_t = new Array("Microsoft.XMLHTTP", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.2.6", "MSXML.XMLHTTP");
    for (var i=0; i<arr_t.length; i++)
    {
        try
        {
            return(new ActiveXObject(arr_t[i]));
        }catch(e)
        {}
    }
    return(null);
} 

function ue_navrun(ism)
{
    if(!ism)
    {
        var _ismodify = $U().IsModify();
	    if(_ismodify==true)
	    {
		    var result = confirm(" 数据已修改，是否放弃修改 ? ");
		    if(!result) return;	          
	    }
	}
    parent.parent.openBusinessNav();
}			

function ue_downval(objname)
{
    var obj= document.getElementById(objname);
    var val = (obj.value=='')?'0':obj.value;
    if(parseInt(val)<2) return;
    obj.value=parseInt(val)-1;
}
function ue_upval(objname)
{
    var obj= document.getElementById(objname);
    var val = (obj.value=='')?'0':obj.value;
    if(parseInt(val)>5) return;
    obj.value=parseInt((obj.value=='')?'0':obj.value)+1;
}

function ue_selectAll(item,chkbox)
{
	SelectAllRows(item,chkbox);
}
function ClearSelAll(item) 
{
	var myUnitItem=$U();
	var band=null;
	if(item) band=myUnitItem.getBandByItemName(item)
	else band=myUnitItem.getActiveBand();
	if(!band)	return;
	if(!band.Grid)	return;
	if(ue_checking(band,0)) return;
	var grid=band.Grid;
	if(band.XmlLandData && band.XmlLandData.XMLDocument && band.XmlLandData.XMLDocument.documentElement.childNodes.length>0)
		var root=band.XmlLandData.XMLDocument.documentElement;
	for(var i=0;i<grid.Table.rows.length;i++)
	{
		grid.setSelectedRow(i,false,false);
		if(root && root.childNodes.length>0)
		{
			root.childNodes[i].attributes.removeNamedItem("selected");
			grid.setRowChecked(grid.Table.rows[i]);
	    }
	}
	
	return;
}

function SelectAllRows(item,chkbox) 
{
	var myUnitItem=$U();
	var band=null;
	if(item) band=myUnitItem.getBandByItemName(item)
	else band=myUnitItem.getActiveBand();
	if(!band)	return;
	if(!band.Grid)	return;
	if(band.RecordCount()==0) {alert("没有数据可供选择！");return;}
	if(ue_checking(band,1)) return;
	var grid=band.Grid;
	if(band.XmlLandData && band.XmlLandData.XMLDocument && band.XmlLandData.XMLDocument.documentElement.childNodes.length>0)
		var root=band.XmlLandData.XMLDocument.documentElement;
    var chkcols=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name='选择']")
	for(var i=0;i<grid.Table.rows.length;i++)
	{
		//grid.setSelectedRow(i,true,false);
		if(root && root.childNodes.length>0 && chkcols && isCheckbox(grid.Table.rows[i]))
		{
			root.childNodes[i].setAttribute("selected",true);
			grid.setRowChecked(grid.Table.rows[i]);
	    }
	}
	
	return;
}
//查是否有checkbox
function isCheckbox(tr)
{
    var ctrlCheck=ToolUtil.getCtrlByTagD(false,tr,"INPUT",'datatype','selectrow');
    if(!ctrlCheck || "checkbox"!=ctrlCheck.type)
        return false
    return true;
}

function RSelectAllRows(item) 
{
	var myUnitItem=$U();
	var band=null;
	if(item) band=myUnitItem.getBandByItemName(item)
	else band=myUnitItem.getActiveBand();
	if(!band)	return;
	if(!band.Grid)	return;
	if(band.RecordCount()==0) {alert("没有数据可供选择！");return;}
	if(ue_checking(band)) return;
	var grid=band.Grid;
	if(band.XmlLandData && band.XmlLandData.XMLDocument && band.XmlLandData.XMLDocument.documentElement.childNodes.length>0)
		var root=band.XmlLandData.XMLDocument.documentElement;
    var chkcols=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name='选择']")
	for(var i=0;i<grid.Table.rows.length;i++)
	{
		//grid.setSelectedRow(i,true,false);
		if(root && root.childNodes.length>0 && chkcols && isCheckbox(grid.Table.rows[i]))
		{
		    if(root.childNodes[i].attributes.getNamedItem("selected") && root.childNodes[i].attributes.getNamedItem("selected").text=="-1")
			    root.childNodes[i].setAttribute("selected",false);
			else
			    root.childNodes[i].setAttribute("selected",true);
			grid.setRowChecked(grid.Table.rows[i]);
	    }
	}
}

function ue_checking(band,state)
{
	var chkcols=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name='选择']");
	if(chkcols && chkcols.length>0) {
	    for(var i=0;i<band.RecordCount();i++)
	    {
	        if(state||0===state)
	            band.setFldStrValue(i,"选择",state);
	        else
	        {
	            var _v = band.getFldStrValue("选择",i);
	            if(_v=="" || _v=="0") _v=1
	            else _v = 0;
	            band.setFldStrValue(i,"选择",_v);
	        }
	    }
	    return true;
	}
}
//通用定制查询
//定义规则：
//在查询值的控件上指定下列值：
// name="字段名",filter="or"(关系式，或者'and'),value为查询的值,datatype=字段类型(number,char,varchar,string,date,datetime)
// exp :>,<,=,<>,%
//itemname为空时，只输入构成的字符串
function ue_tfilter(itemname,srcEle)
{
	//以拼音变量命名控件值
	var vals		= new Array();
	var names		= new Array();
	var rels		= new Array();
	var datatypes	= new Array();
	var exps		= new Array();
	var signs		= new Array();
	var strgroup = "";
	var strname="";
	var strval ="";
	if(!srcEle || srcEle=="undefined")
	    srcEle=event.srcElement;
	//var tab = document.getElementById("tabfilter")
	if(srcEle.tagName=="TABLE") var tab=srcEle;
	else var tab=ToolUtil.getCtrlByTagU(false,srcEle,"TABLE");
	if(!tab) return;
	var k=0;
	for(var i=0;i<tab.all.length;i++)
	{
	    var ctrl = tab.all[i];
	    if(!ctrl && ctrl.tagName!="INPUT" && ctrl.tagName!="SELECT" && ctrl.tagName!="CHECKBOX" &&
	        (!ctrl.name || ctrl.name=="") || ctrl.type=="radio" ) continue;
	    if(ctrl && ctrl.type!="button" && ctrl.name!='' && ctrl.name!='undefined' 
	        && (ctrl.tagName=="SELECT"  || ctrl.tagName=="INPUT" || ctrl.tagName=="CHECKBOX"))
	    {
		    
		    if(ctrl.type=="checkbox")
		    {
			    if(ctrl.checked)
			    {
			        names[k]= ctrl.name;
				    vals[k] = '1';//'true';
				}
			    else
			    {
			        continue;
			    	//vals[k] = '0';//'false';
			    }
		    }
		    else
		    {
		        if(ctrl.datafld && ctrl.datafld!="")
		            vals[k] = ctrl.datafld;
		        else
		            vals[k] = ctrl.value;
		    }
		    names[k]= ctrl.name;
		    if(ctrl.filter==null || ToolUtil.Trim(ctrl.filter)=="") rels[k] = "or";
		    else rels[k]= ctrl.filter;
			
		    rels[k] = ToolUtil.Trim(rels[k]);
		    rels[k] = " " + rels[k] +" ";
			
		    if(ctrl.exp==null || ToolUtil.Trim(ctrl.exp)=="") exps[k] = "";
		    else exps[k]= ctrl.exp;
			
		    exps[k] = ToolUtil.Trim(exps[k]);
		    exps[k] = exps[k].toLowerCase();

		    if(ctrl.datatype==null || ToolUtil.Trim(ctrl.datatype)=="") datatypes[k] = "string";
		    else datatypes[k] = ctrl.datatype;
		    k=k+1;
	    }
	}
	
	var str = "";
	for(var i=0;i<vals.length;i++)
	{
		switch(datatypes[i])
		{
			case "string"	:
			case "char"		:
			case "varchar"	:
				if(vals[i]=="") break;
				if(exps[i]!="")
				{
					if(exps[i]=='like')
					{
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					        {
                	            if(isgroupstr(vals[i])>1)
					            {
					                strgroup = getgroupstr(arrs[_m],vals[i]);
    					            _str = _str +  strgroup + " or " 
					            }
					            else
    					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
					        }
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					            
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
						{
                	        if(isgroupstr(vals[i])>1)
					        {
					            strgroup = getgroupstr(names[i],vals[i]);
					            str = str + rels[i] + strgroup; 
					        }
					        else
    				            str = str + rels[i] + names[i] + " like '%" + vals[i] + "%'"; 
						}
					}
					else
					{
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					        {
                	            if(isgroupstr(vals[i])>1)
					            {
					                strgroup = getgroupstr(arrs[_m],vals[i]);
    					            _str = _str +  strgroup + " or " 
					            }
					            else
    					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
					        }
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					            
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
                	        if(isgroupstr(vals[i])>1)
					        {
					            strgroup = getgroupstr(names[i],vals[i]);
					            str = str + rels[i] + strgroup; 
					        }
					        else str = str + rels[i] + names[i] + exps[i] + "'"+vals[i] + "'"; 
					}
				}else
				{					    
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					        {
                	            if(isgroupstr(vals[i])>1)
					            {
					                strgroup = getgroupstr(arrs[_m],vals[i]);
    					            _str = _str +  strgroup + " or " 
					            }
					            else
    					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
					        }
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					            
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
                	        if(isgroupstr(vals[i])>1)
					        {
					            strgroup = getgroupstr(names[i],vals[i]);
					            str = str + rels[i] + strgroup; 
					        }
					        else
    				            str = str + rels[i] + names[i] + " like '%" + vals[i] + "%'"; 
						
				}
				strname = strname + "," + names[i];
				strval	= strval + "," + vals[i];
				break;
			case "number"	:
			case "num"		:
			case "float"	:
			case "money"	:
			case "decimal"	:
			case "double"	:
			case "int"		:
				if(vals[i]=="") break;
				if(exps[i]!="")
				{
					str = str + rels[i] + names[i] + exps[i] + vals[i] + "";
				}
				else
				{
					str = str + rels[i] + names[i] + "=" + vals[i] + "";
				}
				strname = strname + "," + names[i];
				strval	= strval + "," + vals[i];
				break;
			case "date"		:
			case "datetime"	:
				if(vals[i]=="") break;
				var arr = vals[i].split("-");
				if(arr.length==3)
				{
				    if(arr[1].length==1)
				    {
				        arr[1]="0"+arr[1];
				        vals[i] = arr[0]+"-"+arr[1]+"-"+arr[2];
				    }
				}
				if(exps[i]!="")
				{
				    if(exps[i]=="<=") vals[i]=vals[i]+" 23:59:59.997";
				    else if(exps[i]==">=") vals[i]=vals[i]+" 00:00:01";
					str = str + rels[i] + names[i] + exps[i] +" '"+ vals[i] + "'";
				}
				else
					str = str + rels[i] + names[i] + " = '" + vals[i] + "'";
				strname = strname + "," + names[i];
				strval	= strval + ",'" + vals[i]+"'";
				break;
			default:
				if(vals[i]=="") break;
				
				if(exps[i]!="")
				{
					if(exps[i]=='like')
					{
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					        
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
						    str = str + rels[i] + names[i] + " like '%" + vals[i] + "%'"; 
					}
					else
					{
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					        
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
						    str = str + rels[i] + names[i] + " like '%" + vals[i] + "%'"; 
					}
				}else
				{
					    var arrs=names[i].split(";");
					    if(arrs.length>1)
					    {
					        var _str = "";
					        for(var _m=0;_m<arrs.length;_m++)
					            _str = _str +  arrs[_m] + " like '%" + vals[i] + "%' or " 
	                        if(_str && ""!=_str && _str.length>2)
		                        _str = " "+_str.substr(0,_str.length-3);					        
					        str = str + rels[i] +"(" +  _str + ")";
						}
						else
						    str = str + rels[i] + names[i] + " like '%" + vals[i] + "%'"; 
				}
				strname = strname + "," + names[i];
				strval	= strval + "," + vals[i];
				break;
		}
	}
	if(str && ""!=str && str.length>2)
		str = " "+str.substr(4,str.length-3);
	
	if(strname && strname!="")
		strname = strname.substr(1,strname.length-1);
	if(strval && strval!="")
		strval = strval.substr(1,strval.length-1);
	
	if(str=="") str="2>0";
	if($("antichk") && $("antichk").checked)
	{
	    str = str.replaceAll("like","!=");
	    str = str.replaceAll("'%","'");
	    str = str.replaceAll("%'","'");
	    str = str.replaceAll("or","and");    
	}
	
    str=str.replaceAll(" like '%未分类%'"," is null");
    str=str.replaceAll(" like '%空%'"," is null");
    str=str.replaceAll(" like '%null%'"," is null");
    str=str.replaceAll(" = '未分类'"," is null");
    str=str.replaceAll(" = '空'"," is null");
    str=str.replaceAll(" = 'null'"," is null");
    str=str.replaceAll("&&"," ");
    if(!itemname) return str;
    else
	    usfiltercmd(str+";"+strname + ";" +strval + "：" + itemname);
}
// 执行过滤
function usfiltercmd(strfilter)
{
    var arryStr=strfilter.split("：");
    if(arryStr.length<2)    return;
    var arrFilter=arryStr[0].split(";");
    if(arrFilter.length<1)  return;
    var band=$U().getBandByItemName(arryStr[arryStr.length-1]);
    if(!band)   return;
	if(band.IsModify()) 
	    if(confirm(" 数据已经修改,是否保存?   "))
	    {
	        var strResult=band.UnitItem.saveData();
            var success=ToolUtil.valueTag(strResult,"成功");
            if("true"==success)
                alert("保存成功!");
            else{
                alert(ToolUtil.valueTag(strResult,"提示"));
                return;
            }
	    }
	ueSetPage(arrFilter[0],band);
    band.XQuery(true);
    //ueBindGrid(band);
    return;
}

function ueSetPage(strf,ob)
{
	var xmldoc=$U().ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "Filter", strf, "", "P", ob.ItemName, "C","M");
	var iPageSize=ToolUtil.Convert(ob.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	ToolUtil.setParamValue(xmldoc, "FirstRow", 0, "P", "", ob.ItemName, "C","M");
	ToolUtil.setParamValue(xmldoc, "LastRow", iPageSize, "", "P", ob.ItemName, "C","M");
    ob.setFldSumStrValue("PageIndex",1);
}
//function ueBindGrid(ob)
//{
//	if(ob.noxml && ob.Grid && ob.Grid.GridDiv.parentElement){ ob.StrongGrid=true;
//    var oGrid  = new XGrid(ob.Grid.GridDiv.parentElement.id,ob,"in",ob.check,1,null); }
//    else if(ob.changeGrid){ob.StrongGrid=true;
//        var oGrid  = new XGrid(ob.Grid.GridDiv.parentElement.id,ob,"in",ob.check,1,null); }
//}
function ue_pfilter(item,str)
{
    if(!str) str="";
    var ob = $band(item);
    var xmldoc=$U().ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "Filter", str, "", "P", item, "C","M");
    ob.XQuery(true);
    return;
}

function isgroupstr(strval)
{
    var str=["   ", ",", "，", ";", "；", "　", "\\+", " \\+ ", " \\+", "\\+ "];
    for(var i=0;i<str.length;i++)
        strval=strval.replaceAll(str[i], " ");
    var strExpr="";
    var arrs=strval.split(" ");
    return arrs.length;
}
function getgroupstr(strname,strval)
{
    var str=["   ", ",", "，", ";", "；", "　", "\\+", " \\+ ", " \\+", "\\+ "];
    for(var i=0;i<str.length;i++)
        strval=strval.replaceAll(str[i], " ");
    var strExpr="";
    var arrs=strval.split(" ");
    for(var i=0;i<arrs.length;i++)
    {
       if(arrs[i].Trim().length>0)
       {
        strExpr = strExpr + " or " + strname + " like '%" + arrs[i].Trim()  + "%' "
       }
    }   
    if(strExpr=="") return;
    if(strExpr.length>2) 
    strExpr = " "+strExpr.substr(4,strExpr.length-3);
    if(strExpr=="") return;

    strExpr = " ("+strExpr+")";
    if(strval=="") return;
    return strExpr;
}

//写radio选项字段
function ue_radiowrite(oband)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost) return;
    if(!oband) 
        oband = $band(ctrlsrc.band);
    if(!oband){alert("未设置Band,请检查!");return;}
    if(!ctrlsrc.field)
        var fld = ctrlsrc.name;
    else 
        var fld = ctrlsrc.field;
    if(ctrlsrc.name.indexOf(oband.ItemName+":")>-1)
        fld=fld.substring(ctrlsrc.name.indexOf(oband.ItemName+":")+oband.ItemName.length+1,fld.length);
    oband.setFldStrValue(null,fld,ctrlsrc.value);
}
//读radio选项字段:条件为name,value
function ue_radioread(oband,objId)
{
    //value="低" name="热度"
    var ctrlsrc=$(objId);
    if(!ctrlsrc) return;
    if(!oband) oband = $band(ctrlsrc.band);
    var fld = ctrlsrc.name;
}
