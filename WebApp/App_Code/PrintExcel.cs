#region �汾˵��

/*
 * �������ݣ�   Excel����
 *
 * ��    �ߣ�   ���ٲ�
 *
 * �� �� �ߣ�   �����Ŀ��
 *
 * ��    �ڣ�   2008-08-29
 */

#endregion

using System;
using System.IO;
using System.Xml;
using System.Data;
using System.Web;
using System.Web.Configuration;
using System.Collections.Generic;
using System.Text.RegularExpressions;


/// <summary>
/// ʹ��Excel��Xmlģ���ӡ����
/// </summary>
public class PrintExcel
{
    #region �ڲ�������
    /// <summary>
    /// �����ӡ������Ϣ
    /// </summary>
    private class PrintInfo
    {
        
        #region �����������
        
        private Dictionary<string, object> list = new Dictionary<string, object>();

        /// <summary>
        /// ��ȡ�����ô�ӡ��������
        /// </summary>
        public PrintType RegionType
        {
            get
            {
                if (this.list.ContainsKey("RegionType"))
                    return (PrintType)this.list["RegionType"];
                else
                    return PrintType.Data;
            }
            set
            {
                if (this.list.ContainsKey("RegionType"))
                    this.list["RegionType"] = value;
                else
                    this.list.Add("RegionType", value);
            }
        }

        /// <summary>
        /// ��ȡ����������Դ����
        /// </summary>
        public string DbName
        {
            get
            {
                if (this.list.ContainsKey("DbName"))
                    return Convert.ToString(this.list["DbName"]);
                else
                    return "";
            }
            set
            {
                if (this.list.ContainsKey("DbName"))
                    this.list["DbName"] = value;
                else
                    this.list.Add("DbName", value);
            }
        }

        /// <summary>
        /// ��ȡ����������Դ����
        /// </summary>
        public string AliasName
        {
            get
            {
                if (this.list.ContainsKey("AliasName"))
                    return Convert.ToString(this.list["AliasName"]);
                else
                    return "";
            }
            set
            {
                if (this.list.ContainsKey("AliasName"))
                    this.list["AliasName"] = value;
                else
                    this.list.Add("AliasName", value);
            }
        }

        /// <summary>
        /// ��ȡ������ҳ�ڷ�Χ,����:A3:G16
        /// </summary>
        public string PageBound
        {
            get
            {
                if (this.list.ContainsKey("PageBound"))
                    return Convert.ToString(this.list["PageBound"]);
                else
                    return "";
            }
            set
            {
                if (this.list.ContainsKey("PageBound"))
                    this.list["PageBound"] = value;
                else
                    this.list.Add("PageBound", value);
                this.list.Remove("PgBound");
            }
        }

        /// <summary>
        /// ҳ�ڷ�Χ
        /// </summary>
        public Bound PgBound
        {
            get
            {
                if (this.list.ContainsKey("PgBound"))
                    return (Bound)this.list["PgBound"];
                Bound b = Bound.ParseBound(this.PageBound);
                if (null == b) return null;
                this.list.Add("PgBound", b);
                return b;
            }
        }

        /// <summary>
        /// ��ȡ�����õ��з�Χ,����:A3:G16
        /// </summary>
        public string RowBound
        {
            get
            {
                if (this.list.ContainsKey("RowBound"))
                    return Convert.ToString(this.list["RowBound"]);
                else
                    return "";
            }
            set
            {
                if (this.list.ContainsKey("RowBound"))
                    this.list["RowBound"] = value;
                else
                    this.list.Add("RowBound", value);
                this.list.Remove("RwBound");
            }
        }

        /// <summary>
        /// ��ȡ���з�Χ
        /// </summary>
        public Bound RwBound
        {
            get
            {
                if (this.list.ContainsKey("RwBound"))
                    return (Bound)this.list["RwBound"];
                Bound b = Bound.ParseBound(this.RowBound);
                if (null == b) return null;
                this.list.Add("RwBound", b);
                return b;
            }
        }

        /// <summary>
        /// ��ȡ�����÷�ҳ���:ҳ|��
        /// ҳ�������ҳ�����ǰ��,�����������Ӽ����,�����Ƹ������
        /// </summary>
        public TrunPageModel TrunPageType
        {
            get
            {
                if (this.list.ContainsKey("TrunPageType"))
                    return (TrunPageModel)this.list["TrunPageType"];
                else
                    return TrunPageModel.PageMod;
            }
            set
            {
                if (this.list.ContainsKey("TrunPageType"))
                    this.list["TrunPageType"] = value;
                else
                    this.list.Add("TrunPageType", value);
            }
        }

        /// <summary>
        /// ��ȡ������������:����ģʽ���ʱ,ͬ���ӡ�����Ϊһ�����������,Ϊ��һ������������ṩ����ο�����
        /// ������Ϊ������������Ϊ������
        /// </summary>
        public string GroupName
        {
            get
            {
                if (this.list.ContainsKey("GroupName"))
                    return Convert.ToString(this.list["GroupName"]);
                else
                    return this.DbName;
            }
            set
            {
                if (this.list.ContainsKey("GroupName"))
                    this.list["GroupName"] = value;
                else
                    this.list.Add("GroupName", value);
            }
        }

        /// <summary>
        /// ��ȡ�������������ʽ:��|��
        /// �������ʽ���Ⱥ���ݻ����ݺ��
        /// </summary>
        public OutRowModel OutRowType
        {
            get
            {
                if (this.list.ContainsKey("OutRowType"))
                    return (OutRowModel)this.list["OutRowType"];
                else
                    return OutRowModel.VeriNextHori;
            }
            set
            {
                if (this.list.ContainsKey("OutRowType"))
                    this.list["OutRowType"] = value;
                else
                    this.list.Add("OutRowType", value);
            }
        }

        #endregion

        /// <summary>
        /// ��ȡ��ӡ�����ʼ������
        /// </summary>
        /// <param name="printInfo"></param>
        /// <returns></returns>
        public static PrintInfo SerialFromString(string printInfo)
        {
            if (string.IsNullOrEmpty(printInfo))
                return null;
            string[] ptList = printInfo.Split("\n".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            if (ptList.Length < 1)
                return null;
            PrintInfo pinfo = new PrintInfo();
            foreach (string strPt in ptList)
            {
                if (!strPt.Contains("="))
                    continue;
                string name = strPt.Substring(0,strPt.IndexOf("=")).Trim();
                string value = strPt.Substring(strPt.IndexOf("=") + 1).Trim();
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(value))
                    continue;
                switch (name)
                {
                    case "����":
                        if ("�ı�" == value)
                            pinfo.RegionType = PrintType.Text;
                        else
                            pinfo.RegionType = PrintType.Data;
                        break;
                    case "���ݱ�":
                        pinfo.DbName = value;
                        break;
                    case "����":
                        pinfo.AliasName = value;
                        break;
                    case "����":
                        pinfo.GroupName = value;
                        break;
                    case "ҳ��Χ":
                        Regex r = new Regex("[A-Z]+[0-9]+:[A-Z]+[0-9]+");
                        if (!r.IsMatch(value.ToUpper()))
                            continue;
                        Match m = r.Match(value.ToUpper());
                        pinfo.PageBound = value.ToUpper();
                        break;
                    case "�з�Χ":
                        r = new Regex("[A-Z]+[0-9]+:[A-Z]+[0-9]+");
                        if (!r.IsMatch(value.ToUpper()))
                            continue;
                        m = r.Match(value.ToUpper());
                        pinfo.RowBound = value.ToUpper();
                        break;
                    case "�����ʽ":
                        if ("��" == value)
                            pinfo.OutRowType = OutRowModel.VeriNextHori;
                        else
                            pinfo.OutRowType = OutRowModel.HoriNextVeri;
                        break;
                    case "��ҳģʽ":
                        if ("��" == value)
                            pinfo.TrunPageType = TrunPageModel.StreamRightMod;
                        else if ("��" == value)
                            pinfo.TrunPageType = TrunPageModel.StreamBottomMod;
                        else if ("��ҳ" == value)
                            pinfo.TrunPageType = TrunPageModel.StreamPageMod;
                        else
                            pinfo.TrunPageType = TrunPageModel.PageMod;
                        break;
                }//switch (name)
            }//foreach (string strPt in ptList)
            return pinfo;
        }
        
    };

