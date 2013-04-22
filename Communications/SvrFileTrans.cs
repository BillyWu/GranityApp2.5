using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using System.Reflection;
using System.Collections.Specialized;
using System.Web;
using System.IO;
using System.Net.Sockets;
using System.Net;
using System.Diagnostics;
using System.Threading;

namespace Granity.communications
{
    /// <summary>
    /// �ļ��ϴ����������˱���,��������ɾ�Ĳ鹦��
    ///     �ļ�ͷЭ���ʽ��1,ʹ��һ����XML��ʽ,����ֵ�������ַ����ּ�.\-����, 2,�������ԣ�id,pathfile,len,cmd,msg
    /// </summary>
    public class SvrFileTrans:ServerBase
    {
        #region �ļ�ͷXML��ʽ����

        /// <summary>
        /// �Ϸ��ַ���֤
        /// </summary>
        private static Regex regFilePath = new Regex(@"^[\w\.]+$", RegexOptions.Compiled);
        /// <summary>
        /// ��֤XML��ʽ
        /// </summary>
        private static Regex regXMLFormat = new Regex(@"^<F(\s+.+?)(/>|></F>)$", RegexOptions.Compiled);
        /// <summary>
        /// �ļ�ͷ��Ϣ��������
        /// </summary>
        private static Regex regAttribute = new Regex("([\\w\\.\\u4E00-\\u9FA5]+)\\s*=\\s*[\"']([\\w\\s\\:\\.\\,\\\\\\u4E00-\\u9FA5-]*)[\"']", RegexOptions.Compiled);
        /// <summary>
        /// �ļ�ͷ��ʼ�ֽ�
        /// </summary>
        private static byte[] fhStart = Encoding.GetEncoding("GB2312").GetBytes("<F");
        /// <summary>
        /// �ļ�ͷ�Է��ʽ��β
        /// </summary>
        private static byte[] fhEndseal = Encoding.GetEncoding("GB2312").GetBytes("/>");
        /// <summary>
        /// �ļ�ͷ�ر�ʽ��β
        /// </summary>
        private static byte[] fhEndclose = Encoding.GetEncoding("GB2312").GetBytes("></F>");

        #endregion

        #region �����ļ�Э��

