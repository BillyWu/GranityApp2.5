#region 版本说明

/*
 * 功能内容：   可使用ZNetCom的设备UDP通讯口搜索工具类
 *
 * 作    者：   王荣策
 *
 * 审 查 者：   王荣策
 *
 * 日    期：   2010-07-27
 */

#endregion

using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using Granity.communications;
using System.Threading;
using System.Text.RegularExpressions;
using System.IO.Ports;

namespace Granity.winTools
{
    /// <summary>
    /// 可使用ZNetCom的设备UDP通讯口搜索工具类
    ///     该工具通过广播8800和8801端口搜索设备
    /// </summary>
    public static class CmdUDPznetCom
    {
        /// <summary>
        /// 初始广播指令
        /// </summary>
        private const string initcmd = "A1 15 02 00 00 FF";
        /// <summary>
        /// 初始广播端口
        /// </summary>
        private const int initport = 8800;
        /// <summary>
        /// 获取信息指令,含UDP物理地址参数和指令号(A1 14 00 02 00/A1 14 00 02 02)
        /// </summary>
        private const string infocmd = "00 02 00 02 {0} {1} 00 FF";
        /// <summary>
        /// 修改信息确认指令，含UDP物理地址参数
        /// </summary>
        private const string infomdi = "00 02 00 02 {0} A1 14 00 02 81 00 FF";
        /// <summary>
        /// 搜索门禁设备
        /// </summary>
        private const string searcmd = "7E FF FF 01 11 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 10 02 0D";
        /// <summary>
        /// 广播门禁设备通讯端口号,60000
        /// </summary>
        private const int searport=60000;
        /// <summary>
        /// 获取信息广播端口
        /// </summary>
        private const int infoport = 8801;
        private static Protocol ptlznet = new Protocol();
        /// <summary>
        /// Znet协议规则
        /// </summary>
        private static Protocol ptlZnet
        {
            get
            {
                if (ptlznet.FrameHeader.Length > 0)
                    return ptlznet;
                ptlznet.FrameHeader = new byte[] { 0x00, 0x02, 0x00, 0x02 };
                ptlznet.FrameFoot = new byte[] { 0x00, 0xFF };
                ptlznet.KeyIndexStart = -1;
                ptlznet.KeyLength = 0;
                return ptlznet;
            }
        }
        /// <summary>
        /// IP4地址校验
        /// </summary>
        private static Regex regIPaddr = new Regex(@"^((?:\b(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))(:\d+)?$", RegexOptions.Compiled);
        /// <summary>
        /// 物理地址校验
        /// </summary>
        private static Regex regMacaddr = new Regex(@"^(?:[\da-fA-F]{1,2}-){5}(?:[\da-fA-F]{1,2})$", RegexOptions.Compiled);
        /// <summary>
        /// 搜索网络内支持UDP通讯的设备信息,设备信息使用tag格式数据
        /// </summary>
        /// <returns>返回tag格式数据信息</returns>
        public static string[] SearchUDPnet()
        {
            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, initport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(ptlZnet);

            DateTime dtStart = DateTime.Now;
            CommandBase cmd = new CommandBase(false);
            cmd.TimeSendInv = new TimeSpan(0, 0, 50);
            cmd.TimeOut = new TimeSpan(0, 0, 2);
            cmd.TimeFailLimit = new TimeSpan(0, 0, 5);
            cmd.TimeLimit = new TimeSpan(0, 0, 20);
            cmd.IsResposeHandle = isRpsZnet;

            cmd.setCommand(initcmd, true);
            cmd.ResponseHandle += new EventHandler<ResponseEventArgs>(cmd_ResponseHandle);
            CommiManager.GlobalManager.SendCommand(target, cmd);
            //广播搜索，有多个设备返回信息，直到超时停止接收
            List<string> infolist = cmd.Tag as List<string>;
            while (cmd.EventWh.WaitOne(cmd.TimeLimit, false) && DateTime.Now - dtStart < cmd.TimeLimit)
            {
                infolist = cmd.Tag as List<string>;
                if (null == infolist || infolist.Count < 1)
                    continue;
                string[] infos = infolist.ToArray();
                bool iscomplete = true;
                for (int i = 0; i < infos.Length; i++)
                {
                    if (!string.IsNullOrEmpty(basefun.valtag(infos[i], "工作端口")))
                        continue;
                    iscomplete = false;
                    break;
                }
                if (iscomplete)
                    break;
            }
            cmd.TimeSendInv = new TimeSpan(0, 0, -10);
            CommiManager.GlobalManager.RemoveCommand(target, cmd);
            //返回搜索结果
            infolist = cmd.Tag as List<string>;
            cmd.Tag = null;
            if (null == infolist || infolist.Count < 1)
                return new string[0];
            return infolist.ToArray();
        }
        /// <summary>
        /// 接收广播反馈,需要多次交互获取完整信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private static void cmd_ResponseHandle(object sender, ResponseEventArgs e)
        {
            if (null == sender || !(sender is CommandBase) || null == e || !e.Success || null == e.Response || e.Response.Length < 1)
                return;
            CommandBase cmd = sender as CommandBase;
            string rsl = CommandBase.Parse(cmd.ResponseData, true);
            //检查功能码：搜索功能，获取网络信息，获取详细信息
            string codesearch  = "A1FD000922";
            string codedetailA = "A114010200";
            string codedetailB = "A114010202";
            string code = parseFunCode(rsl);
            string addr = parseAddrMac(rsl);
            if (codesearch != code && codedetailA != code && codedetailB != code)
                return;

            //格式参数：普通/物理地址/IP地址/文本/数字
            string[] formatinit ={ "功能码,10,5;", "物理地址,4,6", "IP地址,17,4;", "", "" };
            string[] formatdtlA ={"功能码,10,5;", "物理地址,4,6",
                                    "IP地址,47,4;子网掩码,51,4;网关IP,55,4;DNS服务器,59,4;",
                                    "设备名称,15,16;密码,31,5;",
                                    "网页端口,71,1;命令端口,72,2;"};
            string[] formatdtlB ={ "功能码,10,5;", "物理地址,4,6", "","",
                                    "工作方式,15,1;工作端口,16,2;超时断开时间,18,3;心跳时间,21,1;波特率,26,3;数据位,29,1;停止位,30,1;校验位,31,1;"};
            formatdtlB[4] += "分包长度,32,3;帧间隔,35,2;目标端口1,47,2;目标端口2,49,2;目标端口3,51,2;目标端口4,53,2;目标端口5,55,2;目标端口6,57,2;目标端口7,59,2;目标端口8,61,2;";

            //读取信息列表
            List<string> infolist = new List<string>();
            if (null == cmd.Tag)
                cmd.Tag = infolist;

            int index = -1;
            infolist = cmd.Tag as List<string>;
            for (int i = 0; i < infolist.Count; i++)
            {
                if (addr != basefun.valtag(infolist[i], "物理地址"))
                    continue;
                index = i;
                break;
            }
            string info = "";
            if (index > -1)
                info = infolist[index];
            if (codesearch == code)
                info = parseDetail(rsl, info, formatinit[0], formatinit[1], formatinit[2], formatinit[3], formatinit[4], false);
            else if (codedetailA == code)
                info = parseDetail(rsl, info, formatdtlA[0], formatdtlA[1], formatdtlA[2], formatdtlA[3], formatdtlA[4], false);
            else if (codedetailB == code)
                info = parseDetail(rsl, info, formatdtlB[0], formatdtlB[1], formatdtlB[2], formatdtlB[3], formatdtlB[4], false);
            if (index > -1)
                infolist[index] = info;
            else
                infolist.Add(info);

            //最后一步获取详细信息后结束
            if (codedetailB == code)
                return;
            //再获取网络信息，最后获取详细信息
            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, infoport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(ptlZnet);
            string strcmd = string.Format(infocmd, addr.Replace("-", " "), codesearch == code ? "A114000200" : "A114000202");
            CommandBase cmdNext = new CommandBase();
            //使用相同的同步事件，可动态检测UDP搜索反馈结果
            cmdNext.EventWh = cmd.EventWh;
            cmdNext.Tag = cmd.Tag;
            cmdNext.ResponseHandle += new EventHandler<ResponseEventArgs>(cmd_ResponseHandle);
            cmdNext.IsResposeHandle = isResponseCmd;
            cmdNext.setCommand(strcmd, true);
            CommiManager.GlobalManager.SendCommand(target, cmdNext);
        }
        /// <summary>
        /// 判断是否是指令的响应
        /// </summary>
        /// <param name="cmd">指令</param>
        /// <param name="response">响应字节</param>
        /// <returns>是否匹配</returns>
        private static bool isRpsZnet(CommandBase cmd, byte[] response)
        {
            if (response.Length < 25 || response.Length > 25)
                return false;
            byte[] rqs = new byte[] { 0xA1, 0xFD, 0x00, 0x09, 0x22 };
            for (int i = 10; i < 15; i++)
            {
                if (rqs[i-10] != response[i])
                    return false;
            }
            return true;
        }
        /// <summary>
        /// 判断是否是指令的响应
        /// </summary>
        /// <param name="cmd">指令</param>
        /// <param name="response">响应字节</param>
        /// <returns>是否匹配</returns>
        private static bool isResponseCmd(CommandBase cmd, byte[] response)
        {
            byte[] request = cmd.getCommand();
            if (null == request || request.Length < 15 || response.Length < 15)
                return false;
            if (0 != request[12] || 1 != response[12])
                return false;
            for (int i = 0; i < 15; i++)
            {
                if (12 == i) continue;
                if (request[i] != response[i])
                    return false;
            }
            return true;
        }

