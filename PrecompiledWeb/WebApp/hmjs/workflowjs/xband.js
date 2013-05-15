
//�޸Ľڵ��ӦBand��ֵ
function setPropDataValue(AProp, AValue)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,AProp,AValue);
    band.setFldStrValue(null,AProp.toLowerCase(),AValue);
}

//�޸Ĳ����ӦBand��ֵ
function setStepDataValue(AProp, AValue)
{
    var band=document.UnitItem.getBandByItemName("������ת");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,AProp,AValue);
    band.setFldStrValue(null,AProp.toLowerCase(),AValue);

    if(AProp=="FromProc")
        band.setFldStrValue(null,"ǰ��",AValue);
    else if(AProp=="ToProc")
        band.setFldStrValue(null,"�ڵ�",AValue);
}

//ɾ���ڵ�������Band��ֵ
function deleteDateProcByID(bandname,id)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==id){rowIndex = i;break;}
    }
    band.DeleteRecord(rowIndex);    
}



// topflowevent.js�й���band�ĺ���
function updateStepDataValue(oStep)
{
    var band=document.UnitItem.getBandByItemName("������ת");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==oStep.ID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"points",oStep.Points);
    band.setFldStrValue(null,"ToProc",oStep.ToProc);
    band.setFldStrValue(null,"FromProc",oStep.FromProc);
    
    var Proc = _FLOW.getProcByID(oStep.ToProc);
    band.setFldStrValue(null,"�ڵ�",Proc.NodeName);
    band.setFldStrValue(null,"text",oStep.Text);
    Proc = _FLOW.getProcByID(oStep.FromProc);
    if(Proc)  band.setFldStrValue(null,"ǰ��",Proc.NodeName);

    
    band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
    band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
    band.setFldStrValue(null,"toRelX",oStep.toRelX);
    band.setFldStrValue(null,"toRelY",oStep.toRelY);
    band.setFldStrValue(null,"shapetype",oStep.ShapeType);
    band.setFldStrValue(null,"startArrow",oStep.StartArrow);
    band.setFldStrValue(null,"endArrow",oStep.EndArrow);
    band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
    band.setFldStrValue(null,"zIndex",oStep.zIndex);
    band.setFldStrValue(null,"����״̬",oStep.Cond);
    band.setFldStrValue(null,"���ַ�",oStep.NoSpecify);

}


function updateStepData(bandname,fieldname,value)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,fieldname,value);
}

function setPropTextData(bandname,oItem)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    switch(oItem.id)
    {
        case "text":band.setFldStrValue(null,"text",oItem.value);
            break;
        case "nodeName":band.setFldStrValue(null,"����",oItem.value);
            break;            
        case "flownodeName":band.setFldStrValue(null,"�ڵ�",oItem.value);
            break;
    }
}


function updateActFlagData(bandname,objID,oItem)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==objID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    var flagText = "��ɫ�����";
    switch(oItem.value)
    {
        case "1013":
            flagText = "���";
            break;
        case "2013":
            flagText = "�յ�";
            break;        
        case "0014":
            flagText = "������";
            break;        
        case "0015":
            flagText = "������";
            break;
        default:
            flagText = "��ɫ�����";
    }
    band.setFldStrValue(null,"����",flagText);
}


function setPropData(bandname,fieldname,value)
{
    var band=document.UnitItem.getBandByItemName(bandname);
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,fieldname,value);
}


function setPropShapeTypeData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"shapetype",oItem.value);
}

function setPropTextWeightData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"textWeight",oItem.value);
}


function setPropStrokeWeightData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"strokeWeight",oItem.value);
}


function setPropzIndexData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"zIndex",oItem.value);
}

function setPropXData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"x",oItem.value);
}

function setPropYData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"y",oItem.value);
}

function setPropWData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"width",oItem.value);
}

function setPropHData(oItem)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    //��λ�ڸýڵ��У���ֵ
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"height",oItem.value);
}

