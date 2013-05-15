//------------------------------------------------------------
// Copyright (c) 2003-2004 LeadinSoft. All rights reserved.
// Version 1.0.1
// Ahthor dolphin
//------------------------------------------------------------
//首先坐标系要清晰:坐标轴坐标系, 由Group重新设定原点自定义的正则坐标系(y轴向上为正), Group内坐标系:最终画图坐标, Group内文本显示坐标
//坐标轴坐标系统:有原点基数,放大系统,刻度间隔,是数学坐标系的反映,对应于具体数据的处理
//Group正则坐标系:由Group重新设定原点自定义的坐标系:是方便画图操作,y轴向上为正,可以有自己的比例系数;RefFrame
//Group内坐标系:是最终画图的坐标系;
//Group内文本坐标系:,以左上角为坐标原点向下为正坐标系

//chartName:图表对应Band项目名称;group对应图表VML组;
function Chart(chartName,group)
{
    try{
        if(!group || !group.tagName || !group.id)
          return;
    }catch(ex){return;};
    if(!document.ChartList)
        document.ChartList=new Array();
	var chartList=document.ChartList;
	var i=0;	//在数组中为空的序号
	for(;i<chartList.length;i++)
	{
		if(!chartList[i])
		    break;
		if(group.id==chartList[i].chartName)
			break;
	}
	chartList[i]=new function()
	{
		this.chartName=group.id;
		this.Element=group;
	};
    //图表区域的边距;此区域不显示数据
    this.MarginL=5;
    this.MarginR=5;
    this.MarginT=5;
    this.MarginB=5;
    //图表组,数据,图表类型,默认直方图:Legend:标识图例系列;Series数据系列;
    this.VmlGroup  = group;
    this.Element=group;
    group.Chart=this;
    this.ItemName=chartName;
    this.ChartType="verBar";
    this.LegendList=new Array();
    this.SeriesList=new Array();
    //初始化属性
    this.Width=this.Element.style.posWidth;
    this.Height=this.Element.style.posHeight;
    this.SizeX=this.Width;
    this.SizeY=this.Height;
    this.OffsetX=-this.Element.coordorigin.x;
    this.OffsetY=-this.Element.coordorigin.y;

    //模板内容
    this.VertBarSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalBar");
    this.VerLineSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalLine");
    this.DialPointSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","dialPoint");
    this.PipeSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipe");
    this.PipeTSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipeT");
    this.DivData=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","data");
    this.DivText=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","text");
    this.DivTemp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","template");
    this.GroupLegend=ToolUtil.getCtrlByNameD(false,this.Element,"chartElement","legend");
    if(this.DivTemp)
        this.CtrlInnerHTML=this.DivTemp.innerHTML;
    if(this.DialPointSamp)
        this.DialPointSamp.serHTML=this.DialPointSamp.innerHTML;
    if(this.PipeSamp)
        this.PipeSamp.serHTML=this.PipeSamp.innerHTML;
    if(this.PipeTSamp)
        this.PipeTSamp.serTHTML=this.PipeTSamp.innerHTML;
    if(this.GroupLegend)
        this.GroupLegend.legHTML=this.GroupLegend.innerHTML;
    //图表区,背景布,X轴,Y轴
    this.RefFrame=new RefFrame(this);
    this.BgWall=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","bgWall");
    var axisX=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisX");
    this.AxisX=new Axis(axisX,"X",this);
    var axisY=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisY");
    this.AxisY=new Axis(axisY,"Y",this);
    var axisD=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisD");
    this.AxisD=new Axis(axisD,"D",this);
 
    //立方柱属性:宽度,图表数据查看方式:ByCol 按照列方式(默认),ByRow 按照行方式
    this.BarAttr=new function(){ this.Width=20;this.DataViewPoint="ByCol"};
    if(this.BgWall)
    {
        this.BgWall.style.width=this.SizeX;
        this.BgWall.style.height=this.SizeY;
        this.BgWall.style.left=-this.OffsetX;
        this.BgWall.style.top=-this.OffsetY;
        this.Radius=this.SizeY/3;
    }    
}
//获取Chart类的一个引用
var _p =Chart.prototype;
_p.usOnLoadExtentJs=function()
{
    return true;
}
//默认使用group属性初始化;初始化图表宽高及原点
//sizeX,sizeY 划分区域坐标刻度值;offsetX,offsetY 原点偏移值,偏离左上角距离
_p.initialise = function(width,height,sizeX,sizeY,offsetX,offsetY)
{
    //初始化区域属性
    if(!this.RefFrame)
        this.RefFrame=new RefFrame(this);
    if(!this.AxisX)
    {
        var axisX=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisX");
        this.AxisX=new Axis(axisX,"X",this);
    }
    if(!this.AxisY)
    {
        var axisY=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisY");
        this.AxisY=new Axis(axisY,"Y",this);
    }
    if(!this.AxisD)
    {
        var axisD=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisD");
        this.AxisD=new Axis(axisD,"D",this);
    }
    this.Width  =(!width)?this.Element.style.posWidth:width;
    this.Height =(!height)?this.Element.style.posHeight:height;
    this.SizeX  =(!sizeX)?this.Element.coordsize.x:sizeX;
    this.SizeY  =(!sizeY)?this.Element.coordsize.y:sizeY;
    this.OffsetX=(null==offsetX)?(-this.Element.coordorigin.x):offsetX;
    this.OffsetY=(null==offsetY)?(-this.Element.coordorigin.y):offsetY;
    this.Radius=this.SizeY/3;

    this.VmlGroup.style.width=this.Width;
    this.VmlGroup.style.height=this.Height;
    this.VmlGroup.coordsize=this.SizeX+","+this.SizeY;
    this.VmlGroup.coordorigin=this.RefFrame.transCoordByOffset(0,0);

    this.BgWall.style.width=this.SizeX;
    this.BgWall.style.height=this.SizeY;
    this.BgWall.style.left=this.RefFrame.transCoordXByOffset(0);
    this.BgWall.style.top=this.RefFrame.transCoordYByOffset(0);
}
//根据Group初始设定初始化环境,坐标比率,原点偏移,序列和图例标识列,
//确定坐标轴最大值,最小值
//ItemName属性确定了数据环境
//_p.initDataLand=function()
//{
//    if(!this.RefFrame)
//        this.RefFrame=new RefFrame(this);
//    if(!this.AxisX)
//    {
//        var axisX=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisX");
//        this.AxisX=new Axis(axisX,"X",this);
//    }
//    if(!this.AxisY)
//    {
//        var axisY=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisY");
//        this.AxisY=new Axis(axisY,"Y",this);
//    }
//    if(!this.AxisD)
//    {
//        var axisD=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisD");
//        this.AxisD=new Axis(axisD,"D",this);
//    }
//    if(!this.Element.series || !this.Element.legend)
//        return;
//    this.LegendList=this.Element.legend.split(",");
//    this.SeriesList=this.Element.series.split(",");
//    if(this.LegendList.length<1 || this.SeriesList.length<1)
//        return;
//	//计算一个合适的数据范围
//	var val=this.Element.getAttribute("scalex");
//	if(val)
//	    this.AxisX.Scale=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("scaley");
//	if(val)
//	    this.AxisY.Scale=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("scaled");
//	if(val)
//	    this.AxisD.Scale=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("scaler");
//	if(val)
//        this.Radius=this.SizeY*ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("radixposx");
//	if(val)
//	    this.AxisX.RadixPositive=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("radixposy");
//	if(val)
//	    this.AxisY.RadixPositive=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("radixposd");
//	if(val)
//	    this.AxisD.RadixPositive=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("spacx");
//	if(val)
//	    this.AxisX.Spacing=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("spacy");
//	if(val)
//	    this.AxisY.Spacing=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("spacdd");
//	if(val)
//	    this.AxisD.Spacing=ToolUtil.Convert(val,"number");
//	var val=this.Element.getAttribute("offsetd");
//	if(val)
//	    this.AxisD.RotationOffset=ToolUtil.Convert(val,"number");
//	var vp=this.Element.getAttribute("dataviewpoint");
//	var chartType=this.Element.getAttribute("charttype");
//	this.SetChartType(chartType,vp);
//	var spacingDate=this.Element.getAttribute("spacd");
//	this.AxisX.SpacingDate=spacingDate;
//	this.AxisY.SpacingDate=spacingDate;
//	this.AxisD.SpacingDate=spacingDate;
//	var val=this.Element.getAttribute("labelwx");
//	if(val)
//	    this.AxisX.LabelAttr.Width=val;
//	var val=this.Element.getAttribute("labelhx");
//	if(val)
//	    this.AxisX.LabelAttr.Height=val;
//	var val=this.Element.getAttribute("labelwy");
//	if(val)
//	    this.AxisY.LabelAttr.Width=val;
//	var val=this.Element.getAttribute("labelhy");
//	if(val)
//	    this.AxisY.LabelAttr.Height=val;
//	
//	var myUnitItem=document.UnitItem;
//	if(!this.ItemName)  return;
//    var band=myUnitItem.getBandByItemName(this.ItemName);
//	this.Band=band;
//	if(!this.Band.ChartList)
//	    this.Band.ChartList=new Array();
//	var i=0;
//	for(;i<this.Band.ChartList.length;i++)
//	{
//	    if(!this.Band.ChartList[i])
//	        break;
//		if(this.Element.id==this.Band.ChartList[i].Element.id)
//		    break;
//	}
//	this.Band.ChartList[i]=this;
//}

