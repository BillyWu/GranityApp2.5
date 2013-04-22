using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using Estar.Business.DataManager;
using Estar.Common.Tools;

namespace winService
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 加载数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btLoadData_Click(object sender, EventArgs e)
        {
            QueryDataRes query = new QueryDataRes("resources");
            DataTable tab = query.getTable("orggroup", new NameObjectList());
            //字段：ID、PID、名称、代码
        }

       }
}