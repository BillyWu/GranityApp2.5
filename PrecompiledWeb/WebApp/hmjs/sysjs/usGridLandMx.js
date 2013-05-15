
//gridName注册的控件名;  tabdiv Grid显示的容器; tabTpHTML模板字符串;  isCustom是否用户定制
//如果isCustom为true那么tabdiv内已经有需要显示的Grid，包括需要显示的列及其属性
//Grid对象gridName-名称,srcdiv-Grid容器
//利用band属性定义最小宽度，自由列名，标题名
//mband.minwidth = "80px";
//mband.title    = "客户联系人管理";
//mband.freecols = "客户";
//gridflag 表格格式标志;0或null缺省为全编辑，1-无功能区, 2 - 编辑无保存, 3 - 编辑无打印, 4 - 编辑无页码区, 5 - 编辑简单页码区
//6 - 浏览全功能,7 - 浏览简单页码区
// boxtype - null,0 为普通select, 1 为人工select(通过button弹出选择窗口)
function MGrid(srcdiv,oband,type,haschk,boxtype)
{

}
function XGrid(srcdiv,oband,type,haschk,boxtype)
{
    // 框架及表头
    if(!oband) {alert("数据错误,请检查！");return;};
    if(oband.Grid) return;
    var minwidth = (oband.minwidth)?oband.minwidth:"60px";
    var gridtop =["<div id='"+ srcdiv +"_GridDiv' style='height:100%;width:100%;'><table class='GridWB' cellpadding=0 cellSpacing=0 style='width:100%;height:100%' tabType='grid'>"+
        "  <tbody><tr><td divtype='body' colspan='4' valign='top'><div divtype='title' align='left' class='ws'  style='overflow-x:auto;overflow-y:scroll;width:100%'>"+
        "          <table tabType='title' class='ctabTitle' cellpadding=0 cellSpacing=0><tbody>"];
    var cols = oband.Cols("1");
    if(haschk) icolspan = cols.length + 1
    else icolspan = cols.length;
    var blname = "";var isFoot = false;
    var GridTitle = null;
    if(oband.title) GridTitle = (oband.title!="")?oband.title:oband.UnitItem.UnitName;
    if(GridTitle)
        if(oband.gridtype==8)
            gridtop.push('<tr rowType="titlename"><td class="cellwb_btn" align="center" height="22" colspan="'+icolspan+'">'
            +'<div class="gridtitle"><div class="griddv3"><A class="linkbtn_0" href="#" onclick="ue_bandadd();"><img border="0" src="Images/add.gif" />&nbsp;增加</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存</A></div>'
            +'<div class="griddv1"></div><div class="griddv2">'+GridTitle+'</div></div></td></tr>');
        else        
            gridtop.push('<tr rowType="titlename"><td class="cellwb_btn" align="center" height="22" colspan="'+icolspan+'">'+GridTitle+'</td></tr>');
        
    gridtop.push("<tr rowType='title'>");
    gridtop.push("<td align='center' tdType=coltitle  datatype='xs:int' height=22px colname='RowNum' class='cellwb_btn' width=45px >序号</td>");
    if(haschk)
        gridtop.push('<td class="cellwb_btn" align="center" width="40" height="22" ><span width="100%" height="100%" colname="">选择</span></td>');
    for(var j = 0; j < cols.length; j++)
    {
        var colitem     = oband.ColObj(cols[j]);
        if(colitem.name=="RowNum" || colitem.idkey || (oband.UnitItem.BandMaster!=oband && colitem.name==oband.linkCol)) continue;
        if(colitem.width=="") colitem.width = minwidth;
        if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
        if(oband.freecols && colitem.name==oband.freecols) colitem.width="";
        else 
            if(!oband.freecols && j==cols.length-1) colitem.width="";
        if(colitem.name=="RowNum") colitem.width="45px";
        if(colitem.width=="") _sw="";
        else _sw = " width="+ colitem.width;
        var colname = colitem.name;
        var coltitle = colitem.title;
        if(colitem.foot!="") isFoot=true;       //是否有脚注行
        gridtop.push("<td align='center' tdType=coltitle  datatype='xs:"+colitem.datatype+"' height=22px colname='"+colname+"' class='cellwb_btn'"+ _sw +" onmouseup=GridUtil.usOnTitMouseUp() onmousemove=GridUtil.usOnTitMouseMove() ondblclick=GridUtil.usOnTitClick()>" + coltitle +"</td>");
    }
    gridtop.push("</tr><tbody></table></div>");
    // ---------------------------------------------------------------//
    var sdetail = "<div divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%' onscroll=GridUtil.usOnScrollHori()>"
      +"<table width='100%' tabType='detail' class='ctabDetail' cellpadding=0 cellSpacing=0 onmousemove=GridUtil.usOnDetailMouseOverHandle() onmouseout=GridUtil.usOnDetailMouseOutHandle()>"
    gridtop.push(sdetail);
    var rnt = oband.RecordCount();
    for(var i = 0; i < rnt; i++)
    {    
        gridtop.push("<tr rowType='detail'>");
        var strfoot = "";
        var strtag = "input";
        if(oband.gridtype==6 || oband.gridtype==7 || oband.gridtype==1) strtag="span";
        var tdtext = "<td align='center' tdType='rowcursor' class='cellwb_btn' width=45px onclick='GridUtil.usOnRowcursorClickHandle()' datatype='int'><span width=100% datafld='RowNum'></span></td>";
        gridtop.push(tdtext);    
        if(haschk)
            gridtop.push('<td datatype="selectrow" class="cellStyle" align="center" width="40"><input type="checkbox" datatype="selectrow" class="gridcheck" onclick="GridUtil.usOnCellCheckedSelectHandle();" /></td>');
        var strfoot = "<td align='center' tdType=\"rowcursor\" colname='RowNum' height=22 class='cellwb' width=45px><span width=100% >合计</span></td>"; 
        for(var j = 0; j < cols.length; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(colitem.name=="RowNum" || colitem.idkey || (oband.UnitItem.BandMaster!=oband && colitem.name==oband.linkCol)) continue;
            if(colitem.width=="") colitem.width = minwidth;
            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(oband.freecols && colitem.name==oband.freecols) colitem.width="";
            else 
                if(!oband.freecols && j==cols.length-1) colitem.width="";
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;                    
            var align="left";
            var strclass = "cellStyle";
            sdatatype = "datatype='" + colitem.datatype+"'";
            var colvalues = "";
            var colhtmls = "";
            var sformat = "";  
            var sformatfld = ""; 
            var sdatafld = ""; 
            if(colitem.format!="") sformat = " format="+colitem.format;
            if(colitem.formatfld!="") 
            {
                sformatfld = " formatfld='"+colitem.formatfld+"'";
                sdatafld = " datafld='" + colitem.formatfld+"'"; 
            }
            else
            {
                sdatafld = " datafld='" + colitem.name+"'"; 
                sformatfld = "";
            }
            var tdType="";
            var strclick = " onclick='GridUtil.usOnCellFocusHandle();' ";
            if(!oband.gridtype) oband.gridtype = 0;
            var strdisabled = "";
            colvalues = oband.getFldStrValue(colitem.name,i);
            if(colvalues=="") colvalues="";
            var _tdid = oband.ItemName + colitem.name + "_row" + i;
            var _objid = oband.ItemName + colitem.name + "_" + i;
            switch(colitem.datatype)
            {
                case "string":
                    colhtmls = '<'+ strtag +' style="WIDTH:100%;TEXT-ALIGN:left" type="text" ' + sdatatype 
                    + ' colname="'+colitem.name+'" class="gridbrowse" onkeydown="GridUtil.usOnCellEnterTab();" onafterupdate="GridUtil.usOnCellUpdatedHandle();" onfocus="GridUtil.usOnCellFocusHandle();" onblur="GridUtil.usOnCellBlurHandle();" onchange="return GridUtil.usOnCellChangeHandle();" ondblclick="GridUtil.usOnCellDbClickHandle();" ' 
                    + sdatafld  + sformatfld + ' id="'+ _objid + ' value='+colvalues +'/>';
                    break;
                case "blink":
                    colhtmls = '<a href="#" datatype="blink" valuefld="" target="_self" onclick="'+colitem.onclick+'" class="gridlink" datafld="">'
                    + '<div datatype="blink" colname="'+colitem.name+'" datafld="'+colitem.name+'">链接</div></a>';
                    align="center";
                    break;
                case "boolean":
                    if(strtag=="span") strdisabled = " disabled ";
                    colhtmls ='<input type="checkbox" '+strdisabled+' colname="' + colitem.name +'" ' +sdatatype + ' class="gridcheck" onkeydown="GridUtil.usOnCellEnterTab();" onafterupdate="GridUtil.usOnCellUpdatedHandle();" onfocus="GridUtil.usOnCellFocusHandle();" onblur="GridUtil.usOnCellBlurHandle();" ' + sdatafld + '/>';
                    align="center";
                    break;
                case "dateTime":
                    colhtmls ='<input type="text"  style="WIDTH:100%;HEIGHT:100%;TEXT-ALIGN:center" type="text" datatype="date" colname="'+colitem.name+'" class="gridbrowse" onkeydown="GridUtil.usOnCellEnterTab();" onafterupdate="GridUtil.usOnCellUpdatedHandle();" onfocus="GridUtil.usOnCellFocusHandle();" onblur="GridUtil.usOnCellBlurHandle();" onchange="return GridUtil.usOnCellChangeHandle();" ' + sdatafld +sformatfld +'/>'
                    align="center";
                    sdatatype = "datatype='date'";
                    break;                
                case "select":
                    if(strtag=="span"){ //strdisabled = " disabled ";
                        colhtmls ='<select alone=true '+ strdisabled +' style="WIDTH:100%;HEIGHT:100%" colname="'+colitem.name+'" datatype="select" '
                                  + ' class="gridselect" onkeydown="GridUtil.usOnCellEnterTab();" '
                                  +' datafld="'+colitem.name+'">'+griddict(colitem.name,oband,colitem.dataitem,colitem.textcol,colitem.valuecol);}
                    else
                    {
                        if(boxtype!=1)
                        {
                            colhtmls ='<select alone=true '+ strdisabled +' style="WIDTH:100%;HEIGHT:100%" colname="'+colitem.name+'" datatype="select" '
                                  + ' class="gridselect" optype="edit" '
                                  +' onkeydown="GridUtil.usOnCellEnterTab();" onfocus="GridUtil.msOnCellFocusHandle()" '
                                  +' onblur="GridUtil.usOnCellBlurHandle();" onchange="return GridUtil.usOnCellChangeHandle();"'
                                  +' onafterupdate="GridUtil.usOnCellUpdatedHandle();"'
                                  +' datafld="'+colitem.name+'">'+griddict(colitem.name,oband,colitem.dataitem,colitem.textcol,colitem.valuecol);
                        }
                        else
                        {
                            colhtmls = '<input style="WIDTH:100%;TEXT-ALIGN:left" type="text" ' + sdatatype 
                            + ' colname="'+colitem.name+'" class="gridbrowse" onkeydown="GridUtil.usOnCellEnterTab();" onafterupdate="GridUtil.usOnCellUpdatedHandle();" onfocus="GridUtil.usOnCellFocusHandle();" onblur="GridUtil.usOnCellBlurHandle();" onchange="return GridUtil.usOnCellChangeHandle();" ondblclick="GridUtil.usOnCellDbClickHandle();" ' 
                            +' datafld="'+colitem.name+'"/>'
                            +'<input title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:0px;width:22px;height:18; position:absolute" onclick="Xcbo('+colitem.bandid+')"/>';
                        }
                    }
                    break;
                default:
                    colhtmls = '<input style="WIDTH:100%;HEIGHT:100%;TEXT-ALIGN:right" type="text" ' +sdatatype + ' colname="'+colitem.name+'" class="gridbrowse" onkeydown="GridUtil.usOnCellEnterTab();" onafterupdate="GridUtil.usOnCellUpdatedHandle();" onfocus="GridUtil.usOnCellFocusHandle();" onblur="GridUtil.usOnCellBlurHandle();" onchange="return GridUtil.usOnCellChangeHandle();" ondblclick="GridUtil.usOnCellDbClickHandle();" ' + sdatafld  + sformatfld +'/>'
                    align="right";
                    break;
            }
            var strcolname = "";
            if(colitem.name!="RowNum") strcolname = "' colname='"+colitem.name;
            var tdtext = "<td align='"+ align +"' tdType='"+tdType+ strcolname +"'  class='"+ strclass +"'"+ _sw + strclick
            + sdatatype + sformat + sformatfld+">"+ colhtmls +"</td>";
            gridtop.push(tdtext);
            if(colitem.foot!="") isFoot=true;
            if(colitem.name!="RowNum") 
                strfoot = strfoot + "<td align='"+ align +"' tdType='coldata' colname='"+colitem.name+"'  class='cellwb'"+ _sw +" "
                    + sdatatype + sformat + sformatfld+"><span width=100% colname='"+colitem.name+"' "+sdatafld+">　</span></td>";
            else strfoot = strfoot + "<td align='"+ align +"' tdType=\"rowcursor\" colname='"+colitem.name+"' height=22 class='cellwb'"+ _sw 
            + "><span width=100% >合计</span></td>";
        }
        gridtop.push("</tr>"); 
    }
    gridtop.push("</table>"); 
    var tfoot = '<table tabType="foot" class="ctabDetail" cellpadding="0" cellSpacing="0"><tbody><tr rowType="foot">'
    +strfoot+'</tr></tbody></table>';
    if(isFoot) gridtop.push(tfoot);
    gridtop.push("</div></td></tr>");
    var stradd = '<td class="lt0a" width="16px" height="26px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_bandadd();" title="增加记录" src="Images/grid/addgrid.gif" onmouseover="this.src=\'Images/grid/addgrid_down.gif\'" onmouseout="this.border=0;this.src=\'Images/grid/addgrid.gif\'" width="22" height="22" /></A></td><td class="lt0a" width="2px"><span class="ltsep">|</span></td>';
    var strdel = '<td class="lt0a" width="16px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_banddelete();" title="删除所选择的记录" src="Images/grid/deletegrid.gif" onmouseover="this.src=\'Images/grid/deletegrid_down.gif\'" onmouseout="this.src=\'Images/grid/deletegrid.gif\';border=0" width="22" height="22" /></A></td><td class="lt0a" width="2px"><span class="ltsep">|</span></td>';
    var stredit = '<td class="lt0a" width="16px"><A class="linkbtn_1" href="#"><img border="0" onclick="" title="编辑" src="Images/bianji.gif" /></A></td><td class="lt0a" width="4px"><span class="ltsep">|</span></td>';
    var strins = '<td class="lt0a" width="20px"><A class="linkbtn_1" href="#"><img title="在当前位置插入记录行" border="0" onclick="ue_bandinsert();" src="Images/grid/insertgrid.gif" onmouseover="this.src=\'Images/grid/insertgrid_down.gif\'" onmouseout="this.src=\'Images/grid/insertgrid.gif\'" width="22" height="23" /></A></td><td class="lt0a" width="8px"><span class="ltsep">|</span></td>';
    var strrep = '<td class="lt0a" width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_replace();" src="Images/replace.ico" alt="替换记录内容" /></A></td><td class="lt0a" width="8px"><span class="ltsep">|</span></td>';
    var strsave = '<td class="lt0a" width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_save();" src="Images/save.gif" onmouseover="this.src=\'Images/grid/savec.gif\'" onmouseout="this.src=\'Images/grid/save.gif\';border=0" alt="保存" /></A></td><td class="lt0a" width="8px"><span class="ltsep">|</span></td>';
    var strprn = '<td class="lt0a" width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_print();" src="Images/printer0.gif" onmouseover="this.src=\'Images/printer.gif\'" onmouseout="this.border=0;this.src=\'Images/printer0.gif\'" alt="打印" /></A></td><td class="lt0a" width="8px"><span class="ltsep">|</span></td>';
    var strfind = '<td width="110" class="lt0a"><input class="tinput" type="text" name="T1" size="7" onfocus="this.nextSibling.value=\'查找\'" /><input '
                +'type="button" class="txtbtnF" value="查找" name="B3" onclick="ue_bandsearch(this.previousSibling.value,\'下一个\'==this.value);this.value=\'下一个\';" /></td>';
    var strmsg = '<td class="lt0a" name="message" style="color: #FF0000;">　</td>';
    var strfunHead = '<td align="right" class="lt0a">';
    var strNavPage = '页次:<input size="1" style="TEXT-ALIGN:right;" class="lt0c" name="lblCurrentPage" value="0" />/<input style="TEXT-ALIGN:left" class="lt0c" size="1" name="lblTotalPages" value="0" />总数:<input name="lblRecordCount" size="1" style="TEXT-ALIGN:left" class="lt0c" value="0" />';
    var strNav = '<A class="linkbtn_1" title="首页" href="#" onclick="ue_bandcmd_nav(\'first\')"><FONT face="webdings">9</FONT></A>'
                +'<A class="linkbtn_1" title="上一页" href="#" onclick="ue_bandcmd_nav(\'prev\')"><FONT face="webdings">3</FONT></A>'
                +'<A class="linkbtn_1" title="下一页" href="#" onclick="ue_bandcmd_nav(\'next\')"><FONT face="webdings">4</FONT></A>'
                +'<A class="linkbtn_1" title="最后一页" href="#" onclick="ue_bandcmd_nav(\'last\')"><FONT face="webdings">:</FONT></A>&nbsp;';
    var strNavSl = '<select class="tselect" name="ddlPageIndex" size="1" onchange="ue_bandcmd_nav(\'jump\',this.value);" style="width: 40">'
                +'<option value="1" selected="true">1</option></select>';
    var strfunEnd = '</td>';
    var funTr = '<tr><td><table border="0" cellpadding="0" style="width:100%;border-collapse: collapse" id="table1" divtype="funarea">'
    +'  <tbody><tr>';
    + stradd + strdel + strins + strrep + strsave + strprn + strfind + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd
    var funTrEnd = '</tr></tbody></table>';
    if(!oband.gridtype) oband.gridtype = 0;
    switch(oband.gridtype)
    {
        case 1:break;
        case 2:  //编辑无保存
            var fun = funTr + stradd + strdel + strins + strrep + strprn + strfind + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 3:  //编辑无保存
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strfind + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 4:  //编辑无页码
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strfind + strmsg + strfunHead + funTrEnd;
            gridtop.push(fun);break;
        case 5:  //编辑并下拉页码
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strprn + strfind + strmsg + strfunHead + strNavPage + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 6:  //浏览
            var fun = funTr + strprn + strfind + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 7:  //浏览简单页码
            var fun = funTr + strfind + strmsg + strfunHead + strNavPage + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 8:  //新编辑
            //var fun = funTr + stradd + strdel +strsave + strprn + strmsg + strfunHead + funTrEnd;
            break;            
        default:
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strprn + strfind + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);     
    }
    gridtop.push("</tr></tbody></table></div>"); 
    //srcdiv.outerHTML = gridtop.join("");   
    if(!$(srcdiv)) return;
    if(type=="out")
        $(srcdiv).outerHTML = gridtop.join("");   
    else $(srcdiv).innerHTML = gridtop.join("");   

    tabdiv = $(srcdiv + "_GridDiv");
    if(!tabdiv)	return;
    
    this.GridDiv=tabdiv;	//Grid底板
    tabdiv.Grid=this;
    //把Grid加入document的访问列表中
    var gridList=document.GridList;
    var gridName = oband.ID;
    if(!gridName || ""==gridName)
	    if(!gridList)
		    gridName="Grid0";
	    else
		    gridName="Grid"+gridList.length;	
    //加入数组中
    if(!gridList)
    {
	    document.GridList=new Array();	
	    gridList=document.GridList;
    }
    var inullGrid=-1;	//在数组中为空的序号
    for(var i=0;i<gridList.length;i++)
    {
	    if(!gridList[i])
	    {	
		    inullGrid=i;continue;
	    }
	    if(gridName==gridList[i].gridName)
	    {
		    gridList[i].GridDiv=tabdiv;
		    inullGrid=gridList.length+1;
		    break;
	    }
    }	
    if(inullGrid<0)
	    gridList[gridList.length]=new function()
	    {
		    this.gridName=gridName;
		    this.GridDiv=tabdiv;
	    };
    else if(inullGrid<gridList.length)
	    gridList[inullGrid]=new function()
	    {
		    this.gridName=gridName;
		    this.GridDiv=tabdiv;
	    };
    this.Name=gridName;		//Grid的唯一名
    this.ItemName="";		//Grid的对应项目名称
    //滚动控制的控制,标题区,明细区,脚注区,功能区
    this.DivBody    =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
    this.DivDetail  =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
    this.DivTitle   =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");
    this.DivFunArea =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","funarea");
    //标题、明细、脚注Table
    this.TabTitle   =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","title");
    this.Table      =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","detail");
    this.TabFoot    =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","foot");
    //if(oband.RecordCount()==0) this.Table.style.display="none";
    this.Cols = cols;
    this.Table.Grid     =   this;
    this.TabTitle.Grid  =   this;
    oband.Grid = this;
    if(this.TabFoot) this.TabFoot.Grid=this;
	this.HiddenFoot =false;	
	if(this.TabFoot && this.TabFoot.id!="specialdisplay") 
	    this.TabFoot.style.display="none";
    
    //数据岛属性
    this.XmlLand    = oband.XmlLandData;		//明细数据岛
    this.XmlChanged = oband.XmlChanged;          //删除的数据岛
    this.XmlSchema  = oband.XmlSchema;	        //明细数据结构数据岛
    this.XmlSum     = oband.XmlSum;		    //汇总数据的数据岛
    this.XmlSumTemp = oband.XmlSumtemp;	        //汇总数据的临时数据岛
	this.Event=new function(){ this.rowIndex=-1;this.colName="";}
	this.AfterRowChanged=null;
	this.AfterCellEditChanged=null;
	this.AfterSum=null;
	this.AfterNewRecord=null;
	this.DbClickHandle=null;
	this.AfterSave=null;
	this.isimport=false;
	this.copyindex=null;

    this.actBgColor	= "#FFDF6B";
    this.actFacColor= "black";
	
    this.curBgColor= "#3A7B9C";
    this.curFacColor= "white";
	
    this.curOverBgColor="#E8E8E8";
    this.curOverFacColor="black";
	
    this.browseBgColor="white";
    this.browseFacColor="black";
	
    this.selBgColor="#00309C";
    this.selFacColor="white";
	
    this.borderColor="#ece9d8";

    this.warnFacColor="red";
    this.warnBgColor="#FCFCFC";
    this.curTd=null;
    this.curTr=null;
    this.RowSelectedList=new Array();
    this.Band=oband;
    this.ItemName=oband.ItemName;
    var tabheight  = tabdiv.offsetHeight;
    var tabtop     = tabdiv.offsetTop;
    var divh;
    
    if(tabdiv.style.height.indexOf("%")>-1)
    {
        var _h = tabheight - tabtop;
        if(_h>0)
        {
            if(tabtop>0)
                tabdiv.style.pixelHeight = tabheight - tabtop -4; 
            else
                tabdiv.style.pixelHeight = tabheight - tabtop; 
            _h = parseInt(tabdiv.style.height.replace("%",""));
            if(_h>100) h = _h/100+"%";
            else _h=_h+"%";
            divh = _h;
        }
    }
    if(this.DivBody.style.height.indexOf("%")<0)
        this.DivBody.style.height   =   tabdiv.style.height;

    if(this.DivDetail.style.height.indexOf("%")>-1)
    {
        _h = this.DivBody.offsetHeight-this.DivTitle.offsetHeight;
        if(_h>0)
        {
            this.DivDetail.style.pixelHeight = _h;
            var _height = parseInt(this.DivDetail.style.height.replace("%",""));
            if(_height>100)
                this.DivDetail.style.height = _height/100+"%";
        }
    }
}   

