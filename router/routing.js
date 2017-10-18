/**
 * @sakaijun
 * 
 * route, switch between hbs contents loaded in the main.hbs template 
 * 
 */

var path = require('path');
var express = require('express');
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser');


var startup = function (app) {

  app.use(express.static(__dirname + '/../apps'));
  app.engine('hbs', expressHbs({ extname: 'hbs', defaultLayout: 'main.hbs' }));
  app.set('view engine', 'hbs');
  app.use(bodyParser.urlencoded({ extended: true }));


  app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
  });

  app.get('/', function (req, res) {
    res.render('index', { index: true });
  });

  app.get('/ioclock', function (req, res) {
    res.render('ioclock', { ioclock: true });
  });

  app.get('/analogclk', function (req, res) {
    res.render('analogclk', { analogclk: true });
  });

  app.get('/xdice', function (req, res) {
    res.render('xdice', { xdice: true });
  });

}
module.exports.startup = startup;   