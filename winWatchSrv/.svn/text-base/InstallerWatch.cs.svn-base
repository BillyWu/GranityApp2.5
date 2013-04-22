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
            //安装日志
            if (EventLog.Exists(logname))
                EventLog.Delete(logname);
            if (EventLog.SourceExists(logname))
                EventLog.DeleteEventSource(logname);
            EventLogInstaller log = new EventLogInstaller();
            log.Source = logname;
            log.Log = logname;
            this.Installers.Add(log);
            //安装服务
            ServiceProcessInstaller prsInstaller = new ServiceProcessInstaller();
            ServiceInstaller watchInstall = new ServiceInstaller();

            // The services run under the system account.
            prsInstaller.Account = ServiceAccount.LocalSystem;
            prsInstaller.Username = null;
            prsInstaller.Password = null;

            // The services are started manually.
            watchInstall.StartType = ServiceStartMode.Automatic;
            watchInstall.ServiceName = "Granity服务守护";
            watchInstall.Description = "上海克立司帝服务守护";

            // Add installers to collection. Order is not important.
            Installers.Add(watchInstall);
            Installers.Add(prsInstaller);
        }
    }
}