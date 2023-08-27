import { BACKGROUND_SETTING, SCENE, SettingDoms, copyImage, hide, show } from "@lib/doms";
import { FieldPart, Setting } from "@lib/types";
import { Callback, ImageParsed, splitImage } from "@core/setting/ImageSplitter";
import { readFileAsDataUrl } from "@core/setting/readFile";
import { withElements } from "@lib/tools/modal";

export async function showSetting(isInit :true) :Promise<Setting<FieldPart>>;
export async function showSetting(isInit :false) :Promise<Setting<FieldPart>|undefined>;
export async function showSetting(isInit :boolean) {
    return await withElements(() => {
        if (isInit) {
            hide(SettingDoms.SETTING_CANCEL);
        } else {
            show(SettingDoms.SETTING_CANCEL);
        }
        return new Promise(resolve => {
            function resolveWithRevoke(setting :Setting<FieldPart>|undefined) {
                // Setting は何回も使われるのでrevokeしない
                resolve(setting)
            }
            SettingDoms.FILE_INPUT.onchange = onFileSelected;
            SettingDoms.SETTING_CANCEL.onclick = () => resolveWithRevoke(undefined);
            SettingDoms.SETTING_OK.onclick = async () => {
                const settingSrc = retrieveSettingSrc();
                if (settingSrc) {
                    const setting = await splitImage(
                        settingSrc.resultAsDataUrl,
                        settingSrc.xSize,
                        settingSrc.ySize,
                        ({img, imageSize}) => {
                            copyImage(img, imageSize);
                        }
                    );
                    resolveWithRevoke(setting);
                }
            };
        });
    }, BACKGROUND_SETTING, SCENE.SETTING);
}

type SettingSrc = { xSize:number, ySize :number, resultAsDataUrl:string};
function retrieveSettingSrc() :SettingSrc|undefined {
    const img = SettingDoms.IMG_PREVIEW;
    const resultAsDataUrl = img.src;
    const xSize = SettingDoms.X_SIZE_INPUT.valueAsNumber;
    const ySize = SettingDoms.Y_SIZE_INPUT.valueAsNumber;

    if (resultAsDataUrl && xSize && ySize) {
        return { xSize, ySize, resultAsDataUrl };
    }
}

async function onFileSelected() {
    if (! SettingDoms.FILE_INPUT.files || SettingDoms.FILE_INPUT.files.length === 0) {
        return;
    }
    const resultAsDataUrl = await readFileAsDataUrl(SettingDoms.FILE_INPUT.files[0])
    SettingDoms.IMG_PREVIEW.src = resultAsDataUrl;
}
