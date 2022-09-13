export class Sounds {
    private enabled: boolean;

    constructor(enabled = true) {
        this.enabled = enabled;
    }

    public jump() {
        this.play("163286__lockwert__meow-sample.wav");
    }

    public backgroundMusic() {
        this.play("bensound-littleidea.mp3");
    }

    public play(filename: string) {
        if (this.enabled) {
            new Audio("sounds/" + filename).play();
        }
    }
}
