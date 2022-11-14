import {HubSpotUi} from "./HubSpotUi";
import {createGameUi} from "./GameUi";
import { Scoreboard } from "./game/highscores/Scoreboard";
import { Game } from "./game/Game";

let game: Game = null;
const requireSignup = true;

(async () => {
    const startGameFunction = await createGameUi(onGameStart, onGameEnd);

    if (requireSignup) {
        HubSpotUi.createForm((form) => {
            HubSpotUi.hideForm();

            // (╯°□°）╯︵ ┻━┻
            const firstName = form.data.data[1].value;
            const lastName = form.data.data[2].value;
            game = startGameFunction(`${firstName} ${lastName}`);
        });
    } else {
        HubSpotUi.hideForm();
        game = startGameFunction("Default Player");
    }
})();

function onGameStart() {
    console.log("start");
    document.body.classList.remove("gameover");
    document.body.classList.remove("completed");
    document.body.classList.add("gameactive");
}

function onGameEnd(scoreboard: Scoreboard, reason: string) {
    document.body.classList.remove("gameactive");
    document.body.classList.add("gameover");
    if (reason === "completed") {
        document.body.classList.add(reason);
    }

    const tempate = document.getElementById("score-item") as HTMLTemplateElement;
    const scoreboardContainer = document.getElementById("scores-list") as HTMLDivElement;

    scoreboardContainer.innerHTML = "";

    for (const score of scoreboard.scores) {
        const clone = tempate.content.cloneNode(true) as HTMLDivElement;
        clone.querySelector(".name").innerHTML = score.name;
        clone.querySelector(".time").innerHTML = new Date(score.score).toISOString().slice(11, -1);;
        scoreboardContainer.appendChild(clone);
    }

    document.getElementById("scores").click = () => {
        game.controls.simulateButtonPress("start");
    };

    document.getElementById("scores").ontouchend = () => {
        game.controls.simulateButtonPress("start");
    };
}

export { };
