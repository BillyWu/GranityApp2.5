var hashUnit = new Object();   


String.prototype.replaceAll = function(regText,replaceText){var raRegExp = new RegExp(regText,"g"); return this.replace(raRegExp,replaceText); }; 

function SetUrlByFrameName(frameName,url){
var frameWin=GetFrameByName(frameName);
if(null==frameWin)return;
if(null!=frameWin.location.href)
if(frameWin.location.href.lastIndexOf(url)>0)return;
frameWin.location=url;}
function postevent(){
if(arguments.length<1||arguments.length>2)return;
for(var i=0;i<arguments.length;i++)
if(typeof(arguments[i])!="string"){
window.alert("��������ȷ!");
return;}
if(arguments.length<2)
oFrame=GetFrameContent();
else
oFrame=GetFrameByName(arguments[1]);
if(!oFrame||null==oFrame)return;
if(typeof(oFrame.eval)!="function")return;
if(oFrame.eval("typeof("+arguments[0]+")")=="function")
oFrame.setTimeout(arguments[0]+"()",100);}
function GetFrameByName(frameName,win){
if(!win)win=window;
var aFrame=win.document.getElementsByTagName("IFRAME");
var rtnFrame=null;
for(var i=0;i<aFrame.length;i++){
if(aFrame[i].id.toLowerCase()==frameName.toLowerCase())
rtnFrame=aFrame[i].contentWindow;
else
rtnFrame=GetFrameByName(frameName,aFrame[i].contentWindow);
if(null!=rtnFrame)
return rtnFrame;}
var aFrame=win.document.getElementsByTagName("FRAME");
for(var i=0;i<aFrame.length;i++){
if(aFrame[i].id.toLowerCase()==frameName.toLowerCase())
rtnFrame=aFrame[i].contentWindow;
else
rtnFrame=GetFrameByName(frameName,aFrame[i].contentWindow);
if(null!=rtnFrame)return rtnFrame;}
return rtnFrame;}
function GetFrameContent(){
return document.getElementById("mainform").contentWindow.document.getElementById("content").contentWindow;}

function opentoolswin(url,w,h)
{
    var iTop = (window.screen.availHeight-30-parseInt(h.replace("px")))/2;       //��ô��ڵĴ�ֱλ��;
    var iLeft = (window.screen.availWidth-10-parseInt(w.replace("px")))/2;           //��ô��ڵ�ˮƽλ��;
try{
window.open(url,'','width='+w+',height='+h+',left='+ iLeft +',top='+iTop+',menubar=no');}catch(ex){}
}

function exec(command)
{
    window.oldOnError=window.onerror;
    window._command=command;
    window.onerror=function(err)
    {
        if(err.indexOf('utomation')!=-1)
        {
            alert('����'+window._command+' �Ѿ����û���ֹ�� ������ͨ������Internetѡ���еİ�ȫ��������Ƿ�򿪸ó���');
            return true;
        }
            else return false;
        };
        var wsh=new ActiveXObject('WScript.Shell');
        if(wsh)
        wsh.Run(command);
        window.onerror=window.oldOnError;
}

function updatekey()
{
    OpenItemURL("�޸�����");
    mainform.document.all("contents").cols="194,*";
}
function logout(){
var result=confirm(" �Ƿ����µ�¼  ��     ");
if(result){

parent.location.href="index.htm";
//window.open("default.aspx","","height=690,width=1014,resizable=yes,left=0,top=0,toolbar=yes,menubar=yes,location=yes");
//window.opener=null;
//window.close();
}}

function ow(owurl){
var tmp=window.open("about:blank","","fullscreen=1")
tmp.moveTo(0,0)
tmp.resizeTo(screen.width+20,screen.height)
tmp.focus()
tmp.location=owurl
}


function exit(){
var result=confirm(" �Ƿ�ر�ϵͳ ?     ");
if(result){
window.opener=null;
window.close();}}

