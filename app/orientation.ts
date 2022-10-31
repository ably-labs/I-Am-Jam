validateOrientation();

document.addEventListener("orientationchange", function(event) {
    console.log("Orientation changed");
    validateOrientation();
});


export function validateOrientation() {
    console.log('hellooo');
    const orientationWarning = document.getElementById("orientation-warning") as HTMLDivElement;
    console.log("width", window.innerWidth);
    console.log("height", window.innerHeight);

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
