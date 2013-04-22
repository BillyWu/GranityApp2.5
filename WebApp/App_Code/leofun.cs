using System;
using System.IO;
using System.Text;
using System.Collections.Specialized;
using Estar.Common.Tools;
using System.Data;
using System.Web;
using System.Data.OleDb;

public class leofun
{
	public static void CreateLogFile(string textToAdd) 
	{
		string logFile = DateTime.Now.ToLongDateString()
			.Replace(@"/",@"-").Replace(@"\",@"-") + ".log";
		logFile=System.Web.HttpContext.Current.Server.MapPath("������־\\"+logFile);

		string thistime =
			DateTime.Now.ToLongTimeString()
			.Replace(@"/",@"-").Replace(@"\",@"-") + ":";

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

	/// <summary>
	/// ��÷�����ʾ���ַ��������һ��ֵ����ͳ��ͼ��ǩ��
	/// </summary>
	/// <param name="strGroup"></param>
	/// <returns></returns>
	public static string getLabelname(string strGroup)
	{
		if(strGroup.Trim().Length!=0)
		{
			char[] sep={','};
			string[] strArr = strGroup.Split(sep);
			return strArr[strArr.Length-1];
		}
		else return "";
	}

	/// <summary>
	/// ���ַ��������Ӧ����
	/// </summary>
	/// <param name="strGroup"></param>
	/// <returns></returns>
	public static string[] getArrayFromString(string strGroup,string sep_symble)
	{
        if (strGroup == null) return null;
		if(strGroup.Trim().Length!=0)
		{
			char[] sep=sep_symble.ToCharArray();//{','};
			string[] strArr = strGroup.Split(sep);
			return strArr;
		}
		else return null;
	}



	/// <summary> 
	/// ���ƣ�IsNumberic 
	/// ���ܣ��ж�������Ƿ������� 
	/// ������string oText��Դ�ı� 
	/// ����ֵ����bool true:�ǡ�false:�� 
	/// </summary> 

	public static bool IsNumberic(string oText) 
	{ 
		try 
		{ 
			int var1=Convert.ToInt32 (oText); 
			return true; 
		} 
		catch 
		{ 
			return false; 
		} 
	} 
	//����ַ���oString��ʵ�ʳ��� 
	public static int StringLength(string oString) 
	{ 
		byte[] strArray=System.Text .Encoding.Default .GetBytes (oString); 
		int res=strArray.Length ; 
		return res; 
	} 
	//������keydown�¼��Ŀؼ����ûس�ʱ����Ϊtab 
	public static void Tab(System.Web.UI.WebControls .WebControl webcontrol) 
	{ 
		webcontrol.Attributes .Add ("onkeydown", "if(event.keyCode==13) event.keyCode=9"); 
	} 
	//	///<summary> 
	//	///���ƣ�redirect 
	//	///���ܣ��Ӵ��巵�������� 
	//	///������url 
	//	///����ֵ���� 
	//	///</summary> 
	//	public static void redirect(string url,System.Web.UI.Page page) 
	//	{ 
	//		if ( Session["IfDefault"]!=(object)"Default") 
	//		{ 
	//			page.RegisterStartupScript("","<script>window.top.document.location.href='"+url+"';</script>"); 
	//		} 
	//	} 
	/// <summary> 
	/// ʹ�ؼ���ý��� 
	/// </summary> 
	/// <param name="str_Ctl_Name">��ý���ؼ�Idֵ,���磺txt_Name</param> 
	/// <param name="page">Page��</param> 
	public static void GetFocus(string str_Ctl_Name,System.Web.UI.Page page) 
	{ 
		page.RegisterStartupScript("","<script>document.forms(0)."+str_Ctl_Name+".focus(); document.forms(0)."+str_Ctl_Name+".select();</script>"); 
	} 

	/// <summary> 
	/// �������˵���alert�Ի��� 
	/// </summary> 
	/// <param name="str_Message">��ʾ��Ϣ,���ӣ�"����Ϊ��!"</param> 
	/// <param name="page">Page��</param> 
	public static void Alert(string str_Message,System.Web.UI.Page page) 
	{ 
		page.RegisterStartupScript("","<script>alert('"+str_Message+"');</script>"); 
	} 

	/// <summary> 
	/// �������˵���alert�Ի��򣬲�ʹ�ؼ���ý��� 
	/// </summary> 
	/// <param name="str_Ctl_Name">��ý���ؼ�Idֵ,���磺txt_Name</param> 
	/// <param name="str_Message">��ʾ��Ϣ,���ӣ�"������������!"</param> 
	/// <param name="page">Page��</param> 
	public static void Alert(string str_Ctl_Name,string str_Message,System.Web.UI.Page page) 
	{ 
		page.RegisterStartupScript("","<script>alert('"+str_Message+"');document.forms(0)."+str_Ctl_Name+".focus(); document.forms(0)."+str_Ctl_Name+".select();</script>"); 
	} 

	/// <summary> 
	/// �������˵���confirm�Ի���,ѯ���û�׼��ת����Щ������������ȷ�����͡�ȡ����ʱ�Ĳ��� 
	/// </summary> 
	/// <param name="str_Message">��ʾ��Ϣ�����磺"�ɹ���������,����\"ȷ��\"��ť��д����,����\"ȡ��\"�޸�����"</param> 
	/// <param name="btn_Redirect_Flow">"ȷ��"��ťidֵ</param> 
	/// <param name="btn_Redirect_Self">"ȡ��"��ťidֵ</param> 
	/// <param name="page">Page��</param> 
	public static void Confirm(string str_Message,string btn_Redirect_Flow,string btn_Redirect_Self,System.Web.UI.Page page) 
	{ 
		page.RegisterStartupScript("","<script> if (confirm('"+str_Message+"')==true){document.forms(0)."+btn_Redirect_Flow+".click();}else{document.forms(0)."+btn_Redirect_Self+".click();}</script>"); 
	} 

	/// <summary>
	/// ������λ���ַ���תΪ����
	/// </summary>
	public static  int toInt(string str)
	{
		int val=0;
		if(str==null){return 0;}
		if(str==""){return 0;};
		str = str.Replace("px","");
		str = str.Replace("%","");
		val=int.Parse(str.Replace("px",""));
		return val;

	}

	public static  int toIntval(string str)
	{
        //if (!IsNumberic(str)) return 0;
        if (str.Trim() == "" || str.Trim() == "null") return 0;
        int x = 0;
        try
        {
            x = Convert.ToInt32(str);
        }
        catch (Exception ex)
        {
            try
            {
                x = Convert.ToInt32(Convert.ToDouble(str));
            }
            catch (Exception exx)
            {
                x = 0;
            }
        }
        return x;
	}

    public static long toIntval64(string str)
    {
        //if (!IsNumberic(str)) return 0;
        if (str.Trim() == "" || str.Trim() == "null") return 0;
        long x = 0;
        try
        {
            x = Convert.ToInt64(str);
        }
        catch (Exception ex)
        {
            try
            {
                x = Convert.ToInt64(Convert.ToDouble(str));
            }
            catch (Exception exx)
            {
                x = 0;
            }
        }
        return x;
    }

    public static Double toFloatValue(string str)
    {
        //if (!IsNumberic(str)) return 0;
        if (str.Trim() == "" || str.Trim() == "null") return 0;
        Double x = 0;
        try
        {
            x = Convert.ToDouble(str);
        }
        catch (Exception ex)
        {
                x = 0;
        }
        return x;
    }

	/// <summary>
	/// ����תΪ������λ���ַ���
	/// </summary>
	public static string toUnit(int val){return  val.ToString()+ "px";}

	/// <summary>
	/// ���ֶ���Ϣ��ҳ��
	/// </summary>
	/// <param name="str"></param>
	public static void sendPage_str(string str)
	{
		System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
		System.Web.HttpContext.Current.Response.Write("	function ueSPage(){					");
		System.Web.HttpContext.Current.Response.Write("	return '"+ str+"';}			        ");
		System.Web.HttpContext.Current.Response.Write("	</script>							");
	}

	public static void sendPage_str1(string str)
	{
		System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
		System.Web.HttpContext.Current.Response.Write("	function ueSPage1(){					");
		System.Web.HttpContext.Current.Response.Write("	return '"+ str+"';}			        ");
		System.Web.HttpContext.Current.Response.Write("	</script>							");
	}

	public static void sendPage_str2(string str)
	{
		System.Web.HttpContext.Current.Response.Write("	<script language=\"javascript\">	");
		System.Web.HttpContext.Current.Response.Write("	function ueSPage2(){					");
		System.Web.HttpContext.Current.Response.Write("	return '"+ str+"';}			        ");
		System.Web.HttpContext.Current.Response.Write("	</script>							");
	}


	public static string RepType(string str)
	{
		str = str.Replace("string"		,	"String"); 
		str = str.Replace("char"		,	"String"); 
		str = str.Replace("datetime"	,	"DateTime"); 
		str = str.Replace("date"		,	"DateTime"); 
		str = str.Replace("int32"		,	"Int32");
		str = str.Replace("int"			,	"Int32");
		str = str.Replace("double"		,	"Double"); 
		str = str.Replace("float"		,	"Double"); 
		str = str.Replace("boolean"		,	"Boolean"); 
		str = str.Replace("bool"		,	"Boolean"); 
		return str;
	}

	public static string RepAS(string str)
	{
		str = str.Replace(" as "	,	"^"); 
		str = str.Replace(" As "	,	"^"); 
		str = str.Replace(" AS "	,	"^"); 
		return str;
	}


	public static string covMonth(string strmm)
	{
		switch(strmm)
		{
			case "1��": strmm="һ��";
				break;
			case "2��": strmm="����";
				break;
			case "3��": strmm="����";
				break;
			case "4��": strmm="����";
				break;
			case "5��": strmm="����";
				break;
			case "6��": strmm="����";
				break;
			case "7��": strmm="����";
				break;
			case "8��": strmm="����";
				break;
			case "9��": strmm="����";
				break;
			case "10��": strmm="ʮ��";
				break;
			case "11��": strmm="ʮһ��";
				break;
			case "12��": strmm="ʮ����";
				break;
		}
		return strmm;
	}

    //ȡtree�γɵ�XML���Զ�������:����ַ�����ʽ:@key=value,@key=value,@key=value
    //��svalueֵ���ж��ŵ�ִ��ת��Ϊ˫����,�ڽ���ʱ�ٶ�˫����ת��Ϊ:*#$#*
    public static string valtag(string stag, string varname)
	{
        if (stag == null) return "";
        stag = stag.Replace(",,", "*#$#*");
		string[] arrTag = leofun.getArrayFromString(stag,",");
        if(null!=arrTag)
            for (int i = 0; i < arrTag.Length; i++)
                if(arrTag[i].StartsWith("@"+varname+"="))
                {
                    string strFind=arrTag[i].Remove(0,varname.Length+2);
                    strFind=strFind.Replace("*#$#*", ",").Trim();
                    return strFind;
                }
		return "";
	}

    /// <summary>
    /// �Ա���γ��ַ�������string={{"key","value"},{"key","value"}}
    /// </summary>
    /// <param name="stag"></param>
    /// <returns></returns>
    public static NameObjectList NameValueTag(string stag)
    {
        NameObjectList tag = new NameObjectList();
        stag = stag.Replace(",,", "*#$#*");
        string[] arrTag = leofun.getArrayFromString(stag, ",");
        if(null==arrTag || arrTag.Length<1)
            return  tag;
        for (int i = 0; i < arrTag.Length; i++)
            if (arrTag[i].StartsWith("@") && arrTag[i].Contains("="))
            {
                string strkey = arrTag[i].Substring(1, arrTag[i].IndexOf("=")-1);
                string strvalue = arrTag[i].Substring(arrTag[i].IndexOf("=")+1);
                strvalue = strvalue.Replace("*#$#*", ",").Trim();
                tag[strkey] = strvalue;
            }
        return tag;
    }

    //����tree�γɵ�XML���Զ���tag����
    public static string setvaltag(string stagvalue, string skey, string svalue)
    {
        if (null == skey || "" == skey)
            return stagvalue;
        stagvalue = stagvalue.Replace(",,", "*#$#*");
        svalue = svalue.Replace(",", ",,");
        string[] arrTag = stagvalue.Split(",".ToCharArray());
        string strTag = "";
        bool bfind = false;
        if(null!=arrTag)
            for (int i = 0; i < arrTag.Length; i++)
            {
                if ("" == arrTag[i]) continue;
                if (false == bfind && arrTag[i].StartsWith("@" + skey + "="))
                {
                    bfind = true;
                    if (null != svalue && "" != svalue)
                    {
                        if (i > 0) strTag += ",@" + skey + "=" + svalue;
                        else strTag += "@" + skey + "=" + svalue;
                    }
                }
                else
                {
                    if (i > 0) strTag += "," + arrTag[i];
                    else strTag += arrTag[i];
                }
            }//for(int i=0;i<arrTag.length;i++)
        if (false == bfind && null != svalue && "" != svalue)
        {
            if ("" == strTag)
                strTag += "@" + skey + "=" + svalue;
            else
                strTag += ",@" + skey + "=" + svalue;
        }
        strTag = strTag.Replace("*#$#*", ",,");
        return strTag;
    }

    /// <summary>
    /// C#ʵ��javascript��escape ,��javascript��unescape��Ӧ
    /// ����ַ��������ڷ������ͻ���ת������
    /// </summary>
    /// <param name="s">��ҪASCII������ַ���</param>
    /// <returns>������ַ���</returns>
    public static string Escape(string s)
    {
        StringBuilder sb = new StringBuilder();
        byte[] ba = System.Text.Encoding.Unicode.GetBytes(s);
        for (int i = 0; i < ba.Length; i += 2)
        {    /**///// BE SURE 2's 
            sb.Append("%u");
            sb.Append(ba[i + 1].ToString("X2"));
            sb.Append(ba[i].ToString("X2"));
        }
        return sb.ToString();
    }

	public static string false2null(string blval)
	{
		if(blval.ToLower()=="false")
			return "";
		else return blval;
	}

    //�ж�IP��ַ�ĺϷ���
    public static Boolean IsCorrenctIP(string ip)
    {
        string pattrn = @"(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])";
        if (System.Text.RegularExpressions.Regex.IsMatch(ip, pattrn))
        {
            return true;
        }
        else
        {
            return false;

        }
    }
    public static string Empty2Null(string s)
    {
        if (s == "") s = "null";
            return s;
    }

    /// <summary>
    /// ��excel ��ȡ����
    /// </summary>
    /// <param name="filenameurl"></param>
    /// <param name="table"></param>
    /// <param name="IsXls">excel �汾</param>
    /// <returns></returns>
    public static DataSet ExecleDs(string filenameurl, string table, string IsXls)
    {
        try
        {
            string strConn = string.Empty;
            switch (IsXls)
            {
                case ".xls":
                    strConn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filenameurl + ";Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'";
                    break;
                case ".xlsx":
                    strConn = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filenameurl + ";Extended Properties='Excel 12.0;HDR=Yes;IMEX=1;'";
                    break;
                default:
                    strConn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filenameurl + ";Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'";
                    break;
            }
            //����Excel
            OleDbConnection conn = new OleDbConnection(strConn);
            conn.Open();
            DataTable m_tableName = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            if (m_tableName != null && m_tableName.Rows.Count > 0)
            {
                m_tableName.TableName = m_tableName.Rows[0][2].ToString();
            }
            OleDbDataAdapter oleAdMaster = new OleDbDataAdapter("select *  FROM [" + m_tableName.TableName + "]", conn);
            DataSet ds = new DataSet();
            oleAdMaster.Fill(ds, m_tableName.TableName);
            conn.Close();
            return ds;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static DataTable LoadFile(System.Web.UI.WebControls.FileUpload fileUpLoad)
    {
        string path = DataAccRes.AppSettings("DefaultFilePath");
        if (string.IsNullOrEmpty(path))
            path = "~/DataSource/upload/";
        if (!path.StartsWith("~/"))
        {
            if (path.StartsWith("/"))
                path = "~" + path;
            else
                path = "~/" + path;
        }
        string IsXls = System.IO.Path.GetExtension(fileUpLoad.FileName).ToString().ToLower();
        string fileName = fileUpLoad.FileName; 
        string serverPath = fileUpLoad.Page.Server.MapPath(path + fileName);
        fileUpLoad.SaveAs(serverPath);
        DataSet ds = ExecleDs(serverPath, fileName, IsXls);
        return ds.Tables[0];
    }

    /// <summary>
    /// �����ļ����DataTable
    /// </summary>
    /// <param name="file">�ϴ��ļ�</param>
    /// <returns></returns>
    public static DataTable LoadFileTab(HttpPostedFile file)
    {
        if (null == file || null==HttpContext.Current || file.ContentLength < 1 || string.IsNullOrEmpty(file.FileName))
            return null;
        string path = DataAccRes.AppSettings("DefaultFilePath");
        if (string.IsNullOrEmpty(path))
            path = "~/DataSource/upload/";
        if (!path.StartsWith("~/"))
        {
            if (path.StartsWith("/"))
                path = "~" + path;
            else
                path = "~/" + path;
        }
        //�����ļ�����ʱ�ļ���
        string pix = Path.GetExtension(file.FileName).ToLower();
        path = HttpContext.Current.Server.MapPath(path);
        path = Path.Combine(path, Guid.NewGuid().ToString() + pix);
        try
        {
            if (File.Exists(path))
                File.Delete(path);
            FileStream fs = new FileStream(path, FileMode.OpenOrCreate);
            BinaryReader br = new BinaryReader(file.InputStream);
            int size = 1024;
            int len = file.ContentLength;
            if (size > len) size = len;
            while (len > 0)
            {
                byte[] data = br.ReadBytes(size);
                fs.Write(data, 0, data.Length);
                len -= size;
                if (size > len)
                    size = len;
            }
            fs.Close();
        }
        catch
        {
            return null;
        }
        string cnn = "";
        switch (pix)
        {
            case ".xlsx":
                cnn = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + path + ";Extended Properties='Excel 12.0;HDR=Yes;IMEX=1;'";
                break;
            default:
                cnn = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + path + ";Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'";
                break;
        }
        //��ȡExcel
        DataTable tabfile = new DataTable();
        OleDbConnection conn = new OleDbConnection(cnn);
        try
        {
            conn.Open();
            DataTable tab = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            string tabname = "";
            if (null != tab && tab.Rows.Count > 0 && tab.Columns.Contains("table_name"))
                tabname = Convert.ToString(tab.Rows[0]["table_name"]);
            if (!string.IsNullOrEmpty(tabname))
            {
                OleDbDataAdapter oleAdMaster = new OleDbDataAdapter("select *  FROM [" + tabname + "]", conn);
                oleAdMaster.Fill(tabfile);
            }
        }
        catch { return tabfile; }
        finally
        {
            conn.Close();
            File.Delete(path);
        }
        return tabfile;
    }
}