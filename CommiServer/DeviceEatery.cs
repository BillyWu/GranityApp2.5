using System;
using System.Collections.Generic;
using System.Text;
using Granity.CardOneCommi;
using Granity.communications;
using System.Diagnostics;
using Estar.Common.Tools;
using Estar.Business.DataManager;
using System.Collections.Specialized;
using System.Data;
using Granity.winTools;
using System.Threading;

namespace Granity.commiServer
{
    /// <summary>
    /// �����豸
    /// </summary>
    public class DeviceEatery : DeviceBase
    {
        /// <summary>
        /// ���Ѽ�ص�Ԫ
        /// </summary>
        private static UnitItem unitItem = null;
        /// <summary>
        /// ���ݲ���
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// Ѳ��ɼ�ָ��
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
        /// �ж��Ƿ�æ״̬��ʱ����,Ĭ��5������Ѳ�쵽״̬�ǡ������С���Ϊ�Ƿ�æ״̬
        /// </summary>
        private TimeSpan tsbusy = new TimeSpan(0, 2, 0);
        /// <summary>
        /// Ѳ�쵽"������"���޲ɼ���¼ʱ����ʱ��
        /// </summary>
        private DateTime dtwork = DateTime.Now;
        /// <summary>
        /// ��ǰѲ��״̬
        /// </summary>
        private NameValueCollection tagInfos = new NameValueCollection();
        /// <summary>
        /// ��ǰ�豸��¼λ��
        /// </summary>
        private static Dictionary<string, int> recordpos = new Dictionary<string, int>();
        /// <summary>
        /// �豸���ƣ��������豸�����ǣ����������������������ѻ�
        /// </summary>
        private string devName = "";
        /// <summary>
        /// �����豸���캯��
        /// </summary>
        public DeviceEatery()
            : base()
        {
            if (null == unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "���Ѽ��");
            this.query = new QueryDataRes(unitItem.DataSrcFile);
            //����Ĭ�ϳ�ʱʱ��
            string inv = DataAccRes.AppSettings("commiTimeout");
            if (string.IsNullOrEmpty(inv))
                return;
            int timeout = 0;
            try
            {
                timeout = Convert.ToInt16(inv);
            }
            catch { return; }
            this.waitTime = new TimeSpan(0, 0, 0, 0, timeout / 10 * 35);
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
            ps["�豸ID"] = devid;
            DataTable tab = this.query.getTable("�����豸", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            this.devName = Convert.ToString(tab.Rows[0]["����"]);
        }

        /// <summary>
        /// �����ɼ�
        /// </summary>
        public override void StartGather()
        {
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
            this.dtwork = DateTime.Now;
            this.tagInfos.Clear();
            NameObjectList ps = new NameObjectList();
            ps["���ѻ�"] = this.devid;
            DataTable tab = this.query.getTable("���ѻ�״̬", ps);
            foreach (DataRow dr in tab.Rows)
            {
                if (null == dr || DBNull.Value == dr["���"])
                    continue;
                this.tagInfos.Add(Convert.ToString(dr["���"]), Convert.ToString(dr["����"]));
            }
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(cmdGather_ResponseHandle);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
            cmdGather = cmdGather;
            this.reChecking(1);

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
            if (null == cmd || this.stateChecking == stateChk)
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
                cmd.setCommand("����", "���״̬", tag);
            else
                cmd.setCommand(new byte[0]);
            if (0 < stateChk)
            {
                cmd.TimeSendInv = this.tsinv;
                cmd.TimeLimit = TimeSpan.MaxValue;
                cmd.TimeFailLimit = TimeSpan.MaxValue;
                cmd.FailProAf = FailAftPro.Ignor;
                cmd.TimeSendInv = this.tsinv;
                this.commimgr.SendCommand(this.target, cmd);
            }
        }

        /// <summary>
        /// Ѳ����Ӧ,����ʧ��5����(tsbusy)����Ϊͣ��,���tsbusyѲ��
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void cmdGather_ResponseHandle(object sender, ResponseEventArgs e)
        {
            if (null == sender || null == e)
                return;
            CmdProtocol cmdP = sender as CmdProtocol;
            if (null == cmdP || 0 == this.stateChecking)
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
            if ("true" != basefun.valtag(msg, "Success"))
                return;
            //���ߺ�ָ�����ʱ���ָ�Ѳ������
            if (cmdP.TimeSendInv > this.tsbusy)
                cmdP.TimeSendInv = this.tsinv;
            //�����л�û���¼�¼,��
            string valwk = basefun.valtag(msg, "������");
            int sum = Convert.ToInt32(basefun.valtag(msg, "{�ɼ���־}"));
            if ("1" == valwk || sum < 1)
                this.dtwork = DateTime.Now;
            this.validateSate(msg);
            //���¼�¼�Ҳ���æʱ�ɲɼ��¼�¼50��
            if (sum < 1 || DateTime.Now - this.dtwork < tsbusy)
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
        private static Queue<DeviceEatery> dvQueue = new Queue<DeviceEatery>();
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
                DeviceEatery eatery = null;
                Monitor.Enter(dvQueue);
                try { eatery = dvQueue.Dequeue(); }
                catch { }
                Monitor.PulseAll(dvQueue);
                Monitor.Exit(dvQueue);
                if (null == eatery)
                    continue;
                //�ɼ���¼
                eatery.reChecking(0);
                CmdProtocol cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
                cmdP.TimeLimit = TimeSpan.MaxValue;
                cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(eatery.execResponse);
                string tag = "@�豸��ַ=" + Convert.ToString(eatery.station);
                NameValueCollection datainfo = new NameValueCollection();
                for (int i = 0; i < 200; i++)
                {
                    string strcmd = i < 1 ? "ȡ��ǰ���Ѽ�¼" : "ȡ��һ�����Ѽ�¼";
                    if ("������" == eatery.devName)
                        strcmd = i < 1 ? "ȡ��ǰ������¼" : "ȡ��һ��������¼";
                    string msg = eatery.getResponse(eatery.commimgr, eatery.target, cmdP, strcmd, tag, eatery.waitTime);
                    if (string.IsNullOrEmpty(msg))
                        continue;
                    string cardnum = basefun.valtag(msg, "{����}");
                    string suc = basefun.valtag(msg, "Success");
                    if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
                    {
                        eatery.commimgr.RemoveCommand(eatery.target, cmdP);
                        bool isend = basefun.valtag(msg, "{״̬}").Contains("���¼�¼");
                        if (!isend)
                            isend = eatery.IsEndReadDevice(-1);
                        //��¼����ʱ������־��������һ��
                        if ("false" == suc)
                        {
                            datainfo["����"] = "��ȡ��¼ʧ��";
                            datainfo["����"] = CommandBase.Parse(cmdP.ResponseData, true);
                            ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                        }
                        if (isend) break;
                    }
                    eatery.writeRecord(msg);
                }
                eatery.commimgr.RemoveCommand(eatery.target, cmdP);
                eatery.reChecking(1);
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
        private void validateSate(string taginfo)
        {
            if (string.IsNullOrEmpty(taginfo))
                return;
            Dictionary<string, string[]> dictstate = new Dictionary<string, string[]>();
            string[] alarm ={ "ʱ���ʽ��", "��ͷ����", "Ȩ��У���", "ʱ�β�����", "�շѲ�����", "��������" };
            dictstate.Add("�ڲ�״̬", alarm);

            //���ǰ��״̬�ı䣻alarmmsg������Ϣ,isalarm��ǰ�Ƿ񱨾��ı�
            NameObjectList psevent = new NameObjectList();
            psevent["���ѻ�"] = this.devid;
            psevent["ʱ��"] = basefun.valtag(taginfo, "{��ǰʱ��}");
            alarm = new string[] { "�ڲ�״̬" };
            string msg = "";
            foreach (string state in alarm)
            {
                //�Ա�״̬�����¼�
                psevent["�¼�"] = state;
                string tagorgi = this.tagInfos[state];
                string tagnews = "";
                bool ischanged = false;
                foreach (string st in dictstate[state])
                {
                    string valorg = basefun.valtag(tagorgi, st);
                    if (string.IsNullOrEmpty(valorg))
                        valorg = "0";
                    string valnew = basefun.valtag(taginfo, st);
                    tagnews = basefun.setvaltag(tagnews, st, valnew);
                    if (valorg == valnew)
                        continue;
                    ischanged = true;
                    psevent["����"] = st;
                    msg = basefun.setvaltag(msg, st, valnew);
                    if ("1" != valnew)
                        this.query.ExecuteNonQuery("�������ѻ��¼�", psevent, psevent, psevent);
                    else
                        this.query.ExecuteNonQuery("�������ѻ��¼�", psevent, psevent, psevent);
                }
                this.tagInfos[state] = tagnews;
                if (!ischanged) continue;
                psevent["���"] = state;
                psevent["����"] = tagnews;
                this.query.ExecuteNonQuery("����Ѳ��״̬", psevent, psevent, psevent);
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
            if (string.IsNullOrEmpty(msg))
                return;
            this.Alarm.dtReceive = DateTime.Now;
            this.Alarm.tag = taginfo;
            DateTime dt = Convert.ToDateTime(basefun.valtag(taginfo, "{��ǰʱ��}"));
            DvAlarmEventArgs arg = new DvAlarmEventArgs(this.devid, this.station, dt, taginfo);
            arg.TagAlarm = msg;
            this.RaiseAlarm(arg);
        }

        /// <summary>
        /// д���¼���ֲ��������ѷֱ𱣴�
        /// </summary>
        /// <param name="msg">tag��ʽ��Ϣ��{����}��״̬��ţ��������ţ�{ˢ��ʱ��}</param>
        private string writeRecord(string msg)
        {
            string cardnum = basefun.valtag(msg, "{����}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || "16777215" == cardnum || "0" == cardnum || string.IsNullOrEmpty(cardnum))
                return msg;
            string info = "";
            string[] cols ={ "{����}", "{����}", "{����ʱ��}", "{���ѽ��}", "{�����}", "{�ۼƲ������}", "{���ѻ���}", "{����Ա��}" };
            if ("������" == this.devName)
                cols = new string[] { "{����}", "{����}", "{��ֵʱ��}", "{���β������}", "{�������ܶ�}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(msg, cols[c]));
            NameObjectList ps = ParamManager.createParam(info);
            ps["���ѻ�"] = this.devid;

            //msg = "@{֡ͷ}=C0,@{�豸��ַ}=17,@{���Ƴ�}=01,@{���ȳ�}=25,@Success=true,@{״̬}=�����ɹ���,@{�����}=23,@{���ѻ���}=17,@{����Ա��}=255,@{����}=16777215,@{����}=255,@{����ʱ��}=0001/1/1 0:00:00,@{�����}=1677721.5,@{�ۼƲ������}=6553.5,@{���ѽ��}=6553.5,@{��¼ָ��}=11297,@{У����}=32,@{֡β}=C0";
            ///*************************�鿴ʱ���ʽ�Ƿ���ȷ 2012-06-20
            string dtTime = Convert.ToString(basefun.valtag(msg, "{����ʱ��}"));
            try
            {

                DateTime s = Convert.ToDateTime(dtTime);
                if (dtTime.ToString() == "0001/1/1 0:00:00" || Convert.ToDateTime(dtTime) < Convert.ToDateTime("2000-01-01 00:00:00"))
                {
                    ps["�豸ID"] = this.devid;
                    ps["����"] = cardnum;
                    ps["����"] = dtTime;
                    ps["���"] = basefun.valtag(msg, "{�����}");
                    this.query.ExecuteNonQuery("�����¼", ps, ps, ps);

                }
            }
            catch
            {
                ps["�豸ID"] = this.devid;
                ps["����"] = cardnum;
                ps["����"] = dtTime;
                ps["���"] = basefun.valtag(msg, "{�����}");
                this.query.ExecuteNonQuery("�����¼", ps, ps, ps);

            }
            ///*************************�鿴ʱ���ʽ�Ƿ���ȷ 2012-06-20



            DateTime dt = DateTime.MinValue;
            string fld = "������" == this.devName ? "��ֵʱ��" : "����ʱ��";
            try
            {
                dt = Convert.ToDateTime(ps[fld]);
            }
            catch { }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                if (null == dtobj) return msg;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return msg; }
                ps[fld] = dtobj;
            }
            else
                dtobj = ps[fld];
            bool success = false;
            if ("������" == this.devName)
                success = this.query.ExecuteNonQuery("���ѽ��ղ���", ps, ps, ps);
            else
                success = this.query.ExecuteNonQuery("�ɼ�����", ps, ps, ps);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ���棺" + this.devName + " " + this.station.ToString());
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ���棺" + this.devName + " " + this.station.ToString());
            if (!success)
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
            if (recordpos.ContainsKey(this.devid))
            {
                recordpos[this.devid]++;
                ps.Clear();
                ps["���ѻ�"] = this.devid;
                ps["��¼λ��"] = recordpos[this.devid];
                query.ExecuteNonQuery("��¼ָ��", ps, ps, ps);
            }
            this.AddRecord(info);
            DvRecordEventArgs arg = new DvRecordEventArgs(this.devid, this.station, dt, info);
            this.RaiseRecord(arg);
            return msg;
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
            if ("������" == this.devName)
                return getSubsidy(isfirst);

            CmdProtocol cmdP = this.cmdtemp;
            if (null == cmdP)
            {
                cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
                this.cmdtemp = cmdP;
            }
            this.reChecking(0);
            cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
            string strcmd = "ȡ��һ�����Ѽ�¼";
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            if (recordpos.ContainsKey(this.devid))
            {
                tag = basefun.setvaltag(tag, "{��¼ֵָ��}", Convert.ToString(recordpos[this.devid]));
                strcmd = "ȡָ����¼";
            }
            else
                strcmd = isfirst ? "ȡ��ǰ���Ѽ�¼" : "ȡ��һ�����Ѽ�¼";
            string msg = getResponse(this.commimgr, this.target, cmdP, strcmd, tag, this.waitTime);
            string cardnum = basefun.valtag(msg, "{����}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
            {
                if (!dvQueue.Contains(this))
                    this.reChecking(1);
                return msg;
            }
            writeRecord(msg);
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
            string st = basefun.valtag(msg, "{״̬}");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
                return;
            string info = "";
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ִ�У�" + msg);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ִ�У�" + msg);
            string[] cols ={ "{����}", "{����}", "{����ʱ��}", "{���ѽ��}", "{�����}", "{�ۼƲ������}", "{���ѻ���}", "{����Ա��}" };
            if ("������" == this.devName)
                cols = new string[] { "{����}", "{����}", "{��ֵʱ��}", "{���β������}", "{�������ܶ�}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(msg, cols[c]));
            NameObjectList ps = ParamManager.createParam(info);
            ps["���ѻ�"] = this.devid;
            DateTime dt = DateTime.MinValue;
            string fld = "������" == this.devName ? "��ֵʱ��" : "����ʱ��";
            try
            {
                dt = Convert.ToDateTime(ps[fld]);
            }
            catch { }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                NameValueCollection datainfo = new NameValueCollection();
                datainfo["����"] = "��ȡ���Ѽ�¼";
                datainfo["����"] = CommandBase.Parse(cmdP.ResponseData, true);
                ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                if (null == dtobj) return;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return; }
                ps[fld] = dtobj;
            }
            else
                dtobj = ps[fld];
            bool success = false;
            if ("������" == this.devName)
                success = this.query.ExecuteNonQuery("���ѽ��ղ���", ps, ps, ps);
            else
                success = this.query.ExecuteNonQuery("�ɼ�����", ps, ps, ps);

            if (!success)
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
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
            string msg = "";
            int sk = this.stateChecking;
            if (!recordpos.ContainsKey(this.devid))
                msg = this.GatherData(false);
            else
            {
                CmdProtocol cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                if (index < 1) index = recordpos[this.devid];
                string tag = "@�豸��ַ=" + Convert.ToString(this.station);
                tag = basefun.setvaltag(tag, "{��¼ֵָ��}", Convert.ToString(index));
                msg = getResponse(this.commimgr, this.target, cmdP, "ȡָ����¼", tag, this.waitTime);
            }
            if (!recordpos.ContainsKey(this.devid))
                this.reChecking(sk);
            string cardnum = basefun.valtag(msg, "{����}");
            string st = basefun.valtag(msg, "{״̬}");
            if (string.IsNullOrEmpty(msg) || st.Contains("���¼�¼") || "16777215" == cardnum)
                return true;
            return false;
        }
        /// <summary>
        /// �ɼ�����
        /// </summary>
        private string getSubsidy(bool first)
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return "";
            CmdProtocol cmdP = this.cmdtemp;
            if (null == cmdP)
            {
                cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
                this.cmdtemp = cmdP;
            }
            this.reChecking(0);
            cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
            string strcmd = first ? "ȡ��ǰ������¼" : "ȡ��һ��������¼";
            string tag = "@�豸��ַ=" + Convert.ToString(this.station);
            string msg = getResponse(this.commimgr, this.target, cmdP, strcmd, tag, this.waitTime);
            string cardnum = basefun.valtag(msg, "{����}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
            {
                if (!dvQueue.Contains(this))
                    this.reChecking(1);
                return msg;
            }
            writeRecord(msg);
            string[,] map = { { "{����}", "{����}" }, { "{����}", "{����}" }, { "{���β������}", "{���ѽ��}" }, { "{�������ܶ�}", "{�ۼƲ������}" }, { "{��ֵʱ��}", "{����ʱ��}" }, { "{���ѻ���}", "{���ѻ���}" }, { "{����Ա��}", "{����Ա��}" } };
            string rtn = "";
            for (int i = 0; i < map.GetLength(0); i++)
                rtn = basefun.setvaltag(rtn, map[i, 1], basefun.valtag(msg, map[i, 0]));
            return rtn;
        }

        /// <summary>
        /// �����豸��¼λ�ã���
        /// </summary>
        /// <param name="devid">�豸ID��Ϊ������������豸��¼λ�ã���������Ϊ1��û�������</param>
        public static void ResetPosition(string devid)
        {
            bool isreset = false;
            if ("true" == devid)
                isreset = true;
            if ("true" == devid || "false" == devid)
                devid = "";
            if (recordpos.ContainsKey(devid))
                return;
            QueryDataRes query = null;
            if (isreset || !string.IsNullOrEmpty(devid))
                query = new QueryDataRes(unitItem.DataSrcFile);
            NameObjectList ps = new NameObjectList();
            if (isreset)
                query.ExecuteNonQuery("��¼ָ��", ps, ps, ps);
            if (string.IsNullOrEmpty(devid))
            {
                recordpos.Clear();
                return;
            }
            ps["���ѻ�"] = devid;
            DataTable tab = query.getTable("��¼ָ��", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            if (DBNull.Value == tab.Rows[0]["��¼λ��"] || null == tab.Rows[0]["��¼λ��"])
                tab.Rows[0]["��¼λ��"] = 1;
            recordpos.Add(devid, Convert.ToInt32(tab.Rows[0]["��¼λ��"]));
        }
        /// <summary>
        /// ����ָ���ȡָ��������ͨѶʧ��ʱ�Զ�����ִ��5��
        /// </summary>
        /// <param name="mgr">ͨѶ������</param>
        /// <param name="target">ͨѶĿ��</param>
        /// <param name="cmd">ִ��ָ��</param>
        /// <param name="strcmd">ָ������</param>
        /// <param name="timeout">��ʱ���</param>
        /// <returns>����ָ����Ӧ���</returns>
        private string getResponse(CommiManager mgr, CommiTarget target, CmdProtocol cmd, string strcmd, string tag, TimeSpan timeout)
        {
            if (null == mgr || null == target || null == cmd || string.IsNullOrEmpty(strcmd) || string.IsNullOrEmpty(tag))
                return "";
            if (null == cmd.EventWh)
                cmd.EventWh = new ManualResetEvent(false);
            string msg = "";
            for (int i = 0; i < 5; i++)
            {
                msg = "";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ����" + strcmd + " " + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ����" + strcmd + " " + tag);
                cmd.setCommand("����", strcmd, tag);
                mgr.SendCommand(target, cmd, true);
                this.isexecuting = true;
                if (cmd.EventWh.WaitOne(timeout, false))
                    msg = cmd.ResponseFormat;
                this.isexecuting = false;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " ��Ӧ��" + msg);
                string suc = basefun.valtag(msg, "Success");
                if ("true" == suc)
                    break;
                //ʧ��ʱ���²ɼ���ǰ��¼
                if ("ȡ��һ�����Ѽ�¼" == strcmd)
                    strcmd = "ȡ��ǰ���Ѽ�¼";
                if ("ȡ��һ��������¼" == strcmd)
                    strcmd = "ȡ��ǰ������¼";
                Thread.Sleep(200);
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
            int timeout = 150;
            try
            {
                timeout = Convert.ToInt16(inv);
            }
            catch { }
            cmd.TimeOut = new TimeSpan(timeout * 10000);
            cmd.TimeLimit = new TimeSpan(4 * cmd.TimeOut.Ticks);
            cmd.TimeFailLimit = cmd.TimeLimit;
        }
    }
}