    private class Bound
    {
        public int Left = 0;
        public int Top = 0;
        public int Right = 0;
        public int Bottom = 0;

        public static Bound ParseBound(string    strBound)
        {
            if (string.IsNullOrEmpty(strBound) || !strBound.Contains(":"))
                return null;

            string[] sbound = strBound.Split(":".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            if (sbound.Length < 2) return null;
            //srcbound��Χȷ�����з�Χ
            Regex rCol = new Regex(@"[A-Z]+");
            Regex rRow = new Regex(@"[0-9]+");
            if (!rCol.IsMatch(sbound[0]) || !rCol.IsMatch(sbound[1]) || !rRow.IsMatch(sbound[0]) || !rRow.IsMatch(sbound[1]))
                return null;
            Bound bound = new Bound();
            char[] colIndex = rCol.Match(sbound[0]).Value.ToCharArray();
            int intA = Convert.ToInt16('A');
            int index = 0;
            for (int i = 0; i < colIndex.Length; i++)
                index += (Convert.ToInt16(colIndex[i]) - intA + 1) * Convert.ToInt16(Math.Pow(26, i));
            bound.Left = index;

            colIndex = rCol.Match(sbound[1]).Value.ToCharArray();
            index = 0;
            for (int i = 0; i < colIndex.Length; i++)
                index += (Convert.ToInt16(colIndex[i]) - intA + 1) * Convert.ToInt16(Math.Pow(26, i));
            bound.Right = index;

            bound.Top = Convert.ToInt16(rRow.Match(sbound[0]).Value);
            bound.Bottom = Convert.ToInt16(rRow.Match(sbound[1]).Value);
            return bound;
        }

    }

    /// <summary>
    /// ��ӡ��������:�ı�/����
    /// </summary>
    private enum PrintType
    {
        /// <summary>
        /// �ı���,ֱ�Ӹ���û������
        /// </summary>
        Text,
        /// <summary>
        /// ������,ʹ�����ݱ��������
        /// </summary>
        Data
    }

    /// <summary>
    /// �м�¼���ģʽ:����|�Ⱥ᣻��¼����ķ���˳��
    /// </summary>
    private enum OutRowModel
    {
        /// <summary>
        /// �������ٺ���
        /// </summary>
        VeriNextHori,
        /// <summary>
        /// �Ⱥ���������
        /// </summary>
        HoriNextVeri
    }
    /// <summary>
    /// ҳ��¼��ҳģʽ:ҳģʽ|��ģʽ|��ģʽ��
    /// ҳģʽ��ӡ���̶��������
    /// ��ģʽ������: ��ģʽ��ӡ������ǰһ�����������λ�ô�ӡ,��ģʽ��ӡ������ǰһ��������ȵ�λ�ô�ӡ
    /// </summary>
    private enum TrunPageModel
    {
        /// <summary>
        /// ҳģʽ:��ӡ���̶��̶��������,��ҳʱ���������ͬ
        /// </summary>
        PageMod,
        /// <summary>
        /// ��ģʽ:��ӡ������˳�����,���Ƚ�����λ����ε�λ��
        /// </summary>
        StreamRightMod,
        /// <summary>
        /// ��ģʽ:��ӡ������˳�����,���Ƚ����λ�������λ��
        /// </summary>
        StreamBottomMod,
        /// <summary>
        /// ��ҳģʽ:��ӡ��������˳�����,�ھ���ҳ�Ϲ̶�λ�����
        /// </summary>
        StreamPageMod
    }

    #endregion

    #region �󶨽����
    /// <summary>
    /// ���ݰ󶨽��
    /// </summary>
    private class BindResult
    {
        /// <summary>
        /// �󶨽������ģ��,null��󶨽���
        /// </summary>
        public XmlElement xeTemplate;
        
        /// <summary>
        /// �����Ĵ�ӡ������Ϣ
        /// </summary>
        public PrintInfo printInfo;

        /// <summary>
        /// �������,û�и�����Ϊ��
        /// </summary>
        public BindResult parentResult = null;
        /// <summary>
        /// ���ǰ��
        /// </summary>
        public int parentRowIndex = -1;

        /// <summary>
        /// ��ǰ������к�,-1Ϊ����
        /// </summary>
        public int rowIndex = 0;

        /// <summary>
        /// ��ǰ��䷶Χ
        /// </summary>
        public Bound boundResult = null;
        
        /// <summary>
        /// ��ǰ�з�Χ
        /// </summary>
        public Bound boundRow = null;

        /// <summary>
        /// �Ӽ����ݰ󶨵Ľ��,key/string ���Ӽ���ϵ��
        /// </summary>
        public IDictionary<string, BindResult> resultChildren = new Dictionary<string, BindResult>();

        /// <summary>
        /// ��ȡ����������Ƿ����,�������������������ɲ������
        /// </summary>
        /// <param name="grp">��ӡ�������ƻ�������</param>
        /// <returns>�Ƿ����</returns>
        public bool isComplete(string grp)
        {
            if (string.IsNullOrEmpty(grp))
                return true;
            if (this.resultChildren.ContainsKey(grp))
                grp = this.resultChildren[grp].printInfo.GroupName;
            foreach (BindResult rsChild in this.resultChildren.Values)
            {
                if (grp != rsChild.printInfo.GroupName)
                    continue;
                if (rsChild.rowIndex > -1 && rsChild.parentRowIndex==this.rowIndex)
                    return false;
            }
            return true;
        }

