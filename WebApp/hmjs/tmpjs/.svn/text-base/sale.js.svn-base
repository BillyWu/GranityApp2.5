var elems2 = ["待办件","已完成"];
var elemsevent2 = ["showbill(0)","showbill(2)"];   
var elems3 = ["在线库存","VIP销售统计","客户退换货统计","日销售统计","销售汇总统计","商品营销统计报表...","营业员业绩分析","商品综合查询"];
var elemsevent3 = ["showchart()","","","","","","","","",""];  
var mband,sband;
function initWin(){InitView();initBoard0();$loading("none")}
function openPro(winid){secBoard(1);}
function InitView()
{
    ueToolbar("tbdiv",elems1,elemsevent1);
    ueLabel("lbldiv1",elems2,elemsevent2);   
    ueLabel("lbldiv2",elems3,elemsevent3,1);
    $("dtstart").value=mfirstdate();
    $("dtend").value=new Date().formate("yyyy-MM-dd");      
    if($("fSearchText")) $("fSearchText").name = SearchFields;
}     
function changeBoard(n) 
{
    secBoard(n,"mainTable");
    switch(n)
    {
        case 1: if(mband.RecordCount()==0) break;try{initbars();$("txtbarlocate").focus();}catch(ex){break;}break;
    }
    if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"节点","S","","D");
}
//对于特定工作流操作,可以使用一体化页面方式
function ue_addbill()
{
    if($U().UnitName=="零售客服中心"){var bn = "零售单";
        var prval  = "零售管理,起草,起草";}
    else if($U().UnitName=="零售退货"){
        var prval  = "零售退货,起草,起草";
        var bn = "零售退货单";
        }

    var str = "您将起草一个新的【"+bn+"】办件，确认吗？";if(!confirm(str)) return;
    ToolUtil.delParam($XP(), "编号", "S", null,"D");
    ToolUtil.delParam($XP(), "单据编号", "S", null,"D");
    var prname = "workflow,startnode,节点";
    var prnames = prname.split(",");       var prvals  = prval.split(",");
    for(var i=0;i<prnames.length;i++)
        ToolUtil.setParamValue($XP(), prnames[i],prvals[i],"string", "S", null,"D");
    QueryEdit();
}

