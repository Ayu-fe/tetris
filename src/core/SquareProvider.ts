import { SquarePoint } from "./types";
import { getRandom } from "./utils";
import { SquareGroup } from "./SquareGroup";
import { GameRules } from "./GameRules";
class Tshape extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }], centerPoint, color)
    }

}
class Lshape extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }], centerPoint, color)
    }
}
class LineShap extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }], centerPoint, color)
    }
    rotate() {
        super.rotate();
        this.isclock = !this.isclock;
    }
}
class LmirralShap extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], centerPoint, color)
    }
}

class Sshap extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }], centerPoint, color)
    }
    rotate() {
        super.rotate();
        this.isclock = !this.isclock;
    }
}
class SmirralShap extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }], centerPoint, color)
    }
    rotate() {
        super.rotate();
        this.isclock = !this.isclock;
    }
}
class squareShap extends SquareGroup {
    constructor(public centerPoint: SquarePoint, public color: string) {
        super([{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: -1 }, { x: 1, y: 0 }], centerPoint, color)
    }
    afterRotatePoint(): SquarePoint[] {
        return this._reletivePoint;
    }
}

const arr = [
    Tshape,
    Lshape,
    LmirralShap,
    Sshap,
    SmirralShap,
    LineShap,
    squareShap
]
const colors = [
    'red',
    'green',
    'yellow',
    '#499cd6',
    '#c586c0'
]
export function createShape(centerPoint: SquarePoint): SquareGroup {
    let index = null;
    let colorIndex = null;
    index = getRandom(0, arr.length)
    colorIndex = getRandom(0, colors.length);
    let color = colors[colorIndex];
    return new arr[index](centerPoint, color);
}

