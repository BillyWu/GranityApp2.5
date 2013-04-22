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
                $loading();initBoard0();if(!sband) return;         
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
    var sSearchKey = "商品查询...";
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
                _delpms();
                if($("Btn提交")) {
                    $("Btn提交").disabled=true;
                    if($("Btn保存")) $("Btn保存").disabled=true;
                }
                if($("Btn返回")) $("Btn返回").fireEvent("onclick");
                goback();
            }
            _delpms()
        }
    }
    function _delpms()
    {
        ToolUtil.delParam($XP(), "编号", "S", null,"D");
        ToolUtil.delParam($XP(), "下一节点", "P", null,"Ts");
        ToolUtil.delParam($XP(), "接收部门", "P", null,"C");
        ToolUtil.delParam($XP(), "提交方向", "P", null,"Ts");
        mband.setFldStrValue(null,"目的节点","");
        mband.setFldStrValue(null,"接收部门","");    
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
            _delpms();
            if($("Btn回退")) 
            {
                $("Btn回退").disabled=true;
                if($("Btn保存")) $("Btn保存").disabled=true;
            }
            if($("Btn返回")) $("Btn返回").fireEvent("onclick");
            else goback();
        }
        _delpms();
    }    
    function _submit()
    {
        if(sband.RecordCount()==0){alert("没有明细数据,请检查!");return;}
        if(ue_save(""))
        {
            if(!mband.nextnode)
                DlgNodes('winnodes','dvnodes','节点选择','gonodes'); 
        }
    }
    function _return()
    {
        if(mband.Val("单据编号").length<4) return;
        DlgNodes('winnodes','dvnodes','回退节点选择','bknodes');
    }
    function jbrsubmit()
    {
        if(ue_save("提交成功!"));{
            _delpms();
            if("function"==typeof(ts_quit)){ts_quit();}
            else goback();
        }
        _delpms();;
    }
    function jbDeptsubmit()
    {
        mband.setFldStrValue(null,"接收部门",$band("jbdept").Val("部门代码"));
        if(ue_save("提交成功!"));
        {
            _delpms();          
            if($("Btn提交")) 
            {
                $("Btn提交").disabled=true;
                if($("Btn保存")) $("Btn保存").disabled=true;
            }
            if($("Btn返回")) $("Btn返回").fireEvent("onclick");
            else goback();
        }
        _delpms();
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
        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>友情提示：</legend>'
        +'<p  style="margin:5px;text-align:left">　请在上述列表中指定一个或多个经办者，如果未指定经办者，则下列表格中所有人都可办理该项工作！</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'【<a href="#" class="linkbtn_0" onclick="jbrsubmit()";>提交</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>关闭</a>】</p>';
        DlgWin(winid,gridname,title,bandname,str,500,300);
        var oband = $band(bandname);
        oband.gridtype = 1;  oband.freecols = "姓名"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        oband.XQuery();
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
    function DlgNodes(winid,gridname,title,ItemName)
    {
        ToolUtil.setParamValue($XD(), "单据编号", mband.Val("单据编号"),"string", "P", null,"C");
        var oband = $band(ItemName);
        oband.XQuery();
        if(oband.RecordCount()==0){alert("没有可提交的节点!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
        +'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
        DlgWin(winid,gridname,title,ItemName,str,500,300);
        oband.gridtype = 17;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
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
        var str='<fieldset style="padding: 5px;;width:98%;height:200"><legend>审批意见：</legend>\
        <textarea id="txtopinion" style="width:100%;height:100%" ></textarea>\
        <p style="text-align:right"><IMG src="images/ok24.png" onclick=okopinion("同意") style="cursor:hand" alt="同意!" border="0" />&nbsp;&nbsp;<IMG src="images/road0.gif" onclick="okopinion(\'不同意\')"  alt="不同意!"  style="cursor:hand" border="0" />&nbsp;&nbsp;<IMG src="images/road1.gif" onclick="okopinion(\'备案\')" alt="备案!"  style="cursor:hand" border="0" /></p>\
        </fieldset>';
        DlgWin(winid,null,"编辑审批意见","opinion",str,500,300);
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
    function showchart()
    {
        var title="客户类型分布统计";
        var vname="数量";
        var chartstyle="bar";
        var sql="exec chart_客户类型分布统计";
        DlgChart("winchart",sql,chartstyle,vname,title);
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
    function _selectgoods()
    {
        DlgSelectGoods("wingoods","dvgoods","商品资料查询","slgoods");
    }

    function tm_selectgoods(title,srcitem,mitem,destitem,w,h,spos,callback,eqflds)
    {
        if($band(mitem).RecordCount()==0){alert("请填写摘要信息!");return};
        var str = strfind("wingoods","dvgoods", srcitem, destitem,callback,mitem,spos,eqflds);
        DlgWin("wingoods","dvgoods",title,srcitem,str,w,h)
        var ob = $band(srcitem);
        ob.gridtype = 13;  ob.freecols = "名称";  ob.noxml=true;ob.check=true;      ob.minwidth = "120px";ob.StrongGrid=true;
        ob.Asyn = true;
        $loading();
        if("function"==typeof(ts_filter))
            ts_filter();
        else ob.XQuery();
        ob.AfterXQuery = function()
        {
            new XGrid("dvgoods",ob,"in",true,1,1);
            $loading("none");
         }        
    }    
    function strfind(winid, gridname, srcitem, destitem,callback,mitem,spos,eqflds)
    {
        if (!srcitem) srcitem = "";
        var storeinfo = '<td width="60" align="right">库位:</td><td width="100">\
        <input id=\"库位\" name=\"库位\" datasourceid="exec FD_库位 null" datatextfield="name" datavaluefield="name" filter=\"and\" \
        class=\"xlandinput\" size=\"1\" style=\"WIDTH: 100;\"><input title="要选择吗，点我一下..." class="txtbtn" type=button value="..." \
        style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/></td>';
        if(srcitem!="slstoregoods" || (spos && $band(mitem).Val(spos)!="")) storeinfo="";
        oklocate.callback = callback;
        var s= '<fieldset style="padding: 5px;;width:99%"><legend>查询：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        + storeinfo
        +'        <td width="60" align="right">品名:</td><td>'
        +'        <input id=\"名称\" name=\"dbo.fun_getPY(名称);名称;编码\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 100%;\"></td>'
        +'        <td width="60" align="right">药品类别:</td><td width="100">'
        +'        <INPUT name="dbo.fun_getPY(类别);类别" filter=\"and\" datasourceid="exec FD_商品类别" datatextfield="title" datavaluefield="name" class="xlandinput" style="width:100%;" type="text" size="11"  /><input title="要选择吗，点我一下..." class="txtbtn" type=button value="..."  style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/></td>'
        + '        <td width="60" align="center"><img border="0" style="cursor:hand" src="Images/find16.png" onclick=ue_tfilter("' + srcitem + '") /></td>'
        + '        <td width="60" align="center">【<a href="#" \
        onclick=oklocate("' + winid + '","' + gridname + '","' + srcitem + '","' + (!destitem ? "" : destitem) + '","无此产品！","","' + eqflds + '")>确定</a>】</td>'   
        +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:99%;height:89%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="双击选入..." size="13" onblur="_onblurbox(this)" name="D1" \
        datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300;\
         position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
        return s+s1+s2;
    }
    function oklocate(winid, gridname, srcitem, destitem, hint, keywords,eqflds)
    {
        var ob = $band(srcitem);
        ob.IsImport="1";
        $band(destitem).exportItem=srcitem;
        document.importItem = destitem || "detail";
        $U().CheckInSelfParentUnit("import",null,null,eqflds);
        if ("function" == typeof (oklocate.callback))
            oklocate.callback();
        ShowHide(winid,"none");
    }
    