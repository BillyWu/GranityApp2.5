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
_p.dataBind = function (xmlLand)
{
    if (!xmlLand || !xmlLand.XMLDocument)
        xmlLand = document.getElementById(this.XmlLandID);
    if (!xmlLand || !xmlLand.XMLDocument)
        return;
    var Htmldoc = xmlLand.parentElement.ownerDocument;
    var xmlSchema = Htmldoc.getElementById(xmlLand.id + "_Schema");
    if (!xmlSchema || !xmlSchema.XMLDocument)
        return null;
    //获取数据岛结构xml属性:tree.XmlSchema
    this.XmlLandID = xmlLand.id;
    this.XmlLand = xmlLand;
    this.XmlChanged = Htmldoc.getElementById(xmlLand.id + "_Delete");
    this.XmlSchema = Htmldoc.getElementById(xmlLand.id + "_Schema");
    this.XmlDict = Htmldoc.getElementById(xmlLand.id + "_Dict");
    this.XmlSum = Htmldoc.getElementById(xmlLand.id + "_Sum");
    this.ItemName = xmlLand.itemname;

    this.IDField = this.XmlSchema.idfld;      //关键字ID
    this.PIDField = this.XmlSchema.pidfld;    //父ID
    this.TxtField = this.XmlSchema.txtfld;    //树文本字段
    this.NameField = this.XmlSchema.namefld;    //树文本字段
    this.SIDField = this.XmlSchema.selfid;    //私有字段
    this.KEYField = this.XmlSchema.keyfid;    //关键字，编码，代码等
    this.ValueField = this.XmlSchema.valuefld; //节点值

    this.TypeField = this.XmlSchema.typefld;  //节点类型ID
    this.OrderField = this.XmlSchema.orderfld; //节点排序ID
    if (this.XmlSchema.noexpand && this.XmlSchema.noexpand.toLowerCase() == "true")
        this.NoExpand = true;
    else
        this.NoExpand = false;


    var myUnitItem = document.UnitItem;
    var band = myUnitItem.getBandByItemName(this.ItemName);
    band.Tree = this;
    this.Band = band;
    var nodeFirst = null;
    if (!this.XmlLand.XMLDocument.documentElement) return;
    var childNodes = this.WebTree.Nodes();
    while (childNodes.length > 0)
    {
        try
        {
            this.WebTree.get_nodes().clear();
        } catch (ex) { }
        childNodes = this.WebTree.Nodes();
    }

    var nodes = this.XmlLand.XMLDocument.documentElement.childNodes;
    var data = {};
    if (this.NoExpand)
        nodes = this.XmlLand.XMLDocument.documentElement.selectNodes('*[level/text()[.="1"]]');
    else
    {
        var cols = [this.IDField, this.PIDField, this.TxtField, this.ValueField, this.TypeField];
        var flds = this.IDField+","+this.PIDField+","+this.TxtField+","+this.ValueField+","+this.TypeField;
        for (var i = 0,len=nodes.length; i < len; i++)
        {
            var xns = nodes[i].childNodes;
            var value = {};
            for (var c = 0,l=xns.length; c < l; c++)
            {
                var cell=xns[c];
//                if( flds.indexOf(cell.tagName)<0 )
//                    continue;
                value[cell.tagName] = cell.text;
            }
            var id = "";
            value["RowIndexOrgi"] = i;
            if (cols[0]) id = value[cols[0]];
            data[id] = value;
        }
        if (cols[1])
        {
            for (var id in data)
            {
                var obj = data[id];
                var pid = obj[cols[1]];
                if (!pid) continue;
                var parent = data[pid];
                if (!parent) continue;
                if (!parent.childs)
                    parent.childs = {};
                parent.childs[id] = obj;
            }
        }
    }
    if (this.NoExpand)
    {
        for (var i = 0; i < nodes.length; i++)
        {
            if (!nodeFirst)
                nodeFirst = this.bindTree(nodes[i],false);
            else
                this.bindTree(nodes[i],false);
        }
    } else
    {
        for (var id in data)
        {
            if (!nodeFirst)
                nodeFirst = this.bindTree2(data[id], data);
            else
                this.bindTree2(data[id], data);
        }
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
	this.NameField=(!this.XmlSchema.namefld)?this.TxtField:this.XmlSchema.namefld;
	if(!this.NameField){alert("定义错误，树命名字段不存在!")};
	this.SIDField=this.XmlSchema.selfid;
	this.KEYField=this.XmlSchema.keyfid;
	this.ValueField=this.XmlSchema.valuefld;
	this.TypeField=this.XmlSchema.typefld;
	this.OrderField=this.XmlSchema.orderfld;//节点排序ID
	
	if(this.XmlSchema.noexpand && this.XmlSchema.noexpand.toLowerCase()=="true")
	    this.NoExpand = true;
	else
	    this.NoExpand = false;

	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(this.ItemName);
	if(!band){alert("【"+this.ItemName+"】错误！");return;}
	band.Tree=this;
	this.Band=band;
}

/// 根据数据XmlDoc绑定树节点:节点ID,节点文本,节点父ID;如果该行对应的树节点已经建立就直接返回该节点
_p.bindTree = function (xmlNodeRow, isupdateUI)
{
    if (!this.IDField || !this.PIDField || !this.TxtField || !xmlNodeRow)
        return null;
    var xmlNodeID = xmlNodeRow.selectSingleNode(this.IDField);
    if (!xmlNodeID || !xmlNodeID.text)
        return null;
    var trvNode = this.getTrvNodeByID(xmlNodeID.text);
    if (trvNode) return trvNode;
    var xmlNodePid = xmlNodeRow.selectSingleNode(this.PIDField);
    var xmlNodeTxt = xmlNodeRow.selectSingleNode(this.TxtField);
    if (!xmlNodeTxt) return null;
    if (this.ValueField)
        var xmlNodeValue = xmlNodeRow.selectSingleNode(this.ValueField);
    if (this.TypeField)
        var xmlNodeType = xmlNodeRow.selectSingleNode(this.TypeField);

    var xmlNodeRowParent = null;
    if (xmlNodePid && xmlNodePid.text)
        xmlNodeRowParent = xmlNodeRow.parentNode.selectSingleNode("*[" + this.IDField + "='" + xmlNodePid.text + "']");
    var nodeParent = null;
    if (xmlNodeRowParent)
        nodeParent = this.bindTree(xmlNodeRowParent, isupdateUI);
    if(false!==isupdateUI)
        this.WebTree.beginUpdate();
    var newNode = new ComponentArt.Web.UI.TreeViewNode();
    if (this.NoExpand)
    {
        var childnode = this.XmlLand.XMLDocument.documentElement.selectSingleNode('*[' + this.PIDField + '/text()[.="' + xmlNodeID.text + '"]]');
        if (childnode)
            newNode.set_text(xmlNodeTxt.text + " ...");
        else
            newNode.set_text(xmlNodeTxt.text);
    }
    else
        newNode.set_text(xmlNodeTxt.text);
    newNode.set_id(xmlNodeID.text);
    newNode.set_pageViewId(xmlNodeID.text);
    if (xmlNodeValue)
        newNode.set_value(xmlNodeValue.text);
    else
        newNode.set_value("@" + this.IDField + "=" + xmlNodeID.text);

    var tBand = this.WebTree.Tree.Band;
    if (xmlNodeType && xmlNodeType.text == tBand.treechkbox && tBand.treechkbox != "" && !tBand.TreeChkBoxs)
        newNode.set_showCheckBox(true)
    else if (tBand.TreeChkBoxs)
        newNode.set_showCheckBox(true)
    if (nodeParent)
    {
        nodeParent.AddNode(newNode);
        trvNode = nodeParent.get_nodes().getNodeById(xmlNodeID.text);
    } else
    {
        var nodes = this.WebTree.get_nodes();
        nodes.add(newNode);
        trvNode = nodes.getNodeById(xmlNodeID.text);
    }
    if(false!==isupdateUI)
        this.WebTree.endUpdate();
    return trvNode;
}
/// 数据转换为json格式，递归绑定节点树：节点ID,节点文本,节点父ID;如果该行对应的树节点已经建立就直接返回该节点
_p.bindTree2 = function (obj, data)
{
    if (!this.IDField || !this.PIDField || !this.TxtField || !obj)
        return null;
    if (!obj[this.IDField])
        return null;
    if(obj.trvNode) return obj.trvNode;
    //var trvNode = this.getTrvNodeByID(obj[this.IDField]);
    //if (trvNode) return trvNode;
    if (!obj[this.TxtField])
        return null;
    var pid = obj[this.PIDField];
    var txt = obj[this.TxtField];
    if (this.ValueField)
        var value = obj[this.ValueField];
    if (this.TypeField)
        var nodetype = obj[this.TypeField];
    var objparent = null;
    if (pid)
        objparent = data[pid];
    var nodeParent = null;
    if (objparent)
        nodeParent = this.bindTree2(objparent, data);
    var newNode = new ComponentArt.Web.UI.TreeViewNode();
    if (this.NoExpand && obj["childs"])
        newNode.set_text(txt + " ...");
    else
        newNode.set_text(txt);
    newNode.set_id(obj[this.IDField]);
    newNode.set_pageViewId(obj[this.IDField]);
    if (value)
        newNode.set_value(value);
    else
        newNode.set_value("@" + this.IDField + "=" + obj[this.IDField]);

    var tBand = this.WebTree.Tree.Band;
    if (nodetype == tBand.treechkbox && tBand.treechkbox != "" && !tBand.TreeChkBoxs)
        newNode.set_showCheckBox(true)
    else if (tBand.TreeChkBoxs)
        newNode.set_showCheckBox(true)
    if (nodeParent)
    {
        nodeParent.AddNode(newNode);
        var trvNode = nodeParent.get_nodes().getNodeById(obj[this.IDField]);
    } else
    {
        var nodes = this.WebTree.get_nodes();
        nodes.add(newNode);
        var trvNode = nodes.getNodeById(obj[this.IDField]);
    }
    obj.trvNode = trvNode;
    if (-1 < obj["RowIndexOrgi"])
        trvNode.RowIndexOrgi = obj["RowIndexOrgi"];
    return trvNode;
}
/// 根据节点ID对应于树的tag值包含的ID值找到树节点
_p.getTrvNodeByID=function(strid)
{
    return this.WebTree.FindNodeById(strid);
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
_p.getRowIndexByTrvNode = function (trvNode, isrefresh)
{
    if (0 < trvNode.RowIndexOrgi)
        return trvNode.RowIndexOrgi;
    if (!this.XmlLand || !this.XmlLand.XMLDocument || !this.XmlLand.XMLDocument.documentElement
         || !this.XmlSchema || !this.XmlSchema.XMLDocument || !this.XmlSchema.XMLDocument.documentElement)
        return -1;
    if (!trvNode) trvNode = this.WebTree.getSelectedNode();
    if (!trvNode) return;
    var nodeid = trvNode.ID;
    if(!isrefresh)
    {
        var xmlRow = this.XmlLand.XMLDocument.documentElement.selectSingleNode("*[" + this.IDField + "='" + trvNode.ID + "']");
        var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text, 10) - 1;
        return nRowIndex;
    }
    var nodes = this.XmlLand.XMLDocument.selectNodes("/*/*/" + this.IDField);
    for (var i = 0; i < nodes.length; i++)
    {
        if (nodeid == nodes[i].text)
            return i;
    }
    return -1;
    //return nRowIndex;
}

//根据树节点找到对应数据岛行号
_p.getRowIndexByNodeId = function (nodeid)
{
    if (!this.XmlLand || !this.XmlLand.XMLDocument || !this.XmlLand.XMLDocument.documentElement
         || !this.XmlSchema || !this.XmlSchema.XMLDocument || !this.XmlSchema.XMLDocument.documentElement)
        return -1;
    var xmlRow = this.XmlLand.XMLDocument.documentElement.selectSingleNode("*[" + this.IDField + "='" + nodeid + "']");
    var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text, 10) - 1;
    return nRowIndex;
}

