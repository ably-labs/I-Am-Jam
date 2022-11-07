import { Game } from "../Game";
import { IDrawable } from "../behaviours/IDrawable";
import { ITickable } from "../behaviours/ITickable";
import { Level } from "../levels/Level";
import { debugTimer } from "../metrics/debugTimer";
import { ImageHelpers } from "../animation/ImageHelpers";
import { Camera } from "../Camera";

export class Playfield implements ITickable, IDrawable {   
    public x = 0;
    public y = 0;
    public width = 640;
    public height = 480;
    public zIndex = -1;

    public tickCount = 0;    

    public camera: Camera;
    
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;
 
    public map: HTMLImageElement;
    public collisionMap: CanvasRenderingContext2D;
    private collisionMapImage: HTMLImageElement;

    public level: Level;
    private parent: Game;

    constructor(gameState: Game, width = 640, height = 480) {
        this.parent = gameState;
        this.width = width;
        this.height = height;
        this.zIndex = -100;
        
        this.canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.canvas.setAttribute("id", "game-canvas");
        this.canvas.setAttribute("width", width + "px");
        this.canvas.setAttribute("height", height + "px");
        this.ctx = this.canvas.getContext("2d");

        this.camera = new Camera(this);
    }

    public async init(level: Level = this.level) {
        this.level = level;
        this.camera.reset();
        this.tickCount = 0;
        
        this.writeText("Loading...");

        await this.loadLevelData(level);

        await debugTimer("onPreStart",  async () => await level.onPreStart(this));
        await debugTimer("initilise",   async () => await level.initilise());
    }

    public async tick(gameState: Game) {
        if (this.tickCount === 0) {
            await debugTimer("onStart", async () => await this.level.onStart(gameState, this));
        }

        this.tickCount++;
        this.camera.move(gameState.player.velocityX);
        await this.level.tick(gameState);
    }

    private async loadLevelData(level: Level) {
        this.map = new Image();
        this.map.src = level.foregroundUrl;
        
        const image = this.collisionMapImage = await ImageHelpers.load(level.collisionUrl);

        const hiddenCanvas = document.createElement("CANVAS") as HTMLCanvasElement;
        hiddenCanvas.setAttribute("width", image.width + "px");
        hiddenCanvas.setAttribute("height", image.height + "px");

        this.collisionMap = hiddenCanvas.getContext("2d", { willReadFrequently: true });
        this.collisionMap.drawImage(image, 0, 0);
    }

    public isSolidSurface(x: number, y: number) { return this.getPixelType(x, y) == "#"; }
    public isPit(x: number, y: number) { return this.getPixelType(x, y) == "pit"; }
    public isGoal(x: number, y: number) { return this.getPixelType(x, y) == "exit"; }

    public getPixelType(x: number, y: number) {
        if (!this.collisionMap) { 
            return "#"; 
        }

        const flippedY = this.height - y;
        const mapData = this.collisionMap.getImageData(x, flippedY, 1, 1);
        const rawData = mapData.data;
        const mask = rawData[0] + " " + rawData[1] + " " + rawData[2] + " " + rawData[3];

        if (mask == "255 0 0 255")
            return "pit";

        if (mask == "0 255 0 255")
            return "exit";

        if (mask == "255 255 255 255")
            return ".";

        if (mask == "0 0 0 255")
            return "#";
        
        if (y >= this.height)
            return ".";

        return "#";
    }

    public levelEndOffset() { return this.map.width - this.width; }
    public atLevelEnd() { return this.camera.position >= this.levelEndOffset(); }

    public writeText(text: string, x: number = 0, y: number = 0) {
        this.ctx.font = "30px Arial";

        const textWidth = this.ctx.measureText(text).width;
        const textX = (this.width / 2) - (textWidth / 2);
        const textY = (this.height / 2) - 15;

        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, textX, textY);

    }

    public draw(gameState: Game) {
        let drawAtX = this.camera.position * -1;
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        drawAtX = this.atLevelEnd() ? this.levelEndOffset() * -1 : drawAtX;

        const visual = this.parent.configuration.debug ? this.collisionMapImage : this.map;

        this.ctx.drawImage(visual, drawAtX, 0);
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.setAttribute("width", width + "px");
        this.canvas.setAttribute("height", height + "px");
    }
}
