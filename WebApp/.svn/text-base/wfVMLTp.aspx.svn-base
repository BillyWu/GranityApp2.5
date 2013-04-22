<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wfVMLTp.aspx.cs" Inherits="Estar.WebApp.wfVMLTp" ValidateRequest="false" %>

<%@ Register Assembly="Estar.Common.WebControls" Namespace="Estar.Common.WebControls" TagPrefix="wc" %>
<%@ Register Src="XmlConfLand.ascx" TagName="XmlConfLand" TagPrefix="uc1" %>
<%@ Register Src="GridLand.ascx" TagName="GridLand" TagPrefix="uc3" %>
<%@ Register Src="TreeLand.ascx" TagName="TreeLand" TagPrefix="uc4" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <title>wfTest2</title>
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
    <script type="text/javascript" language="javascript">

			
			function maxwindow()
			{
				var win = this.parent.parent.window;
				var winimg = document.getElementById("imgMax");
				var imgsrc = winimg.src;
				if(win.document.getElementById("tdmainbanner").style.display=="")
				{
					winimg.src="Images/wrestore.gif";
					winimg.title = "恢复地图窗口大小";
					win.document.getElementById("tdmainbanner").style.display="none";
				}
				else
				{
					winimg.src="Images/wmax.gif";
					winimg.title = "地图窗口最大化";
					win.document.getElementById("tdmainbanner").style.display="";
				}
				
			}
			
			function  onMDown()
			{
			  var mainban=this.parent.parent.window.document.getElementById("tdmainbanner");
			  if(""==mainban.style.display)
			     event.srcElement.src="images/wmax_down.gif";
			  else
				 event.srcElement.src="images/wrestore_down.gif";
			}
			
			function  onMOver()
			{
			  var mainban=this.parent.parent.window.document.getElementById("tdmainbanner");
			  if(""==mainban.style.display)
			     event.srcElement.src="images/wmax_over.gif";
			  else
				 event.srcElement.src="images/wrestore_over.gif";
			}			
			
			function onMOut()
			{
			  var mainban=this.parent.parent.window.document.getElementById("tdmainbanner");
			  if(""==mainban.style.display)
			     event.srcElement.src="images/wmax.gif";
			  else
				 event.srcElement.src="images/wrestore.gif";
			}			
	    </script>

</head>
<body scroll="no" >
    <script language="javascript" src="hmjs/sysjs/GridUtilXSLT.js" type="text/javascript" charset="gb2312"></script>
    <iframe id="iframeWeb" width="0" height="0"></iframe>
    <form id="Form1" method="post" runat="server">
            <div style="display:none" >
                <asp:Xml ID="xmlParam" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
                <uc1:XmlConfLand ID="xmlConf" runat="server" />
                <input id="hlb_cmd" style="width: 155px; height: 1px" type="hidden" name="hlb_cmd" runat="server" />
                <asp:Button ID="bt_PostBack" runat="server" Height="1px" Text="PostBack" OnClick="bt_PostBack_Click"/>
                <asp:ListBox ID="lstb" runat="server" AutoPostBack="True" EnableViewState="False" Rows="1"></asp:ListBox>
                <input id="hlbRequestParams" type="hidden" name="hlbRequestParams" runat="server" />
                <asp:Literal ID="ltHTML" runat="server"></asp:Literal>
        </div>

        <table id="table1" style="height: 100%; width: 100%" cellspacing="0" cellpadding="0"
            border="0">
            <tr>
