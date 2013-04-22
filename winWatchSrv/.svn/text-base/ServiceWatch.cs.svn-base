using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.ServiceProcess;
using System.Text;
using System.Collections.Specialized;
using System.Threading;
using System.Timers;

namespace winWatchSrv
{
    public partial class ServiceWatch : ServiceBase
    {
        /// <summary>
        /// 内置定时器，控制内部定时执行。默认两分钟。
        /// </summary>
        private System.Timers.Timer timer = new System.Timers.Timer(2 * 60 * 1000);
        /// <summary>
        /// 定时器事件是否正在执行
        /// </summary>
        private bool isTmRunning = false;

        public ServiceWatch()
        {
            InitializeComponent();
            timer.Elapsed += new ElapsedEventHandler(timer_Elapsed);
        }

        protected override void OnStart(string[] args)
        {
            timer.Start();
            LogMessage("启动服务守护", null, EventLogEntryType.Information);
        }

        protected override void OnStop()
        {
            timer.Stop();
            LogMessage("关闭服务守护", null, EventLogEntryType.Information);
        }
        /// <summary>
        /// 执行自定义重置命令
        /// </summary>
        /// <param name="command"></param>
        protected override void OnCustomCommand(int command)
        {
            if (200 != command || isTmRunning)
                return;
            isTmRunning = true;
            ServiceController ctrl = new ServiceController("Granity文件服务");
            try
            {
                LogMessage("守护Granity文件服务", null, EventLogEntryType.Information);
                try { ctrl.Stop(); }
                catch { }
                Thread.Sleep(new TimeSpan(0, 1, 0));
                ctrl.Start();
                Thread.Sleep(new TimeSpan(0, 1, 0));
            }
            catch { }
            ctrl.Close();
            isTmRunning = false;
        }

        /// <summary>
        /// 定时触发
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (isTmRunning) return;
            isTmRunning = true;

            ServiceController ctrl = new ServiceController("Granity文件服务");
            if (ServiceControllerStatus.Running != ctrl.Status && ServiceControllerStatus.StartPending != ctrl.Status)
            {
                try
                {
                    try { ctrl.Stop(); }
                    catch { }
                    Thread.Sleep(new TimeSpan(0, 1, 0));
                    ctrl.Start();
                    Thread.Sleep(new TimeSpan(0, 1, 0));
                }
                catch { }
            }
            ctrl.Close();
            isTmRunning = false;
        }
        /// <summary>
        /// 日志记录消息
        /// </summary>
        /// <param name="msg">日志信息</param>
        /// <param name="data">附加数据</param>
        /// <param name="logtype">日志类型</param>
        public static void LogMessage(string msg, NameValueCollection data, EventLogEntryType logtype)
        {
            if (string.IsNullOrEmpty(msg))
                return;

            string logname = "GranityWatch";

            string head = "";
            EventLog log = new EventLog();
            if (null != data)
                foreach (string key in data)
                    head += key + "：" + data[key] + "\r\n";
            msg = head + "\n" + msg;

            if (msg.Length > 30000)
                msg = msg.Substring(0, 30000);
            log.Log = logname;
            log.Source = logname;
            log.MachineName = Environment.MachineName;
            log.WriteEntry(msg, logtype);
        }
    }
}
