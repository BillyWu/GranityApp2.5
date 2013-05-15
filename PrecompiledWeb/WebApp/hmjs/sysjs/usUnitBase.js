// JScript source code
//操作维护页面多个数据岛的关联
function   UnitItem()
{
	this.XmlConf=null;
	this.ParamXmldoc=null;
	this.BandMaster=null;
	this.BandDetails=new Array();
	this.Bands=new Array();
	this.tpath=null;
	this.ActiveBand=null;
	var  xmlLands=document.getElementsByTagName("XML");
	for(var i=0;i<xmlLands.length;i++)
	{
		if("ConfProperty"==xmlLands[i].typexml && xmlLands[i].XMLDocument && xmlLands[i].XMLDocument.documentElement)
		    this.XmlConf=xmlLands[i];
		if("Param"==xmlLands[i].typexml && xmlLands[i].XMLDocument)
		{
		    if(xmlLands[i].XMLDocument.xml=="")
		        xmlLands[i].outerHTML=xmlLands[i].outerHTML.replace("<XML>","");
			this.ParamXmldoc=xmlLands[i].XMLDocument;
		}
	}
	if(!this.XmlConf)	return;
	this.UnitName=this.XmlConf.name;
	this.Rights= $SP("Rights");
	this.BillType=this.XmlConf.billtype;
	this.SaveType=this.XmlConf.savetype;
	this.TempType=this.XmlConf.templatetype;
    this.tpath = this.XmlConf.tpath;
    this.workflow = this.XmlConf.workflow;
    this.DataSrcFile = this.XmlConf.DataSrcFile;
    this.DictColSrcFile = this.XmlConf.DictColSrcFile;
    this.Tag = null;   //getUnitRight()
    this.Right = null; //ToolUtil.valueTag(this.Tag,"right");
	var xmlNodeItems=this.XmlConf.XMLDocument.selectNodes("//Item");
	//定义项目属性
	for(var i=0;i<xmlNodeItems.length;i++)
	{
		this.Bands[this.Bands.length]=new Band(xmlNodeItems[i]);
		this.Bands[this.Bands.length-1].UnitItem=this;
	}
	for(var i=0;i<this.Bands.length;i++)
	{
		if("Master"==this.Bands[i].itemType)
			this.BandMaster=this.Bands[i];
		else if("Detail"==this.Bands[i].itemType)
			this.BandDetails[this.BandDetails.length]=this.Bands[i];
	}
	document.UnitItem=this;
	if(this.BandMaster)
		this.ActiveBand=this.BandMaster;
	else if(this.Bands.length>0)
		this.ActiveBand=this.Bands[0];
}