_p.initDataLand=function()
{
    if(!this.RefFrame)
        this.RefFrame=new RefFrame(this);
    if(!this.AxisX)
    {
        var axisX=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisX");
        this.AxisX=new Axis(axisX,"X",this);
    }
    if(!this.AxisY)
    {
        var axisY=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisY");
        this.AxisY=new Axis(axisY,"Y",this);
    }
    if(!this.AxisD)
    {
        var axisD=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisD");
        this.AxisD=new Axis(axisD,"D",this);
    }
    if(!this.Element.series || !this.Element.legend)
        return;
    this.LegendList=this.Element.legend.split(",");
    this.SeriesList=this.Element.series.split(",");
    if(this.LegendList.length<1 || this.SeriesList.length<1)
        return;
	//计算一个合适的数据范围

	var val=this.Element.getAttribute("scalex");
	if(val && this.AxisX)
	    this.AxisX.Scale=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("scaley");
	if(val  && this.AxisY)
	    this.AxisY.Scale=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("scaled");
	if(val && this.AxisD)
	    this.AxisD.Scale=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("radixposx");
	if(val && this.AxisX)
	    this.AxisX.RadixPositive=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("radixposy");
	if(val && this.AxisY)
	    this.AxisY.RadixPositive=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("radixposd");
	if(val && this.AxisD)
	    this.AxisD.RadixPositive=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("spacx");
	if(val && this.AxisX)
	    this.AxisX.Spacing=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("spacy");
	if(val && this.AxisY)
	    this.AxisY.Spacing=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("spacdd");
	if(val && this.AxisD)
	    this.AxisD.Spacing=ToolUtil.Convert(val,"number");
	var val=this.Element.getAttribute("offsetd");
	if(val && this.AxisX)
	    this.AxisD.RotationOffset=ToolUtil.Convert(val,"number");
	var vp=this.Element.getAttribute("dataviewpoint");
	var chartType=this.Element.getAttribute("charttype");
	this.SetChartType(chartType,vp);
	var spacingDate=this.Element.getAttribute("spacd");
	if(this.AxisX)
	    this.AxisX.SpacingDate=spacingDate;
	if(this.AxisY)
	    this.AxisY.SpacingDate=spacingDate;
	if(this.AxisD)
	    this.AxisD.SpacingDate=spacingDate;
	var val=this.Element.getAttribute("labelwx");
	if(val && this.AxisX && this.AxisX.LabelAttr)
	    this.AxisX.LabelAttr.Width=val;
	var val=this.Element.getAttribute("labelhx");
	if(val && this.AxisX && this.AxisX.LabelAttr)
	    this.AxisX.LabelAttr.Height=val;
	var val=this.Element.getAttribute("labelwy");
	if(val && this.AxisY && this.AxisY.LabelAttr)
	    this.AxisY.LabelAttr.Width=val;
	var val=this.Element.getAttribute("labelhy");
	if(val && this.AxisY && this.AxisY.LabelAttr)
	    this.AxisY.LabelAttr.Height=val;
	
	var myUnitItem=document.UnitItem;
	if(!this.ItemName)  return;
    var band=myUnitItem.getBandByItemName(this.ItemName);
	this.Band=band;
	if(!this.Band.ChartList)
	    this.Band.ChartList=new Array();
	var i=0;
	for(;i<this.Band.ChartList.length;i++)
	{
	    if(!this.Band.ChartList[i])
	        break;
		if(this.Element.id==this.Band.ChartList[i].Element.id)
		    break;
	}
	this.Band.ChartList[i]=this;
}

//初始化数据环境,坐标轴(横轴,纵轴,表盘圆轴)比例,起点基点,刻度线间距
_p.initData=function()
{
    switch(this.ChartType)
    {
        case "Pipe":
            this.initDataPipe();
            break;
        case "Dial":
            this.initDataDial();
            break;
        default:
            this.initDataDefault();
            break;
    }
}
//初始化数据环境,坐标轴(横轴,纵轴,表盘圆轴)比例,起点基点,刻度线间距
_p.initDataDefault=function()
{
    var band=this.Band;
    if(!band)   return;
    this.AxisD.MeasureType="none";
	//目前只考虑所有值是正数的情况
	var axis=this.AxisSeries;
	axis.MeasureType="numeric";
	//直方图和折线坐标初始化;纵轴
	if("X"==axis.AxisType)
	    var max=this.Element.getAttribute("maxx");
    else if("Y"==axis.AxisType)
        var max=this.Element.getAttribute("maxy");
    if(!max)        var max=0;
    var max=ToolUtil.Convert(max,"number");
    var min=max;
    var rowcount=band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.SeriesList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.SeriesList[i],r);
	        if(!val)      continue;
	        var val=ToolUtil.Convert(val,"number");
	        if(val<min)     min=val;
	        if(val>max)     max=val;
	    }
	if(min>0 && min<axis.RadixPositive)
	    axis.RadixPositive=Math.floor(min/axis.Spacing)*axis.Spacing;
	if(max>0)
        axis.ValMax=Math.ceil(max/axis.Spacing)*axis.Spacing+axis.Spacing/2;
    if(min>0)
        axis.ValMin=0;
    //如果是折线,横向标识坐标值如果是数字或日期,就按照实际数据刻度
    //如果是直方图,或者标识坐标是文本,横向标识坐标值按照图例间隔均匀分布;
    //横轴
    var	strXPath="//xs:element[@name='"+this.LegendList[0]+"']";
    var xmlCol=this.Band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
    if(!xmlCol)		return;
    var dbtype=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
    if("bool"==dbtype)  return;
    if("string"==dbtype)
    {
        //标识坐标值按照文本方式均匀分布
        var axis=this.AxisLegend;
        axis.MeasureType="string";
        axis.ValMin=0;
        axis.RadixPositive=0;
        if("ByRow"==this.BarAttr.DataViewPoint)
            axis.ValMax=axis.Spacing*(this.SeriesList.length+0.6);
        else
            axis.ValMax=axis.Spacing*(this.Band.RecordCount()+0.6);
        return;
    }
	var axis=this.AxisLegend;
	if("X"==axis.AxisType)
	    var max=this.Element.getAttribute("maxx");
    else if("Y"==axis.AxisType)
        var max=this.Element.getAttribute("maxy");
    if(!max && "datetime"!=dbtype)
        var max=0;
    else
        var max=new Date();
    var max=ToolUtil.Convert(max,dbtype);
    var min=max;
    var rowcount=band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.LegendList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.LegendList[i],r);
	        if(!val)      continue;
	        val=ToolUtil.Convert(val,dbtype);
	        if(val<min)     min=val;
	        if(val>max)     max=val;
	    }
	if("datetime"!=dbtype)
	{   
	    //数字类型坐标刻度值
	    axis.MeasureType="numeric";
	    if(min>0 && min<axis.RadixPositive)
	        axis.RadixPositive=Math.floor(min/axis.Spacing)*axis.Spacing;
	    if(max>0)
            axis.ValMax=Math.ceil(max/axis.Spacing)*axis.Spacing+axis.Spacing/2;
        if(min>0)
            axis.ValMin=0;
	}else{
	    //日期类型坐标,起点为最小日期
	    var strFormat=xmlCol.getAttribute("format");
	    if(strFormat)
	        axis.DispFormat=strFormat;
	    else
	        axis.DispFormat="yyyy-MM-dd";
	    axis.MeasureType="date";
        axis.StartDate=min;
        axis.EndDate=max;
        var spaclen=Math.ceil(axis.EndDate.diffDate(axis.StartDate)/axis.SpacingDate);
        axis.ValMax=spaclen*axis.Spacing+axis.Spacing/2;
        axis.RadixPositive=0;
        axis.ValMin=0;
	}
}
//初始化数据环境,坐标轴(横轴,纵轴,表盘圆轴)比例,起点基点,刻度线间距
_p.initDataPipe=function()
{
    var band=this.Band;
    if(!band || band.RecordCount()<1)   return;
    this.AxisX.ValMin=-this.Radius*3/2;
    this.AxisX.ValMax=this.Radius*3/2;
    this.AxisY.ValMin=-this.Radius*3/2;
    this.AxisY.ValMax=this.Radius*3/2;
    this.AxisX.MeasureType="none";
    this.AxisY.MeasureType="none";
    this.AxisD.MeasureType="none";
}
//初始化数据环境,坐标轴(横轴,纵轴,表盘圆轴)比例,起点基点,刻度线间距
_p.initDataDial=function()
{
    var band=this.Band;
    if(!band)   return;
	//表盘坐标,以极坐标为原型,直线轴为X轴,角度轴为D轴
    this.AxisX.ValMin=-this.Radius*3/2;
    this.AxisX.ValMax=this.Radius*3/2;
    this.AxisY.ValMin=-this.Radius*3/2;
    this.AxisY.ValMax=this.Radius*3/2;
    this.AxisX.MeasureType="none";
    this.AxisY.MeasureType="none";
	//角度轴
	var max=this.Element.getAttribute("maxd");
	if(!max)       var max=0;
    var max=ToolUtil.Convert(max,"number");
    var min=max;
    var rowcount=band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.SeriesList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.SeriesList[i],r);
	        if(!val)    continue;
	        var val=ToolUtil.Convert(val,"number");
	        if(val<min)     min=val;
	        if(val>max)     max=val;
	    }
	//目前只考虑所有值是正数的情况
	var axis=this.AxisSeries;
	axis.MeasureType="numeric";
	if(min>0 && min<axis.RadixPositive)
	    axis.RadixPositive=Math.floor(min/axis.Spacing)*axis.Spacing;
	if(max>0)
        axis.ValMax=Math.ceil(max/axis.Spacing)*axis.Spacing+axis.Spacing/2;
    if(min>0)
        axis.ValMin=0;
}

