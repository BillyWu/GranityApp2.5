<%@ page language="c#" inherits="Estar.WebApp.WfMain, App_Web_65fgkkog" validaterequest="false" %>
<%@ Register Assembly="Estar.Common.WebControls" Namespace="Estar.Common.WebControls" TagPrefix="wc" %>
<%@ Register Src="XmlConfLand.ascx" TagName="XmlConfLand" TagPrefix="uc1" %>
<!DOCTYPE HTML PUBLIC "-//W3C//Dtd HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>一卡通管理中心</title>
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR"/>
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema"/>
    <link href="hmjs/sysjs/css.css" type="text/css" rel="stylesheet" />
    <link href="hmjs/sysjs/inputctrl.css" type="text/css" charset="gb2312" rel="stylesheet" /> 
    <script src="hmjs/sysjs/dlgwin.js" type="text/javascript" charset="gb2312"></script>
    <script src="hmjs/sysjs/usAjax.js" type="text/javascript" charset="gb2312"></script>    
</head>
<body onselectstart="return false;" style=" overflow:hidden;  padding-right: 0px; padding-left: 0px; padding-bottom: 0px; margin: 0px;padding-top: 0px">
    <script language="javascript" src="hmjs/sysjs/GridUtilXSLT.js" type="text/javascript" charset="gb2312"></script>
    <script language="javascript" src="hmjs/sysjs/ToolUtil.js" type="text/javascript" charset="gb2312" ></script>
    <script language="javascript" src="hmjs/sysjs/framefun.js" type="text/javascript" charset="gb2312" ></script>
    <script language="javascript" src="hmjs/sysjs/winLoadUtil.js" type="text/javascript" charset="gb2312" ></script>
    <script language="javascript" src="hmjs/sysjs/usUnitBase.js" type="text/javascript" charset="gb2312" ></script>
    <script language="javascript" src="hmjs/sysjs/usBandBase.js" type="text/javascript" charset="gb2312" ></script>
    <script language="javascript" type="text/javascript">
    <!--
        //禁止刷新，回退 
        document.onkeydown = function()
        {
            var e = event, t = event.srcElement.type;
            if (e.altKey || (8 == e.keyCode && "text" != t && "textarea" != t && "password" != t)
                || (e.ctrlKey && (78 == e.keyCode || 82 == e.keyCode)) || 116 == e.keyCode)
            {
                e.keyCode = 0;
                e.returnValue = false;
            }
        }
        //禁止右键菜单
        document.oncontextmenu = function() { return false; };
        //禁止选择
        document.body.onselectstart = function() { var t = event.srcElement.type; return "text" == t || "textarea" == t || "password" == t; };    
        window.onload=WinLoadUtil.MDTPLoad;
        function initWin()
        {
            if(!document.UnitItem) return;
            mainform.frames["listbar"].usLoadHandle();
            OpenItemURL(mainform.frames["listbar"].document.body.title);
            document.cookie = "";
            window.setInterval(testMsg,30000);
            window.setInterval(bannerMsg,50000);
        }
		function warnout()
		{
            alert("该用户没有操作权限！");
		    window.opener=null;
		    window.open('','_self');
		    window.close();
		}        
        function createtree(obj)
        {
            mainform.frames["listbar"].createtree(obj);
        }
		
        function ue_path()
        {
            var ls_path=getpath();
            if(location.pathname.lastIndexOf("/html/")>-1)
                ls_path=ls_path.substr(0,ls_path.lastIndexOf("/html/"))
            else 
                ls_path=ls_path.substr(0,ls_path.lastIndexOf("/"))
            return ls_path;
        }        
        function bannerMsg()
        {
            var user = GetUserAccount();
            if(!user) return;
            var xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
            var xmlparams = new ActiveXObject("Microsoft.XMLDOM")
            xmlparams.async=false;
            var s = "exec FH_字幕 '"+user+"'";
            var strxml = '<?xml version="1.0" encoding="utf-8"?>'+
                        '<all><command></command><sql>'+s+'</sql></all>';
            xmlparams.loadXML(strxml); 
            xmlhttp.open("POST",ue_path()+"/XMLdom.aspx",true);           
            xmlhttp.send(xmlparams);
            xmlhttp.onreadystatechange = function()
            {
               if(xmlhttp.readyState == 4 && xmlhttp.status == 200) 
               {         
                    xmldata = xmlhttp.responseXML;delhttp(xmlhttp);
                    if(!xmldata || xmldata.xml=="") {usGetTopFrame().warnout(); return;}
                    if(!xmldata) return;
                    var xmlv = xmldata.selectSingleNode("//table");
                    if(!xmlv || !$("mqbanner")) {$("mqbanner").innerHTML="";return;}
                    $("mqbanner").style.display="block";
                    $("mqbanner").innerHTML="<a style='color:#CC3300;cursor:hand' href='#' onclick='todo()' taget>"+xmlv.text+"</a>";
               }
            }            
        }
        function testMsg()
        {
            var user = GetUserAccount();
            if(!user) return;
            var xmlhttp =new ActiveXObject ("Microsoft.XMLHTTP");
            var xmlparams = new ActiveXObject("Microsoft.XMLDOM")
            xmlparams.async=false;
            var s = "exec 消息提示 '"+user+"'";
            var strxml = '<?xml version="1.0" encoding="utf-8"?>'+
                        '<all><command></command><sql>'+s+'</sql></all>';
            xmlparams.loadXML(strxml); 
            xmlhttp.open("POST",ue_path()+"/XMLdom.aspx",true);           
            xmlhttp.send(xmlparams);
            xmlhttp.onreadystatechange = function()
            {
               if(xmlhttp.readyState == 4 && xmlhttp.status == 200) 
               {         
                    xmldata = xmlhttp.responseXML;delhttp(xmlhttp);
                    if(!xmldata || xmldata.xml=="") {usGetTopFrame().warnout(); return;}
                    if(!xmldata) return;
                    var xmlv = xmldata.selectSingleNode("//table");
                    if(!xmlv) return;
                    $("btnnew").style.display="block";
                    $("btnnew").tag=xmlv.text.replace(user,GetUserName());
               }
            }            
        }
        function showNew(){        
            if(!$("btnnew").tag) return;
            str='<div style="text-align:center;width:99%;height:130;"><p><br/><br/>\
            <A class="linkbtn_0" href="#" onclick="todo()"><img border="0" src="html/Images/new3.gif" />&nbsp;'+$("btnnew").tag+'</A></p></div>\
            <button id="Button2" class="txtbtnex" onclick="ShowHide(\'winmsg\',\'none\');" style="width:70px;height:25px;">关闭</button><br/><br/>';
            DlgWin("winmsg","msgpanel","温馨提示:",null,str,300,200,"bottom","#496D85");
        }
        function todo()
        {
            var o=document.getElementById("mainform").contentWindow.document.getElementById("content").contentWindow.document.UnitItem;
            if(o &&(o.UnitName=="网店客服中心" || o.UnitName=="零售客服中心" || o.UnitName=="零售退货")) {ShowHide("winmsg","none"); return}
            if(!o || o.UnitName!="待办事宜")
            {
         	    var result = confirm("是否立即去办理?     ");
	            if(result) IOpenItemURL("待办事宜");
            }
            ShowHide("winmsg","none");
        }
        function afterWinClose(wid)
        {
            var owin = dwobj(wid)
            if(owin && owin.items=="master" && currentfindband() && mainTable.tag==1) {$band(currentfindband()).XQuery();return};
            $("btnnew").style.display="none";
        }
        
        function diagclose(){$("dialogCase").style.display="none";}
		function maxwindow()
		{
			if($("toptable").style.display=="")
			{
				$("toptable").style.display="none";
				$("tdsub").style.display="none";
				$("btnscreen").innerText="恢复窗口";
			}
			else
			{
				$("toptable").style.display="";
				$("tdsub").style.display="";
				$("btnscreen").innerText="全屏";
			}
		}
    --></script>
    
    <form id="Form1" method="post" runat="server">
    <asp:Xml ID="xmlparam" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
    <uc1:XmlConfLand ID="xmlConf" runat="server" />
    <div style="display:none;">
            <input id="hlb_cmd" style="width: 155px; height: 1px" type="hidden" name="hlb_cmd" runat="server" />
            <asp:ListBox ID="lstb" runat="server" AutoPostBack="True" EnableViewState="False" Rows="1"></asp:ListBox>
            <asp:Button ID="bt_PostBack" runat="server" Height="1px" Text="PostBack"></asp:Button>
            <input id="hlbRequestParams" type="hidden" name="hlbRequestParams" runat="server" />
    </div>
