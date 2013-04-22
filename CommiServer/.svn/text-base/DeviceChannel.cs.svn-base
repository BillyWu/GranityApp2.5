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
    /// 通道闸设备
    /// </summary>
    public class DeviceChannel : DeviceBase
    {
        /// <summary>
        /// 消费监控单元
        /// </summary>
        private static UnitItem unitItem = null;
        private static object objquery = new object();
        /// <summary>
        /// 数据操作
        /// </summary>
        private QueryDataRes query = null;
        /// <summary>
        /// 卡用户信息
        /// </summary>
        private QueryDataRes qyemp = null;
        /// <summary>
        /// 采集数据
        /// </summary>
        private static QueryDataRes qydata = null;
        /// <summary>
        /// 设备类型：进出口(一号口是进，二号口是出),出入口(一号口是出，二号口是进)
        /// 目前只做进出口和出入口，单进口、单出口、双进口、双出口类别以后扩展
        /// </summary>
        private string devtype = "进出口";
        /// <summary>
        /// 通道名称，最多四个通道
        /// </summary>
        private string[] channels = new string[4];
        /// <summary>
        /// 道闸所属区域
        /// </summary>
        private string region = "";
        /// <summary>
        /// 道闸所属区域ID
        /// </summary>
        private string regionID = "";
        /// <summary>
        /// 采集指令
        /// </summary>
        private CmdProtocol cmdGather = null;
        /// <summary>
        /// 设备记录数
        /// </summary>
        private int sumRecord = 0;
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
        /// 判断是否繁忙状态的时间间隔,默认2分钟内记录总数超过60条,认为处于繁忙状态
        /// </summary>
        private TimeSpan tsbusy = new TimeSpan(0, 2, 0);
        /// <summary>
        /// 通讯连接恢复超时，默认0不等待恢复连接
        /// </summary>
        private int cnnout = 0;
        /// <summary>
        /// 通讯连接恢复超时，默认0不等待恢复连接
        /// </summary>
        private static int CNtimeout = 0;
        /// <summary>
        /// 当前巡检状态
        /// </summary>
        private NameValueCollection tagInfos = new NameValueCollection();
        /// <summary>
        /// 门禁设备
        /// </summary>
        public DeviceChannel(): base()
        {
            if(null==unitItem)
                unitItem = new UnitItem(DataAccRes.AppSettings("WorkConfig"), "道闸监控");
            this.query = new QueryDataRes(unitItem.DataSrcFile);
            this.qyemp = new QueryDataRes(unitItem.DataSrcFile);
            if (null == qydata)
                qydata = new QueryDataRes(unitItem.DataSrcFile);
            //设置默认超时时间
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
            ps["分组ID"] = devid;
            DataTable tab = null;
            try
            {
                Monitor.Enter(objquery);
                tab = this.query.getTable("道闸设备", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (null == tab || tab.Rows.Count < 1)
                return;
            object val = tab.Rows[0]["控制器类型"];
            this.devtype = Convert.ToString(val);
            val = tab.Rows[0]["区域"];
            this.region = Convert.ToString(val);
            val = tab.Rows[0]["区域ID"];
            this.regionID = Convert.ToString(val);
            DataRow[] drs = tab.Select("", "读卡器号");
            for (int i = 0; i < 4 && i < drs.Length; i++)
                channels[i] = Convert.ToString(drs[i]["名称"]);
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
            cmdg.IsResposeHandle = isResponse;

            this.tagInfos.Clear();
            NameObjectList ps = new NameObjectList();
            ps["控制器"] = this.devid;
            DataTable tab = null;
            try
            {
                Monitor.Enter(objquery);
                tab = this.query.getTable("道闸状态", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if(null!=tab)
                foreach (DataRow dr in tab.Rows)
                {
                    if (null == dr || DBNull.Value == dr["类别"])
                        continue;
                    this.tagInfos.Add(Convert.ToString(dr["类别"]), Convert.ToString(dr["内容"]));
                }
            string tag = "@设备地址=" + Convert.ToString(this.station);
            cmdg.setCommand("门禁", "检测状态", tag);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(cmdGather_ResponseHandle);
            cmdg.ResponseHandle += new EventHandler<ResponseEventArgs>(this.execResponse);
            this.commimgr.SendCommand(this.target, cmdg);
            cmdGather = cmdg;
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
        /// 是否当前指令的结果,验证设备ID和指令
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
                cmd.setCommand("门禁", "检测状态", tag);
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
        }

        private static byte[] btcmd = new byte[] { 0x81, 0x10 };
        /// <summary>
        /// 巡检响应,连续失败5分钟(tsbusy)则认为停机,间隔tsbusy巡检
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
                //连续长时间失败时，增大巡检周期
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
            //离线后恢复在线时，恢复巡检周期
            if (cmdP.TimeSendInv > this.tsbusy)
                cmdP.TimeSendInv = this.tsinv;
            msg = this.validateSate(msg);
            string sumstr = basefun.valtag(msg, "{刷卡记录数}");
            if (string.IsNullOrEmpty(sumstr))
                return;
            int sum = -1;
            int.TryParse(sumstr, out sum);
            if (sum > -1)
                this.sumRecord = sum;
            if (sum < 1) return;

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
        private static Queue<DeviceChannel> dvQueue = new Queue<DeviceChannel>();
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
                DeviceChannel channel = null;
                Monitor.Enter(dvQueue);
                try { channel = dvQueue.Dequeue(); }
                catch { }
                Monitor.PulseAll(dvQueue);
                Monitor.Exit(dvQueue);
                if (null == channel)
                    continue;
                if (channel.sumRecord > 500)
                {
                    channel.ClearRecord();
                    continue;
                }
                //采集记录
                if (null != channel.cmdGather)
                    channel.cmdGather.TimeSendInv = channel.tsbusy.Add(channel.tsinv);
                else
                    channel.reChecking(0);
                CmdProtocol cmdP = new CmdProtocol(false);
                setTimeout(cmdP);
                cmdP.TimeFailLimit = cmdP.TimeOut.Add(new TimeSpan(-10 * 10000));
                cmdP.TimeLimit = TimeSpan.MaxValue;
                cmdP.TimeSendInv = new TimeSpan(1, 0, 0);
                cmdP.ResponseHandle += new EventHandler<ResponseEventArgs>(channel.execResponse);
                cmdP.IsResposeHandle = isResponse;
                cmdP.DeviceType = "通道闸.采集";
                string tag = "@设备地址=" + Convert.ToString(channel.station);
                NameValueCollection datainfo = new NameValueCollection();
                for (int i = 0; i < 200; i++)
                {
                    string msg = channel.getResponse(channel.commimgr, channel.target, cmdP, "读取记录", tag, channel.waitTime);
                    if (string.IsNullOrEmpty(msg))
                        continue;
                    string cardnum = basefun.valtag(msg, "{卡号}");
                    string suc = basefun.valtag(msg, "Success");
                    if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
                    {
                        //bool isend = channel.IsEndReadDevice(-1);
                        //记录错误时记入日志，继续下一条
                        if ("false" == suc)
                        {
                            datainfo["操作"] = "读取记录失败";
                            datainfo["报文"] = CommandBase.Parse(cmdP.ResponseData, true);
                            ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                        }
                        break;
                        //if (isend)  break;
                    }
                    channel.writeRecord(msg);
                }
                channel.commimgr.RemoveCommand(channel.target, cmdP);
                //channel.reChecking(1);
                if (null != channel.cmdGather)
                    channel.cmdGather.TimeSendInv = channel.tsinv;
                else
                    channel.reChecking(1);
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
        private string validateSate(string taginfo)
        {
            if (string.IsNullOrEmpty(taginfo))
                return taginfo;
            Dictionary<string, string[]> dictstate = new Dictionary<string, string[]>();
            string[] alarm ={ "4号门报警", "3号门报警", "2号门报警", "1号门报警" };
            dictstate.Add("报警", alarm);
            alarm = new string[] { "火警", "无效刷卡", "联动报警", "非法闯入", "超时", "胁迫" };
            dictstate.Add("警报", alarm);
            alarm = new string[] { "芯片故障", "系统故障4", "时钟故障", "系统故障2", "系统故障1" };
            dictstate.Add("故障", alarm);
            alarm = new string[] { "按钮4状态", "按钮3状态", "按钮2状态", "按钮1状态" };
            dictstate.Add("按钮", alarm);
            alarm = new string[] { "门磁4状态", "门磁3状态", "门磁2状态", "门磁1状态" };
            dictstate.Add("门磁", alarm);
            alarm = new string[] { "继4状态", "继3状态", "继2状态", "继1状态" };
            dictstate.Add("继电器", alarm);
            //火警报警，WG板子使用火警事件记录来反映的
            string strstate = this.getStateDoorCard(basefun.valtag(taginfo, "{刷卡卡号}"),
                                    basefun.valtag(taginfo, "状态编号"), basefun.valtag(taginfo, "读卡器"));
            if ("火警报警" == strstate)
            {
                taginfo = basefun.setvaltag(taginfo, "火警", "1");
                foreach(string k in dictstate["报警"])
                    taginfo = basefun.setvaltag(taginfo, k, "1");
            }
            //检查前后状态改变；alarmmsg报警信息,isalarm当前是否报警改变
            string msg = "", alarmmsg = "", msgsigal = "";
            bool isalarm = false;
            NameObjectList psevent = new NameObjectList();
            psevent["控制器"] = this.devid;
            DateTime dt = DateTime.MinValue;
            try
            {
                psevent["时间"] = dt = Convert.ToDateTime(basefun.valtag(taginfo, "{当前时间}"));
            }
            catch { dt = DateTime.MinValue; }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                NameValueCollection datainfo = new NameValueCollection();
                datainfo["操作"] = "巡检状态";
                ServiceTool.LogMessage(taginfo, datainfo, EventLogEntryType.FailureAudit);
                if (null == dtobj) return taginfo;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return taginfo; }
                if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
                    return taginfo;
                psevent["时间"] = dtobj;
            }
            else
                dtobj = psevent["时间"];
            alarm = new string[] { "警报", "报警", "故障", "按钮", "门磁", "继电器" };
            foreach (string state in alarm)
            {
                //对比状态生成事件
                psevent["事件"] = state;
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
                    if ("警报" == state && "1" == valnew)
                    {
                        if (string.IsNullOrEmpty(alarmmsg))
                            alarmmsg = st;
                        else
                            alarmmsg += "," + st;
                    }
                    if (valorg == valnew && ("报警" != state || !isalarm))
                        continue;
                    ischanged = true;
                    if ("警报" == state) continue;
                    //处理事件
                    if ("报警" == state || "故障" == state)
                    {
                        if ("报警" == state)
                        {
                            psevent["编号"] = inum.ToString();
                            psevent["内容"] = st + "(" + alarmmsg + ")";
                        }
                        else
                        {
                            psevent.Remove("编号");
                            psevent["内容"] = st;
                        }
                        msg = basefun.setvaltag(msg, st, valnew);
                        try
                        {
                            Monitor.Enter(objquery);
                            if ("1" == valnew)
                                this.query.ExecuteNonQuery("发生道闸事件", psevent, psevent, psevent);
                            else
                                this.query.ExecuteNonQuery("结束道闸事件", psevent, psevent, psevent);
                        }
                        finally
                        {
                            Monitor.PulseAll(objquery);
                            Monitor.Exit(objquery);
                        }
                    }
                    else
                    {
                        psevent["编号"] = inum.ToString();
                        psevent["内容"] = st + "变位 " + valnew;
                        msgsigal = basefun.setvaltag(msgsigal, st, valnew);
                        try
                        {
                            Monitor.Enter(objquery);
                            this.query.ExecuteNonQuery("道闸变位事件", psevent, psevent, psevent);
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
                psevent["类别"] = state;
                psevent["内容"] = tagnews;
                try
                {
                    Monitor.Enter(objquery);
                    this.query.ExecuteNonQuery("道闸巡检状态", psevent, psevent, psevent);
                }
                finally
                {
                    Monitor.PulseAll(objquery);
                    Monitor.Exit(objquery);
                }
                //报警内容变化时,先结束原警报事件
                if ("警报" == state)
                {
                    isalarm = !string.IsNullOrEmpty(alarmmsg);
                    if (!isalarm)
                    {
                        foreach (string a in dictstate[state])
                            msg = basefun.setvaltag(msg, a, "0");
                    }
                    psevent.Remove("编号");
                    try
                    {
                        Monitor.Enter(objquery);
                        this.query.ExecuteNonQuery("结束道闸事件", psevent, psevent, psevent);
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
        /// 根据刷卡状态编码解释刷卡状态
        /// </summary>
        /// <param name="statecode">刷卡状态编码</param>
        /// <returns>返回刷卡状态</returns>
        private string getStateDoorCard(string cardnum, string statecode, string idxdoor)
        {
            if ("4" == cardnum && "10" == statecode && "0" == idxdoor)
                return "火警报警";
            switch (statecode)
            {
                case "8": statecode = "禁止通过,原因不详"; break;
                case "9": statecode = "禁止通过,没有权限"; break;
                case "10": statecode = "禁止通过,密码不对"; break;
                case "11": statecode = "禁止通过,系统故障"; break;
                case "12": statecode = "禁止通过,反潜回,多卡开门或互锁"; break;
                case "13": statecode = "禁止通过,门常闭"; break;
                case "14": statecode = "禁止通过,不在有效时段或卡过期"; break;
                default: statecode = "正常开门"; break;
            }
            return statecode;
        }

        /// <summary>
        /// 写入记录
        /// </summary>
        /// <param name="msg">tag格式信息：{卡号}、状态编号，读卡器号，{刷卡时间}</param>
        private string writeRecord(string msg)
        {
            string cardnum = basefun.valtag(msg, "{卡号}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || "16777215" == cardnum || "0" == cardnum || string.IsNullOrEmpty(cardnum))
                return msg;
            NameObjectList ps = new NameObjectList();
            ps["卡号"] = cardnum;
            DataTable tabuser = null;
            try
            {
                Monitor.Enter(objquery);
                tabuser = this.qyemp.getTable("卡用户信息", ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (null != tabuser && tabuser.Rows.Count > 0)
            {
                DataRow dr = tabuser.Rows[0];
                string[] strcol ={ "部门ID", "部门代码", "部门", "姓名", "用户编号", "照片", "卡号", "卡号NUM", "卡片序列号", "卡片SN" };
                foreach (string c in strcol)
                    msg = basefun.setvaltag(msg, "{" + c + "}", Convert.ToString(dr[c]));
                if (DBNull.Value != dr["进入时间"])
                    msg = basefun.setvaltag(msg, "{进入时间}", Convert.ToDateTime(dr["进入时间"]).ToString("yyyy-MM-dd HH:mm:ss"));
            }
            string info = "";
            string[] cols ={ "{卡号}", "{卡号NUM}", "{卡片序列号}", "{卡片SN}", "{部门}", "{部门ID}", "{部门代码}", "{姓名}", "{照片}", "{用户编号}", "状态编号", "读卡器", "{刷卡时间}", "{进入时间}" };
            for (int c = 0; c < cols.Length; c++)
                info = basefun.setvaltag(info, cols[c], basefun.valtag(msg, cols[c]));
            string idx = basefun.valtag(info, "读卡器");
            string chname = channels[0];
            if ("进出口" == devtype || "出入口" == devtype)
                chname = "2" == idx || "3" == idx ? channels[1] : chname;
            info = basefun.setvaltag(info, "通道", chname);
            info = basefun.setvaltag(info, "区域", region);
            info = basefun.setvaltag(info, "区域ID", regionID);
            info = basefun.setvaltag(info, "控制器类型", devtype);
            string strstate = this.getStateDoorCard(cardnum, basefun.valtag(info, "状态编号"), idx);
            msg = basefun.setvaltag(msg, "状态", strstate);
            info = basefun.setvaltag(info, "状态", strstate);
            ps = ParamManager.createParam(info);
            ps["控制器"] = this.devid;
            ps["时间"] = ps["刷卡时间"] = DateTime.MinValue;
            DateTime dt = DateTime.MinValue;
            try
            {
                string dtstr = basefun.valtag(msg, "{刷卡时间}");
                if (!string.IsNullOrEmpty(dtstr) && "0001-1-1 0:00:00" != dtstr)
                    ps["时间"] = ps["刷卡时间"] = dt = Convert.ToDateTime(dtstr);
            }
            catch { dt = DateTime.MinValue; }
            if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
            {
                if (null == dtobj) return msg;
                try { dt = Convert.ToDateTime(dtobj); }
                catch { return msg; }
                if (dt < DateTime.Today.AddYears(-3) || dt > DateTime.Today.AddYears(3))
                    return msg;
                ps["时间"] = ps["刷卡时间"] = dtobj;
            }
            else
                dtobj = ps["时间"];
            bool success = true;
            try
            {
                Monitor.Enter(objquery);
                success = qydata.ExecuteNonQuery("采集道闸数据", ps, ps, ps);
            }
            finally
            {
                Monitor.PulseAll(objquery);
                Monitor.Exit(objquery);
            }
            if (!success)
            {
                NameValueCollection attr = new NameValueCollection();
                attr["功能"] = "采集道闸数据保存失败";
                ServiceTool.LogMessage(info, null, EventLogEntryType.Warning);
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
            string tag = "@设备地址=" + Convert.ToString(this.station);
            string msg = getResponse(this.commimgr, this.target, cmdP, "读取记录", tag, this.waitTime);
            if (string.IsNullOrEmpty(msg))
                return msg;
            string cardnum = basefun.valtag(msg, "{卡号}");
            string suc = basefun.valtag(msg, "Success");
            if ("true" != suc || "16777215" == cardnum || "0" == cardnum)
            {
                //记录错误时记入日志，继续下一条
                if ("false" == suc)
                {
                    NameValueCollection datainfo = new NameValueCollection();
                    datainfo["操作"] = "读取记录";
                    datainfo["报文"] = CommandBase.Parse(cmdP.ResponseData, true);
                    ServiceTool.LogMessage(msg, datainfo, EventLogEntryType.FailureAudit);
                    return msg;
                }
                if (!dvQueue.Contains(this))
                    this.reChecking(1);
                return msg;
            }
            this.writeRecord(msg);
            if (!dvQueue.Contains(this))
                this.reChecking(1);
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
            if (null == cmdP || 1 == this.stateChecking || this.isexecuting)
                return;
            string msg = cmdP.ResponseFormat;
            this.writeRecord(msg);
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
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            string tag = "@设备地址=" + Convert.ToString(this.station);
            string msg = getResponse(this.commimgr, this.target, cmdP, "检测状态", tag, this.waitTime);
            string strcount = basefun.valtag(msg, "{刷卡记录数}");
            if (string.IsNullOrEmpty(strcount))
                return true;
            int count = -1;
            int.TryParse(strcount, out count);
            return count < 1;
        }
        /// <summary>
        /// 清空记录，重置记录位置
        /// </summary>
        private void ClearRecord()
        {
            //清空记录
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            string tag = "@设备地址=" + Convert.ToString(this.station);
            cmdP.setCommand("门禁", "清空记录", tag);
            this.commimgr.SendCommand(this.target, cmdP);
            cmdP.EventWh.WaitOne(this.waitTime, false);
        }
        
        /// <summary>
        /// 火警开门
        /// </summary>
        public void FireOpenDoor()
        {
            if (null == this.commimgr || null == this.target || string.IsNullOrEmpty(this.devid) || this.station < 1)
                return;
            if ("考勤机" == this.devtype)
                return;
            CmdProtocol cmdP = new CmdProtocol(false);
            setTimeout(cmdP);
            cmdP.IsResposeHandle = isResponse;
            //设置门参数
            string tag = "@设备地址=" + Convert.ToString(this.station);
            tag = basefun.setvaltag(tag, "{控制方式}", "1");
            tag = basefun.setvaltag(tag, "{延时}", "0");
            //string[,] colmapdoor ={ { "{控制方式}", "1" }, { "{延时}", "0" }, { "{门号}", "门号" } };
            this.reChecking(0);
            for (int i = 1; i < 5; i++)
            {
                tag = basefun.setvaltag(tag, "{门号}", Convert.ToString(i));
                string msg = "";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + tag);
                cmdP.setCommand("门禁", "设置控制参数", tag);
                cmdP.ResetState();
                this.commimgr.SendCommand(this.target, cmdP);
                if (cmdP.EventWh.WaitOne(this.waitTime, false))
                    msg = cmdP.ResponseFormat;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                msg = "";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + tag);
                cmdP.setCommand("门禁", "远程开门", tag);
                cmdP.ResetState();
                this.commimgr.SendCommand(this.target, cmdP);
                if (cmdP.EventWh.WaitOne(this.waitTime, false))
                    msg = cmdP.ResponseFormat;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                if (i > 1)
                    break;
            }
            this.reChecking(1);
        }

        /// <summary>
        /// 发送指令，获取指令结果，在通讯失败时自动尝试执行5次
        /// </summary>
        /// <param name="mgr">通讯管理器</param>
        /// <param name="target">通讯目标</param>
        /// <param name="cmd">执行指令</param>
        /// <param name="strcmd">指令名称</param>
        /// <param name="tag">指令内容</param>
        /// <param name="timeout">超时间隔</param>
        /// <returns>返回指令响应结果</returns>
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
                cmd.setCommand("门禁", strcmd, tag);
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + strcmd + "  " + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 指令：" + strcmd + "  " + tag);
                mgr.SendCommand(target, cmd, true);
                this.isexecuting = true;
                if (cmd.EventWh.WaitOne(timeout, false))
                    msg = cmd.ResponseFormat;
                this.isexecuting = false;
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 响应：" + msg);
                string suc = basefun.valtag(msg, "Success");
                if (!string.IsNullOrEmpty(suc))
                    break;
                if (string.IsNullOrEmpty(msg) && CommiType.SerialPort != target.ProtocolType)
                {
                    Debug.WriteLine(String.Format("{0:HH:mm:ss.fff} 测试网络连接...", DateTime.Now));
                    myLog.WriteLine(String.Format("{0:HH:mm:ss.fff} 测试网络连接...", DateTime.Now));
                    bool pingcn = Ping(target, CNtimeout);
                    Debug.WriteLine(String.Format("{0:HH:mm:ss.fff} Ping 连接   {1}", DateTime.Now, pingcn));
                    myLog.WriteLine(String.Format("{0:HH:mm:ss.fff} Ping 连接   {1}", DateTime.Now, pingcn));
                    if (!pingcn) break;
                }
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
        /// 检查通讯目标是否可连接
        /// </summary>
        /// <param name="dest">通讯目标</param>
        /// <param name="timeout">超时时间，毫秒ms</param>
        /// <returns>返回是否可连接</returns>
        private static bool Ping(CommiTarget dest,int timeout)
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
