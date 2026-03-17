const bridge = require('../../../bridge');

module.exports = async (client, jsonMsg) => {
    const msg = jsonMsg.toString();

    // Filter for guild chat messages
    if (msg.includes('[Guild]')) {
        try {
            const channel = await bridge.discordClient.channels.fetch(bridge.discordChannelId);
            // Clean up Minecraft formatting codes (§c, §6, etc.)
            const cleanMsg = msg.replace(/§./g, '');
            await channel.send(`\`\`\`${cleanMsg}\`\`\``);
        } catch (error) {
            console.error(error);
        }
    }
};