//清空图形
_p.Clear=function()
{
    this.DivData.innerHTML="";
    this.DivText.innerHTML="";
    var ctrlList=ToolUtil.getCtrlListByNameD(false,this.Element,"appendElement");
    if(ctrlList)
        for(var i=0;i<ctrlList.length;i++)
            ctrlList[i].parentElement.removeChild(ctrlList[i]);
    this.DivTemp.innerHTML=this.CtrlInnerHTML;
}
//上边的Clear直接清除,下边的按照元素属性来清除序列指标线
_p.ClearSeries=function()
{
    var elemLabelList=ToolUtil.getCtrlListByNameD(false,this.DivText,"chartElement","legendT");
    if(elemLabelList)
        for(var i=0;i<elemLabelList.length;i++)
            elemLabelList[i].parentElement.removeChild(elemLabelList[i]);
    var chartType=this.ChartType.toLowerCase();
    switch(chartType)
    {
        case "verbar":
        case "horbar":
            var elemSeriesName="verticalBar";
            break;
        case "verline":
        case "horline":
            var elemSeriesName="verticalLine";
            break;
        case "pipe":
            var elemSeriesName="pipe";
            var elemSeriesList=ToolUtil.getCtrlListByNameD(false,this.DivData,"chartElement","pipeT");
            if(elemSeriesList)
                for(var i=0;i<elemSeriesList.length;i++)
                    elemSeriesList[i].parentElement.removeChild(elemSeriesList[i]);
            break;
        case "dial":
            var elemSeriesName="dialPoint";
            break;
    }
    var elemSeriesList=ToolUtil.getCtrlListByNameD(false,this.DivData,"chartElement",elemSeriesName);
    if(elemSeriesList)
        for(var i=0;i<elemSeriesList.length;i++)
            elemSeriesList[i].parentElement.removeChild(elemSeriesList[i]);
}
//增量重画轴线
_p.InitAxisInc=function()
{
	var axis=this.AxisLegend;
    if("date"!=axis.MeasureType)
        return;
	if("X"==axis.AxisType)
	    var max=this.Element.getAttribute("maxx");
    else if("Y"==axis.AxisType)
        var max=this.Element.getAttribute("maxy");
    if(!max)        var max=0;
    var max=ToolUtil.Convert(max,"datetime");
    var min=max;
    var rowcount=this.Band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.LegendList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.LegendList[i],r);
	        if(!val)      continue;
	        val=ToolUtil.Convert(val,"datetime");
	        if(val<min)     min=val;
	        if(val>max)     max=val;
	    }
    axis.StartDate=min;
    axis.EndDate=max;
    var spaclen=Math.ceil(axis.EndDate.diffDate(axis.StartDate)/axis.SpacingDate);
    axis.ValMax=spaclen*axis.Spacing+axis.Spacing/2;
    axis.RadixPositive=0;
    axis.ValMin=0;
    axis.ValMin2=Math.floor(axis.ValMin/axis.Spacing)*axis.Spacing;
    axis.ValMax2=Math.floor(axis.ValMax/axis.Spacing)*axis.Spacing;
    this.AxisSeries.draw();
    axis.draw();
}

//设置图表类型:verbar,horbar,verline,pipe;
//vp:图表序列标识观察视点:ByCol,ByRow(列方式,行方式)
_p.SetChartType=function(chartType,vp)
{
    if(!chartType || !vp)  return;
    var chartType=chartType.toLowerCase();
    var vp=vp.toLowerCase();
    switch(chartType)
    {
        case "verbar":
            this.ChartType="VerBar";
            this.AxisSeries=this.AxisY;
            this.AxisLegend=this.AxisX;
            if("byrow"==vp)
                this.BarAttr.DataViewPoint="ByRow";
            else
                this.BarAttr.DataViewPoint="ByCol";
            break;
        case "horbar":
            this.ChartType="HorBar";
            this.AxisSeries=this.AxisX;
            this.AxisLegend=this.AxisY;
            if("byrow"==vp)
                this.BarAttr.DataViewPoint="ByRow";
            else
                this.BarAttr.DataViewPoint="ByCol";
            break;
        case "verline":
            this.ChartType="VerLine";
            this.BarAttr.DataViewPoint="ByCol";
            this.AxisSeries=this.AxisY;
            this.AxisLegend=this.AxisX;
            break;
        case "horline":
            this.ChartType="HorLine";
            this.BarAttr.DataViewPoint="ByCol";
            this.AxisSeries=this.AxisX;
            this.AxisLegend=this.AxisY;
            break;
        case "pipe":
            this.ChartType="Pipe";
            this.BarAttr.DataViewPoint="ByCol";
            this.AxisSeries=this.AxisX;
            this.AxisLegend=this.AxisY;
            break;
        case "dial":
            this.ChartType="Dial";
            this.BarAttr.DataViewPoint="ByCol";
            this.AxisLegend=this.AxisX;
            this.AxisSeries=this.AxisY;
            this.AxisSeries=this.AxisD;
            break;
        default:
            this.ChartType="VerBar";
            if("byrow"==vp)
            {
                this.BarAttr.DataViewPoint="ByRow";
                this.AxisSeries=this.AxisY;
                this.AxisLegend=this.AxisX;
            }else{
                this.BarAttr.DataViewPoint="ByCol";
                this.AxisSeries=this.AxisX;
                this.AxisLegend=this.AxisY;
            }
            break;
    }
}
//初始化坐标轴系统,没有负半轴的起点从原点开始
_p.InitAxis=function()
{
    this.AxisX.ValMin2=Math.floor(this.AxisX.ValMin/this.AxisX.Spacing)*this.AxisX.Spacing;
    this.AxisX.ValMax2=Math.floor(this.AxisX.ValMax/this.AxisX.Spacing)*this.AxisX.Spacing;
    this.AxisY.ValMin2=Math.floor(this.AxisY.ValMin/this.AxisY.Spacing)*this.AxisY.Spacing;
    this.AxisY.ValMax2=Math.floor(this.AxisY.ValMax/this.AxisY.Spacing)*this.AxisY.Spacing;
    this.AxisD.ValMin2=Math.floor(this.AxisD.ValMin/this.AxisD.Spacing)*this.AxisD.Spacing;
    this.AxisD.ValMax2=Math.floor(this.AxisD.ValMax/this.AxisD.Spacing)*this.AxisD.Spacing;
    this.AxisX.draw();
    this.AxisY.draw();
    this.AxisD.draw();
}

