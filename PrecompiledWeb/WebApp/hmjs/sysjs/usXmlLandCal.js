// JScript source code

// �������ݵ��Ĺ����ļ������
function XmlLandCal(xmlLand)
{
	//������,�����ж�������,Ҫ����ĵ�ǰ�к�,Ҫ����ĵ�ǰ�ж���,Ҫ����ĵ�ǰ������
	var Htmldoc=xmlLand.parentElement.ownerDocument;
	var xmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	if(!xmlSchema || !xmlSchema.XMLDocument || xmlSchema.XMLDocument.documentElement.childNodes.length<1)
		return null;
	
	this.XmlLand=xmlLand;
	this.XmlSchema=Htmldoc.getElementById(xmlLand.id+"_Schema");
	this.CurXmlRow=null;
	this.CurRow=-1;
	this.CurCol=null;
	this.Band=null;
	//У���������,��������:ValiExp,AlertMsg
	this.ColCalList=new Array();
	this.ValiCellList=new Array();
	this.RedWordCellList=new Array();
	
	//���㹦���ṩ�ĺ�����
	this.Fun=new _xmlLandCalFun(this);
	this.ColumnList=new Array();
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var Column=new Object();
		Column.Name=colList[i].attributes.getNamedItem("name").value;
		var title=colList[i].getAttribute("title");
		if(!title || ''==title)
		    Column.Title=title;
		switch(colList[i].attributes.getNamedItem("type").value)
		{
			case "xs:string":
				Column.DbType="string";
				break;
			case "xs:date":
			case "xs:dateTime":
				Column.DbType="date";
				break;
			case "xs:int":
			case "xs:short":
				Column.DbType="int";
				break;
			case "xs:double":
			case "xs:decimal":
			case "xs:float":
			case "xs:money":
				Column.DbType="double";
				break;
			default:
				Column.DbType="string";
		}
		this.ColumnList[this.ColumnList.length]=Column;
	}
}

//��ִ�м���ǰ���ü�����
var _p=XmlLandCal.prototype;
_p.SetRow=function(irow)
{
	try
	{	
		this.CurXmlRow=this.XmlLand.XMLDocument.documentElement.childNodes[irow];
		this.CurRow=irow;
	}catch(ex)
	{
		this.CurXmlRow=null;
		this.CurRow=-1;
	}
};
//���ü�����,�����б��ʽ�����ж���ת��,�������Ƶı��ʽ��������
_p.SetColExp=function()
{
	//sExpression=sExpression.replace(/\s/g,"");		//ȥ���ո�
	//sExpression=sExpression.toUpperCase();			//ͳһת�ɴ�д,ʵ�ִ�Сд����,Ҳ���Զ����ɵ�������д���
	//if(sExpression.search(/\w+\(|\./)>-1)				//���û����ʽ��ֹʹ�ú���
	//	return;
	if(!this.XmlSchema)		return;
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var attrName    =colList[i].attributes.getNamedItem("name");
		var attrExp     =colList[i].attributes.getNamedItem("expression");
		var attrCaltype =colList[i].attributes.getNamedItem("calcol");
		var attrFCaltype =colList[i].attributes.getNamedItem("fcalcol");
		
		
		if(!attrExp || ""==attrExp.value) continue;
		sExpression=attrExp.value;
		sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");				//��ȡ���λ���е��ֶ���ֵ
		sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//��ȡ��������Դ��ǰ�ֶ���ֵ
		for(var j=0;j<this.Fun.Macro.length;j++)
		{
			var re=new RegExp(this.Fun.Macro[j][0],"ig");
			sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
		}
		
		
		var colExpression=new Object();
		colExpression.ColName=attrName.value;
		colExpression.Expression=sExpression;
		colExpression.CalType=(!attrCaltype || ""==attrCaltype.value)?"0":attrCaltype.value;				    //"0"��ʼ��,"1"�������Ƕ�̬����
		colExpression.FCalType=(!attrFCaltype || ""==attrFCaltype.value)?"0":attrFCaltype.value;				//"0"��ʼ��,"1"�������Ƕ�̬����(���ڳ�ʼ��ʱ����Ҳ��ֵ�仯ʱ����)
		this.ColCalList[this.ColCalList.length]=colExpression;
	}
};

