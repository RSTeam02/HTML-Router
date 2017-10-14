import { Model } from "./model.js";
import { View } from "./view.js";


export class Controller {

    constructor(setLS) {
        this.setLS = setLS;
        this.date = new Date();
        this.numerals = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty", "thirty-one", "thirty-two", "thirty-three", "thirty-four", "thirty-five", "thirty-six", "thirty-seven", "thirty-eight", "thirty-nine", "forty", "forty-one", "forty-two", "forty-three", "forty-four", "forty-five", "forty-six", "forty-seven", "forty-eight", "forty-nine", "fifty", "fifty-one", "fifty-two", "fifty-three", "fifty-four", "fifty-five", "fifty-six", "fifty-seven", "fifty-eight", "fifty-nine"];
        this.model = new Model();
        this.view = new View();
        if (this.setLS.loadSetting("analogClkSet") !== null) {
            $("#24Check").prop('checked', this.setLS.loadSetting("analogClkSet").check24);
            $("#numCheck").prop('checked', this.setLS.loadSetting("analogClkSet").checkNum);
            $("#rectCheck").prop('checked', this.setLS.loadSetting("analogClkSet").checkRect);
            $('#info').prop('checked', this.setLS.loadSetting("analogClkSet").checkInfo);
        }
        this.init12_24();
        this.saveListener();
        this.enableNum24();
        this.startClockwork();
        this.view.drawCircleOfRects();
    }

    //create Date instance split into time, date outputs, pass to methods and call
    startClockwork() {

        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

        setInterval(() => {
            this.date = new Date();
            var timeDateLocale = this.date.toLocaleString('en-GB', options);
            var timeDatePart = timeDateLocale.split(' ');
            var timeParts = this.date.toLocaleTimeString('en-GB');
            var timePart = timeParts.split(':');
            var timePartNum = timePart.map(Number);
            this.enableMarkRect(timePartNum);
            this.enableHand(timeDatePart, timeParts, timePartNum);
        }, 1000);
    }
    //calc hand angle for h,m,s, when unchecked empty string => view
    enableHand(timeDatePart, timeParts, timePart) {
        var hAngle = ((timePart[0] % this.mode) + timePart[1] / 60) * 30;
        var mAngle = timePart[1] * 6;
        var sAngle = timePart[2] * 6;
        var phrase = this.model.buildPhrase(timePart, this.numerals);
        if (document.getElementById("info").checked) {
            this.view.setViewHms(`${phrase}\u00A0`, `\u00A0${this.model.dayState(timePart)}.`, `<tspan> ${timeDatePart[0]} ${timeDatePart[1]}</tspan><tspan font-size='12' dy ='-7'>${this.model.nth(timeDatePart)}</tspan><tspan dy ='7'> 
            ${timeDatePart[2]} ${timeDatePart[3]} ${timeParts.split(' ')[0]}\u00A0</tspan>`);
            this.view.rotateHand(hAngle / this.divider, mAngle, sAngle);
        } else {
            this.view.clearViewHms();
        }

    }

    analogClkSet() {
        let setting = {
            check24: $('#24Check').is(':checked'),
            checkNum: $('#numCheck').is(':checked'),
            checkRect: $('#rectCheck').is(':checked'),
            checkInfo: $('#info').is(':checked'),
        }
        return setting;
    }

    saveListener() {
        $("#numCheck, #rectCheck, #24Check, #info").click(() => {
            this.setLS.saveSetting("analogClkSet", this.analogClkSet());
            console.log(this.setLS.loadSetting("analogClkSet"))
        });
    }

    //mark rectangles with fill or disable
    enableMarkRect(part) {

        (document.getElementById("rectCheck").checked)
            ? this.view.markRect(Math.floor((5 * ((part[0] % this.mode) + part[1] / 60)) / this.divider), part[1], part[2])
            : this.view.drawCircleOfRects();
    }

    enableNum24() {
        $("#24Check, #numCheck").click(() => {
            this.init12_24();
        });
    }


    //different angle speed dependent on 12 or 24h mode 
    init12_24() {
        let angle;
        if (document.getElementById("24Check").checked) {
            angle = 15;
            this.mode = 24;
            this.divider = 2;
            $("#24h").html("24h");
        } else {
            angle = 30;
            this.mode = 12;
            this.divider = 1;
            let apm = (this.date.getHours() >= 0 && this.date.getHours() < 12) ? "AM" : "PM";
            $("#24h").html(apm);
        }

        let faceAttr = {
            angle: angle,
            mode: this.mode,
            numerals: this.numerals,
            enable: document.getElementById("numCheck").checked
        };
        this.view.drawWrittenNums(faceAttr);
    }

}