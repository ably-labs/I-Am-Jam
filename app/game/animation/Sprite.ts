import { IInitialisable } from "../behaviours/IInitilisable";
import { ITickable } from "../behaviours/ITickable";
import { Game } from "../Game";
import { Direction } from "../entities/EntityBase";
import { ImageHelpers } from "./ImageHelpers";

export class Sprite implements ITickable, IInitialisable {
    private filePattern: string;
    private frameCount: number;

    private frames: HTMLImageElement[];
    private facing: Direction;
    private currentFrameId: number;
    private delay: number;

    public get firstFrame() { return this.frames[1]; }
    public get currentFrame() { return this.frames[this.currentFrameId]; }
    public get lastFrame() { return this.frames[this.frames.length - 1]; }

    constructor(filePattern: string, frameCount: number, delay: number = 5) {
        this.filePattern = filePattern;
        this.frameCount = frameCount
        this.frames = [];
        this.currentFrameId = 0;
        this.facing = "RIGHT";
        this.delay = delay;
    }
    
    public async init() {
        for (var id = 0; id < this.frameCount; id ++) {
            const pattern = this.filePattern + "." + (id+1) + ".png";

            const cachedResource = await ImageHelpers.load(pattern);
            this.frames[id] = ImageHelpers.clone(cachedResource);
        }

        console.log("loaded all frames", this.filePattern, this.frames);
    }
    
    public async tick(gameState: Game){        
        if (gameState.playfield.tickCount % this.delay == 0) {
            this.currentFrameId++;
        }

        this.currentFrameId = this.currentFrameId == this.frames.length ? 0 : this.currentFrameId
    }

    public setDirection(facing: Direction) {
        if (this.facing === facing) {
            return;
        }

        for (const frame of this.frames) {
            ImageHelpers.mirror(frame);
        }

        this.facing = facing;
    }

    public draw(gameState, x, y, height, width, ctx) {
        this.drawFrameNumber(gameState, this.currentFrameId, x, y, height, width, ctx);
    }

    public drawFrameNumber(gameState, frameId, x, y, height, width, ctx) {
        const canvasY = gameState.playfield.height - y - height;

        if (gameState.debug) {
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "red";
            ctx.rect(x, canvasY, width, height);
            ctx.stroke();
        }        

        ctx.drawImage(this.frames[frameId], x, canvasY, width, height);
    }
}
