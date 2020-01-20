import { GameShow, GameStatus } from "../types";
import { SquareGroup } from "../SquareGroup";
import { SquareShow } from "./SquareShow";
import * as $ from 'jquery';
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import SquareConfig from "./SquareConfig";

export class GamePageShow implements GameShow {
    
    
    private gameContainer = $('.game');
    private scoreContainer = $('.next');
    private msgContainer = $('.msg');
    private tip = $('.tip');
    init(game: Game): void {
        this.gameContainer.css({
            width: GameConfig.page.width * SquareConfig.squareConfig.width,
            height: GameConfig.page.height * SquareConfig.squareConfig.height
        })
        this.scoreContainer.css({
            width: GameConfig.score.width * SquareConfig.squareConfig.width,
            height: GameConfig.score.height * SquareConfig.squareConfig.height
        })
        $(document).keydown((e) => {
            console.log(e.keyCode);
            if(e.keyCode === 32) {
                game.rotate();
            } else if (e.keyCode === 37) {
                game.left();
            } else if (e.keyCode === 40) {
                game.down();
            } else if (e.keyCode === 39) {
                game.right();
            } else if (e.keyCode === 13) {
                if(game.status === GameStatus.playing) {
                    game.pause();
                    game.status = GameStatus.pause;
                } else if(game.status === GameStatus.pause || game.status === GameStatus.init) {
                    game.start();
                    game.status = GameStatus.playing;
                } else if (game.status === GameStatus.over) {
                    game.init();
                }
                
            }else if (e.keyCode === 82) {
                game.init();
            } 
        })
        this.showScore(game.score);
        
    }

    onGameStart(): void {
        this.msgContainer.hide();
    }
    onGamePause(): void {
        this.tip.html('游戏暂停');
        this.msgContainer.css({
            display: 'flex'
        })
    }
    onGameOver(): void {
        this.tip.html('游戏结束');
        this.msgContainer.css({
            display: 'flex'
        })
    }


    showScore(game: number) {
        $('.score').html('得分：' + game.toString());
    }
    showNext(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer = new SquareShow(sq, $('.next'));
        })
    }
    switch(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer!.remove();
            sq.viewer = new SquareShow(sq, $('.game'));
        })
    }
    
 }