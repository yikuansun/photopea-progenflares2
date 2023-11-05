// uses Photopea.js
var getDocumentAsImage = async function(contentWindow) {
    // returns Image object containing image data from Photopea document
    return new Promise(async function(resolve) {
        Photopea.runScript(contentWindow, "app.activeDocument.saveToOE('png')").then(function(data) {
            var buffer = data[0];
            var fR = new FileReader();
            fR.addEventListener("load", function(e) {
                let img = new Image();
                img.src = e.target.result;
                resolve(img);
            });
            fR.readAsDataURL(new Blob([buffer], { type: "image/png" }));
        });
    });
};