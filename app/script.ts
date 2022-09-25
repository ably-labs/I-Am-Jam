import {HubSpotUi} from "./HubSpotUi";
import {createGameUi} from "./GameUi";

const requireSignup = false;

(async () => {
    const startGameFunction = await createGameUi();

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
export { };
