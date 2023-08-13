import { shuffle } from "../action/shuffle";
import { ANSWER_CANVAS, FILE_INPUT, PREVIEW_CANVAS, PREVIEW_CANVAS_CONTEXT, SHUFFLE_BUTTON, X_SIZE_INPUT, Y_SIZE_INPUT } from "../doms";
import { PLConverter, PosRange, Range } from "../tools/posRange";
import { Setting, SettingListener } from "../types";
import { FieldPart } from "./partsFactory";

type Callback<T> = (arg :T) => void;
const cnvContextP = PREVIEW_CANVAS.getContext('2d')!
const cnvContextA = ANSWER_CANVAS.getContext('2d')!
const cnvWidth = PREVIEW_CANVAS.width;
const cnvHeight = PREVIEW_CANVAS.height;

interface Size {
    width: number;
    height: number;
}

export function initEvents() {
    
}
export class ImageSplitter {
    imageSize ?:Size;
    setting ?:Setting<FieldPart>;

    constructor(private listener :SettingListener<FieldPart>) {
        FILE_INPUT.onchange = (e) => this.onFileSelected(e);
        X_SIZE_INPUT.onchange = () => this.splitImage();
        Y_SIZE_INPUT.onchange = () => this.splitImage();
        SHUFFLE_BUTTON.onclick = () => this.shuffle();
    }
    private shuffle() {
        if (this.imageSize && this.setting) {
            shuffle(this.setting.parts);

            ANSWER_CANVAS.classList.remove('show');
            this.listener.onSettingChanged(this.setting);
        }
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
            cnvContextP.clearRect(0, 0, cnvWidth, cnvHeight);
            cnvContextA.clearRect(0, 0, cnvWidth + 4, cnvHeight + 4);
            cnvContextP.drawImage(img, 0, 0, this.imageSize.width, this.imageSize.height);
            cnvContextA.drawImage(img, 2, 2, this.imageSize.width, this.imageSize.height);
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

            for (let y = 0; y < ySize; y ++) {
                const partLine = [];
                for (let x = 0; x < xSize; x ++) {
                    const lPos = { x, y };
                    const part = new FieldPart(
                        PREVIEW_CANVAS_CONTEXT,
                        sizeConv,
                        lPos);
                    partLine.push(part);
                }
                partsList.push(partLine);
            }

            this.setting = {
                parts: partsList,
                imageSize: this.imageSize,
                partWidth,
                partHeight,
                plConverter: sizeConv,
            }

            ANSWER_CANVAS.classList.remove('show');
            this.listener.onSettingChanged(this.setting);
        }
    }
}
