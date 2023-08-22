import { EventListener } from "@lib/types";

export enum Device {
    Unknown = 0,
    Touch = 1,
    Mouse = 2,
}

export class DeviceJudge implements EventListener {
    touchEventOccured = false;
    omuseEventOccured = false;
    listener ?:(device :Device) => void;

    constructor() {
        document.body.ontouchstart = () => {
            this.touchEventOccured = true;
            fireListener();
        };
        document.body.onmousemove = () => {
            this.omuseEventOccured = true
            fireListener();
        };

        const fireListener = () => {
            setTimeout(
                () => {
                    const result = this.device;
                    if (result && this.listener) {
                        this.listener(result);
                    }
                    this.revoke();
                }, 0);
        }
    }

    get device() :Device {
        if (this.touchEventOccured) {
            return Device.Touch;
        } else if (this.omuseEventOccured) {
            return Device.Mouse;
        } else {
            return Device.Unknown;
        }
    }

    revoke() :void {
        document.body.ontouchstart = null;
        document.body.onmousemove = null;
    }
}
