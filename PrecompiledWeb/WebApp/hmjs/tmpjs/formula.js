		var arrfun=["单元格求和函数","单元格求平均函数",
		"帐务系统取数函数","损益表取数函数","现金流量表取数函数"];
		var items=["年初余额","期初余额","本期借方累计","本期贷方累计","本期发生额","期末余额","本年借方累计","本年贷方累计"];
		function InitList(theList,checkIt)
		{
			with(theList)
			{
				View = 3
				BorderStyle = 0
				GridLines = true
				Checkboxes = checkIt
				FullRowSelect = true
				HideSelection=false
				LabelEdit = 1
				ColumnHeaders.Add(1, theList.id+'Col' + 1, "公式类别",162);
				for(var i=0;i<arrfun.length;i++)
				{
					theList.ListItems.Add( i+1, theList.id+'Key' + i+1, arrfun[i])
				}
				insertAtCaret(document.getElementById("funtext"),window.dialogArguments.value);
			}
		}
		function InitList1(theList,checkIt)
		{
			with(theList)
			{
				View = 3
				BorderStyle = 0
				GridLines = true
				Checkboxes = checkIt
				FullRowSelect = true
				HideSelection=false
				LabelEdit = 1
				ColumnHeaders.Add(1, theList.id+'Col' + 1, "项目名称",152);
				for(var i=0;i<items.length;i++)
				{
					theList.ListItems.Add( i+1, theList.id+'Key' + i+1, items[i])
				}
				
			}
		}
        function _downstep()
        {
			switch(myList.object.SelectedItem.Index-1)
			{
				case 0:
				case 1:
                    secBoard('cons',1);
					break;
				case 2:
				case 3:
                    secBoard('cons',2);
					break;
				case 4:					
                    secBoard('cons',3);
					break;
				default:
			}
            event.srcElement.style.display='none';
            document.getElementById('btnup').style.display='';
        }
        function _upstep()
        {
            secBoard('cons',0);
            btnup.style.display='none';
            document.getElementById('btndown').style.display='';   
        }

		
		function secBoard(tablename,n) {
			var otable = document.getElementById(tablename);
			if(!otable.tBodies[n]) return;
		    for(i=0;i<otable.tBodies.length;i++)
		      otable.tBodies[i].style.display="none";
		    otable.tBodies[n].style.display="block";
		}
		function _show(icase)
		{
			var arrtext=["SUM(参数1:参数2:参数3[:...])","AVG(参数1:参数2:参数3[:...])",
			"fx(\"AC,科目代码,项目名称[,会计年度][,会计期间]\")","fx(\"PL,科目代码,项目名称[,会计年度][,会计期间]\")","fx(\"CF,现金流量代码,流动方向\")"];
			var arrdtext=["","",
			"说明：帐务取值函数取指定\"科目代码\"，指定\"项目名称\"的相对年、月的数据，会计年度和会计月份都为相对数据，0表示为本年或本月，1表示为下年或下月，-1表示为上年或上月等等。实例：fx(\"AC,1001,期初借方,0,0\")表示取帐务系统中101科目的本年本期的\"期初借方\"数据。",
			"说明：损益取值函数取指定\"科目代码\"，指定\"项目名称\"的相对年、月的数据，会计年度和会计月份都为相对数据，0表示为本年或本月，1表示为下年或下月，-1表示为上年或上月等等。实例：fx(\"PL,1001,期初借方,0,0\")表示取帐务系统中101科目的本年本期的\"期初借方\"数据。",
			"说明：现金流量取指定\"现金流量代码\"，指定\"流动方向\"的现金流量表数据。如果流动方向为\"流入\"，则是指取指定\"现金流量代码\"的\"流入\"合计数减去\"流出\"合计数。反之亦然。实例：fx(\"CF,10,流入\")表示取现金流量代码为10的\"流入\"合计数减去\"流出\"合计数。"];
			var hints =["SUM(C1:C6)","AVG(C2:C8)","fx(\"AC,1002,期末余额,0,0\")","fx(\"PL,1002,期末余额,0,0\")","fx(\"CF,10,流入\")"];
			document.getElementById("sphint").innerText="实例: "+hints[icase];
			document.getElementById("d1").innerText=arrtext[icase];
			document.getElementById("d2").innerText=arrdtext[icase];
			if(cons.tBodies[0].style.display="none") 
			    _upstep();
			// secBoard('cons',0);
		}
		function inputtext()
		{
			var textObj = document.getElementById("funtext");
			switch(myList.object.SelectedItem.Index-1)
			{
				case 0:
					var _s="";
					for(var i=0;i<5;i++)
					{
						if(document.getElementById("p"+(i+1)).value=="") continue;
						_s = _s + ":" + document.getElementById("p"+(i+1)).value;
					}
					if(_s.indexOf(":")>-1) _s = _s.substring(1,_s.length);
					var v= "SUM("+_s+")";
					insertAtCaret(textObj,v);
					break;
				case 1:
					var _s="";
					for(var i=0;i<5;i++)
					{
						if(document.getElementById("p"+(i+1)).value=="") continue;
						_s = _s + ":" + document.getElementById("p"+(i+1)).value;
					}
					if(_s.indexOf(":")>-1) _s = _s.substring(1,_s.length);
					var v= "AVG("+_s+")";
					insertAtCaret(textObj,v);
					break;
				case 2:
					var subject = document.getElementById("ssub").value;
					var ss = subject.split(" ");
					subject = ss[0];
					//if(subject=="") {alert("请选择科目代码！");break;}
					var y = document.getElementById("sy").value;
					var m = document.getElementById("sm").value;
					if(y=="" || m=="") {y=0;m=0}
					
					var v="fx(\"AC,"+subject+","+itemList.object.SelectedItem.Text+","+y+","+m+"\")";
					insertAtCaret(textObj,v);
					break;
				case 3:
					var subject = document.getElementById("ssub").value;
					var ss = subject.split(" ");
					subject = ss[0];
					//if(subject=="") {alert("请选择科目代码！");break;}
					var y = document.getElementById("sy").value;
					var m = document.getElementById("sm").value;
					if(y=="" || m=="") {y=0;m=0}
					
					var v="fx(\"PL,"+subject+","+itemList.object.SelectedItem.Text+","+y+","+m+"\")";
					insertAtCaret(textObj,v);
					break;
				case 4:
					var subject = document.getElementById("cashid").value;
					//if(subject=="") {alert("请选择科目代码！");break;}
					var robj = document.getElementsByName("dcflag");
					var sf = "";
					for(var i=0;i<robj.length;i++)
					{
					    if(document.getElementsByName("dcflag")[i].checked) 
					    {
					        sf = document.getElementsByName("dcflag")[i].value;
					        break;
					    }
					}
					var v="fx(\"CF,"+subject+","+sf+"\")";
					insertAtCaret(textObj,v);
					break;
				default:
			}
		}
        function funkey(v)
        {
        	var textObj = document.getElementById("funtext");
            insertAtCaret(textObj,v);
        }	
        function setCaret(textObj){  
          if(textObj.createTextRange){    
            textObj.caretPos=document.selection.createRange().duplicate();    
          }  
        }
        function insertAtCaret(textObj,textFeildValue){  
          if(document.all && textObj.createTextRange && textObj.caretPos){       
              var caretPos=textObj.caretPos;      
              caretPos.text=caretPos.text.charAt(caretPos.text.length-1)==''?textFeildValue+'':textFeildValue; 
          }else if(textObj.setSelectionRange){        
              var rangeStart=textObj.selectionStart;
              var rangeEnd=textObj.selectionEnd;     
              var tempStr1=textObj.value.substring(0,rangeStart);      
              var tempStr2=textObj.value.substring(rangeEnd);      
              textObj.value=tempStr1+textFeildValue+tempStr2;
              textObj.focus();
              var len=textFeildValue.length;
              textObj.setSelectionRange(rangeStart+len,rangeStart+len);
              textObj.blur();
          }else {
            textObj.value+=textFeildValue;
          } 
        } 
        $(document).ready(function(){
           if($.browser.msie){
             $("#funtext")
               .click(function(){
                 setCaret($(this).get(0));
               })
               .select(function(){
                 setCaret($(this).get(0));
               })
               .keyup(function(){
                 setCaret($(this).get(0));
               });
           }
           $("a.insertTag")
             .click(function(){
               insertAtCaret($("#tag").get(0),$(this).html());
             });
            $("a.insertTagA")
             .click(function(){
               insertAtCaret($("#tagA").get(0),$(this).html());
             });
         });
        
        function cmdOK()
        {
            if(funtext.innerText!="") 
	            window.returnValue=funtext.innerText;
	        window.close();
        }
        function _opensubject()
        {
            var wname="科目查询htm.HTM";
            var owin = window.dialogArguments.band;
            var rtn = window.showModalDialog(wname,owin,"dialogHeight: 460px; dialogWidth: 700px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
            if(!rtn || rtn=="") return;
            if(document.getElementById("ssub")) document.getElementById("ssub").value=rtn;
        }