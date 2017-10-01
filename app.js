const express = require('express')
const app = express()


app.use(express.static('public'));

//Get the values from the url ('name')
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views' + '/yetland.html')
	var que = req.query.que
	var ans = req.query.ans
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})