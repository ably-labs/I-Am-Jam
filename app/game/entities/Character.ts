import { Game } from "../Game";
import { ITickable } from "../behaviours/ITickable";
import { Killable } from "../behaviours/Killable";
import { PhysicsObject } from "./PhysicsObject";
import { Sprite, ValidFrameId } from "../animation/Sprite";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";

export class Character extends PhysicsObject implements ITickable, IDrawable, IInitialisable {

    protected sprite: Sprite;
    protected deadSprite: Sprite;

    constructor(x: number, y: number, width: number, height: number, sprite: Sprite, deadSprite: Sprite = null) {
        super(x, y, width, height);
        this.addBehaviour(Killable.name, new Killable(this));
        this.sprite = sprite;
        this.deadSprite = deadSprite;
    }

    public async init() {
        await this.sprite.init();
        await this.deadSprite?.init();
    }

    public async onTick(gameState: Game) {
        await super.onTick(gameState);
        await this.sprite.tick(gameState);
        this.sprite.setDirection(this.facing);
    }

    public draw(gameState: Game) {
        var { playfield, configuration } = gameState;

        if (!this.sprite) {
            return;
        }

        let frameId: ValidFrameId;
        if (this.isJumping || this.isFalling) {
            frameId = 3;
        } else if (this.isMoving) {
            frameId = "auto";
        } else if(!this.isAlive) {
            frameId = "auto";
        } else {
            frameId = "stopped";
        }

        if (this.isAlive) {
            this.sprite.draw(playfield, this, frameId, configuration.debug);   
        } else if (this.deadSprite) {
            this.deadSprite.tick(gameState);
            this.deadSprite.draw(playfield, this, "auto", configuration.debug);
        }     
    }

    public get isAlive() {
        return this.behaviour<Killable>(Killable.name)?.isAlive;
    }
}
