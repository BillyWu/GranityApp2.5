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
    /// 消费设备
    /// </summary>
    public class DeviceEatery : DeviceBase
    {
        /// <summary>
        /// 消费监控单元
        /// </summary>
        private static UnitItem unitItem = null;
        /// <summary>
        /// 数据操作
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// 巡检采集指令
        /// </summary>
        private CmdProtocol cmdGather = null;
        /// <summary>
        /// 数据采集临时指令
        /// </summary>
        private CmdProtocol cmdtemp = null;
        /// <summary>
        /// 当前是否正在通讯执行
        /// </summary>
        private bool isexecuting = false;
        /// <summary>
        /// 同步等待时刻,默认500毫秒认为超时失败
        /// </summary>
        private TimeSpan waitTime = new TimeSpan(0, 0, 0, 0, 500);
        /// <summary>
        /// 采集周期,默认巡检周期2秒
        /// </summary>
        private TimeSpan tsinv = new TimeSpan(0, 0, 2);
        /// <summary>
        /// 判断是否繁忙状态的时间间隔,默认5分钟内巡检到状态是“工作中”认为是繁忙状态
        /// </summary>
        private TimeSpan tsbusy = new TimeSpan(0, 2, 0);
        /// <summary>
        /// 巡检到"工作中"或无采集记录时更新时间
        /// </summary>
        private DateTime dtwork = DateTime.Now;
        /// <summary>
        /// 当前巡检状态
        /// </summary>
        private NameValueCollection tagInfos = new NameValueCollection();
        /// <summary>
        /// 当前设备记录位置
        /// </summary>
        private static Dictionary<string, int> recordpos = new Dictionary<string, int>();
        /// <summary>
        /// 设备名称，补助机设备名称是：补助机，以区别其他消费机
        /// </summary>
        private string devName = "";
        /// <summary>
        /// 消费设备构造函数
        /// </summary>
        public DeviceEatery()
            : base()
        {
            if (null == unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "消费监控");
            this.query = new QueryDataRes(unitItem.DataSrcFile);
            //设置默认超时时间
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
        /// 设置通讯设备
        /// </summary>
        /// <param name="devid">设备ID</param>
        /// <param name="target">通讯目标</param>
        /// <param name="station">站址</param>
        public override void SetDevice(CommiManager mgr, CommiTarget target, string devid, int station)
        {
            if (null == mgr || string.IsNullOrEmpty(devid) || null == target || station < 1)
                return;
            this.commimgr = mgr;
            this.target = target;
            this.devid = devid;
            this.station = station;
            NameObjectList ps = new NameObjectList();
            ps["设备ID"] = devid;
            DataTable tab = this.query.getTable("消费设备", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            this.devName = Convert.ToString(tab.Rows[0]["名称"]);
        }

        /// <summary>
        /// 启动采集
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
            ps["消费机"] = this.devid;
            DataTable tab = this.query.getTable("消费机状态", ps);
            foreach (DataRow dr in tab.Rows)
            {
                if (null == dr || DBNull.Value == dr["类别"])
                    continue;
                this.tagInfos.Add(Convert.ToString(dr["类别"]), Convert.ToString(dr["内容"]));
            }
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(cmdGather_ResponseHandle);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
            cmdGather = cmdGather;
            this.reChecking(1);

        }
        /// <summary>
        /// 再确定巡检在执行
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
        /// 巡检状态:0/采集记录(暂停巡检),1/巡检
        /// </summary>
        private int stateChecking = 1;
        /// <summary>
        /// 切换巡检状态：0/采集记录(暂停巡检),1/巡检
        /// </summary>
        /// <param name="stateChk">巡检类型</param>
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
            string tag = "@设备地址=" + Convert.ToString(this.station);
            if (1 == stateChk)
                cmd.setCommand("消费", "检测状态", tag);
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
        /// 巡检响应,连续失败5分钟(tsbusy)则认为停机,间隔tsbusy巡检
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
                //连续长时间失败时，增大巡检周期
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
            //离线后恢复在线时，恢复巡检周期
            if (cmdP.TimeSendInv > this.tsbusy)
                cmdP.TimeSendInv = this.tsinv;
            //工作中或没有新记录,则
            string valwk = basefun.valtag(msg, "工作中");
            int sum = Convert.ToInt32(basefun.valtag(msg, "{采集标志}"));
            if ("1" == valwk || sum < 1)
                this.dtwork = DateTime.Now;
            this.validateSate(msg);
            //有新记录且不繁忙时可采集新记录50条
            if (sum < 1 || DateTime.Now - this.dtwork < tsbusy)
                return;
            //加入采集队列
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
                //采集记录
                eatery.reChecking(0);
                CmdProtocol cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
                cmdP.TimeLimit = TimeSpan.MaxValue;
                cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(eatery.execResponse);
                string tag = "@设备地址=" + Convert.ToString(eatery.station);
                NameValueCollection datainfo = new NameValueCollection();
                for (int i = 0; i < 200; i++)
                {
                    string strcmd = i < 1 ? "取当前消费记录" : "取下一条消费记录";
                    if ("补助机" == eatery.devName)
                        strcmd = i < 1 ? "取当前补助记录" : "取下一条补助记录";
                    string msg = eatery.getResponse(eatery.commimgr, eatery.target, cmdP, strcmd, tag, eatery.waitTime);
                    if (string.IsNullOrEmpty(msg))
                        continue;
                    string cardnum = basefun.valtag(msg, "{卡号}");
                    string suc = basefun.valtag(msg, "Success");
                    if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
                    {
                        eatery.commimgr.RemoveCommand(eatery.target, cmdP);
                        bool isend = basefun.valtag(msg, "{状态}").Contains("无新记录");
                        if (!isend)
                            isend = eatery.IsEndReadDevice(-1);
                        //记录错误时记入日志，继续下一条
                        if ("false" == suc)
                        {
                            datainfo["操作"] = "读取记录失败";
                            datainfo["报文"] = CommandBase.Parse(cmdP.ResponseData, true);
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
        /// 停止采集
        /// </summary>
        public override void StopGather()
        {
            if (null == this.commimgr)
                return;
            this.commimgr.RemoveCommand(this.target, this.cmdGather);
            this.cmdGather = null;
        }

        /// <summary>
        /// 验证状态信息,对状态对比变化时生成事件记录
        /// </summary>
        /// <param name="item">巡检项</param>
        /// <param name="devid">控制器ID</param>
        /// <param name="taginfo">状态信息tag标记值</param>
        private void validateSate(string taginfo)
        {
            if (string.IsNullOrEmpty(taginfo))
                return;
            Dictionary<string, string[]> dictstate = new Dictionary<string, string[]>();
            string[] alarm ={ "时间格式错", "读头故障", "权限校验错", "时段参数错", "收费参数错", "黑名单错" };
            dictstate.Add("内部状态", alarm);

            //检查前后状态改变；alarmmsg报警信息,isalarm当前是否报警改变
            NameObjectList psevent = new NameObjectList();
            psevent["消费机"] = this.devid;
            psevent["时间"] = basefun.valtag(taginfo, "{当前时间}");
            alarm = new string[] { "内部状态" };
            string msg = "";
            foreach (string state in alarm)
            {
                //对比状态生成事件
                psevent["事件"] = state;
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
                    psevent["内容"] = st;
                    msg = basefun.setvaltag(msg, st, valnew);
                    if ("1" != valnew)
                        this.query.ExecuteNonQuery("结束消费机事件", psevent, psevent, psevent);
                    else
                        this.query.ExecuteNonQuery("发生消费机事件", psevent, psevent, psevent);
                }
                this.tagInfos[state] = tagnews;
                if (!ischanged) continue;
                psevent["类别"] = state;
                psevent["内容"] = tagnews;
                this.query.ExecuteNonQuery("消费巡检状态", psevent, psevent, psevent);
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
            DateTime dt = Convert.ToDateTime(basefun.valtag(taginfo, "{当前时间}"));
            DvAlarmEventArgs arg = new DvAlarmEventArgs(this.devid, this.station, dt, taginfo);
            arg.TagAlarm = msg;
            this.RaiseAlarm(arg);
        }

        /// <summary>
        /// 写入记录，分补助或消费分别保存
        /// </summary>
        /// <param name="msg">tag格式信息：{卡号}、状态编号，读卡器号，{刷卡时间}</param>
        private string writeRecord(string msg)
        {
            string cardnum = basefun.valtag(msg, "{卡号}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || "16777215" == cardnum || "0" == cardnum || string.IsNullOrEmpty(cardnum))
                return msg;
            string info = "";
            string[] cols ={ "{卡号}", "{卡类}", "{消费时间}", "{消费金额}", "{卡余额}", "{累计补助金额}", "{消费机号}", "{操作员号}" };
            if ("补助机" == this.devName)
                cols = new string[] { "{卡号}", "{卡类}", "{充值时间}", "{本次补助金额}", "{补助后总额}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(msg, cols[c]));
            NameObjectList ps = ParamManager.createParam(info);
            ps["消费机"] = this.devid;

            //msg = "@{帧头}=C0,@{设备地址}=17,@{控制场}=01,@{长度场}=25,@Success=true,@{状态}=操作成功！,@{命令长度}=23,@{消费机号}=17,@{操作员号}=255,@{卡号}=16777215,@{卡类}=255,@{消费时间}=0001/1/1 0:00:00,@{卡余额}=1677721.5,@{累计补助金额}=6553.5,@{消费金额}=6553.5,@{记录指针}=11297,@{校验字}=32,@{帧尾}=C0";
            ///*************************查看时间格式是否正确 2012-06-20
            string dtTime = Convert.ToString(basefun.valtag(msg, "{消费时间}"));
            try
            {

                DateTime s = Convert.ToDateTime(dtTime);
                if (dtTime.ToString() == "0001/1/1 0:00:00" || Convert.ToDateTime(dtTime) < Convert.ToDateTime("2000-01-01 00:00:00"))
                {
                    ps["设备ID"] = this.devid;
                    ps["卡号"] = cardnum;
                    ps["日期"] = dtTime;
                    ps["金额"] = basefun.valtag(msg, "{卡余额}");
                    this.query.ExecuteNonQuery("错误记录", ps, ps, ps);

                }
            }
            catch
            {
                ps["设备ID"] = this.devid;
                ps["卡号"] = cardnum;
                ps["日期"] = dtTime;
                ps["金额"] = basefun.valtag(msg, "{卡余额}");
                this.query.ExecuteNonQuery("错误记录", ps, ps, ps);

            }
            ///*************************查看时间格式是否正确 2012-06-20



            DateTime dt = DateTime.MinValue;
            string fld = "补助机" == this.devName ? "充值时间" : "消费时间";
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
            if ("补助机" == this.devName)
                success = this.query.ExecuteNonQuery("消费接收补助", ps, ps, ps);
            else
                success = this.query.ExecuteNonQuery("采集数据", ps, ps, ps);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 保存：" + this.devName + " " + this.station.ToString());
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 保存：" + this.devName + " " + this.station.ToString());
            if (!success)
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
            if (recordpos.ContainsKey(this.devid))
            {
                recordpos[this.devid]++;
                ps.Clear();
                ps["消费机"] = this.devid;
                ps["记录位置"] = recordpos[this.devid];
                query.ExecuteNonQuery("记录指针", ps, ps, ps);
            }
            this.AddRecord(info);
            DvRecordEventArgs arg = new DvRecordEventArgs(this.devid, this.station, dt, info);
            this.RaiseRecord(arg);
            return msg;
        }

        object dtobj = null;
        /// <summary>
        /// 直接采集一条数据,并自动存入数据库,返回获取数据的记录
        /// 没有记录时恢复巡检
        /// </summary>
        /// <param name="isfirst">是否首次提取,首次会补充采集当前记录以防漏采</param>
        public override string GatherData(bool isfirst)
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return "";
            if ("补助机" == this.devName)
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
            string strcmd = "取下一条消费记录";
            string tag = "@设备地址=" + Convert.ToString(this.station);
            if (recordpos.ContainsKey(this.devid))
            {
                tag = basefun.setvaltag(tag, "{记录值指针}", Convert.ToString(recordpos[this.devid]));
                strcmd = "取指定记录";
            }
            else
                strcmd = isfirst ? "取当前消费记录" : "取下一条消费记录";
            string msg = getResponse(this.commimgr, this.target, cmdP, strcmd, tag, this.waitTime);
            string cardnum = basefun.valtag(msg, "{卡号}");
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
        /// 在当前没有执行指令响应时利用响应事件保存数据
        /// </summary>
        /// <param name="sender">事件指令实例</param>
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
            string cardnum = basefun.valtag(msg, "{卡号}");
            string st = basefun.valtag(msg, "{状态}");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
                return;
            string info = "";
            Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 执行：" + msg);
            myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 执行：" + msg);
            string[] cols ={ "{卡号}", "{卡类}", "{消费时间}", "{消费金额}", "{卡余额}", "{累计补助金额}", "{消费机号}", "{操作员号}" };
            if ("补助机" == this.devName)
                cols = new string[] { "{卡号}", "{卡类}", "{充值时间}", "{本次补助金额}", "{补助后总额}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(msg, cols[c]));
            NameObjectList ps = ParamManager.createParam(info);
            ps["消费机"] = this.devid;
            DateTime dt = DateTime.MinValue;
            string fld = "补助机" == this.devName ? "充值时间" : "消费时间";
            try
            {
                dt = Convert.ToDateTime(ps[fld]);
            }
            catch { }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                NameValueCollection datainfo = new NameValueCollection();
                datainfo["操作"] = "提取消费记录";
                datainfo["报文"] = CommandBase.Parse(cmdP.ResponseData, true);
                ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                if (null == dtobj) return;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return; }
                ps[fld] = dtobj;
            }
            else
                dtobj = ps[fld];
            bool success = false;
            if ("补助机" == this.devName)
                success = this.query.ExecuteNonQuery("消费接收补助", ps, ps, ps);
            else
                success = this.query.ExecuteNonQuery("采集数据", ps, ps, ps);

            if (!success)
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
        }
        /// <summary>
        /// 指定索引号，是否到达结尾
        /// </summary>
        /// <param name="index">指定记录索引号，-1时判断当前记录位置</param>
        /// <returns>返回是否读取到设备结尾，通讯失败返回true</returns>
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
                string tag = "@设备地址=" + Convert.ToString(this.station);
                tag = basefun.setvaltag(tag, "{记录值指针}", Convert.ToString(index));
                msg = getResponse(this.commimgr, this.target, cmdP, "取指定记录", tag, this.waitTime);
            }
            if (!recordpos.ContainsKey(this.devid))
                this.reChecking(sk);
            string cardnum = basefun.valtag(msg, "{卡号}");
            string st = basefun.valtag(msg, "{状态}");
            if (string.IsNullOrEmpty(msg) || st.Contains("无新记录") || "16777215" == cardnum)
                return true;
            return false;
        }
        /// <summary>
        /// 采集补助
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
            string strcmd = first ? "取当前补助记录" : "取下一条补助记录";
            string tag = "@设备地址=" + Convert.ToString(this.station);
            string msg = getResponse(this.commimgr, this.target, cmdP, strcmd, tag, this.waitTime);
            string cardnum = basefun.valtag(msg, "{卡号}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || string.IsNullOrEmpty(cardnum) || "16777215" == cardnum || "0" == cardnum)
            {
                if (!dvQueue.Contains(this))
                    this.reChecking(1);
                return msg;
            }
            writeRecord(msg);
            string[,] map = { { "{卡号}", "{卡号}" }, { "{卡类}", "{卡类}" }, { "{本次补助金额}", "{消费金额}" }, { "{补助后总额}", "{累计补助金额}" }, { "{充值时间}", "{消费时间}" }, { "{消费机号}", "{消费机号}" }, { "{操作员号}", "{操作员号}" } };
            string rtn = "";
            for (int i = 0; i < map.GetLength(0); i++)
                rtn = basefun.setvaltag(rtn, map[i, 1], basefun.valtag(msg, map[i, 0]));
            return rtn;
        }

        /// <summary>
        /// 重置设备记录位置，自
        /// </summary>
        /// <param name="devid">设备ID，为空则清空所有设备记录位置，有则重置为1，没有则添加</param>
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
                query.ExecuteNonQuery("记录指针", ps, ps, ps);
            if (string.IsNullOrEmpty(devid))
            {
                recordpos.Clear();
                return;
            }
            ps["消费机"] = devid;
            DataTable tab = query.getTable("记录指针", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            if (DBNull.Value == tab.Rows[0]["记录位置"] || null == tab.Rows[0]["记录位置"])
                tab.Rows[0]["记录位置"] = 1;
            recordpos.Add(devid, Convert.ToInt32(tab.Rows[0]["记录位置"]));
        }
        /// <summary>
        /// 发送指令，获取指令结果，在通讯失败时自动尝试执行5次
        /// </summary>
        /// <param name="mgr">通讯管理器</param>
        /// <param name="target">通讯目标</param>
        /// <param name="cmd">执行指令</param>
        /// <param name="strcmd">指令名称</param>
        /// <param name="timeout">超时间隔</param>
        /// <returns>返回指令响应结果</returns>
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
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 请求：" + strcmd + " " + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 请求：" + strcmd + " " + tag);
                cmd.setCommand("消费", strcmd, tag);
                mgr.SendCommand(target, cmd, true);
                this.isexecuting = true;
                if (cmd.EventWh.WaitOne(timeout, false))
                    msg = cmd.ResponseFormat;
                this.isexecuting = false;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                string suc = basefun.valtag(msg, "Success");
                if ("true" == suc)
                    break;
                //失败时重新采集当前记录
                if ("取下一条消费记录" == strcmd)
                    strcmd = "取当前消费记录";
                if ("取下一条补助记录" == strcmd)
                    strcmd = "取当前补助记录";
                Thread.Sleep(200);
            }
            return msg;
        }
        /// <summary>
        /// 设置指令超时属性
        /// </summary>
        /// <param name="cmd">指令实例</param>
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
