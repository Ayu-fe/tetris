import { Game } from "./core/Game";
import { GamePageShow } from "./core/viewer/GamePageShow";
import { GameRules } from "./core/GameRules";
import * as $ from 'jquery';
let viewer = new GamePageShow();
let game = new Game(viewer);

