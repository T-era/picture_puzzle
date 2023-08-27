import { addNGAnimeQueue, NGTarget } from "@lib/tools/anime/moving";
import { dPosFromDirection, FieldPart, isSamePos, motionFromDirection, MovingDirection, MovingTarget, Pos } from "@lib/types";
import { GameContext } from "../gameContext";
import { SwipeHandler } from "./touchListener";

export class SwipeListener implements SwipeHandler {
    constructor(private context :GameContext) {}

    onSwipe(targetLPos: Pos, direction: MovingDirection) :void {
        const target = this.context.parts[targetLPos.y][targetLPos.x];
        const emptyLPos = this.context.emptyLPos;
        if (target) {
            if (isValid()) {
                this.context.move(targetLPos, direction);
        
                this.context.onMoved();
            } else {
                const startPPos = target.currentPPos();
                const ngTarget = new NGTarget(target, startPPos);
                // NGのアクション
                addNGAnimeQueue({
                    targets: [ngTarget],
                    dPos: dPosFromDirection(direction),
                })
    
            }
        }

        function isValid() {
            switch (direction) {
                case MovingDirection.ToUp:
                    return targetLPos.x === emptyLPos.x && targetLPos.y > emptyLPos.y;
                case MovingDirection.ToDown:
                    return targetLPos.x === emptyLPos.x && targetLPos.y < emptyLPos.y;
                case MovingDirection.ToLeft:
                    return targetLPos.y === emptyLPos.y && targetLPos.x > emptyLPos.x;
                case MovingDirection.ToRight:
                    return targetLPos.y === emptyLPos.y && targetLPos.x < emptyLPos.x;
            }
        }
    }
}