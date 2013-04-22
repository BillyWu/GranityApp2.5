function initWin()
{
	var band=document.UnitItem.getBandByItemName('nav');
	band.XQuery();
	ms_iniData(band);
	if(band.RecordCount()<1) band.NewRecord();
}
function btnShowReg()
{
	document.getElementById("tbnode").style.display="none";
	document.getElementById("tbreg").style.display="";
}

function btnShownotice()
{
	document.getElementById("tbnode").style.display="";
	document.getElementById("tbreg").style.display="none";
}

function _submit()
{
	var band=document.UnitItem.getBandByItemName('nav');
    var bandc = document.UnitItem.getBandByItemName('check');
    if(bandc) 
    {
		var xmldoc=document.UnitItem.ParamXmldoc;
		ToolUtil.setParamValue(xmldoc, "编码", band.getFldStrValue("编码"), "", "B", bandc.ItemName, "C","D"); 
    	bandc.Query();
    	if(bandc.RecordCount()>0) {alert("该帐套已存在,请更换帐套名称!");	return;}
   	}
	
	if(band.getFldStrValue("密码")==band.getFldStrValue("确认密码"))
	{
	   	if(!ue_save()) return;
		var result=confirm(" 是否立即进行注册  ？     ");
		if(result) parent.location.href="index.htm";
	}
	else
		alert("密码错误,请检查!");
}

function _chkname()
{
	var band=document.UnitItem.getBandByItemName('nav');
	if(band.getFldStrValue("编码")=="") return false;
    var bandc = document.UnitItem.getBandByItemName('check');
    if(bandc) 
    {
		var xmldoc=document.UnitItem.ParamXmldoc;
		ToolUtil.setParamValue(xmldoc, "编码", band.getFldStrValue("编码"), "", "B", bandc.ItemName, "C","D"); 
		ToolUtil.setParamValue(xmldoc, "名称", band.getFldStrValue("名称"), "", "B", bandc.ItemName, "C","D"); 
    	bandc.Query();
    	if(bandc.RecordCount()>0) {alert("该帐套已存在,请更换帐套名称!");	return false;}
    	else
    		alert("恭喜你可以使用该帐套名!")
   	}
}
function cmdnav(icase)
{
    //if(!_chkname()) return;
    switch(icase)
    {
        case 2: _save();break;
        case 3: 
            //ue_saveXml();
            ms_close();
            break;
        default:
            var otable = document.getElementById("tbmain");
            if(!otable) return;
	        var n=0;
            for(i=0;i<otable.tBodies.length;i++)
            {
              if(otable.tBodies[i].style.display=="block" || otable.tBodies[i].style.display=="") 
               {
                    n=i + icase;break;
               }
            }
            ms_showBoard(otable,n)  
            for(var i=0;i<4;i++) document.getElementById("td"+i).style.fontWeight="";
            document.getElementById("td"+n).style.fontWeight="bold";
            document.getElementById("timg").src="images/img"+n+".gif"
    }
}
function ms_showBoard(otable,n) {
	if(!otable.tBodies[n]) return;
    for(i=0;i<otable.tBodies.length;i++)
      otable.tBodies[i].style.display="none";
    otable.tBodies[n].style.display="block";
}
function editchk(item)
{
    var ctrlsrc=event.srcElement;
    var band=document.UnitItem.getBandByItemName(item);
    band.setFldStrValue(null,ctrlsrc.name,ctrlsrc.value);
   	var chk=document.getElementsByName(ctrlsrc.name);
    for(var i=0;i<chk.length;i++)
	    if(chk[i].parentElement.nextSibling) chk[i].parentElement.nextSibling.style.fontWeight="";
    if(ctrlsrc.parentElement.nextSibling) ctrlsrc.parentElement.nextSibling.style.fontWeight="bold";
    if(ctrlsrc.value=="天数") document.getElementById("bktype").disabled=false;
    else document.getElementById("bktype").disabled=true;
}
function _save()
{
    var band=document.UnitItem.getBandByItemName("nav");
    var userkey = band.getFldStrValue("编码");
    var dbname = band.getFldStrValue("数据库名称");
    var dbsvr = band.getFldStrValue("服务器名称");
    var dbuser = band.getFldStrValue("userid");
    var dbpwd = band.getFldStrValue("pwd");
    var dbpath = $("dbpath").value;
    if(dbpath=="") {alert("数据库路径不能为空!");$("dbpath").focus();return;}
    
    var userdb= band.getFldStrValue("bysys");
    setwebconfig(dbsvr,dbuser,dbpwd,userkey,dbname,dbpath);
    if(userdb==0)
    {
        var result = confirm("您未选择系统缺省帐套，是否重新建立新的帐套？\r\n\r\n   [确定] - 系统将根据帐套代码建立新的帐套\r\n   [取消] - 继续使用系统提供的帐套。");
        if(!result) band.setFldStrValue(null,"bysys",1);
    }
    ue_save();
}
function setwebconfig(dbsvr,dbuser,dbpwd,userkey,dbname,dbpath)
{
    var xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
    var ls_path=getpath();
    ls_path=ls_path.substr(0,ls_path.lastIndexOf("/")+1);
    url="webtools.aspx?userkey="+userkey+"&dbname="+dbname+"&dbpath="+dbpath+"&dbsvr="+dbsvr+"&dbuser="+dbuser+"&dbpwd="+dbpwd;
    try
    {
        xmlhttp.open("POST",ls_path+url, false);
        xmlhttp.responseText = xmlhttp.send(null);            
    }
    catch(ex){}    
    if(xmlhttp.responseText=="ok")
    {
        alert("设置成功！");
    }
}

