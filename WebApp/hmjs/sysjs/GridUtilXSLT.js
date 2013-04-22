// JScript source code
//GridUtil分为两个文件组成:GridUtilXSLT.js 和 GridUtilFun.js

if(!GridUtil)
{
    function GridUtil(){};
    GridUtil=GridUtil.prototype;
}
//汇总Grid
GridUtil.getXslSumHTML=function()
{	
	var xslSumHTML='<XML id="_xslsum"> '
		+'	<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" > '
		+'		<xsl:template match="/"> '
		+'			<xsl:for-each select="*">  '
		+'				<xsl:element name="{name()}"> '
		+'					<xsl:for-each select="*[position()=1]"> '
		+'			            <xsl:variable name="rowcount" select="count(/*/*)"/> '
		+'						<xsl:element name="{name()}"> '
		+'							<xsl:call-template name="tempsum"> '
		+'								<xsl:with-param name="colname">第一季</xsl:with-param> '
		+'							</xsl:call-template> '
		+'							<xsl:call-template name="tempsumother"> '
		+'								<xsl:with-param name="colname">第一季</xsl:with-param> '
		+'								<xsl:with-param name="suffix" select="\'&#10;\'" /> '
		+'								<xsl:with-param name="index" select="1" /> '
		+'								<xsl:with-param name="rowcount" select="$rowcount" /> '
		+'								<xsl:with-param name="sumvalue" select="0" /> '
		+'							</xsl:call-template> '
		+'						</xsl:element> '
		+'					</xsl:for-each> '
		+'				</xsl:element>  '
		+'			</xsl:for-each>  '
		+'		</xsl:template>  '
		+'		<xsl:template name="tempsum"> '
		+'			<xsl:param name="colname"/> '
		+'			<xsl:element name="{$colname}"> '
		+'				<xsl:value-of select="sum(/*/*/*[name()=$colname and text()!=\'\'])"/> '
		+'			</xsl:element> '
		+'		</xsl:template> '
	    +'		<xsl:template name="tempsumother"> '
		+'		    <xsl:param name="colname"/> '
		+'		    <xsl:param name="suffix"/> '
		+'		    <xsl:param name="index" /> '
		+'		    <xsl:param name="rowcount"/> '
		+'		    <xsl:param name="sumvalue"/> '
		+'		    <xsl:variable name="valtxt" select="/*/*[$index]/*[name()=$colname]/text()" /> '
		+'			<xsl:variable name="val" select="number(substring-before($valtxt,$suffix))" /> '
		+'			<xsl:variable name="valnum" select="number($valtxt)" /> '
		+'		    <xsl:choose> '
		+'		        <xsl:when test="$index &gt;= $rowcount"> '
		+'			        <xsl:choose> '
		+'			            <xsl:when test="\'NaN\'!=string($valnum)"> '
		+'                          <xsl:element name="{$colname}"> '
		+'				                <xsl:value-of select="$sumvalue + $valnum"/> '
		+'		                    </xsl:element> '
		+'			            </xsl:when> '
		+'			            <xsl:when test="\'NaN\'=string($val)"> '
		+'                          <xsl:element name="{$colname}"> '
		+'				                <xsl:value-of select="$sumvalue"/> '
		+'		                    </xsl:element> '
		+'			            </xsl:when> '
		+'			            <xsl:otherwise> '
		+'                          <xsl:element name="{$colname}"> '
		+'				                <xsl:value-of select="$sumvalue + $val"/> '
		+'		                    </xsl:element> '
		+'			            </xsl:otherwise> '
		+'			        </xsl:choose> '
		+'		        </xsl:when> '
		+'		        <xsl:otherwise> '
		+'			        <xsl:choose> '
		+'				        <xsl:when test="\'NaN\'!=string($valnum)"> '
		+'					        <xsl:call-template name="tempsumother"> '
		+'					           <xsl:with-param name="colname" select="$colname" /> '
		+'						        <xsl:with-param name="suffix" select="$suffix" /> '
		+'					           <xsl:with-param name="index" select="$index + 1" /> '
		+'						       <xsl:with-param name="rowcount" select="$rowcount" /> '
		+'						       <xsl:with-param name="sumvalue" select="$sumvalue + $valnum" /> '
		+'					        </xsl:call-template> '
		+'				        </xsl:when> '
		+'				        <xsl:when test="\'NaN\'=string($val)"> '
		+'					        <xsl:call-template name="tempsumother"> '
		+'					           <xsl:with-param name="colname" select="$colname" /> '
		+'						        <xsl:with-param name="suffix" select="$suffix" /> '
		+'					           <xsl:with-param name="index" select="$index + 1" /> '
		+'						       <xsl:with-param name="rowcount" select="$rowcount" /> '
		+'						       <xsl:with-param name="sumvalue" select="$sumvalue" /> '
		+'					        </xsl:call-template> '
		+'				        </xsl:when> '
		+'				        <xsl:otherwise> '
		+'					        <xsl:call-template name="tempsumother"> '
		+'						        <xsl:with-param name="colname" select="$colname" /> '
		+'						        <xsl:with-param name="suffix" select="$suffix" /> '
		+'						        <xsl:with-param name="index" select="$index + 1" /> '
		+'						        <xsl:with-param name="rowcount" select="$rowcount" /> '
		+'						        <xsl:with-param name="sumvalue" select="$sumvalue + $val" /> '
		+'					        </xsl:call-template> '
		+'				        </xsl:otherwise> '
		+'			        </xsl:choose> '
		+'		        </xsl:otherwise> '
		+'		    </xsl:choose> '
	    +'		</xsl:template> '
		+'	</xsl:stylesheet> '
		+'</XML> ';
	return xslSumHTML;
}


