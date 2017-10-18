/**
 * @rsTeam02
 * view for matrix, points => DOM
 */
export class View {

    constructor() {
        this.res = 0;
    }

    createDiceMatrix(n, m) {
        let table = "";
        let diceNo = 0;
        for (let i = 0; i < m; i++) {
            table += "<tr class = 'diceRow'>";
            for (let j = 0; j < n; j++) {
                table += `<td class = 'diceCol' id=${diceNo}></td>`;
                diceNo++;
            }
            table += "</tr>";
        }
        $("#diceTable").html(table);
    }

    //output to dom
    viewDice(face, i) {
        $(`#${i}`).html(face);
    }

    ptsInfo(pts = 0) {
        
        $("#pts").html(`${pts} pts.`);
    }

    viewPlayer(info) {
        $("#playerInfo").html(info);
    }

    scoreTable(rows) {
        let rank = 1;

        $("#scoreList").html("");
        $("#scoreList").append("<th>Rank</th><th>Player</th><th>Score</th>");
        $.each(rows, (k, v) => {
            if ($("#x").val() === v.x && $("#y").val() === v.y) {
                $("#scoreList").append(`<tr class = "row">
                <td class = "col" align = "right">${rank++}.</td>
                <td class = "col">${v.name}</td>
                <td class = "col" align = "right">${v.score}pts.\n</td>
                </tr>`);
            }
        });

    }
}
