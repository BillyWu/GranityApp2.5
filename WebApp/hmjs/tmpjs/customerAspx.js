      initsysparams();//初始化系统参数
      window.onload=WinLoadUtil.MDTPLoad;
      var mband;
      var g_readonly = true; //全程变量，表示系统修改状态,从表随主表状态而定
      function initWin()
      {
        mband=document.UnitItem.getBandByItemName("字典信息");
        mband.Query();
        var Grid = new AGrid("Div2",mband,"in");
        mband.Grid = Grid;
      }
    function openPro(winid)
    {
        var inputctrl=event.srcElement;
        //设置当前行当前单元格
        var tdcol=inputctrl.parentElement;
        var trcur=tdcol.parentElement;
    
//                var rowIndex = cur_row;
        mband.setCurrentRow(trcur.rowIndex);
        if(!winid) winid="1";
        var owin = dwobj(winid);
        var str=strfind(winid,null,mband);
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 700;
            owin.height = 480;
            owin.top    = 130;
            owin.left   = 200;
            owin.title  = "客户详细资料－【创建日期：2009-12-01 / 修改日期：2009-12-01】";
            owin.text   = str;
            owin.hovercolor = "orange";
            owin.color = "black";
            var a = new xWin(owin);
            center(winid);
            changeTab(1);
            ue_radioread(mband,"热度");
            ue_radioread(mband,"价值评估");
            ue_radioread(mband,"信用等级");
        }
        else
        {
            //dwmsg(winid).innerHTML=str;
            ShowHide(winid,"");
        }
        
        var bar = new BarObj();
        bar.onum.value = mband.XmlLandData.recordset.AbsolutePosition+"/"+mband.RecordCount();
        
        //var oband=document.UnitItem.getBandByItemName("字典信息");
        //updatefields(oband);
    }
    
        //创建一个bar对象;
        function BarObj()
        {
              this.bar = document.getElementById("tbbar");
              if(!this.bar)  return null;                      
              this.id = this.bar.id;
              this.onum = document.getElementById("rsnum");
              this.btnfst = document.getElementById("navfirst")
              this.btnprev = document.getElementById("navprev")
              this.btnnext = document.getElementById("navnext")
              this.btnlast = document.getElementById("navlast")
              this.btnedit = document.getElementById("navedit")
              this.btnnew = document.getElementById("navnew")
              this.btnsave = document.getElementById("navsave")
              this.btnprn = document.getElementById("navprn")
              this.btndel = document.getElementById("navdel")
        }
        
        function buildbar()
        {
            return '<table id="tbbar" border="0" cellpadding="0" style="width:260px"  height="20" ><tr>'
		           +'<td width="16"><button id="navfirst" title="首记录" onclick="xnav(\'first\');"><img src="images/MoveFirstHS.gif"></button></td>'
		           +'<td width="16"><button id="navprev" title="前翻" onclick="xnav(-1);"><img src="images/MovePrevious.gif"></button></td>'
		           +'<td><INPUT id="rsnum" type="text" readonly=true style="width:30px;text-align:center" /></td>'
		           +'<td width="16"><button id="navnext" title="后翻" onclick="xnav(1);"><img src="images/MoveNextHS.gif"></button></td>'
		           +'<td width="16"><button id="navlast" title="最后一条" onclick="xnav(\'last\');"><img src="images/MoveLastHS.gif"></Botton></td>'
		           +'<td width="16"><button id=navedit title="修改记录" onclick="xnav(\'edit\');"><img src="images/wordpad.gif"></Botton></td>'
		           +'<td width="16"><button id=navnew title="新建记录" onclick="xnav(\'new\');"><img src="images/NewRecordHS.gif"></Botton></td>'
		           +'<td width="16"><button id=navdel title="删除当前记录" onclick="xnav(\'del\');"><img src="images/EditDelete1.gif" width="16" height="16"></Botton></td>'
		           +'<td width="16"><button id=navsave title="保存" onclick="xnav(\'save\');"><img src="images/saveHS.gif"></Botton></td>'
		           +'<td width="16"><button id=navprn title="打印" onclick="xnav(\'prn\');"><img src="images/printer.ico"></Botton></td>'
	               +'</tr></table>';
        }


    
    function area()
    {
        return '<select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="国家" class="xlandinput"><option></option>'
		+'<option value="1">AE United Arab Emirates阿联酋 亚洲</option><option value="2">AF Afghanistan阿富汗 亚洲</option>'
		+'<option value="3">AL Albania阿尔巴尼亚 亚洲</option><option value="4">AO Angola安哥拉 非洲</option>'
		+'<option value="5">AR Argentina阿根廷 南美洲</option><option value="6">AT Austria奥地利</option>'
				+'<option value="7">AU Australia澳大利亚 大洋洲</option>'
				+'<option value="8">AZ Azerbaijan阿塞拜疆 亚洲</option>'
				+'<option value="9">BD Bangladesh孟加拉 亚洲</option>'
				+'<option value="10">BE Belgium比利时 欧洲</option>'
				+'<option value="11">BG Bulgaria保加利亚 欧洲</option>'
				+'<option value="12">BH Bahrain巴林 亚洲</option>'
				+'<option value="13">BI Burundi布隆迪 非洲</option>'
				+'<option value="13">BJ Benin贝宁 非洲</option>'
				+'<option value="14">BM Bermuda百慕大 北美洲</option>'
				+'<option value="15">BN Brunei文莱 亚洲</option>'
				+'<option value="16">BO Bolivia玻利维亚 南美洲</option>'
				+'<option value="17">BR Brazil巴西 南美洲</option>'
				+'<option value="18">BS Bahamas巴哈马 北美洲</option>'
				+'<option value="19">BT Bhrtan不丹 亚洲</option>'
				+'<option value="20">BW Botswana博茨瓦纳 非洲</option>'
				+'<option value="21">CA Canada加拿大 北美洲</option>'
				+'<option value="22">CF Central Africa中非共和国 非洲</option>'
				+'<option value="23">CG Congo刚果 非洲</option>'
				+'<option value="24">CH Switherland瑞士 欧洲</option>'
				+'<option value="25">CK Cook Is.库克群岛 大洋洲</option>'
				+'<option value="26">CL Chile智利 南美洲</option>'
				+'<option value="27">CM Cameroon喀麦隆 非洲</option>'
				+'<option value="28" selected>CN China中国 亚洲</option>'
				+'<option value="29">CO Colombia哥伦比亚 南美洲</option>'
				+'<option value="30">CR Costa Rica哥斯达黎加 北美洲</option>'
				+'<option value="31">CU Cuba古巴 北美洲</option>'
				+'<option value="32">CV CApe Verde Is.佛得角群岛 非洲</option>'
				+'<option value="33">CY Cyprus塞浦路斯 亚洲</option>'
				+'<option value="34">CZ Czech捷克共和国 欧洲</option>'
				+'<option value="35">DE Germany德国 欧洲</option>'
				+'<option value="36">DK Denmark丹麦 欧洲</option>'
				+'<option value="37">DZ Algeria阿尔及利亚 非洲</option>'
				+'<option value="38">EC Ecuador厄瓜多尔 南美洲</option>'
				+'<option value="39">EE Estobia爱沙尼亚 欧洲</option>'
				+'<option value="40">EG Egypt埃及 非洲</option>'
				+'<option value="41">ES Spain西班牙 欧洲</option>'
				+'<option value="42">ET Ethiopia埃塞俄比亚 非洲</option>'
				+'<option value="43">FI Finland芬兰 欧洲</option>'
				+'<option value="44">FJ Fiji斐济 大洋洲</option>'
				+'<option value="45">FR France法国 欧洲</option>'
				+'<option value="46">GA Gabon加蓬 非洲</option>'
				+'<option value="47">GB Great Britain英国 欧洲</option>'
				+'<option value="48">GD Grenada格林纳达 北美洲</option>'
				+'<option value="49">GH Ghana加纳 非洲</option>'
				+'<option value="50">GM Zambia赞比亚 非洲</option>'
				+'<option value="51">GN Guinea-Bissau几内亚 非洲</option>'
				+'<option value="52">GQ Equatoria Guinea赤道几内亚 非洲</option>'
				+'<option value="53">GR Greece希腊 欧洲</option>'
				+'<option value="54">GT Guatemala危地马拉 北美洲</option>'
				+'<option value="55">GU Guam关岛 大洋洲</option>'
				+'<option value="56">GY Guyana圭亚那 南美洲</option>'
				+'<option value="57">HK Hong kong香港 亚洲</option>'
				+'<option value="58">HN Honduras洪都拉斯 北美洲</option>'
				+'<option value="59">HR Groatia克罗地亚 欧洲</option>'
				+'<option value="60">HT Haiti海地 北美洲</option>'
				+'<option value="61">HU Hungary匈牙利 欧洲</option>'
				+'<option value="62">ID Indonesia印度尼西亚 亚洲</option>'
				+'<option value="63">IE Ireland爱尔兰 欧洲</option>'
				+'<option value="64">IL Isreal以色列 亚洲</option>'
				+'<option value="65">IN India印度 亚洲</option>'
				+'<option value="66">IQ Iraq伊拉克 亚洲</option>'
				+'<option value="67">IR Iran伊朗 亚洲</option>'
				+'<option value="68">IS Iceland冰岛 欧洲</option>'
				+'<option value="69">IT Italy意大利 欧洲</option>'
				+'<option value="70">JM Jamaica牙买加 北美洲</option>'
				+'<option value="71">JO Jordan约旦 亚洲</option>'
				+'<option value="72">JP Japan日本 亚洲</option>'
				+'<option value="73">KE Kenya肯尼亚 非洲</option>'
				+'<option value="74">KH Cambodia柬埔寨 亚洲</option>'
				+'<option value="75">KP R.O.Korea韩国 亚洲</option>'
				+'<option value="76">KR D.P.R.Korea北朝鲜 亚洲</option>'
				+'<option value="77">KW Kuwait科威特 亚洲</option>'
				+'<option value="78">KZ Kazakhstan哈萨克斯坦 亚洲</option>'
				+'<option value="79">LA Laos老挝 亚洲</option>'
				+'<option value="80">LB Lebanon黎巴嫩 亚洲</option>'
				+'<option value="81">LT Lithuania立陶宛 欧洲</option>'
				+'<option value="82">LU Luxembourg卢森堡 亚洲</option>'
				+'<option value="83">LV Latvoia拉托维亚 欧洲</option>'
				+'<option value="84">LY Libya利比亚 非洲</option>'
				+'<option value="85">MA Morocco 摩洛哥 非洲</option>'
				+'<option value="86">MC Monaco摩纳哥 欧洲</option>'
				+'<option value="87">MD Moldova摩尔多瓦 欧洲</option>'
				+'<option value="88">MG Madagascar马达加斯加 非洲</option>'
				+'<option value="89">ML Mali马里 非洲</option>'
				+'<option value="90">MN Mongolia蒙古 亚洲</option>'
				+'<option value="91">MO Macao澳门 亚洲</option>'
				+'<option value="92">MR Mauritania毛里塔尼亚 非洲</option>'
				+'<option value="93">MT Malta马耳他 欧洲</option>'
				+'<option value="94">MU Mauritius毛里求斯 非洲</option>'
				+'<option value="95">MV Maldives马尔代夫 亚洲</option>'
				+'<option value="96">MX Mexico墨西哥 北美洲</option>'
				+'<option value="97">MY Malaysia马来西亚 亚洲</option>'
				+'<option value="98">MZ Mozambique莫桑比亚 非洲</option>'
				+'<option value="99">NA Namibia纳米比亚 非洲</option>'
				+'<option value="100">NE Niger尼日尔 非洲</option>'
				+'<option value="101">NG Nigeria尼日利亚 非洲</option>'
				+'<option value="102">NI Nicaragual尼加拉瓜 北美洲</option>'
				+'<option value="103">NL Netherlands荷兰 欧洲</option>'
				+'<option value="104">NO Norway挪威 欧洲</option>'
				+'<option value="105">NP Nepal尼泊尔 亚洲</option>'
				+'<option value="106">NZ New Zealand新西兰 大洋洲</option>'
				+'<option value="107">OM Oman阿曼 亚洲</option>'
				+'<option value="108">PH Philipines菲律宾 亚洲</option>'
				+'<option value="109">PK Parkistan巴基斯坦亚洲</option>'
				+'<option value="110">PL Poland波兰 欧洲</option>'
				+'<option value="111">PT Portugal葡萄牙 欧洲</option>'
				+'<option value="112">PY Paraguay巴拉圭 南美洲</option>'
				+'<option value="113">QA Qatar卡塔尔 亚洲</option>'
				+'<option value="114">RO Romania罗马尼亚 欧洲</option>'
				+'<option value="115">RU Russia俄罗斯 欧洲</option>'
				+'<option value="116">RW Rwanda卢旺达 非洲</option>'
				+'<option value="117">SA Sardi Arabia沙特阿拉伯 亚洲</option>'
				+'<option value="118">SD Sodan苏丹 非洲</option>'
				+'<option value="119">SE Sweden瑞典 欧洲</option>'
				+'<option value="120">SG Singapore新加坡 亚洲</option>'
				+'<option value="121">SK Slovakia斯洛伐克 欧洲</option>'
				+'<option value="122">SM San Marino圣马力诺 欧洲</option>'
				+'<option value="123">SN Senegal塞内加尔 非洲</option>'
				+'<option value="124">SO Somalia索马里 非洲</option>'
				+'<option value="125">SY Syria叙利亚 亚洲</option>'
				+'<option value="126">TH Thailand泰国 亚洲</option>'
				+'<option value="127">PA Panama巴拿马 北美洲</option>'
				+'<option value="128">PE Peru秘鲁 南美洲</option>'
				+'<option value="129">PG Papua New Grinea巴布亚新几内亚</option>'
				+'<option value="130">FJ Tadzhikistan塔吉克斯坦 亚洲</option>'
				+'<option value="131">TM Turkmenistan土库曼斯坦 亚洲</option>'
				+'<option value="132">TN Tunisia突尼斯 非洲</option>'
				+'<option value="133">TO Tonga汤加 大洋洲</option>'
				+'<option value="134">TW Taiwan台湾 亚洲</option>'
				+'<option value="135">TZ Tanzania坦桑尼亚 非洲</option>'
				+'<option value="136">UA Ukranie乌克兰 欧洲</option>'
				+'<option value="137">UG Uganda乌干达 非洲</option>'
				+'<option value="138">UK United Kingdom英国 欧洲</option>'
				+'<option value="139">US United Stated美国 北美洲</option>'
				+'<option value="140">UY Uruguay乌拉圭 南美洲</option>'
				+'<option value="141">UZ Uzbekistan乌兹别克斯坦 亚洲</option>'
				+'<option value="142">VA Vatican City梵蒂冈 欧洲</option>'
				+'<option value="143">VE Venezuela委内瑞拉 北美洲</option>'
				+'<option value="144">VN Vietnam越南 亚洲</option>'
				+'<option value="145">YE Yemen也门 亚洲</option>'
				+'<option value="146">YU Yugoslavia南斯拉夫 欧洲</option>'
				+'<option value="147">ZA South Africa南非 非洲</option>'
				+'<option value="148">ZM Zambia赞比亚 非洲</option>'
				+'<option value="149">ZR Zaire扎伊尔 非洲</option>'
				+'<option value="150">ZW Zimbabwe津巴布韦 非洲</option>'
				+'<option value="151">BLR 白俄罗斯 欧洲</option>'
				+'<option value="152">TR 土耳其 欧洲</option>'
				+'<option value="153">KG 吉尔吉斯 亚洲</option></select>'
    }
    function c_state()
    {
        return '<select style="WIDTH: 50%;" datasrc="#MasterTab" datafld="省" class="xlandinput">'
									+'<option></option>'
									+'<option value="1">安徽</option>'
									+'<option value="2" selected>北京</option>'
									+'<option value="3">重庆</option>'
									+'<option value="4">福建</option>'
									+'<option value="5">甘肃</option>'
									+'<option value="6">广东</option>'
									+'<option value="7">广西</option>'
									+'<option value="8">贵州</option>'
									+'<option value="9">海南</option>'
									+'<option value="10">河北</option>'
									+'<option value="11">河南</option>'
									+'<option value="12">黑龙江</option>'
									+'<option value="13">湖北</option>'
									+'<option value="14">湖南</option>'
									+'<option value="15">吉林</option>'
									+'<option value="16">江苏</option>'
									+'<option value="17">江西</option>'
									+'<option value="18">辽宁</option>'
									+'<option value="19">内蒙古</option>'
									+'<option value="20">宁夏</option>'
									+'<option value="21">青海</option>'
									+'<option value="22">山东</option>'
									+'<option value="23">山西</option>'
									+'<option value="24">陕西</option>'
									+'<option value="25">上海</option>'
									+'<option value="26">四川</option>'
									+'<option value="27">天津</option>'
									+'<option value="28">西藏</option>'
									+'<option value="29">新疆</option>'
									+'<option value="30">云南</option>'
									+'<option value="31">浙江</option>'
									+'<option value="32">香港</option>'
									+'<option value="33">澳门</option>'
									+'<option value="34">台湾</option>'
									+'<option value="35">其它</option></select>'
    }