function ue_editbill()
{
    GridUtil.usOnCellRFocusHandle();
    secBoard(1,"tbmain");
    var strItem = $band("nav").Val("执行项目");
    var prname = "编号,单据编号,workflow,startnode,节点";
    var prval  = $band("nav").Val("单据编号")+","+$band("nav").Val("单据编号")+","+$band("nav").Val("审批事项")+",,"+$band("nav").Val("节点");            
    var prnames = prname.split(",");       var prvals  = prval.split(",");
    for(var i=0;i<prnames.length;i++)
        ToolUtil.setParamValue($XP(), prnames[i],prvals[i],"string", "S", null,"D");  
    var readonly = ($band("nav").Val("节点")=="办结")?true:false;
    QueryEdit(readonly);
}
function delitem()
{
ToolUtil.setParamValue($XD(), "单据编号", $band("nav").Val("单据编号"),"string", "B", "delbill","C","D");
ue_cmd("delbill","nav");                
secBoard(0,'tbmain');
initBoard0();
}
function goback()
{
if($band("master").IsModify())
{ 
    if(!confirm("数据已改变,是否退出!")) return; 
    $band("master").Cancel();
    $band("detail").Cancel();
}
secBoard(0,'tbmain');
initBoard0();
}
function showbill(flag)
{
switch(flag)
{
    case 0://待办
        ToolUtil.setParamValue($XP(), "flag","0","string", "S", null,"D");
        $band("nav").ColVisable("办结日期","1");
        $band("nav").ColVisable("删除","0");
        break;
    case 1://未完成
        ToolUtil.setParamValue($XP(), "flag","1","string", "S", null,"D");
        $band("nav").ColVisable("办结日期","1");
        break;
    case 2://已完成
        ToolUtil.setParamValue($XP(), "flag","2","string", "S", null,"D");
        $band("nav").ColVisable("办结日期","0");
        $band("nav").ColVisable("删除","1");
        break;
}
initBoard0()
}
function QueryEdit(readonly)
{
    $("Btn挂单").disabled=readonly;
    $("Btn完成").disabled=readonly;
    lock(readonly,$("mainTable"));
    mband = $band("master");
    mband.XQuery(true);
    if(!readonly && mband.RecordCount()==0) mband.NewRecord();
    sband = $band("detail");
    sband.freecols = "款号";        sband.minwidth = "80px";
    sband.editcol = ",颜色名称,";
    if(readonly){
        sband.XQuery(true);
        sband.StrongGrid=true;
        sband.gridtype = 6;sband.noxml=true;
        var Grid = new XGrid("dvsband",sband,"in",null,1);
        }
    else {
        sband.gridtype = 8;sband.noxml=false;
        sband.barcode='<font face="Wingdings" color="#ff0000">v</font>刷入条码：<INPUT id="txtbar" class="gridbrowseB" onkeydown="selectbyBarCode(\''+ proc +'\')"  style="text-indent:18;background-color: #F9F2E1;background-image:url(\'images/barcode.png\'); background-repeat:no-repeat;WIDTH:200;font-weight: bold" type="text" size="11"/><span id="wmessage" style="color: #FF0000;"></span>';
        sband.StrongGrid=true;
        var Grid = new XGrid("dvsband",sband,"in",null,1);
        sband.XQuery(true);
     }
    oBarbox.options.length=0;
    secBoard(1,"tbmain");
}
function lock(flag,o,txtflag)
{
if(!o) o = document;
var txtArrs = o.getElementsByTagName('input');
for(var i=0; i<txtArrs.length; i++)
{
var txt =  txtArrs[i];
if(txtflag && txt.type == txtflag)
    txt.disabled = flag
else
    txt.disabled = flag
}
}

function secBoard(n,tbname)
{
    var otb = $(tbname);
    if(!otb) return;
    if(n>=otb.tBodies.length) return;
    for(i=0;i<otb.tBodies.length;i++)
      otb.tBodies[i].style.display="none";
    otb.tBodies[n].style.display="block";
    try{$("txtbar").focus();}catch(ex){};
    return n;
}      

function initBoard0()
{
var ob=$band("nav");
$("btnfilter").fireEvent("onclick");
ob.gridtype = 201; ob.freecols = "名称";ob.minwidth = "60px";ob.StrongGrid=true;ob.noxml=true;
var Grid = new XGrid("gridnav",ob,"in",null,1);  
}
function _selectgoods()
{
var wid="wingoods",gridname="dvgoods",bandname = "slgoods";
var str=strfind(wid,gridname,bandname);
DlgWin(wid,gridname,"商品资料查询",bandname,str);
var oband = $band(bandname);
oband.gridtype = 13;  oband.freecols = "款号";        oband.minwidth = "120px";oband.StrongGrid=true;
var Grid = new XGrid(gridname,oband,"in",true,1,1);
if("function"==typeof(ts_filter))
    ts_filter();
else oband.XQuery();
}
function strfind(winid,gridname,bandname)
{
if(!bandname) bandname="";
var s= '<fieldset style="padding: 5px;;width:98%"><legend>查询：</legend>'
+'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
+'        <td width="60" align="right">款号:</td><td width="100">'
+'        <input id=\"款号\" name=\"款号\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
+'        <td width="60" align="right">颜色:</td><td width="80">'
+'        <INPUT name="dbo.fun_getPY(颜色名称);颜色名称;dbo.fun_getPY(款号);款号" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
+'        <td width="60" align="center"><img border="0" style="cursor:hand" src="Images/tb16.gif" onclick=ue_tfilter("'+bandname+'") onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
+'        <td width="90" align="center">【<a href="#" onclick=oklocate("'+winid+'","'+gridname+'","'+bandname+'","无此产品！")>确定</a>】</td>'   
+'    </tr></table></fieldset>';
var s1 = '<br /><div style="width:98%;height:99%;" id="'+gridname+'"></div>';
var s2 = '<select id="deptbox" title="双击选入..." size="13" onblur="_onblurbox(this)" name="D1" datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300; position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
return s+s1+s2;
}    
function oklocate(winid,gridname,bandname,hint,keywords)
{
var slgoodband = $band(bandname);
slgoodband.IsImport="1";
sband.exportItem=bandname;
document.importItem="detail";  
$loading();
$U().CheckInSelfParentUnit("import");
ShowHide(winid,"none");
$loading("none");
}
function msgTxm(msg, isalert)
{
if (!isalert) return;
if ($("message")) $("message").innerHTML = '<IMG src="images/warning.png" border="0" style="vertical-align:middle"/>&nbsp;' + msg + "!";
var mediaplay = $("MyMedia");
mediaplay.FileName = "../Error.wav";
mediaplay.Play();
}
 function barTrue(b)
 {
    if(b.length==16) b = b.substring(1,b.length);return b;
 }

