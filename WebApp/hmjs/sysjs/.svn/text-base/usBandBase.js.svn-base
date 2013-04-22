// JScript source code
//操作维护页面多个数据岛的关联

//根据单元Conf节点创建Band对象
function Band(xmlNodeConf)
{
	//项目配置属性
	this.XmlConfig=xmlNodeConf;
	this.key = xmlNodeConf.getAttribute("name");
	this.ItemName=this.key;
	this.active=false;                                          //新增active属性,表示band打开或者关闭
	this.SynchBands=new Array();
	this.IsImport = xmlNodeConf.getAttribute("import");
	this.MasterItemName=xmlNodeConf.getAttribute("masteritem");
	var str=xmlNodeConf.getAttribute("relation");
	itemType=(!str || ""==str)?"D":str;
	switch(itemType.toUpperCase())
	{
		case "D":	this.itemType="Detail";break;
		case "M":	this.itemType="Master";break;
		case "G":	this.itemType="General";break;
		case "R":	this.itemType="Report";break;
		case "S":	this.itemType="Standby";break;
		default:	this.itemType="Detail";break;
	}
	str=xmlNodeConf.getAttribute("printtype");
	this.printType=(!str || ""==str)?"HTML":str;
	this.PrnTmp=xmlNodeConf.getAttribute("printname");
	this.PrnSql=xmlNodeConf.getAttribute("printitem");
	this.linkCol=xmlNodeConf.getAttribute("linkcol");
	this.linkColM=xmlNodeConf.getAttribute("linkcolm");
	this.RightCol=xmlNodeConf.getAttribute("rightcol");
    var strXPath=".//Item[@masteritem='"+this.ItemName+"']";
    var nodeBand=xmlNodeConf.ownerDocument.selectSingleNode(strXPath);
    if(nodeBand || "Master"==this.itemType)
        if(null==this.linkColM || ""===this.linkColM)
            this.linkColM=this.linkCol;
	str=xmlNodeConf.getAttribute("columnkey");
	this.keyCol=(!str || ""==str)?"":str;
	
	this.DataItem=xmlNodeConf.getAttribute("dataitem");
	this.DataItemPage=xmlNodeConf.getAttribute("dataitempage");
	this.DataItemCount=xmlNodeConf.getAttribute("countdataitem");
	this.tempId = xmlNodeConf.getAttribute("tpid");
	this.XmlLandData=null;
	this.XmlSchema=null;
	this.XmlChanged=null;
	this.XmlDict=null;
	this.XmldocFilter=null;	
	this.Grid=null;
	this.StrongGrid=false;//强制创建Grid
	this.ManualRefresh=false;
	this.treeCalc=false;
	this.treechkbox="";
	if(xmlNodeConf.getAttribute("manualrefresh"))
	{
	    if(xmlNodeConf.getAttribute("manualrefresh").toLowerCase()=="true")
	        this.ManualRefresh=true;
	}

	//项目的数据,结构,字典,汇总,删除区数据岛
	var  xmlLands=document.getElementsByTagName("XML");
	for(var i=0;i<xmlLands.length;i++)
	{
		if(!xmlLands[i].typexml || !xmlLands[i].name 
			|| "Schema"!=xmlLands[i].typexml || this.ItemName!=xmlLands[i].name)
			continue;
		this.XmlSchema=xmlLands[i];
		break;
	}
	for(var i=0;i<xmlLands.length;i++)
	{
		if(!xmlLands[i].typexml || !xmlLands[i].itemname 
			|| "Data"!=xmlLands[i].typexml || this.ItemName!=xmlLands[i].itemname)
			continue;
		this.XmlLandData=xmlLands[i];
		this.ID=xmlLands[i].id;
		break;
	}
	if(!this.XmlLandData)	return;
    this.rows = this.XmlLandData.XMLDocument.selectNodes("//"+this.DataItem);
	var Htmldoc=this.XmlLandData.parentElement.ownerDocument;
	this.XmlChanged=Htmldoc.getElementById(this.XmlLandData.id+"_Delete");
	this.XmlDict=Htmldoc.getElementById(this.XmlLandData.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(this.XmlLandData.id+"_Sum");
	this.XmldocFilter=new ActiveXObject("Msxml2.DOMDocument");
	if(this.XmlLandData.XMLDocument && this.XmlLandData.XMLDocument.documentElement)
		this.XmldocFilter.appendChild(this.XmldocFilter.createElement(this.XmlLandData.XMLDocument.documentElement.baseName));
	else
		this.XmldocFilter.appendChild(this.XmldocFilter.createElement("DataSet"));
	if(this.XmlSum)
	{
		var xmldiv=document.createElement("DIV");
		xmldiv.style.display="none";
		document.body.appendChild(xmldiv);
		xmldiv.innerHTML="<XML ID="+this.XmlLandData.id+"_Sumtemp >"+this.XmlSum.XMLDocument.xml+"</XML>";
		this.XmlSumTemp=ToolUtil.getCtrlByTagD(false,xmldiv,"XML");
	}
	this.Sum();
	this.XmlLandData.onRowEnterHandle=null;
	//提示控件,记录数据更新的隐藏标签,记录宽度更新的隐藏标签,记录命令参数的隐藏标签,命令提交按钮控件
	if(this.XmlSchema.ctrlAlert && ""!=this.XmlSchema.ctrlAlert)
		this.AlertCtrl=Htmldoc.getElementById(this.XmlSchema.ctrlAlert);
	else
		this.AlertCtrl=null;
    this.ColNames = new Array();
    this.DataTypes = new Array();
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var strType=colList[i].attributes.getNamedItem("type").text;
		var strName=colList[i].attributes.getNamedItem("name").text;
		this.ColNames[this.ColNames.length] = strName;
		this.DataTypes[this.DataTypes.length] = strType.replace("xs:","");
    }	
		
	this.HlbDataChanged=Htmldoc.getElementById(this.XmlSchema.ctrlchanged);
	this.HlbSchemaChanged=Htmldoc.getElementById(this.XmlSchema.ctrlschema);
	this.HlbCommand=Htmldoc.getElementById(this.XmlSchema.ctrlhlbcmd);
	this.BtCommand=Htmldoc.getElementById(this.XmlSchema.ctrlbtcommand);
	this.HlbState=Htmldoc.getElementById(this.XmlSchema.ctrlstate);
	this.RefreshForce=false;
	//this.ManualRefresh=false;
	this.IsValidSave=true;
	this.IsSaveLocal=true;
	this.IsPostBackFull=false;
	this.IsPostBack=false;
	//if("true"==this.XmlSchema.getAttribute("ManualRefresh"))
	//    this.ManualRefresh=true;	
	if("false"==this.XmlSchema.getAttribute("IsSaveLocal"))
	    this.IsSaveLocal=false;
	if("true"==this.XmlSchema.getAttribute("IsPostBackFull"))
	    this.IsPostBackFull=true;
    var isPostBackFull=ToolUtil.valueTag((!this.HlbState)?"":this.HlbState.value,"IsPostBackFull");
    var isPostBack=ToolUtil.valueTag((!this.HlbState)?"":this.HlbState.value,"IsPostBack");
	if("true"==isPostBackFull)
	    this.IsPostBackFull=true;
	if("true"==isPostBack)
	    this.IsPostBack=true;
	//设置校验,计算对象,动态加载
	if("function"==typeof(XmlLandCal))
	{
	    this.CalXmlLand=new XmlLandCal(this.XmlLandData);
	    this.CalXmlLand.Band=this;
	    this.CalXmlLand.SetColExp();
	    this.CalXmlLand.SetValiCellExp();
	    this.CalXmlLand.SetRedWordCellExp();
	}else{
	    this.CalXmlLand=new function(){};
	    this.CalXmlLand.Band=this;
	    this.CalXmlLand.Init=function()
	            {
	                GridUtil.Loadjs(GridUtil.Validation);
	                GridUtil.Loadjs(GridUtil.XmlLandCal);
	                var band=this.Band;                
	                band.CalXmlLand=new XmlLandCal(band.XmlLandData);
	                band.CalXmlLand.Band=band;
	                band.CalXmlLand.SetColExp();
	                band.CalXmlLand.SetValiCellExp();
	                band.CalXmlLand.SetRedWordCellExp();
	            };
	    this.CalXmlLand.Calculate=function(irowindex,caltype)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.Calculate(irowindex,caltype);
	            };
	    this.CalXmlLand.ValidateCell=function(rowIndex,colname,value)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.ValidateCell(rowIndex,colname,value);
	            };
	    this.CalXmlLand.ValidateRow=function(irow,valiType)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.ValidateRow(irow,valiType);
	            };
	    this.CalXmlLand.Evaluation=function(irowindex,sExpression)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.Evaluation(irowindex,sExpression);
	            };
	    this.CalXmlLand.ValidateRowFilter=function(irow)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.ValidateRowFilter(irow);
	            };
	    this.CalXmlLand.RedWordCell=function(rowIndex,colname,value)
	            {
	                var band=this.Band;
	                this.Init();
	                band.CalXmlLand.RedWordCell(rowIndex,colname,value);
	            };
	}
	//增加事件处理:事件参数:Event,它有的属性:rowIndex,colName
	this.Event=new function(){ this.rowIndex=-1;this.colName="";}
	this.AfterRowChanged=null;
	this.AfterCellEditChanged=null;
	this.AfterSum=null;
	this.AfterNewRecord=null;
	this.DbClickHandle=null;
	this.AfterSave=null;
	this.isimport=false;
	this.copyindex=null;
    this.modify=false;
    this.edittype=true;  //用于ypanel判断编辑方式	
    this.status     = "";//当前所处的编辑状态:new-增加,edit-编辑,browser-浏览    
}
var _p=Band.prototype;
//对象自定义事件执行,方便外部接口编程
_p.FireEvent=function(eventName,arg1,arg2)
{
    if(!this.Event)     return;
    if(!eventName || ""==eventName)
        return;
    switch(eventName.toLowerCase())
    {
        case "beforerowchanged":
            if (this.BeforeRowChanged && typeof (this.BeforeRowChanged) == "function")
                this.BeforeRowChanged(arg1,arg2);
            break;
        case "afterrowchanged":
            if(this.AfterRowChanged && typeof(this.AfterRowChanged)=="function")
                this.AfterRowChanged();
            break;
        case "aftercelleditchanged":
            if(this.AfterCellEditChanged && typeof(this.AfterCellEditChanged)=="function")
                this.AfterCellEditChanged();
            break;
        case "aftersum":
            if(this.AfterSum && typeof(this.AfterSum)=="function")
                this.AfterSum();
            break;
        case "afternewrecord":
            if(this.AfterNewRecord && typeof(this.AfterNewRecord)=="function")
                this.AfterNewRecord();
            break;
        case "dbclickhandle":
            if(this.DbClickHandle && typeof(this.DbClickHandle)=="function")
                this.DbClickHandle();
            break;
        case "aftersave":
            if(this.AfterSave && typeof(this.AfterSave)=="function")
                this.AfterSave();
            break;
        case "afternavpage":
            if(this.AfterNavPage && typeof(this.AfterNavPage)=="function")
                this.AfterNavPage();
            break;
    }//switch(eventName.toLowerCase())
}


