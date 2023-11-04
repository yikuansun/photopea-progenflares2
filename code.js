function handleFinalImage(data) {
    let b64uri = data[1];
    let img = new Image();
    img.src = b64uri;
    document.body.appendChild(img);
}

function createPopup(w, h, imgURI) {
    let pluginURL = new URL("http://localhost:1995/app_test/index.html"); // https://progenflares2-web-preview-git-deploytoweb-yikuansun.vercel.app
    pluginURL.searchParams.set("popupPlugin", "yeah");
    pluginURL.searchParams.set("docWidth", w);
    pluginURL.searchParams.set("docHeight", h);
    
    let popup = window.open(pluginURL, "_blank", "width=1400,height=700");
    popup.window.addEventListener("message", function (e) {
        if (e.data[0] == "pluginStatus" && e.data[1] == "ready") {
            popup.window.postMessage(["refImage", imgURI]);
        }
        if (e.data[0] == "finalImage") {
            handleFinalImage(e.data);
        }
        console.log(e.data);
    });
}

createPopup(1920, 1080, "https://i.imgur.com/wVIP3ow.png");