<table id="tblwindow" style="width: 100%;;height:100%" cellspacing="0" cellpadding="0" border="0" bordercolor="scrollbar">
            <tbody>
	        <tr>
	        <td valign="top" height="64"  colspan=2 id="tdmainbanner">
				<table border="0" width="100%" id="table1" cellspacing="0" cellpadding="0" height="64">
					<tr>
						<td  width="20%"><input border="0" src="index/glogo.png" name="I1" type="image"></td>
						<td  width="74%" valign=bottom>
						<table border="0" align=right width="100%" cellpadding="0" style="border-collapse: collapse; font-family:宋体; font-size:9pt; color:#FFFFFF" id="table2">
							<tr>
								<td id="cToolbar" dir="ltr" noWrap="" height="20" align="center" valign=top>
							<table cellSpacing="0" cellPadding="0" border="0" align=right width="200" 
							style="height:18;border-collapse: collapse; font-family:宋体; font-size:8.7pt; color:#a37906" id="table3">
							<tr>
								<td class="ct0" noWrap="" align="center"  height="16"><A href="#" onclick="javascript:window.open('http://www.granity.com.cn/')">联系我们</A></td>
								<TD class="ctsep" >|</TD>
								<td class="ct0"  noWrap=""
								 align="center"   height="16"><A href="#"  onclick="javascript:window.open('http://www.granity.com.cn/')">收　藏</A></td>
								<TD class="ctsep" >|</TD>
								<td class="ct0"  noWrap=""
								 align="center"  height="16"><A href="#" onclick="javascript:window.location.href;this.style.behavior='url(#default#homepage)';this.setHomePage('http://localhost:8087/HMApp/index.htm');"><IMG id="cbar" title="设为首页" style="cursor:hand" src="index/mbar.gif" border="0" /></A></td>
								 <td style="width:20"></td>
							</tr>
							</table>
								</td>
							</tr>
							<tr>
							<td height="20"><marquee id="mqbanner" scrollAmount=2  onmouseover=stop() style="font: 110% normal;color:#003300;" onmouseout=start() width=80%>欢迎使用智能一卡通管理系统</marquee></td>
							</tr>
							<tr>
							<td id="cToolbar1" align="center" height="20">
								</td>
							</tr>							
						</table>
						</td>
					</tr>
					<tr>
					<td height="1"></td>
					</tr>			
				</table>
				</td>
	        </tr>
            <tr>
                <td id="Td2" frameBorder=0 scrolling=no  style=" width:100%;background-image:url(index/m_02.gif);height:12px" valign="top" colspan=2>
                </td>
            </tr>	        
            <tr>
                <td id="frmTitle" frameBorder=0 scrolling=no  style=" width:100%" valign="top" colspan=2>
                <iframe id="mainform" style="" src="contents.htm" frameborder="0" width="100%" scrolling="no" height="100%"></iframe>
                </td>
            </tr>
            <tr style="background-image:url(index/eb.gif)">
                <td id="Td1" valign="middle" align="left" style="border-left:1px solid #A5B6C8; border-right:medium none #A5B6C8; border-top:1px solid #A5B6C8; border-bottom:1px solid #A5B6C8; width: 87%;height:25;color: #000033; font-size: 8.7pt;" runat="server" bgcolor="#F7F7F7">
                　<span id="userinfo" runat="server" style="font-size:10pt"></span>
                </td>
                <td align="center" valign="baseline" style ="border-left:medium none #A5B6C8; border-right:1px solid #A5B6C8; border-top:1px solid #A5B6C8; border-bottom:1px solid #A5B6C8; " bgcolor="#F7F7F7">
                　<IMG id="btnnew" title="您有新办件要处理！" style="display:none;cursor:hand;vertical-align:middle" onclick="this.style.display='none';showNew()" src="html/images/new4.gif" border="0" /></td>                
            </tr>
        </tbody>
        </table>       
        </form>
</body>
</html>
