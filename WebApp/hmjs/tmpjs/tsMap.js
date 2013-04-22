//-----------------
// 字长为4,长度为24,角度为3     
//
//-----------------
var roff=24;

function init()
{
    if(!parent.document.UnitItem)
        return;
    document.IsLoaded=true;
	document.body.style.cursor = "default";
	with (document.body) 
	{
		onclick = "";
		ondblclick = "";
		onmouseup = "";
		oncontextmenu = "";
		onbeforeprint = "";
		onafterprint = "";
		onmousemove = "";
		onkeydown = "";
	}
	createHint();
}

function createHint()
{
    var band=parent.document.UnitItem.Bands[0];
    if(!band)   return;
    var rowcount=band.RecordCount();
    var xmlColList=band.XmlSchema.XMLDocument.selectNodes("//xs:element[@name and @bartitle]");
    for(var i=0;i<rowcount;i++)
    {
        var addressName=band.getFldStrValue("地名",i);
        var refAdd=document.getElementById(addressName);
        if(!refAdd || ""==refAdd)   
        {
            if(document.getElementById(addressName+'text'))
            {
		            if(band.getFldStrValue("销量",i)!="")
		            {
	                    var olinetext = document.getElementById(addressName+"text");
                        for(var iw=0;iw<olinetext.all.length;iw++)
                        {
                            if(olinetext.all[iw].tagName=="textpath")
                            {
    		                    olinetext.all[iw].string = band.getFldStrValue("销量",i);
    		                }
                        }
		            }
            
            }
            
            if(document.getElementById(addressName+'text1'))
            {
		            if(band.getFldStrValue("销量1",i)!="")
		            {
	                    var olinetext = document.getElementById(addressName+"text");
                        for(var iw=0;iw<olinetext.all.length;iw++)
                        {
                            if(olinetext.all[iw].tagName=="textpath")
                            {
    		                    olinetext.all[iw].string = band.getFldStrValue("销量1",i);
    		                }
                        }
		            }
            
            }
            
            
            continue;
        }
        if(document.getElementById(refAdd.id+"d"))
            document.getElementById(refAdd.id+"d").style.display="none";        
        refAdd.style.cursor="hand";
        var xmlCol=band.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='指标']");
		var bartitle  = xmlCol.getAttribute("bartitle");
		bartitle = bartitle.replace("tfldname",addressName);
		bartitle = bartitle.replace("fldname","指标");
		
		bartitle = bartitle.replace("fldval",band.getFldStrValue("指标",i));
		//bartitle = bartitle.replace("<br>","&#10;&#13;");
		bartitle = bartitle.replace(/ hnh /ig,"<br>")
		bartitle = bartitle.replace(/hnh/ig,"<br>")
		bartitle = bartitle.replace(/<br><br>/ig,"")
		var xstate = band.getFldStrValue("故障",i);
		var strimg = band.getFldStrValue("img",i);
		if(refAdd.mtype!="frame")
		{
            refAdd.itemcolor=refAdd.fillcolor;
            refAdd.fillcolor=band.getFldStrValue("fillcolor",i);
            refAdd.strokecolor=band.getFldStrValue("strokecolor",i);
            for(var iw=0;iw<document.getElementById(refAdd.id).all.length;iw++)
            {
                if(document.getElementById(refAdd.id).all[iw].tagName=="extrusion")
                    document.getElementById(refAdd.id).all[iw].color.value=band.getFldStrValue("extrusioncolor",i); 
                else
                    document.getElementById(refAdd.id).all[iw].color2.value=band.getFldStrValue("fillcolor2",i);
            }
            refAdd.title=bartitle;
            var xleft = parseInt(refAdd.style.posLeft) + parseInt(band.getFldStrValue("imgx",i));
	        var xtop  = parseInt(refAdd.style.posTop)  + parseInt(band.getFldStrValue("imgy",i));
	        var hsize  = band.getFldStrValue("imgwidth",i);
	        var vsize  = band.getFldStrValue("imgheight",i);
	        var obj_zIndex = refAdd.style.zIndex+300;
	        
            if(strimg!="")
                create_run(xleft,xtop,hsize,vsize,obj_zIndex,refAdd.id,strimg);
            else
                create_remove(xleft-15,xtop,80,obj_zIndex,refAdd.id);
	    }
		
        refAdd.title=bartitle;
        var xleft = refAdd.style.posLeft + refAdd.style.posWidth/2 -20;
		var xtop  = refAdd.style.posTop + refAdd.style.posHeight;
		var obj_zIndex = refAdd.style.zIndex;
		var strhint=band.getFldStrValue("hint",i);
		// strhint=0  不显示文字量，strhint=1 显示在下端，strhint=2 原标签内容+显示，strhint=3 代替原标签内容
		
		switch(strhint)
		{
		    case "1":
		        create_text(band.getFldStrValue("销量",i),xleft-15,xtop,80,obj_zIndex,refAdd.id);
		        break;
		    case "2":
		            if(!refAdd.baktext)
		            {
		                if(document.getElementById(refAdd.id+"text"))
		                    refAdd.setAttribute("baktext",document.getElementById(refAdd.id+"text").innerText);
		                else
		                    refAdd.setAttribute("baktext",document.getElementById(refAdd.id).innerText);
		            }
		            if(band.getFldStrValue("销量",i)!="")
		            {
		                if(document.getElementById(refAdd.id+"text"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量",i);
                                    var xlen = str.len();
                                    //olinetext.to=xlen*6+",1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";
                                    olinetext.to="60,1"
                                    olinetext.style.rotation=-0.6;//-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量",i)+sp;
        		                }
                            }
		                }
   		            }

		            if(band.getFldStrValue("销量1",i)!="")
		            {
		                if(document.getElementById(refAdd.id+"text1"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text1");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量1",i);
                                    var xlen = str.len();
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";
                                    olinetext.to="60,1"
                                    //'35,1'
                                    olinetext.style.rotation=-0.6;//-1*xlen*6/roff;
                                    olinetext.all[iw].string = band.getFldStrValue("销量1",i)+sp;
        		                }
                            }
		                }
                    }
                    
 		            if(band.getFldStrValue("销量2",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text2"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text2");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量2",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量2",i)+sp;
        		                }
                            }
		                }
		             }

 		            if(band.getFldStrValue("销量3",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text3"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text3");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量3",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量3",i)+sp;
        		                }
                            }
		                }
		             }

 		            if(band.getFldStrValue("销量4",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text4"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text4");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量4",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量4",i)+sp;
        		                }
                            }
		                }
		             }

 		            if(band.getFldStrValue("销量5",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text5"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text5");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量5",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量5",i)+sp;
        		                }
                            }
		                }
		             }

 		            if(band.getFldStrValue("销量6",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text6"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text6");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量6",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量6",i)+sp;
        		                }
                            }
		                }
		             }

 		            if(band.getFldStrValue("销量7",i)!="")
		            {

		                if(document.getElementById(refAdd.id+"text7"))
		                {
		                    var olinetext = document.getElementById(refAdd.id+"text7");
                            for(var iw=0;iw<olinetext.all.length;iw++)
                            {
                                if(olinetext.all[iw].tagName=="textpath")
                                {
                                    var str = band.getFldStrValue("销量7",i);
                                    var xlen = str.len();
                                    olinetext.to="60,1"
                                    var sp="";
                                    if(xlen<10) 
                                        for(var mi=0;mi<10-xlen;mi++) sp=sp+" ";                                    
                                    olinetext.style.rotation=-0.6; //-1*xlen*6/roff;
        		                    olinetext.all[iw].string = band.getFldStrValue("销量7",i)+sp;
        		                }
                            }
		                }
		             }	            
		        break;
		    case "3":
                    if(document.getElementById(addressName))
                    {
                        if(band.getFldStrValue("方向",i)=="")
                        {
	                        if(band.getFldStrValue("状态",i)=="1")
	                        {
                                var ostate = document.getElementById(addressName);
                                ostate.strokecolor="red";
                                ostate.strokeweight="2pt"
                                //ostate.to.x = 0;
                                ostate.from="0,0.003pt";
	                        }
	                        else
	                        {
                                var ostate = document.getElementById(addressName);
                                ostate.strokecolor="#d3b7c4";
                                ostate.strokeweight="1pt"
                                ostate.from="-0.00065pt,0.003pt";
	                        }		                        
                        }
                        else
                        {
	                        if(band.getFldStrValue("状态",i)=="1")
	                        {
                                var ostate = document.getElementById(addressName);
                                ostate.strokecolor="red";
                                ostate.strokeweight="2pt"
                                ostate.to = "0.0041pt,0"
	                        }
	                        else
	                        {
                                var ostate = document.getElementById(addressName);
                                ostate.strokecolor="#d3b7c4";
                                ostate.strokeweight="1pt"
                                ostate.to="0.0041pt,-0.0013pt";
	                        }	                            
                        }
                    }			    
		    case "5":
		    
		            if(band.getFldStrValue("销量",i)!="")
		            {
		                if(!document.getElementById(refAdd.id+"td"))
		                {
	                        try
	                        {		                
		                        refAdd.children(0).children(0).children(0).children(0).children(0).align="left";
		                        refAdd.children(0).children(0).children(0).children(0).children(0).innerText =band.getFldStrValue("销量",i).replace(".00","");
                	        }
		                    catch(ex)
		                    {}
		                }
		                else
		                {
		                
		                    document.getElementById(refAdd.id+"td").innerText=band.getFldStrValue("销量",i).replace(".00","");
		                }
		            }
		        break;		        
		    default:
		        break;
		}
		 
    }
}

