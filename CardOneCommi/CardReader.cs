using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using Granity.communications;
using System.Threading;

namespace Granity.CardOneCommi
{
    /// <summary>
    /// �������򿨷�����B/S���
    /// </summary>
    [Guid("818A30FB-8903-4cd7-BAE1-00BD5C5B52AC")]
    public partial class CardReader : UserControl, IObjectSafety
    {
        /// <summary>
        /// ������ʵ��
        /// </summary>
        CmdCard cmdCard = new CmdCard();
        /// <summary>
        /// RFID��Ƶ������
        /// </summary>
        CommandBase cmdRFID = new CommandBase(false);
        /// <summary>
        /// ��Ƶ��ID�ţ�4�ֽ�16��������
        /// </summary>
        string rfID = "";
        /// <summary>
        /// Э���б�
        /// </summary>
        Dictionary<string, string[]> tplpm = new Dictionary<string, string[]>();

        /// <summary>
        /// ������ͨѶ����Ŀ��
        /// </summary>
        CommiTarget target = null;
        /// <summary>
        /// RF��ƵͨѶĿ��
        /// </summary>
        CommiTarget rftar = null;
        /// <summary>
        /// ������վַ
        /// </summary>
        int station = 3;
        /// <summary>
        /// ������ģʽ�Ƿ�IC
        /// </summary>
        bool isCardIC = false;

        /// <summary>
        /// ��ʱ��,����ʱ3s�����豸����
        /// </summary>
        static System.Threading.Timer tmCache = new System.Threading.Timer(new TimerCallback(tm_Callback), null, Timeout.Infinite, Timeout.Infinite);
        /// <summary>
        /// ��ǰ���߷������豸
        /// </summary>
        static CmdCard GlCard=null;

        public CardReader()
        {
            InitializeComponent();
            GlCard = this.cmdCard;
            //ֻ��������
            cmdRFID.TimeOut = TimeSpan.MaxValue;
            cmdRFID.TimeFailLimit = TimeSpan.MaxValue;
            cmdRFID.TimeLimit = TimeSpan.MaxValue;
            cmdRFID.TimeSendInv = TimeSpan.MaxValue;
            cmdRFID.ResponseHandle += new EventHandler<ResponseEventArgs>(cmdRFID_ResponseHandle);
        }

        /// <summary>
        /// ��Ƶ��������Ӧ���
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void cmdRFID_ResponseHandle(object sender, ResponseEventArgs e)
        {
            CommandBase cmd = sender as CommandBase;
            if (null == cmd || null == e || !e.Success || null == e.Response || e.Response.Length < 1)
                return;
            byte[] response = e.Response;
            int len = response.Length;
            if (0x02 != response[0] || 0x03 != response[len - 3] || 0x0A != response[len - 2] || 0x0D != response[len - 1])
                return;
            string str = CommandBase.Parse(response);
            if (str.Length < 13)
                return;
            this.rfID = str.Substring(1, 8);
        }

        #region IObjectSafety ��Ա

        private const string _IID_IDispatch = "{00020400-0000-0000-C000-000000000046}";
        private const string _IID_IDispatchEx = "{a6ef9860-c720-11d0-9337-00a0c90dcaa9}";
        private const string _IID_IPersistStorage = "{0000010A-0000-0000-C000-000000000046}";
        private const string _IID_IPersistStream = "{00000109-0000-0000-C000-000000000046}";
        private const string _IID_IPersistPropertyBag = "{37D84F60-42CB-11CE-8135-00AA004BB851}";

        private const int INTERFACESAFE_FOR_UNTRUSTED_CALLER = 0x00000001;
        private const int INTERFACESAFE_FOR_UNTRUSTED_DATA = 0x00000002;
        private const int S_OK = 0;
        private const int E_FAIL = unchecked((int)0x80004005);
        private const int E_NOINTERFACE = unchecked((int)0x80004002);

        private bool _fSafeForScripting = true;
        private bool _fSafeForInitializing = true;
        
