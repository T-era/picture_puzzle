import { PLConverter } from "./tools/posRange";

export interface Pos {
    x :number;
    y :number;
}
export interface Size {
    width :number;
    height :number;
}
export interface Setting<T> {
    parts :T[][];
    imageSize :Size;
    partWidth :number;
    partHeight :number;
    plConverter :PLConverter;
}

export function isSamePos(p1 :Pos, p2 :Pos) :boolean {
    return p1.x === p2.x
        && p1.y === p2.y;
}

export interface PLPos {
    lPos :Pos;
    pPos :Pos;
}

export enum MovingDirection {
    ToUp = 1,
    ToDown = 2,
    ToLeft = 3,
    ToRight = 4,
}

export type Motion = (p :Pos) => Pos;

export function motionFromDirection(direction :MovingDirection) :Motion {
    const d = dPosFromDirection(direction);
    return pos => {
        return { x: pos.x + d.x, y: pos.y + d.y };
    }
}

export function dPosFromDirection(d :MovingDirection) :Pos {
    const size = 1;
    switch (d) {
        case MovingDirection.ToUp:
            return { x: 0, y: - size };
        case MovingDirection.ToDown:
            return { x: 0, y: size };
        case MovingDirection.ToLeft:
            return { x: - size, y: 0 };
        case MovingDirection.ToRight:
            return { x: size, y: 0 };
    }
}

export class MovingTarget {
    currentPPos :Pos;
    constructor(private target :FieldPart, startPPos :Pos) {
        this.currentPPos = { ...startPPos };
    }
    move(dx :number, dy :number) {
        this.currentPPos.x += dx;
        this.currentPPos.y += dy;
        this.target.canvas.style.left = `${this.currentPPos.x}px`;
        this.target.canvas.style.top = `${this.currentPPos.y}px`;
    }
}

export interface FieldPart {
    canvas :HTMLCanvasElement;
    moveTo(lPos :Pos) :MovingTarget;
    currentPPos() :Pos;
    get isCorrectPos() :boolean;
}

export interface EventListener {
    revoke() :void;
}