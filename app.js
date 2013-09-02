//our main application

//***********requiring necessary modules***************//
var express = require("express");
var socket = require("socket.io");
var http = require('http');
var socketIO = require('socket.io');


//***********initializing our application***************//
var app = express();
var server = http.createServer(app).listen(8080);
var io = socketIO.listen(server);


//***********app settings***************//
var settings = { 
  'view_directory': '/views', 
  'stylesheets_directory': '/assets/css',
  'javascript_directory': '/assets/js'
}


//***********express routing***************//
app.get('/', function(request, response){
  response.sendfile(__dirname + settings.view_directory + '/index.html')
});

//to serve stylesheets and script files
//should use web server like apache or use some CDN to serve static assets!!!! This is no good!
app.get('/*.css', function(request, response){
  response.sendfile(__dirname + settings.stylesheets_directory + request.originalUrl)
});

app.get('/*.js', function(request, response){
  response.sendfile(__dirname + settings.javascript_directory + request.originalUrl)
});



//***********socket.io code to handle websocket connections***************//
io.sockets.on('connection', function(client){
  //when a new client joins
  client.on('join', function(data){
    //set the client's nickname.. probably stored in cookie/session
    client.set('nickname', data);
  });

  client.on('message', function(data){
    //get the message sender's nickname
    client.get('nickname', function(err, nickname){
      //broadcast the message to every client connected
      client.broadcast.emit('message', { message: data, nickname: nickname });
    });
  });

});

//the events ie. join, message are custom defined events. as long as they match up with frontend code, that works!
