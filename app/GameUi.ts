import Ably from "ably/promises";
import { SaveFile } from "./game/SaveFile";
import { AblyGhostRepository } from "./game/ghosts/AblyGhostRepository";
import { Game } from "./game/Game";
import {GameConfiguration} from "./game/GameConfiguration";
import { AblyHighScoreRepository } from "./game/highscores/AblyHighScoreRepository";
import { Scoreboard } from "./game/highscores/Scoreboard";
import { AblySpectatorConnector } from "./game/spectating/AblySpectatorConnector";

type onGamestartCallback = () => void;
type onGameEndCallback = (scoreboard: Scoreboard, reason: string) => void;

const gameUi = document.getElementById("game") as HTMLDivElement;
const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;
const gameTimer = document.getElementById("timer") as HTMLDivElement;

gameUi.style.display = "none";

const configuration: GameConfiguration = {
    width: window.innerWidth >= 1000 ? 1000 : window.innerWidth,
    height: 552,
    debug: debugCheckbox.checked,
    playSound: false
};

export async function createGameUi(onGameStart: onGamestartCallback, onGameEnd: onGameEndCallback) {
    const game = new Game(configuration);

    const ably = new Ably.Realtime({ authUrl: "/api/ably-token-request" });

    const spectatorConnector = new AblySpectatorConnector(ably);
    const scoresRepo = new AblyHighScoreRepository(ably);
    const ghostRepo = new AblyGhostRepository(ably).onGhostAdded((ghost: SaveFile) => {
        game.addGhost(ghost);
    });

    if (ghostRepo.bufferGhosts) {
        await ghostRepo.bufferGhosts();
    }

    game.onGameStart(() => {        
        onGameStart();
    });

    game.onGameTick((game: Game) => {
        const timerAsMs = new Date(game.elapsed).toISOString().slice(14, -1);
        gameTimer.innerHTML = timerAsMs;

        spectatorConnector.publish(game);
    });

    game.onGameEnd(async (reason: string, data: SaveFile) => {
        console.log("Game ended:", reason, data);
        console.log("Recorded", data, "frames of input");
        ghostRepo.saveGhost(data);

        const scores = data.completed
            ? await scoresRepo.updateGlobalScoreboard(data.playerName, data.playtime) 
            : await scoresRepo.getScoreboard();

        if (game.finished) {
            onGameEnd(scores, reason);
        }
    });

    debugCheckbox.addEventListener("change", (value: any) => {
        game.configuration.debug = value.target.checked;
    });
        
    window.addEventListener("resize", (event) => {
        configuration.width = window.innerWidth >= 1000 ? 1000 : window.innerWidth;
        configuration.height = 552;
        game.playfield.resize(configuration.width, configuration.height);      
    });


    game.playfield.camera.setTargetContainer(container);

    const startGameFunction = (playerName: string) => {
        gameUi.style.display = "block";
        game.setPlayerName(playerName);
        game.start();

        return game;
    }

    return startGameFunction;
}
