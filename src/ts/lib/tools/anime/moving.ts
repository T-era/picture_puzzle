import { FieldPart, MovingTarget, Pos } from "@lib/types";

const ANIME_FRAMES = 3;

interface MovingRequest {
    pdx :number;
    pdy :number;
    targets :MovingTarget[];
}
interface NGRequest {
    targets :NGTarget[];
    dPos :Pos;
}
export class NGTarget {
    constructor(private target :FieldPart, private startPPos :Pos) {}
    move(dx :number, dy :number) {
        this.target.canvas.style.left = `${this.startPPos.x + dx}px`;
        this.target.canvas.style.top = `${this.startPPos.y + dy}px`;
    }
}

abstract class Anime {
    private currentFrame :number = 0;
    private totalFrames :number;

    constructor(totalFrames :number) {
        this.totalFrames = totalFrames;
    }
    run() :boolean {
        this.currentFrame ++;
        this.running(this.currentFrame);
        if (this.currentFrame < this.totalFrames) {
            return false;
        } else {
            return true;
        }
    }
    abstract running(currentFrame :number) :void;
}
class MovingAnime extends Anime {
    targets :MovingTarget[];
    dx :number;
    dy :number;
    constructor(req :MovingRequest) {
        super(ANIME_FRAMES - 1);
        this.targets = req.targets;
        this.dx = req.pdx / ANIME_FRAMES;
        this.dy = req.pdy / ANIME_FRAMES;
        this.targets.forEach(t => t.move(this.dx, this.dy));
    }
    override running() {
        this.targets.forEach(t => t.move(this.dx, this.dy));
    }
}
class NGAnime extends Anime {
    constructor(private req :NGRequest) {
        super(3);
    }

    override running(currentFrame :number) {
        if (currentFrame % 2 === 0) {
            this.req.targets.forEach(t => t.move(this.req.dPos.x, this.req.dPos.y));
        } else {
            this.req.targets.forEach(t => t.move(0, 0));
        }
    }
}

type Action = () => void;

const animeManager = new class {
    queue :Anime[] = [];
    finalize ?:Action;

    runAnime() {
        if (this.queue.length) {
            const temp :(Anime|undefined)[] = this.queue;
            this.queue.forEach((ma, index) => {
                const result = ma.run();
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

setInterval(() => animeManager.runAnime(), 100);

export function addMovingAnimeQueue(req :MovingRequest) {
    const ma = new MovingAnime(req);
    ma.run();
    animeManager.queue.push(ma);
}
export function addNGAnimeQueue(req :NGRequest) {
    const ma = new NGAnime(req);
    ma.run();
    animeManager.queue.push(ma);
}
export function addAnimeQueueFinally(action :Action) {
    animeManager.finalize = action
}
