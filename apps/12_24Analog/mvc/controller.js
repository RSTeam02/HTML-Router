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
            $('#phraseCheck').prop('checked', this.setLS.loadSetting("analogClkSet").checkPhrase);
        }
        this.range();
        this.pCheck();
        this.init12_24();
        this.saveListener();
        this.enableNum24();
        this.pMode();


    }

    pCheck() {
        $("#phraseCheck").click(() => {
            this.pMode();
        });

    }

    pMode() {
        this.view.drawCircleOfRects();

        if ($('#phraseCheck').is(':checked')) {
            this.rotateHM();
            clearInterval(this.interval);
        } else {
            this.startClockwork();
        }
        this.clickListener($('#phraseCheck').is(':checked'), this.handler);
    }

    range() {

        let hmRange = document.getElementsByClassName("hmRange");

        for (var i = 0; i < hmRange.length; i++) {
            this.handler = () => {
                this.rotateHM();
            };
        }
    }

    clickListener(click, handler) {
        let hmRange = document.getElementsByClassName("hmRange");

        for (let i = 0; i < hmRange.length; i++) {
            if (click) {
                hmRange[i].addEventListener("input", handler, false);
            } else {
                $("#hInfo").html("");
                $("#mInfo").html("");
                hmRange[i].removeEventListener("input", handler, false);
            }
            hmRange[i].disabled = !click;
        }
    }

    setHms(h, m, s = 0) {
        this.hms = {
            hour: parseInt(h),
            min: parseInt(m),
            sec: parseInt(s)
        };
    }

    getHms() {
        return this.hms;
    }

    //mark rectangles => slow
    rotateHM() {
        //this.view.drawCircleOfRects();
        this.setHms($("#hRange").val(), $("#mRange").val());
        $("#hInfo").html(`hour: ${this.getHms().hour}`);
        $("#mInfo").html(`min: ${this.getHms().min}`);
        //this.enableMarkRect(this.getHms(), false);
        var phrase = this.model.buildPhrase(this.getHms(), this.numerals);
        this.view.setViewHms(`${phrase}\u00A0`, `\u00A0${this.model.dayState(this.getHms())}.`);
        this.view.rotateHand(((this.getHms().hour % this.mode) + this.getHms().min / 60) * 30 / this.divider, this.getHms().min * 6);
    }
    //create Date instance split into time, date outputs, pass to methods and call
    startClockwork() {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        this.interval = setInterval(() => {
            this.date = new Date();
            var timeDateLocale = this.date.toLocaleString('en-GB', options);
            var timeDatePart = timeDateLocale.split(' ');
            this.setHms(this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
            this.enableMarkRect(this.getHms(), true);
            this.enableHand(timeDatePart, this.getHms());
        }, 1000);
    }
    //calc hand angle for h,m,s, when unchecked empty string => view
    enableHand(timeDatePart, hms) {
        var hAngle = ((hms.hour % this.mode) + hms.min / 60) * 30;
        var mAngle = hms.min * 6;
        var sAngle = hms.sec * 6;
        var phrase = this.model.buildPhrase(hms, this.numerals);
        if (document.getElementById("info").checked) {
            this.view.setViewHms(`${phrase}\u00A0`, `\u00A0${this.model.dayState(hms)}.`, `<tspan> ${timeDatePart[0]} ${timeDatePart[1]}</tspan><tspan font-size='12' dy ='-7'>${this.model.nth(timeDatePart)}</tspan><tspan dy ='7'> 
            ${timeDatePart[2]} ${timeDatePart[3]} ${hms.hour}:${hms.min}:${hms.sec}\u00A0</tspan>`);
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
            checkPhrase: $('#phraseCheck').is(':checked')
        }
        return setting;
    }

    saveListener() {
        $("#numCheck, #rectCheck, #24Check, #info, #phraseCheck").click(() => {
            this.setLS.saveSetting("analogClkSet", this.analogClkSet());
        });
    }

    //mark rectangles with fill or disable
    enableMarkRect(part, enSec) {

        (document.getElementById("rectCheck").checked)
            ? this.view.markRect(Math.floor((5 * ((part.hour % this.mode) + part.min / 60)) / this.divider), part.min, part.sec, enSec)
            : this.view.drawCircleOfRects();
    }

    enableNum24() {
        $("#24Check, #numCheck").click(() => {
            this.init12_24();
            this.rotateHM();
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