//汇总数据岛数据
_p.Sum=function()
{
	if(!this.XmlSchema) return;
	//添加汇总列模板参数
	var eleSum=GridUtil.XSLLandSum.XMLDocument.selectSingleNode("//xsl:call-template[@name='tempsum']");
	var eleParam=eleSum.selectSingleNode("xsl:with-param[@name='colname']");
	var eleSumParent=eleSum.parentNode;
	var eleSumOther=eleSumParent.selectSingleNode("xsl:call-template[@name='tempsumother']");
	var eleParamOther=eleSumOther.selectSingleNode("xsl:with-param[@name='colname']");
	var eleSuffixOther=eleSumOther.selectSingleNode("xsl:with-param[@name='suffix']");
	var eleSumParent=eleSum.parentNode;
	var eleSumList=eleSumParent.selectNodes("xsl:call-template");
	for(var i=eleSumList.length-1;i>-1;i--)
		eleSumParent.removeChild(eleSumList[i]);
	var footsuffix=eleSuffixOther.getAttribute("select");
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[@footer!='' and ( @type='xs:int' or @type='xs:number' or @type='xs:float' or @type='xs:decimal' or @type='xs:double' or @type='xs:money' or @type='xs:string' )]");
	
	for(var i=0;i<colList.length;i++)
	{
		var strType=colList[i].attributes.getNamedItem("type");
		var strName=colList[i].attributes.getNamedItem("name");  
		var strFoot=colList[i].attributes.getNamedItem("footer");
		var strFootSuffix=colList[i].attributes.getNamedItem("footsuffix");
		if(!strFoot || ""==strFoot.value)			continue;
		if("xs:int"==strType.value || "xs:number"==strType.value || "xs:float"==strType.value || "xs:decimal"==strType.value
			|| "xs:double"==strType.value || "xs:money"==strType.value)
		{
			eleParam.text=strName.value;
			eleSumParent.appendChild(eleSum.cloneNode(true));
		}
		//if("sumother"==strFoot.value || "sum"==strFoot.value)
		if("sumother"==strFoot.value)
		{
		    if(strFootSuffix && null!=strFootSuffix && ""!=strFootSuffix)
		        eleSuffixOther.setAttribute("select",strFootSuffix);
		    else
		        eleSuffixOther.setAttribute("select",footsuffix);
			eleParamOther.text=strName.value;
			eleSumParent.appendChild(eleSumOther.cloneNode(true));
		}
	}
	//没有汇总数据岛;就新建
	if(!this.XmlSum && colList.length>0)
	{
		var xmldiv=document.createElement("DIV");
		xmldiv.style.display="none";
		document.body.appendChild(xmldiv);
		xmldiv.innerHTML="<XML ID="+this.XmlLandData.id+"_Sum >"+this.XmlLandData.transformNode(GridUtil.XSLLandSum)+"</XML>";
		this.XmlSum=ToolUtil.getCtrlByTagD(false,xmldiv,"XML");
		var xmldiv=document.createElement("DIV");
		xmldiv.style.display="none";
		document.body.appendChild(xmldiv);
		xmldiv.innerHTML="<XML ID="+this.XmlLandData.id+"_Sumtemp >"+this.XmlSum.XMLDocument.xml+"</XML>";
		this.XmlSumTemp=ToolUtil.getCtrlByTagD(false,xmldiv,"XML");
		for(var i=0;i<colList.length;i++)
		{
		    var colname=colList[i].getAttribute("name");
		    var num=ToolUtil.Convert(this.getFldStrValueSum(colname),"number");
			this.setFldSumStrValue(colname,!num?"　":num);
		}
	}else if(colList.length>0){
        for(var i=0;i<colList.length;i++)
        {
            var nodeSum=this.XmlSum.XMLDocument.selectSingleNode("/*/*/"+colList[i].getAttribute("name"));
            if(nodeSum)
                nodeSum.text="　";
        }
        //
       
		this.XmlSumTemp.XMLDocument.loadXML(this.XmlLandData.transformNode(GridUtil.XSLLandSum));  //取出初始sum数据xml
		var eleSumTempList=this.XmlSumTemp.XMLDocument.selectNodes("/*/*/*");
		for(var i=0;i<eleSumTempList.length;i++)
		{
		    var num=ToolUtil.Convert(eleSumTempList[i].text,"number");
			this.setFldSumStrValue(eleSumTempList[i].baseName,!num?"　":num);
		}
	}
	//恢复XSLLandSum模板
	var eleSumList=eleSumParent.selectNodes("xsl:call-template");
	for(var i=eleSumList.length-1;i>-1;i--)
		eleSumParent.removeChild(eleSumList[i]);
	eleSumParent.appendChild(eleSum);
	eleSumParent.appendChild(eleSumOther);
	//如果是明细汇总数据;就执行主表的当前行计算然后主表也合计;
	//var bandM=this.getBandM();
	//if(bandM && true==this.isInit && bandM.RecordCount()>0 && "init"!=this.getStateRecord())
	//{
	//    bandM.CalXmlLand.Calculate();
	//	bandM.Sum();
	//}
	//this.FireEvent("AfterSum");
	
	
	//如果是明细汇总数据;就执行主表的当前行计算然后主表也合计;
    if(""!=this.MasterItemName && null!=this.MasterItemName)
        var bandM=(!this.UnitItem)?null:this.UnitItem.getBandByItemName(this.MasterItemName);
    else if(!this.UnitItem || this==(this.UnitItem.BandMaster) || "Detail"!=this.itemType)
        var bandM=null;
    else
        var bandM=this.UnitItem.BandMaster;
	if(bandM)
		if(true==this.isInit && bandM.XmlLandData && bandM.RecordCount()>0)
		{
			var indexRow=bandM.XmlLandData.recordset.AbsolutePosition-1;
			if(indexRow<0) return;
			var xmlRow=bandM.XmlLandData.XMLDocument.documentElement.childNodes[indexRow];
			var state=xmlRow.getAttribute("state");
			if("init"!=state)
			{
				bandM.CalXmlLand.Calculate();
				bandM.Sum();
			}
		}
	this.FireEvent("AfterSum");	
}
//取段Band的主段对象,本身是主段,或者段不是明细段,则主段为null
_p.getBandM=function()
{
    if(this.MasterItemName && ""!=this.MasterItemName )
        var bandM=(!this.UnitItem)?null:this.UnitItem.getBandByItemName(this.MasterItemName);
    else if(!this.UnitItem || this==(this.UnitItem.BandMaster) || "Detail"!=this.itemType)
        var bandM=null;
    else
        var bandM=this.UnitItem.BandMaster;
    return bandM;
}
//读取指定行字段值:fldname 字段名称; rowIndex 行号;  dataRange  数据区域(默认data数据区, filter过滤区, sum汇总区)
_p.getFldStrValue=function(fldname,rowIndex, dataRange)
{
    if(!this.XmlLandData)   return "";
    dataRange=dataRange? dataRange.toLowerCase():"data";
    var xmldoc=this.XmlLandData.XMLDocument;
    if("filter"==dataRange)
        xmldoc=this.XmldocFilter;
    if("sum"==dataRange)
        xmldoc=this.XmlSum?this.XmlSum.XMLDocument:null;
    if(!xmldoc || !xmldoc.documentElement)
        return "";    
	var root=xmldoc.documentElement;
	if(null==rowIndex && root.childNodes.length>0 && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(null==rowIndex || rowIndex>=root.childNodes.length || rowIndex<0 || null==fldname || ""==fldname)
		return "";
	var xmlNodeFld=root.childNodes[rowIndex].selectSingleNode(fldname);
	if(!xmlNodeFld)  return "";
	if(xmlNodeFld.firstChild)
	    return xmlNodeFld.firstChild.text;
	return xmlNodeFld.text;
}
//下列函数=getFldStrValue
_p.Val=function(fldname,rowIndex, dataRange)
{
    return this.getFldStrValue(fldname,rowIndex, dataRange);
}
//下列函数=getFldStrValue
_p.XS=function(xpath)
{
    return this.XmlLandData.XMLDocument.selectSingleNode(xpath);
}
_p.XSS=function(xpath)
{
    return this.XmlLandData.XMLDocument.selectNodes(xpath);
}

//读取过虑区数据
_p.getFldStrValueFilter=function(fldname,rowIndex)
{
    return this.getFldStrValue(fldname,rowIndex,"filter");
}
//读取汇总区数据
_p.getFldStrValueSum=function(fldname)
{
    return this.getFldStrValue(fldname,0,"sum");
}
_p.getCurrentRow=function()
{
    return this.XmlLandData.recordset.AbsolutePosition-1;
}
//设置当前行
_p.setCurrentRow = function (rowIndex)
{
    if (this.RecordCount() < 1)
        return;
    var root = this.XmlLandData.XMLDocument.documentElement;
    if (null == rowIndex)
        rowIndex = this.XmlLandData.recordset.AbsolutePosition - 1;
    if (rowIndex >= root.childNodes.length || rowIndex < 0)
        return;
    var oldindex = this.XmlLandData.recordset.AbsolutePosition - 1;
    if (false == this.FireEvent("BeforeRowChanged", oldindex, rowIndex))
        return;
    if (this.Grid)
    {
        var rowspan = 1;
        if (this.Grid.Table.rows.length > 0)
            rowspan = this.Grid.Table.rows[0].cells[0].rowSpan;
        if (!this.Grid.curTd)
            var curTd = ToolUtil.getCtrlByTagD(false, this.Grid.Table, "TD", "colname");
        else
            var curTd = this.Grid.curTd;
        if (curTd)
        {
            if (rowIndex < this.Grid.Table.rows.length / rowspan)
            {
                var curTdinx = curTd.cellIndex;
                if (curTdinx < 0 && this.Grid.Table.rows[rowIndex * rowspan].cells.length > 1)
                    curTdinx = 1;
                curTd = this.Grid.Table.rows[rowIndex * rowspan].cells[curTdinx];
            }
            this.Grid.setActiveCell(curTd);
            if (Grid.curTd)
            {
                for (var i = 0; i < this.Grid.curTd.childNodes.length; i++)
                {
                    ctrl = this.Grid.curTd.childNodes[i];
                    if (ctrl && ctrl.style && "none" != ctrl.style.display && "hidden" != ctrl.style.visibility)
                        try { ctrl.focus(); } catch (ex) { }
                }
            }
        }
    }
    else
        if (this.Tree)
        {
            var nodeid = this.getFldStrValue(this.Tree.IDField, rowIndex);
            //this.Tree.WebTree.SelectNodeById(nodeid);
            var trvNode = this.Tree.getTrvNodeByID(nodeid);
            if (trvNode) this.Tree.WebTree.set_selectedNode(trvNode); //trvNode.setSelected(true);
            if (!this.XmlLandData.onrowenter && this.XmlLandData.onRowEnterHandle)
                this.XmlLandData.onrowenter = this.XmlLandData.onRowEnterHandle;
            this.XmlLandData.recordset.AbsolutePosition = rowIndex + 1;
        } else
        {
            if (!this.XmlLandData.onrowenter && this.XmlLandData.onRowEnterHandle)
                this.XmlLandData.onrowenter = this.XmlLandData.onRowEnterHandle;
            this.XmlLandData.recordset.AbsolutePosition = rowIndex + 1;
        }
}

//读取数据项的记录行数;没有数据岛,或者没有记录都返回0
_p.xmlrow=function(rowIndex)
{
    if(!this.XmlLandData)   return "";
    dataRange=dataRange? dataRange.toLowerCase():"data";
    var xmldoc=this.XmlLandData.XMLDocument;
    if(!xmldoc || !xmldoc.documentElement)
        return null;    
	var root=xmldoc.documentElement;
	if(null==rowIndex && root.childNodes.length>0 && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(null==rowIndex || rowIndex>=root.childNodes.length || rowIndex<0 || null==fldname || ""==fldname)
		return "";
	return root.childNodes[rowIndex];
}


//读取数据项的记录行数;没有数据岛,或者没有记录都返回0
_p.RecordCount=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return 0;
    if(this.XmlLandData.XMLDocument.documentElement)
        return this.XmlLandData.XMLDocument.documentElement.childNodes.length;
    else
        return this.XmlLandData.XMLDocument.childNodes.length;
}

//控件恢复提交前状态
_p.getState=function()
{
    this.isInit=true;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
	{
	    if(this.Grid)   this.Grid.Table.style.display="";
		return null;
	}
	ToolUtil.sleep(50);
	if(this.Grid)
	{
		this.Grid.Table.style.display="";
		if(true!=this.Grid.HiddenFoot)
		    if(this.Grid.TabFoot)
			    this.Grid.TabFoot.style.display="";
		else
		    if(this.Grid.TabFoot)
			    this.Grid.TabFoot.style.display="none";
		ToolUtil.sleep(10);
		this.Grid.setRowCursor(false);
		this.Grid.setRowsChecked();
	}
	//设置当前行当前列
	var hlbState=null,strState=null;
	var hlbStateID=this.XmlSchema.ctrlstate;
	if(hlbStateID && ""!=hlbStateID)
		hlbState=document.getElementById(hlbStateID);
	if(hlbState)
		strState=hlbState.value;
	if(!strState || ""==strState)
	    this.setCurrentRow(0);
	else{
		//恢复状态时;只需定位行列不需要触发行改变事件
		var indexRow=ToolUtil.valueTag(strState,"CurRow");
		indexRow=ToolUtil.Convert(indexRow,"int");
		this.setCurrentRow(indexRow);
		var curColName=ToolUtil.valueTag(strState,"CurCol");
		if(this.Grid && curColName && ""!=curColName && indexRow<this.Grid.Table.rows.length)
		{
			var curTd=ToolUtil.getCtrlByTagD(false,this.Grid.Table.rows[indexRow],"TD","colname",curColName);
			this.Grid.setActiveCell(curTd);
		}
	}
}

//动态过虑;根据当前行数据返回指定列配置的filterdata数据xml文档
_p.getFilterContent=function(indexrow,filterData,paramName,paramValue,Ex,isasyn,noself)
{
    if("file:"==location.protocol || !filterData)
        return null;
	
	// colName,textCol,valueCol,filterItem,filterData
	if(noself) this.BuildParamNotSelf();
	else this.BuildParamSelf(indexrow);
	var xmldoc=this.UnitItem.ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, paramName, paramValue, "", "B", this.ItemName, "T");
	ToolUtil.setParamValue(xmldoc, "Command", "QueryDict", "", "P", "", "T");
	ToolUtil.setParamValue(xmldoc, "FilterData", filterData, "", "P", "", "T");
    ToolUtil.setParamValue(xmldoc, "DataSrcFile", this.UnitItem.DataSrcFile, "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "DictSrcFile", this.UnitItem.DictColSrcFile, "", "P", null, "T");    
	try
	{
	    var xmlhttp=ToolUtil.SendPost(xmldoc,Ex,isasyn);
	}catch(ex){
		alert("系统出错:不能读取字典["+filterData+"]项"+(ex?ex.message:''));
		return;
	}
	return xmlhttp;
}

_p.querydict=function(dictsrc)
{
	var xmldoc=this.UnitItem.ParamXmldoc;
    ToolUtil.resetParam(xmldoc);
    ToolUtil.setParamValue(xmldoc, "UnitName", this.UnitItem.UnitName, "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "Command", "DataDict", "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "DataSrcFile", this.UnitItem.DataSrcFile, "", "P", null, "T");
    ToolUtil.setParamValue(xmldoc, "DictSrcFile", this.UnitItem.DictColSrcFile, "", "P", null, "T");    
    if(!dictsrc) dictsrc="";
    ToolUtil.setParamValue(xmldoc, "htmldict", dictsrc, "", "P", null, "T");
	return ToolUtil.SendPost(xmldoc);
}


function QueryDict(dictsrc)
{
        var xmldoc=document.UnitItem.ParamXmldoc;
        ToolUtil.resetParam(xmldoc);
	    ToolUtil.setParamValue(xmldoc, "UnitName", document.UnitItem.UnitName, "", "P", null, "T");
	    ToolUtil.setParamValue(xmldoc, "Command", "DataDict", "", "P", null, "T");
        ToolUtil.setParamValue(xmldoc, "DataSrcFile", document.UnitItem.DataSrcFile, "", "P", null, "T");
        ToolUtil.setParamValue(xmldoc, "DictSrcFile", document.UnitItem.DictColSrcFile, "", "P", null, "T");    
	    if(dictsrc)
	        ToolUtil.setParamValue(xmldoc, "htmldict", dictsrc, "", "P", null, "T");
    	return ToolUtil.SendPost(xmldoc);
}


//生成系统参数,本项目主表的参数,包含自身参数,并且以rowIndex行作为本项目的当前行环境
_p.BuildParamSelf=function(rowIndex)
{
	this.BuildParamNotSelf();
    var xmldoc=this.UnitItem.ParamXmldoc;
	if(this.RecordCount()<1)    return;
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	var rootData=this.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex || rowIndex>=rootData.childNodes.length || rowIndex<0)
		return;
	var xmlRowData=rootData.childNodes[rowIndex];
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var colName=colList[i].getAttribute("name");
		var dbType=colList[i].getAttribute("type");
		var xmlNodeFld=xmlRowData.selectSingleNode(colName);
		//如果内容长度大于70或者内容中包含换行符，则不做为参数
		if(!xmlNodeFld || xmlNodeFld.text.length>70 || xmlNodeFld.text.indexOf("\n")>0) continue;
		var value=(null==xmlNodeFld)?"":xmlNodeFld.text;
		ToolUtil.setParamValue(xmldoc, colName, value, dbType, "B", this.ItemName, "D");
    }
    ToolUtil.setParamValue(xmldoc, "WorkItem", this.ItemName, "", "P", null, "T");
	ToolUtil.setParamValue(xmldoc, "RecordCount", this.getFldStrValueSum("RecordCount"), "", "B", this.ItemName, "C", "M");
}

//    	var attrType=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+fldname+"']/@type");
//获取列名,params=1 只取可见字段,0取所有字段.调用方法 oband.Cols("1")
_p.Cols =  function(visible)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    if(!visible) visible="1";
    if(visible=="1")
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[(not(@visible) or @visible='' or @visible!='1') and @name!='ID' or @name='RowNum']");
	else 
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	return colList;
}
_p.vColNames = function(visiable)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    if(!visiable) visiable="1";
    if(visiable=="1")
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[(not(@visible) or @visible='' or @visible!='1') and @name!='ID' or @name='RowNum']");
	else 
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");  
	var cs = new Array();
	for(var i=0;i<colList.length;i++)
	{
	    var strName=colList[i].attributes.getNamedItem("name").text;
		cs[i] = strName;
    }
    return cs;
}
//获取列名,evisible=1 只取可见字段,0取所有字段.调用方法 oband.Cols("1")
_p.PCols =  function(visible)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    if(!visible) visible="1";
    if(visible=="1")
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[(not(@evisible) or @evisible='' or @evisible!='1') and @name!='ID' or @name='RowNum']");
	else 
	    var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	return colList;
}

_p.Col =  function(fldname)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】不存在！");return;}
    var colList=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+ fldname +"']");
	return colList;
}
_p.ColTitle =  function(fldname)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    var colList=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+ fldname +"']");
    return colList.getAttribute("title")?colList.getAttribute("title"):fldname;
}

_p.ColVisable =  function(fldname,_v)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    var colList=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+ fldname +"']");
    if(colList)colList.setAttribute("visible",_v);
}
_p.ColAttrs =  function(attr,cols,_v)
{
    for(var i=0;i<cols.length;i++)
        this.ColAttr(attr,cols[i],_v)    
}
_p.ColAttr =  function(attr,fldname,_v)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    if(!fldname)
    {
        var colLists=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
        for(var i=0;i<colLists.length;i++)
           colLists[i].setAttribute(attr,_v);
    }
    else
    {
        var colList=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+ fldname +"']");
        if(colList)colList.setAttribute(attr,_v);
    }
    
}
_p.ColReadOnly =  function(fldname,_v)
{
    if(!this.XmlSchema){alert("【"+this.ItemName+"】(XmlSchema)配置不存在！");return;}
    if(!fldname)
    {
        var colLists=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
        for(var i=0;i<colLists.length;i++)
           colLists[i].setAttribute("isreadonly",_v);
    }
    else
    {
        var colList=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+ fldname +"']");
        colList.setAttribute("isreadonly",_v);
    }
}
_p.ColObj = function(col)
{
        if(!col) return null;
	    var field=new Object;
	    field.idkey = false;
		field.name = col.getAttribute("name");
		if(field.name=="RowNum") 
		    field.title="序号"
		else
		    field.title = col.getAttribute("title")?col.getAttribute("title"):field.name;
		field.datatype =col.getAttribute("type").replace("xs:","");
		if(col.getAttribute("msdata:DataType") && col.getAttribute("msdata:DataType")!="")
		    field.idkey = true;
		var w = col.getAttribute("width");
		if(field.name=="RowNum") field.width="40px";
		else
		    field.width =w?w:"";
		var style=col.getAttribute("datastyle");
		field.datastyle =style?style:"";
		var h = col.getAttribute("height");
		field.height =h?h:"";
		if(field.datastyle=="boolradio") field.datatype="boolradio";
		var format=col.getAttribute("format");
		field.format =format?format:"";
		var formatfld=col.getAttribute("formatfld");
		field.formatfld =formatfld?formatfld:"";
//		if(field.format=="hh:mm:ss") field.formatfld="";
        var foot = col.getAttribute("footer");
        field.foot =foot?foot:"";
        
        var dataitem = col.getAttribute("dataitem");
        var textcol  = col.getAttribute("textcol");
        var valuecol = col.getAttribute("valuecol");
        field.dataitem =dataitem?dataitem:"";
        field.textcol =textcol?textcol:"";
        field.valuecol =valuecol?valuecol:"";
        if(ToolUtil.valueTag(this.dicts,field.name) && ToolUtil.valueTag(this.dicts,field.name)!="") field.datatype ="selectmanual";
        if(field.dataitem!="") field.datatype ="select";
        if(field.datastyle=="alink") field.datatype ="alink";
        if(field.datastyle=="blink") field.datatype ="blink";
        if(field.datastyle=="blinkimglt") field.datatype ="blinkimglt";
        if(field.datastyle=="txtbox") field.datatype ="txtbox";
		var strevent  = col.getAttribute("onclick");
		field.onclick = strevent?strevent:"";
		
        field.valuefld =(col.getAttribute("valuefld"))?col.getAttribute("valuefld"):"";

		var readonly = col.getAttribute("isreadonly");
		field.readonly =(readonly=="1")?true:false;
		
		var chkcol = col.getAttribute("chkcol");
		field.chkcol =(chkcol=="1")?true:false;
				
        var foot = col.getAttribute("footer");
        field.foot =foot?foot:"";
		field.bandid = this.XmlLandData.id;
		field.band=this;
		return field;
}

//生成参数,本项目主表参数,不包含本项自身参数
_p.BuildParamNotSelf=function()
{
    var xmldoc=this.UnitItem.ParamXmldoc;
    ToolUtil.setParamValue(xmldoc, "WorkItem", this.ItemName, "", "P", null, "T");
	ToolUtil.setParamValue(xmldoc, "RecordCount", this.getFldStrValueSum("RecordCount"), "", "P", null, "C", "M");
    var bandM=this.getBandM();
    if(!bandM)      return;
	var	rowIndex;
	try{
	rowIndex = bandM.XmlLandData.recordset.AbsolutePosition-1;
	}catch(ex){return;}
	var rootData=bandM.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex || rowIndex>=rootData.childNodes.length || rowIndex<0)
		return;
	var xmlRowData=rootData.childNodes[rowIndex];
	
	var colList=bandM.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var colName=colList[i].getAttribute("name");
		var dbType=colList[i].getAttribute("type");
		var xmlNodeFld=xmlRowData.selectSingleNode(colName);
		var value=(null==xmlNodeFld)?"":xmlNodeFld.text;
		ToolUtil.setParamValue(xmldoc, colName, value, dbType, "", "B", this.ItemName, "D");
    }
}
//硬刷新
_p.Refresh=function(fldName, strValue)
{
    this.QueryRefresh(this.queryType || "Refresh", fldName, strValue, "X")
}
//软刷新
_p.RefreshFilterFld=function(fldName, strValue)
{
    this.QueryRefresh("RefreshFilter", fldName, strValue,"X")
}
//增加一个显示checkbox的参数，为需显示checkbox的节点类型名称
_p.Query=function()
{
//    try
//    {
        var xmldoc=this.UnitItem.ParamXmldoc;
        //if(this.UnitItem.ParamXmldoc==null || this.UnitItem.ParamXmldoc.text=="")
        ToolUtil.resetParam(xmldoc);
        ToolUtil.delParam(xmldoc, "RecordCount", "B", this.ItemName, "C");
        ToolUtil.delParam(xmldoc, "FirstRow", "B", this.ItemName, "C");
        ToolUtil.delParam(xmldoc, "LastRow", "B", this.ItemName, "C");
        this.QueryRefresh(this.queryType || "Refresh");
//    }
//    catch(ex){};
}
_p.IsRefresh=function()
{
    if(!this.active) return true;
    //if(this.active && this.RecordCount()==0) return false;
    if(document.UnitItem.BandMaster.getFldStrValue(document.UnitItem.BandMaster.linkCol)==this.getFldStrValue(this.linkCol))
        return false
    else 
        return true;
}

