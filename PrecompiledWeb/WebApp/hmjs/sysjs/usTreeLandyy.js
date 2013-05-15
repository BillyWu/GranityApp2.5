//gridName注册的控件名;
var vinit=0;
function Tree(tree,xmlLandID)
{
	//把Tree加入document的访问列表中
	this.WebTree=tree;
	this.WebTree.Tree=this;
	this.XmlLandID=xmlLandID;
	var treeList=document.TreeList;
	if(!tree || ""==tree.TreeViewID)
	{
		if(!treeList)
			tree.TreeViewID="Tree0";
		else
			tree.TreeViewID="Tree"+treeList.length;
	}
	//加入数组中
	if(!treeList)
	{
		document.TreeList=new Array();	
		treeList=document.TreeList;
	}
	for(var i=0;i<treeList.length;i++)
		if(!treeList[i] || tree.TreeViewID==treeList[i].TreeViewID)
			break;
	treeList[i]=new function()
	{
		tree.TreeViewID=tree.TreeViewID;
		this.WebTree=tree;
	};
	this.Name=tree.TreeViewID;		//Tree的唯一名
	this.ItemName="";		//Tree的对应项目名称
	//数据岛属性
	this.XmlLand=null;		//明细数据岛
	this.XmlChanged=null;//删除的数据岛
	this.XmlSchema=null;	//明细数据结构数据岛
	this.XmlSum=null;		//汇总数据的数据岛
	this.XmlSumTemp=null;	//汇总数据的临时数据岛
	
};
var _p=Tree.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//Tree数据绑定,递归建立树节点
_p.dataBind=function(xmlLand)
{
	if(!xmlLand || !xmlLand.XMLDocument)
		xmlLand=document.getElementById(this.XmlLandID);
	if(!xmlLand || !xmlLand.XMLDocument)
	    return;
	var Htmldoc=xmlLand.parentElement.ownerDocument;
	var xmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	if(!xmlSchema || !xmlSchema.XMLDocument )
		return null;
	//获取数据岛结构xml属性:tree.XmlSchema
	this.XmlLandID=xmlLand.id;
	this.XmlLand=xmlLand;
	this.XmlChanged=Htmldoc.getElementById(xmlLand.id+"_Delete");
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.XmlDict=Htmldoc.getElementById(xmlLand.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(xmlLand.id+"_Sum");
	this.ItemName=xmlLand.itemname;
	
	this.IDField=this.XmlSchema.idfld;      //关键字ID
	this.PIDField=this.XmlSchema.pidfld;    //父ID
	this.TxtField=this.XmlSchema.txtfld;    //文本ID
	this.SIDField=this.XmlSchema.selfid;    //
	this.KEYField=this.XmlSchema.keyfid;    //
	this.ValueField=this.XmlSchema.valuefld;//节点值
	
	this.TypeField=this.XmlSchema.typefld;  //节点类型ID
	this.OrderField=this.XmlSchema.orderfld;//节点排序ID
	if(this.XmlSchema.noexpand=="true")
	    this.NoExpand = true;
	else
	    this.NoExpand = false;
	
	
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Tree=this;
	this.Band=band;
	var nodeFirst=null;
	if(!this.XmlLand.XMLDocument.documentElement) return;
    var childNodes = this.WebTree.Nodes();
    while(childNodes.length>0)
    {
        try
        {
            this.WebTree.get_nodes().clear();
        }catch(ex){}
        childNodes = this.WebTree.Nodes();
    }

    var nodes=this.XmlLand.XMLDocument.documentElement.childNodes;
    if(this.NoExpand)
        //nodes = this.XmlLand.XMLDocument.documentElement.selectNodes("//level[text()='1']");
        nodes = this.XmlLand.XMLDocument.documentElement.selectNodes('*[level/text()[.="1"]]');
    for(var i=0;i<nodes.length;i++)
    {
        if(!nodeFirst)
            nodeFirst=this.bindTree(nodes[i]);
        else
            this.bindTree(nodes[i]);
    }
   this.WebTree.Render();
   return nodeFirst;
}
//Tree初始化数据岛关系
_p.dataBindRefresh=function(xmlLand)
{
	if(!xmlLand || !xmlLand.XMLDocument)
		xmlLand=document.getElementById(this.XmlLandID);
	if(!xmlLand || !xmlLand.XMLDocument)
	    return;
	var Htmldoc=xmlLand.parentElement.ownerDocument;
	var xmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	if(!xmlSchema || !xmlSchema.XMLDocument || xmlSchema.XMLDocument.documentElement.childNodes.length<1)
		return null;
	//获取数据岛结构xml属性:tree.XmlSchema
	this.XmlLandID=xmlLand.id;
	this.XmlLand=xmlLand;
	this.XmlChanged=Htmldoc.getElementById(xmlLand.id+"_Delete");
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.XmlDict=Htmldoc.getElementById(xmlLand.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(xmlLand.id+"_Sum");
	this.ItemName=xmlLand.itemname;
	this.IDField=this.XmlSchema.idfld;
	this.PIDField=this.XmlSchema.pidfld;
	this.TxtField=this.XmlSchema.txtfld;
	this.SIDField=this.XmlSchema.selfid;
	this.KEYField=this.XmlSchema.keyfid;
	this.ValueField=this.XmlSchema.valuefld;
	this.TypeField=this.XmlSchema.typefld;
	if(this.XmlSchema.noexpand=="true")
	    this.NoExpand = true;
	else
	    this.NoExpand = false;

	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Tree=this;
	this.Band=band;
}

/// 根据数据XmlDoc绑定树节点:节点ID,节点文本,节点父ID;如果该行对应的树节点已经建立就直接返回该节点
_p.bindTree=function(xmlNodeRow)
{
    if ("" == this.IDField || "" == this.PIDField || "" == this.TxtField || null == this.IDField || null == this.PIDField || null == this.TxtField
         || null == xmlNodeRow)
        return null;
    var xmlNodeID = xmlNodeRow.selectSingleNode(this.IDField);
    var xmlNodePid = xmlNodeRow.selectSingleNode(this.PIDField);
    var xmlNodeTxt = xmlNodeRow.selectSingleNode(this.TxtField);
    var xmlNodeValue = xmlNodeRow.selectSingleNode(this.ValueField);
    var xmlNodeType = xmlNodeRow.selectSingleNode(this.TypeField);
    
    if (null == xmlNodeID || (null==xmlNodeID.text || ""==xmlNodeID.text) || null == xmlNodeTxt )
        return null;

    var trvNode = this.getTrvNodeByID(xmlNodeID.text);
    if (null != trvNode)       return trvNode;
    
    var xmlNodeRowParent = null;
    if(null!=xmlNodePid && null!=xmlNodePid.text && ""!=xmlNodePid.text)
        xmlNodeRowParent= xmlNodeRow.parentNode.selectSingleNode("*[" + this.IDField + "='" + xmlNodePid.text + "']");
    var nodeParent = null;
    if (null != xmlNodeRowParent)
    {
        //if(!this.NoExpand) 
            nodeParent = this.bindTree(xmlNodeRowParent);
    }
    if (null != nodeParent)
    {
        this.WebTree.beginUpdate();
        var newNode = new ComponentArt.Web.UI.TreeViewNode(); 

        if(this.NoExpand)
        {
            var childcount = this.XmlLand.XMLDocument.documentElement.selectNodes('*[pcode/text()[.="'+xmlNodeID.text+'"]]').length;
            if(childcount>0)
                newNode.set_text("◆┄ "+xmlNodeTxt.text);
            else
                newNode.set_text(xmlNodeTxt.text);
        }
        else
            newNode.set_text(xmlNodeTxt.text);
        
        
//        newNode.set_text(xmlNodeTxt.text);
        newNode.set_id(xmlNodeID.text);
        newNode.set_pageViewId(xmlNodeID.text);
        newNode.set_value("@"+this.IDField+"="+xmlNodeID.text);
        nodeParent.AddNode(newNode);
        trvNode=nodeParent.get_nodes().getNodeById(xmlNodeID.text);
        this.WebTree.endUpdate;
        this.WebTree.Render();
    }
    else
    {
            this.WebTree.beginUpdate();
            var newNode = new ComponentArt.Web.UI.TreeViewNode(); 
            if(this.NoExpand)
            {
                var childcount = this.XmlLand.XMLDocument.documentElement.selectNodes('*[pcode/text()[.="'+xmlNodeID.text+'"]]').length;
                if(childcount>0)
                    newNode.set_text("◆┄ "+xmlNodeTxt.text);
                else
                    newNode.set_text(xmlNodeTxt.text);
            }
            else
                newNode.set_text(xmlNodeTxt.text);
            newNode.set_id(xmlNodeID.text);
            newNode.set_pageViewId(xmlNodeID.text);
            newNode.set_value("@"+this.IDField+"="+xmlNodeID.text);
            this.WebTree.get_nodes().add(newNode);
            
            trvNode=this.WebTree.Nodes()[0];
            this.WebTree.endUpdate;
            this.WebTree.Render();
    }
    //var tag=ToolUtil.setValueTag("",this.IDField,xmlNodeID.text);
    //trvNode.setTag(tag);
    return trvNode;
}

/// 根据节点ID对应于树的tag值包含的ID值找到树节点
_p.getTrvNodeByID=function(strid)
{
    return this.WebTree.FindNodeById(strid);
    /*
    if(null==strid || ""===strid)
        return null;
    var childNodes = this.WebTree.Nodes();
    var trvNode=null;
    if(childNodes.length>0)
        trvNode=childNodes[0];
    while(null != trvNode)
    {
        var nodeid=ToolUtil.valueTag(trvNode.Value,this.IDField);        
        if(strid==nodeid)   return trvNode;        
        trvNode = this.WebTree.FindNodeById(strid);
    }
    return null;
    */
}

function NextSiblingNode(node)
{
   //trvNode.StorageIndex  层号
   //trvNode.GetCurrentIndex 本层序号
   if(node.ParentNode)
   {
        if(node.ParentNode.Nodes().length>node.GetCurrentIndex()+1)
            return node.ParentNode.Nodes(node.GetCurrentIndex()+1);
   }
   else
   {
        if(node.StorageIndex==0)
        {
            if(node.ParentTreeView.Nodes().length>node.GetCurrentIndex()+2)
                return node.ParentTreeView.Nodes(node.GetCurrentIndex()+1);   
        }
        else
        {
            if(node.ParentNode.Nodes().length>node.GetCurrentIndex()+1)
                return node.ParentNode.Nodes(node.GetCurrentIndex()+1);        
        }
   }
   return null;
}

//根据树节点找到对应数据岛行号
_p.getRowIndexByTrvNodeXX=function(trvNode)
{
    if(!this.XmlLand || !this.XmlLand.XMLDocument || !this.XmlLand.XMLDocument.documentElement
         || !this.XmlSchema || !this.XmlSchema.XMLDocument || !this.XmlSchema.XMLDocument.documentElement )
         return -1;
    if(!trvNode)    trvNode=this.WebTree.getSelectedNode();
    if(!trvNode)    return;
    var nodeid=ToolUtil.valueTag(trvNode.Value,this.IDField);
    var nodes=this.XmlLand.XMLDocument.selectNodes("/*/*/"+this.IDField);
    for(var i=0;i<nodes.length;i++)
    {
        if(nodeid==nodes[i].text)
            return i;
    }
    return -1;
}

//根据树节点找到对应数据岛行号
_p.getRowIndexByTrvNode=function(trvNode)
{
    if(!this.XmlLand || !this.XmlLand.XMLDocument || !this.XmlLand.XMLDocument.documentElement
         || !this.XmlSchema || !this.XmlSchema.XMLDocument || !this.XmlSchema.XMLDocument.documentElement )
         return -1;
    if(!trvNode)    trvNode=this.WebTree.getSelectedNode();
    if(!trvNode)    return;
    var nodeid=trvNode.ID;
    var nodes=this.XmlLand.XMLDocument.selectNodes("/*/*/"+this.IDField);
    for(var i=0;i<nodes.length;i++)
    {
        if(nodeid==nodes[i].text)
            return i;
    }
    return -1;
}


//根据节点ID设置树节点的值;同时如果数据岛的值不同修改数据岛的对应字段值
//如果是ID字段,不更新数据岛对应字段
_p.setValueByID=function(nodeID,fldname,value)
{
    if( null==nodeID || fldname==this.IDField || null==fldname || ""==fldname)
        return;
    var trvNode=this.getTrvNodeByID(nodeID);
    if(null==trvNode)   return;
    this.setValueByTrvNode(trvNode,fldname,value);
}

//根据节点Node设置树节点的值;同时如果数据岛的值不同修改数据岛的对应字段值
//如果是ID字段,不更新数据岛对应字段
_p.setValueByTrvNode=function(trvNode,fldname,value)
{
    if(!trvNode || null==fldname || ""==fldname)
        return;
    if(fldname==this.IDField)
    {
        var tag=ToolUtil.setValueTag(trvNode.Value,this.IDField,value);
        trvNode.Value=tag;
        return;
    }
    var iRowIndex=this.getRowIndexByTrvNode(trvNode);
    var bandvalue=this.Band.getFldStrValue(fldname,iRowIndex);
    if(value!=bandvalue)
    {
        this.Band.setFldStrValue(iRowIndex,fldname,value);
        bandvalue=this.Band.getFldStrValue(fldname,iRowIndex);
    }
    if(fldname==this.TxtField)
    {
        if(bandvalue!=trvNode.getText())
            trvNode.setText(bandvalue);
    }
}
//根据数据岛行增加节点
_p.newNode=function(rowIndex)
{
    var nodepid=this.Band.getFldStrValue(this.PIDField,rowIndex);
    var nodeid=this.Band.getFldStrValue(this.IDField,rowIndex);
    var nodetxt=this.Band.getFldStrValue(this.TxtField,rowIndex);
    var trvNodeParent=null; var trvNode=null;
    if(null!=nodepid && ""!=nodepid)
        trvNodeParent=this.getTrvNodeByID(nodepid);
    //增加节点
    if(null!=nodeid && ""!=nodeid)
        trvNode=this.getTrvNodeByID(nodeid);
    if(!trvNode)    return trvNode;
    if (null != trvNodeParent)
        trvNode=trvNodeParent.addChild(nodetxt);
    else
        trvNode=this.WebTree.addRoot(nodetxt);
    if(null!=nodeid && ""!=nodeid)
    {
        nodeid=ToolUtil.NewGUID();
        this.Band.setFldStrValue(null,this.IDField,nodeid);
    }
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);
    trvNode.setTag(tag);
}

_p.newChildByNode=function(trvNodeParent,nodeChild)
{
    //与数据岛ID和文本值同步
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //增加前节点的父ID
    var pid = this.Band.getFldStrValue(this.PIDField);        //增加前节点的父ID
    var nodetxt=this.Band.getFldStrValue(this.TxtField);    
    
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    //根据trvNodeParent计算新的ID,PID+(child最后一个ID+10)
    var nodeid="";
    nodeid = this.getIdByParent(trvNodeParent,nodepid);

    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,"新节点");
        this.Band.setFldStrValue(rowIndex,this.ValueField,"新节点");
    }
    else
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodeChild.Text);
        this.Band.setFldStrValue(rowIndex,this.ValueField,nodeChild.Text);
    }
    var _srcband = nodeChild.ParentTreeView.Tree.Band;
    if(_srcband)
        this.Band.setFldStrValue(rowIndex,this.TypeField,ToolUtil.valueTag(nodeChild.Value,this.TypeField));
        
    //增加节点nodeChild.Value
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);    
    nodetag = tag;
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID', nodeid); 
    newNode.SetProperty('Text', nodeChild.Text); 
    try{
    newNode.SetProperty('Value', nodetag); 
    }
    catch(ex)
    {
        newNode.SetProperty('Value', tag); 
    }
    if(null != trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;     
    }
    else
    {
        this.WebTree.AddNode(newNode);
    
    }
    newNode.ParentTreeView.Render();
    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(null!=trvNodeParent)
    {
        var pid=ToolUtil.valueTag(trvNodeParent.Value,this.IDField);
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }else if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
    {
        if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
            var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
        else
            var bandM=this.Band.UnitItem.BandMaster;
        if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
            this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
    }
    return newNode;
}

