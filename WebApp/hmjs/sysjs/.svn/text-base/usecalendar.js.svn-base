var mycalendar = null; // remember the mycalendar object so that we reuse it and
                     // avoid creation other mycalendars.

// code from http://www.meyerweb.com -- change the active stylesheet.
function setActiveStyleSheet(title) {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
  document.getElementById("style").innerHTML = title;
  return false;
}

// This function gets called when the end-user clicks on some date.
function selected(cal, date) {
  var oldValue = cal.sel.value;
  cal.sel.value = date; // just update the date in the input field.
  
  if(oldValue != cal.sel.value)
  {
	cal.sel.fireEvent("onchange");
  }
  
	// if we add this call we close the mycalendar on single-click.
	// just to exemplify both cases, we are using this only for the 1st
	// and the 3rd field, while 2nd and 4th will still require double-click.
	cal.callCloseHandler();
}

// And this gets called when the end-user clicks on the _selected_ date,
// or clicks on the "Close" button.  It just hides the mycalendar without
// destroying it.
function closeHandler(cal) {
  cal.hide();                        // hide the mycalendar

  // don't check mousedown on document anymore (used to be able to hide the
  // mycalendar when someone clicks outside it, see the showCalendar function).
  removeEvent(document, "mousedown", checkCalendar);
}

// This gets called when the user presses a mouse button anywhere in the
// document, if the mycalendar is shown.  If the click was outside the open
// mycalendar this function closes it.
function checkCalendar(ev) {
  var el = is_ie ? getElement(ev) : getTargetElement(ev);
  for (; el != null; el = el.parentNode)
    // FIXME: allow end-user to click some link without closing the
    // mycalendar.  Good to see real-time stylesheet change :)
    if (el == mycalendar.element || el.tagName == "A") break;
  if (el == null) {
    // calls closeHandler which should hide the mycalendar.
    mycalendar.callCloseHandler();
    stopEvent(ev);
  }
}

// This function shows the mycalendar under the element having the given id.
// It takes care of catching "mousedown" signals on document and hiding the
// mycalendar if the click was outside.
function showCalendar(id, format) {
	if (typeof(id) == 'object'){
		var el = id;	//add by Roseox 2002.12.7
	}else{
		var el = document.getElementById(id);
	}
  if (mycalendar != null) {
    // we already have some mycalendar created
    mycalendar.hide();                 // so we hide it first.
  } else {
    // first-time call, create the mycalendar.
    //var cal = new Calendar(true, null, selected, closeHandler);
    var cal = new Calendar(false, null, selected, closeHandler);
    mycalendar = cal;                  // remember it in the global var
    cal.setRange(1900, 2070);        // min/max year allowed.
  }
  mycalendar.setDateFormat(format);    // set the specified date format
  mycalendar.parseDate(el.value);      // try to parse the text in field
  mycalendar.sel = el;                 // inform it what input field we use
  mycalendar.showAtElement(el);        // show the mycalendar below it

  // catch "mousedown" on document
  addEvent(document, "mousedown", checkCalendar);
  return false;
}