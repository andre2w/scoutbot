import { Telegraf } from "telegraf";
import { CHAT_ID, TELEGRAM_API_KEY } from "../config/api_keys";
import { Listing } from "../types";
import escape from "markdown-escape";

const telegraf = new Telegraf(TELEGRAM_API_KEY);

const MESSAGE_TEMPLATE = `{TITLE}

Price: {PRICE}
Size: {SIZE}
Rooms: {ROOMS}
{PLUS_LISTING}

Address: {ADDRESS}

{APPLY_LINK}
`;

export function formatListing(listing: Listing): string {
    return MESSAGE_TEMPLATE
        .replace("{PRICE}", listing.price)
        .replace("{SIZE}", listing.size)
        .replace("{ROOMS}", listing.rooms)
        .replace("{ADDRESS}", listing.address)
        .replace("{TITLE}", listing.title.startsWith("NEU") ? listing.title.replace("NEU", "") : listing.title)
        .replace("{PLUS_LISTING}", listing.isPlus ? "PLUS LISTING" : "")
        .replace("{APPLY_LINK}", `https://www.immobilienscout24.de${listing.link}`);
}

function escapeMessage(message: string): string {
    return escape(message).replace(/\./g, "\\.").replace(/!/g, "\\!").replace(/\-/g,"\\-");

}

export async function sendMessage(message: string): Promise<void> {
    await telegraf.telegram.sendMessage(CHAT_ID, escapeMessage(message), { parse_mode: "MarkdownV2" });
}



