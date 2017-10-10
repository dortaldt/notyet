const express = require('express')
const app = express()
const pug = require('pug')
var fs = require('fs');
var shortid = require('shortid'); 


/*************Local use only************************/

//temp value for redis connection -> should change for deploy:

// var tempRedis = {}
// tempRedis.PORT = 41519
// tempRedis.HOST = 'ec2-34-251-131-150.eu-west-1.compute.amazonaws.com'
// tempRedis.PASS = 'pc80586139fc45971c4b8c02148492bf50f23b22702d0757fa9125ee90df860b3'


//connecting to Redis DB, should get URL_ when goes production:

// var client = require('redis').createClient(tempRedis.PORT, tempRedis.HOST);
// client.auth(tempRedis.PASS);


var client = require('redis').createClient(process.env.REDIS_URL);


client.on('connect', function() {
	console.log('connected');
});




/*********************Erase all data on app restart:********************************/
// client.flushdb( function (err, succeeded) {
//     console.log('delete: ' + succeeded); // will be true if successfull
// });




app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));


//creating and reading form JSON database:

var item = {};
var allItems =[]

var tempId = ''

function generateId(){
	tempId = shortid.generate()
	console.log('tempId is ' + tempId)
}

generateId()

function getAllData(callback){
	console.log('getAllData start (3)')

	var listHold = ['list0']

	client.keys('*', function (err, keys) {

	  if (err) return console.log(err);

	  for(var i = 0, len = keys.length; i <= len; i++) {
	    listHold.push(keys[i]);
	    console.log(keys[i] + 'pushed to listHold')
	     if(i === len - 1 || 0 === len){
	     	allItems = listHold
	     	console.log('listHold value is ' + listHold)
	     	console.log('getAllData end (3)')
	     	callback()
	     }
	  }
	})
};

function writeData(id,question,answer,image,pass,callback){
	console.log('writeData start')
	client.hmset(id,{
		'question': question,
		'answer': answer,
		'image': image,
		'pass': pass
	});
	console.log('data created!, id: ' + id)
	console.log('writeData end')
	callback()
}


var pg_des = "Because I'm tired answering.."
var spinner = '/assets/loader.svg'
var bg_img = 'background-image:url(/assets/bg_shapes.svg)'
var logo = '/assets/home_logo.svg'
var share_icon = '/assets/share_icon.svg'
var update_icon = '/assets/update_icon.svg'


/***********************************/

