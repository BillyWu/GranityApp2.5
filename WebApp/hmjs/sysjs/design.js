
var IsDesignChanged=false
var IsDraging=false //�ж��Ƿ����϶�״̬��
var xMouseBefMove, yMouseBefMove //�ƶ�Ԫ��ǰ�����X��Y����
var currentSelMainElement //��ǰѡ�е���Ԫ�أ���һ��ѡ�е�Ԫ�أ�
var currentDot //��ǰ���ƶ�(���ı���ѡ��Ԫ�ؿ��ȸ߶�)�Ķ�λ��
var saveSign //�������ͣ�save, saveas
var arrElments = new Array() //�������д�ѡ��Ԫ�أ��ڶ�����ʼѡ�е�Ԫ�أ�
var arrDots = new Array() //�������д�ѡ��Ԫ�صĶ�λ��

var g_pointSelTimes = 0; //��ѡ�ؼ�ʱ�жϵڼ��ε��
var g_pointStartX = 0; //��ѡ�ؼ������
var g_pointStartY = 0; //��ѡ�ؼ������
var g_pointEndX = 0; //��ѡ�ؼ����յ�
var g_pointEndY = 0; //��ѡ�ؼ����յ�

document.onmousedown=EvtMouseDown //������������¼����
document.onmouseup=EvtMouseUp //�������ſ����¼����
document.onkeydown=EvtKeyDown //������̵�����¼����
document.onmouseover=EvtMouseOver //��������������¼����

//����Ԫ��
function AddElement(){
try{
IsDesignChanged=true
//��ȡѡ����ֶ�
var selIndex = document.all.item("ListBox1").selectedIndex;
if (selIndex == -1){
alert("��ѡ����ʵ��ֶΣ�");
return;
}
var ctlDispName = document.all.item("ListBox1").options(selIndex).text;
var valType = GetCtrlValType(document.all.item("ListBox1").options(selIndex).value)
var ctlName = GetCtrlName(document.all.item("ListBox1").options(selIndex).value)

//����TextԪ��
var blnCreateLabel = 1;
if (valType == "1"){ //ѡ����
var ctlText1 = document.createElement("<SELECT ctrltype='ddlist' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'> <OPTION selected></OPTION></SELECT>");
panelForm.appendChild(ctlText1);
}else if (valType == "101"){ //�����봰������еĶ�ý����
//�����ļ��ϴ��ؼ�Ԫ��
var ctlFile1 = document.createElement("<INPUT ctrltype='image' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' type='file' dragSign='fileElement' disabled>");
panelForm.appendChild(ctlFile1);
}else if (valType == "102"){ //�Ǵ�ӡ��������еĶ�ý����
var ctlimg1 = document.createElement("<img ctrltype='image' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='ͼƬ'>");
panelForm.appendChild(ctlimg1);
}else if (valType == "100"){ //�Ǵ�ӡ��������е�����Ԫ����ʾΪLabel
var ctlLabel1 = document.createElement("<label ctrltype='TextboxInPrint' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' value='[" + ctlDispName + "]'></label>");
ctlLabel1.innerText = "[" + ctlDispName + "]";
panelForm.appendChild(ctlLabel1);
}else if (valType == "11"){ //��ѡһѡ����
var ctlText1 = document.createElement("<input ctrltype='radio' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' value='[" + ctlDispName + "]' readonly>");
panelForm.appendChild(ctlText1);
blnCreateLabel = 0; //����ʾLabel
}else if (valType == "13"){ //Ŀ¼�ļ�
var ctlFile1 = document.createElement("<INPUT ctrltype='fileForDirFile' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' type='file' dragSign='fileElement' disabled>");
panelForm.appendChild(ctlFile1);
}else if (valType == "12"){ //�Ƿ�ѡ����
var ctlText1 = document.createElement("<input ctrltype='checkgrp' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' type='checkbox' disabled value='[" + ctlDispName + "]'>");
panelForm.appendChild(ctlText1);
blnCreateLabel = 0; //����ʾLabel
}else{ //if (valType == "0"){ //��������
var ctlText1 = document.createElement("<input ctrltype='text' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' value='[" + ctlDispName + "]' readonly>");
panelForm.appendChild(ctlText1);
}

//����LabelԪ��
if (blnCreateLabel==1){
//var lblName = "lbl" + ctlName;
var lblName = "lbl_" + Math.round(Math.random() * 10000000000); // + "_" + ctlName;
var strAlign = "right";
if (self.document.forms(0).formtype.value == 1){
strAlign = "left";
}
var ctlLabel1 = document.createElement("<label ctrltype='label' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'></label>");
ctlLabel1.innerText = ctlDispName;
panelForm.appendChild(ctlLabel1);
}
}catch(ex){
}
}

