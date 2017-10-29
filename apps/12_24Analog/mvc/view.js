export class View {

    constructor() {
        this.shape = [];
        this.rotation = 45;
        this.svgns = "http://www.w3.org/2000/svg";

    }

    //word output of min , hour, sec
    setViewHms(h, m, s = "") {
        document.getElementById("min").innerHTML = h;
        document.getElementById("hour").innerHTML = m;
        document.getElementById("sec").innerHTML = s;

    }

    //empty string when disabled
    clearViewHms() {

        document.getElementById("min").innerHTML = "";
        document.getElementById("hour").innerHTML = "";
        document.getElementById("sec").innerHTML = "";
    }

    //face numbering
    drawWrittenNums(faceAttr) {
        let writtenNum;       
        let num = document.getElementById("num");
        while (num.lastChild){
            num.removeChild(num.lastChild);         
        }

        if (faceAttr.enable) {
            for (var i = 0; i < faceAttr.mode; i++) {
                var numString = document.createElementNS(this.svgns, "text");
                numString.setAttributeNS(null, "x", 25);
                numString.setAttributeNS(null, "y", 50);
                numString.setAttributeNS(null, "font-size", 14);
                numString.setAttributeNS(null, "transform", "translate(110 110) rotate(" + this.rotation + " 215 215)");
                numString.setAttributeNS(null, "fill", "magenta");
                this.rotation += parseInt(faceAttr.angle);
                writtenNum = faceAttr.numerals[i];
                var textNode = document.createTextNode(writtenNum);
                numString.appendChild(textNode);
                num.appendChild(numString);
            }
        }

    }

    //draw non filled rects in circular shape
    drawCircleOfRects() {
        let scala = document.getElementById("scala");

        while (scala.firstChild){
            scala.removeChild(scala.firstChild);            
        }

        for (var i = 0; i < 60; i++) {
            this.shape[i] = document.createElementNS(this.svgns, "rect");
            this.shape[i].setAttributeNS(null, "cx", 25);
            this.shape[i].setAttributeNS(null, "cy", 50);
            this.shape[i].setAttributeNS(null, "width", 35);
            this.shape[i].setAttributeNS(null, "height", 20);
            this.shape[i].setAttributeNS(null, "stroke", "green");
            this.shape[i].setAttributeNS(null, "transform", "translate(110 110) rotate(" + this.rotation + " 215 215)");
            this.shape[i].setAttributeNS(null, "attributeName", "transform");
            this.rotation += 6;
            document.getElementById("scala").appendChild(this.shape[i]);
        }

    }

    //fill color for each pointing rectangle when 1 sec, min hour passes
    markRect(hour, min, sec, enSec) {
        if (sec == 1) {
            this.drawCircleOfRects();
        }
        this.shape[parseInt(hour)].setAttributeNS(null, "fill", "deepskyblue");
        this.shape[parseInt(min)].setAttributeNS(null, "fill", "orangered");
        if (enSec) {
            this.shape[parseInt(sec)].setAttributeNS(null, "fill", "lime");
        }
    }

    //pass calculated angles and draw hands h,m ,s
    rotateHand(hAngle, mAngle, sAngle = "") {
        var mHand = document.getElementById("min");
        var hHand = document.getElementById("hour");
        var sHand = document.getElementById("sec");
        mHand.setAttributeNS(null, "font-size", 14);
        hHand.setAttributeNS(null, "font-size", 14);
        sHand.setAttributeNS(null, "font-size", 14);
        mHand.setAttribute("transform", "rotate(" + (mAngle + 90) + ",325,325)");
        hHand.setAttribute("transform", "rotate(" + (hAngle - 90) + ",325,325)");        
        sHand.setAttribute("transform", "rotate(" + (sAngle + 90) + ",325,325)");
    }
}