        /// <summary>
        /// ��ʼ����������
        /// </summary>
        /// <param name="keyChild">��������</param>
        public void initChildBound(string keyChild)
        {
            if (!this.resultChildren.ContainsKey(keyChild))
                return;
            if (null == this.printInfo || null == this.boundResult || null == this.boundRow)
                return;
            BindResult rs = this.resultChildren[keyChild];
            PrintInfo pinfoChild = rs.printInfo;
            if (TrunPageModel.PageMod != pinfoChild.TrunPageType && rs.rowIndex<0)
                if (PrintType.Data == rs.printInfo.RegionType || this.isComplete(rs.printInfo.GroupName))
                {
                    rs.boundResult = null;
                    return;
                }

            if (null == rs.boundResult)
                rs.boundResult = Bound.ParseBound(rs.printInfo.RowBound);
            int iwidth = pinfoChild.RwBound.Right - pinfoChild.RwBound.Left;
            int iheight = pinfoChild.RwBound.Bottom - pinfoChild.RwBound.Top;
            //ҳģʽ,���������ո���ƫ�����
            if (TrunPageModel.PageMod == pinfoChild.TrunPageType)
            {
                rs.boundResult.Left = this.boundRow.Left + (pinfoChild.RwBound.Left - this.printInfo.RwBound.Left);
                rs.boundResult.Top = this.boundRow.Top   + (pinfoChild.RwBound.Top - this.printInfo.RwBound.Top);
                rs.boundResult.Right = rs.boundResult.Left + iwidth;
                rs.boundResult.Bottom = rs.boundResult.Top + iheight;
                return;
            }
            
            //��ҳģʽ,����ӡ�����Ƿ��Ѿ�ʹ��,���ʹ���������ÿ�
            if (TrunPageModel.StreamPageMod == pinfoChild.TrunPageType)
            {
                Bound bdrs = rs.boundResult;
                foreach (BindResult rsChild in this.resultChildren.Values)
                {
                    if (null == rsChild.boundResult || null == rsChild.printInfo || rs == rsChild)
                        continue;
                    Bound ch = rsChild.boundResult;
                    if (bdrs.Right < ch.Left || bdrs.Bottom < ch.Top || bdrs.Left > ch.Right || bdrs.Top > ch.Bottom)
                        continue;
                    rs.boundResult = null;
                    return;
                }
                return;
            }
            
            //��ģʽȡ���λ�õ������������,û���������ȡ��һ��
            BindResult lastRs = null, firstRs=null;
            foreach (BindResult rsChild in this.resultChildren.Values)
            {
                if (null == firstRs) firstRs = rsChild;
                if (null == rsChild.boundResult || null == rsChild.printInfo || rs==rsChild)
                    continue;
                if (null == lastRs)
                    lastRs = rsChild;
                if (lastRs.boundResult.Bottom < rsChild.boundResult.Bottom ||
                    (lastRs.boundResult.Bottom == rsChild.boundResult.Bottom && lastRs.boundResult.Right < rsChild.boundResult.Right))
                    lastRs = rsChild;
            }
            if (null == lastRs)
                lastRs = firstRs;
            else
                firstRs = null;
            //��һ���������Ĭ������Ϊ��һ��������
            if (null == lastRs.boundResult)
                lastRs.boundResult = Bound.ParseBound(lastRs.printInfo.RowBound);
            int ileft = lastRs.boundResult.Left;
            int itop = lastRs.boundResult.Top;
            int iright = lastRs.boundResult.Right;
            int ibottom = lastRs.boundResult.Bottom;
            string grp = lastRs.printInfo.GroupName;
            if (null != firstRs && rs!=firstRs)
                lastRs.boundResult = null;
            //�����λ������ͬ���������������,�������ͬ������
            if(grp!=pinfoChild.GroupName)
                foreach (BindResult rsChild in this.resultChildren.Values)
                {
                    if (null == rsChild.boundResult || null == rsChild.printInfo)
                        continue;
                    if (grp != rsChild.printInfo.GroupName)
                        continue;
                    if (ileft > rsChild.boundResult.Left)
                        ileft = rsChild.boundResult.Left;
                    if (itop > rsChild.boundResult.Top)
                        itop = rsChild.boundResult.Top;
                    if (iright < rsChild.boundResult.Right)
                        iright = rsChild.boundResult.Right;
                    if (ibottom < rsChild.boundResult.Bottom)
                        ibottom = rsChild.boundResult.Bottom;
                }
            //����λ�ó��������λ����,
            //��ҳģʽʱ�Ȱ��յ�ģʽ����λ��,������������չ̶�λ��,���򰲳��޴���
            TrunPageModel trunmod = pinfoChild.TrunPageType;
            if ((TrunPageModel.StreamRightMod == trunmod && iright+1+iwidth>pinfoChild.PgBound.Right)||
                 (TrunPageModel.StreamBottomMod == trunmod && ibottom + 1 + iheight > pinfoChild.PgBound.Bottom))
            {
                rs.boundResult.Top = itop;
                if (null == firstRs)
                    rs.boundResult.Left = iright + 1;
                else
                    rs.boundResult.Left = ileft;
            }
            else
            {
                if (null == firstRs)
                    rs.boundResult.Top = ibottom + 1;
                else
                    rs.boundResult.Top = itop;
                rs.boundResult.Left = ileft;
            }
            rs.boundResult.Right = rs.boundResult.Left + iwidth;
            rs.boundResult.Bottom = rs.boundResult.Top + iheight;
            //������Ϊ��
            if (rs.boundResult.Right > pinfoChild.PgBound.Right || rs.boundResult.Bottom > pinfoChild.PgBound.Bottom)
                rs.boundResult = null;
        }
    }

    #endregion

    private string strFileTp = "";		//��ӡ��ģ���ļ�
	private	DataSet		dataSource=new DataSet("Print");	//����Դ        
	private	XmlNamespaceManager	xmlNsMgl;					//���ƿռ����
    private IDictionary<string, PrintInfo> printInfoList = new Dictionary<string, PrintInfo>();
    private IList<PrintInfo>               printInfos = new List<PrintInfo>();
    private XmlDocument xmldoc = new XmlDocument();


	#region ��������
	/// <summary>
	/// ��ȡ������Word��ӡģ���ļ�ȫ����;û��ģ��Ĭ��HTML�ı�����
	/// </summary>
	public string	TemplateFileName
	{
		get{return this.strFileTp;}
		set{this.strFileTp=value;}
	}

	/// <summary>
	/// ��ȡ�����ô�ӡ����Դ
	/// </summary>
	public DataSet	DataSource
	{
		get{return this.dataSource;}
		set{this.dataSource=value;}
	}

	/// <summary>
	/// ��ȡ��ӡ�ĵ�
	/// </summary>
	public	XmlDocument		PrintXmlDoc
	{
		get{return this.xmldoc;}
	}

    /// <summary>
    /// ��ȡ���ݱ���չ����:��С�м�¼��
    /// </summary>
    static public string    ExProMinRowCountName
    {
        get { return "MinRowCount"; }
    }

	#endregion

