// JScript source code
//GridUtil分为两个文件组成:GridUtilXSLT.js 和 GridUtilFun.js

//输入模板辅助控件的事件

if(!GridUtil)
    var GridUtil=new Object();

//根据名称获取Grid对象
GridUtil.getGridByName=function(gridName)
{
	var gridList=document.GridList;
	if(!gridList)	return null;
	for(var i=0;i<gridList.length;i++)
	{
		if(!gridList[i])	continue;
		if(gridName==gridList[i].gridName && gridList[i].GridDiv)
			return gridList[i].GridDiv.Grid;
	}
	return null;
}

GridUtil.usOnCellClickHandle=function()
{
    GridUtil.usOnCellFocusHandle();
}

//单元格值改变事件;	event.srcElement.oldValue是原来值;event.srcElement.value是当前值
//return false 取消值改变;焦点不能离开;布尔类型的check字段不控制
GridUtil.usOnCellChangeHandle=function()
{
	if(!event.srcElement.colname)
		return true;
	var inputctrl=event.srcElement;
	var tabDetail=ToolUtil.getCtrlByTagU(false,inputctrl,"TABLE","tabType","detail");
	var trcur=ToolUtil.getCtrlByTagU(false,inputctrl,"TR","rowType","detail");
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	if(band.XmlSchema.ctrlAlert && ""!=band.XmlSchema.ctrlAlert)
		var ctrlAlert=$(band.XmlSchema.ctrlAlert);
	if(!ctrlAlert && band.Grid)
		ctrlAlert=band.Grid.CtrlMsg;
	var strAlertMsg = band.CalXmlLand.ValidateCell(trcur.recordNumber-1,inputctrl.colname,inputctrl.value);
	if(!strAlertMsg)
	{
	    ToolUtil.sleep(2);
	    strAlertMsg = band.CalXmlLand.ValidateCell(trcur.recordNumber-1,inputctrl.colname,inputctrl.value);
	 }
	if(ctrlAlert)
	{
		if("INPUT"==ctrlAlert.tagName)
			ctrlAlert.value=(""==strAlertMsg)?"":strAlertMsg;
		else 
			ctrlAlert.innerHTML=(""==strAlertMsg)?"":strAlertMsg;
	}
	if(strAlertMsg && strAlertMsg.length>0)
		return	false;
	return true;
}


//可编辑单元格得到焦点时
GridUtil.msOnCellFocusHandle=function()
{
    this.usOnCellFocusHandle();
     if("function"==typeof(msInitGridOps)) msInitGridOps();
}

