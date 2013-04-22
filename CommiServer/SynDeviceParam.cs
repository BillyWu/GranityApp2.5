using System;
using System.Collections.Generic;
using System.Text;
using System.Timers;
using Estar.Business.DataManager;
using System.Data;
using Estar.Common.Tools;
using Granity.communications;
using System.IO.Ports;
using System.Collections.Specialized;
using System.Diagnostics;
using Granity.CardOneCommi;
using System.Net;
using System.Configuration;
using System.Text.RegularExpressions;
using System.Threading;

namespace Granity.commiServer
{
    /// <summary>
    /// ͬ���豸����,���ºڰ��������豸���Ʋ���
    /// </summary>
    public class SynDeviceParam
    {
        /// <summary>
        /// ����ʱ��
        /// </summary>
        private System.Timers.Timer tmService = new System.Timers.Timer();
        /// <summary>
        /// ��ǰ�Ƿ�����ִ��
        /// </summary>
        private bool isRuning = false;
        /// <summary>
        /// ͨѶ��ʱ����λ���룬Ĭ��800ms
        /// </summary>
        private int timeout = 800;
        /// <summary>
        /// ͨѶ���ӻָ���ʱ��Ĭ��0���ȴ��ָ�����
        /// </summary>
        private int cnnout = 0;
        /// <summary>
        /// Э������Դ
        /// </summary>
        private const string dbSrc = "������";
        /// <summary>
        /// ���ݲ�ѯ
        /// </summary>
        private QueryDataRes query = new QueryDataRes(dbSrc);

        private int commiCount = 0;
        /// <summary>
        /// ͨѶ������
        /// </summary>
        public int CommiCount
        {
            get { return commiCount; }
        }
        private int commiIndex = 0;
        /// <summary>
        /// ͨѶ��¼����
        /// </summary>
        public int CommiIndex
        {
            get { return commiIndex; }
        }

        /// <summary>
        /// ���ö�����ָ��ʱ,���ݲ�����
        /// </summary>
        private class TransArg
        {
            /// <summary>
            /// ��תָ��
            /// </summary>
            public CmdFileTrans trans;
            /// <summary>
            /// ͨѶ�����ַ
            /// </summary>
            public CommiTarget target;
            /// <summary>
            /// ͨѶĿ�ĵش���IP��ַ
            /// </summary>
            public IPAddress proxy;
            /// <summary>
            /// ͨѶĿ��
            /// </summary>
            public CommiTarget dest;
            /// <summary>
            /// ��ǰ�豸ID
            /// </summary>
            public string devID;
            /// <summary>
            /// ͨѶվַ
            /// </summary>
            public string addrst;
            /// <summary>
            /// ����ָ����,tag��ʽ��Ϣ,��ʵ��ָ�����ִ��
            /// </summary>
            public string attrCmdtag;
        }

        public SynDeviceParam()
        {
            //20����ִ��һ��
            tmService.Interval = 1200000;
            tmService.Elapsed += new ElapsedEventHandler(tmService_Elapsed);
            tmService.Enabled = true;
            tmService.Start();

            //����Ĭ�ϳ�ʱʱ��
            string inv = DataAccRes.AppSettings("commiTimeout");
            string icn = DataAccRes.AppSettings("commiCnnout");
            if (!string.IsNullOrEmpty(inv))
            {
                try
                {
                    int timeout = Convert.ToInt32(inv);
                    this.timeout = Convert.ToInt32(timeout * 3.5);
                }
                catch { }
            }
            if (!string.IsNullOrEmpty(icn))
            {
                try
                {
                    this.cnnout = Convert.ToInt32(icn);
                }
                catch { }
            }
        }

        void tmService_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (isRuning) return;
            try
            {
                isRuning = true;
                CommiDevice();
            }
            catch (Exception ex)
            {
                ServiceTool.LogMessage(ex, null, EventLogEntryType.Error);
            }
            isRuning = false;
        }

        /// <summary>
        /// ������ʱִ��,ÿ20����ִ��һ�μ��
        /// </summary>
        public void Start()
        {
            //20����ִ��һ��
            tmService.Interval = 1200000;
            tmService.Enabled = true;
            tmService.Start();
        }

        /// <summary>
        /// ֹͣ��ʱִ��
        /// </summary>
        public void Stop()
        {
            //20����ִ��һ��
            tmService.Enabled = false;
            tmService.Stop();
        }

        /// <summary>
        /// �����豸���Ʋ���
        /// </summary>
        public void CommiDevice()
        {
        }

        /// <summary>
        /// ���������豸�ڰ�����
        /// </summary>
        /// <returns>���ش�����ʾ���޴�����ʾ�ɹ�</returns>
        public string downCardALL()
        {
            NameObjectList ps = new NameObjectList();
            Monitor.Enter(this.query);
            DataTable tab = this.query.getTable("�豸�б�", ps);
            Monitor.PulseAll(this.query);
            Monitor.Exit(this.query);
            if (null == tab || tab.Rows.Count < 1)
                return "";
            string attrcmd = "|����ID������|���غ�����|ɾ��������|ɾ��ID������|���ذ�����|";

            //������ת������
            CmdFileTrans trans = new CmdFileTrans(false);
            trans.TimeOut = new TimeSpan(0, 0, 0, 0, 600);
            trans.TimeFailLimit = new TimeSpan(0, 0, 0, 2);
            int port = 2010;
            string sport = DataAccRes.AppSettings("Granity�ļ�����");
            if (!string.IsNullOrEmpty(sport))
                try { port = Convert.ToInt32(sport); }
                catch { return ""; }
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
            CommiTarget tarsrv = new CommiTarget(ipsrv, port, CommiType.TCP);
            tarsrv.setProtocol(CmdFileTrans.PTL);

            string msg = "";
            foreach (DataRow dr in tab.Rows)
            {
                //����IP,�������Ƿ񱾵�local,ͨѶĿ��
                string addr = Convert.ToString(dr["IP��ַ"]);
                if (string.IsNullOrEmpty(addr))
                    continue;
                IPAddress proxy = null;
                try
                {
                    proxy = IPAddress.Parse(addr);
                }
                catch (Exception ex)
                {
                    NameValueCollection data = new NameValueCollection();
                    data["IP��ַ"] = addr;
                    ServiceTool.LogMessage(ex, data, EventLogEntryType.Error);
                    msg += string.Format("��{0}({1})", dr["����"], dr["IP��ַ"]);
                    continue;
                }
                CommiTarget dest = this.getTarget(dr);
                if (null == dest)
                {
                    msg += string.Format("��{0}({1})", dr["����"], dr["IP��ַ"]);
                    continue;
                }

                string tpl = Convert.ToString(dr["ͨѶЭ��"]);
                bool rtn = true;
                switch (tpl)
                {
                    case "ͣ����":
                        dest.setProtocol(Protocol.PTLPark);
                        rtn = this.commiDevicePark(tarsrv, trans, proxy, dest, dr, attrcmd);
                        break;
                    case "�Ž�":
                        string ctrltype = Convert.ToString(dr["����������"]);
                        dest.setProtocol(Protocol.PTLDoor);
                        if ("������" == ctrltype || "�����" == ctrltype)
                            rtn = this.commiDeviceChannel(tarsrv, trans, proxy, dest, dr, attrcmd);
                        else
                            rtn = this.commiDeviceDoor(tarsrv, trans, proxy, dest, dr, attrcmd);
                        break;
                    case "����":
                        dest.setProtocol(Protocol.PTLEatery);
                        rtn = this.commiDeviceEatery(tarsrv, trans, proxy, dest, dr, attrcmd);
                        break;
                }
                if (!rtn)
                    msg += string.Format("��{0}({1})", dr["����"], dr["IP��ַ"]);
            }
            if (!string.IsNullOrEmpty(msg))
                msg = msg.Substring(1);
            return msg;
        }

        /// <summary>
        /// ǿ�ƶ��豸��ȫ����ʼ�������ز���,���ºڰ�����
        /// </summary>
        /// <param name="tagdevcmds">�豸ID������ָ��,tag��ʽ,����ָ����"|"�ָ�</param>
        public bool CommiDevice(string tagdevcmds)
        {
            string devID = basefun.valtag(tagdevcmds, "�豸ID");
            string attrcmd = "|" + basefun.valtag(tagdevcmds, "ָ��") + "|";
            if (string.IsNullOrEmpty(tagdevcmds))
                return false;

            //������ת������
            CmdFileTrans trans = new CmdFileTrans(false);
            trans.TimeOut = new TimeSpan(0, 0, 0, 0, 600);
            trans.TimeFailLimit = new TimeSpan(0, 0, 0, 2);
            int port = 2010;
            string sport = DataAccRes.AppSettings("Granity�ļ�����");
            if (!string.IsNullOrEmpty(sport))
                try { port = Convert.ToInt32(sport); }
                catch { return false; }
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
                IPAddress[] ips = new IPAddress[] { };
                try
                {
                    ips = Dns.GetHostAddresses(ipsrv);
                }
                catch
                {
                    ipsrv = Dns.GetHostName();
                    ips = Dns.GetHostAddresses(ipsrv);
                }
                foreach (IPAddress ip in ips)
                {
                    if (ip.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
                        continue;
                    ipsrv = ip.ToString();
                }
            }
            CommiTarget tarsrv = new CommiTarget(ipsrv, port, CommiType.TCP);
            tarsrv.setProtocol(CmdFileTrans.PTL);

            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            Monitor.Enter(query);
            DataTable tab = this.query.getTable("�豸ͨѶ����", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tab || tab.Rows.Count < 1)
                return true;
            DataRow dr = tab.Rows[0];
            //����IP,�������Ƿ񱾵�local,ͨѶĿ��
            string addr = Convert.ToString(dr["IP��ַ"]);
            if (string.IsNullOrEmpty(addr))
                return true;
            IPAddress proxy = null;
            try
            {
                proxy = IPAddress.Parse(addr);
            }
            catch (Exception ex)
            {
                NameValueCollection data = new NameValueCollection();
                data["IP��ַ"] = addr;
                ServiceTool.LogMessage(ex, null, EventLogEntryType.Error);
                return false;
            }
            CommiTarget dest = this.getTarget(dr);
            if (null == dest)
                return false;

            string tpl = Convert.ToString(dr["ͨѶЭ��"]);
            bool rtn = true;
            switch (tpl)
            {
                case "ͣ����":
                    dest.setProtocol(Protocol.PTLPark);
                    rtn = this.commiDevicePark(tarsrv, trans, proxy, dest, dr, attrcmd);
                    break;
                case "�Ž�":
                    string ctrltype = Convert.ToString(dr["����������"]);
                    dest.setProtocol(Protocol.PTLDoor);
                    if ("������" == ctrltype || "�����" == ctrltype)
                        rtn = this.commiDeviceChannel(tarsrv, trans, proxy, dest, dr, attrcmd);
                    else
                        rtn = this.commiDeviceDoor(tarsrv, trans, proxy, dest, dr, attrcmd);
                    break;
                case "����":
                    dest.setProtocol(Protocol.PTLEatery);
                    rtn = this.commiDeviceEatery(tarsrv, trans, proxy, dest, dr, attrcmd);
                    break;
            }
            myLog.Flush();
            return rtn;
        }

        /// <summary>
        /// ��תִ��ָ��
        /// </summary>
        /// <param name="tarsrv">������</param>
        /// <param name="trans">����ʵ��</param>
        /// <param name="proxy">�豸�������IP��ַ</param>
        /// <param name="dest">�豸Ŀ��</param>
        /// <param name="cmdP">ָ��ʵ��</param>
        /// <param name="tpl">Э������</param>
        /// <param name="cmd">ָ������</param>
        /// <param name="tagdata">ָ������ tag��ʽ</param>
        /// <returns>�Ƿ�ִ�гɹ�</returns>
        private bool sendCommand(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, CmdProtocol cmdP, string tpl, string cmd, string tagdata)
        {
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == cmdP)
                return false;
            if (string.IsNullOrEmpty(tpl) || string.IsNullOrEmpty(cmd) || string.IsNullOrEmpty(tagdata))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            string msg = "";

