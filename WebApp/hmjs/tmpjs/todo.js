		initsysparams();
		window.onload=WinLoadUtil.MDTPLoad;
		var oUnitItem;		
		var strPram="";		
		var items="������Ŀѡַ�����,�����õؿ�滮���������,�滮�������,�����õع滮���֤,���蹤�̹滮���֤,"
		        +"������Ŀ�������չ滮ȷ����,���س���ǰ�ڹ��������������չ滮ѡַ�����,�������������壩��������ת���ù滮�����,"
		        +"���������ϸ������滮�����";
		        
        function BuildParamParent(rowIndex)
        {
            var pband = getpband();
            var xmldoc = pband.UnitItem.ParamXmldoc;
            var ifstart = ToolUtil.getParamValue(xmldoc,"���","P","","Ts");
            _tokf    = ToolUtil.getParamValue(xmldoc,"tokf","P","","Ts");
            _toitem  = ToolUtil.getParamValue(xmldoc,"toitem","P","","Ts");
            _chktype = ToolUtil.getParamValue(xmldoc,"chktype","P","","Ts");
            
            var xmldoc = document.UnitItem.ParamXmldoc;
            ToolUtil.setParamValue(xmldoc, "tokf", _tokf, "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "toitem", _toitem, "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "chktype", _chktype, "s", "P", "", "Ts","");
            
            if(ifstart=="1") return;
	        if(pband.RecordCount()<1)    return;
	        if(null==rowIndex)
		        rowIndex=pband.XmlLandData.recordset.AbsolutePosition-1;
	        var rootData=pband.XmlLandData.XMLDocument.documentElement;
	        if(null==rowIndex || rowIndex>=rootData.childNodes.length || rowIndex<0)
		        return;
	        var xmlRowData=rootData.childNodes[rowIndex];
	        var colList=pband.XmlSchema.XMLDocument.selectNodes("//xs:element");
	        var xmldoc = document.UnitItem.ParamXmldoc;
	        for(var i=0;i<colList.length;i++)
	        {
		        var colName=colList[i].getAttribute("name");
		        var dbType=colList[i].getAttribute("type");
		        var xmlNodeFld=xmlRowData.selectSingleNode(colName);
		        if(!xmlNodeFld || xmlNodeFld.text.length>70 || xmlNodeFld.text.indexOf("\n","")>0) continue;
		        var value=(null==xmlNodeFld)?"":xmlNodeFld.text;
                ToolUtil.setParamValue(xmldoc, colName, value, "s", "P", "", "Ts","");
            }
        }		        
        
        
		function initWin()
		{
		    BuildParamParent();
		    oUnitItem = document.UnitItem;
            var oband=document.UnitItem.getBandByItemName("edit");
            oband.Query();
            var toitem = oband.getFldStrValue("��������");
            if(oband.RecordCount()==0)
            {
		        var xmldoc=document.UnitItem.ParamXmldoc;
		        toitem = ToolUtil.getParamValue(xmldoc,"toitem","P","","Ts");
		    }
		    document.UnitItem.getBandByItemName("attach").Query();
            var sband=document.UnitItem.getBandByItemName("����׼��");	
            sband.Query();	    
		    switch(toitem)
		    {
		        case "������Ŀѡַ�����":
		            t3.innerText="��ѡλ��";
                    //��ѡ�õ���λ�����������������õ�������⽨���ģ��������Ŀ����		            
		            dvsp.innerHTML="����<span style=\"width:160px\">��ѡ�õ���λ(��������)��</span>"
		                            +"<input dataFld=\"��λ\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:160px\">�õ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"����<span style=\"width:160px\">�⽨���ģ��</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:160px\">������Ŀ���ݣ�</span>"
		                            +"<input dataFld=\"������Ŀ����\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "�����õؿ�滮���������":
                    //������Χ���������������ؿ�������ܽ��������������״��ʹ�����ʣ��ݻ��ʣ������ܶȣ�%�����̵���		        
		            t3.innerText="�����ַ";
		            dvsp.innerHTML="����<span style=\"width:120px\">������Χ(��������)��</span>"
		                            +"<input dataFld=\"��λ\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�ؿ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"����<span style=\"width:120px\">�ܽ��������</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">������״��</span>"
		                            +"<input dataFld=\"������״\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:120px\">ʹ�����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�ݻ��ʣ�</span>"
		                            +"<input dataFld=\"�ݻ���\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:120px\">�����ܶȣ�%����</span>"
		                            +"<input dataFld=\"�����ܶ�\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�̵��ʣ�</span>"
		                            +"<input dataFld=\"�̵���\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "�滮�������":
		        //������Χ���������������滮���õ��������������������ܶȣ��ݻ��ʣ��̵��ʣ�
		            t3.innerText="�����ַ";
		            dvsp.innerHTML="����<span style=\"width:120px\">������Χ(��������)��</span>"
		                            +"<input dataFld=\"��λ\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�滮���õ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"����<span style=\"width:120px\">���������</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�����ܶȣ�%����</span>"
		                            +"<input dataFld=\"�����ܶ�\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:120px\">�ݻ��ʣ�</span>"
		                            +"<input dataFld=\"�ݻ���\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�̵��ʣ�</span>"
		                            +"<input dataFld=\"�̵���\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "�����õع滮���֤":
		            t1.innerText="�õ���Ŀ����";
		            t2.innerText="�õص�λ";
		            t3.innerText="�õ�λ��";
		            dvsp.innerHTML="����<span style=\"width:60px\">�õ����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:60px\">�õ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"����<span style=\"width:60px\">�����ģ��</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "���蹤�̹滮���֤":
		            t3.innerText="����λ��";
		            dvsp.innerHTML="����<span style=\"width:60px\">�õ����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:60px\">�����ģ��</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "������Ŀ�������չ滮ȷ����":
		            t3.innerText="�����ַ";
		            //������=�õ������ʵ�����=�����ģ
		            dvsp.innerHTML="����<span style=\"width:60px\">��������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:60px\">ʵ�������</span>"
		                            +"<input dataFld=\"�����ģ\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "���س���ǰ�ڹ��������������չ滮ѡַ�����":
		            //�õ����ʣ��õ������������Χ������������
		            
		            dvsp.innerHTML="����<span style=\"width:120px\">������Χ(��������)��</span>"
		                            +"<input dataFld=\"��λ\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"����<span style=\"width:120px\">�õ����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"����<span style=\"width:120px\">�õ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "�������������壩��������ת���ù滮�����":
                    //���뵥λ��������Ŀ���õ����ʣ��õ����		
		            t1.innerText="������Ŀ";
		            t2.innerText="���뵥λ";
		            dvsp.innerHTML="����<span style=\"width:60px\">�õ����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"����<span style=\"width:60px\">�õ������</span>"
		                            +"<input dataFld=\"�õ����\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "���������ϸ������滮�����":
                    //���赥λ��������Ŀ���õ����ʣ�ԭ��������������		        
		            t1.innerText="������Ŀ";
		            t2.innerText="���赥λ";
		            dvsp.innerHTML="����<span style=\"width:80px\">�õ����ʣ�</span>"
		                            +"<input dataFld=\"ʹ������\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"����<span style=\"width:80px\">ԭ�����</span>"
		                            +"<input dataFld=\"ԭ���\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"����<span style=\"width:80px\">�����������</span>"
		                            +"<input dataFld=\"���������\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        default:
		            return;
		    }
            oband.AfterNewRecord=function()
            {
                var toitem = oband.getFldStrValue("��������");
                var sband=document.UnitItem.getBandByItemName("����׼��");
                if(toitem=="" || sband.RecordCount()>1) return;
                var drc = "execute dbo.select_material '"+ toitem +"','�滮����';table";
                var xmlhttp = QueryDict(drc).responseXML;
                var texts = xmlhttp.selectNodes("//table//" + "���");
                var vals  = xmlhttp.selectNodes("//table//" + "����");
                for(var i=0;i<texts.length;i++)
                {
                    sband.NewRecord();
                    sband.setFldStrValue(null,"���",texts[i].text);
                    sband.setFldStrValue(null,"����",vals[i].text);
                }
            } 		    
		}
		//newʱΪ�ֶθ�ֵ
		function _getitem()
		{
		    oUnitItem = document.UnitItem;
		    var xmldoc=document.UnitItem.ParamXmldoc;
		    return ToolUtil.getParamValue(xmldoc,"toitem","P","","Ts");
		}
		function _getkf()
		{
		    oUnitItem = document.UnitItem;
		    var xmldoc=document.UnitItem.ParamXmldoc;
		    return ToolUtil.getParamValue(xmldoc,"tokf","P","","Ts");
		}
		function _gettype()
		{
		    oUnitItem = document.UnitItem;
		    var xmldoc=document.UnitItem.ParamXmldoc;
		    var _x=ToolUtil.getParamValue(xmldoc,"chktype","P","","Ts");
		    if(_x=="true") lbim.style.color="red";
		    return _x;
		}		
		function _save()
		{
		    var ob=document.UnitItem.getBandByItemName("edit");
		    var obd=document.UnitItem.getBandByItemName("opinion");
		    if(obd.IsModify())
		        ob.setFldStrValue(null,"��������",ob.getFldStrValue("��������"))
			ws_save("edit","���ݱ��","������������",null,null);
		}
		function _submit(bcase)
		{
		    var oband=document.UnitItem.getBandByItemName("edit");
			var destnode = ws_opensubmit(bcase,oband,0);
			if(!destnode) return;
			ws_save("edit","���ݱ��","������������","",destnode,"�ύ�ɹ���");
			window.close();
		}
				
		function secBoard(tablename,menutab,n) {
			var otable = document.getElementById(tablename);
			var menutable = document.getElementById(menutab);
			if(!otable.tBodies[n]) return;
		    for(i=0;i<menutable.cells.length;i++)
		    {
		    	if(menutable.cells[i].className!="secx")
		    	menutable.cells[i].className="sec1";
		    }
		    menutable.cells[n].className="sec2";
		    for(i=0;i<otable.tBodies.length;i++)
		      otable.tBodies[i].style.display="none";
		    otable.tBodies[n].style.display="block";
		}
		
		function ms_showBoard(tablename,n) {
			var otable = document.getElementById(tablename);
			if(!otable) return;
			if(!otable.tBodies[n]) return;
		    for(i=0;i<otable.tBodies.length;i++)
		      otable.tBodies[i].style.display="none";
		    otable.tBodies[n].style.display="block";
		}

      function _input(txt)
      {
		if(document.getElementById("txtopion"))
		{
		    document.getElementById("txtopion").focus();
		    document.getElementById("txtopion").innerText = document.getElementById("txtopion").innerText + txt;
		}
      }
    function _update(field)
    {
	    var srcEle=event.srcElement;
	    if(!srcEle) return;
	    oband=document.UnitItem.getBandByItemName("opinion");
	    oband.setFldStrValue(null,field,srcEle.value)
    }		

    function _upload()
    {
        GridUtil.usOnCellRFocusHandle();
        var band=document.UnitItem.getBandByItemName('attach'); 
        if('new'==band.getStateRecord()) 
        {
             var result = confirm("����δ����,���ڱ�����?");
             if(!result) return;
             _save();
        };
        band.setModalContent('�ϴ�');
    }
    function _prn()
    {
        var oband=document.UnitItem.getBandByItemName("edit");
        var xmldoc=document.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "����", oband.getFldStrValue("��������"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "���", oband.getFldStrValue("���ݱ��"), "s", "P", "", "Ts","");
        if(oband.getFldStrValue("���ݱ��")=="1"){alert("���ȱ��������ٴ�ӡ��");return;}
        ue_report("print");
    }