        /// <summary>
        /// ��ȡ�������ȫ�ӿڲ�������
        /// </summary>
        /// <param name="riid"></param>
        /// <param name="pdwSupportedOptions"></param>
        /// <param name="pdwEnabledOptions"></param>
        /// <returns></returns>
        public int GetInterfaceSafetyOptions(ref Guid riid, ref int pdwSupportedOptions, ref int pdwEnabledOptions)
        {
            int Rslt = E_FAIL;

            string strGUID = riid.ToString("B");
            pdwSupportedOptions = INTERFACESAFE_FOR_UNTRUSTED_CALLER | INTERFACESAFE_FOR_UNTRUSTED_DATA;
            switch (strGUID)
            {
                case _IID_IDispatch:
                case _IID_IDispatchEx:
                    Rslt = S_OK;
                    pdwEnabledOptions = 0;
                    if (_fSafeForScripting == true)
                        pdwEnabledOptions = INTERFACESAFE_FOR_UNTRUSTED_CALLER;
                    break;
                case _IID_IPersistStorage:
                case _IID_IPersistStream:
                case _IID_IPersistPropertyBag:
                    Rslt = S_OK;
                    pdwEnabledOptions = 0;
                    if (_fSafeForInitializing == true)
                        pdwEnabledOptions = INTERFACESAFE_FOR_UNTRUSTED_DATA;
                    break;
                default:
                    Rslt = E_NOINTERFACE;
                    break;
            }

            return Rslt;
        }
        /// <summary>
        /// �����������ȫ�ӿڲ���ֵ
        /// </summary>
        /// <param name="riid"></param>
        /// <param name="dwOptionSetMask"></param>
        /// <param name="dwEnabledOptions"></param>
        /// <returns></returns>
        public int SetInterfaceSafetyOptions(ref Guid riid, int dwOptionSetMask, int dwEnabledOptions)
        {
            int Rslt = E_FAIL;
            string strGUID = riid.ToString("B");
            switch (strGUID)
            {
                case _IID_IDispatch:
                case _IID_IDispatchEx:
                    if (((dwEnabledOptions & dwOptionSetMask) == INTERFACESAFE_FOR_UNTRUSTED_CALLER) && (_fSafeForScripting == true))
                        Rslt = S_OK;
                    break;
                case _IID_IPersistStorage:
                case _IID_IPersistStream:
                case _IID_IPersistPropertyBag:
                    if (((dwEnabledOptions & dwOptionSetMask) == INTERFACESAFE_FOR_UNTRUSTED_DATA) && (_fSafeForInitializing == true))
                        Rslt = S_OK;
                    break;
                default:
                    Rslt = E_NOINTERFACE;
                    break;
            }

            return Rslt;
        }

        #endregion

        #region �ڲ���Ա

        /// <summary>
        /// ����Ƿ����Э���ʼ��
        /// </summary>
        /// <returns>�ɹ����ؿ�,û�г�ʼ��ʱ��ʾ</returns>
        private string isInitedRF()
        {
            if (null == this.rftar)
                return "û������RFͨѶ�豸";
            return "";
        }

        /// <summary>
        /// ����Ƿ����Э���ʼ��
        /// </summary>
        /// <returns>�ɹ����ؿ�,û�г�ʼ��ʱ��ʾ</returns>
        private string isInited()
        {
            string[,] cmds = new string[,] { { "��������", "����" }, { "��������", "����ͻ" }, { "��������", "����" }, { "��������", "��Ƭͣ��" },
                            { "��������", "�ѻ�" }, { "��������", "����" }, { "��������", "ѡ��" }, {"��������", "����ͻ"},
                            {"һ��ͨ", "д�뷢��"}, {"һ��ͨ", "��ȡ����"}, {"һ��ͨ", "д������Ȩ��"}, {"һ��ͨ", "��ȡ����Ȩ��"},
                            {"һ��ͨ", "д���Ȩ��"}, {"һ��ͨ", "��ȡ��Ȩ��"}, 
                            {"һ��ͨ", "��ȡ���ѽ��"}, {"һ��ͨ", "д�����ѽ��"},
                            {"��������", "д����"} };

            if (null == this.target)
                return "û������ͨѶ�豸";
            for (int i = 0; i < cmds.GetLength(0); i++)
            {
                if (!this.tplpm.ContainsKey(cmds[i, 0] + ":" + cmds[i, 1]))
                    return "û������Э�飺 "+cmds[i, 0] + ":" + cmds[i, 1];
            }
            return "";
        }