_p.newChildByCopyNode=function(trvNodeParent,nodeChild)
{
    //与数据岛ID和文本值同步
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //增加前节点的父ID
    var pid = this.Band.getFldStrValue(this.PIDField);        //增加前节点的父ID
    var nodetxt=this.Band.getFldStrValue(this.TxtField);    
    
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    //根据trvNodeParent计算新的ID,PID+(child最后一个ID+10)
    var nodeid="";
    //如果pid="",拟取父数据项的关联字段值
    if(nodepid=="" && trvNodeParent==null)
    {
        if(this.Band.getBandM())
            nodepid = this.Band.getBandM().getFldStrValue(this.Band.getBandM().linkColM); 
    }
    nodeid = this.getIdByParent(trvNodeParent,nodepid);

    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    if(this.KEYField!="")
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,"新节点");
        this.Band.setFldStrValue(rowIndex,this.ValueField,"新节点");
    }
    else
    {
        this.Band.setFldStrValue(rowIndex,"copy of "+this.TxtField,nodeChild.Text);
        this.Band.setFldStrValue(rowIndex,"copy of "+this.ValueField,nodeChild.Text);
    }
    var _srcband = nodeChild.ParentTreeView.Tree.Band;
    if(_srcband)
        this.Band.setFldStrValue(rowIndex,this.TypeField,ToolUtil.valueTag(nodeChild.Value,this.TypeField));
    //增加节点nodeChild.Value
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);    
    nodetag = tag;
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID', nodeid); 
    newNode.SetProperty('Text', "copy of "+nodeChild.Text); 
    try{
    newNode.SetProperty('Value', nodetag); 
    }
    catch(ex)
    {
        newNode.SetProperty('Value', tag); 
    }
    if(null != trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;     
    }
    else
    {
        this.WebTree.AddNode(newNode);
    
    }
    newNode.ParentTreeView.Render();
    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(null!=trvNodeParent)
    {
        var pid=ToolUtil.valueTag(trvNodeParent.Value,this.IDField);
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }else if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
    {
        if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
            var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
        else
            var bandM=this.Band.UnitItem.BandMaster;
        if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
            this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
    }
    return newNode;
}


