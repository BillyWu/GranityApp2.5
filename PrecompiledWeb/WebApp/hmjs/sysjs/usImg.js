   function upload(ItemName,imgField)
    {
        var valueRtn=window.showModalDialog("UploadPIC.htm",null,"dialogWidth:600px;dialogHeight:300px;center: yes;help:no; resizable:yes;status:no;");
        if(!valueRtn){alert("未上传成功！");return;}
        var oband=$band(ItemName);
        oband.setFldStrValue(null,imgField,base_name(valueRtn));
        updatefields(oband);
    }
    function updatefields(tband)
    {
        var colList=tband.XmlSchema.XMLDocument.selectNodes("//xs:element");
        for(var i=0;i<colList.length;i++)
        {
            var columnName=colList[i].getAttribute("name");
            var inputCtrlID=tband.key+":"+columnName;
            var oinput=document.getElementById(inputCtrlID);
            if(!oinput || !oinput.className)	continue;
            var strvalue=tband.getFldStrValue(columnName);
            //上传文件及图片的字段;id=bandName+":"+columnName
            if( !oinput.dataSrc || !oinput.dataFld || ""==oinput.dataSrc || ""==oinput.dataFld)
            {
	            if(oinput.className.toLowerCase()=="xlandfile")
	            {
		            if(oinput.tagName=="DIV")
			            setfile(inputCtrlID,strvalue);
		            if(oinput.type=="file")
		            {
			            var parentCtrl=oinput.parentElement;
			            setfile(parentCtrl.id,strvalue);
		            }
		            continue;
	            }
	            if(oinput.className.toLowerCase()=="xlandimg" && oinput.tagName=="IMG")
	            {
                    if(strvalue!="")
                    {
                        var _src = "../wfimg.aspx?img="+strvalue+"&size="+oinput.tag;
                        var s = (new   Date()).toString();
                        oinput.resized=true;
                        oinput.src=_src + "?"+ s;
                    }
                    else 
                    {
                        oinput.src="images//Floppy.gif";
                    }
		            continue;
	            }
            }
        }                
    }     
    function base_name(pFilePath){
        var temp_win = pFilePath.lastIndexOf("\\");
        var temp_unix = pFilePath.lastIndexOf("/");
        if (temp_win>0)
        {
            temp = temp_win;
        }
        else if (temp_unix>0)
        {
            temp = temp_unix;
        }
        else
        {
            temp = -1;    
        }
        file_name = pFilePath.substr(temp+1);
        return(file_name);
    } 