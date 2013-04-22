// JScript source code

//gridNameע��Ŀؼ���;  tabdiv Grid��ʾ������; tabTpHTMLģ���ַ���;  isCustom�Ƿ��û�����
//���isCustomΪtrue��ôtabdiv���Ѿ�����Ҫ��ʾ��Grid��������Ҫ��ʾ���м�������
function Grid(gridName,tabdiv,tabTpHTML,isCustom)
{
	//��ģ�������div��,û��ģ���ʹ��Ĭ�ϱ��
	if(!tabdiv)	return;
	if(tabdiv.style.height.indexOf("%")>-1)
	{
	    var _h = tabdiv.offsetHeight - tabdiv.offsetTop;
	    if(_h>0)
	    {
	        if(tabdiv.offsetTop>0)
                tabdiv.style.pixelHeight = tabdiv.offsetHeight - tabdiv.offsetTop -4; 
            else
                tabdiv.style.pixelHeight = tabdiv.offsetHeight - tabdiv.offsetTop; 
            _h = parseInt(tabdiv.style.height.replace("%",""));
            if(_h>100) tabdiv.style.height = _h/100+"%";
        }
    }
	this.GridDiv=tabdiv;	//Grid�װ�
	tabdiv.Grid=this;
	//��Grid����document�ķ����б���
	var gridList=document.GridList;
	if(!gridName || ""==gridName)
		if(!gridList)
			gridName="Grid0";
		else
			gridName="Grid"+gridList.length;	
	//����������
	if(!gridList)
	{
		document.GridList=new Array();	
		gridList=document.GridList;
	}
	var inullGrid=-1;	//��������Ϊ�յ����
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
	this.Name=gridName;		//Grid��Ψһ��
	this.ItemName="";		//Grid�Ķ�Ӧ��Ŀ����
	//�������ƵĿ���,������,��ϸ��,��ע��,������
	this.DivBody    =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","body");
	this.DivDetail  =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","detail");
	this.DivTitle   =   ToolUtil.getCtrlByNameD(false,tabdiv,"divtype","title");
    this.DivFunArea =   ToolUtil.getCtrlByNameD(false,this.GridDiv,"divtype","funarea");
	//���⡢��ϸ����עTable
	this.TabTitle   =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","title");
	this.Table      =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","detail");
	this.TabFoot    =   ToolUtil.getCtrlByTagD(false,tabdiv,"TABLE","tabType","foot");
	//��Ԫ��ģ��
	this.RowEditTp  =   ToolUtil.getCtrlByNameD(false,this.Table.tHead,"rowType","edit");		   //ģ��༭������
	this.RowReadonlyTp  =   ToolUtil.getCtrlByNameD(false,this.Table.tHead,"rowType","readonly");  //ģ��ֻ��������	
	this.CtrlMsg    =   ToolUtil.getCtrlByNameD(false,this.GridDiv,"name","message");		       //ģ������ʾ��Ϣ�ؼ�
	var ctrlTest    =   ToolUtil.getCtrlByTagD(false,this.Table,'INPUT','datatype','selectrow');
	if(ctrlTest) this.HasRowChecked=true;
	else this.HasRowChecked=false;
	//���ñ��⣬��ϸ����Table���
	
	if(this.DivBody.style.height.indexOf("%")<0)
	    this.DivBody.style.height   =   tabdiv.style.height;
	//this.DivDetail.style.height =   tabdiv.style.height;
	this.Table.Grid     =   this;
	this.TabTitle.Grid  =   this;
	if(this.TabFoot) this.TabFoot.Grid=this;
	//���ݵ�����
	this.XmlLand    =null;		//��ϸ���ݵ�
	this.XmlChanged =null;   //ɾ�������ݵ�
	this.XmlSchema  =null;	//��ϸ���ݽṹ���ݵ�
	this.XmlSum     =null;		//�������ݵ����ݵ�
	this.XmlSumTemp =null;	//�������ݵ���ʱ���ݵ�
	this.HiddenFoot =false;	//���ؽ�ע,Ĭ�ϲ�����
	if(this.TabFoot && this.TabFoot.id!="specialdisplay") 
	    this.TabFoot.style.display="none";
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

	    this.warnFacColor="red";
	    this.warnBgColor="#FCFCFC";
	}
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();
};