function updatePropData(Proc)
{
    //if(_FOCUSTEDOBJ==null) return;
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("����",i)==Proc.ID){rowIndex = i;break;}
    }
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"text",Proc.Text);
    band.setFldStrValue(null,"����",Proc.NodeName);
    band.setFldStrValue(null,"procType",Proc.ProcType);
    band.setFldStrValue(null,"shapetype",Proc.ShapeType);
    band.setFldStrValue(null,"width",Proc.Width);
    band.setFldStrValue(null,"height",Proc.Height);
    var flagText="";
    switch(Proc.actFlag)
    {
        case "1013":
            flagText = "���";
            break;
        case "2013":
            flagText = "�յ�";
            break;        
        case "0014":
            flagText = "������";
            break;        
        case "0015":
            flagText = "������";
            break;
        default:
            flagText = "��ɫ�����";
    }    
    band.setFldStrValue(null,"����",flagText);
    
}

//�������ͼ��[����]Ԫ�ض������ݵ���
function addFlowDB(oFlow)
{
    var band=document.UnitItem.getBandByItemName("���̶���");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"���",oFlow.ID);
    band.setFldStrValue(null,"����",oFlow.FileName);
    band.setFldStrValue(null,"����",oFlow.Text);
    band.setFldStrValue(null,"˵��",oFlow.Memo);
    band.setFldStrValue(null,"formid",oFlow.ID);
    band.setFldStrValue(null,"password",oFlow.Password);
    band.setFldStrValue(null,"��������",oFlow.Date);
    band.setFldStrValue(null,"������",oFlow.Man);
    band.setFldStrValue(null,"������Ŀ",oFlow.Item);
    band.setFldStrValue(null,"��λ����",oFlow.Unit);
    band.setFldStrValue(null,"��������",oFlow.Dept);
}

//�޸����ݵ�������ͼ��[����]Ԫ��
function updateFlowDB(oFlow)
{
    var band=document.UnitItem.getBandByItemName("���̶���");
    if(!band) return;
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
        if(band.getFldStrValue("���",i)==oFlow.ID){rowIndex = i;break;}
    band.setCurrentRow(rowIndex);
    band.setFldStrValue(null,"����",oFlow.FileName);
    band.setFldStrValue(null,"����",oFlow.Text);
    band.setFldStrValue(null,"˵��",oFlow.Memo);
    band.setFldStrValue(null,"formid",oFlow.ID);
    band.setFldStrValue(null,"password",oFlow.Password);
    band.setFldStrValue(null,"��������",oFlow.Date);
    band.setFldStrValue(null,"������",oFlow.Man);
    band.setFldStrValue(null,"������Ŀ",oFlow.Item);
    band.setFldStrValue(null,"��λ����",oFlow.Unit);
    band.setFldStrValue(null,"��������",oFlow.Dept);
    updateSingleFlowContents(oFlow);
}


function addFlowContents(oFlow)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    for(var i=0;i<oFlow.Procs.length;i++)
    {
        band.NewRecord();    
        Proc = oFlow.Procs[i];
        band.setFldStrValue(null,"����",Proc.ID);
        band.setFldStrValue(null,"����",Proc.NodeName);        
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
                flagText = "���";
                break;
            case "2013":
                flagText = "�յ�";
                break;        
            case "0014":
                flagText = "������";
                break;        
            case "0015":
                flagText = "������";
                break;
            default:
                flagText = "��ɫ�����";
        }    
        band.setFldStrValue(null,"����",flagText);
    }
    
    band=document.UnitItem.getBandByItemName("������ת");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.NewRecord();    
        oStep = oFlow.Steps[i];
        band.setFldStrValue(null,"����",oStep.ID);
        band.setFldStrValue(null,"points",oStep.Points);
        
        band.setFldStrValue(null,"ToProc",oStep.ToProc);
        band.setFldStrValue(null,"FromProc",oStep.FromProc);

        //��ToProc��FromProc�ҵ���Ӧ�Ľڵ����ƣ������ڵ��ǰ��
        var Proc = _FLOW.getProcByID(oStep.ToProc);
        band.setFldStrValue(null,"�ڵ�",Proc.NodeName);
        band.setFldStrValue(null,"text",oStep.Text);
        Proc = _FLOW.getProcByID(oStep.FromProc);
        band.setFldStrValue(null,"ǰ��",Proc.NodeName);
        
        band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
        band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
        band.setFldStrValue(null,"toRelX",oStep.toRelX);
        band.setFldStrValue(null,"toRelY",oStep.toRelY);
        band.setFldStrValue(null,"shapetype",oStep.ShapeType);
        band.setFldStrValue(null,"startArrow",oStep.StartArrow);
        band.setFldStrValue(null,"endArrow",oStep.EndArrow);
        band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
        band.setFldStrValue(null,"zIndex",oStep.zIndex);
        band.setFldStrValue(null,"����״̬",oStep.Cond);
        band.setFldStrValue(null,"���ַ�",oStep.NoSpecify);

    }
    
}

