require('dotenv').config();
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const bridge = require('./bridge');
const createMcBot = require('./utils/createMcBot');

async function start() {
    await createMcBot();

    const discordClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages ]
    });

    const token = process.env.DISCORD_TOKEN;
    if (!token) throw new Error('Missing DISCORD_TOKEN in .env');

    bridge.discordClient = discordClient;
    bridge.discordChannelId = process.env.DISCORD_CHANNEL_ID;

    eventHandler(discordClient, path.join(__dirname, 'events', 'discord'));

    await discordClient.login(token);
}

start().catch((error) => {
    console.error('Startup error:', error);
});
