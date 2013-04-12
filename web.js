var express = require('express');
var dbURL = process.env.MONGOLAB_URI ||
			process.env.MONGOHQ_URL ||
			'mongodb://localhost/mydb';

var collection = ['games'];
console.log(dbURL);
var db = require('mongojs').connect(dbURL, collection); 

var app = express.createServer(express.logger());
app.use(express.bodyParser());

app.all('/',function(req, res, next) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
