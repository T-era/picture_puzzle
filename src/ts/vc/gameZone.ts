import { MENU_BUTTON, SHUFFLE_BUTTON } from "@lib/doms";
import { FieldPart, Setting } from "@lib/types";
import { Device } from "@lib/tools/deviceJudge";
import { initAnswerPreview } from "./answerPreview";
import { showSetting } from "./settingControl";
import { Game } from "./game";

export class GameZoneContext {
    private gameView: Game;

    constructor(private readonly device: Device, setting: Setting<FieldPart>) {
        this.gameView = new Game(device, setting);
        SHUFFLE_BUTTON.onclick = () => {
            this.shuffleRestart();
        };
        MENU_BUTTON.onclick = async () => {
            const setting = await openSettingMenu();
            if (setting) {
                this.gameView.revoke();
                this.gameView.removeFieldParts();
                this.setSetting(setting);
                this.shuffleRestart();
            }
        }
        this.shuffleRestart();

        initAnswerPreview(device);
    }

    private setSetting(setting: Setting<FieldPart>) {
        this.gameView = new Game(this.device, setting);
    }

    private shuffleRestart() {
        this.gameView.shuffle();
    }
}

async function openSettingMenu(): Promise<Setting<FieldPart> | undefined> {
    return await showSetting(false);
}
