const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: 'support',
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
        const embed = new MessageEmbed()
        .setTitle('Support')
        .setDescription(`For support, please join the support server or dm the owner from the bot ${client.users.cache.get('623345279390973982').tag}.\n\n[Support Server](https://discord.gg/gD5F3Vphc6)`)
        .setColor('#0099ff')
        .setFooter(`Made withe ❤️ by ${client.users.cache.get('623345279390973982').tag}`)
        message.reply({
            embeds: [embed],
            allowedMentions: {
                users: false
            }
        })
    }
}