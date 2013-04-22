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
            SqlCommand cmd = new SqlCommand("select count(*) 记录数 from Eatery.消费记录 where 日期=@日期 and 卡号=@卡号", new SqlConnection(strcnn));
            cmd.Parameters.Add("日期", SqlDbType.DateTime);
            cmd.Parameters.Add("卡号", SqlDbType.VarChar, 20);
            if (string.IsNullOrEmpty(strcnn))
                files = new List<string>();

            int pos = -1;
            string st = "@{设备地址}=" + Convert.ToString(this.numStation.Value) + ",";
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
                    if (!line.Contains("解析") || !line.Contains("@") || !line.Contains("@{帧头}=C0"))
                        continue;
                    string tag = line.Substring(line.IndexOf("@"));
                    if (!tag.Contains(st))
                        continue;
                    int index = tag.IndexOf("@{记录指针}=") + 8;
                    if (index < 8) continue;
                    string rdindex = tag.Substring(index, tag.IndexOf(",", index) - index);
                    if (pos < 0)
                    {
                        result.Add("采集起点记录指针：" + rdindex);
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
                        result.Add("记录中断：" + Convert.ToString(pos) + "    " + line);
                        int.TryParse(rdindex, out pos);
                    }
                    if (rdindex == Convert.ToString(pos - 1))
                        pos--;

                    index = tag.IndexOf("@{卡号}=") + 6;
                    string cardnum = tag.Substring(index, tag.IndexOf(",", index) - index);
                    index = tag.IndexOf("@{消费时间}=") + 8;
                    string strdt = tag.Substring(index, tag.IndexOf(",", index) - index);
                    DateTime dt = Convert.ToDateTime(strdt);
                    if (dt < dtToday.AddMonths(-3) || dt > dtToday.AddMonths(3))
                        result.Add("日期超限：" + cardnum + " # " + strdt + "    " + line);
                    cmd.Parameters["日期"].Value = dt;
                    cmd.Parameters["卡号"].Value = cardnum;
                    index = strcarddt.IndexOf("," + cardnum + "#" + strdt + "#");
                    if (index > -1)
                    {
                        if (0 > strcarddt.IndexOf("," + cardnum + "#" + strdt + "#" + rdindex + ","))
                            result.Add("记录重复：" + cardnum + " # " + strdt + "    " + line);
                    }
                    else
                    {
                        strcarddt += cardnum + "#" + strdt + "#" + rdindex + ",";
                        int sum = Convert.ToInt32(cmd.ExecuteScalar());
                        if (sum < 1)
                            result.Add("记录丢失：" + cardnum + " # " + strdt + "    " + line);
                    }
                    pos++;
                    recordIndex++;
                }
                result.Add("文件结束记录指针：" + Convert.ToString(pos) + "    " + f);
                fread.Close();
            }
            cmd.Connection.Close();
            isFinish = true;
        }

    }
}