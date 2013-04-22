    function ps_move(_band,_idx,_msg)
    {
		if(_msg && ""!=_msg){alert(_msg);return;}
		_band.setCurrentRow(_idx);
		if(_band.Grid && _band.Grid.curTd)
		{
			var ctrl=ToolUtil.getCtrlByNameD(false,_band.Grid.curTd,"colname");
			if(ctrl) ctrl.fireEvent("onfocus");
		}	    
		if(document.getElementById("rsnum"))
	        document.getElementById("rsnum").value="第"+_band.XmlLandData.recordset.AbsolutePosition+"条";		
		
    }

    function ps_getGridBand()
    {
	    var _band;
		if(!window.band) _band = document.UnitItem.ActiveBand
		else _band = band;
		if(!_band.Grid) {alert("请选择一个表格进行操作！");return;};
		return _band;
    }
	
	function ue_mstart()
	{
	    var oband = ps_getGridBand();
	    if(!oband) return;
		if(oband.RecordCount()<1) return;	    
		if(1==oband.RecordCount())
			strMsg="";
		else
			strMsg=oband.CalXmlLand.ValidateRow((oband.RecordCount()<1)?-1:(oband.XmlLandData.recordset.AbsolutePosition-1));
		ps_move(oband,0,strMsg);
	}


	function ue_mnext()
	{
		var oband = ps_getGridBand();
		if(!oband) return;
		if(oband.RecordCount()<1) return;	    
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;	//记录行以1为基点,需要换成以0为基点
		var curindex=(index+1<oband.XmlLandData.recordset.recordCount)?(index+1):index;
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
		ps_move(oband,curindex,strMsg);
	}

	function ue_mlast()
	{
		var oband = ps_getGridBand();
		if(!oband) return;
		if(oband.RecordCount()<1) return;	    
		var curindex=oband.XmlLandData.recordset.recordCount-1;
		if(curindex!=oband.XmlLandData.recordset.AbsolutePosition-1)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
		ps_move(oband,curindex,strMsg);
	}
	
	function ue_mprev()
	{
		var oband = ps_getGridBand();
		if(!oband) return;
		if(oband.RecordCount()<1) return;	    
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;
		var curindex=(index<1)?0:(index-1);
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
		ps_move(oband,curindex,strMsg);
	}

	function ms_bandadd()
	{
	    var oband = ps_getGridBand();
	    if(!oband) return;
		/* 校验行记录*/
		if(oband.RecordCount()>0)
		    var rowIndex=oband.XmlLandData.recordset.AbsolutePosition-1;
		else
		    var rowIndex=-1;
		var strMsg=oband.CalXmlLand.ValidateRow(rowIndex);
		if(strMsg && ""!=strMsg)
		{
			alert(strMsg);return;
		}
		oband.NewRecord();
		oband.setCurrentRow(oband.XmlLandData.recordset.recordCount-1);
		if(oband.Grid)
		    oband.Grid.setFocus();
		return;
	}
	
	
	function ms_banddel()
	{
	    var oband = ps_getGridBand();
	    if(!oband) return;
		if(oband.Grid.Table.rows.length<1)
			return;
		grid=oband.Grid;
		if(!grid.curTd)
			curTd=ToolUtil.getCtrlByTagD(false,grid.Table,"TD","colname");
		else
			curTd=grid.curTd;
		var cellIndex=curTd.cellIndex;
		//找到删除后焦点的当前行
		var curTrNew=null;
		for(var i=grid.Table.rows.length-1;i>-1;i--)
		{
			var row=grid.Table.rows[i];
			if(!curTrNew && true==row.isSelected)
			{	
				if(i<grid.Table.rows.length-1)
				{
					curTrNew=grid.Table.rows[i+1];
					break;
				}
				curTrNew=row;
			}else if(curTrNew && !row.isSelected)
			{
				curTrNew=row;
				break;
			}
		}
		grid.DelRowSelected();
		if(!curTrNew)	return;
		var curTd=curTrNew.cells[cellIndex];
		grid.setActiveCell(curTd);
		grid.setFocus();
		return;
	}

    function   msgetElementsByName(obj,name){   
      var   all   =  obj.parentElement.all;   
      var   result   =   [];   
      for   (var   i=0;i<all.length;i++)   
      if   (all[i]["name"]==name)   
      result   [result.length]   =   all[i];   
      return   result;   
      }   


    function $input(band,fld)
    {
	    var oinput = $(fld);
	    if(oinput) return oinput;
        oinput = $(band.ItemName+"."+fld);
        if(!oinput)
            oinput = $(band.XmlLandData.id + "." + fld);
        else
            oinput = null;
        return oinput;
    }
    
    
    //格式化字段数据,利用格式化字段
    function trColValue(band,colitem,val)
    {
        if(colitem.format!="")
            var val = band.getFldStrValue(colitem.name+"_格式");
        return val;
    }
	function ms_iniData(band)
	{
		if(band.XmlLandData.recordset.RecordCount==0) return;
        var cols = band.Cols("0");
        //判断是否有Boolean类型的字段
        for(var j = 0; j < cols.length; j++)
        {
            var colitem     = band.ColObj(cols[j]);
            var colname = colitem.name;
		    var oinput = $input(band,colname);
		    if(!oinput) continue;
	        var val = band.getFldStrValue(colname);
	        val = trColValue(band,colitem,val);
		    var otype= oinput.type;
		    switch(otype)
		    {
		        case "checkbox":
		            if(val.toLowerCase()=="true" || val.toLowerCase()=="1" || val.toLowerCase()=="-1")
		                oinput.checked=true;
		            else
		                oinput.checked=false;
				    break;
		        case "radio":          
			        names= $N(oinput.name);//msgetElementsByName(oinput,oinput.name);
			        for(var m=0;m<names.length;m++)
			        {
			            if(names[m].msvalue==val || names[m].defaultValue == val)
			            {
			                names[m].checked = true;
			                break;
			            }
			        }
				    break;
				default:
			        if(oinput.tagName.toLowerCase()=="select")
			        {
				        ms_ajaxoptions(oinput);
				        document.getElementById(band.XmlLandData.id+"."+colname).value=val;
				    }
				    else
		    		    if(oinput.className.toLowerCase()=="xlandimg" && oinput.tagName.toLowerCase()=="img")
		    		    {
		    		        var sysurl="";
	    		            if(band.XmlSchema.document.referrer)
	    		                sysurl = band.XmlSchema.document.referrer.replace("contents.htm","").replace("listbar.htm","");//"http://localhost:8096/hmapp/contents.htm
		    		        if(val!="") 
                                oinput.src=sysurl+"wfimg.aspx?img="+val;
	                        else
	                            oinput.src=sysurl+"wfimg.aspx?img=Floppy.JPG";
	                    }
					    else		
			                $input(band,colname).value=val;
		    }
		}
		if(document.getElementById("rsnum"))
	        document.getElementById("rsnum").value="第"+band.XmlLandData.recordset.AbsolutePosition+"条";		
	}

	function ms_ajaxoptions(obj,oband)
	{
		if(!obj) obj=event.srcElement;
		var ops = obj.options;
		if(ops.options.length>0) return;
		if(!oband) oband = band;		
		var objid = obj.id;
		if(objid=="") objid = obj.dataFld;
		var nodecol =oband.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+objid+"']/@dataitem");
		var _dataitem="",_textcol="",_valuecol;
		if(nodecol) {
		    var nodeval  =oband.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+objid+"']/@valuecol");
		    var nodetext =oband.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+objid+"']/@textcol");
		    _dataitem 	= nodecol.value;
		    _textcol 	= nodetext.value;
		    _valuecol	= nodeval.value;
        }
        else
        {
            _textcol    = obj.DataTextField;
            _valuecol   = obj.DataValueField;
            _dataitem   = obj.DataSource;
        }
        var xmldoc=oband.UnitItem.ParamXmldoc;
        var wf = oband.getFldStrValue("审批事项");
        if(wf!="")
            ToolUtil.setParamValue(xmldoc, "审批事项", wf, "s", "P", "", "Ts","");
    
        var xmlhttp = oband.querydict(_dataitem);
        var xmldict = xmlhttp.responseXML.xml;
        oband.XmlDict.XMLDocument.loadXML(xmldict);
        oband.XmlDict.XMLDocument.setProperty("SelectionLanguage","XPath"); 
        if(!_dataitem) return;
        var _xpath = _dataitem.replace(" ","_x0020_").replace(":","_x003A_");
        
		var texts = oband.XmlDict.XMLDocument.selectNodes("//"+ _xpath +"//" + _textcol);
		var vals  = oband.XmlDict.XMLDocument.selectNodes("//"+ _xpath +"//" + _valuecol);
		ops.add(new Option("",""));
		for(var i=0;i<vals.length;i++)
			ops.add(new Option(texts[i].text,vals[i].text));
	}

	function ms_openajaxsend(band)
	{
		//实例化XMLHttpRequest对象
		xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");

        var ls_path=getpath();
        ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
        
        //传入band.itemname,band.unititem.unititem,event.srcElement.id(字段名)
        //路线：由上述参数找出单元，项目及字段，再取出对应的字典,提出数据
        //xmladict.aspx.cs
        //从中band.XmlConfig.xml取出字典
        //band.ItemName
        //band.UnitItem.UnitName
        var aparams = band.UnitItem.UnitName+","+band.ItemName+","+event.srcElement.id;
        xmlhttp.open("Post",ls_path+"xmladict.aspx?aparams="+aparams);

        //设置当服务器响应返回时用于处理响应的函数名
        xmlhttp.onreadystatechange=OnMessageBack_prn;
        //送发请求
		xmlhttp.send(null);				
	}

	function changesex(obj)
	{
		if(obj.value=="男") obj.value="女"
		else 
			if(obj.value=="女") obj.value="男";		
			else
			    obj.value="男"
	}

	function ms_save(hint)
	{
        var unititem = document.UnitItem;
        if(!unititem) unititem = band.UnitItem;

	    var strResult=unititem.saveData();
	    var success=ToolUtil.valueTag(strResult,"成功");
		var ctrlsrc = null;
		if(event)
            ctrlsrc=event.srcElement;
	    if("true"==success)
	    {
	        if(hint && hint!="") 
	        {
	            if(hint.toLowerCase()!="false") alert(hint);
	        }
	        else if(hint=="")
	        {}
	        else 
	            alert("保存成功!");
	        
	        if("saverefresh"==unititem.SaveType)
	        {
	            var bandR=(unititem.BandMaster)?unititem.BandMaster:unititem.Bands[0];
	            if(bandR)   bandR.Query();
	            for(var i=0;i<unititem.Bands.length;i++)
	            {
	                if("General"==unititem.Bands[i].itemType)
	                    unititem.Bands[i].Query();
	            }
	        }
	        if(ctrlsrc) ctrlsrc.disabled=false;
	        document.isPost=null;
	        return true;
	    }else{
	        if(!strResult) alert("保存失败，请检查！");
	        else
	            alert(ToolUtil.valueTag(strResult,"提示"));
	        if(ctrlsrc) ctrlsrc.disabled=false;
	        document.isPost=null;
	        return false;
	    }
	}

    function ms_save1(hint)
    {
        var unititem = document.UnitItem;
        if(!unititem) unititem = band.UnitItem;
        var ctrlsrc=event.srcElement;
        if(ctrlsrc.disabled || document.isPost)
            return false;
        ctrlsrc.disabled=true;
        document.isPost=true;
        
	    var	 strMsg = unititem.ValidatityAll(true);
	    if(!strMsg)
	    {
	        ToolUtil.sleep(2);
	        strMsg = unititem.ValidatityAll(true);
	    }
	    if(strMsg && ""!=strMsg)
	    {
		    alert(strMsg);
		    {ctrlsrc.disabled=null;document.isPost=null;return false;}
	    }
    	
        var strResult=unititem.saveData();
        var success=ToolUtil.valueTag(strResult,"成功");
        if("true"==success)
        {
            if(hint && hint!="") 
            {
                if(hint.toLowerCase()!="false") alert(hint);
            }
            else if(hint && hint=="")
            {}
            else 
                alert("保存成功!");
            
            if("saverefresh"==unititem.SaveType)
            {
                var bandR=(unititem.BandMaster)?unititem.BandMaster:unititem.Bands[0];
                if(bandR)   bandR.Query();
                for(var i=0;i<unititem.Bands.length;i++)
                {
                    if("General"==unititem.Bands[i].itemType)
                        unititem.Bands[i].Query();
                }
            }
            ctrlsrc.disabled=false;
            document.isPost=null;
            return true;
        }else{
            alert(ToolUtil.valueTag(strResult,"提示"));
            ctrlsrc.disabled=false;
            document.isPost=null;
            return false;
        }
    }

    function ue_navctrl(oband,strMsg,curindex)
    {
		if(strMsg && ""!=strMsg)
		{
			alert(strMsg);return;
		}
		oband.setCurrentRow(curindex);
		if(oband.Grid && oband.Grid.curTd)
		{
			var ctrl=ToolUtil.getCtrlByNameD(false,oband.Grid.curTd,"colname");
			if(ctrl)    ctrl.fireEvent("onfocus");
		}	    
    }
	function ue_nstart(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(1==oband.RecordCount())
			strMsg="";
		else
			strMsg=oband.CalXmlLand.ValidateRow((oband.RecordCount()<1)?-1:(oband.XmlLandData.recordset.AbsolutePosition-1));
		ue_navctrl(oband,strMsg,0);
		return;		
	}

	function ue_nnext(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;	//记录行以1为基点,需要换成以0为基点
		var curindex=(index+1<oband.XmlLandData.recordset.recordCount)?(index+1):index;
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
        ue_navctrl(oband,strMsg,curindex)
        return;
	}
	

	function ue_nlast(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var curindex=oband.XmlLandData.recordset.recordCount-1;
		if(curindex!=oband.XmlLandData.recordset.AbsolutePosition-1)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
        ue_navctrl(oband,strMsg,curindex)
		return;
	}
	
	function ue_nprev(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		if(oband.RecordCount()<1)
			return;
		var index=oband.XmlLandData.recordset.AbsolutePosition-1;
		var curindex=(index<1)?0:(index-1);
		if(curindex!=index)
			var strMsg=oband.CalXmlLand.ValidateRow(oband.XmlLandData.recordset.AbsolutePosition-1);
		else
			var strMsg="";
		ue_navctrl(oband,strMsg,curindex);
		return;
	}

	function ns_bandadd(itemname)
	{
	    var oband=document.UnitItem.getBandByItemName(itemname);
		if(!oband)   return;
		/* 校验行记录*/
		if(oband.RecordCount()>0)
		    var rowIndex=oband.XmlLandData.recordset.AbsolutePosition-1;
		else
		    var rowIndex=-1;
		var strMsg=oband.CalXmlLand.ValidateRow(rowIndex);
		if(strMsg && ""!=strMsg)
		{
			alert(strMsg);return;
		}
		oband.NewRecord();
		//window.setTimeout(_setRow(oband),150);
		/*
		oband.setCurrentRow(oband.XmlLandData.recordset.recordCount-1);
		if(oband.Grid)
		    oband.Grid.setFocus();
		return;
		*/
	}
	
	//人工动态设置select的options; 'goods' - itemname,'dict_datatype'-字典数据源
    function nsInitGridOps(item,dictsrc)
    {
    
        var oband	=	document.UnitItem.getBandByItemName(item);
        var dicts = oband.XmlDict.XMLDocument.selectNodes("//"+ dictsrc.replace(":","_x003A_"));
        if(dicts.length>1) return;
        var tabDetail = oband.Grid.Table;
        var xmlhttp = QueryDict(dictsrc);
        var xmldict = xmlhttp.responseXML.xml;
        oband.XmlDict.XMLDocument.loadXML(xmldict);
        var dTable = new Object;
        dTable.outerHTML = oband.Grid.DivDetail.innerHTML;
        var sls = tabDetail.getElementsByTagName("SELECT");
        var obj;
        for(var i=0;i<sls.length;i++)
        {
            if(sls[i].DataSource==dictsrc)
            {
                obj=sls[i];
                var texts = band.XmlDict.XMLDocument.selectNodes("//"+ dictsrc.replace(":","_x003A_") +"//" + obj.DataTextField);
                var vals  = band.XmlDict.XMLDocument.selectNodes("//"+ dictsrc.replace(":","_x003A_") +"//" + obj.DataValueField);
                
                var ops = obj.options;
                if(ops.options.length>0) return;                                        
                ops.add(new Option("",""));
                for(var m=0;m<vals.length;m++)
                    ops.add(new Option(texts[m].text,vals[m].text));
            }
        }
    }    		    

    function msInitGridOps()
    {
        var obj=event.srcElement;
        if(!obj.colname || ""==obj.colname || obj.tagName!="SELECT") return;
        var ops = obj.options;
        if(!ops) return;
        if(ops.options.length>2) return;
        ops.length=0;
        //数据所在表格,及对应数据岛数据结构,列节点
        var trcur=ToolUtil.getCtrlByTagU(true,obj,"TR","rowType","detail");
        var tabDetail=ToolUtil.getCtrlByTagU(true,obj,"TABLE","tabType","detail");
        var myUnitItem=document.UnitItem;
        var band = myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
        //if(band.XmlDict.xml=="") 
        //{
            var xmlhttp = band.querydict();
            var xmldict = xmlhttp.responseXML.xml;
            if(xmldict=="") return;
            band.XmlDict.XMLDocument.loadXML(xmldict);
        //}
        var texts = band.XmlDict.XMLDocument.selectNodes("//"+ obj.DataSource.replace(":","_x003A_") +"//" + obj.DataTextField);
        var vals  = band.XmlDict.XMLDocument.selectNodes("//"+ obj.DataSource.replace(":","_x003A_") +"//" + obj.DataValueField);
        ops.add(new Option("",""));
        for(var m=0;m<vals.length;m++)
            ops.add(new Option(texts[m].text,vals[m].text));
        obj.value=band.getFldStrValue(obj.colname);
    }    		    

	function ms_query(item,btn)
	{
	    var oband = getband(item);
	    if(!oband) return;
	    if(document.getElementById(btn))
	    {
		    if(item=="用料清单") document.getElementById(btn).disabled=false;
		    else document.getElementById(btn).disabled=true;	    
		}
    	oband.Query();			
	}
