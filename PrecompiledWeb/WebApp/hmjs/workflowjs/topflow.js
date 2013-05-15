//const

//[任务]类定义
function TProc(AFlow,id){
  this.ObjType  = "Proc";
  this.Flow     = AFlow;
  this.ID       = id;
  if(this.ID == undefined) this.ID = this.Flow.getMaxProcID();
  this.NodeName     = "新建节点"+this.ID;
  this.Text         = "新建节点"+this.ID;
  this.ShapeType    = "RoundRect";
  this.ProcType     = "NormalProc";
  this.Width        = "50";
  this.Height       = "50";
  this.X            = "50";
  this.Y            = "50";
  this.TextWeight   = "9pt";
  this.StrokeWeight = "1";
  this.zIndex       = 1;
  this.InnerObject  = null;
  this.MoveType     = "";
  
  //新增
  this.actFlag      = "";
  this.waittime     = "";
  this.isJbrNode   = "1";
  this.isSltTrans   = "1";
  this.isSameCredit = "1";
  //leofixed
  this.LimitNode    = "";
  this.SuppleMentNode="";
  this.FlowName     = "";
  this.isOpinion    = "";
  this.OTitle       = "";  
  this.appenditem       = "";  
}

TProc.prototype.getInnerObject = function(){
  if(this.InnerObject == null) this.InnerObject = document.all(this.ID);
  return this.InnerObject;
}

TProc.prototype.setFocus = function(){
  this.getInnerObject.StrokeColor = this.Flow.Config.ProcFocusedStrokeColor;
}

TProc.prototype.lostFocus = function(){
  this.getInnerObject.StrokeColor = (this.ProcType == "NormalProc")?this.Flow.Config.ProcColor:this.Flow.Config._ProcColor;
}

TProc.prototype.doClick = function(){
  this.Flow.selectObject(this.ID, "Proc");
}

TProc.prototype.mouseDown = function(){
  var rightSide = (parseInt(this.X) + parseInt(this.Width) - event.x <= 2);
  var bottomSide = (parseInt(this.Y) + parseInt(this.Height) - event.y <= 2);
  if(rightSide && bottomSide)
    this.MoveType = "nw";
  else if(rightSide)
    this.MoveType = "e";
  else if(bottomSide)
    this.MoveType = "n";
  else
    this.MoveType = "m";
  this.getInnerObject.setCapture();
  switch(this.MoveType){
    case "m":
      this.CurrentX = event.x - this.InnerObject.offsetLeft;
      this.CurrentY = event.y - this.InnerObject.offsetTop;
	  break;
    case "front":
    case "back":
      if(_TOOLTYPE == "front")
        this.Flow.brintToFront(this);
      else
        this.Flow.sendToBack(this);
      this.getInnerObject.style.zIndex = this.zIndex;
      break;
  }
}

TProc.prototype.mouseMove = function(){

  switch(this.MoveType){
    case "m":
      this.X = event.x - this.CurrentX;
      this.Y = event.y - this.CurrentY;
	  if(this.X < 0) this.X = 0;
      if(this.Y < 30) this.Y = 30;
      this.InnerObject.style.left = this.X;
      this.InnerObject.style.top = this.Y;
      break;
    case "n":
      this.Height = event.y - this.Y;
      if(this.Height < 30) this.Height = 30;
      this.InnerObject.style.height = this.Height;
      break;
    case "e":
      this.Width = event.x - this.X;
      if(this.Width < 30) this.Width = 30;
      this.InnerObject.style.width = this.Width;
      break;
    case "nw":
      this.Width = event.x - this.X;
      this.Height = event.y - this.Y;
      if(this.Width < 30) this.Width = 30;
      if(this.Height < 30) this.Height = 30;
      this.InnerObject.style.width = this.Width;
      this.InnerObject.style.height = this.Height;
      break;
    default://没有任何按键的情况下，计算位置并显示相应的操作鼠标
      var rightSide = (parseInt(this.X) + parseInt(this.Width) - event.x <= 2);
      var bottomSide = (parseInt(this.Y) + parseInt(this.Height) - event.y <= 2);
      if(rightSide && bottomSide)
        this.getInnerObject.style.cursor = "NW-resize";
      else if(rightSide)
        this.getInnerObject.style.cursor = "E-resize";
      else if(bottomSide)
        this.getInnerObject.style.cursor = "N-resize";
      else
        this.getInnerObject.style.cursor = "hand";
      break;
  }
}

TProc.prototype.mouseUp = function(){
  if(this.MoveType != ""){
    this.getInnerObject.releaseCapture();
    if(this.MoveType == "nw"){
      if(parseInt(this.InnerObject.style.top)<-10){
        alert("对象上边界超出，将自动调整.");
        this.InnerObject.style.top=30;
      }
      if(parseInt(this.InnerObject.style.left)<-10){
        alert("对象左边界超出，将自动调整.");
        this.InnerObject.style.left=30;
      }
    }
  }
  this.MoveType = "";
}

TProc.prototype.clone = function(AProc){
  this.ID = AProc.ID;
  this.Text = AProc.Text;
  this.ShapeType = AProc.ShapeType
  this.ProcType = AProc.ProcType;
  this.Width = AProc.Width;
  this.Height = AProc.Height;
  this.X = AProc.X;
  this.Y = AProc.Y;
  this.TextWeight = AProc.TextWeight;
  this.StrokeWeight = AProc.StrokeWeight;
  this.zIndex = AProc.zIndex;
  this.InnerObject = null;
  this.MoveType = "";
}

TProc.prototype.setPropValue = function(AProp, AValue){
  switch(AProp){
    case "ID":
      var oldID = this.ID;
      if(oldID == AValue) return true;
      if(this.Flow.IDExists(AValue)){
        alert("编号[" + AValue + "]已经存在！");
        return false;
      }
      this.InnerObject.all(oldID + "Text").id = AValue + "Text";
      this.ID = AValue;
      this.InnerObject.id = AValue;
      this.Flow.changeProcID(oldID, AValue);
      break;
    case "X":
      this.X = AValue;
      if(this.InnerObject.style)
            this.InnerObject.style.left = AValue;
      break;
    case "Y":
      this.Y = AValue;
      if(this.InnerObject.style)
            this.InnerObject.style.top = AValue;
      break;
    case "Width":
      this.Width = AValue;
      if(this.InnerObject.style)
            this.InnerObject.style.width = AValue;
      break;
    case "Height":
      this.Height = AValue;
      if(this.InnerObject.style)
            this.InnerObject.style.height = AValue;
      break;
  }
  setPropDataValue(AProp, AValue);
}

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

