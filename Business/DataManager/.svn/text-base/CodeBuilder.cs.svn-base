using System;
using System.IO;
using System.Configuration;
using System.Data;
using System.Text;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using Estar.Common.Tools;

namespace Estar.Business.DataManager
{
	/// <summary>
	/// 单据编号,条形码的生成
	/// </summary>
	public class CodeBuilder
	{
        /// <summary>
        /// 构造函数
        /// </summary>
        public CodeBuilder()
		{
			//
			// TODO: 在此处添加构造函数逻辑
			//
		}

		/// <summary>
		/// 根据单据类别和部门生成编号
		/// </summary>
		/// <param name="billType">单据类型</param>
		/// <param name="deptCode">部门</param>
		/// <returns></returns>
		static public string	GetBillSn(string	billType,string		deptCode)
		{
			if(""==billType || ""==deptCode)
				return "";
			NameObjectList	paramList=new NameObjectList();
            QueryDataRes query = QueryDataRes.CreateQuerySys();
			paramList.Add("单据类型",billType);
			paramList.Add("部门",deptCode);
            //没有就创建一个
            DataTable tab = query.getTable("单据流水号", paramList);
            if (tab.Rows.Count < 1 || null==tab.Rows[0]["流水号"])
                return "";
            return tab.Rows[0]["流水号"].ToString();
		}

        /// <summary>
        /// 返回一个4位随机码
        /// </summary>
        /// <returns></returns>
        static public string GetRegionCode()
        {
            Random random = new Random();
            string  strcode="";
            int strlen = 0;
            while(4>strlen)
            {
                string  str="";
                int irnd = random.Next();
                if (0 == irnd % 2)
                    str += GenerateCharCode();
                else
                    str += GenerateCharCode(); //GenerateCNCode();
                if (!strcode.Contains(str))
                {
                    strcode += str;
                    strlen++;
                }
            }
            return strcode;
        }

        /// <summary>
        ///  结合前两个方法,写的校验码彩色图片生成,含有噪音线,噪音点
        /// </summary>
        /// <param name="strcode">校验码</param>
        /// <returns>返回生成图片</returns>
        static public Bitmap GenerateValidateImg(string strcode)
        {
            if (null == strcode || string.Empty == strcode || "" == strcode)
                return null;
            Bitmap image = new Bitmap((int)Math.Ceiling((strcode.Length * 25.0)), 25);
            Graphics g = Graphics.FromImage(image);
            //定义颜色
            Color[] c = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Orange, Color.Brown, Color.DarkCyan, Color.Purple };
            //定义字体 
            string[] font = { "Verdana", "Microsoft Sans Serif", "Comic Sans MS", "Arial", "宋体" };
            try
            {
                //生成随机生成器
                Random random = new Random();

                //清空图片背景色
                g.Clear(Color.White);

                //画图片的背景噪音线
                for (int i = 0; i < 2; i++)
                {
                    int x1 = random.Next(image.Width);
                    int x2 = random.Next(image.Width);
                    int y1 = random.Next(image.Height);
                    int y2 = random.Next(image.Height);

                    g.DrawLine(new Pen(Color.Silver), x1, y1, x2, y2);
                }

                LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, image.Width, image.Height), Color.Blue, Color.DarkRed, 1.2f, true);
                //g.DrawString(checkCode, font, brush, 2, 2);

                //输出不同字体和颜色的验证码字符
                for (int i = 0; i < strcode.Length; i++)
                {
                    int cindex = random.Next(c.Length);
                    int findex = random.Next(font.Length);  //字体

                    Font f = new Font(font[font.Length-1], 12, FontStyle.Regular | FontStyle.Bold);
                    Brush b = new SolidBrush(c[cindex]);
                    int ii = random.Next(5);
                    if ((i + 1) % 2 == 0)
                    {
                        ii += 3;
                    }
                    g.DrawString(strcode.Substring(i, 1), f, b, 3 + (i * 20), ii);
                }

                //画图片的前景噪音点
                for (int i = 0; i < 10; i++)
                {
                    int x = random.Next(image.Width);
                    int y = random.Next(image.Height);

                    image.SetPixel(x, y, Color.FromArgb(random.Next()));
                }

                //画图片的边框线
                g.DrawRectangle(new Pen(Color.Silver), 0, 0, image.Width - 1, image.Height - 1);

                return image;
            }
            catch
            {
                g.Dispose();
                image.Dispose();
            }
            return null;
        }

        #region 内部函数
        
        /// <summary>
        /// 生成一个随机数字或字母
        /// </summary>
        /// <returns>返回字符串</returns>
        static private string GenerateCharCode()
        {
            char code;
            string checkCode = String.Empty;

            Random random = new Random();
            int i = random.Next();
            random = new Random();
            int number = random.Next();

            if (i % 2 == 0)
                code = (char)('0' + (char)(number % 10));
            else
                code = (char)('A' + (char)(number % 26));

            return code.ToString();
        }

        /// <summary>
        /// 生成一个随机汉字码
        /// </summary>
        /// <returns>返回汉字字符串</returns>
        private static string GenerateCNCode()
        {
            //定义一个字符串数组储存汉字编码的组成元素 
            string[] rBase = new String[16] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

            Random rnd = new Random();

            /*
                每个汉字有四个区位码组成 
                区位码第1位和区位码第2位作为字节数组第一个元素 
                区位码第3位和区位码第4位作为字节数组第二个元素 
            */
            //区位码第1位 
            int r1 = rnd.Next(11, 14);
            string str_r1 = rBase[r1].Trim();

            //区位码第2位 //更换随机数发生器的 种子避免产生重复值 
            rnd = new Random(r1 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());

            int r2;
            if (r1 == 13)
                r2 = rnd.Next(0, 7);
            else
                r2 = rnd.Next(0, 16);
            string str_r2 = rBase[r2].Trim();

            //区位码第3位 
            rnd = new Random(r2 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());
            int r3 = rnd.Next(10, 16);
            string str_r3 = rBase[r3].Trim();

            //区位码第4位 
            rnd = new Random(r3 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());
            int r4;
            if (r3 == 10)
                r4 = rnd.Next(1, 16);
            else if (r3 == 15)
                r4 = rnd.Next(0, 15);
            else
                r4 = rnd.Next(0, 16);
            string str_r4 = rBase[r4].Trim();

            //定义两个字节变量存储产生的随机汉字区位码 
            byte byte1 = Convert.ToByte(str_r1 + str_r2, 16);
            byte byte2 = Convert.ToByte(str_r3 + str_r4, 16);
            //将两个字节变量存储在字节数组中 
            byte[] str_r = new byte[] { byte1, byte2 };

            //获取GB2312编码页（表） 
            Encoding gb = Encoding.GetEncoding("gb2312");
            //根据汉字编码的字节数组解码出中文汉字 
            string str = gb.GetString((byte[])Convert.ChangeType(str_r, typeof(byte[])));
            return str;

        }

        #endregion

    }
}
