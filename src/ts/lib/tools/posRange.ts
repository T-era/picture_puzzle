import { Pos, Size } from "@lib/types";

export class Range {
    constructor(
        readonly min :number,
        readonly max :number) {}
    
    get valueWidth() {
        return this.max - this.min;
    }
    /**
     * Range範囲内なら 0-1 で位置を返す
     * @param value 値
     */
    where(value :number) :number {
        if (this.min <= value && value <= this.max) {
            return (value - this.min) / this.valueWidth
        } else {
            throw `${this.min} - ${this.max} なのに ${value}`;
        }
    }
    /**
     * 0-1範囲の割合を指定したら、min-max範囲の値を返す
     * @param rate 0-1
     */
    at(rate :number) :number {
        return rate * this.valueWidth + this.min
    }
}
export class PosRange {
    constructor(
        readonly x :Range,
        readonly y :Range) {}

    get size() :Size {
        return {
            width: this.x.valueWidth,
            height: this.y.valueWidth,
        };
    }
}
export class PLConverter {
    constructor(
        private readonly pRange :PosRange,
        private readonly lRange :PosRange) {
    }
    lFromP(pPos :Pos) :Pos {
        return {
            x: Math.floor(
                this.lRange.x.at(
                    this.pRange.x.where(pPos.x))),
            y: Math.floor(
                this.lRange.y.at(
                    this.pRange.y.where(pPos.y))),
        };
    }
    pFromL(lPos :Pos, type :RangeType = RangeType.Center) :Pos {
        const offset = offsetByType(type);
        return {
            x: this.pRange.x.at(
                this.lRange.x.where(lPos.x + offset)),
            y: this.pRange.y.at(
                this.lRange.y.where(lPos.y + offset)),
        };

        function offsetByType(type :RangeType) :number {
            switch(type) {
                case RangeType.Min:
                    return 0;
                case RangeType.Max:
                    return 1;
                case RangeType.Center:
                    return .5;
            }
        }
    } 
    get pFullSize() :Size {
        return this.pRange.size;
    }
    get pPartSize() :Size {
        return {
            width: this.pRange.x.valueWidth / this.lRange.x.valueWidth,
            height: this.pRange.y.valueWidth / this.lRange.y.valueWidth,
        }
    }
}

export enum RangeType {
    Center, Min, Max,
}