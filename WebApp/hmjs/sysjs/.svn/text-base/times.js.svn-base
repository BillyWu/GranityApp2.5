document.write("<div id=timeLayer style='position: absolute; z-index: 10006; width: 230px; height: 38; display: none'>");
document.write("<iframe name=timeIframe scrolling=no frameborder=0 width=100% height=38></iframe></div>");
var str="<div id=\"_contents\" style='background-color:#9A98AE;border-style: solid; border-width: 1px;padding: 8px;color:#FFFFFF'>";
str += "\u65f6<select name=\"_hour\" style=\"font-size:12px\">";
for (h = 0; h <= 9; h++) {
    str += "<option value=\"0" + h + "\">0" + h + "</option>";
}
for (h = 10; h <= 23; h++) {
    str += "<option value=\"" + h + "\">" + h + "</option>";
}
str += "</select> \u5206<select style=\"font-size:12px\" name=\"_minute\">";
for (m = 0; m <= 9; m++) {
    str += "<option value=\"0" + m + "\">0" + m + "</option>";
}
for (m = 10; m <= 59; m++) {
    str += "<option value=\"" + m + "\">" + m + "</option>";
}
str += "</select> \u79d2<select style=\"font-size:12px\" name=\"_second\">";
for (s = 0; s <= 9; s++) {
    str += "<option value=\"0" + s + "\">0" + s + "</option>";
}
for (s = 10; s <= 59; s++) {
    str += "<option value=\"" + s + "\">" + s + "</option>";
}
str += "</select> <input name=\"queding\" type=\"button\" onclick=\"parent.returnTime()\" value=\"\u786e\u5b9a\" style=\"font-size:12px\" /></div>";
function writeTIframe()
{
    with(WebTime.iframe)
    {
		document.write("<html>");
		document.write("<head>");
		document.write("<base>");
		document.write("<meta http-equiv='Content-Type' content='text\/html; charset=gb2312'>");
		document.write("<style>*{font-size: 12px; font-family: 宋体}.bg{cursor: default; background-color: #9A98AE;}<\/style><\/head><body onselectstart='return false' style='margin: 0px' oncontextmenu=''><form name=\"meizz\">");
		document.write("<script language=\"javascript\">var drag=false, cx=0, cy=0, o = parent.WebTime.calendar; function document.onmousemove(){if(parent.WebTime.drag && drag){if(o.style.left=='')o.style.left=0; if(o.style.top=='')o.style.top=0;o.style.left = parseInt(o.style.left) + window.event.clientX-cx;o.style.top  = parseInt(o.style.top)  + window.event.clientY-cy;}}function document.onkeydown(){ switch(window.event.keyCode){  case 27 : parent.hiddenXTime(); break;} window.event.keyCode = 0; window.event.returnValue= false;}function dragStart(){cx=window.event.clientX; cy=window.event.clientY; drag=true;}<\/script>");
		document.write(str);
		document.write("<\/form>");
		document.write("<\/body>");
		document.write("<\/html>");
        document.close();
    }
}
function WebTime() //初始化日历的设置
{
    this.regInfo    = "关闭的快捷键：[Esc]";
    this.regInfo   += "";
    this.dateStyle  = null;                     //保存格式化后日期数组
    this.objExport  = null;                     //日历回传的显示控件
    this.eventSrc   = null;                     //日历显示的触发控件
    this.inputDate  = null;                     //转化外的输入的日期(d/m/yyyy)
    this.iframe     = window.frames("timeIframe"); //日历的 iframe 载体
    this.calendar   = document.getElementById("timeLayer");
}   
var WebTime = new WebTime();
function XTime() //主调函数
{
    var e = window.event.srcElement;   writeTIframe();
    var o = WebTime.calendar.style; WebTime.eventSrc = e;
	if (arguments.length == 0) WebTime.objExport = e;
    else WebTime.objExport = eval(arguments[0]);
    
	var t = e.offsetTop,  h = e.clientHeight, l = e.offsetLeft, p = e.type;
	while (e = e.offsetParent){t += e.offsetTop-e.scrollTop; l += e.offsetLeft-e.scrollLeft;}
    o.display = ""; WebTime.iframe.document.body.focus();
    var cw = WebTime.calendar.clientWidth, ch = WebTime.calendar.clientHeight;
    var dw = document.body.clientWidth, dl = document.body.scrollLeft, dt = document.body.scrollTop;
    
    if (document.body.clientHeight + dt - t - h >= ch) o.top = (p=="image")? t + h : t + h + 6;
    else o.top  = (t - dt < ch) ? ((p=="image")? t + h : t + h + 6) : t - ch;
    if (dw + dl - l >= cw) o.left = l; else o.left = (dw >= cw) ? dw - cw + dl : dl;
    if(!WebTime.objExport.value) return;
    var arrs = WebTime.objExport.value.trim().split(":");
    if (WebTime.objExport.value.trim() != "" && arrs.length==3)
    {
        WebTime.iframe.document.all._hour.value=arrs[0];
        WebTime.iframe.document.all._minute.value=arrs[1];
        WebTime.iframe.document.all._second.value=arrs[2];
        return false;
    }
}
function hiddenXTime()
{
	var ctrl=document.getElementById("timeLayer")
	if(ctrl && "none"!=ctrl.style.display && WebTime.objExport)
		if(WebTime.objExport.dataFld==WebTime.objExport.colname)
			WebTime.objExport.fireEvent("onafterupdate");
	ctrl.style.display = "none";
};
function returnTime() //根据日期格式等返回用户选定的日期
{
    if(WebTime.objExport)
    {
        var returnValue;
        returnValue = WebTime.iframe.document.all._hour.value + ":" + WebTime.iframe.document.all._minute.value + ":" + WebTime.iframe.document.all._second.value;
        try{WebTime.objExport.value = returnValue;}catch(ex){}
        try{WebTime.objExport.fireEvent("onchange");}catch(ex){}
		WebTime.objExport.fireEvent("onafterupdate");
		var ctrl=document.getElementById("timeLayer")
		ctrl.style.display = "none";
    }
}
