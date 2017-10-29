/**
 * @sakaijun
 * Control unit 
 * +define a 2x2, 3x3 4x4 or 5x5 Matrix
 * +shuffle 0-24, 0-15, 0-8, 0-3, Phrase or Integer
 * +Time-Challenge => save top times in localstorage, every mode has its own top time list/storage
 */


import { Stopper } from "./stopper.js";
import { Player } from "../../player.js";
import { TileMatrix } from "./tileMatrix.js";
import { View } from "./view.js";
import { Shuffle } from "./shuffle.js";
import { Evaluation } from "./evaluation.js";

export class Controller {

    constructor(setLS) {
        this.socket = io();
        this.setLS = setLS;
        this.solution = [];
        if (this.setLS.loadSetting("puzzleSet") !== null) {
            $("#slider").val(this.setLS.loadSetting("puzzleSet").x);
            $(`#${this.setLS.loadSetting("puzzleSet").mode}`).prop('checked', true);
        }
        this.allFormat = document.getElementById("slider");
        this.showFormat(this.allFormat.value);
        this.removeEvent = new CustomEvent("removeListener");
        this.stopper = new Stopper();
        this.dim = parseInt(this.allFormat.value);
        this.initRaster(this.dim, true);
        this.btnListener();
        this.getXMLHttp();

    }

    showFormat(n) {
        document.getElementById("formatInfo").innerHTML = "Format: " + n + "x" + n;
    }

    btnListener() {

        $("#slider, .gmode").on('input', () => {
            this.resetSW();        
            this.showFormat(parseInt($('#slider').val()));           
            this.initRaster(true);
            this.timeArr = [];
            this.setLS.saveSetting("puzzleSet", this.puzzleSet());
        });


        $("#ng").click(() => {
            //game starts => preview mode false
            this.initRaster(false);
            //time challenge (entry in top-time list: rank. name ...time) or normal mode (just play)
            if (document.getElementById("time").checked) {

                this.player = new Player();
                var defaultName = "NoName";
                var name = prompt("Enter your name", defaultName);
                (name !== null)
                    ? this.player.setName(name)
                    : this.player.setName(defaultName);

                this.resetSW();
                this.view.playerInfo("Ready, Set...");
                setTimeout(() => {
                    this.startSW();
                }, 2000);
            } else {
                this.tileListener();
            }
        });
    }


    initView(seq, dim) {
        this.view = new View(seq, this.mode);
        this.view.svgMat();
    }
    //start, reset stopper accuracy 1/10 sec.
    resetSW() {
        this.hmsElapsed = [];
        clearInterval(this.interval);
        this.view.playerInfo(["00", "00", "00", "0"].join(":"));
    }

    startSW() {
        this.tileListener();
        this.hmsElapsed = [];
        this.start = Math.floor(new Date().getTime() / 10);
        this.interval = setInterval(() => {
            this.msElapsed = this.stopper.startLap(this.start);
            this.hmsElapsed = this.stopper.convertHms(this.msElapsed).join(":");
            this.view.playerInfo(this.hmsElapsed);
        }, 100);
    }

    getXMLHttp() {
        $.get("../scorefile/score.json", (data, status) => {
            this.view.scoreTable(data);
            //console.log(status);
        });
    }

    //mxn tiles react on clicks, events
    tileListener() {
        //handler/listener for each tile, compare with solution after each shift  
        for (let i = 0; i < this.tileArr.length; i++) {
            for (let j = 0; j < this.tileArr[i].length; j++) {
                (() => {
                    let handler = () => {
                        this.xyControl(this.tileArr[i][j].sId, this.tileArr[i][j].swapVal - 1, (this.tileArr.length * this.tileArr[i].length) - 1);
                        this.evaluation.evaluate((cb) => {
                            if (cb === "Solved!") {
                                if (this.player !== undefined) {
                                    clearInterval(this.interval);
                                    this.player.setScore(-this.msElapsed);
                                    this.player.setGame("puzzle");
                                    this.player.setX($("#slider").val());
                                    this.player.setY($("#slider").val());
                                    this.player.setTime(this.hmsElapsed);
                                    //this.view.viewPlayer(`${this.player.getName()}'s final score: ${this.player.getScore()}`);
                                    $("#name").val("");
                                    $("#score").val("");
                                    this.socket.emit('message', this.player);
                                    this.getXMLHttp();
                                    this.player = undefined;
                                }
                                this.view.playerInfo(cb);
                                document.getElementById("shape" + this.nxn).setAttribute("fill", "white");
                                document.dispatchEvent(this.removeEvent);
                            }
                        }, this.solution);
                    };
                    this.clickListener(true, this.tileArr[i][j], handler);

                    document.addEventListener("removeListener", () => {
                        if (i < this.tileArr.length && j < this.tileArr[i].length) {
                            this.clickListener(false, this.tileArr[i][j], handler);
                        }
                    });
                })();
            }
        }
    }

