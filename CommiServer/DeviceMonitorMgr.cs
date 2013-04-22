using System;
using System.Collections.Generic;
using System.Text;
using Granity.communications;
using System.Data;
using Estar.Business.DataManager;
using System.Threading;
using System.Collections.Specialized;
using Estar.Common.Tools;
using System.IO.Ports;
using System.Diagnostics;
using System.Timers;

namespace Granity.commiServer
{
    /// <summary>
    /// 设备巡检管理: 
    /// 对具体设备启动巡检采集,对巡检结果自动保存入数据库,并分发巡检结果给客户端
    /// </summary>
    public class DeviceMonitorMgr
    {
        /// <summary>
        /// 服务定时器
        /// </summary>
        private System.Timers.Timer tmService = new System.Timers.Timer();
        /// <summary>
        /// 当前定时器是否在执行
        /// </summary>
        private bool isRuning = false;
        /// <summary>
        /// 设备监控单元
        /// </summary>
        private static UnitItem unitItem = null;
        /// <summary>
        /// 数据操作
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// 巡检设备列表
        /// </summary>
        private List<DeviceBase> devlist = new List<DeviceBase>();
        /// <summary>
        /// 当前设备数量
        /// </summary>
        public int CountDevice
        {
            get { return devlist.Count; }
        }
        /// <summary>
        /// 响应事件，有采集新记录时触发
        /// </summary>
        public event EventHandler<DvRecordEventArgs> RecordHandle;

        /// <summary>
        /// 设备巡检管理构造函数
        /// </summary>
        public DeviceMonitorMgr()
        {
            if(null==unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "设备监控服务");
            this.query = new QueryDataRes(unitItem.DataSrcFile);

            //6分钟执行一次
            tmService.Interval = 360000;
            tmService.Elapsed += new ElapsedEventHandler(tmService_Elapsed);
            tmService.Enabled = true;
            tmService.Start();
        }
        /// <summary>
        /// 定时器执行,定时检查无效设备
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void tmService_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (isRuning) return;
            try
            {
                isRuning = true;
                Haltdev(null, null);
            }
            catch (Exception ex)
            {
                ServiceTool.LogMessage(ex, null, EventLogEntryType.Error);
            }
            isRuning = false;
        }

        /// <summary>
        /// 监控设备,巡检指令心跳,增加巡检设备
        /// 间隔超过5分钟自动认为该指令退出
        /// </summary>
        /// <param name="info">指令内容：service='monitor',device(逗号分割多个设备ID),id,patrol='true'(patrol持续执行)</param>
        /// <param name="client">客户端连接信息</param>
        public void Monitordev(NameValueCollection info, ClientInfo client)
        {
            if (null == info || null == client || null == client.Client || !client.Client.Connected)
                return;
            string devids = info["device"];
            this.returnInfo(info, client, true);
            if (string.IsNullOrEmpty(devids))
                return;
            //加入设备列表,并增加巡检设备
            string[] devices = devids.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            devids = ",";
            Monitor.Enter(devlist);
            DeviceBase[] devs = devlist.ToArray();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
            for (int i = 0; i < devices.Length; i++)
            {
                string id=devices[i];
                if (devids.Contains("," + id + ","))
                    continue;
                bool exist = false;
                devids += id + ",";
                for (int j = 0; j < devs.Length; j++)
                {
                    if (id != devs[j].DevID.ToLower())
                        continue;
                    devs[j].dtBeat = DateTime.Now;
                    exist = true;
                    break;
                }
                if (exist) continue;
                this.addDevice(id, true);
            }
        }

