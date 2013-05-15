var minRubberBandSide = 0;
var showContextMenu = true;
var posStack = new Array; // saved positions for zooming out
var iszoom=false;
var iframe_x=0,iframe_y=0;
var cursorStyle = "default";
var oldcolor="";
var oldval="";

function zoomInit()
{
	iszoom=true;
	saveOriginalSizes ("group")
	with (document.body) 
	{
		onclick = _onclick;
		ondblclick = _ondblclick;
		onmouseup = _onmousedown;
		oncontextmenu = _oncontextmenu;
		onbeforeprint = _onbeforeprint;
		onafterprint = _onafterprint;
		onmousemove = _onmousemove;
		onkeydown = _onkeydown;
	}
	cursorStyle = "crosshair";
	document.body.style.cursor = cursorStyle;
}

// move map
var dragapproved=false;
var x=y=0;
function move()
 {
    if(event.button==1 && dragapproved){
      var sx=event.clientX-x;
	  var sy=event.clientY-y;
      x=event.clientX;
      y=event.clientY;	  
	  self.scrollBy(-sx,-sy);
    }
    return false
 }
 
 function mapmove()
 {
	//restorePosition (posStack);
	iszoom=false;

//	saveOriginalSizes ("group")
	with (document.body) 
	{
		onclick = "";
		ondblclick = "";
		onmouseup = "";
		oncontextmenu = "";
		onbeforeprint = "";
		onafterprint = "";
		onmousemove = "";
		onkeydown = "";
	}
	cursorStyle = "hand";
	document.body.style.cursor = cursorStyle;


	document.onselectstart=new Function("self.event.returnValue=false");
	document.onmousedown=drags; 
 }
 
 
 function selectobject(obj)
 {
	oldcolor = obj.fillcolor;
	obj.fillcolor="red";	
 }
 

 function openarea(areaname)
 {
	var obj = document.getElementById('obody');
	var objselect = this.parent.document.getElementById('objselect');
	
	switch(areaname){
	case "绍兴县":
		if(document.getElementById('obodySXX'))
		{
			obj.style.display="none";
			document.body.bgcolor="#ced384";
			document.getElementById('obodySXX').style.display="";
			//alert(xc);
			objselect.value = areaname;
			if(document.getElementById('obodySYS')) document.getElementById('obodySYS').style.display="none";
			if(document.getElementById('obodyZJS')) document.getElementById('obodyZJS').style.display="none";
			if(document.getElementById('obodyXCX')) document.getElementById('obodyXCX').style.display="none";
			if(document.getElementById('obodySZS')) document.getElementById('obodySZS').style.display="none";
			oldval = objselect.value;
		}
		else objselect.value = oldval;
		break;
	case "上虞市":
		if(document.getElementById('obodySYS'))
		{
			obj.style.display="none";
			document.getElementById('obodySYS').style.display="";
			objselect.value = areaname;
			if(document.getElementById('obodySXX')) document.getElementById('obodySXX').style.display="none";
			if(document.getElementById('obodyZJS')) document.getElementById('obodyZJS').style.display="none";
			if(document.getElementById('obodyXCX')) document.getElementById('obodyXCX').style.display="none";
			if(document.getElementById('obodySZS')) document.getElementById('obodySZS').style.display="none";
			oldval = objselect.value;
		}
		else objselect.value = oldval;
		break;	
	case "诸暨市":
		if(document.getElementById('obodyZJS'))
		{
			obj.style.display="none";
			document.getElementById('obodyZJS').style.display="";
			objselect.value = areaname;
			if(document.getElementById('obodySXX')) document.getElementById('obodySXX').style.display="none";
			if(document.getElementById('obodySYS')) document.getElementById('obodySYS').style.display="none";
			if(document.getElementById('obodyXCX')) document.getElementById('obodyXCX').style.display="none";
			if(document.getElementById('obodySZS')) document.getElementById('obodySZS').style.display="none";
			oldval = objselect.value;
		}
		else objselect.value = oldval;
		break;
	case "新昌县":
		if(document.getElementById('obodyXCX')) 
		{
			obj.style.display="none";
			document.getElementById('obodyXCX').style.display="";
			objselect.value = areaname;
			if(document.getElementById('obodySXX')) document.getElementById('obodySXX').style.display="none";
			if(document.getElementById('obodySYS')) document.getElementById('obodySYS').style.display="none";
			if(document.getElementById('obodyZJS')) document.getElementById('obodyZJS').style.display="none";
			if(document.getElementById('obodySZS')) document.getElementById('obodySZS').style.display="none";	
			oldval = objselect.value;		
		}
		else objselect.value = oldval;
		break;
	case "嵊州市":
		if(document.getElementById('obodySZS'))
		{
			obj.style.display="none";
			document.getElementById('obodySZS').style.display="";
			objselect.value = areaname;
			if(document.getElementById('obodySXX')) document.getElementById('obodySXX').style.display="none";
			if(document.getElementById('obodySYS')) document.getElementById('obodySYS').style.display="none";
			if(document.getElementById('obodyZJS')) document.getElementById('obodyZJS').style.display="none";
			if(document.getElementById('obodyXCX')) document.getElementById('obodyXCX').style.display="none";	
			oldval = objselect.value;		
		}
		else objselect.value = oldval;
		break;
	default:
		obj.style.display="block";
		oldval = objselect.value;
		if(document.getElementById('obodySXX')) document.getElementById('obodySXX').style.display="none";
		if(document.getElementById('obodySYS')) document.getElementById('obodySYS').style.display="none";
		if(document.getElementById('obodyZJS')) document.getElementById('obodyZJS').style.display="none";
		if(document.getElementById('obodyXCX')) document.getElementById('obodyXCX').style.display="none";
		if(document.getElementById('obodySZS')) document.getElementById('obodySZS').style.display="none";		
		break;
	}
	//this.parent.document.getElementById('hinttext').value 
	this.parent.document.getElementById('hinttext').innerText= objselect.value+"地图：";
 }
 
 function restorecolor(obj,strcolor)
 {
	obj.fillcolor=strcolor;	
 }
  
 
