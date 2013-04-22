// JScript source code
//操作维护页面多个数据岛的关联

var _p=UnitItem.prototype;

_p.usOnLoadExtentJs=function()
{
    return true;
}

//重置参数
_p.preParam=function()
{
    if(true!=this.IsModify())
    {
	    var result=ToolUtil.setValueTag("","成功","true");
	    result=ToolUtil.setValueTag(result,"提示","保存成功!");
	    return result;
    }
	var root=this.ParamXmldoc.documentElement;
	//加入系统参数
	ToolUtil.setParamValue(this.ParamXmldoc, "UnitName", this.UnitName, "", "P", "", "C");
	ToolUtil.setParamValue(this.ParamXmldoc, "Command", "Save", "", "P", "", "T"); 
	if(this.workflow!="")
	    ToolUtil.setParamValue(this.ParamXmldoc, "WorkFlow", this.workflow, "", "P", "", "C");
	//加入编号
	if(this.BandMaster && this.BandMaster.linkColM && this.BillType && this.BandMaster.RecordCount()>0)
	{
	    var rowcount=this.BandMaster.RecordCount();
	    for(var i=0;i<rowcount;i++)
	    {
	        var strBHold=this.BandMaster.getFldStrValue(this.BandMaster.linkColM,i);
	        if("new"==this.BandMaster.getStateRecord(i) && strBHold.indexOf(this.BillType)<0 )
	            this.BandMaster.setFldStrValue(i,this.BandMaster.linkColM,ToolUtil.NewDJBH(this.BillType),strBHold);
	    }
	    var rowcount=this.BandMaster.XmldocFilter.documentElement.childNodes.length;
	    for(var i=0;i<rowcount;i++)
	    {
	        var strBHold=this.BandMaster.getFldStrValueFilter(this.BandMaster.linkColM,i);
	        if("new"==this.BandMaster.getStateRecord(i,"filter") && strBHold.indexOf(this.BillType)<0 )
	            this.BandMaster.setFldStrValueFilter(i,this.BandMaster.linkColM,ToolUtil.NewDJBH(this.BillType),strBHold);
	    }
	}	   
	
	//添加单元所有项目的修改记录
    for(var i=0;i<this.Bands.length;i++)
    {
        if(!this.Bands[i].XmlLandData || !this.Bands[i].XmlSchema || !this.Bands[i].XmlLandData.XMLDocument)
            continue;
        var xnP=ToolUtil.setParamValue(this.ParamXmldoc, "Command", "Save", "", "B", this.Bands[i].ItemName, "D");
        var xeBand=xnP.parentNode;
        var rootBand=this.Bands[i].XmlLandData.XMLDocument.documentElement;
        //当前区更改的数据
	    var xmlNodeList=rootBand.selectNodes("/*/*[@state and not(@opstate)]");
	    
	    //大于50用克隆的方法快
	    if(xmlNodeList.length>50)
	        xeBand.appendChild(rootBand.cloneNode(true));
	    else
	        for(var j=0;j<xmlNodeList.length;j++)
	            xeBand.appendChild(xmlNodeList[j].cloneNode(true));
	    //过滤区修改的数据
	    rootBand=this.Bands[i].XmldocFilter.documentElement;
	    xmlNodeList=rootBand.selectNodes("/*/*[@state]");
	    if(xmlNodeList.length>50)
	        xeBand.appendChild(rootBand.cloneNode(true));
	    else
	        for(var j=0;j<xmlNodeList.length;j++)
	            xeBand.appendChild(xmlNodeList[j].cloneNode(true));
	    //删除区修改的数据
	    rootBand=this.Bands[i].XmlChanged.XMLDocument.documentElement;
	    xmlNodeList=rootBand.selectNodes("/*/*[@state]");
	    if(xmlNodeList.length>50)
	        xeBand.appendChild(rootBand.cloneNode(true));
	    else
	        for(var j=0;j<xmlNodeList.length;j++)
	            xeBand.appendChild(xmlNodeList[j].cloneNode(true));
    }	
    var hlbParam=document.getElementById("hlbRequestParams");
	hlbParam.value='<XML id="xmlparam" typexml="Param">'+root.xml+"</XML>";
}



//保持工作项目的数据和行状态
_p.setViewState=function()
{
	for(var i=0;i<this.Bands.length;i++)
		this.Bands[i].setViewState();
}

