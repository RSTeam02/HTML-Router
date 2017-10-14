# HTML-Router

The HTML Router makes it possible to switch between apps and run them independently on a node server. 
It uses for example previous github projects "Pattern Maker" and "IOClock" with small changes (import path changes, hbs templates instead of html...etc.) 
Used node modules: 
+ express
+ express3-handlebars
+ body-parser

start: nodejs server.js

When clicking on a navigation link it routes and starts up an app with the desired view (handlebars) through the main template. (express.js)
HTML only consists of static elements and through http protocol it remains stateless. If the app or the browser is closed, all settings will be saved via LocalStorage or json.

+ 14.10. => analog clock, see readme.md of subApp
+ 10.10. => autosave all UI-settings (LS), autosave rgb slider directions of ioclock 
 