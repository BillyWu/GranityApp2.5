    //document.oncontextmenu=new Function("event.returnValue=false;"); //��ֹ�Ҽ�����,�����Ҽ������κη�Ӧ
    //document.onselectstart=new Function("event.returnValue=false;"); //��ֹѡ��,Ҳ�����޷�����*/
      window.onload=WinLoadUtil.MDTPLoad;
      var gband;
      var sband;
      var sizeband;
      var BarHtml="";
      var elems1 = ["ҩƷ����","GSP����","��������","��������","��������","����"];
      var elemsevent1 = ["secBoard(0)","secBoard(1)","secBoard(2)","secBoard(3)","secBoard(4)","ms_close()"];     
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
        $loading("none");
      }
      function xSearch()
      {
         ToolUtil.setParamValue($XD(), "����", event.srcElement.innerText, "", "P", gband.ItemName, "C","M");
         fSearch('goods',"");
      }
    function InitView()
    {
        ueToolbar("tbdiv",elems1,elemsevent1);
        ueLabel("lbldiv1",elems2,elemsevent2);
        ueLabel("lbldiv2",elems3,elemsevent3,1);   
        $("fSearchText").name = SearchFields;
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
    }
    //�����ɫ
    function _chkcolor()
    {
            var xmldata = ue_ajaxdom("exec dbo.FD_�����ɫ '"+ $band("detail").Val("��ɫ")+"'");
            if(!xmldata || !xmldata.selectSingleNode("//table/cnt") || xmldata.selectSingleNode("//table/cnt").text==0)
            {
                $band("detail").setFldStrValue(null,"��ɫ","");
                return false;
            }
            return true;
    }
    function openPro(winid)
    {
        var inputctrl=event.srcElement;
        //���õ�ǰ�е�ǰ��Ԫ��
        var tdcol=inputctrl.parentElement;
        var trcur=tdcol.parentElement;
        var str=strfind(winid,null,null);
        var t = "ҩƷ��ϸ���ϣ����������ڣ�"+"<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>" +"/ �������ڣ�<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>����"
        DlgWin("windetail","griddetail",t,"goods",str);
        gband.minwidth=120;
        YPanel("goods","dvCustTab",null,1,null,200);
    }
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
            <table border="0" cellpadding="0" style="border-collapse: collapse;width:100%;height:100%" align=center ><tr>\
            <td align="right" width="70">ҩƷ���ƣ�</td><td width="200">\
            <input datasrc="#��Ʒ����Tab" datafld="ҩƷ����" class="xlandinput" style="WIDTH: 90%;" /><font face="Wingdings" color="#ff0000">v</font></td>\
            <td align="right" width="40">��ţ�</td><td width="100">\
            <input datasrc="#��Ʒ����Tab" datafld="ҩƷ���" class="xlandinput" style="width:80%;" type="text"  /><font face="Wingdings" color="#ff0000">v</font></td>\
            <td align="right" width="40">ʧЧ��</td><td width="40">\
            <input datasrc="#��Ʒ����Tab" datafld="ʧЧ" class="xlandradio" type="checkbox" /></td>\
            <td align="right">��<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">����</a>����<a class="linkbtn_0" href="#" target="_self" onclick="_btnOK()">�ر�</a>��</td>\
            </tr></table></fieldset>\
            <div style="width:99%;height:90%">\
            <fieldset style="padding: 3px;height:95%;width:100%"><legend><font face="΢���ź�">��ϸ���ϣ�</font></legend>\
            <div id="dvCustTab" class="tablescroll" style="height:99%;text-align:left"></div>\
            </fieldset>\
            </div>';
        return s;
    }
    
    function _btnOK()
    {
        ShowHide("windetail","none");
    }
    
      
		var sSearchKey = "��Ʒ��ѯ...";
		/**
		 * ���ؼ���
		 * @param {object}o form��
		 * @return {bool}�����Ƿ�ͨ����֤
		 */
		function fSearchCheck(o){
			var s = o["keyword"].value.trim();
			if(!s || s == sSearchKey){
				try{
					fShowError("�����������ؼ���");
					o["keyword"].focus();
				}catch(e){}
				return false;
			}
			return true;
		}
		/**
		 * �����۽�
		 * @param {object}o ��������
		 * @return {void}
		 */
		function fSearchFocus(o){
			o.className='IptOnF fRi'
			if(o.value.trim() == sSearchKey){
				o.value = "";
			}
		}
		/**
		 * �����ʧȥ�۽�
		 * @param {object}o ��������
		 * @return {void}
		 */
		function fSearchBlur(o){
			o.className='Ipt fRi'
			if(o.value.trim() == ""){
				o.value = sSearchKey;
			}
		}

	function us_checkin(oband)
	{   
	    //���obandΪ�գ����ݵ���İ�ť�ϵ�band���ƻ�ȡ��ǰband
	    if(!oband)
	        oband=document.UnitItem.geobByItemName(event.srcElement.band);
	    if(oband.modify){alert("���ڱ༭��...����ȷ�ϣ�");return;}
	    //���¹ؼ�����ʾ����
	    SynBandTitle(oband);
	    oband.setCurrentRow(oband.getRowIndex("ID",event.srcElement.id));
    }    

