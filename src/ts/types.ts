import { PLConverter, RangeType } from "./tools/posRange";

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

export interface SettingListener<T> {
    onSettingChanged(newSetting :Setting<T>) :void;
}

export function isSamePos(p1 :Pos, p2 :Pos) :boolean {
    return p1.x === p2.x
        && p1.y === p2.y;
}

export interface PLPos {
    lPos ?:Pos;
    pPos ?:Pos;
}

export enum MovingDirection {
    ToUp = 1,
    ToDown = 2,
    ToLeft = 3,
    ToRight = 4,
}

export type Motion = (p :Pos) => Pos;
