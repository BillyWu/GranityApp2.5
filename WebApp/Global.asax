<%--<%@ Application Inherits="Estar.WebApp.Global" Language="C#" %>--%>
<%@ Application Language="C#" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e) 
    {
        // ��Ӧ�ó�������ʱ���еĴ���
        log4net.Config.XmlConfigurator.Configure();
    }
    
    void Application_End(object sender, EventArgs e) 
    {
        //  ��Ӧ�ó���ر�ʱ���еĴ���

    }
        
    void Application_Error(object sender, EventArgs e) 
    { 
        // �ڳ���δ����Ĵ���ʱ���еĴ���

    }

    void Session_Start(object sender, EventArgs e) 
    {
        // ���»Ự����ʱ���еĴ���

    }

    void Session_End(object sender, EventArgs e) 
    {
        // �ڻỰ����ʱ���еĴ��롣 
        // ע��: ֻ���� Web.config �ļ��е� sessionstate ģʽ����Ϊ
        // InProc ʱ���Ż����� Session_End �¼�������Ựģʽ����Ϊ StateServer 
        // �� SQLServer���򲻻��������¼���

    }
       
</script>

