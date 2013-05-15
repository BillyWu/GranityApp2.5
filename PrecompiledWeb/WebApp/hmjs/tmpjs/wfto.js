      var mband;
      var elems2 = [];
      var elemsevent2 = [];
      var titles=[];
      function initWin()
      {
        mband = $band("nav");if(!mband){alert("项目：【nav】配置错误！");return;}
        $loading();
        mband.Asyn=true;
        mband.hasGrid=true;
        mband.XQuery();
        mband.AfterXQuery = function()
        {
            this.gridtype = 20; this.freecols = "项目名称";this.minwidth = "60px";this.noxml=true;
            this.barcode = "<span></span>";
            var Grid = new XGrid("dvmband",this,"in",null,1);  
            $loading("none");
        }
        getwfitem();     
        window.setInterval(wfRefresh,10000);        
      }
      
      function wfRefresh(){mband.XQuery(true);}
      
      function getwfitem()
      {
        var xmlhttp = ue_ajaxdom("exec wf_newbills @UserAccounts",null,null,null,null,true);
        xmlhttp.onreadystatechange = function()
        {
           var _x = xmlhttp.readyState;
           if(_x == 4 && xmlhttp.status == 200)
            {
                elems2.length=0;elemsevent2.length=0;
                xmldata = xmlhttp.responseXML;
                if(!xmldata || xmldata.xml=="") return;
                var s = "";var items = xmldata.selectNodes("//table");
                for(var i=0;i<items.length;i++)
                {
                    var wf = items[i].selectSingleNode("流程").text;
                    elems2.push(wf);
                    var o = items[i].selectSingleNode("tag");
                    if(!o) continue;
                    var strItem = ToolUtil.valueTag(o.text,"执行项目");
                    var prname = "单据编号,workflow,startnode,节点,MasterUnit";
                    var prval  = mband.Val("单据编号")+","+wf+","+ToolUtil.valueTag(o.text,"节点")
                    +","+ToolUtil.valueTag(o.text,"节点")+","+$U().UnitName;
                    var itemevent = "usGetTopFrame().IOpenItemURL('"+strItem+"','"+prname+"','"+prval+"')";
                    elemsevent2.push(itemevent);
                    titles.push((!items[i].selectSingleNode("说明"))?"":items[i].selectSingleNode("说明").text);
                }
                ueLabel("tbdiv",elems2,elemsevent2,null,null,titles,true);
                if($("tbdiv").innerHTML!="")
                $("tbdiv").innerHTML='<img border="0" src="Images//NewRecordHS.gif" style="vertical-align:middle" vspace=0 hspace=3 />'+$("tbdiv").innerHTML;
            }
        }
      }      
      function ue_addbill()
      {
        if($("wfname").innerText==""){alert("请指定要起草的工作流名称!");return;}
        var str = "您将起草一个新的【"+$("wfname").innerText+"】办件，确认吗？";if(!confirm(str)) return;
        //取tag值:"@节点=起草,@执行项目=成品库盘点,@查阅项目=成品库盘点单,@权限="    html/html/  //prname,prval为强制由其它单元转入的参数，以供新打开的单元初始化时象系统参数一样使用
        var strItem = ToolUtil.valueTag($("wfname").tag,"执行项目");
        var prname = "单据编号,workflow,startnode,节点,MasterUnit";
        var prval  = mband.Val("单据编号")+","+$("wfname").innerText+","+ToolUtil.valueTag($("wfname").tag,"节点")
        +","+ToolUtil.valueTag($("wfname").tag,"节点")+","+$U().UnitName;
        usGetTopFrame().IOpenItemURL(strItem,prname,prval);
      }
      function ue_editbill()
      {
        GridUtil.usOnCellRFocusHandle();
        if(mband.Val("编号")==""){alert("请指定要编辑的办件!");return;}
        var strItem = mband.Val("启动项目");
        var prname = "编号,单据编号,workflow,startnode,节点,经办人,MasterUnit";
        var prval  = mband.Val("编号")+","+mband.Val("编号")+","+mband.Val("审批事项")+",,"+mband.Val("节点")+","+mband.Val("经办人")+","+$U().UnitName;
        usGetTopFrame().IOpenItemURL(strItem,prname,prval);
      }      
      function ws_returnitem(submitcase)
      {
        GridUtil.usOnCellRFocusHandle();
        switch(submitcase)
        {
            case 0:
            case "0":
                DlgNodes('winnodes','dvnodes','提交节点选择',"gonodes");
                break;
            case 1:
            case "1":
                if(mband.Val("编号").length<4) return;
                DlgNodes('winnodes','dvnodes','回退节点选择','bknodes');
                break;
        }
      }
    function DlgNodes(winid,gridname,title,ItemName)
    {

        if(!winid) winid="1";
        var owin = dwobj(winid);
        var oband = $band(ItemName);
        var xmldoc=mband.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "workflow",mband.Val("审批事项"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "节点",mband.Val("节点"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "单据编号",mband.Val("编号"), "s", "P", "", "Ts","");
        oband.XQuery();
        
        if(oband.RecordCount()==0){alert("没有可提交的节点!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>友情提示：</legend>'
        +'<p>请在上述列表中单击你要提交的下一个审批环节，进行提交！</p></fieldset>';
        DlgWin(winid,gridname,title,ItemName,str,500,300)
        oband.gridtype = 1;  oband.freecols = "名称"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
    }      
    function ue_submit()
    {
        //由对话框取出目的节点,其它等同于ue_save()
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "目的节点", $band("gonodes").Val("名称"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "下一节点", $band("gonodes").Val("下一节点"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("编号"),"string", "S", null,"D");
        ShowHide("winnodes","none");
        if($band("gonodes").Val("不分发")!="true" && $band("gonodes").Val("下一节点")!="结束") 
            DlgJbrs('winjbs','dvjbs','经办人选择','jbr');
        else {
            ToolUtil.setParamValue(xmldoc, "审批事项", mband.Val("审批事项"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "项目名称", mband.Val("项目名称"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", $band("gonodes").Val("名称"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "节点", mband.Val("节点"), "s", "P", "", "Ts","");
            ue_cmd("submititem","nav",true);
        };
    }    
    function ue_return()
    {
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("bknodes").Val("名称");
        if(destnode==""){alert("请指定要退回的节点!");return;}
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("单据编号"),"string", "S", null,"D");
        ToolUtil.setParamValue(xmldoc, "审批事项", mband.Val("审批事项"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "项目名称", mband.Val("项目名称"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "destnode", $band("bknodes").Val("名称"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "节点", mband.Val("节点"), "s", "P", "", "Ts","");
        ShowHide("winnodes","none");
        ue_cmd("returnitem","nav",true);
    }       
    function _submit()
    {
        if(ue_save("")){
            var xmldoc=mband.UnitItem.ParamXmldoc;
            ToolUtil.setParamValue($("xmlparam").XMLDocument, "编号", mband.Val("编号"),"string", "S", null,"D");
            ToolUtil.setParamValue(xmldoc, "审批事项", mband.Val("审批事项"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "项目名称", mband.Val("项目名称"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", $band("gonodes").Val("名称"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "节点", mband.Val("节点"), "s", "P", "", "Ts","");
            ue_cmd("submititem","nav",true);
            ShowHide("winjbs","none");
        }
    }
    function DlgJbrs(winid,gridname,title,ItemName)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        
        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>友情提示：</legend>'
        +'<p  style="margin:5px;text-align:left">　请在上述列表中指定一个或多个经办者，如果未指定经办者，则下列表格中所有人都可办理该项工作！</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'【<a href="#" class="linkbtn_0" onclick=_submit();>提交</a>】【<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>关闭</a>】</p>';
        DlgWin(winid,gridname,title,ItemName,str,500,300);
        var oband = $band(ItemName);
        oband.gridtype = 1;  oband.freecols = "姓名"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        oband.XQuery();
    }       
