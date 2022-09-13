import { lzw_encode, lzw_decode, SaveFile } from "../SaveFile";
import { IGhostRepository } from "./IGhostRepository";

export class LocalStorageGhostRepository implements IGhostRepository {
    private callback: ((ghost: SaveFile) => void);

    constructor() {
    }

    public async getGhosts(): Promise<SaveFile[]> {
        const save = SaveFile.fromJson(lzw_decode(localStorage.getItem("save")));
        return [save];
    }

    public saveGhost(data: SaveFile): void {
        const str = JSON.stringify(data);
        const encoded = lzw_encode(str);

        localStorage.setItem("save", encoded);
        this.callback(data);
    }

    public onGhostAdded(callback: (ghost: SaveFile) => void) {
        this.callback = callback;
        this.getGhosts().then(x => x.forEach(callback));
    }
}