//签入来源窗口当前段数据中:分为更新或导入方式, ischild - 如果有树，则用于标识是增加到当前节点的子节点，还是同级节点
_p.CheckInParentUnit=function(imputtype,ischild,loadchild)
{
	var bands=new Array();
	for(var i=0;i<this.Bands.length;i++)
	{
		if(this.Bands[i].IsImport=="1")
			bands[bands.length]=this.Bands[i];
	}
	if(bands.length<1)
	{
		if(null==this.BandMaster || this.BandDetails.length<1)
			bands=this.Bands;
		else
			bands=this.BandDetails;
	}
	if(!window.dialogArguments || bands.length<1) return;
	
	var bandOpener=window.dialogArguments;
	if(!bandOpener)	return;
	if("Master"==bandOpener.itemType && window.dialogArguments && bandOpener.UnitItem.BandDetails.length>0  && !bandOpener.CheckInBand)
		bandOpener=window.dialogArguments.UnitItem.BandDetails[0];
	var strXPath="//AppendItem[@name='"+this.UnitName+"' or @unitname='"+this.UnitName+"']";
	var xmlNodeAppend=bandOpener.UnitItem.XmlConf.XMLDocument.selectSingleNode(strXPath);
	if(!xmlNodeAppend)	return;
	var funType=xmlNodeAppend.getAttribute("funtype");
	if(!funType || ""==funType)		return;
	if(imputtype) funType = imputtype;
	switch(funType)
	{
	    case "import":
	        var trvNode=null;
	        if(bandOpener.Tree)
	        {
	            if(bandOpener.Tree.WebTree.Nodes().length==0)
	                ischild=false;
	            trvNode = bandOpener.Tree.WebTree.SelectedNode
	            //trvNode = osNode;
	        }
	        
		    for(var iband=0;iband<bands.length;iband++)
		    {
		        var colname = "选择";
		        var coltype=bands[iband].XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+colname+"']/@type");
		        var _datatype="";
		        if(coltype) var _datatype = coltype.value;
		        if(_datatype!="xs:boolean")
			        var xmlRows=bands[iband].XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
			    else 
			        var xmlRows=bands[iband].XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			    //循环增加记录
			    for(var i=0;i<xmlRows.length;i++)
			    {
			        //新行为当前行
	                bandOpener.XmlLandData.onrowenter=null;
			        if(bandOpener.Tree)
			        {
			            if(ischild)
			                bandOpener.Tree.newChild(trvNode);
			            else
			                bandOpener.Tree.newChild(trvNode?trvNode.ParentNode:null);
			        }
				    else
				        bandOpener.NewRecord();	
    				bandOpener.setRowValue(xmlRows[i]);
    				
                    //在没有记录时触发行改变事件会引起堆栈溢出,
                    if(bandOpener.RecordCount()>0)
                    {
                        if(bandOpener.XmlLandData.onRowEnterHandle)
	                        bandOpener.XmlLandData.onrowenter=bandOpener.XmlLandData.onRowEnterHandle;
	                    bandOpener.XmlLandData.fireEvent("onrowenter");
		            }else if(bandOpener.XmlLandData.onRowEnterHandle){
		                bandOpener.XmlLandData.onRowEnterHandle();
		            }
			    }
		        if(_datatype!="xs:boolean")
			        xmlRows=bands[iband].XmldocFilter.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
			    else 
			        var xmlRows=bands[iband].XmldocFilter.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			    
			    for(var i=0;i<xmlRows.length;i++)
			    {
			        //新行为当前行
			        if(bandOpener.Tree)
			        {
			            if(ischild)
			                bandOpener.Tree.newChild(trvNode);
			            else
			                bandOpener.Tree.newChild(trvNode?trvNode.ParentNode:null);
			        }
				    else
				        bandOpener.NewRecord();
				    bandOpener.setRowValue(xmlRows[i]);
			    }
			    if(bandOpener.Grid)
				    bandOpener.Grid.setRowCursor();
	            if( bandOpener.RecordCount() >0)
	                var rowIndex=bandOpener.XmlLandData.recordset.AbsolutePosition-1;
	            else
	                var rowIndex=-1;
			    bandOpener.setCurrentRow(rowIndex);
			    if(bandOpener.Grid)
			        bandOpener.Grid.Sum();
			    else
			        bandOpener.Sum();			
		    }
		    break;
	    case "checkin":
		    for(var iband=0;iband<bands.length;iband++)
		    {
	            if( bands[iband].RecordCount() >0)
	                var rowIndex=bands[iband].XmlLandData.recordset.AbsolutePosition-1;
	            else
	                var rowIndex=-1;
			    if(rowIndex<0 || rowIndex>=bands[iband].XmlLandData.XMLDocument.documentElement.childNodes.length)
				    continue;
			    var xmlRow=bands[iband].XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
			    bandOpener.setRowValue(xmlRow);
		    }
		    break;
		case "importpost":
	        var xmlDoc =new ActiveXObject("Msxml2.DOMDocument");
	        xmlDoc.async =false;
	        xmlDoc.loadXML('<ParamList></ParamList>');
	        var root=xmlDoc.documentElement;
		    for(var iband=0;iband<bands.length;iband++)
		    {
		        var xmlColList=bands[iband].XmlSchema.XMLDocument.selectNodes("//xs:element[@name and @import ]");
    		    
			    var xmlRows=bands[iband].XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
			    for(var i=0;i<xmlRows.length;i++)
			    {
                    var elemList=paramList.ownerDocument.createElement("List");
                    root.appendChild(elemList);
			        for(var j=0;j<xmlColList.length;j++)
			        {
			            var colname=xmlColList[j].getAttribute("name");
			            var dbtype=ToolUtil.tranDBType(xmlColList[j].getAttribute("type"));
			            var xmlNode=xmlRows[i].selectSingleNode(colname);
    	                
	                    var element=elemList.ownerDocument.createElement("Param");
	                    element.setAttribute("name",colname);
	                    element.setAttribute("type",dbtype);
	                    element.setAttribute("value",(xmlNode?xmlNode.text:""));
	                    elemList.appendChild(element);
			        }
			    }
			    xmlRows=bands[iband].XmldocFilter.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
			    for(var i=0;i<xmlRows.length;i++)
			    {
                    var elemList=paramList.ownerDocument.createElement("List");
                    root.appendChild(elemList);
			        for(var j=0;j<xmlColList.length;j++)
			        {
			            var colname=xmlColList[j].getAttribute("name");
			            var dbtype=ToolUtil.tranDBType(xmlColList[j].getAttribute("type"));
			            var xmlNode=xmlRows[i].selectSingleNode(colname);
    	                
	                    var element=elemList.ownerDocument.createElement("Param");
	                    element.setAttribute("name",colname);
	                    element.setAttribute("type",dbtype);
	                    element.setAttribute("value",(xmlNode?xmlNode.text:""));
	                    elemList.appendChild(element);
			        }
			    }
		    }
		    root.setAttribute("newdoc","true");
		    window.returnValue = xmlDoc;
		    window.close();
		    break;		    
	}
}