    #region ��������
    /// <summary>
    /// ������Դ,��ģ��ı�ǩд������
    /// </summary>
    public void DataBind()
    {
        if (string.IsNullOrEmpty(this.TemplateFileName))
        {
            this.bindBlankTemplate();
            return;
        }
        this.initTemplate();
        //�в�����,����ģ��Ĳ����������ֶ�
        if (this.dataSource.Tables.Contains("������"))
        {
            DataTable tabparam = this.dataSource.Tables["������"];
            if (tabparam.Rows.Count > 0)
            {
                DataRow drparam = tabparam.Rows[0];
                XmlNodeList xncells = this.xmldoc.SelectNodes("/*/ss:Worksheet/ss:Table/ss:Row/ss:Cell/ss:Data", this.xmlNsMgl);
                foreach (XmlNode xn in xncells)
                {
                    if (!(xn is XmlElement))
                        continue;
                    this.BindData(xn as XmlElement, drparam);
                }
            }
        }
        XmlElement xeTemplate = this.xmldoc.SelectSingleNode("/*/ss:Worksheet", this.xmlNsMgl) as XmlElement;
        XmlElement xeTpClone = xeTemplate.Clone() as XmlElement;
        //���ģ����
        XmlNode xnRow = xeTemplate.SelectSingleNode(".//ss:Row", this.xmlNsMgl);
        while (null != xnRow)
        {
            XmlNode xnT = xnRow.NextSibling;
            if ("Row" == xnRow.LocalName)
                xnRow.ParentNode.RemoveChild(xnRow);
            xnRow = xnT;
        }
        //��ʼ�������������ӹ�ϵ
        IDictionary<string, BindResult> listResult = new Dictionary<string, BindResult>();
        BindResult rootResult = new BindResult();
        rootResult.boundResult = Bound.ParseBound("A1:A1");
        foreach (PrintInfo pinfo in this.printInfos)
        {
            string key = pinfo.DbName;
            if (!this.dataSource.Tables.Contains(key) && PrintType.Data==pinfo.RegionType)
                continue;
            BindResult bindInstance = new BindResult();
            bindInstance.rowIndex = 0;
            bindInstance.printInfo = pinfo;
            listResult.Add(pinfo.DbName, bindInstance);
        }
        for (int i=0;i<this.printInfos.Count;i++)
        {
            string key = this.printInfos[i].DbName;
            PrintInfo pinfo = this.printInfos[i];
            DataRelation rf = null;
            if (PrintType.Text == pinfo.RegionType)
            {
                foreach (PrintInfo p in this.printInfos)
                {
                    if (PrintType.Data != p.RegionType || !this.dataSource.Tables.Contains(p.DbName))
                        continue;
                    if (pinfo.GroupName != p.GroupName)
                        continue;
                    if (this.dataSource.Tables[p.DbName].ParentRelations.Count < 1)
                        continue;
                    rf = this.dataSource.Tables[p.DbName].ParentRelations[0];
                    break;
                }
            }
            else
            {
                if (this.dataSource.Tables[key].ParentRelations.Count < 1)
                    continue;
                rf = this.dataSource.Tables[key].ParentRelations[0];
            }
            if (null == rf) continue;
            BindResult rsParent = listResult[rf.ParentTable.TableName];
            BindResult bindrs = listResult[key];
            rsParent.resultChildren.Add(key, bindrs);
            bindrs.parentResult = rsParent;
        }
        for (int i = 0; i < this.printInfos.Count; i++)
        {
            string key = this.printInfos[i].DbName;
            BindResult bindrs = listResult[key];
            if (rootResult.boundResult.Right < bindrs.printInfo.PgBound.Right)
                rootResult.boundResult.Right = bindrs.printInfo.PgBound.Right;
            if (rootResult.boundResult.Bottom < bindrs.printInfo.PgBound.Bottom)
                rootResult.boundResult.Bottom = bindrs.printInfo.PgBound.Bottom;
            if (null != bindrs.parentResult)
                listResult.Remove(key);
            else
                rootResult.resultChildren.Add(key,bindrs);
        }
        string pagePrint = "����=�ı�\n���ݱ�=ҳ\nҳ��Χ=A1:{0}{1}\n�з�Χ=A1:{0}{1}";
        string col="";
        int colindex = rootResult.boundResult.Right;
        while (colindex > 0)
        {
            int mod = colindex % 27;
            if (colindex > 26) mod += 1;
            col = Convert.ToString(Convert.ToChar(mod + Convert.ToInt16('A') - 1)) + col;
            colindex = colindex / 27;
        }
        pagePrint = string.Format(pagePrint, col , rootResult.boundResult.Bottom);
        rootResult.printInfo = PrintInfo.SerialFromString(pagePrint);
        rootResult.boundRow = rootResult.boundResult;
        //��������Դ�ı����ѭ��,�к�-1��ʾ�Ѿ�����,�Ӽ����ݵݹ��
        //�ѽ��ҳxeTp�����ĵ�
        XmlElement xeTable = this.xmldoc.SelectSingleNode("/*/ss:Worksheet/ss:Table", this.xmlNsMgl) as XmlElement;
        while (true)
        {
            bool isBreak = true;
            foreach (BindResult bindInstance in listResult.Values)
            {
                if (bindInstance.rowIndex < 0)
                    continue;
                isBreak = false; break;
            }
            if (isBreak) break;
            //��ҳ��
            XmlElement xeTp = xeTpClone.CloneNode(true) as XmlElement;
            foreach (BindResult rs in listResult.Values)
            {
                rs.boundResult = null;
                rs.boundRow = null;
            }
            foreach (PrintInfo pinfo in this.printInfos)
            {
                if (!listResult.ContainsKey(pinfo.DbName))
                    continue;
                BindResult rs = listResult[pinfo.DbName];
                if (rs.rowIndex < 0 && PrintType.Data == rs.printInfo.RegionType)
                    continue;
                rs.xeTemplate = xeTp;
                rootResult.initChildBound(pinfo.DbName);
                if (null == rs.boundResult)
                    continue;
                //�Ӽ���Χ
                if (PrintType.Text == pinfo.RegionType && !rootResult.isComplete(pinfo.DbName))
                {
                    this.CopyCell(xeTpClone, pinfo.RowBound, rs.xeTemplate, rs.boundResult.Left, rs.boundResult.Top);
                    rs.rowIndex = -1;
                }
                else if (PrintType.Data == pinfo.RegionType && this.dataSource.Tables.Contains(pinfo.DbName))
                {
                    DataRow[] drs = this.dataSource.Tables[pinfo.DbName].Select();
                    this.BindNode(xeTpClone, drs, rs);
                }
            }
            xnRow = xeTp.SelectSingleNode(".//ss:Row", this.xmlNsMgl);
            while (null != xnRow)
            {
                XmlNode xnT = xnRow.NextSibling;
                if ("Row" == xnRow.LocalName)
                    xeTable.AppendChild(xnRow);
                xnRow = xnT;
            }
        }//while (true)
        //�ϲ���Ԫ��
        this.MergeCell(xeTemplate);
    }

    #endregion

    #region ˽�з���

