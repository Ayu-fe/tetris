import { SquareGroup } from "./SquareGroup";
import { Game } from "./Game";

export interface SquarePoint {
    readonly x: number
    readonly y: number
}
export interface Iviewer {
    show(): void
    remove(): void
}
export enum MoveDirection {
    down,
    left,
    right
}
export enum GameStatus {
    playing,
    pause,
    over,
    init
}
export interface GameShow {
    //显示下一方块
    showNext(tetris: SquareGroup): void,
    //把下一个方块切换到游戏界面
    switch(tetris: SquareGroup): void,
    //分数展示
    init(game: Game): void,

    showScore(score: number): void

    onGameStart(): void

    onGamePause(): void

    onGameOver(): void


}