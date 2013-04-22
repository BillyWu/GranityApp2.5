function DrawVML(){
  Canvas.innerHTML = _FLOW.ProcString();
  Canvas.innerHTML += _FLOW.StepString();
  _FLOW.getInnerObject();
  _FOCUSTEDOBJ = null;
  stuffProp();
}

function DrawAll(){
  DrawVML();
}

function LoadFlow(AUrl){
  if(AUrl == "")
    _FLOW.createNew("");
  else
    _FLOW.loadFromDB(AUrl);
  DrawAll();
  emptyLog();
}

function LoadFlow0(AUrl){
  if(AUrl == "")
    _FLOW.createNew("");
  else
    _FLOW.loadFromXML(AUrl);
  DrawAll();
  emptyLog();
}


function ObjSelected(){
  if(_FOCUSTEDOBJ == null){
    alert("当前没有选中对象！--用鼠标单击流程图上的对象可以选中它");
    return false;  
  }
  return true;
}

//[流程图]菜单处理事件
function mnuNewFlow()
{
  if(_FLOW.Modified)
    if(!confirm("当前流程图尚未保存，新建新文件将会放弃所有修改，继续新建吗？")) return;
  var flow = new TTopFlow("");
  var oSys = document.UnitItem.ActiveBand.CalXmlLand.Fun;
  //定义一个临时工作流对象
  flow.ID = getMaxFlowID();
  flow.FileName =   "新建流程"+flow.ID;
  flow.Text     =   "新建流程"+flow.ID;  
  flow.Date     =   new Date().formate('yyyy-MM-dd');
  flow.Dept     =   oSys.GetDeptName()
  flow.Unit     =   oSys.GetDWName()
  flow.Man      =   oSys.GetUserName();
  flow.ManId      =   oSys.GetUserSn();
  flow.Memo     =   "";
  flow.Item     =  "";
  
  //打开工作流创建窗口
  if(vmlOpenWin("flow.htm", flow, 345,330))
  {
    //创建一个新的工作流模型
    _FLOW.ID        = flow.ID;
    _FLOW.FileName  = flow.FileName;
    _FLOW.Text      = flow.Text;
    _FLOW.Memo      = flow.Memo;
    _FLOW.Date      = flow.Date;
    _FLOW.Unit      = flow.Unit;
    _FLOW.Dept      = flow.Dept;
    _FLOW.Man       = flow.Man;
    _FLOW.Password  = flow.Password;
    _FLOW.FormID    = flow.ID;
    _FLOW.Item      = flow.Item
     LoadFlow("");
//  DrawTree();
    delete flow;
  }
}

//[流程图]菜单处理事件，采用数据库另存法
function mnuSaveAsFlow()
{
  if(_FLOW.ID=="") return;
  if(_FLOW.Modified)
    if(!confirm("当前流程图尚未保存，新建新文件将会放弃所有修改，继续新建吗？")) return;
  var flow = _FLOW;
  flow.ID  = getMaxFlowID();
  flow.FileName  = flow.FileName + flow.ID;
  if(!vmlOpenWin("flow.htm", flow, 345,330)) return;
  
    //另存时，ID应重新生成一个
    
    _FLOW.ID        = flow.ID;
    _FLOW.FileName  = flow.FileName;
    _FLOW.Text      = flow.Text;
    _FLOW.Memo      = flow.Memo;
    _FLOW.Date      = flow.Date;
    _FLOW.Unit      = flow.Unit;
    _FLOW.Dept      = flow.Dept;
    _FLOW.Man       = flow.Man;
    _FLOW.Item       = flow.Item;
    _FLOW.Password  = flow.Password;
    _FLOW.FormID    = flow.ID;
  
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;  
    var rowcount=band.RecordCount();
    for(var i=0;i<rowcount;i++)
    {
        var strflowname=band.getFldStrValue("名称",i);
        if(_FLOW.FileName==strflowname)
        {
            alert("["+strflowname+"]流程已经存在,不能另存为它!");
            return false;
            break;
        }
    }

    band.setFldStrValue(null,"另存名",_FLOW.FileName);
    band.setFldStrValue(null,"XN",_FLOW.ID);
    var strResult=band.ExecutCmd("复制流程");
    var success=ToolUtil.valueTag(strResult,"成功");
    if("true"!=success)
    {
        alert(ToolUtil.valueTag(strResult,"提示"));
        return false
    }
    alert("另存成功!");
    var workflow = _FLOW.FileName;
    _FLOW.FileName = '';
    _FLOW.Steps.length = 0;
    _FLOW.Procs.length = 0;
    band.Refresh();
    LoadFlow(workflow);
}

