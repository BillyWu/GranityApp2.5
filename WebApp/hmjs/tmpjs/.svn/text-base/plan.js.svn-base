// 生产计划专用
		var currentMoveObj = null;        //当前拖动对象
		var relLeft;        //鼠标按下位置相对对象位置
		var relTop;
		var zindex=-1;//控制被拖动对象的z-index值
		window.onload=WinLoadUtil.MDTPLoad;
		var oUnitItem;		
		var strPram="";		

		function initWin()
		{
		    oUnitItem = document.UnitItem;
		    var oband=document.UnitItem.getBandByItemName("goods");
			    oband.AfterCellEditChanged=function()
			    {
			    	var xmlRows=oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			        if(xmlRows.length>0)
			           	document.getElementById("tdreauire").innerText="所选物品用料清单";
			        else
			        	document.getElementById("tdreauire").innerText="总用料清单";
			    }		    
		    var obandPZ=document.UnitItem.getBandByItemName("xmldetail");
			    obandPZ.AfterCellEditChanged=function()
			    {
			    	var xmlRows=obandPZ.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			        if(xmlRows.length>0)
			           	document.getElementById("tdreauire").innerText="所选配置用料清单";
			        else
			        	document.getElementById("tdreauire").innerText="总用料清单";
			    }		    
		    _setProduceType()
	        var xmlhttp = oband.querydict();
	        var xmldict = xmlhttp.responseXML.xml;
	        oband.XmlDict.XMLDocument.loadXML(xmldict);	  		
	        remove_loading();
		}
		
		function _query(itemname)
		{
			var xmldoc=document.UnitItem.ParamXmldoc;
		    if(document.getElementById("tdreauire").innerText=="所选配置用料清单")
		    {
		        var oband=document.UnitItem.getBandByItemName("xmldetail");
                ToolUtil.setParamValue(xmldoc, "xtable", "produce_goods_detail", "s", "P", "", "Ts","");		        
		    }
		    else
		    {
		        var oband=document.UnitItem.getBandByItemName("goods");    
                ToolUtil.setParamValue(xmldoc, "xtable", "produce_goods", "s", "P", "", "Ts","");		        		        
		    }
			var xmlRows=oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
			var idgroup="";
			for(var i=0;i<xmlRows.length;i++)
			{
				var xmlNode=xmlRows[i].selectSingleNode("ID");
				idgroup = idgroup + ",'"+xmlNode.text+"'";
			}
			idgroup = idgroup.substring(1,idgroup.length);
			ToolUtil.setParamValue(xmldoc, "IDGroup", idgroup, "s", "P", "", "Ts","");	
			ms_query(itemname,"btnMR");
		}
		
		function onManualonChange(obj)
		{
			var oband=document.UnitItem.getBandByItemName("goods");
			_setProduceType();
	        var xmlhttp = oband.querydict();
	        var xmldict = xmlhttp.responseXML.xml;
	        oband.XmlDict.XMLDocument.loadXML(xmldict);
		}
		
		
		function _setProduceType()
		{
	        var xmldoc=document.UnitItem.ParamXmldoc;
	        var sltype = document.getElementById("sltype").value;
	        ToolUtil.setParamValue(xmldoc, "产品类别", sltype, "s", "P", "", "Ts","");
		}
		function _save()
		{
			ws_save("edit","单据编号","生产计划",null,null);
		}		

		function _submit(bcase)
		{
		    var oband=document.UnitItem.getBandByItemName("edit");
			var destnode = ws_opensubmit(bcase,oband,0);
			if(!destnode) return;
			
			ws_save("edit","单据编号","生产计划","",destnode,"提交成功！");
			window.close();
		}
		
		function Tree_onNodeSelectionChange(node)
		{
			if(node.ParentTreeView.Tree.Band.ItemName=="bom")
			{
			    if(document.locktree==1) return;
			    else
			        if(typeof(tree_nodechange)=="function")	tree_nodechange(node);
			    node.set_showCheckBox();
			}
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

	function toOrder(srcItem,otype)
	{
		var oband=getband(srcItem);
		var xmlRows=oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
		switch(otype)
		{
			case "领料单":
	            var msg="您将根据用料清单自动生成生产领料单吗？";
	            var xmldoc=document.UnitItem.ParamXmldoc;
	            ToolUtil.setParamValue(xmldoc, "newworkflow", otype, "s", "P", "", "Ts","");
	            if(xmlRows.length>0) 
	            {
	                msg="您确定依据所选择的货品制作生产领料单吗？";
 	                var result = confirm(msg);
	                if(!result) return;
	            }
	            else
	            {
	                msg="您未选择任何物料，是否全选并制作生产领料单吗？";
 	                var result = confirm(msg);
	                if(!result) return;        
	                for(var i=0;i<oband.RecordCount();i++)
	                {
	                    oband.setFldStrValue(i,"选择",1);
	                    oband.setStateRecord("new",i,"data",true);
	                }
	            }
	            
	            //为指定的新流程经办人赋值
	            var sband=getband("选择经办人"); 
	            if(sband) sband.Query();
                var newman = window.showModalDialog("Template\\DlgGenMR.htm",sband,"dialogHeight: 100px; dialogWidth: 320px; edge: Raised; center: Yes; help: No; resizable: No ;status: No;"); 
                if(newman=="" || newman==null) return; 
	            ToolUtil.setParamValue(xmldoc, "新经办人", newman, "s", "P", "", "Ts","");
	            //
                if(document.rtn)
                {
	                msg="编号为["+document.rtn+"]已生成，继续生成新的领料单？";
 	                var result = confirm(msg);
	                if(!result) return;	                   
                }                
                var xmldoc=document.UnitItem.ParamXmldoc;
	            document.rtn = ws_getbh("领料单");
	            if(document.rtn=="error") {alert("编号生成错误，请检查！");return; false}        
                ToolUtil.setParamValue(xmldoc, "serialno", document.rtn, "s", "P", "", "Ts","");			            
                ToolUtil.setParamValue(xmldoc, "nworkflow","领料单", "s", "P", "", "Ts","");
                //强制给被选记录付“new”状态
                xmlRows=oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
                for(var i=0;i<xmlRows.length;i++)
                    xmlRows[i].setAttribute("state","new");
                //    oband.setStateRecord("new",i,"data",true);
	            ue_save("执行成功！");
		        break;
			case "采购单":
	            var msg="您将根据缺口数据自动生成采购单吗？";
	            if(xmlRows.length>0) 
	            {
	                msg="您确定依据所选择的货品制作采购单吗？";
 	                var result = confirm(msg);
	                if(!result) return;
	            }
	            else
	            {
	                msg="您未选择任何物料，是否全选并制作采购单吗？";
 	                var result = confirm(msg);
	                if(!result) return;               
	                for(var i=0;i<oband.RecordCount();i++)
	                    oband.setFldStrValue(i,"选择",1);
	            }
	            
                if(document.rtn)
                {
	                msg="编号为["+document.rtn+"]已生成，继续生成新的采购单？";
 	                var result = confirm(msg);
	                if(!result) return;	                   
                }
                var xmldoc=document.UnitItem.ParamXmldoc;
	            document.rtn = ws_getbh("采购单");
	            if(document.rtn=="error") {alert("编号生成错误，请检查！");return; false}        
                ToolUtil.setParamValue(xmldoc, "serialno", document.rtn, "s", "P", "", "Ts","");			            
                ToolUtil.setParamValue(xmldoc, "nworkflow","采购管理", "s", "P", "", "Ts","");
                xmlRows=oband.XmlLandData.XMLDocument.selectNodes("/*/*[@selected='-1' or @selected='1' or @selected='true' or 选择='-1' or 选择='1' or 选择='true']");
                for(var i=0;i<xmlRows.length;i++)
                    xmlRows[i].setAttribute("state","new");
                
	            ue_save("执行成功");
			    break;				
		}	    
	}
	function openinstance()
	{
		//判断当前打开的是哪个数据集，如果是配置集，则更换插入的集合band
        var sltype = document.getElementById("sltype").value;
        if(sltype=="") {alert("请选择一个产品分类！");return};
        var oband=document.UnitItem.getBandByItemName("edit");
        if(oband.getFldStrValue("单据编号").length<4) 
        {
        	if(!ws_save("edit","单据编号","生产计划",null,null,"")) return;
        }
		var oband=document.UnitItem.getBandByItemName("goods");
		var otable=document.getElementById("dstTable");
	    for(i=0;i<otable.tBodies.length;i++)
	    {
	    	if(otable.tBodies[i].style.display!="none" && i==2)
	    	{
	    		oband=document.UnitItem.getBandByItemName("xmldetail");break;
	    	}
	    }
		oband.CheckInBand=true;
		oband.setModalContent("instance");
	}

    function _setchktype()
    {
        var ctrlsrc=event.srcElement;
        if(ctrlsrc.tagName=="LABLE") return;
        document.copytype = ctrlsrc.value;
    }
    //读取框
    var t_id = setInterval(animate,20);
    var pos=0;
    var dir=20;
    var len=0;

    function animate()
    {
        var elem = document.getElementById("progress");
        if(elem != null) {
            if (pos==0) len += dir;
            if (len>100 || pos>210) pos += dir;
            if (pos>210) len -= dir;
            if (pos>210 && len==0) pos=0;
            elem.style.left = pos;
            elem.style.width = len;
        }
    }
    function remove_loading() 
    {
        this.clearInterval(t_id);
        var targelem = document.getElementById("loader_container");
        targelem.style.display="none";
        targelem.style.visibility="hidden";
    }			    
