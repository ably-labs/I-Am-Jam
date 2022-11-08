import { HubSpotUi } from "./HubSpotUi";
import { createGameUi } from "./GameUi";
import { Scoreboard } from "./game/highscores/Scoreboard";
import { Game } from "./game/Game";

let game: Game = null;
const requireSignup = true;

(async () => {
    const startGameFunction = await createGameUi(onGameStart, onGameEnd);

    if (requireSignup) {
        HubSpotUi.createForm(async (form) => {
            HubSpotUi.hideForm();

            // (╯°□°）╯︵ ┻━┻
            const firstName = form.data.data[1].value;
            const lastName = form.data.data[2].value;
            if (firstName.length + lastName.length < 50) {
                await waitForHorizontalOrientation();   
                game = startGameFunction(`${firstName} ${lastName}`);
            }
        });
    } else {
        HubSpotUi.hideForm();
        await waitForHorizontalOrientation();
        game = startGameFunction("Default Player");
    }
})();

function waitForHorizontalOrientation(): Promise<boolean> {
    if (screen == null || screen.orientation == null) { 
        return Promise.resolve(true);
    }

    validateOrientation();

    screen.orientation.addEventListener("change", function(event) {
        console.log("Orientation changed");
        validateOrientation();
    });
    

    if (window.innerHeight < window.innerWidth || screen.orientation.type === "landscape-primary") {
        return Promise.resolve(true);
    }

    var promise = new Promise<boolean>((resolve) => {
        const orientationHandler = () => {
            if (screen.orientation.type == "landscape-primary") {
                window.removeEventListener("resize", orientationHandler);
                resolve(true);
            }
        };

        screen.orientation.addEventListener("change", orientationHandler);
    });

    return promise;
}

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

    const template = document.getElementById("score-item") as HTMLTemplateElement;
    const scoreboardContainer = document.getElementById("scores-list") as HTMLDivElement;

    scoreboardContainer.innerHTML = "";

    for (const score of scoreboard.scores) {
        const clone = template.content.cloneNode(true) as HTMLDivElement;
        clone.querySelector(".name").innerHTML = score.name;
        clone.querySelector(".time").innerHTML = new Date(score.score).toISOString().slice(14, -1);
        scoreboardContainer.appendChild(clone);
    }

    document.getElementById("scores").click = () => {
        game.controls.simulateButtonPress("start");
    };

    document.getElementById("scores").ontouchend = () => {
        game.controls.simulateButtonPress("start");
    };
}


export function validateOrientation() {
    const orientationWarning = document.getElementById("orientation-warning") as HTMLDivElement;

    switch (screen.orientation.type) {
        case "landscape-primary":
            // console.log("That looks good.");
            orientationWarning.classList.remove("bad-orientation");
            break;
        case "landscape-secondary":
            // console.log("Mmmh… the screen is upside down!");
            orientationWarning.classList.add("bad-orientation");
            break;
        case "portrait-secondary":
        case "portrait-primary":
            // console.log("Mmmh… you should rotate your device to landscape");            
            orientationWarning.classList.add("bad-orientation");
            break;
        default:
            // console.log("The orientation API isn't supported in this browser :(");            
            orientationWarning.classList.remove("bad-orientation");
      }

      console.log("Orientation: " + screen.orientation.type);
}

export { };