function griddict(fldname,oband,dataitem,textcol,valuecol)
{
    var s = "";
    if(dataitem=="")
    {
        if(!oband.dicts || oband.dicts=="" || !ToolUtil.valueTag(oband.dicts,fldname)) return;
        var texts = ToolUtil.valueTag(oband.dicts,fldname).split("/");
        var vals=texts;
        for(var m=0;m<vals.length;m++)
            s=s+'<option value="'+vals[m]+'">'+texts[m]+'</option>';
    }
    else{
    var xmlhttp = oband.querydict(dataitem+";table");
    var texts = xmlhttp.responseXML.selectNodes("//table//" + textcol);
    var vals  = xmlhttp.responseXML.selectNodes("//table//" + valuecol);
    for(var m=0;m<vals.length;m++)
        s=s+'<option value="'+vals[m].text+'">'+texts[m].text+'</option>';
    }
    return s;
}

function XDict(objinput,objbox,oitem)
{
    var ops = objbox.options;
    if(ops.options.length>0) return;        
    var dtitem = (!objinput.datasourceid)?oitem.dataitem:objinput.datasourceid;
    var dttext = (!objinput.datatextfield)?oitem.textcol:objinput.datatextfield;
    var dtvalue = (!objinput.datavaluefield)?oitem.valuecol:objinput.datavaluefield;
    var xmlhttp = ue_ajaxdom(dtitem);
    if(!xmlhttp) {alert("查询错误，请检查数据源【"+dtitem+"】");return false;}
    var texts = xmlhttp.selectNodes("//table//" + dttext)
    var vals  = xmlhttp.selectNodes("//table//" + dtvalue);
    var tags  = xmlhttp.selectNodes("//table/tag");
    ops.add(new Option("",""));
    for(var m=0;m<vals.length;m++)
    {
        var opt   = new Option(texts[m].text,vals[m].text);
        if(tags[m]) opt.id   = tags[m].text;
        opt.title = vals[m].text;
        ops.add(opt);
    }
    objbox.value=objinput.value;
    return true;
}

