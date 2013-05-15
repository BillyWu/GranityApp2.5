/**
    工具套,全程对象,向其他提供通用处理,可以跨页面使用
    向子级寻找控件,依据标记和属性,没有属性就只根据标记

    ToolUtil.getCtrlByTagD(isSelf,ctrl,tagName,attrName,attrValue)
    ToolUtil.getCtrlByTagU(isSelf,ctrl,tagName,attrName,attrValue)
    ToolUtil.getCtrlByNameD(isSelf,ctrlContain,attrName,attrValue)
    ToolUtil.getCtrlListByNameD(isSelf,ctrlContain,attrName,attrValue,ctrlList)
    ToolUtil.sleep(numberMillis)
    
    ToolUtil.Trim(op)           去掉首尾空格
    ToolUtil.TransferQuot(str)    //对字符串内的单引号转义\'
    ToolUtil.Convert(op, dataType)  //转换数据类型:string,bool,int,number,decimal,date
    ToolUtil.NewGUID()	//从服务器上获取一个新的GUID值
    ToolUtil.NewDJBH(billtype)	//从服务器上获取一个新的单据编号值
    ToolUtil.getColor(index)    //从备选的颜色方案中选择一个颜色
    //获取字段数据类型，输出为常用表达方式，用于后台数据类型,javascrip的基本数据类型:string,bool,int,decimal,datetime
    ToolUtil.tranDBType = function(xmldatatype)
    ToolUtil.tranDataTypeCh = function(xmldatatype) //获取字段数据类型，输出为中文表达方式
    //获取字段数据类型，输出为XSLT数据类型，用于XSLT转换: text, number
    ToolUtil.getParamValue=function(paramXmldoc,PR,PRname,PL,key)                   //读取参数
    ToolUtil.setParamValue=function(paramXmldoc, PR, PRname,PL,key,value,dbtype)    //参数赋值
    ToolUtil.delParam     =function(paramXmldoc,PR,PRname,PL,key)                   //删除参数
    ToolUtil.valueTag = function(stagvalue,skey)    //取值
    对Tag标记字典值对赋值;返回形成的Tag字符串;如果svalue为null就删除该键值对
    形成字符串样式: @key=value,@key=value,@key=value
    ToolUtil.setValueTag = function(stagvalue,skey,svalue)
    ToolUtil.getParamValue
    ToolUtil.XmlHttpInst=function(isCreateSingle)   //从XMLHttp对象池获取对象,减小客户端资源浪费,isCreateSingle 孤立的XMLHttp对象不放入对象池
    ToolUtil.XmlDocumentInst=function(isCreateSingle)   //从对象池获取对象,机制同XMLHttp
    this.XmlHttpConn                                //对象, 与服务器端连接测试的xmlhttp对象
    
    //向服务端提交请求,请求参数及请求命令在参数文档中声明;Command参数
    //正常时返回XmlHttp对象,使之获取请求结果,不包含异常处理
    ToolUtil.SendPost=function(xmldoc)
*/

//创建Grid对象辅助工具对象
//GridUtil.getXslSortHTML()		数据岛排序的xslt代码
//GridUtil.getXslSumHTML()		数据岛汇总的xslt代码
//GridUtil.getXslGroupSumHTML()	数据岛分组汇总的xslt代码
//GridUtil.getXslSelectHTML()	数据岛下拉框xslt代码
//GridUtil.getXslDictHTML()		数据岛字典列xslt代码
//GridUtil.getXslFilFldHTML()	数据岛过虑列xslt代码
//GridUtil.getXslNoFilFldHTML() 数据岛过虑掉的数据xslt代码
//GridUtil.getXslFilterHTML()	数据岛过虑条件的xslt代码
//GridUtil.XSLLandSort			排序转换XSL数据岛
//GridUtil.XSLLandSum			汇总转换XSL数据岛
//GridUtil.XSLLandSelect		Select转换XSL数据岛
//GridUtil.XSLLandDict			对Grid字典列控件使用数据岛绑定的XSLT模板
//GridUtil.XSLLandFilFld		对数据岛列过虑的数据XSLT模板
//GridUtil.XSLLandNoFilFld		对数据岛列过虑掉的其他数据XSLT模板
//GridUtil.XSLLandFilter		对数据岛过虑条件过虑的XSLT模板
//GridUtil.XSLlandGroupSum		XSLT数据转换
//输入模板辅助控件的事件

