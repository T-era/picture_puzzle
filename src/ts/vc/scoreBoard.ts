import { SCORE_BOARD } from "@lib/doms"
import { ScoreBoard as IScoreBoard } from "@lib/types"

class ScoreBoard implements IScoreBoard {
    private _total = 0;
    private _touch = 0;

    addTouch(d: number = 1): void {
        this._touch += d;
        this.show();
    }
    addTotal(d: number) {
        this._total += d;
        this.show();
    }
    reset() {
        this._total = 0;
        this._touch = 0;
        this.show();
    }
    private show() {
        _show(SCORE_BOARD.TOUCH, this._touch);
        _show(SCORE_BOARD.TOTAL, this._total);
        function _show(dom :HTMLElement, val :number) {
            dom.innerText = `${val}`;
        }
    }
}

export const scoreBoard :IScoreBoard = new ScoreBoard();