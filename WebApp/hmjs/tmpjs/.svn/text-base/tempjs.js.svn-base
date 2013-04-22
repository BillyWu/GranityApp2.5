// JScript source code

//此文件函数是页面定制函数
//增量模式读取数据,从服务器内存取数据
//bandName加载数据段名称,unitNameMemory内存数据项单元(上传数据单元),dbItemMemory内存数据项(上传数据单元的数据项)
//rowcountmax最大行容量,行号循环编;dateInterval时间间隔差
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
        var dt=band.getFldStrValue("时间",band.RecordCount()-1);
    if(!dt)
        var dt=(new Date()).addDate(-1);
    else
        dt=ToolUtil.Convert(dt,"date");
    dt=dt.formate("YYYY-MM-dd HH:mm:ss");
    var strStation=ToolUtil.getParamValue(xmldoc,"站点名称","P","","Ts");
    if(!strStation || ""==strStation)
        strStation=band.getFldStrValue("站点名称",band.RecordCount()-1);
    ToolUtil.setParamValue(xmldoc, "时间", dt, "", "B", band.ItemName, "T", "M");
    ToolUtil.setParamValue(xmldoc, "站点名称", strStation, "", "B", band.ItemName, "T", "M");
    try
    {
        var xmlhttp=ToolUtil.SendPost(xmldoc);
    }catch(ex){
	    alert("系统出错:不能查询["+this.ItemName+"]项"+(ex?ex.message:''));
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
    var dtLast=ToolUtil.Convert(band.getFldStrValue("时间",icount-1),"date");
    for(;icount>1;icount--)
    {
        var dt=ToolUtil.Convert(band.getFldStrValue("时间",0),"date");
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
    banddest.setFldStrValue(null,"班组名称",bandsrc.getFldStrValue("名称"));
    banddest.setFldStrValue(null,"班组代码",bandsrc.getFldStrValue("编码"));  

}

function tsVerifyTime(id, type) 
{
    str = document.all(id).value;
    str = str.replace(/\s*/, "");
    str = str.replace(/\s*$/, "");
    document.all(id).value = str; //这几句只是用于将字符串首尾的空格去掉
    if (str.length == 0) return;
    switch (type) {
    case "hour":
    str = str.match(/^(?:0?[0-9]|1[0-9]|2[0-4])$/);
    if (str == null) alert("小时格式不正确");
    return;
    case "minute":
    str = str.match(/^[0-5]?[0-9]$/);
    if (str == null) alert("分钟格式不正确");
    return;
    default:
        alert("类型不正确");
        return;
    }
}

//参数dt:日期时间字符串
//参数msg:控件描述
//参数fm:日期时间格式
//参数type:语种类型,如空:公元,1:min
function checkDateByMask(dt,msg,fm,type){

//1.定义特殊的格式
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

//2.定义错误提示
var errPar=msg+"参数有误";
var errFormat=msg+"请按如下格式输入:\n"+fm;
var errYear=msg+"年份不对";
var errMonth=msg+"月份不对";
var errDay=msg+"日期不对";
var errHour=msg+"小时不对";
var errMinute=msg+"分钟不对";
var errSecond=msg+"秒钟不对";

   
//3.判断参数是否正确
var b=false;
for(var i=0;i<N;i++){
     if(format[i].toLowerCase()==fm.toLowerCase()){
            b=true;break;
     }
}
if(!b){
     return getErrorMsg(errPar);
}

//4.补足位数
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
//5.判断时间字符串与格式参数是否相符
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
         
//5.判断日期时间是否正确
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

//用于对包括时间的日期过渡处理
function _mfilter(itemname)
{
	var sdt = document.getElementById("startdate").value;
	var edt = document.getElementById("enddate").value;
	
	var sh = document.getElementById("hours").value;
	var eh = document.getElementById("hours1").value;

	var sm = document.getElementById("minutes").value;
	var em = document.getElementById("minutes1").value;
	
	//日期都为空,不考虑日期和时间
	if(sdt=="" && edt=="")
	{
		ue_tfilter(itemname);
		return;
	}

	//日期都为空,不考虑日期和时间
	if(sdt=="" && edt!="")
	{
		alert("时间范围错误,请检查!");
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
			if(checkDateByMask(sdatetime ,"提示:","yyyy-MM-dd hh:mm:ss")!="true") return;
			if(checkDateByMask(edatetime ,"提示:","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}
		
		if(sh!="" && eh=="")
		{
			var sdatetime = sdt + " " + sh + ":" +sm+":00";
			var edatetime = edt + " 23:59:00";
			if(checkDateByMask(sdatetime ,"提示:","yyyy-MM-dd hh:mm:ss")!="true") return;
			document.getElementById("t0").value= sdatetime;
			document.getElementById("t1").value= edatetime; 
			ue_tfilter(itemname);
			return;
		}		

		if(sh=="" && eh!="")
		{
			var sdatetime = sdt + " 00:00:00";
			var edatetime = edt + " " + eh + ":" +em+":00";
			if(checkDateByMask(edatetime ,"提示:","yyyy-MM-dd hh:mm:ss")!="true") return;
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