_p.XQuery=function(blForce)
{
    if(!blForce)
        if(!this.IsRefresh()) return;
    var xmldoc=this.UnitItem.ParamXmldoc;
    ToolUtil.resetParam(xmldoc);
    ToolUtil.delParam(xmldoc, "RecordCount", "B", this.ItemName, "C");
    ToolUtil.delParam(xmldoc, "FirstRow", "B", this.ItemName, "C");
    ToolUtil.delParam(xmldoc, "LastRow", "B", this.ItemName, "C");
    this.QueryRefresh(blForce?"Query":"Refresh",null,null,"X");
}
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
//系统使用到的参数:UnitName,DataItem,WorkItem,FilterFast,Filter,FirstRow,LastRow;并且type是macro的标识,表明系统使用不放入参数环境中
//查询刷新数据:清除更新状态查询数据,保持更新状态主从记录变化的硬刷新数据,只从当前客户端还原的软刷新
// queryType:查询类别:Query,Refresh(默认),RefreshFilter; fldName 字段名称; strValue 字段值
_p.QueryRefresh=function(queryType, fldName, strValue, Ex)
{
    if("file:"==location.protocol ) return;
	if(!this.XmlSchema) return;
	if( !queryType ) queryType="Refresh";
	var strResult="";
    var xmlHttp=creatHttp();//;ToolUtil.XmlHttpInst();
	//if(("Query"==queryType || "Refresh"==queryType || "RefreshFilter"==queryType) && "file:"!=location.protocol )
	if(("Query"==queryType || "Refresh"==queryType || "Add"==queryType) && "file:"!=location.protocol )
	{
	    this.QPMS(Ex,fldName, strValue);
	    var xmldoc=this.UnitItem.ParamXmldoc;
	    var isasyn = (!this.Asyn)?false:true;
	    var struri = ToolUtil.SendPostX(xmldoc,Ex,isasyn);
	    var _ob = this;
    	//if(xmlHttp.onreadystatechange) xmlHttp.onreadystatechange = null;
        if(!isasyn) 
        {
            if(!isasyn) isasyn=false;
            try
	        {
                xmlHttp.open("POST",struri, isasyn);
                xmlHttp.send(xmldoc);
            }
            catch(ex){}        
            if(xmlHttp!=null || xmlHttp!="") this.active=true;
            else this.active=false;
            strResult = xmlHttp.responseXML.xml;
            var xmlHttpRes = xmlHttp.responseXML;
            this.SetXQuery(xmldoc,queryType,strResult,xmlHttpRes,fldName,strValue,Ex);
            delhttp(xmlHttp);
            //CollectGarbage();
        }
        else
        {
	       xmlHttp.onreadystatechange =  function(){ue_AfterAsynQuery(xmldoc,_ob,queryType,xmlHttp,fldName,strValue,Ex)};
	       xmlHttp.open("POST",struri, isasyn);
           xmlHttp.send(xmldoc);
        }
    }
    else 
        this.SetXQuery(xmldoc,queryType,strResult,null,fldName,strValue,Ex);
}
function delhttp(h)
{
    h.abort();
    delete h ; 
    h=null;
    setTimeout(CollectGarbage, 10);
}
function ue_AfterAsynQuery(xmldoc,ob,queryType,xmlHttp,fldName,strValue,Ex)
{
   if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
   {
        if(xmlHttp!=null || xmlHttp!="") ob.active=true;
        else ob.active=false;
        var strResult = xmlHttp.responseXML.xml;
        var xmlHttpRes = xmlHttp.responseXML;
        delhttp(xmlHttp);
        ob.SetXQuery(xmldoc,queryType,strResult,xmlHttpRes,fldName,strValue,Ex);
   }
}

_p.SetXQuery=function(xmldoc,queryType,strResult,xmlHttpRes,fldName,strValue,Ex)
{
    if(this.XmlLandData)
        this.rows = this.XmlLandData.XMLDocument.selectNodes("//"+this.DataItem);
    var obj = this.fixXml(xmldoc,queryType,strResult,xmlHttpRes,fldName,strValue);
    if(!obj) return;
    var root = obj.root;
    strValue = obj.strValue;
    fldName = obj.fldName;

    if(!this.XmlLandData.onrowenter && this.XmlLandData.onRowEnterHandle)
        this.XmlLandData.onrowenter=this.XmlLandData.onRowEnterHandle;

	if(this.XmlLandData && this.XmlLandData.XMLDocument && this.XmlLandData.XMLDocument.documentElement 
			&& this.XmlLandData.XMLDocument.documentElement.childNodes.length<1 && this.XmlLandData.onRowEnterHandle)
	{
       this.XmlLandData.onRowEnterHandle();
	}
	else if(!this.Tree)
	    this.setCurrentRow(0);
        
    //var xmldoc=this.UnitItem.ParamXmldoc;
    //设置页码区
    if(!this.XmlSum || !this.XmlSum.XMLDocument || !this.XmlSum.XMLDocument.documentElement)
    {
        ToolUtil.resetParam(xmldoc);
        return;
	}
	var root=this.XmlSum.XMLDocument.documentElement;
	var xmlNodePageIndex=root.selectSingleNode("/*/*/PageIndex");
	if(!xmlNodePageIndex) {alert("页码参数【PageIndex】不存在！");return;}
	var xmlNodeRdCount=root.selectSingleNode("/*/*/RecordCount");
	var xmlNodePageTotal=root.selectSingleNode("/*/*/TotalPage");
	var rowcount=this.RecordCount();
    var iPageSize=ToolUtil.Convert(this.XmlSchema.pagesize,"int");
    var iPageCount=-1;
    //if(("Query"==queryType || "Refresh"==queryType  || "RefreshFilter"==queryType) && "file:"!=location.protocol && this.DataItemCount)
    if(("Query"==queryType || "Refresh"==queryType) && "file:"!=location.protocol && this.DataItemCount)
    {
        var isasyn = (!this.Asyn)?false:true;
        var xmlDocCountHttp=this.getFilterContent(null,this.DataItemCount, fldName, strValue,Ex,isasyn,true);
        if(!isasyn)
        {
            var xmlDocCount = xmlDocCountHttp.responseXML;delhttp(xmlDocCountHttp); 
            this.SetCountQuery(xmlDocCount,rowcount,iPageCount,iPageSize,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex);
        }
        else
        {
            var _ob = this;
            xmlDocCountHttp.onreadystatechange =  function()
            {
                ue_AfterAsynQCount(_ob,xmlDocCountHttp,rowcount,iPageCount,iPageSize,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex)
            };
        }
    }
    else
        this.SetPageNum(rowcount,iPageCount,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex)
}
function ue_AfterAsynQCount(ob,xmlhttp,rowcount,iPageCount,iPageSize,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex)
{
   if(xmlhttp.readyState == 4 && xmlhttp.status == 200 && xmlhttp.responseXML.xml!="")
   {
        var xmlDocCount = xmlhttp.responseXML;delhttp(xmlhttp);
        ob.SetCountQuery(xmlDocCount,rowcount,iPageCount,iPageSize,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex);
   }
}

_p.SetCountQuery = function(xmlDocCount,rowcount,iPageCount,iPageSize,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex)
{
    var xmldoc=this.UnitItem.ParamXmldoc;
    ToolUtil.resetParam(xmldoc);
    if(xmlDocCount)
        var xmlNodeCount=xmlDocCount.selectSingleNode("/*/*/记录数量");
    if(xmlNodeCount)
    {
        rowcount=ToolUtil.Convert(xmlNodeCount.text,"int");
        iPageCount=Math.ceil(rowcount/iPageSize);
    }    
    this.SetPageNum(rowcount,iPageCount,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex);
}
function _setFocus(oband)
{return function(){x_setFocus(oband);}}

function x_setFocus(ob)
{
    if(!ob.Grid) return;
    ob.Grid.setRowCursor();
    ob.Grid.setRowsChecked();
    ob.Grid.setFocus();
    if(ob.Grid.Table.rows.length>0 && ob.Grid.Table.rows[0].cells.length>0)
        ob.Grid.setActiveCell(ob.Grid.Table.rows[0].cells[1]);    
}

//清空数据岛记录,以及子级记录,重置状态标识
_p.clearReset=function()
{
	if(this.RecordCount()<1)
		return;
	var onRowEnterHandle = this.XmlLandData.onrowenter;
	this.XmlLandData.onrowenter=null;
	while(this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes())
		this.XmldocFilter.documentElement.removeChild(this.XmldocFilter.documentElement.firstChild);
    if(this.XmlChanged)
	    while(this.XmlChanged.XMLDocument && this.XmlChanged.XMLDocument.documentElement.hasChildNodes())
		    this.XmlChanged.XMLDocument.documentElement.removeChild(this.XmlChanged.XMLDocument.documentElement.firstChild);
	while(this.XmlLandData.XMLDocument && this.XmlLandData.XMLDocument.documentElement.hasChildNodes())
		this.XmlLandData.XMLDocument.documentElement.removeChild(this.XmlLandData.XMLDocument.documentElement.firstChild);
    this.active=false;
	if(this.Tree) this.Tree.dataBind();
	for(var i=0;i<this.UnitItem.Bands.length;i++)
	{
	    if(this.UnitItem.Bands[i].NoAuto) continue;
        var BandD=this.UnitItem.Bands[i];
        if(this!=BandD.getBandM()) continue;
        BandD.clearReset();
        BandD.active=false;
    }
}

//清空数据岛记录,以及子级记录,重置状态标识
_p.close=function()
{
	if(this.RecordCount()<1)
		return;
	var onRowEnterHandle = this.XmlLandData.onrowenter;
	this.XmlLandData.onrowenter=null;
	while(this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes())
		this.XmldocFilter.documentElement.removeChild(this.XmldocFilter.documentElement.firstChild);
    if(this.XmlChanged)
	    while(this.XmlChanged.XMLDocument && this.XmlChanged.XMLDocument.documentElement.hasChildNodes())
		    this.XmlChanged.XMLDocument.documentElement.removeChild(this.XmlChanged.XMLDocument.documentElement.firstChild);
	while(this.XmlLandData.XMLDocument && this.XmlLandData.XMLDocument.documentElement.hasChildNodes())
		this.XmlLandData.XMLDocument.documentElement.removeChild(this.XmlLandData.XMLDocument.documentElement.firstChild);
    this.active=false;
	if(this.Tree) this.Tree.dataBind();
	for(var i=0;i<this.UnitItem.Bands.length;i++)
	{
	    if(this.UnitItem.Bands[i].NoAuto) continue;
        var BandD=this.UnitItem.Bands[i];
        if(this!=BandD.getBandM()) continue;
        BandD.clearReset();
        BandD.active=false;
    }
}


//读取字段的数据类型
_p.getDataType=function(fldname)
{
	var attrType=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+fldname+"']/@type");
	if(attrType)
		return ToolUtil.tranDBType(attrType.value);
	else
		return "string";
}

_p.RedefineXml=function()
{
	//项目的数据,结构,字典,汇总,删除区数据岛
	var  xmlLands=document.getElementsByTagName("XML");
	for(var i=0;i<xmlLands.length;i++)
	{
		if(!xmlLands[i].typexml || !xmlLands[i].name || "Schema"!=xmlLands[i].typexml || this.ItemName!=xmlLands[i].name)
			continue;
		this.XmlSchema=xmlLands[i];
		break;
	}
	for(var i=0;i<xmlLands.length;i++)
	{
		if(!xmlLands[i].typexml || !xmlLands[i].itemname || "Data"!=xmlLands[i].typexml || this.ItemName!=xmlLands[i].itemname)
			continue;
		this.XmlLandData=xmlLands[i];
		this.ID=xmlLands[i].id;
		break;
	}

}

_p.IsModify=function(mtype)
{
    
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		{this.modify=false;return false;}
    if(mtype) 
    {
        var xmlRowModified=this.XmlLandData.XMLDocument.selectSingleNode("/*/*[@state='"+mtype+"']");
        if(xmlRowModified)	{this.modify=true;return true;}
        else
            {this.modify=false;return false;}
    }
	var xmlRowModified=this.XmlLandData.XMLDocument.selectSingleNode("/*/*[@state!='init' and not(@opstate)]");
	if(xmlRowModified)		{this.modify=true;return true;}
	xmlRowModified=this.XmldocFilter.selectSingleNode("/*/*[@state]");
	if(xmlRowModified)		{this.modify=true;return true;}
	xmlRowModified=this.XmlChanged.selectSingleNode("/*/*[@state]");
	if(xmlRowModified)	{this.modify=true;return true;}
	//具有级联明细的段
	for(var i=0;i<this.UnitItem.Bands.length;i++)
	{
	    if(this.UnitItem.Bands[i].NoAuto) continue;
        var BandD=this.UnitItem.Bands[i];
        if(this != BandD.getBandM())
            continue;
        if(BandD.IsModify())
            {this.modify=true;return true;}
    }
    this.modify=false;
	return false;
}