//根据树节点找到对应数据岛行号
_p.getValueById=function(nodeid,fldname)
{
    return this.Band.getFldStrValue(fldname,this.getRowIndexByNodeId(nodeid));
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


_p.newChildByCopyNode=function(trvNodeParent,nodeChild)
{
    //与数据岛ID和文本值同步
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //增加前节点的父ID
    var pid = this.Band.getFldStrValue(this.PIDField);        //增加前节点的父ID
    var nodetxt=this.Band.getFldStrValue(this.TxtField);    
    
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    //根据trvNodeParent计算新的ID,PID+(child最后一个ID+10)
    if(nodepid=="" && trvNodeParent==null)
    {
        if(this.Band.getBandM())
            nodepid = this.Band.getBandM().getFldStrValue(this.Band.getBandM().linkColM); 
    }
    nodeid = this.Band.getFldStrValue(this.IDField);
    if(this.KEYField!="")
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,"新节点");
        if(this.ValueField)
            this.Band.setFldStrValue(rowIndex,this.ValueField,"新节点");
    }
    else
    {
        this.Band.setFldStrValue(rowIndex,"copy of "+this.TxtField,nodeChild.Text);
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
        var pid = trvNodeParent.ID;
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

function _newNode(id,txt,value,pid)
{
    var newNode = new ComponentArt_TreeViewNode(); 
    newNode.SetProperty('ID'    , id); 
    newNode.SetProperty('Text'  , txt); 
    newNode.SetProperty('Value' , value); 
    return newNode;
}

_p.newChildByNode=function(trvNodeParent,nodeChild)
{
    //与数据岛ID和文本值同步
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    var nodetxt=this.Band.getFldStrValue(this.TxtField);
    var nodeid=this.Band.getFldStrValue(this.IDField);
    
    
    if(null==nodeid || ""==nodeid)
    {
        nodeid=ToolUtil.NewGUID();
        this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    }
    if(null==nodetxt || ""==nodetxt)
    {
        nodetxt="新节点";
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodeChild.Text);
        if(this.NameField)
            this.Band.setFldStrValue(rowIndex,this.NameField,nodeChild.Text);
    }
    
    //增加节点
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);
    var newNode = _newNode(nodeid,nodeChild.Text,tag);
        
    if(null != trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;
    }
    else
        this.WebTree.AddNode(newNode);
    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(null!=trvNodeParent)
    {
        var pid = trvNodeParent.ID;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }else 
    if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
    {
        if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
            var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
        else
            var bandM=this.Band.UnitItem.BandMaster;
        if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
            this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
    }
    
    if(null!=this.OrderField && ""!=this.OrderField)
        this.Band.setFldStrValue(rowIndex,this.OrderField,this.Band.getFldStrValue("RowNum"));

    //补充数据
    if(this.KEYField!="")
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    if(this.SIDField!="")
        this.Band.setFldStrValue(rowIndex,this.SIDField,nodeid);
    return newNode;

}


