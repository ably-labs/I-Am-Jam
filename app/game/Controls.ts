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
    private eventListenerController: any;

    private readonly _touchControlsCenterPoint = 100;

    constructor() {
        this.eventListenerController = new AbortController();
    }

    public simulateButtonPress(key: string) {
        this[key] = true;
        
        setTimeout(() => {
            this[key] = false;
        }, 250);
    }

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
        if (this.eventListenerController) {
            this.eventListenerController.abort();
            this.eventListenerController = new AbortController();
        }

        const cancellationToken = { signal : this.eventListenerController.signal };

        window.addEventListener("keydown", (keyInfo) => {
            game.controls.buttonPress(event);
        }, cancellationToken);

        window.addEventListener("keyup", (keyInfo) => {
            game.controls.buttonRelease(event);
        }, cancellationToken);

        window.addEventListener("gamepadconnected", (e) => {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);

            const pad = navigator.getGamepads()[e.gamepad.index];
            game.controls.addGamepad(pad);
        }, cancellationToken);

        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
            clearInterval(this.gamepadPollingInterval);
        }, cancellationToken);

        const processTouch = (e) => {
            const touches = touchEventsToCoords(e);

            for (let { x, y } of touches) {

                if (x <= window.innerWidth / 2) {

                    if (x < this._touchControlsCenterPoint) {
                        game.controls.left = true;
                        game.controls.right = false;
                    } else if (x > this._touchControlsCenterPoint) {
                        game.controls.left = false;
                        game.controls.right = true;
                    }

                    if (x < (this._touchControlsCenterPoint - 50)) {
                        game.controls.run = true;
                    } else if (x > (this._touchControlsCenterPoint + 50)) {
                        game.controls.run = true;
                    } else {
                        game.controls.run = false;
                    }

                    if (y <= 150) {
                        game.controls.extraHeight = true;
                    } else if (y > 150) {
                        game.controls.extraHeight = false;
                    }

                } else {
                    game.controls.jump = true;
                }
            }
        };

        window.addEventListener("touchstart", (e) => {
            processTouch(e);
        }, cancellationToken);

        window.addEventListener("touchmove", (e) => {
            processTouch(e);
        }, cancellationToken);

        window.addEventListener("touchend", (e) => {

            const rect = e.target as HTMLCanvasElement;
            const targetRect = rect.getBoundingClientRect();
            const x = e.changedTouches[0].pageX - targetRect.left;
            const y = e.changedTouches[0].pageY - targetRect.top;

            if (x <= window.innerWidth / 2) {
                game.controls.left = false;
                game.controls.right = false;
                game.controls.extraHeight = false;
                game.controls.down = false;
                game.controls.run = false;
            } else {
                game.controls.jump = false;
            }

        }, cancellationToken);

        console.log("added event listeners");

        setInterval(() => {

            // Control polling loop
            if ((this.start || this.jump) && game.finished) {
                game.start();
            }
        }, 33);
    }
}


function touchEventsToCoords(e) {
    const rect = e.target as HTMLCanvasElement;
    const targetRect = rect.getBoundingClientRect();

    const touchPositions = [];

    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.pageX - targetRect.left;
        const y = touch.pageY - targetRect.top;
        touchPositions.push({ x, y });
    }

    return touchPositions;
}