//添加新的子节点,同时数据岛增加行,返回添加的子节点 
_p.newChild=function(trvNodeParent,root)
{
    //与数据岛ID和文本值同步
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //增加前节点的父ID
    var pid     = this.Band.getFldStrValue(this.PIDField);        //增加前节点的父ID
    var selfid  = "";
    if(root)                                                //特别指定增加根节点,主要用于当前树为副表时的情况
    {
        if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
        {
            if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
                var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
            else
                var bandM=this.Band.UnitItem.BandMaster;
            if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
            {
                nodepid=bandM.getFldStrValue(bandM.linkColM);
                selfid = nodepid;
            }
        }
    }
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    if(root)
    {
        selfid = selfid + "-" +this.Band.getFldStrValue("RowNum");
    }
    
    var nodetxt=this.Band.getFldStrValue(this.TxtField);
    //根据trvNodeParent计算新的ID,PID+(child最后一个ID+10)
    var nodeid="";
    nodeid = this.getIdByParent(trvNodeParent,nodepid);
    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    if(this.KEYField!="")
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        nodetxt="新节点";
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodetxt);
        this.Band.setFldStrValue(rowIndex,this.ValueField,nodetxt);
    }
    if(selfid!="")
        this.Band.setFldStrValue(rowIndex,this.SIDField,selfid);
    
    //增加节点
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);    
    nodetag = tag;
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID', nodeid); 
    newNode.SetProperty('Text', nodetxt); 
    
    try{
    newNode.SetProperty('Value', nodetag); 
    }
    catch(ex)
    {
        newNode.SetProperty('Value', tag); 
    }
    if(null != trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;     
    }
    else
    {
        this.WebTree.AddNode(newNode);
    
    }
    newNode.ParentTreeView.Render();
    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(null!=trvNodeParent)
    {
        var pid=trvNodeParent.ID;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }
    else 
    {
        var pid=nodepid;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
        if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
        {
            
            this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
            
            if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
                var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
            else
                var bandM=this.Band.UnitItem.BandMaster;
            if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
                this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
        }
    }
    return newNode;
}

