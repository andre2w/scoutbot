import { Page } from "playwright";
import { ONE_MINUTE, getWaitTime } from "../utils";
import { setTimeout } from "node:timers/promises";
import { handleAds, sendCaptchaMessage } from "..";
import { Listing } from "../../types";

export abstract class BaseExtractor {
    constructor(readonly page: Page, readonly url: string) {}

    async start() {
        await this.page.goto(this.url, {
            waitUntil: "networkidle"
        });
        
        while (true) {
            if (await this.isCaptchaPage()) {
                sendCaptchaMessage(new Date());
                while (!await this.isListingVisible()) {
                    await setTimeout(ONE_MINUTE);
                }
            } else {
                const listings = await this.getListings();
                await handleAds(listings, this.getSource());
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
}