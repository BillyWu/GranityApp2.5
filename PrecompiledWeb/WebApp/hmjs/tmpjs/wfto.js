      var mband;
      var elems2 = [];
      var elemsevent2 = [];
      var titles=[];
      function initWin()
      {
        mband = $band("nav");if(!mband){alert("��Ŀ����nav�����ô���");return;}
        $loading();
        mband.Asyn=true;
        mband.hasGrid=true;
        mband.XQuery();
        mband.AfterXQuery = function()
        {
            this.gridtype = 20; this.freecols = "��Ŀ����";this.minwidth = "60px";this.noxml=true;
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
                    var wf = items[i].selectSingleNode("����").text;
                    elems2.push(wf);
                    var o = items[i].selectSingleNode("tag");
                    if(!o) continue;
                    var strItem = ToolUtil.valueTag(o.text,"ִ����Ŀ");
                    var prname = "���ݱ��,workflow,startnode,�ڵ�,MasterUnit";
                    var prval  = mband.Val("���ݱ��")+","+wf+","+ToolUtil.valueTag(o.text,"�ڵ�")
                    +","+ToolUtil.valueTag(o.text,"�ڵ�")+","+$U().UnitName;
                    var itemevent = "usGetTopFrame().IOpenItemURL('"+strItem+"','"+prname+"','"+prval+"')";
                    elemsevent2.push(itemevent);
                    titles.push((!items[i].selectSingleNode("˵��"))?"":items[i].selectSingleNode("˵��").text);
                }
                ueLabel("tbdiv",elems2,elemsevent2,null,null,titles,true);
                if($("tbdiv").innerHTML!="")
                $("tbdiv").innerHTML='<img border="0" src="Images//NewRecordHS.gif" style="vertical-align:middle" vspace=0 hspace=3 />'+$("tbdiv").innerHTML;
            }
        }
      }      
      function ue_addbill()
      {
        if($("wfname").innerText==""){alert("��ָ��Ҫ��ݵĹ���������!");return;}
        var str = "�������һ���µġ�"+$("wfname").innerText+"�������ȷ����";if(!confirm(str)) return;
        //ȡtagֵ:"@�ڵ�=���,@ִ����Ŀ=��Ʒ���̵�,@������Ŀ=��Ʒ���̵㵥,@Ȩ��="    html/html/  //prname,prvalΪǿ����������Ԫת��Ĳ������Թ��´򿪵ĵ�Ԫ��ʼ��ʱ��ϵͳ����һ��ʹ��
        var strItem = ToolUtil.valueTag($("wfname").tag,"ִ����Ŀ");
        var prname = "���ݱ��,workflow,startnode,�ڵ�,MasterUnit";
        var prval  = mband.Val("���ݱ��")+","+$("wfname").innerText+","+ToolUtil.valueTag($("wfname").tag,"�ڵ�")
        +","+ToolUtil.valueTag($("wfname").tag,"�ڵ�")+","+$U().UnitName;
        usGetTopFrame().IOpenItemURL(strItem,prname,prval);
      }
      function ue_editbill()
      {
        GridUtil.usOnCellRFocusHandle();
        if(mband.Val("���")==""){alert("��ָ��Ҫ�༭�İ��!");return;}
        var strItem = mband.Val("������Ŀ");
        var prname = "���,���ݱ��,workflow,startnode,�ڵ�,������,MasterUnit";
        var prval  = mband.Val("���")+","+mband.Val("���")+","+mband.Val("��������")+",,"+mband.Val("�ڵ�")+","+mband.Val("������")+","+$U().UnitName;
        usGetTopFrame().IOpenItemURL(strItem,prname,prval);
      }      
      function ws_returnitem(submitcase)
      {
        GridUtil.usOnCellRFocusHandle();
        switch(submitcase)
        {
            case 0:
            case "0":
                DlgNodes('winnodes','dvnodes','�ύ�ڵ�ѡ��',"gonodes");
                break;
            case 1:
            case "1":
                if(mband.Val("���").length<4) return;
                DlgNodes('winnodes','dvnodes','���˽ڵ�ѡ��','bknodes');
                break;
        }
      }
    function DlgNodes(winid,gridname,title,ItemName)
    {

        if(!winid) winid="1";
        var owin = dwobj(winid);
        var oband = $band(ItemName);
        var xmldoc=mband.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "workflow",mband.Val("��������"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "�ڵ�",mband.Val("�ڵ�"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "���ݱ��",mband.Val("���"), "s", "P", "", "Ts","");
        oband.XQuery();
        
        if(oband.RecordCount()==0){alert("û�п��ύ�Ľڵ�!");return;}            
        var str='<div style="width:98%;height:70%;" id="'+gridname+'"></div><fieldset style="padding: 15px;;width:98%"><legend>������ʾ��</legend>'
        +'<p>���������б��е�����Ҫ�ύ����һ���������ڣ������ύ��</p></fieldset>';
        DlgWin(winid,gridname,title,ItemName,str,500,300)
        oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
    }      
    function ue_submit()
    {
        //�ɶԻ���ȡ��Ŀ�Ľڵ�,������ͬ��ue_save()
        GridUtil.usOnCellRFocusHandle();
        var xmldoc=mband.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "Ŀ�Ľڵ�", $band("gonodes").Val("����"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "��һ�ڵ�", $band("gonodes").Val("��һ�ڵ�"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mband.Val("���"),"string", "S", null,"D");
        ShowHide("winnodes","none");
        if($band("gonodes").Val("���ַ�")!="true" && $band("gonodes").Val("��һ�ڵ�")!="����") 
            DlgJbrs('winjbs','dvjbs','������ѡ��','jbr');
        else {
            ToolUtil.setParamValue(xmldoc, "��������", mband.Val("��������"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "��Ŀ����", mband.Val("��Ŀ����"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", $band("gonodes").Val("����"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "�ڵ�", mband.Val("�ڵ�"), "s", "P", "", "Ts","");
            ue_cmd("submititem","nav",true);
        };
    }    
    function ue_return()
    {
        var xmldoc=mband.UnitItem.ParamXmldoc;
        var destnode = $band("bknodes").Val("����");
        if(destnode==""){alert("��ָ��Ҫ�˻صĽڵ�!");return;}
        ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mband.Val("���ݱ��"),"string", "S", null,"D");
        ToolUtil.setParamValue(xmldoc, "��������", mband.Val("��������"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "��Ŀ����", mband.Val("��Ŀ����"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "destnode", $band("bknodes").Val("����"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "�ڵ�", mband.Val("�ڵ�"), "s", "P", "", "Ts","");
        ShowHide("winnodes","none");
        ue_cmd("returnitem","nav",true);
    }       
    function _submit()
    {
        if(ue_save("")){
            var xmldoc=mband.UnitItem.ParamXmldoc;
            ToolUtil.setParamValue($("xmlparam").XMLDocument, "���", mband.Val("���"),"string", "S", null,"D");
            ToolUtil.setParamValue(xmldoc, "��������", mband.Val("��������"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "��Ŀ����", mband.Val("��Ŀ����"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", $band("gonodes").Val("����"), "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "�ڵ�", mband.Val("�ڵ�"), "s", "P", "", "Ts","");
            ue_cmd("submititem","nav",true);
            ShowHide("winjbs","none");
        }
    }
    function DlgJbrs(winid,gridname,title,ItemName)
    {
        if(!winid) winid="1";
        var owin = dwobj(winid);
        
        var str='<fieldset style="padding: 1px;;width:98%;height:40px"><legend>������ʾ��</legend>'
        +'<p  style="margin:5px;text-align:left">�����������б���ָ��һ�����������ߣ����δָ�������ߣ������б���������˶��ɰ���������</p></fieldset>'
        +'<div style="width:98%;height:80%;" id="'+gridname+'"></div><p style="margin:15px;width:98%;text-align:right">'
        +'��<a href="#" class="linkbtn_0" onclick=_submit();>�ύ</a>����<a href="#" class="linkbtn_0" onclick=ShowHide("'+winid+'","none");>�ر�</a>��</p>';
        DlgWin(winid,gridname,title,ItemName,str,500,300);
        var oband = $band(ItemName);
        oband.gridtype = 1;  oband.freecols = "����"; oband.minwidth = "120px";oband.StrongGrid=true;
        var Grid = new XGrid(gridname,oband,"in",null,1,1);
        oband.XQuery();
    }       