var _p=XGrid.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//Grid初始化数据岛关系
_p.dataBindRefresh=function(xmlLand)
{
	if(!xmlLand && !this.XmlLand && this.Table.dataSrc)
		xmlLand=$(this.Table.dataSrc.substr(1));
	if(!xmlLand)	return;
	this.ItemName=xmlLand.itemname;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	if(!band) return;
	band.Grid=this;
	this.Band=band;
	if(!xmlLand || !xmlLand.XMLDocument)
	    return;
	var Htmldoc=xmlLand.parentElement.ownerDocument;
	var xmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	if(!xmlSchema || !xmlSchema.XMLDocument || xmlSchema.XMLDocument.documentElement.childNodes.length<1)
		return null;
	//获取数据岛结构xml属性:grid.XmlSchema
	this.XmlLand=xmlLand;
	this.XmlChanged=Htmldoc.getElementById(xmlLand.id+"_Delete");
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.XmlDict=Htmldoc.getElementById(xmlLand.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(xmlLand.id+"_Sum");
	if("#"+this.XmlLand.id!=this.Table.dataSrc)
		this.Table.dataSrc="#"+this.XmlLand.id;
	if(this.XmlSum)
	    if(this.TabFoot)
		    this.TabFoot.dataSrc="#"+this.XmlSum.id;
	this.Table.style.display="none";
	if(this.TabFoot  && this.TabFoot.id!="specialdisplay")
	    this.TabFoot.style.display="none";
	var bandM=this.Band.getBandM();
    if(!bandM || !bandM.ManualRefresh || "Detail"!=this.Band.itemType)
	    this.Sum();
}
//设置功能区翻页标签数据
_p.clearFunArea=function()
{
	var  div=this.DivFunArea;
	if(!div)    return;
	var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblCurrentPage");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText=0;

	lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblTotalPages");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText=0;

	var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblRecordCount");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText="0";

    var ctrlsel=ToolUtil.getCtrlByNameD(false,div,"name","ddlPageIndex");
    if(!ctrlsel) return;
    ctrlsel.length=1;
    ctrlsel.options[0].value=1;
    ctrlsel.options[0].text=1;
}

//设置功能区翻页标签数据
_p.setFunArea=function()
{
	var  div=this.DivFunArea;
	if(!div)    return;
	if(this.XmlSum && this.XmlSum.XMLDocument)
	{
		//当前页码
		var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblCurrentPage");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=xmlNodePageIndex.text;
			else
				lbctrl.innerText=xmlNodePageIndex.text;
		//总页数;并加入下拉框中
		var xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/TotalPage");
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblTotalPages");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=xmlNode.text;
			else
				lbctrl.innerText=xmlNode.text;
		var iTotalPage=ToolUtil.Convert(xmlNode.text,"int");
		var iPageIndex=ToolUtil.Convert(xmlNodePageIndex.text,"int");
		if(iTotalPage<1)	iTotalPage=1;
	    var ctrlsel=ToolUtil.getCtrlByNameD(false,div,"name","ddlPageIndex");
		if(ctrlsel && iTotalPage!=ctrlsel.length)
		{
		    var lenold=ctrlsel.length;
		    ctrlsel.length=iTotalPage;
		    for(var i=lenold-1;i<iTotalPage;i++)
		    {
		        ctrlsel.options[i].value=i+1;
		        ctrlsel.options[i].text=i+1;
		    }
		}
		if(ctrlsel && iPageIndex-1>-1)
	        ctrlsel.options[iPageIndex-1].selected=true;
		//记录总数
		xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/RecordCount");
		var iRecordCount=ToolUtil.Convert(xmlNode.text,"int");
		if(iTotalPage<2)
			iRecordCount=this.XmlLand.XMLDocument.documentElement.childNodes.length;
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblRecordCount");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=iRecordCount+"";
			else
				lbctrl.innerText=iRecordCount+"";
	}
}
//设置行标号;isRowCursor 是否更新行标
_p.setRowCursor=function(isRowCursor)
{
	if(!this.Table || !this.XmlLand || !this.XmlSchema || !this.XmlLand.XMLDocument || this.Table.dataSrc!="#"+this.XmlLand.id 
			|| !this.XmlLand.XMLDocument.documentElement || !this.XmlLand.XMLDocument.documentElement.hasChildNodes())
	{
	    this.clearFunArea();
		return;
    }
	var iPageSize=ToolUtil.Convert(this.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
	if(xmlNodePageIndex)
		var iPageIndex=ToolUtil.Convert(xmlNodePageIndex.text,"int");
	if(null==iPageIndex || isNaN(iPageIndex))
		iPageIndex=1;
	//行光标列
	var xmlRow=this.XmlLand.XMLDocument.documentElement.firstChild;
	var irow=0;
	if(isRowCursor)
	    while(xmlRow && irow<xmlRow.parentNode.childNodes.length)
	    {
	        var xmlNode=xmlRow.selectSingleNode("RowNum");
	        if(!xmlNode)    break;
	        xmlNode.text=irow+1+(iPageIndex-1)*iPageSize;
	        irow++;
	        xmlRow=xmlRow.nextSibling;
	    }
	this.setFunArea();
}


//汇总Grid脚注
_p.Sum=function()
{
	if(!this.XmlSchema)				return;
	//if(true==this.HiddenFoot)		return;
	if(!this.TabFoot) return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sum();
	this.HiddenFoot=true;
	var footCols=ToolUtil.getCtrlListByNameD(false,this.TabFoot,"datafld");
	for(var i=0;footCols && i<footCols.length;i++)
	{
		if(!this.XmlSum)	break;
		if(!footCols[i].dataFld || ""==footCols[i].dataFld )
			continue;
		var xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/"+footCols[i].dataFld);
		if(!xmlNode)	continue;
		this.HiddenFoot=false;break;
	}
	if(band.RecordCount()<2)
		this.HiddenFoot=true;
	if(true==this.HiddenFoot  && this.TabFoot.id!="specialdisplay")
		this.TabFoot.style.display="none";
	else
		this.TabFoot.style.display="";
	if(!this.HiddenFoot && ""==this.TabFoot.dataSrc)
		this.TabFoot.dataSrc="#"+this.XmlLand.id+"_Sum";
}

//设置当前单元格
_p.setActiveCell=function(tdcur)
{
	if(!tdcur || !tdcur.tagName || "TD"!=tdcur.tagName)
		return;
	var trcur=ToolUtil.getCtrlByTagU(true,tdcur,"TR","rowType","detail");
	if(this.curTd==tdcur || !trcur)
		return;
	var ctrlCol=ToolUtil.getCtrlByNameD(false,tdcur,"colname");
	var datastyle=tdcur.getAttribute("datatype");
	if(!ctrlCol && (!datastyle || ""==datastyle))
		return;
	//数据所在表格,及对应数据岛数据结构,列节点
	try{
	if(this.XmlLand.recordset.AbsolutePosition-1 != trcur.rowIndex)
		this.XmlLand.recordset.AbsolutePosition = trcur.rowIndex + 1;
    }catch(ex){return false;}
	//在当前行的单元格上切换时只改变单元格的颜色
	if(this.curTd!=tdcur && this.curTr==trcur)
	{
		this.setCtrlStateColor(this.curTd,"current");
		this.setCtrlStateColor(tdcur,"actived");
		this.curTd=tdcur;
		return;
	}
	//当前行也改变,首先恢复行颜色,然后设置当前行和当前单元格颜色
	//激活行也是选择行,行有isSelected属性
	for(var rowIndex=0;rowIndex<this.RowSelectedList.length;rowIndex++)
	{
		for(var i=0;i<this.RowSelectedList[rowIndex].cells.length;i++)
		{
			var cell=this.RowSelectedList[rowIndex].cells[i];
	        var datastyle=cell.getAttribute("datatype");
			if(!datastyle || ""==datastyle)
				continue;
			this.setCtrlStateColor(cell,"browse");
			this.RowSelectedList[rowIndex].isSelected=false;
		}
	}
	var bcell=false;
	for(var i=0;i<trcur.cells.length;i++)
	{
		var cell=trcur.cells[i];
        var datastyle=cell.getAttribute("datatype");
		if(!datastyle || ""==datastyle)
			continue;
		if(cell===tdcur)
		{
			this.setCtrlStateColor(cell,"actived");
			bcell=true;
		}else
			this.setCtrlStateColor(cell,"current");
	}
	if(false==bcell)
		this.setCtrlStateColor(tdcur,"actived");
	trcur.isSelected=true;
	if(this.RowSelectedList.length>1)
		this.RowSelectedList=new Array();
	this.curTd=tdcur;
	this.curTr=trcur;
	this.RowSelectedList[0]=trcur;
}//_p.setActiveCell=function(tdcur)
_p.setFocus=function()
{
	var ctrl=ToolUtil.getCtrlByNameD(false,this.curTd,"colname");
	if(ctrl && "none"!=ctrl.style.display && "hidden"!=ctrl.style.visibility)
		try{ctrl.focus();}catch(ex){}
}
//设置ctrlContain的颜色类型;state值有：browse,current,actived,mouseover,selected;默认browse
_p.setCtrlStateColor=function(ctrlContain,state,init)
{
//    if(!event) return;
//    if(event && !event.srcElement) return;
	var bgColor,borderColor,faceColor;
	if(!ctrlContain)	return;
	if(!state)	state="browse";
	if(	ctrlContain.className=="readCellStyle") return;
	switch(state)
	{
		case "browse":
			bgColor    =this.browseBgColor;
			borderColor=this.browseFacColor;
			faceColor  =this.browseFacColor;
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");   
            if(!this.Band.CalXmlLand || !this.Band.CalXmlLand.RedWordCellList) break;
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		            faceColor = this.warnFacColor;
            }
			break;
		case "current":
			bgColor     = this.curBgColor;
			borderColor = this.curBgColor;
			faceColor   = this.curFacColor;
			break;
		case "actived":
			bgColor     = this.actBgColor;
			borderColor = this.actBgColor;
			faceColor   = this.actFacColor;
			break;
		case "mouseover":
			bgColor=this.curOverBgColor;
			borderColor=this.curOverBgColor;
			faceColor=this.curOverFacColor;
			
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname"); 
            if(!this.Band.CalXmlLand || !this.Band.CalXmlLand.RedWordCellList) break;   
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		        {
		            faceColor = this.warnFacColor;
		        }
            }
			break;
		case "selected":
			bgColor=this.selBgColor;
			borderColor=this.selBgColor;
			faceColor=this.selFacColor;
			break;
		case "warned":
			//bgColor=this.warnBgColor;
			faceColor=this.warnFacColor;
			break;
		default:
			bgColor=this.browseBgColor;
			borderColor=this.browseFacColor;
			faceColor=this.browseFacColor;
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
            if(!this.Band.CalXmlLand.RedWordCellList) break;    
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		        {
		            faceColor = this.warnFacColor;
		        }
            }
			break;
	}
	//判断红字
	if(init && init!=0 && this.Band.CalXmlLand.RedWordCellList)
	{
        var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
	    for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	    {
		    if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName)
		        faceColor = ctrlCol.runtimeStyle.color;
        }
    }    
    
