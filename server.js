
var routing = require('./router/routing.js');
var app = require('express')();
var http = require('http').Server(app);

var port = 8000;

routing.routing(app);


http.listen(port, function () {
    console.log('Server is listening on port: ' + port);
});