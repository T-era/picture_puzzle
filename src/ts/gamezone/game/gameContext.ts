import { addAnimeQueueFinally } from "@lib/tools/anime/moving";
import { RESULT_CANVAS, FIELD, SCENE } from "@lib/doms";
import { FieldPart, Pos, Setting } from "@lib/types";
import { MouseActionListener } from "./mouse/mouseListener";
import { SwipeListener } from "./touch/swipeListener";
import { TouchActionListener } from "./touch/touchListener";
import { Device } from "@lib/tools/deviceJudge";

const START_EMPTY_POS = { x: 0, y: 0 };

export function createNewGameContext(setting :Setting<FieldPart>, device :Device) {
    FIELD.style.width = `${setting.imageSize.width}px`;
    FIELD.style.height = `${setting.imageSize.height}px`;

    return new GameContext(setting, device);
}

export class GameContext {
    private actionListener :TouchActionListener | MouseActionListener;
    readonly parts :(FieldPart | undefined)[][];

    constructor(readonly setting :Setting<FieldPart>, private readonly device :Device) {
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
        this.actionListener = device === Device.Touch
            ? new TouchActionListener(this, new SwipeListener(this))
            : new MouseActionListener(this);
    }

    init() {
        if (this.device === Device.Touch) {
            this.actionListener = new TouchActionListener(this, new SwipeListener(this));
        } else if (this.device === Device.Mouse) {
            this.actionListener = new MouseActionListener(this);
        } else {
            throw "Device judgement failure";
        }
    }

    get emptyLPos() :Pos {
        for (let y = 0; y < this.parts.length; y++) {
            for (let x = 0; x < this.parts[y].length; x++) {
                if (!this.parts[y][x]) {
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
                RESULT_CANVAS.classList.add('show');
            });
        }
    }
    revoke() {
        this.actionListener.revoke();
    }
}
