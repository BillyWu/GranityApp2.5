var ToolUtil=new function()
{
	this.initialValue="";
	this.century=2000;
	this.cutOffYear=2029;
	this.dateorder="ymd";
	this.groupChar=",";
	this.decimalChar=".";
	this.digits=2;
	
	this.expQuot=new RegExp("'","ig");  //用\'替换单引号,使组成XPath表达式时有效
	this.expTrim=/^\s*(\S+(\s+\S+)*)\s*$/;
	this.expInteger=/^\s*[-\+]?\d+\s*$/;
	this.expDouble=new RegExp("^\\s*([-\\+])?(\\d+)?(\\" + this.decimalChar + "(\\d+))?\\s*$");
	this.expCurrency = new RegExp("^\\s*([-\\+])?(((\\d+)\\" + this.groupChar + ")*)(\\d+)"
            + ((this.digits > 0) ? "(\\" + this.decimalChar + "(\\d{1," + this.digits + "}))?" : "")
            + "\\s*$");
    this.expGroupChar=new RegExp("(\\" + this.groupchar + ")", "g");
	this.expDateYearFirst=new RegExp("^\\s*((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})\\s*$");
	this.expDateYearLast=new RegExp("^\\s*(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))\\s*$");
	this.expTime = "(\\d{1,2})\\:(\\d{1,2}):(\\d{1,2})\\.?(\\d*)";
	this.xmlHttpList=new Array();   //XMLHttp对象池
	this.xmlDocList=new Array();    //XMLDocument对象池
	
	this.ColorList=new Array("#FC0","#9ACD32","#F60","#4169E1","#8B4513","#9370DB","#B8860B","#7CFC00","#B22222","#DAA520","#F0E68C","#696969","#00FF00","#87CEFA","#8B008B","#FF0000","#2E8B57","#B8860B","#483D8B","#CD5C5C","#FFA500","#FF6347");
	this.ColorList2=new Array("#000080","#FF0000","#228B22","#000000","#FFFF00","#9ACD32" ,"#9370DB","#8B4513","#8B0000","#00FF00","#FFA500","#7CFC00");
}
function getpath(){    return " http://"+location.host+("/"+location.pathname).replace("//","/");}

function getXmlHttpObj()
{
    var request=null;
    try 
       { 
          request = new XMLHttpRequest(); 
       } 
       catch(e) 
       { 
             try 
             { 
                request = new ActiveXObject("Msxml2.XMLHTTP"); 
             } 
             catch (othermicrosoft) 
             { 
                  try 
                  { 
                    request = new ActiveXObject("Microsoft.XMLHTTP"); 
                    } 
             catch (failed) 
                    { 
                request = false; 
                    } 
             } 
       } 
       return request;
}
     function creatHttp() // 创建xmlhttprequest,ajax开始
     {
      
        if (window.ActiveXObject) //ie6
        { 
            return new ActiveXObject("Microsoft.XMLHTTP"); 
        }
      else if (window.XMLHttpRequest) //ie7以上版本
        { 
           return  new XMLHttpRequest(); 
        }
     }
//从XMLHttp对象池获取对象,减小客户端资源浪费
ToolUtil.XmlHttpInst=function(isCreateSingle)
{
    for(var i=0;!isCreateSingle && i<this.xmlHttpList.length;i++)
    {
        if( 0==this.xmlHttpList[i].readyState || 4==this.xmlHttpList[i].readyState)
            return this.xmlHttpList[i];
    }
    var xmlhttp=null;
    try
    {    
         xmlhttp= new XMLHttpRequest();
    }
    catch(e)
    {
        var arr_t = new Array("MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.2.6","MSXML2.XMLHTTP", "Microsoft.XMLHTTP", "MSXML.XMLHTTP");
        for (var i=0; i<arr_t.length; i++)
        {
            try
            {
                xmlhttp=new ActiveXObject(arr_t[i]);
                break;
            }catch(e){}
        }
    }
    // mozilla某些版本没有readyState属性 
    if (xmlhttp.readyState == null)
    {
      xmlhttp.readyState = 0; 
   
      xmlhttp.addEventListener("load", function () 
        { 
          xmlhttp.readyState = 4; 
   
          if (typeof(xmlhttp.onreadystatechange) == "function") 
            xmlhttp.onreadystatechange(); 
        }, false);
    }
    if(!isCreateSingle)
        this.xmlHttpList[this.xmlHttpList.length]=xmlhttp;
    return xmlhttp;
}
ToolUtil.XmlHttpConn=ToolUtil.XmlHttpInst(true);
//从对象池获取对象,减小客户端资源浪费
ToolUtil.XmlDocumentInst=function(isCreateSingle)
{
    for(var i=0;!isCreateSingle && i<this.xmlDocList.length;i++)
    {
        if( !this.xmlDocList[i].documentElement || !this.xmlDocList[i].documentElement.firstChild)
            return this.xmlDocList[i];
    }
    var xmldoc=new ActiveXObject("Msxml2.DOMDocument");
    if(!isCreateSingle)
        this.xmlDocList[this.xmlDocList.length]=xmldoc;
    return  xmldoc;
}