_p.getIdByParent=function(trvNodeParent,nodepid)
{
    if(trvNodeParent)
    {
        if(trvNodeParent.Nodes().length>0)
        {
            var xpid = trvNodeParent.Nodes()[trvNodeParent.Nodes().length-1].ID;
            var s = xpid.substring(trvNodeParent.ID.length,xpid.length); //得出去除上级ID后的字符串
            nodeid = parseInt(s)+10;
            nodeid = trvNodeParent.ID + nodeid+"";
        }   
        else
            nodeid = trvNodeParent.ID + "10";
    }
    else
    {
        if(this.WebTree.Nodes().length>0)
        {
            //取根nodes中最后一个node,nodepid为根节点的父ID(根父ID)，由主表关联字段预置
            //新节点的ID=根父ID + nodes的最后节点ID去除根父ID字符并取整后 + 10
            //算法： nodeid = xpid.substring(nodepid.length,xpid.length) = nodepid + 10;
            
            //取最后一个同级别ID，考虑到ID中可能存在非数字，因此，再找出xpid关联的上级码，如linkcol等,参数为PID
            var xpid    = this.WebTree.Nodes()[this.WebTree.Nodes().length-1].ID;
            
            var linkid  = this.Band.getFldStrValue(this.PIDField);
            var s = xpid.substring(xpid.length,linkid.length); //得出去除上级ID后的字符串
            if(s=="") s="0";
            nodeid = parseInt(s)+10;
            nodeid = linkid + nodeid+"";
        }
        else
            if(nodepid!="") nodeid = nodepid+10
            else
                nodeid = 10;
    }
    return nodeid;
}

//在树本身范围内把指定节点加入到目的节点;递归加子节点;不更新节点对应数据岛的PID和顺序号,只需在调用处更新;
//dstNode - 目的树上被选中的节点; srcNode - 源树上被选中的节点
//如果dstNode为空，则取树为根
_p.addChildByNode=function(dstNode,srcNode,iscopy)
{
    var nodeNew;
    if(null==srcNode) return;
    nodeNew = this.newChildByNode(dstNode,srcNode);  
    //递归添加子节点
    var nodeChildren = srcNode.Nodes();    
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}


