const client = require("..")
const {
    MessageEmbed
} = require('discord.js')

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.isButton()) {
        await interaction.deferReply({
            ephemeral: false
        }).catch(() => {});
        if (interaction.customId === 'yes_ban') {
            const user = client.banmembers.get('BanMembers', 'banMember')
            const embed = new MessageEmbed()
                .setTitle('Ban')
                .setDescription(`You have successfully banned the user from all the server who im in all server: **${client.guilds.cache.size.toFixed()}**`)
                .setColor('#ff0000')
                .setTimestamp()
                .setFooter(`Requested by ${interaction.message.username}`);
            interaction.followUp({
                embeds: [embed]
            }).then(async msg => {
                await interaction.guild.bans.create(user)
            }).catch(err => {
                console.log(err)
            }).then(() => {
                setTimeout(() => {
                    interaction.message.delete();
                }, 10000);
            })
            const LogChannel = client.settings.get(interaction.guild.id, 'BanLogChannel')
            if (!LogChannel) return;
            const channel = interaction.guild.channels.cache.find(c => c.id === LogChannel)
            if (!channel) return;
            const yesEmbed = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`You have successfully banned <@${user}> from you server!`)
                .addField('ServerInfo', `Server: **${interaction.guild.name}**\nOwner: **<@${interaction.guild.ownerId}>**\nID: **${interaction.guild.id}**\nMembers: **${interaction.guild.memberCount}**`)
                .addField('Target Info', `User: **<@${user}>**\nID: **${user}**`, true)
                .addField('Moderator (Button Clicker)', `User: **${interaction.user.tag}**\nID: **${interaction.user.id}**\nDiscord Since: **${interaction.user.createdAt.toLocaleString()}**\nHeigest Role in your Server: **${interaction.member.roles.highest.name}**`, true)
                .setColor('#00ffbf')
                .setTimestamp()
                .setFooter(`Yes Button clicked by ${interaction.user.username}`);

            channel.send({
                embeds: [yesEmbed]
            })
        } else if (interaction.customId === 'no_ban') {
            const embed = new MessageEmbed()
                .setTitle('Ban')
                .setDescription(`You have successfully cancelled the ban!`)
                .setColor('#ff0000')
                .setTimestamp()
                .setFooter(`Requested by ${interaction.message.username}`);
            interaction.followUp({
                embeds: [embed]
            }).catch(err => {
                console.log(err)
            }).then(() => {
                setTimeout(() => {
                    interaction.message.delete();
                }, 10000);
            })
        }
    }
})