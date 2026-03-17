const bridge = require('../../bridge');

module.exports = {
    name: 'ping',
    description: 'Display the bot\'s network status.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const discordPing = client.ws.ping;

        let mcStatus = 'Offline';
        const mcBot = bridge.mcBot;
        if (mcBot && mcBot.player) {
            const mcPing = mcBot.player.ping;
            mcStatus = `Online (${mcPing}ms)`;
        }

        const reply = await interaction.fetchReply();
        const roundtrip = reply.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(
            `🏓 **Pong!**\n` +
            `> **Discord API:** ${discordPing}ms\n` +
            `> **Roundtrip:** ${roundtrip}ms\n` +
            `> **Minecraft:** ${mcStatus}`
        );
    },
};
