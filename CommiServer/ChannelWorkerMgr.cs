using System;
using System.Collections.Generic;
using System.Text;
using System.Timers;
using System.Diagnostics;
using System.Threading;
using System.Collections.Specialized;
using Granity.communications;
using Estar.Business.DataManager;
using Estar.Common.Tools;
using System.Data;

namespace Granity.commiServer
{
    /// <summary>
    /// 通道区域员工动态管理
    /// </summary>
    public class ChannelWorkerMgr
    {
        /// <summary>
        /// 区域员工动态
        /// </summary>
        private List<ChannelWorker> listwk = new List<ChannelWorker>();
        /// <summary>
        /// 查询服务定义数据
        /// </summary>
        private static QueryDataRes query = new QueryDataRes("基础类");
        /// <summary>
        /// 工作区人员数
        /// </summary>
        private DataTable tabRegionSum = null;
        /// <summary>
        /// 服务定时器，定时重置动态数据与数据库同步核对
        /// </summary>
        private System.Timers.Timer tmService = new System.Timers.Timer();
        bool isRuning = false;

        public ChannelWorkerMgr()
        {
            //10分钟执行一次
            tmService.Interval = 600000;
            tmService.Elapsed += new ElapsedEventHandler(tmService_Elapsed);
            tmService.Enabled = true;
            tmService.Start();
            ResetRecord();
        }
        /// <summary>
        /// 设置区域通过记录
        /// </summary>
        /// <param name="tag">tag格式记录数据</param>
        public void setPassChannel(string tag)
        {
            string[] info ={ "卡号", "部门ID", "部门代码", "部门", "姓名", "照片", "用户编号", "通道", "区域", "区域ID", "控制器类型", "刷卡时间", "状态", "卡号NUM", "卡片序列号", "卡片SN" };
            for (int i = 0; i < info.Length; i++)
            {
                string val = basefun.valtag(tag, info[i]);
                info[i] = !string.IsNullOrEmpty(val) ? val : basefun.valtag(tag, "{" + info[i] + "}");
            }
            if (string.IsNullOrEmpty(info[0]) || string.IsNullOrEmpty(info[7]) || string.IsNullOrEmpty(info[11]) || "正常开门" != info[12])
                return;
            string strtype = info[10];
            string idx = basefun.valtag(tag, "读卡器");
            if (("2" == idx || "3" == idx) && ("进出口" == strtype || "出入口" == strtype))
                strtype = "出";
            else
                strtype = "进";
            setPassChannel(info[0], info[1], info[2], info[3], info[4], info[5], info[6], info[7], info[8], info[9], strtype, info[11], info[12], info[13], info[14], info[15]);
        }
        /// <summary>
        /// 设置区域通过记录
        /// </summary>
        public void setPassChannel(string cardnum, string deptID, string deptcode, string dept, string wkname, string picpath, string wkcode, string channel, string region, string regionID, string strtype, string strInOut, string memo,string cardNUM, string cardID,string cardSN)
        {
            if (string.IsNullOrEmpty(wkcode))
                return;
            ChannelWorker wk = findRecord(wkcode);
            if (null != wk && cardnum == wk.CardNum)
                wk.SetWorker(dept, deptID, deptcode, wkname, picpath, wkcode, cardnum, channel, region, regionID, strtype, strInOut, memo);
            else
            {
                ChannelWorker wkr = new ChannelWorker(dept, deptID, deptcode, wkname, picpath, wkcode, cardnum, channel, region, regionID, strtype, strInOut, memo);
                wkr.CardNUM = cardNUM;
                wkr.CardID = cardID;
                wkr.CardSN = cardSN;
                Monitor.Enter(listwk);
                if (null != wk) listwk.Remove(wk);
                listwk.Add(wkr);
                Monitor.PulseAll(listwk);
                Monitor.Exit(listwk);
            }
        }
        /// <summary>
        /// 读取动态员工信息
        /// </summary>
        /// <param name="info">指令内容：service='readwkchannel',id, dept='deptid',dt='yyyy-MM-dd HH:mm:ss'</param>
        /// <param name="client">客户端连接信息</param>
        public void ReadWorker(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                return;
            string cmdid = info["id"];
            string dt = info["dt"];
            string dept = info["dept"];
            if (string.IsNullOrEmpty(cmdid) || string.IsNullOrEmpty(dept))
                return;
            DateTime dtindex = DateTime.MinValue;
            if (!string.IsNullOrEmpty(dt))
                try { dtindex = Convert.ToDateTime(dt); }
                catch { }
            
            Monitor.Enter(listwk);
            ChannelWorker[] wks=listwk.ToArray();
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
            StringBuilder sbtag = new StringBuilder();
            DateTime dtr = DateTime.MinValue;
            bool isrefreshHTML = false;
            for (int i = 0; i < wks.Length; i++)
            {
                if (null == wks[i] || wks[i].DtReceive < dtindex || wks[i].DeptID != dept)
                    continue;
                if (dtr < wks[i].DtReceive)
                    dtr = wks[i].DtReceive;
                try
                {
                    sbtag.Append(";" + wks[i].ToTagString());
                }
                catch (Exception ex)
                {
                    if (ex is OutOfMemoryException)
                    {
                        isrefreshHTML = true;
                        break;
                    }
                }
            }
            if(sbtag.Length>0)
            {
                try { sbtag.Remove(0, 1); }
                catch { }
                dt = dtr.ToString("yyyy-MM-dd HH:mm:ss");
            }
            NameValueCollection nvclient = new NameValueCollection();
            string[,] map ={ { "id", cmdid }, { "cmd", "TransFile.extend" }, { "service", "readwkchannel" }, { "len", "0" }, { "dt", dt } };
            for (int i = 0; i < map.GetLength(0); i++)
                nvclient.Add(map[i, 0], map[i, 1]);
            byte[] data = new byte[0];
            try
            {
                data = Encoding.GetEncoding("GB2312").GetBytes(sbtag.ToString());
            }
            catch (Exception ex)
            {
                if (ex is OutOfMemoryException)
                    isrefreshHTML = true;
            }
            if (isrefreshHTML)
                nvclient["isrefreshHTML"] = "true";
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
        /// 读取工作区动态员工信息
        /// </summary>
        /// <param name="info">指令内容：service='readwkregion',id, region='deptid',dt='yyyy-MM-dd HH:mm:ss'</param>
        /// <param name="client">客户端连接信息</param>
        public void ReadWkRegion(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                return;
            string cmdid = info["id"];
            string dt = info["dt"];
            string region = info["region"];
            if (string.IsNullOrEmpty(cmdid) || string.IsNullOrEmpty(region))
                return;
            DateTime dtindex = DateTime.MinValue;
            if (!string.IsNullOrEmpty(dt))
                try { dtindex = Convert.ToDateTime(dt); }
                catch { }

            Monitor.Enter(listwk);
            ChannelWorker[] wks = listwk.ToArray();
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
            StringBuilder sbtag = new StringBuilder();
            DateTime dtr = DateTime.MinValue;
            bool isrefreshHTML = false;
            for (int i = 0; i < wks.Length; i++)
            {
                if (null == wks[i] || wks[i].DtReceive < dtindex || wks[i].RegionID != region)
                    continue;
                if (dtr < wks[i].DtReceive)
                    dtr = wks[i].DtReceive;
                try
                {
                    sbtag.Append(";" + wks[i].ToTagString());
                }
                catch (Exception ex)
                {
                    if (ex is OutOfMemoryException)
                    {
                        isrefreshHTML = true;
                        break;
                    }
                }
            }
            if(sbtag.Length>0)
            {
                try { sbtag.Remove(0, 1); }
                catch { }
                dt = dtr.ToString("yyyy-MM-dd HH:mm:ss");
            }
            NameValueCollection nvclient = new NameValueCollection();
            string[,] map ={ { "id", cmdid }, { "cmd", "TransFile.extend" }, { "service", "readwkregion" }, { "len", "0" }, { "dt", dt } };
            for (int i = 0; i < map.GetLength(0); i++)
                nvclient.Add(map[i, 0], map[i, 1]);
            byte[] data = new byte[0];
            try
            {
                data = Encoding.GetEncoding("GB2312").GetBytes(sbtag.ToString());
            }
            catch (Exception ex)
            {
                if (ex is OutOfMemoryException)
                    isrefreshHTML = true;
            }
            if (isrefreshHTML)
                nvclient["isrefreshHTML"] = "true";
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
        /// 读取区域信息
        /// </summary>
        /// <param name="info">指令内容：service='readregionsum',id, region='regionid'</param>
        /// <param name="client">客户端连接信息</param>
        public void ReadRegionSum(NameValueCollection info, ClientInfo client)
        {
            if (null == info)
                return;
            string cmdid = info["id"];
            string region = info["region"];
            if (string.IsNullOrEmpty(cmdid) || string.IsNullOrEmpty(region))
                return;
            Monitor.Enter(listwk);
            ChannelWorker[] wks = listwk.ToArray();
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
            string tag = "";
            int sum = 0;
            DateTime dtmin = DateTime.Today.AddYears(-10);
            for (int i = 0; i < wks.Length; i++)
            {
                ChannelWorker wk = wks[i];
                if (null == wk || wk.RegionID != region)
                    continue;
                if (wk.DtIn < dtmin && wk.DtRein < dtmin)
                    continue;
                if (wk.DtOut < dtmin && wk.DtReout < dtmin)
                    sum++;
                else
                {
                    DateTime dtin = wk.DtRein > wk.DtIn ? wk.DtRein : wk.DtIn;
                    DateTime dtout = wk.DtReout > wk.DtOut ? wk.DtReout : wk.DtOut;
                    if (dtout < dtin) sum++;
                }
            }
            DataRow[] drs = tabRegionSum.Select("ID='" + region + "'");
            if (drs.Length > 0)
                tag = basefun.setvaltag(tag, "注册人员", Convert.ToString(drs[0]["注册人员"]));
            tag = basefun.setvaltag(tag, "入内人员", Convert.ToString(sum));
            NameValueCollection nvclient = new NameValueCollection();
            string[,] map ={ { "id", cmdid }, { "cmd", "TransFile.extend" }, { "service", "readwkregion" }, { "len", "0" } };
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
        /// 在列表中查找员工记录
        /// </summary>
        /// <param name="cardnum">卡号</param>
        /// <returns>返回区域员工信息</returns>
        ChannelWorker findRecord(string workercode)
        {
            Monitor.Enter(listwk);
            ChannelWorker[] wks = listwk.ToArray();
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
            for (int i = 0, len = wks.Length; i < len; i++)
            {
                if (workercode != wks[i].WorkerCode)
                    continue;
                return wks[i];
            }
            return null;
        }
        /// <summary>
        /// 检查记录，超时离开的记录删除
        /// </summary>
        private void checkRecord()
        {
            DateTime dtmin = DateTime.Now.AddYears(-10);
            DateTime dtvalid = DateTime.Now.AddDays(-2);
            DateTime dtout = DateTime.Now.AddHours(-1);
            Monitor.Enter(listwk);
            for (int i = listwk.Count-1; i > -1; i--)
            {
                ChannelWorker wk = listwk[i];
                if (null == wk)
                {
                    listwk.RemoveAt(i);
                    continue;
                }
                if (wk.DtReout > dtvalid || wk.DtRein > dtvalid || wk.DtOut > dtout || wk.DtIn > dtout)
                    continue;
                listwk.RemoveAt(i);
            }
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
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
                DateTime dtnow = DateTime.Now;
                if (0 == dtnow.Minute && 0 == dtnow.Hour % 3)
                    ResetRecord();
                else
                    checkRecord();
            }
            catch (Exception ex)
            {
                ServiceTool.LogMessage(ex, null, EventLogEntryType.Error);
            }
            isRuning = false;
        }

        /// <summary>
        /// 每间隔3个小时重置记录一次
        /// </summary>
        public void ResetRecord()
        {
            NameObjectList ps = new NameObjectList();
            DataTable t = query.getTable("工作区人员数汇总", ps);
            if (null != t) tabRegionSum = t;
            DataTable tab = query.getTable("卡号通道状态", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            List<ChannelWorker> list = new List<ChannelWorker>();
            string[] cols ={ "部门", "部门ID", "部门代码", "姓名", "用户编号", "卡号", "门名称", "区域", "区域ID", "卡号NUM", "卡片序列号", "卡片SN" };
            foreach (DataRow dr in tab.Rows)
            {
                string[] info = new string[12];
                for (int i = 0; i < cols.Length; i++)
                {
                    if (tab.Columns.Contains(cols[i]))
                        info[i] = Convert.ToString(dr[cols[i]]);
                }
                ChannelWorker wk = new ChannelWorker(info[0], info[1], info[2], info[3], "", info[4], info[5], info[6], info[7], info[8], "", "", "");
                wk.DtIn = DBNull.Value == dr["进入时间"] ? DateTime.MinValue : Convert.ToDateTime(dr["进入时间"]);
                wk.DtRein = DBNull.Value == dr["重进时间"] ? DateTime.MinValue : Convert.ToDateTime(dr["重进时间"]);
                wk.DtOut = DBNull.Value == dr["出离时间"] ? DateTime.MinValue : Convert.ToDateTime(dr["出离时间"]);
                wk.DtReout = DBNull.Value == dr["重出时间"] ? DateTime.MinValue : Convert.ToDateTime(dr["重出时间"]);
                wk.Memo = Convert.ToString(dr["刷卡状态"]);
                wk.CardNUM = info[9];
                wk.CardID = info[10];
                wk.CardSN = info[11];
                list.Add(wk);
            }
            Monitor.Enter(listwk);
            listwk.Clear();
            foreach (ChannelWorker wk in list)
                listwk.Add(wk);
            Monitor.PulseAll(listwk);
            Monitor.Exit(listwk);
        }

    }

    /// <summary>
    /// 通道区域员工动态数据
    /// </summary>
    class ChannelWorker
    {
        /// <summary>
        /// 构造函数：部门，姓名，卡号，时间，区域，状态
        /// </summary>
        public ChannelWorker(string dept, string deptID, string deptcode, string wkname, string picpath, string wkcode, string cardnum, string channel, string region, string regionID, string strtype, string strInOut, string memo)
        {
            SetWorker(dept, deptID, deptcode, wkname, picpath, wkcode, cardnum, channel, region, regionID, strtype, strInOut, memo);
        }
        /// <summary>
        /// 更新数据：部门，部门ID，部门代码，姓名，卡号，时间，区域，状态
        /// </summary>
        public void SetWorker(string dept, string deptID, string deptcode, string wkname, string picpath, string wkcode, string cardnum, string channel, string region, string regionID, string strtype, string strInOut, string memo)
        {
            DtReceive=DateTime.Now;
            DeptName = dept;
            DeptID = deptID;
            DeptCode = deptcode;
            WorkerName = wkname;
            PicPath = picpath;
            WorkerCode = wkcode;
            CardNum = cardnum;
            Channel = channel;
            Region = region;
            RegionID = regionID;
            Memo = memo;
            if (string.IsNullOrEmpty(strtype))
                strtype = "进";
            DateTime dtmin = DateTime.Now.AddYears(-10);
            DateTime dt = DateTime.MinValue;
            try
            {
                dt = string.IsNullOrEmpty(strInOut) ? DateTime.MinValue : Convert.ToDateTime(strInOut);
            }
            catch { }
            if (dt < dtmin)
                return;
            if ("进" == strtype)
            {
                if (DtIn < dtmin || DtOut > DtIn)
                    DtIn = dt;
                else
                    DtRein = dt;
            }
            else
            {
                if (DtIn > DtOut)
                    DtOut = dt;
                else
                    DtReout = dt;
            }
            dtmin = DateTime.Now.AddDays(-2);
            if(DtRein>dtmin||DtReout>dtmin)
                Memo = "多进多出";
        }
        /// <summary>
        /// 字段数据转换为tag标记格式字符串
        /// </summary>
        /// <returns>记录输出tag标记格式字符串</returns>
        public string ToTagString()
        {
            DateTime dtmin = DateTime.Now.AddYears(-10);
            string[,] tag ={ { "部门", DeptName }, { "部门ID", DeptID }, { "部门代码", DeptCode }, { "姓名", WorkerName }, { "照片", PicPath }, { "用户编号", WorkerCode }, { "卡号", CardNum }, 
                            { "通道", Channel }, { "区域", Region }, { "区域ID", RegionID }, { "卡号NUM", CardNUM }, { "卡片序列号", CardID }, { "卡片SN", CardSN }, 
                            { "进入时间", dtmin > DtIn ? "" : DtIn.ToString("yyyy-MM-dd HH:mm:ss") }, { "出离时间", dtmin > DtOut ? "" : DtOut.ToString("yyyy-MM-dd HH:mm:ss") }, 
                            { "重进时间", dtmin > DtRein ? "" : DtRein.ToString("yyyy-MM-dd HH:mm:ss") }, { "重出时间", dtmin > DtReout ? "" : DtReout.ToString("yyyy-MM-dd HH:mm:ss") }, 
                            { "刷新时间", dtmin > DtReceive ? "" : DtReceive.ToString("yyyy-MM-dd HH:mm:ss") }, { "状态", Memo } };
            string info = "";
            for (int i = 0, len = tag.GetLength(0); i < len; i++)
                info = basefun.setvaltag(info, tag[i, 0], tag[i, 1]);
            DateTime dtin = DtIn > DtRein ? DtIn : DtRein;
            DateTime dtout = DtOut > DtReout ? DtOut : DtReout;
            if (dtin < dtmin && dtout < dtmin)
                info = basefun.setvaltag(info, "进出状态", "");
            else
                info = basefun.setvaltag(info, "进出状态", dtout > dtin ? "出" : "进");
            return info;
        }
        /// <summary>
        /// 数据更新的时间
        /// </summary>
        public DateTime DtReceive = DateTime.Now;
        /// <summary>
        /// 部门名称
        /// </summary>
        public string DeptName;
        /// <summary>
        /// 部门ID
        /// </summary>
        public string DeptID;
        /// <summary>
        /// 部门代码
        /// </summary>
        public string DeptCode;
        /// <summary>
        /// 员工姓名
        /// </summary>
        public string WorkerName;
        /// <summary>
        /// 员工照片
        /// </summary>
        public string PicPath;
        /// <summary>
        /// 员工编号
        /// </summary>
        public string WorkerCode;
        /// <summary>
        /// 卡号
        /// </summary>
        public string CardNum;
        /// <summary>
        /// 卡片写入的卡号
        /// </summary>
        public string CardNUM;
        /// <summary>
        /// 卡片序列号
        /// </summary>
        public string CardID;
        /// <summary>
        /// 卡片SN号
        /// </summary>
        public string CardSN;
        /// <summary>
        /// 经过通道
        /// </summary>
        public string Channel;
        /// <summary>
        /// 区域名称
        /// </summary>
        public string Region;
        /// <summary>
        /// 区域ID
        /// </summary>
        public string RegionID;
        /// <summary>
        /// 进入区域的时间
        /// </summary>
        public DateTime DtIn;
        /// <summary>
        /// 离开区域的时间
        /// </summary>
        public DateTime DtOut;
        /// <summary>
        /// 重复进入区域的时间
        /// </summary>
        public DateTime DtRein;
        /// <summary>
        /// 重复离开区域的时间
        /// </summary>
        public DateTime DtReout;
        /// <summary>
        /// 备注信息
        /// </summary>
        public string Memo;
    }
}
