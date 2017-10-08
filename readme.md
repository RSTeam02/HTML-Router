# HTML Router

It uses for example the previous github projects "Pattern Maker" and "IOClock" with small changes (path changes, hbs instead of html...) to run them independently on a node server. 
Used node modules: 
+ express
+ express3-handlebars
+ body-parser

start: nodejs server.js

When clicking on a navigation link it starts up a controller with the desired view (handlebars) through the main template, routed by expressjs.
HTML is stateless, some of the app settings are saved by LocalStorage or json locally.
 