var host_url='http://'+window.location.host+'/';
var appname = window.location.pathname.substring(1,window.location.pathname.substring(1,window.location.pathname.length).indexOf("/")+1);
host_url = host_url + appname+'/';
document.write('<script language="javascript" src="../../../hmjs/sysjs/GridUtilXSLT.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="../../../hmjs/sysjs/usXmlLandCal.js" type="text/javascript" charset="gb2312"></script>')
document.write('<script language="javascript" src="../../../hmjs/sysjs/usValidation.js" type="text/javascript" charset="gb2312"></script>')
