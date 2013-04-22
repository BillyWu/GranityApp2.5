<XML id="xmlparam" typexml="Param">
  <D>
    <PL t="P">
      <L t="Ts">
        <P n="RecordCount" v="" t="s" pt="M"/>
        <P n="Command" v="TransParam" t="s"/>
        <P n="UnitName" v="网店客服中心" t="s"/>
      </L>
    </PL>
  </D>
</XML>
<XML name="网店客服中心" templatetype="HTML" id="xmlConf_xmlLandConf" typexml="ConfProperty" confpro="" tpath="netcustmgr.htm" DataSrcFile="服装" DictColSrcFile="服装">
  <UnitItem>
    <Item name="master" relation="M" linkcol="单据编号" dataitem="fgsale" columnkey="ID" manualrefresh="True"></Item>
    <Item name="detail" relation="D" linkcol="单据编号" dataitem="fgsaledetailnet" columnkey="ID" manualrefresh="True"></Item>
    <Item name="slgoods" relation="G" dataitem="selectAllowstore" manualrefresh="True"></Item>
    <Item name="gonodes" relation="G" dataitem="gonodes" manualrefresh="True"></Item>
    <Item name="jbr" relation="G" dataitem="选择经办人" manualrefresh="True"></Item>
    <Item name="bknodes" relation="G" dataitem="bknodes" manualrefresh="True"></Item>
    <Item name="opinion" relation="D" linkcol="单据编号" dataitem="flowopinion" columnkey="ID" manualrefresh="True" />
    <Item name="monitor" relation="G" dataitem="wfmonitor" manualrefresh="True" />
    <Item name="edit" relation="G" linkcol="旺旺" dataitem="netcustomer" columnkey="ID" countdataitem="netcustomercount" manualrefresh="True"></Item>
    <Item name="record" relation="D" dataitem="csrecord" masteritem="edit" manualrefresh="True"></Item>
    <Item name="inflow" relation="G" dataitem="inflow" manualrefresh="True" />
    <Item name="contacts" relation="D" linkcol="旺旺" dataitem="contacts" columnkey="ID" masteritem="edit"></Item>
    <Item name="returngoods" relation="D" dataitem="returngoods" masteritem="edit"></Item>
    <Item name="recordbacking" relation="D" dataitem="recordbacking" masteritem="edit"></Item>
    <Item name="recordback" relation="D" dataitem="recordback" masteritem="edit"></Item>
    <Item name="todo" relation="D" dataitem="todorecord" masteritem="edit"></Item>
    <Item name="销售机会" relation="D" linkcol="客户" dataitem="saleOpports" columnkey="ID" masteritem="edit" manualrefresh="True"></Item>
    <Item name="slallgoods" relation="G" dataitem="slallgoods" manualrefresh="True"></Item>
  </UnitItem>
</XML>
<XML id="fgsaleTab_Sum" typexml="Count" itemname="master">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="fgsaleTab_Delete" typexml="Delete" itemname="master">
  <etpTemplate_fgsaleTab_xmlland></etpTemplate_fgsaleTab_xmlland>
</XML>
<XML id="fgsaleTab_dict" typexml="Dict" itemname="master"></XML>
<XML id="fgsaleTab" typexml="Data" itemname="master"></XML>
<XML id="fgsaleTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_fgsaleTab_hlbChanged" ctrlschema="etpTemplate_fgsaleTab_hlbWidth" ctrlstate="etpTemplate_fgsaleTab_hlbState" ctrlhlbcmd="etpTemplate_fgsaleTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="master" relation="M" linkcol="单据编号" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  bhrule="ND-[YYYY][MM]-[0000]" zeroflag="年"  />
    <xs:element name="单据日期" type="xs:dateTime"  format="yyyy-MM-dd" expression="#当前日期" formatfld="单据日期_格式"  />
    <xs:element name="部门名称" type="xs:string"  expression="#部门名称" isreadonly="1"  />
    <xs:element name="部门代码" type="xs:string"  expression="#部门代码"  />
    <xs:element name="客户名称" type="xs:string"   />
    <xs:element name="客户代码" type="xs:string"   />
    <xs:element name="客户类别" type="xs:string"  dataitem="exec FD_贵宾卡类别" textcol="name" valuecol="name"  />
    <xs:element name="折扣" type="xs:double"   />
    <xs:element name="联系人" type="xs:string"   />
    <xs:element name="联系电话" type="xs:string"   />
    <xs:element name="省" type="xs:string"   />
    <xs:element name="市" type="xs:string"   />
    <xs:element name="区县" type="xs:string"   />
    <xs:element name="快递地址" type="xs:string"  chkcol="1" dataitem="exec FD_快递信息 @客户代码" textcol="title" valuecol="name" isreadonly="1" formatfld="快递地址_显示"  />
    <xs:element name="客户区号" type="xs:string"   />
    <xs:element name="客户邮编" type="xs:string"   />
    <xs:element name="快递公司" type="xs:string"  dataitem="exec FD_快递公司" textcol="name" valuecol="name"  />
    <xs:element name="快递方式" type="xs:string"   />
    <xs:element name="快递条码" type="xs:string"   />
    <xs:element name="付款方式" type="xs:string"   />
    <xs:element name="重量" type="xs:double"   />
    <xs:element name="运费" type="xs:double"   />
    <xs:element name="经办人" type="xs:string"  expression="#姓名" dataitem="exec SD_营业员" textcol="name" valuecol="name" isreadonly="1"  />
    <xs:element name="总合计" type="xs:double"  validity="总合计>0" alertexpr="购买数量不能小于0!" chkcol="1" expression="detail{数量}" calcol="1" isreadonly="1"  />
    <xs:element name="总金额" type="xs:double"  expression="detail{理论售价}" calcol="1" isreadonly="1"  />
    <xs:element name="总折扣金额" type="xs:double"  expression="detail{实际售价}" calcol="1"  />
    <xs:element name="总余量" type="xs:int"  expression="detail{余量}" calcol="1"  />
    <xs:element name="总余额" type="xs:double"  expression="detail{退后理论售价}" calcol="1"  />
    <xs:element name="总折扣余额" type="xs:double"  expression="detail{退后实际售价}" calcol="1"  />
    <xs:element name="退后优惠金额" type="xs:double"  calcol="1"  />
    <xs:element name="优惠金额" type="xs:double"  isreadonly="1"  />
    <xs:element name="应付现金" type="xs:double"   />
    <xs:element name="处理状态" type="xs:string"  expression="if(&quot;已调整&quot;==处理状态 || &quot;已保存&quot;==处理状态) 处理状态;else &quot;未调整&quot;" calcol="1"  />
    <xs:element name="订货季节" type="xs:string"   />
    <xs:element name="预计上货时间" type="xs:dateTime"   />
    <xs:element name="公司名称" type="xs:string"  visible="1"  />
    <xs:element name="目的节点" type="xs:string"   />
    <xs:element name="接收部门" type="xs:string"   />
    <xs:element name="采购类型" type="xs:string"   />
    <xs:element name="直营店" type="xs:boolean"   />
    <xs:element name="保存" type="xs:boolean"   />
    <xs:element name="天气情况" type="xs:string"   />
    <xs:element name="公司地址" type="xs:string"   />
    <xs:element name="电话" type="xs:string"   />
    <xs:element name="网址" type="xs:string"   />
    <xs:element name="区号" type="xs:string"   />
    <xs:element name="退货金额" type="xs:string"   />
    <xs:element name="指定快递" type="xs:boolean"   />
    <xs:element name="主编号" type="xs:string"   />
    <xs:element name="原单号" type="xs:string"   />
    <xs:element name="换退单号" type="xs:string"   />
    <xs:element name="备注" type="xs:string"   />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="fgsaledetailnetTab_Sum" typexml="Count" itemname="detail">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="fgsaledetailnetTab_Delete" typexml="Delete" itemname="detail">
  <etpTemplate_fgsaledetailnetTab_xmlland></etpTemplate_fgsaledetailnetTab_xmlland>
