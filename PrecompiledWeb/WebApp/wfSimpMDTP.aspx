<%@ page language="C#" autoeventwireup="true" inherits="Estar.WebApp.wfSimpMDTP, App_Web_65fgkkog" validaterequest="false" %>

<%@ Register Assembly="Estar.Common.WebControls" Namespace="Estar.Common.WebControls"  TagPrefix="wc" %>
<%@ Register Src="XmlConfLand.ascx" TagName="XmlConfLand" TagPrefix="uc1" %>
<%@ Register Src="GridLand.ascx" TagName="GridLand" TagPrefix="uc3" %>
<%@ Register Src="TreeLand.ascx" TagName="TreeLand" TagPrefix="uc4" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head runat="server">
    <title>无标题页</title>
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
    <base target="_self" />
    <script language="javascript" src="hmjs/sysjs/Calendar30.js" type="text/javascript" charset="gb2312"></script>
    <link href="hmjs/sysjs/calendar.css" type="text/css" charset="gb2312" rel="stylesheet" />
    <link href="hmjs/sysjs/inputctrlAspx.css" type="text/css" charset="gb2312" rel="stylesheet" />
    <link href="hmjs/sysjs/css.css" type="text/css" rel="stylesheet" />     <STYLE>
        v\:*         { behavior: url(#default#VML) }
        o\:*         { behavior: url(#default#VML) }
        .shape       { behavior: url(#default#VML) }
    </STYLE>
</head>
<body style="overflow:hidden; margin: 0px;" scroll="no">
    <script language="javascript" src="hmjs/sysjs/GridUtilXSLT.js" type="text/javascript" charset="gb2312"></script>
    <script language="javascript" src="hmjs/sysjs/usXmlLandCal.js" type="text/javascript" charset="gb2312"></script>
    <script language="javascript" src="hmjs/sysjs/usValidation.js" type="text/javascript" charset="gb2312"></script>    
    <script language="javascript" src="hmjs/sysjs/usAjax.js" type="text/javascript" charset="gb2312"></script>    
    <iframe id="iframeWeb" width="0" height="0"></iframe>
        <asp:Xml ID="xmlParam" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
        <uc1:XmlConfLand ID="xmlConf" runat="server" />
    <form id="form1" runat="server" style="height:100%;width:100%">
        <div style="display:none" >
            <input id="hlb_cmd" type="hidden" name="hlb_cmd" runat="server" />
            <asp:Button ID="bt_PostBack" runat="server" Height="1px" Text="PostBack" OnClick="bt_PostBack_Click"/>
            <asp:ListBox ID="lstb" runat="server" AutoPostBack="True" EnableViewState="False" Rows="1"></asp:ListBox>
            <input id="hlbRequestParams" type="hidden" name="hlbRequestParams" runat="server" />
        </div>
        <wc:EditTemplate ID="etpTemplate" runat="server" BorderStyle="Solid" Height="100%" BorderColor="Gray" BorderWidth="1px" Width="100%"></wc:EditTemplate>
    </form>
</body>
</html>