ToolUtil.getCtrlByTagD=function(isSelf,ctrl,tagName,attrName,attrValue)
{
	if(!ctrl)	return null;
	if(isSelf)
	{
		//没有属性名,就只根据标记找
		if(ctrl.tagName==tagName && !attrName )
			return ctrl;
		//有属性名,就要包含此属性,没有属性值就不用判断属性值是否相等
		var attrCtrl=null;
		if(ctrl.attributes)
		    var attrCtrl=ctrl.attributes.getNamedItem(attrName);
		if(ctrl.tagName==tagName && attrName && attrCtrl && null!=attrCtrl.value && "null"!=attrCtrl.value && !attrValue)
			return ctrl;
		//根据标记,属性,及属性值确定控件
		if(ctrl.tagName==tagName && attrName && attrCtrl && 
			attrValue && attrCtrl.value==attrValue)
			return ctrl;
	}	
	for(var i=0;i<ctrl.children.length;i++)
	{
		var childCtrl=ToolUtil.getCtrlByTagD(true,ctrl.children[i],tagName,attrName,attrValue);
		if(childCtrl)	return childCtrl;
	}
	return null;
}
//向父级寻找控件,依据标记和属性,没有属性就只根据标记
ToolUtil.getCtrlByTagU=function(isSelf,ctrl,tagName,attrName,attrValue)
{
	if(!ctrl)	return null;
	if(isSelf)
	{
		//没有属性名,就只根据标记找
		if(ctrl.tagName==tagName && !attrName )
			return ctrl;
		//有属性名,就要包含此属性,没有属性值就不用判断属性值是否相等
		var attrCtrl=null;
		if(ctrl.attributes)
		    var attrCtrl=ctrl.attributes.getNamedItem(attrName);
		if(ctrl.tagName==tagName && attrName && attrCtrl && null!=attrCtrl.value && "null"!=attrCtrl.value && !attrValue )
			return ctrl;
		//根据标记,属性,及属性值确定控件
		if(ctrl.tagName==tagName && attrName && attrCtrl && attrValue && attrCtrl.value==attrValue)
			return ctrl;
	}
	if(ctrl.parentElement && ctrl!=ctrl.parentElement)
		return ToolUtil.getCtrlByTagU(true,ctrl.parentElement,tagName,attrName,attrValue);
	else
		return null;
}

//根据控件属性名称得到需要赋值的控件
ToolUtil.getCtrlByNameD=function(isSelf,ctrlContain,attrName,attrValue)
{
	if(!ctrlContain)	return null;
	if(isSelf)
	{
		//没有属性值,就只根据属性找
		var attrCtrl=null;
		if(ctrlContain.attributes)
		    var attrCtrl=ctrlContain.attributes.getNamedItem(attrName);
		if(attrCtrl && !attrValue  && null!=attrCtrl.value && "null"!=attrCtrl.value)
			return ctrlContain;
		//根据属性,及属性值确定控件
		if(attrCtrl && attrCtrl.value==attrValue)
			return ctrlContain;
	}
	for(var i=0;i<ctrlContain.children.length;i++)
	{
		var ctrlChild=ToolUtil.getCtrlByNameD(true,ctrlContain.children[i],attrName,attrValue);
		if(ctrlChild)	return ctrlChild;
	}
	return null;
}

//根据控件属性名称得到需要赋值的控件
ToolUtil.getCtrlByNameU=function(isSelf,ctrlContain,attrName,attrValue)
{
	if(!ctrlContain)	return null;
	if(isSelf)
	{
		//没有属性值,就只根据属性找
		var attrCtrl=null;
		if(ctrlContain.attributes)
		    var attrCtrl=ctrlContain.attributes.getNamedItem(attrName);
		if(attrCtrl && !attrValue  && null!=attrCtrl.value && "null"!=attrCtrl.value)
			return ctrlContain;
		//根据属性,及属性值确定控件
		if(attrCtrl && attrCtrl.value==attrValue)
			return ctrlContain;
	}
	if(ctrlContain.parentElement && ctrlContain!=ctrlContain.parentElement)
		return ToolUtil.getCtrlByNameU(true,ctrlContain.parentElement,attrName,attrValue);
	else
		return null;
}

