# HTML Router

It uses for example the previous github projects "Pattern Maker" and "IOClock" with small changes (path changes, hbs templates instead of html...) to run them independently on a node server. 
Used node modules: 
+ express
+ express3-handlebars
+ body-parser

start: nodejs server.js

When clicking on a navigation link it routes and starts up an app with the desired view (handlebars) through the main template, routed by expressjs.
HTML consists only of static elements and through http protocol it remains stateless, through client side JS some states of the settings are saved by LocalStorage or json locally.
 