//��ȡ����������Ԫ�صĲ�����Ϣ
function GetDFormLayout(){
//��ȡ���屾��������Ϣ
var ctlInfo = ";;" + "1||" + "FORM_CONTAINER" + "||0||||" + panelForm.style.left + "||" + panelForm.style.top + "||" + panelForm.style.pixelWidth + "||" + panelForm.style.pixelHeight + "||||;;";

//��ȡ����������Ԫ�صĲ�����Ϣ
for (var i = 0; i < panelForm.all.length; i++){
var ctlItem = panelForm.all.item(i);
var intHeight = ctlItem.style.pixelHeight;
if (ctlItem.style.display != "none" && ctlItem.name != null){ //���������ص�Ԫ��
if (ctlItem.ctrltype == "label"){
//2: ��ʾ�Ǳ�ǩLabel
ctlInfo = ctlInfo + "2||" + ctlItem.name + "||0||" + ctlItem.innerText + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||;;";
}
else if (ctlItem.ctrltype == "TextboxInPrint"){
//14: ����Ԫ���ڴ�ӡ�����ж���ʾΪLabel
ctlInfo = ctlInfo + "14||" + ctlItem.name + "||0||" + ctlItem.innerText + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||;;";
}
else if (ctlItem.ctrltype == "text"){
//3: ��ʾ��������Ԫ�أ���Text��
var ctlName = ctlItem.value
ctlInfo = ctlInfo + "3||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlName + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||" + ctlItem.ctrlbitian + "||;;";
}else if (ctlItem.ctrltype == "image"){
//4: ��ʾ��Imageͼ�οؼ�
ctlInfo = ctlInfo + "4||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "pageimg"){
//13: ��ʾ��ҳ���ϵ�ͼ���ļ�
ctlInfo = ctlInfo + "13||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
//}else if (ctlItem.ctrltype == "imagefile"){
////4: ��ʾ��Imageͼ�οؼ�
//ctlInfo = ctlInfo + "4||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "imageForBinCol"){
//15: �������ֶ���ͼƬ��ʽ��ʾ
ctlInfo = ctlInfo + "15||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "fileForDirFile"){
//18: Ŀ¼�ļ����ļ��ؼ�
ctlInfo = ctlInfo + "18||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "imageForDirFile"){
//17: Ŀ¼�ļ���ͼƬ��ʾ
ctlInfo = ctlInfo + "17||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "imageForUrlCol"){
//16: �������ֶ���ͼƬ��ʽ��ʾ
ctlInfo = ctlInfo + "16||" + ctlItem.name + "||0||" + ctlItem.src + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "file"){
//5: ��ʾ��File�ؼ����ļ��ϴ��ؼ�
ctlInfo = ctlInfo + "5||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlItem.value + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||||" + "||||;;";
}else if (ctlItem.ctrltype == "ddlist"){
//6: ��ʾ��DropDownList
var ctlName = ctlItem.value
ctlInfo = ctlInfo + "6||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlName + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||" + ctlItem.ctrlbitian + "||;;";
}else if (ctlItem.ctrltype == "line"){
//7: ��ʾ��Line�ؼ�
ctlInfo = ctlInfo + "7||" + ctlItem.name + "||0||" + "����" + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "ResTable"){
//8: ��ʾ����Դ�����ؼ�
ctlInfo = ctlInfo + "8||" + ctlItem.name + "||0||" + ctlItem.tabresid + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||||;;";
}else if (ctlItem.ctrltype == "cmsbtn"){
//9: ��ʾ����ͨ��ť
ctlInfo = ctlInfo + "9||" + ctlItem.name + "||0||" + ctlItem.value + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||" + ctlItem.ctrlscript + "||;;";
}else if (ctlItem.ctrltype == "linkbtn"){
//10: ��ʾ����ͨ����
if (ctlItem.innerText != ""){
ctlInfo = ctlInfo + "10||" + ctlItem.name + "||0||" + ctlItem.innerText + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||" + ctlItem.ctrlscript + "||;;";
}else{
ctlInfo = ctlInfo + "10||" + ctlItem.name + "||0||" + ctlItem.value + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + "||" + ctlItem.ctrlscript + "||;;";
}
}else if (ctlItem.ctrltype == "radio"){
//11: ��ʾ�Ƕ�ѡһѡ����
var ctlName = ctlItem.value
ctlInfo = ctlInfo + "11||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlName + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||" + ctlItem.ctrlbitian + "||;;";
}else if (ctlItem.ctrltype == "checkgrp"){
//12: ��ʾ���Ƿ�ѡ����
var ctlName = ctlItem.value
ctlInfo = ctlInfo + "12||" + ctlItem.name + "||" + ctlItem.ctrlreadonly + "||" + ctlName + "||" + ctlItem.style.left + "||" + ctlItem.style.top + "||" + ctlItem.style.pixelWidth + "||" + intHeight + "||" + ctlItem.style.textAlign + "||||";
ctlInfo = ctlInfo + ctlItem.style.fontFamily + "||" + ctlItem.style.fontSize + "||" + ctlItem.style.color + "||" + ctlItem.style.fontWeight + "||" + ctlItem.style.fontStyle + "||" + ctlItem.style.textDecoration + "||" + ctlItem.ctrlbitian + "||;;";
}else{
//δ֪Ԫ��
}
}
}

return ctlInfo;
}

//�����ֶ�ֵ����
function GetCtrlValType(optValue){
var strTemp = new String(optValue);
var pos = strTemp.indexOf ("]", 0) 
return strTemp.substring(1, pos)
}

//�����ֶ�����
function GetCtrlName(optValue){
var strTemp = new String(optValue);
var pos = strTemp.indexOf ("]", 0);
var curResID;
var relRes = document.all.item("ddlHostTables")
if (relRes == null){
curResID = getUrlParam("mnuresid");
}else{
curResID = relRes.options(relRes.selectedIndex).value;
if(curResID == ""){
relRes = document.all.item("ddlSubTables")
curResID = relRes.options(relRes.selectedIndex).value;
}else{
}
}
return "TAB" + curResID + "___" + strTemp.substring(pos+1);
}

function DoNothing(){
return false;
}

//Ԫ��ˮƽ����
function AlignHorizontal(){
IsDesignChanged=true
try{
//�ȼ�����Ҫ����ĸ߶�λ�ã������һ��ѡ��Ŀؼ���Label����߶�-4����ΪLabel��Textbox��4������
var posTop;
if (currentSelMainElement.ctrltype == "label"){
posTop = parseInt(currentSelMainElement.style.pixelTop) - 4;
}else if (currentSelMainElement.ctrltype == "text"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "image"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "pageimg"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "imageForBinCol"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "imageForDirFile"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "imageForUrlCol"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "fileForDirFile"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
//}else if (currentSelMainElement.ctrltype == "imagefile"){
//posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "file"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "ddlist"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "TextboxInPrint"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "radio"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "checkgrp"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "ResTable"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "line"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "cmsbtn"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}else if (currentSelMainElement.ctrltype == "linkbtn"){
posTop = parseInt(currentSelMainElement.style.pixelTop);
}

//����ָ�����͵Ŀؼ�
for (var i=0; i<arrElments.length; i++){
if (arrElments[i].ctrltype == "label"){
arrElments[i].style.pixelTop=posTop + 4;
}else if (arrElments[i].ctrltype == "text"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "image"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "pageimg"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "imageForBinCol"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "imageForDirFile"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "imageForUrlCol"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "fileForDirFile"){
arrElments[i].style.pixelTop=posTop;
//}else if (arrElments[i].ctrltype == "imagefile"){
//arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "file"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "ddlist"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "TextboxInPrint"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "radio"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "checkgrp"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "ResTable"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "line"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "cmsbtn"){
arrElments[i].style.pixelTop=posTop;
}else if (arrElments[i].ctrltype == "linkbtn"){
arrElments[i].style.pixelTop=posTop;
}
}
}catch(ex){
}

/* 
�������ѡ��Ԫ����صĲ���
�����Ľ������������ѡ��Ԫ����صĲ�����������Ҫͬʱ�ƶ����ж�λ�㣬�Ա����û�������һ���ƶ�����
*/
//Hide4Dots(); //������Ԫ�ص�4����λ��
//DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
//ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}

//Ԫ�������
function AlignLeft(){
IsDesignChanged=true
try{
var pos = parseInt(currentSelMainElement.style.pixelLeft);
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelLeft=pos;
}
}catch(ex){
}

/* 
�������ѡ��Ԫ����صĲ���
�����Ľ������������ѡ��Ԫ����صĲ�����������Ҫͬʱ�ƶ����ж�λ�㣬�Ա����û�������һ���ƶ�����
*/
//Hide4Dots(); //������Ԫ�ص�4����λ��
//DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
//ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}

//Ԫ���Ҷ���
function AlignRight(){
IsDesignChanged=true
try{
var pos = parseInt(currentSelMainElement.style.pixelLeft) + parseInt(currentSelMainElement.style.pixelWidth);
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelLeft=pos - parseInt(arrElments[i].style.pixelWidth)
}
}catch(ex){
}

/* 
�������ѡ��Ԫ����صĲ���
�����Ľ������������ѡ��Ԫ����صĲ�����������Ҫͬʱ�ƶ����ж�λ�㣬�Ա����û�������һ���ƶ�����
*/
//Hide4Dots(); //������Ԫ�ص�4����λ��
//DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
//ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}

//���ȶ���
function AlignWidth(){
IsDesignChanged=true
try{
var pos = parseInt(currentSelMainElement.style.pixelWidth);
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelWidth=pos;
}
}catch(ex){
}

/* 
�������ѡ��Ԫ����صĲ���
�����Ľ������������ѡ��Ԫ����صĲ�����������Ҫͬʱ�ƶ����ж�λ�㣬�Ա����û�������һ���ƶ�����
*/
//Hide4Dots(); //������Ԫ�ص�4����λ��
//DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
//ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}

//�߶ȶ���
function AlignHeight(){
IsDesignChanged=true
try{
var pos = parseInt(currentSelMainElement.style.pixelHeight);
if (pos<=0){
pos = 20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelHeight=pos;
}
}catch(ex){
}

/* 
�������ѡ��Ԫ����صĲ���
�����Ľ������������ѡ��Ԫ����صĲ�����������Ҫͬʱ�ƶ����ж�λ�㣬�Ա����û�������һ���ƶ�����
*/
//Hide4Dots(); //������Ԫ�ص�4����λ��
//DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
//ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}

//Ԫ���ڲ����������
function TextAlignLeft(){
IsDesignChanged=true
try{
if (currentSelMainElement != null){
currentSelMainElement.style.textAlign = "left"
}
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.textAlign = "left"
}
}catch(ex){
}
}

//Ԫ���ڲ������Ҷ���
function TextAlignRight(){
IsDesignChanged=true
try{
if (currentSelMainElement != null){
currentSelMainElement.style.textAlign = "right"
}
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.textAlign = "right"
}
}catch(ex){
}
}

