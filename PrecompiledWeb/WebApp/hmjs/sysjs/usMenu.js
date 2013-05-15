    //生成toolbar
    function ueToolbar(odivname,elems,elemsevent,classstyle,tagName,ctrlname,prelabel,prechks,presumcol,B,isBr)
    {
        if(!$(odivname)) return;
        if(!tagName) tagName = "button";
        if(!prelabel) prelabel="";
        var img = '<img src="Images/next10.png" />';
        var str = "";var tb="";var sp = "";
        switch(tagName)
        {
            case "button":
                if(!classstyle)
                    tb = '<button id=Btn@id class="Btn BtnNml" onmousedown="this.className=\'Btn BtnHv BtnDw\';" id="Button2" hideFocus=""\
                              onmouseover="this.className=\'Btn BtnHv\'" onclick="@1" \
                              onmouseout="this.className=\'Btn BtnNml\'">@2@0</button>';
                else
                {
                    if(classstyle == 1) classstyle="txtbtn";
                    //tb = '<button id=Btn@id class="txtbtn" onclick="javascript:this.innerHTML=\'<img src=Images/next10.png />\'+this.innerText;@1" >@2@0</button>';
                    tb = '<button id="Btn@id" name="Btn"'+odivname+'" class="'+classstyle+'" onclick="javascript:for(var i=0;i<$N(this.name).length;i++){ $N(this.name)[i].innerHTML=$N(this.name)[i].innerText;}this.innerHTML=\'<img src=Images/next10.png />\'+this.innerText;@1" >@2@0</button>';
                }
                break;
             case "radio":
                    tb = '<input type="radio" id=Btn@id class="xlandradio" @checked onclick="@1" value="@2@0" name="'+ ctrlname +'" /><label for="Btn@id" >@id</label>';
                    img = "";sp="　";
                break;
             case "checkbox":
                    var sf='<label for="Btn@id" >@id</label>';
                    if(B) sf='<b><label for="Btn@id" >@id</label></b>';
                    tb = '<input type="checkbox" id=Btn@id class="xlandradio" checked onclick="@1" value="@2@0" name="'+ ctrlname +'" />'+sf;
                    img = "";sp="　";
                break;
        }
        var e = "";
        
        if(elemsevent && elemsevent.length==1 && elems.length>1)
            e = elemsevent[0];
        for(var i=0;i<elems.length;i++)
        {
            if(elems[i]=="RowNum") continue;
            var tbin = tb.replaceAll("@id",elems[i]);

            var strchk = "";
            if(prechks && tagName=="checkbox"){
                 strchk="checked="+prechks[i]; 
                tbin = tbin.replaceAll("@checked","checked")
                }
            else
            {
                if(presumcol && elems[i]==presumcol)
                    tbin.replaceAll("@checked","checked")
                else{
                    if(i==0) tbin = tbin.replaceAll("@checked","checked") 
                    else tbin = tbin.replaceAll("@checked","");
                }
            }
            var s = tbin.replaceAll("@0",elems[i]).replaceAll("@1",(elemsevent)?((!elemsevent[i])?e:elemsevent[i]):"");
            if(i==0) s = s.replaceAll("@2",img) 
            else s = s.replaceAll("@2","");
            var xbr = "";
            if(isBr) xbr = "<br />";
            str = str + sp + s + xbr;
        }
        $(odivname).innerHTML = prelabel+str;
    }

    //切换当前菜单图标event.srcElement.className
    function ueToolCurrent(n,odivname)
    {
        var tbs = $(odivname).getElementsByTagName("BUTTON");
        for(i=0;i<tbs.length;i++)
            if(tbs[i].childNodes[0] && tbs[i].childNodes[0].tagName=="IMG")
                tbs[i].childNodes[0].removeNode(true);
        if(!event) 
        {
            n=0;
            if(!tbs[n]) return;
            tbs[n].innerHTML='<img src="Images/next10.png" />'+tbs[n].innerHTML;
        }
        else
        {
            event.srcElement.innerHTML='<img src="Images/next10.png" />'+event.srcElement.innerHTML;
        }
    }
    function ueGetTbItem(odivname)
    {
        var tbs = $(odivname).getElementsByTagName("BUTTON");
        for(i=0;i<tbs.length;i++)
        {
            if(tbs[i].childNodes[0].tagName=="IMG")
            return tbs[i];
        }
    }
    function ueLabel(odivname,elems,elemsevent,type,otype,titles,isIn)
    {
      if(!$(odivname)) return;
      var strcolor = "#666666";
      if(type && type==1) strcolor = "#804000";
      var str = "";
      for(var i=0;i<elems.length;i++)
      { 
          var _t = " title='' ";
          if(titles && titles[i]) _t = " title='"+titles[i]+"' " 
          if(otype && otype==1 && elems[i].indexOf("：")>-1)
          {
            var tb='<select id="_combox" name="_combox" style="width:120" size=1 onchange="X1"></select>';
            var s = tb.replaceAll("X1",elemsevent[i]) 
            str += '　<font face="Wingdings" color="#99cc00">w</font><span style="COLOR:'+strcolor+'">' + elems[i] +'</span>'+ s;
          }
          else
          {
            var s="";
            if(elems[i].indexOf("=")>-1)
            {
               var es = elems[i].split("=");
               var ees =  es[1].split(";");
               var s="datasourceid='"+ees[0]+"' datatextfield='"+ees[1]+"' datavaluefield='"+ees[2]+"'";
               elems[i] = es[0];
               var tb='<font face="Wingdings" color="#804000">w</font><A  '+ s +' class="linkbtn_0" href="#" target="_self" onclick="X1">';
            }
            else
            {
                var tb='<font face="Wingdings" color="#99cc00">w</font><A '+ _t +' style="COLOR:'+strcolor+'" '+ s 
                +' class="linkbtn_0" onmouseover="this.style.color=\'#000\';this.previousSibling.style.color=\'red\'" onmouseout="this.style.color=\''+strcolor+'\';this.previousSibling.style.color=\'#99cc00\'" href="#" target="_self" onclick="X1">';
            }
            var s = tb.replaceAll("X1",elemsevent[i]) 
            str += "　" + s + elems[i]+"</A>";
          }
      }
      if(!isIn) $(odivname).outerHTML=str;
      else $(odivname).innerHTML=str;
    }
    function fSearch(itemname,v)
    {
        if (typeof(usBeforeFsearch) == "function")
            usBeforeFsearch(); 
        if(!v) v = $("fSearchText").value;
        if(event && event.srcElement && event.srcElement.title!=event.srcElement.defaultValue)
        {
            if(v=="全部数据" || $("fSearchText").value=="全部数据" || $("fSearchText").value.indexOf("商品查询")>-1 || $("fSearchText").value.indexOf("立即搜索")>-1)
                $("fSearchText").value="";
            else
                $("fSearchText").value=v;
            ue_tfilter(itemname,$("btnfSearch"));
        }
        else if(event && event.srcElement && event.srcElement.title!=event.srcElement.defaultValue){
            var the_obj = event.srcElement;
            if(the_obj.nextSibling.value==the_obj.nextSibling.defaultValue) return;
            ue_tfilter(itemname);
        }
        else{
            if($("fSearchText").value==event.srcElement.defaultValue) $("fSearchText").value="";
            if(v) $("fSearchText").value=v;
            ue_tfilter(itemname,$("btnfSearch"));        
        }
        if(event.srcElement.defaultValue)
            $("fSearchText").value = event.srcElement.defaultValue;
    }  
    function fSearch1(itemname,v)
    {
        if (typeof(usBeforeFsearch) == "function")
            usBeforeFsearch(); 
        if((v!="" && !v) && event) v = event.srcElement.innerText;
        if(event && event.srcElement && event.srcElement.title!=event.srcElement.defaultValue)
        {
            if(v=="全部数据" || $("fSearchText").value=="全部数据")
                $("fSearchText").value="";
            else
                $("fSearchText").value=v;
            ue_tfilter(itemname,$("btnfSearch"));
        }
        else if(event && event.srcElement && event.srcElement.title!=event.srcElement.defaultValue){
            var the_obj = event.srcElement;
            if(the_obj.nextSibling.value==the_obj.nextSibling.defaultValue) return;
            ue_tfilter(itemname);
        }
        else{
            if($("fSearchText").value==event.srcElement.defaultValue) $("fSearchText").value="";
            if(v) $("fSearchText").value=v;
            ue_tfilter(itemname,$("btnfSearch"));        
        }
        if(event.srcElement.defaultValue)
            $("fSearchText").value = event.srcElement.defaultValue;
    }  
    /**
     * 检查关键字
     * @param {object}o form表单
     * @return {bool}返回是否通过验证
     */
    function fSearchCheck(o){
        var s = o["keyword"].value.trim();
        if(!s || s == sSearchKey){
	        try{
		        fShowError("请输入搜索关键字");
		        o["keyword"].focus();
	        }catch(e){}
	        return false;
        }
        return true;
    }
    /**
     * 输入框聚焦
     * @param {object}o 输入框对象
     * @return {void}
     */
    function fSearchFocus(o){
        o.className='IptOnF fRi'
        if(o.value.trim() == sSearchKey){
	        o.value = "";
        }
    }
    /**
     * 输入框失去聚焦
     * @param {object}o 输入框对象
     * @return {void}
     */
    function fSearchBlur(o){
        o.className='Ipt fRi'
        if(o.value.trim() == ""){
	        o.value = sSearchKey;
        }
}