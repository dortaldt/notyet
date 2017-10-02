var time = function(){
	var d = new Date()
	var s = d.getSeconds()
	var h = d.getHours()
	var m = d.getMinutes()
	if(s<10) s = '0'+s
	if(h<10) h = '0'+h
	if(m<10) m = '0'+m
	return (h + ':' + m + ':' + s)
}

var printUpdate = function() {
	var current = time();
	var oldTime = document.getElementById('update-time');
	oldTime.innerHTML = current;
}



var animateText = function() {
	var msgs = document.getElementsByClassName('loader');
	var no = document.getElementById('wait')
	ga('send', 'event', 'Now button', 'click')
	msgs[0].className = 'loader show'
	no.id = 'no-upload'
	setTimeout(function(){
		msgs[0].className = 'loader'
		msgs[1].className = 'loader show'
		setTimeout(function(){
			msgs[1].className = 'loader'
			printUpdate()
			setTimeout(function(){
				no.id = 'wait'
			},100)
		},2000);
	},2000);
}

window.onload = function() {
	printUpdate()
}

var copyTextToClipboard = function(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

var copyLink = function() {
  copyTextToClipboard(location.href);
};
























