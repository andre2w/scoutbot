import { createServer } from "http";
import { adExists, storeAd } from "./ads";
import { sendMessage } from "./telegram";

async function handleAds(listings: { id: string; link: string }[]): Promise<void> {
    for (const listing of listings) {
        if (!adExists(listing.id)) {
            console.log("Should notify on telegram");
            await sendMessage(`New Listing\nhttps://www.immobilienscout24.de${listing.link}`);
            storeAd(listing.id);
        } else {
            console.log(`Skipping ad ${listing.id}`);
        }
    }
}

const server = createServer((req, res) => {
    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {
        handleAds(JSON.parse(body)).then(() => {
            res.writeHead(204);
            res.end();
        });
    });
});

server.listen(4433);