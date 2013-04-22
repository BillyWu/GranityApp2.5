using System;
using System.Collections.Specialized;
using System.Xml;
using System.IO;
using System.Data;
using System.Data.SqlClient;

namespace Estar.Common.Tools
{	
	#region WorkUnitType ҵ��Ԫ��������;WorkItemType ����Ŀ����;AppendFunType ������ܷ���;CalculateType ��������;SaveType ��������
	/// <summary>
	/// ҵ�����������
	/// </summary>
	public enum WorkUnitType
	{
        /// <summary>
        /// ��򵥵Ŀհ�ҳ����
        /// </summary>
        SimpleBank,
        /// <summary>
        /// ��ģ�������������
        /// </summary>
        SimpleBankLeft,
        /// <summary>
        /// ��������
        /// </summary>
        ReportItem,
        /// <summary>
        /// ����Vmlͼ�����͵�ģ�崰��
        /// </summary>
        VmlChartTp,
        /// <summary>
        /// �޸�����
        /// </summary>
        Updatekey,
        /// <summary>
        /// ��ʼԤ��ҳ��
        /// </summary>
        NavPage,
		/// <summary>
		/// VML��ͼ��������
		/// </summary>
		VmlMapPage,

		/// <summary>
		/// ���������ʽ����
		/// </summary>
		OtherItem,
		/// <summary>
		/// ϵͳ�˵�����
		/// </summary>
		SysItem,
		/// <summary>
		/// Ȩ������
		/// </summary>
		SysOptRight,
		/// <summary>
		/// ��֯��������
		/// </summary>
		SysOrganize,
		/// <summary>
		/// Ȩ������
		/// </summary>
		SysOptions,
		/// <summary>
		/// ���������
		/// </summary>
		SysAssign,
		/// <summary>
		/// ������Ԫ�еĸ��ӵ�Ԫ
		/// </summary>
		AppendUnit,
		/// <summary>
		/// ��ʼҳ
		/// </summary>
		HomePage
		
	}

	/// <summary>
	/// ������Ԫ�ĵ���Ŀ����
	/// </summary>
	public enum WorkItemType
	{
		/// <summary>
		/// ������
		/// </summary>
		MasterData,
		/// <summary>
		/// �����ݻ���ϸ����
		/// </summary>
		DetailData,
		/// <summary>
		/// ��������
		/// </summary>
		GeneralData,
		/// <summary>
		/// ��������
		/// </summary>
		ReportData,
		/// <summary>
		/// �Ƿ�Ϊ���ݲ�����
		/// </summary>
	}

	/// <summary>
	/// ������ܷ���
	/// </summary>
	public enum AppendFunType
	{
		/// <summary>
		/// ���
		/// </summary>
		Browse,
		/// <summary>
		/// ��������
		/// </summary>
		Import,
		/// <summary>
		/// �������
		/// </summary>
		Report,
		/// <summary>
		/// ֱ��ִ�ж����Sql���
		/// </summary>
		SqlCmd,
        /// <summary>
        /// �б����ִ�ж����Sql���
        /// </summary>
        SqlCmdList,
		/// <summary>
		/// ��Excel�ļ��������ݵ����ݿ���
		/// </summary>
		ImportFromExecel,
        /// <summary>
        /// ����ϵͳ
        /// </summary>
        ConfigSystem
	}


	/// <summary>
	/// �еļ�������
	/// </summary>
	public enum CalculateType
	{
		/// <summary>
		/// �����ü���
		/// </summary>
		NotSet,
		/// <summary>
		/// ��ʼ������
		/// </summary>
		Init,
		/// <summary>
		/// ��̬����
		/// </summary>
		Dynamic
	}

	/// <summary>
	/// ����ִ������
	/// </summary>
	public enum SaveType
	{
		/// <summary>
		/// ͨ���ౣ��
		/// </summary>
		GenerallySave,
		/// <summary>
		/// ת���ౣ��;��һ��������ת������һ������
		/// </summary>
		TransSave,
		/// <summary>
		/// �����,ҳ�����½������ݰ�
		/// </summary>
		SaveAndReload
	}

	/// <summary>
	/// ��ӡ���
	/// </summary>
	public enum PrintType
	{
		/// <summary>
		/// Word���
		/// </summary>
		Word,
		/// <summary>
		/// Excel���
		/// </summary>
		Excel,
		/// <summary>
		/// ��ҳֱ�Ӵ�ӡ
		/// </summary>
		HTML
	}


	#endregion

	#region DictColumn ������
	/// <summary>
	/// ÿ������Ŀ���ж���
	/// </summary>
	public class DictColumn
	{
		public string	ColumnName="";
		public string	DataSrc="";	//�ֵ�������Դ
		public string	TextCol="";	//�ֵ�����ʾ���ֶ�
		public string	ValueCol="";	//�ֶ���ֵ���ֶ�
		public string	FilterItem=string.Empty;	//���ǽ����Ӧ�ֶ���
		public string	FilterData=string.Empty;	//�������ݵ����ݼ�����
		public string	ColType="";
		public bool		Visible=true;

		/// <summary>
		/// �Ƿ�ֻ������
		/// </summary>
		public bool		IsReadOnly=false;
		/// <summary>
		/// �е���ʾ��ʽ
		/// </summary>
		public string   Formate=string.Empty;
		/// <summary>
		/// �����б��ʽ
		/// </summary>
		public string	Expression;
		
		/// <summary>
		/// ��ע,������sum,avg,max,min,count
		/// </summary>
		public string	Footer;
		/// <summary>
		/// ��������
		/// </summary>
		public CalculateType	CalType=CalculateType.NotSet;
		/// <summary>
		/// �Ƿ�ɿ�
		/// </summary>
		public bool		IsNeed=true;
		/// <summary>
		/// ��֤��Ԫ������ĺϷ���
		/// </summary>
		public string	ValidateCell="";
		/// <summary>
		/// �Ƿ�ϲ�
		/// </summary>
		public bool	MergeCell;

		/// <summary>
		/// ��ͼ�������ֵ���Ӹ߶�
		/// </summary>
		public int		BarHeight=50;

		/// <summary>
		/// ��ͼ���е����ӿ��
		/// </summary>
		public int		BarWidth=20;

		/// <summary>
		/// ��ͼ�������ӵ���ɫ
		/// </summary>
		public string	BarColor="red";
		/// <summary>
		/// ��ͼ�������ӵ���ʾ
		/// </summary>
		public string	BarTitle="";
	}
	#endregion

	#region Validity ��У��
	/// <summary>
	/// ��У�鶨��
	/// </summary>
	public class Validity
	{
		public string	Comment="";
		public string	Expression="";
		public string	AlterMsg="";
	}
	#endregion

	#region WorkItem ������Ԫ�ڹ�����Ŀ
	/// <summary>
	/// ������Ԫ�ĵ�����Ŀ
	/// </summary>
	public class WorkItem
	{
		public string	ItemName=string.Empty;
		public NameValueCollection		AliasList=new NameValueCollection();
		public string	DataSrc=string.Empty;
		public string	CountDataSrc=string.Empty;
		public string	DataSrcPage=string.Empty;	//��ҳ����Դ,��ҳ�ؼ���ʾ��ҳ����ʹ��
		public WorkItemType	ItemType=WorkItemType.DetailData;
		public PrintType	PrintType=PrintType.HTML;
		public string	LinkCol=string.Empty;
		public string	ColumnKey=string.Empty;
		public string	TemplateEdit=string.Empty;
		public string	TemplateHead=string.Empty;
		public string	HeadHeight=string.Empty;
		public string	PageSize=string.Empty;
		public string	Group=string.Empty;
		public string	BillType=string.Empty;
		//new fixed
		public string	SumCol=string.Empty;
		public string	Where=string.Empty;
		public DictColumn[]	DictCol;
		public Validity[]	Validities;

