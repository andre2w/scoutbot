import { firefox } from "playwright";
import { ImmoScoutExtractor } from "./extractors/immoscout";
import { ImmoweltExtractor } from "./extractors/immowelt";

async function run(url: string) {    
    const browser = await firefox.launch({
        headless: false,
    });

    if (url.includes("immobilienscout24.de")) {
        await browser.newPage().then(page => new ImmoScoutExtractor(page, url)).then(e => e.start());
    } else if (url.includes("immowelt.de")) {
        await browser.newPage().then(page => new ImmoweltExtractor(page, url)).then(e => e.start());
    } else {
        throw new Error(`Invalid url: ${url}`);
    }
}

const url = process.argv[2];
console.log(url);
if (url == null) {
    console.log("Invalid url");
    process.exit(1);
}
run(url);