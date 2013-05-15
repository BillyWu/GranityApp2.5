		var ocoordsizex=250;
		var ocoordsizey=167;
		var zoomLevels = new Array(50, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500);
		elemScale = document.all("tabScale");
		if(elemScale)
		{
			elemScale.onmouseover = tickFocus;
			elemScale.onmouseout = tickBlur;
		}

		function tickFocus()
		{
			var elem = window.event.srcElement;
			if(elem.state == "off")
			{
				elem.src = tickFoc.src;
			}
		}			
		
		function tickBlur(percentZoom)
		{
			var elem = window.event.srcElement;
			if(elem.state == "off")
			{
				elem.src = tickOff.src;
			}
		}
		
		var tickOff = new Image();
		tickOff.src = "tick-off.gif";
		
		var tickFoc = new Image();
		tickFoc.src = "tick-foc.gif";
		
		var tickOn = new Image();
		tickOn.src = "tick-on.gif";
		
		function tickSelect(percentZoom)
		{
			var win=document.getElementsByName("map")[0];
			var groups = win.contentWindow.group1;
			var strcs = ocoordsizex/(percentZoom/100)+","+ocoordsizey/(percentZoom/100);
			changeTick(percentZoom);
			groups.coordsize=strcs
		}
		
		function changeTick(percentZoom)
		{
			img = elemScale.all("t" + percentZoom);
			img.src = tickOn.src;	
			if(elemScale.tickSelected)
			{
				if(elemScale.tickSelected!=img)
				{
					elemScale.tickSelected.src = tickOff.src;
				}
			}
			elemScale.tickSelected = img;
		}


		function ZoomUpDown(increment)
		{
			if (elemScale.tickSelected)
			{
				var curZoomLevel = elemScale.tickSelected.id.substring (1);
				var newZoomLevelIndex = IndexFromLevel (curZoomLevel * 1.0);
				if (newZoomLevelIndex >= 0)
				{
					var img = elemScale.all("t" + zoomLevels[newZoomLevelIndex + increment]);
					if (img)
					{
						tickSelect(img.id.substring(1));
					}
				}
			}
			else
			{
				tickSelect (100);
			}
		}

		function IndexFromLevel (zoomLevel)
		{
			for (var count = 0; count < zoomLevels.length; count++)
			{
				if (zoomLevels[count] == zoomLevel)
				{
					return count;
				}
			}

			return -1;
		}
