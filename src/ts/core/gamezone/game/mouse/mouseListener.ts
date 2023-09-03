import { EventWrapper } from "../../eventWrapper";
import { RangeType } from "@lib/tools/posRange";
import { isSamePos, motionFromDirection, MovingDirection, Pos, reverse } from "@lib/types";
import { GameContext } from "../gameContext";
import { FIELD } from "@lib/doms";

interface Moving {
    direction :MovingDirection;
    entryLPos :Pos;
}

const directionToCssClass = new Map<MovingDirection, string>([
    [MovingDirection.ToUp, 'up'],
    [MovingDirection.ToDown, 'down'],
    [MovingDirection.ToLeft, 'left'],
    [MovingDirection.ToRight, 'right'],
]);

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
        const moving = this.getMovingDirection(pPos, lPos, emptyLPos);
        for (let className of directionToCssClass.values()) {
            FIELD.classList.remove(className);
        }
        if (moving) {
            const { direction } = moving;
            const className = directionToCssClass.get(direction);
            if (className) {
                FIELD.classList.add(className);
            }
        }
    }
    clicked(e :MouseEvent, pPos :Pos, lPos :Pos) {
        const emptyLPos = this.context.emptyLPos;
        const moving = this.getMovingDirection(pPos, lPos, emptyLPos);

        if (moving) {
            const { entryLPos, direction } = moving;
            this.context.move(entryLPos, direction);
        }
        this.context.onMoved();
        this.mouseMoved(e, pPos, lPos);
    }

    private getMovingDirection(pPos :Pos, lPos :Pos, emptyLPos :Pos) :Moving|undefined {
        if (isSamePos(lPos, emptyLPos)) {
            // マス内の位置で方向性で決める
            const pCenter = this.context.setting.plConverter.pFromL(lPos, RangeType.Center);
            const dx = pPos.x - pCenter.x;
            const dy = pPos.y - pCenter.y;
            const adx = Math.abs(dx);
            const ady = Math.abs(dy);
            if (adx > ady) {
                if (dx < 0 && this.context.isInRange({ x: lPos.x - 1, y: lPos.y })) {
                    return { direction: MovingDirection.ToRight, entryLPos: { x: lPos.x - 1, y: lPos.y } };
                } else if (dx > 0 && this.context.isInRange({ x: lPos.x + 1, y: lPos.y })) {
                    return { direction: MovingDirection.ToLeft, entryLPos: { x: lPos.x + 1, y: lPos.y } };
                }
            } else if (ady > adx) {
                if (dy < 0 && this.context.isInRange({ x: lPos.x, y: lPos.y - 1 })) {
                    return { direction: MovingDirection.ToDown, entryLPos: { x: lPos.x, y: lPos.y - 1 } };
                } else if (dy > 0 && this.context.isInRange({ x: lPos.x, y: lPos.y + 1 })) {
                    return { direction: MovingDirection.ToUp, entryLPos: { x: lPos.x, y: lPos.y + 1 } };
                }
            }
        } else if (lPos.x === emptyLPos.x && lPos.y > emptyLPos.y) {
            return { direction: MovingDirection.ToUp, entryLPos: lPos };
        } else if (lPos.x === emptyLPos.x && lPos.y < emptyLPos.y) {
            return { direction:MovingDirection.ToDown, entryLPos: lPos };
        } else if (lPos.y === emptyLPos.y && lPos.x > emptyLPos.x) {
            return { direction:MovingDirection.ToLeft, entryLPos: lPos };
        } else if (lPos.y === emptyLPos.y && lPos.x < emptyLPos.x) {
            return { direction:MovingDirection.ToRight, entryLPos: lPos };
        } 
    }

    revoke() {
        FIELD.onmousemove = null;
        FIELD.onmousedown = null;
    }
}

