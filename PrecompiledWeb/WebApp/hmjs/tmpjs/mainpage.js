
function BandRefresh()
{
    var myUnitItem=document.UnitItem;
    myUnitItem.Query();
}
function fnAdjustLocalToolbar()
{ 
    window.setInterval(usConnServer,300000);
	var myUnitItem=new UnitItem();
    //this.document.title = myUnitItem.UnitName;
	for(var i=0;document.GridList && i<document.GridList.length;i++)
	{
		if(document.GridList[i].GridDiv)
			document.GridList[i].GridDiv.Grid.dataBindRefresh();
	}
	for(var i=0;document.TreeList && i<document.TreeList.length;i++)
	{
	    if(document.TreeList[i].WebTree)
	        document.TreeList[i].WebTree.Tree.dataBindRefresh();
	}
	myUnitItem.getState();
	if(typeof(initWin)=="function")	initWin();
    window.setInterval(BandRefresh,1800000);
	try { 
		var oSeparatorNode = document.all("msviHomePageLink").parentNode.childNodes(1).childNodes(0);
		if(typeof(oSeparatorNode) == "object"){
			oSeparatorNode.style.display = "none";
			document.all("msviHomePageLink").style.display = "none";
		}	
	}
	catch(e){}	   
}
window.onload=fnAdjustLocalToolbar;
var doImage = doImage;
var TType = TType;

function mhHover(tbl, idx, cls)
{
	var t, d;
	if (document.getElementById)
		t = document.getElementById(tbl);
	else
		t = document.all(tbl);
	if (t == null) return;
	if (t.getElementsByTagName)
		d = t.getElementsByTagName("td");
	else
		d = t.all.tags("td");
	if (d == null) return;
	if (d.length <= idx) return;
	d[idx].className = cls;
}

function setMSResearch() {
  var time = new Date();
  if( document.cookie.indexOf( 'msresearch=1 ') == -1 ) {
    document.cookie = 'msresearch=' + time.getTime() + ':' + escape( document.location) + ':' + escape( document.referrer) + '; path=/; domain=.microsoft.com; ';
  }
}

function footerjs(doc)
{
	if (doImage == null)
	{
		var tt = TType == null ? "PV" : TType;
		doc.write('<layer visibility="hide"><div style="display:none"></div></layer>');
	}

	if( ( document.cookie.indexOf( 'msresearch=1 ') == -1 ) 
	 && ( document.cookie.indexOf( 'msresearch=')   != -1 ) ) {
	  setInterval( "setMSResearch()", 1000 );
	}
}