        /// <summary>
        /// 解析响应结果,读取其中的物理地址
        /// </summary>
        /// <param name="response">通讯响应结果,16进制字符串</param>
        /// <returns>返回物理地址,非法数据则返回空字符</returns>
        private static string parseAddrMac(string response)
        {
            string header = "00020002", end = "00FF";
            if (string.IsNullOrEmpty(response) || !response.StartsWith(header) || !response.EndsWith(end))
                return "";
            //解析mac地址和IP地址
            string addrmac = response.Substring(header.Length, 12);
            for (int i = addrmac.Length - 2; i > 0; i -= 2)
                addrmac = addrmac.Substring(0, i) + "-" + addrmac.Substring(i);
            return addrmac;
        }

        /// <summary>
        /// 解析响应结果,读取其中的功能代码
        /// </summary>
        /// <param name="response">通讯响应结果,16进制字符串</param>
        /// <returns>返回功能代码</returns>
        private static string parseFunCode(string response)
        {
            string header = "00020002", end = "00FF";
            if (string.IsNullOrEmpty(response) || !response.StartsWith(header) || !response.EndsWith(end))
                return "";
            //解析功能代码
            string funcode = response.Substring(header.Length+12, 10);
            return funcode;
        }

        /// <summary>
        /// 搜索网络内支持UDP通讯的设备信息,设备信息使用tag格式数据
        /// </summary>
        /// <returns>返回tag格式数据信息</returns>
        public static string[] SearchUDPDoor()
        {
            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, searport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(Protocol.PTLDoor);

            DateTime dtStart = DateTime.Now;
            CommandBase cmd = new CommandBase(false);
            cmd.TimeSendInv = new TimeSpan(0, 0, 50);
            cmd.TimeOut = new TimeSpan(0, 0, 2);
            cmd.TimeFailLimit = new TimeSpan(0, 0, 5);
            cmd.TimeLimit = new TimeSpan(0, 0, 20);
            cmd.IsResposeHandle = isRpsDoor;

            cmd.setCommand(searcmd, true);
            cmd.ResponseHandle += new EventHandler<ResponseEventArgs>(cmd_RpsDoorHandle);
            CommiManager.GlobalManager.SendCommand(target, cmd);
            //广播搜索，有多个设备返回信息，直到超时停止接收
            List<string> infolist = cmd.Tag as List<string>;
            while (cmd.EventWh.WaitOne(cmd.TimeLimit, false) && DateTime.Now - dtStart < cmd.TimeLimit)
            {
                cmd.EventWh.Reset();
            }
            cmd.TimeSendInv = new TimeSpan(0, 0, -10);
            CommiManager.GlobalManager.RemoveCommand(target, cmd);
            //返回搜索结果
            infolist = cmd.Tag as List<string>;
            cmd.Tag = null;
            if (null == infolist || infolist.Count < 1)
                return new string[0];
            return infolist.ToArray();
        }
        /// <summary>
        /// 接收广播反馈,需要多次交互获取完整信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private static void cmd_RpsDoorHandle(object sender, ResponseEventArgs e)
        {
            if (null == sender || !(sender is CommandBase) || null == e || !e.Success || null == e.Response || e.Response.Length < 1)
                return;
            CommandBase cmd = sender as CommandBase;
            string rsl = CommandBase.Parse(cmd.ResponseData, true);
            //格式参数：普通/物理地址/IP地址/文本/数字
            string[] formatinfo ={ "功能码,3,2;",
                                     "物理地址,5,6", "IP地址,11,4;子网掩码,15,4;网关IP,19,4;",
                                     "",
                                    "站址,1,2;工作端口,23,2;"};
            //读取信息列表
            List<string> infolist = new List<string>();
            if (null == cmd.Tag)
                cmd.Tag = infolist;
            infolist = cmd.Tag as List<string>;
            string info = parseDetail(rsl, "", formatinfo[0], formatinfo[1], formatinfo[2], formatinfo[3], formatinfo[4], true);
            infolist.Add(info);
        }
        /// <summary>
        /// 判断是否是搜索门禁指令的响应
        /// </summary>
        /// <param name="cmd">门禁搜索指令</param>
        /// <param name="response">响应字节</param>
        /// <returns>是否匹配</returns>
        private static bool isRpsDoor(CommandBase cmd, byte[] response)
        {
            if (response.Length < 34 || response.Length > 34)
                return false;
            byte[,] rqs = new byte[,] { { 0x01, 0x11 }, { 0xF2, 0x11 } };
            bool isrps = true;
            for (int b = 0; b < 2; b++)
            {
                for (int i = 3; i < 5; i++)
                {
                    if (rqs[b, i - 3] == response[i])
                        continue;
                    isrps = false;
                    break;
                }
                if (isrps) break;
                isrps = true;
            }
            return isrps;
        }

