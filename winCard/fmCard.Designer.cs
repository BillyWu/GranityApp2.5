namespace winCard
{
    partial class fmCard
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.bnCommand = new System.Windows.Forms.Button();
            this.tmRefresh = new System.Windows.Forms.Timer(this.components);
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.tbCardNum = new System.Windows.Forms.TextBox();
            this.tbCardID = new System.Windows.Forms.TextBox();
            this.lbState = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // bnCommand
            // 
            this.bnCommand.Location = new System.Drawing.Point(54, 89);
            this.bnCommand.Name = "bnCommand";
            this.bnCommand.Size = new System.Drawing.Size(75, 23);
            this.bnCommand.TabIndex = 0;
            this.bnCommand.Text = "启动";
            this.bnCommand.UseVisualStyleBackColor = true;
            this.bnCommand.Click += new System.EventHandler(this.bnCommand_Click);
            // 
            // tmRefresh
            // 
            this.tmRefresh.Tick += new System.EventHandler(this.tmRefresh_Tick);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 21);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 12);
            this.label1.TabIndex = 1;
            this.label1.Text = "卡片序列号：";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(8, 54);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(65, 12);
            this.label2.TabIndex = 2;
            this.label2.Text = "卡片卡号：";
            // 
            // tbCardNum
            // 
            this.tbCardNum.BackColor = System.Drawing.SystemColors.Info;
            this.tbCardNum.Location = new System.Drawing.Point(91, 45);
            this.tbCardNum.Name = "tbCardNum";
            this.tbCardNum.ReadOnly = true;
            this.tbCardNum.Size = new System.Drawing.Size(100, 21);
            this.tbCardNum.TabIndex = 3;
            // 
            // tbCardID
            // 
            this.tbCardID.BackColor = System.Drawing.SystemColors.Info;
            this.tbCardID.Location = new System.Drawing.Point(91, 12);
            this.tbCardID.Name = "tbCardID";
            this.tbCardID.ReadOnly = true;
            this.tbCardID.Size = new System.Drawing.Size(100, 21);
            this.tbCardID.TabIndex = 3;
            // 
            // lbState
            // 
            this.lbState.AutoSize = true;
            this.lbState.ForeColor = System.Drawing.Color.DodgerBlue;
            this.lbState.Location = new System.Drawing.Point(136, 99);
            this.lbState.Name = "lbState";
            this.lbState.Size = new System.Drawing.Size(77, 12);
            this.lbState.TabIndex = 4;
            this.lbState.Text = "●●●●●●";
            // 
            // fmCard
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(235, 138);
            this.Controls.Add(this.lbState);
            this.Controls.Add(this.tbCardID);
            this.Controls.Add(this.tbCardNum);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.bnCommand);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "fmCard";
            this.Text = "巡检读卡";
            this.Load += new System.EventHandler(this.fmCard_Load);
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.fmCard_FormClosed);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button bnCommand;
        private System.Windows.Forms.Timer tmRefresh;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox tbCardNum;
        private System.Windows.Forms.TextBox tbCardID;
        private System.Windows.Forms.Label lbState;
    }
}

