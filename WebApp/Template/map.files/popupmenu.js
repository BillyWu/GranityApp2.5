

//建立菜单后把菜单ID及对象加入document的poputMenuList数组内
//已经有的不再建立直接返回它
//弹出菜单对应Div元素,在其上增加了Logo,MenuItemList,DockElement属性;有SetDock(ctrl),hide(),show()方法
//Logo有SetImg(imgsrc),SetBgcolor(color)方法
//在MenuItemList有AddItem(text,action,image)方法返回MenuItem对象
//MenuItem对象有Text,PopupMenu属性ParentItem对应PopupMenu的MenuItemList元素
function popupmenu(menuID)
{
	//已经建立就返回它,没有就建立它
	var PopupMenuList=document.poputMenuList;
	if(!menuID || ""==menuID)
		if(!PopupMenuList)
			menuID="PopupMenu0";
		else
			menuID="PopupMenu"+PopupMenuList.length;
	if(PopupMenuList && PopupMenuList.length>0)
		for(var i=0;i<PopupMenuList.length;i++)
		{
			if(!PopupMenuList[i])	continue;
			if(menuID==PopupMenuList[i].menuID && PopupMenuList[i].popupMenu)
			{
				var menu=PopupMenuList[i].popupMenu;
				menu.parentNode.removeChild(menu);
				PopupMenuList[i].popupMenu=null;
				break;
			}
		}
	//创建菜单实体
	this.PopupMenu=document.createElement("Div");
	this.PopupMenu.className="popupborder";
	this.PopupMenu.innerHTML=GetTpMenuHTML();
	document.body.appendChild(this.PopupMenu);
	//建立菜单内部层次对象
	this.Logo=GetCtrlByTagD(false,this.PopupMenu,"td","name","logo");
	this.MenuItemList=GetCtrlByTagD(false,this.PopupMenu,"table","name","menulist");
	this.TpMenuItem=GetCtrlByTagD(false,this.PopupMenu,"tr","name","menuitemtp");
	this.TpMenuSplit=GetCtrlByTagD(false,this.PopupMenu,"tr","name","menusplit");
	this.Logo.PopupMenu=this.PopupMenu;
	this.MenuItemList.PopupMenu=this.PopupMenu;
	this.PopupMenu.Logo=this.Logo;
	this.PopupMenu.MenuItemList=this.MenuItemList;
	this.PopupMenu.TpMenuItem=this.TpMenuItem;
	this.PopupMenu.TpMenuSplit=this.TpMenuSplit;
	this.PopupMenu.PopupMenu=this.PopupMenu;
	this.PopupMenu.DockElement=null;			//引发弹出菜单的当前元素
	//定义菜单内部对象
	//设置弹出菜单的控件
	this.PopupMenu.SetDock=function(ctrl)
		{
			if(ctrl.tagName)
				ctrl.oncontextmenu=new Function("return showpopupmenu('"+menuID+"');");
		}
	this.PopupMenu.hide=function()
		{
			this.PopupMenu.style.display="none";
		}
	this.PopupMenu.show=function()
		{
			this.PopupMenu.style.display="";
		}
	this.SetDock=this.PopupMenu.SetDock;
	this.hide=this.PopupMenu.hide;
	this.show=this.PopupMenu.show;
	//设置Logo菜单和背景
	this.Logo.SetImg=function (imgsrc)
		{
			this.innerHTML=GetTpMenuImgHTML();
			var img=GetCtrlByTagD(false,this,"img");
			img.src=imgsrc;
		}
	this.Logo.SetBgcolor=function(color)
		{
			this.bgColor=color;
		}
	//设置菜单项集合的方法
	this.MenuItemList.items=new Array();
	this.MenuItemList.AddItem=function(text,action,image) 
		{
			var item=null;
			if("-"==text)
			{
				item=this.PopupMenu.TpMenuSplit.cloneNode(true);
				this.PopupMenu.TpMenuSplit.parentNode.appendChild(item);
				this.items[this.items.length]=item;
				item.style.display="";
				return item;
			}else{
				item=this.PopupMenu.TpMenuItem.cloneNode(true);
				this.PopupMenu.TpMenuItem.parentNode.appendChild(item);
				this.items[this.items.length]=item;
			}
			item.style.display="";
			item.Text=text;
			item.action=action;
			item.PopupMenu=this.PopupMenu;
			item.ParentItem=this;
			item.onclick=function()
				{ 
					item.PopupMenu.hide();
					item.action(item);
				}
			var tdtitle=GetCtrlByTagD(false,item,"td","name","title");
			tdtitle.innerHTML=text;
			var tdico=GetCtrlByTagD(false,item,"td","name","ico");
			if(image)
			{
				tdico.innerHTML=GetTpMenuImgHTML();
				var img=GetCtrlByTagD(false,item,"img");
				img.src=image;
			}
			return item;
		}
	//加入数组中
	if(!PopupMenuList)
	{
		document.poputMenuList=new Array();	
		document.body.onclick=new Function("hidepopupmenu(); return false;");
		document.body.onscroll=new Function("hidepopupmenu(); return false;");
		document.body.onselectstart=new Function("hidepopupmenu(); return false;");
		window.onresizestart=new Function("hidepopupmenu(); return false;");
		PopupMenuList=document.poputMenuList;
	}
	var inullMenu=-1;	//在数组中为空的序号
	for(var i=0;i<PopupMenuList.length;i++)
	{
		if(!PopupMenuList[i])
		{	
			inullMenu=i;continue;
		}
		if(menuID==PopupMenuList[i].menuID)
		{
			PopupMenuList[i].popupMenu=this.PopupMenu;
			return;
		}
	}
	if(inullMenu<0)
		inullMenu=PopupMenuList.length;
	var thisMenu=this.PopupMenu;
	PopupMenuList[inullMenu]=new function()
	{
		this.menuID=menuID;
		this.popupMenu=thisMenu;
	}
}
//根据菜单ID找到菜单
function  GetPopupMenuByID(menuID)
{
	var PopupMenuList=document.poputMenuList;
	for(var i=0;i<PopupMenuList.length;i++)
	{
		if(!PopupMenuList[i])	continue;
		if(menuID==PopupMenuList[i].menuID && PopupMenuList[i].popupMenu)
			return PopupMenuList[i].popupMenu;
	}
	return null;
}

