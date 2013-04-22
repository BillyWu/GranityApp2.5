using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.ServiceProcess;
using System.Text;
using Granity.communications;
using System.Collections.Specialized;
using System.Configuration;
using Granity.commiServer;
using System.Timers;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using System.IO.Ports;
using System.Threading;

namespace winFileSrv
{
    partial class ServiceFile : ServiceBase
    {
        /// <summary>
        /// 内置定时器，控制内部定时执行。默认两分钟。
        /// </summary>
        private System.Timers.Timer timer = new System.Timers.Timer(2 * 60 * 1000);
        /// <summary>
        /// 定时器事件是否正在执行
        /// </summary>
        private bool isTmRunning = false;

        private int port = 2010;
        /// <summary>
        /// 服务端口号,默认2010
        /// </summary>
        public int Port
        {
            get { return port; }
            set { port = value; }
        }
        /// <summary>
        /// 服务器刷新时间
        /// </summary>
        private DateTime dtservice = DateTime.Now;

        private SvrFileTrans srvTrans;
        /// <summary>
        /// 传输服务
        /// </summary>
        public SvrFileTrans SrvTrans
        {
            get { return srvTrans; }
        }
        private SynDeviceParam synDevice = new SynDeviceParam();
        /// <summary>
        /// 更新设备控制参数服务,定时器控制执行后台服务
        /// </summary>
        public SynDeviceParam SynDevice
        {
            get { return synDevice; }
        }
        private DeviceMonitorMgr monimgr = new DeviceMonitorMgr();
        /// <summary>
        /// 设备巡检监控管理器
        /// </summary>
        public DeviceMonitorMgr MoniMgr
        {
            get { return monimgr; }
        }
        private ChannelWorkerMgr channelmgr = new ChannelWorkerMgr();
        /// <summary>
        /// 通道动态员工管理器
        /// </summary>
        public ChannelWorkerMgr ChannelMgr
        {
            get { return channelmgr; }
        }
        public ServiceFile()
        {
            InitializeComponent();
            timer.Elapsed += new ElapsedEventHandler(timer_Elapsed);
            monimgr.RecordHandle += new EventHandler<DvRecordEventArgs>(monimgr_RecordHandle);
        }

