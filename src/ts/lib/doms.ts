import { Size } from "./types";

function byId<T extends HTMLElement>(id :string) :T {
    const dom = document.getElementById(id);
    if (dom) {
        return dom as T;
    } else {
        throw `${id} not found!`;
    }
}

export interface Canvas2d {
    canvas :HTMLCanvasElement;
    context :CanvasRenderingContext2D;
    showAnimate() :void;
    hide() :void;
};
function canvasById(id :string) :Canvas2d {
    const canvas = byId<HTMLCanvasElement>(id);
    const context = canvas.getContext('2d');
    if (!context) {
        throw `No 2d context (id: ${id})`
    }
    return {
        canvas,
        context,
        showAnimate: () => canvas.classList.add('show_animate'),
        hide: () => canvas.classList.remove('show_animate'),
    }
}

export const SettingDoms = {
    IMG_PREVIEW: byId<HTMLImageElement>('img_preview'),
    FILE_INPUT: byId<HTMLInputElement>('file_input'),
    X_SIZE_INPUT: byId<HTMLInputElement>('x_size'),
    Y_SIZE_INPUT: byId<HTMLInputElement>('y_size'),
    SETTING_OK: byId('setting_ok'),
    SETTING_CANCEL: byId('setting_cancel'),
} as const;
export const FIELD = byId('field');
export const SHOW_SUGGEST_BUTTON = byId('show_answer_button');
export const SHUFFLE_BUTTON = byId('shuffle_button');
export const MENU_BUTTON = byId('open_menu_button');

export const SUGGEST_CANVAS = canvasById('suggest_canvas');
export const RESULT_CANVAS = canvasById('result');

export const SCENE = {
    SETTING: byId('setting'),
    DEVICE_CHECK: byId('device_check'),
    GAME: byId('game_zone'),
}
export const BACKGROUND_SUGGEST = byId('background_suggest');
export const BACKGROUND_SETTING = byId('background_setting');


export function show(target :HTMLElement) {
    target.style.visibility = 'unset';
}
export function hide(target :HTMLElement) {
    target.style.visibility = 'hidden';
}

export function copyImage(img :CanvasImageSource , imageSize :Size) {
    copyTo(SUGGEST_CANVAS, .5);
    copyTo(RESULT_CANVAS);
    console.log('RC:::', RESULT_CANVAS.canvas.width, RESULT_CANVAS.canvas.height);
    console.log(imageSize);

    function copyTo(target :Canvas2d, ratio = 1) {
        const width = imageSize.width * ratio;
        const height = imageSize.height * ratio;
        target.canvas.width = width;
        target.canvas.height = height;
        target.canvas.style.width = `${width}px`;
        target.canvas.style.height = `${height}px`;
        target.context.clearRect(0, 0, width, height);
        target.context.drawImage(img, 0, 0, width, height);
    }
}