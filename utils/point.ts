
export class Point {
    constructor(public x: number, public y: number) { }

    clone() {
        return new Point(this.x, this.y);
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    moveUp() {
        this.y++;
    }

    moveDown() {
        this.y--;
    }
}