    /// <summary>
    /// �󶨿�ģ��
    /// </summary>
    private void bindBlankTemplate()
    {
        //ȥ������������<meta http-equiv='Content-Type' content='text/html;charset=utf-8'/>
        //�����������м�¼��û�м�¼ʱ��ʾ���ݲ�ͬ(������)
        String strHTML = "<html><head><title>" + this.dataSource.DataSetName+ "</title><style>"
                    +"td{ font-size: 12px;line-height:20px;font-family: Arial, Helvetica, sans-serif;width:80; }"
                    + "</style></head><body><table border='1' cellpadding='0' cellspacing='0' bordercolorlight='#cccccc' bordercolordark='#FFFFFF'></table></body></html>";
        this.xmldoc.LoadXml(strHTML);
        XmlElement xeTable = this.xmldoc.SelectSingleNode("//table") as XmlElement;
        int prevcolsum = 0;
        for (int i = 0; i < this.dataSource.Tables.Count; i++)
        {
            DataTable tab = this.dataSource.Tables[i];
            if (tab.ParentRelations.Count > 0)
                continue;
            XmlElement xeRow = this.xmldoc.CreateElement("tr");
            xeRow = xeTable.AppendChild(xeRow) as XmlElement;
            int colcount = 0;
            for (int c = 0; c < tab.Columns.Count; c++)
            {
                DataColumn col = tab.Columns[c];
                if (col.ColumnName.EndsWith("_�ֵ�"))
                    continue;
                colcount++;
                XmlElement xeCol = this.xmldoc.CreateElement("td");
                xeCol.SetAttribute("style", "background-color: silver;");
                xeCol.SetAttribute("align", "center");
                xeCol = xeRow.AppendChild(xeCol) as XmlElement;
                xeCol.InnerText = col.Caption;
            }
            if (i > 0 && prevcolsum > colcount)
            {
                tab.ExtendedProperties["firstColSpan"] = prevcolsum - colcount + 1;
                ((XmlElement)xeRow.FirstChild).SetAttribute("colspan", Convert.ToString(prevcolsum - colcount + 1));
            }
            if (prevcolsum < colcount)
                prevcolsum = colcount;

            XmlElement xeRowTitle = this.xmldoc.CreateElement("tr");
            xeRowTitle = xeTable.InsertBefore(xeRowTitle, xeRow) as XmlElement;
            string title = "<td align='center' colspan='{0}' style='background-color:silver;'>{1}</td>";
            title = string.Format(title, prevcolsum, tab.TableName);
            string[,] strlist = new string[,] { { "����", "�б�" } };
            for (int s = 0; s < strlist.GetLength(0); s++)
                title = title.Replace(strlist[s, 0], strlist[s, 1]);
            xeRowTitle.InnerXml = title;

            for (int r = 0; r < tab.Rows.Count; r++)
            {
                xeRow = this.xmldoc.CreateElement("tr");
                xeRow = xeTable.AppendChild(xeRow) as XmlElement;
                this.bindBlankTemplate(xeRow, tab.Rows[r]);
            }
            if (i + 1 < this.dataSource.Tables.Count)
            {
                xeRowTitle = this.xmldoc.CreateElement("tr");
                xeRowTitle.InnerXml = string.Format("<td colspan='{0}'></td>", prevcolsum);
                xeTable.AppendChild(xeRowTitle);
            }
        }
    }
    /// <summary>
    /// �ڿ�ģ��ʱ���ݹ���нڵ�
    /// </summary>
    /// <param name="xeRow">����¼����Ԫ��</param>
    /// <param name="dr">���ݼ�¼</param>
    private void bindBlankTemplate(XmlElement xeRow, DataRow dr)
    {
        if (null == xeRow || null == dr)
            return;
        DataColumnCollection cols=dr.Table.Columns;
        int collen = dr.Table.Columns.Count;
        int colspan = 0;
        if (null != dr.Table.ExtendedProperties["firstColSpan"])
            colspan = Convert.ToInt16(dr.Table.ExtendedProperties["firstColSpan"]);

        for (int i = 0; i < collen; i++)
        {
            DataColumn col = dr.Table.Columns[i];
            if (col.ColumnName.EndsWith("_�ֵ�"))
                continue;
            XmlElement xeCol = this.xmldoc.CreateElement("td");
            xeCol = xeRow.AppendChild(xeCol) as XmlElement;

            if (xeCol == xeRow.FirstChild && colspan > 0)
            {
                xeCol.SetAttribute("colspan", Convert.ToString(colspan));
                xeCol.SetAttribute("align", "center");
            }
            object v = dr[col.ColumnName];
            if (null == v || DBNull.Value == v)
            { 
                xeCol.InnerText = ""; 
                continue; 
            }
            if (true.Equals(v))
            { 
                xeCol.InnerText = "��"; 
                xeCol.SetAttribute("align", "center"); 
            }
            else if (false.Equals(v))
            {
                xeCol.InnerText = "��"; 
                xeCol.SetAttribute("align", "center"); 
            }
            else if (cols.Contains(col.ColumnName + "_�ֵ�"))
            {
                xeCol.InnerText = Convert.ToString(dr[col.ColumnName + "_�ֵ�"]);
                xeCol.SetAttribute("align", "center");
            }
            else
                xeCol.InnerText = Convert.ToString(v);
        }
        for (int i = 0, len = dr.Table.ChildRelations.Count; i < len; i++)
        {
            DataRelation relation = dr.Table.ChildRelations[i];
            DataRow[] drs = dr.GetChildRows(relation);
            if (drs.Length < 1)
                continue;
            XmlElement xechildrow = this.xmldoc.CreateElement("tr");
            xechildrow.InnerXml = string.Format("<td colspan='{0}'></td>", collen);
            xeRow.ParentNode.AppendChild(xechildrow);
            xechildrow = this.xmldoc.CreateElement("tr");
            xechildrow = xeRow.ParentNode.AppendChild(xechildrow) as XmlElement;
            xechildrow.InnerXml = string.Format("<td colspan='{0}'><table border='1' cellpadding='0' cellspacing='0' bordercolorlight='#cccccc' bordercolordark='#FFFFFF'></table></td>", collen);
            XmlElement xechildtab = xechildrow.FirstChild.FirstChild as XmlElement;
            for (int r = 0; r < drs.Length; r++)
            {
                XmlElement xeRowChild = this.xmldoc.CreateElement("tr");
                xeRowChild = xechildtab.AppendChild(xeRowChild) as XmlElement;
                this.bindBlankTemplate(xeRowChild, drs[r]);
            }
        }
    }
    /// <summary>
    /// ��ʼ��ģ�����
    /// </summary>
    private void initTemplate()
    {
        this.xmldoc.Load(this.TemplateFileName);
        XmlElement xmlRootEle = xmldoc.DocumentElement;
        this.xmlNsMgl = new XmlNamespaceManager(xmldoc.NameTable);
        for (int i = 0; i < xmlRootEle.Attributes.Count; i++)
        {
            string strPrefix = xmlRootEle.Attributes[i].Prefix;
            string strLocalName = xmlRootEle.Attributes[i].LocalName;
            string strURI = xmlRootEle.Attributes[i].Value;
            if ("xmlns" == strLocalName)
                this.xmlNsMgl.AddNamespace(string.Empty, strURI);
            if ("xmlns" != strPrefix) continue;
            this.xmlNsMgl.AddNamespace(strLocalName, strURI);
        }
        XmlElement xeTemplate = this.xmldoc.SelectSingleNode("/*/ss:Worksheet", this.xmlNsMgl) as XmlElement;
        XmlElement xeTable = xeTemplate.SelectSingleNode("ss:Table", this.xmlNsMgl) as XmlElement;
        xeTable.RemoveAttribute("ss:ExpandedColumnCount");
        xeTable.RemoveAttribute("ss:ExpandedRowCount");
        //��ʼ����ӡ������Ϣ
        this.initPrintInfo(xeTemplate);
        
        //��ʼ��ģ������:����,�ֶ�,��,�У�ÿ�η�ҳ�Ͱ����һҳ�����
        XmlNodeList xnDataList = xeTemplate.SelectNodes("ss:Table/ss:Row/ss:Cell/ss:Data", this.xmlNsMgl);
        foreach (XmlNode xn in xnDataList)
        {
            XmlElement xe = xn as XmlElement;
            if (null == xe) continue;
            string t = xe.InnerText;
            if (string.IsNullOrEmpty(t) || !t.StartsWith("{") || !t.EndsWith("}") || t.Length < 3)
                continue;
            t = t.Substring(1, t.Length - 2);
            string aliasName = "", fieldName = t;
            if (t.Contains("."))
            {
                aliasName = t.Substring(0, t.IndexOf("."));
                fieldName = t.Substring(t.IndexOf(".") + 1);
            }
            if (string.IsNullOrEmpty(fieldName))
                continue;
            xe.InnerText = "";
            xe.SetAttribute("alias", aliasName);
            xe.SetAttribute("field", fieldName);
            foreach (PrintInfo pinfo in this.printInfoList.Values)
            {
                if (aliasName != pinfo.AliasName)
                    continue;
                DataTable tab = this.dataSource.Tables[pinfo.DbName];
                if (null == tab) continue;
                if (!tab.Columns.Contains(fieldName) || !tab.Columns.Contains(fieldName + "_�ֵ�"))
                    continue;
                xe.SetAttribute("field", fieldName + "_�ֵ�");
            }
        }
        int rowIndex = 0;
        XmlNodeList xnRowList = xeTemplate.SelectNodes("ss:Table/ss:Row", this.xmlNsMgl);
        foreach (XmlNode xn in xnRowList)
        {
            rowIndex++;
            XmlElement xeRow = xn as XmlElement;
            if (null == xeRow) continue;
            string sIndex = xeRow.GetAttribute("ss:Index");
            if (!string.IsNullOrEmpty(sIndex))
            {
                int iNewIndex = Convert.ToInt16(sIndex);
                for (; rowIndex < iNewIndex; rowIndex++)
                {
                    XmlElement xeRowNew = xeRow.OwnerDocument.CreateElement("ss:Row");
                    xeRowNew.SetAttribute("ss:AutoFitHeight", "0");
                    xeRowNew.SetAttribute("r", Convert.ToString(rowIndex));
                    xeRow.ParentNode.InsertBefore(xeRowNew, xeRow);
                }
                xeRow.RemoveAttribute("ss:Index");
            }
            int colIndex = 1;
            XmlNodeList xnCellList = xeRow.SelectNodes("ss:Cell", this.xmlNsMgl);
            foreach (XmlNode xnn in xnCellList)
            {
                XmlElement xeCell = xnn as XmlElement;
                if (null == xeCell) continue;
                sIndex = xeCell.GetAttribute("ss:Index");
                if (!string.IsNullOrEmpty(sIndex))
                    colIndex = Convert.ToInt16(sIndex);
                //�����˵�Ԫ����к��к�
                xeCell.SetAttribute("r", Convert.ToString(rowIndex));
                xeCell.SetAttribute("c", Convert.ToString(colIndex++));
            }
        }//foreach (XmlNode xn in xnRowList)
    }

