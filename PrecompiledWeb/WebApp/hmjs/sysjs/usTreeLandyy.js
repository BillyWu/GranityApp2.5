//gridNameע��Ŀؼ���;
var vinit=0;
function Tree(tree,xmlLandID)
{
	//��Tree����document�ķ����б���
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
	//����������
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
	this.Name=tree.TreeViewID;		//Tree��Ψһ��
	this.ItemName="";		//Tree�Ķ�Ӧ��Ŀ����
	//���ݵ�����
	this.XmlLand=null;		//��ϸ���ݵ�
	this.XmlChanged=null;//ɾ�������ݵ�
	this.XmlSchema=null;	//��ϸ���ݽṹ���ݵ�
	this.XmlSum=null;		//�������ݵ����ݵ�
	this.XmlSumTemp=null;	//�������ݵ���ʱ���ݵ�
	
};
var _p=Tree.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//Tree���ݰ�,�ݹ齨�����ڵ�
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
	//��ȡ���ݵ��ṹxml����:tree.XmlSchema
	this.XmlLandID=xmlLand.id;
	this.XmlLand=xmlLand;
	this.XmlChanged=Htmldoc.getElementById(xmlLand.id+"_Delete");
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.XmlDict=Htmldoc.getElementById(xmlLand.id+"_Dict");
	this.XmlSum=Htmldoc.getElementById(xmlLand.id+"_Sum");
	this.ItemName=xmlLand.itemname;
	
	this.IDField=this.XmlSchema.idfld;      //�ؼ���ID
	this.PIDField=this.XmlSchema.pidfld;    //��ID
	this.TxtField=this.XmlSchema.txtfld;    //�ı�ID
	this.SIDField=this.XmlSchema.selfid;    //
	this.KEYField=this.XmlSchema.keyfid;    //
	this.ValueField=this.XmlSchema.valuefld;//�ڵ�ֵ
	
	this.TypeField=this.XmlSchema.typefld;  //�ڵ�����ID
	this.OrderField=this.XmlSchema.orderfld;//�ڵ�����ID
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
//Tree��ʼ�����ݵ���ϵ
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
	//��ȡ���ݵ��ṹxml����:tree.XmlSchema
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

/// ��������XmlDoc�����ڵ�:�ڵ�ID,�ڵ��ı�,�ڵ㸸ID;������ж�Ӧ�����ڵ��Ѿ�������ֱ�ӷ��ظýڵ�
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
                newNode.set_text("���� "+xmlNodeTxt.text);
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
                    newNode.set_text("���� "+xmlNodeTxt.text);
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

/// ���ݽڵ�ID��Ӧ������tagֵ������IDֵ�ҵ����ڵ�
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
   //trvNode.StorageIndex  ���
   //trvNode.GetCurrentIndex �������
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

//�������ڵ��ҵ���Ӧ���ݵ��к�
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

//�������ڵ��ҵ���Ӧ���ݵ��к�
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


//���ݽڵ�ID�������ڵ��ֵ;ͬʱ������ݵ���ֵ��ͬ�޸����ݵ��Ķ�Ӧ�ֶ�ֵ
//�����ID�ֶ�,���������ݵ���Ӧ�ֶ�
_p.setValueByID=function(nodeID,fldname,value)
{
    if( null==nodeID || fldname==this.IDField || null==fldname || ""==fldname)
        return;
    var trvNode=this.getTrvNodeByID(nodeID);
    if(null==trvNode)   return;
    this.setValueByTrvNode(trvNode,fldname,value);
}

