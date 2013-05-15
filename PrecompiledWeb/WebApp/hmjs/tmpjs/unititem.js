  var isfirst=true;
  function initWin()
  {
    $("frtitle").innerText="正在加载数据，请稍等...";
    $("frtitle").innerText="　功能单元设置 ";             
    var ob = $band("itemtree");
    ob.Asyn = true;
    $band("items").Asyn = true;
    $band("columns").Asyn = true;
    ob.minwidth=420;ob.colnum = 1;ob.startpos=0;ob.endpos=18;ob.pwcols="";ob.hr="基本信息：";ob.splitrow=5;
    ob.dicts="@templatetype=SIMPL|内嵌页面/SIMP|弹出页面/VML|图形页面/Main|首页面/HTML|HTML页面/HTML|HTML弹出页面/nav|导航页面,\
    @printtype=word|WORD打印/excel|Excel打印/=html|网页打印";
    YPanel("itemtree","tabUnit",null,1,null,null,120);
    ob.XQuery();
    ob.AfterXQuery = function(){
        $loading("none");
    }
    ob.AfterCellEditChanged=function()
    {
        if(this.Event.colName=="ntype")
            changepro(this.getFldStrValue("ntype"));        
    }
  }

function Tree_onNodeSelectionChange(node)
{
    if(document.locktree==1) return;
    var band	=	node.ParentTreeView.Tree.Band;
    TclickDot(node,true);				  
    var ntype 	= 	band.getFldStrValue("ntype");
    changepro(ntype);
    $loading("none");  
}
function secBoard(n)
{
    if($("mainTable")){
        if(n>=mainTable.tBodies.length) return;
        for(i=0;i<mainTable.tBodies.length;i++)
          mainTable.tBodies[i].style.display="none";
        mainTable.tBodies[n].style.display="block";
    }
}	
function changepro(type)
{
    var itemname = "";
    var ob;
	switch(type)
	{
		case "UnitItem": secBoard(1);
			break;
		case "Item":secBoard(2);
		    ob = $band("items");
            ob.minwidth=180;ob.colnum = 2;ob.startpos=0;ob.endpos=14;ob.pwcols="";ob.hr="基本信息：";ob.splitrow=5;
            ob.dicts="@relation=M|主表/D|从表/G|独立";
            ob.boxs="@columnkey=";
            YPanel("items","tabItem",null,1,null,null,80);
            ob.minwidth=90;ob.colnum = 3;ob.startpos=14;ob.endpos=25;ob.pwcols="";ob.hr="树属性参数： 如果以树的形式表现为，请设置下列参数 ";
			YPanel("items","tabItem1",null,1,null,null,80);
			itemname = "items";
			break;
		case "AppendItem":secBoard(3);
            itemname = "appitems";
		    ob = $band(itemname);
            ob.Asyn = true;
            ob.minwidth=420;ob.colnum = 1;ob.startpos=0;ob.endpos=18;ob.pwcols="";ob.hr="基本信息：";ob.splitrow=5;
            ob.dicts="@funtype=browser|浏览/editmodal|模态/import|输入/checkin|代入/report|报表,\
            @printtype=word|WORD打印/excel|Excel打印/=html|网页打印";
            YPanel(itemname,"tabappItem",null,1,null,null,120);
			break;
		case "CommandItem":secBoard(4);
            itemname = "comitems";
		    ob = $band(itemname);
            ob.Asyn = true;
            ob.minwidth=420;ob.colnum = 1;ob.startpos=0;ob.endpos=18;ob.pwcols="";ob.hr="基本信息：";ob.splitrow=5;
            ob.dicts="@funtype=sqlcmd|命令";
            YPanel(itemname,"tabcomItem",null,1,null,null,120);
			break;
		default:
		    secBoard(0);
	}
	if(itemname=="") return;
    var band = $band(itemname);
    band.XQuery();
//	if(itemname=="items") _xmlflds();
//    $band("columns").active = false;
}
function showcols()
{
    var str='<fieldset style="padding: 2px;width:99%;height:40px;text-align:left"><legend>字段属性设置：</legend>'
    +'<table border="0"><tr><td> 选择数据库：<input style=width:100 id="dataname" datavaluefield=name datatextfield=name datasourceid="execute [sys].dbo.select_database" name=D7 \><input \
    title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  \
    style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/>\
    <input style="width:200" id="tablename" datavaluefield=name datatextfield=name datasourceid="execute [sys].dbo.select_tableName @dataname" /><input \
    title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  \
    style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/>\
    <span class="span120"></span><a href=# class=linkbtn_0 onclick="ts_importDate(\'params\',\'columns\')">【提取参数】</a>【<a href="#" class="linkbtn_0" onclick="ue_save()";>保存</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("dvcols","none");>关闭</a>】</td></tr></table></fieldset>'
    +'<p style="margin:2"/><div style="width:99%;height:380px;" id="dvcolumns"></div>';
    DlgWin("dvcols","dvcolumns","字段属性设置","columns",str,750,450);
    var ob = $band("columns");
    ob.minwidth = "80px";
    ob.gridtype = 8;
    ob.freecols = "name";
    ob.StrongGrid = true;
    new XGrid("dvcolumns",ob,"in");
    ob.XQuery(true);		
}			

