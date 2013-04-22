<%@ Control Language="C#" AutoEventWireup="true" CodeFile="HTMLTp.ascx.cs" Inherits="HTMLTp" %>
<asp:Literal ID="ltHTML" runat="server"></asp:Literal>
<div style="display: none">
    <input id="hlbChanged" type="hidden" name="hlbChanged" runat="server" /><input id="hlbWidth"
        type="hidden" name="hlbWidth" runat="server" />
    <input type="hidden" id="hlbState" runat="server" />
    <asp:Button ID="btCommand" Height="0" runat="server" Text="Command"></asp:Button><input
        id="hlb_cmd" type="hidden" runat="server" />
</div>
<asp:Literal ID="ltScript" runat="server"></asp:Literal>
