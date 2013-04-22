// JScript source code
//put in input file user defined Event


//执行控件回传事件;事件参数统一接口赋值;为空执行页面事件,
// ctrlID 触发回传事件的控件; cmdArg回传命令参数; 
//命令参数样式: @key=value,@key=value,@key=value
//参数内容: CtrlID 触发事件的控件, Cmd 命令参数; TabID Tab页ID;CmdFull 全参数命令;CmdP 其他参数 
var g_tabid="";
function ExeCtrlPostCmd(ctrlID,cmdArg)
{
    if(!cmdArg) cmdArg="";
    if(ctrlID && ""!=ctrlID)
        cmdArg=ToolUtil.setValueTag(cmdArg,"CtrlID",ctrlID);
	document.getElementById("hlb_cmd").value=cmdArg;
	__doPostBack('bt_PostBack','');
}

function getPostCmd()
{
    var hlbCmd=document.getElementById("hlb_cmd");
    return hlbCmd.value;
}

function ue_report(itemname)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    //引入本页主表参数
    $U().BandMaster.BuildParamSelf();
    var xmldoc=$U().ParamXmldoc;
    
    ToolUtil.setParamValue(xmldoc, "AppendItem", itemname, "", "P", "", "T");
    ToolUtil.setParamValue(xmldoc, "WinType", "Print", "", "P", "", "T");
    var uri=$U().TransParams();
    ControlUtil.TopFrame.OpenPrnWin(uri);
    {ctrlsrc.disabled=null;document.isPost=null;return;}
    
    return;
}



// show relating items to the main item

function ue_showlist(xitem)
{
	if(xitem==1) igmenu_showMenu('yumenu', event); 
	else igmenu_showMenu('reportmenu', event); 
}


function ue_xsave()
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
	var	 strMsg=$U().ValidatityAll(true);
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);
		{ctrlsrc.disabled=null;document.isPost=null;return 1;}
	}

    var strResult=$U().saveData();
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"==success)
    {
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
    }else{
        alert(ToolUtil.valueTag(strResult,"提示"));
    }
    ctrlsrc.disabled=false;
    document.isPost=null;
    //原来回传方式的保存
    return;
	if(null==btnname || ""==btnname)
		btnname="1";
	var ls_gridname = l_Gridname(btnname);
	try{
		var oGrid = igtbl_getGridById(ls_gridname);
	}catch(e){
		if(!$U() || $U().Bands.length<1 || !$U().Bands[0].XmlLandData)
			{ctrlsrc.disabled=null;document.isPost=null;return;}
		var	 strMsg=$U().ValidatityAll(true);
		if(strMsg && ""!=strMsg)
		{
			alert(strMsg);
			{ctrlsrc.disabled=null;document.isPost=null;return 1;}
		}
		$U().setViewState();
		usSetPostParam();
		var strcmd=ToolUtil.setValueTag("","Cmd","cmd_save");
		strcmd=ToolUtil.setValueTag(strcmd,"TabID",g_tabid);
		ExeCtrlPostCmd(null,strcmd);
		return;
	}
	if(!oGrid) 
	    {ctrlsrc.disabled=null;document.isPost=null;return;}
	//对Grid数据进行校验
	if(oGrid.Rows.length>0)
	{
		var oRow=oGrid.Rows.getRow(oGrid.Rows.length-1);
		if(!oRow) {ctrlsrc.disabled=null;document.isPost=null;return;}
		var strMsg = usValidatityLastRow();
		if(""!=strMsg)
		{
			//删除最后一行
			//alert(cell1);
			//oRow.deleteRow();
			alert(strMsg);
			{ctrlsrc.disabled=null;document.isPost=null;return 1;}
		}
	}

	if($U())
		$U().setViewState();
	
	usSetPostParam();
	var strcmd=ToolUtil.setValueTag("","Cmd","cmd_save");
	strcmd=ToolUtil.setValueTag(strcmd,"TabID",g_tabid);
	ExeCtrlPostCmd(null,strcmd);
}



