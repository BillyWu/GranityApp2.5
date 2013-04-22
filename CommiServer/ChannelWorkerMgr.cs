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
    /// ͨ������Ա����̬����
    /// </summary>
    public class ChannelWorkerMgr
    {
        /// <summary>
        /// ����Ա����̬
        /// </summary>
        private List<ChannelWorker> listwk = new List<ChannelWorker>();
        /// <summary>
        /// ��ѯ����������
        /// </summary>
        private static QueryDataRes query = new QueryDataRes("������");
        /// <summary>
        /// ��������Ա��
        /// </summary>
        private DataTable tabRegionSum = null;
        /// <summary>
        /// ����ʱ������ʱ���ö�̬���������ݿ�ͬ���˶�
        /// </summary>
        private System.Timers.Timer tmService = new System.Timers.Timer();
        bool isRuning = false;

        public ChannelWorkerMgr()
        {
            //10����ִ��һ��
            tmService.Interval = 600000;
            tmService.Elapsed += new ElapsedEventHandler(tmService_Elapsed);
            tmService.Enabled = true;
            tmService.Start();
            ResetRecord();
        }
        /// <summary>
        /// ��������ͨ����¼
        /// </summary>
        /// <param name="tag">tag��ʽ��¼����</param>
        public void setPassChannel(string tag)
        {
            string[] info ={ "����", "����ID", "���Ŵ���", "����", "����", "��Ƭ", "�û����", "ͨ��", "����", "����ID", "����������", "ˢ��ʱ��", "״̬", "����NUM", "��Ƭ���к�", "��ƬSN" };
            for (int i = 0; i < info.Length; i++)
            {
                string val = basefun.valtag(tag, info[i]);
                info[i] = !string.IsNullOrEmpty(val) ? val : basefun.valtag(tag, "{" + info[i] + "}");
            }
            if (string.IsNullOrEmpty(info[0]) || string.IsNullOrEmpty(info[7]) || string.IsNullOrEmpty(info[11]) || "��������" != info[12])
                return;
            string strtype = info[10];
            string idx = basefun.valtag(tag, "������");
            if (("2" == idx || "3" == idx) && ("������" == strtype || "�����" == strtype))
                strtype = "��";
            else
                strtype = "��";
            setPassChannel(info[0], info[1], info[2], info[3], info[4], info[5], info[6], info[7], info[8], info[9], strtype, info[11], info[12], info[13], info[14], info[15]);
        }
        /// <summary>
        /// ��������ͨ����¼
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
        /// ��ȡ��̬Ա����Ϣ
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='readwkchannel',id, dept='deptid',dt='yyyy-MM-dd HH:mm:ss'</param>
        /// <param name="client">�ͻ���������Ϣ</param>
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
        /// ��ȡ��������̬Ա����Ϣ
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='readwkregion',id, region='deptid',dt='yyyy-MM-dd HH:mm:ss'</param>
        /// <param name="client">�ͻ���������Ϣ</param>
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
        /// ��ȡ������Ϣ
        /// </summary>
        /// <param name="info">ָ�����ݣ�service='readregionsum',id, region='regionid'</param>
        /// <param name="client">�ͻ���������Ϣ</param>
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
                tag = basefun.setvaltag(tag, "ע����Ա", Convert.ToString(drs[0]["ע����Ա"]));
            tag = basefun.setvaltag(tag, "������Ա", Convert.ToString(sum));
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
        /// ���б��в���Ա����¼
        /// </summary>
        /// <param name="cardnum">����</param>
        /// <returns>��������Ա����Ϣ</returns>
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
        /// ����¼����ʱ�뿪�ļ�¼ɾ��
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
        /// ��ʱ��ִ��,��ʱ�����Ч�豸
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
        /// ÿ���3��Сʱ���ü�¼һ��
        /// </summary>
        public void ResetRecord()
        {
            NameObjectList ps = new NameObjectList();
            DataTable t = query.getTable("��������Ա������", ps);
            if (null != t) tabRegionSum = t;
            DataTable tab = query.getTable("����ͨ��״̬", ps);
            if (null == tab || tab.Rows.Count < 1)
                return;
            List<ChannelWorker> list = new List<ChannelWorker>();
            string[] cols ={ "����", "����ID", "���Ŵ���", "����", "�û����", "����", "������", "����", "����ID", "����NUM", "��Ƭ���к�", "��ƬSN" };
            foreach (DataRow dr in tab.Rows)
            {
                string[] info = new string[12];
                for (int i = 0; i < cols.Length; i++)
                {
                    if (tab.Columns.Contains(cols[i]))
                        info[i] = Convert.ToString(dr[cols[i]]);
                }
                ChannelWorker wk = new ChannelWorker(info[0], info[1], info[2], info[3], "", info[4], info[5], info[6], info[7], info[8], "", "", "");
                wk.DtIn = DBNull.Value == dr["����ʱ��"] ? DateTime.MinValue : Convert.ToDateTime(dr["����ʱ��"]);
                wk.DtRein = DBNull.Value == dr["�ؽ�ʱ��"] ? DateTime.MinValue : Convert.ToDateTime(dr["�ؽ�ʱ��"]);
                wk.DtOut = DBNull.Value == dr["����ʱ��"] ? DateTime.MinValue : Convert.ToDateTime(dr["����ʱ��"]);
                wk.DtReout = DBNull.Value == dr["�س�ʱ��"] ? DateTime.MinValue : Convert.ToDateTime(dr["�س�ʱ��"]);
                wk.Memo = Convert.ToString(dr["ˢ��״̬"]);
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
    /// ͨ������Ա����̬����
    /// </summary>
    class ChannelWorker
    {
        /// <summary>
        /// ���캯�������ţ����������ţ�ʱ�䣬����״̬
        /// </summary>
        public ChannelWorker(string dept, string deptID, string deptcode, string wkname, string picpath, string wkcode, string cardnum, string channel, string region, string regionID, string strtype, string strInOut, string memo)
        {
            SetWorker(dept, deptID, deptcode, wkname, picpath, wkcode, cardnum, channel, region, regionID, strtype, strInOut, memo);
        }
        /// <summary>
        /// �������ݣ����ţ�����ID�����Ŵ��룬���������ţ�ʱ�䣬����״̬
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
                strtype = "��";
            DateTime dtmin = DateTime.Now.AddYears(-10);
            DateTime dt = DateTime.MinValue;
            try
            {
                dt = string.IsNullOrEmpty(strInOut) ? DateTime.MinValue : Convert.ToDateTime(strInOut);
            }
            catch { }
            if (dt < dtmin)
                return;
            if ("��" == strtype)
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
                Memo = "������";
        }
        /// <summary>
        /// �ֶ�����ת��Ϊtag��Ǹ�ʽ�ַ���
        /// </summary>
        /// <returns>��¼���tag��Ǹ�ʽ�ַ���</returns>
        public string ToTagString()
        {
            DateTime dtmin = DateTime.Now.AddYears(-10);
            string[,] tag ={ { "����", DeptName }, { "����ID", DeptID }, { "���Ŵ���", DeptCode }, { "����", WorkerName }, { "��Ƭ", PicPath }, { "�û����", WorkerCode }, { "����", CardNum }, 
                            { "ͨ��", Channel }, { "����", Region }, { "����ID", RegionID }, { "����NUM", CardNUM }, { "��Ƭ���к�", CardID }, { "��ƬSN", CardSN }, 
                            { "����ʱ��", dtmin > DtIn ? "" : DtIn.ToString("yyyy-MM-dd HH:mm:ss") }, { "����ʱ��", dtmin > DtOut ? "" : DtOut.ToString("yyyy-MM-dd HH:mm:ss") }, 
                            { "�ؽ�ʱ��", dtmin > DtRein ? "" : DtRein.ToString("yyyy-MM-dd HH:mm:ss") }, { "�س�ʱ��", dtmin > DtReout ? "" : DtReout.ToString("yyyy-MM-dd HH:mm:ss") }, 
                            { "ˢ��ʱ��", dtmin > DtReceive ? "" : DtReceive.ToString("yyyy-MM-dd HH:mm:ss") }, { "״̬", Memo } };
            string info = "";
            for (int i = 0, len = tag.GetLength(0); i < len; i++)
                info = basefun.setvaltag(info, tag[i, 0], tag[i, 1]);
            DateTime dtin = DtIn > DtRein ? DtIn : DtRein;
            DateTime dtout = DtOut > DtReout ? DtOut : DtReout;
            if (dtin < dtmin && dtout < dtmin)
                info = basefun.setvaltag(info, "����״̬", "");
            else
                info = basefun.setvaltag(info, "����״̬", dtout > dtin ? "��" : "��");
            return info;
        }
        /// <summary>
        /// ���ݸ��µ�ʱ��
        /// </summary>
        public DateTime DtReceive = DateTime.Now;
        /// <summary>
        /// ��������
        /// </summary>
        public string DeptName;
        /// <summary>
        /// ����ID
        /// </summary>
        public string DeptID;
        /// <summary>
        /// ���Ŵ���
        /// </summary>
        public string DeptCode;
        /// <summary>
        /// Ա������
        /// </summary>
        public string WorkerName;
        /// <summary>
        /// Ա����Ƭ
        /// </summary>
        public string PicPath;
        /// <summary>
        /// Ա�����
        /// </summary>
        public string WorkerCode;
        /// <summary>
        /// ����
        /// </summary>
        public string CardNum;
        /// <summary>
        /// ��Ƭд��Ŀ���
        /// </summary>
        public string CardNUM;
        /// <summary>
        /// ��Ƭ���к�
        /// </summary>
        public string CardID;
        /// <summary>
        /// ��ƬSN��
        /// </summary>
        public string CardSN;
        /// <summary>
        /// ����ͨ��
        /// </summary>
        public string Channel;
        /// <summary>
        /// ��������
        /// </summary>
        public string Region;
        /// <summary>
        /// ����ID
        /// </summary>
        public string RegionID;
        /// <summary>
        /// ���������ʱ��
        /// </summary>
        public DateTime DtIn;
        /// <summary>
        /// �뿪�����ʱ��
        /// </summary>
        public DateTime DtOut;
        /// <summary>
        /// �ظ����������ʱ��
        /// </summary>
        public DateTime DtRein;
        /// <summary>
        /// �ظ��뿪�����ʱ��
        /// </summary>
        public DateTime DtReout;
        /// <summary>
        /// ��ע��Ϣ
        /// </summary>
        public string Memo;
    }
}