//可编辑单元格得到焦点时
GridUtil.usOnCellFocusHandle=function()
{
    //gshowModalDialogReturn 为打开模态窗口并返回后的标志,如果在模态窗口中有对父窗口band进行行的移动操作，则将此标志置1
    if(gshowModalDialogReturn)
        if(gshowModalDialogReturn==1) {gshowModalDialogReturn=0; return;}
    
	var inputctrl=event.srcElement;
	//设置当前行当前单元格
	var tdcol = ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	if(document.srcTd && document.srcTd != tdcol)
	{
	    var ctrlList=document.srcTd.childNodes;
	    for(var i=0;ctrlList && i<ctrlList.length;i++)
	    {
		    if("disp"==ctrlList[i].optype)
			    ctrlList[i].style.display="";
		    if("edit"==ctrlList[i].optype && !ctrlList[i].alone)
		    {
//		        if(ctrlList[i].style.display=="")
//                    event.srcElement.style.pixelWidth=event.srcElement.style.pixelWidth+ctrlList[i].size;
		        ctrlList[i].style.display="none";
		    }
	    }	    
	}
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	try{
		if("INPUT"==inputctrl.tagName && "click"!=event.type)
			inputctrl.select();
	}catch(ex){return;}

	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	var band=document.UnitItem.getActiveBand();
	tabDetail.Grid.setActiveCell(tdcol);
	if(band.Tree)
	{
	    var rowIndex = trcur.recordNumber-1;
	    if(band.RecordCount()<1)
		    return;
	    var root=band.XmlLandData.XMLDocument.documentElement;
	    if(null==rowIndex)
		    rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	    if(rowIndex>=root.childNodes.length || rowIndex<0)
		    return ;
        var nodeid=band.getFldStrValue(band.Tree.IDField,rowIndex);
        band.Tree.WebTree.SelectNodeById(nodeid);
        //var trvNode=band.Tree.getTrvNodeByID(nodeid);
        //if(trvNode) band.Tree.WebTree.set_selectedNode(trvNode); //trvNode.setSelected(true);
	}
	//是否做行权限控制
	var readOnly=null;
	if(band.RightCol && ""!=band.RightCol)
	{
        var readOnly=band.getExpValue(band.RightCol,trcur.recordNumber-1);
        readOnly=ToolUtil.Convert(readOnly,"bool");
    }
    
    
    //是否做列的读写判断
    if(true!=readOnly)
    {
        var	strXPath="//xs:element[@name='"+inputctrl.colname+"' or @formatfld='"+inputctrl.colname+"']";
        var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
        if(xmlCol!=null)
        {
            var expression=xmlCol.getAttribute("expright");
            if(expression && ""!=expression)
            {
                readOnly=band.getExpValue(expression,trcur.recordNumber-1);
                readOnly=ToolUtil.Convert(readOnly,"bool");
            }
        }
    }
    
    
    if(true==readOnly)
    {
        if("INPUT"==inputctrl.tagName && ( "checkbox"==inputctrl.type || "radio"==inputctrl.type) )
            inputctrl.disabled=true;
        else if("SELECT"==inputctrl.tagName)
            inputctrl.disabled=true;
        else
            inputctrl.readOnly =true;
        if(!inputctrl.fireRd)
        {
		    inputctrl.fireRd=true;
		    inputctrl.fireEvent("onfocus");
		}else
		    inputctrl.fireRd=null;
        return;
    }else{
        if("INPUT"==inputctrl.tagName && ( "checkbox"==inputctrl.type || "radio"==inputctrl.type))
            inputctrl.disabled=null;
        else if("SELECT"==inputctrl.tagName)
            inputctrl.disabled=null;
        else
            inputctrl.readOnly =null;
    }

	if(inputctrl.formatfld && "select"!=inputctrl.datatype && "selectbtn"!=inputctrl.datatype && inputctrl.tagName!="SPAN")
	{
		inputctrl.dataFld=inputctrl.colname;
		if("click"!=event.type)
		    inputctrl.select();
	    ;
	}
	if("date"==inputctrl.datatype && inputctrl.tagName!="SPAN")
	{
		ToolUtil.sleep(2);
		WebCalendar.format="yyyy-mm-dd";
		calendar();	
	}
	if("time"==inputctrl.istime)
	{
		ToolUtil.sleep(2);
		XTime();
	}
	
	//根据optype属性设置风格
	var tdcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var ctrlList=ToolUtil.getCtrlListByNameD(false,tdcur,'optype');
	for(var i=0;ctrlList && i<ctrlList.length;i++)
	{
		if("disp"==ctrlList[i].optype)
			ctrlList[i].style.display="none";
		if("edit"==ctrlList[i].optype)
		{
//		    if(ctrlList[i].style.display=="none")
//		        event.srcElement.style.pixelWidth=event.srcElement.style.pixelWidth-ctrlList[i].size;
			ctrlList[i].style.display="";
			if("SELECT"==ctrlList[i].tagName)
				inputctrl=ctrlList[i];
		}
		ctrlList[i].valueold=ctrlList[i].value;
	}
	inputctrl.valueold=inputctrl.value;
	if("INPUT"==inputctrl.tagName && "none"!=inputctrl.style.display)
	{
		ToolUtil.sleep(50);
		if("click"!=event.type)
		    inputctrl.select();
	}else if("SELECT"==inputctrl.tagName)
		inputctrl.setActive();

//    if(inputctrl.nextSibling && inputctrl.nextSibling.type=="button" 
//            && inputctrl.nextSibling.style.display=='') inputctrl.style.width="80%";
//    if(inputctrl.nextSibling && inputctrl.nextSibling.type=="button" 
//            && inputctrl.nextSibling.style.display=='none') inputctrl.style.width="100%";
	return;

	
}
//只读单元格得到焦点时
GridUtil.usOnCellRFocusHandle=function(o)
{
    var inputctrl,inputtype;
    if(!event) {inputctrl = o.src;inputtype=o.type}
    else {inputctrl = event.srcElement;inputtype=event.type}
	//设置当前行当前单元格
	var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");

	try{
		if("INPUT"==inputctrl.tagName && "click"!=inputtype)
			inputctrl.select();
	}catch(ex){return;}
    if(!tabDetail) return;
	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	var band=document.UnitItem.getActiveBand();
	//设置当前单元格
	tabDetail.Grid.setActiveCell(tdcol);
	//根据optype属性设置风格
	var ctrlList=ToolUtil.getCtrlListByNameD(false,tdcol,'optype');
	for(var i=0;ctrlList && i<ctrlList.length;i++)
	{
		if("disp"==ctrlList[i].optype)
			ctrlList[i].style.display="none";
		if("edit"==ctrlList[i].optype)
			ctrlList[i].style.display="";
	}
	return;
}

//单选按钮选择
GridUtil.usOnCellRadioClickHandle=function()
{
	var inputctrl=event.srcElement;
	//设置当前行当前单元格
	var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	if("function"==typeof(usSetGridNameActivate))
        usSetGridNameActivate(tabDetail.Grid.Name);
	var band=document.UnitItem.getActiveBand();
	//设置当前单元格
	tabDetail.Grid.setActiveCell(tdcol);
    var irow=trcur.recordNumber-1;
    var irowcount=band.RecordCount();
    for(var i=0;i<irowcount;i++)
    {
        var strvalue=band.getFldStrValue(inputctrl.colname,i);
        var isselect=ToolUtil.Convert(strvalue,"bool");
        if(irow!=i && (strvalue==inputctrl.value || true==isselect))
            band.setFldStrValue(i,inputctrl.colname,"false");
    }
    band.setFldStrValue(irow,inputctrl.colname,"true");
	//设置级联更新
	band.setSelectContent(inputctrl.colname,trcur.recordNumber-1);
	//当前行计算
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=trcur.recordNumber-1;
	band.Event.colName=inputctrl.colname;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
}
//点击图片单元格
GridUtil.usOnCellImgClickHandle=function()
{
	var inputctrl=event.srcElement;
	//设置当前行当前单元格
	var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	var band=document.UnitItem.getActiveBand();
	//设置当前单元格
	tabDetail.Grid.setActiveCell(tdcol);
	var imgfile=event.srcElement.src;
	if(!imgfile || ""==imgfile)	 return;
	if(imgfile.indexOf("?")<0)	return;
	imgfile=imgfile.replace('Thumb_','');
	open(imgfile,'_blank');
}
GridUtil.usOnCellLinkClickHandle=function()
{
	var inputctrl=event.srcElement;
	//设置当前行当前单元格
	var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	var band=document.UnitItem.getActiveBand();
	//设置当前单元格
	tabDetail.Grid.setActiveCell(tdcol);
	if(!inputctrl.innerText || ""==inputctrl.innerText)
		return;
	band.setModalContent(inputctrl.innerText);
}
GridUtil.usOnCellLinkDHandle=function(tabid)
{
	var inputctrl=event.srcElement;
	//设置当前行当前单元格
	var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	document.UnitItem.setActiveBand(tabDetail.Grid.ItemName);
	var band=document.UnitItem.getActiveBand();
	//设置当前单元格
	tabDetail.Grid.setActiveCell(tdcol);
	ControlUtil.ChangeTabs(tabid);
	if(true==band.ManualRefresh)
	    band.ManualFilterDatail();
}

