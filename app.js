var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html')
})
app.use('/client',express.static(__dirname + '/client'));

http.listen(3000, function () {
	console.log("Server started");
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.id = Math.random();
  socket.x = 0;
  socket.y = 0;
  SOCKET_LIST(socket_id) = socket;
  
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});

var SOCKET_LIST = ();
