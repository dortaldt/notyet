const express = require('express')
const app = express()
const pug = require('pug')
var fs = require("fs");

app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));

//creating and reading form JSON database:

var obj = {
	"key" : "value"
};

var newKey = "new key2"
var newVal = "new value2"

// obj[newKey] = newVal;

var json = JSON.stringify(obj);

fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj[newKey] = newVal //add some data
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('data.json', json, 'utf8'); // write it back 
}});

/***********************************/

app.get('/', function (req, res) {
	
	//Get the values from the url ('name'):
	var que = req.query.que
	var ans = req.query.ans
	var pg_title = req.query.pg_title
	var pg_img = req.query.pg_img
	var pg_des = req.query.pg_des
	var pg_url = req.originalUrl
	var theme_color_cls = ''
	var theme_color_btn = ''
	var spinner = '/assets/loader.svg'

	var bg_img = 'background-image:url(/assets/bg_shapes.svg)'
	var logo = '/assets/home_logo.svg'
	var ans_icon = ''


	function choseIcon(){
		if(ans == 'Yes!'){
			ans_icon = '/assets/yes.svg'
			theme_color_cls = 'body-notyet-yes'
			theme_color_btn = 'btn-yes'
			return
		}
		else{
			ans_icon = '/assets/no.svg'
			theme_color_cls = 'body-notyet-no'
			theme_color_btn = 'btn-no'
			return
		}
	}

	choseIcon();

	var landingPage = pug.renderFile( __dirname + '/views' + '/home_page.pug',
			{
			page_title: "Welcome to Not Yet",
			page_img: pg_img,
  			page_des: pg_des,
  			page_url: pg_url,
  			background_image: bg_img,
  			logo: logo				
			}
		)

	//in case no question is given, load home page:
	if(typeof que == 'undefined') {
		res.send(landingPage);
	}

	//send variables to temlate file and render result:
	else{
	  	res.send(pug.renderFile( __dirname + '/views' + '/notyet_page.pug',
	  		{
  			question: que,
  			answer: ans,
  			page_title: pg_title, 
  			page_img: pg_img,
  			page_des: pg_des,
  			page_url: pg_url,
  			answer_icon: ans_icon,
  			background_image: bg_img,
  			theme_color: theme_color_cls,
  			theme_btn: theme_color_btn,
  			spinner: spinner
			}
		));
	}
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

