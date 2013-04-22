// JScript source code
//put in frame file

//?? 递归搜索到frameName的帧，然后赋值新的URL
function SetUrlByFrameName(frameName,url)
{
  var frameWin=GetFrameByName(frameName);
  if(null==frameWin)	return;
  if(null!=frameWin.location.href)
	if(frameWin.location.href.lastIndexOf(url)>0) return;
  frameWin.location=url;
  //frameWin.location.reload(true);

}

//??  消息路由:函数参数必须一个或两个,第一个是消息名称(实质上是窗口内的无参数函数),第二个是帧名称(可以忽略,忽略时将针对内容帧content发送这个消息)
function postevent()
{
	if(arguments.length<1 || arguments.length>2) return;
	for(var i=0;i<arguments.length;i++)
		if(typeof(arguments[i])!="string") 
		{
			window.alert("参数不正确!");
			return;
		}
	if(arguments.length<2)
		oFrame=GetFrameContent();
	else
		oFrame=GetFrameByName(arguments[1]);
	if(!oFrame || null==oFrame)		return;
	if(typeof(oFrame.eval)!="function") return;
		
	if(oFrame.eval("typeof("+arguments[0]+")")=="function")
		oFrame.setTimeout(arguments[0]+"()",100);
}

//?? 递归搜索到frameName的帧
function GetFrameByName(frameName,win)
{
	if(!win) win=window;
	return win;
}

function GetFrameContent()
{
	return window;
}

function exit()
{
	var result = confirm(" 是否关闭当前窗口 ?     ");
	if(result){
		window.opener=null;
		window.close();
	}
}

//Trans Paramlist,success return string
function  TransParams()
{
    return document.UnitItem.TransParams();
}

function OpenPrnWin(url)
{
    if(!url)    return;
    if(url.length<1)    return;
    var strparam=url.substr(url.indexOf('?')+1);
    var dialogpara=strparam.split(',');
    try{
        if(dialogpara[1])
            window.open(url,"","height="+dialogpara[0]+",width="+dialogpara[1]+",left=0,top=0,menu=yes,status=yes,resizable=yes,scrollbars=yes");
        else
            window.open(url); 
    }catch(ex){}
}

//新打开一个IE窗口,显示当前单元的内容,按照类型打开窗口
//winType:附加应用的类型:当前记录的明细：Detail,又增加了其他的弹出窗口
function OpenNewWin(url)
{
	if(!url)	return;
	if(url.length<1)	return;
	var strparam=url.substr(url.indexOf('?')+1);
	var dialogpara=strparam.split(',');
	try{
	    if(dialogpara[1])
	    {
		    window.open(url,"","height="+dialogpara[0]+",width="+dialogpara[1]+",left=0,top=0,menu=yes,status=yes,resizable=no,scrollbars=yes");
		}
	    else
		    window.open(url,"","height="+(screen.height-56)+",width="+(screen.width-10)+",left=0,top=0");
	}catch(ex){}
}

//新打开一个IE模式窗口,显示当前单元的内容,按照类型打开窗口
//winType:附加应用的类型:当前记录的明细：Detail
function OpenModal(url,win)
{
	if(!url)	return;
	if(url.length<1)	return;
	var strparam=url.substr(url.indexOf('?')+1);
	var dialogpara=strparam.split(',');
	if(url.indexOf('?')>0)
	    url += "&dt="+(new Date());
	else
	    url += "?dt="+(new Date());
	try{
	    var valueRtn=window.showModalDialog(url,win,"dialogHeight:"+dialogpara[0]+";dialogWidth:"+dialogpara[1]+";center: yes;help:no; resizable:yes;status:no;");
	}catch(ex){}
	return valueRtn;
}

//wrca	2004-12-12
function SysDate()
{
    return  ToolUtil.Convert(GetParam("S",null,null,"EndDate"), "date");
}
function StartDate()
{
    return  ToolUtil.Convert(GetParam("S",null,null,"StartDate"), "date");
}
function EndDate()
{
    return  ToolUtil.Convert(GetParam("S",null,null,"EndDate"), "date");
}
function SetEndDate(dvalue)
{
    var value=dvalue.getFullYear()+"-"+(dvalue.getMonth()+1)+"-"+dvalue.getDate();
    SetParam("S",null,"D","EndDate",value,"date");
}
function SetStartDate(dvalue)
{
    var value=dvalue.getFullYear()+"-"+(dvalue.getMonth()+1)+"-"+dvalue.getDate();
    SetParam("S",null,"D","StartDate",value,"date");
}

//当前用户帐号
function GetUserAccount()
{	return GetParam("S",null,null,"UserAccounts"); }

function GetUserName()
{	return	GetParam("S",null,null,"UserName"); }
function GetUserSn()
{	return	GetParam("S",null,null,"UserSn"); }
function GetDeptName()
{	return	GetParam("S",null,null,"DeptName"); }

function GetDeptSaleName()
{	return	GetParam("S",null,null,"DeptSaleName"); }

function GetDeptSupName()
{	return	GetParam("S",null,null,"DeptSupName"); }

function GetDeptCode()
{	return	GetParam("S",null,null,"DeptCode"); }

function GetDWName()
{	return	GetParam("S",null,null,"DWName"); }
function GetCompany()
{	return	GetParam("S",null,null,"Company"); }
function GetDWSupName()
{	return	GetParam("S",null,null,"DWSupName"); }

//设置参数
function SetParam(PR,PRname,PL,key,value,dbtype)
{
    var xmlparam=document.getElementById("xmlparam");
    var xmldoc=xmlparam.XMLDocument;
    return ToolUtil.setParamValue(xmldoc, key, value, dbtype, PR, PRname,PL);
}
//读取参数
function GetParam(PR,PRname,PL,key)
{
    var xmlparam=document.getElementById("xmlparam");
    var xmldoc=xmlparam.XMLDocument;
    return ToolUtil.getParamValue(xmldoc,key,PR,PRname,PL)
}
function ResetParam()
{
    document.getElementById("xmlparam").innerHTML = document.getElementById("xmlparam").innerHTML.replace("<XML>","");
    var xmlparam=document.getElementById("xmlparam");
    
    xmlparam.XMLDocument.loadXML(xmlparam.innerHTML);
    
    var xmldoc = xmlparam.XMLDocument;
    if(!xmldoc) xmldoc.LoadXML=xmlparam;
    return ToolUtil.resetParam(xmldoc);
}