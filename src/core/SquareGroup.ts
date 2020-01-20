import { SquarePoint } from "./types";
import { Square } from "./Square";
import { GameRules } from "./GameRules";

export class SquareGroup {
    protected _squares: Square[] = [];
    get squares() {
        return this._squares;
    }
    get centerPoint() {
        return this._centerPoint;
    }
    set centerPoint(val: SquarePoint) {
        this._centerPoint = val;
        this._reletivePoint.forEach((p, i) => {
            this._squares[i].pointer = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }
    get shaps() {
        return this._reletivePoint;
    }
    constructor(
        protected _reletivePoint: SquarePoint[] = [],
        protected _centerPoint: SquarePoint,
        private _color: string
    ) {
        this._reletivePoint.forEach(p => {
            let square = new Square({
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y
            }, this._color);
            this._squares.push(square);
        })
    }
    protected isclock: boolean = true;
    afterRotatePoint(): SquarePoint[] {
        if (this.isclock) {
            return this._reletivePoint.map((p) => {
                return {
                    x: - p.y,
                    y: p.x
                }
            })
        }
        else {
            return this._reletivePoint.map((p) => {
                return {
                    x: p.y,
                    y: - p.x
                }
            })

        }
    }

    public rotate() {
        let newShape = this.afterRotatePoint();
        this._reletivePoint = newShape;
        newShape.forEach((p, i) => {
            this._squares[i].pointer = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }

}