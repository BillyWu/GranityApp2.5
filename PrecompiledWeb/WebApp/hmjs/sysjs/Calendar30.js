document.write("<div id=meizzCalendarLayer style='position: absolute; z-index: 10006; width: 184px; height: 170px; display: none'>");
document.write("<iframe name=meizzCalendarIframe scrolling=no frameborder=0 width=100% height=100%></iframe></div>");
function writeIframe()
{

    with(WebCalendar.iframe)
    {
		document.write("<html>");
		document.write("<head>");
		document.write("<base>");
		document.write("<meta http-equiv='Content-Type' content='text\/html; charset=gb2312'>");
		document.write("<style>*{font-size: 12px; font-family: 宋体}.bg{  color: white; cursor: default; background-color: #9A98AE;}table#tableMain{ width: 142; height: 170;}table#tableWeek td{ color: #FFFFFF;}table#tableDay  td{ }td#meizzYearHead, td#meizzYearMonth{color: #000040}.out { text-align: center; border-top: 1px solid white; border-left: 1px solid white;border-right: 1px solid #FFFFFF; border-bottom: 1px solid #FFFFFF;}.over{ text-align: center; border-top: 1px solid #FFFFFF; border-left: 1px solid #FFFFFF;border-bottom: 1px solid white; border-right: 1px solid white}input{ border: 0px solid #9A98AE; font-family:宋体; font-size:9pt;padding-top: 0px; height: 18; cursor: hand;       color:white; background-color: #9A98AE}<\/style><\/head><body onselectstart='return false' style='margin: 0px' oncontextmenu=''><form name=\"meizz\">");
		document.write("<script language=\"javascript\">var drag=false, cx=0, cy=0, o = parent.WebCalendar.calendar; function document.onmousemove(){if(parent.WebCalendar.drag && drag){if(o.style.left=='')o.style.left=0; if(o.style.top=='')o.style.top=0;o.style.left = parseInt(o.style.left) + window.event.clientX-cx;o.style.top  = parseInt(o.style.top)  + window.event.clientY-cy;}}function document.onkeydown(){ switch(window.event.keyCode){  case 27 : parent.hiddenCalendar(); break;case 37 : parent.prevM(); break; case 38 : parent.prevY(); break; case 39 : parent.nextM(); break; case 40 : parent.nextY(); break;case 84 : document.forms[0].today.click(); break;} window.event.keyCode = 0; window.event.returnValue= false;}function dragStart(){cx=window.event.clientX; cy=window.event.clientY; drag=true;}<\/script>");
		document.write("<select name=\"tmpYearSelect\" onblur='parent.hiddenSelect(this)' style='z-index:1;position:absolute;top:3;left:38;display:none; width:56px'");
		document.write("				onchange='parent.WebCalendar.thisYear =this.value; parent.hiddenSelect(this); parent.writeCalendar();'>");
		document.write("<\/select><select name=\"tmpMonthSelect\" onblur='parent.hiddenSelect(this)' style='z-index:1; position:absolute;top:3;left:88;display:none; width:43px'");
		document.write("				onchange='parent.WebCalendar.thisMonth=this.value; parent.hiddenSelect(this); parent.writeCalendar();'><\/select><table id=\"tableMain\" class=\"bg\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\" width=\"174\" height=\"187\">");
		document.write("<tr>");
		document.write("<td width=\"170\" height=\"19\" bgcolor='#9A98AE' align=center>");
		document.write("<table width=\"165\" id=\"tableHead\" border=\"0\" cellspacing=\"1\" cellpadding=\"0\">");
		document.write("<tr align=\"center\">");
		document.write("<td width=\"24\" class=\"bg\" title='向后翻 1 年&#13;快捷键：→' onclick='parent.prevY()' style='cursor: hand'><b>&lt;&lt;<\/b><\/td>");
		document.write("<td width=\"15\" height=\"19\" class=\"bg\" title='向前翻 1 月&#13;快捷键：←' style='cursor: hand'");
		document.write("									onclick='parent.prevM()'><b>&lt;<\/b><\/td>");
		document.write("<td width=\"60\" id=\"meizzYearHead\" style='color: #FFFFFF;' title='点击此处选择年份' onclick='parent.funYearSelect(parseInt(this.innerText, 10))'");
		document.write("									onmouseover='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'");
		document.write("									onmouseout='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'><\/td>");
		document.write("<td width=\"56\" id=\"meizzYearMonth\" style='color: #FFFFFF;' title='点击此处选择月份' onclick='parent.funMonthSelect(parseInt(this.innerText, 10))'");
		document.write("									onmouseover='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'");
		document.write("									onmouseout='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'><\/td>");
		document.write("<td width=\"24\" class=\"bg\" title='向后翻 1 月&#13;快捷键：→' onclick='parent.nextM()' style='cursor: hand'><b>&gt;<\/b><\/td>");
		document.write("<td width=\"24\" class=\"bg\" title='向后翻 1 年&#13;快捷键：→' onclick='parent.nextY()' style='cursor: hand'><b>&gt;&gt;<\/b><\/td>");
		document.write("<\/tr>");
		document.write("<\/table>");
		document.write("<\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td height=\"20\">");
		document.write("<table id=\"tableWeek\" border=\"0\" width=\"177\" cellpadding=\"0\" cellspacing=\"0\" onmousedown='dragStart()'");
		document.write("							onmouseup='drag=false' onmouseout='drag=false' borderColorLight='#9A98AE' borderColorDark='#FFFFFF'>");
		document.write("<tr align=\"center\">");
		document.write("<td height=\"20\">日<\/td>");
		document.write("<td>一<\/td>");
		document.write("<td>二<\/td>");
		document.write("<td>三<\/td>");
		document.write("<td>四<\/td>");
		document.write("<td>五<\/td>");
		document.write("<td>六<\/td>");
		document.write("<\/tr>");
		document.write("<\/table>");
		document.write("<\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td valign=\"top\" width=\"170\" bgcolor='#FFFFFF'>");
		document.write("<table id=\"tableDay\" height=\"120\" width=\"178\" border=\"0\" cellspacing=\"1\" cellpadding=\"0\">");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay0'><\/td>");
		document.write("<td class=\"out\" id='meizzDay1'><\/td>");
		document.write("<td class=\"out\" id='meizzDay2'><\/td>");
		document.write("<td class=\"out\" id='meizzDay3'><\/td>");
		document.write("<td class=\"out\" id='meizzDay4'><\/td>");
		document.write("<td class=\"out\" id='meizzDay5'><\/td>");
		document.write("<td class=\"out\" id='meizzDay6'><\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay7'><\/td>");
		document.write("<td class=\"out\" id='meizzDay8'><\/td>");
		document.write("<td class=\"out\" id='meizzDay9'><\/td>");
		document.write("<td class=\"out\" id='meizzDay10'><\/td>");
		document.write("<td class=\"out\" id='meizzDay11'><\/td>");
		document.write("<td class=\"out\" id='meizzDay12'><\/td>");
		document.write("<td class=\"out\" id='meizzDay13'><\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay14'><\/td>");
		document.write("<td class=\"out\" id='meizzDay15'><\/td>");
		document.write("<td class=\"out\" id='meizzDay16'><\/td>");
		document.write("<td class=\"out\" id='meizzDay17'><\/td>");
		document.write("<td class=\"out\" id='meizzDay18'><\/td>");
		document.write("<td class=\"out\" id='meizzDay19'><\/td>");
		document.write("<td class=\"out\" id='meizzDay20'><\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay21'><\/td>");
		document.write("<td class=\"out\" id='meizzDay22'><\/td>");
		document.write("<td class=\"out\" id='meizzDay23'><\/td>");
		document.write("<td class=\"out\" id='meizzDay24'><\/td>");
		document.write("<td class=\"out\" id='meizzDay25'><\/td>");
		document.write("<td class=\"out\" id='meizzDay26'><\/td>");
		document.write("<td class=\"out\" id='meizzDay27'><\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay28'><\/td>");
		document.write("<td class=\"out\" id='meizzDay29'><\/td>");
		document.write("<td class=\"out\" id='meizzDay30'><\/td>");
		document.write("<td class=\"out\" id='meizzDay31'><\/td>");
		document.write("<td class=\"out\" id='meizzDay32'><\/td>");
		document.write("<td class=\"out\" id='meizzDay33'><\/td>");
		document.write("<td class=\"out\" id='meizzDay34'><\/td>");
		document.write("<\/tr>");
		document.write("<tr>");
		document.write("<td class=\"out\" id='meizzDay35'><\/td>");
		document.write("<td class=\"out\" id='meizzDay36'><\/td>");
		document.write("<td class=\"out\" id='meizzDay37'><\/td>");
		document.write("<td class=\"out\" id='meizzDay38'><\/td>");
		document.write("<td colspan=3 class=out><input name=\"today\" style=\"background-color: red;\" type=\"button\" value='今天' onfocus='this.blur()' style='width: 35' title='当前日期&#13;快捷键：T' onclick=\"parent.returnDate(new Date().getDate() +'\/'+ (new Date().getMonth() +1) +'\/'+ new Date().getFullYear())\">&nbsp;<img border=\"0\" alt=\"清除日期\" style=\"cursor:hand\" onclick=\"parent.returnNull()\" src=\"images/delete.gif\">");
		document.write("<\/td>");
		document.write("<\/tr>");
		document.write("<\/table>");
		document.write("<\/td>");
		document.write("<\/tr>");
		document.write("<table>");
		document.write("<\/form>");
		document.write("<\/body>");
		document.write("<\/html>");
        document.close();
        for(var i=0; i<39; i++)
        {
            WebCalendar.dayObj[i] = eval("meizzDay"+ i);
            WebCalendar.dayObj[i].onmouseover = dayMouseOver;
            WebCalendar.dayObj[i].onmouseout  = dayMouseOut;
            WebCalendar.dayObj[i].onclick     = returnDate;
        }
    }
}
function WebCalendar() //初始化日历的设置
{
    this.regInfo    = "关闭的快捷键：[Esc]";
    this.regInfo   += "";
    this.daysMonth  = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.day        = new Array(39);            //定义日历展示用的数组
    this.dayObj     = new Array(39);            //定义日期展示控件数组
    this.dateStyle  = null;                     //保存格式化后日期数组
    this.objExport  = null;                     //日历回传的显示控件
    this.eventSrc   = null;                     //日历显示的触发控件
    this.inputDate  = null;                     //转化外的输入的日期(d/m/yyyy)
    this.thisYear   = new Date().getFullYear(); //定义年的变量的初始值
    this.thisMonth  = new Date().getMonth()+ 1; //定义月的变量的初始值
    this.thisDay    = new Date().getDate();     //定义日的变量的初始值
    this.today      = this.thisDay +"/"+ this.thisMonth +"/"+ this.thisYear;   //今天(d/m/yyyy)
    this.iframe     = window.frames("meizzCalendarIframe"); //日历的 iframe 载体
    //this.calendar   = getObjectById("meizzCalendarLayer");  //日历的层
    this.calendar   = document.getElementById("meizzCalendarLayer");
    this.dateReg    = "";           //日历格式验证的正则式

    this.yearFall   = 50;           //定义年下拉框的年差值
    this.format     = "yyyy-mm-dd"; //回传日期的格式
    this.timeShow   = false;        //是否返回时间
    this.drag       = true;         //是否允许拖动
    this.darkColor  = "#9A98AE";    //控件的暗色
    this.lightColor = "#FFFFFF";    //控件的亮色
    this.btnBgColor = "#9A98AE";    //控件的按钮背景色
    this.wordColor  = "#000040";    //控件的文字颜色
    this.fwordColor  = "white";		//控件的文字颜色
    this.wordDark   = "#DCDCDC";    //控件的暗文字颜色
    this.dayBgColor = "white";		//日期数字背景色
    this.dayColor	= "red";		//日期数字背景色
    this.todayColor = "red";		//今天在日历上的标示背景色
    this.DarkBorder = "white";		//日期显示的立体表达色
}   var WebCalendar = new WebCalendar();

