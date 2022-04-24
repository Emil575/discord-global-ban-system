const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const Model = require('../../model/channel');
module.exports = {
    name: 'globalban',
    aliases: [''],
    categories: '',
    userperm: [],
    botperm: [],
    ownerOnly: false,
    description: '',
    cooldown: 5,
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You can not use this command!\nYou need **ADMINISTRATOR** permission!');
        let BanMember = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``) || await message.guild.members.fetch(args[0] ? args[0] : ``).catch(() => {}) || false;
        if (!BanMember) return message.channel.send('You need to mention a member or provide a user ID!');
        if (BanMember.id == message.author.id) return message.channel.send('You can not ban yourself!');
        if (BanMember.id == client.user.id) return message.channel.send('You can not ban the bot!');
        if (BanMember.id == message.guild.ownerId) return message.channel.send('You can not ban the server owner!');
        if (BanMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send('You can not ban a member with a higher or equal role than you!');
        if (BanMember.roles.highest.position >= message.guild.roles.everyone) return message.channel.send('You can not ban a member with a higher or equal role than everyone!');
        if (!BanMember.bannable) return message.channel.send('I can not ban this member!');
        let reason = args.slice(1).join(' ');
        if (reason.length < 15) return message.channel.send('Reason must be at least 15 characters long!');
        if (!reason) return message.channel.send('plse provide a reason!');

        client.guilds.cache.forEach(async (guild) => {
            const embedforall = new MessageEmbed()
                .setTitle('Global Ban')
                .setDescription(`Hello Owner and Server Moderators,\n\n**${message.author.username}** from Server *${message.guild.name}* requested to ban **${BanMember.user.tag}** from all the server!\n\nReason: ${reason}\n\nDo you want to ban this user from your Server too?\n\n You have 1h to respond or your vote is no!`)
                .addField('ServerInfo', `Server: **${message.guild.name}**\nOwner: **<@${message.guild.ownerId}>**\nID: **${message.guild.id}**\nMembers: **${message.guild.memberCount}**`)
                .addField('Target Info', `User: **${BanMember.user.tag}**\nID: **${BanMember.id}**\nDiscord Since: **${BanMember.user.createdAt.toLocaleString()}**\nIn Your Server Since: **${BanMember.joinedAt.toLocaleString()}**`, true)
                .addField('Moderator', `User: **${message.author.tag}**\nID: **${message.author.id}**\nDiscord Since: **${message.author.createdAt.toLocaleString()}**\nHeigest Role in the Server *${message.guild.name}*: **${message.member.roles.highest.name}**`, true)
                .setColor('#0097ff')
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username}|| **DONT DELETE THIS EMBED/MESSAGE!**`);
            const yesButton2 = new MessageButton()
                .setCustomId('yes_ban_all')
                .setEmoji('<a:yes_emil:927126087593504798>')
                .setLabel('YES')
                .setStyle('SUCCESS')
            //enter the userid in the database
            client.banmembers.set('BanMembers', BanMember.id, 'banMember')
            //enter the userid in the database
            const nobutton2 = new MessageButton()
                .setCustomId('no_ban_all')
                .setEmoji('<:no:927126358163861504> ')
                .setLabel('NO')
                .setStyle('DANGER')

            const row = new MessageActionRow()
                .addComponents(yesButton2, nobutton2)
            if (guild.id == message.guild.id) return;
            try {
                const b = await Model.findOne({
                    guildId: guild.id
                })
                if (b) {
                    const otherSr = client.guilds.cache.get(guild.id)
                    const otherCh = otherSr.channels.cache.get(b.channelId)
                    otherCh.send({
                        embeds: [embedforall],
                        components: [row]
                    })
                }
            } catch (error) {
                console.log(error)
                message.channel.send({
                    content: `An error occured!\n${error}Pls send this to the developer!`,
                })
            }
            // setTimeout(() => {
            //     guild.channels.cache.find(channel => channel.name === 'global-ban-requests').messages.fetch({
            //         limit: 1
            //     }).then(messages => {
            //         messages.first().delete();
            //     })
            // }, ms('1h'));
        })


        const yesButton = new MessageButton()
            .setCustomId('yes_ban')
            .setEmoji('<a:yes_emil:927126087593504798>')
            .setLabel('YES')
            .setStyle('SUCCESS')

        const nobutton = new MessageButton()
            .setCustomId('no_ban')
            .setEmoji('<:no:927126358163861504> ')
            .setLabel('NO')
            .setStyle('DANGER')

        const row = new MessageActionRow()
            .addComponents(yesButton, nobutton)

        const embe0d = new MessageEmbed()
            .setTitle('Global Ban')
            .setDescription(`Hey ${message.author.username}!\nYou are about to ban **${BanMember.user.username}** from all servers where the bot is in!\nAre you sure you want to do this? (yes/no)\n\nReason: ${reason}\n\nThis action cannot be undone!\n\n you have 30sec to respond!`)
            .setColor('#ff0000')
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`);
        message.channel.send({
            embeds: [embe0d],
            components: [row],
        })
        // }).then(async msg => {
        //     const collector = message.channel.createMessageComponentCollector({
        //         filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
        //         time: 30000,
        //         componentType: 'BUTTON',
        //         max: 1,
        //         errors: ['time']
        //     });
        //     collector.on('collect', async m => {
        //         if (m.customId === 'yes_ban') {
        //             collector.stop();
        //             msg.delete();
        //             const globanEmbed2 = new MessageEmbed()
        //                 .setTitle('Global Ban')
        //                 .setDescription(`You have successfully banned the user from all the server who im in all server: **${client.guilds.cache.size.toFixed()}**`)
        //                 .setColor('#ff0000')
        //                 .setTimestamp()
        //                 .setFooter(`Requested by ${message.author.username}`);
        //             message.channel.send({
        //                 embeds: [globanEmbed2]
        //             }).then(async msg => {
        //                 // await BanMember.ban({
        //                 //     reason: reason,
        //                 //     days: 0
        //                 // }).catch(err => {
        //                 //     console.log(err);
        //                 // });

        //             })
        //         } else if (m.customId === 'no_ban') {
        //             collector.stop();
        //             const globanEmbed3 = new MessageEmbed()
        //                 .setTitle('Global Ban')
        //                 .setDescription(`You have successfully cancelled the ban!`)
        //                 .setColor('#ff0000')
        //                 .setTimestamp()
        //                 .setFooter(`Requested by ${message.author.username}`);
        //             message.reply({
        //                 embeds: [globanEmbed3],
        //             }).catch(err => {
        //                 console.log(err);
        //             });
        //         }
        //     })
        //     collector.on('end', (c, r) => {
        //         if (r == 'time') {
        //             msg.delete();
        //             const globanEmbed4 = new MessageEmbed()
        //                 .setTitle('Global Ban')
        //                 .setDescription(`You have failed to respond in time!`)
        //                 .setColor('#fffb00')
        //                 .setTimestamp()
        //                 .setFooter(`Requested by ${message.author.username}`);
        //             message.channel.send({
        //                 embeds: [globanEmbed4]
        //             }).catch(err => {
        //                 console.log(err);
        //             });
        //         }
        //     })
        // })
    }
}