//Document.UnitItem指定了该对象的一个实例
//完成功能:获取关联项目的主从关系,项目名与Grid的ID名与数据岛名与内容结构名及对象的对应
//反映了业务(项目关系名),数据(数据岛),结构(结构岛),展现(Grid控件)之间的互相关系。
//打印类型,项目名与Grid名ID的对应,当前操作的项目
/*
*/
/*
	UnitItem类的方法属性:
	this.XmlConf		单元的重要属性数据岛
	this.Bands			项目段数组
	this.BandMaster		主项目段
	this.BandDetails	明细项目段数组
	this.ActiveBand		当前Band
	this.UnitName		单元名称
	this.BillType       单据类型
	this.SaveType       保存类型:无,保存后刷新:saverefresh
	this.getBandByItemName=function(itemName)	根据项目名称得到对应的Band
	this.getBandById=function(id)	            根据项目数据岛ID得到对应的Band
	this.setActiveBand=function(itemName)		根据项目名称设置当前项目Band
	this.getActiveBand=function();				读取当前项目Band
	this.setViewState=function();				设置当前Unit的Band数据更新状态
	this.saveData=function()                    保存单元数据,重置记录状态
    this.Query=function()                       单元刷新数据;如果已经掉线直接返回不刷新
	this.getState=function()					控件恢复提交前状态,数据重新绑定就不再保持状态;或者初始化状态;
	this.CheckInParentUnit()					把当前选择数据签入到来源窗口单元当前Band记录中:当前单元所在窗口是模式选择窗口,签入数据的方式有:更新当前行,导入新增行记录
	this.ReadClientUp()							读入用户上传的客户端用户XML数据
	this.SaveLocal()							把当前数据存入本地文件
	this.IsModifyDetail()						明细数据是否有修改
	this.IsModify()								当前所有的段数据是否修改
	this.ValidatityAll(isPostBack)				校验当前所有的项目段;是否保存提交前校验;如果是提交前校验则设置IsValidSave为false的不校验;
	
*/
//xmlLand 数据岛对象;divTab 表格容器; xmlTabTp 表格模板xml文档
/*
    使用模板表格,来定制不同风格的Grid,
	使用的自定义标记有：底板:[divtype=body|title|detail]
						行TR:[rowType=title|detail|edit|readonly]
						列TH,TD: [tdType=coltitle|coldata],[colname=列名],[datatype=string|date|int|select]
						单元格内控件:[colname=列名]
	Grid滚动条使用[divtype=body]控制整体,[divtype=detail]控制明细区内容,在创建Grid控件时就初始化宽度和高度
	标题使用标题区的[rowType=title]作为标题行,[tdType=coltitle]作为标题的模板单元格及标题标签
					[rowType=edit] 作为编辑类型的单元格模板,[datatype=string|date|int|select]多种列类型的单元格模板
					[rowType=readonly]..只读类型...........,[datatype=string|date|int|select]多种列类型的单元格模板
	行记录用明细区的[rowType=detail]作为模板行,[tdType=coldata]作为列数据的模板单元格及数据标签位置
	
	创建Grid时，根据数据岛的字段内容,在模板字段[tdType]的位置建立列,依次增加全部的列属性,
	在明细数据区中,根据列的数据类型使用不同的单元格模板
	
	编辑风格的单元格模板使用[rowType=edit]的对应[datatype]数据类型作为作为单元格模板
	只读风格的单元格模板使用[rowType=readonly]的对应[datatype]数据类型作为作为单元格模板
	
	标题行和明细区的TD的colname对应结构的xs:element节点名称
*/
//Grid方法
//document.GridList是当前页面注册的Grid控件数组
//GridUtil.getGridByName(gridName)可以根据ID获取该Grid对象
/*
this.dataBindRefresh=function(xmlLand){};
this.NewRecord=function(){};
this.DeleteRecord=function(rowIndex){};
this.DelRowSelected=function(){};
this.setChSchemaXml(){};
//保存Grid列宽度的改变,利用xmlhttp方式
this.saveWidth=function()
this.setFunArea=function();
this.clearColor=function(){};
this.Sum=function(){};
this.Sort=function(colname,datatype,ascdesc){};
this.setActiveCell=function(tdCtrl){};
this.setFocus=function()
this.setSelectedRow=function(rowIndex,isSelected,isSingle){};
//设置ctrlContain的颜色类型;
//state值有：browse,current,actived,mouseover,selected;默认browse
this.setCtrlStateColor=function(ctrlContain,state)
this.setRowCursor=function(isRowCursor){};     //isRowCursor 是否更新行标,行标应用RowNum字段
this.setFunArea();		设置翻页功能区内容
this.setRowChecked(){};		//对于有选择框checked列风格Grid，设置行选择标记
	Grid属性：
	this.GridDiv	        Grid底板
	this.Name		        Grid的ID名
	this.ItemName	        Grid对应的项目名
	this.DivBody	        Grid显示区
	this.DivDetail	        Grid明细汇总区的Div底板
	this.DivTitle	        Grid标题区的Div底板
	this.DivFunArea         Grid功能栏的Div底板
	this.TabTitle	        Grid标题表格
	this.Table		        Grid明细表格
	this.TabFoot	        Grid脚注表格
	this.XmlLand=null;	    //明细数据岛
	this.XmlChanged=null;   //删除的数据岛
	this.XmlSchema=null;	//明细数据结构数据岛
	this.XmlSum=null;		//汇总数据的数据岛
	this.XmlSumTemp=null;	//汇总数据的临时数据岛
	this.HiddenFoot=false;	//隐藏脚注,默认不隐藏
	this.HasRowChecked=false;//是否有行选择框
	this.CtrlMsg			//消息提示控件
	this.actBgColor	= "#BEC5DE";
	this.actFacColor= "black";
	this.curBgColor= "#ccffcc";
	this.curFacColor= "black";
	this.curOverBgColor="#BEC5DE";
	this.curOverFacColor="black";
	this.browseBgColor="white";
	this.browseFacColor="black";
	this.selBgColor="#BEC5DE";
	this.selFacColor="black";
	this.borderColor="#ece9d8";
	
	this.curTd=null;
	this.curTr=null;
	this.RowSelectedList=new Array();	Grid当前选择的TR行数组
	
*/

