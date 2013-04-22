using System;
using System.Web;
using System.Xml;
using System.Data;
using System.Collections.Specialized;
using System.Collections;
using System.Web.Services;
using System.Web.Services.Protocols;
using Estar.Common.Tools;


namespace Estar.WebApp
{

    /// <summary>
    /// Summary description for WSBits
    /// </summary>
    [WebService(Namespace = "http://Estar.org/Bits")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class WSBits : System.Web.Services.WebService
    {

        public WSBits()
        {

            //Uncomment the following line if using designed components 
            //InitializeComponent(); 
        }

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        /// <summary>
        /// 添加需要传输的文件列表;tabFileList结构,字段:文件,类型
        /// 文件是完整uri地址的文件
        /// </summary>
        /// <param name="tabFileList">文件列表</param>
        /// <returns>是否成功</returns>
        [WebMethod]
        public bool AddFileList(DataTable tabFileList)
        {
            if (null == tabFileList)
                tabFileList = new DataTable();
            for (int i = 0; i < tabFileList.Rows.Count; i++)
            {
                DataRow dr = tabFileList.Rows[i];
                if (null == dr["文件"] || DBNull.Value == dr["文件"] || string.IsNullOrEmpty(dr["文件"].ToString()))
                    continue;
                string strFile = dr["文件"].ToString();
                string strType = (null == dr["类型"]) ? "" : dr["类型"].ToString();
                BitsFileList.AddFile(strFile,strType);
            }
            if (tabFileList.Rows.Count > 0)
                if (!BitsFileList.SaveFile())
                    return false;
            BitsDownFile.TransFile();
            return true;
        }

        /// <summary>
        /// 更新传送文件
        /// </summary>
        /// <returns>是否成功</returns>
        [WebMethod]
        public bool TransFile()
        {
            BitsDownFile.TransFile();
            return true;
        }

    }

}