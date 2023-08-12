import { FILE_INPUT, PREVIEW_CANVAS } from "../doms";

export function init() {
    PREVIEW_CANVAS.style.visibility = 'hidden';
    FILE_INPUT.onmouseenter = () => {
        PREVIEW_CANVAS.style.visibility = 'visible';
    };
    FILE_INPUT.onmouseleave = () => {
        PREVIEW_CANVAS.style.visibility = 'hidden';
    }
}