//���ݽڵ�Node�������ڵ��ֵ;ͬʱ������ݵ���ֵ��ͬ�޸����ݵ��Ķ�Ӧ�ֶ�ֵ
//�����ID�ֶ�,���������ݵ���Ӧ�ֶ�
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
//�������ݵ������ӽڵ�
_p.newNode=function(rowIndex)
{
    var nodepid=this.Band.getFldStrValue(this.PIDField,rowIndex);
    var nodeid=this.Band.getFldStrValue(this.IDField,rowIndex);
    var nodetxt=this.Band.getFldStrValue(this.TxtField,rowIndex);
    var trvNodeParent=null; var trvNode=null;
    if(null!=nodepid && ""!=nodepid)
        trvNodeParent=this.getTrvNodeByID(nodepid);
    //���ӽڵ�
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
    //�����ݵ�ID���ı�ֵͬ��
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //����ǰ�ڵ�ĸ�ID
    var pid = this.Band.getFldStrValue(this.PIDField);        //����ǰ�ڵ�ĸ�ID
    var nodetxt=this.Band.getFldStrValue(this.TxtField);    
    
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    //����trvNodeParent�����µ�ID,PID+(child���һ��ID+10)
    var nodeid="";
    nodeid = this.getIdByParent(trvNodeParent,nodepid);

    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,"�½ڵ�");
        this.Band.setFldStrValue(rowIndex,this.ValueField,"�½ڵ�");
    }
    else
    {
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodeChild.Text);
        this.Band.setFldStrValue(rowIndex,this.ValueField,nodeChild.Text);
    }
    var _srcband = nodeChild.ParentTreeView.Tree.Band;
    if(_srcband)
        this.Band.setFldStrValue(rowIndex,this.TypeField,ToolUtil.valueTag(nodeChild.Value,this.TypeField));
        
    //���ӽڵ�nodeChild.Value
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
    //��PID��ֵ,����Ǹ��ڵ�,������ϸ��,�Ͱѹ���ֵ��ֵ�����ڵ�,����Ÿ�ֵ
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
    //�����ݵ�ID���ı�ֵͬ��
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //����ǰ�ڵ�ĸ�ID
    var pid = this.Band.getFldStrValue(this.PIDField);        //����ǰ�ڵ�ĸ�ID
    var nodetxt=this.Band.getFldStrValue(this.TxtField);    
    
    var xmlRow=this.Band.NewRecord();
    var rowIndex=this.Band.XmlLandData.recordset.recordCount-1;
    
    //����trvNodeParent�����µ�ID,PID+(child���һ��ID+10)
    var nodeid="";
    //���pid="",��ȡ��������Ĺ����ֶ�ֵ
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
        this.Band.setFldStrValue(rowIndex,this.TxtField,"�½ڵ�");
        this.Band.setFldStrValue(rowIndex,this.ValueField,"�½ڵ�");
    }
    else
    {
        this.Band.setFldStrValue(rowIndex,"copy of "+this.TxtField,nodeChild.Text);
        this.Band.setFldStrValue(rowIndex,"copy of "+this.ValueField,nodeChild.Text);
    }
    var _srcband = nodeChild.ParentTreeView.Tree.Band;
    if(_srcband)
        this.Band.setFldStrValue(rowIndex,this.TypeField,ToolUtil.valueTag(nodeChild.Value,this.TypeField));
    //���ӽڵ�nodeChild.Value
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
    //��PID��ֵ,����Ǹ��ڵ�,������ϸ��,�Ͱѹ���ֵ��ֵ�����ڵ�,����Ÿ�ֵ
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


