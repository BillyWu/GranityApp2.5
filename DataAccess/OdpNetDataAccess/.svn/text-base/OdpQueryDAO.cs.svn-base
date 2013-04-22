using System;
using System.Xml;
using System.Data;
using System.Collections;
using System.IO;
using System.IO.IsolatedStorage;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using Oracle.DataAccess.Types;
using Oracle.DataAccess.Client;
using Estar.Common.Tools;
using Estar.DataAccess.DataAccessInterface;

namespace Estar.DataAccess.OdpNetDataAccess
{
	/// <summary>
	/// xml格式定义数据访问
	/// </summary>
	public class OdpQueryDAO:IQueryDAO
	{
		private OracleConnection	_conn;		//数据操作的数据库连接
		private OracleDataAdapter	_adapter;	//操作数据的数据适配器:包含自身的select,insert,update,delete规则
		private OracleDataAdapter	_adpCascade;	//级联操作的数据适配器,更新规则来源两个command列表
		private OracleTransaction	_trans;			//外部定制方式启动的数据库事务
		private ArrayList			_listCmdCasInsert;	//级联增加规则列表包含对象是:OracleCommand
		private	ArrayList			_listCmdCasUpdate;	//级联更新规则列表包含对象是:OracleCommand
		private	ArrayList			_listCmdCasDelete;	//级联删除规则列表:OracleCommand
		private XmlDocument			_xmldoc;			//数据项目规则文档
		private string				_xmlfile;			//数据项目资源文件

		#region 数据访问规则定义
		/// <summary>
		/// 当前项目名称
		/// </summary>
		private string	_item;
		
		#endregion

