import { Game } from "../Game";

export interface IDrawable {
    x: number;
    y: number;
    height: number;
    width: number;

    zIndex: number;

    draw(gameState: Game): void;
}

export function isDrawable(obj: any): obj is IDrawable {
    return "draw" in obj;
}