function ue_print(xmlID)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var xmldoc=$U().ParamXmldoc;
    var band=GridUtil.FindBand(xmlID);
    if("html"==$U().printType)
    {
        usPrintHTML();
        {ctrlsrc.disabled=null;document.isPost=null;return;}
    }else{
	    if(!band)
	        ToolUtil.delParam(xmldoc, "WorkItem");
	    else
	        ToolUtil.setParamValue(xmldoc, "WorkItem", band.ItemName, "", "P", null, "T");
	    ToolUtil.delParam(xmldoc, "AppendItem");
	    ToolUtil.setParamValue(xmldoc, "WinType", "Print", "", "P", "", "T");
        var uri=$U().TransParams();
        ControlUtil.TopFrame.OpenPrnWin(uri);
    }
    {ctrlsrc.disabled=null;document.isPost=null;return;}
}

function uc_print(strsql)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;
    var uri="frmprint.aspx?100,200";
    ControlUtil.TopFrame.OpenPrnWin(uri);
    ctrlsrc.disabled=null;document.isPost=null;return;
}



function ue_cmdpost()
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	if($U())
		$U().setViewState();
    var strcmd=ToolUtil.setValueTag("","Cmd","cmd_cmd");
    strcmd=ToolUtil.setValueTag(strcmd,"CmdFull","cmd_cmd;UpFile2Xml");
    ExeCtrlPostCmd(null,strcmd);
}

//iframeWeb是aspx页面放置的固定控件
function usLocalSaveAs()
{
	if(!iframeWeb)		return false;

	var strDoc = $U().SaveLocal();
	iframeWeb.document.clear();iframeWeb.document.open();
	iframeWeb.document.write(strDoc);
	iframeWeb.document.execCommand('SaveAs',false,$U().UnitName+".xml");
	iframeWeb.document.clear();
	iframeWeb.document.close();
	iframeWeb.location.href="about:blank";
	return false;
}

//上传用户客户端的XML数据文件
function  usLoadUpPost()
{
	var xmlLandUp=document.getElementsByTagName("XMLLANDUP");
	if(!xmlLandUp || xmlLandUp.length<1)
		return;
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	xmlLandUp=xmlLandUp[0];
	if($U())
		$U().setViewState();
    var strcmd=ToolUtil.setValueTag("","Cmd","xmllandup");
    strcmd=ToolUtil.setValueTag(strcmd,"CtrlID",xmlLandUp.ControlID);
    ExeCtrlPostCmd(xmlLandUp.ControlID,strcmd);
}
function ue_XMLtoDB(menuitem)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	if($U())
		$U().setViewState();
    var strcmd=ToolUtil.setValueTag("","Cmd","cmd_xmltodb");
    strcmd=ToolUtil.setValueTag(strcmd,"CmdFull","cmd_xmltodb;" +menuitem);
    ExeCtrlPostCmd(null,strcmd);
}


function ue_delete()
{
	var result = confirm(" 是否删除选择的记录 ?     ");
	if(!result) return;
	var band=$U().getActiveBand();
	ue_banddelete(band.ID);
}

function ue_add()
{
	var band=$U().getActiveBand();
	ue_bandadd(band.ID);
}

function	ue_insert()
{
	var band=$U().getActiveBand();
	ue_bandinsert(band.ID);
}


//从模式窗口选择数据导入来源band数据岛
function ue_bandimport(xmlID)
{
	if(!xmlID)
	{
		var band=$U().getActiveBand();
	}else{
		var xmlland=document.getElementById(xmlID);
		if(!xmlland)	return;
		var band=$U().getBandByItemName(xmlland.itemname);
	}
	if(!band.Grid)	return;
	var winParent=window.Parent;
	var bandSrc=winParent.$U().getActiveBand();
	var xmlRowList=band.getCheckedXmlRowList();
	for(var i=0;i<xmlRowList.length;i++)
	{
		bandSrc.NewRecord();	//新增加行后,新行为当前行
		bandSrc.setRowValue(xmlRowList[i]);
	}
}

function ue_gdstart()
{
	var band=$U().getActiveBand();
	if(1==band.RecordCount())
		strMsg="";
	else
		strMsg=band.CalXmlLand.ValidateRow((band.RecordCount()<1)?-1:(band.XmlLandData.recordset.AbsolutePosition-1));
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(0);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}	
	return;
}

