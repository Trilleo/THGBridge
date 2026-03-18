const bridge = require('../../bridge');

module.exports = {
    name: 'online',
    description: 'Sends the bot to the Hypixel lobby to prevent being kicked.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const mcBot = bridge.mcBot;

        if (!mcBot || !mcBot.player) {
            await interaction.editReply('❌ The Minecraft bot is currently offline.');
            return;
        }

        mcBot.chat('/lobby');
        await interaction.editReply('✅ The bot is attempting to login to Hypixel again.');
    },
};
