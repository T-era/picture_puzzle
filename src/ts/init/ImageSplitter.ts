import { FILE_INPUT, PREVIEW_CANVAS, PREVIEW_CANVAS_CONTEXT, X_SIZE_INPUT, Y_SIZE_INPUT } from "../doms";
import { PLConverter, PosRange, Range, RangeType } from "../tools/posRange";
import { SettingListener } from "../types";
import { FieldPart } from "./partsFactory";

type Callback<T> = (arg :T) => void;
const cnvContext = PREVIEW_CANVAS.getContext('2d')!
const cnvWidth = PREVIEW_CANVAS.width;
const cnvHeight = PREVIEW_CANVAS.height;

interface Size {
    width: number;
    height: number;
}
interface Rectangle {
    x :number;
    y :number;
    widht :number;
    height :number;
}
export class ImageSplitter {
    imageSize ?:Size;

    constructor(private listener :SettingListener<FieldPart>) {
        FILE_INPUT.onchange = (e) => this.onFileSelected(e);
        X_SIZE_INPUT.onchange = () => this.splitImage();
        Y_SIZE_INPUT.onchange = () => this.splitImage();
    }
    private onFileSelected(e :Event) {
        const fIn = e.target as HTMLInputElement;
    
        readFileAsDataUrl(fIn.files![0], (resultAsDataUrl :string) => {
            const img = new Image();
            img.src = resultAsDataUrl;
            img.onload = (e) => copyImgToCanvas(e, () => this.splitImage());
        });

        function readFileAsDataUrl(file :File, callback :Callback<string>) {
            const reader = new FileReader();
            reader.onload = () => callback(reader.result as string);
        
            reader.readAsDataURL(file);        
        }
        const copyImgToCanvas = (e :Event, callback :Callback<void>) => {
            const img = e.target as HTMLImageElement;
            const wRatio = img.width / cnvWidth;
            const hRatio = img.height / cnvHeight;
            const ratio = Math.max(wRatio, hRatio);
            this.imageSize = { width: img.width / ratio, height: img.height / ratio };
            cnvContext.clearRect(0, 0, cnvWidth, cnvHeight);
            cnvContext.drawImage(img, 0, 0, this.imageSize.width, this.imageSize.height);
            callback();
        }
    }
    
    private splitImage() {
        if (this.imageSize) {
            const xSize = Number(X_SIZE_INPUT.value);
            const ySize = Number(Y_SIZE_INPUT.value);
            const sizeConv = new PLConverter(
                new PosRange(new Range(0, this.imageSize.width), new Range(0, this.imageSize.height)),
                new PosRange(new Range(0, xSize), new Range(0, ySize)));
            const partsList :FieldPart[][] = [];
            const { width: partWidth, height: partHeight } = sizeConv.pPartSize;
            // const partWidth = this.imageSize.width / xSize;
            // const partHeight = this.imageSize.height / ySize;
            let id = 0;
            for (let y = 0; y < ySize; y ++) {
                const partLine = [];
                for (let x = 0; x < xSize; x ++) {
                    const lPos = { x, y };
                    const pPos = sizeConv.pFromL(lPos, RangeType.Min);
                    const part = new FieldPart(
                        PREVIEW_CANVAS_CONTEXT,
                        sizeConv,
                        lPos);
                    partLine.push(part);
                }
                partsList.push(partLine);
            }
    
            this.listener.onSettingChanged({
                parts: partsList,
                imageSize: this.imageSize,
                partWidth,
                partHeight,
            });
        }
    }
}
