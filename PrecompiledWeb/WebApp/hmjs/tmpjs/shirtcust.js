/*
为您开设的试用帐号如下：  
　1.点击进入登录界面
　　https://x4.xtcrm.com  
　2.老板用户名和密码
　　用户：boss   公司：ansay 　密码：531066
　　在本软件中，老板/Boss用户享有最高管理权限和控制权限
*/
      var mband;var brandBand;
      function initWin()
      {
        $loading();
        mband=$band("字典信息");
        mband.minwidth = "80px";
        mband.freecols = "名称";
        mband.gridtype = 2;
        mband.readonly = true;
        mband.dicts="@类型=潜在客户/普通客户/VIP客户/代理商/合作伙伴/失效客户,@阶段=售前跟踪/合同执行/售后服务/合同期满";
        var Grid = new XGrid("dvMasterTab",mband,"in",null,1);
        
        mband.XQuery();
//        mband.AfterRowChanged=function()
//        {
//            var owin = dwobj("1");
//            if(owin){
//                if(tabmenuIndex==4) changeTab(4);}
//            else
//                window.setTimeout(showLists,200);
//        }
        $loading("none");
      }
      function showLists()
      {
            var keytable = document.getElementsByName("dt_contact_keytable");            
            var xband = new ue_ABand("EXECUTE dbo.ContactContacts '"+mband.getFldStrValue("名称")+"'");
            for(var i=0;i<keytable.length;i++)
            {
                keytable[i].innerHTML = xband.data.selectSingleNode("table").text;
            }
      }
 
    function openDlg(bandid)
    {
	    var band=GridUtil.FindBand(bandid);
	    if(!band)   return;
	    switch(band.ItemName)
	    {
	        case "联系人":
                var winid = band.ID;
                var owin = dwobj(winid);
                var str='<div id='+winid+'dvbar style="text-align:right"></div>'+strcontact();
                if(!owin)
                {
                    var owin = new Object;
                    owin.id     = winid;
                    owin.width  = 700;
                    owin.height = 480;
                    owin.top    = 130;
                    owin.left   = 200;
                    owin.title  = ">><span datasrc='#fg_providerTab' datafld='名称'></span>" +" - 联系人详细资料";
                    owin.text   = str;
                    owin.hovercolor = "orange";
                    owin.color = "black";
                    var a = new xWin(owin);
                    center(winid);
                }
                else
                    ShowHide(winid,"");
                var bar = new BarObj(band.ItemName,true);
                bar.onum.value = band.XmlLandData.recordset.AbsolutePosition+"/"+band.RecordCount();
                SynBandTitle(band);
                updatefields(band);
                break;
	        case "日程":
                var winid = band.ID;
                var owin = dwobj(winid);
                var str=tb_action(winid);
                if(!owin)
                {
                    var owin = new Object;
                    owin.id     = winid;
                    owin.width  = 700;
                    owin.height = 480;
                    owin.top    = 130;
                    owin.left   = 200;
                    owin.title  = ">><span datasrc='#fg_providerTab' datafld='名称'></span>" +" - 日程";
                    owin.text   = str;
                    owin.hovercolor = "orange";
                    owin.color = "black";
                    var a = new xWin(owin);
                    center(winid);
                }
                else
                    ShowHide(winid,"");
                var bar = new BarObj(band.ItemName,true);
                if(bar && bar.onum) bar.onum.value = band.XmlLandData.recordset.AbsolutePosition+"/"+band.RecordCount();
                break;
	        case "待办任务":
                var winid = band.ID;
                var owin = dwobj(winid);
                var str=tb_task(winid);
                if(!owin)
                {
                    var owin = new Object;
                    owin.id     = winid;
                    owin.width  = 700;
                    owin.height = 480;
                    owin.top    = 130;
                    owin.left   = 200;
                    owin.title  = ">><span datasrc='#fg_providerTab' datafld='名称'></span>" +" - 待办任务";
                    owin.text   = str;
                    owin.hovercolor = "orange";
                    owin.color = "black";
                    var a = new xWin(owin);
                    center(winid);
                }
                else
                    ShowHide(winid,"");
                var bar = new BarObj(band.ItemName,true);
                if(bar && bar.onum) bar.onum.value = band.XmlLandData.recordset.AbsolutePosition+"/"+band.RecordCount();
                break;
	        case "销售机会":
                var winid = band.ID;
                var owin = dwobj(winid);
                var str=tb_opport(winid);
                if(!owin)
                {
                    var owin = new Object;
                    owin.id     = winid;
                    owin.width  = 700;
                    owin.height = 480;
                    owin.top    = 130;
                    owin.left   = 200;
                    owin.title  = ">><span datasrc='#fg_providerTab' datafld='名称'></span>" +" - 销售机会";
                    owin.text   = str;
                    owin.hovercolor = "orange";
                    owin.color = "black";
                    var a = new xWin(owin);
                    center(winid);
                }
                else
                    ShowHide(winid,"");
                var bar = new BarObj(band.ItemName,true);
                if(bar && bar.onum) bar.onum.value = band.XmlLandData.recordset.AbsolutePosition+"/"+band.RecordCount();
                break;
	    }
    }
    
    
    function openPro(winid)
    {
        var inputctrl=event.srcElement;
        //设置当前行当前单元格
        var tdcol=inputctrl.parentElement;
        var trcur=tdcol.parentElement;
    
        if(inputctrl.title!="管理联系人")
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
            owin.title  = "客户详细资料－【创建日期："+"<span datasrc='#fg_providerTab' datafld='创建日期_格式'></span>" +"/ 更新日期：<span datasrc='#fg_providerTab' datafld='更新日期_格式'></span>】";
            owin.text   = str;
            owin.hovercolor = "orange";
            owin.color = "black";
            var a = new xWin(owin);
            center(winid);
            if(inputctrl.title=="管理联系人") changeTab(4);
            else changeTab(1);
//            ue_radioread(mband,"热度");
//            ue_radioread(mband,"价值评估");
//            ue_radioread(mband,"信用等级");
        }
        else
        {
            //dwmsg(winid).innerHTML=str;
            ShowHide(winid,"");
            if(inputctrl.title=="管理联系人") changeTab(4);
            else changeTab(1);
        }
        
        var bar = new BarObj(mband.ItemName,false);
        bar.onum.value = mband.XmlLandData.recordset.AbsolutePosition+"/"+mband.RecordCount();
        
        //var oband=$band("字典信息");
        //updatefields(oband);
    }
    
        //创建一个bar对象;
        function BarObj(itemname,IsChangeID)
        {
            if(!IsChangeID) var bid = "";
            else var bid = $band(itemname).ID;
            if(this.ItemName != itemname) buildbar(itemname,bid);
            this.bar = $(bid+"tbbar");
            if(!this.bar)  return null;                      
            this.id = this.bar.id;
            this.onum    = $(bid+"rsnum");
            this.btnfst  = $(bid+"navfirst");
            this.btnprev = $(bid+"navprev");
            this.btnnext = $(bid+"navnext");
            this.btnlast = $(bid+"navlast");
            this.btnedit = $(bid+"navedit");
            this.btnnew  = $(bid+"navnew");
            this.btnsave = $(bid+"navsave");
            this.btnprn  = $(bid+"navprn");
            this.btndel  = $(bid+"navdel");
            this.ItemName = itemname;
        }
        
        function buildbar(itemname,bid)
        {
            var isExchange = (bid=="")?"false":"true";
            if($(bid+"dvbar"))
                $(bid+"dvbar").innerHTML = '<table id='+bid+'tbbar border="0" cellpadding="0" style="width:260px"  height="20" ><tr>'
		           +'<td width="16"><button id='+bid+'navfirst title="首记录" onclick="xnav(\''+itemname+'\',\'first\','+isExchange+');"><img src="../html/images/MoveFirstHS.gif"></button></td>'
		           +'<td width="16"><button id='+bid+'navprev title="前翻" onclick="xnav(\''+itemname+'\',-1,'+isExchange+');"><img src="../html/images/MovePrevious.gif"></button></td>'
		           +'<td><INPUT id='+bid+'rsnum type="text" readonly=true style="width:50px;text-align:center" /></td>'
		           +'<td width="16"><button id='+bid+'navnext title="后翻" onclick="xnav(\''+itemname+'\',1,'+isExchange+');"><img src="../html/images/MoveNextHS.gif"></button></td>'
		           +'<td width="16"><button id='+bid+'navlast title="最后一条" onclick="xnav(\''+itemname+'\',\'last\','+isExchange+');"><img src="../html/images/MoveLastHS.gif"></Botton></td>'
		           //+'<td width="16"><button id=navedit title="修改记录" onclick="xnav(\'edit\');"><img src="../html/images/wordpad.gif"></Botton></td>'
		           +'<td width="16"><button id='+bid+'navnew title="新建记录" onclick="xnav(\''+itemname+'\',\'new\','+isExchange+');"><img src="../html/images/NewRecordHS.gif"></Botton></td>'
		           +'<td width="16"><button id='+bid+'navdel title="删除当前记录" onclick="xnav(\''+itemname+'\',\'del\','+isExchange+');"><img src="../html/images/EditDelete1.gif" width="16" height="16"></Botton></td>'
		           +'<td width="16"><button id='+bid+'navsave title="保存" onclick="xnav(\''+itemname+'\',\'save\','+isExchange+');"><img src="../html/images/saveHS.gif"></Botton></td>'
		           +'<td width="16"><button id='+bid+'navprn title="打印" onclick="xnav(\''+itemname+'\',\'prn\','+isExchange+');"><img src="../html/images/printer.ico"></Botton></td>'
	               +'</tr></table>';
        }


    
    function area()
    {
        return '<select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="国家" class="xlandinput"><option></option></select>'
    }
    function c_state()
    {
        return '<select style="WIDTH: 50%;" datasrc="#fg_providerTab" datafld="省" class="xlandinput">'
									+'<option></option></select>'
    }
