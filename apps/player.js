//Player instance with name + score attributes
export class Player {

    constructor() {
        this.score = 0;
    }

    setGame(game){
        this.game = game;
    }

    setName(name) {
        this.name = name;
    }

    setScore(score) {
        this.score = score;
    }

    setTime(time){
        this.time = time;
    }

    setX(x) {

        this.x = x;
    }

    setY(y) {
        this.y = y;
    }
    getX() {
        return this.y;
    }

    getGame() {
        return this.game;
    }

    getTime(){
        return this.time;
    }

    getScore() {
        return this.score;
    }
    getName() {
        return this.name;
    }
    getY() {
        return this.y;
    }
}