function secBoard(n) {
    if(n>=mainTable.tBodies.length) return;
    ueToolCurrent(n,"tbdiv");
    for(i=0;i<mainTable.tBodies.length;i++)
      mainTable.tBodies[i].style.display="none";
    mainTable.tBodies[n].style.display="block";
    switch(n)
    {
        case 0:
            if(!gband) return;
            gband.minwidth = "80px";
            gband.gridtype = 0;
            gband.freecols = "ҩƷ����";
            if(!gband.Grid)
                var Grid = new XGrid("dvMasterTab",gband,"in",null,1);
            gband.XQuery(true);
            $loading("none");
            break;
        case 2:
            var ob=$band("attach");
            ob.gridtype = 8;
            ob.freecols = "����";
            ob.minwidth = "40px";
            ob.title = "��Ʒͼ��";
            if(!ob.Grid) var Grid = new XGrid("dvattach",ob,"in",null,1);
            ob.XQuery(true);
            break;
        case 3:
            XDict(oListboxFrom,oListboxFrom,null)
            $("pubkh").innerText="��"+gband.Val("����")+"-"+gband.Val("���")+"��";
            break;        
        case 4:dlgPrint();
            break; 
        case 5:
            $loading();
            var xsmband = $band("xsm");
            xsmband.gridtype = 8;
            xsmband.freecols = "����";
            if(!xsmband.Grid)
                var Grid = new XGrid("dvxsm",xsmband,"in",null,1);
            xsmband.XQuery();
            $loading("none");
            break;        
    }
}

//���������嵥	          
function pubdata()
{
    $loading();
    var psalesband = $band("psales");
    psalesband.gridtype = 9;
    psalesband.title = "��ǰ�ͻ������嵥";
    psalesband.freecols = "�ͻ�����";
    if(!psalesband.Grid)
        var Grid = new XGrid("dvpsales",psalesband,"in",null,1);
    var s = $("oListboxFrom").name +" in("+ getcusts($("oListboxFrom"))+") and ���='"+gband.Val("���")+"'";
	ToolUtil.setParamValue($XD(), "Filter", s, "", "P", psalesband.ItemName, "C","M");
	var iPageSize=ToolUtil.Convert(psalesband.XmlSchema.pagesize,"int");
	if(null==iPageSize || isNaN(iPageSize))
		iPageSize=10;
	ToolUtil.setParamValue($XD(), "FirstRow", 0, "P", "", psalesband.ItemName, "C","M");
	ToolUtil.setParamValue($XD(), "LastRow", iPageSize, "", "P", psalesband.ItemName, "C","M");
    psalesband.setFldSumStrValue("PageIndex",1);
    psalesband.XQuery();
    $loading("none");    
}