        /// <summary>
        /// ����Ӧ�ֽ��в���ͷ��Ϣλ��
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <param name="index">Ѱ��ƥ������</param>
        /// <returns>����ͷ��Ϣ��㣬������ͷ��Ϣ����-1</returns>
        public static long FindHeader(byte[] data, long index)
        {
            if (null == data || data.LongLength < 5 || index >= data.LongLength || fhStart.Length + index > data.LongLength)
                return -1;
            if (index < 0) index = 0;
            byte bfirst = fhStart[0];
            long len = data.LongLength;
            int l = fhStart.Length;
            for (long i = index; i < len; i++)
            {
                if (bfirst != data[i])
                    continue;
                if (i + l >= len) break;
                bool ismatch = true;
                for (int j = 1; j < l; j++)
                    if (fhStart[j] != data[i + j])
                        ismatch = false;
                if (ismatch)    return i;
            }
            return -1;
        }
        /// <summary>
        /// ����Ӧ�ֽ��в���ͷ��Ϣλ��
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <returns>����ͷ��Ϣ��㣬������ͷ��Ϣ����-1</returns>
        public static long FindHeader(byte[] data)
        {
            return FindHeader(data, 0);
        }
        /// <summary>
        /// ��Ӧ�ֽڴӼ����㿪ʼ�Ƿ���ͷ��Ϣ
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <param name="index">Ѱ��ƥ������</param>
        /// <returns>�Ƿ�ƥ��ͷ��Ϣ</returns>
        public static bool isFirstHeader(byte[] data, long index)
        {
            if (null == data || data.LongLength < 5 || index >= data.LongLength || fhStart.Length + index > data.LongLength)
                return false;
            //����ļ�ͷ���
            for (long i = 0; i < fhStart.Length; i++)
                if (fhStart[i] != data[i + index])
                    return false;
            return true;
        }
        /// <summary>
        /// ��Ӧ�ֽڴӼ����㿪ʼ�Ƿ���ͷ��Ϣ
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <returns>�Ƿ�ƥ��ͷ��Ϣ</returns>
        public static bool isFirstHeader(byte[] data)
        {
            return isFirstHeader(data, 0);
        }
        /// <summary>
        /// ����Ӧ�ֽ��м��ƥ���ͷ��Ϣ
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <param name="index">Ѱ��ƥ������</param>
        /// <returns>��ͷ��Ϣ����ͷ��Ϣ�ֽ�����,���򷵻�NULL</returns>
        public static byte[] GetFileheader(byte[] data, long index)
        {
            byte[] blank = new byte[0];
            if (null == data || data.LongLength < 5 || index >= data.LongLength || fhStart.Length + index > data.LongLength)
                return blank;
            //����ļ�ͷ���
            for (long i = 0; i < fhStart.Length; i++)
                if (fhStart[i] != data[i + index])
                    return blank;
            //����ļ�ͷ��β
            byte bend = fhEndseal[fhEndseal.Length - 1];
            for (long i = index, len = data.LongLength; i < len; i++)
            {
                if (bend != data[i])
                    continue;
                bool ismatch = true;
                //���ƥ���Է�յ�XML��
                for (long j = i - 1, k = fhEndseal.Length - 2; ismatch && k > -1; k--, j--)
                    if (fhEndseal[k] != data[j])
                        ismatch = false;
                //���ƥ��ڵ�رյ�XML��
                if (!ismatch)
                {
                    if (i <= fhEndclose.Length)
                        continue;
                    ismatch = true;
                    for (long j = i - 1, k = fhEndclose.Length - 2; ismatch && k > -1; k--, j--)
                        if (fhEndclose[k] != data[j])
                            ismatch = false;
                }
                if (!ismatch) continue;
                //ƥ��XML��
                byte[] header = new byte[i + 1 - index];
                Array.Copy(data, index, header, 0, i + 1 - index);
                return header;
            }
            return blank;
        }

        /// <summary>
        /// ����Ӧ�ֽ��м��ƥ���ͷ��Ϣ
        /// </summary>
        /// <param name="data">�����ֽ�</param>
        /// <returns>��ͷ��Ϣ����ͷ��Ϣ�ֽ�����,���򷵻�NULL</returns>
        public static byte[] GetFileheader(byte[] data)
        {
            return GetFileheader(data, 0);
        }

        /// <summary>
        /// ͷ��Ϣ����Ϊ�ֵ��
        /// </summary>
        /// <param name="header">ͷ�ֽ�</param>
        /// <returns>�ֵ��</returns>
        public static NameValueCollection ParseInfo(byte[] header)
        {
            NameValueCollection info = new NameValueCollection();
            if (null == header || header.Length < 1)
                return info;
            string str = Encoding.GetEncoding("GB2312").GetString(header);
            MatchCollection mts = regAttribute.Matches(str);
            foreach (Match m in mts)
            {
                if (null != m && null != m.Groups && m.Groups.Count > 2 && !string.IsNullOrEmpty(m.Groups[1].Value))
                    info[m.Groups[1].Value] = m.Groups[2].Value;
            }
            return info;
        }

        /// <summary>
        /// ͷ��Ϣ����Ϊ�ֵ��
        /// </summary>
        /// <param name="header">ͷ�ֽ�</param>
        /// <returns>�ֵ��</returns>
        public static byte[] ParseInfo(NameValueCollection info)
        {
            if (null == info || info.Count < 1)
                return new byte[0];
            string header = "<F";
            foreach (string k in info.AllKeys)
                header += string.Format(" {0}='{1}'", k, info[k]);
            header += "/>";
            return Encoding.GetEncoding("GB2312").GetBytes(header);
        }