app.get('/', function (req, res) {

	var haveId = req.query.id
	var pg_url = req.protocol + '://' + req.get('host') + req.originalUrl
	var pg_title = que
	var ans_icon = ''
	var theme_color_cls = ''
	var theme_color_btn = ''
	var id = " "
	var que = " "
	var ans = " "
	var pg_img = " "
	var pass = " "

	function getItemData(callback){
		console.log('getItemData start (6)')

		client.hgetall(haveId , function(err, object) {

	    	item = object

	    	id = haveId
	    	console.log('getItemData question: ' + object.question + ' answer: '+ object.answer + ' image: ' + object.image + ' pass: '+ object.pass)
	    	que =object.question
	    	ans = object.answer
	    	pg_img = object.image
	    	pass = object.pass
	    	callback()
		});
		
		console.log('getItemData end (6)')
	}
	
	//Get the values from the url ('name'):

	function setVal(callback){
		console.log('setVal start (2)')
		
		function processCall(){
			console.log('processCall start (4)')

			function checkIfOnDB(array, id) {
			    return array.indexOf(id) > -1;
			}

			console.log('value of allItems is: ' +allItems+ ' and haveId is ' + haveId + ' checkIfOnDB is ' + checkIfOnDB(allItems,haveId))

			function createOrPull(callback){
				if(checkIfOnDB(allItems,haveId)){
					console.log('query excist (5)')
					getItemData(setValues)
					function setValues(){
						console.log('setValues start (7)')
						que = item.question
						ans = item.answer
						pg_img = item.image
						console.log('data loaded, id: ' + haveId)
						chooseIcon()
						console.log('setValues end (7)')
						callback()
					}
				}
				else{
					console.log('query not excist (5)')
					id  = req.query.id
					que = req.query.que
					ans = req.query.ans
					pg_img = req.query.pg_img
					pass = req.query.pass
					chooseIcon()
					writeData(id, que, ans, pg_img, pass, callback)
				}
			}

		createOrPull(setPagesNotyet)
		console.log('processCall end')

		}
		getAllData(processCall)
		console.log('setVal end')
	}

	function setPagesLand(){
		generateId()
		console.log('setPagesLand start with this tempId: ' + tempId)
		var landingPage = pug.renderFile( __dirname + '/views' + '/home_page.pug',
			{
				page_title: "Welcome to Not Yet",
				page_img: 'https://notyetapp.herokuapp.com' + '/assets/and_now.png',
	  			page_des: "Are we there yet? No! Give others link and stop getting the same question",
	  			page_url: pg_url,
	  			background_image: bg_img,
	  			logo: logo,
	  			id: tempId			
			}
		)
		res.send(landingPage)
		('setPagesLand end')
	}

	function setPagesNotyet(){
		console.log('setPagesNotyet start')
	  	var notyetPage = pug.renderFile( __dirname + '/views' + '/notyet_page.pug',
	  		{
	  			question:que,
	  			answer: ans,
	  			page_title: pg_title, 
	  			page_img: pg_img,
	  			page_des: pg_des,
	  			page_url: pg_url,
	  			answer_icon: ans_icon,
	  			background_image: bg_img,
	  			theme_color: theme_color_cls,
	  			theme_btn: theme_color_btn,
	  			spinner: spinner,
	  			share_icon: share_icon ,
	  			update_icon: update_icon,
	  			changeId: haveId	
			}
		)
		res.send(notyetPage)
		console.log('setPagesNotyet end')
		

		//read redis:
		client.keys('*', function (err, keys) {
		  if (err) return console.log(err);

		  for(var i = 0, len = keys.length; i < len; i++) {
		    console.log("Already on redis: " + keys[i]);
		  }
		});    
		console.log('setPagesNotyet end')
	}

  	function chooseIcon(callback){
  		console.log('chooseIcon is running and item.answer = ' + ans)

		if(ans == "true"){
			ans_icon = '/assets/yes.svg'
			theme_color_cls = 'body-notyet-yes'
			theme_color_btn = 'btn-yes'
			console.log('--if--')
			// callback()
			// return
		}
		else{
			ans_icon = '/assets/no.svg'
			theme_color_cls = 'body-notyet-no'
			theme_color_btn = 'btn-no'
			console.log('--else--')
			// callback()
			return
		}
	}

	//in case no question is given, load home page:
	if(typeof haveId == 'undefined') {
		// setVal()
		console.log('There isnt Id (1)')
		setPagesLand();
	}

	//send variables to template file and render result:
	else{
		console.log('There is Id (1)')
		setVal(chooseIcon)
		
	}
})

//change page:

app.get('/change', function (req, res) {
	console.log('change loaded')

	var idLoad = req.query.id
	var idSub
	var passSub
	var newStat
	var passDB
	// var idDB
	var oldStat

	function fetchData(callback){
		console.log('fetchData start')
		client.hgetall(idSub , function(err, object) {
			if(object != null){
				passDB = object.pass
				oldStat = object.answer
				callback()
			}
			else {
				console.log('cant find ID - Kill')
			 return
			}
		});
	}

	function getSubData(callback){
		console.log('getSubData start')
		idSub = req.query.page_id
		passSub = req.query.page_pass
		newStat = req.query.ans
		callback(checkValid)
	}

	function checkValid(){
		if(passDB === passSub){
			console.log('We have a match')
			writeNewStat()

		}
		else
			console.log(passDB +' is not matching ' + passSub)
	}

	function writeNewStat(){
		client.hmset(idSub,{
		'answer': newStat
		});
		console.log('Status changed to ' + newStat)
	}

	getSubData(fetchData)




	var pg_url = req.protocol + '://' + req.get('host') + req.originalUrl

	function setPagesChange(){
		var changePage = pug.renderFile( __dirname + '/views' + '/change_stat.pug',
			{
				page_title: "Welcome to Not Yet change page",
				page_img: "temp",
	  			page_des: pg_des,
	  			page_url: pg_url,
	  			logo: logo,
	  			background_image: bg_img,
	  			idLoad	
			}
		)
		res.send(changePage)
	}
	setPagesChange()

})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

