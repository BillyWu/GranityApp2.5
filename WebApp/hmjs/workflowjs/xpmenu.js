/*--------------------------------------------------|
| 本作品取得原作者授权修改自 support@tops.com.cn    |
| 的作品topflow                                     |
|                                                   |
| 显示XP样式的主菜单，本文为第三方控件，            |
| 主要来自WebMenuShop，如需使用，请参考相关资料     |
|                                                   |
| 版权归上海雪线信息技术有限公司所有，              |
| 技术支持：sales@shcommit.com （仅对付费用户）     |
| 网    站：www.shcommit.com                        |
|                                                   |
| 请勿私自拷贝、修改或用于商业用途                  |
| 敬请保留本注释.                                   |
|                                                   |
| Updated: 20070613                                 |
|--------------------------------------------------*/
var mmenus    = new Array();
var misShow   = new Boolean(); 
misShow = false;
var misdown   = new Boolean();
misdown=false;
var musestatus = false;
var mpopTimer = 0;
mmenucolor = 'Menu';mfontcolor='MenuText';mmenuoutcolor='#CCCCFF';mmenuincolor='#CCCCFF';mmenuoutbordercolor='#000000';mmenuinbordercolor='#000000';mmidoutcolor='#AAAAAA';mmidincolor='#AAAAAA';mmenuovercolor='MenuText';mitemedge='0';msubedge='1';mmenuunitwidth=74;mmenuitemwidth=160;mmenuheight=30;mmenuwidth='100%';mmenuadjust=0;mmenuadjustV=-4;mfonts='font-family: Verdana; font-size: 8pt; color: MenuText; ';mcursor='default';

function mpopOut() {
  mpopTimer = setTimeout('mallhide()', 500);
}
function getReal(el, type, value) {
  temp = el;
  while ((temp != null) && (temp.tagName != "BODY")) {
    if (eval("temp." + type) == value) {
      El = temp;
      return el;
    }
    temp = temp.parentElement;
  }
  return el;
}

function mMenuRegister(menu) 
{
  mmenus[mmenus.length] = menu;
  return (mmenus.length - 1);
}
function mMenuItem(caption,command,target,isline,statustxt,img,sizex,sizey,pos){
  this.caption=caption;
  this.command=command;
  this.target=target;
  this.isline=isline;
  this.statustxt=statustxt;
  this.img=img;
  this.sizex=sizex;
  this.sizey=sizey;
  this.pos=pos;
}
function mMenu(caption,command,target,img,sizex,sizey,pos){
  this.items = new Array();
  this.caption=caption;
  this.command=command;
  this.target=target;
  this.img=img;
  this.sizex=sizex;
  this.sizey=sizey;
  this.pos=pos;
  this.id=mMenuRegister(this);
}
function mMenuAddItem(item)
{
  this.items[this.items.length] = item
  item.parent = this.id;
  this.children=true;
}

