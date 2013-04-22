using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.ServiceProcess;
using System.Diagnostics;

namespace winWatchSrv
{
    [RunInstaller(true)]
    public partial class InstallerWatch : Installer
    {
        public InstallerWatch()
        {
            InitializeComponent();

            string logname = "GranityWatch";
            //��װ��־
            if (EventLog.Exists(logname))
                EventLog.Delete(logname);
            if (EventLog.SourceExists(logname))
                EventLog.DeleteEventSource(logname);
            EventLogInstaller log = new EventLogInstaller();
            log.Source = logname;
            log.Log = logname;
            this.Installers.Add(log);
            //��װ����
            ServiceProcessInstaller prsInstaller = new ServiceProcessInstaller();
            ServiceInstaller watchInstall = new ServiceInstaller();

            // The services run under the system account.
            prsInstaller.Account = ServiceAccount.LocalSystem;
            prsInstaller.Username = null;
            prsInstaller.Password = null;

            // The services are started manually.
            watchInstall.StartType = ServiceStartMode.Automatic;
            watchInstall.ServiceName = "Granity�����ػ�";
            watchInstall.Description = "�Ϻ�����˾�۷����ػ�";

            // Add installers to collection. Order is not important.
            Installers.Add(watchInstall);
            Installers.Add(prsInstaller);
        }
    }
}