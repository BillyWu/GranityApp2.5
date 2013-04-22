//可以打包为js文件;
var x0 = 0, y0 = 0, x1 = 0, y1 = 0;
var offx = 6, offy=6;
var moveable = false;
var hover = 'orange', normal = '#000';//color;
var index = 10000;//z-index;
//开始拖动;
function startDrag(obj)
{
  if (event.button == 1)
  {
    //锁定标题栏;
    obj.setCapture();
    //定义对象;
    var win = obj.parentNode;
    var sha = win.nextSibling;
    var iframesha = win.nextSibling.nextSibling;
    //记录鼠标和层位置;
    x0 = event.clientX;
    y0 = event.clientY;
    
    x1 = parseInt(win.style.left);
    y1 = parseInt(win.style.top);
    //记录颜色;
    normal = obj.style.backgroundColor;
    //改变风格;
    obj.style.backgroundColor = hover;
    win.style.borderColor = hover;
    obj.nextSibling.style.color = hover;
    sha.style.left = x1 + offx;
    sha.style.top = y1 + offy;
    if(win.nobg){
        iframesha.style.left = x1 + offx;
        iframesha.style.top = y1 + offy;
    }
    moveable = true;
  }
}
//拖动;
function drag(obj)
{
  if (moveable)
  {
    var win = obj.parentNode;
    var sha = win.nextSibling;
    var iframesha = win.nextSibling.nextSibling;
    win.style.left = x1 + event.clientX - x0;
    win.style.top = y1 + event.clientY - y0;
    sha.style.left = parseInt(win.style.left) + offx;
    sha.style.top = parseInt(win.style.top) + offy;
    if(win.nobg){
    iframesha.style.left = parseInt(win.style.left) + offx;
    iframesha.style.top = parseInt(win.style.top) + offy;
    }
  }
}
//停止拖动;
function stopDrag(obj)
{
  if (moveable)
  {
    var win = obj.parentNode;
    var sha = win.nextSibling;
    var msg = obj.nextSibling;
    var iframesha = win.nextSibling.nextSibling;
    win.style.borderColor = normal;
    obj.style.backgroundColor = normal;
    msg.style.color = normal;
    sha.style.left = obj.parentNode.style.left;
    sha.style.top = obj.parentNode.style.top;
    if(sha.style.top.indexOf("-")>-1){
        sha.style.top="5px"
        obj.parentNode.style.top="5px";
    }
    if(sha.style.left.indexOf("-")>-1){
        sha.style.left="5px"
        obj.parentNode.style.left="5px";
    }
    obj.releaseCapture();
    moveable = false;
    if(win.nobg){
    iframesha.style.left = obj.parentNode.style.left;
    iframesha.style.top = obj.parentNode.style.top;
    }
  }
}

