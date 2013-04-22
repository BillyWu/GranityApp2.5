        var gband;gWeather=""; var IsNew=false;
        var leghint = '购买记录 <A class="linkbtn_0" href="#" onclick="showbill(true);"><img border="0" src="Images/new3.gif" />&nbsp;购物单</A>';
        var leghints = [leghint]; 
        var elems1 = ["客户信息","购买记录","退/换货记录","销售机会","保存"];
        var elemsevent1 = ["secBoard(0)","secBoard(1)","secBoard(2)","secBoard(3)","ue_save()"];  
        var elems2 = ["全部数据","客户","意向客户"];
        var elemsevent2 = ["_location(0)","_location(1)","_location(2)"];   
        var elems3 = ["在线库存","VIP销售统计","客户退换货统计","日销售统计","销售汇总统计","商品营销统计报表...","营业员业绩分析","商品综合查询"];
        var elemsevent3 = ["showchart()","","","","","","","","",""];  
        var trText = '省#<select id="省" name="省" style="width:100px"></select><br/><span style="width:70;text-align:right">地市：</span><select id="市" name="市" style="width:100px"></select><br/><span style="width:70;text-align:right">区县：</span><select id="区县" name="区县" style="width:100px"></select>';

        function initWin(){
            InitView();
            gband=$band("edit");
            ToolUtil.setParamValue($XD(), "islocation", "1","string", "B", "edit","C","D");
            ToolUtil.setParamValue($XD(), "vip", "1","string", "B", "edit","C","D");

            gband.Asyn =true;
            gband.maxwidth=150;
            gband.gridtype = 81;
            gband.freecols = "快递地址";gband.StrongGrid=true;
            new XGrid("dvCustTab",gband,"in",null,1);

            if(!gband.active) _location(2,$("tablelbldiv1"));
            gband.AfterXQuery = function()
            {
                $N("范围1")[0].checked=true;
                $DPCM("Filter",this.ItemName);
                $loading("none");
            
            }
            gband.AfterRowChanged=function()
            {
                if(!this.Grid) return;showtmp();
            }
        }
      
        function InitView()
        {
            if($("tbdiv"))ueToolbar("tbdiv",elems1,elemsevent1);
            ueLabel("lbldiv1",elems2,elemsevent2);   
            ueLabel("lbldiv2",elems3,elemsevent3,1); 
            if($("tablelbldiv1"))$("tablelbldiv1").style.display="";
            if($("fSearchText")) $("fSearchText").name = SearchFields;
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
                    rcdfilter("record",n)
                    break;
                case 2:
                    rcdfilter("recordback",n)
                    break;
                case 3: 
                    var oband=$band("销售机会");  oband.title = "销售机会";  oband.minwidth = "80px";  oband.freecols = "主题";
                    oband.dicts="@状态=未结束/结束/取消,@阶段=初期沟通/商务谈判/签约";  oband.gridtype = 8;
                    var Grid = new XGrid("dvopport",oband,"in",null,1);
                    oband.XQuery();
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
            band.ForceWidth = "80";band.splitrow=3;
            YPanel(band.ItemName,"dvoppanel",null,1,"@需求=1",200);
	    }
        function rcdfilter(item,n)
        {
            if($CHK("范围"+n).value==0)
                $("VIP"+n).value = $band("edit").Val("姓名");
            else $("VIP"+n).value="";
            officeQuery(item,"recorddiv"+n,n)
        }
        function officeQuery(itemname,griddiv,n)
        {
            var ob=$band(itemname);
            ue_tfilter(itemname,$("table2"));
            ob.gridtype = 7; ob.freecols = "VIP"; ob.minwidth = "60px";ob.StrongGrid=true;ob.noxml=true;
            var Grid = new XGrid(griddiv,ob,"in",null,1);  
            getsum(n);
        }
        function getsum(n)
        {
            var strsql="exec FS_VIP购买总量 '" +$band("edit").Val("旺旺") +"'";
            var xmldata = ue_ajaxdom(strsql);if(!xmldata) return;    
            $("addCount"+n).innerText = (!xmldata.selectSingleNode("//table/addcount"))?"":xmldata.selectSingleNode("//table/addcount").text;
            $("addMoney"+n).innerText = (!xmldata.selectSingleNode("//table/addmoney"))?"":xmldata.selectSingleNode("//table/addmoney").text;
            $("backcount"+n).innerText = (!xmldata.selectSingleNode("//table/backcount"))?"":xmldata.selectSingleNode("//table/backcount").text;
            $("backmoney"+n).innerText = (!xmldata.selectSingleNode("//table/backmoney"))?"":xmldata.selectSingleNode("//table/backmoney").text;
            $("actualcount"+n).innerText = (!xmldata.selectSingleNode("//table/actualcount"))?"":xmldata.selectSingleNode("//table/actualcount").text;
            $("actualmoney"+n).innerText = (!xmldata.selectSingleNode("//table/actualmoney"))?"":xmldata.selectSingleNode("//table/actualmoney").text;        
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
                    window.open("http://www.taobao.com/webww/index.php?ver=3&touid="+stoolv+"&siteid=cntaobao&status=1&charset=utf-8","","top=0px,left=0px,width=10px,height=10px,location=no");
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
             if(IsNew && $band("edit").Val("旺旺")!="" && $band("master").RecordCount()!=0) 
                $band("master").setFldStrValue(null,"客户代码",$band("edit").Val("旺旺"))
             if(gWeather!="") $band("master").setFldStrValue(null,"天气情况",gWeather)
             return true;
          }
          function _location(flag,keytable){
                $loading();
                switch(flag)
                {
                    case 0: $("f1").value="";$("f2").value="";$("f3").value="";$("f5").value="";$("f4").value="";break;
                    case 1: $("f4").value=1;$("f1").value="";$("f2").value="";$("f3").value="";$("f5").value="";break;
                    case 2: $("f5").value="1";$("f1").value="";$("f2").value="";$("f3").value="";$("f4").value="";break;
                    default:
                        $("f4").value="";$("f5").value="";
                }                
                //if($("f1").value=="" && $("f2").value=="" && $("f3").value=="" && $("f0").value=="") return;
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
        function ue_xmlsum(nodes)
        {
            var x=0;
            for(var i=0;i<nodes.length;i++)
                x=x+ToolUtil.Convert(nodes[i].text,"int");
            return x;
        }
        function tmalert()
        {alert("请在办件查询中处理已进入审核中的办件")}
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
        function afterWinClose(wid)
        {
            var owin = dwobj(wid)
            if(owin && owin.items=="master" && currentfindband() && mainTable.tag==1) {$band(currentfindband()).XQuery();return}
        }
        function x_newdetail(strxml)
        {return function(){newdetail(strxml);}}
        
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
            <span class="span120" style="width:130">热点备注：</span><input datasrc="#netcustomerTab" datafld="热点备注" class="xlandinput" style="width:280" type="text"  />\
    　　　  </p>\
            </td></tr></table></fieldset>\
            <fieldset style="padding: 2px;height:320;width:99%"><legend><button id="docbtn0" class="txtbtn" onclick="exchangedoc(0)">\
            <img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />交流信息</button>\
            <button id="docbtn1" class="txtbtn" onclick="exchangedoc(1)">基础资料</button></legend>\
            <div id="dvpanel" class="tablescroll" style="text-align:left;height:300; OVERFLOW-y:auto"></div></fieldset>';
        DlgWin("winpanel","dvpanel","VIP登记","edit",s);
        exchangedoc(0);
    }
    function exchangedoc(flag)
    {
        $band("edit").ForceWidth = "130";$band("edit").splitrow=2;
        if(flag==0){
            $("docbtn0").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />交流信息';
            $("docbtn1").innerHTML='基础资料';
            $band("edit").startpos = 21;$band("edit").endpos=""}
        else{
            $("docbtn0").innerHTML='交流信息';
            $("docbtn1").innerHTML='<img border="0" style="cursor:hand;vertical-align:middle" src="Images/next10.png"  />基础资料';
            $band("edit").startpos = 0;$band("edit").endpos = 21;}
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
            showtmp()
    }
   
    function showtmp()
    {
        var city = $band("edit").Val("城市代码");
        if(city=="" || $band("edit").Val("市")=="") {$("txtweather").innerText="";return;}
	    var xmldata = ue_ajaxdom("exec FS_天气预报 '"+$band("edit").Val("市")+"'");
	    if(!xmldata) return;
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
        function _tfilter(item)
        {
            ToolUtil.setParamValue($XD(), "尺码", (!$("尺码"))?"":$("尺码").value,"string", "B", item,"C","D");
            ue_tfilter(item);
        }