//双击单元格弹出模式窗口
GridUtil.usOnCellDbClickHandle=function()
{
	var inputctrl=event.srcElement;
	if(!inputctrl.colname || ""==inputctrl.colname)
		return;
	try{
		if("INPUT"==inputctrl.tagName)
			inputctrl.select();
	}catch(ex){}
	//数据所在表格,及对应数据岛数据结构,列节点
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	//如果是备选项目
	if(band.exportItem && ""!=band.exportItem)
	{
	    band.ExportRow(band.exportItem);
	    for(var i=0;i<document.UnitItem.Bands.length;i++)
	    {
	        //找到主表为band.itemname的所有子表
	        var oband = document.UnitItem.Bands[i];
	        if(oband.MasterItemName==band.ItemName)
	        {
	            if(oband.exportItem && ""!=oband.exportItem)
	            oband.ExportRow(oband.exportItem);
	        }
	    }
	}
	if(band.replaceItem && ""!=band.replaceItem)
	{
	    band.ReplaceRow(band.replaceItem);
	}

	//如果是弹出的模式窗口;就对打开它的父窗口当前行更新赋值;
	//如果不是打开的模式窗口就打开模式窗口操作
	band.Event.colName=inputctrl.colname;
	band.Event.rowIndex=trcur.recordNumber-1;
	if(!window.dialogArguments)
	{
		var xmlNodeAppend=myUnitItem.XmlConf.XMLDocument.selectSingleNode("//AppendItem[@linkcol='"+inputctrl.colname+"']");
		if(!xmlNodeAppend)	
		{
		    band.FireEvent("DbClickHandle");return;
		}    
		band.setModalContent(xmlNodeAppend.getAttribute("name"));
		band.FireEvent("DbClickHandle");
		return;
	}else{
		var bandOpener=window.dialogArguments;
		if(!bandOpener)		{band.FireEvent("DbClickHandle");return;}
		var rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
		if(rowIndex<0 || rowIndex>=band.XmlLandData.XMLDocument.documentElement.childNodes.length)
			{band.FireEvent("DbClickHandle");return;}
		var xmlRow=band.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
		bandOpener.setRowValue(xmlRow);
		//band.UnitItem.CheckInParentUnit();
		band.FireEvent("DbClickHandle");
		return;
	}
}

//可编辑单元格失去焦点时
GridUtil.usOnCellBlurHandle=function()
{
    //取原始单元
	var inputctrl=event.srcElement;
	if(inputctrl.formatfld && "select"!=inputctrl.datatype && "selectbtn"!=inputctrl.datatype)
		inputctrl.dataFld=inputctrl.formatfld;
	var tdcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	//根据optype属性设置风格
	document.srcTd=tdcur;
	var ctrlList=ToolUtil.getCtrlListByNameD(false,tdcur,'optype');
	for(var i=0;ctrlList && i<ctrlList.length;i++)
	{
		if("disp"==ctrlList[i].optype)
			ctrlList[i].style.display="";
		if("edit"==ctrlList[i].optype)
		{
		    if(ctrlList[i].tagName=="SELECT" && !ctrlList[i].alone) 
		    {
		        ctrlList[i].style.display="none"
		    }
		    else
		    {   
		        if(document.srcTd!=tdcur)
		        {
			        ctrlList[i].style.display="none";
			    }
			}
		}
	}
    if(inputctrl.nextSibling && inputctrl.nextSibling.type=="button" 
            && inputctrl.nextSibling.style.display=='none') inputctrl.style.width="100%";
	
}
//编辑模板控件回车跳格
GridUtil.usOnCtrlEnterTab=function()
{
	var inputctrl=event.srcElement;
	switch(event.keyCode)
	{
	    case 13:
	        if("TEXTAREA"==inputctrl.tagName)
	            return;
            event.keyCode=9;
            break;
	}
}
//Grid横向滚动时
GridUtil.usOnScrollHori=function()
{
	var  GridDiv=ToolUtil.getCtrlByTagU(true,event.srcElement,"TABLE");
	if(!GridDiv)	return;
	var  titleDiv=ToolUtil.getCtrlByTagD(false,GridDiv,"DIV","divtype","title");
	if(!titleDiv)	return;
	titleDiv.scrollLeft=event.srcElement.scrollLeft;
}

