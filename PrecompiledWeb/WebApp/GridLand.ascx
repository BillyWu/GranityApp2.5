<%@ control language="c#" inherits="Estar.WebApp.GridLand, App_Web_yawaynrb" %>
<asp:Panel ID="GridDiv" runat="server" Width="536px" Height="224px" EnableViewState="False">
<asp:Literal ID="ltHTML" runat="server" EnableViewState="False"></asp:Literal></asp:Panel>
<asp:Xml ID="xmlDict" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlSchema" TransformSource="LandSchema.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlland" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlCount" EnableViewState="False" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
<asp:Xml ID="xmlDelete" EnableViewState="False" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
<div style="display: none" id="DivForm" runat="server">
    <input id="hlbChanged" type="hidden" name="hlbChanged" runat="server" enableviewstate="false" />
    <input id="hlbWidth" type="hidden" name="hlbWidth" runat="server" enableviewstate="false" />
    <input type="hidden" id="hlbState" runat="server" enableviewstate="false" />
    <input id="hlb_cmd" type="hidden" name="Hidden1" runat="server" enableviewstate="false" />
</div>
<asp:Literal ID="ltScript" runat="server" EnableViewState="False"></asp:Literal>
