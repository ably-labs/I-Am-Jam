import Ably from "ably/promises";
import { Scoreboard } from "./Scoreboard";
import { IHighScoreRepository } from "./IHighScoreRepository";
import { Types } from "ably";

export class AblyHighScoreRepository implements IHighScoreRepository {
    private channel: Types.RealtimeChannelPromise;

    constructor() {
        const ably = new Ably.Realtime({ authUrl: "/api/ably-token-request" });
        this.channel = ably.channels.get("high-scores");
    }

    public async getScoreboard() {
        const history = await this.channel.history();
        const historyPage = history?.items && history.items?.length > 0 ? history.items[0] : null;
        const previousGlobalScores = historyPage?.data || [];
        return new Scoreboard(previousGlobalScores);
    }

    public async updateGlobalScoreboard(name: string, score: number): Promise<Scoreboard> {
        const scoreboard = await this.getScoreboard();
        scoreboard.addRange([{ name, score }]);

        await this.channel.publish("update", scoreboard.scores);
        return scoreboard;
    }
}