        /// <summary>
        /// ��ʱ���ص�����,5sû�м������ж�Ѳ�������
        /// </summary>
        /// <param name="obj"></param>
        private static void tm_Callback(object obj)
        {
            if (null != GlCard)
                GlCard.TrunOffLine();
            CommiManager.GlobalManager.ClearCommand();
        }
        #endregion

        #region �����ɹ��ű����ú���
        /// <summary>
        /// ����ͨѶЭ�鶨��
        /// </summary>
        /// <param name="tpl">Э������</param>
        /// <param name="cmd">ָ������</param>
        /// <param name="tagdevice">Э���豸����</param>
        /// <param name="taginput">Э�������������</param>
        /// <param name="tagoutput">Э�������������</param>
        /// <returns>�Ƿ����óɹ�</returns>
        public bool setTpl(string tpl, string cmd, string tagdevice, string taginput, string tagoutput)
        {
            bool rtn = this.cmdCard.setTpl(tpl, cmd, tagdevice, taginput, tagoutput);
            if (!rtn) return false;
            string key = tpl + ":" + cmd;
            if (this.tplpm.ContainsKey(key))
                this.tplpm[key] = new string[] { tagdevice, taginput, tagoutput };
            else
                this.tplpm.Add(key, new string[] { tagdevice, taginput, tagoutput });
            return true;
        }

        /// <summary>
        /// ����RFͨѶ�˿ڣ������ʣ�վַ������ֻ��������
        /// </summary>
        /// <param name="port">RF��Ƶ����</param>
        /// <param name="baudRate">������</param>
        /// <returns>�ܹ��򿪶˿���ɹ����˿�ռ�û�����Ƿ���ʧ��</returns>
        public bool setRfTarget(string port, int baudRate)
        {
            CommiManager mgr = CommiManager.GlobalManager;
            if (null != this.rftar && this.rftar.PortName == port)
            {
                mgr.SendCommand(this.rftar, this.cmdRFID);
                return true;
            }
            if (null != this.rftar)
                mgr.RemoveCommand(this.rftar);
            this.rftar = null;
            try
            {
                CommiTarget tar = new CommiTarget(port, baudRate);
                Protocol ptl = new Protocol();
                ptl.FrameHeader = new byte[] { 0x02 };
                ptl.FrameFoot = new byte[] { 0x03, 0x0A, 0x0D };
                ptl.TotalBytes = 13;
                tar.setProtocol(ptl);
                if (!mgr.TestConnect(tar))
                    return false;
                this.rftar = tar;
            }
            catch
            {
                return false;
            }
            //����ֻ��������
            this.cmdRFID.ResetState();
            byte[] request = new byte[] { 0x02, 0x00, 0x00, 0x03, 0x0A, 0x0D };
            this.cmdRFID.setCommand(request);
            mgr.SendCommand(this.rftar, this.cmdRFID);
            return true;
        }

        /// <summary>
        /// ����ͨѶ����,portΪ�ջ�station��Χ����ȷ��ͨѶ�ÿ�
        /// </summary>
        /// <param name="port">ͨѶ�˿�</param>
        /// <param name="baudRate">ͨѶ������</param>
        /// <param name="station">ͨѶվַ</param>
        /// <param name="isCardIC">�Ƿ�IC��</param>
        /// <returns>�Ƿ�ɹ�����ͨѶ����</returns>
        public bool setTarget(string port, int baudRate, int station, bool isCardIC)
        {
            CommiManager.GlobalManager.ClearCommand();
            if (string.IsNullOrEmpty(port) || station < 1 || station > 255)
            {
                this.target = null;
                this.cmdCard.SetTarget(null, -1, false);
                return false;
            }
            try
            {
                this.Beat();
                this.target = new CommiTarget(port, baudRate);
                this.station = station;
                this.isCardIC = isCardIC;
                return this.cmdCard.SetTarget(target, station, isCardIC);
            }
            catch (Exception ex)
            {
                this.target = null;
                this.cmdCard.SetTarget(null, -1, false);
                return false;
            }
            return true;
        }
        /// <summary>
        /// �ͻ���ÿ3s�ڼ���һ��
        /// </summary>
        public void Beat()
        {
            if (null != this.target)
                this.cmdCard.SetTarget(target, station, isCardIC);
            if (null != this.rftar)
                this.setRfTarget(this.rftar.PortName, this.rftar.BaudRate);
            tmCache.Change(3000, Timeout.Infinite);
        }

