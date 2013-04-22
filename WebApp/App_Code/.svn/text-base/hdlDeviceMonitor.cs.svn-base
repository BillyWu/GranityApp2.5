using System;
using System.Web;
using System.Net;
using System.Data;
using System.IO;
using System.Text;
using System.IO.Ports;
using System.Diagnostics;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Threading;
using System.ServiceProcess;

using Estar.Common.Tools;
using Granity.commiServer;
using Granity.communications;
using Granity.CardOneCommi;
using Estar.Business.DataManager;
using Granity.winTools;


namespace Granity.Web
{
    /// <summary>
    /// 启动和停止设备巡检数据采集:appcmd: monitor,halt,data
    /// </summary>
    public class hdlDeviceMonitor : IHttpHandler
    {
        /// <summary>
        /// 与后端服务目标地址
        /// </summary>
        private static CommiTarget tgService = null;
        /// <summary>
        /// 定时执行心跳,保障心跳动作
        /// </summary>
        private static Timer tmBeat = null;
        /// <summary>
        /// 设备监控单元
        /// </summary>
        private static UnitItem unitItem = null;
        /// <summary>
        /// 数据操作
        /// </summary>
        private static QueryDataRes query = null;
        /// <summary>
        /// 缓存当前监控设备
        /// </summary>
        private static List<DeviceBase> devlist = new List<DeviceBase>();
        /// <summary>
        /// 与后端服务进行交互的传输指令
        /// </summary>
        private CmdFileTrans cmdtrans = new CmdFileTrans(false);

        public void ProcessRequest(HttpContext context)
        {
            if (ThreadManager.IsResetNeed)
            {
                CommiManager.GlobalManager.ClearCommand();
                ThreadManager.AbortAll();
                CommiManager.GlobalManager.ResetClient();
                DeviceEatery.ResetQueue();
                DeviceDoor.ResetQueue();
                DeviceChannel.ResetQueue();
                Thread.Sleep(new TimeSpan(0, 5, 0));
                return;
            }
            if (null == unitItem)
            {
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "设备监控服务");
                query = new QueryDataRes(unitItem.DataSrcFile);
            }
            StreamReader reader = new StreamReader(context.Request.InputStream);
            NameValueCollection ps = HttpUtility.ParseQueryString(reader.ReadToEnd());
            string cmd = ps["cmd"];
            string devices = ps["devices"];
            string response = "";
            if (string.IsNullOrEmpty(devices))
                devices = "";
            string[] devid = devices.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            foreach (string d in devid)
            {
                if (hdlDownParam.Contains(d))
                    devices = devices.Replace(d, "");
            }
            devid = devices.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            devices = "";
            foreach (string d in devid)
                devices += "," + d;
            if (!string.IsNullOrEmpty(devices))
                devices = devices.Substring(1);
            //提取记录      "false"==ps["reset"]
            //重采记录      "true"==ps["reset"]
            //继续重采记录  "1"==ps["reset"]
            if ("true" == ps["reset"])
                DeviceEatery.ResetPosition("true");
            if ("false" == ps["reset"] || string.IsNullOrEmpty(ps["reset"]))
                DeviceEatery.ResetPosition("false");
            else
            {
                //继续重采记录
                if (string.IsNullOrEmpty(devices))
                    devices = "";
                for (int i = 0; i < devid.Length; i++)
                    DeviceEatery.ResetPosition(devid[i]);
            }
            cmdtrans.TimeOut = new TimeSpan(0, 0, 0, 0, 600);
            cmdtrans.TimeFailLimit = new TimeSpan(0, 0, 0, 2);
            switch (cmd)
            {
                  
                //启动监听
                case "monitor":
                    response = "@成功=true";
                    if (!this.Monitor(devices))
                        response = "@成功=false";
                    break;
                //停止监听
                case "halt":
                    response = "@成功=true";
                    if (!this.Halt(devices))
                        response = "@成功=false";
                    break;
                //定时巡检数据
                case "getrecord":
                  
                    string datatype = ps["datatype"];
                    string dtcheck = ps["dtUpdate"];
                    DateTime dt = Convert.ToDateTime(dtcheck);
                    response = this.getRecord(dt, devices, datatype);
                    break;
                //读取记录
                case "readrecord":
                    response = this.readRecord(devices);
                    break;
                //火警开门
                case "fireopendoor":
                    this.FireOpenDoor(devices);
                    response = "@成功=true";
                    break;
                //搜索使用网络模块设备
                case "searchznet":
                    string[] info = CmdUDPznetCom.SearchUDPnet();
                    foreach (string val in info)
                        response += ";" + val;
                    if (!string.IsNullOrEmpty(response))
                        response = response.Substring(1);
                    break;
                //搜索使用门禁模块设备
                case "searchdoor":
                    string[] door = CmdUDPznetCom.SearchUDPDoor();
                    foreach (string val in door)
                        response += ";" + val;
                    if (!string.IsNullOrEmpty(response))
                        response = response.Substring(1);
                    break;
                //广播重启门禁设备
                case "setipdoor":
                    response = "@成功=false";
                    try
                    {
                        int st = Convert.ToInt32(ps["station"]);
                        string ipaddr = ps["ipaddr"];
                        string maskcode = ps["maskcode"];
                        string gateway = ps["gateway"];
                        bool suc = false;
                        suc = CmdUDPznetCom.SetTCPIPDoor(st, ipaddr, maskcode, gateway, "");
                        if (suc) response = "@成功=true";
                    }
                    catch { }
                    break;
            }
            context.Response.Write(response);
        }

