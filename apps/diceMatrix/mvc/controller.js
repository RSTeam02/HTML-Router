/**
 * @rsTeam02
 * roll n - dices => Control Unit
 */

import { View } from "./view.js";
import { TestWorker } from "../testworker/test.js";
import { Player } from "./player.js";

export class Controller {

    constructor(setLS) {
        this.currentScore = {
            set current(score) {
                this.pts = score;
            },
            pts: 0
        }
        this.setLS = setLS;
        this.start = 0;
        this.socket = io();

        if (this.setLS.loadSetting("diceSet") !== null) {      
            $("#x").val(this.setLS.loadSetting("diceSet").x);
            $("#y").val(this.setLS.loadSetting("diceSet").y); 
            $(`#${this.setLS.loadSetting("diceSet").face}`).prop('checked', true);    
        }
        console.log(this.diceFace)
        this.saveListener();
        this.socketOn();
        this.getXMLHttp();
        this.initPlayer();
        this.view = new View();      
        $("#result").html("Random Result of 0 Dices: 0");
        $("#testRes").html("Expected Test Result: 0");
        this.initSetting();
        this.getKeyInput();
        this.btnListener();
        this.numOfDice = 0;
        this.displayDices();
    }

    initDices() {
        this.resetPts();
        //n dice instances dependent on matrixSize
        for (let i = 0; i < this.numOfDice; i++) {
            this.view.viewDice(this.diceFace[Math.floor(Math.random() * 6)], i);
        }
    }

    initSetting() {
        this.diceFace = (document.getElementById("dface").checked)
            ? ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"]
            : [..."123456"];
    }

    //read string from input field
    getKeyInput() {
        let xySlider = document.getElementsByClassName("xy");
        for (var i = 0; i < xySlider.length; i++) {
            xySlider[i].addEventListener("input", () => {
                this.displayDices();
            });
        }
    }

    displayDices() {
        this.view.createDiceMatrix($("#x").val(), $("#y").val());
        this.numOfDice = $("#x").val() * $("#y").val();
        $("#info").html(`Number of Dices: ${this.numOfDice}`);
        this.initDices();
    }

    btnListener() {
        let classRbSet = document.getElementsByClassName("rbSet");
        for (let i = 0; i < classRbSet.length; i++) {
            classRbSet[i].addEventListener("click", () => {
                this.initSetting();
            });
        }

        $(".xy").change(() => {
            this.getXMLHttp();
        });

        $("#rollBtn").click(() => {
            var player = new Player();
            try {
                if ($("#name").val() === "") {
                    throw "enter name";
                } else {
                    this.roll((score) => {
                        this.scoreEntry(score);
                    });
                }
            } catch (error) {
                this.view.viewPlayer(error);
            }


        });

    }

    saveListener() {
        $(".xy, .rbSet").click(() => {
            this.setLS.saveSetting("diceSet", this.diceSet());
        });
    }

    //assign every ui setting to a json
    diceSet() {
        let setting = {
            x: $("#x").val(),
            y: $("#y").val(),   
            face: $('input[name=format]:checked').val()
        }
        return setting;
    }


    /*every dice has its own worker to calc random roll length, no shuffle of faces required 
    => different roll length, random dice results, callback if finished, return points */
    roll(finished) {
        this.resetPts();
        let worker = [];
        let pts = 0
        let cntFinish = 0;

        for (let i = 0; i < this.numOfDice; i++) {
            worker[i] = new Worker("diceMatrix/worker/webworkerRndLen.js");
        }

        for (let i = 0; i < worker.length; i++) {
            worker[i].onmessage = (event) => {
                let face = event.data.cnt % 6;
                if (event.data.finished) {
                    pts += (face + 1)
                    this.view.ptsInfo(pts);
                    if (cntFinish === worker.length - 1) {
                        finished(pts);
                    }
                    cntFinish++;
                }
                this.view.viewDice(this.diceFace[face], i);
            }
        }

    }

    scoreEntry(pts) {
        let player = new Player();
        player.setX($("#x").val());
        player.setY($("#y").val());
        player.setName($("#name").val());
        player.setScore(pts);
        this.view.viewPlayer(`${player.getName()}'s final score: ${player.getScore()}`);
        $("#name").val("");
        $("#score").val("");
        this.socket.emit('message', player);
    }

    resetPts() {
        this.view.res = 0;
        this.view.ptsInfo();
    }

    initPlayer() {
        this.socket.on('broadcast', function (msg) {
            $("#test").html(msg);
        });
    }

    getXMLHttp() {
        $.get("diceMatrix/scorefile/score.json", (data, status) => {
            this.view.scoreTable(data);
            //console.log(status);
        });
    }

    //after sending a player's new score (message) with socketIO, update score table via AJAX (to all players)
    socketOn() {
        this.socket.on('message', (msg) => {
            var seq = new Promise(function (result, err) {
                result(msg);
                err("err");
            }).then(() => {
                this.getXMLHttp();
            }, (err) => { console.log(err) });
        });
    }

}