//鼠标滑过
GridUtil.usOnDetailMouseOverHandle=function()
{
	var the_obj = event.srcElement;
	var trcur= ToolUtil.getCtrlByTagU(true,the_obj,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,the_obj,"TABLE","tabType","detail");
	if(!trcur || !tabDetail.Grid)
		return;
	if(tabDetail.Grid.curTr && trcur==tabDetail.Grid.curTr)
		return;
	for(var i=0;i<trcur.cells.length;i++)
	{
		var cell=trcur.cells[i];
		if(!cell.className || "cellstyle"!=cell.className.toLowerCase())
			continue;
		tabDetail.Grid.setCtrlStateColor(cell,"mouseover");
	}

}
//鼠标离开
GridUtil.usOnDetailMouseOutHandle=function()
{
	var the_obj = event.srcElement;
	var trcur= ToolUtil.getCtrlByTagU(true,the_obj,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,the_obj,"TABLE","tabType","detail");
	if(!trcur)		return;
	if(trcur==tabDetail.Grid.curTr || true==trcur.isSelected)
		return;
	for(var i=0;i<trcur.cells.length;i++)
	{
		var cell=trcur.cells[i];
		if(!cell.className || "cellstyle"!=cell.className.toLowerCase())
			continue;
		tabDetail.Grid.setCtrlStateColor(cell,"browse");
	}
}

//点击行标
GridUtil.usOnRowcursorClickHandle=function()
{
	var trcur= ToolUtil.getCtrlByTagU(true,event.srcElement,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,event.srcElement,"TABLE","tabType","detail");
	tabDetail.Grid.setSelectedRow(trcur.rowIndex,!trcur.isSelected,false);
	
}
//设置数据岛段Band自定义模板关联字段值
GridUtil.setXmlDataFld=function(xmlland)
{
    if(!xmlland || !xmlland.itemname)
        return;
	var BandM=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!BandM || !BandM.XmlSchema)		return;
    var colList=BandM.XmlSchema.XMLDocument.selectNodes("//xs:element");
    for(var i=0;i<colList.length;i++)
    {
	    var columnName=colList[i].getAttribute("name");
	    var inputCtrlID=BandM.key+":"+columnName;
	    var oinput=$(inputCtrlID);
	    if(!oinput || !oinput.className)	continue;
	    var strvalue=BandM.getFldStrValue(columnName);
	    //上传文件及图片的字段;id=bandName+":"+columnName
	    if( !oinput.dataSrc || !oinput.dataFld || ""==oinput.dataSrc || ""==oinput.dataFld)
	    {
		    if(oinput.className.toLowerCase()=="xlandfile")
		    {
			    if(oinput.tagName=="DIV" || oinput.tagName=="A")
			    {
				    $(inputCtrlID).innerText=strvalue;
				    $(inputCtrlID).href = "../wfimg.aspx?img="+strvalue+"&type=ImgFilePath";
				    //wfImg.aspx?img=6ee530ad-f7e1-49ef-a2dc-26e03a494779.bak&type=ImgFilePath
				}
			    continue;
		    }
		    if(oinput.className.toLowerCase()=="xlandimg" && oinput.tagName=="IMG")
		    {
		        if(strvalue!="")
		        {
		            var _src = "../wfimg.aspx?img="+strvalue+"&size="+oinput.tag;
		            var s = (new   Date()).toString();
		            oinput.resized=true;
			        oinput.src=_src + "?"+ s;
			    }
			    else 
			    {
			        oinput.src="images//Floppy.gif";
			    }
			    continue;
		    }
		    if(oinput.className.toLowerCase()=="xlandradio" && oinput.tagName=="INPUT")
		    {
                var value = BandM.getFldStrValue(columnName);
                var chks = document.getElementsByName(inputCtrlID);
                for(var m=0;m<chks.length;m++)
                {
                    if(chks[m].value==value) 
                        {chks[m].checked=true;break;}
                    else chks[m].checked=false;
                }
			    continue;
		    }
	    }
    }//for(var i=0;
}
//行改变时触发,加载于数据岛事件或函数
GridUtil.usOnRowEnterHandle=function()
{
    GridUtil.setXmlDataFld(this);
	var xmlLandM=this;
	var myUnitItem=document.UnitItem;
	var BandM=myUnitItem.getBandByItemName(xmlLandM.itemname);
	if(!BandM) return;
	//明细过滤
	var xmldocParam=BandM.UnitItem.ParamXmldoc;
    var strvalue=BandM.getFldStrValue(BandM.linkColM);
    var rootM = BandM.XmlLandData.XMLDocument.documentElement;
	var rowIndex = BandM.XmlLandData.recordset.AbsolutePosition-1;
    var strRefreshForce = null;var strState="new";
    if(rowIndex>=0 && rowIndex<rootM.childNodes.length)
    {
        var strState=rootM.childNodes[rowIndex].getAttribute("state");
        strRefreshForce=rootM.childNodes[rowIndex].getAttribute("refreshforce");
    }
    //如果不为人工过滤，则关联子项目查询
	for(var i=0;!BandM.ManualRefresh && i<myUnitItem.Bands.length;i++)
	{
		var BandD = myUnitItem.Bands[i];
		if(BandM != BandD.getBandM())
		    continue;
	    //主表新记录,且该行不强制刷新,并且明细也不强制刷新,就只从过虑区查询数据
        RFDetail(BandD,xmldocParam,strState,strRefreshForce,strvalue);
	}
	BandM.prerow = BandM.Event.rowIndex;
	BandM.Event.rowIndex=xmlLandM.recordset.AbsolutePosition-1;
	BandM.FireEvent("AfterRowChanged");
}

