import { SquarePoint } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection } from "./types";
import { Square } from "./Square";

/**
 * 判断小方块是否能够移动的函数
 * 以及移动函数
 */

export class GameRules {
    private static isPoint(obj: any): obj is SquarePoint {
        if (typeof obj.x === 'number') {
            return true;
        } else {
            return false;
        }

    }
    static canIMove(shape: SquarePoint[], targetPoint: SquarePoint, exists: Square[]): boolean {
        let targetSquarePoint: SquarePoint[] = shape.map(item => {

            return {
                x: item.x + targetPoint.x,
                y: item.y + targetPoint.y
            }
        })
        //some：当有一个成员满足条件时，返回true
        //边界判断
        let result = targetSquarePoint.some(p => (p.x < 0 || p.x > GameConfig.page.width - 1 || p.y < 0 || p.y > GameConfig.page.height - 1));
        if (result) {
            return false;
        }
        //接触判断
        return !targetSquarePoint.some(p => exists.some(sq => (sq.pointer.x === p.x && sq.pointer.y === p.y)));
    }

    static move(tetris: SquareGroup, targetPoint: SquarePoint | MoveDirection, exists: Square[]): boolean {
        if (GameRules.isPoint(targetPoint)) {
            let shapes = tetris.shaps;
            if (this.canIMove(shapes, targetPoint, exists)) {
                tetris.centerPoint = targetPoint;
                return true;
            }
            return false
        } else {
            let direction = targetPoint;
            let newTargetPoint: SquarePoint;
            if (direction === MoveDirection.down) {
                newTargetPoint = {
                    x: tetris.centerPoint.x,
                    y: tetris.centerPoint.y + 1
                }
            } else if (direction === MoveDirection.left) {
                newTargetPoint = {
                    x: tetris.centerPoint.x - 1,
                    y: tetris.centerPoint.y
                }
            } else if (direction === MoveDirection.right) {
                newTargetPoint = {
                    x: tetris.centerPoint.x + 1,
                    y: tetris.centerPoint.y
                }
            } else {
                return false;
            }
            return this.move(tetris, newTargetPoint, exists);
        }
    }
    static moveDirectly(tetris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean {
        while (this.move(tetris, direction, exists)) { }
        return true;
    }
    static rotate(tetris: SquareGroup, exists: Square[]): boolean {
        let shape = tetris.afterRotatePoint();
        if (this.canIMove(shape, tetris.centerPoint, exists)) {
            tetris.rotate();
            return true;
        }
        return false;
    }
    /**
     * 消除处理
     * 1.得到y坐标 得到最小的y和最大的y 循环判断是否要消除
     * 2.确定消除后 从视图上消除 从数组里消除 消除的那一行上面的一行往下移1
     */

    static deleteSquare(exists: Square[]): number {

        const ys = exists.map(sq => sq.pointer.y);
        const yMax = Math.max(...ys);
        const yMin = Math.min(...ys);
        let num: number = 0;
        for (let y = yMin; y <= yMax; y++) {
            if (this.deleteLine(exists, y)) {
                num++;
            }
        }
        return num;
    }
    static deleteLine(exists: Square[], y: number): boolean {
        let squares = exists.filter(sq => sq.pointer.y === y);
        if (squares.length === GameConfig.page.width) {
            squares.forEach(sq => {
                //从视图上移除
                if (sq.viewer) {
                    sq.viewer.remove();
                }
                //在数组里删除
                const index = exists.indexOf(sq);
                exists.splice(index, 1);
            })
            exists.filter(sq => sq.pointer.y < y).forEach(sq => {
                sq.pointer = {
                    x: sq.pointer.x,
                    y: sq.pointer.y + 1
                }
            })
            return true;
        }
        return false;
    }






    // static isGameOver(tetris: SquareGroup, exists: Square[]): boolean {
    //     let newTargetPoint = {
    //         x: tetris.centerPoint.x,
    //         y: tetris.centerPoint.y + 1
    //     }
    //     let targetPoint = tetris.shaps.map(p => {
    //         return {
    //             x: p.x + newTargetPoint.x,
    //             y: p.y + newTargetPoint.y
    //         }
    //     })
    //     return targetPoint.some(p => exists.some(sq => (p.x === sq.pointer.x && p.y === sq.pointer.y)))
    // }
}