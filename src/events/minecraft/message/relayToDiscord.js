const bridge = require('../../../bridge');

module.exports = async (client, jsonMsg) => {
    const msg = jsonMsg.toString();

    // Filter for guild chat messages
    if (msg.includes('[Guild]')) {
        bridge.discordClient.channels.fetch(bridge.discordChannelId)
            .then(channel => {
                // Clean up Minecraft formatting codes (§c, §6, etc.)
                const cleanMsg = msg.replace(/§./g, '');
                channel.send(`\`\`\`${cleanMsg}\`\`\``);
            })
            .catch(console.error);
    }
};
