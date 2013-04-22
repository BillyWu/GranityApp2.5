function isInArray(s,arr)
{
    for(var i=0;i<arr.length;i++)
        if(arr[i]==s) return true;
    return false;
}
function BGrid(srcdiv,oband,type,haschk,boxtype,strmau)
{
    // 框架及表头
    if(!oband) {alert("数据错误,请检查！");return;};
    if(oband.Grid && !oband.StrongGrid) return;
    var minwidth = (oband.minwidth)?oband.minwidth:"60px";
    var cols = oband.Cols("1");
    if(!cols) return;
    var im = 1; var smerges = ""; //所有参于merge的字段
    if(!strmau) strmau="";
    var hasMerge;
    if(oband.merges!=null) 
    {
        im=2;var shasMerge="";
        var strmerges = oband.merges.split(";");
        for(var m=0;m<strmerges.length;m++)
        {
            var am = strmerges[m].split("=");
            smerges = smerges + "," + am[1];
            shasMerge = shasMerge + ",false";
        }
        hasMerge = shasMerge.substring(1,shasMerge.length).split(",");
    }
    var tbTitclass = "class='ctabTitle'";       if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tbTitclass="class='ctabWTitle'";
    var tbdetailclass = "class='ctabDetail'";   if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tbdetailclass="";    
    var tdTitclass = "class='cellwb_btn'";      if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tdTitclass="";
    var tdGridclass= "class='GridWB'";          if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tdGridclass="bgcolor=''";
    var tdfunclass = "class='lt0a'";            if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tdfunclass="";    
    var tdstepclass = "class='ltsep'";          if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") tdstepclass="";    

    var strDivinit = "<div id='"+ srcdiv +"_GridDiv' style='height:100%;width:100%;'><table "+ tdGridclass +" cellpadding=0 cellSpacing=0 style='width:100%;height:100%' tabType='grid'>"+
        "  <tbody><tr><td divtype='body' colspan='4' valign='top'><div divtype='title' align='left' class='ws'  style='overflow-x:auto;overflow-y:scroll;width:100%'>"+
        "          <table tabType='title' "+ tbTitclass +" cellpadding=0 cellSpacing=0 height="+ (im*22+1) +"px><tbody>"
    var gridtop =[strDivinit];
    if(haschk) icolspan = cols.length + 1
    else icolspan = cols.length;
    var blname = "";var isFoot = false;
    var GridTitle = null;
    if(oband.title) GridTitle = (oband.title!="")?oband.title:oband.UnitItem.UnitName;
    if(GridTitle)
    {
        if(oband.gridtype==8)
            gridtop.push('<tr rowType="titlename"><td '+ tdTitclass +' align="center" height="25" colspan="'+icolspan+'">'
            +'<div class="gridtitle"><div class="griddv3"><A class="linkbtn_0" href="#" onclick="ue_bandadd();"><img border="0" src="Images/add.gif" />&nbsp;增加</A>&nbsp;<A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存&nbsp;</A></div>'
            +'<div class="griddv1">&nbsp;'+strmau+'</div><div class="griddv2">'+GridTitle+'</div></div></td></tr>');
        else if(oband.gridtype==9 || oband.gridtype==91)
            gridtop.push('<tr rowType="titlename"><td '+ tdTitclass +' align="center" height="25" colspan="'+icolspan+'">'
            +'<div class="gridtitle"><div class="griddv3"><A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存&nbsp;</A></div>'
            +'<div class="griddv1"></div><div class="griddv2">'+GridTitle+'</div></div></td></tr>');
        else gridtop.push('<tr rowType="titlename"><td '+ tdTitclass +' align="center" height="22" colspan="'+icolspan+'">'+GridTitle+'</td></tr>');
    }
    for(var i=0;i<im;i++)
    {
        gridtop.push("<tr rowType='title'>");
        var rowdatatype =" datatype='xs:int' ";
        if(oband.gridtype=="20" || oband.gridtype=="21" || oband.gridtype=="201") rowdatatype="";
        if(i==0)
        {
            gridtop.push("<td align='center' tdType=coltitle  "+rowdatatype+" height="+ (im*22+1) +"px colname='RowNum' "+ tdTitclass +" width=45 rowspan='"+ im +"'>序号</td>");
            if(haschk) gridtop.push('<td '+ tdTitclass +' align="center" width="40" height='+ (im*22+1) +'px rowspan="'+im+'"><span width="100%" height="100%" colname="">选择</span></td>');
        }
        for(var j = 0; j < cols.length; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(colitem.foot!="") isFoot=true;       //是否有脚注行
            if(colitem.name=="RowNum" || colitem.idkey || ("Detail"==oband.itemType && colitem.name==oband.linkCol)) continue;
            if(colitem.width=="") colitem.width = minwidth;
            if(oband.mw) colitem.width=oband.mw;

            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(oband.freecols && colitem.name==oband.freecols) colitem.width="";
            else 
                if(!oband.freecols && j==cols.length-1) colitem.width="";
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;
            var colname = colitem.name;
            var coltitle = colitem.title;
            if(oband.merges)
            {
                //如果不存在于merge字段，则列合并
                var asmerges = smerges.split(",");
                if(!isInArray(colname,asmerges))
                {
                    if(i==0) gridtop.push("<td align='center' tdType=coltitle rowspan='2' datatype='xs:"+colitem.datatype + "' height="+ (im*22+1) +"px colname='"+colname+"' "+ tdTitclass + _sw +" onmouseup=GridUtil.usOnTitMouseUp() onmousemove=GridUtil.usOnTitMouseMove() ondblclick=GridUtil.usOnTitClick()>" + coltitle +"</td>");
                    continue;
                }
                else 
                {
                    if(i==1) 
                        gridtop.push("<td align='center' tdType=coltitle datatype='xs:"+colitem.datatype + "' height=22px colname='"+colname+"' "+ tdTitclass + _sw +" onmouseup=GridUtil.usOnTitMouseUp() onmousemove=GridUtil.usOnTitMouseMove() ondblclick=GridUtil.usOnTitClick()>" + coltitle +"</td>");
                    else
                    {
                        for(var m=0;m<strmerges.length;m++)
                        {
                            var am = strmerges[m].split("="); var arrelm = am[1].split(",");
                            if(isInArray(colname,arrelm) && hasMerge[m]=="false")
                            {
                                gridtop.push("<td align='center' tdType=coltitle colspan=" + arrelm.length +" height=22px "+ tdTitclass +">" + am[0].replace("@","") +"</td>");
                                hasMerge[m] = "true";
                                break;
                            }
                        }
                    }
                }
            }
            else    
                gridtop.push("<td align='center' tdType=coltitle  datatype='xs:"+colitem.datatype+"' height=22px colname='"+colname+"' "+ tdTitclass + _sw +" onmouseup=GridUtil.usOnTitMouseUp() onmousemove=GridUtil.usOnTitMouseMove() ondblclick=GridUtil.usOnTitClick()>" + coltitle +"</td>");
        }
        gridtop.push("</tr>");
    }
    gridtop.push("</tbody></table></div>");

    // ---------------------------------------------------------------//
    var sdetail = "<div divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%' onscroll='GridUtil.usOnScrollHori();'>"
      +"<table width='100%' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0' onmousemove='GridUtil.usOnDetailMouseOverHandle();' \
      onmouseout='GridUtil.usOnDetailMouseOutHandle();'>"
      +"<tbody>";
    gridtop.push(sdetail);
    var rnt = oband.RecordCount();
    for(var i = 0; i < rnt; i++)
    {
        gridtop.push("<tr rowType='detail'>");
        var colitem     = oband.ColObj(cols[cols.length-1]);
        if(colitem.name=="RowNum") colitem.width="45px";
        var _sw = " width="+ colitem.width;
        colvalues = oband.getFldStrValue(colitem.name,i);
        var align="center";var strclass="cellwb_btn";var sdatatype="";
        var _id = oband.ItemName + colitem.name + "_" + i;
        var tdtext = "<td height=22px align='"+ align +"' colname='"+colitem.name+"' id='"+_id+"' class='"+ strclass +"'"+ _sw 
        +" onclick='GridUtil.usOnCellFocusHandle();' "+sdatatype+">"+ colvalues +"</td>";
        gridtop.push(tdtext);
        for(var j = 0; j < cols.length-1; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(colitem.name=="RowNum" || colitem.idkey || ("Detail"==oband.itemType && colitem.name==oband.linkCol)) continue;            
            if(colitem.width=="") colitem.width = minwidth;
            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(j==cols.length-1) colitem.width="";
            if(oband.freecols && colitem.name==oband.freecols) colitem.width="";        
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;
            var colvalues="";
            var colxml="";
            colvalues = oband.getFldStrValue(colitem.name,i);
            if(colvalues=="") colvalues="　";
            var align="left";
            var strclass = "cellStyle";
            sdatatype = "datatype='" + colitem.datatype+"'";
            var sformat = "";  
            if(colitem.format!="") sformat = " format="+colitem.format;
            
            switch(colitem.datatype)
            {
                case "string":
                    if(colitem.datastyle=="strcenter") align="center";else align="left";
                    break;
                case "blink":
                    colvalues="<a style='color: #000' href='#' class='gridlink' target='_self' cellindex="+j+" rowindex="+i+" onclick='"+colitem.onclick+"' colname='"+colitem.name+"' item='"+oband.ItemName+"'>"+colvalues+"</a>";
                    align="center";
                    break;                    
                case "boolean":
                    colvalues = "<input type='checkbox' cellindex="+j+" rowindex="+i+" id='chk"+i+"'>";align="center";
                    break;
            }
            var _id = oband.ItemName + colitem.name + "_" + i;
            var tdtext = "<td align='"+ align +"' colname='"+colitem.name +"' item='"+oband.ItemName+"' id='"+_id+"' cellindex="+j+" rowindex="+i+" class='"+ strclass +"'"+ _sw 
            +" onclick='GridUtil.usOnCellFocusHandle();' "+sdatatype+">"+ colvalues +"</td>";
            gridtop.push(tdtext);
        }
        gridtop.push("</tr>"); 
    }
    if(isFoot)
    {
        var strfoot = "<td align='center' tdType=\"rowcursor\" colname='RowNum' height=22 class='cellwb' width=45px>合计</td>"; 
        for(var j = 0; j < cols.length-1; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(colitem.width=="") colitem.width = minwidth;
            if(oband.mw) colitem.width=oband.mw;

            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(oband.freecols && colitem.name==oband.freecols) colitem.width="";
            else 
                if(!oband.freecols && j==cols.length-1) colitem.width="";
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;

            if(colitem.name=="RowNum" || colitem.idkey || ("Detail"==oband.itemType && colitem.name==oband.linkCol)) continue;            
            strfoot = strfoot + "<td align='right' tdType='coldata' colname='"+colitem.name+"' class='cellwb'"+ _sw +" ><span width=100% colname='"+colitem.name+"'>　</span></td>";
        }    
        var tfoot = '<table tabType="foot" class="ctabDetail" cellpadding="0" cellSpacing="0"><tbody><tr rowType="foot">'
        +strfoot+'</tr></tbody></table>';
        gridtop.push(tfoot);
    }
    gridtop.push("</tbody></table></div></td></tr>");
    //----------功能区
    var stradd = '<td '+ tdfunclass +' width="16px" height="26px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_bandadd();" title="增加记录" src="Images/grid/addgrid.gif" onmouseover="this.src=\'Images/grid/addgrid_down.gif\'" onmouseout="this.border=0;this.src=\'Images/grid/addgrid.gif\'" width="22" height="22" /></A></td><td '+ tdfunclass +' width="2px"><span '+tdstepclass+'>|</span></td>';
    var strdel = '<td '+ tdfunclass +' width="16px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_banddelete();" title="删除所选择的记录" src="Images/grid/deletegrid.gif" onmouseover="this.src=\'Images/grid/deletegrid_down.gif\'" onmouseout="this.src=\'Images/grid/deletegrid.gif\';border=0" width="22" height="22" /></A></td><td '+ tdfunclass +' width="2px"><span '+tdstepclass+'>|</span></td>';
    var stredit = '<td '+ tdfunclass +' width="16px"><A class="linkbtn_1" href="#"><img border="0" onclick="" title="编辑" src="Images/bianji.gif" /></A></td><td '+ tdfunclass +' width="4px"><span '+tdstepclass+'>|</span></td>';
    var strins = '<td '+ tdfunclass +' width="20px"><A class="linkbtn_1" href="#"><img title="在当前位置插入记录行" border="0" onclick="ue_bandinsert();" src="Images/grid/insertgrid.gif" onmouseover="this.src=\'Images/grid/insertgrid_down.gif\'" onmouseout="this.src=\'Images/grid/insertgrid.gif\'" width="22" height="23" /></A></td><td '+ tdfunclass +' width="8px"><span '+tdstepclass+'>|</span></td>';
    var strrep = '<td '+ tdfunclass +' width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_replace();" src="Images/replace.ico" alt="替换记录内容" /></A></td><td '+ tdfunclass +' width="8px"><span '+tdstepclass+'>|</span></td>';
    var strsave = '<td '+ tdfunclass +' width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_save();" src="Images/save.gif" onmouseover="this.src=\'Images/grid/savec.gif\'" onmouseout="this.src=\'Images/grid/save.gif\';border=0" alt="保存" /></A></td><td '+ tdfunclass +' width="8px"><span '+tdstepclass+'>|</span></td>';
    var strrefresh = '<td '+ tdfunclass +' width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ue_reQuery();" src="Images/run.gif" alt="刷新" /></A></td><td '+ tdfunclass +' width="8px"><span '+tdstepclass+'>|</span></td>';
    var strprn = '<td '+ tdfunclass +' width="20px"><A class="linkbtn_1" href="#"><img border="0" onclick="ux_print();" src="Images/printer0.gif" onmouseover="this.src=\'Images/printer.gif\'" onmouseout="this.border=0;this.src=\'Images/printer0.gif\'" alt="打印" /></A></td><td '+ tdfunclass +' width="8px"><span '+tdstepclass+'>|</span></td>';
    var strfind = '<td width="120" '+ tdfunclass +'>&nbsp;<input class="tinput" type="text" name="T1" size="7" onfocus="this.nextSibling.value=\'查找\'" /><input '
                +'type="button" class="txtbtn" value="查找" name="B3" onclick="ue_bandsearch(this.previousSibling.value,\'下一个\'==this.value);this.value=\'下一个\';" /></td>';
    var strdraftup = '<td width="110" '+ tdfunclass +'><div id="sysbtn" style="width:100px;"><a href="#" class="linkbtn_0" title="起草一个新办件"  onclick="ue_addbill();">【起草】</a>　<A class="linkbtn_0" href="#" onclick="ue_refresh();" ><img border="0" src="Images/run.gif" alt="刷新数据"/></A></div></td>';
    var strselectbtn = '<td width="150" '+ tdfunclass +'><a href="#" class="linkbtn_0" onclick=ue_selectAll("'+oband.ItemName+'")>【全选】</a><a href="#" class="linkbtn_0" onclick=RSelectAllRows("'+oband.ItemName+'");>【反选】</a><a href="#" class="linkbtn_0" onclick=ClearSelAll("'+oband.ItemName+'");>【清空】</a></td>';
    var strmsg = '<td '+ tdfunclass +' name="message" id="message" style="color: #FF0000;">　</td>';
    var strfunHead = '<td align="right" '+ tdfunclass +'>';
    var strNavPage = '页次:<input size="1" style="TEXT-ALIGN:right;" class="lt0c" name="lblCurrentPage" value="0" />/<input style="TEXT-ALIGN:left" class="lt0c" size="1" name="lblTotalPages" value="0" />总数:<input name="lblRecordCount" size="1" style="TEXT-ALIGN:left;width:40px" class="lt0c"  value="0" />';
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
            var fun = funTr + stradd + strdel + strins + strrep + strprn + strfind + strrefresh + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 3:  //编辑无保存
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strfind + strrefresh +  strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 4:  //编辑无页码
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strfind + strrefresh +  strmsg + strfunHead + funTrEnd;
            gridtop.push(fun);break;
        case 5:  //编辑并下拉页码
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strprn + strfind + strrefresh +  strmsg + strfunHead + strNavPage + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;
        case 6:  //浏览
            var fun = funTr + strprn + strfind + strrefresh +  strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 61:  //浏览
            var _s ="";
            if(oband.barcode) _s="<td style='width:100%' "+ tdfunclass +">"+oband.barcode+"</td>";
            var fun = funTr + _s  + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 10:  //浏览方式带起草按钮
            var fun = funTr + strprn + strfind + strdraftup + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 20:  //浏览方式白表单带起草按钮
            oinput = '选择新办件：<span style="WIDTH:120" id="wfname" class="xlandspan" datasourceid="exec wf_newbills @UserAccounts" datatextfield="流程" datavaluefield="流程"></span>'
            var _btn = '<input title="要选择吗，点我一下..."  type=button value="..." style="width:22px;height:20px"  onclick="Ycbo()" />';
            var fun = funTr + "<td style='WIDTH:230;' valign=bottom>　"+oinput + _btn + "</td>"+strdraftup +  strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 201:  //浏览方式白表单带起草按钮
            var fun = funTr + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 21:  //浏览方式白表单无起草按钮
            var fun = funTr +  strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 11:  //浏览
            var fun = funTr + strprn + strfind +  strrefresh + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 12:  //浏览无打印
            var fun = funTr + strfind +  strrefresh + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 13:  //浏览无打印,带选择钮
            var fun = funTr + strfind + strrefresh + strselectbtn+ strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 14:  //浏览无打印,带选择钮
            var fun = funTr + strfind + strrefresh + strselectbtn+ strfunHead + funTrEnd;
            gridtop.push(fun);break;            
        case 7:  //浏览无打印,简单页码
            var fun = funTr + strfind +  strrefresh + strmsg + strfunHead + strNavPage + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);break;            
        case 17:break;
        case 8:  //新编辑
            //var fun = funTr + stradd + strdel +strsave + strprn + strmsg + strfunHead + funTrEnd;
            if(!GridTitle)
            {
                var _s = '<td '+ tdfunclass +' align="right" style="height:22px"><A class="linkbtn_0" href="#" onclick="ue_bandadd();"><img border="0" src="Images/add.gif" />&nbsp;增加</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存</A></td>'
                if(oband.isPrint) _s=strprn+_s;
                if(oband.barcode) _s="<td "+ tdfunclass +">"+oband.barcode+"</td>"+_s;
                var fun = funTr + _s + funTrEnd;
                gridtop.push(fun);
            }
            break;            
        case 81:  //新编辑事导航
            //var fun = funTr + stradd + strdel +strsave + strprn + strmsg + strfunHead + funTrEnd;
            if(!GridTitle)
            {
                var _s = '<td '+ tdfunclass +' align="right" style="height:22px">'+strNavPage+  strNav + strNavSl + '　　<A class="linkbtn_0" href="#" onclick="ue_bandadd();"><img border="0" src="Images/add.gif" />&nbsp;增加</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存</A></td>'
                if(oband.isPrint) _s=strprn+_s;
                if(oband.barcode) _s="<td "+ tdfunclass +">"+oband.barcode+"</td>"+_s;
                var fun = funTr + _s + funTrEnd;
                gridtop.push(fun);
            }
            
            break;            
        case 9:  //新编辑,no add
            //var fun = funTr + stradd + strdel +strsave + strprn + strmsg + strfunHead + funTrEnd;
            if(!GridTitle)
            {
                var _s = '<td '+ tdfunclass +' align="right" style="height:22px"><A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A>&nbsp;&nbsp;<A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存</A></td>'
                if(oband.barcode) _s="<td "+ tdfunclass +">"+oband.barcode+"</td>"+_s;
                var fun = funTr + _s + funTrEnd;
                gridtop.push(fun);
            }
            break;            
        case 91:  //新编辑,only save
                var _s = '<td '+ tdfunclass +' align="right" style="height:22px"><A class="linkbtn_0" href="#" onclick="ue_save()"><img border="0" src="Images/savesmall.gif" />&nbsp;保存</A></td>'
                if(oband.barcode) _s="<td "+ tdfunclass +">"+oband.barcode+"</td>"+_s;
                var fun = funTr + _s + funTrEnd;
                gridtop.push(fun);
            break;            
        case 19:  //新编辑,only del
            var _s = '<td '+ tdfunclass +' align="right" style="height:22px"><A class="linkbtn_0" href="#" onclick="ue_banddelete();"><img border="0" src="Images/delete.gif" />&nbsp;删除</A></td>'
            if(oband.barcode) _s="<td "+ tdfunclass +">"+oband.barcode+"</td>"+_s;
            var fun = funTr + strfind + _s + funTrEnd;
            gridtop.push(fun);
            break;            
        default:
            var fun = funTr + stradd + strdel + strins + strrep + strsave + strprn + strfind +  strrefresh + strmsg + strfunHead + strNavPage + strNav + strNavSl + strfunEnd + funTrEnd;
            gridtop.push(fun);     
    }
    
    //
    gridtop.push("</tbody></table></div>"); 
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
	this.CtrlMsg=ToolUtil.getCtrlByNameD(false,this.GridDiv,"name","message");		//模板内提示信息控件    
	var ctrlTest=ToolUtil.getCtrlByTagD(false,this.Table,'INPUT','datatype','selectrow');
	if(ctrlTest)
	    this.HasRowChecked=true;
	else
	    this.HasRowChecked=false;    
    this.Cols = cols;
    this.Table.Grid     =   this;
    this.TabTitle.Grid  =   this;
    oband.Grid = this;
    if(this.TabFoot) this.TabFoot.Grid=this;
	this.HiddenFoot =false;	
	if(this.TabFoot && this.TabFoot.id!="specialdisplay") 
	    this.TabFoot.style.display="none";
    
    //数据岛属性
    this.XmlLand    = oband.XmlLandData;	//明细数据岛
    this.XmlChanged = oband.XmlChanged;     //删除的数据岛
    this.XmlSchema  = oband.XmlSchema;	    //明细数据结构数据岛
    this.XmlSum     = oband.XmlSum;		    //汇总数据的数据岛
    this.XmlSumTemp = oband.XmlSumtemp;	    //汇总数据的临时数据岛
	this.Event=new function(){ this.rowIndex=-1;this.colName="";}
	this.AfterRowChanged=null;
	this.AfterCellEditChanged=null;
	this.AfterSum=null;
	this.AfterNewRecord=null;
	this.DbClickHandle=null;
	this.AfterSave=null;
	this.isimport=false;
	this.copyindex=null;
    this.ItemName = oband.ItemName;
    this.Sum();
    this.setRowCursor();
    if(oband.gridtype!="20" && oband.gridtype!="21" && oband.gridtype!="201" && oband.GridStyle!="套行"){
        this.actBgColor	= "#FFDF6B";    this.actFacColor= "black";
        this.curBgColor= "#3A7B9C";     this.curFacColor= "white";
        this.curOverBgColor="#E8E8E8";  this.curOverFacColor="black";
    	
        this.browseBgColor="white";     this.browseFacColor="black";
        this.selBgColor="#00309C";      this.selFacColor="white";
	    this.borderColor="#ece9d8";     this.warnFacColor="red";
        this.warnBgColor="#FCFCFC";     
    }
    this.curTd=null;
    this.curTr=null;                this.RowSelectedList=new Array();
    this.Band=oband;                this.ItemName=oband.ItemName;
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
    if(this.DivDetail.style.pixelHeight==0)
        this.DivDetail.style.height="88%";
}   

  function XPanel(banditem,divid,trtext,visiable)
  {
    var oband=$band(banditem);
    if(!oband) {alert("数据错误,请检查！");return;};
    var minwidth = (oband.minwidth)?oband.minwidth:"100";      
    if(!visiable) visiable="1";
    var cols = oband.PCols(visiable);
    if(!cols) return;    
    var strhtm = "";var _sw="";var needword="";
    var trtexts = "";
    if(trtext) trtexts = trtext.split("#");
    for(var i = 0; i < cols.length; i++)
    {
        var colitem     = oband.ColObj(cols[i]);
        if(colitem.chkcol) needword='<font color="#ff0000" face="Wingdings">v</font>';
        else needword='<font color="#ffffff" face="Wingdings">v</font>';
        if(colitem.name=="RowNum" || colitem.idkey ) continue;
        if(colitem.width=="") colitem.width = minwidth;
        if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
        if(colitem.width=="") _sw="";
        else _sw = " style='width:" + colitem.width + "'";
        if($band("edit").ForceWidth) _sw = " style='width:" + $band("edit").ForceWidth + "'";
        var colname = colitem.name;
        var coltitle = colitem.title;
        if(coltitle=="") coltitle=colname;
        var inputtype="";var strdisabled="";if(colitem.readonly) strdisabled=" disabled "
        var _btn = '<input title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  \
            style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Xcbo('+colitem.bandid+')"/>';
        var sformat = "";  
        var sformatfld = ""; 
        var sdatafld = "";
        if(colitem.format.indexOf("*")>-1)
        {
            var inputtype="password";
            colitem.format="";
        }
        else
            var inputtype="text";
            
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
        var strtag = "input";
        var colvalues="";
        switch(colitem.datatype)
        {
            case "string":
                colvalues = '<'+ strtag +_sw+' type="'+inputtype+'" datasrc="#'+oband.ID+'"  class="xlandinput"' + sdatafld  + sformatfld +'/>';
                break;
            case "boolean":
                colvalues ='<input type="checkbox" '+strdisabled+' class="xlandradio" datasrc="#'+oband.ID+'" ' + sdatafld + '/>';
                break;
            case "dateTime":
                colvalues ='<input type="text" '+ _sw +' class="xlanddate" datasrc="#'+oband.ID+'" '  + sdatafld  + sformatfld +'/>'
                break;                
            case "select":
                //colvalues = '<span style="WIDTH:120" class="xlandspan" datasrc="#商品资料Tab" datafld="'+colitem.name+'"></span>'
                colvalues = '<'+ strtag  + _sw +' type="text" datasrc="#'+oband.ID+'"  class="xlandinput"' + sdatafld  + sformatfld +'/>'
                +_btn;
                break;
            default:
                colvalues = '<input '+ _sw +' type="text" colname="'+colitem.name+'" class="xlandinput" datasrc="#'+oband.ID+'" '+ sdatafld  + sformatfld +'/>'
                break;
        }
        if(trtexts[0]==colitem.name) 
            colvalues=trtexts[1];
        if(colitem.datatype=="blink")
            var st = '<a href="#" style="width:70;text-align:right" target="_self" onclick="'+colitem.onclick+'" class="linkbtn" colname="'+colitem.name+'">'+coltitle+'：</a>';
        else
            var st = '<span style="width:70;text-align:right">'+coltitle+'：</span>';
        strhtm = strhtm + st +colvalues+needword+"<br/>";
    }
    if($(divid)) $(divid).innerHTML="<p style=\"margin:10\"></p>"+strhtm;
  }

  function YPanel(banditem,divid,trtext,visiable,strline,width)
  {
    var oband=$band(banditem);
    if(!oband) {alert("数据错误,请检查！");return;};
    if(!width)
        var minwidth = (oband.minwidth)?oband.minwidth:"220";
    else var minwidth=width;
    if(!visiable) visiable="1";
    if(oband.splitrow) var splitrow="<p style=\"margin:"+oband.splitrow+"\"></p>";
    else var splitrow="";
    var cols = oband.PCols(visiable);
    if(!cols) return;    
    var strhtm = "";var _sw="";var needword="";
    var trtexts = "";
    if(trtext) trtexts = trtext.split("#");
    var sline=""; var istart=0;
    var istartpos = (!oband.startpos)?0:oband.startpos;
    var iendpos = (!oband.endpos)?cols.length:oband.endpos;
    for(var i = istartpos; i < iendpos; i++)
    {
        var colitem     = oband.ColObj(cols[i]);
        if(colitem.chkcol) needword='<font color="#ff0000" face="Wingdings">v</font>';
        else needword='<font color="#FFFFFF" face="Wingdings">v</font>';
        if(colitem.name=="RowNum" || colitem.idkey ) continue;
        if(colitem.width=="") colitem.width = minwidth;
        if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
        if(colitem.width=="") _sw="";
        else _sw = " style='width:" + colitem.width + "'";
        var colname = colitem.name;
        var coltitle = colitem.title;
        if(coltitle=="") coltitle=colname;
        
        var inputtype="";var strdisabled="";if(colitem.readonly) strdisabled=" disabled "
        if (oband.multiplebox && oband.multiplebox.indexOf("," + colitem.name + ",") > -1)
            var xbtn = 'Xcbo('+colitem.bandid+',null,\'z\')';
        else var xbtn = 'Xcbo('+colitem.bandid+')';
        var _btn = '<input title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-23px;margin-top:2px;width:22px;height:16; position:absolute" onclick="'+xbtn+'"/>';
        var sformat = "";  
        var sformatfld = ""; 
        var sdatafld = "";
        if(colitem.format.indexOf("*")>-1)
        {
            var inputtype="password";
            colitem.format="";
        }
        else
            var inputtype="text";
            
        if(colitem.format!="") sformat = " format="+colitem.format;
        
        if(colitem.formatfld!="") 
        {
            sformatfld = " formatfld='"+colitem.formatfld+"'";
            sdatafld = " datafld='" + colitem.formatfld+"'"; 
            var strevent =' onblur="GridUtil.usOnCellBlurHandle();" '
        }
        else
        {
            sdatafld = " datafld='" + colitem.name+"'"; 
            sformatfld = "";
            var strevent =''
        }
        var strtag = "input";
        var colvalues="";
        
        switch(colitem.datatype)
        {
            case "string":
                if(colitem.datastyle=="textarea")
                {
                    _sw=" style='width:" + colitem.width + "px;height:" + colitem.height + "px' ";
                    colvalues = '<textarea '+ _sw+' type="'+inputtype+'" datasrc="#'+oband.ID+'"  class="xlandinput"' + sdatafld  + sformatfld +'></textarea>';
                }
                else
                    colvalues = '<'+ strtag + strevent + _sw+' type="'+inputtype+'" datasrc="#'+oband.ID+'"  class="xlandinput"' + sdatafld  + sformatfld +'/>';
                if(colitem.onclick!=""){
                    colvalues = '<'+ strtag  + _sw +' type="text" datasrc="#'+oband.ID+'"  class="xlandinput" datafld="'+colitem.name+'"/>'
                    colvalues += '<input title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-23px;margin-top:2px;width:22px;height:16; position:absolute" onclick="'+colitem.onclick+'"/>';
                }
                break;
            case "boolean":
                colvalues ='<input type="checkbox" '+strdisabled+_sw+' class="xlandradio" datasrc="#'+oband.ID+'" ' + sdatafld + '/>';
                break;
            case "dateTime":
                colvalues ='<input type="text" '+ _sw +' class="xlanddate" datasrc="#'+oband.ID+'" '  + sdatafld  + sformatfld +strevent +'/>'
                break;                
            case "select":
                //colvalues = '<span style="WIDTH:120" class="xlandspan" datasrc="#商品资料Tab" datafld="'+colitem.name+'"></span>'
                colvalues = '<'+ strtag  + _sw +' type="text" datasrc="#'+oband.ID+'"  class="xlandinput" datafld="'+colitem.name+'"/>'
                +_btn;
                break;
            default:
                colvalues = '<input '+ _sw +' type="text" colname="'+colitem.name+'" class="xlandinput" datasrc="#'+oband.ID+'" '+ sdatafld  + sformatfld +strevent +'/>'
                break;
        }
        if(trtexts[0]==colitem.name) colvalues=trtexts[1];
        
        if((istart + 1) % 2==0 || colitem.datastyle=="textarea") var rn = "<br/>"+splitrow;  else rn="";
        istart++;
        if(colitem.datastyle=="textarea") 
        {
            var rna = "<br/>";
        }
        else var rna = "";
        if(ToolUtil.valueTag(strline,colname)==1)
        {
            sline='<hr size="1" noshade style="text-align:center;width:92%;border:1px dotted #000000">' 
            istart=0;
        }
        else sline = "";        
        strhtm = strhtm +rna+ '<span style="width:80;text-align:right">'+coltitle+'：</span>'+colvalues+needword+rn+sline;
    }
    $(divid).innerHTML= splitrow+strhtm;
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
        var xmlrows = xmlhttp.responseXML.selectNodes("//table");
        for(var m=0;m<xmlrows.length;m++)
        {
            var text = xmlrows[m].selectSingleNode(textcol).text;
            var val  = xmlrows[m].selectSingleNode(valuecol).text;
            s=s+'<option value="'+val+'">'+text+'</option>';
        } 
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
    //var ob=(!oitem)?null:oitem.band;
    var ob=(!oitem)?null:oitem.band;
    if(!ob) ob=oitem;
    var xmlhttp = ue_ajaxdom(dtitem,null,null,ob);
    if(!xmlhttp) {alert("查询错误，请检查数据源【"+dtitem+"】");return false;};
    var xmlrows = xmlhttp.selectNodes("//table");
    ops.add(new Option("",""));
    for(var m=0;m<xmlrows.length;m++)
    {
        var text = (!xmlrows[m].selectSingleNode(dttext))?"":xmlrows[m].selectSingleNode(dttext).text;
        var val  = (!xmlrows[m].selectSingleNode(dtvalue))?"":xmlrows[m].selectSingleNode(dtvalue).text;
        var grp  = (!xmlrows[m].selectSingleNode("type"))?"":xmlrows[m].selectSingleNode("type").text;
        var tag  = xmlrows[m].selectSingleNode("tag");
        if(grp=="true" || grp=="1")
        {
            var group=document.createElement('OPTGROUP');  
            group.label = text;
            group.innerText= " ";
            objbox.appendChild(group);
        }
        else
        {
            var opt   = new Option(text,val);
            if(tag) opt.id   = tag.text;
            //opt.title = text;
            ops.add(opt);
        }
    }
    //@类别编码=3003,@吊牌信息=面料：100%牛皮,@尺码组=配饰,@组编码=3,@执行标准=
    var curvalue = (!objinput.value)?objinput.innerText:objinput.value;
    var index=0;
    for (var i = 0; i < objbox.options.length; i++)
    {
        if(ob && objinput.dataFld)
        {
            if(ob.Val(objinput.dataFld)==objbox.options[i].value){index = i; break;}
        }
        else if(curvalue!="" && curvalue == objbox.options[i].value)
        {
            index = i; 
            break;
        }
        
//        if(objbox.options[i].id=="") continue;
//        var data = ToolUtil.tagObject(objbox.options[i].id);
//        for (var k in data)
//        {
//            var isfind = true;
//            var val = ob.getFldStrValue(k);
//            if (!val || data[k] != val)
//                continue;
//            isfind = false;
//            break;
//        }
//        if (isfind) continue;
//        index = i;
//        break;
    }
    if(objbox.options[index]) objbox.options[index].selected=true;
    return true;
}