</XML>
<XML id="fgsaledetailnetTab_dict" typexml="Dict" itemname="detail"></XML>
<XML id="fgsaledetailnetTab" typexml="Data" itemname="detail"></XML>
<XML id="fgsaledetailnetTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_fgsaledetailnetTab_hlbChanged" ctrlschema="etpTemplate_fgsaledetailnetTab_hlbWidth" ctrlstate="etpTemplate_fgsaledetailnetTab_hlbState" ctrlhlbcmd="etpTemplate_fgsaledetailnetTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="detail" relation="D" linkcol="单据编号" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"   />
    <xs:element name="条码" type="xs:string"  visible="1" width="50"  />
    <xs:element name="款号颜色条码" type="xs:string"  visible="1"  />
    <xs:element name="品名" type="xs:string"  visible="1" width="100"  />
    <xs:element name="款号" type="xs:string"  chkcol="1" isreadonly="1" width="70"  />
    <xs:element name="颜色名称" type="xs:string"  chkcol="1" dataitem="exec dbo.FD_颜色" textcol="name" valuecol="name" title="颜色" width="70"  />
    <xs:element name="尺码" type="xs:string"  visible="1" width="40"  />
    <xs:element name="尺码T" type="xs:string"  chkcol="1" datastyle="strcenter" dataitem="exec FD_有效尺码颜色 @库位,@款号,@颜色名称" textcol="title" valuecol="name" title="尺码" width="40" formatfld="尺码T_显示"  />
    <xs:element name="数量" type="xs:int"  chkcol="1" expression="1" datastyle="strcenter" footer="sum" width="40"  />
    <xs:element name="余量" type="xs:int"  visible="1" title="数量" footer="sum" width="40"  />
    <xs:element name="条码数量" type="xs:int"  visible="1" width="40"  />
    <xs:element name="网上价格" type="xs:double"  format="#,#,###.00" title="单价" isreadonly="1" width="60" formatfld="网上价格_格式"  />
    <xs:element name="折扣单价" type="xs:double"  expression="实际售价/数量" title="折扣价" width="60"  />
    <xs:element name="退后折扣单价" type="xs:double"  visible="1" title="折扣价" width="40"  />
    <xs:element name="理论售价" type="xs:double"  expression="网上价格*数量" visible="1" calcol="1" isreadonly="1" footer="sum" width="40"  />
    <xs:element name="退后理论售价" type="xs:double"  visible="1" footer="sum" width="40"  />
    <xs:element name="实际售价" type="xs:double"  title="小计" isreadonly="1" footer="sum" width="60"  />
    <xs:element name="退后实际售价" type="xs:double"  visible="1" title="小计" footer="sum" width="40"  />
    <xs:element name="库位" type="xs:string"  isreadonly="1" width="70"  />
    <xs:element name="内部" type="xs:string"  visible="1" width="40"  />
    <xs:element name="部门代码" type="xs:string"  visible="1" width="40"  />
    <xs:element name="备注" type="xs:string"  visible="1" width="50"  />
    <xs:element name="采购类型" type="xs:string"  visible="1" title="销售策略" width="50"  />
    <xs:element name="代理代码" type="xs:string"  visible="1" width="40"  />
    <xs:element name="调配代码" type="xs:string"  visible="1" width="40"  />
    <xs:element name="属性" type="xs:string"  visible="1" width="40"  />
    <xs:element name="拣货" type="xs:boolean"  visible="1" width="40"  />
    <xs:element name="尺码组" type="xs:string"  visible="1" width="40"  />
    <xs:element name="品牌" type="xs:string"  visible="1" width="40"  />
    <xs:element name="退货数量" type="xs:int"  validity="(余量-退货数量)>-1" alertexpr="该款无货可退!" width="50"  />
    <xs:element name="退货金额" type="xs:double"  visible="1" footer="sum" width="40"  />
    <xs:element name="退货单价" type="xs:double"  visible="1" width="60"  />
    <xs:element name="已退数量" type="xs:int"  visible="1" width="40"  />
    <xs:element name="已退金额" type="xs:double"  visible="1" width="40"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="selectAllowstoreTab_Sum" typexml="Count" itemname="slgoods">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="selectAllowstoreTab_Delete" typexml="Delete" itemname="slgoods">
  <etpTemplate_selectAllowstoreTab_xmlland></etpTemplate_selectAllowstoreTab_xmlland>
