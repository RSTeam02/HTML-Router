//Player instance with name + score attributes
export class Player {

    constructor() {
        this.score = 0;
    }

    setName(name) {
        this.name = name;
    }

    setScore(score) {
        this.score = score;
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