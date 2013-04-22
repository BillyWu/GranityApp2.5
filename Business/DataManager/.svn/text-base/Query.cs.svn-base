using System;
using System.Data;
using System.Web.Configuration;
using Estar.Common.Tools;
using Estar.DataAccess.DataAccessInterface;
using Estar.DataAccess.OdpNetDataAccess;
using Estar.DataAccess.SqlClientDataAccess;
using Estar.DataAccess.OleDbDataAccess;

namespace Estar.Business.DataManager
{
	/// <summary>
	/// Xml格式定义数据访问:以数据集名称和参数方式访问数据
	/// </summary>
	public class QueryDataRes
	{
		private	DataAccRes	_DataRes;
		private	IQueryDAO	_QueryDAO;

        static private QueryDataRes _querySys = null;

		#region 构造函数
		/// <summary>
		/// 创建数据访问资源,默认以ODPNet方式访和当前页面dataitem.xml访问数据,数据库连接配置在WebConfig
		/// </summary>
		public QueryDataRes()
		{
			this.DataRes=new DataAccRes();
		}

		/// <summary>
		/// 创建数据访问资源,指定数据资源文件,使用默认数据源连接
		/// </summary>
        /// <param name="xmlfile">数据资源文件</param>
		public QueryDataRes(string	xmlfile)
		{
			this.DataRes=new DataAccRes(xmlfile);
		}

		/// <summary>
		/// 创建数据访问资源,依据资源定义
		/// </summary>
		/// <param name="DataRes"></param>
		public QueryDataRes(DataAccRes	DataRes)
		{
			this.DataRes=DataRes;
		}
		#endregion

		/// <summary>
		/// 改变数据访问资源,访问组件随之改变
		/// </summary>
		public DataAccRes	DataRes
		{
			get{return _DataRes;}
			set
			{
				if(null==value) throw(new ArgumentNullException("DataRes"));
				_DataRes=value;
				switch(_DataRes.DBAccessType)
				{
					case DataAccessType.SqlClient:
						_QueryDAO=new SqlQueryDAO();
						break;
					case DataAccessType.OLEDB:
						_QueryDAO=new OleDbQueryDAO();break;
					case DataAccessType.ODPNet:
						_QueryDAO=new OdpQueryDAO();break;
					default:
						throw(new Exception("此种访问方式没有定义!"));
				}
				_QueryDAO.ConnStr=_DataRes.ConnStr;
				_QueryDAO.XmlFileStr=_DataRes.XmlFile;
			}
		}


		#region 统一访问方式实现

		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <returns>返回是否成功</returns>
		public bool SetItem(string item)
		{
			return this._QueryDAO.SetItem(item);
		}

		#region 只读参数属性
		/// <summary>
		/// 读取当前访问的数据源项目select参数列表
		/// </summary>
		public NameParamCollection		SelParamList
		{
			get{return this._QueryDAO.SelParamList;}
		}

		/// <summary>
		/// 读取当前访问的数据源项目insert参数列表
		/// </summary>
		public NameParamCollection		InsParamList
		{
			get{return this._QueryDAO.InsParamList;}
		}

		/// <summary>
		/// 读取当前访问的数据源项目update参数列表
		/// </summary>
		public NameParamCollection		UptParamList
		{
			get{return this._QueryDAO.UptParamList;}
		}

		/// <summary>
		/// 读取当前访问的数据源项目delete参数列表
		/// </summary>
		public NameParamCollection		DelParamList
		{
			get{return this._QueryDAO.DelParamList;}
		}
		#endregion

		#region 只读执行命令
		/// <summary>
		/// 读取当前访问的select命令
		/// </summary>
		public DBCommand	SelCommand
		{
			get{return this._QueryDAO.SelCommand;}
		}


		/// <summary>
		/// 读取当前访问的insert命令
		/// </summary>
		public DBCommand	InsCommand
		{
			get{return this._QueryDAO.InsCommand;}
		}

		/// <summary>
		/// 读取当前访问的update命令
		/// </summary>
		public DBCommand	UptCommand
		{
			get{return this._QueryDAO.UptCommand;}
		}

		/// <summary>
		/// 读取当前访问的delete命令
		/// </summary>
		public DBCommand	DelCommand
		{
			get{return this._QueryDAO.DelCommand;}
		}
		#endregion

		#region 外部定制事务方法

        /// <summary>
        /// 启动数据库连接
        /// </summary>
        /// <returns>是否成功</returns>
        public bool Open()
        {
            return this._QueryDAO.Open();
        }

