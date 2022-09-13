import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { Killable } from "../behaviours/Killable";

export class Enemy extends Character {
    constructor(x: number, y: number) {
        super(x, y, 68, 39, new Sprite("graphics/enemy", 4, 12));
        this.facing = "LEFT";
        //this.collisionWidth = 28;
    }

    public async onTick(gameState: Game) {
        super.onTick(gameState);
        
        this.velocityX = 2;

        if (gameState.player.center.x < this.center.x) {
            this.velocityX *= -1;
        }

        if (this.collidesWith(gameState.player)) {
            gameState.player.hasBehaviour(Killable.name, (killable: Killable) => {
                killable.kill(this);
            });
        }
    }
}





