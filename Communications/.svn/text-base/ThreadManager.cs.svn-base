#region 版本说明

/*
 * 功能内容：   线程池管理,利用缓存机制和重利用方式,提高线程使用效率降低系统线程开销
 *
 * 作    者：   王荣策
 *
 * 审 查 者：   王荣策
 *
 * 日    期：   2010-05-23
 */

#endregion

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Diagnostics;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using System.Collections.Specialized;

namespace Granity.communications
{
    /// <summary>
    /// 线程池管理,负责线程调度优化
    /// </summary>
    public static class ThreadManager
    {

        private static List<myThread> mythreads = new List<myThread>();

        private static int minWorkerThreads = 200;
        private static int maxWorkerThreads = 500;
        /// <summary>
        /// 读取或设置最大空闲线程数
        /// </summary>
        public static int MaxWorkerThreads
        {
            get { return ThreadManager.maxWorkerThreads; }
            set { ThreadManager.maxWorkerThreads = value; }
        }
        /// <summary>
        /// 读取或设置最小空闲线程数
        /// </summary>
        public static int MinWorkerThreads
        {
            get { return ThreadManager.minWorkerThreads; }
            set { ThreadManager.minWorkerThreads = value; }
        }
        private static bool isResetNeed = false;
        /// <summary>
        /// 读取线程数是否超极限，需要重新启动
        /// </summary>
        public static bool IsResetNeed
        {
            get { return isResetNeed || mythreads.Count > 4000; }
        }

        /// <summary>
        /// 开启或唤醒一个线程去执行指定的回调方法
        /// </summary>
        /// <param name="cb">回调函数</param>
        /// <param name="arg">回调函数参数对象</param>
        public static void QueueUserWorkItem(WaitCallback cb, Object arg)
        {
            //剔除无效线程,保持一定个数的空闲线程
            Monitor.Enter(mythreads);
            for (int i = mythreads.Count, len = minWorkerThreads; i < len; i++)
                mythreads.Add(new myThread());
            int sum = 0;
            for (int i = mythreads.Count - 1; i > -1; i--)
            {
                myThread td = mythreads[i];
                if (td.IsEnd)
                {
                    mythreads.RemoveAt(i);
                    td.Close();
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 关闭线程");
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 关闭线程");
                    continue;
                }
                if (td.IsWait)
                    sum++;
                if (sum <= maxWorkerThreads)
                    continue;
                if (!td.IsEffect())
                {
                    mythreads.RemoveAt(i);
                    td.Close();
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 关闭线程");
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 关闭线程");
                }
            }
            myThread[] thds = mythreads.ToArray();
            Monitor.PulseAll(mythreads);
            Monitor.Exit(mythreads);
            //从池内找出空闲线程执行
            foreach (myThread thd in thds)
            {
                if (!thd.IsWait)
                    continue;
                thd.Start(cb, arg);
                return;
            }
            string strsum = Convert.ToString(thds.Length + 1);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 新线程: " + strsum);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 新线程: " + strsum);
            Monitor.Enter(mythreads);
            myThread t = new myThread();
            mythreads.Add(t);
            Monitor.PulseAll(mythreads);
            Monitor.Exit(mythreads);
            try
            {
                t.Start(cb, arg);
            }
            catch (Exception ex)
            {
                if (ex is OutOfMemoryException)
                    isResetNeed = true;
                NameValueCollection attr = new NameValueCollection();
                attr["进程数"] = strsum;
                ExceptionManager.Publish(ex, attr);
                throw ex;
            }
        }

        /// <summary>
        /// 关闭清除所有线程,并释放相关资源
        /// </summary>
        public static void AbortAll()
        {
            Monitor.Enter(mythreads);
            myThread[] thds = mythreads.ToArray();
            for (int i = 0; i < thds.Length; i++)
                thds[i].Close();
            mythreads.Clear();
            isResetNeed = false;
            Monitor.PulseAll(mythreads);
            Monitor.Exit(mythreads);
        }
    }
}
