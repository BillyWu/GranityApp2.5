// JScript source code
//GridUtil��Ϊ�����ļ����:GridUtilXSLT.js �� GridUtilFun.js

//����ģ�帨���ؼ����¼�

GridUtil.usOnLoadExtentJs=function()
{
    return true;
}

//��Ԫ��ı��ִ��
GridUtil.usOnCellUpdatedHandle=function()
{
	var inputctrl=event.srcElement;
	if(!inputctrl.colname || ""==inputctrl.colname)
		return;
	//�������ڱ��,����Ӧ���ݵ����ݽṹ,�нڵ�
	var trcur=ToolUtil.getCtrlByTagU(true,inputctrl,"TR","rowType","detail");
	
	var tabDetail=ToolUtil.getCtrlByTagU(true,inputctrl,"TABLE","tabType","detail");
	var myUnitItem=document.UnitItem;
	var band=myUnitItem.getBandByItemName(tabDetail.Grid.ItemName);
	if("checkbox"==inputctrl.type)
		var value=inputctrl.checked;
	else
		var value=inputctrl.value;
	band.setFldStrValue(trcur.recordNumber-1,inputctrl.colname,value,inputctrl.valueold);
	//���ü�������
	band.setSelectContent(inputctrl.colname,trcur.recordNumber-1);
	//��ǰ�м���
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=trcur.recordNumber-1;
	band.Event.colName=inputctrl.colname;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
}////��Ԫ��ı��ִ�� GridUtil.usOnCellUpdatedHandle=function()


//����༭ģ��ؼ���ý���;
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
	//���ֶθ�ֵ,����и�ʽ,Band����
	if("checkbox"==srcEle.type)
		value=srcEle.checked;
	else
		value=srcEle.value;
	var indexRow=band.XmlLandData.recordset.AbsolutePosition-1;
	
	band.setFldStrValue(indexRow,srcEle.dataFld,value,srcEle.valueold);
	if(document.getElementById(srcEle.dataFld))
	    if(document.getElementById(srcEle.dataFld).name=="��д")
	        document.getElementById(srcEle.dataFld).innerText=DX(value);
	//��������
	band.setSelectContent(srcEle.dataFld,indexRow);
	//��ǰ�м���
	band.CalXmlLand.Calculate();
	band.Event.rowIndex=band.XmlLandData.recordset.AbsolutePosition-1;
	band.Event.colName=srcEle.dataFld;
	band.FireEvent("AfterCellEditChanged");
	ToolUtil.sleep(10);
	band.Sum();
	//���������������������������ͣ��ÿؼ������־Ϊcalc=1,���򲻼���
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

