// JScript source code
//GridUtil分为两个文件组成:GridUtilXSLT.js 和 GridUtilFun.js

//输入模板辅助控件的事件

GridUtil.usOnLoadExtentJs=function()
{
    return true;
}

//单元格改变后执行
GridUtil.usOnCellUpdatedHandle=function()
{
	var inputctrl=event.srcElement;
	if(!inputctrl.colname || ""==inputctrl.colname)
		return;
	//数据所在表格,及对应数据岛数据结构,列节点
	var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
	
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	if("checkbox"==inputctrl.type)
		var value=inputctrl.checked;
	else
		var value=inputctrl.value;
	band.setFldStrValue(trcur.recordNumber-1,inputctrl.colname,value,inputctrl.valueold);
	//设置级联更新
	band.setSelectContent(inputctrl.colname,trcur.recordNumber-1);
	//当前行计算
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=trcur.recordNumber-1;
	band.Event.colName=inputctrl.colname;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
}////单元格改变后执行 GridUtil.usOnCellUpdatedHandle=function()


//输入编辑模板控件获得焦点;
GridUtil.usOnCtrlUpatedHandle=function()
{
	var srcEle=event.srcElement;
	if(!srcEle.dataSrc || !srcEle.dataFld || ""==srcEle.dataSrc || ""==srcEle.dataFld)
		return;
	var xmlLand=document.getElementById(srcEle.dataSrc.substr(1));
	if(!xmlLand)	return;
	if(!document.UnitItem)	return;
	var band=document.UnitItem.getBandByItemName(xmlLand.itemname);
	if(!band || !band.XmlSchema || !band.XmlSchema.XMLDocument)
		return;
	//对字段赋值,如果有格式,Band处理
	if("checkbox"==srcEle.type)
		value=srcEle.checked;
	else
		value=srcEle.value;
	var indexRow=band.XmlLandData.recordset.AbsolutePosition-1;
	
	band.setFldStrValue(indexRow,srcEle.dataFld,value,srcEle.valueold);
	if(document.getElementById(srcEle.dataFld))
	    if(document.getElementById(srcEle.dataFld).name=="大写")
	        document.getElementById(srcEle.dataFld).innerText=DX(value);
	//级联更新
	band.setSelectContent(srcEle.dataFld,indexRow);
	//当前行计算
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	band.Event.colName=srcEle.dataFld;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
	//级联更新条件，必须是数字类型，该控件计算标志为calc=1,否则不计算
    var dtype = band.getDataType(srcEle.dataFld);
    if(dtype=="decimal" || dtype=="float")
    {
	    if(typeof(ue_treeSum)=="function" && band.treeCalc) ue_treeSum();
	};
	var gridcol = srcEle.document.getElementById(band.ItemName + srcEle.dataFld + "_" + indexRow);
    if(gridcol) 
    {
            gridcol.innerHTML = srcEle.value;
    }
}

