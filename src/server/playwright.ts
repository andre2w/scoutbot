import { Page, firefox } from "playwright";
import { Listing } from "../types";
import { createInterface } from "readline/promises";
import { handleAds, sendCaptchaMessage } from ".";
import { setTimeout } from "timers/promises";
import { getImmoScoutListings } from "./extractors/immoscout";
import { getImmoWeltListings } from "./extractors/immowelt";

const ONE_MINUTE = 1_000 * 60;
const TWO_MINUTES = 1_000 * 60 * 2;
const FIVE_MINUTES = 1_000 * 60 * 5;


async function run() {    
    const browser = await firefox.launch({
        headless: false,
    });
  
    // await getImmoScoutListings(await browser.newPage());
    await getImmoWeltListings(await browser.newPage());
    await browser.close();
}

run();