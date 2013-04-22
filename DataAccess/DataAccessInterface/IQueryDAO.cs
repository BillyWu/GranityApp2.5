using System;
using System.Data;
using Estar.Common.Tools;

namespace Estar.DataAccess.DataAccessInterface
{
	/// <summary>
	/// xml格式定义数据访问
	/// </summary>
	public interface IQueryDAO
	{
		/// <summary>
		/// 读取和设置数据访问资源文件
		/// </summary>
		string	XmlFileStr
		{get;set;}

		/// <summary>
		/// 读取和设置访问连接字符串
		/// </summary>
		string	ConnStr
		{get;set;}

		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <returns>返回是否成功</returns>
		bool SetItem(string item);

        /// <summary>
        /// 启动数据库连接
        /// </summary>
        /// <returns>打开数据库</returns>
        bool Open();

        /// <summary>
		/// 启动数据库连接并开始事务
		/// </summary>
		/// <returns></returns>
		bool	BeginTransaction();

		/// <summary>
		/// 提交次此事务,并关闭数据库连接
		/// </summary>
		/// <returns></returns>
		bool	Commit();

		/// <summary>
		/// 回滚次此事务,并关闭数据库连接;没有事务直接关闭
		/// </summary>
		/// <returns></returns>
		bool	RollbackAndClose();

		/// <summary>
		/// 关闭数据库
		/// </summary>
		/// <returns></returns>
		bool	Close();

		/// <summary>
		/// 读取当前访问的数据源项目select参数列表
		/// </summary>
		NameParamCollection		SelParamList
		{get;}

		/// <summary>
		/// 读取当前访问的数据源项目insert参数列表
		/// </summary>
		NameParamCollection		InsParamList
		{get;}

		/// <summary>
		/// 读取当前访问的数据源项目update参数列表
		/// </summary>
		NameParamCollection		UptParamList
		{get;}

		/// <summary>
		/// 读取当前访问的数据源项目delete参数列表
		/// </summary>
		NameParamCollection		DelParamList
		{get;}

		/// <summary>
		/// 读取当前访问的select命令
		/// </summary>
		DBCommand	SelCommand
		{get;}


		/// <summary>
		/// 读取当前访问的insert命令
		/// </summary>
		DBCommand	InsCommand
		{get;}

		/// <summary>
		/// 读取当前访问的update命令
		/// </summary>
		DBCommand	UptCommand
		{get;}

		/// <summary>
		/// 读取当前访问的delete命令
		/// </summary>
		DBCommand	DelCommand
		{get;}


        /// <summary>
        /// 根据项目名称和参数列表获取单个结果
        /// </summary>
        /// <param name="item">数据项目名称</param>
        /// <param name="parameters">查询参数列表</param>
        /// <returns>返回结果</returns>
        object ExecuteScalar(string item, NameObjectList parameters);
		
        /// <summary>
		/// 根据项目名称和参数列表获取数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <returns>返回DataTable的数据集</returns>
		DataTable GetDataTable(string item, NameObjectList parameters);

        /// <summary>
        /// 根据指定的SQL语句查询数据表
        /// </summary>
        /// <param name="strSQL">SQL语句</param>
        /// <returns>返回DataTable的数据集</returns>
        DataTable GetDataTableBySql(string strSQL);

        /// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <param name="ds">数据集</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList parameters,DataSet ds);

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">要填充的数据集Table名称</param>
		/// <param name="parameters">参数列表</param>
		/// <param name="strParams">字符串参数列表</param>
		/// <param name="ds">要填充的数据集</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList parameters,string[] strParams,DataSet ds);

		/// <summary>
		/// 根据项目名称和参数列表填充数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <param name="ds">数据集</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList[] paramList,DataSet ds);

		/// <summary>
		/// 利用DataTable更新数据
		/// </summary>
		/// <param name="item">更新的数据项目</param>
		/// <param name="ds">数据表</param>
		/// <returns></returns>
		bool		Update(string item,DataSet ds);		