</XML>
<XML id="selectAllowstoreTab_dict" typexml="Dict" itemname="slgoods"></XML>
<XML id="selectAllowstoreTab" typexml="Data" itemname="slgoods"></XML>
<XML id="selectAllowstoreTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_selectAllowstoreTab_hlbChanged" ctrlschema="etpTemplate_selectAllowstoreTab_hlbWidth" ctrlstate="etpTemplate_selectAllowstoreTab_hlbState" ctrlhlbcmd="etpTemplate_selectAllowstoreTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="slgoods" relation="G" pagesize="100" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="单位代码" type="xs:string"  visible="1" width="60"  />
    <xs:element name="库位" type="xs:string"  isreadonly="1" width="65"  />
    <xs:element name="款号" type="xs:string"  isreadonly="1" width="70"  />
    <xs:element name="颜色名称" type="xs:string"  title="颜色" isreadonly="1" width="60"  />
    <xs:element name="颜色编码" type="xs:int"  visible="1" isreadonly="1"  />
    <xs:element name="尺码组" type="xs:string"  visible="1" width="60"  />
    <xs:element name="商品编号" type="xs:string"  visible="1"  />
    <xs:element name="网上价格" type="xs:double"  title="吊牌价" isreadonly="1" width="45"  />
    <xs:element name="采购价格" type="xs:double"  visible="1" width="60"  />
    <xs:element name="XS" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="S" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="M" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="L" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXXXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="部门代码" type="xs:int"  visible="1" width="60"  />
    <xs:element name="代理代码" type="xs:int"  visible="1" width="60"  />
    <xs:element name="调配代码" type="xs:int"  visible="1" isreadonly="1" width="60"  />
    <xs:element name="属性" type="xs:string"  visible="1" width="60"  />
    <xs:element name="拣货" type="xs:boolean"  visible="1" width="60"  />
    <xs:element name="款号颜色条码" type="xs:string"  visible="1"  />
    <xs:element name="尺码标题" type="xs:string"  visible="1" width="60"  />
    <xs:element name="尺码标准" type="xs:string"  visible="1" width="60"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="gonodesTab_Sum" typexml="Count" itemname="gonodes">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="gonodesTab_Delete" typexml="Delete" itemname="gonodes">
  <etpTemplate_gonodesTab_xmlland></etpTemplate_gonodesTab_xmlland>
</XML>
<XML id="gonodesTab_dict" typexml="Dict" itemname="gonodes"></XML>
<XML id="gonodesTab" typexml="Data" itemname="gonodes"></XML>
<XML id="gonodesTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_gonodesTab_hlbChanged" ctrlschema="etpTemplate_gonodesTab_hlbWidth" ctrlstate="etpTemplate_gonodesTab_hlbState" ctrlhlbcmd="etpTemplate_gonodesTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="gonodes" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="名称" type="xs:string"  datastyle="blink" title="请选择将要进行的操作" href="#" target="_self" onclick="ue_submit()"  />
    <xs:element name="编码" type="xs:string"  visible="1"  />
    <xs:element name="下一节点" type="xs:string"  visible="1"  />
    <xs:element name="不分发" type="xs:boolean"  visible="1"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="选择经办人Tab_Sum" typexml="Count" itemname="jbr">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="选择经办人Tab_Delete" typexml="Delete" itemname="jbr">
  <etpTemplate_选择经办人Tab_xmlland></etpTemplate_选择经办人Tab_xmlland>
</XML>
<XML id="选择经办人Tab_dict" typexml="Dict" itemname="jbr"></XML>
<XML id="选择经办人Tab" typexml="Data" itemname="jbr"></XML>
<XML id="选择经办人Tab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_选择经办人Tab_hlbChanged" ctrlschema="etpTemplate_选择经办人Tab_hlbWidth" ctrlstate="etpTemplate_选择经办人Tab_hlbState" ctrlhlbcmd="etpTemplate_选择经办人Tab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="jbr" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="单位" type="xs:string"   />
    <xs:element name="审批事项" type="xs:string"  visible="1"  />
    <xs:element name="单据编号" type="xs:string"  visible="1"  />
    <xs:element name="姓名" type="xs:string"  title="经办人" isreadonly="1"  />
    <xs:element name="帐号" type="xs:string"  visible="1" width="70"  />
    <xs:element name="主责任人" type="xs:boolean"  datastyle="boolradio" width="70"  />
    <xs:element name="次责任人" type="xs:boolean"  datastyle="boolradio" width="70"  />
    <xs:element name="节点" type="xs:string"  visible="1" isreadonly="1" width="70"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="bknodesTab_Sum" typexml="Count" itemname="bknodes">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="bknodesTab_Delete" typexml="Delete" itemname="bknodes">
  <etpTemplate_bknodesTab_xmlland></etpTemplate_bknodesTab_xmlland>