		public string	printitem="";
		public string	printname="";
		public string	printtype="";
        public string   printcountmin = "";
		public bool		print=false;
		//����chart��title����ֵ��ʾ���(�ٷֺŻ���ͨ��ֵ)
		public string	ChartTitleLeft="";
		public string	ChartTitleBottom="";
		public string	ChartTitleTop="";
		public string	ChartValueType="";
		public int		ExtentX=80;
		public int		ExtentY=80;
        public string TempId = string.Empty;

		/// <summary>
		/// ��ͼ���ӵļ��
		/// </summary>
		public int		BarStep=8;
		/// <summary>
		/// ��ͼ���ӵ�xƫ����
		/// </summary>
		public int		BarOffsetX=8;
		/// <summary>
		/// ��ͼ���ӵ�yƫ����
		/// </summary>
		public int		BarOffsetY=12;
		public bool		IsImport=false;
        public string   InitFilter = "";
    }
	#endregion

	#region		CommandItem �������Ŀ

	/// <summary>
	/// �������Ŀ
	/// </summary>
	public class CommandItem
	{
		public string	ItemName=string.Empty;
		public string	DataSrc=string.Empty;
		public string	Topic=string.Empty;
		public AppendFunType	FunType=AppendFunType.SqlCmd;
	}

	#endregion

	#region		AppendItem ������

	/// <summary>
	/// �������Ŀ
	/// </summary>
	public class AppendItem
	{
		public string	ItemName=string.Empty;
		public string	DataSrc=string.Empty;

		/// <summary>
		/// ��Ŀ����
		/// </summary>
		public string				UnitGroup=string.Empty;
		/// <summary>
		/// ָ��������ʾ�Ĵ��ڣ�1Ϊ������0���Ϊ��������Ϊ�����壬��ֵ��������
		/// </summary>
		public	string				ShowPos=string.Empty;

		/// <summary>
		/// ָ�����õ�UNITITEM����ֵʱ��������DATAITEM
		/// </summary>
		public string				UnitName=string.Empty;


		/// <summary>
		/// ָ������ִ��ʱ��ITEM
		/// </summary>
		public	string				CmdItem=string.Empty;

		/// <summary>
		/// ��������
		/// </summary>
		public	AppendFunType		FunType=AppendFunType.Browse;

		public  string				PrintItem=string.Empty;
		public  string				PrintTpName=string.Empty;
		public PrintType			PrintType=PrintType.Excel;
        public string               PrintCountMin = "";
		/// <summary>
		/// �������ڶԻ�����
		/// </summary>
		public	string				DialogWidth="800px";

		/// <summary>
		/// �������ڶԻ���߶�
		/// </summary>
		public	string				DialogHeight="500px";
	}
	#endregion

	#region UnitItem ������Ԫ��
	/// <summary>
	/// ������Ԫ��ʵ��
	/// </summary>
	public class UnitItem
	{
		private	string				_unitFile=string.Empty;
		private	XmlDocument			_xmldoc=null;
		private XmlNode				_xmlnode=null;				//��ǰ��_sworkUnitһ�µĽڵ�
        private DataRow _drnode;
        private DataTable dtWorkUnit    = new DataTable();
        private DataTable dtWorkItem    = new DataTable();
        private DataTable dtAppendItem  = new DataTable();
        private DataTable dtComItem     = new DataTable();
        private DataTable dtColumn      = new DataTable();
        private SqlConnection myConnection=new SqlConnection();
		/// <summary>
		/// ��Ԫ����
		/// </summary>
		private	string				_unitName=string.Empty;
		/// <summary>
		/// ��Ԫ����Ŀ�б�
		/// </summary>
		public	WorkItem[]			WorkItemList=new WorkItem[0];
		/// <summary>
		/// �������Ŀ
		/// </summary>
		public CommandItem[]		CommandItemList=new CommandItem[0];

		/// <summary>
		/// ������Ŀ�����б�
		/// </summary>
		public	AppendItem[]		AppendItemList=new AppendItem[0];

		/// <summary>
		/// ��Ԫ����
		/// </summary>
		public	WorkUnitType		UnitType;
        /// <summary>
        /// �Ƿ����󵼺����ɼ�,Ĭ�Ͽ���
        /// </summary>
        public bool IsVisibleNav = true;
		/// <summary>
		/// ����Դ�ļ�,����վ��·��
		/// </summary>
		private	string				_dataSrcFile=string.Empty;
		/// <summary>
		/// ҳ��ģ���ļ�,����վ��·��
		/// </summary>
		public	string				FileEditTp=string.Empty;

        /// <summary>
        /// ��ӡģ���ļ�,����վ��·��
        /// </summary>
        public string               FilePrnTp = string.Empty;

		/// <summary>
		/// �������ͼ��
		/// </summary>
		public	string				BillType=string.Empty;
		/// <summary>
		/// ���淽ʽ
		/// </summary>
		public	SaveType			SaveOPType=SaveType.GenerallySave;
		/// <summary>
		/// ��ӡ���
		/// </summary>
		public  PrintType			PrintType=PrintType.HTML;
		/// <summary>
		/// �ֵ�����Դ�ļ�,����վ��·��
		/// </summary>
		private	string				_dictColSrcFile=string.Empty;
		/// <summary>
		/// ��ݹ���
		/// </summary>
		public	ShortcutFilter		StFilter=null;

		/// <summary>
		/// ���ι���
		/// </summary>
		public	TreeFilter		treeFilter=null;

		#region  ��������
			/// <summary>
			/// ������Ԫ��Ӧ��xmlNode�ڵ�����
			/// </summary>
            public XmlNode UnitNode
            {
                get { return this._xmlnode; }
            }

            public DataTable DtUnit
            {
                get { return this.dtWorkUnit; }
            }

            public DataTable DtWorkItem
            {
                get { return this.dtWorkItem; }
            }

            public DataTable DtAppendItem
            {
                get { return this.dtAppendItem; }
            }

            public DataTable DtComItem
            {
                get { return this.dtComItem; }
            }

            public DataTable DtColumn
            {
                get { return this.dtColumn; }
            }

            /// <summary>
			/// ��ȡ�����õ�Ԫ����
			/// </summary>
			public	string				UnitName
			{
				get{return this._unitName;}
				set
				{
					this._unitName=value;
                    this._drnode["name"]=value;
				}
			}
			/// <summary>
			/// ��ȡ����������Դ�ļ�
			/// </summary>
			public	string				DataSrcFile
			{
				get{return	this._dataSrcFile;}
				set
				{
					this._dataSrcFile=value;
                    if (this._drnode == null) return;
                    this._drnode["datasrcfile"] = value;
				}
			}
			/// <summary>
			/// ��ȡ�������ֵ�����Դ�ļ�,����վ��·��
			/// </summary>
			public	string				DictColSrcFile
			{
				get{return	this._dictColSrcFile;}
				set
				{
					this._dictColSrcFile=value;
					if(null==this._drnode["dictcolfile"])
                        this._drnode["dictcolfile"] = value;
				}
			}
		#endregion