            bool islocal = false;
            string addr = proxy.ToString();
            IPAddress[] locals = Dns.GetHostAddresses(Dns.GetHostName());
            foreach (IPAddress ip in locals)
                if (addr == ip.ToString())
                {
                    islocal = true;
                    break;
                }
            if ("127.0.0.1" == addr)
                islocal = true;
            int tmout = this.timeout;
            if ("�Ž�" == tpl && "��հ�����" == cmd)
            {
                tmout = 35 * 1000;
                cmdP.TimeOut = new TimeSpan(0, 0, 35);
                cmdP.TimeLimit = new TimeSpan(0, 0, 2 * 35);
                cmdP.TimeFailLimit = cmdP.TimeLimit;
            }
            //����ͨѶ��Ŀ���Ǵ����������ֱ��ͨѶ
            string wordcmd = basefun.valtag(tagdata, "{������}");
            if (islocal || CommiType.SerialPort != dest.ProtocolType)
            {
                if (null == cmdP.EventWh)
                    cmdP.EventWh = new ManualResetEvent(false);
                for (int i = 0; i < 2; i++)
                {

                    cmdP.setCommand(tpl, cmd, tagdata);
                    msg = "";
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + cmd + " " + tagdata);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + cmd + " " + tagdata);
                    mgr.SendCommand(dest, cmdP, true);
                    if (cmdP.EventWh.WaitOne(tmout, false))
                        msg = cmdP.ResponseFormat;
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                    string rtn = basefun.valtag(msg, "Success");
                    string wd2 = basefun.valtag(msg, "{������}");
                    if ("true" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if ("false" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if (this.cnnout < 1)
                        break;
                    if (string.IsNullOrEmpty(msg) && CommiType.SerialPort != dest.ProtocolType)
                    {
                        Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ������������...");
                        myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ������������...");
                        if (!Ping(dest)) break;
                    }
                }
            }
            else
            {
                for (int i = 0; i < 1; i++)
                {
                    cmdP.setCommand(tpl, cmd, tagdata);
                    byte[] data = cmdP.getCommand();
                    trans.CommiTrans(proxy, dest, tpl, cmd, ref data);
                    mgr.SendCommand(tarsrv, trans, true);
                    //ͬ��ͨѶ�ȴ�ʱ��1.5��
                    if (trans.EventWh.WaitOne(2 * tmout, false))
                        data = trans.FileContext;
                    msg = cmdP.FormatResponse(data);
                    string rtn = basefun.valtag(msg, "Success");
                    string wd2 = basefun.valtag(msg, "{������}");
                    if ("true" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if ("false" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                }
            }
            if ("�Ž�" == tpl && "��հ�����" == cmd)
                this.setTimeout(cmdP);
            if ("true" != basefun.valtag(msg, "Success"))
            {
                NameValueCollection attr = new NameValueCollection();
                attr["Э��"] = tpl;
                attr["����"] = tagdata + "\r\n" + cmd;
                ServiceTool.LogMessage(msg, attr, EventLogEntryType.Error);
                return false;
            }
            return true;
        }

        /// <summary>
        /// ��תִ��ָ�������Ӧ���
        /// </summary>
        /// <param name="tarsrv">������</param>
        /// <param name="trans">����ʵ��</param>
        /// <param name="proxy">�豸�������IP��ַ</param>
        /// <param name="dest">�豸Ŀ��</param>
        /// <param name="cmdP">ָ��ʵ��</param>
        /// <param name="tpl">Э������</param>
        /// <param name="cmd">ָ������</param>
        /// <param name="tagdata">ָ������ tag��ʽ</param>
        /// <returns>����ִ�н��</returns>
        private string getResponse(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, CmdProtocol cmdP, string tpl, string cmd, string tagdata)
        {
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == cmdP)
                return "";
            if (string.IsNullOrEmpty(tpl) || string.IsNullOrEmpty(cmd) || string.IsNullOrEmpty(tagdata))
                return "";
            CommiManager mgr = CommiManager.GlobalManager;
            string msg = "";

            bool islocal = false;
            string addr = proxy.ToString();
            IPAddress[] locals = Dns.GetHostAddresses(Dns.GetHostName());
            foreach (IPAddress ip in locals)
                if (addr == ip.ToString())
                {
                    islocal = true;
                    break;
                }
            if ("127.0.0.1" == addr)
                islocal = true;
            //����ͨѶ��Ŀ���Ǵ����������ֱ��ͨѶ
            string wordcmd = basefun.valtag(tagdata, "{������}");
            if (islocal || CommiType.SerialPort != dest.ProtocolType)
            {
                if (null == cmdP.EventWh)
                    cmdP.EventWh = new ManualResetEvent(false);
                for (int i = 0; i < 2; i++)
                {
                    cmdP.setCommand(tpl, cmd, tagdata);
                    msg = "";
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + cmd + " " + tagdata);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + cmd + " " + tagdata);
                    mgr.SendCommand(dest, cmdP, true);
                    if (cmdP.EventWh.WaitOne(timeout, false))
                        msg = cmdP.ResponseFormat;
                    Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                    myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                    string rtn = basefun.valtag(msg, "Success");
                    string wd2 = basefun.valtag(msg, "{������}");
                    if ("true" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if ("false" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if (this.cnnout < 1)
                        break;
                    if (string.IsNullOrEmpty(msg) && CommiType.SerialPort != dest.ProtocolType)
                    {
                        Debug.WriteLine(String.Format("{0:HH:mm:ss.fff} ������������...", DateTime.Now));
                        myLog.WriteLine(String.Format("{0:HH:mm:ss.fff} ������������...", DateTime.Now));
                        if (!Ping(dest)) break;
                    }
                }
            }
            else
            {
                for (int i = 0; i < 1; i++)
                {
                    cmdP.setCommand(tpl, cmd, tagdata);
                    byte[] data = cmdP.getCommand();
                    trans.CommiTrans(proxy, dest, tpl, cmd, ref data);
                    mgr.SendCommand(tarsrv, trans, true);
                    //ͬ��ͨѶ�ȴ�ʱ��1.5��
                    if (trans.EventWh.WaitOne(2 * timeout, false))
                        data = trans.FileContext;
                    msg = cmdP.FormatResponse(data);
                    string rtn = basefun.valtag(msg, "Success");
                    string wd2 = basefun.valtag(msg, "{������}");
                    if ("true" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                    if ("false" == rtn && (wordcmd == wd2 || string.IsNullOrEmpty(wordcmd) || string.IsNullOrEmpty(wd2)))
                        break;
                }
            }
            return msg;
        }

        /// <summary>
        /// ���ͨѶĿ���Ƿ������
        /// </summary>
        /// <param name="tarsrv">��ת����Ŀ�꣬�ڴ���ʱ��ת��ͨѶ</param>
        /// <param name="dest">ͨѶĿ��</param>
        /// <returns>�����Ƿ������</returns>
        private bool testConnect(CommiTarget tarsrv, CommiTarget dest)
        {
            bool rtn = false;
            if (null == tarsrv || null == dest)
                return rtn;
            if (CommiType.SerialPort != dest.ProtocolType)
                rtn = CommiManager.GlobalManager.TestConnect(dest);
            else
                rtn = CommiManager.GlobalManager.TestConnect(tarsrv);
            return rtn;
        }
        /// <summary>
        /// ���ͨѶĿ���Ƿ������
        /// </summary>
        /// <param name="tarsrv">��ת����Ŀ�꣬�ڴ���ʱ��ת��ͨѶ</param>
        /// <param name="dest">ͨѶĿ��</param>
        /// <returns>�����Ƿ������</returns>
        private bool Ping(CommiTarget dest)
        {
            bool rtn = false;
            if (null == dest)
                return rtn;
            DateTime dt1 = DateTime.Now;
            do
            {
                rtn = CommiManager.GlobalManager.TestConnect(dest);
                DateTime dt2 = DateTime.Now;
                if (!rtn && this.cnnout > 0)
                {
                    TimeSpan ts = dt2 - dt1;
                    if (ts.TotalMilliseconds > this.cnnout)
                        break;
                    Thread.Sleep(200);
                }
            } while (!rtn && this.cnnout > 0);
            return rtn;
        }

        #region ͣ����ͨѶ

        /// <summary>
        /// ͣ�����豸��ʼ�������ز���,���ºڰ�����
        /// </summary>
        /// <param name="tarsrv">��ת������</param>
        /// <param name="trans">����ָ��</param>
        /// <param name="proxy">�豸ͨѶ�������IP��ַ</param>
        /// <param name="dest">Ŀ���豸</param>
        /// <param name="drdevice">�豸��Ϣ��¼��</param>
        /// <param name="attrcmd">ִ��ָ��</param>
        /// <returns>����ͨѶ���ز����Ƿ�ɹ�</returns>
        private bool commiDevicePark(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, DataRow drdevice, string attrcmd)
        {
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == drdevice || string.IsNullOrEmpty(attrcmd))
                return true;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            string devID = Convert.ToString(drdevice["ID"]);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;

            //ϵͳʱ��
            string tpl = "ͣ����";
            string valst = Convert.ToString(drdevice["վַ"]);
            Monitor.Enter(query);
            DateTime dtsystem = Convert.ToDateTime(this.query.ExecuteScalar("ϵͳʱ��", ps));
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string cmdstr = ",��ʽ��,��ʼ��ID������,��ʼ��������,����ϵͳʱ��,���ؿ��Ʋ���,";
            string[] cmds = attrcmd.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < cmds.Length; i++)
            {
                if (cmdstr.IndexOf("," + cmds[i] + ",") < 0)
                    continue;
                string tagdata = "@�豸��ַ=" + valst;
                if ("���ؿ��Ʋ���" == cmds[i])
                {
                    Monitor.Enter(query);
                    DataTable tabctrlpm = this.query.getTable("�豸���Ʋ���", ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    if (null == tabctrlpm || tabctrlpm.Rows.Count < 1)
                        continue;
                    tagdata = this.getctrlpm(tabctrlpm.Rows[0], valst);
                }
                else if ("����ϵͳʱ��" == cmds[i])
                {
                    tagdata = basefun.setvaltag(tagdata, "{ϵͳʱ��}", dtsystem.ToString("yyyy-MM-dd HH:mm:ss"));
                }
                success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                if (!success) return false;
                //��ʽ��ʱ�豸��2.5s��Ӧ��
                if ("��ʽ��" == cmds[i])
                    System.Threading.Thread.Sleep(3500);
            }

            //��������ָ�����ʵ��
            TransArg arg = new TransArg();
            arg.trans = trans;
            arg.target = tarsrv;
            arg.proxy = proxy;
            arg.dest = dest;
            arg.devID = devID;
            arg.addrst = Convert.ToString(drdevice["վַ"]);
            arg.attrCmdtag = attrcmd;

            //���ؼƷѱ�׼
            success = this.downPayRule(arg);
            if (!success) return false;
            //������������
            Monitor.Enter(query);
            this.query.ExecuteNonQuery("�豸���ر�־����", ps, ps, ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            //���úڰ�����
            if (attrcmd.IndexOf("|��ʽ��|") > -1 || attrcmd.IndexOf("|��ʼ��ID������|") > -1 || attrcmd.IndexOf("|��ʼ��������|") > -1)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�����豸����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            success = this.downparkCardList(arg);
            //�豸������ʾ
            string tag = "@�豸��ַ=" + valst;
            this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, "����", tag);
            return success;
        }

