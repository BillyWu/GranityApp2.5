function CreateHTTP()
{
    var arr_t = new Array("Microsoft.XMLHTTP", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.2.6", "MSXML.XMLHTTP");
    for (var i=0; i<arr_t.length; i++)
        try{return(new ActiveXObject(arr_t[i]));}catch(e){};
    return(null);
}    
function getpath(){    return "http://"+location.host+("/"+location.pathname).replace("//","/");
}
function ue_path()
{
    var ls_path=getpath();
    if(location.pathname.lastIndexOf("/html/")>-1)
        ls_path=ls_path.substr(0,ls_path.lastIndexOf("/html/"))
    else 
        ls_path=ls_path.substr(0,ls_path.lastIndexOf("/"))
    return ls_path;
}
function ue_getsysdb()
{
    var xmlhttp = CreateHTTP();
    xmlhttp.open("POST",ue_path()+"/xmlsysdb.aspx",false);
    xmlhttp.send(null);
    var xmldb = xmlhttp.responseXML.documentElement;              
    if(xmldb==null) return;
    if(xmldb.selectNodes("//table").length==0){alert("未设置系统数据库！");return;}
    return xmldb.selectNodes("//table")[0].text;
}    			    

function ue_ajaxdom(sql,sqltype,hint,ob,nopm,isasyn)
{
    if(!isasyn) isasyn=false;
    var xmlhttp = CreateHTTP();
    xmlhttp.open("POST",ue_path()+"/XMLdom.aspx",isasyn);
    var xmlparams = new ActiveXObject("Microsoft.XMLDOM")
    xmlparams.async=false;
    var strxml = '<?xml version="1.0" encoding="utf-8"?>'+
                '<all><command>'+ sqltype +'</command><sql></sql></all>';
    xmlparams.loadXML(strxml);
    if(sql && sql.indexOf("[sys]")>-1)
        sql = sql.replace("[sys]",ue_getsysdb());    
    var strsql =(!sql)?"":sql;
    if(!nopm)
    {
        if(strsql.indexOf("@")>-1)
        {
            var strsql = sql.substring(0,sql.indexOf("@"));
            var strpms = sql.substring(sql.indexOf("@"),sql.length);
            var arrfld = strpms.split(",");
            var s="";var tab;
            if(event && event.srcElement)
                tab=ToolUtil.getCtrlByTagU(false,event.srcElement,"TABLE");
            for(var i=0;i<arrfld.length;i++)
            {
                if(arrfld[i].indexOf("@")<0) {s=s+","+arrfld[i];continue}
                var parm = arrfld[i].replace("@","");
                if(ob && ob.Col(parm))
                    s=s+",'"+ob.Val(parm)+"'";
                else if(ob && ob.UnitItem && ob.UnitItem.BandMaster && ob.UnitItem.BandMaster.Col(parm))
                    s=s+",'"+ob.UnitItem.BandMaster.Val(parm)+"'";
                else if($SP(parm))
                { 
                    var _parm = $SP(parm);
                    if(_parm=="null") s=s+",null"
                    else s=s+",'"+_parm+"'"; //取系统参数                    
                }
                else if(tab)
                {
	                for(var j=0;j<tab.all.length;j++)
	                {
	                    var ctrl = tab.all[j];
	                    if(ctrl.tagName!="INPUT" && ctrl.tagName!="SELECT")
	                        continue;
	                    if(ctrl.name.indexOf(parm)<0 && ctrl.id.indexOf(parm)<0) continue;
	                    s=s+",'"+ ctrl.value+"'"
	                    break; 
	                }
                }                
                else if(event && event.srcElement && event.srcElement.previousSibling && event.srcElement.previousSibling.tagName=="INPUT")
                {
                    if(event.srcElement.previousSibling.name && event.srcElement.previousSibling.name.indexOf(parm)>-1)
                        s=s+",'"+ event.srcElement.previousSibling.value+"'"
                }
            }
            s=s.substring(1,s.length);
            strsql=strsql + s;
        }    
    }
    xmlparams.selectSingleNode("//sql").text = strsql;
    var xmldata;
    try{
        xmlhttp.send(xmlparams);
        if(isasyn) return xmlhttp;
        xmldata = xmlhttp.responseXML.documentElement;
        delhttp(xmlhttp);
        CollectGarbage();
    }catch(ex){}
    if(xmldata!=null && xmldata.selectNodes("//table").length>0 &&  xmldata.selectNodes("//table")[0].text=="ok")
    { 
        if(hint) alert(hint);
        return "ok"
    }
    else if(xmldata==null && sqltype==1)
        alert("操作失败!");
    return xmldata;
}
function delhttp(h)
{
    h.abort();
    delete h ; 
    h=null;
    setTimeout(CollectGarbage, 10);
}
function ue_ABand(strsql,name,unititem)
{
    this.data       = ue_ajaxdom(strsql,"item."+unititem,null,null,true);
    this.ItemName = name;
    if(!this.data)  return null;
    this.ColNames   = this.data.selectNodes("//xstructs/name")[0].text.split(",");
    this.DataTypes  = this.data.selectNodes("//xstructs/datatype")[0].text.split(",");
    this.widths     = this.data.selectNodes("//xstructs/len");
    this.rows       = this.data.selectNodes("//table");
    this.count      = this.rows.length;                      //做为手工band的标志
    this.NoAuto     = true;
    this.modify     = false;                                 //数据是否已修改
    this.status     = "";                                  //当前所处的编辑状态:new-增加,edit-编辑,browser-浏览
    this.root       = this.data.parentNode;
    if(name) this.id = "xland"+name;
    this.linkCol = "";
    if(!name) return;
    //其它定义：oband.edittable = oband.ItemName + "_" + "edittable"
    //          oband.keytable  = oband.ItemName + "_" + "keytale"
    if(document.UnitItem.getBandByItemName(name))
    {
        for(var i=0;i<document.UnitItem.Bands.length;i++)
            if(document.UnitItem.Bands[i].ItemName==name) 
            {
                document.UnitItem.Bands[i] = this;
                break;
            }
    }
    else document.UnitItem.Bands[document.UnitItem.Bands.length]=this;
}
function ue_ResetABand(oband)
{
    if(!oband.data)  return null;
     oband.modify = false;
     oband.rows   = oband.data.selectNodes("//table");
     oband.count      = oband.rows.length;
}
//ajax获取编号
function ws_getbh(bhitem)
{
    try{
    xmlhttp.open("Post",ue_path()+"/xmlbh.aspx?file="+bhitem,false);
	xmlhttp.send(null);
	}catch(ex){}
	return xmlhttp.responseText;
}

function us_htmldict(objname,custsql,isnil,ob)
{
    var obj=$(objname);
    if(!obj || !obj.options) return;
    //obj.options.length =0;
    obj.innerHTML="";
    var ops = obj.options;
    if(ops.options.length>1) return;
    var sql=obj.DataSource;
    if(custsql)  sql=custsql;
    var xmlhttp = ue_ajaxdom(sql,"","",ob);
    if(!xmlhttp) return;
    var xmlrows = xmlhttp.selectNodes("//table");        
    if(!isnil)
        ops.add(new Option("",""));
    for(var m=0;m<xmlrows.length;m++)
    {
        var text = (!xmlrows[m].selectSingleNode(obj.DataTextField))?"":xmlrows[m].selectSingleNode(obj.DataTextField).text;
        var val  = (!xmlrows[m].selectSingleNode(obj.DataValueField))?"":xmlrows[m].selectSingleNode(obj.DataValueField).text;
        var tag  = (!xmlrows[m].selectSingleNode("tag"))?"":xmlrows[m].selectSingleNode("tag");
        var grp  = (!xmlrows[m].selectSingleNode("type"))?"":xmlrows[m].selectSingleNode("type").text;
        if(grp=="true" || grp=="1")
        {
            var group=document.createElement('OPTGROUP');  
            group.label = text;
            group.innerText= " ";
            obj.appendChild(group);
        }
        else
        {
            var opt   = new Option(text,val);
            if(tag){ opt.id   = tag.text;opt.tag = tag;}
            ops.add(opt);
        }        
    }
    try{
    obj.focus();
    obj.options.selectedIndex=0;}catch(ex){};
}
