    //document.oncontextmenu=new Function("event.returnValue=false;"); //��ֹ�Ҽ�����,�����Ҽ������κη�Ӧ
    //document.onselectstart=new Function("event.returnValue=false;"); //��ֹѡ��,Ҳ�����޷�����*/
      var gband;
      var sband;
      var sizeband;
      var BarHtml="";
      var elems1 = ["��Ʒ����","���","��Ʒͼ��","��ӡ����","��Ӫ��Ϣ","����"];
      var elemsevent1 = ["secBoard(0)","secBoard(1)","secBoard(2)","secBoard(4,3)","secBoard(5,4)","ms_close()"];     
      var elems2 = ["ȫ��","��װ","��װ","��װ","��װ","��Ʒ","��װ","Ůװ","ʧЧƷ"];
      var fe = "$('fSearchText').value=event.srcElement.innerText;$('btnfSearch').fireEvent('onclick')";
      var elemsevent2 = ["ue_pfilter('goods')",fe,fe,fe,fe,fe,fe,fe,"ue_pfilter('goods','ʧЧ=1')"];
      var elems3 = ["���߿��","���ȱ��ͳ�Ʋ�ѯ","��������ͳ��","�ɹ���¼","�ͻ��˻���ͳ��","ȫ�����ֲ���ѯ","������汨��","������ͳ��","���ۻ���ͳ��","��ƷӪ��ͳ�Ʊ���...","Ʒ�ƹ�Ӧ��ͳ�Ʊ���...","���ʦҵ������","ҵ��Աҵ������","���۵���ѯ","��Ʒ����ͳ�Ʋ�ѯ...","��Ʒ�ۺϲ�ѯ"];
      var elemsevent3 = ["showchart()","","","","","","","","",""];
      
      var SearchFields = "dbo.fun_getPY(��Ӧ��);��Ʒ���;��Ӧ��;Ʒ��;����;���;ʧЧ;������" ;
      function initWin()
      {
        gband=$band("goods");gband.Asyn = true; 
        sband=$band("detail");sband.Asyn = true; 
        sizeband=$band("size");sizeband.Asyn = true; 
        InitView();
        secBoard(0);
      }
    function xSearch()
    {
        $loading();fSearch("goods")
    }    
      
    function InitView()
    {
        ueToolbar("tbdiv",elems1,elemsevent1);
        ueLabel("lbldiv1",elems2,elemsevent2);
        ueLabel("lbldiv2",elems3,elemsevent3,1);   
        $("fSearchText").name = SearchFields;
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
    function openPro(winid)
    {
        var s = strfind("view",null,null);
        title  = "��Ʒ��ϸ���ϣ����������ڣ�"+"<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>" +"/ �������ڣ�<span datasrc='#��Ʒ����Tab' datafld='��������_��ʽ'></span>����";
        DlgWin("view",null,title,null,s,700,460);
        gband.show   = true; gband.minwidth=120;
        YPanel("goods","dvCustTab",null,1);
        opengrid();
    }
    function opengrid()
    {
        sband.gridtype = 8;sband.freecols = "��ɫ";sband.minwidth = "35px";
        sband.title = "������ɫ��Ϣ";sband.editcol=",��ɫ,";sband.StrongGrid=true;
        new XGrid("dvSubTab",sband,"in",null,1);
        sband.XQuery(true);
        sband.AfterXQuery=function(){extitle(gband.Val("�������"));}
        updatefields(gband);
    }
    
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
            <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
            <td align="right" width="40">���ƣ�</td><td width="235">\
            <input datasrc="#��Ʒ����Tab" datafld="����" class="xlandinput" style="WIDTH: 90%;" /><font face="Wingdings" color="#ff0000">v</font></td>\
            <td align="right" width="40">��ţ�</td><td width="100">\
            <input datasrc="#��Ʒ����Tab" datafld="���" class="xlandinput" style="width:80%;" type="text"  /><font face="Wingdings" color="#ff0000">v</font></td>\
            <td align="right" width="40">��ţ�</td><td width="60">\
            <input datasrc="#��Ʒ����Tab" datafld="��Ʒ���" class="xlandinput" style="width:100%;" type="text"  /></td>\
            <td align="right" width="40">ʧЧ��</td><td width="20">\
            <input datasrc="#��Ʒ����Tab" datafld="ʧЧ" class="xlandradio" type="checkbox" /></td>\
            <td align="right">��<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'view\',\'none\')">�ر�</a>��</td>\
            </tr></table></fieldset>\
            <div style="width:99%;height:390px">\
            <fieldset style="float:left;padding: 3px;height:200;width:69%"><legend><font face="΢���ź�">��ϸ���ϣ�</font></legend>\
            <div id="dvCustTab" class="tablescroll" style="height:180px; OVERFLOW-y:auto"></div>\
            </fieldset>\
            <fieldset style="float:right;padding: 3px;height:200;width:29%"><legend><font face="΢���ź�">����ͼ��</font>\
            ��<a class="linkbtn_0" href="#" target="_self" onclick="upload(\'goods\',\'��ƷͼƬ\')">�ϴ�</a>��\
            </legend>\
            <table border="0" width="98%" height="170"><tr><td bgcolor="#F6F6F6" align=center valign=center>\
            <IMG src="images//Floppy.gif" id="goods:��ƷͼƬ" class="xlandImg" alt="�����ԭͼ..." /></td></tr></table>\
            </fieldset>\
            <fieldset style="float:left;padding: 3px;height:170;width:69%"><legend><font face="΢���ź�">ѡ������׼��</font><input class="xlandinput" style="width:100px" datasrc="#��Ʒ����Tab" datafld="�����׼"  onafterupdate="extitle()" /><input title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Xcbo();"/></legend><div id="dvSubTab" style="width:100%;height:95%"></div></fieldset>\
            <fieldset style="float:right;padding: 2px;height:70;width:29%"><legend><font face="΢���ź�">������Ϣ��</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#��Ʒ����Tab" datafld="������Ϣ" style="width:176;height:70" ></textarea></fieldset>\
            <fieldset style="float:right;padding: 2px;height:79;width:29%"><legend><font face="΢���ź�">ϴˮ����Ϣ��</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#��Ʒ����Tab" datafld="ϴˮ����Ϣ" style="width:176;height:70" ></textarea></fieldset>\
            </div>';
        return s;
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

function secBoard(n,ibutton) {
    if(n>=mainTable.tBodies.length) return;
    ueToolCurrent((!ibutton)?n:ibutton,"tbdiv");
    for(i=0;i<mainTable.tBodies.length;i++)
      mainTable.tBodies[i].style.display="none";
    mainTable.tBodies[n].style.display="block";
    $loading();
    switch(n)
    {
        case 0:
            if(!gband) return;
            gband.XQuery();
            gband.minwidth = "80px";
            gband.gridtype = 6;
            gband.freecols = "����";gband.noxml=true;
            gband.AfterXQuery = function(){new XGrid("dvMasterTab",gband,"in",null,1);$loading("none");}
        case 1:
            sizeband.XQuery();
            sizeband.gridtype = 17;sizeband.noxml=true;
            sizeband.freecols = "����";
            sizeband.minwidth = "40px";
            sizeband.dicts="@��λ=����/��";
            //,@����=�³�/��Χ/�䳤/���/�㳤/��Χ/��Χ/�ſ�
            sizeband.barcode='<button class=txtbtn onclick="slsizeinfo()" ><img src="images/find16.png" />ѡ��...</button>';
            sizeband.AfterXQuery = function(){new XGrid("dvfsizeTab",sizeband,"in",null,1);$loading("none");}
            break;
        case 2:
            var ob=$band("attach");
            ob.XQuery(true);
            ob.gridtype = 17;ob.noxml=true;
            ob.freecols = "����";
            ob.minwidth = "40px";
            ob.title = "��Ʒͼ��";
            ob.AfterXQuery = function(){new XGrid("dvattach",ob,"in",null,1);$loading("none");}
            break;
        case 3:
            XDict(oListboxFrom,oListboxFrom,null)
            $("pubkh").innerText="��"+gband.Val("����")+"-"+gband.Val("���")+"��";
            $loading("none");
            break;        
        case 4:dlgPrint();
            $loading("none");
            break; 
        case 5:
            $loading();
            var xsmband = $band("xsm");
            xsmband.XQuery();
            xsmband.gridtype = 17;xsmband.noxml=true;
            xsmband.freecols = "����";
            if(!xsmband.Grid)
                var Grid = new XGrid("dvxsm",xsmband,"in",null,1);
            $loading("none");
            break;        
    }
}

//���������嵥	          

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
var lcolor = 3; //��ɫ�볤��
function dlgPrint()
{
    sband.XQuery(true);
    sband.rows = sband.XmlLandData.XMLDocument.selectNodes("//"+sband.DataItem);
    if(sband.rows.length==0) return;
    $("colorbox").options.length=0;
    for(var i=0;i<sband.rows.length;i++)
    {
        var _cv = sband.rows[i].selectSingleNode("��ɫ����").text;
        _cv = pad(parseInt(_cv),lcolor);
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
       $("sizebox").options.add(new Option((bt=="")?ac[i]:ToolUtil.valueTag(bt,ac[i]),ac[i]));
    
    $("goodname").innerText = ($band("goods").Val("��ʽ")!="")?$band("goods").Val("��ʽ"):$band("goods").Val("���")
    $("colorbox").fireEvent("onChange");
    $("sizebox").fireEvent("onChange");
    var _cv =$("colorbox").options[$("colorbox").selectedIndex].value;
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
    }
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
          url=ue_path() +"/frmprintc.aspx?prn="+prn+"&sql="+str+"&pms="+ue_sysprn;;
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
        var s=sizestrfind(wid,gridname,bandname);
        DlgWin(wid,gridname,title,bandname,s);
        var oband = $band(bandname);
        oband.gridtype = 13;  oband.freecols = "����";        oband.minwidth = "120px"
        var Grid = new XGrid(gridname,oband,"in",true,1,1);
        oband.Asyn=true;
        oband.XQuery();
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
    