var _p=UnitItem.prototype;
//根据项目名获取Band项目段对象
_p.getBandByItemName=function(itemName)
{
	for(var i=0;i<this.Bands.length;i++)
	{
		if(itemName==this.Bands[i].ItemName)
	
			return this.Bands[i];
	}
	return  null;
}
_p.getBandById=function(id)
{
	for(var i=0;i<this.Bands.length;i++)
	{
		if(this.Bands[i].XmlLandData && id==this.Bands[i].XmlLandData.id)
			return this.Bands[i];
	}
	return  null;
}
_p.setActiveBand=function(itemName)
{
	var Band=this.getBandByItemName(itemName);
	this.ActiveBand=Band;
}
_p.getActiveBand=function()
{
	if(this.ActiveBand)
		return this.ActiveBand;
	if(this.BandMaster)
		return this.BandMaster;
	if(this.Bands.length>0)
		return this.Bands[0];
	return null;
}
//单元刷新数据;如果已经掉线直接返回不刷新
_p.Query=function()
{
    if(document.OffLine || !this.Bands || this.Bands.length<1)
         return;
    var bandR=(this.BandMaster)?this.BandMaster:this.Bands[0];
    if(bandR)   bandR.XQuery(true);
    for(var i=0;i<this.Bands.length;i++)
    {
        if(this.Bands[i].NoAuto) continue;
        if("General"==this.Bands[i].itemType)
            this.Bands[i].XQuery(true);
    }
}
//控件恢复提交前状态
_p.getState=function()
{
	for(var i=0;i<this.Bands.length;i++)
	{
	    if(this.Bands[i].NoAuto) continue;
		if(this.Bands[i].RecordCount()<1)	continue;
		var root=this.Bands[i].XmlLandData.XMLDocument.documentElement;
		var xmlRowInit=root.selectNodes("/*/*[@state='init']");
		for(var j=xmlRowInit.length-1;j>-1;j--)
			xmlRowInit[j].parentNode.removeChild(xmlRowInit[j]);
	}
	if(this.BandMaster)
	{
		this.BandMaster.getState();
		if(this.BandMaster.XmlLandData && this.BandMaster.RecordCount()>0)
		    ToolUtil.sleep(50);
		if(this.BandMaster.XmlLandData && this.BandMaster.RecordCount()>0)
		    this.BandMaster.XmlLandData.onrowenter=function()
				    {
					    var xmlLandM=event.srcElement;
					    xmlLandM.bfireEvent=true;
					    var myUnitItem=document.UnitItem;
					    var BandM=myUnitItem.getBandByItemName(xmlLandM.itemname);
					    if(true==BandM.ManualRefresh && true!=this.IsPostBack)
					        return;
					    var strvalue=BandM.getFldStrValue(BandM.linkColM);
					    if(strvalue!="")
					    {
					        for(var i=0;i<myUnitItem.Bands.length; i++)
					        {
					            if(myUnitItem.Bands[i].NoAuto) continue;
						        var BandD=myUnitItem.Bands[i];
						        if(BandM !=BandD.getBandM())
						            continue;
						        if(BandD.RecordCount()==0)
						        {
					                if(true==this.IsPostBack && true==this.IsPostBackFull)
					                    BandD.RefreshFilterFld(BandD.linkCol,strvalue);
					                else
						                BandD.Refresh(BandD.linkCol,strvalue);
						        }
						        BandD.getState();
	                            var strXPath=".//Item[@masteritem='"+BandD.ItemName+"']";
	                            var nodeBand=myUnitItem.XmlConf.XMLDocument.selectSingleNode(strXPath);
    	                        
	                            if( (nodeBand || ("Master"==BandD.itemType && this.BandDetails.length>0)) )
						                BandD.XmlLandData.onrowenter=BandM.XmlLandData.onrowenter;
						        if(BandD.XmlLandData && !BandD.XmlLandData.bfireEvent)
						            BandD.XmlLandData.fireEvent("onrowenter");
					        }
					    }
				    };
		if(this.BandMaster.XmlLandData && !this.BandMaster.XmlLandData.bfireEvent)
		    this.BandMaster.XmlLandData.fireEvent("onrowenter");
	}
	for(var i=0;i<this.Bands.length;i++)
	{
	    if(this.Bands[i].NoAuto) continue;
	    if(!this.Bands[i].isInit)
		    this.Bands[i].getState();
    }
	//具有级联明细的段设置行改变事件
	for(var i=0;i<this.Bands.length;i++)
	{
	    if(this.Bands[i].NoAuto) continue;
	    if(!this.Bands[i].XmlLandData)
	        continue;
	        
	    if(GridUtil.usOnRowEnter2Handle)
	    {
	        this.Bands[i].XmlLandData.onRowEnterHandle=GridUtil.usOnRowEnter2Handle;
	        this.Bands[i].XmlLandData.onRowEnterHandle();
	    }
	    var strXPath=".//Item[@masteritem='"+this.Bands[i].ItemName+"']";
	    var nodeBand=this.XmlConf.XMLDocument.selectSingleNode(strXPath);
	    if(!this.Bands[i].XmlLandData)   continue;
	    if(nodeBand || ("Master"==this.Bands[i].itemType && this.BandDetails.length>0))
		    this.Bands[i].XmlLandData.onRowEnterHandle=GridUtil.usOnRowEnterHandle;
		if(this.Bands[i].RecordCount()>0 && this.Bands[i].XmlLandData.onRowEnterHandle)
		    this.Bands[i].XmlLandData.onrowenter=this.Bands[i].XmlLandData.onRowEnterHandle;
		else
		    this.Bands[i].XmlLandData.onrowenter=null;
	}
	//如果有用户加载本地XML文档;要加载本地数据
	this.ReadClientUp();
}
//leo fixed
_p.TransParams=function()
{
	var xmldoc=this.ParamXmldoc;
	ToolUtil.setParamValue(xmldoc, "Command", "TransParam", "", "P", "", "T");
	if(this.BandMaster)
        ToolUtil.setParamValue(xmldoc, "RecordCount", this.BandMaster.getFldStrValueSum("RecordCount"), "", "P", null, "C", "M");
    var xmlhttp=ToolUtil.SendPost(xmldoc);
	ToolUtil.resetParam(xmldoc);
	var responsetext= unescape(xmlhttp.responseText);
	if(!responsetext)		return "";
	if(responsetext=="-1") return "";
	if(responsetext.length<1) return "";
	return responsetext;
}
//读入用户上传的客户端用户XML数据
_p.ReadClientUp=function()
{
	var xmlLandUp=document.getElementsByTagName("XMLLANDUP");
	if(!xmlLandUp || xmlLandUp.length<1 || !xmlLandUp[0].ClientData)
		return;
	xmlLandUp=xmlLandUp[0];
	var clientUserDB=document.getElementById(xmlLandUp.ClientData);
	if(!clientUserDB)	return;
	var xmlLandList=clientUserDB.getElementsByTagName("XML");
	for(var i=0;i<this.Bands.length;i++)
	{
		band=this.Bands[i];
		var itemname=band.ItemName;
		
		//用客户端用户上传的XML数据更新当前数据岛数据,根据主键更新;没有主键直接增加
		var xmlLand=null;
		for(var j=0;j<xmlLandList.length;j++)
		{
			if(!xmlLandList[j].typexml || !xmlLandList[j].itemname || "Data_Up"!=xmlLandList[j].typexml || itemname!=xmlLandList[j].itemname)
				continue;
			xmlLand=xmlLandList[j];
			break;
		}
		if(xmlLand && xmlLand.XMLDocument && xmlLand.XMLDocument.documentElement)	
		{
			var root=xmlLand.XMLDocument.documentElement;
			var rootBand=band.XmlLandData.XMLDocument.documentElement;
			while(root.hasChildNodes())
			{	//已经主键更新记录,没有主键的或没有对应行的直接增加记录
				var strkey="";var xmlRowBand=null;
				if(band.keyCol && ""!=band.keyCol)
				{
					var xmlNodekey=root.firstChild.selectSingleNode(band.keyCol);
					if(xmlNodekey)
						strkey=xmlNodekey.text;
					if(strkey && ""!=strkey)
						xmlRowBand=rootBand.selectSingleNode("*["+band.keyCol+"='"+strkey+"']");
				}
				if(!xmlRowBand)
					rootBand.appendChild(root.firstChild);
				else
					rootBand.replaceChild(root.firstChild,xmlRowBand);
				
			}
		}
		//用客户端用户上传的XML数据更新当前数据岛数据,依据主键更新;没有主键的直接增加
		xmlLand=null;
		for(var j=0;j<xmlLandList.length;j++)
		{
			if(!xmlLandList[j].typexml || !xmlLandList[j].itemname || "Delete_Up"!=xmlLandList[j].typexml || itemname!=xmlLandList[j].itemname)
				continue;
			xmlLand=xmlLandList[j];
			break;
		}
		if(!xmlLand || !xmlLand.XMLDocument || !xmlLand.XMLDocument.documentElement)	
			continue;
		var root=xmlLand.XMLDocument.documentElement;
		var rootBand=band.XmlLandData.XMLDocument.documentElement;
		var rootDelBand=band.XmlChanged.XMLDocument.documentElement;
		while(root.hasChildNodes())
		{	//从当前记录中找到删除的记录,记录已经在删除区就忽略,没有的或没有对应行的直接增加记录
			var strkey="";var xmlRowBand=null;
			if(band.keyCol && ""!=band.keyCol)
			{
				var xmlNodekey=root.firstChild.selectSingleNode(band.keyCol);
				if(xmlNodekey)
					strkey=xmlNodekey.text;
				if(strkey && ""!=strkey)
					xmlRowBand=rootBand.selectSingleNode("*["+band.keyCol+"='"+strkey+"']");
			}
			if(xmlRowBand)
			{
			    xmlRowBand.setAttribute("state","delete");
				rootDelBand.appendChild(xmlRowBand);
				root.removeChild(root.firstChild);
			}
			else if(!rootDelBand.selectSingleNode("*["+band.keyCol+"='"+strkey+"']"))
				rootDelBand.appendChild(root.firstChild);
		}
	}//for(var i=0;i<this.Bands.length;i++)
	for(var i=0;i<this.Bands.length;i++)
		if(this.Bands[i].Grid)
		    this.Bands[i].Grid.setRowCursor(true);
}

