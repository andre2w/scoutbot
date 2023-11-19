import { Page } from "playwright";
import { Listing } from "../../types";



export async function getImmoWeltListings(page: Page): Promise<void> {
    await page.goto("https://www.immowelt.de/suche/berlin-tiergarten/wohnungen/mieten?ami=40&d=true&lids=499908&lids=499983&lids=499998&lids=500004&lids=500012&lids=500016&lids=500030&pma=1500&sd=DESC&sf=TIMESTAMP", {
        waitUntil: "networkidle",
    });

    console.log(await getListings(page));

}


async function getListings(page: Page): Promise<Listing[]> {
    const listings = await page.$$(`[class^="EstateItem-"]`);
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
    return result;
}