//[任务]字符串化函数
TProc.prototype.toString = function(){
  var cl = this.Flow.Config;
  var nStockeColor,nTextColor;
  if(this.ProcType == 'BeginProc' || this.ProcType == 'EndProc'){
    nTextColor = cl._ProcTextColor;
    nStrokeColor = cl._ProcColor;
  }
  else{
    nTextColor = cl.ProcTextColor;
    nStrokeColor = cl.ProcColor;
  }
  var arrVal = new Array();
  arrVal["id"]              = this.ID;
  //arrVal["title"]           = this.ID + ':' + this.Text + "\n\nX-" + this.X + " Y-" + this.Y + " W-" + this.Width + " H-" + this.Height + " Z-" + this.zIndex;
  arrVal["title"]           = this.ID;
  arrVal["sc"]              = nStrokeColor;
  arrVal["st"]              = this.ProcType;
  arrVal["l"]               = this.X;
  arrVal["t"]               = this.Y;
  arrVal["w"]               = this.Width;
  arrVal["h"]               = this.Height;
  arrVal["z"]               = this.zIndex;
  arrVal["sw"]              = this.StrokeWeight;
  arrVal["fsc"]             = cl.ProcFocusedStrokeColor;
  arrVal["shadowenable"]    = cl.IsProcShadow;
  arrVal["shadowcolor"]     = cl.ProcShadowColor;
  arrVal["3denable"]        = cl.IsProc3D;
  arrVal["3ddepth"]         = cl.Proc3DDepth;
  arrVal["sc1"]             = cl.ProcColor1;    //普通
  arrVal["sc2"]             = cl.ProcColor2;    //普通

  arrVal["osc1"]             = cl._ProcColor1;   //start/end
  arrVal["osc2"]             = cl._ProcColor2;   //start/end

  arrVal["tc"]              = nTextColor;
  arrVal["fs"]              = this.TextWeight;
  arrVal["text"]            = this.Text;

  //新增
  arrVal["af"]              = this.actFlag;
  arrVal["wt"]              = this.waittime;
  arrVal["ist"]             = this.isSltTrans;
  arrVal["isc"]             = this.isSameCredit;
  arrVal["lnode"]           = this.LimitNode;
  arrVal["supplementnode"]  = this.SuppleMentNode;
  

  return stuffShape(getShapeVal(this.ShapeType), arrVal);
}

//[路径]类定义
//AFlow为工作流的对象，包括节点对象，关联对象
function TStep(AFlow,id){
  this.ObjType = "Step";
  this.Flow = AFlow;
  this.ID = id;
  if(this.ID == undefined) this.ID = this.Flow.getMaxStepID();
  this.FlowNodeName = "新建步骤"+this.ID;
  this.Text         = "新建步骤"+this.ID;
  this.ShapeType = "Line";
  this.FromProc = "";
  this.ToProc = "";
  this.Points = "";
  this.Cond = "";
  this.StartArrow = "none";
  this.EndArrow = "Classic";
  this.TextWeight = "9pt";
  this.StrokeWeight = "1";
  this.zIndex = 0;
  this.InnerObject = null;
//新增
  this.fromRelX = 0;
  this.fromRelY = 0;
  this.toRelX = 0;
  this.toRelY = 0;
  this.StepType = "";
  this.FlowName = "";
//leofixed 20100608 NoSpecify 不分发经办者,缺省是为下一节点分发经办者
  this.NoSpecify="";
}

TStep.prototype.clone = function(AStep){
  this.ID = AStep.ID;
  this.Text = AStep.Text;
  this.ShapeType = AStep.ShapeType;
  this.FromProc = AStep.FromProc;
  this.ToProc = AStep.ToProc;
  this.Points = AStep.Points;  
  this.Cond = AStep.Cond;
  this.NoSpecify = AStep.NoSpecify;
  this.StartArrow = AStep.StartArrow;
  this.EndArrow = AStep.EndArrow;
  this.TextWeight = AStep.TextWeight;
  this.StrokeWeight = AStep.StrokeWeight;
  this.zIndex = AStep.zIndex;
  this.Points = AStep.Points;

  this.fromRelX = AStep.fromRelX;
  this.fromRelY = AStep.fromRelY;
  this.toRelX = AStep.toRelX;
  this.toRelY = AStep.toRelY;
  this.StepType = AStep.StepType;
}

TStep.prototype.setPropValue = function(AProp, AValue){
  switch(AProp){
    case "ID":
      var oldID = this.ID;
      if(oldID == AValue) return true;
      if(this.Flow.IDExists(AValue)){
        alert("编号[" + AValue + "]已经存在！");
        return false;
      }
      this.InnerObject.all(oldID + "Text").id = AValue + "Text";
      this.InnerObject.all(oldID + "Arrow").id = AValue + "Arrow";
      this.ID = AValue;
      this.InnerObject.id = AValue;
      break;
	case "Points":
	  this.Points = AValue;
	  break;
	case "FromProc":
	  this.FromProc = AValue;
	  break;
	case "ToProc":
	  this.ToProc = AValue;
	  break;
  }
  setStepDataValue(AProp, AValue);
}


//[路径]字符串化函数
TStep.prototype.toString = function(){
  var StepHTML = '';
  var cl = this.Flow.Config;
  var arrVal = new Array();
  arrVal["id"]              = this.ID;
  arrVal["title"]           = this.ID + ':' + this.Text;
  arrVal["sc"]              = cl.StepColor;
  arrVal["pt"]              = this.getPath();
  arrVal["z"]               = this.zIndex;
  arrVal["sw"]              = this.StrokeWeight;
  arrVal["fsc"]             = cl.StepFocusedStrokeColor;
  arrVal["sa"]              = this.StartArrow;
  arrVal["ea"]              = this.EndArrow;
  arrVal["cond"]            = this.Cond;
  arrVal["nospecify"]       = this.NoSpecify;
  
  arrVal["text"]            = this.Text;
  return stuffShape(getShapeVal(this.ShapeType), arrVal);
}

TStep.prototype.getInnerObject = function(){
  if(this.InnerObject == null) this.InnerObject = document.all(this.ID);
  return this.InnerObject;
}

TStep.prototype.setFocus = function(){

  this.getInnerObject.StrokeColor = this.Flow.Config.StepFocusedStrokeColor;
}