        private void OpenDatabase()
        {
            string strConn = DataAccRes.DefaultDataConnInfo.Value;
            myConnection = new SqlConnection(strConn);
            myConnection.Open();
        }

        public DataTable BindGrid(string strsql)
        {
            SqlDataAdapter da = new SqlDataAdapter(strsql, myConnection);
            if (da == null) return null;
            DataTable dt = new DataTable();
            try
            {
                da.Fill(dt);
                return dt;
            }
            catch
            {
                //leofun.Alert("����ʧ�ܣ����飡", this);
                return null;
            }

        }

        private DataTable bindsubTable(string sqltext,string linkname)
        {
            string itemcode = "";
            DataRow[] drs = this.dtWorkUnit.Select("ntype='" + linkname + "'");
            for (int i = 0; i < drs.Length; i++)
                itemcode = itemcode + "'" + drs[i]["code"] + "',";
            if (drs.Length > 0)
            {
                itemcode = itemcode.Substring(0, itemcode.Length - 1);
                return BindGrid(sqltext.Replace("@itemcode",itemcode));
            }
            else
                return null;
        }

        private void CreateAppTable(string workUnitFile, string workUnitName)
        {
            OpenDatabase();
            string sqltext = "execute [HMSYS].[dbo].[proc_workitem] '" + workUnitFile + "','" + workUnitName + "'";
            this.dtWorkUnit = BindGrid(sqltext);
            if (this.dtWorkUnit == null) return;
            sqltext = 
                "SELECT a.code, b.name, alias, relation, linkcol, dataitem, columnkey, printitem, printname, printtype, printcount, [print], pagesize, countdataitem, "
                +" dataitempage, linkcolm, masteritem, filter, charttype, chartvaluetype, baroffsetx, baroffsety, barstep, charttop, chartbottom, chartleft, extentx, extenty, "
                + " [group], [where], sumcol, import, tpid,gridtemplate"
                +" FROM [HMSYS].[dbo].item a inner join (select name,code from [HMSYS].[dbo].unititem where ntype='Item') b "
                + " on a.code=b.code WHERE a.code in(@itemcode)";

            this.dtWorkItem     = this.bindsubTable(sqltext,"Item");
            sqltext =
                "SELECT a.code, b.name, unitname, funtype, unitgroup, dataitem, cmditem,printitem, printname, printtype, printcount,showpos,linkcol, dialogheight, dialogwidth "
                + "FROM  [HMSYS].[dbo].appenditem a inner join (select name,code from  [HMSYS].[dbo].unititem where ntype='AppendItem') b "
                + "on a.code=b.code  WHERE a.code in(@itemcode)";
            this.dtAppendItem   = this.bindsubTable(sqltext, "AppendItem");

            sqltext =
                "SELECT a.code, b.name, dataitem, funtype, topic "
                + "FROM  [HMSYS].[dbo].commanditem a inner join (select name,code from  [HMSYS].[dbo].unititem where ntype='CommandItem') b "
                + "on a.code=b.code  WHERE a.code in(@itemcode)";
            this.dtComItem = this.bindsubTable(sqltext, "CommandItem");
            if(myConnection.State== ConnectionState.Open)
                myConnection.Close();
        }

        // ͨ��workUnitName�õ����е�����Դdataitem,��ͨ��dataitem�鵽��Ӧ��sqltext,���õ�table
        // workUnitFileԭ���ڴ�ָ�����������ļ�������workitem.xml��Ŀǰworkitem.xml��hmsys���ݿ��������ˣ����Բ��ٿ���
        // ��ʱ��workUnitNameΪ��Ԫ���ƣ�ֻ����hmsys��unititem���ҵ�workUnitName���ϼ���,Ȼ����ȡ��workUnitName��Ԫ����������
		public UnitItem(string	workUnitFile,string	workUnitName)
		{
            if (workUnitName == "") return;
            this._unitFile = workUnitFile;
            CreateAppTable(workUnitFile,workUnitName);
            if (this.dtWorkUnit == null) return;

            DataRow[] _drnodes = this.dtWorkUnit.Select("ntype='UnitItem'");
             if (_drnodes.Length == 0) return;
             this._drnode = _drnodes[0];
			this.SetWorkUnit(workUnitName);

			this.WorkItemList		=	this.GetWorkItemList();
			this.CommandItemList	=	this.GetCommandItemList();
			this.AppendItemList		=	this.GetAppendItemList();
			this.UnitType			=	this.GetWorkUnitType();
			this.DataSrcFile		=	this.GetDataSrcFile();
			this.FileEditTp			=	this.GetFileEditTp();
            this.FilePrnTp          =   this.GetFilePrintTp();
			this.SaveOPType			=	this.GetSaveType();
			this.DictColSrcFile		=	this.GetDictColSrcFile();
			this.StFilter			=	this.GetShortcutFilter();
			this.treeFilter			=	this.GetTreeFilter();
			
			this.BillType			=	this.GetBillType();
            this.PrintType          =   this.GetPrnType();
            this.IsVisibleNav       =   this.GetVisibleNav();
		}


		public UnitItem()
		{
			this._unitFile	=	"";
			this._xmldoc	=	new XmlDocument();
			this._xmldoc.LoadXml("<BusinessSource name='hmsys'><UnitItem name='' templatetype='SPT' datasrcfile='' dictcolfile='' gridtemplate='' billtype='' savetype=''/></BusinessSource>");
			this._xmlnode=this._xmldoc.DocumentElement.SelectSingleNode("UnitItem");
		}

		/// <summary>
		/// ���õ�ǰ�Ĺ�����Ԫ
		/// </summary>
		/// <param name="workUnit">��Ԫ����</param>
		private	void SetWorkUnit(string	workUnit)
		{
            string strXml = "<UnitItem></UnitItem>";
            this._xmldoc = new XmlDocument();
            this._xmldoc.LoadXml(strXml);
            if (null == dtWorkUnit)
                throw (new Exception("ϵͳ��Դû���ṩ�ù��ܵ�Ԫ��" + workUnit));
            CreateXmlNode();
            strXml = "<BusinessSource name='hmsys'>" + this._xmldoc.InnerXml + "</BusinessSource>";
            this._xmldoc.LoadXml(strXml);
            this._xmlnode = this._xmldoc.DocumentElement.SelectSingleNode("UnitItem");
            this.UnitName=workUnit;
		}

