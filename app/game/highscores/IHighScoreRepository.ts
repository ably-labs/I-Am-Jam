import { Scoreboard } from "./Scoreboard";

export interface IHighScoreRepository {
    updateGlobalScoreboard(name: string, score: number): Promise<Scoreboard>;
}

