require('dotenv').config();
const path = require('path');
const mineflayer = require('mineflayer');
const { Authflow } = require('prismarine-auth');
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const bridge = require('./bridge');

async function start() {
    const profilesFolder = path.join(__dirname, '..', '.minecraft-auth');

    const flow = new Authflow(process.env.MINECRAFT_USERNAME, profilesFolder);
    await flow.getMinecraftJavaToken({ fetchProfile: true });

    const mcBot = mineflayer.createBot({
        host: 'mc.hypixel.net',
        username: process.env.MINECRAFT_USERNAME,
        auth: 'microsoft',
        version: '1.8.9',
        profilesFolder });

    const discordClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages ]
    });

    const token = process.env.DISCORD_TOKEN;
    if (!token) throw new Error('Missing DISCORD_TOKEN in .env');

    bridge.mcBot = mcBot;
    bridge.discordClient = discordClient;
    bridge.discordChannelId = process.env.DISCORD_CHANNEL_ID;

    eventHandler(discordClient, path.join(__dirname, 'events', 'discord'));
    eventHandler(mcBot, path.join(__dirname, 'events', 'minecraft'));

    await discordClient.login(token);
}

start().catch((error) => {
    console.error('Startup error:', error);
});
