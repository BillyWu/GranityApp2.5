<%@ Control Language="C#" AutoEventWireup="true" CodeFile="XMLLand.ascx.cs" Inherits="XMLLand" %>
<asp:Xml ID="xmlland" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlCount" runat="server" EnableViewState="False" TransformSource="TrvIsland.xslt"></asp:Xml>
<div style="display: none">
    <input id="hlbChanged" type="hidden" name="hlbChanged" runat="server" />
    <input id="hlbWidth"  type="hidden" name="hlbWidth" runat="server" />
    <input type="hidden" id="hlbState" runat="server" />
    <input id="hlb_cmd" type="hidden" runat="server" />
</div>
<asp:Literal ID="ltScript" runat="server"></asp:Literal>