//根据控件属性名称得到需要赋值的控件数组
ToolUtil.getCtrlListByNameD=function(isSelf,ctrlContain,attrName,attrValue,ctrlList)
{
	if(!ctrlContain)	return ctrlList;
	if(isSelf)
	{
		//没有属性值,就只根据属性找
		var attrCtrl=null;
		if(ctrlContain.attributes)
		    var attrCtrl=ctrlContain.attributes.getNamedItem(attrName);
		if(attrCtrl && !attrValue && null!=attrCtrl.value && "null"!=attrCtrl.value)
		{
			if(!ctrlList)	ctrlList=new Array();
			ctrlList[ctrlList.length]=ctrlContain;
		}
		//根据属性,及属性值确定控件
		if(attrCtrl && attrValue && attrCtrl.value==attrValue)
		{
			if(!ctrlList)	ctrlList=new Array();
			ctrlList[ctrlList.length]=ctrlContain;
		}
	}
	//检查容器控件的子控件
	for(var i=0;i<ctrlContain.children.length;i++)
		ctrlList=ToolUtil.getCtrlListByNameD(true,ctrlContain.children[i],attrName,attrValue,ctrlList);
	return ctrlList;
}

ToolUtil.getColor=function(index)
{
    if(null==index) index=0;
    if(index>=this.ColorList.length)
        index=index%this.ColorList.length;
    return this.ColorList[index];
}
ToolUtil.getColor2=function(index)
{
    if(null==index) index=0;
    if(index>=this.ColorList.length)
        index=index%this.ColorList2.length;
    return this.ColorList2[index];
}

//延时
 ToolUtil.sleep=function(num)     
 {
      var   tempDate=new   Date();   
      var   tempStr="";   
      var   theXmlHttp;
      try{ 
            if(window.XMLHttpRequest) 
            { 
                //IE7,mozilla 
                theXmlHttp=new XMLHttpRequest(); 
            } 
            else 
            { 
                  //IE6,I5 
                  try 
                  { 
                    theXmlHttp=new ActiveXObject( "Microsoft.XMLHTTP"); 
                  } 
                  catch(e) 
                  { 
                      theXmlHttp=new   ActiveXObject( "Msxml2.XMLHTTP ");             
                  } 
            } 
        } 
        catch(e) 
        { 
              alert( "对不起你的浏览器不支持XMLHTTP,原因 "+e.description+ "   请启用ActiveX或升级 "); 
        } 
      
      
      
      
      
      while((new   Date()-tempDate)<num   )   
      {   
      tempStr+="\n"+(new   Date()-tempDate);   
      try{   
      theXmlHttp   .open(   "get",   "about:blank?JK="+Math.random(),   false   );   
      theXmlHttp   .send();   
      }   
      catch(e){;}   
      }   
      return;   
 }     


//转义字符串中的单引号,使符合XPath表达式需要
ToolUtil.TransferQuot =function (str)
{
    str=(str+"").replace(this.expQuot,"\\'");
    return str;
}
//去掉首尾空格
ToolUtil.Trim=function(op)
{
	if(null==op)	return "";
	var strop=op;
	if(typeof(op)!="string")
		strop=op.toString();
	var m=strop.match(this.expTrim);
	return	(null==m)?"":m[1];
}
//向服务端提交请求,请求参数及请求命令在参数文档中声明;Command参数
//正常时返回XmlHttp对象,使之获取请求结果,不包含异常处理
ToolUtil.SendPost=function(xmldoc,Ex,isasyn)
{
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    if(document.UnitItem.XmlConf.templatetype=="HTML")
    {
        if(xmldoc.selectSingleNode("//*[@n='syspath']"))
            ls_path = xmldoc.selectSingleNode("//*[@n='syspath']").getAttribute("v")
    }
    var strcmd=this.getParamValue(xmldoc,"Command");
    var struri="";
    switch(strcmd)
    {
        case "TransParam":
            struri=ls_path+"paramlist.aspx";break;
        case "Query":
            if(Ex=="X") struri=ls_path+"xmlDataLandEx.aspx";
            else
                struri=ls_path+"xmlDataLand.aspx";break;
        case "QueryIncSerialWatch":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_Cmd":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_StartURI":
        case "Cmd_StopURI":
        case "Cmd_StationState":
        case "Cmd_State":
            struri=ls_path+"SerialWatch.aspx";break;
        case "Cmd_CmdBits":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "SwitchModel":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Save":
            struri=ls_path+"xmlDataUpdate.aspx";break;
        case "SaveWidth":
            struri=ls_path+"xmlUptGridW.aspx";break;
        case "QueryDict":
            struri=ls_path+"frSelect.aspx";break;
        case "DataDict":
            struri=ls_path+"frDict.aspx";break;
    }
    var xmlHttp=creatHttp();//;this.XmlHttpInst();
//    if(xmlHttp.onreadystatechange) xmlHttp.onreadystatechange = null;
    if(!isasyn) isasyn=false;
    try
	{
        xmlHttp.open("POST",struri, isasyn);
        xmlHttp.send(xmldoc);
    }
    catch(ex){}
    return xmlHttp;
}

