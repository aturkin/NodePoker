var User = function(_socket)
{
	var socket = _socket;
	
	this.getSocket = function(){ return socket; }
}

function User(socket)
{
	this.socket = socket;
}

User.prototype = {
	getSocket: function(){return this.socket;}
};