//在树本身范围内把指定节点加入到目的节点;递归加子节点;不更新节点对应数据岛的PID和顺序号,只需在调用处更新;
_p.addChildByCopyNode=function(nodeParent,nodeChild,iscopy)
{
    var nodeNew;
    if(null==nodeChild) return;
   	var colList=this.Band.XmlSchema.XMLDocument.selectNodes("//xs:element");
    var srcBand = nodeChild.ParentTreeView.Tree.Band;   	
    if(null!=nodeParent && nodeChild.ParentNode!=null)
    {        
        nodeNew=this.newChildByCopyNode(nodeParent,nodeChild);
        var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
        var n=0;
        //找到源数据集中nodeChild.ID所在的行数
        for(var i=0;i<srcBand.RecordCount();i++)
        {
            var xid = srcBand.getFldStrValue(srcBand.Tree.IDField,i);
            var xpid = srcBand.getFldStrValue(srcBand.Tree.PIDField,i);    
            if(xid == nodeChild.ID && xpid==nodeChild.ParentNode.ID){ n=i;break;}
        }
	    for(var i=0;i<colList.length;i++)
	    {
		    var colname=colList[i].getAttribute("name");
		    if((colname==this.Band.Tree.IDField) || (colname==this.Band.Tree.PIDField) || (colname=="ID")  
		        || (colname==this.Band.linkCol)) continue;
		    this.Band.setFldStrValue(rowIndex,colname,nodeChild.ParentTreeView.Tree.Band.getFldStrValue(colname,n));   
        }        
    }
    else
    {
        nodeNew=this.newChildByCopyNode(null,nodeChild); 
        var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
        var n=0;
        for(var i=0;i<srcBand.RecordCount();i++)
        {
            var xid = srcBand.getFldStrValue(srcBand.Tree.IDField,i);
            if(xid==nodeChild.ID){ n=i;break;}
        }
        if(this.Band.ItemName==srcBand.ItemName)
            this.Band.setFldStrValue(null,this.Band.Tree.TxtField,"复件 " + nodeNew.Text);
        else
            this.Band.setFldStrValue(null,this.Band.Tree.TxtField,nodeNew.Text);
        //复制相关字段内容
	    for(var i=0;i<colList.length;i++)
	    {
		    var colname=colList[i].getAttribute("name");
		    if((colname==this.Band.Tree.IDField) || (colname==this.Band.Tree.PIDField)
		        || (colname==this.Band.Tree.TxtField) || (colname=="ID")  || (colname==this.Band.linkCol) || (colname==this.Band.Tree.KEYField)) continue;
		    this.Band.setFldStrValue(rowIndex,colname,srcBand.getFldStrValue(colname,n));   
        }
    }
    //递归添加子节点
    var nodeChildren=nodeChild.Nodes();
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByCopyNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}

//nodeParent - 为目的树选择的节点;nodeChild - 为需增加的节点，称为源节点
//事件为目的树Tree事件
_p.addChildByCopyNodeByImport=function(nodeParent,nodeChild,iscopy)
{
    var nodeNew;
    if(null==nodeChild) return;
   	var colList = this.Band.XmlSchema.XMLDocument.selectNodes("//xs:element");
    if(null!=nodeParent)
    {        
        nodeNew=this.newChildByCopyNodeByImport(nodeParent,nodeChild,iscopy);
        var n=0;
        for(var i=0;i<this.Band.RecordCount();i++)
        {
            var xid = this.Band.getFldStrValue(this.Band.Tree.IDField,i);
            if(xid==nodeChild.ID){ n=i;break;}
        }
	    for(var i=0;i<colList.length;i++)
	    {
		    var colname=colList[i].getAttribute("name");
		    if((colname==this.Band.Tree.IDField) || (colname==this.Band.Tree.PIDField)
		        || (colname==this.Band.Tree.TxtField) || (colname=="ID")) continue;
		    this.Band.setFldStrValue(null,colname,this.Band.getFldStrValue(colname,n));   
        }        
    }
    else
    {
        nodeNew=this.newChildByCopyNodeByImport(null,nodeChild,iscopy); 
        var n=0;
        for(var i=0;i<this.Band.RecordCount();i++)
        {
            var xid = this.Band.getFldStrValue(this.Band.Tree.IDField,i);
            if(xid==nodeChild.ID){ n=i;break;}
        }
    }
    //递归添加子节点
    var nodeChildren=nodeChild.Nodes();
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByCopyNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}

//查找有几个相同的字符
function CountIn(sText,sFind)  
{
   var iCount=0;
   var dstlen = sText.replaceAll(sFind,"").length;
   if(sFind.length>0) iCount=(sText.length-dstlen)/sFind.length;
   return iCount
}

//把节点放入指定节点之后;没有指定前节点不移动
_p.moveBeforeByNode=function(nodePrev,nodeSrc)
{

    if(null==nodeSrc) return;
    
    if(null!=nodePrev)
    {
        var index=nodePrev.GetCurrentIndex();
        var nodeParent=nodePrev.GetParentNode();
    }else{
        if(0==nodeSrc.GetCurrentIndex())   return;
        var index=-1;
        var nodeParent=nodeSrc.GetParentNode();
    }
    //改为换属性及内容的方法移动
    
    var node = BakNode(nodePrev);
    //新位置记录号
    var nRowIndex=this.getRowIndexByTrvNode(nodePrev);
    //原位置记录号
    var iRowIndex=this.getRowIndexByTrvNode(nodeSrc);
    this.Band.setFldStrValue(nRowIndex,this.TxtField,nodeSrc.Text);
    this.Band.setFldStrValue(iRowIndex,this.TxtField,nodePrev.Text);
    nodePrev.SetProperty('Text', nodeSrc.Text); 
    nodeSrc.SetProperty('Text', node.Text); 
    
    //调用自定义函数对相关数据进行处理
    //if(typeof(exchangeNode)=="function") exchangeNode(this.Band,nRowIndex,iRowIndex);
    for(var i=0;i<this.Band.XmlLandData.recordset.Fields.Count-1;i++)
    {
        var fn = this.Band.XmlLandData.recordset.Fields(i).Name;
        if(fn==this.IDField || fn==this.PIDField || fn==this.TxtField) continue;
        exchangeOther(this.Band,nRowIndex,iRowIndex,fn);        
    }
    
    
    return nodePrev;
    
    
    
    
    //nodePrev.SetProperty('ID', nodeSrc.ID); 
    nodePrev.SetProperty('Text', nodeSrc.Text); 
    //nodePrev.SetProperty('Value', nodeSrc.Value); 
    
    //nodeSrc.SetProperty('ID', node.ID); 
    nodeSrc.SetProperty('Text', node.Text); 
    //nodeSrc.SetProperty('Value', node.Value); 
    //return nodePrev;
    //更新顺序号
    var nodeNext=nodeSrc;
    while(null!=nodeNext && this.OrderField)
    {
        
        
        var bandvalue=this.Band.getFldStrValue(this.OrderField,iRowIndex);
        if(nRowIndex!=bandvalue)
        {
            this.Band.setFldStrValue(iRowIndex,this.OrderField,nodeNext.ID);
            bandvalue=this.Band.getFldStrValue(this.OrderField,iRowIndex);
        }
    }
    return nodePrev;
}


