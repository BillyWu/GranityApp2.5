using System;
using System.Collections.Generic;
using System.Text;
using System.Collections.Specialized;
using Granity.CardOneCommi;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using Granity.communications;
using System.Data;
using Granity.winTools;
using System.Diagnostics;
using System.Threading;

namespace Granity.commiServer
{
    /// <summary>
    /// �Ž��豸
    /// </summary>
    public class DeviceDoor : DeviceBase
    {
        /// <summary>
        /// ���Ѽ�ص�Ԫ
        /// </summary>
        private static UnitItem unitItem = null;
        private static object objquery = new object();
        /// <summary>
        /// ���ݲ���
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// ���û���Ϣ
        /// </summary>
        private QueryDataRes qyemp = null;
        /// <summary>
        /// �ɼ�����
        /// </summary>
        private static QueryDataRes qydata = null;
        /// <summary>
        /// ��¼λ��
        /// </summary>
        private int posRecord = 0;
        /// <summary>
        /// �豸���ͣ����ڻ�������˫��˫��˫�����ŵ���
        /// </summary>
        private string devtype = "���ڻ�";
        /// <summary>
        /// �ɼ�ָ��
        /// </summary>
        private CmdProtocol cmdGather = null;
        /// <summary>
        /// ���ݲɼ���ʱָ��
        /// </summary>
        private CmdProtocol cmdtemp = null;
        /// <summary>
        /// ��ǰ�Ƿ�����ͨѶִ��
        /// </summary>
        private bool isexecuting = false;
        /// <summary>
        /// ͬ���ȴ�ʱ��,Ĭ��500������Ϊ��ʱʧ��
        /// </summary>
        private TimeSpan waitTime = new TimeSpan(0, 0, 0, 0, 500);
        /// <summary>
        /// �ɼ�����,Ĭ��Ѳ������2��
        /// </summary>
        private TimeSpan tsinv = new TimeSpan(0, 0, 2);
        /// <summary>
        /// �ж��Ƿ�æ״̬��ʱ����,Ĭ��2�����ڼ�¼��������60��,��Ϊ���ڷ�æ״̬
        /// </summary>
        private TimeSpan tsbusy = new TimeSpan(0, 2, 0);
        /// <summary>
        /// ͨѶ���ӻָ���ʱ��Ĭ��0���ȴ��ָ�����
        /// </summary>
        private int cnnout = 0;
        /// <summary>
        /// ͨѶ���ӻָ���ʱ��Ĭ��0���ȴ��ָ�����
        /// </summary>
        private static int CNtimeout = 0;
        /// <summary>
        /// ��ǰѲ��״̬
        /// </summary>
        private NameValueCollection tagInfos = new NameValueCollection();
        /// <summary>
        /// �Ž��豸
        /// </summary>
        public DeviceDoor()
            : base()
        {
            if (null == unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "�Ž����");
            this.query = new QueryDataRes(unitItem.DataSrcFile);
            this.qyemp = new QueryDataRes(unitItem.DataSrcFile);
            if (null == qydata)
                qydata = new QueryDataRes(unitItem.DataSrcFile);
            //����Ĭ�ϳ�ʱʱ��
            string tmout = DataAccRes.AppSettings("commiTimeout");
            string icn = DataAccRes.AppSettings("commiCnnout");
            string tminv = DataAccRes.AppSettings("commiSecondeInv");
            if (!string.IsNullOrEmpty(tmout))
            {
                try
                {
                    int timeout = Convert.ToInt16(tmout);
                    this.waitTime = new TimeSpan(0, 0, 0, 0, timeout / 10 * 35);
                }
                catch { }
            }
            if (!string.IsNullOrEmpty(icn))
            {
                try
                {
                    this.cnnout = Convert.ToInt32(icn);
                    CNtimeout = this.cnnout;
                }
                catch { }
            }
            if (!string.IsNullOrEmpty(tminv))
            {
                try
                {
                    int inv = 2;
                    int.TryParse(tminv, out inv);
                    int mi = inv / 60;
                    if (inv > 60) inv = inv % 60;
                    this.tsinv = new TimeSpan(0, 0, mi, inv);
                    this.tsbusy = new TimeSpan(60 * tsinv.Ticks);
                }
                catch { }
            }
        }
        /// <summary>
        /// ����ͨѶ�豸
        /// </summary>
        /// <param name="devid">�豸ID</param>
        /// <param name="target">ͨѶĿ��</param>
        /// <param name="station">վַ</param>
        public override void SetDevice(CommiManager mgr, CommiTarget target, string devid, int station)
        {
            if (null == mgr || string.IsNullOrEmpty(devid) || null == target || station < 1)
                return;
            this.commimgr = mgr;
            this.target = target;
            this.devid = devid;
            this.station = station;
            NameObjectList ps = new NameObjectList();
            ps["����ID"] = devid;
            DataTable tab = null;
            try
            {
                Monitor.Enter(objquery);
                tab = this.query.getTable("�Ž��豸", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (null == tab || tab.Rows.Count < 1)
                return;
            object val = tab.Rows[0]["��¼λ��"];
            if (null == val || DBNull.Value == val || string.IsNullOrEmpty(Convert.ToString(val)))
                val = tab.Rows[0]["��¼λ��"] = 1;
            this.posRecord = Convert.ToInt32(val);
            val = tab.Rows[0]["����������"];
            this.devtype = Convert.ToString(val);
            if (string.IsNullOrEmpty(this.devtype))
                this.devtype = "���ڻ�";
        }
        /// <summary>
        /// �����ɼ�
        /// </summary>
        public override void StartGather()
        {
            Debug.WriteLine("111111"); ;
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return;
            if (null != cmdGather)
                return;
            CmdProtocol cmdg = new CmdProtocol(false);
            setTimeout(cmdg);
            cmdg.TimeLimit = TimeSpan.MaxValue;
            cmdg.TimeFailLimit = TimeSpan.MaxValue;
            cmdg.FailProAf = FailAftPro.Ignor;
            cmdg.TimeSendInv = this.tsinv;
            cmdg.IsResposeHandle = isResponse;

            this.tagInfos.Clear();
            NameObjectList ps = new NameObjectList();
            ps["������"] = this.devid;

            Debug.WriteLine("ddddd" + cmdg);
            DataTable tab = null;
            try
            {
                Monitor.Enter(objquery);
                tab = this.query.getTable("�Ž�״̬", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            foreach (DataRow dr in tab.Rows)
            {
                if (null == dr || DBNull.Value == dr["���"])
                    continue;
                this.tagInfos.Add(Convert.ToString(dr["���"]), Convert.ToString(dr["����"]));
            }
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);


            cmdg.setCommand("�Ž�", "���״̬", tag);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(cmdGather_ResponseHandle);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
            this.commimgr.SendCommand(this.target, cmdg);
            cmdGather = cmdg;

            Debug.WriteLine("sssss" + cmdg);
        }
        /// <summary>
        /// ��ȷ��Ѳ����ִ��
        /// </summary>
        public override void ReStartGather()
        {
            if (null == cmdGather)
            {
                StartGather();
                return;
            }
            reChecking(0);
            reChecking(1);
        }
        /// <summary>
        /// �Ƿ�ǰָ��Ľ��,��֤�豸ID��ָ��
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        private static bool isResponse(CommandBase cmd, byte[] response)
        {
            if (null == response || response.Length < 2)
                return false;
            byte[] bcmd = cmd.getCommand();
            if (null == bcmd || bcmd.Length < 2)
                return false;
            for (int i = 0; i < 5; i++)
                if (bcmd[i] != response[i])
                    return false;
            return true;
        }

        /// <summary>
        /// Ѳ��״̬:0/�ɼ���¼(��ͣѲ��),1/Ѳ��
        /// </summary>
        private int stateChecking = 1;
        /// <summary>
        /// �л�Ѳ��״̬��0/�ɼ���¼(��ͣѲ��),1/Ѳ��
        /// </summary>
        /// <param name="stateChk">Ѳ������</param>
        private void reChecking(int stateChk)
        {
            CmdProtocol cmd = this.cmdGather;
            if (null == cmd)
                return;
            CmdState st = cmd.CheckState();
            cmd.TimeSendInv = new TimeSpan(24, 0, 0);
            cmd.TimeLimit = new TimeSpan(4 * cmd.TimeOut.Ticks);
            cmd.TimeFailLimit = cmd.TimeLimit;
            if (CmdState.Response == st || CmdState.Request == st || CmdState.ReqTimeout == st)
            {
                cmd.EventWh.Reset();
                cmd.EventWh.WaitOne(cmd.TimeOut, false);
            }
            this.commimgr.ClearBuffer(this.target);
            this.stateChecking = stateChk;
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            if (1 == stateChk)
                cmd.setCommand("�Ž�", "���״̬", tag);
            else
                cmd.setCommand(new byte[0]);
            if (0 < stateChk)
            {
                cmd.TimeSendInv = this.tsinv;
                cmd.TimeLimit = TimeSpan.MaxValue;
                cmd.TimeFailLimit = TimeSpan.MaxValue;
                cmd.FailProAf = FailAftPro.Ignor;
                cmd.TimeSendInv = this.tsinv;
                cmd.IsResposeHandle = isResponse;
                this.commimgr.SendCommand(this.target, cmd);
            }
            Debug.WriteLine("Ѳ������:" + stateChk);
        }

        private static byte[] btcmd = new byte[] { 0x81, 0x10 };

        private string cardnumprev = "";
        private string strdateprev = "";
        /// <summary>
        /// Ѳ����Ӧ,����ʧ��5����(tsbusy)����Ϊͣ��,���tsbusyѲ��
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void cmdGather_ResponseHandle(object sender, ResponseEventArgs e)
        {
            if (null == sender || null == e || null == e.Response || e.Response.Length < 5)
                return;
            CmdProtocol cmdP = sender as CmdProtocol;
            if (null == cmdP || 0 == this.stateChecking)
                return;
            if (btcmd[0] != e.Response[3] || btcmd[1] != e.Response[4])
                return;
            if (!e.Success)
            {
                //������ʱ��ʧ��ʱ������Ѳ������
                if (cmdP.TimeSendInv < this.tsbusy && DateTime.Now - cmdP.ResponseDatetime > this.tsbusy)
                {
                    if (cmdP.TimeSendInv < this.tsbusy)
                        cmdP.TimeSendInv = this.tsbusy.Add(this.tsinv);
                }
                return;
            }
            string msg = cmdP.ResponseFormat;
            if (string.IsNullOrEmpty(msg) || "true" != basefun.valtag(msg, "Success"))
                return;
            //�����¼�
            if ("���ڻ�" != this.devtype)
            {
                string cardnum = basefun.valtag(msg, "{ˢ������}");
                string strdate = basefun.valtag(msg, "{ˢ��ʱ��}");
                if (cardnum != cardnumprev || strdate != strdateprev)
                {
                    if ("0001-1-1 00:00:00" != strdate && "16777215" != cardnum && "0" != cardnum && !string.IsNullOrEmpty(cardnum))
                    {
                        string msginfo = basefun.setvaltag("", "{����}", cardnum);
                        string[] cols ={ "{ˢ��ʱ��}", "״̬���", "������" };
                        for (int i = 0; i < cols.Length; i++)
                            msginfo = basefun.setvaltag(msginfo, cols[i], basefun.valtag(msg, cols[i]));
                        writeRecord(msginfo, true);
                    }
                    cardnumprev = cardnum;
                    strdateprev = strdate;
                }
            }
            //���ߺ�ָ�����ʱ���ָ�Ѳ������
            if (cmdP.TimeSendInv > this.tsbusy)
                cmdP.TimeSendInv = this.tsinv;
            msg = this.validateSate(msg);
            string sumstr = basefun.valtag(msg, "{ˢ����¼��}");
            if (string.IsNullOrEmpty(sumstr))
                return;
            int sum = -1;
            int.TryParse(sumstr, out sum);
            if (sum < 1) return;

            if ("���ڻ�" != this.devtype)
                return;
            //���ü�¼λ��
            if (this.posRecord > sum + 10)
            {
                this.posRecord = 0;
                NameObjectList posps = new NameObjectList();
                posps["������"] = this.devid;
                try
                {
                    Monitor.Enter(objquery);
                    this.query.ExecuteNonQuery("���ü�¼λ��", posps, posps, posps);
                }
                finally
                {
                    Monitor.PulseAll(objquery);
                    Monitor.Exit(objquery);
                }
            }
            //û���¼�¼
            if (sum < this.posRecord)
                return;

            //����ɼ�����
            Monitor.Enter(dvQueue);
            if (!dvQueue.Contains(this))
                dvQueue.Enqueue(this);
            Monitor.PulseAll(dvQueue);
            Monitor.Exit(dvQueue);
            hdlWh.Set();
            if (dtRunHdl < DateTime.Now.AddSeconds(-30))
                ThreadManager.QueueUserWorkItem(gatherData, null);
        }
        private static DateTime dtRunHdl = DateTime.MinValue;
        private static Queue<DeviceDoor> dvQueue = new Queue<DeviceDoor>();
        private static ManualResetEvent hdlWh = new ManualResetEvent(false);
        private static void gatherData(object obj)
        {
            dtRunHdl = DateTime.Now;
            while (true)
            {
                hdlWh.Reset();
                for (int i = 0; i < 200; i++)
                {
                    if (dvQueue.Count > 0)
                        break;
                    dtRunHdl = DateTime.Now;
                    hdlWh.WaitOne(20);
                }
                if (dvQueue.Count < 1)
                {
                    dtRunHdl = DateTime.MinValue;
                    break;
                }
                DeviceDoor door = null;
                Monitor.Enter(dvQueue);
                try { door = dvQueue.Dequeue(); }
                catch { }
                Monitor.PulseAll(dvQueue);
                Monitor.Exit(dvQueue);
                if (null == door)
                    continue;
                //�ɼ���¼
                if (null != door.cmdGather)
                    door.cmdGather.TimeSendInv = door.tsbusy.Add(door.tsinv);
                else
                    door.reChecking(0);
                CmdProtocol cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
                cmdP.TimeLimit = TimeSpan.MaxValue;
                cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(door.execResponse);
                cmdP.IsResposeHandle = isResponse;
                string tag = "@�豸��ַ=" + Convert.ToString(door.station);
                NameValueCollection datainfo = new NameValueCollection();
                string msgprev = "";
                for (int i = 0; i < 200; i++)
                {
                    tag = basefun.setvaltag(tag, "{��¼����}", Convert.ToString(door.posRecord));
                    string msg = door.getResponse(door.commimgr, door.target, cmdP, "��ȡ��¼", tag, door.waitTime);
                    if (string.IsNullOrEmpty(msg))
                        continue;
                    if (string.IsNullOrEmpty(msgprev))
                        msgprev = msg;
                    string cardnum = basefun.valtag(msg, "{����}");
                    string suc = basefun.valtag(msg, "Success");
                    if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
                    {
                        //bool isend = door.IsEndReadDevice(-1);
                        //��¼����ʱ������־��������һ��
                        if ("false" == suc)
                        {
                            door.posRecord++;
                            datainfo["����"] = "��ȡ��¼ʧ��";
                            datainfo["����"] = CommandBase.Parse(cmdP.ResponseData, true);
                            ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                        }
                        //if (isend && door.posRecord > 20000)
                        //    door.ClearRecord();
                        //if (isend)  break;
                        if (door.posRecord > 20000)
                        {
                            bool isend = door.IsEndReadDevice(-1);
                            if (isend) door.ClearRecord();
                        }
                        break;
                    }
                    msgprev = msg;
                    if ("���ڻ�" == door.devtype)
                        door.writeRecord(msg, true);
                    door.posRecord++;
                }
                //�Ž��豸ֻ�������һ����¼
                if (string.IsNullOrEmpty(msgprev) && "���ڻ�" != door.devtype)
                    door.writeRecord(msgprev, false);
                door.commimgr.RemoveCommand(door.target, cmdP);
                if (null != door.cmdGather)
                    door.cmdGather.TimeSendInv = door.tsinv;
                else
                    door.reChecking(1);
            }
        }
        public static void ResetQueue()
        {
            Monitor.Enter(dvQueue);
            dvQueue.Clear();
            Monitor.PulseAll(dvQueue);
            Monitor.Exit(dvQueue);
            dtRunHdl = DateTime.MinValue;
        }
        /// <summary>
        /// ֹͣ�ɼ�
        /// </summary>
        public override void StopGather()
        {
            if (null == this.commimgr)
                return;
            this.commimgr.RemoveCommand(this.target, this.cmdGather);
            this.cmdGather = null;
        }

        /// <summary>
        /// ��֤״̬��Ϣ,��״̬�Աȱ仯ʱ�����¼���¼
        /// </summary>
        /// <param name="item">Ѳ����</param>
        /// <param name="devid">������ID</param>
        /// <param name="taginfo">״̬��Ϣtag���ֵ</param>
        private string validateSate(string taginfo)
        {
            if (string.IsNullOrEmpty(taginfo))
                return taginfo;
            Dictionary<string, string[]> dictstate = new Dictionary<string, string[]>();
            string[] alarm ={ "4���ű���", "3���ű���", "2���ű���", "1���ű���" };
            dictstate.Add("����", alarm);
            alarm = new string[] { "��", "��Чˢ��", "��������", "�Ƿ�����", "��ʱ", "в��" };
            dictstate.Add("����", alarm);
            alarm = new string[] { "оƬ����", "ϵͳ����4", "ʱ�ӹ���", "ϵͳ����2", "ϵͳ����1" };
            dictstate.Add("����", alarm);
            alarm = new string[] { "��ť4״̬", "��ť3״̬", "��ť2״̬", "��ť1״̬" };
            dictstate.Add("��ť", alarm);
            alarm = new string[] { "�Ŵ�4״̬", "�Ŵ�3״̬", "�Ŵ�2״̬", "�Ŵ�1״̬" };
            dictstate.Add("�Ŵ�", alarm);
            alarm = new string[] { "��4״̬", "��3״̬", "��2״̬", "��1״̬" };
            dictstate.Add("�̵���", alarm);
            //�𾯱�����WG����ʹ�û��¼���¼����ӳ��
            string strstate = this.getStateDoorCard(basefun.valtag(taginfo, "{ˢ������}"),
                                    basefun.valtag(taginfo, "״̬���"), basefun.valtag(taginfo, "������"));
            if ("�𾯱���" == strstate)
            {
                taginfo = basefun.setvaltag(taginfo, "��", "1");
                foreach (string k in dictstate["����"])
                    taginfo = basefun.setvaltag(taginfo, k, "1");
            }
            //���ǰ��״̬�ı䣻alarmmsg������Ϣ,isalarm��ǰ�Ƿ񱨾��ı�
            string msg = "", alarmmsg = "", msgsigal = "";
            bool isalarm = false;
            NameObjectList psevent = new NameObjectList();
            psevent["������"] = this.devid;
            DateTime dt = DateTime.MinValue;
            try
            {
                psevent["ʱ��"] = dt = Convert.ToDateTime(basefun.valtag(taginfo, "{��ǰʱ��}"));
            }
            catch { dt = DateTime.MinValue; }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                NameValueCollection datainfo = new NameValueCollection();
                datainfo["����"] = "Ѳ��״̬";
                ServiceTool.LogMessage(taginfo, datainfo, EventLogEntryType.FailureAudit);
                if (null == dtobj) return taginfo;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return taginfo; }
                if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
                    return taginfo;
                psevent["ʱ��"] = dtobj;
            }
            else
                dtobj = psevent["ʱ��"];
            alarm = new string[] { "����", "����", "����", "��ť", "�Ŵ�", "�̵���" };
            foreach (string state in alarm)
            {
                //�Ա�״̬�����¼�
                psevent["�¼�"] = state;
                string tagorgi = this.tagInfos[state];
                string tagnews = "";
                bool ischanged = false;
                int inum = 5;
                foreach (string st in dictstate[state])
                {
                    inum--;
                    string valorg = basefun.valtag(tagorgi, st);
                    if (string.IsNullOrEmpty(valorg))
                        valorg = "0";
                    string valnew = basefun.valtag(taginfo, st);
                    tagnews = basefun.setvaltag(tagnews, st, valnew);
                    if ("����" == state && "1" == valnew)
                    {
                        if (string.IsNullOrEmpty(alarmmsg))
                            alarmmsg = st;
                        else
                            alarmmsg += "," + st;
                    }
                    if (valorg == valnew && ("����" != state || !isalarm))
                        continue;
                    ischanged = true;
                    if ("����" == state) continue;
                    //�����¼�
                    if ("����" == state || "����" == state)
                    {
                        if ("����" == state)
                        {
                            psevent["���"] = inum.ToString();
                            psevent["����"] = st + "(" + alarmmsg + ")";
                        }
                        else
                        {
                            psevent.Remove("���");
                            psevent["����"] = st;
                        }
                        msg = basefun.setvaltag(msg, st, valnew);
                        try
                        {
                            Monitor.Enter(objquery);
                            if ("1" == valnew)
                                this.query.ExecuteNonQuery("�����Ž��¼�", psevent, psevent, psevent);
                            else
                                this.query.ExecuteNonQuery("�����Ž��¼�", psevent, psevent, psevent);
                        }
                        finally
                        {
                            Monitor.PulseAll(objquery);
                            Monitor.Exit(objquery);
                        }
                    }
                    else
                    {
                        psevent["���"] = inum.ToString();
                        psevent["����"] = st + "��λ " + valnew;
                        msgsigal = basefun.setvaltag(msgsigal, st, valnew);
                        try
                        {
                            Monitor.Enter(objquery);
                            this.query.ExecuteNonQuery("�Ž���λ�¼�", psevent, psevent, psevent);
                        }
                        finally
                        {
                            Monitor.PulseAll(objquery);
                            Monitor.Exit(objquery);
                        }
                    }
                }//foreach (string st in dictstate[state])
                this.tagInfos[state] = tagnews;
                if (!ischanged) continue;
                psevent["���"] = state;
                psevent["����"] = tagnews;
                try
                {
                    Monitor.Enter(objquery);
                    this.query.ExecuteNonQuery("�Ž�Ѳ��״̬", psevent, psevent, psevent);
                }
                finally
                {
                    Monitor.PulseAll(objquery);
                    Monitor.Exit(objquery);
                }
                //�������ݱ仯ʱ,�Ƚ���ԭ�����¼�
                if ("����" == state)
                {
                    isalarm = !string.IsNullOrEmpty(alarmmsg);
                    if (!isalarm)
                    {
                        foreach (string a in dictstate[state])
                            msg = basefun.setvaltag(msg, a, "0");
                    }
                    psevent.Remove("���");
                    try
                    {
                        Monitor.Enter(objquery);
                        this.query.ExecuteNonQuery("�����Ž��¼�", psevent, psevent, psevent);
                    }
                    finally
                    {
                        Monitor.PulseAll(objquery);
                        Monitor.Exit(objquery);
                    }
                }
            }//foreach (string state in alarm)
            if (string.IsNullOrEmpty(this.Alarm.tag))
            {
                this.Alarm.tag = taginfo;
                this.Alarm.dtReceive = DateTime.Now;
            }
            if (string.IsNullOrEmpty(this.Signal.tag))
            {
                this.Signal.tag = taginfo;
                this.Signal.dtReceive = DateTime.Now;
            }
            if (string.IsNullOrEmpty(msg) && string.IsNullOrEmpty(msgsigal))
                return taginfo;
            if (!string.IsNullOrEmpty(msg))
            {
                alarm = alarmmsg.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                foreach (string a in alarm)
                    msg = basefun.setvaltag(msg, a, "1");
                this.Alarm.dtReceive = DateTime.Now;
                this.Alarm.tag = taginfo;
                this.Signal.tag = taginfo;
                DvAlarmEventArgs arg = new DvAlarmEventArgs(this.devid, this.station, dt, taginfo);
                arg.TagAlarm = msg;
                this.RaiseAlarm(arg);
            }
            if (!string.IsNullOrEmpty(msgsigal))
            {
                this.Signal.dtReceive = DateTime.Now;
                this.Signal.tag = taginfo;
                this.Alarm.tag = taginfo;
                DvSignalEventArgs arg = new DvSignalEventArgs(this.devid, this.station, dt, taginfo);
                arg.TagSignal = msgsigal;
                this.RaiseSignal(arg);
            }
            return taginfo;
        }

        /// <summary>
        /// ����ˢ��״̬�������ˢ��״̬
        /// </summary>
        /// <param name="statecode">ˢ��״̬����</param>
        /// <returns>����ˢ��״̬</returns>
        private string getStateDoorCard(string cardnum, string statecode, string idxdoor)
        {
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " �𾯣�" + cardnum + "  " + statecode + "  " + idxdoor);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " �𾯣�" + cardnum + "  " + statecode + "  " + idxdoor);
            if ("4" == cardnum && "10" == statecode && "0" == idxdoor)
                return "�𾯱���";
            switch (statecode)
            {
                case "8": statecode = "��ֹͨ��,ԭ����"; break;
                case "9": statecode = "��ֹͨ��,û��Ȩ��"; break;
                case "10": statecode = "��ֹͨ��,���벻��"; break;
                case "11": statecode = "��ֹͨ��,ϵͳ����"; break;
                case "12": statecode = "��ֹͨ��,��Ǳ��,�࿨���Ż���"; break;
                case "13": statecode = "��ֹͨ��,�ų���"; break;
                case "14": statecode = "��ֹͨ��,������Чʱ�λ򿨹���"; break;
                default: statecode = "��������"; break;
            }
            return statecode;
        }

