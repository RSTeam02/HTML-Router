import {Led} from './led.js';

export class SVGRect extends Led{

    draw(ledObj) {
        let led = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        $(led).attr("cursor", "pointer");
        $(led).attr("id", ledObj.id);
        $(led).attr("transform", `translate(${ledObj.absX} ${ledObj.absY + 25})`);
        $(led).attr("width", 20);
        $(led).attr("height", 30);
        $("#ledDisplay").append(led);
        super.onOffState(ledObj);
    }

}
