import { FieldPart } from "../init/partsFactory";
import { Pos } from "../types";

const ANIME_FRAMES = 10;
interface MovingReqyest {
    from :Pos;
    to :Pos;
    target :FieldPart;
}
class MovingAnime {
    target :FieldPart
    dx :number;
    dy :number;
    currentPPos :Pos;
    current :number;
    constructor(req :MovingReqyest) {
        this.target = req.target;
        this.dx = (req.to.x - req.from.x) / ANIME_FRAMES;
        this.dy = (req.to.y - req.from.y) / ANIME_FRAMES;
        this.current = 0;
        this.currentPPos = { x: req.from.x, y: req.from.y };
    }
    running() {
        this.currentPPos.x += this.dx;
        this.currentPPos.y += this.dy;
        this.target.canvas.style.left = `${this.currentPPos.x}px`;
        this.target.canvas.style.top = `${this.currentPPos.y}px`;
        this.current ++;
        if (this.current < ANIME_FRAMES) {
            return false;
        } else {
            return true;
        }
    }
}

const movingAnimeManager = new class {
    queue :MovingAnime[] = [];
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
        }
    }
};
//export function init() {
setInterval(() => movingAnimeManager.runMovingAnime(), 0.02);
//}
export function addAnimeQueue(req :MovingReqyest) {
    const ma = new MovingAnime(req);
    ma.running();
    movingAnimeManager.queue.push(ma);
}
