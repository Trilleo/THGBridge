const bridge = require('../../../bridge');

module.exports = (client, message) => {
    // Ignore bot messages and wrong channel
    if (message.author.bot || message.channel.id !== bridge.discordChannelId) return;

    // Send to Hypixel guild chat
    const discordUser = message.author.username;
    const discordMsg = message.content;
    bridge.mcBot.chat(`/gc [Discord] ${discordUser}: ${discordMsg}`);
};
