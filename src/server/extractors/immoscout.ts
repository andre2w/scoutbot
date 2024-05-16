import { Page } from "playwright";
import { Listing } from "../../types";
import { setTimeout } from "node:timers/promises";
import { ONE_MINUTE, getWaitTime } from "../utils";
import { BaseExtractor } from "./BaseExtractor";

const CAPTCHA_SELECTOR = ".geetest_btn";
const LISTINGS_SELECTOR = ".result-list__listing";

export class ImmoScoutExtractor extends BaseExtractor {
    getSource(): string {
        return "immoscout";
    }
    isCaptchaPage(): Promise<boolean> {
        return this.page.locator(CAPTCHA_SELECTOR).isVisible();
    }
    isListingVisible(): Promise<boolean> {
        return this.page.locator(LISTINGS_SELECTOR).isVisible();
    }
    async getListings(): Promise<Listing[]> {
        const listings = await this.page.$$(".result-list__listing");    
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

}