function drags()
{
	if(event.button!=1) return
	dragapproved=true;
	x=event.clientX;
	y=event.clientY;
	document.onmousemove=move;
}

 // end

function init1()
{
	saveOriginalSizes ("group")
	//zoomObjectsToWindow ("group");
	with (document.body) {
	onclick = _onclick;
	ondblclick = _ondblclick;
	onmouseup = _onmousedown;
	oncontextmenu = _oncontextmenu;
	onbeforeprint = _onbeforeprint;
	onafterprint = _onafterprint;
	onmousemove = _onmousemove;
	onkeydown = _onkeydown;
}
createRubberRect();
rubberBandOff ();
}

function restoreOrg ()
{
	restorePosition (posStack);
	iszoom=false;
//	saveOriginalSizes ("group")
	with (document.body) 
	{
		onclick = "";
		ondblclick = "";
		onmouseup = "";
		oncontextmenu = "";
		onbeforeprint = "";
		onafterprint = "";
		onmousemove = "";
		onkeydown = "";
	}
	cursorStyle = "default";
	document.body.style.cursor = cursorStyle;
//	createRubberRect();
//	rubberBandOff ();
}

function init()
{
    if(!parent.document.UnitItem)
        return;
    document.IsLoaded=true;
	saveOriginalSizes ("group")
	//zoomObjectsToWindow ("group");
	document.body.style.cursor = "default";
	createRubberRect();
	rubberBandOff ();
	//var objselect = this.parent.document.getElementById('objselect');
	//oldval = objselect.value;
	with (document.body) 
	{
		onclick = "";
		ondblclick = "";
		onmouseup = "";
		oncontextmenu = "";
		onbeforeprint = "";
		onafterprint = "";
		onmousemove = "";
		onkeydown = "";
	}
	
	createHint();
	//createChart();
	//createmenu();	
}

