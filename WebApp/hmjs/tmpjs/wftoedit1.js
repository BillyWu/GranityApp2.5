    window.onload=WinLoadUtil.MDTPLoad;
    var mband,sband;
    function initWin(){secBoard(0);}
    function openPro(winid){secBoard(1);}
    function secBoard(n) 
    {
        if(n>=mainTable.tBodies.length) return;
        for(i=0;i<mainTable.tBodies.length;i++)
          mainTable.tBodies[i].style.display="none";
        mainTable.tBodies[n].style.display="block";
        switch(n)
        {
            case 0:
                $loading();
                initBoard0();
                $loading("none");
                if(!sband) return;
                try{
                 $("txtbar").focus();
                }catch(ex){break;}
                break;
            case 1:
                try{
                $("txtbarlocate").focus();
                }catch(ex){break;}
                break;
            case 2:
                CreateOpionTable()
                break;        
            case 3:
                CreateFlowMonitor()
                break;        
        }
    }
    function CreateFlowMonitor()
    {
        var wfband=$band("monitor");
        //wfband.XQuery;
        if(wfband==null || wfband.RecordCount()==0) {alert("无流程流转！");return;}
        var strflow = "";
        var strarrow ='<div style="float:left;width:50;height:50px;"  ><img style="float:left;" border="0" src="images/arrow3.png" width="48" height="48"></div>';
        var strnode = '<div style="float:left;width:154px;"><div style="background:url(images/hmbn.png) left top no-repeat;" class="btnbox" onclick="" onmousemove="this.style.backgroundPosition=\'left bottom\';" onmouseout="this.style.backgroundPosition=\'left top\';" >'
        +'<div class="digg_act">';
        for(var i=0;i<wfband.RecordCount();i++)
        {
            strflow = strflow + strnode + wfband.getFldStrValue("节点",i)+"</div>"
            +"</div>"+ "<br/>("+wfband.getFldStrValue("责任人",i)+"："+wfband.getFldStrValue("时间",i)+")<br/><br/></div>"+strarrow;
        }
        divflow.innerHTML = strflow;
    }

    var rptlabels = new Array("在线库存","采购记录","客户退换货统计","全国库存分布查询","进出库存报表","日销售统计");
    var _rpthtml='<font face="Wingdings" color="#99cc00">w</font><A style="COLOR: #804000" class="linkbtn_0" href="#" target="_self">';
    function setlabel(arr)
    {
        var rptslabel = "";
        for(var i=0;i<arr.length;i++)
          rptslabel += "　"+_rpthtml+arr[i]+"</A>";
        document.write(rptslabel);
    }

    var sSearchKey = "商品查询...";
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
    function DlgSelectGoods(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        var str=strfind(winid,gridname,bandname);
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 600;
            owin.height = 400;
            owin.top    = 200;
            owin.left   = 200;
            owin.title  = title;
            owin.text   = str;
            owin.hovercolor = "orange";
            owin.color = "black";
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
            dwmsg(winid).innerHTML=str;
        }
        var oband = $band(bandname);
        oband.gridtype = 13;  oband.freecols = "款号";        oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",true,1,1);
        oband.XQuery();
        center(winid);
    }       
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        var s= '<fieldset style="padding: 5px;;width:98%"><legend>查询：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        +'        <td width="60" align="right">款号:</td><td width="100">'
        +'        <input id=\"款号\" name=\"款号\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
        +'        <td width="60" align="right">颜色:</td><td width="80">'
        +'        <INPUT name="dbo.fun_getPY(颜色名称);颜色名称" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
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
        $loading("none");
    }
    function ue_submit()
    {
        //由对话框取出目的节点,其它等同于ue_save()
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("gonodes").Val("名称");
        if(destnode==""){alert("请指定一个目的节点!");return;}
        mband.setFldStrValue(null,"目的节点",destnode);
        ToolUtil.setParamValue(xmldoc, "下一节点", $band("gonodes").Val("下一节点"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("单据编号"),"string", "S", null,"D");
        ShowHide("winnodes","none");
        if($band("gonodes").Val("不分发")!="true" && $band("gonodes").Val("下一节点")!="结束") 
            DlgJbrs('winjbs','dvjbs','经办人选择','jbr');
        else {ue_save("提交成功!");goback()};
    }
    function ue_return()
    {
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("bknodes").Val("名称");
        if(destnode==""){alert("请指定要退回的节点!");return;}
        mband.setFldStrValue(null,"目的节点",destnode);
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("单据编号"),"string", "S", null,"D");
        ToolUtil.setParamValue(xmldoc, "提交方向","回退", "s", "P", "", "Ts","");
        ShowHide("winnodes","none");
        ue_save("回退成功!");goback()
    }    
    function _submit()
    {
        if(sband.RecordCount()==0){alert("没有明细数据,请检查!");return;}
        if(mband.Val("单据编号").length<4)
        {
            if(ue_save("")) DlgNodes('winnodes','dvnodes','节点选择','gonodes');
        }
        else
        {
            DlgNodes('winnodes','dvnodes','提交节点选择','gonodes');
        }
    }
    function _return()
    {
        if(mband.Val("单据编号").length<4) return;
        DlgNodes('winnodes','dvnodes','回退节点选择','bknodes');
    }    
    function DlgJbrs(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);

        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>友情提示：</legend>'
        +'<p  style="margin:5px;text-align:left">　请在上述列表中指定一个或多个经办者，如果未指定经办者，则下列表格中所有人都可办理该项工作！</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'【<a href="#" class="linkbtn_0" onclick=ue_save("提交成功!");goback();>提交</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>关闭</a>】</p>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.top    = 200;
            owin.left   = 200;
            owin.title  = title;
            owin.text   = str;
            owin.hovercolor = "orange";
            owin.color = "black";
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
            dwmsg(winid).innerHTML=str;
        }
        var oband = $band(bandname);
        oband.gridtype = 1;  oband.freecols = "姓名"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        oband.XQuery();
        center(winid);
    }       
    function DlgNodes(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        var oband = $band(bandname);
        oband.XQuery();
        if(oband.RecordCount()==0){alert("没有可退回的节点!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
        +'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.top    = 200;
            owin.left   = 200;
            owin.title  = title;
            owin.text   = str;
            owin.hovercolor = "orange";
            owin.color = "black";
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
            dwmsg(winid).innerHTML=str;
        }       
        oband.gridtype = 1;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        center(winid);
    }       
    function goback()
    {
        window.history.back();
    }

    function CreateOpionTable()
    {
        var oband=$band("opinion");
        oband.XQuery;
        if(oband==null || oband.RecordCount()==0) {alert("该审批不需要填写意见栏！");return;}
        var xmldoc=document.UnitItem.ParamXmldoc;
        var spnode = ToolUtil.getParamValue(xmldoc,"节点","S","","D");
        var strTabhead = '<table id="tbopinion" style="width:100%;height:100%; border-collapse:collapse" border="1" cellspacing="0" '
        +'cellpadding="0" bordercolorlight="#D5DFE5" bordercolordark="#D5DFE5"><tbody>'
        +'<tr><td width="40" align="center" height="30">序号</td><td width="120" align="center">审批环节</td>'
        +'<td align="center" >审批意见</td><td style="padding:10px" align="center" width="200px">审批日志</td></tr>';	 	 
        var strTabend  ='</tbody></table>';
        var strTabconts = new Array();
        var str = "";
        var oSys = document.UnitItem.ActiveBand.CalXmlLand.Fun;
        var username = oSys.GetUserName();
        var userid = oSys.GetUserSn();
        var openionscount = oband.RecordCount();
        var eachheight = 100/openionscount;
        for(var i=0;i<oband.RecordCount();i++)
        {
         strTabconts[0] = '<tr><td width="40"  align="center">';
         strTabconts[1] = '</td><td width="120">';
         strTabconts[2] = '</td><td height='+eachheight+'% >';
         strTabconts[3] = '</td><td valign="top" style="padding:10px" align="center" width="200px">';
         strTabconts[4] = '</td></tr>';
         var conts = new Array();
         conts[0] = i+1;
         conts[1] = oband.getFldStrValue("节点标题",i).replace("#","");
         var strtextarea = '<textarea style="width:100%;height:100%;border:0"  disabled="true">';
         var strname     = '<INPUT style="width:100; " type="text"  disabled="true" size="11" name="man" value="';
         var strdt       = '<INPUT style="width:100; " type="text" disabled="true" size="11" name="dt"  value="';
         var jbr = oband.Val("经办人",i);
         var dt = oband.Val("时间",i);
         //var strbtn = '【<a href="#" onclick="wf_input(\'同意！\',\'txtopion\')">同意</a>】【<a href="#" onclick="wf_input(\'不同意！\',\'txtopion\')">反对</a>】【<a href="#" onclick="wf_input(\'已备案！\',\'txtopion\')">备案</a>】';
         var strenable="disabled=true";
         if(spnode ==oband.getFldStrValue("节点",i))
         {
             strenable ="";
             strtextarea = '<textarea id="txtopion" onchange="wf_update(\'意见\',\'opinion\')" style="width:100%;height:100%;color:#800000">';
             strdt       = '<INPUT class="inputDate" onchange="wf_update(\'时间\',\'opinion\')" style="width:100;color:#800000 " type="text" size="11" name="dt"  value="';
             strTabconts[0] = '<tr><td width="40" align="center">';
             strTabconts[1] = '</td><td width="120" style="font-weight: bold;color:#800000" align="center">';
             strTabconts[2] = '</td><td height="100px" >';
             strTabconts[3] = '</td><td valign="top" style="padding:10px" align="center" width="200px">';	 	         
             strTabconts[4] = '</td></tr>';
             if(jbr=="") {oband.setFldStrValue(i,"经办人",userid);jbr = username;}
             if(dt=="")  {oband.setFldStrValue(i,"时间",new Date().toLocaleDateString());dt = new Date().toLocaleDateString();}
             oband.setCurrentRow(i);
         }
         var strcheck0="";var strcheck1="";var strcheck2="";
         switch(oband.Val("结论",i))
         {
            case "同意":strcheck0=" checked ";strcheck1="";strcheck2="";
                 break;
            case "不同意":strcheck0="";strcheck1=" checked ";strcheck2="";
                 break;
            case "备案":strcheck0="";strcheck1="";strcheck2=" checked ";
                 break;
            default:strcheck0="";strcheck1="";strcheck2="";
                 break;            
         }
         var strbtn = 
             '<input type="radio" id="hotlevel_'+i+'0" '+strcheck0+strenable+' value="同意" band="opinion"  name=结论_'+i+' field="结论" onclick="ue_radiowrite();wf_input(\'同意\',\'txtopion\')"/>'
            +'<label for="hotlevel_'+i+'0">同意</label>'
            +'<input type="radio" id="hotlevel_'+i+'1" value="不同意" '+strcheck1+strenable+' band="opinion" name=结论_'+i+' field="结论" onclick="ue_radiowrite();wf_input(\'不同意\',\'txtopion\')"/><label for="hotlevel_'+i+'1">不同意</label>'
            +'<input type="radio" id="hotlevel_'+i+'2" value="备案" '+strcheck2+strenable+' band="opinion"  name=结论_'+i+' field="结论" onclick="ue_radiowrite();wf_input(\'备案\',\'txtopion\')" /><label for="hotlevel_'+i+'2">备案</label>';
         conts[2] = strtextarea + oband.getFldStrValue("意见",i)+'</textarea>';
         if(oband.getFldStrValue("节点标题",i).indexOf("#")<0)
         {
            conts[3] = '<span style="width:60; " >责任人：</span>'+strname + jbr+'" /><br />'
 		          +'<span style="width:60; " >日　期：</span>'+strdt+ dt +'" />'
 		          +'<br /><br /><br />'+strbtn;
          }
          else 
          {
            conts[3] = '<br />'
 		          +'<span style="width:60; " >日　期：</span>'+strdt+ dt +'" />';
          }
         conts[4] = '';		 	 
        var strconts = "";
        for(var j=0;j<strTabconts.length;j++)
	        strconts = strconts + strTabconts[j]+conts[j];
        str = str + strconts;
        }
        var strTable = strTabhead+str+strTabend;	
        DivID.innerHTML=strTable ;
        if($("txtopion"))
        $("txtopion").focus();
    }
    function wf_input(txt,objid)
    {
        if(!$(objid)) return;
        $(objid).focus();
        $(objid).innerText += txt;
    }
    function wf_update(field,itemname)
    {
        var srcEle=event.srcElement;
        if(!srcEle) return;
        oband=$band(itemname);
        oband.setFldStrValue(null,field,srcEle.value)
    }		