function ue_gdrew()
{
	var band=$U().getActiveBand();
	if(band.XmlLandData.recordset.recordCount<1)
		return;
	if(band.RecordCount()>0)
	    var index=band.XmlLandData.recordset.AbsolutePosition-1;
	else 
	    var index=-1;
	var curindex=(index<10)?index:(index-10);
	if(curindex!=index)
		var strMsg=band.CalXmlLand.ValidateRow(index);
	else
		var strMsg="";
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(curindex);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}	
	return;
}

function ue_gdprev()
{
	var band=$U().getActiveBand();
	if(band.RecordCount()<1)
		return;
	var index=band.XmlLandData.recordset.AbsolutePosition-1;
	var curindex=(index<1)?0:(index-1);
	if(curindex!=index)
		var strMsg=band.CalXmlLand.ValidateRow(band.XmlLandData.recordset.AbsolutePosition-1);
	else
		var strMsg="";
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(curindex);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}
	return;
}

function ue_gdnext()
{
	var band=$U().getActiveBand();
	if(band.RecordCount()<1)
		return;
	var index=band.XmlLandData.recordset.AbsolutePosition-1;	//记录行以1为基点,需要换成以0为基点
	var curindex=(index+1<band.XmlLandData.recordset.recordCount)?(index+1):index;
	if(curindex!=index)
		var strMsg=band.CalXmlLand.ValidateRow(band.XmlLandData.recordset.AbsolutePosition-1);
	else
		var strMsg="";
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(curindex);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}	
	return;
}

function ue_gdff()
{
	var band=$U().getActiveBand();
	if(band.RecordCount()<1)
		return;
	var index=band.XmlLandData.recordset.AbsolutePosition-1;	//记录行以1为基点,需要换成以0为基点
	var curindex=(band.XmlLandData.recordset.recordCount-index<10)?index:(index+10);
	if(curindex!=index)
		var strMsg=band.CalXmlLand.ValidateRow(band.XmlLandData.recordset.AbsolutePosition-1);
	else
		var strMsg="";
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(curindex);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}	
	return;
}

function ue_gdend()
{
	var band=$U().getActiveBand();
	if(band.RecordCount()<1)
		return;
	var curindex=band.XmlLandData.recordset.recordCount-1;
	if(curindex!=band.XmlLandData.recordset.AbsolutePosition-1)
		var strMsg=band.CalXmlLand.ValidateRow(band.XmlLandData.recordset.AbsolutePosition-1);
	else
		var strMsg="";
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
	band.setCurrentRow(curindex);
	if(band.Grid && band.Grid.curTd)
	{
		var ctrl=ToolUtil.getCtrlByNameD(false,band.Grid.curTd,"colname");
		if(ctrl)    ctrl.fireEvent("onfocus");
	}	
	return;
}


function ue_buildtable(xmlID)
{
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	var band=$U().getBandByItemName(xmlland.itemname);
	var colList=band.XmlSchema.XMLDocument.selectNodes("//xs:element");
	var tablename = "";
	var fields		= "";
	for(var i=0;i<band.XmlLandData.recordset.recordCount;i++)
	{
	    tablename   = band.getFldStrValue("表名称",0);
	    var ftyle = band.getFldStrValue("字段类型",i).toLowerCase();
        switch(band.getFldStrValue("字段类型",i))
        {
           case  "uniqueidentifier":
                fields = fields + ",[" + band.getFldStrValue("字段名",i) + "] [" + band.getFldStrValue("字段类型",i) + "] NOT NULL";
                break;
           case  "int":
                fields = fields + ",[" + band.getFldStrValue("字段名",i) + "] [" + band.getFldStrValue("字段类型",i) + "] NULL";
                break;
           case  "float":
           case  "decimal":
           case  "money":
           case  "double":
                fields = fields + ",[" + band.getFldStrValue("字段名",i) + "] [" + band.getFldStrValue("字段类型",i) + "] NULL";
                break;
           case  "datetime":
                fields = fields + ",[" + band.getFldStrValue("字段名",i) + "] [" + band.getFldStrValue("字段类型",i) + "] NULL";
                break;
            default:
                fields = fields + ",[" + band.getFldStrValue("字段名",i) + "] [" + band.getFldStrValue("字段类型",i) + "] (" + band.getFldStrValue("字段长度",i) +") NULL";
                break;
        }
    }
    var str = fields.substr(1,fields.length-1);
//	CREATE TABLE [dict_datatype] ( [ID] [uniqueidentifier] NOT NULL ,  
//  [编号] [int] NULL , 
//  [名称] [varchar] (20) NULL , 
//  [英文名称] [varchar] (20) NULL , 
//  [说明] [varchar] (20) NULL )

	str = "CREATE TABLE ["+tablename+"] (" + str+ ")";
    if($U())
		$U().setViewState();
	usSetPostParam();
    var strcmd=ToolUtil.setValueTag("","Cmd","cmd_createTable");
    strcmd=ToolUtil.setValueTag(strcmd,"TabID",g_tabid);
    strcmd=ToolUtil.setValueTag(strcmd,"CmdFull","cmd_createTable;"+str);
    ExeCtrlPostCmd(null,strcmd);
}

