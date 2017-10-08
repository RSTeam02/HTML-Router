/**
 * @sakaijun
 * 
 * broadcast number of players via socketIO
 * init all scores from the scores textfile when server starts, convert into string, store in array 
 * receive socketIO messages (new score) from client(s) 
 * after adding/pushing a new score into array, sort by multiple fields (mode, level asc, score desc.) (lodash), add rank, save in scores textfile
 * http://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
 * http://stackoverflow.com/questions/22928841/lodash-multi-column-sortby-descending
 * UI feature: create a view of certain part of score for each client, by drop down list selection (mode/level)
 * to prevent huge textfiles limit to n - entries per table, gt n => remove/splice  
 */

var times = [];
var path = require('path');
var express = require('express');
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser');


var routing = function (app) {

  app.use(express.static(__dirname + '/../apps'));
  app.engine('hbs', expressHbs({ extname: 'hbs', defaultLayout: 'main.hbs' }));
  app.set('view engine', 'hbs');
  app.use(bodyParser.urlencoded({ extended: true }));


  app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
  });

  app.get('/', function (req, res) {
    res.render('index',{index: true});

  });

  app.get('/ioclock', function (req, res) {
    res.render('ioclock', {ioclock: true});
  });

}
module.exports.routing = routing;   