</XML>
<XML id="bknodesTab_dict" typexml="Dict" itemname="bknodes"></XML>
<XML id="bknodesTab" typexml="Data" itemname="bknodes"></XML>
<XML id="bknodesTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_bknodesTab_hlbChanged" ctrlschema="etpTemplate_bknodesTab_hlbWidth" ctrlstate="etpTemplate_bknodesTab_hlbState" ctrlhlbcmd="etpTemplate_bknodesTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="bknodes" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="名称" type="xs:string"  datastyle="blink" title="请选择退回的节点" href="#" target="_self" onclick="ue_return();"  />
    <xs:element name="编码" type="xs:string"  visible="1"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="flowopinionTab_Sum" typexml="Count" itemname="opinion">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="flowopinionTab_Delete" typexml="Delete" itemname="opinion">
  <etpTemplate_flowopinionTab_xmlland></etpTemplate_flowopinionTab_xmlland>
</XML>
<XML id="flowopinionTab_dict" typexml="Dict" itemname="opinion"></XML>
<XML id="flowopinionTab" typexml="Data" itemname="opinion"></XML>
<XML id="flowopinionTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_flowopinionTab_hlbChanged" ctrlschema="etpTemplate_flowopinionTab_hlbWidth" ctrlstate="etpTemplate_flowopinionTab_hlbState" ctrlhlbcmd="etpTemplate_flowopinionTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="opinion" relation="D" linkcol="单据编号" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"   />
    <xs:element name="审批事项" type="xs:string"   />
    <xs:element name="节点" type="xs:string"   />
    <xs:element name="节点编码" type="xs:string"   />
    <xs:element name="节点标题" type="xs:string"   />
    <xs:element name="结论" type="xs:string"   />
    <xs:element name="意见" type="xs:string"   />
    <xs:element name="经办人" type="xs:string"   />
    <xs:element name="时间" type="xs:dateTime"   />
    <xs:element name="备注" type="xs:string"   />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="wfmonitorTab_Sum" typexml="Count" itemname="monitor">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="wfmonitorTab_Delete" typexml="Delete" itemname="monitor">
  <etpTemplate_wfmonitorTab_xmlland></etpTemplate_wfmonitorTab_xmlland>
</XML>
<XML id="wfmonitorTab_dict" typexml="Dict" itemname="monitor"></XML>
<XML id="wfmonitorTab" typexml="Data" itemname="monitor"></XML>
<XML id="wfmonitorTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_wfmonitorTab_hlbChanged" ctrlschema="etpTemplate_wfmonitorTab_hlbWidth" ctrlstate="etpTemplate_wfmonitorTab_hlbState" ctrlhlbcmd="etpTemplate_wfmonitorTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="monitor" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="流程" type="xs:string"   />
    <xs:element name="实例编号" type="xs:string"   />
    <xs:element name="标题" type="xs:string"   />
    <xs:element name="节点" type="xs:string"   />
    <xs:element name="接收状态" type="xs:string"   />
    <xs:element name="接收时间" type="xs:string"   />
    <xs:element name="处理意见" type="xs:string"   />
    <xs:element name="结果状态" type="xs:string"   />
    <xs:element name="结果时间" type="xs:string"   />
    <xs:element name="责任人" type="xs:string"   />
    <xs:element name="姓名" type="xs:string"   />
    <xs:element name="工号" type="xs:string"   />
    <xs:element name="签字日期" type="xs:dateTime"   />
    <xs:element name="备注" type="xs:string"   />
    <xs:element name="归档时间" type="xs:dateTime"   />
    <xs:element name="结案时间" type="xs:dateTime"   />
    <xs:element name="收件日期" type="xs:dateTime"   />
    <xs:element name="承诺办结日期" type="xs:dateTime"   />
    <xs:element name="节点编码" type="xs:string"   />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="netcustomerTab_Sum" typexml="Count" itemname="edit">
  <汇总>
    <netcustomercount>
      <记录数量>0</记录数量>
      <TotalPage>0</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>200</PageSize>
      <RecordCount>0</RecordCount>
    </netcustomercount>
  </汇总>
</XML>
<XML id="netcustomerTab_Delete" typexml="Delete" itemname="edit">
  <etpTemplate_netcustomerTab_xmlland></etpTemplate_netcustomerTab_xmlland>