//Ԫ���ڲ����־��ж���
function TextAlignCenter(){
IsDesignChanged=true
try{
if (currentSelMainElement != null){
currentSelMainElement.style.textAlign = "center"
}
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.textAlign = "center"
}
}catch(ex){
}
}

//���Over�¼����
function EvtMouseOver(){
try{
if (event.srcElement.dragSign=="frmElement"){
event.srcElement.style.cursor = "move"; //�������Ԫ����ʱ��ʾ������ƶ�����־
}
}catch(ex){
}
}

//���̻������¼���Ӧ���
function EvtKeyDown(){
try{
if (event.keyCode == 46){ //����Del��
IsDesignChanged=true
DeleteElement();
}
}catch(ex){
}
}

//�ſ������¼����
function EvtMouseUp(){
try{
if (IsDraging == false){
return;
}

IsDraging=false

//��λ��ѡ��Ԫ��
currentSelMainElement.xx = currentSelMainElement.style.pixelLeft
currentSelMainElement.yy = currentSelMainElement.style.pixelTop

//��λ��ѡ��Ԫ�ص�4����λ��
frmInputDesign.left_mid.xx = frmInputDesign.left_mid.style.pixelLeft
frmInputDesign.left_mid.yy = frmInputDesign.left_mid.style.pixelTop
frmInputDesign.middle_top.xx = frmInputDesign.middle_top.style.pixelLeft
frmInputDesign.middle_top.yy = frmInputDesign.middle_top.style.pixelTop
frmInputDesign.middle_bot.xx = frmInputDesign.middle_bot.style.pixelLeft
frmInputDesign.middle_bot.yy = frmInputDesign.middle_bot.style.pixelTop
frmInputDesign.right_mid.xx = frmInputDesign.right_mid.style.pixelLeft
frmInputDesign.right_mid.yy = frmInputDesign.right_mid.style.pixelTop

//��λ���д�ѡ��Ԫ��
for (var i=0; i < arrElments.length; i++){
arrElments[i].xx = arrElments[i].style.pixelLeft
arrElments[i].yy = arrElments[i].style.pixelTop
}

//��λ���д�ѡ��Ԫ�صĶ�λ��
for (var i=0; i < arrDots.length; i++){
arrDots[i].xx = arrDots[i].style.pixelLeft
arrDots[i].yy = arrDots[i].style.pixelTop
}

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
}catch(ex){
}
}

//���ӱ�ǩԪ��
function AddElementLabel(){
IsDesignChanged=true
var lblValue = window.prompt("�������ǩ��ʾ���ݣ�", "");
if (lblValue == null){
return; //�û�����ˡ�ȡ����
}

var ctlName = "lbl" + Math.round(Math.random() * 10000000000);
var ctlLabel1 = document.createElement("<label ctrltype='label' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' readonly></label>");
ctlLabel1.innerText = lblValue;
panelForm.appendChild(ctlLabel1);
return false;
}

//����"�ļ��ϴ��ؼ�"Ԫ��
function AddElementFile(){
IsDesignChanged=true;
var ctlName = "CmsFile" + Math.round(Math.random() * 10000000000);
var ctlFile1 = document.createElement("<INPUT ctrltype='file' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' type='file' dragSign='fileElement' disabled>");
panelForm.appendChild(ctlFile1);
return true;
}

function AddElementButton(){
IsDesignChanged=true
var btnValue = window.prompt("�����밴ť���ƣ�", "");
if (btnValue == null){
return; //�û�����ˡ�ȡ����
}

var ctlName = "cmsbtn" + Math.round(Math.random() * 10000000000);
var ctlBtn = document.createElement("<INPUT type=button value=" + btnValue + " ctrltype='cmsbtn' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' readonly>");
panelForm.appendChild(ctlBtn);
return false;
}

function AddElementLinkbtn(){
IsDesignChanged=true
var btnValue = window.prompt("�������������ƣ�", "");
if (btnValue == null){
return; //�û�����ˡ�ȡ����
}

var ctlName = "linkbtn" + Math.round(Math.random() * 10000000000);
var ctlBtn = document.createElement("<INPUT type=button value=" + btnValue + " ctrltype='linkbtn' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement' readonly>");
//var ctlBtn = document.createElement("<a>" + btnValue + "</a>");
panelForm.appendChild(ctlBtn);
return false;
}

function AddElementScript(){
IsDesignChanged=true;
try{
if (currentSelMainElement == null){
return false;
}

var rtnVal = window.showModalDialog("/cmsweb/cmsform/FormSetElementScript.ASPx?ctrlscript=" + currentSelMainElement.ctrlscript, "_blank", "dialogHeight:430px; dialogWidth:580px; center;yes");
var strRtn = new String(rtnVal);
currentSelMainElement.ctrlscript = strRtn;
//if (strRtn != ""){
//var pos1 = strRtn.indexOf("$PROPNAME", 0)
//var pos2 = strRtn.indexOf("$PROPVAL", 0)
//if (pos1 >= 0 && pos2 >= 0){
//var strPropName = strRtn.substring(pos1+10, pos2)
//var strPropValue = strRtn.substring(pos2+9)
//currentSelMainElement.ctrlscript = strPropValue;
//}
//}
}catch(ex){
alert("��ѡ����Ч�Ŀؼ���");
}
}

function SetFormProperty(){
//IsDesignChanged=true;
try{
//��ȡ��ǰ��ԴID
//window.showModalDialog("/cmsweb/cmsform/FormSetProperty.ASPx?mnuresid=" + document.frmInputDesign.formresid.value + "&urlformrecid=" + document.frmInputDesign.formrecid.value + "&timeid=" + Math.round(Math.random() * 10000000000), "_blank", "dialogHeight:500px; dialogWidth:480px; center;yes");
window.open("/cmsweb/cmsform/FormSetProperty.ASPx?mnuresid=" + document.frmInputDesign.formresid.value + "&urlformrecid=" + document.frmInputDesign.formrecid.value + "&timeid=" + Math.round(Math.random() * 10000000000), '_blank', "left=100,top=100,height=500,width=480,status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=no");
}catch(ex){
alert("����������");
}
}

