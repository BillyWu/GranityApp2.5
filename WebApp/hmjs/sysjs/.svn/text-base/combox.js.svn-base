function $( id ){return document.getElementById( id );}
function $N( name ){return document.getElementsByName( name );}
function $band(name){return (document.UnitItem)?document.UnitItem.getBandByItemName(name):null;}
//try{window.event.keyCode = 0; window.event.returnValue= false;}catch(ex){}\
function writeCboIframe(str)
{
    with(Webcbo.iframe)
    {
		document.write("<html><head><base><meta http-equiv='Content-Type' content='text\/html; charset=gb2312'>");
		document.write("<style>*{font-size: 12px;margin:0;padding:0;};A:visited {text-decoration: none;COLOR: #5a5a5a;};A:active {COLOR: #333333;};A:hover {COLOR: #FF0000; TEXT-DECORATION: underline;position:relative; left:1px; top:1px; clip:rect();};.linkbtn_0 {COLOR: #fff; TEXT-DECORATION: none;};*{font-size: 12px; font-family: 宋体}.bg{cursor: default; background-color: #9A98AE;}<\/style>");
		document.write("<\/head><body  style='margin: 0px' oncontextmenu=''><form name=\"hmsoft\">");
		document.write("<script language=\"javascript\">var drag=false, cx=0, cy=0, o = parent.Webcbo.cbo; function document.onmousemove(){if(parent.Webcbo.drag && drag){if(o.style.left=='')o.style.left=0; if(o.style.top=='')o.style.top=0;o.style.left = parseInt(o.style.left) + window.event.clientX-cx;o.style.top  = parseInt(o.style.top)  + window.event.clientY-cy;}}function document.onkeydown(){ switch(window.event.keyCode){  case 27 : parent.hiddenXcbo(); break;} \
		try{window.event.keyCode = 0; window.event.returnValue= true;}catch(ex){}\
		}function dragStart(){cx=window.event.clientX; cy=window.event.clientY; drag=true;}<\/script>");
		document.write(str);
		document.write("<\/form><\/body><\/html>");
        document.close();
    }
}
function Webcbo(w,h)
{
    this.regInfo    = "关闭的快捷键：[Esc]";
    this.regInfo   += "";
    this.dateStyle  = null;                     //保存格式化后日期数组
    this.objExport  = null;                     //日历回传的显示控件
    this.eventSrc   = null;                     //日历显示的触发控件
    this.inputDate  = null;                     //转化外的输入的日期(d/m/yyyy)
    initCbowin(w,h);
    this.iframe     = window.frames("cboIframe"); //日历的 iframe 载体
    this.cbo   = $("cboLayer");
    this.band   = null;
    this.NoSetVal = false;
}   
var _width = 290;
var strcbo="<div id=\"_contents\" style='background-color:#9A98AE;border-style: solid; border-width: 1px;padding: 2px;color:#FFFFFF'>";
strcbo += "<span style='color: #FFFFFF;width:" + (_width-2*12-5) + ";padding-left:3px;'  id=_wt>请选择："
strcbo += "<A href=\"#\" id=\"_spanedit\" style='cursor:hand;visibility:hidden' onclick=\"parent.editdict()\"><img alt=\"编辑\"  border=\"0\" src=\"Images/edit.gif\" /></A></span>"
strcbo += "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:12pt' title='确定' onclick=\"parent.returncbo()\">a</span>"
strcbo += "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:10pt' title='关闭' onclick='parent.hiddenXcbo()'>r</span>"
strcbo += "<div id=\"_divcontents\" style=\"text-align:left\"></div></div>";
    
