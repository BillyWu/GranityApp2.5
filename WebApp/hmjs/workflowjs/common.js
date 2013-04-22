/*--------------------------------------------------|
| 本作品取得原作者授权修改自 support@tops.com.cn    |
| 的作品topflow                                     |
|                                                   |
| 常用平台级公共函数库(摘录)                        |
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

//检查页面Form表单的各项输入是否符合要求
function checkFormRule(frm){
  try{
    var oAll = frm.all;
    var oItem, s, r;
    for(i = 0; i<oAll.length; i++){
      oItem = oAll[i];
      s = oItem.tagName.toLowerCase(); 
      if(s == "input"||s == "select"){
        if("rule" in oItem){
          r = new RegExp(oItem.rule);
          if(!r.test(oItem.value)){
            alert(oItem.msg);
            oItem.focus();
            if(s == "input") oItem.select();
            return false;
          }
        }
      }
    }
    return true;
  }
  catch(e){
    alert(e);
    return false;
  }
}

//打开模式窗口
function vmlOpenWin(url,arg,w,h){
  return showModalDialog(url, arg, "dialogWidth:"+w+"px; dialogHeight:"+h+"px; status:0;help:no")
}

//字符串处理增强函数，去掉空格
String.prototype.trim = function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

//表格中的单元格合并函数
function mergecell(tb){
  var iRowCnt = tb.rows.length;
  if(iRowCnt <= 1) return;
	var iPreIndex=1;
	var sPreText=tb.rows(iPreIndex).cells(0).innerText;
	var sCurText="";
	for(var i=2;i<iRowCnt;i++){
		sCurText=tb.rows(i).cells(0).innerText;
		if(sCurText==sPreText){//需要合并
			tb.rows(iPreIndex).cells(0).rowSpan++;
			tb.rows(i).deleteCell(0);
		}
		else{
			iPreIndex=i;
			sPreText=sCurText;
		}
	}
}
