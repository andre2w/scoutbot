import { firefox } from "playwright";
import { ImmoScoutExtractor } from "./extractors/immoscout";
import { ImmoweltExtractor } from "./extractors/immowelt";

async function run() {    
    const browser = await firefox.launch({
        headless: false,
    });
    const configuration = await getConfiguration();
    
    const searches = configuration.map(url => {
        if (url.includes("immobilienscout24.de")) {
            return browser.newPage().then(page => new ImmoScoutExtractor(page, url)).then(e => e.start());
        } else if (url.includes("immowelt.de")) {
            return browser.newPage().then(page => new ImmoweltExtractor(page, url)).then(e => e.start());
        } else {
            throw new Error(`Invalid url: ${url}`);
        }
    });

    await Promise.allSettled(searches);

}

async function getConfiguration() {
    return [
        "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten?price=-1500.0&livingspace=40.0-&exclusioncriteria=swapflat&pricetype=calculatedtotalrent&geocodes=110000000801,110000000307,110000000101,110000000201,110000000202,110000000301&sorting=2&enteredFrom=result_list",
        "https://www.immowelt.de/suche/berlin-tiergarten/wohnungen/mieten?ami=40&d=true&lids=500030&lids=500016&lids=500012&lids=500004&lids=500000&lids=499998&lids=499939&lids=499908&lids=499889&pma=1500&sd=DESC&sf=TIMESTAMP&sp=1"
    ];
}

run();