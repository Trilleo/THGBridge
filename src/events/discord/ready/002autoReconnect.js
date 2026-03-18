const bridge = require('../../../bridge');
const createMcBot = require('../../../utils/createMcBot');

module.exports = (client) => {
    setInterval(async () => {
        if (bridge.mcBotConnected || bridge.reconnecting) return;

        bridge.reconnecting = true;
        console.log('Detected Minecraft bot disconnection. Attempting to reconnect...');

        try {
            await createMcBot();
            console.log('Reconnection attempt initiated.');
        } catch (error) {
            console.error('Auto-reconnect failed:', error);
        } finally {
            bridge.reconnecting = false;
        }
    }, 60_000);
};
