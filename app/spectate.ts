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
let scaleWidth = guys.clientWidth / origialWidth;
let scaleHeight = guys.clientHeight / originalHeight;

window.addEventListener("resize", () => {
    scaleWidth = guys.clientWidth / origialWidth;
    scaleHeight = guys.clientHeight / originalHeight;
});

connector.subscribe(renderPlayer);
scoresRepo.subscribe(renderScoreboard);

function renderPlayer(state: StateMessage) {
    const scaledX = state.x * scaleWidth;
    const scaledY = state.y * scaleHeight;

    let guy = document.getElementById("id-" + state.id);

    if (!state.isAlive && guy) {
        guys.removeChild(guy);
        return;
    }

    if (!guy) {
        guy = document.createElement("div");
        guy.id = "id-" + state.id;
        guy.style.width = "0.3vw";
        guy.style.height = "0.3vw";
        guy.style.position = "absolute";
        guy.style.backgroundColor = "red";
        guy.setAttribute("data-player-name", state.name);

        const randomNumber = Math.floor(Math.random() * 360) + 0;
        const name = document.createElement('span');
        name.innerHTML = state.name;
        name.className = "player";

        guy.style.backgroundColor = `hsl(${randomNumber}, 100%, 50% )`;

        guy.classList.add("guy");
        guy.appendChild(name);
        guys.appendChild(guy);
    }

    const invertedY = guys.clientHeight - scaledY;

    guy.style.left = scaledX + "px";
    guy.style.top = `calc(${invertedY}px - 0.3vw)`;

    guy.setAttribute("data-updated", new Date().getTime().toString())
}

setInterval(() => {  // purge guys from spectate page if they've not moved in 10 seconds
    const playingGuys = document.getElementsByClassName("guy");
    const now = new Date().getTime();
    for (let guy of playingGuys) {
        const lastUpdated = parseInt(guy.getAttribute('data-updated'));
        if (now > lastUpdated + 10000) {
            guy.remove();
        }
    }
}, 5000)

function renderScoreboard(scoreboard: Scoreboard) {
    const template = document.getElementById("score-item") as HTMLTemplateElement;
    const scoreboardContainer = document.getElementById("scores-list") as HTMLDivElement;

    scoreboardContainer.innerHTML = "";

    for (const score of scoreboard.scores) {
        const clone = template.content.cloneNode(true) as HTMLDivElement;
        clone.querySelector(".name").innerHTML = score.name;
        clone.querySelector(".time").innerHTML = new Date(score.score).toISOString().slice(14, -1);
        scoreboardContainer.appendChild(clone);
    }

    console.log("rendered scores");
}
