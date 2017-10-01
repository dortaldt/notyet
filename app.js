const express = require('express')
const app = express()
const pug = require('pug')

app.use(express.static('public'));

app.get('/', function (req, res) {
	
	//Get the values from the url ('name'):
	var que = req.query.que
	var ans = req.query.ans
	var pg_title = req.query.pg_title
	var pg_img = req.query.pg_img
	var pg_des = req.query.pg_des
	var pg_url = req.originalUrl

	//in case no question is given, load home page:
	if(typeof que == 'undefined') {
		res.send(pug.renderFile( __dirname + '/views' + '/home_page.pug',
			{
			page_title: "Welcome to Not Yet",
			page_img: "",				
			}
		));
	}

	//send variables to temlate file and render result:
	else{
	  	res.send(pug.renderFile( __dirname + '/views' + '/notyet_page.pug',
	  		{
  			question: que,
  			page_title: pg_title, 
  			page_img: pg_img,
  			page_des: pg_des,
  			page_url: pg_url
			}
		));
	}
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})