function RFDetail(BandD,xmldocParam,strState,strRefreshForce,strvalue)
{
    //主表新记录,且该行不强制刷新,并且明细也不强制刷新,就只从过虑区查询数据
    if(BandD.XmlSchema)
        var iPageSize=ToolUtil.Convert(BandD.XmlSchema.pagesize,"int");
    if(null==iPageSize || isNaN(iPageSize))
        iPageSize=10;
    BandD.setFldSumStrValue("PageIndex",1);
    ToolUtil.setParamValue(xmldocParam, "FirstRow", 0, "", "B", BandD.ItemName, "C","M");
    ToolUtil.setParamValue(xmldocParam, "LastRow", iPageSize, "", "B", BandD.ItemName, "C","M");
	if(false==BandD.RefreshForce && "new"==strState && "true"!=strRefreshForce )
	    BandD.RefreshFilterFld(BandD.linkCol,strvalue);
	else
	{
        if(!BandD.ManualRefresh)
        {
            
            BandD.Refresh(BandD.linkCol,strvalue);
        }
	}
}
//行改变时触发,没有明细段
GridUtil.usOnRowEnter2Handle=function()
{
    GridUtil.setXmlDataFld(this);
	var xmlLandM=this;
	var myUnitItem=document.UnitItem;
	var BandM=myUnitItem.getBandByItemName(xmlLandM.itemname);
	if(!BandM || BandM.RecordCount()<1 )
		return;
    var xmldocParam=BandM.UnitItem.ParamXmldoc;
    ToolUtil.setParamValue(xmldocParam, "FirstRow", 0, "", "B", BandM.ItemName, "C","M");
    ToolUtil.setParamValue(xmldocParam, "LastRow", 10, "", "B", BandM.ItemName, "C","M");
	BandM.Event.rowIndex=xmlLandM.recordset.AbsolutePosition-1;
	BandM.FireEvent("AfterRowChanged");
}


//输入编辑模板控件获得焦点;
GridUtil.usOnCtrlFocusHandle=function()
{
	var srcEle=event.srcElement;
	if(!srcEle.dataSrc || !srcEle.dataFld || ""==srcEle.dataSrc || ""==srcEle.dataFld)
	{
        var classname = event.srcElement.className.toLowerCase();
	    if(classname.indexOf("xlanddate")>-1  && srcEle.tagName!="SPAN")
	    {
		    ToolUtil.sleep(2);
		    WebCalendar.format="yyyy-mm-dd";
		    calendar();
	    }
	    if("time"==srcEle.istime)
	    {
		    ToolUtil.sleep(2);
		    XTime();
	    }	    	    
		return;
	}
	var xmlLand=$(srcEle.dataSrc.substr(1));
	if(!xmlLand)	return;
	if(!document.UnitItem) return;
	var band=document.UnitItem.getBandByItemName(xmlLand.itemname);
	document.UnitItem.setActiveBand(xmlLand.itemname);
	if(!band || !band.XmlSchema || !band.XmlSchema.XMLDocument)
		return;
	//如果当前数据岛不包含该字段,首先赋初值
	var xmlNodeTest=band.XmlLandData.XMLDocument.selectSingleNode("/*/*/"+srcEle.dataFld);
	if(!xmlNodeTest && band.active==true)
	{
	    if(band.XmlLandData.recordset.RecordCount==0)
	        band.NewRecord();
		band.setFldStrValue(band.XmlLandData.recordset.AbsolutePosition-1,srcEle.dataFld,"");
    }
    if("INPUT"==srcEle.tagName)
        srcEle.select();
	//是否做权限控制
	var readOnly=null;
	if(band.RightCol && ""!=band.RightCol)
	{
        readOnly=band.getExpValue(band.RightCol,null);
        readOnly=ToolUtil.Convert(readOnly,"bool");
    }
    //是否做列的读写判断
    if(true!=readOnly)
    {
        var	strXPath="//xs:element[@name='"+srcEle.dataFld+"' or @formatfld='"+srcEle.dataFld+"']";
        var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
        if(xmlCol)
            var expression=xmlCol.getAttribute("expright");
        else
            var expression=null;
        if(expression && ""!=expression)
        {
            readOnly=band.getExpValue(expression,null);
            readOnly=ToolUtil.Convert(readOnly,"bool");
        }
    }
    if(true!=readOnly)
    {
        var	strXPath="//xs:element[@name='"+srcEle.dataFld+"' or @formatfld='"+srcEle.dataFld+"']";
	    var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	    if(xmlCol)
	        readOnly=xmlCol.getAttribute("isreadonly");
	}
	if(true==readOnly || "1"==readOnly)
	{
        if("INPUT"==srcEle.tagName && "checkbox"==srcEle.type)
            srcEle.disabled=true;
        else if("SELECT"==srcEle.tagName)
            srcEle.disabled=true;
        else
            srcEle.readOnly =true;
        if(!srcEle.fireRd)
        {
            srcEle.fireRd=true;
            srcEle.fireEvent("onfocus");
        } else
            srcEle.fireRd=null;
        return;
    }else{
        if("INPUT"==srcEle.tagName && "checkbox"==srcEle.type)
            srcEle.disabled=null;
        else if("SELECT"==srcEle.tagName)
            srcEle.disabled=null;
        else
            srcEle.readOnly =null;
    }
	
	//如果是有格式的字段,显示原值
	var	strXPath="//xs:element[@name='"+srcEle.dataFld+"' or @formatfld='"+srcEle.dataFld+"']";
	var xmlNodeCol=band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	if(!xmlNodeCol)		return;
	var formatFldName=xmlNodeCol.getAttribute("formatfld");
	var colname=xmlNodeCol.getAttribute("name");
	if(formatFldName && ""!=formatFldName && !srcEle.readOnly)
		srcEle.dataFld=colname;
	srcEle.onchange=GridUtil.usOnCtrlChangeHandle;
	var classname=srcEle.className.toLowerCase();
	if("INPUT"==srcEle.tagName && "text"==srcEle.type)
		srcEle.select();
	if(classname.indexOf("xlanddate")>-1 && srcEle.tagName!="SPAN")
	{
		ToolUtil.sleep(2);
		calendar();
	}

    if("time"==srcEle.istime)
    {
	    ToolUtil.sleep(2);
	    XTime();
    }
    //2012-06-09李
    if(srcEle.dataFld=="时间点T1"||srcEle.dataFld=="时间点T2"||srcEle.dataFld=="时间点T3"||srcEle.dataFld=="时间点T4"||srcEle.dataFld=="时间点T5"||srcEle.dataFld=="灯饰开始"||srcEle.dataFld=="灯饰结束")
    {
       ToolUtil.sleep(2);
	   XTime();
    }
	srcEle.valueold=srcEle.value;
	return;
}