//    var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
//    if(this.Band.CalXmlLand.RedWordCell(ctrlContain.recordNumber,ctrlCol.dataFld,ctrlCol.value))
//        faceColor=this.warnFacColor;
	var rootContain=ctrlContain;
	var aLink=rootContain.getElementsByTagName("A");
	if(aLink.length>0)  return;
	var discolor=rootContain.getAttribute("discolor");
	if("true"==discolor)    return;
	var oCell = ctrlContain;
	while(ctrlContain)
	{
		//设置颜色特性
		if(ctrlContain.runtimeStyle)
		{
			with(ctrlContain.runtimeStyle)
			{
				backgroundColor = bgColor;
				borderColor     = borderColor;
				color           = faceColor;
			}
		}
		//首先遍历子级,同级下一节点
		var ctrlTmp=ctrlContain.firstChild;
		if(!ctrlTmp) ctrlTmp=ctrlContain.nextSibling;
		//向上遍历同级下一节点;如果这个节点是明细表cell就停止
		while(!ctrlTmp && ctrlContain.parentElement && rootContain!=ctrlContain.parentElement)
		{
			var ctrlPTmp=ctrlContain.parentElement.nextSibling;
			if(!ctrlPTmp)	ctrlContain=ctrlContain.parentElement;
			else			ctrlTmp=ctrlPTmp;
		}
		ctrlContain=ctrlTmp;
	}
}