//高级特性的影子函数,在实际调用时程序自动调用高级特性脚本覆盖影子函数
//影子函数
//当前所有的段数据是否修改
_p.IsModify=function()
{
	for(var i=0;i<this.Bands.length;i++)
	{
	    if(this.Bands[i].NoAuto) continue;
		if(this.Bands[i].IsModify())
			return true;
    }
	return false;
}

//保存数据岛记录
_p.saveData=function()
{
    if (this.isSaving) return;
    this.isSaving = true
    if(true!=this.IsModify())
    {
	    var result=ToolUtil.setValueTag("","成功","true");
	    result=ToolUtil.setValueTag(result,"提示","没有可修改的数据!");
	    delete this.isSaving;
	    return result;
    }
	var root=this.ParamXmldoc.documentElement;
	//加入系统参数
	
	ToolUtil.setParamValue(this.ParamXmldoc, "UnitName", this.UnitName, "", "P", "", "C");
	ToolUtil.setParamValue(this.ParamXmldoc, "Command", "Save", "", "P", "", "T");
    ToolUtil.setParamValue(this.ParamXmldoc, "DataSrcFile", this.DataSrcFile, "", "P", null, "T");
    ToolUtil.setParamValue(this.ParamXmldoc, "DictSrcFile", this.DictColSrcFile, "", "P", null, "T");
        
	
	if(this.workflow && this.workflow!="")
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
	//添加单元所有项目的修改记录,新增传入所有band的数据源以及DataSrcFile方法
	var strDataItems = "";
    for(var i=0;i<this.Bands.length;i++)
    {
        if(!this.Bands[i].XmlLandData || !this.Bands[i].XmlSchema || !this.Bands[i].XmlLandData.XMLDocument)
            continue;
        strDataItems = strDataItems+","+this.Bands[i].DataItem;
        var xnP=ToolUtil.setParamValue(this.ParamXmldoc, "Command", "Save", "", "B", this.Bands[i].ItemName, "D");
        var xeBand=xnP.parentNode;
        var rootBand=this.Bands[i].XmlLandData.XMLDocument.documentElement;
        if(!rootBand) continue;
        //当前区更改的数据
	    var xmlNodeList=rootBand.selectNodes("/*/*[@state and not(@opstate)]");
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
    strDataItems = strDataItems.substring(1,strDataItems.length);
    ToolUtil.setParamValue(this.ParamXmldoc, "workdataitems", strDataItems, "", "P", null, "T");
    //提交更新数据的XMLDoc文档
    try
    {
        var xmlhttp=ToolUtil.SendPost(this.ParamXmldoc);
    }catch(ex){
	    var result=ToolUtil.setValueTag("","成功","false");
	    result=ToolUtil.setValueTag(result,"提示","系统出错:保存失败");
	    delete this.isSaving;
	    return result;
    }
    ToolUtil.resetParam(this.ParamXmldoc);
    var strResult=unescape(xmlhttp.responseText);
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"==success)
    {
        for(var i=0;i<this.Bands.length;i++)
        {
            if(this.Bands[i].NoAuto) continue;
            this.Bands[i].ResetState();
        }
        for(var i=0;i<this.Bands.length;i++)
        {
            if(this.Bands[i].NoAuto) continue;
            this.Bands[i].FireEvent("AfterSave");
        }
    }
    delete this.isSaving;
    return strResult;
}
// srcitem - 数据源ItemName,type - 插入方式(import,checkin),ischild - 是否做子级或同级,chkid - 需校验的字段名
// loadchild - 是否附加当前行所带的子集
//ue_import(bandname,"import",null,chkids,null,sumfld,eqflds)
//sumfld - 同chkids相累加的字段,eqflds - 格式为@尺码(目标)=S(源),
//如果存在合计字段,并且检测出重复数据,则设置isAdd为true, 需累加的行号为repeatRowIdx
function ue_import(srcitem,type,ischild,chkids,loadchild,sumfld,eqflds,ctrl)
{
    if(!type) type="import";
    if(!ctrl) ctrl = event.srcElement;
	var oband = $band(srcitem);
	if(oband.Tree){
	    var trvNode=oband.Tree.WebTree.SelectedNode;
	    if(trvNode)
	        var xmlRows = oband.XmlLandData.XMLDocument.documentElement.selectNodes('*['+oband.Tree.IDField+'/text()[.="' + trvNode.ID +'"]]');
	}
	if(type=="checkin" || type=="checkadd")
	    var xmlRows = oband.rows;
	else
	    var xmlRows = oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
	var omsg = ($("msgbox"))?$("msgbox"):$("message");
	if(omsg) omsg.innerHTML="";
	if(xmlRows.length==0) 
	{
        if(ctrl.id=="txtbar" && omsg)omsg.innerHTML="没有数据!";
        else alert("没有数据!");
	    return;
	}
	
	//检测目的集中是否存在重复的节点
	if(window.dialogArguments)
	    var bandOpener=window.dialogArguments;
	else
	    if(document.importItem) var bandOpener = $band(document.importItem);
    var isAdd = false;
    //如果存在合计字段,则设置isAdd为true
	if(!ue_importcheck(chkids,eqflds,bandOpener,xmlRows,sumfld,ctrl,ischild)) return;
	var xpath = ue_importcheckPath(chkids,eqflds,xmlRows);
    var _chks;
    if(xpath) 
        _chks = bandOpener.XmlLandData.XMLDocument.documentElement.selectNodes(xspath);
    if(_chks && _chks.length>0 && sumfld)
        isAdd = true;
    if(window.dialogArguments)
    {
        if(loadchild && typeof(ws_xmlajax)=="function"){}
        else $U().CheckInParentUnit(type,ischild,loadchild);
	}
	else $U().CheckInSelfParentUnit(type,ischild,loadchild,eqflds,null,sumfld,isAdd,xpath);
	return true;
}

function ue_importcheckPath(chkids,eqflds,xmlRows)
{
    if(!chkids) return "";
    var a = chkids.split(",");
    var ss = "";    
    for(var m=0;m<xmlRows.length;m++)
    {
        var s = "";    
        for(var i=0;i<a.length;i++)
        {
            var selffld = ToolUtil.valueTag(eqflds,a[i])
            if(eqflds && selffld)
                var _chkvalue = selffld;
            else
                var _chkvalue = (xmlRows[m].selectSingleNode(a[i]))?xmlRows[m].selectSingleNode(a[i]).text:"";
            s = s + " and "+a[i]+"/text()[.='"+_chkvalue+"']";
        }
        s=s.substring(5,s.length);
        ss = ss + " or " + s;    
    }
    ss = ss.substring(4,ss.length);
    return xspath = '*[' + ss + ']';
}
//如果存在,并且返回真时,表示要累加,否则为新增数据
function ue_importcheck(chkids,eqflds,bandOpener,xmlRows,sumfld,ctrl,ischild)
{
    var omsg = ($("msgbox"))?$("msgbox"):$("message");
    if(!chkids || bandOpener.RecordCount()==0)
    {if(ctrl.id=="txtbar" && omsg) omsg.innerHTML=""; return true;}
    var xspath =  ue_importcheckPath(chkids,eqflds,xmlRows);
    if(bandOpener.Tree && xmlRows[0])
    {
        if(!chkids) return "";
        var a = chkids.split(",");    
        var _chkvalue = (xmlRows[0].selectSingleNode(a[0]))?xmlRows[0].selectSingleNode(a[0]).text:""; 
        xspath = treeimport(bandOpener,ischild,chkids,_chkvalue)
    }
    var _chks = bandOpener.XmlLandData.XMLDocument.documentElement.selectNodes(xspath);
    if(_chks.length>0)
    {
        if(ctrl.id=="txtbar" && omsg){omsg.innerHTML="数据已经存在!";return (sumfld)?true:false};
    	var result = confirm(" 数据已经存在,是否继续加入 ?     ");
    	if(!result) return;
    }
    if(ctrl.id=="txtbar" && omsg) omsg.innerHTML="";
    return true;
}
function treeimport(bandOpener,ischild,chkid,_chkvalue)
{
    //如果是同级，则检查上级的子集是否存在同名节点,如果是下级，则检查本节点为父的子集是否存在同名node
    _x = bandOpener.Tree.PIDField ;
    if(!bandOpener.Tree.WebTree.SelectedNode) 
        bandOpener.Tree.WebTree.SelectedNode = bandOpener.Tree.WebTree.Nodes()[0];
    if(ischild)
    {
        //此时，将增加该被选节点下面，因此，查询在其下是否存在同名数据,即PID=this.ID
        _xv = bandOpener.Tree.WebTree.SelectedNode.ID;
        var xspath = '*['+ _x +'/text()[.="'+ _xv +'"] and ' + chkid+'/text()[.="'+_chkvalue+'"]]';
    }
    else
    {
        //如果同级增加，查验是否存在父节点
        if(bandOpener.Tree.WebTree.SelectedNode.ParentNode)
        {
            _xv = bandOpener.Tree.WebTree.SelectedNode.ParentNode.ID;
            var xspath = '*['+ _x +'/text()[.="'+ _xv +'"] and ' + chkid+'/text()[.="'+_chkvalue+'"]]';                    
        }
        else
        {
            //同级，无父
            _xv = bandOpener.Tree.WebTree.SelectedNode.ID;
            var xspath = '*['+chkid+'/text()[.="'+_chkvalue+'"]]';
        }
    };
    return xspath;
   //var _chks = bandOpener.XmlLandData.XMLDocument.documentElement.selectNodes('*['+ _x +'/text()[.="'+ _xv +'"] and ' + chkid+'/text()[.="'+_chkvalue+'"]]');
}
_p.CheckInParentUnit=function()
{
    this.Loadjs.apply(this,new Array(arguments,"CheckInParentUnit"));
}

//用于非弹出式选择，其中需注意funtype,band.IsImport,document.importItem=目的数据的bandname
//参见assign.htm, trflds - 指定的字段对应关系, ismultiple多选,内容以字符串叠加的方式checkin入当前指定字段
_p.CheckInSelfParentUnit=function(funType,ischild,loadchild,trflds,ismultiple,sumfld,isAdd,xpath,noflds)
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
	
    if(!document.importItem) {alert("请定义目的数据集的名称！格式为[document.importItem=目的bandname]");return;}
	var bandOpener = $band(document.importItem);
	if(!funType || ""==funType)	funType="import";
	switch(funType)
	{
	    case "import":
	    case "replace":
	        var trvNode=null;
	        if(bandOpener.Tree)
	        {
	            if(bandOpener.Tree.WebTree.Nodes().length==0)
	                ischild=false;
	            trvNode = bandOpener.Tree.WebTree.SelectedNode
	        }
	        
		    for(var iband=0;iband<bands.length;iband++)
		    {
		        if(bandOpener.exportItem && bandOpener.exportItem!=bands[iband].ItemName) continue;
		        var colname = "选择";
		        var coltype=bands[iband].XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+colname+"']/@type");
		        var _datatype="";
		        if(coltype) var _datatype = coltype.value;
		        if(bands[iband].Tree)
		        {
	                srcNode=bands[iband].Tree.WebTree.SelectedNode;
	                if(srcNode)
	                    var xmlRows = bands[iband].XmlLandData.XMLDocument.documentElement.selectNodes('*['+bands[iband].Tree.IDField+'/text()[.="' + srcNode.ID +'"]]');
		        }
		        else
		        {
		            if(_datatype!="xs:boolean")
			            var xmlRows=bands[iband].XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true']");
			        else 
			            var xmlRows=bands[iband].XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			    }
			    // 如果loadchild=true,则根据所选的xmlRows对应的ID找出下属的子集，代替xmlRows插入到目的数据集中
			    var _chks;
			    if(xpath) _chks = bandOpener.XmlLandData.XMLDocument.documentElement.selectNodes(xpath);
			    var repeatRowIdx = (_chks && _chks.length>0)?parseInt(_chks[0].selectSingleNode("RowNum").text,10)-1:-1;
			    if(_chks && _chks.length>0 && isAdd && sumfld)
			        bandOpener.setFldStrValue(repeatRowIdx,sumfld,parseInt(bandOpener.getFldStrValue(sumfld,repeatRowIdx),10)+1);
			    else{
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
				        else if(funType=="import" && (isAdd || !_chks || _chks.length==0)) bandOpener.NewRecord();
   				        bandOpener.setRowValue(xmlRows[i],null,noflds,trflds);
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
			    }
			    if(bandOpener.Grid)
				    bandOpener.Grid.setRowCursor();
	            if(bandOpener.RecordCount() >0)
	            {
	                if(isAdd) var rowIndex = repeatRowIdx;
	                else
	                   var rowIndex=bandOpener.XmlLandData.recordset.AbsolutePosition-1;
	            }
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
	    case "checkadd":
		    for(var iband=0;iband<bands.length;iband++)
		    {
	            if( bands[iband].RecordCount() >0)
	                var rowIndex=bands[iband].XmlLandData.recordset.AbsolutePosition-1;
	            else
	                var rowIndex=-1;
			    if(rowIndex<0 || rowIndex>=bands[iband].XmlLandData.XMLDocument.documentElement.childNodes.length)
				    continue;
			    
	            if(funType=="checkadd" && !(isAdd && sumfld)) 
	            {
//	                var xmlRow=bands[iband].XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
//	                var _chks = (xpath && xpath.length>0)?xmlRow.selectNodes("."+xpath.substring(1,xpath.length)):"";
//	                if(!_chks || _chks.length==0) 
                    bandOpener.NewRecord();
	            }
    	        bandOpener.setCurrentRow(bandOpener.XmlLandData.recordset.AbsolutePosition-1);
			    var xmlRow=bands[iband].XmlLandData.XMLDocument.documentElement.childNodes[rowIndex];
			    bandOpener.setRowValue(xmlRow,null,noflds,trflds,isAdd,sumfld,xpath);
		    }
		    break;		    
	}
}

