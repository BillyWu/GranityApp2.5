    function uscboArr(o,a,fg)
    {
        for(var i=0;i<a.length;i++)
            if(a[i]!="RowNum")o.options.add(new Option(a[i],a[i]));
        o.focus();
        if(!fg)o.options.selectedIndex=0;
        else o.options.selectedIndex=o.options.length-1;
    }
    function uschartrowdata(ItemName)
    {
        var ob=$band(ItemName);
        var arrayObj = new Array();
        for(var i=0;i<ob.RecordCount();i++)
        {
           var v = ob.getFldStrValue($("cbochartrows").value,i);
           arrayObj.push(v);      
        }
        ueToolbar("setchartrows",arrayObj,null,null,"checkbox","chartrownames",null,null,null,1);
    }
    function _chkall(o)
    {
        var obl = true;
        var the_obj = event.srcElement;
        if(the_obj.value==1) {the_obj.value=0;obl=false;}
        else {the_obj.value=1;obl=true;}
        for(var i=0;i<$N(o).length;i++)
            $N(o)[i].checked=obl;
    }
    function uc_setchart(winid,ItemName)
    {
        var str = '<fieldset style="padding: 10px;;width:98%;height:70px;text-align:left"><legend>设置行字段及标题：</legend>'
        +'<p style="margin:5;">选择行系列:<select style="width:90px" onclick="uschartrowdata(\''+ItemName+'\')" id="cbochartrows" size="1" name="D1"></select>&nbsp;&nbsp;设置Y坐标标题：<select style="width:90px" id="cbochartYtitle" size="1" name="D1"></select>'
        +'&nbsp;&nbsp;设置合计项：<select style="width:80px"  id="cbochartsum"  size="1" name="D1"></select><input type="checkbox" id="haschartsum" checked class="xlandradio" /></p></fieldset>'
        +'<fieldset style="padding: 10px;width:98%;text-align:left"><legend>设置列：<input type="checkbox" id="_chk1" value=1 onclick="_chkall(\'chartcolnames\')" checked class="xlandradio" /><label for="_chk1">全选</label></legend>'
        +'<div id="setchartcols"></div></fieldset>'
        +'<fieldset style="padding: 10px;;width:98%;text-align:left"><legend>选择行：<input type="checkbox" id="_chk2" value=1 onclick="_chkall(\'chartrownames\')" checked class="xlandradio" /><label for="_chk2">全选</label></legend>'
        +'<div id="setchartrows"></div></fieldset>'
        +'<fieldset style="padding: 10px;;width:98%;text-align:left"><legend>设置显示规则：</legend>'
        +'<p style="margin:5;">　显示标签提示框：<input type="checkbox" id="haschartlabels" class="xlandradio" />'
        +'　　　　横向：<input type="radio" name="haschartlabels" checked class="xlandradio" />　　竖向：<input type="radio" name="haschartlabels" class="xlandradio" />'
        +'　　　饼图不显示合计：<input type="checkbox" id="nosumpie" checked class="xlandradio" />'
        +'</p></fieldset><p style="margin:10;text-align:center"><button class="txtbtn1" onclick="uc_setchartOk(\'winchartsetup\',\''+ItemName+'\');" ><IMG src="../html/images/ok.png" style="vertical-align:middle" vspace=0 hspace=3/>&nbsp;确定</button>';
        DlgWin("winchartsetup","grdchartsetup","设置图表参数",ItemName,str,580,350);
        var ob=$band(ItemName);
        var cols = ob.vColNames("1");
        var elems = cols;
        var elemsevent = [""];
        uscboArr($("cbochartrows"),cols);uscboArr($("cbochartYtitle"),cols,-1);uscboArr($("cbochartsum"),cols,-1);
        ueToolbar("setchartcols",elems,elemsevent,null,"checkbox","chartcolnames",null,null);
        
        ob.chartCols = cols;
        //初始原状态
        uschartrowdata(ItemName);
        if(!ob.chartChkCols) return;
        for(var i=0;i<$N("chartcolnames").length;i++)
            $N("chartcolnames")[i].checked = ob.chartChkCols[i];
        for(var i=0;i<$N("chartrownames").length;i++)
            $N("chartrownames")[i].checked = ob.chartChkRows[i];

        $("cbochartsum").value=ob.chartsumcol;
        if(ob.piesum) $("nosumpie").checked=true;
        
        if(ob.chartXt) $("cbochartrows").value=ob.chartXt;
        if(ob.chartYt) $("cbochartYtitle").value=ob.chartYt;
    }
    function uc_setchartOk(winid,item)
    {
        var arrayObj = new Array();$band(item).chartsumcol=null;
        var ob = $band(item);
        var ocols = ob.Cols("1");
        var occhks = new Array();
        var orchks = new Array();
        for(var i=0;i<$N("chartcolnames").length;i++)
        {
            var colitem = ob.ColObj(ocols[i]);
            occhks.push($N("chartcolnames")[i].checked);
            if(!$N("chartcolnames")[i].checked) continue;
            arrayObj.push($N("chartcolnames")[i].value);
        }
        ob.chartCols=arrayObj;
        ob.chartChkCols=occhks;

        for(var i=0;i<$N("chartrownames").length;i++)
        {
            orchks.push($N("chartrownames")[i].checked);
        }
        ob.chartChkRows=orchks;

        if(colitem.datatype!="string" && $("haschartsum").checked)
            ob.chartsumcol=$("cbochartsum").value;
        else ob.chartsumcol=null;
        ob.chartXt =$("cbochartrows").value;
        ob.chartYt =$("cbochartYtitle").value;
        ob.piesum = $("nosumpie").checked;
        $CHK("RdataType").fireEvent("onclick");
        ShowHide(winid,"none");
    }
    //取每一列的值,用于column或bar图,格式为:列名,列值1,...列值m,多个列用";分割",第一列为标签列值,后为每一列值
    function uc_GetColumnDatas(ItemName,vname)
    {
        var ob=$band(ItemName);
        if(!ob.chartCols) ob.chartCols = ob.vColNames("1");
        var data =""; var ocols = ob.Cols("1");
        var cols = ob.chartCols;
        if(!ob.chartXt) ob.chartXt=cols[0];
        var isexistcols=false;var s=""; var barrows = "";
        for(var i=0;i<cols.length;i++)
        {
            if(cols[i]=="RowNum") continue;
            if(cols[i]==ob.chartXt){isexistcols=true;}
            s=s+","+cols[i];
        }
        if(!isexistcols) 
        {
            s=ob.chartXt+s;
            cols=s.split(",");
        }
        else
        {
            cols=s.substring(1,s.length).split(",")
        }
        ob.chartCols = cols;
        var piecolnames = "";
        for(var i=0;i<cols.length;i++)
        {   
            if(cols[i]=="RowNum" || cols[i]=="序号") continue;            
            var colitem = ob.ColObj(ob.Col(cols[i]));
            var s = ob.ColTitle(cols[i]);
            if(colitem.datatype=="string" && cols[i]!=ob.chartXt) continue; 
            for(var j=0;j<ob.RecordCount();j++)
            {
                if($("chartrownames") && $N("chartrownames")[j].checked==false) continue;
                var v = ob.getFldStrValue(cols[i],j);
                if(colitem.datatype=="int") v = ToolUtil.Convert(v,"int");
                else if(colitem.datatype=="double") v = ToolUtil.Convert(v,"number");
                s =  s + "," + v; 
            }
            data = data + ";"+ s;
        }
        if(!ob.chartYt) ob.chartYt=cols[cols.length-1];
        var piedata = _colpie(ItemName);
        var data =  data.substring(1,data.lenght);
        var arrayObj = new Array();
        arrayObj.push(piedata);
        arrayObj.push(data);
        
        return arrayObj;
    }
    function _colpie(ItemName)
    {
        var ob=$band(ItemName);
        var ss=""
        var tcol = ob.chartXt;//"行政区划";
        for(var i=0;i<ob.chartCols.length;i++)
        {   
            if(ob.chartCols[i]=="RowNum" || ob.chartCols[i]=="序号") continue;            
            var colitem = ob.ColObj(ob.Col(ob.chartCols[i]));
            if(colitem.datatype=="string") continue; 
            var s = ob.chartCols[i];
            //计算合计值
            var vs = 0;
            for(var j=0;j<ob.RecordCount();j++)
            {
                vs = vs + ToolUtil.Convert(ob.getFldStrValue(ob.chartCols[i],j),"float");
            }
            for(var j=0;j<ob.RecordCount();j++)
            {
                var v = ob.getFldStrValue(ob.chartCols[i],j);
                var sv = ob.getFldStrValue(tcol,j);
                if(vs==0) 
                    s= s +",['"+sv+"',0]"
                else
                    s= s +",['"+sv+"',"+ (100*v/vs).formate("####.00") + "]"
            }
            ss = ss +";"+s;
        }
        return ss =  ss.substring(1,ss.lenght);
    }
    function uc_GetRowDatas(ItemName)
    {
        var ob = $band(ItemName);
        if(!ob.chartCols) ob.chartCols = ob.vColNames("1");
        var strrows = "";var barrows = "";
        //计算百分比(应用于chart pie);
        var columnnames = "";
        var cols = ob.chartCols;
        var fldsum = ob.chartsumcol;        
        for(var i=0;i<ob.RecordCount();i++)
        {
            var strcols = "";var barcols = "";
            if($("chartrownames") && $N("chartrownames")[i].checked==false) continue;
            
            for(var j=0;j<cols.length;j++)
            {
                if(cols[j]=="RowNum" || cols[j]=="序号" || cols[j].indexOf("小计")>-1) continue;
                
                if(j==0)
                { 
                    strcols = strcols + "," + ob.getFldStrValue(cols[j],i);
                    barcols = strcols;
                }
                else
                {
                    if(($CHK("RChartType").value=="pie" || $CHK("RChartType").value=="comb") && ob.piesum==true && cols[j]==ob.chartsumcol) continue;
                    if(fldsum==null || fldsum=="")
                        strcols = strcols+","+"['"+ob.ColTitle(cols[j])+"'," + (ToolUtil.Convert(ob.getFldStrValue(cols[j],i),"number"))+"]";
                    else
                        strcols = strcols+","+"['"+ob.ColTitle(cols[j])+"'," + (ToolUtil.Convert(ob.getFldStrValue(cols[j],i)*100/ob.getFldStrValue(fldsum,i),"number")).formate("####.00")+"]";
                        barcols = barcols+","+ToolUtil.Convert(ob.getFldStrValue(cols[j],i),"int");
                }
                if(i==0)
                    columnnames = columnnames + "," + ob.ColTitle(cols[j]);
            }
            strrows = strrows + ";" + strcols.substring(1,strcols.length);
            barrows = barrows + ";" + barcols.substring(1,barcols.length);
        }
        strrows = strrows.substring(1,strrows.length);
        columnnames = columnnames.substring(1,columnnames.length);
        return strrows + "+"+columnnames+barrows;
    }

    function uc_defineChartObj(Container,title,xAxisText,yAxisText)
    {
        var options = 
        {
			chart: {renderTo: Container},
			title: {text: title,y:20,
			    style: {
							font: '14px 微软雅黑'
						}
			},
			xAxis: {categories: []},
            yAxis: {min: 0,offset:1,title: {text: yAxisText}},
			tooltip: {
				formatter: function() {
					var s;
					if (this.point.name) { // the pie chart
						s = ''+
							this.point.name +': '+ this.y +'%';
					} else {
						s = ''+
							this.series.name  +': '+ this.y;
					}
					return s;
				}
			},					
			labels: {
				items: []
				},
	        plotOptions: 
	        {
		        pie: 
		        {
			        allowPointSelect: true,
			        cursor: 'pointer',
			        dataLabels: 
			        {
				        enabled: true,
				        formatter: function() 
				        {
					        if (this.y > 0) return this.point.name +":" +this.y +' %';
				        },
				        color: 'white',
				        style: 
				        {
					        font: '8pt 微软雅黑, sans-serif'
				        }
			        }
		        },
		        bar: {
							dataLabels: {
								enabled: true
							}
						}
                ,
		        column: {
							dataLabels: {
								enabled: true
							}
						}
	        },					
            series: []
        };
        return options;
    }

    function uc_drawchart()
    {
        var the_obj = event.srcElement;
        var ItemName = $("xMsgwinchart").ItemName;
        var isColumn = true;
        switch($CHK("RdataType").value)
        {
            case "column": //按列显示
                isColumn = true;
                break;
            case "row": //按列显示
                isColumn = false;
                break;
        }
        if(!$band(ItemName).chart || !$band(ItemName).chart.options) return;
        var title = $band(ItemName).chart.options.title.text;
        var vname = $band(ItemName).chart.options.yAxis.title.text;
        var chartType = $CHK("RChartType").value;
        var isComb = false;
        if(chartType=="comb") isComb = true;
        uc_bchart(isColumn,isComb,ItemName,"grdchart",title,chartType,null,vname,vname);
    }
    //按列方式显示,pie: "北京,['代理商',0],['分公司',0],['加盟商',100],['网店',0],['直营店',0],['专卖店',0]"
    function uc_bchart(isColumn,isComb,ItemName,Container,title,chartType,xAxisText,yAxisText,vname)
    {   
        var ob=$band(ItemName);
        if(ob.RecordCount()==0){alert("没有统计数据!");return;}
        vname = ob.chartYt;
        var adatas   = uc_GetColumnDatas(ItemName,vname); //按列数据产生图标
        var Rowdatas = uc_GetRowDatas(ItemName);   //按行数据产生图标
        if(!isColumn){
            datas = Rowdatas.split("+")[1]; 
            var piedatas = adatas[0];
        }
        else
        {
            var datas    = adatas[1];
            var piedatas = Rowdatas.split("+")[0];
        }
        
        var options = uc_defineChartObj(Container,title,ob.chartXt,ob.chartYt);
        var columns = datas.split(";");
        switch(chartType)
        {
            case "pie":
                options = uc_drawPies(options,piedatas);
                if(options.series.length!=0)
                    options.series[options.series.length-1].showInLegend=true;
                break;        
            case "bar":
                options = uc_drawColumns(options,columns,"column");
                break;        
            case "line":
                options = uc_drawColumns(options,columns,"spline");
                break;        
            case "comb":
                options = uc_drawColumns(options,columns);
                options = uc_drawPies(options,piedatas);
                break;        
        }
        try{
        var chart = new Highcharts.Chart(options);
        $band(ItemName).chart = chart;
        }catch(ex){};
    }   

    //画列
    function uc_drawColumns(options,columns,charttype)
    {   
        if(!charttype) charttype="column";
        var collen = columns.length;
        if(columns[columns.length-1].substring(0,columns[columns.length-1].indexOf(","))=="小计")
            collen = columns.length-1;
        for(var i=0;i<collen;i++)
        {
            var data = columns[i];
            var values = data.substring(data.indexOf(",")+1,data.length).split(",");
            if(i==0){
                 for(m=0;m<values.length;m++){
                    options.xAxis.categories.push(values[m]);}
                 continue;
            }
            var colname = data.substring(0,data.indexOf(","))
			var columnseries = {
						type: charttype,
						name: colname,
						data: []
					};
            for(m=0;m<values.length;m++)
                columnseries.data.push(parseInt(values[m],10));
            options.series.push(columnseries);
        }
        return options;
    }   
    var piewidth = 180;
    function uc_drawPies(options,columns)
    {   
        var lines = columns.split(";");
        var oldwidth = $("grdchart").parentElement.offsetWidth;
        if(lines.length*piewidth+(lines.length)*20>oldwidth)
            $("grdchart").style.width = lines.length*piewidth+(lines.length)*50;
        else 
            $("grdchart").style.width=oldwidth;
        $("grdchart").style.textAlign="center";
        for(var i=0;i<lines.length;i++)
        {
            var bline = lines[i];
            var bitems = bline.substring(bline.indexOf(",")+1,bline.length);
            var piename = bline.substring(0,bline.indexOf(","));
            var labelitems = {
				html: piename,
				style: {
					left: ((i+1)*50+i*piewidth-(piename.length*9)/2) + 'px',
					top: '-15px',
					color: 'black'				
				    }
				};
            var pieseries = {
                type: "pie",
                allowPointSelect: true,
                name:piename,
                data: [],
                center: [(i+1)*50+i*piewidth, 100],
                size: piewidth,
                showInLegend: false     
            };
//            if(i==lines.length-1) pieseries.showInLegend=true;
            var strbjson = "[" + bitems + "]";
            try{
            pieseries.data=eval(strbjson);
            options.series.push(pieseries);
            options.labels.items.push(labelitems);
            }catch(ex){};
        }
        return options;
    }   
    function uc_strchart(winid,gridname,bandname,title)
    {
        var s= '<fieldset style="padding: 5px;;width:100%;text-align:left"><legend>摘要信息：</legend>\
        <label for="chkcol">按列数据显示：</label><input id="chkcol" type="radio" value="column" \
        onclick="uc_drawchart()" checked name="RdataType" class="xlandradio" />\
        <label  for="chkrow">按行数据显示：</label><input id="chkrow" type="radio" value="row" onclick="uc_drawchart()"  name="RdataType" class="xlandradio" />\
        <button class="txtbtn" onclick="uc_setchart(\''+winid+'\',\''+bandname+'\');" title="设置图表行列规则"><img src="images/run.png" style="vertical-align:middle"/> 参数...</button>\
        <label style="width:100px">　</label><label  for="chkbar">直方图：</label><input id="chkbar" type="radio" value="bar" \
        onclick="uc_drawchart()" checked name="RChartType" class="xlandradio" />　\
        <label  for="chkpie">饼图：</label><input id="chkpie" type="radio" value="pie" onclick="uc_drawchart()"  name="RChartType" class="xlandradio" />　\
        <label  for="chkline">折线图：</label><input id="chkline" type="radio" value="line" onclick="uc_drawchart()"  name="RChartType" class="xlandradio" />　\
        <label  for="chkcomb">综合图：</label><input id="chkcomb" type="radio" value="comb" onclick="uc_drawchart()"  name="RChartType" class="xlandradio" />\
        </fieldset><fieldset style="text-align:left;padding: 5px;height:380px;width:100%"><legend>统计数据：</legend>\
        <div class="tablescroll" style="height:380;width:750px;OVERFLOW:auto;">\
        <div id="'+gridname+'" class="tablescroll" style="text-align:left;width:100%; height:100%;margin: 0 auto;"></div></div></fieldset>';
        return s;
    }      
