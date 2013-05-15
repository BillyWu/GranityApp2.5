		initsysparams();
		window.onload=WinLoadUtil.MDTPLoad;
		var oUnitItem;		
		var strPram="";		
		var items="建设项目选址意见书,待出让地块规划设计条件书,规划方案审核,建设用地规划许可证,建设工程规划许可证,"
		        +"建设项目竣工验收规划确认书,土地出让前期国土部门土地征收规划选址意见函,行政划拨（集体）存量土地转出让规划意见函,"
		        +"存量土地上改扩建规划意见函";
		        
        function BuildParamParent(rowIndex)
        {
            var pband = getpband();
            var xmldoc = pband.UnitItem.ParamXmldoc;
            var ifstart = ToolUtil.getParamValue(xmldoc,"起草","P","","Ts");
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
            var toitem = oband.getFldStrValue("事项类型");
            if(oband.RecordCount()==0)
            {
		        var xmldoc=document.UnitItem.ParamXmldoc;
		        toitem = ToolUtil.getParamValue(xmldoc,"toitem","P","","Ts");
		    }
		    document.UnitItem.getBandByItemName("attach").Query();
            var sband=document.UnitItem.getBandByItemName("材料准备");	
            sband.Query();	    
		    switch(toitem)
		    {
		        case "建设项目选址意见书":
		            t3.innerText="拟选位置";
                    //拟选用地区位（东南西北）；拟用地面积；拟建设规模；建设项目依据		            
		            dvsp.innerHTML="　　<span style=\"width:160px\">拟选用地区位(东南西北)：</span>"
		                            +"<input dataFld=\"区位\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:160px\">用地面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"　　<span style=\"width:160px\">拟建设规模：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:160px\">建设项目依据：</span>"
		                            +"<input dataFld=\"建设项目依据\" class=\"xlandinput\" style=\"WIDTH: 500px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "待出让地块规划设计条件书":
                    //四至范围（东南西北）；地块面积；总建筑面积；土地现状；使用性质；容积率；建筑密度（%）；绿地率		        
		            t3.innerText="建设地址";
		            dvsp.innerHTML="　　<span style=\"width:120px\">四至范围(东南西北)：</span>"
		                            +"<input dataFld=\"区位\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">地块面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">总建筑面积：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">土地现状：</span>"
		                            +"<input dataFld=\"土地现状\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">使用性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">容积率：</span>"
		                            +"<input dataFld=\"容积率\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">建筑密度（%）：</span>"
		                            +"<input dataFld=\"建筑密度\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">绿地率：</span>"
		                            +"<input dataFld=\"绿地率\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "规划方案审核":
		        //四至范围（东南西北）；规划总用地面积；建筑面积；建筑密度；容积率；绿地率；
		            t3.innerText="建设地址";
		            dvsp.innerHTML="　　<span style=\"width:120px\">四至范围(东南西北)：</span>"
		                            +"<input dataFld=\"区位\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">规划总用地面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">建筑面积：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">建筑密度（%）：</span>"
		                            +"<input dataFld=\"建筑密度\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">容积率：</span>"
		                            +"<input dataFld=\"容积率\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">绿地率：</span>"
		                            +"<input dataFld=\"绿地率\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "建设用地规划许可证":
		            t1.innerText="用地项目名称";
		            t2.innerText="用地单位";
		            t3.innerText="用地位置";
		            dvsp.innerHTML="　　<span style=\"width:60px\">用地性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:60px\">用地面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"　　<span style=\"width:60px\">建设规模：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "建设工程规划许可证":
		            t3.innerText="建设位置";
		            dvsp.innerHTML="　　<span style=\"width:60px\">用地性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:60px\">建设规模：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "建设项目竣工验收规划确认书":
		            t3.innerText="建设地址";
		            //许可面积=用地面积；实测面积=建设规模
		            dvsp.innerHTML="　　<span style=\"width:60px\">许可面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:60px\">实测面积：</span>"
		                            +"<input dataFld=\"建设规模\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "土地出让前期国土部门土地征收规划选址意见函":
		            //用地性质；用地面积；四至范围（东南西北）
		            
		            dvsp.innerHTML="　　<span style=\"width:120px\">四至范围(东南西北)：</span>"
		                            +"<input dataFld=\"区位\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"　　<span style=\"width:120px\">用地性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"<br />"
                                    +"　　<span style=\"width:120px\">用地面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 200px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "行政划拨（集体）存量土地转出让规划意见函":
                    //申请单位；申请项目；用地性质；用地面积		
		            t1.innerText="申请项目";
		            t2.innerText="申请单位";
		            dvsp.innerHTML="　　<span style=\"width:60px\">用地性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"　　<span style=\"width:60px\">用地面积：</span>"
		                            +"<input dataFld=\"用地面积\" class=\"xlandinput\" style=\"WIDTH: 280px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        case "存量土地上改扩建规划意见函":
                    //建设单位；建设项目；用地性质；原面积；改扩后面积		        
		            t1.innerText="建设项目";
		            t2.innerText="建设单位";
		            dvsp.innerHTML="　　<span style=\"width:80px\">用地性质：</span>"
		                            +"<input dataFld=\"使用性质\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />"		                            
                                    +"　　<span style=\"width:80px\">原面积：</span>"
		                            +"<input dataFld=\"原面积\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />"
                                    +"<br />"
                                    +"　　<span style=\"width:80px\">改扩后面积：</span>"
		                            +"<input dataFld=\"改扩后面积\" class=\"xlandinput\" style=\"WIDTH: 260px;\" dataSrc=\"#MasterTab\" size=\"15\" />";
		            break;
		        default:
		            return;
		    }
            oband.AfterNewRecord=function()
            {
                var toitem = oband.getFldStrValue("事项类型");
                var sband=document.UnitItem.getBandByItemName("材料准备");
                if(toitem=="" || sband.RecordCount()>1) return;
                var drc = "execute dbo.select_material '"+ toitem +"','规划编审处';table";
                var xmlhttp = QueryDict(drc).responseXML;
                var texts = xmlhttp.selectNodes("//table//" + "编号");
                var vals  = xmlhttp.selectNodes("//table//" + "名称");
                for(var i=0;i<texts.length;i++)
                {
                    sband.NewRecord();
                    sband.setFldStrValue(null,"编号",texts[i].text);
                    sband.setFldStrValue(null,"名称",vals[i].text);
                }
            } 		    
		}
		//new时为字段赋值
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
		        ob.setFldStrValue(null,"审批事项",ob.getFldStrValue("审批事项"))
			ws_save("edit","单据编号","开发区审批表",null,null);
		}
		function _submit(bcase)
		{
		    var oband=document.UnitItem.getBandByItemName("edit");
			var destnode = ws_opensubmit(bcase,oband,0);
			if(!destnode) return;
			ws_save("edit","单据编号","开发区审批表","",destnode,"提交成功！");
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
             var result = confirm("数据未保存,现在保存吗?");
             if(!result) return;
             _save();
        };
        band.setModalContent('上传');
    }
    function _prn()
    {
        var oband=document.UnitItem.getBandByItemName("edit");
        var xmldoc=document.UnitItem.ParamXmldoc;
        ToolUtil.setParamValue(xmldoc, "事项", oband.getFldStrValue("事项类型"), "s", "P", "", "Ts","");
        ToolUtil.setParamValue(xmldoc, "编号", oband.getFldStrValue("单据编号"), "s", "P", "", "Ts","");
        if(oband.getFldStrValue("单据编号")=="1"){alert("请先保存数据再打印！");return;}
        ue_report("print");
    }