        /// <summary>
        /// ��ȡ��ǰ��ƵID������
        /// </summary>
        /// <returns>����16���ƿ���</returns>
        public string getRfID()
        {
            string msg = this.isInitedRF();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.rfID;
        }
        /// <summary>
        /// ��ȡ��ǰ��Ƭ���к�
        /// </summary>
        /// <returns></returns>
        public string getCardSN()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.CardID;
        }
        /// <summary>
        /// ��ȡ��ǰ��Ƭ���к�
        /// </summary>
        /// <returns></returns>
        public string getCardSID()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.CardSID;
        }
        /// <summary>
        /// ��ȡ��ǰ��Ƭ���
        /// </summary>
        /// <returns></returns>
        public string getCardNum()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.CardNum;
        }

        /// <summary>
        /// ��ȡ�ʸ�һ��ͨ����
        /// </summary>
        /// <returns></returns>
        public string getPCardNum()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadPCardNum();
        }
        /// <summary>
        /// ��ȡ�ʸ�һ��ͨ����
        /// </summary>
        /// <returns></returns>
        public string getPRfID()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadPRfID();
        }
        /// <summary>
        /// ������ʾ,�ɹ���ʾ1��,ʧ����ʾ3��
        /// </summary>
        /// <param name="isSuccess">�Ƿ�ɹ���ʾ</param>
        public string Buzz(bool isSuccess)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            this.cmdCard.Buzz(isSuccess);
            return "";
        }
        /// <summary>
        /// ��ȡ����ʱЧ��Ϣ,����tag��ʽ����
        /// </summary>
        /// <returns>û�г�ʼ��,�򷵻ؿ�,����tag��ʽ����:����,��������,��ʷ���,Success</returns>
        public string ReadEateryDtLimit()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadEateryDtLimit();
        }
        /// <summary>
        /// ��ȡ�����Ѽ�¼
        /// </summary>
        /// <param name="cardID">��Ƭ���к�</param>
        /// <returns>����tag��ʽֵ:����,��������,��ʷ���,Success</returns>
        public string ReadEateryInfo()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadEateryInfo();
        }
        /// <summary>
        /// ��ȡ��ͣ����ʱЧ��Ϣ
        /// </summary>
        /// <param name="cardID">��Ƭ���к�</param>
        /// <returns>����tag��ʽֵ,ͨѶʧ�ܷ��ؿ�:����,����,��������,����</returns>
        public string ReadParkDtLimit()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadParkDtLimit();
        }
        /// <summary>
        /// ��ȡ�ʸ�һ��ͨ��Ա��Ϣ
        /// </summary>
        /// <returns>����tag��ʽֵ:����,����,�Ա�,Ա�����,��λ,Success</returns>
        public string ReadPUser()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadPUser();
        }
        /// <summary>
        /// ��ȡ�ʸ�һ��ͨ��Ա��Ϣ
        /// </summary>
        /// <returns>����tag��ʽֵ:����,����,�Ա�,Ա�����,��λ,Success</returns>
        public string ReadPVehicle()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.ReadPVehicle();
        }
        /// <summary>
        /// ��Ƭͣ��
        /// </summary>
        /// <returns></returns>
        public void CardHalt()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return;
            this.cmdCard.CardHalt();
        }
        /// <summary>
        /// �÷������ѻ�Ѳ�����
        /// </summary>
        public void TrunOffLine()
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return;
            this.cmdCard.TrunOffLine();
        }
        /// <summary>
        /// д�뿨�ż�����
        /// </summary>
        /// <param name="cardnum">�����</param>
        /// <param name="isEatery">�Ƿ�������Ч</param>
        /// <param name="isPark">�Ƿ�ͣ������Ч</param>
        /// <param name="isDoor">�Ƿ��Ž���Ч</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WriteCardNum(string cardnum, bool isEatery, bool isPark, bool isDoor)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.WriteCardNum(cardnum, isEatery, isPark, isDoor);
        }
        /// <summary>
        /// ��ʼ������ʱЧ�ͳ�ֵ���
        /// </summary>
        /// <param name="cardType">������</param>
        /// <param name="dtStart">��������</param>
        /// <param name="dtEnd">��Ч����</param>
        /// <param name="level">����</param>
        /// <param name="psw">�û�����</param>
        /// <param name="money">��ʼ����ֵ���</param>
        /// <param name="subsidy">��ʼ���������</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WriteEateryDtLimit(int cardType, string dtStart, string dtEnd, int level, string psw, double money, double subsidy)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            DateTime ds = Convert.ToDateTime(dtStart);
            DateTime de = Convert.ToDateTime(dtEnd);
            return this.cmdCard.WriteEateryDtLimit(cardType, ds, de, level, psw, money, subsidy);
        }
        /// <summary>
        /// д������ʱЧ�ͳ�ֵ���Ͳ������
        /// </summary>
        /// <param name="dtStart">��������</param>
        /// <param name="dtEnd">��Ч����,�������䲻������ԭ��������</param>
        /// <param name="addMoney">��ֵ���</param>
        /// <param name="subsidy">�������</param>
        /// <param name="isSubsidyAdd">�����Ƿ��ۼ�,falseʱԭ������0�ٲ���</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WriteEateryDtLimit2(string dtStart, string dtEnd, double addMoney, double subsidy, bool isSubsidyAdd)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            DateTime ds = Convert.ToDateTime(dtStart);
            DateTime de = Convert.ToDateTime(dtEnd);
            return this.cmdCard.WriteEateryDtLimit(ds, de, addMoney, subsidy);
        }

        /// <summary>
        /// ��Ǯ�򷢲���
        /// </summary>
        /// <param name="addMoney">��ֵ���</param>
        /// <param name="subsidy">�������</param>
        /// <param name="isSubsidyAdd">�����Ƿ��ۼ�</param>
        /// <returns></returns>
        public string WriteEateryMoney(double addMoney, double subsidy, bool isSubsidyAdd)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.WriteEateryDtLimit(DateTime.MinValue, DateTime.MinValue, addMoney, subsidy, isSubsidyAdd);
        }
        /// <summary>
        /// д��ͣ����ʱЧ
        /// </summary>
        /// <param name="cardType">������</param>
        /// <param name="cartype">����</param>
        /// <param name="dtStart">��������</param>
        /// <param name="dtEnd">��Ч����</param>
        /// <param name="carNo">����</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WriteParkDtLimit(int cardType, int cartype, string dtStart, string dtEnd, string carNo)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            DateTime ds = Convert.ToDateTime(dtStart);
            DateTime de = Convert.ToDateTime(dtEnd);
            return this.cmdCard.WriteParkDtLimit(cardType, cartype, ds, de, carNo);
        }
        /// <summary>
        /// д���ʸ�һ��ͨԱ����Ϣ
        /// </summary>
        /// <param name="cardnum">����</param>
        /// <param name="name">����</param>
        /// <param name="isman">�Ƿ�����</param>
        /// <param name="usercode">Ա�����</param>
        /// <param name="orga">��������</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WritePUser(int cardnum, string name, bool isman, string usercode, string IDCardNum, int deptcode, string orga)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.WritePUser(cardnum, name, isman, usercode, IDCardNum, deptcode, orga);
        }
        /// <summary>
        /// д���ʸ�һ��ͨ������Ϣ
        /// </summary>
        /// <param name="province">����ʡ</param>
        /// <param name="carnum">���ƺ���</param>
        /// <param name="cartype">����</param>
        /// <param name="isauto">�Ƿ���ж</param>
        /// <param name="weight">����</param>
        /// <param name="rfID">RFID</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string WritePVehicle(string province, string carnum, int cartype, bool isauto, float weight, string rfID)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            return this.cmdCard.WritePVehicle(province, carnum, cartype, isauto, weight, rfID);
        }
        /// <summary>
        /// �˿�,���ָ����������
        /// </summary>
        /// <param name="area">��Ƭ��������:0/����,1/ͣ����</param>
        /// <returns>���ط��н��tag��ʽ��Success</returns>
        public string ClearData(int areatype)
        {
            string msg = this.isInited();
            if (!string.IsNullOrEmpty(msg))
                return msg;
            CardArea area = CardArea.Eatery;
            switch (areatype)
            {
                case 0: area = CardArea.Eatery; break;
                case 1: area = CardArea.Park; break;
            }
            return this.cmdCard.ClearData(area);
        }
        
        #endregion
    }
}