function getcusts(olist)
{
    var s="";
    for(var i=0;i<olist.options.length;i++)
    {
        if(!olist.options[i].selected) continue;
        s = s + ",'"+olist.options[i].tag+"'";
    }
    return s.substring(1,s.length);
}
function pubadd()
{
    var psalesband = $band("psales");
    var poptions = $("oListboxFrom").options;
    for(var m=0;m<poptions.length;m++)
    {
        if(!poptions[m].selected) continue;
        var khname = poptions[m].id;    
        if(psalesband.getRowIndex($("oListboxFrom").name,khname)>-1)
        {
            alert("����Ʒ�ѶԸÿͻ�������");return;
        }
        psalesband.NewRecord();
        for(var i=0;i<psalesband.ColNames.length;i++)
        {
            if(psalesband.ColNames[i]==psalesband.keyCol) continue;
            if(psalesband.ColNames[i]==$("oListboxFrom").name) psalesband.setFldStrValue(null,psalesband.ColNames[i],khname);
            else
            psalesband.setFldStrValue(null,psalesband.ColNames[i],gband.Val(psalesband.ColNames[i]));
        }
    }
}
function showcolorvalue()
{
    colorno.innerText=$("colorbox").options[$("colorbox").selectedIndex].text;
    var orgcodedis = gband.Val("��Ʒ���")+" "+$("colorbox").value+" "+trsize($("sizebox").value)+"0001"
    var strbar = gband.Val("��Ʒ���")+$("colorbox").value+trsize($("sizebox").value)+"0001";
    $("divTXM").innerHTML = buildTXM128C(strbar);
    $("divTXMText").innerHTML = orgcodedis;
}
function getsizenorm()
{
    var xmldata = ue_ajaxdom("exec dbo.FD_�������� '"+$("sizebox").value+"','" + gband.getFldStrValue("������")+"'");
    if(!xmldata || !xmldata.selectSingleNode("//table/����")) return;
    $("norm").innerText = xmldata.selectSingleNode("//table/����").text;
    var bt = $band("goods").Val("�������");
    $("norm").innerText = xmldata.selectSingleNode("//table/���").text+"("+ToolUtil.valueTag(bt,xmldata.selectSingleNode("//table/��������").text)+")";
    var orgcodedis = gband.Val("��Ʒ���")+" "+$("colorbox").value+" "+trsize($("sizebox").value)+"0001"
    var strbar = gband.Val("��Ʒ���")+$("colorbox").value+trsize($("sizebox").value)+"0001";
    $("divTXM").innerHTML = buildTXM128C(strbar);
    $("divTXMText").innerHTML = orgcodedis;
}
function dlgPrint()
{
    sband.XQuery(true);
    sband.rows = sband.XmlLandData.XMLDocument.selectNodes("//"+sband.DataItem);
    if(sband.rows.length==0) return;
    $("colorbox").options.length=0;
    for(var i=0;i<sband.rows.length;i++)
    {
        var _cv = sband.rows[i].selectSingleNode("��ɫ").text;
        _cv = _cv.Trim();
        _cv = _cv.replaceAll("��",")");
        _cv = _cv.replaceAll("��","(");
        _cv = _cv.substring(_cv.indexOf("(")+1,_cv.length-1);
        _cv = pad(parseInt(_cv),2);
       $("colorbox").options.add(new Option(sband.rows[i].selectSingleNode("��ɫ").text,_cv));
    }
    var _size="";var _sizev="";
    if(sband.Val("XS")=="true") {_size +=",XS";_sizev +=",1"}
    if(sband.Val("S")=="true") {_size +=",S";_sizev +=",2"}
    if(sband.Val("M")=="true") {_size +=",M";_sizev +=",3"}
    if(sband.Val("L")=="true") {_size +=",L";_sizev +=",4"}
    if(sband.Val("XL")=="true") {_size +=",XL";_sizev +=",5"}
    if(sband.Val("XXL")=="true") {_size +=",XXL";_sizev +=",6"}
    if(sband.Val("XXXL")=="true") {_size +=",XXXL";_sizev +=",7"}
    if(sband.Val("XXXXL")=="true") {_size +=",XXXXL";_sizev +=",8"}
    var ac = _size.split(",");var acv = _sizev.split(",");
    var bt = $band("goods").Val("�������");
    
    $("sizebox").options.length=0;
    for(var i=1;i<ac.length;i++)
       $("sizebox").options.add(new Option(ToolUtil.valueTag(bt,ac[i]),ac[i]));
    
    $("colorbox").fireEvent("onChange");
    $("sizebox").fireEvent("onChange");
    var _cv =$("colorbox").options[$("colorbox").selectedIndex].text;
    _cv = _cv.Trim();
    _cv = _cv.replaceAll("��",")");
    _cv = _cv.replaceAll("��","(");
    _cv = _cv.substring(0,_cv.indexOf("("));
    colorno.innerText=_cv;
    
    $("money").innerText = gband.Val("���ۼ۸�").formate("��,####.00");
    var strbar = gband.Val("��Ʒ���")+$("colorbox").value+trsize($("sizebox").value)+"0001";
    var orgcodedis = gband.Val("��Ʒ���")+" "+$("colorbox").value+" "+trsize($("sizebox").value)+"0001"
    $("divTXM").innerHTML = buildTXM128C(strbar);
    $("divTXMText").innerHTML = orgcodedis;
}

