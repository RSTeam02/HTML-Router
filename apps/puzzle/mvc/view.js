/**
 * @sakaijun
 * View as SVG => dom
 */

export class View {

    //draw eachtile as svg text/square
    constructor(seq, dim, mode) {
        this.svgNS = "http://www.w3.org/2000/svg";
        this.dim = dim;
        this.mode = mode;
        this.seq = seq;
        this.displaySize();

    }

    //mat output as svg
    svgMat() {
        let y = 0;
        let id = 0;

        for (var i = 0; i < this.dim; i++) {
            var x = 0;
            for (var j = 0; j < this.dim; j++) {
                let tile = {
                    tileId: id,
                    posX: x,
                    posY: y
                };
                this.svgAlphaNum(tile);
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
        this.w = this.dim * 50 + 10;
        this.h = Math.floor(this.w / 1.55);
    }

    svgAlphaNum(tile) {

        let numMode;
        let alphaNum;

        //list ordered/random (preview, gamemode) sequence as integer, chars
        let gId = document.getElementById("tileDisplay");
        let val = this.seq[tile.tileId];
        let txt = document.createElementNS(this.svgNS, "text");
        let svg = document.getElementById("svgContent");
        svg.setAttribute("viewBox", "-5 -5 " + this.w + " " + this.h);
        txt.setAttribute("cursor", "pointer");
        txt.setAttribute("class", "pos")
        txt.setAttribute("id", "shape" + (val - 1));
        txt.setAttribute("transform", "translate(0,-5)");
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("x", tile.posX + 15);
        txt.setAttribute("y", tile.posY + 26);
        (this.seq.length !== tile.tileId + 1)
            ? txt.setAttribute("fill", "white")
            : txt.setAttribute("fill", "transparent");
        txt.setAttribute("font-family", "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif");

        //draw square border for each char or value
        let square = document.createElementNS(this.svgNS, "rect");
        square.setAttribute("transform", "translate(" + tile.posX + " " + tile.posY + ")");
        square.setAttribute("width", 30);
        square.setAttribute("height", 30);
        square.setAttribute("stroke", "white");
        square.setAttribute("stroke-width", "1");
        square.setAttribute("fill", "none");
        alphaNum = val;
        numMode = document.createTextNode(alphaNum);
        txt.setAttribute("value", alphaNum);
        txt.appendChild(numMode);
        gId.appendChild(square);
        gId.appendChild(txt);
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