function mnuSaveAsFlow_1()
{
  if(_FLOW.ID=="") return;
  if(_FLOW.Modified)
    if(!confirm("当前流程图尚未保存，新建新文件将会放弃所有修改，继续新建吗？")) return;
  var flow = _FLOW;
  flow.ID  = getMaxFlowID();
  flow.FileName  = flow.FileName + flow.ID;
  if(vmlOpenWin("flow.htm", flow, 345,330))
  {
    //另存时，ID应重新生成一个
    
    _FLOW.ID        = flow.ID;
    _FLOW.FileName  = flow.FileName;
    _FLOW.Text      = flow.Text;
    _FLOW.Memo      = flow.Memo;
    _FLOW.Date      = flow.Date;
    _FLOW.Unit      = flow.Unit;
    _FLOW.Dept      = flow.Dept;
    _FLOW.Man       = flow.Man;
    _FLOW.Item       = flow.Item;
    _FLOW.Password  = flow.Password;
    _FLOW.FormID    = flow.ID;
    addFlowDB(_FLOW);
    addFlowContents(_FLOW);
    DrawAll();
    ue_save();    
  }
}


//[流程图]菜单处理事件
function mnuDelFlow()
{
  if(_FLOW.Modified)
    if(!confirm("当前流程图尚未保存，新建新文件将会放弃所有修改，继续新建吗？")) return;
 if(!confirm("你确认将删除该工作流程吗，请确认？")) return;
 DelFLowDB();
 _FLOW.clear();
 _FLOW.ID="";
 DrawAll();
 stuffProp()
 ue_save("删除成功");
}



function mnuEditFlow(){
  if(vmlOpenWin("flow.htm", _FLOW, 345,330))
  {
    updateFlowDB(_FLOW);
    stuffProp();
    ue_save("修改成功！");
  }
}

function mnuValidateFlow(){
  var s = _FLOW.validate();
  if(s == "")
    alert("校验完成，这是一个合法的流程图！");
  else
    alert(s);
}

function mnuOpenFlow()
{
    var str=strtbWorkflow("dvflow","tabflow","流程定义");
    DlgWin("dvflow","tabflow","工作流选择窗口","流程定义",str);
    var oband = $band("流程定义");
    oband.gridtype = 7;    oband.freecols= "名称"; oband.minwidth = "80px";oband.StrongGrid=true;
    
    var Grid = new XGrid("tabflow",oband,"in",null,1,1);    
}
    function strtbWorkflow(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>请选择一个工作流：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
		+'        <td width="100" align="right">当前工作流:</td><td width="100">'
		+'        <label style="FONT-WEIGHT: bold; COLOR: black;" datasrc="#workflowdesignTab" datafld="名称"></label></td>'
		+'        <td  align="right">【<a href="#" class="linkbtn_0" onclick=closetabflow("'+winid+'")>确定</a>】</td>'   
	    +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:98%;height:99%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="双击选入..." size="13" onblur="_onblurbox(this)" name="D1" datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300; position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
	    return s+s1+s2;
    }
    function strtUser(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>请选择经办人：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
		+'        <td width="100" align="right">当前经办人:</td><td width="100">'
		+'        <label style="FONT-WEIGHT: bold; COLOR: black;" datasrc="#WFNodePrototypeTab" datafld="名称"></label></td>'
		+'        <td align="right">【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none")>关闭</a>】</td>'   
	    +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:98%;height:99%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="双击选入..." size="13" onblur="_onblurbox(this)" name="D1" datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300; position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
	    return s+s1+s2;
    }    
function OpenUser()
{
    var band=$band("节点定义");
    if(!band) return;  
    //定位在该节点行，赋值
    var rowIndex = 0;
    for (var i = 0;i < band.RecordCount();i++) 
        if(band.getFldStrValue("编码",i)==_FOCUSTEDOBJ.id){rowIndex = i;break;}
    band.setCurrentRow(rowIndex);    
    var nodetype = band.getFldStrValue("类型");
    if("角色任务点"!=nodetype)
    {
        alert("不是角色任务点,不能设置执行责任人!");
        return;
    }
	if(true==band.ManualRefresh)
	    band.ManualFilterDatail();    
	  
    var str=strtUser("dvUserflow","tbUser","节点责任者");
    DlgWin("dvUserflow","tabUserflow","经办人选择窗口","节点责任者",str,900,400);
    var oband = $band("节点责任者");
    oband.gridtype = 8;    oband.freecols= "部门"; oband.editcol=",部门,";oband.minwidth = "80px";oband.StrongGrid=true;
    var Grid = new XGrid("tbUser",oband,"in",null,1,1);        
}

