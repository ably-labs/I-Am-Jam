import { Game } from "../Game";
import { ITickable } from "../behaviours/ITickable";
import { PhysicsObject } from "./PhysicsObject";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";
import { Killable } from "../behaviours/Killable";
import { ImageHelpers } from "../animation/ImageHelpers";

export class Toast extends PhysicsObject implements ITickable, IDrawable, IInitialisable {
    private texture: HTMLImageElement;
    private toasterFront: HTMLImageElement;

    private rattleCoolOff: number = 0;
    private coolOffTickCounter = 0;
    
    private readonly initialX: number;
    private readonly initialY: number;

    constructor(x: number, y: number) {
        super(x, y, 12, 76);
        this.initialX = x;
        this.initialY = y;
    }

    public async init(): Promise<void> {
        this.texture = await ImageHelpers.load("/toast.1.png");
        this.toasterFront = await ImageHelpers.load("/toast.resting.png");

        if (this.width === -1) {
            this.width = this.texture.width;
        }

        if(this.height === -1) {
            this.height = this.texture.height;
        }
    }

    public async onTick(gameState: Game) {   
        await super.onTick(gameState);

        this.coolOffTickCounter > 0 && this.coolOffTickCounter--;
        this.rattleCoolOff > 0 && this.rattleCoolOff--;

        const distanceFromPlayer = Math.abs(gameState.player.x - this.x);
        
        if (distanceFromPlayer < 300 && this.velocityY == 0 && this.rattleCoolOff === 0) {
            this.velocityY += 5;
            this.rattleCoolOff = 10;
        }        

        if (distanceFromPlayer < 100 && this.coolOffTickCounter === 0) {
            this.velocityY += 30;
            this.coolOffTickCounter = 99;
        }

        if (this.collidesWith(gameState.player, true)) {
            gameState.player.hasBehaviour(Killable.name, (killable: Killable) => {
                killable.kill(this);
            });
        }
    }    

    public draw(gameState: Game) {
        this.drawImage(gameState, this.texture);
        this.drawImage(gameState, this.toasterFront, this.initialX, this.initialY);
    }
}
