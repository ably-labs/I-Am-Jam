import Ably from "ably/promises";
import { AblyHighScoreRepository } from "./game/highscores/AblyHighScoreRepository";
import { Scoreboard } from "./game/highscores/Scoreboard";
import { AblySpectatorConnector, StateMessage } from "./game/spectating/AblySpectatorConnector";

console.log("Hello from spectate.ts");

const ably = new Ably.Realtime({ authUrl: "/api/ably-token-request" });
const connector = new AblySpectatorConnector(ably);
const scoresRepo = new AblyHighScoreRepository(ably);

const guys = document.getElementById("guys");

const origialWidth = 8233;
const originalHeight = 552;
const scaleWidth = guys.clientWidth / origialWidth;
const scaleHeight = guys.clientHeight / originalHeight;

connector.subscribe(renderPlayer);
scoresRepo.subscribe(renderScoreboard);

function renderPlayer(state: StateMessage) {
    const scaledX = state.x * scaleWidth;
    const scaledY = (state.y + 10) * scaleHeight;
    
    let guy = document.getElementById("id-" + state.id);

    if (!state.isAlive && guy) {
        guys.removeChild(guy);
        return;
    }

    if (!guy) {
        guy = document.createElement("div");
        guy.id = "id-" + state.id;
        guy.style.width = "5px";
        guy.style.height = "5px";
        guy.style.position = "absolute";
        guy.style.backgroundColor = "red";

        guy.classList.add("guy");
        guys.appendChild(guy);
    }

    const invertedY = guys.clientHeight - scaledY;

    guy.style.left = scaledX + "px";
    guy.style.top = invertedY + "px";
}

function renderScoreboard(scoreboard: Scoreboard) {
    const tempate = document.getElementById("score-item") as HTMLTemplateElement;
    const scoreboardContainer = document.getElementById("scores-list") as HTMLDivElement;

    scoreboardContainer.innerHTML = "";

    for (const score of scoreboard.scores) {
        const clone = tempate.content.cloneNode(true) as HTMLDivElement;
        clone.querySelector(".name").innerHTML = score.name;
        clone.querySelector(".time").innerHTML = score.score.toString();
        scoreboardContainer.appendChild(clone);
    }   

    console.log("rendered scores");
}
