//提交时注意事项：
//1 band.setFldStrValue(null,"审批结果","受理"); 即将审批结果赋上当前[节点]值,或称为[当前状态]
//2 为[接收部门]赋值:insert into 实例流转部门分管(ID,流程,单据编号,单位名称,部门名称) values(newid(),@审批事项,@单据编号,@DeptSaleName,@接收部门)



/*  工作流提交并提交：
    itemname        - workitemname;
    bhfield         - 编号字段，如单据编号;
    bhitem          - 编号名称，如订单、合同、审批事项等;
    otherlinkfield  - 规则外关联条件的字段，如[分类]对应的字段 
    result          - 审批结果(目的节点)值
    另注：节点(当前节点),目的节点,审批事项,打印
*/
function ws_save(itemname,bhfield,bhitem,otherlinkfield,result,hint,otherbh)
{
 	var band = document.UnitItem.getBandByItemName(itemname);
	if(result && result!="") 
	    band.setFldStrValue(null,"目的节点",result);
	    
	if(band.RecordCount()==0){alert("请编辑数据后再保存"); return false;};
    if(!ms_check())
        return false;		
    var bh=band.getFldStrValue(bhfield);
    if(!bh || ""==bh || bh.length<4)
    {
        if(bhitem=="记帐凭证") 
            var rtn = ws_getpzbh(itemname);
        else 
            var rtn = ws_getbh(bhitem);
        if(rtn=="") {alert("请检查是否输入了凭证日期！");
            if(event.srcElement) event.srcElement.disabled=false;
	        document.isPost=null;
            return false
        }
    	if(rtn=="error") {alert("编号生成错误，请检查！");
            if(event.srcElement) event.srcElement.disabled=false;
	        document.isPost=null;    	
    	    return false}
    	if(otherlinkfield)
    	{
	    	var nb = band.getFldStrValue(otherlinkfield);
	    	if(nb=="") nb="10";
	    	rtn = rtn.replace("[分类]",nb);
    	}
        band.setFldStrValue(null,bhfield,rtn,bh);
        if(otherbh && typeof(_getdh) == "function")
            band.setFldStrValue(null,otherbh,_getdh(itemname,bhfield));
    }
    ms_save(hint);
}
//ajax获取编号
function ws_getbh(bhitem)
{
	xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    try{
    xmlhttp.open("Post",ls_path+"xmlbh.aspx?file="+bhitem,false);
	xmlhttp.send(null);
	}catch(ex){}
	return xmlhttp.responseText;
}

//ajax获取凭证编号
function ws_getpzbh(itemname)
{
    var oband = document.UnitItem.getBandByItemName(itemname);
    var dt = oband.getFldStrValue("日期");
    if(dt=="") return null;
	xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    try{
    xmlhttp.open("Post",ls_path+"xmlpzbh.aspx?file="+dt,false);
	xmlhttp.send(null);
	}catch(ex){}
	return xmlhttp.responseText;
}

