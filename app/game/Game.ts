import {Controls} from "./Controls";
import {Sounds} from "./Sounds";
import {Player} from "./entities/Player";
import {Playfield} from "./entities/Playfield";
import {Level1} from "./levels/Level1";
import {SaveFile} from "./SaveFile";
import {Ghost} from "./entities/Ghost";
import {IDrawable, isDrawable} from "./behaviours/IDrawable";
import {GameConfiguration} from "./GameConfiguration";

export class Game {
    public finished: boolean;
    public controls: Controls;
    public sounds: Sounds;
    public playfield: Playfield;
    public player: Player;

    public configuration: GameConfiguration;

    private timer: any;
    //private timerStart: number;
    private timerLast: number;

    private startedAt: Date;
    private saves: SaveFile[];
    private ghosts: Ghost[];

    public playerName: string;

    private gameStartCallback: () => void;
    private gameTickCallback: (game: Game) => void;
    private gameEndCallback: ((reason: string, data: SaveFile) => void);
    
    private schedule: Scheduler;

    constructor(config: GameConfiguration) {
        this.configuration = config;

        this.finished = false;
        this.controls = new Controls();
        this.sounds = new Sounds(config.playSound);

        this.playfield = new Playfield(this, config.width, config.height);
        this.player = null;
        this.saves = [];
        this.ghosts = [];
        this.schedule = new Scheduler();

        this.gameStartCallback = () => {};
        this.gameTickCallback = (_) => {};
        this.gameEndCallback = (_, __) => {};
        this.controls.connect(this);
    }

    setPlayerName(playerName: string) {
        this.playerName = playerName;
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
            /*this.timer = undefined;
            this.timerStart = undefined;
            this.timerLast = undefined;*/
        }

        this.startedAt = new Date();
        this.schedule = new Scheduler();

        this.ghosts = this.saves.map(x => new Ghost(x));
        this.player = new Player();
        
        await this.player.init();
        await this.playfield.init(new Level1());
        for (const ghost of this.ghosts) {
            await ghost.init();
        }
        
        this.sounds.backgroundMusic();
        
        this.gameStartCallback();

        this.triggerGameLoop();
    }

    public stop(message: { reason: string }) {
        this.finished = true;
        
        console.log("Game ended:", message.reason);
        window.clearTimeout(this.timer);

        const save = this.player.saveFile;
        save.playtime = Date.now() - this.startedAt.getTime();
        save.completed = message.reason !== "dead";
        save.playerName = this.playerName;

        this.gameEndCallback(message.reason, this.player.saveFile);
    }

    public onGameStart(cb: () => void) {
        this.gameStartCallback = cb;
    }

    public onGameTick(cb: (game: Game) => void) {
        this.gameTickCallback = cb;
    }

    public onGameEnd(cb: (reason: string, data: SaveFile) => void) {
        this.gameEndCallback = cb;
    } 

    public get elapsed(): number { 
        return Date.now() - this.startedAt.getTime();
    }

    public async loop() {
        if (this.finished) {
            return;
        }
        
        const elapsed = this.elapsed;

        if (!this.player.isAlive) {
            this.schedule.scheduleTaskOnce(1000, (state: Game) => state.stop({ reason: "dead" }));
        }

        await this.schedule.executeScheduledTasks(this);

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
            try {
                entity.draw(this);
            } catch (e) {
                console.error("Failed to draw sprite", e);
            }
        }

        this.gameTickCallback(this);
    }

    private triggerGameLoop() {
        this.timer = window.setInterval(async () => {
            await this.loop();
        }, 1000 / 45);
    }

}

class Scheduler {    
    private schedule: ScheduledTask[];
    private tasksThatHaveBeenScheduled: string[];

    constructor() {
        this.schedule = [];
        this.tasksThatHaveBeenScheduled = [];
    }

    public async executeScheduledTasks(gameState: Game) {
        const time = Date.now();

        const tasks = this.schedule.filter(x => x.time <= time);
        this.schedule = this.schedule.filter(x => x.time > time);

        for (const task of tasks) {
            await task.callback(gameState);
        }
    }

    public scheduleTaskOnce(millisecondsInFuture: number, cb: (game: Game) => void) {
        if (this.tasksThatHaveBeenScheduled.includes(cb.toString())) {
            return;
        }

        this.scheduleTask(millisecondsInFuture, cb);
    }

    public scheduleTask(millisecondsInFuture: number, cb: (game: Game) => void) {
        const scheduledTime = Date.now() + millisecondsInFuture;

        this.tasksThatHaveBeenScheduled.push(cb.toString());

        this.schedule.push({
            time: scheduledTime,
            callback: cb
        });
    }
}

interface ScheduledTask {
    time: number;
    callback: (game: Game) => void;
}