        /// <summary>
		/// 启动数据库连接并开始事务
		/// </summary>
		/// <returns>是否成功</returns>
		public bool		BeginTransaction()
		{
			return	this._QueryDAO.BeginTransaction();
		}


		/// <summary>
		/// 提交次此事务,并关闭数据库连接
		/// </summary>
		/// <returns></returns>
		public bool		Commit()
		{
			return this._QueryDAO.Commit();
		}

		/// <summary>
		/// 回滚次此事务,并关闭数据库连接,没有事务直接关闭
		/// </summary>
		/// <returns></returns>
		public bool		RollbackAndClose()
		{
			return this._QueryDAO.RollbackAndClose();
		}

		/// <summary>
		/// 关闭数据库
		/// </summary>
		/// <returns></returns>
		public 	bool	Close()
		{
			return this._QueryDAO.Close();
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
            return this._QueryDAO.ExecuteScalar(item, parameters);
        }

        /// <summary>
		/// 查询数据
		/// </summary>
		/// <param name="item">查询的数据项目</param>
		/// <param name="paramlist">查询的参数列表</param>
		/// <returns>返回数据集,失败返回null</returns>
		public DataTable getTable(string item,NameObjectList paramlist)
		{
			return	this._QueryDAO.GetDataTable(item,paramlist);
		}

        /// <summary>
        /// 根据指定的SQL语句查询数据表
        /// </summary>
        /// <param name="strSQL">SQL语句</param>
        /// <returns>返回DataTable的数据集</returns>
        public DataTable GetDataTableBySql(string strSQL)
        {
            return this._QueryDAO.GetDataTableBySql(strSQL);
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
			return this._QueryDAO.FillDataSet(item,parameters,ds);
		}

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
        /// <param name="paramList">查询参数列表</param>
		/// <param name="ds">数据集</param>
		/// <returns></returns>
		public	int			FillDataSet(string item, NameObjectList[] paramList,DataSet ds)
		{
			return this._QueryDAO.FillDataSet(item,paramList,ds);
		}

		/// <summary>
		/// 利用DataTable更新数据
		/// </summary>
		/// <param name="item">更新的数据项目</param>
		/// <param name="tab">更新的数据集</param>
		/// <returns>是否更新成功</returns>
		public bool Update(string item,DataTable tab)
		{
			if(item=="" || tab==null)
				return false;
			return this._QueryDAO.Update(item,tab);

		}


		/// <summary>
		/// 利用参数按照"insert"项提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList parameters)
		{
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteInsert(item,parameters);
		}