//����У�鵥Ԫ��
_p.SetValiCellExp=function()
{
    this.ValiCellList.length=0;
	if(!this.XmlSchema)		return;
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var attrName=colList[i].attributes.getNamedItem("name");
		var attrTitle=colList[i].attributes.getNamedItem("title");
		var attrType=colList[i].attributes.getNamedItem("type");
		var attrExp=colList[i].attributes.getNamedItem("validity");
		var attrRequired=colList[i].attributes.getNamedItem("chkcol");
		//�ǿ���
		if(attrRequired && "1"==attrRequired.value)
		{
			var validity=new Object();
			validity.ColName=attrName.value;
			validity.Title=attrTitle?attrTitle.value:attrName.value;
			validity.ValiExp="ValidatUtil.RequiredField("+attrName.value+")";
			validity.AlertMsg="����Ϊ�գ�";
			this.ValiCellList[this.ValiCellList.length]=validity;
		}
		//�Զ���У��
		if(attrExp && ""!=attrExp.value)
		{
			var attrMsg=colList[i].attributes.getNamedItem("alertexpr");
			sExpression=attrExp.value;
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");		//��ȡ���λ���е��ֶ���ֵ
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//��ȡ��������Դ��ǰ�ֶ���ֵ
			for(var j=0;j<this.Fun.Macro.length;j++)
			{
				var re=new RegExp(this.Fun.Macro[j][0],"ig");
				sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
			}
			var validity=new Object();
			validity.ColName=attrName.value;
			validity.Title=attrTitle?attrTitle.value:attrName.value;
			validity.ValiExp=sExpression;
			validity.AlertMsg=(!attrMsg)?"�Ƿ�����":attrMsg.value;
			this.ValiCellList[this.ValiCellList.length]=validity;
		}
	}
}

//����У�鵥Ԫ��
_p.SetRedWordCellExp=function()
{
	if(!this.XmlSchema)		return;
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var attrName=colList[i].attributes.getNamedItem("name");
		var attrType=colList[i].attributes.getNamedItem("type");
		var attrExp=colList[i].attributes.getNamedItem("redword");
		//�Զ���У��
		if(attrExp && ""!=attrExp.value)
		{
			sExpression=attrExp.value;
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");		//��ȡ���λ���е��ֶ���ֵ
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//��ȡ��������Դ��ǰ�ֶ���ֵ
			for(var j=0;j<this.Fun.Macro.length;j++)
			{
				var re=new RegExp(this.Fun.Macro[j][0],"ig");
				sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
			}
			var validity=new Object();
			validity.ColName=attrName.value;
			validity.ValiExp=sExpression;
			this.RedWordCellList[this.RedWordCellList.length]=validity;
		}
	}
}