//����µ��ӽڵ�,ͬʱ���ݵ�������,������ӵ��ӽڵ� 
_p.newChild=function(trvNodeParent,root)
{
    //�����ݵ�ID���ı�ֵͬ��
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //����ǰ�ڵ�ĸ�ID
    var pid     = this.Band.getFldStrValue(this.PIDField);        //����ǰ�ڵ�ĸ�ID
    var selfid  = "";
    if(root)                                                //�ر�ָ�����Ӹ��ڵ�,��Ҫ���ڵ�ǰ��Ϊ����ʱ�����
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
    //����trvNodeParent�����µ�ID,PID+(child���һ��ID+10)
    var nodeid="";
    nodeid = this.getIdByParent(trvNodeParent,nodepid);
    this.Band.setFldStrValue(rowIndex,this.IDField,nodeid);
    if(this.KEYField!="")
        this.Band.setFldStrValue(rowIndex,this.KEYField,nodeid);
    
    if(null==nodetxt || ""==nodetxt)
    {
        nodetxt="�½ڵ�";
        this.Band.setFldStrValue(rowIndex,this.TxtField,nodetxt);
        this.Band.setFldStrValue(rowIndex,this.ValueField,nodetxt);
    }
    if(selfid!="")
        this.Band.setFldStrValue(rowIndex,this.SIDField,selfid);
    
    //���ӽڵ�
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
    //��PID��ֵ,����Ǹ��ڵ�,������ϸ��,�Ͱѹ���ֵ��ֵ�����ڵ�,����Ÿ�ֵ
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
            var s = xpid.substring(trvNodeParent.ID.length,xpid.length); //�ó�ȥ���ϼ�ID����ַ���
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
            //ȡ��nodes�����һ��node,nodepidΪ���ڵ�ĸ�ID(����ID)������������ֶ�Ԥ��
            //�½ڵ��ID=����ID + nodes�����ڵ�IDȥ������ID�ַ���ȡ���� + 10
            //�㷨�� nodeid = xpid.substring(nodepid.length,xpid.length) = nodepid + 10;
            
            //ȡ���һ��ͬ����ID�����ǵ�ID�п��ܴ��ڷ����֣���ˣ����ҳ�xpid�������ϼ��룬��linkcol��,����ΪPID
            var xpid    = this.WebTree.Nodes()[this.WebTree.Nodes().length-1].ID;
            
            var linkid  = this.Band.getFldStrValue(this.PIDField);
            var s = xpid.substring(xpid.length,linkid.length); //�ó�ȥ���ϼ�ID����ַ���
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

//��������Χ�ڰ�ָ���ڵ���뵽Ŀ�Ľڵ�;�ݹ���ӽڵ�;�����½ڵ��Ӧ���ݵ���PID��˳���,ֻ���ڵ��ô�����;
//dstNode - Ŀ�����ϱ�ѡ�еĽڵ�; srcNode - Դ���ϱ�ѡ�еĽڵ�
//���dstNodeΪ�գ���ȡ��Ϊ��
_p.addChildByNode=function(dstNode,srcNode,iscopy)
{
    var nodeNew;
    if(null==srcNode) return;
    nodeNew = this.newChildByNode(dstNode,srcNode);  
    //�ݹ�����ӽڵ�
    var nodeChildren = srcNode.Nodes();    
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}


//��������Χ�ڰ�ָ���ڵ���뵽Ŀ�Ľڵ�;�ݹ���ӽڵ�;�����½ڵ��Ӧ���ݵ���PID��˳���,ֻ���ڵ��ô�����;
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
        //�ҵ�Դ���ݼ���nodeChild.ID���ڵ�����
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
            this.Band.setFldStrValue(null,this.Band.Tree.TxtField,"���� " + nodeNew.Text);
        else
            this.Band.setFldStrValue(null,this.Band.Tree.TxtField,nodeNew.Text);
        //��������ֶ�����
	    for(var i=0;i<colList.length;i++)
	    {
		    var colname=colList[i].getAttribute("name");
		    if((colname==this.Band.Tree.IDField) || (colname==this.Band.Tree.PIDField)
		        || (colname==this.Band.Tree.TxtField) || (colname=="ID")  || (colname==this.Band.linkCol) || (colname==this.Band.Tree.KEYField)) continue;
		    this.Band.setFldStrValue(rowIndex,colname,srcBand.getFldStrValue(colname,n));   
        }
    }
    //�ݹ�����ӽڵ�
    var nodeChildren=nodeChild.Nodes();
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByCopyNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}

//nodeParent - ΪĿ����ѡ��Ľڵ�;nodeChild - Ϊ�����ӵĽڵ㣬��ΪԴ�ڵ�
//�¼�ΪĿ����Tree�¼�
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
    //�ݹ�����ӽڵ�
    var nodeChildren=nodeChild.Nodes();
    for(var i=0;i<nodeChildren.length;i++)
        this.addChildByCopyNode(nodeNew,nodeChildren[i]);
    return nodeNew;
}

//�����м�����ͬ���ַ�
function CountIn(sText,sFind)  
{
   var iCount=0;
   var dstlen = sText.replaceAll(sFind,"").length;
   if(sFind.length>0) iCount=(sText.length-dstlen)/sFind.length;
   return iCount
}

//�ѽڵ����ָ���ڵ�֮��;û��ָ��ǰ�ڵ㲻�ƶ�
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
    //��Ϊ�����Լ����ݵķ����ƶ�
    
    var node = BakNode(nodePrev);
    //��λ�ü�¼��
    var nRowIndex=this.getRowIndexByTrvNode(nodePrev);
    //ԭλ�ü�¼��
    var iRowIndex=this.getRowIndexByTrvNode(nodeSrc);
    this.Band.setFldStrValue(nRowIndex,this.TxtField,nodeSrc.Text);
    this.Band.setFldStrValue(iRowIndex,this.TxtField,nodePrev.Text);
    nodePrev.SetProperty('Text', nodeSrc.Text); 
    nodeSrc.SetProperty('Text', node.Text); 
    
    //�����Զ��庯����������ݽ��д���
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
    //����˳���
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

