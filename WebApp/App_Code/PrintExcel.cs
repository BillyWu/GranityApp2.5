#region 版本说明

/*
 * 功能内容：   Excel报表
 *
 * 作    者：   王荣策
 *
 * 审 查 者：   软件项目组
 *
 * 日    期：   2008-08-29
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
/// 使用Excel－Xml模板打印数据
/// </summary>
public class PrintExcel
{
    #region 内部基本类
    /// <summary>
    /// 定义打印规则信息
    /// </summary>
    private class PrintInfo
    {
        
        #region 定义规则属性
        
        private Dictionary<string, object> list = new Dictionary<string, object>();

        /// <summary>
        /// 读取或设置打印区域类型
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
        /// 读取或设置数据源名称
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
        /// 读取或设置数据源别名
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
        /// 读取或设置页内范围,形如:A3:G16
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
        /// 页内范围
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
        /// 读取或设置单行范围,形如:A3:G16
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
        /// 读取单行范围
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
        /// 读取或设置翻页类别:页|流
        /// 页类别则新页输出当前行,流类别则继续子级输出,不复制父级输出
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
        /// 读取或设置组名称:在流模式输出时,同组打印区域绑定为一个输出流区域,为下一组区域流填充提供区域参考依据
        /// 组名称为空则以项名称为组名称
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
        /// 读取或设置行输出方式:行|列
        /// 行输出方式，先横后纵或先纵后横
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
        /// 读取打印规则初始化对象
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
                    case "类型":
                        if ("文本" == value)
                            pinfo.RegionType = PrintType.Text;
                        else
                            pinfo.RegionType = PrintType.Data;
                        break;
                    case "数据表":
                        pinfo.DbName = value;
                        break;
                    case "别名":
                        pinfo.AliasName = value;
                        break;
                    case "分组":
                        pinfo.GroupName = value;
                        break;
                    case "页范围":
                        Regex r = new Regex("[A-Z]+[0-9]+:[A-Z]+[0-9]+");
                        if (!r.IsMatch(value.ToUpper()))
                            continue;
                        Match m = r.Match(value.ToUpper());
                        pinfo.PageBound = value.ToUpper();
                        break;
                    case "行范围":
                        r = new Regex("[A-Z]+[0-9]+:[A-Z]+[0-9]+");
                        if (!r.IsMatch(value.ToUpper()))
                            continue;
                        m = r.Match(value.ToUpper());
                        pinfo.RowBound = value.ToUpper();
                        break;
                    case "输出方式":
                        if ("列" == value)
                            pinfo.OutRowType = OutRowModel.VeriNextHori;
                        else
                            pinfo.OutRowType = OutRowModel.HoriNextVeri;
                        break;
                    case "翻页模式":
                        if ("右" == value)
                            pinfo.TrunPageType = TrunPageModel.StreamRightMod;
                        else if ("底" == value)
                            pinfo.TrunPageType = TrunPageModel.StreamBottomMod;
                        else if ("流页" == value)
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
            //srcbound范围确定行列范围
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
    /// 打印区域类型:文本/数据
    /// </summary>
    private enum PrintType
    {
        /// <summary>
        /// 文本区,直接复制没有数据
        /// </summary>
        Text,
        /// <summary>
        /// 数据区,使用数据表填充数据
        /// </summary>
        Data
    }

    /// <summary>
    /// 行记录输出模式:先纵|先横；记录输出的方向顺序
    /// </summary>
    private enum OutRowModel
    {
        /// <summary>
        /// 先纵向再横向
        /// </summary>
        VeriNextHori,
        /// <summary>
        /// 先横向再纵向
        /// </summary>
        HoriNextVeri
    }
    /// <summary>
    /// 页记录翻页模式:页模式|右模式|底模式；
    /// 页模式打印区固定输出区域
    /// 流模式分两种: 右模式打印区紧随前一输出区优先右位置打印,底模式打印区紧随前一输出区优先底位置打印
    /// </summary>
    private enum TrunPageModel
    {
        /// <summary>
        /// 页模式:打印区固定固定区域输出,翻页时输出区域都相同
        /// </summary>
        PageMod,
        /// <summary>
        /// 右模式:打印区依次顺序输出,优先紧随右位置其次底位置
        /// </summary>
        StreamRightMod,
        /// <summary>
        /// 底模式:打印区依次顺序输出,优先紧随底位置其次右位置
        /// </summary>
        StreamBottomMod,
        /// <summary>
        /// 流页模式:打印区域依次顺序输出,在具体页上固定位置输出
        /// </summary>
        StreamPageMod
    }

    #endregion

    #region 绑定结果类
    /// <summary>
    /// 数据绑定结果
    /// </summary>
    private class BindResult
    {
        /// <summary>
        /// 绑定结果数据模板,null则绑定结束
        /// </summary>
        public XmlElement xeTemplate;
        
        /// <summary>
        /// 关联的打印区域信息
        /// </summary>
        public PrintInfo printInfo;

        /// <summary>
        /// 父级结果,没有父级则为空
        /// </summary>
        public BindResult parentResult = null;
        /// <summary>
        /// 父项当前行
        /// </summary>
        public int parentRowIndex = -1;

        /// <summary>
        /// 当前填充行行号,-1为结束
        /// </summary>
        public int rowIndex = 0;

        /// <summary>
        /// 当前填充范围
        /// </summary>
        public Bound boundResult = null;
        
        /// <summary>
        /// 当前行范围
        /// </summary>
        public Bound boundRow = null;

        /// <summary>
        /// 子级数据绑定的结果,key/string 是子级关系名
        /// </summary>
        public IDictionary<string, BindResult> resultChildren = new Dictionary<string, BindResult>();

        /// <summary>
        /// 获取子项组填充是否结束,子项组内所有数据项都完成才是完成
        /// </summary>
        /// <param name="grp">打印区组名称或项名称</param>
        /// <returns>是否结束</returns>
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
        /// 初始化子项区域
        /// </summary>
        /// <param name="keyChild">子项名称</param>
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
            //页模式,子项区域按照父项偏差计算
            if (TrunPageModel.PageMod == pinfoChild.TrunPageType)
            {
                rs.boundResult.Left = this.boundRow.Left + (pinfoChild.RwBound.Left - this.printInfo.RwBound.Left);
                rs.boundResult.Top = this.boundRow.Top   + (pinfoChild.RwBound.Top - this.printInfo.RwBound.Top);
                rs.boundResult.Right = rs.boundResult.Left + iwidth;
                rs.boundResult.Bottom = rs.boundResult.Top + iheight;
                return;
            }
            
            //流页模式,检查打印区域是否已经使用,如果使用则区域置空
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
            
            //流模式取最后位置的子项组的区域,没有最后项则取第一个
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
            //第一个填充区，默认区域为第一个行区域
            if (null == lastRs.boundResult)
                lastRs.boundResult = Bound.ParseBound(lastRs.printInfo.RowBound);
            int ileft = lastRs.boundResult.Left;
            int itop = lastRs.boundResult.Top;
            int iright = lastRs.boundResult.Right;
            int ibottom = lastRs.boundResult.Bottom;
            string grp = lastRs.printInfo.GroupName;
            if (null != firstRs && rs!=firstRs)
                lastRs.boundResult = null;
            //与最后位置子项同组则随最后项区域,否则计算同组区域
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
            //优先位置超限则其次位置流,
            //流页模式时先按照底模式计算位置,如果不超限则按照固定位置,否则安超限处理
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
            //超界则为空
            if (rs.boundResult.Right > pinfoChild.PgBound.Right || rs.boundResult.Bottom > pinfoChild.PgBound.Bottom)
                rs.boundResult = null;
        }
    }

    #endregion

    private string strFileTp = "";		//打印的模板文件
	private	DataSet		dataSource=new DataSet("Print");	//数据源        
	private	XmlNamespaceManager	xmlNsMgl;					//名称空间管理
    private IDictionary<string, PrintInfo> printInfoList = new Dictionary<string, PrintInfo>();
    private IList<PrintInfo>               printInfos = new List<PrintInfo>();
    private XmlDocument xmldoc = new XmlDocument();


	#region 公共属性
	/// <summary>
	/// 读取或设置Word打印模板文件全名称;没有模板默认HTML的表格输出
	/// </summary>
	public string	TemplateFileName
	{
		get{return this.strFileTp;}
		set{this.strFileTp=value;}
	}

	/// <summary>
	/// 读取或设置打印数据源
	/// </summary>
	public DataSet	DataSource
	{
		get{return this.dataSource;}
		set{this.dataSource=value;}
	}

	/// <summary>
	/// 获取打印文档
	/// </summary>
	public	XmlDocument		PrintXmlDoc
	{
		get{return this.xmldoc;}
	}

    /// <summary>
    /// 读取数据表扩展属性:最小行记录数
    /// </summary>
    static public string    ExProMinRowCountName
    {
        get { return "MinRowCount"; }
    }

	#endregion

    #region 公共方法
    /// <summary>
    /// 绑定数据源,把模板的标签写入数据
    /// </summary>
    public void DataBind()
    {
        if (string.IsNullOrEmpty(this.TemplateFileName))
        {
            this.bindBlankTemplate();
            return;
        }
        this.initTemplate();
        //有参数表,更新模板的参数表数据字段
        if (this.dataSource.Tables.Contains("参数表"))
        {
            DataTable tabparam = this.dataSource.Tables["参数表"];
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
        //清除模板表格
        XmlNode xnRow = xeTemplate.SelectSingleNode(".//ss:Row", this.xmlNsMgl);
        while (null != xnRow)
        {
            XmlNode xnT = xnRow.NextSibling;
            if ("Row" == xnRow.LocalName)
                xnRow.ParentNode.RemoveChild(xnRow);
            xnRow = xnT;
        }
        //初始化绑定区域结果主从关系
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
        string pagePrint = "类型=文本\n数据表=页\n页范围=A1:{0}{1}\n行范围=A1:{0}{1}";
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
        //按照数据源的表个数循环,行号-1表示已经绑定完,子级数据递归绑定
        //把结果页xeTp加入文档
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
            //分页绑定
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
                //子级范围
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
        //合并单元格
        this.MergeCell(xeTemplate);
    }

    #endregion

    #region 私有方法

    /// <summary>
    /// 绑定空模板
    /// </summary>
    private void bindBlankTemplate()
    {
        //去掉编码声明：<meta http-equiv='Content-Type' content='text/html;charset=utf-8'/>
        //编码声明在有记录和没有记录时显示内容不同(有乱码)
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
                if (col.ColumnName.EndsWith("_字典"))
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
            string[,] strlist = new string[,] { { "管理", "列表" } };
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
    /// 在空模板时，递归绑定行节点
    /// </summary>
    /// <param name="xeRow">填充记录的行元素</param>
    /// <param name="dr">数据记录</param>
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
            if (col.ColumnName.EndsWith("_字典"))
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
                xeCol.InnerText = "√"; 
                xeCol.SetAttribute("align", "center"); 
            }
            else if (false.Equals(v))
            {
                xeCol.InnerText = "×"; 
                xeCol.SetAttribute("align", "center"); 
            }
            else if (cols.Contains(col.ColumnName + "_字典"))
            {
                xeCol.InnerText = Convert.ToString(dr[col.ColumnName + "_字典"]);
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
    /// 初始化模板参数
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
        //初始化打印区域信息
        this.initPrintInfo(xeTemplate);
        
        //初始化模板属性:别名,字段,行,列；每次翻页就把最后一页向后复制
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
                if (!tab.Columns.Contains(fieldName) || !tab.Columns.Contains(fieldName + "_字典"))
                    continue;
                xe.SetAttribute("field", fieldName + "_字典");
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
                //增加了单元格的行号列号
                xeCell.SetAttribute("r", Convert.ToString(rowIndex));
                xeCell.SetAttribute("c", Convert.ToString(colIndex++));
            }
        }//foreach (XmlNode xn in xnRowList)
    }

    /// <summary>
    /// 从模板信息中提取初始化打印区域信息
    /// </summary>
    /// <param name="xeTemplate"></param>
    private void initPrintInfo(XmlElement xeTemplate)
    {
        if (null == xeTemplate)
            return;
        //初始化规则信息
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
        //重排打印区顺序,按照行号,列号,分组排序；同组排在一起,以最靠前的组内项为分组位置
        for (int i = 1; i < this.printInfos.Count; i++)
        {
            PrintInfo prevInfo = this.printInfos[i - 1];
            PrintInfo currInfo = this.printInfos[i];
            int indexgrp = -1, indexpos = -1;
            string grp = currInfo.GroupName;
            for (int j = 0; j < i; j++)
            {
                PrintInfo grpInfo = this.printInfos[j];
                //同组项
                if (grp == grpInfo.GroupName)
                {
                    indexgrp = j;
                    if (currInfo.PgBound.Top < grpInfo.PgBound.Top ||
                        (currInfo.PgBound.Top == grpInfo.PgBound.Top && currInfo.PgBound.Left < grpInfo.PgBound.Left))
                        break;
                    continue;
                }
                //非同组项的前一打印区
                if (indexpos > -1)
                    continue;
                if (currInfo.PgBound.Top < grpInfo.PgBound.Top ||
                    (currInfo.PgBound.Top == grpInfo.PgBound.Top && currInfo.PgBound.Left < grpInfo.PgBound.Left))
                    indexpos = j;
            }
            //重排打印顺序
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
    /// 数据源页内绑定模板,完成绑定则返回-1,非法返回null,内范围超限返回
    /// </summary>
    /// <param name="xeTemplate">独立模板</param>
    /// <param name="drs">数据记录集</param>
    /// <param name="bindEnv">当前绑定结果:当前行及范围</param>
    /// <returns>绑定结果:rowIndex=-1表示绑定完毕</returns>
    private BindResult BindNode(XmlElement xeTemplate, DataRow[] drs, BindResult bindEnv)
    {
        //检查
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
        //当前行位置ileft,itop
        int ileft = bindEnv.boundResult.Left;
        int itop = bindEnv.boundResult.Top;
        while (bindEnv.rowIndex < drs.Length)
        {
            //复制模板区域
            bindEnv.boundRow.Left = ileft;
            bindEnv.boundRow.Top = itop;
            bindEnv.boundResult.Right = bindEnv.boundRow.Right = ileft + (pinfo.RwBound.Right - pinfo.RwBound.Left);
            bindEnv.boundResult.Bottom =bindEnv.boundRow.Bottom  = itop + (pinfo.RwBound.Bottom - pinfo.RwBound.Top);
            this.CopyCell(xeTemplate, pinfo.RowBound, bindEnv.xeTemplate, ileft, itop);
            //更新父项的结果区域
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
            //绑定字段值(父级字段或自身字段)
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
            //页内绑定子级
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
                //检查配置区域是否合理,不在当前区域忽略
                if (pinfoChild.RwBound.Left < pinfo.RwBound.Left || pinfoChild.RwBound.Top < pinfo.RwBound.Top
                    || pinfoChild.RwBound.Right > pinfo.RwBound.Right || pinfoChild.RwBound.Bottom > pinfo.RwBound.Bottom)
                    continue;
                rs.xeTemplate = bindEnv.xeTemplate;
                if (rs.parentRowIndex != bindEnv.rowIndex)
                {
                    rs.parentRowIndex = bindEnv.rowIndex;
                    rs.rowIndex = 0;
                }
                //初始化计算子区域,超界则为空
                bindEnv.initChildBound(key);
                if (null == rs.boundResult)
                    continue;
                //子级范围
                if (PrintType.Text == pinfoChild.RegionType && !bindEnv.isComplete(key))
                {
                    this.CopyCell(xeTemplate, pinfoChild.RowBound, rs.xeTemplate, rs.boundResult.Left, rs.boundResult.Top);
                    rs.rowIndex = -1;
                }
                else if (PrintType.Data == pinfoChild.RegionType && null != rlChild)
                    this.BindNode(xeTemplate, drs[bindEnv.rowIndex].GetChildRows(rlChild), rs);
            }
            //检查是否下一行
            bool isNext = true;
            foreach(BindResult srChild in bindEnv.resultChildren.Values)
                if (srChild.rowIndex > -1)
                { isNext=false; break; }
            if (isNext)
                bindEnv.rowIndex++;
            if (bindEnv.rowIndex >= drs.Length)
                break;
            //根据行输出方式计算下一条记录的区域位置
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
            //检查下一个记录是否页面超限
            if (bindEnv.boundResult.Right > pinfo.PgBound.Right || bindEnv.boundResult.Bottom > pinfo.PgBound.Bottom
                || (itop + pinfo.RwBound.Bottom - pinfo.RwBound.Top) > pinfo.PgBound.Bottom
                || (ileft + pinfo.RwBound.Right - pinfo.RwBound.Left) > pinfo.PgBound.Right)
                return bindEnv;
        }//for (int i = 0; bindEnv.rowIndex < drs.Length; i++)
        //子项重置
        bindEnv.rowIndex = -1;
        foreach (BindResult srChild in bindEnv.resultChildren.Values)
            srChild.parentRowIndex = srChild.rowIndex = -1;
        return bindEnv;
    }

    /// <summary>
    /// 绑定字段单元格数值
    /// </summary>
    /// <param name="xeField">单元格数据节点</param>
    /// <param name="dataRow">绑定行</param>
    /// <returns>已经绑定返回true</returns>
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
                xeField.InnerText = "√";
            else if (false.Equals(v))
                xeField.InnerText = "×";
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
                xeField.InnerText = "√";
            else if (false.Equals(vf))
                xeField.InnerText = "×";
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
    /// 把模板
    /// </summary>
    /// <param name="xeSrcTemplate">样式模板</param>
    /// <param name="srcbound">需要复制的范围:D3:I4</param>
    /// <param name="xeDestTemplate">目标模板</param>
    /// <param name="iLeft">复制点左</param>
    /// <param name="iTop">复制点顶</param>
    private void CopyCell(XmlElement xeSrcTemplate, string srcbound, XmlElement xeDestTemplate, int iLeft, int iTop)
    {
        if (null == xeSrcTemplate || null == xeDestTemplate || string.IsNullOrEmpty(srcbound))
            return;
        Bound bound = Bound.ParseBound(srcbound);
        if (null == bound)
            return;

        //复制单元格
        string strTabFind = "ss:Table/ss:Row/ss:Cell[@r='{0}']";
        string strRowFind = "ss:Cell[@c='{0}']";
        XmlNode xnCellsrc=null, xnCelldest=null, xnRowsrc=null, xnRowdest=null;
        for (int i = bound.Top; i <= bound.Bottom; i++, iTop++)
        {
            //根据前后位置快速定位单元格
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
            //复制单元格
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
    /// 合并单元格(只考虑了行合并)
    /// </summary>
    /// <param name="xeTemplate">Worksheet表格</param>
    private void MergeCell(XmlElement xeTemplate)
    {
        foreach (DataTable tab in this.dataSource.Tables)
        {
            if (!this.printInfoList.ContainsKey(tab.TableName))
                continue;
            PrintInfo pinfo = this.printInfoList[tab.TableName];
            foreach (DataColumn col in tab.Columns)
            {
                if (null == col.ExtendedProperties["merge"] || "是" != Convert.ToString(col.ExtendedProperties["merge"]))
                    continue;
                int rowCount = 0;
                //查找指定单元格
                string strFind = ".//ss:Data[@field='{0}' and (not(@alias) or @alias='{1}')]";
                strFind = string.Format(strFind, col.ColumnName, pinfo.AliasName);
                //查找后续单元格
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
                    //查找下一行同列同字段单元格
                    string strFindNext = "ss:Cell[@c='{0}']/ss:Data[@field='{1}' and (not(@alias) or @alias='{2}')]";
                    strFindNext = string.Format(strFindNext, colIndex, col.ColumnName, pinfo.AliasName);
                    XmlElement xeRowNext = xeRow.NextSibling as XmlElement;
                    XmlElement xeDataNext = xeRowNext.SelectSingleNode(strFindNext,this.xmlNsMgl) as XmlElement;
                    while (null != xeDataNext)
                    {
                        if (xeData.InnerText != xeDataNext.InnerText)
                            break;
                        //邻行同列同值合并单元格
                        rowCount++;
                        XmlElement xeCellNext=xeDataNext.ParentNode as XmlElement;
                        XmlElement xeCellSibling = xeCellNext.NextSibling as XmlElement;
                        if (null != xeCellSibling)
                            xeCellSibling.SetAttribute("Index", this.xmlNsMgl.LookupNamespace("ss"), xeCellSibling.GetAttribute("c"));
                        xeCellNext.ParentNode.RemoveChild(xeCellNext);
                        //下一行
                        xeRowNext = xeRowNext.NextSibling as XmlElement;
                        xeDataNext= xeRowNext.SelectSingleNode(strFindNext,this.xmlNsMgl) as XmlElement;
                    }
                    //邻行同列同值合并单元格
                    if (rowCount > 0)
                        ((XmlElement)xeData.ParentNode).SetAttribute("MergeDown", this.xmlNsMgl.LookupNamespace("ss"), Convert.ToString(rowCount));
                    rowCount = 0;
                    xeData = xeRow.SelectSingleNode(strFind2,this.xmlNsMgl) as XmlElement;
                }
            }
        }
    }

    #endregion

}//public class PrintExcel定义结束
