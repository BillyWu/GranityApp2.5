        var gband;gweather=""; var IsNew=false;
        var leghint = '�����¼ <A class="linkbtn_0" href="#" onclick="showbill(true);"><img border="0" src="Images/new3.gif" />&nbsp;���ﵥ</A>';
        var leghints = [leghint]; 
        var elems1 = ["�ͻ���Ϣ","�����¼","�˻���¼","���ۻ���","���̼��","�µ�","����"];
        var elemsevent1 = ["secBoard(0)","secBoard(1)","secBoard(2)","secBoard(3)","showflow()","newbill()","ue_save()"];  
        var elems2 = ["ȫ������","�ͻ�","����ͻ�"];
        var elemsevent2 = ["_location(0)","_location(1)","_location(2)"];   
        var elems3 = ["���߿��","VIP����ͳ��","�ͻ��˻���ͳ��","������ͳ��","���ۻ���ͳ��","��ƷӪ��ͳ�Ʊ���...","ӪҵԱҵ������","��Ʒ�ۺϲ�ѯ"];
        var elemsevent3 = ["showchart()","","","","","","","","",""];  
        var trText = 'ʡ#<select id="ʡ" name="ʡ" style="width:100px"></select><br/><span style="width:70;text-align:right">���У�</span><select id="��" name="��" style="width:100px"></select><br/><span style="width:70;text-align:right">���أ�</span><select id="����" name="����" style="width:100px"></select>';
        var instore="";
        function newbill()
        {
            $band('master').exchange=false;
            showbill(true);
        }
        function initWin()
        {
            InitView();
            gband=$band("edit");
            gband.Asyn = true;
            if(!gband.active) _location(2,$("tablelbldiv1"));
            gband.maxwidth=150;
            gband.gridtype = 81;
            gband.freecols = "��ݵ�ַ";gband.StrongGrid=true;
            var Grid = new XGrid("dvCustTab",gband,"in",null,1);
            $N("��Χ1")[0].checked=true;
            $N("״̬1")[0].checked=true;            
            gband.AfterXQuery=function(){$loading("none");getinrstore();};
            $band("slgoods").AfterRowChanged=function()
            {
                if(!this.Grid) return;
                this.Grid.extitle(this.Val("�������"));
            }
            $band("slallgoods").AfterRowChanged=function()
            {
                if(!this.Grid) return;
                this.Grid.extitle(this.Val("�������"));
            }
            $band("edit").AfterRowChanged=function()
            {
                if(!this.Grid) return;showtmp();
            }
            $("shops").value = $SP("DeptName");
        }
        function InitView()
        {
            if($("tbdiv"))ueToolbar("tbdiv",elems1,elemsevent1);
//            var s='<input type="text" id="shops" class="IptA" style= "background:Transparent"  value=" ��������..." style="WIDTH: 150;" size="11" \
//	        datasourceid="exec FD_DeptsOfUserId @UserAccounts" datatextfield="dept" datavaluefield="dept"/><input title="ѡ������..." class="txtbtn" type=button value="..." \
//        style="margin-left:-30px;margin-top:5px;width:22px;position:absolute;background-color:transparent" onclick="Ycbo()"/>';
            var s = '<INPUT id="shops" class="Ipt fRi" style="WIDTH: 160;;height:22px" datasourceid="exec FD_DeptsOfUserId @UserAccounts" datatextfield="dept" datavaluefield="dept" type="text" value="ѡ������..." /><input title="ѡ������..." class="txtbtn" type=button value="..." \
//        style="margin-left:-33px;margin-top:5px;width:22px;position:absolute;background-color:transparent" onclick="Ycbo()"/>';
            $("tbdiv").innerHTML=$("tbdiv").innerHTML+s;
            ueLabel("lbldiv1",elems2,elemsevent2);   
            ueLabel("lbldiv2",elems3,elemsevent3,1);
            delete elems1;delete elemsevent1;
            delete elems2;delete elemsevent2;
            delete elems3;delete elemsevent3;
            CollectGarbage();
            if($("tablelbldiv1"))$("tablelbldiv1").style.display="";
        } 
        
        function openPro(winid){secBoard(1);}
        function secBoard(n) 
        {
            if(n!=0 && $band("edit").RecordCount()==0)
            {
                alert("��ѡ��һ���ͻ�!");return;
            }
            if($("mainTable")){
                if(n>=mainTable.tBodies.length) return;
                ueToolCurrent(n,"tbdiv");
                for(i=0;i<mainTable.tBodies.length;i++)
                  mainTable.tBodies[i].style.display="none";
                mainTable.tBodies[n].style.display="block";
                mainTable.tag=n;
            }
            switch(n)
            {
                case 0:
                    try{ $("txtbar").focus();}catch(ex){break;}break;
                case 1: 
                case 2:                     
                    rcdfilter(n,$("��Χ"+n));
                    break;
                case 3: 
                    var ob=$band("���ۻ���");  ob.title = "���ۻ���";  ob.minwidth = "80px";  ob.freecols = "����";
                    ob.dicts="@״̬=δ����/����/ȡ��,@�׶�=���ڹ�ͨ/����̸��/ǩԼ";  ob.gridtype = 8;
                    var Grid = new XGrid("dvopport",ob,"in",null,1);
                    ob.Asyn=true;$loading();
                    ob.XQuery(true);
                    ob.AfterXQuery=function(){$loading("none")};
                    break;
            }
            if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"�ڵ�","S","","D");
        }
        function openDlg(bandid)
        {
	        var band=GridUtil.FindBand(bandid);
	        if(!band)   return;
            var winid = band.ID;
            var s= '<fieldset style="padding: 2px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="50">���⣺</td><td width="250">\
                <input datasrc="#saleOpportsTab" datafld="����" class="xlandinput" style="width:250;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
                </td>\
                <td align="right" width="70">����ʱ�䣺</td><td width="100">\
                <input datasrc="#saleOpportsTab" datafld="����ʱ��_��ʽ" class="xlanddate" style="width:100;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
                </td>\
                <td align="right">��<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">����</a>����<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\''+winid+'\',\'none\');">�ر�</a>��</td>\
                </tr></table></fieldset>\
                <fieldset style="padding: 2px;height:360;width:99%"><legend><font face="΢���ź�">��ϸ���ݣ�</font></legend>\
                <div id="dvoppanel" class="tablescroll" style="height:340; OVERFLOW-y:auto"></div></fieldset>';
            DlgWin(winid,"dvopp",">><span datasrc='#netcustomerTab' datafld='����'></span>" +" - ���ۻ���",band.ItemName,s)
            delete s;
            CollectGarbage();
            band.ForceWidth = "80";band.splitrow=3;
            YPanel(band.ItemName,"dvoppanel",null,1,"@����=1",200);
	    }
        function rcdfilter(n,obj)
        {
            var ockmen = $CHK("��Χ"+n);
            //if(!obj) obj = event.srcElement;
            $("�ͻ�����"+n).value=(ockmen.value==0)?$band("edit").Val("����"):"";
            var ocks = $CHK("״̬"+n);
            if(ocks) ocks.fireEvent("onclick");
        }
        function officeQuery(itemname,griddiv,n)
        {
            if(itemname=="returngoods") {
            ToolUtil.setParamValue($XD(), "bk", $("slback").value,"integer", "B", itemname,"C","D");
            $("slback").disabled=false }
            else {$("slback").disabled=true;ToolUtil.delParam($XD(), "bk", "B", itemname,"C");}
            var ob=$band(itemname);
            ob.gridtype = 7; ob.freecols = "�ͻ�"; ob.minwidth = "80px";ob.StrongGrid=true;ob.noxml=true;
            ob.Asyn = true;$loading()
            ue_tfilter(itemname);
            ob.AfterXQuery=function(){$loading("none");
                new XGrid(griddiv,this,"in",null,1);  
                window.setTimeout(x_dispGridChk(this.ItemName),1500);             
            };
            getsum(n);
        }
        function x_dispGridChk(itemname)
        {return function(){_dispGridChk(itemname);}}
        function getinrstore()
        {
            var strsql="exec FD_��λ�ڲ� @UnitCode";
            var xmlhttp = ue_ajaxdom(strsql,null,null,null,null,true);
            xmlhttp.onreadystatechange = function()
            {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {            
                    var xmldata = xmlhttp.responseXML;
                    if(!xmldata) return;    
                    instore = (!xmldata.selectSingleNode("//table/kw"))?"":xmldata.selectSingleNode("//table/kw").text;
                    delhttp(xmlhttp);
                }
            }
        }      

        function getsum(n)
        {
            var strsql="exec FS_VIP�������� '" +$band("edit").Val("����") +"'";
            var xmlhttp = ue_ajaxdom(strsql,null,null,null,null,true);
            xmlhttp.onreadystatechange = function()
            {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
                {            
                    var xmldata = xmlhttp.responseXML;
                    if(!xmldata) return;    
                    $("addCount"+n).innerText = (!xmldata.selectSingleNode("//table/addcount"))?"":xmldata.selectSingleNode("//table/addcount").text;
                    $("addMoney"+n).innerText = (!xmldata.selectSingleNode("//table/addmoney"))?"":xmldata.selectSingleNode("//table/addmoney").text;
                    $("backcount"+n).innerText = (!xmldata.selectSingleNode("//table/backcount"))?"":xmldata.selectSingleNode("//table/backcount").text;
                    $("backmoney"+n).innerText = (!xmldata.selectSingleNode("//table/backmoney"))?"":xmldata.selectSingleNode("//table/backmoney").text;
                    $("actualcount"+n).innerText = (!xmldata.selectSingleNode("//table/actualcount"))?"":xmldata.selectSingleNode("//table/actualcount").text;
                    $("actualmoney"+n).innerText = (!xmldata.selectSingleNode("//table/actualmoney"))?"":xmldata.selectSingleNode("//table/actualmoney").text;
                    delhttp(xmlhttp);
                }
            }
        }
        
        function _dispGridChk(item)
        {
            var oband = $band(item);
            for(var i=0;i<oband.Grid.Table.rows.length;i++)
            {
                if(oband.Grid.Table.rows[i].cells[1].innerText!="")
                {
                    for(var j=1;j<oband.Grid.Table.rows[i].cells.length;j++)
                    {
                        if(!oband.Grid.Table.rows[i].cells[j]) continue;
                        oband.Grid.Table.rows[i].cells[j].style.fontWeight="bold";
                    }
                }
            }
        }

          function openChartTools(flag)
          {       
            switch(flag)
            {
                case 0: 
                    var stoolv = gband.Val("����");
                    if(stoolv=="") return;     
	                var result = confirm(" ������ÿͻ�ʹ���Ա�������ͨ�� ?     ");
	                if(!result) return;
	                            //"http://www.taobao.com/webww/ww.php?ver=3&amp;touid=xx&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="����ٷ��콢��" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E5%A4%A9%E8%AF%AD%E5%AE%98%E6%96%B9%E6%97%97%E8%88%B0%E5%BA%97&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;ͮ�ƹ�</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=stonesun&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="stonesun" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=stonesun&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;С����</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=denny123tan&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="С����" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=denny123tan&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;С����</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E5%B0%8F%E6%B6%9B%E6%B6%9B%E5%93%A5%E4%BB%AC&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="С���θ���" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E5%B0%8F%E6%B6%9B%E6%B6%9B%E5%93%A5%E4%BB%AC&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;��&nbsp;&nbsp;&nbsp;��</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%81%E4%B8%81%E5%8E%86%E9%99%A9%E8%AE%B0316&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="�������ռ�316" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E4%B8%81%E4%B8%81%E5%8E%86%E9%99%A9%E8%AE%B0316&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;��&nbsp;&nbsp;&nbsp;��</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=qiuzhiyu_5764&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="����" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=qiuzhiyu_5764&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">��ǰ��&nbsp;���ӷ�</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=qiuzhiyu_5764&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="����" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=qiuzhiyu_5764&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: ΢���ź�">�ۺ��ۺ�С�</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E8%BE%A3%E5%A9%86%E5%A9%86&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8
                    //window.open("http://www.taobao.com/webww/index.php?ver=3&touid="+stoolv+"&siteid=cntaobao&status=1&charset=utf-8","","top=0px,left=0px,width=10px,height=10px,location=no");
                    window.open("http://www.taobao.com/webww/ww.php?ver=3&amp;touid="+stoolv+"&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8","","top=0px,left=0px,width=0px,height=0px,location=no");
                    break;
                case 1:
                    var stoolv = gband.Val("QQ"); 
                    if(stoolv=="") return;     
	                var result = confirm(" ������ÿͻ�ʹ��QQ��ͨ�� ?     ");
	                if(!result) return;
                    window.open("http://wpa.qq.com/msgrd?V=1&Uin="+stoolv,"","top=0px,left=0px,width=10px,height=10px,location=no");
                    break;
            }
          }
          function beforesave()
          {
             if(IsNew && $band("edit").Val("����")!="" && $band("master").Val("�ͻ�����")=="" && $band("master").RecordCount()!=0) 
                $band("master").setFldStrValue(null,"�ͻ�����",$band("edit").Val("����"))
             if(gweather!="") $band("master").setFldStrValue(null,"�������",gweather)
             return true;
          }
          function _location(flag,keytable){
                $loading();
                ToolUtil.setParamValue($XD(), "outer", "0", "s", "P", "", "Ts","");
                switch(flag)
                {
                    case 0: $("f1").value="";$("f2").value="";$("f3").value="";$("f5").value="";$("f4").value="";break;
                    case 1: $("f4").value=1;$("f1").value="";$("f2").value="";$("f3").value="";$("f5").value="";break;
                    case 2: $("f5").value="1";$("f1").value="";$("f2").value="";$("f3").value="";$("f4").value="";break;
                    case 10: //���ⲿ 
                        $("f4").value="";$("f5").value="";
                        ToolUtil.setParamValue($XD(), "outer", "1", "s", "P", "", "Ts","");
                        break;
                    default:
                        $("f4").value="";$("f5").value="";
                }                
                ws_location("edit",keytable);
          }
        function _save()
        {
            if(!ue_save("")) return;
            if($band("master").exchange==true)
            {if(_Rcalc("")) ue_save();}
            else
            {if(_calc("")) ue_save();}
        }
        function _calc(hint,ex)
        {
            if($band("detail").RecordCount()==0) return;
            var billcode=$band("master").Val("���ݱ��");
            if(billcode.length<4){alert("���ȱ����ټ���!");return;}
            var dept = ToolUtil.valueTag($("shops").tag,"DeptCode");if(!dept) dept = $SP("DeptCode");
            var cardType=($band("edit").Val("���")=="")?"":$band("edit").Val("���");
            var dtOrder=$band("master").Val("��������_��ʽ");
            if(!ex)  var strsql = "exec discBillNew '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"',0";
            else var strsql = "exec discBackBill '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"'";
            var xmldata = ue_ajaxdom(strsql);if(!xmldata) return;
            var ob = $band("detail");
            if(!xmldata.selectSingleNode("//table/sumpay")) {alert("�ۿۼ��㲻��ȷ!");return};
            var op = xmldata.selectSingleNode("//table/sumpay");    var _sumpay  = (!op)?"":op.text;
            var op = xmldata.selectSingleNode("//table/sumpayback");var _sumpayback  = (!op)?"":op.text;
            var op = xmldata.selectSingleNode("//table/bsumpay");   var _bsumpay  = (!op)?"":op.text;
            //ex=trueʱ,Ϊ����,���ۿ۽��Ϊsumpayback,���ʵ���ۼ�Ϊpayback
            $band("master").setFldStrValue(null,"���ۿ۽��",(!ex)?_sumpay:_sumpayback);
            $band("master").setFldStrValue(null,"Ӧ���ֽ�",(!ex)?_sumpay:_sumpayback);
            for(var i=0;i<ob.RecordCount();i++)
            {
                var _styleno   = ob.getFldStrValue("���",i);
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/pricedisc"); var _pricedisc  = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/qty");       var _qty        = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/payback");   var _payback    = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/discID");   var _discID        = (!op)?"":op.text;
                // _pricediscΪ�����ۿ�
                var _unitpay = _pricedisc;
                if(ex){
                    var scs = ue_xmlsum(ob.XSS("//fgsaledetailnet[���='"+_styleno+"']//����"));
                    _unitpay = (scs!=0)?_payback/scs:0;
                    }
                ob.setFldStrValue(i,"ʵ���ۼ�",_unitpay*ob.getFldStrValue("����",i));
                ob.setFldStrValue(i,"�ۿ۵���",_unitpay);
                ob.setFldStrValue(i,"��������",_discID);
            }
            $band("detail").Sum();
            $("txtsale").value=_bsumpay;
            if(hint=="") if(ue_save("",true)) return true;
            else if(ue_save("�������!",true)) return true;
        }
        function ue_xmlsum(nodes)
        {
            var x=0;
            for(var i=0;i<nodes.length;i++)
                x=x+ToolUtil.Convert(nodes[i].text,"int");
            return x;
        }
        //�˻�ʱ���¼���
        function _Rcalc(hint)
        {
            if($band("detail").IsModify()) ue_save("");
            var billcode=$band("master").Val("���ݱ��");
            var dept = ToolUtil.valueTag($("shops").tag,"DeptCode");if(!dept) dept = $SP("DeptCode");
            var cardType=($band("edit").Val("���")=="")?"":$band("edit").Val("���");
            var dtOrder=$band("master").Val("��������_��ʽ");
          
            var strsql = "exec discBackBill '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"'";
            var xmldata = ue_ajaxdom(strsql);if(!xmldata) return;
            if(!xmldata.selectSingleNode("//table/sumpay")){alert("û���ۿ۽��!");return;}
            var _sumbackpay = (!xmldata.selectSingleNode("//table/sumpayback"))?0:xmldata.selectSingleNode("//table/sumpayback").text;
            $band("master").setFldStrValue(null,"�˻����",_sumbackpay);
            var ob = $band("detail");
            for(var i=0;i<ob.RecordCount();i++)
            {
                var _styleno   = ob.getFldStrValue("���",i);
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/bkpricedisc"); var _pricedisc= (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/unitpayback"); var _payback  = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/discID");   var _discID        = (!op)?"":op.text;                
                if(ob.getFldStrValue("�˻�����",i)!=0)
                    ob.setFldStrValue(i,"�˻����",_payback*ob.getFldStrValue("�˻�����",i));
                else
                    ob.setFldStrValue(i,"�˻����",0);
                ob.setFldStrValue(i,"�˻�����",_payback);
                ob.setFldStrValue(i,"��������",_discID);
            }
            $band("detail").Sum();
            if(hint=="") if(ue_save("",true)) return true;
            else if(ue_save("�������!",true)) return true;
        }

        function showbill(isnew,ex,nobg)
        {
            if(!isnew && (event.srcElement.innerText=="��" || event.srcElement.innerText=="")) return;
            GridUtil.usOnCellRFocusHandle();
            IsNew = isnew;
            _setWorkFlowParams("todo",isnew);
            $band("master").XQuery(true);
            //if(gband.Val("����")==""){alert("��ָ���ͻ�!");f1.focus(); return;};
            var billinfo = '<span datasrc="#fgsaleTab" datafld="������"></span> - �����ݱ�ţ�<span datasrc="#fgsaleTab" datafld="���ݱ��"></span>/&nbsp;���ڣ�<span datasrc="#fgsaleTab" datafld="��������_��ʽ"></span>��';
            if((isnew || ($band("todo").Val("�༭")=="��") && ($band("todo").Val("�ڵ�")=="���")))
            {
                if(ex || $band("master").Val("�����")) $band("master").exchange=true
                else $band("master").exchange=false;
                var strdiv = strbill("winbill","grdbill","master");
            }
            else
                var strdiv = strBrwbill();
            DlgWin("winbill","grdbill","���۵� - "+billinfo,"master",strdiv,730,365,null,null,nobg);
            delete strdiv;
            CollectGarbage();

            //ȡ��Ȩ�޽ڵ�ȷ���Ƿ���Ա༭
            if(isnew) {
                $band("master").NewRecord();
                if($band("edit").Val("����")!="") {
                    var flds = ["�ͻ�����","��ݵ�ַ","����","ʡ","��","��ϵ��","��ϵ�绰"];
                    var vflds = ["����","��ݵ�ַ","����","ʡ","��","��ϵ��","��ϵ�绰"];
                    for(var i=0;i<flds.length;i++)
                        $band("master").setFldStrValue(null,flds[i],$band("edit").Val(vflds[i]));
                    delete flds;delete vflds;
                    CollectGarbage();
                }
            };
            sband = $band("detail");
            sband.gridtype = 19;        sband.freecols = "���";        sband.minwidth = "80px";
            if(isnew || $band("todo").Val("�༭")=="��" )
            {
                var flds = ["�˻�����","�˻�ԭ��","����","����","ʵ���ۼ�","�˺�ʵ���ۼ�","�ۿ۵���","�˺��ۿ۵���"];
                var vflds = ["1","1","1","0","0","1","0","1"];
                for(var i=0;i<flds.length;i++)
                    sband.ColVisable(flds[i],vflds[i]);
                delete flds;delete vflds;
                CollectGarbage();
                if(isnew || $band("todo").Val("�ڵ�")=="���")
                {
                    sband.barcode='<INPUT id="txtbar" class="gridbrowseB" onkeydown="selectbyBarCode()" style="text-indent:18;background-color: #F9F2E1;background-image:url(\'images/shirt.png\'); background-repeat:no-repeat;WIDTH:200;font-weight: bold" type="text" size="11" name="���"/>\
                    <INPUT name="��λ" filter="and"  class="xlandinput" style="display:none;width:100%;" type="text" size="11" value="" />\
                    <button class=txtbtn onclick="selectbyBarCode(1)" >&nbsp;<img src="images/find16.png" style="vertical-align:middle"/></button>';
                    $("insl").style.display="";$("linksave").style.display="";$("linkcalc").style.display="";$("linksubmit").style.display="";
                    $("linksubmit").innerHTML='<IMG src="images/oknote.png" style="vertical-align:middle" border="0" />\
                    <span style="text-align:left;cursor:hand" class="span60fn">�ύ</span>';
                }
                else{
                    $("linksubmit").innerHTML='<IMG src="images/8.png" style="vertical-align:middle" border="0" />����Ա�¼��!';
                    sband.gridtype = 17;
               }
            }
            else{ sband.barcode="";$("linksave").style.display="none";$("linkcalc").style.display="none";$("linksubmit").style.display="none";
            sband.gridtype = 17;$("insl").style.display="none"}
            sband.StrongGrid=true;
            var Grid = new XGrid("dvsband",sband,"in",null,1); 
            sband.XQuery(true);
            $("txtsale").value=$band("master").Val("�ܽ��")-$band("master").Val("���ۿ۽��");
            return true;
        }
        function dlgbill()
        {
            GridUtil.usOnCellRFocusHandle();
            if(event.srcElement.innerText=="��" || event.srcElement.innerText=="") return;
            var ctrlsrc=event.srcElement;
            var billinfo = '�����ݱ�ţ�<span datasrc="#fgsaleTab" datafld="���ݱ��"></span>/&nbsp;���ڣ�<span datasrc="#fgsaleTab" datafld="��������_��ʽ"></span>��';
            if(ctrlsrc.innerText=="�˻�")
            {
                var xmldata = ue_ajaxdom("exec Fs_��ǰ�˵� '"+$band("returngoods").Val("���ݱ��")+"'");
                var xmlv = xmldata.selectSingleNode("//table//num");
                var _num = (!xmlv)?0:parseInt(xmlv.text,10);
                if(_num>0){alert("�Ѵ�����ص��˵�,�������������˻�!");return;};
                DlgWin("winbill","grdbill","���۵�-"+billinfo,"master",strRbill(1,true),730);
            }
            else
                DlgWin("winbill","grdbill","���۵�-"+billinfo,"master",strRbill(0),730);
            _setWorkFlowParams("returngoods");
            $band("master").XQuery(true);
            sband = $band("detail");
            var flds = ["�˻�����","�˻�ԭ��","����","����","ʵ���ۼ�","�˺�ʵ���ۼ�","�ۿ۵���","�˺��ۿ۵���"];
            var vflds = ["0","0","0","1","1","0","1","0"];
            for(var i=0;i<flds.length;i++)
                sband.ColVisable(flds[i],vflds[i]);
            delete flds;delete vflds;
            CollectGarbage();
            sband.gridtype = 7;        sband.freecols = "���";        sband.minwidth = "80px";
            sband.StrongGrid=true;     sband.editcol=",�˻�����,�˻�ԭ��,";
            var Grid = new XGrid("dvsband",sband,"in",null,1); 
            sband.XQuery(true);
            $band("detail").Sum();
            $band("master").CalXmlLand.Calculate();
            var zje = $band("detail").XmlSum.XMLDocument.selectSingleNode("/*/*/�˺������ۼ�").text;
            var descje = $band("detail").XmlSum.XMLDocument.selectSingleNode("/*/*/�˺�ʵ���ۼ�").text;
            $("txtsale").value=zje-descje;
            return true;
        }
        function tmalert()
        {alert("���ڰ����ѯ�д����ѽ�������еİ��")}
        function _setWorkFlowParams(itemname,isnew,wf)
        {
            if(!wf) wf="�ͷ�����";
            if(isnew)
            {
                var prname = "workflow,startnode,�ڵ�";var prval  = "�ͷ�����,���,���";
                var prnames = prname.split(",");       var prvals  = prval.split(",");
            }else
            {
                var prname = "workflow,���ݱ��,�ڵ�";        var prval  = wf+","+$band(itemname).Val("���ݱ��")+","+$band(itemname).Val("�ڵ�");
                var prnames = prname.split(",");var prvals  = prval.split(",");
            }        
            for(var i=0;i<prnames.length;i++)
                ToolUtil.setParamValue($("xmlparam").XMLDocument, prnames[i],prvals[i],"string", "S", null,"D");
        }
        function currentfindband()
        {
            var index = 0;
            for(var i=0;i<$N("״̬1").length;i++)
                if($N("״̬1")[i].checked) 
                {
                    return $N("״̬1")[i].value;
                    break;
                }
        }
        function BeforeWinClose(wid)
        {
            var owin = dwobj(wid)
            if(owin && owin.items=="master" && ($band("master").IsModify() || $band("detail").IsModify()))
            {
        	    var result = confirm("�����Ѹı�,�Ƿ���������۵�?");
                if(result){
                $band("master").Cancel();
                $band("detail").Cancel();
                return true;
                }
                else
                    return false;
            }
            return true;
        }
        function afterWinClose(wid)
        {
            var owin = dwobj(wid)
            if(owin && owin.items=="master" && currentfindband() && mainTable.tag==1) {$band(currentfindband()).XQuery(true);}
            if(wid!="wingoods")
                ShowHide("wingoods","none");
        }
        function appUnique(nodes)
        {
            if(!nodes || nodes.length==0) return "";
            var s="";
            for(var i=0;i<nodes.length;i++)
                s=s+","+nodes[i].text;
            s=s.substring(1,s.length);
            return unique(s.split(","));    
        }
        function newPms()
        {
            if(!$("shops").tag){
                ToolUtil.delParam($XP(), "DeptCodeX", "P", null,"Ts");
                ToolUtil.delParam($XP(), "UserAccountsX", "P", null,"Ts");
            }
            else{
                ToolUtil.setParamValue($XD(), "DeptCodeX", (!ToolUtil.valueTag($("shops").tag,"DeptCode"))?"":ToolUtil.valueTag($("shops").tag,"DeptCode"), "s", "P", "", "Ts","");
                ToolUtil.setParamValue($XD(), "UserAccountsX", (!ToolUtil.valueTag($("shops").tag,"UserAccounts"))?"":ToolUtil.valueTag($("shops").tag,"UserAccounts"), "s", "P", "", "Ts","");
            }
                
        }
        function simplesubmit()
        {
            newPms();
            ue_save("�ύ�ɹ�!");
            ShowHide("winnodes","none");
            ShowHide("winbill","none");        
        }
        function ue_submit()
        {
            GridUtil.usOnCellRFocusHandle();
            var destnode = $band("gonodes").Val("����");
            if(destnode==""){alert("��ָ��һ��Ŀ�Ľڵ�!");return;}
            $band("master").setFldStrValue(null,"Ŀ�Ľڵ�",destnode);
            ToolUtil.setParamValue($XD(), "��һ�ڵ�", $band("gonodes").Val("��һ�ڵ�"), "s", "P", "", "Ts","");
            if(($band("todo").Val("�ڵ�")=="�ͷ�ȷ��" || $band("todoback").Val("�ڵ�")=="�˻�ȷ��") && !IsNew){simplesubmit();getsum(1);return;}
            var remote = $band("detail").XS("//fgsaledetailnet[�������!='' and ����!='�ڲ�']/���Ŵ���");
            if(remote){
                if($band("master").backparam) _backsale($band("master").backparam,true,false);
                simplesubmit();
                $band("master").backparam=null;
                _calcvip();
                $band("master").Cancel();
                $band("detail").Cancel();
                ShowHide("winbill","none");
                return;
            }
            var agent = $band("detail").XS("//fgsaledetailnet[�������!='']/���Ŵ���");
            var odept = $band("detail").XS("//fgsaledetailnet[�������='' and ����='�ڲ�']/���Ŵ���");
            
            if(agent) var _dept=agent.text;
            else if(odept) var _dept=odept.text;
            $band("master").setFldStrValue(null,"���ղ���",_dept);   
            var mbh = $band("master").Val("���ݱ��");
            ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mbh,"string", "S", null,"D");

             //������-�����, ������ڵĿ�λ��
            var ojh = $band("detail").XSS("//fgsaledetailnet[���='true']/���Ŵ���")
            var ajh = appUnique(ojh);
            var o = $band("detail").XSS("//fgsaledetailnet[����='�ڲ�']/���Ŵ���");
            var a = appUnique(o);
            if(ajh.length>0)
            {
                for(var i=0;i<a.length;i++)
                {
                    var bh = mbh + "." + (i+1);
                    //var onode = $band("detail").XS("//fgsaledetailnet[��λ='" + a[i] + "']/���Ŵ���");
                    var reacivedept = a[i];//(!onode)?"":onode.text;
                    if(reacivedept=="") continue;                
                    buildWorkflow(mbh,bh,reacivedept);
                }
            }
            if($band("master").backparam) _backsale($band("master").backparam,true,false);
            simplesubmit();
            _calcvip();
            $band("master").Cancel();
            $band("detail").Cancel();
            $band("master").backparam=null;
            ShowHide("winbill","none");            
        }
        //���칤����ʵ��
        function buildWorkflow(mbh,bh,reacivedept)
        {
           //
           var strsql = "EXECUTE Proc_flow_instanceSub\
                  '" + mbh + "','�ͷ�����','" + bh + "','�ֿ���','','','�����','"+reacivedept+"','','���','���'\
                  ,'','','"+ $SP("DeptSaleName") + "','"+ $SP("DWName") + "',''";
           ue_ajaxdom(strsql,"1","",null,true);
        }
        function _calcvip()
        {
            var xmldata = ue_ajaxdom("exec calc_vip '"+$band("edit").Val("����")+"','"+$band("master").Val("���ݱ��")+"',null");
            var xmlv = xmldata.selectSingleNode("//table")
            if(xmlv.selectSingleNode("���ѽ��")) $band("edit").setFldStrValue(null,"���ѽ��",xmlv.selectSingleNode("���ѽ��").text);
            if(xmlv.selectSingleNode("����")) $band("edit").setFldStrValue(null,"����",xmlv.selectSingleNode("����").text);
            if(xmlv.selectSingleNode("���")) $band("edit").setFldStrValue(null,"���",xmlv.selectSingleNode("���").text);
        }
        function x_newdetail(strxml)
        {return function(){newdetail(strxml);}}
        
        function newdetail(strxml)
        {
            var _xml = new ActiveXObject("Microsoft.XMLDOM")
            _xml.async=false;
            _xml.loadXML(strxml);
            var DRows = _xml.selectNodes("//fgsaledetailnet[number(�˻�����)>0]");
            var cols = $band("detail").ColNames;
            for(var im=0;im<DRows.length;im++)
            {       
                $band("detail").NewRecord();         
                for(var i=0;i<cols.length;i++)
                {
                    if(cols[i]==$band("detail").keyCol || cols[i]==$band("detail").linkCol || !DRows[im].selectSingleNode(cols[i])
                        || cols[i]=="����" || cols[i]=="��������" || cols[i]=="�˻�����" || cols[i]=="��������" || cols[i]=="�˻����" || cols[i]=="�����ۼ�" || cols[i]=="ʵ���ۼ�")
                        continue;
                    $band("detail").setFldStrValue(im,cols[i],DRows[im].selectSingleNode(cols[i]).text);
                    if(cols[i]=="�˻�����") 
                        $band("detail").setFldStrValue(im,"����",DRows[im].selectSingleNode(cols[i]).text);
                }
                $band("detail").setFldStrValue(im,"�˻�����",0)
                $band("detail").CalXmlLand.Calculate();
            }
            $band("detail").Sum();
            $band("master").CalXmlLand.Calculate();
        }
        function _exchangesale(obackdept)
        {
            //����һ���µ����۵�,����ԭ���ź�����Ÿ�ֵΪ��ǰ����
            var srcbh = $band("master").Val("ԭ����");
            var curbh = $band("master").Val("���ݱ��");
            if(srcbh=="") srcbh = $band("master").Val("���ݱ��");
            var MRow  = $band("master").XS("//fgsale");
            var DRows = $band("detail").XSS("//fgsaledetailnet[number(�˻�����)>0]");
            var strxml = DRows.context.xml;
            ShowHide("winbill","none",true);
            showbill(true,true);
            $band("master").backparam = obackdept;
            var cols = $band("master").ColNames;
            for(var i=0;i<cols.length;i++)
            {
                if(cols[i]==$band("master").keyCol || cols[i]==$band("master").linkCol || cols[i]=="�������" 
                 || cols[i]=="�ܽ��" || cols[i]=="���ۿ۽��" || cols[i]=="�ܺϼ�" || cols[i]=="�˻����" 
                 || cols[i]=="��������" || cols[i]=="���˽��" || cols[i]=="���˵���" || cols[i]=="Ӧ���ֽ�")
                    continue;
                $band("master").setFldStrValue(null,cols[i],MRow.selectSingleNode(cols[i]).text);
            }
            $band("master").setFldStrValue(null,"�����",curbh);//����������˻����ĸ���
            $band("master").setFldStrValue(null,"ԭ����",srcbh);
            window.setTimeout(x_newdetail(strxml),500); 
        }
        
        //�����backcode,���ʾ��ֱ���˵�,�˵��ĸ�����Ϊ��ǰ���۵���
        function _backsale(o,nohint,dirback)
        {
            var a = appUnique(o);
            var bh = $band("master").Val("���ݱ��");
            var mbh = (!dirback)?$band("master").Val("�����"):bh;
            var iserr=false;
            for(var i=0;i<a.length;i++)
            {
                if(a[i]=="") continue;
                var uid = ToolUtil.valueTag($("shops").tag,"UserAccounts");if(!uid) uid = $SP("UserAccounts");
                var strsql = "EXECUTE Proc_flow_instanceTuiHuoBy���� '" + bh +"','"+ mbh +"','"+a[i]+"','','���','','"
                    + uid +"','"+ $band("master").Val("�˻���ע")+"'";
                if(ue_ajaxdom(strsql,"1","",null,true)!="ok") {iserr=true;break;}
            }
            if(!iserr && !nohint) alert("������ɣ�");
            var strsql = "EXECUTE FE_�����������۵����� '" + bh +"','" + mbh +"'";
            ue_ajaxdom(strsql,"1","",null,true);
            _calcvip();
        }
        function _Rsubmit()
        {
            var o = $band("detail").XSS("//�ڲ�[number(../�˻�����)>0]"); //���˻صĲ���,Զ�̵����ۺ�,�����,���˻ص��ܵ�
            if(o.length==0){alert("��ָ���˻�����!");return};
            if($CHK("R1").value==1) {
	            var result = confirm("ϵͳ��Ϊ�����ɻ�����,��ȷ��! ");
                if(!result) return;
                $band("master").exchange=true;
                if(!ue_save("")) return;
                _exchangesale(o);
            }
            else 
               {
	                var result = confirm("ϵͳ��Ϊ�������˻�����,��ȷ��! ");
                    if(!result) return;
                    if(!ue_save("")) return;
                    _backsale(o,null,true);
                    $band("master").Cancel();
                    $band("detail").Cancel();
                    ShowHide("winbill","none");                    
               }
        }        
        function ts_quit(){ShowHide("winjbs","none");ShowHide("winbill","none");$band("record").XQuery(true);}     
                
        function _mydelbill()
        {
            if($band("todo").Val("���ݱ��").length<4){ShowHide("winbill","none");return};
            var result = confirm("����ɾ�������۵����Ƿ�ȷ��? \r\n��ʾ���㡺ȷ��������ɾ�����㡺ȡ�������ص���! ");
            if(!result) return;
            if(!ue_banddelete("fgsaleTab")) {alert("ɾ��ʧ��!");return}
            if(ue_save("ɾ���ɹ�!")) ShowHide("winbill","none");
        }
        /*�ֲ�����:
            1 ������Ʒ��λ�ж���������Ʒ������ͬһ����,���Ϊͬһ��,�򲻷ֵ�,��֮����ֵ���
            2 �ֵ�������ԣ�����λ�ֵ�,��ͬ��λ�ֳɶ�Ӧ��һ���������ÿ�����Ľ��ղ���Ϊ��λ���ڲ��ţ��ֵ�����������.�������������.
            3 ���ڷֵ��������۵������̴���ݽ�����������ӵ���������̽����������ű�����.
        */
        function _mysubmit()
        {
            if(!IsNew && $band("todo").Val("�ڵ�")=="�ͷ�ȷ��"){
        	    var result = confirm(" ������Ա��Ǽ�����ȷ��! ");
                if(!result) return;
	        }
	        else 
	        {
	            if($band("master").Val("ָ�����")=="" || $band("master").Val("��ݹ�˾")=="")
	            {
	                var result = confirm(" ��δָ����ݹ�˾���Ƿ��ύ? \r\n��ʾ���㡺ȷ���������ύ���㡺ȡ�������ص���! ");
                    if(!result) return;
                }
                if($band("master").Val("ָ�����")=="true" && $band("master").Val("��ݹ�˾")=="")
	            {alert("����д��ݹ�˾!");return;}
	            if($band("master").Val("��ݹ�˾")!="")$band("master").setFldStrValue(null,"ָ�����","true");
                if(sband.RecordCount()==0){alert("û����ϸ����,����!");return;}
                if(!judge()) return;
                if($band("master").Val("���ݱ��").length<4)
                    if(!ue_save("")) return;
                if($band("master").exchange==true)
                    _Rcalc();
                else
                    _calc();
            }
            var oband = $band("gonodes");
            oband.XQuery();
            var remote = $band("detail").XS("//fgsaledetailnet[�������!='' and ����!='�ڲ�']/���Ŵ���");
            if(remote && $band("todo").Val("�ڵ�")!="�ͷ�ȷ��")
            {
                var inners = oband.XSS("/*/*[����!='�ύ��������']");
                for(var i=oband.RecordCount()-1;i>-1;i--)
                    oband.DeleteRowNode(inners[i]);
            }
            else
            {
                var inners = oband.XSS("/*/*[����='�ύ��������']");
                for(var i=oband.RecordCount()-1;i>-1;i--)
                    oband.DeleteRowNode(inners[i]);
            }
            if(oband.RecordCount()==0){alert("û�пɽ��˻صĽڵ�!");return;}
            if(oband.RecordCount()==1){ue_submit();return};
            var str='<div style="width:98%;height:70%;" id="gonodes"></div><fieldset style="padding: 15px;;width:98%"><legend>������ʾ��</legend>'
            +'<p>���������б��е�����Ҫ�ύ����һ���������ڣ������ύ��</p></fieldset>';
            DlgWin("winnodes","dvnodes","�ύ�ڵ�ѡ��","gonodes",str,500,300);
            oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
            new XGrid("gonodes",oband,"in",null,1,1);
        }
        function _okback()
        {
            GridUtil.usOnCellRFocusHandle();        
    	    var result = confirm(" ������˻�����ȷ��! ");
            if(!result) return;
            var wf = "�ͷ��˻�";
            var prname = "workflow,���ݱ��,�ڵ�";var prval  = wf+","+$band("todoback").Val("���ݱ��")+","+$band("todoback").Val("�ڵ�");
            var prnames = prname.split(",");var prvals  = prval.split(",");
            for(var i=0;i<prnames.length;i++)
                ToolUtil.setParamValue($("xmlparam").XMLDocument, prnames[i],prvals[i],"string", "S", null,"D");
            var oband = $band("gonodes");
            oband.XQuery();
            _setsubmitParams("todoback",wf);
            if(oband.RecordCount()==1){ue_cmd("exesubmit");_delparams("todoback");$("rbtn21").fireEvent("onclick"); return};
        }
        function _setsubmitParams(item,wf)
        {
            var destnode = $band("gonodes").Val("����");
            if(destnode == ""){alert("��ָ��һ��Ŀ�Ľڵ�!");return;}
            var nodes = ["��һ�ڵ�","���ݱ��","��������","workflow","����Ա","�������","��Ŀ����","���ղ���","Ŀ�Ľڵ�","�ڵ�","startnode","�ύ����","��Ŀ���"];
            var vnodes = [$band("gonodes").Val("��һ�ڵ�"),$band(item).Val("���ݱ��"),$band(item).Val("��������"),wf,"","","","",$band("gonodes").Val("����"),
                $band(item).Val("�ڵ�"),"���","",""];
            for(var i=0;i<nodes.length;i++)
                ToolUtil.setParamValue($XD(), nodes[i], vnodes[i],"string", "B", item,"C","D");
            delete nodes;
            delete vnodes;
            CollectGarbage();
        }
        function _delparams(item)
        {
            var nodes = ["��һ�ڵ�","���ݱ��","��������","workflow","����Ա","�������","��Ŀ����","���ղ���","Ŀ�Ľڵ�","�ڵ�","startnode","�ύ����","��Ŀ���"];
            for(var i=0;i<nodes.length;i++)
                ToolUtil.delParam($XD(), nodes[i], "B", item,"C");
            delete nodes;
            CollectGarbage();
        }
        function judge()
        {
            //������ڴ������ֿ�,��Ϸ�
            var agent = $band("detail").XS("//fgsaledetailnet[�������!='']/���Ŵ���");
            if(agent) return true;
            //��������ڴ���ֿ�,�����ж���ǵ���ֲֿ�(�ڲ�),��Ƿ�
            var odept = $band("detail").XSS("//fgsaledetailnet[�������='' and �������='']/���Ŵ���");
            if(!odept){
                alert("��ѡ��Ʒû�й����ֿ�,����!");return false;
            }
            var s="";
            for(var i=0;i<odept.length;i++)
                s=s+","+odept[i].text;
            s=s.substring(1,s.length);
            var a = unique(s.split(","));
            if(a.length>1)
            {
                alert("��ѡ��Ʒ���ڶ����ͬ�ֿ�,��ֱ��µ�!");return false;
            }
            return true;
        }        
        function unique(data)
        {
            data = data || [];
            var a = {};
            for (var i=0; i<data.length; i++) {
                var v = data[i];
                if (typeof(a[v]) == 'undefined'){
                    a[v] = 1;
                }
            };
            data.length=0; 
            for (var i in a){
                data[data.length] = i;
            }
            return data;
        }

            
    function editvip()
    {
        var s=  '<fieldset style="padding: 2px;;width:99%"><legend><font face="΢���ź�">��Ҫ��Ϣ��</font></legend>\
            <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
            <td><p><span class="span50fn">������</span><input datasrc="#netcustomerTab" datafld="����" class="xlandinput" style="width:90;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
            <span class="span50fn">������</span><input datasrc="#netcustomerTab" datafld="����" class="xlandinput" style="width:60;" type="text"  />\
            <span class="span50fn">���</span><input datasrc="#netcustomerTab" datafld="���" class="xlandinput" style="width:50;" type="text"  />\
            <button class="txtbtn" onclick="incontacts()">��ϵ��ʽ..<img border="0" style="cursor:hand;vertical-align:middle" src="Images/go1.png"  /></button>\
            ��<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">����</a>����<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'winpanel\',\'none\');">�ر�</a>��\
            <br/><span class="span50fn">�ȵ㣺</span><input datasrc="#netcustomerTab" datafld="�ȵ�" class="xlandradio" type="checkbox" />\
            <span class="span120" style="width:128">�ȵ㱸ע��</span><input datasrc="#netcustomerTab" datafld="�ȵ㱸ע" class="xlandinput" style="width:280" type="text"  />\
    ������  </p>\
            </td></tr></table></fieldset>\
            <fieldset style="padding: 2px;height:320;width:99%"><legend><button id="docbtn0" class="txtbtn" onclick="exchangedoc(0)">\
            <img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />������Ϣ</button>\
            <button id="docbtn1" class="txtbtn" onclick="exchangedoc(1)">��������</button></legend>\
            <div id="dvpanel" class="tablescroll" style="text-align:left;height:300; OVERFLOW-y:auto"></div></fieldset>';
        DlgWin("winpanel","dvpanel","VIP�Ǽ�","edit",s);
        delete s;
        CollectGarbage();        
        exchangedoc(0);
    }
    function exchangedoc(flag)
    {
        $band("edit").ForceWidth = "130";$band("edit").splitrow=2;
        if(flag==0){
            $("docbtn0").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />������Ϣ';
            $("docbtn1").innerHTML='��������';
            $band("edit").startpos = 19;$band("edit").endpos=""}
        else{
            $("docbtn0").innerHTML='������Ϣ';
            $("docbtn1").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />��������';
            $band("edit").startpos = 0;$band("edit").endpos = 19;}
        YPanel("edit","dvpanel",null,1,"@�ͷ�=1,@�����������=1",190);
    }
    function incontacts()
    {
        var s= '<div id="dvcontacts" class="tablescroll" style="height:99%;width:100%;"></div><div style="text-align:left;background-color: #C0C0C0"><span class="span80fn"><font face="Wingdings" color="#ff0000">v</font>��ݵ�ַ��</span><input datasrc="#contactsTab" datafld="��ݵ�ַ" class="xlandinput" style="width:400;" type="text"  /></div>';
        DlgWin("wincontacts","dvcontacts","��ϵ����ϸ��Ϣ","contacts",s,600,300);
        var ob=$band("contacts");ob.gridtype = 8;  ob.freecols = "��ݵ�ַ"; ob.StrongGrid=true;ob.minwidth = "80px";     
        var Grid = new XGrid("dvcontacts",$band("contacts"),"in",null,1,1);
        ob.XQuery();
    }
    function cboAfterUpdate(e)
    {
        if(e && e.dataFld && (e.dataFld=="ʡ" || e.dataFld=="��"))
            showtmp();
        if(e.id=="shops") newPms();
    }
   
    function showtmp()
    {
        var city = $band("edit").Val("���д���");
        if(city=="" || $band("edit").Val("��")=="") {$("txtweather").innerText="";return;}
	    var xmlhttp = ue_ajaxdom("exec FS_����Ԥ�� '"+$band("edit").Val("��")+"'",null,null,null,null,true)
        xmlhttp.onreadystatechange = function()
        {
           if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
           {
                xmldata = xmlhttp.responseXML;
                delhttp(xmlhttp);
                w1 = (!xmldata.selectSingleNode("//weather"))?"":xmldata.selectSingleNode("//weather").text;
                gweather = $band("edit").Val("����")+"��"+w1;            
                if(w1=="")
                {
                    xmldata =new ActiveXObject("Microsoft.XMLDOM");
                    xmldata.async = false;   
                    xmldata.load("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName?theCityName="+city);   
                    if(!xmldata) return;
                    xmldata.loadXML(xmldata.xml.replace(/&lt;/g,"<").replace(/&gt;/g,">"));
                    if(!xmldata || xmldata.selectNodes("//string").length<6) return;
                    var w1 = xmldata.selectNodes("//string")[5].text;
                    var w2 = xmldata.selectNodes("//string")[6].text;
                    gtweather = $band("edit").Val("����")+"��"+$band("edit").Val("��")+" ����:" +w2+" �¶�:" +w1;
                }
                $("txtweather").innerText=gweather.replaceAll("����","");
           }
        }
    }    
    function strbill(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        if($band(bandname) && $band(bandname).exchange)
            var strcalcbtn = "_calc(null,true)";
        else var strcalcbtn = "_calc()";
	    var s ='<fieldset style="padding: 1px;float:left;text-align:left;width:72%;height:125px"><legend><font face="΢���ź�">ժҪ��Ϣ��</font></legend>\
	        <span class="span70fn">�͡�������</span><INPUT datasrc="#fgsaleTab" datafld="�ͻ�����" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input id="insl" title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
		    <span class="span90fn">�ϡ����ƣ�</span><INPUT datasrc="#fgsaleTab" datafld="�ܺϼ�" class="xlandinput" style="WIDTH:60;" type="text" size="11"/>(��)\
		    <span class="span70fn" style="width:71px;color:#800000">�������ڣ�</span><INPUT datasrc="#fgsaleTab" datafld="Ԥ���ϻ�ʱ��_��ʽ" class="xlanddate" style="WIDTH:80;" type="text" size="11"/>\
		    <p style="margin:1">\
            <span class="span70fn">��&nbsp;&nbsp;��&nbsp;&nbsp;�</span><INPUT datasrc="#fgsaleTab" datafld="�ܽ��" class="xlandinput" style="WIDTH:90;" type="text" size="11"/>(Ԫ)\
		    <span class="span80fn" style="width:70">�Żݽ�</span><INPUT id="txtsale" readonly class="xlandinput" style="WIDTH:60;" type="text" size="11"/>\
		    <span class="span90fn">Ӧ���ֽ�</span><INPUT id="Text1" datasrc="#fgsaleTab" datafld="Ӧ���ֽ�" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>(Ԫ)\
		    </p><p style="margin:1">\
            <span class="span70fn">��ݵ�ַ��</span><INPUT datasrc="#fgsaleTab" datafld="��ݵ�ַ" class="xlandinput" style="WIDTH:243;" type="text" size="11"/><input id="insl" title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
		    <span class="span90fn">��&nbsp;&nbsp;ϵ&nbsp;&nbsp;�ˣ�</span><INPUT datasrc="#fgsaleTab" datafld="��ϵ��" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1">\
            <span class="span70fn">��ݹ�˾��</span><INPUT datasrc="#fgsaleTab" datafld="��ݹ�˾" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input id="insl" title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:4px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/><input type="checkbox" datasrc="#fgsaleTab" datafld="ָ�����" class="xlandradio">ָ����ݹ�˾\
            <input type="checkbox" datasrc="#fgsaleTab" datafld="���˷�" class="xlandradio">���˷�\
		    <span style="width:86;text-align:right;font-family: ΢���ź�;">��ݷ�ʽ��</span><INPUT datasrc="#fgsaleTab" datafld="��ݷ�ʽ" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1">\
            <span class="span70fn">������ע��</span><input type="text" class="xlandinput" datasrc="#fgsaleTab" datafld="��ע" style="width:416;" /></p>\
	        </fieldset><fieldset style="padding: 1px;text-align:center;float:right;width:27%;height:125px"><legend><font face="΢���ź�">������Ϣ��</font></legend>\
    		<p><A id="linksave" class="linkbtn_0" href="#" target="_self" onclick="_save()"><IMG src="images/SaveHS.gif" style="vertical-align:middle" border="0" /><span style="text-align:left" class="span60fn">����</span></A>\
		    <A id="linkcalc" class="linkbtn_0" href="#" target="_self" onclick="'+strcalcbtn+'"><IMG src="images/calc.png" style="vertical-align:middle" border="0" />�ۿۼ���</A>\
		    <br /><br /><A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_mysubmit()">\
		    <IMG src="images/oknote.png" style="vertical-align:middle" border="0" /><span style="text-align:left" class="span80fn">�ύ</span></A>\
		    <A id="linkdel" class="linkbtn_0" href="#" target="_self" onclick="_mydelbill()">\
		    <IMG src="images/delete_16x16.gif" style="vertical-align:middle" border="0" />ɾ������</A></p>\
	        </fieldset>\
	        <div id="dvsband" style="padding: 1px;height:200px;width:100%;"></div>\
	        <p style="margin:1;color: #993300">����Ҫ��ʾ:1.��ֱӪ�귢��ʱ,���ڴ����������������Ÿı����߿������!��2.��ָ����������,��ϵͳ�ڷ�������ǰ������!</p>\
	        ';	    
        return s;
    }    

    function strBrwbill()
    {
	    var s ='<fieldset style="padding: 1px;float:left;text-align:left;width:72%;height:126px"><legend><font face="΢���ź�">ժҪ��Ϣ��</font></legend>\
	        <span class="span70fn">�͡�������</span><INPUT datasrc="#fgsaleTab" datafld="�ͻ�����" disabled class="xlandinput" style="WIDTH:90;" type="text" size="11"/>\
		    <span class="span90fn">�ϡ����ƣ�</span><INPUT datasrc="#fgsaleTab" datafld="�ܺϼ�" disabled class="xlandinput" style="WIDTH:60;" type="text" size="11"/>(��)\
		    <span class="span70fn" style="width:71px;color:#800000">�������ڣ�</span><INPUT disabled datasrc="#fgsaleTab" datafld="Ԥ���ϻ�ʱ��_��ʽ" class="xlanddate" style="WIDTH:80;" type="text" size="11"/>\
		    <p style="margin:1"><span class="span70fn">��&nbsp;&nbsp;��&nbsp;&nbsp;�</span><INPUT disabled datasrc="#fgsaleTab" datafld="�ܽ��" class="xlandinput" style="WIDTH:90;" type="text" size="11"/>(Ԫ)\
		    <span class="span70fn">�Żݽ�</span><INPUT id="txtsale" disabled class="xlandinput" style="WIDTH:60;" type="text" size="11"/>\
		    <span class="span90fn">Ӧ���ֽ�</span><INPUT disabled datasrc="#fgsaleTab" datafld="Ӧ���ֽ�" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>(Ԫ)\
		    </p><p style="margin:1"><span class="span70fn">��ݵ�ַ��</span><INPUT disabled datasrc="#fgsaleTab" datafld="��ݵ�ַ" class="xlandinput" style="WIDTH:243;" type="text" size="11"/>\
		    <span class="span90fn">��&nbsp;&nbsp;ϵ&nbsp;&nbsp;�ˣ�</span><INPUT disabled datasrc="#fgsaleTab" datafld="��ϵ��" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1"><span class="span70fn">��ݹ�˾��</span><INPUT disabled datasrc="#fgsaleTab" datafld="��ݹ�˾" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input type="checkbox" disabled datasrc="#fgsaleTab" datafld="ָ�����" class="xlandradio">ָ����ݹ�˾\
            <input type="checkbox" datasrc="#fgsaleTab" disabled datafld="���˷�" class="xlandradio">���˷�\
		    <span class="span90fn" style="width:86">��ݷ�ʽ��</span><INPUT disabled datasrc="#fgsaleTab" datafld="��ݷ�ʽ" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1"><span class="span70fn">������ע��</span><input type="text" disabled class="xlandinput" datasrc="#fgsaleTab" datafld="��ע" style="width:243;" />\
		    <span class="span90fn">��ݺ��룺</span><INPUT disabled datasrc="#fgsaleTab" datafld="�������" class="xlandinput" style="WIDTH:80;" type="text" size="11"/></p>\
	        </fieldset><fieldset style="padding: 1px;float:right;width:27%;height:126px"><legend><font face="΢���ź�">������Ϣ��</font></legend>\
	        <br /><A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_mysubmit()"><IMG src="images/8.png" style="vertical-align:middle" border="0" />�ύ</A></fieldset><div id="dvsband" style="padding: 1px;height:215px;width:100%;"></div>';	    
        return s;
    }    

    function strRbill(flag,ex)
    {
        if(ex){var sumcnt = "�ܺϼ�";summny="�ܽ��";sumsalemny="���ۿ����";}
        {var sumcnt = "������";summny="�����";sumsalemny="���ۿ����";}
	    var s ='<table border="0" cellpadding="0" style="border-collapse: collapse;width:100%;height:100%">\
	        <tbody><tr><td style="height:50px">\
		    <span class="span80fn">ӪҵԱ��</span><INPUT datasrc="#fgsaleTab" datafld="������" class="xlandinput" style="WIDTH:80;" type="text" size="11"/><input id="insl" title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:3px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
            <span class="span50fn">�ϼƣ�</span><INPUT datasrc="#fgsaleTab" datafld="'+sumcnt+'" class="xlandinput" style="WIDTH:40;" type="text" size="11"/>(��)';
        var s1='��������������<A id="linksave" class="linkbtn_0" href="#" target="_self" onclick="ue_save()"><IMG src="images/save.gif" style="vertical-align:middle" border="0" />����</A>\
              <A id="linkcalc" class="linkbtn_0" href="#" target="_self" onclick="_Rcalc()"><IMG src="images/calc.png" style="vertical-align:middle" border="0" />���¼����ۿ�</A>\
		    ��<A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_Rsubmit()"><IMG src="images/8.png" style="vertical-align:middle" border="0" />�ύ</A>&nbsp;<input type="radio" id="rtnex1" style="cursor:hand" value="0" checked name="R1" ><label style="cursor:hand" for="rtnex1">�˻�</label>&nbsp;<input type="radio" id="rtnex2" style="cursor:hand" value="1" name="R1"><label style="cursor:hand" for="rtnex2">����</label>';
		var s2='<hr size="1" noshade style="text-align:center;width:98%;border:1px dotted #000000">\
            <span class="span80fn">�ܽ�</span><INPUT datasrc="#fgsaleTab" datafld="'+summny+'" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">�Żݽ�</span><INPUT id="txtsale" readonly class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">�Ѹ���</span><INPUT datasrc="#fgsaleTab" datafld="'+sumsalemny+'"  class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">Ӧ���ֽ�</span><INPUT datasrc="#fgsaleTab" datafld="�˻����"  class="xlandinput" style="WIDTH:45;" type="text" size="11"/>(Ԫ)\
		    <br />\
		    <span class="span80fn">����ID��</span><INPUT datasrc="#fgsaleTab" datafld="�ͻ�����" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">��ϵ�ˣ�</span><INPUT datasrc="#fgsaleTab" datafld="��ϵ��" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">��ϵ�绰��</span><INPUT datasrc="#fgsaleTab" datafld="��ϵ�绰" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <hr size="1" noshade style="text-align:center;width:98%;border:1px dotted #000000">\
		    <span class="span80fn" style="color:#663300">�˻���ע��</span><INPUT datasrc="#fgsaleTab" datafld="�˻���ע" class="xlandinput" style="WIDTH:365;" type="text" size="11"/>\
	        <br /><br /></td></tr>\
	        <tr><td id="dvsband" style="height:250px;width:100%;"></td></tr></tbody>\
	    </table>';
	    if(flag==1) s=s+s1+s2;
	    else s=s+s2;
        return s;
    }    
        
        function ts_filter()
        {
            var strfilter = "( dbo.fun_getPY(��ɫ����) like '"+$("txtbar").value+"%' or ��ɫ���� like '"+$("txtbar").value
            +"%' or dbo.fun_getPY(���) like '"+$("txtbar").value+"%' or ��� like '"+$("txtbar").value+"%' or �����ɫ���� like '" +$("txtbar").value +"%' );\
            dbo.fun_getPY(��ɫ����);��ɫ����;dbo.fun_getPY(���);���;�����ɫ����;"+$("txtbar").value+"��slgoods";
	        usfiltercmd(strfilter)
        }
        function showflow()
        {
            if(!$band("record").active) return;
            var winid="winflow";
            var owin = dwobj(winid);
    	    var sql= "exec wf_show '�ͷ�����'"
    	    var xmldata = ue_ajaxdom(sql);
    	    var htmlstr = xmldata.selectSingleNode("//table/htmlstr").text;
            var str='<table><tr><td><div style="Z-INDEX: 100; WIDTH: 100%;  POSITION: absolute;HEIGHT: 100%; TOP: 10px; CURSOR: default; LEFT: 1px" id=Canvas>'+htmlstr+"</div></td></tr></table>";
            DlgWin(winid,"dvflow","���̼�� - "+"���ͷ����� ("+$band("record").Val("���ݱ��")+")��","record",str,690)
            GridUtil.usOnCellRFocusHandle();   
            ToolUtil.setParamValue($XD(), "���ݱ��", $band("record").Val("���ݱ��"),"string", "B", "record","C","D");
            setflow($band("record"));
        }
    function setflow(ob)
    {
        if(!ob) ob=mband;
    	$band("inflow").XQuery(true);
    	$band("monitor").XQuery(true);
    	var objs = document.getElementsByTagName("roundrect");
    	var _xmldata=$band("monitor").XmlLandData.XMLDocument;
    	for(var i=0;i<objs.length;i++)
    	{
    	    objs[i].ondblclick="";
    	    if(objs[i].id==$band("inflow").Val("�ڵ����"))
    	    {
    	        objs[i].strokecolor="#f90";
    	        objs[i].fillcolor = "#f90"
    	        objs[i].style.cursor="hand";
    	        objs[i].title="�����ˣ�"+ob.Val("������")+"\r\n����ʱ�䣺"+$band("inflow").Val("����ʱ��")+"\r\n���ʱ�䣺"
    	        +$band("inflow").Val("���ʱ��");
    	    }
    	    else{
    	        objs[i].strokecolor="gray";
    	        if(_xmldata)
    	        {
    	            var _zrr="";var _sdt="";var _edt="";
    	            if(_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//����"))
    	                var _zrr = "�����ˣ�"+_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//����").text;
    	            if(_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//����ʱ��"))
    	                var _sdt = "����ʱ�䣺"+_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//����ʱ��").text;
    	            if(_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//����ʱ��"))
    	                var _edt = "���ʱ�䣺"+_xmldata.selectSingleNode("//wfmonitor[�ڵ����='"+objs[i].id+"']//���ʱ��").text;
    	            objs[i].title=_zrr+"\r\n"+_sdt+"\r\n"+_edt;
    	            objs[i].style.cursor="hand";
    	            if(_zrr+_sdt+_edt==""){
    	                objs[i].style.cursor="default";
    	                objs[i].title="δ����"
            	        objs[i].fillcolor = "#AA905D"
            	        objs[i].onmousemove=""
            	        objs[i].onmouseout=""
    	             }
    	        }
    	    }
    	    //onmousemove="this.style.backgroundPosition=\'left bottom\';" onmouseout="this.style.backgroundPosition=\'left top\';" 
	    }
	    var objs = document.getElementsByTagName("oval");
	    for(var i=0;i<objs.length;i++)
	    {
	        objs[i].ondblclick="";
	        objs[i].title=""
	    }    	
	    var objs = document.getElementsByTagName("polyline");
	    for(var i=0;i<objs.length;i++)
	    {
	        objs[i].ondblclick="";
	        objs[i].title=""
	        objs[i].strokecolor = "gray"
	        objs[i].onmousedown="";//=objFocusedOn(this.id)
	    }
        delete objs;
        CollectGarbage();	    
    }        
    function _chksize()
    {
        GridUtil.usOnCellRFocusHandle();
        var band=GridUtil.FindBand();
        var inputctrl=event.srcElement;
        if(inputctrl.innerText=="��" || parseInt(inputctrl.innerText,10)<1) 
        {alert("û�п�ѡ��ĳ���!");return}
        ClearSelAll(band.ItemName);
        var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
        var oSelCheck = trcur.cells[1].childNodes[0];
        oSelCheck.checked = true;
        oSelCheck.fireEvent("onclick");
        var wid="wingoods"; var gridname = "dvgoods"
        var chkids = "���,��ɫ����,����";var sumfld="����";var eqflds="@����="+inputctrl.colname;
        if(tobuy(wid,gridname,band.ItemName,true,inputctrl.colname,chkids,sumfld,eqflds))
        {
            inputctrl.innerText=parseInt(inputctrl.innerText,10)-1
            $band("detail").setFldStrValue(null,"����",inputctrl.colname);
            $band("detail").setFldStrValue(null,"����T",inputctrl.colname);
            ClearSelAll(band.ItemName);
        }
    }
    function selectbyBarCode(flag)
    {
        if ((!flag || flag==2) && (event.keyCode && event.keyCode != 13)) return;
        if(!flag) flag=1;
        $loading();
        var ostores = $N("��λ");
        for(var i=0;i<ostores.length;i++)
            if(ostores[i].value=="") ostores[i].value = instore;
        $band("slgoods").Asyn=true;
        var bandname ="slgoods";  var ob=$band(bandname);  var wid="wingoods"; var gridname = "dvgoods";
        ue_tfilter(bandname);
        $band("slgoods").AfterXQuery=function()
        {
            $loading("none");
            if(!$("xMsg"+wid) || $("xMsg"+wid).style.display=="none") 
                DlgWin(wid,gridname,"����ѯ",bandname,strgood(wid,gridname,bandname,flag),630,280,"top",null,true);
            ob.gridtype = 13;  ob.freecols = "���"; ob.minwidth = "120px";ob.noxml=true;ob.StrongGrid=true;
            var Grid = new XGrid(gridname,ob,"in",true,1,1);
            try{
                if($("g���")) $("g���").focus();
            }
            catch(ex){};            
        };
    } 
    function strgood(winid,gridname,bandname,flag)
    {
        if(!bandname) bandname="";
        var s= '<table border="0" width="99%" cellpadding="5" style="border-collapse: collapse"  ><tr>\
        <td width="40" align="right">��ţ�</td><td width="80"><input id=\"g���\" name=\"���\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 100%;\"></td>\
        <td width="40" align="right">��ɫ��</td><td width="60"><INPUT name="dbo.fun_getPY(��ɫ����);��ɫ����;���" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>\
        <td width="40" align="right">���룺</td><td width="40"><INPUT id="����" name="" class="tinput" style="width:100%;" type="text" size="11"  /></td>\
        <td width="90" align="right"><label for="chkout">����ֱӪ�꣺</label></td><td width="50"><input id="chkout" onclick=chkstore("'+bandname+'") type="checkbox" name="" value="ON" />\
        <INPUT name="��λ" id="sl��λ" filter="and"  class="xlandinput" style="display:none;width:100%;" type="text" size="11" value="" /></td>\
        <td width="30"><img border="0"  style="cursor:hand" src="Images/find16.png" onclick=_tfilter("'+bandname+'")  /></td>';
        if(flag==2)
        {
            var s0='';
        }
        else            
            var s0='<td width="90" align="center"><button id="Button2" class="txtbtn" \
            onclick=tobuy("'+winid+'","'+gridname+'","'+bandname+'","�޴˲�Ʒ��")><img border="0" style="cursor:hand;vertical-align:middle"\
            src="Images/buy1.gif"  /> �µ�</button></td>';
        var s1 = '</tr></table><div style="width:99%;height:96%;" id="'+gridname+'"></div>';
        return s+s0+s1;
    }
    function _tfilter(item)
    {
        ToolUtil.setParamValue($XD(), "����", (!$("����"))?"":$("����").value,"string", "B", item,"C","D");
        ue_tfilter(item);
    }
    function chkstore(item)
    {
        $("sl��λ").value = (!event.srcElement.checked)?instore:"";
        _tfilter(item);
        
    }
    function oklocate(winid,gridname,bandname,hint,keywords,intype,dstband,dstfld)
    {
        var ob = $band(bandname);
        //�ֹ�checkin
        var colname = "ѡ��";
        var coltype=ob.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+colname+"']/@type");
        var _datatype="";
        if(coltype) var _datatype = coltype.value;
        if(_datatype!="xs:boolean")
            var xmlRows=ob.XSS("/*/*[@selected='-1' or @selected='1' or @selected='true']");
        else 
            var xmlRows=ob.XSS("/*/*[@selected='-1' or @selected='1' or @selected='true' or ѡ��='-1' or ѡ��='1' or ѡ��='true']");
        var khs="";
        for(var i=0;i<xmlRows.length;i++)
            khs=khs+","+xmlRows[i].selectSingleNode("���").text;
        if(intype=="import" && $band(dstband).Val(dstfld)!="")
            khs = $band(dstband).Val(dstfld) + khs;
        else khs = khs.substring(1,khs.length);
        var a = unique(khs.split(","));
        khs = "";
        for(var i=0;i<a.length;i++){khs=khs+","+a[i]}
        $band(dstband).setFldStrValue(null,dstfld,khs.substring(1,khs.length));
    }        
    function tobuy(winid,gridname,bandname,noRtn,colname,chkids,sumfld,eqflds)
    {
        var chkrows = $band(bandname).XSS("/*/*[@selected='-1' or @selected='1' or @selected='true' or ѡ��='-1' or ѡ��='1' or ѡ��='true']");
        if(!chkrows || chkrows.length==0){alert("��ѡ����Ʒ!");return;};
    
        if(!isExist("winbill")) return;
        //if(!showbill(true,null,true)){$("g���").focus(); return;}
        var ob = $band(bandname);
        ob.IsImport="1";
        $band("detail").exportItem=bandname;
        document.importItem="detail";  
        if(ue_import(bandname,"import",null,chkids,null,sumfld,eqflds))
        {
            if(!noRtn) ShowHide(winid,"none");return true
        };
    }