        /// <summary>
        /// 设置通讯ZNetCom模块IP地址端口号及网关
        /// </summary>
        /// <param name="macaddr">物理地址,为空则忽略操作</param>
        /// <param name="ipaddr">IP地址,为空则忽略操作</param>
        /// <param name="maskcode">子网掩码，为空保持原值</param>
        /// <param name="gateway">网关，为空保持原值</param>
        /// <returns>修改是否成功</returns>
        public static bool SetTCPIPZnet(string macaddr, string ipaddr, string maskcode, string gateway)
        {
            if (string.IsNullOrEmpty(macaddr) || string.IsNullOrEmpty(ipaddr) || !regMacaddr.IsMatch(macaddr) || !regIPaddr.IsMatch(ipaddr))
                return false;
            //读取IP地址
            string strcmd = string.Format(infocmd, macaddr.Replace("-", " "), "A114000200");
            
            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, infoport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(ptlznet);
            CommandBase cmd = new CommandBase(false);
            cmd.TimeOut = new TimeSpan(0, 0, 0, 0, 300);
            cmd.TimeFailLimit = new TimeSpan(0, 0, 1);
            cmd.TimeLimit = new TimeSpan(0, 0, 3);
            cmd.IsResposeHandle = isResponseCmd;
            cmd.setCommand(strcmd, true);
            CommiManager.GlobalManager.SendCommand(target, cmd);
            if (!cmd.EventWh.WaitOne(cmd.TimeFailLimit, false))
                return false;
            //修改设备信息
            string response = CommandBase.Parse(cmd.ResponseData, true);
            if (ipaddr.Contains(":"))
                ipaddr = ipaddr.Substring(0, ipaddr.IndexOf(":"));
            ipaddr = convertHEX(ipaddr, ".", false);
            maskcode = convertHEX(maskcode, ".", false);
            gateway = convertHEX(gateway, ".", false);
            string funcode = "A1FE01030000";
            string[] cmdfun ={ funcode, ipaddr, maskcode, gateway };
            int[,] cmdpos ={ { 10, 5 }, { 47, 4 }, { 51, 4 }, { 55, 4 } };
            int leninv = 0;
            for (int i = 0; i < cmdfun.Length; i++)
            {
                if (string.IsNullOrEmpty(cmdfun[i]))
                    continue;
                response = response.Substring(0, cmdpos[i, 0] * 2 + leninv) + cmdfun[i] 
                           + response.Substring(cmdpos[i, 0] * 2 + leninv + cmdpos[i, 1] * 2, response.Length);
                leninv += cmdfun[i].Length - cmdpos[i, 1] * 2;
            }
            //发送修改指令，再发送确认指令
            cmd.setCommand(response, true);
            cmd.ResetState();
            CommiManager.GlobalManager.SendCommand(target, cmd);
            cmd.EventWh.WaitOne(cmd.TimeFailLimit, false);
            strcmd = string.Format(infomdi, macaddr.Replace("-", ""));
            cmd.setCommand(strcmd, true);
            cmd.ResetState();
            CommiManager.GlobalManager.SendCommand(target, cmd);
            cmd.EventWh.WaitOne(cmd.TimeFailLimit, false);
            return true;
        }

