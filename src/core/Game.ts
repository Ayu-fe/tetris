import { GameStatus, MoveDirection, GameShow } from "./types";
import { SquareGroup } from "./SquareGroup";
import { createShape } from "./SquareProvider";
import { GameRules } from "./GameRules";
import GameConfig from "./GameConfig";
import { Square } from "./Square";

/** 
 * 控制游戏状态
 * 生成一个形状 让他自动下落
 */

export class Game {
    private _status: GameStatus = GameStatus.init;
    private _nextShape: SquareGroup = createShape({ x: 0, y: 0 });
    private _curShape?: SquareGroup;
    private _timer?: any;
    private _duration: number = 1000;
    private _exists: Square[] = [];
    private _score: number = 0;
    constructor(
        private _viewer: GameShow
    ) {
        this.nextShow()
        this._viewer.init(this);
        
    }
    set score (val) {
        this._score = val;
        this._viewer.showScore(val);
        let level = GameConfig.level.filter(level => level.score <= val).pop();
        let duration = level!.duration;
        if(duration === this._duration) {
            return;
        }
        this._duration = duration;
        if(this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
            this.autoDrop();
        }
        
    } 
    get score() {
        return this._score;
    }
    get status() {
        return this._status;
    }
    set status(val) {
        this._score = val;
    }
    private nextShow () {
        this._nextShape = createShape({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.score.width, this._nextShape);
        this._viewer.showNext(this._nextShape);
    }

    init () {
        this._exists.forEach(sq => {
            sq.viewer!.remove();
        })
        this._exists = [];
        if(this._nextShape) {
            this._nextShape.squares.forEach(sq => {
                sq.viewer!.remove();
            })
            
        }
        if(this._curShape) {
            this._curShape.squares.forEach(sq => {
                sq.viewer!.remove();
            })
            this._curShape = undefined;
            
        }
        
        this._duration = 1000;
        if(this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this.nextShow();
        this._status = GameStatus.init;
        this._score = 0;
        this._viewer.showScore(this._score);
        this.start();
    }

    start() {

        if (this._status === GameStatus.playing) {
            return;
        }
        if(this._status === GameStatus.over) {
            this.init();
        }
        this._status = GameStatus.playing;
        if (!this._curShape) {
            this.switchTetris();
        }
        this.autoDrop();
        this._viewer.onGameStart();
    } 
    pause() {
        if (this._status === GameStatus.playing) {
            this._status = GameStatus.pause;
            clearInterval(this._timer);
            this._timer = null;
            this._viewer.onGamePause();
        }

    }
    private autoDrop() {
        if (this._timer || this._status !== GameStatus.playing) {
            return;
        }
        this._timer = setInterval(() => {
            if (this._curShape) {
                if (!GameRules.move(this._curShape, MoveDirection.down, this._exists)) {
                    this.bottomHandle();
                }
            }
        }, this._duration);

    }
    private switchTetris() {
        this._curShape = this._nextShape;
        this.resetCenterPoint(GameConfig.page.width, this._curShape);
        //判断游戏是否结束 
        if(!GameRules.canIMove(this._curShape.shaps, this._curShape.centerPoint, this._exists)) {
            this._status = GameStatus.over;
            clearInterval(this._timer);
            this._timer = undefined;
            this._nextShape.squares.forEach(sq => {
                sq.viewer!.remove();
            })
            this._curShape = undefined;
            this._viewer.onGameOver();
            return;
        }
        this.nextShow();
        this._viewer.switch(this._curShape);
        
    }
    private resetCenterPoint(width: number, tetris: SquareGroup) {
        let x = Math.ceil(width / 2) - 1;
        let y = 0;
        tetris.centerPoint = { x, y };
        while (tetris.squares.some(sp => sp.pointer.y < 0)) {
            if (!GameRules.move(tetris, {
                x: tetris.centerPoint.x,
                y: tetris.centerPoint.y + 1
            }, this._exists)) {
                break;
            }
        }
    }
    left() {
        if (this._curShape && this._status === GameStatus.playing) {
            GameRules.move(this._curShape, MoveDirection.left, this._exists);
        }
        return false;
    }
    right() {
        if (this._curShape && this._status === GameStatus.playing) {
            GameRules.move(this._curShape, MoveDirection.right, this._exists);
        }
        return false;
    }
    down() {
        if (this._curShape && this._status === GameStatus.playing) {
            if (!GameRules.moveDirectly(this._curShape, MoveDirection.down, this._exists)) {
                
                this.bottomHandle();
            }
        }
        return false;

    }
    rotate() {
        if (this._curShape && this._status === GameStatus.playing) {
            GameRules.rotate(this._curShape, this._exists);
        }
        return false;
    }

    //触底处理
    /**
     * 1.继续切换小方块
     * 2.判断已经存在的小方块
     * 3.判断游戏结束
     * 4.消除小方块
     */
    bottomHandle() {
        this._exists = this._exists.concat(...this._curShape!.squares);
        let num = GameRules.deleteSquare(this._exists);
        if(num === 1) {
            this.score += 10
        } else if( num === 2) {
            this.score += 20
        } else if(num >= 3 ) {
            this.score += 40
        }
        
        this.switchTetris();

    }
}