var Webcbo = new Webcbo();
function initCbowin(w,h)
{
    w=(!w)?300:w;h=(!h)?176:h;
    document.write("<div id=cboLayer style='position: absolute; z-index: 20006; width: "+w+"; height: "+h+"px; display: none'>");
    document.write("<iframe name=cboIframe scrolling=no frameborder=0 width=100% height="+h+"></iframe></div>");
}
function cbostr(w)
{
    return "<div id=\"_contents\" style='background-color:#9A98AE;border-style: solid; border-width: 1px;padding: 2px;color:#FFFFFF'>"
    +"<span style='color: #FFFFFF;width:" + (w-2*12-5) + ";padding-left:3px;' id=_wt>请选择："
    +"<A href=\"#\" id=\"_spanedit\" style='cursor:hand;visibility:hidden' onclick=\"parent.editdict()\"><img alt=\"编辑\"  border=\"0\" src=\"Images/edit.gif\" /></A></span>"
    +"<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:12pt' title='确定' onclick=\"parent.returncbo()\">a</span>"
    +"<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:10pt' title='关闭' onclick='parent.hiddenXcbo()'>r</span>"
    +"<div id=\"_divcontents\" style=\"text-align:left\"></div></div>";
}
function Xcbo(obanddata,noedit,type) //主调函数
{
    var e = window.event.srcElement;   
    if(e.type=="button")
    {
        if(e.previousSibling.nodeName=="#text")
            e=e.previousSibling.previousSibling;
        else
            e=e.previousSibling;
    }
    try{e.fireEvent("onfocus")}catch(ex){};
    e.focus();
    var _dataSrc="";
    var _dataSrcId="";
    if(!obanddata) 
    {
        _dataSrc = e.dataSrc;
        _dataSrcId = _dataSrc.replace("#","");
        var oband = document.UnitItem.getBandById(_dataSrcId);
    }
    else
    {
        var oband = document.UnitItem.getBandById(obanddata.id);
        if(!oband) oband = document.UnitItem.getBandById(obanddata)
    }
    if(!oband) {alert("【"+_dataSrcId+"】数据源为空！");return;}
    Webcbo.band = oband;
    var w = 300;
    Webcbo.iframe.width = w; //日历的 iframe 载体
    Webcbo.cbo.style.width = w;
    strcbo = cbostr((!w)?290:parseInt(w,10)-10);
    var colobj = oband.Col(e.dataFld);
    if(!colobj) {alert("【"+e.dataFld+"】不存在，请检查！");return};
    colitem     = oband.ColObj(oband.Col(e.dataFld));
    Webcbo.colitem=colitem;
    writeCboIframe(strcbo);
    var odoc = Webcbo.iframe.document.all;
    if(oband.editdict) odoc._spanedit.style.visibility="visible";
    switch(type)
    {
        case "z":
            var strobj = "<div id=\"alltbcategory\" style=\"text-align:left;background-color:#fff;height:150px;width:100%;overflow:auto;\"><ul style=\"margin:2;padding:2\" id=\"_combox\"> </ul></div>";
            odoc._divcontents.innerHTML=strobj;
            if(!ZDict(e,odoc._combox,colitem)) return;
            break;            
        default:
            var _sedit = "<div id=\"editarea\" style=\"width:100%;text-align:center;height:45px;display:none\">\
            <fieldset style=\"padding: 2px;width:97%;height:97%;border:1px solid #fff;color:#fff;text-align:left\">\
            <legend style=\"color:#fff\">新建名称：<A href=\"#\" onclick=\"parent.editclose()\"><img border=\"0\" alt=\"关闭编辑窗口\" src=\"Images/closemin.png\" /></A>\
            <img border=\"0\" id=\"_newsigh\" style=\"visibility:hidden\" src=\"Images/new2.gif\" /></legend>"
            +"&nbsp;<INPUT id=\"_dictname\"onpropertychange=\"parent._editchange()\" style=\"WIDTH:120;\" type=\"text\" size=\"11\"/>\
            　<input id=\"btnadd\" type=\"button\" onclick=\"parent._addDict()\"  value=\"增加\" name=\"B3\" \>\
            <input id=\"btnsave\" type=\"button\" onclick=\"parent._saveDict()\" disabled value=\"保存\" name=\"B3\" \>\
            <input type=\"button\" onclick=\"parent._delDict()\" value=\"删除\" name=\"B3\" \></fieldset></div>";
            var strobj = "<select id=\"_combox\" name=\"_combox\" style=\"width:98%\" size=12 onkeydown='parent.enterRtn()' onclick=\"parent.getcbo()\"  ondblclick=\"parent.returncbo()\"></select>"
            +_sedit;
            odoc._divcontents.innerHTML=strobj;
            if(!XDict(e,odoc._combox,colitem)) return;
            if(oband.ismultiple) odoc._combox.multiple=true;
            break;
    }    
    if(noedit) odoc.cboedit.style.display="";
    window.setTimeout(_setbox(e),200);
}
function editdict()
{
    var odoc = Webcbo.iframe.document.all;
    odoc.editarea.style.display="block";
    odoc._combox.size=7;
    var sIndex = odoc._combox.selectedIndex;
    if(sIndex==-1 && odoc._combox.options.length==0) 
    {
        return;
    }
    var mytag = odoc._combox.options[sIndex].id;
    var tb = ToolUtil.valueTag(mytag,"table");
    if(!tb && Webcbo.colitem && Webcbo.colitem.dataitem)
        tb = Webcbo.colitem.dataitem.split("\"")[1];
    Webcbo.dt= tb;
    odoc._dictname.value = odoc._combox.options[sIndex].innerText;
    odoc._dictname.focus();
    odoc._dictname.select();
    odoc.btnsave.disabled=true;
}
function editclose()
{
    Webcbo.iframe.document.all.editarea.style.display="none";
    Webcbo.iframe.document.all._combox.size=12;
}
function _editchange()
{
    Webcbo.iframe.document.all.btnsave.disabled=false;
}
function _addDict()
{
    var odoc = Webcbo.iframe.document.all;
    odoc._newsigh.style.visibility="visible";
    odoc._dictname.value="";
    odoc._dictname.focus();
}
function _saveDict()
{
    var odoc = Webcbo.iframe.document.all;
    odoc.btnsave.disabled=true;
    var sIndex = odoc._combox.selectedIndex;
    if(sIndex==-1) return;
    var v = odoc._dictname.value;
    if(v=="") {alert("名称不能为空!");return;};
    var mytag = odoc._combox.options[sIndex].id;
    var tb = Webcbo.dt;
    var code = ToolUtil.valueTag(mytag,"code");
    var flag = 0;
    if(odoc._newsigh.style.visibility=="visible") flag=0
    else flag=1;
    var sql = "exec FD_字典UPDATE '"+flag+"','"+ v +"','" + code + "','" + tb + "'";
    if(ue_ajaxdom(sql,1,"保存成功!",null,true)=="ok") 
    {
        if(flag==1) return;
        var sql = "exec FD_字典Code '"+tb+"','"+ v +"'";
        var xmldata = ue_ajaxdom(sql,null,"",null,true);
        if(!xmldata){alert("系统错误,请关闭字典窗口重新进入!");return;}
        var _t = xmldata.selectSingleNode("//tag").text;        
        var oop = new Option(v,v);
        oop.id = _t;
        odoc._combox.options.add(oop);
        odoc._combox.options[odoc._combox.options.length-1].selected=true;
        odoc._newsigh.style.visibility="hidden";
    }
}
function _delDict()
{
    var odoc = Webcbo.iframe.document.all;
    if(odoc._newsigh.style.visibility!="hidden"){
        odoc._newsigh.style.visibility="hidden";
        odoc._dictname.value="";
        return
    }
    var os = odoc._combox;
    var sIndex = os.selectedIndex;
    sIndex = sIndex >= os.options.length ? os.options.length - 1 : sIndex < 0 ? 0 : sIndex;
    if (sIndex < 0 || !os.options[sIndex]) return;
   	var result = confirm("您将删除该条信息,确认吗?    ");
    if(!result) return;
    var mytag = os.options[sIndex].id;
    var tb = Webcbo.dt;
    var code = ToolUtil.valueTag(mytag,"code");
    var flag = 2;
    var sql = "exec FD_字典UPDATE '"+flag+"','"+odoc._dictname.value+"','" + code + "','" + tb + "'";
    if(ue_ajaxdom(sql,1,"删除成功!",null,true)=="ok")
    {
        os.options.remove(sIndex);
        if (sIndex < os.options.length)
            os.options[sIndex].selected = true;
        else if (os.options.length > 0)
            os.options[sIndex - 1].selected = true;
        getcbo();
    }
}
function getcbo()
{
    var odoc = Webcbo.iframe.document.all;
    if(odoc.editarea.style.display=="none") return;
    var sIndex = odoc._combox.selectedIndex;
    if(sIndex==-1) return;
    var mytag = odoc._combox.options[sIndex].id;
    odoc._dictname.value = odoc._combox.options[sIndex].innerText;
    odoc._dictname.focus();
    odoc._dictname.select();
    odoc.btnsave.disabled=true;
    odoc._newsigh.style.visibility="hidden";
}
function Bcbo(obanddata,noedit,type) //主调函数
{
    var e = window.event.srcElement;
    if(e.type=="button")
    {
        if(e.previousSibling.nodeName=="#text")
            e=e.previousSibling.previousSibling;
        else
            e=e.previousSibling;
    }
    try{e.fireEvent("onfocus")}catch(ex){};
    e.focus();
    var _v = "";
    if(e.tagName=="SPAN") _v=e.innerText;
    else _v=e.value;
    writeCboIframe(strcbo.replaceAll("请选择","全文"));
    var strobj = "<textarea id=\"_combox\" name=\"_combox\" style=\"width:100%;height:105\" >"+_v+"</textarea>";
    Webcbo.iframe.document.all._divcontents.innerHTML=strobj;
    window.setTimeout(_setbox(e),200);
}

