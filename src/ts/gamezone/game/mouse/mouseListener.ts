import { addMovingAnimeQueue } from "@lib/tools/anime/moving";
import { EventWrapper } from "../../eventWrapper";
import { RangeType } from "@lib/tools/posRange";
import { FieldPart, isSamePos, motionFromDirection, MovingDirection, MovingTarget, Pos } from "@lib/types";
import { GameContext } from "../../game/gameContext";
import { FIELD } from "@lib/doms";

class MouseEventWrapper extends EventWrapper<MouseEvent> {
    constructor(private context: GameContext) {
        super(context)
    }
    protected override offsetFromEvent(e: MouseEvent): Pos|undefined {
        const target = e.target as HTMLElement;
        const { offsetX, offsetY } = offsetByField();
        const { offsetX: x, offsetY: y } = e;

        if (x < 0 || this.context.setting.imageSize.width <= x
            || y < 0 || this.context.setting.imageSize.height <= y) {
            return undefined;
        }
        return {
            x: x + offsetX,
            y: y + offsetY,
        }
        function offsetByField() {
            if (target === FIELD) {
                return { offsetX: 0, offsetY: 0 };
            } else {
                return { offsetX: target.offsetLeft, offsetY: target.offsetTop };
            }
        }
   
    }
}

export class MouseActionListener {
    constructor(private context :GameContext) {
        const eventWrapper = new MouseEventWrapper(context);
        FIELD.onmousemove = eventWrapper.eventWrapper((e, { pPos, lPos }) => this.mouseMoved(e, pPos, lPos));
        FIELD.onmousedown = eventWrapper.eventWrapper((e, { pPos, lPos }) => this.clicked(e, pPos, lPos));
    }

    mouseMoved(e :MouseEvent, pPos :Pos, lPos :Pos) {
        const emptyLPos = this.context.emptyLPos;
        const direction = this.getMovingDirection(pPos, lPos, emptyLPos);
        FIELD.classList.remove('up');
        FIELD.classList.remove('down');
        FIELD.classList.remove('left');
        FIELD.classList.remove('right');
        if (direction) {
            if (direction === MovingDirection.ToUp) {
                FIELD.classList.add('up');
            } else if (direction === MovingDirection.ToDown) {
                FIELD.classList.add('down');
            } else if (direction === MovingDirection.ToLeft) {
                FIELD.classList.add('left');
            } else if (direction === MovingDirection.ToRight) {
                FIELD.classList.add('right');
            }
        }
    }
    clicked(e :MouseEvent, pPos :Pos, lPos :Pos) {
        const emptyLPos = this.context.emptyLPos;
        const direction = this.getMovingDirection(pPos, lPos, emptyLPos);

        if (direction) {
            const motion = motionFromDirection(direction);
            const dp = motion({ x: 0, y: 0 });

            const pdx = dp.x * this.context.setting.partWidth;
            const pdy = dp.y * this.context.setting.partHeight;

            let prevPart :FieldPart|undefined = undefined;
            const targets :MovingTarget[] = [];
            let tempLPos = { ...lPos };
            while (! isSamePos(tempLPos, emptyLPos)) {
                const currentPart = this.context.parts[tempLPos.y][tempLPos.x];
                this.context.parts[tempLPos.y][tempLPos.x] = prevPart;
                const nextLPos = motion(tempLPos);

                if (currentPart) {
                    targets.push(currentPart.moveTo(nextLPos));
                } else {
                    throw `NG!! ${tempLPos.x}, ${tempLPos.y}`;
                }
                prevPart = currentPart;
                tempLPos = nextLPos;
            }
            this.context.parts[tempLPos.y][tempLPos.x] = prevPart;

            addMovingAnimeQueue({
                targets,
                pdx,
                pdy
            })
        }
        this.context.onMoved();
        this.mouseMoved(e, pPos, lPos);
    }

    private getMovingDirection(pPos :Pos, lPos :Pos, emptyLPos :Pos) :MovingDirection|undefined {
        if (isSamePos(lPos, emptyLPos)) {
            // マス内の位置で方向性で決める
            const pCenter = this.context.setting.plConverter.pFromL(lPos, RangeType.Center);
            const dx = pPos.x - pCenter.x;
            const dy = pPos.y - pCenter.y;
            const adx = Math.abs(dx);
            const ady = Math.abs(dy);
            if (adx > ady) {
                if (dx < 0 && this.context.isInRange({ x: lPos.x - 1, y: lPos.y })) {
                    return MovingDirection.ToRight;
                } else if (dx > 0 && this.context.isInRange({ x: lPos.x + 1, y: lPos.y })) {
                    return MovingDirection.ToLeft;
                }
            } else if (ady > adx) {
                if (dy < 0 && this.context.isInRange({ x: lPos.x, y: lPos.y - 1 })) {
                    return MovingDirection.ToDown;
                } else if (dy > 0 && this.context.isInRange({ x: lPos.x, y: lPos.y + 1 })) {
                    return MovingDirection.ToUp;
                }
            }
        } else if (lPos.x === emptyLPos.x && lPos.y > emptyLPos.y) {
            return MovingDirection.ToUp;
        } else if (lPos.x === emptyLPos.x && lPos.y < emptyLPos.y) {
            return MovingDirection.ToDown;
        } else if (lPos.y === emptyLPos.y && lPos.x > emptyLPos.x) {
            return MovingDirection.ToLeft;
        } else if (lPos.y === emptyLPos.y && lPos.x < emptyLPos.x) {
            return MovingDirection.ToRight;
        } 
    }

    revoke() {
        FIELD.onmousemove = null;
        FIELD.onmousedown = null;
    }
}

