const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const Model = require('../../model/channel');
module.exports = {
    name: 'autosetup',
    aliases: ['auto'],
    categories: '',
    userperm: ['ADMINISTRATOR'],
    botperm: ['ADMINISTRATOR'],
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
        const BanRequestChannel = message.guild.channels.cache.find(c => c.name === 'global-ban-requests');
        const BanLogChannel = message.guild.channels.cache.find(c => c.name === 'global-ban-log');
        if (BanRequestChannel || BanLogChannel) return message.reply({
            content: `One of this channels \`global-ban-requests\` or \`global-ban-log\` exist\n\nYou wont to fix it?\nThen delete one of the follwing channels: \`global-ban-requests\` or \`global-ban-log\`and the category \`global-ban\` and then run the command again.`
        });
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Auto Setup')
            .setDescription('This is the auto setup command!\nPls wait for the setup to finish...')
            .setTimestamp();
        const msg = message.channel.send({
            embeds: [embed]
        });
        const Parent = await message.guild.channels.create('global-ban', {
            type: 'GUILD_CATEGORY',
            reason: 'Auto setup',
        })
        message.guild.channels.create('global-ban-requests', {
            parent: Parent.id,
            permissionOverwrites: [{
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL']
                }
            ],
            topic: 'Global ban requests channel',
            type: 'GUILD_TEXT',
            reason: 'Auto setup',
        }).then(async channel => {
            Model.findOne({
                guildId: message.guild.id
            }, async(err, data) => {
                if(err) return console.log(err);
                if(!data){
                    await Model.create({
                        guildId: message.guild.id,
                        channelId: channel.id,
                    })
                } else {
                    data.channelId = channel.id;
                    data.save();
                }
            })
            // quickdb.set(`g_${message.guild.id}`, `${channel.id}`)
            // client.settings.set(message.guild.id, channel.id, 'BanChannel');
            const embed = new MessageEmbed()
            .setTitle('Global Ban Requests Channel')
            .setDescription(`This channel have the function to get all incomming ban requests from the other Servers.\n\nAfter that you have embed like in the Thumbnail withe 2 buttons \`yes\` and \`no\` when you click *yes* the user gets banned from your Server.\nWhen you click *no* the user gets not banned from your Server and he can still join the Server.`)
            .setThumbnail(`https://cdn.discordapp.com/attachments/967464583482720256/967464660066508840/Screenshot_2022-04-23_182202.png`)
            .setFooter(`Made withe ❤️ by ${client.users.cache.get('623345279390973982').tag}`)
            channel.send({
                embeds: [embed]
            })
        })

        message.guild.channels.create('global-ban-log', {
            // parent: Parent.id,
            parent: Parent.id,
            permissionOverwrites: [{
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL']
                }
            ],
            topic: 'Global ban log channel',
            type: 'GUILD_TEXT',
            reason: 'Auto setup',
        }).then(async channel => {
            client.settings.set(message.guild.id, channel.id, 'BanLogChannel');
        })
        await (await msg).delete();
        const embed2 = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Auto Setup')
            .setDescription(`Setup finished!\nYou can now use the bot!\nCheck out the categorie: <#${Parent.id}>`)
            .addField(`Raname the Channels`, `Pls do not rename the channel \`BanLogChannel\` and \`global-ban-requests\` the \`global-ban\` category is the one think you can rename this will be fixed in the new update\n\nFor Updates join the [Support Server](https://discord.gg/6exjkK9e)`)
            .setFooter(`Made with ❤️ by ${client.users.cache.get('623345279390973982').tag}`)
            .setTimestamp();
        message.channel.send({
            embeds: [embed2]
        })
    }
}