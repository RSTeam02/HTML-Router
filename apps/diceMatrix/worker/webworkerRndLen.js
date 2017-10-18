//calculate random roll length for every dice
let val = 1 + Math.floor(Math.random() * 80);
var diceAttr = {
	cnt: 0,
	finished: false
};
var timeout;

function rollLen() {
    if (diceAttr.cnt !== val) {
        timeout = setTimeout("rollLen()", 20);
        diceAttr.cnt++;
    } else {
        clearTimeout(timeout);
        diceAttr.finished = true;
    }
    postMessage(diceAttr);
}
rollLen();