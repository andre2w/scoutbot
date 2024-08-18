# Scoutbot

A bot to notify you about new apartments on Telegram. 

## Setup 

### Config 

You need a channel in telegram where the bot can send the ads. For that you need 
a Telegram API Key. See [here](https://core.telegram.org/api/obtaining_api_id) on how to. 

After you have created the channel and added the bot, you need to create the config file in the `src/config/api_keys.ts` with
the api key and channel id.

```
export const TELEGRAM_API_KEY = "API_KEY";
export const CHAT_ID = "CHAT_ID";
```

### Running 

To run you need the url of the search that the bot will keep looking, then run the following command:

```
npm run start -- SEARCH_URL
```