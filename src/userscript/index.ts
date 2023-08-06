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

import type { Listing } from "../types";

const TWO_MINUTES = 1_000 * 60 * 2;
const FIVE_MINUTES = 1_000 * 60 * 5;
const CAPTCHA_SELECTOR = "#captcha-box, .geetest_btn";

function getListings() {
    const listings = document.querySelectorAll(".result-list__listing");
    const found: Listing[] = [];
    for (const listing of listings) {
        if (listing == null) continue;
        const listingLink = listing.querySelector("a.result-list-entry__brand-title-container");
        const listingId = listing.getAttribute("data-id")!;
        const [price, size, rooms] = listing.querySelectorAll(".result-list-entry__criteria dl");
        const address = listing.querySelector(".result-list-entry__address");
        found.push({ 
            id: listingId, 
            link: listingLink?.getAttribute("href")!,
            price: price!.textContent!,
            size: size!.textContent!,
            rooms: rooms!.textContent!,
            address: address!.textContent!,
        });
    }
    return found;
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

async function waitForSelector(selector: string, maxWaits = 10): Promise<void> {
    let waitCount = 0;
    while (waitCount < maxWaits) {
        console.log("Waiting for selector", selector);
        const nodes = document.querySelectorAll(selector);
        if (nodes.length > 0) {
            console.log("Selector found");
            break;
        } else {
            console.log("Selector not found waiting one second");
            await delay(1_000);
        }
        waitCount++;

        if (waitCount >= maxWaits) {
            throw new Error("Tried too many times");
        }
    }
}

function isCaptchaPage() {
    const captcha = document.querySelector(CAPTCHA_SELECTOR);
    return !!captcha;
}

async function start() {
    console.log("Starting at", new Date().toISOString());
    try {
        await waitForSelector(".result-list__listing");
        const listings = getListings();    
        await postToLocal(listings);
        console.log("Will wait", TWO_MINUTES);
        await delay(FIVE_MINUTES);
        console.log("Wait done");
        location.reload();
    } catch(error) {
        if (isCaptchaPage()) {
            await postToLocal({
                "captcha": new Date(),
            });
        } else {
            await delay(FIVE_MINUTES); 
            location.reload();
        }
    }
}

start().catch(console.error);