GridUtil.getGridTpHTML=function()
{
	var tpGridHTML=
			 "<table > "
			+"<tr><td divtype=body > "
			+"<div divtype=title align=left style=OVERFLOW:hidden;> "
			+"<table tabType=title class=tabTitle cellpadding=0 cellSpacing=0 style=DISPLAY:block; width=796> "
			+"	<thead> "
			+"		<tr rowType=title > "
			+"			<td tdType=coltitle class=thTitle width=120 onmousemove=GridUtil.usOnTitMouseMove() onmouseup=GridUtil.usOnTitMouseUp()> "
			+"				<span width=100% height=100% colname='' >列标题</span> "
			+"			</td>"
			+"		</tr> "
			+"</thead></table> "
			+"</div><div divtype=detail style=OVERFLOW-X:auto;OVERFLOW-X:scroll; onscroll=this.previousSibling.scrollLeft=this.scrollLeft > "
			+"<table tabType=detail class=tabDetail cellpadding=0 cellSpacing=0 width=780> "
			+"	<thead> "
			+"		<tr rowType=edit style=display:none > "
			+"			<td datatype=string class=tdDetail ><input style=width:100%;height:100%; type=text colname='' class=gridbrowse readonly optype=browse><input style=width:100%;height:100%;display:none type=text colname='' class=gridinput optype=edit></td> "
			+"			<td datatype=date class=tdDetail><input style=width:100%;height:100%; type=text colname='' class=gridbrowse readonly optype=browse><input style=width:100%;height:100%;display:none; type=text colname='' class=griddate optype=edit></td> "
			+"			<td datatype=int class=tdDetail><input style=width:100%;height:100%; type=text colname='' class=gridbrowse readonly optype=browse><input style=width:100%;height:100%;display:none; type=text colname='' class=gridinput optype=edit></td> "
			+"			<td datatype=decimal class=tdDetail><input style=width:100%;height:100%; type=text name='dispdec' class=gridbrowse readonly optype=browse><input style=width:100%;height:100%;display:none; type=text name='dispdec' colname='' class=gridinput optype=edit></td> "
			+"			<td datatype=select class=tdDetail><input style=width:100%;height:100%; type=text name=dict readonly optype=browse class=gridbrowse> "
			+"				<select style=width:100%;height:100%;display:none name=dict colname='' optype=edit DataSource=testsel DataTextField=第一季 DataValueField=年份 class=gridselect onchange='return GridUtil.usOnCellChangeHandle();'></select> "
			+"			</td> "
			+"		</tr> "
			+"		<tr rowType=readonly style=display:none > "
			+"			<td datatype=string class=tdDetail><input width=100% height=100% type=text colname='' readonly ></td> "
			+"			<td datatype=date class=tdDetail><input width=100% height=100% type=text colname='' readonly ></td> "
			+"			<td datatype=int class=tdDetail><input width=100% height=100% type=text colname='' readonly ></td> "
			+"			<td datatype=decimal class=tdDetail><input width=100% height=100% type=text colname='' readonly ></td> "
			+"			<td datatype=select class=tdDetail><input style=width:100%;height:100%; type=text name=dict readonly optype=browse > "
			+"				<select style=width:100%;height:100%;display:none name=dict colname='' optype=edit DataSource=testsel DataTextField=第一季 DataValueField=年份 ></select> "
			+"			</td> "
			+"		</tr> "
			+"	</thead> "
			+"	<tr rowType=detail> "
			+"		<td tdType=coldata ><span width=100% height=100%>明细数据</span></td> "
			+"	</tr> "
			+"</table> "
			+"<table tabType=foot class=tabFoot cellpadding=0 cellSpacing=0 width=780 > "
			+"	<tr rowType=foot> "
			+"		<td tdType=coldata class=tdFoot><span width=100% height=100% name='sumfoot' >&nbsp;</span><input style=display:none; name='sumfoot' width=100% height=100% type=text colname='' ></td> "
			+"	</tr> "
			+"</table> "
			+"</div> "
			+"</td></tr></table> ";
	return tpGridHTML;
}


