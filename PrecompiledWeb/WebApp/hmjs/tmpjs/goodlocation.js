      var gband;
      var lcolor = 3; //��ɫ�볤��
      var BarHtml="";
      var elems1 = ["ҩƷ����","��ͼ","����","��������","����","����"];
      var elemsevent1 = ["secBoard(0)","openPro()","dlgsplit()","secBoard(1)","ue_save()","ms_close()"];     
      var elems2 = ["ȫ��","����ҩ","�Ǵ���ҩ","��ҩ��Ƭ","��ҩ��","ҽ����е","��ҩƷ(����Ʒ)","ʧЧƷ"];
      var elemsevent2 = ["ue_pfilter('goods')","xSearch('goods')","xSearch('goods')","xSearch('goods')",
      "xSearch('goods')","xSearch('goods')","xSearch('goods')","ue_pfilter('goods','ʧЧ=1')"];
      var elems3 = ["���߿��","���ȱ��ͳ�Ʋ�ѯ","��������ͳ��","�ɹ���¼","�ͻ��˻���ͳ��","ȫ�����ֲ���ѯ","������汨��","������ͳ��","���ۻ���ͳ��","��ƷӪ��ͳ�Ʊ���...","Ʒ�ƹ�Ӧ��ͳ�Ʊ���...","���ʦҵ������","ҵ��Աҵ������","���۵���ѯ","��Ʒ����ͳ�Ʋ�ѯ...","��Ʒ�ۺϲ�ѯ"];
      var elemsevent3 = ["showchart()","","","","","","","","",""];
      
      var SearchFields = "dbo.fun_getPY(��Ӧ��);ҩƷ���;��Ӧ��;����;ҩƷ����;ʧЧ" ;
      function initWin()
      {
        gband=$band("goods");
        InitView();
        secBoard(0);
        gband.editdict=true;
        $loading("none");
      }
    function InitView()
    {
        ueToolbar("tbdiv",elems1,elemsevent1);
        ueLabel("lbldiv1",elems2,elemsevent2);
        ueLabel("lbldiv2",elems3,elemsevent3,1);   
        if($U().Right!="��ɾ��") $("Btn����").style.display="none";
        $("fSearchText").name = SearchFields;
    }      
  function xSearch()
  {
     ToolUtil.setParamValue($XD(), "����", event.srcElement.innerText,"string", "B", gband.ItemName,"C","D");
     fSearch('goods',"");
     ToolUtil.delParam($XD(), "����", "B", gband.ItemName,"C");
  }    
    function ts_Afteradd()
    {
        var ob=GridUtil.FindBand();
        if(ob.ItemName!="goods") return;
        openPro();
    }
    function _loadimg(obj)
    {
        if(obj.clientWidth>60 || obj.clientHeight>60)
        {
            obj.resized=true;
            var scale = obj.clientWidth/obj.clientHeight;
            if(scale>1) 
            {
                obj.style.width=60;
                obj.style.height = 60/scale;
            }
            else
            {
                obj.style.height=60;
                obj.style.width = 60/scale;
            }			            
        }
        if(obj.clientWidth==25 && obj.clientHeight==25 && obj.src.indexOf("Floppy")<0)
        {
            obj.resized=true;
            obj.style.width=60;
            obj.style.height = 60;
            
        }
        if(!$band("goods")) return;
        if(obj.nameProp=="Floppy.gif") 
        {
            obj.style.display="none";
            if($("logo")) 
            {
                $("logo").innerText=$band("goods").Val("Ʒ��"); 
                $("logo").style.display="block"
            }
        }else{
            obj.style.display="block";
            $("logo").style.display="none"
        }
    }
    function dlgsplit()
    {
        GridUtil.usOnCellRFocusHandle();
        var s= '<fieldset style="padding: 2px;width:99%;height:50px;text-align:left"><legend><font face="΢���ź�">��ҩƷ��Ϣ��</font></legend>\
                <span class="span60fn">ҩƷ���룺</span><span datasrc="#��Ʒ����Tab" datafld="���" class="xlandinput" style="width:60px;"></span>\
                <span class="span40fn">Ʒ����</span><span datasrc="#��Ʒ����Tab" datafld="����" class="xlandinput" style="width:170px;" ></span>\
                <span class="span40fn">���</span><span datasrc="#��Ʒ����Tab" datafld="���" class="xlandinput" style="width:65px;" ></span>\
                <span class="span40fn">���ͣ�</span><span datasrc="#��Ʒ����Tab" datafld="��ʽ" class="xlandinput" style="width:40px;" ></span>\
                <span class="span40fn">��λ��</span><span datasrc="#��Ʒ����Tab" datafld="������λ" class="xlandinput" style="width:30px;" ></span>';
        var ssave = '��<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">����</a>��';
        var s0 = '��<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'split\',\'none\')">�ر�</a>��\
                </fieldset>\
            <fieldset style="padding: 2px;height:320;width:99%"><legend><font face="΢���ź�">����ҩƷ��Ϣ��</font>';
        sbtn = '<button id="btnselect" class=txtbtn onclick="tm_selectgoods(\'ҩƷ����ѡ��\',\'slgoods\',\'goods\',\'����\',650,null,null,true)" >�������ҩƷ&nbsp;<img src="images/find16.png" style="vertical-align:middle"/></button>';
        s1 = '</legend><div id="dvsplit" style="width:100%;height:45%"></div>\
        <div style="width:97%;height:40%;text-align:left;padding:5;color: #008000">ҩƷ��β������ۣ��������£�����ҩƷAA�����������У���Ҳ��������������һ��������10��������Ҫ�������ۣ���ô��<br />��һ�����ڡ��������ϡ�=>��ҩƷ���ϡ���ҪΪ�����������룬���磺һ����0001���У���һ����0002������ ��ֻ�ǡ���λ������������λ����ͬ��<br />�ڶ������ڡ��������ϡ�=>��ҩƷ���ϡ���ѡ��0001�� Ȼ�󵥻������㡿��ť���ڵ����ġ�ҩƷ�������á������С�ҩƷ���롱�����롰0002����������������10������̯�ɱ�����������100��������˳���<br />���������ڡ�ҵ�����=>�����㵥�������ڡ�ҵ�����=>�����۳��ⵥ���е��������㡿��ť�򿪣��е㡰���������ڡ�����ҩƷ����Ŀ�����롰0001�����ڡ�������������Ŀ������1��Ȼ�󵥻������ͨ�����Ϳ����ˡ���ʱ����Ϊ��0001����ҩƷ�����������1�У�����Ϊ��0002����ҩƷ�����������10����<br />���Ĳ����ڡ�ҵ�����=>�����۳��ⵥ���У�ѡ�����Ϊ��0002����ҩƷ�������ۣ��������������ۣ��������Ҫ�����С����ۣ���Ҫѡ�����Ϊ0001��ҩƷ�������ۡ�</div>\
        </fieldset>';
        var ob = $band("����");
        if($U().Right!="��ɾ��") {ob.gridtype = 61;s=s+s0+s1;ob.noxml=true;}
        else {s=s+ssave + s0+sbtn+s1;ob.gridtype = 8;}
        DlgWin("split","dvsplit","ҩƷ���㶨��",null,s,730);
        ob.minwidth = "80px";
        
        ob.freecols = "����";ob.StrongGrid=true;
        var Grid = new XGrid("dvsplit",ob,"in",null,1);
        ob.XQuery(true);        
    }
    function tm_selectgoods(title,srcitem,mitem,destitem,w,h,spos,callback)
    {
        var str = strfind1("wingoods","dvgoods", srcitem, destitem,callback,mitem,spos);
        DlgWin("wingoods","dvgoods",title,srcitem,str,w,h)
        var oband = $band(srcitem);
        oband.gridtype = 13;  oband.freecols = "����";        oband.minwidth = "70px";oband.StrongGrid=true;
        oband.noxml=true;
        if("function"==typeof(ts_filter))
            ts_filter();
        else oband.XQuery();
        var Grid = new XGrid("dvgoods",oband,"in",true,1,1);
    }    
    function oklocate(winid, gridname, srcitem, destitem, hint, keywords)
    {
        var ob = $band(srcitem);
        ob.IsImport="1";
        $band(destitem).exportItem=srcitem;
        document.importItem = destitem;
        $loading();
        $U().CheckInSelfParentUnit("import");
        if ("function" == typeof (oklocate.callback))
            oklocate.callback();
        ShowHide(winid,"none");
        $loading("none");
    }    
    function strfind1(winid, gridname, srcitem, destitem,callback,mitem,spos)
    {
        if (!srcitem) srcitem = "";
        var storeinfo = '<td width="60" align="right">��λ:</td><td width="100">\
        <input id=\"��λ\" name=\"��λ\" datasourceid="exec FD_��λ null" datatextfield="name" datavaluefield="name" filter=\"and\" \
        class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"><input title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..." \
        style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/></td>';
        if(srcitem!="slstoregoods" || (spos && $band(mitem).Val(spos)!="")) storeinfo="";
        oklocate.callback = callback;
        var s= '<fieldset style="padding: 5px;;width:99%"><legend>��ѯ��</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        + storeinfo
        +'        <td width="60" align="right">ҩƷ����:</td><td width="100">'
        +'        <input id=\"���\" name=\"ҩƷ����\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
        +'        <td width="60" align="right">Ʒ��:</td><td width="80">'
        +'        <INPUT name="dbo.fun_getPY(����);����" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        + '        <td width="60"><img border="0" style="cursor:hand" src="Images/tb16.gif" onclick=ue_tfilter("' + srcitem + '") onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
        + '        <td width="90" align="right">��<a href="#" onclick=oklocate("' + winid + '","' + gridname + '","' + srcitem + '","' + (!destitem ? "" : destitem) + '","�޴˲�Ʒ��")>ȷ��</a>��</td>'   
        +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:99%;height:88%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="˫��ѡ��..." size="13" onblur="_onblurbox(this)" name="D1" \
        datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300;\
         position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
        return s+s1+s2;
    }
    function openPro()
    {
        GridUtil.usOnCellRFocusHandle();
        var s = strfind("view",null,null);
        title  = "��Ʒ��ϸ���ϣ����������ڣ�"+"<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>" +"/ �������ڣ�<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>����";
        DlgWin("view","dvopp",title,null,s,700,460);
        gband.splitrow = "2px";
        gband.minwidth=150;gband.startpos=0;gband.endpos=16;
        YPanel("goods","dvCustTab",null,1,"@���ۼ۸�=3",null,70);
        gband.minwidth=150;gband.startpos=16;gband.endpos=23;
        YPanel("goods","dvSubTab",null,1,null,null,70);
    }
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        if($U().Right!="��ɾ��")
            var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="60">ҩƷ���ƣ�</td><td width="235">\
                <span datasrc="#��Ʒ����Tab" datafld="����" class="xlandinput" style="WIDTH: 90%;" ></span><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="60">ҩƷ���룺</td><td width="100">\
                <span datasrc="#��Ʒ����Tab" datafld="���" class="xlandinput" style="width:80%;" ></span><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="40">ʧЧ��</td><td width="20">\
                <input datasrc="#��Ʒ����Tab" datafld="ʧЧ" disabled class="xlandradio" type="checkbox" /></td>\
                <td align="right">��<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'view\',\'none\')">�ر�</a>��</td>\
                </tr></table></fieldset>';
        else
            var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="60">ҩƷ���ƣ�</td><td width="235">\
                <input datasrc="#��Ʒ����Tab" datafld="����" class="xlandinput" style="WIDTH: 90%;" /><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="60">ҩƷ���룺</td><td width="100">\
                <input datasrc="#��Ʒ����Tab" datafld="���" class="xlandinput" style="width:80%;" type="text"  /><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="40">ʧЧ��</td><td width="20">\
                <input datasrc="#��Ʒ����Tab" datafld="ʧЧ" class="xlandradio" type="checkbox" /></td>\
                <td align="right">��<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">����</a>����<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'view\',\'none\')">�ر�</a>��</td>\
                </tr></table></fieldset>';                    
        var s1='<div style="width:99%;height:390px">\
            <fieldset style="float:left;padding: 3px;height:220;width:69%"><legend><font face="΢���ź�">��ϸ���ϣ�</font></legend>\
            <div id="dvCustTab" style="height:198px;width:100%;text-align:left"></div>\
            </fieldset>\
            <fieldset style="float:right;padding: 3px;height:220;width:29%"><legend><font face="΢���ź�">ͼ�꣺</font>';
        if($U().Right=="��ɾ��")
            var s2 = '��<a class="linkbtn_0" href="#" target="_self" onclick="upload(\'goods\',\'��ƷͼƬ\')">�ϴ�</a>��';
        else var s2 ="";
        var s3='</legend>\
            <table border="0" width="98%" height="198"><tr><td bgcolor="#F6F6F6" align=center valign=center>\
            <IMG src="images//Floppy.gif" id="goods:��ƷͼƬ" class="xlandImg" alt="�����ԭͼ..." /></td></tr></table>\
            </fieldset>\
            <fieldset style="float:left;padding: 3px;height:85;width:69%"><legend><font face="΢���ź�">GSP���ԣ�</font></legend><div id="dvSubTab" style="width:100%;height:95%;text-align:left"></div></fieldset>\
            <fieldset style="float:right;padding: 3px;height:159;width:29%"><legend><font face="΢���ź�">�������Σ�</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#��Ʒ����Tab" datafld="����" style="width:98%;height:98%" ></textarea></fieldset>\
            <fieldset style="float:left;padding: 3px;height:50;width:69%"><legend><font face="΢���ź�">�������ԣ�</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#��Ʒ����Tab" datafld="ϴˮ����Ϣ" style="width:98%;height:96%" ></textarea></fieldset>\
            </div>';
        return s+s1+s2+s3;
    }
    
      
    var sSearchKey = "��Ʒ��ѯ...";
    function secBoard(n) {
    if(n>=mainTable.tBodies.length) return;
    ueToolCurrent(n,"tbdiv");
    for(i=0;i<mainTable.tBodies.length;i++)
      mainTable.tBodies[i].style.display="none";
    mainTable.tBodies[n].style.display="block";
    if(!gband) return;
    gband.XQuery();
    gband.minwidth = "70px";
    gband.gridtype = 0;
    gband.freecols = "����";if($U().Right!="��ɾ��") {gband.noxml=true;gband.gridtype=6};
    if(!gband.Grid)
        var Grid = new XGrid("dvMasterTab",gband,"in",null,1);
    $loading("none");
}
function _movepw(pw)
{return function(){movepw(pw);}}