//校验当前数据是否合法;合格返回空;非法返回提示信息
//回传时,对保存不校验的项目段不校验,节约回传提交时间
_p.ValidatityAll=function(isPostBack)
{
	var		strMsg="";
	for(var i=0;i<this.Bands.length;i++)
		if("Master"==this.Bands[i].itemType)
		{
		    if(true==isPostBack && false==this.Bands[i].IsValidSave)
		        break;
			var str=this.Bands[i].ValidatityAll();
			if(str && ""!=str)
				strMsg +="*** "+this.Bands[i].key+" ***\n"+str;
			break;
		}
	for(var i=0;i<this.Bands.length;i++)
	{
		if("Master"==this.Bands[i].itemType)
			continue;
		if(true==isPostBack && false==this.Bands[i].IsValidSave)
		    continue;
		if(this.Bands[i].NoAuto) continue;
		var str=this.Bands[i].ValidatityAll();
		if(str && ""!=str)
			if(""==strMsg)
				strMsg +="*** "+this.Bands[i].key+" ***\n"+str;
			else
				strMsg +="\n *** "+this.Bands[i].key+" ***\n"+str;
	}
	return strMsg;
}

//加载脚本
_p.Loadjs=function(args,funname)
{
    if(!args || !funname || ""==funname)
        return;
    GridUtil.Loadjs(GridUtil.UnitAdv);
    //this.fun=arguments.callee;
    this.tempfun=function(){};
    eval('this.tempfun=this.'+funname);
    if("function"!=typeof(this.tempfun))
        return;
    return this.tempfun.apply(this,args);
}

