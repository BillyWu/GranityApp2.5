<%@ Control Language="C#" AutoEventWireup="true" CodeFile="TreeLand.ascx.cs" Inherits="TreeLand" %>
<%@ Register Assembly="ComponentArt.Web.UI" Namespace="ComponentArt.Web.UI" TagPrefix="ComponentArt" %>
<asp:Xml ID="xmlDict" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<componentart:treeview id="trvLand" runat="server" height="300" width="200" 
    AutoPostBackOnNodeMove="false"
    ClientSideOnNodeSelect="TreeUtil.onNodeSelectionChange"
    DragAndDropEnabled="false" 
    DragAndDropAcrossTreesEnabled="True" 
    LineImagesFolderUrl="images/lines/" 
    CssClass="TreeView" 
    HoverNodeCssClass="HoverTreeNode" 
    NodeCssClass="TreeNode" 
    SelectedNodeCssClass="SelectedTreeNode" CollapseNodeOnSelect="false" ExpandNodeOnSelect="false" 
    CollapseImageUrl="images/exp.gif" 
    ExpandImageUrl="images/col.gif" 
    ExpandSinglePath="false"
    DropSiblingEnabled="False" 
    DropChildEnabled="False" 
    DropRootEnabled="False">
    <ClientEvents>
        <NodeMouseDoubleClick EventHandler="TreeUtil.onNodeDoubleClick" />
        <NodeBeforeMove EventHandler="TreeUtil.onNodeBeforeMove" />
    </ClientEvents>
</componentart:treeview>
<asp:Xml ID="xmlSchema" TransformSource="LandSchema.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlland" TransformSource="TrvIsland.xslt" runat="server" EnableViewState="False"></asp:Xml>
<asp:Xml ID="xmlCount" EnableViewState="False" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
<asp:Xml ID="xmlDelete" EnableViewState="False" runat="server" TransformSource="TrvIsland.xslt"></asp:Xml>
<div style="display: none">
    <input id="hlbChanged" type="hidden" name="hlbChanged" runat="server" />
    <input id="hlbWidth"   type="hidden" name="hlbWidth" runat="server" />
    <input type="hidden" id="hlbState" runat="server" />
    <input id="hlb_cmd" type="hidden" name="Hidden1" runat="server" />
</div>
<asp:Panel ID="GridDiv" runat="server" Width="536px" Height="224px" Visible="false">
    <asp:Literal ID="ltHTML" runat="server"></asp:Literal>
</asp:Panel>
<asp:Literal ID="ltScript" runat="server"></asp:Literal>
