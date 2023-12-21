// https://www.photopea.com/#%7B%22files%22%3A%5B%22https%3A%2F%2Fwww.photopea.com%2Fapi%2Fimg2%2Fpug.png%22%5D%2C%22environment%22%3A%7B%22plugins%22%3A%5B%7B%22name%22%3A%22pgf2%22%2C%22url%22%3A%22http%3A%2F%2Flocalhost%3A1995%2F%22%2C%22icon%22%3A%22http%3A%2F%2Flocalhost%3A1995%2Ficon120.png%22%7D%5D%7D%7D

let $ = function(e) { return document.querySelector(e); };

async function handleFinalImage(data) {
    let b64uri = data[1];
    await Photopea.runScript(window.parent, "app.activeDocument.activeLayer = app.activeDocument.layers[0];");
    await addImageAndWait(window.parent, b64uri);
    await Photopea.runScript(window.parent, "app.activeDocument.activeLayer.blendMode = 'scrn';");
    await Photopea.runScript(window.parent, "app.activeDocument.activeLayer.name = 'Lens Flare (Progen Flares 2)';");
}

function createPopup(w, h, imgURI) {
    let pluginURL = new URL("http://localhost:1995/app_test/index.html");
    pluginURL.searchParams.set("popupPlugin", "yeah");
    pluginURL.searchParams.set("docWidth", w);
    pluginURL.searchParams.set("docHeight", h);

    let popupOptions = {
        width: 1400,
        height: 700,
        left: window.outerWidth / 2 - 700,
        top: window.outerHeight / 2 - 350,
    };
    let windowFeatures = "";
    for (let key in popupOptions) {
        windowFeatures += key + "=" + popupOptions[key] + ",";
    }
    
    let popup = window.open(pluginURL, "_blank", windowFeatures);
    window.addEventListener("message", function (e) {
        if (e.data[0] == "pluginStatus" && e.data[1] == "ready") {
            popup.window.postMessage(["refImage", imgURI]);
        }
        if (e.data[0] == "finalImage") {
            handleFinalImage(e.data);
            popup.window.close();
        }
    });

    return popup;
}

getDocumentAsImage(window.parent).then(function(img) {
    img.addEventListener("load", function() {
        let popup = createPopup(img.width, img.height, img.src);
        $("#loadingSpinner").style.display = "none";
        if (popup) {
            $("#message").innerText = "Plugin opened in a popup window.";
        }
        else {
            $("#message").innerText = "Plugin failed to open.\n\nPlease allow popups from Photopea.";
        }
    });
});