var _p=Grid.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//Grid��ʼ�����ݵ���ϵ
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
	//��ȡ���ݵ��ṹxml����:grid.XmlSchema
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
//���ù�������ҳ��ǩ����
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

//���ù�������ҳ��ǩ����
_p.setFunArea=function()
{
	var  div=this.DivFunArea;
	if(!div)    return;
	if(this.XmlSum && this.XmlSum.XMLDocument)
	{
		//��ǰҳ��
		var xmlNodePageIndex=this.XmlSum.XMLDocument.selectSingleNode("/*/*/PageIndex");
		var lbctrl=ToolUtil.getCtrlByNameD(false,div,"name","lblCurrentPage");
		if(lbctrl)
			if("INPUT"==lbctrl.tagName)
				lbctrl.value=xmlNodePageIndex.text;
			else
				lbctrl.innerText=xmlNodePageIndex.text;
		//��ҳ��;��������������
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
		//��¼����
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
//�����б��;isRowCursor �Ƿ�����б�
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
	//�й����
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


//����Grid��ע
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

//���õ�ǰ��Ԫ��
_p.setActiveCell=function(tdcur)
{
	if(!tdcur || !tdcur.tagName || "TD"!=tdcur.tagName)
		return;
	var trcur=ToolUtil.getCtrlByTagU(true,tdcur,"TR","rowType","detail");
	if(this.curTd==tdcur || !trcur || null==trcur.recordNumber)
		return;
	var ctrlCol=ToolUtil.getCtrlByNameD(false,tdcur,"colname");
	var datastyle=tdcur.getAttribute("datatype");
	if(!ctrlCol && (!datastyle || ""==datastyle))
		return;
	//�������ڱ��,����Ӧ���ݵ����ݽṹ,�нڵ�
	if(this.XmlLand.recordset.AbsolutePosition != trcur.recordNumber)
		this.XmlLand.recordset.AbsolutePosition = trcur.recordNumber;
	//�ڵ�ǰ�еĵ�Ԫ�����л�ʱֻ�ı䵥Ԫ�����ɫ
	if(this.curTd!=tdcur && this.curTr==trcur)
	{
		this.setCtrlStateColor(this.curTd,"current");
		this.setCtrlStateColor(tdcur,"actived");
		this.curTd=tdcur;
		return;
	}
	//��ǰ��Ҳ�ı�,���Ȼָ�����ɫ,Ȼ�����õ�ǰ�к͵�ǰ��Ԫ����ɫ
	//������Ҳ��ѡ����,����isSelected����
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
//����ctrlContain����ɫ����;stateֵ�У�browse,current,actived,mouseover,selected;Ĭ��browse
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
			bgColor=this.browseBgColor;
			var val = ctrlContain.getAttribute("bgState");
			if(val) bgColor =  val;
			borderColor=this.browseFacColor;
			faceColor=this.browseFacColor;
			var val = ctrlContain.getAttribute("bgfacState");
			if(val)
			{
			    borderColor = val;
			    faceColor = val;
			}
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
		case "current":
			bgColor=this.curBgColor;
			borderColor=this.curBgColor;
			faceColor=this.curFacColor;
			break;
		case "actived":
			bgColor=this.actBgColor;
			borderColor=this.actBgColor;
			faceColor=this.actFacColor;
			break;
		case "mouseover":
			bgColor=this.curOverBgColor;
			borderColor=this.curOverBgColor;
			faceColor=this.curOverFacColor;
			
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
	//�жϺ���
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
		//������ɫ����
		if(ctrlContain.runtimeStyle)
		{
			if("TD"==ctrlContain.tagName)
				ctrlContain.runtimeStyle.backgroundColor=bgColor;
			else
				with(ctrlContain.runtimeStyle)
				{
					backgroundColor=bgColor;
					borderColor=borderColor;
					color=faceColor;
				}
		}
		//���ȱ����Ӽ�,ͬ����һ�ڵ�
		var ctrlTmp=ctrlContain.firstChild;
		if(!ctrlTmp)	ctrlTmp=ctrlContain.nextSibling;
		//���ϱ���ͬ����һ�ڵ�;�������ڵ�����ϸ��cell��ֹͣ
		while(!ctrlTmp && ctrlContain.parentElement && rootContain!=ctrlContain.parentElement)
		{
			var ctrlPTmp=ctrlContain.parentElement.nextSibling;
			if(!ctrlPTmp)	ctrlContain=ctrlContain.parentElement;
			else			ctrlTmp=ctrlPTmp;
		}
		ctrlContain=ctrlTmp;
	}
}

//ѡ����; rowIndex�к�;isSingle �Ƿ�ѡģʽ,Ĭ�ϵ�ѡģʽ
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
	//����ѡ����,���Զ���ѡ��ģʽ
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

//������ѡ���checked�з��Grid�������û�ѡ������ݵ��нڵ�����
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
//ɾ��ѡ�����
_p.DelRowSelected=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	for(var i=this.RowSelectedList.length-1;i>-1;i--)
	{
		var rowIndex=this.RowSelectedList[i].recordNumber-1;
		Band.DeleteRecord(rowIndex);
	}
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();
	this.setRowCursor(true);
}
//����Grid�п�ȵĸı�,����xmlhttp��ʽ
_p.saveWidth=function()
{
	var myUnitItem=document.UnitItem;
	var Band=myUnitItem.getBandByItemName(this.ItemName);
	//����ϵͳ����
	var xmldocP=this.XmlSchema.XMLDocument;
	ToolUtil.setParamValue(xmldocP, "UnitName", this.UnitName, "", "P", "", "C");
	ToolUtil.setParamValue(xmldocP, "Command", "SaveWidth", "", "P", "", "T");
    this.XmlSchema.XMLDocument.documentElement.setAttribute("UnitItem",myUnitItem.UnitName);
    this.XmlSchema.XMLDocument.documentElement.setAttribute("ItemName",this.ItemName);
    //�ύ�������ݵ�XMLDoc�ĵ�
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    try
    {
        var xmlhttp=ToolUtil.SendPost(xmldocP);
    }catch(ex){
	    var result=ToolUtil.setValueTag("","�ɹ�","false");
	    result=ToolUtil.setValueTag(result,"��ʾ","ϵͳ����:����ʧ��!");
	    return result;
    }
    return unescape(xmlhttp.responseText);
}
//��Grid����:colname������;ascdesc������:ascending ����;descending ����
_p.Sort=function(colname,datatype,ascdesc)
{
	if(!this.XmlSchema)		return;
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Sort(colname,datatype,ascdesc);
}

_p.setRowsChecked=function()
{
    if(!this.HasRowChecked || !this.XmlLand || this.XmlLand.XMLDocument.documentElement.childNodes.length<1)
	    return
	var root=this.XmlLand.XMLDocument.documentElement;
	for(var i=0;i<this.Table.rows.length;i++)
	{
	    var ir;   
		var tr=this.Table.rows[i];
	    
	    if(tr.recordNumber) ir=tr.recordNumber-1;
	    else ir=tr.rowIndex;
	    		
		var ctrlCheck=ToolUtil.getCtrlByTagD(false,tr,"INPUT",'datatype','selectrow');
		if(!ctrlCheck || "checkbox"!=ctrlCheck.type)
			continue;
		if(!tr || ir + 1<1)
			break;
		if(!root.childNodes[ir]) break;
		var isSelected=root.childNodes[ir].getAttribute("selected");
		isSelected=ToolUtil.Convert(isSelected,"bool");
		if(true==isSelected)
			ctrlCheck.checked=true;
		else
			ctrlCheck.checked=false;
	}
}

//�ļ���β
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;