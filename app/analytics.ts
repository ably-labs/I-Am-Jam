export {};

const gaUa = import.meta.env.VITE_GA_UA || "";

if (gaUa && gaUa !== "") {

    const gtagScript = document.createElement("script");
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaUA;
    document.head.appendChild(gtagScript);
    
    window["dataLayer"] = window["dataLayer"] || [];

    function gtag(...args: (string | Date)[]){
        window["dataLayer"].push(args);
    }

    gtag('js', new Date());  
    gtag('config', gaUa);

    console.log("Configured GA for " + gaUa);
}