import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class PhysicsObject extends EntityBase {
    public velocityX: number;
    public velocityY: number;

    public gravityDistancePerTick: number;
    public weight: number;

    public entityCollisionOffsets = [];
    public environmentCollisionOffsets = [];
    
    constructor(x: number, y: number, width: number, height: number, velX: number = 0, velY: number = 0) {
        super(x, y, width, height);

        this.velocityX = velX;
        this.velocityY = velY;
        this.weight = 12;

        this.gravityDistancePerTick = -8.5;

        if (this.velocityX !== 0) {
            this.facing = this.velocityX > 0 ? "RIGHT" : "LEFT"; 
        }
        
        for (let x = 0; x < this.width; x++) {
            this.environmentCollisionOffsets.push({ x: x, y: 0 });
        }

        this.entityCollisionOffsets = [{ 
            x: this.width / 2,
            y: this.height / 2        
        }];
    }

    public async beforeTick(gameState: Game): Promise<void> {
    }

    public async onTick(gameState: Game) {
        this.applyGravity(gameState);
        await this.applyMovement(gameState);
    }

    public async applyMovement(gameState: Game) {
        let nextX = this.x + this.velocityX;
        let nextY = this.y + this.velocityY;
        const leadingEdge = this.facing == "RIGHT" ? nextX + this.width : nextX;

        const walkingIntoSurface = gameState.playfield.isSolidSurface(leadingEdge, this.top);

        if (this.isMoving && walkingIntoSurface) {
            nextX = this.x;
            this.velocityX = 0;
        }

        nextY = this.ensureFloorBoundaries(gameState, nextX, nextY);

        if (this.collidingUpwards(gameState)) {
            this.velocityY = this.gravityDistancePerTick;
        }

        this.x = Math.floor(nextX);
        this.y = Math.floor(nextY);

        if (this.velocityX !== 0) {
            this.facing = this.velocityX > 0 ? "RIGHT" : "LEFT"; 
        }
    }

    private ensureFloorBoundaries(gameState: Game, nextX: number, nextY: number) {
        let collides = this.collidesFrom(nextX, nextY, gameState);

        let bumps = 0;
        let maxBumps = Math.abs(this.velocityY) * 2;
        
        while (collides) {
            nextY -= 1 * this.verticalDirection;
            this.velocityY = 0;

            collides = this.collidesFrom(nextX, nextY, gameState);
                
            if (bumps >= maxBumps) {
                break;
            }
        }
        
        return nextY;
    }

    private applyGravity(gameState: Game) {
        if (this.isJumping) {
            const resistencePerTick = this.weight / 60;
            this.velocityY += this.gravityDistancePerTick * resistencePerTick;
 
        } else {
            if (this.standingOnAPlatform(gameState)) {
                this.velocityY = 0;
            } else {
                this.velocityY += this.gravityDistancePerTick / 6;
            }
        }
    }

    public collidesWith(other: PhysicsObject, aggressive: boolean = false) {

        for (const point of this.entityCollisionPoints()) {
            if (point.x >= other.x && point.x <= other.x + other.width) {
                if (point.y <= other.top && point.y >= other.bottom) {
                    return true;
                }
            }
        }

        if (aggressive) {
            // check if boxes collide 
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.height + this.y > other.y) {
                return true;
            }
        }

        return false;
    }

    public collidingUpwards(gameState: Game) {
        for (let x = this.x; x < this.x + this.width; x++) {
            if (gameState.playfield.isSolidSurface(x, this.top + 1)) {
                return true;
            }
        }
    }

    public standingOnAPlatform(gameState: Game) {
        const points = this.environmentCollisionPoints();
        for (const point of points) {
            if (gameState.playfield.isSolidSurface(point.x, point.y - 1)) {
                return true;
            }
        }
    }
    
    protected aboutToFall(gameState: Game) {
        const nextX = this.x + this.velocityX;
        const nextY = this.y + this.velocityY;         
        const points = this.environmentCollisionPoints(nextX, nextY);

        for (const point of points) {
            if (!gameState.playfield.isSolidSurface(point.x, point.y - 1)) {
                return true;
            }
        }
    }

    public draw(gameState: Game): void {
        throw new Error("Method not implemented - should be implemented by derived class.");
    }

    public get isMoving() { return this.velocityX != 0; }
    public get isJumping() { return this.velocityY > 0; }
    public get isFalling() { return this.velocityY < 0; }
    public get verticalDirection () { return this.isJumping ? 1 : -1 }

    public get leadingEdge() {
        if (this.facing == "LEFT") {
            return this.x;
        }

        return this.x + this.width;
    }

    public get trailingEdge() {
        if (this.facing == "RIGHT") {
            return this.x;
        }

        return this.x + this.width;
    }

    public get center() {
        return {
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        }
    }
    
    private collidesFrom(x: number, y: number, gameState: Game) {
        const points = this.environmentCollisionPoints(x, y);
        return points.some(point => (gameState.playfield.isSolidSurface(point.x, point.y)));
    }

    public environmentCollisionPoints(x = this.x, y = this.y) {        
        return this.collisionPointsFor(this.environmentCollisionOffsets, x, y);
    }

    public entityCollisionPoints(x = this.x, y = this.y) {
        return this.collisionPointsFor(this.entityCollisionOffsets, x, y);
    }

    private collisionPointsFor(pointsSource: {x: number, y: number }[], x: number, y: number) {        
        return pointsSource.map(offset => ({
            x: this.facing == "RIGHT" ? x + offset.x : x + this.width - offset.x,
            y: y + offset.y
        }));
    }

}