function msInitGridOps()
{
}

var tabmenuIndex = 0; //用于全程跟踪当前的mdiv索引，其tag用于判定是否为只读
function changeTab(index)
{
    if(tabmenuIndex==4 && $band("联系人").IsModify()){alert("正在编辑联系人，请确认！");return;};
    for (var i=1;i<=4;i++)
    {
        $ ("li"+i).className ="normal";
        $ ("li"+index).className ="selected";
        $ ("mdiv"+i).style.display  ="none";
    }
    $ ("mdiv"+index).style.display  ="block";
    tabmenuIndex = index;
    var oband;
    switch(index)
    {
        case 4:                    
            oband=$band("联系人");
            //if(!oband.active) oband.XQuery();
            oband.XQuery();
            SynBandTitle(oband);
            updatefields(oband)
            break;
        default:
            oband = mband;
            break;
    }
    var bar = new BarObj(oband.ItemName,false);
    if(oband.XmlLandData.recordset.AbsolutePosition==-1) bar.onum.value=0;
    else bar.onum.value = oband.XmlLandData.recordset.AbsolutePosition+"/"+oband.RecordCount();
    bar.btnfst.disabled=(oband.count==0)?true:false;
    bar.btnprev.disabled=(oband.count==0)?true:false;
    bar.btnnext.disabled=(oband.count==0)?true:false;
    bar.btnlast.disabled=(oband.count==0)?true:false;
    //bar.btnedit.disabled=(oband.count==0)?true:false;
    bar.btnnew.disabled=false;
    bar.btnsave.disabled=(oband.count==0)?true:false;
    bar.btnprn.disabled=(oband.count==0)?true:false;
    bar.btndel.disabled=(oband.count==0)?true:false;
}

