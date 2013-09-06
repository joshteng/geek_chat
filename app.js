//require necessary modules
var http = require('http');
var express = require('express');
var socketIO = require("socket.io");

//initialize our application
var app = express();
var server = http.createServer(app).listen(8080);
var io = socketIO.listen(server);

//settings
var settings = {
  'view_directory': '/views',
  'stylesheets_directory': '/assets/css',
  'javascript_directory': '/assets/js'
}


app.get('/', function(request, response){
  response.sendfile(__dirname + settings.view_directory + '/index.html')
});

app.get('/*.css', function(request, response){
  response.sendfile(__dirname + settings.stylesheets_directory + request.originalUrl)
});

app.get('/*.js', function(request, response){
  response.sendfile(__dirname + settings.javascript_directory + request.originalUrl)
});


//chat using socket.io
io.sockets.on('connection', function(client){
  //when client sends a join event
  client.on('join', function(data){
    client.set('nickname', data);
    client.broadcast.emit('message', { message: data + " just joined!", nickname: "Server Announcement" });
  });

  //when client sends a message
  client.on('message', function(data){
    client.get('nickname', function(err, nickname){
      client.broadcast.emit('message', { message: data, nickname: nickname });      
    });
  });

})