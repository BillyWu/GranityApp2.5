    window.onload=WinLoadUtil.MDTPLoad;
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
        var strnode = '<div style="float:left;width:154px;"><div style="background:url(images/hmbn.png) left top no-repeat;" class="btnbox" onclick="" onmousemove="this.style.backgroundPosition=\'left bottom\';" onmouseout="this.style.backgroundPosition=\'left top\';" >'
        +'<div class="digg_act">';
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
    var sSearchKey = "��Ʒ��ѯ...";
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
        if($band("gonodes").Val("���ַ�")!="true" && $band("gonodes").Val("��һ�ڵ�")!="����") 
            DlgJbrs('winjbs','dvjbs','������ѡ��','jbr');
        else{
            if(ue_save("�ύ�ɹ�!"))
            goback();
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
        if(ue_save("���˳ɹ�!"))goback()
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
        oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        center(winid);
    }       
    function goback()
    {
        window.history.back();
    }

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
    function showchart()
    {
        var title="�ͻ����ͷֲ�ͳ��";
        var vname="����";
        var chartstyle="bar";
        var sql="exec chart_�ͻ����ͷֲ�ͳ��";
        DlgChart("winchart",sql,chartstyle,vname,title);
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
    }
    function _selectgoods()
    {
        DlgSelectGoods("wingoods","dvgoods","��Ʒ���ϲ�ѯ","slgoods");
    }
    function tm_selectgoods(title,srcitem,mitem,destitem,w,h,spos)
    {
        if($band(mitem).RecordCount()==0){alert("����дժҪ��Ϣ!");return};
        var str = strfind("wingoods","dvgoods", srcitem, destitem,null,mitem,spos);
        DlgWin("wingoods","dvgoods",title,srcitem,str,w,h)
        var oband = $band(srcitem);
        oband.gridtype = 13;  oband.freecols = "���";        oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid("dvgoods",oband,"in",true,1,1);
        if("function"==typeof(ts_filter))
            ts_filter();
        else oband.XQuery();
        $band(srcitem).AfterRowChanged=function()
        {
            if(!this.Grid) return;
            this.Grid.extitle(this.Val("�������"));
        }        
    }
    function strfind(winid, gridname, srcitem, destitem,callback,mitem,spos)
    {
        if (!srcitem) srcitem = "";
        var storeinfo = '<td width="60" align="right">��λ:</td><td width="100">\
        <input id=\"��λ\" name=\"��λ\" datasourceid="exec FD_��λ null" datatextfield="name" datavaluefield="name" filter=\"and\" \
        class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"><input title="Ҫѡ���𣬵���һ��..." class="txtbtn" type=button value="..." \
        style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/></td>';
        if(srcitem!="slstoregoods" || (spos && $band(mitem).Val(spos)!="")) storeinfo="";
        oklocate.callback = callback;
        var s= '<fieldset style="padding: 5px;;width:99%"><legend>��ѯ��</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        + storeinfo
        +'        <td width="60" align="right">���:</td><td width="100">'
        +'        <input id=\"���\" name=\"���;��Ʒ���\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
        +'        <td width="60" align="right">��ɫ:</td><td width="80">'
        +'        <INPUT name="dbo.fun_getPY(��ɫ����);��ɫ����;dbo.fun_getPY(���);���" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        + '        <td width="60" align="center"><img border="0" style="cursor:hand" src="Images/tb16.gif" onclick=ue_tfilter("' + srcitem + '") onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
        + '        <td width="90" align="center">��<a href="#" \
        onclick=oklocate("' + winid + '","' + gridname + '","' + srcitem + '","' + (!destitem ? "" : destitem) + '","�޴˲�Ʒ��")>ȷ��</a>��</td>'   
        +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:99%;height:99%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="˫��ѡ��..." size="13" onblur="_onblurbox(this)" name="D1" \
        datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300;\
         position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
        return s+s1+s2;
    }
    function oklocate(winid, gridname, srcitem, destitem, hint, keywords)
    {
        var ob = $band(srcitem);
        ob.IsImport="1";
        $band(destitem).exportItem=srcitem;
        document.importItem = destitem || "detail";
        $loading();
        $U().CheckInSelfParentUnit("import");
        if ("function" == typeof (oklocate.callback))
            oklocate.callback();
        ShowHide(winid,"none");
        $loading("none");
    }
    