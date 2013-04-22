using System;
using System.Web;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.ServiceProcess;

using Estar.Common.Tools;
using Estar.Business.DataManager;
using Granity.communications;
using Granity.commiServer;
using Granity.CardOneCommi;

namespace Granity.Web
{
    /// <summary>
    /// 员工动态
    /// </summary>
    public class hdlWorkerMonitor : IHttpHandler
    {
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
            string response = "";
            cmdtrans.TimeOut = new TimeSpan(0, 0, 0, 0, 600);
            cmdtrans.TimeFailLimit = new TimeSpan(0, 0, 0, 2);
            switch (cmd)
            {
                //定时巡检数据
                case "getrecord":
                    string dtcheck = ps["dtUpdate"];
                    string depts = ps["depts"];
                    DateTime dt = Convert.ToDateTime(dtcheck);
                    response = this.getChannelRecord(dt, depts);
                    break;
                //定时巡检数据
                case "getrdregion":
                    string dtrefresh = ps["dtUpdate"];
                    string regions = ps["regions"];
                    DateTime dt2 = Convert.ToDateTime(dtrefresh);
                    response = this.getRegionRecord(dt2, regions);
                    break;
                //定时巡检数据
                case "getregionsum":
                    string region = ps["region"];
                    response = this.getRegionSum(region);
                    break;
            }
            context.Response.Write(response);
        }

        /// <summary>
        /// 获取道闸进出新记录(指定部门的)
        /// </summary>
        /// <param name="dt">时间点</param>
        /// <param name="depts">部门ID集</param>
        /// <returns>转换成表格数据</returns>
        public string getChannelRecord(DateTime dtNow, string depts)
        {
            if (string.IsNullOrEmpty(depts))
                return "";
            string[] dept = depts.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            string rdformat = "<Row><Dept>{0}</Dept><Dt>{1}</Dt><Data>{2}</Data></Row>";
            string data = "";
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            info.Add("response", "false");
            info.Add("dt", dtNow.ToString("yyyy-MM-dd HH:mm:ss"));
            for (int i = 0; i < dept.Length; i++)
            {
                info["dept"] = dept[i];
                cmdtrans.ExtService(CmdSrvType.ReadWorkerChannel, info);
                mgr.SendCommand(target, cmdtrans, true);
                if (!cmdtrans.EventWh.WaitOne(1800, false))
                    continue;
                byte[] response = cmdtrans.ResponseData;
                byte[] header = SvrFileTrans.GetFileheader(response);
                NameValueCollection infores = SvrFileTrans.ParseInfo(header);
                long len = 0;
                string dt = infores["dt"];
                long.TryParse(infores["len"], out len);
                if ("true" == infores["isrefreshHTML"])
                {
                    //页面重载使其从数据库同步
                    data += string.Format(rdformat, dept[i], dt, "@isrefreshHTML=true");
                    break;
                }
                if (len < 1 || len + header.Length > response.LongLength)
                    continue;
                byte[] bttag = new byte[len];
                Array.Copy(response, header.Length, bttag, 0, len);
                string tag = Encoding.GetEncoding("GB2312").GetString(bttag);
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 道闸员工监控：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 道闸员工监控：" + tag);
                string[] tags = tag.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                for (int j = 0; j < tags.Length; j++)
                    data += string.Format(rdformat, dept[i], dt, tags[j]);
            }
            return data;
        }
        /// <summary>
        /// 获取道闸进出新记录(指定区域的)
        /// </summary>
        /// <param name="dt">时间点</param>
        /// <param name="depts">部门ID集</param>
        /// <returns>转换成表格数据</returns>
        public string getRegionRecord(DateTime dtNow, string regions)
        {
            if (string.IsNullOrEmpty(regions))
                return "";
            string[] region = regions.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            string rdformat = "<Row><Region>{0}</Region><Dt>{1}</Dt><Data>{2}</Data></Row>";
            string data = "";
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            info.Add("response", "false");
            info.Add("dt", dtNow.ToString("yyyy-MM-dd HH:mm:ss"));
            for (int i = 0; i < region.Length; i++)
            {
                info["region"] = region[i];
                cmdtrans.ExtService(CmdSrvType.ReadWorkerRegion, info);
                mgr.SendCommand(target, cmdtrans, true);
                if (!cmdtrans.EventWh.WaitOne(1800, false))
                    continue;
                byte[] response = cmdtrans.ResponseData;
                byte[] header = SvrFileTrans.GetFileheader(response);
                NameValueCollection infores = SvrFileTrans.ParseInfo(header);
                long len = 0;
                string dt = infores["dt"];
                long.TryParse(infores["len"], out len);
                if ("true" == infores["isrefreshHTML"])
                {
                    //页面重载使其从数据库同步
                    data += string.Format(rdformat, region[i], dt, "@isrefreshHTML=true");
                    break;
                }
                if (len < 1 || len + header.Length > response.LongLength)
                    continue;
                byte[] bttag = new byte[len];
                Array.Copy(response, header.Length, bttag, 0, len);
                string tag = Encoding.GetEncoding("GB2312").GetString(bttag);
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 工作区员工监控：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 工作区员工监控：" + tag);
                string[] tags = tag.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                for (int j = 0; j < tags.Length; j++)
                    data += string.Format(rdformat, region[i], dt, tags[j]);
            }
            return data;
        }
        /// <summary>
        /// 获取道闸进出新记录
        /// </summary>
        /// <param name="region">区域ID集</param>
        /// <returns>转换成表格数据</returns>
        public string getRegionSum(string region)
        {
            if (string.IsNullOrEmpty(region))
                return "";
            string[] regions = region.ToLower().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            string rdformat = "<Row><Dept>{0}</Dept><Dt>{1}</Dt><Data>{2}</Data></Row>";
            string data = "";
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();
            info.Add("response", "false");
            for (int i = 0; i < regions.Length; i++)
            {
                info["region"] = regions[i];
                cmdtrans.ExtService(CmdSrvType.ReadRegionSum, info);
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
                Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 道闸人数监控：" + tag);
                myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " 道闸人数监控：" + tag);
                string[] tags = tag.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                for (int j = 0; j < tags.Length; j++)
                    data += string.Format(rdformat, regions[i], dt, tags[j]);
            }
            return data;
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

    }
}