//向服务端提交请求,请求参数及请求命令在参数文档中声明;Command参数
//正常时返回XmlHttp对象,使之获取请求结果,不包含异常处理
ToolUtil.SendPostX=function(xmldoc,Ex,isasyn)
{
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    if(document.UnitItem.XmlConf.templatetype=="HTML")
    {
        if(xmldoc.selectSingleNode("//*[@n='syspath']"))
            ls_path = xmldoc.selectSingleNode("//*[@n='syspath']").getAttribute("v")
    }
    var strcmd=this.getParamValue(xmldoc,"Command");
    var struri="";
    switch(strcmd)
    {
        case "TransParam":
            struri=ls_path+"paramlist.aspx";break;
        case "Query":
            if(Ex=="X") struri=ls_path+"xmlDataLandEx.aspx";
            else
                struri=ls_path+"xmlDataLand.aspx";break;
        case "QueryIncSerialWatch":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_Cmd":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_StartURI":
        case "Cmd_StopURI":
        case "Cmd_StationState":
        case "Cmd_State":
            struri=ls_path+"SerialWatch.aspx";break;
        case "Cmd_CmdBits":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "SwitchModel":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Save":
            struri=ls_path+"xmlDataUpdate.aspx";break;
        case "SaveWidth":
            struri=ls_path+"xmlUptGridW.aspx";break;
        case "QueryDict":
            struri=ls_path+"frSelect.aspx";break;
        case "DataDict":
            struri=ls_path+"frDict.aspx";break;
    }
    return struri;
}


//向服务端提交请求,请求参数及请求命令在参数文档中声明;Command参数
//正常时返回XmlHttp对象,使之获取请求结果,不包含异常处理
ToolUtil.SendPostPlus=function(xmldoc,ls_path)
{
//    var ls_path=getpath();
//    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    var strcmd=this.getParamValue(xmldoc,"Command");
    var struri="";
    switch(strcmd)
    {
        case "TransParam":
            struri=ls_path+"paramlist.aspx";break;
        case "Query":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "QueryIncSerialWatch":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_Cmd":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Cmd_StartURI":
        case "Cmd_StopURI":
        case "Cmd_StationState":
        case "Cmd_State":
            struri=ls_path+"SerialWatch.aspx";break;
        case "Cmd_CmdBits":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "SwitchModel":
            struri=ls_path+"xmlDataLand.aspx";break;
        case "Save":
            struri=ls_path+"xmlDataUpdate.aspx";break;
        case "SaveWidth":
            struri=ls_path+"xmlUptGridW.aspx";break;
        case "QueryDict":
            struri=ls_path+"frSelect.aspx";break;
        case "DataDict":
            struri=ls_path+"frDict.aspx";break;
    }
    var xmlHttp=creatHttp();//;this.XmlHttpInst();
    //if(xmlHttp.onreadystatechange) xmlHttp.onreadystatechange = null;
    try
	{
        xmlHttp.open("POST",struri, false);
        xmlHttp.send(xmldoc);
    }
    catch(ex){}
    return xmlHttp;
}

