document.addEventListener("orientationchange", function(event) {
    validateOrientation();
});

export function validateOrientation() {
    const orientationWarning = document.getElementById("orientation-warning") as HTMLDivElement;

    switch (screen.orientation.type) {
        case "landscape-primary":
            // console.log("That looks good.");
            orientationWarning.style.display = "none";
            break;
        case "landscape-secondary":
            // console.log("Mmmh… the screen is upside down!");
            orientationWarning.style.display = "block";
            break;
        case "portrait-secondary":
        case "portrait-primary":
            // console.log("Mmmh… you should rotate your device to landscape");            
            orientationWarning.style.display = "block";
            break;
        default:
            // console.log("The orientation API isn't supported in this browser :(");            
            orientationWarning.style.display = "none";
      }
}
