export {};
const gaUa = import.meta.env.VITE_GA_UA || "";

if (gaUa && gaUa !== "") {

    const gtagScript = document.createElement("script");
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaUa;
    document.head.appendChild(gtagScript);
    
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push('js', new Date());
    window["dataLayer"].push('config', gaUa);

    console.log("Configured GA for " + gaUa);
}