_p.newChild=function(trvNodeParent)
{
    //与数据岛ID和文本值同步
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    var nodetxt=this.Band.getFldStrValue(this.TxtField);
    var nodeid=this.Band.getFldStrValue(this.IDField);
    if(null==nodeid || ""==nodeid)
    {
        nodeid=ToolUtil.NewGUID();
        this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    }
    if(null==nodetxt || ""==nodetxt)
    {
     if(null!=trvNodeParent)
     {
        nodetxt="子节点";}else
        
        {
        
        nodetxt="上级节点";
        }
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodetxt);
        if(this.NameField)
            this.Band.setFldStrValue(rowIndex,this.NameField,nodetxt);
    }
    //增加节点
    var tag=ToolUtil.setValueTag("",this.IDField,nodeid);
    var newNode = _newNode(nodeid,nodetxt,tag);
    if(null != trvNodeParent)
    {
        trvNodeParent.AddNode(newNode);
        newNode.ParentNode = trvNodeParent;
    }
    else
        this.WebTree.AddNode(newNode);
    this.WebTree.Render();

    //给PID赋值,如果是根节点,又是明细树,就把关联值赋值给父节点,给序号赋值
    if(null!=trvNodeParent)
    {
        var pid = trvNodeParent.ID;
        this.Band.setFldStrValue(rowIndex,this.PIDField,pid);
    }else 
    if("Detail"==this.Band.itemType || (""!=this.Band.MasterItemName && null!=this.Band.MasterItemName) )
    {
        if(""!=this.Band.MasterItemName && null!=this.Band.MasterItemName)
            var bandM=this.Band.UnitItem.getBandByItemName(this.Band.MasterItemName);
        else
            var bandM=this.Band.UnitItem.BandMaster;
        if(bandM && null!=this.Band.linkCol && ""!=this.Band.linkCol)
            this.Band.setFldStrValue(rowIndex,this.PIDField,this.Band.getFldStrValue(this.Band.linkCol));
    }
    
    if(null!=this.OrderField && ""!=this.OrderField)
        this.Band.setFldStrValue(rowIndex,this.OrderField,this.Band.getFldStrValue("RowNum"));

    //补充数据
    if(this.KEYField)
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    if(this.SIDField)
        this.Band.setFldStrValue(rowIndex,this.SIDField,nodeid);
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
            //if(nodeid==NaN) nodeid
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
    //设置替换字段内容
    var srcband = srcNode.ParentTreeView.Tree.Band;
    if(!srcband) return;
    var xmlRows = srcband.XmlLandData.XMLDocument.documentElement.selectNodes('*['+srcband.Tree.IDField+'/text()[.="' + srcNode.ID +'"]]');
    if(xmlRows.length==1)
    this.Band.setRowValue(xmlRows[0]);
    if(nodeNew.Text=="")
        nodeNew.Text=srcband.getFldStrValue(srcband.Tree.TxtField);
    if(dstNode.ParentTreeView.Tree.Band.getFldStrValue(dstNode.ParentTreeView.Tree.TxtField)=="")
        dstNode.ParentTreeView.Tree.Band.setFldStrValue(null,dstNode.ParentTreeView.Tree.TxtField,nodeNew.Text)
        //nodeNew.Text=srcband.getFldStrValue(srcband.Tree.TxtField);
    