//����Ԫ�أ�����
function AddElementLine(){
var ctlName = "line" + Math.round(Math.random() * 10000000000);
var ctlLabel1 = document.createElement("<img ctrltype='line' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='' src=''>");
panelForm.appendChild(ctlLabel1);
return false;
}

//����Ԫ�أ�ͼ��
function AddElementImage(){
IsDesignChanged=true
var lblValue = window.prompt("������ͼ�ε�WEB·������images/LOGO.gif����", "/cmsweb/images/?.gif");
if (lblValue == null){
return; //�û�����ˡ�ȡ����
}
if (lblValue == ""){
return; //û��ͼ��URL
}

var ctlName = "image_" + Math.round(Math.random() * 10000000000);
var ctlLabel1 = document.createElement("<img ctrltype='pageimg' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='" + lblValue + "' src='" + lblValue + "'>");
panelForm.appendChild(ctlLabel1);
return false;
}

//����Ԫ�أ���Դ����
function AddElementResTable(){
IsDesignChanged=true
var relRes = document.all.item("ddlSubTables")
if (relRes == null){
alert("��ǰ�汾��֧�ֶ����������ƣ�");
return false;
}
var curResName = relRes.options(relRes.selectedIndex).text;
var curResID = relRes.options(relRes.selectedIndex).value;
if(curResID == ""){
alert("��ѡ����Ч������Դ��");
return false;
}
var ctlName = "ResTable_" + curResID;
var lblValue = "��Դ������" + curResName;
var ctlLabel1 = document.createElement("<img ctrltype='ResTable' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' tabresid='" + curResID + "' dragSign='frmElement'alt='" + lblValue + "' src='" + lblValue + "'>");
panelForm.appendChild(ctlLabel1);
return false;
}

//ɾ������ѡ�е�Ԫ��
function DeleteElement(){
IsDesignChanged=true
try{
//ɾ����Ԫ��
panelForm.removeChild(currentSelMainElement);
currentSelMainElement.style.display = "none";
currentSelMainElement=null;

//ɾ�����д�Ԫ��
for (; arrElments.length>0; ){
try{
var oneElement = arrElments.shift();
panelForm.removeChild(oneElement);
oneElement.style.display = "none";
oneElement=null;
}catch(ex){
}
}

Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
}catch(ex){
alert("��ѡ����Ч�Ŀؼ���");
}
}

//���ñ�ǩ����
function SetLabelContent(){
IsDesignChanged=true
try{
if (currentSelMainElement.type = "undefined"){ //"undefined": ���Ա�ǩ����
var lblValue = window.prompt("�������ǩ��ʾ���ݣ�", currentSelMainElement.innerText);
if (lblValue != null){ //ֻ�е����ȷ�ϡ������ñ�ǩ����
currentSelMainElement.innerText = lblValue;
}
}
}catch(ex){
alert("��ѡ����Ч�ı�ǩ��");
}
}

//���������ֶ���ʾΪͼƬ
function AddImageFromBinColumn(){
try{
IsDesignChanged=true
//��ȡѡ����ֶ�
var selIndex = document.all.item("ListBox1").selectedIndex;
if (selIndex == -1){
alert("��ѡ����ʵ��ֶΣ�");
return;
}
var ctlDispName = document.all.item("ListBox1").options(selIndex).text;
var valType = GetCtrlValType(document.all.item("ListBox1").options(selIndex).value)
var ctlName = GetCtrlName(document.all.item("ListBox1").options(selIndex).value)
ctlName = "bincolimage_" + ctlName;

if (valType == "101" || valType == "102"){ //101�������봰������еĶ�ý���ͣ�102���Ǵ�ӡ��������еĶ�ý����
var ctlimg1 = document.createElement("<img ctrltype='imageForBinCol' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='ͼƬ'>");
panelForm.appendChild(ctlimg1);
}else{
alert('����ʧ�ܣ�ֻ�ж�ý���ֶο�����ΪͼƬ��ʽ����');
}
}catch(ex){
}
}

//����Ŀ¼�ļ���ͼƬ
function AddImageFromDirFileColumn(){
try{
IsDesignChanged=true
//��ȡѡ����ֶ�
var selIndex = document.all.item("ListBox1").selectedIndex;
if (selIndex == -1){
alert("��ѡ����ʵ��ֶΣ�");
return;
}
var ctlDispName = document.all.item("ListBox1").options(selIndex).text;
var ctlTip = "ͼƬ(" + ctlDispName + ")";
var valType = GetCtrlValType(document.all.item("ListBox1").options(selIndex).value)
var ctlName = GetCtrlName(document.all.item("ListBox1").options(selIndex).value)
ctlName = "dirfileimage_" + ctlName;

var ctlimg1 = document.createElement("<img ctrltype='imageForDirFile' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='" + ctlTip + "'>");
panelForm.appendChild(ctlimg1);
}catch(ex){
}
}

//�����Url���ֶ���ʾΪͼƬ
function AddImageFromUrlColumn(){
try{
IsDesignChanged=true
//��ȡѡ����ֶ�
var selIndex = document.all.item("ListBox1").selectedIndex;
if (selIndex == -1){
alert("��ѡ����ʵ��ֶΣ�");
return;
}
var ctlDispName = document.all.item("ListBox1").options(selIndex).text;
var valType = GetCtrlValType(document.all.item("ListBox1").options(selIndex).value)
var ctlName = GetCtrlName(document.all.item("ListBox1").options(selIndex).value)
ctlName = "urlcolimage_" + ctlName;

var ctlimg1 = document.createElement("<img ctrltype='imageForUrlCol' ctrlscript='' ctrlreadonly='0' ctrlbitian='0' dragSign='frmElement'alt='ͼƬ'>");
panelForm.appendChild(ctlimg1);
}catch(ex){
}
}

//����ָ���ֶ�Ϊֻ��
function SetCtrlReadonly(){
IsDesignChanged=true;
try{
if (currentSelMainElement.ctrltype == "text" || currentSelMainElement.ctrltype == "ddlist" || currentSelMainElement.ctrltype == "radio" || currentSelMainElement.ctrltype == "checkgrp"){
if (currentSelMainElement.ctrlreadonly == 0){
currentSelMainElement.ctrlreadonly = 1;
currentSelMainElement.style.color = "gray";
}else{
currentSelMainElement.ctrlreadonly = 0;
currentSelMainElement.style.color = "black";
}
}else{
alert("ֻ������ֻ���������Ч��");
}
}catch(ex){
}
}

//����ָ���ֶ�Ϊ������
function SetCtrlBitian(){
IsDesignChanged=true;
try{
if (currentSelMainElement.ctrltype == "text" || currentSelMainElement.ctrltype == "ddlist" || currentSelMainElement.ctrltype == "radio" || currentSelMainElement.ctrltype == "checkgrp"){
if (currentSelMainElement.ctrlbitian == 0){
currentSelMainElement.ctrlbitian = 1;
currentSelMainElement.style.backgroundColor = "red";
}else{
currentSelMainElement.ctrlbitian = 0;
currentSelMainElement.style.color = "black";
currentSelMainElement.style.backgroundColor = "";
}
}else{
alert("ֻ������ֻ���������Ч��");
}
}catch(ex){
}
}