//图表移动
_p.Move=function(offsetX,offsetY)
{
    if(!offsetX)    offsetX=0;
    if(!offsetY)    offsetY=0;
    var x=this.Element.coordorigin.x-Math.round(offsetX);
    var y=this.Element.coordorigin.y-Math.round(offsetY);
    this.Element.coordorigin=x+","+y;
    this.BgWall.style.left=this.BgWall.style.posLeft-Math.round(offsetX);
    this.BgWall.style.top=this.BgWall.style.posTop-Math.round(offsetY);
    for(var i=0;i<this.DivText.children.length;i++)
    {
        var chartElem=this.DivText.children[i];
        var attrName=chartElem.getAttribute("chartElement");
        if(!attrName || ""==attrName)
            continue;
        chartElem.style.left=chartElem.style.posLeft+Math.round(offsetX);
        chartElem.style.top=chartElem.style.posTop+Math.round(offsetY);
    }
}
//图表放大缩小
_p.Scale=function(offsetX,offsetY)
{
    if(!offsetX)    offsetX=0;
    if(!offsetY)    offsetY=0;

    var oldox=this.Element.coordorigin.x;
    var oldoy=this.Element.coordorigin.y;
    var oldsizex=this.Element.coordsize.x;
    var oldsizey=this.Element.coordsize.y;
    var x=this.Element.coordsize.x-Math.round(offsetX);
    var y=this.Element.coordsize.y-Math.round(offsetY);
    var ox=x*this.Element.coordorigin.x/this.Element.coordsize.x;
    var oy=y*this.Element.coordorigin.y/this.Element.coordsize.y;
    
    this.Element.coordsize=x+","+y;
    this.Element.coordorigin=ox+","+oy;
    this.BgWall.style.width=x;
    this.BgWall.style.height=y;
    this.BgWall.style.left=ox;
    this.BgWall.style.top=oy;
    
    for(var i=0;i<this.DivText.children.length;i++)
    {
        var chartElem=this.DivText.children[i];
        var attrName=chartElem.getAttribute("chartElement");
        if(!attrName || ""==attrName)
            continue;
        var tx=chartElem.style.posLeft;
        var ty=chartElem.style.posTop;
        chartElem.style.left=tx+Math.round(offsetX*tx/this.Width)+Math.round(offsetX*oldox/oldsizex);
        chartElem.style.top=ty+Math.round(offsetY*ty/this.Height)+Math.round(offsetY*oldoy/oldsizey);
    }
}
//根据图表类型;绘制图表
_p.Draw=function()
{
    if(this.Band.RecordCount()<1)
        return;
        
    var chartType=this.ChartType.toLowerCase();
    switch(chartType)
    {
        case "verbar":
            this.DrawVerBar();
            break;
        case "horbar":
            this.DrawHorBar();
            break;
        case "verline":
            this.DrawVerLine();
            break;
        case "horline":
            this.DrawHorLine();
            break;
        case "pipe":
            this.DrawPipe();
            break;
        case "dial":
            this.DrawDial();
            break;
    }
}
//设置图例
_p.DrawLegend=function()
{
    this.GroupLegend=this.Element.appendChild(this.GroupLegend);
    var legendGroup=this.GroupLegend;
    if(!legendGroup)    return;
    legendGroup.innerHTML=this.GroupLegend.legHTML;
    var DivDataLegend=ToolUtil.getCtrlByNameD(false,this.GroupLegend,"chartElement","legendData");
    var DivTempLegend=ToolUtil.getCtrlByNameD(false,this.GroupLegend,"chartElement","legendTemplate");
    
    var disp=this.Element.getAttribute("legenddisp");
    if("none"!=disp)
        legendGroup.style.display="";
    else{
        legendGroup.style.display="none";
        return;
    }
    legendGroup.style.left=this.Element.getAttribute("legendx");
    legendGroup.style.top=this.Element.getAttribute("legendy");
    var legendSpacing=this.Element.getAttribute("legendspac");
    var colorLeg=ToolUtil.getCtrlByNameD(false,legendGroup,"chartElement","colorLegend");
    var textLeg=ToolUtil.getCtrlByNameD(false,legendGroup,"chartElement","legendTxt");
    var chartType=this.ChartType.toLowerCase();
    if("ByRow"==this.BarAttr.DataViewPoint)
    {
        var legsum=this.SeriesList.length;
        var sersum=this.Band.RecordCount();
    }else{
        var legsum=this.Band.RecordCount();
        var sersum=this.SeriesList.length;
    }
    if("verline"==chartType || "horline"==chartType || "dial"==chartType)
    {
        for(var i=0;i<sersum;i++)
        {
            var colleg=colorLeg.cloneNode(true);
            var txtleg=textLeg.cloneNode(true);
            colleg=DivDataLegend.appendChild(colleg);
            txtleg=DivDataLegend.appendChild(txtleg);
            colleg.style.top=colorLeg.style.posTop+legendSpacing*i;
            txtleg.style.top=textLeg.style.posTop+legendSpacing*i;
            txtleg.innerHTML=this.SeriesList[i];
            colleg.setAttribute("fillcolor", ToolUtil.getColor2(i));
        }
        legendGroup.style.height=legendSpacing*(sersum+1);
    }else if("pipe"==chartType){
        for(var i=0;i<legsum;i++)
        {
            var colleg=colorLeg.cloneNode(true);
            var txtleg=textLeg.cloneNode(true);
            colleg=DivDataLegend.appendChild(colleg);
            txtleg=DivDataLegend.appendChild(txtleg);
            colleg.style.top=colorLeg.style.posTop+legendSpacing*i;
            txtleg.style.top=textLeg.style.posTop+legendSpacing*i;
            var val=this.Band.getFldStrValue(this.LegendList[0],i);
            var val2=this.Band.getFldStrValue(this.SeriesList[0],i);
            if(!val)      continue;
            if(0!=val2 && !val2)    continue;
            txtleg.innerHTML=val+"："+Math.round(val2*1000)/10+"%";
            colleg.setAttribute("fillcolor", ToolUtil.getColor(i));
            this.SerList[i].txtleg=txtleg;
            this.SerList[i].colleg=colleg;
            if(this.SerList[i].series2)
            {
                this.SerList[i].series2.txtleg=txtleg;
                this.SerList[i].series2.colleg=colleg;
            }
        }
        legendGroup.style.height=legendSpacing*(legsum+1.5);
    }
    var legendwidth=this.Element.getAttribute("legendwidth");
    if(legendwidth)
        legendGroup.style.width=legendwidth;
    legendGroup.coordsize.y=legendGroup.style.posHeight;
    legendGroup.coordsize.x=legendGroup.style.posWidth;
    var legendWall=ToolUtil.getCtrlByNameD(false,legendGroup,"chartElement","bgWallLegend");
    legendWall.style.height=legendGroup.style.height;
    legendWall.style.width=legendGroup.style.width;
}

