const {
  MessageEmbed,
  Collection
} = require("discord.js");
var config = require("../config/config.json");
var ee = require("../config/config.json");
const client = require("..");
const prefix = config.prefix;


client.on("messageCreate", async (message) => {
  if(message.author.bot) return
  // const RenameChannel1 = new MessageEmbed()
  // .setTitle("**Rename Channel**")
  // .setDescription(`Pls delete the channel \`global-ban-log\` or what ever the name from the channel is bc i can't find the channel bc you rename it\n\nIf this a bug report that on the [Support Server](https://discord.gg/gD5F3Vphc6)`)
  // .setColor("#00f9ff")
  // .setFooter(`Made withe ❤️ by ${client.users.cache.get('623345279390973982').tag}`)


  // const RenameChannel2 = new MessageEmbed()
  // .setTitle("**Rename Channel**")
  // .setDescription(`Pls delete the channel \`global-ban-requests\` or what ever the name from the channel is bc i can't find the channel bc you rename it\n\nIf this a bug report that on the [Support Server](https://discord.gg/gD5F3Vphc6)`)
  // .setColor("#00f9ff")
  // .setFooter(`Made withe ❤️ by ${client.users.cache.get('623345279390973982').tag}`)
  // /* It's just a database for the bot to store the settings of the guild. */
  // //ensure the database
  // client.settings.ensure(message.guild.id, {
  //   BanChannel: "",
  //   BanLogChannel: "",
  // })
  // client.banmembers.ensure('BanMembers', {
  //   banMember: "",
  // })
  // const channel = message.guild.channels.cache.find(ch => ch.name === 'global-ban-log')
  // if(!channel) return message.channel.send({
  //   embeds: [RenameChannel1]
  // })
  // const channel2 = message.guild.channels.cache.find(ch => ch.name === 'global-ban-requests')
  // if(!channel2) return message.channel.send({
  //   embeds: [RenameChannel2]
  // })
  // client.settings.set(message.guild.id, channel.id, `BanLogChannel`)
  // client.settings.set(message.guild.id, channel2.id, `BanChannel`)

  const {
    escapeRegex,
    onCoolDown
  } = require("../utils/function");
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  // getting mention prefix
  if (cmd.length === 0) {
    if (matchedPrefix.includes(client.user.id)) {
      const mention = new MessageEmbed()
        .setDescription(`*To see all Commands* \ntype: \`${config.prefix}help\``)
        .setFooter('© GlobalBanSystem')
      message.reply({
        embeds: [mention],
        allowedMentions: {
          repliedUser: false
        }
      });
    }
  }

  ///starting commands & aliases
  const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;
  if (command) {
    let userperm = new MessageEmbed().setDescription(
      `*<a:wrong:885815677091454986> You Need **${command.userperm}** Permission*`
    );

    if (!message.member.permissions.has(command.userperm || []))
      return message.channel.send({
        embeds: [userperm]
      });



    //Check if user is on cooldown with the cmd
    if (onCoolDown(message, command)) {
      let cool = new MessageEmbed()
        .setDescription(`*<a:wrong:885815677091454986> Please wait **${onCoolDown(message, command)}** Second(s) before reusing this ${command.name} command!*`)
      return message.channel.send({
        embeds: [cool]
      })
    }

    let botperm = new MessageEmbed().setDescription(
      `*<a:wrong:885815677091454986> I Need **${command.botperm}** Permission*`
    );
    if (!message.guild.me.permissions.has(command.botperm || []))
      return message.channel.send({
        embeds: [botperm]
      });

    /// owner only command handler
    const {
      owners
    } = require("../config/config.json");
    if (command) {
      if (command.ownerOnly) {
        if (!owners.includes(message.author.id)) {
          let ownerOnly = new MessageEmbed()
            .setDescription("*<a:wrong:885815677091454986> Only Bot Developer can use this command!*")
          return message.channel.send({
            embeds: [ownerOnly]
          })
        }
      }
    }

    if (command) command.run(client, message, args, prefix);



  }

  // new start from here
});