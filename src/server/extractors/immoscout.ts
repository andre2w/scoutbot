import { Page } from "playwright";
import { Listing } from "../../types";
import { handleAds, sendCaptchaMessage } from "..";
import { setTimeout } from "node:timers/promises";
import { createInterface } from "node:readline/promises";

const ONE_MINUTE = 1_000 * 60;
const TWO_MINUTES = 1_000 * 60 * 2;
const FIVE_MINUTES = 1_000 * 60 * 5;

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const CONFIRMATION_REGEX = new RegExp(/y|Y(e|E)?(s|S)?/)

export async function getImmoScoutListings(page: Page): Promise<void> {
    
    await page.goto("https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten?price=-1500.0&livingspace=40.0-&exclusioncriteria=swapflat&pricetype=calculatedtotalrent&geocodes=110000000801,110000000307,110000000101,110000000201,110000000202,110000000301&sorting=2&enteredFrom=result_list", {
        waitUntil: "networkidle"
    });
    
    while (true) {
        if (await isCaptchaPage(page)) {
            sendCaptchaMessage(new Date());
            const response = await readline.question("Should I start? (y/n): ");
            if (!CONFIRMATION_REGEX.test(response)) {
                break;
            }
        } else {
            const listings = await getListings(page);
            await handleAds(listings);
            await setTimeout(getWaitTime());
            await page.reload({
                waitUntil: "networkidle",
            });
        }
    }
}

const CAPTCHA_SELECTOR = ".geetest_btn";

async function isCaptchaPage(page: Page) {
    const captcha = page.locator(CAPTCHA_SELECTOR, { });
    return await captcha.isVisible();
}

function getWaitTime() {
    const timeNow = new Date();

    if (timeNow.getHours() >= 6 && timeNow.getHours() <= 13) {
        return ONE_MINUTE;
    }

    if (timeNow.getHours() <= 20) {
        return TWO_MINUTES;
    }

    return FIVE_MINUTES;
}

async function getListings(page: Page) {    
    const listings = await page.$$(".result-list__listing");    
    const found: Listing[] = [];
    for (const listing of listings) {
        
        if (listing == null) continue;
        const listingLink = await listing.$eval("a.result-list-entry__brand-title-container", e => e.getAttribute("href")) ?? "";
        const listingId = await listing.getAttribute("data-id") ?? "";
        const [price, size, rooms] = await listing.$$eval(".result-list-entry__criteria dl", e => e.map(e => e.textContent)) ?? "";
        const address = await listing.$eval(".result-list-entry__address", e => e.textContent) ?? "";
        const isPlus = !!(await listing.$(".plusBooking")) ?? "";
        const title = await listing.$eval(".result-list-entry__brand-title", e => e.textContent) ?? "New Listing";            
        found.push({ address, id: listingId, isPlus, link: listingLink, price: price ?? "", rooms: rooms ?? "", size: size ?? "", title });
    }
    return found;
}
