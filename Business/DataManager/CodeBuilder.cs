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
	/// ���ݱ��,�����������
	/// </summary>
	public class CodeBuilder
	{
        /// <summary>
        /// ���캯��
        /// </summary>
        public CodeBuilder()
		{
			//
			// TODO: �ڴ˴���ӹ��캯���߼�
			//
		}

		/// <summary>
		/// ���ݵ������Ͳ������ɱ��
		/// </summary>
		/// <param name="billType">��������</param>
		/// <param name="deptCode">����</param>
		/// <returns></returns>
		static public string	GetBillSn(string	billType,string		deptCode)
		{
			if(""==billType || ""==deptCode)
				return "";
			NameObjectList	paramList=new NameObjectList();
            QueryDataRes query = QueryDataRes.CreateQuerySys();
			paramList.Add("��������",billType);
			paramList.Add("����",deptCode);
            //û�оʹ���һ��
            DataTable tab = query.getTable("������ˮ��", paramList);
            if (tab.Rows.Count < 1 || null==tab.Rows[0]["��ˮ��"])
                return "";
            return tab.Rows[0]["��ˮ��"].ToString();
		}

        /// <summary>
        /// ����һ��4λ�����
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
        ///  ���ǰ��������,д��У�����ɫͼƬ����,����������,������
        /// </summary>
        /// <param name="strcode">У����</param>
        /// <returns>��������ͼƬ</returns>
        static public Bitmap GenerateValidateImg(string strcode)
        {
            if (null == strcode || string.Empty == strcode || "" == strcode)
                return null;
            Bitmap image = new Bitmap((int)Math.Ceiling((strcode.Length * 25.0)), 25);
            Graphics g = Graphics.FromImage(image);
            //������ɫ
            Color[] c = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Orange, Color.Brown, Color.DarkCyan, Color.Purple };
            //�������� 
            string[] font = { "Verdana", "Microsoft Sans Serif", "Comic Sans MS", "Arial", "����" };
            try
            {
                //�������������
                Random random = new Random();

                //���ͼƬ����ɫ
                g.Clear(Color.White);

                //��ͼƬ�ı���������
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

                //�����ͬ�������ɫ����֤���ַ�
                for (int i = 0; i < strcode.Length; i++)
                {
                    int cindex = random.Next(c.Length);
                    int findex = random.Next(font.Length);  //����

                    Font f = new Font(font[font.Length-1], 12, FontStyle.Regular | FontStyle.Bold);
                    Brush b = new SolidBrush(c[cindex]);
                    int ii = random.Next(5);
                    if ((i + 1) % 2 == 0)
                    {
                        ii += 3;
                    }
                    g.DrawString(strcode.Substring(i, 1), f, b, 3 + (i * 20), ii);
                }

                //��ͼƬ��ǰ��������
                for (int i = 0; i < 10; i++)
                {
                    int x = random.Next(image.Width);
                    int y = random.Next(image.Height);

                    image.SetPixel(x, y, Color.FromArgb(random.Next()));
                }

                //��ͼƬ�ı߿���
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

        #region �ڲ�����
        
        /// <summary>
        /// ����һ��������ֻ���ĸ
        /// </summary>
        /// <returns>�����ַ���</returns>
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
        /// ����һ�����������
        /// </summary>
        /// <returns>���غ����ַ���</returns>
        private static string GenerateCNCode()
        {
            //����һ���ַ������鴢�溺�ֱ�������Ԫ�� 
            string[] rBase = new String[16] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

            Random rnd = new Random();

            /*
                ÿ���������ĸ���λ����� 
                ��λ���1λ����λ���2λ��Ϊ�ֽ������һ��Ԫ�� 
                ��λ���3λ����λ���4λ��Ϊ�ֽ�����ڶ���Ԫ�� 
            */
            //��λ���1λ 
            int r1 = rnd.Next(11, 14);
            string str_r1 = rBase[r1].Trim();

            //��λ���2λ //����������������� ���ӱ�������ظ�ֵ 
            rnd = new Random(r1 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());

            int r2;
            if (r1 == 13)
                r2 = rnd.Next(0, 7);
            else
                r2 = rnd.Next(0, 16);
            string str_r2 = rBase[r2].Trim();

            //��λ���3λ 
            rnd = new Random(r2 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());
            int r3 = rnd.Next(10, 16);
            string str_r3 = rBase[r3].Trim();

            //��λ���4λ 
            rnd = new Random(r3 * unchecked((int)DateTime.Now.Ticks) + rnd.Next());
            int r4;
            if (r3 == 10)
                r4 = rnd.Next(1, 16);
            else if (r3 == 15)
                r4 = rnd.Next(0, 15);
            else
                r4 = rnd.Next(0, 16);
            string str_r4 = rBase[r4].Trim();

            //���������ֽڱ����洢���������������λ�� 
            byte byte1 = Convert.ToByte(str_r1 + str_r2, 16);
            byte byte2 = Convert.ToByte(str_r3 + str_r4, 16);
            //�������ֽڱ����洢���ֽ������� 
            byte[] str_r = new byte[] { byte1, byte2 };

            //��ȡGB2312����ҳ���� 
            Encoding gb = Encoding.GetEncoding("gb2312");
            //���ݺ��ֱ�����ֽ������������ĺ��� 
            string str = gb.GetString((byte[])Convert.ChangeType(str_r, typeof(byte[])));
            return str;

        }

        #endregion

    }
}
