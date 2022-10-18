import { EntityBase } from "./entities/EntityBase";
import { Playfield } from "./entities/Playfield";

export class Camera {

    private _xPosition: number;
    private playfield: Playfield;

    public get position() {
        return this._xPosition;
    }

    constructor(playfield: Playfield) {
        this.playfield = playfield;
        this._xPosition = 0;
    }

    public move(x: number) {
        this._xPosition += x;
    }

    public reset() {
        this._xPosition = 0;
    }

    public isInRange(entity: EntityBase) {
        return entity.x > this._xPosition - (this.playfield.width * 2) && entity.x < this._xPosition + (this.playfield.width * 2);
    }

    public toCanvasPosition(x: number, y: number, entityOrHeight?: EntityBase | number) {
        let canvasX = x - this._xPosition;
        canvasX = canvasX > x ? x : canvasX;

        const height = entityOrHeight instanceof EntityBase ? entityOrHeight.height : <number>entityOrHeight;
        const yOffset = height || 0;
        const canvasY = this.playfield.height - y - yOffset;

        if (this.playfield.atLevelEnd()) {
            canvasX = (this.playfield.width - (this.playfield.map.width - this._xPosition - (x - this._xPosition)));
        }

        return {
            x: canvasX,
            y: canvasY
        }
    }

    public setTargetContainer(container: HTMLDivElement) {
        container.appendChild(this.playfield.canvas);
    }
}