//选择行; rowIndex行号;isSingle 是否单选模式,默认单选模式
_p.setSelectedRow=function(rowIndex,isSelected,isSingle)
{
	if(null==rowIndex || this.XmlLand.recordset.recordCount<1 || rowIndex>=this.XmlLand.recordset.recordCount)
		return;
	if(null==isSelected)	isSelected=true;
	if(null==isSingle)	isSingle==true;
	if(true==isSingle)
	{
		if(!this.curTd)
			curTd=ToolUtil.getCtrlByTagD(false,this.Table,"TD","colname");
		else
			curTd=this.curTd;
		curTd=this.Table.rows[rowIndex].cells[curTd.cellIndex];
		this.setActiveCell(curTd);
		return;
	}
	//设置选择行,可以多行选择模式
	curtr=this.Table.rows[rowIndex];
	if(curtr.isSelected==isSelected || curtr==this.curTr)
		return;
	for(var i=0;i<curtr.cells.length;i++)
	{
		var cell=curtr.cells[i];
        var datastyle=cell.getAttribute("datatype");
		if(!datastyle || ""==datastyle)
			continue;
		if(true==isSelected)
			this.setCtrlStateColor(cell,"selected");
		else
			this.setCtrlStateColor(cell,"browse");
	}
	curtr.isSelected=(true==isSelected)?true:false;
	this.RowSelectedList=new Array();
	for(var i=0;i<this.Table.rows.length;i++)
		if(this.Table.rows[i].isSelected && true==this.Table.rows[i].isSelected)
			this.RowSelectedList[this.RowSelectedList.length]=this.Table.rows[i];
}

