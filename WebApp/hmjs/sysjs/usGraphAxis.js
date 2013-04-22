//------------------------------------------------------------
// Copyright (c) 2003-2004 LeadinSoft. All rights reserved.
// Version 1.0.1
// Ahthor dolphin
//------------------------------------------------------------
//首先坐标系要清晰:坐标轴坐标系, 由Group重新设定原点自定义的正则坐标系(y轴向上为正), Group内坐标系:最终画图坐标, Group内文本显示坐标
//Axis --> ReFrame --> ChartGroup:(绘图或文本)
//坐标轴坐标系统:有原点基数,放大系统,刻度间隔,是数学坐标系的反映,对应于具体数据的处理
//Group正则坐标系:由Group重新设定原点自定义的坐标系:是方便画图操作,y轴向上为正,可以有自己的比例系数;RefFrame
//Group内坐标系:是最终画图的坐标系;
//Group内文本坐标系:,以左上角为坐标原点向下为正坐标系


//建立坐标系统对象,管理系统坐标,及坐标轴坐标,及实际画图的坐标转换
function  RefFrame(objChart)
{
    //X轴向,Y轴向,D轴向,其中D轴向是表盘一刻度跟圆周度数比率
    this.DirectX=1;
    this.DirectY=-1;
    this.DirectD=5;

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
//表盘刻度跟圆周比例;一圆周360度
_p.transCoordD=function(d)
{
    return d*this.DirectD;
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

//坐标轴分2类:直线坐标轴Axis;表盘坐标轴AxisDial;
//坐标轴;axisElem:坐标轴直线;axisType:坐标轴类型 'X','Y','Z','D',refFram 使用的坐标系
function Axis(axisElem,axisType,chart)
{
    if(!axisElem || !axisType || !chart)
        return;
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
    //表盘起点与0度偏移量
    this.RotationOffset=0;
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

//由坐标轴坐标转换为Group正则坐标系数据
_p.transRefFrameCoord=function(x)
{
    if(null!=x)
    {
        if( (x<0 && x>this.RadixMinus) || (x>0 && x<this.RadixPositive) || x==0 )
            x=0;
        else if(x>0 && x>=this.RadixPositive)
            x=x-this.RadixPositive;
        else if(x<0 && x<=this.RadixMinus)
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
    if("D"==this.AxisType)
        x=this.RefFrame.transCoordD(x)+this.RotationOffset;
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
    if("D"==this.AxisType)
        x=this.RefFrame.transCoordD(x)+this.RotationOffset;
    return Math.round(x);
}

_p.draw=function()
{
    var elemAxisGroup=ToolUtil.getCtrlListByNameD(false,this.VmlChart.DivData,"chartGroup",this.ElemSimp.getAttribute("chartGroup"));
    if(elemAxisGroup)
        for(var i=0;i<elemAxisGroup.length;i++)
            elemAxisGroup[i].parentElement.removeChild(elemAxisGroup[i]);
    var elemAxisGroup=ToolUtil.getCtrlListByNameD(false,this.VmlChart.DivText,"chartGroup",this.ElemSimp.getAttribute("chartGroup"));
    if(elemAxisGroup)
        for(var i=0;i<elemAxisGroup.length;i++)
            elemAxisGroup[i].parentElement.removeChild(elemAxisGroup[i]);
    var ctrl=this.ElemSimp.cloneNode(true);
    var ctrl=this.VmlChart.DivData.appendChild(ctrl);
    ctrl.setAttribute("appendElement","true");
    if(!this.axisinnerHTML)
        this.axisinnerHTML=this.ElemSimp.innerHTML;
    ctrl.innerHTML=this.axisinnerHTML;
    this.Element=ctrl;
    this.Element.Axis=this;

    if("none"==this.MeasureType)
    {
        this.Element.style.display="none";
        return;
    }
    switch(this.AxisType)
    {
        case "X":
            this.Element.from=this.transCoord(this.ValMin)+",0";
            this.Element.to=this.transCoord(this.ValMax)+",0";
            break;
        case "Y":
            this.Element.from="0,"+this.transCoord(this.ValMin);
            this.Element.to="0,"+this.transCoord(this.ValMax);
            break;
        case "D":
            /*
            this.Element.style.left=Math.round(-this.VmlChart.Radius);
            this.Element.style.top=-Math.round(this.VmlChart.Radius);
            this.Element.style.width=2*Math.round(this.VmlChart.Radius);
            this.Element.style.height=2*Math.round(this.VmlChart.Radius);
            break; */
            var chartElem=this.VmlChart.Element;

            this.Element.style.width=chartElem.coordsize.x;
            this.Element.style.height=chartElem.coordsize.y;
            this.Element.style.left=chartElem.coordorigin.x;
            this.Element.style.top=chartElem.coordorigin.y;
            this.Element.setAttribute("coordsize",chartElem.coordsize.value);
            this.Element.setAttribute("coordorigin",chartElem.coordorigin.value);
            this.Element.setAttribute("filled","f");
            this.Element.setAttribute("strokecolor","green");
            var left=this.VmlChart.AxisX.transCoord(-this.VmlChart.Radius);
            var top=this.VmlChart.AxisY.transCoord(this.VmlChart.Radius);
            var right=this.VmlChart.AxisX.transCoord(this.VmlChart.Radius);
            var bottom=this.VmlChart.AxisY.transCoord(-this.VmlChart.Radius);
            
            var angleStart=chartElem.getAttribute("dialanglestart");
            if(!angleStart)     angleStart=0;
            angleStart=2*Math.PI*ToolUtil.Convert(angleStart,"number")/360;
            var angleEnd  =chartElem.getAttribute("dialangleend");
            if(!angleEnd)       angleEnd=180;
            angleEnd=2*Math.PI*ToolUtil.Convert(angleEnd,"number")/360;

            var xStart=this.VmlChart.Radius*Math.cos(angleStart);
            var yStart=this.VmlChart.Radius*Math.sin(angleStart);
            var xStart=this.VmlChart.AxisX.transCoord(Math.round(xStart));
            var yStart=this.VmlChart.AxisY.transCoord(Math.round(yStart));
            var xEnd=this.VmlChart.Radius*Math.cos(angleEnd);
            var yEnd=this.VmlChart.Radius*Math.sin(angleEnd);
            var xEnd=this.VmlChart.AxisX.transCoord(Math.round(xEnd));
            var yEnd=this.VmlChart.AxisY.transCoord(Math.round(yEnd));
            
            var path="m 0,0 l "+xStart+","+yStart+" ar "+left+","+top+","+right+","+bottom+","+xStart+","+yStart+","+xEnd+","+yEnd+" l 0,0 e";
            this.Element.setAttribute("path",path);
            break;
    }
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
    }
    this.drawMeasure();
    
}

//画坐标刻度线
_p.drawMeasure=function()
{
    if(this.Spacing<=0)     return;
    if("D"==this.AxisType)
    {
        this.drawMeasureDial();
        return;
    }
    //负半轴刻度值
    if(this.ValMin<0)
        this.drawMeasureMinus();
    //正半轴刻度值
    if(this.ValMax>0)
        this.drawMeasurePositive();
}
//负半轴刻度值
_p.drawMeasureMinus=function()
{
    if(this.Spacing<=0 || this.ValMin>=0)
         return;
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
        }//for(var k=0;k<this.MeasureList.length;k++)
        var valMeas=valMeas-this.Spacing;
    }//while(valMeas>this.ValMin)
}
//正半轴刻度值
_p.drawMeasurePositive=function()
{
    if(this.Spacing<=0 || this.ValMax<=0)
         return;
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
        }//for(var k=0;k<this.MeasureList.length;k++)
        var valMeas=valMeas+this.Spacing;
        if("date"==this.MeasureType)
            var dtMeas=dtMeas.addDate(this.SpacingDate);
    }//while(valMeas<this.ValMax)
    
}
//画表盘坐标刻度线
_p.drawMeasureDial=function()
{

    if(this.Spacing<=0 )
         return;
    for(var i=0;i<this.MeasureList.length;i++)
    {
        var ctrlMeasure=this.MeasureList[i];
        if("measure"!=ctrlMeasure.chartElement && "measureT"!=ctrlMeasure.chartElement)
            continue;
        ctrlMeasure.style.width=this.VmlChart.Element.coordsize.x;
        ctrlMeasure.style.height=this.VmlChart.Element.coordsize.y;
        ctrlMeasure.style.left=this.VmlChart.Element.coordorigin.x;
        ctrlMeasure.style.top=this.VmlChart.Element.coordorigin.y;
        ctrlMeasure.setAttribute("coordsize",this.VmlChart.Element.coordsize.value);
        ctrlMeasure.setAttribute("coordorigin",this.VmlChart.Element.coordorigin.value);
        ctrlMeasure.innerHTML="";
    }
    var valMeas=this.RadixPositive;
    if("date"==this.MeasureType)
        var dtMeas=this.StartDate.addDate(this.SpacingDate);
    while(valMeas<this.ValMax)
    {
        //由坐标刻度值转换为D轴角度坐标
        var val=this.transCoord(valMeas);
        var addupRadian=Math.PI*val/180;
        var xStart=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale)*Math.cos(addupRadian));
        var yStart=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale)*Math.sin(addupRadian));
        for(var k=0;k<this.MeasureList.length;k++)
        {
            var ctrlMeasure=this.MeasureList[k];
            if("measure"==ctrlMeasure.chartElement)
            {
                var ctrl=ctrlMeasure.cloneNode(true);
                var ctrl=this.VmlChart.DivData.appendChild(ctrl);
                ctrl.setAttribute("appendElement","true");
                var xEnd=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale-5)*Math.cos(addupRadian));
                var yEnd=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale-5)*Math.sin(addupRadian));
                var path="m "+xStart+","+yStart;
                path += " l "+xStart+","+yStart+","+xEnd+","+yEnd+" e";
                ctrl.setAttribute("path",path);
                ctrl.innerHTML=this.MeasHTMLs[k];
            }
            if("measureT"==ctrlMeasure.chartElement)
            {
                var ctrl=ctrlMeasure.cloneNode(true);
                var ctrl=this.VmlChart.DivData.appendChild(ctrl);
                ctrl.setAttribute("appendElement","true");
                var xStartT=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale-12)*Math.cos(addupRadian));
                var yStartT=Math.round((this.VmlChart.Radius/this.VmlChart.AxisX.Scale-12)*Math.sin(addupRadian));
                if(xStartT<0)
                {
                    var xOffset=5-Math.round(5*Math.cos(addupRadian));
                    var path="m "+xStartT+","+yStartT+" l "+xStartT+","+yStartT+","+(xStartT+xOffset)+","+yStartT+" e";
                }else{
                    var xOffset=5+Math.round(5*Math.cos(addupRadian));
                    var path="m "+(xStartT-xOffset)+","+yStartT+" l "+(xStartT-xOffset)+","+yStartT+","+xStartT+","+yStartT+" e";
                }
                ctrl.setAttribute("path",path);
                ctrl.innerHTML=this.MeasHTMLs[k];
                var text=ToolUtil.getCtrlByTagD(false,ctrl,"textpath");
                if(!text)   continue;
                if("numeric"==this.MeasureType)
                    text.setAttribute("string",valMeas);
                else if("date"==this.MeasureType && this.DispFormat)
                    text.setAttribute("string",dtMeas.formate(this.DispFormat));
                else if("date"==this.MeasureType )
                    text.setAttribute("string",dtMeas.formate("yyyy-MM-dd"));
            }
        }//for(var k=0;k<this.MeasureList.length;k++)
        var valMeas=valMeas+this.Spacing;
        if("date"==this.MeasureType)
            var dtMeas=dtMeas.addDate(this.SpacingDate);
    }//while(valMeas<this.ValMax)
}
//文件结尾
if (typeof(GridUtil)!="undefined") GridUtil.FileLoaded=true;