//������������
function ApplyFontInfo(){
IsDesignChanged=true;
try{
if (currentSelMainElement.ctrltype == "label" || currentSelMainElement.ctrltype == "TextboxInPrint" || currentSelMainElement.ctrltype == "text" || currentSelMainElement.ctrltype == "ddlist" || currentSelMainElement.ctrltype == "radio" || currentSelMainElement.ctrltype == "checkgrp"){
//��������
var ddl = document.all.item("ddlFontName");
currentSelMainElement.style.fontFamily = ddl.options(ddl.selectedIndex).value;

//�����С
ddl = document.all.item("ddlFontSize");
currentSelMainElement.style.fontSize = ddl.options(ddl.selectedIndex).value;

//������ɫ
var strColor = frmInputDesign.txtColor.value;
if (strColor == ""){
var ddl = document.all.item("ddlFontColor");
strColor = ddl.options(ddl.selectedIndex).value;
}
currentSelMainElement.style.color = strColor;

//����
ddl = document.all.item("ddlFontBold");
currentSelMainElement.style.fontWeight = ddl.options(ddl.selectedIndex).value;

//б��
ddl = document.all.item("ddlFontItalic");
currentSelMainElement.style.fontStyle = ddl.options(ddl.selectedIndex).value;

//�ϡ��С��»���
ddl = document.all.item("ddlFontLine");
currentSelMainElement.style.textDecoration = ddl.options(ddl.selectedIndex).value;
}else{
alert("��������ֻ��Label��Textbox��DropDownList��Ч��");
}
}catch(ex){
}
}

