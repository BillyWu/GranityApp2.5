

//�����˵���Ѳ˵�ID���������document��poputMenuList������
//�Ѿ��еĲ��ٽ���ֱ�ӷ�����
//�����˵���ӦDivԪ��,������������Logo,MenuItemList,DockElement����;��SetDock(ctrl),hide(),show()����
//Logo��SetImg(imgsrc),SetBgcolor(color)����
//��MenuItemList��AddItem(text,action,image)��������MenuItem����
//MenuItem������Text,PopupMenu����ParentItem��ӦPopupMenu��MenuItemListԪ��
function popupmenu(menuID)
{
	//�Ѿ������ͷ�����,û�оͽ�����
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
	//�����˵�ʵ��
	this.PopupMenu=document.createElement("Div");
	this.PopupMenu.className="popupborder";
	this.PopupMenu.innerHTML=GetTpMenuHTML();
	document.body.appendChild(this.PopupMenu);
	//�����˵��ڲ���ζ���
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
	this.PopupMenu.DockElement=null;			//���������˵��ĵ�ǰԪ��
	//����˵��ڲ�����
	//���õ����˵��Ŀؼ�
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
	//����Logo�˵��ͱ���
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
	//���ò˵���ϵķ���
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
	//����������
	if(!PopupMenuList)
	{
		document.poputMenuList=new Array();	
		document.body.onclick=new Function("hidepopupmenu(); return false;");
		document.body.onscroll=new Function("hidepopupmenu(); return false;");
		document.body.onselectstart=new Function("hidepopupmenu(); return false;");
		window.onresizestart=new Function("hidepopupmenu(); return false;");
		PopupMenuList=document.poputMenuList;
	}
	var inullMenu=-1;	//��������Ϊ�յ����
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
//���ݲ˵�ID�ҵ��˵�
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

//��ʾ���ز˵�
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

//���Ӽ�Ѱ�ҿؼ�,���ݱ�Ǻ�����,û�����Ծ�ֻ���ݱ��
//isSelf:�Ƿ����ctrl����;
//ctrl,����ؼ�,tagName���ҵı��Ԫ��,attrName�ؼ�������,attrValue����ֵ
function GetCtrlByTagD(isSelf,ctrl,tagName,attrName,attrValue)
{
	if(!ctrl)	return null;
	if(isSelf)
	{
		//û��������,��ֻ���ݱ����
		if(ctrl.tagName.toLowerCase()==tagName.toLowerCase() && !attrName )
			return ctrl;
		//��������,��Ҫ����������,û������ֵ�Ͳ����ж�����ֵ�Ƿ����
		if(ctrl.tagName.toLowerCase()==tagName.toLowerCase() && attrName && ctrl.attributes.getNamedItem(attrName) && !attrValue)
			return ctrl;
		//���ݱ��,����,������ֵȷ���ؼ�
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

//�˵�ģ��,����name���Ե�Ԫ���ǲ��ܼ��ٵ�Ԫ��
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
		+"								<tr valign=middle><td width=18 align=center name=ico>&nbsp;</td><td valign=middle name=title>�˵��ı�FF</td></tr> "
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