//    dstNode.ParentTreeView.Tree.TxtField
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
		    if((colname==this.Band.Tree.IDField) 
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
		    if((colname==this.Band.Tree.IDField) || (colname==this.Band.linkCol) || (colname==this.Band.Tree.NameField)) continue;
		    this.Band.setFldStrValue(rowIndex,colname,srcBand.getFldStrValue(colname,n));   
        }
    }
    //递归添加子节点
    var nodeChildren = nodeChild.Nodes();
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
_p.moveBeforeByNode_xxx=function(nodePrev,nodeSrc)
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
    //新位置记录号,取上一行的行记录
    var xmlRow = this.XmlLand.XMLDocument.documentElement.selectSingleNode("*["+this.Band.Tree.IDField+"='"+nodePrev.ID+"']");
    var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text)-1;
    
    //原位置记录号
    var iRowIndex=parseInt(this.Band.getFldStrValue("RowNum"))-1;
    //调用自定义函数对相关数据进行处理
    for(var i=0;i<this.Band.XmlLandData.recordset.Fields.Count-1;i++)
    {
        var fn = this.Band.XmlLandData.recordset.Fields(i).Name;
        if(fn=="RowNum") continue;
        exchangeOther(this.Band,nRowIndex,iRowIndex,fn);        
    }
    nodePrev.SetProperty('Text', nodeSrc.Text); 
    nodeSrc.SetProperty('Text', node.Text); 
    