//输入编辑模板控件失去焦点
GridUtil.usOnCtrlBlurHandle=function()
{
    if(!event) return;
	var srcEle=event.srcElement;
	if(!srcEle.dataSrc || !srcEle.dataFld || ""==srcEle.dataSrc || ""==srcEle.dataFld)
		return;	
	var xmlLand=$(srcEle.dataSrc.substr(1));
	if(!xmlLand)	return;
	if(!document.UnitItem) return;
	var band=$(xmlLand.itemname);
	if(!band || !band.XmlSchema || !band.XmlSchema.XMLDocument)
		return;
	//如果是有格式的字段,显示原值
	if("SELECT"==srcEle.tagName)	return;
	
	var	strXPath="//xs:element[@name='"+srcEle.dataFld+"' or @formatfld='"+srcEle.dataFld+"']";
	var xmlNodeCol=band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	if(!xmlNodeCol)		return;
	if(xmlNodeCol.getAttribute("dataitem") && xmlNodeCol.getAttribute("dataitem")!="") return;
	var formatFldName=xmlNodeCol.getAttribute("formatfld");
	var colname=xmlNodeCol.getAttribute("name");
	if(formatFldName && ""!=formatFldName)
		srcEle.dataFld=formatFldName;
}


//Grid列排序
GridUtil.usOnTitClick=function()
{
    var srcElem=event.srcElement;
    if(!srcElem || !srcElem.colname || ""==srcElem.colname)
        return;
	var tdcol=ToolUtil.getCtrlByTagU(true,srcElem,"TD","tdType","coltitle");
	var trTitle=ToolUtil.getCtrlByTagU(true,srcElem,"TR","rowType","title");
	var tabTitle=ToolUtil.getCtrlByTagU(true,srcElem,"TABLE","tabType","title");
	if(!tabTitle || !tdcol || !tabTitle.Grid)
	    return;
	if(tabTitle.Grid.Table.rows.length==0){alert("没有数据可以操作!");return;};
	if(tabTitle.Grid.Band.asc)
	    tdcol.asc = tabTitle.Grid.Band.asc;
	var ascdesc=(!tdcol.asc || "ascending"==tdcol.asc)?"descending":"ascending";
	tdcol.asc=ascdesc;
	tabTitle.Grid.Band.asc = ascdesc;
	tabTitle.Grid.Sort(srcElem.colname,null,tdcol.asc);
    if(tabTitle.Grid.Band.noxml)
    {
        var tdindex = tdcol.cellIndex;
	    var oGrid  = new XGrid(tabTitle.Grid.GridDiv.parentElement.id,tabTitle.Grid.Band,"in",null,1,null);
	    var tabTitle = oGrid.TabTitle;
	    var trTitle=tabTitle.rows[0];
	    tdcol = tabTitle.rows[0].cells[tdindex];
	    tdcol.asc=ascdesc;
    }
	
	tabTitle.Grid.setRowCursor(true);
	tabTitle.Grid.setRowChecked();
	//打上排序标记
	var tdColList=ToolUtil.getCtrlListByNameD(false,trTitle,"tdType","coltitle");
	for(var i=0;i<tdColList.length;i++)
	{
	    var lbctrl=ToolUtil.getCtrlByNameD(true,tdColList[i],"colname");
	    if(!lbctrl) continue;
	    if("INPUT"==lbctrl.tagName)
	    {
	        lbctrl.value=lbctrl.value.replace('↑','');
	        lbctrl.value=lbctrl.value.replace('↓','');
	    }else{
	        lbctrl.innerHTML=lbctrl.innerHTML.replace('↑','');
	        lbctrl.innerHTML=lbctrl.innerHTML.replace('↓','');
	    }
	}
	var lbctrl=ToolUtil.getCtrlByNameD(true,tdcol,"colname");
    if("INPUT"==lbctrl.tagName)
    {
        if("ascending"==tdcol.asc)
            lbctrl.value=lbctrl.value+'↑';
        else
            lbctrl.value=lbctrl.value+'↓';
    }else{
        if("ascending"==tdcol.asc)
            lbctrl.innerHTML=lbctrl.innerHTML+'↑';
        else
            lbctrl.innerHTML=lbctrl.innerHTML+'↓';
    }
	
	var band=tabTitle.Grid.Band;
	if(!band.XmlLandData.XMLDocument || !band.XmlLandData.XMLDocument.documentElement 
			|| band.XmlLandData.XMLDocument.documentElement.childNodes.length<1)
		return;
	if(band.XmlLandData.recordset.recordCount>0 && band.Grid && band.Grid.Table.rows.length>0)
	{
		var cellIndex=-1;
		if(!band.Grid.curTd)
			band.curTd=ToolUtil.getCtrlByTagD(false,band.Grid.Table,"TD","colname");
		if(band.Grid.curTd)
			cellIndex=band.Grid.curTd.cellIndex;
		var curTd=band.Grid.Table.rows[0].cells[cellIndex];
		if(!curTd)
			curTd=ToolUtil.getCtrlByTagD(false,band.Grid.Table.rows[0],"TD","colname");
		band.Grid.setActiveCell(curTd);
	}
	
}
//Grid标题列宽度改变
GridUtil.usOnTitMouseMoveLess=function()
{
	event.srcElement.style.cursor="default";
}
GridUtil.usOnTitMouseUpLess=function()
{
	event.srcElement.style.cursor="default";
}