    /// <summary>
    /// ��ģ����Ϣ����ȡ��ʼ����ӡ������Ϣ
    /// </summary>
    /// <param name="xeTemplate"></param>
    private void initPrintInfo(XmlElement xeTemplate)
    {
        if (null == xeTemplate)
            return;
        //��ʼ��������Ϣ
        XmlNodeList xnCommentList = xeTemplate.SelectNodes("//ss:Comment", this.xmlNsMgl);
        foreach (XmlNode xn in xnCommentList)
        {
            XmlElement xeComment = xn as XmlElement;
            if (null == xeComment) continue;
            PrintInfo pinfo = PrintInfo.SerialFromString(xeComment.InnerText);
            if (null == pinfo) continue;
            if (string.IsNullOrEmpty(pinfo.DbName))
                continue;
            if (this.printInfoList.Keys.Contains(pinfo.DbName))
                this.printInfoList[pinfo.DbName] = pinfo;
            else
                this.printInfoList.Add(pinfo.DbName, pinfo);
            xeComment.ParentNode.RemoveChild(xeComment);
        }
        foreach (PrintInfo p in this.printInfoList.Values)
            this.printInfos.Add(p);
        //���Ŵ�ӡ��˳��,�����к�,�к�,��������ͬ������һ��,���ǰ��������Ϊ����λ��
        for (int i = 1; i < this.printInfos.Count; i++)
        {
            PrintInfo prevInfo = this.printInfos[i - 1];
            PrintInfo currInfo = this.printInfos[i];
            int indexgrp = -1, indexpos = -1;
            string grp = currInfo.GroupName;
            for (int j = 0; j < i; j++)
            {
                PrintInfo grpInfo = this.printInfos[j];
                //ͬ����
                if (grp == grpInfo.GroupName)
                {
                    indexgrp = j;
                    if (currInfo.PgBound.Top < grpInfo.PgBound.Top ||
                        (currInfo.PgBound.Top == grpInfo.PgBound.Top && currInfo.PgBound.Left < grpInfo.PgBound.Left))
                        break;
                    continue;
                }
                //��ͬ�����ǰһ��ӡ��
                if (indexpos > -1)
                    continue;
                if (currInfo.PgBound.Top < grpInfo.PgBound.Top ||
                    (currInfo.PgBound.Top == grpInfo.PgBound.Top && currInfo.PgBound.Left < grpInfo.PgBound.Left))
                    indexpos = j;
            }
            //���Ŵ�ӡ˳��
            if (indexgrp > -1 && indexgrp < indexpos)
                indexpos = indexgrp;
            if (indexpos > -1 || indexgrp > -1)
            {
                this.printInfos.Remove(currInfo);
                if (indexgrp > -1 && (indexpos < 0 || indexgrp < indexpos))
                    this.printInfos.Insert(indexgrp, currInfo);
                else if (indexpos > -1)
                {
                    this.printInfos.Insert(indexpos, currInfo);
                    if (indexgrp > indexpos)
                        i = indexgrp;
                }
            }
        }//for (int i = 1; i < this.printInfos.Count; i++)
    }

