/**
 * @rsTeam02
 * Control unit 
 */

import { Clock } from './clock.js';
import { SVGTextObj } from '../SVGdom/svgTextObj.js';
import { SVGStaticObj } from '../SVGdom/svgStaticObj.js';
import { SVGCircle } from '../SVGdom/svgCircle.js';
import { SVGDec } from '../SVGdom/svgDec.js';
import { SVGRect } from '../SVGdom/svgRect.js';
import { DrawStrategy } from '../strategy/drawStrategy.js';
import { Raster } from './raster.js';



export class Controller {

    constructor(setLS) {
        this.setLS = setLS;
        this.shiftClass = document.getElementsByClassName("shiftClass");
        this.colClass = document.getElementsByClassName("colClass");
        for (let i = 0; i < this.colClass.length; i++) {
            this.colClass[i].value = Math.floor(Math.random() * 252) + 1;
        }
        new SVGStaticObj().svgTitle("IO-Clock");
        this.classRadioShape = document.getElementsByClassName("radioBtnShape");
        this.classRadioCol = document.getElementsByClassName("radioBtnCol");
        this.incrdecr = new Array(3);
        this.op = new Array(3);
        this.op.fill(7.5);
        this.initGradient();
        this.RGBSlider();
        this.saveListener();
        this.radioListener();
        if (this.setLS.loadSetting("ioClkSet") !== null) {
            $(`#${this.setLS.loadSetting("ioClkSet").shape}`).prop('checked', true);
            $(`#${this.setLS.loadSetting("ioClkSet").apm}`).prop('checked', true);
            $("#redInfo").html(`Red: ${this.setLS.loadSetting("ioClkSet").r}`);
            $("#greenInfo").html(`Green: ${this.setLS.loadSetting("ioClkSet").g}`);
            $("#blueInfo").html(`Blue: ${this.setLS.loadSetting("ioClkSet").b}`);
            $("#red").val(this.setLS.loadSetting("ioClkSet").r);
            $("#green").val(this.setLS.loadSetting("ioClkSet").g);
            $("#blue").val(this.setLS.loadSetting("ioClkSet").b);
            $('#shiftR').prop('checked', this.setLS.loadSetting("ioClkSet").checkR);
            $('#shiftG').prop('checked', this.setLS.loadSetting("ioClkSet").checkG);
            $('#shiftB').prop('checked', this.setLS.loadSetting("ioClkSet").checkB);
            this.rgbRand(false, this.setLS.loadSetting("ioClkSet").minMax.split(","));
        }
        this.model = new Clock();
        this.raster = new Raster();
        this.textView = new SVGTextObj();
        this.selectStrategy();

        this.res = 0;

        setInterval(() => {
            this.updateView();
            this.rgbRand();
        }, 1000)

    }

    saveListener() {
        $(".radioBtnShape, .radioBtnFormat, .shiftClass, .colClass").click(() => {
            this.setLS.saveSetting("ioClkSet", this.ioClkSet());
        });
    }

    radioListener() {

        for (let i = 0; i < this.classRadioShape.length; i++) {
            $(this.classRadioShape[i]).click(() => {
                this.selectStrategy();
            });
        }
    }


    //assign every ui setting to a json
    ioClkSet() {
        let setting = {
            r: $("#red").val(),
            g: $("#green").val(),
            b: $("#blue").val(),
            apm: $("input:radio[name='apm']:checked").attr("id"),
            checkR: $('#shiftR').is(':checked'),
            checkG: $('#shiftG').is(':checked'),
            checkB: $('#shiftB').is(':checked'),
            shape: $("input:radio[name='format']:checked").val(),
            minMax: this.posStr
        }

        return setting;
    }

    selectStrategy() {
        var strategyObj = {
            dec: new SVGDec(),
            dot: new SVGCircle(),
            rect: new SVGRect()
        }

        for (let i = 0; i < Object.keys(strategyObj).length; i++) {
            $.each(strategyObj, (key, val) => {
                if (key == $("input:radio[name='format']:checked").val()) {
                    this.strategy = new DrawStrategy(val);
                }
            });
        }
    }

    updateView() {
        this.model.timeDate($('#24h').is(':checked'), (cb) => {
            this.clrSVGDisp();
            this.clrSVGTxt();
            this.raster.drawRaster(this.strategy, cb);
            this.textView.svgText(cb);
        });
    }

    clrSVGDisp() {
        while (ledDisplay.firstChild) {
            ledDisplay.removeChild(ledDisplay.firstChild);
        }

    }

    clrSVGTxt() {
        while (nativeDisplay.firstChild) {
            nativeDisplay.removeChild(nativeDisplay.firstChild);
        }
    }

    RGBSlider() {
        for (var i = 0; i < this.colClass.length; i++) {
            this.colClass[i].addEventListener("input", () => {
                this.setGradient();
            });
        }
    }

    initGradient() {

        var radialGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");

        $(radialGradient).attr("id", "RadialGradient5");
        $("#defCol").append(radialGradient);

        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        $(stop1).attr("id", "stop1");
        $(stop1).attr("offset", "0%");
        $(stop1).attr("stop-color", "white");
        $("#RadialGradient5").append(stop1);

        this.stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        $(this.stop2).attr("id", "stop2");
        $(this.stop2).attr("offset", "100%");
        $("#RadialGradient5").append(this.stop2);
    }

    /*
     *load once the slider directions from the ls, 
     *else alternate from 0 to 255 in 7.5 steps for each rgb component
     */

    rgbRand(loadedOnce = true, minMax = []) {
        let rgb = new Array(3);
        let pos = [];

        for (var i = 0; i < rgb.length; i++) {
            rgb[i] = parseInt(this.colClass[i].value);
        }
        for (var i = 0; i < this.colClass.length; i++) {
            if (!loadedOnce) {
                if (minMax[i] == 0) {
                    this.op[i] = 7.5;
                }
                if (minMax[i] == 255) {
                    this.op[i] = -7.5;
                }
            } else {
                if (this.colClass[i].value == 0) {
                    this.op[i] = 7.5;
                }
                if (this.colClass[i].value == 255) {
                    this.op[i] = -7.5;
                }
            }
            pos[i] = (this.op[i] > 0) ? 0 : 255;
            rgb[i] += this.op[i];
        }
        for (var i = 0; i < rgb.length; i++) {
            if (this.shiftClass[i].checked) {
                this.colClass[i].value = rgb[i];
            }
        }
        this.posStr = pos.join(",");
        this.setGradient();
    }

    setGradient() {
        $("#redInfo").html(`Red: ${$("#red").val()}`);
        $("#greenInfo").html(`Green: ${$("#green").val()}`);
        $("#blueInfo").html(`Blue: ${$("#blue").val()}`);
        $(this.stop2).attr("stop-color", `rgba(${$("#red").val()},${$("#green").val()},${$("#blue").val()},1)`);
    }
}