function BakNode(node)
{
    var newNode = new ComponentArt_TreeViewNode(); 
    //nodeSrc.PostBackID
    //nodeSrc.PageViewId
    newNode.SetProperty('ID', node.ID); 
    newNode.SetProperty('Text', node.Text); 
    newNode.SetProperty('Value', node.Value); 
    newNode.SetProperty('PageViewId', node.PageViewId); 
    newNode.SetProperty('PostBackID', node.PostBackID);     
    return newNode;
}

//删除指定节点;递归删除子节点;删除数据岛记录
_p.deleteNode=function(trvNode)
{
    if(null==trvNode)
        trvNode=this.getSelectedNode();
    if(null==trvNode)   return;
    var nodeChildren=trvNode.Nodes();
    for(var i=0;i<nodeChildren.length;i++)
        this.deleteNode(nodeChildren[i]);
    var iRowIndex=this.getRowIndexByTrvNode(trvNode);
    this.Band.DeleteRecord(iRowIndex);
    try{trvNode.remove();}catch(ex){}
}


function GetPrevSibling(node)
{
    var pnode = node.GetParentNode();
    if(!pnode)
    {
        if(node.GetCurrentIndex()>0)
            return node.get_parentTreeView().Nodes(node.GetCurrentIndex()-1);
        else
            return node;
        
    }
    else
    {
        if(node.GetCurrentIndex()>0)
            return pnode.Nodes(node.GetCurrentIndex()-1);
        else
            return node;
    }
}

function GetNextSibling(node)
{
    var pnode = node.GetParentNode();
    if(!pnode)
    {
        if(node.GetCurrentIndex() < node.get_parentTreeView().get_nodes().get_length()-1)
            return node.get_parentTreeView().Nodes(node.GetCurrentIndex()+1);
        else
            return node;
    }
    else
    {
        if(node.GetCurrentIndex() < pnode.ChildIndices.length-1)
            return pnode.Nodes(node.GetCurrentIndex()+1);
        else
            return node;
    }
}

// JScript source code

//创建Tree对象辅助工具对象
//TreeUtil.getGridByName(gridName)			根据名称获取Grid对象

//TreeUtil.onNodeSelectionChange()           树当前节点改变事件
//TreeUtil.onDropHandle()                     树节点拖动事件
//TreeUtil.moveUp=function(xmlID)           向上移动当前节点
//TreeUtil.moveDown=function(xmlID)         向下移动当前节点
//TreeUtil.addNode=function(xmlID,bChild)   对树添加节点;xmlID树对应的数据岛,bChild是否子级添加,否则加入同级
//TreeUtil.deleteNode=function(xmlID)       删除树树当前节点
//TreeUtil.paste=function(xmlID)            粘贴树
//TreeUtil.copy=function(xmlID)             复制树


var TreeUtil=new Object();
//根据名称获取Grid对象
TreeUtil.getGridByName=function(Tree)
{
	var treeList=document.TreeList;
	if(!treeList)	return null;
	for(var i=0;i<treeList.length;i++)
	{
		if(!treeList[i])	continue;
		if(Tree.TreeViewID==treeList[i].WebTree.TreeViewID && treeList[i].WebTree)
			return treeList[i].WebTree.Tree;
	}
	return null;
}
//树节点改变事件
TreeUtil.onNodeSelectionChange=function(node)
{
    var tree=TreeUtil.getGridByName(node.ParentTreeView);
    var iRowIndex=tree.getRowIndexByTrvNode(node);
    if(tree.Band)
	    tree.Band.setCurrentRow(iRowIndex);
	if(document.getElementById("itag"))
	    document.getElementById("itag").value = node.Value;
	if(typeof(Tree_onNodeSelectionChange)=="function")	Tree_onNodeSelectionChange(node);
}

TreeUtil.onNodeDoubleClick=function(node)
{
    
}

//树节点拖动事件
TreeUtil.onDropHandle=function(oTree, oNode, oDataTransfer, oEvent)
{
    if(null==oNode || null==oDataTransfer || null==oDataTransfer.sourceObject || null==oTree || null==oTree.Tree)
        return;
    var nodeSource=oDataTransfer.sourceObject;
    if(oNode.WebTree!=nodeSource.WebTree)
        return;
    var tree=oNode.WebTree.Tree;
    var nodeNew=oTree.Tree.addChildByNode(oNode,nodeSource);
    if(null!=nodeNew.getParent())
    {
        var pid=ToolUtil.valueTag(nodeNew.getParent().getTag(),tree.IDField);
        tree.setValueByTrvNode(nodeNew,tree.PIDField,pid);
    }else
        tree.setValueByTrvNode(nodeNew,tree.PIDField,"");
    if(null!=tree.OrderField && ""!=tree.OrderField)
        tree.setValueByTrvNode(nodeNew,tree.OrderField,nodeNew.getIndex());
    nodeNew.setSelected(true);
}

//增加包括子节点的所有节点
TreeUtil.addAllNode=function(srcBand,dstBand,iscopy)
{
    if(null==srcBand || null==dstBand)
        return;
    var srcNode=srcBand.Tree.WebTree.SelectedNode;
    var dstNode=dstBand.Tree.WebTree.SelectedNode;
    
    var stree=srcBand.Tree;
    var nodeNew;
    
    if(iscopy==true)
        nodeNew = dstBand.Tree.addChildByCopyNode(dstNode,srcNode,true);
    else
       nodeNew=dstBand.Tree.addChildByNode(dstNode,srcNode);
    dstBand.Tree.WebTree.Render();
    dstBand.Tree.WebTree.SelectNodeById(nodeNew.ID);
}

