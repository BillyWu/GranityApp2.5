/*--------------------------------------------------|
| ����Ʒȡ��ԭ������Ȩ�޸��� support@tops.com.cn    |
| ����Ʒtopflow                                     |
|                                                   |
| ����ƽ̨������������(ժ¼)                        |
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

//���ҳ��Form���ĸ��������Ƿ����Ҫ��
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

//��ģʽ����
function vmlOpenWin(url,arg,w,h){
  return showModalDialog(url, arg, "dialogWidth:"+w+"px; dialogHeight:"+h+"px; status:0;help:no")
}

//�ַ���������ǿ������ȥ���ո�
String.prototype.trim = function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

//����еĵ�Ԫ��ϲ�����
function mergecell(tb){
  var iRowCnt = tb.rows.length;
  if(iRowCnt <= 1) return;
	var iPreIndex=1;
	var sPreText=tb.rows(iPreIndex).cells(0).innerText;
	var sCurText="";
	for(var i=2;i<iRowCnt;i++){
		sCurText=tb.rows(i).cells(0).innerText;
		if(sCurText==sPreText){//��Ҫ�ϲ�
			tb.rows(iPreIndex).cells(0).rowSpan++;
			tb.rows(i).deleteCell(0);
		}
		else{
			iPreIndex=i;
			sPreText=sCurText;
		}
	}
}