//���Ӵ������
function FormWidthInc(){
IsDesignChanged=true
panelForm.style.pixelWidth = parseInt(panelForm.style.pixelWidth) + 10;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//���Ӵ������
function FormWidthInc2(){
IsDesignChanged=true
panelForm.style.pixelWidth = parseInt(panelForm.style.pixelWidth) + 100;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//��С�������
function FormWidthDec(){
IsDesignChanged=true
panelForm.style.pixelWidth = parseInt(panelForm.style.pixelWidth) - 10;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//��С�������
function FormWidthDec2(){
IsDesignChanged=true
panelForm.style.pixelWidth = parseInt(panelForm.style.pixelWidth) - 100;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//���Ӵ���߶�
function FormHeightInc(){
IsDesignChanged=true
panelForm.style.pixelHeight = parseInt(panelForm.style.pixelHeight) + 10;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//���Ӵ���߶�
function FormHeightInc2(){
IsDesignChanged=true
panelForm.style.pixelHeight = parseInt(panelForm.style.pixelHeight) + 100;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//��С����߶�
function FormHeightDec(){
IsDesignChanged=true
panelForm.style.pixelHeight = parseInt(panelForm.style.pixelHeight) - 10;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//��С����߶�
function FormHeightDec2(){
IsDesignChanged=true
panelForm.style.pixelHeight = parseInt(panelForm.style.pixelHeight) - 100;
//document.all.item("lblFormSize").innerText = "������ȣ�" + panelForm.style.pixelWidth + " �߶ȣ�" + panelForm.style.pixelHeight
return false;
}

//������Ԫ�ص�4����λ��
function Hide4Dots(){
try{
frmInputDesign.left_mid.style.display="none";
frmInputDesign.right_mid.style.display="none";
frmInputDesign.middle_top.style.display="none";
frmInputDesign.middle_bot.style.display="none";
}catch(ex){
}
}

/*
������������¼���ڣ�
�������Ԫ���ϣ���ʼ�ƶ�����
������ڡ���λ�㡱�ϣ���ʼ�ı�Ԫ�ظ߶ȿ��ȵĲ���
*/
function EvtMouseDown(){
if ((event.srcElement.dragSign=="frmElement")){
g_pointSelTimes = 0;

//��ʼ�ƶ�ѡ�е�Ԫ��
if (event.ctrlKey == true)
{ //CTRL�����������ѡ��Ԫ��
Show2DynamicDotsBeforeMove(event.srcElement);
IsDraging=false;
}else{
//�ȱ�����ѡ��Ŀؼ�ID
var oldSelElementID = "0";
try{
oldSelElementID = currentSelMainElement.id;
}catch(ex){
}

//�жϵ�ǰ���ѡ�еĿؼ��Ƿ��Ѿ��ڶ�ѡ�ؼ���
var blnIsInMultiSelCtrls = 0;
currentSelMainElement=event.srcElement;
if (currentSelMainElement.id == oldSelElementID){
blnIsInMultiSelCtrls=1;
}else{
for (var i=0; i<arrElments.length; i++){
if (arrElments[i].id == currentSelMainElement.id){
blnIsInMultiSelCtrls=1;
}
}
}

//���õ�ǰ��ѡ��Ԫ�ص�������Ϣ
SetElementFont();

//��ʼ�ƶ��ؼ�
if (blnIsInMultiSelCtrls==1){
//������Ѿ�ѡ�еĿؼ�
Show4DotsBeforeMove(event.srcElement); //currentSelMainElement);
IsDraging=true;
}else{
//������µĿؼ�������ȥ����������ѡ�еĿؼ�
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�

Show4DotsBeforeMove(event.srcElement); //currentSelMainElement);
IsDraging=true;
}
}

//����ѡ��Ԫ�����ƶ�ǰ��λ��
event.srcElement.xx = event.srcElement.style.pixelLeft 
event.srcElement.yy = event.srcElement.style.pixelTop
//����������ƶ�ǰ��λ��
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY

//��������ƶ����¼����
document.onmousemove=EvtMouseMove

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}

return false
}

if ((event.srcElement.dragSign=="fileElement")){
g_pointSelTimes = 0;

//��ʼ�ƶ�ѡ�е�Ԫ��
if (event.ctrlKey == true){ //CTRL�����������ѡ��Ԫ��
Show2DynamicDotsBeforeMove(event.srcElement);
IsDraging=false
}else{
//��ʼ�ƶ��ؼ�
currentSelMainElement=event.srcElement 
Show2DynamicDotsBeforeMove(event.srcElement);
IsDraging=true
}

//����ѡ��Ԫ�����ƶ�ǰ��λ��
event.srcElement.xx = event.srcElement.style.pixelLeft 
event.srcElement.yy = event.srcElement.style.pixelTop
//����������ƶ�ǰ��λ��
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY

//��������ƶ����¼����
document.onmousemove=EvtMouseMove
return false
}

if (event.srcElement.dragSign=="left_mid"){
g_pointSelTimes = 0;
IsDraging=true
currentDot=event.srcElement
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY
document.onmousemove=EvtMoveDotLeftMid
return
}

if (event.srcElement.dragSign=="right_mid"){
g_pointSelTimes = 0;
IsDraging=true
currentDot=event.srcElement
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY
document.onmousemove=EvtMoveDotRightMid
return
}

if (event.srcElement.dragSign=="middle_top"){
g_pointSelTimes = 0;
IsDraging=true
currentDot=event.srcElement
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY
document.onmousemove=EvtMoveDotMidTop
return
}

if (event.srcElement.dragSign=="middle_bot"){
g_pointSelTimes = 0;
IsDraging=true
currentDot=event.srcElement
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY
document.onmousemove=EvtMoveDotMidBot
return
}

if (event.srcElement.id == "panelForm"){
//g_pointSelTimes
//var g_pointStart = 0; //��ѡ�ؼ������
//var g_pointEnd = 0; //��ѡ�ؼ����յ�

if (event.altKey == true){ 
if (g_pointSelTimes == 0){
g_pointStartX=event.clientX - panelForm.style.pixelLeft;
g_pointStartY=event.clientY - panelForm.style.pixelTop;
g_pointSelTimes = g_pointSelTimes + 1;
}else{
//Ϊ���ù��������º�����ѡ��Ԫ�أ��������� parseInt(document.body.scrollTop)������������TOPλ��
//g_pointEndX=event.clientX - panelForm.style.pixelLeft;
//g_pointEndY=event.clientY - panelForm.style.pixelTop;
g_pointEndX=parseInt(event.clientX) - parseInt(panelForm.style.pixelLeft) + parseInt(document.body.scrollLeft);
g_pointEndY=parseInt(event.clientY) - parseInt(panelForm.style.pixelTop) + parseInt(document.body.scrollTop);

//ѡ��ָ�������ڵ����пؼ�
try{
//alert(g_pointStartX + " " + g_pointStartY + " " + g_pointEndX + " " + g_pointEndY);
var isFirst = 0;
for (var i=0; i<panelForm.childNodes.length; i++){
try{
if (panelForm.childNodes.item(i).ctrltype == "label" || panelForm.childNodes.item(i).ctrltype == "TextboxInPrint" || panelForm.childNodes.item(i).ctrltype == "text" || panelForm.childNodes.item(i).ctrltype == "ddlist" || panelForm.childNodes.item(i).ctrltype == "radio" || panelForm.childNodes.item(i).ctrltype == "fileForDirFile" || panelForm.childNodes.item(i).ctrltype == "checkgrp"){
//alert(panelForm.childNodes.item(i).id);
if (panelForm.childNodes.item(i).style.pixelLeft >= g_pointStartX && panelForm.childNodes.item(i).style.pixelLeft <= g_pointEndX && panelForm.childNodes.item(i).style.pixelTop >= g_pointStartY && panelForm.childNodes.item(i).style.pixelTop <= g_pointEndY){
//alert(panelForm.childNodes.item(i).id + " " + panelForm.childNodes.item(i).style.pixelLeft + "" + panelForm.childNodes.item(i).style.pixelTop);
if (isFirst == 0 && panelForm.childNodes.item(i).ctrltype == "text"){
currentSelMainElement = panelForm.childNodes.item(i);
Show4DotsBeforeMove(currentSelMainElement);
isFirst = 1;
}else{
Show2DynamicDotsBeforeMove(panelForm.childNodes.item(i));
}
}
}
}catch(ex){
}
}
}catch(ex){
alert(ex);
}

//����ѡ��Ԫ�����ƶ�ǰ��λ��
event.srcElement.xx = event.srcElement.style.pixelLeft 
event.srcElement.yy = event.srcElement.style.pixelTop
//����������ƶ�ǰ��λ��
xMouseBefMove=event.clientX
yMouseBefMove=event.clientY

//��������ƶ����¼����
document.onmousemove=EvtMouseMove
IsDraging=true;
return false
}
}else if (event.ctrlKey == true){ 
//CTRL�����������ѡ������Ԫ��
g_pointSelTimes = 0;
}else{
g_pointSelTimes = 0;

Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
ClearSelElementArray(); //�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�
}
}
}

//���õ�ǰ��ѡ��Ԫ�ص�������Ϣ
function SetElementFont(){
var sz = currentSelMainElement.style.fontFamily;
if (sz == ""){
sz = "����"; //Ĭ��ֵ
}
//document.all.item("ddlFontName").value = sz;

sz = new String(currentSelMainElement.style.fontSize);
if (sz == ""){
sz = 12; //Ĭ��ֵ
}else{
sz = sz.substring(0, sz.length - 2);
}
//document.all.item("ddlFontSize").value = sz;

sz = currentSelMainElement.style.color;
if (sz == ""){
//document.all.item("ddlFontColor").value = "black"; //Ĭ��ֵ
//frmInputDesign.txtColor.value = "";
}else if (sz == "black"){
//document.all.item("ddlFontColor").value = "black";
//frmInputDesign.txtColor.value = "";
}else if (sz == "red"){
//document.all.item("ddlFontColor").value = "red";
//frmInputDesign.txtColor.value = "";
}else if (sz == "green"){
//document.all.item("ddlFontColor").value = "green";
//frmInputDesign.txtColor.value = "";
}else if (sz == "blue"){
//document.all.item("ddlFontColor").value = "blue";
//frmInputDesign.txtColor.value = "";
}else if (sz == "gray"){
//document.all.item("ddlFontColor").value = "gray";
//frmInputDesign.txtColor.value = "";
}else{
//document.all.item("ddlFontColor").value = ""; //Ĭ��ֵ
//frmInputDesign.txtColor.value = sz;
}

sz = currentSelMainElement.style.fontWeight;
if (sz == ""){
sz = "normal";
}
//document.all.item("ddlFontBold").value = sz;

sz = currentSelMainElement.style.fontStyle;
if (sz == ""){
sz = "normal";
}
//document.all.item("ddlFontItalic").value = sz;

sz = currentSelMainElement.style.textDecoration;
if (sz == "none"){
sz = "";
}
//document.all.item("ddlFontLine").value = sz;
}

//����ƶ�ʱͬʱ�ƶ�ѡ�е�Ԫ��
function EvtMouseMove(){
try{
if (event.button==1 && IsDraging){
IsDesignChanged=true;

//��ȡ��������
var divLeft = parseInt(panelForm.style.pixelLeft);
//�����ȥ�����������λ�ã�����ؼ��޷������϶�
var divTop = parseInt(panelForm.style.pixelTop) - parseInt(document.body.scrollTop); 
var divWidth = parseInt(panelForm.style.pixelWidth);
var divHeight = parseInt(panelForm.style.pixelHeight);
if (divHeight <=0){
divHeight = 20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}

if (currentSelMainElement.dragSign == "fileElement"){
//�ƶ���ѡ��Ԫ��
currentSelMainElement.style.pixelLeft=currentSelMainElement.xx+event.clientX-xMouseBefMove
currentSelMainElement.style.pixelTop=currentSelMainElement.yy+event.clientY-yMouseBefMove

//�ƶ����д�Ԫ��
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelLeft=arrElments[i].xx+event.clientX-xMouseBefMove
arrElments[i].style.pixelTop=arrElments[i].yy+event.clientY-yMouseBefMove
}

//�ƶ����д�Ԫ�صĶ�λ��
for (var i=0; i<arrDots.length; i++){
arrDots[i].style.pixelLeft=arrDots[i].xx+event.clientX-xMouseBefMove
arrDots[i].style.pixelTop=arrDots[i].yy+event.clientY-yMouseBefMove
}

//��ʾ�����ƶ���Ԫ�ص�λ��
//document.all.item("lblStatus1").innerText = "x��" + currentSelMainElement.style.pixelLeft + " y��" + currentSelMainElement.style.pixelTop
return;
}
if (event.clientX >= divLeft && event.clientX <= (divLeft+divWidth) && event.clientY >= divTop && event.clientY <= (divTop + divHeight)){
//�ƶ���ѡ��Ԫ��
currentSelMainElement.style.pixelLeft=currentSelMainElement.xx+event.clientX-xMouseBefMove
currentSelMainElement.style.pixelTop=currentSelMainElement.yy+event.clientY-yMouseBefMove

//�ƶ���Ԫ�ص�4����λ��
Moving4DotPos()

//�ƶ����д�Ԫ��
for (var i=0; i<arrElments.length; i++){
arrElments[i].style.pixelLeft=arrElments[i].xx+event.clientX-xMouseBefMove
arrElments[i].style.pixelTop=arrElments[i].yy+event.clientY-yMouseBefMove
}

//�ƶ����д�Ԫ�صĶ�λ��
for (var i=0; i<arrDots.length; i++){
arrDots[i].style.pixelLeft=arrDots[i].xx+event.clientX-xMouseBefMove
arrDots[i].style.pixelTop=arrDots[i].yy+event.clientY-yMouseBefMove
}

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
var intTemp1 = currentSelMainElement.style.pixelHeight;
if (intTemp1 <=0){
intTemp1 = 20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + intTemp1 + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
return;
}
}
}catch(ex){
}
}

//��λ�����Mouse�ƶ�
function EvtMoveDotLeftMid(){
if (event.button==1 && IsDraging){
IsDesignChanged=true;

var selCtlWidth=parseInt(currentSelMainElement.style.pixelWidth)
var x2=currentSelMainElement.style.pixelLeft+selCtlWidth
if (event.clientX<(x2-6)){ 
currentDot.style.pixelLeft=currentDot.xx+event.clientX-xMouseBefMove
currentDot.style.pixelTop=currentDot.yy+event.clientY-yMouseBefMove
currentSelMainElement.style.pixelLeft=currentDot.xx+event.clientX-xMouseBefMove+5
currentSelMainElement.style.pixelWidth =x2-(currentSelMainElement.style.pixelLeft)
}
Moving4DotPos()

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
return false
}
}

//�Ҷ�λ�����Mouse�ƶ�
function EvtMoveDotRightMid(){
if (event.button==1 && IsDraging){
IsDesignChanged=true;

var x2=currentSelMainElement.style.pixelLeft
if (event.clientX>(x2+6)){ 
currentDot.style.pixelLeft=currentDot.xx+event.clientX-xMouseBefMove
currentDot.style.pixelTop=currentDot.yy+event.clientY-yMouseBefMove
currentSelMainElement.style.pixelWidth =(currentDot.style.pixelLeft)-x2
}
Moving4DotPos()

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
return false
}
}

//�϶�λ�����Mouse�ƶ�
function EvtMoveDotMidTop(){
if (event.button==1 && IsDraging){
IsDesignChanged=true;

var selCtlHeight=parseInt(currentSelMainElement.style.pixelHeight)
if (selCtlHeight<=0){
selCtlHeight=20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}
y2=currentSelMainElement.style.pixelTop+selCtlHeight
if (event.clientY<(y2-6)){ 
currentDot.style.pixelLeft=currentDot.xx+event.clientX-xMouseBefMove
currentDot.style.pixelTop=currentDot.yy+event.clientY-yMouseBefMove
currentSelMainElement.style.pixelTop=currentDot.yy+event.clientY-yMouseBefMove+5
currentSelMainElement.style.pixelHeight =y2-(currentSelMainElement.style.pixelTop)
}
Moving4DotPos()

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
return false
}
}

//�¶�λ�����Mouse�ƶ�
function EvtMoveDotMidBot(){
    if (event.button==1 && IsDraging){
    IsDesignChanged=true;
    if(!currentSelMainElement.style) return;
    y2=currentSelMainElement.style.pixelTop
    if (event.clientY>(y2+6))
    { 
        currentDot.style.pixelLeft=currentDot.xx+event.clientX-xMouseBefMove
        currentDot.style.pixelTop=currentDot.yy+event.clientY-yMouseBefMove
        currentSelMainElement.style.pixelHeight =(currentDot.style.pixelTop)-y2
    }
    Moving4DotPos()

//��ʾ��ǰѡ�е�Ԫ�ص�λ��
if (currentSelMainElement != null){
//document.all.item("lblStatus1").innerText = "Ԫ�ؿ�:" + currentSelMainElement.style.pixelWidth + " ��:" + currentSelMainElement.style.pixelHeight + " x:" + currentSelMainElement.style.pixelLeft + " y:" + currentSelMainElement.style.pixelTop
}
return false
}
}

//���ƶ��и�����Ԫ��4����λ�������
function Moving4DotPos(){
//��ȡԪ��X��Y����
var x1=currentSelMainElement.style.pixelLeft
var y1=currentSelMainElement.style.pixelTop 
//��ȡԪ�صĸ߶ȺͿ���
var selCtlWidth=parseInt(currentSelMainElement.style.pixelWidth )
var selCtlHeight=parseInt(currentSelMainElement.style.pixelHeight)
if (selCtlHeight<=0){
selCtlHeight=20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}

frmInputDesign.left_mid.style.pixelLeft=x1-5
frmInputDesign.left_mid.style.pixelTop=y1+selCtlHeight/2-3
frmInputDesign.left_mid.style.display=""

frmInputDesign.middle_top.style.pixelLeft=x1+selCtlWidth/2-3
frmInputDesign.middle_top.style.pixelTop=y1-5
frmInputDesign.middle_top.style.display=""

frmInputDesign.middle_bot.style.pixelLeft=x1+selCtlWidth/2-3
frmInputDesign.middle_bot.style.pixelTop=y1+selCtlHeight+1
frmInputDesign.middle_bot.style.display=""

frmInputDesign.right_mid.style.pixelLeft=x1+selCtlWidth
frmInputDesign.right_mid.style.pixelTop=y1+selCtlHeight/2-3
frmInputDesign.right_mid.style.display=""
}

//Ϊѡ�е���Ԫ����ʾ4����λ��
function Show4DotsBeforeMove(curElement){
//x1,y1�ǿؼ����Ͻǵ�����
var x1=curElement.style.pixelLeft
var y1=curElement.style.pixelTop 
//w,h�ǿؼ��ĸ߶ȺͿ���
var selCtlWidth=parseInt(curElement.style.pixelWidth)
var selCtlHeight=parseInt(curElement.style.pixelHeight)
if (selCtlHeight <=0){ 
selCtlHeight = 20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}

frmInputDesign.left_mid.style.pixelLeft=x1-5
frmInputDesign.left_mid.style.backgroundColor = 'red';
frmInputDesign.left_mid.style.borderColor = 'red';
frmInputDesign.left_mid.style.pixelTop=y1+selCtlHeight/2-3
frmInputDesign.left_mid.style.display=""
frmInputDesign.left_mid.xx = frmInputDesign.left_mid.style.pixelLeft
frmInputDesign.left_mid.yy = frmInputDesign.left_mid.style.pixelTop

frmInputDesign.middle_top.style.pixelLeft=x1+selCtlWidth/2-3
frmInputDesign.middle_top.style.pixelTop=y1-5
frmInputDesign.middle_top.style.display=""
frmInputDesign.middle_top.xx = frmInputDesign.middle_top.style.pixelLeft
frmInputDesign.middle_top.yy = frmInputDesign.middle_top.style.pixelTop

frmInputDesign.middle_bot.style.pixelLeft=x1+selCtlWidth/2-3
frmInputDesign.middle_bot.style.pixelTop=y1+selCtlHeight+1
frmInputDesign.middle_bot.style.display=""
frmInputDesign.middle_bot.xx = frmInputDesign.middle_bot.style.pixelLeft
frmInputDesign.middle_bot.yy = frmInputDesign.middle_bot.style.pixelTop

frmInputDesign.right_mid.style.pixelLeft=x1+selCtlWidth
frmInputDesign.right_mid.style.pixelTop=y1+selCtlHeight/2-3
frmInputDesign.right_mid.style.display=""
frmInputDesign.right_mid.xx = frmInputDesign.right_mid.style.pixelLeft
frmInputDesign.right_mid.yy = frmInputDesign.right_mid.style.pixelTop
}

//Ϊѡ�еĴ�Ԫ�����������в���2����λ��
function Show2DynamicDotsBeforeMove(curElement){
//------------------------------------------------------
//��̬���������м��2�㣬�Ա���ѡ��Ԫ������ʾ
var dotName = "left_mid" + Math.round(Math.random() * 10000000000);
var dotLeftMid = document.createElement("<img dragSign='left_mid' height='6' src='images/dot.jpg' width='6'>");
panelForm.appendChild(dotLeftMid);
arrDots.push(dotLeftMid);

dotName = "right_mid" + Math.round(Math.random() * 10000000000);
var dotRightMid = document.createElement("<img dragSign='right_mid' height='6' src='images/dot.jpg' width='6'>");
panelForm.appendChild(dotRightMid);
arrDots.push(dotRightMid);
//------------------------------------------------------

//------------------------------------------------------
//��ȡԪ������
//var lastSelElement = arrElments[arrElments.length - 1]
//var lastSelElement = event.srcElement
var x1=curElement.style.pixelLeft
var y1=curElement.style.pixelTop 
//��ȡԪ�صĸ߶ȺͿ���
var selCtlWidth=parseInt(curElement.style.pixelWidth)
var selCtlHeight=parseInt(curElement.style.pixelHeight )
if (selCtlHeight<=0){
selCtlHeight=20; //��ЩԪ���޷���ȡ�߶ȣ�Ĭ��Ϊ20pixel
}

event.srcElement.xx = curElement.style.pixelLeft
event.srcElement.yy = curElement.style.pixelTop
//arrElments.push(event.srcElement)
arrElments.push(curElement)
//------------------------------------------------------

//------------------------------------------------------
//��λ���㡱
dotLeftMid.style.pixelLeft=x1-5
dotLeftMid.style.pixelTop=y1+selCtlHeight/2-3
dotLeftMid.style.display=""
dotLeftMid.xx = dotLeftMid.style.pixelLeft
dotLeftMid.yy = dotLeftMid.style.pixelTop

dotRightMid.style.pixelLeft=x1+selCtlWidth
dotRightMid.style.pixelTop=y1+selCtlHeight/2-3
dotRightMid.style.display=""
dotRightMid.xx = dotRightMid.style.pixelLeft
dotRightMid.yy = dotRightMid.style.pixelTop
//------------------------------------------------------
}

//�Ƴ���̬������ʾ�Ķ�λ��
function DeleteDynamicAddedDots()
{
    try{
        for (var i=0; i<1000; i++){
            if (arrDots.length <= 0)
            {
                return;
            }

            //������ʹ�����ͬʱ�Ƴ����ж�λ��
            var oneDot = arrDots.shift();
            panelForm.removeChild(oneDot);
            oneDot.style.display="none";
            oneDot = null;
        }
    }catch(ex){}
}

//�Ƴ�����Ԫ�ص�ѡ����ʵ�Ǵ�ȫ���������Ƴ�������Ȼ��ʾ�ڴ�����
function ClearSelElementArray(){
    try
    {
        for (var i=0; i<1000; i++)
        {
            if (arrElments.length <= 0){return;}
            arrElments.shift();
        }
    }catch(ex){}
}

//�����Ի�����ʾ����ƵĴ����б���ѡ��
function OpenDesignedForm(){
var rtnVal = window.showModalDialog("/cmsweb/cmsform/FormOpen.ASPx?mnuresid=" + getUrlParam("mnuresid") + "&mnuformtype=" + getUrlParam("mnuformtype"), "", "dialogHeight:280px; dialogWidth:280px; center;yes"); 
var strRtn = new String(rtnVal);
if (strRtn.indexOf("$OPENFORM", 0) >= 0){
//��ָ��������ƴ���
var strFormName = strRtn.substring(10)
if (strFormName != ""){
document.frmInputDesign.postcmd.value = "open";
document.frmInputDesign.formname.value = strFormName;
document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.submit();
}
}else if (strRtn.indexOf("$NEWFORM", 0) >= 0){
//�½�ָ�����ƵĴ���
var strFormName = strRtn.substring(9)
if (strFormName != ""){
document.frmInputDesign.postcmd.value = "new";
document.frmInputDesign.formname.value = strFormName;
document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.submit();
}
}else if (strRtn.indexOf("$CANCEL", 0) >= 0){
//�����κβ������˳�
return;
}
}

//��������ύ��������Ԫ�صĲ�����Ϣ
function DFormSave(){
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
//alert(document.frmInputDesign.dfrminfo.value)
document.frmInputDesign.postcmd.value = "save";
IsDesignChanged = false;
document.frmInputDesign.submit();
}

//���洰�������Ϣ
function DFormSaveAs(){
var saveasFormName = window.prompt("���������洰����Ƶ����ƣ�", "");
if (saveasFormName == null){
return; //�û�����ˡ�ȡ����
}

Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.saveasname.value = saveasFormName;
document.frmInputDesign.postcmd.value = "saveas";
//IsDesignChanged = false;
document.frmInputDesign.submit();
}

//����Ϊ��ӡ����
function SaveASPrintForm(){
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.postcmd.value = "saveASPrint";
//IsDesignChanged = false;
document.frmInputDesign.submit();
}

function HideDots()
{
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��
}
//�˳����������Ƿ񱣴�
function DoExit(){
if (IsDesignChanged == false){ //�������δ�ı䣬�˳�������
document.frmInputDesign.postcmd.value = "exit";
self.document.forms(0).submit();
return;
}

var blnRtn = window.confirm("�˳�ǰ�Ƿ���Ҫ���浱ǰ������ƣ�");
if (blnRtn == true){ //����
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.saveasname.value = "";
document.frmInputDesign.postcmd.value = "exitsave";
}else{ //������
document.frmInputDesign.postcmd.value = "exit";
}

self.document.forms(0).submit();
}

//��ǰ��Դ����������Դ��ѡ�񱻸���
function HostRelResChanged(){
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.postcmd.value = "HostResChange";
self.document.forms(0).submit();
}

//��ǰ��Դ���ӹ�����Դ��ѡ�񱻸���
function SubRelResChanged(){
Hide4Dots(); //������Ԫ�ص�4����λ��
DeleteDynamicAddedDots(); //�Ƴ���̬������ʾ�Ķ�λ��

document.frmInputDesign.dfrminfo.value = GetDFormLayout();
document.frmInputDesign.postcmd.value = "SubResChange";
self.document.forms(0).submit();
}

//ɾ����ǰ��ƴ���
function DeleteDesignedForm(){
document.frmInputDesign.postcmd.value = "DeleteForm";
self.document.forms(0).submit();
}