//直方图
_p.DrawVerBar=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    if("ByRow"==this.BarAttr.DataViewPoint)
    {
        var legsum=this.SeriesList.length;
        var sersum=this.Band.RecordCount();
    }else{
        var legsum=this.Band.RecordCount();
        var sersum=this.SeriesList.length;
    }
    
    var barwidth=this.BarAttr.Width*sersum;
    for(var i=0;i<legsum;i++)
    {
        var x=this.AxisX.Spacing*(i+1);
        for(var k=0;k<sersum;k++)
        {
            var barClone=this.VertBarSamp.cloneNode(true);
            barClone=this.DivData.appendChild(barClone);
            barClone.setAttribute("appendElement","true");
            barClone.style.left=this.AxisX.transCoord(x-barwidth+this.BarAttr.Width*k);
            if("ByRow"==this.BarAttr.DataViewPoint)
                var val=this.Band.getFldStrValue(this.SeriesList[i],k);
            else
                var val=this.Band.getFldStrValue(this.SeriesList[k],i);
            if(!val)      continue;
            barClone.style.top=this.AxisY.transCoord(ToolUtil.Convert(val,"decimal"));
            barClone.style.height=Math.abs(barClone.style.posTop);
            barClone.style.width=this.BarAttr.Width;
            barClone.setAttribute("fillcolor", ToolUtil.getColor(k)); //(Math.random()*255)<<16|(Math.random()*255)<<8|(Math.random()*255);
        }
        var legendClone=legendText.cloneNode(true);
        var legendClone=this.DivText.appendChild(legendClone);
        legendClone.setAttribute("appendElement","true");
        legendClone.style.top=this.RefFrame.transTextCoordY(-5);
        legendClone.style.left=this.AxisX.transTextCoord(x-this.AxisX.LabelAttr.Width/2-barwidth/2);
        legendClone.style.Width=this.AxisX.LabelAttr.Width;
        legendClone.style.Height=this.AxisX.LabelAttr.Height;
        if("ByRow"==this.BarAttr.DataViewPoint)
            legendClone.innerHTML=this.SeriesList[i];
        else
            legendClone.innerHTML=this.Band.getFldStrValue(this.LegendList[0],i);
    }
}
//条形图;这种类型的图表标志列都按照文本类别,在坐标轴均匀分布;
_p.DrawHorBar=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    if("ByRow"==this.BarAttr.DataViewPoint)
    {
        var legsum=this.SeriesList.length;
        var sersum=this.Band.RecordCount();
    }else{
        var legsum=this.Band.RecordCount();
        var sersum=this.SeriesList.length;
    }
    this.AxisY.Spacing=this.AxisY.ValMax/(legsum+0.5);
    var barwidth=this.BarAttr.Width*sersum;
    for(var i=0;i<legsum;i++)
    {
        var x=this.AxisY.Spacing*(i+1);
        for(var k=0;k<sersum;k++)
        {
            var barClone=this.VertBarSamp.cloneNode(true);
            barClone=this.DivData.appendChild(barClone);
            barClone.setAttribute("appendElement","true");
            barClone.style.top=this.AxisY.transCoord(x-barwidth+this.BarAttr.Width*k);
            if("ByRow"==this.BarAttr.DataViewPoint)
                var val=this.Band.getFldStrValue(this.SeriesList[i],k);
            else
                var val=this.Band.getFldStrValue(this.SeriesList[k],i);
            if(!val)        continue;
            var val=ToolUtil.Convert(val,"decimal");
            if(val>0)
                barClone.style.left=this.AxisX.transCoord(0);
            else
                barClone.style.left=this.AxisX.transCoord(val);
            barClone.style.height=this.BarAttr.Width;
            barClone.style.width=Math.abs(this.AxisX.transCoord(val));
            barClone.setAttribute("fillcolor",ToolUtil.getColor(k)); //(Math.random()*255)<<16|(Math.random()*255)<<8|(Math.random()*255);
        }
        var legendClone=legendText.cloneNode(true);
        var legendClone=this.DivText.appendChild(legendClone);
        legendClone.setAttribute("appendElement","true");
        legendClone.style.top=this.AxisY.transTextCoord(x+this.AxisY.LabelAttr.Height/2-barwidth);
        legendClone.style.left=this.AxisX.transTextCoord(-this.AxisX.LabelAttr.Width);
        legendClone.style.Width=this.AxisX.LabelAttr.Width;
        legendClone.style.Height=this.AxisX.LabelAttr.Height;
        if("ByRow"==this.BarAttr.DataViewPoint)
            legendClone.innerHTML=this.SeriesList[i];
        else
            legendClone.innerHTML=this.Band.getFldStrValue(this.LegendList[0],i);
    }

}
//折线图;如果标识分类列是文本,系列均匀分布,是日期,数字的按照刻度值分布
_p.DrawVerLine=function()
{
    var	strXPath="//xs:element[@name='"+this.LegendList[0]+"']";
    var xmlCol=this.Band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
    var dbType=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
    switch(dbType)
    {
        case "string":
            this.DrawVerLineOfText();
            break;
        case "int":
        case "decimal":
            this.DrawVerLineOfNum();
            break;
        case "datetime":
            this.DrawVerLineOfNum();
    }
    
}
//折线图;如果标识分类列是文本,系列均匀分布,是日期,数字的按照刻度值分布
_p.DrawHorLine=function()
{
    var	strXPath="//xs:element[@name='"+this.LegendList[0]+"']";
    var xmlCol=this.Band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
    var dbType=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
    switch(dbType)
    {
        case "string":
            this.DrawVerLineOfText();
            break;
        case "int":
        case "decimal":
            this.DrawHorLineOfNum();
            break;
        case "datetime":
            this.DrawHorLineOfNum();
    }
    
}
//饼图
_p.DrawPipe=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    var legsum=this.Band.RecordCount();
    var sersum=this.SeriesList.length;
    
    var serList=new Array();var serPath=new Array();
    var serTList=new Array();var serTPath=new Array();
    this.SerList=serList;
    for(var k=0;k<legsum;k++)
    {
        var series=this.PipeSamp.cloneNode(false);
        series=this.DivData.appendChild(series);
        series.setAttribute("appendElement","true");
        series.style.width=this.Element.coordsize.x;
        series.style.height=this.Element.coordsize.y;
        series.style.left=this.Element.coordorigin.x;
        series.style.top=this.Element.coordorigin.y;
        series.setAttribute("coordsize",this.Element.coordsize.value);
        series.setAttribute("coordorigin",this.Element.coordorigin.value);
        series.setAttribute("fillcolor",ToolUtil.getColor(k));
        serList[k]=series;
        serList[k].innerHTML=this.PipeSamp.serHTML;
        
        var seriesT=this.PipeTSamp.cloneNode(false);
        seriesT=this.DivData.appendChild(seriesT);
        seriesT.setAttribute("appendElement","true");
        seriesT.style.width=this.Element.coordsize.x;
        seriesT.style.height=this.Element.coordsize.y;
        seriesT.style.left=this.Element.coordorigin.x;
        seriesT.style.top=this.Element.coordorigin.y;
        seriesT.setAttribute("coordsize",this.Element.coordsize.value);
        seriesT.setAttribute("coordorigin",this.Element.coordorigin.value);
        serTList[k]=seriesT;
        serTList[k].innerHTML=this.PipeTSamp.serTHTML;
    }
    // addupRatio 累计比率;圆心为原点,计算圆弧起点,终点,起点和终点按照半径极坐标方式计算
    var addupAngle=0;var addupRatio=0;var addupRadian=0;
    var zIndex=this.PipeSamp.style.zIndex;
    var left=this.AxisX.transCoord(-this.Radius);
    var top=this.AxisY.transCoord(this.Radius);
    var right=this.AxisX.transCoord(this.Radius);
    var bottom=this.AxisY.transCoord(-this.Radius);
    for(var i=0;i<legsum;i++)
    {
        var val=this.Band.getFldStrValue(this.SeriesList[0],i);
        if(!val)    continue;
        var val=ToolUtil.Convert(val,"decimal");
        var xStart=this.Radius*Math.cos(addupRadian);
        var yStart=this.Radius*Math.sin(addupRadian);
        var xStart=this.AxisX.transCoord(Math.round(xStart));
        var yStart=this.AxisY.transCoord(Math.round(yStart));
        addupRadian += 2*Math.PI*val;
        var xEnd=this.Radius*Math.cos(addupRadian);
        var yEnd=this.Radius*Math.sin(addupRadian);
        var xEnd=this.AxisX.transCoord(Math.round(xEnd));
        var yEnd=this.AxisY.transCoord(Math.round(yEnd));
        
        //跨第一,第二,第三 三个象限的区域分割为两个来画
        if(addupRatio<=0.25 && (addupRatio+val)>0.75)
        {
            var series=this.PipeSamp.cloneNode(false);
            series=this.DivData.appendChild(series);
            series.setAttribute("appendElement","true");
            series.style.width=this.Element.coordsize.x;
            series.style.height=this.Element.coordsize.y;
            series.style.left=this.Element.coordorigin.x;
            series.style.top=this.Element.coordorigin.y;
            series.setAttribute("coordsize",this.Element.coordsize.value);
            series.setAttribute("coordorigin",this.Element.coordorigin.value);
            series.setAttribute("fillcolor",ToolUtil.getColor(i));
            series.innerHTML=this.PipeSamp.serHTML;
            series.series2=serList[i];
            serList[i].series2=series;
            
            var aRM = addupRadian - Math.PI*val;
            var xEndM=this.Radius*Math.cos(aRM);
            var yEndM=this.Radius*Math.sin(aRM);
            var xEndM=this.AxisX.transCoord(Math.round(xEndM));
            var yEndM=this.AxisY.transCoord(Math.round(yEndM));
            
            var path="m 0,0 l "+xStart+","+yStart+" ar "+left+","+top+","+right+","+bottom+","+xStart+","+yStart+","+xEndM+","+yEndM+" l 0,0 e";
            series.setAttribute("path",path);
            series.setAttribute("title",this.SeriesList[0]+"："+Math.round(val*1000)/10+"%");
            series.style.zIndex=--zIndex;
            
            var path="m 0,0 l "+xEndM+","+yEndM+" ar "+left+","+top+","+right+","+bottom+","+xEndM+","+yEndM+","+xEnd+","+yEnd+" l 0,0 e";
        }else
            var path="m 0,0 l "+xStart+","+yStart+" ar "+left+","+top+","+right+","+bottom+","+xStart+","+yStart+","+xEnd+","+yEnd+" l 0,0 e";
        
        serList[i].setAttribute("path",path);
        serList[i].setAttribute("title",this.SeriesList[0]+"："+Math.round(val*1000)/10+"%");
        if(addupRatio<=0.75 && (addupRatio+val)>0.75)
            zIndex=this.PipeSamp.style.zIndex+(legsum-i-1);
        if(addupRatio<0.25 && (addupRatio+val)<0.75)
            serList[i].style.zIndex=--zIndex;
        else if(addupRatio>0.75 || (addupRatio+val)>0.75)
            serList[i].style.zIndex=zIndex--;
        else
            serList[i].style.zIndex=zIndex;
        addupRatio +=val;
        
        serList[i].text=serTList[i];
        serTList[i].style.zIndex=serList[i].style.zIndex;
        serTList[i].series=serList[i];
        var xEndz=this.Radius*1.5*Math.cos(addupRadian-Math.PI*val);
        var yEndz=this.Radius*1.5*Math.sin(addupRadian-Math.PI*val);
        var xEndz=this.AxisX.transCoord(Math.round(xEndz));
        var yEndz=this.AxisY.transCoord(Math.round(yEndz));
        var txtRatio=addupRatio-val/2;
        if(txtRatio>=0.2 && txtRatio<=0.3)
            var path="m "+Math.round(xEnd*2/3)+","+Math.round(yEnd*2/3)+" l "+Math.round(xStart*2/3)+","+Math.round(yStart*2/3)+" e";
        else if(txtRatio>=0.7 && txtRatio<=0.8)
            var path="m "+Math.round(xStart*2/3)+","+Math.round(yStart*2/3)+" l "+Math.round(xEnd*2/3)+","+Math.round(yEnd*2/3)+" e";
        else if(txtRatio>0.3 && txtRatio<0.7)
            var path="m "+xEndz+","+yEndz+" l 0,0 e";
        else
            var path="m 0,0 l "+xEndz+","+yEndz+" e";
        serTList[i].setAttribute("path",path);
        var text=ToolUtil.getCtrlByTagD(false,serTList[i],"textpath");
        text.setAttribute("string",Math.round(val*1000)/10+"%");
    }
    
}

