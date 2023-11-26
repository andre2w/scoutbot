import { Page } from "playwright";
import { Listing } from "../../types";
import { BaseExtractor } from "./BaseExtractor";


export class ImmoweltExtractor extends BaseExtractor {
    getSource(): string {
        return "immowelt";
    }
    isCaptchaPage(): Promise<boolean> {
        return Promise.resolve(false);
    }
    isListingVisible(): Promise<boolean> {
        return Promise.resolve(true);
    }

    async getListings(): Promise<Listing[]> {
        const listings = await this.page.$$(`[class^="EstateItem-"]`);
        const result: Listing[] = [];
        for (const listing of listings) {
            const linkElement = await listing.$("a");
            const id = await linkElement?.getAttribute("id");
            const link = await linkElement?.getAttribute("href")
            const [keyFacts, title] = await listing.$$(`[class^="FactsMain-"] > div`);
            const [price, size, rooms] = await keyFacts.$$eval("div", el => el.map(e => e.textContent));
            const titleText = await title.$eval("h2", el => el.textContent);
            const address = await title.$eval("span", el => el.textContent);
            result.push({
                address: address!,
                isPlus: false,
                id: id!,
                title: titleText!,
                price: price!,
                size: size!,
                rooms: rooms!,
                link: link!
            })
    
        }
        console.log("Will return ", result);
        return result;
    }
}
