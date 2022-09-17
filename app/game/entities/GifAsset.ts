import SuperGif from "../animation/libgif";
import { ImageHelpers } from "../animation/ImageHelpers";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";
import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class GifAsset extends EntityBase implements IDrawable, IInitialisable {

    public filename: string;

    private _gif: HTMLCanvasElement;

    private static GifCache = new Map<string, HTMLCanvasElement>();

    constructor(x: number, y: number, filename: string, zIndex: number = 0) {
        super(x, y, 0, 0);
        this.filename = filename;   
        this.zIndex = zIndex; 
    }

    public async init() {         
        if (GifAsset.GifCache.has(this.filename)) {
            this._gif = GifAsset.GifCache.get(this.filename);
            return;
        }

        const image = await ImageHelpers.load("/" + this.filename);
        const gif = SuperGif({gif: image});
        await new Promise((res) => {
            gif.load(() => {
                res(gif);
            });
        });

        this._gif = gif.get_canvas();

        this.width = this._gif.width;
        this.height = this._gif.height;

        GifAsset.GifCache.set(this.filename, this._gif);        
    }

    public async beforeTick(gameState: Game): Promise<void> { 
    }

    public async onTick(gameState: Game) {
    }
    
    public draw(gameState: Game): void {
        this.drawImage(gameState, this._gif);
    }
}