function selectfield()
{
    if($band("节点责任者").Val("执行项目")=="")
    {
        alert("如果要指定表单上的部门或人员字段,必须定义指行项目!");return;
    }
    var xmldata = ue_ajaxdom("exec SD_系统配置表 '"+$band("节点责任者").Val("执行项目")+"'");
    var sdata = (xmldata.selectSingleNode("table/sysstr"))?xmldata.selectSingleNode("table/sysstr").text:"";
    sdata = '<?xml version="1.0" encoding="utf-8"?><hmxml>' + sdata.replaceAll("&amp;quot;","'")+"</hmxml>";
    var b = new ActiveXObject("Microsoft.XMLDOM");
    b.async=false;
    b.loadXML(sdata);
    var md = b.selectSingleNode("//hmxml/XML//UnitItem//Item[@relation='M']").getAttribute("dataitem");
    var xitems = b.selectNodes("//hmxml/XML[@id='"+md+"Tab_Schema']")[0].selectNodes("xs:schema")[0].selectNodes("xs:element");
    var a =new Array();
    var m=0;
    for(var i=0;i<xitems.length;i++)
    {
        if(xitems[i].getAttribute("type")!="xs:string" || xitems[i].getAttribute("name")=="ID"
         || xitems[i].getAttribute("name").indexOf("单号")>-1 || xitems[i].getAttribute("name")=="主编号" 
         || xitems[i].getAttribute("name")=="单据编号" || xitems[i].getAttribute("name").indexOf("电")>-1
         || xitems[i].getAttribute("name").indexOf("省")>-1 || xitems[i].getAttribute("name").indexOf("市")>-1
         || xitems[i].getAttribute("name").indexOf("区")>-1 || xitems[i].getAttribute("name").indexOf("方")>-1
         || xitems[i].getAttribute("name").indexOf("类")>-1 || xitems[i].getAttribute("name").indexOf("点")>-1
         || xitems[i].getAttribute("name").indexOf("天气")>-1 || xitems[i].getAttribute("name").indexOf("额")>-1
         || xitems[i].getAttribute("name").indexOf("邮")>-1 || xitems[i].getAttribute("name").indexOf("状态")>-1
         || xitems[i].getAttribute("name").indexOf("季")>-1 || xitems[i].getAttribute("name").indexOf("条")>-1
         || xitems[i].getAttribute("name").indexOf("备注")>-1 || xitems[i].getAttribute("name").indexOf("因")>-1
         || xitems[i].getAttribute("name").indexOf("性")>-1 || xitems[i].getAttribute("name").indexOf("址")>-1) continue;
        a[m]=xitems[i].getAttribute("name");
        m++;
    }
    Acbo(a);
}
function closetabnodeuser()
{
    document.getElementById("tabnodeuser").style.display="none";
    return;
}

function closetabflow(winid)
{
    if(_FLOW.Modified)
        if(!confirm("当前流程图尚未保存，打开新文件将会放弃所有修改，继续打开吗？")) return;
    var band=document.UnitItem.getBandByItemName("流程定义");
    if(!band) return;
    var flowName=band.getFldStrValue("名称");
    LoadFlow(flowName);    
    ShowHide(winid,"none");
    
}


function mnuSaveFlow(){ 
    if(!confirm("确定要保存当前流程图[" + _FLOW.FileName + "]吗？")) return;
    var oband = $band("流程定义");
    var strVml=$("Canvas").innerHTML; 
    oband.setFldStrValue(null,"htmlstr",strVml);
    ue_save();
    return;
  /*
  if(!confirm("确定要保存当前流程图[" + _FLOW.FileName + "]吗？")) return;
  var s = _FLOW.validate();
  if(s != "")
	if(!confirm("当前有效性检查有误\n\n" + s + "\n\n是否要继续保存？")) return;
  try{
	var s = _FLOW.SaveToXML();
	if(s == "")
	  alert("保存成功！");
	else
	  alert("保存失败！"+s);
  }
  catch(e){
	alert(e);    
  }
  
  */
}

function mnuReloadFlow(){
  if(_FLOW.Modified)
    if(!confirm("当前流程图尚未保存，重新载入将会放弃所有修改，继续重载吗？")) return;
  LoadFlow(_FLOW.FileName);
}

//[流程图对象]菜单处理事件
function mnuAddProc(){
  var Proc = new TProc(_FLOW);
  if(vmlOpenWin("proc.htm", Proc, 450,350)){
    _FLOW.addProc(Proc);
    pushLog("addproc", Proc);
    DrawAll();
  }
}

function mnuAddStep(){
  var Step = new TStep(_FLOW);
  if(vmlOpenWin("step.htm", Step, 500,350)){
    _FLOW.addStep(Step);
    pushLog("addstep", Step);
    DrawAll();
  }
}

