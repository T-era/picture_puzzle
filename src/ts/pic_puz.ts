import { Device, DeviceJudge } from "@lib/tools/deviceJudge";
import { GameZoneContext } from "./vc/gameZone";
import { BACKGROUND_SETTING, FIELD, RESULT_CANVAS, SCENE } from "@lib/doms";
import { withElements } from "@lib/tools/modal";
import { showSetting } from "./vc/settingControl";

export module PicPuz {
    export async function run() {
        BACKGROUND_SETTING.style.visibility = 'visible'
        SCENE.SETTING.style.visibility = 'hidden';;
        SCENE.DEVICE_CHECK.style.visibility = 'hidden';
        SCENE.GAME.style.visibility = 'hidden';
const w = FIELD; //document.getElementsByClassName('main')[0] as HTMLElement;
console.log(w, w.clientWidth, w.clientHeight);
        const deviceJudge = new DeviceJudge();
        
        let setting = await showSetting(true);

        let device = await withElements(async () => {
            return await showDeviceJudge(deviceJudge)
        }, SCENE.DEVICE_CHECK);

        SCENE.GAME.style.visibility = 'visible';
        new GameZoneContext(device, setting);
    }
}

async function showDeviceJudge(deviceJudge :DeviceJudge) :Promise<Device> {
    if (deviceJudge.device !== Device.Unknown) {
        deviceJudge.revoke();
        return deviceJudge.device;
    } else {
        return new Promise<Device>(resolve => {
            deviceJudge.listener = setting => {
                resolve(setting);
            };
        });
    }
}