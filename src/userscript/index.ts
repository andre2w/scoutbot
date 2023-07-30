// ==UserScript==
// @name        Get ads - immobilienscout24.de
// @namespace   Violentmonkey Scripts
// @match       https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten
// @grant       none
// @version     1.0
// @author      -
// @description 30/07/2023, 17:41:21
// @run-at      document-idle
// @grant       GM_xmlhttpRequest
// ==/UserScript==

const TWO_MINUTES = 1_000 * 60 * 2;

function getListings() {
    const listings = document.querySelectorAll(".result-list__listing");
    const found: { id: string; link: string }[] = [];
    for (const listing of listings) {
        if (listing == null) continue;
        const listingLink = listing.querySelector("a.result-list-entry__brand-title-container");
        const listingId = listing.getAttribute("data-id")!;
        found.push({ id: listingId, link: listingLink?.getAttribute("href")! })
    }
    return found;
}

async function loop() {
    while (true) {
        const listings = getListings();    
        await postToLocal(listings)
        console.log("Will wait", TWO_MINUTES);
        await delay(TWO_MINUTES);
        console.log("Wait done");
        location.reload();
        console.log("Continuing after reload");
    }
}

function startButton() {
    const button = document.createElement("button");
    button.innerText = "START";
    button.id = "mybtn";
    button.addEventListener("click", () => {
        loop();
    });
    button.style.display = "absolute";
    button.style.top = "0";
    button.style.left = "0";
    document.body.appendChild(button);
}

async function delay(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    });
}

async function postToLocal(data: any): Promise<VMScriptResponseObject<unknown>> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: "http://localhost:4433",
            method: "POST",
            data: JSON.stringify(data),
            onload(resp) {
                resolve(resp)
            },
            onerror(resp) {
                reject(resp)
            },
        })
    });
}

startButton();