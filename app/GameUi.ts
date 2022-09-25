import { SaveFile } from "./game/SaveFile";
import { AblyGhostRepository } from "./game/ghosts/AblyGhostRepository";
import { Game } from "./game/Game";
import {GameConfiguration} from "./game/GameConfiguration";

const gameUi = document.getElementById("game") as HTMLDivElement;
const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;
gameUi.style.display = "none";

const configuration: GameConfiguration = {
    width: window.innerWidth - 20,
    height: 552,
    debug: debugCheckbox.checked,
    playSound: false
};

export async function createGameUi() {
    const game = new Game(configuration);

    const ghostRepo = new AblyGhostRepository().onGhostAdded((ghost: SaveFile) => {
        game.addGhost(ghost);
    });

    if (ghostRepo.bufferGhosts) {
        await ghostRepo.bufferGhosts();
    }

    game.onGameEnd((reason: string, data: SaveFile) => {
        console.log("Game ended:", reason, data);
        console.log("Recorded", data, "frames of input");
        ghostRepo.saveGhost(data);
    });

    debugCheckbox.addEventListener("change", (value: any) => {
        game.configuration.debug = value.target.checked;
    });

    game.playfield.camera.setTargetContainer(container);

    const startGameFunction = (playerName: string) => {
        gameUi.style.display = "block";
        game.start();
    }

    return startGameFunction;
}