function Ycbo(ismultiple,item) //主调函数
{
    var e = window.event.srcElement;   
    if(e.type=="button")
    {
        if(e.previousSibling.nodeName=="#text")
            e=e.previousSibling.previousSibling;
        else
            e=e.previousSibling;
    }
    var w = 300;
    Webcbo.iframe.width = w; //日历的 iframe 载体
    Webcbo.cbo.style.width = w;
    strcbo = cbostr((!w)?290:parseInt(w,10)-10);
    writeCboIframe(strcbo);
    var strobj = "<select id=\"_combox\" name=\"_combox\" style=\"width:98%\" size=12  ondblclick=\"parent.returncbo()\"></select>";
    Webcbo.NoSetVal = false;
    Webcbo.iframe.document.all._divcontents.innerHTML=strobj;    
    var ob = (item)?$band(item):null;
    if(!XDict(e,Webcbo.iframe.document.all._combox,ob)) return;
    if(ismultiple) {Webcbo.iframe.document.all._wt.innerText="请选择:(按住CTRL键进行多选)";Webcbo.iframe.document.all._combox.multiple=true;}
    window.setTimeout(_setbox(e),200);
}
function Fcbo(item,sql,eventfun)
{
    var e = window.event.srcElement;   
    if(e.type=="button")
    {
        if(e.previousSibling.nodeName=="#text")
            e=e.previousSibling.previousSibling;
        else
            e=e.previousSibling;
    }
    var w = 300;
    Webcbo.iframe.width = w; //日历的 iframe 载体
    Webcbo.cbo.style.width = w;
    strcbo = cbostr((!w)?290:parseInt(w,10)-10);
    writeCboIframe(strcbo);
    var strobj = "<select id=\"_combox\" name=\"_combox\" style=\"width:98%\" size=12  ondblclick=\"parent.returncbo(1)\"></select>";
    Webcbo.iframe.document.all._divcontents.innerHTML=strobj;    
    var ob = (item)?$band(item):null;
    if(!XDict(e,Webcbo.iframe.document.all._combox,ob,null,sql)) return;
    window.setTimeout(_setbox(e),200);
}