        /// <summary>
        /// 添加监控管理的设备
        /// </summary>
        /// <param name="devid">请求的客户端</param>
        /// <param name="ispatrol">是否持续巡检</param>
        private DeviceBase addDevice(string devid, bool ispatrol)
        {
            //增加设备监控
            NameObjectList ps = new NameObjectList();
            ps["设备ID"] = devid;
            DataTable tab = this.query.getTable("设备通讯参数", ps);
            if (null == tab || tab.Rows.Count < 1)
                return null;
            DataRow dr = tab.Rows[0];
            if (!tab.Columns.Contains("通讯协议"))
            {
                string msg = "";
                foreach (object obj in dr.ItemArray)
                    msg += Convert.ToString(obj) + " ";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 设备通讯参数值：" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 设备通讯参数值：" + msg);
                return null;
            }
            string dvtype = Convert.ToString(dr["通讯协议"]);
            if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["站址"])
                return null;
            int station = Convert.ToInt32(dr["站址"]);
            CommiTarget target = this.getTarget(dr);
            if (null == target) return null;
            CommiManager commimgr = CommiManager.GlobalManager;
            DeviceBase device = null;
            switch (dvtype)
            {
                    
                case "门禁":
                    Debug.WriteLine("门禁");
                    string ctrltype = Convert.ToString(dr["控制器类型"]);
                    if ("进出口" == ctrltype || "出入口" == ctrltype)
                        device = new DeviceChannel();
                    else
                        device = new DeviceDoor();
                    target.setProtocol(Protocol.PTLDoor);
                    device.AlarmHandle += new EventHandler<DvAlarmEventArgs>(device_AlarmHandle);
                    break;
                case "消费":
                    device = new DeviceEatery();
                    target.setProtocol(Protocol.PTLEatery);
                    break;
                default:
                    return null;
            }
            device.RecordHandle += new EventHandler<DvRecordEventArgs>(device_RecordHandle);
            Monitor.Enter(devlist);
            this.devlist.Add(device);
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
            device.IsPatrol = ispatrol;
            device.dtBeat = DateTime.Now;
            device.SetDevice(commimgr, target, devid, station);
            device.StartGather();
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 启动：" + Convert.ToString(station) + " 设备ID：" + devid);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 启动：" + Convert.ToString(station) + " 设备ID：" + devid);
            return device;
        }
        /// <summary>
        /// 设备采集新记录时触发
        /// </summary>
        /// <param name="sender">智能设备</param>
        /// <param name="e">记录参数</param>
        void device_RecordHandle(object sender, DvRecordEventArgs arg)
        {
            EventHandler<DvRecordEventArgs> handle = this.RecordHandle;
            if (null == handle || null == arg || null == sender)
                return;
            if (string.IsNullOrEmpty(arg.DeviceID) || string.IsNullOrEmpty(arg.TagInfo))
                return;
            handle(sender, arg);
        }
        /// <summary>
        /// 所有设备没有状态信息则需重置
        /// </summary>
        /// <returns>返回是否需重置</returns>
        public bool IsResetNeed()
        {
            Monitor.Enter(devlist);
            DeviceBase[] devs = this.devlist.ToArray();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
            if (devs.Length < 5) return false;
            for (int i = 0; i < devs.Length; i++)
            {
                if (!string.IsNullOrEmpty(devs[i].Alarm.tag))
                    return false;
            }
            return true;
        }
        /// <summary>
        /// 清空设备
        /// </summary>
        public void Resetdev()
        {
            Monitor.Enter(devlist);
            this.devlist.Clear();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
        }
        /// <summary>
        /// 移除监控的设备或没有指定设备就移除整个指令,或对无效(心跳超时)指令移除
        /// </summary>
        /// <param name="info">指令内容：service='halt',device(逗号分割多个设备ID),id,all='true'</param>
        /// <param name="client">客户端连接信息</param>
        public void Haltdev(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                info = new NameValueCollection();
            string devid = info["device"];
            if (string.IsNullOrEmpty(devid))
                devid = "";
            this.returnInfo(info, client, true);
            //移除指定的设备监控,或移除指令,或移除无效指令
            devid = devid.ToLower();
            DateTime dtindex = DateTime.Now.AddMinutes(-25);
            Monitor.Enter(devlist);
            DeviceBase[] devs = this.devlist.ToArray();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
            for (int i = 0; i < devs.Length; i++)
            {
                string id = devs[i].DevID.ToLower();
                if (!devid.Contains(id) && devs[i].dtBeat > dtindex)
                    continue;
                Monitor.Enter(devlist);
                this.devlist.Remove(devs[i]);
                Monitor.PulseAll(devlist);
                Monitor.Exit(devlist);
                devs[i].StopGather();
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 停止：" + id);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 停止：" + id);
            }
        }

        /// <summary>
        /// 反馈指令是否成功
        /// </summary>
        /// <param name="isSeccess">是否成功</param>
        private void returnInfo(NameValueCollection info, ClientInfo client, bool isSeccess)
        {
            if (null == info || null == client || null == client.Client)
                return;
            string[] keys ={ "id", "cmd", "service" };
            NameValueCollection msg = new NameValueCollection();
            foreach (string k in keys)
                msg[k] = info[k];
            msg["len"] = "0";
            msg["success"] = isSeccess ? "true" : "false";
            byte[] context = SvrFileTrans.ParseInfo(msg);
            Monitor.Enter(client);
            client.BufferResponse.Add(context);
            Monitor.PulseAll(client);
            Monitor.Exit(client);
        }

        /// <summary>
        /// 读取设备信息,包含了数据和状态
        /// </summary>
        /// <param name="info">指令内容：service='readinfo',device,id, dt='yyyy-MM-dd HH:mm:ss',datatype='record|alarm|signal'</param>
        /// <param name="client">客户端连接信息</param>
        public void ReadInfodev(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                return;
            
            string cmdid = info["id"];
            string devid = info["device"];
            string datatype = info["datatype"];
            string dt = info["dt"];
            if (string.IsNullOrEmpty(devid))
                return;
            if ("record" != datatype && "signal" != datatype && "alarm" != datatype)
                return;
            devid = devid.ToLower();
            DateTime dtindex = DateTime.Now.AddSeconds(-30);
            if (!string.IsNullOrEmpty(dt))
                try { dtindex = Convert.ToDateTime(dt); }
                catch { }

            //不是持续巡检设备,启动巡检
            Monitor.Enter(devlist);
            DeviceBase[] devs = this.devlist.ToArray();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
            DeviceBase device = null;
            for (int i = 0; i < devs.Length; i++)
            {
                if (devid != devs[i].DevID.ToLower())
                    continue;
                device = devs[i];
                break;
            }
            if (null == device)
            {
                device = this.addDevice(devid, true);
                if (null == device)
                    return;
                Thread.Sleep(200);
            }
            device.dtBeat = DateTime.Now;
            //获取数据
            string tag = "";
            if ("alarm" == datatype)
            {
                tag = device.Alarm.tag;
                dt = device.Alarm.dtReceive.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else if ("signal" == datatype)
            {
                tag = device.Signal.tag;
                dt = device.Signal.dtReceive.ToString("yyyy-MM-dd HH:mm:ss");
            }
            else if ("record" == datatype)
            {
                Debug.WriteLine("record");
                RecordDev[] rds = device.Rows.ToArray();
                for (int i = 0; i < rds.Length; i++)
                {
                    if (rds[i].dtReceive < dtindex)
                        continue;
                    tag += ";" + rds[i].tag;
                    dt = rds[i].dtReceive.ToString("yyyy-MM-dd HH:mm:ss");
                }
                if (!string.IsNullOrEmpty(tag))
                    tag = tag.Substring(1);
            }
            if (("alarm" == datatype || "signal" == datatype) && string.IsNullOrEmpty(tag))
                device.ReStartGather();
            NameValueCollection nvclient = new NameValueCollection();
            string[,] map ={ { "id", cmdid }, { "cmd", "TransFile.extend" }, { "service", "readinfo" }, { "len", "0" }, { "deviceid", device.DevID }, { "datatype", datatype }, { "dt", dt } };
            for (int i = 0; i < map.GetLength(0); i++)
                nvclient.Add(map[i, 0], map[i, 1]);
          
            byte[] data = Encoding.GetEncoding("GB2312").GetBytes(tag);
            nvclient["len"] = Convert.ToString(data.LongLength);
            byte[] context = SvrFileTrans.ParseInfo(nvclient);
            long len = context.LongLength;
            byte[] response = new byte[context.LongLength + data.LongLength];
            Array.Copy(context, response, len);
            Array.Copy(data, 0, response, len, data.LongLength);
            Monitor.Enter(client);
            client.BufferResponse.Add(response);
            Monitor.PulseAll(client);
            Monitor.Exit(client);
        }

        /// <summary>
        /// 火警联动
        /// </summary>
        /// <param name="sender">门禁设备</param>
        /// <param name="e">报警事件</param>
        void device_AlarmHandle(object sender, DvAlarmEventArgs e)
        {
            DeviceDoor door = sender as DeviceDoor;
            if (null == door || null == e || string.IsNullOrEmpty(e.TagAlarm))
                return;
            string fire = basefun.valtag(e.TagAlarm, "火警");
            if ("1" != fire) return;
            NameObjectList ps = new NameObjectList();
            ps["设备ID"] = door.DevID;
            DataTable tab = this.query.getTable("同组设备", ps);
            CommiManager commimgr = CommiManager.GlobalManager;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                string dvid = Convert.ToString(dr["ID"]);
                string dvtype = Convert.ToString(dr["通讯协议"]);
                if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["站址"])
                    return;
                int station = Convert.ToInt32(dr["站址"]);
                CommiTarget target = this.getTarget(dr);
                if (null == target) return;
                target.setProtocol(Protocol.PTLDoor); 
                door = new DeviceDoor();
                door.SetDevice(commimgr, target, dvid, station);
                door.FireOpenDoor();
            }
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
