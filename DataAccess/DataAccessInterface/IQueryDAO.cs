using System;
using System.Data;
using Estar.Common.Tools;

namespace Estar.DataAccess.DataAccessInterface
{
	/// <summary>
	/// xml��ʽ�������ݷ���
	/// </summary>
	public interface IQueryDAO
	{
		/// <summary>
		/// ��ȡ���������ݷ�����Դ�ļ�
		/// </summary>
		string	XmlFileStr
		{get;set;}

		/// <summary>
		/// ��ȡ�����÷��������ַ���
		/// </summary>
		string	ConnStr
		{get;set;}

		/// <summary>
		/// ���÷���������Ŀ
		/// ����������Դ�ļ���ʼ�����ݹ��ܼ���ѯ�͸��¹���
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool SetItem(string item);

        /// <summary>
        /// �������ݿ�����
        /// </summary>
        /// <returns>�����ݿ�</returns>
        bool Open();

        /// <summary>
		/// �������ݿ����Ӳ���ʼ����
		/// </summary>
		/// <returns></returns>
		bool	BeginTransaction();

		/// <summary>
		/// �ύ�δ�����,���ر����ݿ�����
		/// </summary>
		/// <returns></returns>
		bool	Commit();

		/// <summary>
		/// �ع��δ�����,���ر����ݿ�����;û������ֱ�ӹر�
		/// </summary>
		/// <returns></returns>
		bool	RollbackAndClose();

		/// <summary>
		/// �ر����ݿ�
		/// </summary>
		/// <returns></returns>
		bool	Close();

		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀselect�����б�
		/// </summary>
		NameParamCollection		SelParamList
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀinsert�����б�
		/// </summary>
		NameParamCollection		InsParamList
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀupdate�����б�
		/// </summary>
		NameParamCollection		UptParamList
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�����Դ��Ŀdelete�����б�
		/// </summary>
		NameParamCollection		DelParamList
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�select����
		/// </summary>
		DBCommand	SelCommand
		{get;}


		/// <summary>
		/// ��ȡ��ǰ���ʵ�insert����
		/// </summary>
		DBCommand	InsCommand
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�update����
		/// </summary>
		DBCommand	UptCommand
		{get;}

		/// <summary>
		/// ��ȡ��ǰ���ʵ�delete����
		/// </summary>
		DBCommand	DelCommand
		{get;}


        /// <summary>
        /// ������Ŀ���ƺͲ����б��ȡ�������
        /// </summary>
        /// <param name="item">������Ŀ����</param>
        /// <param name="parameters">��ѯ�����б�</param>
        /// <returns>���ؽ��</returns>
        object ExecuteScalar(string item, NameObjectList parameters);
		
        /// <summary>
		/// ������Ŀ���ƺͲ����б��ȡ���ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <returns>����DataTable�����ݼ�</returns>
		DataTable GetDataTable(string item, NameObjectList parameters);

        /// <summary>
        /// ����ָ����SQL����ѯ���ݱ�
        /// </summary>
        /// <param name="strSQL">SQL���</param>
        /// <returns>����DataTable�����ݼ�</returns>
        DataTable GetDataTableBySql(string strSQL);

        /// <summary>
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <param name="ds">���ݼ�</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList parameters,DataSet ds);

		/// <summary>
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">Ҫ�������ݼ�Table����</param>
		/// <param name="parameters">�����б�</param>
		/// <param name="strParams">�ַ��������б�</param>
		/// <param name="ds">Ҫ�������ݼ�</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList parameters,string[] strParams,DataSet ds);

		/// <summary>
		/// ������Ŀ���ƺͲ����б�������ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <param name="ds">���ݼ�</param>
		/// <returns></returns>
		int			FillDataSet(string item, NameObjectList[] paramList,DataSet ds);

		/// <summary>
		/// ����DataTable��������
		/// </summary>
		/// <param name="item">���µ�������Ŀ</param>
		/// <param name="ds">���ݱ�</param>
		/// <returns></returns>
		bool		Update(string item,DataSet ds);		

		/// <summary>
		/// ����DataTable����������
		/// </summary>
		/// <param name="item">Ҫ���µ�������Ŀ</param>
		/// <param name="tab">Ҫ���µ�����DataTable</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		Update(string item,DataTable tab);		