    /// <summary>
    /// ����Դҳ�ڰ�ģ��,��ɰ��򷵻�-1,�Ƿ�����null,�ڷ�Χ���޷���
    /// </summary>
    /// <param name="xeTemplate">����ģ��</param>
    /// <param name="drs">���ݼ�¼��</param>
    /// <param name="bindEnv">��ǰ�󶨽��:��ǰ�м���Χ</param>
    /// <returns>�󶨽��:rowIndex=-1��ʾ�����</returns>
    private BindResult BindNode(XmlElement xeTemplate, DataRow[] drs, BindResult bindEnv)
    {
        //���
        if (null == xeTemplate || null == drs || drs.Length < 1 || null == bindEnv
            || null == bindEnv.xeTemplate || bindEnv.rowIndex < 0 || bindEnv.rowIndex >= drs.Length)
        { if (null != bindEnv) bindEnv.rowIndex = -1; return bindEnv; }
        DataTable   tab=drs[0].Table;
        string dbName = tab.TableName;
        if (!this.printInfoList.Keys.Contains(dbName))
        { if (null != bindEnv) bindEnv.rowIndex = -1; return bindEnv; }

        ICollection<String> pinfoKeys = this.printInfoList.Keys;
        PrintInfo pinfo = this.printInfoList[dbName];
        if (null == bindEnv.boundResult)
            bindEnv.boundResult = Bound.ParseBound(pinfo.RowBound);
        bindEnv.boundRow = new Bound();
        //��ǰ��λ��ileft,itop
        int ileft = bindEnv.boundResult.Left;
        int itop = bindEnv.boundResult.Top;
        while (bindEnv.rowIndex < drs.Length)
        {
            //����ģ������
            bindEnv.boundRow.Left = ileft;
            bindEnv.boundRow.Top = itop;
            bindEnv.boundResult.Right = bindEnv.boundRow.Right = ileft + (pinfo.RwBound.Right - pinfo.RwBound.Left);
            bindEnv.boundResult.Bottom =bindEnv.boundRow.Bottom  = itop + (pinfo.RwBound.Bottom - pinfo.RwBound.Top);
            this.CopyCell(xeTemplate, pinfo.RowBound, bindEnv.xeTemplate, ileft, itop);
            //���¸���Ľ������
            BindResult childResult = bindEnv;
            BindResult parentResult = bindEnv.parentResult;
            while (null != parentResult)
            {
                Bound bdP = parentResult.boundResult;
                Bound bdC = childResult.boundResult;
                if (bdP.Right >= bdC.Right && bdP.Bottom >= bdC.Bottom)
                    break;
                if (bdC.Right > bdP.Right)
                    bdP.Right = bdC.Right;
                if (bdC.Bottom > bdP.Bottom)
                    bdP.Bottom = bdC.Bottom;
                childResult = parentResult;
                parentResult = parentResult.parentResult;
            }
            //���ֶ�ֵ(�����ֶλ������ֶ�)
            string strTabFind = "ss:Table/ss:Row/ss:Cell[@r='{0}']";
            string strRowFind = "ss:Cell[@c='{0}']";
            XmlNode xnField=null, xnRowF=null;
            for (int i = itop; i <= bindEnv.boundResult.Bottom; i++)
            {
                if (null == xnRowF)
                {
                    xnField = bindEnv.xeTemplate.SelectSingleNode(string.Format(strTabFind, i), this.xmlNsMgl);
                    if (null == xnField)
                        continue;
                    xnRowF = xnField.ParentNode;
                }
                xnField = xnRowF.SelectSingleNode(string.Format(strRowFind, ileft), this.xmlNsMgl);
                for (int j = ileft; j <= bindEnv.boundResult.Right; j++)
                {
                    if (null == xnField)
                        xnField = xnRowF.SelectSingleNode(string.Format(strRowFind, j), this.xmlNsMgl);
                    if (null == xnField)
                        continue;
                    if (null != xnField.FirstChild && null != xnField.FirstChild.Attributes["field"])
                        this.BindData((XmlElement)xnField.FirstChild, drs[bindEnv.rowIndex]);
                    xnField = xnField.NextSibling;
                    if (null == xnField || null == xnField.FirstChild || null == xnField.FirstChild.Attributes["c"]
                        || Convert.ToString(j+1) != xnField.FirstChild.Attributes["c"].Value)
                        xnField = null;
                }
                xnRowF = xnRowF.NextSibling;
            }
            //ҳ�ڰ��Ӽ�
            foreach (BindResult rs in bindEnv.resultChildren.Values)
            {
                rs.boundResult = null;
                rs.boundRow = null;
            }
            foreach (BindResult rs in bindEnv.resultChildren.Values)
            {
                PrintInfo pinfoChild = rs.printInfo;
                string key = pinfoChild.DbName;
                DataRelation rlChild = null;
                foreach (DataRelation rl in tab.ChildRelations)
                {
                    if (key != rl.ChildTable.TableName)
                        continue;
                    rlChild = rl;
                    break;
                }
                //������������Ƿ����,���ڵ�ǰ�������
                if (pinfoChild.RwBound.Left < pinfo.RwBound.Left || pinfoChild.RwBound.Top < pinfo.RwBound.Top
                    || pinfoChild.RwBound.Right > pinfo.RwBound.Right || pinfoChild.RwBound.Bottom > pinfo.RwBound.Bottom)
                    continue;
                rs.xeTemplate = bindEnv.xeTemplate;
                if (rs.parentRowIndex != bindEnv.rowIndex)
                {
                    rs.parentRowIndex = bindEnv.rowIndex;
                    rs.rowIndex = 0;
                }
                //��ʼ������������,������Ϊ��
                bindEnv.initChildBound(key);
                if (null == rs.boundResult)
                    continue;
                //�Ӽ���Χ
                if (PrintType.Text == pinfoChild.RegionType && !bindEnv.isComplete(key))
                {
                    this.CopyCell(xeTemplate, pinfoChild.RowBound, rs.xeTemplate, rs.boundResult.Left, rs.boundResult.Top);
                    rs.rowIndex = -1;
                }
                else if (PrintType.Data == pinfoChild.RegionType && null != rlChild)
                    this.BindNode(xeTemplate, drs[bindEnv.rowIndex].GetChildRows(rlChild), rs);
            }
            //����Ƿ���һ��
            bool isNext = true;
            foreach(BindResult srChild in bindEnv.resultChildren.Values)
                if (srChild.rowIndex > -1)
                { isNext=false; break; }
            if (isNext)
                bindEnv.rowIndex++;
            if (bindEnv.rowIndex >= drs.Length)
                break;
            //�����������ʽ������һ����¼������λ��
            if (OutRowModel.VeriNextHori == pinfo.OutRowType)
            {
                itop = bindEnv.boundResult.Bottom + 1;
                if (itop + pinfo.RwBound.Bottom - pinfo.RwBound.Top > pinfo.PgBound.Bottom)
                {
                    itop = bindEnv.boundResult.Top;
                    ileft = bindEnv.boundResult.Right + 1;
                }
            }
            else
            {
                ileft = bindEnv.boundResult.Right+1;
                if (ileft + pinfo.RwBound.Right - pinfo.RwBound.Left > pinfo.PgBound.Right)
                {
                    ileft = bindEnv.boundResult.Left;
                    itop = bindEnv.boundResult.Bottom + 1;
                }
            }
            //�����һ����¼�Ƿ�ҳ�泬��
            if (bindEnv.boundResult.Right > pinfo.PgBound.Right || bindEnv.boundResult.Bottom > pinfo.PgBound.Bottom
                || (itop + pinfo.RwBound.Bottom - pinfo.RwBound.Top) > pinfo.PgBound.Bottom
                || (ileft + pinfo.RwBound.Right - pinfo.RwBound.Left) > pinfo.PgBound.Right)
                return bindEnv;
        }//for (int i = 0; bindEnv.rowIndex < drs.Length; i++)
        //��������
        bindEnv.rowIndex = -1;
        foreach (BindResult srChild in bindEnv.resultChildren.Values)
            srChild.parentRowIndex = srChild.rowIndex = -1;
        return bindEnv;
    }

    /// <summary>
    /// ���ֶε�Ԫ����ֵ
    /// </summary>
    /// <param name="xeField">��Ԫ�����ݽڵ�</param>
    /// <param name="dataRow">����</param>
    /// <returns>�Ѿ��󶨷���true</returns>
    private bool BindData(XmlElement xeField, DataRow dataRow)
    {
        if (null == xeField || null == dataRow)
            return true;
        string  alias=xeField.GetAttribute("alias");
        string  field=xeField.GetAttribute("field");
        string  key = dataRow.Table.TableName;
        PrintInfo pinfo = null;
        if (this.printInfoList.ContainsKey(key))
            pinfo = this.printInfoList[key];
        if (null != pinfo && (alias == pinfo.AliasName || alias == key))
        {
            if (!dataRow.Table.Columns.Contains(field))
            { xeField.InnerText = ""; return true; }
            object v = dataRow[field];
            if (null == v || DBNull.Value == v)
                xeField.InnerText = "";
            if (true.Equals(v))
                xeField.InnerText = "��";
            else if (false.Equals(v))
                xeField.InnerText = "��";
            else
                xeField.InnerText = Convert.ToString(v);
            return true;
        }
        if (string.IsNullOrEmpty(alias) && dataRow.Table.Columns.Contains(field))
        {
            if (!dataRow.Table.Columns.Contains(field))
                { xeField.InnerText = ""; return true; }
            object vf = dataRow[field];
            if(null == vf || DBNull.Value == vf)
                xeField.InnerText = ""; 
            if (true.Equals(vf))
                xeField.InnerText = "��";
            else if (false.Equals(vf))
                xeField.InnerText = "��";
            else
                xeField.InnerText = Convert.ToString(vf);
            return true;
        }
        foreach (DataRelation r in dataRow.Table.ParentRelations)
            if (this.BindData(xeField, dataRow.GetParentRow(r)))
                return true;
        return false;
    }