_p.getStateRecord=function()
{
    return "";
}
//对Grid增加新记录,返回行的xmlNode节点
_p.NewRecord=function(rowIndex)
{
	//如果是主从关系,主表没有数据时从表不进行增加新记录的操作
	var bandM=this.getBandM();
	if(bandM && bandM.RecordCount()<1 )
		return null;
	if(this.itemType=="Detail"){
	    if(bandM.getFldStrValue(bandM.linkCol)==""){
	        //alert("主表的关联字["+bandM.linkCol+"]不能为空！");
	        //alert("主表数据不能为空！");
//	        return;
	    }
	}
	this.XmlLandData.onrowenter=null;
	if(!this.XmlLandData.XMLDocument.documentElement)
		this.XmlLandData.XMLDocument.appendChild(this.XmlLandData.XMLDocument.createElement("DataSet"));
	var root=this.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex || rowIndex>this.XmlLandData.XMLDocument.documentElement.childNodes.length || rowIndex<0)
	    rowIndex=root.childNodes.length;
	//建立行记录节点
	var xmlNodeRow=null;
	var strBaseName="";
	if(root.hasChildNodes())
		strBaseName=root.firstChild.baseName;
	if(""==strBaseName && this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes() )
		strBaseName=this.XmldocFilter.documentElement.firstChild.baseName;
	if(""==strBaseName && this.XmlChanged.documentElement.hasChildNodes())
		strBaseName=this.XmlChanged.documentElement.firstChild.baseName;
	if(""==strBaseName)
		strBaseName=this.DataItem;
	xmlNodeRow=this.XmlLandData.XMLDocument.createElement(strBaseName);
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var colname=colList[i].getAttribute("name");
		var xmlNode=xmlNodeRow.appendChild(xmlNodeRow.ownerDocument.createElement(colname));
		var colformat=colList[i].getAttribute("formatfld");
		if(colformat && ""!=colformat)
			xmlNodeRow.appendChild(xmlNodeRow.ownerDocument.createElement(colformat));
		if("RowNum"==colname)
		    xmlNode.text=rowIndex+1;
	}
	//计算新记录行号
	if(rowIndex<this.RecordCount())
		xmlNodeRow=root.insertBefore(xmlNodeRow,this.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex]);
	else
		xmlNodeRow=root.appendChild(xmlNodeRow);
	//数据岛在服务端就创建一个空行来保证数据岛的结构;所以就减少了客户端的生成
	if(null==this.XmlLandData.recordset.Fields || this.XmlLandData.recordset.Fields.Count<colList.length)
	{
		this.XmlLandData.XMLDocument.loadXML(this.XmlLandData.XMLDocument.xml);
		xmlNodeRow=this.XmlLandData.XMLDocument.documentElement.childNodes[0];
	}
	this.SynSrc=true;
	this.initRow(rowIndex);
	if(this.Grid) this.Grid.Sum();
	else this.Sum();
	//同步段的数据
	for(var i=0;!this.SynDest && i<this.SynchBands.length;i++)
	{
	    //新行为当前行
	    var bandSyn=this.SynchBands[i];
	    if(bandSyn.SynDest)  continue;
	    else bandSyn.SynDest=true;
	    if(bandSyn.Tree)
	    {
	        var trvNode=bandSyn.Tree.WebTree.getSelectedNode();
	        trvNode=bandSyn.Tree.newChild(trvNode);
	        var nodeID=this.getFldStrValue(bandSyn.Tree.IDField,rowIndex);
	        bandSyn.Tree.setValueByTrvNode(trvNode,bandSyn.Tree.IDField,nodeID);
	        bandSyn.setFldStrValue(bandSyn.XmlLandData.recordset.recordCount-1,bandSyn.Tree.IDField,nodeID);
		}else
		    bandSyn.NewRecord();
		bandSyn.setRowValue(xmlNodeRow,bandSyn.XmlLandData.recordset.recordCount-1);
		bandSyn.SynDest=false;
	}
	try{
	    //if(this.XmlLandData.recordset.EOF && this.XmlLandData.recordset.BOF){alert("数据错误,请重新进入!");return;}
        this.XmlLandData.recordset.AbsolutePosition=rowIndex+1;
        //在没有记录时触发行改变事件会引起堆栈溢出
        if(this.XmlLandData.onRowEnterHandle) this.XmlLandData.onRowEnterHandle();
        if(this.XmlLandData.onRowEnterHandle && this.RecordCount()>0)
            this.XmlLandData.onrowenter=this.XmlLandData.onRowEnterHandle;
	    this.SynSrc=false;
	    this.Event.rowIndex=(rowIndex<0)?0:rowIndex;
	    this.FireEvent("AfterNewRecord");
	    this.active = true;
	}catch(ex){};
	return	xmlNodeRow;
}
//初始化行
_p.initRow=function(rowIndex)
{
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex<0 || rowIndex>=this.RecordCount())
		return null;
	var xmlNodeRow=this.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
	//如果是主表,给主表关联列赋初值
    var strXPath=".//Item[@masteritem='"+this.ItemName+"']";
    var nodeBand=this.UnitItem.XmlConf.XMLDocument.selectSingleNode(strXPath);
    if(nodeBand || ("Master"==this.itemType))
	    if(this.linkColM && ""!=this.linkColM)
	    {
		    var xmlNodeLink=xmlNodeRow.selectSingleNode(this.linkColM);
		    var xmlColLink=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+this.linkColM+"']");
		    if(xmlColLink)
		    {
		        var strMsType=xmlColLink.getAttribute("msdata:DataType");
		        if(strMsType && strMsType.indexOf("System.Guid")>-1)
			        xmlNodeLink.text=ToolUtil.NewGUID();
	            else if(this.UnitItem.BillType && "单据编号"==this.linkColM)
	                xmlNodeLink.text=ToolUtil.NewDJBH(this.UnitItem.BillType);
		        else{
			        if(!this.sequence)	this.sequence=0;
			        this.sequence++;
			        xmlNodeLink.text=this.sequence+"";
		        }
		    }
	    }
	//对主从表,关联字段赋初值
	if("Detail"==this.itemType || (""!=this.MasterItemName && null!=this.MasterItemName) )
	{
        var bandM=this.getBandM();
		if(bandM && null!=this.linkCol && ""!=this.linkCol)
		{
		    var xmlNodeLink=xmlNodeRow.selectSingleNode(this.linkCol);
		    if(xmlNodeLink)
		    {
		        var strvalue=bandM.getFldStrValue(bandM.linkColM);
		        xmlNodeLink.text=strvalue;
		    }
		}
	}
    if(this.keyCol && ""!=this.keyCol)
    {
	    var xmlNodeKey=xmlNodeRow.selectSingleNode(this.keyCol);
	    if(xmlNodeKey)
	    {
	        var xmlColKey=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+this.keyCol+"']");
	        var strMsType=xmlColKey.getAttribute("msdata:DataType");
	        if("ID"==this.keyCol.toUpperCase() || (strMsType && strMsType.indexOf("System.Guid")>-1))
	        {
	            if(null==xmlNodeKey.text || ""==xmlNodeKey.text)
		            xmlNodeKey.text=ToolUtil.NewGUID();
	        }else{
		        if(!this.sequence)	this.sequence=0;
		        this.sequence++;
		        xmlNodeKey.text=this.sequence+"";
	        }
	    }
    }
	//设置初始状态
	this.setStateRecord("new",rowIndex);    
    //初始化字段值
	this.CalXmlLand.Calculate(rowIndex,"0");
	var xmlNodeColList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[@filterdata]");
	for(var i=0;xmlNodeColList && i<xmlNodeColList.length;i++)
		this.setSelectContent(xmlNodeColList[i].getAttribute("name"),rowIndex);		
}
//设置记录状态:new,modify,delete并保持其协调性
_p.setStateRecord=function(state,rowIndex,dataRange,force)
{
	if(!state || this.RecordCount()<1)
		return;
    dataRange=dataRange? dataRange.toLowerCase():"data";
    var xmldoc=this.XmlLandData.XMLDocument;
    if("filter"==dataRange)
        xmldoc=this.XmldocFilter;
    if(!xmldoc || !xmldoc.documentElement)
        return "";
	var root=xmldoc.documentElement;
	if(null==rowIndex && root.childNodes.length>0 && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return;
	var xmlNodeRow=root.childNodes[rowIndex];
	var stateold=xmlNodeRow.getAttribute("state");
    var xmlNodeKey=null;
    if(this.keyCol && ""!=this.keyCol)
	    xmlNodeKey=xmlNodeRow.selectSingleNode(this.keyCol);
    if(xmlNodeKey)
	    xmlNodeRow.setAttribute("keyvalue",xmlNodeKey.text);
	//更新状态
	if(state==stateold)     return;
	if("init"==stateold && ("new"==state || "modify"==state))
	    xmlNodeRow.setAttribute("state","new");
	else if("delete"==state && ("init"==stateold || "new"==stateold) )
	    xmlNodeRow.removeAttribute("state");
	else if("remove"==state)
	    xmlNodeRow.removeAttribute("state");
	else if("modify"==stateold && "delete"==state)
	    xmlNodeRow.setAttribute("state","delete");
	else if((!stateold || ""==stateold) )
	    xmlNodeRow.setAttribute("state",state);
	else
	    if(force)
	    {
	        if(("new"==state || "modify"==state))
	            xmlNodeRow.setAttribute("state",state);
	        else return
	    }
	    else  return;
}
_p.cmd_nav=function(nav,pageindex)
{
	if("next"!=nav && "prev"!=nav && "first"!=nav && "last"!=nav && "jump"!=nav)
		return;
	var iPageSize=ToolUtil.Convert(this.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	var iPageIndex=this.getFldStrValueSum("PageIndex");
	var iPageIndex=ToolUtil.Convert(iPageIndex,"int");
	if(null==iPageIndex || isNaN(iPageIndex))
		iPageIndex=1;
	var iTotalPage=this.getFldStrValueSum("TotalPage");
	var iTotalPage=ToolUtil.Convert(iTotalPage,"int");
	if(null==iTotalPage || isNaN(iTotalPage))
		iTotalPage=1;
	if(iTotalPage<2)    return;
	var istart=0;ilast=10;  //1-10条记录
	var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
	switch(nav)
	{
	    case "first":
	        if(iPageIndex<2)    return;
	        istart=0;ilast=iPageSize;
	        xmlNodePageIndex.text=1;
	        break;
	    case "prev":
	        if(iPageIndex<2)    return;
	        istart=iPageSize*(iPageIndex-2);ilast=iPageSize*(iPageIndex-1);
	        xmlNodePageIndex.text=iPageIndex-1;
	        break;
	    case "next":
	        if(iPageIndex>=iTotalPage)  return;
	        istart=iPageSize*iPageIndex;ilast=iPageSize*(iPageIndex+1);
	        xmlNodePageIndex.text=iPageIndex+1;
	        this.setFldSumStrValue("PageIndex",iPageIndex+1);
	        break;
	    case "last":
	        if(iPageIndex>=iTotalPage)  return;
	        istart=iPageSize*(iTotalPage-1);ilast=iPageSize*iTotalPage;
	        xmlNodePageIndex.text=iTotalPage;
	        break;
	    case "jump":
	        if(null==pageindex || pageindex<1 || pageindex>iTotalPage)
	            return;
	        if(iPageIndex==pageindex)   return;
	        istart=iPageSize*(pageindex-1);ilast=iPageSize*pageindex;
	        xmlNodePageIndex.text=pageindex;
	        break;
	    default:    return;
	}
	var xmldoc=this.UnitItem.ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "FirstRow", istart, "", "B", this.ItemName, "C", "M");
	ToolUtil.setParamValue(xmldoc, "LastRow", ilast, "", "B", this.ItemName, "C", "M");
	var bandM=this.getBandM();
	if(bandM)
	    var linkvalue=bandM.getFldStrValue(bandM.linkColM);
	this.Refresh(this.linkCol,linkvalue);
//	ueBindGrid(this);
//	this.FireEvent("AfterNavPage");
	return;
}

//执行命令
_p.ExecutCmd=function(itemcmd)
{
    var xmldoc=this.UnitItem.ParamXmldoc;
    this.BuildParamSelf();
    ToolUtil.setParamValue(xmldoc, "Command", "Cmd_Cmd", "", "P", "", "T");
    ToolUtil.setParamValue(xmldoc, "DataItem", itemcmd, "", "P", "", "T");
    var strResult="";
    try{
        var xmlhttp=ToolUtil.SendPost(xmldoc);
        strResult=unescape(xmlhttp.responseText);
    }catch(ex){
	    var strResult=ToolUtil.setValueTag("","成功","false");
	    strResult=ToolUtil.setValueTag(strResult,"提示","系统出错:请重新登录后重试!");
    }
    return strResult;
}

//加载脚本
_p.Loadjs=function(args,funname)
{
    if(!args || !funname || ""==funname)
        return;
    GridUtil.Loadjs(GridUtil.BandAdv);
    //this.fun=arguments.callee;
    this.tempfun=function(){};
    eval('this.tempfun=this.'+funname);
    if("function"!=typeof(this.tempfun))
        return;
    return this.tempfun.apply(this,args);
    
}

   //从xml文档生成浏览表格(不包含序号列,表格自动生成序号)
   // srcdiv - 源div,xmldata - 数据;tablename - 表格名，colnames - 列名字串;strwidths - 宽度字串;
   function us_gridbyxml(srcdiv,xmldata,tablename,colnames,strwidths)
   {
        // 框架及表头
        var gridtop = 
            ["<div id='etpTemplate_MasterTab_GridDiv' style='height:100%;width:100%;'>"+
            "<table class='GridWB' cellpadding='0' cellSpacing='0' style='width:100%;height:100%' tabType='grid'>"+
            "  <tbody>"+
            "    <tr>"+
            "      <td id='tdbody' divtype='body' colspan='4' valign='top'>"+
            "        <div id='dvtitle' divtype='title' align='left' class='ws'  style='overflow-x:auto;overflow-y:scroll;width:100%'>"+
            "          <table tabType='title' class='ctabTitle' cellpadding='0' cellSpacing='0'>"+
            "            <tbody>"];
        var strcols = "";
        var xmlrows = xmldata.selectNodes("//"+tablename);
        if(!colnames)
        {
            var xmlfirst = getxmlrow(xmldata,0);
            for(var i=0;i<xmlfirst.childNodes.length;i++)
                strcols = strcols + "," + xmlfirst.childNodes[i].nodeName;
        }
        else strcols = ","+colnames;
        //增加序号列
        strcols   = "序号"+strcols;
        cols=strcols.split(",");
        var widths;
        if(strwidths) widths=strwidths.split(",");
        for(var i = 0; i < 1; i++)
        {
            gridtop.push("<tr rowType='title'>");
            for(var j = 0; j < cols.length; j++)
            {
                var _sw="";
                if(j==0) _sw = " width='45px'";
                else
                    if(widths && widths[j-1]!="") _sw = " width="+ widths[j-1];
                gridtop.push("<td class='cellwb_btn'"+ _sw +">" + cols[j] +"</td>");
            }
            gridtop.push("</tr>"); 
        }
        gridtop.push("<tbody></table></div>");
        // ---------------------------------------------------------------//
        var sdetail = "<div id='dvdetail' divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%'>"
          +"<table width='100%' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0' >"
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
                    gridtop.push("<td class='cellwb_btn'"+ _sw +">"+ colvalues +"</td>");
                }
                else
                {
                    if(widths && widths[j-1]!="") _sw = " width="+ widths[j-1];
                    var colvalues = xmlrows[i].childNodes[j-1].text;
                    gridtop.push("<td class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                }
            }
            gridtop.push("</tr>"); 
        }
        gridtop.push("</tbody></table></div></td></tr></tbody></table></div>"); 
        srcdiv.outerHTML = gridtop.join("");   

        var tabdiv = document.getElementById("etpTemplate_MasterTab_GridDiv");
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
	    var DivBody    =   document.getElementById("tdbody");   //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	    var DivDetail  =   document.getElementById("dvdetail"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	    var DivTitle   =   document.getElementById("dvtitle"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");

	    if(DivBody.style.height.indexOf("%")<0)
	        DivBody.style.height   =   tabdiv.style.height;

	    if(DivDetail.style.height.indexOf("%")>-1)
	    {
	        _h = DivBody.offsetHeight-DivTitle.offsetHeight;
	        if(_h>0)
	        {
                DivDetail.style.pixelHeight = _h;
                var _height = parseInt(DivDetail.style.height.replace("%",""));
                if(_height>100)
                    DivDetail.style.height = _height/100+"%";
            }
        }
   }   

   //从xml文档生成浏览表格(不包含序号列,表格自动生成序号)
   // srcdiv - 源div,xmldata - 数据;tablename - 表格名，colnames - 列名字串;strwidths - 宽度字串;
   function us_GridByAjax(srcdiv,xmldata,tablename,type,colnames,minwidth,nosum)
   {
        // 框架及表头
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
            datatypes = ("int,"+xmldata.selectNodes("//xstructs/datatype")[0].text).split(",");
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
        var sums = new Array(colids.length);
        for(var i=0;i<sums.length;i++) sums[i]=0; 
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
                    if(parseInt(widths[j-1])<=30) widths[j-1] = minwidth;
                    if(widths[j-1]=="") _sw="";
                    else _sw = " width="+ widths[j-1];
                }
                gridtop.push("<td align='center' height=22px class='cellwb_btn'"+ _sw +">" + cols[j] +"</td>");
            }
            gridtop.push("</tr>"); 
        }
        gridtop.push("<tbody></table></div>");
        // ---------------------------------------------------------------//
        var sdetail = "<div id='"+ srcdiv +"_dvdetail' divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%'>"
          +"<table width='100%' id='"+ srcdiv +"_detail' onclick='clickIt()' ondblclick='dblclickIt()' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0' onmousemove='overIt();' onmouseout='outIt();'>"
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
                    
                    if(parseInt(widths[j-1])<=30) widths[j-1] = minwidth;
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
                            if(blname==cols[j] || colxml.indexOf("radio")>-1)
                            {
                                colvalues = '<input type="radio" value="V1" name="'+blname+'">';
                                gridtop.push("<td align='center' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                            }
                            else
                            {
                                    if(colvalues=="" || colvalues=="0") colvalues="　";
                                    if(datatypes && datatypes[j])
                                    {
                                        var dtype = datatypes[j].toLowerCase();
                                        if(dtype.indexOf("int")>-1 || dtype.indexOf("float")>-1 || dtype.indexOf("double")>-1 || dtype.indexOf("decimal")>-1 || colids[j].indexOf("金额")>-1)
                                        {
                                            gridtop.push("<td align='right' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                            sums[j]=ToolUtil.Convert(sums[j],"int")+ToolUtil.Convert(colvalues,"int");
                                        }
                                    else
                                        gridtop.push("<td name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                    }
                                    else
                                        if(colids[j].indexOf("金额")>-1)
                                        {
                                            gridtop.push("<td align='right' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                            sums[j]=ToolUtil.Convert(sums[j],"int")+ToolUtil.Convert(colvalues,"int");
                                        }
                                        else if(colids[j].indexOf("时间")>-1)
                                            gridtop.push("<td align='center' name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                                        else gridtop.push("<td name='"+colids[j]+"' class='cellStyle'"+ _sw +">"+ colvalues +"</td>");
                            }
                        }
                    }
                }
            }
            gridtop.push("</tr>"); 
        }
        //合计处理,缺省有合计
        if(!nosum)
        {
            gridtop.push("<tr>");
            for(var j = 0; j < cols.length; j++)
            {
                var _sw="";
                if(j==0)
                { 
                    _sw = " width='45px'";
                    var colvalues = xmlrows.length+1;
                    gridtop.push("<td align='center'name='序号' height=20px class='cellwb_btn'"+ _sw +">合计:</td>");
                }
                else
                {                    
                    
                    if(widths[j-1]=="") _sw="";
                    else _sw = " width="+ widths[j-1];
                    var colvalues="";
                    var colxml="";
                    colvalues = sums[j];
                    if(colvalues=="" || colvalues=="0") colvalues="　";
                    if(datatypes && datatypes[j])
                    {
                        var dtype = datatypes[j].toLowerCase();
                        if(dtype.indexOf("int")>-1 || dtype.indexOf("float")>-1 || dtype.indexOf("double")>-1 || dtype.indexOf("decimal")>-1 || colids[j].indexOf("金额")>-1)
                        {
                            gridtop.push("<td align='right' name='"+colids[j]+"' class='cellwbb'"+ _sw +">"+ colvalues +"</td>");
                            sums[j]=ToolUtil.Convert(sums[j],"int")+ToolUtil.Convert(colvalues,"int");
                        }
                        else  gridtop.push("<td name='"+colids[j]+"' class='cellwbb'"+ _sw +">"+ colvalues +"</td>");
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
	    var DivBody    =   document.getElementById(srcdiv +"_tdbody");   //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	    var DivDetail  =   document.getElementById(srcdiv +"_dvdetail"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	    var DivTitle   =   document.getElementById(srcdiv +"_dvtitle"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");

	    if(DivBody.style.height.indexOf("%")<0)
	        DivBody.style.height   =   tabdiv.style.height;

	    if(DivDetail.style.height.indexOf("%")>-1)
	    {
	        _h = DivBody.offsetHeight-DivTitle.offsetHeight;
	        if(_h>0)
	        {
                DivDetail.style.pixelHeight = _h;
                var _height = parseInt(DivDetail.style.height.replace("%",""));
                if(_height>100)
                    DivDetail.style.height = _height/100+"%";
            }
        }
        document.getElementById(srcdiv).tag=xmldata.xml;
        return xmlrows.length;
   }   

   //从xml文档生成浏览表格(不包含序号列,表格自动生成序号)
   // srcdiv - 源div,xmldata - 数据;tablename - 表格名，colnames - 列名字串;strwidths - 宽度字串;
   function us_GridByBand(srcdiv,oband,type,minwidth)
   {
        // 框架及表头
        if(!oband) {alert("数据错误,请检查！");return;};
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
        var cols = oband.Cols("1");
        //判断是否有Boolean类型的字段
        var blname = "";
        var strwidths;
        gridtop.push("<tr rowType='title'>");
        for(var j = 0; j < cols.length; j++)
        {
            var colitem     = oband.ColObj(cols[j]);
            if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
            if(colitem.width=="") _sw="";
            else _sw = " width="+ colitem.width;
            var colname = colitem.name;
            var coltitle = colitem.title;
            gridtop.push("<td align='center' height=22px colname='"+colname+"' class='cellwb_btn'"+ _sw +">" + coltitle +"</td>");
        }
        gridtop.push("</tr>"); 
        gridtop.push("<tbody></table></div>");
        // ---------------------------------------------------------------//
        var sdetail = "<div id='"+ srcdiv +"_dvdetail' divtype='detail' class='tablescroll' style='overflow-x:auto;overflow-y:scroll;height:100%;width:100%'>"
          +"<table width='100%' id='"+ srcdiv +"_detail' onclick='clickIt()' ondblclick='dblclickIt()' tabType='detail' class='ctabDetail' cellpadding='0' cellSpacing='0' onmousemove='overIt();' onmouseout='outIt();'>"
          +"<tbody>";
        gridtop.push(sdetail);
        var rnt = oband.RecordCount();
        for(var i = 0; i < rnt; i++)
        {
            gridtop.push("<tr>");
            for(var j = 0; j < cols.length; j++)
            {
                var colitem     = oband.ColObj(cols[j]);
                if(parseInt(colitem.width)<=minwidth) colitem.width = minwidth;
                if(colitem.width=="") _sw="";
                else _sw = " width="+ colitem.width;                    
                var colvalues="";
                var colxml="";
                colvalues = oband.getFldStrValue(colitem.name,i);
                if(colvalues=="") colvalues="　";
                var align="left";
                var strclass = "cellStyle";
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
                        if(colitem.name=="RowNum") {align="center";strclass="cellwb_btn"}
                        else align="right";
                        break;
                }
                var _id = oband.ItemName + colitem.name + "_" + i;
                var tdtext = "<td align='"+ align +"' colname='"+colitem.name+"' id='"+_id+"' class='"+ strclass +"'"+ _sw +">"+ colvalues +"</td>";
                gridtop.push(tdtext);
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
	    var DivBody    =   document.getElementById(srcdiv +"_tdbody");   //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	    var DivDetail  =   document.getElementById(srcdiv +"_dvdetail"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	    var DivTitle   =   document.getElementById(srcdiv +"_dvtitle"); //ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");

	    if(DivBody.style.height.indexOf("%")<0)
	        DivBody.style.height   =   tabdiv.style.height;

	    if(DivDetail.style.height.indexOf("%")>-1)
	    {
	        _h = DivBody.offsetHeight-DivTitle.offsetHeight;
	        if(_h>0)
	        {
                DivDetail.style.pixelHeight = _h;
                var _height = parseInt(DivDetail.style.height.replace("%",""));
                if(_height>100)
                    DivDetail.style.height = _height/100+"%";
            }
        }
        document.getElementById(srcdiv).tag=oband.XmlLandData.xml;
        return rnt;
   }   
    


   function getxmlrow(xmldoc,rowIndex)
    {
        if(!xmldoc)   return "";
        if(!xmldoc || !xmldoc.documentElement)
            return null;    
	    var root=xmldoc.documentElement;
	    if(null==rowIndex && root.childNodes.length>0)
		    rowIndex=xmldoc.recordset.AbsolutePosition-1;
	    if(null==rowIndex || rowIndex>=root.childNodes.length || rowIndex<0)
		    return "";
	    return root.childNodes[rowIndex];
    }

var cur_row    = null;
var cur_col    = null;
var cur_cell    = null;
var show_col    = false;
var sort_col    = null;

var act_bgc    = "#FFDF6B";
var act_fc    = "black";
var cur_bgc    = "#3A7B9C";
var cur_fc    = "white";



var curOverBgColor="#E8E8E8";
var curOverFacColor="black";

var browseBgColor="white";
var browseFacColor="black";

var selBgColor="#00309C";
var selFacColor="white";

function overIt(){
    var the_obj = event.srcElement;
    var i = 0;
    if(the_obj.tagName.toLowerCase() != "table"){
        var the_td    = get_Element(the_obj,"td");
        if(the_td==null) return;
        var the_tr    = the_td.parentElement;
        var the_table    = get_Element(the_td,"table");
        for(i=0;i<the_tr.cells.length;i++){
            with(the_tr.cells[i]){
                runtimeStyle.backgroundColor=curOverBgColor;
                runtimeStyle.color=curOverFacColor;                    
            }
        }        
/*
        if(the_tr.rowIndex!=0){
            for(i=0;i<the_tr.cells.length;i++){
                with(the_tr.cells[i]){
                    runtimeStyle.backgroundColor=curOverBgColor;
                    runtimeStyle.color=curOverFacColor;                    
                }
            }
        }else{
            for(i=1;i<the_table.rows.length;i++){
                with(the_table.rows[i].cells(the_td.cellIndex)){
                    runtimeStyle.backgroundColor=curOverBgColor;
                    runtimeStyle.color=curOverFacColor;
                }
            }
            if(the_td.mode==undefined)the_td.mode = false;
            the_td.style.cursor=the_td.mode?"n-resize":"s-resize";
        }
 */
    }
}

function outIt(){
    var the_obj = event.srcElement;
    var i=0;
    if(the_obj.tagName.toLowerCase() != "table"){
        var the_td    = get_Element(the_obj,"td");
        if(the_td==null) return;
        var the_tr    = the_td.parentElement;
        var the_table    = get_Element(the_td,"table");
        for(i=0;i<the_tr.cells.length;i++){
            with(the_tr.cells[i]){
                runtimeStyle.backgroundColor='';
                runtimeStyle.color='';                
            }
        }
        
        /*
        if(the_tr.rowIndex!=0){
            for(i=0;i<the_tr.cells.length;i++){
                with(the_tr.cells[i]){
                    runtimeStyle.backgroundColor='';
                    runtimeStyle.color='';                
                }
            }
        }else{
            var the_table=the_tr.parentElement.parentElement;
            for(i=0;i<the_table.rows.length;i++){
                with(the_table.rows[i].cells(the_td.cellIndex)){
                    runtimeStyle.backgroundColor='';
                    runtimeStyle.color='';
                }
            }
        }
        */
    }
}

function get_Element(the_ele,the_tag){
    the_tag = the_tag.toLowerCase();
    if(the_ele.tagName.toLowerCase()==the_tag) return the_ele;
    if(the_ele.parentElement.tagName.toLowerCase()==the_tag) return the_ele.parentElement;
    while(the_ele = the_ele.offsetParent)
    {
        if(the_ele.tagName.toLowerCase()==the_tag)
        return the_ele;
    }
    return(null);
}

function dblclickIt(){
//    event.cancelBubble=true;
//    if(cur_row!=0){
//        var the_obj = event.srcElement;
//        if(the_obj.tagName.toLowerCase() != "table" && the_obj.tagName.toLowerCase() != "tbody" && the_obj.tagName.toLowerCase() != "tr"){
//            var the_td    = get_Element(the_obj,"td");
//            if(the_td==null) return;
//            cur_cell    = the_td;
//            if(the_td.children.length!=1)
//                the_td.innerHTML="<div>" + the_td.innerHTML + "</div>";
//            else if(the_td.children.length==1 && the_td.children[0].tagName.toLowerCase()!="div")
//                the_td.innerHTML="<div>" + the_td.innerHTML + "</div>";
//            cur_cell.children[0].contentEditable = true;
//            with(cur_cell.children[0].runtimeStyle){
//                borderRight=borderBottom="buttonhighlight 1px solid";
//                borderLeft=borderTop="black 1px solid";
//                backgroundColor="#dddddd";
//                paddingLeft="5px";
//                //textAlign="center";
//            }
//        }
//    }
}
function clickIt(){
    event.cancelBubble=true;
    var the_obj = event.srcElement;
    var i = 0 ,j = 0;
    if(cur_cell!=null && cur_row!=0)
    {
        cur_cell.children[0].contentEditable = false;
        with(cur_cell.children[0].runtimeStyle)
        {
            borderLeft=borderTop="";
            borderRight=borderBottom="";
            backgroundColor="";
            paddingLeft="";
            textAlign="";
        }
                
    }

    if(the_obj.tagName.toLowerCase() != "table" && the_obj.tagName.toLowerCase() != "tbody" && the_obj.tagName.toLowerCase() != "tr")
    {
        var the_td    = get_Element(the_obj,"td");
        if(the_td==null) return;
        var the_tr    = the_td.parentElement;
        var the_table    = get_Element(the_td,"table");
        var i         = 0;
        clear_color(the_table);
        cur_row = the_tr.rowIndex;
        cur_col = the_td.cellIndex;
        //alert("当前坐标：行="+cur_row+"列="+cur_col);
        if(typeof(gridexonclick)=="function")	gridexonclick();
        for(i=0;i<the_tr.cells.length;i++)
        {
            with(the_tr.cells[i])
            {
                style.backgroundColor=cur_bgc;
                style.color=cur_fc;
            }
        }
    }    
}

function clear_color(the_table){
    //the_table=Main_Tab;
    if(cur_col!=null){
        for(i=0;i<the_table.rows.length;i++)
        {
            if(the_table.rows[i].cells[cur_col])
                with(the_table.rows[i].cells[cur_col])
                {
                      style.backgroundColor=browseBgColor;
                      //if(typeof(g_alarmcolor) =="undefined")
                          style.color=browseFacColor;   
                      //else
                     //   style.color=g_alarmcolor;
                }
        }
    }
    if(cur_row!=null && the_table.rows[cur_row]){
        for(i=0;i<the_table.rows[cur_row].cells.length;i++)
        {
            with(the_table.rows[cur_row].cells[i]){
                style.backgroundColor=browseBgColor;
                //if(typeof(g_alarmcolor) =="undefined")
                  style.color=browseFacColor;   
                //else
                //    style.color=g_alarmcolor;
            }
        }
    }
    if(cur_cell!=null){
        cur_cell.children[0].contentEditable = false;
        with(cur_cell.children[0].runtimeStyle){
            borderLeft=borderTop="";
            borderRight=borderBottom="";
            backgroundColor="";
            paddingLeft="";
            textAlign="";
        }
    }
}

_p.getRowIndex=function(Keyword,Keyvalue)
{
    if(!this.XmlLandData)   return -1;
    var strXPath="/*/*["+Keyword+"='"+Keyvalue+"']";
    var xmlNodeRows=this.XmlLandData.XMLDocument.selectNodes(strXPath);
    if(xmlNodeRows.length==0) return -1;
    var xmlNode=xmlNodeRows[0].selectSingleNode("RowNum");
    iRow = parseInt(xmlNode.text)-1;
    return iRow;
}
_p.getRowIndexs=function(Keywords,Keyvalues)
{
    if(!this.XmlLandData)   return -1;
    s="";
    for(var i=0;i<Keywords.length;i++)
        s = s+" and " + Keywords[i]+"='"+Keyvalues[i]+"'";
    if(s.length>4) s=s.substring(4,s.length);
    var strXPath="/*/*["+s+"]";
    //var strXPath="/*/*["+Keyword+"='"+Keyvalue+"']";
    var xmlNodeRows=this.XmlLandData.XMLDocument.selectNodes(strXPath);
    if(xmlNodeRows.length==0) return -1;
    var xmlNode=xmlNodeRows[0].selectSingleNode("RowNum");
    iRow = parseInt(xmlNode.text)-1;
    return iRow;
}

//通过关键字段的值取得某字段值
_p.getValByBandKey=function(Keyword,Keyvalue,fldname)
{
    if(!this.XmlLandData)   return -1;
    var strXPath="/*/*["+Keyword+"='"+Keyvalue+"']";
    var xmlNodeRows=this.XmlLandData.XMLDocument.selectNodes(strXPath);
    if(xmlNodeRows.length==0) return -1;
    var xmlNode=xmlNodeRows[0].selectSingleNode(fldname);
    if(xmlNode)
        return xmlNode.text;
    else return "";
}

//xmlRow为提供的数据,根据Xml行数据设置指定行的数据;如果xml行数据的节点名不属于本段结构,就忽略该节点
//noflds 不需要插入的字段集
_p.setRowValue=function(xmlRow,rowIndex,noflds,trflds,isAdd,sumfld,xpath)
{
	if(!xmlRow || !xmlRow.hasChildNodes())
		return;
	if(this.RecordCount()<1)
		return;
	root=this.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return;
    if(noflds) noflds=noflds.split(",");
    var _chks = (xpath && xpath.length>0)?xmlRow.selectNodes("."+xpath.substring(1,xpath.length)):"";
    if(_chks && _chks.length>0 && isAdd && sumfld)
        this.setFldStrValue(rowIndex,sumfld,parseInt(this.getFldStrValue(sumfld,rowIndex),10)+1);
    else{
	    for(var i=0;i<xmlRow.childNodes.length;i++)
	    {
	        var selffld = xmlRow.childNodes[i].baseName;
	        if(trflds){
	            selffld = ToolUtil.valueTag(trflds,selffld);
	            if(!selffld) selffld=xmlRow.childNodes[i].baseName;
	        }
		    var xmlNodeTest=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='" + selffld + "']");
		    if(!xmlNodeTest)	continue;
		    if("RowNum"==xmlRow.childNodes[i].baseName)
		        continue;
		     var noset=false;
		    if(noflds)
		    {
		        for(var m=0;m<noflds.length;m++)
		        {
		            if(xmlRow.childNodes[i].baseName==noflds[m].trim())
		            {
		                noset=true;
		                break;
		            }
		        }
		        if(!noset)
		        {
		            this.setFldStrValue(rowIndex,selffld,xmlRow.childNodes[i].text);
		        }
		    }
		    else
		        this.setFldStrValue(rowIndex,selffld,xmlRow.childNodes[i].text);
	    }
	}
	if(typeof(isExport)=="function") if(!isExport()) return;
	//对该行进行计算处理;行光标设置
	this.CalXmlLand.Calculate(rowIndex);
	ToolUtil.sleep(10);
	if(this.Grid)	this.Grid.Sum();
	else this.Sum();
}
_p.Cancel=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	while(this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes())
		this.XmldocFilter.documentElement.removeChild(this.XmldocFilter.documentElement.firstChild);
	while(this.XmlChanged.XMLDocument && this.XmlChanged.XMLDocument.documentElement.hasChildNodes())
		this.XmlChanged.XMLDocument.documentElement.removeChild(this.XmlChanged.XMLDocument.documentElement.firstChild);
	var root=this.XmlLandData.XMLDocument.documentElement;
	if(!root) return;
	var xmlNodeList=root.selectNodes("*[@state]");
	for(var i=root.childNodes.length-1;i>-1;i--)
	{
	    if(root.childNodes[i].getAttribute("state")=="new")
	    {
            root.removeChild(root.childNodes[i]);
            if(this.Grid && this.noxml && this.Grid.Table.rows.length!=0)
            {
                this.Grid.Table.deleteRow(i);
                if(this.Grid.Table.rows(i-1))this.setCurrentRow(i-1);
            }
        }
        else	        
	        root.childNodes[i].removeAttribute("state");
	}
}
_p.isNew=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	while(this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes())
		this.XmldocFilter.documentElement.removeChild(this.XmldocFilter.documentElement.firstChild);
	while(this.XmlChanged.XMLDocument && this.XmlChanged.XMLDocument.documentElement.hasChildNodes())
		this.XmlChanged.XMLDocument.documentElement.removeChild(this.XmlChanged.XMLDocument.documentElement.firstChild);
	var root=this.XmlLandData.XMLDocument.documentElement;
	if(!root) return;
	var xmlNodeList=root.selectNodes("*[@state]");
	for(var i=root.childNodes.length-1;i>-1;i--)
	    if(root.childNodes[i].getAttribute("state")=="new") return true;
}

_p.QPMS = function(Ex,fldName, strValue)
{
    this.BuildParamNotSelf();
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "UnitName", this.UnitItem.UnitName, "", "P", null, "T");
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "Command", "Query", "", "P", null, "T");
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "DataItem", this.DataItem, "", "P", null, "T");
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "DataSrcFile", this.UnitItem.DataSrcFile, "", "P", null, "T");
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "DictSrcFile", this.UnitItem.DictColSrcFile, "", "P", null, "T");
    ToolUtil.setParamValue(this.UnitItem.ParamXmldoc, "PageSize", this.XmlSchema.pagesize, "", "P", null, "T");
    var xmldoc=this.UnitItem.ParamXmldoc;
    if(Ex=="X")
    {
        if(this.UnitItem.DataSrcFile==""){alert("数据源文件(DataSrcFile)为空，请检查！");return}
        var _dictnodes = this.XmlSchema.XMLDocument.selectNodes("//xs:element[@dataitem!='']");
        var s = "";
        for(var i=0;i<_dictnodes.length;i++)
            s = ToolUtil.setValueTag(s,_dictnodes[i].getAttribute("name"),_dictnodes[i].getAttribute("dataitem") + "+"+_dictnodes[i].getAttribute("textcol")+ "+"+_dictnodes[i].getAttribute("valuecol"));
        ToolUtil.setParamValue(xmldoc, "DictCol", s, "", "P", null, "T");
        var _fmtnodes = this.XmlSchema.XMLDocument.selectNodes("//xs:element[@formatfld!='']");s="";
        for(var i=0;i<_fmtnodes.length;i++)
            s = ToolUtil.setValueTag(s,_fmtnodes[i].getAttribute("name"),_fmtnodes[i].getAttribute("format") + "+"+_fmtnodes[i].getAttribute("formatfld"));
        ToolUtil.setParamValue(xmldoc, "FmtCol", s, "", "P", null, "T");
    }
    if(fldName)
        ToolUtil.setParamValue(xmldoc, fldName, strValue, "", "P", null, "T");
    if(!this.XmlLandData)
        ToolUtil.setParamValue(xmldoc, "tpid", this.tempId, "", "P", null, "T");

}
_p.fixXml = function(xmldoc,queryType,strResult,xmltemp,fldName,strValue)
{
    //var xmltemp = xmlhttp.responseXML;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
	{
		var xmldiv=document.createElement("DIV");
		xmldiv.style.display="none";
		document.body.appendChild(xmldiv);
		if(xmltemp.childNodes[1])
		    xmldiv.innerHTML=xmltemp.childNodes[1].xml;
	    this.RedefineXml();
    }
    if(!this.XmlLandData) 
        {alert("数据不存在，请检查单元名称为["+this.ItemName+"]的配置！");this.active=false;return;};
    if(this.XmlLandData.onrowenter)
    {
	    var onRowEnterHandle=this.XmlLandData.onrowenter;
	    this.XmlLandData.onrowenter=null;
	}
 	//清除数据或状态,或把修改数据放入过虑区
	if("Query"==queryType  && "file:"!=location.protocol )
	    this.clearReset();
	else{
		var xmlNodeListChanged=this.XmlLandData.XMLDocument.selectNodes("/*/*[@state and not(@opstate)]");
		if("Add"==queryType)
		    xmlNodeListChanged=this.XmlLandData.XMLDocument.documentElement.childNodes;
		for(var i=xmlNodeListChanged.length-1;i>-1;i--)
		{
			xmlNodeListChanged[i].removeAttribute("selected");
			this.XmldocFilter.documentElement.appendChild(xmlNodeListChanged[i]);
		}
	}
	//加载数据或清空当前没有修改的数据,或是页面程序就把数据暂放入过虑区
    var root=this.XmlLandData.XMLDocument.documentElement;
    if(!root)
        root=this.XmlLandData.XMLDocument;
	if(""!=strResult && xmltemp.documentElement && xmltemp.documentElement.hasChildNodes())
	{
		this.XmlLandData.XMLDocument.loadXML(strResult);
	    root=this.XmlLandData.XMLDocument.documentElement;
	}else if("file:"==location.protocol||"RefreshFilter"==queryType){
	    while(root.hasChildNodes())
	    {
	        root.firstChild.removeAttribute("selected");
	        if(this.XmldocFilter)
		        this.XmldocFilter.documentElement.appendChild(root.firstChild);
		}
	}else{
	    while(root.hasChildNodes())
		    root.removeChild(root.firstChild);
	}
	//检查数据结构
	root=this.XmlLandData.XMLDocument.documentElement;
	if(!root)
	{
		this.NewRecord();
		root=this.XmlLandData.XMLDocument.documentElement;
		if(root)root.removeChild(root.firstChild);
	}
 	//软刷新和硬刷新更新数据,更新过虑区的修改记录和删除区的删除记录
 	if(this.XmldocFilter)
	{
	    var xmlNodeListChanged=this.XmldocFilter.selectNodes("/*/*");
	    var i=(!xmlNodeListChanged)?0:xmlNodeListChanged.length;
	    for(i--;i>-1;i--)
	    {
		    var xmlNodeKey=null,xmlRow=null;
		    if(this.keyCol && ""!=this.keyCol)
			    xmlNodeKey=xmlNodeListChanged[i].selectSingleNode(this.keyCol);
		    if(xmlNodeKey && null!=xmlNodeKey.text && ""!=xmlNodeKey.text)
			    xmlRow=root.selectSingleNode("*["+this.keyCol+"='"+xmlNodeKey.text+"']");
		    if(xmlRow)
			    root.replaceChild(xmlNodeListChanged[i],xmlRow);
	    }
        strValue=ToolUtil.TransferQuot(strValue);
        var strXPath= this.expfilter?this.expfilter:"";
        strXPath += !fldName?"":  (strXPath?" and ":"") + fldName+"='"+strValue+"'";
        var xmlNodeListChanged=this.XmldocFilter.documentElement.childNodes;
        if(strXPath)
            xmlNodeListChanged=this.XmldocFilter.selectNodes("/*/*["+strXPath+"]");
        var i=(!xmlNodeListChanged)?0:xmlNodeListChanged.length;
        for(i--;i>-1;i--)
	        root.appendChild(xmlNodeListChanged[i]);
	    if(strXPath)
	    {
	        xmlNodeListChanged=root.selectNodes("*[not("+strXPath+")]");
            var i=(!xmlNodeListChanged)?0:xmlNodeListChanged.length;
            for(i--;i>-1;i--)
	            this.XmldocFilter.documentElement.appendChild(xmlNodeListChanged[i]);
	    }
	}
	
	if(this.XmlChanged)
	{
	    xmlNodeListChanged=this.XmlChanged.XMLDocument.selectNodes("/*/*");
	    var i=xmlNodeListChanged.length;
	    for(i--;i>-1;i--)
	    {
		    var xmlNodeKey=null,xmlRow=null;
		    if(this.keyCol && ""!=this.keyCol)
			    xmlNodeKey=xmlNodeListChanged[i].selectSingleNode(this.keyCol);
		    if(xmlNodeKey && null!=xmlNodeKey.text && ""!=xmlNodeKey.text)
			    xmlRow=root.selectSingleNode("*["+this.keyCol+"='"+xmlNodeKey.text+"']");
		    if(xmlRow)		root.removeChild(xmlRow);
	    }
    }
    if("Add"==queryType && root)
        for(var i=0,len=root.childNodes.length; i<len; i++)
        {
            var xn = root.childNodes[i].selectSingleNode("RowNum");
            if(xn) xn.text = i+1;
        }
	if(this.Tree)
	{
	    var nodeFirst=this.Tree.dataBind();
	    if(nodeFirst) nodeFirst.Select();
	}
	ToolUtil.sleep(30);
	if(this.Grid)   this.Grid.Sum();
	else    this.Sum();
    var obj = new Object;
    obj.root = root;
    obj.fldName = fldName;
    obj.strValue = strValue;
    return obj;
}
_p.SetPageNum = function(rowcount,iPageCount,xmlNodeRdCount,xmlNodePageTotal,xmlNodePageIndex)
{
        var firstRowNum=this.getFldStrValue("RowNum");
        if("1"==firstRowNum)
            xmlNodePageIndex.text=1;
        xmlNodeRdCount.text=rowcount;
        if(iPageCount>-1)
            xmlNodePageTotal.text=iPageCount;
        
	    if(this.Grid)
	    {
	        this.ueBindGrid();
	        this.FireEvent("AfterNavPage")
	    }
        var xmldoc=this.UnitItem.ParamXmldoc;
        ToolUtil.resetParam(xmldoc);
        ToolUtil.setParamValue(xmldoc, "RecordCount", rowcount, "", "B", this.ItemName, "C", "M");
        ToolUtil.setParamValue(xmldoc, "RecordCount", rowcount, "", "P", this.ItemName, "C", "M");
        //this.Cancel();
        this.active=true;
        if("function"==typeof(this.AfterXQuery))
            this.AfterXQuery();
        window.setTimeout(_setFocus(this),200);
        
}
_p.ueBindGrid=function()
{
	if(this.noxml && this.Grid && this.Grid.GridDiv.parentElement){ this.StrongGrid=true;
        new XGrid(this.Grid.GridDiv.parentElement.id,this,"in",this.check,1,null); }
    else if(this.changeGrid){this.StrongGrid=true;
        new XGrid(this.Grid.GridDiv.parentElement.id,this,"in",this.check,1,null); }
}
//设置汇总行字段的值
_p.setFldSumStrValue=function(fldname,value)
{
	if(!this.XmlSum || !this.XmlSum.XMLDocument || !this.XmlSum.XMLDocument.documentElement 
		|| !this.XmlSum.XMLDocument.documentElement.hasChildNodes() )
		return;
	var root=this.XmlSum.XMLDocument.documentElement;
	var	strXPath="//xs:element[@name='"+fldname+"' or @formatfld='"+fldname+"']";
	var xmlCol=this.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	if(!xmlCol)		return;
	var colname=xmlCol.getAttribute("name");
	var xmlNodeValue=root.selectSingleNode("/*/*/"+colname);
	//没有该字段的需要增加字段
	if(!xmlNodeValue)
	{
		xmlNodeValue=root.childNodes[0].appendChild(root.ownerDocument.createElement(colname));
		this.XmlSum.XMLDocument.loadXML(this.XmlSum.XMLDocument.xml);
		root=this.XmlSum.XMLDocument.documentElement;
		xmlNodeValue=root.childNodes[0].selectSingleNode(colname);
	}
	var dbtype=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
	if(null==value || ""===value || (isNaN(value)&& typeof(value)=="number") || null==ToolUtil.Convert(value+"",dbtype) )
	    value="";
	xmlNodeValue.text=((""===value)?"　":value)+"";
	//按照设定的格式设置格式字段值,用于显示良好格式,没有格式的直接返回
	var strFormat=xmlCol.getAttribute("formatfoot");
	if(!strFormat || ""==strFormat)
	    strFormat=xmlCol.getAttribute("format");
	var strFormatFld=xmlCol.getAttribute("formatfld");
	
	if(strFormat)
	{
	    if(!strFormatFld || ""==strFormatFld)
	        strFormatFld=fldname+"_格式";
	        
		var valueNew=ToolUtil.Convert(value,dbtype);
		
		valueNew=(null==valueNew || ""===valueNew)?"":valueNew.formate(strFormat);
		
		var xmlNodeFormat=root.childNodes[0].selectSingleNode(strFormatFld);
		if(!xmlNodeFormat)
		{
			xmlNodeFormat=root.childNodes[0].appendChild(root.ownerDocument.createElement(strFormatFld));
			this.XmlSum.XMLDocument.loadXML(this.XmlSum.XMLDocument.xml);
		    root=this.XmlSum.XMLDocument.documentElement;
		    xmlNodeFormat=root.childNodes[0].selectSingleNode(strFormatFld);
		}
		xmlNodeFormat.text=((null==valueNew || ""===valueNew || (isNaN(valueNew) && typeof(valueNew)=="number") )?"　":valueNew)+"";
	}
}
//设置指定行字段的值
_p.setFldStrValueRange=function(rowIndex,fldname,value,valueold,dataRange)
{
    if(!fldname) return;
    if(fldname.indexOf(".")>-1) fldname = fldname.split(".")[1];
    dataRange=dataRange? dataRange.toLowerCase():"data";
    if("data"!=dataRange && "filter"!=dataRange && "sum"!=dataRange)
        return;
    var xmldoc=this.XmlLandData.XMLDocument;
    if("filter"==dataRange)
        xmldoc=this.XmldocFilter;
    if("sum"==dataRange)
        xmldoc=this.XmlSum?this.XmlSum.XMLDocument:null;
    if(!xmldoc || !xmldoc.documentElement)
        return;
	var root=xmldoc.documentElement;
	if(null==rowIndex && root.childNodes.length>0 && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
		if(rowIndex==null)rowIndex=0;
	if(null==rowIndex || rowIndex>=root.childNodes.length || rowIndex<0 || !fldname )
		return;
	var	strXPath="//xs:element[@name='"+fldname+"' or @formatfld='"+fldname+"' or @name='"+fldname.toLowerCase()+"' or @formatfld='"+fldname.toLowerCase()+"']";
	var xmlCol=this.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	if(!xmlCol)		return;
	var colname=xmlCol.getAttribute("name");
	var xmlNodeValue=root.childNodes[rowIndex].selectSingleNode(colname);
	//没有该字段的需要增加字段
	if(!xmlNodeValue)
	{
		var xmlNodeTest=root.selectSingleNode("*/"+colname);
		if(xmlNodeTest)
			xmlNodeValue=root.childNodes[rowIndex].appendChild(root.ownerDocument.createElement(colname));
		else
		{
		    if("sum"==dataRange)
		    {
		        xmlNodeValue=root.childNodes[0].appendChild(root.ownerDocument.createElement(colname));
		        this.XmlSum.XMLDocument.loadXML(this.XmlSum.XMLDocument.xml);
		        root=this.XmlSum.XMLDocument.documentElement;
		        xmlNodeValue=root.childNodes[0].selectSingleNode(colname);		    
		    }
		    else
		    {
			    xmlNodeValue=root.childNodes[rowIndex].appendChild(root.ownerDocument.createElement(colname));
			    //this.XmlLandData.XMLDocument.loadXML(this.XmlLandData.XMLDocument.xml);	重新建立数据岛
			    root=this.XmlLandData.XMLDocument.documentElement;
			    xmlNodeValue=root.childNodes[rowIndex].selectSingleNode(colname);
			    if(this.Grid)	this.Grid.setRowChecked(this.Grid.Table.rows[rowIndex]);
			}
		}
	}	
	
	var txtNodeOld=xmlNodeValue.text;
	var dbtype=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
	if(null==value || (isNaN(value)&& "number"==typeof(value)) || null==ToolUtil.Convert(value+"",dbtype) )
	{
		value="";
		xmlNodeValue.text="";
	}else if("datetime"==dbtype)
	{
		var dValue=ToolUtil.Convert(value,"datetime");
		if(dValue)
			xmlNodeValue.text=dValue.formate();
		else
			xmlNodeValue.text="";
	}else if("int"==dbtype || "decimal"==dbtype)
	{
	    var iValue=ToolUtil.Convert(value,"decimal");
	    if(iValue>-0.00000001 && iValue<0.00000001)
	        xmlNodeValue.text="";
	    else
	        xmlNodeValue.text=value;
	}else
		xmlNodeValue.text=value;
	if("sum"==dataRange)
	    xmlNodeValue.text=((""===value)?"　":value)+"";
	//按照设定的格式设置格式字段值,用于显示良好格式,没有格式的直接返回
	var strFormat=xmlCol.getAttribute("format");
	var strFormatFld=xmlCol.getAttribute("formatfld");
	if((!strFormat || ""==strFormat) && xmlCol.getAttribute("formatfoot") && "sum"==dataRange)
	    strFormat=xmlCol.getAttribute("formatfoot");
	if(strFormat)
	{
	    if(!strFormatFld || ""==strFormatFld)
	    {
	        strFormatFld=fldname+"_格式";
	        xmlCol.setAttribute("formatfld",strFormatFld);
	    }
	    
	    var valueNew=ToolUtil.Convert(value+"",dbtype);
	    if(!valueNew || (isNaN(valueNew) && typeof(valueNew)=="number") )
	        valueNew="sum"==dataRange?"　":"";
	    else
	        valueNew=valueNew.formate(strFormat);
	}
	else 
	    if(strFormatFld)
	    {
		    valueNew=value;
		    var dictData    =xmlCol.getAttribute("dataitem");
		    var txtData     =xmlCol.getAttribute("textcol");
		    var valData     =xmlCol.getAttribute("valuecol");
		    if(dictData && txtData && valData && this.XmlDict.XMLDocument.xml!="")
		    {
                var _xpath = dictData.replace(" ","_x0020_").replace(":","_x003A_").replace("'","_x0027_");    
			    var xmlNode=this.XmlDict.XMLDocument.selectSingleNode("/*/"+_xpath+"["+valData+"='"+value+"']/"+txtData);
			    if(xmlNode)		    valueNew=xmlNode.text+"";
		    }
	    }
	
	if(strFormatFld)
	{
	    var xmlNodeFormat=root.childNodes[rowIndex].selectSingleNode(strFormatFld);
	    if(!xmlNodeFormat)
	    {
	        xmlNodeFormat = root.childNodes[rowIndex].appendChild(root.ownerDocument.createElement(strFormatFld));
	    }
	    xmlNodeFormat.text=valueNew;
	}
	if("sum"==dataRange)    return;
	
	//设置记录行更新状态
	if(txtNodeOld!=xmlNodeValue.text || "1"!=xmlCol.getAttribute("calcol"))
	{
	    this.setStateRecord("modify",rowIndex);
	    root.childNodes[rowIndex].removeAttribute("opstate");
	}
	//如果是主表的关联列字段,从表级联更新
	if( colname && this.linkColM==colname && null!=valueold && ""!=valueold)
	{
        var strValue=ToolUtil.TransferQuot(valueold);
		for(var i=0;i<this.UnitItem.Bands.length;i++)
		{
		    if(this.UnitItem.Bands[i].NoAuto) continue;
			var BandD=this.UnitItem.Bands[i];
			if(this != BandD.getBandM())
                continue;
            //更新关联列字段值;并记录行状态
			var strXPath="/*/*["+BandD.linkCol+"='"+strValue+"']";
			var xmlNodeRows=BandD.XmlLandData.XMLDocument.selectNodes(strXPath);
			for(var k=0;k<xmlNodeRows.length;k++)
			{
				var xmlNodeLink=xmlNodeRows[k].selectSingleNode(BandD.linkCol);
				xmlNodeLink.text=value;
				BandD.setStateRecord("modify",k);
	            xmlNodeRows[k].removeAttribute("opstate");
			}
			var xmlNodeRows=BandD.XmldocFilter.selectNodes(strXPath);
			for(var k=0;k<xmlNodeRows.length;k++)
			{
				var xmlNodeLink=xmlNodeRows[k].selectSingleNode(BandD.linkCol);
				xmlNodeLink.text=value;
				BandD.setStateRecord("modify",k,"filter");
	            xmlNodeRows[k].removeAttribute("opstate");
			}
		}//for(var i=0;i<this.UnitItem.Bands.length;i++)
	}
	//同步数据字段
	var xmlRow=root.childNodes[rowIndex];
	for(var i=0;!this.SynSrc && !this.SynDest && i<this.SynchBands.length;i++)
	{
	    var bandSyn=this.SynchBands[i];
	    if(bandSyn.SynDest) continue;
	    else    bandSyn.SynDest=true;
		bandSyn.SynFldValue(xmlRow,fldname);
		bandSyn.SynDest=false;
	}
	//非数据岛方式需要更新Grid
	if(this.Grid && this.noxml)	this.Grid.setCellValue(rowIndex,colname,value,dbtype);
	//同步树节点文本
	if(this.Tree && fldname == this.Tree.TxtField)
	{
	    var nodeID=this.getFldStrValue(this.Tree.IDField,rowIndex);
	    var trvNode=this.Tree.getTrvNodeByID(nodeID);
	    if(trvNode)
	    {
	        trvNode.SetProperty('Text', value); 
            this.Tree.WebTree.Render();
	    }
	}
}
//设置数据区字段值
_p.setFldStrValue=function(rowIndex,fldname,value,valueold)
{
    return this.setFldStrValueRange(rowIndex,fldname,value,valueold,"data");
}
//注册同步段;itemName是段的名称;
_p.RegisterSynBand=function(itemName)
{
    if(!itemName || ""==itemName || itemName==this.ItemName)
        return;
    for(var i=0;i<this.SynchBands.length;i++)
    {
        if(!this.SynchBands[i])  continue;
        if(itemName==this.SynchBands[i].ItemName)
            return;
    }
    var synBand=this.UnitItem.getBandByItemName(itemName);
    if(synBand)
        this.SynchBands[this.SynchBands.length]=synBand;
}

//模糊搜索包含value值的行号;isNext是否在原来基础上搜索下一个
_p.SearchRowIndex=function(value,isNext)
{
	if( this.RecordCount() >0)
	    var rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	else
	    var rowIndex=-1;
	var strMsg=this.CalXmlLand.ValidateRow(rowIndex);
	if(strMsg && ""!=strMsg)
	{
		alert(strMsg);return;
	}
    value=ToolUtil.TransferQuot(value);
	var rowIndex=0,cellIndex=0,isSearch=false,isBreak=false;
	if(!isNext || !this.nextXmlRow)
		this.nextXmlRow=this.XmlLandData.XMLDocument.documentElement.firstChild;
	else
	    this.nextXmlRow=this.nextXmlRow.nextSibling;
	if(null==this.nextXmlRow)
	    this.nextXmlRow=this.XmlLandData.XMLDocument.documentElement.firstChild;
	if(null==this.nextXmlRow)   return;
	//计算起点行号
	var rowIndex=0;var preRow=this.nextXmlRow.previousSibling;
	while(preRow)
	{
	    rowIndex++;
	    preRow=preRow.previousSibling;
	}
	var xmlRow=this.nextXmlRow;
	do{
	    //var xmlNode=xmlRow.selectSingleNode("*[contains(text(),'"+value+"')]");
	    var xmlNode=null;
	    for(var i=0;i<xmlRow.childNodes.length;i++)
	    {
	        var strValue=xmlRow.childNodes[i].text;
	        if(strValue.indexOf(value)>-1)
	        {   xmlNode=xmlRow.childNodes[i];break;}
	    }
	    if(xmlNode)
	    {
	        this.nextXmlRow=xmlRow;
	        return rowIndex;
	    }
	    rowIndex++;
	    if(xmlRow.nextSibling)
	        xmlRow=xmlRow.nextSibling;
	    else
	        xmlRow=this.XmlLandData.XMLDocument.documentElement.firstChild;
	}while(xmlRow && xmlRow!=this.nextXmlRow)
    return -1;
}

//对Grid列宽度的改变,保存入隐藏标签字符串中
_p.setChSchemaXml=function()
{
	var ctrlID=this.XmlSchema.ctrlschema;
	if(!ctrlID)		return;
	var ctrlChanged=document.getElementById(ctrlID);
	if(!ctrlChanged)	return;
    
 	var xmlNodeListChanged=this.XmlSchema.XMLDocument.selectNodes("/*/*[@state]");
	var strXml="";
	for(var i=0;i<xmlNodeListChanged.length;i++)
		strXml +=xmlNodeListChanged[i].xml;
	ctrlChanged.value=strXml;
}

//对数据岛排序:colname列名称;ascdesc升降序:ascending 升序;descending 降序
_p.Sort=function(colname,datatype,ascdesc)
{
	if(!this.XmlSchema)		return;
	//升降序,默认是升序
	if(!ascdesc)	ascdesc="descending";
	//列类型默认是text
	var coltype=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+colname+"']/@type");
	if(!datatype && !coltype)
		datatype="text";
	else
	    datatype=ToolUtil.tranDBTypeXSLT(coltype.value);
	//设置排序字段,字段类型,升降序
	var eleSort=GridUtil.XSLLandSort.XMLDocument.selectSingleNode("//xsl:sort");
	eleSort.setAttribute("select",colname);
	eleSort.setAttribute("data-type",datatype);
	eleSort.setAttribute("order",ascdesc);
	this.XmlLandData.loadXML(this.XmlLandData.transformNode(GridUtil.XSLLandSort));
}
//分组汇总数据:fldname分组字段
_p.GroupSum=function(fldname)
{
	if(!this.XmlSchema)				return "";
	//添加汇总列模板参数分组的列名;
	var eleKey=GridUtil.XSLlandGroupSum.XMLDocument.selectSingleNode("//xsl:key");
	var eleTpCall=GridUtil.XSLlandGroupSum.XMLDocument.selectSingleNode("//xsl:call-template");
	var eleTp=GridUtil.XSLlandGroupSum.XMLDocument.selectSingleNode("//xsl:template[@name='tempsum']");
	var eleTpCopy=eleTp.cloneNode(true);
	var eleTpCallCopy=eleTpCall.cloneNode(true);
	var eleParam=eleTpCall.selectSingleNode("xsl:with-param[@name='groupby']");
	var strXMLLand=GridUtil.XSLlandGroupSum.XMLDocument.xml;
	eleParam.text=fldname;
	eleKey.setAttribute("match",this.DataItem);
	eleKey.setAttribute("use",fldname);
	
	var eleRowGroup=eleTp.selectSingleNode("xsl:for-each/xsl:element");
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[@footer!='' and ( @type='xs:int' or @type='xs:number' or @type='xs:float' or @type='xs:decimal' or @type='xs:double' or @type='xs:money')]");
	for(var i=0;i<colList.length;i++)
	{
		var colname=colList[i].getAttribute("name");
		var sumfoot=colList[i].getAttribute("footer");
		var eleParam=eleTpCall.insertBefore(eleTpCall.ownerDocument.createElement("xsl:with-param"),eleTpCall.firstChild);
		eleParam.setAttribute("name","col"+i);
		eleParam.text=colname;
		eleParam=eleTp.insertBefore(eleTp.ownerDocument.createElement("xsl:param"),eleTp.firstChild);
		eleParam.setAttribute("name","col"+i);
		
		var eleCol=eleRowGroup.appendChild(eleRowGroup.ownerDocument.createElement("xsl:element"));
		eleCol.setAttribute("name","{$col"+i+"}");
		var eleValue=eleCol.appendChild(eleCol.ownerDocument.createElement("xsl:value-of"));
		eleValue.setAttribute("select","sum(key('pkname',$keyvalue)/*[name()=$col"+i+" and text()!=\'\'])");
	}
	if(colList.length<1)		return "";
	var div=GridUtil.XSLlandGroupSum.parentElement;
	div.innerHTML="<XML>"+GridUtil.XSLlandGroupSum.XMLDocument.xml+"</XML>";
	GridUtil.XSLlandGroupSum=div.firstChild;
	var strGroupSum=this.XmlLandData.transformNode(GridUtil.XSLlandGroupSum);
	div.innerHTML="<XML>"+strXMLLand+"</XML>";
	GridUtil.XSLlandGroupSum=div.firstChild;
	return strGroupSum;
}
//读取指定行表达式值
_p.getExpValue=function(expression,rowIndex)
{
    return this.CalXmlLand.Evaluation(rowIndex,expression);
}

