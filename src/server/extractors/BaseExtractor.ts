import { Page } from "playwright";
import { ONE_MINUTE, getWaitTime } from "../utils";
import { setTimeout } from "node:timers/promises";
import { Listing } from "../../types";
import { adExists, storeAd } from "../ads";
import { formatListing, sendMessage } from "../telegram";

export abstract class BaseExtractor {
    constructor(readonly page: Page, readonly url: string) {}

    async start() {
        await this.page.goto(this.url, {
            waitUntil: "networkidle"
        });
        
        while (true) {
            if (await this.isCaptchaPage()) {
                await this.sendCaptchaMessage(new Date());
                while (!await this.isListingVisible()) {
                    await setTimeout(ONE_MINUTE);
                }
            } else {
                const listings = await this.getListings();
                await this.handleAds(listings, this.getSource());
                await setTimeout(getWaitTime());
                await this.page.reload({
                    waitUntil: "networkidle",
                });
            }
        }
    }

    abstract isCaptchaPage(): Promise<boolean>;
    abstract isListingVisible(): Promise<boolean>;
    abstract getListings(): Promise<Listing[]>;
    abstract getSource(): string;

    
    async handleAds(listings: Listing[], source: string): Promise<void> {
        let newListings = 0;
        for (const listing of listings) {
            if (!adExists({ id: listing.id, source })) {
                try {
                    console.log("Should notify on telegram", listing.id);
                    storeAd({ id: listing.id, source });
                    await sendMessage(formatListing(listing));
                    newListings++;
                } catch (error) {
                    console.error(error);
                }
            }
        }
        console.log(`[${source}] ${new Date().toISOString()} - Received ${listings.length}, New: ${newListings}`);
    }

    async sendCaptchaMessage(captchaTime: any) {
        console.log("Captcha displayed at", captchaTime);
        await sendMessage(`Captcha displayed at ${captchaTime}`);
    }
}