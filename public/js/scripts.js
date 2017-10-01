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

var msgs = document.getElementsByClassName('loader');
var no = document.getElementById('wait')

var animateText = function() {
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
				no.id = ' '
			},100)
		},2000);
	},2000);
}

printUpdate()

//Get paremeters from URL:

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
var queVal = getParameterByName('que');
var ansVal = getParameterByName('ans');

//change the question and title values:

var changeQ = function(){
	var que = document.getElementById('noo');
	var ans = document.getElementById('wait');
	que.innerHTML = queVal;
	// ans.innerHTML = ansVal;
	document.title = queVal;
};

changeQ()













