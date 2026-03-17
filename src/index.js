require('dotenv').config();
const path = require('path');
const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const bridge = require('./bridge');

// === Minecraft Bot Config ===
const mcBot = mineflayer.createBot({
    host: 'mc.hypixel.net',
    username: process.env.MINECRAFT_USERNAME,
    password: process.env.MINECRAFT_PASSWORD,
    auth: 'microsoft', // Required for Hypixel
    version: '1.8.9'   // Hypixel version
});

// === Discord Bot Config ===
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// === Shared Bridge State ===
bridge.mcBot = mcBot;
bridge.discordClient = discordClient;
bridge.discordChannelId = process.env.DISCORD_CHANNEL_ID;

// === Register Events ===
eventHandler(discordClient, path.join(__dirname, 'events', 'discord'));
eventHandler(mcBot, path.join(__dirname, 'events', 'minecraft'));

// === Login ===
discordClient.login(process.env.DISCORD_TOKEN);