//向上移动节点
TreeUtil.moveUp=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
    var trvNode=band.Tree.WebTree.SelectedNode
    var ncode = band.getFldStrValue(band.Tree.IDField);
    var nindex = band.getFldStrValue("RowNum");
    if(null==trvNode)
       return;
    var prvNode = GetPrevSibling(trvNode);
    var nodeNew=band.Tree.moveBeforeByNode(prvNode,trvNode);
    //fixed 互换ID值
    //band.setFldStrValue(null,"审批结果","受理");
    band.Tree.WebTree.Render();
    band.Tree.WebTree.SelectNodeById(nodeNew.ID);
}



//向下移动节点
TreeUtil.moveDown=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
    var trvNode=band.Tree.WebTree.SelectedNode
    var nextNode = GetNextSibling(trvNode);    
    if(null==trvNode || null==nextNode)
       return;
    var nodeNew=band.Tree.moveBeforeByNode(nextNode,trvNode);
    band.Tree.WebTree.Render()
    band.Tree.WebTree.SelectNodeById(nodeNew.ID);
}

//对树添加节点;xmlID树对应的数据岛,bChild是否子级添加,否则加入同级, root是指只增加根节点
TreeUtil.addNode=function(xmlID,bChild,root)
{
    if(null==xmlID || ""==xmlID)    return;
    var xmlland=document.getElementById(xmlID);
    if(!xmlland)	return;
    var band=document.UnitItem.getBandByItemName(xmlland.itemname);
    if(!band || !band.Tree)     return;
    var trvNode=band.Tree.WebTree.SelectedNode;
    if(root)
    {
        //强迫在根上增加节点
        bChild = true;
        
        var nodeNew=band.Tree.newChild(null,true);
    }
    else
    {
        if(bChild)
            var nodeNew=band.Tree.newChild(trvNode);
        else
            var nodeNew=band.Tree.newChild(trvNode?trvNode.ParentNode:null);
    }
    band.Tree.WebTree.Render();
    band.Tree.WebTree.SelectNodeById(nodeNew.ID);
    return nodeNew
}

//删除树树节点
TreeUtil.deleteNode=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree || band.RecordCount()==0)     return;
	var trvNode=band.Tree.WebTree.SelectedNode;
	if(!trvNode)
	{
	    band.Tree.WebTree.SelectNodeById(band.getFldStrValue(band.Tree.IDField));
	    trvNode=band.Tree.WebTree.SelectedNode;
	}
	var nextId = getDeletedNodeId(trvNode)
	
 	var result = confirm("您将删除节点【"+trvNode.Text+"】,确认吗？");
	if(!result) return;
	band.Tree.WebTree.beginUpdate();
    band.Tree.deleteNode(trvNode);
    band.Tree.WebTree.endUpdate();
    band.Tree.WebTree.Render();
    if(nextId)
        band.Tree.WebTree.SelectNodeById(nextId);
}

function getDeletedNodeId(trvNode)
{
        if(!trvNode.get_parentNode())
           {
              
              if(trvNode.ParentTreeView.Nodes().length>trvNode.get_index()+1)
                var _node = trvNode.ParentTreeView.Nodes()[trvNode.get_index()+1];
              else
                    if(trvNode.ParentTreeView.Nodes().length==trvNode.get_index()+1 && trvNode.ParentTreeView.Nodes().length==1)
                    {
                        if(trvNode.ParentTreeView)
                            return null
                    }
                    else
                        _node = trvNode.ParentTreeView.Nodes()[trvNode.get_index()-1];
                if(_node)
                    return _node.ID
                else
                        return null
           }
           
        if(trvNode.get_parentNode().Nodes().length>trvNode.get_index()+1)
            var _node = trvNode.get_parentNode().Nodes()[trvNode.get_index()+1];
        else 
            if(trvNode.get_parentNode().Nodes().length==trvNode.get_index()+1)
            {
                if(trvNode.ParentNode)
                    return trvNode.ParentNode.ID
            }
            else
                _node = trvNode.get_parentNode().Nodes()[trvNode.get_index()-1];
        if(_node)
            return _node.ID
        else
            if(trvNode.ParentNode)
                return trvNode.ParentNode.ID
}