		/// <summary>
		/// ���������и�������
		/// </summary>
		/// <param name="item">���µ�������Ŀ</param>
		/// <param name="drs">������</param>
		/// <returns></returns>
		bool		Update(string item,DataRow[] drs);

		/// <summary>
		/// ���ò�������"insert"���ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteInsert(string item,NameObjectList parameters);

		/// <summary>
		/// ���ò�������"update"���������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteUpdate(string item,NameObjectList parameters);
	
		/// <summary>
		/// ���ò�������"delete"����ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteDelete(string item,NameObjectList parameters);

		/// <summary>
		/// ���ò������鰴��"insert"�������ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteInsert(string item,NameObjectList[] parameterslist);

		/// <summary>
		/// ���ò������鰴��"update"��������������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteUpdate(string item,NameObjectList[] parameterslist);
	
		/// <summary>
		/// ���ò������鰴��"delete"��������ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteDelete(string item,NameObjectList[] parameterslist);

		/// <summary>
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ����������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²���</param>
		/// <param name="paramsListDel">�ύ��ɾ������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel);

		/// <summary>
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ��������������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²�������</param>
		/// <param name="paramsListDel">�ύ��ɾ����������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel);

		/// <summary>
		/// ������(Stream)д�뵥�����ֶ�����
		/// </summary>
		/// <param name="item">Ҫд���������Ŀ</param>
		/// <param name="parameters">д�����ݵĲ���</param>
		/// <returns>д�����Ƿ�ɹ�</returns>
		bool		WriteSingleStream(string item,NameObjectList parameters);

		#region �����ӽӿ�

		/// <summary>
		/// ���÷���������Ŀ
		/// ����������Դ�ļ���ʼ�����ݹ��ܼ���ѯ�͸��¹���
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="strParams">Լ��??numΪ�Զ��������ͨ�����ݵĶ��������֮</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool SetItem(string item,string[] strParams);

		/// <summary>
		/// ������Ŀ���ƺͲ����б��ȡ���ݼ�
		/// </summary>
		/// <param name="item">������Ŀ����</param>
		/// <param name="parameters">��ѯ�����б�</param>
		/// <returns>����DataTable�����ݼ�</returns>
		DataTable GetDataTable(string item, NameObjectList parameters,string[] strParams);		

		/// <summary>
		/// ���ò�������"insert"���ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteInsert(string item,NameObjectList parameters,string[] strParams);

		/// <summary>
		/// ���ò�������"update"���������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteUpdate(string item,NameObjectList parameters,string[] strParams);
	
		/// <summary>
		/// ���ò�������"delete"����ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameters">�ύ�Ĳ���</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteDelete(string item,NameObjectList parameters,string[] strParams);

		/// <summary>
		/// ���ò������鰴��"insert"�������ύ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteInsert(string item,NameObjectList[] parameterslist,string[] strParams);

		/// <summary>
		/// ���ò������鰴��"update"��������������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteUpdate(string item,NameObjectList[] parameterslist,string[] strParams);
	
		/// <summary>
		/// ���ò������鰴��"delete"��������ɾ������
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="parameterslist">�ύ�Ĳ�������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteDelete(string item,NameObjectList[] parameterslist,string[] strParams);


		/// <summary>
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ����������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²���</param>
		/// <param name="paramsListDel">�ύ��ɾ������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteNonQuery(string item,NameObjectList paramsIns,NameObjectList paramsUpt,NameObjectList paramsDel,string[] strParams);

		/// <summary>
		/// ���ò�������ֱ�������,����,ɾ�����������������;��֤�����һ����
		/// ��ִ�и���ʱ,����ɾ��,����,������˳��ִ��,�Ա��Ⲣ����ͻ����
		/// </summary>
		/// <param name="item">Ҫ�ύ��������Ŀ</param>
		/// <param name="paramsListIns">�ύ��������������</param>
		/// <param name="paramsListUpt">�ύ�ĸ��²�������</param>
		/// <param name="paramsListDel">�ύ��ɾ����������</param>
		/// <returns>�����Ƿ�ɹ�</returns>
		bool		ExecuteNonQuery(string item,NameObjectList[] paramsListIns,NameObjectList[] paramsListUpt,NameObjectList[] paramsListDel,string[] strParams);

		#endregion

	}
}
