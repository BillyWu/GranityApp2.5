//document.oncontextmenu = function() { return false; };
var strnavpage = "",gdNode;
 function creatHttp() // 创建xmlhttprequest,ajax开始
 {
    if(window.XMLHttpRequest) //非IE浏览器及IE7(7.0及以上版本)，用xmlhttprequest对象创建
    {
        return new XMLHttpRequest();
    }
    else if(window.ActiveXObject) //IE(6.0及以下版本)浏览器用activexobject对象创建,如果用户浏览器禁用了ActiveX,可能会失败.
    {
        return  new ActiveXObject("Microsoft.XMLHttp");
    }
 }
function ue_path()
{
    var ls_path=getpath();
    if(location.pathname.lastIndexOf("/html/")>-1)
        ls_path=ls_path.substr(0,ls_path.lastIndexOf("/html/"))
    else 
        ls_path=ls_path.substr(0,ls_path.lastIndexOf("/"))
    return ls_path;
}
function getpath(){    return " http://"+location.host+("/"+location.pathname).replace("//","/");}
function expandall(obj)
{
    lefttree.ExpandAll();
    lefttree.set_showLines(true);
}
function lefttree_onNodeSelectionChange(node){gsNode = node;}			
function valtag(stag,varname)
{
    var arrTag = stag.split(",");
    for(var i=0;i<arrTag.length;i++)
    {
        if(arrTag[i].indexOf("@"+varname+"=")>-1)
        {
	        var arr = arrTag[i].split("=");
	        return arr[1];
        }
    }
    return null;
}
function delhttp(h)
{
    h.abort();
    delete h ; 
    h=null;
}
//声明数组
var states = ["正在初始化……","正在初始化……成功！正在请求……","成功！正在接收……","完成！正在解析……","完成！"];   
function usLoadHandle()
{
    var xmlhttp =creatHttp();
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);      
    url="listbar.aspx?load=1";
    xmlhttp.open("POST",ls_path+url,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function()
    {
       var _x = xmlhttp.readyState;
       lhint.innerHTML = states[_x];
       if(_x == 4 && xmlhttp.status == 200)
        {
            loading.style.display="none";
            xmldata = xmlhttp.responseXML;delhttp(xmlhttp);
            if(!xmldata || xmldata.xml=="") {usGetTopFrame().warnout(); return;}
            setHandle(xmldata);
        }
    }
}

function _newNode(id,txt,value)
{
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID'    , id); 
    newNode.SetProperty('Text'  , txt); 
    newNode.SetProperty('Value' , value); 
    newNode.set_navigateUrl("javascript:usRunItem()")
    return newNode;
}        		
function setHandle(xmldata)
{
    var objnav = xmldata.selectSingleNode("NewDataSet/rightsql[first='true']/name");
    xmlgroups = xmldata.selectNodes("NewDataSet/rightsql[ntype='操作集组' && level='2']");
    if(xmlgroups.length==0) xmlgroups = xmldata.selectNodes("NewDataSet/rightsql[ntype='操作集组' && level='3']");
    if(objnav)
    {
        var strnavpage = objnav.text;
        parent.parent.curNavpages = strnavpage;
        document.body.title=strnavpage;
    }
    else{
        var strnavpage = valtag(xmlgroups[0].selectSingleNode("ntag").text,"navitem");
        parent.parent.curNavpages = strnavpage;
        document.body.title=strnavpage;
    }
    var objmenu = usGetTopFrame().document.getElementById("cToolbar1");
    var str = "<table id=\"tbmenu\" cellspacing=\"0\" cellpadding=\"0\" style=\"height:18;width:90%;border:0;\"><tr><TD><SPAN class=\"ctsep\">|</SPAN></TD>"
              + "<TD class=\"ct0\" style=\"width:40px\"  height=\"18\" noWrap=\"\" align=\"middle\">"
              + "<A onclick=\"javascript:mainform.document.all('contents').cols='194,*'\" href=\"#\">打开</A></TD>"
    var _pos=0;
    for(var i=0;i<xmlgroups.length;i++)
    {
        var id    = xmlgroups[i].selectSingleNode("ID").text;
        var txt   = xmlgroups[i].selectSingleNode("text").text;
        var value = xmlgroups[i].selectSingleNode("ntag").text;
        _pos = 2*(i+1)+1;
        var _w = txt.length*10+20;
        str = str + "<TD><SPAN class=\"ctsep\">|</SPAN></TD>"
        +"<TD class=\"ct0\" style=\"width:"+ _w +"px\"  noWrap=\"\" align=\"center\">"
        +"<A id=\""+id+"\" tag = \""+value+"\" onclick=\"javascript:createtree(this)\" href=\"#\">"+txt+"</A></TD>"
    }
    var strend = 
        ""
        +""
        +"<TD class=\"ctsep\" >|</TD><td style=\"width:100%\"></td><TD class=\"ctsep\" >|</TD>"
        +"<td class=\"ct0\"  noWrap=\"\" align=\"center\">"
        +"<a href=\"#\" onclick=\"javascript:logout()\">注销</a></td>"
        +"<TD class=\"ctsep\" >|</TD><td class=\"ct0\" style=\"width:60px\" "
        +"noWrap=\"\" align=\"center\"><a href=\"#\" onclick=\"javascript:exit()\">退出系统</a></td><TD class=\"ctsep\" >|</TD><td style=\"width:20\"></td>"
    objmenu.innerHTML = str + strend +"</tr></table>";
    lefttree.beginUpdate();
    createtree(xmlgroups[0]);
    lefttree.xdata=xmldata;
    lefttree.endUpdate();
    lefttree.Render();
    lefttree.ExpandAll();
    lefttree.set_showLines(true);
}
function _createtree(xmlgrp)
    {return function(){createtree(xmlgrp);}}

