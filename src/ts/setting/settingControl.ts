import { Setting as StDom, SettingDomGroup, copyImage } from "@lib/doms";
import { FieldPart, Setting } from "@lib/types";
import { splitImage } from "./ImageSplitter";

function initSettingEvents(doms :SettingDomGroup) :Promise<Setting<FieldPart>|undefined> {
    return new Promise((resolve) => {
        doms.FILE_INPUT.onchange = (e :Event) => onFileSelected(e);
        if (doms.SETTING_CANCEL) {
            doms.SETTING_CANCEL.onclick = () => resolve(undefined);
        }
        doms.SETTING_OK.onclick = ()=> onOkClicked((setting :Setting<FieldPart>) => {
            doms.FILE_INPUT.onchange = null;
            if (doms.SETTING_CANCEL) {
                doms.SETTING_CANCEL.onclick = null;
            }
            doms.SETTING_OK.onclick = null;
    
            resolve(setting);
        });
    });

    async function onOkClicked(callback :(setting :Setting<FieldPart>)=>void) {
        const img = doms.IMG_PREVIEW;
        const resultAsDataUrl = img.src;
        const xSize = Number(doms.X_SIZE_INPUT.value);
        const ySize = Number(doms.Y_SIZE_INPUT.value);
    
        if (resultAsDataUrl
            && xSize && ySize) {
    
            const setting = await splitImage(resultAsDataUrl, xSize, ySize, ({img, imageSize}) => {
                copyImage(img, imageSize);
            });
            callback(setting);
        }
    }
    
    async function onFileSelected(e :Event) {
        if (! doms.FILE_INPUT.files || doms.FILE_INPUT.files.length === 0) {
            return;
        }
        const resultAsDataUrl = await readFileAsDataUrl(doms.FILE_INPUT.files[0])
        doms.IMG_PREVIEW .src = resultAsDataUrl;
    }
    
    async function readFileAsDataUrl(file :File) :Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result as string);
                } else {
                    reject();
                }
            };
            reader.readAsDataURL(file);
        });
    }    
}

/**
 * 初期化時用、設定画面表示
 * @returns 
 */
export async function initInitializeSettingControl() :Promise<Setting<FieldPart>|undefined> {
    return initSettingEvents(StDom.Init);
}

/**
 * ゲーム中用、設定画面表示
 * @returns 
 */
export async function initIngameSettingControl() :Promise<Setting<FieldPart>|undefined> {
    return await initSettingEvents(StDom.Ingame);
}
