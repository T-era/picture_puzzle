import { PLConverter, RangeType } from "@lib/tools/posRange";
import { isSamePos, MovingTarget, Pos } from "@lib/types";

const BORDER_WIDTH = 2 * 2 + 1;

export class FieldPartImpl {
    canvas :HTMLCanvasElement;
    private correctLPos :Pos;
    currentLPos :Pos;

    constructor(
        cnvContext :CanvasRenderingContext2D,
        private readonly plConverter :PLConverter,
        lPos :Pos
    ) {
        this.correctLPos = lPos;
        const size = plConverter.pPartSize;
        const { x, y } = plConverter.pFromL(lPos, RangeType.Min);
        this.currentLPos = lPos;
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

        this.canvas = newCanvas;
        const ctx = newCanvas.getContext('2d')!;
        ctx.putImageData(imageData, 1, 1);

        this.moveTo(lPos);
    }
    private moveToP(pPos :Pos) {
        this.canvas.style.left = `${pPos.x}px`;
        this.canvas.style.top = `${pPos.y}px`;
    }
    moveTo(lPos :Pos) :MovingTarget {
        const from = this.plConverter.pFromL(this.currentLPos, RangeType.Min);
        this.currentLPos = lPos;
        if (isSamePos(this.correctLPos, lPos)) {
            this.canvas.classList.add('correct');
        } else {
            this.canvas.classList.remove('correct');
        }
        const toPPos = this.plConverter.pFromL(lPos, RangeType.Min)
        this.moveToP(toPPos);

        return new MovingTarget(this, from);
    }
    currentPPos() :Pos {
        return this.plConverter.pFromL(this.currentLPos, RangeType.Min);
    }
    get isCorrectPos() :boolean {
        return isSamePos(this.correctLPos, this.currentLPos);
    }
}
