import { Size } from "./types";

export interface SettingDomGroup {
    IMG_PREVIEW :HTMLImageElement;
    FILE_INPUT :HTMLInputElement;
    X_SIZE_INPUT :HTMLInputElement;
    Y_SIZE_INPUT :HTMLInputElement;
    SETTING_OK :HTMLButtonElement;
    SETTING_CANCEL ?:HTMLButtonElement;
}
export const Setting = {
    Init: {
        IMG_PREVIEW: document.getElementById('img_preview') as HTMLImageElement,
        FILE_INPUT: document.getElementById('file_input') as HTMLInputElement,
        X_SIZE_INPUT: document.getElementById('x_size') as HTMLInputElement,
        Y_SIZE_INPUT: document.getElementById('y_size') as HTMLInputElement,
        SETTING_OK: document.getElementById('setting_ok') as HTMLButtonElement,
    },
    Ingame: {
        IMG_PREVIEW: document.getElementById('img_preview_') as HTMLImageElement,
        FILE_INPUT: document.getElementById('file_input_') as HTMLInputElement,
        X_SIZE_INPUT: document.getElementById('x_size_') as HTMLInputElement,
        Y_SIZE_INPUT: document.getElementById('y_size_') as HTMLInputElement,
        SETTING_OK: document.getElementById('setting_ok_') as HTMLButtonElement,
        SETTING_CANCEL: document.getElementById('setting_cancel_') as HTMLButtonElement,
    }
} as const;
export const SUGGEST_CANVAS = document.getElementById('suggest_canvas') as HTMLCanvasElement;
export const SUGGEST_CANVAS_CONTEXT = SUGGEST_CANVAS.getContext('2d')!;
export const SHOW_SUGGEST_BUTTON = document.getElementById('show_answer_button') as HTMLElement;
export const FIELD = document.getElementById('field') as HTMLDivElement;
export const SHUFFLE_BUTTON = document.getElementById('shuffle_button') as HTMLElement;
export const MENU_BUTTON = document.getElementById('open_menu_button') as HTMLElement;
export const RESULT_CANVAS = document.getElementById('result') as HTMLCanvasElement;
export const RESULT_CANVAS_CONTEXT = RESULT_CANVAS.getContext('2d')!;

export const SCENE = {
    SETTING: document.getElementById('setting') as HTMLElement,
    DEVICE_CHECK: document.getElementById('deviceCheck') as HTMLElement,
    GAME: document.getElementById('game') as HTMLElement,
}
export const OVERLAY = document.getElementById('overlay') as HTMLElement;
export const BACKGROUND_SUGGEST = document.getElementById('background_suggest') as HTMLElement;
export const BACKGROUND_SETTING = document.getElementById('background_setting') as HTMLElement;

export function copyImage(img :CanvasImageSource , imageSize :Size) {
    SUGGEST_CANVAS_CONTEXT.clearRect(0, 0, SUGGEST_CANVAS.width, SUGGEST_CANVAS.height);
    SUGGEST_CANVAS_CONTEXT.drawImage(img, 0, 0, imageSize.width, imageSize.height);
    RESULT_CANVAS_CONTEXT.clearRect(0, 0, RESULT_CANVAS.width, RESULT_CANVAS.height);
    RESULT_CANVAS_CONTEXT.drawImage(img, 2, 2, imageSize.width, imageSize.height);
}