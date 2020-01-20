import { SquarePoint, Iviewer } from "./types";

//小方块类
export class Square {
    private _viewer?: Iviewer;
    public get viewer() {
        return this._viewer;
    }
    public set viewer(val) {
        if(val) {
            val.show()
        }
        this._viewer = val;

    }
    public get pointer() {
        return this._pointer;
    }
    public set pointer(val: SquarePoint) {
        this._pointer = val;
        if(this._viewer) {
            this._viewer.show();
        }
    }
    public get color() {
        return this._color;
    }
    public set color(val: string) {
        this._color = val;
    }
    constructor(
        private _pointer: SquarePoint,
        private _color: string
    ) {}
}