TStep.prototype.lostFocus = function(){
  this.getInnerObject.StrokeColor = this.Flow.Config.StepColor;
}

TStep.prototype.doClick = function(){
  this.Flow.selectObject(this.ID, "Step");
}

//流程图类定义
function TTopFlow(AName){
  this.name = AName;
  this.ID = "";
  this.Text = "";
  this.FileName = "";
  this.FormID = "";
  this.Modified = false;
  this.Steps = [];
  this.Procs = [];
  this.SelectedObject = null;
  this.Password = "";
  this.Config1 = {
    _ProcColor                : "#C0C0C0",  //开始/结束
    _ProcTextColor            : "black",    //开始/结束
    _ProcColor1               : "red",      //开始/结束
    _ProcColor2               : "white",    //开始/结束
    ProcColor                 : "#54a358",
    ProcTextColor             : "black",
    ProcFocusedStrokeColor    : "yellow",
    IsProcShadow              : "T",
    ProcShadowColor           : "#CCCCCC",
    ProcColor1                : "#54a358",
    ProcColor2                : "#FFFFFF",     
    IsProc3D                  : "F",
    Proc3DDepth               : "5",
    StepFocusedStrokeColor    : "#dc2201",
    StepColor                 : "gray"
  }
  this.Config = {
    _ProcColor                : "#C0C0C0",  //开始/结束
    _ProcTextColor            : "black",    //开始/结束
    _ProcColor1               : "#FF9900",      //开始/结束
    _ProcColor2               : "white",    //开始/结束
    ProcColor                 : "gray",
    ProcTextColor             : "black",
    ProcFocusedStrokeColor    : "#f90",
    IsProcShadow              : "T",
    ProcShadowColor           : "#CCCCCC",
    ProcColor1                : "#e2d9b7",
    ProcColor2                : "#FFFFFF",     
    IsProc3D                  : "F",
    Proc3DDepth               : "5",
    StepFocusedStrokeColor    : "#dc2201",
    StepColor                 : "gray"
  }  
  //leo new
  this.Memo = "";
  this.Date = "";
  this.Man = "";
  this.Item = "";
  this.Unit = "";
  this.Dept = "";
  
}

//
TTopFlow.prototype.getInnerObject = function(){
  for(var i = 0;i<this.Procs.length; i++)
    this.Procs[i].getInnerObject();
  for(i = 0;i<this.Steps.length; i++)
    this.Steps[i].getInnerObject();
}
//选中某个对象
TTopFlow.prototype.selectObject = function(aID, aType){
  this.unSelectObject();
  this.SelectedObject = (aType == "Proc")?this.getProcByID(aID):this.getStepByID(aID);
  this.SelectedObject.setFocus();
}

//取消选中某个对象
TTopFlow.prototype.unSelectObject = function(){
  if(this.SelectedObject != null) this.SelectedObject.lostFocus();
  this.SelectedObject = null;
}

//清除流程图的内容
TTopFlow.prototype.clear = function(){
  //this.FileName = '';
  this.Steps.length = 0;
  this.Procs.length = 0;
}

//新建流程图
TTopFlow.prototype.createNew = function(AName)
{
  addFlowDB(this);
  this.clear();
  
  //增加开始结点
  Proc = new TProc(this, "begin");
  Proc.Text = "开始";
  Proc.NodeName = "开始";
  Proc.ShapeType = "Oval";
  Proc.ProcType = "BeginProc";
  Proc.actFlag = "1013";
  Proc.X = "10";
  Proc.Y = "40";
  this.addProc(Proc);
  addPropData(Proc);
  
  //增加结束结点
  Proc = new TProc(this, "end");
  Proc.Text = "结束";
  Proc.NodeName = "结束";
  Proc.ShapeType = "Oval";
  Proc.ProcType = "EndProc";
  Proc.actFlag = "2013";
  Proc.X = "500";
  Proc.Y = "350";
  this.addProc(Proc);
  addPropData(Proc);
}

//添加流程图的[任务]元素对象
TTopFlow.prototype.addProc = function(AProc){
//  if(this.Procs.length >= 20){
//    alert("根据比赛要求，最多不允许超过20个任务!");
//    return false;
//  }
  this.Modified = true;
  this.Procs[this.Procs.length] = AProc;                //对象数组增加一个
  //增加数据库
//  addFlowData(FLOW);
}




//添加流程图的[路径]元素对象
TTopFlow.prototype.addStep = function(AStep){
  this.Steps[this.Steps.length] = AStep;
  this.Modified = true;
}

TTopFlow.prototype.changeProcID = function(OldID, NewID){alert("changeProcID");
  var Step;
  for(var i = 0; i< this.Steps.length; i++){
    Step = this.Steps[i];
    if(Step.FromProc == OldID) Step.FromProc = NewID;
    if(Step.ToProc == OldID) Step.ToProc = NewID;
  }
}
//获取一个[任务]的二维数据集视图
TTopFlow.prototype.getProcDataView = function(AProcID){
  var arr = [], Step;
  for(var i = 0; i < this.Steps.length; i++){
    Step = this.Steps[i];
    if(Step.ToProc == AProcID){
      S = this.getProcByID(Step.FromProc).Text;
      arr[arr.length] = new Array(Step.ID, S, Step.Cond);
    }
  }
  return arr;
}

//获取整个[流程图]的二维数据集视图
TTopFlow.prototype.DataView = function(){
  var Proc; arrDataView = [], arr = [];
  var i,j, u, k = 0;
  for(i = 0; i < this.Procs.length; i++){
    Proc = this.Procs[i];
    arr.length = 0;
    arr = this.getProcDataView(Proc.ID);
    u = arr.length;
    if(u != undefined && u != null && u > 0){
      for(j = 0; j < arr.length; j++){
        arrDataView[k++] = {
          "ProcID"      : Proc.ID,
          "ProcText"    : Proc.Text,
          "Idx"         : j + 1,
          "PreProcID"   : arr[j][0],
          "PreProcText" : arr[j][1],
          "Cond"        : arr[j][2]
        }
      }
    }
  }
  return arrDataView;
}

TTopFlow.prototype.hasPriorProc = function(AProcID){
  for(var i = 0; i < this.Steps.length; i++)
    if(this.Steps[i].ToProc == AProcID) return true;
  return false;
}

TTopFlow.prototype.hasNextProc = function(AProcID){
  for(var i = 0; i < this.Steps.length; i++)
    if(this.Steps[i].FromProc == AProcID) return true;
  return false;
}