function openPro(xmlID)
{
    if(!xmlID)
    {
        var tab=ToolUtil.getCtrlByTagU(false,event.srcElement,"TABLE","tabType","grid");
        if(!tab)	return;
        var tabDetail=ToolUtil.getCtrlByTagD(true,tab,"TABLE","tabType","detail");
        if(!tabDetail || !tabDetail.Grid)
            return;
        var band=$band(tabDetail.Grid.ItemName);
    }else{
        var xmlland=$(xmlID);
        if(!xmlland)	return;
        var band=$band(xmlland.itemname);
    }
    if(!band || !band.XmlSchema)    return;
    var rtn = window.showModalDialog("frmprop.HTM",band,"dialogHeight: 560px; dialogWidth: 450px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
    if(rtn=="" || rtn==null) return 1;	 
}
function openModal(flag)
{
    _openModal("items","select_DataSrc",flag);
}
function openAppendModal(flag)
{
    _openModal('appitems','select_DataSrc',0)
}
function openCmdModal(flag)
{
    _openModal('comitems','select_DataSrc',0);
}

function unitModal()
{
    $band("appitems").setModalContent("select_UnitItem")
}
function _openModal(src,xwin,xdict)
{
    var oband = $band("itemtree");
    var trvNode = oband.Tree.WebTree.SelectedNode;
    var pIndex = oband.Tree.getRowIndexByTrvNode(trvNode.ParentNode);
    var fileval = $band("itemtree").getFldStrValue("datasrcfile",pIndex);
    var xmldoc=document.UnitItem.ParamXmldoc;
    var pval="";
    switch(xdict)
    {
        case 0:
            pval = $band(src).getFldStrValue("dataitem");
            break;
        case 1:
            pval = $band(src).getFldStrValue("countdataitem");
            break;
    }
    var _ipos = pval.indexOf(":");
    if(_ipos>-1)
    {
        var arr = pval.split(":");
        if(arr.length>0)
        {
            fileval = arr[0]; pval = arr[1];
        }
    }
    ToolUtil.setParamValue(xmldoc, "dataitemname", pval, "s", "P", "", "Ts","");
    ToolUtil.setParamValue(xmldoc, "datafile", fileval, "s", "P", "", "Ts","");
	$band(src).setModalContent(xwin);
}

function _btnEdit()
{
    var tmps = ue_ajaxdom("","htmlfiles");
    Acbo(tmps.text.split(","))
}

function _btnprnEdit1()
{
    var tmps = ue_ajaxdom("","prnfiles");
    Acbo(tmps.text.split(","))
}
function _btnimgEdit()
{
    var tmps = ue_ajaxdom("","iconfiles");
    Acbo(tmps.text.split(","))            
}
function OnMessageBack_prn()
{
	if(xmlhttp.readyState==4 && xmlhttp.status==200)
	{
        var arrfiles =xmlhttp.responseText.split(",");
		var owin = new oWin(arrfiles);
        var rtn = window.showModalDialog("DataSource/Template/frmprn.HTM",owin,"dialogHeight: 535px; dialogWidth: 600px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 				
    }
}

function oWin(arr)
{
    var obj= new Object;
    obj.files = arr;
    obj.band = $band("itemtree");
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    obj.appath = ls_path;
    return obj;
}

function ts_importDate(srcitem,destitem)
{
	if($("tablename").value=="") {alert("请选择一个数据库表名称！");return}
	var band=$band(destitem);	
	var xmldoc=document.UnitItem.ParamXmldoc;
	var tablename = $("tablename").value;
	ToolUtil.setParamValue(xmldoc, "tablename", $("dataname").value + ".dbo." +tablename, "", "s", band.ItemName, "D",""); 
	$band(destitem).setModalContent(srcitem);
}

function _copy()
{
    var str=strscrtable();
    DlgWin("1","dvcopy","参数复制",null,str,480,200);
    var oband=$band("itemtree");
    if(oband.getFldStrValue(oband.Tree.TypeField)=="UnitItem")
    {
        var pid = oband.getFldStrValue("PID");
        var xmlNodeRowsDest = oband.XmlLandData.XMLDocument.selectNodes("//unititems[PID='"+pid+"']");
        var xmlNodeRows = oband.XmlLandData.XMLDocument.selectNodes("//unititems[ntype='UnitItem']")
        us_htmlXdict("txtsrc",xmlNodeRows);
    }
    $("txtsrc").value=oband.getFldStrValue("ID");
}	
    function us_htmlXdict(objname,xmlrows)
    {
        var obj=$(objname);
        if(!obj || !obj.options) return;
        var ops = obj.options;
        if(ops.options.length>0) return;
        for(var i=0;i<xmlrows.length;i++)
        {
            var txt = xmlrows[i].selectSingleNode("name");
            var value = xmlrows[i].selectSingleNode("ID");
            ops.add(new Option(txt.text,value.text));
        }
    }

function runcopy()
{
     var tit1 = $("txtsrc").options[$("txtsrc").options.selectedIndex].text;
     var tit2 = $("txtdest").value;
     if(tit2=="" || tit1==tit2) {alert("新操作集名称不能为空，且不能重复!");return;}
     var result = confirm("您将把【"+tit1+"】的参数值复制给【"+tit2+"】，确认吗？");
     if(!result) return;                    
    var strsql = "execute "+ue_getsysdb()+".dbo.proc_copy_unititemByName '"+tit1+"','"+ tit2 +"'";
    ue_ajaxdom(strsql,1,"复制成功！");
    ShowHide(1);
}
function strscrtable()
{
    var s= '<div><fieldset style="padding: 2;width:99%;;height:120px"><legend>复制参数:</legend><div style="text-align:left"><br />'+
    '<span style="text-align:right;width:200px">源参数命令组:&nbsp;&nbsp;</span><select id="txtsrc" size="1" style="WIDTH: 200;" name="D6"></select>'
    +    '<br /><br />'+
    '<span style="text-align:right;width:200px">目的参数命令组:&nbsp;&nbsp;</span><input id="txtdest" type="text" style="WIDTH: 200;" name="D6" />'
    +'</fieldset>'+
    '</div><br />'+
    '<input type=button value="确定" onclick="runcopy();"style="width:80px">';
    return s;
}
function ws_locktree(obj)
{
    if(obj.nameProp=="lock_open.gif")
    {
        document.locktree=1;
        obj.src="images/lock.gif";
    }
    else
    {
        document.locktree=0;
        obj.src="images/lock_open.gif";
    }
}            

function _save()
{
    var oband=$band("itemtree");
    if(oband.getFldStrValue("ntype")=="BusinessSource"){alert("请保存指定的项目！");return;}                
    if(oband.getFldStrValue("ntype")=="UnitItem")
    {
        var unititem = oband.getFldStrValue("name");
    }
    else
    {
        var unititem = oband.Tree.WebTree.get_selectedNode().GetParentNode().Text;            
    }
    strcertify = unititem;
    var xmldoc=document.UnitItem.ParamXmldoc;
    ToolUtil.setParamValue(xmldoc, "certify", strcertify, "", "P", "", "T");
    if(!ue_save("")) return;
    var result = confirm("是否更新模板文件，确认吗？");
    if(!result) return;                    
    _xmlsave();
}

function _xmlsave()
{
    var oband=$band("itemtree");
    if(oband.getFldStrValue("ntype")=="BusinessSource"){alert("请保存指定的项目！");return;}                
    if(oband.getFldStrValue("ntype")=="UnitItem")
        var unititem = oband.getFldStrValue("name");
    else
        var unititem = oband.Tree.WebTree.get_selectedNode().GetParentNode().Text;
    var xmlhttp = CreateHTTP();
    xmlhttp.open("POST",ue_path()+"/sysxml.aspx?unititem="+unititem,false);
    xmlhttp.send(null);
    var xmldb = xmlhttp.responseXML.documentElement; 
    if(xmldb==null) return;
    if(xmldb.selectNodes("//table").length==0){alert("未设置系统数据库！");return;}
    alert(xmldb.selectNodes("//table")[0].text);
}

function mygetfields()
{
    var tmps = _xmlflds();
    Acbo(tmps);
}

function _xmlflds()
{
    var oband=$band("itemtree");
    if(oband.getFldStrValue("ntype")!="Item"){return;}
    var dataitem = $band("items").getFldStrValue("dataitem");
    unititem = oband.Tree.WebTree.get_selectedNode().GetParentNode().Text;
    if(unititem=="" || datafile=="" || dataitem=="") return;
    var datafile = oband.getValByBandKey("ID",oband.getFldStrValue("PID"),"datasrcfile");
    var xmlhttp = CreateHTTP();
    xmlhttp.open("POST",ue_path()+"/sysxml.aspx?datafile="+datafile+"&dataitem="+dataitem,false);
    xmlhttp.send(null);
    var xmldb = xmlhttp.responseXML.documentElement; if(!xmldb) return;
    var xnode = xmldb.selectSingleNode("//data");
    if(!xnode) return;
    var xstructs =xnode.text.split(";");
    return xstructs[0].split(",");
}
//------------------------- DIV定位函数 ------------------------//
    function getAbsolutePosition(obj)
    {
    position = new Object();
    position.x = 0;
    position.y = 0;
    var tempobj = obj;
        while(tempobj!=null && tempobj!=document.body)
        {
            if(window.navigator.userAgent.indexOf("MSIE")!=-1)
            {
                position.x += tempobj.offsetLeft+10;
                position.y += tempobj.offsetTop+15;
            }
            else if(window.navigator.userAgent.indexOf("Firefox")!=-1)
            {
                position.x += tempobj.offsetLeft;
                position.y += tempobj.offsetTop;
            }
            tempobj = tempobj.offsetParent
        }
    return position;
    }            
//可用于IE和Firefox浏览器获取绝对位置。然后设置div或者其他控件的位置于该控件上,注意:被定位的层必须是style="position:absolute"

function SetnPos(obj,objdest)
{
    var pos=getAbsolutePosition(obj);
    objdest.style.left=pos.x+"px";
    objdest.style.top=pos.y+"px";
}

/*
Html精确定位,ScrollHeight等介绍:
scrollHeight: 获取对象的滚动高度。 
scrollLeft:设置或获取位于对象左边界和窗口中目前可见内容的最左端之间的距离
scrollTop:设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离
scrollWidth:获取对象的滚动宽度
offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度
offsetLeft:获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置
offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置 
event.clientX 相对文档的水平座标
event.clientY 相对文档的垂直座标
event.offsetX 相对容器的水平坐标
event.offsetY 相对容器的垂直坐标 
document.documentElement.scrollTop 垂直方向滚动的值
event.clientX+document.documentElement.scrollTop 相对文档的水平座标+垂直方向滚动的量 
*/
            