        /// <summary>
        /// 设备采集新记录时触发
        /// </summary>
        /// <param name="sender">设备</param>
        /// <param name="e">数据参数</param>
        void monimgr_RecordHandle(object sender, DvRecordEventArgs e)
        {
            if (null == sender || null == e || string.IsNullOrEmpty(e.TagInfo))
                return;
            string state = basefun.valtag(e.TagInfo, "状态");
            if ("正常开门" != state)
                return;
            channelmgr.setPassChannel(e.TagInfo);
        }
        /// <summary>
        /// 重启服务
        /// </summary>
        void resetService()
        {
            CommiServer.GlobalServer.Stop();
            this.srvTrans.Close();
            CommiManager.GlobalManager.ClearCommand();
            ThreadManager.AbortAll();
            CommiManager.GlobalManager.ResetClient();
            DeviceEatery.ResetQueue();
            DeviceDoor.ResetQueue();
            DeviceChannel.ResetQueue();
            channelmgr.ResetRecord();
            monimgr.Resetdev();

            Monitor.Enter(argsExtendList);
            argsExtendList.Clear();
            Monitor.PulseAll(argsExtendList);
            Monitor.Exit(argsExtendList);
            isRunExtend = false;
            isResetService = false;

            ServiceController ctrl = new ServiceController("Granity服务守护");
            LogMessage("自动重启Granity文件服务", null, EventLogEntryType.Information);
            ctrl.ExecuteCommand(200);
            return;

            CommiServer commisrv = CommiServer.GlobalServer;
            commisrv.Stop();
            this.srvTrans.Close();
            if (ThreadManager.IsResetNeed || isResetService)
            {
                CommiManager.GlobalManager.ClearCommand();
                ThreadManager.AbortAll();
                CommiManager.GlobalManager.ResetClient();
                DeviceEatery.ResetQueue();
                DeviceDoor.ResetQueue();
                DeviceChannel.ResetQueue();
                channelmgr.ResetRecord();
                monimgr.Resetdev();

                Monitor.Enter(argsExtendList);
                argsExtendList.Clear();
                Monitor.PulseAll(argsExtendList);
                Monitor.Exit(argsExtendList);
                isRunExtend = false;
                isResetService = false;
            }
            Thread.Sleep(new TimeSpan(0, 1, 0));

            SvrFileTrans svrfile = new SvrFileTrans();
            svrfile.ExtendHandle += new EventHandler<ExtendEventArgs>(svrfile_ExtendHandle);
            commisrv.Start(this.port, svrfile);
            this.srvTrans = svrfile;
            NameValueCollection data = new NameValueCollection();
            data["服务"] = this.ServiceName;
            data["端口"] = this.port.ToString();
            LogMessage("自动重启Granity文件服务", data, EventLogEntryType.Information);
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
            
            DateTime dt = DateTime.Now;
            DateTime dtR = DateTime.Today.AddHours(3);
            string tmwork = ConfigurationManager.AppSettings["TimeWork"];
            DateTime.TryParse(DateTime.Today.ToString("yyyy-MM-dd") + " " + tmwork, out dtR);
            bool isexecute = false;
            if (!string.IsNullOrEmpty(tmwork) && dt > dtR && dt < dtR.AddMinutes(2.1))
                isexecute = true;

            if (null != this.srvTrans && !this.srvTrans.IsEmpty)
                dtservice = DateTime.Now;
            //10分钟内没有与服务的通讯，或线程超极限
            if (!isResetService) isResetService = monimgr.IsResetNeed();
            if (isResetService || ThreadManager.IsResetNeed || dtservice < dt.AddMinutes(-10))
                resetService();
            else
                try
                {
                    this.srvTrans.CheckClient();
                    string msg = "定时检查服务连接：";
                    msg += this.srvTrans.IsEmpty ? "无连接" : "有连接";
                    msg += "\n设备数量：" + monimgr.CountDevice.ToString();
                    LogMessage(msg, null, EventLogEntryType.Information);
                }
                catch { }

            if (!isexecute)
            {
                isTmRunning = false;
                return;
            }
            try
            {
                LogMessage("定时执行", null, EventLogEntryType.Information);
                tmEateryGather(null);
                tmWorkGather(null);
                isTmRunning = false;
            }
            catch (Exception ex)
            {
                isTmRunning = false;
                NameValueCollection data = new NameValueCollection();
                data["服务"] = "定时服务";
                LogMessage(ex, data, EventLogEntryType.Error);
            }
            myLog.Flush();
        }
        /// <summary>
        /// 服务启动
        /// </summary>
        /// <param name="args"></param>
        protected override void OnStart(string[] args)
        {
            string port = ConfigurationManager.AppSettings[this.ServiceName];
            if(!string.IsNullOrEmpty(port))
                try { this.port = Convert.ToInt32(port); }
                catch { }
            SvrFileTrans svrfile = new SvrFileTrans();
            svrfile.ExtendHandle += new EventHandler<ExtendEventArgs>(svrfile_ExtendHandle);
            CommiServer commisrv = CommiServer.GlobalServer;
            commisrv.ErrorHandle += new EventHandler<ErrorRequestEventArgs>(commisrv_ErrorHandle);

            commisrv.Start(this.port, svrfile);
            this.srvTrans = svrfile;
            this.timer.Start();
            NameValueCollection data = new NameValueCollection();
            data["服务"] = this.ServiceName;
            data["端口"] = this.port.ToString();
            LogMessage("启动Granity文件服务", data, EventLogEntryType.Information);
        }