//filepathParam文件参数:img=test.jpg&type=CADFilePath
ToolUtil.SendFile=function(filepathParam)
{
    if("file:"==location.protocol )
        return "";
	var ls_path="http://"+location.host+"/"+"WebRedirect/WfInputFile.aspx?";
	var xmlhttp=this.XmlHttpInst();
	try
	{
		xmlhttp.open("GET", ls_path+filepathParam, true);
		xmlhttp.send();
	}catch(ex){
		alert("网络错误:不能传输文件! "+(ex?ex.message:''));
	}
	return;
}
//与服务器交互
ToolUtil.Post=function(xmldoc,ashx, callback)
{
	var ls_path=getpath();
	ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
	var xmlHttp=creatHttp();
	if(callback) xmlHttp.onreadystatechange = callback;
	try
	{
		xmlHttp.open("POST", ls_path+ashx, callback?true:false);
		if(xmldoc)
		    xmlHttp.send(xmldoc);
		else
		    xmlHttp.send();
		if(callback) return xmlHttp;
	}catch(ex){
		alert("请求出错:"+(ex?ex.message:''));
	}
	return xmlHttp.responseText;
}
//从服务器上生成一个新的GUID
ToolUtil.NewGUID=function()
{
    if("file:"==location.protocol )
        return "";
	var ls_path=getpath();
	ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
	var xmlHttp=creatHttp();//this.XmlHttpInst();
	//if(xmlHttp.onreadystatechange) xmlHttp.onreadystatechange = null;
	try
	{
		xmlHttp.open("POST", ls_path+"frGUID.aspx", false);
		xmlHttp.send();
	}catch(ex){
		alert("网络错误:不能获取GUID! "+(ex?ex.message:''));
	}
	return xmlHttp.responseText;
}
ToolUtil.NewDJBH=function(billtype)
{
   var strRequest=this.setValueTag("","类型","单据流水号");
   strRequest=this.setValueTag(strRequest,"单据类型",billtype);
   if("file:"==location.protocol )
        return "";
	var ls_path=getpath();
	ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
	var xmlHttp=creatHttp();//this.XmlHttpInst();
	//if(xmlHttp.onreadystatechange) xmlHttp.onreadystatechange = null;
	try
	{
		xmlHttp.open("POST", ls_path+"frDJBH.aspx", false);
		xmlHttp.send(strRequest);
	}catch(ex){
		alert("网络错误:不能获取编号! "+(ex?ex.message:''));
		return "";
	}
	return unescape(xmlHttp.responseText);
}

//数据转换为指定类型的数据:string,bool,int,number,decimal,date
ToolUtil.Convert=function(op, dataType) 
{
	if(null==op)	return null;
	if(!dataType)	dataType="string";
    if(typeof(op)=="function")
		return false;
    function GetFullYear(year) {
        return (year + parseInt(this.century)) - ((year < this.cutoffyear) ? 0 : 100);
    }
    dataType=this.Trim(dataType);
    var num, cleanInput, m, exp;
    switch(dataType.toLowerCase())
    {
		case "string":
			return op.toString();
		case "bool":
		case "boolean":
			if(isNaN(op) && typeof(op)=="number")	return false;
			var opnew=op.toString().toLowerCase();
			if("null"==opnew)	return false;
			if("false"==opnew || "0"==opnew || ""==opnew)
				return false;
			else
				return	true;
		case "int":
		case "integer":
			if(typeof(op)=="number")
				return (isNaN(op)?0:Math.round(op));
			num=parseInt(op,10);
			return (isNaN(num)?0:num);
		case "number":
		case "float":
		case "decimal":
		case "money":
		case "double":
		    if(typeof(op)=="string") op = op.replaceAll(",","");
			if(typeof(op)=="string" && op!=0 && op.substring(op.length-1,op.length)==".") op=op.substring(0,op.length-1);
			if(typeof(op)=="number")
				return (isNaN(op)?0:op);
			try{m=op.match(this.expDouble);}catch(ex){return 0;}
			if(null==m)	return 0;
			if((null==m[1] || ""===m[1]) && (null==m[2] || ""===m[2] ) && (null==m[4] || ""===m[4]) )	
				return 0;
			cleanInput=m[1] + (m[2].length>0? m[2]:"0") +"."+m[4];
			
			num=parseFloat(cleanInput);
			return ((isNaN(num) && typeof(op)=="number")?0:num);
		case "currency":
		    op = op.replaceAll(",","");
			try{m=op.match(this.expCurrency);}catch(ex){return null;}
			if(null==m)	return null;
			var intermed=m[2]+m[5];
			cleanInput=m[1] + intermed.replace(this.expGroupChar,"")+((this.digits>0)?"."+m[7]:0);
			num=parseFloat(cleanInput);
			return ((isNaN(num) && typeof(op)=="number")?null:num);
		case "date":
		case "datetime":
		    if (typeof (op) == "object")
		        return (isNaN(new Date(op)) ? null : (new Date(op)));
		    if (typeof (op) != "string")
		        return null;
		    //如果包含有T,只取T之前的日期转换;不能转换成日期按照该格式解:2006-12-14T00:00:00+08:00 或 2006-12-14,00:00:00.000
		    if (op.indexOf("T") > 1 || op.indexOf(",") > 1 || op.indexOf(" ") > 1) {
		        if (!isNaN(new Date(op)))
		            return new Date(op);
		        if (op.indexOf(",") > 0) {
		            var time = op.substr(op.indexOf(",") + 1);
		            op = op.substring(0, op.indexOf(","));
		        } else if (op.indexOf("T") > 0) {
		            var time = op.substring(op.indexOf("T") + 1, op.indexOf("+"));
		            op = op.substring(0, op.indexOf("T"));
		        } else {
		            var time = op.substring(op.indexOf(" ") + 1);
		            op = op.substring(0, op.indexOf(" "));
		        }
		    }
		    m = op.match(this.expDateYearFirst);
		    var day, month, year;
		    if (m != null && (m[2].length == 4 || this.dateorder == "ymd")) {
		        day = m[6];
		        month = m[5];
		        year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10))
		    }
		    else {
		        m = op.match(this.expDateYearLast);
		        if (m == null) {
		            var date = new Date(op);
		            return ((!date || isNaN(date)) ? null : date);
		        }
		        if (this.dateorder == "mdy") {
		            day = m[3];
		            month = m[1];
		        } else {
		            day = m[1];
		            month = m[3];
		        }
		        year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10))
		    }
		    month -= 1;
		    var date = new Date(year, month, day);
		    var date = (typeof (date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate()) ? date : null;
		    if (null == date)
		        date = new Date(op);
		    if (time && date && !isNaN(date)) {
		        var time = time.match(this.expTime);
		        if (time && time.length > 2)
		            date.setHours(time[1], time[2], time[3]);
		        if (time && time.length > 3 && time[4])
		            date.setMilliseconds(parseFloat(time[4]) * 1000);
		    }
		    return ((!date || isNaN(date)) ? null : date);
		default:
			return op.toString();
    }
    return op.toString();
}//ToolUtil.Convert=function(op, dataType) 

