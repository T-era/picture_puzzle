import { FieldPart } from "../init/partsFactory";
import { Pos } from "../types";

const ANIME_FRAMES = 3;
interface MovingRequest {
    pdx :number;
    pdy :number;
    targets :MovingTarget[];
}
export class MovingTarget {
    private currentPPos :Pos;
    constructor(private target :FieldPart, startPPos :Pos) {
        this.currentPPos = { ...startPPos };
    }
    move(dx :number, dy :number) {
        this.currentPPos.x += dx;
        this.currentPPos.y += dy;
        this.target.canvas.style.left = `${this.currentPPos.x}px`;
        this.target.canvas.style.top = `${this.currentPPos.y}px`;
    }
}

class MovingAnime {
    targets :MovingTarget[];
    dx :number;
    dy :number;
    current :number;
    constructor(req :MovingRequest) {
        this.current = 1;
        this.targets = req.targets;
        this.dx = req.pdx / ANIME_FRAMES;
        this.dy = req.pdy / ANIME_FRAMES;
        this.targets.forEach(t => t.move(this.dx, this.dy));
    }
    running() {
        this.current ++;
        this.targets.forEach(t => t.move(this.dx, this.dy));

        if (this.current < ANIME_FRAMES) {
            return false;
        } else {
            return true;
        }
    }
}

type Action = () => void;

const movingAnimeManager = new class {
    queue :MovingAnime[] = [];
    finalize ?:Action;

    runMovingAnime() {
        if (this.queue.length) {
            const temp :(MovingAnime|undefined)[] = this.queue;
            this.queue.forEach((ma, index) => {
                const result = ma.running();
                if (result) {
                    temp[index] = undefined;
                }
            });
            this.queue = temp.filter(Boolean) as MovingAnime[];
        } else if (this.finalize) {
            this.finalize();
            this.finalize = undefined;
        }
    }
};

setInterval(() => movingAnimeManager.runMovingAnime(), 100);

export function addAnimeQueue(req :MovingRequest) {
    const ma = new MovingAnime(req);
    ma.running();
    movingAnimeManager.queue.push(ma);
}
export function addAnimeQueueFinally(action :Action) {
    movingAnimeManager.finalize = action
}
