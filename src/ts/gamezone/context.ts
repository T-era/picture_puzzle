import { RESULT_CANVAS, BACKGROUND_SETTING, FIELD, MENU_BUTTON, SHUFFLE_BUTTON } from "@lib/doms";
import { FieldPart, Setting } from "@lib/types";
import { Device } from "@lib/tools/deviceJudge";
import { initAnswerPreview } from "./answerPreview";
import { shuffle } from "./shuffle";
import { initIngameSettingControl } from "../setting/settingControl";
import { withElement } from "@lib/tools/modal";
import { GameContext, createNewGameContext } from "./game/gameContext";

export class GameZoneContext {
    private gameContext: GameContext;

    constructor(private readonly device: Device, setting: Setting<FieldPart>) {
        this.gameContext = createNewGameContext(setting, device);
        this.shuffleRestart();

        initAnswerPreview(device);
        SHUFFLE_BUTTON.onclick = () => {
            if (this.gameContext) {
                this.shuffleRestart();
            }
        };
        MENU_BUTTON.onclick = async () => {
            await withElement(BACKGROUND_SETTING, async () => {
                const setting = await openSettingMenu();
                if (setting) {
                    this.setSetting(setting);
                    this.shuffleRestart();
                }
            });
        }
    }

    private setSetting(setting: Setting<FieldPart>) {
        if (this.gameContext) {
            this.gameContext.revoke();
        }
        while (FIELD.children.length) {
            FIELD.removeChild(FIELD.children[0]);
        }
        this.gameContext = createNewGameContext(setting, this.device);
        return this.gameContext;
    }

    private shuffleRestart() {
        this.gameContext.init();
        shuffle(this.gameContext.parts);
        RESULT_CANVAS.classList.remove('show');
    }
}

async function openSettingMenu(): Promise<Setting<FieldPart> | undefined> {
    return await initIngameSettingControl();
}