        private void CreateXmlNode()
        {
            DataRow[] drUnit= this.dtWorkUnit.Select("ntype='UnitItem'");
            for (int i = 0; i < drUnit[0].Table.Columns.Count; i++)
            {
                if (drUnit[0].Table.Columns[i].ColumnName == "code" || drUnit[0].Table.Columns[i].ColumnName == "text"
                     || drUnit[0].Table.Columns[i].ColumnName == "pcode" || drUnit[0].Table.Columns[i].ColumnName == "ntype")
                    continue;

                if ((drUnit[0][i].ToString() == "") ||
                    (drUnit[0].Table.Columns[i].DataType.FullName == "System.Boolean" && drUnit[0][i].ToString() == "False"))
                        continue;
                this._xmldoc.DocumentElement.Attributes.Append(this._xmldoc.CreateAttribute(drUnit[0].Table.Columns[i].ColumnName));
                this._xmldoc.DocumentElement.Attributes[drUnit[0].Table.Columns[i].ColumnName].Value = drUnit[0][i].ToString();
            }

            XmlNode root = this._xmldoc.DocumentElement;
            DataRow[] drItem;
            if (this.dtWorkItem != null)
            {
                drItem = this.dtWorkItem.Select();
                for (int i = 0; i < drItem.Length; i++)
                {
                    XmlElement elem = this._xmldoc.CreateElement("Item");
                    root.AppendChild(elem);
                    for (int j = 0; j < drItem[i].Table.Columns.Count; j++)
                    {
                        if (drItem[i].Table.Columns[j].ColumnName == "code" || drItem[i].Table.Columns[j].ColumnName == "text"
                             || drItem[i].Table.Columns[j].ColumnName == "pcode" || drItem[i].Table.Columns[j].ColumnName == "ntype")
                            continue;

                        if ((drItem[i][j].ToString() == "") ||
                            (drItem[i].Table.Columns[j].DataType.FullName == "System.Boolean" && drItem[i][j].ToString() == "False"))
                            continue;
                        elem.Attributes.Append(this._xmldoc.CreateAttribute(drItem[i].Table.Columns[j].ColumnName));
                        elem.Attributes[drItem[i].Table.Columns[j].ColumnName].Value = drItem[i][j].ToString();
                    }
                    //����columns�ڵ㼰����
                    if (myConnection.State == ConnectionState.Closed)
                        myConnection.Open();
                    string sqltext = "select name, format, validity, merge, alertexpr, chkcol, expression, datastyle, visible, barheight, barwidth, barcolor, bartitle, dataitem, textcol," +
                          "valuecol, calcol, title, isreadonly, valuefld, href, target, onclick, footer,filterdata,filteritem" +
                        " FROM [HMSYS].[dbo].columns where code='" + drItem[i]["code"].ToString() + "'";
                    this.dtColumn = BindGrid(sqltext);
                    DataRow[] drcols=this.dtColumn.Select();
                    for (int k = 0; k < drcols.Length; k++)
                    {
                        elem = this._xmldoc.CreateElement("Column");
                        for (int n = 0; n < drcols[k].Table.Columns.Count; n++)
                        {
                            if (drcols[k].Table.Columns[n].ColumnName == "code" || drcols[k].Table.Columns[n].ColumnName == "text"
                                 || drcols[k].Table.Columns[n].ColumnName == "pcode" || drcols[k].Table.Columns[n].ColumnName == "ntype")
                                continue;
                            if ((drcols[k][n].ToString() == "") ||
                                (drcols[k].Table.Columns[n].DataType.FullName == "System.Boolean" && drcols[k][n].ToString()=="False"))
                                continue;
                            XmlNode itemnode = root.SelectSingleNode("Item[@name='" + drItem[i]["name"] + "']");
                            elem.Attributes.Append(this._xmldoc.CreateAttribute(drcols[k].Table.Columns[n].ColumnName));
                            string cVal = drcols[k][n].ToString();
                            if (drcols[k].Table.Columns[n].DataType.FullName == "System.Boolean" && drcols[k][n].ToString() == "True")
                                cVal = "1";
                            elem.Attributes[drcols[k].Table.Columns[n].ColumnName].Value = cVal;
                            itemnode.AppendChild(elem);
                        }
                    }
                }
            }

            if (this.dtAppendItem != null)
            {
                drItem = this.dtAppendItem.Select();
                for (int i = 0; i < drItem.Length; i++)
                {
                    XmlElement elem = this._xmldoc.CreateElement("AppendItem");
                    root.AppendChild(elem);
                    for (int j = 0; j < drItem[i].Table.Columns.Count; j++)
                    {
                        if (drItem[i].Table.Columns[j].ColumnName == "code" || drItem[i].Table.Columns[j].ColumnName == "text"
                             || drItem[i].Table.Columns[j].ColumnName == "pcode" || drItem[i].Table.Columns[j].ColumnName == "ntype")
                            continue;

                        if ((drItem[i][j].ToString() == "") ||
                            (drItem[i].Table.Columns[j].DataType.FullName == "System.Boolean" && drItem[i][j].ToString() == "False"))
                            continue;
                        elem.Attributes.Append(this._xmldoc.CreateAttribute(drItem[i].Table.Columns[j].ColumnName));
                        elem.Attributes[drItem[i].Table.Columns[j].ColumnName].Value = drItem[i][j].ToString();
                    }
                }
            }

            if (this.dtComItem != null)
            {
                drItem = this.dtComItem.Select();
                for (int i = 0; i < drItem.Length; i++)
                {
                    XmlElement elem = this._xmldoc.CreateElement("CommandItem");
                    root.AppendChild(elem);
                    for (int j = 0; j < drItem[i].Table.Columns.Count; j++)
                    {
                        if (drItem[i].Table.Columns[j].ColumnName == "code" || drItem[i].Table.Columns[j].ColumnName == "text"
                             || drItem[i].Table.Columns[j].ColumnName == "pcode" || drItem[i].Table.Columns[j].ColumnName == "ntype")
                            continue;

                        if ((drItem[i][j].ToString() == "") ||
                            (drItem[i].Table.Columns[j].DataType.FullName == "System.Boolean" && drItem[i][j].ToString() == "False"))
                            continue;
                        elem.Attributes.Append(this._xmldoc.CreateAttribute(drItem[i].Table.Columns[j].ColumnName));
                        elem.Attributes[drItem[i].Table.Columns[j].ColumnName].Value = drItem[i][j].ToString();
                    }
                }
            }
        }


		#region �ڲ����Ժ���

