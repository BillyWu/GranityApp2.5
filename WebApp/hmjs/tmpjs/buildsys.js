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
		ToolUtil.setParamValue(xmldoc, "����", band.getFldStrValue("����"), "", "B", bandc.ItemName, "C","D"); 
    	bandc.Query();
    	if(bandc.RecordCount()>0) {alert("�������Ѵ���,�������������!");	return;}
   	}
	
	if(band.getFldStrValue("����")==band.getFldStrValue("ȷ������"))
	{
	   	if(!ue_save()) return;
		var result=confirm(" �Ƿ���������ע��  ��     ");
		if(result) parent.location.href="index.htm";
	}
	else
		alert("�������,����!");
}

function _chkname()
{
	var band=document.UnitItem.getBandByItemName('nav');
	if(band.getFldStrValue("����")=="") return false;
    var bandc = document.UnitItem.getBandByItemName('check');
    if(bandc) 
    {
		var xmldoc=document.UnitItem.ParamXmldoc;
		ToolUtil.setParamValue(xmldoc, "����", band.getFldStrValue("����"), "", "B", bandc.ItemName, "C","D"); 
		ToolUtil.setParamValue(xmldoc, "����", band.getFldStrValue("����"), "", "B", bandc.ItemName, "C","D"); 
    	bandc.Query();
    	if(bandc.RecordCount()>0) {alert("�������Ѵ���,�������������!");	return false;}
    	else
    		alert("��ϲ�����ʹ�ø�������!")
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
    if(ctrlsrc.value=="����") document.getElementById("bktype").disabled=false;
    else document.getElementById("bktype").disabled=true;
}
function _save()
{
    var band=document.UnitItem.getBandByItemName("nav");
    var userkey = band.getFldStrValue("����");
    var dbname = band.getFldStrValue("���ݿ�����");
    var dbsvr = band.getFldStrValue("����������");
    var dbuser = band.getFldStrValue("userid");
    var dbpwd = band.getFldStrValue("pwd");
    var dbpath = $("dbpath").value;
    if(dbpath=="") {alert("���ݿ�·������Ϊ��!");$("dbpath").focus();return;}
    
    var userdb= band.getFldStrValue("bysys");
    setwebconfig(dbsvr,dbuser,dbpwd,userkey,dbname,dbpath);
    if(userdb==0)
    {
        var result = confirm("��δѡ��ϵͳȱʡ���ף��Ƿ����½����µ����ף�\r\n\r\n   [ȷ��] - ϵͳ���������״��뽨���µ�����\r\n   [ȡ��] - ����ʹ��ϵͳ�ṩ�����ס�");
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
        alert("���óɹ���");
    }
}