        /// <summary>
        /// д���¼
        /// </summary>
        /// <param name="tagmsg">tag��ʽ��Ϣ��{����}��״̬��ţ��������ţ�{ˢ��ʱ��}</param>
        /// <param name="isevent">�Ƿ񴥷��¼�</param>
        private string writeRecord(string tagmsg, bool isevent)
        {
            string cardnum = basefun.valtag(tagmsg, "{����}");
            string suc = basefun.valtag(tagmsg, "Success");
            // if ("true" != suc || "16777215" == cardnum || "0" == cardnum || string.IsNullOrEmpty(cardnum))
            if ("16777215" == cardnum || "0" == cardnum || string.IsNullOrEmpty(cardnum))
                return tagmsg;
            NameObjectList ps = new NameObjectList();
            ps["����"] = cardnum;
            DataTable tabuser = null;
            try
            {
                Monitor.Enter(objquery);
                tabuser = this.qyemp.getTable("���û���Ϣ", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (null != tabuser && tabuser.Rows.Count > 0)
            {
                DataRow dr = tabuser.Rows[0];
                tagmsg = basefun.setvaltag(tagmsg, "{����ID}", Convert.ToString(dr["����ID"]));
                tagmsg = basefun.setvaltag(tagmsg, "{���Ŵ���}", Convert.ToString(dr["���Ŵ���"]));
                tagmsg = basefun.setvaltag(tagmsg, "{����}", Convert.ToString(dr["����"]));
                tagmsg = basefun.setvaltag(tagmsg, "{����}", Convert.ToString(dr["����"]));
            }
            string info = "";
            string[] cols ={ "{����}", "{����}", "{����ID}", "{���Ŵ���}", "{����}", "״̬���", "������", "{ˢ��ʱ��}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(tagmsg, cols[c]));
            string strstate = this.getStateDoorCard(cardnum, basefun.valtag(info, "״̬���"), basefun.valtag(info, "������"));
            tagmsg = basefun.setvaltag(tagmsg, "״̬", strstate);
            info = basefun.setvaltag(info, "״̬", strstate);
            ps = ParamManager.createParam(info);
            ps["������"] = this.devid;
            ps["ʱ��"] = ps["ˢ��ʱ��"] = DateTime.MinValue;
            DateTime dt = DateTime.MinValue;
            try
            {
                string dtstr = basefun.valtag(tagmsg, "{ˢ��ʱ��}");
                if (!string.IsNullOrEmpty(dtstr) && "0001-1-1 0:00:00" != dtstr)
                    ps["ʱ��"] = ps["ˢ��ʱ��"] = dt = Convert.ToDateTime(dtstr);
            }
            catch { dt = DateTime.MinValue; }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                if (null == dtobj) return tagmsg;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { ServiceTool.LogMessage(info, null, EventLogEntryType.Warning); return tagmsg; }
                if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
                {
                    ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
                    return tagmsg;
                }
                ps["ʱ��"] = ps["ˢ��ʱ��"] = dtobj;
            }
            else
                dtobj = ps["ʱ��"];
            bool success = false;
            try
            {
                Monitor.Enter(objquery);
                success = qydata.ExecuteNonQuery("�ɼ��Ž�����", ps, ps, ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (!success)
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
            if (isevent)
            {
                this.AddRecord(info);
                DvRecordEventArgs arg = new DvRecordEventArgs(this.devid, this.station, dt, info);
                this.RaiseRecord(arg);
            }
            return tagmsg;
        }

        object dtobj = null;
        /// <summary>
        /// ֱ�Ӳɼ�һ������,���Զ��������ݿ�,���ػ�ȡ���ݵļ�¼
        /// û�м�¼ʱ�ָ�Ѳ��
        /// </summary>
        /// <param name="isfirst">�Ƿ��״���ȡ,�״λᲹ��ɼ���ǰ��¼�Է�©��</param>
        public override string GatherData(bool isfirst)
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return "";
            CmdProtocol cmdP = this.cmdtemp;
            if (null == cmdP)
            {
                cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
                cmdP.IsResposeHandle = isResponse;
                this.cmdtemp = cmdP;
            }
            this.reChecking(0);
            cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            tag = basefun.setvaltag(tag, "{��¼����}", Convert.ToString(this.posRecord));
            string msg = getResponse(this.commimgr, this.target, cmdP, "��ȡ��¼", tag, this.waitTime);
            if (string.IsNullOrEmpty(msg))
                return msg;
            string cardnum = basefun.valtag(msg, "{����}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
            {
                //��¼�ɼ���ϣ��Ҵ���2w����ռ�¼
                bool isend = this.IsEndReadDevice(-1);
                //��¼����ʱ������־��������һ��
                if ("false" == suc)
                {
                    this.posRecord++;
                    NameValueCollection datainfo = new NameValueCollection();
                    datainfo["����"] = "��ȡ��¼";
                    datainfo["����"] = CommandBase.Parse(cmdP.ResponseData, true);
                    ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                    return msg;
                }
                if (!isend)
                    this.posRecord++;
                else
                {
                    if (this.posRecord > 20000)
                        this.ClearRecord();
                    this.reChecking(1);
                }
                return msg;
            }
            msg = writeRecord(msg, true);
            this.posRecord++;
            return msg;
        }

        /// <summary>
        /// �ڵ�ǰû��ִ��ָ����Ӧʱ������Ӧ�¼���������
        /// </summary>
        /// <param name="sender">�¼�ָ��ʵ��</param>
        /// <param name="e"></param>
        private void execResponse(object sender, ResponseEventArgs e)
        {
            if (null == sender || null == e || !e.Success)
                return;
            CmdProtocol cmdP = sender as CmdProtocol;
            if (null == cmdP || 0 == this.stateChecking || this.isexecuting)
                return;
            string msg = cmdP.ResponseFormat;
            string suc = basefun.valtag(msg, "Success");
            string cardnum = basefun.valtag(msg, "{����}");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
                return;
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ִ�У�" + msg);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ִ�У�" + msg);
            msg = writeRecord(msg, true);
            this.posRecord++;
        }

        /// <summary>
        /// ָ�������ţ��Ƿ񵽴��β
        /// </summary>
        /// <param name="index">ָ����¼�����ţ�-1ʱ�жϵ�ǰ��¼λ��</param>
        /// <returns>�����Ƿ��ȡ���豸��β��ͨѶʧ�ܷ���true</returns>
        public override bool IsEndReadDevice(int index)
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return true;
            if (index < 1) index = this.posRecord;
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            string msg = getResponse(this.commimgr, this.target, cmdP, "���״̬", tag, this.waitTime);
            string strcount = basefun.valtag(msg, "{ˢ����¼��}");
            if (string.IsNullOrEmpty(strcount))
                return true;
            int count = -1;
            int.TryParse(strcount, out count);
            if ("���ڻ�" == this.devtype)
                return posRecord > count;
            return count > 0;
        }
        /// <summary>
        /// ��ռ�¼�����ü�¼λ��
        /// </summary>
        private void ClearRecord()
        {
            //��ռ�¼
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            cmdP.setCommand("�Ž�", "��ռ�¼", tag);
            this.commimgr.SendCommand(this.target, cmdP);
            if (!cmdP.EventWh.WaitOne(this.waitTime, false))
                return;
            string msg = cmdP.ResponseFormat;
            if ("true" == basefun.valtag(msg, "Success"))
            {
                this.posRecord = 0;
                NameObjectList pspos = new NameObjectList();
                pspos["������"] = this.devid;
                try
                {
                    Monitor.Enter(objquery);
                    this.query.ExecuteNonQuery("���ü�¼λ��", pspos, pspos, pspos);
                }
                finally
                {
                    Monitor.PulseAll(objquery);
                    Monitor.Exit(objquery);
                }
            }
        }

        /// <summary>
        /// �𾯿���
        /// </summary>
        public void FireOpenDoor()
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return;
            if ("���ڻ�" == this.devtype)
                return;
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            //�����Ų���
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            tag = basefun.setvaltag(tag, "{���Ʒ�ʽ}", "1");
            tag = basefun.setvaltag(tag, "{��ʱ}", "0");
            //string[,] colmapdoor ={ { "{���Ʒ�ʽ}", "1" }, { "{��ʱ}", "0" }, { "{�ź�}", "�ź�" } };
            this.reChecking(0);
            for (int i = 1; i < 5; i++)
            {
                tag = basefun.setvaltag(tag, "{�ź�}", Convert.ToString(i));
                string msg = "";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + tag);
                cmdP.setCommand("�Ž�", "���ÿ��Ʋ���", tag);
                cmdP.ResetState();
                this.commimgr.SendCommand(this.target, cmdP);
                if (cmdP.EventWh.WaitOne(this.waitTime, false))
                    msg = cmdP.ResponseFormat;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                msg = "";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + tag);
                cmdP.setCommand("�Ž�", "Զ�̿���", tag);
                cmdP.ResetState();
                this.commimgr.SendCommand(this.target, cmdP);
                if (cmdP.EventWh.WaitOne(this.waitTime, false))
                    msg = cmdP.ResponseFormat;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                if ("����˫��" == this.devtype)
                    break;
                if ("˫��˫��" == this.devtype && i > 1)
                    break;
            }
            this.reChecking(1);
        }

        /// <summary>
        /// ����ָ���ȡָ��������ͨѶʧ��ʱ�Զ�����ִ��5��
        /// </summary>
        /// <param name="mgr">ͨѶ������</param>
        /// <param name="target">ͨѶĿ��</param>
        /// <param name="cmd">ִ��ָ��</param>
        /// <param name="strcmd">ָ������</param>
        /// <param name="tag">ָ������</param>
        /// <param name="timeout">��ʱ���</param>
        /// <returns>����ָ����Ӧ���</returns>
        private string getResponse(CommiManager mgr, CommiTarget target, CmdProtocol cmd, string strcmd, string tag, TimeSpan timeout)
        {
            if (null == mgr || null == target || null == cmd)
                return "";
            if (null == cmd.EventWh)
                cmd.EventWh = new ManualResetEvent(false);
            string msg = "";
            for (int i = 0; i < 3; i++)
            {
                msg = "";
                cmd.setCommand("�Ž�", strcmd, tag);
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + strcmd + "  " + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ָ�" + strcmd + "  " + tag);
                mgr.SendCommand(target, cmd, true);
                this.isexecuting = true;
                if (cmd.EventWh.WaitOne(timeout, false))
                    msg = cmd.ResponseFormat;
                this.isexecuting = false;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                string suc = basefun.valtag(msg, "Success");
                if (!string.IsNullOrEmpty(suc))
                    break;
                if (string.IsNullOrEmpty(msg) && CommiType.SerialPort != target.ProtocolType)
                {
                    Debug.WriteLine(String.Format("{0:HH:mm:ss.fff} ������������...", DateTime.Now));
                    myLog.WriteLine(String.Format("{0:HH:mm:ss.fff} ������������...", DateTime.Now));
                    bool pingcn = Ping(target, CNtimeout);
                    Debug.WriteLine(String.Format("{0:HH:mm:ss.fff} Ping ����   {1}", DateTime.Now, pingcn));
                    myLog.WriteLine(String.Format("{0:HH:mm:ss.fff} Ping ����   {1}", DateTime.Now, pingcn));
                    if (!pingcn) break;
                }
            }
            return msg;
        }
        /// <summary>
        /// ����ָ�ʱ����
        /// </summary>
        /// <param name="cmd">ָ��ʵ��</param>
        private static void setTimeout(CommandBase cmd)
        {
            if (null == cmd)
                return;
            string inv = DataAccRes.AppSettings("commiTimeout");
            if (string.IsNullOrEmpty(inv))
                return;
            int timeout = 300;
            try
            {
                timeout = Convert.ToInt16(inv);
            }
            catch { }
            cmd.TimeOut = new TimeSpan(timeout * 10000);
            cmd.TimeLimit = new TimeSpan(4 * timeout * 10000);
            cmd.TimeFailLimit = cmd.TimeLimit;
        }

        /// <summary>
        /// ���ͨѶĿ���Ƿ������
        /// </summary>
        /// <param name="dest">ͨѶĿ��</param>
        /// <param name="timeout">��ʱʱ�䣬����ms</param>
        /// <returns>�����Ƿ������</returns>
        private static bool Ping(CommiTarget dest, int timeout)
        {
            bool rtn = false;
            if (null == dest)
                return rtn;
            DateTime dt1 = DateTime.Now;
            do
            {
                rtn = CommiManager.GlobalManager.TestConnect(dest);
                DateTime dt2 = DateTime.Now;
                if (!rtn && timeout > 0)
                {
                    TimeSpan ts = dt2 - dt1;
                    if (ts.TotalMilliseconds > timeout)
                        break;
                    Thread.Sleep(1000);
                }
            } while (!rtn && timeout > 0);
            return rtn;
        }

    }
}