//Document.UnitItem指定了该对象的一个实例
//完成功能:获取关联项目的主从关系,项目名与Grid的ID名与数据岛名与内容结构名及对象的对应
//反映了业务(项目关系名),数据(数据岛),结构(结构岛),展现(Grid控件)之间的互相关系。
//打印类型,项目名与Grid名ID的对应,当前操作的项目
/*
*/
/*
	
	Band项目段的方法属性:
	this.key			项目名为键名
	this.ID             项目段对应的控件定义ID值
	this.ItemName		项目名
	this.SynchBands     同步段数组
	this.itemType		项目类别: Detail	Master	General		Report	Detail
	this.IsImport       设置是否是导入项,在数据导入时设置"1"表示需要导入使用的数据项
	this.HlbCommand     项目的回传命令按钮
	this.printType		项目打印类型
	this.linkCol		关联列名
	this.linkColM       如果项目段不是主段,并且有明细时设置linkcolm属性来设置与明细的关联字段
	this.RightCol       控制读写的表达式或字段
	this.keyCol			主键名
	this.XmlLandData	项目对应数据岛;(数据岛隐藏有行标字段:RowNum)
	this.XmlSchema		项目对应结构
	this.XmlChanged=null;	删除的数据
	this.XmlDict=null;		字典数据
	this.XmldocFilter=null;	过虑数据文档
	this.Event          传递对象内事件参数的对象:rowIndex,colName
	this.Grid			项目对应的显示Grid
	this.UnitItem		项目对应的单元项对象
	this.IsPostBackFull 在回传页面时数据岛数据是否全部回传;默认只回传修改数据;
	                    如果全部回传,在服务端就把数据全部加载入然后展示,数据不记录入视图状态;
	this.RefreshForce   是否强制数据检索刷新数据岛,默认是false
	this.ManualRefresh  是否手动刷新明细数据;默认是false
	this.IsValidSave    是否保存时校验;默认是true;
	this.IsSaveLocal    是否保存到本地;默认是true;
	this.QueryParamList    查询参数对象数组; param=new function(){this.PName="";this.PType="";this.PValue="";}
	this.setQueryParam(pName,pType,pValue)      设置查询参数;原来有的同名参数改写为新值,没有的增加;
	this.delQueryParam(pName)                   删除查询参数;
	this.clearQueryParam()                      清空查询参数;删除参数数组,建立一个新数组
	this.hasCustomValueTp   是否有自定义band:Name 控件;默认true;在行改变事件检查是否有这类配置,如图片显示控件

	this.FilterFld=function(fldname,value)		过虑某字段的值,参数为空,全部过虑
	this.Filter=function(expression)			根据过虑条件过虑数据,参数为空,清除过虑
	this.SearchRowIndex=(value,isNext)          模糊搜索包含value值的行号
	this.Sort=function(colname,datatype,ascdesc)根据指定列名,类型,升降顺序排序数据岛数据
	this.getXmlNodeRows=function(expression)	在当前显示区中查找行节点
	this.getXmlNodeRowsFull=function(expression)在当前显示区和过虑区查找行节点
	this.Sum=function(){};						汇总数据岛数据
    this.RecordCount=function()                 读取数据项的记录行数;没有数据岛,或者没有记录都返回0
	this.GroupSum=function(fldname)				分组汇总数据:fldname分组字段

	this.getDataType(fldname)					读取字段的类型:string,bool,int,decimal,datetime
	this.setCurrentRow(rowIndex);				设置当前行,如果有Grid,当前列单元格定位光标
	this.getTransParam=function(rowIndex)		读取指定行生成的传输参数XmlNode节点:<ParamList><Param name='' type='' value='' /></ParamList>
    this.getTransParamsFull=function()          生成当前数据区的所有参数,返回跟节点
    this.BuildParamNotSelf=function()           生成系统参数,本项目主表的参数,包含自身设置setQueryParam建立的参数,不包含本项目的当前行环境
                                                返回跟节点
    this.BuildParamSelf=function                生成系统参数,本项目主表的参数,包含自身设置setQueryParam建立的参数,并且包含本项目的当前行环境内容
                                                返回跟节点
    this.SetBuildParam=function(Proot,Pkey,Pvalue)       设置本项目生成的参数:Proot,参数跟节点;Pkey参数名称;Pvalue参数值

	this.getState=function()					控件恢复提交前状态,数据重新绑定就不再保持状态;
	this.cmd_nav=function(nav,pageindex)		数据翻页

    动态过虑;根据当前行数据和指定参数返回指定列配置的filterdata数据xml文档
    this.getFilterContent=function(indexrow,dataItem,paramName,paramValue)  //获取过滤数据集

	this.setModalContent(appentItemName)		根据附加项,弹出模式窗口来选择行,根据返回行添加记录或对行字段赋值
    this.Query=function(aryParamList)           查询数据,清空过滤区,删除区记录.

    this.refreshFilterFld=function(fldname,value)   更新数据放入过滤区,刷新数据只从过滤区中刷新数据,不访问服务端,即软刷新
	this.refresh()								刷新数据岛数据;依据系统参数和主表当前行参数刷新数据
	this.setRefreshForce=function(isForce)      本数据项是明细项,设置否硬刷新;默认软刷新:false;
	                                            设置true执行硬刷新,无论关联字段值是否为空,都执行刷新;
	                                            设置false执行软刷新,在关联字段值为空时,不从数据库读取数据,只清空当前数据,把修改数据放入过滤区;
	                                            设置主数据项行的明细项硬刷新属性:rootM.childNodes[rowIndex].setAttribute("refreshforce","true");由页面定制程序自己确定
	                                            默认主项新行软刷新;明细项使用软刷新
	this.ManualFilterDatail()                   手动执行过滤明细数据
    //对象自定义事件执行,方便外部接口编程
    this.FireEvent=function(eventName)          可触发事件有:AfterRowChanged,AfterCellEditChanged;
	
	Band可以外接的事件:
	Event 对象的内容:   rowIndex,colName
	this.AfterRowChanged=null;                  在行改变后触发
	this.AfterCellEditChanged=null;             在单元格编辑改变后触发
	this.AfterSum=null;                         在表格汇总合计后触发
	this.AfterNewRecord=null                    在新行建立后行改变事件后触发
	this.DbClickHandle=null                     在Grid行双击事件后触发
	this.AfterSave=null;                        在数据保存后触发
	Band数据岛行的属性:state 状态属性,表明该行的增删改操作,selected 属性记录选择项,refreshforce 说明对应该行的明细执行硬刷新,软刷新;
*/


