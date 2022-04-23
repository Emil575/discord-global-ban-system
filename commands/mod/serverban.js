const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'ban',
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
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('You can not use this command!\nYou need **BAN_MEMBERS** permission!');
        let BanMember = message.mentions.members.filter(member => member.guild.id == message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``) || await message.guild.members.fetch(args[0] ? args[0] : ``).catch(() => {}) || false;
        if (!BanMember) return message.channel.send('You need to mention a member or provide a user ID!');
        if (BanMember.id == message.author.id) return message.channel.send('You can not ban yourself!');
        if (BanMember.id == client.user.id) return message.channel.send('You can not ban the bot!');
        if (BanMember.id == message.guild.ownerId) return message.channel.send('You can not ban the server owner!');
        if (BanMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send('You can not ban a member with a higher or equal role than you!');
        if (BanMember.roles.highest.position >= message.guild.roles.everyone) return message.channel.send('You can not ban a member with a higher or equal role than everyone!');
        if (!BanMember.bannable) return message.channel.send('I can not ban this member!');
        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided';

        BanMember.ban({
            reason: reason
        }).then(() => {
            message.channel.send(`${BanMember.user.tag} has been banned!`);
        }).catch(err => {
            message.channel.send(`An error occured: ${err}`);
        });
    }
}