function movepw(pw)
{
    pw.moveTo((screen.availWidth-550)/2,(screen.availHeight-550)/2-25);
}
//��0����
function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
function ue_stat(isprint)
{
    var dbcols = "����,���,���,��ɫ����,���ۼ۸�,������,��ӡ;����,���,���,��ɫ����,���ۼ۸�,������,��ӡ;,60,60,60,60,80,40";
    var str ="SELECT ����,���,���,��ɫ����,���ۼ۸�,������,case when ��ӡ=1 then '��' else null end ��ӡ FROM dbo.fn_FBarlocation() where (1>0) and (2>0)" 
    $loading();
    var s = ue_tfilter(null,tbbarlist);
    if(!s || s=="") s="";
    else s=" and ("+s+")";
    str += s;
    if(!isprint)
    {
        var xmldata = ue_ajaxdom(str);
        us_GridByAjax("bargrid",xmldata,"table","in",dbcols); 
    }
    else
    {
          var prn = "rptBarRecord.xml";
          url=ue_path() +"/frmprintc.aspx?prn="+prn+"&sql="+str;
          window.open(url,"","height=100,width=100,left=0,top=0,menu=yes,status=yes,resizable=no,scrollbars=no");        
    }
    $loading("none");
}
    function showchart()
    {
        var title="�ͻ����ͷֲ�ͳ��";
        var vname="����";
        var chartstyle="bar";
        var sql="exec chart_�ͻ����ͷֲ�ͳ��";
        DlgChart("winchart",sql,chartstyle,vname,title);
    }
    function _upload()
    {
        GridUtil.usOnCellRFocusHandle();
        var valueRtn=window.showModalDialog("UploadFile.htm",null,"dialogWidth:600px;dialogHeight:300px;center: yes;help:no; resizable:yes;status:no;");
        if(!valueRtn){return;}
        var file = base_name(valueRtn);
        $band("attach").setFldStrValue(null,"�ļ�",file);
        ue_save("");      
        $band("attach").XQuery(true);
        
    }