function _myrefresh()
{
	var srcEle=event.srcElement;
	if(!srcEle || srcEle=="undefined") return;
	var tab=ToolUtil.getCtrlByTagU(false,srcEle,"TABLE");
	for(var m=0;m<tab.rows.length;m++)
		for(var i=0;i<tab.rows[m].cells.length;i++)
		{
		    var cell=tab.rows[m].cells[i];
		    var ctrl=ToolUtil.getCtrlByTagD(false,cell,"SELECT");
			if(ctrl==null)
				ctrl = ToolUtil.getCtrlByTagD(false,cell,"INPUT");
			if(ctrl!=null && ctrl.type!="button" && ctrl.type!="checkbox")
				ctrl.value="";
		}
}

function isnamenull(ctrls)
{
    var name="";
    for(var nm=0;nm<ctrls.length;nm++)
        name=ctrls[nm].name+name
    return name;
}


// 打开过滤条件设置窗口
function ue_filter()
{     	 
	var strfields = "";
	var GridName=usGetGridNameActivate();
	try
	{
		var oGrid = igtbl_getGridById(GridName);
		strfields = ueSPage();		
		var subEmpty  = strfields.replace(/;/g,"");
		subEmpty  = subEmpty.replace(/:/g,"");
		subEmpty  = subEmpty.replace(/,/g,"");
		if(subEmpty==""){alert("查询数据不存在，谢谢使用！");	return;}
		var oCell = igtbl_getActiveCell(GridName);
		if(oCell.Column.Key ==null || oCell.Column.Key=="SN") return;		
		window.strfields = strfields;		
	}
	catch(e)
	{
		var oGrid = GridUtil.getGridByName(GridName);
		if(oGrid==null)
		{
		    alert("请选择查询对象！");
		    return;
		}
		var xmlRows=oGrid.XmlLand.XMLDocument.selectNodes("/*/*");
		if(xmlRows.length==0){alert("查询数据不存在，谢谢使用！");	return;}
		var colList=oGrid.XmlSchema.XMLDocument.selectNodes("//xs:element[not(@visible) or @visible='' or @visible!='1']");
		strfields = ":" + leo_getfields(colList);  //预留主表字段结构
		window.strfields = strfields;
	}	
	var rtn = window.showModalDialog("frmFilter.aspx",window,"dialogHeight: 360px; dialogWidth:600px; edge: Raised; center: Yes; help: No; resizable: No status: No;");
	if(rtn=="" || rtn==null) return 1;

    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	if($U())
		$U().setViewState();
	usSetPostParam();
    var strcmd=ToolUtil.setValueTag("","Cmd","cmd_filter");
    strcmd=ToolUtil.setValueTag(strcmd,"TabID",g_tabid);
    strcmd=ToolUtil.setValueTag(strcmd,"CmdFull","cmd_filter;" +g_tabid + ";"+rtn);
    ExeCtrlPostCmd(null,strcmd);
}

//替换
function ue_replace(xmlID)
{
    var band=GridUtil.FindBand(xmlID);
	if(!band || !band.XmlSchema)    return;
	var rtn = window.showModalDialog("frmreplace.htm",band,"dialogHeight: 245px; dialogWidth: 400px; edge: Raised; center: Yes; help: No; resizable: No status: No;"); 
	if(rtn=="" || rtn==null) return 1;	 
}


