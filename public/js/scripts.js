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














