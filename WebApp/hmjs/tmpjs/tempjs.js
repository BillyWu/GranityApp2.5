// JScript source code

//���ļ�������ҳ�涨�ƺ���
//����ģʽ��ȡ����,�ӷ������ڴ�ȡ����
//bandName�������ݶ�����,unitNameMemory�ڴ������Ԫ(�ϴ����ݵ�Ԫ),dbItemMemory�ڴ�������(�ϴ����ݵ�Ԫ��������)
//rowcountmax���������,�к�ѭ����;dateIntervalʱ������
function usQueryInc(bandName,unitNameMemory,dbItemMemeory,rowcountmax,dateInterval)
{
	if(!rowcountmax || "number"!=typeof(rowcountmax))
	    rowcountmax=60;
	if(!dateInterval || "number"!=typeof(dateInterval))
	    dateInterval=60;
	if(!unitNameMemory)    unitNameMemory=band.UnitItem.UnitName;
	if(!dbItemMemeory)     dbItemMemeory=band.DataItem;
	var band=document.UnitItem.getBandByItemName(bandName);
    var xmldoc=band.UnitItem.ParamXmldoc;
    band.BuildParamNotSelf();
    ToolUtil.setParamValue(xmldoc, "UnitName", unitNameMemory, "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "Command", "QueryIncSerialWatch", "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "DataItem", dbItemMemeory, "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "Where", band.XmlConfig.getAttribute("where"), "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "Sort", band.XmlConfig.getAttribute("sort"), "", "P", null, "T");
    if(band.RecordCount()>0)
        var dt=band.getFldStrValue("ʱ��",band.RecordCount()-1);
    if(!dt)
        var dt=(new Date()).addDate(-1);
    else
        dt=ToolUtil.Convert(dt,"date");
    dt=dt.formate("YYYY-MM-dd HH:mm:ss");
    var strStation=ToolUtil.getParamValue(xmldoc,"վ������","P","","Ts");
    if(!strStation || ""==strStation)
        strStation=band.getFldStrValue("վ������",band.RecordCount()-1);
    ToolUtil.setParamValue(xmldoc, "ʱ��", dt, "", "B", band.ItemName, "T", "M");
    ToolUtil.setParamValue(xmldoc, "վ������", strStation, "", "B", band.ItemName, "T", "M");
    try
    {
        var xmlhttp=ToolUtil.SendPost(xmldoc);
    }catch(ex){
	    alert("ϵͳ����:���ܲ�ѯ["+this.ItemName+"]��"+(ex?ex.message:''));
        return;
    }
    ToolUtil.resetParam(xmldoc);
    var rootBand=band.XmlLandData.XMLDocument.documentElement;
    if(xmlhttp.responseXML && xmlhttp.responseXML.xml)
    {
        var xmldoc=ToolUtil.XmlDocumentInst();
        xmldoc.loadXML(xmlhttp.responseXML.xml);
	    var index=ToolUtil.Convert(band.getFldStrValue("RowNum",band.RecordCount()-1),"number");
	    if(index>=rowcountmax)	    index=1;
	    var strBaseName="";
	    if(rootBand.hasChildNodes())
		    strBaseName=rootBand.firstChild.baseName;
	    if(""==strBaseName && band.XmldocFilter && band.XmldocFilter.documentElement.hasChildNodes() )
		    strBaseName=band.XmldocFilter.documentElement.firstChild.baseName;
	    if(""==strBaseName && band.XmlChanged.documentElement.hasChildNodes())
		    strBaseName=band.XmlChanged.documentElement.firstChild.baseName;
	    if(""==strBaseName)
		    strBaseName=band.DataItem;
        while(xmldoc.documentElement.hasChildNodes())
        {
	        var xnRow=rootBand.appendChild(rootBand.ownerDocument.createElement(strBaseName));
	        var xnRowSrc=xmldoc.documentElement.firstChild;
	        for(var i=xnRowSrc.childNodes.length-1;i>-1;i--)
	            xnRow.appendChild(xnRowSrc.childNodes[i]);
	        xnRow.selectSingleNode("RowNum").text=index++;
	        xnRowSrc.parentNode.removeChild(xnRowSrc);
	    }
        xmldoc.removeChild(xmldoc.documentElement);
	    ToolUtil.sleep(30);
	}
    var icount=band.RecordCount() - rowcountmax;
    for(var i=0;icount>i;i++)
    	rootBand.removeChild(rootBand.firstChild);
    var icount=band.RecordCount();
    var dtLast=ToolUtil.Convert(band.getFldStrValue("ʱ��",icount-1),"date");
    for(;icount>1;icount--)
    {
        var dt=ToolUtil.Convert(band.getFldStrValue("ʱ��",0),"date");
        var v=dtLast.diffDate(dt)*24*60;
        if(v>dateInterval)
            rootBand.removeChild(rootBand.firstChild);
        else
            break;
    }
	if(band.Grid)   band.Grid.Sum();
	else    band.Sum();
	var root=band.XmlSum.XMLDocument.documentElement;
	var xmlNodeRdCount=root.selectSingleNode("/*/*/RecordCount");
    xmlNodeRdCount.text=band.RecordCount();
}