var tabmenuIndex = 0; //用于全程跟踪当前的mdiv索引，其tag用于判定是否为只读
function changeTab(index)
{
    for (var i=1;i<=4;i++)
    {
        document.getElementById ("li"+i).className ="normal";
        document.getElementById ("li"+index).className ="selected";
        document.getElementById ("mdiv"+i).style.display  ="none";
    }
    document.getElementById ("mdiv"+index).style.display  ="block";
    exinputtype("mdiv"+index,g_readonly);
    tabmenuIndex = index;
    var bar = new BarObj();
    switch(index)
    {
        case 4:                    
            var oband = new ue_ABand("select * from 字典_客户联系人 where 客户='"+mband.getFldStrValue("名称")+"'");
            bar.onum.value = oband.count;
            break;
        default:
            var oband = mband;
            bar.onum.value = oband.XmlLandData.recordset.AbsolutePosition+"/"+oband.RecordCount();
    }
    bar.btnfst.disabled=(oband.count==0)?true:false;
    bar.btnprev.disabled=(oband.count==0)?true:false;
    bar.btnnext.disabled=(oband.count==0)?true:false;
    bar.btnlast.disabled=(oband.count==0)?true:false;
    bar.btnedit.disabled=(oband.count==0)?true:false;
    bar.btnnew.disabled=false;
    bar.btnsave.disabled=(oband.count==0)?true:false;
    bar.btnprn.disabled=(oband.count==0)?true:false;
    bar.btndel.disabled=(oband.count==0)?true:false;
}