        /// <summary>
        /// �����·��ת������·��
        /// </summary>
        /// <param name="pathfile">����ָ���е����·��</param>
        /// <returns>����·��</returns>
        private static string getLocalPath(string pathfile)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            if (null != HttpContext.Current && null != HttpContext.Current.Server)
                pathfile = HttpContext.Current.Server.MapPath(pathfile);
            else if (!string.IsNullOrEmpty(baseDir))
            {
                if (pathfile.StartsWith("~/"))
                    pathfile = pathfile.Replace("~/", baseDir);
                else if (!pathfile.Contains(":"))
                    pathfile = Path.Combine(baseDir, pathfile);
                pathfile = pathfile.Replace("/", "\\");
            }
            return pathfile;
        }

        /// <summary>
        /// ����Ӧ�������Э��ֳ�������,����ʣ�಻������
        /// </summary>
        /// <param name="buffer">�����ֽ�</param>
        /// <param name="destlist">�������б�</param>
        /// <returns>����ʣ�಻������</returns>
        private static byte[] MergeResponseHdl(byte[] buffer, IList<byte[]> destlist)
        {
            if (null == buffer || buffer.Length < 1 )
                return buffer;

            long index = 0;
            byte bstart = fhStart[0];
            byte[] header = GetFileheader(buffer,index);
            if (header.Length < 1)
            {
                long pos = FindHeader(buffer, index);
                if (pos > -1)
                {
                    index = pos;
                    header = GetFileheader(buffer, index);
                }
            }
            while (null != header && header.Length > 0)
            {
                long flen = 0;
                long hlen = header.LongLength;
                NameValueCollection info = ParseInfo(header);
                try { flen = Convert.ToInt64(info["len"]); }
                catch { }
                //�������ֽڷ���
                if (index + hlen + flen > buffer.LongLength)
                    break;
                //�����ֽڲ������б�
                if (flen > 0)
                {
                    header = new byte[hlen + flen];
                    Array.Copy(buffer, index, header, 0, hlen + flen);
                }
                destlist.Add(header);
                index = index + hlen + flen;
                header = GetFileheader(buffer, index);
                if (header.Length < 1)
                {
                    long pos = FindHeader(buffer, index);
                    if (pos > -1)
                    {
                        index = pos;
                        header = GetFileheader(buffer, index);
                    }
                }
            }
            //���кܳ��ֽ�ʱ��Ȼû������ͷ��Ϣ����Ϊ�ֽ���Ч
            if (index < 1 && buffer.Length > 2000 && (null == header || header.Length < 1))
                return new byte[0];

            if (index < 1) return buffer;
            byte[] temp = new byte[buffer.LongLength - index];
            if (temp.Length > 0)
                Array.Copy(buffer, index, temp, 0, buffer.LongLength - index);
            return temp;
        }

        #endregion

        #region Э�鹦��ָ�����

        private static Dictionary<string, HdlExecute> cmdMap = new Dictionary<string, HdlExecute>();
        /// <summary>
        /// �ṩ�����ָ��ӳ���б�
        /// </summary>
        private  Dictionary<string, HdlExecute> CmdMap
        {
            get
            {
                if (cmdMap.Count < 1)
                {
                    MethodInfo[] mds = this.GetType().GetMethods(BindingFlags.Public | BindingFlags.Instance);
                    foreach (MethodInfo m in mds)
                    {
                        object[] attr = m.GetCustomAttributes(typeof(CommandServerAttribute), false);
                        if (attr.Length < 1) continue;
                        HdlExecute hdl = Delegate.CreateDelegate(typeof(HdlExecute), this, m) as HdlExecute;
                        foreach (CommandServerAttribute cmd in attr)
                        {
                            if (null == cmd) continue;
                            cmdMap.Add(cmd.cmdName, hdl);
                        }
                    }
                }
                return cmdMap;
            }
        }