function _openwin(pitem,item)
{    
    var band = document.UnitItem.getBandByItemName(pitem);
    if(!band) return;
    
    band.setModalContent(item);
}

function ts_showselect()
{    
    var obj = document.getElementById("winselect");
    if(!obj) return;
    obj.style.display="";
}

function ts_select(src,dest,usrc)
{
    var bandsrc  = document.UnitItem.getBandByItemName(src);
    var bandusrc = document.UnitItem.getBandByItemName(usrc);
    var banddest = document.UnitItem.getBandByItemName(dest);
    if(!bandsrc || !banddest || !bandusrc) return;
    banddest.NewRecord();
    banddest.setFldStrValue(null,"��������",bandsrc.getFldStrValue("����"));
    banddest.setFldStrValue(null,"�������",bandsrc.getFldStrValue("����"));  

}

function tsVerifyTime(id, type) 
{
    str = document.all(id).value;
    str = str.replace(/\s*/, "");
    str = str.replace(/\s*$/, "");
    document.all(id).value = str; //�⼸��ֻ�����ڽ��ַ�����β�Ŀո�ȥ��
    if (str.length == 0) return;
    switch (type) {
    case "hour":
    str = str.match(/^(?:0?[0-9]|1[0-9]|2[0-4])$/);
    if (str == null) alert("Сʱ��ʽ����ȷ");
    return;
    case "minute":
    str = str.match(/^[0-5]?[0-9]$/);
    if (str == null) alert("���Ӹ�ʽ����ȷ");
    return;
    default:
        alert("���Ͳ���ȷ");
        return;
    }
}