//在过滤区设置指定行字段的值
_p.setFldStrValueFilter=function(rowIndex,fldname,value,valueold)
{
   return this.setFldStrValueRange(rowIndex,fldname,value,valueold,"filter");
}
//设置汇总行字段的值
//_p.setFldSumStrValue=function(fldname,value)
//{
//   return this.setFldStrValueRange(0,fldname,value,null,"sum");
//}

//设置汇总行字段的值
_p.setFldSumStrValue=function(fldname,value)
{
	if(!this.XmlSum || !this.XmlSum.XMLDocument || !this.XmlSum.XMLDocument.documentElement 
		|| !this.XmlSum.XMLDocument.documentElement.hasChildNodes() )
		return;
	var root=this.XmlSum.XMLDocument.documentElement;
	var	strXPath="//xs:element[@name='"+fldname+"' or @formatfld='"+fldname+"']";
	var xmlCol=this.XmlSchema.XMLDocument.selectSingleNode(strXPath);
	if(!xmlCol)		return;
	var colname=xmlCol.getAttribute("name");
	var xmlNodeValue=root.selectSingleNode("/*/*/"+colname);
	//没有该字段的需要增加字段
	if(!xmlNodeValue)
	{
		xmlNodeValue=root.childNodes[0].appendChild(root.ownerDocument.createElement(colname));
		this.XmlSum.XMLDocument.loadXML(this.XmlSum.XMLDocument.xml);
		root=this.XmlSum.XMLDocument.documentElement;
		xmlNodeValue=root.childNodes[0].selectSingleNode(colname);
	}
	var dbtype=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
	if(null==value || ""===value || (isNaN(value)&& typeof(value)=="number") || null==ToolUtil.Convert(value+"",dbtype) )
	    value="";
	xmlNodeValue.text=((""===value)?"　":value)+"";
	//按照设定的格式设置格式字段值,用于显示良好格式,没有格式的直接返回
	var strFormat=xmlCol.getAttribute("formatfoot");
	if(!strFormat || ""==strFormat)
	    strFormat=xmlCol.getAttribute("format");
	var strFormatFld=xmlCol.getAttribute("formatfld");
	
	if(strFormat)
	{
	    if(!strFormatFld || ""==strFormatFld)
	        strFormatFld=fldname+"_格式";
	        
		var valueNew=ToolUtil.Convert(value,dbtype);
		
		valueNew=(null==valueNew || ""===valueNew)?"":valueNew.formate(strFormat);
		
		var xmlNodeFormat=root.childNodes[0].selectSingleNode(strFormatFld);
		if(!xmlNodeFormat)
		{
			xmlNodeFormat=root.childNodes[0].appendChild(root.ownerDocument.createElement(strFormatFld));
			this.XmlSum.XMLDocument.loadXML(this.XmlSum.XMLDocument.xml);
		    root=this.XmlSum.XMLDocument.documentElement;
		    xmlNodeFormat=root.childNodes[0].selectSingleNode(strFormatFld);
		}
		xmlNodeFormat.text=((null==valueNew || ""===valueNew || (isNaN(valueNew) && typeof(valueNew)=="number") )?"　":valueNew)+"";
	}
}