//GridUtil分为两个文件组成:GridUtilXSLT.js 和 GridUtilFun.js


//创建Grid对象辅助工具对象
//GridUtil.getGridByName(gridName)	根据名称获取Grid对象
//GridUtil.usOnTitMouseMove()		Grid列宽度改变
//GridUtil.usOnTitMouseUp()			Grid列宽度改变
//GridUtil.usOnTitClick()           Grid列排序
//GridUtil.usSearch(val)			查找
//GridUtil.usOnDetailMouseOverHandle()		鼠标滑过明细记录行
//GridUtil.usOnDetailMouseOutHandle()		鼠标滑开明细记录行
//GridUtil.usOnScrollHori()
//GridUtil.usOnRowcursorClickHandle()

//GridUtil.usOnCellFocusHandle()
//GridUtil.usOnCellRFocusHandle()
//GridUtil.usOnCellBlurHandle()
//GridUtil.usOnCellUpdatedHandle()
//GridUtil.usOnCellChangeHandle()
//GridUtil.usOnCellEnterTab()
//GridUtil.usOnCellRadioClickHandle()       单选按钮
//GridUtil.usOnCellImgClickHandle()			点击图片
//Gridutil.usOnCellLinkClickHandle()		点击链接打开附加窗口
//GridUtil.usOnCellDbClickHandle()			双击单元格出现模式窗口选择记录
//GridUtil.usOnCellCheckedSelectHandle()	对于有选择框checked列风格Grid，设置xmlRow标记selected属性
//GridUtil.usOnCellBtnClickHandle=function()	点击单元格内按钮弹出模式窗口

