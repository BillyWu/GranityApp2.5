
//修改节点对应Band的值
function setPropDataValue(AProp, AValue)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,AProp,AValue);
    band.setFldStrValue(null,AProp.toLowerCase(),AValue);
}

//修改步骤对应Band的值
function setStepDataValue(AProp, AValue)
{
    var band=document.UnitItem.getBandByItemName("流程流转");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,AProp,AValue);
    band.setFldStrValue(null,AProp.toLowerCase(),AValue);

    if(AProp=="FromProc")
        band.setFldStrValue(null,"前驱",AValue);
    else if(AProp=="ToProc")
        band.setFldStrValue(null,"节点",AValue);
}

//删除节点或步骤对象Band的值
function deleteDateProcByID(bandname,id)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==id){rowIndex = i;break;}
    }
    band.DeleteRecord(rowIndex);    
}



// topflowevent.js中关于band的函数
function updateStepDataValue(oStep)
{
    var band=document.UnitItem.getBandByItemName("流程流转");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==oStep.ID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"points",oStep.Points);
    band.setFldStrValue(null,"ToProc",oStep.ToProc);
    band.setFldStrValue(null,"FromProc",oStep.FromProc);
    
    var Proc = _FLOW.getProcByID(oStep.ToProc);
    band.setFldStrValue(null,"节点",Proc.NodeName);
    band.setFldStrValue(null,"text",oStep.Text);
    Proc = _FLOW.getProcByID(oStep.FromProc);
    if(Proc)  band.setFldStrValue(null,"前驱",Proc.NodeName);

    
    band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
    band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
    band.setFldStrValue(null,"toRelX",oStep.toRelX);
    band.setFldStrValue(null,"toRelY",oStep.toRelY);
    band.setFldStrValue(null,"shapetype",oStep.ShapeType);
    band.setFldStrValue(null,"startArrow",oStep.StartArrow);
    band.setFldStrValue(null,"endArrow",oStep.EndArrow);
    band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
    band.setFldStrValue(null,"zIndex",oStep.zIndex);
    band.setFldStrValue(null,"进阶状态",oStep.Cond);
    band.setFldStrValue(null,"不分发",oStep.NoSpecify);

}


function updateStepData(bandname,fieldname,value)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,fieldname,value);
}

function setPropTextData(bandname,oItem)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    switch(oItem.id)
    {
        case "text":band.setFldStrValue(null,"text",oItem.value);
            break;
        case "nodeName":band.setFldStrValue(null,"名称",oItem.value);
            break;            
        case "flownodeName":band.setFldStrValue(null,"节点",oItem.value);
            break;
    }
}


function updateActFlagData(bandname,objID,oItem)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==objID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    var flagText = "角色任务点";
    switch(oItem.value)
    {
        case "1013":
            flagText = "起点";
            break;
        case "2013":
            flagText = "终点";
            break;        
        case "0014":
            flagText = "或运算";
            break;        
        case "0015":
            flagText = "与运算";
            break;
        default:
            flagText = "角色任务点";
    }
    band.setFldStrValue(null,"类型",flagText);
}


function setPropData(bandname,fieldname,value)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,fieldname,value);
}


function setPropShapeTypeData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"shapetype",oItem.value);
}

function setPropTextWeightData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"textWeight",oItem.value);
}


function setPropStrokeWeightData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"strokeWeight",oItem.value);
}


function setPropzIndexData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"zIndex",oItem.value);
}

function setPropXData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"x",oItem.value);
}

function setPropYData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"y",oItem.value);
}

function setPropWData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"width",oItem.value);
}

function setPropHData(oItem)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"height",oItem.value);
}

function updatePropData(Proc)
{
    //if(_FOCUSTEDOBJ==null) return;
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编码",i)==Proc.ID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"text",Proc.Text);
    band.setFldStrValue(null,"名称",Proc.NodeName);
    band.setFldStrValue(null,"procType",Proc.ProcType);
    band.setFldStrValue(null,"shapetype",Proc.ShapeType);
    band.setFldStrValue(null,"width",Proc.Width);
    band.setFldStrValue(null,"height",Proc.Height);
    var flagText="";
    switch(Proc.actFlag)
    {
        case "1013":
            flagText = "起点";
            break;
        case "2013":
            flagText = "终点";
            break;        
        case "0014":
            flagText = "或运算";
            break;        
        case "0015":
            flagText = "与运算";
            break;
        default:
            flagText = "角色任务点";
    }    
    band.setFldStrValue(null,"类型",flagText);
    
}

