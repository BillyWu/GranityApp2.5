using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Threading;
using System.Data.SqlClient;
using System.Configuration;

namespace winZeonGather
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void btAddFile_Click(object sender, EventArgs e)
        {
            DialogResult dlresult = this.dlOpenFile.ShowDialog();
            if (DialogResult.OK != dlresult)
                return;
            foreach (string file in this.dlOpenFile.FileNames)
            {
                if (this.lbFiles.Items.Contains(file))
                    continue;
                this.lbFiles.Items.Add(file);
            }
        }

        private void btCheck_Click(object sender, EventArgs e)
        {
            this.btCheck.Enabled = false;
            this.btAddFile.Enabled = false;
            Dictionary<string, DateTime> list = new Dictionary<string, DateTime>();
            for (int i = 0; i < this.lbFiles.Items.Count; i++)
            {
                string file = Convert.ToString(this.lbFiles.Items[i]);
                if (!File.Exists(file)) continue;
                list.Add(file, File.GetLastWriteTime(file));
            }
            List<string> files = new List<string>();
            foreach (string f in list.Keys)
            {
                DateTime dt = list[f];
                for (int i = 0; i < files.Count; i++)
                {
                    string k = files[i];
                    if (dt < list[k])
                    {
                        files.Insert(i, f);
                        break;
                    }
                }
                if (!files.Contains(f))
                    files.Add(f);
            }
            this.dtToday = dtpToday.Value.Date;
            this.pbRead.Value = 0;
            isFinish = false;
            tmIndex = 0;
            ThreadPool.QueueUserWorkItem(new WaitCallback(checkRecord), files);
            tmExecute.Start();
        }
        int tmIndex = 0;
        private void tmExecute_Tick(object sender, EventArgs e)
        {
            for (; tmIndex < result.Count; tmIndex++)
                this.tbResult.AppendText(result[tmIndex] + "\r\n");
            if (recordIndex > this.pbRead.Maximum)
                recordIndex = recordIndex % this.pbRead.Maximum;
            this.pbRead.Value = recordIndex;
            this.lbFileName.Text = strFile;
            this.lbMsg.Text = strMsg;
            if (!isFinish) return;
            Thread.Sleep(10);
            if (tmIndex < result.Count)
                return;
            
            this.pbRead.Value = this.pbRead.Maximum;
            result.Clear();
            isFinish = false;
            recordIndex = 0;
            this.btAddFile.Enabled = true;
            this.btCheck.Enabled = true;
            tmExecute.Stop();
        }

        string strFile;
        string strMsg;

        DateTime dtToday = DateTime.Today;
        List<string> result = new List<string>();
        int recordIndex = 0;
        bool isFinish = false;

        private void checkRecord(object list)
        {
            List<string> files = list as List<string>;
            if (null == files) files = new List<string>();
            string strcarddt = ",";
            string strcnn = ConfigurationManager.AppSettings["dbcnn"];
            SqlCommand cmd = new SqlCommand("select count(*) ��¼�� from Eatery.���Ѽ�¼ where ����=@���� and ����=@����", new SqlConnection(strcnn));
            cmd.Parameters.Add("����", SqlDbType.DateTime);
            cmd.Parameters.Add("����", SqlDbType.VarChar, 20);
            if (string.IsNullOrEmpty(strcnn))
                files = new List<string>();

            int pos = -1;
            string st = "@{�豸��ַ}=" + Convert.ToString(this.numStation.Value) + ",";
            StreamReader fread;
            cmd.Connection.Open();

            foreach (string f in files)
            {
                strFile = Path.GetFileName(f);
                fread = new StreamReader(f, Encoding.GetEncoding("GB2312"));
                while (!fread.EndOfStream)
                {
                    Thread.Sleep(50);
                    string line = fread.ReadLine();
                    strMsg = line;
                    if (line.Length < 15) continue;
                    if (!line.Contains("����") || !line.Contains("@") || !line.Contains("@{֡ͷ}=C0"))
                        continue;
                    string tag = line.Substring(line.IndexOf("@"));
                    if (!tag.Contains(st))
                        continue;
                    int index = tag.IndexOf("@{��¼ָ��}=") + 8;
                    if (index < 8) continue;
                    string rdindex = tag.Substring(index, tag.IndexOf(",", index) - index);
                    if (pos < 0)
                    {
                        result.Add("�ɼ�����¼ָ�룺" + rdindex);
                        int.TryParse(rdindex, out pos);
                    }
                    if (rdindex != Convert.ToString(pos) && rdindex != Convert.ToString(pos - 1))
                    {
                        try
                        {
                            if (pos > Convert.ToInt32(rdindex))
                                continue;
                        }
                        catch { }
                        result.Add("��¼�жϣ�" + Convert.ToString(pos) + "    " + line);
                        int.TryParse(rdindex, out pos);
                    }
                    if (rdindex == Convert.ToString(pos - 1))
                        pos--;

                    index = tag.IndexOf("@{����}=") + 6;
                    string cardnum = tag.Substring(index, tag.IndexOf(",", index) - index);
                    index = tag.IndexOf("@{����ʱ��}=") + 8;
                    string strdt = tag.Substring(index, tag.IndexOf(",", index) - index);
                    DateTime dt = Convert.ToDateTime(strdt);
                    if (dt < dtToday.AddMonths(-3) || dt > dtToday.AddMonths(3))
                        result.Add("���ڳ��ޣ�" + cardnum + " # " + strdt + "    " + line);
                    cmd.Parameters["����"].Value = dt;
                    cmd.Parameters["����"].Value = cardnum;
                    index = strcarddt.IndexOf("," + cardnum + "#" + strdt + "#");
                    if (index > -1)
                    {
                        if (0 > strcarddt.IndexOf("," + cardnum + "#" + strdt + "#" + rdindex + ","))
                            result.Add("��¼�ظ���" + cardnum + " # " + strdt + "    " + line);
                    }
                    else
                    {
                        strcarddt += cardnum + "#" + strdt + "#" + rdindex + ",";
                        int sum = Convert.ToInt32(cmd.ExecuteScalar());
                        if (sum < 1)
                            result.Add("��¼��ʧ��" + cardnum + " # " + strdt + "    " + line);
                    }
                    pos++;
                    recordIndex++;
                }
                result.Add("�ļ�������¼ָ�룺" + Convert.ToString(pos) + "    " + f);
                fread.Close();
            }
            cmd.Connection.Close();
            isFinish = true;
        }

    }
}