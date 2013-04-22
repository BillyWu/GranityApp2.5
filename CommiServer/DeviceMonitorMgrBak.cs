using System;
using System.Collections.Generic;
using System.Text;
using Granity.communications;
using System.Data;
using Estar.Business.DataManager;
using ComLib;
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
    public class DeviceMonitorMgrBak
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
        private UnitItem unitItem = null;
        /// <summary>
        /// 数据操作
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// 巡检设备列表
        /// </summary>
        private List<DeviceBase> devlist = new List<DeviceBase>();

        /// <summary>
        /// 巡检指令,及要巡检的设备,间隔发送空的巡检指令以保证指令在线，否则不再对指令发设备巡检信息
        /// </summary>
        private class MonitorCommand
        {
            public string cmdid = "";
            public string devices = "";
            public DateTime dtbeat = DateTime.MinValue;
        }
        /// <summary>
        /// 客户端请求映射
        /// </summary>
        private class ClientMap
        {
            /// <summary>
            /// 通讯客户端
            /// </summary>
            public ClientInfo client;
            /// <summary>
            /// 该客户端请求巡检指令列表
            /// </summary>
            public List<MonitorCommand> cmds = new List<MonitorCommand>();
        }
        /// <summary>
        /// 客户端映射信息列表
        /// </summary>
        private List<ClientMap> clientlist = new List<ClientMap>();

        /// <summary>
        /// 设备巡检管理构造函数
        /// </summary>
        public DeviceMonitorMgrBak()
        {
            this.unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "设备监控服务");
            this.query = new QueryDataRes(this.unitItem.DataSrcFile);

            //2分钟执行一次
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
        /// <param name="info">指令内容：service='monitor',device,id,patrol='true'(patrol持续执行)</param>
        /// <param name="client">客户端连接信息</param>
        public void Monitordev(NameValueCollection info, ClientInfo client)
        {
            if (null == info || null == client || null == client.Client || !client.Client.Connected)
                return;
            string cmdid = info["id"];
            string devid = info["device"];
            if (string.IsNullOrEmpty(cmdid))
                return;
            ServiceTool.LogMessage("启动巡检：" + cmdid + "\r\n设备：" + devid, null, EventLogEntryType.Warning);
            //增加客户端连接信息
            ClientMap[] cms = this.clientlist.ToArray();
            ClientMap cm = null;
            for (int i = cms.Length - 1; i > -1; i--)
            {
                if (null == cms[i] || null == cms[i].client.Client || !cms[i].client.Client.Connected)
                    continue;
                if (client != cms[i].client)
                    continue;
                cm = cms[i];
                break;
            }
            if (null == cm)
            {
                cm = new ClientMap();
                cm.client = client;
                this.clientlist.Add(cm);
            }
            //添加监听指令
            MonitorCommand cmd = null;
            foreach (MonitorCommand mcd in cm.cmds)
                if (cmdid == mcd.cmdid)
                {
                    cmd = mcd;
                    break;
                }
            if (null == cmd)
            {
                cmd = new MonitorCommand();
                cmd.cmdid = cmdid;
                cm.cmds.Add(cmd);
            }
            cmd.dtbeat = DateTime.Now;

            //增加监听巡检设备
            if (string.IsNullOrEmpty(devid))
            {
                this.returnInfo(info, client, true);
                return;
            }
            devid = "," + devid + ",";
            devid = devid.Replace(",,", ",");
            if (cmd.devices.Contains(devid))
            {
                this.returnInfo(info, client, true);
                return;
            }
            //加入设备列表,并增加巡检设备
            if (string.IsNullOrEmpty(cmd.devices))
                cmd.devices = devid;
            else
                cmd.devices += devid.Substring(1);
            bool ispatrol = false;
            if ("true" == info["patrol"])
                ispatrol = true;
            devid = devid.Replace(",", "");
            this.addDevice(devid, ispatrol);
            this.returnInfo(info, client, true);
        }

        /// <summary>
        /// 添加监控管理的设备
        /// </summary>
        /// <param name="devid">请求的客户端</param>
        /// <param name="ispatrol">是否持续巡检</param>
        private void addDevice(string devid, bool ispatrol)
        {
            //设备已经监控,则不再增加设备信息
            DeviceBase[] devices = this.devlist.ToArray();
            for (int i = 0; i < devices.Length; i++)
                if (devid == devices[i].DevID)
                    return;

            //增加设备监控
            Estar.Common.Tools.NameObjectList ps = new Estar.Common.Tools.NameObjectList();
            ps["设备ID"] = devid;
            DataTable tab = this.query.getTable("设备通讯参数", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            DataRow dr = tab.Rows[0];
            string dvtype = Convert.ToString(dr["通讯协议"]);
            if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["站址"])
                return;
            int station = Convert.ToInt32(dr["站址"]);
            CommiTarget target = this.getTarget(dr);
            CommiManager commimgr = CommiManager.GlobalManager;
            DeviceBase device = null;
            switch (dvtype)
            {
                case "门禁":
                    device = new DeviceDoor();
                    target.setProtocol(Protocol.PTLDoor);
                    break;
                case "消费":
                    device = new DeviceEatery();
                    target.setProtocol(Protocol.PTLEatery);
                    break;
                default:
                    return;
            }
            device.IsPatrol = ispatrol;
            device.SetDevice(commimgr, target, devid, station);
            this.devlist.Add(device);
            device.RecordHandle += new EventHandler<DvRecordEventArgs>(device_RecordHandle);
            device.SignalHandle += new EventHandler<DvSignalEventArgs>(device_SignalHandle);
            device.AlarmHandle += new EventHandler<DvAlarmEventArgs>(device_AlarmHandle);
            device.StartGather();
        }

        /// <summary>
        /// 移除监控的设备或没有指定设备就移除整个指令,或对无效(心跳超时)指令移除
        /// </summary>
        /// <param name="info">指令内容：service='halt',device,id,all='true'</param>
        /// <param name="client">客户端连接信息</param>
        public void Haltdev(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                info = new NameValueCollection();
            string cmdid = info["id"];
            string devid = info["device"];
            string all = info["all"];
            if (!string.IsNullOrEmpty(devid))
            {
                devid += "," + devid + ",";
                devid = devid.Replace(",,", ",");
            }
            if (!string.IsNullOrEmpty(all))
                all = all.ToLower();
            ServiceTool.LogMessage("停止巡检：" + cmdid + "\r\n设备：" + devid, null, EventLogEntryType.Warning);
            //移除指定的设备监控,或移除指令,或移除无效指令
            TimeSpan ts = new TimeSpan(0, 5, 0);
            DateTime dtNow = DateTime.Now;
            ClientMap[] maps = this.clientlist.ToArray();
            for (int i = maps.Length - 1; i > -1; i--)
            {
                if (null == maps[i] || null == maps[i].client.Client || !maps[i].client.Client.Connected)
                {
                    MonitorCommand[] cmdsd = new MonitorCommand[0];
                    if (null != maps[i])
                        maps[i].cmds.Clear();
                    this.clientlist.Remove(maps[i]);
                    ServiceTool.LogMessage("清除指令" + maps[i].client.IPEndPoint, null, EventLogEntryType.Warning);
                    continue;
                }
                MonitorCommand[] cmds = maps[i].cmds.ToArray();
                for (int m = 0; m < cmds.Length; m++)
                {
                    MonitorCommand cmd = cmds[m];
                    if (cmdid != cmd.cmdid && dtNow - cmd.dtbeat > ts)
                    {
                        maps[i].cmds.Remove(cmd);
                        continue;
                    }
                    if (cmdid == cmd.cmdid && string.IsNullOrEmpty(devid))
                        maps[i].cmds.Remove(cmd);
                    else if ((cmdid == cmd.cmdid || "true" == all) && cmd.devices.Contains(devid))
                        cmd.devices = cmd.devices.Replace(devid, ",");
                }
                if (maps[i].cmds.Count < 1)
                    this.clientlist.Remove(maps[i]);
                //移除巡检设备
                if ("true" == all && !string.IsNullOrEmpty(devid))
                {
                    devid = devid.Replace(",", "");
                    DeviceBase[] devices = this.devlist.ToArray();
                    for (int m = 0; m < devices.Length; m++)
                    {
                        if (devid != devices[m].DevID)
                            continue;
                        this.devlist.Remove(devices[m]);
                        devices[m].StopGather();
                        ServiceTool.LogMessage("清除设备：" + devices[m].DevID, null, EventLogEntryType.Warning);
                        break;
                    }
                }
            }
            //不是持续巡检设备,在没有接收指令时停止巡检
            DeviceBase[] devs = this.devlist.ToArray();
            for (int i = 0; i < devs.Length; i++)
            {
                if (null == devs[i])
                {
                    this.devlist.Remove(devs[i]);
                    continue;
                }
                if (devs[i].IsPatrol)
                    continue;
                devid = "," + devs[i].DevID + ",";
                bool isfind = false;
                maps = this.clientlist.ToArray();
                for (int m = 0; m < maps.Length; m++)
                {
                    MonitorCommand[] cmds = maps[m].cmds.ToArray();
                    for (int k = 0; k < cmds.Length; k++)
                    {
                        if (cmds[k].devices.Contains(devid))
                            isfind = true;
                        if (isfind) break;
                    }
                    if (isfind) break;
                }
                if (isfind) break;
                this.devlist.Remove(devs[i]);
                devs[i].StopGather();
                ServiceTool.LogMessage("清除设备：" + devs[i].DevID, null, EventLogEntryType.Warning);
            }
            this.returnInfo(info, client, true);
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
        /// 采集记录数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void device_RecordHandle(object sender, DvRecordEventArgs e)
        {
            if (null == e || string.IsNullOrEmpty(e.DeviceID) || string.IsNullOrEmpty(e.TagInfo))
                return;
            this.sendclientdata(e.DeviceID, "record", Encoding.GetEncoding("GB2312").GetBytes(e.TagInfo));
        }
        /// <summary>
        /// 异常告警
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void device_AlarmHandle(object sender, DvAlarmEventArgs e)
        {
            if (null == e || string.IsNullOrEmpty(e.DeviceID) || string.IsNullOrEmpty(e.TagAlarm))
                return;
            this.sendclientdata(e.DeviceID, "alarm", Encoding.GetEncoding("GB2312").GetBytes(e.TagInfo));
        }
        /// <summary>
        /// 信号变位
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void device_SignalHandle(object sender, DvSignalEventArgs e)
        {
            if (null == e || string.IsNullOrEmpty(e.DeviceID) || string.IsNullOrEmpty(e.TagSignal))
                return;
            this.sendclientdata(e.DeviceID, "signal", Encoding.GetEncoding("GB2312").GetBytes(e.TagInfo));
        }

        /// <summary>
        /// 向客户端发送数据:记录/信号/事件
        /// </summary>
        /// <param name="device">设备ID</param>
        /// <param name="datatype">数据类型:record,signal,alarm</param>
        /// <param name="data">发送的数据字节</param>
        private void sendclientdata(string device, string datatype, byte[] data)
        {
            if (string.IsNullOrEmpty(device) || string.IsNullOrEmpty(datatype) || null == data || data.Length < 1)
                return;
            TimeSpan ts = new TimeSpan(0, 3, 0);
            DateTime dtNow = DateTime.Now;

            string dvid = "," + device + ",";
            NameValueCollection info = new NameValueCollection();
            info.Add("cmd", "TransFile.extend");
            info.Add("service", "monitor");
            info.Add("len", Convert.ToString(data.Length));
            info.Add("deviceid", device);
            info.Add("datatype", datatype);
            ServiceTool.LogMessage("发送数据(设备)：" + device + "\r\n" + Encoding.GetEncoding("GB2312").GetString(data), null, EventLogEntryType.Information);

            //对关联连接响应数据
            ClientMap[] cms = this.clientlist.ToArray();
            for (int i = 0; i < cms.Length; i++)
            {
                if (null == cms[i].client || null == cms[i].client.Client || cms[i].cmds.Count < 1 || !cms[i].client.Client.Connected)
                    continue;
                ClientInfo cf = cms[i].client;
                MonitorCommand[] cmds = cms[i].cmds.ToArray();
                for (int m = 0; m < cmds.Length; m++)
                {
                    if (!cmds[m].devices.Contains(device))
                        continue;
                    info["id"] = cmds[m].cmdid;
                    byte[] context = SvrFileTrans.ParseInfo(info);
                    int len = context.Length;
                    Array.Resize<byte>(ref context, context.Length + data.Length);
                    Array.Copy(data, 0, context, len, data.Length);
                    Monitor.Enter(cf);
                    cf.BufferResponse.Add(context);
                    Monitor.PulseAll(cf);
                    Monitor.Exit(cf);
                }
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
