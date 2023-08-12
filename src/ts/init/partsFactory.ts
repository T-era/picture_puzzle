import { addAnimeQueue } from "../anime/moving";
import { PLConverter, RangeType } from "../tools/posRange";
import { Pos } from "../types";

const BORDER_WIDTH = 2 * 2 + 1;

export class FieldPart {
    canvas :HTMLCanvasElement;
    private correctLPos :Pos;
    currentPPos :Pos;

    constructor(cnvContext :CanvasRenderingContext2D, private readonly plConverter :PLConverter, lPos :Pos) {
        this.correctLPos = lPos;
        const size = plConverter.pPartSize;
        const { x, y } = plConverter.pFromL(lPos, RangeType.Min);
        this.currentPPos = { x, y };
        const imageData = cnvContext.getImageData(
            x,
            y,
            size.width - BORDER_WIDTH,
            size.height - BORDER_WIDTH);

        const newCanvas = document.createElement('canvas');
        newCanvas.className = 'parts correct';
        newCanvas.id = `canvas_part_${lPos.x}_${lPos.y}`
        newCanvas.width = size.width - BORDER_WIDTH;
        newCanvas.height = size.height - BORDER_WIDTH;
newCanvas.innerText = `${lPos.x}, ${lPos.y}`;
        this.canvas = newCanvas;
        const ctx = newCanvas.getContext('2d')!;
        ctx.putImageData(imageData, 1, 1);

        this.moveTo(lPos);
    }
    private moveToP(pPos :Pos) {
        this.canvas.style.left = `${pPos.x}px`;
        this.canvas.style.top = `${pPos.y}px`;
        this.currentPPos = pPos;
    }
    moveTo(lPos :Pos) {
        const from = this.currentPPos;
        if (isSame(this.correctLPos, lPos)) {
            this.canvas.classList.add('correct');
        } else {
            this.canvas.classList.remove('correct');
        }
        const toPPos = this.plConverter.pFromL(lPos, RangeType.Min)
        this.moveToP(toPPos)
        const to = toPPos;
        addAnimeQueue({
            from,
            to,
            target: this,
        });
    }
}

function isSame(lPos1 :Pos, lPos2 :Pos) {
    return lPos1.x === lPos2.x
        && lPos1.y === lPos2.y;
}