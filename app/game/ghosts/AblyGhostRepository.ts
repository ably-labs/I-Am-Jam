import { SaveFile, lzw_encode, lzw_decode } from "../SaveFile";
import Ably from "ably";
import { IGhostRepository } from "./IGhostRepository";

export class AblyGhostRepository implements IGhostRepository {
    private readonly ghosts: SaveFile[];
    private channel: any;
    private callback: ((ghost: SaveFile) => void);

    constructor() {
        this.ghosts = [];

        const ably = new Ably.Realtime({ authUrl: "/api/ably-token-request" });
        this.channel = ably.channels.get("[?rewind=10]ghosts");
        
        this.channel.subscribe("ghost", (message: any) => {
            const decoded = lzw_decode(message.data.encoded);
            const save = SaveFile.fromJson(decoded);
            this.ghosts.push(save);
            this.callback(save);
        });
    }

    public async bufferGhosts(timeToWait: number = 1000) {
        // Glorified thread sleep to let ably rewind happen.
        await new Promise(resolve => setTimeout(resolve, timeToWait));
        return this;
    }
        
    public async getGhosts(): Promise<SaveFile[]> {
        return this.ghosts;
    }

    public saveGhost(data: SaveFile): void {
        const str = JSON.stringify(data);
        const encoded = lzw_encode(str);
        this.channel.publish("ghost", { encoded });
    }

    public onGhostAdded(callback: (ghost: SaveFile) => void) {
        this.callback = callback;
    }
}