        /// <summary>
        /// ����ִ�к���,������֡ʱ�������ݻ���
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="data">������������</param>
        /// <param name="bufferStream">�����ֽ���</param>
        /// <returns>������Ӧ����,֡����������0�ֽ�,����������ִ֡�к󷵻���Ӧ���</returns>
        public override byte[] Execute(ClientInfo clientinfo, byte[] data, int len, ref MemoryStream stream)
        {
            IList<byte[]> list = new List<byte[]>();
            byte[] buffer = new byte[0];
            //û��ͷ��Ϣ�ģ������ֽںϲ�����ͷ��Ϣ
            int iM = 1048576;
            if (stream.Position < 1)
            {
                buffer = new byte[stream.Length + len];
                long lenr = stream.Length;
                for (int i = 0; i * iM < lenr; i++)
                    stream.Read(buffer, iM * i, lenr > (i + 1) * iM ? iM : (int)(lenr - i * iM));
                Array.Copy(data, 0, buffer, stream.Length, len);
            }
            else
            {
                //��ȡ������ͷ��Ϣ,ֱ�Ӷ�����
                long pos = stream.Position;
                buffer = new byte[pos];
                stream.Seek(0, SeekOrigin.Begin);
                for (int i = 0; i * iM < pos; i++)
                    stream.Read(buffer, iM * i, pos > (i + 1) * iM ? iM : (int)(pos - i * iM));
                NameValueCollection info = ParseInfo(buffer);
                long flen = Convert.ToInt64(info["len"]);
                stream.Seek(0, SeekOrigin.End);
                //���ֽ�����������
                if (flen > stream.Length + len - pos)
                {
                    stream.Write(data, 0, len);
                    stream.Seek(pos, SeekOrigin.Begin);
                    return new byte[0];
                }
                long lennext = (stream.Length + len - pos - flen);
                if (lennext > len)
                {
                    //�ϴ������Ѿ���������Ϣ
                    long lenr = pos + flen;
                    buffer = new byte[lenr];
                    stream.Seek(0, SeekOrigin.Begin);
                    for (int i = 0; i * iM < lenr; i++)
                        stream.Read(buffer, iM * i, lenr > (i + 1) * iM ? iM : (int)(lenr - i * iM));
                    list.Add(buffer);
                    buffer = new byte[lennext];
                    lenr = stream.Length - pos - flen;
                    for (int i = 0; i * iM < lenr; i++)
                        stream.Read(buffer, iM * i, lenr > (i + 1) * iM ? iM : (int)(lenr - i * iM));
                    Array.Copy(data, buffer, len);
                }
                else
                {
                    //���ֽ��������ֽڼ����б�,�����ֽڼ�������ͷ��Ϣ
                    if (len > lennext)
                        stream.Write(data, 0, len - (int)lennext);
                    list.Add(stream.ToArray());
                    buffer = new byte[lennext];
                    Array.Copy(data, len - lennext, buffer, 0, lennext);
                }
            }
            buffer = MergeResponseHdl(buffer, list);
            if (stream.Length > 0 || buffer.Length > 0)
            {
                stream = new MemoryStream(buffer);
                data = GetFileheader(buffer);
                if (null != data && data.Length > 0)
                    stream.Seek(data.LongLength, SeekOrigin.Begin);
            }
            for (int i = list.Count - 1; i > -1; i--)
            {
                byte[] context = list[i];
                byte[] header = GetFileheader(context);
                NameValueCollection info = ParseInfo(header);
                RequestEventArgs args = new RequestEventArgs(null, this, context);
                int rtn = this.RaiseRequest(args);
                string keycmd = info["cmd"];
                if (string.IsNullOrEmpty(keycmd) || !this.CmdMap.ContainsKey(keycmd))
                {
                    list.RemoveAt(i);
                    continue;
                }
                if (rtn < 0)
                    continue;
                HdlExecute hdl = this.CmdMap[info["cmd"]];
                //ִ��ָ���ȡ��Ӧ���
                try
                {
                    list[i] = hdl(clientinfo, context);
                }
                catch (Exception ex)
                {
                    ExceptionManager.Publish(ex);
                    list.RemoveAt(i);
                }
            }
            //�����Ӧ
            if (list.Count < 1)
                return new byte[0];
            if (list.Count < 2)
                return list[0];
            //�������ʱ�ϲ�����ֽ�
            long lend = 0;
            foreach (byte[] b in list)
                lend += b.LongLength;
            data = new byte[lend];
            lend = 0;
            foreach (byte[] b in list)
            {
                Array.Copy(b, 0, data, lend, b.LongLength);
                lend += b.LongLength;
            }
            return data;
        }