    //init solution for comparison
    initSolution() {
        let solutionArr = [];
        let allId = document.getElementsByClassName("pos");

        for (let i = 0; i < Math.pow(this.tileArr.length, 2); i++) {
            solutionArr[i] = `${allId[i].getAttribute("value")}=${allId[i].getAttribute("x")},${allId[i].getAttribute("y")}`;
        }
        return solutionArr;
    }

    puzzleSet() {
        let setting = {
            game: "puzzle",
            x: $("#slider").val(),
            mode: $('input[name=gm]:checked').attr("id")
        }
        return setting;
    }

    //when game starts, enable eventlisteners, when end, disable for each tile
    clickListener(click, tile, handler) {
        (click)
            ? tile.sId.addEventListener("click", handler, false)
            : tile.sId.removeEventListener("click", handler, false);
    }

    //init random sequence to tiles
    initSeq(seq) {
        let idx = 0;

        for (let i = 0; i < this.tileArr.length; i++) {
            for (let j = 0; j < this.tileArr[i].length; j++) {
                this.tileArr[i][j].sId = document.getElementById("shape" + idx);
                this.tileArr[i][j].swapVal = idx + 1;
                idx++;
            }
        }
    }

    //preview === ordered, solution state, !preview === when game starts, random state, tiles reacts on events
    initRaster(preview) {
        let seq = [];
        this.tileMat = new TileMatrix();
        let dim = parseInt($('#slider').val());
        this.tileArr = this.tileMat.createTileMat(dim, dim);
        this.nxn = Math.pow(dim, 2) - 1;
        this.evaluation = new Evaluation();
        if (preview) {
            seq = new Shuffle().previewOrder(this.tileArr);
            this.initView(seq, dim);
            this.solution = this.initSolution();
            document.getElementById("shape" + this.nxn).setAttribute("fill", "white");
        } else {
            seq = new Shuffle().randomOrder(this.tileArr);
            this.initView(seq, dim);
            this.initSeq(seq);
        }
        this.view.playerInfo("");
        this.getXMLHttp();
    }
    //control direction each tile
    xyControl(tile, x, lastElement) {
        lastElement = document.getElementById("shape" + lastElement);
        //swap rows with last, avoid collisions y-axis 
        if (parseInt(tile.getAttribute("x")) === parseInt(lastElement.getAttribute("x"))) {
            if (tile.id === "shape" + x && parseInt(tile.getAttribute("y")) === parseInt(lastElement.getAttribute("y")) + 30) {
                if (parseInt(tile.getAttribute("y")) - 30 === parseInt(lastElement.getAttribute("y"))) {
                    this.swapYLast(tile, lastElement, -30)
                }
            } else {
                if (parseInt(tile.getAttribute("y")) + 30 === parseInt(lastElement.getAttribute("y"))) {
                    this.swapYLast(tile, lastElement, 30);
                }
            }
        }
        //swap cols with last, avoid collisions x-axis    
        if (parseInt(tile.getAttribute("y")) === parseInt(lastElement.getAttribute("y"))) {
            if (tile.id === "shape" + x && parseInt(tile.getAttribute("x")) === parseInt(lastElement.getAttribute("x")) + 30) {
                if (parseInt(tile.getAttribute("x")) - 30 === parseInt(lastElement.getAttribute("x"))) {
                    this.swapXLast(tile, lastElement, -30);
                }
            } else {
                if (parseInt(tile.getAttribute("x")) + 30 === parseInt(lastElement.getAttribute("x"))) {
                    this.swapXLast(tile, lastElement, 30);
                }
            }
        }

    }
    //swap tile with gap
    swapXLast(tile, lastElement, len) {
        tile.setAttribute("x", parseInt(tile.getAttribute("x")) + len);
        lastElement.setAttribute("x", parseInt(lastElement.getAttribute("x")) - len);
    }

    swapYLast(tile, lastElement, len) {
        tile.setAttribute("y", parseInt(tile.getAttribute("y")) + len);
        lastElement.setAttribute("y", parseInt(lastElement.getAttribute("y")) - len);
    }

}