function createtree(obj)
{
    lefttree.beginUpdate();
    if(obj && obj.tagName!="A") 
    {
        var id    = obj.selectSingleNode("ID").text;
        var txt   = obj.selectSingleNode("text").text;
        var value = obj.selectSingleNode("ntag").text;
    }
    else
    {
        lefttree.get_nodes().clear();
        var id    = obj.id;                var txt   = obj.innerText;                var value = obj.tag;
    }
    lefttree.hmid=id;
    var pnode = _newNode(id,txt,value); 
    lefttree.AddNode(pnode);
    var xmlRows = xmldata.selectNodes("NewDataSet/rightsql[PID='"+pnode.ID+"' && hide='false']");
    for(var j=0;j<xmlRows.length;j++)
    {
        var id    = xmlRows[j].selectSingleNode("ID").text;
        var txt   = xmlRows[j].selectSingleNode("text").text;
        var value = xmlRows[j].selectSingleNode("ntag").text;
        
        var cnode = _newNode(id,txt,value);
        pnode.AddNode(cnode);
        var xmlItems = xmldata.selectNodes("NewDataSet/rightsql[PID='"+cnode.ID+"' && hide='false']");
        for(var m=0;m<xmlItems.length;m++)
        {
            var id1    = xmlItems[m].selectSingleNode("ID").text;
            var txt1   = xmlItems[m].selectSingleNode("text").text;
            var value1 = xmlItems[m].selectSingleNode("ntag").text;
            var itemnode = _newNode(id1,txt1,value1);
            cnode.AddNode(itemnode);
            var xmlsubItems = xmldata.selectNodes("NewDataSet/rightsql[PID='"+itemnode.ID+"' && hide='false']");
            for(var n=0;n<xmlsubItems.length;n++)
            {
                var id2    = xmlsubItems[n].selectSingleNode("ID").text;
                var txt2   = xmlsubItems[n].selectSingleNode("text").text;
                var value2 = xmlsubItems[n].selectSingleNode("ntag").text;
                var itemnode2 = _newNode(id2,txt2,value2);
                itemnode.AddNode(itemnode2);
            }                
        }                
    }
    lefttree.endUpdate();
    lefttree.Render();
    lefttree.ExpandAll();
    gsNode=pnode;
    usRunItem();
}
function ue_treeline(){lefttree.set_showLines(true);}
function cwin(){parent.document.all('contents').cols ='-10,*';}					
function usGetTopFrame()
{
    var win=window;
    while(win.parent)
    {
        if(win===win.parent) break;
        win=win.parent;
    }
    return win;
}		
function usRunItem()
{
    usRun(gsNode.Value,gsNode.ID);
}
function usRunMenu(obj)
{
    usRun(obj.tag,obj.id);
}
function usRun(v,id)
{
    strItem = valtag(v,"navitem"); 
    if(strItem=="" && id==lefttree.hmid)
        _initpage()
    else
    {
        if(strItem=="" && (valtag(v,"type")=="基本操作集"))
            strItem = valtag(v,"name")
        usGetTopFrame().OpenItemURL(strItem);
    }
}
function ue_getsysdb()
{
    var xmlhttp = creatHttp();
    xmlhttp.open("POST",ue_path()+"/xmlsysdb.aspx",false);
    xmlhttp.send(null);
    var xmldb = xmlhttp.responseXML.documentElement;delhttp(xmlhttp);
    if(xmldb==null) return;
    if(xmldb.selectNodes("//table").length==0){alert("未设置系统数据库！");return;}
    return xmldb.selectNodes("//table")[0].text;
}    			    

function _initpage()
{
    var id = lefttree.hmid;
    var xmlhttp = creatHttp();
    xmlhttp.open("POST",ue_path()+"/XMLdom.aspx",true);
    var xmlparams = new ActiveXObject("Microsoft.XMLDOM")
    xmlparams.async=false;
    var strxml = '<?xml version="1.0" encoding="utf-8"?>'+
                '<all><command></command><sql>exec '+ue_getsysdb()+'.dbo.navmenu "'+id+'"</sql></all>';
    xmlparams.loadXML(strxml);
	xmlhttp.send(xmlparams);
	var xmldata;
    xmlhttp.onreadystatechange = function()
    {
       if(xmlhttp.readyState == 4 && xmlhttp.status == 200) 
       {       
            xmldata = xmlhttp.responseXML.documentElement;delhttp(xmlhttp);
            if(!xmldata) return;
            lefttree.navdata = xmldata;
            var otop = usGetTopFrame();
            otop.OpenItemURL("菜单导航");
       }
    }
    return xmldata;	
}

