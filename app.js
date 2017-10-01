const express = require('express')
const app = express()
const pug = require('pug')

app.use(express.static('public'));


const compiledFunction = pug.compileFile(__dirname + '/views' + '/test.pug')

//Get the values from the url ('name')
app.get('/', function (req, res) {
	
	var que = req.query.que
	var ans = req.query.ans

	//in case no question is given:
	if(typeof que == 'undefined') {
		res.sendFile(__dirname + '/views' + '/yetland.html')
		console.log('the question is ' + que + ' and the answer is ' + ans)
	}
	else{
	  	res.send(compiledFunction({
  			question: que
		}));
	}
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})