import { Telegraf } from "telegraf";
import { CHAT_ID, TELEGRAM_API_KEY } from "../config/api_keys";
import { Listing } from "../types";
import escape from "markdown-escape";

const telegraf = new Telegraf(TELEGRAM_API_KEY);

const MESSAGE_TEMPLATE = `New listing found

Price: {PRICE}
Size: {SIZE}
Rooms: {ROOMS}

Address: {ADDRESS}

Apply Now! {APPLY_LINK}
`

export function formatListing(listing: Listing): string {
    const msg = MESSAGE_TEMPLATE
        .replace("{PRICE}", listing.price)
        .replace("{SIZE}", listing.size)
        .replace("{ROOMS}", listing.rooms)
        .replace("{ADDRESS}", listing.address)
        .replace("{APPLY_LINK}", `https://www.immobilienscout24.de${listing.link}`);

    return escape(msg).replace(/\./g, "\\.").replace(/!/g, "\\!").replace(/\-/g,"\\-");
}

export async function sendMessage(message: string): Promise<void> {
    await telegraf.telegram.sendMessage(CHAT_ID, message, { parse_mode: "MarkdownV2" });
}