//添加流程图的[任务]元素对象到数据岛中
function addFlowDB(oFlow)
{
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"编号",oFlow.ID);
    band.setFldStrValue(null,"名称",oFlow.FileName);
    band.setFldStrValue(null,"标题",oFlow.Text);
    band.setFldStrValue(null,"说明",oFlow.Memo);
    band.setFldStrValue(null,"formid",oFlow.ID);
    band.setFldStrValue(null,"password",oFlow.Password);
    band.setFldStrValue(null,"创建日期",oFlow.Date);
    band.setFldStrValue(null,"创建者",oFlow.Man);
    band.setFldStrValue(null,"查阅项目",oFlow.Item);
    band.setFldStrValue(null,"单位名称",oFlow.Unit);
    band.setFldStrValue(null,"部门名称",oFlow.Dept);
}

//修改数据岛中流程图的[任务]元素
function updateFlowDB(oFlow)
{
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
        if(band.getFldStrValue("编号",i)==oFlow.ID){rowIndex = i;break;}
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"名称",oFlow.FileName);
    band.setFldStrValue(null,"标题",oFlow.Text);
    band.setFldStrValue(null,"说明",oFlow.Memo);
    band.setFldStrValue(null,"formid",oFlow.ID);
    band.setFldStrValue(null,"password",oFlow.Password);
    band.setFldStrValue(null,"创建日期",oFlow.Date);
    band.setFldStrValue(null,"创建者",oFlow.Man);
    band.setFldStrValue(null,"查阅项目",oFlow.Item);
    band.setFldStrValue(null,"单位名称",oFlow.Unit);
    band.setFldStrValue(null,"部门名称",oFlow.Dept);
    updateSingleFlowContents(oFlow);
}


function addFlowContents(oFlow)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    for(var i=0;i<oFlow.Procs.length;i++)
    {
        band.NewRecord();    
        Proc = oFlow.Procs[i];
        band.setFldStrValue(null,"编码",Proc.ID);
        band.setFldStrValue(null,"名称",Proc.NodeName);        
        band.setFldStrValue(null,"text",Proc.Text);
        band.setFldStrValue(null,"procType",Proc.ProcType);
        band.setFldStrValue(null,"shapetype",Proc.ShapeType);
        band.setFldStrValue(null,"width",Proc.Width);
        band.setFldStrValue(null,"height",Proc.Height);
        band.setFldStrValue(null,"x",Proc.X);
        band.setFldStrValue(null,"y",Proc.Y);
        band.setFldStrValue(null,"textWeight",Proc.TextWeight);
        band.setFldStrValue(null,"strokeWeight",Proc.StrokeWeight);
        band.setFldStrValue(null,"zIndex",Proc.zIndex);

        var flagText="";
        switch(Proc.actFlag)
        {
            case "1013":
                flagText = "起点";
                break;
            case "2013":
                flagText = "终点";
                break;        
            case "0014":
                flagText = "或运算";
                break;        
            case "0015":
                flagText = "与运算";
                break;
            default:
                flagText = "角色任务点";
        }    
        band.setFldStrValue(null,"类型",flagText);
    }
    
    band=document.UnitItem.getBandByItemName("流程流转");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.NewRecord();    
        oStep = oFlow.Steps[i];
        band.setFldStrValue(null,"编码",oStep.ID);
        band.setFldStrValue(null,"points",oStep.Points);
        
        band.setFldStrValue(null,"ToProc",oStep.ToProc);
        band.setFldStrValue(null,"FromProc",oStep.FromProc);

        //由ToProc和FromProc找到对应的节点名称，赋给节点和前驱
        var Proc = _FLOW.getProcByID(oStep.ToProc);
        band.setFldStrValue(null,"节点",Proc.NodeName);
        band.setFldStrValue(null,"text",oStep.Text);
        Proc = _FLOW.getProcByID(oStep.FromProc);
        band.setFldStrValue(null,"前驱",Proc.NodeName);
        
        band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
        band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
        band.setFldStrValue(null,"toRelX",oStep.toRelX);
        band.setFldStrValue(null,"toRelY",oStep.toRelY);
        band.setFldStrValue(null,"shapetype",oStep.ShapeType);
        band.setFldStrValue(null,"startArrow",oStep.StartArrow);
        band.setFldStrValue(null,"endArrow",oStep.EndArrow);
        band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
        band.setFldStrValue(null,"zIndex",oStep.zIndex);
        band.setFldStrValue(null,"进阶状态",oStep.Cond);
        band.setFldStrValue(null,"不分发",oStep.NoSpecify);

    }
    
}

