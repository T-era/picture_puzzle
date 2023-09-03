import { FIELD } from "@lib/doms";
import { addMovingAnimeQueue } from "@lib/tools/anime/moving";
import { FieldPart, MovingDirection, MovingTarget, Pos, Setting, isSamePos, motionFromDirection } from "@lib/types";
import { scoreBoard } from "../../../vc/scoreBoard";

const START_EMPTY_POS = { x: 0, y: 0 };

export class GameContext {
    readonly parts :(FieldPart | undefined)[][];

    constructor(
        readonly setting :Setting<FieldPart>,
        private readonly onComplete :() => void) {
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
            this.onComplete()
        }
    }

    removeFieldParts() {
        while (FIELD.childNodes.length) {
            FIELD.removeChild(FIELD.childNodes[0]);
        }
    }

    leftTopEmpty() :void {
        const toDown = { x: this.emptyLPos.x, y: 0 };
        this.move(toDown, MovingDirection.ToDown, false);
        this.move({x: 0, y: 0}, MovingDirection.ToRight, false);
    }

    /**
     * プレート移動
     * @param targetLPos 移動対象の論理座標 
     * @param direction 移動方向
     * @param action ユーザ操作による移動かどうか (shuffle1中の移動などはユーザ操作ではない)
     */
    move(targetLPos :Pos, direction :MovingDirection, action = true) {
        const emptyLPos = this.emptyLPos;
        const motion = motionFromDirection(direction);
        const dp = motion({ x: 0, y: 0 });

        const pdx = dp.x * this.setting.partWidth;
        const pdy = dp.y * this.setting.partHeight;

        let prevPart :FieldPart|undefined = undefined;
        const targets :MovingTarget[] = [];
        let tempLPos = { ...targetLPos };
        while (! isSamePos(tempLPos, emptyLPos)) {
            const currentPart = this.parts[tempLPos.y][tempLPos.x];
            this.parts[tempLPos.y][tempLPos.x] = prevPart;
            const nextLPos = motion(tempLPos);

            if (currentPart) {
                targets.push(currentPart.moveTo(nextLPos));
            } else {
                throw `NG!! (${tempLPos.x}, ${tempLPos.y}), (${this.emptyLPos.x}, ${this.emptyLPos.y})`;
            }
            prevPart = currentPart;
            tempLPos = nextLPos;
        }
        this.parts[tempLPos.y][tempLPos.x] = prevPart;

        if (action) {
            // ユーザ操作の場合のみ。TODO 変数名
            addMovingAnimeQueue({
                targets,
                pdx,
                pdy
            })
            scoreBoard.addTouch();
            scoreBoard.addTotal(targets.length)
        }
    }
}