//    this.Band.setCurrentRow(iRowIndex);
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
_p.deleteNode=function(trvNode,noChildren)
{
    if(null==trvNode)
        trvNode=this.getSelectedNode();
    if(null==trvNode)   return;
    var nodeChildren=trvNode.Nodes();
    if(noChildren && nodeChildren.length>0)
    {
        alert("友情提示：请先删除下级节点!");return;
    }
    for(var i=0;i<nodeChildren.length;i++)
        this.deleteNode(nodeChildren[i]);
    var iRowIndex=this.getRowIndexByTrvNode(trvNode,true);
    this.Band.DeleteRecord(iRowIndex);
    try{trvNode.remove();}catch(ex){}
    var nodes = this.XmlLand.XMLDocument.selectNodes("/*/*/RowNum");
    for(var i=iRowIndex,len=nodes.length; i<len; i++)
        nodes[iRowIndex].text = i+1;
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
    if(!node) return;
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
    if(typeof(ws_clearlocation)=="function") 
        if(ws_clearlocation(node)==true) return;
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
//<![CDATA[
TreeUtil.onNodeBeforeMove=function(sender, eventArgs)
{
}
//]]>

function TreeView_onNodeBeforeMove(sender, eventArgs)
{
    var targetNode = eventArgs.get_newParentNode(); 
    var sourceNode = eventArgs.get_node(); 

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

//把节点放入指定节点之后;没有指定前节点不移动
_p.moveBeforeByNode=function(dstNode,srcNode)
{
    if(null==srcNode) return;    
    if(null!=dstNode)
    {
        var index=dstNode.GetCurrentIndex();
        var nodeParent=dstNode.GetParentNode();
    }else{
        if(0==srcNode.GetCurrentIndex())   return;
        var index=-1;
        var nodeParent=srcNode.GetParentNode();
    }
    
    if(null==dstNode)  return;
    var iRowIndex = parseInt(this.Band.getFldStrValue("RowNum"))-1;        
    var node = BakNode(dstNode);
    var xmlRow = this.Band.XmlLandData.XMLDocument.documentElement.selectSingleNode("*["+this.Band.Tree.IDField+"='" + dstNode.ID+"']");
    var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text)-1;
    
    for(var i=0;i<this.Band.XmlLandData.recordset.Fields.Count-1;i++)
    {
        var fn = this.Band.XmlLandData.recordset.Fields(i).Name;
        if(fn=="RowNum") continue;
        exchangeOther(this.Band,nRowIndex,iRowIndex,fn);        
    }
	this.Band.setCurrentRow(nRowIndex);	    
    dstNode.SetProperty('Text', srcNode.Text); 
    dstNode.SetProperty('ID', this.Band.getFldStrValue("ID",nRowIndex)); 
    
    srcNode.SetProperty('Text', node.Text); 
    srcNode.SetProperty('ID', this.Band.getFldStrValue("ID",iRowIndex)); 
    this.Band.Tree.WebTree.Render();
    this.Band.Tree.WebTree.SelectNodeById(dstNode.ID);
    
    return dstNode;
}


//向上移动节点
TreeUtil.moveUp=function(xmlID)
{
    var oband=GridUtil.FindBand(xmlID);
    if(!oband)   return;
    if(oband.IsModify("new")) {alert("已增加新数据，请保存后再移动位置!");return;}
    var trvNode=oband.Tree.WebTree.SelectedNode
    if(null==trvNode)  return;
    var prvNode = GetPrevSibling(trvNode);
    oband.Tree.moveBeforeByNode(prvNode,trvNode);
/*    
    if(null==prvNode)  return;
        
    var node = BakNode(prvNode);
    var xmlRow = oband.XmlLandData.XMLDocument.documentElement.selectSingleNode("*["+oband.Tree.IDField+"='" + prvNode.ID+"']");
    var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text)-1;
    
    for(var i=0;i<oband.XmlLandData.recordset.Fields.Count-1;i++)
    {
        var fn = oband.XmlLandData.recordset.Fields(i).Name;
        if(fn=="RowNum") continue;
        exchangeOther(oband,nRowIndex,iRowIndex,fn);        
    }
	oband.setCurrentRow(nRowIndex);	    
    prvNode.SetProperty('Text', trvNode.Text); 
    prvNode.SetProperty('ID', oband.getFldStrValue("ID",nRowIndex)); 
    
    trvNode.SetProperty('Text', node.Text); 
    trvNode.SetProperty('ID', oband.getFldStrValue("ID",iRowIndex)); 
    oband.Tree.WebTree.Render();
    oband.Tree.WebTree.SelectNodeById(prvNode.ID);
    */
}


//向下移动节点
TreeUtil.moveDown=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var oband=$band(xmlland.itemname);
	if(!oband || !oband.Tree)     return;
    if(oband.IsModify("new")) {alert("已增加新数据，请保存后再移动位置!");return;}
    var trvNode=oband.Tree.WebTree.SelectedNode
    var nextNode = GetNextSibling(trvNode);    
    oband.Tree.moveBeforeByNode(nextNode,trvNode);
}

