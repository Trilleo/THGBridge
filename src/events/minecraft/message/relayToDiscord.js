const { EmbedBuilder } = require('discord.js');
const bridge = require('../../../bridge');

module.exports = async (client, jsonMsg) => {
    const msg = jsonMsg.toString();
    // Clean up Minecraft formatting codes (§c, §6, etc.)
    const cleanMsg = msg.replace(/§./g, '');

    // Match guild chat messages: Guild > [Rank] Username [GuildRank]: message
    const chatMatch = cleanMsg.match(/Guild > (?:\[.+?\] )?(\w{1,16})(?: \[.+?\])?: (.+)/);
    if (chatMatch) {
        const username = chatMatch[1];
        const content = chatMatch[2];

        try {
            const channel = await bridge.discordClient.channels.fetch(bridge.discordChannelId);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: username,
                    iconURL: `https://mc-heads.net/avatar/${username}`,
                })
                .setDescription(content)
                .setColor(0x2ECC71)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
        return;
    }

    // Match guild join/leave messages: Guild > Username joined. / Guild > Username left.
    const joinLeaveMatch = cleanMsg.match(/Guild > (\w{1,16}) (joined|left)\./);
    if (joinLeaveMatch) {
        const username = joinLeaveMatch[1];
        const action = joinLeaveMatch[2];
        const color = action === 'joined' ? 0x2ECC71 : 0xE74C3C;
        const emoji = action === 'joined' ? '🟢' : '🔴';

        try {
            const channel = await bridge.discordClient.channels.fetch(bridge.discordChannelId);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: username,
                    iconURL: `https://mc-heads.net/avatar/${username}`,
                })
                .setDescription(`${emoji} **${username}** ${action}.`)
                .setColor(color)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
};
