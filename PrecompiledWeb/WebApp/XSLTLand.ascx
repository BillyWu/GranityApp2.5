<%@ control language="c#" inherits="Estar.WebApp.XSLTLand, App_Web_yawaynrb" %>
<asp:Xml ID="xmlland" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<div style="display: none">
    <input type="hidden" id="hlbState" runat="server" enableviewstate="false" />
    <input type="hidden" id="hlb_cmd" runat="server" name="hlb_cmd" enableviewstate="false" />
</div>
<asp:Literal ID="ltScript" runat="server" EnableViewState="False"></asp:Literal>
