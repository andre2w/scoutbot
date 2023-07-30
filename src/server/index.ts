import { createServer } from "http";
import { adExists, storeAd } from "./ads";

function handleAds(listings: { id: string; link: string }[]) {
    for (const listing of listings) {
        if (!adExists(listing.id)) {
            console.log("Should notify on telegram");
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
        handleAds(JSON.parse(body));
        res.writeHead(204);
        res.end();
    });
});

server.listen(4433);