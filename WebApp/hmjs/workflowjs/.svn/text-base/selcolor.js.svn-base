/*--------------------------------------------------|
| 本作品取得原作者授权修改自 support@tops.com.cn    |
| 的作品topflow                                     |
|                                                   |
| 标准颜色选择控件，用于与文本控件结合直观选择颜色  |
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

//颜色选择器主要类
function ColorSelector(){
  this.toString = function(){
    var S = '<table cellspacing="0" cellpadding="0" border="1" bordercolor="black" ' +
      'style="border-Collapse:collapse;position:absolute;display:none;z-index:60000;border-left:1 solid gray;border-top:1 solid gray" id="colortab" ' + 
      'onmouseover="cl_MouseOver(this);" onmouseup="cl_MouseUP(this);">';
    S += addtd();
    S += '<tr><td id=colorshow colspan=8 align=center></td><td id=colorshow colspan=9>#000000</td>' +
      '<td id=colorshow colspan=9 align=center bgcolor="navy" style="color:white;cursor:hand" onclick="hideColorSel();">取消</td></tr>' +
      '</table>';
    return S;
  }
}

//隐藏选择器
function hideColorSel(){
  colortab.style.display="none";
}

//在指定文本输入框上显示颜色选择器
function showColorSel(ACtrl){  //颜色选择
  if(event.button==2)
    return false;
	colortab.style.top=window.event.clientY+document.body.scrollTop;
	colortab.style.left=window.event.clientX+document.body.scrollLeft;

  var ttemp1=eval(ACtrl).value;
  colorshow[0].bgColor=ttemp1;
  colorshow[1].style.color=ttemp1;
  colorshow[1].innerText=ttemp1
  colortab.theobjis=ACtrl;
	colortab.style.display="block";
}

//当鼠标在颜色选择器上移动时，动态显示当前鼠标所在的颜色值
function cl_MouseOver(cl){
  if(event.srcElement.id==''){
    var ttemp1=event.srcElement.bgColor;
    colorshow[0].bgColor=ttemp1;
    colorshow[1].style.color=ttemp1;
    colorshow[1].innerText=ttemp1
  }
}

//当在颜色选择器上单击时，判断是否要取值，并隐藏选择器
function cl_MouseUP(cl){
  if(event.srcElement.id==''){
    if(event.button==1){
      eval(cl.theobjis).value=event.srcElement.bgColor;
      eval(cl.theobjis).style.backgroundColor=event.srcElement.bgColor;
    }
    hideColorSel();
  }
}

//生成颜色选择器上的各种颜色
function addtd(theobjis){
  var temptd1=[],temptr1=[]
  for(r=0;r<10;r++){
    for(i=0;i<25;i++){
      var tmcor1=Math.round(Math.random()*255).toString(16)+Math.round(Math.random()*255).toString(16)+Math.round(Math.random()*255).toString(16);
      while(tmcor1.length<6){
        tmcor1+=Math.round(Math.random()*9);
      }
      temptd1[i]="<td style=width:6;height:6; bgcolor="+tmcor1+"></td>";
    }
    temptr1[r]="<tr>"+temptd1.join("")+"</tr>"
    temptd1.slice(1,temptd1.length);
  }
  return temptr1.join("");
}
cl_Selector = new ColorSelector();
document.write(cl_Selector);