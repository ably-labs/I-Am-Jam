import Ably from "ably/promises";
import { AblySpectatorConnector } from "./game/spectating/AblySpectatorConnector";

console.log("Hello from spectate.ts");

const ably = new Ably.Realtime({ authUrl: "/api/ably-token-request" });
const connector = new AblySpectatorConnector(ably);

const guys = document.getElementById("guys");

const origialWidth = 8233;
const originalHeight = 552;

const scaleWidth = guys.clientWidth / origialWidth;
const scaleHeight = guys.clientHeight / originalHeight;

connector.subscribe((state) => {
    console.log(state);

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

});