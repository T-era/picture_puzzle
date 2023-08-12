import { PLConverter, RangeType } from "../tools/posRange";
import { Pos } from "../types";

export class FieldPart {
    canvas :HTMLCanvasElement;
    private correctLPos :Pos;

    constructor(cnvContext :CanvasRenderingContext2D, private readonly plConverter :PLConverter, lPos :Pos) {
        this.correctLPos = lPos;
        const size = plConverter.pPartSize;
        const { x, y } = plConverter.pFromL(lPos, RangeType.Min);
        const imageData = cnvContext.getImageData(x, y, size.width - 3, size.height - 3);

        const newCanvas = document.createElement('canvas');
        newCanvas.className = 'parts correct';
        newCanvas.id = `canvas_part_${lPos.x}_${lPos.y}`
        newCanvas.width = size.width - 3;
        newCanvas.height = size.height - 3;
newCanvas.innerText = `${lPos.x}, ${lPos.y}`;
        this.canvas = newCanvas;
        const ctx = newCanvas.getContext('2d')!;
        ctx.putImageData(imageData, 1, 1);

        this.moveTo(lPos);
    }
    private moveToP(pPos :Pos) {
        this.canvas.style.left = `${pPos.x}px`;
        this.canvas.style.top = `${pPos.y}px`;
    }
    moveTo(lPos :Pos) {
        if (isSame(this.correctLPos, lPos)) {
            this.canvas.classList.add('correct');
        } else {
            this.canvas.classList.remove('correct');
        }
        this.moveToP(this.plConverter.pFromL(lPos, RangeType.Min))
    }
}

function isSame(lPos1 :Pos, lPos2 :Pos) {
    return lPos1.x === lPos2.x
        && lPos1.y === lPos2.y;
}