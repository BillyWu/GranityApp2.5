<%@ Page Language="C#" AutoEventWireup="true" validateRequest="false"  CodeFile="wfSimpAppend.aspx.cs" Inherits="Estar.WebApp.wfSimpAppend" %>

<%@ Register Assembly="Estar.Common.WebControls" Namespace="Estar.Common.WebControls" TagPrefix="wc" %>
<%@ Register Src="XmlConfLand.ascx" TagName="XmlConfLand" TagPrefix="uc1" %>
<%@ Register Src="XmlLandUp.ascx" TagName="XmlLandUp" TagPrefix="uc2" %>
<%@ Register Src="TreeLand.ascx" TagName="TreeLand" TagPrefix="uc3" %>
<%@ Register Src="GridLand.ascx" TagName="GridLand" TagPrefix="uc4" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" >
<head runat="server">
    <title></title>
    <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
    <meta content="C#" name="CODE_LANGUAGE" />
    <meta content="JavaScript" name="vs_defaultClientScript" />
    <meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <base target="_self" />
    <script language="javascript" src="hmjs/sysjs/Calendar30.js" type="text/javascript" charset="gb2312"></script>
    <link href="hmjs/sysjs/calendar.css" type="text/css" charset="gb2312" rel="stylesheet" />
    <link href="hmjs/sysjs/inputctrlAspx.css" type="text/css" charset="gb2312" rel="stylesheet" />    
    <link href="hmjs/sysjs/css.css" type="text/css" rel="stylesheet" />
    <style type="text/css">
    v\:*         { behavior: url(#default#VML) }
    o\:*         { behavior: url(#default#VML) }
    .shape       { behavior: url(#default#VML) }
    </style>
</head>
<body style="overflow:hidden; margin: 0px; position: relative;top: 0px;" scroll="no" >
    <script language="javascript" src="hmjs/sysjs/GridUtilXSLT.js" type="text/javascript" charset="gb2312"></script>
    <script language="javascript" src="hmjs/sysjs/usXmlLandCal.js" type="text/javascript" charset="gb2312"></script>
    <script language="javascript" src="hmjs/sysjs/usValidation.js" type="text/javascript" charset="gb2312"></script>    
    <form id="form1" runat="server">
        <asp:Xml ID="xmlParam" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
        <uc1:XmlConfLand ID="xmlConf" runat="server" />
        <div style="display:none">
                <input id="hlb_cmd" style="width: 155px; height: 1px" type="hidden" name="hlb_cmd" runat="server" />
                <asp:ListBox ID="lstb" runat="server" AutoPostBack="True" EnableViewState="False" Rows="1"></asp:ListBox>
                <asp:Button ID="bt_PostBack" runat="server" Height="1px" Text="PostBack" OnClick="bt_PostBack_Click"></asp:Button>
                <input id="hlbRequestParams" type="hidden" name="hlbRequestParams" runat="server" />
        </div>
            <wc:edittemplate id="etpTemplate" runat="server"   
                Height="100%" BorderWidth="0px" Width="100%"></wc:edittemplate>
    </form>
</body>
</html>