        /// <summary>
        /// 设置通讯ZNetCom模块端口好，及串口波特率
        /// </summary>
        /// <param name="macaddr">物理地址,为空则忽略操作</param>
        /// <param name="netport">网络端口</param>
        /// <param name="baudRate">波特率</param>
        /// <param name="parity">奇偶校验</param>
        /// <param name="dataBits">数据位</param>
        /// <param name="stopBits">停止位</param>
        /// <returns>修改是否成功</returns>
        public static bool SetSerialZnet(string macaddr, int netport, int baudRate, Parity parity, int dataBits, StopBits stopBits)
        {
            if (string.IsNullOrEmpty(macaddr) || netport < 0 || netport > 0xFFFF || baudRate < 0 || baudRate > 0xFFFFFF || dataBits < 5 || dataBits > 8)
                return false;
            //读取串口通讯
            string strcmd = string.Format(infocmd, macaddr.Replace("-", " "), "A114010202");

            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, infoport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(ptlznet);
            CommandBase cmd = new CommandBase(false);
            cmd.TimeOut = new TimeSpan(0, 0, 0, 0, 300);
            cmd.TimeFailLimit = new TimeSpan(0, 0, 1);
            cmd.TimeLimit = new TimeSpan(0, 0, 3);
            cmd.IsResposeHandle = isResponseCmd;
            cmd.setCommand(strcmd, true);
            CommiManager.GlobalManager.SendCommand(target, cmd);
            if (!cmd.EventWh.WaitOne(cmd.TimeFailLimit, false))
                return false;
            //修改设备信息
            string response = CommandBase.Parse(cmd.ResponseData, true);
            string funcode = "A1FE01030200";
            string strport = Convert.ToString(netport, 16).PadLeft(4, '0');
            string strbaud = Convert.ToString(baudRate, 16).PadLeft(6, '0');
            string strdata = Convert.ToString(dataBits, 16).PadLeft(2, '0');
            string strstop = StopBits.None == stopBits ? "00" : StopBits.One == stopBits ? "01" : "02";
            string strpartity = Parity.None == parity ? "00" : Parity.Even == parity ? "01" : Parity.Odd == parity ? "02" : Parity.Mark == parity ? "03" : "04";
            string[] cmdfun ={ funcode, strport, strbaud, strdata, strstop, strpartity };
            int[,] cmdpos ={ { 10, 5 }, { 16, 2 }, { 26, 3 }, { 29, 1 }, { 30, 1 }, { 31, 1 } };
            int leninv = 0;
            for (int i = 0; i < cmdfun.Length; i++)
            {
                if (string.IsNullOrEmpty(cmdfun[i]) || string.IsNullOrEmpty(cmdfun[i].Replace("0", "")))
                    continue;
                response = response.Substring(0, cmdpos[i, 0] * 2 + leninv) + cmdfun[i]
                           + response.Substring(cmdpos[i, 0] * 2 + leninv + cmdpos[i, 1] * 2, response.Length);
                leninv += cmdfun[i].Length - cmdpos[i, 1] * 2;
            }
            //发送修改指令，再发送确认指令
            cmd.setCommand(response, true);
            cmd.ResetState();
            CommiManager.GlobalManager.SendCommand(target, cmd);
            cmd.EventWh.WaitOne(cmd.TimeFailLimit, false);
            strcmd = string.Format(infomdi, macaddr.Replace("-", ""));
            cmd.setCommand(strcmd, true);
            cmd.ResetState();
            CommiManager.GlobalManager.SendCommand(target, cmd);
            cmd.EventWh.WaitOne(cmd.TimeFailLimit, false);
            return true;
        }
        /// <summary>
        /// 设置门禁IP地址端口号及网关；无IP地址忽略操作，无其它则默认保持原来的值
        /// </summary>
        /// <param name="station">站址序列号</param>
        /// <param name="ipaddr">IP地址</param>
        /// <param name="maskcode">掩码，默认255.255.255.0</param>
        /// <param name="gateway">网关</param>
        /// <param name="macaddr">物理地址</param>
        public static bool SetTCPIPDoor(int station, string ipaddr, string maskcode, string gateway, string macaddr)
        {
            //校验参数格式
            if (station < 0 || station > 65534 || string.IsNullOrEmpty(ipaddr) || !regIPaddr.IsMatch(ipaddr))
                return false;
            if (!string.IsNullOrEmpty(maskcode) && !regIPaddr.IsMatch(maskcode))
                return false;
            if (!string.IsNullOrEmpty(gateway) && !regIPaddr.IsMatch(gateway))
                return false;
            if (!string.IsNullOrEmpty(macaddr) && !regMacaddr.IsMatch(macaddr))
                return false;
            //网关、掩码或物理地址为空时，使用1102功能码，都需要设置时使用11F2功能码
            string funcode = "F211";
            if (string.IsNullOrEmpty(maskcode) && string.IsNullOrEmpty(gateway) && string.IsNullOrEmpty(macaddr))
                funcode = "0211";
            if (string.IsNullOrEmpty(macaddr))
                macaddr = "00-00-00-00-00-00";
            if (string.IsNullOrEmpty(gateway))
                gateway = "00.00.00.00";
            if (string.IsNullOrEmpty(maskcode))
                maskcode = "00.00.00.00";
            if (maskcode.Contains(":") || gateway.Contains(":"))
                return false;
            string port = "60000";
            int idxp = ipaddr.IndexOf(":");
            if (idxp>0)
            {
                port = ipaddr.Substring(idxp + 1, ipaddr.Length - idxp - 1);
                ipaddr = ipaddr.Substring(0, idxp);
            }
            //转换16进制值
            string stcode = Convert.ToString(station, 16).PadLeft(4, '0');
            port = Convert.ToString(Convert.ToUInt32(port), 16).PadLeft(4, '0').Substring(0, 4);
            ipaddr = convertHEX(ipaddr, ".", false);
            gateway = convertHEX(gateway, ".", false);
            maskcode = convertHEX(maskcode, ".", false);
            macaddr = convertHEX(macaddr, "-", true);
            //计算校验码
            string codevali = sumValiHex(string.Format("{0} {1} {2} {3} {4} {5} {6}", stcode, funcode, macaddr, ipaddr, maskcode, gateway, port));
            codevali = codevali.PadLeft(4, '0');
            codevali = codevali.Substring(codevali.Length - 4, 4);
            string strcmd = string.Format("7E {0} {1} {2} {3} {4} {5} {6} 00 00 00 00 00 00 {7} 0D", 
                                          stcode, funcode, macaddr, ipaddr, maskcode, gateway, port, codevali);
            //设置执行指令
            IPEndPoint srv = new IPEndPoint(IPAddress.Broadcast, searport);
            CommiTarget target = new CommiTarget(srv, CommiType.UDP);
            target.setProtocol(Protocol.PTLDoor);

            CommandBase cmd = new CommandBase(false);
            cmd.TimeOut = new TimeSpan(0, 0, 0, 0, 500);
            cmd.TimeFailLimit = new TimeSpan(0, 0, 3);
            cmd.TimeLimit = new TimeSpan(0, 0, 5);
            cmd.IsResposeHandle = isRpsDoor;
            cmd.setCommand(strcmd, true);
            CommiManager.GlobalManager.SendCommand(target, cmd);
            if (cmd.EventWh.WaitOne(cmd.TimeFailLimit, false))
                return 1 == cmd.ResponseData[5];
            return false;
        }

