function usChartLinePlus(objElement)
{
    var band=document.UnitItem.getBandByItemName(objElement.Chart.ItemName);
    var rowcount=band.RecordCount();
    var   nameArray    =   new   Array();   
    var   dataArray1   =   new   Array();
    var   dataArray2   =   new   Array();
    var   dataArray3   =   new   Array();
    var   dataArray4   =   new   Array();
     
    objElement.LegendList=objElement.legend.split(",");
    objElement.SeriesList=objElement.series.split(",");
    if(objElement.LegendList.length<1 || objElement.SeriesList.length<1)
        return;
    
    for(var i=0;i<rowcount;i++)
	{
	    nameArray[i]=band.getFldStrValue(objElement.LegendList[0],i);
	    switch(objElement.SeriesList.length)
	    {
	        case 1:	dataArray1[i]=band.getFldStrValue(objElement.SeriesList[0],i);
	                break;
	        case 2:	dataArray1[i]=band.getFldStrValue(objElement.SeriesList[0],i);
	                dataArray2[i]=band.getFldStrValue(objElement.SeriesList[1],i);
	                break;
	        case 3:	dataArray1[i]=band.getFldStrValue(objElement.SeriesList[0],i);
	                dataArray2[i]=band.getFldStrValue(objElement.SeriesList[1],i);
	                dataArray3[i]=band.getFldStrValue(objElement.SeriesList[2],i);
	                break;
	        case 4:	dataArray1[i]=band.getFldStrValue(objElement.SeriesList[0],i);
	                dataArray2[i]=band.getFldStrValue(objElement.SeriesList[1],i);
	                dataArray3[i]=band.getFldStrValue(objElement.SeriesList[2],i);
	                dataArray4[i]=band.getFldStrValue(objElement.SeriesList[3],i);
	                break;	                

	    }
    }
  
  var   total   =   new   Array(nameArray,dataArray1,dataArray2,dataArray3,dataArray4)   
	//传递的数组，横坐标，纵坐标，图表的宽度，图表的高度,折线条数,横向放大倍数,纵向放大倍数,显示图例,图例宽度
  var olegend = new Olegend();
  var disp=objElement.getAttribute("legenddisp");
    if("none"!=disp)
         olegend.show = true;
    else olegend.show = false;

  olegend.textWidth = ToolUtil.Convert(objElement.getAttribute("legendwidth"),"number"); //100

  var ochart = new Ochart();

 
  ochart.width  = objElement.style.posWidth;
  ochart.height = objElement.style.posHeight;
  ochart.number = objElement.SeriesList.length;
  ochart.x = ToolUtil.Convert(objElement.getAttribute("radixposx"),"number")-40; //-20
  ochart.y = ToolUtil.Convert(objElement.getAttribute("radixposy"),"number"); //10
  ochart.scalex = ToolUtil.Convert(objElement.getAttribute("scalex"),"number");
  ochart.scaley = ToolUtil.Convert(objElement.getAttribute("scaley"),"number");;
  
  var oline = new Oline();
  oline.name[0] = objElement.SeriesList[0];
  if(objElement.SeriesList[1])
        oline.name[1] = objElement.SeriesList[1];
  if(objElement.SeriesList[2])
        oline.name[2] = objElement.SeriesList[2];
  if(objElement.SeriesList[3])
        oline.name[3] = objElement.SeriesList[3]; 

  //return mChartLinePlus(total,ochart,oline,olegend);
  var ortn = new Object();
  var oLineChart = mChartLinePlus(total,ochart,oline,olegend,objElement.Chart.VmlGroup.id);
  var d2 = drawChartpart2(total,ochart,oline,olegend,oLineChart);
  ortn.part1=oLineChart.strchart;
  ortn.part2=d2;
  ortn.name = "dv"+objElement.Chart.VmlGroup.id;
  return ortn
}