//针对Grid的数据岛操作的XSLT的XML文档岛
//排序
GridUtil.getXslSortHTML=function()
{	
	var xslSortHTML='<XML id="_xslsort"> '
		+'	<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" > '
		+'		<xsl:template match="/"> '
		+'			<xsl:for-each select="*"> '
		+'				<xsl:element name="{name()}"> '
		+'					<xsl:for-each select="*"> '
		+'						<xsl:sort select="第三季" data-type="number" order="ascending" /> '
		+'						<xsl:copy-of select="."></xsl:copy-of> '
		+'					</xsl:for-each> '
		+'				</xsl:element> '
		+'			</xsl:for-each> '
		+'		</xsl:template> '
		+'	</xsl:stylesheet> '
		+'</XML> ';
	return xslSortHTML;
}

if(!GridUtil.XSLLandSum && document.body)
{
	var xsldiv=document.createElement("DIV");
	document.body.appendChild(xsldiv);
	xsldiv.innerHTML=GridUtil.getXslSumHTML();
	xsldiv.style.display="none";
	GridUtil.XSLLandSum=xsldiv.firstChild;
}

//进行模板转换的样式数据岛
if(!GridUtil.XSLLandSort  && document.body)
{
	var xsldiv=document.createElement("DIV");
	document.body.appendChild(xsldiv);
	xsldiv.innerHTML=GridUtil.getXslSortHTML();
	xsldiv.style.display="none";
	GridUtil.XSLLandSort=xsldiv.firstChild;
}

//延时
/*
GridUtil.sleep=function(numberMillis)
{
    return;
  var dialogScript = "window.setTimeout( function () { window.opener=null;window.open('', '_self');window.close(); }, " + numberMillis + ");"; 
  var result = window.showModalDialog("javascript:document.writeln( '<script>" + dialogScript + "<"+"/script>')",null,'dialogHeight: 0px; dialogWidth: 0px; dialogTop: 0px; dialogLeft: 0px; edge: Raised; center: No; help: No; resizable: No; status: No;'); 
}
*/

 GridUtil.sleep=function(num)     
 {
      var   tempDate=new   Date();   
      var   tempStr="";   
      var   theXmlHttp;
      try{ 
            if(window.XMLHttpRequest) 
            { 
                //IE7,mozilla 
                theXmlHttp=new XMLHttpRequest(); 
            } 
            else 
            { 
                  //IE6,I5 
                  try 
                  { 
                    theXmlHttp=new ActiveXObject( "Microsoft.XMLHTTP"); 
                  } 
                  catch(e) 
                  { 
                      theXmlHttp=new   ActiveXObject( "Msxml2.XMLHTTP ");             
                  } 
            } 
        } 
        catch(e) 
        { 
              alert( "对不起你的浏览器不支持XMLHTTP,原因 "+e.description+ "   请启用ActiveX或升级 "); 
        } 
      while((new   Date()-tempDate)<num   )   
      {   
      tempStr+="\n"+(new   Date()-tempDate);   
      try{   
      theXmlHttp   .open(   "get",   "about:blank?JK="+Math.random(),   false   );   
      theXmlHttp   .send();   
      }   
      catch(e){;}   
      }   
      return;   
 }     