//仪表盘,不标志指标序列数据
_p.DrawDial=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    var serList=new Array();
    this.SerList=serList;
    for(var k=0;k<this.SeriesList.length;k++)
    {
        var series=this.DialPointSamp.cloneNode(false);
        series=this.DivData.appendChild(series);
        series.setAttribute("appendElement","true");
        series.setAttribute("strokecolor",ToolUtil.getColor2(k));
        serList[k]=series;
        serList[k].innerHTML=this.DialPointSamp.serHTML;
    }
    for(var k=0;k<this.SeriesList.length;k++)
    {
        var val=this.Band.getFldStrValue(this.SeriesList[k]);
        if(!val)    continue;
        val=ToolUtil.Convert(val,"decimal");
        //由坐标刻度值转换为D轴角度坐标
        var val=this.AxisD.transCoord(val);
        var addupRadian=Math.PI*val/180;
        var xStart=Math.round((this.Radius/this.AxisX.Scale-30-k*10)*Math.cos(addupRadian));
        var yStart=Math.round((this.Radius/this.AxisX.Scale-30-k*10)*Math.sin(addupRadian));
        serList[k].from="0,0";
        serList[k].to=xStart+","+yStart;
    }
}

//折线图;标志分类列是文本,系列均匀分布
_p.DrawVerLineOfText=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    var legsum=this.Band.RecordCount();
    var sersum=this.SeriesList.length;
    
    var serList=new Array();var serPath=new Array();
    for(var k=0;k<sersum;k++)
    {
        series=this.VerLineSamp.cloneNode(true);
        series=this.DivData.appendChild(series);
        series.setAttribute("appendElement","true");
        series.style.width=this.Element.coordsize.x;
        series.style.height=this.Element.coordsize.y;
        series.style.left=this.Element.coordorigin.x;
        series.style.top=this.Element.coordorigin.y;
        series.setAttribute("coordsize",this.Element.coordsize.value);
        series.setAttribute("coordorigin",this.Element.coordorigin.value);
        series.setAttribute("strokecolor",ToolUtil.getColor2(k));//(Math.random()*255)<<16|(Math.random()*255)<<8|(Math.random()*255);
        series.setAttribute("filled","false");
        serList[k]=series;
        serPath[k]="";
    }
    
    for(var i=0;i<legsum;i++)
    {
        var xkd=this.AxisLegend.Spacing*(i+1);
        var x=this.AxisLegend.transCoord(xkd);
        for(var k=0;k<sersum;k++)
        {
            var val=this.Band.getFldStrValue(this.SeriesList[k],i);
            if(!val)    continue;
            var y=this.AxisSeries.transCoord(ToolUtil.Convert(val,"decimal"));
            if("Y"==this.AxisSeries.AxisType)
                var strpath = Math.round(x)+","+Math.round(y);
            else
                var strpath = Math.round(y)+","+Math.round(x);
            if(!serPath[k])
                serPath[k] = "m "+strpath+" l ";
            else
                serPath[k] += strpath+",";
        }
        for(var k=0;k<this.AxisLegend.MeasureList.length;k++)
        {
            var ctrlMeasure=this.AxisLegend.MeasureList[k];
            if("measure"==ctrlMeasure.chartElement)
            {
                var ctrl=ctrlMeasure.cloneNode(true);
                var ctrl=this.DivText.appendChild(ctrl);
                ctrl.setAttribute("appendElement","true");
                var ymin=this.AxisSeries.transCoord(this.AxisSeries.ValMin2);
                var ymax=this.AxisSeries.transCoord(this.AxisSeries.ValMax2);
                if("Y"==this.AxisSeries.AxisType)
                {
                    ctrl.from=x+","+ymin;
                    ctrl.to=x+","+ymax;
                }else{
                    ctrl.from=ymin+","+x;
                    ctrl.to=ymax+","+x;
                }
                ctrl.innerHTML=ctrlMeasure.innerHTML;
            }
        }
        //显示数据标志
        var disp=this.Element.getAttribute("labeldisp");
        if("none"==disp)    continue;
        var legendClone=legendText.cloneNode(true);
        var legendClone=this.DivText.appendChild(legendClone);
        legendClone.setAttribute("appendElement","true");
        if("Y"==this.AxisSeries.AxisType)
        {
            legendClone.style.top=this.RefFrame.transTextCoordY(-5);
            legendClone.style.left=this.AxisX.transTextCoord(xkd)-this.AxisX.LabelAttr.Width/2;
        }else{
            legendClone.style.top=this.AxisY.transTextCoord(xkd)-this.AxisY.LabelAttr.Height/2;
            legendClone.style.left=this.RefFrame.transTextCoordX(-this.AxisX.LabelAttr.Width/2);
        }
        legendClone.style.Width=this.AxisLegend.LabelAttr.Width;
        legendClone.style.Height=this.AxisLegend.LabelAttr.Height;
        legendClone.innerHTML=this.Band.getFldStrValue(this.LegendList[0],i);
    }
    for(var k=0;k<sersum;k++)
    {
        var path=serPath[k].substring(0,serPath[k].length-1)+" e";
        serList[k].setAttribute("path",path);
    }

}
//折线图;标志分类列是日期,数字,系列均匀分布
_p.DrawVerLineOfNum=function()
{
    var legendText=ToolUtil.getCtrlByNameD(false,this.DivTemp,"chartElement","legendT");
    //标志分类个数;按照行方式,指标转置,指标系列是数据查看标志分类;
    //按照列方式(默认方式):样例是分类标志,指标系列是考察项
    var legsum=this.Band.RecordCount();
    var sersum=this.SeriesList.length;
    
    var serList=new Array();var serPath=new Array();
    for(var k=0;k<sersum;k++)
    {
        series=this.VerLineSamp.cloneNode(true);
        series=this.DivData.appendChild(series);
        series.setAttribute("appendElement","true");
        series.style.width=this.Element.coordsize.x;
        series.style.height=this.Element.coordsize.y;
        series.style.left=this.Element.coordorigin.x;
        series.style.top=this.Element.coordorigin.y;
        series.setAttribute("coordsize",this.Element.coordsize.value);
        series.setAttribute("coordorigin",this.Element.coordorigin.value);
        series.setAttribute("strokecolor",ToolUtil.getColor2(k));//(Math.random()*255)<<16|(Math.random()*255)<<8|(Math.random()*255);
        series.setAttribute("filled","false");
        serList[k]=series;
        serPath[k]="";
    }
    
    var	strXPath="//xs:element[@name='"+this.LegendList[0]+"']";
    var xmlCol=this.Band.XmlSchema.XMLDocument.selectSingleNode(strXPath);
    var dbType=ToolUtil.tranDBType(xmlCol.getAttribute("type"));
    for(var i=0;i<legsum;i++)
    {
        var x=this.Band.getFldStrValue(this.LegendList[0],i);
        if(!x)      continue;
        if("datetime"==dbType)
        {
            x=ToolUtil.Convert(x,"date");
            x=x.diffDate(this.AxisX.StartDate);
            x=this.AxisX.RadixPositive+(x/this.AxisX.SpacingDate)*this.AxisX.Spacing;
        }
        var xkd=ToolUtil.Convert(x,"decimal");
        var x=this.AxisX.transCoord(xkd);
        for(var k=0;k<sersum;k++)
        {
            var val=this.Band.getFldStrValue(this.SeriesList[k],i);
            if(!val)        continue;
            val=ToolUtil.Convert(val,"decimal");
            var y=this.AxisY.transCoord(val);
            if(!serPath[k])
                serPath[k] =  "m "+Math.round(x)+","+Math.round(y)+" l ";
            else
                serPath[k] += Math.round(x)+","+Math.round(y)+",";
            //显示数据标志
            var disp=this.Element.getAttribute("labeldisp");
            if("none"==disp)    continue;
            var legendClone=legendText.cloneNode(true);
            var legendClone=this.DivText.appendChild(legendClone);
            legendClone.setAttribute("appendElement","true");
            legendClone.style.top=this.AxisY.transTextCoord(val)-this.AxisY.LabelAttr.Height;
            legendClone.style.left=this.AxisX.transTextCoord(xkd);
            legendClone.style.width=this.AxisX.LabelAttr.Width;
            legendClone.style.height=this.AxisX.LabelAttr.Height;
            legendClone.innerHTML=val;
        }
    }
    for(var k=0;k<sersum;k++)
    {
        var path=serPath[k].substring(0,serPath[k].length-1)+" e";
        serList[k].setAttribute("path",path);
    }

}


