    var mband,sband;
    function initWin(){InitView();secBoard(0);}
    function openPro(winid){secBoard(1);}
    function secBoard(n) 
    {
        if($("mainTable")){
            if(n>=mainTable.tBodies.length) return;
            ueToolCurrent(n,"tbdiv");
            for(i=0;i<mainTable.tBodies.length;i++)
              mainTable.tBodies[i].style.display="none";
            mainTable.tBodies[n].style.display="block";
        }
        switch(n)
        {
            case 0:
                $loading();initBoard0();$loading("none");if(!sband) return;         
                if(mband.RecordCount()==0) break;
                try{
                    initbars();
                    $("txtbarlocate").focus();
                }catch(ex){break;}                
                try{ $("txtbar").focus();}catch(ex){break;}break;
            case 1: if(mband.RecordCount()==0) break;CreateOpionTable();break;        
            case 2: if(mband.RecordCount()==0) break;showworkflow(ToolUtil.getParamValue($XD(),"workflow","S","","D")) ;break;
            case 4: if(mband.RecordCount()==0) break;
                if("function"==typeof(ts_jhdshow)){ts_jhdshow();}    
                break;
        }
        if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"节点","S","","D");
    }
    function CreateFlowMonitor()
    {
        var wfband=$band("monitor");
        //wfband.XQuery;
        if(wfband==null || wfband.RecordCount()==0) {alert("无流程流转！");return;}
        var strflow = "";
        var strarrow ='<div style="float:left;width:50;height:50px;"  ><img style="float:left;" border="0" src="images/arrow3.png" width="48" height="48"></div>'
        var strnode = '<div style="float:left;width:154px;"><div style="background:url(images/hmbn.png) left top no-repeat;" class="btnbox"  >'
        +'<div>';
        for(var i=0;i<wfband.RecordCount();i++)
        {
            strflow = strflow + strnode + wfband.getFldStrValue("节点",i)+"</div>"
            +"</div>"+ "<br/>("+wfband.getFldStrValue("责任人",i)+"："+wfband.getFldStrValue("时间",i)+")<br/><br/></div>"+strarrow;
        }
        divflow.innerHTML = strflow;
    }

    function InitView()
    {
        try{ueToolbar("tbdiv",elems1,elemsevent1);}catch(ex){};
        try{ueLabel("lbldiv1",elems2,elemsevent2);}catch(ex){};
        try{ueLabel("lbldiv2",elems3,elemsevent3,1);}catch(ex){};
        if($("fSearchText")) $("fSearchText").name = SearchFields;
    } 
    var sSearchKey = "查询...";
    function ue_submit()
    {
        //由对话框取出目的节点,其它等同于ue_save()
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("gonodes").Val("名称");
        if(destnode==""){alert("请指定一个目的节点!");return;};
        mband.setFldStrValue(null,"目的节点",destnode);
        ToolUtil.setParamValue(xmldoc, "下一节点", $band("gonodes").Val("下一节点"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("单据编号"),"string", "S", null,"D");
        ShowHide("winnodes","none");
        if("function"==typeof(Self_Submit)){Self_Submit(destnode)}
        if($band("gonodes").Val("不分发")!="true" && $band("gonodes").Val("下一节点")!="结束") 
        {
            if($band("jbdept"))
                DlgJbDept('winjbs','dvjbs','部门选择','jbdept');
            else
                DlgJbrs('winjbs','dvjbs','经办人选择','jbr');
        }
        else{
            var dept =  ToolUtil.getParamValue($XD(),"DeptCode","S","","D");
            mband.setFldStrValue(null,"接收部门",dept);
            ToolUtil.setParamValue($XD(), "接收部门", dept,"string", "P", null,"C");
            if(ue_save("提交成功!"))
            {
                if($("Btn提交")) {
                    $("Btn提交").disabled=true;
                    if($("Btn保存")) $("Btn保存").disabled=true;
                }
                if($("Btn返回")) $("Btn返回").fireEvent("onclick");
                goback();
            }
        }
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
        if(ue_save("回退成功!"))
        {
            if($("Btn提交")) {
                $("Btn提交").disabled=true;
                if($("Btn保存")) $("Btn保存").disabled=true;
            }
            if($("Btn返回")) $("Btn返回").fireEvent("onclick");        
        }
    }    
    function _submit()
    {
        if(sband.RecordCount()==0){alert("没有明细数据,请检查!");return;}
        if(ue_save("")) 
            DlgNodes('winnodes','dvnodes','节点选择','gonodes');
    }
    function _return()
    {
        if(mband.Val("单据编号").length<4) return;
        DlgNodes('winnodes','dvnodes','回退节点选择','bknodes');
    }
    function jbrsubmit()
    {
        if(ue_save("提交成功!"));{
            if("function"==typeof(ts_quit)){ts_quit();}
            else goback();
        }
    }
    function jbDeptsubmit()
    {
        mband.setFldStrValue(null,"接收部门",$band("jbdept").Val("部门代码"));
        if(ue_save("提交成功!"));{          
            if($("Btn提交")) 
            {
                $("Btn提交").disabled=true;
                if($("Btn保存")) $("Btn保存").disabled=true;
            }
            if($("Btn返回")) $("Btn返回").fireEvent("onclick");
            else goback();
        }
    }
    function goback()
    {
        var m = ToolUtil.getParamValue($XD(),"MasterUnit","S","","D");
        usGetTopFrame().IOpenItemURL(m);
    }
    
    function ts_quit()
    {
        ms_close(true);
    }
    function DlgJbrs(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);

        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>友情提示：</legend>'
        +'<p  style="margin:5px;text-align:left">　请在上述列表中指定一个或多个经办者，如果未指定经办者，则下列表格中所有人都可办理该项工作！</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'【<a href="#" class="linkbtn_0" onclick="jbrsubmit()";>提交</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>关闭</a>】</p>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.title  = title;
            owin.text   = str;
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
    function DlgJbDept(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        var oband = $band(bandname);
        oband.XQuery();
        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>友情提示：</legend>'
        +'<p  style="margin:5px;text-align:left">　请在上述列表中指定一个或多个经办者部门！</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'【<a href="#" class="linkbtn_0" onclick="jbDeptsubmit()";>提交</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>关闭</a>】</p>';
        if(oband.RecordCount()==1) {jbDeptsubmit();return;};
        DlgWin(winid,gridname,title,bandname,str,500,300);
        oband.gridtype = 17;  oband.freecols = "部门"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
    }       
    function DlgNodes(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        ToolUtil.setParamValue($XD(), "单据编号", mband.Val("单据编号"),"string", "P", null,"C");
        var oband = $band(bandname);
        oband.XQuery();
        if(oband.RecordCount()==0){alert("没有可提交的节点!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
        +'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.title  = title;
            owin.text   = str;
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
            dwmsg(winid).innerHTML=str;
        }       
        oband.gridtype = 17;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        center(winid);
    }       
    function _back(){
    window.history.back(-1);}
    
    function CreateOpionTable()
    {

        var ob=$band("opinion");
        ob.merges="@审批日志=经办人,时间";
        ob.gridtype = 1;  ob.freecols = "意见"; ob.minwidth = "100px";
        var Grid = new XGrid("DivID",ob,"in",null,1,1);
        ob.XQuery();
        if(ob==null || ob.RecordCount()==0) {alert("目前不需要填写意见栏！");return;}
    }
    function okopinion(s)
    {
        $band("opinion").setFldStrValue(null,"结论",s);
        $band("opinion").setFldStrValue(null,"经办人",$S().GetUserName());
        $band("opinion").setFldStrValue(null,"时间",new Date().toLocaleDateString());
        $band("opinion").setFldStrValue(null,"意见",$("txtopinion").innerText);
        ShowHide("winopin","none");
    }
    function writeop()
    {
        GridUtil.usOnCellRFocusHandle();
        var spnode = ToolUtil.getParamValue($XD(),"节点","S","","D");
        if($band("opinion").Val("节点")!=spnode) return;
        var winid="winopin";
        var owin = dwobj(winid);
        var str='<fieldset style="padding: 5px;;width:98%;height:200"><legend>审批意见：</legend>\
        <textarea id="txtopinion" style="width:100%;height:100%" ></textarea>\
        <p style="text-align:right"><IMG src="images/ok24.png" onclick=okopinion("同意") style="cursor:hand" alt="同意!" border="0" />&nbsp;&nbsp;<IMG src="images/road0.gif" onclick="okopinion(\'不同意\')"  alt="不同意!"  style="cursor:hand" border="0" />&nbsp;&nbsp;<IMG src="images/road1.gif" onclick="okopinion(\'备案\')" alt="备案!"  style="cursor:hand" border="0" /></p>\
        </fieldset>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.title  = "编辑审批意见";
            owin.text   = str;
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
        }       
        center(winid);
        $("txtopinion").innerText=$band("opinion").Val("意见");
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
    function showworkflow(flowname)
    {
        wftitle.innerText = "工作流程监控：【"+flowname+" ("+mband.Val("单据编号")+")】";
    	var sql= "exec wf_show '"+flowname+"'"
    	var xmldata = ue_ajaxdom(sql);
    	var htmlstr = xmldata.selectSingleNode("//table/htmlstr").text;
    	Canvas.innerHTML = htmlstr;
    	setflow();
    }        

    function setflow(ob)
    {
        if(!ob) ob=mband;
        if(!$band("inflow")){alert("数据不完整!");return;}
    	$band("inflow").XQuery(true);
    	$band("monitor").XQuery(true);
    	var objs = document.getElementsByTagName("RoundRect");
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
            	        objs[i].onmousedown="";
    	             }
    	        }
    	    }
    	    //onmousemove="this.style.backgroundPosition=\'left bottom\';" onmouseout="this.style.backgroundPosition=\'left top\';" 
	    }
	    var objs = document.getElementsByTagName("Oval");
	    for(var i=0;i<objs.length;i++)
	    {
    	    objs[i].ondblclick="";
    	    objs[i].onmousemove="";
    	    objs[i].onmouseout="";
    	    objs[i].onmousedown="";
	        objs[i].title=""
	    }    	
	    var objs = document.getElementsByTagName("PolyLine");
	    for(var i=0;i<objs.length;i++)
	    {
    	    objs[i].ondblclick="";
    	    objs[i].onmousemove="";
    	    objs[i].onmouseout="";
    	    objs[i].onmousedown="";
	        objs[i].title=""
	        objs[i].strokecolor = "gray"
	        objs[i].onmousedown="";//=objFocusedOn(this.id)
	    }    
    }
