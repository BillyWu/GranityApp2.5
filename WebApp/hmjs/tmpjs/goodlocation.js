      var gband;
      var lcolor = 3; //颜色码长度
      var BarHtml="";
      var elems1 = ["药品资料","视图","拆零","操作方法","保存","返回"];
      var elemsevent1 = ["secBoard(0)","openPro()","dlgsplit()","secBoard(1)","ue_save()","ms_close()"];     
      var elems2 = ["全部","处方药","非处方药","中药饮片","中药材","医疗器械","非药品(保健品)","失效品"];
      var elemsevent2 = ["ue_pfilter('goods')","xSearch('goods')","xSearch('goods')","xSearch('goods')",
      "xSearch('goods')","xSearch('goods')","xSearch('goods')","ue_pfilter('goods','失效=1')"];
      var elems3 = ["在线库存","配货缺口统计查询","订货排名统计","采购记录","客户退换货统计","全国库存分布查询","进出库存报表","日销售统计","销售汇总统计","商品营销统计报表...","品牌供应商统计报表...","设计师业绩分析","业务员业绩分析","销售单查询","商品零售统计查询...","商品综合查询"];
      var elemsevent3 = ["showchart()","","","","","","","","",""];
      
      var SearchFields = "dbo.fun_getPY(供应商);药品编号;供应商;剂型;药品名称;失效" ;
      function initWin()
      {
        gband=$band("goods");
        InitView();
        secBoard(0);
        gband.editdict=true;
        $loading("none");
      }
    function InitView()
    {
        ueToolbar("tbdiv",elems1,elemsevent1);
        ueLabel("lbldiv1",elems2,elemsevent2);
        ueLabel("lbldiv2",elems3,elemsevent3,1);   
        if($U().Right!="增删改") $("Btn保存").style.display="none";
        $("fSearchText").name = SearchFields;
    }      
  function xSearch()
  {
     ToolUtil.setParamValue($XD(), "大类", event.srcElement.innerText,"string", "B", gband.ItemName,"C","D");
     fSearch('goods',"");
     ToolUtil.delParam($XD(), "大类", "B", gband.ItemName,"C");
  }    
    function ts_Afteradd()
    {
        var ob=GridUtil.FindBand();
        if(ob.ItemName!="goods") return;
        openPro();
    }
    function _loadimg(obj)
    {
        if(obj.clientWidth>60 || obj.clientHeight>60)
        {
            obj.resized=true;
            var scale = obj.clientWidth/obj.clientHeight;
            if(scale>1) 
            {
                obj.style.width=60;
                obj.style.height = 60/scale;
            }
            else
            {
                obj.style.height=60;
                obj.style.width = 60/scale;
            }			            
        }
        if(obj.clientWidth==25 && obj.clientHeight==25 && obj.src.indexOf("Floppy")<0)
        {
            obj.resized=true;
            obj.style.width=60;
            obj.style.height = 60;
            
        }
        if(!$band("goods")) return;
        if(obj.nameProp=="Floppy.gif") 
        {
            obj.style.display="none";
            if($("logo")) 
            {
                $("logo").innerText=$band("goods").Val("品牌"); 
                $("logo").style.display="block"
            }
        }else{
            obj.style.display="block";
            $("logo").style.display="none"
        }
    }
    function dlgsplit()
    {
        GridUtil.usOnCellRFocusHandle();
        var s= '<fieldset style="padding: 2px;width:99%;height:50px;text-align:left"><legend><font face="微软雅黑">主药品信息：</font></legend>\
                <span class="span60fn">药品编码：</span><span datasrc="#商品资料Tab" datafld="款号" class="xlandinput" style="width:60px;"></span>\
                <span class="span40fn">品名：</span><span datasrc="#商品资料Tab" datafld="名称" class="xlandinput" style="width:170px;" ></span>\
                <span class="span40fn">规格：</span><span datasrc="#商品资料Tab" datafld="规格" class="xlandinput" style="width:65px;" ></span>\
                <span class="span40fn">剂型：</span><span datasrc="#商品资料Tab" datafld="款式" class="xlandinput" style="width:40px;" ></span>\
                <span class="span40fn">单位：</span><span datasrc="#商品资料Tab" datafld="计量单位" class="xlandinput" style="width:30px;" ></span>';
        var ssave = '【<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">保存</a>】';
        var s0 = '【<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'split\',\'none\')">关闭</a>】\
                </fieldset>\
            <fieldset style="padding: 2px;height:320;width:99%"><legend><font face="微软雅黑">拆零药品信息：</font>';
        sbtn = '<button id="btnselect" class=txtbtn onclick="tm_selectgoods(\'药品资料选择\',\'slgoods\',\'goods\',\'拆零\',650,null,null,true)" >查找相关药品&nbsp;<img src="images/find16.png" style="vertical-align:middle"/></button>';
        s1 = '</legend><div id="dvsplit" style="width:100%;height:45%"></div>\
        <div style="width:97%;height:40%;text-align:left;padding:5;color: #008000">药品如何拆零销售？举例如下：比如药品AA，可整卖（盒），也可零卖（粒），一盒里面有10粒，现需要拆零销售，那么：<br />第一步：在【基础资料】=>【药品资料】中要为它建两个编码，比如：一个是0001（盒）；一个是0002（粒） ，只是“单位”（即计量单位）不同。<br />第二步：在【基础资料】=>【药品资料】中选择“0001” 然后单击【拆零】按钮，在弹出的“药品拆零设置”窗口中“药品编码”栏输入“0002”，“数量”栏填10，“分摊成本比例”栏填100，保存后退出。<br />第三步：在【业务管理】=>【拆零单】（可在【业务管理】=>【销售出库单】中单击【拆零】按钮打开）中点“新增”后，在“拆零药品”项目处输入“0001”，在“拆零数量”项目处输入1，然后单击“审核通过”就可以了。这时编码为“0001”的药品库存数量减少1盒，编码为“0002”的药品库存数量增加10粒。<br />第四步：在【业务管理】=>【销售出库单】中，选择编码为“0002”的药品进行销售（即按“粒”销售）。如果需要按“盒”销售，则要选择编码为0001的药品进行销售。</div>\
        </fieldset>';
        var ob = $band("拆零");
        if($U().Right!="增删改") {ob.gridtype = 61;s=s+s0+s1;ob.noxml=true;}
        else {s=s+ssave + s0+sbtn+s1;ob.gridtype = 8;}
        DlgWin("split","dvsplit","药品拆零定义",null,s,730);
        ob.minwidth = "80px";
        
        ob.freecols = "名称";ob.StrongGrid=true;
        var Grid = new XGrid("dvsplit",ob,"in",null,1);
        ob.XQuery(true);        
    }
    function tm_selectgoods(title,srcitem,mitem,destitem,w,h,spos,callback)
    {
        var str = strfind1("wingoods","dvgoods", srcitem, destitem,callback,mitem,spos);
        DlgWin("wingoods","dvgoods",title,srcitem,str,w,h)
        var oband = $band(srcitem);
        oband.gridtype = 13;  oband.freecols = "名称";        oband.minwidth = "70px";oband.StrongGrid=true;
        oband.noxml=true;
        if("function"==typeof(ts_filter))
            ts_filter();
        else oband.XQuery();
        var Grid = new XGrid("dvgoods",oband,"in",true,1,1);
    }    
    function oklocate(winid, gridname, srcitem, destitem, hint, keywords)
    {
        var ob = $band(srcitem);
        ob.IsImport="1";
        $band(destitem).exportItem=srcitem;
        document.importItem = destitem;
        $loading();
        $U().CheckInSelfParentUnit("import");
        if ("function" == typeof (oklocate.callback))
            oklocate.callback();
        ShowHide(winid,"none");
        $loading("none");
    }    
    function strfind1(winid, gridname, srcitem, destitem,callback,mitem,spos)
    {
        if (!srcitem) srcitem = "";
        var storeinfo = '<td width="60" align="right">库位:</td><td width="100">\
        <input id=\"库位\" name=\"库位\" datasourceid="exec FD_库位 null" datatextfield="name" datavaluefield="name" filter=\"and\" \
        class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"><input title="要选择吗，点我一下..." class="txtbtn" type=button value="..." \
        style="margin-left:-24px;margin-top:2px;width:22px;height:16; position:absolute" onclick="Ycbo()"/></td>';
        if(srcitem!="slstoregoods" || (spos && $band(mitem).Val(spos)!="")) storeinfo="";
        oklocate.callback = callback;
        var s= '<fieldset style="padding: 5px;;width:99%"><legend>查询：</legend>'
        +'<table border="0" width="99%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>'
        + storeinfo
        +'        <td width="60" align="right">药品编码:</td><td width="100">'
        +'        <input id=\"款号\" name=\"药品编码\" filter=\"and\" class=\"xlandinput\" size=\"1\" style=\"WIDTH: 120;\"></td>'
        +'        <td width="60" align="right">品名:</td><td width="80">'
        +'        <INPUT name="dbo.fun_getPY(名称);名称" filter=\"and\"  class="xlandinput" style="width:100%;" type="text" size="11"  /></td>'
        + '        <td width="60"><img border="0" style="cursor:hand" src="Images/tb16.gif" onclick=ue_tfilter("' + srcitem + '") onmouseover="this.src=\'Images/tb16c.gif\'" onmouseout="this.src=\'Images/tb16.gif\'" /></td>'
        + '        <td width="90" align="right">【<a href="#" onclick=oklocate("' + winid + '","' + gridname + '","' + srcitem + '","' + (!destitem ? "" : destitem) + '","无此产品！")>确定</a>】</td>'   
        +'    </tr></table></fieldset>';
        var s1 = '<br /><div style="width:99%;height:88%;" id="'+gridname+'"></div>';
        var s2 = '<select id="deptbox" title="双击选入..." size="13" onblur="_onblurbox(this)" name="D1" \
        datasource="execute dbo.boxorginaze" datatextfield="title" datavaluefield="name" style="width:320;height:300;\
         position:absolute; left:70; top:60;display:none"  ondblclick="boxcheckin(this)" ></select>';		
        return s+s1+s2;
    }
    function openPro()
    {
        GridUtil.usOnCellRFocusHandle();
        var s = strfind("view",null,null);
        title  = "商品详细资料－【创建日期："+"<span datasrc='#商品资料Tab' datafld='创建日期_格式'></span>" +"/ 更新日期：<span datasrc='#商品资料Tab' datafld='更新日期_格式'></span>】　";
        DlgWin("view","dvopp",title,null,s,700,460);
        gband.splitrow = "2px";
        gband.minwidth=150;gband.startpos=0;gband.endpos=16;
        YPanel("goods","dvCustTab",null,1,"@零售价格=3",null,70);
        gband.minwidth=150;gband.startpos=16;gband.endpos=23;
        YPanel("goods","dvSubTab",null,1,null,null,70);
    }
    function strfind(winid,gridname,bandname)
    {
        if(!bandname) bandname="";
        if($U().Right!="增删改")
            var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="微软雅黑">主要信息：</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="60">药品名称：</td><td width="235">\
                <span datasrc="#商品资料Tab" datafld="名称" class="xlandinput" style="WIDTH: 90%;" ></span><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="60">药品编码：</td><td width="100">\
                <span datasrc="#商品资料Tab" datafld="款号" class="xlandinput" style="width:80%;" ></span><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="40">失效：</td><td width="20">\
                <input datasrc="#商品资料Tab" datafld="失效" disabled class="xlandradio" type="checkbox" /></td>\
                <td align="right">【<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'view\',\'none\')">关闭</a>】</td>\
                </tr></table></fieldset>';
        else
            var s= '<fieldset style="padding: 3px;;width:99%"><legend><font face="微软雅黑">主要信息：</font></legend>\
                <table border="0" width="100%" cellpadding="0" style="border-collapse: collapse" align=center ><tr>\
                <td align="right" width="60">药品名称：</td><td width="235">\
                <input datasrc="#商品资料Tab" datafld="名称" class="xlandinput" style="WIDTH: 90%;" /><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="60">药品编码：</td><td width="100">\
                <input datasrc="#商品资料Tab" datafld="款号" class="xlandinput" style="width:80%;" type="text"  /><font face="Wingdings" color="#ff0000">v</font></td>\
                <td align="right" width="40">失效：</td><td width="20">\
                <input datasrc="#商品资料Tab" datafld="失效" class="xlandradio" type="checkbox" /></td>\
                <td align="right">【<a class="linkbtn_0" href="#" target="_self" onclick="ue_save()">保存</a>】【<a class="linkbtn_0" href="#" target="_self" onclick="ShowHide(\'view\',\'none\')">关闭</a>】</td>\
                </tr></table></fieldset>';                    
        var s1='<div style="width:99%;height:390px">\
            <fieldset style="float:left;padding: 3px;height:220;width:69%"><legend><font face="微软雅黑">详细资料：</font></legend>\
            <div id="dvCustTab" style="height:198px;width:100%;text-align:left"></div>\
            </fieldset>\
            <fieldset style="float:right;padding: 3px;height:220;width:29%"><legend><font face="微软雅黑">图标：</font>';
        if($U().Right=="增删改")
            var s2 = '【<a class="linkbtn_0" href="#" target="_self" onclick="upload(\'goods\',\'商品图片\')">上传</a>】';
        else var s2 ="";
        var s3='</legend>\
            <table border="0" width="98%" height="198"><tr><td bgcolor="#F6F6F6" align=center valign=center>\
            <IMG src="images//Floppy.gif" id="goods:商品图片" class="xlandImg" alt="点击看原图..." /></td></tr></table>\
            </fieldset>\
            <fieldset style="float:left;padding: 3px;height:85;width:69%"><legend><font face="微软雅黑">GSP属性：</font></legend><div id="dvSubTab" style="width:100%;height:95%;text-align:left"></div></fieldset>\
            <fieldset style="float:right;padding: 3px;height:159;width:29%"><legend><font face="微软雅黑">功能主治：</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#商品资料Tab" datafld="功能" style="width:98%;height:98%" ></textarea></fieldset>\
            <fieldset style="float:left;padding: 3px;height:50;width:69%"><legend><font face="微软雅黑">其它属性：</font></legend>'+'<textarea name="S1"  class="xlandinput" datasrc="#商品资料Tab" datafld="洗水唛信息" style="width:98%;height:96%" ></textarea></fieldset>\
            </div>';
        return s+s1+s2+s3;
    }
    
      
    var sSearchKey = "商品查询...";
    function secBoard(n) {
    if(n>=mainTable.tBodies.length) return;
    ueToolCurrent(n,"tbdiv");
    for(i=0;i<mainTable.tBodies.length;i++)
      mainTable.tBodies[i].style.display="none";
    mainTable.tBodies[n].style.display="block";
    if(!gband) return;
    gband.XQuery();
    gband.minwidth = "70px";
    gband.gridtype = 0;
    gband.freecols = "名称";if($U().Right!="增删改") {gband.noxml=true;gband.gridtype=6};
    if(!gband.Grid)
        var Grid = new XGrid("dvMasterTab",gband,"in",null,1);
    $loading("none");
}
function _movepw(pw)
{return function(){movepw(pw);}}

