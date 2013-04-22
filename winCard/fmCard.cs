using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using Granity.CardOneCommi;
using Granity.communications;

namespace winCard
{
    public partial class fmCard : Form
    {
        /// <summary>
        /// ������ʵ��
        /// </summary>
        CmdCard cmdCard = new CmdCard();

        public fmCard()
        {
            InitializeComponent();
        }

        private void bnCommand_Click(object sender, EventArgs e)
        {
            if ("����" == this.bnCommand.Text)
            {
                CommiTarget target = new CommiTarget("COM3", 19200);
                bool su = cmdCard.SetTarget(target, 3, true);
                if (!su)
                {
                    cmdCard.SetTarget(null, -1, true);
                    MessageBox.Show("��������Ѳ�죡", "��ʾ", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                this.tmRefresh.Start();
                this.bnCommand.Text = "ֹͣ";
            }
            else
            {
                this.tmRefresh.Stop();
                cmdCard.SetTarget(null, -1, true);
                this.lbState.Text = "";
                this.bnCommand.Text = "����";
            }
        }

        private void tmRefresh_Tick(object sender, EventArgs e)
        {
            if (this.lbState.Text.Length > 5)
                this.lbState.Text = "";
            else
                this.lbState.Text += "��";
            this.tbCardID.Text = cmdCard.CardID;
            this.tbCardNum.Text = cmdCard.CardNum;
        }

        private void fmCard_Load(object sender, EventArgs e)
        {
            this.lbState.Text = "";
        }

        private void fmCard_FormClosed(object sender, FormClosedEventArgs e)
        {
            CommiManager.GlobalManager.ClearCommand();
            ThreadManager.AbortAll();
            CommiManager.GlobalManager.ResetClient();
            Application.Exit();
        }
    }
}