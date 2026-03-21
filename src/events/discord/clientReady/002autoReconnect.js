const bridge = require('../../../bridge');
const createMcBot = require('../../../utils/createMcBot');

async function sendLogMessage(message) {
    if (!bridge.logChannelId || !bridge.discordClient) return;
    try {
        const channel = await bridge.discordClient.channels.fetch(bridge.logChannelId);
        await channel.send(message);
    } catch (error) {
        console.error('Failed to send log channel notification:', error);
    }
}

module.exports = (client) => {
    setInterval(async () => {
        if (bridge.mcBotConnected || bridge.reconnecting) return;

        bridge.reconnecting = true;
        console.log('Detected Minecraft bot disconnection. Attempting to reconnect...');
        await sendLogMessage('⚠️ Detected Minecraft bot disconnection. Attempting to reconnect...');

        try {
            await createMcBot();
            console.log('Reconnection attempt initiated.');
            await sendLogMessage('🔄 Reconnection attempt started.');
        } catch (error) {
            console.error('Auto-reconnect failed:', error);
            await sendLogMessage(`❌ Auto-reconnect failed: ${error.message}`);
        } finally {
            bridge.reconnecting = false;
        }
    }, 10_000);
};