/* 工作流事件 */
function ws_nodes()
{
    var xmldoc=document.UnitItem.ParamXmldoc;
    var node = ToolUtil.getParamValue(xmldoc,"节点","P","","Ts");
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    var strsql="EXECUTE [Gonodes] '合同审批','"+node+"'";
	xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
    xmlhttp.open("POST",ls_path+"XMLSQL.aspx?strsql="+strsql,false);
    xmlhttp.onreadystatechange=function()
    {
	    if(xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
            xmldata = new ActiveXObject("Microsoft.XMLDOM");
            xmlhttp.responseXML.createProcessingInstruction("xml"," version=\"1.0\" encoding=\"gb2312\"");
            xmldata = xmlhttp.responseXML.documentElement;              
            if(xmldata==null) return;
            var xmlnames = xmldata.selectNodes("Table/名称");
            var xmlbhs   = xmldata.selectNodes("Table/编码");
            for(var i=0;i<xmlnames.length;i++)
            {
                var name = xmlnames[i].text;
                var id   = "submit_"+xmlbhs[i].text;
            }
        }
    };
	xmlhttp.send();		
}

		function OnMessageBackDataXX()
		{
			if(xmlhttp.readyState==4 && xmlhttp.status==200)
			{
                xmldata = new ActiveXObject("Microsoft.XMLDOM");
                xmlhttp.responseXML.createProcessingInstruction("xml"," version=\"1.0\" encoding=\"gb2312\"");
                xmldata = xmlhttp.responseXML.documentElement;              
                if(xmldata==null) return;
                var xmlnames = xmldata.selectNodes("Table/名称");
                var xmlbhs   = xmldata.selectNodes("Table/编码");
                for(var i=0;i<xmlnames.length;i++)
                {
                    var name = xmlnames[i].text;
                    var id   = "submit_"+xmlbhs[i].text;
                    ws_addMenuItem(name,id);  
                }
                //ws_addMenuItemInXml(name,id);
            }
		}

        //此函数在菜单创建前使用
		function ws_addMenuItemInXml(name,id)
		{
		    var mnunodes = menuxml.selectSingleNode("//MenuItem[@name='提交']");
		    var newnode = menuxml.createElement("MenuItem");
		    newnode = mnunodes.appendChild(newnode);
		    newnode.setAttribute("name", name);
		    newnode.setAttribute("id", id);
		    newnode.setAttribute("src", "");
		}
		
        //此函数在菜单创建后使用
		function ws_addMenuItem(name,id)
		{
            var pItem=aMenuBar.getItem("submititem");
            var subMenu = new   dhtmlXMenuBarPanelObject(pItem.parentPanel,pItem,false,120,true);
            var subItem = new dhtmlXMenuItemObject(id,name,null,null,"menuButtonSecond");
            aMenuBar.addItem(subMenu,subItem);
		}
		function ws_workflowparams()
		{
		    var xmldoc=document.UnitItem.ParamXmldoc;
		    var node = ToolUtil.getParamValue(xmldoc,"节点","P","","Ts");
		    var workflow = ToolUtil.getParamValue(xmldoc,"workflow","P","","Ts");
		}

		function ws_menu()
		{
		    aMenuBar=new dhtmlXMenuBarObject(document.getElementById('menu_zone'),'100%',25,"");
		    aMenuBar.setOnClickHandler(ws_onButtonClick);
		    aMenuBar.setGfxPath("codebase/imgs/");
		    aMenuBar.loadXMLString(menuxml.XMLDocument.xml);
		}
		function ws_onButtonClick(itemId,itemValue)
		{
		    var mItem=aMenuBar.getItem(itemId);
		    var name = mItem.text;
		    switch(itemId)
		    {
		        //menufile
		        case "new":_new(); break;
		        case "save":_save(); break;
		        case "saveas":_saveas(); break;
		        case "finish":_finish(); break;
		        case "print":_print(); break;
		        case "close":ms_close(); break;
		        case "submit":ws_opensubmit(0); break;
		        case "return":ws_opensubmit(1); break;
		        //menuedit
		        
		        //menuview
		        
		        //menuhelp
		        
		        default:
		            var str = "submit_";//提交标志，后跟目的节点的编码，即当前菜单Id
		            if(itemId.indexOf("submit_")>-1)
		                _submit(name,"提交成功！");
		            
		    }
		};
		
        //type  - 0提交，1回退
        //oband - 对应流程事务的item
        //pos   - 提交项的位置，0-内部,1外部列表
		function ws_opensubmit(type,oband,pos)
		{
	        var wname=ws_gettpath()+"frmnodes.HTM";
	        var owin = ws_owin(type,oband,pos);
            if(!owin) return;
            var destnode;
		    switch(type)
		    {
		        case 0:
		            owin.title = "提交";
		            if(oband) oband.setFldStrValue(null,"提交方向","前进");
		            break;
		        case 1:
		            owin.title = "回退";
		            if(oband) oband.setFldStrValue(null,"提交方向","回退");
		            break;
		        default:
		            owin.title = "提交";
		            if(oband) oband.setFldStrValue(null,"提交方向","前进");
		    }
            if(owin.names.length==0) {alert("没有可"+owin.title+"的节点！"); return;}		            
            destnode = window.showModalDialog(wname,owin,"dialogHeight:200px; dialogWidth:400px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
            return destnode;
		}
        function ws_owin(type,oband,pos)
        {
		    var xmldoc=document.UnitItem.ParamXmldoc;
		    var node = ToolUtil.getParamValue(xmldoc,"节点","P","","Ts");
		    var workflow = ToolUtil.getParamValue(xmldoc,"workflow","P","","Ts");
		    if(node=="")
		        node = ToolUtil.getParamValue(xmldoc,"startnode","P","","Ts");
            var bh = ToolUtil.getParamValue(xmldoc,"编号","P","","Ts");
            if(pos==1){
                node    = oband.getFldStrValue("节点");
                bh0      = oband.getFldStrValue("编号");
                if(bh0!="") bh=bh0;
                workflow= oband.getFldStrValue("审批事项");
            }
            if(workflow=="" || !workflow) workflow = document.UnitItem.workflow;
            if(workflow=="" || !workflow) {alert("工作流名称不能为空！");return}
            //var appdir = "http://"+location.host+"/hmapp/";
            var ls_path=getpath();
            ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
            var strsql="";
            switch(type)
            {
                case 0: strsql="EXECUTE [Gonodes] '"+workflow+"','"+node+"','"+bh+"'";
                    break;
                case 1: strsql="EXECUTE [Backnodes] '"+workflow+"','"+node+"'";
                    break;
            }
			xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
	        xmlhttp.open("POST",ls_path+"XMLSQL.aspx?strsql="+strsql,false);
            var obj= new Object;	        
	        xmlhttp.onreadystatechange=function()
	        {
			    if(xmlhttp.readyState==4 && xmlhttp.status==200)
			    {
                    xmldata = new ActiveXObject("Microsoft.XMLDOM");
                    xmlhttp.responseXML.createProcessingInstruction("xml"," version=\"1.0\" encoding=\"gb2312\"");
                    xmldata = xmlhttp.responseXML.documentElement;              
                    if(xmldata==null) return;
                    var xmlnames = xmldata.selectNodes("Table/名称");
                    var xmlbhs   = xmldata.selectNodes("Table/编码");
                    for(var i=0;i<xmlnames.length;i++)
                    {
                        var name = xmlnames[i].text;
                        var id   = xmlbhs[i].text;
                    }
                    obj.names   = xmlnames;
                    obj.bhs     = xmlbhs;
                    obj.workflow = document.UnitItem.workflow;
                    return obj;
                }
	        };
			xmlhttp.send();	
			return obj;	        
        }

        function ws_gettpath()
        {
                //location.host+
				var tmppath= document.UnitItem.tpath;
				if(!tmppath) return "";
				if(tmppath!="")
				{
					if(tmppath.match(/\/([^\/]+)$/)==null) return "";
					var filename = tmppath.match(/\/([^\/]+)$/)[1];
					tmppath = tmppath.replace(filename,"");
				}
				return tmppath;        
        }		

	    function htm_setchkfield(item)
	    {
		    if(!item) item="edit";
		    var oband=document.UnitItem.getBandByItemName(item);
		    var _obj=event.srcElement;
		    var fieldname = "";
		    if(_obj.tagName=="LABEL" || _obj.tagName=="SPAN")
		    {
			    fieldname = document.getElementById(_obj.htmlFor).name;
			    oband.setFldStrValue(null,fieldname,_obj.innerText);
		    }
		    else
		    {
		        //document.getElementById(_obj.htmlFor).style.fontWeight="bold";
			    oband.setFldStrValue(null,_obj.name,_obj.value);
		    }
	    }
	    //字段名为radio或checkbox的控件name
        function htm_spotchk(item,fieldname)
        {
	        var chk=document.getElementsByName(fieldname);
	        var band=document.UnitItem.getBandByItemName(item);
	        var xstate = band.getFldStrValue(fieldname);
	        for(var i=0;i<chk.length;i++)
	        {
		        if(chk[i].value==xstate)
		        {
			        chk[i].checked=true;
//			        if(chk[i].previousSibling)
//			            chk[i].previousSibling.style.fontWeight="bold";
//			        else
//		            if(chk[i].nextSibling && chk[i].nextSibling.htmlFor==chk[i].id)
//		                chk[i].nextSibling.style.fontWeight="bold";
			        break;
		        }
	        }
        }
        
        function ws_returnitem(bcase,xmlID)
        {
            if(event.srcElement.innerText=="") return;
            GridUtil.usOnCellRFocusHandle();
	        var band=GridUtil.FindBand(xmlID);
	        if(!band)   return;        
            var destnodes = ws_opensubmit(bcase,band,1);
            var destnode="";var isnodes="";
            if(!destnodes) return;
            var arr=destnodes.split(";");
            if(arr.length>1)
            {
                destnode=arr[0];
                isnodes =arr[1];
            }
            else
                destnode = destnodes;
            var xmldoc=band.UnitItem.ParamXmldoc;
            ToolUtil.setParamValue(xmldoc, "isnodes", isnodes, "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", destnode, "s", "P", "", "Ts","");
            if(bcase==1)
                ue_cmd("returnitem");
            else 
                ue_cmd("submititem");
            band.Query();
            return true;
        }
        
        //凭证登帐
        function voucher_checkin()
        {
            //检测是否有处于本期所有凭证均处于凭证登帐环节
            
            GridUtil.usOnCellRFocusHandle();
	        var band=GridUtil.FindBand(xmlID);
	        if(!band)   return;        
            var destnodes = ws_opensubmit(bcase,band,1);
            var destnode="";var isnodes="";
            if(!destnodes) return;
            var arr=destnodes.split(";");
            if(arr.length>1)
            {
                destnode=arr[0];
                isnodes =arr[1];
            }
            else
                destnode = destnodes;
            var xmldoc=band.UnitItem.ParamXmldoc;
            ToolUtil.setParamValue(xmldoc, "isnodes", isnodes, "s", "P", "", "Ts","");
            ToolUtil.setParamValue(xmldoc, "destnode", destnode, "s", "P", "", "Ts","");
            if(bcase==1)
                ue_cmd("returnitem");
            else 
                ue_cmd("submititem");
            band.Query();
        }        
        
		function ws_manageritem()
		{
		    GridUtil.usOnCellRFocusHandle();
            var band=document.UnitItem.getBandByItemName("nav");
            if(!band)    return;		    
	        var wname=ws_gettpath()+"frmEndManager.htm";
            var rtncase = window.showModalDialog(wname,band,"dialogHeight: 200px; dialogWidth: 500px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
            return rtncase;
		}

        function winclose(name)
        {
            window.onbeforeunload=null;
            if(!name)  name="";
            var str = "您将关闭"+name+"窗口，确认吗？";
            var result = confirm(str);
            if(result) window.close();
            else return false;
        }				
        
      //endnode - 截止节点编码，为空的话是取所有意见栏
	  function CreateOpionTable(endnode)
	  {
	  	 var oband;
	  	 if(oUnitItem)
		 oband=oUnitItem.getBandByItemName("opinion");
		 if(oband==null) return;
		 var xmldoc=document.UnitItem.ParamXmldoc;
		 ToolUtil.setParamValue(xmldoc, "单据编号",oband.UnitItem.BandMaster.getFldStrValue("单据编号") , "s", "P", "", "Ts","");
		 if(oband.RecordCount()==0) oband.Query();		 
		 var spnode = oUnitItem.getBandByItemName("edit").getFldStrValue("当前状态");
		 if(spnode=="") spnode = ToolUtil.getParamValue(xmldoc,"startnode","P","","Ts");
	  	 var strTabhead = '<table id="tbopinion" style="width:100%;height:100%; border-collapse:collapse" border="1" cellspacing="0" '
	  	 +'cellpadding="0" bordercolorlight="#000" bordercolordark="#000"><tbody>'
	  	 +'<tr><td width="40" align="center" height="40">序号</td><td width="120" align="center">审批环节</td>'
			+'<td align="center" >审批意见</td><td style="padding:10px" align="center" width="200px">审批日志</td></tr>';	 	 
		 var strTabend  ='</tbody></table>';
	 	 var strTabconts = new Array();
		 var str = "";
		 var winheight = 600;
         for(var i=0;i<oband.RecordCount();i++)
         {
	 	     strTabconts[0] = '<tr><td width="40"  align="center">';
	 	     strTabconts[1] = '</td><td width="120">';
	 	     strTabconts[2] = '</td><td height="100px" >';
	 	     strTabconts[3] = '</td><td valign="top" style="padding:10px" align="center" width="200px">';
	 	     strTabconts[4] = '</td></tr>';
		 	 var conts = new Array();
		 	 conts[0] = i+1;
		 	 conts[1] = oband.getFldStrValue("节点标题",i).replace("#","");
		 	 var err1= winheight-oband.RecordCount()*60;
		 	 if(err1>0)
		 	 var err = 60+(err1)/oband.RecordCount();
		 	 
		 	 var strtextarea = '<textarea style="width:100%;height:100%" disabled="true">';
		 	 var strname     = '<INPUT style="width:100; " type="text"  disabled="true" size="11" name="man" value="';
		 	 var strdt       = '<INPUT style="width:100; " type="text" disabled="true" size="11" name="dt"  value="';
		 	 var jbr = oband.getFldStrValue("经办人",i);
		 	 var dt = oband.getFldStrValue("时间",i);
 	         var strbtn = '【<a href="#" onclick="_input(\'同意！\')">同意</a>】【<a href="#" onclick="_input(\'不同意！\')">反对</a>】【<a href="#" onclick="_input(\'已备案！\')">备案</a>】';
		 	 if(spnode ==oband.getFldStrValue("节点",i))
		 	 {
                 strtextarea = '<textarea id="txtopion" onchange="_update(\'意见\')" style="width:100%;height:100%;color:#800000">';
                 strdt       = '<INPUT class="inputDate" onchange="_update(\'时间\')" style="width:100;color:#800000 " type="text" size="11" name="dt"  value="';
	 	         strTabconts[0] = '<tr><td width="40" align="center">';
	 	         strTabconts[1] = '</td><td width="120" style="font-weight: bold;color:#800000" align="center">';
	 	         strTabconts[2] = '</td><td height="100px" >';
	 	         strTabconts[3] = '</td><td valign="top" style="padding:10px" align="center" width="200px">';	 	         
	 	         strTabconts[4] = '</td></tr>';
	 	         var strbtn = '【<a href="#" onclick="_input(\'同意！\')">同意</a>】【<a href="#" onclick="_input(\'不同意！\')">反对</a>】【<a href="#" onclick="_input(\'已备案！\')">备案</a>】';
		 	     if(jbr=="") {oband.setFldStrValue(i,"经办人",GetUserName());jbr = GetUserName();}
		 	     if(dt=="")  {oband.setFldStrValue(i,"时间",new Date().toLocaleDateString());dt = new Date().toLocaleDateString();}
		 	     oband.setCurrentRow(i);
             }
		 	 conts[2] = strtextarea + oband.getFldStrValue("意见",i)+'</textarea>';
		 	 if(oband.getFldStrValue("节点标题",i).indexOf("#")<0)
		 	 {
		 	    conts[3] = '<span style="width:60; " >责任人：</span>'+strname + jbr+'" /><br />'
		 	 		  +'<span style="width:60; " >日　期：</span>'+strdt+ dt +'" />'
		 	 		  +'<br /><br /><br />'+strbtn;
		 	  }
		 	  else 
		 	  {
		 	    conts[3] = '<br />'
		 	 		  +'<span style="width:60; " >日　期：</span>'+strdt+ dt +'" />';
		 	  }
		 	 conts[4] = '';		 	 
			var strconts = "";
			for(var j=0;j<strTabconts.length;j++)
				strconts = strconts + strTabconts[j]+conts[j];
			str = str + strconts;
		}
		var strTable = strTabhead+str+strTabend;	
		DivID.innerHTML=strTable ;
		if(document.getElementById("txtopion"))
		    document.getElementById("txtopion").focus();
	  }
        
    function tree_nodechange(node)
    {
        if(document.locktree)
            if(document.locktree==1) return; 
        if(node.Text.indexOf("[+] ")<0) return;
	    if(!node.ParentTreeView.Tree.NoExpand) retrun;
        var nodes = node.ParentTreeView.Tree.Band.XmlLandData.XMLDocument.documentElement.selectNodes('*['+node.ParentTreeView.Tree.PIDField+'/text()[.="'+node.ID+'"]]');
        node.set_text(node.Text.replace("[+] ",""));
        var nodeFirst = node;    
        for(var i=0;i<nodes.length;i++)
        {
            if(!nodeFirst)
                nodeFirst = node.ParentTreeView.Tree.bindTree(nodes[i]);
            else
                node.ParentTreeView.Tree.bindTree(nodes[i]);
        }
       node.ParentTreeView.Tree.WebTree.Render();
       node.ParentTreeView.Tree.WebTree.ExpandAll();	
    }
    function ws_nodeAdd(pitem,itemname,itemId,addnext,proot)
    {
        var mband = document.UnitItem.getBandByItemName(pitem);
        if(mband.RecordCount()==0)
        {
            alert("请先增添货品后再定义物料结构！");
            return;
        }
        oband=document.UnitItem.getBandByItemName(itemname);
        TreeUtil.addNode(itemId,addnext,proot);				
        node=oband.Tree.WebTree.SelectedNode;
    }
    
    
function ws_editbill(item)
{
    //var rtn = window.showModalDialog("记帐凭证HTM.html","","dialogHeight: 500px; dialogWidth: 803px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
    //return;
    if(!item) item = "nav";
    GridUtil.usOnCellRFocusHandle();
    var band=document.UnitItem.getBandByItemName(item);
    if(band.getFldStrValue("审批事项")=="凭证审批" && band.getFldStrValue("当前状态")=="审核"){
        usGetTopFrame().OpenItemURL("凭证审核","日期",band.getFldStrValue("收件日期"));return;}
    var openitem = band.getFldStrValue("启动项目");
    if(openitem=="")
        openitem = band.getFldStrValue("查阅项目");
    if(openitem == "") openitem = "edit";
    var xmldoc = document.UnitItem.ParamXmldoc;
    ToolUtil.setParamValue(xmldoc, "起草", "0", "s", "P", "", "Ts","");
	band.setModalContent(openitem);
//	band.Query();
}