//对于有选择框checked列风格Grid，返回用户选择的数据岛行节点数组
_p.setRowChecked=function()
{
	if(!this.HasRowChecked || !this.XmlLand || this.XmlLand.XMLDocument.documentElement.childNodes.length<1)
		return;
	var root=this.XmlLand.XMLDocument.documentElement;
	for(var i=0;i<this.Table.rows.length;i++)
	{
		var tr=this.Table.rows[i];
		var ctrlCheck=ToolUtil.getCtrlByTagD(false,tr,"INPUT",'datatype','selectrow');
		if(!ctrlCheck || "checkbox"!=ctrlCheck.type)
			break;
		if(!tr.recordNumber || tr.recordNumber<1)
			break;
		if(!root.childNodes[tr.recordNumber-1]) break;
		var isSelected=root.childNodes[tr.recordNumber-1].getAttribute("selected");
		isSelected=ToolUtil.Convert(isSelected,"bool");
		if(true==isSelected)
			ctrlCheck.checked=true;
		else
			ctrlCheck.checked=false;
	}
}
//删除选择的行
_p.DelRowSelected=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	for(var i=this.RowSelectedList.length-1;i>-1;i--)
	{
		var rowIndex=this.RowSelectedList[i].recordNumber-1;
		Band.DeleteRecord(rowIndex);
	}
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();
	this.setRowCursor(true);
}
//保存Grid列宽度的改变,利用xmlhttp方式
_p.saveWidth=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	//加入系统参数
	var xmldocP=this.XmlSchema.XMLDocument;
	ToolUtil.setParamValue(xmldocP, "UnitName", this.UnitName, "", "P", "", "C");
	ToolUtil.setParamValue(xmldocP, "Command", "SaveWidth", "", "P", "", "T");
    this.XmlSchema.XMLDocument.documentElement.setAttribute("UnitItem",myUnitItem.UnitName);
    this.XmlSchema.XMLDocument.documentElement.setAttribute("ItemName",this.ItemName);
    //提交更新数据的XMLDoc文档
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    try
    {
        var xmlhttp=ToolUtil.SendPost(xmldocP);
    }catch(ex){
	    var result=ToolUtil.setValueTag("","成功","false");
	    result=ToolUtil.setValueTag(result,"提示","系统出错:保存失败!");
	    return result;
    }
    return unescape(xmlhttp.responseText);
}
//对Grid排序:colname列名称;ascdesc升降序:ascending 升序;descending 降序
_p.Sort=function(colname,datatype,ascdesc)
{
	if(!this.XmlSchema)		return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sort(colname,datatype,ascdesc);
}

//文件结尾
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;