//ִ�м���,���Դ�����,������Ҫ������кź�����
_p.Calculate=function(irowindex,caltype)
{
	if(null==irowindex)
		irowindex=this.XmlLand.recordset.AbsolutePosition-1;
	this.SetRow(irowindex);
	if(this.CurRow<0 || !this.CurXmlRow)
		return;
	var Fun=this.Fun;
	if(null==caltype)	caltype="1";
	var re=new RegExp("'","ig");
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var xmlNode=this.CurXmlRow.selectSingleNode(this.ColumnList[_i].Name);
		var strEval="";
		if(!xmlNode)
			strEval="var "+this.ColumnList[_i].Name+"=null;";
		else 
		{
			var strvalue=xmlNode.text.replace(/\\/ig,"\\\\");
			strvalue=strvalue.replace(re,"\\'");
			strEval="var "+this.ColumnList[_i].Name
					+"=ToolUtil.Convert('"+strvalue+"','"+this.ColumnList[_i].DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
	for(var _i=0;_i<this.ColCalList.length;_i++)
	{
	    //�����Ϊָ�����͵ļ��㷽�����򲻴���
		if(caltype!=this.ColCalList[_i].CalType && (this.ColCalList[_i].FCalType=="" || this.ColCalList[_i].FCalType=="0"))
			continue;
		var value="";
		try
		{
			for(var j=0;j<this.ColumnList.length;j++)
				if(this.ColumnList[j].Name==this.ColCalList[_i].ColName)
				{
					this.CurCol=this.ColumnList[j];
					break;
				}
			if(j==this.ColumnList.length)    continue;
			value=eval(this.ColCalList[_i].Expression);
			switch(value)
			{
				case Number.MAX_VALUE:
				case Number.MIN_VALUE:
				case Number.NaN:
				case Number.NEGATIVE_INFINITY:
				case Number.POSITIVE_INFINITY:
					value="";break;
				default:	
					break;
			}
			if(isNaN(value) && typeof(value)=="number")	value="";
			var strvalue=(value+"").replace(re,"\\'");
			var strEval=this.CurCol.Name+"=ToolUtil.Convert('"+strvalue+"','"+this.CurCol.DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
			eval(strEval);
		}catch(ex){
			switch(this.CurCol.DbType)
			{
				case "int":	
					value="0";
					break;
				case "boolean":	
					value="false";
					break;
				case "date":
					try{var dValue=new Date(Fun.EndDate());	}catch(ex){dValue=null;}
					value=(!dValue)?"":dValue.toString();
					break;
				default:	
					value="";
			}
		}
		this.Band.setFldStrValue(irowindex,this.ColCalList[_i].ColName,value);
	}//
};
//��ֵָ���б��ʽ��ֵ
_p.Evaluation=function(irowindex,sExpression)
{
	sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");				//��ȡ���λ���е��ֶ���ֵ
	sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//��ȡ��������Դ��ǰ�ֶ���ֵ
	for(var j=0;j<this.Fun.Macro.length;j++)
	{
		var re=new RegExp(this.Fun.Macro[j][0],"ig");
		sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
	}

	if(null==irowindex)
		irowindex=this.XmlLand.recordset.AbsolutePosition-1;
	this.SetRow(irowindex);
	if(this.CurRow<0 || !this.CurXmlRow)
		return;
	var Fun=this.Fun;
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var re=new RegExp("'","ig");
		var xmlNode=this.CurXmlRow.selectSingleNode(this.ColumnList[_i].Name);
		var strEval="";
		if(!xmlNode)
			strEval="var "+this.ColumnList[_i].Name+"=null;";
		else 
		{
			var strvalue=xmlNode.text.replace(re,"\\'");
			strEval="var "+this.ColumnList[_i].Name
					+"=ToolUtil.Convert('"+strvalue+"','"+this.ColumnList[_i].DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
    try{
		var value=eval(sExpression);
		switch(value)
		{
			case Number.MAX_VALUE:
			case Number.MIN_VALUE:
			case Number.NaN:
			case Number.NEGATIVE_INFINITY:
			case Number.POSITIVE_INFINITY:
				value="";break;
			default:
				break;
		}
		if(isNaN(value) && typeof(value)=="number")	value="";
        return value;
    }catch(ex){	}
    return null;
}
//У�鵥Ԫ����Ч��,�Ϸ�����"",�Ƿ�������ʾ��Ϣ
_p.ValidateCell=function(irow,colname,Value)
{
	if(!this.XmlSchema || null==irow || !colname || ""==colname)
		return "";
	this.SetRow(irow);
	if(!this.CurXmlRow)	return "";
	var Fun=this.Fun;
	var _msg="";
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var col=this.ColumnList[_i];
		var xmlNode=this.CurXmlRow.selectSingleNode(col.Name);
		var re=new RegExp("'","ig");
		var strEval="";
		if(colname==col.Name)
		{
			var isDbType=ValidatUtil.Compare(Value,null,'DataTypeCheck',col.DbType);
			if(!isDbType) return "*"+col.Name+"���Ͳ�ƥ��*";
			strEval="var "+colname+"=ToolUtil.Convert(Value,'"+col.DbType+"');";
		}else if(!xmlNode)
			strEval="var "+col.Name+"=null;";
		else
		{
			var strvalue=xmlNode.text.replace(re,"\\'");
			strEval="var "+col.Name+"=ToolUtil.Convert('"+strvalue+"','"+col.DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
	for(var _i=0;_i<this.ValiCellList.length;_i++)
	{
		if(colname!=this.ValiCellList[_i].ColName)
			continue;
		try
		{
			if(false==eval(this.ValiCellList[_i].ValiExp))
				_msg += this.ValiCellList[_i].AlertMsg;
		}catch(ex){}
	}
	return _msg;
};

//У�鵥Ԫ����Ч��,�Ϸ�����"",�Ƿ�������ʾ��Ϣ
_p.RedWordCell=function(irow,colname,Value)
{
	if(!this.XmlSchema || null==irow || !colname || ""==colname)
		return "";
	this.SetRow(irow);
	if(!this.CurXmlRow)	return "";
	var Fun=this.Fun;
	var _msg="";
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var col=this.ColumnList[_i];
		var xmlNode=this.CurXmlRow.selectSingleNode(col.Name);
		var re=new RegExp("'","ig");
		var strEval="";
		if(colname==col.Name)
		{
			strEval="var "+colname+"=ToolUtil.Convert(Value,'"+col.DbType+"');";
		}else if(!xmlNode)
			strEval="var "+col.Name+"=null;";
		else
		{
			var strvalue=xmlNode.text.replace(re,"\\'");
			strEval="var "+col.Name+"=ToolUtil.Convert('"+strvalue+"','"+col.DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
	for(var _i=0;_i<this.RedWordCellList.length;_i++)
	{
		if(colname!=this.RedWordCellList[_i].ColName)
			continue;
		try
		{
    		var val = eval(this.RedWordCellList[_i].ValiExp);	    
		    return val;
		}catch(ex){}
	}
	return false;
};


//У�������е���Ч��,�Ϸ�����"",�Ƿ�������ʾ��Ϣ
//����:irow�к�,Ĭ�ϵ�ǰ��; valiType У������,Ĭ����ϸУ�����У����������,fastУ����������У�����ִ����ϸУ��,û������У���Ҳ��У����������
_p.ValidateRow=function(irow,valiType)
{
	if(!this.XmlSchema || !this.Band.XmlLandData || !this.Band.XmlLandData.XMLDocument 
			|| !this.Band.XmlLandData.XMLDocument.documentElement)
		return "";
	//У������fast,����û��У����ʱ��У��
	if(valiType && "fast"==valiType && this.ValiCellList.length<1)
	    return "";
	if(null==irow)
		irow=this.Band.XmlLandData.recordset.AbsolutePosition-1;
	this.SetRow(irow);
	if(!this.CurXmlRow)	return "";
	var Fun=this.Fun;
	var _msg="";
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var col=this.ColumnList[_i];
		var re=new RegExp("'","ig");
		var strvalue=this.Band.getFldStrValue(col.Name,irow);
		var strvalue=(null==strvalue)?"":strvalue.replace(re,"\\'");
		var strEval="";
		var isDbType=ValidatUtil.Compare(strvalue,null,'DataTypeCheck',col.DbType);
		if(!isDbType)
		{
			_msg += col.Name+"���Ͳ�ƥ��\t";
			strEval="var "+col.Name+"=null;";
		}else{
			strEval="var "+col.Name+"=ToolUtil.Convert(strvalue,'"+col.DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
	for(var _i=0;_i<this.ValiCellList.length;_i++)
	{
		try
		{
		    //У����ʾ��Ϣ
			if(false==eval(this.ValiCellList[_i].ValiExp))
				_msg += "["+this.ValiCellList[_i].Title+"]:"+this.ValiCellList[_i].AlertMsg+"\t";
		}catch(ex){}
	}
	return _msg;
}
//У������������е���Ч��,�Ϸ�����"",�Ƿ�������ʾ��Ϣ
_p.ValidateRowFilter=function(irow)
{
	if(!this.XmlSchema || !this.Band.XmldocFilter || !this.Band.XmldocFilter.documentElement)
		return "";
	if(null==irow)
		return "";
	var Fun=this.Fun;
	var _msg="";
	for(var _i=0;_i<this.ColumnList.length;_i++)
	{
		var col=this.ColumnList[_i];
		var re=new RegExp("'","ig");
		var strvalue=this.Band.getFldStrValueFilter(col.Name,irow);
		var strvalue=(null==strvalue)?"":strvalue.replace(re,"\\'");
		var strEval="";
		var isDbType=ValidatUtil.Compare(strvalue,null,'DataTypeCheck',col.DbType);
		if(!isDbType)
		{
			_msg += col.Name+"���Ͳ�ƥ��\t";
			strEval="var "+col.Name+"=null;";
		}else{
			strEval="var "+col.Name+"=ToolUtil.Convert(strvalue,'"+col.DbType+"');";
			strEval=strEval.replace(/\n/ig,"\\\\n");
		}
		eval(strEval);
	}
	for(var _i=0;_i<this.ValiCellList.length;_i++)
	{
		try
		{
		    //У����ʾ��Ϣ
			if(false==eval(this.ValiCellList[_i].ValiExp))
				_msg += "["+this.ValiCellList[_i].Title+"]:"+this.ValiCellList[_i].AlertMsg+"\t";
		}catch(ex){}
	}
	return _msg;
}

function calfun()
{
    var mm=0;
    return (m1+m2+m3+m4+m5+m6+m7+m8+m9+m10+m11+m12)/(12);
}

function _xmlLandCalFun(gridcal)
{
	this.GetRow=function(){return gridcal.CurRow+1;};
	this.GetColumnName=function(){return gridcal.CurCol.Name;};
	this.SysDate=function(){var topFrame=ControlUtil.TopFrame;return topFrame.SysDate();};
	this.StartDate=function(){var topFrame=ControlUtil.TopFrame;return topFrame.StartDate();};
	this.EndDate=function(){var topFrame=ControlUtil.TopFrame;return topFrame.EndDate();};
	this.GetUserAccount=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetUserAccount();};
	this.GetUserName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetUserName();};
	this.GetUserSn=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetUserSn();};
	this.GetDeptCode=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDeptCode();};
	this.GetDeptName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDeptName();};
	this.GetDeptSaleName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDeptSaleName();};
	this.GetDWName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDWName();};
	this.GetUnitCode=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetUnitCode();};
	this.GetCompany=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetCompany();};
	this.GetDeptSupName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDeptSupName();};
	this.GetDWSupName=function(){var topFrame=ControlUtil.TopFrame;return topFrame.GetDWSupName();};
	this.GetCurrentYear=function()
		{
			var topFrame=ControlUtil.TopFrame;
			var d_date=topFrame.EndDate();
			return d_date.getFullYear();
		};
	this.GetCurrentMonth=function()
		{
			var topFrame=ControlUtil.TopFrame;
			var d_date=topFrame.EndDate();
			return d_date.getMonth()+1;
		};
	this.GetCurrentQuarter=function()
		{
			var topFrame=ControlUtil.TopFrame;
			var d_date=topFrame.EndDate();
			return Math.floor(d_date.getMonth()/3+1);
		};
	this.GetDateTime=function()
		{
            var dt=new Date();
			return dt.formate("yyyy-MM-dd HH:mm:ss");
		};
	//��ȡ���λ���е��ֶ���ֵ,�ڱ��ʽ���÷�ʽ(������ֻ��������,���򲻽���):	����[-1],����[+1],����[2]
	this.GetValue=function(colName,increaserow)
		{
			try
			{
				var col=null;
				for(var j=0;j<gridcal.ColumnList.length;j++)
					if(gridcal.ColumnList[j].Name==colName)
					{
						col=gridcal.ColumnList[j];
						break;
					}
				var xmlRow=gridcal.CurXmlRow.previousSibling;
				if(!xmlRow)		return null;
				var xmlNode=xmlRow.selectSingleNode(colName);
				return (!xmlNode)?null:(ToolUtil.Convert(xmlNode.text,col.DbType));
			}catch(ex)
			{  return  null;}
		};
	//��ȡ��������Դ��ǰ�ֶ���ֵ,�ڱ��ʽ���÷�ʽ(�����������ֶ���,������ǰ������Դ��):	����Դ{�ֶ�}
	//�����ǰ������,����Դ�Ǵӱ��ȡ����Դ�Ļ�������;�ڻ���������û�и��ֶ�;�򷵻ص�ǰ���ֶ�����
	this.GetBandValue=function(itemName,colname)
		{
			try
			{
				if("��"==itemName)
				{
					var tree = igtree_getTreeById("lefttree");
					var node=tree.getSelectedNode();
					if(!node)	return null;
					if(!colname || ""==colname)
						return node.getText();
					var value=null;
					while(node)
					{
						value=ToolUtil.valueTag(node.getTag(),colname);
						if(null!=value)	break;
						node=node.getParent();
					}
					return value;
				}
				var myUnit=document.UnitItem;
				var band=myUnit.getBandByItemName(itemName);
				if(!band)	return null;
				var value=null;
				if(("Master"==gridcal.Band.itemType && "Detail"==band.itemType && (null==band.MasterItemName || ""==band.MasterItemName) )
				    || (gridcal.Band.ItemName && gridcal.Band.ItemName==band.MasterItemName) )
					value=ToolUtil.Convert(band.getFldStrValueSum(colname),"number");
				if(null==value || ""===value)
					value=band.getFldStrValue(colname);
				return	value;
			}catch(ex)
			{  return  null;}
		};
	//���滻����,�ַ���ĺ��ǰ��,�ַ��ٵĺ�ź���,�Է������̵��ǳ���ʱ�滻����
	this.Macro=[
				["#ϵͳ����","Fun.SysDate()"],
				["#��ʼ����","Fun.StartDate()"],
				["#��������","Fun.EndDate()"],
				["#��ǰ����","Fun.EndDate()"],
				["#��ǰʱ��","Fun.GetDateTime()"],
				["#���","Fun.GetCurrentYear()"],
				["#�·�","Fun.GetCurrentMonth()"],
				["#����","Fun.GetCurrentQuarter()"],
				["#�û��ʺ�","Fun.GetUserAccount()"],
				["#����","Fun.GetUserName()"],
				["#����","Fun.GetUserSn()"],
				["#���Ŵ���","Fun.GetDeptCode()"],
				["#��������","Fun.GetDeptName()"],
				["#���۲���","Fun.GetDeptSaleName()"],
				["#��λ����","Fun.GetDWName()"],
				["#��λ����","Fun.GetUnitCode()"],
				["#��˾","Fun.GetCompany()"],
				["#�ϼ�����","Fun.GetDeptSupName()"],
				["#�ϼ���λ","Fun.GetDWSupName()"],
				["#�к�","Fun.GetRow()"],
				["#����","Fun.GetColumnName()"],
				["#��","null"]
			  ];
}

//�ļ���β
if(typeof(GridUtil)=="function")	GridUtil.FileLoaded=true;
