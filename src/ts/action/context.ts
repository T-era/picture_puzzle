import { FIELD } from "../doms";
import { FieldPart } from "../init/partsFactory";
import { Pos, Setting } from "../types";
import { ActionListener } from "./listener";

const EMPTY = { x: 0, y: 0 };
export class GameContext {
    private actionListener ?:ActionListener;
    private _setting ?:Setting<FieldPart>;
    parts :(FieldPart|undefined)[][] = [];

    get setting() {
        return this._setting;
    }
    setSetting(setting :Setting<FieldPart>) {
        this._setting = setting;
        if (this.actionListener) {
            this.actionListener.revoke();
        }
        while(FIELD.children.length) {
            FIELD.removeChild(FIELD.children[0]);
        }
        this.parts = [];
        for (let y = 0; y < setting.parts.length; y ++) {
            const line = setting.parts[y];
            this.parts[y] = [];
            for (let x = 0; x < line.length; x ++) {
                if (x === EMPTY.x && y === EMPTY.y) {
                    this.parts[y][x] = undefined;
                } else {
                    const part = line[x];
                    FIELD.appendChild(part.canvas);
                    this.parts[y][x] = part;
                }
            }

        }
        FIELD.style.height = `${setting.imageSize.height}px`
        this.actionListener = new ActionListener(this);
    }
    lFromP(pPos :Pos) :Pos|undefined {
        const lx = Math.floor(pPos.x / this.setting!.partWidth);
        const ly = Math.floor(pPos.y / this.setting!.partHeight);

        if (ly >= this.parts.length || lx >= this.parts[ly].length) {
            return;
        }
        return {
            x: lx,
            y: ly,
        };
    }
    pCenterFromL(lPos :Pos) :Pos {
        return {
            x: (lPos.x + 0.5) * this.setting!.partWidth, 
            y: (lPos.y + 0.5) * this.setting!.partHeight, 
        };
    }
    isInRange(lPos :Pos) {
        return 0 <= lPos.y && lPos.y < this.setting!.parts.length
            && 0 <= lPos.x && lPos.x < this.setting!.parts[lPos.y].length;
    }
}

class Part {
    constructor(
        private readonly canvas :HTMLCanvasElement,
        private readonly lPos :Pos) {
    }
}