</XML>
<XML id="netcustomerTab_dict" typexml="Dict" itemname="edit"></XML>
<XML id="netcustomerTab" typexml="Data" itemname="edit"></XML>
<XML id="netcustomerTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_netcustomerTab_hlbChanged" ctrlschema="etpTemplate_netcustomerTab_hlbWidth" ctrlstate="etpTemplate_netcustomerTab_hlbState" ctrlhlbcmd="etpTemplate_netcustomerTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="edit" relation="G" linkcol="旺旺" columnkey="ID" pagesize="200" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="旺旺" type="xs:string"  chkcol="1" evisible="1" title="旺旺ID" width="80"  />
    <xs:element name="帐号" type="xs:string"  visible="1" evisible="1" title="用户名" width="100"  />
    <xs:element name="姓名" type="xs:string"  visible="1" evisible="1" width="80"  />
    <xs:element name="注册邮箱" type="xs:string"  visible="1" width="150"  />
    <xs:element name="联系电话" type="xs:string"  width="120"  />
    <xs:element name="卡号" type="xs:string"  visible="1" evisible="1" title="VIP卡号" isreadonly="1"  />
    <xs:element name="类别" type="xs:string"  evisible="1" title="VIP类别" isreadonly="1" width="80"  />
    <xs:element name="密码" type="xs:string"  format="*" visible="1" evisible="1" width="100" formatfld="密码_格式"  />
    <xs:element name="出生日期" type="xs:dateTime"  format="yyyy-MM-dd" visible="1" width="100" formatfld="出生日期_格式"  />
    <xs:element name="手机" type="xs:string"  visible="1" width="150"  />
    <xs:element name="登记日期" type="xs:dateTime"  visible="1" evisible="1"  />
    <xs:element name="省" type="xs:string"  visible="1" dataitem="exec FD_省市 null,@省" textcol="name" valuecol="name" width="60"  />
    <xs:element name="QQ" type="xs:string"  visible="1" width="80"  />
    <xs:element name="市" type="xs:string"  dataitem="exec FD_省市市 @省,@市" textcol="name" valuecol="name" width="70"  />
    <xs:element name="城市代码" type="xs:int"  visible="1" evisible="1" width="150"  />
    <xs:element name="邮政编码" type="xs:string"  visible="1" width="150"  />
    <xs:element name="区县" type="xs:string"  visible="1" dataitem="exec FD_省市 @市,@区县" textcol="name" valuecol="name" title="县/区" width="60"  />
    <xs:element name="区号" type="xs:string"  visible="1" width="150"  />
    <xs:element name="地址" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="快递地址" type="xs:string"  width="150"  />
    <xs:element name="MSN" type="xs:string"  visible="1" evisible="1" width="100"  />
    <xs:element name="客服" type="xs:string"  visible="1" title="注册人" width="150"  />
    <xs:element name="开户行" type="xs:string"  visible="1" width="150"  />
    <xs:element name="开户名称" type="xs:string"  visible="1" width="150"  />
    <xs:element name="账号" type="xs:string"  visible="1" width="150"  />
    <xs:element name="银行地址" type="xs:string"  visible="1" width="150"  />
    <xs:element name="税号" type="xs:string"  visible="1" width="150"  />
    <xs:element name="税种" type="xs:string"  visible="1" width="150"  />
    <xs:element name="税率" type="xs:decimal"  visible="1" width="150"  />
    <xs:element name="身高" type="xs:string"  visible="1" width="100"  />
    <xs:element name="体重" type="xs:string"  visible="1" width="100"  />
    <xs:element name="胸围" type="xs:string"  visible="1" width="150"  />
    <xs:element name="肩宽" type="xs:string"  visible="1" width="150"  />
    <xs:element name="尺码" type="xs:string"  visible="1" dataitem="exec FD_尺码 null" textcol="name" valuecol="name" width="100"  />
    <xs:element name="款式" type="xs:string"  visible="1" onclick="selectbyBarCode(2)" width="100"  />
    <xs:element name="职业" type="xs:string"  visible="1" dataitem="exec FC_职业" textcol="name" valuecol="name" width="100"  />
    <xs:element name="性格描述" type="xs:string"  visible="1" dataitem="exec FC_特征" textcol="name" valuecol="name" title="特征描述" width="150"  />
    <xs:element name="印象" type="xs:string"  visible="1" dataitem="exec FC_印象" textcol="name" valuecol="name" width="150"  />
    <xs:element name="风格" type="xs:string"  visible="1" dataitem="exec FC_风格" textcol="name" valuecol="name" width="150"  />
    <xs:element name="属性" type="xs:string"  visible="1" dataitem="exec FC_属性" textcol="name" valuecol="name" width="150"  />
    <xs:element name="生日礼卷赠送" type="xs:boolean"  visible="1" title="生日礼卷" width="150"  />
    <xs:element name="消费金额" type="xs:decimal"  visible="1"  />
    <xs:element name="积分" type="xs:int"  visible="1" width="100"  />
    <xs:element name="机构代码" type="xs:string"  visible="1" evisible="1" width="150"  />
    <xs:element name="备注" type="xs:string"  datastyle="textarea" visible="1" width="470" height="100"  />
    <xs:element name="折扣" type="xs:double"  visible="1" evisible="1" width="150"  />
    <xs:element name="退货期限" type="xs:int"  visible="1" evisible="1" width="150"  />
    <xs:element name="免运费" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="免运费条件" type="xs:double"  visible="1" evisible="1" width="150"  />
    <xs:element name="抽奖" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="热点" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="热点备注" type="xs:string"  visible="1" evisible="1" width="150"  />
    <xs:element name="视图" type="xs:string"  expression="&quot;详细&quot;" datastyle="blink" evisible="1" onclick="editvip()" width="50"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="csrecordTab_Sum" typexml="Count" itemname="record">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="csrecordTab_Delete" typexml="Delete" itemname="record">
  <etpTemplate_csrecordTab_xmlland></etpTemplate_csrecordTab_xmlland>