function Acbo(vals,ids,ob,noSetVal,w) //主调函数
{
    if(!vals) return;
    var e = window.event.srcElement;   
    if(e.type=="button")
    {
        if(e.previousSibling.nodeName=="#text")
            e=e.previousSibling.previousSibling;
        else
            e=e.previousSibling;
    }
    var s="";
    Webcbo.band = ob;
    if(noSetVal) Webcbo.NoSetVal = true;
    w=(!w)?300:w;
    Webcbo.iframe.width = w; //日历的 iframe 载体
    Webcbo.cbo.style.width = w;
    
    strcbo = cbostr((!w)?290:parseInt(w,10)-10);
    writeCboIframe(strcbo);
    for(var m=0;m<vals.length;m++)
    {
        if(ids && ids.length>0)
            var opid = ' id="' + ids[m] + '"';
        else var opid="";
        s=s+'<option value="'+vals[m]+'" '+ opid +'>'+vals[m]+'</option>';
    }
    var strobj = "<select id=\"_combox\" name=\"_combox\" style=\"width:98%\" size=12 onkeydown='parent.enterRtn()'  ondblclick=\"parent.returncbo()\">"+s+"</select>";
    Webcbo.iframe.document.all._divcontents.innerHTML=strobj; 
    sloption(Webcbo.iframe.document.all._combox,e.value);   
    window.setTimeout(_setbox(e),200);
}
function enterRtn()
{
    var e = Webcbo.iframe.event; //IE、FF下获取事件对象
    var cod = e.charCode||e.keyCode; //IE、FF下获取键盘码
    if(e.keyCode==13) Webcbo.iframe.document.all._combox.fireEvent("ondblclick");
}
function Mcbo(ismultiple,firstItem) //主调函数
{
    var _w = 290;
    var str="<div id=\"_contents\" style='background-color:#9A98AE;border-style: solid; border-width: 1px;padding: 2px;color:#FFFFFF'>";
    str += "<span style='color: #FFFFFF;width:" + (_w-2*12-10) + ";padding-left:3px;'>请选择：</span>"
    str += "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:12pt' title='确定' onclick=\"parent.returncbo()\">a</span>"
    str += "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;font-size:10pt' title='关闭' onclick='parent.hiddenXcbo()'>r</span>"
    str += "<div style=\"text-align:center\"> <select id=\"_combox\" name=\"_combox\" style=\"width:98%\" size=12  ondblclick=\"parent.returncbo()\">";
    str += "</select></div> </div>";
    
    Webcbo.iframe.width = 300; //日历的 iframe 载体
    Webcbo.cbo.style.width = 300;
    
    writeCboIframe(str);
    e = event.srcElement;
    if(!XDict(e,Webcbo.iframe.document.all._combox,null,firstItem)) return;
    if(ismultiple) Webcbo.iframe.document.all._combox.multiple=true;
    window.setTimeout(_setbox(e,10),200);
}

