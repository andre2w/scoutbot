import { createServer } from "http";
import { adExists, storeAd } from "./ads";
import { sendMessage } from "./telegram";
import { Listing } from "../types";

async function handleAds(listings: Listing[]): Promise<void> {
    let newListings = 0;
    for (const listing of listings) {
        if (!adExists(listing.id)) {
            try {
                console.log("Should notify on telegram", listing.id);
                await sendMessage(listing);
                storeAd(listing.id);
                newListings++;
            } catch (error) {
                console.error(error);
            }
        }
    }
    console.log(`${new Date().toISOString()} - Received ${listings.length}, New: ${newListings}`);
}

const server = createServer((req, res) => {
    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {
        const reqBody = JSON.parse(body);
        if ("captcha" in reqBody) {
            console.log("Captcha displayed at", reqBody.captcha);
            res.writeHead(204);
            res.end();
            return;
        }
        handleAds(reqBody).then(() => {
            res.writeHead(204);
            res.end();
        });
    });
});

server.listen(4433, () => {
    console.log("Server started at", new Date().toISOString());
});