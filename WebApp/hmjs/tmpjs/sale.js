var elems2 = ["�����","�����"];
var elemsevent2 = ["showbill(0)","showbill(2)"];   
var elems3 = ["���߿��","VIP����ͳ��","�ͻ��˻���ͳ��","������ͳ��","���ۻ���ͳ��","��ƷӪ��ͳ�Ʊ���...","ӪҵԱҵ������","��Ʒ�ۺϲ�ѯ"];
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
    if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"�ڵ�","S","","D");
}
//�����ض�����������,����ʹ��һ�廯ҳ�淽ʽ
function ue_addbill()
{
    if($U().UnitName=="���ۿͷ�����"){var bn = "���۵�";
        var prval  = "���۹���,���,���";}
    else if($U().UnitName=="�����˻�"){
        var prval  = "�����˻�,���,���";
        var bn = "�����˻���";
        }

    var str = "�������һ���µġ�"+bn+"�������ȷ����";if(!confirm(str)) return;
    ToolUtil.delParam($XP(), "���", "S", null,"D");
    ToolUtil.delParam($XP(), "���ݱ��", "S", null,"D");
    var prname = "workflow,startnode,�ڵ�";
    var prnames = prname.split(",");       var prvals  = prval.split(",");
    for(var i=0;i<prnames.length;i++)
        ToolUtil.setParamValue($XP(), prnames[i],prvals[i],"string", "S", null,"D");
    QueryEdit();
}

