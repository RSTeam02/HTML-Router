# HTML Router

It uses for example the previous github projects "Pattern Maker" and "IOClock" with small changes (import path changes, hbs templates instead of html...etc.) to switch between them and run independently on a node server. 
Used node modules: 
+ express
+ express3-handlebars
+ body-parser

start: nodejs server.js

When clicking on a navigation link it routes and starts up an app with the desired view (handlebars) through the main template. (express.js)
HTML only consists of static elements and through http protocol it remains stateless. The client side JS saves some states of the current settings in LocalStorage or json.
 