//对Grid删除指定行,没有指定行号默认删除当前行
_p.DeleteRecord=function(rowIndex)
{
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex<0 ||  rowIndex>=this.RecordCount())
		return null;
	var xmlNodeRow=this.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
    this.DeleteRowNode(xmlNodeRow);
	if(this.Grid){
	    if(this.noxml) this.Grid.Table.deleteRow(rowIndex);
		this.Grid.Sum();
	}
	else	this.Sum();
}
//获取指定行状态:init,new,modify,delete
_p.getStateRecord=function(rowIndex,dataRange)
{
	if(this.RecordCount()<1)
		return "";
    dataRange=dataRange? dataRange.toLowerCase():"data";
    var xmldoc=this.XmlLandData.XMLDocument;
    if("filter"==dataRange)
        xmldoc=this.XmldocFilter;
    if(!xmldoc || !xmldoc.documentElement)
        return "";
	if(null==rowIndex && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	var root=xmldoc.documentElement;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return "";
	var xmlNodeRow=root.childNodes[rowIndex];
	var state=xmlNodeRow.getAttribute("state");
	return state;
}

//设置记录状态:new,modify,delete并保持其协调性
_p.setNewStateRecord=function(state,rowIndex,dataRange)
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return "";

	if(!state || ("new"!=state && "modify"!=state && "delete"!=state) || this.RecordCount()<1)
		return;
    dataRange=dataRange? dataRange.toLowerCase():"data";
    var xmldoc=this.XmlLandData.XMLDocument;
    if(!xmldoc || !xmldoc.documentElement)
        return "";
        		
	if(null==rowIndex && root.childNodes.length>0 && "data"==dataRange)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	var root=this.XmlLandData.XMLDocument.documentElement;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return "";
	var xmlNodeRow=root.childNodes[rowIndex];
	state=!state?"":state;
	xmlNodeRow.setAttribute("state",state);
}


