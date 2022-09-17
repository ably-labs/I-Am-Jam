import { Game } from "../Game";
import { IBehaviour } from "../behaviours/IBehaviour";
import { ITickable } from "../behaviours/ITickable";
import { IDrawable } from "../behaviours/IDrawable";

export type Direction = "LEFT" | "RIGHT";

export abstract class EntityBase implements ITickable, IDrawable {
    public id: string;
    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public zIndex: number;

    public facing: Direction;

    public get top() { return this.y + this.height; }
    public get bottom() { return this.y; }

    private behaviours: Map<string, IBehaviour>;

    protected constructor(x: number, y: number, width: number, height: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.zIndex = 0;

        this.facing = "RIGHT";

        this.behaviours = new Map<string, IBehaviour>();
    }

    public async tick(gameState: Game) {
        await this.beforeTick(gameState);

        for (const [key, behaviour] of this.behaviours.entries()) {
            const response = await behaviour.act(gameState);

            if (response === undefined) {
                continue;
            }
            
            if (response === false) {
                return;
            }
        }

        this.onTick(gameState);
    }

    abstract beforeTick(gameState: Game): Promise<void>;
    abstract onTick(gameState: Game): Promise<void | CallableFunction | false>;
    abstract draw(gameState: Game): void;

    protected clearBehaviours() {
        this.behaviours.clear();
    }

    public addBehaviour(key: string, behaviour: IBehaviour) {
        this.behaviours.set(key, behaviour);
    }

    public behaviour<T = any>(key: string) {
        return this.behaviours.get(key) as unknown as T;
    }

    public hasBehaviour(key: string, callback: (behaviour: IBehaviour) => void) {
        if (this.behaviours.has(key)) {
            callback(this.behaviours.get(key));
        }
    }

    protected drawImage(
        gameState: Game, 
        image: HTMLImageElement | HTMLCanvasElement, 
        x: number = this.x, 
        y: number = this.y
    ): void {
        if (!image) {
            console.log("Call to drawImage with null image")
            return;
        }

        const position = gameState.playfield.camera.toCanvasPosition(x, y, image.height);
        gameState.playfield.ctx.drawImage(image, position.x, position.y);
    }
}