function ZDict(objinput,objbox,oitem)
{
    var dtitem = (!objinput.datasourceid)?oitem.dataitem:objinput.datasourceid;
    var dttext = (!objinput.datatextfield)?oitem.textcol:objinput.datatextfield;
    var dtvalue = (!objinput.datavaluefield)?oitem.valuecol:objinput.datavaluefield;
    //var ob=(!oitem)?null:oitem.band;
    var ob=(!oitem)?null:oitem.band;
    if(!ob) ob=oitem;
    var xmlhttp = ue_ajaxdom(dtitem,null,null,ob);
    if(!xmlhttp) {alert("查询错误，请检查数据源【"+dtitem+"】");return false;};
    var xmlrows = xmlhttp.selectNodes("//table");
    var s="";
    for(var m=0;m<xmlrows.length;m++)
    {
        var text = (!xmlrows[m].selectSingleNode(dttext))?"":xmlrows[m].selectSingleNode(dttext).text;
        var val  = (!xmlrows[m].selectSingleNode(dtvalue))?"":xmlrows[m].selectSingleNode(dtvalue).text;
        var grp  = (!xmlrows[m].selectSingleNode("type"))?"":xmlrows[m].selectSingleNode("type").text;
        var tag  = xmlrows[m].selectSingleNode("tag");
        //<input type="checkbox" value="101" onClick="addNewCategory(this)"/> 奶粉/尿片/母婴用品 </a> </li>
        var strtag  = (!xmlrows[m].selectSingleNode("tag"))?"":xmlrows[m].selectSingleNode("tag").text;
        if(grp!="true" && grp!="1")
            s=s+'<li><label for="'+strtag+'" style="color: #000000; font-family: 微软雅黑">'+text+'</label><input type="checkbox" value="'+val+'" onClick="" id="'+strtag+'"/></li>';
        else
            s=s+'<li><span style="color: #000000">'+text+'</span></li>';
    }
    objbox.innerHTML=s;
    var lis = objbox.getElementsByTagName("Li");
    if(objinput.value=="") return true;
    for (var i = 0; i < lis.length; i++)
    {
        var keys = lis[i].getElementsByTagName("INPUT")[0];
        if(lis[i].getElementsByTagName("INPUT").length==0) continue;
        //取标识字的字段:如果keys.id!="",则从keys.id获取标识字段名和值,用于与列表值比较
        if(keys.id!="") //如果存在关键字,用关键字判断
        {
            var strs = keys.id.split(",")[0]; 
            var strkey = strs.split("=")[0].replace("@","");    //标识字段名
            var keyvalues = ","+strs.split("=")[1]+",";         //列表中的标识字段值,可能是多个,以","分割.
            var obval = ","+ob.Val(strkey)+",";               //当前记录中的标识字段值
        }
        else{ 
            if(objinput.dataFld)
            {
                var strkey = objinput.dataFld;
                var keyvalues = ","+keys.value+",";
                var obval = ","+ob.Val(objinput.dataFld)+",";
            }
            else if(objinput.value!="")
            {
                var strkey = "";
                var keyvalues = ","+keys.value+",";
                var obval = ","+objinput.value+",";
            }        
        }
        if((obval).indexOf(keyvalues)>-1)                 //如果当前记录中标识字段的值包括列表中的同字段值,则列表行选中
            keys.checked=true;
    }    
    return true;
}

