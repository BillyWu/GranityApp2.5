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
        if($("ibillstatus")) $("ibillstatus").innerText= ToolUtil.getParamValue($XD(),"�ڵ�","S","","D");
    }
    function CreateFlowMonitor()
    {
        var wfband=$band("monitor");
        //wfband.XQuery;
        if(wfband==null || wfband.RecordCount()==0) {alert("��������ת��");return;}
        var strflow = "";
        var strarrow ='<div style="float:left;width:50;height:50px;"  ><img style="float:left;" border="0" src="images/arrow3.png" width="48" height="48"></div>'
        var strnode = '<div style="float:left;width:154px;"><div style="background:url(images/hmbn.png) left top no-repeat;" class="btnbox"  >'
        +'<div>';
        for(var i=0;i<wfband.RecordCount();i++)
        {
            strflow = strflow + strnode + wfband.getFldStrValue("�ڵ�",i)+"</div>"
            +"</div>"+ "<br/>("+wfband.getFldStrValue("������",i)+"��"+wfband.getFldStrValue("ʱ��",i)+")<br/><br/></div>"+strarrow;
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
    var sSearchKey = "��ѯ...";
    function ue_submit()
    {
        //�ɶԻ���ȡ��Ŀ�Ľڵ�,������ͬ��ue_save()
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("gonodes").Val("����");
        if(destnode==""){alert("��ָ��һ��Ŀ�Ľڵ�!");return;};
        mband.setFldStrValue(null,"Ŀ�Ľڵ�",destnode);
        ToolUtil.setParamValue(xmldoc, "��һ�ڵ�", $band("gonodes").Val("��һ�ڵ�"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mband.Val("���ݱ��"),"string", "S", null,"D");
        ShowHide("winnodes","none");
        if("function"==typeof(Self_Submit)){Self_Submit(destnode)}
        if($band("gonodes").Val("���ַ�")!="true" && $band("gonodes").Val("��һ�ڵ�")!="����") 
        {
            if($band("jbdept"))
                DlgJbDept('winjbs','dvjbs','����ѡ��','jbdept');
            else
                DlgJbrs('winjbs','dvjbs','������ѡ��','jbr');
        }
        else{
            var dept =  ToolUtil.getParamValue($XD(),"DeptCode","S","","D");
            mband.setFldStrValue(null,"���ղ���",dept);
            ToolUtil.setParamValue($XD(), "���ղ���", dept,"string", "P", null,"C");
            if(ue_save("�ύ�ɹ�!"))
            {
                if($("Btn�ύ")) {
                    $("Btn�ύ").disabled=true;
                    if($("Btn����")) $("Btn����").disabled=true;
                }
                if($("Btn����")) $("Btn����").fireEvent("onclick");
                goback();
            }
        }
    }
    function ue_return()
    {
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("bknodes").Val("����");
        if(destnode==""){alert("��ָ��Ҫ�˻صĽڵ�!");return;}
        mband.setFldStrValue(null,"Ŀ�Ľڵ�",destnode);
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mband.Val("���ݱ��"),"string", "S", null,"D");
        ToolUtil.setParamValue(xmldoc, "�ύ����","����", "s", "P", "", "Ts","");
        ShowHide("winnodes","none");
        if(ue_save("���˳ɹ�!"))
        {
            if($("Btn�ύ")) {
                $("Btn�ύ").disabled=true;
                if($("Btn����")) $("Btn����").disabled=true;
            }
            if($("Btn����")) $("Btn����").fireEvent("onclick");        
        }
    }    
    function _submit()
    {
        if(sband.RecordCount()==0){alert("û����ϸ����,����!");return;}
        if(ue_save("")) 
            DlgNodes('winnodes','dvnodes','�ڵ�ѡ��','gonodes');
    }
    function _return()
    {
        if(mband.Val("���ݱ��").length<4) return;
        DlgNodes('winnodes','dvnodes','���˽ڵ�ѡ��','bknodes');
    }
    function jbrsubmit()
    {
        if(ue_save("�ύ�ɹ�!"));{
            if("function"==typeof(ts_quit)){ts_quit();}
            else goback();
        }
    }
    function jbDeptsubmit()
    {
        mband.setFldStrValue(null,"���ղ���",$band("jbdept").Val("���Ŵ���"));
        if(ue_save("�ύ�ɹ�!"));{          
            if($("Btn�ύ")) 
            {
                $("Btn�ύ").disabled=true;
                if($("Btn����")) $("Btn����").disabled=true;
            }
            if($("Btn����")) $("Btn����").fireEvent("onclick");
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

        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>������ʾ��</legend>'
        +'<p  style="margin:5px;text-align:left">�����������б���ָ��һ�����������ߣ����δָ�������ߣ������б���������˶��ɰ���������</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'��<a href="#" class="linkbtn_0" onclick="jbrsubmit()";>�ύ</a>����<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>�ر�</a>��</p>';
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
        oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
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
        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>������ʾ��</legend>'
        +'<p  style="margin:5px;text-align:left">�����������б���ָ��һ�����������߲��ţ�</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'��<a href="#" class="linkbtn_0" onclick="jbDeptsubmit()";>�ύ</a>����<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>�ر�</a>��</p>';
        if(oband.RecordCount()==1) {jbDeptsubmit();return;};
        DlgWin(winid,gridname,title,bandname,str,500,300);
        oband.gridtype = 17;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
    }       
    function DlgNodes(winid,gridname,title,bandname)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        ToolUtil.setParamValue($XD(), "���ݱ��", mband.Val("���ݱ��"),"string", "P", null,"C");
        var oband = $band(bandname);
        oband.XQuery();
        if(oband.RecordCount()==0){alert("û�п��ύ�Ľڵ�!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>������ʾ��</legend>'
        +'<p>���������б��е�����Ҫ�ύ����һ���������ڣ������ύ��</p></fieldset>';
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
        oband.gridtype = 17;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        center(winid);
    }       
    function _back(){
    window.history.back(-1);}
    
    function CreateOpionTable()
    {

        var ob=$band("opinion");
        ob.merges="@������־=������,ʱ��";
        ob.gridtype = 1;  ob.freecols = "���"; ob.minwidth = "100px";
        var Grid = new XGrid("DivID",ob,"in",null,1,1);
        ob.XQuery();
        if(ob==null || ob.RecordCount()==0) {alert("Ŀǰ����Ҫ��д�������");return;}
    }
    function okopinion(s)
    {
        $band("opinion").setFldStrValue(null,"����",s);
        $band("opinion").setFldStrValue(null,"������",$S().GetUserName());
        $band("opinion").setFldStrValue(null,"ʱ��",new Date().toLocaleDateString());
        $band("opinion").setFldStrValue(null,"���",$("txtopinion").innerText);
        ShowHide("winopin","none");
    }
    function writeop()
    {
        GridUtil.usOnCellRFocusHandle();
        var spnode = ToolUtil.getParamValue($XD(),"�ڵ�","S","","D");
        if($band("opinion").Val("�ڵ�")!=spnode) return;
        var winid="winopin";
        var owin = dwobj(winid);
        var str='<fieldset style="padding: 5px;;width:98%;height:200"><legend>���������</legend>\
        <textarea id="txtopinion" style="width:100%;height:100%" ></textarea>\
        <p style="text-align:right"><IMG src="images/ok24.png" onclick=okopinion("ͬ��") style="cursor:hand" alt="ͬ��!" border="0" />&nbsp;&nbsp;<IMG src="images/road0.gif" onclick="okopinion(\'��ͬ��\')"  alt="��ͬ��!"  style="cursor:hand" border="0" />&nbsp;&nbsp;<IMG src="images/road1.gif" onclick="okopinion(\'����\')" alt="����!"  style="cursor:hand" border="0" /></p>\
        </fieldset>';
        if(!owin)
        {
            var owin = new Object;
            owin.id     = winid;
            owin.width  = 500;
            owin.height = 300;
            owin.title  = "�༭�������";
            owin.text   = str;
            var a = new xWin(owin);
        }
        else
        {
            ShowHide(winid,null);
        }       
        center(winid);
        $("txtopinion").innerText=$band("opinion").Val("���");
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
        wftitle.innerText = "�������̼�أ���"+flowname+" ("+mband.Val("���ݱ��")+")��";
    	var sql= "exec wf_show '"+flowname+"'"
    	var xmldata = ue_ajaxdom(sql);
    	var htmlstr = xmldata.selectSingleNode("//table/htmlstr").text;
    	Canvas.innerHTML = htmlstr;
    	setflow();
    }        

    function setflow(ob)
    {
        if(!ob) ob=mband;
        if(!$band("inflow")){alert("���ݲ�����!");return;}
    	$band("inflow").XQuery(true);
    	$band("monitor").XQuery(true);
    	var objs = document.getElementsByTagName("RoundRect");
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
