import { Game } from "../Game";
import { ITickable } from "../behaviours/ITickable";
import { Killable } from "../behaviours/Killable";
import { PhysicsObject } from "./PhysicsObject";
import { Sprite } from "../animation/Sprite";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";

export class Character extends PhysicsObject implements ITickable, IDrawable, IInitialisable {

    private runningSprite: Sprite;
    private get currentSprite() { return this.runningSprite; }

    constructor(x: number, y: number, width: number, height: number, runningSprite: Sprite) {
        super(x, y, width, height);
        this.addBehaviour(Killable.name, new Killable(this));
        this.runningSprite = runningSprite;
    }

    public async init() {
        await this.runningSprite.init();
    }

    public async onTick(gameState: Game) {
        super.onTick(gameState);        
        this.currentSprite.tick(gameState);
        this.runningSprite.setDirection(this.facing);
    }

    public draw(gameState: Game) {
        if (!this.isAlive || !this.runningSprite) { 
            return; 
        }

        var screenX = this.x - gameState.playfield.cameraXposition;
        screenX = screenX > this.x ? this.x : screenX;

        if (gameState.playfield.atLevelEnd()) {
            screenX = (gameState.playfield.width - (gameState.playfield.map.width - gameState.playfield.cameraXposition - (this.x - gameState.playfield.cameraXposition)));
        }

        if (this.isJumping || this.isFalling) {      
            this.currentSprite.drawFrameNumber(gameState, 3, screenX, this.y, this.height, this.width, gameState.playfield.ctx);
        } else if (this.isMoving) {
            this.currentSprite.draw(gameState, screenX, this.y, this.height, this.width, gameState.playfield.ctx);
        } else {
            this.currentSprite.drawFrameNumber(gameState, 0, screenX, this.y, this.height, this.width, gameState.playfield.ctx);
        }
    }

    public get isAlive() {
        return this.behaviour<Killable>(Killable.name)?.isAlive;
    }
}