        /// <summary>
        /// �����豸�ĺڰ�������,ִ�гɹ�����ºڰ�������������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        private bool downparkCardList(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
            NameValueCollection data = new NameValueCollection();
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            //ͬ��ͨѶ�ȴ�ʱ��15��
            bool success = true;
            Monitor.Enter(query);
            DataTable tab = this.query.getTable("�豸������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string tpl = "ͣ����", cmd = "ɾ��ID������";
            string tagdata = "@�豸��ַ=" + addrst;
            if (string.IsNullOrEmpty(attrcmd) || attrcmd.IndexOf("|ɾ��ID������|") > -1)
                for (int i = 0; i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    tagdata = basefun.setvaltag(tagdata, "{����}", Convert.ToString(dr["����"]));
                    bool rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                    success = success && rtn;
                    if (!rtn)
                    {
                        if (!testConnect(target, dest))
                        {
                            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                            return false;
                        }
                        continue;
                    }
                    ps["״̬"] = "��";
                    ps["����"] = Convert.ToString(dr["����"]);
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            Monitor.Enter(query);
            tab = this.query.getTable("�豸������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            cmd = "����ID������";
            if (string.IsNullOrEmpty(attrcmd) || attrcmd.IndexOf("|����ID������|") > -1)
                for (int i = 0; i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    string[,] colmap ={ { "{����}", "����" }, { "{����}", "����" }, { "{����}", "����" }, { "{ʱ��}", "ʱ��" }, { "{��Ч����}", "��Ч����" } };
                    for (int j = 0; j < colmap.GetLength(0); j++)
                        tagdata = basefun.setvaltag(tagdata, colmap[j, 0], Convert.ToString(dr[colmap[j, 1]]));
                    bool rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                    success = success && rtn;
                    if (!rtn)
                    {
                        if (!testConnect(target, dest))
                        {
                            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                            return false;
                        }
                        continue;
                    }
                    ps["״̬"] = "��";
                    ps["����"] = Convert.ToString(dr["����"]);
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
            return success;
        }

        /// <summary>
        /// �����豸�ĺڰ�������,ִ�гɹ�����ºڰ�������������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        private bool downPayRule(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;

            string tpl = "ͣ����";
            Monitor.Enter(query);
            DataTable tabpay = this.query.getTable("�շѱ�׼�б�", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string[,] dbpay ={ { "���ѷ�ʽ1", "�շѱ�׼1", "1", "�����շѱ�׼1" }, { "���ѷ�ʽ2", "�շѱ�׼2", "2", "�����շѱ�׼2" }, { "���ѷ�ʽ3", "�շѱ�׼3", "3", "�����շѱ�׼3" },
                               { "���ѷ�ʽ4", "�շѱ�׼4", "4", "�����շѱ�׼4" }, { "���ѷ�ʽ5", "", "5", "�����շѱ�׼5" }, { "���ѷ�ʽ6", "�շѱ�׼6", "6", "�����շѱ�׼6" } };
            int ct = 0;
            if (null != tabpay && tabpay.Rows.Count > 0)
                ct = tabpay.Rows.Count;
            for (int j = 0; j < ct; j++)
            {
                DataRow drpay = tabpay.Rows[j];
                string ncar = Convert.ToString(drpay["����"]);
                ps["����"] = ncar;
                string ntype = Convert.ToString(drpay["�Ʒѷ�ʽ"]);
                int k = -1;
                for (int m = 0; m < dbpay.GetLength(0); m++)
                    if (ntype == dbpay[m, 0])
                    {
                        k = m; break;
                    }
                if (k < 0) continue;
                //ָ����������ִ��
                if (!string.IsNullOrEmpty(attrcmd) && attrcmd.IndexOf("|" + dbpay[k, 3] + "|") < 0)
                    continue;
                Monitor.Enter(query);
                DataTable tabitem = this.query.getTable(dbpay[k, 1], ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
                if (null == tabitem || tabitem.Rows.Count < 1)
                    continue;
                string tag = "";
                switch (k)
                {
                    case 0: tag = getpaypm1(drpay, tabitem); break;
                    case 1: tag = getpaypm2(drpay, tabitem); break;
                    case 2: tag = getpaypm3(drpay, tabitem); break;
                    case 3: tag = getpaypm4(drpay, tabitem); break;
                    case 4: tag = getpaypm5(drpay, tabitem); break;
                    case 5: tag = getpaypm6(drpay, tabitem); break;
                }
                if (string.IsNullOrEmpty(tag))
                    continue;
                tag = basefun.setvaltag(tag, "�豸��ַ", addrst);
                tag = basefun.setvaltag(tag, "{���ʹ���}", ncar);
                tag = basefun.setvaltag(tag, "{��ʽ����}", dbpay[k, 2]);
                //ͨѶ�����շѲ���
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, dbpay[k, 3], tag);
                if (!success) return false;
            }
            return true;
        }

        /// <summary>
        /// ���м�¼��ȡtag��ʽ���Ʋ���
        /// </summary>
        /// <param name="dr">��¼��</param>
        /// <param name="addrst">վַ</param>
        /// <returns></returns>
        private string getctrlpm(DataRow dr, string addrst)
        {
            //@{������Ƿ����������}=0,@{�ܳ�λ��}=1000,@{�ѻ�ʱ��}.{�ѻ�����}=1,@{�ѻ�ʱ��}.{�ѻ�ʱ��}=25,
            //@{��ʱ������ѡ��}.{����}=C,@{��ʱ������ѡ��}.{��ʽ}=1,@{���ҵ�λ}=01,@{�����λ����}.{�볡}=0,@{�����λ����}.{��ʱ��}=0,
            //@{��������}=00011001,@{���п���}=00101001,@{���ڳ��߼�����}=aa,@{��λռ�ÿ�����}=01010000,
            //@{��������}=11111111,@{ͨ��ѡ��}=00000110,@{��Ч�ڱ�������}=20,@{�������ž�}=30,
            //@{�����շ�}.{�����շ�}=1,@{�����շ�}.{��Чʱ��}=30,@{�����߼�����}=AA,@{��������}.{h1}=10,
            //@{��������}.{m1}=30,@{��������}.{h2}=08,@{��������}.{m2}=30,@{������λ}=10,@{���ڳ����}=10,@{��Ƭʹ����}=7,@{������}=65535,@{������}=20

            //@{֡ͷ}=02,@{�豸��ַ}=1,@{״̬}=�����ɹ���,@{�����}=0040,@{������ַ}=1,@{ϵͳ��ʶ��}=2102803,@{ͨ������}=0,@{ϵͳ����}=0,
            //@{�û�����}=1467233176,@{������Ƿ����������}=0,@{�ܳ�λ��}=0,@�ѻ�����=1,@�ѻ�ʱ��=80,@����=0,@��ʽ=6,@{���ҵ�λ}=0A,
            //@{�����λ����}=00000000,@{��������}=10100100,@{���п���}=00010100,@{���ڳ��߼�����}=3,@{��λռ�ÿ�����}=00010000,@{��������}=11111111,
            //@{ͨ��ѡ��}=00001100,@{��Ч�ڱ�������}=30,@{�������ž�}=80,@�����շ�=0,@��Чʱ��=0,@{�����߼�����}=AA,@��1=00:00,@��2=00:00,
            //@{������λ}=0,@{���ڳ����}=0,@{��Ƭʹ����}=7,@{������}=0,@{������}=0,@{������}=0,@{У����}=82,@{֡β}=03

            string[,] colmap ={ { "{��Ч�ڱ�������}", "��Ч�ڱ���" }, { "{�������ž�}", "������" },{"{�ܳ�λ��}","�ܳ�λ��"},{"{������λ}","������λ"},
                                { "{���ڳ��߼�����}", "���ڳ��߼�" }, {"{��ʱ������ѡ��}.{��ʽ}","��ʱ����ʽ"},
                                {"{�����շ�}.{�����շ�}","�Ƿ������շ�"}, {"{�����շ�}.{��Чʱ��}","��Чʱ��"},
                                {"{�����λ����}.{�볡}", "�������볡" }, { "{�����λ����}.{��ʱ��}", "�������ʱ��" }
                             };
            string[,] valmap ={ { "{�ѻ�ʱ��}.{�ѻ�����}", "1" }, { "{�ѻ�ʱ��}.{�ѻ�ʱ��}", "20" },{"{��λռ�ÿ�����}","00010000"},
                                { "{���ҵ�λ}", "01" }, { "{��Ƭʹ����}","70" }, {"{��������}","00000000"},
                                {"{��������}.{h1}","00"}, {"{��������}.{m1}","00"}, {"{��������}.{h2}","00"}, {"{��������}.{m2}","00"}};
            string tagdata = "@�豸��ַ=" + addrst;
            tagdata = basefun.setvaltag(tagdata, "{������ַ}", addrst);
            for (int i = 0; i < colmap.GetLength(0); i++)
            {
                string val = Convert.ToString(dr[colmap[i, 1]]);
                if (true.Equals(dr[colmap[i, 1]])) val = "1";
                if (false.Equals(dr[colmap[i, 1]])) val = "0";
                if ("1" == val && ("�������볡" == colmap[i, 1] || "�������ʱ��" == colmap[i, 1]))
                    val = "10";
                tagdata = basefun.setvaltag(tagdata, colmap[i, 0], val);
            }
            for (int i = 0; i < valmap.GetLength(0); i++)
                tagdata = basefun.setvaltag(tagdata, valmap[i, 0], valmap[i, 1]);
            string v = Convert.ToString(dr["����Ĭ�ϳ���"]);
            tagdata = basefun.setvaltag(tagdata, "{��ʱ������ѡ��}.{����}", Convert.ToString(Convert.ToInt64(v, 16)));
            if (true.Equals(dr["�����߼�����"]))
                tagdata = basefun.setvaltag(tagdata, "{�����߼�����}", "AA");
            else
                tagdata = basefun.setvaltag(tagdata, "{�����߼�����}", "86");

            string valk = "";
            colmap = new string[,] { { "{���п���}", "���п���" }, { "{��������}", "��������" } };
            for (int k = 0; k < colmap.GetLength(0); k++)
            {
                valk = "," + Convert.ToString(dr[colmap[k, 1]]) + ",";
                v = "";
                for (int i = 0; i < 8; i++)
                {
                    if (valk.Contains("," + Convert.ToString(i + 3) + ","))
                        v = "1" + v;
                    else
                        v = "0" + v;
                }
                tagdata = basefun.setvaltag(tagdata, colmap[k, 0], v);
            }
            //С��129������豸,��ȫ����
            //if (Convert.ToInt32(addrst) < 129)
            //    tagdata = basefun.setvaltag(tagdata, colmap[0, 0], "00000000");

            valk = "," + Convert.ToString(dr["ͨ������"]) + ",";
            v = "";
            string[] cols ={ };
            if (true.Equals(dr["ͨ�������"]))
                cols = new string[] { "3", "4", "6", "8", "9", "10" };
            else
                cols = new string[] { "1", "2", "3", "4" };
            for (int i = 0; i < cols.Length; i++)
                if (valk.Contains("," + cols[i] + ","))
                    v += "1";
                else
                    v += "0";
            if (true.Equals(dr["ͨ�������"]))
                v = "10" + v;
            else
                v = "0000" + v;
            tagdata = basefun.setvaltag(tagdata, "{ͨ��ѡ��}", v);
            return tagdata;
        }

        /// <summary>
        /// �շѱ�׼1 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm1(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����1}" }, { "������", "{����2}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));

            string val = Convert.ToString(tabdetail.Rows[0]["������"]);
            tag = basefun.setvaltag(tag, "{����3}", val);
            return tag;
        }
        /// <summary>
        /// �շѱ�׼2 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm2(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����1}" }, { "����ʱ��", "{����2}" }, { "������", "{����3}" }, { "��������ʱ", "{����4}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));
            string limit = Convert.ToString(tabdetail.Rows[0]["���޶�"]);
            if (string.IsNullOrEmpty(limit))
            {
                tag = basefun.setvaltag(tag, "{����8}", "55");
                limit = Convert.ToString(tabdetail.Rows[0]["إ��ʱ�޶�"]);
            }
            else
                tag = basefun.setvaltag(tag, "{����8}", "00");
            tag = tag = basefun.setvaltag(tag, "{����7}", limit);

            DataRow dr = tabdetail.Rows[0];
            colmap = new string[,] { { "ʱ��", "{����5}" }, { "����", "{����6}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(dr[colmap[i, 0]]));
            return tag;
        }
        /// <summary>
        /// �շѱ�׼3 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm3(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����1}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));
            tag = basefun.setvaltag(tag, "{����2}", tabdetail.Rows.Count.ToString());

            int k = 3;
            colmap = new string[,] { { "ʱ��", "����" }, { "����", "����" } };
            for (int r = 0; r < tabdetail.Rows.Count; r++)
            {
                DataRow dr = tabdetail.Rows[r];
                for (int i = 0; i < colmap.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, "{" + colmap[i, 1] + Convert.ToString(k++) + "}",
                                        Convert.ToString(dr[colmap[i, 0]]));
            }
            return tag;
        }
        /// <summary>
        /// �շѱ�׼4 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm4(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����2}" }, { "������", "{����3}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));
            tag = basefun.setvaltag(tag, "{����1}", tabdetail.Rows.Count.ToString());

            int k = 4;
            colmap = new string[,] { { "��ֹ", "����" }, { "����", "����" } };
            for (int r = 0; r < tabdetail.Rows.Count; r++)
            {
                DataRow dr = tabdetail.Rows[r];
                for (int i = 0; i < colmap.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, "{" + colmap[i, 1] + Convert.ToString(k++) + "}",
                                        Convert.ToString(dr[colmap[i, 0]]));
            }
            return tag;
        }
        /// <summary>
        /// �շѱ�׼5 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm5(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����1}" }, { "����ʱ��", "{����2}" }, { "������", "{����3}" }, { "��������ʱ", "{����4}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));
            if (tabdetail.Rows.Count < 1)
                return tag;
            //����ʱ�β���
            DataRow drtimespan = tabdetail.Rows[0];
            colmap = new string[,] { { "��ʼ", "{����5}" }, { "��ֹ", "{����6}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drtimespan[colmap[i, 0]]));

            int k = 7;
            colmap = new string[,] { { "ʱ��", "����" }, { "���", "����" } };
            for (int r = 0; r < tabdetail.Rows.Count; r++)
            {
                DataRow dr = tabdetail.Rows[r];
                for (int i = 0; i < colmap.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, "{" + colmap[i, 1] + Convert.ToString(k++) + "}",
                                        Convert.ToString(dr[colmap[i, 0]]));
            }
            return tag;
        }
        /// <summary>
        /// �շѱ�׼6 tag��ʽ����
        /// </summary>
        /// <param name="drpay">�Ʒѱ�׼��¼</param>
        /// <param name="tabdetail">��׼������ϸ</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getpaypm6(DataRow drpay, DataTable tabdetail)
        {
            if (null == drpay || null == tabdetail || tabdetail.Rows.Count < 1)
                return "";
            string tag = "";
            string[,] colmap ={ { "���ʱ��", "{����1}" }, { "إ��ʱ�޶�", "{����2}" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tag = basefun.setvaltag(tag, colmap[i, 1], Convert.ToString(drpay[colmap[i, 0]]));

            int k = 3;
            colmap = new string[,] { { "����", "����" } };
            for (int r = 0; r < tabdetail.Rows.Count; r++)
            {
                DataRow dr = tabdetail.Rows[r];
                for (int i = 0; i < colmap.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, "{" + colmap[i, 1] + Convert.ToString(k++) + "}",
                                        Convert.ToString(dr[colmap[i, 0]]));
            }
            return tag;
        }

        #endregion

        #region �Ž�ͨѶ

        /// <summary>
        /// �Ž��豸��ʼ�������ز���,���ºڰ�����
        /// </summary>
        /// <param name="tarsrv">��ת������</param>
        /// <param name="trans">����ָ��</param>
        /// <param name="proxy">�豸ͨѶ�������IP��ַ</param>
        /// <param name="dest">Ŀ���豸</param>
        /// <param name="drdevice">�豸��Ϣ��¼��</param>
        /// <param name="attrcmd">ִ��ָ��</param>
        /// <returns>����ͨѶ���ز����Ƿ�ɹ�</returns>
        private bool commiDeviceDoor(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, DataRow drdevice, string attrcmd)
        {
            string iskq = "";
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == drdevice || string.IsNullOrEmpty(attrcmd))
                return true;

            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            string devID = Convert.ToString(drdevice["ID"]);
            //��������ָ�����ʵ��
            TransArg arg = new TransArg();
            arg.trans = trans;
            arg.target = tarsrv;
            arg.proxy = proxy;
            arg.dest = dest;
            arg.devID = devID;
            arg.addrst = Convert.ToString(drdevice["վַ"]);
            arg.attrCmdtag = attrcmd;

            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;
            string tpl = "�Ž�";
            string valst = Convert.ToString(drdevice["վַ"]);
            //ϵͳʱ��
            Monitor.Enter(query);
            DateTime dtsystem = Convert.ToDateTime(this.query.ExecuteScalar("ϵͳʱ��", ps));
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string cmdstr = ",��ʽ��,��ռ�¼,��հ�����,���ʱ��,����ʱ��,����ʱ��,���ÿ��Ʋ���,�޸�����,";
            string[] cmds = attrcmd.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < cmds.Length; i++)
            {
                if (cmdstr.IndexOf("," + cmds[i] + ",") < 0)
                    continue;
                string tagdata = "@�豸��ַ=" + valst;
                if ("����ʱ��" == cmds[i])
                    tagdata = basefun.setvaltag(tagdata, "{����ʱ��}", dtsystem.ToString("yyyy-MM-dd HH:mm:ss"));
                if ("����ʱ��" == cmds[i])
                {
                    Monitor.Enter(query);
                    DataTable tabtime = this.query.getTable("�Ž�ʱ��", ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    if (null == tabtime || tabtime.Rows.Count < 1)
                        continue;
                    foreach (DataRow dr in tabtime.Rows)
                    {
                        tagdata = this.getdoortime(dr);
                        tagdata = basefun.setvaltag(tagdata, "�豸��ַ", valst);
                        success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                        if (!success) return false;
                    }
                    continue;
                }
                if ("���ÿ��Ʋ���" == cmds[i])
                {
                    success = this.downdoorctrlpm(arg);
                    if (!success) return false;
                    continue;
                }
                success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                //��ʽ��ʱ�豸��2.5s��Ӧ��
                if ("��ʽ��" == cmds[i])
                {
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�Ž���¼λ������", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    System.Threading.Thread.Sleep(3500);
                    continue;
                }
                if (!success) return false;
                if ("��ռ�¼" == cmds[i])
                {

                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�Ž���¼λ������", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
                if ("��հ�����" == cmds[i])
                    System.Threading.Thread.Sleep(20000);
                if ("�޸�����" == cmds[i])
                {

                    iskq = "�޸�����";

                }

                myLog.WriteLine("��ǰָ��   11111" + iskq);

            }
            //������������
            Monitor.Enter(query);
            this.query.ExecuteNonQuery("�豸���ر�־����", ps, ps, ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);

            //���úڰ�����
            if (attrcmd.IndexOf("|��ʽ��|") > -1 || attrcmd.IndexOf("|��հ�����|") > -1)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�����豸����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }



            success = this.downdoorCardList(arg, iskq);
            return success;
        }

        /// <summary>
        /// �Ž�ʱ��  tag��ʽ����
        /// </summary>
        /// <param name="drtime">ʱ�μ�¼</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getdoortime(DataRow drtime)
        {
            if (null == drtime)
                return "";
            string[,] colmap ={ { "{ʱ�κ�}", "ʱ�κ�" }, { "{���ڿ���}.{һ}", "����һ" }, { "{���ڿ���}.{��}", "���ڶ�" },
                        { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" }, 
                        { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" },
                        {"{��ʼʱ��1}","��ʼʱ��1"},{"{��ֹʱ��1}","����ʱ��1"},{"{��ʼʱ��2}","��ʼʱ��2"},{"{��ֹʱ��2}","����ʱ��2"},
                        {"{��ʼʱ��3}","��ʼʱ��3"},{"{��ֹʱ��3}","����ʱ��3"}};
            string tag = "";
            for (int i = 0; i < colmap.GetLength(0); i++)
            {
                if (DBNull.Value == drtime[colmap[i, 1]])
                    return "";
                if (true.Equals(drtime[colmap[i, 1]]))
                    tag = basefun.setvaltag(tag, colmap[i, 0], "1");
                else if (false.Equals(drtime[colmap[i, 1]]))
                    tag = basefun.setvaltag(tag, colmap[i, 0], "0");
                else
                    tag = basefun.setvaltag(tag, colmap[i, 0], Convert.ToString(drtime[colmap[i, 1]]));
            }
            return tag;
        }

        /// <summary>
        /// ���ؿ��Ʋ���
        /// </summary>
        /// <param name="arg"></param>
        /// <returns></returns>
        private bool downdoorctrlpm(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            Monitor.Enter(query);
            DataTable tabpm = this.query.getTable("�Ž����Ʋ���", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tabpm || tabpm.Rows.Count < 1)
                return true;
            bool success = false;
            string tpl = "�Ž�";
            string tag = "@�豸��ַ=" + addrst;
            //�����Ų���
            string[,] colmapdoor ={ { "{���Ʒ�ʽ}", "���Ʒ�ʽ" }, { "{��ʱ}", "������ʱ" }, { "{�ź�}", "�ź�" } };
            foreach (DataRow dr in tabpm.Rows)
            {
                tag = "@�豸��ַ=" + addrst;
                string mode = Convert.ToString(dr["���Ʒ�ʽ"]);
                switch (mode)
                {
                    case "����": mode = "1"; break;
                    case "����": mode = "1"; break;
                    default: mode = "3"; break;
                }
                tag = basefun.setvaltag(tag, "{���Ʒ�ʽ}", mode);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(dr["������ʱ"]));
                tag = basefun.setvaltag(tag, "{�ź�}", Convert.ToString(Convert.ToInt16(dr["�ź�"]) + 1));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���ÿ��Ʋ���", tag);
                if (!success) return false;
            }
            //���ñ�������
            string[,] colmapalarm ={ { "{����״̬}.{��}", "�𾯸澯" }, { "{����״̬}.{��Чˢ��}", "�Ƿ�ˢ���澯" },
                        { "{����״̬}.{��������}", "�����澯" }, { "{����״̬}.{�Ƿ�����}", "�Ƿ����Ÿ澯" },
                        { "{����״̬}.{��ʱ}", "��ʱ���Ÿ澯" }, { "{����״̬}.{в��}", "в�ȱ���" },
                        {"{���ų�ʱʱ��}","���ų�ʱ"}, {"{�������ʱ��}","����������ʱ"} };
            DataRow drpm = tabpm.Rows[0];
            tag = "@�豸��ַ=" + addrst;
            for (int c = 0; c < colmapalarm.GetLength(0); c++)
            {
                string val = Convert.ToString(drpm[colmapalarm[c, 1]]);
                if (true.Equals(drpm[colmapalarm[c, 1]]))
                    val = "1";
                else if (false.Equals(drpm[colmapalarm[c, 1]]))
                    val = "0";
                tag = basefun.setvaltag(tag, colmapalarm[c, 0], val);
            }
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���ñ���", tag);
            if (!success) return false;
            //�����¼���־��������¼ָ��
            string[,] colmaplog ={ { "��¼���Ű�ť", "2D" }, { "��¼�澯�¼�", "2E" }, { "��¼�Ŵ��¼�", "DC" } };
            for (int m = 0; m < colmaplog.GetLength(0); m++)
            {
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", colmaplog[m, 1]);
                tag = basefun.setvaltag(tag, "{����}", "0");
                if (true.Equals(drpm[colmaplog[m, 0]]))
                    tag = basefun.setvaltag(tag, "{����}", "1");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "�����¼���־", tag);
                if (!success) return false;
            }
            //���÷�Ǳ����Ǳָ����Ҫ��ȷ��ָ��
            tag = "@�豸��ַ=" + addrst;
            string unhide = Convert.ToString(drpm["��Ǳ���"]);
            string unhideOK = "00";
            switch (unhide)
            {
                case "���÷�Ǳ": unhide = "0"; unhideOK = "0A"; break;
                case "������Ǳ": unhide = "1"; unhideOK = "FA"; break;
                case "������Ǳ": unhide = "2"; unhideOK = "FA"; break;
                case "һ������": unhide = "3"; unhideOK = "7E"; break;
                case "һ�����": unhide = "4"; unhideOK = "FE"; break;
                default: unhide = "0"; unhideOK = "00"; break;
            }
            tag = basefun.setvaltag(tag, "{��Ǳ��}", unhide);
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���÷�Ǳ", tag);
            if (!success) return false;
            tag = basefun.setvaltag(tag, "{��Ǳ��}", unhideOK);
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���÷�Ǳȷ��", tag);
            if (!success) return false;
            //���û����������跢���ָ�����
            tag = "@�豸��ַ=" + addrst;
            string[] cmds = new string[] { "001E", "001F", "0020", "0021" };
            string locklink = Convert.ToString(drpm["�������"]);
            switch (locklink)
            {
                case "���û���": locklink = "00"; break;
                case "��������": locklink = "01"; break;
                case "���Ż���":
                    locklink = "71";
                    cmds = new string[] { "001E", "001F", "0020" };
                    break;
                case "ȫ������": locklink = "F1"; break;
                default: locklink = "00"; break;
            }
            tag = basefun.setvaltag(tag, "{����}", locklink);
            for (int i = 0; i < cmds.Length; i++)
            {
                tag = basefun.setvaltag(tag, "{������}", cmds[i]);
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���û���", tag);
                if (!success) return false;
            }
            //������չ�����
            Monitor.Enter(query);
            DataTable tabext = this.query.getTable("�Ž���չ�����", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tabext || tabext.Rows.Count < 1)
                return true;
            //������չ��ָ�ÿ����չ��ֱ��ĸ�ָ��
            string[,] codefun ={
                                 { "98", "9A", "9B", "9C", "9D" }, { "9E", "A0", "A1", "A2", "A3" },
                                 { "A4", "A6", "A7", "A8", "A9" }, { "AA", "AC", "AD", "AE", "AF" }  };
            colmapdoor = new string[,]{ { "{��λ}.{��1}", "һ����" }, { "{��λ}.{��2}", "������" }, 
                                 { "{��λ}.{��3}", "������" }, { "{��λ}.{��4}", "�ĺ���" } };
            colmapalarm = new string[,]{ { "{����״̬}.{��}", "�𾯸澯" }, { "{����״̬}.{��Чˢ��}", "�Ƿ�ˢ���澯" },
                        { "{����״̬}.{��������}", "�����澯" }, { "{����״̬}.{�Ƿ�����}", "�Ƿ����ű���" },
                        { "{����״̬}.{��ʱ}", "��ʱ���Ÿ澯" }, { "{����״̬}.{в��}", "в�ȱ���" } };
            string strtime = Convert.ToString(drpm["����������ʱ"]);
            if (string.IsNullOrEmpty(strtime))
                strtime = "0";
            long latetime = Convert.ToInt64(strtime);
            string latestr = Convert.ToString(latetime, 16).PadLeft(4, '0');
            latestr = latestr.Substring(latestr.Length - 4);
            foreach (DataRow drext in tabext.Rows)
            {
                string strbh = Convert.ToString(drext["���"]);
                if (string.IsNullOrEmpty(strbh))
                    continue;
                int index = Convert.ToInt32(strbh) - 1;
                if (index < 0 || index > 3)
                    continue;
                //�����¼�Դ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 0]);
                for (int i = 0; i < colmapdoor.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, colmapdoor[i, 0], true.Equals(drext[colmapdoor[i, 1]]) ? "1" : "0");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ���¼�Դ", tag);
                if (!success) return false;
                //���ñ���
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 1]);
                for (int i = 0; i < colmapalarm.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, colmapalarm[i, 0], true.Equals(drext[colmapalarm[i, 1]]) ? "1" : "0");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ�屨������", tag);
                if (!success) return false;
                //������ʱ��λ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 3]);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(Convert.ToInt32(latestr.Substring(2), 16)));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ����ʱ��λ", tag);
                if (!success) return false;
                //������ʱ��λ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 4]);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(Convert.ToInt32(latestr.Substring(0, 2))));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ����ʱ��λ", tag);
                if (!success) return false;
            }
            return true;
        }
        /// <summary>
        /// �����豸�ĺڰ�������,ִ�гɹ�����ºڰ�������������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        private bool downdoorCardList(TransArg arg, string iskq)
        {

            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;
            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;

            if (string.IsNullOrEmpty(attrcmd) || (attrcmd.IndexOf("|ɾ��������|") < 0 && attrcmd.IndexOf("|���ذ�����|") < 0 && (attrcmd.IndexOf("|�޸�����|") < 0)))
                return true;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
            NameValueCollection data = new NameValueCollection();
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;

            //ͬ��ͨѶ�ȴ�ʱ��15��
            bool success = true, isconn = true;
            DataTable tab = null;
            string tpl = "�Ž�", cmd = "ɾ��������";
            string tagdata = "@�豸��ַ=" + addrst;


            if (attrcmd.IndexOf("|ɾ��������|") > -1)
            {
                Monitor.Enter(query);
                tab = this.query.getTable("�Ž�������", ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
                ps["״̬"] = "��";
                for (int i = 0, len = null != tab ? tab.Rows.Count : 0; isconn && i < len; i++)
                {
                    DataRow dr = tab.Rows[i];
                    string cardnum = Convert.ToString(dr["����"]);
                    tagdata = basefun.setvaltag(tagdata, "{����}", cardnum);
                    //�����ֶα����˶�Ӧ�ź�(��������)
                    string dstr = Convert.ToString(dr["��Ȩ"]);
                    if (string.IsNullOrEmpty(dstr))
                        continue;
                    string dndoors = Convert.ToString(dr["������"]);
                    string[] bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    bool rtn = true;
                    for (int b = 0; b < bh.Length; b++)
                    {
                        //�ź���1��ʼ
                        bh[b] = Convert.ToString(Convert.ToInt32(bh[b]) + 1);
                        tagdata = basefun.setvaltag(tagdata, "{�ź�}", bh[b]);
                        rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        if (!rtn) break;
                        dndoors.Replace(bh[b], "").Replace(",,", ",");
                    }
                    success = success && rtn;
                    if (!rtn)
                    {
                        isconn = testConnect(target, dest);
                        continue;
                    }
                    dstr = Convert.ToString(dr["��Ȩ"]);
                    bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int b = 0; b < bh.Length; b++)
                    {
                        if (dndoors.Contains(bh[b]))
                            continue;
                        rtn = false;
                        break;
                    }
                    ps["����"] = cardnum;
                    ps["�Ƿ����"] = rtn;
                    ps["������"] = dndoors;
                    //��������
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            }

            if (attrcmd.IndexOf("|���ذ�����|") < 0 && attrcmd.IndexOf("|�޸�����|") < 0)
            {
                CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                return success;
            }
            int sleep = 0;
            try
            {
                string strsleep = DataAccRes.AppSettings("doorsleep");
                if (!string.IsNullOrEmpty(strsleep))
                    sleep = Convert.ToInt32(strsleep);
            }
            catch { }
            Monitor.Enter(query);
            tab = this.query.getTable("�Ž�������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tab)
            {
                CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                return false;
            }
            tab.Columns.Add("�Ƿ����", typeof(bool));
            string[,] colmap ={ { "{����}", "����" }, { "{��ʼ����}", "��������" }, { "{��ֹ����}", "��Ч����" }, { "{ʱ��}", "ʱ��" },
                                        { "{����}", "����" }, { "{���}", "�û����" } };


            if (attrcmd.IndexOf("|��հ�����|") > -1)
                cmd = "���ؼ�Ȩ������";
            else
                cmd = "���ذ�����";
            string devtype = "���ڻ�";
            if (tab.Rows.Count > 0)
                devtype = Convert.ToString(tab.Rows[0]["����������"]);
            if ("���ڻ�" == devtype)
                cmd = "���ؿ�������";
            int indexdoor = 1;
            ps["״̬"] = "��";
            for (int d = 0; d < 4; d++)
            {

                string idxd = Convert.ToString(d + 1);
                string strd = Convert.ToString(d);
                if (d > 0 && "˫��˫��" == devtype)
                    idxd = "2";

                for (int i = 0; isconn && i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    string cardnum = Convert.ToString(dr["����"]);
                    string dstr = Convert.ToString(dr["��Ȩ"]);
                    string dndoors = Convert.ToString(dr["������"]);
                    if (d > 0 && "˫��˫��" == devtype)
                    {
                        if (string.IsNullOrEmpty(dstr) || (dstr.IndexOf("1") < 0 && dstr.IndexOf("2") < 0 && dstr.IndexOf("3") < 0))
                            continue;
                    }
                    else if (string.IsNullOrEmpty(dstr) || dstr.IndexOf(strd) < 0)
                        continue;
                    if (true.Equals(dr["�Ƿ����"])) continue;
                    bool rtn = true;
                    if (!dndoors.Contains(strd))
                    {
                        tagdata = "@�豸��ַ=" + addrst;
                        for (int j = 0; j < colmap.GetLength(0); j++)
                            tagdata = basefun.setvaltag(tagdata, colmap[j, 0], Convert.ToString(dr[colmap[j, 1]]));
                        tagdata = basefun.setvaltag(tagdata, "{�ź�}", idxd);
                        tagdata = basefun.setvaltag(tagdata, "{����}", "255");
                        //���Ӱ�����
                        if (iskq == "�޸�����")
                        {
                            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") ��ǰ����޸�����" + attrcmd.IndexOf("|�޸�����|") + "cmd:" + cmd);

                            tagdata = basefun.setvaltag(tagdata, "{������1}", "0000");
                        }
                        else
                        {
                            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") ��ǰ������ذ�����" + attrcmd.IndexOf("|�޸�����|") + "cmd:" + cmd);
                            tagdata = basefun.setvaltag(tagdata, "{������1}", "0100");

                        }
                        //����β����Ȩ������
                        tagdata = basefun.setvaltag(tagdata, "{������}", Convert.ToString(indexdoor));
                        rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        if (!rtn && "���ؼ�Ȩ������" == cmd)
                        {
                            //���ݲ�ͬ�汾
                            cmd = "���ذ�����";
                            rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        }
                        success = success && rtn;
                        if (!rtn)
                        {
                            isconn = testConnect(target, dest);
                            continue;
                        }
                        indexdoor++;
                        dr["������"] = dndoors += "," + strd;
                    }
                    string[] bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int b = 0; b < bh.Length; b++)
                    {
                        if (dndoors.Contains(bh[b]))
                            continue;
                        rtn = false;
                        break;
                    }
                    dr["�Ƿ����"] = rtn;
                    if (!rtn) continue;
                    //ps["����"] = cardnum;
                    //ps["�Ƿ����"] = rtn;
                    //ps["������"] = dstr;
                    //Monitor.Enter(query);
                    //this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    //Monitor.PulseAll(query);
                    //Monitor.Exit(query);
                    //if (sleep > 0) Thread.Sleep(sleep);
                }//for (int i = 0; isconn && i < tab.Rows.Count; i++)
                if ("���ڻ�" == devtype || "����˫��" == devtype)
                    break;
                if (d > 0 && "˫��˫��" == devtype)
                    break;
            }//for (int id = 0; id < 4; id++)
            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") �����ذ�������" + Convert.ToString(indexdoor - 1));
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") �����ذ�������" + Convert.ToString(indexdoor - 1));
            if (success)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�豸�ڰ�������־����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            else if (null != tab && tab.Rows.Count > 0)
            {
                //���ز��ɹ�ʱ���ֱ���ºڰ�������־
                try
                {
                    Monitor.Enter(query);
                    this.query.BeginTransaction();
                    foreach (DataRow dr in tab.Rows)
                    {
                        if (null == dr) continue;
                        if (DataRowState.Modified != dr.RowState)
                            continue;
                        string cardnum = Convert.ToString(dr["����"]);
                        ps["״̬"] = "��";
                        ps["����"] = cardnum;
                        ps["������"] = Convert.ToString(dr["������"]);
                        ps["�Ƿ����"] = true.Equals(dr["�Ƿ����"]);
                        this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    }
                    this.query.Commit();
                }
                finally
                {
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    this.query.Close();
                }
            }
            return success;
        }

        #endregion

        #region ��բͨѶ

        /// <summary>
        /// ��բ�豸��ʼ�������ز���,���ºڰ�����
        /// </summary>
        /// <param name="tarsrv">��ת������</param>
        /// <param name="trans">����ָ��</param>
        /// <param name="proxy">�豸ͨѶ�������IP��ַ</param>
        /// <param name="dest">Ŀ���豸</param>
        /// <param name="drdevice">�豸��Ϣ��¼��</param>
        /// <param name="attrcmd">ִ��ָ��</param>
        /// <returns>����ͨѶ���ز����Ƿ�ɹ�</returns>
        private bool commiDeviceChannel(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, DataRow drdevice, string attrcmd)
        {
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == drdevice || string.IsNullOrEmpty(attrcmd))
                return true;

            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            string devID = Convert.ToString(drdevice["ID"]);
            //��������ָ�����ʵ��
            TransArg arg = new TransArg();
            arg.trans = trans;
            arg.target = tarsrv;
            arg.proxy = proxy;
            arg.dest = dest;
            arg.devID = devID;
            arg.addrst = Convert.ToString(drdevice["վַ"]);
            arg.attrCmdtag = attrcmd;

            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;
            string tpl = "�Ž�";
            string valst = Convert.ToString(drdevice["վַ"]);
            //ϵͳʱ��
            Monitor.Enter(query);
            DateTime dtsystem = Convert.ToDateTime(this.query.ExecuteScalar("ϵͳʱ��", ps));
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string cmdstr = ",��ʽ��,��ռ�¼,��հ�����,���ʱ��,����ʱ��,����ʱ��,���ÿ��Ʋ���,";
            string[] cmds = attrcmd.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < cmds.Length; i++)
            {
                if (cmdstr.IndexOf("," + cmds[i] + ",") < 0)
                    continue;
                string tagdata = "@�豸��ַ=" + valst;
                if ("����ʱ��" == cmds[i])
                    tagdata = basefun.setvaltag(tagdata, "{����ʱ��}", dtsystem.ToString("yyyy-MM-dd HH:mm:ss"));
                if ("����ʱ��" == cmds[i])
                {
                    Monitor.Enter(query);
                    DataTable tabtime = this.query.getTable("��բʱ��", ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    if (null == tabtime || tabtime.Rows.Count < 1)
                        continue;
                    foreach (DataRow dr in tabtime.Rows)
                    {
                        tagdata = this.getchanneltime(dr);
                        tagdata = basefun.setvaltag(tagdata, "�豸��ַ", valst);
                        success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                        if (!success) return false;
                    }
                    continue;
                }
                if ("���ÿ��Ʋ���" == cmds[i])
                {
                    success = this.downchannelctrlpm(arg);
                    if (!success) return false;
                    continue;
                }
                success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                //��ʽ��ʱ�豸��2.5s��Ӧ��
                if ("��ʽ��" == cmds[i])
                {
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("��բ��¼λ������", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    System.Threading.Thread.Sleep(3500);
                    continue;
                }
                if (!success) return false;
                if ("��ռ�¼" == cmds[i])
                {
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("��բ��¼λ������", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
                if ("��հ�����" == cmds[i])
                    System.Threading.Thread.Sleep(20000);
            }
            //������������
            Monitor.Enter(query);
            this.query.ExecuteNonQuery("�豸���ر�־����", ps, ps, ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);

            //���úڰ�����
            if (attrcmd.IndexOf("|��ʽ��|") > -1 || attrcmd.IndexOf("|��հ�����|") > -1)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�����豸����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            success = this.downchannelCardList(arg);
            return success;
        }

        /// <summary>
        /// �Ž�ʱ��  tag��ʽ����
        /// </summary>
        /// <param name="drtime">ʱ�μ�¼</param>
        /// <returns>����tag��ʽЭ�����</returns>
        private string getchanneltime(DataRow drtime)
        {
            if (null == drtime)
                return "";
            string[,] colmap ={ { "{ʱ�κ�}", "ʱ�κ�" }, { "{���ڿ���}.{һ}", "����һ" }, { "{���ڿ���}.{��}", "���ڶ�" },
                        { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" }, 
                        { "{���ڿ���}.{��}", "������" }, { "{���ڿ���}.{��}", "������" },
                        {"{��ʼʱ��1}","��ʼʱ��1"},{"{��ֹʱ��1}","����ʱ��1"},{"{��ʼʱ��2}","��ʼʱ��2"},{"{��ֹʱ��2}","����ʱ��2"},
                        {"{��ʼʱ��3}","��ʼʱ��3"},{"{��ֹʱ��3}","����ʱ��3"}};
            string tag = "";
            for (int i = 0; i < colmap.GetLength(0); i++)
            {
                if (DBNull.Value == drtime[colmap[i, 1]])
                    return "";
                if (true.Equals(drtime[colmap[i, 1]]))
                    tag = basefun.setvaltag(tag, colmap[i, 0], "1");
                else if (false.Equals(drtime[colmap[i, 1]]))
                    tag = basefun.setvaltag(tag, colmap[i, 0], "0");
                else
                    tag = basefun.setvaltag(tag, colmap[i, 0], Convert.ToString(drtime[colmap[i, 1]]));
            }
            return tag;
        }

        /// <summary>
        /// ���ؿ��Ʋ���
        /// </summary>
        /// <param name="arg"></param>
        /// <returns></returns>
        private bool downchannelctrlpm(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            Monitor.Enter(query);
            DataTable tabpm = this.query.getTable("��բ���Ʋ���", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tabpm || tabpm.Rows.Count < 1)
                return true;
            bool success = false;
            string tpl = "�Ž�";
            string tag = "@�豸��ַ=" + addrst;
            //�����Ų���
            string[,] colmapdoor ={ { "{���Ʒ�ʽ}", "���Ʒ�ʽ" }, { "{��ʱ}", "������ʱ" }, { "{�ź�}", "�ź�" } };
            foreach (DataRow dr in tabpm.Rows)
            {
                tag = "@�豸��ַ=" + addrst;
                string mode = Convert.ToString(dr["���Ʒ�ʽ"]);
                switch (mode)
                {
                    case "����": mode = "1"; break;
                    case "����": mode = "1"; break;
                    default: mode = "3"; break;
                }
                tag = basefun.setvaltag(tag, "{���Ʒ�ʽ}", mode);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(dr["������ʱ"]));
                tag = basefun.setvaltag(tag, "{�ź�}", Convert.ToString(Convert.ToInt16(dr["�ź�"]) + 1));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���ÿ��Ʋ���", tag);
                if (!success) return false;
            }
            //���ñ�������
            string[,] colmapalarm ={ { "{����״̬}.{��}", "�𾯸澯" }, { "{����״̬}.{��Чˢ��}", "�Ƿ�ˢ���澯" },
                        { "{����״̬}.{��������}", "�����澯" }, { "{����״̬}.{�Ƿ�����}", "�Ƿ����Ÿ澯" },
                        { "{����״̬}.{��ʱ}", "��ʱ���Ÿ澯" }, { "{����״̬}.{в��}", "в�ȱ���" },
                        {"{���ų�ʱʱ��}","���ų�ʱ"}, {"{�������ʱ��}","����������ʱ"} };
            DataRow drpm = tabpm.Rows[0];
            tag = "@�豸��ַ=" + addrst;
            for (int c = 0; c < colmapalarm.GetLength(0); c++)
            {
                string val = Convert.ToString(drpm[colmapalarm[c, 1]]);
                if (true.Equals(drpm[colmapalarm[c, 1]]))
                    val = "1";
                else if (false.Equals(drpm[colmapalarm[c, 1]]))
                    val = "0";
                tag = basefun.setvaltag(tag, colmapalarm[c, 0], val);
            }
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���ñ���", tag);
            if (!success) return false;
            //�����¼���־��������¼ָ��
            string[,] colmaplog ={ { "��¼���Ű�ť", "2D" }, { "��¼�澯�¼�", "2E" }, { "��¼�Ŵ��¼�", "DC" } };
            for (int m = 0; m < colmaplog.GetLength(0); m++)
            {
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", colmaplog[m, 1]);
                tag = basefun.setvaltag(tag, "{����}", "0");
                if (true.Equals(drpm[colmaplog[m, 0]]))
                    tag = basefun.setvaltag(tag, "{����}", "1");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "�����¼���־", tag);
                if (!success) return false;
            }
            //���÷�Ǳ����Ǳָ����Ҫ��ȷ��ָ��
            tag = "@�豸��ַ=" + addrst;
            string unhide = Convert.ToString(drpm["��Ǳ���"]);
            string unhideOK = "00";
            switch (unhide)
            {
                case "���÷�Ǳ": unhide = "0"; unhideOK = "0A"; break;
                case "������Ǳ": unhide = "1"; unhideOK = "FA"; break;
                case "������Ǳ": unhide = "2"; unhideOK = "FA"; break;
                case "һ������": unhide = "3"; unhideOK = "7E"; break;
                case "һ�����": unhide = "4"; unhideOK = "FE"; break;
                default: unhide = "0"; unhideOK = "00"; break;
            }
            tag = basefun.setvaltag(tag, "{��Ǳ��}", unhide);
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���÷�Ǳ", tag);
            if (!success) return false;
            tag = basefun.setvaltag(tag, "{��Ǳ��}", unhideOK);
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���÷�Ǳȷ��", tag);
            if (!success) return false;
            //���û����������跢���ָ�����
            tag = "@�豸��ַ=" + addrst;
            string[] cmds = new string[] { "001E", "001F", "0020", "0021" };
            string locklink = Convert.ToString(drpm["�������"]);
            switch (locklink)
            {
                case "���û���": locklink = "00"; break;
                case "��������": locklink = "01"; break;
                case "���Ż���":
                    locklink = "71";
                    cmds = new string[] { "001E", "001F", "0020" };
                    break;
                case "ȫ������": locklink = "F1"; break;
                default: locklink = "00"; break;
            }
            tag = basefun.setvaltag(tag, "{����}", locklink);
            for (int i = 0; i < cmds.Length; i++)
            {
                tag = basefun.setvaltag(tag, "{������}", cmds[i]);
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "���û���", tag);
                if (!success) return false;
            }
            //������չ�����
            Monitor.Enter(query);
            DataTable tabext = this.query.getTable("��բ��չ�����", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tabext || tabext.Rows.Count < 1)
                return true;
            //������չ��ָ�ÿ����չ��ֱ��ĸ�ָ��
            string[,] codefun ={
                                 { "98", "9A", "9B", "9C", "9D" }, { "9E", "A0", "A1", "A2", "A3" },
                                 { "A4", "A6", "A7", "A8", "A9" }, { "AA", "AC", "AD", "AE", "AF" }  };
            colmapdoor = new string[,]{ { "{��λ}.{��1}", "һ����" }, { "{��λ}.{��2}", "������" }, 
                                 { "{��λ}.{��3}", "������" }, { "{��λ}.{��4}", "�ĺ���" } };
            colmapalarm = new string[,]{ { "{����״̬}.{��}", "�𾯸澯" }, { "{����״̬}.{��Чˢ��}", "�Ƿ�ˢ���澯" },
                        { "{����״̬}.{��������}", "�����澯" }, { "{����״̬}.{�Ƿ�����}", "�Ƿ����ű���" },
                        { "{����״̬}.{��ʱ}", "��ʱ���Ÿ澯" }, { "{����״̬}.{в��}", "в�ȱ���" } };
            string strtime = Convert.ToString(drpm["����������ʱ"]);
            if (string.IsNullOrEmpty(strtime))
                strtime = "0";
            long latetime = Convert.ToInt64(strtime);
            string latestr = Convert.ToString(latetime, 16).PadLeft(4, '0');
            latestr = latestr.Substring(latestr.Length - 4);
            foreach (DataRow drext in tabext.Rows)
            {
                string strbh = Convert.ToString(drext["���"]);
                if (string.IsNullOrEmpty(strbh))
                    continue;
                int index = Convert.ToInt32(strbh) - 1;
                if (index < 0 || index > 3)
                    continue;
                //�����¼�Դ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 0]);
                for (int i = 0; i < colmapdoor.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, colmapdoor[i, 0], true.Equals(drext[colmapdoor[i, 1]]) ? "1" : "0");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ���¼�Դ", tag);
                if (!success) return false;
                //���ñ���
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 1]);
                for (int i = 0; i < colmapalarm.GetLength(0); i++)
                    tag = basefun.setvaltag(tag, colmapalarm[i, 0], true.Equals(drext[colmapalarm[i, 1]]) ? "1" : "0");
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ�屨������", tag);
                if (!success) return false;
                //������ʱ��λ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 3]);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(Convert.ToInt32(latestr.Substring(2), 16)));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ����ʱ��λ", tag);
                if (!success) return false;
                //������ʱ��λ
                tag = "@�豸��ַ=" + addrst;
                tag = basefun.setvaltag(tag, "{������}", codefun[index, 4]);
                tag = basefun.setvaltag(tag, "{��ʱ}", Convert.ToString(Convert.ToInt32(latestr.Substring(0, 2))));
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, "��չ����ʱ��λ", tag);
                if (!success) return false;
            }
            return true;
        }

        /// <summary>
        /// �����豸�ĺڰ�������,ִ�гɹ�����ºڰ�������������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        private bool downchannelCardList(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            if (string.IsNullOrEmpty(attrcmd) || (attrcmd.IndexOf("|ɾ��������|") < 0 && attrcmd.IndexOf("|���ذ�����|") < 0))
                return true;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
            NameValueCollection data = new NameValueCollection();
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            //ͬ��ͨѶ�ȴ�ʱ��15��
            bool success = true, isconn = true;
            DataTable tab = null;
            string tpl = "�Ž�", cmd = "ɾ��������";
            string tagdata = "@�豸��ַ=" + addrst;
            if (attrcmd.IndexOf("|ɾ��������|") > -1)
            {
                Monitor.Enter(query);
                tab = this.query.getTable("��բ������", ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
                ps["״̬"] = "��";
                for (int i = 0, len = null != tab ? tab.Rows.Count : 0; isconn && i < len; i++)
                {
                    DataRow dr = tab.Rows[i];
                    string cardnum = Convert.ToString(dr["����"]);
                    tagdata = basefun.setvaltag(tagdata, "{����}", cardnum);
                    //�����ֶα����˶�Ӧ�ź�(��������)
                    string dstr = Convert.ToString(dr["��Ȩ"]);
                    if (string.IsNullOrEmpty(dstr))
                        continue;
                    string dndoors = Convert.ToString(dr["������"]);
                    string[] bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    bool rtn = true;
                    for (int b = 0; b < bh.Length; b++)
                    {
                        //�ź���1��ʼ
                        bh[b] = Convert.ToString(Convert.ToInt32(bh[b]) + 1);
                        tagdata = basefun.setvaltag(tagdata, "{�ź�}", bh[b]);
                        rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        if (!rtn) break;
                        dndoors.Replace(bh[b], "").Replace(",,", ",");
                    }
                    success = success && rtn;
                    if (!rtn)
                    {
                        isconn = testConnect(target, dest);
                        continue;
                    }
                    dstr = Convert.ToString(dr["��Ȩ"]);
                    bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int b = 0; b < bh.Length; b++)
                    {
                        if (dndoors.Contains(bh[b]))
                            continue;
                        rtn = false;
                        break;
                    }
                    ps["����"] = cardnum;
                    ps["�Ƿ����"] = rtn;
                    ps["������"] = dndoors;
                    //��������
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            }
            if (attrcmd.IndexOf("|���ذ�����|") < 0)
            {
                CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                return success;
            }
            int sleep = 0;
            try
            {
                string strsleep = DataAccRes.AppSettings("doorsleep");
                if (!string.IsNullOrEmpty(strsleep))
                    sleep = Convert.ToInt32(strsleep);
            }
            catch { }
            Monitor.Enter(query);
            tab = this.query.getTable("��բ������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tab)
            {
                CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                return false;
            }
            tab.Columns.Add("�Ƿ����", typeof(bool));
            string[,] colmap ={ { "{����}", "����" }, { "{��ʼ����}", "��������" }, { "{��ֹ����}", "��Ч����" }, { "{ʱ��}", "ʱ��" },
                                        { "{����}", "����" }, { "{���}", "�û����" } };
            cmd = "���ذ�����";
            if (attrcmd.IndexOf("|��հ�����|") > -1)
                cmd = "���ؼ�Ȩ������";
            string devtype = "������";
            if (tab.Rows.Count > 0)
                devtype = Convert.ToString(tab.Rows[0]["����������"]);
            int indexdoor = 1;
            ps["״̬"] = "��";
            for (int d = 0; d < 4; d++)
            {
                string idxd = Convert.ToString(d + 1);
                string strd = Convert.ToString(d);
                if (d > 0 && ("������" == devtype || "�����" == devtype))
                    idxd = "2";
                for (int i = 0; isconn && i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    string cardnum = Convert.ToString(dr["����"]);
                    string dstr = Convert.ToString(dr["��Ȩ"]);
                    string dndoors = Convert.ToString(dr["������"]);
                    if (d > 0 && ("������" == devtype || "�����" == devtype))
                    {
                        if (string.IsNullOrEmpty(dstr) || (dstr.IndexOf("1") < 0 && dstr.IndexOf("2") < 0 && dstr.IndexOf("3") < 0))
                            continue;
                    }
                    else if (string.IsNullOrEmpty(dstr) || dstr.IndexOf(strd) < 0)
                        continue;
                    if (true.Equals(dr["�Ƿ����"])) continue;
                    bool rtn = true;
                    if (!dndoors.Contains(strd))
                    {
                        tagdata = "@�豸��ַ=" + addrst;
                        for (int j = 0; j < colmap.GetLength(0); j++)
                            tagdata = basefun.setvaltag(tagdata, colmap[j, 0], Convert.ToString(dr[colmap[j, 1]]));
                        tagdata = basefun.setvaltag(tagdata, "{�ź�}", idxd);
                        tagdata = basefun.setvaltag(tagdata, "{����}", "255");
                        //���Ӱ�����
                        tagdata = basefun.setvaltag(tagdata, "{������1}", "0100");
                        //����β����Ȩ������
                        tagdata = basefun.setvaltag(tagdata, "{������}", Convert.ToString(indexdoor));
                        rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        if (!rtn && "���ؼ�Ȩ������" == cmd)
                        {
                            //���ݲ�ͬ�汾
                            cmd = "���ذ�����";
                            rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                        }
                        success = success && rtn;
                        if (!rtn)
                        {
                            isconn = testConnect(target, dest);
                            continue;
                        }
                        indexdoor++;
                        dr["������"] = dndoors += "," + strd;
                    }
                    string[] bh = dstr.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                    for (int b = 0; b < bh.Length; b++)
                    {
                        if (dndoors.Contains(bh[b]))
                            continue;
                        rtn = false;
                        break;
                    }
                    dr["�Ƿ����"] = rtn;
                    if (!rtn) continue;
                    //ps["����"] = cardnum;
                    //ps["�Ƿ����"] = rtn;
                    //ps["������"] = dstr;
                    //Monitor.Enter(query);
                    //this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    //Monitor.PulseAll(query);
                    //Monitor.Exit(query);
                    //if (sleep > 0) Thread.Sleep(sleep);
                }//for (int i = 0; isconn && i < tab.Rows.Count; i++)
                if (d > 0 && ("������" == devtype || "�����" == devtype))
                    break;
            }//for (int id = 0; id < 4; id++)
            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") �����ذ�������" + Convert.ToString(indexdoor - 1));
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + "�豸(" + addrst + ") �����ذ�������" + Convert.ToString(indexdoor - 1));
            if (success)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�豸�ڰ�������־����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            else if (null != tab && tab.Rows.Count > 0)
            {
                //���ز��ɹ�ʱ���ֱ���ºڰ�������־
                try
                {
                    Monitor.Enter(query);
                    this.query.BeginTransaction();
                    foreach (DataRow dr in tab.Rows)
                    {
                        if (null == dr) continue;
                        if (DataRowState.Modified != dr.RowState)
                            continue;
                        string cardnum = Convert.ToString(dr["����"]);
                        ps["״̬"] = "��";
                        ps["����"] = cardnum;
                        ps["������"] = Convert.ToString(dr["������"]);
                        ps["�Ƿ����"] = true.Equals(dr["�Ƿ����"]);
                        this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    }
                    this.query.Commit();
                }
                finally
                {
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    this.query.Close();
                }
            }
            return success;
        }

        #endregion

        #region ����ͨѶ

        /// <summary>
        /// �����豸��ʼ�������ز���,���ºڰ�����
        /// </summary>
        /// <param name="tarsrv">��ת������</param>
        /// <param name="trans">����ָ��</param>
        /// <param name="proxy">�豸ͨѶ�������IP��ַ</param>
        /// <param name="dest">Ŀ���豸</param>
        /// <param name="drdevice">�豸��Ϣ��¼��</param>
        /// <param name="attrcmd">ִ��ָ��</param>
        /// <returns>����ͨѶ���ز����Ƿ�ɹ�</returns>
        private bool commiDeviceEatery(CommiTarget tarsrv, CmdFileTrans trans, IPAddress proxy, CommiTarget dest, DataRow drdevice, string attrcmd)
        {
            if (null == tarsrv || null == proxy || null == dest || null == trans || null == drdevice || string.IsNullOrEmpty(attrcmd))
                return true;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            string devID = Convert.ToString(drdevice["ID"]);
            //��������ָ�����ʵ��
            TransArg arg = new TransArg();
            arg.trans = trans;
            arg.target = tarsrv;
            arg.proxy = proxy;
            arg.dest = dest;
            arg.devID = devID;
            arg.addrst = Convert.ToString(drdevice["վַ"]);
            arg.attrCmdtag = attrcmd;

            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;
            string tpl = "����";
            string valst = Convert.ToString(drdevice["վַ"]);
            //ϵͳʱ��
            Monitor.Enter(query);
            DateTime dtsystem = Convert.ToDateTime(this.query.ExecuteScalar("ϵͳʱ��", ps));
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string cmdstr = ",��ʽ��,��ռ�¼,��ղ�������,��պ�����,���ʱ��,����ʱ��,����ʱ��,���ÿ��Ʋ���,";
            string[] cmds = attrcmd.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < cmds.Length; i++)
            {
                if (cmdstr.IndexOf("," + cmds[i] + ",") < 0)
                    continue;
                string tagdata = "@�豸��ַ=" + valst;
                if ("����ʱ��" == cmds[i])
                    tagdata = basefun.setvaltag(tagdata, "{����ʱ��}", dtsystem.ToString("yyyy-MM-dd HH:mm:ss"));
                if ("����ʱ��" == cmds[i])
                {
                    success = this.downeaterytime(arg);
                    if (!success) return false;
                    continue;
                }
                if ("���ÿ��Ʋ���" == cmds[i])
                {
                    success = this.downeateryctrlpm(arg);
                    if (!success) return false;
                    continue;
                }
                success = this.sendCommand(tarsrv, trans, proxy, dest, cmdP, tpl, cmds[i], tagdata);
                //��ʽ��ʱ�豸��2.5s��Ӧ��
                if ("��ʽ��" == cmds[i])
                {
                    System.Threading.Thread.Sleep(3500);
                    continue;
                }
                if (!success) return false;
            }
            //������������
            Monitor.Enter(query);
            this.query.ExecuteNonQuery("�豸���ر�־����", ps, ps, ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);

            //���úڰ�����
            if (attrcmd.IndexOf("|��ʽ��|") > -1 || attrcmd.IndexOf("|��հ�����|") > -1)
            {
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("�����豸����", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            success = this.downeateryCardList(arg);
            if (!success) return false;
            //�������ѿ�û�н��յ��Ĳ�����������δ���صĲ���
            success = this.downeaterySubsidy(arg);
            return success;
        }

        /// <summary>
        /// ����ʱ��
        /// </summary>
        /// <param name="arg"></param>
        /// <returns></returns>
        private bool downeaterytime(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            //ͬ��ͨѶ�ȴ�ʱ��15��
            bool success = false;

            Monitor.Enter(query);
            DataTable tab = this.query.getTable("����ʱ������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string tpl = "����", cmd = "����ʱ������";
            string[,] colmap ={ { "{ʱ�������}", "���" }, { "{��ʼʱ��}", "��ʼ" }, { "{����ʱ��}", "����" },
                                { "{�����޶�}", "ʱ���޶�" }, { "{�����޴�}", "ʱ���޴�" } };
            string tagdata = "@�豸��ַ=" + addrst;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow drtime = tab.Rows[i];
                for (int c = 0; c < colmap.GetLength(0); c++)
                {
                    string val = "0";
                    if (DBNull.Value != drtime[colmap[c, 1]])
                        val = Convert.ToString(drtime[colmap[c, 1]]);
                    tagdata = basefun.setvaltag(tagdata, colmap[c, 0], val);
                }
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                if (!success) return false;
            }
            cmd = "����ʱ��";
            colmap = new string[,]{ { "{����}", "�������" }, 
                                { "{ʱ��1}", "����" }, { "{ʱ��2}", "���" }, { "{ʱ��3}", "���" }, { "{ʱ��4}", "�����" }, 
                                { "{ʱ��5}", "���" }, { "{ʱ��6}", "ҹ��" },{ "{ʱ��7}", "�Ӳ�1" }, { "{ʱ��8}", "�Ӳ�2" },
                                { "{�����޶�}", "ÿ���޶�" }, { "{��������}", "ÿ���޴�" } };
            tagdata = "@�豸��ַ=" + addrst;
            Monitor.Enter(query);
            tab = this.query.getTable("������ʱ��", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow drtime = tab.Rows[i];
                for (int c = 0; c < colmap.GetLength(0); c++)
                {
                    string val = "0";
                    if (DBNull.Value != drtime[colmap[c, 1]])
                        val = Convert.ToString(drtime[colmap[c, 1]]);
                    tagdata = basefun.setvaltag(tagdata, colmap[c, 0], val);
                }
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                if (!success) return false;
            }
            return true;
        }

        /// <summary>
        /// ���ؿ��Ʋ���
        /// </summary>
        /// <param name="arg"></param>
        /// <returns></returns>
        private bool downeateryctrlpm(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            bool success = false;
            //��ղ˵�
            string tpl = "����", cmd = "������Ѳ���";
            string tagdata = "@�豸��ַ=" + addrst;
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
            //if (!success) return false;
            //���ؿ��Ʋ���
            Monitor.Enter(query);
            DataTable tab = this.query.getTable("���ѿ��Ʋ���", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tab || tab.Rows.Count < 1)
                return false;
            DataRow drctrl = tab.Rows[0];
            string[,] colmap ={ { "{ͨ������}", "ͨѶ����" }, { "{ϵͳ����}", "ϵͳ����" }, { "{�û�����}", "�û�����" }, { "{��Ƭ����}", "��Ƭ����" },
                    { "{��¼����}", "�ռ�澯" }, { "{����������}", "����������" }, { "{ȡ����������}", "ȡ����������" },
                    { "{���������޶�}", "�����޶�" }, { "{��������}", "���޶�" }, { "{������ʱ}", "������ʱ" }, { "{��ʾ��ʱ}", "��ʾ��ʱ" }, 
                    { "{��������}.{��¼�����������}", "�������" }, { "{��������}.{ʱ������}", "ʱ������" }, { "{��������}.{����Աƾ��ȡ���ϱʽ���}", "ƾ��ȡ������" },
                    { "{��������}.{����Աֱ��ȡ���ϱʽ���}", "ֱ��ȡ������" }, { "{��������}.{���������ò���}", "�����ò���" }, 
                    { "{��������}.{��Ȩ���ɳ�ʼ���豸}", "�ɳ�ʼ��" }, 
                    { "{���ѿ���}.{����ֱ�ӿ۷�}", "����ֱ�ӿ۷�" }, { "{���ѿ���}.{��������}", "��������" }, { "{���ѿ���}.{��ӡ��¼}", "��ӡ��¼" }, 
                    { "{���ѿ���}.{���ֽ�����}", "���ֽ�����" }, { "{���ѿ���}.{����������}", "����������" }, { "{���ѿ���}.{�ɳ���}", "�ɳ���" }, 
                    { "{���ѿ���}.{ƾ������}", "ƾ������" }, 
                    { "{�����޶�}", "�����޶�" }, { "{������ʽ}", "������ʽ" }, { "{ʳ�ñ��}", "���" } };
            for (int i = 0; i < colmap.GetLength(0); i++)
                tagdata = basefun.setvaltag(tagdata, colmap[i, 0], Convert.ToString(drctrl[colmap[i, 1]]));
            cmd = "���ÿ��Ʋ���";
            success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
            if (!success) return false;
            //���ز˵�
            tagdata = "@�豸��ַ=" + addrst;
            Monitor.Enter(query);
            tab = this.query.getTable("���Ѽ۸����", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            colmap = new string[,] { { "{����}", "���" }, { "{�۸�}", "�۸�" } };
            cmd = "�������Ѳ���";
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow drmenu = tab.Rows[i];
                for (int c = 0; c < colmap.GetLength(0); c++)
                {
                    string val = Convert.ToString(drmenu[colmap[c, 1]]);
                    tagdata = basefun.setvaltag(tagdata, colmap[c, 0], val);
                }
                success = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                if (!success) return false;
            }
            return true;
        }

        /// <summary>
        /// �����豸�ĺڰ�������,ִ�гɹ�����ºڰ�������������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        private bool downeateryCardList(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
            NameValueCollection data = new NameValueCollection();
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            //ͬ��ͨѶ�ȴ�ʱ��15��
            bool success = true;
            Monitor.Enter(query);
            DataTable tab = this.query.getTable("����������", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            string tpl = "����", cmd = "ɾ��������";
            string tagdata = "@�豸��ַ=" + addrst;
            if (string.IsNullOrEmpty(attrcmd) || attrcmd.IndexOf("|ɾ��������|") > -1)
                for (int i = 0; i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    tagdata = basefun.setvaltag(tagdata, "{����}", Convert.ToString(dr["����"]));
                    bool rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                    success = success && rtn;
                    if (!rtn)
                    {
                        if (!testConnect(target, dest))
                        {
                            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                            return false;
                        }
                        continue;
                    }
                    ps["״̬"] = "��";
                    ps["����"] = Convert.ToString(dr["����"]);
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            Monitor.Enter(query);
            tab = this.query.getTable("���Ѻ�����", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            cmd = "���غ�����";
            if (string.IsNullOrEmpty(attrcmd) || attrcmd.IndexOf("|���غ�����|") > -1)
                for (int i = 0; i < tab.Rows.Count; i++)
                {
                    DataRow dr = tab.Rows[i];
                    tagdata = basefun.setvaltag(tagdata, "{����}", Convert.ToString(dr["����"]));
                    bool rtn = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tagdata);
                    success = success && rtn;
                    if (!rtn)
                    {
                        if (!testConnect(target, dest))
                        {
                            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
                            return false;
                        }
                        continue;
                    }
                    ps["״̬"] = "��";
                    ps["����"] = Convert.ToString(dr["����"]);
                    Monitor.Enter(query);
                    this.query.ExecuteNonQuery("�������ر�־����", ps, ps, ps);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                }
            CommiManager.GlobalManager.RemoveCommand(dest, cmdP);
            return success;
        }
        /// <summary>
        /// ���ղ�����û�����صĲ���,��ղ�����,�ϲ���δ���ز���һ������
        /// </summary>
        /// <param name="arg">����ָ�����</param>
        /// <returns></returns>
        private bool downeaterySubsidy(TransArg arg)
        {
            CmdFileTrans trans = arg.trans;
            CommiTarget target = arg.target;
            IPAddress proxy = arg.proxy;
            CommiTarget dest = arg.dest;
            string devID = arg.devID;
            string addrst = arg.addrst;
            string attrcmd = arg.attrCmdtag;

            if (null == trans || null == proxy || null == dest || string.IsNullOrEmpty(devID) || string.IsNullOrEmpty(addrst))
                return false;
            //�ж��Ƿ����ز���
            if (string.IsNullOrEmpty(attrcmd) || attrcmd.IndexOf("|���ز�������|") < 0)
                return true;
            CommiManager mgr = CommiManager.GlobalManager;
            CmdProtocol cmdP = new CmdProtocol(false);
            this.setTimeout(cmdP);
            NameObjectList ps = new NameObjectList();
            ps["�豸ID"] = devID;
            string tpl = "����", cmd = "ȡ��ǰ������¼";
            string tag = "@�豸��ַ=" + addrst;
            //������ȡ������¼
            string msg = this.getResponse(target, trans, proxy, dest, cmdP, tpl, cmd, tag);
            if (string.IsNullOrEmpty(msg))
                return false;
            string cardnum = basefun.valtag(msg, "{����}");
            cmd = "ȡ��һ��������¼";
            string rsl = basefun.valtag(msg, "Success");
            while ("false" == rsl || (!string.IsNullOrEmpty(cardnum) && "16777215" != cardnum && "0" != cardnum))
            {
                NameObjectList pm = createParam(msg);
                if ("true" == rsl)
                {
                    Monitor.Enter(query);
                    bool rtn = this.query.ExecuteNonQuery("���ѽ��ղ���", pm, pm, pm);
                    Monitor.PulseAll(query);
                    Monitor.Exit(query);
                    if (!rtn) return false;
                }
                msg = this.getResponse(target, trans, proxy, dest, cmdP, tpl, cmd, tag);
                cardnum = basefun.valtag(msg, "{����}");
                rsl = basefun.valtag(msg, "Success");
            }
            //��ȡû�н��յĲ�����¼�����պϲ���������¼
            Monitor.Enter(query);
            DataTable tab = this.query.getTable("���ѻ��ղ���", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            if (null == tab) return false;
            cmd = "��ѯ�û��������";
            string[,] cols = { { "����", "{�û����}" }, { "��Ƭ���к�", "{��Ƭ�������}" } };
            string[,] pn = { { "����", "{�û����}" }, { "��Ƭ���к�", "{��Ƭ�������}" }, { "�������", "{�������}" }, { "����״̬", "{����״̬}" } };
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                for (int c = 0; c < cols.GetLength(0); c++)
                    tag = basefun.setvaltag(tag, cols[c, 1], Convert.ToString(dr[cols[c, 0]]));
                msg = this.getResponse(target, trans, proxy, dest, cmdP, tpl, cmd, tag);
                if (string.IsNullOrEmpty(msg))
                {
                    if (!testConnect(target, dest))
                        return false;
                }
                if ("true" != basefun.valtag(msg, "Success"))
                    continue;
                NameObjectList pm = new NameObjectList();
                for (int p = 0; p < pn.GetLength(0); p++)
                    pm[pn[p, 0]] = basefun.valtag(msg, pn[p, 1]);
                Monitor.Enter(query);
                this.query.ExecuteNonQuery("���ѻ��ղ���", pm, pm, pm);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
            }
            Monitor.Enter(query);
            tab = this.query.getTable("�������ز���", ps);
            Monitor.PulseAll(query);
            Monitor.Exit(query);
            cmd = "���ز�������";
            tag = "@�豸��ַ=" + addrst;
            cols = new string[,] { { "����", "{�û����}" }, { "��Ƭ���к�", "{��Ƭ�������}" }, { "������ֵ", "{�������}" } };
            bool success = true;
            for (int i = 0; i < tab.Rows.Count; i++)
            {
                DataRow dr = tab.Rows[i];
                for (int c = 0; c < cols.GetLength(0); c++)
                    tag = basefun.setvaltag(tag, cols[c, 1], Convert.ToString(dr[cols[c, 0]]));
                bool suc = this.sendCommand(target, trans, proxy, dest, cmdP, tpl, cmd, tag);
                success = success && suc;
                if (!suc)
                {
                    if (!testConnect(target, dest))
                        return false;
                    continue;
                }
                ps["����"] = Convert.ToString(dr["����"]);
                Monitor.Enter(query);
                suc = this.query.ExecuteNonQuery("�������ز���", ps, ps, ps);
                Monitor.PulseAll(query);
                Monitor.Exit(query);
                if (!suc) return false;
            }
            return success;
        }
        #endregion

        /// <summary>
        /// ����ָ�ʱ����
        /// </summary>
        /// <param name="cmd">ָ��ʵ��</param>
        private void setTimeout(CommandBase cmd)
        {
            if (null == cmd)
                return;
            string inv = DataAccRes.AppSettings("commiTimeout");
            if (string.IsNullOrEmpty(inv))
                return;
            int timeout = 200;
            try
            {
                timeout = Convert.ToInt16(inv);
            }
            catch { return; }
            cmd.TimeOut = new TimeSpan(timeout * 10000);
            cmd.TimeLimit = new TimeSpan(4 * timeout * 10000);
            cmd.TimeFailLimit = cmd.TimeLimit;
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

        private static Regex regex = new Regex(@"@([\u4E00-\u9FA5\s\w\{\}]+)=", RegexOptions.Compiled);
        /// <summary>
        /// ����tag��Ǵ�������
        /// </summary>
        /// <param name="tag">����������tag���</param>
        /// <returns>�����½����Ĳ���</returns>
        public static NameObjectList createParam(string tag)
        {
            MatchCollection matchs = regex.Matches(tag);
            NameObjectList ps = new NameObjectList();
            foreach (Match m in matchs)
            {
                string key = m.Groups[1].Value;
                string k = key;
                if (key.StartsWith("{") && key.EndsWith("}"))
                    k = key.Substring(1, key.Length - 2);
                ps[k] = basefun.valtag(tag, key);
            }
            return ps;
        }

    }
}