//����dt:����ʱ���ַ���
//����msg:�ؼ�����
//����fm:����ʱ���ʽ
//����type:��������,���:��Ԫ,1:min
function checkDateByMask(dt,msg,fm,type){

//1.��������ĸ�ʽ
var N=10;
var format=new Array(N);
format[0]="yyyy/MM/dd";
format[1]="yyyy-MM-dd";
format[2]="yy/MM/dd";
format[3]="yy-MM-dd";

format[4]="yyyy/MM/dd hh:mm:ss";
format[5]="yyyy-MM-dd hh:mm:ss";
format[6]="yy/MM/dd hh:mm:ss";
format[7]="yy-MM-dd hh:mm:ss";

format[8]="hh:mm:ss";
format[9]="hh:mm";

//2.���������ʾ
var errPar=msg+"��������";
var errFormat=msg+"�밴���¸�ʽ����:\n"+fm;
var errYear=msg+"��ݲ���";
var errMonth=msg+"�·ݲ���";
var errDay=msg+"���ڲ���";
var errHour=msg+"Сʱ����";
var errMinute=msg+"���Ӳ���";
var errSecond=msg+"���Ӳ���";

   
//3.�жϲ����Ƿ���ȷ
var b=false;
for(var i=0;i<N;i++){
     if(format[i].toLowerCase()==fm.toLowerCase()){
            b=true;break;
     }
}
if(!b){
     return getErrorMsg(errPar);
}

//4.����λ��
if(dt.length!=fm.length){
     var dt4=dt.replace(/[^0-9]/g,",")
     var dtarr=dt4.split(",");
     var dt3="";
     var dtlen=0;
     for(var i=0;i<dtarr.length;i++){
         var len=dtarr[i].length;
         dtlen=dtlen+len+1;
         if(len<1)
                dt3=dt3+"00"+dtarr[i];
         else if(len<2)
                dt3=dt3+"0"+dtarr[i];
         else
                dt3=dt3+dtarr[i];
                
         dt3=dt3+dt.substr(dtlen-1,1);
         }
     dt=dt3;
}
//5.�ж�ʱ���ַ������ʽ�����Ƿ����
if(dt.length!=fm.length){         
     return getErrorMsg(errFormat);
}
else{
     var dt1=dt.replace(/[0-9]/g,"%d");
     var dt2=fm.replace(/[ymdhs]/gi,"%d");
     //alert(dt1+"\n"+dt2);
     if(dt1!=dt2){
           return getErrorMsg(errFormat);
     }
}     
         
//5.�ж�����ʱ���Ƿ���ȷ
try{
     fm=fm.replace(/Y/g,"y").replace(/D/g,"d");
     var iyyyy=fm.indexOf("yyyy");
     var iyy=fm.indexOf("yy");
     var imm=fm.indexOf("MM");
     var idd=fm.indexOf("dd");
     var ihh=fm.indexOf("hh");
     var imi=fm.indexOf("mm");
     var iss=fm.indexOf("ss");
    
     var newdt=new Date(); 
     
     var year="";
     //Year    
     try{
         var isyear=false;
         if(iyyyy>-1){                
            year=dt.substr(iyyyy,4);
            isyear=true;
         }
         else if(iyy>-1){
            year=dt.substr(iyy,2);
            isyear=true;
         }
         if(isyear){
            if(type=="1"){//
               year=parseInt(year)+1911;
            }
            newdt.setFullYear(year);
         }   
     }
     catch(e1){
         return getErrorMsg(errYear+e1.toString());
     }
     
     //Month
     try{     
         if(imm>-1){
             if(dt.substr(imm,2)>"12"||dt.substr(imm,2)<"01"){
                 return getErrorMsg(errMonth);
             }
             newdt.setMonth(dt.substr(imm,2)-1);
         }
     }
     catch(e1){
         return getErrorMsg(errMonth+e1.toString());
     }
     
     //Day
     try{     
         if(idd>-1){
             if(dt.substr(idd,2)>"31"||dt.substr(idd,2)<"01"){
                 return getErrorMsg(errDay);
             }
             newdt.setDate(dt.substr(idd,2));  
         }
     }
     catch(e1){
         return getErrorMsg(errDay);
     }
     
     //Hour
     try{
         if(ihh>-1){
             if(dt.substr(ihh,2)>"23"){
                 return getErrorMsg(errHour);
             }
             newdt.setHours(dt.substr(ihh,2));
         }
     }
     catch(e1){
         return getErrorMsg(errHour);
     }
     
     //Minute
     try{
         if(imi>-1){
             if(dt.substr(imi,2)>"59"){
                 return getErrorMsg(errMinute);
             }
             newdt.setMinutes(dt.substr(imi,2));
         }
     }
     catch(e1){
         return getErrorMsg(errMinute);
     }
     
     //Second
     try{
         if(iss>-1){
             if(dt.substr(iss,2)>"59"){
                 return getErrorMsg(errSecond);
             }
             newdt.setSeconds(dt.substr(iss,2));
         }         
     }
     catch(e1){
         return getErrorMsg(errSecond);
     }
          
     //Year
     if(iyyyy>-1){
          if(newdt.getFullYear()!=year){
                 return getErrorMsg(errYear); 
          }
     }
     else if(iyy>-1){
          if(newdt.getFullYear()!=year){
                 return getErrorMsg(errYear); 
          }
     }
     
     //Month
     if(imm>-1){
          if(newdt.getMonth()!=(dt.substr(imm,2)-1)){
                 return getErrorMsg(errDay); 
          }
     }
     
     //Day       
     if(idd>-1){
          if(newdt.getDate()!=dt.substr(idd,2)){
                 return getErrorMsg(errDay); 
          } 
     }    
            

     //Hour
     if(ihh>-1){
          if(newdt.getHours()!=dt.substr(ihh,2)){
                 return getErrorMsg(errMinute); 
          } 
     }
     
     //Minute
     if(imi>-1){
          if(newdt.getMinutes()!=dt.substr(imi,2)){
                 return getErrorMsg(errSecond); 
          } 
     }
     
     //Second
     if(iss>-1){          
          if(newdt.getSeconds()!=dt.substr(iss,2)){
                 return getErrorMsg(errSecond); 
          }
     } 
     return "true"
}  
catch(e){
     return getErrorMsg(e.toString()); 
}

            
}