mMenu.prototype.addItem = mMenuAddItem;
function mtoout(src){
  src.style.border='solid 1';
  src.style.borderLeftColor=mmenuoutbordercolor;
  src.style.borderRightColor=mmenuinbordercolor;
  src.style.borderTopColor=mmenuoutbordercolor;
  src.style.borderBottomColor=mmenuinbordercolor;
  src.style.backgroundColor=mmenuoutcolor;
  src.style.color=mmenuovercolor;
}
function mtoin(src){
  src.style.border='solid 1';
  src.style.borderLeftColor=mmenuinbordercolor;
  src.style.borderRightColor=mmenuoutbordercolor;
  src.style.borderTopColor=mmenuinbordercolor;
  src.style.borderBottomColor=mmenuoutbordercolor;
  src.style.backgroundColor=mmenuincolor;
  src.style.color=mmenuovercolor;
}
function mnochange(src){
  src.style.borderLeftColor=mmenucolor;
  src.style.borderRightColor=mmenucolor;
  src.style.borderTopColor=mmenucolor;
  src.style.borderBottomColor=mmenucolor;
  src.style.backgroundColor='';
  src.style.color=mfontcolor;
  src.style.border='solid 0';
}
function mallhide(){
  for(var nummenu=0;nummenu<mmenus.length;nummenu++){
    var themenu=document.all['mMenu'+nummenu];
    var themenudiv=document.all['mmenudiv'+nummenu];
    mnochange(themenu);
    mmenuhide(themenudiv);
  }
}
function mmenuhide(menuid){
  menuid.style.visibility='hidden';
  misShow=false;
}
function mmenushow(menuid,pid){
  menuid.style.left=mposflag.offsetLeft+pid.offsetLeft+mmenuadjust;menuid.style.top=mposflag.offsetTop+mmenutable.offsetHeight+mmenuadjustV;
  if(mmenuitemwidth+parseInt(menuid.style.left)>document.body.clientWidth+document.body.scrollLeft)
  menuid.style.left=document.body.clientWidth+document.body.scrollLeft-mmenuitemwidth;
  menuid.style.visibility='visible';
  misShow=true;
}
function mmenu_over(menuid,x){
  toel = getReal(window.event.toElement, "className", "coolButton");
  fromel = getReal(window.event.fromElement, "className", "coolButton");
  if (toel == fromel) return;
  if(x==mmenus.length){
    misShow = false;
    mallhide();
    mtoout(eval("mMenu"+x));
  }else{
    mallhide();
    mtoin(eval("mMenu"+x));
    mmenushow(menuid,eval("mMenu"+x));
  }
  clearTimeout(mpopTimer);
}
function mmenu_out(x){
  toel = getReal(window.event.toElement, "className", "coolButton");
  fromel = getReal(window.event.fromElement, "className", "coolButton");
  if (toel == fromel) return;
  if (misShow){
    mtoin(eval("mMenu"+x));
  }else{
    mnochange(eval("mMenu"+x));
  }
  mpopOut()
}
function mmenu_down(menuid,x){
  if(misShow){
  mmenuhide(menuid);
  mtoout(eval("mMenu"+x));
  }
  else{
  mtoin(eval("mMenu"+x));
  mmenushow(menuid,eval("mMenu"+x));
  misdown=true;
  }
}
function mmenu_up(){
  misdown=false;
}
function mmenuitem_over(x,i){
  srcel = getReal(window.event.srcElement, "className", "coolButton");
  if(misdown){
    mtoin(srcel);
  }
  else{
    mtoout(srcel);
  }
  mthestatus = mmenus[x].items[i].statustxt;
  if(mthestatus!=""){
    musestatus=true;
    window.status=mthestatus;
  }
  clearTimeout(mpopTimer);
}
function mmenuitem_out(){
  srcel = getReal(window.event.srcElement, "className", "coolButton");
  mnochange(srcel);
  if(musestatus)window.status="";
  mpopOut()
}
function mmenuitem_down(){
  srcel = getReal(window.event.srcElement, "className", "coolButton");
  mtoin(srcel);
  misdown=true;
}
function mmenuitem_up(){
  srcel = getReal(window.event.srcElement, "className", "coolButton");
  mtoout(srcel);
  misdown=false;
}
function mexec2(x){
  var cmd;
  if(mmenus[x].target=="blank"){
    cmd = "window.open('"+mmenus[x].command+"')";
  }else{
    cmd = mmenus[x].target+".location=\""+mmenus[x].command+"\"";
  }
  eval(cmd);
}
function mexec(x,i){
  var cmd;mallhide();
  if(mmenus[x].items[i].target=="blank"){
    cmd = "window.open('"+mmenus[x].items[i].command+"')";
  }else{
    cmd = mmenus[x].items[i].target+".location=\""+mmenus[x].items[i].command+"\"";
  }
  eval(cmd);
}
function mbody_click(){
  if (misShow){
    srcel = getReal(window.event.srcElement, "className", "coolButton");
    for(var x=0;x<=mmenus.length;x++){
      if(srcel.id=="mMenu"+x)
        return;
    }
    mallhide();
  }
}

