<XML id="xmlparam" typexml="Param">
  <D>
    <PL t="P">
      <L t="Ts">
        <P n="RecordCount" v="" t="s" pt="M"/>
        <P n="Command" v="TransParam" t="s"/>
        <P n="UnitName" v="����ͷ�����" t="s"/>
      </L>
    </PL>
  </D>
</XML>
<XML name="����ͷ�����" templatetype="HTML" id="xmlConf_xmlLandConf" typexml="ConfProperty" confpro="" tpath="netcustmgr.htm" DataSrcFile="��װ" DictColSrcFile="��װ">
  <UnitItem>
    <Item name="master" relation="M" linkcol="���ݱ��" dataitem="fgsale" columnkey="ID" manualrefresh="True"></Item>
    <Item name="detail" relation="D" linkcol="���ݱ��" dataitem="fgsaledetailnet" columnkey="ID" manualrefresh="True"></Item>
    <Item name="slgoods" relation="G" dataitem="selectAllowstore" manualrefresh="True"></Item>
    <Item name="gonodes" relation="G" dataitem="gonodes" manualrefresh="True"></Item>
    <Item name="jbr" relation="G" dataitem="ѡ�񾭰���" manualrefresh="True"></Item>
    <Item name="bknodes" relation="G" dataitem="bknodes" manualrefresh="True"></Item>
    <Item name="opinion" relation="D" linkcol="���ݱ��" dataitem="flowopinion" columnkey="ID" manualrefresh="True" />
    <Item name="monitor" relation="G" dataitem="wfmonitor" manualrefresh="True" />
    <Item name="edit" relation="G" linkcol="����" dataitem="netcustomer" columnkey="ID" countdataitem="netcustomercount" manualrefresh="True"></Item>
    <Item name="record" relation="D" dataitem="csrecord" masteritem="edit" manualrefresh="True"></Item>
    <Item name="inflow" relation="G" dataitem="inflow" manualrefresh="True" />
    <Item name="contacts" relation="D" linkcol="����" dataitem="contacts" columnkey="ID" masteritem="edit"></Item>
    <Item name="returngoods" relation="D" dataitem="returngoods" masteritem="edit"></Item>
    <Item name="recordbacking" relation="D" dataitem="recordbacking" masteritem="edit"></Item>
    <Item name="recordback" relation="D" dataitem="recordback" masteritem="edit"></Item>
    <Item name="todo" relation="D" dataitem="todorecord" masteritem="edit"></Item>
    <Item name="���ۻ���" relation="D" linkcol="�ͻ�" dataitem="saleOpports" columnkey="ID" masteritem="edit" manualrefresh="True"></Item>
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
<XML id="fgsaleTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_fgsaleTab_hlbChanged" ctrlschema="etpTemplate_fgsaleTab_hlbWidth" ctrlstate="etpTemplate_fgsaleTab_hlbState" ctrlhlbcmd="etpTemplate_fgsaleTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="master" relation="M" linkcol="���ݱ��" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="���ݱ��" type="xs:string"  bhrule="ND-[YYYY][MM]-[0000]" zeroflag="��"  />
    <xs:element name="��������" type="xs:dateTime"  format="yyyy-MM-dd" expression="#��ǰ����" formatfld="��������_��ʽ"  />
    <xs:element name="��������" type="xs:string"  expression="#��������" isreadonly="1"  />
    <xs:element name="���Ŵ���" type="xs:string"  expression="#���Ŵ���"  />
    <xs:element name="�ͻ�����" type="xs:string"   />
    <xs:element name="�ͻ�����" type="xs:string"   />
    <xs:element name="�ͻ����" type="xs:string"  dataitem="exec FD_��������" textcol="name" valuecol="name"  />
    <xs:element name="�ۿ�" type="xs:double"   />
    <xs:element name="��ϵ��" type="xs:string"   />
    <xs:element name="��ϵ�绰" type="xs:string"   />
    <xs:element name="ʡ" type="xs:string"   />
    <xs:element name="��" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="��ݵ�ַ" type="xs:string"  chkcol="1" dataitem="exec FD_�����Ϣ @�ͻ�����" textcol="title" valuecol="name" isreadonly="1" formatfld="��ݵ�ַ_��ʾ"  />
    <xs:element name="�ͻ�����" type="xs:string"   />
    <xs:element name="�ͻ��ʱ�" type="xs:string"   />
    <xs:element name="��ݹ�˾" type="xs:string"  dataitem="exec FD_��ݹ�˾" textcol="name" valuecol="name"  />
    <xs:element name="��ݷ�ʽ" type="xs:string"   />
    <xs:element name="�������" type="xs:string"   />
    <xs:element name="���ʽ" type="xs:string"   />
    <xs:element name="����" type="xs:double"   />
    <xs:element name="�˷�" type="xs:double"   />
    <xs:element name="������" type="xs:string"  expression="#����" dataitem="exec SD_ӪҵԱ" textcol="name" valuecol="name" isreadonly="1"  />
    <xs:element name="�ܺϼ�" type="xs:double"  validity="�ܺϼ�>0" alertexpr="������������С��0!" chkcol="1" expression="detail{����}" calcol="1" isreadonly="1"  />
    <xs:element name="�ܽ��" type="xs:double"  expression="detail{�����ۼ�}" calcol="1" isreadonly="1"  />
    <xs:element name="���ۿ۽��" type="xs:double"  expression="detail{ʵ���ۼ�}" calcol="1"  />
    <xs:element name="������" type="xs:int"  expression="detail{����}" calcol="1"  />
    <xs:element name="�����" type="xs:double"  expression="detail{�˺������ۼ�}" calcol="1"  />
    <xs:element name="���ۿ����" type="xs:double"  expression="detail{�˺�ʵ���ۼ�}" calcol="1"  />
    <xs:element name="�˺��Żݽ��" type="xs:double"  calcol="1"  />
    <xs:element name="�Żݽ��" type="xs:double"  isreadonly="1"  />
    <xs:element name="Ӧ���ֽ�" type="xs:double"   />
    <xs:element name="����״̬" type="xs:string"  expression="if(&quot;�ѵ���&quot;==����״̬ || &quot;�ѱ���&quot;==����״̬) ����״̬;else &quot;δ����&quot;" calcol="1"  />
    <xs:element name="��������" type="xs:string"   />
    <xs:element name="Ԥ���ϻ�ʱ��" type="xs:dateTime"   />
    <xs:element name="��˾����" type="xs:string"  visible="1"  />
    <xs:element name="Ŀ�Ľڵ�" type="xs:string"   />
    <xs:element name="���ղ���" type="xs:string"   />
    <xs:element name="�ɹ�����" type="xs:string"   />
    <xs:element name="ֱӪ��" type="xs:boolean"   />
    <xs:element name="����" type="xs:boolean"   />
    <xs:element name="�������" type="xs:string"   />
    <xs:element name="��˾��ַ" type="xs:string"   />
    <xs:element name="�绰" type="xs:string"   />
    <xs:element name="��ַ" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="�˻����" type="xs:string"   />
    <xs:element name="ָ�����" type="xs:boolean"   />
    <xs:element name="�����" type="xs:string"   />
    <xs:element name="ԭ����" type="xs:string"   />
    <xs:element name="���˵���" type="xs:string"   />
    <xs:element name="��ע" type="xs:string"   />
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
<XML id="fgsaledetailnetTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_fgsaledetailnetTab_hlbChanged" ctrlschema="etpTemplate_fgsaledetailnetTab_hlbWidth" ctrlstate="etpTemplate_fgsaledetailnetTab_hlbState" ctrlhlbcmd="etpTemplate_fgsaledetailnetTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="detail" relation="D" linkcol="���ݱ��" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="���ݱ��" type="xs:string"   />
    <xs:element name="����" type="xs:string"  visible="1" width="50"  />
    <xs:element name="�����ɫ����" type="xs:string"  visible="1"  />
    <xs:element name="Ʒ��" type="xs:string"  visible="1" width="100"  />
    <xs:element name="���" type="xs:string"  chkcol="1" isreadonly="1" width="70"  />
    <xs:element name="��ɫ����" type="xs:string"  chkcol="1" dataitem="exec dbo.FD_��ɫ" textcol="name" valuecol="name" title="��ɫ" width="70"  />
    <xs:element name="����" type="xs:string"  visible="1" width="40"  />
    <xs:element name="����T" type="xs:string"  chkcol="1" datastyle="strcenter" dataitem="exec FD_��Ч������ɫ @��λ,@���,@��ɫ����" textcol="title" valuecol="name" title="����" width="40" formatfld="����T_��ʾ"  />
    <xs:element name="����" type="xs:int"  chkcol="1" expression="1" datastyle="strcenter" footer="sum" width="40"  />
    <xs:element name="����" type="xs:int"  visible="1" title="����" footer="sum" width="40"  />
    <xs:element name="��������" type="xs:int"  visible="1" width="40"  />
    <xs:element name="���ϼ۸�" type="xs:double"  format="#,#,###.00" title="����" isreadonly="1" width="60" formatfld="���ϼ۸�_��ʽ"  />
    <xs:element name="�ۿ۵���" type="xs:double"  expression="ʵ���ۼ�/����" title="�ۿۼ�" width="60"  />
    <xs:element name="�˺��ۿ۵���" type="xs:double"  visible="1" title="�ۿۼ�" width="40"  />
    <xs:element name="�����ۼ�" type="xs:double"  expression="���ϼ۸�*����" visible="1" calcol="1" isreadonly="1" footer="sum" width="40"  />
    <xs:element name="�˺������ۼ�" type="xs:double"  visible="1" footer="sum" width="40"  />
    <xs:element name="ʵ���ۼ�" type="xs:double"  title="С��" isreadonly="1" footer="sum" width="60"  />
    <xs:element name="�˺�ʵ���ۼ�" type="xs:double"  visible="1" title="С��" footer="sum" width="40"  />
    <xs:element name="��λ" type="xs:string"  isreadonly="1" width="70"  />
    <xs:element name="�ڲ�" type="xs:string"  visible="1" width="40"  />
    <xs:element name="���Ŵ���" type="xs:string"  visible="1" width="40"  />
    <xs:element name="��ע" type="xs:string"  visible="1" width="50"  />
    <xs:element name="�ɹ�����" type="xs:string"  visible="1" title="���۲���" width="50"  />
    <xs:element name="�������" type="xs:string"  visible="1" width="40"  />
    <xs:element name="�������" type="xs:string"  visible="1" width="40"  />
    <xs:element name="����" type="xs:string"  visible="1" width="40"  />
    <xs:element name="���" type="xs:boolean"  visible="1" width="40"  />
    <xs:element name="������" type="xs:string"  visible="1" width="40"  />
    <xs:element name="Ʒ��" type="xs:string"  visible="1" width="40"  />
    <xs:element name="�˻�����" type="xs:int"  validity="(����-�˻�����)>-1" alertexpr="�ÿ��޻�����!" width="50"  />
    <xs:element name="�˻����" type="xs:double"  visible="1" footer="sum" width="40"  />
    <xs:element name="�˻�����" type="xs:double"  visible="1" width="60"  />
    <xs:element name="��������" type="xs:int"  visible="1" width="40"  />
    <xs:element name="���˽��" type="xs:double"  visible="1" width="40"  />
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
    <xs:element name="��λ����" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��λ" type="xs:string"  isreadonly="1" width="65"  />
    <xs:element name="���" type="xs:string"  isreadonly="1" width="70"  />
    <xs:element name="��ɫ����" type="xs:string"  title="��ɫ" isreadonly="1" width="60"  />
    <xs:element name="��ɫ����" type="xs:int"  visible="1" isreadonly="1"  />
    <xs:element name="������" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��Ʒ���" type="xs:string"  visible="1"  />
    <xs:element name="���ϼ۸�" type="xs:double"  title="���Ƽ�" isreadonly="1" width="45"  />
    <xs:element name="�ɹ��۸�" type="xs:double"  visible="1" width="60"  />
    <xs:element name="XS" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="S" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="M" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="L" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="XXXXL" type="xs:int"  isreadonly="1" width="30"  />
    <xs:element name="���Ŵ���" type="xs:int"  visible="1" width="60"  />
    <xs:element name="�������" type="xs:int"  visible="1" width="60"  />
    <xs:element name="�������" type="xs:int"  visible="1" isreadonly="1" width="60"  />
    <xs:element name="����" type="xs:string"  visible="1" width="60"  />
    <xs:element name="���" type="xs:boolean"  visible="1" width="60"  />
    <xs:element name="�����ɫ����" type="xs:string"  visible="1"  />
    <xs:element name="�������" type="xs:string"  visible="1" width="60"  />
    <xs:element name="�����׼" type="xs:string"  visible="1" width="60"  />
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
    <xs:element name="����" type="xs:string"  datastyle="blink" title="��ѡ��Ҫ���еĲ���" href="#" target="_self" onclick="ue_submit()"  />
    <xs:element name="����" type="xs:string"  visible="1"  />
    <xs:element name="��һ�ڵ�" type="xs:string"  visible="1"  />
    <xs:element name="���ַ�" type="xs:boolean"  visible="1"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="ѡ�񾭰���Tab_Sum" typexml="Count" itemname="jbr">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="ѡ�񾭰���Tab_Delete" typexml="Delete" itemname="jbr">
  <etpTemplate_ѡ�񾭰���Tab_xmlland></etpTemplate_ѡ�񾭰���Tab_xmlland>
