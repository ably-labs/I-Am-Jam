import { IInitialisable } from "../behaviours/IInitilisable";
import { ITickable } from "../behaviours/ITickable";
import { Game } from "../Game";
import { Direction, EntityBase } from "../entities/EntityBase";
import { ImageHelpers } from "./ImageHelpers";
import { Playfield } from "../entities/Playfield";
import { PhysicsObject } from "../entities/PhysicsObject";

export type ValidFrameId = number | "auto" | "stopped";

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
    
    public async tick(gameState: Game) {
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

    public draw(playfield: Playfield, entity: EntityBase, frameId: ValidFrameId = "auto", isDebug = false) {   
        const ctx = playfield.ctx;
        
        let targetFrameId = frameId == "auto" ? this.currentFrameId : frameId;
        targetFrameId = frameId == "stopped" ? 0 : targetFrameId;
        const targetFrame = this.frames[targetFrameId];
        
        const { x, y } = playfield.camera.toCanvasPosition(entity.x, entity.y, entity);

        if (isDebug) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "green";
            ctx.rect(x, y, entity.width, entity.height);
            ctx.stroke();

            if (entity as PhysicsObject) {
                const physicsObject = entity as PhysicsObject;

                const collisionPoints = [
                    ...physicsObject.environmentCollisionPoints(),
                    ...physicsObject.entityCollisionPoints()
                ]

                for (const point of collisionPoints) {
                    const { x, y } = playfield.camera.toCanvasPosition(point.x, point.y);

                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "red";
                    ctx.rect(x, y, 1, 1);
                    ctx.stroke();
                }
            }

            return;
        }
            
        ctx.drawImage(targetFrame, x, y, entity.width, entity.height); 
    }
}
