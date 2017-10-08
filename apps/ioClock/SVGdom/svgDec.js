import {Led} from './led.js';

export class SVGDec extends Led{

    draw(ledObj) {
        let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let numMode;
        $(txt).attr("cursor", "pointer");
        $(txt).attr("transform", "translate(5,20)");
        $(txt).attr("id", ledObj.id);
        $(txt).attr("x", ledObj.absX + 10);
        $(txt).attr("y", ledObj.absY + 10);
        $(txt).attr("style", "writing-mode: sideways-lr");
        $(txt).attr("font-family", "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif");
        $(txt).attr("font-size", "24px");
        $("#ledDisplay").append(txt);
        super.onOffState(ledObj);
    }
}
