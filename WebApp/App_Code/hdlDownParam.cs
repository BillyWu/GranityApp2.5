using System;
using System.Web;
using System.IO;
using System.Net;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using Estar.Common.Tools;
using Granity.communications;
using Granity.commiServer;
using Granity.CardOneCommi;

namespace Granity.Web
{
    /// <summary>
    /// 处理下载设备控制参数及更新设备黑白名单
    /// </summary>
    public class hdlDownParam : IHttpHandler
    {
        /// <summary>
        /// 请求参数
        /// </summary>
        class reqParam
        {
            /// <summary>
            /// 请求标识guid
            /// </summary>
            public string reqid;
            /// <summary>
            /// 请求刷新时间
            /// </summary>
            public DateTime dtreq = DateTime.Now;
            /// <summary>
            /// 设备ID，以"|"分割分割
            /// </summary>
            public string reqdev;
            /// <summary>
            /// 完成参数下载后的信息列表,信息以tag格式：设备ID，完成时间
            /// </summary>
            public List<string> taglist = new List<string>();
        }

        /// <summary>
        /// 缓存请求信息，在全部设备参数下载完毕并返回前台脚本后移除请求信息
        /// 在请求刷新时间超过1分钟则自动清除信息
        /// </summary>
        static Dictionary<string, reqParam> reqlist = new Dictionary<string, reqParam>();

        public void ProcessRequest(HttpContext context)
        {
            //设备ID和下载指令,tag格式,其中多个设备和指令需以"|"分割
            StreamReader reader = new StreamReader(context.Request.InputStream);
            string tag = reader.ReadToEnd();
            if (string.IsNullOrEmpty(tag))
                return;
            string cmd = basefun.valtag(tag, "指令");
            if ("设备同步黑白名单" == cmd)
            {
                SynDeviceParam syn = new SynDeviceParam();
                string msg = syn.downCardALL();
                bool success = true;
                if (!string.IsNullOrEmpty(msg))
                {
                    success = false;
                    msg = basefun.setvaltag("", "提示", msg);
                }
                msg = basefun.setvaltag(msg, "成功", success ? "true" : "false");
                context.Response.Write(msg);
            }
            Debug.WriteLine(DateTime.Now.ToString("HH:mm.ss.fff") + " 发出请求");
            string reqid = basefun.valtag(tag, "reqID");
            //已经在处理请求的返回结果信息
            if (reqlist.ContainsKey(reqid))
            {
                reqParam reqparam = reqlist[reqid];
                reqparam.dtreq = DateTime.Now;
                string[] devs = new string[0];
                if (!string.IsNullOrEmpty(reqparam.reqdev))
                    devs = reqparam.reqdev.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                if (reqparam.taglist.Count >= devs.Length)
                    reqlist.Remove(reqid);
                string msg = "";
                foreach (string t in reqparam.taglist)
                    msg += t + ";";
                Debug.WriteLine(DateTime.Now.ToString("HH:mm.ss.fff") + " 结果：" + msg);
                context.Response.Write(msg);
                return;
            }
            List<string> keys = new List<string>();
            foreach (string k in reqlist.Keys)
                keys.Add(k);
            DateTime dt = DateTime.Now.AddMinutes(-1);
            foreach (string k in keys)
            {
                if (reqlist[k].dtreq < dt)
                    reqlist.Remove(k);
            }
            string devid = basefun.valtag(tag, "设备ID");
            if (string.IsNullOrEmpty(reqid) || string.IsNullOrEmpty(devid) || string.IsNullOrEmpty(cmd))
                return;
            reqParam param = new reqParam();
            param.reqid = reqid;
            param.reqdev = devid;
            reqlist.Add(reqid, param);
            //对设备启动或停止监控, patrol持续巡检
            CommiManager mgr = CommiManager.GlobalManager;
            CommiTarget target = getService();
            NameValueCollection info = new NameValueCollection();

            string tagdev = basefun.setvaltag("", "reqID", reqid);
            tagdev = basefun.setvaltag(tagdev, "指令", cmd);
            string[] devids = devid.Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < devids.Length; i++)
            {
                tagdev = basefun.setvaltag(tagdev, "设备ID", devids[i]);
                //暂停巡检
                info["device"] = devids[i];
                if (null != target)
                {
                    CmdFileTrans cmdtrans = new CmdFileTrans(false);
                    cmdtrans.ExtService(CmdSrvType.HaltDevice, info);
                    mgr.SendCommand(target, cmdtrans, true);
                }
                ThreadManager.QueueUserWorkItem(delegate(object obj) { syncommi(obj); }, tagdev);
            }
        }

        /// <summary>
        /// 下载设备参数
        /// </summary>
        /// <param name="tagdev">设备下载参数指令，tag格式</param>
        private static void syncommi(object objtag)
        {
            string tagdev = Convert.ToString(objtag);
            string reqid = basefun.valtag(tagdev, "reqID");
            SynDeviceParam syn = new SynDeviceParam();
            Debug.WriteLine(DateTime.Now.ToString("HH:mm.ss.fff") + " 启动通讯：" + reqid);
            bool success = syn.CommiDevice(tagdev);
            Debug.WriteLine(DateTime.Now.ToString("HH:mm.ss.fff") + " 完成通讯：" + reqid + "   " + (success ? "成功" : "失败"));
            if (!reqlist.ContainsKey(reqid))
                return;
            reqParam param = reqlist[reqid];
            string devid = basefun.valtag(tagdev, "设备ID");
            tagdev = basefun.setvaltag("", "设备ID", devid);
            tagdev = basefun.setvaltag(tagdev, "成功", success ? "true" : "false");
            tagdev = basefun.setvaltag(tagdev, "完成时间", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            param.taglist.Add(tagdev);
        }
        /// <summary>
        /// 是否包含指定设备ID
        /// </summary>
        /// <param name="devID">设备ID</param>
        /// <returns>返回true/false</returns>
        public static bool Contains(string devID)
        {
            if (string.IsNullOrEmpty(devID))
                return false;
            List<string> keys = new List<string>();
            foreach (string k in reqlist.Keys)
                keys.Add(k);
            foreach (string k in keys)
            {
                reqParam req = reqlist[k];
                if (null == req || string.IsNullOrEmpty(req.reqdev))
                    continue;
                if (reqlist[k].reqdev.Contains(devID))
                    return true;
            }
            return false;
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