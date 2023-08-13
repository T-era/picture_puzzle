import { Pos } from "../types";

interface Movable {
    moveTo(pos :Pos) :void;
}

export function shuffle<T extends Movable>(origin :(T|undefined)[][]) {
    const flatted = flat(origin);
    swap(flatted, flatted.length * 2); // 偶数回である必要がある。

    for (let y = 0; y < origin.length; y ++) {
        const line = origin[y];
        for (let x = 0; x < line.length; x ++) {
            const item = flatted.shift();
            origin[y][x] = item;
            item?.moveTo({x, y});
        }
    }
}

function flat<T>(origin :T[][]) :T[] {
    return ([] as T[]).concat.apply([], origin);
}
function swap<T>(origin :T[], cnt :number) {
    while (cnt > 0) {
        swapOnce(origin);
        cnt --;
    }
}

function swapOnce<T>(origin :T[]) {
    // 先頭の空きマスは入れ替えない。
    const index = 1 + Math.floor(Math.random() * (origin.length - 2));
    const temp = origin[index];
    origin[index] = origin[index + 1];
    origin[index + 1] = temp;
}