//获取字段数据类型，输出为常用表达方式，用于后台数据类型,javascrip的基本数据类型:string,bool,int,decimal,datetime
ToolUtil.tranDBType = function(xmldatatype) 
{
    if(!xmldatatype)    xmldatatype="string";
	var strDbType = "";
	switch(xmldatatype.toLowerCase())
	{
		case "xs:string":
		case "string":
		case "text":
		case "s":
			strDbType="string";	
			break;
		case "xs:int":
		case "xs:integer":
		case "int":
		case "integer":
		case "i":
			strDbType="int";
			break;
		case "xs:decimal":
		case "xs:double":
		case "xs:float":
		case "xs:money":
		case "number":
		case "float":
		case "decimal":
		case "double":
		case "money":
		case "f":
			strDbType="decimal";
			break;
		case "xs:date":
		case "xs:datetime":
		case "date":
		case "datetime":
		case "d":
			strDbType="datetime";
			break;
		case "xs:boolean":
		case "bool":
		case "boolean":
		case "b":
			strDbType="bool";
			break;
		default:
			strDbType="string";	
			break;
	}
	return 	strDbType;
}
//获取字段数据类型，输出为XSLT数据类型，用于XSLT转换
ToolUtil.tranDBTypeXSLT = function(dbtype) 
{
	var strDbType = this.tranDBType(dbtype);
	switch(strDbType.toLowerCase())
	{
		case "string":
			strDbType="text";	
			break;
		case "int":
		case "decimal":
			strDbType="number";
			break;
		default:
			strDbType="text";	
			break;
	}
	return 	strDbType;
}
//获取字段数据类型，输出为XSLT数据类型，用于XSLT转换
ToolUtil.tranDbTypeParam = function(dbtype)
{
	var strDbType = this.tranDBType(dbtype);
	switch(strDbType.toLowerCase())
	{
		case "string":
			strDbType="s";
			break;
		case "int":
		    strDbType="i";
		    break;
		case "decimal":
			strDbType="f";
			break;
		case "datetime":
			strDbType="d";
			break;
		case "bool":
			strDbType="b";
			break;
		default:
			strDbType="s";
			break;
	}
	return 	strDbType;
}

