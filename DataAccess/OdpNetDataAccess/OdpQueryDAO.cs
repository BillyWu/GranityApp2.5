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
	/// xml��ʽ�������ݷ���
	/// </summary>
	public class OdpQueryDAO:IQueryDAO
	{
		private OracleConnection	_conn;		//���ݲ��������ݿ�����
		private OracleDataAdapter	_adapter;	//�������ݵ�����������:���������select,insert,update,delete����
		private OracleDataAdapter	_adpCascade;	//��������������������,���¹�����Դ����command�б�
		private OracleTransaction	_trans;			//�ⲿ���Ʒ�ʽ���������ݿ�����
		private ArrayList			_listCmdCasInsert;	//�������ӹ����б����������:OracleCommand
		private	ArrayList			_listCmdCasUpdate;	//�������¹����б����������:OracleCommand
		private	ArrayList			_listCmdCasDelete;	//����ɾ�������б�:OracleCommand
		private XmlDocument			_xmldoc;			//������Ŀ�����ĵ�
		private string				_xmlfile;			//������Ŀ��Դ�ļ�

		#region ���ݷ��ʹ�����
		/// <summary>
		/// ��ǰ��Ŀ����
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
		/// ��ȡ���������ݷ�����Դ�ļ�
		/// </summary>
		public string	XmlFileStr
		{
			get{return this._xmlfile;}
			set
			{
				if(string.Empty==value) throw new ArgumentNullException("���ݷ�����Դ�ļ�����Ϊ��");
				_xmlfile=value;
				_xmldoc.Load(this._xmlfile);
			}
		}

		
		/// <summary>
		/// ��ȡ�����������ַ���
		/// </summary>
		public string	ConnStr
		{
			get{return this._conn.ConnectionString;}
			set{this._conn.ConnectionString=value;}
		}


		#region �ڲ���Ա����
		
		/// <summary>
		/// ���Կյĸ���
		/// </summary>
		/// <param name="sender">�����¼��Ķ���</param>
		/// <param name="args">�¼�����</param>
		protected static void OnRowUpdated(object sender, OracleRowUpdatedEventArgs args)
		{
			if (args.Errors!=null)
				if(args.Errors is DBConcurrencyException)
					args.Status=UpdateStatus.SkipCurrentRow;
		}
		
		/// <summary>
		/// ת��������������
		/// </summary>
		/// <param name="sqlParam">Sql����</param>
		/// <param name="objParam">���ݷ���ʵ�����</param>
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
		/// ��ȡSQLCascade�ڵ����
		/// </summary>
		/// <param name="lxn_node">SQLCascade�ڵ�</param>
		protected	void	NodeCascade(XmlNode lxn_node,string[] strParams)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			//���ʵĽڵ����������
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
				case "select":	throw(new Exception("��������Ч�����ݷ��ʹ���!"));
				case "insert":	this._listCmdCasInsert.Add(cmd);break;
				case "update":	this._listCmdCasUpdate.Add(cmd);break;
				case "delete":	this._listCmdCasDelete.Add(cmd);break;
				default:		throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			//���Ӳ���
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
				//��������
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
				//���ݰ汾
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//���ִ��������ķ�ʽ:Դ�ֶ�,�������ݳ���
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
		/// ��ȡSQLCascade�ڵ����
		/// </summary>
		/// <param name="lxn_node">SQLCascade�ڵ�</param>
		protected	void	NodeCascade(XmlNode lxn_node)
		{
			XmlNodeList		lxnl_param;
			OracleParameter lp_param;
			string			ls_name,ls_srccolumn,ls_version,ls_datatype;
			OracleDbType	lty_oratype;
			DataRowVersion  lvs_version;
			int				li_len;

			if(lxn_node==null)	return;
			//���ʵĽڵ����������
			string	ls_sql="";
			if(null!=lxn_node.FirstChild && XmlNodeType.Text==lxn_node.FirstChild.NodeType)
				ls_sql=lxn_node.FirstChild.Value;
			OracleCommand cmd=new OracleCommand(ls_sql,_conn);
			switch(lxn_node.Attributes["name"].Value.ToLower())
			{
				case "select":	throw(new Exception("��������Ч�����ݷ��ʹ���!"));
				case "insert":	this._listCmdCasInsert.Add(cmd);break;
				case "update":	this._listCmdCasUpdate.Add(cmd);break;
				case "delete":	this._listCmdCasDelete.Add(cmd);break;
				default:		throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			//���Ӳ���
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
				//��������
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
				//���ݰ汾
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//���ִ��������ķ�ʽ:Դ�ֶ�,�������ݳ���
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
		/// ��ȡSQLText�ڵ�
		/// </summary>
		/// <param name="lxn_node">SQL���ڵ�</param>
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
				default:		throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			//���Ӳ���
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
				//��������
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
				//���ݰ汾
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//���ִ��������ķ�ʽ:Դ�ֶ�,�������ݳ���
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
		/// ��ȡSQLText�ڵ�
		/// </summary>
		/// <param name="lxn_node">SQL���ڵ�</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
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

			//LEO ���书�ܣ����Ӻ궨�壬�� ??num
			// select top ??num * from tab, Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮
			// strParams[],Ϊ���ݵ��ַ������飬������Ϊ�滻����
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
				default:		throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			//���Ӳ���
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
				//��������
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
				//���ݰ汾
				switch(ls_version.ToLower())
				{
					case "original":
						lvs_version=DataRowVersion.Original;break;
					case "current":
					default:
						lvs_version=DataRowVersion.Current;break;
				}
				//���ִ��������ķ�ʽ:Դ�ֶ�,�������ݳ���
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
		/// ���ò�������������
		/// </summary>
		/// <param name="ps_item">Ҫ���µ�������Ŀ</param>
		/// <param name="ps_optype">���²�������(insert,update,delete)</param>
		/// <param name="p_paramlist">�����б�</param>
		/// <returns>�Ƿ�ɹ�</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList	parameters)
		{
			string	ls_key;
			OracleCommand		cmd=null;		//���ڲ�����sql����
			ArrayList			listCmdCascade;	//�����Ĳ��������б�
			OracleParameter		param;			//�����õ��Ĳ���
			OracleTransaction	trans=null;			//�������
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)	this.SetItem(item);
			if(this._item.Length<1)	return false;
			//���ݲ���������ȡOracleCommand����
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
				default: throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//���ݲ���
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
				//�����ݿ⣬�ύ����
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
		/// ���ò���������������������
		/// </summary>
		/// <param name="ps_item">Ҫ���µ�������Ŀ</param>
		/// <param name="ps_optype">���²�������(insert,update,delete)</param>
		/// <param name="p_paramlist">�����б�</param>
		/// <returns>�Ƿ�ɹ�</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList[]	parameterslist)
		{
			string	ls_key;
			OracleCommand		cmd=null;		//���ڲ�����sql����
			ArrayList			listCmdCascade;	//�����Ĳ��������б�
			OracleParameter		param;			//�����õ��Ĳ���
			OracleTransaction	trans=null;			//�������
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)	this.SetItem(item);
			if(this._item.Length<1)	return false;
			//���ݲ���������ȡOracleCommand����
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
				default: throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//���ݲ���
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
					//�����ݿ⣬�ύ����
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
		/// ���ò�������������
		/// </summary>
		/// <param name="ps_item">Ҫ���µ�������Ŀ</param>
		/// <param name="ps_optype">���²�������(insert,update,delete)</param>
		/// <param name="p_paramlist">�����б�</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�Ƿ�ɹ�</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList	parameters,string[] strParams)
		{
			string	ls_key;
			OracleCommand		cmd=null;		//���ڲ�����sql����
			ArrayList			listCmdCascade;	//�����Ĳ��������б�
			OracleParameter		param;			//�����õ��Ĳ���
			OracleTransaction	trans=null;			//�������
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)	this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			//���ݲ���������ȡOracleCommand����
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
				default: throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//���ݲ���
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
				//�����ݿ⣬�ύ����
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
		/// ���ò���������������������
		/// </summary>
		/// <param name="ps_item">Ҫ���µ�������Ŀ</param>
		/// <param name="ps_optype">���²�������(insert,update,delete)</param>
		/// <param name="p_paramlist">�����б�</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�Ƿ�ɹ�</returns>
		protected	bool	ExecuteNonQuery(string item,string ps_optype,NameObjectList[]	parameterslist,string[] strParams)
		{
			string	ls_key;
			OracleCommand		cmd=null;		//���ڲ�����sql����
			ArrayList			listCmdCascade;	//�����Ĳ��������б�
			OracleParameter		param;			//�����õ��Ĳ���
			OracleTransaction	trans=null;			//�������
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)	this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			//���ݲ���������ȡOracleCommand����
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
				default: throw(new Exception("��������Ч�����ݷ��ʹ���!"));
			}
			listCmdCascade.Insert(0,cmd);
			try
			{
				//���ݲ���
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
					//�����ݿ⣬�ύ����
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
		/// д��־
		/// </summary>
		/// <param name="textToAdd">д����־��Ϣ</param>
		protected void CreateLogFile(string textToAdd) 
		{
			string logFile = DateTime.Now.ToLongDateString()
				.Replace(@"/",@"-").Replace(@"\",@"-") + ".log";
			logFile=System.Web.HttpContext.Current.Server.MapPath("������־\\"+logFile);
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

		#region IQueryDAO ��Ա

		/// <summary>
		/// ���÷���������Ŀ
		/// ����������Դ�ļ���ʼ�����ݹ��ܼ���ѯ�͸��¹���
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool SetItem(string item)
		{
			XmlNode		lxn_item;	//���ݷ�����Ŀ�ڵ�
			XmlNodeList	lxnl_cmdsql;		//����ڵ��б�

			this._item="";		//�������ݷ�����ĿΪ��
			lxn_item=_xmldoc.DocumentElement.SelectSingleNode("DataItem[@name='"+item+"']");
			if(lxn_item==null) 
				throw(new Exception("ϵͳ��Դû���ṩ����Ŀ���ݵķ��ʹ���!"));

			//������Ŀ����
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
			//���ü�������;����������������,������ѡ�������
			this._listCmdCasDelete.Clear();
			this._listCmdCasUpdate.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLCascade");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeCascade(lxn_node);
			this._item=item;
			return true;
		}

		
		#region ֻ����������
		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀselect�����б�
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀinsert�����б�
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀupdate�����б�
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀdelete�����б�
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

		#region ֻ��ִ������
		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀselect����
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀinsert����
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀupdate����
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
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀdelete����
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

		#region �ⲿ�������񷽷�

        /// <summary>
        /// �������ݿ�����
        /// </summary>
        /// <returns>�Ƿ�ɹ�</returns>
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
		/// �������ݿ����Ӳ���ʼ����
		/// </summary>
		/// <returns>�Ƿ�ɹ�</returns>
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
		/// �ύ�δ�����,���ر����ݿ�����
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
		/// �ع��δ�����,���ر����ݿ�����,û������ֱ�ӹر�
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
		/// �ر����ݿ�
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
        /// ������Ŀ���ƺͲ����б��ȡ�������
        /// </summary>
        /// <param name="item">������Ŀ����</param>
        /// <param name="parameters">��ѯ�����б�</param>
        /// <returns>���ؽ��</returns>
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
                    if (param == null) continue;		//����û�еĲ���ʱ����
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
		/// ������Ŀ���ƺͲ����б��ȡ���ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <returns>����DataTable�����ݼ�</returns>
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
					if(param==null) continue;		//����û�еĲ���ʱ����
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
        /// ����ָ����SQL����ѯ���ݱ�
        /// </summary>
        /// <param name="strSQL">SQL���</param>
        /// <returns>����DataTable�����ݼ�</returns>
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
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <param name="ds">���ݼ�</param>
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
					if(param==null) continue;		//����û�еĲ���ʱ����
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
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <param name="ds">���ݼ�</param>
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
						if(param==null) continue;		//����û�еĲ���ʱ����
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
				throw(new Exception("���ø��¹���ʧ��!"));
			if (ds.HasErrors)
			{
				throw(new Exception("Υ������У��!"));
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
		/// ����DataTable����������
		/// </summary>
		/// <param name="item">Ҫ���µ�������Ŀ</param>
		/// <param name="tab">Ҫ���µ�����DataTable</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		Update(string item,DataTable tab)
		{
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("���ø��¹���ʧ��!"));
			if (tab.HasErrors)
			{
				throw(new Exception("Υ������У��!"));
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
				//�ȸ��¼����������ٸ��±�����Ŀ����
				_conn.Open();
				trans=_conn.BeginTransaction();
				//��ѡ�����������޸ĵ�
				this._adapter.Update(tab.Select("","",DataViewRowState.Added|DataViewRowState.ModifiedCurrent));
				//��������
				for(int i=0;i<this._listCmdCasInsert.Count;i++)
				{
					cmd=this._listCmdCasInsert[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.InsertCommand=cmd;
					this._adpCascade.Update(drs_ins);
				}
				this._adpCascade.InsertCommand=null;
				//��������
				for(int i=0;i<this._listCmdCasUpdate.Count;i++)
				{
					cmd=this._listCmdCasUpdate[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.UpdateCommand=cmd;
					this._adpCascade.Update(drs_mody);
				}
				this._adpCascade.UpdateCommand=null;
				//����ɾ��
				for(int i=0;i<this._listCmdCasDelete.Count;i++)
				{
					cmd=this._listCmdCasDelete[i] as OracleCommand;
					if(cmd==null)	continue;
					this._adpCascade.DeleteCommand=cmd;
					this._adpCascade.Update(drs_del);
				}
				this._adpCascade.DeleteCommand=null;
				//������ɾ����
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
				throw(new Exception("���ø��¹���ʧ��!"));
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
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ����������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²���</param>
		/// <param name="paramsListDel">�ύ��ɾ������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel)
		{
			ArrayList			listCmdCascade=null;	//�����Ĳ��������б�
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			for(int i=0;i<3;i++)
			{	//���ݲ���
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
			OracleTransaction	trans=null;			//�������
			bool				isAutoConn=true,isSuccess=true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
			try
			{   
				//�����ݿ⣬�ύ����
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
        /// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
        /// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
        /// </summary>
        /// <param name="item">Ҫ�ύ��������Ŀ</param>
        /// <param name="paramsListIns">�ύ����������</param>
        /// <param name="paramsListUpt">�ύ�ĸ��²���</param>
        /// <param name="paramsListDel">�ύ��ɾ������</param>
        /// <returns>�����Ƿ�ɹ�</returns>
        public bool ExecuteNonQuery(string item, string svrCnnKey, NameObjectList paramsIns, NameObjectList paramsUpt, NameObjectList paramsDel)
        {
            ArrayList listCmdCascade = null;	//�����Ĳ��������б�
            //��ʼ��������Ŀ�Ĺ���
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1) return false;
            for (int i = 0; i < 3; i++)
            {	//���ݲ���
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
            OracleTransaction trans = null;			//�������
            bool isAutoConn = true, isSuccess = true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
            try
            {
                //�����ݿ⣬�ύ����
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
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ��������������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²�������</param>
		/// <param name="paramsListDel">�ύ��ɾ����������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel)
		{
			ArrayList			listCmdCascade=null;	//�����Ĳ��������б�
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)	return false;
			OracleTransaction	trans=null;			//�������
			bool				isAutoConn=true,isSuccess=true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
			try
			{   
				//�����ݿ⣬�ύ����
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
					//���������൱�ڶ������ݸ���,�����������Ҫִ�ж��SQLCommand
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
				//�Զ��������ύ;�ⲿ��������Ͳ��ύ
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
            ArrayList listCmdCascade = null;	//�����Ĳ��������б�
            //��ʼ��������Ŀ�Ĺ���
            if (item != this._item)
                this.SetItem(item);
            if (this._item.Length < 1) return false;
            OracleTransaction trans = null;			//�������
            bool isAutoConn = true, isSuccess = true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
            try
            {
                //�����ݿ⣬�ύ����
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
                    //���������൱�ڶ������ݸ���,�����������Ҫִ�ж��SQLCommand
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
                //�Զ��������ύ;�ⲿ��������Ͳ��ύ
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
		/// ���ò�������"insert"���ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteInsert(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"insert",parameters);
		}


		/// <summary>
		/// ���ò�������"update"���������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteUpdate(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"update",parameters);
		}

	
		/// <summary>
		/// ���ò�������"delete"����ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteDelete(string item,NameObjectList parameters)
		{
			return	this.ExecuteNonQuery(item,"delete",parameters);
		}

		/// <summary>
		/// ���ò������鰴��"insert"�������ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"insert",parameterslist);
		}


		/// <summary>
		/// ���ò������鰴��"update"��������������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteUpdate(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"update",parameterslist);
		}

	
		/// <summary>
		/// ���ò������鰴��"delete"��������ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist)
		{
			return	this.ExecuteNonQuery(item,"delete",parameterslist);
		}

		/// <summary>
		/// ������(Stream)д�뵥�����ֶ�����
		/// </summary>
		/// <param name="item">Ҫд���������Ŀ</param>
		/// <param name="parameters">д�����ݵĲ���</param>
		/// <returns>д�����Ƿ�ɹ�</returns>
		public bool		WriteSingleStream(string item,NameObjectList parameters)
		{
			string	ls_key;
			if(item!=this._item)
				this.SetItem(item);
			if(this._item.Length<1)
				throw(new Exception("���ø��¹���ʧ��!"));
			if(this._adapter.UpdateCommand==null)
				throw(new Exception("û�����ø��´��ֶεĹ���"));
			OracleCommand	cmd=this._adapter.UpdateCommand;
			OracleParameter	param;Stream	stream;
			NameObjectList treams=new NameObjectList();		//���ֶ�ʹ����
			try
			{
				//���ֶ����͵����������÷�ʽ�ĸ�ֵ
				_conn.Open();
				for(int i=0;i<parameters.Count;i++)
				{
					ls_key=parameters.Keys[i];
					param=cmd.Parameters[ls_key];
					if(param==null) continue;		//����û�еĲ���ʱ����
					stream=parameters[ls_key] as Stream;
					if(stream!=null)	//�������,�Դ��ֶδ���
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
		/// ����һ��ȫ��Ψһ��ʶ��
		/// </summary>
		/// <returns>����ȫ��Ψһ��ʶ��</returns>
		public static	Guid	NewGuid()
		{
			return Guid.NewGuid();
		}
		#endregion

		#region �����ӽӿ�

		/// <summary>
		/// ���÷���������Ŀ
		/// ����������Դ�ļ���ʼ�����ݹ��ܼ���ѯ�͸��¹���
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool SetItem(string item,string[] strParams)
		{
			XmlNode		lxn_item;	//���ݷ�����Ŀ�ڵ�
			XmlNodeList	lxnl_cmdsql;		//����ڵ��б�

			this._item="";		//�������ݷ�����ĿΪ��
			lxn_item=_xmldoc.DocumentElement.SelectSingleNode("DataItem[@name='"+item+"']");
			if(lxn_item==null) 
				throw(new Exception("ϵͳ��Դû���ṩ����Ŀ���ݵķ��ʹ���!"));

			//������Ŀ����
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
			//���ü�������;����������������,������ѡ�������
			this._listCmdCasDelete.Clear();
			this._listCmdCasUpdate.Clear();
			lxnl_cmdsql=lxn_item.SelectNodes("SQLCascade");
			foreach(XmlNode lxn_node in lxnl_cmdsql)
				this.NodeCascade(lxn_node,strParams);
			this._item=item;
			return true;
		}


		/// <summary>
		/// ������Ŀ���ƺͲ����б��ȡ���ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>����DataTable�����ݼ�</returns>
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
					if(param==null) continue;		//����û�еĲ���ʱ����
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
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">Ҫ�������ݼ�Table����</param>
		/// <param name="parameters">�����б�</param>
		/// <param name="strParams">�ַ��������б�</param>
		/// <param name="ds">Ҫ�������ݼ�</param>
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
					if(param==null) continue;		//����û�еĲ���ʱ����
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
		/// ���ò�������"insert"���ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteInsert(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"insert",parameters,strParams);
		}


		/// <summary>
		/// ���ò�������"update"���������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteUpdate(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"update",parameters,strParams);
		}

	
		/// <summary>
		/// ���ò�������"delete"����ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteDelete(string item,NameObjectList parameters,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"delete",parameters,strParams);
		}

		/// <summary>
		/// ���ò������鰴��"insert"�������ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"insert",parameterslist,strParams);
		}


		/// <summary>
		/// ���ò������鰴��"update"��������������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteUpdate(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"update",parameterslist,strParams);
		}

	
		/// <summary>
		/// ���ò������鰴��"delete"��������ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			return	this.ExecuteNonQuery(item,"delete",parameterslist,strParams);
		}

		/// <summary>
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ����������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²���</param>
		/// <param name="paramsListDel">�ύ��ɾ������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel,string[] strParams)
		{
			ArrayList			listCmdCascade=null;	//�����Ĳ��������б�
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			for(int i=0;i<3;i++)
			{	//���ݲ���
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
			OracleTransaction	trans=null;			//�������
			bool				isAutoConn=true,isSuccess=true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
			try
			{   
				//�����ݿ⣬�ύ����
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
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ��������������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²�������</param>
		/// <param name="paramsListDel">�ύ��ɾ����������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel,string[] strParams)
		{
			ArrayList			listCmdCascade=null;	//�����Ĳ��������б�
			//��ʼ��������Ŀ�Ĺ���
			if(item!=this._item)
				this.SetItem(item,strParams);
			if(this._item.Length<1)	return false;
			OracleTransaction	trans=null;			//�������
			bool				isAutoConn=true,isSuccess=true;	//Ĭ�ϲ�ʹ���ⲿ������������,Ĭ�ϳɹ�ִ��
			try
			{   
				//�����ݿ⣬�ύ����
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
					//���������൱�ڶ������ݸ���,�����������Ҫִ�ж��SQLCommand
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
				//�Զ��������ύ;�ⲿ��������Ͳ��ύ
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
