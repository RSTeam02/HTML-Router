# HTML-Router

The HTML Router makes it possible to switch between apps and run them independently on a node server. 
It reuses for testing purposes previous github projects "Pattern Maker", "IOClock", "xDice" with small changes (import path changes, hbs templates instead of html...etc.) 
Used node modules: 
+ express
+ express3-handlebars
+ body-parser

start: nodejs server.js

When clicking on a navigation link it routes (express.js) and starts up an app with the desired view (handlebars) through the main template.
HTML only consists of static elements and through http protocol it remains stateless. If the app or the browser is closed, all settings will be saved via LocalStorage or json.

+ 25.10. => added a new game instance (sliding puzzle game): added a new attribute "game" in json to choose one in a set of games, score entry: negate milliseconds to swap from descending to ascending order (less used time is better)
+ 18.10. => assemble xDice app with ScoreApp, every score of all row and column settings will be stored to a single json file. 
+ 17.10. => reuse, add xDice and ScoreApp: select number of rows and columns, enter name, roll dice and save score entry on server-side
+ 14.10. => add analog clock, see readme.md of subApp
+ 10.10. => autosave all UI-settings (LS), autosave rgb slider directions of ioclock 
 