		var arrfun=["��Ԫ����ͺ���","��Ԫ����ƽ������",
		"����ϵͳȡ������","�����ȡ������","�ֽ�������ȡ������"];
		var items=["������","�ڳ����","���ڽ跽�ۼ�","���ڴ����ۼ�","���ڷ�����","��ĩ���","����跽�ۼ�","��������ۼ�"];
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
				ColumnHeaders.Add(1, theList.id+'Col' + 1, "��ʽ���",162);
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
				ColumnHeaders.Add(1, theList.id+'Col' + 1, "��Ŀ����",152);
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
			var arrtext=["SUM(����1:����2:����3[:...])","AVG(����1:����2:����3[:...])",
			"fx(\"AC,��Ŀ����,��Ŀ����[,������][,����ڼ�]\")","fx(\"PL,��Ŀ����,��Ŀ����[,������][,����ڼ�]\")","fx(\"CF,�ֽ���������,��������\")"];
			var arrdtext=["","",
			"˵��������ȡֵ����ȡָ��\"��Ŀ����\"��ָ��\"��Ŀ����\"������ꡢ�µ����ݣ������Ⱥͻ���·ݶ�Ϊ������ݣ�0��ʾΪ������£�1��ʾΪ��������£�-1��ʾΪ��������µȵȡ�ʵ����fx(\"AC,1001,�ڳ��跽,0,0\")��ʾȡ����ϵͳ��101��Ŀ�ı��걾�ڵ�\"�ڳ��跽\"���ݡ�",
			"˵��������ȡֵ����ȡָ��\"��Ŀ����\"��ָ��\"��Ŀ����\"������ꡢ�µ����ݣ������Ⱥͻ���·ݶ�Ϊ������ݣ�0��ʾΪ������£�1��ʾΪ��������£�-1��ʾΪ��������µȵȡ�ʵ����fx(\"PL,1001,�ڳ��跽,0,0\")��ʾȡ����ϵͳ��101��Ŀ�ı��걾�ڵ�\"�ڳ��跽\"���ݡ�",
			"˵�����ֽ�����ȡָ��\"�ֽ���������\"��ָ��\"��������\"���ֽ����������ݡ������������Ϊ\"����\"������ָȡָ��\"�ֽ���������\"��\"����\"�ϼ�����ȥ\"����\"�ϼ�������֮��Ȼ��ʵ����fx(\"CF,10,����\")��ʾȡ�ֽ���������Ϊ10��\"����\"�ϼ�����ȥ\"����\"�ϼ�����"];
			var hints =["SUM(C1:C6)","AVG(C2:C8)","fx(\"AC,1002,��ĩ���,0,0\")","fx(\"PL,1002,��ĩ���,0,0\")","fx(\"CF,10,����\")"];
			document.getElementById("sphint").innerText="ʵ��: "+hints[icase];
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
					//if(subject=="") {alert("��ѡ���Ŀ���룡");break;}
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
					//if(subject=="") {alert("��ѡ���Ŀ���룡");break;}
					var y = document.getElementById("sy").value;
					var m = document.getElementById("sm").value;
					if(y=="" || m=="") {y=0;m=0}
					
					var v="fx(\"PL,"+subject+","+itemList.object.SelectedItem.Text+","+y+","+m+"\")";
					insertAtCaret(textObj,v);
					break;
				case 4:
					var subject = document.getElementById("cashid").value;
					//if(subject=="") {alert("��ѡ���Ŀ���룡");break;}
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
            var wname="��Ŀ��ѯhtm.HTM";
            var owin = window.dialogArguments.band;
            var rtn = window.showModalDialog(wname,owin,"dialogHeight: 460px; dialogWidth: 700px; edge: Raised; center: Yes; help: No; resizable: No; status: No;"); 
            if(!rtn || rtn=="") return;
            if(document.getElementById("ssub")) document.getElementById("ssub").value=rtn;
        }