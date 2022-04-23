const client = require("..")


client.on('guildCreate', async(guild) => {
    guild.members.fetch()
    let owner = guild.ownerId
    let HomeServer = client.guilds.cache.find(g => g.id === '925689096037343253')
    let member = HomeServer.members.cache.find(m => m.id === owner)
    if(!member) return
    member.roles.add('966637454616584212')
})