function calendar() //主调函数
{
    var e = window.event.srcElement;   writeIframe();
    var o = WebCalendar.calendar.style; WebCalendar.eventSrc = e;
	if (arguments.length == 0) WebCalendar.objExport = e;
    else WebCalendar.objExport = eval(arguments[0]);

    WebCalendar.iframe.tableWeek.style.cursor = WebCalendar.drag ? "move" : "default";
	var t = e.offsetTop,  h = e.clientHeight, l = e.offsetLeft, p = e.type;
	while (e = e.offsetParent){t += e.offsetTop-e.scrollTop; l += e.offsetLeft-e.scrollLeft;}
    o.display = ""; WebCalendar.iframe.document.body.focus();
    var cw = WebCalendar.calendar.clientWidth, ch = WebCalendar.calendar.clientHeight;
    var dw = document.body.clientWidth, dl = document.body.scrollLeft, dt = document.body.scrollTop;
    
    if (document.body.clientHeight + dt - t - h >= ch) o.top = (p=="image")? t + h : t + h + 6;
    else o.top  = (t - dt < ch) ? ((p=="image")? t + h : t + h + 6) : t - ch;
    if (dw + dl - l >= cw) o.left = l; else o.left = (dw >= cw) ? dw - cw + dl : dl;

    if  (!WebCalendar.timeShow) WebCalendar.dateReg = /^(\d{1,4})(-|\/|.)(\d{1,2})\2(\d{1,2})$/;
    else WebCalendar.dateReg = /^(\d{1,4})(-|\/|.)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;

    try{
        if (WebCalendar.objExport.value.trim() != ""){
            WebCalendar.dateStyle = WebCalendar.objExport.value.trim().match(WebCalendar.dateReg);
            if (WebCalendar.dateStyle == null)
            {
                WebCalendar.thisYear   = new Date().getFullYear();
                WebCalendar.thisMonth  = new Date().getMonth()+ 1;
                WebCalendar.thisDay    = new Date().getDate();
                //alert("原文本框里的日期有错误！\n可能与你定义的显示时分秒有冲突！");
                writeCalendar(); return false;
            }
            else
            {
                WebCalendar.thisYear   = parseInt(WebCalendar.dateStyle[1], 10);
                WebCalendar.thisMonth  = parseInt(WebCalendar.dateStyle[3], 10);
                WebCalendar.thisDay    = parseInt(WebCalendar.dateStyle[4], 10);
                WebCalendar.inputDate  = parseInt(WebCalendar.thisDay, 10) +"/"+ parseInt(WebCalendar.thisMonth, 10) +"/"+ 
                parseInt(WebCalendar.thisYear, 10); writeCalendar();
            }
        }  else writeCalendar();
    }  catch(e){writeCalendar();}
}
function funMonthSelect() //月份的下拉框
{
    var m = isNaN(parseInt(WebCalendar.thisMonth, 10)) ? new Date().getMonth() + 1 : parseInt(WebCalendar.thisMonth);
    var e = WebCalendar.iframe.document.forms[0].tmpMonthSelect;
    for (var i=1; i<13; i++) e.options.add(new Option(i +"月", i));
    e.style.display = ""; e.value = m; e.focus(); window.status = e.style.top;
}
function funYearSelect() //年份的下拉框
{
    var n = WebCalendar.yearFall;
    var e = WebCalendar.iframe.document.forms[0].tmpYearSelect;
    var y = isNaN(parseInt(WebCalendar.thisYear, 10)) ? new Date().getFullYear() : parseInt(WebCalendar.thisYear);
        y = (y <= 1000)? 1000 : ((y >= 9999)? 9999 : y);
    var min = (y - n >= 1000) ? y - n : 1000;
    var max = (y + n <= 9999) ? y + n : 9999;
        min = (max == 9999) ? max-n*2 : min;
        max = (min == 1000) ? min+n*2 : max;
    for (var i=min; i<=max; i++) e.options.add(new Option(i +"年", i));
    e.style.display = ""; e.value = y; e.focus();
}
function prevM()  //往前翻月份
{
    WebCalendar.thisDay = 1;
    if (WebCalendar.thisMonth==1)
    {
        WebCalendar.thisYear--;
        WebCalendar.thisMonth=13;
    }
    WebCalendar.thisMonth--; writeCalendar();
}
function nextM()  //往后翻月份
{
    WebCalendar.thisDay = 1;
    if (WebCalendar.thisMonth==12)
    {
        WebCalendar.thisYear++;
        WebCalendar.thisMonth=0;
    }
    WebCalendar.thisMonth++; writeCalendar();
}
function prevY(){WebCalendar.thisDay = 1; WebCalendar.thisYear--; writeCalendar();}//往前翻 Year
function nextY(){WebCalendar.thisDay = 1; WebCalendar.thisYear++; writeCalendar();}//往后翻 Year
function hiddenSelect(e){for(var i=e.options.length; i>-1; i--)e.options.remove(i); e.style.display="none";}
function getObjectById(id){ if(document.all) return(eval("document.all."+ id)); return(eval(id)); }
function hiddenCalendar()
{
	var ctrl=document.getElementById("meizzCalendarLayer")
	if(ctrl && "none"!=ctrl.style.display && WebCalendar.objExport)
		if(WebCalendar.objExport.dataFld==WebCalendar.objExport.colname)
			WebCalendar.objExport.fireEvent("onafterupdate");
	ctrl.style.display = "none";
};
function appendZero(n){return(("00"+ n).substr(("00"+ n).length-2));}//日期自动补零程序
function String.prototype.trim(){return this.replace(/(^\s*)|(\s*$)/g,"");}
function dayMouseOver()
{
    this.className = "over";
    this.style.backgroundColor = WebCalendar.darkColor;
    if(WebCalendar.day[this.id.substr(8)].split("/")[1] == WebCalendar.thisMonth)
    this.style.color = WebCalendar.lightColor;
}
function dayMouseOut()
{
    this.className = "out"; var d = WebCalendar.day[this.id.substr(8)], a = d.split("/");
    this.style.removeAttribute('backgroundColor');
    if(a[1] == WebCalendar.thisMonth && d != WebCalendar.today)
    {
        if(WebCalendar.dateStyle && a[0] == parseInt(WebCalendar.dateStyle[4], 10))
        this.style.color = WebCalendar.lightColor;
        this.style.color = WebCalendar.wordColor;
    }
}
function writeCalendar() //对日历显示的数据的处理程序
{
    var y = WebCalendar.thisYear;
    var m = WebCalendar.thisMonth; 
    var d = WebCalendar.thisDay;
    WebCalendar.daysMonth[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28;
    if (!(y<=9999 && y >= 1000 && parseInt(m, 10)>0 && parseInt(m, 10)<13 && parseInt(d, 10)>0)){
        alert("对不起，你输入了错误的日期！");
        WebCalendar.thisYear   = new Date().getFullYear();
        WebCalendar.thisMonth  = new Date().getMonth()+ 1;
        WebCalendar.thisDay    = new Date().getDate(); }
    y = WebCalendar.thisYear;
    m = WebCalendar.thisMonth;
    d = WebCalendar.thisDay;
    WebCalendar.iframe.meizzYearHead.innerText  = y +" 年";
    WebCalendar.iframe.meizzYearMonth.innerText = parseInt(m, 10) +" 月";
    WebCalendar.daysMonth[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28; //闰年二月为29天
    var w = new Date(y, m-1, 1).getDay();
    var prevDays = m==1  ? WebCalendar.daysMonth[11] : WebCalendar.daysMonth[m-2];
    for(var i=(w-1); i>=0; i--) //这三个 for 循环为日历赋数据源（数组 WebCalendar.day）格式是 d/m/yyyy
    {
        WebCalendar.day[i] = prevDays +"/"+ (parseInt(m, 10)-1) +"/"+ y;
        if(m==1) WebCalendar.day[i] = prevDays +"/"+ 12 +"/"+ (parseInt(y, 10)-1);
        prevDays--;
    }
    for(var i=1; i<=WebCalendar.daysMonth[m-1]; i++) WebCalendar.day[i+w-1] = i +"/"+ m +"/"+ y;
    for(var i=1; i<39-w-WebCalendar.daysMonth[m-1]+1; i++)
    {
        WebCalendar.day[WebCalendar.daysMonth[m-1]+w-1+i] = i +"/"+ (parseInt(m, 10)+1) +"/"+ y;
        if(m==12) WebCalendar.day[WebCalendar.daysMonth[m-1]+w-1+i] = i +"/"+ 1 +"/"+ (parseInt(y, 10)+1);
    }
    for(var i=0; i<39; i++)    //这个循环是根据源数组写到日历里显示
    {
        var a = WebCalendar.day[i].split("/");
        WebCalendar.dayObj[i].innerText    = a[0];
        WebCalendar.dayObj[i].title        = a[2] +"-"+ appendZero(a[1]) +"-"+ appendZero(a[0]);
        WebCalendar.dayObj[i].bgColor      = WebCalendar.dayBgColor;
        WebCalendar.dayObj[i].style.color  = WebCalendar.wordColor;
        WebCalendar.dayObj[i].style.fontWeight="";
        if ((i<10 && parseInt(WebCalendar.day[i], 10)>20) || (i>27 && parseInt(WebCalendar.day[i], 10)<12))
            WebCalendar.dayObj[i].style.color = WebCalendar.wordDark;
        if (WebCalendar.inputDate==WebCalendar.day[i])    //设置输入框里的日期在日历上的颜色
        {WebCalendar.dayObj[i].bgColor = WebCalendar.dayColor; WebCalendar.dayObj[i].style.color = WebCalendar.lightColor;}
        if (WebCalendar.day[i] == WebCalendar.today)      //设置今天在日历上反应出来的颜色
        {
			WebCalendar.dayObj[i].style.fontWeight="bold";
		}
    }
}
function returnDate() 
{
    if(WebCalendar.objExport)
    {
        var returnValue;
        var a = (arguments.length==0) ? WebCalendar.day[this.id.substr(8)].split("/") : arguments[0].split("/");
        var d = WebCalendar.format.match(/^(\w{4})(-|\/|.|)(\w{1,2})\2(\w{1,2})$/);
        if(d==null){alert("你设定的日期输出格式不对！\r\n\r\n请重新定义 WebCalendar.format ！"); return false;}
        var flag = d[3].length==2 || d[4].length==2; //判断返回的日期格式是否要补零
        returnValue = flag ? a[2] +d[2]+ appendZero(a[1]) +d[2]+ appendZero(a[0]) : a[2] +d[2]+ a[1] +d[2]+ a[0];
        if(WebCalendar.timeShow)
        {
            var h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds();
            returnValue += flag ? " "+ appendZero(h) +":"+ appendZero(m) +":"+ appendZero(s) : " "+  h  +":"+ m +":"+ s;
        }
        try{WebCalendar.objExport.value = returnValue;}catch(ex){}
        try{WebCalendar.objExport.fireEvent("onchange");}catch(ex){}
		WebCalendar.objExport.fireEvent("onafterupdate");
		var ctrl=document.getElementById("meizzCalendarLayer")
		ctrl.style.display = "none";
    }
}
function returnNull() 
{
    if(WebCalendar.objExport)
    {
        var returnValue="";
        try{WebCalendar.objExport.value = returnValue;}catch(ex){}
        try{WebCalendar.objExport.fireEvent("onchange");}catch(ex){}
		WebCalendar.objExport.fireEvent("onafterupdate");
		var ctrl=document.getElementById("meizzCalendarLayer")
		ctrl.style.display = "none";
    }
}

function document.onclick()
{
    if(window.WebCalendar && WebCalendar.eventSrc != window.event.srcElement) hiddenCalendar();
    if(window.WebTime && WebTime.eventSrc != window.event.srcElement) hiddenXTime();
}
