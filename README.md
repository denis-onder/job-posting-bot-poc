# Proof of concept: Job post filtering bot

> This repository serves as a PoC for a module for the r/webdev Discord server's support bot.

Acquire your token by creating an application/bot on the [Discord Developer Portal](https://discordapp.com/developers/applications).

Invite your bot by visiting this URL [https://discordapp.com/oauth2/authorize?client_id=YOUR_TOKEN&scope=bot](https://discordapp.com/oauth2/authorize?client_id=YOUR_TOKEN&scope=bot)

Keyword: `!post`

Commands:
1. `new` - Creates a new job posting

Example usage: `!post new`

### Usage:

1. `cp example.env ./.env #Provide your own token and specify output channel`
2. `npm install`
3. `node .`
  