function openBusinessNav()
{

    var winNav=GetFrameByName("listbar");
    var tree=winNav.lefttree;
    var nodeSel=tree.SelectedNode;
    while(nodeSel)
    {
        var navItem=ToolUtil.valueTag(nodeSel.Value,"navitem");
        if(navItem && ""!=navItem)
        {
            mainform.document.all("contents").cols="194,*";
            OpenItemURL(navItem);
            return;
        }
        var nodeSel=nodeSel.ParentNode;
    }
    mainform.document.all("contents").cols="194,*";
    OpenItemURL("");
}
function mhHover(tbl,idx,cls){
var t,d;
if(document.getElementById)
t=document.getElementById(tbl);
else
t=document.all(tbl);
if(t==null)return;
if(t.getElementsByTagName)
d=t.getElementsByTagName("td");
else
d=t.all.tags("td");
if(d==null)return;
if(d.length<=idx)return;
d[idx].className=cls;}

function setpage()
{
    var rtn=window.showModalDialog("frmsetpage.aspx","","dialogHeight: 470px; dialogWidth:457px; edge: Raised; center: Yes; help: No; resizable: No status: No;");
}

function setright()
{
    OpenItemURL("Ȩ�޹���");
}

function TransParams()
{
    if(!document.UnitItem) return;
    
    var _url = "";
    try
    {
        _url = document.UnitItem.TransParams();
    }
    catch(ex)
    {
        GridUtil.sleep(20);
            try
            {
                _url = document.UnitItem.TransParams();
            }
            catch(ex)
            {
                GridUtil.sleep(50);
                _url = document.UnitItem.TransParams();
            }                
    }
    if(_url.toLowerCase().indexOf(".htm")>-1) _url = "html/"+_url;
    return _url;
 }
 
//prname,prvalΪǿ����������Ԫת��Ĳ������Թ��´򿪵ĵ�Ԫ��ʼ��ʱ��ϵͳ����һ��ʹ��
function OpenItem(strItemName,url,prname,prval,dtype)
{
    SetParam("P",null,"T","UnitName",strItemName,"string");
    if(prname && prval)
    {
        ToolUtil.setParamValue(document.getElementById("xmlparam").XMLDocument, prname,prval, dtype, "S", null,"D");
        if(document.getElementById("mainform").contentWindow.document.getElementById("content").contentWindow.document.getElementById("xmlparam"))
        {
            var op = document.getElementById("mainform").contentWindow.document.getElementById("content").contentWindow.document.getElementById("xmlparam");
            ToolUtil.setParamValue(op.XMLDocument, prname,prval, dtype, "S", null,"D");
        }
    }
    window.open(url);
}
 