TTopFlow.prototype.validate = function(){
  var ErrMsg = []; WarnMsg = [];
  var Proc, PType;
  for(var i = 0; i < this.Procs.length; i++){
    Proc = this.Procs[i];
    PType = (Proc.ProcType == "NormalProc"?"中间任务":(Proc.ProcType == "BeginProc"?"开始任务":"结束任务"));
    if(Proc.ProcType == "NormalProc" || Proc.ProcType == "EndProc")
      if(!this.hasPriorProc(Proc.ID)) ErrMsg.push("[" + Proc.Text + "] - " + PType + "必须有输入路径");
    if(Proc.ProcType == "NormalProc" || Proc.ProcType == "BeginProc")
      if(!this.hasNextProc(Proc.ID)) ErrMsg.push("[" + Proc.Text + "] - " + PType + "必须有输出路径");
  }
  return ErrMsg.join("\n") + WarnMsg.join("\n");
}

TTopFlow.prototype.loadFromDB = function(AFileName)
{
  this.clear();
  this.FileName = AFileName;
  var band  =   document.UnitItem.getBandByItemName("流程定义");
  if (!band) 
  {
    alert('流程载入失败！');
    this.createNew("");
    return false;
  }
  var rowIndex = 0;
  if(AFileName)
  {
    for (var i = 0;i < band.RecordCount();i++) 
        if(band.getFldStrValue("名称",i)==AFileName){rowIndex = i;break;}    
  }
  band.setCurrentRow(rowIndex);
  this.ID       = band.getFldStrValue("编号");
  this.Text     = band.getFldStrValue("标题");
  this.Password = band.getFldStrValue("password");
  this.Unit     = band.getFldStrValue("单位名称");
  this.Dept     = band.getFldStrValue("部门名称");
  this.Date     = band.getFldStrValue("创建日期");
  this.Man      = band.getFldStrValue("创建者");
  this.Item      = band.getFldStrValue("查阅项目");
  this.Memo     = band.getFldStrValue("说明");

  var bandp=document.UnitItem.getBandByItemName("节点定义");
  var id, oNode, Prop;
  for (i = 0;i < bandp.RecordCount();i++) 
  {
    id = bandp.getFldStrValue("编码",i);
    oNode = new TProc(this,id);
    oNode.NodeName       = bandp.getFldStrValue("名称",i);
    oNode.Text           = bandp.getFldStrValue("text",i);
    oNode.OTitle         = bandp.getFldStrValue("意见栏标题",i);
    oNode.appenditem     = bandp.getFldStrValue("执行项目",i);
    oNode.isOpinion      = bandp.getFldStrValue("有意见",i);

    oNode.ProcType  = bandp.getFldStrValue("procType",i);

	oNode.actFlag   = GetactFlag(bandp.getFldStrValue("类型",i));
	oNode.waittime  = bandp.getFldStrValue("时限",i);
	
	var str = bandp.getFldStrValue("流程关卡",i);
	if(str=="true") oNode.isSltTrans = "1";
	else oNode.isSltTrans = "0";

	var str = bandp.getFldStrValue("责任人节点",i);
	if(str=="true") oNode.isJbrNode = "1";
	else oNode.isJbrNode = "0";
	
	oNode.isSameCredit  = bandp.getFldStrValue("isSameCredit",i);
    oNode.LimitNode     = bandp.getFldStrValue("关卡节点",i);
    oNode.SuppleMentNode= bandp.getFldStrValue("补审对象",i);
    
    oNode.ShapeType     = bandp.getFldStrValue("shapetype",i);
    oNode.Width         = bandp.getFldStrValue("width",i);
    oNode.Height        = bandp.getFldStrValue("height",i);
    oNode.X             = bandp.getFldStrValue("x",i);
    oNode.Y             = bandp.getFldStrValue("y",i);
    oNode.TextWeight    = bandp.getFldStrValue("textWeight",i);
    oNode.StrokeWeight  = bandp.getFldStrValue("strokeWeight",i);
    oNode.zIndex        = bandp.getFldStrValue("zIndex",i);
    if(oNode.zIndex =='') oNode.zIndex = this.getMinZIndex() - 1;
    this.addProc(oNode);
    oNode.FlowName      = bandp.getFldStrValue("流程",i);
  }
    
  //Load Step
  var bandz=document.UnitItem.getBandByItemName("流程流转");
  for (i = 0;i < bandz.RecordCount();i++)
  {
    id                  = bandz.getFldStrValue("编码",i);
    oNode               = new TStep(this,id);
    oNode.FlowNodeName  = bandz.getFldStrValue("节点",i);
    oNode.Text          = bandz.getFldStrValue("text",i);
    oNode.FromProc      = bandz.getFldStrValue("FromProc",i);
    oNode.ToProc        = bandz.getFldStrValue("ToProc",i);
    oNode.Cond          = bandz.getFldStrValue("进阶状态",i);
	oNode.Cond          = oNode.Cond.replace(/\'/g,'"')
	oNode.NoSpecify     = bandz.getFldStrValue("不分发",i);
	oNode.StepType      = bandz.getFldStrValue("类别",i);

	oNode.Points        = bandz.getFldStrValue("points",i); 
	oNode.fromRelX      = bandz.getFldStrValue("fromRelX",i);
	oNode.fromRelY      = bandz.getFldStrValue("fromRelY",i);
	oNode.toRelX        = bandz.getFldStrValue("toRelX",i);
	oNode.toRelY        = bandz.getFldStrValue("toRelY",i);
    oNode.ShapeType     = bandz.getFldStrValue("shapetype",i);
    oNode.StartArrow    = bandz.getFldStrValue("startArrow",i);
    oNode.EndArrow      = bandz.getFldStrValue("endArrow",i);
    oNode.StrokeWeight  = bandz.getFldStrValue("strokeWeight",i);
    oNode.zIndex        = bandz.getFldStrValue("zIndex",i);
    if(oNode.zIndex =='') oNode.zIndex = this.getMinZIndex() - 1;   
    this.addStep(oNode);
    oNode.FlowName      = bandz.getFldStrValue("流程",i);
  }
  this.Modified = false;
  return true;
}

function GetactFlag(str)
{
    var flagText="";
    switch(str)
    {
        case "起点":
            flagText = "1013";
            break;
        case "终点":
            flagText = "2013";
            break;        
        case "或运算":
            flagText = "0014";
            break;        
        case "与运算":
            flagText = "0015";
            break;
        default:
            flagText = "0013";
    }  
    return flagText;
}

//从XML文件中载入流程图
TTopFlow.prototype.loadFromXML = function(AFileName){
  this.clear();
  this.FileName = AFileName;

  var xmlDoc = new ActiveXObject('MSXML2.DOMDocument');
  xmlDoc.async = false;
  var flag = xmlDoc.load('workflow/data/' + AFileName);
  //var flag = xmlDoc.load('/_CommitSys/_CommitFlow/_createFlowXML.asp?defid='+AFileName);
  if (!flag) {
    alert('文件[' + AFileName + '载入失败！');
    this.createNew("");
    return false;
  }
  var xmlRoot = xmlDoc.documentElement;
  this.Text = xmlRoot.getAttribute("text");
  this.Password = xmlRoot.getAttribute("password");
  this.ID = xmlRoot.getAttribute("id");
  this.FormID = xmlRoot.getAttribute("formid");
  //Load Proc
  var Procs = xmlRoot.getElementsByTagName("Procs").item(0);       
  var id, oNode, Prop;
  for (i = 0;i < Procs.childNodes.length;i++) {
    var Proc = Procs.childNodes.item(i);
    Prop = Proc.getElementsByTagName("BaseProperties").item(0);
    id = Prop.getAttribute("id");
    oNode = new TProc(this,id);
    oNode.Text = Prop.getAttribute("text");
    oNode.ProcType = Prop.getAttribute("procType");

	//新增
	oNode.actFlag = Prop.getAttribute("actFlag");
	oNode.waittime = Prop.getAttribute("waittime");
	oNode.isSltTrans = Prop.getAttribute("isSltTrans");
	oNode.isJbrNode = Prop.getAttribute("责任人节点");
	oNode.isSameCredit = Prop.getAttribute("isSameCredit");
    
    Prop = Proc.getElementsByTagName("VMLProperties").item(0);
    oNode.ShapeType = Prop.getAttribute("shapetype");
    oNode.Width = Prop.getAttribute("width");
    oNode.Height = Prop.getAttribute("height");
    oNode.X = Prop.getAttribute("x");
    oNode.Y = Prop.getAttribute("y");
    oNode.TextWeight = Prop.getAttribute("textWeight");
    oNode.StrokeWeight = Prop.getAttribute("strokeWeight");
    oNode.zIndex = Prop.getAttribute("zIndex");
    if(oNode.zIndex =='') oNode.zIndex = this.getMinZIndex() - 1;
    this.addProc(oNode);
  }
  //Load Step
  var Steps = xmlRoot.getElementsByTagName("Steps").item(0);
  for (i = 0;i < Steps.childNodes.length;i++){
    var Step = Steps.childNodes.item(i);
    Prop = Step.getElementsByTagName("BaseProperties").item(0);
    id = Prop.getAttribute("id");
    oNode = new TStep(this,id);
    oNode.Text = Prop.getAttribute("text");
    oNode.FromProc = Prop.getAttribute("from");
    oNode.ToProc = Prop.getAttribute("to");
    oNode.Cond = Prop.getAttribute("cond");
	oNode.Cond = oNode.Cond.replace(/\'/g,'"')
	

    Prop = Step.getElementsByTagName("VMLProperties").item(0);
	oNode.Points = Prop.getAttribute("points"); 
	oNode.fromRelX = Prop.getAttribute("fromRelX");
	oNode.fromRelY = Prop.getAttribute("fromRelY");
	oNode.toRelX = Prop.getAttribute("toRelX");
	oNode.toRelY = Prop.getAttribute("toRelY");
    oNode.ShapeType = Prop.getAttribute("shapetype");
    oNode.StartArrow = Prop.getAttribute("startArrow");
    oNode.EndArrow = Prop.getAttribute("endArrow");
    oNode.StrokeWeight = Prop.getAttribute("strokeWeight");
    oNode.zIndex = Prop.getAttribute("zIndex");
    if(oNode.zIndex =='') oNode.zIndex = this.getMinZIndex() - 1;   
    this.addStep(oNode);
  }
  this.Modified = false;
  return true;
}

//将流程图保存至服务器上的XML文件中
TTopFlow.prototype.SaveToXML = function(AUrl){
  var xmlDoc = new ActiveXObject('MSXML2.DOMDocument');
  xmlDoc.async = false;
  xmlDoc.loadXML('<?xml version="1.0" encoding="GBK"?><TopFlow/>');
  var xmlRoot = xmlDoc.documentElement;
  var xmlNodeGrp, xmlNode, xmlNode2;
  xmlRoot.setAttribute("id", this.ID);
  xmlRoot.setAttribute("formid", this.FormID);//新增
  xmlRoot.setAttribute("filename", this.FileName);
  xmlRoot.setAttribute("text", this.Text);
  xmlRoot.setAttribute("password", this.Password);
  
  //Save Proc
  var xmlNodeGrp = xmlDoc.createNode(1,"Procs",""); 
  xmlRoot.appendChild(xmlNodeGrp);
  for(var i = 0; i < this.Procs.length; i++){
    Proc = this.Procs[i];
    xmlNode = xmlDoc.createNode(1, "Proc", "");
    xmlNode2 = xmlDoc.createNode(1, "BaseProperties", "");
    xmlNode2.setAttribute("id", Proc.ID);
    xmlNode2.setAttribute("text", Proc.Text);
    xmlNode2.setAttribute("procType", Proc.ProcType);

	xmlNode2.setAttribute("actFlag", Proc.actFlag);
	xmlNode2.setAttribute("waittime", Proc.waittime);
	xmlNode2.setAttribute("isSltTrans", Proc.isSltTrans);
	xmlNode2.setAttribute("isSameCredit", Proc.isSameCredit);

    xmlNode.appendChild(xmlNode2);

    xmlNode2 = xmlDoc.createNode(1, "VMLProperties", "");
    xmlNode2.setAttribute("shapetype", Proc.ShapeType);
    xmlNode2.setAttribute("width", Proc.Width);
    xmlNode2.setAttribute("height", Proc.Height);
    xmlNode2.setAttribute("x", Proc.X);
    xmlNode2.setAttribute("y", Proc.Y);
    xmlNode2.setAttribute("textWeight", Proc.TextWeight);
    xmlNode2.setAttribute("strokeWeight", Proc.StrokeWeight);
    xmlNode2.setAttribute("zIndex", Proc.zIndex);
    xmlNode.appendChild(xmlNode2);

    xmlNodeGrp.appendChild(xmlNode);
  }
  //Save Step
  xmlNodeGrp = xmlDoc.createNode(1,"Steps",""); 
  xmlRoot.appendChild(xmlNodeGrp);
  for(i = 0; i < this.Steps.length; i++){
    Step = this.Steps[i];
    xmlNode = xmlDoc.createNode(1, "Step", "");

    xmlNode2 = xmlDoc.createNode(1, "BaseProperties", "");
    xmlNode2.setAttribute("id", Step.ID);
    xmlNode2.setAttribute("text", Step.Text);
    xmlNode2.setAttribute("from", Step.FromProc);
    xmlNode2.setAttribute("to", Step.ToProc);
    xmlNode2.setAttribute("cond", Step.Cond);
	
    xmlNode.appendChild(xmlNode2);

    xmlNode2 = xmlDoc.createNode(1, "VMLProperties", "");
	xmlNode2.setAttribute("points", Step.Points);
	xmlNode2.setAttribute("fromRelX", Step.fromRelX);
	xmlNode2.setAttribute("fromRelY", Step.fromRelY);
	xmlNode2.setAttribute("toRelX", Step.toRelX);
	xmlNode2.setAttribute("toRelY", Step.toRelY);
    xmlNode2.setAttribute("shapetype", Step.ShapeType);
    xmlNode2.setAttribute("startArrow", Step.StartArrow);
    xmlNode2.setAttribute("endArrow", Step.EndArrow);
    xmlNode2.setAttribute("strokeWeight", Step.StrokeWeight);
    xmlNode2.setAttribute("zIndex", Step.zIndex);
    xmlNode.appendChild(xmlNode2);

    xmlNodeGrp.appendChild(xmlNode);
  }
  var xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlHttp.open("POST", "_saveFlowXML.asp?defid=" + this.ID, false);
  xmlHttp.send(xmlDoc.xml);
  S = xmlHttp.responseText.trim();
  this.Modified = (S != "");
  return S;
}

//根据[任务]的ID获取[任务]对象
TTopFlow.prototype.getProcByID = function(id){
  for(var i = 0; i<this.Procs.length; i++)
    if(this.Procs[i].ID == id) return this.Procs[i];
  return null;
}

//根据[路径]的ID获取[路径]对象
TTopFlow.prototype.getStepByID = function(id){
  for(var i = 0; i<this.Steps.length; i++)
    if(this.Steps[i].ID == id) return this.Steps[i];
  return null;
}

TTopFlow.prototype.getProcAtXY = function(x, y){
  var Proc;
  for(var i = 0; i < this.Procs.length; i++){
    Proc = this.Procs[i];
	if(x >= parseInt(Proc.X) && x <= parseInt(Proc.X) + parseInt(Proc.Width) && y >= parseInt(Proc.Y) && y <= parseInt(Proc.Y) + parseInt(Proc.Height)){
      return Proc;
    }
  }
  return null;
}

TTopFlow.prototype.IDExists = function(id){
  var obj = _FLOW.getProcByID(id);
  if(obj != null) return true;
  var obj = _FLOW.getStepByID(id);
  return (obj != null);
}

TTopFlow.prototype.StepPathExists = function(FromProc, ToProc){
  var Step;
  for(var i = 0; i< this.Steps.length; i++){
    Step = this.Steps[i];
    if(Step.FromProc == FromProc && Step.ToProc == ToProc) return Step;
  }
  return null;
}

//根据[任务]的ID删除[任务]对象
TTopFlow.prototype.deleteProcByID = function(id)
{
  this.Modified = true;
  for(var i = 0; i< this.Procs.length; i++)
    if(this.Procs[i].ID == id)
    {
      this.Procs.splice(i,1);
      deleteDateProcByID("节点定义",id);
    }
  //删除与些Proc关联的Step
  for(i = this.Steps.length - 1; i >= 0 ; i--)
  {
    if(this.Steps[i].FromProc == id || this.Steps[i].ToProc == id)
    {
        deleteDateProcByID("流程流转",this.Steps[i].ID);
        this.Steps.splice(i,1);
    }
  }
}


//根据[路径]的ID删除[路径]对象
TTopFlow.prototype.deleteStepByID = function(id){
  this.Modified = true;
  for(var i = 0; i< this.Steps.length; i++)
    if(this.Steps[i].ID == id)
    {
      deleteDateProcByID("流程流转",this.Steps[i].ID);
      this.Steps.splice(i,1);
    }
}

//获取流程图最顶层的Z轴值
TTopFlow.prototype.getMaxZIndex = function(){
  var m = 0;
  for(var i = 0; i < this.Procs.length; i++)
    m = Math.max(m, this.Procs[i].zIndex);
  for(i = 0; i < this.Steps.length; i++)
    m = Math.max(m, this.Steps[i].zIndex);
  return m;
}

//获取流程图最底层的Z轴值
TTopFlow.prototype.getMinZIndex = function(){
  var m = 0;
  for(var i = 0; i < this.Procs.length; i++)
    m = Math.min(m, this.Procs[i].zIndex);
  for(i = 0; i < this.Steps.length; i++)
    m = Math.min(m, this.Steps[i].zIndex);
  return m;
}

//将一个流程图元素对象移至最上层
TTopFlow.prototype.brintToFront = function(obj){
  this.Modified = true;
  obj.zIndex = this.getMaxZIndex() + 1;
}

//将一个流程图元素对象移至最底层
TTopFlow.prototype.sendToBack = function(obj){
  this.Modified = true;
  obj.zIndex = this.getMinZIndex() - 1;
}

//获取流程图下一个[任务]的缺省ID
//获取ID号，更改为取记录中的最大号

////s.replace(/[^0-9]/ig,"")
//TTopFlow.prototype.getMaxProcID = function()
//{
//  var s = 0;
//  var i, j, u = this.Procs.length;
//  for(i = 0; i<= u; i++)
//  {
//    var smax = this.Procs[i].ID.replace(/[^0-9]/ig,"");
//    if(smax=="") smax="0";
//    smax = parseInt(smax) + i;
//    s = smax;
//    for(j = 0; j < u; j++)
//    {
//        smax = this.Procs[j].ID.replace(/[^0-9]/ig,"");
//        if(smax=="") smax="0";
//        smax = parseInt(smax) 
//        if(smax == s) break;
//    }
//    if(j == u) break;
//  }
//  return s;
//}

TTopFlow.prototype.getMaxProcID = function()
{   
    if(this.Procs.length==0) return "N001";
    var smax = this.Procs[0].ID.replace(/[^0-9]/ig,"");
    if(smax=="") smax="0"; 
    var max = parseInt(smax,10);
    for(var i=0; i < this.Procs.length; i++)
    {
        smax = this.Procs[i].ID.replace(/[^0-9]/ig,"");
        if(smax=="") smax="0";
        if(max<parseInt(smax,10)) 
        max = parseInt(smax,10);
    }
    max = max + 1;
    return "N0"+max;
}


//TTopFlow.prototype.getMaxProcID = function(){
//  var s = "";
//  var i, j, u = this.Procs.length;
//  for(i = 0; i<= u; i++){
//    s = "proc"+i;
//    for(j = 0; j < u; j++){
//      if(this.Procs[j].ID == s) break;
//    }
//    if(j == u) break;
//  }
//  return s;
//}

//获取流程图下一个[路径]的缺省ID
TTopFlow.prototype.getMaxStepID = function()
{   
    if(this.Steps.length==0) return "C001";
    var smax = this.Steps[0].ID.replace(/[^0-9]/ig,"");
    if(smax=="") smax="0"; 
    var max = parseInt(smax,10);
    for(var i=0; i < this.Steps.length; i++)
    {
        smax = this.Steps[i].ID.replace(/[^0-9]/ig,"");
        if(smax=="") smax="0";
        if(max<parseInt(smax,10)) 
        max = parseInt(smax,10);
    }
    max = max + 1;
    return "C0"+max;
}



//TTopFlow.prototype.getMaxStepID = function(){
//  var s = "";
//  var i, j, u = this.Steps.length;
//  for(i = 0; i<= u; i++){
//    s = "step"+i;
//    for(j = 0; j < u; j++){
//      if(this.Steps[j].ID == s) break;
//    }
//    if(j == u) break;
//  }
//  return s;
//}

//流程图内全部[任务]的字符串化函数
TTopFlow.prototype.ProcString = function(){
  var S = "",i;
  for(i = 0; i< this.Procs.length; i++)
    S += this.Procs[i];
  return S;
}

//流程图内全部[路径]的字符串化函数
TTopFlow.prototype.StepString = function(){
  var S = "",i;
  for(i = 0; i< this.Steps.length; i++)
    S += this.Steps[i];
  return S;
}

//流程图字符串化函数
TTopFlow.prototype.toString = function(){
  return this.ProcString() + this.StepString();
}

//获取[路径]的划线结点路径
TStep.prototype.getPath = function(){
  if(this.Points != null && this.Points !="")return this.Points;
  var fromProc =document.getElementById(this.FromProc), toProc = document.getElementById(this.ToProc);
  
  if (fromProc==null || toProc==null) return '';
  var fromW = parseInt(fromProc.style.width);
  var fromH = parseInt(fromProc.style.height);
  var toW = parseInt(toProc.style.width);
  var toH = parseInt(toProc.style.height);
  var fromX = parseInt(fromProc.style.left);
  var fromY = parseInt(fromProc.style.top);
  var toX = parseInt(toProc.style.left);
  var toY = parseInt(toProc.style.top);
  if(this.FromProc == this.ToProc) 
    return this.getSelfPath(fromX, fromY, fromW, fromH);

  if (ifRepeatProc(fromX,fromY,fromW,fromH,toX,toY,toW,toH)){
    return "";
  }
  else if(this.ShapeType == "PolyLine")
	{
    return this.getLinePath(fromX, fromY, fromW, fromH, toX, toY, toW, toH);}
  else
    return this.Points;
//    return this.getPolyLinePath(fromX, fromY, fromW, fromH, toX, toY, toW, toH);
    
}

//重新获取[路径]的划线结点路径
TStep.prototype.reGetPath = function(){
  var fromProc,toProc;
  if(this.FromProc)
    fromProc =document.getElementById(this.FromProc);
  if(this.toProc)
    toProc = document.getElementById(this.ToProc);
  
  if (fromProc==null || toProc==null) return '';
  var fromW = parseInt(fromProc.style.width);
  var fromH = parseInt(fromProc.style.height);
  var toW = parseInt(toProc.style.width);
  var toH = parseInt(toProc.style.height);
  var fromX = parseInt(fromProc.style.left);
  var fromY = parseInt(fromProc.style.top);
  var toX = parseInt(toProc.style.left);
  var toY = parseInt(toProc.style.top);
  if(this.FromProc == this.ToProc) 
    return this.getSelfPath(fromX, fromY, fromW, fromH);

  if (ifRepeatProc(fromX,fromY,fromW,fromH,toX,toY,toW,toH)){
    return "";
  }
  else if(this.ShapeType == "PolyLine")
	{
    return this.getLinePath(fromX, fromY, fromW, fromH, toX, toY, toW, toH);}
  else
    return this.Points;
//    return this.getPolyLinePath(fromX, fromY, fromW, fromH, toX, toY, toW, toH);
    
}


//获取当[路径]指向自身时的划线结点路径
TStep.prototype.getSelfPath = function(ProcX, ProcY, ProcW, ProcH){
  var constLength = 10;
  point0X = ProcX + ProcW -constLength;
  point0Y = ProcY + ProcH;
  
  point1X = point0X;
  point1Y = point0Y + constLength;
  
  point2X = ProcX + ProcW + constLength;
  point2Y = point1Y;

  point3X = point2X;
  point3Y = point0Y-constLength;

  point4X = ProcX + ProcW;
  point4Y = point3Y;
  return point0X + ',' + point0Y + ' ' + point1X + ',' + point1Y + ' ' + point2X + ',' + point2Y + ' ' + point3X + ',' + point3Y + ' ' + point4X + ',' + point4Y;
}

//获取当[路径]线型为直线时的划线结点路径
TStep.prototype.getLinePath = function(fromProcX, fromProcY, fromProcW, fromProcH, toProcX, toProcY, toProcW, toProcH){

  var fromX, fromY, toX, toY, fromRelX, fromRelY, toRelX, toRelY;
  if(fromProcY + fromProcH < toProcY){;       //FromProc完全在ToProc上方
    if(fromProcX + fromProcW < toProcX){      //FromProc完全在ToProc左方
      fromX = fromProcX + fromProcW;          //取FromProc右下角
      fromY = fromProcY + fromProcH;
      toX = toProcX;                          //取ToProc左上角
      toY = toProcY;
	  fromRelX = 1;
	  fromRelY = 1;
	  toRelX = 0;
	  toRelY = 0;
    }
    else if(fromProcX > toProcX + toProcW){     //FromProc完全在ToProc右方
      fromX = fromProcX;          //取FromProc左下角
      fromY = fromProcY + fromProcH;
      toX = toProcX + toProcW;
      toY = toProcY;
	  fromRelX = 0;
	  fromRelY = 1;
	  toRelX = 1;
	  toRelY = 0;
    }
    else{                                     //取FromProc下中结点
      fromX = fromProcX + parseInt(fromProcW / 2);
      fromY = fromProcY + fromProcH;
      toX = toProcX + parseInt(toProcW / 2);
      toY = toProcY;
	  fromRelX = 0.5;
	  fromRelY = 1;
	  toRelX = 0.5;
	  toRelY = 0;
    }
  }
  else if(fromProcY > toProcY + toProcH){;       //FromProc完全在ToProc下方
    if(fromProcX + fromProcW < toProcX){      //FromProc完全在ToProc左方
      fromX = fromProcX + fromProcW;          //取FromProc右上角
      fromY = fromProcY;
      toX = toProcX;                          //取ToProc左下角
      toY = toProcY + toProcH;
	  fromRelX = 1;
	  fromRelY = 0;
	  toRelX = 0;
	  toRelY = 1;
    }
    else if(fromProcX > toProcX + toProcW){     //FromProc完全在ToProc右方
      fromX = fromProcX;          //取FromProc左上角
      fromY = fromProcY;
      toX = toProcX + toProcW;      //取ToProc右下角
      toY = toProcY + toProcH;
	  fromRelX = 0;
	  fromRelY = 0;
	  toRelX = 1;
	  toRelY = 1;
    }
    else{                                     //取FromProc下中结点
      fromX = fromProcX + parseInt(fromProcW / 2);
      fromY = fromProcY;
      toX = toProcX + parseInt(toProcW / 2);
      toY = toProcY + toProcH;
	  fromRelX = 0.5;
	  fromRelY = 0;
	  toRelX = 0.5;
	  toRelY = 1;
    }
  }
  else if(fromProcX + fromProcW < toProcX){ //FromProc在toProc左方
    fromX = fromProcX + fromProcW;
    fromY = fromProcY + parseInt(fromProcH / 2);
    toX = toProcX;
    toY = toProcY + parseInt(toProcH / 2);
	fromRelX = 1;
	fromRelY = 0.5;
	toRelX = 0;
	toRelY = 0.5;
  }
  else{ //在右方
    fromX = fromProcX;
    fromY = fromProcY + parseInt(fromProcH / 2);
    toX = toProcX + toProcW;
    toY = toProcY + parseInt(toProcH / 2);
	fromRelX = 0;
	fromRelY = 0.5;
	toRelX = 1;
	toRelY = 0.5;
  }
 
  this.fromRelX = fromRelX;
  this.fromRelY = fromRelY;
  this.toRelX = toRelX;
  this.toRelY = toRelY;
  this.Points = fromX/4*3 + 'pt,' + fromY/4*3 + 'pt,' + toX/4*3 + 'pt,' + toY/4*3 + 'pt';
  return this.Points;

}

//获取当[路径]线型为折线线时的划线结点路径
TStep.prototype.getPolyLinePath = function(fromProcX, fromProcY, fromProcW, fromProcH, toProcX, toProcY, toProcW, toProcH){
  //fromProc Center X,Y
  var fromCenterX = fromProcX + parseInt(fromProcW/2);
  var fromCenterY = fromProcY + parseInt(fromProcH/2);
  //toProc Center X,Y
  var toCenterX = toProcX + parseInt(toProcW/2);
  var toCenterY = toProcY + parseInt(toProcH/2);
  //
  point2X = fromCenterX;
  point2Y = toCenterY;
  if (toCenterX > fromCenterX) {		    //ToProc在FromProc的右边
    absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;  //计算两个对象中心点的距离
    if (parseInt(fromProcH/2)>=absY) {  //ToProc的顶部在FromProc的底部之上
      point1X = fromProcX + fromProcW;  
      point1Y = toCenterY;
      point2X = point1X;
      point2Y = point1Y;
    }
    else{
      point1X = fromCenterX;
      point1Y = fromCenterY<toCenterY?fromProcY+fromProcH:fromProcY;
    }
    absX = toCenterX-fromCenterX;
    if (parseInt(fromProcW/2)>=absX) {
      point3X = fromCenterX;
      point3Y = fromCenterY<toCenterY?toProcY:toProcY+toProcH;
      point2X = point3X;
      point2Y = point3Y;
    }
    else{
      point3X = toProcX;
      point3Y = toCenterY;
    }		   
  }
  if (toCenterX < fromCenterX) {
    absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;
    if (parseInt(fromProcH/2)>=absY) {
      point1X = fromProcX;
      point1Y = toCenterY;
      point2X = point1X;
      point2Y = point1Y;
    }else{
      point1X = fromCenterX;
      point1Y = fromCenterY<toCenterY?fromProcY+fromProcH:fromProcY;
    }
    absX = fromCenterX-toCenterX;
    if (parseInt(fromProcW/2)>=absX) {
      point3X = fromCenterX;
      point3Y = fromCenterY<toCenterY?toProcY:toProcY+toProcH;
      point2X = point3X;
      point2Y = point3Y;
    }
    else{
      point3X = toProcX + toProcW;
      point3Y = toCenterY;
    }		   
    }
    if (toCenterX == fromCenterX) {
      point1X = fromCenterX;
      point1Y = fromCenterY>toCenterY?fromProcY:fromProcY+fromProcH;
      point3X = fromCenterX;
      point3Y = fromCenterY>toCenterY?toProcY+toProcH:toProcY;
      point2X = point3X;point2Y = point3Y;
    }
    if (toCenterY == fromCenterY) {
      point1X = fromCenterX>toCenterX?fromProcX:fromProcX+fromProcW;
      point1Y = fromCenterY;
      point3Y = fromCenterY;
      point3X = fromCenterX>toCenterX?toProcX+toProcW:toProcX;
      point2X = point3X;point2Y = point3Y;
    }
  return point1X+','+point1Y+' '+point2X+','+point2Y+' '+point3X+','+point3Y;
}

//判断两个[任务]的位置是否有重叠
function ifRepeatProc(fromX,fromY,fromW,fromH,toX,toY,toW,toH){
  return (fromX + fromW >= toX) && (fromY + fromH >= toY) && (toX + toW >= fromX) && (toY + toH >= fromY);
}
