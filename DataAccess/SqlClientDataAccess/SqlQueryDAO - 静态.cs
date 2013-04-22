using System;
using System.Xml;
using System.Data;
using System.Data.SqlTypes;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Specialized;
using System.IO;
using System.IO.IsolatedStorage;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Estar.Common.Tools;
using Estar.DataAccess.DataAccessInterface;
using System.Configuration;
using System.Web;
using System.Web.Configuration;


namespace Estar.DataAccess.SqlClientDataAccess
{
	/// <summary>
	/// Sql Server 数据访问
	/// </summary>
	public class SqlQueryDAO:IQueryDAO
	{
		private SqlConnection		_conn;		//数据操作的数据库连接
		private SqlDataAdapter		_adapter;	//操作数据的数据适配器:包含自身的select,insert,update,delete规则
		private SqlDataAdapter		_adpCascade;	//级联操作的数据适配器,更新规则来源两个command列表
		private SqlTransaction		_trans;			//外部定制方式启动的数据库事务
		private ArrayList			_listCmdCasInsert;	//级联增加规则列表包含对象是:OracleCommand
		private	ArrayList			_listCmdCasUpdate;	//级联更新规则列表包含对象是:OracleCommand
		private	ArrayList			_listCmdCasDelete;	//级联删除规则列表:OracleCommand
		private XmlDocument			_xmldoc;			//数据项目规则文档
		private string				_xmlfile;			//数据资源文件
        private DataTable dtWorkData;
        //private DataTable dtDataParame;
        private SqlConnection myConnection = new SqlConnection();

        /// <summary>
        /// 缓存数据项
        /// </summary>
        private static XmlDocument xmldocResource = new XmlDocument();

		#region 数据访问规则定义
		/// <summary>
		/// 当前项目名称
		/// </summary>
		private string	_item;
		
		#endregion

		public SqlQueryDAO()
		{
			_xmldoc=new XmlDocument();
			_conn=new SqlConnection();
			_adapter=new SqlDataAdapter("",_conn);
			_adpCascade=new SqlDataAdapter("",_conn);
			_adpCascade.RowUpdated +=new SqlRowUpdatedEventHandler(OnRowUpdated);
			_listCmdCasInsert=new ArrayList();
			_listCmdCasUpdate=new ArrayList();
			_listCmdCasDelete=new ArrayList();
		}

		/// <summary>
		/// 读取和设置数据访问资源文件
		/// </summary>
		public string	XmlFileStr
		{
			get{return this._xmlfile;}
			set
			{
				//if(string.Empty==value) throw new ArgumentNullException("数据访问资源文件不能为空");
                _xmlfile = value;
			}
		}

		/// <summary>
		/// 读取和设置连接字符串
		/// </summary>
		public string	ConnStr
		{
			get{return this._conn.ConnectionString;}
			set{this._conn.ConnectionString=value;}
		}

        public DataTable BindGrid(string strsql)
        {
            string strConn = DataAccRes.DefaultDataConnInfo.Value;
            myConnection = new SqlConnection(strConn);
            try
            {
                myConnection.Open();
            }
            catch (Exception ex) { return null; }
            SqlDataAdapter da = new SqlDataAdapter(strsql, myConnection);
            if (da == null) return null;
            DataTable dt = new DataTable();
            try
            {
                da.Fill(dt);
                myConnection.Close();
                return dt;
            }
            catch (Exception ex)
            {
                //leofun.Alert("生成失败，请检查！", this);
                if (myConnection.State == ConnectionState.Open) myConnection.Close();
                throw (ex);
                return null;
            }

        }

		
		#region 内部成员函数
		/// <summary>
		/// 忽略空的更新
		/// </summary>
		/// <param name="sender">引发事件的对象</param>
		/// <param name="args">事件参数</param>
		protected static void OnRowUpdated(object sender, SqlRowUpdatedEventArgs args)
		{
			if (args.Errors!=null)
				if(args.Errors is DBConcurrencyException)
					args.Status=UpdateStatus.SkipCurrentRow;
		}


		/// <summary>
		/// 转换参数数据类型
		/// </summary>
		/// <param name="sqlParam">Sql参数</param>
		/// <param name="objParam">数据访问实体参数</param>
		protected static void ConvertParam(SqlParameter	sqlParam,Object	objParam)
		{
			if(null==sqlParam)	return;
			if(null==objParam)
			{
				sqlParam.Value=DBNull.Value;
				return;
			}
			try
			{
				switch(sqlParam.DbType)
				{
					case DbType.AnsiString:
					case DbType.AnsiStringFixedLength:
					case DbType.String:
					case DbType.StringFixedLength:
						sqlParam.Value=Convert.ToString(objParam);
						break;
					case DbType.Guid:
						sqlParam.Value=new Guid(objParam.ToString());
						break;
					case DbType.Date:
					case DbType.Time:
					case DbType.DateTime:
						sqlParam.Value=Convert.ToDateTime(objParam);
						break;
					case DbType.Boolean:
                        try
                        {
                            sqlParam.Value = Convert.ToBoolean(objParam);
                        }
                        catch
                        {
                            if (null==objParam || "0" == objParam.ToString() || "false" == objParam.ToString().ToLower() || ""==objParam.ToString())
                                sqlParam.Value = false;
                            else
                                sqlParam.Value = true;
                        }
						break;
					case DbType.Decimal:
						sqlParam.Value=Convert.ToDecimal(objParam);
						break;
					case DbType.Double:
						sqlParam.Value=Convert.ToDouble(objParam);
						break;
					case DbType.Int16:
						sqlParam.Value=Convert.ToInt16(objParam);
						break;
					case DbType.Int32:
						sqlParam.Value=Convert.ToInt32(objParam);
						break;
					case DbType.Int64:
						sqlParam.Value=Convert.ToInt64(objParam);
						break;
					case DbType.Single:
						sqlParam.Value=Convert.ToSingle(objParam);
						break;
					case DbType.UInt16:
						sqlParam.Value=Convert.ToUInt16(objParam);
						break;
					case DbType.UInt32:
						sqlParam.Value=Convert.ToUInt32(objParam);
						break;
					case DbType.UInt64:
						sqlParam.Value=Convert.ToUInt64(objParam);
						break;
					default:
						sqlParam.Value=objParam;
						break;
				}
			}
			catch
			{
				sqlParam.Value=objParam;
			}
			
		}
		/// <summary>
		/// 读取SQLCascade节点规则
		/// </summary>
		/// <param name="lxn_node">SQLCascade节点</param>
        protected void NodeCascade(XmlNode lxn_node, string[] strParams)
        {
            XmlNodeList lxnl_param;
            SqlParameter lp_param;
            string ls_name, ls_srccolumn, ls_version, ls_datatype;
            SqlDbType lty_oratype;
            DataRowVersion lvs_version;
            int li_len;

            if (lxn_node == null) return;
            //合适的节点加入链表中
            string ls_sql = "";
            if (null != lxn_node.FirstChild && XmlNodeType.Text == lxn_node.FirstChild.NodeType)
                ls_sql = lxn_node.FirstChild.Value;

            #region 字符串数组替换SQL预定义
            //LEO 扩充功能，增加宏定义，如 ??num
            // select top ??num * from tab, 约定??num为自定义变量，通过传递的定符串替代之
            // strParams[],为传递的字符串数组，可以做为替换内容
            if (strParams != null && strParams.Length > 0)
            {
                if (ls_sql.IndexOf("@str12") > -1)
                {
                    strParams[2] = strParams[2].Replace("'", "''");
                    strParams[3] = strParams[3].Replace("'", "''");
                    strParams[8] = strParams[8].Replace("'", "''");
                }

                if (strParams[0] != "") ls_sql = ls_sql.Replace("?num0", strParams[0]);
                if (strParams[1] != "") ls_sql = ls_sql.Replace("?num1", strParams[1]);
                if (strParams[7] != "") ls_sql = ls_sql.Replace("?num2", strParams[7]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1=1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1>0", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 = 1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 > 0", strParams[2]);

                if (strParams[3] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[3]);
                    ls_sql = ls_sql.Replace("2>0", strParams[3]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[3]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[3]);
                }
                else if (strParams[8] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[8]);
                    ls_sql = ls_sql.Replace("2>0", strParams[8]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[8]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[8]);
                }

                if (strParams[4] != "") ls_sql = ls_sql.Replace("###", strParams[4]);
                if (strParams[5] != "") ls_sql = ls_sql.Replace("$$$", strParams[5]);
                if (strParams[6] != "") ls_sql = ls_sql.Replace("***", strParams[6]);
                //若有[select]及[from]请换为正常模式
                ls_sql = ls_sql.Replace("[select]", "select");
                ls_sql = ls_sql.Replace("[from]", "from");
            }
            #endregion

