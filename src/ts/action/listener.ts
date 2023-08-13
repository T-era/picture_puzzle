import { addAnimeQueue, MovingTarget } from "../anime/moving";
import { FIELD } from "../doms";
import { FieldPart } from "../init/partsFactory";
import { RangeType } from "../tools/posRange";
import { isSamePos, Motion, MovingDirection, PLPos, Pos } from "../types";
import { GameContext } from "./context";

export class ActionListener {
    constructor(private context :GameContext) {
        FIELD.onmousemove = this.mouseEventWrapper((e, pPos, lPos) => this.mouseMoved(e, pPos, lPos));
        FIELD.onclick = this.mouseEventWrapper((e, pPos, lPos) => this.clicked(e, pPos, lPos));
    }

    private mouseEventWrapper(f :(e :MouseEvent, pPos :Pos, lPos :Pos)=>void) {
        return (e :MouseEvent) => {
            const { pPos, lPos } = this.posFromMouseEvent(e);
            if (! pPos || ! lPos) return;
            f(e, pPos, lPos);
        };
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
                    console.log(tempLPos, currentPart);
                    targets.push(currentPart.moveTo(nextLPos));
                } else {
                    throw `NG!! ${tempLPos.x}, ${tempLPos.y}`;
                }
                prevPart = currentPart;
                tempLPos = nextLPos;
            }
            this.context.parts[tempLPos.y][tempLPos.x] = prevPart;

            addAnimeQueue({
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
    private posFromMouseEvent(e :MouseEvent) :PLPos {
        const pPos = this.pPosFromMouseEvent(e);
        if (! pPos) {
            return { pPos: undefined, lPos: undefined };
        }
        const lPos = this.context.setting.plConverter.lFromP(pPos);
        if (! lPos || ! this.context.isInRange(lPos)) {
            return { pPos, lPos: undefined };
        };
        return { pPos, lPos };
    }
    
    private pPosFromMouseEvent(e :MouseEvent) :Pos|undefined {
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

    revoke() {
        FIELD.onmousemove = null;
        FIELD.onclick = null;
    }
}

function motionFromDirection(d :MovingDirection) :Motion {
    switch (d) {
        case MovingDirection.ToUp:
            return (p :Pos) => {
                return { x: p.x, y: p.y - 1 };
            };
        case MovingDirection.ToDown:
            return (p :Pos) => {
                return { x: p.x, y: p.y + 1 };
            };
        case MovingDirection.ToLeft:
            return (p :Pos) => {
                return { x: p.x - 1, y: p.y };
            };
        case MovingDirection.ToRight:
            return (p :Pos) => {
                return { x: p.x + 1, y: p.y };
            };
    }
}