//对参数列表文档的操作;指定参数区域的按照区域取值,没有指定的按照优先级取值
ToolUtil.getParamValue=function(paramXmldoc,key,PR,PRname,PL)
{
    if(!paramXmldoc || !key)
        return "";
    if(!PR) PR=new Array("B", "P", "S");
    else{   if("P"!=PR && "S"!=PR && "B"!=PR)  PR="P";
            PR=new Array(PR);
    }
    if(!PL) PL=new Array( "T", "C", "D", "Ts" );
    else{   if("T"!=PL && "Ts"!=PL && "D"!=PL && "C"!=PL) PL="T";
            PL=new Array(PL);
    }
    for (var n = 0; n < PR.length; n++)
    {
        var xnPLlist = null;
        if ("B" == PR[n] && PRname)
            xnPLlist = paramXmldoc.selectNodes("//PL[@t='B' and @n='" + PRname + "']");
        else
            xnPLlist = paramXmldoc.selectNodes("//PL[@t='"+PR[n]+"']");
        for (var i = 0; i < xnPLlist.length; i++)
            for (var k = 0; k < PL.length; k++)
            {
                var xn = xnPLlist[i].selectSingleNode("L[@t='" + PL[k] + "']/P[@n='" + key + "']");
                if (null == xn) continue;
                return xn.getAttribute("v");
            }
    }
    return "";
}
/*  设置参数: 
     paramXmldoc - 参数xml;key - 参数名称; value - 参数值; 
     dbtype - 参数类型(s,i,f,d,b,g 对应: string,int,decimal,date,bool,guid); 
     PR - 参数区域类型(有三种类型S,P,B); 
     PRname - 区域名称;
     PL - 参数列表类型,(目前数组List只在PL[@t='B']/L[@='D']/List有效)
     ptType - 项目从属类型(M,D等);
     rowIndex - 对于数组参数的行号;
*/
ToolUtil.setParamValue=function(paramXmldoc, key, value, dbtype, PR, PRname, PL, ptType,rowIndex)
{
    if(!paramXmldoc || !key || paramXmldoc.xml=="")
        return null;
    if(!PR)     PR="P";
    if(!PL)     PL="T";
    if("S"!=PR && "P"!=PR && "B"!=PR)
        PR="P";
    if("T"!=PL && "Ts"!=PL && "C"!=PL && "D"!=PL)
        PL="T";
    var xnPR = paramXmldoc.selectSingleNode("//PL[@t='" + PR + "']");
    if ("B" == PR && PRname)
    {
        xnPR = paramXmldoc.selectSingleNode("//PL[@t='B' and @n='" + PRname + "']");
        if (null == xnPR)
            xnPR = paramXmldoc.selectSingleNode("//PL[@t='B' and not(@n)]");
    }
    if (!xnPR)
    {
        xnPR = paramXmldoc.createElement("PL");
        xnPR = paramXmldoc.documentElement.appendChild(xnPR);
        
        xnPR.setAttribute("t", PR);
    }
    if (PRname)
        xnPR.setAttribute("n", PRname);
    
    var xnL = xnPR.selectSingleNode("L[@t='"+PL+"']");
    if (!xnL)
    {
        xnL = paramXmldoc.createElement("L");
        xnL = xnPR.appendChild(xnL);
        xnL.setAttribute("t", PL);
    }
    var xnlistList=xnL.selectNodes("List");
    if(rowIndex>-1 && rowIndex <= xnlistList.length)
    {
        if(rowIndex==xnlistList.length)
            var xnlist=xnL.appendChild(paramXmldoc.createElement("List"));
        else
            var xnlist=xnlistList[rowIndex];
        xnL=xnlist;
    }
    var xeParam = xnL.selectSingleNode("P[@n='"+key+"']");
    if (null == xeParam)
    {
        xeParam = paramXmldoc.createElement("P");
        xeParam = xnL.appendChild(xeParam);
        xeParam.setAttribute("n", key);
    }
    xeParam.setAttribute("v", (null==value)?"":value);
    xeParam.setAttribute("t", this.tranDbTypeParam(dbtype));
    if(ptType)
    {
        if("M"!=ptType && "E"!=ptType)    ptType="E";
        xeParam.setAttribute("pt", ptType);
    }
    return  xeParam;
}
//删除参数
ToolUtil.delParam = function(paramXmldoc, key, PR, PRname, PL)
{
    if(!paramXmldoc || !key)   return null;
    if(PR && "P"!=PR && "S"!=PR && "B"!=PR)
        PR="P";
    if("B"!=PR)  PRname=null;
    if(PL && "T"!=PL && "Ts"!=PL && "D"!=PL && "C"!=PL)
        PL="T";
    if(PR && PRname) var strPath="//PL[@t='"+PR+"' and @n='"+PRname+"']";
    else if(PR)      var strPath="//PL[@t='"+PR+"']";
    else             var strPath="//PL";
    if(PL)  strPath += "/L[@t='"+PL+"']";
    else    strPath += "/L";
    strPath += "/P[@n='"+key+"']";
    var xnlist = paramXmldoc.selectNodes(strPath);
    for(var p=xnlist.length-1;p>-1;p--)
        xnlist[p].parentNode.removeChild(xnlist[p]);
    return paramXmldoc;
}
//重置参数
ToolUtil.resetParam=function(paramXmldoc)
{
    if(!paramXmldoc)       return null;
    var xnlist = paramXmldoc.selectNodes("//PL[@t='B']/L[@t='T' or @t='D']");
    for(var p=xnlist.length-1;p>-1;p--)
        xnlist[p].parentNode.removeChild(xnlist[p]);
    var xnlist = paramXmldoc.selectNodes("//PL[@t='P' or @t='S']/L[@t='T']");
    for(var p=xnlist.length-1;p>-1;p--)
        xnlist[p].parentNode.removeChild(xnlist[p]);
    var xnlist=paramXmldoc.selectNodes("//PL[@t='P' and @n='B']");
    for(var p=xnlist.length-1;p>-1;p--)
    {
        if(xnlist[p].childNodes.length==0)
            xnlist[p].parentNode.removeChild(xnlist[p]);
    };
    return;
}
//对Tag标记字典值对解析;返回指定键的值
ToolUtil.valueTag = function(stagvalue,skey)
{
	if(null==stagvalue || null==skey)
		return null;
    stagvalue=stagvalue.replace(/,,/ig,"&#%#&");
	var arrTag = stagvalue.split(",");
	for(var i=0;i<arrTag.length;i++)
	{
	    arrTag[i]=ToolUtil.Trim(arrTag[i]);
		if(0==arrTag[i].indexOf("@"+skey+"="))
		{
			var strValue = arrTag[i].replace("@"+skey+"=","");
			var re=new RegExp("&#%#&","ig");
			strValue=strValue.replace(re,",");
			strValue=ToolUtil.Trim(strValue);
			return strValue;
		}
	}
	return null;
}