function movepw(pw)
{
    pw.moveTo((screen.availWidth-550)/2,(screen.availHeight-550)/2-25);
}
//补0函数
function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
function ue_stat(isprint)
{
    var dbcols = "名称,款号,规格,颜色名称,零售价格,条形码,打印;名称,款号,规格,颜色名称,零售价格,条形码,打印;,60,60,60,60,80,40";
    var str ="SELECT 名称,款号,规格,颜色名称,零售价格,条形码,case when 打印=1 then '是' else null end 打印 FROM dbo.fn_FBarlocation() where (1>0) and (2>0)" 
    $loading();
    var s = ue_tfilter(null,tbbarlist);
    if(!s || s=="") s="";
    else s=" and ("+s+")";
    str += s;
    if(!isprint)
    {
        var xmldata = ue_ajaxdom(str);
        us_GridByAjax("bargrid",xmldata,"table","in",dbcols); 
    }
    else
    {
          var prn = "rptBarRecord.xml";
          url=ue_path() +"/frmprintc.aspx?prn="+prn+"&sql="+str;
          window.open(url,"","height=100,width=100,left=0,top=0,menu=yes,status=yes,resizable=no,scrollbars=no");        
    }
    $loading("none");
}
    function showchart()
    {
        var title="客户类型分布统计";
        var vname="数量";
        var chartstyle="bar";
        var sql="exec chart_客户类型分布统计";
        DlgChart("winchart",sql,chartstyle,vname,title);
    }
    function _upload()
    {
        GridUtil.usOnCellRFocusHandle();
        var valueRtn=window.showModalDialog("UploadFile.htm",null,"dialogWidth:600px;dialogHeight:300px;center: yes;help:no; resizable:yes;status:no;");
        if(!valueRtn){return;}
        var file = base_name(valueRtn);
        $band("attach").setFldStrValue(null,"文件",file);
        ue_save("");      
        $band("attach").XQuery(true);
        
    }
