/**
 * @sakaijun
 * View as SVG => dom
 */

import { SVGDom } from "./svgDom.js";

export class View extends SVGDom{

    //draw eachtile as svg text/square
    constructor(seq, mode) {
        super();             
        this.mode = mode;
        this.seq = seq;
        this.displaySize();

    }

    //mat output as svg
    svgMat() {
        let y = 0;
        let id = 0;
        let n = Math.sqrt(this.seq.length, 2);

        for (var i = 0; i < n; i++) {
            var x = 0;
            for (var j = 0; j < n; j++) {
                let tile = {
                    tileId: id,
                    posX: x,
                    posY: y
                };
                super.svgNum(tile);
                //next row
                x += 30;
                id++;
            }
            //next column
            y += 30;
        }
    }
    //scale size for nxn
    displaySize() {
        this.w = Math.sqrt(this.seq.length, 2) * 50 + 10;
        this.h = Math.floor(this.w / 1.55);
    }

    playerInfo(str) {
        document.getElementById("pInfo").innerHTML = str;
    }

    scoreTable(rows) {
        let rank = 1;

        $("#scoreList").html("");
        $("#scoreList").append("<th>Rank</th><th>Player</th><th>Time</th>");
        $.each(rows, (k, v) => {
            if (v.game === "puzzle" && $("#slider").val() === v.x) {
                $("#scoreList").append(`<tr class = "row">
                <td class = "col" align = "right">${rank++}.</td>
                <td class = "col">${v.name}</td>
                <td class = "col" align = "right">${v.time}</td>
                </tr>`);
            }
        });

    }
}