function createHint()
{

    var band=parent.document.UnitItem.Bands[0];
    if(!band)   return;
    var rowcount=band.RecordCount();
    var xmlColList=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name and @bartitle]");
    for(var i=0;i<rowcount;i++)
    {
        var addressName=band.getFldStrValue("地名",i);
        var refAdd=document.getElementById(addressName);
        
        if(!refAdd || ""==refAdd)   continue;
        
        var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='指标']");
		var bartitle  = xmlCol.getAttribute("bartitle");
		bartitle = bartitle.replace("tfldname",addressName);
		bartitle = bartitle.replace("fldname","指标");
		//bartitle = bartitle.replace("<br>","&#10;&#13;");
		bartitle = bartitle.replace("fldval",band.getFldStrValue("指标",i));
		var xstate = band.getFldStrValue("故障",i);
		if(xstate=="1"){
		    refAdd.fillcolor="red";
		    //alert(xxx);
		    refAdd.itemcolor="red";
		    refAdd.fontcolor="black";
		    //var xfont=document.getElementById(addressName+"_font");
		    //if(xfont)
		        //xfont.style.color="yellow";
		}
		
        refAdd.title=bartitle;
        var xleft = refAdd.style.posLeft + refAdd.style.posWidth/2 -15;
		var xtop  = refAdd.style.posTop + refAdd.style.posHeight;
		var obj_zIndex = refAdd.style.zIndex;
		//alert(xxx);
		create_text(band.getFldStrValue("指标",i),xleft,xtop,12,obj_zIndex);
		return;
		
		for(var k=0;k<xmlColList.length;k++)
		{
		    var colname=xmlColList[k].getAttribute("name");
		    if("指标"==colname)     continue;
		    var xmlCol=xmlColList[k];
		    var dbtype=parent.ToolUtil.tranDBType(xmlCol.getAttribute("type"));
		    var xval=band.getFldStrValue(colname,i);
		    if("string"==dbtype || "datetime"==dbtype || "bool"==dbtype)
		        continue;
		    if("int"==dbtype)
		        xval=parent.ToolUtil.Convert(band.getFldStrValue(colname,i),"int");
		    else
		        xval=Math.round(parent.ToolUtil.Convert(band.getFldStrValue(colname,i),"decimal")*1000)/1000;
			var barheight = xmlCol.getAttribute("barheight");
			var barwidth  = xmlCol.getAttribute("barwidth");
			var barcolor  = xmlCol.getAttribute("barcolor");
			var bartitle  = xmlCol.getAttribute("bartitle");
			var format  = xmlCol.getAttribute("format");
			if(!barheight || ""==barheight)
			    barheight=50;
			if(!barwidth || ""==barwidth)
			    barwidth=20;
			if(!barcolor || ""==barcolor)
			    barcolor="#ff19ff";
			if(!bartitle || ""==bartitle)
			    bartitle="地点："+addressName +"<br> 指标："+ colname+"<br> 数值："+xval;
			if(!format)
			    format="";
			    
			bartitle = bartitle.replace("tfldname",addressName);
			bartitle = bartitle.replace("fldname",colname);
			bartitle = bartitle.replace("fldval",xval);
			
			//提示中包含其他字段值的也替换:如:@净销售量
			var xmlFldList=band.XmlSchema.XMLDocument.selectNodes("//xs:element");
		    for(var ik=0;ik<xmlFldList.length;ik++)
		    {
		        var strfldname=xmlFldList[ik].getAttribute("name");
		        bartitle = bartitle.replace("@"+strfldname,band.getFldStrValue(strfldname,i));
			}
			//column属性,柱子的标准高度
			var obj=addressNew;
			if(!xmlCol.maxval)
			    xmlCol.setAttribute("maxval",getmax(band.XmlLandData,colname));
			var maxval=parent.ToolUtil.Convert(xmlCol.getAttribute("maxval"),"int");
			var vheight = xval * barheight/maxval;
			var xleft = addressNew.style.posLeft- parseInt(baroffsetx) -i*parseInt(barstep);
			var xtop  = addressNew.style.posTop - vheight + parseInt(baroffsety);
			create_chartColumn(bartitle,xval,xleft,xtop,vheight,barwidth,obj.style.zIndex,barcolor);
		}
    }
}

function createmenu()
{
	var eleXMLList=window.parent.document.getElementsByTagName("XML");
	var xmldocData=null;var xmldocConf=null;
	for(var i=0;i<eleXMLList.length;i++)
	{
		var xmldoc=eleXMLList[i].XMLDocument;
		if(!xmldoc) return;
		if(!xmldoc.documentElement)		continue;
		if(eleXMLList[i].typexml && "Data"==eleXMLList[i].typexml)
		{
			xmldocData=xmldoc;
		}
		if(eleXMLList[i].typexml && "ConfProperty"==eleXMLList[i].typexml)
			xmldocConf=xmldoc;
	}
	//根据配置挂弹出菜单
	if(!xmldocConf || !xmldocData)		return;
	var appendItemList=xmldocConf.selectNodes("//AppendItem");
	if(appendItemList.length<1)		return;
	var menu=new popupmenu("menuID1");
	menu.Logo.SetImg("Images/menu.gif");
	var appendItemBusiness=xmldocConf.selectNodes("//AppendItem[@unitgroup='业务']");
	for(var i=0;i<appendItemBusiness.length;i++)
	{
		var text=appendItemBusiness[i].attributes.getNamedItem("name").value;
		menu.MenuItemList.AddItem(text,funTest);
	}
	var appendItemReport=xmldocConf.selectNodes("//AppendItem[@unitgroup='报表']");
	if(appendItemBusiness.length>0 && appendItemReport.length>0)
		menu.MenuItemList.AddItem("-",null);
	for(var i=0;i<appendItemReport.length;i++)
	{
		var text=appendItemReport[i].attributes.getNamedItem("name").value;
		menu.MenuItemList.AddItem(text,funTest);
	}
	//设置锚定控件
	if(appendItemBusiness.length<1 && appendItemReport.length<1)
		return;
	var dockCtrlNames=xmldocData.selectNodes("//单位");
	for(var i=0;i<dockCtrlNames.length;i++)
	{
		var ctrl=document.getElementById(dockCtrlNames[i].text+"_0");
		if(!ctrl)	continue;
		menu.SetDock(ctrl);
	}
	menu.hide();
	/*
	menu.Logo.SetImg("Images/menu.gif");
	menu.MenuItemList.AddItem("区域名称",funTest);
	menu.MenuItemList.AddItem("-",null);
	menu.MenuItemList.AddItem("测试1",null);
	menu.MenuItemList.AddItem("测试2",null);
	menu.MenuItemList.AddItem("测试3",null);
	menu.SetDock(document.getElementById('map_sxx'));
	menu.SetDock(document.getElementById('map_sys'));
	menu.hide();
	*/
}