		/// <summary>
		/// ��ȡҵ��Ԫ����ϸ��Ŀ
		/// </summary>
		/// <returns>������ϸ��Ŀ����</returns>
		private WorkItem[]		GetWorkItemList()
		{
            if (null == this.dtWorkItem) return (new WorkItem[0]);
            DataRow[] itemlist = this.dtWorkItem.Select();
			WorkItem[]	workItemList=new WorkItem[itemlist.Length];

            for (int i = 0; i < itemlist.Length; i++)
            {

                WorkItem item = new WorkItem();
                item.ItemName = itemlist[i]["name"].ToString();
                workItemList[i] = item;
                if (null != itemlist[i]["alias"] && "" != itemlist[i]["alias"].ToString())
                {
                    string[] aliasList = itemlist[i]["alias"].ToString().Split(";".ToCharArray());
                    for (int ialias = 0; ialias < aliasList.Length; ialias++)
                        if ("" != aliasList[ialias] && null != aliasList[ialias])
                            item.AliasList[aliasList[ialias]] = aliasList[ialias];
                }

                #region ��ϵ����

                string strRlt = "";
                if (null == itemlist[i]["relation"] || "" == itemlist[i]["relation"].ToString())
                    strRlt = "G";
                else
                    strRlt = itemlist[i]["relation"].ToString().ToUpper();
                switch (strRlt)
                {
                    case "M":
                        item.ItemType = WorkItemType.MasterData;
                        if (null != _drnode["billtype"])
                            item.BillType = _drnode["billtype"].ToString();
                        break;
                    case "D":
                        item.ItemType = WorkItemType.DetailData;
                        break;
                    case "G":
                        item.ItemType = WorkItemType.GeneralData;
                        break;
                    default:
                        throw (new Exception("��ϸ��Ŀ������������" + this.UnitName));
                }

                #endregion

                #region ��ӡ����

                string strPrintType = "";
                if (null != itemlist[i]["printtype"])
                    strPrintType = itemlist[i]["printtype"].ToString();
                switch (strPrintType)
                {
                    case "WORD":
                        item.PrintType = PrintType.Word;
                        break;
                    case "EXCEL":
                        item.PrintType = PrintType.Excel;
                        break;
                    case "HTML":
                        item.PrintType = PrintType.HTML;
                        break;
                    default:
                        item.PrintType = PrintType.HTML;
                        break;
                }
                if (null != itemlist[i]["printitem"])
                    item.printitem = itemlist[i]["printitem"].ToString();
                if (null != itemlist[i]["printname"])
                    item.printname = itemlist[i]["printname"].ToString();
                if (null != itemlist[i]["printcount"] && null != itemlist[i]["printcount"].ToString())
                    item.printcountmin = itemlist[i]["printcount"].ToString();
                if (itemlist[i]["print"] != null && itemlist[i]["print"].ToString().ToLower() == "true")
                    item.print = true;
                else
                    item.print = false;
                #endregion

                #region Chartͼ������

                string strCharType = "";
                if (null != itemlist[i]["charttype"])
                    strCharType = itemlist[i]["charttype"].ToString().ToLower();
                if (itemlist[i]["chartleft"] != null)
                    item.ChartTitleLeft = itemlist[i]["chartleft"].ToString();
                if (itemlist[i]["chartbottom"] != null)
                    item.ChartTitleBottom = itemlist[i]["chartbottom"].ToString();
                if (itemlist[i]["charttop"] != null)
                    item.ChartTitleTop = itemlist[i]["charttop"].ToString();
                if (itemlist[i]["chartvaluetype"] != null)
                    item.ChartValueType = itemlist[i]["chartvaluetype"].ToString();

                #endregion

                if (null != itemlist[i]["extentx"] && null != itemlist[i]["extentx"].ToString()
                    && "" != itemlist[i]["extentx"].ToString())
                    try
                    {
                        item.ExtentX = int.Parse(itemlist[i]["extentx"].ToString());
                    }
                    catch { }
                if (null != itemlist[i]["extenty"] && null != itemlist[i]["extenty"].ToString()
                    && "" != itemlist[i]["extenty"].ToString())
                    try
                    {
                        item.ExtentY = int.Parse(itemlist[i]["extenty"].ToString());
                    }
                    catch { }

                #region ������Ŀ����Դ����
                if (null != itemlist[i]["dataitem"])
                    item.DataSrc = itemlist[i]["dataitem"].ToString();
                if (itemlist[i]["dataitempage"] != null)
                    item.DataSrcPage = itemlist[i]["dataitempage"].ToString();
                if (itemlist[i]["countdataitem"] != null)
                    item.CountDataSrc = itemlist[i]["countdataitem"].ToString();
                if (null != itemlist[i]["linkcol"])
                    item.LinkCol = itemlist[i]["linkcol"].ToString();
                if (null != itemlist[i]["columnkey"])
                    item.ColumnKey = itemlist[i]["columnkey"].ToString();
                if (null != itemlist[i]["gridtemplate"])
                    item.TemplateEdit = itemlist[i]["gridtemplate"].ToString();
                
                //if (null != itemlist[i]["headtemplate"])
                //    item.TemplateHead = itemlist[i]["headtemplate"].ToString();

                //if (null != itemlist[i]["headheight"])
                //    item.HeadHeight = itemlist[i]["headheight"].ToString();

                if (null != itemlist[i]["pagesize"])
                    item.PageSize = itemlist[i]["pagesize"].ToString();
                if (null != itemlist[i]["group"])
                    item.Group = itemlist[i]["group"].ToString();
                if (null != itemlist[i]["sumcol"])
                    item.SumCol = itemlist[i]["sumcol"].ToString();
                if (null != itemlist[i]["where"])
                    item.Where = itemlist[i]["where"].ToString();
                if (null != itemlist[i]["filter"])
                    item.InitFilter = itemlist[i]["filter"].ToString();
                if (itemlist[i]["import"] != null && itemlist[i]["import"].ToString() == "1")
                    item.IsImport = true;

                if (null != itemlist[i]["tpid"])
                    item.TempId = itemlist[i]["tpid"].ToString();

                #endregion

                #region ��ͼ����������
                if (null != itemlist[i]["barstep"] && "" != itemlist[i]["barstep"].ToString())
                    try
                    {
                        item.BarStep = int.Parse(itemlist[i]["barstep"].ToString());
                    }
                    catch { }
                if (null != itemlist[i]["baroffsetx"] && "" != itemlist[i]["baroffsetx"].ToString())
                    try
                    {
                        item.BarOffsetX = int.Parse(itemlist[i]["baroffsetx"].ToString());
                    }
                    catch { }
                if (null != itemlist[i]["baroffsety"] && "" != itemlist[i]["baroffsety"].ToString())
                    try
                    {
                        item.BarOffsetY = int.Parse(itemlist[i]["baroffsety"].ToString());
                    }
                    catch { }
                #endregion


                //ȡ��Ӧ��������
                //XmlNodeList colnodeList = itemlist[i].SelectNodes("Column");
                OpenDatabase();
                string sqltext = "select name, format, validity, merge, alertexpr, chkcol, expression, datastyle, visible, barheight, barwidth, barcolor, bartitle, dataitem, textcol,"+
                      "valuecol, calcol, title, isreadonly, valuefld, href, target, onclick, footer,filterdata,filteritem" +
                    " FROM [HMSYS].[dbo].columns where code='" + itemlist[i]["code"].ToString() + "'";

                this.dtColumn = BindGrid(sqltext);
                if (this.myConnection.State == ConnectionState.Open)
                    this.myConnection.Close();
                if (dtColumn == null) continue;
                DataRow[] colnodeList = dtColumn.Select();
                item.DictCol = new DictColumn[colnodeList.Length];
                for (int j = 0; j < colnodeList.Length; j++)
                {
                    item.DictCol[j] = new DictColumn();

                    #region �ֵ�������Դ

                    item.DictCol[j].ColumnName = colnodeList[j]["name"].ToString();
                    if (null != colnodeList[j]["dataitem"] && null != colnodeList[j]["textcol"]
                            && null != colnodeList[j]["valuecol"])
                    {
                        item.DictCol[j].DataSrc = colnodeList[j]["dataitem"].ToString();
                        item.DictCol[j].TextCol = colnodeList[j]["textcol"].ToString();
                        item.DictCol[j].ValueCol = colnodeList[j]["valuecol"].ToString();
                    }
                    if (null != colnodeList[j]["filteritem"] && null != colnodeList[j]["filteritem"])
                        item.DictCol[j].FilterItem = colnodeList[j]["filteritem"].ToString();
                    if (null != colnodeList[j]["filterdata"])
                        item.DictCol[j].FilterData = colnodeList[j]["filterdata"].ToString();
                    #endregion

                    #region �м���,У��,�༭,��ʽ,��������
                    //������,���Ƿ����,�еĵ�Ԫ����֤
                    if (null != colnodeList[j]["expression"])
                        item.DictCol[j].Expression = colnodeList[j]["expression"].ToString();
                    if (null != colnodeList[j]["validity"])
                        item.DictCol[j].ValidateCell = colnodeList[j]["validity"].ToString();

                    if (null != colnodeList[j]["calcol"] && "1" == colnodeList[j]["calcol"].ToString())
                        item.DictCol[j].CalType = CalculateType.Dynamic;
                    else
                        item.DictCol[j].CalType = CalculateType.Init;
                    //��ע
                    if (null != colnodeList[j]["footer"])
                        item.DictCol[j].Footer = colnodeList[j]["footer"].ToString();
                    // 0 - ����������, 1- ��ʾ����Ϊ��
                    if (null != colnodeList[j]["chkcol"] && "1" == colnodeList[j]["chkcol"].ToString())
                        item.DictCol[j].IsNeed = true;
                    else
                        item.DictCol[j].IsNeed = false;

                    if (null != colnodeList[j]["merge"] && "1" == colnodeList[j]["merge"].ToString())
                        item.DictCol[j].MergeCell = true;
                    else
                        item.DictCol[j].MergeCell = false;

                    if (null != colnodeList[j]["isreadonly"] && "1" == colnodeList[j]["isreadonly"].ToString())
                        item.DictCol[j].IsReadOnly = true;
                    else
                        item.DictCol[j].IsReadOnly = false;
                    if (null != colnodeList[j]["format"] && string.Empty != colnodeList[j]["format"].ToString() &&
                        "" != colnodeList[j]["format"].ToString().ToLower())
                        item.DictCol[j].Formate = colnodeList[j]["format"].ToString();

                    //1 - ���ɼ���0����Ϊ������ʾ 
                    if (null != colnodeList[j]["visible"] && "1" == colnodeList[j]["visible"].ToString())
                        item.DictCol[j].Visible = false;
                    else
                        item.DictCol[j].Visible = true;
                    #endregion

                    #region ��ͼ����
                    if (null != colnodeList[j]["barheight"] && "" != colnodeList[j]["barheight"].ToString())
                        try
                        {
                            item.DictCol[j].BarHeight = int.Parse(colnodeList[i]["barheight"].ToString());
                        }
                        catch { }
                    if (null != colnodeList[j]["barwidth"] && "" != colnodeList[j]["barwidth"].ToString())
                        try
                        {
                            item.DictCol[j].BarWidth = int.Parse(colnodeList[i]["barwidth"].ToString());
                        }
                        catch { }
                    if (null != colnodeList[j]["barcolor"] && "" != colnodeList[j]["barcolor"].ToString())
                        try
                        {
                            item.DictCol[j].BarColor = colnodeList[i]["barcolor"].ToString();
                        }
                        catch { }
                    if (null != colnodeList[j]["bartitle"] && "" != colnodeList[j]["bartitle"].ToString())
                        try
                        {
                            item.DictCol[j].BarTitle = colnodeList[i]["bartitle"].ToString();
                        }
                        catch { }
                    #endregion

                }

                //������У��
                //XmlNodeList valiNodeList = itemlist[i].SelectNodes("Validity");
                //item.Validities = new Validity[valiNodeList.Count];
                //for (int j = 0; j < valiNodeList.Count; j++)
                //{
                //    item.Validities[j] = new Validity();
                //    if (null != valiNodeList[j].Attributes["comment"])
                //        item.Validities[j].Comment = valiNodeList[j].Attributes["comment"].Value;
                //    if (null != valiNodeList[j].Attributes["expression"])
                //        item.Validities[j].Expression = valiNodeList[j].Attributes["expression"].Value;
                //    if (null != valiNodeList[j].Attributes["alertmsg"])
                //        item.Validities[j].AlterMsg = valiNodeList[j].Attributes["alertmsg"].Value;
                //}

            }//for(int i=0;i<itemlist.Count;i++)
			return workItemList;
		}


