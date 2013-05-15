    function initWin()
    {
        if($U().Rights!="全部"){
            $("supplier").value=$SP("DeptName");
            $("supplier").tag="@主代码="+$SP("DeptCode");
            $("supplier").disabled=true; $("supplier").nextSibling.disabled=true;
        }
        $loading("none"); 
    }

function cmdnav(icase)
{
    switch(icase)
    {
        case 2: break;
        case 3: 
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
                    n = i + icase;
                    break;
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

function clipdata()
{
    $("txtCertCode").value = window.clipboardData.getData("Text");
}