</XML>
<XML id="csrecordTab_dict" typexml="Dict" itemname="record"></XML>
<XML id="csrecordTab" typexml="Data" itemname="record"></XML>
<XML id="csrecordTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_csrecordTab_hlbChanged" ctrlschema="etpTemplate_csrecordTab_hlbWidth" ctrlstate="etpTemplate_csrecordTab_hlbState" ctrlhlbcmd="etpTemplate_csrecordTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="record" relation="D" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  visible="1" width="100"  />
    <xs:element name="客户代码" type="xs:string"  visible="1"  />
    <xs:element name="快递地址" type="xs:string"  visible="1"  />
    <xs:element name="联系人" type="xs:string"  visible="1" width="70"  />
    <xs:element name="联系电话" type="xs:string"  visible="1" width="70"  />
    <xs:element name="快递条码" type="xs:string"  visible="1"  />
    <xs:element name="编号" type="xs:string"  datastyle="strcenter" width="110"  />
    <xs:element name="客户" type="xs:string"   />
    <xs:element name="购买日期" type="xs:string"  format="yyyy-MM-dd" datastyle="strcenter" width="80" formatfld="购买日期_格式"  />
    <xs:element name="款号" type="xs:string"  datastyle="strcenter" width="80"  />
    <xs:element name="颜色" type="xs:string"  datastyle="strcenter" width="60"  />
    <xs:element name="尺码T" type="xs:string"  datastyle="strcenter" title="尺码" width="40"  />
    <xs:element name="数量" type="xs:double"  width="40"  />
    <xs:element name="金额" type="xs:double"  format="#,#,###.00" width="90" formatfld="金额_格式"  />
    <xs:element name="库位" type="xs:string"  visible="1" width="55"  />
    <xs:element name="sn" type="xs:int"  visible="1" width="55"  />
    <xs:element name="节点" type="xs:string"  visible="1" width="70"  />
    <xs:element name="状态" type="xs:string"  datastyle="strcenter" width="70"  />
    <xs:element name="承办日期" type="xs:string"  visible="1" width="55"  />
    <xs:element name="经办人" type="xs:string"  visible="1"  />
    <xs:element name="编辑" type="xs:string"  visible="1" width="55"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="inflowTab_Sum" typexml="Count" itemname="inflow">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="inflowTab_Delete" typexml="Delete" itemname="inflow">
  <etpTemplate_inflowTab_xmlland></etpTemplate_inflowTab_xmlland>
</XML>
<XML id="inflowTab_dict" typexml="Dict" itemname="inflow"></XML>
<XML id="inflowTab" typexml="Data" itemname="inflow"></XML>
<XML id="inflowTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_inflowTab_hlbChanged" ctrlschema="etpTemplate_inflowTab_hlbWidth" ctrlstate="etpTemplate_inflowTab_hlbState" ctrlhlbcmd="etpTemplate_inflowTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="inflow" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="流程" type="xs:string"   />
    <xs:element name="实例编号" type="xs:string"   />
    <xs:element name="标题" type="xs:string"   />
    <xs:element name="节点" type="xs:string"   />
    <xs:element name="接收状态" type="xs:string"   />
    <xs:element name="接收时间" type="xs:string"   />
    <xs:element name="处理情况" type="xs:string"   />
    <xs:element name="作业时间" type="xs:dateTime"   />
    <xs:element name="结果时间" type="xs:string"   />
    <xs:element name="结果状态" type="xs:string"   />
    <xs:element name="责任人" type="xs:string"   />
    <xs:element name="角色" type="xs:string"   />
    <xs:element name="签字日期" type="xs:dateTime"   />
    <xs:element name="收件日期" type="xs:dateTime"   />
    <xs:element name="承诺办结日期" type="xs:dateTime"   />
    <xs:element name="查阅时间" type="xs:dateTime"   />
    <xs:element name="节点编码" type="xs:string"   />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="contactsTab_Sum" typexml="Count" itemname="contacts">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="contactsTab_Delete" typexml="Delete" itemname="contacts">
  <etpTemplate_contactsTab_xmlland></etpTemplate_contactsTab_xmlland>
</XML>
<XML id="contactsTab_dict" typexml="Dict" itemname="contacts"></XML>
<XML id="contactsTab" typexml="Data" itemname="contacts"></XML>
<XML id="contactsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_contactsTab_hlbChanged" ctrlschema="etpTemplate_contactsTab_hlbWidth" ctrlstate="etpTemplate_contactsTab_hlbState" ctrlhlbcmd="etpTemplate_contactsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="contacts" relation="D" linkcol="旺旺" columnkey="ID">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="旺旺" type="xs:string"   />
    <xs:element name="联系人" type="xs:string"  width="60"  />
    <xs:element name="联系电话" type="xs:string"   />
    <xs:element name="邮政编码" type="xs:string"  width="60"  />
    <xs:element name="区号" type="xs:string"  width="40"  />
    <xs:element name="快递地址" type="xs:string"   />
    <xs:element name="省" type="xs:string"  dataitem="exec FD_省市 null,@省" textcol="name" valuecol="name" width="60"  />
    <xs:element name="市" type="xs:string"  dataitem="exec FD_省市 @省,@市" textcol="name" valuecol="name"  />
    <xs:element name="区县" type="xs:string"  dataitem="exec FD_省市 @市,@区县" textcol="name" valuecol="name" width="60"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="returngoodsTab_Sum" typexml="Count" itemname="returngoods">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="returngoodsTab_Delete" typexml="Delete" itemname="returngoods">
  <etpTemplate_returngoodsTab_xmlland></etpTemplate_returngoodsTab_xmlland>
</XML>
<XML id="returngoodsTab_dict" typexml="Dict" itemname="returngoods"></XML>
<XML id="returngoodsTab" typexml="Data" itemname="returngoods"></XML>
<XML id="returngoodsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_returngoodsTab_hlbChanged" ctrlschema="etpTemplate_returngoodsTab_hlbWidth" ctrlstate="etpTemplate_returngoodsTab_hlbState" ctrlhlbcmd="etpTemplate_returngoodsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="returngoods" relation="D">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  visible="1"  />
    <xs:element name="单据日期" type="xs:dateTime"  visible="1"  />
    <xs:element name="客户代码" type="xs:string"  visible="1" width="50"  />
    <xs:element name="联系人" type="xs:string"  visible="1" width="50"  />
    <xs:element name="联系电话" type="xs:string"  visible="1" width="70"  />
    <xs:element name="快递公司" type="xs:string"  visible="1" width="60"  />
    <xs:element name="快递地址" type="xs:string"  visible="1" width="50"  />
    <xs:element name="编号" type="xs:string"  width="100"  />
    <xs:element name="客户" type="xs:string"  title="客户信息" width="50"  />
    <xs:element name="购买日期" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="购买日期_格式"  />
    <xs:element name="款号" type="xs:string"  width="80"  />
    <xs:element name="颜色" type="xs:string"  width="60"  />
    <xs:element name="尺码T" type="xs:string"  title="尺码" width="40"  />
    <xs:element name="数量" type="xs:double"  width="40"  />
    <xs:element name="金额" type="xs:double"  width="60"  />
    <xs:element name="库位" type="xs:string"  width="60"  />
    <xs:element name="原单号" type="xs:string"  visible="1" width="50"  />
    <xs:element name="视图" type="xs:string"  expression="iif(数量==0,&quot;已退换&quot;,&quot;退换&quot;)" datastyle="blink" onclick="dlgbill()" width="55"  />
    <xs:element name="sn" type="xs:int"  visible="1" width="40"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="recordbackingTab_Sum" typexml="Count" itemname="recordbacking">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="recordbackingTab_Delete" typexml="Delete" itemname="recordbacking">
  <etpTemplate_recordbackingTab_xmlland></etpTemplate_recordbackingTab_xmlland>
