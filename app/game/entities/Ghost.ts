import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { SaveFile } from "../SaveFile";

export class Ghost extends Character {
    private recording: { x: number, y: number }[] = [];
    
    constructor(saveFile: SaveFile) {
        let gX = 0;
        let gY = 0;

        if (saveFile?.recording?.length > 0) {     
            const { x, y } = saveFile.recording[0];
            gX = x;
            gY = y;
        }

        super(gX, gY, 25, 25, new Sprite("graphics/slime", 4));
        this.zIndex = -1;

        this.clearBehaviours();
        this.recording = [...saveFile.recording];
    }

    public async onTick(gameState: Game) {   
        if (this.recording.length > 0) {
            const { x, y } = this.recording.shift();
            this.x = x;
            this.y = y;
        } else {
            // Do something else!
        }
    }

    public get isAlive() {
        return this.recording.length > 0;
    }
}