function ue_editbill()
{
    GridUtil.usOnCellRFocusHandle();
    secBoard(1,"tbmain");
    var strItem = $band("nav").Val("ִ����Ŀ");
    var prname = "���,���ݱ��,workflow,startnode,�ڵ�";
    var prval  = $band("nav").Val("���ݱ��")+","+$band("nav").Val("���ݱ��")+","+$band("nav").Val("��������")+",,"+$band("nav").Val("�ڵ�");            
    var prnames = prname.split(",");       var prvals  = prval.split(",");
    for(var i=0;i<prnames.length;i++)
        ToolUtil.setParamValue($XP(), prnames[i],prvals[i],"string", "S", null,"D");  
    var readonly = ($band("nav").Val("�ڵ�")=="���")?true:false;
    QueryEdit(readonly);
}
function delitem()
{
ToolUtil.setParamValue($XD(), "���ݱ��", $band("nav").Val("���ݱ��"),"string", "B", "delbill","C","D");
ue_cmd("delbill","nav");                
secBoard(0,'tbmain');
initBoard0();
}
function goback()
{
if($band("master").IsModify())
{ 
    if(!confirm("�����Ѹı�,�Ƿ��˳�!")) return; 
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
    case 0://����
        ToolUtil.setParamValue($XP(), "flag","0","string", "S", null,"D");
        $band("nav").ColVisable("�������","1");
        $band("nav").ColVisable("ɾ��","0");
        break;
    case 1://δ���
        ToolUtil.setParamValue($XP(), "flag","1","string", "S", null,"D");
        $band("nav").ColVisable("�������","1");
        break;
    case 2://�����
        ToolUtil.setParamValue($XP(), "flag","2","string", "S", null,"D");
        $band("nav").ColVisable("�������","0");
        $band("nav").ColVisable("ɾ��","1");
        break;
}
initBoard0()
}
function QueryEdit(readonly)
{
    $("Btn�ҵ�").disabled=readonly;
    $("Btn���").disabled=readonly;
    lock(readonly,$("mainTable"));
    mband = $band("master");
    mband.XQuery(true);
    if(!readonly && mband.RecordCount()==0) mband.NewRecord();
    sband = $band("detail");
    sband.freecols = "���";        sband.minwidth = "80px";
    sband.editcol = ",��ɫ����,";
    if(readonly){
        sband.XQuery(true);
        sband.StrongGrid=true;
        sband.gridtype = 6;sband.noxml=true;
        var Grid = new XGrid("dvsband",sband,"in",null,1);
        }
    else {
        sband.gridtype = 8;sband.noxml=false;
        sband.barcode='<font face="Wingdings" color="#ff0000">v</font>ˢ�����룺<INPUT id="txtbar" class="gridbrowseB" onkeydown="selectbyBarCode(\''+ proc +'\')"  style="text-indent:18;background-color: #F9F2E1;background-image:url(\'images/barcode.png\'); background-repeat:no-repeat;WIDTH:200;font-weight: bold" type="text" size="11"/><span id="wmessage" style="color: #FF0000;"></span>';
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
ob.gridtype = 201; ob.freecols = "����";ob.minwidth = "60px";ob.StrongGrid=true;ob.noxml=true;
var Grid = new XGrid("gridnav",ob,"in",null,1);  
}
function _selectgoods()
{
var wid="wingoods",gridname="dvgoods",bandname = "slgoods";
var str=strfind(wid,gridname,bandname);
DlgWin(wid,gridname,"��Ʒ���ϲ�ѯ",bandname,str);
var oband = $band(bandname);
oband.gridtype = 13;  oband.freecols = "���";        oband.minwidth = "120px";oband.StrongGrid=true;
var Grid = new XGrid(gridname,oband,"in",true,1,1);
if("function"==typeof(ts_filter))
    ts_filter();
else oband.XQuery();
}
function strfind(winid,gridname,bandname)
{
if(!bandname) bandname="";
var s= '<fieldset style="padding: 5px;;width:98%"><legend>��ѯ��</legend>'
+'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
+'        <td width="60" align="right">���:</td><td width="100">'
+'        <input id=\"���\" name=\"���\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
+'        <td width="60" align="right">��ɫ:</td><td width="80">'
+'        <INPUT name="dbo.fun_getPY(��ɫ����);��ɫ����;dbo.fun_getPY(���);���" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
+'        <td width="60" align="center"><img border="0" style="cursor:hand" src="Images/tb16.gif" onclick=ue_tfilter("'+bandname+'") onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
+'        <td width="90" align="center">��<a href="#" onclick=oklocate("'+winid+'","'+gridname+'","'+bandname+'","�޴˲�Ʒ��")>ȷ��</a>��</td>'   
+'    </tr></table></fieldset>';
var s1 = '<br /><div style="width:98%;height:99%;" id="'+gridname+'"></div>';
var s2 = '<select id="deptbox" title="˫��ѡ��..." size="13" onblur="_onblurbox(this)" name="D1" datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300; position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
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
    //����Ƿ��ظ�
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
        return msgTxm("�����ظ�", true);
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
        var kc = ob.getFldStrValue("�����ɫ����", i);
        var sT = ob.getFldStrValue("����", i);
        if (strKC != kc || sT != size)
            continue;
        ob.setFldStrValue(i, "����", countT);
        ob.CalXmlLand.Calculate(i);
        if (ob.Grid) ob.Grid.Sum();
        break;
    }
    var mytag = xmlrows[0].text;
    var cols = "���,��ɫ����,����".split(",");
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
//��tag��ȡ����Ӧ��checkin�ֶ�ֵ
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
if($band("detail").RecordCount()==0){alert("û����������,����!");return;}
if($band("master").Val("���ݱ��").length<4)
{
    if(ue_save("")) 
        DlgNodes('winnodes','dvnodes','�ڵ�ѡ��','gonodes');
}
else
    DlgNodes('winnodes','dvnodes','�ύ�ڵ�ѡ��','gonodes');
}    
function ue_submit()
{
//�ɶԻ���ȡ��Ŀ�Ľڵ�,������ͬ��ue_save()
GridUtil.usOnCellRFocusHandle();
var xmldoc=$band("master").UnitItem.ParamXmldoc;
var destnode = $band("gonodes").Val("����");
if(destnode==""){alert("��ָ��һ��Ŀ�Ľڵ�!");return;};
$band("master").setFldStrValue(null,"Ŀ�Ľڵ�",destnode);
ToolUtil.setParamValue($XP(), "��һ�ڵ�", $band("gonodes").Val("��һ�ڵ�"),"string", "S", null,"D");
ToolUtil.setParamValue($XP(), "���", $band("master").Val("���ݱ��"),"string", "S", null,"D");
ShowHide("winnodes","none");
$band("master").setFldStrValue(null,"���ݱ��",$band("master").Val("���ݱ��"))
if($band("gonodes").Val("���ַ�")!="true" && $band("gonodes").Val("��һ�ڵ�")!="����") 
    DlgJbrs('winjbs','dvjbs','������ѡ��','jbr');
else{
    if(ue_save("�ύ�ɹ�!"))
    {
        ToolUtil.setParamValue($XD(), "���ݱ��", $band("master").Val("���ݱ��"),"string", "B", "calcvip","C","D");           
        ToolUtil.setParamValue($XD(), "����", "ʵ���","string", "B", "calcvip","C","D");           
        for(var i=0;i<$band("detail").RecordCount();i++)
        {
            if($band("detail").getFldStrValue("�ֿ���",i)=="") continue;
            ToolUtil.setParamValue($XD(), "�ֿ���", $band("detail").getFldStrValue("�ֿ���",i),"string", "B", "calcvip","C","D");
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
    ToolUtil.delParam($XD(), "��һ�ڵ�",  "S", null,"D");
    ToolUtil.delParam($XD(), "���",  "P", null,"Ts");        
}
function DlgNodes(winid,gridname,title,bandname)
{
var oband = $band(bandname);
oband.XQuery();
if(oband.RecordCount()==0){alert("û�п��˻صĽڵ�!");return;}            
var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>������ʾ��</legend>'
+'<p>���������б��е�����Ҫ�ύ����һ���������ڣ������ύ��</p></fieldset>';
DlgWin(winid,gridname,title,bandname,str,500,300);
oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
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
//������ϸ��������
var strSize = txmKC.substr(10, 1);
txmKC = txmKC.substr(0, 10);
if(!suff) suff="";
var size = ["", "XS"+suff, "S"+suff, "M"+suff, "L"+suff, "XL"+suff, "XXL"+suff, "XXXL"+suff, "XXXXL"+suff];
//��鵥����������Ϣ
var band = $band("detail");
var index = -1;
for (var i = 0, len = band.RecordCount(); i < len; i++)
{
    var kc = band.getFldStrValue("�����ɫ����", i);
    var sT = band.getFldStrValue("����", i);
    if (txmKC != kc || sT != size[strSize])
        continue;
    index = i;
    break;
}
if (index < 0) return;
//���������ı��б�ͳ��ͬ�����ɫ��������
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
    band.setFldStrValue(index, "����", countT);
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
    $band("bardata").setFldStrValue(null,"����",t);
    //$band("bardata").setFldStrValue(null,"����",t);
    return true;
}
function initbars()
{
    if(oBarbox.options.length>0) return;
    var ob = $band("bardata");
    ob.XQuery();
    var s = ob.getFldStrValue("����");
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
            case "����":
                $(sdt).value=new Date().formate("yyyy-MM-dd");
                $(edt).value=new Date().formate("yyyy-MM-dd");
                break; 
            case "����":
                AddDays(sdt,edt,-1);
                break; 
            case "����":
                lastweek()
                break; 
            case "����":
                thisweek()
                break; 
            case "����":
                lastmonth();
                break; 
            default:
                thismonth();
        }
      }
