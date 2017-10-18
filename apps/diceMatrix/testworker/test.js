export class TestWorker {

    constructor() {
        this.diceRes = [];
    }

    testRun() {
        var worker = [];
        var finishCount = 0;
        var res = 0;
        const numOfDice = Math.floor(Math.random() * 20) + 1;

        for (let i = 0; i < numOfDice; i++) {
            worker[i] = new Worker("worker/webworkerRndLen.js");
        }

        for (let i = 0; i < worker.length; i++) {
            worker[i].onmessage = (event) => {
                let face = event.data.cnt % 6;
                if (event.data.finished) {
                    this.diceRes[i] = (face + 1);
                    res += (face + 1);
                    $("#result").html(`Random Result of ${finishCount} Dices:`);
                    if (finishCount === worker.length - 1) {
                        this.testResult();
                        $("#result").html(`Random Result of ${numOfDice} Dices: ${res}`);
                    }
                    finishCount++;
                }
            }
        }
    }

    testResult() {
        let sum = 0;
        for (let i in this.diceRes) {
            sum += this.diceRes[i];
        }
        $("#testRes").html(`Expected Test Result: ${this.diceRes.join("+")} = ${sum}`);
    }
}