//对树添加节点;xmlID树对应的数据岛,bChild是否子级添加,否则加入同级, root是指只增加根节点
TreeUtil.addNode=function(xmlID,bChild,root)
{
    if(null==xmlID || ""==xmlID)    return;
    var xmlland=document.getElementById(xmlID);
    if(!xmlland)	return;
    var band=$band(xmlland.itemname);
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


TreeUtil.deleteNode=function(xmlID,noChildren)
{
    if(null==xmlID || ""==xmlID)    return false;
	var xmlland=$(xmlID);
	if(!xmlland)	return false;
	var band=$band(xmlland.itemname);
	if(!band || !band.Tree || band.RecordCount()==0)     return false;
	 if("function"==typeof(ts_AfterTreeDel))
     if(!ts_AfterTreeDel(band)) return;
     
	var trvNode=band.Tree.WebTree.SelectedNode;
	if(!trvNode)
	{
	    band.Tree.WebTree.SelectNodeById(band.getFldStrValue(band.Tree.IDField));
	    trvNode=band.Tree.WebTree.SelectedNode;
	}
    var nodeChildren=trvNode.Nodes();
    if(noChildren && nodeChildren.length>0)
    {
        alert("友情提示：请先删除下级节点!");return;
    }
	
	var nextId = getDeletedNodeId(trvNode)
	
 	var result = confirm("您将删除节点【"+trvNode.Text+"】,确认吗？");
	if(!result) return false;
	band.Tree.WebTree.beginUpdate();
    band.Tree.deleteNode(trvNode);
    band.Tree.WebTree.endUpdate();
    band.Tree.WebTree.Render();
    if(nextId)
        band.Tree.WebTree.SelectNodeById(nextId);
    
    return true;
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
                _node = trvNode.get_parentNode().Nodes()[trvNode.get_index()-1];
                if(!_node)
                    if(trvNode.ParentNode) return trvNode.ParentNode.ID
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
	var band = $band(xmlland.itemname);
	if(!band || !band.Tree)     return;
	//克隆树节点文档
	document.XmlRootClone=null;
	
	//取出当前ID,根据所选的点，复制出其所有子节点
	document.copyNode = band.Tree.WebTree.SelectedNode;
	document.copyNode_Pid = band.getFldStrValue(band.Tree.PIDField);
	var rootsrc   = band.XmlLandData.XMLDocument.documentElement.cloneNode(true);
	var copyData  = band.XmlLandData.XMLDocument.documentElement.cloneNode(true);
	copyData.text = "";
	var currID = band.Tree.WebTree.SelectedNode.ID;
    if(document.copytype && document.copytype=="A")
    {
        pnode = rootsrc.selectSingleNode('*['+ band.Tree.IDField +'/text()[.="'+ currID +'"]]');
        if(pnode) copyData.appendChild(pnode);
    }	
	bindCopyData(copyData,rootsrc,band,currID);
	for(var i=0;i<copyData.childNodes.length;i++)
	{
	    if(copyData.childNodes[i].nodeType==3) copyData.removeChild(copyData.childNodes[i]);
	}
	document.XmlRootClone = copyData;
}

function bindCopyData(copyData,rootsrc,band,xid)
{        
    var nodes = rootsrc.selectNodes('*['+ band.Tree.PIDField +'/text()[.="'+ xid +'"]]')
    for(var i = 0; i<nodes.length;i++)
    {
        copyData.appendChild(nodes[i]);
        xid = nodes[i].selectSingleNode(band.Tree.IDField).text;
        bindCopyData(copyData,rootsrc,band,xid);
    }
}

//粘贴树,把复制的树节点,加入树上,ID和PID字段值会重新生成,其他字段按照名称对应
TreeUtil.paste=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=$band(xmlland.itemname);
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
	    var nodeID = rootsrc.childNodes[i].selectSingleNode(band.Tree.IDField);
	    if(!nodeID) continue;
	    
	    var key=nodeID.text;
	    nodeID.text=ToolUtil.NewGUID();
	    
	    var nodes = rootsrc.selectNodes("*/"+band.Tree.PIDField+"[text()='" + key + "']");
	    
	    for(var j=0;j<nodes.length;j++)
	    {
	        nodes[j].text = nodeID.text;
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
		    var strvalue = bandM.getFldStrValue(bandM.linkColM);
	        var nodes=rootsrc.selectNodes("*/"+band.linkCol);
	        for(var j=0;j<nodes.length;j++)
	            nodes[j].text=strvalue;
	        
	        //如果是跟节点,把PIDField属性设置为关联键值
	        //如果存在指定父节点，则用指定父指点的ID替代所选的主节点的PID
	        var nodes = rootsrc.childNodes;
	        for(var j=0;j<nodes.length;j++)
	        {
	            if(nodes[j].nodeType!=1) continue;
	            var pidtxt = nodes[j].selectSingleNode(band.Tree.PIDField).text;
	            var nodeTest = rootsrc.selectSingleNode("*/"+band.Tree.IDField+"[text()='"+pidtxt+"']");
	            if(nodeTest) continue;
	            var strcopy = "";
                if(document.copytype && document.copytype=="A")
                {
                    strcopy = "copy of ";
                    nodes[j].selectSingleNode(band.Tree.PIDField).text   = document.copyNode_Pid;
                }
                else
                    nodes[j].selectSingleNode(band.Tree.PIDField).text   = band.Tree.WebTree.SelectedNode.ID;	            
                if(band.Tree.NameField)
                {
                    var namefld = nodes[j].selectSingleNode(band.Tree.NameField).text;
                    nodes[j].selectSingleNode(band.Tree.NameField).text = strcopy + namefld;
                }
                var txtfld  = nodes[j].selectSingleNode(band.Tree.TxtField).text;
                nodes[j].selectSingleNode(band.Tree.TxtField).text  = strcopy + txtfld;
	        }
		}
	}
	//在树上建立克隆文档的节点
	var newChild = null;
	for(var i=rootsrc.childNodes.length-1;i>-1;i--)
	    newChild = band.XmlLandData.XMLDocument.documentElement.insertBefore(rootsrc.childNodes[i],newChild);
	    
	if(!band.XmlLandData.XMLDocument.documentElement) return;
    var nodes = band.XmlLandData.XMLDocument.documentElement.childNodes;
    
    //可将nodeFirst赋为要copy的指定节点，取出该节点的所有值
    //var currID = band.Tree.WebTree.SelectedNode.ID;
    //var nodeTest = rootsrc.selectSingleNode("*/"+band.Tree.IDField+"[text()='"+currID+"']");
    //var znode = band.XmlLandData.XMLDocument.documentElement.selectSingleNode("*["+band.Tree.IDField+"='"+currID+"']");
   
    var nodeFirst=null;
    
    for(var i=0;i<nodes.length;i++)
        if(!nodeFirst)
        {
            nodeFirst = band.Tree.bindTree(nodes[i]);
        }
        else
            band.Tree.bindTree(nodes[i]);
}

//增加包括子节点的所有节点
TreeUtil.addAllNodeImport=function(srcBand,dstBand)
{
    if(null==srcBand || null==dstBand) return;
    if(!srcBand.Tree) return;
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
	var oband = $band(item);				
	if(!oband){alert("【"+item+"】错误！");return;}
	if(!oband.Tree) return;
	oband.Tree.WebTree.set_showLines(isline);
	oband.Tree.WebTree.Render();
}

function ue_expand(item,isexp)
{
	var oband=$band(item);
	if(!oband){alert("【"+item+"】错误！");return;}
	if(isexp) oband.Tree.WebTree.ExpandAll();
	else
		oband.Tree.WebTree.CollapseAll();
	//oband.Tree.WebTree.Render();
}