function getErrorMsg(msg){
     alert(msg);
     return false;
     }

function  isGyDate(obj,msg){
     if(!checkDateByMask(obj.value,msg,"yyyy/MM/dd",""))
         obj.focus();     
     }
function  isMgDate(obj,msg){
     if(!checkDateByMask(obj.value,msg,"yy/MM/dd","1"))
         obj.focus();     
     }
     
function  isGyDateTime(obj,msg){
     if(!checkDateByMask(obj.value,msg,"yyyy/MM/dd hh:mm:ss",""))
         obj.focus();     
     }
function  isMgDateTime(obj,msg){
     if(!checkDateByMask(obj.value,msg,"yy/MM/dd hh:mm:ss","1"))
         obj.focus();     
     }   
       
function  isTime(obj,msg){
     if(!checkDateByMask(obj.value,msg,"hh:mm:ss",""))
         obj.focus();     
     }
     
function checkDate(){
    return checkDateByMask(document.all.aa.value,"aa",document.all.formatStr.value,"");
}

//���ڶ԰���ʱ������ڹ��ɴ���
function _mfilter(itemname)
{
	var sdt = document.getElementById("startdate").value;
	var edt = document.getElementById("enddate").value;
	
	var sh = document.getElementById("hours").value;
	var eh = document.getElementById("hours1").value;

	var sm = document.getElementById("minutes").value;
	var em = document.getElementById("minutes1").value;
	
	//���ڶ�Ϊ��,���������ں�ʱ��
	if(sdt=="" && edt=="")
	{
		ue_tfilter(itemname);
		return;
	}

	//���ڶ�Ϊ��,���������ں�ʱ��
	if(sdt=="" && edt!="")
	{
		alert("ʱ�䷶Χ����,����!");
		return;
	}

	if(sdt!="" && edt=="")
	{
		if(sh=="" && eh=="")
		{
			document.getElementById("t0").value= sdt +" 00:00:00"
			document.getElementById("t1").value= sdt +" 23:59:00"
			ue_tfilter(itemname);
			return;
		}
		if(sh!="" && eh!="")
		{
			var sdatetime = sdt + " " + sh + ":" +sm+":00";
			var edatetime = sdt + " " + eh + ":" +em+":00";
			if(checkDateByMask(sdatetime ,"","yyyy-MM-dd hh:mm:ss")!="true") return;
			if(checkDateByMask(edatetime ,"","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}
	}
	
	if(sdt!="" && edt!="")
	{
		if(sh=="" && eh=="")
		{
			document.getElementById("t0").value= sdt +" 00:00:00"
			document.getElementById("t1").value= edt +" 23:59:00"
			ue_tfilter(itemname);
			return;
		}
		if(sh!="" && eh!="")
		{
			var sdatetime = sdt + " " + sh + ":" +sm+":00";
			var edatetime = edt + " " + eh + ":" +em+":00";
			if(checkDateByMask(sdatetime ,"��ʾ:","yyyy-MM-dd hh:mm:ss")!="true") return;
			if(checkDateByMask(edatetime ,"��ʾ:","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}
		
		if(sh!="" && eh=="")
		{
			var sdatetime = sdt + " " + sh + ":" +sm+":00";
			var edatetime = edt + " 23:59:00";
			if(checkDateByMask(sdatetime ,"��ʾ:","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}		

		if(sh=="" && eh!="")
		{
			var sdatetime = sdt + " 00:00:00";
			var edatetime = edt + " " + eh + ":" +em+":00";
			if(checkDateByMask(edatetime ,"��ʾ:","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}						
	}
}

function _myrefresh()
{
	var srcEle=event.srcElement;
	if(!srcEle) return;
	var tab=ToolUtil.getCtrlByTagU(false,srcEle,"TABLE");
	for(var m=0;m<tab.rows.length;m++)
		for(var i=0;i<tab.rows[m].cells.length;i++)
		{
		    var cell=tab.rows[m].cells[i];
		    var ctrl=ToolUtil.getCtrlByTagD(false,cell,"SELECT");
			if(ctrl==null)
				ctrl = ToolUtil.getCtrlByTagD(false,cell,"INPUT");
			if(ctrl!=null && ctrl.type!="button" && ctrl.type!="checkbox")
				ctrl.value="";
		}
}