</XML>
<XML id="recordbackingTab_dict" typexml="Dict" itemname="recordbacking"></XML>
<XML id="recordbackingTab" typexml="Data" itemname="recordbacking"></XML>
<XML id="recordbackingTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_recordbackingTab_hlbChanged" ctrlschema="etpTemplate_recordbackingTab_hlbWidth" ctrlstate="etpTemplate_recordbackingTab_hlbState" ctrlhlbcmd="etpTemplate_recordbackingTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="recordbacking" relation="D">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  visible="1"  />
    <xs:element name="编号" type="xs:string"  width="100"  />
    <xs:element name="客户" type="xs:string"   />
    <xs:element name="退货日期" type="xs:string"  format="yyyy-MM-dd" width="70" formatfld="退货日期_格式"  />
    <xs:element name="款号" type="xs:string"   />
    <xs:element name="颜色" type="xs:string"  width="70"  />
    <xs:element name="尺码T" type="xs:string"  title="尺码" width="50"  />
    <xs:element name="数量" type="xs:double"  width="40"  />
    <xs:element name="金额" type="xs:double"  width="60"  />
    <xs:element name="库位" type="xs:string"   />
    <xs:element name="sn" type="xs:int"  visible="1"  />
    <xs:element name="节点" type="xs:string"  visible="1" width="40"  />
    <xs:element name="状态" type="xs:string"  width="40"  />
    <xs:element name="承办日期" type="xs:string"  visible="1" width="40"  />
    <xs:element name="经办人" type="xs:string"  visible="1" width="40"  />
    <xs:element name="编辑" type="xs:string"  visible="1" width="40"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="recordbackTab_Sum" typexml="Count" itemname="recordback">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="recordbackTab_Delete" typexml="Delete" itemname="recordback">
  <etpTemplate_recordbackTab_xmlland></etpTemplate_recordbackTab_xmlland>
</XML>
<XML id="recordbackTab_dict" typexml="Dict" itemname="recordback"></XML>
<XML id="recordbackTab" typexml="Data" itemname="recordback"></XML>
<XML id="recordbackTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_recordbackTab_hlbChanged" ctrlschema="etpTemplate_recordbackTab_hlbWidth" ctrlstate="etpTemplate_recordbackTab_hlbState" ctrlhlbcmd="etpTemplate_recordbackTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="recordback" relation="D">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  visible="1"  />
    <xs:element name="单据日期" type="xs:dateTime"  visible="1"  />
    <xs:element name="客户代码" type="xs:string"  visible="1" width="60"  />
    <xs:element name="联系人" type="xs:string"  visible="1" width="60"  />
    <xs:element name="联系电话" type="xs:string"  visible="1" width="60"  />
    <xs:element name="快递公司" type="xs:string"  visible="1" width="60"  />
    <xs:element name="快递地址" type="xs:string"  visible="1" width="60"  />
    <xs:element name="编号" type="xs:string"  width="100"  />
    <xs:element name="客户" type="xs:string"   />
    <xs:element name="退货日期" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="退货日期_格式"  />
    <xs:element name="款号" type="xs:string"   />
    <xs:element name="颜色" type="xs:string"  width="60"  />
    <xs:element name="尺码" type="xs:string"  visible="1" width="60"  />
    <xs:element name="尺码T" type="xs:string"  title="尺码" width="40"  />
    <xs:element name="数量" type="xs:double"  width="40"  />
    <xs:element name="金额" type="xs:double"  width="60"  />
    <xs:element name="库位" type="xs:string"   />
    <xs:element name="sn" type="xs:int"  visible="1" width="60"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="todorecordTab_Sum" typexml="Count" itemname="todo">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="todorecordTab_Delete" typexml="Delete" itemname="todo">
  <etpTemplate_todorecordTab_xmlland></etpTemplate_todorecordTab_xmlland>