//gridName注册的控件名;  tabdiv Grid显示的容器; tabTpHTML模板字符串;  isCustom是否用户定制
//如果isCustom为true那么tabdiv内已经有需要显示的Grid，包括需要显示的列及其属性
function Grid(gridName,tabdiv,tabTpHTML,isCustom)
{
	//把模板表格加入div中,没有模板的使用默认表格
	if(!tabdiv)	return;
	this.GridDiv    =   tabdiv;	//Grid底板
	tabdiv.Grid     =   this;
	//把Grid加入document的访问列表中
	var gridList=document.GridList;
	if(!gridName || ""==gridName)
		if(!gridList)   gridName="Grid0";
		else            gridName="Grid"+gridList.length;	
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
//	if(!isCustom)
//	{
//		tabdiv.innerHTML=(tabTpHTML)?tabTpHTML:GridUtil.getGridTpHTML();
//	}		
	this.Name=gridName;		//Grid的唯一名
	this.ItemName="";		//Grid的对应项目名称
	//滚动控制的控制,标题区,明细区,脚注区,功能区
	this.DivBody    =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	this.DivDetail  =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	this.DivTitle   =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");
    this.DivFunArea =   ToolUtil.getCtrlByNameD(false,this.GridDiv,"divtype","funarea");
	//标题、明细、脚注Table
	this.TabTitle   =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","title");
	this.Table      =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","detail");
	this.TabFoot    =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","foot");
	//单元格模板
	this.RowEditTp      =   ToolUtil.getCtrlByNameD(false,this.Table.tHead,"rowType","edit");		//模板编辑类型行
	this.RowReadonlyTp  =   ToolUtil.getCtrlByNameD(false,this.Table.tHead,"rowType","readonly");//模板只读类型行	
	this.CtrlMsg=ToolUtil.getCtrlByNameD(false,this.GridDiv,"name","message");		//模板内提示信息控件
	var ctrlTest=ToolUtil.getCtrlByTagD(false,this.Table,'INPUT','datatype','selectrow');
	if(ctrlTest)
	    this.HasRowChecked=true;
	else
	    this.HasRowChecked=false;
	//设置标题，明细，汇Table宽度
	this.DivBody.style.height   =   tabdiv.style.height;
	this.DivDetail.style.height =   tabdiv.style.height;
	this.Table.Grid     =   this;
	this.TabTitle.Grid  =   this;
	if(this.TabFoot) this.TabFoot.Grid=this;
	//数据岛属性
	this.XmlLand    =   null;	//明细数据岛
	this.XmlChanged =   null;   //删除的数据岛
	this.XmlSchema  =   null;	//明细数据结构数据岛
	this.XmlSum     =   null;	//汇总数据的数据岛
	this.XmlSumTemp =   null;	//汇总数据的临时数据岛
	this.HiddenFoot =   false;	//隐藏脚注,默认不隐藏
	this.Table.style.display="none";
	if(this.TabFoot) this.TabFoot.style.display="none";
    if(!isCustom)
    {
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
	}
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();
};