function  funTest()
{
	//得到当前菜单对象
	var item=arguments[0];
	//得到触发弹出菜单的对象
	var dockEle=item.PopupMenu.DockElement;
	var eleXMLList=window.parent.document.getElementsByTagName("XML");
	var xmldocData=null;var xmldocConf=null;
	for(var i=0;i<eleXMLList.length;i++)
	{
		var xmldoc=eleXMLList[i].XMLDocument;
		if(!xmldoc.documentElement)		continue;
		if(eleXMLList[i].typexml && "Data"==eleXMLList[i].typexml)
			xmldocData=xmldoc;
		if(eleXMLList[i].typexml && "ConfProperty"==eleXMLList[i].typexml)
			xmldocConf=xmldoc;
	}
	//根据字段找到对应数据行,根据菜单文本值找到配置节点AppendItem
	if(!xmldocData || !xmldocConf)
		return;
	var strdw=dockEle.id.substr(0,dockEle.id.lastIndexOf("_"));
	var xmlNodeData=xmldocData.selectSingleNode("//单位[text()='"+strdw+"']");
	if(!xmlNodeData)	return;
	xmlNodeData=xmlNodeData.parentNode;
	var xmlNodeConf=xmldocConf.selectSingleNode("//AppendItem[@name='"+item.Text+"']");
	if(!xmlNodeConf)	return;
	var topFrame=window.parent.usGetTopFrame();
	topFrame.ResetTransParam();
	window.parent.usSetXmlNodeTransParam(xmlNodeData);	//设置传输参数
	topFrame.SetTransParam("appenditem",item.Text);
	topFrame.OpenNewWin("appenditem");
	topFrame.ResetTransParam();
	
}

function zoombase()
{
 	group1.coordsize=1000+","+680;
}

function createRubberRect()
{
	var rubberBand = document.body.appendChild(document.createElement
	('<v:rect class="keshi" id="oRubberBand" style="DISPLAY: none; Z-INDEX: 5000; POSITION: absolute"	coordsize="0,0" fillcolor="#eee"/>'));
	rubberBand.stroke.dashstyle="dashDot";
	rubberBand.fill.opacity=".2";
}

function _onbeforeprint ()
// Temporarilly restore original sizes for printing
{
	var groups = document.body.getElementsByTagName ("group");
	var e = new Enumerator (groups);
	for (; !e.atEnd (); e.moveNext () ) {
	var g = e.item ();
	g.setAttribute ("savedPosWidth", g.style.posWidth);
	g.setAttribute ("savedPosHeight", g.style.posHeight);
	g.style.posWidth = g.originalPosWidth;
	g.style.posHeight = g.originalPosHeight;
}
}

function _onafterprint ()
{
	var groups = document.body.getElementsByTagName ("group");
	var e = new Enumerator (groups);
	for (; !e.atEnd (); e.moveNext () ) {
	var g = e.item ();
	g.style.posWidth = g.savedPosWidth;
	g.style.posHeight = g.savedPosHeight;
	}
}

function _oncontextmenu ()
{
	result = showContextMenu;
	showContextMenu = true;
	return result;
}

function _onmousedown ()
{
	if (window.event.button == 2 && 
		window.event.clientX < document.body.clientWidth && 
		window.event.clientY < document.body.clientHeight) 
	{
		showContextMenu = false;
		if (oRubberBand.on) 
		{
			rubberBandOff ();
		}
		else 
		{
			if (posStack.length) restorePosition (posStack);
		}
	}
	window.status  = "点击两点: 放大 | 右击: 取消放大 | 双击: 适应窗口 | Alt + 双击: 实际尺寸 ";
}




function _onkeydown ()
{
	if (oRubberBand.on) rubberBandOff ();
}

function _onclick () 
{
	if (oRubberBand.on) {
	var attachedTo = oRubberBand.attachedTo;
	savePosition (attachedTo, posStack);
	// zoom 
	rubberBandOff ();
	zoomObjectTo (attachedTo, oRubberBand.offsetLeft, oRubberBand.offsetTop, oRubberBand.offsetLeft + oRubberBand.style.pixelWidth, oRubberBand.offsetTop + oRubberBand.style.pixelHeight);
	oRubberBand.setAttribute ("attachedTo", null);
	}
	else if (window.event.clientX < document.body.clientWidth && window.event.clientY < document.body.clientHeight) {
	var eventOffs = absOffsetsEvent (window.event);
	var selectedGroup = getObjectContainingPoint (eventOffs.offsetLeft, eventOffs.offsetTop, "group");
	if (selectedGroup) {
	oRubberBand.setAttribute ("click1X", eventOffs.offsetLeft);
	oRubberBand.setAttribute ("click1Y", eventOffs.offsetTop);
	oRubberBand.setAttribute ("attachedTo", selectedGroup);
	oRubberBand.style.left = eventOffs.offsetLeft;
	oRubberBand.style.top = eventOffs.offsetTop;
	oRubberBand.style.width = oRubberBand.style.height = minRubberBandSide;
	rubberBandOn ();
	}
	}
	window.status  = "点击两点: 放大 | 右击: 取消放大 | 双击: 适应窗口 | Alt + 双击: 实际尺寸 ";
}