//删除行节点记录,标识更新状态
_p.DeleteRowNode=function(xmlNodeRow)
{
	if(!xmlNodeRow)		return;
	var xnlink=null;
	if(this.linkColM && ""!=this.linkColM)
	    xmlNodeRow.selectSingleNode(this.linkColM);
	if(xnlink)
        var strValue=ToolUtil.TransferQuot(xnlink.text);
	for(var i=0;strValue && i<this.UnitItem.Bands.length; i++)
	{
	    if(this.UnitItem.Bands[i].NoAuto) continue;
		var BandD=this.UnitItem.Bands[i];
		if(this != BandD.getBandM())
		    continue;
		var strXPath="/*/*["+BandD.linkCol+"='"+strValue+"']";
		var xmlNodeRows=BandD.XmlLandData.XMLDocument.selectNodes(strXPath);
		for(var k=xmlNodeRows.length-1;k>-1;k--)
			BandD.DeleteRowNode(xmlNodeRows[k]);
		var xmlNodeRows=BandD.XmldocFilter.selectNodes(strXPath);
		for(var k=xmlNodeRows.length-1;k>-1;k--)
			BandD.DeleteRowNode(xmlNodeRows[k]);
	}
	//同步段的数据
	for(var i=0;!this.SynDest && i<this.SynchBands.length;i++)
	{
	    var bandSyn=this.SynchBands[i];
	    if(bandSyn.SynDest)  continue;
	    else    bandSyn.SynDest=true;
	    bandSyn.SynDelRowValue(xmlNodeRow);
		bandSyn.SynDest=false;
	}
	var state=xmlNodeRow.getAttribute("state");
	//新记录直接删除,更新记录转移到删除区
	switch(state)
	{
		case "init":
		case "new":
			xmlNodeRow.parentNode.removeChild(xmlNodeRow);
			break;
		case "modify":
		default:
			xmlNodeRow.setAttribute("state","delete");
			var xmlNodeKey=null;
			if(this.keyCol && ""!=this.keyCol)
				xmlNodeKey=xmlNodeRow.selectSingleNode(this.keyCol);
			if(xmlNodeKey)
				xmlNodeRow.setAttribute("keyvalue",xmlNodeKey.text);
			this.XmlChanged.documentElement.appendChild(xmlNodeRow);
			break;
	}
}

//设置更新行xml字符串
_p.setRowChangedXml=function()
{
	if(!this.XmlSchema)	return;
	var ctrlID=this.XmlSchema.ctrlchanged;
	if(!ctrlID)		return;
	var ctrlChanged=document.getElementById(ctrlID);
	if(!ctrlChanged)	return;

	var xmlNodeListChanged=this.XmlLandData.XMLDocument.selectNodes("/*/*[@state and not(@opstate)]");
	if(xmlNodeListChanged.length>50)
	    this.IsPostBackFull=true;
	var strXml="";
	if(true!=this.IsPostBackFull)
	{
	    var xmlNode=this.XmlLandData.XMLDocument.documentElement.firstChild;
	    if(xmlNode && (null==xmlNode.getAttribute("state") || ""==xmlNode.getAttribute("state")) )
	         xmlNode.setAttribute("state","");
	    strXml +=this.XmlLandData.XMLDocument.documentElement.xml;
	}else
	    for(var i=xmlNodeListChanged.length-1;i>-1;i--)
		    strXml +=xmlNodeListChanged[i].xml;

	xmlNodeListChanged=this.XmldocFilter.selectNodes("/*/*[@state]");
	if(true!=this.IsPostBackFull && xmlNodeListChanged.length<50)
	{
	    for(var i=0;i<xmlNodeListChanged.length;i++)
		    strXml +=xmlNodeListChanged[i].xml;
	}else{
	    var xmlNode=this.XmldocFilter.documentElement.firstChild;
	    if(xmlNode && (null==xmlNode.getAttribute("state") || ""==xmlNode.getAttribute("state")) )
	         xmlNode.setAttribute("state","");
	    strXml += this.XmldocFilter.documentElement.xml;
	}
	xmlNodeListChanged=this.XmlChanged.selectNodes("/*/*[@state]");
	if(true!=this.IsPostBackFull && xmlNodeListChanged.length<50)
	{
	    for(var i=0;i<xmlNodeListChanged.length;i++)
		    strXml +=xmlNodeListChanged[i].xml;
	}else{
	    var xmlNode=this.XmlChanged.XMLDocument.documentElement.firstChild;
	    if(xmlNode && (null==xmlNode.getAttribute("state") || ""==xmlNode.getAttribute("state")) )
	         xmlNode.setAttribute("state","");
	    strXml += this.XmlChanged.XMLDocument.documentElement.xml;
	}
	ctrlChanged.value=strXml;
}
//设置工作项目段的当前状态
_p.setViewState=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return null;
	//设置数据修改状态,Grid表格列宽度调整的状态
	this.setRowChangedXml();
	if(this.Grid)
	{
	    try{
		this.Grid.setChSchemaXml();
		}catch(ex){};
	}
	//设置当前行当前列状态
	var hlbStateID=this.XmlSchema.ctrlstate;
	if(!hlbStateID)		return;
	var hlbState=document.getElementById(hlbStateID);
	if(!hlbState)	return;
	hlbState.value="";
	if(this.RecordCount()>0 )
		var curRow=this.XmlLandData.recordset.AbsolutePosition - 1;
	else
		var curRow=null;
	var  strState=ToolUtil.setValueTag("","CurRow",curRow);
	var curCol="";
	if(this.Grid && this.Grid.curTd && this.Grid.curTd.colname)
	{
		curCol=this.Grid.curTd.colname;
		strState=ToolUtil.setValueTag(strState,"CurCol",curCol);
	}
	if(this.IsPostBackFull)
	    strState=ToolUtil.setValueTag(strState,"IsPostBackFull","true");
	hlbState.value=strState;
}
//数据翻页


//设置级联更新值:fldName 级联字段;indexRow 更新数据的记录行
_p.setFilterContent=function(indexRow,filterData,paramName,paramValue)
{
	var xmldoc=this.getFilterContent(indexRow,filterData,paramName,paramValue);
	if(!xmldoc)	return ;
	var xmlNodeColList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[@name]");
	for(var i=0;i<xmlNodeColList.length;i++)
	{
		var colname=xmlNodeColList[i].getAttribute("name");
		var xmlNodeValue=xmldoc.selectSingleNode("/*/*/"+colname);
		if(!xmlNodeValue)	continue;
		this.setFldStrValue(indexRow,colname,xmlNodeValue.text);
	}
	return;
}
//动态过虑;根据当前行数据返回指定列配置的filterdata数据xml文档
_p.getSelectContent=function(fldname,indexrow)
{
    if("file:"==location.protocol )
        return null;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return null;
	var xmlNodeCol=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+fldname+"' and @filterdata!='']");
	if(!xmlNodeCol)		return null;
	var		filterData=xmlNodeCol.getAttribute("filterdata");
	var cellvalue = this.getFldStrValue(fldname,indexrow); //关联波动列的值
	if(cellvalue=="") return null;
	var xmldoc=this.getFilterContent(indexrow,filterData,fldname,cellvalue);
	return xmldoc;
}
//设置级联更新值:fldName 级联字段;indexRow 更新数据的记录行
_p.setSelectContent=function(fldName,indexRow)
{
	var xmldoc=this.getSelectContent(fldName,indexRow);
	if(!xmldoc)	return ;
	if(!window.rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex<0 || rowIndex>=this.RecordCount())
		return null;
	//收集具有DataSource属性的非绑定数据岛Table的下拉框
	var trcur=(this.Grid && this.Grid.Table.rows.length>indexRow)?this.Grid.Table.rows[indexRow]:null;
	if(!this.BoundSelList)
	{
		var tabList=document.getElementsByTagName("TABLE");
		var ctrlSelList=new Array();
		for(var i=0;i<tabList.length;i++)
		{
			if(tabList[i].tabType || tabList[i].dataSrc)
				continue;
			var ctrlList=tabList[i].getElementsByTagName("SELECT");
			for(var j=0;j<ctrlList.length;j++)
			{
				if(!ctrlList[j].dataSrc || !ctrlList[j].dataFld || !ctrlList[j].DataSource 
						|| !ctrlList[j].DataValueField || !ctrlList[j].DataTextField)
					continue;
				if("#"+this.XmlLandData.id!=ctrlList[j].dataSrc)
					continue;
				var bBreak=false;
				for(var k=0;k<ctrlSelList.length;k++)
				{
					if(ctrlList[j]===ctrlSelList[k])
					{bBreak=true;break;}
				}
				if(bBreak)	break;
				ctrlSelList[ctrlSelList.length]=ctrlList[j];
			}
		}
		this.BoundSelList=ctrlSelList;
	}
	var ctrlSelList=this.BoundSelList;
	//利用数据集更新下拉框
	var xmlNodeCol=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+fldName+"']");
	var		filterData=xmlNodeCol.getAttribute("filterdata");
	var		filterItem=xmlNodeCol.getAttribute("filteritem");
	filterData=filterData?filterData:"";
	filterItem=filterItem?filterItem:"";
	var		arrfitem = filterItem.split(",");
	var		arrfdata = filterData.split(",");
	for(var i=0;i<arrfitem.length;i++)
	{
		if(!arrfitem[i] || !arrfdata[i] || ""==arrfitem || ""==arrfdata)
			continue;
		for(var j=0;j<ctrlSelList.length;j++)
		{
			if(arrfitem[i]!=ctrlSelList[j].dataFld)
				continue;
			var val=ctrlSelList[j].value;
			var itemName=ctrlSelList[j].getAttribute("DataSource");
			var textFld=ctrlSelList[j].getAttribute("DataTextField");
			var valueFld=ctrlSelList[j].getAttribute("DataValueField");
			var ctrlsel=ctrlSelList[j];
			var xmlDataList=xmldoc.selectNodes("/*/"+arrfdata[i]);
			ctrlsel.length=xmlDataList.length+1;
	        ctrlsel.options[0].value="";
	        ctrlsel.options[0].text="";
			for(var k=0;k<xmlDataList.length;k++)
			{
				var xmlNodeText=xmlDataList[k].selectSingleNode(textFld);
				var xmlNodeValue=xmlDataList[k].selectSingleNode(valueFld);
				if(!xmlNodeText || !xmlNodeValue)
					continue;
		        ctrlsel.options[k+1].value=xmlNodeValue.text;
		        ctrlsel.options[k+1].text=xmlNodeText.text;
			}
		}
		var ctrlsel=ToolUtil.getCtrlByTagD(false,trcur,"SELECT","colname",arrfitem[i]);
		if(!ctrlsel)	continue;
		var itemName=ctrlsel.getAttribute("DataSource");
		var textFld=ctrlsel.getAttribute("DataTextField");
		var valueFld=ctrlsel.getAttribute("DataValueField");
		//显示列、值列字段属性
		if(!itemName || !textFld || !valueFld || ""==itemName || ""==textFld || ""==valueFld)
			continue;
		var xmlDataList=xmldoc.selectNodes("/*/"+arrfdata[i]);
	    ctrlsel.length=xmlDataList.length+1;
        ctrlsel.options[0].value="";
        ctrlsel.options[0].text="";
		for(var j=0;j<xmlDataList.length;j++)
		{
			var xmlNodeText=xmlDataList[j].selectSingleNode(textFld);
			var xmlNodeValue=xmlDataList[j].selectSingleNode(valueFld);
			if(!xmlNodeText || !xmlNodeValue)
				continue;
	        ctrlsel.options[j+1].value=xmlNodeValue.text;
	        ctrlsel.options[j+1].text=xmlNodeText.text;
		}
		if(xmlDataList.length>1)
			this.setFldStrValue(indexRow,arrfitem[i],xmlDataList[1].selectSingleNode(valueFld).text);
		else
			this.setFldStrValue(indexRow,arrfitem[i],"");
	}
	var xmlNodeColList=this.XmlSchema.XMLDocument.selectNodes("//xs:element[@name]");
	for(var i=0;i<xmlNodeColList.length;i++)
	{
		var colname=xmlNodeColList[i].getAttribute("name");
		var xmlNodeValue=xmldoc.selectSingleNode("/*/*/"+colname);
		if(!xmlNodeValue)	continue;
		this.setFldStrValue(indexRow,colname,xmlNodeValue.text);
	}
	return;
}