//改变输入方式0,1,2为主表内容，按一个规则.3为联系人分表
function exinputtype(objname,isreadonly)
{
    if(!document.getElementById(objname)) return;
    var pobjs = document.getElementById(objname).getElementsByTagName("INPUT")
    for(var i=0;i<pobjs.length;i++)
    {
        //pobjs[i].readOnly=isreadonly;
        pobjs[i].disabled=isreadonly;
        if("checkbox"==pobjs[i].type || "radio"==pobjs[i].type)
            pobjs[i].disabled=isreadonly;
    }
    var pobjs = document.getElementById(objname).getElementsByTagName("SELECT")
    for(var i=0;i<pobjs.length;i++)
        pobjs[i].disabled=isreadonly;
    var pobjs = document.getElementById(objname).getElementsByTagName("TEXTAREA")
    for(var i=0;i<pobjs.length;i++)
        pobjs[i].disabled=isreadonly;
    document.getElementById(objname).tag=isreadonly;
}
function mchangeTab(index)
{
    for (var i=1;i<=7;i++)
    {
        document.getElementById ("li_"+i).className ="mnormal";
        document.getElementById ("a_"+i).className ="an";                                
    }
        document.getElementById ("li_"+index).className ="mselected";
        document.getElementById ("a_"+index).className ="as";                
}
           
        function strfind(winid,gridname,bandname)
        {
            if(!bandname) bandname="";
            var s= '<fieldset style="padding: 5px;;width:98%"><legend>主要信息：</legend>'
            +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
            +'        <td width="60" align="right">名称：</td><td width="150">'
            +'        <input datasrc="#MasterTab" datafld="名称" class=\"xlandinput\" style=\"WIDTH: 100%;\" /></td>'
            +'        <td width="50" align="right">编码：</td><td width="50">'
            +'        <input datasrc="#MasterTab" datafld="编码" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="70" align="right">热点客户：</td><td width="30">'
            +'        <input datasrc="#MasterTab" datafld="热点" class="xlandradio" type="checkbox" /></td>'
            +'        <td width="40" align="right">热度：</td><td width="150">'
            +'        <input type="radio" id="hotlevel_0" CHECKED value="低" name="热度" onclick="ue_radiowrite(mband)"/><label for="hotlevel_0">低</label><input type="radio" id="hotlevel_1" value="中" name="热度" onclick="ue_radiowrite(mband)"/><label for="hotlevel_1">中</label><input type="radio" '
            +' id="hotlevel_2" value="高" name="热度" onclick="ue_radiowrite(mband)" /><label for="hotlevel_2">高</label></b> </td>'
            +'        <td width="50" align="center">【<a href="#" onclick="_btnOK()">确定</a>】</td>'   
            +'    </tr></table></fieldset>';
            var s1 = '<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr><td>'
              +'<DIV id=header align="left" style="width:98%"><UL><LI onmouseover="changeTab(1)"><A href="#" id="li1"  class="selected">基本信息</A></LI>'
              +'<LI onmouseover="changeTab(2)" ><A href="#" id="li2"  class="normal">联系方式及财务信息</A></LI>'
              +'<LI onmouseover="changeTab(3)"><A href="#"  id="li3"  class="normal">业务状况</A></LI>'
              +'<LI onmouseover="changeTab(4)"><A href="#"  id="li4" class="normal">联系人</A></LI></UL></DIV></td><td>'
              +buildbar()+'</td></tr></table>'
              +'<DIV id=content align=center><div id="mdiv1" style ="display:block">'+s01()+'</div>'
              +'<div  id="mdiv2" style ="display:none" >'+s02()+s03()+'</div>'
              +'<div  id="mdiv3" style ="display:none" >'+s04()+'</div>'
              +'<div id="mdiv4" style ="display:none" >'+strcontact()+'</div></DIV>';
            //'<select id="deptbox" size="13" onblur="this.style.display=\'none\'" name="D1" datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:420;height:300; position:absolute; left:132; top:128;display:none"  ondblclick="boxcheckin(this)" ></select>';
            return s+s1;
        }
        function s01()
        {
            return '<fieldset style="padding: 5px;height:99%;width:98%"><legend>详细资料：</legend>'
            +'<b>价值评估:<input id="valuing0" type="radio" value="高" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing0">高</label><input id="valuing1" type="radio" value="中" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing1">中</label><input id="valuing2" type="radio" onclick="ue_radiowrite(mband)" value="低" name="价值评估" checked><label for="valuing2">低</label>'
            +'　　　信用等级:<input id="credit0" type="radio" value="高" name="信用等级"  onclick="ue_radiowrite(mband)" /><label for="credit0">高</label><input id="credit1" type="radio" value="中" name="信用等级"  onclick="ue_radiowrite(mband)" /><label for="credit1">中</label><input id="credit2" type="radio" value="低" name="信用等级"  onclick="ue_radiowrite(mband)"/><label for="credit2">低</label></b>'                    
            +'<br /><br />'
            +'<table border="0" width="90%" cellpadding="1" style="border-collapse: collapse" align=center >'
            +'<tr><td width="90">类　　型：</td>'
            +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="类型" class="xlandinput" >'
			+'<option></option><option value="潜在客户" selected>潜在客户</option><option value="普通客户">普通客户</option>'
			+'<option value="VIP客户">VIP客户</option><option value="代理商">代理商</option><option value="合作伙伴">合作伙伴</option>'
			+'<option value="失效客户">失效客户</option></select></td>'
            +'    <td width="90"  align=center>行　　业：</td>'
            +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="行业" class="xlandinput">'
			+'<option></option><option value="1" selected>工业</option><option value="2">服务业</option><option value="35">信息产业IT业</option>'
			+'<option value="3">邮电</option><option value="4">通信</option><option value="5">社区服务</option>'
			+'<option value="6">商业流通</option><option value="7">批发零售</option><option value="8">交通运输</option>'
			+'<option value="9">建筑及安装业</option><option value="10">医疗卫生</option><option value="11">城市建设</option>'
			+'<option value="12">旅游</option><option value="13">宾馆</option><option value="14">餐饮业</option>'
			+'<option value="15">房地产</option><option value="16">科研设计</option><option value="17">文化艺术</option>'
			+'<option value="18">财政</option><option value="19">金融</option><option value="20">保险</option>'
			+'<option value="21">新闻</option><option value="22">出版</option><option value="23">媒体</option>'
			+'<option value="24">公用服务事业</option><option value="25">社会团体</option><option value="26">工艺美术</option>'
			+'<option value="27">礼品业</option><option value="28">物资经营</option><option value="29">回收</option>'
			+'<option value="30">公共福利</option><option value="31">教育事业</option><option value="32">学校</option>'
			+'<option value="33">商业</option><option value="34">集团综合</option><option value="37">农业</option>'
			+'<option value="36">其他行业</option></select></td>'
            +'</tr><tr><td width="90">关系等级：</td>'
            +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="关系等级" class="xlandinput">'
			+'<option></option><option value="密切" selected>密切</option><option value="较好">较好</option>'
			+'<option value="一般">一般</option><option value="较差">较差</option></select></td>'
            +'    <td width="90" align=center>人员规模：</td>'
            +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="规模" class="xlandinput"><option></option>'
			+'<option value="1" selected>10人以内</option><option value="2">10-20人</option>'
			+'<option value="3">20-50人</option><option value="4">50-200人</option><option value="5">200人以上</option></select></td>'
            +'</tr><tr><td width="90">来　　源：</td>'
            +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#MasterTab" datafld="来源" class="xlandinput"><option></option>'
			+'<option value="电话来访" selected>电话来访</option><option value="客户介绍">客户介绍</option><option value="独立开发">独立开发</option>'
			+'<option value="媒体宣传">媒体宣传</option><option value="促销活动">促销活动</option><option value="老客户">老客户</option>'
			+'<option value="代理商">代理商</option><option value="合作伙伴">合作伙伴</option><option value="公开招标">公开招标</option>'
			+'<option value="其他">其他</option><option value="互联网">互联网</option></select></td>'
            +'    <td width="90" align=center>阶　　段：</td>'
            +'    <td><select style="WIDTH: 100%;" datasrc="#MasterTab" datafld="阶段" class="xlandinput" size="1" name="dt_customer_cu_status"><option></option>'
			+'<option value="售前跟踪" selected>1.售前跟踪</option><option value="合同执行">2.合同执行</option>'
			+'<option value="售后服务">3.售后服务</option><option value="合同期满">4.合同期满</option></select></td>'
            +'</tr><tr><td width="90">信用天数：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="信用天数" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>信用金额：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="信用金额" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">上级客户：</td>'
            +'    <td colspan="3"><input datasrc="#MasterTab" datafld="上级" class="xlandinput" style="width:94%;" type="text" size="11"  /><input type="button"style="width:26px;height:20px" value="..." onclick="disporg(\'deptbox\')"/></td>'
            +'    </tr><tr><td width="90">公司简介：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:128px" datasrc="#MasterTab" datafld="简介" class="xlandinput">dsadasdas</textarea></td>'
            +'    </tr><tr><td width="90">备　　注：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:60px" datasrc="#MasterTab" datafld="备注" class="xlandinput">dsadasdas</textarea></td>'
            +'    </tr></table></fieldset>';
        }
        function s02()
        {
            return '<fieldset style="padding: 5px;;width:98%"><legend>联系方式：</legend>'
            +'<table border="0" width="90%" cellpadding="1" style="border-collapse: collapse" align=center >'
            +'<tr><td width="90">国家或地区：</td>'
            +'    <td>'+area()+'</td>'
            +'    <td width="90"  align=center>联&nbsp;系&nbsp;人：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="联系人" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">省 / 市：</td>'
            +'    <td>'+c_state()+'<input datasrc="#MasterTab" datafld="市" class="xlandinput" style="width:49%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>电　　话：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="电话" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">法人代表：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="法人代表" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>传　　真：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="传真" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">电子邮箱：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="email" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>网　　址：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="网址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">送货地址：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="送货地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>运输方式：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="运输方式" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">地　　址：</td>'
            +'    <td colspan="3"><input datasrc="#MasterTab" datafld="地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    </tr></table></fieldset>';
        }       
                 
        function s03()
        {
            return '<br /><br /><fieldset style="padding: 5px;;width:98%"><legend>帐户一：</legend>'
            +'<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center >'
            +'<tr><td width="90">开户银行：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="开户行" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90"  align=center>开户名称：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="开户名称" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">银行账号：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="账号" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>地　　址：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="银行地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">税　　号</td>'
            +'    <td><input datasrc="#MasterTab" datafld="税号" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>税　　率：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="税率" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr></table></fieldset>'
            +'<fieldset style="padding: 5px;;width:98%"><legend>帐户二：</legend>'
            +'<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center ><tr><td width="90">开户银行：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="开户行1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90"  align=center>开户名称：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="开户名称1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">银行账号：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="账号1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>地　　址：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="银行地址1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr><tr><td width="90">税　　号</td>'
            +'    <td><input datasrc="#MasterTab" datafld="税号1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'    <td width="90" align=center>税　　率：</td>'
            +'    <td><input datasrc="#MasterTab" datafld="税率1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'</tr></table></fieldset>';
        }                
        function s04()
        {
            return '<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center >'
            +'<tr><td width="90">客户简介：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#MasterTab" datafld="简介" class="xlandinput">dsadasdas</textarea></td>'
            +'</tr>'
            +'<tr><td width="90">合作现状：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#MasterTab" datafld="合作现状" class="xlandinput">dsadasdas</textarea></td>'
            +'</tr>'
            +'<tr><td width="90">合作前景：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#MasterTab" datafld="合作前景" class="xlandinput">dsadasdas</textarea></td>'
            +'</tr>'
            +'<tr><td width="90">跟进策略：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#MasterTab" datafld="跟进策略" class="xlandinput">dsadasdas</textarea></td>'
            +'</tr>'
            +'<tr><td width="90">备　　注：</td>'
            +'    <td colspan="3"><textarea style="WIDTH: 100%;height:35px" datasrc="#MasterTab" datafld="备注" class="xlandinput">dsadasdas</textarea></td>'
            +'    </tr></table>';
        };
        function strcontact()
        {
            var s= '<fieldset style="padding: 5px;;width:98%"><legend>主要信息：<span id=mans">【联系人姓名：无】</span></legend>'
            +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
            +'        <td width="40" align="right">姓名:</td><td width="80">'
            +'        <input type="text" datafld="姓名" class=\"xlandinput\" style=\"WIDTH: 100;\" /></td>'
            +'        <td width="40" align="right">职务:</td><td width="80">'
            +'        <input type="text" datafld="empcode" class="xlandinput" style="width:100%;" size="11"  /></td>'
            +'        <td width="40" align="right">性别</td><td width="40"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="40" align="right">民族</td><td width="40"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="70" align="right">主联系人:</td>'
            +'        <td width="40" align="center"><input datafld="ISOPERATE" class="xlandradio" type="checkbox" /></td>'
            +'        <td width="40" align="right">无效:</td><td width="40"><input datafld="UPFLAG" class="xlandradio" type="checkbox" /></td>'
            +'    </tr></table></fieldset>'+strcontact1()+strcontact3();
            return s;
        }
        function strcontact1()
        {
            return '<fieldset style="padding: 5px;width:98%"><legend>基本资料：</legend>'
            +'<table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center >'
            +'<tr><td width="70" align="right">所在部门：</td><td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td><td width="70" align="right">出生日期：</td><td width="150"><INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'<td rowspan="8" align="center" valign=middle>'
            +'<div style="width:80%;height:160;border:3px double #C0C0C0;">1</div></td></tr>'
            +'<tr><td width="70" align="right">分　　类：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">负责业务：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td width="70" align="right">籍　　贯：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">身份证号：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td align="right">个人爱好：</td><td colspan=3><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<tr><td width="70" align="right">工作电话：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">传　　真：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td width="70" align="right">移动电话：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">邮　　编：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td width="70" align="right">移动电话：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">ＭＳＮ：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td width="70" align="right">家庭电话：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">SKYPE：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'</tr>'
            +'<tr><td width="70" align="right">家庭地址：</td>'
            +'<td  width="150"><input datasrc="#MasterTab"  datafld="SEX" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
            +'<td width="70" align="right">ＱＱ：</td><td width="150">'
            +'<INPUT datasrc="#MasterTab" datafld="BIRTHDAY" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
            +'<td align="center"><INPUT id="Button1" title="上传照片" style="WIDTH: 100px;" onclick="upload()" type="button" value="上传" name="btnOK1"></td></tr>'
            +'</table></fieldset>';
        }
        
        function strcontact3()
        {
            var s= '<fieldset style="padding: 5px;;width:98%"><legend>其它信息：</legend>'
            +'<table border="0" width="98%" cellpadding="0" style="border-collapse: collapse" align=center >'
            +'<tr><td width="60" align="right">学历:</td><td width="100">'
            +'        <input datasrc="#MasterTab" datafld="name"   class=\"xlandinput\" style=\"WIDTH: 100;\" /></td>'
            +'        <td width="60" align="right">学位:</td><td width="100">'
            +'        <input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="60" align="right">专业:</td><td width="100"><input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="60" align="right">毕业院校:</td><td width="100"><input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td></tr>'
            +'<tr><td width="60" align="right">驾照:</td><td width="100">'
            +'有<input datasrc="#MasterTab" datafld="ISHOT" class="xlandradio" type="radio" />　无<input datasrc="#MasterTab" datafld="ISHOT" class="xlandradio" type="radio" /></td>'
            +'        <td width="60" align="right">车牌:</td><td width="100">'
            +'        <input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="60" align="right">身高:</td><td width="100"><input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
            +'        <td width="60" align="right">体重:</td><td width="100"><input datasrc="#MasterTab" datafld="empcode" class="xlandinput" style="width:100%;" type="text" size="11"  /></td></tr>'
            +'<tr><td width="60" align="right">备注:</td>'
            +'    <td colspan="7"><textarea style="WIDTH: 100%;height:50px" datasrc="#MasterTab" datafld="备注" class="xlandinput">dsadasdas</textarea></td>'
            +'    </tr>'
            +'</table></fieldset>';
            return s;
        }
        

        function _btnOK()
        {
            ue_save();
        }
        
        function xnav(flag)
        {
            var itemname = "字典信息";
            switch(flag)
            {
                case "save":
                    ue_save();
                    break;
                case "edit":
                    g_readonly = !g_readonly
                    exinputtype("mdiv"+tabmenuIndex,g_readonly);
                    var bar = new BarObj();
                    bar.btnedit.childNodes[0].src=(g_readonly)?"images/wordpad.gif":"images/cancel.gif";
                    bar.btnedit.title=(g_readonly)?"修改记录":"放弃修改";
                    break;
                case "new":
                    if(g_readonly == true)
                    {
                        g_readonly = !g_readonly;
                        exinputtype("mdiv"+tabmenuIndex,g_readonly);
                    }
                    ue_bandadd(mband.ID);
                    break;
                case "del":
                    ue_banddelete(mband.ID)
                    break;
                case 1:
                    ue_nnext(itemname);
                    break;
                case -1:
                    ue_nprev(itemname);
                    break;
                case "first":
                    ue_nstart(itemname);
                    break;
                case "last":
                    ue_nlast(itemname);
                    break;
            }
		    var bar = new BarObj();
		    bar.onum.value = mband.XmlLandData.recordset.AbsolutePosition+"/"+mband.RecordCount();            
        }
	function ue_nstart(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(1==oband.RecordCount())
			strMsg="";
		else
			strMsg=oband.CalXmlLand.ValidateRow((oband.RecordCount()<1)?-1:(oband.XmlLandData.recordset.AbsolutePosition-1));
		ue_navctrl(oband,strMsg,0);
		return;		
	}

	function ue_nnext(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;	//记录行以1为基点,需要换成以0为基点
		var curindex=(index+1<oband.XmlLandData.recordset.recordCount)?(index+1):index;
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
        ue_navctrl(oband,strMsg,curindex)
        return;
	}
	

	function ue_nlast(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var curindex=oband.XmlLandData.recordset.recordCount-1;
		if(curindex!=oband.XmlLandData.recordset.AbsolutePosition-1)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
        ue_navctrl(oband,strMsg,curindex)
		return;
	}
	
	function ue_nprev(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;
		var curindex=(index<1)?0:(index-1);
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
		ue_navctrl(oband,strMsg,curindex);
		return;
	}

        function ue_navctrl(oband,strMsg,curindex)
        {
		    if(strMsg && ""!=strMsg)
		    {
			    alert(strMsg);return;
		    }
		    oband.setCurrentRow(curindex);
		    if(oband.Grid && oband.Grid.curTd)
		    {
			    var ctrl=ToolUtil.getCtrlByNameD(false,oband.Grid.curTd,"colname");
			    if(ctrl) ctrl.fireEvent("onfocus");
			    
		    }	
        }        
        