//复制树,复制树所有节点,并保持节点层次关系
TreeUtil.xcopy=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band = $band(xmlland.itemname);
	if(!band || !band.Tree)     return;
	//克隆树节点文档
	document.copyNode = band.Tree.WebTree.SelectedNode;
}
//粘贴树,把复制的树节点,加入树上,ID和PID字段值会重新生成,其他字段按照名称对应
TreeUtil.xpaste=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=$band(xmlland.itemname);
	if(!band || !band.Tree)     return;
	if(!document.copyNode)  return;
    var stree=band.Tree;
    
    var dstNode=band.Tree.WebTree.SelectedNode;
	if(dstNode.GetParentNode())
		dstNode = dstNode.GetParentNode();
	else
		dstNode = null;
    var nodeNew = band.Tree.addChildByCopyNode(dstNode,document.copyNode);
    stree.WebTree.Render();
    stree.WebTree.SelectNodeById(nodeNew.ID);            	
}

TreeUtil.acopy=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band = $band(xmlland.itemname);
	if(!band || !band.Tree)     return;
	//克隆树节点文档
	document.XmlRootClone=null;
	var rootsrc = band.XmlLandData.XMLDocument.documentElement.cloneNode(true);
	document.XmlRootClone = rootsrc;
}
//粘贴树,把复制的树节点,加入树上,ID和PID字段值会重新生成,其他字段按照名称对应
TreeUtil.apaste=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=$band(xmlland.itemname);
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

//上接GridUtilAdv 的GridUtil.usOnCtrlUpatedHandle=function()事件
function ue_treeSum()
{
    var srcEle=event.srcElement;
    if(!srcEle.dataSrc || !srcEle.dataFld || ""==srcEle.dataSrc || ""==srcEle.dataFld)
        return;
    var xmlLand=document.getElementById(srcEle.dataSrc.substr(1));
    if(!xmlLand)	return;
    if(!document.UnitItem)	return;
    var oband = $band(xmlLand.itemname);
    if(!oband || !oband.XmlSchema || !oband.XmlSchema.XMLDocument || !oband.treeCalc)
        return;
    oband.setFldStrValue(null,srcEle.dataFld,srcEle.value);
    var _pid = oband.getFldStrValue(oband.Tree.PIDField);
    calcNextNode(oband,_pid,srcEle);
    //采用递归的方法计算XML数据的每个节点的xmlcolname值,从当前页子找出所有上级，并计算每个含子节点的节点和
}


function calcNextNode(oband,_pid,srcEle)
{
    var xmlRows = oband.XmlLandData.XMLDocument.documentElement.selectNodes('*['+oband.Tree.PIDField+'/text()[.="' + _pid +'"]]');
    var _val =0;
    if(srcEle.forto && srcEle.forto!="") var fieldname = srcEle.forto;
    else fieldname = srcEle.dataFld;
    
    for(var i=0;i<xmlRows.length;i++)
    {
        var _str = xmlRows[i].selectSingleNode(fieldname).text;
        var num=ToolUtil.Convert(_str,"number");
        _val = _val + num;
    }
    var xmlRow = oband.XmlLandData.XMLDocument.documentElement.selectSingleNode('*['+oband.Tree.IDField+'/text()[.="' + _pid +'"]]');
    if(!xmlRow)
    {
        //处理主band
        var mBand = oband.getBandM();
        mBand.setFldStrValue(null,fieldname,_val);
        mBand.CalXmlLand.Calculate();
        mBand.FireEvent("AfterCellEditChanged");
        ToolUtil.sleep(10);
        mBand.Sum();                     
        return;
    }
    if(srcEle.sumto && srcEle.sumto!="") fieldname=srcEle.sumto;
    //取行标
    var nRowIndex = parseInt(xmlRow.selectSingleNode("RowNum").text)-1;
    xmlRow.selectSingleNode(fieldname).text=_val;
    oband.CalXmlLand.Calculate(nRowIndex);
    xmlRow.setAttribute("state","modify");
    var pnode = xmlRow.selectSingleNode(oband.Tree.PIDField);
    if(pnode)
        calcNextNode(oband,pnode.text,srcEle);
    else
        return;
}