//高级特性的影子函数,在实际调用时程序自动调用高级特性脚本覆盖影子函数
//影子函数

//对于有选择框checked列风格Grid，设置xmlRow标记selected属性
GridUtil.usOnCellCheckedSelectHandle=function()
{
	var inputctrl=event.srcElement;
	if("checkbox"!=inputctrl.type || "selectrow"!=inputctrl.datatype)
		return;
	//数据所在表格,及对应数据岛数据结构,列节点
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
	var tdcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
    
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	//if(band.XmlLandData.recordset.AbsolutePosition!=trcur.recordNumber)
	band.Grid.setActiveCell(tdcur);
	ToolUtil.sleep(30);
	var xmlRow=band.XmlLandData.XMLDocument.documentElement.childNodes[trcur.rowIndex];
	xmlRow.setAttribute("selected",inputctrl.checked);
	for(var i=0;i<myUnitItem.Bands.length;i++)
	{
		var bandD=myUnitItem.Bands[i];
		if(!bandD.Grid)     continue;
		if(band != bandD.getBandM())
		    continue;
		if(bandD.XmlLandData && bandD.XmlLandData.XMLDocument.documentElement.childNodes.length>0)
		{
		    var tdSelCheck=ToolUtil.getCtrlByTagD(false,bandD.Grid.Table,"TD","datatype","selectrow");
		    if(!tdSelCheck)     continue;
			var root=bandD.XmlLandData.XMLDocument.documentElement;
			for(var k=0;k<root.childNodes.length;k++)
				root.childNodes[k].setAttribute("selected",inputctrl.checked);
		}
		if(bandD.Grid)
			bandD.Grid.setRowChecked();
	}
    
}

//单元格改变后执行
GridUtil.usOnCellUpdatedHandle=function()
{
	var inputctrl=event.srcElement;
	if(!inputctrl.colname || ""==inputctrl.colname)
		return;
	//数据所在表格,及对应数据岛数据结构,列节点
	var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
	
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	if("checkbox"==inputctrl.type)
		var value=inputctrl.checked;
	else
		var value=inputctrl.value;
	band.setFldStrValue(trcur.recordNumber-1,inputctrl.colname,value,inputctrl.valueold);
	//设置级联更新
	band.setSelectContent(inputctrl.colname,trcur.recordNumber-1);
	//当前行计算
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=trcur.recordNumber-1;
	band.Event.colName=inputctrl.colname;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
}