//复制树,复制树所有节点,并保持节点层次关系
TreeUtil.copy=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
	//克隆树节点文档
	document.XmlRootClone=null;
	var rootsrc=band.XmlLandData.XMLDocument.documentElement.cloneNode(true);
	document.XmlRootClone=rootsrc;
}
//粘贴树,把复制的树节点,加入树上,ID和PID字段值会重新生成,其他字段按照名称对应
TreeUtil.paste=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
	if(!document.XmlRootClone)  return;
	//检查结构是否相同,结构相同的树才可以复制粘贴
	var rootsrc=document.XmlRootClone;
	var colList=band.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var colname=colList[i].getAttribute("name");
		var nodeTest=rootsrc.selectSingleNode("*/"+colname);
		if(!nodeTest)   return;
	}
	//文档数据加入树,设置状态为新记录,更新主从关联字段值,父子字段值
	for(var i=0;i<rootsrc.childNodes.length;i++)
	{
	    var nodeID=rootsrc.childNodes[i].selectSingleNode(band.Tree.IDField);
	    if(!nodeID) continue;
	    var key=nodeID.text;
	    nodeID.text=ToolUtil.NewGUID();
	    var nodes=rootsrc.selectNodes("*/"+band.Tree.PIDField+"[text()='"+key+"']");
	    for(var j=0;j<nodes.length;j++)
	    {
	        nodes[j].text=nodeID.text;
	        nodes[j].parentNode.setAttribute("state","new");
	    }
	    nodeID.parentNode.setAttribute("state","new");
	}
	//更新关联字段值
	if("Detail"==band.itemType || (""!=band.MasterItemName && null!=band.MasterItemName) )
	{
        if(""!=band.MasterItemName && null!=band.MasterItemName)
            var bandM=band.UnitItem.getBandByItemName(band.MasterItemName);
        else
            var bandM=band.UnitItem.BandMaster;
		if(bandM && null!=band.linkCol && ""!=band.linkCol)
		{
		    var strvalue=bandM.getFldStrValue(bandM.linkColM);
	        var nodes=rootsrc.selectNodes("*/"+band.linkCol);
	        for(var j=0;j<nodes.length;j++)
	            nodes[j].text=strvalue;
	        //如果是跟节点,把PIDField属性设置为关联键值
	        var nodes=rootsrc.selectNodes("*/"+band.Tree.PIDField);
	        for(var j=0;j<nodes.length;j++)
	        {
	            var nodeTest=rootsrc.selectSingleNode("*/"+band.Tree.IDField+"[text()='"+nodes[j].text+"']");
	            if(nodeTest)    continue;
	            var nodeTest=band.XmlLandData.XMLDocument.selectSingleNode("/*/*/"+band.Tree.IDField+"[text()='"+nodes[j].text+"']");
	            if(nodeTest)    continue;
	            nodes[j].text=strvalue;
	        }
		}
	}
	//在树上建立克隆文档的节点
	var newChild=null;
	for(var i=rootsrc.childNodes.length-1;i>-1;i--)
	    newChild=band.XmlLandData.XMLDocument.documentElement.insertBefore(rootsrc.childNodes[i],newChild);
	if(band.XmlLandData.XMLDocument.documentElement)
	{
	    var nodes=band.XmlLandData.XMLDocument.documentElement.childNodes;
	    var nodeFirst=null;
	    for(var i=0;i<nodes.length;i++)
	        if(!nodeFirst)
	            nodeFirst=band.Tree.bindTree(nodes[i]);
	        else
	            band.Tree.bindTree(nodes[i]);
	}
}

//增加包括子节点的所有节点
TreeUtil.addAllNodeImport=function(srcBand,dstBand)
{
    if(null==srcBand || null==dstBand) return;
    //检查是否存在选择字段，如果存在，取选择为true的第一级Node作为被选择的Node
    var chkId = "";
    var nodeNew;
    var srcNodes;
    for(var i=0;i<srcBand.RecordCount();i++)
    {
        if(srcBand.getFldStrValue("选择",i)=="-1")
            chkId = srcBand.getFldStrValue(srcBand.Tree.IDField,i);
        
    }
    if(chkId=="")
    {
        srcNodes = srcBand.Tree.WebTree.Nodes();
        for(var i=0;i<srcNodes.length;i++)
        {
            var srcNode=srcNodes[i];
            var dstNode=dstBand.Tree.WebTree.SelectedNode;       
            nodeNew = dstBand.Tree.addChildByCopyNode(dstNode,srcNode,true);
        }
    }
    else
    {
        var srcNode=srcBand.Tree.WebTree.SelectedNode;
        srcNode=srcBand.Tree.WebTree.findNodeById(chkId);
        var dstNode=dstBand.Tree.WebTree.SelectedNode;       
        nodeNew = dstBand.Tree.addChildByCopyNode(dstNode,srcNode,true);
    }
    dstBand.Tree.WebTree.Render();
    dstBand.Tree.WebTree.SelectNodeById(nodeNew.ID);
}


_p.newChildByGridRow=function(trvNodeParent,xmlRow,ischild)
{
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //增加前节点的父ID
    this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    var nodeid="";
    if(nodepid=="" && trvNodeParent==null)
    {
        if(this.Band.getBandM())
            nodepid = this.Band.getBandM().getFldStrValue(this.Band.getBandM().linkColM); 
    }
    nodeid = this.getIdByParent(trvNodeParent,nodepid);
    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    var nodetxt;
	for(var i=0;i<xmlRow.childNodes.length;i++)
	{
		var xmlNodeCol = this.Band.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+xmlRow.childNodes[i].baseName+"']");
		if(!xmlNodeCol)	continue;
		if("RowNum"==xmlRow.childNodes[i].baseName || this.IDField==xmlRow.childNodes[i].baseName || this.Band.keyCol==xmlRow.childNodes[i].baseName
		      || this.Band.linkCol==xmlRow.childNodes[i].baseName || this.PIDField==xmlRow.childNodes[i].baseName)
		    continue;
		this.Band.setFldStrValue(null,xmlRow.childNodes[i].baseName,xmlRow.childNodes[i].text);
	}
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID', nodeid); 
    newNode.SetProperty('Text', this.Band.getFldStrValue(this.TxtField)); 
    var tag = ToolUtil.setValueTag(newNode.Value,this.IDField,this.Band.getFldStrValue(this.IDField));
    newNode.SetProperty('Value', tag); 

    if(ischild && trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;     
    }
    else
    {
        this.WebTree.AddNode(newNode);
    
    }
    newNode.ParentTreeView.Render();
    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(ischild)
    {
        var pid=trvNodeParent.ID;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }
    else 
    {
        var pid=nodepid;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
        if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
        {
            
            this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
            
            if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
                var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
            else
                var bandM=this.Band.UnitItem.BandMaster;
            if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
                this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
        }
    }
    
    newNode.ParentTreeView.Render();
    return newNode;
}

function ue_treeline(item,isline)
{
	var oband = document.UnitItem.getBandByItemName(item);				
	oband.Tree.WebTree.set_showLines(isline);
	oband.Tree.WebTree.Render();
}

function ue_expand(item,isexp)
{
	var oband=document.UnitItem.getBandByItemName(item);
	if(isexp) oband.Tree.WebTree.ExpandAll();
	else
		oband.Tree.WebTree.CollapseAll();
	oband.Tree.WebTree.Render();
}		

//文件结尾
GridUtil.FileLoaded=true;