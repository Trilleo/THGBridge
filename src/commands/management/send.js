const { ApplicationCommandOptionType } = require('discord.js');
const bridge = require('../../bridge');
const { isAdmin } = require('../../utils/adminRoles');

module.exports = {
    name: 'send',
    description: 'Send a message to the Minecraft guild chat.',
    options: [
        {
            name: 'message',
            description: 'The message to send to guild chat.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        if (!isAdmin(interaction.member)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true,
            });
        }

        const mcBot = bridge.mcBot;
        if (!mcBot || !bridge.mcBotConnected) {
            return interaction.reply({
                content: '❌ The Minecraft bot is not connected.',
                ephemeral: true,
            });
        }

        const message = interaction.options.getString('message');

        try {
            mcBot.chat(`/gc ${message}`);
        } catch (error) {
            return interaction.reply({
                content: '❌ Failed to send the message to guild chat.',
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: `✅ Message sent to guild chat.`,
            ephemeral: true,
        });
    },
};
