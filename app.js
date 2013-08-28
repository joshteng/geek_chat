//our main application

//requiring necessary modules
var express = require("express");
var socket = require("socket.io");
var redis = require("redis");

//initializing our application
var app = express();
var http = require('http');
var server = http.createServer(app).listen(8080);
var io = require('socket.io').listen(server);
var redisClient = redis.createClient();

//custom variables
var settings = { 
  'view_directory': '/views', 
  'stylesheets_directory': '/assets/css'
}

//express routing
app.get('/', function(request, response){
  response.sendfile(__dirname + settings.view_directory + '/index.html')
});

//to serve stylesheets
//should use web server like apache or use some CDN to serve static assets
app.get('/*.css', function(request, response){
  response.sendfile(__dirname + settings.stylesheets_directory + request.originalUrl)
});

io.sockets.on('connection', function(client){
  console.log("Client connected");

  client.on('join', function(data){
    client.set('nickname', data);
    //send old messages from redis
    //broadcast arrival of this person
    //store person in database
  });

  client.on('message', function(data){
    client.get('nickname', function(err, nickname){
      //broadcast the message
      client.broadcast.emit('message', { message: data, nickname: nickname });
    });
    //store message in database
  });

});