var _p=BGrid.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
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
	if(!this.Table || !this.XmlLand || !this.XmlSchema || !this.XmlLand.XMLDocument 
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
	if(!this.TabFoot) return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sum();
	this.HiddenFoot=true;
	var footCols=ToolUtil.getCtrlListByNameD(false,this.TabFoot,"colname");
	for(var i=0;footCols && i<footCols.length;i++)
	{
		if(!this.XmlSum)	break;
		if(!footCols[i].colname || ""==footCols[i].colname )
			continue;
		var xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/"+footCols[i].colname);
		if(!xmlNode)	continue;
		footCols[i].innerText = xmlNode.text;
		this.HiddenFoot=false;break;
	}
	if(band.RecordCount()<2)
		this.HiddenFoot=true;
	if(true==this.HiddenFoot  && this.TabFoot.id!="specialdisplay")
		this.TabFoot.style.display="none";
	else
		this.TabFoot.style.display="";
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
	    return
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
//根据tags内容更换列标题,目前用于服装标题
_p.extitle=function(tags,ex)
{
    if(!tags){
    var inputctrl=event.srcElement;
    if(!inputctrl) return;
    var tags = inputctrl.tag;}
    if(!tags) return;
    if(ex)
        tags = tags + ","+tags.replaceAll("=","1=") + ","+tags.replaceAll("=","2=") + ","+tags.replaceAll("=","_P=");
    for(var i=0;i<this.TabTitle.rows[this.TabTitle.rows.length-1].cells.length;i++)
    {
        var st = this.TabTitle.rows[this.TabTitle.rows.length-1].cells[i].colname;
        var _v = ToolUtil.valueTag(tags,st);
        if(!_v || _v=="")continue;
        this.TabTitle.rows[this.TabTitle.rows.length-1].cells[i].innerText=_v;
    }        
    
}  
//文件结尾
if (typeof(GridUtil) == "function") 
    GridUtil.FileLoaded=true;