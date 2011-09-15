//require.paths.unshift(__dirname + '/../../lib/');

var express = require('express')
  , sio = require('socket.io')
  , template  = require('ejs');

//My objects

var users = new Array();
var manager;


var app = express.createServer();


app.configure(function () {
app.use(express.static(__dirname + '/public'));
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index', { layout: true });
});

app.get('/table', function (req, res) {
	res.render("table", {layout: false  }); 
});

app.listen(3000, function (){ 
  var addr = app.address();
  
  //creat Manager
  manager = new Manager();
  console.log('   app listening on http://' + addr.address + ':' + addr.port);
});
var io = sio.listen(app);
var login = null;
var user;

io.sockets.on('connection', function (socket) {
	
	var user = new User(socket);
	users.push(user);

	manager.addUser(user);
	console.log("Tables Count " + manager.tablesCount);
	
	socket.on("validate", function(data) {	
			
	});
});

function User (_socket){
	
	this.socket = _socket;
	this.userNaem;
	var cards = new Array();

	this.button;

	this.socket.on("disconnect", function(){

		console.log("USER DC");
		manager.removeUser(this);
		users.pop(this);
	});

	this.socket.on("PlayerName", function(data){
		manager.reportName(this, data.user);
	});


	this.sendMsg = function(title, data){
		this.socket.emit(title, data);
	 };

	this.revCards = function(_cards){

		cards = _cards;
		this.sendMsg("cards", {"card1": cards[0], "card2": cards[1]});

	}



	//this.getSocket = function(){ return socket; };

}

function Manager (){

	var tables = new Array();
	
	this.tablesCount;

	this.removeUser = function(player){
		for (var i=0;i < tables.length;i++){
			if (tables[i].removePlayer(player) == true){
				
				tables.pop(tables[i]);
				return true;
			}	
		}
	};

	this.addUser = function(player){
		for (var i=0; i < tables.length;i++){
			
			if(tables[i].tableAvil == true){
				tables[i].addPlayer(player);
				return tables.length;	
			}			
		};

		
		//chagne
		var table = new Table;
		table.addPlayer(player);		
		tables.push(table);
		
		this.tablesCount = tables.length;		


		return tables.length;
	};

	this.reportName = function(player, name){

		for (var i=0;i < tables.length;i++){

			if(tables[i].findPlayer(player) == true){
				tables[i].broadCast("opName", {"name": name});			
			}
		}
	};

	

}



function Table(){

	this.tableAvil;
	var players = new Array();		
	
	var comunCards = new Array();

	var flop;
	var turn;
	var street4;
	
	//even or odd = palyer start bet: Need changed
	var startPlayer = 0;
	var playerBet;



	this.findPlayer = function(User){
	
                for (var i=0;i < players.length;i++){
			 if(players[i].socket.id == User.id){
				return true;
			 }
		}

	};

	 this.removePlayer = function (User) {
		
		for (var i=0;i < players.length;i++){
			if(players[i].socket.id == User.id){

				console.log("Player removed!");
				players.pop(User);

				
				this.broadCast("tableStatus", "You are the Winner!");

				return true;

			}
		}
		
		return false;
	};
	
		
	this.addPlayer = function(User) {
		players.push(User);

		if (players.length > 1){
			this.tableAvil = false;
			this.broadCast("tableStatus", "Start Table!");
			console.log("Start Table");
			dealCards();
		}
		else{
			this.tableAvil = true;
			this.broadCast("tableStatus", "Waiting on more players!");
			console.log("Waiting on more players");
			players[0].button = true;
		}
	};

	var dealCards = function(){

		deck = new Deck;
		for (var i=0;i < players.length;i++){
			players[i].revCards(new Array(deck.getCard(), deck.getCard()));

		}

		comunCards.push(deck.getCard())
		comunCards.push(deck.getCard())
		comunCards.push(deck.getCard())
		comunCards.push(deck.getCard())
		comunCards.push(deck.getCard())

	};

	this.game = function(User, action){

		if(User.id == players[startPlayer].socket.id){
			
		}


	};



	var moveButton = function(){
		if (players[0].button == true){
			players[0].button = false;
			players[1].button = true;
		}else{

		        players[1].button = false;
                        players[0].button = true;
		}		
	};


	this.broadCast = function(title, data){
		
		for (var i=0;i < players.length;i++){		
			players[i].sendMsg(title, data); 
		}		
	};

					
}


function Deck(){
	
	var deck = new Array("c1", "c2", "c3", "c4", "c5", "c6", "c7","c8","c9","c10","cj", "cq", "ck",
			     "d1", "d2", "d3", "d4", "d5", "d6", "d7","d8","d9","d10","dj", "dq", "dk", 
			     "h1", "h2", "h3", "h4", "h5", "h6", "h7","h8","h9","h10","hj", "hq", "hk", 
			     "s1", "s2", "s3", "s4", "s5", "s6", "s7","s8","s9","s10","sj", "sq", "sk");
	 this.getCard  = function(){
		
                return deck.splice(Math.floor(Math.random()*deck.length),1);
        };
	


}


function Card(_suit, _value){

	this.suit = _suit;
	this.value = _value;

}

