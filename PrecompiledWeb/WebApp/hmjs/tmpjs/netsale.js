        var gband;gweather=""; var IsNew=false;
        var leghint = '购买记录 <A class="linkbtn_0" href="#" onclick="showbill(true);"><img border="0" src="Images/new3.gif" />&nbsp;购物单</A>';
        var leghints = [leghint]; 
        var elems1 = ["客户信息","购买记录","退换记录","销售机会","流程监控","下单","保存"];
        var elemsevent1 = ["secBoard(0)","secBoard(1)","secBoard(2)","secBoard(3)","showflow()","newbill()","ue_save()"];  
        var elems2 = ["全部数据","客户","意向客户"];
        var elemsevent2 = ["_location(0)","_location(1)","_location(2)"];   
        var elems3 = ["在线库存","VIP销售统计","客户退换货统计","日销售统计","销售汇总统计","商品营销统计报表...","营业员业绩分析","商品综合查询"];
        var elemsevent3 = ["showchart()","","","","","","","","",""];  
        var trText = '省#<select id="省" name="省" style="width:100px"></select><br/><span style="width:70;text-align:right">地市：</span><select id="市" name="市" style="width:100px"></select><br/><span style="width:70;text-align:right">区县：</span><select id="区县" name="区县" style="width:100px"></select>';
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
            gband.freecols = "快递地址";gband.StrongGrid=true;
            var Grid = new XGrid("dvCustTab",gband,"in",null,1);
            $N("范围1")[0].checked=true;
            $N("状态1")[0].checked=true;            
            gband.AfterXQuery=function(){$loading("none");getinrstore();};
            $band("slgoods").AfterRowChanged=function()
            {
                if(!this.Grid) return;
                this.Grid.extitle(this.Val("尺码标题"));
            }
            $band("slallgoods").AfterRowChanged=function()
            {
                if(!this.Grid) return;
                this.Grid.extitle(this.Val("尺码标题"));
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
//            var s='<input type="text" id="shops" class="IptA" style= "background:Transparent"  value=" 网店名称..." style="WIDTH: 150;" size="11" \
//	        datasourceid="exec FD_DeptsOfUserId @UserAccounts" datatextfield="dept" datavaluefield="dept"/><input title="选择网店..." class="txtbtn" type=button value="..." \
//        style="margin-left:-30px;margin-top:5px;width:22px;position:absolute;background-color:transparent" onclick="Ycbo()"/>';
            var s = '<INPUT id="shops" class="Ipt fRi" style="WIDTH: 160;;height:22px" datasourceid="exec FD_DeptsOfUserId @UserAccounts" datatextfield="dept" datavaluefield="dept" type="text" value="选择网店..." /><input title="选择网店..." class="txtbtn" type=button value="..." \
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
                alert("请选择一个客户!");return;
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
                    rcdfilter(n,$("范围"+n));
                    break;
                case 3: 
                    var ob=$band("销售机会");  ob.title = "销售机会";  ob.minwidth = "80px";  ob.freecols = "主题";
                    ob.dicts="@状态=未结束/结束/取消,@阶段=初期沟通/商务谈判/签约";  ob.gridtype = 8;
                    var Grid = new XGrid("dvopport",ob,"in",null,1);
                    ob.Asyn=true;$loading();
                    ob.XQuery(true);
                    ob.AfterXQuery=function(){$loading("none")};
                    break;
            }
            if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"节点","S","","D");
        }
        function openDlg(bandid)
        {
	        var band=GridUtil.FindBand(bandid);
	        if(!band)   return;
            var winid = band.ID;
            var s= '<fieldset style="padding: 2px;;width:99%"><legend><font face="微软雅黑">主要信息：</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="50">主题：</td><td width="250">\
                <input datasrc="#saleOpportsTab" datafld="主题" class="xlandinput" style="width:250;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
                </td>\
                <td align="right" width="70">发现时间：</td><td width="100">\
                <input datasrc="#saleOpportsTab" datafld="发现时间_格式" class="xlanddate" style="width:100;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
                </td>\
                <td align="right">【<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">保存</a>】【<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\''+winid+'\',\'none\');">关闭</a>】</td>\
                </tr></table></fieldset>\
                <fieldset style="padding: 2px;height:360;width:99%"><legend><font face="微软雅黑">详细内容：</font></legend>\
                <div id="dvoppanel" class="tablescroll" style="height:340; OVERFLOW-y:auto"></div></fieldset>';
            DlgWin(winid,"dvopp",">><span datasrc='#netcustomerTab' datafld='旺旺'></span>" +" - 销售机会",band.ItemName,s)
            delete s;
            CollectGarbage();
            band.ForceWidth = "80";band.splitrow=3;
            YPanel(band.ItemName,"dvoppanel",null,1,"@需求=1",200);
	    }
        function rcdfilter(n,obj)
        {
            var ockmen = $CHK("范围"+n);
            //if(!obj) obj = event.srcElement;
            $("客户代码"+n).value=(ockmen.value==0)?$band("edit").Val("旺旺"):"";
            var ocks = $CHK("状态"+n);
            if(ocks) ocks.fireEvent("onclick");
        }
        function officeQuery(itemname,griddiv,n)
        {
            if(itemname=="returngoods") {
            ToolUtil.setParamValue($XD(), "bk", $("slback").value,"integer", "B", itemname,"C","D");
            $("slback").disabled=false }
            else {$("slback").disabled=true;ToolUtil.delParam($XD(), "bk", "B", itemname,"C");}
            var ob=$band(itemname);
            ob.gridtype = 7; ob.freecols = "客户"; ob.minwidth = "80px";ob.StrongGrid=true;ob.noxml=true;
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
            var strsql="exec FD_库位内部 @UnitCode";
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
            var strsql="exec FS_VIP购买总量 '" +$band("edit").Val("旺旺") +"'";
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
                    var stoolv = gband.Val("旺旺");
                    if(stoolv=="") return;     
	                var result = confirm(" 您将与该客户使用淘宝旺旺沟通吗 ?     ");
	                if(!result) return;
	                            //"http://www.taobao.com/webww/ww.php?ver=3&amp;touid=xx&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="天语官方旗舰店" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E5%A4%A9%E8%AF%AD%E5%AE%98%E6%96%B9%E6%97%97%E8%88%B0%E5%BA%97&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;彤掌柜</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=stonesun&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="stonesun" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=stonesun&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;小丹尼</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=denny123tan&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="小丹尼" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=denny123tan&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;小涛涛</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E5%B0%8F%E6%B6%9B%E6%B6%9B%E5%93%A5%E4%BB%AC&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="小涛涛哥们" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E5%B0%8F%E6%B6%9B%E6%B6%9B%E5%93%A5%E4%BB%AC&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;丁&nbsp;&nbsp;&nbsp;丁</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%81%E4%B8%81%E5%8E%86%E9%99%A9%E8%AE%B0316&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="丁丁历险记316" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=%E4%B8%81%E4%B8%81%E5%8E%86%E9%99%A9%E8%AE%B0316&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;洋&nbsp;&nbsp;&nbsp;洋</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=qiuzhiyu_5764&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="刘燕" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=qiuzhiyu_5764&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售前：&nbsp;燕子飞</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=qiuzhiyu_5764&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8" target="_blank"><img alt="刘燕" border="0" src="http://amos.im.alisoft.com/online.aw?v=2&amp;uid=qiuzhiyu_5764&amp;site=cntaobao&amp;s=1&amp;charset=utf-8" /></a></td></tr><tr><td align="left" height="20" valign="center" width="98"><font size="2" style="font-family: 微软雅黑">售后：售后小妞</font></td><td width="100"><a href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E8%BE%A3%E5%A9%86%E5%A9%86&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8
                    //window.open("http://www.taobao.com/webww/index.php?ver=3&touid="+stoolv+"&siteid=cntaobao&status=1&charset=utf-8","","top=0px,left=0px,width=10px,height=10px,location=no");
                    window.open("http://www.taobao.com/webww/ww.php?ver=3&amp;touid="+stoolv+"&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8","","top=0px,left=0px,width=0px,height=0px,location=no");
                    break;
                case 1:
                    var stoolv = gband.Val("QQ"); 
                    if(stoolv=="") return;     
	                var result = confirm(" 您将与该客户使用QQ沟通吗 ?     ");
	                if(!result) return;
                    window.open("http://wpa.qq.com/msgrd?V=1&Uin="+stoolv,"","top=0px,left=0px,width=10px,height=10px,location=no");
                    break;
            }
          }
          function beforesave()
          {
             if(IsNew && $band("edit").Val("旺旺")!="" && $band("master").Val("客户代码")=="" && $band("master").RecordCount()!=0) 
                $band("master").setFldStrValue(null,"客户代码",$band("edit").Val("旺旺"))
             if(gweather!="") $band("master").setFldStrValue(null,"天气情况",gweather)
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
                    case 10: //查外部 
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
            var billcode=$band("master").Val("单据编号");
            if(billcode.length<4){alert("请先保存再计算!");return;}
            var dept = ToolUtil.valueTag($("shops").tag,"DeptCode");if(!dept) dept = $SP("DeptCode");
            var cardType=($band("edit").Val("类别")=="")?"":$band("edit").Val("类别");
            var dtOrder=$band("master").Val("单据日期_格式");
            if(!ex)  var strsql = "exec discBillNew '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"',0";
            else var strsql = "exec discBackBill '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"'";
            var xmldata = ue_ajaxdom(strsql);if(!xmldata) return;
            var ob = $band("detail");
            if(!xmldata.selectSingleNode("//table/sumpay")) {alert("折扣计算不正确!");return};
            var op = xmldata.selectSingleNode("//table/sumpay");    var _sumpay  = (!op)?"":op.text;
            var op = xmldata.selectSingleNode("//table/sumpayback");var _sumpayback  = (!op)?"":op.text;
            var op = xmldata.selectSingleNode("//table/bsumpay");   var _bsumpay  = (!op)?"":op.text;
            //ex=true时,为换货,总折扣金额为sumpayback,款号实际售价为payback
            $band("master").setFldStrValue(null,"总折扣金额",(!ex)?_sumpay:_sumpayback);
            $band("master").setFldStrValue(null,"应付现金",(!ex)?_sumpay:_sumpayback);
            for(var i=0;i<ob.RecordCount();i++)
            {
                var _styleno   = ob.getFldStrValue("款号",i);
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/pricedisc"); var _pricedisc  = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/qty");       var _qty        = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/payback");   var _payback    = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/discID");   var _discID        = (!op)?"":op.text;
                // _pricedisc为单价折扣
                var _unitpay = _pricedisc;
                if(ex){
                    var scs = ue_xmlsum(ob.XSS("//fgsaledetailnet[款号='"+_styleno+"']//数量"));
                    _unitpay = (scs!=0)?_payback/scs:0;
                    }
                ob.setFldStrValue(i,"实际售价",_unitpay*ob.getFldStrValue("数量",i));
                ob.setFldStrValue(i,"折扣单价",_unitpay);
                ob.setFldStrValue(i,"促销策略",_discID);
            }
            $band("detail").Sum();
            $("txtsale").value=_bsumpay;
            if(hint=="") if(ue_save("",true)) return true;
            else if(ue_save("计算完成!",true)) return true;
        }
        function ue_xmlsum(nodes)
        {
            var x=0;
            for(var i=0;i<nodes.length;i++)
                x=x+ToolUtil.Convert(nodes[i].text,"int");
            return x;
        }
        //退货时重新计算
        function _Rcalc(hint)
        {
            if($band("detail").IsModify()) ue_save("");
            var billcode=$band("master").Val("单据编号");
            var dept = ToolUtil.valueTag($("shops").tag,"DeptCode");if(!dept) dept = $SP("DeptCode");
            var cardType=($band("edit").Val("类别")=="")?"":$band("edit").Val("类别");
            var dtOrder=$band("master").Val("单据日期_格式");
          
            var strsql = "exec discBackBill '"+billcode+"','"+dept+"','"+cardType+"','"+dtOrder+"'";
            var xmldata = ue_ajaxdom(strsql);if(!xmldata) return;
            if(!xmldata.selectSingleNode("//table/sumpay")){alert("没有折扣金额!");return;}
            var _sumbackpay = (!xmldata.selectSingleNode("//table/sumpayback"))?0:xmldata.selectSingleNode("//table/sumpayback").text;
            $band("master").setFldStrValue(null,"退货金额",_sumbackpay);
            var ob = $band("detail");
            for(var i=0;i<ob.RecordCount();i++)
            {
                var _styleno   = ob.getFldStrValue("款号",i);
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/bkpricedisc"); var _pricedisc= (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/unitpayback"); var _payback  = (!op)?"":op.text;
                var op = xmldata.selectSingleNode("//table[styleno='"+_styleno+"']/discID");   var _discID        = (!op)?"":op.text;                
                if(ob.getFldStrValue("退货数量",i)!=0)
                    ob.setFldStrValue(i,"退货金额",_payback*ob.getFldStrValue("退货数量",i));
                else
                    ob.setFldStrValue(i,"退货金额",0);
                ob.setFldStrValue(i,"退货单价",_payback);
                ob.setFldStrValue(i,"促销策略",_discID);
            }
            $band("detail").Sum();
            if(hint=="") if(ue_save("",true)) return true;
            else if(ue_save("计算完成!",true)) return true;
        }

        function showbill(isnew,ex,nobg)
        {
            if(!isnew && (event.srcElement.innerText=="　" || event.srcElement.innerText=="")) return;
            GridUtil.usOnCellRFocusHandle();
            IsNew = isnew;
            _setWorkFlowParams("todo",isnew);
            $band("master").XQuery(true);
            //if(gband.Val("旺旺")==""){alert("请指定客户!");f1.focus(); return;};
            var billinfo = '<span datasrc="#fgsaleTab" datafld="经办人"></span> - 【单据编号：<span datasrc="#fgsaleTab" datafld="单据编号"></span>/&nbsp;日期：<span datasrc="#fgsaleTab" datafld="单据日期_格式"></span>】';
            if((isnew || ($band("todo").Val("编辑")=="是") && ($band("todo").Val("节点")=="起草")))
            {
                if(ex || $band("master").Val("主编号")) $band("master").exchange=true
                else $band("master").exchange=false;
                var strdiv = strbill("winbill","grdbill","master");
            }
            else
                var strdiv = strBrwbill();
            DlgWin("winbill","grdbill","销售单 - "+billinfo,"master",strdiv,730,365,null,null,nobg);
            delete strdiv;
            CollectGarbage();

            //取出权限节点确定是否可以编辑
            if(isnew) {
                $band("master").NewRecord();
                if($band("edit").Val("旺旺")!="") {
                    var flds = ["客户代码","快递地址","区县","省","市","联系人","联系电话"];
                    var vflds = ["旺旺","快递地址","区县","省","市","联系人","联系电话"];
                    for(var i=0;i<flds.length;i++)
                        $band("master").setFldStrValue(null,flds[i],$band("edit").Val(vflds[i]));
                    delete flds;delete vflds;
                    CollectGarbage();
                }
            };
            sband = $band("detail");
            sband.gridtype = 19;        sband.freecols = "款号";        sband.minwidth = "80px";
            if(isnew || $band("todo").Val("编辑")=="是" )
            {
                var flds = ["退货数量","退换原因","余量","数量","实际售价","退后实际售价","折扣单价","退后折扣单价"];
                var vflds = ["1","1","1","0","0","1","0","1"];
                for(var i=0;i<flds.length;i++)
                    sband.ColVisable(flds[i],vflds[i]);
                delete flds;delete vflds;
                CollectGarbage();
                if(isnew || $band("todo").Val("节点")=="起草")
                {
                    sband.barcode='<INPUT id="txtbar" class="gridbrowseB" onkeydown="selectbyBarCode()" style="text-indent:18;background-color: #F9F2E1;background-image:url(\'images/shirt.png\'); background-repeat:no-repeat;WIDTH:200;font-weight: bold" type="text" size="11" name="款号"/>\
                    <INPUT name="库位" filter="and"  class="xlandinput" style="display:none;width:100%;" type="text" size="11" value="" />\
                    <button class=txtbtn onclick="selectbyBarCode(1)" >&nbsp;<img src="images/find16.png" style="vertical-align:middle"/></button>';
                    $("insl").style.display="";$("linksave").style.display="";$("linkcalc").style.display="";$("linksubmit").style.display="";
                    $("linksubmit").innerHTML='<IMG src="images/oknote.png" style="vertical-align:middle" border="0" />\
                    <span style="text-align:left;cursor:hand" class="span60fn">提交</span>';
                }
                else{
                    $("linksubmit").innerHTML='<IMG src="images/8.png" style="vertical-align:middle" border="0" />完成淘宝录入!';
                    sband.gridtype = 17;
               }
            }
            else{ sband.barcode="";$("linksave").style.display="none";$("linkcalc").style.display="none";$("linksubmit").style.display="none";
            sband.gridtype = 17;$("insl").style.display="none"}
            sband.StrongGrid=true;
            var Grid = new XGrid("dvsband",sband,"in",null,1); 
            sband.XQuery(true);
            $("txtsale").value=$band("master").Val("总金额")-$band("master").Val("总折扣金额");
            return true;
        }
        function dlgbill()
        {
            GridUtil.usOnCellRFocusHandle();
            if(event.srcElement.innerText=="　" || event.srcElement.innerText=="") return;
            var ctrlsrc=event.srcElement;
            var billinfo = '【单据编号：<span datasrc="#fgsaleTab" datafld="单据编号"></span>/&nbsp;日期：<span datasrc="#fgsaleTab" datafld="单据日期_格式"></span>】';
            if(ctrlsrc.innerText=="退换")
            {
                var xmldata = ue_ajaxdom("exec Fs_当前退单 '"+$band("returngoods").Val("单据编号")+"'");
                var xmlv = xmldata.selectSingleNode("//table//num");
                var _num = (!xmlv)?0:parseInt(xmlv.text,10);
                if(_num>0){alert("已存在相关的退单,请办理后再重新退换!");return;};
                DlgWin("winbill","grdbill","销售单-"+billinfo,"master",strRbill(1,true),730);
            }
            else
                DlgWin("winbill","grdbill","销售单-"+billinfo,"master",strRbill(0),730);
            _setWorkFlowParams("returngoods");
            $band("master").XQuery(true);
            sband = $band("detail");
            var flds = ["退货数量","退换原因","余量","数量","实际售价","退后实际售价","折扣单价","退后折扣单价"];
            var vflds = ["0","0","0","1","1","0","1","0"];
            for(var i=0;i<flds.length;i++)
                sband.ColVisable(flds[i],vflds[i]);
            delete flds;delete vflds;
            CollectGarbage();
            sband.gridtype = 7;        sband.freecols = "款号";        sband.minwidth = "80px";
            sband.StrongGrid=true;     sband.editcol=",退货数量,退换原因,";
            var Grid = new XGrid("dvsband",sband,"in",null,1); 
            sband.XQuery(true);
            $band("detail").Sum();
            $band("master").CalXmlLand.Calculate();
            var zje = $band("detail").XmlSum.XMLDocument.selectSingleNode("/*/*/退后理论售价").text;
            var descje = $band("detail").XmlSum.XMLDocument.selectSingleNode("/*/*/退后实际售价").text;
            $("txtsale").value=zje-descje;
            return true;
        }
        function tmalert()
        {alert("请在办件查询中处理已进入审核中的办件")}
        function _setWorkFlowParams(itemname,isnew,wf)
        {
            if(!wf) wf="客服销售";
            if(isnew)
            {
                var prname = "workflow,startnode,节点";var prval  = "客服销售,起草,起草";
                var prnames = prname.split(",");       var prvals  = prval.split(",");
            }else
            {
                var prname = "workflow,单据编号,节点";        var prval  = wf+","+$band(itemname).Val("单据编号")+","+$band(itemname).Val("节点");
                var prnames = prname.split(",");var prvals  = prval.split(",");
            }        
            for(var i=0;i<prnames.length;i++)
                ToolUtil.setParamValue($("xmlparam").XMLDocument, prnames[i],prvals[i],"string", "S", null,"D");
        }
        function currentfindband()
        {
            var index = 0;
            for(var i=0;i<$N("状态1").length;i++)
                if($N("状态1")[i].checked) 
                {
                    return $N("状态1")[i].value;
                    break;
                }
        }
        function BeforeWinClose(wid)
        {
            var owin = dwobj(wid)
            if(owin && owin.items=="master" && ($band("master").IsModify() || $band("detail").IsModify()))
            {
        	    var result = confirm("数据已改变,是否放弃该销售单?");
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
            ue_save("提交成功!");
            ShowHide("winnodes","none");
            ShowHide("winbill","none");        
        }
        function ue_submit()
        {
            GridUtil.usOnCellRFocusHandle();
            var destnode = $band("gonodes").Val("名称");
            if(destnode==""){alert("请指定一个目的节点!");return;}
            $band("master").setFldStrValue(null,"目的节点",destnode);
            ToolUtil.setParamValue($XD(), "下一节点", $band("gonodes").Val("下一节点"), "s", "P", "", "Ts","");
            if(($band("todo").Val("节点")=="客服确认" || $band("todoback").Val("节点")=="退货确认") && !IsNew){simplesubmit();getsum(1);return;}
            var remote = $band("detail").XS("//fgsaledetailnet[调配代码!='' and 属性!='内部']/部门代码");
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
            var agent = $band("detail").XS("//fgsaledetailnet[代理代码!='']/部门代码");
            var odept = $band("detail").XS("//fgsaledetailnet[代理代码='' and 属性='内部']/部门代码");
            
            if(agent) var _dept=agent.text;
            else if(odept) var _dept=odept.text;
            $band("master").setFldStrValue(null,"接收部门",_dept);   
            var mbh = $band("master").Val("单据编号");
            ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mbh,"string", "S", null,"D");

             //处理副单-拣货单, 求出存在的库位数
            var ojh = $band("detail").XSS("//fgsaledetailnet[拣货='true']/部门代码")
            var ajh = appUnique(ojh);
            var o = $band("detail").XSS("//fgsaledetailnet[属性='内部']/部门代码");
            var a = appUnique(o);
            if(ajh.length>0)
            {
                for(var i=0;i<a.length;i++)
                {
                    var bh = mbh + "." + (i+1);
                    //var onode = $band("detail").XS("//fgsaledetailnet[库位='" + a[i] + "']/部门代码");
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
        //构造工作流实例
        function buildWorkflow(mbh,bh,reacivedept)
        {
           //
           var strsql = "EXECUTE Proc_flow_instanceSub\
                  '" + mbh + "','客服销售','" + bh + "','仓库拣货','','','拣货单','"+reacivedept+"','','起草','起草'\
                  ,'','','"+ $SP("DeptSaleName") + "','"+ $SP("DWName") + "',''";
           ue_ajaxdom(strsql,"1","",null,true);
        }
        function _calcvip()
        {
            var xmldata = ue_ajaxdom("exec calc_vip '"+$band("edit").Val("旺旺")+"','"+$band("master").Val("单据编号")+"',null");
            var xmlv = xmldata.selectSingleNode("//table")
            if(xmlv.selectSingleNode("消费金额")) $band("edit").setFldStrValue(null,"消费金额",xmlv.selectSingleNode("消费金额").text);
            if(xmlv.selectSingleNode("积分")) $band("edit").setFldStrValue(null,"积分",xmlv.selectSingleNode("积分").text);
            if(xmlv.selectSingleNode("类别")) $band("edit").setFldStrValue(null,"类别",xmlv.selectSingleNode("类别").text);
        }
        function x_newdetail(strxml)
        {return function(){newdetail(strxml);}}
        
        function newdetail(strxml)
        {
            var _xml = new ActiveXObject("Microsoft.XMLDOM")
            _xml.async=false;
            _xml.loadXML(strxml);
            var DRows = _xml.selectNodes("//fgsaledetailnet[number(退货数量)>0]");
            var cols = $band("detail").ColNames;
            for(var im=0;im<DRows.length;im++)
            {       
                $band("detail").NewRecord();         
                for(var i=0;i<cols.length;i++)
                {
                    if(cols[i]==$band("detail").keyCol || cols[i]==$band("detail").linkCol || !DRows[im].selectSingleNode(cols[i])
                        || cols[i]=="数量" || cols[i]=="条码数量" || cols[i]=="退货单价" || cols[i]=="已退数量" || cols[i]=="退货金额" || cols[i]=="理论售价" || cols[i]=="实际售价")
                        continue;
                    $band("detail").setFldStrValue(im,cols[i],DRows[im].selectSingleNode(cols[i]).text);
                    if(cols[i]=="退货数量") 
                        $band("detail").setFldStrValue(im,"数量",DRows[im].selectSingleNode(cols[i]).text);
                }
                $band("detail").setFldStrValue(im,"退货数量",0)
                $band("detail").CalXmlLand.Calculate();
            }
            $band("detail").Sum();
            $band("master").CalXmlLand.Calculate();
        }
        function _exchangesale(obackdept)
        {
            //生成一个新的销售单,并把原单号和主编号赋值为当前单号
            var srcbh = $band("master").Val("原单号");
            var curbh = $band("master").Val("单据编号");
            if(srcbh=="") srcbh = $band("master").Val("单据编号");
            var MRow  = $band("master").XS("//fgsale");
            var DRows = $band("detail").XSS("//fgsaledetailnet[number(退货数量)>0]");
            var strxml = DRows.context.xml;
            ShowHide("winbill","none",true);
            showbill(true,true);
            $band("master").backparam = obackdept;
            var cols = $band("master").ColNames;
            for(var i=0;i<cols.length;i++)
            {
                if(cols[i]==$band("master").keyCol || cols[i]==$band("master").linkCol || cols[i]=="快递条码" 
                 || cols[i]=="总金额" || cols[i]=="总折扣金额" || cols[i]=="总合计" || cols[i]=="退货金额" 
                 || cols[i]=="已退数量" || cols[i]=="已退金额" || cols[i]=="换退单号" || cols[i]=="应付现金")
                    continue;
                $band("master").setFldStrValue(null,cols[i],MRow.selectSingleNode(cols[i]).text);
            }
            $band("master").setFldStrValue(null,"主编号",curbh);//主编号用于退货单的跟踪
            $band("master").setFldStrValue(null,"原单号",srcbh);
            window.setTimeout(x_newdetail(strxml),500); 
        }
        
        //如果有backcode,则表示是直接退单,退单的父数据为当前销售单据
        function _backsale(o,nohint,dirback)
        {
            var a = appUnique(o);
            var bh = $band("master").Val("单据编号");
            var mbh = (!dirback)?$band("master").Val("主编号"):bh;
            var iserr=false;
            for(var i=0;i<a.length;i++)
            {
                if(a[i]=="") continue;
                var uid = ToolUtil.valueTag($("shops").tag,"UserAccounts");if(!uid) uid = $SP("UserAccounts");
                var strsql = "EXECUTE Proc_flow_instanceTuiHuoBy部门 '" + bh +"','"+ mbh +"','"+a[i]+"','','起草','','"
                    + uid +"','"+ $band("master").Val("退换备注")+"'";
                if(ue_ajaxdom(strsql,"1","",null,true)!="ok") {iserr=true;break;}
            }
            if(!iserr && !nohint) alert("申请完成！");
            var strsql = "EXECUTE FE_更新网店销售单数据 '" + bh +"','" + mbh +"'";
            ue_ajaxdom(strsql,"1","",null,true);
            _calcvip();
        }
        function _Rsubmit()
        {
            var o = $band("detail").XSS("//内部[number(../退货数量)>0]"); //可退回的部门,远程店销售后,如果退,则退回到总店
            if(o.length==0){alert("请指定退货数量!");return};
            if($CHK("R1").value==1) {
	            var result = confirm("系统将为您生成换货单,请确认! ");
                if(!result) return;
                $band("master").exchange=true;
                if(!ue_save("")) return;
                _exchangesale(o);
            }
            else 
               {
	                var result = confirm("系统将为您进行退货处理,请确认! ");
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
            if($band("todo").Val("单据编号").length<4){ShowHide("winbill","none");return};
            var result = confirm("您将删除该销售单，是否确认? \r\n提示：点『确定』进行删除，点『取消』返回单据! ");
            if(!result) return;
            if(!ue_banddelete("fgsaleTab")) {alert("删除失败!");return}
            if(ue_save("删除成功!")) ShowHide("winbill","none");
        }
        /*分步处理:
            1 根据商品库位判断是整单商品否属于同一个库,如果为同一库,则不分单,反之按库分单；
            2 分单处理策略：按库位分单,不同库位分成对应的一个拣货单，每个单的接收部门为库位所在部门，分单置主单单号.启动拣货单流程.
            3 参于分单的主销售单，流程从起草进入配货。待子单拣货单流程结束后主单才被激活.
        */
        function _mysubmit()
        {
            if(!IsNew && $band("todo").Val("节点")=="客服确认"){
        	    var result = confirm(" 已完成淘宝登记吗？请确认! ");
                if(!result) return;
	        }
	        else 
	        {
	            if($band("master").Val("指定快递")=="" || $band("master").Val("快递公司")=="")
	            {
	                var result = confirm(" 您未指定快递公司，是否提交? \r\n提示：点『确定』进行提交，点『取消』返回单据! ");
                    if(!result) return;
                }
                if($band("master").Val("指定快递")=="true" && $band("master").Val("快递公司")=="")
	            {alert("请填写快递公司!");return;}
	            if($band("master").Val("快递公司")!="")$band("master").setFldStrValue(null,"指定快递","true");
                if(sband.RecordCount()==0){alert("没有明细数据,请检查!");return;}
                if(!judge()) return;
                if($band("master").Val("单据编号").length<4)
                    if(!ue_save("")) return;
                if($band("master").exchange==true)
                    _Rcalc();
                else
                    _calc();
            }
            var oband = $band("gonodes");
            oband.XQuery();
            var remote = $band("detail").XS("//fgsaledetailnet[调配代码!='' and 属性!='内部']/部门代码");
            if(remote && $band("todo").Val("节点")!="客服确认")
            {
                var inners = oband.XSS("/*/*[名称!='提交处理中心']");
                for(var i=oband.RecordCount()-1;i>-1;i--)
                    oband.DeleteRowNode(inners[i]);
            }
            else
            {
                var inners = oband.XSS("/*/*[名称='提交处理中心']");
                for(var i=oband.RecordCount()-1;i>-1;i--)
                    oband.DeleteRowNode(inners[i]);
            }
            if(oband.RecordCount()==0){alert("没有可进退回的节点!");return;}
            if(oband.RecordCount()==1){ue_submit();return};
            var str='<div style="width:98%;height:70%;" id="gonodes"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
            +'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
            DlgWin("winnodes","dvnodes","提交节点选择","gonodes",str,500,300);
            oband.gridtype = 1;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
            new XGrid("gonodes",oband,"in",null,1,1);
        }
        function _okback()
        {
            GridUtil.usOnCellRFocusHandle();        
    	    var result = confirm(" 已完成退货吗？请确认! ");
            if(!result) return;
            var wf = "客服退货";
            var prname = "workflow,单据编号,节点";var prval  = wf+","+$band("todoback").Val("单据编号")+","+$band("todoback").Val("节点");
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
            var destnode = $band("gonodes").Val("名称");
            if(destnode == ""){alert("请指定一个目的节点!");return;}
            var nodes = ["下一节点","单据编号","单据日期","workflow","跟单员","完成日期","项目名称","接收部门","目的节点","节点","startnode","提交方向","项目类别"];
            var vnodes = [$band("gonodes").Val("下一节点"),$band(item).Val("单据编号"),$band(item).Val("单据日期"),wf,"","","","",$band("gonodes").Val("名称"),
                $band(item).Val("节点"),"起草","",""];
            for(var i=0;i<nodes.length;i++)
                ToolUtil.setParamValue($XD(), nodes[i], vnodes[i],"string", "B", item,"C","D");
            delete nodes;
            delete vnodes;
            CollectGarbage();
        }
        function _delparams(item)
        {
            var nodes = ["下一节点","单据编号","单据日期","workflow","跟单员","完成日期","项目名称","接收部门","目的节点","节点","startnode","提交方向","项目类别"];
            for(var i=0;i<nodes.length;i++)
                ToolUtil.delParam($XD(), nodes[i], "B", item,"C");
            delete nodes;
            CollectGarbage();
        }
        function judge()
        {
            //如果存在代理发货仓库,则合法
            var agent = $band("detail").XS("//fgsaledetailnet[代理代码!='']/部门代码");
            if(agent) return true;
            //如果不存在代理仓库,并且有多个非调配分仓库(内部),则非法
            var odept = $band("detail").XSS("//fgsaledetailnet[代理代码='' and 调配代码='']/部门代码");
            if(!odept){
                alert("所选商品没有归属仓库,请检查!");return false;
            }
            var s="";
            for(var i=0;i<odept.length;i++)
                s=s+","+odept[i].text;
            s=s.substring(1,s.length);
            var a = unique(s.split(","));
            if(a.length>1)
            {
                alert("所选商品属于多个不同仓库,请分别下单!");return false;
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
        var s=  '<fieldset style="padding: 2px;;width:99%"><legend><font face="微软雅黑">主要信息：</font></legend>\
            <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
            <td><p><span class="span50fn">旺旺：</span><input datasrc="#netcustomerTab" datafld="旺旺" class="xlandinput" style="width:90;" type="text"  /><font face="Wingdings" color="#ff0000">v</font>\
            <span class="span50fn">姓名：</span><input datasrc="#netcustomerTab" datafld="姓名" class="xlandinput" style="width:60;" type="text"  />\
            <span class="span50fn">类别：</span><input datasrc="#netcustomerTab" datafld="类别" class="xlandinput" style="width:50;" type="text"  />\
            <button class="txtbtn" onclick="incontacts()">联系方式..<img border="0" style="cursor:hand;vertical-align:middle" src="Images/go1.png"  /></button>\
            【<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">保存</a>】【<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'winpanel\',\'none\');">关闭</a>】\
            <br/><span class="span50fn">热点：</span><input datasrc="#netcustomerTab" datafld="热点" class="xlandradio" type="checkbox" />\
            <span class="span120" style="width:128">热点备注：</span><input datasrc="#netcustomerTab" datafld="热点备注" class="xlandinput" style="width:280" type="text"  />\
    　　　  </p>\
            </td></tr></table></fieldset>\
            <fieldset style="padding: 2px;height:320;width:99%"><legend><button id="docbtn0" class="txtbtn" onclick="exchangedoc(0)">\
            <img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />交流信息</button>\
            <button id="docbtn1" class="txtbtn" onclick="exchangedoc(1)">基础资料</button></legend>\
            <div id="dvpanel" class="tablescroll" style="text-align:left;height:300; OVERFLOW-y:auto"></div></fieldset>';
        DlgWin("winpanel","dvpanel","VIP登记","edit",s);
        delete s;
        CollectGarbage();        
        exchangedoc(0);
    }
    function exchangedoc(flag)
    {
        $band("edit").ForceWidth = "130";$band("edit").splitrow=2;
        if(flag==0){
            $("docbtn0").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />交流信息';
            $("docbtn1").innerHTML='基础资料';
            $band("edit").startpos = 19;$band("edit").endpos=""}
        else{
            $("docbtn0").innerHTML='交流信息';
            $("docbtn1").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />基础资料';
            $band("edit").startpos = 0;$band("edit").endpos = 19;}
        YPanel("edit","dvpanel",null,1,"@客服=1,@生日礼卷赠送=1",190);
    }
    function incontacts()
    {
        var s= '<div id="dvcontacts" class="tablescroll" style="height:99%;width:100%;"></div><div style="text-align:left;background-color: #C0C0C0"><span class="span80fn"><font face="Wingdings" color="#ff0000">v</font>快递地址：</span><input datasrc="#contactsTab" datafld="快递地址" class="xlandinput" style="width:400;" type="text"  /></div>';
        DlgWin("wincontacts","dvcontacts","联系人详细信息","contacts",s,600,300);
        var ob=$band("contacts");ob.gridtype = 8;  ob.freecols = "快递地址"; ob.StrongGrid=true;ob.minwidth = "80px";     
        var Grid = new XGrid("dvcontacts",$band("contacts"),"in",null,1,1);
        ob.XQuery();
    }
    function cboAfterUpdate(e)
    {
        if(e && e.dataFld && (e.dataFld=="省" || e.dataFld=="市"))
            showtmp();
        if(e.id=="shops") newPms();
    }
   
    function showtmp()
    {
        var city = $band("edit").Val("城市代码");
        if(city=="" || $band("edit").Val("市")=="") {$("txtweather").innerText="";return;}
	    var xmlhttp = ue_ajaxdom("exec FS_天气预报 '"+$band("edit").Val("市")+"'",null,null,null,null,true)
        xmlhttp.onreadystatechange = function()
        {
           if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
           {
                xmldata = xmlhttp.responseXML;
                delhttp(xmlhttp);
                w1 = (!xmldata.selectSingleNode("//weather"))?"":xmldata.selectSingleNode("//weather").text;
                gweather = $band("edit").Val("旺旺")+"："+w1;            
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
                    gtweather = $band("edit").Val("旺旺")+"："+$band("edit").Val("市")+" 天气:" +w2+" 温度:" +w1;
                }
                $("txtweather").innerText=gweather.replaceAll("今日","");
           }
        }
    }    
    function strbill(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        if($band(bandname) && $band(bandname).exchange)
            var strcalcbtn = "_calc(null,true)";
        else var strcalcbtn = "_calc()";
	    var s ='<fieldset style="padding: 1px;float:left;text-align:left;width:72%;height:125px"><legend><font face="微软雅黑">摘要信息：</font></legend>\
	        <span class="span70fn">客　　户：</span><INPUT datasrc="#fgsaleTab" datafld="客户代码" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input id="insl" title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
		    <span class="span90fn">合　　计：</span><INPUT datasrc="#fgsaleTab" datafld="总合计" class="xlandinput" style="WIDTH:60;" type="text" size="11"/>(件)\
		    <span class="span70fn" style="width:71px;color:#800000">发货日期：</span><INPUT datasrc="#fgsaleTab" datafld="预计上货时间_格式" class="xlanddate" style="WIDTH:80;" type="text" size="11"/>\
		    <p style="margin:1">\
            <span class="span70fn">总&nbsp;&nbsp;金&nbsp;&nbsp;额：</span><INPUT datasrc="#fgsaleTab" datafld="总金额" class="xlandinput" style="WIDTH:90;" type="text" size="11"/>(元)\
		    <span class="span80fn" style="width:70">优惠金额：</span><INPUT id="txtsale" readonly class="xlandinput" style="WIDTH:60;" type="text" size="11"/>\
		    <span class="span90fn">应付现金：</span><INPUT id="Text1" datasrc="#fgsaleTab" datafld="应付现金" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>(元)\
		    </p><p style="margin:1">\
            <span class="span70fn">快递地址：</span><INPUT datasrc="#fgsaleTab" datafld="快递地址" class="xlandinput" style="WIDTH:243;" type="text" size="11"/><input id="insl" title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
		    <span class="span90fn">联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span><INPUT datasrc="#fgsaleTab" datafld="联系人" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1">\
            <span class="span70fn">快递公司：</span><INPUT datasrc="#fgsaleTab" datafld="快递公司" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input id="insl" title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:4px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/><input type="checkbox" datasrc="#fgsaleTab" datafld="指定快递" class="xlandradio">指定快递公司\
            <input type="checkbox" datasrc="#fgsaleTab" datafld="免运费" class="xlandradio">免运费\
		    <span style="width:86;text-align:right;font-family: 微软雅黑;">快递方式：</span><INPUT datasrc="#fgsaleTab" datafld="快递方式" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1">\
            <span class="span70fn">备　　注：</span><input type="text" class="xlandinput" datasrc="#fgsaleTab" datafld="备注" style="width:416;" /></p>\
	        </fieldset><fieldset style="padding: 1px;text-align:center;float:right;width:27%;height:125px"><legend><font face="微软雅黑">操作信息：</font></legend>\
    		<p><A id="linksave" class="linkbtn_0" href="#" target="_self" onclick="_save()"><IMG src="images/SaveHS.gif" style="vertical-align:middle" border="0" /><span style="text-align:left" class="span60fn">保存</span></A>\
		    <A id="linkcalc" class="linkbtn_0" href="#" target="_self" onclick="'+strcalcbtn+'"><IMG src="images/calc.png" style="vertical-align:middle" border="0" />折扣计算</A>\
		    <br /><br /><A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_mysubmit()">\
		    <IMG src="images/oknote.png" style="vertical-align:middle" border="0" /><span style="text-align:left" class="span80fn">提交</span></A>\
		    <A id="linkdel" class="linkbtn_0" href="#" target="_self" onclick="_mydelbill()">\
		    <IMG src="images/delete_16x16.gif" style="vertical-align:middle" border="0" />删除单据</A></p>\
	        </fieldset>\
	        <div id="dvsband" style="padding: 1px;height:200px;width:100%;"></div>\
	        <p style="margin:1;color: #993300">　重要提示:1.从直营店发货时,需在处理中心做出处理后才改变在线库存数量!　2.如指定发货日期,则系统在发货日期前不许发货!</p>\
	        ';	    
        return s;
    }    

    function strBrwbill()
    {
	    var s ='<fieldset style="padding: 1px;float:left;text-align:left;width:72%;height:126px"><legend><font face="微软雅黑">摘要信息：</font></legend>\
	        <span class="span70fn">客　　户：</span><INPUT datasrc="#fgsaleTab" datafld="客户代码" disabled class="xlandinput" style="WIDTH:90;" type="text" size="11"/>\
		    <span class="span90fn">合　　计：</span><INPUT datasrc="#fgsaleTab" datafld="总合计" disabled class="xlandinput" style="WIDTH:60;" type="text" size="11"/>(件)\
		    <span class="span70fn" style="width:71px;color:#800000">发货日期：</span><INPUT disabled datasrc="#fgsaleTab" datafld="预计上货时间_格式" class="xlanddate" style="WIDTH:80;" type="text" size="11"/>\
		    <p style="margin:1"><span class="span70fn">总&nbsp;&nbsp;金&nbsp;&nbsp;额：</span><INPUT disabled datasrc="#fgsaleTab" datafld="总金额" class="xlandinput" style="WIDTH:90;" type="text" size="11"/>(元)\
		    <span class="span70fn">优惠金额：</span><INPUT id="txtsale" disabled class="xlandinput" style="WIDTH:60;" type="text" size="11"/>\
		    <span class="span90fn">应付现金：</span><INPUT disabled datasrc="#fgsaleTab" datafld="应付现金" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>(元)\
		    </p><p style="margin:1"><span class="span70fn">快递地址：</span><INPUT disabled datasrc="#fgsaleTab" datafld="快递地址" class="xlandinput" style="WIDTH:243;" type="text" size="11"/>\
		    <span class="span90fn">联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span><INPUT disabled datasrc="#fgsaleTab" datafld="联系人" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1"><span class="span70fn">快递公司：</span><INPUT disabled datasrc="#fgsaleTab" datafld="快递公司" class="xlandinput" style="WIDTH:90;" type="text" size="11"/><input type="checkbox" disabled datasrc="#fgsaleTab" datafld="指定快递" class="xlandradio">指定快递公司\
            <input type="checkbox" datasrc="#fgsaleTab" disabled datafld="免运费" class="xlandradio">免运费\
		    <span class="span90fn" style="width:86">快递方式：</span><INPUT disabled datasrc="#fgsaleTab" datafld="快递方式" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    </p><p style="margin:1"><span class="span70fn">备　　注：</span><input type="text" disabled class="xlandinput" datasrc="#fgsaleTab" datafld="备注" style="width:243;" />\
		    <span class="span90fn">快递号码：</span><INPUT disabled datasrc="#fgsaleTab" datafld="快递条码" class="xlandinput" style="WIDTH:80;" type="text" size="11"/></p>\
	        </fieldset><fieldset style="padding: 1px;float:right;width:27%;height:126px"><legend><font face="微软雅黑">操作信息：</font></legend>\
	        <br /><A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_mysubmit()"><IMG src="images/8.png" style="vertical-align:middle" border="0" />提交</A></fieldset><div id="dvsband" style="padding: 1px;height:215px;width:100%;"></div>';	    
        return s;
    }    

    function strRbill(flag,ex)
    {
        if(ex){var sumcnt = "总合计";summny="总金额";sumsalemny="总折扣余额";}
        {var sumcnt = "总余量";summny="总余额";sumsalemny="总折扣余额";}
	    var s ='<table border="0" cellpadding="0" style="border-collapse: collapse;width:100%;height:100%">\
	        <tbody><tr><td style="height:50px">\
		    <span class="span80fn">营业员：</span><INPUT datasrc="#fgsaleTab" datafld="经办人" class="xlandinput" style="WIDTH:80;" type="text" size="11"/><input id="insl" title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:3px;width:22px;height:15; position:absolute" onclick="Xcbo(\'fgsaleTab\')"/>\
            <span class="span50fn">合计：</span><INPUT datasrc="#fgsaleTab" datafld="'+sumcnt+'" class="xlandinput" style="WIDTH:40;" type="text" size="11"/>(件)';
        var s1='　　　　　　　<A id="linksave" class="linkbtn_0" href="#" target="_self" onclick="ue_save()"><IMG src="images/save.gif" style="vertical-align:middle" border="0" />保存</A>\
              <A id="linkcalc" class="linkbtn_0" href="#" target="_self" onclick="_Rcalc()"><IMG src="images/calc.png" style="vertical-align:middle" border="0" />重新计算折扣</A>\
		    　<A id="linksubmit" class="linkbtn_0" href="#" target="_self" onclick="_Rsubmit()"><IMG src="images/8.png" style="vertical-align:middle" border="0" />提交</A>&nbsp;<input type="radio" id="rtnex1" style="cursor:hand" value="0" checked name="R1" ><label style="cursor:hand" for="rtnex1">退货</label>&nbsp;<input type="radio" id="rtnex2" style="cursor:hand" value="1" name="R1"><label style="cursor:hand" for="rtnex2">换货</label>';
		var s2='<hr size="1" noshade style="text-align:center;width:98%;border:1px dotted #000000">\
            <span class="span80fn">总金额：</span><INPUT datasrc="#fgsaleTab" datafld="'+summny+'" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">优惠金额：</span><INPUT id="txtsale" readonly class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">已付金额：</span><INPUT datasrc="#fgsaleTab" datafld="'+sumsalemny+'"  class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">应退现金：</span><INPUT datasrc="#fgsaleTab" datafld="退货金额"  class="xlandinput" style="WIDTH:45;" type="text" size="11"/>(元)\
		    <br />\
		    <span class="span80fn">旺旺ID：</span><INPUT datasrc="#fgsaleTab" datafld="客户代码" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">联系人：</span><INPUT datasrc="#fgsaleTab" datafld="联系人" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <span class="span60fn">联系电话：</span><INPUT datasrc="#fgsaleTab" datafld="联系电话" class="xlandinput" style="WIDTH:80;" type="text" size="11"/>\
		    <hr size="1" noshade style="text-align:center;width:98%;border:1px dotted #000000">\
		    <span class="span80fn" style="color:#663300">退换备注：</span><INPUT datasrc="#fgsaleTab" datafld="退换备注" class="xlandinput" style="WIDTH:365;" type="text" size="11"/>\
	        <br /><br /></td></tr>\
	        <tr><td id="dvsband" style="height:250px;width:100%;"></td></tr></tbody>\
	    </table>';
	    if(flag==1) s=s+s1+s2;
	    else s=s+s2;
        return s;
    }    
        
        function ts_filter()
        {
            var strfilter = "( dbo.fun_getPY(颜色名称) like '"+$("txtbar").value+"%' or 颜色名称 like '"+$("txtbar").value
            +"%' or dbo.fun_getPY(款号) like '"+$("txtbar").value+"%' or 款号 like '"+$("txtbar").value+"%' or 款号颜色条码 like '" +$("txtbar").value +"%' );\
            dbo.fun_getPY(颜色名称);颜色名称;dbo.fun_getPY(款号);款号;款号颜色条码;"+$("txtbar").value+"：slgoods";
	        usfiltercmd(strfilter)
        }
        function showflow()
        {
            if(!$band("record").active) return;
            var winid="winflow";
            var owin = dwobj(winid);
    	    var sql= "exec wf_show '客服销售'"
    	    var xmldata = ue_ajaxdom(sql);
    	    var htmlstr = xmldata.selectSingleNode("//table/htmlstr").text;
            var str='<table><tr><td><div style="Z-INDEX: 100; WIDTH: 100%;  POSITION: absolute;HEIGHT: 100%; TOP: 10px; CURSOR: default; LEFT: 1px" id=Canvas>'+htmlstr+"</div></td></tr></table>";
            DlgWin(winid,"dvflow","流程监控 - "+"【客服销售 ("+$band("record").Val("单据编号")+")】","record",str,690)
            GridUtil.usOnCellRFocusHandle();   
            ToolUtil.setParamValue($XD(), "单据编号", $band("record").Val("单据编号"),"string", "B", "record","C","D");
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
    	    if(objs[i].id==$band("inflow").Val("节点编码"))
    	    {
    	        objs[i].strokecolor="#f90";
    	        objs[i].fillcolor = "#f90"
    	        objs[i].style.cursor="hand";
    	        objs[i].title="责任人："+ob.Val("经办人")+"\r\n接收时间："+$band("inflow").Val("接收时间")+"\r\n结果时间："
    	        +$band("inflow").Val("结果时间");
    	    }
    	    else{
    	        objs[i].strokecolor="gray";
    	        if(_xmldata)
    	        {
    	            var _zrr="";var _sdt="";var _edt="";
    	            if(_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//姓名"))
    	                var _zrr = "责任人："+_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//姓名").text;
    	            if(_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//接收时间"))
    	                var _sdt = "接收时间："+_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//接收时间").text;
    	            if(_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//接收时间"))
    	                var _edt = "完成时间："+_xmldata.selectSingleNode("//wfmonitor[节点编码='"+objs[i].id+"']//结果时间").text;
    	            objs[i].title=_zrr+"\r\n"+_sdt+"\r\n"+_edt;
    	            objs[i].style.cursor="hand";
    	            if(_zrr+_sdt+_edt==""){
    	                objs[i].style.cursor="default";
    	                objs[i].title="未办理"
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
        if(inputctrl.innerText=="　" || parseInt(inputctrl.innerText,10)<1) 
        {alert("没有可选择的尺码!");return}
        ClearSelAll(band.ItemName);
        var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
        var oSelCheck = trcur.cells[1].childNodes[0];
        oSelCheck.checked = true;
        oSelCheck.fireEvent("onclick");
        var wid="wingoods"; var gridname = "dvgoods"
        var chkids = "款号,颜色名称,尺码";var sumfld="数量";var eqflds="@尺码="+inputctrl.colname;
        if(tobuy(wid,gridname,band.ItemName,true,inputctrl.colname,chkids,sumfld,eqflds))
        {
            inputctrl.innerText=parseInt(inputctrl.innerText,10)-1
            $band("detail").setFldStrValue(null,"尺码",inputctrl.colname);
            $band("detail").setFldStrValue(null,"尺码T",inputctrl.colname);
            ClearSelAll(band.ItemName);
        }
    }
    function selectbyBarCode(flag)
    {
        if ((!flag || flag==2) && (event.keyCode && event.keyCode != 13)) return;
        if(!flag) flag=1;
        $loading();
        var ostores = $N("库位");
        for(var i=0;i<ostores.length;i++)
            if(ostores[i].value=="") ostores[i].value = instore;
        $band("slgoods").Asyn=true;
        var bandname ="slgoods";  var ob=$band(bandname);  var wid="wingoods"; var gridname = "dvgoods";
        ue_tfilter(bandname);
        $band("slgoods").AfterXQuery=function()
        {
            $loading("none");
            if(!$("xMsg"+wid) || $("xMsg"+wid).style.display=="none") 
                DlgWin(wid,gridname,"库存查询",bandname,strgood(wid,gridname,bandname,flag),630,280,"top",null,true);
            ob.gridtype = 13;  ob.freecols = "款号"; ob.minwidth = "120px";ob.noxml=true;ob.StrongGrid=true;
            var Grid = new XGrid(gridname,ob,"in",true,1,1);
            try{
                if($("g款号")) $("g款号").focus();
            }
            catch(ex){};            
        };
    } 
    function strgood(winid,gridname,bandname,flag)
    {
        if(!bandname) bandname="";
        var s= '<table border="0" width="99%" cellpadding="5" style="border-collapse: collapse"  ><tr>\
        <td width="40" align="right">款号：</td><td width="80"><input id=\"g款号\" name=\"款号\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 100%;\"></td>\
        <td width="40" align="right">颜色：</td><td width="60"><INPUT name="dbo.fun_getPY(颜色名称);颜色名称;款号" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>\
        <td width="40" align="right">尺码：</td><td width="40"><INPUT id="尺码" name="" class="tinput" style="width:100%;" type="text" size="11"  /></td>\
        <td width="90" align="right"><label for="chkout">包含直营店：</label></td><td width="50"><input id="chkout" onclick=chkstore("'+bandname+'") type="checkbox" name="" value="ON" />\
        <INPUT name="库位" id="sl库位" filter="and"  class="xlandinput" style="display:none;width:100%;" type="text" size="11" value="" /></td>\
        <td width="30"><img border="0"  style="cursor:hand" src="Images/find16.png" onclick=_tfilter("'+bandname+'")  /></td>';
        if(flag==2)
        {
            var s0='';
        }
        else            
            var s0='<td width="90" align="center"><button id="Button2" class="txtbtn" \
            onclick=tobuy("'+winid+'","'+gridname+'","'+bandname+'","无此产品！")><img border="0" style="cursor:hand;vertical-align:middle"\
            src="Images/buy1.gif"  /> 下单</button></td>';
        var s1 = '</tr></table><div style="width:99%;height:96%;" id="'+gridname+'"></div>';
        return s+s0+s1;
    }
    function _tfilter(item)
    {
        ToolUtil.setParamValue($XD(), "尺码", (!$("尺码"))?"":$("尺码").value,"string", "B", item,"C","D");
        ue_tfilter(item);
    }
    function chkstore(item)
    {
        $("sl库位").value = (!event.srcElement.checked)?instore:"";
        _tfilter(item);
        
    }
    function oklocate(winid,gridname,bandname,hint,keywords,intype,dstband,dstfld)
    {
        var ob = $band(bandname);
        //手工checkin
        var colname = "选择";
        var coltype=ob.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+colname+"']/@type");
        var _datatype="";
        if(coltype) var _datatype = coltype.value;
        if(_datatype!="xs:boolean")
            var xmlRows=ob.XSS("/*/*[@selected='-1' or @selected='1' or @selected='true']");
        else 
            var xmlRows=ob.XSS("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
        var khs="";
        for(var i=0;i<xmlRows.length;i++)
            khs=khs+","+xmlRows[i].selectSingleNode("款号").text;
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
        var chkrows = $band(bandname).XSS("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
        if(!chkrows || chkrows.length==0){alert("请选择商品!");return;};
    
        if(!isExist("winbill")) return;
        //if(!showbill(true,null,true)){$("g款号").focus(); return;}
        var ob = $band(bandname);
        ob.IsImport="1";
        $band("detail").exportItem=bandname;
        document.importItem="detail";  
        if(ue_import(bandname,"import",null,chkids,null,sumfld,eqflds))
        {
            if(!noRtn) ShowHide(winid,"none");return true
        };
    }