var _p=Grid.prototype;
//Grid初始化数据岛关系
_p.dataBindRefresh=function()
{
    GridUtil.Loadjs(GridUtil.GridLand);
    var grid=this.constructor.prototype=new Grid(this.Name,this.GridDiv);
    grid.dataBindRefresh.apply(grid,arguments);
}
//树控件
function Tree(treeID,xmlLandID)
{
    if(!treeID) 
    {
        this.WebTree=null;
        return;
    }
	this.WebTree=treeID;
	this.WebTree.Tree=this;
	this.XmlLandID=xmlLandID;
	var treeList=document.TreeList;
	//加入数组中
	if(!treeList)
    {
	    document.TreeList=new Array();	
	    treeList=document.TreeList;
    }
	treeList[treeList.length]=new function()
	    {
		    this.WebTree=treeID;
	    };
	this.Name=treeID.TreeViewID;		//Tree的唯一名
	this.ItemName="";		//Tree的对应项目名称
	//数据岛属性
	this.XmlLand=null;		//明细数据岛
	this.XmlChanged=null;   //删除的数据岛
	this.XmlSchema=null;	//明细数据结构数据岛
	this.XmlSum=null;		//汇总数据的数据岛
	this.XmlSumTemp=null;	//汇总数据的临时数据岛
}

