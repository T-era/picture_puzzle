import { FIELD, RESULT_CANVAS } from "@lib/doms";
import { PLConverter, PosRange, Range } from "@lib/tools/posRange";
import { FieldPart, Setting, Size } from "@lib/types";
import { FieldPartImpl } from "./partsFactory";

export interface ImageParsed {
    img :HTMLImageElement;
    imageSize :Size;
}
export type Callback<T> = (arg :T) => void;
const cnvWidth = FIELD.clientWidth;
const cnvHeight = FIELD.clientHeight;

export async function splitImage(
    resultAsDataUrl :string,
    xSize :number,
    ySize :number,
    imageCallback :Callback<ImageParsed>
) :Promise<Setting<FieldPart>> {
    return new Promise<Setting<FieldPart>>(resolve => {
        const img = new Image();
        img.src = resultAsDataUrl;
        img.onload = () => {
            const imageSize = calcImageSize();
            imageCallback({ img, imageSize });
            const setting = splitImage(imageSize)
            resolve(setting);

            function calcImageSize() {
                const wRatio = img.width / cnvWidth;
                const hRatio = img.height / cnvHeight;
                const ratio = Math.max(wRatio, hRatio);
                const imageSize = { width: img.width / ratio, height: img.height / ratio };
                return imageSize;
            }
            function splitImage(imageSize :Size) {
                const sizeConv = new PLConverter(
                    new PosRange(new Range(0, imageSize.width), new Range(0, imageSize.height)),
                    new PosRange(new Range(0, xSize), new Range(0, ySize)));
                const partsList :FieldPart[][] = [];
                const { width: partWidth, height: partHeight } = sizeConv.pPartSize;
    
                for (let y = 0; y < ySize; y ++) {
                    const partLine = [];
                    for (let x = 0; x < xSize; x ++) {
                        const lPos = { x, y };
                        const part = new FieldPartImpl(
                            RESULT_CANVAS.context,
                            sizeConv,
                            lPos);
                        partLine.push(part);
                    }
                    partsList.push(partLine);
                }
    
                return {
                    parts: partsList,
                    imageSize: imageSize,
                    partWidth,
                    partHeight,
                    plConverter: sizeConv,
                }
            };
        };
    });
}