        #endregion

        /// <summary>
        /// ��չ�����¼�
        /// </summary>
        public event EventHandler<ExtendEventArgs> ExtendHandle;

        #region Э��ָ���

        /// <summary>
        /// �����ļ�,ִ�н������
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="context">�ļ�ͷ���ļ�����</param>
        /// <returns>����ִ�н���ļ�ͷ</returns>
        [CommandServer("TransFile.send")]
        public byte[] LoadFile(ClientInfo clientinfo, byte[] context)
        {
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if (string.IsNullOrEmpty(info["id"]) || string.IsNullOrEmpty(info["pathfile"]))
                return new byte[0];
            FileStream fs = null;
            try
            {
                int iM = 1048576;
                string pathfile = getLocalPath(info["pathfile"]);
                string dir = Path.GetDirectoryName(pathfile);
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);
                fs = File.Open(pathfile, FileMode.OpenOrCreate);
                long lenw = context.LongLength - header.Length;
                for (int i = 0; i * iM < lenw; i++)
                    fs.Write(context, iM * i + header.Length, lenw > (i + 1) * iM ? iM : (int)(lenw - i * iM));
                fs.Close();
                info["msg"] = "�ļ�����ɹ�";
                info["success"] = "true";
            }
            catch (Exception ex)
            {
                if (null != fs)
                    fs.Close();
                ExceptionManager.Publish(ex);
                info["msg"] = ex.Message.Replace("\"", "��").Replace("'", "��");
                info["success"] = "false";
            }
            info["len"] = "0";
            return ParseInfo(info);
        }

        /// <summary>
        /// ��ȡ�ļ�,ִ�н������
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="context">�ļ�ͷ���ļ�����</param>
        /// <returns>����ִ�н��ͷ��Ϣ���ļ�����</returns>
        [CommandServer("TransFile.get")]
        public byte[] GetFile(ClientInfo clientinfo, byte[] context)
        {
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if (string.IsNullOrEmpty(info["id"]) || string.IsNullOrEmpty(info["pathfile"]))
                return new byte[0];
            context = new byte[0];
            try
            {
                string pathfile = getLocalPath(info["pathfile"]);
                if (!File.Exists(pathfile))
                {
                    info["msg"] = "�ļ�������";
                    info["success"] = "false";
                }
                else
                {
                    context = File.ReadAllBytes(pathfile);
                    info["msg"] = "�ļ���ȡ�ɹ�";
                    info["success"] = "true";
                }
            }
            catch (Exception ex)
            {
                context = new byte[0];
                ExceptionManager.Publish(ex);
                info["msg"] = ex.Message.Replace("\"", "��").Replace("'", "��");
                info["success"] = "false";
            }
            info["len"] = Convert.ToString(context.LongLength);
            byte[] response = ParseInfo(info);
            if (context.Length > 1)
            {
                byte[] rp = new byte[response.LongLength + context.LongLength];
                Array.Copy(response, rp, response.LongLength);
                Array.Copy(context, 0, rp, response.LongLength, context.LongLength);
                response = rp;
            }
            return response;
        }

        /// <summary>
        /// ɾ���ļ�,ִ�н������
        /// </summary>
        /// <param name="context">�ļ�ͷ���ļ�����</param>
        /// <returns>����ִ�н��ͷ��Ϣ</returns>
        [CommandServer("TransFile.del")]
        public byte[] DelFile(ClientInfo clientinfo, byte[] context)
        {
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if (string.IsNullOrEmpty(info["id"]) || string.IsNullOrEmpty(info["pathfile"]))
                return new byte[0];
            try
            {
                string pathfile = getLocalPath(info["pathfile"]);
                if (File.Exists(pathfile))
                {
                    File.Delete(pathfile);
                    info["msg"] = "�ļ�ɾ���ɹ�";
                    info["success"] = "true";
                }
            }
            catch (Exception ex)
            {
                ExceptionManager.Publish(ex);
                info["msg"] = ex.Message.Replace("\"", "��").Replace("'", "��");
                info["success"] = "false";
            }
            info["len"] = "0";
            return ParseInfo(info);
        }

        /// <summary>
        /// ����,��ִ��ֱ�ӷ���
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="context">�ļ�ͷ���ļ�����</param>
        /// <returns>����ִ�н��ͷ��Ϣ</returns>
        [CommandServer("TransFile.beat")]
        public byte[] HeadBeat(ClientInfo clientinfo, byte[] context)
        {
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if (string.IsNullOrEmpty(info["id"]))
                return new byte[0];
            info["success"] = "true";
            info["len"] = "0";
            return ParseInfo(info);
        }
        /// <summary>
        /// ����ͨѶ,��ΪͨѶ����ת��,�ȴ�������ָ���ִ�����Ӧ���
        ///     ��������: len,dir=request/response,cmd=TransFile.trans,source,target,
        ///               CommiType,addr=ipaddr/COM1,port,baudRate,parity,dataBits,stopBits
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="context">ͷ��Ϣ��Ҫ���͵�ָ�����</param>
        /// <returns>����0�ֽ�,���ﷵ��������Ҫ�����첽����,����Ӧ�¼����ٻش�����</returns>
        [CommandServer("TransFile.trans")]
        public byte[] CommiTrans(ClientInfo clientinfo, byte[] context)
        {
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if (string.IsNullOrEmpty(info["id"]) || string.IsNullOrEmpty(info["dir"])
                || string.IsNullOrEmpty(info["target"]))
                return new byte[0];
            string ipaddr = info["target"];
            if ("response" == info["dir"])
                ipaddr = info["source"];
            else
            {
                info["source"] = clientinfo.IPEndPoint.Substring(0, clientinfo.IPEndPoint.IndexOf(":"));
                byte[] hf = ParseInfo(info);
                byte[] data = new byte[hf.LongLength + context.LongLength - header.LongLength];
                Array.Copy(hf, data, hf.LongLength);
                Array.Copy(context, header.LongLength, data, hf.LongLength, context.LongLength - header.LongLength);
                context = data;
            }
            //����ͻ���������Ϣ����Ӧ�б���
            Monitor.Enter(this);
            ClientInfo[] clients = this.GetClients();
            Monitor.PulseAll(this);
            Monitor.Exit(this);
            foreach (ClientInfo cf in clients)
                if (cf.IPEndPoint.StartsWith(ipaddr + ":"))
                {
                    Monitor.Enter(cf);
                    cf.BufferResponse.Add(context);
                    Monitor.PulseAll(cf);
                    Monitor.Exit(cf);
                }
            return new byte[0];
        }

        /// <summary>
        /// ��չ����ͨѶ,��Ϊϵͳ��չӦ��,�ܹ�������չ�¼�
        ///     ��������: len,cmd=TransFile.extend,��������չ����
        /// </summary>
        /// <param name="client">ͨѶ����</param>
        /// <param name="context">ͷ��Ϣ��Ҫ���͵�ָ�����</param>
        /// <returns>���ش���</returns>
        [CommandServer("TransFile.extend")]
        public byte[] ExtendSrv(ClientInfo clientinfo, byte[] context)
        {
            EventHandler<ExtendEventArgs> handle = this.ExtendHandle;
            if (null == handle)
                return context;
            ExtendEventArgs args = new ExtendEventArgs(this, clientinfo, context);
            //ThreadManager.QueueUserWorkItem(delegate(object obj) { handle(this, obj as ExtendEventArgs); }, args);
            handle(this, args);
            byte[] header = GetFileheader(context);
            NameValueCollection info = ParseInfo(header);
            if ("false" == info["response"])
                return new byte[0];
            info["len"] = "0";
            info["success"] = "true";
            info["msg"] = "������չ�¼�";
            return ParseInfo(info);
        }

        #endregion
    }
}