//对Tag标记字典值对赋值;返回形成的Tag字符串;如果svalue为null就删除该键值对
//形成字符串样式: @key=value,@key=value,@key=value
//对svalue值含有逗号的执行转义为双逗号,在解析时再对双逗号转义为:&#$#&
   
ToolUtil.setValueTag = function(stagvalue,skey,svalue)
{
	if(!stagvalue) stagvalue="";
	if(svalue!=0)
	    if(!svalue) svalue="";
	stagvalue += ""; svalue += "";
	if(null==skey || ""===skey)
		return stagvalue;
    stagvalue=stagvalue.replace(/,,/ig,"&#%#&");
    svalue=svalue.replace(/,/ig,",,");
	var arrTag = stagvalue.split(",");
	var strTag="",bfind=false;
	for(var i=0;i<arrTag.length;i++)
	{
		if(""==arrTag[i])	continue;
	    arrTag[i]=ToolUtil.Trim(arrTag[i]);
		if(false==bfind && 0==arrTag[i].indexOf("@"+skey+"="))
		{
			bfind=true;
			if(null!=svalue && ""!=svalue)
			{
				if(i>0)	strTag += " ,@"+skey+"="+svalue;
				else	strTag += "@"+skey+"="+svalue;
			}
		}else{
			if(i>0)	strTag += " ,"+arrTag[i];
			else	strTag += arrTag[i];
		}
	}//for(var i=0;i<arrTag.length;i++)
	if(false==bfind && null!=svalue && ""!=svalue)
	{
		if(""==strTag)
			strTag += "@"+skey+"="+svalue;
		else
			strTag += " ,@"+skey+"="+svalue;
	}
    stagvalue=stagvalue.replace(/&#%#&/ig,",,");
	strTag=strTag.replace(/&#%#&/ig,",,");
	return strTag;
}


//连接服务器测试,成功返回true;失败返回false
//usConnServer=function()  连接服务器测试,成功返回true;失败返回false
function usConnServer()
{
    if("file:"==location.protocol )
        return false;
	var ls_path="http://"+location.host+location.pathname;
	ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
	//if(ToolUtil.XmlHttpConn.onreadystatechange) ToolUtil.XmlHttpConn.onreadystatechange = null;
	try
	{
	    var url= ls_path+"wfConn.aspx"+"?dt="+(new Date());
		ToolUtil.XmlHttpConn.Open("GET", url, false);
		ToolUtil.XmlHttpConn.Send();
	}catch(ex){
        alert("网络连接已经断开或超时,请重新登录! "+(ex?ex.message:''));
	    return false;
	}
    var strResult=unescape(ToolUtil.XmlHttpConn.responseText);
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"==success) 
        return true;
    else{
        alert("网络连接已经断开或超时,请重新登录! "+(ex?ex.message:''));
        document.OffLine=true;
        return false;
    }
}
//对Tag标记字典值对解析;返回指定键的值
ToolUtil.tagObject = function(stagvalue)
{
    if (!stagvalue) return {};
    var obj = {};
    var re = new RegExp("&#%#&", "ig");
    stagvalue = stagvalue.replace(/,,/ig, "&#%#&");
    var arrTag = stagvalue.split(",");
    for (var i = 0; i < arrTag.length; i++)
    {
        var str = ToolUtil.Trim(arrTag[i]);
        if ("@" != str.substr(0, 1)) continue;
        var index = str.indexOf("=");
        if (index < 1) continue;
        var key = str.substr(1, index - 1);
        obj[key] = str.substr(index + 1);
    }
    return obj;
}

//文件结尾
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;