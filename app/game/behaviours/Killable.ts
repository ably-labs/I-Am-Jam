import { Game } from "../Game";
import { EntityBase } from "../entities/EntityBase";
import { IBehaviour } from "./IBehaviour";
import { PhysicsObject } from "../entities/PhysicsObject";

export class Killable implements IBehaviour {
    public id: string;
    public isAlive: boolean;
    private entity: PhysicsObject;

    constructor(parent: EntityBase) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.entity = parent as PhysicsObject;
        this.isAlive = true;
    }

    public async act(gameState: Game) {
        if (!this.isAlive) {
            return false; // short circuit the rest of the behaviours and end ticking this entity
        }

        if (gameState.playfield.isPit(this.entity.leadingEdge, this.entity.bottom)) {
            this.kill(this);
            return false;
        }
    }

    public kill(killer: EntityBase | IBehaviour) {
        if (killer) {
            console.log(this.entity?.constructor?.name, this.entity.id, "was killed by", killer?.constructor?.name, killer.id);
        } else {
            console.log(this.entity?.constructor?.name, this.entity.id, "was killed by the unknown?!?");
        }

        this.isAlive = false;
        this.entity.velocityX = 0;
        this.entity.velocityY = 0;
    }
}
