function initsysparams()
{
    //取主页系统参数
    if(window.opener && window.opener.document)
    {
        var _strPram = window.opener.document.strPram;
        if(!_strPram)
            var _oPram = window.opener.$("mainform").contentWindow.$("content").contentWindow.$("xmlparam");  
        var xmlhttp = createXml(_oPram.xml)
        var xmlNodes = xmlhttp.documentElement.selectNodes("//PL[@t='S']");
        var str = xmlNodes[0].xml+$("xmlparam").XMLDocument.selectSingleNode("//PL").xml;
        $("xmlparam").loadXML("<D>"+str+"</D>");
    }
    else
    //取上级系统参数(模态)
        if(window.dialogArguments)
        {
            var pBand = window.dialogArguments;
            var xmlNodes = pBand.UnitItem.ParamXmldoc.selectNodes("//PL[@t='S']");
            var str = xmlNodes[0].xml+$("xmlparam").XMLDocument.selectSingleNode("//PL").xml;
            $("xmlparam").loadXML("<D>"+str+"</D>");
        }
        else
        {
            var xclone = window.parent.parent.$("xmlparam").cloneNode(true);
            if(!window.parent.parent.$("xmlparam")) return;
            var xmlppm = window.parent.parent.$("xmlparam").XMLDocument;
            var xmlsys = xmlppm.selectSingleNode("//PL[@t='S']");
            if(xmlsys && $("xmlparam"))
                $("xmlparam").childNodes.item(0).appendChild(xmlsys);
            window.parent.parent.$("xmlparam").XMLDocument=xclone;
        }
}
// 添加
function Uadd(ohash,key,value){
   // 判断key是否存在
   if(key in ohash){
        alert("key已经存在");
   }
   ohash[key] = value;
}
//删除
function Udel(ohash,key){
    delete(ohash[key]);
    alert("删除成功");
}
// 取值
function UgetValue(ohash,key){
    if(ohash) return ohash[key];
}
function ue_initsetup(unititem,flag)
{
    if(!flag){
    var _ldiv = document.createElement("div");
    var ibg = "<iframe  id=loadingbg style=\"position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:21002; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
    var sload = ibg + '<div id="loading" style="z-index:21002;text-align:center;height:25px;background-color:#F9F8F4 ;position:absolute;left:expression(document.body.clientWidth/2-100);top:expression(document.body.clientHeight/2-40);">\
    <iframe name="processIframe" scrolling=no frameborder="0" style="z-index:21002;width:170px;height:25px" src="process.htm"></iframe>\
    </div>';
    _ldiv.innerHTML=sload;
    document.body.appendChild(_ldiv);
    }
      var ohash = usGetTopFrame().hashUnit;
      var vkey = UgetValue(ohash,unititem);
      if(vkey) writesys(vkey)
      else
      {
        var xmlhttp = buildXom("select sysstr from 系统配置表 where name='"+unititem+"'")
        xmlhttp.onreadystatechange = function()
        {
           if(xmlhttp.readyState == 4 && xmlhttp.status == 200) 
           {       
                xmldata = xmlhttp.responseXML.documentElement;
                if(!xmldata.selectSingleNode("table/sysstr"))
                {alert("【"+unititem+"】不正确，请检查");return};
                var s = xmldata.selectSingleNode("//table/sysstr").text;
                s = s.replaceAll("&amp;quot;","'");
                if(ohash) Uadd(ohash,unititem,s);
                writesys(s)
           }
        }            
      }
}
function writesys(s)
{
    var _odiv = document.createElement("div");
    _odiv.setAttribute("id","sysdiv");
    _odiv.style.width="0"; _odiv.style.height="0";_odiv.style.display="none";
    _odiv.innerHTML=s;
    document.body.appendChild(_odiv);
    WinLoadUtil.MDTPLoad();
}
function buildXom(sql)
{
    var xmlhttp = CreateHTTP();
    xmlhttp.open("POST",ue_path()+"/XMLdom.aspx",true);
    var xmlparams = new ActiveXObject("Microsoft.XMLDOM")
    xmlparams.async=false;
    var strxml = '<?xml version="1.0" encoding="utf-8"?>'+
                '<all><command></command><sql></sql></all>';
    xmlparams.loadXML(strxml);
    xmlparams.selectSingleNode("//sql").text = sql;
    xmlhttp.send(xmlparams);
    return xmlhttp;
}

//禁止刷新，回退 
document.onkeydown = function()
{
    if($U().UnitName=="工作流设计") return;
    var e = event, t = event.srcElement.type;
//            if (e.altKey || e.srcElement.readOnly || (8 == e.keyCode && "text" != t && "textarea" != t && "password" != t)
//                || (e.ctrlKey && (78 == e.keyCode || 82 == e.keyCode)) || 116 == e.keyCode)
    if(8 == e.keyCode && (e.srcElement.readOnly || ("text" != t && "textarea" != t && "password" != t)))
    {
        e.keyCode = 0;
        e.returnValue = false;
    }
}