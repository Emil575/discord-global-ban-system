const client = require("..")
const {
    MessageEmbed
} = require('discord.js')
const ms = require('ms')

client.on('interactionCreate', async (interaction) => {
    const {
        guild
    } = interaction;
    if (!interaction.isButton()) return;
    if (interaction.isButton()) {
        await interaction.deferReply({
            ephemeral: true
        }).catch(() => {});
        const user = client.banmembers.get('BanMembers', 'banMember')
        if (interaction.customId === 'yes_ban_all') {
            //get the user id from the "database" is not a rly database bc is a short storage for the user id
            const user = client.banmembers.get('BanMembers', 'banMember')
            // ban the user from you Server
            guild.bans.create(user, {
                reason: 'Global Ban'
            }).catch(err => {
                console.log(err)
                interaction.followUp({
                    content: 'An error occured while trying to ban the user!\n\nError: ' + err + '\n\nPlease contact the bot owner on the support Server!'
                })
            })
            //send the embed in you server
            const embed = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`You have successfully banned the user <@${user}> from your server!`)
                .setColor('#ff0000')
                .setTimestamp()
                .setFooter(`Button clicked by ${interaction.user.username}`);
            interaction.followUp({
                    embeds: [embed],
                    ephemeral: true
                })
                //delete the embed after 10 seconds
                .then(() => {
                    setTimeout(() => {
                        interaction.message.delete();
                    }, 10000);
                })
                .catch(() => {});

            const LogChannel = client.settings.get(interaction.guild.id, 'BanLogChannel')
            if (!LogChannel) return;
            const channel = interaction.guild.channels.cache.find(c => c.id === LogChannel)
            if (!channel) return;
            const yesEmbed = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`You have successfully banned <@${user}> from you server!`)
                .addField('ServerInfo', `Server: **${interaction.guild.name}**\nOwner: **<@${interaction.guild.ownerId}>**\nID: **${interaction.guild.id}**\nMembers: **${interaction.guild.memberCount}**`)
                .addField('Target Info', `User: **<@${user}>**\nID: **${user}**`, true)
                .addField('Moderator (Button Clicker)', `User: **${interaction.user.tag}**\nID: **${interaction.user.id}**\nDiscord Since: **${interaction.user.createdAt.toLocaleString()}**\Highest Role in your Server: **${interaction.member.roles.highest.name}**`, true)
                .setColor('#00ffbf')
                .setTimestamp()
                .setFooter(`Yes Button clicked by ${interaction.user.username}`);

            channel.send({
                embeds: [yesEmbed]
            })

        } else if (interaction.customId === 'no_ban_all') {
            const embed = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`You have successfully cancelled the ban!`)
                .setColor('#ff0000')
                .setTimestamp()
                .setFooter(`Button clicked by ${interaction.user.username}`);
            interaction.followUp({
                    embeds: [embed],
                    ephemeral: true
                })
                //delete the embed after 10 seconds
                .then(() => {
                    setTimeout(() => {
                        interaction.message.delete();
                    }, 10000);
                })
                .catch(() => {});
            const LogChannel = client.settings.get(interaction.guild.id, 'BanLogChannel')
            if (!LogChannel) return;
            const channel = interaction.guild.channels.cache.find(c => c.id === LogChannel)
            if (!channel) return;
            const noEmbed = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`You have successfully cancelled the ban!`)
                .addField('ServerInfo', `Server: **${interaction.guild.name}**\nOwner: **<@${interaction.guild.ownerId}>**\nID: **${interaction.guild.id}**\nMembers: **${interaction.guild.memberCount}**`)
                .addField('Target Info', `User: **<@${user}>**\nID: **${user}**`, true)
                .addField('Moderator (Button Clicker)', `User: **${interaction.user.tag}**\nID: **${interaction.user.id}**\nDiscord Since: **${interaction.user.createdAt.toLocaleString()}**\nHeigest Role in your Server: **${interaction.member.roles.highest.name}**`, true)
                .setColor('#fffb00')
                .setTimestamp()
                .setFooter(`No Button clicked by ${interaction.user.username}`);
                channel.send({embeds: [noEmbed]})
        }
    }
})