        /// <summary>
        /// 转换为16进制字符串，每一分割节为一个字节
        /// </summary>
        /// <param name="value">原格式值</param>
        /// <param name="sp">分隔符</param>
        /// <param name="isHEXsrc">原值是否是HEX值</param>
        /// <returns>返回HEX值</returns>
        private static string convertHEX(string value, string sp,bool isHEXsrc)
        {
            if (string.IsNullOrEmpty(value))
                return "";
            string[] valarray ={ value };
            if (!string.IsNullOrEmpty(sp))
                valarray = value.Split(sp.ToCharArray(), StringSplitOptions.None);
            string rtn = "";
            foreach (string val in valarray)
            {
                if (string.IsNullOrEmpty(val))
                    rtn += "00";
                else if (isHEXsrc)
                    rtn += val.PadLeft(2, '0').Substring(0, 2);
                else
                    rtn += Convert.ToString(Convert.ToUInt32(val), 16).PadLeft(2, '0').Substring(0, 2);
            }
            return rtn;
        }
        /// <summary>
        /// 计算字符串和校验
        /// </summary>
        /// <param name="valhex">16进制字符串</param>
        /// <returns>返回校验和,不截取和对齐字节位数</returns>
        private static string sumValiHex(string valhex)
        {
            if (string.IsNullOrEmpty(valhex))
                return "";
            valhex = valhex.Replace(" ", "");
            if (1 == valhex.Length % 2)
                valhex = "0" + valhex;
            long sum = 0;
            for (int i = 0, len = valhex.Length; i < len; i += 2)
                sum += Convert.ToInt16(valhex.Substring(i, 2), 16);
            return Convert.ToString(sum, 16);
        }

