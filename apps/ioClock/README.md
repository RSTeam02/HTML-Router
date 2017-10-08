# SVG IO-Clock


+ instead of require.js, using native import {} from '../abc.js' command for modular classes, in Firefox experimental => enter in address bar about:config, switch dom.moduleScripts.enabled: true
+ this task is based on SVGSmartUI-Timer, replace stoptimer with clock and change number of units.
+ switch between am/pm, 24h
+ 1 additional digit for year, if year > 63

<br />
 ------------------64<br />
 0---0--32---0--0---0<br />
 0--16---0--16--0---0<br />
 8---8---8---8--0---0<br />
 0---4---4---0--4---0<br />
 0---2---0---0--0---0<br />
 1---0---1---0--1---1<br />=<br /> 
 9--30--45--24--5--65<br />
(HH:MM:SS:DD:MM:YY)

