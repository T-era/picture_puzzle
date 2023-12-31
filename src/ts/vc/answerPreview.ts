import { BACKGROUND_SUGGEST, SUGGEST_CANVAS, SHOW_SUGGEST_BUTTON } from "@lib/doms";
import { Device } from "@lib/tools/deviceJudge";

export function initAnswerPreview(device :Device) {
    if (device === Device.Mouse) {
        toggleVisibility(
            { dom: SHOW_SUGGEST_BUTTON, event: 'mouseenter' },
            { dom: SHOW_SUGGEST_BUTTON, event: 'mouseleave' },
            SUGGEST_CANVAS.canvas);
    } else {
        toggleVisibility(
            { dom: SHOW_SUGGEST_BUTTON, event: 'click' },
            { dom: BACKGROUND_SUGGEST, event: 'click' },
            SUGGEST_CANVAS.canvas, BACKGROUND_SUGGEST);
    }
}

type EventListener = {
    dom :HTMLElement,
    event :keyof HTMLElementEventMap,
};

function toggleVisibility<T>(eventListenerOn :EventListener, eventListenerOff :EventListener, ...targets :HTMLElement[]) {
    hide();
    eventListenerOn.dom.addEventListener(eventListenerOn.event, show);
    eventListenerOff.dom.addEventListener(eventListenerOff.event, hide);
    
    function show() {
        targets.forEach(target => target.style.visibility = 'visible');
    }
    function hide() {
        targets.forEach(target => target.style.visibility = 'hidden');
    }
}