</XML>
<XML id="ѡ�񾭰���Tab_dict" typexml="Dict" itemname="jbr"></XML>
<XML id="ѡ�񾭰���Tab" typexml="Data" itemname="jbr"></XML>
<XML id="ѡ�񾭰���Tab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_ѡ�񾭰���Tab_hlbChanged" ctrlschema="etpTemplate_ѡ�񾭰���Tab_hlbWidth" ctrlstate="etpTemplate_ѡ�񾭰���Tab_hlbState" ctrlhlbcmd="etpTemplate_ѡ�񾭰���Tab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="jbr" relation="G" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="��λ" type="xs:string"   />
    <xs:element name="��������" type="xs:string"  visible="1"  />
    <xs:element name="���ݱ��" type="xs:string"  visible="1"  />
    <xs:element name="����" type="xs:string"  title="������" isreadonly="1"  />
    <xs:element name="�ʺ�" type="xs:string"  visible="1" width="70"  />
    <xs:element name="��������" type="xs:boolean"  datastyle="boolradio" width="70"  />
    <xs:element name="��������" type="xs:boolean"  datastyle="boolradio" width="70"  />
    <xs:element name="�ڵ�" type="xs:string"  visible="1" isreadonly="1" width="70"  />
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
    <xs:element name="����" type="xs:string"  datastyle="blink" title="��ѡ���˻صĽڵ�" href="#" target="_self" onclick="ue_return();"  />
    <xs:element name="����" type="xs:string"  visible="1"  />
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
<XML id="flowopinionTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_flowopinionTab_hlbChanged" ctrlschema="etpTemplate_flowopinionTab_hlbWidth" ctrlstate="etpTemplate_flowopinionTab_hlbState" ctrlhlbcmd="etpTemplate_flowopinionTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="opinion" relation="D" linkcol="���ݱ��" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="���ݱ��" type="xs:string"   />
    <xs:element name="��������" type="xs:string"   />
    <xs:element name="�ڵ�" type="xs:string"   />
    <xs:element name="�ڵ����" type="xs:string"   />
    <xs:element name="�ڵ����" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="���" type="xs:string"   />
    <xs:element name="������" type="xs:string"   />
    <xs:element name="ʱ��" type="xs:dateTime"   />
    <xs:element name="��ע" type="xs:string"   />
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
    <xs:element name="����" type="xs:string"   />
    <xs:element name="ʵ�����" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="�ڵ�" type="xs:string"   />
    <xs:element name="����״̬" type="xs:string"   />
    <xs:element name="����ʱ��" type="xs:string"   />
    <xs:element name="�������" type="xs:string"   />
    <xs:element name="���״̬" type="xs:string"   />
    <xs:element name="���ʱ��" type="xs:string"   />
    <xs:element name="������" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="ǩ������" type="xs:dateTime"   />
    <xs:element name="��ע" type="xs:string"   />
    <xs:element name="�鵵ʱ��" type="xs:dateTime"   />
    <xs:element name="�᰸ʱ��" type="xs:dateTime"   />
    <xs:element name="�ռ�����" type="xs:dateTime"   />
    <xs:element name="��ŵ�������" type="xs:dateTime"   />
    <xs:element name="�ڵ����" type="xs:string"   />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="netcustomerTab_Sum" typexml="Count" itemname="edit">
  <����>
    <netcustomercount>
      <��¼����>0</��¼����>
      <TotalPage>0</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>200</PageSize>
      <RecordCount>0</RecordCount>
    </netcustomercount>
  </����>