<%--                <td id="frmleft" style="width: 167px; height: 100%" valign="top" align="left" rowspan="2"
                    runat="server">
                </td>
                <td id="tdsplit" style="border-right: lightsteelblue 1px solid; border-top: 1px;
                    border-left: 1px; border-bottom: 1px; height: 436px; width: 1%; background-color: #f1f1f6"
                    valign="top" rowspan="2" runat="server">
                </td>--%>
                <td style="height: 100%; width: 100%" valign="top" align="center">
                    <table id="__01" style="height: 100%; width: 100%; background-color: #cccccc" cellspacing="0"
                        cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td id="tdleftcorner" style="height: 33px; background-image: url(images/mapfram_01.gif);
                                    width: 2px;">
                                </td>
                                <td style="height: 33px; width: 40; background-image: url(images/mapfram_02.gif)">
                                </td>
                                <td id="hinttext" style="font-size: 10pt; width: 157px; height: 33px; background-image: url(images/mapfram_03.gif)"
                                    valign="bottom" align="left">
                                    网点地图：
                                </td>
                                <td style="height: 33px; width: 118px; background-image: url(images/mapfram_03.gif)"
                                    valign="bottom" align="left">

                                </td>
                                <td style="height: 33px; width: 96px; background-image: url(images/mapfram_03.gif)"
                                    valign="bottom" align="left"></td>
                                <td style="height: 33px; width: 561px; background-image: url(images/mapfram_03.gif)"
                                    valign="bottom" align="center">					
                                    <table border="0" width="3%" id="tabScale" style="border-style:double; border-width:3px; border-collapse: collapse" cellpadding="0">
						<tr>
							<td width="17"><a href="javascript:tickSelect(100);" title="将页面缩放至 100%"><img src="fullpage.gif" alt="将页面缩放至 100%" border="0"></a></td>
							<td width="17"><a href="javascript:ZoomUpDown(1);" title="放大"><img src="panplus.gif" alt="放大" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(500);" title="缩放至 500%"><img id="t500" src="tick-off.gif" alt="缩放至 500%"  border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(450);" title="缩放至 450%"><img id="t450" src="tick-off.gif" alt="缩放至 450%"  border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(400);" title="缩放至 400%"><img id="t400" src="tick-off.gif" alt="缩放至 400%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(350);" title="缩放至 350%"><img id="t350" src="tick-off.gif" alt="缩放至 350%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(300);" title="缩放至 300%"><img id="t300" src="tick-off.gif" alt="缩放至 300%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(250);" title="缩放至 250%"><img id="t250" src="tick-off.gif" alt="缩放至 250%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(200);" title="缩放至 200%"><img id="t200" src="tick-off.gif" alt="缩放至 200%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(150);" title="缩放至 150%"><img id="t150" src="tick-off.gif" alt="缩放至 150%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(100);" title="缩放至 100%" id="a100"><img id="t100" src="tick-on.gif" alt="缩放至 100%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(80);" title="缩放至 80%"><img id="t80" src="tick-off.gif" alt="缩放至 80%" border="0"></a></td>
							<td width="11"><a href="javascript:tickSelect(50);" title="缩放至 50%"><img id="t50" src="tick-off.gif" alt="缩放至 50%" border="0"></a></td>
							<td><a href="javascript:ZoomUpDown(-1);" title="缩小"><img src="panminus.gif" alt="缩小" border="0"></a></td>
						</tr>
						</table></td>
                                <td style="background-position: right; background-image: url(images/mapfram_04.gif);
                                    width: 377px; height: 33px;" valign="bottom" align="left" colspan="1" rowspan="1">
                                    <img id="imgrestore" onmouseover="this.src='images/wrestore_over.gif'" title="恢复原始地图窗口大小"
                                        style="display: none" onclick="maxwindow();" onmouseout="this.src='images/wrestore.gif'"
                                        alt="" src="Images\wrestore.gif" />
                                    <img onmousedown="onMDown()" id="imgMax" onmouseover="onMOver();" title="地图窗口最大化"
                                        onclick="maxwindow();" onmouseout="onMOut();" alt="" src="Images\wmax.gif" /></td>
                                <td id="tdrightcorner" style="height: 33px; background-image: url(images/mapfram_05.gif)">
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 2px; height: 44px; background-image: url(images/mapfram_06.gif)">
                                </td>
                                <td colspan="6" style="height: 100%">
                                    <wc:EditTemplate ID="etpTemplate" runat="server" Height="100%" Width="100%">
                                    </wc:EditTemplate>
                                </td>
                                <td style="width: 15px; height: 44px; background-image: url(images/mapfram_08.gif)">
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 2px">
                                    <img height="24" alt="" src="images/mapfram_09.gif" width="15" /></td>
                                <td style="width: 494px; height: 24px; background-image: url(images/mapfram_10.gif)"
                                    colspan="6">
                                </td>
                                <td>
                                    <img style="height: 24px; width: 15px" alt="" src="images/mapfram_11.gif" /></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