            SqlCommand cmd = new SqlCommand(ls_sql, _conn);
            switch (lxn_node.Attributes["name"].Value.ToLower())
            {
                case "select": throw (new Exception("设置了无效的数据访问规则!"));
                case "insert": this._listCmdCasInsert.Add(cmd); break;
                case "update": this._listCmdCasUpdate.Add(cmd); break;
                case "delete": this._listCmdCasDelete.Add(cmd); break;
                default: throw (new Exception("设置了无效的数据访问规则!"));
            }
            //增加参数
            lxnl_param = lxn_node.SelectNodes("Argument");
            foreach (XmlNode lxn_parameter in lxnl_param)
            {
                ls_name = lxn_parameter.Attributes["name"].Value;
                if (null == lxn_parameter.Attributes["srccolumn"] || "" == lxn_parameter.Attributes["srccolumn"].Value)
                    ls_srccolumn = ls_name;
                else
                    ls_srccolumn = lxn_parameter.Attributes["srccolumn"].Value;
                if (null == lxn_parameter.Attributes["datarowversion"] || "" == lxn_parameter.Attributes["datarowversion"].Value)
                    ls_version = "current";
                else
                    ls_version = lxn_parameter.Attributes["datarowversion"].Value;
                if (null == lxn_parameter.Attributes["datatype"] || "" == lxn_parameter.Attributes["datatype"].Value)
                    ls_datatype = "string";
                else
                    ls_datatype = lxn_parameter.Attributes["datatype"].Value;
                if (null == lxn_parameter.Attributes["length"] || "" == lxn_parameter.Attributes["length"].Value)
                    li_len = 0;
                else
                    li_len = Convert.ToInt16(lxn_parameter.Attributes["length"].Value);
                lty_oratype = SqlDbType.VarChar;
                //参数类型
                switch (ls_datatype.ToLower())
                {
                    case "datetime":
                    case "date":
                        lty_oratype = SqlDbType.DateTime; break;
                    case "number":
                    case "float":
                    case "real":
                        lty_oratype = SqlDbType.Float; break;
                    case "decimal":
                        lty_oratype = SqlDbType.Decimal; break;
                    case "money":
                        lty_oratype = SqlDbType.Money; break;
                    case "int":
                        lty_oratype = SqlDbType.Int; break;
                    case "varchar2":
                    case "varchar":
                    case "string":
                        lty_oratype = SqlDbType.VarChar; break;
                    case "char":
                        lty_oratype = SqlDbType.Char; break;
                    case "text":
                        lty_oratype = SqlDbType.Text; break;
                    case "bit":
                    case "bool":
                        lty_oratype = SqlDbType.Bit; break;
                    case "uniqueidentifier":
                    case "guid":
                        lty_oratype = SqlDbType.UniqueIdentifier; break;
                }
                //数据版本
                switch (ls_version.ToLower())
                {
                    case "original":
                        lvs_version = DataRowVersion.Original; break;
                    case "current":
                    default:
                        lvs_version = DataRowVersion.Current; break;
                }
                //三种创建参数的方式:源字段,参数数据长度
                if (ls_srccolumn.Length > 0)
                {
                    if (li_len > 0)
                    {
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len, ls_srccolumn);
                        lp_param.SourceVersion = lvs_version;
                    }
                    else
                    {
                        if (lty_oratype == SqlDbType.VarChar)
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                        else
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                        lp_param.SourceColumn = ls_srccolumn;
                        lp_param.SourceVersion = lvs_version;
                    }
                }
                else if (li_len > 0)
                    lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len);
                else
                {
                    if (lty_oratype == SqlDbType.VarChar)
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                    else
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                }
                cmd.Parameters.Add(lp_param);
            }
        }

        private int toInt(string str)
        {
            int val = 0;
            if (str == null) { return 0; }
            if (str == "") { return 0; };
            str = str.Replace("px", "");
            str = str.Replace("%", "");
            val = int.Parse(str.Replace("px", ""));
            return val;

        }
        protected void ManulSQL(string item, string[] strParams)
        {
            SqlParameter lp_param;
            string ls_name, ls_srccolumn, ls_version, ls_datatype;
            SqlDbType lty_oratype;
            DataRowVersion lvs_version;
            int li_len;

            this._adapter.SelectCommand = null;
            this._adapter.InsertCommand = null;
            this._adapter.UpdateCommand = null;
            this._adapter.DeleteCommand = null;
            this._adpCascade.SelectCommand = null;
            this._adpCascade.InsertCommand = null;
            this._adpCascade.UpdateCommand = null;
            this._adpCascade.DeleteCommand = null;
            this._listCmdCasInsert.Clear();
            this._listCmdCasUpdate.Clear();
            this._listCmdCasDelete.Clear();

            if (item == null) return;
            //合适的节点加入链表中
            string ls_sql = item;

            #region 字符串数组替换SQL预定义
            //LEO 扩充功能，增加宏定义，如 ??num
            if (strParams != null && strParams.Length > 0)
            {
                if (ls_sql.IndexOf("@str12") > -1)
                {
                    strParams[2] = strParams[2].Replace("'", "''");
                    strParams[3] = strParams[3].Replace("'", "''");
                    strParams[8] = strParams[8].Replace("'", "''");
                }

                if (strParams[0] != "") ls_sql = ls_sql.Replace("?num0", strParams[0]);
                if (strParams[1] != "") ls_sql = ls_sql.Replace("?num1", strParams[1]);
                if (strParams[7] != "") ls_sql = ls_sql.Replace("?num2", strParams[7]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1=1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1>0", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 = 1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 > 0", strParams[2]);

                if (strParams[3] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[3]);
                    ls_sql = ls_sql.Replace("2>0", strParams[3]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[3]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[3]);
                }
                else if (strParams[8] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[8]);
                    ls_sql = ls_sql.Replace("2>0", strParams[8]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[8]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[8]);
                }

                if (strParams[4] != "") ls_sql = ls_sql.Replace("###", strParams[4]);
                if (strParams[5] != "") ls_sql = ls_sql.Replace("$$$", strParams[5]);
                if (strParams[6] != "") ls_sql = ls_sql.Replace("***", strParams[6]);
                //若有[select]及[from]请换为正常模式
                ls_sql = ls_sql.Replace("[select]", "select");
                ls_sql = ls_sql.Replace("[from]", "from");
            }
            #endregion

            

            //取参数, 实例目前只支持存贮过程,实例 EXECUTE [proc_dict_systype] @x varchar(50),@y int

            //增加参数
            string strsql = item;
            SqlCommand cmd = null;
            if (ls_sql.IndexOf("@") < 0)
            {
                cmd = new SqlCommand(ls_sql, _conn);
                this._adapter.SelectCommand = cmd;
                return;
            }
            strsql = ls_sql.Substring(0, ls_sql.IndexOf("@"));
            string strparam = ls_sql.Substring(ls_sql.IndexOf("@"), ls_sql.Length - ls_sql.IndexOf("@"));
            char[] sep={','};
            string[] arrParam = strparam.Split(sep);
            //-- 先要处理完整SQL语句
            string s = "";
            for (int i = 0; i < arrParam.Length; i++)
            {
                string[] arrFld = arrParam[i].Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                if (arrFld.Length == 0) break;
                s = s + "," + arrFld[0];
            }
            s = s.Substring(1, s.Length - 1);
            strsql = strsql + " " + s;
            //-- 
            cmd = new SqlCommand(strsql, _conn);
            //exec xsql @客户类型 varchar(50)
            for (int i = 0; i < arrParam.Length; i++)
            {
                string[] arrFld = arrParam[i].Split(" ".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                li_len = 50;
                if (arrFld.Length > 1)
                {
                    ls_srccolumn = arrFld[0].Replace("@", "");
                    ls_version = "current";
                    if (arrFld[1].IndexOf("(") > -1)
                    {
                        string _p1 = arrFld[1].Substring(0, arrFld[1].IndexOf("("));
                        string _p2 = arrFld[1].Substring(arrFld[1].IndexOf("("), arrFld[1].Length-arrFld[1].IndexOf("("));
                        _p2=_p2.Replace("(","");
                        _p2=_p2.Replace(")","");
                        ls_datatype = _p1;
                        li_len = toInt(_p2);
                    }   
                    else
                        ls_datatype = arrFld[1];  //varchar(50)

                }
                else
                {
                    ls_srccolumn = arrFld[0].Replace("@", "");
                    ls_version = "current";
                    ls_datatype = "string";
                    li_len = 50;
                }
                ls_name = ls_srccolumn;
                //参数类型
                lty_oratype = _sqltype(ls_datatype);
                
                //数据版本
                switch (ls_version.ToLower())
                {
                    case "original":
                        lvs_version = DataRowVersion.Original; break;
                    case "current":
                    default:
                        lvs_version = DataRowVersion.Current; break;
                }
                //三种创建参数的方式:源字段,参数数据长度
                if (ls_srccolumn.Length > 0)
                {
                    if (li_len > 0)
                    {
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len, ls_srccolumn);
                        lp_param.SourceVersion = lvs_version;
                    }
                    else
                    {
                        if (lty_oratype == SqlDbType.VarChar)
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                        else
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                        lp_param.SourceColumn = ls_srccolumn;
                        lp_param.SourceVersion = lvs_version;
                    }
                }
                else if (li_len > 0)
                    lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len);
                else
                {
                    if (lty_oratype == SqlDbType.VarChar)
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                    else
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                }
                cmd.Parameters.Add(lp_param);
                this._adapter.SelectCommand = cmd;
            }
        }

        private SqlDbType _sqltype(string ls_datatype)
        {
            SqlDbType lty_oratype = SqlDbType.VarChar;
            switch (ls_datatype.ToLower())
            {
                case "datetime":
                case "date":
                    lty_oratype = SqlDbType.DateTime; break;
                case "number":
                case "float":
                case "real":
                    lty_oratype = SqlDbType.Float; break;
                case "decimal":
                    lty_oratype = SqlDbType.Decimal; break;
                case "money":
                    lty_oratype = SqlDbType.Money; break;
                case "int":
                    lty_oratype = SqlDbType.Int; break;
                case "varchar2":
                case "varchar":
                case "string":
                    lty_oratype = SqlDbType.VarChar; break;
                case "char":
                    lty_oratype = SqlDbType.Char; break;
                case "text":
                    lty_oratype = SqlDbType.Text; break;
                case "bit":
                case "bool":
                    lty_oratype = SqlDbType.Bit; break;
                case "uniqueidentifier":
                case "guid":
                    lty_oratype = SqlDbType.UniqueIdentifier; break;
            }
            return lty_oratype;
        }
		/// <summary>
		/// 读取SQLCascade节点规则
		/// </summary>
		/// <param name="lxn_node">SQLCascade节点</param>
        protected void NodeCascade(XmlNode lxn_node)
        {
            this.NodeCascade(lxn_node, null);
        }

        /// <summary>
        /// 读取SQLText节点
        /// </summary>
        /// <param name="lxn_node">SQL语句节点</param>
        protected void NodeText(XmlNode lxn_node)
        {
            this.NodeText(lxn_node, null);
        }

        /// <summary>
        /// 读取SQLText节点
        /// </summary>
        /// <param name="lxn_node">SQL语句节点</param>
        /// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
        protected void NodeText(XmlNode lxn_node, string[] strParams)
        {
            XmlNodeList lxnl_param;
            SqlParameter lp_param;
            string ls_name, ls_srccolumn, ls_version, ls_datatype;
            SqlDbType lty_oratype;
            DataRowVersion lvs_version;
            int li_len;


            if (lxn_node == null) return;
            string ls_sql = "";
            if (null != lxn_node.FirstChild && XmlNodeType.Text == lxn_node.FirstChild.NodeType)
                ls_sql = lxn_node.FirstChild.Value;

            #region 字符串数组替换SQL预定义
            //LEO 扩充功能，增加宏定义，如 ??num
            // select top ??num * from tab, 约定??num为自定义变量，通过传递的定符串替代之
            // strParams[],为传递的字符串数组，可以做为替换内容
            if (strParams != null && strParams.Length > 0)
            {
                if (ls_sql.IndexOf("@str12") > -1)
                {
                    strParams[2] = strParams[2].Replace("'", "''");
                    strParams[3] = strParams[3].Replace("'", "''");
                    strParams[8] = strParams[8].Replace("'", "''");
                }
                if (strParams[0] != "") ls_sql = ls_sql.Replace("?num0", strParams[0]);
                if (strParams[1] != "") ls_sql = ls_sql.Replace("?num1", strParams[1]);
                if (strParams[7] != "") ls_sql = ls_sql.Replace("?num2", strParams[7]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1=1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1>0", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 = 1", strParams[2]);
                if (strParams[2] != "") ls_sql = ls_sql.Replace("1 > 0", strParams[2]);

                if (strParams[3] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[3]);
                    ls_sql = ls_sql.Replace("2>0", strParams[3]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[3]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[3]);
                }
                else if (strParams[8] != "")
                {
                    ls_sql = ls_sql.Replace("2=2", strParams[8]);
                    ls_sql = ls_sql.Replace("2>0", strParams[8]);
                    ls_sql = ls_sql.Replace("2 = 2", strParams[8]);
                    ls_sql = ls_sql.Replace("2 > 0", strParams[8]);
                }

                if (strParams[4] != "") ls_sql = ls_sql.Replace("###", strParams[4]);
                if (strParams[5] != "") ls_sql = ls_sql.Replace("$$$", strParams[5]);
                if (strParams[6] != "") ls_sql = ls_sql.Replace("***", strParams[6]);
                //若有[select]及[from]请换为正常模式
                ls_sql = ls_sql.Replace("[select]", "select");
                ls_sql = ls_sql.Replace("[from]", "from");
            }
            #endregion

            //替代后，应为正常的数据源
            SqlCommand cmd = new SqlCommand(ls_sql, _conn);
            string sqltype = lxn_node.Attributes["name"].Value.ToLower();
            switch (sqltype)
            {
                case "select": 
                    this._adapter.SelectCommand = cmd; 
                    break;
                case "insert": 
                    this._adapter.InsertCommand = cmd; 
                    break;
                case "update": 
                    this._adapter.UpdateCommand = cmd; 
                    break;
                case "delete": 
                    this._adapter.DeleteCommand = cmd; 
                    break;
                default: 
                    throw (new Exception("设置了无效的数据访问规则!"));
            }
            //增加参数
            lxnl_param = lxn_node.SelectNodes("Parameter");
            foreach (XmlNode lxn_parameter in lxnl_param)
            {
                ls_name = lxn_parameter.Attributes["name"].Value;
                if (null == lxn_parameter.Attributes["srccolumn"] || "" == lxn_parameter.Attributes["srccolumn"].Value)
                    ls_srccolumn = ls_name;
                else
                    ls_srccolumn = lxn_parameter.Attributes["srccolumn"].Value;
                if (null == lxn_parameter.Attributes["datarowversion"] || "" == lxn_parameter.Attributes["datarowversion"].Value)
                    ls_version = "current";
                else
                    ls_version = lxn_parameter.Attributes["datarowversion"].Value;
                if (null == lxn_parameter.Attributes["datatype"] || "" == lxn_parameter.Attributes["datatype"].Value)
                    ls_datatype = "string";
                else
                    ls_datatype = lxn_parameter.Attributes["datatype"].Value;
                if (null == lxn_parameter.Attributes["length"] || "" == lxn_parameter.Attributes["length"].Value)
                    li_len = 0;
                else
                    try
                    {
                        li_len = Convert.ToInt16(lxn_parameter.Attributes["length"].Value);
                    }
                    catch
                    {
                        li_len = 0;
                    }
                lty_oratype = SqlDbType.VarChar;
                //参数类型
                switch (ls_datatype.ToLower())
                {
                    case "datetime":
                    case "date":
                        lty_oratype = SqlDbType.DateTime; break;
                    case "number":
                    case "float":
                    case "real":
                        lty_oratype = SqlDbType.Float; break;
                    case "decimal":
                        lty_oratype = SqlDbType.Decimal; break;
                    case "money":
                        lty_oratype = SqlDbType.Money; break;
                    case "int":
                        lty_oratype = SqlDbType.Int; break;
                    case "char":
                        lty_oratype = SqlDbType.Char; break;
                    case "bit":
                    case "bool":
                        lty_oratype = SqlDbType.Bit; break;
                    case "varchar":
                    case "varchar2":
                    case "string":
                        lty_oratype = SqlDbType.VarChar; break;
                    case "text":
                        lty_oratype = SqlDbType.Text; break;
                    case "uniqueidentifier":
                    case "guid":
                        lty_oratype = SqlDbType.UniqueIdentifier; break;
                }
                //数据版本
                switch (ls_version.ToLower())
                {
                    case "original":
                        lvs_version = DataRowVersion.Original; break;
                    case "current":
                    default:
                        lvs_version = DataRowVersion.Current; break;
                }
                //三种创建参数的方式:源字段,参数数据长度
                if (ls_srccolumn.Length > 0)
                {
                    if (li_len > 0)
                    {
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len, ls_srccolumn);
                        lp_param.SourceVersion = lvs_version;
                    }
                    else
                    {
                        if (lty_oratype == SqlDbType.VarChar)
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                        else
                            lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                        lp_param.SourceColumn = ls_srccolumn;
                        lp_param.SourceVersion = lvs_version;
                    }
                }
                else if (li_len > 0)
                    lp_param = new SqlParameter("@" + ls_name, lty_oratype, li_len);
                else
                {
                    if (lty_oratype == SqlDbType.VarChar)
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype, -1);
                    else
                        lp_param = new SqlParameter("@" + ls_name, lty_oratype);
                }
                cmd.Parameters.Add(lp_param);
            }	//foreach(XmlNode lxn_parameter in lxnl_param)
        }

		/// <summary>
		/// 利用参数来更新数据
		/// </summary>
		/// <param name="ps_item">要更新的数据项目</param>
		/// <param name="ps_optype">更新操作类型(insert,update,delete)</param>
		/// <param name="p_paramlist">参数列表</param>
		/// <returns>是否成功</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList	parameters)
		{
			string	ls_key;
			SqlCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			SqlParameter		param;			//命令用到的参数
			SqlTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			//根据操作类型提取OracleCommand命令
			switch(ps_optype.ToLower())
			{
				case "insert":
					cmd=this._adapter.InsertCommand;
					listCmdCascade=this._listCmdCasInsert;
					break;
				case "update":
					cmd=this._adapter.UpdateCommand;
					listCmdCascade=this._listCmdCasUpdate;
					break;
				case "delete":
					cmd=this._adapter.DeleteCommand;
					listCmdCascade=this._listCmdCasDelete;
					break;
				default: throw(new Exception("设置了无效的数据访问规则!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//传递参数
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					for(int i=0;i<parameters.Count;i++)
					{
						ls_key=parameters.Keys[i];
						if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
						param=cmdtemp.Parameters["@"+ls_key];
						if(param==null)	continue;
						SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int i=0;i<cmdtemp.Parameters.Count;i++)
					{
						if(null==cmdtemp.Parameters[i].Value)
							cmdtemp.Parameters[i].Value=DBNull.Value;
					}
				}
				//打开数据库，提交数据
				this._conn.Open();
				trans=_conn.BeginTransaction();
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					cmdtemp.Transaction=trans;
					cmdtemp.ExecuteNonQuery();
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                errInfo["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex,errInfo);
				this._conn.Close();
				listCmdCascade.RemoveAt(0);
				return false;
			}
			finally
			{
				this._conn.Close();
				if(listCmdCascade.Count>0)
					listCmdCascade.RemoveAt(0);
			}
			return true;
		}

		/// <summary>
		/// 利用参数数组来批量更新数据
		/// </summary>
		/// <param name="ps_item">要更新的数据项目</param>
		/// <param name="ps_optype">更新操作类型(insert,update,delete)</param>
		/// <param name="p_paramlist">参数列表</param>
		/// <returns>是否成功</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList[]	parameterslist)
		{
			string	ls_key;
			SqlCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			SqlParameter		param;			//命令用到的参数
			SqlTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			//根据操作类型提取OracleCommand命令
			switch(ps_optype.ToLower())
			{
				case "insert":
					cmd=this._adapter.InsertCommand;
					listCmdCascade=this._listCmdCasInsert;
					break;
				case "update":
					cmd=this._adapter.UpdateCommand;
					listCmdCascade=this._listCmdCasUpdate;
					break;
				case "delete":
					cmd=this._adapter.DeleteCommand;
					listCmdCascade=this._listCmdCasDelete;
					break;
				default: throw(new Exception("设置了无效的数据访问规则!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//传递参数
				this._conn.Open();
				trans=_conn.BeginTransaction();
				foreach(NameObjectList	parameters in parameterslist)
				{
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						for(int i=0;i<parameters.Count;i++)
						{
							ls_key=parameters.Keys[i];
							if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
							param=cmdtemp.Parameters["@"+ls_key];
							if(param==null)	continue;
							SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
						}
						for(int i=0;i<cmdtemp.Parameters.Count;i++)
						{
							if(null==cmdtemp.Parameters[i].Value)
								cmdtemp.Parameters[i].Value=DBNull.Value;
						}
					}
					//打开数据库，提交数据
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						cmdtemp.Transaction=trans;
						cmdtemp.ExecuteNonQuery();
					}
				}
				trans.Commit();
				
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                listCmdCascade.RemoveAt(0);
				_conn.Close();
				return false;
			}
			finally
			{ this._conn.Close();}
			return true;
		}

		/// <summary>
		/// 利用参数来更新数据
		/// </summary>
		/// <param name="ps_item">要更新的数据项目</param>
		/// <param name="ps_optype">更新操作类型(insert,update,delete)</param>
		/// <param name="p_paramlist">参数列表</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>是否成功</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList	parameters,string[] strParams)
		{
			string	ls_key;
			SqlCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			SqlParameter		param;			//命令用到的参数
			SqlTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			//根据操作类型提取OracleCommand命令
			switch(ps_optype.ToLower())
			{
				case "insert":
					cmd=this._adapter.InsertCommand;
					listCmdCascade=this._listCmdCasInsert;
					break;
				case "update":
					cmd=this._adapter.UpdateCommand;
					listCmdCascade=this._listCmdCasUpdate;
					break;
				case "delete":
					cmd=this._adapter.DeleteCommand;
					listCmdCascade=this._listCmdCasDelete;
					break;
				default: throw(new Exception("设置了无效的数据访问规则!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//传递参数
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					for(int i=0;i<parameters.Count;i++)
					{
						ls_key=parameters.Keys[i];
						if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
						param=cmdtemp.Parameters["@"+ls_key];
						if(param==null)	continue;
						SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int i=0;i<cmdtemp.Parameters.Count;i++)
					{
						if(null==cmdtemp.Parameters[i].Value)
							cmdtemp.Parameters[i].Value=DBNull.Value;
					}
				}
				//打开数据库，提交数据
				this._conn.Open();
				trans=_conn.BeginTransaction();
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					cmdtemp.Transaction=trans;
					cmdtemp.ExecuteNonQuery();
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                this._conn.Close();
				listCmdCascade.RemoveAt(0);
				return false;
			}
			finally
			{
				this._conn.Close();
				if(listCmdCascade.Count>0)
					listCmdCascade.RemoveAt(0);
			}
			return true;
		}

		/// <summary>
		/// 利用参数数组来批量更新数据
		/// </summary>
		/// <param name="ps_item">要更新的数据项目</param>
		/// <param name="ps_optype">更新操作类型(insert,update,delete)</param>
		/// <param name="p_paramlist">参数列表</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>是否成功</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList[]	parameterslist,string[] strParams)
		{
			string	ls_key;
			SqlCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			SqlParameter		param;			//命令用到的参数
			SqlTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			//根据操作类型提取OracleCommand命令
			switch(ps_optype.ToLower())
			{
				case "insert":
					cmd=this._adapter.InsertCommand;
					listCmdCascade=this._listCmdCasInsert;
					break;
				case "update":
					cmd=this._adapter.UpdateCommand;
					listCmdCascade=this._listCmdCasUpdate;
					break;
				case "delete":
					cmd=this._adapter.DeleteCommand;
					listCmdCascade=this._listCmdCasDelete;
					break;
				default: throw(new Exception("设置了无效的数据访问规则!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//传递参数
				this._conn.Open();
				trans=_conn.BeginTransaction();
				foreach(NameObjectList	parameters in parameterslist)
				{
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						for(int i=0;i<parameters.Count;i++)
						{
							ls_key=parameters.Keys[i];
							if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
							param=cmdtemp.Parameters["@"+ls_key];
							if(param==null)	continue;
							SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
						}
						for(int i=0;i<cmdtemp.Parameters.Count;i++)
						{
							if(null==cmdtemp.Parameters[i].Value)
								cmdtemp.Parameters[i].Value=DBNull.Value;
						}
					}
					//打开数据库，提交数据
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						cmdtemp.Transaction=trans;
						cmdtemp.ExecuteNonQuery();
					}
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                listCmdCascade.RemoveAt(0);
				_conn.Close();
				return false;
			}
			finally
			{ this._conn.Close();}
			return true;
		}


		#endregion

		#region IQueryDAO 成员

        private XmlNode setXmlDataItem(string _dataitem)
        {
            //从缓存获取
            string item = _dataitem;
            if (!item.Contains(":"))
                item = this.XmlFileStr + ":" + item;
            XmlNode xnItem = SqlQueryDAO.xmldocResource.SelectSingleNode(string.Format("/*/DataItem[@name='{0}']", item));
            if (null != xnItem) return xnItem;
            //从缓存获取 结束

            //读取数据库配置生成数据项配置节点
            string strXml = "<DataItem name='" + _dataitem  + "'></DataItem>";
            XmlDocument myXmldoc = new XmlDocument();
            myXmldoc.LoadXml(strXml);
            CreateDataTable(_dataitem);
            myXmldoc = CreateXmlNode(myXmldoc);
            strXml = "<DataAccess name='hmdata'>" + myXmldoc.InnerXml + "</DataAccess>";
            myXmldoc.LoadXml(strXml);
            XmlNode myxmlnode = myXmldoc.DocumentElement.SelectSingleNode("DataItem");
            //查是否存在insert以及是否update有参数，如果没有，则用insert的数据补充
            //XmlNodeList updatenodes = myxmlnode.SelectNodes("SQLText[@name='update']/Parameter");
            //if (updatenodes.Count == 0)
            //{
            //    XmlNodeList insertnodes = myxmlnode.SelectNodes("SQLText[@name='insert']/Parameter");
            //    if (insertnodes.Count > 0)
            //    {
            //        XmlNode unode = myxmlnode.SelectSingleNode("SQLText[@name='update']");
            //        XmlElement elem = myXmldoc.CreateElement("Parameter");
            //        unode.AppendChild(elem);                    
            //    }
            //}

            //缓存数据项
            if (null == SqlQueryDAO.xmldocResource.DocumentElement)
                xmldocResource.LoadXml("<DataAccess name='hmdata'></DataAccess>");
            xnItem = SqlQueryDAO.xmldocResource.CreateElement("DataItem");
            xnItem = xmldocResource.DocumentElement.AppendChild(xnItem);
            ((XmlElement)xnItem).SetAttribute("name", item);
            xnItem.InnerXml = myxmlnode.InnerXml;
            //缓存数据项 结束

            return xnItem;
        }

        private XmlDocument CreateXmlNode(XmlDocument myxmldoc)
        {
            if (this.dtWorkData == null) return myxmldoc;
            DataRow[] drUnit = this.dtWorkData.Select("ntype='DataItem'");
            if (drUnit.Length < 1) return myxmldoc;
            DataTable dtParamInsert = new DataTable();
            for (int i = 0; i < drUnit[0].Table.Columns.Count; i++)
            {
                if (drUnit[0].Table.Columns[i].ColumnName == "ID"
                     || drUnit[0].Table.Columns[i].ColumnName == "PID" 
                     || drUnit[0].Table.Columns[i].ColumnName == "code" 
                     || drUnit[0].Table.Columns[i].ColumnName == "text"
                     || drUnit[0].Table.Columns[i].ColumnName == "pcode" 
                     || drUnit[0].Table.Columns[i].ColumnName == "ntype")
                    continue;

                if ((drUnit[0][i].ToString() == "") ||
                    (drUnit[0].Table.Columns[i].DataType.FullName == "System.Boolean" && drUnit[0][i].ToString() == "False"))
                    continue;
                myxmldoc.DocumentElement.Attributes.Append(myxmldoc.CreateAttribute(drUnit[0].Table.Columns[i].ColumnName));
                myxmldoc.DocumentElement.Attributes[drUnit[0].Table.Columns[i].ColumnName].Value = drUnit[0][i].ToString();
            }

            XmlNode root = myxmldoc.DocumentElement;
            DataRow[] drItem = this.dtWorkData.Select("ntype='SQLText'");
            if (drItem != null)
            {
                for (int i = 0; i < drItem.Length; i++)
                {
                    XmlElement elem = myxmldoc.CreateElement("SQLText");
                    root.AppendChild(elem);
                    for (int j = 0; j < drItem[i].Table.Columns.Count; j++)
                    {
                        if (drItem[i].Table.Columns[j].ColumnName == "ID"
                            || drItem[i].Table.Columns[j].ColumnName == "PID"
                            || drItem[i].Table.Columns[j].ColumnName == "code"
                            || drItem[i].Table.Columns[j].ColumnName == "text"
                            || drItem[i].Table.Columns[j].ColumnName == "pcode"
                            || drItem[i].Table.Columns[j].ColumnName == "ntype")
                            continue;

                        if ((drItem[i][j].ToString() == "") ||
                            (drItem[i].Table.Columns[j].DataType.FullName == "System.Boolean" && drItem[i][j].ToString() == "False"))
                            continue;
                        if (drItem[i].Table.Columns[j].ColumnName == "name")
                        {
                            elem.Attributes.Append(myxmldoc.CreateAttribute(drItem[i].Table.Columns[j].ColumnName));
                            elem.Attributes[drItem[i].Table.Columns[j].ColumnName].Value = drItem[i][j].ToString();
                        }
                        else
                            if (drItem[i].Table.Columns[j].ColumnName == "sqltext")
                            {
                                elem.InnerText = drItem[i][j].ToString();
                            }
                    }
                    //增加columns节点及属性
                    string systemdb = DataAccRes.AppSettings("SystemDB");
                    if (systemdb == "" || systemdb == null) systemdb = "hmsys";
                    string sqltext = "execute [" + systemdb + "].[dbo].[proc_sys_parameters] '" + drItem[i]["ID"].ToString() + "'";
                    DataTable dtParameters = BindGrid(sqltext);
                    if (drItem[i]["name"].ToString()  == "insert")  dtParamInsert = dtParameters;
                    if ((drItem[i]["name"].ToString() == "update") && (dtParameters.Rows.Count == 0) && dtParamInsert != null)
                    {
                           
                        dtParameters = dtParamInsert;
                    }
                    DataRow[] drcols = dtParameters.Select();
                    for (int k = 0; k < drcols.Length; k++)
                    {
                        elem = myxmldoc.CreateElement("Parameter");
                        for (int n = 0; n < drcols[k].Table.Columns.Count; n++)
                        {
                            if (drcols[k].Table.Columns[n].ColumnName == "code"
                                || drcols[k].Table.Columns[n].ColumnName == "PID"
                                || drcols[k].Table.Columns[n].ColumnName == "text"
                                || drcols[k].Table.Columns[n].ColumnName == "pcode"
                                || drcols[k].Table.Columns[n].ColumnName == "ntype")
                                continue;
                            if ((drcols[k][n].ToString() == "") ||
                                (drcols[k].Table.Columns[n].DataType.FullName == "System.Boolean" && drcols[k][n].ToString() == "False"))
                                continue;
                            XmlNode itemnode = root.SelectSingleNode("SQLText[@name='" + drItem[i]["name"] + "']");
                            elem.Attributes.Append(myxmldoc.CreateAttribute(drcols[k].Table.Columns[n].ColumnName));
                            string cVal = drcols[k][n].ToString();
                            if (drcols[k].Table.Columns[n].DataType.FullName == "System.Boolean" && drcols[k][n].ToString() == "True")
                                cVal = "1";
                            elem.Attributes[drcols[k].Table.Columns[n].ColumnName].Value = cVal;
                            itemnode.AppendChild(elem);
                        }
                    }
                }
            }
            return myxmldoc;
        }
        private void CreateDataTable(string item)
        {
            string datapath = this.XmlFileStr;
            string dataname = item;
            if (item.IndexOf(":") > -1)
            {
                datapath = item.Substring(0, item.IndexOf(":"));
                dataname = item.Substring(item.IndexOf(":")+1, item.Length - item.IndexOf(":")-1);
            }
            string systemdb = DataAccRes.AppSettings("SystemDB");
            if (systemdb == "" || systemdb == null) systemdb = "hmsys";
            string sqltext = "execute [" + systemdb + "].[dbo].[proc_sys_dataitem] '" + datapath + "','" + dataname + "'";
            this.dtWorkData = BindGrid(sqltext);
        }
        
		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <returns>返回是否成功</returns>
		public bool SetItem(string item)
		{
            XmlNode lxn_item;	//数据访问项目节点
            XmlNodeList lxnl_cmdsql;		//命令节点列表
            this._item = "";		//重置数据访问项目为空
            lxn_item = setXmlDataItem(item);
            if (lxn_item == null)
                throw (new Exception("系统资源没有提供 " + item + " 数据的访问规则!"));
			//设置项目规则
            this._adapter.SelectCommand = null;
            this._adapter.InsertCommand = null;
            this._adapter.UpdateCommand = null;
            this._adapter.DeleteCommand = null;
            this._adpCascade.SelectCommand = null;
            this._adpCascade.InsertCommand = null;
            this._adpCascade.UpdateCommand = null;
            this._adpCascade.DeleteCommand = null;
            this._listCmdCasInsert.Clear();
            this._listCmdCasUpdate.Clear();
            this._listCmdCasDelete.Clear();
            lxnl_cmdsql = lxn_item.SelectNodes("SQLText");
            foreach (XmlNode lxn_node in lxnl_cmdsql)
                this.NodeText(lxn_node);
            //设置级联规则;级联规则在链表中,所以首选清空链表
            this._listCmdCasDelete.Clear();
            this._listCmdCasUpdate.Clear();
            lxnl_cmdsql = lxn_item.SelectNodes("SQLCascade");
            foreach (XmlNode lxn_node in lxnl_cmdsql)
                this.NodeCascade(lxn_node);
            this._item = item;
            return true;
        }

		
		#region 只读的参数属性
		/// <summary>
		/// 读取当前访问的数据源项目select参数列表
		/// </summary>
		public NameParamCollection		SelParamList
		{
			get
			{
				NameParamCollection		paramList=null;
				if(null!=this._adapter.SelectCommand)
					paramList= new NameParamCollection(this._adapter.SelectCommand.Parameters);
				return paramList;
			}
		}

		/// <summary>
		/// 读取当前访问的数据源项目insert参数列表
		/// </summary>
		public NameParamCollection		InsParamList
		{
			get
			{
				NameParamCollection		paramList=null;
				if(null!=this._adapter.InsertCommand)
					paramList= new NameParamCollection(this._adapter.InsertCommand.Parameters);
				return paramList;
			}
		}

		/// <summary>
		/// 读取当前访问的数据源项目update参数列表
		/// </summary>
		public NameParamCollection		UptParamList
		{
			get
			{
				NameParamCollection		paramList=null;
				if(null!=this._adapter.UpdateCommand)
					paramList= new NameParamCollection(this._adapter.UpdateCommand.Parameters);
				return paramList;
			}
		}

		/// <summary>
		/// 读取当前访问的数据源项目delete参数列表
		/// </summary>
		public NameParamCollection		DelParamList
		{
			get
			{
				NameParamCollection		paramList=null;
				if(null!=this._adapter.DeleteCommand)
					paramList= new NameParamCollection(this._adapter.DeleteCommand.Parameters);
				return paramList;
			}
		}

		#endregion

		#region 只读的执行命令
		/// <summary>
		/// 读取当前访问的数据源项目select命令
		/// </summary>
		public DBCommand		SelCommand
		{
			get
			{
				DBCommand	cmd=null;
				if(null!=this._adapter.SelectCommand)
					cmd= new DBCommand(this._adapter.SelectCommand);
				return cmd;
			}
		}


		/// <summary>
		/// 读取当前访问的数据源项目insert命令
		/// </summary>
		public DBCommand		InsCommand
		{
			get
			{
				DBCommand	cmd=null;
				if(null!=this._adapter.InsertCommand)
					cmd= new DBCommand(this._adapter.InsertCommand);
				return cmd;
			}
		}


		/// <summary>
		/// 读取当前访问的数据源项目update命令
		/// </summary>
		public DBCommand		UptCommand
		{
			get
			{
				DBCommand	cmd=null;
				if(null!=this._adapter.UpdateCommand)
					cmd= new DBCommand(this._adapter.UpdateCommand);
				return cmd;
			}
		}


		/// <summary>
		/// 读取当前访问的数据源项目delete命令
		/// </summary>
		public DBCommand		DelCommand
		{
			get
			{
				DBCommand	cmd=null;
				if(null!=this._adapter.DeleteCommand)
					cmd= new DBCommand(this._adapter.DeleteCommand);
				return cmd;
			}
		}

		#endregion

		#region 外部定制事务方法
        
        /// <summary>
        /// 启动数据库连接
        /// </summary>
        /// <returns>是否成功</returns>
        public bool Open()
        {
            bool isSuccess = true;
            try
            {
                this._conn.Open();
                this._trans = null;
            }
            catch (Exception ex)
            {
                if (null != this._conn && this._conn.State == ConnectionState.Open && this._trans != null)
                    this._trans.Rollback();
                this._trans = null;
                throw (ex);
            }
            return isSuccess;
        }

        /// <summary>
		/// 启动数据库连接并开始事务
		/// </summary>
		/// <returns></returns>
		public bool		BeginTransaction()
		{
			bool	isSuccess=true;
			try
			{
				this._conn.Open();
				this._trans=this._conn.BeginTransaction();
			}
			catch ( Exception ex )
			{
				if(null!=this._conn && this._conn.State==ConnectionState.Open && this._trans!=null)
					this._trans.Rollback();
				this._trans=null;
				throw(ex);
			}
			return isSuccess;
		}


		/// <summary>
		/// 提交次此事务,并关闭数据库连接
		/// </summary>
		/// <returns></returns>
		public bool		Commit()
		{
			bool	isSuccess=true;
			try
			{
				this._trans.Commit();
			}
			catch ( Exception ex )
			{
				if(null!=this._conn && this._conn.State==ConnectionState.Open && this._trans!=null)
					this._trans.Rollback();
				this._trans=null;
				throw( ex );
			}
			return isSuccess;
		}

		/// <summary>
		/// 回滚次此事务,并关闭数据库连接,没有事务直接关闭
		/// </summary>
		/// <returns></returns>
		public bool		RollbackAndClose()
		{
			bool	isSuccess=true;
			try
			{
				if(null!=this._conn && this._conn.State==ConnectionState.Open && this._trans!=null)
					try{this._trans.Rollback();}
					catch{}
				this._trans=null;
				this._conn.Close();
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
			}
			return isSuccess;
		}

		/// <summary>
		/// 关闭数据库
		/// </summary>
		/// <returns></returns>
		public bool		Close()
		{
			bool	isSuccess=true;
			try
			{
				this._trans=null;
                if (null != this._conn && this._conn.State == ConnectionState.Open && this._trans != null)
                    try { this._trans.Commit(); }
                    catch { this._trans.Rollback(); }
				this._conn.Close();
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
			}
			return isSuccess;
		}


		#endregion 


        /// <summary>
        /// 根据项目名称和参数列表获取单个结果
        /// </summary>
        /// <param name="item">数据项目名称</param>
        /// <param name="parameters">查询参数列表</param>
        /// <returns>返回结果</returns>
        public object ExecuteScalar(string item, NameObjectList parameters)
        {
            string ls_key;
            DataTable tab = new DataTable(item);
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1)
                return null;
            object objResult = null;
            SqlCommand cmd = this._adapter.SelectCommand;
            SqlParameter param;
            try
            {
                for (int i = 0; i < parameters.Count; i++)
                {
                    ls_key = parameters.Keys[i];
                    if (cmd.Parameters.IndexOf("@" + ls_key) < 0) continue;
                    param = cmd.Parameters["@" + ls_key];
                    if (param == null) continue;		//传入没有的参数时忽略
                    SqlQueryDAO.ConvertParam(param, parameters[ls_key]);
                }
                for (int i = 0; i < cmd.Parameters.Count; i++)
                {
                    if (null == cmd.Parameters[i].Value)
                        cmd.Parameters[i].Value = DBNull.Value;
                }
                this._conn.Open();
                objResult = this._adapter.SelectCommand.ExecuteScalar();
            }
            catch (Exception ex)
            {
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
            }
            finally
            {
                _conn.Close();
            }
            return objResult;
        }

		/// <summary>
		/// 根据项目名称和参数列表获取数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <returns>返回DataTable的数据集</returns>
		public DataTable GetDataTable(string item, NameObjectList parameters)
		{
			string	ls_key;
			DataTable tab=new DataTable(item);
            if (item.ToLower().IndexOf("execute ") > -1 || item.ToLower().IndexOf("exec ") > -1)
            {
                ManulSQL(item, null);
            }
            else
            {
                if (item != this._item)
                    this.SetItem(item);
                if (this._item.Length < 1)
                    return null;
            }
			SqlCommand	cmd=this._adapter.SelectCommand;
            if (cmd==null) return null;
			SqlParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					if(cmd.Parameters.IndexOf("@"+ls_key)<0)	continue;
					param=cmd.Parameters["@"+ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
				}
				for(int i=0;i<cmd.Parameters.Count;i++)
				{
					if(null==cmd.Parameters[i].Value)
						cmd.Parameters[i].Value=DBNull.Value;
				}
				this._adapter.Fill(tab);
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                errInfo["数据文件"] = this._xmlfile;
                errInfo["数据源"] = this._item;
                if(cmd!=null)
                {
                    if (cmd.CommandText == "")
                        errInfo["SQL语句"] = "未书写SQL";
                    else
                        errInfo["SQL语句"] = cmd.CommandText;
                }
                else
                    errInfo["SQL语句"] = "[" + this._item +"]未书写正确！";
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
				return null;
			}
			return tab;
		}
		

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <param name="ds">数据集</param>
		/// <returns></returns>
		public	int			FillDataSet(string item, NameObjectList parameters,DataSet ds)
		{
            string ls_key;
            int irtn = 0;
            if (item.ToLower().IndexOf("execute ") > -1 || item.ToLower().IndexOf("exec ") > -1 || item.ToLower().IndexOf("select ") > -1)
                ManulSQL(item, null);
            else
            {
                if (item != this._item)
                    this.SetItem(item);
                if (this._item.Length < 1)
                    return irtn;
            }
            SqlCommand cmd = this._adapter.SelectCommand;
            if (cmd == null) return -1;
			string	ls_sql = cmd.CommandText;  //取出的XML数据源中的SQL定义
			SqlParameter	param;
			try
			{
                if (parameters != null)
                {
                    for (int i = 0; i < parameters.Count; i++)
                    {
                        ls_key = parameters.Keys[i];
                        if (cmd.Parameters.IndexOf("@" + ls_key) < 0) continue;
                        param = cmd.Parameters["@" + ls_key];
                        if (param == null) continue;		//传入没有的参数时忽略
                        SqlQueryDAO.ConvertParam(param, parameters[ls_key]);
                    }
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        if (null == cmd.Parameters[i].Value)
                            cmd.Parameters[i].Value = DBNull.Value;
                    }
                }
                irtn = this._adapter.Fill(ds, item);
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
            }
			finally
			{
				_conn.Close();
			}
			return irtn;
		}


		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <param name="ds">数据集</param>
		/// <returns></returns>
		public	int			FillDataSet(string item, NameObjectList[] paramList,DataSet ds)
		{
			string	ls_key;
			int		irtn=0;
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				return irtn;
			SqlCommand	cmd=this._adapter.SelectCommand;
			string	ls_sql = cmd.CommandText;  //取出的XML数据源中的SQL定义
			SqlParameter	param;
			try
			{
				this._conn.Open();
				for(int ip=0;ip<paramList.Length;ip++)
				{
					for(int i=0;i<paramList[ip].Count;i++)
					{
						ls_key=paramList[ip].Keys[i];
						if(cmd.Parameters.IndexOf("@"+ls_key)<0)	continue;
						param=cmd.Parameters["@"+ls_key];
						if(param==null) continue;		//传入没有的参数时忽略
						SqlQueryDAO.ConvertParam(param,paramList[ip][ls_key]);
					}
					for(int i=0;i<cmd.Parameters.Count;i++)
					{
						if(null==cmd.Parameters[i].Value || null==paramList[ip][cmd.Parameters[i].ParameterName])
							cmd.Parameters[i].Value=DBNull.Value;
					}
					irtn=this._adapter.Fill(ds,item);
				}
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);

            }
			finally
			{
				_conn.Close();
			}
			return irtn;
		}



		public bool		Update(string item,DataSet ds)
		{
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("设置更新规则失败!"));
			if (ds.HasErrors)
			{
				throw(new Exception("违反数据校验!"));
			}
			try
			{
				_conn.Open();
				_adapter.Update(ds);
				ds.AcceptChanges();
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
				return false;
			}
			finally
			{
				_conn.Close();
			}
			return true;

		}
		

		/// <summary>
		/// 利用DataTable来更新数据
		/// </summary>
		/// <param name="item">要更新的数据项目</param>
		/// <param name="tab">要更新的数据DataTable</param>
		/// <returns>更新是否成功</returns>
		public bool		Update(string item,DataTable tab)
		{
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("设置更新规则失败!"));
			if (tab.HasErrors)
			{
				throw(new Exception("违反数据校验!"));
			}
			SqlTransaction	trans=null;
			SqlCommand	cmd;
			this._adpCascade.SelectCommand=null;
			this._adpCascade.InsertCommand=null;
			this._adpCascade.UpdateCommand=null;
			this._adpCascade.DeleteCommand=null;
			DataTable	tab_cascade=tab.GetChanges(DataRowState.Modified|DataRowState.Deleted);
			if(tab_cascade==null)
				tab_cascade=new DataTable();
			DataRow[]	drs_ins=tab_cascade.Select("","",DataViewRowState.Added);
			DataRow[]	drs_mody=tab_cascade.Select("","",DataViewRowState.ModifiedCurrent);
			DataRow[]	drs_del=tab_cascade.Select("","",DataViewRowState.Deleted);
			try
			{
				//先更新级联的数据再更新本身项目数据
				_conn.Open();
				trans=_conn.BeginTransaction();
				//首选更新新增和修改的
				if(null!=this._adapter.UpdateCommand)
					this._adapter.UpdateCommand.Transaction=trans;
				if(null!=this._adapter.InsertCommand)
					this._adapter.InsertCommand.Transaction=trans;
				this._adapter.Update(tab.Select("","",DataViewRowState.Added|DataViewRowState.ModifiedCurrent));
				//级联增加
				for(int i=0;i<this._listCmdCasInsert.Count;i++)
				{
					cmd=this._listCmdCasInsert[i] as SqlCommand;
					if(cmd==null)	continue;
					cmd.Transaction=trans;
					this._adpCascade.InsertCommand=cmd;
					this._adpCascade.Update(drs_ins);
				}
				this._adpCascade.InsertCommand=null;
				//级联更新
				for(int i=0;i<this._listCmdCasUpdate.Count;i++)
				{
					cmd=this._listCmdCasUpdate[i] as SqlCommand;
					if(cmd==null)	continue;
					cmd.Transaction=trans;
					this._adpCascade.UpdateCommand=cmd;
					this._adpCascade.Update(drs_mody);
				}
				this._adpCascade.UpdateCommand=null;
				//级联删除
				for(int i=0;i<this._listCmdCasDelete.Count;i++)
				{
					cmd=this._listCmdCasDelete[i] as SqlCommand;
					if(cmd==null)	continue;
					cmd.Transaction=trans;
					this._adpCascade.DeleteCommand=cmd;
					this._adpCascade.Update(drs_del);
				}
				this._adpCascade.DeleteCommand=null;
				//最后更新删除的
				if(null!=this._adapter.DeleteCommand)
					this._adapter.DeleteCommand.Transaction=trans;
				this._adapter.Update(tab.Select("","",DataViewRowState.Deleted));
				trans.Commit();
				tab.AcceptChanges();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
				return false;
			}
			finally
			{
				_conn.Close();
			}
			return true;
		}
		

		public bool		Update(string item,DataRow[] drs)
		{
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("设置更新规则失败!"));
			try
			{
				_conn.Open();
				_adapter.Update(drs);
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
                return false;
			}
			finally
			{
				_conn.Close();
			}
			return true;
		}


		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数</param>
		/// <param name="paramsListUpt">提交的更新参数</param>
		/// <param name="paramsListDel">提交的删除参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel)
		{
			ArrayList			listCmdCascade=null;	//级联的操作命令列表
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			for(int i=0;i<3;i++)
			{	//传递参数
				NameObjectList	parameters=null;
				switch(i.ToString())
				{
					case "0":
						listCmdCascade=this._listCmdCasDelete;	
						listCmdCascade.Insert(0,this._adapter.DeleteCommand);
						parameters=paramsDel;break;
					case "1":
						listCmdCascade=this._listCmdCasUpdate;
						listCmdCascade.Insert(0,this._adapter.UpdateCommand);
						parameters=paramsUpt;break;
					case "2":
						listCmdCascade=this._listCmdCasInsert;
						listCmdCascade.Insert(0,this._adapter.InsertCommand);
						parameters=paramsIns;break;
				}
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					for(int k=0;k<parameters.Count;k++)
					{
						string	ls_key=parameters.Keys[k];
						if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
						SqlParameter		param=cmdtemp.Parameters["@"+ls_key];
						if(param==null)	continue;
						SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int k=0;k<cmdtemp.Parameters.Count;k++)
					{
						if(null==cmdtemp.Parameters[k].Value)
							cmdtemp.Parameters[k].Value=DBNull.Value;
					}
				}
			}//for(int i=0;i<3;i++)
			SqlTransaction		trans=null;			//事务控制
			bool				isAutoConn=true,isSuccess=true;	//默认不使用外部定制连接事务,默认成功执行
			try
			{   
				//打开数据库，提交数据
				if(ConnectionState.Open!=this._conn.State)
				{
					this._conn.Open();
					trans=_conn.BeginTransaction();
				}
				else	isAutoConn=false;
				for(int i=0;i<3;i++)
				{
					switch(i.ToString())
					{
						case "0":
							listCmdCascade=this._listCmdCasDelete;break;
						case "1":
							listCmdCascade=this._listCmdCasUpdate;break;
						case "2":
							listCmdCascade=this._listCmdCasInsert;break;
					}
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
						if(null!=trans)		cmdtemp.Transaction=trans;
						cmdtemp.ExecuteNonQuery();
					}
				}//for(int i=0;i<3;i++)
				if(isAutoConn && null!=trans)
					trans.Commit();
			}
			catch ( Exception ex )
			{
				if(!isAutoConn )
				{
					if(this._listCmdCasDelete.Count>0)
						this._listCmdCasDelete.RemoveAt(0);
					if(this._listCmdCasUpdate.Count>0)
						this._listCmdCasUpdate.RemoveAt(0);
					if(this._listCmdCasInsert.Count>0)
						this._listCmdCasInsert.RemoveAt(0);
					throw(ex);
				}
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
			}
			finally
			{
				if(isAutoConn)	this._conn.Close();
			}
			if(this._listCmdCasDelete.Count>0)
				this._listCmdCasDelete.RemoveAt(0);
			if(this._listCmdCasUpdate.Count>0)
				this._listCmdCasUpdate.RemoveAt(0);
			if(this._listCmdCasInsert.Count>0)
				this._listCmdCasInsert.RemoveAt(0);
			return isSuccess;
		}

        /// <summary>
        /// 根据引入的数据库连接进行svrCnnKey为web.config中的userSQL内容
        /// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
        /// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
        /// </summary>
        /// <param name="item">要提交的数据项目</param>
        /// <param name="paramsListIns">提交的新增参数</param>
        /// <param name="paramsListUpt">提交的更新参数</param>
        /// <param name="paramsListDel">提交的删除参数</param>
        /// <returns>操作是否成功</returns>
        public bool ExecuteNonQuery(string item, string svrCnnKey, NameObjectList paramsIns, NameObjectList paramsUpt, NameObjectList paramsDel)
        {
            //打开数据库，提交数据
            SqlConnection userCnn = new SqlConnection();
            userCnn.ConnectionString = DataAccRes.DefaultSection.DataConnList["userSQL"].Value;

            SqlConnection defconn = this._conn;
            this._conn = userCnn;

            ArrayList listCmdCascade = null;	//级联的操作命令列表
            //初始化数据项目的规则
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1) return false;
            for (int i = 0; i < 3; i++)
            {	//传递参数
                NameObjectList parameters = null;
                switch (i.ToString())
                {
                    case "0":
                        listCmdCascade = this._listCmdCasDelete;
                        listCmdCascade.Insert(0, this._adapter.DeleteCommand);
                        parameters = paramsDel; break;
                    case "1":
                        listCmdCascade = this._listCmdCasUpdate;
                        listCmdCascade.Insert(0, this._adapter.UpdateCommand);
                        parameters = paramsUpt; break;
                    case "2":
                        listCmdCascade = this._listCmdCasInsert;
                        listCmdCascade.Insert(0, this._adapter.InsertCommand);
                        parameters = paramsIns; break;
                }
                for (int j = 0; j < listCmdCascade.Count; j++)
                {
                    SqlCommand cmdtemp = listCmdCascade[j] as SqlCommand;
                    if (cmdtemp == null) continue;
                    for (int k = 0; k < parameters.Count; k++)
                    {
                        string ls_key = parameters.Keys[k];
                        if (cmdtemp.Parameters.IndexOf("@" + ls_key) < 0) continue;
                        SqlParameter param = cmdtemp.Parameters["@" + ls_key];
                        if (param == null) continue;
                        SqlQueryDAO.ConvertParam(param, parameters[ls_key]);
                    }
                    for (int k = 0; k < cmdtemp.Parameters.Count; k++)
                    {
                        if (null == cmdtemp.Parameters[k].Value)
                            cmdtemp.Parameters[k].Value = DBNull.Value;
                    }
                }
            }//for(int i=0;i<3;i++)
            SqlTransaction trans = null;			//事务控制
            bool isAutoConn = true, isSuccess = true;	//默认不使用外部定制连接事务,默认成功执行
            try
            {
                if (ConnectionState.Open != userCnn.State)
                {
                    try
                    {
                        this._conn.Open();
                    }
                    catch
                    {
                        this._conn = defconn;
                        this._conn.Open();
                    }
                    trans = userCnn.BeginTransaction();
                }
                else isAutoConn = false;
                for (int i = 0; i < 3; i++)
                {
                    switch (i.ToString())
                    {
                        case "0":
                            listCmdCascade = this._listCmdCasDelete; break;
                        case "1":
                            listCmdCascade = this._listCmdCasUpdate; break;
                        case "2":
                            listCmdCascade = this._listCmdCasInsert; break;
                    }
                    for (int j = 0; j < listCmdCascade.Count; j++)
                    {
                        SqlCommand cmdtemp = listCmdCascade[j] as SqlCommand;
                        if (cmdtemp == null) continue;
                        if (!isAutoConn && null != this._trans) cmdtemp.Transaction = this._trans;
                        if (null != trans) cmdtemp.Transaction = trans;
                        cmdtemp.ExecuteNonQuery();
                    }
                }//for(int i=0;i<3;i++)
                if (isAutoConn && null != trans)
                    trans.Commit();
            }
            catch (Exception ex)
            {
                if (!isAutoConn)
                {
                    if (this._listCmdCasDelete.Count > 0)
                        this._listCmdCasDelete.RemoveAt(0);
                    if (this._listCmdCasUpdate.Count > 0)
                        this._listCmdCasUpdate.RemoveAt(0);
                    if (this._listCmdCasInsert.Count > 0)
                        this._listCmdCasInsert.RemoveAt(0);
                    throw (ex);
                }
                if (this._conn.State == ConnectionState.Open && trans != null)
                    trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
            }
            finally
            {
                if (isAutoConn) this._conn.Close();
            }
            if (this._listCmdCasDelete.Count > 0)
                this._listCmdCasDelete.RemoveAt(0);
            if (this._listCmdCasUpdate.Count > 0)
                this._listCmdCasUpdate.RemoveAt(0);
            if (this._listCmdCasInsert.Count > 0)
                this._listCmdCasInsert.RemoveAt(0);
            return isSuccess;
        }


		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数数组</param>
		/// <param name="paramsListUpt">提交的更新参数数组</param>
		/// <param name="paramsListDel">提交的删除参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel)
		{
			ArrayList			listCmdCascade=null;	//级联的操作命令列表
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			SqlTransaction		trans=null;			//事务控制
            SqlCommand cmdtemp = null;
			bool				isAutoConn=true,isSuccess=true;	//默认不使用外部定制连接事务,默认成功执行
			try
			{   
				//打开数据库，提交数据
				if(ConnectionState.Open!=this._conn.State)
				{
					this._conn.Open();
					trans=_conn.BeginTransaction();
				}
				else	isAutoConn=false;
				for(int i=0;i<3;i++)
				{
					NameObjectList[]	parametersList=null;
					switch(i.ToString())
					{
						case "0":
							listCmdCascade=this._listCmdCasDelete;	
							listCmdCascade.Insert(0,this._adapter.DeleteCommand);
							parametersList=paramsListDel;break;
						case "1":
							listCmdCascade=this._listCmdCasUpdate;
							listCmdCascade.Insert(0,this._adapter.UpdateCommand);
							parametersList=paramsListUpt;break;
						case "2":
							listCmdCascade=this._listCmdCasInsert;
							listCmdCascade.Insert(0,this._adapter.InsertCommand);
							parametersList=paramsListIns;break;
					}
					//参数数组相当于多条数据更新,如果级联更新要执行多个SQLCommand
					for(int ii=0;ii<parametersList.Length;ii++)
					{
						NameObjectList	parameters=parametersList[ii];
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							cmdtemp=listCmdCascade[j] as SqlCommand;
							if(cmdtemp==null)	continue;
							for(int k=0;k<parameters.Count;k++)
							{
								string	ls_key=parameters.Keys[k];
								if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
								SqlParameter		param=cmdtemp.Parameters["@"+ls_key];
								if(param==null)	continue;
								SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
							}
							for(int k=0;k<cmdtemp.Parameters.Count;k++)
							{
								if(null==cmdtemp.Parameters[k].Value)
									cmdtemp.Parameters[k].Value=DBNull.Value;
							}
						}
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							cmdtemp=listCmdCascade[j] as SqlCommand;
							if(cmdtemp==null)	continue;
							if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
							if(null!=trans)		cmdtemp.Transaction=trans;
							cmdtemp.ExecuteNonQuery();
						}
					}
				}//for(int i=0;i<3;i++)
				//自动事务处理提交;外部定制事务就不提交
				if(isAutoConn && null!=trans)	
					trans.Commit();
			}
			catch ( Exception ex )
			{
				if(!isAutoConn )
				{
					if(this._listCmdCasDelete.Count>0)
						this._listCmdCasDelete.RemoveAt(0);
					if(this._listCmdCasUpdate.Count>0)
						this._listCmdCasUpdate.RemoveAt(0);
					if(this._listCmdCasInsert.Count>0)
						this._listCmdCasInsert.RemoveAt(0);
					throw(ex);
				}
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                errInfo["SQL="] = null == cmdtemp ? "" : cmdtemp.CommandText;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
			}
			finally
			{
				if(isAutoConn)	this._conn.Close();
			}
			if(this._listCmdCasDelete.Count>0)
				this._listCmdCasDelete.RemoveAt(0);
			if(this._listCmdCasUpdate.Count>0)
				this._listCmdCasUpdate.RemoveAt(0);
			if(this._listCmdCasInsert.Count>0)
				this._listCmdCasInsert.RemoveAt(0);
			return isSuccess;
		}


        /// <summary>
        /// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
        /// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
        /// </summary>
        /// <param name="item">要提交的数据项目</param>
        /// /// <param name="svrCnnKey">svrCnnKey</param>
        /// <param name="paramsListIns">提交的新增参数数组</param>
        /// <param name="paramsListUpt">提交的更新参数数组</param>
        /// <param name="paramsListDel">提交的删除参数数组</param>
        /// <returns>操作是否成功</returns>
        public bool ExecuteNonQuery(string item, string svrCnnKey, NameObjectList[] paramsListIns, NameObjectList[] paramsListUpt, NameObjectList[] paramsListDel)
        {
            SqlConnection userCnn = new SqlConnection();
            userCnn.ConnectionString = DataAccRes.DefaultSection.DataConnList["userSQL"].Value;

            SqlConnection defconn = this._conn;
            this._conn = userCnn;

            ArrayList listCmdCascade = null;	//级联的操作命令列表
            //初始化数据项目的规则
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1) return false;
            SqlTransaction trans = null;			//事务控制
            bool isAutoConn = true, isSuccess = true;	//默认不使用外部定制连接事务,默认成功执行

            //打开数据库，提交数据
            if (ConnectionState.Open != this._conn.State)
            {
                try
                {
                    this._conn.Open();
                }
                catch
                {
                    this._conn = defconn;
                    try
                    {
                        this._conn.Open();
                    }
                    catch
                    {
                        isSuccess = false;
                    }
                }
                trans = this._conn.BeginTransaction();
            }
            else isAutoConn = false;
            try
            {
                for (int i = 0; i < 3; i++)
                {
                    NameObjectList[] parametersList = null;
                    switch (i.ToString())
                    {
                        case "0":
                            listCmdCascade = this._listCmdCasDelete;
                            listCmdCascade.Insert(0, this._adapter.DeleteCommand);
                            parametersList = paramsListDel; break;
                        case "1":
                            listCmdCascade = this._listCmdCasUpdate;
                            listCmdCascade.Insert(0, this._adapter.UpdateCommand);
                            parametersList = paramsListUpt; break;
                        case "2":
                            listCmdCascade = this._listCmdCasInsert;
                            listCmdCascade.Insert(0, this._adapter.InsertCommand);
                            parametersList = paramsListIns; break;
                    }
                    //参数数组相当于多条数据更新,如果级联更新要执行多个SQLCommand
                    for (int ii = 0; ii < parametersList.Length; ii++)
                    {
                        NameObjectList parameters = parametersList[ii];
                        for (int j = 0; j < listCmdCascade.Count; j++)
                        {
                            SqlCommand cmdtemp = listCmdCascade[j] as SqlCommand;
                            if (cmdtemp == null) continue;
                            for (int k = 0; k < parameters.Count; k++)
                            {
                                string ls_key = parameters.Keys[k];
                                if (cmdtemp.Parameters.IndexOf("@" + ls_key) < 0) continue;
                                SqlParameter param = cmdtemp.Parameters["@" + ls_key];
                                if (param == null) continue;
                                SqlQueryDAO.ConvertParam(param, parameters[ls_key]);
                            }
                            for (int k = 0; k < cmdtemp.Parameters.Count; k++)
                            {
                                if (null == cmdtemp.Parameters[k].Value)
                                    cmdtemp.Parameters[k].Value = DBNull.Value;
                            }
                        }
                        for (int j = 0; j < listCmdCascade.Count; j++)
                        {
                            SqlCommand cmdtemp = listCmdCascade[j] as SqlCommand;
                            if (cmdtemp == null) continue;
                            if (!isAutoConn && null != this._trans) cmdtemp.Transaction = this._trans;
                            if (null != trans) cmdtemp.Transaction = trans;
                            cmdtemp.Connection = this._conn;
                            cmdtemp.ExecuteNonQuery();
                        }
                    }
                }//for(int i=0;i<3;i++)
                //自动事务处理提交;外部定制事务就不提交
                if (isAutoConn && null != trans)
                    trans.Commit();
            }
            catch (Exception ex)
            {
                if (!isAutoConn)
                {
                    if (this._listCmdCasDelete.Count > 0)
                        this._listCmdCasDelete.RemoveAt(0);
                    if (this._listCmdCasUpdate.Count > 0)
                        this._listCmdCasUpdate.RemoveAt(0);
                    if (this._listCmdCasInsert.Count > 0)
                        this._listCmdCasInsert.RemoveAt(0);
                    throw (ex);
                }
                if (this._conn.State == ConnectionState.Open && trans != null)
                    trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
            }
            finally
            {
                if (isAutoConn) this._conn.Close();
            }

            if (this._listCmdCasDelete.Count > 0)
                this._listCmdCasDelete.RemoveAt(0);
            if (this._listCmdCasUpdate.Count > 0)
                this._listCmdCasUpdate.RemoveAt(0);
            if (this._listCmdCasInsert.Count > 0)
                this._listCmdCasInsert.RemoveAt(0);
            this._conn = defconn;
            return isSuccess;
        }


		/// <summary>
		/// 利用参数按照"insert"项提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"insert",parameters);
		}


		/// <summary>
		/// 利用参数按照"update"项更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"update",parameters);
		}

	
		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"delete",parameters);
		}

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"insert",parameterslist);
		}


		/// <summary>
		/// 利用参数数组按照"update"项批量更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"update",parameterslist);
		}

	
		/// <summary>
		/// 利用参数数组按照"delete"项来批量删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"delete",parameterslist);
		}

		/// <summary>
		/// 利用流(Stream)写入单个大字段数据
		/// </summary>
		/// <param name="item">要写入的数据项目</param>
		/// <param name="parameters">写入数据的参数</param>
		/// <returns>写入流是否成功</returns>
		public bool		WriteSingleStream(string item,NameObjectList parameters)
		{
			return false;
		}

		/// <summary>
		/// 产生一个全局唯一标识符
		/// </summary>
		/// <returns>返回全局唯一标识符</returns>
		public static	Guid	NewGuid()
		{
			return Guid.NewGuid();
		}

		#endregion

		#region 新增加接口

		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>返回是否成功</returns>
        public bool SetItem(string item, string[] strParams)
        {
            XmlNode lxn_item;	//数据访问项目节点
            XmlNodeList lxnl_cmdsql;		//命令节点列表

            this._item = "";		//重置数据访问项目为空
            lxn_item = setXmlDataItem(item);
            if (lxn_item == null)
                return false;
            //设置项目规则
            this._adapter.SelectCommand = null;
            this._adapter.InsertCommand = null;
            this._adapter.UpdateCommand = null;
            this._adapter.DeleteCommand = null;
            this._adpCascade.SelectCommand = null;
            this._adpCascade.InsertCommand = null;
            this._adpCascade.UpdateCommand = null;
            this._adpCascade.DeleteCommand = null;
            this._listCmdCasInsert.Clear();
            this._listCmdCasUpdate.Clear();
            this._listCmdCasDelete.Clear();
            lxnl_cmdsql = lxn_item.SelectNodes("SQLText");
            foreach (XmlNode lxn_node in lxnl_cmdsql)
                this.NodeText(lxn_node, strParams);
            //设置级联规则;级联规则在链表中,所以首选清空链表
            this._listCmdCasDelete.Clear();
            this._listCmdCasUpdate.Clear();
            lxnl_cmdsql = lxn_item.SelectNodes("SQLCascade");
            foreach (XmlNode lxn_node in lxnl_cmdsql)
                this.NodeCascade(lxn_node, strParams);
            this._item = item;
            return true;
        }

		/// <summary>
		/// 根据项目名称和参数列表获取数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>返回DataTable的数据集</returns>
		public DataTable GetDataTable(string item, NameObjectList parameters,string[] strParams)
		{
			string	ls_key;
			DataTable tab=new DataTable(item);
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)
				return null;
			SqlCommand	cmd=this._adapter.SelectCommand;
			SqlParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					if(cmd.Parameters.IndexOf("@"+ls_key)<0)	continue;
					param=cmd.Parameters["@"+ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
				}
				for(int i=0;i<cmd.Parameters.Count;i++)
				{
					if(null==cmd.Parameters[i].Value)
						cmd.Parameters[i].Value=DBNull.Value;
				}
				this._adapter.Fill(tab);
			}
			catch ( Exception ex )
			{
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
                return null;
			}
			return tab;
		}

        /// <summary>
        /// 根据指定的SQL语句查询数据表
        /// </summary>
        /// <param name="strSQL">SQL语句</param>
        /// <returns>返回DataTable的数据集</returns>
        public  DataTable GetDataTableBySql(string strSQL)
        {
            DataTable tab = new DataTable();
            this._item = "";
            if (null == this._adapter.SelectCommand)
                this._adapter.SelectCommand = new SqlCommand(strSQL, this._conn);
            else
                this._adapter.SelectCommand.CommandText = strSQL;
            try
            {
                this._adapter.Fill(tab);
            }
            catch (Exception ex)
            {
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                _conn.Close();
                return null;
            }
            return tab;

        }

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">要填充的数据集Table名称</param>
		/// <param name="parameters">参数列表</param>
		/// <param name="strParams">字符串参数列表</param>
		/// <param name="ds">要填充的数据集</param>
		/// <returns></returns>
		public   int			FillDataSet(string item, NameObjectList parameters,string[] strParams,DataSet ds)
		{
			string	ls_key;
			int		irtn=0;

            if (item.ToLower().IndexOf("execute ") > -1 || item.ToLower().IndexOf("exec ") > -1 || item.ToLower().IndexOf("select ") > -1)
            {
                ManulSQL(item, null);
            }
            else
            {
                if (item != this._item)
                    this.SetItem(item, strParams);
                if (this._item.Length < 1)
                    return irtn;
            }

			SqlCommand	cmd=this._adapter.SelectCommand;
            
			SqlParameter	param;
			try
			{
                if (cmd != null)
                {
                    for (int i = 0; i < parameters.Count; i++)
                    {
                        ls_key = parameters.Keys[i];
                        if (cmd.Parameters.IndexOf("@" + ls_key) < 0) continue;
                        param = cmd.Parameters["@" + ls_key];
                        if (param == null) continue;		//传入没有的参数时忽略
                        SqlQueryDAO.ConvertParam(param, parameters[ls_key]);
                    }
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        if (null == cmd.Parameters[i].Value)
                            cmd.Parameters[i].Value = DBNull.Value;
                    }
                    irtn = this._adapter.Fill(ds, item);
                }
			}
			catch ( Exception ex )
			{
                NameValueCollection     errInfo=new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"]=this._xmlfile;
				ExceptionManager.Publish( ex,errInfo );
                _conn.Close();
			}
			finally
			{
				_conn.Close();
			}
			return irtn;
		}


		/// <summary>
		/// 利用参数按照"insert"项提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"insert",parameters,strParams);
		}


		/// <summary>
		/// 利用参数按照"update"项更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"update",parameters,strParams);
		}

	
		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"delete",parameters,strParams);
		}

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"insert",parameterslist,strParams);
		}


		/// <summary>
		/// 利用参数数组按照"update"项批量更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"update",parameterslist,strParams);
		}

	
		/// <summary>
		/// 利用参数数组按照"delete"项来批量删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"delete",parameterslist,strParams);
		}

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数</param>
		/// <param name="paramsListUpt">提交的更新参数</param>
		/// <param name="paramsListDel">提交的删除参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel,string[] strParams)
		{
			ArrayList			listCmdCascade=null;	//级联的操作命令列表
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			for(int i=0;i<3;i++)
			{	//传递参数
				NameObjectList	parameters=null;
				switch(i.ToString())
				{
					case "0":
						listCmdCascade=this._listCmdCasDelete;	
						listCmdCascade.Insert(0,this._adapter.DeleteCommand);
						parameters=paramsDel;break;
					case "1":
						listCmdCascade=this._listCmdCasUpdate;
						listCmdCascade.Insert(0,this._adapter.UpdateCommand);
						parameters=paramsUpt;break;
					case "2":
						listCmdCascade=this._listCmdCasInsert;
						listCmdCascade.Insert(0,this._adapter.InsertCommand);
						parameters=paramsIns;break;
				}
				for(int j=0;j<listCmdCascade.Count;j++)
				{
					SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
					if(cmdtemp==null)	continue;
					for(int k=0;k<parameters.Count;k++)
					{
						string	ls_key=parameters.Keys[k];
						if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
						SqlParameter		param=cmdtemp.Parameters["@"+ls_key];
						if(param==null)	continue;
						SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int k=0;k<cmdtemp.Parameters.Count;k++)
					{
						if(null==cmdtemp.Parameters[k].Value)
							cmdtemp.Parameters[k].Value=DBNull.Value;
					}
				}
			}//for(int i=0;i<3;i++)
			SqlTransaction		trans=null;			//事务控制
			bool				isAutoConn=true,isSuccess=true;	//默认不使用外部定制连接事务,默认成功执行
			try
			{   
				//打开数据库，提交数据
				if(ConnectionState.Open!=this._conn.State)
				{
					this._conn.Open();
					trans=_conn.BeginTransaction();
				}
				else	isAutoConn=false;
				for(int i=0;i<3;i++)
				{
					switch(i.ToString())
					{
						case "0":
							listCmdCascade=this._listCmdCasDelete;break;
						case "1":
							listCmdCascade=this._listCmdCasUpdate;break;
						case "2":
							listCmdCascade=this._listCmdCasInsert;break;
					}
					for(int j=0;j<listCmdCascade.Count;j++)
					{
						SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
						if(cmdtemp==null)	continue;
						if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
						if(null!=trans)		cmdtemp.Transaction=trans;
						cmdtemp.ExecuteNonQuery();
					}
				}//for(int i=0;i<3;i++)
				if(isAutoConn && null!=trans)
					trans.Commit();
			}
			catch ( Exception ex )
			{
				if(!isAutoConn )
				{
					if(this._listCmdCasDelete.Count>0)
						this._listCmdCasDelete.RemoveAt(0);
					if(this._listCmdCasUpdate.Count>0)
						this._listCmdCasUpdate.RemoveAt(0);
					if(this._listCmdCasInsert.Count>0)
						this._listCmdCasInsert.RemoveAt(0);
					throw(ex);
				}
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
                isSuccess = false;
			}
			finally
			{
				if(isAutoConn)	this._conn.Close();
			}
			if(this._listCmdCasDelete.Count>0)
				this._listCmdCasDelete.RemoveAt(0);
			if(this._listCmdCasUpdate.Count>0)
				this._listCmdCasUpdate.RemoveAt(0);
			if(this._listCmdCasInsert.Count>0)
				this._listCmdCasInsert.RemoveAt(0);
			return isSuccess;
		}


		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数数组</param>
		/// <param name="paramsListUpt">提交的更新参数数组</param>
		/// <param name="paramsListDel">提交的删除参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel,string[] strParams)
		{
			ArrayList			listCmdCascade=null;	//级联的操作命令列表
			//初始化数据项目的规则
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			SqlTransaction		trans=null;			//事务控制
			bool				isAutoConn=true,isSuccess=true;	//默认不使用外部定制连接事务,默认成功执行
			try
			{   
				//打开数据库，提交数据
				if(ConnectionState.Open!=this._conn.State)
				{
					this._conn.Open();
					trans=_conn.BeginTransaction();
				}
				else	isAutoConn=false;
				for(int i=0;i<3;i++)
				{
					NameObjectList[]	parametersList=null;
					switch(i.ToString())
					{
						case "0":
							listCmdCascade=this._listCmdCasDelete;	
							listCmdCascade.Insert(0,this._adapter.DeleteCommand);
							parametersList=paramsListDel;break;
						case "1":
							listCmdCascade=this._listCmdCasUpdate;
							listCmdCascade.Insert(0,this._adapter.UpdateCommand);
							parametersList=paramsListUpt;break;
						case "2":
							listCmdCascade=this._listCmdCasInsert;
							listCmdCascade.Insert(0,this._adapter.InsertCommand);
							parametersList=paramsListIns;break;
					}
					//参数数组相当于多条数据更新,如果级联更新要执行多个SQLCommand
					for(int ii=0;ii<parametersList.Length;ii++)
					{
						NameObjectList	parameters=parametersList[ii];
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
							if(cmdtemp==null)	continue;
							for(int k=0;k<parameters.Count;k++)
							{
								string	ls_key=parameters.Keys[k];
								if(cmdtemp.Parameters.IndexOf("@"+ls_key)<0) continue;
								SqlParameter		param=cmdtemp.Parameters["@"+ls_key];
								if(param==null)	continue;
								SqlQueryDAO.ConvertParam(param,parameters[ls_key]);
							}
							for(int k=0;k<cmdtemp.Parameters.Count;k++)
							{
								if(null==cmdtemp.Parameters[k].Value)
									cmdtemp.Parameters[k].Value=DBNull.Value;
							}
						}
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							SqlCommand	cmdtemp=listCmdCascade[j] as SqlCommand;
							if(cmdtemp==null)	continue;
							if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
							if(null!=trans)		cmdtemp.Transaction=trans;
							cmdtemp.ExecuteNonQuery();
						}
					}
				}//for(int i=0;i<3;i++)
				//自动事务处理提交;外部定制事务就不提交
				if(isAutoConn && null!=trans)	
					trans.Commit();
			}
			catch ( Exception ex )
			{
				if(!isAutoConn )
				{
					if(this._listCmdCasDelete.Count>0)
						this._listCmdCasDelete.RemoveAt(0);
					if(this._listCmdCasUpdate.Count>0)
						this._listCmdCasUpdate.RemoveAt(0);
					if(this._listCmdCasInsert.Count>0)
						this._listCmdCasInsert.RemoveAt(0);
					throw(ex);
				}
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
                NameValueCollection errInfo = new NameValueCollection();
                ex.Data["数据源"] = this._item;
                errInfo["数据文件"] = this._xmlfile;
                ExceptionManager.Publish(ex, errInfo);
				isSuccess=false;
			}
			finally
			{
				if(isAutoConn)	this._conn.Close();
			}
			if(this._listCmdCasDelete.Count>0)
				this._listCmdCasDelete.RemoveAt(0);
			if(this._listCmdCasUpdate.Count>0)
				this._listCmdCasUpdate.RemoveAt(0);
			if(this._listCmdCasInsert.Count>0)
				this._listCmdCasInsert.RemoveAt(0);
			return isSuccess;
		}


		#endregion
	}
}