        /// <summary>
        /// 巡检设备静态构造函数,初始化巡检指令,并发心跳和接收巡检数据
        /// </summary>
        static hdlDeviceMonitor()
        {
            tgService = getService();
            CmdFileTrans.OpenHeaderBeat(CommiManager.GlobalManager, tgService);
            tmBeat = new Timer(new TimerCallback(tmExecute), null, 60000, 60000);
        }
        /// <summary>
        /// 定时器执行
        /// </summary>
        /// <param name="?"></param>
        static void tmExecute(object obj)
        {
            try { CmdFileTrans.OpenHeaderBeat(CommiManager.GlobalManager, tgService); }
            catch { }
        }

        /// <summary>
        /// 对所有设备启动持续巡检和采集数据
        /// </summary>
        /// <param name="devices">设备ID,逗号分割</param>
        private bool Monitor(string devices)
        {
            if (string.IsNullOrEmpty(devices))
                return true;

            //对设备启动或停止监控, patrol持续巡检
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            bool issuccess = true;
            if (null == target) return false;

            //启动巡检
            info["device"] = devices;
            info["patrol"] = "true";
            cmdtrans.ExtService(CmdSrvType.MonitorDevice, info);
            mgr.SendCommand(target, cmdtrans, true);
            if (!cmdtrans.EventWh.WaitOne(1800, false))
                issuccess = false;
            return issuccess;
        }
        /// <summary>
        /// 对所有设备启动持续巡检和采集数据
        /// </summary>
        /// <param name="devices">设备ID,逗号分割</param>
        private bool Halt(string devices)
        {
            if (string.IsNullOrEmpty(devices))
                return true;
            //对设备启动或停止监控, patrol持续巡检
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            bool issuccess = true;
            if (null == target) return false;

            //暂停巡检
            info["device"] = devices;
            info["all"] = "true";
            cmdtrans.ExtService(CmdSrvType.HaltDevice, info);
            mgr.SendCommand(target, cmdtrans, true);
            if (!cmdtrans.EventWh.WaitOne(1800, false))
                issuccess = false;
            return issuccess;
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="dtNow">时间点,该时间点后的数据</param>
        /// <param name="devices">设备ID,逗号分割</param>
        /// <param name="datatype">数据类别：record,signal,alarm</param>
        /// <returns>转换成表格数据</returns>
        private string getRecord(DateTime dtNow, string devices, string datatype)
        {
            if ("signal" != datatype && "alarm" != datatype && "record" != datatype)
                return "";
            if (string.IsNullOrEmpty(devices))
                return "";
            //没有启动巡检的设备，启动巡检
            string[] devid = devices.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            string rdformat = "<Row><Device>{0}</Device><Dt>{1}</Dt><Data>{2}</Data></Row>";
            string data = "";
            //暂停巡检
            //对设备启动或停止监控, patrol持续巡检
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            info.Add("datatype", datatype);
            info.Add("response", "false");
            info.Add("dt", dtNow.ToString("yyyy-MM-dd HH:mm:ss"));
            for (int i = 0; i < devid.Length; i++)
            {
                info["device"] = devid[i];
                cmdtrans.ExtService(CmdSrvType.ReadInfodev, info);
                mgr.SendCommand(target, cmdtrans, true);
                if (!cmdtrans.EventWh.WaitOne(1800, false))
                    continue;
                byte[] response = cmdtrans.ResponseData;
                byte[] header = SvrFileTrans.GetFileheader(response);
                NameValueCollection infores = SvrFileTrans.ParseInfo(header);
                long len = 0;
                if (!string.IsNullOrEmpty(infores["len"]))
                    long.TryParse(infores["len"], out len);
                if (len < 1 || len + header.Length > response.LongLength)
                    continue;
                string dt = infores["dt"];
                byte[] bttag = new byte[len];
                Array.Copy(response, header.Length, bttag, 0, len);
                string tag = Encoding.GetEncoding("GB2312").GetString(bttag);
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 监控：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 监控：" + tag);
                if ("signal" == datatype || "alarm" == datatype)
                {
                   // data += string.Format(rdformat, devid[i], dt, tag);

                    string[] tags = tag.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int j = 0; j < tags.Length; j++)
                        data += string.Format(rdformat, devid[i], dt, tags[j]);
                }
                else
                {
                    string[] tags = tag.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int j = 0; j < tags.Length; j++)
                        data += string.Format(rdformat, devid[i], dt, tags[j]);
                }
            }
            if (string.IsNullOrEmpty(data))
                ResetService();
            return data;
        }

        /// <summary>
        /// 读取数据满50条返回前台页面
        /// </summary>
        int maxRead = 50;
        /// <summary>
        /// 当前记录数
        /// </summary>
        int indexRead = 0;
        /// <summary>
        /// 返回结果
        /// </summary>
        string dataResult = "";
        /// <summary>
        /// 多线程设备同步提取记录
        /// </summary>
        class DeviceSyn
        {
            public DeviceBase dev;
            public ManualResetEvent eh;
        }
        /// <summary>
        /// 读取记录数据
        /// </summary>
        /// <param name="devices">设备ID,逗号分割</param>
        /// <returns>转换成表格数据</returns>
        private string readRecord(string devices)
        {
            if (string.IsNullOrEmpty(devices))
                return "";
            //没有启动巡检的设备，启动巡检
            string[] devid = devices.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            string rdformat = "<Row><Device>{0}</Device><Dt>{1}</Dt><Data>{2}</Data></Row>";
            string data = "";
            //检查设备，没有的添加入缓存
            CommiManager commimgr = CommiManager.GlobalManager;
            DeviceBase[] devs = devlist.ToArray();
            DeviceBase[] reqs = new DeviceBase[devid.Length];
            for (int i = 0; i < devid.Length; i++)
            {
                DeviceBase device = null;
                //检查设备已缓存
                for (int j = 0; j < devs.Length; j++)
                {
                    if (devid[i] != devs[j].DevID)
                        continue;
                    device = reqs[i] = devs[j];
                    break;
                }
                //增加设备监控
                if (null != device)
                    continue;
                NameObjectList ps = new NameObjectList();
                ps["设备ID"] = devid[i];
                DataTable tab = query.getTable("设备通讯参数", ps);
                if (null == tab || tab.Rows.Count < 1)
                    continue;
                DataRow dr = tab.Rows[0];
                string dvtype = Convert.ToString(dr["通讯协议"]);
                if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["站址"])
                    continue;
                int station = Convert.ToInt32(dr["站址"]);
                CommiTarget target = this.getTarget(dr);
                if (null == target) continue;
                switch (dvtype)
                {
                    case "门禁":
                        string ctrltype = Convert.ToString(dr["控制器类型"]);
                        if ("进出口" == ctrltype || "出入口" == ctrltype)
                            device = new DeviceChannel();
                        else
                            device = new DeviceDoor();
                        target.setProtocol(Protocol.PTLDoor);
                        break;
                    case "消费":
                        device = new DeviceEatery();
                        target.setProtocol(Protocol.PTLEatery);
                        break;
                    default:
                        continue;
                }
                device.IsPatrol = false;
                device.dtBeat = DateTime.Now;
                device.SetDevice(commimgr, target, devid[i], station);
                devlist.Add(device);
                reqs[i] = device;
            }
            //通讯获取数据
            List<ManualResetEvent> ehm = new List<ManualResetEvent>();
            for (int i = 0; i < reqs.Length; i++)
            {
                DeviceSyn syn = new DeviceSyn();
                syn.dev = reqs[i];
                syn.eh = new ManualResetEvent(false);
                ehm.Add(syn.eh);
                ThreadManager.QueueUserWorkItem(delegate(object obj) { this.readRecordSyn(obj); }, syn);
            }
            ManualResetEvent[] ehs = ehm.ToArray();
            ManualResetEvent.WaitAll(ehs);
            myLog.Flush();
            return dataResult;
        }
        private void readRecordSyn(object obj)
        {
            DeviceSyn syn = obj as DeviceSyn;
            if (null == syn || null == syn.eh)
                return;
            if (null == syn.dev)
            {
                syn.eh.Set();
                return;
            }
            DeviceBase device = syn.dev;
            int d = 0;
            string cardnum = "";
            string rdformat = "<Row><Device>{0}</Device><Dt>{1}</Dt><Data>{2}</Data></Row>";
            do
            {
                if (d > 0) indexRead++;
                string msg = device.GatherData(0 == d);
                cardnum = basefun.valtag(msg, "{卡号}");
                string dt = basefun.valtag(msg, "{消费时间}");
                if (string.IsNullOrEmpty(dt))
                    dt = basefun.valtag(msg, "{刷卡时间}");
                d++;
                //卡号特殊，则判断是否结束
                if ("16777215" == cardnum || "0" == cardnum)
                {
                    if (device.IsEndReadDevice(-1))
                        break;
                }
                dataResult += string.Format(rdformat, device.DevID, dt, msg);
                if (indexRead > maxRead)
                    break;
            } while (!string.IsNullOrEmpty(cardnum));
            syn.eh.Set();
        }
        /// <summary>
        /// 重置服务
        /// </summary>
        private void ResetService()
        {
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            CommandBase cmdbeat = CmdFileTrans.OpenHeaderBeat(mgr, target);
            if (cmdbeat.EventWh.WaitOne(25000, false))
                return;
            //无心跳则重启
            ServiceController ctrl = new ServiceController("Granity服务守护");
            ctrl.ExecuteCommand(200);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 重启Granity文件服务");
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 重启Granity文件服务");
        }
        /// <summary>
        /// 读取记录数据
        /// </summary>
        /// <param name="devices">设备ID,逗号分割</param>
        /// <returns>转换成表格数据</returns>
        private void FireOpenDoor(string devices)
        {
            if (string.IsNullOrEmpty(devices))
                return;
            string[] devid = devices.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            //检查设备，没有的添加入缓存
            CommiManager commimgr = CommiManager.GlobalManager;
            DeviceBase[] devs = devlist.ToArray();
            DeviceBase[] reqs = new DeviceBase[devid.Length];
            for (int i = 0; i < devid.Length; i++)
            {
                DeviceBase device = null;
                //检查设备已缓存
                for (int j = 0; j < devs.Length; j++)
                {
                    if (devid[i] != devs[j].DevID)
                        continue;
                    device = reqs[i] = devs[j];
                    break;
                }
                //增加设备监控
                if (null != device)
                    continue;
                NameObjectList ps = new NameObjectList();
                ps["设备ID"] = devid[i];
                DataTable tab = query.getTable("设备通讯参数", ps);
                if (null == tab || tab.Rows.Count < 1)
                    continue;
                DataRow dr = tab.Rows[0];
                string dvtype = Convert.ToString(dr["通讯协议"]);
                if (string.IsNullOrEmpty(dvtype) || "门禁" != dvtype || DBNull.Value == dr["站址"])
                    continue;
                string ctrltype = Convert.ToString(dr["控制器类型"]);
                if ("考勤机" == ctrltype)
                    continue;
                CommiTarget target = this.getTarget(dr);
                if (null == target) continue;
                target.setProtocol(Protocol.PTLDoor);
                int station = Convert.ToInt32(dr["站址"]);
                if ("进出口" == ctrltype || "出入口" == ctrltype)
                    device = new DeviceChannel();
                else
                    device = new DeviceDoor();
                device.IsPatrol = false;
                device.dtBeat = DateTime.Now;
                device.SetDevice(commimgr, target, devid[i], station);
                devlist.Add(device);
                reqs[i] = device;
            }
            for (int i = 0; i < reqs.Length; i++)
            {
                if (null == reqs[i])
                    continue;
                DeviceBase dv = reqs[i];
                if (!(reqs[i] is DeviceDoor) && !(reqs[i] is DeviceChannel))
                    continue;
                if (dv is DeviceDoor)
                    ((DeviceDoor)dv).FireOpenDoor();
                else if (dv is DeviceChannel)
                    ((DeviceChannel)dv).FireOpenDoor();
            }
        }

        /// <summary>
        /// 获取服务器目标
        /// </summary>
        /// <returns></returns>
        private static CommiTarget getService()
        {
            //服务器目标
            int port = 2010;
            string sport = DataAccRes.AppSettings("Granity文件服务");
            if (!string.IsNullOrEmpty(sport))
                try { port = Convert.ToInt32(sport); }
                catch { return null; }
            string conn = DataAccRes.DefaultDataConnInfo.Value;
            Regex regIP = new Regex(@"server=([\w.\(\)]*)(;|\\)");
            string ipsrv = "127.0.0.1";
            if (regIP.IsMatch(conn))
            {
                Match mt = regIP.Match(conn);
                if (mt.Groups.Count > 1)
                    ipsrv = mt.Groups[1].Value.ToLower();
                if ("(local)" == ipsrv || "127.0.0.1" == ipsrv)
                    ipsrv = Dns.GetHostName();
                IPAddress[] ips = Dns.GetHostAddresses(ipsrv);
                foreach (IPAddress ip in ips)
                {
                    if (ip.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
                        continue;
                    ipsrv = ip.ToString();
                }
            }
            CommiTarget target = new CommiTarget(ipsrv, port, CommiType.TCP);
            return target;
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

    }
}