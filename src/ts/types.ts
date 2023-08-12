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
}

export interface SettingListener<T> {
    onSettingChanged(newSetting :Setting<T>) :void;
}
