var express = require('express');
var dbURL = process.env.MONGOLAB_URI ||
			process.env.MONGOHQ_URL ||
			'mongodb://bfisch02:Metzrok509@linus.mongohq.com:10074/app14124771';

var collection = ['highscores'];
var db = require('mongojs').connect(dbURL, collection); 

var app = express.createServer(express.logger());
app.use(express.bodyParser());

app.all('/',function(req, res, next) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/',function(req,res){
	app.set('Content-Type', 'text/html');
	var myGames = new Array;
	var gameString = '<h1 style = "text-align:center">Highscores</h1><table style = "margin-left:auto;margin-right:auto;border:3px solid black"><tr><th style = "border: 1px solid black">Game Title</th><th style = "border: 1px solid black">Username</th><th style = "border: 1px solid black">Score</th><th style = "border: 1px solid black">Date</th></tr>';
	numGames = 0;
	db.highscores.find(function(err, games) {
  		if(err || !games) console.log("NOTHING FOUND");
 	 	else games.forEach(function(gameFound) {
  			myGames[numGames] = gameFound;
  			numGames++;
  		});
  		myGames = myGames.sort(function(a,b){
  			if (b.game_title>a.game_title)
  				return -1;
  			if (a.game_title>b.game_title)
  				return 1;
  			else
  				return b.score-a.score;
  			});
  		for (i = 0; i<numGames; i++) {
  			if (i<numGames) {
  				gameString+='<tr><th style = "border: 1px solid black">'+myGames[i].game_title+'</th><th style = "border: 1px solid black">'+myGames[i].username+'</th><th style = "border: 1px solid black">'+myGames[i].score+'</th><th style = "border: 1px solid black">'+myGames[i].created_at+'</th><th></th></tr>';
  			}
  		}
  		gameString+='</table>';
  		res.send(gameString);
  	});
  	
  	
});

app.post('/submit.json',function(req,res){
	app.set('Content-Type', 'text/json');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	myGameTitle = req.body.game_title;
	myUsername = req.body.username;
	myScore = req.body.score;
	date = new Date();
	db.highscores.insert({"game_title":myGameTitle, "username":myUsername, "score":myScore, "created_at":date});
	res.send("Done");
});

app.get('/highscores.json',function(req,res){
	currGameTitle = req.query.game_title;
	app.set('Content-Type', 'text/html');
	var myGames = new Array;
	var gameString = '[';
	numGames = 0;
	db.highscores.find({game_title:currGameTitle},function(err, highscores) {
  		if(err || !highscores) console.log("NOTHING FOUND");
 	 	else highscores.forEach(function(gameFound) {
  			myGames[numGames] = gameFound;
  			numGames++;
  		});
  		myGames = myGames.sort(function(a,b){return b.score-a.score});
  		for (i = 0; i<10; i++) {
  			if (i<numGames) {
  				gameString+='{"game_title":"'+myGames[i].game_title+'","username":"'+myGames[i].username+'","score":'+myGames[i].score+',"created_at":"'+myGames[i].created_at+'","_id":"'+myGames[i]._id+'"}';
  			}
  		}
  		gameString+=']';
  		res.send(gameString);
  	});
  	
  	
});

app.get('/usersearch',function(req,res){
	app.set('Content-Type', 'text/html');
	searchTitle = req.query.game_title;
	gameString="HI";
	buttonString='<script>function callback(){window.location="http://secure-lake-9594.herokuapp.com/usersearch2?username="+document.getElementById("input").value+""}</script>Username: <input id="input" type="text" name="username"><button id="submit" onclick="callback()">Search</button>';
	res.send(buttonString);
});

app.get('/usersearch2',function(req,res){
	currUser = req.query.username;
	app.set('Content-Type', 'text/html');
	var myGames = new Array;
	var gameString = '<h1 style = "text-align:center">'+currUser+'&#146;s Highscores</h1><table style = "margin-left:auto;margin-right:auto;border:3px solid black"><tr><th style = "border: 1px solid black">Game</th><th style = "border: 1px solid black">Username</th><th style = "border: 1px solid black">Score</th><th style = "border: 1px solid black">Date</th></tr>';
	numGames = 0;
	db.highscores.find({usersname:currUser},function(err, highscores) {
  		if(err || !highscores) console.log("NOTHING FOUND");
 	 	else highscores.forEach(function(gameFound) {
  			myGames[numGames] = gameFound;
  			numGames++;
  		});
  		myGames = myGames.sort(function(a,b){
  			if (b.game_title>a.game_title)
  				return -1;
  			if (a.game_title>b.game_title)
  				return 1;
  			else
  				return b.score-a.score;
  			});
  		for (i = 0; i<numGames; i++) {
  			if (i<numGames) {
  				gameString+='<tr><th style = "border: 1px solid black">'+myGames[i].game_title+'</th><th style = "border: 1px solid black">'+myGames[i].username+'</th><th style = "border: 1px solid black">'+myGames[i].score+'</th><th style = "border: 1px solid black">'+myGames[i].created_at+'</th><th></th></tr>';
  			}
  		}
  		gameString+='</table>';
  		res.send(gameString);
  	});
  	
  	
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
