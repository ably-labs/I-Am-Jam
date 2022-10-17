import Ably from "ably/promises";
import { Types } from "ably";
import { Game } from "../Game";

export interface StateMessage {
    id: string;
    name: string;
    x: number;
    y: number;
    elapsed: number;
    isAlive: boolean;    
}

export class AblySpectatorConnector {
    private channel: Types.RealtimeChannelPromise;
    private lastState: string;

    constructor(ably: Ably.Realtime = null) {
        ably = ably || new Ably.Realtime({ authUrl: "/api/ably-token-request" });
        this.channel = ably.channels.get("active-players");
    }

    public publish(game: Game) {
        const metadata = {
            id: game.player.id,
            name: game.playerName,
            x: game.player.x, 
            y: game.player.y,
            isAlive: game.player.isAlive
        };

        const stateString = JSON.stringify(metadata);

        if (this.lastState && this.lastState === stateString) {
            return; // Don't publish the same state twice
        }

        this.channel.publish("state", metadata);
        this.lastState = JSON.stringify(metadata);
    }

    public subscribe(callback: (state: StateMessage) => void) {
        this.channel.subscribe("state", (message: Types.Message) => {
            callback(message.data as StateMessage);
        });
    }
}
