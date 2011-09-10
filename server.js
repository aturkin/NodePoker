
//require.paths.unshift(__dirname + '/../../lib/');

var express = require('express')
  , sio = require('socket.io')
  , template  = require('ejs');

//My objects

var users = new Array();
var manager;


var app = express.createServer();


app.configure(function () {


});



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', { layout: false });
});

app.get('/hello', function (req, res) {
	res.render("hello", {layout: false }); 
})

app.listen(3000, function () {
  var addr = app.address();
  
  //creat Manager
  manager = new Manager();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});
var io = sio.listen(app);
var login = null;
var user;

io.sockets.on('connection', function (socket) {
	//var user = new User(socket)
	users.push(user);

	manager.findTable().addUser(user);

	//users[users.length] = user;

	
	socket.on("validate", function(data) {	

			//user = new User(socket);
			//manager.findTable().addUser(user);
			//users[users.length] = user;
			
			//console.log(users[0].getSocket);	
	});

	socket.on('my other event', function (data) {
	//console.log(data);
	});
});

function User (_socket){
	
	
	var socket = _socket;
	
	socket.on("disconnect", function(){

	console.log("USER DC");
	users.pop(this);

	});


	this.getSocket = function(){ return socket; }
}

function Manager (){

	this.tables = new Array();
	var table = new Table;
	
	Manager.prototype.findTable = function(){
		return table;
	}

}



function Table (){

	this.players = new Array();		

	Table.prototype.tableAvil = function(){

		if(this.players.length > 1){
			return false;
		}

		return true;
	}
		
	Table.prototype.addUser = function(User) {
		this.players[this.players.length] = User;
		
		console.log(this.players.length);

		if (this.players.length > 1){
			console.log("Start Table");
		}
		else{
			console.log("Wait for players");
		}
	}
						
		
}