        /// <summary>
        /// 传输服务接收扩展服务事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void svrfile_ExtendHandle(object sender, ExtendEventArgs e)
        {
            if (null == sender || null == e || null == e.Request || e.Request.Length < 1)
                return;
            Monitor.Enter(argsExtendList);
            argsExtendList.Add(e);
            Monitor.PulseAll(argsExtendList);
            Monitor.Exit(argsExtendList);
            hdlWh.Set();
            if (!isRunExtend)
                ThreadManager.QueueUserWorkItem(ExtendHandle, null);
        }
        List<ExtendEventArgs> argsExtendList = new List<ExtendEventArgs>();
        /// <summary>
        /// 是否正在执行扩展
        /// </summary>
        bool isRunExtend = false;
        bool isResetService = false;
        private static ManualResetEvent hdlWh = new ManualResetEvent(false);
        /// <summary>
        /// 执行扩展服务功能
        /// </summary>
        /// <param name="obj"></param>
        private void ExtendHandle(object obj)
        {
            isRunExtend = true;
            while (true)
            {
                Monitor.Enter(argsExtendList);
                ExtendEventArgs[] args = argsExtendList.ToArray();
                argsExtendList.Clear();
                if (args.Length < 1)
                    isRunExtend = false;
                Monitor.PulseAll(argsExtendList);
                Monitor.Exit(argsExtendList);
                if (args.Length < 1)
                    break;
                foreach (ExtendEventArgs e in args)
                {
                    byte[] header = null;
                    try
                    {
                        header = SvrFileTrans.GetFileheader(e.Request);
                    }
                    catch { header = new byte[0]; }
                    NameValueCollection info = SvrFileTrans.ParseInfo(header);
                    string cmdext = info["service"];
                    if (string.IsNullOrEmpty(cmdext))
                        continue;
                    string op = "";
                    try
                    {
                        switch (cmdext)
                        {
                            case "updateparam":
                                op = "更新设备控制参数";
                                this.synDevice.CommiDevice();
                                break;
                            case "monitor":
                                // 指令内容：service='monitor',device,id,patrol='true'
                                if (null == e.Client) break;
                                op = "巡检设备";
                                monimgr.Monitordev(info, e.Client);
                                break;
                            case "halt":
                                // 指令内容：service='halt',device,id,all='true'
                                if (null == e.Client) break;
                                op = "停止巡检";
                                monimgr.Haltdev(info, e.Client);
                                break;
                            case "readinfo":
                                // 指令内容：service='readinfo',device,id
                                if (null == e.Client) break;
                                op = "读取设备信息";
                                monimgr.ReadInfodev(info, e.Client);
                                break;
                            case "readwkchannel":
                                // 指令内容：service='readchannel',id,dt='yyyy-MM-dd HH:mm:ss', dept='deptid'
                                if (null == e.Client) break;
                                op = "读取通道动态员工";
                                channelmgr.ReadWorker(info, e.Client);
                                break;
                            case "readwkregion":
                                // 指令内容：service='readwkregion',id,dt='yyyy-MM-dd HH:mm:ss', region='regionid'
                                if (null == e.Client) break;
                                op = "读取工作区动态员工";
                                channelmgr.ReadWkRegion(info, e.Client);
                                break;
                            case "readregionsum":
                                // 指令内容：service='readregionsum',id, region='regionid'
                                if (null == e.Client) break;
                                op = "读取工作区员工数";
                                channelmgr.ReadRegionSum(info, e.Client);
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        if (ex is OutOfMemoryException)
                            isResetService = true;
                        if (ex.Message.Contains("系统缓冲区空间不足") || ex.Message.Contains("队列已满"))
                            isResetService = true;
                        NameValueCollection data = new NameValueCollection();
                        data["操作"] = op;
                        LogMessage(ex, data, EventLogEntryType.Error);
                    }
                }//foreach (ExtendEventArgs e in args)
                for (int i = 0; i < 1000; i++)
                {
                    if (argsExtendList.Count > 0)
                        break;
                    hdlWh.Reset();
                    hdlWh.WaitOne(10);
                }
            }//while (true)
        }
        /// <summary>
        /// 服务停止
        /// </summary>
        protected override void OnStop()
        {
            this.timer.Stop();
            CommiServer.GlobalServer.Stop();
            CommiManager.GlobalManager.ClearCommand();
            ThreadManager.AbortAll();
            NameValueCollection data = new NameValueCollection();
            data["服务"] = this.ServiceName;
            data["端口"] = this.port.ToString();
            LogMessage("停止Granity文件服务", data, EventLogEntryType.Information);
        }
        /// <summary>
        /// 定时执行消费机业务
        /// </summary>
        /// <param name="obj"></param>
        void tmEateryGather(object obj)
        {
            QueryDataRes query = new QueryDataRes("消费机管理");
            NameObjectList ps = new NameObjectList();
            DataTable tab = query.getTable("消费机管理", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 启动定时执行");
            CommiManager commimgr = CommiManager.GlobalManager;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                if (null == dr || DBNull.Value == dr["ID"] || DBNull.Value == dr["站址"])
                    continue;
                string devid = Convert.ToString(dr["ID"]);
                int station = Convert.ToInt32(dr["站址"]);
                string devname = devname = Convert.ToString(dr["名称"]);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 消费设备：" + Convert.ToString(dr["站址"]) + " " + devname);
                CommiTarget target = this.getTarget(dr);
                if (null == target) continue;
                DeviceEatery device = new DeviceEatery();
                target.setProtocol(Protocol.PTLEatery);
                device.IsPatrol = false;
                device.dtBeat = DateTime.Now;
                device.SetDevice(commimgr, target, devid, station);
                string msg = device.GatherData(true);
                string cardnum = basefun.valtag(msg, "{卡号}");
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 采集信息   0：" + msg);
                if ("0" == cardnum || "16777215" == cardnum)
                {
                    if (device.IsEndReadDevice(-1))
                        continue;
                }
                int index = 1;
                while (!string.IsNullOrEmpty(cardnum))
                {
                    msg = device.GatherData(false);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 采集信息" + Convert.ToString(index++).PadLeft(4, ' ') + "：" + msg);
                    cardnum = basefun.valtag(msg, "{卡号}");
                    if ("0" != cardnum && "16777215" != cardnum)
                    {
                        if (device.IsEndReadDevice(-1))
                            break;
                    }
                }
            }
        }
        /// <summary>
        /// 定时执行考勤机业务
        /// </summary>
        /// <param name="obj"></param>
        void tmWorkGather(object obj)
        {
            QueryDataRes query = new QueryDataRes("门禁管理");
            NameObjectList ps = new NameObjectList();
            DataTable tab = query.getTable("门禁管理", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 启动定时执行");
            CommiManager commimgr = CommiManager.GlobalManager;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                if (null == dr || DBNull.Value == dr["ID"] || DBNull.Value == dr["站址"])
                    continue;
                if ("考勤机" != Convert.ToString(dr["控制器类型"]))
                    continue;
                string devid = Convert.ToString(dr["ID"]);
                int station = Convert.ToInt32(dr["站址"]);
                string devname = devname = Convert.ToString(dr["名称"]);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 考勤设备：" + Convert.ToString(dr["站址"]) + " " + devname);
                CommiTarget target = this.getTarget(dr);
                if (null == target) continue;
                DeviceDoor device = new DeviceDoor();
                target.setProtocol(Protocol.PTLDoor);
                device.IsPatrol = false;
                device.dtBeat = DateTime.Now;
                device.SetDevice(commimgr, target, devid, station);
                string msg = device.GatherData(true);
                string cardnum = basefun.valtag(msg, "{卡号}");
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 采集信息   0：" + msg);
                if ("0" == cardnum || "16777215" == cardnum)
                {
                    if (device.IsEndReadDevice(-1))
                        continue;
                }
                int index = 1;
                while (!string.IsNullOrEmpty(cardnum))
                {
                    msg = device.GatherData(false);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 采集信息" + Convert.ToString(index++).PadLeft(4, ' ') + "：" + msg);
                    cardnum = basefun.valtag(msg, "{卡号}");
                    if ("0" == cardnum || "16777215" == cardnum)
                    {
                        if (device.IsEndReadDevice(-1))
                            break;
                    }
                }
            }
        }
        /// <summary>
        /// 执行考勤
        /// </summary>
        /// <param name="obj"></param>
        void workCheck(object obj)
        {
            DateTime dt = DateTime.Today.AddDays(-1);
            NameObjectList ps = new NameObjectList();
            ps.Add("开始日期", dt);
            ps.Add("结束日期", dt);
            QueryDataRes query = new QueryDataRes("基础类");
            DataTable tab = query.getTable("考勤人员列表", null);
            if (null == tab || tab.Rows.Count < 1)
            {
                isTmRunning = false;
                return;
            }
            NameValueCollection data = new NameValueCollection();
            data["服务"] = "考勤作业";
            DataColumnCollection cols = tab.Columns;
            foreach (DataRow dr in tab.Rows)
            {
                foreach (DataColumn c in cols)
                    ps[c.ColumnName] = Convert.ToString(dr[c]);
                try
                {
                    bool b = query.ExecuteNonQuery("考勤人员列表", ps, ps, ps);
                    if (b) continue;
                }
                catch (Exception ex)
                {
                    foreach (string key in ps.AllKeys)
                        data.Add(key, Convert.ToString(ps[key]));
                    LogMessage(ex, data, EventLogEntryType.Error);
                    continue;
                }
                foreach (string key in ps.AllKeys)
                    data.Add(key, Convert.ToString(ps[key]));
                LogMessage("考勤作业失败！", data, EventLogEntryType.Warning);
            }
            isTmRunning = false;
        }

        #region 响应事件

        /// <summary>
        /// 服务端解析异常事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void commisrv_ErrorHandle(object sender, ErrorRequestEventArgs e)
        {
            if (null == e)
                return;
            NameValueCollection data = new NameValueCollection();
            try
            {
                data["类型"] = "服务端异常";
                if (null != e.Client && null != e.Client.RemoteEndPoint)
                    data["客户端"] = e.Client.RemoteEndPoint.ToString();
            }
            catch { }
            if (null != e.Exception)
                try { LogMessage(e.Exception, data, EventLogEntryType.Error); }
                catch { }
        }

        #endregion

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

            string logname = "GranityLog";

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
        /// <summary>
        /// 日志记录消息
        /// </summary>
        /// <param name="msg">日志信息</param>
        /// <param name="data">附加数据</param>
        /// <param name="logtype">日志类型</param>
        public static void LogMessage(Exception ex, NameValueCollection data, EventLogEntryType logtype)
        {
            string msg = ex.Message;
            if (string.IsNullOrEmpty(msg))
                return;

            string logname = "GranityLog";

            string head = "";
            EventLog log = new EventLog();
            if (null != data)
                foreach (string key in data)
                    head += key + "：" + data[key] + "\r\n";
            msg = head + "\r\n" + msg;
            msg = msg + "\r\n" + ex.Source + "\r\n" + ex.StackTrace;

            if (msg.Length > 30000)
                msg = msg.Substring(0, 30000);
            log.Log = logname;
            log.Source = logname;
            log.MachineName = Environment.MachineName;
            log.WriteEntry(msg, logtype);
        }

        /// <summary>
        /// 获取数据行的设备目标位置参数
        /// 记录包含字段【访问方式】(TCP/UDP/SerialPort)、【端口】(60000/COM1)、【地址】(192.168.1.146)
        /// </summary>
        /// <param name="dr">数据记录</param>
        /// <returns></returns>
        private CommiTarget getTarget(DataRow dr)
        {
            if (null == dr || (DBNull.Value == dr["串口"] && DBNull.Value == dr["IP地址"]))
                return null;
            CommiTarget target = new CommiTarget();
            CommiType commiType = CommiType.UDP;
            string stype = Convert.ToString(dr["通讯类别"]);
            switch (stype)
            {
                case "TCP/IP(局域网)":
                    commiType = CommiType.TCP; break;
                case "UDP/IP(局域网)":
                    commiType = CommiType.UDP; break;
                default:
                    commiType = CommiType.SerialPort; break;
            }
            try
            {
                if (CommiType.SerialPort == commiType)
                {
                    string portname = Convert.ToString(dr["串口"]);
                    int baudRate = Convert.ToInt16(dr["波特率"]);
                    int dataBits = Convert.ToInt16(dr["数据位"]);
                    decimal s = Convert.ToDecimal(dr["停止位"]);
                    StopBits sb = StopBits.None;
                    if (1 == s) sb = StopBits.One;
                    else if (2 == s) sb = StopBits.Two;
                    else if (1 < s && s < 2) sb = StopBits.OnePointFive;

                    target.SetProtocolParam(portname, baudRate, Parity.None, dataBits, sb);
                }
                else
                {
                    string addr = Convert.ToString(dr["IP地址"]);
                    if (string.IsNullOrEmpty(addr) || DBNull.Value == dr["端口"])
                        return null;
                    int port = Convert.ToInt32(dr["端口"]);
                    target.SetProtocolParam(addr, port, commiType);
                }
            }
            catch (Exception ex)
            {
                NameValueCollection data = new NameValueCollection();
                data["操作"] = "创建通讯目标";
                data["设备ID"] = Convert.ToString(dr["ID"]);
                ServiceTool.LogMessage(ex, data, EventLogEntryType.Error);
                return null;
            }
            return target;
        }

    }
}