//chartName:图表对应Band项目名称;group对应图表VML组;
function Chart(chartName,group)
{
    if(!group)  return;
    if(!document.ChartList)
        document.ChartList=new Array();
	var chartList=document.ChartList;
	var i=0;	//在数组中为空的序号
	for(;i<chartList.length;i++)
	{
		if(!chartList[i])
		    break;
		if(group.id==chartList[i].chartName)
			break;
	}
	chartList[i]=new function()
	{
		this.chartName=group.id;
		this.Element=group;
	};
    //图表区域的边距;此区域不显示数据
    this.MarginL=5;
    this.MarginR=5;
    this.MarginT=5;
    this.MarginB=5;
    //图表组,数据,图表类型,默认直方图:Legend:标识图例系列;Series数据系列;
    this.VmlGroup  = group;
    this.Element=group;
    group.Chart=this;
    this.ItemName=chartName;
    this.ChartType="verBar";
    this.LegendList=new Array();
    this.SeriesList=new Array();
    //初始化属性
    this.Width=this.Element.style.posWidth;
    this.Height=this.Element.style.posHeight;
    this.SizeX=this.Width;
    this.SizeY=this.Height;
    this.OffsetX=-this.Element.coordorigin.x;
    this.OffsetY=-this.Element.coordorigin.y;

    //模板内容
    this.VertBarSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalBar");
    this.VerLineSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalLine");
    this.PipeSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipe");
    this.PipeTSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipeT");
    this.DivData=this.Element;//ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","data");
    this.DivText=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","text");
    this.DivTemp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","template");
    this.GroupLegend=ToolUtil.getCtrlByNameD(false,this.Element,"chartElement","legend");
    if(this.DivTemp)
        this.CtrlInnerHTML=this.DivTemp.innerHTML;
    if(this.PipeSamp)
        this.PipeSamp.serHTML=this.PipeSamp.innerHTML;
    if(this.PipeTSamp)
        this.PipeTSamp.serTHTML=this.PipeTSamp.innerHTML;
    if(this.GroupLegend)
        this.GroupLegend.legHTML=this.GroupLegend.innerHTML;
    //图表区,背景布,X轴,Y轴
    this.BgWall=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","bgWall");
 
    //立方柱属性:宽度,图表数据查看方式:ByCol 按照列方式(默认),ByRow 按照行方式
    this.BarAttr=new function(){ this.Width=20;this.DataViewPoint="ByCol"};
    if(this.BgWall)
    {
        this.BgWall.style.width=this.SizeX;
        this.BgWall.style.height=this.SizeY;
        this.BgWall.style.left=-this.OffsetX;
        this.BgWall.style.top=-this.OffsetY;
        this.Radius=this.SizeY/3;
    }
}
//获取Chart类的一个引用
var _p =Chart.prototype;
//Tree初始化数据岛关系
_p.initDataLand=function()
{
    GridUtil.Loadjs(GridUtil.ChartAxis);
    GridUtil.Loadjs(GridUtil.ChartLand);
    var chart=this.constructor.prototype=new Chart(this.ItemName,this.Element);
    chart.initDataLand.apply(chart,arguments);
}
