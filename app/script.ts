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
    // Clear any existing UI bits
}

function onGameEnd(scoreboard: Scoreboard) {
    alert("Game ended! Scoreboard: " + JSON.stringify(scoreboard));
}

export { };
