// asset-versioning.js
let assetManifest = null;

async function loadAssetManifest() {
    const response = await fetch('/public/assets/manifest.json');
    assetManifest = await response.json();
}

function asset(name) {
    if (assetManifest === null) {
        throw new Error("Asset manifest has not been loaded. Make sure to call loadAssetManifest() first.");
    }
    return assetManifest[name];
}

async function replaceAssetsInHtml() {
    await loadAssetManifest(); // Ensure manifest is loaded

    const elementsWithHref = Array.from(document.querySelectorAll('[href]'));
    const elementsWithSrc = Array.from(document.querySelectorAll('[src]'));

    elementsWithHref.forEach((el) => {
        console.log(el)
        let originalHref = el.getAttribute('href');
        console.log(originalHref)
        const match = originalHref.match(/{{\s*asset\('(.+?)'\)\s*}}/);
        if (!match) {
            return
        }
        console.log(`match = ${match}`)
        console.log(`match[1] = ${match[1]}`)
        const filename = match[1]
        const path = asset(filename)
        el.setAttribute('href', path);
    });

    elementsWithSrc.forEach((el) => {
        console.log(el)
        let originalSrc = el.getAttribute('src');
        const match = originalSrc.match(/{{\s*asset\('(.+?)'\)\s*}}/);
        if (!match) {
            return
        }
        console.log(`srcmatch = ${match}`)
        console.log(`match[1] = ${match[1]}`)
        const filename = match[1]
        const path = asset(filename)
        el.setAttribute('href', path);
    });
}

// Automatically replace assets when the script is loaded
replaceAssetsInHtml();