//获得焦点;切换层的次序(目前关闭)
function getFocus(obj)
{
  obj.style.zIndex = getMaxZIndex()+2;
  return;
  if (obj.style.zIndex != index)
  {
    index = index + 2;
    var idx = index;
    obj.style.zIndex = idx;
    obj.nextSibling.style.zIndex = idx - 1;
  }
}
//最小化;
function min(obj)
{
  var win = obj.parentNode.parentNode;
  var sha = win.nextSibling;
  var iframesha = win.nextSibling.nextSibling;
  var tit = obj.parentNode;
  var msg = tit.nextSibling;
  var flg = msg.style.display=="none";
  if (flg)
  {
    win.style.height = parseInt(msg.style.height) + parseInt(tit.style.height) + 2 * 2;
    sha.style.height = win.style.height;
    if(win.nobg)iframesha.style.height = win.style.height;
    msg.style.display = "block";
    obj.innerHTML = "0";
  }
  else
  {
    win.style.height = parseInt(tit.style.height) + 2 * 2;
    sha.style.height = win.style.height;
    if(win.nobg)iframesha.style.height = win.style.height;
    obj.innerHTML = "2";
    msg.style.display = "none";
  }
}
// 获取最大的z-Index
function getMaxZIndex() {
    var allWin = document.getElementsByTagName("DIV");
    var maxZIndex=0
    for (var i = 0; i < allWin.length; i++) {
        if(allWin[i].id.indexOf("xMsg")<0) continue;
        var curZ = parseInt(allWin[i].style.zIndex);
        if (curZ > maxZIndex) {
            maxZIndex = curZ;
        }
    }
    return maxZIndex;
}
//创建一个对象id, w, h, l, t, tit, msg;
function xWin(winpm)
{
  index = getMaxZIndex();
  if(index<1000) index=1000;
  index = index + 2;
  this.id = winpm.id;
  this.width = (!winpm.width)?620:winpm.width;
  this.height =(!winpm.height)?400:winpm.height;
  if(winpm.width=="100%") {this.left=0;this.top=0};
  else
  {
    this.left = (!winpm.left)?200:winpm.left;
    this.top = (!winpm.top)?200:winpm.top;
  }
  this.align = (winpm.align==null)?"center":winpm.align;
  this.zIndex = index;
  this.title = winpm.title;
  this.ItemName = winpm.ItemName;
  this.message = winpm.text;
  this.color = (!winpm.color)?normal:winpm.color;
  this.hover = (!winpm.hovercolor)?"orange":winpm.hovercolor;
  this.nobg = winpm.nobg;
  hover = this.hover;
  normal = this.color;
  this.obj = null;
  this.bulid = bulid;
  this.bulid();
}
//初始化;
function bulid()
{
  var str = ""
    + "<div id=xMsg" + this.id + " "
    + "style='"
    + "z-index:" + this.zIndex + ";"
    + "width:" + this.width + ";"
    + "height:" + this.height + ";"
    + "left:" + this.left + ";"
    + "top:" + this.top + ";"
    + "background-color:" + normal + ";"
    + "color:" + normal + ";"
    + "font-size:8pt;"
    + "font-family:Tahoma;"
    + "position:absolute;"
    + "cursor:default;"
    + "border:2px solid " + normal + ";"
    + "' "
    + "items='"+this.ItemName+"' "
    + "onmousedown='getFocus(this)'>"
    + "<div id=xMsg" + this.id + "inner "
    + "style='"
    + "background-color:" + normal + ";"
    + "width:" + (this.width-2*2) + ";"
    + "height:20;"
    + "color:white;"
    + "' "
    + "onmousedown='startDrag(this)' "
    + "onmouseup='stopDrag(this)' "
    + "onmousemove='drag(this)' "
    + "ondblclick='min(this.childNodes[1])'"
    + ">"
    + "<span id=xMsg" + this.id + "span style='text-align:left;color: #FFFFFF;width:" + (this.width-2*12-4) + ";padding-left:3px;'>" + this.title + "</span>"
    + "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;' title='最小化' onclick='min(this)'>0</span>"
    + "<span style='width:12;border-width:0px;color:white;font-family:webdings;cursor:hand;' title='关闭' onclick='ShowHide(\""+this.id+"\",\"none\")'>r</span>"
    + "</div>"
    + "<div align="+this.align+" id=xMsg" + this.id + "msg style='"
    + "width:100%;"
    + "height:" + (this.height-20-4) + ";"
    + "background-color:white;"
    + "line-height:14px;"
    + "word-break:break-all;"
    + "padding:3px;"
    + "'>" + this.message + "</div>"
    + "</div>"
    + "<div id=xMsg" + this.id + "bg style='"
    + "width:" + this.width + ";"
    + "height:" + this.height + ";"
    + "top:" + this.top + ";"
    + "left:" + this.left + ";"
    + "z-index:" + (this.zIndex-1) + ";"
    + "text-align:center;"
    + "position:absolute;"
    + "background-color:black;"
    + "filter:alpha(opacity=40);"
    + "'></div>";
    if(this.nobg) var ibg=""
    else
        var ibg = "<iframe  id=xMsg" + this.id + "iframe style=\"position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
    document.body.insertAdjacentHTML("beforeEnd", str+ibg);
  
}

function dlgbuild(str,winid)
{return function(){x_dlgbuild(str,winid);}}

function x_dlgbuild(str,winid)
{
    document.body.insertAdjacentHTML("beforeEnd", str);
    center(winid);
}
//显示隐藏窗口
function ShowHide(id, dis,nofresh)
{
  if(!$("xMsg"+id)) return;
  if(dis=="none" && "function"==typeof(BeforeWinClose)){
    if(!BeforeWinClose(id)) return
  }    
  var bdisplay=dis;
  if(dis!="none") index = getMaxZIndex();  
  if(bdisplay==null)
    bdisplay = (dis == null)?(($("xMsg"+id).style.display=="")?"none":""):dis
  $("xMsg"+id).style.display = bdisplay;
  if($("xMsg"+id+"bg"))
    $("xMsg"+id+"bg").style.display = bdisplay;
  if($("xMsg"+id+"iframe"))
    $("xMsg"+id+"iframe").style.display = bdisplay;
  if(dis!="none")return;
  if(!nofresh && "function"==typeof(afterWinClose)){afterWinClose(id);}    
}
function isExist(id)
{
    if($("xMsg"+id) && $("xMsg"+id).style.display!="none") return true
}