		/// <summary>
		/// ��ȡҵ��Ԫ�ĸ����ӹ��ܵ�Ԫ
		/// </summary>
		/// <returns>������ϸ��Ŀ����</returns>
		private AppendItem[]		GetAppendItemList()
		{
            if (null == this.dtAppendItem) return new AppendItem[0];
            DataRow[] itemlist = this.dtAppendItem.Select();

			AppendItem[]	appendItemList=new AppendItem[itemlist.Length];

			for(int i=0;i<itemlist.Length;i++)
			{
				appendItemList[i]=new AppendItem();
				appendItemList[i].ItemName	=	itemlist[i]["name"].ToString();

                if(null!=itemlist[i]["dataitem"])
				    appendItemList[i].DataSrc =	itemlist[i]["dataitem"].ToString();
				
				if(null!=itemlist[i]["cmditem"] && null!=itemlist[i]["cmditem"].ToString())
					appendItemList[i].CmdItem =	itemlist[i]["cmditem"].ToString();

				if(null==itemlist[i]["funtype"] || ""==itemlist[i]["funtype"].ToString()
					|| "browse"==itemlist[i]["funtype"].ToString().ToLower())
					appendItemList[i].FunType=AppendFunType.Browse;
				else if ("import"==itemlist[i]["funtype"].ToString().ToLower() 
                    || "checkin"==itemlist[i]["funtype"].ToString().ToLower()
                    || "importpost" == itemlist[i]["funtype"].ToString().ToLower())
					appendItemList[i].FunType=AppendFunType.Import;
				else if("report"==itemlist[i]["funtype"].ToString().ToLower())
					appendItemList[i].FunType=AppendFunType.Report;
				else
					appendItemList[i].FunType=AppendFunType.Browse;
				
				if(null!=itemlist[i]["unitgroup"] && null!=itemlist[i]["unitgroup"].ToString())
					appendItemList[i].UnitGroup	=	itemlist[i]["unitgroup"].ToString();
				
				if(null!=itemlist[i]["unitname"] && null!=itemlist[i]["unitname"].ToString())
					appendItemList[i].UnitName	=	itemlist[i]["unitname"].ToString();

                if(null!=itemlist[i]["showpos"])
                    appendItemList[i].ShowPos = itemlist[i]["showpos"].ToString();

				if(null!=itemlist[i]["dialogheight"] && null!=itemlist[i]["dialogheight"].ToString())
					appendItemList[i].DialogHeight	=	itemlist[i]["dialogheight"].ToString();

				if(null!=itemlist[i]["dialogwidth"] && null!=itemlist[i]["dialogwidth"].ToString())
					appendItemList[i].DialogWidth	=	itemlist[i]["dialogwidth"].ToString();
				
				if(null!=itemlist[i]["printitem"] && null!=itemlist[i]["printitem"].ToString())
					appendItemList[i].PrintItem	=	itemlist[i]["printitem"].ToString();
				if(null!=itemlist[i]["printname"] && null!=itemlist[i]["printname"].ToString())
					appendItemList[i].PrintTpName	=	itemlist[i]["printname"].ToString();
                if (null != itemlist[i]["printcount"] && null != itemlist[i]["printcount"].ToString())
                    appendItemList[i].PrintCountMin = itemlist[i]["printcount"].ToString();
				
                if(null!=itemlist[i]["printtype"] && null!=itemlist[i]["printtype"].ToString()
					&& "WORD"==itemlist[i]["printtype"].ToString().ToUpper())
					appendItemList[i].PrintType	=	PrintType.Word;

			}
			return appendItemList;
		}