Stop=null;temp=null;
//独立函数:饼图浮起
function moveup(iteam)
{
    if(temp && !iteam.state || iteam.state=="down")
        movedown(temp,true);
	temp=eval(iteam);
	temp.state="up";
    if(null==temp.inittop)    {        temp.inittop=temp.style.top;		temp.txtleg.initleft=temp.txtleg.style.posLeft;
		temp.colleg.initleft=temp.colleg.style.posLeft;
    }	var at=parseInt(temp.style.top);	var inittop=parseInt(temp.inittop);
	if(at>(inittop-10))
	{
		temp.topnum++;
		temp.style.top=at-1;
		if(temp.series2)
		    temp.series2.style.top=temp.style.top;
		if(temp.text)
		    temp.text.style.top=temp.style.top;
		else if(temp.series2 && temp.series2.text)
		    temp.series2.text.style.top=temp.style.top;
		temp.txtleg.style.left=temp.txtleg.initleft-15;
		temp.colleg.style.left=temp.colleg.initleft-15;
		Stop=setTimeout("moveup(temp)",15);
	}else{
	    clearTimeout(Stop);
		return;
	} 
}

//独立函数:饼图下沉
function movedown(iteam,istimeout)
{
	temp=eval(iteam);
	temp.state="down";
    if(null==temp.inittop)    {        temp.inittop=temp.style.top;		temp.txtleg.initleft=temp.txtleg.style.posLeft;
		temp.colleg.initleft=temp.colleg.style.posLeft;
    }
	var at=parseInt(temp.style.top);	var inittop=parseInt(temp.inittop);
    var ctrl=temp;
	if(at<inittop && true!=istimeout)
	{
		temp.style.top=at+1;
		Stop=setTimeout("movedown(temp)",15);
	}else{
	    clearTimeout(Stop);
	    temp.style.top=temp.inittop;
	    temp.state=null;
	    temp=null;
	} 
	
    if(ctrl.series2)
        ctrl.series2.style.top=ctrl.style.top;
    if(ctrl.text)
        ctrl.text.style.top=ctrl.style.top;
    else if(ctrl.series2 && ctrl.series2.text)
        ctrl.series2.text.style.top=ctrl.style.top;
    ctrl.txtleg.style.left=ctrl.txtleg.initleft;
    ctrl.colleg.style.left=ctrl.colleg.initleft;
	return;
}

  
    function Olegend(){
        var obj= new Object;
        obj.show = true;
        obj.textWidth = 70;
        return obj;
        }
       
    //参数1线条的颜色，参数2线条的宽度，参数3线条的类型，参数4转折点的类型,参数5线条名称
    //#FF0000,1.5,1,2,公司1
    //"#0000FF,1,2,3,公111司11112" 
    //"#004D00,1,1,3,公司3" 
    function Oline(){
        var obj     =   new Object;
        obj.color   =   new Array();
        obj.strong  =   new Array();
        obj.style   =   new Array();
        obj.spot    =   new Array();
        obj.name    =   new Array();
        
        obj.color[0]   = '#FF0000';
        obj.strong[0]  = 1.5;
        obj.style[0]   = 1;
        obj.spot[0]   = 2;
        obj.name[0]   = '示例1';

        obj.color[1]  = '#0000FF';
        obj.strong[1] = 1;
        obj.style[1]  = 2;
        obj.spot[1]   = 3;
        obj.name[1]   = '示例2';
        
        obj.color[2]  = '#004D00';
        obj.strong[2] = 1;
        obj.style[2]  = 1;
        obj.spot[2]   = 2;
        obj.name[2]   = '示例3';
        
        obj.color[3]  = 'yellow';
        obj.strong[3] = 1;
        obj.style[3]  = 1;
        obj.spot[3]   = 2;
        obj.name[3]   = '示例4';
        return obj;
    }

  //横坐标，纵坐标，图表的宽度，图表的高度,折线条数,横向放大倍数,纵向放大倍数
  function Ochart(){
        var obj= new Object;
        
        obj.width  = 600;
        obj.height = 200;

        obj.x  = 0;
        obj.y  = 0;

        obj.number  = 1;
        obj.scalex  = 1;
        obj.scaley  = 1;
        
        obj.bgcolor  = "#9cf";
        return obj;
    }
    




 function   mChartLinePlus(total,ochart,oline,olegend,dvId)
  {   

  //参数含义(字段名,传递的数组，横坐标，纵坐标，图表的宽度，图表的高度,折线条数,横向放大倍数,纵向放大倍数)   
  var   line_color   =   "#69f";   
  var   left_width   =   70;   
  var   total_no   =   total[1].length
  
  //if(total[1].length>10) total_no = 10
  
  var   temp1,temp2,temp3   
  temp1   =   0;   
  for(var i=0;i<total_no;i++)   
  {   
	  for(var   j=1;j<=ochart.number;j++)   
	  {   
	    var val = ToolUtil.Convert(total[j][i],"number");
	  if(temp1<val)   
	  temp1   =   val;   
	  }   
  }   
    
  temp1   =   parseInt(temp1);   
  if(temp1>9)   
  {   
  temp2   =   temp1.toString().substr(1,1);   
  if(temp2>4)   
  {   
  temp3   =   (parseInt(temp1/(Math.pow(10,(temp1.toString().length-1))))+1)*Math.pow(10,(temp1.toString().length-1));   
  }   
  else   
  {   
  temp3   =   (parseInt(temp1/(Math.pow(10,(temp1.toString().length-1))))+0.5)*Math.pow(10,(temp1.toString().length-1))   
  }   
  }   
  else   
  {   
  if(temp1>4)   
  {   
  temp3   =   10;     
  }   
  else   
  {   
  temp3   =   5;   
  }   
  }   
  temp4   =   temp3;   
 strchart = '<v:group id=zuvml3 contentEditable=false style="Z-INDEX:3019;LEFT:-40;WIDTH:'+ochart.width+';TOP:5;HEIGHT:'+ochart.height+'" coordsize="'+ochart.width*ochart.scalex+','+ochart.height*ochart.scaley+'">';
 strchart += "<v:rect   id='_x0000_s1027'   alt=''   style='left:"   +   (ochart.x   +   left_width)   +   ";top:"   +   ochart.y   +   ";width:"   +   ochart.width   +   ";height:"   +   ochart.height   +   ";z-index:-1'   fillcolor='"+ochart.bgcolor+"'   stroked='f'><v:fill   rotate='t'   angle='-45'   focus='100%'   type='gradient'/></v:rect>";
 

  for(var   i=0;i<ochart.height;i   +=   ochart.height/10)
  {   
  strchart += "<v:line   id='_x0000_s1027'   alt=''   style=';left:0;text-align:left;top:0;flip:y;z-index:-1'   from='"   +   (ochart.x   +   left_width   +   length)   +   ","   +   (ochart.y   +   ochart.height   -   length   -   i)   +   "'   to='"   +   (ochart.x   +   ochart.width   +   left_width)   +   ","   +   (ochart.y   +   ochart.height   -   length   -   i)   +   "'   strokecolor='"   +   line_color   +   "'/>"; 
  strchart += "<v:line   id='_x0000_s1027'   alt=''   style=';left:0;text-align:left;top:0;flip:y;z-index:-1'   from='"   +   (ochart.x   +   (left_width   -   15))   +   ","   +   (ochart.y   +   i)   +   "'   to='"   +   (ochart.x   +   left_width)   +   ","   +   (ochart.y   +   i)   +   "'/>";
  strchart += "<v:shape   id='_x0000_s1025'   type='#_x0000_t202'   alt=''   style=';left:"   +   ochart.x   +   ";top:"   +   (ochart.y   +   i)   +   ";width:"   +   left_width   +   ";height:18;z-index:1'>"; 
  strchart += "<v:textbox   inset='0,0,0,0'><table   cellspacing='3'   cellpadding='0'   width='100%'   height='100%'><tr><td   align='right'>"   +   temp4   +   "</td></tr></table></v:textbox></v:shape>"; 
  temp4   =   temp4   -   temp3/10;   
  }  
  


  
  strchart += "<v:line   id='_x0000_s1027'   alt=''   style=';left:0;text-align:left;top:0;flip:y;z-index:-1'   from='"   +   (ochart.x   +   left_width)   +   ","   +   (ochart.y   +   ochart.height)   +   "'   to='"   +   (ochart.x   +   ochart.width   +   left_width)   +   ","   +   (ochart.y   +   ochart.height)   +   "'/>";
  strchart += "<v:line   id='_x0000_s1027'   alt=''   style=';left:0;text-align:left;top:0;flip:y;z-index:-1'   from='"   +   (ochart.x   +   left_width)   +   ","   +   ochart.y   +   "'   to='"   +   (ochart.x   +   left_width)   +   ","   +   (ochart.y   +   ochart.height)   +   "'/>";


  strchart += "<div id=dv"+dvId+"></div></v:group>"; 
  
  var oparam = new Object; 
  oparam.strchart = strchart;
  oparam.temp = temp3;
  oparam.totalno = total_no;
  oparam.left_width=left_width;
  return oparam;

  //取线参数 "#004D00,1,1,3,公司3"

}
 
 
 function drawChartpart2(total,ochart,oline,olegend,oparam)
 {
 
   //参数含义(字段名,传递的数组，横坐标，纵坐标，图表的宽度，图表的高度,折线条数,横向放大倍数,纵向放大倍数)   
  var   line_color   =   "#69f";   
  var   tmpStr   =   ""  
  var strchart="";
  var temp3=oparam.temp;
  var total_no=oparam.totalno;
  var left_width=oparam.left_width;

  for(i=0;i<ochart.number;i++)   
  {   
  var   re     =   /,/g;   
  tmpStr   +=   ",[\""   +   (oline.color[i]+','+oline.strong[i]+','+oline.style[i]+','+oline.spot[i]+','+oline.name[i]).replace(re,"\",\"")   +   "\"]"   
  }   
   
  tmpStr   =   tmpStr.substr(1,tmpStr.length-1)   
  var   line_code   =   eval("new   Array("   +   tmpStr   +   ")")  
  var mstr ="";
  for(var   j=1;j<=ochart.number;j++)   
  {   
  
      for(var   i=0;i<total_no;i++)   
      {   
            var   x1   =   ochart.x   +   left_width   +   ochart.width   *   i/(total_no)   
            var   y1   =   ochart.y   +   (temp3   -   total[j][i])   *   (ochart.height/temp3) 
            var   x2   =   ochart.x   +   left_width   +   ochart.width   *   i/(total_no)   
            var   y2   =   ochart.y   +   (temp3   -   total[j][i])   *   (ochart.height/temp3)   
            mstr  =oline.name[j-1]+":"+total[j][i];
            var   x21=0;
            var   y21=0;
            if(i>0)
            {
                x21   =   ochart.x   +   left_width   +   ochart.width   *   (i-1)/(total_no)   
                y21   =   ochart.y   +   (temp3   -   total[j][i-1])   *   (ochart.height/temp3)   
            }
            else
            {
                x21=x2;
                y21=y2;
            }
            strchart += "<v:line   id='_x0000_s1025'  style=';left:0;text-align:left;top:0;z-index:1'   from='"   +   x1   +   ","   +   y1   +   "'   to='"   +   x21   +   ","   +   y21   +   "'   coordsize='21600,21600'   strokecolor='"   +   line_code[j-1][0]   +   "'   strokeweight='"   +   line_code[j-1][1]   +   "'>";   

            switch   (parseInt(line_code[j-1][2]))   
            {   
                  case   1:   
                  break;   
                  case   2:   
                  strchart += "<v:stroke   dashstyle='1   1'/>";   
                  break;   
                  case   3:   
                  strchart += "<v:stroke   dashstyle='dash'/>";   
                  break;   
                  case   4:   
                  strchart += "<v:stroke   dashstyle='dashDot'/>";   
                  break;   
                  case   5:   
                  strchart += "<v:stroke   dashstyle='longDash'/>";   
                  break;   
                  case   6:   
                  strchart += "<v:stroke   dashstyle='longDashDot'/>";   
                  break;   
                  case   7:   
                  strchart += "<v:stroke   dashstyle='longDashDotDot'/>";   
                  break;   
            }   
            strchart += "</v:line>";
            switch(parseInt(line_code[j-1][3]))   
            {   
              case   1:   
              break;   
              case   2:   
              strchart += "<v:rect   id='_x0000_s1027' title='"+mstr+"'  style='cursor:hand;left:"   +   (x1   -   2)   +   ";top:"   +   (y1   -   2)   +   ";width:4;height:4;   z-index:2'   fillcolor='"   +   line_code[j-1][0]   +   "'   strokecolor='"   +   line_code[j-1][0]   +   "'/>";   
              break;   
              case   3:   
              strchart += "<v:oval   id='_x0000_s1026' title='"+mstr+"'  style='cursor:hand;left:"   +   (x1   -   2)   +   ";top:"   +   (y1   -   2)   +   ";width:4;height:4;z-index:1'   fillcolor='"   +   line_code[j-1][0]   +   "'   strokecolor='"   +   line_code[j-1][0]   +   "'/>";   
              break;   
            }   
        }   
   }   
    

  for(var   i=0;i<total_no;i++)   
  {   
      strchart += "<v:line   id='_x0000_s1027'   alt=''   style=';left:0;text-align:left;top:0;flip:y;z-index:-1'   from='"   +   (ochart.x   +   left_width   +   ochart.width   *   (i)/(total_no))   +   ","   +   (ochart.y   +   ochart.height)   +   "'   to='"   +   (ochart.x   +   left_width   +   ochart.width   *   (i)/(total_no))   +   ","   +   (ochart.y   +   ochart.height   +   15)   +   "'/>";   
      strchart += "<v:shape   id='_x0000_s1025'   type='#_x0000_t202'   alt='' path='M 50,303 L 94,280' fillcolor='#373753' style='font-family=Arial; font-size=8pt;left:"   +   (ochart.x   +   left_width   +   ochart.width   *   (i)/(total_no))   +   ";top:"   +   (ochart.y   +   ochart.height)   +   ";width:"   +   (ochart.width/(total_no))   +   ";height:18;z-index:1'>";   
      strchart += " <v:stroke on='0' /><v:path textpathok='t' /><v:textpath on='1' string='"+total[0][i]+"' /></v:shape>"
  }   
    
  var   tb_height   =   20   
  var legendwidth = olegend.textWidth +  30 +10;
  if(olegend.show)
  {
      strchart += "<v:rect   id='_x0000_s1025'   style=';left:"   +   (ochart.x   +   ochart.width   +   20)   +   ";top:"   +   ochart.y   +   ";width:"+legendwidth+";height:"   +   (ochart.number   *   tb_height   +   20)   +   ";z-index:1'/>";   
      for(var   i=0;i<ochart.number;i++)   
      {   
          strchart += "<v:shape   id='_x0000_s1025'   type='#_x0000_t202'   alt=''   style=';left:"   +   (ochart.x   +   ochart.width   +   25)   +   ";top:"   +   (ochart.y   +   5+(i)   *   tb_height)   +   ";width:"+olegend.textWidth+";height:"   +   tb_height   +   ";z-index:1'>";   
          strchart += "<v:textbox   inset='0,0,0,0'><table   cellspacing='3'   cellpadding='0'   width='100%'   height='100%'><tr><td   align='left'>"   +   line_code[i][4]   +   "</td></tr></table></v:textbox></v:shape>";   
          strchart += "<v:rect   id='_x0000_s1040'   alt=''   style=';left:"   +   (ochart.x   +   ochart.width   +   20 + olegend.textWidth)   +   ";top:"   +   (ochart.y   +   5+(i)   *   tb_height   +   4)   +   ";width:30;height:10;z-index:1'   fillcolor='"   +   line_code[i][0]   +   "'><v:fill   color2='"   +   line_code[i][0]   +   "'   rotate='t'   focus='100%'   type='gradient'/></v:rect>";
      }
  }    
  

 return strchart; 
 }
 
//文件结尾
if (typeof(GridUtil)!="undefined") GridUtil.FileLoaded=true;