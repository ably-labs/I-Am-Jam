import {HubSpotUi} from "./HubSpotUi";
import {createGameUi} from "./GameUi";
import { Scoreboard } from "./game/highscores/Scoreboard";

const requireSignup = false;

(async () => {
    const startGameFunction = await createGameUi(onGameStart, onGameEnd);

    if (requireSignup) {
        HubSpotUi.createForm((form) => {
            HubSpotUi.hideForm();

            // (╯°□°）╯︵ ┻━┻
            const firstName = form.data.data[1].value;
            const lastName = form.data.data[2].value;
            startGameFunction(`${firstName} ${lastName}`);
        });
    } else {
        HubSpotUi.hideForm();
        startGameFunction("Default Player");
    }
})();

function onGameStart() {
    console.log("start");
    document.body.classList.remove("gameover");
    document.body.classList.add("gameactive");
}

function onGameEnd(scoreboard: Scoreboard) {
    document.body.classList.remove("gameactive");
    document.body.classList.add("gameover");

    const tempate = document.getElementById("score-item") as HTMLTemplateElement;
    const scoreboardContainer = document.getElementById("scores-list") as HTMLDivElement;

    scoreboardContainer.innerHTML = "";

    for (const score of scoreboard.scores) {
        const clone = tempate.content.cloneNode(true) as HTMLDivElement;
        clone.querySelector(".name").innerHTML = score.name;
        clone.querySelector(".time").innerHTML = new Date(score.score).toISOString().slice(11, -1);;
        scoreboardContainer.appendChild(clone);
    }
}

export { };
