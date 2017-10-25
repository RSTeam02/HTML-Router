/**
 * @sakaijun
 * View as SVG => dom
 */

export class View {

    //draw eachtile as svg text/square
    constructor(seq, mxn, mode) {
        this.svgNS = "http://www.w3.org/2000/svg";
        this.mode = mode;
        this.mxn = mxn;
        this.seq = seq;
        this.displaySize();
        this.i = 0;
    }

    //mat output as svg
    svgMat(tile) {

        var x = 0;
        var tileArr = [];

        for (var i = 0; i < tile.length; i++) {
            tileArr[i] = tile[i];
            var y = 0;
            for (var j = 0; j < tile[i].length; j++) {
                this.svgAlphaNum(tileArr[i][j], y, x);
                //next row
                y += 30;
            }
            //next column
            x += 30;
        }
    }
    //scale size for nxn
    displaySize() {
        this.w = this.mxn * 50 + 10;
        this.h = Math.floor(this.w / 1.55);
    }

    svgAlphaNum(tile, relDistX, relDistY) {

        let numMode;
        let alphaNum;

        //list ordered/random (preview, gamemode) sequence as integer, chars
        let gId = document.getElementById("tileDisplay");
        let val = this.seq[this.i++];
        let txt = document.createElementNS(this.svgNS, "text");
        let svg = document.getElementById("svgContent");

        svg.setAttribute("viewBox", "-5 -5 " + this.w + " " + this.h);
        txt.setAttribute("cursor", "pointer");
        txt.setAttribute("class", "pos")
        txt.setAttribute("id", "shape" + (val - 1));
        txt.setAttribute("transform", "translate(0,-5)");
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("x", relDistX + 15);
        txt.setAttribute("y", relDistY + 26);
        (this.seq.length !== this.i)
            ? txt.setAttribute("fill", "white")
            : txt.setAttribute("fill", "transparent");
        txt.setAttribute("font-family", "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif");

        //draw square border for each char or value
        let square = document.createElementNS(this.svgNS, "rect");
        square.setAttribute("transform", "translate(" + relDistX + " " + relDistY + ")");
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