//显示隐藏菜单
function showpopupmenu(menuID) 
{
 hidepopupmenu();
 var popupMenu=GetPopupMenuByID(menuID);
 if( popupMenu)
 {
	popupMenu.DockElement=event.srcElement;
	popupMenu.style.left=event.clientX+document.body.scrollLeft;
	popupMenu.style.top=event.clientY+document.body.scrollTop;
	popupMenu.style.display='';
 }
 return false;
}
function hidepopupmenu() 
{
	var PopupMenuList=document.poputMenuList;
	if(!PopupMenuList)	return false;
    for(var i=0; i<PopupMenuList.length; i++) 
		if(PopupMenuList[i].popupMenu)
			PopupMenuList[i].popupMenu.hide();
}

//向子级寻找控件,依据标记和属性,没有属性就只根据标记
//isSelf:是否包括ctrl自身;
//ctrl,启点控件,tagName查找的标记元素,attrName控件属性名,attrValue属性值
function GetCtrlByTagD(isSelf,ctrl,tagName,attrName,attrValue)
{
	if(!ctrl)	return null;
	if(isSelf)
	{
		//没有属性名,就只根据标记找
		if(ctrl.tagName.toLowerCase()==tagName.toLowerCase() && !attrName )
			return ctrl;
		//有属性名,就要包含此属性,没有属性值就不用判断属性值是否相等
		if(ctrl.tagName.toLowerCase()==tagName.toLowerCase() && attrName && ctrl.attributes.getNamedItem(attrName) && !attrValue)
			return ctrl;
		//根据标记,属性,及属性值确定控件
		if(ctrl.tagName.toLowerCase()==tagName.toLowerCase() && attrName && ctrl.attributes.getNamedItem(attrName) && 
			attrValue && ctrl.attributes.getNamedItem(attrName).value==attrValue)
			return ctrl;
	}	
	for(var i=0;i<ctrl.children.length;i++)
	{
		if(ctrl.children[i].tagName.toLowerCase()==tagName.toLowerCase() && !attrName )
			return ctrl.children[i];
		if(ctrl.children[i].tagName.toLowerCase()==tagName.toLowerCase() && attrName && ctrl.children[i].attributes.getNamedItem(attrName) && !attrValue)
			return ctrl.children[i];
		if(ctrl.children[i].tagName.toLowerCase()==tagName.toLowerCase() && attrName && ctrl.children[i].attributes.getNamedItem(attrName) && 
			attrValue && ctrl.children[i].attributes.getNamedItem(attrName).value==attrValue)
			return ctrl.children[i];

		var childCtrl=GetCtrlByTagD(isSelf,ctrl.children[i],tagName,attrName,attrValue);
		if(childCtrl)	return childCtrl;
	}
	return null;
}

//菜单模板,带有name属性的元素是不能减少的元素
//
function GetTpMenuImgHTML()
{
	return "<img src=\"\" width=100% height=16 border=0 />";
}
function GetTpMenuHTML()
{
	var tpMenuHTML=""
		//+"<div class=popupborder> "
		+"	<table border=0 cellpadding=2 cellspacing=0 width=100% class=popuptab> "
		+"		<tbody> "
		+"		<tr> "
		+"			<td bgcolor=#8eb2e9 width=16 valign=bottom name=logo>&nbsp;</td> "
		+"			<td bgcolor=buttonface align=center valign=middle width=100%> "
		+"				<table width=100% border=0 cellpadding=0 cellspacing=0 name=menulist> "
		+"					<tr style=display:none; name=menuitemtp> "
		+"						<td valign=middle width=100%> "
		+"							<table border=0 cellpadding=0 cellspacing=0 width=100% class=popupitem onmouseover=this.className='popupitemhigh' onmouseout=this.className='popupitem' height=17> "
		+"								<tr valign=middle><td width=18 align=center name=ico>&nbsp;</td><td valign=middle name=title>菜单文本FF</td></tr> "
		+"							</table> "
		+"						</td> "
		+"					</tr> "
		+"					<tr style=display:none; name=menusplit> "
		+"						<td valign=middle align=center height=8> "
		+"							<table border=0 cellpadding=0 cellspacing=0 width=100% ID=Table3> "
		+"								<tr><td height=1 bgcolor=buttonshadow></td></tr> "
		+"								<tr><td height=1 bgcolor=buttonhighlight></td></tr> "
		+"							</table> "
		+"						</td> "
		+"					</tr> "
		+"				</table> "
		+"			</td> "
		+"		</tr> "
		+"	</tbody> "
		+"	</table> ";
		//+"</div> ";
	return tpMenuHTML;
}
