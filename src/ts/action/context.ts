import { addAnimeQueue, addAnimeQueueFinally } from "../anime/moving";
import { ANSWER_CANVAS, FIELD, PREVIEW_CANVAS } from "../doms";
import { FieldPart } from "../init/partsFactory";
import { Pos, Setting } from "../types";
import { ActionListener } from "./listener";

const START_EMPTY_POS = { x: 0, y: 0 };

export class PrepareContext {
    gameContext ?:GameContext;
    setSetting(setting :Setting<FieldPart>) {
        if (this.gameContext) {
            this.gameContext.revoke();
        }
        while(FIELD.children.length) {
            FIELD.removeChild(FIELD.children[0]);
        }
        FIELD.style.height = `${setting.imageSize.height}px`

        this.gameContext = new GameContext(setting);
    }

}
export class GameContext {
    private actionListener :ActionListener;
    readonly parts :(FieldPart|undefined)[][];

    constructor (readonly setting :Setting<FieldPart>) {
        this.parts = setting.parts.map((line, y) =>
            line.map((part, x) => { 
                if (x === START_EMPTY_POS.x && y === START_EMPTY_POS.y) {
                    return undefined;
                } else {
                    FIELD.appendChild(part.canvas);
                    return part;
                }
            })
        );

        this.actionListener = new ActionListener(this);
    }

    get emptyLPos() :Pos {
        for (let y = 0; y < this.parts.length; y ++) {
            for (let x = 0; x < this.parts[y].length; x ++) {
                if (! this.parts[y][x]) {
                    return { x, y };
                }
            }
        }
        throw "Empty part not found";
    }

    isInRange(lPos :Pos) {
        return 0 <= lPos.y && lPos.y < this.setting.parts.length
            && 0 <= lPos.x && lPos.x < this.setting.parts[lPos.y].length;
    }

    onMoved() {
        const allCorrect = this.parts.every((line, y) => 
            line.every((fp, x) => {
                if (x === 0 && y === 0) {
                    return fp === undefined;
                } else {
                    if (fp === undefined) {
                        return false;
                    } else {
                        return fp.isCorrectPos;
                    }
                }
            })
        );
        if (allCorrect) {
            this.revoke();

            addAnimeQueueFinally(() => {
                ANSWER_CANVAS.classList.add('show');
            });
        }
    }
    revoke() {
        this.actionListener.revoke();
    }
}
