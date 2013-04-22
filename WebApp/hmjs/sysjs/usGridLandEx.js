
//gridName注册的控件名;  tabdiv Grid显示的容器; tabTpHTML模板字符串;  isCustom是否用户定制
//如果isCustom为true那么tabdiv内已经有需要显示的Grid，包括需要显示的列及其属性
//Grid对象gridName-名称,srcdiv-Grid容器
function BGrid(srcdiv,oband,type,minwidth)
{
    // 框架及表头
    if(!oband) {alert("数据错误,请检查！");return;};
    if(!minwidth) minwidth=60;
    var gridtop = 
        ["<div id='"+ srcdiv +"_GridDiv' style='height:100%;width:100%;'>"+
        "<table class='GridWB' cellpadding='0' cellSpacing='0' style='width:100%;height:100%' tabType='grid'>"+
        "  <tbody>"+
        "    <tr>"+
        "      <td divtype='body' colspan='4' valign='top'>"+
        "        <div divtype='title' align='left' class='ws'  style='overflow-x:auto;overflow-y:scroll;width:100%'>"+
        "          <table tabType='title' class='ctabTitle' cellpadding='0' cellSpacing='0'>"+
        "            <tbody>"];
    var cols = oband.Cols("1");
    //判断是否有Boolean类型的字段
    var blname = "";
    var strwidths;
    gridtop.push("<tr rowType='title'>");
    for(var j = 0; j < cols.length; j++)
    {
        var colitem     = oband.ColObj(cols[j]);
        if(colitem.width=="") colitem.width = minwidth;
        
        if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
        if(j==cols.length-1) colitem.width="";
        if(colitem.name=="RowNum") colitem.width="45px";
        if(colitem.width=="") _sw="";
        else _sw = " width="+ colitem.width;
        var colname = colitem.name;
        var coltitle = colitem.title;
        gridtop.push("<td align='center' height=22px colname='"+colname+"' class='cellwb_btn'"+ _sw +">" + coltitle +"</td>");
    }
    gridtop.push("</tr>"); 
    gridtop.push("<tbody></table></div>");
    // ---------------------------------------------------------------//
    var sdetail = "<div divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%' onscroll='GridUtil.usOnScrollHori();'>"
      +"<table width='100%' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0' onmousemove='GridUtil.usOnDetailMouseOverHandle();' onmouseout='GridUtil.usOnDetailMouseOutHandle();'>"
      +"<tbody>";
    gridtop.push(sdetail);
    var rnt = oband.RecordCount();
    for(var i = 0; i < rnt; i++)
    {
        gridtop.push("<tr rowType='detail'>");
        for(var j = 0; j < cols.length; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(colitem.width=="") colitem.width = minwidth;
            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(j==cols.length-1) colitem.width="";
            if(colitem.name=="RowNum") colitem.width="45px";
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;                    
            var colvalues="";
            var colxml="";
            colvalues = oband.getFldStrValue(colitem.name,i);
            if(colvalues=="") colvalues="　";
            var align="left";
            var strclass = "cellStyle";
            sdatatype = "datatype='" + colitem.datatype+"'";
            switch(colitem.datatype)
            {
                case "string":
                    if(colitem.datastyle.indexOf("link")>-1) 
                    {
                        colvalues="<a style='color: #804000' href='#' class='gridlink' target='_self' onclick='"+colitem.onclick+"'>"+colvalues+"</a>";
                        align="center";
                    }
                    break;
                case "boolean":
                    colvalues = '<input type="checkbox" id="chk'+i+'">';align="center";
                    break;
                default:
                    if(colitem.name=="RowNum") {align="center";strclass="cellwb_btn";sdatatype="";}
                    else {align="right";}
                    break;
            }
            var _id = oband.ItemName + colitem.name + "_" + i;
            var tdtext = "<td align='"+ align +"' colname='"+colitem.name+"' id='"+_id+"' class='"+ strclass +"'"+ _sw 
            +" onclick='GridUtil.usOnCellFocusHandle();' "+sdatatype+">"+ colvalues +"</td>";
            gridtop.push(tdtext);
        }
        gridtop.push("</tr>"); 
    }
    gridtop.push("</tbody></table></div></td></tr></tbody></table></div>"); 
    //srcdiv.outerHTML = gridtop.join("");   
    if(type=="out")
        document.getElementById(srcdiv).outerHTML = gridtop.join("");   
    else document.getElementById(srcdiv).innerHTML = gridtop.join("");   

    tabdiv = document.getElementById(srcdiv + "_GridDiv");
    if(!tabdiv)	return;
    
    this.GridDiv=tabdiv;	//Grid底板
    tabdiv.Grid=this;
    //把Grid加入document的访问列表中
    var gridList=document.GridList;
    var gridName = oband.ID;
    if(!gridName || ""==gridName)
	    if(!gridList)
		    gridName="Grid0";
	    else
		    gridName="Grid"+gridList.length;	
    //加入数组中
    if(!gridList)
    {
	    document.GridList=new Array();	
	    gridList=document.GridList;
    }
    var inullGrid=-1;	//在数组中为空的序号
    for(var i=0;i<gridList.length;i++)
    {
	    if(!gridList[i])
	    {	
		    inullGrid=i;continue;
	    }
	    if(gridName==gridList[i].gridName)
	    {
		    gridList[i].GridDiv=tabdiv;
		    inullGrid=gridList.length+1;
		    break;
	    }
    }	
    if(inullGrid<0)
	    gridList[gridList.length]=new function()
	    {
		    this.gridName=gridName;
		    this.GridDiv=tabdiv;
	    };
    else if(inullGrid<gridList.length)
	    gridList[inullGrid]=new function()
	    {
		    this.gridName=gridName;
		    this.GridDiv=tabdiv;
	    };
    this.Name=gridName;		//Grid的唯一名
    this.ItemName="";		//Grid的对应项目名称
    //滚动控制的控制,标题区,明细区,脚注区,功能区
    this.DivBody    =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
    this.DivDetail  =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
    this.DivTitle   =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");
    //标题、明细、脚注Table
    this.TabTitle   =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","title");
    this.Table      =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","detail");
    this.Cols = cols;
    this.Table.Grid     =   this;
    this.TabTitle.Grid  =   this;
    if(this.TabFoot) this.TabFoot.Grid=this;
    //数据岛属性
    this.XmlLand    = oband.XmlLandData;		//明细数据岛
    this.XmlChanged =null;          //删除的数据岛
    this.XmlSchema  =null;	        //明细数据结构数据岛
    this.XmlSum     =null;		    //汇总数据的数据岛
    this.XmlSumTemp =null;	        //汇总数据的临时数据岛
	this.Event=new function(){ this.rowIndex=-1;this.colName="";}
	this.AfterRowChanged=null;
	this.AfterCellEditChanged=null;
	this.AfterSum=null;
	this.AfterNewRecord=null;
	this.DbClickHandle=null;
	this.AfterSave=null;
	this.isimport=false;
	this.copyindex=null;

    this.actBgColor	= "#FFDF6B";
    this.actFacColor= "black";
	
    this.curBgColor= "#3A7B9C";
    this.curFacColor= "white";
	
    this.curOverBgColor="#E8E8E8";
    this.curOverFacColor="black";
	
    this.browseBgColor="white";
    this.browseFacColor="black";
	
    this.selBgColor="#00309C";
    this.selFacColor="white";
	
    this.borderColor="#ece9d8";

    this.warnFacColor="red";
    this.warnBgColor="#FCFCFC";
    this.curTd=null;
    this.curTr=null;
    this.RowSelectedList=new Array();
    this.Band=oband;
    this.ItemName=oband.ItemName;
    var tabheight  = tabdiv.offsetHeight;
    var tabtop     = tabdiv.offsetTop;
    var divh;
    
    if(tabdiv.style.height.indexOf("%")>-1)
    {
        var _h = tabheight - tabtop;
        if(_h>0)
        {
            if(tabtop>0)
                tabdiv.style.pixelHeight = tabheight - tabtop -4; 
            else
                tabdiv.style.pixelHeight = tabheight - tabtop; 
            _h = parseInt(tabdiv.style.height.replace("%",""));
            if(_h>100) h = _h/100+"%";
            else _h=_h+"%";
            divh = _h;
        }
    }
    if(this.DivBody.style.height.indexOf("%")<0)
        this.DivBody.style.height   =   tabdiv.style.height;

    if(this.DivDetail.style.height.indexOf("%")>-1)
    {
        _h = this.DivBody.offsetHeight-this.DivTitle.offsetHeight;
        if(_h>0)
        {
            this.DivDetail.style.pixelHeight = _h;
            var _height = parseInt(this.DivDetail.style.height.replace("%",""));
            if(_height>100)
                this.DivDetail.style.height = _height/100+"%";
        }
    }
}   

   //从xml文档生成浏览表格(不包含序号列,表格自动生成序号)
   // srcdiv - 源div,xmldata - 数据;tablename - 表格名，colnames - 列名字串;strwidths - 宽度字串;
   function AGrid(srcdiv,oband,tablename,type,colnames,minwidth)
   {
        // 框架及表头
        var xmldata = oband.data;
        if(!xmldata) {alert("数据错误,请检查！");return;};
        if(!minwidth) minwidth=60;
        var gridtop = 
            ["<div id='"+ srcdiv +"_GridDiv' style='height:100%;width:100%;'>"+
            "<table class='GridWB' cellpadding='0' cellSpacing='0' style='width:100%;height:100%' tabType='grid'>"+
            "  <tbody>"+
            "    <tr>"+
            "      <td id='"+ srcdiv +"_tdbody' divtype='body' colspan='4' valign='top'>"+
            "        <div id='"+ srcdiv +"_dvtitle' divtype='title' align='left' class='ws'  style='overflow-x:auto;overflow-y:scroll;width:100%'>"+
            "          <table tabType='title' class='ctabTitle' cellpadding='0' cellSpacing='0'>"+
            "            <tbody>"];
        var ncols     = xmldata.selectNodes("//xstructs/name");
        var arrcols;
        if(ncols.length>0) arrcols   = ncols[0].text.split(",");
        var datatypes;
        if(xmldata.selectNodes("//xstructs/datatype").length>0)
            datatypes = xmldata.selectNodes("//xstructs/datatype")[0].text.split(",");
        var cols;
        var strcols;
        var lens;
        var colids;
        if(colnames)
        {
            var tcols = colnames.split(";");
            if(tcols.length>1){
                cols = tcols[1].split(",");
            }
            else
                cols = tcols[0].split(",");
            colids = ("序号,"+tcols[0]).split(","); //实际字段名
            strcols = tcols[1];
            lens=tcols[2].split(",");
        }
        else
        {
            cols = ncols[0].childNodes[0].text.split(",");
            strcols = ncols[0].childNodes[0].text;
            colids = ("序号,"+strcols).split(",");
            var nlens = xmldata.selectNodes("//xstructs/len");
            var xlens = nlens[0].childNodes[0].text.split(",");
	        var slens = "";
	        for(var i=0;i<xlens.length-1;i++)
	        {
	            slens = slens + xlens[i] + ",";
	        }
	        lens = slens.split(",");            
        }
        //判断是否有Boolean类型的字段
        var blname = "";
        if(datatypes)
            for(var m=0;m<datatypes.length;m++)
            {
                if(datatypes[m]=="Boolean")
                {
                    blname = arrcols[m];
                    break;
                }
            }
        var xmlrows = xmldata.selectNodes("//"+tablename);        
        var strwidths;
        //增加序号列
        strcols   = "序号,"+strcols;
        cols=strcols.split(",");
        var widths = lens;
        for(var i = 0; i < 1; i++)
        {
            gridtop.push("<tr rowType='title'>");
            for(var j = 0; j < cols.length; j++)
            {
                var _sw="";
                if(j==0) _sw = " width='45px'";
                else
                {
                    if(parseInt(widths[j-1])<=minwidth) widths[j-1] = minwidth;
                    if(widths[j-1]=="") _sw="";
                    else _sw = " width="+ widths[j-1];
                }
                gridtop.push("<td align='center' height=22px colname='" + colids[j] + "' class='cellwb_btn'"+ _sw +">" + cols[j] +"</td>");
            }
            gridtop.push("</tr>"); 
        }
        gridtop.push("<tbody></table></div>");
        // ---------------------------------------------------------------//
        var sdetail = "<div id='"+ srcdiv +"_dvdetail' divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%' onscroll='GridUtil.usOnScrollHori();'>"
          +"<table width='100%' id='"+ srcdiv +"_detail' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0'  onmousemove='GridUtil.usOnDetailMouseOverHandle();' onmouseout='GridUtil.usOnDetailMouseOutHandle();'>"
          +"<tbody>";
        gridtop.push(sdetail);
        for(var i = 0; i < xmlrows.length; i++)
        {
            gridtop.push("<tr>");
            for(var j = 0; j < cols.length; j++)
            {
                var _sw="";
                if(j==0)
                { 
                    _sw = " width='45px'";
                    var colvalues = i+1;
                    gridtop.push("<td align='center'name='序号' height=20px class='cellwb_btn'"+ _sw +">"+ colvalues +"</td>");
                }
                else
                {                    
                    
                    if(parseInt(widths[j-1])<=minwidth) widths[j-1] = minwidth;
                    if(widths[j-1]=="") _sw="";
                    else _sw = " width="+ widths[j-1];
                    var colvalues="";
                    var colxml="";
                    if(colids)
                    {
                        if(xmlrows[i].selectSingleNode(colids[j]))
                        {
                            colvalues = xmlrows[i].selectSingleNode(colids[j]).text;
                            colxml    = xmlrows[i].selectSingleNode(colids[j]).xml;
                         }
                    }
                    else
                    {
                        colvalues = xmlrows[i].childNodes[j-1].text;
                        colxml = xmlrows[i].childNodes[j-1].xml;
                    }
                    if(colxml)
                    {
                        if(colxml.indexOf("<input")>-1 || colxml.indexOf("&lt;input")>-1) 
                        {
                            colvalues = colxml.replace("<"+xmlrows[i].childNodes[j-1].baseName+">","");
                            colvalues = colvalues.replace("</"+xmlrows[i].childNodes[j-1].baseName+">","");
                        }
                        if(colxml.indexOf("<a href")>-1) 
                        {
                            colvalues = colxml.replace("<"+xmlrows[i].childNodes[j-1].baseName+">","");
                            colvalues = colvalues.replace("</"+xmlrows[i].childNodes[j-1].baseName+">","");
                        }
                    }
                    if(colxml && (colxml.indexOf("checkbox")>-1)) 
                    {
                        colvalues = '<input type="checkbox" id="chk'+i+'">';
                        gridtop.push("<td align='center' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");                    
                    }
                    else
                    {
                        if(colxml && colxml.indexOf("<a")>-1) 
                        {
                            gridtop.push("<td align='center' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");                    
                        }
                        else
                        {
                            if(blname==cols[j])
                            {
                                colvalues = '<input type="radio" value="V1" checked name="'+blname+'">';
                                gridtop.push("<td align='center' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                            }
                            else
                            {
                                
                                if(colvalues=="" || colvalues=="0") colvalues="　";
                                
                                if(datatypes && datatypes[j])
                                {
                                    var dtype = datatypes[j].toLowerCase();
                                    if(dtype.indexOf("int")>-1 || dtype.indexOf("float")>-1 || dtype.indexOf("double")>-1 || dtype.indexOf("decimal")>-1)
                                        gridtop.push("<td align='right' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                else
                                    gridtop.push("<td name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                }
                                else
                                    gridtop.push("<td name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                            }
                        }
                    }
                }
            }
            gridtop.push("</tr>"); 
        }
        gridtop.push("</tbody></table></div></td></tr></tbody></table></div>"); 
        //srcdiv.outerHTML = gridtop.join("");   
        if(type=="out")
            document.getElementById(srcdiv).outerHTML = gridtop.join("");   
        else document.getElementById(srcdiv).innerHTML = gridtop.join("");   

        var tabdiv = document.getElementById(srcdiv +"_GridDiv");
        var tabheight  = tabdiv.offsetHeight;
        var tabtop     = tabdiv.offsetTop;
        var divh;
	    if(!tabdiv)	return;	    
	    if(tabdiv.style.height.indexOf("%")>-1)
	    {
	        var _h = tabheight - tabtop;
	        if(_h>0)
	        {
	            if(tabtop>0)
                    tabdiv.style.pixelHeight = tabheight - tabtop -4; 
                else
                    tabdiv.style.pixelHeight = tabheight - tabtop; 
                _h = parseInt(tabdiv.style.height.replace("%",""));
                if(_h>100) h = _h/100+"%";
                else _h=_h+"%";
                divh = _h;
            }
        }
        this.GridDiv=tabdiv;	//Grid底板
	    this.DivBody    =   document.getElementById(srcdiv +"_tdbody");   //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	    this.DivDetail  =   document.getElementById(srcdiv +"_dvdetail"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	    this.DivTitle   =   document.getElementById(srcdiv +"_dvtitle"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");

        this.Cols = cols;
        if(this.TabFoot) this.TabFoot.Grid=this;
        //数据岛属性
        this.XmlLand    = oband.data

	    if(this.DivBody.style.height.indexOf("%")<0)
	        this.DivBody.style.height   =   tabdiv.style.height;

	    if(DivDetail.style.height.indexOf("%")>-1)
	    {
	        _h = this.DivBody.offsetHeight-DivTitle.offsetHeight;
	        if(_h>0)
	        {
                this.DivDetail.style.pixelHeight = _h;
                var _height = parseInt(DivDetail.style.height.replace("%",""));
                if(_height>100)
                    this.DivDetail.style.height = _height/100+"%";
            }
        }
   }   

var _p=BGrid.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//Grid初始化数据岛关系
_p.dataBindRefresh=function(xmlLand)
{
	if(!xmlLand && !this.XmlLand && this.Table.dataSrc)
		xmlLand=document.getElementById(this.Table.dataSrc.substr(1));
	if(!xmlLand)	return;
	this.ItemName=xmlLand.itemname;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	if(!band) return;
	band.Grid=this;
	this.Band=band;
	if(!xmlLand || !xmlLand.XMLDocument)
	    return;
	var Htmldoc=xmlLand.parentElement.ownerDocument;
	var xmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	if(!xmlSchema || !xmlSchema.XMLDocument || xmlSchema.XMLDocument.documentElement.childNodes.length<1)
		return null;
	//获取数据岛结构xml属性:grid.XmlSchema
	this.XmlLand=xmlLand;
	this.XmlChanged=Htmldoc.getElementById(xmlLand.id+"_Delete");
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.XmlDict=Htmldoc.getElementById(xmlLand.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(xmlLand.id+"_Sum");
	if("#"+this.XmlLand.id!=this.Table.dataSrc)
		this.Table.dataSrc="#"+this.XmlLand.id;
	if(this.XmlSum)
	    if(this.TabFoot)
		    this.TabFoot.dataSrc="#"+this.XmlSum.id;
	this.Table.style.display="none";
	if(this.TabFoot  && this.TabFoot.id!="specialdisplay")
	    this.TabFoot.style.display="none";
	var bandM=this.Band.getBandM();
    if(!bandM || !bandM.ManualRefresh || "Detail"!=this.Band.itemType)
	    this.Sum();
}
//设置功能区翻页标签数据
_p.clearFunArea=function()
{
	var  div=this.DivFunArea;
	if(!div)    return;
	var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblCurrentPage");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText=0;

	lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblTotalPages");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText=0;

	var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblRecordCount");
	if(lbctrl)
		if("INPUT"==lbctrl.tagName)
			lbctrl.value=0;
		else
			lbctrl.innerText="0";

    var ctrlsel=ToolUtil.getCtrlByNameD(false,div,"name","ddlPageIndex");
    if(!ctrlsel) return;
    ctrlsel.length=1;
    ctrlsel.options[0].value=1;
    ctrlsel.options[0].text=1;
}

//设置功能区翻页标签数据
_p.setFunArea=function()
{
	var  div=this.DivFunArea;
	if(!div)    return;
	if(this.XmlSum && this.XmlSum.XMLDocument)
	{
		//当前页码
		var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblCurrentPage");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=xmlNodePageIndex.text;
			else
				lbctrl.innerText=xmlNodePageIndex.text;
		//总页数;并加入下拉框中
		var xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/TotalPage");
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblTotalPages");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=xmlNode.text;
			else
				lbctrl.innerText=xmlNode.text;
		var iTotalPage=ToolUtil.Convert(xmlNode.text,"int");
		var iPageIndex=ToolUtil.Convert(xmlNodePageIndex.text,"int");
		if(iTotalPage<1)	iTotalPage=1;
	    var ctrlsel=ToolUtil.getCtrlByNameD(false,div,"name","ddlPageIndex");
		if(ctrlsel && iTotalPage!=ctrlsel.length)
		{
		    var lenold=ctrlsel.length;
		    ctrlsel.length=iTotalPage;
		    for(var i=lenold-1;i<iTotalPage;i++)
		    {
		        ctrlsel.options[i].value=i+1;
		        ctrlsel.options[i].text=i+1;
		    }
		}
		if(ctrlsel && iPageIndex-1>-1)
	        ctrlsel.options[iPageIndex-1].selected=true;
		//记录总数
		xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/RecordCount");
		var iRecordCount=ToolUtil.Convert(xmlNode.text,"int");
		if(iTotalPage<2)
			iRecordCount=this.XmlLand.XMLDocument.documentElement.childNodes.length;
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblRecordCount");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=iRecordCount+"";
			else
				lbctrl.innerText=iRecordCount+"";
	}
}
//设置行标号;isRowCursor 是否更新行标
_p.setRowCursor=function(isRowCursor)
{
	if(!this.Table || !this.XmlLand || !this.XmlSchema || !this.XmlLand.XMLDocument || this.Table.dataSrc!="#"+this.XmlLand.id 
			|| !this.XmlLand.XMLDocument.documentElement || !this.XmlLand.XMLDocument.documentElement.hasChildNodes())
	{
	    this.clearFunArea();
		return;
    }
	var iPageSize=ToolUtil.Convert(this.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
	if(xmlNodePageIndex)
		var iPageIndex=ToolUtil.Convert(xmlNodePageIndex.text,"int");
	if(null==iPageIndex || isNaN(iPageIndex))
		iPageIndex=1;
	//行光标列
	var xmlRow=this.XmlLand.XMLDocument.documentElement.firstChild;
	var irow=0;
	if(isRowCursor)
	    while(xmlRow && irow<xmlRow.parentNode.childNodes.length)
	    {
	        var xmlNode=xmlRow.selectSingleNode("RowNum");
	        if(!xmlNode)    break;
	        xmlNode.text=irow+1+(iPageIndex-1)*iPageSize;
	        irow++;
	        xmlRow=xmlRow.nextSibling;
	    }
	this.setFunArea();
}


//汇总Grid脚注
_p.Sum=function()
{
	if(!this.XmlSchema)				return;
	//if(true==this.HiddenFoot)		return;
	if(!this.TabFoot) return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sum();
	this.HiddenFoot=true;
	var footCols=ToolUtil.getCtrlListByNameD(false,this.TabFoot,"datafld");
	for(var i=0;footCols && i<footCols.length;i++)
	{
		if(!this.XmlSum)	break;
		if(!footCols[i].dataFld || ""==footCols[i].dataFld )
			continue;
		var xmlNode=this.XmlSum.XMLDocument.selectSingleNode("/*/*/"+footCols[i].dataFld);
		if(!xmlNode)	continue;
		this.HiddenFoot=false;break;
	}
	if(band.RecordCount()<2)
		this.HiddenFoot=true;
	if(true==this.HiddenFoot  && this.TabFoot.id!="specialdisplay")
		this.TabFoot.style.display="none";
	else
		this.TabFoot.style.display="";
	if(!this.HiddenFoot && ""==this.TabFoot.dataSrc)
		this.TabFoot.dataSrc="#"+this.XmlLand.id+"_Sum";
}

//设置当前单元格
_p.setActiveCell=function(tdcur)
{
	if(!tdcur || !tdcur.tagName || "TD"!=tdcur.tagName)
		return;
	var trcur=ToolUtil.getCtrlByTagU(true,tdcur,"TR","rowType","detail");
	if(this.curTd==tdcur || !trcur)
		return;
	var ctrlCol=ToolUtil.getCtrlByNameD(false,tdcur,"colname");
	var datastyle=tdcur.getAttribute("datatype");
	if(!ctrlCol && (!datastyle || ""==datastyle))
		return;
	//数据所在表格,及对应数据岛数据结构,列节点
	if(this.XmlLand.recordset.AbsolutePosition-1 != trcur.rowIndex)
		this.XmlLand.recordset.AbsolutePosition = trcur.rowIndex + 1;
	//在当前行的单元格上切换时只改变单元格的颜色
	if(this.curTd!=tdcur && this.curTr==trcur)
	{
		this.setCtrlStateColor(this.curTd,"current");
		this.setCtrlStateColor(tdcur,"actived");
		this.curTd=tdcur;
		return;
	}
	//当前行也改变,首先恢复行颜色,然后设置当前行和当前单元格颜色
	//激活行也是选择行,行有isSelected属性
	for(var rowIndex=0;rowIndex<this.RowSelectedList.length;rowIndex++)
	{
		for(var i=0;i<this.RowSelectedList[rowIndex].cells.length;i++)
		{
			var cell=this.RowSelectedList[rowIndex].cells[i];
	        var datastyle=cell.getAttribute("datatype");
			if(!datastyle || ""==datastyle)
				continue;
			this.setCtrlStateColor(cell,"browse");
			this.RowSelectedList[rowIndex].isSelected=false;
		}
	}
	var bcell=false;
	for(var i=0;i<trcur.cells.length;i++)
	{
		var cell=trcur.cells[i];
        var datastyle=cell.getAttribute("datatype");
		if(!datastyle || ""==datastyle)
			continue;
		if(cell===tdcur)
		{
			this.setCtrlStateColor(cell,"actived");
			bcell=true;
		}else
			this.setCtrlStateColor(cell,"current");
	}
	if(false==bcell)
		this.setCtrlStateColor(tdcur,"actived");
	trcur.isSelected=true;
	if(this.RowSelectedList.length>1)
		this.RowSelectedList=new Array();
	this.curTd=tdcur;
	this.curTr=trcur;
	this.RowSelectedList[0]=trcur;
}//_p.setActiveCell=function(tdcur)
_p.setFocus=function()
{
	var ctrl=ToolUtil.getCtrlByNameD(false,this.curTd,"colname");
	if(ctrl && "none"!=ctrl.style.display && "hidden"!=ctrl.style.visibility)
		try{ctrl.focus();}catch(ex){}
}
//设置ctrlContain的颜色类型;state值有：browse,current,actived,mouseover,selected;默认browse
_p.setCtrlStateColor=function(ctrlContain,state,init)
{
//    if(!event) return;
//    if(event && !event.srcElement) return;
	var bgColor,borderColor,faceColor;
	if(!ctrlContain)	return;
	if(!state)	state="browse";
	if(	ctrlContain.className=="readCellStyle") return;
	switch(state)
	{
		case "browse":
			bgColor    =this.browseBgColor;
			borderColor=this.browseFacColor;
			faceColor  =this.browseFacColor;
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");   
            if(!this.Band.CalXmlLand || !this.Band.CalXmlLand.RedWordCellList) break;
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		            faceColor = this.warnFacColor;
            }
			break;
		case "current":
			bgColor     = this.curBgColor;
			borderColor = this.curBgColor;
			faceColor   = this.curFacColor;
			break;
		case "actived":
			bgColor     = this.actBgColor;
			borderColor = this.actBgColor;
			faceColor   = this.actFacColor;
			break;
		case "mouseover":
			bgColor=this.curOverBgColor;
			borderColor=this.curOverBgColor;
			faceColor=this.curOverFacColor;
			
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname"); 
            if(!this.Band.CalXmlLand || !this.Band.CalXmlLand.RedWordCellList) break;   
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		        {
		            faceColor = this.warnFacColor;
		        }
            }
			break;
		case "selected":
			bgColor=this.selBgColor;
			borderColor=this.selBgColor;
			faceColor=this.selFacColor;
			break;
		case "warned":
			//bgColor=this.warnBgColor;
			faceColor=this.warnFacColor;
			break;
		default:
			bgColor=this.browseBgColor;
			borderColor=this.browseFacColor;
			faceColor=this.browseFacColor;
            var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
            if(!this.Band.CalXmlLand.RedWordCellList) break;    
	        for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	        {
		        if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName && parseInt(ctrlCol.value)<0)
		        {
		            faceColor = this.warnFacColor;
		        }
            }
			break;
	}
	//判断红字
	if(init && init!=0 && this.Band.CalXmlLand.RedWordCellList)
	{
        var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
	    for(var _i=0;_i<this.Band.CalXmlLand.RedWordCellList.length;_i++)
	    {
		    if(ctrlCol.dataFld==this.Band.CalXmlLand.RedWordCellList[_i].ColName)
		        faceColor = ctrlCol.runtimeStyle.color;
        }
    }    
    
//    var ctrlCol=ToolUtil.getCtrlByNameD(false,ctrlContain,"colname");
//    if(this.Band.CalXmlLand.RedWordCell(ctrlContain.recordNumber,ctrlCol.dataFld,ctrlCol.value))
//        faceColor=this.warnFacColor;
	var rootContain=ctrlContain;
	var aLink=rootContain.getElementsByTagName("A");
	if(aLink.length>0)  return;
	var discolor=rootContain.getAttribute("discolor");
	if("true"==discolor)    return;
	var oCell = ctrlContain;
	while(ctrlContain)
	{
		//设置颜色特性
		if(ctrlContain.runtimeStyle)
		{
			with(ctrlContain.runtimeStyle)
			{
				backgroundColor = bgColor;
				borderColor     = borderColor;
				color           = faceColor;
			}
		}
		//首先遍历子级,同级下一节点
		var ctrlTmp=ctrlContain.firstChild;
		if(!ctrlTmp)	ctrlTmp=ctrlContain.nextSibling;
		//向上遍历同级下一节点;如果这个节点是明细表cell就停止
		while(!ctrlTmp && ctrlContain.parentElement && rootContain!=ctrlContain.parentElement)
		{
			var ctrlPTmp=ctrlContain.parentElement.nextSibling;
			if(!ctrlPTmp)	ctrlContain=ctrlContain.parentElement;
			else			ctrlTmp=ctrlPTmp;
		}
		ctrlContain=ctrlTmp;
	}
}

//选择行; rowIndex行号;isSingle 是否单选模式,默认单选模式
_p.setSelectedRow=function(rowIndex,isSelected,isSingle)
{
	if(null==rowIndex || this.XmlLand.recordset.recordCount<1 || rowIndex>=this.XmlLand.recordset.recordCount)
		return;
	if(null==isSelected)	isSelected=true;
	if(null==isSingle)	isSingle==true;
	if(true==isSingle)
	{
		if(!this.curTd)
			curTd=ToolUtil.getCtrlByTagD(false,this.Table,"TD","colname");
		else
			curTd=this.curTd;
		curTd=this.Table.rows[rowIndex].cells[curTd.cellIndex];
		this.setActiveCell(curTd);
		return;
	}
	//设置选择行,可以多行选择模式
	curtr=this.Table.rows[rowIndex];
	if(curtr.isSelected==isSelected || curtr==this.curTr)
		return;
	for(var i=0;i<curtr.cells.length;i++)
	{
		var cell=curtr.cells[i];
        var datastyle=cell.getAttribute("datatype");
		if(!datastyle || ""==datastyle)
			continue;
		if(true==isSelected)
			this.setCtrlStateColor(cell,"selected");
		else
			this.setCtrlStateColor(cell,"browse");
	}
	curtr.isSelected=(true==isSelected)?true:false;
	this.RowSelectedList=new Array();
	for(var i=0;i<this.Table.rows.length;i++)
		if(this.Table.rows[i].isSelected && true==this.Table.rows[i].isSelected)
			this.RowSelectedList[this.RowSelectedList.length]=this.Table.rows[i];
}

//对于有选择框checked列风格Grid，返回用户选择的数据岛行节点数组
_p.setRowChecked=function()
{
	if(!this.HasRowChecked || !this.XmlLand || this.XmlLand.XMLDocument.documentElement.childNodes.length<1)
		return;
	var root=this.XmlLand.XMLDocument.documentElement;
	for(var i=0;i<this.Table.rows.length;i++)
	{
		var tr=this.Table.rows[i];
		var ctrlCheck=ToolUtil.getCtrlByTagD(false,tr,"INPUT",'datatype','selectrow');
		if(!ctrlCheck || "checkbox"!=ctrlCheck.type)
			break;
		if(!tr.recordNumber || tr.recordNumber<1)
			break;
		if(!root.childNodes[tr.recordNumber-1]) break;
		var isSelected=root.childNodes[tr.recordNumber-1].getAttribute("selected");
		isSelected=ToolUtil.Convert(isSelected,"bool");
		if(true==isSelected)
			ctrlCheck.checked=true;
		else
			ctrlCheck.checked=false;
	}
}
//删除选择的行
_p.DelRowSelected=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	for(var i=this.RowSelectedList.length-1;i>-1;i--)
	{
	    var rowIndex=this.RowSelectedList[i].recordNumber-1;
	    if(this.RowSelectedList[i].recordNumber==null)
		    rowIndex = this.RowSelectedList[i].rowIndex;
		Band.DeleteRecord(rowIndex);
		if(this.RowSelectedList[i].recordNumber==null) this.Table.deleteRow(rowIndex);
	}
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();
	this.setRowCursor(true);
}
//保存Grid列宽度的改变,利用xmlhttp方式
_p.saveWidth=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	//加入系统参数
	var xmldocP=this.XmlSchema.XMLDocument;
	ToolUtil.setParamValue(xmldocP, "UnitName", this.UnitName, "", "P", "", "C");
	ToolUtil.setParamValue(xmldocP, "Command", "SaveWidth", "", "P", "", "T");
    this.XmlSchema.XMLDocument.documentElement.setAttribute("UnitItem",myUnitItem.UnitName);
    this.XmlSchema.XMLDocument.documentElement.setAttribute("ItemName",this.ItemName);
    //提交更新数据的XMLDoc文档
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    try
    {
        var xmlhttp=ToolUtil.SendPost(xmldocP);
    }catch(ex){
	    var result=ToolUtil.setValueTag("","成功","false");
	    result=ToolUtil.setValueTag(result,"提示","系统出错:保存失败!");
	    return result;
    }
    return unescape(xmlhttp.responseText);
}
//对Grid排序:colname列名称;ascdesc升降序:ascending 升序;descending 降序
_p.Sort=function(colname,datatype,ascdesc)
{
	if(!this.XmlSchema)		return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sort(colname,datatype,ascdesc);
}

//文件结尾
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;