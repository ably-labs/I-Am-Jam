import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { Killable } from "../behaviours/Killable";

export class Enemy extends Character {
    
    private coolOffTickCounter = 0;
    private _lastXy = { x: 0, y: 0 };

    constructor(x: number, y: number) {
        super(x, y, 68, 39, new Sprite("graphics/enemy", 7, 5));
 
        // Let's not have the mouse tail colliding
        this.environmentCollisionOffsets = [];
        for (let x = 34; x < this.width; x++) {
            this.environmentCollisionOffsets.push({ x: x, y: 0 });
        }

        this.entityCollisionOffsets.push({ x: 60, y: 20 });
        
        this.facing = "LEFT";
        this.velocityX = -4;
    }

    public async onTick(gameState: Game) {
        await super.onTick(gameState);
        this.coolOffTickCounter > 0 && this.coolOffTickCounter--;

        if (this.collidesWith(gameState.player) && gameState.player.isAlive) {
            gameState.player.hasBehaviour(Killable.name, (killable: Killable) => {
                killable.kill(this);
            });
        }
        
        this.velocityX = this.facing === "LEFT" ? -4 : 4; 

        const imminentDeath = this.aboutToFall(gameState);
        const stuck = this._lastXy.x === this.x && this._lastXy.y === this.y;

        if (imminentDeath || stuck) {
            this.velocityX *= -1;
            this.coolOffTickCounter = 66;
        }

        this._lastXy = { x: this.x, y: this.y };
    }
}
