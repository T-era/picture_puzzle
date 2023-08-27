import { Device } from "@lib/tools/deviceJudge";
import { FieldPart, Setting } from "@lib/types";
import { GameContext } from "@core/gamezone/game/gameContext";
import { TouchActionListener } from "@core/gamezone/game/touch/touchListener";
import { SwipeListener } from "@core/gamezone/game/touch/swipeListener";
import { MouseActionListener } from "@core/gamezone/game/mouse/mouseListener";
import { shuffle } from "@lib/tools/shuffle";
import { RESULT_CANVAS } from "@lib/doms";
import { addAnimeQueueFinally } from "@lib/tools/anime/moving";

export class Game {
    private actionListener :TouchActionListener | MouseActionListener; 
    private readonly gameContext :GameContext;

    constructor(
        private readonly device :Device,
        private readonly setting :Setting<FieldPart>
    ) {
        this.gameContext = new GameContext(
            this.setting,
            () => {
                addAnimeQueueFinally(() => {
                    RESULT_CANVAS.showAnimate();
                });
            }
        );
        this.actionListener = this.createActionListener();
    }

    restart() {
        this.revoke();
        this.actionListener = this.createActionListener();
    }

    revoke() {
        this.actionListener.revoke();
    }
    removeFieldParts() {
        this.gameContext.removeFieldParts();
    }

    shuffle() {
        this.gameContext.leftTopEmpty();
        shuffle(this.gameContext.parts);
        this.restart();
        RESULT_CANVAS.hide();
    }

    private createActionListener() {
        return this.device === Device.Touch
            ? new TouchActionListener(this.gameContext, new SwipeListener(this.gameContext))
            : new MouseActionListener(this.gameContext);
    }
}