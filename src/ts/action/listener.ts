import { FIELD, SHUFFLE_BUTTON } from "../doms";
import { Pos } from "../types";
import { GameContext } from "./context";
import { shuffle } from "./shuffle";

export class ActionListener {
    constructor(private context :GameContext) {
        FIELD.onmousemove = (e) => this.mouseMoved(e);
        FIELD.onclick = (e) => this.clicked(e);
        SHUFFLE_BUTTON.onclick = () => this.shuffleParts()
    }
    mouseMoved(e :MouseEvent) {
        const moving = this.getMoving(e);
        FIELD.classList.remove('up');
        FIELD.classList.remove('down');
        FIELD.classList.remove('left');
        FIELD.classList.remove('right');
        if (moving) {
            const direction = moving.direction;
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
    clicked(e :MouseEvent) {
        const moving = this.getMoving(e);
        if (moving) {
            const { direction, empty } = moving;
            const fromPos = getFromPos(direction, empty);
            const part = this.context.parts[fromPos.y][fromPos.x];
            this.context.parts[fromPos.y][fromPos.x] = undefined;
            this.context.parts[empty.y][empty.x] = part;
            part?.moveTo({
                x: empty.x,
                y: empty.y,
            })
        }
        this.mouseMoved(e);

        function getFromPos(direction :MovingDirection, empty :Pos) :Pos {
            if (direction === MovingDirection.ToUp) {
                return { x: empty.x, y: empty.y + 1 }; 
            } else if (direction === MovingDirection.ToDown) {
                return { x: empty.x, y: empty.y - 1 }; 
            } else if (direction === MovingDirection.ToLeft) {
                return { x: empty.x + 1, y: empty.y }; 
            } else if (direction === MovingDirection.ToRight) {
                return { x: empty.x - 1, y: empty.y }; 
            } else {
                throw "Unexpected"
            }
        }
    }
    getPPos(e :MouseEvent) :Pos|undefined {
        const target = e.target as HTMLElement;
        const { offsetX, offsetY } = offsetByField();
        const { offsetX: x, offsetY: y } = e;

        if (x < 0 || this.context.setting!.imageSize.width <= x
            || y < 0 || this.context.setting!.imageSize.height <= y) {
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
    getMoving(e :MouseEvent) :Moving|undefined {
        const pPos = this.getPPos(e);
        if (!pPos) {
            return;
        }
        const lPos = this.context.lFromP(pPos);
        if (! lPos || !this.context.isInRange(lPos)) {
            return;
        }
        const pointedPart = this.context.parts[lPos.y][lPos.x];
        if (! pointedPart) {
            // マス内の位置で方向性で決める
            const pCenter = this.context.pCenterFromL(lPos);
            const dx = pPos.x - pCenter.x;
            const dy = pPos.y - pCenter.y;
            const adx = Math.abs(dx);
            const ady = Math.abs(dy);
            if (adx > ady) {
                if (dx < 0 && this.context.isInRange({ x: lPos.x - 1, y: lPos.y })) {
                    return {
                        direction: MovingDirection.ToRight,
                        empty: lPos,
                    };
                } else if (dx > 0 && this.context.isInRange({ x: lPos.x + 1, y: lPos.y })) {
                    return {
                        direction: MovingDirection.ToLeft,
                        empty: lPos,
                    };
                }
            } else if (ady > adx) {
                if (dy < 0 && this.context.isInRange({ x: lPos.x, y: lPos.y - 1 })) {
                    return {
                        direction: MovingDirection.ToDown,
                        empty: lPos,
                    };
                } else if (dy > 0 && this.context.isInRange({ x: lPos.x, y: lPos.y + 1 })) {
                    return {
                        direction: MovingDirection.ToUp,
                        empty: lPos,
                    };
                }
            }
        } else if (lPos.y - 1 >= 0 && this.context.parts[lPos.y - 1][lPos.x] === undefined) {
            return {
                direction: MovingDirection.ToUp,
                empty: { y: lPos.y - 1, x: lPos.x },
            };
        } else if (lPos.y + 1 < this.context.parts.length && this.context.parts[lPos.y + 1][lPos.x] === undefined) {
            return {
                direction: MovingDirection.ToDown,
                empty: { y: lPos.y + 1, x: lPos.x },
            };
        } else if (lPos.x - 1 >= 0 && this.context.parts[lPos.y][lPos.x - 1] === undefined) {
            return {
                direction: MovingDirection.ToLeft,
                empty: { y: lPos.y, x: lPos.x - 1 },
            };
        } else if (lPos.x + 1 < this.context.parts[0].length && this.context.parts[lPos.y][lPos.x + 1] === undefined) {
            return {
                direction: MovingDirection.ToRight,
                empty: { y: lPos.y, x: lPos.x + 1 },
            };
        } 
    }
    shuffleParts() {
        console.log("start");
        shuffle(this.context.parts);
    }

    revoke() {
        FIELD.onmousemove = null;
        FIELD.onclick = null;
    }
}

interface Moving {
    direction :MovingDirection;
    empty :Pos;
}
enum MovingDirection {
    ToUp,
    ToDown,
    ToLeft,
    ToRight,
}