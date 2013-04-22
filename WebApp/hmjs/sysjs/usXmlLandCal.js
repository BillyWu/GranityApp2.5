// JScript source code

// 创建数据岛的关联的计算对象
function XmlLandCal(xmlLand)
{
	//表格对象,计算列对象数组,要计算的当前行号,要计算的当前行对象,要计算的当前列名称
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
	//校验对象数组,包含内容:ValiExp,AlertMsg
	this.ColCalList=new Array();
	this.ValiCellList=new Array();
	this.RedWordCellList=new Array();
	
	//计算功能提供的函数库
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

//在执行计算前设置计算行
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
//设置计算列,计算列表达式进行判定和转换,不合限制的表达式忽略设置
_p.SetColExp=function()
{
	//sExpression=sExpression.replace(/\s/g,"");		//去掉空格
	//sExpression=sExpression.toUpperCase();			//统一转成大写,实现大小写忽略,也与自动生成的列名大写相符
	//if(sExpression.search(/\w+\(|\./)>-1)				//掉用户表达式禁止使用函数
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
		sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");				//获取相对位置行的字段数值
		sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//获取其他数据源当前字段数值
		for(var j=0;j<this.Fun.Macro.length;j++)
		{
			var re=new RegExp(this.Fun.Macro[j][0],"ig");
			sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
		}
		
		
		var colExpression=new Object();
		colExpression.ColName=attrName.value;
		colExpression.Expression=sExpression;
		colExpression.CalType=(!attrCaltype || ""==attrCaltype.value)?"0":attrCaltype.value;				    //"0"初始化,"1"或其他是动态计算
		colExpression.FCalType=(!attrFCaltype || ""==attrFCaltype.value)?"0":attrFCaltype.value;				//"0"初始化,"1"或其他是动态计算(即在初始化时计算也在值变化时计算)
		this.ColCalList[this.ColCalList.length]=colExpression;
	}
};

//设置校验单元格
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
		//非空项
		if(attrRequired && "1"==attrRequired.value)
		{
			var validity=new Object();
			validity.ColName=attrName.value;
			validity.Title=attrTitle?attrTitle.value:attrName.value;
			validity.ValiExp="ValidatUtil.RequiredField("+attrName.value+")";
			validity.AlertMsg="不能为空！";
			this.ValiCellList[this.ValiCellList.length]=validity;
		}
		//自定义校验
		if(attrExp && ""!=attrExp.value)
		{
			var attrMsg=colList[i].attributes.getNamedItem("alertexpr");
			sExpression=attrExp.value;
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");		//获取相对位置行的字段数值
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//获取其他数据源当前字段数值
			for(var j=0;j<this.Fun.Macro.length;j++)
			{
				var re=new RegExp(this.Fun.Macro[j][0],"ig");
				sExpression=sExpression.replace(re,this.Fun.Macro[j][1]);
			}
			var validity=new Object();
			validity.ColName=attrName.value;
			validity.Title=attrTitle?attrTitle.value:attrName.value;
			validity.ValiExp=sExpression;
			validity.AlertMsg=(!attrMsg)?"非法数据":attrMsg.value;
			this.ValiCellList[this.ValiCellList.length]=validity;
		}
	}
}

//设置校验单元格
_p.SetRedWordCellExp=function()
{
	if(!this.XmlSchema)		return;
	var colList=this.XmlSchema.XMLDocument.selectNodes("//xs:element");
	for(var i=0;i<colList.length;i++)
	{
		var attrName=colList[i].attributes.getNamedItem("name");
		var attrType=colList[i].attributes.getNamedItem("type");
		var attrExp=colList[i].attributes.getNamedItem("redword");
		//自定义校验
		if(attrExp && ""!=attrExp.value)
		{
			sExpression=attrExp.value;
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");		//获取相对位置行的字段数值
			sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//获取其他数据源当前字段数值
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


//执行计算,可以带参数,参数是要计算的行号和类型
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
	    //如果不为指定类型的计算方法，则不处理
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
//求值指定行表达式的值
_p.Evaluation=function(irowindex,sExpression)
{
	sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\[([\d\+\-]+)\]/g,"Fun.GetValue('$1',$3)");				//获取相对位置行的字段数值
	sExpression=sExpression.replace(/((\w|[^\x00-\xff])+)\{((\w|[^\x00-\xff])*)\}/g,"Fun.GetBandValue('$1','$3')");		//获取其他数据源当前字段数值
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
//校验单元格有效性,合法返回"",非法返回提示信息
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
			if(!isDbType) return "*"+col.Name+"类型不匹配*";
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

//校验单元格有效性,合法返回"",非法返回提示信息
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


//校验数据行的有效性,合法返回"",非法返回提示信息
//参数:irow行号,默认当前行; valiType 校验类型,默认仔细校验包括校验数据类型,fast校验是设置了校验项后执行仔细校验,没有设置校验的也不校验数据类型
_p.ValidateRow=function(irow,valiType)
{
	if(!this.XmlSchema || !this.Band.XmlLandData || !this.Band.XmlLandData.XMLDocument 
			|| !this.Band.XmlLandData.XMLDocument.documentElement)
		return "";
	//校验项是fast,并且没有校验项时不校验
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
			_msg += col.Name+"类型不匹配\t";
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
		    //校验提示信息
			if(false==eval(this.ValiCellList[_i].ValiExp))
				_msg += "["+this.ValiCellList[_i].Title+"]:"+this.ValiCellList[_i].AlertMsg+"\t";
		}catch(ex){}
	}
	return _msg;
}
//校验过虑区数据行的有效性,合法返回"",非法返回提示信息
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
			_msg += col.Name+"类型不匹配\t";
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
		    //校验提示信息
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
	//获取相对位置行的字段数值,在表达式中用方式(方框内只能是数字,否则不解析):	列名[-1],列名[+1],列名[2]
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
	//获取其他数据源当前字段数值,在表达式中用方式(花括弧内是字段名,花括弧前是数据源名):	数据源{字段}
	//如果当前是主表,数据源是从表就取数据源的汇总数据;在汇总数据内没有该字段;则返回当前行字段数据
	this.GetBandValue=function(itemName,colname)
		{
			try
			{
				if("树"==itemName)
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
	//宏替换数组,字符多的宏放前面,字符少的宏放后面,以防宏名短的是长的时替换错误
	this.Macro=[
				["#系统日期","Fun.SysDate()"],
				["#开始日期","Fun.StartDate()"],
				["#结束日期","Fun.EndDate()"],
				["#当前日期","Fun.EndDate()"],
				["#当前时间","Fun.GetDateTime()"],
				["#年份","Fun.GetCurrentYear()"],
				["#月份","Fun.GetCurrentMonth()"],
				["#季度","Fun.GetCurrentQuarter()"],
				["#用户帐号","Fun.GetUserAccount()"],
				["#姓名","Fun.GetUserName()"],
				["#工号","Fun.GetUserSn()"],
				["#部门代码","Fun.GetDeptCode()"],
				["#部门名称","Fun.GetDeptName()"],
				["#销售部门","Fun.GetDeptSaleName()"],
				["#单位名称","Fun.GetDWName()"],
				["#单位代码","Fun.GetUnitCode()"],
				["#公司","Fun.GetCompany()"],
				["#上级部门","Fun.GetDeptSupName()"],
				["#上级单位","Fun.GetDWSupName()"],
				["#行号","Fun.GetRow()"],
				["#列名","Fun.GetColumnName()"],
				["#空","null"]
			  ];
}

//文件结尾
if(typeof(GridUtil)=="function")	GridUtil.FileLoaded=true;
