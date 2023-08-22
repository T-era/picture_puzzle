import { FIELD } from "@lib/doms";
import { PLPos, Pos } from "@lib/types";
import { GameContext } from "./game/gameContext";

type Event = MouseEvent | TouchEvent;

export abstract class EventWrapper<T extends Event> {
    constructor(private _context: GameContext) {}

    public eventWrapper(f :(e :T, pos :PLPos)=>void) {
        return (e :T) => {
            const plPos = this.posFromEvent(e);
            if (! plPos) return;
            f(e, plPos);
        };
    }

    private posFromEvent(e :T) :PLPos|undefined {
        const pPos = this.pPosFromEvent(e);
        if (! pPos) {
            return undefined;
        }
        const lPos = this._context.setting.plConverter.lFromP(pPos);
        if (! lPos || ! this._context.isInRange(lPos)) {
            return undefined;
        };
        return { pPos, lPos };
    }

    private pPosFromEvent(e :T) :Pos|undefined {
        const target = e.target as HTMLElement;
        const { offsetX, offsetY } = { offsetX: 0, offsetY: 0 }; // offsetByField();
        const offset = this.offsetFromEvent(e);
        if (! offset) {
            return;
        }
        const { x, y } = offset;

        if (x < 0 || this._context.setting.imageSize.width <= x
            || y < 0 || this._context.setting.imageSize.height <= y) {
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
    protected abstract offsetFromEvent(e :T) :Pos|undefined;
}