		/// <summary>
		/// ��ȡҵ��Ԫ�ĸ����ӹ��ܵ�Ԫ
		/// </summary>
		/// <returns>������ϸ��Ŀ����</returns>
		public AppendItem		GetAppendItem(string	itemName)
		{
			AppendItem		appendItem=null;
			for(int i=0;i<this.AppendItemList.Length;i++)
			{
				appendItem=this.AppendItemList[i];
				if(itemName.ToLower()==appendItem.ItemName.ToLower())
					return appendItem;
			}
			return appendItem;
		}


		/// <summary>
		/// ��ȡָ����Ԫ���������б�
		/// </summary>
		/// <returns>����������Ŀ����</returns>
		private CommandItem[]	GetCommandItemList()
		{
            if (null == this.dtComItem) return new CommandItem[0];
            DataRow[] itemlist = this.dtComItem.Select();
			CommandItem[]	cmdItemList=new CommandItem[itemlist.Length];

			for(int i=0;i<itemlist.Length;i++)
			{
				cmdItemList[i]=new CommandItem();
				cmdItemList[i].ItemName=itemlist[i]["name"].ToString();
                if(null!=itemlist[i]["dataitem"])
				    cmdItemList[i].DataSrc=itemlist[i]["dataitem"].ToString();
                if(null!=itemlist[i]["topic"])
				    cmdItemList[i].Topic=itemlist[i]["topic"].ToString();
				if(null==itemlist[i]["funtype"] || ""==itemlist[i]["funtype"].ToString()
					|| "sqlcmd"==itemlist[i]["funtype"].ToString().ToLower())
					cmdItemList[i].FunType=AppendFunType.SqlCmd;
				else if ("xmltodb"==itemlist[i]["funtype"].ToString().ToLower())
					cmdItemList[i].FunType=AppendFunType.ImportFromExecel;
                else if ("sqlcmdlist" == itemlist[i]["funtype"].ToString().ToLower())
                    cmdItemList[i].FunType = AppendFunType.SqlCmdList;
                else
					cmdItemList[i].FunType=AppendFunType.SqlCmd;
			}
			return cmdItemList;
		}


		/// <summary>
		/// ��ȡҵ��Ԫ����
		/// </summary>
		/// <returns></returns>
		private WorkUnitType		GetWorkUnitType()
		{
			WorkUnitType	workType=WorkUnitType.OtherItem;
			if(null==this.dtWorkUnit)		return workType;
            string strTPType="";
            if (null != _drnode["templatetype"])
                strTPType = _drnode["templatetype"].ToString().ToUpper();
			switch(strTPType)
			{

                case "SIMP":
                    workType = WorkUnitType.SimpleBank;
                    break;
                case "SIMPL":
                    workType = WorkUnitType.SimpleBankLeft;
                    break;
                case "R":
					workType=WorkUnitType.ReportItem;
					break;
                case "VCTP":
                    workType = WorkUnitType.VmlChartTp;
                    break;
                case "UP":
                    workType = WorkUnitType.Updatekey;
                    break;
                case "NAV":
                    workType = WorkUnitType.NavPage;
                    break;
                case "VML":
                    workType = WorkUnitType.VmlMapPage;
                    break;

                case "Ȩ�޹���":
                    workType = WorkUnitType.SysOptRight;
                    break;
                case "��֯����":
                    workType = WorkUnitType.SysOrganize;
                    break;
                case "���������":
                    workType = WorkUnitType.SysAssign;
                    break;
                case "����������":
                    workType = WorkUnitType.SysOptions;
                    break;
                case "���������":
                    workType = WorkUnitType.SysItem;
                    break;
                default:
					workType=WorkUnitType.OtherItem;
					break;
			}
			return	workType;
		}


		/// <summary>
		/// ��ȡҵ��Ԫ����
		/// </summary>
		/// <returns></returns>
		private string			GetUnitGroup()
		{
            if (null == _drnode || null == this._drnode["unitgroup"])
				return string.Empty;
            return this._drnode["unitgroup"].ToString();

		}

		/// <summary>
		/// ��ȡҵ�����ݵ�������Դ�ļ�,����վ��·��
		/// </summary>
		/// <returns></returns>
		private string	GetDataSrcFile()
		{
            if (null == this._drnode || null == this._drnode["datasrcfile"])
				return string.Empty;
            return this._drnode["datasrcfile"].ToString();
		}


		/// <summary>
		/// ��ȡ��Ԫ������༭ģ��,���Ӧ�����Ŀ����Դ
		/// </summary>
		/// <returns></returns>
		private string	GetFileEditTp()
		{
            if (null == this._drnode || null == this._drnode["gridtemplate"])		
				return string.Empty;
            return this._drnode["gridtemplate"].ToString();
		}

        /// <summary>
        /// ��ȡ��Ԫ�Ĵ�ӡģ��,���Ӧ�����Ŀ����Դ
        /// </summary>
        /// <returns></returns>
        private string GetFilePrintTp()
        {
            if (null == this._drnode || null == this._drnode["printtemplate"])
                return string.Empty;
            return this._drnode["printtemplate"].ToString();
        }


		/// <summary>
		/// ��ȡ��Ԫ�ı�������;
		/// </summary>
		/// <returns></returns>
		private  SaveType		GetSaveType()
		{
            if (null == this._drnode) return SaveType.GenerallySave;
			string	saveType="";
            if (null != this._drnode["savetype"] && null != this._drnode["savetype"].ToString()
                && "" != this._drnode["savetype"].ToString())
                saveType = this._drnode["savetype"].ToString();
			if("trans"==saveType.ToLower())
				return SaveType.TransSave;
			else if("saverefresh"==saveType.ToLower())
				return SaveType.SaveAndReload;
			else
				return SaveType.GenerallySave;
		}

		/// <summary>
		/// ��ȡ�ֵ��е�������Դ�ļ�,����վ��·��
		/// </summary>
		/// <returns></returns>
		private string	GetDictColSrcFile()
		{
            if (null == this._xmlnode || null == this._drnode["dictcolfile"]
                || null == this._drnode["dictcolfile"].ToString()
                || "" == this._drnode["dictcolfile"].ToString())
				return string.Empty;
            return this._drnode["dictcolfile"].ToString();
		}


		/// <summary>
		/// ���ٹ���
		/// </summary>
		/// <returns></returns>
		private ShortcutFilter	GetShortcutFilter()
		{
			ShortcutFilter	shFilter=new ShortcutFilter();
			if(null==this._xmlnode)		return shFilter;
			XmlNode		xmlnode=this._xmlnode.SelectSingleNode("ShortcutFilter");
			if(null==xmlnode)	return shFilter;
            if(null!=xmlnode.Attributes["linkcol"])
			    shFilter.ColumnName = xmlnode.Attributes["linkcol"].Value;
            if (null != xmlnode.Attributes["dataitem"] && null != xmlnode.Attributes["valuecol"] 
                && null != xmlnode.Attributes["textcol"])
            {
                shFilter.DataSrc = xmlnode.Attributes["dataitem"].Value;
                shFilter.TxtCol = xmlnode.Attributes["textcol"].Value;
                shFilter.ValueCol = xmlnode.Attributes["valuecol"].Value;
            }
            if(null!=xmlnode.Attributes["coltype"])
			    shFilter.ColType = xmlnode.Attributes["coltype"].Value;
			if(shFilter.ColumnName=="")
			{
				if(shFilter.TxtCol!=""){shFilter.ColumnName=shFilter.TxtCol;}
				else{shFilter.ColumnName=shFilter.ValueCol;}
			}

			if(shFilter.ColType == "")
			{
				shFilter.ColType="char";
			}
			return shFilter;
		}

