const {
    MessageEmbed
} = require("discord.js")
const client = require("..")

client.on('guildCreate', async guild => {
    client.settings.ensure(guild.id, {
        BanChannel: "",
        BanLogChannel: "",
    })
    const embed = new MessageEmbed()
        .setTitle("Guild Join")
        .setDescription(`+1 guild`)
        .setColor('GREEN')
        .setTimestamp()
        .setFooter(client.guilds.cache.size.toFixed())
        const bestGuild = client.guilds.cache.find(ch => ch.id === '925689096037343253')
        const channel = bestGuild.channels.cache.find(ch => ch.id === '966243009412857896')
    channel.send({
        embeds: [embed]
    })
})

client.on('guildDelete', async guild => {
    const embed = new MessageEmbed()
        .setTitle("Guild Leave")
        .setDescription(`-1 guild`)
        .setColor('RED')
        .setTimestamp()
        .setFooter(client.guilds.cache.size.toFixed())
        const bestGuild = client.guilds.cache.find(ch => ch.id === '925689096037343253')
        const channel = bestGuild.channels.cache.find(ch => ch.id === '966243009412857896')
    channel.send({
        embeds: [embed]
    })
})