//取树节点路径(目前用于[会计科目查询.htm])
//node -  当前节点;str - 初始字符串; title - 显示的字符串内容字段
function us_treeNodePath(node,str,title,splitsign)
{
    var oParent = node.ParentNode;
    var oband = node.ParentTreeView.Tree.Band;
    while(oParent)
    {
        if(ToolUtil.valueTag(oParent.Value,title))
            str = ToolUtil.valueTag(oParent.Value,title) + splitsign + str;
        else
        {
            var rnt = node.ParentTreeView.Tree.getRowIndexByNodeId(oParent.ID)
            str = oband.getFldStrValue(title,rnt) + splitsign + str;
        }
        oParent = oParent.ParentNode;
    }
    return str;                
}
function TclickDot(node,NoExpand)
{
    if(node.Text.indexOf(" ...")<0 || !node.ParentTreeView.Tree.NoExpand) return;
    var nodes = node.ParentTreeView.Tree.Band.XmlLandData.XMLDocument.documentElement.selectNodes('*['+node.ParentTreeView.Tree.PIDField+'/text()[.="'+node.ID+'"]]');
    node.set_text(node.Text.replace(" ...",""));
    var nodeFirst = node;
    for(var i=0;i<nodes.length;i++)
    {
        if(!nodeFirst)
            nodeFirst = node.ParentTreeView.Tree.bindTree(nodes[i]);
        else
            node.ParentTreeView.Tree.bindTree(nodes[i]);
    }
    node.ParentTreeView.Tree.WebTree.Render();
    if(!NoExpand) node.Expand();
}
function treehtml()
{
    var strtree = '<script src="../hmjs/sysjs/treeres1.js" type="text/javascript"></script><script src="../hmjs/sysjs/treeres2.js" type="text/javascript"></script>\
    <script src="../hmjs/sysjs/treeres3.js" type="text/javascript"></script><script src="../hmjs/sysjs/treeres4.js" type="text/javascript"></script>\
    <script src="../hmjs/sysjs/treeres5.js" type="text/javascript"></script><script src="../hmjs/sysjs/treeres6.js" type="text/javascript"></script>\
    <script type="text/javascript">//<![CDATA[window.ComponentArt_Storage_etpTemplate_新单位树全集Tab_trvLand = null;//]]></script>\
    <div id="etpTemplate_新单位树全集Tab_trvLand" class="TreeView" style="height:92%;width:98%;overflow:auto;" onclick="if(window.etpTemplate_新单位树全集Tab_trvLand_loaded) ComponentArt_SetKeyboardFocusedTree(this, etpTemplate_新单位树全集Tab_trvLand);" onmouseover="if(window.etpTemplate_新单位树全集Tab_trvLand_loaded) ComponentArt_SetActiveTree(etpTemplate_新单位树全集Tab_trvLand);"></div>\
    <input id="etpTemplate_新单位树全集Tab_trvLand_Data" name="etpTemplate_新单位树全集Tab_trvLand_Data" type="hidden" />\
    <input id="etpTemplate_新单位树全集Tab_trvLand_Properties" name="etpTemplate_新单位树全集Tab_trvLand_Properties" type="hidden" />\
    <input id="etpTemplate_新单位树全集Tab_trvLand_SelectedNode" name="etpTemplate_新单位树全集Tab_trvLand_SelectedNode" type="hidden" value="" />\
    <input id="etpTemplate_新单位树全集Tab_trvLand_ScrollData" name="etpTemplate_新单位树全集Tab_trvLand_ScrollData" type="hidden" value="0,0" />\
    <script type="text/javascript">//<![CDATA[\
        window.ComponentArt_Init_etpTemplate_新单位树全集Tab_trvLand = function(){\
            if(!window.ComponentArt_TreeView_Kernel_Loaded || !window.ComponentArt_TreeView_Keyboard_Loaded || !window.ComponentArt_TreeView_Support_Loaded || !window.ComponentArt_Utils_Loaded || !window.ComponentArt_Keyboard_Loaded || !window.ComponentArt_DragDrop_Loaded || !document.getElementById("etpTemplate_新单位树全集Tab_trvLand"))\
            {setTimeout("ComponentArt_Init_etpTemplate_新单位树全集Tab_trvLand()", 100); return; }\
            window.etpTemplate_新单位树全集Tab_trvLand = new ComponentArt_TreeView("etpTemplate_新单位树全集Tab_trvLand", ComponentArt_Storage_etpTemplate_新单位树全集Tab_trvLand);\
            etpTemplate_新单位树全集Tab_trvLand.Postback = function() { __doPostBack("etpTemplate$新单位树全集Tab$trvLand","") };\
            if(!window["trvLand"]) { window["trvLand"] = window.etpTemplate_新单位树全集Tab_trvLand; etpTemplate_新单位树全集Tab_trvLand.GlobalAlias = "trvLand"; }\
            etpTemplate_新单位树全集Tab_trvLand.Properties = [["ApplicationPath","/HMApp"],["ClientEvents",{"NodeMouseDoubleClick":TreeUtil.onNodeDoubleClick,"NodeBeforeMove":TreeUtil.onNodeBeforeMove}],["ClientSideOnNodeSelect","TreeUtil.onNodeSelectionChange"],["ClientTemplates",[]],["CollapseSlide",2],["CollapseDuration",200],["CollapseTransition",0],["CollapseImageUrl","images/exp.gif"],["ControlId","etpTemplate:新单位树全集Tab:trvLand"],["CssClass","TreeView"],["DefaultImageHeight",0],["DefaultImageWidth",0],["MarginImageHeight",0],["MarginImageWidth",0],["DragAndDropAcrossTreesEnabled",true],["DragHoverExpandDelay",700],["Enabled",true],["EnableViewState",true],["ExpandSlide",2],["ExpandDuration",200],["ExpandTransition",0],["ExpandCollapseImageHeight",0],["ExpandCollapseImageWidth",0],["ExpandImageUrl","images/col.gif"],["ExpandSelectedPath",true],["ExpandSinglePath",true],["HoverNodeCssClass","HoverTreeNode"],["ItemSpacing",0],["LineImageHeight",0],["LineImageWidth",0],["LineImagesFolderUrl","images/lines/"],["LoadingFeedbackText","Loading..."],["MarginWidth",32],["MultipleSelectEnabled",true],["NodeCssClass","TreeNode"],["NodeLabelPadding",0],["NodeIndent",16],["SelectedNodeCssClass","SelectedTreeNode"],];\
            etpTemplate_新单位树全集Tab_trvLand.Initialize("etpTemplate_新单位树全集Tab_trvLand");\
            window.etpTemplate_新单位树全集Tab_trvLand_loaded = true;\
        }\
        ComponentArt_Init_etpTemplate_新单位树全集Tab_trvLand();\
        var myTree = new Tree(etpTemplate_新单位树全集Tab_trvLand,"新单位树全集Tab");\
     //]]></script>';
    return strtree;
}
//文件结尾
GridUtil.FileLoaded=true;