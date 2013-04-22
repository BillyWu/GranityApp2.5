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
    if(!document.ChartList)
        document.ChartList=new Array();
	var chartList=document.ChartList;
	if(!chartName || ""==chartName)
		if(!chartList)
			chartName="Chart0";
		else
			chartName="Chart"+chartList.length;
	var i=0;	//在数组中为空的序号
	for(;i<chartList.length;i++)
	{
		if(!chartList[i])
		    break;
		if(chartName==chartList[i].chartName)
			break;
	}
	chartList[i]=new function()
	{
		this.chartName=chartName;
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
    
    
    // 1 初始化参数：横坐标，纵坐标位置(XY偏移量)，图表的宽度，图表的高度，数据集，X坐标点数或增量(由增量及宽度算出点数)，
    //   Y轴起点值(没有固定值则取数据集中最小值)，X轴起点值为数据中的最小值
    // 2 由XY坐标偏移量定出坐标原点位置、由图表高、宽定出图表区大小、纵轴最大值为Y数据最大值
    //
    //
    
    //初始化属性
    this.Width=this.Element.style.posWidth;       //vml group的宽度
    this.Height=this.Element.style.posHeight;     //vml group的高度
    this.SizeX=this.Width;                        //vml group的宽度转为X长度
    this.SizeY=this.Height;                       //vml group的高度转为Y长度
    this.OffsetX=-this.Element.coordorigin.x;     //Chart坐标偏移量
    this.OffsetY=-this.Element.coordorigin.y;     //Chart坐标偏移量

    //模板内容
    this.VertBarSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalBar");
    this.VerLineSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","verticalLine");
    this.PipeSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipe");
    this.PipeTSamp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","pipeT");
    this.DivData=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","data");
    this.DivText=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","text");
    this.DivTemp=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","template");
    this.GroupLegend=ToolUtil.getCtrlByNameD(false,this.Element,"chartElement","legend");
    
    this.CtrlInnerHTML=this.DivTemp.innerHTML;
    this.PipeSamp.serHTML=this.PipeSamp.innerHTML;
    this.PipeTSamp.serTHTML=this.PipeTSamp.innerHTML;
    this.GroupLegend.legHTML=this.GroupLegend.innerHTML;
    //图表区,背景布,X轴,Y轴
    this.RefFrame=new RefFrame(this);
    this.BgWall=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","bgWall");
    var axisX=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisX");
    this.AxisX=new Axis(axisX,"X",this);
    var axisY=ToolUtil.getCtrlByNameD(false,this.VmlGroup,"chartElement","axisY");
    this.AxisY=new Axis(axisY,"Y",this);
 
    //立方柱属性:宽度,图表数据查看方式:ByCol 按照列方式(默认),ByRow 按照行方式
    this.BarAttr=new function(){ this.Width=20;this.DataViewPoint="ByCol"};
    
    this.BgWall.style.width=this.SizeX;
    this.BgWall.style.height=this.SizeY;
    this.BgWall.style.left=-this.OffsetX;
    this.BgWall.style.top=-this.OffsetY;
    this.Radius=this.SizeY/3;
    
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
    if(!this.Element.series || !this.Element.legend)
        return;
    this.LegendList=this.Element.legend.split(",");
    this.SeriesList=this.Element.series.split(",");
    if(this.LegendList.length<1 || this.SeriesList.length<1)
        return;
	//计算一个合适的数据范围
	this.AxisX.Scale=ToolUtil.Convert(this.Element.getAttribute("scalex"),"number");
	this.AxisY.Scale=ToolUtil.Convert(this.Element.getAttribute("scaley"),"number");
	this.AxisX.RadixPositive=ToolUtil.Convert(this.Element.getAttribute("radixposx"),"number");
	this.AxisY.RadixPositive=ToolUtil.Convert(this.Element.getAttribute("radixposy"),"number");
	this.AxisX.Spacing=ToolUtil.Convert(this.Element.getAttribute("spacx"),"number");
	this.AxisY.Spacing=ToolUtil.Convert(this.Element.getAttribute("spacy"),"number");
	var vp=this.Element.getAttribute("dataviewpoint");
	var chartType=this.Element.getAttribute("charttype");
	this.SetChartType(chartType,vp);
	var spacingDate=this.Element.getAttribute("spacd");
	this.AxisX.SpacingDate=spacingDate;
	this.AxisY.SpacingDate=spacingDate;
	var val=this.Element.getAttribute("labelwx");
	if(val)
	    this.AxisX.LabelAttr.Width=val;
	var val=this.Element.getAttribute("labelhx");
	if(val)
	    this.AxisX.LabelAttr.Height=val;
	var val=this.Element.getAttribute("labelwy");
	if(val)
	    this.AxisY.LabelAttr.Width=val;
	var val=this.Element.getAttribute("labelhy");
	if(val)
	    this.AxisY.LabelAttr.Height=val;
	
	var myUnitItem=document.UnitItem;
	if(!this.ItemName)  return;
    var band=myUnitItem.getBandByItemName(this.ItemName);
	band.Chart=this;
	this.Band=band;
}
//初始化数据环境,坐标轴(横轴,纵轴,表盘圆轴)比例,起点基点,刻度线间距
_p.initData=function()
{
    var band=this.Band;
    if(!band || band.RecordCount()<1)   return;
	//饼图坐标初始化
	if("Pipe"==this.ChartType)
	{
	    this.AxisX.ValMin=-this.Radius*3/2;
	    this.AxisX.ValMax=this.Radius*3/2;
	    this.AxisY.ValMin=-this.Radius*3/2;
	    this.AxisY.ValMax=this.Radius*3/2;
	    this.AxisX.MeasureType="none";
	    this.AxisY.MeasureType="none";
	    return;
	}
	//表盘坐标
	if("Dial"==this.ChartType)
	{
	    this.AxisX.ValMin=-this.Radius*3/2;
	    this.AxisX.ValMax=this.Radius*3/2;
	    this.AxisY.ValMin=-this.Radius*3/2;
	    this.AxisY.ValMax=this.Radius*3/2;
	    this.AxisX.MeasureType="none";
	    this.AxisY.MeasureType="none";
	    return;
	}
	//直方图和折线坐标初始化;纵轴
    var max=this.Band.getFldStrValue(this.SeriesList[0],0);
    var max=ToolUtil.Convert(max,"number");
    var min=max;
    var rowcount=band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.SeriesList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.SeriesList[i],r);
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
    var max=this.Band.getFldStrValue(this.LegendList[0],0);
    var max=ToolUtil.Convert(max,dbtype);
    var min=max;
    var rowcount=band.RecordCount();
    for(var r=0;r<rowcount;r++)
	    for(var i=0;i<this.LegendList.length;i++)
	    {
	        var val=this.Band.getFldStrValue(this.LegendList[i],r);
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
        axis.StartDate=min;                    //最小值应取秒整数
        axis.EndDate=max;                      //最大值应根据坐标横轴取固定长度对应的值
        var spaclen=Math.ceil(axis.EndDate.diffDate(axis.StartDate)/axis.SpacingDate);
        axis.ValMax=spaclen*axis.Spacing+axis.Spacing/2;
        axis.RadixPositive=0;
        axis.ValMin=0;
	}
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
_p.Example=function()
{
        var vmlChart=new Chart(document.getElementById('test'));
        //初始化图表区域大小,原点定位(相对于原左上角坐标数据)
        vmlChart.initialise(600,500,600,500,300,100);
        
        //图表坐标属性:坐标数据范围,刻度间隔,标签属性,正/负半轴基数
        vmlChart.AxisX.Scale=1;
        vmlChart.AxisX.RadixPositive=0;
        vmlChart.AxisX.RadixMinus=0;
        
        vmlChart.AxisX.ValMin=-250;
        vmlChart.AxisX.ValMax=250;
        vmlChart.AxisX.Spacing=50;
        vmlChart.AxisX.LabelAttr.Width=50;
        vmlChart.AxisX.LabelAttr.Height=15;
        vmlChart.AxisX.AutoDate=true;
        
        vmlChart.AxisY.ValMin=-200;
        vmlChart.AxisY.ValMax=200;
        vmlChart.AxisY.Spacing=20;
        vmlChart.AxisY.LabelAttr.Width=20;
        vmlChart.AxisY.LabelAttr.Height=15;
        vmlChart.AxisY.RadixPositive=0;
        vmlChart.AxisY.RadixMinus=0;
        vmlChart.AxisY.AutoDate=true;
        
        vmlChart.ChartType="pipe";
        vmlChart.Radius=200;
        
        vmlChart.XmlLandData=document.getElementById("dataLand2");
        vmlChart.LegendList[vmlChart.LegendList.length]="名称";
        vmlChart.SeriesList[vmlChart.SeriesList.length]="比例";

        vmlChart.Draw("pipe");
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
            this.AxisSeries=this.AxisX;
            this.AxisLegend=this.AxisY;
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
    if(this.AxisX.Spacing>0)
    {
        this.AxisX.ValMin2=Math.floor(this.AxisX.ValMin/this.AxisX.Spacing)*this.AxisX.Spacing;
        this.AxisX.ValMax2=Math.floor(this.AxisX.ValMax/this.AxisX.Spacing)*this.AxisX.Spacing;
    }else{
        this.AxisX.ValMin2=this.AxisX.ValMin;
        this.AxisX.ValMax2=this.AxisX.ValMax;
    }
    if(this.AxisY.Spacing>0)
    {
        this.AxisY.ValMin2=Math.floor(this.AxisY.ValMin/this.AxisY.Spacing)*this.AxisY.Spacing;
        this.AxisY.ValMax2=Math.floor(this.AxisY.ValMax/this.AxisY.Spacing)*this.AxisY.Spacing;
    }else{
        this.AxisY.ValMin2=this.AxisY.ValMin;
        this.AxisY.ValMax2=this.AxisY.ValMax;
    }
    this.AxisX.draw();
    this.AxisY.draw();
    /*
        //测试坐标线
    var line=document.createElement('<v:line from="0,0" to="90,0" spacing="10" style="POSITION:absolute" strokeweight="1pt"><v:stroke EndArrow="classic"/></v:line>');
    var line=this.VmlGroup.appendChild(line);
    line.to="500,-400";
    var line=this.VmlGroup.appendChild(line.cloneNode(true));
    line.from="0,-100";
    line.to="500,-400";
    */
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
    
    //this.SizeX=this.Element.coordsize.x;
    //this.SizeY=this.Element.coordsize.y;
    //this.OffsetX=-this.Element.coordorigin.x;
    //this.OffsetY=-this.Element.coordorigin.y;
    //this.RefFrame.DirectX=this.SizeX/this.Width;
    //this.RefFrame.DirectY=this.SizeY/this.Height;
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
    this.DrawLegend();
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
    if("verline"==chartType || "horline"==chartType)
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
    }else if("dial"==chartType){
        for(var i=0;i<legsum;i++)
        {
            var colleg=colorLeg.cloneNode(true);
            var txtleg=textLeg.cloneNode(true);
            colleg=DivDataLegend.appendChild(colleg);
            txtleg=DivDataLegend.appendChild(txtleg);
            colleg.style.top=colorLeg.style.posTop+legendSpacing*i;
            txtleg.style.top=textLeg.style.posTop+legendSpacing*i;
            var val=this.Band.getFldStrValue(this.LegendList[0],i);
            txtleg.innerHTML=val;
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

//仪表盘
_p.DrawDial=function()
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
            val=ToolUtil.Convert(val,"decimal");
            var y=this.AxisY.transCoord(val);
            if(!serPath[k])
                serPath[k] =  "m "+Math.round(x)+","+Math.round(y)+" l ";
            else
                serPath[k] += Math.round(x)+","+Math.round(y)+",";
            
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

//坐标轴;axisElem:坐标轴直线;axisType:坐标轴类型 'X','Y','Z',refFram 使用的坐标系
function Axis(axisElem,axisType,chart)
{
    this.ElemSimp=axisElem;
    //坐标轴元素,坐标轴类型,坐标轴使用的坐标系
    this.AxisType=axisType;
    this.RefFrame=chart.RefFrame;
    this.ChartGroup=chart.VmlGroup;
    this.VmlChart=chart;
    //最小刻度值,大刻度单位,起点基数,比例系数,最大值最小值;
    //RadixPositive正数的起点基数,RadixMinus负数的起点基数
    this.Interval=1;
    this.Spacing=10;
    this.RadixPositive=0;
    this.RadixMinus=0;
    this.Scale=1;
    this.ValMin=0;
    this.ValMax=100;
    //如果是时间轴,要设置时间轴的开始日期,结束日期;刻度为日期刻度
    //如果AutoDate,根据数据自动设置最小日期为开始日期,最大日期为结束日期,刻度为日期刻度
    this.AutoDate=true;
    this.StartDate=null;
    this.EndDate=null;
    
    //坐标轴刻度类型:numeric,none,string,date
    this.MeasureType="numeric";
    this.DispFormat="";
    this.Labels=new Array();
    this.MeasureList=ToolUtil.getCtrlListByNameD(false,this.ChartGroup,"chartGroup",axisElem.chartGroup);
    this.MeasHTMLs=new Array();
    for(var i=0;i<this.MeasureList.length;i++)
        this.MeasHTMLs[i]=this.MeasureList[i].innerHTML;
    this.LabelAttr=new function(){
        this.Width=15;
        this.Height=15;
    }
}

var _p=Axis.prototype;
_p.draw=function()
{
    var ctrl=this.ElemSimp.cloneNode(true);
    var ctrl=this.VmlChart.DivData.appendChild(ctrl);
    ctrl.setAttribute("appendElement","true");
    if(!this.axisinnerHTML)
        this.axisinnerHTML=this.ElemSimp.innerHTML;
    ctrl.innerHTML=this.axisinnerHTML;
    this.Element=ctrl;
    this.Element.Axis=this;

    if("none"==this.MeasureType)
        return;
    if("X"==this.AxisType)
        this.Element.from=this.transCoord(this.ValMin)+",0";
    else
        this.Element.from="0,"+this.transCoord(this.ValMin);

    if("X"==this.AxisType)
        this.Element.to=this.transCoord(this.ValMax)+",0";
    else
        this.Element.to="0,"+this.transCoord(this.ValMax);
    //如果是文本
    if("string"==this.MeasureType)
        return;
    //如果是日期
    if("date"==this.MeasureType)
    {
        var spacsum=Math.round((this.ValMax2-this.RadixPositive)/this.Spacing);
        if(!isNaN(spacsum) && 0!=spacsum)
            if(this.EndDate.diffDate(this.StartDate)<spacsum)
                this.SpacingDate=Math.ceil(this.EndDate.diffDate(this.StartDate)/spacsum/this.Spacing)*this.Spacing;
            else
                this.SpacingDate=Math.ceil(this.EndDate.diffDate(this.StartDate)/spacsum);
        this.drawMeasure();
    }
    //如果是数据刻度
    if("numeric"==this.MeasureType)
        this.drawMeasure();
    
}

//画坐标刻度线
_p.drawMeasure=function()
{
    if(this.Spacing<=0)     return;
    //负半轴刻度值
    if(this.ValMin<0)
    {
        var valMeas=this.RadixMinus-this.Spacing;
        while(valMeas>this.ValMin)
        {
            //由刻度值转换为Group坐标值
            var val=this.transCoord(valMeas);
            for(var k=0;k<this.MeasureList.length;k++)
            {
                var ctrlMeasure=this.MeasureList[k];
                if("measure"==ctrlMeasure.chartElement)
                {
                    var ctrl=ctrlMeasure.cloneNode(true);
                    var ctrl=this.VmlChart.DivData.appendChild(ctrl);
                    ctrl.setAttribute("appendElement","true");
                    ctrl.style.display=null;
                    if("X"==this.AxisType)
                    {
                        var axisY=this.VmlChart.AxisY;
                        ctrl.from=val+","+axisY.transCoord(axisY.ValMin2);
                        ctrl.to=val+","+axisY.transCoord(axisY.ValMax2);
                    }else if("Y"==this.AxisType){
                        var axisX=this.VmlChart.AxisX;
                        ctrl.from=axisX.transCoord(axisX.ValMin2)+","+val;
                        ctrl.to=axisX.transCoord(axisX.ValMax2)+","+val;
                    }
                }
                if("measureT"==ctrlMeasure.chartElement)
                {
                    var ctrl=ctrlMeasure.cloneNode(true);
                    var ctrl=this.VmlChart.DivText.appendChild(ctrl);
                    ctrl.setAttribute("appendElement","true");
                    if("X"==this.AxisType)
                    {
                        var axisY=this.VmlChart.AxisY;
                        ctrl.style.top=this.RefFrame.transTextCoordY(0);
                        ctrl.style.left=this.transTextCoord(valMeas-this.LabelAttr.Width/2);
                        ctrl.style.width=this.LabelAttr.Width;
                        ctrl.style.height=this.LabelAttr.Height;
                    }else if("Y"==this.AxisType){
                        var axisX=this.VmlChart.AxisX;
                        ctrl.style.top=this.transTextCoord(valMeas-this.LabelAttr.Height/2);
                        ctrl.style.left=this.RefFrame.transTextCoordX(-this.LabelAttr.Width);
                        ctrl.style.width=this.LabelAttr.Width;
                        ctrl.style.height=this.LabelAttr.Height;
                    }
                    if("numeric"==this.MeasureType)
                        ctrl.innerHTML=valMeas;
                }
            }
            var valMeas=valMeas-this.Spacing;
        }
    }
    //正半轴
    if(this.ValMax>0)
    {
        var valMeas=this.RadixPositive+this.Spacing;
        if("date"==this.MeasureType)
            var dtMeas=this.StartDate.addDate(this.SpacingDate);
        while(valMeas<this.ValMax)
        {
            //由坐标刻度值转换为Group坐标值
            var val=this.transCoord(valMeas);
            for(var k=0;k<this.MeasureList.length;k++)
            {
                var ctrlMeasure=this.MeasureList[k];
                if("measure"==ctrlMeasure.chartElement)
                {
                    var ctrl=ctrlMeasure.cloneNode(true);
                    var ctrl=this.VmlChart.DivData.appendChild(ctrl);
                    ctrl.setAttribute("appendElement","true");
                    if("X"==this.AxisType)
                    {
                        var axisY=this.VmlChart.AxisY;
                        ctrl.from=val+","+axisY.transCoord(axisY.ValMin2);
                        ctrl.to=val+","+axisY.transCoord(axisY.ValMax2);
                    }else if("Y"==this.AxisType){
                        var axisX=this.VmlChart.AxisX;
                        ctrl.from=axisX.transCoord(axisX.ValMin2)+","+val;
                        ctrl.to=axisX.transCoord(axisX.ValMax2)+","+val;
                    }
                    ctrl.innerHTML=this.MeasHTMLs[k];
                }
                if("measureT"==ctrlMeasure.chartElement)
                {
                    var ctrl=ctrlMeasure.cloneNode(true);
                    var ctrl=this.VmlChart.DivText.appendChild(ctrl);
                    ctrl.setAttribute("appendElement","true");
                    if("X"==this.AxisType)
                    {
                        var axisY=this.VmlChart.AxisY;
                        ctrl.style.top=this.RefFrame.transTextCoordY(-5);
                        ctrl.style.left=this.transTextCoord(valMeas)-this.LabelAttr.Width/2;
                        ctrl.style.width=this.LabelAttr.Width;
                        ctrl.style.height=this.LabelAttr.Height;
                    }else if("Y"==this.AxisType){
                        var axisX=this.VmlChart.AxisX;
                        ctrl.style.top=this.transTextCoord(valMeas)-this.LabelAttr.Height/2;
                        ctrl.style.left=this.RefFrame.transTextCoordX(-this.LabelAttr.Width);
                        ctrl.style.width=this.LabelAttr.Width;
                        ctrl.style.height=this.LabelAttr.Height;
                    }
                    if("numeric"==this.MeasureType)
                        ctrl.innerHTML=valMeas;
                    else if("date"==this.MeasureType && this.DispFormat)
                        ctrl.innerHTML=dtMeas.formate(this.DispFormat);
                    else if("date"==this.MeasureType )
                        ctrl.innerHTML=dtMeas.formate("yyyy-MM-dd");
                }
            }
            var valMeas=valMeas+this.Spacing;
            if("date"==this.MeasureType)
                var dtMeas=dtMeas.addDate(this.SpacingDate);
        }
    }
}

//由坐标轴坐标转换为Group正则坐标系数据
_p.transRefFrameCoord=function(x)
{
    if(null!=x)
    {
        if( (x<0 && x>this.RadixMinus) || (x>0 && x<this.RadixPositive) || x==0 )
            x=0;
        else if(x>0 && x>this.RadixPositive)
            x=x-this.RadixPositive;
        else if(x<0 && x<this.RadixMinus)
            x=x-this.RadixMinus;
        x=x/this.Scale;
    }
    return x;
}
//由坐标轴坐标转换为Group内坐标系数据
_p.transCoord=function(x)
{
    x=this.transRefFrameCoord(x);
    if("X"==this.AxisType)
        x=this.RefFrame.transCoordX(x);
    if("Y"==this.AxisType)
        x=this.RefFrame.transCoordY(x);
    return Math.round(x);
}
//由坐标轴坐标转换为Group文本坐标
_p.transTextCoord=function(x)
{
    x=this.transRefFrameCoord(x);
    if("X"==this.AxisType)
        x=this.RefFrame.transTextCoordX(x);
    if("Y"==this.AxisType)
        x=this.RefFrame.transTextCoordY(x);
    return Math.round(x);
}

//建立坐标系统对象,管理系统坐标,及坐标轴坐标,及实际画图的坐标转换
function  RefFrame(objChart)
{
    this.DirectX=1;
    this.DirectY=-1;

    this.VmlChart=objChart;
}

var _p=RefFrame.prototype;

//由坐标系坐标转换Group内坐标
_p.transCoord=function(x,y)
{
    if(null!=x)
        x=x*this.DirectX;
    if(null!=y)
        y=y*this.DirectY;
    if(null!=x && null!=y)
        return x+","+y;
    if(null!=y && null==x)
        return y;
    if(null!=x && null==y)
        return x;
    return null;
}
_p.transCoordX=function(x)
{
    return x*this.DirectX;
}
_p.transCoordY=function(y)
{
    return y*this.DirectY;
}

//以Group左上角为原点坐标数据转换为Group内坐标数据
_p.transCoordByOffset=function(x,y)
{
    if(null!=x)
        x=(x-this.VmlChart.OffsetX)*this.DirectX;
    if(null!=y)
        y=(-y+this.VmlChart.OffsetY)*this.DirectY;
    if(null!=x && null!=y)
        return x+","+y;
    if(null!=x && null==y)
        return x;
    if(null==x && null!=y)
        return y;
    return null;
}

_p.transCoordXByOffset=function(x)
{
    if(null!=x)
        x=(x-this.VmlChart.OffsetX)*this.DirectX;
    return x;
}
_p.transCoordYByOffset=function(y)
{
    if(null!=y)
        y=(-y+this.VmlChart.OffsetY)*this.DirectY;
    return y;
}

//以正则坐标系数据转换为Group左上角为原点的坐标数据(文本显示使用)
_p.transTextCoord=function(x,y)
{
    if(null!=x)
        x=(x+this.VmlChart.OffsetX)*this.DirectX;
    if(null!=y)
        y=(y-this.VmlChart.OffsetY)*this.DirectY;
    if(null!=x && null!=y)
        return x+","+y;
    if(null!=x && null==y)
        return x;
    if(null==x && null!=y)
        return y;
    return null;
}

_p.transTextCoordX=function(x)
{
    if(null!=x)
        x=(x+this.VmlChart.OffsetX)*this.DirectX;
    return x;
}
_p.transTextCoordY=function(y)
{
    if(null!=y)
        y=(y-this.VmlChart.OffsetY)*this.DirectY;
    return y;
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