</XML>
<XML id="netcustomerTab_Delete" typexml="Delete" itemname="edit">
  <etpTemplate_netcustomerTab_xmlland></etpTemplate_netcustomerTab_xmlland>
</XML>
<XML id="netcustomerTab_dict" typexml="Dict" itemname="edit"></XML>
<XML id="netcustomerTab" typexml="Data" itemname="edit"></XML>
<XML id="netcustomerTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_netcustomerTab_hlbChanged" ctrlschema="etpTemplate_netcustomerTab_hlbWidth" ctrlstate="etpTemplate_netcustomerTab_hlbState" ctrlhlbcmd="etpTemplate_netcustomerTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="edit" relation="G" linkcol="����" columnkey="ID" pagesize="200" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="����" type="xs:string"  chkcol="1" evisible="1" title="����ID" width="80"  />
    <xs:element name="�ʺ�" type="xs:string"  visible="1" evisible="1" title="�û���" width="100"  />
    <xs:element name="����" type="xs:string"  visible="1" evisible="1" width="80"  />
    <xs:element name="ע������" type="xs:string"  visible="1" width="150"  />
    <xs:element name="��ϵ�绰" type="xs:string"  width="120"  />
    <xs:element name="����" type="xs:string"  visible="1" evisible="1" title="VIP����" isreadonly="1"  />
    <xs:element name="���" type="xs:string"  evisible="1" title="VIP���" isreadonly="1" width="80"  />
    <xs:element name="����" type="xs:string"  format="*" visible="1" evisible="1" width="100" formatfld="����_��ʽ"  />
    <xs:element name="��������" type="xs:dateTime"  format="yyyy-MM-dd" visible="1" width="100" formatfld="��������_��ʽ"  />
    <xs:element name="�ֻ�" type="xs:string"  visible="1" width="150"  />
    <xs:element name="�Ǽ�����" type="xs:dateTime"  visible="1" evisible="1"  />
    <xs:element name="ʡ" type="xs:string"  visible="1" dataitem="exec FD_ʡ�� null,@ʡ" textcol="name" valuecol="name" width="60"  />
    <xs:element name="QQ" type="xs:string"  visible="1" width="80"  />
    <xs:element name="��" type="xs:string"  dataitem="exec FD_ʡ���� @ʡ,@��" textcol="name" valuecol="name" width="70"  />
    <xs:element name="���д���" type="xs:int"  visible="1" evisible="1" width="150"  />
    <xs:element name="��������" type="xs:string"  visible="1" width="150"  />
    <xs:element name="����" type="xs:string"  visible="1" dataitem="exec FD_ʡ�� @��,@����" textcol="name" valuecol="name" title="��/��" width="60"  />
    <xs:element name="����" type="xs:string"  visible="1" width="150"  />
    <xs:element name="��ַ" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="��ݵ�ַ" type="xs:string"  width="150"  />
    <xs:element name="MSN" type="xs:string"  visible="1" evisible="1" width="100"  />
    <xs:element name="�ͷ�" type="xs:string"  visible="1" title="ע����" width="150"  />
    <xs:element name="������" type="xs:string"  visible="1" width="150"  />
    <xs:element name="��������" type="xs:string"  visible="1" width="150"  />
    <xs:element name="�˺�" type="xs:string"  visible="1" width="150"  />
    <xs:element name="���е�ַ" type="xs:string"  visible="1" width="150"  />
    <xs:element name="˰��" type="xs:string"  visible="1" width="150"  />
    <xs:element name="˰��" type="xs:string"  visible="1" width="150"  />
    <xs:element name="˰��" type="xs:decimal"  visible="1" width="150"  />
    <xs:element name="���" type="xs:string"  visible="1" width="100"  />
    <xs:element name="����" type="xs:string"  visible="1" width="100"  />
    <xs:element name="��Χ" type="xs:string"  visible="1" width="150"  />
    <xs:element name="���" type="xs:string"  visible="1" width="150"  />
    <xs:element name="����" type="xs:string"  visible="1" dataitem="exec FD_���� null" textcol="name" valuecol="name" width="100"  />
    <xs:element name="��ʽ" type="xs:string"  visible="1" onclick="selectbyBarCode(2)" width="100"  />
    <xs:element name="ְҵ" type="xs:string"  visible="1" dataitem="exec FC_ְҵ" textcol="name" valuecol="name" width="100"  />
    <xs:element name="�Ը�����" type="xs:string"  visible="1" dataitem="exec FC_����" textcol="name" valuecol="name" title="��������" width="150"  />
    <xs:element name="ӡ��" type="xs:string"  visible="1" dataitem="exec FC_ӡ��" textcol="name" valuecol="name" width="150"  />
    <xs:element name="���" type="xs:string"  visible="1" dataitem="exec FC_���" textcol="name" valuecol="name" width="150"  />
    <xs:element name="����" type="xs:string"  visible="1" dataitem="exec FC_����" textcol="name" valuecol="name" width="150"  />
    <xs:element name="�����������" type="xs:boolean"  visible="1" title="�������" width="150"  />
    <xs:element name="���ѽ��" type="xs:decimal"  visible="1"  />
    <xs:element name="����" type="xs:int"  visible="1" width="100"  />
    <xs:element name="��������" type="xs:string"  visible="1" evisible="1" width="150"  />
    <xs:element name="��ע" type="xs:string"  datastyle="textarea" visible="1" width="470" height="100"  />
    <xs:element name="�ۿ�" type="xs:double"  visible="1" evisible="1" width="150"  />
    <xs:element name="�˻�����" type="xs:int"  visible="1" evisible="1" width="150"  />
    <xs:element name="���˷�" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="���˷�����" type="xs:double"  visible="1" evisible="1" width="150"  />
    <xs:element name="�齱" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="�ȵ�" type="xs:boolean"  visible="1" evisible="1" width="150"  />
    <xs:element name="�ȵ㱸ע" type="xs:string"  visible="1" evisible="1" width="150"  />
    <xs:element name="��ͼ" type="xs:string"  expression="&quot;��ϸ&quot;" datastyle="blink" evisible="1" onclick="editvip()" width="50"  />
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
    <xs:element name="���ݱ��" type="xs:string"  visible="1" width="100"  />
    <xs:element name="�ͻ�����" type="xs:string"  visible="1"  />
    <xs:element name="��ݵ�ַ" type="xs:string"  visible="1"  />
    <xs:element name="��ϵ��" type="xs:string"  visible="1" width="70"  />
    <xs:element name="��ϵ�绰" type="xs:string"  visible="1" width="70"  />
    <xs:element name="�������" type="xs:string"  visible="1"  />
    <xs:element name="���" type="xs:string"  datastyle="strcenter" width="110"  />
    <xs:element name="�ͻ�" type="xs:string"   />
    <xs:element name="��������" type="xs:string"  format="yyyy-MM-dd" datastyle="strcenter" width="80" formatfld="��������_��ʽ"  />
    <xs:element name="���" type="xs:string"  datastyle="strcenter" width="80"  />
    <xs:element name="��ɫ" type="xs:string"  datastyle="strcenter" width="60"  />
    <xs:element name="����T" type="xs:string"  datastyle="strcenter" title="����" width="40"  />
    <xs:element name="����" type="xs:double"  width="40"  />
    <xs:element name="���" type="xs:double"  format="#,#,###.00" width="90" formatfld="���_��ʽ"  />
    <xs:element name="��λ" type="xs:string"  visible="1" width="55"  />
    <xs:element name="sn" type="xs:int"  visible="1" width="55"  />
    <xs:element name="�ڵ�" type="xs:string"  visible="1" width="70"  />
    <xs:element name="״̬" type="xs:string"  datastyle="strcenter" width="70"  />
    <xs:element name="�а�����" type="xs:string"  visible="1" width="55"  />
    <xs:element name="������" type="xs:string"  visible="1"  />
    <xs:element name="�༭" type="xs:string"  visible="1" width="55"  />
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
    <xs:element name="����" type="xs:string"   />
    <xs:element name="ʵ�����" type="xs:string"   />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="�ڵ�" type="xs:string"   />
    <xs:element name="����״̬" type="xs:string"   />
    <xs:element name="����ʱ��" type="xs:string"   />
    <xs:element name="�������" type="xs:string"   />
    <xs:element name="��ҵʱ��" type="xs:dateTime"   />
    <xs:element name="���ʱ��" type="xs:string"   />
    <xs:element name="���״̬" type="xs:string"   />
    <xs:element name="������" type="xs:string"   />
    <xs:element name="��ɫ" type="xs:string"   />
    <xs:element name="ǩ������" type="xs:dateTime"   />
    <xs:element name="�ռ�����" type="xs:dateTime"   />
    <xs:element name="��ŵ�������" type="xs:dateTime"   />
    <xs:element name="����ʱ��" type="xs:dateTime"   />
    <xs:element name="�ڵ����" type="xs:string"   />
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
<XML id="contactsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_contactsTab_hlbChanged" ctrlschema="etpTemplate_contactsTab_hlbWidth" ctrlstate="etpTemplate_contactsTab_hlbState" ctrlhlbcmd="etpTemplate_contactsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="contacts" relation="D" linkcol="����" columnkey="ID">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="����" type="xs:string"   />
    <xs:element name="��ϵ��" type="xs:string"  width="60"  />
    <xs:element name="��ϵ�绰" type="xs:string"   />
    <xs:element name="��������" type="xs:string"  width="60"  />
    <xs:element name="����" type="xs:string"  width="40"  />
    <xs:element name="��ݵ�ַ" type="xs:string"   />
    <xs:element name="ʡ" type="xs:string"  dataitem="exec FD_ʡ�� null,@ʡ" textcol="name" valuecol="name" width="60"  />
    <xs:element name="��" type="xs:string"  dataitem="exec FD_ʡ�� @ʡ,@��" textcol="name" valuecol="name"  />
    <xs:element name="����" type="xs:string"  dataitem="exec FD_ʡ�� @��,@����" textcol="name" valuecol="name" width="60"  />
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
    <xs:element name="���ݱ��" type="xs:string"  visible="1"  />
    <xs:element name="��������" type="xs:dateTime"  visible="1"  />
    <xs:element name="�ͻ�����" type="xs:string"  visible="1" width="50"  />
    <xs:element name="��ϵ��" type="xs:string"  visible="1" width="50"  />
    <xs:element name="��ϵ�绰" type="xs:string"  visible="1" width="70"  />
    <xs:element name="��ݹ�˾" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��ݵ�ַ" type="xs:string"  visible="1" width="50"  />
    <xs:element name="���" type="xs:string"  width="100"  />
    <xs:element name="�ͻ�" type="xs:string"  title="�ͻ���Ϣ" width="50"  />
    <xs:element name="��������" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="��������_��ʽ"  />
    <xs:element name="���" type="xs:string"  width="80"  />
    <xs:element name="��ɫ" type="xs:string"  width="60"  />
    <xs:element name="����T" type="xs:string"  title="����" width="40"  />
    <xs:element name="����" type="xs:double"  width="40"  />
    <xs:element name="���" type="xs:double"  width="60"  />
    <xs:element name="��λ" type="xs:string"  width="60"  />
    <xs:element name="ԭ����" type="xs:string"  visible="1" width="50"  />
    <xs:element name="��ͼ" type="xs:string"  expression="iif(����==0,&quot;���˻�&quot;,&quot;�˻�&quot;)" datastyle="blink" onclick="dlgbill()" width="55"  />
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
    <xs:element name="���ݱ��" type="xs:string"  visible="1"  />
    <xs:element name="���" type="xs:string"  width="100"  />
    <xs:element name="�ͻ�" type="xs:string"   />
    <xs:element name="�˻�����" type="xs:string"  format="yyyy-MM-dd" width="70" formatfld="�˻�����_��ʽ"  />
    <xs:element name="���" type="xs:string"   />
    <xs:element name="��ɫ" type="xs:string"  width="70"  />
    <xs:element name="����T" type="xs:string"  title="����" width="50"  />
    <xs:element name="����" type="xs:double"  width="40"  />
    <xs:element name="���" type="xs:double"  width="60"  />
    <xs:element name="��λ" type="xs:string"   />
    <xs:element name="sn" type="xs:int"  visible="1"  />
    <xs:element name="�ڵ�" type="xs:string"  visible="1" width="40"  />
    <xs:element name="״̬" type="xs:string"  width="40"  />
    <xs:element name="�а�����" type="xs:string"  visible="1" width="40"  />
    <xs:element name="������" type="xs:string"  visible="1" width="40"  />
    <xs:element name="�༭" type="xs:string"  visible="1" width="40"  />
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
    <xs:element name="���ݱ��" type="xs:string"  visible="1"  />
    <xs:element name="��������" type="xs:dateTime"  visible="1"  />
    <xs:element name="�ͻ�����" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��ϵ��" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��ϵ�绰" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��ݹ�˾" type="xs:string"  visible="1" width="60"  />
    <xs:element name="��ݵ�ַ" type="xs:string"  visible="1" width="60"  />
    <xs:element name="���" type="xs:string"  width="100"  />
    <xs:element name="�ͻ�" type="xs:string"   />
    <xs:element name="�˻�����" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="�˻�����_��ʽ"  />
    <xs:element name="���" type="xs:string"   />
    <xs:element name="��ɫ" type="xs:string"  width="60"  />
    <xs:element name="����" type="xs:string"  visible="1" width="60"  />
    <xs:element name="����T" type="xs:string"  title="����" width="40"  />
    <xs:element name="����" type="xs:double"  width="40"  />
    <xs:element name="���" type="xs:double"  width="60"  />
    <xs:element name="��λ" type="xs:string"   />
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
    <xs:element name="���ݱ��" type="xs:string"  visible="1"  />
    <xs:element name="��������" type="xs:dateTime"  visible="1"  />
    <xs:element name="�ͻ�����" type="xs:string"  visible="1" width="40"  />
    <xs:element name="��ݵ�ַ" type="xs:string"  visible="1" width="40"  />
    <xs:element name="��ϵ��" type="xs:string"  visible="1" width="40"  />
    <xs:element name="��ϵ�绰" type="xs:string"  visible="1" width="40"  />
    <xs:element name="���" type="xs:string"  width="100"  />
    <xs:element name="�ͻ�" type="xs:string"  title="�ͻ���Ϣ" href="#" target="_self" width="60"  />
    <xs:element name="�������" type="xs:string"  title="��ݺ���"  />
    <xs:element name="��������" type="xs:string"   />
    <xs:element name="���" type="xs:string"  width="70"  />
    <xs:element name="��ɫ" type="xs:string"  width="50"  />
    <xs:element name="����T" type="xs:string"  title="����" width="40"  />
    <xs:element name="����" type="xs:double"  width="40"  />
    <xs:element name="���" type="xs:double"  width="60"  />
    <xs:element name="��λ" type="xs:string"  width="60"  />
    <xs:element name="sn" type="xs:int"  visible="1"  />
    <xs:element name="�ڵ�" type="xs:string"  datastyle="blink" title="״̬" onclick="showbill()" width="60"  />
    <xs:element name="������" type="xs:string"  visible="1" width="60"  />
    <xs:element name="�༭" type="xs:string"  visible="1" width="40"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>