function create_text(val,vleft, vtop, vsize,obj_zIndex,objId)
{
	var grpObj = document.getElementById("group1");	
	var oshape;
	var oText;
	if(!document.getElementById(objId+"shape"))
	{
	    var oshape = grpObj.appendChild(document.createElement('<v:shape id='+objId+'shape'+' style="Z-INDEX:'+obj_zIndex+';LEFT:'+ vleft +'px;WIDTH:'+vsize+'px;TOP:'+ vtop +'px;HEIGHT:20px" inset="1px,1px,1px,1px" coordsize="1000,680"  filled="f" >'));
	    var oText = oshape.appendChild(document.createElement('<DIV id='+objId+'text'+' style="font-family: 宋体;FONT-SIZE: 9pt; CURSOR: hand; COLOR: black; TEXT-ALIGN: left">'));
 	}
 	else
 	    oText=document.getElementById(objId+"text")
 	if(val!="")	oText.innerText=val;
}

function create_run(vleft, vtop,hsize, vsize,obj_zIndex,objId,strimg)
{
	var grpObj = document.getElementById("group1");	
	if(!document.getElementById(objId+"run"))
	{
        grpObj.appendChild(document.createElement('<v:Image id='+objId+'run'+' style="Z-INDEX:'+obj_zIndex+';LEFT:'+vleft+';WIDTH:'+hsize+';TOP:'+vtop+';HEIGHT:'+vsize+'" src="'+strimg+'" bilevel="f"/>'))
    }
}

function create_remove(vleft, vtop, vsize,obj_zIndex,objId)
{
	var grpObj = document.getElementById("group1");	
	if(document.getElementById(objId+"run"))
	{
	    document.getElementById(objId+"run").style.display="none";
	    grpObj.removeChild(document.getElementById(objId+"run"))
	    Sleep(this,5);
        this.NextStep=function() 
        {  

        } 
    }
}


function mapopenwin(obj,pitem,item)
{
    var band = parent.document.UnitItem.getBandByItemName(pitem);
    if(!band) return;
    var recordcount = band.RecordCount();
    
    for(var i=0;i<recordcount;i++)
    {
        if(band.getFldStrValue("地名",i)==obj.id)
        {
            band.setCurrentRow(i);
            band.setModalContent(item);
            break;
        }
    }
}



//---------------------- sleep函数 -----------------------//

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
 
//---------------------- sleep end -----------------------//


String.prototype.len=function()
{               
	return this.replace(/[^\x00-\xff]/g,"rr").length;       
}       