</XML>
<XML id="todorecordTab_dict" typexml="Dict" itemname="todo"></XML>
<XML id="todorecordTab" typexml="Data" itemname="todo"></XML>
<XML id="todorecordTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_todorecordTab_hlbChanged" ctrlschema="etpTemplate_todorecordTab_hlbWidth" ctrlstate="etpTemplate_todorecordTab_hlbState" ctrlhlbcmd="etpTemplate_todorecordTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="todo" relation="D">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="单据编号" type="xs:string"  visible="1"  />
    <xs:element name="单据日期" type="xs:dateTime"  visible="1"  />
    <xs:element name="客户代码" type="xs:string"  visible="1" width="40"  />
    <xs:element name="快递地址" type="xs:string"  visible="1" width="40"  />
    <xs:element name="联系人" type="xs:string"  visible="1" width="40"  />
    <xs:element name="联系电话" type="xs:string"  visible="1" width="40"  />
    <xs:element name="编号" type="xs:string"  width="100"  />
    <xs:element name="客户" type="xs:string"  title="客户信息" href="#" target="_self" width="60"  />
    <xs:element name="快递条码" type="xs:string"  title="快递号码"  />
    <xs:element name="购买日期" type="xs:string"   />
    <xs:element name="款号" type="xs:string"  width="70"  />
    <xs:element name="颜色" type="xs:string"  width="50"  />
    <xs:element name="尺码T" type="xs:string"  title="尺码" width="40"  />
    <xs:element name="数量" type="xs:double"  width="40"  />
    <xs:element name="金额" type="xs:double"  width="60"  />
    <xs:element name="库位" type="xs:string"  width="60"  />
    <xs:element name="sn" type="xs:int"  visible="1"  />
    <xs:element name="节点" type="xs:string"  datastyle="blink" title="状态" onclick="showbill()" width="60"  />
    <xs:element name="经办人" type="xs:string"  visible="1" width="60"  />
    <xs:element name="编辑" type="xs:string"  visible="1" width="40"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="saleOpportsTab_Sum" typexml="Count" itemname="销售机会">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="saleOpportsTab_Delete" typexml="Delete" itemname="销售机会">
  <etpTemplate_saleOpportsTab_xmlland></etpTemplate_saleOpportsTab_xmlland>
</XML>
<XML id="saleOpportsTab_dict" typexml="Dict" itemname="销售机会"></XML>
<XML id="saleOpportsTab" typexml="Data" itemname="销售机会"></XML>
<XML id="saleOpportsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_saleOpportsTab_hlbChanged" ctrlschema="etpTemplate_saleOpportsTab_hlbWidth" ctrlstate="etpTemplate_saleOpportsTab_hlbState" ctrlhlbcmd="etpTemplate_saleOpportsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="销售机会" relation="D" linkcol="客户" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="客户" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="主题" type="xs:string"  chkcol="1" evisible="1"  />
    <xs:element name="发现时间" type="xs:dateTime"  format="yyyy-MM-dd" expression="#当前时间" evisible="1" formatfld="发现时间_格式"  />
    <xs:element name="需求" type="xs:string"  datastyle="textarea" visible="1" width="490" height="100"  />
    <xs:element name="负责人" type="xs:string"  expression="#姓名" visible="1"  />
    <xs:element name="预期日期" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="预期日期_格式"  />
    <xs:element name="阶段" type="xs:string"  expression="&quot;初期沟通&quot;" dataitem="exec FC_阶段" textcol="name" valuecol="name"  />
    <xs:element name="可行性" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="状态" type="xs:string"  expression="&quot;未结束&quot;" dataitem="exec FC_状态" textcol="name" valuecol="name"  />
    <xs:element name="阶段备注" type="xs:string"  visible="1"  />
    <xs:element name="身高" type="xs:string"  visible="1"  />
    <xs:element name="体重" type="xs:string"  visible="1"  />
    <xs:element name="职业" type="xs:string"  visible="1" dataitem="exec FC_职业" textcol="name" valuecol="name"  />
    <xs:element name="尺码" type="xs:string"  visible="1" dataitem="exec FD_尺码 null" textcol="name" valuecol="name"  />
    <xs:element name="性格描述" type="xs:string"  visible="1" dataitem="exec FC_特征" textcol="name" valuecol="name"  />
    <xs:element name="属性" type="xs:string"  visible="1" dataitem="exec FC_属性" textcol="name" valuecol="name"  />
    <xs:element name="风格" type="xs:string"  visible="1" dataitem="exec FC_风格" textcol="name" valuecol="name"  />
    <xs:element name="印象" type="xs:string"  visible="1" dataitem="exec FC_印象" textcol="name" valuecol="name"  />
    <xs:element name="胸围" type="xs:string"  visible="1"  />
    <xs:element name="肩宽" type="xs:string"  visible="1"  />
    <xs:element name="款式" type="xs:string"  visible="1"  />
    <xs:element name="查看" type="xs:string"  expression="&quot;详细&quot;" datastyle="blink" evisible="1" href="#" target="_self" onclick="GridUtil.usOnCellFocusHandle();openDlg();"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="slallgoodsTab_Sum" typexml="Count" itemname="slallgoods">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>5</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="slallgoodsTab_Delete" typexml="Delete" itemname="slallgoods">
  <etpTemplate_slallgoodsTab_xmlland></etpTemplate_slallgoodsTab_xmlland>
</XML>
<XML id="slallgoodsTab_dict" typexml="Dict" itemname="slallgoods"></XML>
<XML id="slallgoodsTab" typexml="Data" itemname="slallgoods"></XML>
<XML id="slallgoodsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_slallgoodsTab_hlbChanged" ctrlschema="etpTemplate_slallgoodsTab_hlbWidth" ctrlstate="etpTemplate_slallgoodsTab_hlbState" ctrlhlbcmd="etpTemplate_slallgoodsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="slallgoods" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="库位" type="xs:string"  width="60"  />
    <xs:element name="款号" type="xs:string"   />
    <xs:element name="颜色名称" type="xs:string"  title="颜色" width="70"  />
    <xs:element name="单价" type="xs:double"  width="50"  />
    <xs:element name="XS" type="xs:int"   />
    <xs:element name="S" type="xs:int"   />
    <xs:element name="M" type="xs:int"   />
    <xs:element name="L" type="xs:int"   />
    <xs:element name="XL" type="xs:int"   />
    <xs:element name="XXL" type="xs:int"   />
    <xs:element name="XXXL" type="xs:int"   />
    <xs:element name="XXXXL" type="xs:int"   />
    <xs:element name="尺码标题" type="xs:string"  visible="1"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>