		/// <summary>
		/// 利用DataTable来更新数据
		/// </summary>
		/// <param name="item">要更新的数据项目</param>
		/// <param name="tab">要更新的数据DataTable</param>
		/// <returns>更新是否成功</returns>
		bool		Update(string item,DataTable tab);		

		/// <summary>
		/// 利用数据行更新数据
		/// </summary>
		/// <param name="item">更新的数据项目</param>
		/// <param name="drs">数据行</param>
		/// <returns></returns>
		bool		Update(string item,DataRow[] drs);

		/// <summary>
		/// 利用参数按照"insert"项提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteInsert(string item,NameObjectList parameters);

		/// <summary>
		/// 利用参数按照"update"项更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteUpdate(string item,NameObjectList parameters);
	
		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteDelete(string item,NameObjectList parameters);

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteInsert(string item,NameObjectList[] parameterslist);

		/// <summary>
		/// 利用参数数组按照"update"项批量更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteUpdate(string item,NameObjectList[] parameterslist);
	
		/// <summary>
		/// 利用参数数组按照"delete"项来批量删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteDelete(string item,NameObjectList[] parameterslist);

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数</param>
		/// <param name="paramsListUpt">提交的更新参数</param>
		/// <param name="paramsListDel">提交的删除参数</param>
		/// <returns>操作是否成功</returns>
		bool ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel);

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数数组</param>
		/// <param name="paramsListUpt">提交的更新参数数组</param>
		/// <param name="paramsListDel">提交的删除参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel);

		/// <summary>
		/// 利用流(Stream)写入单个大字段数据
		/// </summary>
		/// <param name="item">要写入的数据项目</param>
		/// <param name="parameters">写入数据的参数</param>
		/// <returns>写入流是否成功</returns>
		bool		WriteSingleStream(string item,NameObjectList parameters);

		#region 新增加接口

		/// <summary>
		/// 设置访问数据项目
		/// 根据数据资源文件初始化数据构架及查询和更新规则
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="strParams">约定??num为自定义变量，通过传递的定符串替代之</param>
		/// <returns>返回是否成功</returns>
		bool SetItem(string item,string[] strParams);

		/// <summary>
		/// 根据项目名称和参数列表获取数据集
		/// </summary>
		/// <param name="item">数据项目名称</param>
		/// <param name="parameters">查询参数列表</param>
		/// <returns>返回DataTable的数据集</returns>
		DataTable GetDataTable(string item, NameObjectList parameters,string[] strParams);		

		/// <summary>
		/// 利用参数按照"insert"项提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteInsert(string item,NameObjectList parameters,string[] strParams);

		/// <summary>
		/// 利用参数按照"update"项更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteUpdate(string item,NameObjectList parameters,string[] strParams);
	
		/// <summary>
		/// 利用参数按照"delete"项来删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameters">提交的参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteDelete(string item,NameObjectList parameters,string[] strParams);

		/// <summary>
		/// 利用参数数组按照"insert"项批量提交数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteInsert(string item,NameObjectList[] parameterslist,string[] strParams);

		/// <summary>
		/// 利用参数数组按照"update"项批量更新数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteUpdate(string item,NameObjectList[] parameterslist,string[] strParams);
	
		/// <summary>
		/// 利用参数数组按照"delete"项来批量删除数据
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="parameterslist">提交的参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteDelete(string item,NameObjectList[] parameterslist,string[] strParams);


		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数</param>
		/// <param name="paramsListUpt">提交的更新参数</param>
		/// <param name="paramsListDel">提交的删除参数</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel,string[] strParams);

		/// <summary>
		/// 利用参数数组分别按照新增,更新,删除的类别来更新数据;保证事务的一致性
		/// 在执行更新时,按照删除,更新,新增的顺序执行,以避免并发冲突问题
		/// </summary>
		/// <param name="item">要提交的数据项目</param>
		/// <param name="paramsListIns">提交的新增参数数组</param>
		/// <param name="paramsListUpt">提交的更新参数数组</param>
		/// <param name="paramsListDel">提交的删除参数数组</param>
		/// <returns>操作是否成功</returns>
		bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel,string[] strParams);

		#endregion

	}
}