//ɾ��ָ���ڵ�;�ݹ�ɾ���ӽڵ�;ɾ�����ݵ���¼
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

//����Tree���������߶���
//TreeUtil.getGridByName(gridName)			�������ƻ�ȡGrid����

//TreeUtil.onNodeSelectionChange()           ����ǰ�ڵ�ı��¼�
//TreeUtil.onDropHandle()                     ���ڵ��϶��¼�
//TreeUtil.moveUp=function(xmlID)           �����ƶ���ǰ�ڵ�
//TreeUtil.moveDown=function(xmlID)         �����ƶ���ǰ�ڵ�
//TreeUtil.addNode=function(xmlID,bChild)   ������ӽڵ�;xmlID����Ӧ�����ݵ�,bChild�Ƿ��Ӽ����,�������ͬ��
//TreeUtil.deleteNode=function(xmlID)       ɾ��������ǰ�ڵ�
//TreeUtil.paste=function(xmlID)            ճ����
//TreeUtil.copy=function(xmlID)             ������


var TreeUtil=new Object();
//�������ƻ�ȡGrid����
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
//���ڵ�ı��¼�
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

//���ڵ��϶��¼�
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

//���Ӱ����ӽڵ�����нڵ�
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

//�����ƶ��ڵ�
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
    //fixed ����IDֵ
    //band.setFldStrValue(null,"�������","����");
    band.Tree.WebTree.Render();
    band.Tree.WebTree.SelectNodeById(nodeNew.ID);
}



//�����ƶ��ڵ�
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

//������ӽڵ�;xmlID����Ӧ�����ݵ�,bChild�Ƿ��Ӽ����,�������ͬ��, root��ָֻ���Ӹ��ڵ�
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
        //ǿ���ڸ������ӽڵ�
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

//ɾ�������ڵ�
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
	
 	var result = confirm("����ɾ���ڵ㡾"+trvNode.Text+"��,ȷ����");
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

//������,���������нڵ�,�����ֽڵ��ι�ϵ
TreeUtil.copy=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
	//��¡���ڵ��ĵ�
	document.XmlRootClone=null;
	var rootsrc=band.XmlLandData.XMLDocument.documentElement.cloneNode(true);
	document.XmlRootClone=rootsrc;
}
//ճ����,�Ѹ��Ƶ����ڵ�,��������,ID��PID�ֶ�ֵ����������,�����ֶΰ������ƶ�Ӧ
TreeUtil.paste=function(xmlID)
{
    if(null==xmlID || ""==xmlID)    return;
	var xmlland=document.getElementById(xmlID);
	if(!xmlland)	return;
	var band=document.UnitItem.getBandByItemName(xmlland.itemname);
	if(!band || !band.Tree)     return;
	if(!document.XmlRootClone)  return;
	//���ṹ�Ƿ���ͬ,�ṹ��ͬ�����ſ��Ը���ճ��
	var rootsrc=document.XmlRootClone;
	var colList=band.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var colname=colList[i].getAttribute("name");
		var nodeTest=rootsrc.selectSingleNode("*/"+colname);
		if(!nodeTest)   return;
	}
	//�ĵ����ݼ�����,����״̬Ϊ�¼�¼,�������ӹ����ֶ�ֵ,�����ֶ�ֵ
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
	//���¹����ֶ�ֵ
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
	        //����Ǹ��ڵ�,��PIDField��������Ϊ������ֵ
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
	//�����Ͻ�����¡�ĵ��Ľڵ�
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

//���Ӱ����ӽڵ�����нڵ�
TreeUtil.addAllNodeImport=function(srcBand,dstBand)
{
    if(null==srcBand || null==dstBand) return;
    //����Ƿ����ѡ���ֶΣ�������ڣ�ȡѡ��Ϊtrue�ĵ�һ��Node��Ϊ��ѡ���Node
    var chkId = "";
    var nodeNew;
    var srcNodes;
    for(var i=0;i<srcBand.RecordCount();i++)
    {
        if(srcBand.getFldStrValue("ѡ��",i)=="-1")
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
    var nodepid = this.Band.getFldStrValue(this.PIDField);    //����ǰ�ڵ�ĸ�ID
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
    //��PID��ֵ,����Ǹ��ڵ�,������ϸ��,�Ͱѹ���ֵ��ֵ�����ڵ�,����Ÿ�ֵ
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

//�ļ���β
GridUtil.FileLoaded=true;