function Sleep(obj,iMinSecond) 
 {  
  if (window.eventList==null)  
  window.eventList=new Array();  
  var ind=-1; 
  for (var i=0;i<window.eventList.length;i++) 
  {   
   if (window.eventList[i]==null)  
   {  
    window.eventList[i]=obj;    
    ind=i;   
    break;   
   }  
  }  
  if (ind==-1) 
  {   
   ind=window.eventList.length;   
   window.eventList[ind]=obj; 
  }  
  setTimeout("GoOn(" + ind + ")",iMinSecond); 
 } 
 function GoOn(ind) 
 {  
  var obj=window.eventList[ind]; 
  window.eventList[ind]=null; 
  if (obj.NextStep) obj.NextStep(); 
  else obj(); 
 } 



document.write("<div id=meizzCalendarLayer style='position: absolute; z-index: 9999; width: 184px; height: 170px; display: none'>");
document.write("<iframe name=meizzCalendarIframe scrolling=no frameborder=0 width=100% height=100%></iframe></div>");
//加载文件
GridUtil.ExistJs=function(filename)
{
    switch(filename)
    {
        case "ToolUtil.js":
            if("object"==typeof(ToolUtil))
                return true;
            break;
        case "GridUtilAdv.js":
            if("function"==typeof(GridUtil.usOnLoadExtentJs))
                return true;
            break;
        case "usUnitAdv.js":
            if("function"==typeof(UnitItem.prototype.usOnLoadExtentJs))
                return true;
            break;
        case "usBandAdv.js":
            if("function"==typeof(Band.prototype.RegisterSynBand))
                return true;
            break;
        case "usCommonAdv.js":
            if("function"==typeof(ExeCtrlPostCmd))
                return true;
            break;
        case "usXmlLandCal.js":
            if("function"==typeof(XmlLandCal))
                return true;
            break;
        case "usValidation.js":
            if("object"==typeof(ValidatUtil))
                return true;
            break;
        case "usGridLand.js":
            if("function"==typeof(Grid) && "function"==typeof(Grid.prototype.usOnLoadExtentJs))
                return true;
            break;
        case "usTreeLand.js":
            if("function"==typeof(Tree) && "function"==typeof(Tree.prototype.usOnLoadExtentJs))
                return true;
            break;
        case "usChartLand.js":
            if("function"==typeof(Chart) && "function"==typeof(Chart.prototype.usOnLoadExtentJs))
                return true;
            break;
        case "Calendar30.js":
            if("function"==typeof(WebCalendar))
                return true;
            break;
        default:
            return false;
    }
    return false;
}
GridUtil.Loadjs=function(filename)
{
    if(GridUtil.ExistJs(filename))
        return;
    var host_url='http://'+window.location.host+'/';
    var appname = window.location.pathname.substring(1,window.location.pathname.substring(1,window.location.pathname.length).indexOf("/")+1);
    host_url = host_url + appname+'/'        
    var strPath=host_url+"hmjs/sysjs/";
    for(var i=0;i<document.scripts.length;i++)
    {
        if(!document.scripts[i].src)
            continue;
        strPath=document.scripts[i].src;
        strPath=strPath.substr(0,strPath.lastIndexOf("/")+1);
        break;
    }
    GridUtil.FileLoaded=null;
    var head = document.getElementsByTagName('HEAD').item(0);
    var script = document.createElement('SCRIPT');
    script.src = strPath+filename;
    script.type = "text/javascript";
    script.setAttribute("charset","gb2312");
    head.appendChild(script);
    var icount=0;
    while( !GridUtil.FileLoaded && icount++<40 )
        GridUtil.sleep(20);
}
GridUtil.ToolUtilJs="ToolUtil.js";
GridUtil.GridUtilBas="GridUtilBase.js";
GridUtil.GridUtilAdv="GridUtilAdv.js";
GridUtil.UnitAdv="usUnitAdv.js";
GridUtil.BandAdv="usBandAdv.js";
GridUtil.CommAdv="usCommonAdv.js";
GridUtil.XmlLandCal="usXmlLandCal.js";
GridUtil.Validation="usValidation.js";
GridUtil.Calendar30="Calendar30.js";
GridUtil.GridLand="usGridLand.js";
GridUtil.TreeLand="usTreeLand.js";
GridUtil.ChartLand="usGraphLand.js";
GridUtil.ChartAxis="usGraphAxis.js";
