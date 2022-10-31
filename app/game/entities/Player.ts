import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { SaveFile } from "../SaveFile";

export class Player extends Character {
    public saveFile: SaveFile;

    constructor() {
        super(360, 300, 30, 30, new Sprite("graphics/player", 5), new Sprite("graphics/dead", 9, 5, false));
        this.saveFile = new SaveFile();
    }

    // noinspection JSUnusedGlobalSymbols
    public teleport(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public async onTick(gameState: Game) {
        if (gameState.playfield.isGoal(this.center.x, this.center.y) && this.standingOnAPlatform(gameState)) {
            gameState.stop({ reason: "completed" });
            return;
        }

        this.processControls(gameState);
        await super.onTick(gameState);

        this.saveFile.push(this.x, this.y);
    }

    private processControls(game: Game) {
        const bonusSpeed = game.controls.run ? 2 : 0;
        const bonusHeight = game.controls.extraHeight ? 5 : 0;

        if (game.controls.right) {
            this.velocityX = 5 + bonusSpeed;
        }

        if (game.controls.left) {
            this.velocityX = -5 - bonusSpeed;
        }

        if (!game.controls.left && !game.controls.right) {
            this.velocityX = 0;
        }

        if (game.controls.down) {
            this.velocityY += -5;
        }

        if (game.controls.jump && this.standingOnAPlatform(game)) {
            this.velocityY = 20 + bonusSpeed + bonusHeight;
            game.sounds.jump();
        }
    }
}
