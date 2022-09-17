import { Controls } from "./Controls";
import { Sounds } from "./Sounds";
import { Player } from "./entities/Player";
import { Playfield } from "./entities/Playfield";
import { Level1 } from "./levels/Level1";
import { SaveFile } from "./SaveFile";
import { Ghost } from "./entities/Ghost";
import { IDrawable, isDrawable } from "./behaviours/IDrawable";

export class Game {
    public finished: boolean;
    public controls: Controls;
    public sounds: Sounds;
    public playfield: Playfield;
    public player: Player;
    
    public debug: boolean;

    private timer: any;

    private saves: SaveFile[];
    private ghosts: Ghost[];

    private gameEndCallback: ((reason: string, data: SaveFile) => void);

    constructor(width: number = 640, height: number = 480) {
        this.debug = false;
        this.finished = false;
        this.controls = new Controls();
        this.sounds = new Sounds(false);

        this.playfield = new Playfield(this, width, height);
        this.player = null;
        this.saves = [];
        this.ghosts = [];

        this.gameEndCallback = (_, __) => {};
        this.controls.connect(this);
    }

    public addGhost(save: SaveFile) {
        this.saves.push(save);

        if (this.saves.length > 5) {
            this.saves.shift();
        }
    }

    public async start() {
        if (this.timer) {
            this.finished = false;
            window.clearTimeout(this.timer);
        }

        this.ghosts = this.saves.map(x => new Ghost(x));

        this.player = new Player();
        
        await this.player.init();
        await this.playfield.init(new Level1());
        for (const ghost of this.ghosts) {
            await ghost.init();
        }
        
        this.sounds.backgroundMusic();

        await this.loop();
    }

    public stop(message: { reason: string }) {
        this.finished = true;
        console.log("Game ended:", message.reason);
        window.clearTimeout(this.timer);

        this.gameEndCallback(message.reason, this.player.saveFile);
    }

    public onGameEnd(cb: (reason: string, data: SaveFile) => void) {
        this.gameEndCallback = cb;
    } 

    public async loop() {
        if (this.finished) {
            return;
        }

        if (!this.player.isAlive) {
            this.stop({ reason: "dead" });
        }

        await this.playfield.tick(this);
        await this.player.tick(this);
        this.ghosts.forEach(x => x.tick(this));

        let potentialDrawables = [
            this.playfield,
            this.player,
            ...this.ghosts,
            ...this.playfield.level.entities
        ].filter(x => isDrawable(x));
        
        const orderedDrawables 
            = potentialDrawables.map<IDrawable>(x => x as IDrawable)
                                .sort((a, b) => a.zIndex - b.zIndex);

        for (const entity of orderedDrawables) {
            entity.draw(this);
        }

        this.timer = window.setTimeout(async () => {
            await this.loop();
        }, 1000 / 60);
    }
}