function _setbox(e,errh)
{return function(){x_setbox(e,errh);}}

function x_setbox(e,errh)
{
    var eh = (!errh)?0:errh;
    var o = Webcbo.cbo.style; Webcbo.eventSrc = e;
	if (arguments.length == 0) Webcbo.objExport = e;
    else Webcbo.objExport = eval(arguments[0]);
	var t = e.offsetTop+eh,  h = e.clientHeight, l = e.offsetLeft, p = e.type;
	while (e = e.offsetParent){t += e.offsetTop-e.scrollTop; l += e.offsetLeft-e.scrollLeft;}
    o.display = ""; Webcbo.iframe.document.body.focus();
    if(Webcbo.iframe.document.all._combox)
    {
        Webcbo.iframe.document.all._combox.focus();
    }
    var cw = Webcbo.cbo.clientWidth, ch = Webcbo.cbo.clientHeight;
    var dw = document.body.clientWidth, dl = document.body.scrollLeft, dt = document.body.scrollTop;
    
    if (document.body.clientHeight + dt - t - h >= ch) o.top = (p=="image")? t + h : t + h + 6;
    else o.top  = (t - dt < ch) ? ((p=="image")? t + h : t + h + 6) : t - ch;
    if (dw + dl - l >= cw) o.left = l; else o.left = (dw >= cw) ? dw - cw + dl : dl;
}