//����༭ģ��ؼ����ݸı�ʱ
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
	//���û�м�¼������һ��
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
			ctrlAlert.value=(""==strAlertMsg)?"��":strAlertMsg;
		else 
			ctrlAlert.innerHTML=(""==strAlertMsg)?"��":strAlertMsg;
	}
	if(strAlertMsg && strAlertMsg.length>0)
		return	false;
	if(typeof(onManualonChange)=="function") onManualonChange(srcEle);
	return true;
}
//Grid�����п�ȸı�
GridUtil.usOnTitMouseMove=function()
{
	if(!event.srcElement)		return;
	var thpre=event.srcElement.previousSibling;
	var thnext=event.srcElement.nextSibling;
	//��ǰ������
	var thcur=GridUtil.TitleCol;
	//�ڵ�Ԫ�����ʱǰһ��Ԫ���Ǳ�����,�ڵ�Ԫ���ұ�ʱ��ǰ���Ǳ�����,���ǿɵ�����,��������һ��Ԫ���ֻ�ܵ�С���ܵ�����
	//if( (thpre && thpre.colname && event.offsetX<3) || (event.srcElement.colname && thnext && event.offsetX>event.srcElement.clientWidth-3) )
	if( (thpre && thpre.colname && event.offsetX<5) || (event.srcElement.colname && event.offsetX>event.srcElement.clientWidth-5) )
		event.srcElement.style.cursor="col-resize";
	else if(thcur && 1==event.button)
		event.srcElement.style.cursor="col-resize";
	else
		event.srcElement.style.cursor="default";
	if(!thcur && 1==event.button && "col-resize"==event.srcElement.style.cursor)
	{
		//���ڵı����в��������в������п�
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
	//��̬���ڱ�����
	if(thcur && 1==event.button && "col-resize"==event.srcElement.style.cursor)
	{
		var incwidth=event.clientX-GridUtil.StartX;
		if(thcur.widthold+incwidth<=0) thcur.width = 5;
		else thcur.width=thcur.widthold+incwidth;
		//��Сʱ�ȸı䵥Ԫ���Ⱥ�ı�Table���;���һ����Ԫ��仯ʱ���ı�Table���
		if(0>incwidth && false)
		{
			//����ǵ����ڶ��ֶ���,�͸ı��һ����Ԫ��Ĵ�С
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
//���ڽ���
GridUtil.usOnTitMouseUp=function()
{
	if(!GridUtil.TitleCol)	return;
	//��ǰ������
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
	//��ȸı����
	var xmlNodeCol=tabTitle.Grid.XmlSchema.XMLDocument.selectSingleNode("//xs:element[@name='"+thcur.colname+"']");
	//���ʱ�ȸı���Table���
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
	//��Сʱ�ȸı䵥Ԫ���Ⱥ�ı�Table���;���һ����Ԫ��仯ʱ���ı�Table���
	if(0>incwidth && false)
	{
		//����ǵ����ڶ��ֶ���,�͸ı��һ����Ԫ��Ĵ�С
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

//Сдת��д
var zhuanhuan=function()
 {
        var daxieshuzhu=new Array("��","Ҽ","��","��","��","��","½","��","��","��");
        var danwei=new Array("Ǫ","��","ʰ","");
        var dadanwei=new Array(" ","��","��","����");
        this.input=new Array();   //�����������մ��봮
        this.jsq=0;    //������,��λ����
        this.output=new Array();  //�����������ת����Ĵ�
        this.daxiezhuanhuan=function()
        {
            this.strtemp="";
            for(var jwq=0;jwq<this.input.length;jwq++)
            { //ת����д�����ϵ�λ
                this.strtemp+=daxieshuzhu[this.input[jwq]]+danwei[jwq];
            }
           this.strtemp+=" ";
           this.re=/(��\D)+/g;
           this.strtemp=this.strtemp.replace(this.re,"��");  //�Ѷ�����ӵ��㻯��һ����
           this.re=/��$/g;
           this.strtemp=this.strtemp.replace(this.re,"");  //�Ѽ�β����ȥ��
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
           { //������ִ��������ÿ4��һ��,����4����0����
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
           { //ѭ���������ִ�������Ϊ��д
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
           { //����������ݴ�
                this.Stroutput+=this.output[temp];
           }
           if(this.pb==1)
           {
                return this.Stroutput.replace("Ǫ","��").replace("��","��").replace("ʰ","��");
           }
           else{
            this.re=/^��/g;
            this.Stroutput=this.Stroutput.replace(this.re,""); //�����ͷ����
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
     var chafen=new Array();  //�����������������С��λ
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
        {  //�����С��λΪ��λ������λ��0����
            xiaoshu+="0";
        }
      
        var myzhuanhuan=new zhuanhuan();
        output2=myzhuanhuan.taifen(xiaoshu,1);
     }
     
     if(output!="" && output2!=0)
     { //�ж������Ƿ�Ϊ�� //���
        return (output+"Բ"+output2).replace(" ","");
     }
     else
     {
          if(output2==0)
          {
            return (output+"Բ").replace(" ","");
          }
          else
          {
            var re=/^��/g;
            return output2.replace(re,"");
          }
     }
  }
  
//�ļ���β
GridUtil.FileLoaded=true;