//输入编辑模板控件数据改变时
GridUtil.usOnCtrlChangeHandle=function()
{
	var srcEle=event.srcElement;
	if(!srcEle.dataSrc || !srcEle.dataFld || ""==srcEle.dataSrc || ""==srcEle.dataFld)
		return;
	var xmlLand=document.getElementById(srcEle.dataSrc.substr(1));
	if(!xmlLand)	return;
	var band=document.UnitItem.getBandByItemName(xmlLand.itemname);
	if(!band || !band.XmlSchema || !band.XmlSchema.XMLDocument)
		return;
	//如果没有记录就增加一行
	if(band.XmlLandData.recordset.AbsolutePosition<1)
	{
		var value=srcEle.value;
		band.NewRecord();
		band.setCurrentRow();
		band.setFldStrValue(null,srcEle.dataFld,value);
		if(band.Grid)
			band.Grid.setRowCursor();
	}
	if(band.XmlSchema.ctrlAlert && ""!=band.XmlSchema.ctrlAlert)
		var ctrlAlert=document.getElementById(band.XmlSchema.ctrlAlert);
	if(!ctrlAlert && band.Grid)
		ctrlAlert=band.Grid.CtrlMsg;
	var strAlertMsg=band.CalXmlLand.ValidateCell(band.XmlLandData.recordset.AbsolutePosition-1,srcEle.dataFld,srcEle.value);
	ToolUtil.sleep(10);
	if(ctrlAlert)
	{
		if("INPUT"==ctrlAlert.tagName)
			ctrlAlert.value=(""==strAlertMsg)?"　":strAlertMsg;
		else 
			ctrlAlert.innerHTML=(""==strAlertMsg)?"　":strAlertMsg;
	}
	if(strAlertMsg && strAlertMsg.length>0)
		return	false;
	if(typeof(onManualonChange)=="function") onManualonChange(srcEle);
	return true;
}
//Grid标题列宽度改变
GridUtil.usOnTitMouseMove=function()
{
	if(!event.srcElement)		return;
	var thpre=event.srcElement.previousSibling;
	var thnext=event.srcElement.nextSibling;
	//当前调节列
	var thcur=GridUtil.TitleCol;
	//在单元格左边时前一单元格是标题列,在单元格右边时当前列是标题列,则是可调节列,如果是最后一单元格就只能调小不能调大了
	//if( (thpre && thpre.colname && event.offsetX<3) || (event.srcElement.colname && thnext && event.offsetX>event.srcElement.clientWidth-3) )
	if( (thpre && thpre.colname && event.offsetX<5) || (event.srcElement.colname && event.offsetX>event.srcElement.clientWidth-5) )
		event.srcElement.style.cursor="col-resize";
	else if(thcur && 1==event.button)
		event.srcElement.style.cursor="col-resize";
	else
		event.srcElement.style.cursor="default";
	if(!thcur && 1==event.button && "col-resize"==event.srcElement.style.cursor)
	{
		//调节的标题列不是数据列不调节列宽
		thcur=event.offsetX<5?thpre:event.srcElement;
		if(!thcur || !thcur.colname)	return;
		GridUtil.TitleCol=thcur;
		GridUtil.TabTitle=ToolUtil.getCtrlByTagU(false,thcur,"TABLE");
		if(event.offsetX<5)
			GridUtil.StartX=event.clientX-event.offsetX;
		else
			GridUtil.StartX=event.clientX+event.srcElement.clientWidth-event.offsetX;
			
		thcur.widthold=thcur.clientWidth;
		if(thcur.nextSibling && thcur.nextSibling.colname && (!thcur.nextSibling.nextSibling || !thcur.nextSibling.nextSibling.colname))
			thcur.nextSibling.widthold=thcur.nextSibling.clientWidth;
	}
	//动态调节标题宽度
	if(thcur && 1==event.button && "col-resize"==event.srcElement.style.cursor)
	{
		var incwidth=event.clientX-GridUtil.StartX;
		if(thcur.widthold+incwidth<=0) thcur.width = 5;
		else thcur.width=thcur.widthold+incwidth;
		//变小时先改变单元格宽度后改变Table宽度;最后一个单元格变化时不改变Table宽度
		if(0>incwidth && false)
		{
			//如果是倒数第二字段列,就改变后一个单元格的大小
			if(thcur.nextSibling && thcur.nextSibling.colname && (!thcur.nextSibling.nextSibling || !thcur.nextSibling.nextSibling.colname))
				thcur.nextSibling.width=thcur.nextSibling.widthold-incwidth;
		}
	}
	if(thcur && 1!=event.button)
	{
		thcur=GridUtil.TitleCol=null;
		GridUtil.TabTitle=null;
		GridUtil.StartX="";
	}
}
//调节结束
GridUtil.usOnTitMouseUp=function()
{
	if(!GridUtil.TitleCol)	return;
	//当前标题列
	var thcur=GridUtil.TitleCol;
	var tabTitle=GridUtil.TabTitle.Grid.TabTitle;
	var tabDetail=GridUtil.TabTitle.Grid.Table;
	var tabFoot=GridUtil.TabTitle.Grid.TabFoot;
	var incwidth=event.clientX-GridUtil.StartX;
	if(5>(thcur.clientWidth+incwidth))
	{
		GridUtil.TitleCol=null;
		GridUtil.TabTitle=null;
		GridUtil.StartX="";
		return;
	}
	tabDetail.dataSrc=tabDetail.dataSrc.substr(1);
	if(tabFoot)
	    tabFoot.dataSrc=tabFoot.dataSrc.substr(1);
	//宽度改变的列
	var xmlNodeCol=tabTitle.Grid.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+thcur.colname+"']");
	//变大时先改变大的Table宽度
	thcur.width=thcur.widthold+incwidth;
	var tdDetail=ToolUtil.getCtrlByTagD(false,tabDetail,"TD","colname",thcur.colname);
	if(tabFoot)
	    var tdFoot=ToolUtil.getCtrlByTagD(false,tabFoot,"TD","colname",thcur.colname);
	if(xmlNodeCol)
	{
		var attrWidth=xmlNodeCol.attributes.getNamedItem("width");
		if(!attrWidth)
			attrWidth=xmlNodeCol.attributes.setNamedItem(tabTitle.Grid.XmlSchema.XMLDocument.createAttribute("width"));
		attrWidth.value=thcur.width;
		var attrState=xmlNodeCol.attributes.getNamedItem("state");
		if(!attrState)
			attrState=xmlNodeCol.attributes.setNamedItem(tabTitle.Grid.XmlSchema.XMLDocument.createAttribute("state"));
		attrState.value="modify";
	}
	tdDetail.width=thcur.width;
	if(tabFoot) tdFoot.width=thcur.width;
	//变小时先改变单元格宽度后改变Table宽度;最后一个单元格变化时不改变Table宽度
	if(0>incwidth && false)
	{
		//如果是倒数第二字段列,就改变后一个单元格的大小
		if(thcur.nextSibling && thcur.nextSibling.colname && (!thcur.nextSibling.nextSibling || !thcur.nextSibling.nextSibling.colname))
		{
			var xmlNodeCol=tabTitle.Grid.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+thcur.nextSibling.colname+"']");
			thcur.nextSibling.width=thcur.nextSibling.widthold-incwidth;
			tdDetail.nextSibling.width=tdDetail.nextSibling.clientWidth-incwidth;
			if(tabFoot)
			    tdFoot.nextSibling.width=tdFoot.nextSibling.clientWidth-incwidth;
			if(xmlNodeCol)
			{
				var attrWidth=xmlNodeCol.attributes.getNamedItem("width");
				if(!attrWidth)
					attrWidth=xmlNodeCol.attributes.setNamedItem(tabTitle.Grid.XmlSchema.XMLDocument.createAttribute("width"));
				attrWidth.value=thcur.width;
				var attrState=xmlNodeCol.attributes.getNamedItem("state");
				if(!attrState)
					attrState=xmlNodeCol.attributes.setNamedItem(tabTitle.Grid.XmlSchema.XMLDocument.createAttribute("state"));
				attrState.value="modify";
			}
		}
	}
	tabDetail.dataSrc="#"+tabDetail.dataSrc;
	if(tabFoot) tabFoot.dataSrc="#"+tabFoot.dataSrc;
	tabDetail.Grid.setRowChecked();
	GridUtil.TitleCol=null;
	GridUtil.TabTitle=null;
	GridUtil.StartX="";
}