function savePosition (target, stack)
{
	saved = new Object;
	saved.target = target;
	saved.pixelWidth = target.style.pixelWidth;
	saved.pixelHeight = target.style.pixelHeight;
	saved.centerOffsX = document.body.scrollLeft - target.offsetLeft + document.body.clientWidth / 2;
	saved.centerOffsY = document.body.scrollTop - target.offsetTop + document.body.clientHeight / 2;
	stack[stack.length] = saved;
}

function restorePosition (stack) 
{
	if (stack.length) {
	var restoreTo = posStack[posStack.length - 1];
	if (restoreTo.target) {
	with (restoreTo) {
	target.style.pixelWidth = pixelWidth;
	target.style.pixelHeight = pixelHeight;
	window.scrollTo (target.offsetLeft + centerOffsX - document.body.clientWidth / 2, target.offsetTop + centerOffsY - document.body.clientHeight / 2);
	}
	}
	stack[length - 1] = 0; stack.length--; // JScript 5.0
	}
}

function saveOriginalSizes (tagName)
{
	var groups = document.body.getElementsByTagName (tagName);
	var e = new Enumerator (groups);
	for (; !e.atEnd (); e.moveNext () ) {
	var g = e.item ();
	if (!g.getAttribute ("originalPosWidth") ) {
	g.setAttribute ("originalPosWidth", g.style.posWidth);
	g.setAttribute ("originalPosHeight", g.style.posHeight);
	}
	}
}

function _ondblclick ()
{
	rubberBandOff ();
	if (window.event.clientX < document.body.clientWidth && window.event.clientY < document.body.clientHeight) {
	var eventOffs = absOffsetsEvent (window.event);
	var selectedGroup = getObjectContainingPoint (eventOffs.offsetLeft, eventOffs.offsetTop, "group");
	if (selectedGroup) {
	if (window.event.altKey) {
	selectedGroup.style.posWidth = selectedGroup.originalPosWidth;
	selectedGroup.style.posHeight = selectedGroup.originalPosHeight;
	window.scrollTo (selectedGroup.offsetLeft, selectedGroup.offsetTop);
	}
	else {
	zoomObjectTo (selectedGroup, selectedGroup.offsetLeft, selectedGroup.offsetTop, selectedGroup.offsetLeft + selectedGroup.offsetWidth, selectedGroup.offsetTop + selectedGroup.offsetHeight);
	}
	for (x in posStack) delete x;
	posStack.length = 0;
	}
	}
}

function zoomObjectsToWindow (tagName)
{
	var objects = document.body.getElementsByTagName (tagName);
	var e = new Enumerator (objects);
	for (; !e.atEnd (); e.moveNext () ) 
	{
		var i = e.item ();
		i.style.pixelWidth = i.style.pixelWidth; // workaround: ensures offsetWidth is updated
		i.style.pixelHeight = i.style.pixelHeight;
		zoomObjectTo (i, i.offsetLeft, i.offsetTop, i.offsetLeft + i.offsetWidth-500, i.offsetTop + i.offsetHeight-340);
	}
}

function rubberBandOn ()
{
	document.body.setCapture ();
	oRubberBand.on = true;
	oRubberBand.style.display = "block";
}

function rubberBandOff ()
{
	document.body.releaseCapture ();
	oRubberBand.on = false;
	if(!oRubberBand.style) return;
	oRubberBand.style.display = "none";
}