function mnuCopyProc(){
  if(!ObjSelected()) return;
  if(_FOCUSTEDOBJ.typ != "Proc"){
    alert("只有任务可以复制！");
    return;
  }
  var curProc = _FLOW.getProcByID(_FOCUSTEDOBJ.id);
  if(!confirm("确定要复制任务[" + curProc.Text + "]吗？")) return;
  var Proc = new TProc(_FLOW);
  var iID = Proc.ID;
  Proc.clone(curProc);
  Proc.ID = iID;
  Proc.X = parseInt(curProc.X) + 10;
  Proc.Y = parseInt(curProc.Y) + 10;
  _FLOW.addProc(Proc);
  pushLog("addproc", Proc);
  DrawAll();
  objFocusedOn(iID);
  mnuSetZIndex("F");
}

function mnuEditObj(){
  if(!ObjSelected()) return;
  if(_FOCUSTEDOBJ.typ != "Proc" && _FOCUSTEDOBJ.typ != "Step") return;
  if(_FOCUSTEDOBJ.typ == "Proc")
    editProc(_FOCUSTEDOBJ.id);
  else
    editStep(_FOCUSTEDOBJ.id);
}

function mnuDelObj(){
  if(ObjSelected()) 
  {
     deleteObj(_FOCUSTEDOBJ.id);
  }
}

function mnuSetZIndex(Act){
  if(!ObjSelected()) return;
  if(_FOCUSTEDOBJ.typ != "Proc" && _FOCUSTEDOBJ.typ != "Step") return;
  if(_FOCUSTEDOBJ.typ == "Proc")
    var obj = _FLOW.getProcByID(_FOCUSTEDOBJ.id);
  else
    var obj = _FLOW.getStepByID(_FOCUSTEDOBJ.id);
  var oldValue = obj.zIndex;
  if(Act == "F")
    _FLOW.brintToFront(obj);
  else
    _FLOW.sendToBack(obj);
  _FOCUSTEDOBJ.style.zIndex = obj.zIndex;
  pushLog("editprop",{"obj":obj,"prop":"zIndex","_old":oldValue,"_new":obj.zIndex});
}

//[系统菜单]处理事件
function mnuOption(){
  if(vmlOpenWin("option.htm", _FLOW.Config, 510,510)){
    DrawAll();
  }
}

function mnuDemo(){
  var tmpwin = window.open("demo.htm");
  tmpwin.focus();
}

function mnuFileMgr(){
  vmlOpenWin("filemgr.jsp","",450,400);
}

function mnuAbout(){
  vmlOpenWin("about.htm", "", 480,400);
}

function mnuExit(){
  if(confirm("确定要退出本系统吗？")){
    window.opener = null;
    window.close();
  }
}

function mnuSetZoom(Act){
  var rate = Act == "in"?0.2:-0.2;
  var newzoom = _ZOOM + rate;
  if(newzoom > 2) return;
  if(newzoom < 0.2) return;
  changeZoom(newzoom);
  document.all("zoomshow").value = _ZOOM;
}

function changeZoom(v){
  _ZOOM = parseFloat(parseFloat(v).toFixed(2));
  Canvas.style.zoom = _ZOOM;
}

function mnuTurnToolbox(){
  tbxToolbox.VisibleEx = !tbxToolbox.VisibleEx;
  tbxToolbox.InnerObject.style.display = tbxToolbox.VisibleEx?"block":"none";
  document.all.mnu_win_toolbox.innerHTML = (tbxToolbox.VisibleEx?"隐藏":"显示") + "工具箱";
}

function mnuTurnPropbox(){
  tbxPropbox.VisibleEx = !tbxPropbox.VisibleEx;
  tbxPropbox.InnerObject.style.display = tbxPropbox.VisibleEx?"block":"none";
  document.all.mnu_win_propbox.innerHTML = (tbxPropbox.VisibleEx?"隐藏":"显示") + "属性框";
}

function mnuTurnObjView(){
  tbxObjView.VisibleEx = !tbxObjView.VisibleEx;
  tbxObjView.InnerObject.style.display = tbxObjView.VisibleEx?"block":"none";
  document.all.mnu_win_objview.innerHTML = (tbxObjView.VisibleEx?"隐藏":"显示") + "对象视图";
}

function mnuTurnDataView(){
  tbxDataView.VisibleEx = !tbxDataView.VisibleEx;
  tbxDataView.InnerObject.style.display = tbxDataView.VisibleEx?"block":"none";
  document.all.mnu_win_dataview.innerHTML = (tbxDataView.VisibleEx?"隐藏":"显示") + "数据视图";
}
