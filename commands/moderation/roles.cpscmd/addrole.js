module.exports = {
  name: 'addrole',
  async func(msg, { send, guild, args, content, member, Discord, author }) {
    if (!guild) {
      return send('You cannot use this command in Direct Messages.');
    }

    if (!args[0].match(/^[^]*<@!?(\d+)>[^]*$/) && !args[1].match(/^[^]*<@!?(\d+)>[^]*$/)) {
      return send('Mention?');
    }

    if (!args[1]) {
      return send('Role?');
    }

    if (args[0].match(/^[^]*<@!?(\d+)>[^]*$/) && args[1] && !author.id === '205608598233939970') {
      let targetUser = msg.mentions.members.first();
      let targetRole = content.substring(content.indexOf(args[1]));
      let targetRoleSend = guild.roles.find('name', `${targetRole}`);
      if (member.highestRole.position > targetRoleSend.position) {
        await targetUser.addRole(guild.roles.find('name', `${targetRole}`));
        return send(new Discord.MessageEmbed()
          .setColor(member.displayColor)
          .setDescription(`**Succesfully gave** <@&${targetRoleSend.id}> || **${targetRole}** **to** <@${targetUser.id}> || ${targetUser.username}`));
      }
    } else {
      let targetUser = msg.mentions.members.first();
      let targetRole = content.substring(content.indexOf(args[1]));
      let targetRoleSend = guild.roles.find('name', `${targetRole}`);
      await targetUser.addRole(guild.roles.find('name', `${targetRole}`));
      return send(new Discord.MessageEmbed()
        .setColor(member.displayColor)
        .setDescription(`**Succesfully gave** <@&${targetRoleSend.id}> || **${targetRole}** **to** <@${targetUser.id}> || ${targetUser.username}`));
    }
  },
};