		/// <summary>
		/// 利用参数按照"update"项更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList parameters)
		{
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteUpdate(item,parameters);
		}

		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList parameters)
		{
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteDelete(item,parameters);
		}

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist)
		{
			if(item=="" || parameterslist==null)
				return false;
			if(parameterslist.Length<1)
				return true;
			return this._QueryDAO.ExecuteInsert(item,parameterslist);
		}

		/// <summary>
		/// 利用参数数组按照"update"项批量更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteUpdate(string item,NameObjectList[] parameterslist)
		{
			if(item=="" || parameterslist==null)
				return false;
			if(parameterslist.Length<1)
				return true;
			return this._QueryDAO.ExecuteUpdate(item,parameterslist);
		}

		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist)
		{
			if(item=="" || parameterslist==null)
				return false;
			if(parameterslist.Length<1)
				return true;
			return this._QueryDAO.ExecuteDelete(item,parameterslist);
		}

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
        /// <param name="paramsIns">提交的新增参数</param>
        /// <param name="paramsUpt">提交的更新参数</param>
        /// <param name="paramsDel">提交的删除参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel)
		{
			if(""==item || null==paramsIns || null==paramsUpt || null==paramsDel)
				return false;
			return this._QueryDAO.ExecuteNonQuery(item,paramsIns,paramsUpt,paramsDel);
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
			if(""==item || null==paramsListIns || null==paramsListUpt || null==paramsListDel)
				return false;
			if(paramsListIns.Length<1 && paramsListUpt.Length<1 && paramsListDel.Length<1)
				return true;
			return this._QueryDAO.ExecuteNonQuery(item,paramsListIns,paramsListUpt,paramsListDel);
		}

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
        /// <param name="paramsIns">提交的新增参数</param>
        /// <param name="paramsUpt">提交的更新参数</param>
        /// <param name="paramsDel">提交的删除参数</param>
        /// <param name="strParams">附加字符串数组参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel,string[] strParams)
		{
			if(""==item || null==paramsIns || null==paramsUpt || null==paramsDel)
				return false;
			return this._QueryDAO.ExecuteNonQuery(item,paramsIns,paramsUpt,paramsDel,strParams);
		}

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数数组</param>
		/// <param name="paramsListUpt">提交的更新参数数组</param>
		/// <param name="paramsListDel">提交的删除参数数组</param>
        /// <param name="strParams">附加字符串数组参数</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel,string[] strParams)
		{
			if(""==item || null==paramsListIns || null==paramsListUpt || null==paramsListDel)
				return false;
			if(paramsListIns.Length<1 && paramsListUpt.Length<1 && paramsListDel.Length<1)
				return true;
			return this._QueryDAO.ExecuteNonQuery(item,paramsListIns,paramsListUpt,paramsListDel,strParams);
		}

		/// <summary>
		/// 更新大字段内容,一次只能更新一条记录,大字段使用stream类型传递
		/// </summary>
		/// <param name="item">数据项目名称</param>
        /// <param name="paramlist">字段参数列表,大字段使用stream类型传递</param>
		/// <returns>更新是否成功</returns>
		public bool WriteSingleStream(string item,NameObjectList paramlist)
		{
			if(item=="" || paramlist==null)
				return false;
			return this._QueryDAO.WriteSingleStream(item,paramlist);
		}


		/// <summary>
		/// 产生一个全局唯一标识符
		/// </summary>
		/// <returns>返回全局唯一标识符</returns>
		public static	Guid	NewGuid(DataAccessType pdbtype)
		{
			switch(pdbtype)
			{
				case DataAccessType.SqlClient:
					return SqlQueryDAO.NewGuid();
				case DataAccessType.OLEDB:
					return OleDbQueryDAO.NewGuid();
				case DataAccessType.ODPNet:
					return OdpQueryDAO.NewGuid();
				default:
					throw(new Exception("此种访问方式没有定义!"));
			}
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

		#region 新增加访问方式
		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>返回是否成功</returns>
		public bool SetItem(string item,string[] strParams)
		{
			return this._QueryDAO.SetItem(item,strParams);
		}
		/// <summary>
		/// 查询数据
		/// </summary>
		/// <param name="item">查询的数据项目</param>
		/// <param name="paramlist">查询的参数列表</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>返回数据集,失败返回null</returns>
		public DataTable getTable(string item,NameObjectList paramlist,string[] strParams)
		{
			return	this._QueryDAO.GetDataTable(item,paramlist,strParams);
		}

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">要填充的数据集Table名称</param>
		/// <param name="parameters">参数列表</param>
		/// <param name="strParams">字符串参数列表</param>
		/// <param name="ds">要填充的数据集</param>
		/// <returns></returns>
		public	int		FillDataSet(string item, NameObjectList parameters,string[] strParams,DataSet ds)
		{
			return this._QueryDAO.FillDataSet(item,parameters,strParams,ds);
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
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteInsert(item,parameters,strParams);
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
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteUpdate(item,parameters,strParams);
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
			if(item=="" || parameters==null)
				return false;
			return this._QueryDAO.ExecuteDelete(item,parameters,strParams);
		}

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteInsert(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			if(item=="" || parameterslist==null)
				return false;
			return this._QueryDAO.ExecuteInsert(item,parameterslist,strParams);
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
			if(item=="" || parameterslist==null)
				return false;
			return this._QueryDAO.ExecuteUpdate(item,parameterslist,strParams);
		}

		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>操作是否成功</returns>
		public bool		ExecuteDelete(string item,NameObjectList[] parameterslist,string[] strParams)
		{
			if(item=="" || parameterslist==null)
				return false;
			return this._QueryDAO.ExecuteDelete(item,parameterslist,strParams);
		}


		#endregion

        #region 公共属性

        /// <summary>
        /// 读取系统查询对象
        /// </summary>
        static public QueryDataRes QuerySys
        {
            get 
            {
                if(null==QueryDataRes._querySys)
                {
                    string strDataSrcFile = DataAccRes.AppSettings("SystemConfig");
                   QueryDataRes._querySys = new QueryDataRes(strDataSrcFile);
                }
                return QueryDataRes._querySys;
            }
        }

        /// <summary>
        /// 产生一个系统查询对象
        /// </summary>
        /// <returns></returns>
        static public QueryDataRes CreateQuerySys()
        {
            string strDataSrcFile = DataAccRes.AppSettings("SystemConfig");
            return new QueryDataRes(strDataSrcFile);

        }
        #endregion

    }
}
