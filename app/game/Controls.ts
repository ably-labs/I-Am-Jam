import { Game } from "./Game";

export class Controls {
    public extraHeight: boolean;
    public down: boolean;
    public left: boolean;
    public right: boolean;
    public jump: boolean;
    public run: boolean;
    public start: boolean;

    private mapping = { 
        65: "left", 
        68: "right", 
        87: "extraHeight", 
        83: "down", 
        16: "run", 
        32: "jump",
        13: "start",
        27: "start",
        38: "extraHeight",
        40: "down",
        37: "left",
        39: "right",
    };

    private gamepadPollingInterval: any;

    public buttonPress(keyInfo: any) {
        this[this.mapping[keyInfo.keyCode]] = true;
    }

    public buttonRelease(keyInfo: any) {
        this[this.mapping[keyInfo.keyCode]] = false;
    }

    public addGamepad(gamepad: Gamepad) {
        this.gamepadPollingInterval = setInterval(() => {
            const pad = navigator.getGamepads()[gamepad.index];
            if (pad) {
                this.extraHeight = pad.buttons[12].pressed;
                this.down = pad.buttons[13].pressed;
                this.left = pad.buttons[14].pressed;
                this.right = pad.buttons[15].pressed;
                this.run = pad.buttons[2].pressed;
                this.jump = pad.buttons[0].pressed;
                this.start = pad.buttons[8].pressed || pad.buttons[9].pressed
            }
        }, 33);
    }

    public connect(game: Game) {
        window.addEventListener("keydown", (keyInfo) => {
            game.controls.buttonPress(event); 
        }, false);

        window.addEventListener("keyup", (keyInfo) => { 
            game.controls.buttonRelease(event); 
        }, false);

        window.addEventListener("gamepadconnected", (e) => {        
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
              e.gamepad.index, e.gamepad.id,
              e.gamepad.buttons.length, e.gamepad.axes.length);
              
            const pad = navigator.getGamepads()[e.gamepad.index];
            game.controls.addGamepad(pad);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
            clearInterval(this.gamepadPollingInterval);
        });

        setInterval(() => {
            if (this.start && game.finished) {
                game.start();
            }
        }, 33);
    }
}