//小写转大写
var zhuanhuan=function()
 {
        var daxieshuzhu=new Array("零","壹","贰","参","肆","伍","陆","柒","捌","玖");
        var danwei=new Array("仟","佰","拾","");
        var dadanwei=new Array(" ","万","亿","万亿");
        this.input=new Array();   //定义容器接收传入串
        this.jsq=0;    //计算器,定位万亿
        this.output=new Array();  //定义容器存放转换后的串
        this.daxiezhuanhuan=function()
        {
            this.strtemp="";
            for(var jwq=0;jwq<this.input.length;jwq++)
            { //转换大写并加上单位
                this.strtemp+=daxieshuzhu[this.input[jwq]]+danwei[jwq];
            }
           this.strtemp+=" ";
           this.re=/(零\D)+/g;
           this.strtemp=this.strtemp.replace(this.re,"零");  //把多个连接的零化成一个零
           this.re=/零$/g;
           this.strtemp=this.strtemp.replace(this.re,"");  //把级尾的零去掉
           if(this.strtemp!="")
           {
                this.output[this.jsq]=this.strtemp.replace(" ","")+dadanwei[this.jsq];
           }
           else{
            this.output[this.jsq]=this.strtemp.replace(" ","");
           }
           this.jsq++;
        }

        this.taifen=function(input,pb)
        {
           this.pb=pb;
           this.input=input;
           var Ainput=new Array();
           var Atemp=new Array(0,0,0,0);
           for(var temp=this.input.length-1,temp2=3,jwq=0;temp>=0;temp--,temp2--)
           { //拆分数字串并构造成每4个一组,不足4个以0代替
                if(temp2<0)
                {
                    temp2=3;
                }
                Atemp[temp2]=input.substr(temp,1);
                if((temp2%4)==0)
                {
                    Ainput[jwq]=Atemp;
                    jwq++;
                    Atemp=new Array(0,0,0,0);
                }
                else if(temp==0)
                {
                    Ainput[jwq]=Atemp;
                }
           }
           if(this.pb==1)
           {
                var Ainput2=new Array();
                for(var temp=1;temp<Ainput[0].length;temp++)
                {
                    Ainput2[temp-1]=Ainput[0][temp];
                }
                Ainput2[3]=0;
                Ainput=new Array(Ainput2);
                return this.zhuanhuandaxie(Ainput,this.pb);
           }
           else
           {
                return this.zhuanhuandaxie(Ainput,this.pb);
           }
        }
  
      this.zhuanhuandaxie=function(Ainput,pb)
      {
           this.pb=pb;
           this.Ainput=Ainput;
           for(var temp=0;temp<this.Ainput.length;temp++)
           { //循环传入数字串并传化为大写
                this.input=Ainput[temp];
                this.daxiezhuanhuan();
           }
           return this.chongzhu(this.output,this.pb);
      }

      this.chongzhu=function(output,pb)
      {
           this.pb=pb;
           this.output=output;
           this.Stroutput="";
           for(var temp=this.output.length-1;temp>=0;temp--)
           { //重新组合数据串
                this.Stroutput+=this.output[temp];
           }
           if(this.pb==1)
           {
                return this.Stroutput.replace("仟","角").replace("佰","分").replace("拾","厘");
           }
           else{
            this.re=/^零/g;
            this.Stroutput=this.Stroutput.replace(this.re,""); //清除开头的零
            return this.Stroutput;
           }   
      }
 }

 function DX(srcnum)
 {
     var xiaoshu=0;
     var re=/^0+/g;
     var xiaoshu=0;
     var output="",output2="";
     srcnum =   srcnum.replace(re,"");
     srcnum =   srcnum.replace(",","");
     var chafen=new Array();  //定义容器存放整数跟小数位
     chafen=srcnum.split(".");
     if(chafen.length==2)
     {
        xiaoshu=chafen[1];
     }
     srcnum = chafen[0];
     
     var myzhuanhuan=new zhuanhuan();
     output=myzhuanhuan.taifen(srcnum,0);
     if(xiaoshu!=0)
     {
        for(var temp=3-xiaoshu.length;temp>0;temp--)
        {  //构造成小数位为三位不足三位以0代替
            xiaoshu+="0";
        }
      
        var myzhuanhuan=new zhuanhuan();
        output2=myzhuanhuan.taifen(xiaoshu,1);
     }
     
     if(output!="" && output2!=0)
     { //判断整数是否为零 //输出
        return (output+"圆"+output2).replace(" ","");
     }
     else
     {
          if(output2==0)
          {
            return (output+"圆").replace(" ","");
          }
          else
          {
            var re=/^零/g;
            return output2.replace(re,"");
          }
     }
  }
  
//文件结尾
GridUtil.FileLoaded=true;