function _onmousemove ()
{
	if (oRubberBand.on) 
	{
		var offs = absOffsetsEvent (window.event);
		var x0, y0, x1, y1; // new rubberband rectangle

		var delX = offs.offsetLeft - oRubberBand.click1X;
		if (delX > 0) 
		{
			x0 = oRubberBand.click1X;
			x1 = x0 + (delX > minRubberBandSide ? delX : minRubberBandSide);
		}
		else 
		{
			x0 = oRubberBand.click1X + delX;
			x1 = x0 + (-delX > minRubberBandSide ? -delX : minRubberBandSide);
		}
		var delY = offs.offsetTop - oRubberBand.click1Y;
		if (delY > 0) 
		{
			y0 = oRubberBand.click1Y;
			y1 = y0 + (delY > minRubberBandSide ? delY : minRubberBandSide);
		}
		else 
		{
			y0 = oRubberBand.click1Y + delY;
			y1 = y0 + (-delY > minRubberBandSide ? -delY : minRubberBandSide);
		}
		var tOffs = absOffsets (oRubberBand.attachedTo);
		x0 = Math.max (x0, tOffs.offsetLeft); 
		y0 = Math.max (y0, tOffs.offsetTop);
		x1 = Math.min (x1, tOffs.offsetLeft + oRubberBand.attachedTo.offsetWidth);
		y1 = Math.min (y1, tOffs.offsetTop + oRubberBand.attachedTo.offsetHeight);
		oRubberBand.style.left = x0; oRubberBand.style.width = x1 - x0;
		oRubberBand.style.top = y0; oRubberBand.style.height = y1 - y0;
	}

	var cursorStyle = "auto";
	var status = "";
	if (window.event.clientX < document.body.clientWidth && window.event.clientY < document.body.clientHeight) 
	{
		var eventOffs = absOffsetsEvent(window.event);
		if (getObjectContainingPoint (eventOffs.offsetLeft, eventOffs.offsetTop, "group") ) 
		{
			cursorStyle = "crosshair";
			//if(x1)	status = "点击两点: 放大 | 右击: 取消放大 | 双击: 适应窗口 | Alt + 双击: 实际尺寸   座标位置(X=" + x1 +"，Y="+y1+")";
			//else 
			status = "点击两点: 放大 | 右击: 取消放大 | 双击: 适应窗口 | Alt + 双击: 实际尺寸   座标位置(X=" + eventOffs.offsetLeft +"，Y="+eventOffs.offsetTop+")";
		}
	}
	else
		status = "点击两点: 放大 | 右击: 取消放大 | 双击: 适应窗口 | Alt + 双击: 实际尺寸";
	//document.body.style.cursor = cursorStyle;
	window.status = status;
}


function zoomObjectTo (object, x0, y0, x1, y1)
{
	var sgOffs = absOffsets (object);
	
	var relX = ( (x0 + x1) / 2 - sgOffs.offsetLeft) / object.offsetWidth;
	var relY = ( (y0 + y1) / 2 - sgOffs.offsetTop) / object.offsetHeight;

	var zoomAspectRatio = (x1 - x0) / (y1 - y0);
	var clientAspectRatio = document.body.clientWidth / document.body.clientHeight;
	var scaleBy = (zoomAspectRatio > clientAspectRatio) 
	? (document.body.clientWidth / (x1 - x0) ) : (document.body.clientHeight / (y1 - y0) );
	

	scaleObject (object, scaleBy);
	var sgOffs = absOffsets (object); // calculate again in case object has moved
	window.scrollTo (
	sgOffs.offsetLeft + relX * object.offsetWidth - document.body.clientWidth / 2, 
	sgOffs.offsetTop + relY * object.offsetHeight - document.body.clientHeight / 2
	);
}

function absOffsetsEvent (event)
{
	var result = new Object;
	result.offsetLeft = event.offsetX-iframe_x;
	result.offsetTop = event.offsetY-iframe_y;
	var offs = absOffsets (window.event.srcElement);
	result.offsetLeft += offs.offsetLeft;
	result.offsetTop += offs.offsetTop;
	return result;
}

function absOffsets (object)
// returns absolute position of `object' on the page
{
	var current = object;
	var result = new Object;
	result.offsetLeft = current.offsetLeft;
	result.offsetTop = current.offsetTop;
	while (current.offsetParent) {
	current = current.offsetParent;
	result.offsetLeft += current.offsetLeft;
	result.offsetTop += current.offsetTop;
	}
	return result;
}

function scaleObject (object, scaleBy)
{
	if (object.getAttribute ("aspectRatio") == null) {
	object.setAttribute ("aspectRatio", object.style.posWidth / object.style.posHeight);
	}
	object.style.pixelWidth = object.style.pixelWidth * scaleBy; // + "px";
	object.style.pixelHeight = object.style.pixelWidth / object.aspectRatio;
}


// returns the first object denoted by `tagName' that contains the point (x, y),
// or null if there is no such object.
function getObjectContainingPoint (x, y, tagName)
{
	var result = null;
	var objects = document.body.getElementsByTagName (tagName);
	var e = new Enumerator (objects);
	for (; !e.atEnd (); e.moveNext () ) {
	var i = e.item ();
	var offs = absOffsets (i);
	if (x >= offs.offsetLeft && x < offs.offsetLeft + i.offsetWidth && y >= offs.offsetTop && y < offs.offsetTop + i.offsetHeight) {
	result = i;
	break;
	}
	}
	return result;
}


