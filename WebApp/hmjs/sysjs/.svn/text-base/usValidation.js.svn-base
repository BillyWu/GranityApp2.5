// 定义校验计算工具对象,对输入控件进行校验
ValidatUtil=new function()
{
	this.initialValue="";
	this.century=2000;
	this.cutOffYear=2029;
	this.dateorder="ymd";
	this.groupChar=",";
	this.decimalChar=".";
	this.digits=2;
	
	this.expTrim=/^\s*(\S+(\s+\S+)*)\s*$/;
	this.expInteger=/^\s*[-\+]?\d+\s*$/;
	this.expDouble=new RegExp("^\\s*([-\\+])?(\\d+)?(\\" + this.decimalChar + "(\\d+))?\\s*$");
	this.expCurrency = new RegExp("^\\s*([-\\+])?(((\\d+)\\" + this.groupChar + ")*)(\\d+)"
            + ((this.digits > 0) ? "(\\" + this.decimalChar + "(\\d{1," + this.digits + "}))?" : "")
            + "\\s*$");
    this.expGroupChar=new RegExp("(\\" + this.groupchar + ")", "g");
	this.expDateYearFirst=new RegExp("^\\s*((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})\\s*$");
	this.expDateYearLast=new RegExp("^\\s*(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))\\s*$");
}
//去掉首尾空格
ValidatUtil.Trim=function(op)
{
	if(null==op)	return "";
	var strop=op;
	if(typeof(op)!="string")
		strop=op.toString();
	var m=strop.match(this.expTrim);
	return	(null==m)?"":m[1];
}
//校验数据类型,返回true,false
ValidatUtil.DbTypeCheck=function(op, dataType) 
{
	if(null==op || ""===op)	return true;
    if( (typeof(op)=="object" && "date"!=dataType.toLowerCase() ) || typeof(op)=="function")
		return false;
    function GetFullYear(year) {
        return (year + parseInt(this.century)) - ((year < this.cutoffyear) ? 0 : 100);
    }
    dataType=this.Trim(dataType);
    var num, cleanInput, m, exp;
    switch(dataType.toLowerCase())
    {
		case "string":
				return true;
		case "int":
		case "integer":
			if(typeof(op)=="number")
			{
				if(isNaN(op))	return false;
				if(Math.ceil(op)==Math.floor(op))
					return true;
				return false;
			}
			if(typeof(op)!="string")
				return false;
			m=op.match(this.expInteger);
			if(null==m)	return false;
			num=parseInt(op,10);
			return (isNaN(num)?false:true);
		case "number":
		case "float":
		case "decimal":
		case "money":
		case "double":
			if(typeof(op)=="number")
				return (isNaN(op)?false:true);
			if(typeof(op)!="string")
				return false;
			m=op.match(this.expDouble);
			if(!m || ((null==m[1] || ""===m[1]) && (null==m[2] || ""===m[2] ) && (null==m[4] || ""===m[4])) )
				return false;
			cleanInput=m[1] + (m[2].length>0? m[2]:"0") +"."+m[4];
			num=parseFloat(cleanInput);
			return (isNaN(num)?false:true);
		case "currency":
			if(typeof(op)!="string")
				return false;
			m=op.match(this.expCurrency);
			if(null==m)	return false;
			var intermed=m[2]+m[5];
			cleanInput=m[1] + intermed.replace(this.expGroupChar,"")+((this.digits>0)?"."+m[7]:0);
			num=parseFloat(cleanInput);
			return (isNaN(num)?false:true);
		case "date":
			if(typeof(op)=="object")
				return (isNaN(new Date(op))? false:true);
			if(typeof(op)!="string")
				return false;
			//如果包含有T,只取T之前的日期校验;该格式解:2006-12-14T00:00:00+08:00
			if(op.indexOf("T")>1)
			    op=op.substring(0,op.indexOf("T"));
			m = op.match(this.expDateYearFirst);
			var day, month, year;
			if (m != null && (m[2].length == 4 || val.dateorder == "ymd")) {
				day = m[6];
				month = m[5];
				year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10))
			}
			else {
				m = op.match(this.expDateYearLast);
				if (m == null) 
				{
					var date=new Date(op);
					return ((!date || isNaN(date))?false:true);
				}
				if (this.dateorder == "mdy") 
				{
					day = m[3];
					month = m[1];
				}
				else {
					day = m[1];
					month = m[3];
				}
				year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10))
			}
			month -= 1;
			var date = new Date(year, month, day);
			var date = (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate()) ? date : null;
			if(null==date)
				date=new Date(op);
			return ((!date || isNaN(date))?false:true);
		default:
			return true;
    }
    return true;
}

//与指定数据按照指定类型做比较,首先校验数据类型,然后对比,如果比较数的对应类型为null,忽略比较
//opvalidated校验数 opcompare比较数,operator比较操作类型, datatype 数据类型
ValidatUtil.Compare=function(opvalidated,opcompare,operator,datatype)
{
	if(null==opvalidated || ""===opvalidated)
		return true;
	if(null==operator)	operator="DataTypeCheck";
	if(null==datatype)	datatype="String";
    if (operator == "DataTypeCheck")
        return this.DbTypeCheck(opvalidated,datatype);
    var op1, op2;
    if ((op1 = ToolUtil.Convert(opvalidated, datatype)) == null)
        return false;
    if ((op2 = ToolUtil.Convert(opcompare, datatype)) == null)
        return true;
    switch (operator)
    {
        case "NotEqual":
        case "!=":
            return (op1 != op2);
        case "GreaterThan":
        case ">":
            return (op1 > op2);
        case "GreaterThanEqual":
        case ">=":
            return (op1 >= op2);
        case "LessThan":
        case "<":
            return (op1 < op2);
        case "LessThanEqual":
        case "<=":
            return (op1 <= op2);
        case "Equal":
        case "==":
            return (op1 == op2);            
        default:
            return (op1 == op2);
    }
}
//正则表达式校验,只对字符串进行这个校验 
// op 校验数, expression正则表达式
ValidatUtil.RegularExpression=function(op,expression)
{
	if(null==op || ""===op)	return true;
    if(typeof(op)!= "string")
		return false;
    if (op.length == 0)
        return true;
    var rx = new RegExp(expression);
    var matches = rx.exec(op);
    return (matches != null && op == matches[0]);
}
//数据区间校验
// 把op和min,max统一到同一种数据类型上校验,空值忽略校验
ValidatUtil.Range=function(op,min,max,datatype)
{
	if(null==op || ""===op)	return true;
	if(null==datatype)	datatype="String";
	return	(this.Compare(op,min,">=",datatype) && this.Compare(op,max,"<=",datatype));
}
//数据为空校验
ValidatUtil.RequiredField=function(op)
{
    if(op==0)op="";
	//if(null==op || ""===op || (isNaN(op) && typeof(op)=="number") )
	if(null==op || ""===op || (isNaN(op) && typeof(op)=="number") )
		return false;
	else
		return true;
	return true;
}

//文件结尾
 if (typeof(GridUtil) == "function") 
GridUtil.FileLoaded=true;