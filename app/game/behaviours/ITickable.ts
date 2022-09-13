import { Game } from "../Game";

export interface ITickable {
    tick(gameState: Game): Promise<void>;
}

export function isTickable(obj: any): obj is ITickable {
    return "tick" in obj;
}