    /// <summary>
    /// ��ģ��
    /// </summary>
    /// <param name="xeSrcTemplate">��ʽģ��</param>
    /// <param name="srcbound">��Ҫ���Ƶķ�Χ:D3:I4</param>
    /// <param name="xeDestTemplate">Ŀ��ģ��</param>
    /// <param name="iLeft">���Ƶ���</param>
    /// <param name="iTop">���Ƶ㶥</param>
    private void CopyCell(XmlElement xeSrcTemplate, string srcbound, XmlElement xeDestTemplate, int iLeft, int iTop)
    {
        if (null == xeSrcTemplate || null == xeDestTemplate || string.IsNullOrEmpty(srcbound))
            return;
        Bound bound = Bound.ParseBound(srcbound);
        if (null == bound)
            return;

        //���Ƶ�Ԫ��
        string strTabFind = "ss:Table/ss:Row/ss:Cell[@r='{0}']";
        string strRowFind = "ss:Cell[@c='{0}']";
        XmlNode xnCellsrc=null, xnCelldest=null, xnRowsrc=null, xnRowdest=null;
        for (int i = bound.Top; i <= bound.Bottom; i++, iTop++)
        {
            //����ǰ��λ�ÿ��ٶ�λ��Ԫ��
            if (null == xnRowsrc)
            {
                xnCellsrc = xeSrcTemplate.SelectSingleNode(string.Format(strTabFind, i), this.xmlNsMgl);
                if (null == xnCellsrc) continue;
                xnRowsrc = xnCellsrc.ParentNode;
            }
            xnCellsrc = xnRowsrc.SelectSingleNode(string.Format(strRowFind, bound.Left), this.xmlNsMgl);
            if (null == xnRowdest)
            {
                xnCelldest = xeDestTemplate.SelectSingleNode(string.Format(strTabFind, iTop), this.xmlNsMgl);
                xnRowdest = xnCelldest.ParentNode;
            }
            xnCelldest = xnRowdest.SelectSingleNode(string.Format(strRowFind, iLeft), this.xmlNsMgl);
            //���Ƶ�Ԫ��
            for (int j = bound.Left, iL=iLeft; j <= bound.Right; j++, iL++)
            {
                if (null == xnCellsrc)
                    xnCellsrc = xnRowsrc.SelectSingleNode(string.Format(strRowFind, j), this.xmlNsMgl);
                if (null == xnCelldest)
                    xnCelldest = xnRowdest.SelectSingleNode(string.Format(strRowFind, iL), this.xmlNsMgl);
                if (null != xnCelldest)
                {
                    XmlNode xntemp = xnCelldest;
                    xnCelldest = xnCelldest.NextSibling;
                    xnRowdest.RemoveChild(xntemp);
                }
                if (null != xnCellsrc)
                {
                    XmlElement xeCopy = xnRowdest.InsertBefore(xnCellsrc.Clone(), xnCelldest) as XmlElement;
                    xeCopy.SetAttribute("r", Convert.ToString(iTop));
                    xeCopy.SetAttribute("c", Convert.ToString(iL));
                    xnCellsrc = xnCellsrc.NextSibling;
                }
                if (null == xnCellsrc || null == xnCellsrc.Attributes["c"] || Convert.ToString(j+1) != xnCellsrc.Attributes["c"].Value)
                    xnCellsrc = null;
                if (null == xnCelldest || null == xnCelldest.Attributes["c"] || Convert.ToString(iL+1) != xnCelldest.Attributes["c"].Value)
                    xnCelldest = null;
            }
            xnRowsrc = xnRowsrc.NextSibling;
            xnRowdest = xnRowdest.NextSibling;
        }
    }

    /// <summary>
    /// �ϲ���Ԫ��(ֻ�������кϲ�)
    /// </summary>
    /// <param name="xeTemplate">Worksheet���</param>
    private void MergeCell(XmlElement xeTemplate)
    {
        foreach (DataTable tab in this.dataSource.Tables)
        {
            if (!this.printInfoList.ContainsKey(tab.TableName))
                continue;
            PrintInfo pinfo = this.printInfoList[tab.TableName];
            foreach (DataColumn col in tab.Columns)
            {
                if (null == col.ExtendedProperties["merge"] || "��" != Convert.ToString(col.ExtendedProperties["merge"]))
                    continue;
                int rowCount = 0;
                //����ָ����Ԫ��
                string strFind = ".//ss:Data[@field='{0}' and (not(@alias) or @alias='{1}')]";
                strFind = string.Format(strFind, col.ColumnName, pinfo.AliasName);
                //���Һ�����Ԫ��
                string strFind2 = "following-sibling::ss:Row//ss:Data[@field='{0}' and (not(@alias) or @alias='{1}')]";
                strFind2 = string.Format(strFind2, col.ColumnName, pinfo.AliasName);
                XmlElement xeData = xeTemplate.SelectSingleNode(strFind,this.xmlNsMgl) as XmlElement ;
                while (null != xeData)
                {
                    string colIndex = xeData.ParentNode.Attributes["c"].Value;
                    XmlElement xeRow = xeData.ParentNode.ParentNode as XmlElement;
                    if (string.IsNullOrEmpty(xeData.InnerText))
                    {
                        rowCount = 0;
                        xeData = xeRow.SelectSingleNode(strFind2, this.xmlNsMgl) as XmlElement;
                        continue;
                    }
                    //������һ��ͬ��ͬ�ֶε�Ԫ��
                    string strFindNext = "ss:Cell[@c='{0}']/ss:Data[@field='{1}' and (not(@alias) or @alias='{2}')]";
                    strFindNext = string.Format(strFindNext, colIndex, col.ColumnName, pinfo.AliasName);
                    XmlElement xeRowNext = xeRow.NextSibling as XmlElement;
                    XmlElement xeDataNext = xeRowNext.SelectSingleNode(strFindNext,this.xmlNsMgl) as XmlElement;
                    while (null != xeDataNext)
                    {
                        if (xeData.InnerText != xeDataNext.InnerText)
                            break;
                        //����ͬ��ֵͬ�ϲ���Ԫ��
                        rowCount++;
                        XmlElement xeCellNext=xeDataNext.ParentNode as XmlElement;
                        XmlElement xeCellSibling = xeCellNext.NextSibling as XmlElement;
                        if (null != xeCellSibling)
                            xeCellSibling.SetAttribute("Index", this.xmlNsMgl.LookupNamespace("ss"), xeCellSibling.GetAttribute("c"));
                        xeCellNext.ParentNode.RemoveChild(xeCellNext);
                        //��һ��
                        xeRowNext = xeRowNext.NextSibling as XmlElement;
                        xeDataNext= xeRowNext.SelectSingleNode(strFindNext,this.xmlNsMgl) as XmlElement;
                    }
                    //����ͬ��ֵͬ�ϲ���Ԫ��
                    if (rowCount > 0)
                        ((XmlElement)xeData.ParentNode).SetAttribute("MergeDown", this.xmlNsMgl.LookupNamespace("ss"), Convert.ToString(rowCount));
                    rowCount = 0;
                    xeData = xeRow.SelectSingleNode(strFind2,this.xmlNsMgl) as XmlElement;
                }
            }
        }
    }

    #endregion

}//public class PrintExcel�������
