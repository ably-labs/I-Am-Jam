import { ImageHelpers } from "../animation/ImageHelpers";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";
import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class ImageAsset extends EntityBase implements IDrawable, IInitialisable {

    public filename: string;

    private texture: HTMLImageElement;

    constructor(x: number, y: number, filename: string, zIndex: number = 0, width: number = -1, height: number = -1) {
        super(x, y, width, height);
        this.filename = filename;   
        this.zIndex = zIndex; 
    }

    public async init() {
        this.texture = await ImageHelpers.load("/" + this.filename);
        this.width = this.width == -1 ? this.texture.width : this.width;
        this.height = this.height == -1 ? this.texture.height : this.height;
    }

    public async beforeTick(gameState: Game): Promise<void> { 
    }

    public async onTick(gameState: Game) {
    }
    
    public draw(gameState: Game): void {
        this.drawImage(gameState, this.texture);
    }
}