		public OdpQueryDAO()
		{
			_xmldoc=new XmlDocument();
			_conn=new OracleConnection();
			_adapter=new OracleDataAdapter("",_conn);
			_adpCascade=new OracleDataAdapter("",_conn);
			_adpCascade.RowUpdated +=new OracleRowUpdatedEventHandler(OnRowUpdated);
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
				if(string.Empty==value) throw new ArgumentNullException("数据访问资源文件不能为空");
				_xmlfile=value;
				_xmldoc.Load(this._xmlfile);
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


		#region 内部成员函数
		
		/// <summary>
		/// 忽略空的更新
		/// </summary>
		/// <param name="sender">引发事件的对象</param>
		/// <param name="args">事件参数</param>
		protected static void OnRowUpdated(object sender, OracleRowUpdatedEventArgs args)
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
		protected static void ConvertParam(OracleParameter	oraParam,Object	objParam)
		{
			if(null==oraParam)	return;
			if(null==objParam)
			{
				oraParam.Value=DBNull.Value;
				return;
			}
			try
			{
				switch(oraParam.DbType)
				{
					case DbType.AnsiString:
					case DbType.AnsiStringFixedLength:
					case DbType.String:
					case DbType.StringFixedLength:
						oraParam.Value=Convert.ToString(objParam);
						break;
					case DbType.Guid:
						oraParam.Value=new Guid(objParam.ToString());
						break;
					case DbType.Date:
					case DbType.Time:
					case DbType.DateTime:
						oraParam.Value=Convert.ToDateTime(objParam);
						break;
					case DbType.Boolean:
						oraParam.Value=Convert.ToBoolean(objParam);
						break;
					case DbType.Decimal:
						oraParam.Value=Convert.ToDecimal(objParam);
						break;
					case DbType.Double:
						oraParam.Value=Convert.ToDouble(objParam);
						break;
					case DbType.Int16:
						oraParam.Value=Convert.ToInt16(objParam);
						break;
					case DbType.Int32:
						oraParam.Value=Convert.ToInt32(objParam);
						break;
					case DbType.Int64:
						oraParam.Value=Convert.ToInt64(objParam);
						break;
					case DbType.Single:
						oraParam.Value=Convert.ToSingle(objParam);
						break;
					case DbType.UInt16:
						oraParam.Value=Convert.ToUInt16(objParam);
						break;
					case DbType.UInt32:
						oraParam.Value=Convert.ToUInt32(objParam);
						break;
					case DbType.UInt64:
						oraParam.Value=Convert.ToUInt64(objParam);
						break;
					default:
						oraParam.Value=objParam;
						break;
				}
			}
			catch
			{
				oraParam.Value=objParam;
			}
			
		}

		
		/// <summary>
		/// 读取SQLCascade节点规则
		/// </summary>
		/// <param name="lxn_node">SQLCascade节点</param>
		protected	void	NodeCascade(XmlNode lxn_node,string[] strParams)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			//合适的节点加入链表中
			string	ls_sql="";
			if(null!=lxn_node.FirstChild && XmlNodeType.Text==lxn_node.FirstChild.NodeType)
				ls_sql=lxn_node.FirstChild.Value;
			if(strParams!=null)
			{
				if(strParams[0]!="") ls_sql=ls_sql.Replace("?num0",strParams[0]);
				if(strParams[1]!="") ls_sql=ls_sql.Replace("?num1",strParams[1]);
				if(strParams[2]!="") ls_sql=ls_sql.Replace("1=1",strParams[2]);
				if(strParams[2]!="") ls_sql=ls_sql.Replace("1>0",strParams[2]);				

				if(strParams[3]!="") ls_sql=ls_sql.Replace("2=2",strParams[3]);
				if(strParams[3]!="") ls_sql=ls_sql.Replace("2>0",strParams[3]);

				if(strParams[4]!="") ls_sql=ls_sql.Replace("###",strParams[4]);
				CreateLogFile(ls_sql);
			}

			OracleCommand cmd=new OracleCommand(ls_sql,_conn);
			switch(lxn_node.Attributes["name"].Value.ToLower())
			{
				case "select":	throw(new Exception("设置了无效的数据访问规则!"));
				case "insert":	this._listCmdCasInsert.Add(cmd);break;
				case "update":	this._listCmdCasUpdate.Add(cmd);break;
				case "delete":	this._listCmdCasDelete.Add(cmd);break;
				default:		throw(new Exception("设置了无效的数据访问规则!"));
			}
			//增加参数
			lxnl_param=lxn_node.SelectNodes("Argument");
			foreach(XmlNode lxn_parameter in lxnl_param)
			{
				ls_name=lxn_parameter.Attributes["name"].Value;
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
                lty_oratype = OracleDbType.Varchar2;
				//参数类型
				switch(ls_datatype.ToLower())
				{
					case "date":
						lty_oratype=OracleDbType.Date;break;
					case "number":
					case "float":
					case "real":
						lty_oratype=OracleDbType.Decimal;break;
					case "int":
						lty_oratype=OracleDbType.Int32;break;
					case "varchar2":
					case "varchar":
					case "string":
						lty_oratype=OracleDbType.Varchar2;break;
					case "char":
						lty_oratype=OracleDbType.Char;break;
					case "blob":
						lty_oratype=OracleDbType.Blob;break;
					case "uniqueidentifier":
					case "guid":
						lty_oratype=OracleDbType.Varchar2;
						if(li_len<36)	li_len=36;
						break;
				}
				//数据版本
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//三种创建参数的方式:源字段,参数数据长度
				if (ls_srccolumn.Length>0)
				{
					if(li_len>0)
					{
						lp_param=new OracleParameter(ls_name,lty_oratype,li_len,ls_srccolumn);
						lp_param.SourceVersion=lvs_version;
					}
					else
					{
						lp_param=new OracleParameter(ls_name,lty_oratype);
						lp_param.SourceColumn=ls_srccolumn;
						lp_param.SourceVersion=lvs_version;
					}
				}
				else if(li_len>0)
					lp_param=new OracleParameter(ls_name,lty_oratype,li_len);
				else
					lp_param=new OracleParameter(ls_name,lty_oratype);
				cmd.Parameters.Add(lp_param);
			}
		}


	
		/// <summary>
		/// 读取SQLCascade节点规则
		/// </summary>
		/// <param name="lxn_node">SQLCascade节点</param>
		protected	void	NodeCascade(XmlNode lxn_node)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			//合适的节点加入链表中
			string	ls_sql="";
			if(null!=lxn_node.FirstChild && XmlNodeType.Text==lxn_node.FirstChild.NodeType)
				ls_sql=lxn_node.FirstChild.Value;
			OracleCommand cmd=new OracleCommand(ls_sql,_conn);
			switch(lxn_node.Attributes["name"].Value.ToLower())
			{
				case "select":	throw(new Exception("设置了无效的数据访问规则!"));
				case "insert":	this._listCmdCasInsert.Add(cmd);break;
				case "update":	this._listCmdCasUpdate.Add(cmd);break;
				case "delete":	this._listCmdCasDelete.Add(cmd);break;
				default:		throw(new Exception("设置了无效的数据访问规则!"));
			}
			//增加参数
			lxnl_param=lxn_node.SelectNodes("Argument");
			foreach(XmlNode lxn_parameter in lxnl_param)
			{
				ls_name=lxn_parameter.Attributes["name"].Value;
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
                lty_oratype = OracleDbType.Varchar2;
				//参数类型
				switch(ls_datatype.ToLower())
				{
					case "date":
						lty_oratype=OracleDbType.Date;break;
					case "number":
					case "float":
					case "real":
						lty_oratype=OracleDbType.Decimal;break;
					case "int":
						lty_oratype=OracleDbType.Int32;break;
					case "varchar2":
					case "varchar":
					case "string":
						lty_oratype=OracleDbType.Varchar2;break;
					case "char":
						lty_oratype=OracleDbType.Char;break;
					case "blob":
						lty_oratype=OracleDbType.Blob;break;
					case "uniqueidentifier":
					case "guid":
						lty_oratype=OracleDbType.Varchar2;
						if(li_len<36)	li_len=36;
						break;
				}
				//数据版本
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//三种创建参数的方式:源字段,参数数据长度
				if (ls_srccolumn.Length>0)
				{
					if(li_len>0)
					{
						lp_param=new OracleParameter(ls_name,lty_oratype,li_len,ls_srccolumn);
						lp_param.SourceVersion=lvs_version;
					}
					else
					{
						lp_param=new OracleParameter(ls_name,lty_oratype);
						lp_param.SourceColumn=ls_srccolumn;
						lp_param.SourceVersion=lvs_version;
					}
				}
				else if(li_len>0)
					lp_param=new OracleParameter(ls_name,lty_oratype,li_len);
				else
					lp_param=new OracleParameter(ls_name,lty_oratype);
				cmd.Parameters.Add(lp_param);
			}
		}

	
		/// <summary>
		/// 读取SQLText节点
		/// </summary>
		/// <param name="lxn_node">SQL语句节点</param>
		protected	void	NodeText(XmlNode	lxn_node)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			string	ls_sql="";
			if(null!=lxn_node.FirstChild && XmlNodeType.Text==lxn_node.FirstChild.NodeType)
				ls_sql=lxn_node.FirstChild.Value;
			OracleCommand cmd=new OracleCommand(ls_sql,_conn);
			switch(lxn_node.Attributes["name"].Value.ToLower())
			{
				case "select":	this._adapter.SelectCommand=cmd;break;
				case "insert":	this._adapter.InsertCommand=cmd;break;
				case "update":	this._adapter.UpdateCommand=cmd;break;
				case "delete":	this._adapter.DeleteCommand=cmd;break;
				default:		throw(new Exception("设置了无效的数据访问规则!"));
			}
			//增加参数
			lxnl_param=lxn_node.SelectNodes("Parameter");
			foreach(XmlNode lxn_parameter in lxnl_param)
			{
				ls_name=lxn_parameter.Attributes["name"].Value;
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
                lty_oratype = OracleDbType.Varchar2;
				//参数类型
				switch(ls_datatype.ToLower())
				{
					case "date":
						lty_oratype=OracleDbType.Date;break;
					case "number":
					case "float":
					case "real":
						lty_oratype=OracleDbType.Decimal;break;
					case "int":
						lty_oratype=OracleDbType.Int32;break;
					case "varchar2":
					case "varchar":
					case "string":
						lty_oratype=OracleDbType.Varchar2;break;
					case "char":
						lty_oratype=OracleDbType.Char;break;
					case "blob":
						lty_oratype=OracleDbType.Blob;break;
					case "uniqueidentifier":
					case "guid":
						lty_oratype=OracleDbType.Varchar2;
						if(li_len<36)	li_len=36;
						break;
				}
				//数据版本
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//三种创建参数的方式:源字段,参数数据长度
				if (ls_srccolumn.Length>0)
				{
					if(li_len>0)
					{
						lp_param=new OracleParameter(ls_name,lty_oratype,li_len,ls_srccolumn);
						lp_param.SourceVersion=lvs_version;
					}
					else
					{
						lp_param=new OracleParameter(ls_name,lty_oratype);
						lp_param.SourceColumn=ls_srccolumn;
						lp_param.SourceVersion=lvs_version;
					}
				}
				else if(li_len>0)
					lp_param=new OracleParameter(ls_name,lty_oratype,li_len);
				else
					lp_param=new OracleParameter(ls_name,lty_oratype);
				cmd.Parameters.Add(lp_param);
			}	//foreach(XmlNode lxn_parameter in lxnl_param)
		}


		/// <summary>
		/// 读取SQLText节点
		/// </summary>
		/// <param name="lxn_node">SQL语句节点</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		protected	void	NodeText(XmlNode	lxn_node,string[] strParams)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			string	ls_sql="";
			if(null!=lxn_node.FirstChild && XmlNodeType.Text==lxn_node.FirstChild.NodeType)
				ls_sql=lxn_node.FirstChild.Value;

			//LEO 扩充功能，增加宏定义，如 ??num
			// select top ??num * from tab, 约定??num为自定义变量，通过传递的定符串替代之
			// strParams[],为传递的字符串数组，可以做为替换内容
			if(strParams!=null)
			{
				if(strParams[0]!="") ls_sql=ls_sql.Replace("?num0",strParams[0]);
				if(strParams[1]!="") ls_sql=ls_sql.Replace("?num1",strParams[1]);
				if(strParams[2]!="") ls_sql=ls_sql.Replace("1=1",strParams[2]);
				if(strParams[2]!="") ls_sql=ls_sql.Replace("1>0",strParams[2]);
				if(strParams[3]!="") ls_sql=ls_sql.Replace("2=2",strParams[3]);
				if(strParams[3]!="") ls_sql=ls_sql.Replace("2>0",strParams[3]);
				if(strParams[4]!="") ls_sql=ls_sql.Replace("###",strParams[4]);
				CreateLogFile(ls_sql);
			}


			OracleCommand cmd=new OracleCommand(ls_sql,_conn);
			switch(lxn_node.Attributes["name"].Value.ToLower())
			{
				case "select":	this._adapter.SelectCommand=cmd;break;
				case "insert":	this._adapter.InsertCommand=cmd;break;
				case "update":	this._adapter.UpdateCommand=cmd;break;
				case "delete":	this._adapter.DeleteCommand=cmd;break;
				default:		throw(new Exception("设置了无效的数据访问规则!"));
			}
			//增加参数
			lxnl_param=lxn_node.SelectNodes("Parameter");
			foreach(XmlNode lxn_parameter in lxnl_param)
			{
				ls_name=lxn_parameter.Attributes["name"].Value;
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
                lty_oratype = OracleDbType.Varchar2;
				//参数类型
				switch(ls_datatype.ToLower())
				{
					case "date":
						lty_oratype=OracleDbType.Date;break;
					case "number":
					case "float":
					case "real":
						lty_oratype=OracleDbType.Decimal;break;
					case "int":
						lty_oratype=OracleDbType.Int32;break;
					case "varchar2":
					case "varchar":
					case "string":
						lty_oratype=OracleDbType.Varchar2;break;
					case "char":
						lty_oratype=OracleDbType.Char;break;
					case "blob":
						lty_oratype=OracleDbType.Blob;break;
					case "uniqueidentifier":
					case "guid":
						lty_oratype=OracleDbType.Varchar2;
						if(li_len<36)	li_len=36;
						break;
				}
				//数据版本
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//三种创建参数的方式:源字段,参数数据长度
				if (ls_srccolumn.Length>0)
				{
					if(li_len>0)
					{
						lp_param=new OracleParameter(ls_name,lty_oratype,li_len,ls_srccolumn);
						lp_param.SourceVersion=lvs_version;
					}
					else
					{
						lp_param=new OracleParameter(ls_name,lty_oratype);
						lp_param.SourceColumn=ls_srccolumn;
						lp_param.SourceVersion=lvs_version;
					}
				}
				else if(li_len>0)
					lp_param=new OracleParameter(ls_name,lty_oratype,li_len);
				else
					lp_param=new OracleParameter(ls_name,lty_oratype);
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
			OracleCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			OracleParameter		param;			//命令用到的参数
			OracleTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)	this.SetItem(item);
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					for(int i=0;i<parameters.Count;i++)
					{
						ls_key=parameters.Keys[i];
						param=cmdtemp.Parameters[ls_key];
						if(param==null)	continue;
						OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					cmdtemp.ExecuteNonQuery();
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
				ExceptionManager.Publish( ex );
				this._conn.Close();
				listCmdCascade.RemoveAt(0);
				return false;
			}
			finally
			{
				this._conn.Close();
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
			OracleCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			OracleParameter		param;			//命令用到的参数
			OracleTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)	this.SetItem(item);
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						for(int i=0;i<parameters.Count;i++)
						{
							ls_key=parameters.Keys[i];
							param=cmdtemp.Parameters[ls_key];
							if(param==null)	continue;
							OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						cmdtemp.ExecuteNonQuery();
					}
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
				ExceptionManager.Publish( ex );
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
			OracleCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			OracleParameter		param;			//命令用到的参数
			OracleTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)	this.SetItem(item,strParams);
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					for(int i=0;i<parameters.Count;i++)
					{
						ls_key=parameters.Keys[i];
						param=cmdtemp.Parameters[ls_key];
						if(param==null)	continue;
						OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					cmdtemp.ExecuteNonQuery();
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
				ExceptionManager.Publish( ex );
				this._conn.Close();
				listCmdCascade.RemoveAt(0);
				return false;
			}
			finally
			{
				this._conn.Close();
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
			OracleCommand		cmd=null;		//用于操作的sql命令
			ArrayList			listCmdCascade;	//级联的操作命令列表
			OracleParameter		param;			//命令用到的参数
			OracleTransaction	trans=null;			//事务控制
			//初始化数据项目的规则
			if(item!=this._item)	this.SetItem(item,strParams);
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						for(int i=0;i<parameters.Count;i++)
						{
							ls_key=parameters.Keys[i];
							param=cmdtemp.Parameters[ls_key];
							if(param==null)	continue;
							OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						cmdtemp.ExecuteNonQuery();
					}
				}
				trans.Commit();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
				ExceptionManager.Publish( ex );
				listCmdCascade.RemoveAt(0);
				_conn.Close();
				return false;
			}
			finally
			{ this._conn.Close();}
			return true;
		}


		/// <summary>
		/// 写日志
		/// </summary>
		/// <param name="textToAdd">写入日志信息</param>
		protected void CreateLogFile(string textToAdd) 
		{
			string logFile = DateTime.Now.ToLongDateString()
				.Replace(@"/",@"-").Replace(@"\",@"-") + ".log";
			logFile=System.Web.HttpContext.Current.Server.MapPath("程序日志\\"+logFile);
			string thistime =DateTime.Now.ToLongTimeString().Replace(@"/",@"-").Replace(@"\",@"-") + ":";

			StreamWriter swFromFile;
			if (File.Exists(logFile)) 
				swFromFile = new StreamWriter(logFile,true);
			else
				swFromFile = new StreamWriter(logFile);

			swFromFile.WriteLine("");
			swFromFile.WriteLine(thistime);
			swFromFile.WriteLine(textToAdd);
			swFromFile.Flush();
			swFromFile.Close();

		}


		#endregion

		#region IQueryDAO 成员

		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <returns>返回是否成功</returns>
		public bool SetItem(string item)
		{
			XmlNode		lxn_item;	//数据访问项目节点
			XmlNodeList	lxnl_cmdsql;		//命令节点列表

			this._item="";		//重置数据访问项目为空
			lxn_item=_xmldoc.DocumentElement.SelectSingleNode("DataItem[@name='"+item+"']");
			if(lxn_item==null) 
				throw(new Exception("系统资源没有提供该项目数据的访问规则!"));

			//设置项目规则
			this._adapter.SelectCommand=null;
			this._adapter.InsertCommand=null;
			this._adapter.UpdateCommand=null;
			this._adapter.DeleteCommand=null;
			this._adpCascade.SelectCommand=null;
			this._adpCascade.InsertCommand=null;
			this._adpCascade.UpdateCommand=null;
			this._adpCascade.DeleteCommand=null;
			this._listCmdCasInsert.Clear();
			this._listCmdCasUpdate.Clear();
			this._listCmdCasDelete.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLText");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeText(lxn_node);
			//设置级联规则;级联规则在链表中,所以首选清空链表
			this._listCmdCasDelete.Clear();
			this._listCmdCasUpdate.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLCascade");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeCascade(lxn_node);
			this._item=item;
			return true;
		}

		
		#region 只读参数属性
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

		#region 只读执行命令
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
		/// <returns>是否成功</returns>
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
					this._trans.Rollback();
				this._trans=null;
				this._conn.Close();
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
				isSuccess=false;
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
                if (null != this._conn && this._conn.State == ConnectionState.Open && this._trans != null)
                    this._trans.Commit();
                this._trans = null;
			}
			catch ( Exception ex )
			{
                if (null != this._conn && this._conn.State == ConnectionState.Open && this._trans != null)
                    try { this._trans.Rollback(); }
                    catch { }
                this._conn.Close();
                ExceptionManager.Publish(ex);
				isSuccess=false;
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
            OracleCommand cmd = this._adapter.SelectCommand;
            OracleParameter param;
            try
            {
                for (int i = 0; i < parameters.Count; i++)
                {
                    ls_key = parameters.Keys[i];
                    param = cmd.Parameters[ls_key];
                    if (param == null) continue;		//传入没有的参数时忽略
                    OdpQueryDAO.ConvertParam(param, parameters[ls_key]);
                }
                for (int i = 0; i < cmd.Parameters.Count; i++)
                {
                    if (null == cmd.Parameters[i].Value)
                        cmd.Parameters[i].Value = DBNull.Value;
                }
                objResult = this._adapter.SelectCommand.ExecuteScalar();
            }
            catch (Exception ex)
            {
                ExceptionManager.Publish(ex);
                _conn.Close();
                return null;
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
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				return null;
			OracleCommand	cmd=this._adapter.SelectCommand;
			OracleParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
				ExceptionManager.Publish( ex );
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
        public DataTable GetDataTableBySql(string strSQL)
        {
            DataTable tab = new DataTable();
            this._item = "";
            if (null == this._adapter.SelectCommand)
                this._adapter.SelectCommand = new OracleCommand(strSQL, this._conn);
            else
                this._adapter.SelectCommand.CommandText = strSQL;
            CreateLogFile(strSQL);
            try
            {
                this._adapter.Fill(tab);
            }
            catch (Exception ex)
            {
                ExceptionManager.Publish(ex);
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
			string	ls_key;
			int		irtn=0;
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				return irtn;
			OracleCommand	cmd=this._adapter.SelectCommand;
			OracleParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
				}
				for(int i=0;i<cmd.Parameters.Count;i++)
				{
					if(null==cmd.Parameters[i].Value)
						cmd.Parameters[i].Value=DBNull.Value;
				}
				irtn=this._adapter.Fill(ds,item);
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
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
		public	int			FillDataSet(string item, NameObjectList[]	paramList,DataSet ds)
		{
			string	ls_key;
			int		irtn=0;
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				return irtn;
			OracleCommand	cmd=this._adapter.SelectCommand;
			OracleParameter	param;
			try
			{
				this._conn.Open();
				for(int n=0;n<paramList.Length;n++)
				{
					for(int i=0;i<paramList[n].Count;i++)
					{
						ls_key=paramList[n].Keys[i];
						param=cmd.Parameters[ls_key];
						if(param==null) continue;		//传入没有的参数时忽略
						param.Value=paramList[n][ls_key];
						OdpQueryDAO.ConvertParam(param,paramList[n][ls_key]);
					}
					for(int i=0;i<cmd.Parameters.Count;i++)
					{
						if(null==cmd.Parameters[i].Value || null==paramList[n][cmd.Parameters[i].ParameterName])
							cmd.Parameters[i].Value=DBNull.Value;
					}
					irtn=this._adapter.Fill(ds,item);
				}
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
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
				ExceptionManager.Publish( ex );
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
			OracleTransaction	trans=null;
			OracleCommand	cmd;
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
				this._adapter.Update(tab.Select("","",DataViewRowState.Added|DataViewRowState.ModifiedCurrent));
				//级联增加
				for(int i=0;i<this._listCmdCasInsert.Count;i++)
				{
					cmd=this._listCmdCasInsert[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.InsertCommand=cmd;
					this._adpCascade.Update(drs_ins);
				}
				this._adpCascade.InsertCommand=null;
				//级联更新
				for(int i=0;i<this._listCmdCasUpdate.Count;i++)
				{
					cmd=this._listCmdCasUpdate[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.UpdateCommand=cmd;
					this._adpCascade.Update(drs_mody);
				}
				this._adpCascade.UpdateCommand=null;
				//级联删除
				for(int i=0;i<this._listCmdCasDelete.Count;i++)
				{
					cmd=this._listCmdCasDelete[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.DeleteCommand=cmd;
					this._adpCascade.Update(drs_del);
				}
				this._adpCascade.DeleteCommand=null;
				//最后更新删除的
				this._adapter.Update(tab.Select("","",DataViewRowState.Deleted));
				trans.Commit();
				tab.AcceptChanges();
			}
			catch ( Exception ex )
			{
				if(_conn.State==ConnectionState.Open && trans!=null)
					trans.Rollback();
				ExceptionManager.Publish( ex );
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
				ExceptionManager.Publish( ex );
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					for(int k=0;k<parameters.Count;k++)
					{
						string	ls_key=parameters.Keys[k];
						if(cmdtemp.Parameters.IndexOf(ls_key)<0) continue;
						OracleParameter		param=cmdtemp.Parameters[ls_key];
						if(param==null)	continue;
						OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int k=0;k<cmdtemp.Parameters.Count;k++)
					{
						if(null==cmdtemp.Parameters[k].Value)
							cmdtemp.Parameters[k].Value=DBNull.Value;
					}
				}
			}//for(int i=0;i<3;i++)
			OracleTransaction	trans=null;			//事务控制
			bool				isAutoConn=true,isSuccess=true;	//默认不使用外部定制连接事务,默认成功执行
			try
			{   
				//打开数据库，提交数据
				if(ConnectionState.Open!=this._conn.State)
				{
					this._conn.Open();
					trans=_conn.BeginTransaction();
				}else	isAutoConn=false;
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						//if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
						//if(null!=trans)		cmdtemp.Transaction=trans;
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
				ExceptionManager.Publish( ex );
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


        /// <summary>
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
                    OracleCommand cmdtemp = listCmdCascade[j] as OracleCommand;
                    if (cmdtemp == null) continue;
                    for (int k = 0; k < parameters.Count; k++)
                    {
                        string ls_key = parameters.Keys[k];
                        if (cmdtemp.Parameters.IndexOf(ls_key) < 0) continue;
                        OracleParameter param = cmdtemp.Parameters[ls_key];
                        if (param == null) continue;
                        OdpQueryDAO.ConvertParam(param, parameters[ls_key]);
                    }
                    for (int k = 0; k < cmdtemp.Parameters.Count; k++)
                    {
                        if (null == cmdtemp.Parameters[k].Value)
                            cmdtemp.Parameters[k].Value = DBNull.Value;
                    }
                }
            }//for(int i=0;i<3;i++)
            OracleTransaction trans = null;			//事务控制
            bool isAutoConn = true, isSuccess = true;	//默认不使用外部定制连接事务,默认成功执行
            try
            {
                //打开数据库，提交数据
                if (ConnectionState.Open != this._conn.State)
                {
                    this._conn.Open();
                    trans = _conn.BeginTransaction();
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
                        OracleCommand cmdtemp = listCmdCascade[j] as OracleCommand;
                        if (cmdtemp == null) continue;
                        //if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
                        //if(null!=trans)		cmdtemp.Transaction=trans;
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
                if (_conn.State == ConnectionState.Open && trans != null)
                    trans.Rollback();
                ExceptionManager.Publish(ex);
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
			OracleTransaction	trans=null;			//事务控制
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
							OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
							if(cmdtemp==null)	continue;
							for(int k=0;k<parameters.Count;k++)
							{
								string	ls_key=parameters.Keys[k];
								if(cmdtemp.Parameters.IndexOf(ls_key)<0) continue;
								OracleParameter		param=cmdtemp.Parameters[ls_key];
								if(param==null)	continue;
								OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
							}
							for(int k=0;k<cmdtemp.Parameters.Count;k++)
							{
								if(null==cmdtemp.Parameters[k].Value)
									cmdtemp.Parameters[k].Value=DBNull.Value;
							}
						}
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
							if(cmdtemp==null)	continue;
							//if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
							//if(null!=trans)		cmdtemp.Transaction=trans;
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
				ExceptionManager.Publish( ex );
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

        public bool ExecuteNonQuery(string item, string svrCnnKey, NameObjectList[] paramsListIns, NameObjectList[] paramsListUpt, NameObjectList[] paramsListDel)
        {
            ArrayList listCmdCascade = null;	//级联的操作命令列表
            //初始化数据项目的规则
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1) return false;
            OracleTransaction trans = null;			//事务控制
            bool isAutoConn = true, isSuccess = true;	//默认不使用外部定制连接事务,默认成功执行
            try
            {
                //打开数据库，提交数据
                if (ConnectionState.Open != this._conn.State)
                {
                    this._conn.Open();
                    trans = _conn.BeginTransaction();
                }
                else isAutoConn = false;
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
                            OracleCommand cmdtemp = listCmdCascade[j] as OracleCommand;
                            if (cmdtemp == null) continue;
                            for (int k = 0; k < parameters.Count; k++)
                            {
                                string ls_key = parameters.Keys[k];
                                if (cmdtemp.Parameters.IndexOf(ls_key) < 0) continue;
                                OracleParameter param = cmdtemp.Parameters[ls_key];
                                if (param == null) continue;
                                OdpQueryDAO.ConvertParam(param, parameters[ls_key]);
                            }
                            for (int k = 0; k < cmdtemp.Parameters.Count; k++)
                            {
                                if (null == cmdtemp.Parameters[k].Value)
                                    cmdtemp.Parameters[k].Value = DBNull.Value;
                            }
                        }
                        for (int j = 0; j < listCmdCascade.Count; j++)
                        {
                            OracleCommand cmdtemp = listCmdCascade[j] as OracleCommand;
                            if (cmdtemp == null) continue;
                            //if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
                            //if(null!=trans)		cmdtemp.Transaction=trans;
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
                if (_conn.State == ConnectionState.Open && trans != null)
                    trans.Rollback();
                ExceptionManager.Publish(ex);
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
			string	ls_key;
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("设置更新规则失败!"));
			if(this._adapter.UpdateCommand==null)
				throw(new Exception("没有设置更新大字段的规则"));
			OracleCommand	cmd=this._adapter.UpdateCommand;
			OracleParameter	param;Stream	stream;
			NameObjectList treams=new NameObjectList();		//大字段使用流
			try
			{
				//大字段类型的数据是引用方式的赋值
				_conn.Open();
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					stream=parameters[ls_key] as Stream;
					if(stream!=null)	//如果是流,以大字段处理
					{
						byte[] lbtData = new byte[stream.Length];
						OracleBlob blob=new OracleBlob(this._conn);
						stream.Read(lbtData,0,System.Convert.ToInt32(stream.Length));
						cmd.Parameters[i].Value=blob;
						blob.Write(lbtData,0,System.Convert.ToInt32(stream.Length));
						stream.Close();
					}
					else
						OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
				}
				cmd.ExecuteNonQuery();
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
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
		public bool SetItem(string item,string[] strParams)
		{
			XmlNode		lxn_item;	//数据访问项目节点
			XmlNodeList	lxnl_cmdsql;		//命令节点列表

			this._item="";		//重置数据访问项目为空
			lxn_item=_xmldoc.DocumentElement.SelectSingleNode("DataItem[@name='"+item+"']");
			if(lxn_item==null) 
				throw(new Exception("系统资源没有提供该项目数据的访问规则!"));

			//设置项目规则
			this._adapter.SelectCommand=null;
			this._adapter.InsertCommand=null;
			this._adapter.UpdateCommand=null;
			this._adapter.DeleteCommand=null;
			this._adpCascade.SelectCommand=null;
			this._adpCascade.InsertCommand=null;
			this._adpCascade.UpdateCommand=null;
			this._adpCascade.DeleteCommand=null;
			this._listCmdCasInsert.Clear();
			this._listCmdCasUpdate.Clear();
			this._listCmdCasDelete.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLText");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeText(lxn_node,strParams);
			//设置级联规则;级联规则在链表中,所以首选清空链表
			this._listCmdCasDelete.Clear();
			this._listCmdCasUpdate.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLCascade");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeCascade(lxn_node,strParams);
			this._item=item;
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
			OracleCommand	cmd=this._adapter.SelectCommand;
			OracleParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
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
				ExceptionManager.Publish( ex );
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
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)
				return irtn;
			OracleCommand	cmd=this._adapter.SelectCommand;
			OracleParameter	param;
			try
			{
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//传入没有的参数时忽略
					OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
				}
				for(int i=0;i<cmd.Parameters.Count;i++)
				{
					if(null==cmd.Parameters[i].Value)
						cmd.Parameters[i].Value=DBNull.Value;
				}
				irtn=this._adapter.Fill(ds,item);
			}
			catch ( Exception ex )
			{
				ExceptionManager.Publish( ex );
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
					OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
					if(cmdtemp==null)	continue;
					for(int k=0;k<parameters.Count;k++)
					{
						string	ls_key=parameters.Keys[k];
						if(cmdtemp.Parameters.IndexOf(ls_key)<0) continue;
						OracleParameter		param=cmdtemp.Parameters[ls_key];
						if(param==null)	continue;
						OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
					}
					for(int k=0;k<cmdtemp.Parameters.Count;k++)
					{
						if(null==cmdtemp.Parameters[k].Value)
							cmdtemp.Parameters[k].Value=DBNull.Value;
					}
				}
			}//for(int i=0;i<3;i++)
			OracleTransaction	trans=null;			//事务控制
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
						OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
						if(cmdtemp==null)	continue;
						//if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
						//if(null!=trans)		cmdtemp.Transaction=trans;
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
				ExceptionManager.Publish( ex );
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
			OracleTransaction	trans=null;			//事务控制
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
							OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
							if(cmdtemp==null)	continue;
							for(int k=0;k<parameters.Count;k++)
							{
								string	ls_key=parameters.Keys[k];
								if(cmdtemp.Parameters.IndexOf(ls_key)<0) continue;
								OracleParameter		param=cmdtemp.Parameters[ls_key];
								if(param==null)	continue;
								OdpQueryDAO.ConvertParam(param,parameters[ls_key]);
							}
							for(int k=0;k<cmdtemp.Parameters.Count;k++)
							{
								if(null==cmdtemp.Parameters[k].Value)
									cmdtemp.Parameters[k].Value=DBNull.Value;
							}
						}
						for(int j=0;j<listCmdCascade.Count;j++)
						{
							OracleCommand	cmdtemp=listCmdCascade[j] as OracleCommand;
							if(cmdtemp==null)	continue;
							//if(!isAutoConn && null!=this._trans)	cmdtemp.Transaction=this._trans;
							//if(null!=trans)		cmdtemp.Transaction=trans;
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
				ExceptionManager.Publish( ex );
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
