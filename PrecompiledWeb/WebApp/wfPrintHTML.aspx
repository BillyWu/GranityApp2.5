<%@ page language="c#" inherits="Estar.WebApp.wfPrintHTML, App_Web_yawaynrb" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />

    <script type="text/javascript" language="javascript">
		function	Tprint()
		{
			var toolbar=document.getElementById("toolbar");
			toolbar.parentElement.removeChild(toolbar);
			var tabPrintList=document.getElementsByTagName("TABLE");
			for(var i=0;i<tabPrintList.length;i++)
			{
				if(hasPrint(tabPrintList[i]))
					setPrint(tabPrintList[i]);
			}
			window.print();
			//var webprint=document.getElementById("WebBrowser");
			//webprint.ExecWB(6,1);
			return;
			for(var i=0;i<tabPrintList.length;i++)
			{
				if(tabPrintList[i].id=="toolbar")
					continue;
				if(hasPrint(tabPrintList[i]))
					setvisible(tabPrintList[i]);
			}
			window.close();
		}
		//在Table的子节点有设置print属性的元素,就采用套打方式,都没有设置的就采用直接网页打印
		function    hasPrint(childNode)
		{
			if(!childNode.tagName) return false;
			if("TABLE"!=childNode.tagName && childNode.getAttribute("print"))
				return true;
			for(var i=0;i<childNode.childNodes.length;i++)
			{
				var hasP=hasPrint(childNode.childNodes[i]);
				if(hasP)	return true;
			}
			return false;
		}
		//子节点有一个是要打印的就需要显示,返回值是该节点是否显示
		function	setPrint(childNode)
		{
			if(!childNode.style)	return false;
			if("none"==childNode.style.display || "hidden"==childNode.style.visibility)
				return false;
			if("TABLE"!=childNode.tagName && childNode.getAttribute("print"))
				return true;
			var bvisible=false;
			for(var i=0;i<childNode.childNodes.length;i++)
			{
				var bdisplay=setPrint(childNode.childNodes[i]);
				if(bdisplay)	bvisible=true;
			}
			if(childNode.tagName=="TD" || childNode.tagName=="TABLE")
			{
				childNode.setAttribute("printborder",childNode.style.borderWidth);
				childNode.style.borderWidth=0;
				childNode.setAttribute("printbackgroundColor",childNode.style.backgroundColor);
				if(!childNode.style.backgroundColor)
					childNode.setAttribute("printbackgroundColor",childNode.bgColor);
				childNode.style.backgroundColor="white";
			}
			if(childNode.tagName=="TABLE" && childNode.caption)
			{
				childNode.setAttribute("printcaption",childNode.caption);
				childNode.caption="";
			}
			if(!bvisible)
			{
				childNode.setAttribute("printvisible","noprint");
				childNode.style.visibility="hidden";
			}
			return bvisible;
		}
		//恢复可见
		function	setvisible(childNode)
		{
			if(!childNode.style)	return;
			if("TABLE"!=childNode.tagName && childNode.getAttribute("print"))
				return;
			for(var i=0;i<childNode.childNodes.length;i++)
				setvisible(childNode.childNodes[i]);
			if("noprint"==childNode.getAttribute("printvisible"))
				childNode.style.visibility="visible";
			if(childNode.getAttribute("printborder"))
				childNode.style.borderWidth=childNode.getAttribute("printborder");
			if(childNode.getAttribute("printbackgroundColor"))
				childNode.style.backgroundColor=childNode.getAttribute("printbackgroundColor");
			if(childNode.tagName=="TABLE" && childNode.caption)
				childNode.caption=childNode.getAttribute("printcaption");
			return;
		}
		window.onafterprint=function(){window.returnValue=true; window.close();}
    </script>

</head>
<body>
    <form id="Form1" method="post" runat="server">
        <table id="toolbar" border="0" cellspacing="0" cellpadding="0" style="background-color: #d4d0c8;
            width: 272px; height: 126px">
            <tr>
                <td style="width: 60px; height: 16px">
                </td>
                <td style="width: 62px; height: 16px">
                </td>
                <td style="width: 48px; height: 16px">
                </td>
                <td style="width: 68px; height: 16px">
                </td>
                <td style="width: 48px; height: 16px">
                </td>
            </tr>
            <tr>
                <td align="right" style="width: 60px; height: 26px">
                    <img alt="" src="Images\ask.jpg" /></td>
                <th colspan="3" valign="middle" style="width: 176px; height: 26px" align="right">
                    <span style="font-weight: 400">是否打印，请确认！</span>
                </th>
                <td style="height: 26px; width: 48px">
                </td>
            </tr>
            <tr>
                <td style="width: 60px; height: 17px">
                </td>
                <td style="width: 62px; height: 17px">
                </td>
                <td style="width: 48px; height: 17px">
                </td>
                <td style="width: 68px; height: 17px">
                    &nbsp;</td>
                <td style="width: 48px; height: 17px">
                </td>
            </tr>
            <tr>
                <td style="width: 60px; height: 31px">
                </td>
                <td align="left" colspan="3" style="width: 176px; height: 16px">
                    <input style="width: 76px; height: 25px" onclick="Tprint();" type="button" value="确定" />
                    <input style="width: 76px; height: 25px" onclick="window.close();" type="button"
                        value="取消" /></td>
                <td style="width: 48px; height: 31px">
                </td>
            </tr>
            <tr>
                <td style="width: 60px">
                </td>
                <td style="width: 62px">
                </td>
                <td style="width: 48px">
                </td>
                <td style="width: 68px">
                    &nbsp;</td>
                <td style="width: 48px">
                </td>
            </tr>
        </table>
        <asp:Literal ID="ltPrintHtml" runat="server"></asp:Literal></form>
</body>
</html>