//单元格回车跳格
//单元格回车跳格
GridUtil.usOnCellEnterTab=function()
{
	var inputctrl=event.srcElement;
    var tdcol=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","datatype");
	var trcur=ToolUtil.getCtrlByTagU(true,tdcol,"TR","rowType","detail");
	var tabDetail=ToolUtil.getCtrlByTagU(true,trcur,"TABLE","tabType","detail");
	switch(event.keyCode)
	{
	    case 38: //向上
	        if(!tabDetail || !tabDetail.Grid || !tabDetail.Grid.Band || trcur.recordNumber<2)
	            return;
	        var band=tabDetail.Grid.Band;
            var bFired=GridUtil.usOnCellChangeHandle();
            if(!bFired) return;
            GridUtil.usOnCellUpdatedHandle();
			var strMsg=band.CalXmlLand.ValidateRow(trcur.recordNumber-1);
            if(strMsg && ""!=strMsg)
                return;
            var td=tabDetail.rows[trcur.rowIndex - tdcol.rowSpan].cells[tdcol.cellIndex];
            var ctrl=ToolUtil.getCtrlByNameD(false,td,"colname");
            if(ctrl)
                ctrl.fireEvent("onfocus");
	        return;
	    case 40:   //向下
	        if(!tabDetail || !tabDetail.Grid || !tabDetail.Grid.Band || trcur.recordNumber==tabDetail.rows.length)
	            return;
	        var band=tabDetail.Grid.Band;
            var bFired=GridUtil.usOnCellChangeHandle();
            if(!bFired) return;
            GridUtil.usOnCellUpdatedHandle();
			var strMsg=band.CalXmlLand.ValidateRow(trcur.recordNumber-1);
            if(strMsg && ""!=strMsg)
                return;
            var td=tabDetail.rows[trcur.rowIndex + tdcol.rowSpan].cells[tdcol.cellIndex];
            var ctrl=ToolUtil.getCtrlByNameD(false,td,"colname");
            if(ctrl)
                ctrl.fireEvent("onfocus");
	        return;
	    case 13:
	        if(!tabDetail || !tabDetail.Grid || !tabDetail.Grid.Band || trcur.recordNumber<1)
	        {
	            event.keyCode=9;
	            return;
	        }
	        var blast=true;var td=tdcol;
	        var tdNext=td.nextSibling;
	        while(td.nextSibling)
	        {
		        td=td.nextSibling;
		        if(td.colname && ""!=td.colname)
		        {blast=false;break;}
	        }
	        //最后一行就新增加行
	        if(true==blast && trcur.recordNumber==tabDetail.Grid.XmlLand.recordset.recordCount)
	        {
		        var band=document.UnitItem.getBandByItemName(tabDetail.Grid.ItemName);
		        var strMsg=band.CalXmlLand.ValidateRow(trcur.recordNumber-1);
		        if(strMsg && ""!=strMsg)
		        {
			        alert(strMsg);return;
		        }
		        band.NewRecord();
		        window.setTimeout(_setRow(band),150);
		        //band.setCurrentRow(band.XmlLandData.recordset.recordCount-1);
	        }
	        event.keyCode=9;
	        return;
	}
}

//输入编辑模板控件获得焦点;
GridUtil.usOnCtrlUpatedHandle=function()
{
    GridUtil.LoadExtentJs.apply(this,new Array(arguments,"usOnCtrlUpatedHandle"));
}

//输入编辑模板控件数据改变时
GridUtil.usOnCtrlChangeHandle=function()
{
    GridUtil.LoadExtentJs.apply(this,new Array(arguments,"usOnCtrlChangeHandle"));
}
//Grid标题列宽度改变
GridUtil.usOnTitMouseMove=function()
{
    GridUtil.LoadExtentJs.apply(this,new Array(arguments,"usOnTitMouseMove"));
}
//调节结束
GridUtil.usOnTitMouseUp=function()
{
    GridUtil.LoadExtentJs.apply(this,new Array(arguments,"usOnTitMouseUp"));
}
//加载脚本
GridUtil.LoadExtentJs=function(args,funname)
{
    if(!args || !funname || ""==funname)
        return;
    try{
        GridUtil.Loadjs(GridUtil.GridUtilAdv);
    }
    catch(ex){return;}
        //this.fun=arguments.callee;
        this.tempfun=function(){};
        eval('this.tempfun=GridUtil.'+funname);
        if("function"!=typeof(GridUtil.tempfun))
            return;
    return this.tempfun.apply(this,args);
}

//点击单元格内按钮弹出模式窗口
GridUtil.usOnCellBtnClickHandle=function()
{

	var inputctrl=event.srcElement;
	//数据所在表格,及对应数据岛数据结构,列节点
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var tdcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TD","colname");
	if(!tabDetail || !tdcur)	return;
	//得到参数 tdcur.colname,字段名
	if(tdcur.childNodes[0])
	if("function"==typeof(ms_CellBtnClick)) 
	{
	    var myUnitItem=document.UnitItem;
	    var oband=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	    ms_CellBtnClick(oband,tdcur.colname,tdcur.childNodes[0].value);
	}
	else
	{
	    var myUnitItem=document.UnitItem;
	    var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	    var xmlNodeAppend=myUnitItem.XmlConf.XMLDocument.selectSingleNode("//AppendItem[@linkcol='"+tdcur.colname+"']");
	    if(!xmlNodeAppend)	return;
	    band.setModalContent(xmlNodeAppend.getAttribute("name"));
	}
}

//根据事件源,或者数据岛ID,或者数据项目名称 找到Band对象
GridUtil.FindBand=function(xmlID,o)
{
    var myUnit=document.UnitItem;
	if(!xmlID)
	{
        var inputctrl,inputtype;
        if(!event && o) {inputctrl = o.src;inputtype=o.type}
        else if(event){inputctrl = event.srcElement;inputtype=event.type}
        else return;
	    if(!inputctrl) return null;
		var tab=ToolUtil.getCtrlByTagU(false,inputctrl,"TABLE","tabType","grid");
		if(!tab)	return;
		var tabDetail=ToolUtil.getCtrlByTagD(true,tab,"TABLE","tabType","detail");
		if(!tabDetail || !tabDetail.Grid)
			return null;
		return myUnit.getBandByItemName(tabDetail.Grid.ItemName);
	}else{
		var xmlland=$(xmlID);
		if(xmlland)
			return myUnit.getBandByItemName(xmlland.itemname);
		else
		    return myUnit.getBandByItemName(xmlID);
	}
	return null;
}