function trsize(text)
{
    switch(text)
    {
        case "XS":return "1";
        case "S":return "2";
        case "M":return "3";
        case "L":return "4";
        case "XL":return "5";
        case "XXL":return "6";
        case "XXXL":return "7";
        case "XXXXL":return "8";
    }
}

function tm_print()
{
    var strbars = [];
    if($("fixbar").checked && $("inbar").value!="")
    {
        var strbar = $("inbar").value;
        $("divTXM").innerHTML = buildTXM128C(strbar.trim(),$("barh").value);
        $("divTXMText").innerHTML = $("inbar").value;
        strbars.push($("divTXMText").outerHTML+$("divTXM").outerHTML+$("divTXMText").outerHTML);
    }
    else
    {
        if($("numbox").value==""){alert("������Ҫ��ӡ������!");$("numbox").focus();return;};

        //ajaxȡ����ǰ������, i=imax
        var orgcodedis = gband.Val("��Ʒ���")+" "+$("colorbox").value+" "+trsize($("sizebox").value)
        var orgcode    = gband.Val("��Ʒ���")+$("colorbox").value+trsize($("sizebox").value) ;
        var xmldata = ue_ajaxdom("exec FE_������ˮ�� '"+orgcode+"',"+$("numbox").value);
        if(!xmldata){alert("��ˮ�Ŵ���!");return;}
        var imax = parseInt(xmldata.selectSingleNode("//��ˮ��").text);
        for(var i=imax;i<parseInt($("numbox").value)+imax;i++)
        {
            var strbar = orgcode + pad(i,4);
            $("divTXM").innerHTML = buildTXM128C(strbar,$("barh").value);
            $("divTXMText").innerHTML = orgcodedis +" "+ pad(i,4);
            if(onlybar.checked) strbars.push($("divTXMText").outerHTML+$("divTXM").outerHTML+$("divTXMText").outerHTML);
            else {
                strbars.push("<p style='margin:5mm'></p>");
                strbars.push($("dp").innerHTML);
            }
        }
    }
    BarHtml = strbars.join("");
    var url=ue_path()+"/webprint.htm";
    var pw = window.open("webprint.htm","��ӡ","alwaysRaised=yes,height=550,width=550,toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no");
    window.setTimeout(_movepw(pw),500);
}
function _movepw(pw)
{return function(){movepw(pw);}}

