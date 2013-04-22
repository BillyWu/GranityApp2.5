using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Web;
using Estar.Common.Tools;
using System.Threading;

namespace Granity.communications
{
    /// <summary>
    /// 日志记录工具类
    /// </summary>
    public static class myLog
    {
        /// <summary>
        /// 是否启动记录日志
        /// </summary>
        private static bool islog = false;

        #region 日志记录属性
        /// <summary>
        /// 日志记录分类：文本文件日志,windows日志
        /// </summary>
        private enum logType
        {
            /// <summary>
            /// 文本日志,默认
            /// </summary>
            File,
            /// <summary>
            /// windows日志
            /// </summary>
            Windows
        }
        /// <summary>
        /// 记录日志使用的方式：文件，windows，数据库
        /// </summary>
        private static logType logtype = logType.File;
        /// <summary>
        /// 记录日志的页数，超过这个数新建立日志保存
        /// </summary>
        private static int maxpage = 20;
        /// <summary>
        /// 每页记录数，每页满时保存一次
        /// </summary>
        private static int pagesize = 500;
        /// <summary>
        /// 当前日志页内序号
        /// </summary>
        private static int index = 0;
        /// <summary>
        /// 当前页码数
        /// </summary>
        private static int pgnum = 0;
        /// <summary>
        /// 当前日志文件路径
        /// </summary>
        private static string logfile = "";
        /// <summary>
        /// 日志记录
        /// </summary>
        private static StringBuilder logbuilder = new StringBuilder();
        /// <summary>
        /// 多线程执行排它锁
        /// </summary>
        private static object objlog = new object();
        /// <summary>
        /// 同步时的锁定实例
        /// </summary>
        private static object objmonitor = new object();

        #endregion

        /// <summary>
        /// 初始化配置
        /// </summary>
        static myLog()
        {
            string log = DataAccRes.AppSettings("mylogtype");
            if (string.IsNullOrEmpty(log))
                return;
            islog = true;
            log = log.ToLower();
            if ("windows" == log)
                logtype = logType.Windows;
            else if ("file" == log)
                logtype = logType.File;
            else
                islog = false;
        }
        /// <summary>
        /// 是否记录日志
        /// </summary>
        public static bool IsLog
        {
            get { return islog; }
        }
        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="msg">日志信息</param>
        public static void Write(string msg)
        {
            if (!islog) return;
            Monitor.Enter(objlog);
            try { logbuilder.Append(msg); }
            catch { logbuilder = new StringBuilder(); }
            Monitor.PulseAll(objlog);
            Monitor.Exit(objlog);
            index++;
            if (index > pagesize)
                try { Flush(); }
                catch { logbuilder = new StringBuilder(); }
        }
        /// <summary>
        /// 写入一行日志
        /// </summary>
        /// <param name="msg"></param>
        public static void WriteLine(string msg)
        {
            if (!islog) return;
            Monitor.Enter(objlog);
            try { logbuilder.AppendLine(msg); }
            catch { logbuilder = new StringBuilder(); }
            Monitor.PulseAll(objlog);
            Monitor.Exit(objlog);
            index++;
            if (index > pagesize)
                try { Flush(); }
                catch { logbuilder = new StringBuilder(); }
        }
        /// <summary>
        /// 清空缓冲区日志，提交入文件或windows日志
        /// </summary>
        public static void Flush()
        {
            Flush(false);
        }

        static bool iswritting = false;
        /// <summary>
        /// 清空缓冲区日志，提交入文件或windows日志
        /// <param name="force">强制清空,开始一个新日志起点</param>
        /// </summary>
        public static void Flush(bool force)
        {
            if (!islog) return;
            if (logbuilder.Length < 1)
                return;
            string path = "";
            string filepath = logfile;
            if (!string.IsNullOrEmpty(filepath))
                path = Path.GetDirectoryName(filepath);
            if (!string.IsNullOrEmpty(path) && Directory.Exists(path))
            {
                //有400个日志文件时清空日志文件夹
                //string[] files = Directory.GetFiles(path);
                //if (files.Length > 400)
                //    foreach (string f in files)
                //        try { File.Delete(f); }
                //        catch { }
            }else if (null != HttpContext.Current)
                path = HttpContext.Current.Server.MapPath("~/");
            else
                path = AppDomain.CurrentDomain.BaseDirectory;
            if (string.IsNullOrEmpty(filepath) || !File.Exists(filepath))
            {
                if (string.IsNullOrEmpty(filepath))
                    filepath = "log\\";
                else
                    filepath = "";
                filepath += Guid.NewGuid().ToString().Replace("-", "") + ".txt";
                logfile = filepath = Path.Combine(path, filepath);
                pgnum = 0;
                if (!Directory.Exists(Path.GetDirectoryName(filepath)))
                    try { Directory.CreateDirectory(Path.GetDirectoryName(filepath)); }
                    catch { }
            }
            FileStream fstream = null;
            if (iswritting)
                return;
            iswritting = true;
            string strlog = "";
            Monitor.Enter(objlog);
            try
            {
                strlog = logbuilder.ToString();
                logbuilder.Remove(0, logbuilder.Length);
            }
            catch
            {
                logbuilder = new StringBuilder();
            }
            Monitor.PulseAll(objlog);
            Monitor.Exit(objlog);
            byte[] bcontext = Encoding.GetEncoding("GB2312").GetBytes(strlog);
            Monitor.Enter(objmonitor);
            try
            {
                if (File.Exists(filepath))
                    fstream = new FileStream(filepath, FileMode.Append);
                else
                    fstream = new FileStream(filepath, FileMode.OpenOrCreate);
                fstream.Write(bcontext, 0, bcontext.Length);
            }
            finally
            {
                if (null != fstream)
                    try { fstream.Close(); }
                    catch { }
            }
            Monitor.PulseAll(objmonitor);
            Monitor.Exit(objmonitor);
            iswritting = false;
            index = 0;
            pgnum++;
            if (pgnum > maxpage || force)
            {
                pgnum = 0;
                logfile = "";
            }
        }
    }
}
