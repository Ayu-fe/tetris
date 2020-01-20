import { Square } from "../Square";
import * as $ from 'jquery';
import { Iviewer } from "../types";
import SquareConfig from './SquareConfig';

export class SquareShow implements Iviewer {
    private dom?: JQuery<HTMLElement>;
    private isRemove: boolean = false;
    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) { }
    show() {
        if (!this.dom) {
            this.dom = $('<div>').css({
                position: 'absolute',
                width: SquareConfig.squareConfig.width,
                height: SquareConfig.squareConfig.height,
                boxSizing: 'border-box',
                border: '1px solid black',
                borderRadius: '5px'
            }).appendTo(this.container);
        }
        this.dom.css({
            left: this.square.pointer.x * SquareConfig.squareConfig.width,
            top: this.square.pointer.y * SquareConfig.squareConfig.height,
            backgroundColor: this.square.color
        })
    }
    remove() {
        if(this.dom && !this.isRemove) {
            this.dom.remove();
            this.isRemove = true;
        }
    }
}