//GridUtil.usOnRowEnterHandle()				主表行改变事件
//GridUtil.usOnRowEnter2Handle()			无明细表行改变事件

//输入模板控件事件
//GridUtil.usOnCtrlFocusHandle=function()
//GridUtil.usOnCtrlUpatedHandle=function()
//GridUtil.usOnCtrlBlurHandle()
//GridUtil.usOnCtrlChangeHandle()
//GridUtil.usOnCtrlEnterTab=function()      编辑模板控件回车跳格

//ControlUtil
//工具套,全程对象,向其他提供通用处理,只在当前页面使用,可以引用定级ToolUtil资源,使得本页面可以不必引用ToolUtil.js

/*
	校验对象具有的方法:
//去掉首尾空格,返回字符串,不是字符类型转换为字符类型
ValidatUtil.Trim(op)
//转换类型,把字符串转换为指定类型,失败返回null;可转换类型：String,Integer,Double,Date
ValidatUtil.Convert(op,dataType) 
//对操作数进行数据类型校验,成功返回true,失败返回false;可校验类型：String,Integer,Double,Date
ValidatUtil.DbTypeCheck(op,dataType) 
////与指定数据按照指定类型做比较,首先校验数据类型,然后对比,如果比较数的对应类型为null,忽略比较
ValidatUtil.Compare(opvalidated,opcompare,operator,datatype)
//正则表达式校验
ValidatUtil.RegularExpression(op,expression)
//数据区间校验
ValidatUtil.Range(op,min,max,datatype)
//非空字段的校验
ValidatUtil.RequiredField(op)
*/

/*
    gshowModalDialogReturn 为打开模态窗口并返回后的标志,如果在模态窗口中有对父窗口band进行行的移动操作，则将此标志置1
*/