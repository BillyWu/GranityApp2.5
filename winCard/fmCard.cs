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
        /// 读卡器实例
        /// </summary>
        CmdCard cmdCard = new CmdCard();

        public fmCard()
        {
            InitializeComponent();
        }

        private void bnCommand_Click(object sender, EventArgs e)
        {
            if ("启动" == this.bnCommand.Text)
            {
                CommiTarget target = new CommiTarget("COM3", 19200);
                bool su = cmdCard.SetTarget(target, 3, true);
                if (!su)
                {
                    cmdCard.SetTarget(null, -1, true);
                    MessageBox.Show("不能启动巡检！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                this.tmRefresh.Start();
                this.bnCommand.Text = "停止";
            }
            else
            {
                this.tmRefresh.Stop();
                cmdCard.SetTarget(null, -1, true);
                this.lbState.Text = "";
                this.bnCommand.Text = "启动";
            }
        }

        private void tmRefresh_Tick(object sender, EventArgs e)
        {
            if (this.lbState.Text.Length > 5)
                this.lbState.Text = "";
            else
                this.lbState.Text += "●";
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