function create_chartColumn(valname,val,vleft, vtop, vheight, vwidth,obj_zIndex,barcolor)
{
	var grpObj = document.getElementById("group");	
	var fcolor = "#FFFFFF";
	if(barcolor=="yellow") 	fcolor = "red";
	js = '<v:rect id="rectsxx_0" '+ 'onmouseover="this.fillcolor=\''+fcolor+'\'"' + 'onmouseout="this.fillcolor=\''+barcolor+'\'"' +
		'style="Z-INDEX:'+obj_zIndex+' ;LEFT:'+ vleft +'px;WIDTH:'+ vwidth +'px;TOP:'+vtop+'px;HEIGHT:'+vheight+'px" coordsize="21600,21600" fillcolor="'+barcolor+'">';
	var chartobj = grpObj.appendChild(document.createElement(js));
		chartobj.fill.color2=barcolor;//"#ff19ff";
		chartobj.fill.type="gradient"
		chartobj.stroke.color = barcolor;//"#ff19ff";
		chartobj.title = valname;	
	var xd = chartobj.appendChild(document.createElement('<v:Extrusion>'));		
		xd.color = barcolor;//"#ff19ff";
		xd.backdepth="6pt";
		xd.on="true";
		xd.ext="view";
	//create_text(val,vleft-5,vtop-20,12,obj_zIndex);
}