//把当前数据存入本地文件
_p.SaveLocal=function()
{
	var strXmlAttrList=new Array("id","typexml","itemname");
	var strDoc="";
	for(var i=0;i<this.Bands.length;i++)
	{
		var band=this.Bands[i];
		if(false==band.IsSaveLocal)
		    continue;
	    if(!band.XmlLandData || !band.XmlLandData.XMLDocument || !band.XmlLandData.XMLDocument.documentElement)	
		    continue;
		var strXmlAttr="";
		for(var j=0;j<strXmlAttrList.length;j++)
		{
			var attr=band.XmlLandData.getAttributeNode(strXmlAttrList[j]);
			if(!attr)	continue;
			strXmlAttr += attr.name+"='"+attr.value+"' ";
		}
		var strXmlDoc="";
		var root=band.XmldocFilter.documentElement;
		for(var j=0;root && j<root.childNodes.length;j++)
			strXmlDoc += root.childNodes[j].xml;
		if(band.XmlLandData.XMLDocument && band.XmlLandData.XMLDocument.documentElement)
		{
			var root=band.XmlLandData.XMLDocument.documentElement;
			for(var j=0;j<root.childNodes.length;j++)
				strXmlDoc += root.childNodes[j].xml;
			strXmlDoc = "<"+root.baseName+">"+strXmlDoc+"</"+root.baseName+">";
		}
		strXmlAttr= "<div style='display:none'><XML "+strXmlAttr+" >"+strXmlDoc+"</XML></div>";
		strDoc += strXmlAttr+" ";
		
		var strXmlAttr="";
		for(var j=0;j<strXmlAttrList.length;j++)
		{
			var attr=band.XmlChanged.getAttributeNode(strXmlAttrList[j]);
			if(!attr)	continue;
			strXmlAttr += attr.name+"='"+attr.value+"' ";
		}
		var strXmlDoc="";
		if(band.XmlChanged.XMLDocument && band.XmlChanged.XMLDocument.documentElement)
			strXmlDoc =band.XmlChanged.XMLDocument.documentElement.xml;
		strXmlAttr= "<div style='display:none'><XML "+strXmlAttr+" >"+strXmlDoc+"</XML></div>";
		strDoc += strXmlAttr+" ";
	}
	return "<?xml version='1.0' ?><div style='display:none'>"+strDoc+"</div>";
}
//明细数据是否有修改
_p.IsModifyDetail=function()
{
	if(this.BandDetails.length<1)
		return false;
	for(var i=0;i<this.BandDetails.length;i++)
		if(this.BandDetails[i].IsModify())
			return	true;
	return false;
}

//文件结尾
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;
