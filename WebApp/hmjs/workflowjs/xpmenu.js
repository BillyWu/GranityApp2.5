/*--------------------------------------------------|
| ����Ʒȡ��ԭ������Ȩ�޸��� support@tops.com.cn    |
| ����Ʒtopflow                                     |
|                                                   |
| ��ʾXP��ʽ�����˵�������Ϊ�������ؼ���            |
| ��Ҫ����WebMenuShop������ʹ�ã���ο��������     |
|                                                   |
| ��Ȩ���Ϻ�ѩ����Ϣ�������޹�˾���У�              |
| ����֧�֣�sales@shcommit.com �����Ը����û���     |
| ��    վ��www.shcommit.com                        |
|                                                   |
| ����˽�Կ������޸Ļ�������ҵ��;                  |
| ���뱣����ע��.                                   |
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


mpmenu1=new mMenu('����ͼ','','self','','','','');
mpmenu1.addItem(new mMenuItem('�½�','javascript:mnuNewFlow();','self',false,'�½�����ͼ Ctrl+N','image/new.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('��','javascript:mnuOpenFlow();','self',false,'������ͼ Ctrl+O','image/open.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('У��','javascript:mnuValidateFlow();','self',false,'У������ͼ','image/validate.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('����','javascript:mnuSaveFlow();','self',false,'��������ͼ Ctrl+S','image/save.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('����','javascript:mnuEditFlow();','self',false,'����ͼ����','image/edit.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('��������','javascript:mnuReloadFlow();','self',false,'��������ͼ','image/refresh.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem(null,null,null,true));
mpmenu1.addItem(new mMenuItem('�Ŵ���ʾ','javascript:mnuSetZoom(\'in\');','self',false,'�Ŵ���ʾ Ctrl++','image/zoomin.gif','0','0','0'));
mpmenu1.addItem(new mMenuItem('��С��ʾ','javascript:mnuSetZoom(\'out\');','self',false,'�Ŵ���ʾ Ctrl+-','image/zoomout.gif','0','0','0'));

mpmenu2=new mMenu('����ͼ����','','self','','','','');
mpmenu2.addItem(new mMenuItem('�½�[����]','javascript:mnuAddProc();','self',false,'�½�[����]','image/add_proc.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('�½�[·��]','javascript:mnuAddStep();','self',false,'�½�[·��]','image/add_step.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('����[����]','javascript:mnuCopyProc();','self',false,'����[����]','image/copy.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('�༭ѡ��...','javascript:mnuEditObj();','self',false,'�༭ѡ�еĶ���[���̻�·��]','image/edit_obj.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('ɾ��ѡ��...','javascript:mnuDelObj();','self',false,'ɾ��ѡ�еĶ���[���̻�·��]','image/del_obj.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem(null,null,null,true));
mpmenu2.addItem(new mMenuItem('��������','javascript:undoLog();','self',false,'�������һ�β��� Ctrl+Z','image/undo.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('�ָ�����','javascript:redoLog();','self',false,'�ָ����һ��ȡ���Ĳ��� Ctrl+Y/Ctrl+Shift+Z','image/redo.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('�Ƶ����','javascript:mnuSetZIndex(\'F\');','self',false,'��������ʾ��������һ��','image/front.gif','0','0','0'));
mpmenu2.addItem(new mMenuItem('�ƶ���ײ�','javascript:mnuSetZIndex(\'B\');','self',false,'��������ʾ�������һ��','image/back.gif','0','0','0'));

mpmenu3=new mMenu('����','','self','','','','');
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_toolbox">���ع�����</div>','javascript:mnuTurnToolbox();','self',false,'��ʾ/���ع�����','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_propbox">�������Կ�</div>','javascript:mnuTurnPropbox();','self',false,'��ʾ/�������Կ�','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_objview">���ض�����ͼ</div>','javascript:mnuTurnObjView();','self',false,'��ʾ/���ض�����ͼ','image/blank.gif','16','16','0'));
mpmenu3.addItem(new mMenuItem('<div style="position:absolute;height=10;" id="mnu_win_dataview">����������ͼ</div>','javascript:mnuTurnDataView();','self',false,'��ʾ/���ض�����ͼ','image/blank.gif','16','16','0'));

mpmenu4=new mMenu('ϵͳ','','self','','','','');
mpmenu4.addItem(new mMenuItem('ѡ��','javascript:mnuOption();','self',false,'ϵͳ����ѡ��','image/option.gif','0','0','0'));
mpmenu4.addItem(new mMenuItem('�ļ�����','javascript:mnuFileMgr();','self',false,'�ļ�����','image/blank.gif','16','16','0'));
mpmenu4.addItem(new mMenuItem('����TopFlow','javascript:mnuAbout();','self',false,'���ڱ����--TopFlow','image/blank.gif','16','16','0'));
mpmenu4.addItem(new mMenuItem(null,null,null,true));
mpmenu4.addItem(new mMenuItem('��ʾ','javascript:mnuDemo();','self',false,'�˳���ϵͳ','image/logo16.gif','0','0','0'));
mpmenu4.addItem(new mMenuItem('�˳�','javascript:mnuExit();','self',false,'�˳���ϵͳ','image/exit.gif','0','0','0'));
//mwritetodocument();