function updateSingleFlowContents(oFlow)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    for(var i=0;i<oFlow.Procs.length;i++)
    {
        band.setFldStrValue(i,"流程",oFlow.FileName);
        oFlow.Procs[i].FlowName =   oFlow.FileName;
    }
    
    band=document.UnitItem.getBandByItemName("流程流转");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.setFldStrValue(i,"流程",oFlow.FileName);
        oFlow.Steps[i].FlowName =   oFlow.FileName;
    }
    band=document.UnitItem.getBandByItemName("节点责任者");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.setFldStrValue(i,"流程",oFlow.FileName);
    }    
}



function addPropData(Proc)
{
    var band=document.UnitItem.getBandByItemName("节点定义");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"编码",Proc.ID);
    band.setFldStrValue(null,"名称",Proc.NodeName);
    band.setFldStrValue(null,"text",Proc.Text);
    band.setFldStrValue(null,"procType",Proc.ProcType);
    band.setFldStrValue(null,"shapetype",Proc.ShapeType);
    band.setFldStrValue(null,"width",Proc.Width);
    band.setFldStrValue(null,"height",Proc.Height);
    band.setFldStrValue(null,"x",Proc.X);
    band.setFldStrValue(null,"y",Proc.Y);
    band.setFldStrValue(null,"textWeight",Proc.TextWeight);
    band.setFldStrValue(null,"strokeWeight",Proc.StrokeWeight);
    band.setFldStrValue(null,"zIndex",Proc.zIndex);
    
    var flagText="";
    switch(Proc.actFlag)
    {
        case "1013":
            flagText = "起点";
            break;
        case "2013":
            flagText = "终点";
            break;        
        case "0014":
            flagText = "或运算";
            break;        
        case "0015":
            flagText = "与运算";
            break;
        default:
            flagText = "角色任务点";
    }    
    band.setFldStrValue(null,"类型",flagText);
    
}


function addStepData(oStep)
{
    var band=document.UnitItem.getBandByItemName("流程流转");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"编码",oStep.ID);
    band.setFldStrValue(null,"points",oStep.Points);
    
    band.setFldStrValue(null,"ToProc",oStep.ToProc);
    band.setFldStrValue(null,"FromProc",oStep.FromProc);
    //由ToProc和FromProc找到对应的节点名称，赋给节点和前驱
    var Proc = _FLOW.getProcByID(oStep.ToProc);
    band.setFldStrValue(null,"节点",Proc.NodeName);//oStep.FlowNodeName
    band.setFldStrValue(null,"text",oStep.Text);
    Proc = _FLOW.getProcByID(oStep.FromProc);
    band.setFldStrValue(null,"前驱",Proc.NodeName);
    
    band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
    band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
    band.setFldStrValue(null,"toRelX",oStep.toRelX);
    band.setFldStrValue(null,"toRelY",oStep.toRelY);
    band.setFldStrValue(null,"shapetype",oStep.ShapeType);
    band.setFldStrValue(null,"startArrow",oStep.StartArrow);
    band.setFldStrValue(null,"endArrow",oStep.EndArrow);
    band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
    band.setFldStrValue(null,"zIndex",oStep.zIndex);
    band.setFldStrValue(null,"进阶状态",oStep.Cond);
    band.setFldStrValue(null,"不分发",oStep.NoSpecify);
}


function getMaxFlowID()
{
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;
    if(band.RecordCount()==0) return "1";
    var smax = band.getFldStrValue("编号",0).replace(/[^0-9]/ig,"");
    if(smax=="") smax="0"; 
    var max = parseInt(smax,10);
    for(var i=0; i < band.RecordCount(); i++)
    {
        smax = band.getFldStrValue("编号",i).replace(/[^0-9]/ig,"");
        if(smax=="") smax="0";
        if(max<parseInt(smax,10)) 
        max = parseInt(smax,10);
    }
    max = max + 1;
    return max;    
}


function DelFLowDB()
{
    //先删除所有属性和节点 1
    for(var i = _FLOW.Procs.length - 1; i > -1; i--)
    {
        if(_FLOW.Procs[i])
            _FLOW.deleteProcByID(_FLOW.Procs[i].ID)
    }
    for(var i = _FLOW.Steps.length - 1; i > -1; i--)
    {
        if(_FLOW.Steps[i])
            _FLOW.deleteStepByID(_FLOW.Steps[i].ID)
    }
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;
     var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("编号",i)==_FLOW.ID){rowIndex = i;break;}
    }
    band.DeleteRecord(rowIndex);       
}