function create_text(val,vleft, vtop, vsize,obj_zIndex)
{
	var grpObj = document.getElementById("group1");	
	var oshape = grpObj.appendChild(document.createElement('<v:shape style="Z-INDEX:'+obj_zIndex+';LEFT:'+ vleft +'px;WIDTH:60px;TOP:'+ vtop +'px;HEIGHT:20px" inset="1px,1px,1px,1px" coordsize="1000,680"  filled="f" >'));
	var oText = oshape.appendChild(document.createElement('<DIV style="font-family: Microsoft Sans Serif;FONT-SIZE: 7.8pt; CURSOR: hand; COLOR: black; TEXT-ALIGN: left">'));
 	oText.innerText=val;
}
//创建地址锚定点:band段要包含字段:地名,指标,参考点,X,Y
function createAddress()
{
//alert(xxx);
    var addressMark="<v:oval fillcolor='#fcfd2a' style='width:10;height:10;' strokecolor='#fcfd2a' strokeweight='0' />";
    var band=parent.document.UnitItem.Bands[0];
    if(!band)   return;
    var rowcount=band.RecordCount();
    var xmlColList=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name and @bartitle]");
	var baroffsetx = band.XmlConfig.getAttribute("baroffsetx");  // 柱状图距中心参照点左偏移量
	var baroffsety = band.XmlConfig.getAttribute("baroffsety");  // 柱状图距中心参照点上偏移量
	var barstep    = band.XmlConfig.getAttribute("barstep");     // 柱状图间的横向间隔
    for(var i=0;i<rowcount;i++)
    {
        var addressName=band.getFldStrValue("地名",i);
        var refAdd=document.getElementById(band.getFldStrValue("参考点",i));
        if(!refAdd || ""==refAdd)   continue;
        var offsetX=parent.ToolUtil.Convert(band.getFldStrValue("X",i),"int");
        var offsetY=parent.ToolUtil.Convert(band.getFldStrValue("Y",i),"int");
        var addressNew=document.createElement(addressMark);
        refAdd.parentElement.appendChild(addressNew);
        addressNew.style.left=refAdd.style.posLeft+offsetX;
        addressNew.style.top=refAdd.style.posTop+offsetY;
        addressNew.style.zIndex=refAdd.style.zIndex;
        
        var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='指标']");
		var bartitle  = xmlCol.getAttribute("bartitle");
		bartitle = bartitle.replace("tfldname",addressName);
		bartitle = bartitle.replace("fldname","指标");
		bartitle = bartitle.replace("fldval",band.getFldStrValue("指标",i));
        addressNew.title=bartitle;
		
		for(var k=0;k<xmlColList.length;k++)
		{
		    var colname=xmlColList[k].getAttribute("name");
		    if("指标"==colname)     continue;
		    var xmlCol=xmlColList[k];
		    var dbtype=parent.ToolUtil.tranDBType(xmlCol.getAttribute("type"));
		    var xval=band.getFldStrValue(colname,i);
		    if("string"==dbtype || "datetime"==dbtype || "bool"==dbtype)
		        continue;
		    if("int"==dbtype)
		        xval=parent.ToolUtil.Convert(band.getFldStrValue(colname,i),"int");
		    else
		        xval=Math.round(parent.ToolUtil.Convert(band.getFldStrValue(colname,i),"decimal")*1000)/1000;
			var barheight = xmlCol.getAttribute("barheight");
			var barwidth  = xmlCol.getAttribute("barwidth");
			var barcolor  = xmlCol.getAttribute("barcolor");
			var bartitle  = xmlCol.getAttribute("bartitle");
			var format  = xmlCol.getAttribute("format");
			if(!barheight || ""==barheight)
			    barheight=50;
			if(!barwidth || ""==barwidth)
			    barwidth=20;
			if(!barcolor || ""==barcolor)
			    barcolor="#ff19ff";
			if(!bartitle || ""==bartitle)
			    bartitle="地点："+addressName +"<br> 指标："+ colname+"<br> 数值："+xval;
			if(!format)
			    format="";
			    
			bartitle = bartitle.replace("tfldname",addressName);
			bartitle = bartitle.replace("fldname",colname);
			bartitle = bartitle.replace("fldval",xval);
			
			//提示中包含其他字段值的也替换:如:@净销售量
			var xmlFldList=band.XmlSchema.XMLDocument.selectNodes("//xs:element");
		    for(var ik=0;ik<xmlFldList.length;ik++)
		    {
		        var strfldname=xmlFldList[ik].getAttribute("name");
		        bartitle = bartitle.replace("@"+strfldname,band.getFldStrValue(strfldname,i));
			}
			//column属性,柱子的标准高度
			var obj=addressNew;
			if(!xmlCol.maxval)
			    xmlCol.setAttribute("maxval",getmax(band.XmlLandData,colname));
			var maxval=parent.ToolUtil.Convert(xmlCol.getAttribute("maxval"),"int");
			var vheight = xval * barheight/maxval;
			var xleft = addressNew.style.posLeft- parseInt(baroffsetx) -i*parseInt(barstep);
			var xtop  = addressNew.style.posTop - vheight + parseInt(baroffsety);
			create_chartColumn(bartitle,xval,xleft,xtop,vheight,barwidth,obj.style.zIndex,barcolor);
		}
    }
}
function createChart()
{
    var band=parent.document.UnitItem.Bands[0];
	// 下列三个参数取自Item
	var baroffsetx = band.XmlConfig.getAttribute("baroffsetx");  // 柱状图距中心参照点左偏移量
	var baroffsety = band.XmlConfig.getAttribute("baroffsety");  // 柱状图距中心参照点上偏移量
	var barstep    = band.XmlConfig.getAttribute("barstep");     // 柱状图间的横向间隔
    
	var rs = band.XmlLandData.recordset;
	if(rs.RecordCount==0) return;
	//取最大值
	
	var vmax = new Array();
	for(var i=2;i<3;i++)
	{
		var xval = rs.Fields(i).Name;
		vmax[i-2] = getmax(band.XmlLandData,xval);
	}
	
    var xmlColList=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name and @bartitle]");
	rs.moveFirst();
	while(!rs.Eof)
	{
		var cityName = rs.Fields(0).Value;
		var obj = document.getElementById("beijing");
		if(obj!=null)
		{
			var obj_zIndex = obj.style.zIndex;
			for(var i=2;i<rs.Fields.Count-1;i++)
			{
			    //读取属性表，取出对应列及系统的BAR属性值
				var xval = rs.Fields(i).Value;
				//getColPry(rs.Fields(i).Name,itemnodelist);
				
				var barheight	= 50;
				var barwidth	= 20;
				var barcolor	= "#ff19ff";
				var bartitle	= "地点："+rs.Fields(0).Value +"<br> 指标："+ rs.Fields(i).Name+"<br> 数值："+xval;
				var format		="";
				var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+rs.Fields(i).Name+"']");
				barheight = xmlCol.getAttribute("barheight");
				barwidth  = xmlCol.getAttribute("barwidth");					
				barcolor  = xmlCol.getAttribute("barcolor");
				bartitle  = xmlCol.getAttribute("bartitle");
				
				bartitle = bartitle.replace("tfldname",rs.Fields(0).value);
				bartitle = bartitle.replace("fldname",rs.Fields(i).Name);
				bartitle = bartitle.replace("fldval",rs.Fields(i).value);
				
				format  = xmlCol.getAttribute("format");
				//column属性,柱子的标准高度
				var vheight = xval * barheight/vmax[i-2];
				var xleft = parseInt(obj.style.left)- parseInt(baroffsetx) -(i-2)*parseInt(barstep);
				var xtop  = parseInt(obj.style.top) - vheight + parseInt(baroffsety);
				create_chartColumn(bartitle,xval,xleft,xtop,vheight,barwidth,obj_zIndex,barcolor);
			}
		}
		rs.moveNext();
	}
}

function getColPry(fieldname,itemnodelist)
{
	var colpry = new Array();
	var colnode = itemnodelist[0].selectSingleNode("Column[@name='"+fieldname+"']");
	for(var i=0;i<colnode.attributes.length;i++)
	{
		var attribte = colnode.attributes[i].nodeName;
		switch(attribte)
		{
			case "barheight":
				colpry[0] = colnode.attributes[i].value;
				break;
			case "barwidth":
				colpry[1] = colnode.attributes[i].value;
			//	baroffsety="10";
				break;
			case "barcolor":
				colpry[2] = colnode.attributes[i].value;
				break;
			case "bartitle":
				colpry[3] = colnode.attributes[i].value;
				break;
			case "format":
				colpry[4] = colnode.attributes[i].value;
				break;
		}
	}
	return colpry;
}

function getmax(xmlIsland,strColName)
{
	var colNodeList=xmlIsland.selectNodes("//"+strColName);
	var maxval=0;
	for(var i=0;i<colNodeList.length;i++)
	{
		if(!colNodeList[i].text)continue;
		var val=new Number(colNodeList[i].text);
		if(val>maxval)  maxval=val;
	}
	return maxval;
}
