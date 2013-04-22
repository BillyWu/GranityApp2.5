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
    /// �豸Ѳ�����: 
    /// �Ծ����豸����Ѳ��ɼ�,��Ѳ�����Զ����������ݿ�,���ַ�Ѳ�������ͻ���
    /// </summary>
    public class DeviceMonitorMgr
    {
        /// <summary>
        /// ����ʱ��
        /// </summary>
        private System.Timers.Timer tmService = new System.Timers.Timer();
        /// <summary>
        /// ��ǰ��ʱ���Ƿ���ִ��
        /// </summary>
        private bool isRuning = false;
        /// <summary>
        /// �豸��ص�Ԫ
        /// </summary>
        private static UnitItem unitItem = null;
        /// <summary>
        /// ���ݲ���
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// Ѳ���豸�б�
        /// </summary>
        private List<DeviceBase> devlist = new List<DeviceBase>();
        /// <summary>
        /// ��ǰ�豸����
        /// </summary>
        public int CountDevice
        {
            get { return devlist.Count; }
        }
        /// <summary>
        /// ��Ӧ�¼����вɼ��¼�¼ʱ����
        /// </summary>
        public event EventHandler<DvRecordEventArgs> RecordHandle;

        /// <summary>
        /// �豸Ѳ������캯��
        /// </summary>
        public DeviceMonitorMgr()
        {
            if(null==unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "�豸��ط���");
            this.query = new QueryDataRes(unitItem.DataSrcFile);

            //6����ִ��һ��
            tmService.Interval = 360000;
            tmService.Elapsed += new ElapsedEventHandler(tmService_Elapsed);
            tmService.Enabled = true;
            tmService.Start();
        }
        /// <summary>
        /// ��ʱ��ִ��,��ʱ�����Ч�豸
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
        /// ����豸,Ѳ��ָ������,����Ѳ���豸
        /// �������5�����Զ���Ϊ��ָ���˳�
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='monitor',device(���ŷָ����豸ID),id,patrol='true'(patrol����ִ��)</param>
        /// <param name="client">�ͻ���������Ϣ</param>
        public void Monitordev(NameValueCollection info, ClientInfo client)
        {
            if (null == info || null == client || null == client.Client || !client.Client.Connected)
                return;
            string devids = info["device"];
            this.returnInfo(info, client, true);
            if (string.IsNullOrEmpty(devids))
                return;
            //�����豸�б�,������Ѳ���豸
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
        /// ��Ӽ�ع�����豸
        /// </summary>
        /// <param name="devid">����Ŀͻ���</param>
        /// <param name="ispatrol">�Ƿ����Ѳ��</param>
        private DeviceBase addDevice(string devid, bool ispatrol)
        {
            //�����豸���
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devid;
            DataTable tab = this.query.getTable("�豸ͨѶ����", ps);
            if (null == tab || tab.Rows.Count < 1)
                return null;
            DataRow dr = tab.Rows[0];
            if (!tab.Columns.Contains("ͨѶЭ��"))
            {
                string msg = "";
                foreach (object obj in dr.ItemArray)
                    msg += Convert.ToString(obj) + " ";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " �豸ͨѶ����ֵ��" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " �豸ͨѶ����ֵ��" + msg);
                return null;
            }
            string dvtype = Convert.ToString(dr["ͨѶЭ��"]);
            if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["վַ"])
                return null;
            int station = Convert.ToInt32(dr["վַ"]);
            CommiTarget target = this.getTarget(dr);
            if (null == target) return null;
            CommiManager commimgr = CommiManager.GlobalManager;
            DeviceBase device = null;
            switch (dvtype)
            {
                    
                case "�Ž�":
                    Debug.WriteLine("�Ž�");
                    string ctrltype = Convert.ToString(dr["����������"]);
                    if ("������" == ctrltype || "�����" == ctrltype)
                        device = new DeviceChannel();
                    else
                        device = new DeviceDoor();
                    target.setProtocol(Protocol.PTLDoor);
                    device.AlarmHandle += new EventHandler<DvAlarmEventArgs>(device_AlarmHandle);
                    break;
                case "����":
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
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ������" + Convert.ToString(station) + " �豸ID��" + devid);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ������" + Convert.ToString(station) + " �豸ID��" + devid);
            return device;
        }
        /// <summary>
        /// �豸�ɼ��¼�¼ʱ����
        /// </summary>
        /// <param name="sender">�����豸</param>
        /// <param name="e">��¼����</param>
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
        /// �����豸û��״̬��Ϣ��������
        /// </summary>
        /// <returns>�����Ƿ�������</returns>
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
        /// ����豸
        /// </summary>
        public void Resetdev()
        {
            Monitor.Enter(devlist);
            this.devlist.Clear();
            Monitor.PulseAll(devlist);
            Monitor.Exit(devlist);
        }
        /// <summary>
        /// �Ƴ���ص��豸��û��ָ���豸���Ƴ�����ָ��,�����Ч(������ʱ)ָ���Ƴ�
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='halt',device(���ŷָ����豸ID),id,all='true'</param>
        /// <param name="client">�ͻ���������Ϣ</param>
        public void Haltdev(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                info = new NameValueCollection();
            string devid = info["device"];
            if (string.IsNullOrEmpty(devid))
                devid = "";
            this.returnInfo(info, client, true);
            //�Ƴ�ָ�����豸���,���Ƴ�ָ��,���Ƴ���Чָ��
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
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ֹͣ��" + id);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ֹͣ��" + id);
            }
        }

        /// <summary>
        /// ����ָ���Ƿ�ɹ�
        /// </summary>
        /// <param name="isSeccess">�Ƿ�ɹ�</param>
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
        /// ��ȡ�豸��Ϣ,���������ݺ�״̬
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='readinfo',device,id, dt='yyyy-MM-dd HH:mm:ss',datatype='record|alarm|signal'</param>
        /// <param name="client">�ͻ���������Ϣ</param>
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

            //���ǳ���Ѳ���豸,����Ѳ��
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
            //��ȡ����
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
        /// ������
        /// </summary>
        /// <param name="sender">�Ž��豸</param>
        /// <param name="e">�����¼�</param>
        void device_AlarmHandle(object sender, DvAlarmEventArgs e)
        {
            DeviceDoor door = sender as DeviceDoor;
            if (null == door || null == e || string.IsNullOrEmpty(e.TagAlarm))
                return;
            string fire = basefun.valtag(e.TagAlarm, "��");
            if ("1" != fire) return;
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = door.DevID;
            DataTable tab = this.query.getTable("ͬ���豸", ps);
            CommiManager commimgr = CommiManager.GlobalManager;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                string dvid = Convert.ToString(dr["ID"]);
                string dvtype = Convert.ToString(dr["ͨѶЭ��"]);
                if (string.IsNullOrEmpty(dvtype) || DBNull.Value == dr["վַ"])
                    return;
                int station = Convert.ToInt32(dr["վַ"]);
                CommiTarget target = this.getTarget(dr);
                if (null == target) return;
                target.setProtocol(Protocol.PTLDoor); 
                door = new DeviceDoor();
                door.SetDevice(commimgr, target, dvid, station);
                door.FireOpenDoor();
            }
        }

        /// <summary>
        /// ��ȡ�����е��豸Ŀ��λ�ò���
        /// ��¼�����ֶΡ����ʷ�ʽ��(TCP/UDP/SerialPort)�����˿ڡ�(60000/COM1)������ַ��(192.168.1.146)
        /// </summary>
        /// <param name="dr">���ݼ�¼</param>
        /// <returns></returns>
        private CommiTarget getTarget(DataRow dr)
        {
            if (null == dr || (DBNull.Value == dr["����"] && DBNull.Value == dr["IP��ַ"]))
                return null;
            CommiTarget target = new CommiTarget();
            CommiType commiType = CommiType.UDP;
            string stype = Convert.ToString(dr["ͨѶ���"]);
            switch (stype)
            {
                case "TCP/IP(������)":
                    commiType = CommiType.TCP; break;
                case "UDP/IP(������)":
                    commiType = CommiType.UDP; break;
                default:
                    commiType = CommiType.SerialPort; break;
            }
            try
            {
                if (CommiType.SerialPort == commiType)
                {
                    string portname = Convert.ToString(dr["����"]);
                    int baudRate = Convert.ToInt16(dr["������"]);
                    int dataBits = Convert.ToInt16(dr["����λ"]);
                    decimal s = Convert.ToDecimal(dr["ֹͣλ"]);
                    StopBits sb = StopBits.None;
                    if (1 == s) sb = StopBits.One;
                    else if (2 == s) sb = StopBits.Two;
                    else if (1 < s && s < 2) sb = StopBits.OnePointFive;

                    target.SetProtocolParam(portname, baudRate, Parity.None, dataBits, sb);
                }
                else
                {
                    string addr = Convert.ToString(dr["IP��ַ"]);
                    if (string.IsNullOrEmpty(addr) || DBNull.Value == dr["�˿�"])
                        return null;
                    int port = Convert.ToInt32(dr["�˿�"]);
                    target.SetProtocolParam(addr, port, commiType);
                }
            }
            catch (Exception ex)
            {
                NameValueCollection data = new NameValueCollection();
                data["����"] = "����ͨѶĿ��";
                data["�豸ID"] = Convert.ToString(dr["ID"]);
                ServiceTool.LogMessage(ex, data, EventLogEntryType.Error);
                return null;
            }
            return target;
        }

    }
}