//prname,prvalΪǿ����������Ԫת��Ĳ������Թ��´򿪵ĵ�Ԫ��ʼ��ʱ��ϵͳ����һ��ʹ��
function OpenItemURL(strItemName,prname,prval)
{
    SetParam("P",null,"T","UnitName",strItemName,"string");
    if(prname && prval)
        ToolUtil.setParamValue(document.getElementById("xmlparam").XMLDocument, prname,prval, "date", "S", null,"D");
    
    switch(strItemName)
    {
        case "��ͼ���":
            var url = TransParams();
            if(!url)return;
            if(url.length<1) return;
            mainform.frames["content"].location.href=url;
            break;
        case "":
            mainform.document.all("contents").cols="194,*";
            //if(mainform.frames["content"].location.href.indexOf("html/")>-1)
                mainform.frames["content"].location.href=ue_path()+"/html/cWelcome.htm";
            //else 
            //    mainform.frames["content"].location.href="html/cWelcome.htm";
            break;
        case "sys_sqldesigner":
            window.open("html/QueryDesigner.htm");
            return;
        case "��ͼ���":
            window.open("VML3.0/mapdesign.htm");
            return;
        default:
            
            var url = TransParams();
            if(!url || url=="")
            {
                mainform.frames["content"].location.href="html/cWelcome.htm";
                return;
            }           
            if(url.length<1)return;
            try{
                if(url.toLowerCase().indexOf("wfindepend.aspx")>-1||url.toLowerCase().indexOf("wfsimple.aspx")>-1||url.toLowerCase().indexOf("wfvmlchart.aspx")>-1)
                    window.open(url,"","height="+(screen.height-56)+",width="+(screen.width-10)+",left=0,top=0,status=yes,toolbar=no,menubar=no;");
                else
                {
                    if(url.indexOf("http://")>-1)
                    {
		                var ww = window.screen.width-20;
		                var hh = window.screen.height - 140;
		                window.open(url,"","width="+ww+",height="+hh+",resizable=yes,left=0,top=0,toolbar=yes,menubar=yes,location=yes");                    
                    }
                    else
                    {
                        url=url.replace("html/","");
                        mainform.frames["content"].location.href=ue_path()+"/html/"+url;
                     }
                }
               }catch(ex)
               {
                    mainform.frames["content"].location.href="html/cWelcome.htm";
               }
            break;
   }
}
//�ɲ���ҳ��ת����ҳ��
function IOpenItemURL(strItemName,prname,prval)
{
    SetParam("P",null,"T","UnitName",strItemName,"string");
    if(prname)
    {
        var prnames = prname.split(",");
        var prvals  = prval.split(",");
        for(var i=0;i<prnames.length;i++)
            ToolUtil.setParamValue($("xmlparam").XMLDocument, prnames[i],prvals[i],"string", "S", null,"D");
    }
    var url = TransParams();
    if(!url || url=="")
    {
        mainform.frames["content"].location.href=ue_path()+"/html/cWelcome.htm";
        return;
    }           
    if(url.length<1)return;
    try{
        if(url.toLowerCase().indexOf("wfindepend.aspx")>-1||url.toLowerCase().indexOf("wfsimple.aspx")>-1||url.toLowerCase().indexOf("wfvmlchart.aspx")>-1)
            window.open(url,"","height="+(screen.height-56)+",width="+(screen.width-10)+",left=0,top=0,status=yes,toolbar=no,menubar=no;");
        else
        {
            if(url.indexOf("http://")>-1)
            {
                var ww = window.screen.width-20;
                var hh = window.screen.height - 140;
                window.open(url,"","width="+ww+",height="+hh+",resizable=yes,left=0,top=0,toolbar=yes,menubar=yes,location=yes");                    
            }
            else
            {
                url=url.replace("html/","");
                mainform.frames["content"].location.href=ue_path()+"/html/"+url;
             }
        }
       }catch(ex)
       {
            mainform.frames["content"].location.href=ue_path()+"/html/cWelcome.htm";
       }
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

function OpenNewWin(url)
{
    if(!url)return;
    if(url.length<1)return;
    var strparam=url.substr(url.indexOf('?')+1);
    var dialogpara=strparam.split(',');
    var iTop = (window.screen.availHeight-30-parseInt(dialogpara[0].replace("px")))/2;       //��ô��ڵĴ�ֱλ��;
    if(dialogpara[1])
        var iLeft = (window.screen.availWidth-10-parseInt(dialogpara[1].replace("px")))/2;       //��ô��ڵ�ˮƽλ��;    
    try{
    if(dialogpara[1])
    window.open(url,"","height="+dialogpara[0]+",width="+dialogpara[1]+",left="+ iLeft +",top="+ iTop +",menu=yes,status=no,resizable=no,scrollbars=yes");
    else
    window.open(url,"","height="+(screen.height-56)+",width="+(screen.width-10)+",left=0,top=0");}catch(ex){}
}

function OpenModal(url,win)
{
    if(!url || url.length<1)return;
    var strparam=url.substr(url.indexOf('?')+1);
    var dialogpara=strparam.split(',');
    if(url.indexOf('?')>0) url+="&dt="+(new Date());
    else url+="?dt="+(new Date());
    try
    {
        var valueRtn=window.showModalDialog(url,win,"dialogHeight:"+dialogpara[0]+";dialogWidth:"+dialogpara[1]+";center: yes;help:no; resizable:yes;status:no;");
    }catch(ex){}
   return valueRtn;
}


function OpenItemModal(itemname)
{
    var win = document.UnitItem;
    var url = "wfSimpAppend.aspx?500px,300px";
    OpenModal(url,win);
}
    
function SetLeftBarVisible(bVisiable)
{
    if(bVisiable==true)
        mainform.document.all("contents").cols="194,*";
    else
        mainform.document.all("contents").cols="-10,*";
    return;
}
function SetRightBarVisible(bVisible,strframesplit)
{
    if(typeof(bVisible)!="boolean")return;
    if(true==bVisible){mainform.document.all("contents").cols=strframesplit;}
    else{mainform.document.all("contents").cols=strframesplit;}
    return;
}
 
function SysDate(){
return ToolUtil.Convert(GetParam("S",null,null,"EndDate"),"date");}
function StartDate(){
return ToolUtil.Convert(GetParam("S",null,null,"StartDate"),"date");}
function EndDate(){
return ToolUtil.Convert(GetParam("S",null,null,"EndDate"),"date");}
function SetEndDate(dvalue){
var value=dvalue.getFullYear()+"-"+(dvalue.getMonth()+1)+"-"+dvalue.getDate();
SetParam("S",null,"D","EndDate",value,"date");}
function SetStartDate(dvalue){
var value=dvalue.getFullYear()+"-"+(dvalue.getMonth()+1)+"-"+dvalue.getDate();
SetParam("S",null,"D","StartDate",value,"date");}
function GetUserAccount(){return GetParam("S",null,null,"UserAccounts");}
function GetUserName(){return	GetParam("S",null,null,"UserName");}
function GetUserSn(){return	GetParam("S",null,null,"UserSn");}
function GetDeptName(){return	GetParam("S",null,null,"DeptName");}
function GetUnitCode(){return	GetParam("S",null,null,"UnitCode");}
function GetDeptSaleName(){return	GetParam("S",null,null,"DeptSaleName");}
function GetDeptSupName(){return	GetParam("S",null,null,"DeptSupName");}
function GetDeptCode(){return	GetParam("S",null,null,"DeptCode");}
function GetDWName(){return	GetParam("S",null,null,"DWName");}
function GetCompany(){return	GetParam("S",null,null,"Company");}
function GetDWSupName(){return	GetParam("S",null,null,"DWSupName");}


function SetParam(PR,PRname,PL,key,value,dbtype)
{
    //�����Զ���ҳ���λϵͳ����,�����ı����ݻָ�xml
    var xmlpm=document.getElementById("xmlparam");
    var   xmlDom   =  createXml(xmlpm.innerHTML);
    xmlpm.XMLDocument=xmlDom;
    var xmldoc=xmlpm.XMLDocument;
    var xmlsys = xmldoc.selectSingleNode("//PL[@t='S']");
    if(xmlsys==null)
    {
        var pagesys = document.getElementById("xmlparam").XMLDocument.selectSingleNode("//PL[@t='S']");
        if(!pagesys) 
        {
            alert("ϵͳ������ʧ�����飡");
            return;
        }
        xmldoc.childNodes.item(0).appendChild(pagesys);
    }    
    if(document.UnitItem)
        document.UnitItem.ParamXmldoc = xmldoc;   
    return ToolUtil.setParamValue(xmldoc,key,value,dbtype,PR,PRname,PL);
}
function GetParam(PR,PRname,PL,key)
{
    var xmlparam=document.getElementById("xmlparam");
    var xmldoc=xmlparam.XMLDocument;
    return ToolUtil.getParamValue(xmldoc,key,PR,PRname,PL)
}
function ResetParam()
{
    var xmlparam=document.getElementById("xmlparam");
    var xmldoc=xmlparam.XMLDocument;
    return ToolUtil.resetParam(xmldoc);
}

