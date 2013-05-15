var host_url='http://'+window.location.host+'/';
var appname = window.location.pathname.substring(1,window.location.pathname.substring(1,window.location.pathname.length).indexOf("/")+1);
host_url = host_url + appname+'/';
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/winLoadUtil.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/GridUtilBase.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/usCommonBase.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/usUnitBase.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/usBandBase.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/ToolUtil.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="'+host_url+'hmjs/sysjs/htminit.js" type="text/javascript" charset="gb2312"></script>')
document.write('<link href="'+host_url+'hmjs/sysjs/inputctrl.css" type="text/css" charset="gb2312" rel="stylesheet" />')
document.write('<link href="'+host_url+'hmjs/sysjs/css.css" type="text/css" charset="gb2312" rel="stylesheet" />')
document.write('<link href="'+host_url+'hmjs/sysjs/treeStyle.css" type="text/css" rel="stylesheet" />')
document.write('<link href="'+host_url+'mstoolbar_files/css.css" type="text/css" rel="stylesheet" />')