function updateSingleFlowContents(oFlow)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    for(var i=0;i<oFlow.Procs.length;i++)
    {
        band.setFldStrValue(i,"����",oFlow.FileName);
        oFlow.Procs[i].FlowName =   oFlow.FileName;
    }
    
    band=document.UnitItem.getBandByItemName("������ת");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.setFldStrValue(i,"����",oFlow.FileName);
        oFlow.Steps[i].FlowName =   oFlow.FileName;
    }
    band=document.UnitItem.getBandByItemName("�ڵ�������");
    for(var i=0;i<oFlow.Steps.length;i++)
    {
        band.setFldStrValue(i,"����",oFlow.FileName);
    }    
}



function addPropData(Proc)
{
    var band=document.UnitItem.getBandByItemName("�ڵ㶨��");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"����",Proc.ID);
    band.setFldStrValue(null,"����",Proc.NodeName);
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
            flagText = "���";
            break;
        case "2013":
            flagText = "�յ�";
            break;        
        case "0014":
            flagText = "������";
            break;        
        case "0015":
            flagText = "������";
            break;
        default:
            flagText = "��ɫ�����";
    }    
    band.setFldStrValue(null,"����",flagText);
    
}


function addStepData(oStep)
{
    var band=document.UnitItem.getBandByItemName("������ת");
    if(!band) return;
    band.NewRecord();
    band.setFldStrValue(null,"����",oStep.ID);
    band.setFldStrValue(null,"points",oStep.Points);
    
    band.setFldStrValue(null,"ToProc",oStep.ToProc);
    band.setFldStrValue(null,"FromProc",oStep.FromProc);
    //��ToProc��FromProc�ҵ���Ӧ�Ľڵ����ƣ������ڵ��ǰ��
    var Proc = _FLOW.getProcByID(oStep.ToProc);
    band.setFldStrValue(null,"�ڵ�",Proc.NodeName);//oStep.FlowNodeName
    band.setFldStrValue(null,"text",oStep.Text);
    Proc = _FLOW.getProcByID(oStep.FromProc);
    band.setFldStrValue(null,"ǰ��",Proc.NodeName);
    
    band.setFldStrValue(null,"fromRelX",oStep.fromRelX);
    band.setFldStrValue(null,"fromRelY",oStep.fromRelY);
    band.setFldStrValue(null,"toRelX",oStep.toRelX);
    band.setFldStrValue(null,"toRelY",oStep.toRelY);
    band.setFldStrValue(null,"shapetype",oStep.ShapeType);
    band.setFldStrValue(null,"startArrow",oStep.StartArrow);
    band.setFldStrValue(null,"endArrow",oStep.EndArrow);
    band.setFldStrValue(null,"strokeWeight",oStep.StrokeWeight);
    band.setFldStrValue(null,"zIndex",oStep.zIndex);
    band.setFldStrValue(null,"����״̬",oStep.Cond);
    band.setFldStrValue(null,"���ַ�",oStep.NoSpecify);
}


function getMaxFlowID()
{
    var band=document.UnitItem.getBandByItemName("���̶���");
    if(!band) return;
    if(band.RecordCount()==0) return "1";
    var smax = band.getFldStrValue("���",0).replace(/[^0-9]/ig,"");
    if(smax=="") smax="0"; 
    var max = parseInt(smax,10);
    for(var i=0; i < band.RecordCount(); i++)
    {
        smax = band.getFldStrValue("���",i).replace(/[^0-9]/ig,"");
        if(smax=="") smax="0";
        if(max<parseInt(smax,10)) 
        max = parseInt(smax,10);
    }
    max = max + 1;
    return max;    
}


function DelFLowDB()
{
    //��ɾ���������Ժͽڵ� 1
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
    var band=document.UnitItem.getBandByItemName("���̶���");
    if(!band) return;
     var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
    {
        if(band.getFldStrValue("���",i)==_FLOW.ID){rowIndex = i;break;}
    }
    band.DeleteRecord(rowIndex);       
}