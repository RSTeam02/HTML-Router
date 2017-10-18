
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var score = require('./scorecontroller/scoredataIO.js');
var routing = require('./router/routing.js');
var port = 8000;

score.initScore(app, io);
routing.startup(app);

http.listen(port, function () {
    console.log('Server is listening on port: ' + port);
});