//document.onclick=mbody_click;
function mwritetodocument(){
  var mwb=1;
  var stringx='<div id="mposflag" style="position:absolute;"></div><table  id=mmenutable border=0 cellpadding=3 cellspacing=2 width='+mmenuwidth+' height='+mmenuheight+' bgcolor='+mmenucolor+
    ' onselectstart="event.returnValue=false"'+
    ' style="cursor:'+mcursor+';'+mfonts+
    ' border-left: '+mwb+'px solid '+mmenuoutbordercolor+';'+
    ' border-right: '+mwb+'px solid '+mmenuinbordercolor+'; '+
    'border-top: '+mwb+'px solid '+mmenuoutbordercolor+'; '+
    'border-bottom: '+mwb+'px solid '+mmenuinbordercolor+'; padding:0px"><tr><td width="1"><img src="image/logo.gif" align="absmiddle" height="20" width="130" border="0"></td>'
    for(var x=0;x<mmenus.length;x++){
      var thismenu=mmenus[x];
      var imgsize="";
      if(thismenu.sizex!="0"||thismenu.sizey!="0")imgsize=" width="+thismenu.sizex+" height="+thismenu.sizey;
      var ifspace="";
      if(thismenu.caption!="")ifspace="&nbsp;";
      stringx += "<td nowrap class=coolButton id=mMenu"+x+" style='border: "+mitemedge+"px solid "+mmenucolor+
        "' width="+mmenuunitwidth+"px onmouseover=mmenu_over(mmenudiv"+x+
        ","+x+") onmouseout=mmenu_out("+x+
        ") onmousedown=mmenu_down(mmenudiv"+x+","+x+")";
      if(thismenu.command!=""){
        stringx += " onmouseup=mmenu_up();mexec2("+x+");";
      }else{
        stringx += " onmouseup=mmenu_up()";
      }
      if(thismenu.pos=="0"){
        stringx += " align=center><img align=absmiddle src='"+thismenu.img+"'"+imgsize+">"+ifspace+thismenu.caption+"</td>";    
      }else if(thismenu.pos=="1"){
        stringx += " align=center>"+thismenu.caption+ifspace+"<img align=absmiddle src='"+thismenu.img+"'"+imgsize+"></td>";    
      }else if(thismenu.pos=="2"){
        stringx += " align=center background='"+thismenu.img+"'>&nbsp;"+thismenu.caption+"&nbsp;</td>";    
      }else{
        stringx += " align=center>&nbsp;"+thismenu.caption+"&nbsp;</td>";
      }
      stringx += "";
    }
  stringx+="<td width=*>&nbsp;</td></tr></table>";


  for(var x=0;x<mmenus.length;x++){
    thismenu=mmenus[x];
    if(x==mmenus.length){
      stringx+='<div id=mmenudiv'+x+' style="visiable:none"></div>';
    }else{
      stringx+='<div id=mmenudiv'+x+
        ' style="cursor:'+mcursor+';position:absolute;'+
        'width:'+mmenuitemwidth+'px; z-index:'+(x+100);
      if(mmenuinbordercolor!=mmenuoutbordercolor&&msubedge=="0"){
        stringx+=';border-left: 1px solid '+mmidoutcolor+
          ';border-top: 1px solid '+mmidoutcolor;}
      stringx+=';border-right: 1px solid '+mmenuinbordercolor+
        ';border-bottom: 1px solid '+mmenuinbordercolor+';visibility:hidden" onselectstart="event.returnValue=false">\n'+
        '<table background="image/xpbg.gif" width="100%" border="0" height="100%" align="center" cellpadding="0" cellspacing="2" '+
        'style="'+mfonts+' border-left: 1px solid '+mmenuoutbordercolor;
      if(mmenuinbordercolor!=mmenuoutbordercolor&&msubedge=="0"){
        stringx+=';border-right: 1px solid '+mmidincolor+
          ';border-bottom: 1px solid '+mmidincolor;
      }
      stringx+=';border-top: 1px solid '+mmenuoutbordercolor+ ';padding: 4px" bgcolor='+mmenucolor+'>\n';
        for(var i=0;i<thismenu.items.length;i++){
          var thismenuitem=thismenu.items[i];
          var imgsize="";
          if(thismenuitem.sizex!="0"||thismenuitem.sizey!="0")imgsize=" width="+thismenuitem.sizex+" height="+thismenuitem.sizey;
          var ifspace="";
          if(thismenu.caption!="")ifspace="&nbsp;";
          if(!thismenuitem.isline){
            stringx += "<tr><td class=coolButton style='border: "+mitemedge+"px solid "+mmenucolor+
              "' width=100% height=15px onmouseover=\"mmenuitem_over("+x+","+i+
              ");\" onmouseout=mmenuitem_out() onmousedown=mmenuitem_down() onmouseup=";
            stringx += "mmenuitem_up();mexec("+x+","+i+"); ";
            if(thismenuitem.pos=="0"){
              stringx += "><img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+">"+ifspace+thismenuitem.caption+"</td></tr>";    
            }else if(thismenuitem.pos=="1"){
              stringx += ">"+thismenuitem.caption+ifspace+"<img align=absmiddle src='"+thismenuitem.img+"'"+imgsize+"></td></tr>";    
            }else if(thismenuitem.pos=="2"){
              stringx += "background='"+thismenuitem.img+"'>"+thismenuitem.caption+"</td></tr>";    
            }else{
              stringx += ">"+thismenuitem.caption+"</td></tr>";
            }
          }else{
            stringx+='<tr><td height="1" background="image/hr.gif" onmousemove="clearTimeout(mpopTimer);"><img height="1" width="1" src="none.gif" border="0"></td></tr>\n';
          }
        }
        stringx+='</table>\n</div>';
    }
  }
  document.write("<div align='left'>"+stringx+"</div>");
}