function movepw(pw)
{
    pw.moveTo((screen.availWidth-550)/2,(screen.availHeight-550)/2-25);
}
function tm_printxsm()
{
    var basecode = gband.Val("���");
   	var result = confirm("������ӡϴˮ����?    ");
    if(!result) return;
    $loading();    
    var sql = "exec FD_��ӡϴˮ�� '" + basecode +"';exec FD_��ӡϴˮ����Ϣ '" + basecode +"'";
    var prn = "ϴˮ��.xml";
    url=ue_path() + "/frmprintc.aspx?prn="+prn+"&sql="+sql+"&prntype=word"+"&datasrc=ϴˮ���ӡ;ϴˮ����Ϣ";
    window.open(url,"","height=100,width=100,left=0,top=0,menu=yes,status=yes,resizable=no,scrollbars=no");        
    $loading("none");
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
function dlgBar(winid)
{
    if(!winid) winid="1";
    var owin = dwobj(winid);
    var str=strbar(winid);
    if(!owin)
    {
        var owin = new Object;
        owin.id     = winid;
        owin.title  = "�������ѯ";
        owin.text   = str;
        var a = new xWin(owin);
    }
    else
    {
        ShowHide(winid,null);
    }
    center(winid);
    ue_stat(false)
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
    function strbar(winid)
    {
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>��ѯ��</legend>'
        +'<table id="tbbarlist" border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
		+'        <td width="100" align="right">Ʒ��/���:</td><td width="120">'
		+'        <input id=\"fdept\" name=\"����;���;dbo.fun_getPY(����)\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
		+'        <td width="60" align="right">������:</td><td width="80">'
		+'        <INPUT name="������" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
		+'        <td width="60" align="right">���:</td><td width="70">'
		+'        <INPUT name="���" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
		+'        <td width="60" align="center"><img border="0" src="Images/tb16.gif" onclick="ue_stat()" onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
		+'        <td width="90" align="center">��<a class="linkbtn_0" href="#" target="_self" onclick="ue_stat(true)")>��ӡ</a>��</td>'   
		+'        <td width="90" align="center">��<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\''+winid+'\',\'none\')")>�ر�</a>��</td>'   
	    +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:98%;height:99%;" id="bargrid"></div>';
	    return s+s1;
    }
    
    function selectedAll(obj,blstatus)
    {
        for (var i=0;i<obj.length;i++){
            if(obj.options[i].value=="") continue;
            obj.options[i].selected = blstatus;
        }
    }
    
    function extitle(tags)
    {
        if(!tags){
        var inputctrl=event.srcElement;
        if(!inputctrl) return;
        var tags = inputctrl.tag;}
        for(var i=0;i<sband.Grid.TabTitle.rows[sband.Grid.TabTitle.rows.length-1].cells.length;i++)
        {
            var st = sband.Grid.TabTitle.rows[sband.Grid.TabTitle.rows.length-1].cells[i].colname;
            var _v = ToolUtil.valueTag(tags,st);
            if(!_v || _v=="")continue;
            sband.Grid.TabTitle.rows[sband.Grid.TabTitle.rows.length-1].cells[i].innerText=_v;
        }        
        
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
    function slsizeinfo()
    {
        var wid = "winsize";var gridname="dvsizes";
        var title="��Ʒ������Ʋ�ѯ";
        var bandname = "slsizeinfo";
        if(!wid) wid="1";
        
        var owin = dwobj(wid);
        var str=sizestrfind(wid,gridname,bandname);
        if(!owin)
        {
            var owin = new Object;
            owin.id     = wid;
            owin.title  = title;
            owin.text   = str;
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(wid,null);
        }
        var oband = $band(bandname);
        oband.gridtype = 13;  oband.freecols = "����";        oband.minwidth = "120px"
        var Grid = new XGrid(gridname,oband,"in",true,1,1);
        oband.XQuery();
        center(wid);        
    }
    function _fsizegrp()
    {
        //ue_pfilter("size","(stype like '" +$("fsizegrp").value+ "%')");
        var ob = $band("slsizeinfo");
        var xmldoc=document.UnitItem.ParamXmldoc;
	    ToolUtil.setParamValue(xmldoc, "stype", $("fsizegrp").value, "", "P", item, "C");
        ob.XQuery(true);        
    }
    function sizestrfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 5px;width:98%;height:30px"><legend>��ѯ��</legend>\
        <div style="float:left;text-align:left;width:50%"><input id="fsizegrp" datasourceid="exec FS_�ߴ���Ϣ�������" datatextfield="name" datavaluefield="name" class="tinput" size="1" style="WIDTH: 200;"><input title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo();"/>\
        <button class=txtbtn onclick="_fsizegrp()" ><img border="0" src="Images/find16.png" /></button>\
        </div><div style="float:right;text-align:right;width:40%">\
        ��<a href="#" onclick=sizeoklocate("'+winid+'","'+gridname+'","'+bandname+'","�޴˲�Ʒ��")>ȷ��</a>��\
        </div></fieldset>';
        var s1 = '<br /><div style="width:98%;height:99%;" id="'+gridname+'"></div>';
        return s+s1;
    }      
    function sizeoklocate(winid,gridname,bandname,hint,keywords)
    {
        var ob = $band(bandname);
        ob.IsImport="1";
        $band("size").exportItem=bandname;
        document.importItem="size";  
        $loading();
        $U().CheckInSelfParentUnit("import");
        ShowHide(winid,"none");
        $loading("none");
    }
    