function hiddenXcbo()
{
    try{
	var ctrl=document.getElementById("cboLayer")
	if(ctrl && "none"!=ctrl.style.display && Webcbo.objExport)
		if(Webcbo.objExport.dataFld==Webcbo.objExport.colname)
			Webcbo.objExport.fireEvent("onafterupdate");
	}
	catch(ex){};
	ctrl.style.display = "none";
};
function returncbo(flag) 
{
    if(!Webcbo.objExport) return "";
    var returnValue;
    var e = Webcbo.iframe.document.all._combox;
    returnValue = values(e);
	var ctrl=$("cboLayer")
    if(!flag)
    {
        var oldv = Webcbo.objExport.value;
        returnVal(Webcbo.objExport,returnValue,Webcbo.band);
    }
    //计算tag中对应的数据
    var mytag="";
    if(e.tagName=="SELECT")
    {   var sIndex = e.selectedIndex;
        if(sIndex==-1){ctrl.style.display = "none";return;}
        mytag = e.options[sIndex].id;
    }
    if(Webcbo.band && Webcbo.band.ColNames && !Webcbo.NoSetVal)
    {
        if(e.tagName=="UL") tagLivalues(Webcbo.band,e)
        else tagSlvalues(Webcbo.band,mytag);
    }
    Webcbo.objExport.tag = mytag;
    if(!flag){
        if("function"==typeof(cboAfterUpdate))
            cboAfterUpdate(Webcbo.objExport,Webcbo.band);         

        try{Webcbo.objExport.fireEvent("onchange");}catch(ex){}
	    try{Webcbo.objExport.fireEvent("onafterupdate");}catch(ex){}
	}
	ctrl.style.display = "none";
}
function returnVal(objExport,returnValue,ob)
{
    if((objExport.tagName=="INPUT" || objExport.tagName=="TEXTAREA") && !objExport.readOnly)
        objExport.value = returnValue;
    else 
    {
        if(objExport.dataFld && ob)
            ob.setFldStrValue(null,objExport.dataFld,returnValue);
        else
            objExport.innerText = returnValue;
     }
}
function values(e)
{
    var s="";var _v="";
    if(e.tagName=="UL")
    { //取出所有被选择的值
        var lis = e.getElementsByTagName("Li");
        for(var i=0;i<lis.length;i++)
        {
            var keys = lis[i].getElementsByTagName("INPUT")[0];
            if(!keys || !keys.checked) continue;
            s = s+","+keys.value;       
        }
        return s.substring(1,s.length)
    }else if(e.tagName=="SELECT"){
        for(var i=0;i<e.options.length;i++)
        {
            if(e.options[i].selected)
            {
                s = s+","+e.options[i].value;       
            }
        }
        return s.substring(1,s.length)
    }else return Webcbo.iframe.document.all._combox.value;
    return s;
}
function tagLivalues(ob,e)
{
    //从tag中取出对应的checkin字段值
    if(!ob.ColNames) return;
    var s="";
    var lis = e.getElementsByTagName("Li");
    var _v="";
    var strkey = "";
    for(var i=0;i<lis.length;i++)
    {
        var keys = lis[i].getElementsByTagName("INPUT")[0];
        if(!keys || !keys.checked || keys.id=="") continue;
        var strs = keys.id.split(",")[0]; 
        strkey = strs.split("=")[0].replace("@","");    //标识字段名
        var keyvalues = strs.split("=")[1];             //列表中的标识字段值,可能是多个,以","分割.
        _v = _v+","+keyvalues;
    }    
    if(_v.length==0) return;
    _v = _v.substring(1,_v.length);        
    ob.setFldStrValue(null,strkey,_v);
}
function tagSlvalues(ob,otag)
{
    //从tag中取出对应的checkin字段值
    if(!ob || !ob.ColNames) return;
    for(var i=0;i<ob.ColNames.length;i++)
    {
        var _vtag = ToolUtil.valueTag(otag,ob.ColNames[i]);
        if(!_vtag && _vtag!="") continue;
        ob.setFldStrValue(null,ob.ColNames[i],_vtag);        
    }
}
function exitcbo() 
{
    if(!Webcbo.objExport) return "";
	var ctrl=$("cboLayer")
	ctrl.style.display = "none";
}
function ue_defaultDictVal(obj,ob,field)
{return function(){uedefaultVal(obj,ob,field)}}

function uedefaultVal(obj,ob,field)
{
    if(!obj) return;
    var oitem;
    if(ob && ob.RecordCount()==0) ob.NewRecord();
    if(ob && field)
        oitem = ob.ColObj(ob.Col(field));
    var dtitem = (!obj.datasourceid)?oitem.dataitem:obj.datasourceid;
    var dttext = (!obj.datatextfield)?oitem.textcol:obj.datatextfield;
    var dtvalue = (!obj.datavaluefield)?oitem.valuecol:obj.datavaluefield;
    var xmlhttp = ue_ajaxdom(dtitem,null,null,null,null,true);
    xmlhttp.onreadystatechange =  function(){ueDefaultDict(obj,xmlhttp,dttext,dtvalue,ob)};
}
function ueDefaultDict(obj,xmlhttp,dttext,dtvalue,ob)
{
   if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
   {
        xmldata = xmlhttp.responseXML;
        if(!xmldata || xmldata.xml=="") return;
        var xmlrows = xmldata.selectNodes("//table");
        if(xmlrows.length==0) return;
        var text = (!xmlrows[0].selectSingleNode(dttext))?"":xmlrows[0].selectSingleNode(dttext).text;
        var val  = (!xmlrows[0].selectSingleNode(dtvalue))?"":xmlrows[0].selectSingleNode(dtvalue).text;
        var tag  = xmlrows[0].selectSingleNode("tag");
        returnVal(obj,val,ob);
        if(tag){obj.tag=tag.text; tagSlvalues(ob,tag.text);}
        try{obj.fireEvent("onchange");}catch(ex){}
        try{obj.fireEvent("onafterupdate");}catch(ex){}
        if("function"==typeof(cboAfterUpdate))
            cboAfterUpdate(obj);         
   }
}