function selectbyBarCode(proc)
{
    if (event.keyCode != 13) return;
    var ctrlsrc=event.srcElement;
    ctrlsrc.value = barTrue(ctrlsrc.value);
    ctrlsrc.select();
    if (!ctrlsrc.value || ctrlsrc.value.length!=15)
        return;
    var txmcode=ctrlsrc.value;
    //检查是否重复
    var txmlist = $("oBarbox");
    var re = new RegExp("\\b" + txmcode + "\\b", "ig");
    var strKCS = txmcode.substr(0, 11);
    var countT = 1;
    var ren = new RegExp("\\b" + strKCS + "\\w{4}\\b", "ig");
    for (var i = 0; i < txmlist.options.length; i++)
    {
        var matchs = txmlist.options[i].text.match(ren);
        if(!matchs)continue;
        countT ++;
        if (txmlist.options[i].text.search(re) < 0)
            continue;
        return msgTxm("条码重复", true);
    }
    var sql = "exec " + proc + " '" + ctrlsrc.value + "'";
    var xmldata = ue_ajaxdom(sql);
    var xmlrows = xmldata.selectNodes("//table/tag");
    if (xmlrows.length == 0) return;
    var strKC = txmcode.substr(0, 10);
    var size = ["", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
    size = size[txmcode.substr(10, 1)];
    var ob = $band("detail");
    for (var i = 0, len = ob.RecordCount(); i < len; i++)
    {
        var kc = ob.getFldStrValue("款号颜色条码", i);
        var sT = ob.getFldStrValue("尺码", i);
        if (strKC != kc || sT != size)
            continue;
        ob.setFldStrValue(i, "数量", countT);
        ob.CalXmlLand.Calculate(i);
        if (ob.Grid) ob.Grid.Sum();
        break;
    }
    var mytag = xmlrows[0].text;
    var cols = "款号,颜色名称,尺码".split(",");
    for (var i = 0; i < cols.length; i++)
        txmcode += "    " + ToolUtil.valueTag(mytag, cols[i]);
    var len = txmlist.options.length = txmlist.options.length + 1;
    txmlist.options[len - 1].text = txmcode;
    if (countT > 1) return;
    ob.NewRecord();
    ue_tagvalues(ctrlsrc,ob,xmlrows);
} 
function ue_tagvalues(e,ob,xmlrows)
{
//从tag中取出对应的checkin字段值
var mytag=xmlrows[0].text;
for(var i=0;i<ob.ColNames.length;i++)
{
    var _v = ToolUtil.valueTag(mytag,ob.ColNames[i]);
    if(!_v) continue;
    ob.setFldStrValue(null,ob.ColNames[i],_v);
}
ob.CalXmlLand.Calculate();
if (ob.Grid) ob.Grid.Sum();
}
function _submit()
{
if($band("detail").RecordCount()==0){alert("没有销售数据,请检查!");return;}
if($band("master").Val("单据编号").length<4)
{
    if(ue_save("")) 
        DlgNodes('winnodes','dvnodes','节点选择','gonodes');
}
else
    DlgNodes('winnodes','dvnodes','提交节点选择','gonodes');
}    
function ue_submit()
{
//由对话框取出目的节点,其它等同于ue_save()
GridUtil.usOnCellRFocusHandle();
var xmldoc=$band("master").UnitItem.ParamXmldoc;
var destnode = $band("gonodes").Val("名称");
if(destnode==""){alert("请指定一个目的节点!");return;};
$band("master").setFldStrValue(null,"目的节点",destnode);
ToolUtil.setParamValue($XP(), "下一节点", $band("gonodes").Val("下一节点"),"string", "S", null,"D");
ToolUtil.setParamValue($XP(), "编号", $band("master").Val("单据编号"),"string", "S", null,"D");
ShowHide("winnodes","none");
$band("master").setFldStrValue(null,"单据编号",$band("master").Val("单据编号"))
if($band("gonodes").Val("不分发")!="true" && $band("gonodes").Val("下一节点")!="结束") 
    DlgJbrs('winjbs','dvjbs','经办人选择','jbr');
else{
    if(ue_save("提交成功!"))
    {
        ToolUtil.setParamValue($XD(), "单据编号", $band("master").Val("单据编号"),"string", "B", "calcvip","C","D");           
        ToolUtil.setParamValue($XD(), "卖场", "实体店","string", "B", "calcvip","C","D");           
        for(var i=0;i<$band("detail").RecordCount();i++)
        {
            if($band("detail").getFldStrValue("持卡人",i)=="") continue;
            ToolUtil.setParamValue($XD(), "持卡人", $band("detail").getFldStrValue("持卡人",i),"string", "B", "calcvip","C","D");
            ue_cmd("calcvip",null,null,1);
        }
        secBoard(0,"tbmain");
        initBoard0();
    }
};
clearparams();
}

function clearparams()
{
    ToolUtil.delParam($XD(), "下一节点",  "S", null,"D");
    ToolUtil.delParam($XD(), "编号",  "P", null,"Ts");        
}
function DlgNodes(winid,gridname,title,bandname)
{
var oband = $band(bandname);
oband.XQuery();
if(oband.RecordCount()==0){alert("没有可退回的节点!");return;}            
var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
+'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
DlgWin(winid,gridname,title,bandname,str,500,300);
oband.gridtype = 1;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
var Grid = new XGrid(gridname,oband,"in",null,1,1);
}       
function op_search()
{
var s = txtbarlocate.value;
for(var m=0;m<oBarbox.options.length;m++)
{
    var text = oBarbox.options[m].text;
    var val  = oBarbox.options[m].value;
    if(text.indexOf(s)>-1) {
        oBarbox.options[m].selected=true;
        break;
    }
}
}     
function op_delete(suff)
{
var sl = oBarbox.options.selectedIndex;
sl = sl >= oBarbox.options.length ? oBarbox.options.length - 1 : sl < 0 ? 0 : sl;
if (sl < 0 || !oBarbox.options[sl]) return;
var txmKC = oBarbox.options[sl].text.substr(0, 10);
oBarbox.options.remove(sl);
//更新明细尺码数量
var strSize = txmKC.substr(10, 1);
txmKC = txmKC.substr(0, 10);
if(!suff) suff="";
var size = ["", "XS"+suff, "S"+suff, "M"+suff, "L"+suff, "XL"+suff, "XXL"+suff, "XXXL"+suff, "XXXXL"+suff];
//检查单据内条码信息
var band = $band("detail");
var index = -1;
for (var i = 0, len = band.RecordCount(); i < len; i++)
{
    var kc = band.getFldStrValue("款号颜色条码", i);
    var sT = band.getFldStrValue("尺码", i);
    if (txmKC != kc || sT != size[strSize])
        continue;
    index = i;
    break;
}
if (index < 0) return;
//依据条码文本列表统计同款号颜色尺码数量
var strKCS = txmKC + strSize;
var countT = 0;
var re = new RegExp("\\b" + strKCS + "\\w{4}\\b", "ig");
for (var i = 0; i < oBarbox.options.length; i++)
{
    var matchs = oBarbox.options[i].text.match(re);
    countT += !matchs ? 0 : 1;
}
if (countT > 0)
{
    band.setFldStrValue(index, "数量", countT);
    band.CalXmlLand.Calculate(index);
} else
    band.DeleteRecord(index);
if (band.Grid) band.Grid.Sum();

if (sl < oBarbox.options.length)
    oBarbox.options[sl].selected = true;
else if (oBarbox.options.length > 0)
    oBarbox.options[sl - 1].selected = true;
}        
function beforesave()
{
    var t="";var s="";
    for(var i=0;i<$("oBarbox").options.length;i++)
    {
        s=s+","+$("oBarbox").options[i].value;
        t=t+","+$("oBarbox").options[i].text;
    }
    if(t.length>0) t=t.substring(1,t.length);
    t=t.replaceAll("    ","\t")
    if(!$band("bardata").active) $band("bardata").XQuery();
    if($band("bardata").RecordCount()==0) $band("bardata").NewRecord();
    $band("bardata").setFldStrValue(null,"条码",t);
    //$band("bardata").setFldStrValue(null,"标题",t);
    return true;
}
function initbars()
{
    if(oBarbox.options.length>0) return;
    var ob = $band("bardata");
    ob.XQuery();
    var s = ob.getFldStrValue("条码");
    s=s.replaceAll("\t","    ")
    bars = s.split(",");
    for(var m=0;m<bars.length;m++)
    {
        var text = bars[m];
        var val  = bars[m];
        var opt   = new Option(text,val);
        oBarbox.add(opt);                
    }            
}         
    function AddDays(sdt,edt,i){
        DaysToAdd=i;
        var now=new Date();
          var newdate=new Date();
          var newtimems=newdate.getTime()+(DaysToAdd*24*60*60*1000);
          newdate.setTime(newtimems);
        $(sdt).value=newdate.formate("yyyy-MM-dd");
        $(edt).value=newdate.formate("yyyy-MM-dd");
    }
    function thisweek(){
       var Nowdate=new Date();
       var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
       var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
        $("dtstart").value=WeekFirstDay.formate("yyyy-MM-dd");
        $("dtend").value=WeekLastDay.formate("yyyy-MM-dd");
       }
    function lastweek(){
       var Nowdate=new Date();
       var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()+6)*86400000);
       var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
        $("dtstart").value=WeekFirstDay.formate("yyyy-MM-dd");
        $("dtend").value=WeekLastDay.formate("yyyy-MM-dd");
       }  
    
    function thismonth(){
       var Nowdate=new Date();
       var MonthFirstDay=new Date(Nowdate.getYear(),Nowdate.getMonth(),1);
       var MonthNextFirstDay=new Date(Nowdate.getYear(),Nowdate.getMonth()+1,1);
       var MonthLastDay=new Date(MonthNextFirstDay-86400000);
        $("dtstart").value=MonthFirstDay.formate("yyyy-MM-dd");
        $("dtend").value=MonthLastDay.formate("yyyy-MM-dd");
       }  
    function lastmonth(){
       var Nowdate=new Date();
       var MonthFirstDay=new Date(Nowdate.getYear(),Nowdate.getMonth()-1,1);
       var MonthNextFirstDay=new Date(Nowdate.getYear(),Nowdate.getMonth(),1);
       var MonthLastDay=new Date(MonthNextFirstDay-86400000);
        $("dtstart").value=MonthFirstDay.formate("yyyy-MM-dd");
        $("dtend").value=MonthLastDay.formate("yyyy-MM-dd");
       }  
      
      function ue_sldate(sdt,edt)
      {
        switch(event.srcElement.value)
        {
            case "今天":
                $(sdt).value=new Date().formate("yyyy-MM-dd");
                $(edt).value=new Date().formate("yyyy-MM-dd");
                break; 
            case "昨天":
                AddDays(sdt,edt,-1);
                break; 
            case "上周":
                lastweek()
                break; 
            case "本周":
                thisweek()
                break; 
            case "上月":
                lastmonth();
                break; 
            default:
                thismonth();
        }
      }
