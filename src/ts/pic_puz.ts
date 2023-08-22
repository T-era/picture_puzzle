import { Device, DeviceJudge } from "@lib/tools/deviceJudge";
import { initInitializeSettingControl } from "./setting/settingControl";
import { FieldPart, Setting } from "@lib/types";
import { GameZoneContext } from "./gamezone/context";
import { SCENE } from "@lib/doms";
import { withElement } from "@lib/tools/modal";

export module PicPuz {
    export async function run() {
        SCENE.SETTING.style.visibility = 'hidden';;
        SCENE.DEVICE_CHECK.style.visibility = 'hidden';
//        SCENE.GAME.style.visibility = 'hidden';
return;
        const deviceJudge = new DeviceJudge();
        
        let setting = await withElement(SCENE.SETTING, initInitializeSettingControl);

        let device = await withElement(SCENE.DEVICE_CHECK, async () => {
            return await showDeviceJudge(deviceJudge)
        });

        SCENE.GAME.style.visibility = 'visible';
        new GameZoneContext(device, setting!);
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