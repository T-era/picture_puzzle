import { FIELD } from "@lib/doms";
import { MovingDirection, PLPos, Pos } from "@lib/types";
import { GameContext } from "../gameContext";
import { EventWrapper } from "../../eventWrapper";

export interface SwipeHandler {
    onSwipe :(targetLPos :Pos, direction :MovingDirection)=>void;
}

export class TouchEventWrapper extends EventWrapper<TouchEvent> {
    constructor(private context :GameContext) {
        super(context);
    }

    protected override offsetFromEvent(te: TouchEvent): Pos|undefined {
        const touches = te.touches;
        if (touches.length == 1) {
            const e = touches[0];
            return this.pPosFromTouch(e);
        } else {
            // いっぱい接触
            return undefined;
        }
    }
    private pPosFromTouch(e :Touch) :Pos|undefined {
        const target = e.target as HTMLElement;
        const { offsetX, offsetY } = offsetByField();
        const rect = target.getBoundingClientRect()
        const x = (e.clientX - window.pageXOffset - rect.left) 
        const y = (e.clientY - window.pageYOffset - rect.top)

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
export class TouchActionListener {
    private targetPos ?:PLPos;

    constructor(context :GameContext, private swipeHandler :SwipeHandler) {
        const eventWrapper = new TouchEventWrapper(context);
        FIELD.ontouchstart = eventWrapper.eventWrapper((e, pos) => this.touchStart(pos));
        FIELD.ontouchend = eventWrapper.eventWrapper((e, pos) => this.touchEnd());
        FIELD.ontouchmove = eventWrapper.eventWrapper((e, pos) => this.touchMove(pos));
    }

    private touchStart(plPos : PLPos) {
        this.targetPos = plPos;
    }
    private touchEnd() {
        this.targetPos = undefined;
    }
    private touchMove({ pPos: eventPPos } : PLPos) {
        if (! this.targetPos) {
            return;
        }
        const { pPos: targetPPos, lPos: targetLPos } = this.targetPos;
        const dir = direction(targetPPos, eventPPos);
        if (dir) {
            this.swipeHandler.onSwipe(targetLPos, dir);
        }
    }

    revoke() {
        FIELD.ontouchstart = null;
        FIELD.ontouchend = null;
        FIELD.ontouchmove = null;
    }
}

function direction(pPos1 :Pos, pPos2 :Pos) :MovingDirection|undefined {
    const dx = pPos2.x - pPos1.x;
    const dy = pPos2.y - pPos1.y;
    const distance2 = dx ** 2 + dy ** 2;
    if (distance2 < 9) {
        return;
    }
    if (Math.abs(dx) < Math.abs(dy)) {
        if (dy > 0) {
            return MovingDirection.ToDown;
        } else {
            return MovingDirection.ToUp;
        }

    } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            return MovingDirection.ToRight;
        } else {
            return MovingDirection.ToLeft;
        }
    }
}