        /// <summary>
        /// 解析响应结果,生成tag格式的标记详细信息
        /// 格式参数用分号分割,其中名称|索引号|字节长度用逗号分割
        /// </summary>
        /// <param name="response">通讯响应结果,16进制字符串</param>
        /// <param name="taginfo">tag格式结果数据</param>
        /// <param name="format">格式参数,普通格式</param>
        /// <param name="addrmac">格式参数,物理地址类型</param>
        /// <param name="addrip">格式参数,IP地址类型</param>
        /// <param name="txt">格式参数,文本类型</param>
        /// <param name="num">格式参数,数字类型</param>
        /// <param name="chgLH">是否高地位转置</param>
        /// <returns>返回tag格式的详细信息</returns>
        private static string parseDetail(string response, string taginfo, string format, string addrmac, string addrip, string txt, string num,bool chgLH)
        {
            if (string.IsNullOrEmpty(response))
                return "";
            //参数名称,起始索引号,字节长度
            string info = taginfo;
            string[] infos = format.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < infos.Length; i++)
            {
                string[] p = infos[i].Split(",".ToCharArray());
                string val = response.Substring(Convert.ToInt16(p[1]) * 2, Convert.ToInt16(p[2]) * 2);
                info = basefun.setvaltag(info, p[0], val);
            }
            //物理地址格式参数
            infos = addrmac.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < infos.Length; i++)
            {
                string[] p = infos[i].Split(",".ToCharArray());
                string val = response.Substring(Convert.ToInt16(p[1]) * 2, Convert.ToInt16(p[2]) * 2);
                for (int k = val.Length - 2; k > 0; k -= 2)
                    val = val.Substring(0, k) + "-" + val.Substring(k);
                info = basefun.setvaltag(info, p[0], val);
            }
            //IP地址格式参数
            infos = addrip.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < infos.Length; i++)
            {
                string[] p = infos[i].Split(",".ToCharArray());
                string val = response.Substring(Convert.ToInt16(p[1]) * 2, Convert.ToInt16(p[2]) * 2);
                for (int k = val.Length - 2; k > -1; k -= 2)
                {
                    string v = Convert.ToInt16(val.Substring(k, 2), 16).ToString();
                    val = val.Substring(0, k) + "." + v + val.Substring(k + 2);
                }
                info = basefun.setvaltag(info, p[0], val.Substring(1));
            }
            //文本格式参数
            infos = txt.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < infos.Length; i++)
            {
                string[] p = infos[i].Split(",".ToCharArray());
                string val = response.Substring(Convert.ToInt16(p[1]) * 2, Convert.ToInt16(p[2]) * 2);
                byte[] buffer = new byte[val.Length / 2];
                for (int k = 0; k < val.Length; k += 2)
                    buffer[k / 2] = (byte)Convert.ToInt16(val.Substring(k, 2), 16);
                if (chgLH)
                    Array.Reverse(buffer);
                val = CommandBase.Parse(buffer);
                val = val.Replace("\0", "");
                info = basefun.setvaltag(info, p[0], val);
            }
            //数字格式参数
            infos = num.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < infos.Length; i++)
            {
                string[] p = infos[i].Split(",".ToCharArray());
                string val = response.Substring(Convert.ToInt16(p[1]) * 2, Convert.ToInt16(p[2]) * 2);
                if (chgLH)
                {
                    string temp = "";
                    for (int k = val.Length - 2; k > -1; k -= 2)
                        temp += val.Substring(k, 2);
                    val = temp;
                }
                val = Convert.ToInt64(val, 16).ToString();
                info = basefun.setvaltag(info, p[0], val);
            }

            return info;
        }
    }
}
