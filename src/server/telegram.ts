import { Telegraf } from "telegraf";
import { TELEGRAM_API_KEY } from "../config/api_keys";

const telegraf = new Telegraf(TELEGRAM_API_KEY);


export async function sendMessage(message: string): Promise<void> {
    await telegraf.telegram.sendMessage("-928776888", message);
}