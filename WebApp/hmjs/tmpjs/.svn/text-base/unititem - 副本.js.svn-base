      var isfirst=true;
      function initWin()
      {
            $("frtitle").innerText="正在加载数据，请稍等...";
            $("frtitle").innerText="　功能单元设置 ";             
	        var ob = $band("itemtree");
            ob.Asyn = true;
            $band("items").Asyn = true;
            $band("columns").Asyn = true;
            ob.XQuery();
            ob.AfterXQuery = function(){
                $loading("none");
            }
//            us_htmldict("itemtree","slworkflow");	
	        ob.AfterCellEditChanged=function()
	        {
	            if(this.Event.colName=="ntype")
	                changepro(this.getFldStrValue("ntype"));        
	        }
	         
      }

    function us_htmlXdict(objname,xmlrows)
    {
        var obj=$(objname);
        if(!obj || !obj.options) return;
        var ops = obj.options;
        if(ops.options.length>0) return;
        for(var i=0;i<xmlrows.length;i++)
        {
            var txt = xmlrows[i].selectSingleNode("name");
            var value = xmlrows[i].selectSingleNode("ID");
            ops.add(new Option(txt.text,value.text));
        }
    }

    function us_htmldict(item,objname)
    {
	    var tbl="";
	    if(event && event.srcElement)
	        tbl = event.srcElement.value;	    
        var band	=	$band(item);
        var obj=$(objname);
        var drc = obj.DataSource;
        if(drc.indexOf("''")>-1)
	        drc = drc.replace("''","")+" '"+tbl+"'";
        if(drc.indexOf("[sys]")>-1)
	        drc = drc.replace("[sys]",ue_getsysdb());
	        
	    var xmlhttp = QueryDict(drc);
        var xmldict = xmlhttp.responseXML.xml;
        band.XmlDict.XMLDocument.loadXML(xmldict);
        var _xpath = drc.replaceAll(" ","_x0020_").replaceAll(":","_x003A_").replaceAll("'","_x0027_");    
        
        var xmlrows = band.XmlDict.XMLDocument.selectNodes("//"+ _xpath);
        var ops = obj.options;
        ops.options.length=0;
        ops.add(new Option("",""));
        for(var m=0;m<xmlrows.length;m++)
        {
            var text = xmlrows[m].selectSingleNode(obj.DataTextField).text;
            var val  = xmlrows[m].selectSingleNode(obj.DataValueField).text;
            var tag  = xmlrows[m].selectSingleNode("tag");
            var opt   = new Option(text,val);
            ops.add(opt);
        }        
    }
	    
    function Tree_onNodeSelectionChange(node)
    {
        if(document.locktree==1) return;
        var band	=	node.ParentTreeView.Tree.Band;
        TclickDot(node,true);				  
        var ntype 	= 	band.getFldStrValue("ntype");
        changepro(ntype);
        $loading("none");  
    }
			
			function changepro(type)
			{
			    var itemname = "";
				switch(type)
				{
					case "UnitItem":
						$("tabUnit").style.display="";
						$("tabItem").style.display="none";
						$("tabappItem").style.display="none";
						$("tabcomItem").style.display="none";
						$("tabColumns").style.display="none";						
						//$("trSay").style.display="none";						
						break;
					case "Item":
						$("tabUnit").style.display="none";
						$("tabItem").style.display="";
						$("tabappItem").style.display="none";
						$("tabcomItem").style.display="none";
						$("tabColumns").style.display="none";						
						//$("trSay").style.display="none";
						itemname = "items";
						break;
					case "AppendItem":
						$("tabUnit").style.display="none";
						$("tabItem").style.display="none";
						$("tabappItem").style.display="";
						$("tabcomItem").style.display="none";
						$("tabColumns").style.display="none";						
						//$("trSay").style.display="none";
	                    itemname = "appitems";
						break;
					case "CommandItem":
						$("tabUnit").style.display="none";
						$("tabItem").style.display="none";
						$("tabappItem").style.display="none";
						$("tabcomItem").style.display="";
						$("tabColumns").style.display="none";
						//$("trSay").style.display="none";						
	                    itemname = "comitems";
						break;
					default:
						//$("trSay").style.display="";					
						$("tabUnit").style.display="none";
						$("tabItem").style.display="none";
						$("tabappItem").style.display="none";
						$("tabcomItem").style.display="none";
						$("tabColumns").style.display="none";
				}
				if(itemname=="") return;
                var band = $band(itemname);
                $loading();
                band.XQuery();
                band.AfterXQuery = function(){
                    $band("columns").active = false;
                    $loading("none");
                }
				if(itemname=="items") _xmlflds();
			}
			function showcols()
			{
				$("tabColumns").style.display="";
				$("tabUnit").style.display="none";
				$("tabItem").style.display="none";
				$("tabappItem").style.display="none";
				$("tabcomItem").style.display="none";
                if($band("columns").active) return;
                us_htmldict("itemtree","dataname");	
                us_htmldict("itemtree","tablename");	
                
                var band = $band("columns");
                band.minwidth = "80px";
                //mband.title    = "客户联系人管理";
                band.gridtype = 0;
                band.freecols = "name";
                var Grid = new XGrid("dvcolumns",band,"in");
                band.XQuery();				
			}			
			function showitems()
			{
				$("tabColumns").style.display="none";
				$("tabUnit").style.display="none";
				$("tabItem").style.display="";
				$("tabappItem").style.display="none";
				$("tabcomItem").style.display="none";			
			}
			
            function openPro(xmlID)
            {
	            if(!xmlID)
	            {
		            var tab=ToolUtil.getCtrlByTagU(false,event.srcElement,"TABLE","tabType","grid");
		            if(!tab)	return;
		            var tabDetail=ToolUtil.getCtrlByTagD(true,tab,"TABLE","tabType","detail");
		            if(!tabDetail || !tabDetail.Grid)
			            return;
		            var band=$band(tabDetail.Grid.ItemName);
	            }else{
		            var xmlland=$(xmlID);
		            if(!xmlland)	return;
		            var band=$band(xmlland.itemname);
	            }
	            if(!band || !band.XmlSchema)    return;
	            var rtn = window.showModalDialog("frmprop.HTM",band,"dialogHeight: 560px; dialogWidth: 450px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
	            if(rtn=="" || rtn==null) return 1;	 
            }
            
            function _openModal(src,xwin,xdict)
            {
                var oband = $band("itemtree");
                var trvNode = oband.Tree.WebTree.SelectedNode;
                var pIndex = oband.Tree.getRowIndexByTrvNode(trvNode.ParentNode);
                var fileval = $band("itemtree").getFldStrValue("datasrcfile",pIndex);
    	        var xmldoc=document.UnitItem.ParamXmldoc;
    	        switch(xdict)
    	        {
    	            case "0":
    	                var pval = $band(src).getFldStrValue("dataitem");
    	                break;
    	            case "1":
    	                var pval = $band(src).getFldStrValue("countdataitem");
    	                break;
    	        }
    	        var _ipos = pval.indexOf(":");
    	        if(_ipos>-1)
    	        {
    	            var arr = pval.split(":");
    	            if(arr.length>0)
    	            {
    	                fileval = arr[0]; pval = arr[1];
    	            }
    	        }
	            ToolUtil.setParamValue(xmldoc, "dataitemname", pval, "s", "P", "", "Ts","");
	            ToolUtil.setParamValue(xmldoc, "datafile", fileval, "s", "P", "", "Ts","");
            	$band(src).setModalContent(xwin);
            }
			
			function _btnEdit()
			{
                var tmps = ue_ajaxdom("","htmlfiles");
                Acbo(tmps.text.split(","))
			}

			function _openappach()
			{
				//实例化XMLHttpRequest对象
				xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");

				//利用Open方法向指定URL
		        //查询字符串“name”将文本框中的数据传送到目标页面

     			var band = $band("itemtree");
     			var prtname = band.getFldStrValue("printtemplate");
     			//调用后台查询出系统定义的打印路径
     			var strdir = "DataSource/resources/ExcelTemplate";
     			
                var ls_path=getpath();
                ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
		        xmlhttp.open("Post",ls_path+"xmlfiles.aspx?svrdir="+strdir);

		        //设置当服务器响应返回时用于处理响应的函数名
		        xmlhttp.onreadystatechange=OnMessageBack_prn;
		        //送发请求
				xmlhttp.send(null);				
			}

			function _btnprnEdit1()
			{
                var tmps = ue_ajaxdom("","prnfiles");
                Acbo(tmps.text.split(","))
			}
            function _btnimgEdit()
            {
                var tmps = ue_ajaxdom("","iconfiles");
                Acbo(tmps.text.split(","))            
            }
			function OnMessageBack_prn()
			{
				if(xmlhttp.readyState==4 && xmlhttp.status==200)
				{
			        var arrfiles =xmlhttp.responseText.split(",");
					var owin = new oWin(arrfiles);
                    var rtn = window.showModalDialog("DataSource/Template/frmprn.HTM",owin,"dialogHeight: 535px; dialogWidth: 600px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 				
	            }
			}

			function oWin(arr)
			{
			    var obj= new Object;
			    obj.files = arr;
			    obj.band = $band("itemtree");
                var ls_path=getpath();
                ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
			    obj.appath = ls_path;
			    return obj;
			}
			
			function ts_importDate(srcitem,destitem)
			{
				if($("tablename").value=="") {alert("请选择一个数据库表名称！");return}
				var band=$band(destitem);	
				var xmldoc=document.UnitItem.ParamXmldoc;
				var tablename = $("tablename").value;
				ToolUtil.setParamValue(xmldoc, "tablename", $("dataname").value + ".dbo." +tablename, "", "s", band.ItemName, "D",""); 
				$band(destitem).setModalContent(srcitem);
			}
			
            function _copy()
            {
                var str=strscrtable();
                dlgwin(1,str,"参数复制",480,200);
                var oband=$band("itemtree");
                if(oband.getFldStrValue(oband.Tree.TypeField)=="UnitItem")
                {
                    var pid = oband.getFldStrValue("PID");
                    var xmlNodeRowsDest = oband.XmlLandData.XMLDocument.selectNodes("//unititems[PID='"+pid+"']");
                    var xmlNodeRows = oband.XmlLandData.XMLDocument.selectNodes("//unititems[ntype='UnitItem']")
                    us_htmlXdict("txtsrc",xmlNodeRows);
//                    us_htmlXdict("txtdest",xmlNodeRowsDest);
                }
                $("txtsrc").value=oband.getFldStrValue("ID");
            }	
            function runcopy()
            {
                 var tit1 = $("txtsrc").options[$("txtsrc").options.selectedIndex].text;
                 var tit2 = $("txtdest").value;
                 if(tit2=="" || tit1==tit2) {alert("新操作集名称不能为空，且不能重复!");return;}
                 var result = confirm("您将把【"+tit1+"】的参数值复制给【"+tit2+"】，确认吗？");
                 if(!result) return;                    
                var strsql = "execute "+ue_getsysdb()+".dbo.proc_copy_unititemByName '"+tit1+"','"+ tit2 +"'";
                ue_ajaxdom(strsql,1,"复制成功！");
                ShowHide(1);
            }
            	    
            function dlgwin(winid,str,title,width,height)
            {
                if(!winid) winid="1";
                var owin = dwobj(winid);
                if(!owin)
                {
                    var owin = new Object;
                    owin.id     = winid;
                    if(width && width!=0) owin.width=width;
                    else owin.width  = 480;
                    if(height && height!=0) owin.height=height;
                    else owin.height  = 390;
                    owin.top    = 200;
                    owin.left   = 200;
                    owin.text   = str;
                    owin.title  = title;
                    owin.hovercolor = "orange";
                    owin.color = "black";
                    var a = new xWin(owin);
                }
                else
                {
                    ShowHide(winid,null);
                    dwmsg(winid).innerHTML=str;
                }
                center(winid);
            }        
            
            function strscrtable()
            {
                var s= '<div><fieldset style="padding: 2;width:99%;;height:120px"><legend>复制参数:</legend><div style="text-align:left"><br />'+
	            '<span style="text-align:right;width:200px">源参数命令组:&nbsp;&nbsp;</span><select id="txtsrc" size="1" style="WIDTH: 200;" name="D6"></select>'
                +    '<br /><br />'+
	            '<span style="text-align:right;width:200px">目的参数命令组:&nbsp;&nbsp;</span><input id="txtdest" type="text" style="WIDTH: 200;" name="D6" />'
	            +'</fieldset>'+
	            '</div><br />'+
                '<input type=button value="确定" onclick="runcopy();"style="width:80px">';
                return s;
            }

            function ws_locktree(obj)
            {
                if(obj.nameProp=="lock_open.gif")
                {
                    document.locktree=1;
                    obj.src="images/lock.gif";
                }
                else
                {
                    document.locktree=0;
                    obj.src="images/lock_open.gif";
                }
            }            
            
            function _save()
            {
                var oband=$band("itemtree");
                if(oband.getFldStrValue("ntype")=="BusinessSource"){alert("请保存指定的项目！");return;}                
                if(oband.getFldStrValue("ntype")=="UnitItem")
                {
                    var unititem = oband.getFldStrValue("name");
                }
                else
                {
                    var unititem = oband.Tree.WebTree.get_selectedNode().GetParentNode().Text;            
                }
                strcertify = unititem;
                var xmldoc=document.UnitItem.ParamXmldoc;
                ToolUtil.setParamValue(xmldoc, "certify", strcertify, "", "P", "", "T");
                if(!ue_save("")) return;
                var result = confirm("是否更新模板文件，确认吗？");
                if(!result) return;                    
                _xmlsave();
            }
            
            function _xmlsave()
            {
                var oband=$band("itemtree");
                if(oband.getFldStrValue("ntype")=="BusinessSource"){alert("请保存指定的项目！");return;}                
                if(oband.getFldStrValue("ntype")=="UnitItem")
                    var unititem = oband.getFldStrValue("name");
                else
                    var unititem = oband.Tree.WebTree.get_selectedNode().GetParentNode().Text;
                var xmlhttp = CreateHTTP();
                xmlhttp.open("POST",ue_path()+"/sysxml.aspx?unititem="+unititem,false);
                xmlhttp.send(null);
                var xmldb = xmlhttp.responseXML.documentElement; 
                if(xmldb==null) return;
                if(xmldb.selectNodes("//table").length==0){alert("未设置系统数据库！");return;}
                alert(xmldb.selectNodes("//table")[0].text);
                
            }
            
            function _xmlflds()
            {
                var ob=$band("itemtree");
                if(ob.getFldStrValue("ntype")!="Item"){return;}
                var dataitem = $band("items").getFldStrValue("dataitem");
                unititem = ob.Tree.WebTree.get_selectedNode().GetParentNode().Text;
                if(unititem=="" || datafile=="" || dataitem=="") return;
                var datafile = ob.getValByBandKey("ID",ob.getFldStrValue("PID"),"datasrcfile");
                var xmlhttp = CreateHTTP();
                xmlhttp.onreadystatechange =  function()
                {
                    if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
                    {
                        var xmldb = xmlhttp.responseXML.documentElement; if(!xmldb) return;
                        var xnode = xmldb.selectSingleNode("//data");
                        if(!xnode) return;
                        var xstructs =xnode.text.split(";");
                        var arr =xstructs[0].split(",");
                        var ctrls = $N("treefld")
                        for(var i=0;i<ctrls.length;i++)
                            us_htmlAdict(ob,ctrls[i],arr);
                    }
                }
                xmlhttp.open("POST",ue_path()+"/sysxml.aspx?datafile="+datafile+"&dataitem="+dataitem,true);
                xmlhttp.send(null);
            }
            function us_htmlAdict(oband,obj,arr)
            {
                if(!obj) return;
                var ops = obj.options;
                obj.options.length=0;
                ops.add(new Option("",""));
                for(var i=0;i<arr.length;i++)
                {
                    var txt = arr[i];
                    var value = arr[i];
                    ops.add(new Option(txt,value));
                }
                if(obj.datafld)
                    obj.value = oband.getFldStrValue(obj.datafld)
            }            
            
            
            
            //------------------------- DIV定位函数 ------------------------//
                function getAbsolutePosition(obj)
                {
                position = new Object();
                position.x = 0;
                position.y = 0;
                var tempobj = obj;
                    while(tempobj!=null && tempobj!=document.body)
                    {
                        if(window.navigator.userAgent.indexOf("MSIE")!=-1)
                        {
                            position.x += tempobj.offsetLeft+10;
                            position.y += tempobj.offsetTop+15;
                        }
                        else if(window.navigator.userAgent.indexOf("Firefox")!=-1)
                        {
                            position.x += tempobj.offsetLeft;
                            position.y += tempobj.offsetTop;
                        }
                        tempobj = tempobj.offsetParent
                    }
                return position;
                }            
            //可用于IE和Firefox浏览器获取绝对位置。然后设置div或者其他控件的位置于该控件上,注意:被定位的层必须是style="position:absolute"

            function SetnPos(obj,objdest)
            {
                var pos=getAbsolutePosition(obj);
                objdest.style.left=pos.x+"px";
                objdest.style.top=pos.y+"px";
            }
            
            /*
            Html精确定位,ScrollHeight等介绍:
            scrollHeight: 获取对象的滚动高度。 
            scrollLeft:设置或获取位于对象左边界和窗口中目前可见内容的最左端之间的距离
            scrollTop:设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离
            scrollWidth:获取对象的滚动宽度
            offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度
            offsetLeft:获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置
            offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置 
            event.clientX 相对文档的水平座标
            event.clientY 相对文档的垂直座标
            event.offsetX 相对容器的水平坐标
            event.offsetY 相对容器的垂直坐标 
            document.documentElement.scrollTop 垂直方向滚动的值
            event.clientX+document.documentElement.scrollTop 相对文档的水平座标+垂直方向滚动的量 
            */
            