//根据附加项,弹出模式窗口来选择行,根据返回行添加记录或对行字段赋值
_p.setModalContent=function(appendItemName,notSelf)
{
	if(appendItemName=="" || appendItemName==null) 
		return;
	var xmlNodeAppend=this.UnitItem.XmlConf.XMLDocument.selectSingleNode("//AppendItem[@name='"+appendItemName+"']");
	if(!xmlNodeAppend)
	{
	    if("notself"==notSelf)
	        this.BuildParamNotSelf();
	    else
	        this.BuildParamSelf();
	    var xmldoc=this.UnitItem.ParamXmldoc;
	    ToolUtil.setParamValue(xmldoc, "AppendItem", appendItemName, "", "P", null, "T");
	    ToolUtil.setParamValue(xmldoc, "WinType", "AppendItem", "", "P", "", "T");
	    
	    //从配置库中查出appenditem的窗口类型
		var uri=this.UnitItem.TransParams();
		var topFrame=ControlUtil.TopFrame;
		topFrame.OpenNewWin(uri);
	    //usGetTopFrame().OpenItemURL(appendItemName);
		return;
	}
	if("notself"==notSelf)
	    this.BuildParamNotSelf();
	else
	    this.BuildParamSelf();
	var xmldoc=this.UnitItem.ParamXmldoc;
    /*
    var ls_path="http://"+location.host+"/"+location.pathname;
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    
    ToolUtil.setParamValue(xmldoc, "syspath", ls_path, "", "S", "", "D")
    */
	ToolUtil.setParamValue(xmldoc, "AppendItem", appendItemName, "", "P", null, "T");
	ToolUtil.setParamValue(xmldoc, "WinType", "AppendItem", "", "P", "", "T");
	var appendType=xmlNodeAppend.getAttribute("funtype");
	var uri=this.UnitItem.TransParams();
	var topFrame=ControlUtil.TopFrame;
	document.strPram = document.getElementById("xmlparam").xml;
	if("import"==appendType || "checkin"==appendType || "importpost"==appendType || "editmodal"==appendType)
		try{return topFrame.OpenModal(uri,this);}
		catch(ex){return OpenModal(uri,this);}
	else
		topFrame.OpenNewWin(ue_path()+"/"+uri);
	
	//如果是后端导入方式,就执行回传命令
	if("importpost"==appendType && xmldoc)
	{
	    //需要导入的xmldoc处理,后台配合待做
	    ToolUtil.setParamValue(xmldoc, "xmlparamslist", xmldoc.documentElement.xml, "", "P", "", "T");
	    var strcmd=ToolUtil.setValueTag("","Cmd","cmd_importland");
	    strcmd=ToolUtil.setValueTag(strcmd,"CtrlID",this.ID);
	    ExeCtrlPostCmd(this.ID,strcmd);
        return;
	}
	if("editmodal"==appendType)
	    this.Query();
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


//根据附加项,弹出模式窗口来选择行,根据返回行添加记录或对行字段赋值
_p.setModalWinNoParam=function(appendItemName)
{
    this.setModalContent(appendItemName,"notself");
}

//根据Xml行数据同步指定行的数据,他们根据主键同步,没有主键的忽略同步处理,没有对应行的在过滤区复制该行;
_p.SynRowValue=function(xmlRow)
{
	if(!xmlRow || !xmlRow.hasChildNodes())
		return;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	if(null==this.keyCol)
	    return;
	var xmlNodeKey=xmlRow.selectSingleNode(this.keyCol);
	if(null==xmlNodeKey.text || ""==xmlNodeKey.text)
	    return;
	//在过滤区和当前区找到对应行
	var rowIndex=-1;var isFilter=false;
	for(var i=0;i<this.XmlLandData.recordset.recordCount;i++)
	{
	    var key=this.getFldStrValue(this.keyCol,i);
	    if(key==xmlNodeKey.text)
	    {
	        rowIndex=i;break;
	    }
	}
	if(rowIndex<0)
	    for(var i=0;i<this.XmldocFilter.documentElement.childNodes.length;i++)
	    {
	        var key=this.getFldStrValueFilter(this.keyCol,i);
	        if(key==xmlNodeKey.text)
	        {
	            isFilter=true;rowIndex=i;break;
	        }
	    }
	if(rowIndex<0)
	{
	    var xmlRowData=xmlRow.cloneNode(true);
	    this.XmldocFilter.documentElement.appendChild(xmlRowData);
	    rowIndex=this.XmldocFilter.documentElement.childNodes.length-1;
	    isFilter=true;
	}
	//同步行字段数据
	for(var i=0;i<xmlRow.childNodes.length;i++)
	{
		var xmlNodeTest=this.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+xmlRow.childNodes[i].baseName+"']");
		if(!xmlNodeTest)	continue;
		if(!isFilter)
		    this.setFldStrValue(rowIndex,xmlRow.childNodes[i].baseName,xmlRow.childNodes[i].text);
		else
		    this.setFldStrValueFilter(rowIndex,xmlRow.childNodes[i].baseName,xmlRow.childNodes[i].text);
	}
	
	if(this.Grid)	this.Grid.Sum();
	else		this.Sum();
}
//根据Xml行数据同步指定行字典的数据,他们根据主键同步,没有主键的忽略同步处理,没有对应行的在过滤区复制该行;
_p.SynFldValue=function(xmlRow,fldname)
{
	if(!xmlRow || !fldname || ""==fldname || !xmlRow.hasChildNodes())
		return;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	if(null==this.keyCol)
	    return;
	var xmlNodeKey=xmlRow.selectSingleNode(this.keyCol);
	if(null==xmlNodeKey.text || ""==xmlNodeKey.text)
	    return;
	//在过滤区和当前区找到对应行
	var rowIndex=-1;var isFilter=false;
	for(var i=0;i<this.XmlLandData.recordset.recordCount;i++)
	{
	    var key=this.getFldStrValue(this.keyCol,i);
	    if(key==xmlNodeKey.text)
	    {
	        rowIndex=i;break;
	    }
	}
	if(rowIndex<0)
	    for(var i=0;i<this.XmldocFilter.documentElement.childNodes.length;i++)
	    {
	        var key=this.getFldStrValueFilter(this.keyCol,i);
	        if(key==xmlNodeKey.text)
	        {
	            isFilter=true;rowIndex=i;break;
	        }
	    }
	if(rowIndex<0)
	{
	    var xmlRowData=xmlRow.cloneNode(true);
	    this.XmldocFilter.documentElement.appendChild(xmlRowData);
	    rowIndex=this.XmldocFilter.documentElement.childNodes.length-1;
	    isFilter=true;
	}
	//同步行字段数据
	var xmlNodeFld=xmlRow.selectSingleNode(fldname);
	if(xmlNodeFld)
	{
	    if(!isFilter)
	        this.setFldStrValue(rowIndex,xmlNodeFld.baseName,xmlNodeFld.text);
	    else
	        this.setFldStrValueFilter(rowIndex,xmlNodeFld.baseName,xmlNodeFld.text);
	}
	
	if(this.Grid)	this.Grid.Sum();
	else		this.Sum();
}
//根据Xml行数据同步删除指定行的数据,他们根据主键同步,没有主键的忽略同步处理,没有对应行的在过滤区复制该行;
_p.SynDelRowValue=function(xmlRow)
{
	if(!xmlRow || !xmlRow.hasChildNodes())
		return;
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	if(null==this.keyCol)
	    return;
	var xmlNodeKey=xmlRow.selectSingleNode(this.keyCol);
	if(null==xmlNodeKey.text || ""==xmlNodeKey.text)
	    return;
	//分别在当前区和过滤区查找记录
	var xnRowSyn=this.XmlLandData.XMLDocument.documentElement.selectSingleNode("*["+this.keyCol+"='"+xmlNodeKey.text+"']");
	if(!xnRowSyn)
	    xnRowSyn=this.XmldocFilter.documentElement.selectSingleNode("*["+this.keyCol+"='"+xmlNodeKey.text+"']");
	if(!xnRowSyn)
	{
	    var xmlRowData=xmlRow.cloneNode(true);
	    xnRowSyn=this.XmldocFilter.documentElement.appendChild(xmlRowData);
	}
    if(this.Tree)
    {
        var trvNode=this.Tree.getTrvNodeByID(xmlNodeKey.text);
        if(trvNode) this.Tree.deleteNode(trvNode);
        else        this.DeleteRowNode(xnRowSyn);
    }else
        this.DeleteRowNode(xnRowSyn);
	if(this.Grid)	this.Grid.Sum();
	else		this.Sum();
}
//把数据段制定数据导入指定数据项
//itemName:目的项名称; rowIndex当前项的数据行(源记录行)
_p.ExportRow=function(itemName,rowIndex)
{
    //根据import条件来确定是否可以import,外部函数isExport()
    if(typeof(isExport)=="function") if(!isExport()) return;
    if(!itemName || ""==itemName)   return;
    var bandDest=this.UnitItem.getBandByItemName(itemName);
    if(!bandDest)   return;
	if(!bandDest.XmlLandData || !bandDest.XmlLandData.XMLDocument || !bandDest.XmlLandData.XMLDocument.documentElement)	
		return;
	if(this.RecordCount()<1)
		return;
	root=this.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return;
    var trvNode=null;
    var xmlRow=this.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
    /*
    if(bandDest.Tree)
    {
        TreeUtil.addAllNodeImport(this,bandDest);
    }
    else
    {
        bandDest.NewRecord();
        bandDest.setRowValue(xmlRow);
    }
    */
    bandDest.setRowValue(xmlRow);
    if(bandDest.Grid)
	    bandDest.Grid.setRowCursor();
    bandDest.setCurrentRow(bandDest.XmlLandData.recordset.AbsolutePosition-1);
}

//把数据段指定数据替换指定数据项
_p.ReplaceRow=function(itemName,rowIndex)
{
    if(!itemName || ""==itemName)   return;
    var bandDest=this.UnitItem.getBandByItemName(itemName);
    if(!bandDest)   return;
	if(!bandDest.XmlLandData || !bandDest.XmlLandData.XMLDocument || !bandDest.XmlLandData.XMLDocument.documentElement)	
		return;
	if(this.RecordCount()<1)
		return;
	root=this.XmlLandData.XMLDocument.documentElement;
	if(null==rowIndex)
		rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
	if(rowIndex>=root.childNodes.length || rowIndex<0)
		return;
    var trvNode=null;
    if(bandDest.Tree)
        trvNode=bandDest.Tree.WebTree.getSelectedNode();
    var xmlRow=this.XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
    //新行为当前行
    bandDest.setRowValue(xmlRow);
    if(bandDest.Grid)
	    bandDest.Grid.setRowCursor();
    bandDest.setCurrentRow(bandDest.XmlLandData.recordset.AbsolutePosition-1);
}

//设置刷新属性;默认硬刷新;null,true表示硬刷新;false表示软刷新;软刷新清空数据不检索数据
_p.setRefreshForce=function(isForce)
{
    if(true==isForce)
        this.RefreshForce=true;
    else
        this.RefreshForce=false;
}
_p.ResetState=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return;
	while(this.XmldocFilter && this.XmldocFilter.documentElement.hasChildNodes())
		this.XmldocFilter.documentElement.removeChild(this.XmldocFilter.documentElement.firstChild);
	while(this.XmlChanged.XMLDocument && this.XmlChanged.XMLDocument.documentElement.hasChildNodes())
		this.XmlChanged.XMLDocument.documentElement.removeChild(this.XmlChanged.XMLDocument.documentElement.firstChild);
	var root=this.XmlLandData.XMLDocument.documentElement;
	if(!root) return;
	var xmlNodeList=root.selectNodes("*[@state]");
	for(var i=0;i<root.childNodes.length;i++)
	    root.childNodes[i].removeAttribute("state");
}
//手动执行过滤明细数据
_p.ManualFilterDatail=function()
{
	//明细过滤
	var rowIndex=null;
	if( this.RecordCount() >0)
	    rowIndex=this.XmlLandData.recordset.AbsolutePosition-1;
    var strvalue=this.getFldStrValue(this.linkColM,rowIndex);
    var rootM=this.XmlLandData.XMLDocument.documentElement;
    var strRefreshForce=null;var strState="new";
    if(rowIndex>=0 && rowIndex<rootM.childNodes.length)
    {
        var strState=rootM.childNodes[rowIndex].getAttribute("state");
        strRefreshForce=rootM.childNodes[rowIndex].getAttribute("refreshforce");
    }
	for(var i=0;i<this.UnitItem.Bands.length;i++)
	{
	    if(this.UnitItem.Bands[i].NoAuto) continue;
		var BandD=this.UnitItem.Bands[i];
		if(this != BandD.getBandM())
		     continue;

	    //主表新记录,且该行不强制刷新,并且明细也不强制刷新,就只从过虑区查询数据
        var iPageSize=ToolUtil.Convert(BandD.XmlSchema.pagesize,"int");
        if(null==iPageSize || isNaN(iPageSize))
	        iPageSize=10;
        BandD.setFldSumStrValue("PageIndex",1);
        var xmldocParam=this.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldocParam, "FirstRow", 0, "", "B", BandD.ItemName, "C","M");
        ToolUtil.setParamValue(xmldocParam, "LastRow", iPageSize, "", "B", BandD.ItemName, "C","M");
		if(false==BandD.RefreshForce && "new"==strState && "true"!=strRefreshForce )
		    BandD.RefreshFilterFld(BandD.linkCol,strvalue);
		else
		    BandD.Refresh(BandD.linkCol,strvalue);
		if(!BandD.XmlLandData.XMLDocument || !BandD.XmlLandData.XMLDocument.documentElement 
				|| BandD.XmlLandData.XMLDocument.documentElement.childNodes.length<1)
			continue;
		BandD.setCurrentRow(0);
	}
    this.Event.rowIndex=rowIndex;
	this.FireEvent("AfterRowChanged");

}
//当前数据岛数据是否修改过
//校验当前数据是否合法;合格返回空;非法返回提示信息
_p.ValidatityAll=function()
{
	if(!this.XmlLandData || !this.XmlLandData.XMLDocument || !this.XmlLandData.XMLDocument.documentElement
		 || !this.XmlSchema || !this.XmlSchema.XMLDocument)
		return "";
		
	if(!this.CalXmlLand.ValiCellList || this.CalXmlLand.ValiCellList.length<1)
	    return "";
	var		strMsg="";
	var root=this.XmlLandData.XMLDocument.documentElement;
	
	//root.childNodes.length - 行数
	for(var i=0;i<root.childNodes.length;i++)
	{
	    var state=root.childNodes[i].getAttribute("state");
	    var opstate=root.childNodes[i].getAttribute("opstate");
	    if("init"==state || (opstate && ""!=opstate) || !state || ""==state)
		    continue;
		var str= this.CalXmlLand.ValidateRow(i);
		if(str && ""!=str)
			strMsg += "第"+(i+1)+"行："+str+"\n";
	}
	var root=this.XmldocFilter.documentElement;
	for(var i=0;i<root.childNodes.length;i++)
	{
		var state=root.childNodes[i].getAttribute("state");
		var opstate=root.childNodes[i].getAttribute("opstate");
		if("init"==state || (opstate && ""!=opstate) || !state || ""==state)
			continue;
		var str= this.CalXmlLand.ValidateRowFilter(i);
		if(str && ""!=str)
			strMsg += "过虑区第"+(i+1)+"行："+str+"\n";
	}
	return strMsg;
}