//改变输入方式0,1,2为主表内容，按一个规则.3为联系人分表
function exinputtype(objname,isreadonly)
{
    if(!$(objname)) return;
    var pobjs = $(objname).getElementsByTagName("INPUT")
    for(var i=0;i<pobjs.length;i++)
    {
        //pobjs[i].readOnly=isreadonly;
        pobjs[i].disabled=isreadonly;
        if("checkbox"==pobjs[i].type || "radio"==pobjs[i].type)
            pobjs[i].disabled=isreadonly;
    }
    var pobjs = $(objname).getElementsByTagName("SELECT")
    for(var i=0;i<pobjs.length;i++)
        pobjs[i].disabled=isreadonly;
    var pobjs = $(objname).getElementsByTagName("TEXTAREA")
    for(var i=0;i<pobjs.length;i++)
        pobjs[i].disabled=isreadonly;
    $(objname).tag=isreadonly;
}
function secBoard(n) {
    if(mband.RecordCount()==0){alert("请先录入客户资料！");return};
    if(n>=mainTable.tBodies.length) return;
    for(i=0;i<mainTable.tBodies.length;i++)
      mainTable.tBodies[i].style.display="none";
    mainTable.tBodies[n].style.display="block";
    
    var oCusttitle = document.getElementsByName("customsign")
    for(var i=0;i<oCusttitle.length;i++)
        oCusttitle[i].innerText = mband.getFldStrValue("名称");    
    switch(n)
    {
        case 1:
            var oband=$band("联系人");
            oband.minwidth = "80px";
            oband.freecols = "姓名";
            oband.title = "客户联系人";
            oband.dicts="@性别=男/女,@阶段=售前跟踪/合同执行/售后服务/合同期满";
            oband.gridtype = 8;
            if(!oband.Grid) var Grid = new XGrid("dvcontact",oband,"in");
            oband.XQuery();
            updatefields(oband);
            //SynBandTitle(oband);
            
            break;
        case 2:
            brandBand=$band("品牌");
            brandBand.minwidth = "80px";
            brandBand.freecols = "名称";
            brandBand.title = "品牌登记";
            brandBand.gridtype = 8;
            if(!brandBand.Grid) var Grid = new XGrid("dvbrand",brandBand,"in");
            brandBand.XQuery();         
            //updatefields(oband);
            //SynBandTitle(oband);
            break;
        case 4:
            var oband=$band("客户费用");
            oband.title = "相关费用";
            oband.minwidth = "80px";
            oband.freecols = "用途";
            oband.dicts="@类别=餐饮/交通/通讯/礼品/办公/活动/其它";
            oband.gridtype = 8;
            var Grid = new XGrid("dvcostlist",oband,"in");
            oband.XQuery();
            break;        
    }
}	          
           
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>主要信息：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        +'        <td width="60" align="right">名称：</td><td width="150">'
        +'        <input datasrc="#fg_providerTab" datafld="名称" class=\"xlandinput\" style=\"WIDTH: 90%;\" /><font face="Wingdings" color="#ff0000">v</font></td>'
        +'        <td width="50" align="right">编码：</td><td width="50">'
        +'        <input datasrc="#fg_providerTab" datafld="编码" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="70" align="right">热点客户：</td><td width="30">'
        +'        <input datasrc="#fg_providerTab" datafld="热点" class="xlandradio" type="checkbox" /></td>'
        +'        <td width="40" align="right">热度：</td><td width="150">'
        +'        <input type="radio" id="hotlevel_0" CHECKED value="低" name="热度" onclick="ue_radiowrite(mband)"/><label for="hotlevel_0">低</label><input type="radio" id="hotlevel_1" value="中" name="热度" onclick="ue_radiowrite(mband)"/><label for="hotlevel_1">中</label><input type="radio" '
        +' id="hotlevel_2" value="高" name="热度" onclick="ue_radiowrite(mband)" /><label for="hotlevel_2">高</label></b> </td>'
        +'        <td width="50" align="center">【<a href="#" onclick="_btnOK()">关闭</a>】</td>'   
        +'    </tr></table></fieldset>';
        var s1 = '<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr><td>'
          +'<DIV id=header align="left" style="width:98%"><UL><LI onclick="changeTab(1)"><A href="#" id="li1"  class="selected">基本信息</A></LI>'
          +'<LI onclick="changeTab(2)" ><A href="#" id="li2"  class="normal">联系方式及财务信息</A></LI>'
          +'<LI onclick="changeTab(3)"><A href="#"  id="li3"  class="normal">业务状况</A></LI>'
          +'<LI onclick="changeTab(4)"><A href="#"  id="li4" class="normal">联系人</A></LI></UL></DIV></td><td>'
          +'<div id="dvbar"></div></td></tr></table>'
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
        +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="类型" class="xlandinput" >'
		+'<option></option><option value="潜在客户" selected>潜在客户</option><option value="普通客户">普通客户</option>'
		+'<option value="VIP客户">VIP客户</option><option value="代理商">代理商</option><option value="合作伙伴">合作伙伴</option>'
		+'<option value="失效客户">失效客户</option></select></td>'
        +'    <td width="90"  align=center>行　　业：</td>'
        +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="行业" class="xlandinput">'
		+'</select></td>'
        +'</tr><tr><td width="90">关系等级：</td>'
        +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="关系等级" class="xlandinput">'
		+'<option></option></select></td>'
        +'    <td width="90" align=center>人员规模：</td>'
        +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="规模" class="xlandinput"><option></option>'
		+'<option value="1" selected>10人以内</option><option value="2">10-20人</option>'
		+'<option value="3">20-50人</option><option value="4">50-200人</option><option value="5">200人以上</option></select></td>'
        +'</tr><tr><td width="140">来　　源：</td>'
        +'    <td><select style="WIDTH: 100%;" size="1" datasrc="#fg_providerTab" datafld="来源" class="xlandinput"><option></option>'
		+'</select></td>'
        +'    <td width="90" align=center>阶　　段：</td>'
        +'    <td><select style="WIDTH: 100%;" datasrc="#fg_providerTab" datafld="阶段" class="xlandinput" size="1" name="dt_customer_cu_status"></select></td>'
        +'</tr><tr><td width="90">信用天数：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="信用天数" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>信用金额：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="信用金额" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">上级客户：</td>'
        +'    <td colspan="3"><input datasrc="#fg_providerTab" datafld="上级" class="xlandinput" style="width:94%;" type="text" size="11"  /><input type="button"style="width:26px;height:20px" value="..." onclick="disporg(\'deptbox\')"/></td>'
        +'    </tr><tr><td width="90">公司简介：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:128px" datasrc="#fg_providerTab" datafld="简介" class="xlandinput">dsadasdas</textarea></td>'
        +'    </tr><tr><td width="90">备　　注：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:60px" datasrc="#fg_providerTab" datafld="备注" class="xlandinput">dsadasdas</textarea></td>'
        +'    </tr></table></fieldset>';
    }
    function s02()
    {
        return '<fieldset style="padding: 5px;;width:98%"><legend>联系方式：</legend>'
        +'<table border="0" width="90%" cellpadding="1" style="border-collapse: collapse" align=center >'
        +'<tr><td width="90">国家或地区：</td>'
        +'    <td>'+area()+'</td>'
        +'    <td width="90"  align=center>联&nbsp;系&nbsp;人：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="联系人" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">省 / 市：</td>'
        +'    <td>'+c_state()+'<input datasrc="#fg_providerTab" datafld="市" class="xlandinput" style="width:49%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>电　　话：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="电话" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">法人代表：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="法人代表" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>传　　真：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="传真" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">电子邮箱：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="email" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>网　　址：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="网址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">送货地址：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="送货地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>运输方式：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="运输方式" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">地　　址：</td>'
        +'    <td colspan="3"><input datasrc="#fg_providerTab" datafld="地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    </tr></table></fieldset>';
    }       
             
    function s03()
    {
        return '<br /><br /><fieldset style="padding: 5px;;width:98%"><legend>帐户一：</legend>'
        +'<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center >'
        +'<tr><td width="90">开户银行：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="开户行" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90"  align=center>开户名称：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="开户名称" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">银行账号：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="账号" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>地　　址：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="银行地址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">税　　号</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="税号" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>税　　率：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="税率" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr></table></fieldset>'
        +'<fieldset style="padding: 5px;;width:98%"><legend>帐户二：</legend>'
        +'<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center ><tr><td width="90">开户银行：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="开户行1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90"  align=center>开户名称：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="开户名称1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">银行账号：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="账号1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>地　　址：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="银行地址1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr><tr><td width="90">税　　号</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="税号1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'    <td width="90" align=center>税　　率：</td>'
        +'    <td><input datasrc="#fg_providerTab" datafld="税率1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'</tr></table></fieldset>';
    }                
    function s04()
    {
        return '<table border="0" width="90%" cellpadding="0" style="border-collapse: collapse" align=center >'
        +'<tr><td width="90">客户简介：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#fg_providerTab" datafld="简介" class="xlandinput">dsadasdas</textarea></td>'
        +'</tr>'
        +'<tr><td width="90">合作现状：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#fg_providerTab" datafld="合作现状" class="xlandinput">dsadasdas</textarea></td>'
        +'</tr>'
        +'<tr><td width="90">合作前景：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#fg_providerTab" datafld="合作前景" class="xlandinput">dsadasdas</textarea></td>'
        +'</tr>'
        +'<tr><td width="90">跟进策略：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:70px" datasrc="#fg_providerTab" datafld="跟进策略" class="xlandinput">dsadasdas</textarea></td>'
        +'</tr>'
        +'<tr><td width="90">备　　注：</td>'
        +'    <td colspan="3"><textarea style="WIDTH: 100%;height:35px" datasrc="#fg_providerTab" datafld="备注" class="xlandinput">dsadasdas</textarea></td>'
        +'    </tr></table>';
    };
    function strcontact()
    {
        var s= '<fieldset style="padding: 5px;;width:98%;"><legend>'
        +'主要信息：【联系人姓名：<span id="联系人_keytable" band="联系人" name="联系人_keytable">无</span>】'
        +'</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        +'        <td width="50" align="right"><font face="Wingdings" color="#ff0000">v</font>姓名：</td><td width="80">'
        +'        <input type="text" datasrc="#客户联系人Tab" datafld="姓名" class=\"xlandinput\" style=\"WIDTH: 100;\" /></td>'
        +'        <td width="40" align="right">职务：</td><td width="80">'
        +'        <input type="text" datasrc="#客户联系人Tab" datafld="职务" class="xlandinput" style="width:100%;" size="11"  /></td>'
        +'        <td width="40" align="right">性别：</td><td width="40"><input datasrc="#客户联系人Tab" datafld="性别" title="双击更改" class="xlandinput"  ondblclick="changesex(this)" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="40" align="right">民族：</td><td width="40"><input datasrc="#客户联系人Tab" datafld="民族" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="70" align="right">主联系人：</td>'
        +'        <td width="40" ><input datasrc="#客户联系人Tab" datafld="主" class="xlandradio" type="checkbox" /></td>'
        +'        <td width="40" align="right">无效：</td><td width="40"><input datasrc="#客户联系人Tab" datafld="失效" class="xlandradio" type="checkbox" /></td>'
        +'    </tr></table></fieldset>'+strcontact1()+strcontact3()+'';
        return s;
    }
    function strcontact1()
    {
        return '<fieldset style="padding: 5px;width:98%"><legend>基本资料：</legend>'
        +'<table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center >'
        +'<tr><td width="70" align="right">所在部门：</td><td  width="150"><input datasrc="#客户联系人Tab" datafld="部门" class="xlandinput" style="width:100%;" type="text" size="11"  /></td><td width="70" align="right">出生日期：</td><td width="150"><INPUT datasrc="#客户联系人Tab" datafld="生日" class="xlanddate" style="width:100%; " type="text" size="11" name="姓名2" /></td>'
        +'<td rowspan="8" align="center" valign=middle>'
        +'<table border="0" width="90%" height="160"><tr><td bgcolor="#F6F6F6" align=center valign=center>'
        +'<IMG src="images//Floppy.gif" id="联系人:pic" class="xlandImg" alt="点击看原图..." /></td></tr></table>'        
        +'</td></tr>'
        +'<tr><td width="70" align="right">分　　类：</td>'
        +'<td  width="150"><select style="WIDTH: 100%;" size="1" datasrc="#客户联系人Tab" datafld="分类" class="xlandinput" >'
		+'<option></option><option value="特别重要">特别重要</option><option value="重要">重要</option><option value="普通">普通</option><option value="不重要">不重要</option></select></td>'
        +'<td width="70" align="right">负责业务：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="业务" class="xlandinput" style="width:100%; " type="text" size="11"/></td>'
        +'</tr>'
        +'<tr><td width="70" align="right">籍　　贯：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="籍贯" class="xlandinput"style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">身份证号：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="身份证" class="xlandinput" style="width:100%; " type="text" size="11"/></td>'
        +'</tr>'
        +'<tr><td align="right">个人爱好：</td><td colspan=3><input datasrc="#客户联系人Tab" datafld="爱好" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<tr><td width="70" align="right">工作电话：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="工作电话" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">传　　真：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="传真" class="xlandinput" style="width:100%; " type="text" size="11" /></td>'
        +'</tr>'
        +'<tr><td width="70" align="right">移动电话：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="手机1" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">邮　　编：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="邮编" class="xlandinput" style="width:100%; " type="text" size="11" /></td>'
        +'</tr>'
        +'<tr><td width="70" align="right">移动电话：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="手机2" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">ＭＳＮ：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="MSN" class="xlandinput" style="width:100%; " type="text" size="11" /></td>'
        +'</tr>'
        +'<tr><td width="70" align="right">家庭电话：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="家庭电话" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">SKYPE：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="SKYPE" class="xlandinput" style="width:100%; " type="text" size="11"  /></td>'
        +'</tr>'
        +'<tr><td width="70" align="right">家庭地址：</td>'
        +'<td  width="150"><input datasrc="#客户联系人Tab" datafld="住址" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'<td width="70" align="right">ＱＱ：</td><td width="150">'
        +'<INPUT datasrc="#客户联系人Tab" datafld="QQ" class="xlandinput" style="width:100%; " type="text" size="11" /></td>'
        +'<td align="center"><INPUT id="Button1" title="上传照片" style="WIDTH: 100px;" onclick="upload(\'联系人\',\'pic\')" type="button" value="上传" name="btnOK1"></td></tr>'
        +'</table></fieldset>';
    }
    
    function strcontact3()
    {
        //ID,客户,姓名,职务,主,失效,性别,生日,分类,业务,部门,身份证,工作电话,家庭电话,手机1,手机2,传真,邮编,
        //住址,MSN,QQ,SKYPE,pic,学历,学位,专业,毕业院校,籍贯,民族,身高,体重,爱好,备注
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>其它信息：</legend>'
        +'<table border="0" width="98%" cellpadding="0" style="border-collapse: collapse" align=center >'
        +'<tr><td width="60" align="right">学历:</td><td width="100">'
        +'        <select datasrc="#客户联系人Tab" datafld="学历" class="xlandinput" style="width:100%;" type="text" size="1"  />'
        +'        <option value=""></option><option value="中专">中专</option><option value="大专">大专</option><option value="本科">本科</option>'
        +'        <option value="硕士">硕士</option><option value="博士">博士</option><option value="小学">小学</option><option value="中学">中学</option></select></td>'
        +'        <td width="60" align="right">学位:</td><td width="100"><select datasrc="#客户联系人Tab" datafld="学位" class="xlandinput" style="width:100%;" type="text" size="1"  /><option value=""></option><option value="学士">学士</option><option value="硕士">硕士</option><option value="博士">博士</option></select></td>'
        +'        <td width="60" align="right">专业:</td><td width="100"><input datasrc="#客户联系人Tab" datafld="专业" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="60" align="right">毕业院校:</td><td width="100"><input datasrc="#客户联系人Tab" datafld="毕业院校" class="xlandinput" style="width:100%;" type="text" size="11"  /></td></tr>'
        +'<tr><td width="60" align="right">驾照:</td><td width="100"><input class="xlandradio" type="checkbox" datasrc="#客户联系人Tab" datafld="驾照"/></td>'
        +'        <td width="60" align="right">车牌:</td><td width="100">'
        +'        <input datasrc="#客户联系人Tab" datafld="车牌" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="60" align="right">身高:</td><td width="100"><input datasrc="#客户联系人Tab" datafld="身高" class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        +'        <td width="60" align="right">体重:</td><td width="100"><input datasrc="#客户联系人Tab" datafld="体重" class="xlandinput" style="width:100%;" type="text" size="11"  /></td></tr>'
        +'<tr><td width="60" align="right">备注:</td>'
        +'    <td colspan="7"><textarea style="WIDTH: 100%;height:50px" datasrc="#客户联系人Tab" datafld="备注" class="xlandinput"></textarea></td>'
        +'    </tr>'
        +'</table></fieldset>';
        return s;
    }
    

    function _btnOK()
    {
        ShowHide("1","none");
    }
    
    function xnav(itemname,flag,isExchange)
    {
        var oband=$band(itemname);
        switch(flag)
        {
            case "save":
                ue_save();
                break;
            case "new":
                ue_bandadd(oband.ID);
                break;
            case "del":
                ue_banddelete(oband.ID)
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
	    var bar = new BarObj(itemname,isExchange);
	    bar.onum.value = oband.XmlLandData.recordset.AbsolutePosition+"/"+oband.RecordCount();            
	    SynBandTitle(oband);
    }
	function ue_nstart(itemname)
	{
	    var oband=$band(itemname);
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
	    var oband=$band(itemname);
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
	    var oband=$band(itemname);
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
	    var oband=$band(itemname);
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
    function te_save()
    {
        var ctrl = event.srcElement;
        var oband=$band(ctrl.name.replace("_btn",""));
        var linkval = mband.getFldStrValue("名称");
        var newId = ToolUtil.NewGUID();
        if(oband.status=="new") oband.id = newId;
        var flag = (oband.status=="new")?"1":"0";
        switch(oband.ItemName)
        {
            case "dt_contact":
                var strsql = "EXECUTE dbo.ContactUpdate "+ flag;
                break
            case "dt_opport":
                var strsql = "EXECUTE dbo.OpportUpdate "+ flag;
                break
            case "dt_care":
                var strsql = "EXECUTE dbo.CareUpdate "+ flag;
                break
        }
        strsql = ue_sqlUpdate(oband,strsql,linkval);
        if(ue_ajaxdom(strsql,"1")=="ok"){
            ue_SynAband(oband,linkval);
            oband.modify = false;
            oband.status="";
            us_readband(oband);
            initCEditStatus(event.srcElement);
	    }
    }
    //同步到oband.data
    function ue_SynAband(oband,linkval)
    {
        var keyId = oband.id;
        var linkCol = oband.linkCol;
        var IsNew = (oband.status=="new")?true:false;
        if(IsNew) var xmlNodeRow = oband.root.createElement("table");
        else var xmlNodeRow = oband.data.selectSingleNode("//table[ID='"+ keyId +"']");
        for(var i=0;i<oband.ColNames.length;i++)
        {
	        if(IsNew) var xmlNode = xmlNodeRow.appendChild(xmlNodeRow.ownerDocument.createElement(oband.ColNames[i]));
	        else{
	         var xmlNode = xmlNodeRow.selectSingleNode(oband.ColNames[i]);
	         if(!xmlNode) xmlNode = xmlNodeRow.appendChild(xmlNodeRow.ownerDocument.createElement(oband.ColNames[i]));
	        }
            switch(oband.DataTypes[i])
            {
                case "Boolean":
                    xmlNode.text = ($(oband.ItemName + "_" + oband.ColNames[i]).checked)?"true":"false";
                    break;
                default:
                    if(oband.ColNames[i]==linkCol) xmlNode.text=linkval;
                    else 
                    {
                        if(oband.ColNames[i]=="ID") xmlNode.text = keyId;
                        else
                        {
                            var colctrl = $(oband.ItemName + "_" + oband.ColNames[i]);
                            if(!colctrl) {xmlNode.text = "";break;};
		                    if(colctrl.tagName.toLowerCase()=="div" || colctrl.tagName.toLowerCase()=="span")
		                    {
		                        xmlNode.text = colctrl.innerHTML;
		                        break;
		                    }
                            if(colctrl.type=="radio")
                            {
                                var colctrls = document.getElementsByName(oband.ItemName + "_" + oband.ColNames[i]);
                                if(!colctrls) xmlNode.text = "";
                                else
                                {
                                    for (var m=0;m<colctrls.length;m++)
                                    {
                                        if(colctrls[m].checked) {xmlNode.text = colctrls[m].value;break;}
                                    }
                                }
                            }
                            else
                                xmlNode.text = colctrl.value;
                        }
                    }
                    break
            }
        }
        if(IsNew){
             oband.data.appendChild(xmlNodeRow);
         }
         ue_ResetABand(oband);
    }
    //初始化编辑按钮状态    
    function initCEditStatus(obj)
    {
        $(obj.name+"_edit").innerHTML = '<font face="Webdings" color="#ffff00"></font>编辑';
        $(obj.name+"_new").innerHTML = '<font face="Webdings" color="#ffff00">+</font>新建';
        $(obj.name+"_edit").style.display="inline";
        $(obj.name+"_new").style.display="inline";
        $(obj.name+"_save").style.display="none";
        $(obj.name+"_edit").tag="编辑";
        $(obj.name+"_new").tag="新建";
    }
    //根据表格ID-参数名,控件值-参数值
    function ue_sqlUpdate(oband,strsql,linkval)
    {
        var s = "";
        var EditId = oband.id;
        for (var i=0;i<oband.ColNames.length;i++)
        {
            switch(oband.DataTypes[i])
            {
                case "Guid":
                    s = s + ",'" + EditId+"'";
                    break;
                case "Boolean":
                    var colctrl = $(oband.ItemName + "_" + oband.ColNames[i]);
                    if(!colctrl) 
                        s = s + "," + "null";
                    else
                        if(colctrl.checked) s = s + "," + "1";
                        else s = s + "," + "0";
                    break;
                case "Int32":
                case "Decimal":
                    var colctrl = $(oband.ItemName + "_" + oband.ColNames[i]);                
                    if(!colctrl) s = s + "," + "null";
                    else 
                        if(colctrl.value=="") s = s + "," + "null";
                        else s = s + "," + colctrl.value;
                    break;
                default:
                    if(oband.ColNames[i]==oband.linkCol) {s = s + ",'" + linkval + "'";break;}
                    var colctrl = $(oband.ItemName + "_" + oband.ColNames[i]);
                    if(!colctrl || colctrl.value=="") {s = s + "," + "null";break;}
                    
                    var colctrls = document.getElementsByName(oband.ItemName + "_" + oband.ColNames[i]);
                    if(colctrl.type=="radio") 
                    {
                        if(!colctrls) s = s + "," + "null";
                        else
                        {
                            for (var m=0;m<colctrls.length;m++)
                            {
                                if(colctrls[m].checked) {s = s + "," + colctrls[m].value;break;}
                            }
                        }
                    }
                    else 
                        s = s + ",'" + colctrl.value + "'";
                    break
            }
        }
        return strsql + s;
    }

    function SynBandTitle(oband)
    {
	    var s="",simg="";
	    var imode = 2;
	    oband.rows = oband.XmlLandData.XMLDocument.selectNodes("//"+oband.DataItem);
	    for(var i=0;i<oband.rows.length;i++)
	    {
	        var Idrow = oband.rows[i].selectSingleNode("ID");
	        var en = "";
	        if((i+1) % imode==0) en="<br />";
	        switch(oband.ItemName)
	        {
	            case "联系人":
	                var row = oband.rows[i].selectSingleNode("姓名");
                    if(row.text!=""){
                        s = s + " <img border='0' src='../html/Images/messenger.gif'><a href='#' class='linkbtn_0' band='联系人' onclick='us_checkin()' id='"+Idrow.text+"' name='联系人_btn'>"+row.text+"</a>";
                        simg = simg + " <img border='0' src='../html/Images/messenger.gif'><a href='#'  band='联系人' title='管理联系人' class='linkbtn_0' id='"
                        +Idrow.text+"'onclick='openPro();us_checkin()' name='联系人_btn'>"+row.text+"</a>";
                    }
                break;
	            case "销售机会":
	                var row = oband.rows[i].selectSingleNode("主题");
                    if(!row || row.text=="") break;
                    if(oband.rows[i].selectSingleNode("发现时间"))
                        var skey = oband.rows[i].selectSingleNode("发现时间").text + " ";
                    else skey="";
                    
                    if(oband.rows[i].selectSingleNode("状态"))
                        var status = oband.rows[i].selectSingleNode("状态").text + " ";
                    else status = "跟踪";
                    
                    if(oband.rows[i].selectSingleNode("阶段"))
                        var stage = oband.rows[i].selectSingleNode("阶段").text + " ";
                    else stage = "";

                    s = s + " <span style='width:330px;'><img border='0' src='../html/Images/feed.gif' /><a href='#' width=200px class='linkbtn_0' band='销售机会' onclick='us_checkin()' id='"
                    +Idrow.text+"' name='销售机会_btn' >" 
                    + skey +status+stage+row.text + "</a></span>" + en;
                    break;
	            case "客户关怀":
	                var row = oband.rows[i].selectSingleNode("主题");
                    if(!row || row.text=="") break;
                    if(oband.rows[i].selectSingleNode("日期"))
                        var skey = oband.rows[i].selectSingleNode("日期").text + " ";
                    else skey="";
                    
                    if(oband.rows[i].selectSingleNode("联系人"))
                        var status = oband.rows[i].selectSingleNode("联系人").text + " ";
                    else status = " ";
                    s = s + " <span style='width:300px;'><img border='0' src='../html/Images/feed.gif' /><a href='#' width=200px class='linkbtn_0' band='客户关怀' onclick='us_checkin()' id='"
                    +Idrow.text+"' name='客户关怀_btn' >" 
                    + skey +status+row.text + "</a></span>" + en;
                break;
             }
	    }
	    var keytable = document.getElementsByName(oband.ItemName+"_keytable");
	    if(!keytable) return;
	    for(var i=0;i<keytable.length;i++)
	    {
	        if(s=="") s="无";
	        keytable[i].innerHTML = s
	    }
    }
    
    /*初始化控件数据：
        1 当非按钮操作时(初始化)，读出band.data标签数据生成查询标签，给band.id赋初始值，
          读取band.id对应行数据到编辑表格
          如果band.count=0,则将编辑表格置空
        2 当点击标签时，根据标签id取出对应行数据
    */
	function us_readband(oband)
	{   
	    //如果oband为空，根据点击的按钮上的band名称获取当前band
	    if(!oband)
	        oband=$band(event.srcElement.band);
	    //if(oband.modify){alert("正在编辑中...，请确认！");return;}
	    //更新关键字显示内容
	    SynBandTitle(oband);
	    //根据点击的标签提出对应的oband行内容
	    if(oband.NoAuto)
	    {
	        if(oband.status=="new") oband.id = "";
	        else
	        {
                var rowNode = oband.data.selectSingleNode("//table[ID='"+event.srcElement.id+"']");
                if(rowNode) oband.id = event.srcElement.id;
                else
                {
                    if(oband.id=="")
                        oband.id = (oband.count!=0)?oband.rows[0].selectSingleNode("ID").text:"";
                }
	        }
	    }
	    ue_BandToInput(oband);
    }    

    
    function ue_BandToInput(oband)
    {
        if(!oband) return;
        var IsRead = (oband.status=="")?true:false;
        var rowNode = oband.data.selectSingleNode("//table[ID='"+oband.id+"']");
		for(var i=0;i<oband.ColNames.length;i++)
		{
		    var oinput = $(oband.ItemName + "_" + oband.ColNames[i]);
		    var val = "";
	        if(oband.count>0 && rowNode) 
	        {
	            val = (rowNode.selectSingleNode(oband.ColNames[i]))?rowNode.selectSingleNode(oband.ColNames[i]).text:"";
	            if(oband.ColNames[i]=="ID") oband.id = val;
	        }
		    if(!oinput) continue;
		    var row;
		    if(rowNode) row = rowNode.selectSingleNode(oband.ColNames[i]);
		    if(row) val = row.text;
		    var otype= oinput.type;
		    switch(otype)
		    {
		        case "checkbox":
		            oinput.disabled = IsRead;
		            if(val.toLowerCase()=="true" || val.toLowerCase()=="1" || val.toLowerCase()=="-1")
		                oinput.checked=true;
		            else
		                oinput.checked=false;
				    break;
		        case "radio":	            
		            oinput.disabled = IsRead;
			        var names= msgetElementsByName(oinput,oinput.name);
			        for(var m=0;m<names.length;m++)
			        {
			            names[m].disabled = IsRead;
			            if(names[m].value==val) names[m].checked = true;
			            else names[m].checked = false;
			        }
				    break;
				default:
		            if(oinput.tagName.toLowerCase()=="div" || oinput.tagName.toLowerCase()=="span")
		            {
		                oinput.innerHTML = val;
		                break;
		            }
		            oinput.disabled = IsRead;		            
			        if(oinput.tagName.toLowerCase()=="select")
			        {
				        //ms_ajaxoptions(oinput);
				        oinput.value=val;
				    }
				    else
		    		    if(oinput.className.toLowerCase()=="xlandimg" && oinput.tagName.toLowerCase()=="img")
		    		    {
		    		        var sysurl="";
	    		            if(band.XmlSchema.document.referrer)
	    		                sysurl = band.XmlSchema.document.referrer.replace("contents.htm","").replace("listbar.htm","");//"http://localhost:8096/hmapp/contents.htm
		    		        if(val!="") 
                                oinput.src=sysurl+"wfimg.aspx?img="+val;
	                        else
	                            oinput.src=sysurl+"wfimg.aspx?img=Floppy.JPG";
	                    }
					    else 		
			                oinput.value=val;
		    }
		}     
    }
    
    function   msgetElementsByName(obj,name)
    {   
        var   all   =  obj.parentElement.all;   
        var   result   =   [];
        for   (var   i=0;i<all.length;i++)   
        if   (all[i]["name"]==name)   
        result   [result.length]   =   all[i];   
        return   result;   
    }   

		var sSearchKey = "客户查询...";
		/**
		 * 检查关键字
		 * @param {object}o form表单
		 * @return {bool}返回是否通过验证
		 */
		function fSearchCheck(o){
			var s = o["keyword"].value.trim();
			if(!s || s == sSearchKey){
				try{
					fShowError("请输入搜索关键字");
					o["keyword"].focus();
				}catch(e){}
				return false;
			}
			return true;
		}
		/**
		 * 输入框聚焦
		 * @param {object}o 输入框对象
		 * @return {void}
		 */
		function fSearchFocus(o){
			o.className='IptOnF fRi'
			if(o.value.trim() == sSearchKey){
				o.value = "";
			}
		}
		/**
		 * 输入框失去聚焦
		 * @param {object}o 输入框对象
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
	    //如果oband为空，根据点击的按钮上的band名称获取当前band
	    if(!oband)
	        oband=$band(event.srcElement.band);
	    if(oband.modify){alert("正在编辑中...，请确认！");return;}
	    //更新关键字显示内容
	    SynBandTitle(oband);
	    oband.setCurrentRow(oband.getRowIndex("ID",event.srcElement.id));
    }    
    //客户关怀
    function tb_care(winid)
    {
        return '<div id='+winid+'dvbar style="text-align:right"></div><table cellSpacing="0" cellPadding="0" id="table8" style="border-collapse: collapse;BORDER: #f2f2f2 1px dotted;width:99%;height:100%" bordercolorlight="#E8E8E8" bordercolordark="#E8E8E8">\
		<tr><td align="right" style="BORDER-BOTTOM: #f2f2f2 1px dotted;height:30px"><font face="Wingdings" color="#ff0000">v</font>关怀主题：</td>\
		<td width="22%" style="BORDER-BOTTOM: #f2f2f2 1px dotted"><input datasrc="#dt_care" datafld="主题" class="xlandinput" style="WIDTH: 100%" name="T2" size="20"></td>\
		<td  align=right width="9%">联系人：</td><td  align=right width="14%"><select datasrc="#dt_care" datafld="联系人" class="xlandinput" style="WIDTH: 100%; HEIGHT: 20px" size="1" name="D1">\
		<option></option><option value="boss" >boss</option></select></td><td  align=right><font face="Wingdings" color="#ff0000">v</font>日期：</td>\
		<td  width="27%"><input datasrc="#dt_care" datafld="日期" class="xlanddate"  style="WIDTH: 100%"  value="" name="T6" size="20"></td></tr>\
		<tr><td align="right" style="BORDER-BOTTOM: #f2f2f2 1px dotted">关怀内容：</td>\
		<td width="86%" height=100px colSpan="5" style="BORDER-BOTTOM: #f2f2f2 1px dotted"><textarea style="WIDTH: 100%;height:95%" class="xlandinput"  datasrc="#dt_care" datafld="内容" ></textarea></td></tr>\
		<tr><td align="right" style="BORDER-BOTTOM: #f2f2f2 1px dotted;height:30px">负责人：</td>\
		<td width="22%" style="BORDER-BOTTOM: #f2f2f2 1px dotted"><select datasrc="#dt_care" datafld="负责人" class="xlandinput"  style="WIDTH: 100%;" size="1">\
		<option></option><option value="B1" selected>boss</option></select></td>\
		<td align="right" width="9%" style="BORDER-BOTTOM: #f2f2f2 1px dotted">类型：</td>\
		<td align="right" width="14%" style="BORDER-BOTTOM: #f2f2f2 1px dotted">\
		<select style="WIDTH: 100%; HEIGHT: 20px" size="1" datasrc="#dt_care" datafld="类型" class="xlandinput" name="D3" ><option></option><option value="普通">普通</option></select></td>\
		<td align="right" style="BORDER-BOTTOM: #f2f2f2 1px dotted">　</td><td width="27%" style="BORDER-BOTTOM: #f2f2f2 1px dotted"></td></tr><tr>\
		<td align="right"style="BORDER-BOTTOM: #f2f2f2 1px dotted" >反馈情况：</td>\
		<td width="86%" height=100px colSpan="5" style="BORDER-BOTTOM: #f2f2f2 1px dotted"><textarea style="WIDTH: 100%;height:100%" class="xlandinput"  datasrc="#dt_care" datafld="反馈情况" ></textarea></td>\
		</tr><tr><td align="right" height="50" style="BORDER-BOTTOM: #f2f2f2 1px dotted">备注：</td>\
		<td width="86%" colSpan="5" style="BORDER-BOTTOM: #f2f2f2 1px dotted"><textarea style="WIDTH: 100%;height:99%" class="xlandinput"  datasrc="#dt_care" datafld="备注" ></textarea></td>\
		</tr></table></td></tr></table>';
    }
    //日程
    function tb_action(winid)
    {
        return '<div id='+winid+'dvbar style="text-align:right"></div>\
        <table cellSpacing="0" cellPadding="2" width="100%" border="0" id="table6">\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >\
				<font face="Wingdings" color="#ff0000">v</font>主　　题:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="主题" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >联系人:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="联系人" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >开始日期:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlanddate"  datasrc="#dt_action" datafld="开始日期_格式" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >开始时间:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="开始时间" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >结束日期:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlanddate"  datasrc="#dt_action" datafld="结束日期_格式" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >结束时间:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="结束时间" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >类　　型:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="类型" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
            <tr>\
                <td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%">描　　述:</td>\
                <td vAlign="top" width="90%" colSpan="7" bgColor="#f8f8f8">\
                <textarea style="width: 100%;height:300" name="dt_action_content" ></textarea></td>\
            </tr>\
		</table>';
}
    //任务
    function tb_task(winid)
    {
        return '<div id='+winid+'dvbar style="text-align:right"></div>\
        <table cellSpacing="0" cellPadding="2" width="100%" border="0" id="table6">\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >\
				<font face="Wingdings" color="#ff0000">v</font>主　　题:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="主题" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >联系人:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="联系人" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >类　　型:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlanddate"  datasrc="#dt_action" datafld="类型" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >优先级:</td>\
				<td vAlign="top" width="30%" bgColor="#f8f8f8" colSpan="3">\
				<input id="valuing0" type="radio" value="高" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing0">高</label><input id="valuing1" type="radio" value="中" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing1">中</label><input id="valuing2" type="radio" onclick="ue_radiowrite(mband)" value="低" name="价值评估" checked><label for="valuing2">低</label></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >完成期限:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlanddate"  datasrc="#dt_action" datafld="完成期限_格式" style="width: 99%" name="dt_action_title"></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >时　间:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="时间" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
			<tr>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >状　　态:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input id="valuing0" type="radio" value="已结束" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing0">已结束</label><input id="valuing1" type="radio" value="中" name="价值评估" onclick="ue_radiowrite(mband)"><label for="valuing1">未结束</label><input id="valuing2" type="radio" onclick="ue_radiowrite(mband)" value="低" name="价值评估" checked><label for="valuing2">取消</label></td>\
				<td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%" >执行人:</td>\
				<td vAlign="top" width="30%" colSpan="3" bgColor="#f8f8f8">\
				<input class="xlandinput"  datasrc="#dt_action" datafld="执行人" style="width: 99%" name="dt_action_title"></td>\
			</tr>\
            <tr>\
                <td style="border-bottom: 1px solid #ffffff" vAlign="top" noWrap align="right" width="10%">描　　述:</td>\
                <td vAlign="top" width="90%" colSpan="7" bgColor="#f8f8f8">\
                <textarea style="width: 100%;height:300" name="dt_action_content" ></textarea></td>\
            </tr>\
		</table>';
}
    //销售机会
    function tb_opport(winid)
    {
        return '<div id='+winid+'dvbar style="text-align:right"></div>\
        <table cellSpacing="0" cellPadding="2" width="100%" border="0" id="table6">\
			<tr>\
				<td style="height:25px"   colSpan="6" background="images/cubac.gif"><font face="Wingdings" color="#ff0000">v</font>基本情况：</td>\
			</tr>\
			<tr>\
				<td align="right" ><font face="Wingdings" color="#ff0000">v</font>机会主题：</td>\
				<td width="22%">\
				<input datasrc="#dt_opport" datafld="主题" class="xlandinput" style="WIDTH: 100%" name="T2" size="20"></td>\
				<td  align=right width="11%">类　　型：</td>\
				<td  align=right width="14%">\
				<select datasrc="#dt_opport" datafld="类型" class="xlandinput" style="WIDTH: 100%; HEIGHT: 20px" size="1" name="D1">\
				<option selected></option><option value="1">分类一</option><option value="2">分类二</option>\
				<option value="3">分类三</option></select></td>\
				<td  align=right>来　源：</td>\
				<td  vAlign="top" width="30%"><select datasrc="#dt_opport" datafld="来源" class="xlandinput"  style="WIDTH: 100%;" size="1">\
				</select></td>\
			</tr>\
			<tr>\
				<td align="right" >负责人：</td>\
				<td width="22%"><select datasrc="#dt_opport" datafld="负责人" class="xlandinput"  style="WIDTH: 100%;" size="1">\
				<option></option><option value="B1" selected>boss</option></select></td>\
				<td align="right" width="9%" >发现时间：</td>\
				<td align="right" width="14%" >\
				<input  datasrc="#dt_opport" datafld="发现时间" class="xlanddate"  style="WIDTH: 100%"  value="" name="T1" size="20"></td>\
				<td align="right" >提供人：</td>\
				<td width="27%"><input style="WIDTH: 100%"  datasrc="#dt_opport" datafld="提供人" class="xlandinput" ></td>\
			</tr>\
			<tr>\
				<td align="right" >客户需求：</td>\
				<td width="86%" height=70px colSpan="5"><textarea style="WIDTH: 100%;height:100%" class="xlandinput" datasrc="#dt_opport" datafld="需求" ></textarea></td>\
			</tr>\
			<tr>\
				<td style="height:25px"   colSpan="6" background="images/cubac.gif"><font face="Wingdings" color="#ff0000">v</font>预期</td>\
			</tr>\
			<tr>\
				<td align="right" width="14%" bgColor=#FFFFCC width="120px">预计签单日期：</td>\
				<td width="22%"><input style="WIDTH: 100%" datasrc="#dt_opport" datafld="预期日期" class="xlanddate" ></td>\
				<td width="9%" align="right">预期金额：</td>\
				<td width="14%">\
				<input style="WIDTH: 100%" datasrc="#dt_opport" datafld="预期金额" class="xlandinput" name="T3" size="20" ></td>\
				<td width="20%" align="right">预期金额(外币)：</td>\
				<td width="27%">\
				<input style="WIDTH: 100%" datasrc="#dt_opport" datafld="外币" class="xlandinput" name="T4" size="20" ></td>\
			</tr>\
			<tr>\
				<td style="height:25px"   colSpan="3" background="images/cubac.gif"><font face="Wingdings" color="#ff0000">v</font>当前状态</td>\
				<td style="height:25px"   colSpan="3" background="images/cubac.gif" align="right">\
				<input id="销售机会_状态_0" band="销售机会" type="radio" CHECKED value="跟踪" name="销售机会_状态" onclick="ue_radiowrite()"><label for="销售机会_状态_0">跟踪</label>\
				<input id="销售机会_状态_1" band="销售机会" type="radio" value="成功" name="销售机会_状态" onclick="ue_radiowrite()"><label for="销售机会_状态_1">成功</label>\
				<input id="销售机会_状态_2" band="销售机会" type="radio" value="失败" name="销售机会_状态" onclick="ue_radiowrite()"><label for="销售机会_状态_2">失败</label>\
				<input id="销售机会_状态_3" band="销售机会" type="radio" value="搁置" name="销售机会_状态" onclick="ue_radiowrite()"><label for="销售机会_状态_3">搁置</label>\
				<input id="销售机会_状态_4" band="销售机会" type="radio" value="失效" name="销售机会_状态" onclick="ue_radiowrite()"><label for="销售机会_状态_4">失效</label></td>\
			</tr>\
			<tr>\
				<td align="right" bgColor="#FFFFCC">阶　　段：</td>\
				<td width="22%"><select style="WIDTH: 100%; " size="1" datasrc="#dt_opport" datafld="阶段" class="xlandinput" >\
				<option selected></option>\
				<option value="初期沟通">初期沟通</option>\
				<option value="立项评估">立项评估</option>\
				<option value="需求分析">需求分析</option>\
				<option value="方案制定">方案制定</option>\
				<option value="招投标/竞争">招投标/竞争</option>\
				<option value="商务谈判">商务谈判</option>\
				<option value="合同签约">合同签约</option>\
				</select></td>\
				<td align="right" bgColor="#FFFFCC">可能性：</td>\
				<td align="right" bgColor="#FFFFCC">\
				<select style="WIDTH: 100%; HEIGHT: 20px" size="1" datasrc="#dt_opport" datafld="可行性" class="xlandinput" name="D2" >\
				<option selected></option>\
				<option value="00">00%</option>\
				<option value="10">10%</option>\
				<option value="20">20%</option>\
				<option value="30">30%</option>\
				<option value="40">40%</option>\
				<option value="50">50%</option>\
				<option value="60">60%</option>\
				<option value="70">70%</option>\
				<option value="80">80%</option>\
				<option value="90">90%</option>\
				<option value="100">100%</option>\
				</select></td>\
				<td align="right" bgColor="#FFFFCC">阶段停留：</td>\
				<td width="27%">\
				<input style="WIDTH: 40px;text-align:center"  datasrc="#dt_opport" datafld="阶段停留" readonly class="xlandinput" name="T5" size="20" /> 天</td>\
			</tr>\
			<tr>\
				<td align="right" bgColor="#FFFFCC">阶段备注：</td>\
				<td width="86%" colSpan="5"><input style="WIDTH: 100%" type="text" datasrc="#dt_opport" datafld="阶段备注" class="xlandinput" /></td>\
			</tr>\
			<tr>\
				<td style="height:25px"   colSpan="6" background="images/cubac.gif" colSpan="4"><font face="Wingdings" color="#ff0000">v</font>机会阶段推进历史：<font color="#808000">(自动)</font></td>\
			</tr>\
			<tr>\
				<td width="100%" colSpan="6">\
				<textarea style="WIDTH: 100%;height:80px" datasrc="#dt_opport" datafld="历史" class="gridbrowse" onkeydown="GridUtil.usOnCellEnterTab();"  readonly="true" onfocus="GridUtil.usOnCellRFocusHandle();"></textarea>\
				</td>\
			</tr>\
			<tr>\
				<td width="100%" colSpan="6"><p><font color="#ff3399">注意： <b>橙色区域的数据应及时更新</b>；这将有利于您的销售漏斗和销售预测的准确性</font>\
				</td>\
			</tr>\
    </table>';
}