		/// <summary>
		/// ���ι���
		/// </summary>
		/// <returns></returns>
		private TreeFilter	GetTreeFilter()
		{
			TreeFilter	treeFilter=new TreeFilter();
			if(null==this._xmlnode)		return treeFilter;
			XmlNode		xmlnode=this._xmlnode.SelectSingleNode("TreeFilter");
			
			if(null==xmlnode)	return treeFilter;
            
            #region  ����Դ����
            
            if (null != xmlnode.Attributes["dataitem"])
            {
                treeFilter.DataSrc = xmlnode.Attributes["dataitem"].Value;
                if(null!=xmlnode.Attributes["linkcol"])
                    treeFilter.ColumnName = xmlnode.Attributes["linkcol"].Value;
                if(null!=xmlnode.Attributes["level"])
                    treeFilter.Level = xmlnode.Attributes["level"].Value;
            }
            
            #endregion

            #region  ������ʾ����
            if (xmlnode.Attributes["alert"] != null)
                treeFilter.Alertmsg = xmlnode.Attributes["alert"].Value;
            if (xmlnode.Attributes["gounititem"] != null)
                treeFilter.GoUnitItem = xmlnode.Attributes["gounititem"].Value;

            if (xmlnode.Attributes["treetype"] != null)
                treeFilter.TreeType = xmlnode.Attributes["treetype"].Value;

            if (xmlnode.Attributes["readtype"] != null)
                treeFilter.ReadType = xmlnode.Attributes["readtype"].Value;

            if (xmlnode.Attributes["treefun"] != null)
                treeFilter.TreeFun = xmlnode.Attributes["treefun"].Value;

            if (xmlnode.Attributes["hasall"] != null)
                treeFilter.HasAll = xmlnode.Attributes["hasall"].Value;

            if (xmlnode.Attributes["isfirst"] != null
                    && ("1" == xmlnode.Attributes["isfirst"].Value || "true"==xmlnode.Attributes["isfirst"].Value.ToLower()))
                treeFilter.IsFirst = true;
            else
                treeFilter.IsFirst = false;

            if (xmlnode.Attributes["firsthide"] != null
                 && ("1" == xmlnode.Attributes["firsthide"].Value || xmlnode.Attributes["firsthide"].Value.ToLower() == "true"))
                treeFilter.FirstHide = true;
            else
                treeFilter.FirstHide = false;

            if (xmlnode.Attributes["refreshed"] != null
                    && ("1" == xmlnode.Attributes["refreshed"].Value || xmlnode.Attributes["refreshed"].Value.ToLower() == "true"))
                treeFilter.EditFreshed = true;
            else
                treeFilter.EditFreshed = false;

            if (xmlnode.Attributes["tree2edit"] != null
                    && ("1" == xmlnode.Attributes["tree2edit"].Value || xmlnode.Attributes["tree2edit"].Value.ToLower() == "true"))
                treeFilter.TreeToEdit = true;
            else
                treeFilter.TreeToEdit = false;

            if (xmlnode.Attributes["tree2edit"] != null) 
                treeFilter.TreeToEditFields = xmlnode.Attributes["tree2edit"].Value;
            #endregion
            
            return treeFilter;
		}


		/// <summary>
		/// ��Ԫ��������
		/// </summary>
		/// <returns></returns>
		private string	GetBillType()
		{
            if (null == this._drnode || null == this._drnode["billtype"]
                || "" == this._drnode["billtype"].ToString())
				return string.Empty;
            return this._drnode["billtype"].ToString();
		}

        /// <summary>
        /// ��Ԫ��������
        /// </summary>
        /// <returns></returns>
        private PrintType GetPrnType()
        {
            PrintType printtype = PrintType.HTML;
            if (null == this._drnode) return printtype;


            string strPrintType = "";
            if (null == this._drnode || null == _drnode["printtype"]
               || "" == _drnode["printtype"].ToString()) strPrintType = "HTML";
            else
                strPrintType = _drnode["printtype"].ToString();
            switch (strPrintType.ToUpper())
            {
                case "WORD":
                    printtype = PrintType.Word;
                    break;
                case "EXCEL":
                    printtype = PrintType.Excel;
                    break;
                case "HTML":
                    printtype = PrintType.HTML;
                    break;
                default:
                    printtype = PrintType.HTML;
                    break;
            }
            return printtype;
        }


        /// <summary>
        /// ���ܵ�Ԫ�Ƿ����
        /// </summary>
        /// <returns>���ز���ֵ,Ĭ��True</returns>
        private bool GetVisibleNav()
        {
            if (IfExistCloumnName(this._drnode, "visiblenav") == false) return false;
            if (null != this._drnode && null != this._drnode["visiblenav"]
                && ("false" == this._drnode["visiblenav"].ToString().ToLower() || "0" == this._drnode["visiblenav"].ToString()))
                return false;
            return true;
        }
        #region �Զ���˽�к���
        //_drnode._columns[0].ColumnName
        private bool IfExistCloumnName(DataRow dr,string colname)
        {
            for (int i = 0; i < dr.Table.Columns.Count; i++)
                if (dr.Table.Columns[i].ColumnName == colname)
                {
                    return true;
                    break;
                }
            return false;
        }
        #endregion

        #endregion

    }

    #endregion


    #region ShortcutFilter ��ݹ���
    /// <summary>
    /// ��ݹ���
    /// </summary>
    public class ShortcutFilter
	{
		public string	ColumnName="";
		public string	DataSrc="";
		public string	TxtCol="";
		public string	ValueCol="";
		public string	ColType="";
	}
	#endregion

	#region TreeFilter ���ι���
	/// <summary>
	/// ��ݹ���
	/// </summary>
	public class TreeFilter
	{
		public string	ColumnName="";
		public string	DataSrc="";
		public string	Level="";
		public bool		IsFirst=true;
		public string	Alertmsg="";
		public string	GoUnitItem="";
		public string	TreeType="";
		public string	TreeFun="filter";
		public string	HasAll="";
		public bool 	FirstHide=false; //��ʼʱ�Ƿ�����
		//leo fixed 20050730
		public bool 	EditFreshed = false; //�༭���ĺ���ͬ����������(ture or false)
		public bool     TreeToEdit  = false; //�������ں��Ƿ������ڵ���Ϣ�༭������Ϣ(ture or false), �ڳ�ʼ����ʱ����������ã�ֱ�������޸�����
		public string     TreeToEditFields  = ""; //��treetoedit=trueʱ��������Ҫ�����и�ֵ���ֶ����ƣ��ԡ������ָΪ��ʱ����ȱʡȡ��������tag��text��Ϊ�ֶ���
        public string ReadType = ""; //�����ȡ���ķ�ʽ�����ݹ顱��ʾ�Եݹ�ķ�ʽ���γ���������Ϊƽ����ʽ
    }
	#endregion


}