function ue_find()
{
	document.getElementById("diagfind").style.display="";
	ctrl=document.getElementById("FindVal");
	if(null==ctrl || "none"==ctrl.style.display || "hidden"==ctrl.style.visibility)
		return;
	try{
		ctrl.focus();
		ctrl.select();
	}catch(ex){}
}


function ue_reload()
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

	if($U())
		$U().Query();
    ctrlsrc.disabled=false;
    document.isPost=null;
	
}

//返回选择的记录(以xml格式的字符串)
function ue_returnok()
{
	if(window.dialogArguments)
		$U().CheckInParentUnit();
}

function ue_savewidth(xmlID)
{
    var ctrlsrc=event.srcElement;
    if(ctrlsrc.disabled || document.isPost)
        return;
    ctrlsrc.disabled=true;
    document.isPost=true;

    var band=GridUtil.FindBand(xmlID);
    if(band.Grid)
    {
        var strResult=band.Grid.saveWidth();
        var success=ToolUtil.valueTag(strResult,"成功");
        if("true"==success)
            alert("保存成功!");
        else
            alert(ToolUtil.valueTag(strResult,"提示"));
    }
    ctrlsrc.disabled=false;
    document.isPost=null;
	 return;
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

function ue_setup()
{
	 var rframe_width="192,*,570";
	 var topFrame=usGetTopFrame();
	 topFrame.SetRightBarVisible(true,rframe_width);
	 parent.parent.mainform.frames["rframe"].location = "frmproperty.aspx";

}

//搜索方式过滤
function ue_tsfilter(ctlname,itemname)
{
    strname = ctlname.name;
    strval = ctlname.value; //"1110350 1110351 1110353 1110355";
    strval=strval.replace(","," ");
    strval=strval.replace("，"," ");
    strval=strval.replace(";"," ");
    strval=strval.replace("；"," ");
    strval=strval.replace("　"," ");
    var strExpr="";
    var arrs=strval.split(" ");
    for(var i=0;i<arrs.length;i++)
    {
       if(arrs[i].Trim().length>0)
       {
        strExpr = strExpr + " or " + strname + " like '" + arrs[i].Trim()  + "%' "
       }
    }   
    if(strExpr=="") return;
    if(strExpr.length>2) 
    strExpr = " "+strExpr.substr(4,strExpr.length-3);
    if(strExpr=="") return;

    strExpr = " ("+strExpr+")";
    if(strval=="") return;
    usfiltercmd(strExpr+";"+ strname + ";" + strval + ":" + itemname);
}

function usPrintHTMLRemoveHidden(currentNode)
{
   if( currentNode.parentElement && currentNode.style && ("none"==currentNode.style.display || "hidden"==currentNode.style.visibility) )
   {
		currentNode.parentElement.removeChild(currentNode);
		return;
   }
   if( currentNode.parentElement && currentNode.tagName && "SCRIPT"==currentNode.tagName )
   {
		currentNode.parentElement.removeChild(currentNode);
		return;
   }
   for(var i=0;i<currentNode.children.length;i++)
   {
		if( currentNode.children(i).style && ("none"==currentNode.children(i).style.display || "hidden"==currentNode.children(i).style.visibility) )
		{	
			currentNode.children(i).parentElement.removeChild(currentNode.children(i));
			continue;
		}
		usPrintHTMLRemoveHidden(currentNode.children(i));
   }
}

////  打印HTML表格
//function usPrintHTML()
//{
//    //得到打印模板
//	var url="testprint.htm";
//	window.open(url,'newwindow','height=450,width=690,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
//	//window.open(url);
//	//rtnstate = window.showModalDialog(url,"","dialogHeight:450px;dialogWidth:690px;left: yes;help:no;scroll:no; resizable:no;status:no;");
//	//return rtnstate;
//}

//  打印HTML表格
function usPrintHTML(exportType)
{
	var tabPrintList=document.getElementsByTagName("TABLE");
	var strPrintContext="";var bHasPrintTab=false;
	for(var i=0;i<tabPrintList.length;i++)
		if(tabPrintList[i] && tabPrintList[i].getAttribute("print") )
			{bHasPrintTab=true;break;}
	for(var i=0;i<tabPrintList.length;i++)
	{
		if(!tabPrintList[i])  continue;
		if( bHasPrintTab &&  !tabPrintList[i].getAttribute("print") )
			continue;
		var tabClone=tabPrintList[i].cloneNode(true);
		if(tabPrintList[i].getAttribute("print"))
		    tabClone.style.display="";
		var inputList=tabClone.getElementsByTagName("INPUT");
		for(var j=inputList.length-1;j>-1;j--)
		{
			var inputType=inputList[j].type.toLowerCase();
			if("image"==inputType)	continue;
			if("button"==inputType || "file"==inputType || "hidden"==inputType || "password"==inputType 
				|| "radio"==inputType || "reset"==inputType || "submit"==inputType
				|| "none"==inputList[j].style.display || "hidden"==inputList[j].style.visibility)
			{
				inputList[j].parentElement.removeChild(inputList[j]);
				continue;
			}
			var txt=null;
			if("checkbox"==inputType)
				txt=inputList[j].checked?"是":"否";
			else
				txt=inputList[j].value;
			var txtDiv=document.createElement("DIV");
			txtDiv.innerText=txt;
			if(inputList[j].getAttribute("print"))
				txtDiv.setAttribute("print",inputList[j].getAttribute("print"));
			inputList[j].parentElement.replaceChild(txtDiv,inputList[j]);
		}
		var selectList=tabClone.getElementsByTagName("SELECT");
		for(var j=selectList.length-1;j>-1;j--)
		{
			if("none"==selectList[j].style.display || "hidden"==selectList[j].style.visibility)
			{
				selectList[j].parentElement.removeChild(selectList[j]);
				continue;
			}
			var txtDiv=document.createElement("DIV");
			txtDiv.innerText=selectList[j].value;
			if(selectList[j].getAttribute("print"))
				txtDiv.setAttribute("print",selectList[j].getAttribute("print"));
			selectList[j].parentElement.replaceChild(txtDiv,selectList[j]);
		}
		var txtList=tabClone.getElementsByTagName("TEXTAREA");
		for(var j=txtList.length-1;j>-1;j--)
		{
			if("none"==txtList[j].style.display || "hidden"==txtList[j].style.visibility)
			{
				txtList[j].parentElement.removeChild(txtList[j]);
				continue;
			}
			var txtDiv=document.createElement("DIV");
			txtDiv.innerText=txtList[j].value;
			if(txtList[j].getAttribute("print"))
				txtDiv.setAttribute("print",txtList[j].getAttribute("print"));
			txtList[j].parentElement.replaceChild(txtDiv,txtList[j]);
		}
		usPrintHTMLRemoveHidden(tabClone);
		strPrintContext += tabClone.outerHTML;
	}
    
	var xmlhttp = CreateHTTP();
	var ls_path="http://"+location.host+location.pathname;
	ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
	try
	{
		xmlhttp.open("POST", ls_path+"wfSaveHtmTab.aspx", false);
		xmlhttp.send(strPrintContext);
	}catch(ex){
		alert("系统已经断开,请重新登陆!");
	}
	var fileName= xmlhttp.responseText;
	if(!fileName)		return "";
	if(fileName=="-1")  return "";
	if(fileName.length<1) return "";
	var url="";
	var rtnstate
	switch(exportType)
	{
		case "word":
		case "excel":
			url="frExportDoc.aspx?printfile="+fileName+"&printtype="+exportType;
			window.open(url,"_blank","");
			break;
		default:
			var url="wfPrintHTML.aspx?printfile="+fileName;
			rtnstate = window.showModalDialog(url,"","dialogHeight:127px;dialogWidth:273px;left: yes;help:no;scroll:no; resizable:no;status:no;");
			//window.open(url,"_blank","");
			break;
	}
	return rtnstate;
	var winPrint=window.open("","_blank","");
	winPrint.document.write(strPrintContext);
	winPrint.document.write("<script type='text/javascript' language=javascript>window.onafterprint=function(){window.close();}</script>");
	winPrint.document.write("<div style='display:none;'><object ID='WebBrowser' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object></div>");
	winPrint.document.write("<script type='text/javascript' language=javascript>document.getElementById('WebBrowser').ExecWB(7,1);</script>");
    return;

}

	function ms_save(hint)
	{
	    var strResult=$U().saveData();
	    var success=ToolUtil.valueTag(strResult,"成功");
		var ctrlsrc = null;
		if(event)
            ctrlsrc=event.srcElement;
	    if("true"==success)
	    {
	        if(hint && hint!="") 
	        {
	            if(hint.toLowerCase()!="false") alert(hint);
	        }
	        else if(hint && hint=="")
	        {}
	        else 
	            alert("保存成功!");
	        
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
	        if(ctrlsrc) ctrlsrc.disabled=false;
	        document.isPost=null;
	        return true;
	    }else{
	        if(!strResult) alert("保存失败，请检查！");
	        else
	            alert(ToolUtil.valueTag(strResult,"提示"));
	        if(ctrlsrc) ctrlsrc.disabled=false;
	        document.isPost=null;
	        return false;
	    }
	}
	
    function ms_check()
    {
		var ctrlsrc = null;
		if(event)
		{
            ctrlsrc=event.srcElement;
            if(ctrlsrc.disabled || document.isPost)
                return false;
            ctrlsrc.disabled=true;
        }
        document.isPost=true;
	    var	 strMsg = $U().ValidatityAll(true);
	    if(!strMsg)
	    {
	        ToolUtil.sleep(2);
	        strMsg = $U().ValidatityAll(true);
	    }	
	    if(strMsg && ""!=strMsg)
	    {
		    alert(strMsg);
	        if(ctrlsrc) ctrlsrc.disabled=false;
	        document.isPost=null;
	        return false;
	    }
	    return true;
    }

// 执行过滤
function usfiltercmd( strfilter)
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
    var xmldoc=$U().ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "Filter", arrFilter[0], "", "P", band.ItemName, "C","M");
	var iPageSize=ToolUtil.Convert(band.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	ToolUtil.setParamValue(xmldoc, "FirstRow", 0, "P", "", band.ItemName, "C","M");
	ToolUtil.setParamValue(xmldoc, "LastRow", iPageSize, "", "P", band.ItemName, "C","M");
    band.setFldSumStrValue("PageIndex",1);
    band.Query();
    return;
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
	var tab=ToolUtil.getCtrlByTagU(false,srcEle,"TABLE");
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
				    if(exps[i]=="<=") vals[i]=vals[i]+' 23:59:59.997'
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
    str=str.replaceAll(" like '%未分类%'"," is null");
    str=str.replaceAll(" like '%空%'"," is null");
    str=str.replaceAll(" like '%null%'"," is null");
    str=str.replaceAll(" = '未分类'"," is null");
    str=str.replaceAll(" = '空'"," is null");
    str=str.replaceAll(" = 'null'"," is null");
    str=str.replaceAll("&&"," ");
    //alert(str+";"+strname + ";" +strval + "：" + itemname);
    if(!itemname) return str;
    else
	    usfiltercmd(str+";"+strname + ";" +strval + "：" + itemname);
}

function isgroupstr(strval)
{
    strval=strval.replace("   "," ");
    strval=strval.replace(","," ");
    strval=strval.replace("，"," ");
    strval=strval.replace(";"," ");
    strval=strval.replace("；"," ");
    strval=strval.replace("　"," ");
    strval=strval.replace("+"," ");
    strval=strval.replace(" + "," ");
    strval=strval.replace(" +"," ");
    strval=strval.replace("+ "," ");

    var strExpr="";
    var arrs=strval.split(" ");
    return arrs.length;
}
function getgroupstr(strname,strval)
{
    strval=strval.replace("   "," ");
    strval=strval.replace(","," ");
    strval=strval.replace("，"," ");
    strval=strval.replace(";"," ");
    strval=strval.replace("；"," ");
    strval=strval.replace("　"," ");
    strval=strval.replace("+"," ");
    strval=strval.replace(" + "," ");
    strval=strval.replace(" +"," ");
    strval=strval.replace("+ "," ");
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


String.prototype.replaceAll = function(regText,replaceText){var raRegExp = new RegExp(regText,"g"); return this.replace(raRegExp,replaceText); }; 
//文件结尾
if(typeof(GridUtil)=="function")
    GridUtil.FileLoaded=true;