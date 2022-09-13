import { Game } from "../Game";
import { IDrawable, isDrawable } from "../behaviours/IDrawable";
import { isTickable, ITickable } from "../behaviours/ITickable";
import { Playfield } from "../entities/Playfield";
import { isInitialisable } from "../behaviours/IInitilisable";
import { EntityBase } from "../entities/EntityBase";

export abstract class Level {
    public foregroundUrl: string;
    public collisionUrl: string;

    private entityRegistrations: EntityRegistration[];
    public get entities() { return this.entityRegistrations.map(x => x.entity); }

    constructor(foregroundUrl: string, collisionUrl: string) {
        this.foregroundUrl = foregroundUrl;
        this.collisionUrl = collisionUrl;
        this.entityRegistrations = [];
    }

    abstract onPreStart(level: Playfield): Promise<void>;
    abstract onStart(gameState: Game, level: Playfield): Promise<void>;
    abstract onTick(gameState: Game): Promise<void>;

    public async initilise() {        
        for (const entity of this.entities) {
            if (isInitialisable(entity)) {
                await entity.init();
            }
        }
    }

    protected addEntity(entity: GamePlayEntity, activationCondition: EntityActivationCallback = activateWhenOnScreen) {
        const entityRegistration = {
            entity: entity,
            activationCondition: activationCondition
        };
        
        this.entityRegistrations.push(entityRegistration);
    }

    public tick(gameState: Game): void {        
        for (const { entity, activationCondition } of this.entityRegistrations) {            
            if (activationCondition(gameState, entity) && isTickable(entity)) {
                entity.tick(gameState);
            }
        }

        this.onTick(gameState);
    }        
}

export type GamePlayEntity = ITickable | IDrawable;
export type EntityActivationCallback = (gameState: Game, entity: GamePlayEntity) => boolean;
export type EntityRegistration = {
    entity: GamePlayEntity;
    activationCondition: EntityActivationCallback;
};

export function alwaysActivate(gameState: Game, entity: EntityBase) {
    return true;
}

export function activateWhenOnScreen(gameState: Game, entity: EntityBase): boolean {
    return isDrawable(entity) 
            ? entity.x < gameState.playfield.cameraXposition + gameState.playfield.width 
            : alwaysActivate(gameState, entity);
}

export const activateWhenNearPlayer = (activateWhenDistanceFromPlayerIs(800));

export function activateWhenDistanceFromPlayerIs(distance: number) {
    return (gameState: Game, entity: EntityBase) => {

        const distanceFromPlayer = Math.abs(gameState.player.x - entity.x);

        return isDrawable(entity) 
                ? distanceFromPlayer <= distance
                : alwaysActivate(gameState, entity);
    }
}