<XML id="saleOpportsTab_Sum" typexml="Count" itemname="���ۻ���">
  <DataSet>
    <DataTableCount>
      <TotalPage>1</TotalPage>
      <PageIndex>1</PageIndex>
      <PageSize>10</PageSize>
      <RecordCount>0</RecordCount>
    </DataTableCount>
  </DataSet>
</XML>
<XML id="saleOpportsTab_Delete" typexml="Delete" itemname="���ۻ���">
  <etpTemplate_saleOpportsTab_xmlland></etpTemplate_saleOpportsTab_xmlland>
</XML>
<XML id="saleOpportsTab_dict" typexml="Dict" itemname="���ۻ���"></XML>
<XML id="saleOpportsTab" typexml="Data" itemname="���ۻ���"></XML>
<XML id="saleOpportsTab_Schema" typexml="Schema" ctrlAlert="" ctrlchanged="etpTemplate_saleOpportsTab_hlbChanged" ctrlschema="etpTemplate_saleOpportsTab_hlbWidth" ctrlstate="etpTemplate_saleOpportsTab_hlbState" ctrlhlbcmd="etpTemplate_saleOpportsTab_hlb_cmd" ctrlbtcommand="bt_PostBack" name="���ۻ���" relation="D" linkcol="�ͻ�" columnkey="ID" manualrefresh="True">
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xs:element name="ID" msdata:DataType="System.Guid, mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" type="xs:string"  xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"  />
    <xs:element name="�ͻ�" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="����" type="xs:string"  chkcol="1" evisible="1"  />
    <xs:element name="����ʱ��" type="xs:dateTime"  format="yyyy-MM-dd" expression="#��ǰʱ��" evisible="1" formatfld="����ʱ��_��ʽ"  />
    <xs:element name="����" type="xs:string"  datastyle="textarea" visible="1" width="490" height="100"  />
    <xs:element name="������" type="xs:string"  expression="#����" visible="1"  />
    <xs:element name="Ԥ������" type="xs:dateTime"  format="yyyy-MM-dd" formatfld="Ԥ������_��ʽ"  />
    <xs:element name="�׶�" type="xs:string"  expression="&quot;���ڹ�ͨ&quot;" dataitem="exec FC_�׶�" textcol="name" valuecol="name"  />
    <xs:element name="������" type="xs:string"  visible="1" evisible="1"  />
    <xs:element name="״̬" type="xs:string"  expression="&quot;δ����&quot;" dataitem="exec FC_״̬" textcol="name" valuecol="name"  />
    <xs:element name="�׶α�ע" type="xs:string"  visible="1"  />
    <xs:element name="���" type="xs:string"  visible="1"  />
    <xs:element name="����" type="xs:string"  visible="1"  />
    <xs:element name="ְҵ" type="xs:string"  visible="1" dataitem="exec FC_ְҵ" textcol="name" valuecol="name"  />
    <xs:element name="����" type="xs:string"  visible="1" dataitem="exec FD_���� null" textcol="name" valuecol="name"  />
    <xs:element name="�Ը�����" type="xs:string"  visible="1" dataitem="exec FC_����" textcol="name" valuecol="name"  />
    <xs:element name="����" type="xs:string"  visible="1" dataitem="exec FC_����" textcol="name" valuecol="name"  />
    <xs:element name="���" type="xs:string"  visible="1" dataitem="exec FC_���" textcol="name" valuecol="name"  />
    <xs:element name="ӡ��" type="xs:string"  visible="1" dataitem="exec FC_ӡ��" textcol="name" valuecol="name"  />
    <xs:element name="��Χ" type="xs:string"  visible="1"  />
    <xs:element name="���" type="xs:string"  visible="1"  />
    <xs:element name="��ʽ" type="xs:string"  visible="1"  />
    <xs:element name="�鿴" type="xs:string"  expression="&quot;��ϸ&quot;" datastyle="blink" evisible="1" href="#" target="_self" onclick="GridUtil.usOnCellFocusHandle();openDlg();"  />
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
    <xs:element name="��λ" type="xs:string"  width="60"  />
    <xs:element name="���" type="xs:string"   />
    <xs:element name="��ɫ����" type="xs:string"  title="��ɫ" width="70"  />
    <xs:element name="����" type="xs:double"  width="50"  />
    <xs:element name="XS" type="xs:int"   />
    <xs:element name="S" type="xs:int"   />
    <xs:element name="M" type="xs:int"   />
    <xs:element name="L" type="xs:int"   />
    <xs:element name="XL" type="xs:int"   />
    <xs:element name="XXL" type="xs:int"   />
    <xs:element name="XXXL" type="xs:int"   />
    <xs:element name="XXXXL" type="xs:int"   />
    <xs:element name="�������" type="xs:string"  visible="1"  />
    <xs:element name="RowNum" type="xs:int"  visible="1"  />
  </xs:schema>
</XML>