function center(id)
{
    xwin = $("xMsg"+id);
    if(!xwin) return;
    if(xwin.style.width=="100%") return;
    xwin.style.zIndex = getMaxZIndex()+2;
    var wleft = (document.body.clientWidth-xwin.clientWidth)/2 < 0 ? 0 : (document.body.clientWidth-xwin.clientWidth)/2;
    var wtop = (document.body.clientHeight-xwin.clientHeight)/2 < 0 ? 0 : (document.body.clientHeight-xwin.clientHeight)/2;;
    xwin.style.left = wleft;
    xwin.style.top  = wtop;

    xwinbg = $("xMsg"+id+"bg");
    xwinbg.style.zIndex=parseInt(xwin.style.zIndex)-1;
    xwinbg.style.left = wleft;
    xwinbg.style.top  = wtop;
    xwinbgi = $("xMsg"+id+"iframe");
    if(!xwinbgi) return;
    xwinbgi.style.zIndex=parseInt(xwin.style.zIndex)-2;
    if(xwin.nobg){xwinbgi.style.left = wleft;
    xwinbgi.style.top  = wtop;}
}
function bottom(id)
{
    xwin = $("xMsg"+id);
    if(!xwin) return;
    xwin.style.zIndex = getMaxZIndex()+2;

	divHeight = parseInt(xwin.offsetHeight,10)
	divWidth = parseInt(xwin.offsetWidth,10)
	docWidth = document.body.clientWidth;
	docHeight = document.body.clientHeight;
	xwin.style.top = docHeight - divHeight + parseInt(document.body.scrollTop,10)-2
	xwin.style.left = docWidth - divWidth + parseInt(document.body.scrollLeft,10)-2

    xwinbg = $("xMsg"+id+"bg");
    xwinbg.style.zIndex=parseInt(xwin.style.zIndex)-1;
    xwinbg.style.left = xwin.style.left;
    xwinbg.style.top  = xwin.style.left;
    xwinbgi = $("xMsg"+id+"iframe");
    if(!xwinbgi) return;
    xwinbgi.style.zIndex=parseInt(xwin.style.zIndex)-2;
}

function ResetDlgWidth(winid,iwidth)
{
    $("xMsg"+winid).style.width = iwidth;
    $("xMsg"+winid+"bg").style.width = iwidth;
    $("xMsg"+winid+"inner").style.width = iwidth-2*2;
    $("xMsg"+winid+"span").style.width = iwidth-2*12-4;
    if(xwinbgi) $("xMsg"+winid+"iframe").style.width = iwidth;
    center(winid);
}
//窗口对象
function dwobj(id)
{
    xwin = $("xMsg"+id);
    if(xwin) return xwin;
    else return null;
}
//窗口内容
function dwmsg(id)
{
    return $("xMsg"+id+"msg");
}

//标准弹出窗口
function DlgWin(winid,gridname,title,ItemName,str,w,h,pos,wincolor,nobg)
{
    if(!winid) winid="1";
    var owin = dwobj(winid);
    if(!str) str="<div id="+gridname+" style='width:100%;height:100%;text-align:left'></div>";
    if(!owin)
    {
        var owin = new Object;
        owin.id     = winid;
        owin.title  = title;
        owin.width  = w;
        owin.height = h;
        owin.text   = str;
        owin.color  = wincolor;
        owin.nobg = nobg;
        if(ItemName) 
            owin.ItemName=ItemName;
        var a = new xWin(owin);
    }
    else
    {
        $("xMsg"+winid+"span").innerHTML=title;
        $("xMsg" + winid + "msg").innerHTML=str;
        ShowHide(winid,null);
    }
    $("xMsg"+winid).ItemName = ItemName;
    switch(pos){
        case "bottom":
            bottom(winid)
            break;
        case "top":
            xwin = $("xMsg"+winid);
            if(!xwin) return;
            xwin.style.zIndex = getMaxZIndex()+2;
	        xwin.style.top = 1
	        xwin.style.left = 1
            xwinbg = $("xMsg"+winid+"bg");
            if(!xwinbg) return;
            xwinbg.style.zIndex=parseInt(xwin.style.zIndex)-1;
            xwinbg.style.left = xwin.style.left;
            xwinbg.style.top  = xwin.style.left;
            xwinbgi = $("xMsg"+winid+"iframe");
            if(!xwinbgi) return;
            xwinbgi.style.zIndex=parseInt(xwin.style.zIndex)-2;
            break;
        default:
            center(winid);
    }
    
}       
      
