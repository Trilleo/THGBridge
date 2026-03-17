require('dotenv').config();
const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

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

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// ==============================
// Relay: Minecraft Guild Chat → Discord
// ==============================
mcBot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString();

    // Filter for guild chat messages
    if (msg.includes('[Guild]')) {
        discordClient.channels.fetch(DISCORD_CHANNEL_ID)
            .then(channel => {
                // Clean up Minecraft formatting codes (§c, §6, etc.)
                const cleanMsg = msg.replace(/§./g, '');
                channel.send(`\`\`\`${cleanMsg}\`\`\``);
            })
            .catch(console.error);
    }
});

// ==============================
// Relay: Discord → Minecraft Guild Chat
// ==============================
discordClient.on('messageCreate', message => {
    // Ignore bot messages and wrong channel
    if (message.author.bot || message.channel.id !== DISCORD_CHANNEL_ID) return;

    // Send to Hypixel guild chat
    const discordUser = message.author.username;
    const discordMsg = message.content;
    mcBot.chat(`/gc [Discord] ${discordUser}: ${discordMsg}`);
});

// ==============================
// Event Handlers
// ==============================
mcBot.on('spawn', () => {
    console.log('✓ Minecraft bot spawned on Hypixel!');
    mcBot.chat('/gchat on'); // Enable guild chat
});

mcBot.on('error', (err) => {
    console.error('Minecraft Bot Error:', err);
});

discordClient.once('ready', () => {
    console.log(`✓ Discord bot logged in as ${discordClient.user.tag}`);
});

// ==============================
// Login
// ==============================
mcBot.on('login', () => {
    console.log('Logging into Hypixel...');
});

discordClient.login(process.env.DISCORD_TOKEN);