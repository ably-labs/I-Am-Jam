import { Game } from "../Game";

export interface IBehaviour {
    id: string;
    act(gameState: Game): Promise<void | boolean>;
}