mpmenu1=new mMenu('流程图','','self','','','','');
mpmenu1.addItem(new mMenuItem('新建','javascript:mnuNewFlow();','self',false,'新建流程图 Ctrl+N','image/new.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('打开','javascript:mnuOpenFlow();','self',false,'打开流程图 Ctrl+O','image/open.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('校验','javascript:mnuValidateFlow();','self',false,'校验流程图','image/validate.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('保存','javascript:mnuSaveFlow();','self',false,'保存流程图 Ctrl+S','image/save.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('属性','javascript:mnuEditFlow();','self',false,'流程图属性','image/edit.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('重新载入','javascript:mnuReloadFlow();','self',false,'重载流程图','image/refresh.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem(null,null,null,true));
mpmenu1.addItem(new mMenuItem('放大显示','javascript:mnuSetZoom(\'in\');','self',false,'放大显示 Ctrl++','image/zoomin.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('缩小显示','javascript:mnuSetZoom(\'out\');','self',false,'放大显示 Ctrl+-','image/zoomout.gif','0','0','0'));

mpmenu2=new mMenu('流程图对象','','self','','','','');
mpmenu2.addItem(new mMenuItem('新建[任务]','javascript:mnuAddProc();','self',false,'新建[任务]','image/add_proc.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('新建[路径]','javascript:mnuAddStep();','self',false,'新建[路径]','image/add_step.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('复制[任务]','javascript:mnuCopyProc();','self',false,'复制[任务]','image/copy.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('编辑选中...','javascript:mnuEditObj();','self',false,'编辑选中的对象[过程或路径]','image/edit_obj.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('删除选中...','javascript:mnuDelObj();','self',false,'删除选中的对象[过程或路径]','image/del_obj.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem(null,null,null,true));
mpmenu2.addItem(new mMenuItem('撤消操作','javascript:undoLog();','self',false,'撤消最后一次操作 Ctrl+Z','image/undo.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('恢复操作','javascript:redoLog();','self',false,'恢复最后一次取消的操作 Ctrl+Y/Ctrl+Shift+Z','image/redo.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('移到最顶层','javascript:mnuSetZIndex(\'F\');','self',false,'将对象显示在最上面一层','image/front.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('移动最底层','javascript:mnuSetZIndex(\'B\');','self',false,'将对象显示在最底下一层','image/back.gif','0','0','0'));

mpmenu3=new mMenu('窗口','','self','','','','');
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_toolbox">隐藏工具箱</div>','javascript:mnuTurnToolbox();','self',false,'显示/隐藏工具箱','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_propbox">隐藏属性框</div>','javascript:mnuTurnPropbox();','self',false,'显示/隐藏属性框','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_objview">隐藏对象视图</div>','javascript:mnuTurnObjView();','self',false,'显示/隐藏对象视图','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_dataview">隐藏数据视图</div>','javascript:mnuTurnDataView();','self',false,'显示/隐藏对象视图','image/blank.gif','16','16','0'));

mpmenu4=new mMenu('系统','','self','','','','');
mpmenu4.addItem(new mMenuItem('选项','javascript:mnuOption();','self',false,'系统设置选项','image/option.gif','0','0','0'));
mpmenu4.addItem(new mMenuItem('文件管理','javascript:mnuFileMgr();','self',false,'文件管理','image/blank.gif','16','16','0'));
mpmenu4.addItem(new mMenuItem('关于TopFlow','javascript:mnuAbout();','self',false,'关于本软件--TopFlow','image/blank.gif','16','16','0'));
mpmenu4.addItem(new mMenuItem(null,null,null,true));
mpmenu4.addItem(new mMenuItem('演示','javascript:mnuDemo();','self',false,'退出本系统','image/logo16.gif','0','0','0'));
mpmenu4.addItem(new mMenuItem('退出','javascript:mnuExit();','self',false,'退出本系统','image/exit.gif','0','0','0'));
//mwritetodocument();
