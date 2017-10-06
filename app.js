const express = require('express')
const app = express()
const pug = require('pug')
var fs = require('fs');

app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));


//creating and reading form JSON database:

var obj = {};

function getData(callback){
	fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        console.log(err);
	    }
	    else {
	    	obj = JSON.parse(data); //now it an object
		}
		callback(obj)
	})
}

function writeData(id,question,answer,image,pass){

	var json = JSON.stringify(obj);

	fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        console.log(err);
	    } else {
	    obj = JSON.parse(data); //now it an object
	    console.log(obj)
	    obj.questions.push({
	    	"id": id,
	    	"question": question,
	    	"answer": answer,
	    	"image": image,
	    	"pass": pass
	    })
	    json = JSON.stringify(obj); //convert it back to json
	    fs.writeFile('data.json', json, 'utf8'); // write it back 
	}});
	console.log('writeData done')
}

/***********************************/

app.get('/', function (req, res) {

	var haveId = req.query.id

	var pg_title = que
	var pg_des = "Because I'm tired answering.."
	var pg_url = req.protocol + '://' + req.get('host') + req.originalUrl
	var spinner = '/assets/loader.svg'
	var bg_img = 'background-image:url(/assets/bg_shapes.svg)'
	var logo = '/assets/home_logo.svg'
	var ans_icon = ''
	var theme_color_cls = ''
	var theme_color_btn = ''

	var id = " "
	var que = " "
	var ans = " "
	var pg_img = " "
	var pass = " "
	
	//Get the values from the url ('name'):

	function setVal(callback){
		console.log('setVal start')
		if(!haveId) {
			id = req.query.id //need to be generated
			que = req.query.que
			ans = req.query.ans
			pg_img = req.query.pg_img
			pass = req.query.pass

			writeData(id, que, ans, pg_img, pass)
			console.log('data created!, id: ' + id)
		}
		else {
			function processCall(){
				console.log(haveId)
				var pullQueries = obj.questions
				var pullQuery = pullQueries.find(item => item.id == haveId)
				console.log(pullQuery)
				que = pullQuery.queustion
				ans = pullQuery.answer
				pg_img = pullQuery.image
				console.log('data loaded, id: ' + pullQuery.id)
				callback(setPagesNotyet)
			}
			getData(processCall)
		}
		console.log('setVal end')
	}

	function setPagesLand(){
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
		res.send(landingPage)
	}

	function setPagesNotyet(){
	  	var notyetPage = pug.renderFile( __dirname + '/views' + '/notyet_page.pug',
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
		)
		res.send(notyetPage)
	  }

  	function chooseIcon(callback){
  		console.log('chooseIcon is running' + ans)

		if(ans){
			ans_icon = '/assets/yes.svg'
			theme_color_cls = 'body-notyet-yes'
			theme_color_btn = 'btn-yes'
			console.log('--if--')
			callback()
			// return
		}
		else{
			ans_icon = '/assets/no.svg'
			theme_color_cls = 'body-notyet-no'
			theme_color_btn = 'btn-no'
			console.log('--else--')
			callback()
			return
		}
	}

	//in case no question is given, load home page:
	if(typeof haveId == 'undefined') {
		res.send(landingPage);
	}

	//send variables to template file and render result:
	else{
		setVal(chooseIcon)
	}
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

