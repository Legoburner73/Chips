ex = {
  name: 'chipsprefix',
  async func(msg, { member, guild, args, reply }) {
    if (!guild) return reply('You must be in a guild to use this command!');

    let action;
    if (!args[0]) args[0] = 'status';
    action = args[0];

    console.log(`[Custom prefix] Action: ${action}`);

    if (action == 'status') {
      return reply(`The prefix for this server is: \`\`${client.customprefix[guild.id] ? client.customprefix[guild.id] : prefix}\`\``);
    } else if (action == 'set') {
      if (!args[1]) { return reply('No custom prefix given to set!'); } else {
        let newprefix = _.drop(args).join(' ').toLowerCase();
        client.customprefix[guild.id] = newprefix;
        filter = require(path.join(__dirname, '../../../handlers', 'Filter'))();
        console.log(`${member.user.tag} changed prefix for guild ${guild.id}: ${newprefix}`);
        client.database._sheets.prefixes.addRow({ guildid: guild.id, prefix: newprefix });
        return reply(`Prefix __${_.escapeRegExp(newprefix)}__ set as my prefix successfully!`);
      }
    } else if (action == 'reset' || action == 'off') {
      if (!client.customprefix[guild.id] || client.customprefix[guild.id] == prefix) return reply(`Custom prefix is not enabled! Set a custom prefix for me with \`\`${prefix}chipsprefix set\`\``);
      client.customprefix[guild.id] = prefix;
      client.database._sheets.prefixes.addRow({ guildid: guild.id, prefix });
      return reply(`Custom prefix reset! My prefix is now \`\`${client.customprefix[guild.id]}\`\``);
    } else if (action == 'on') {
      if (!client.customprefix[guild.id] || client.customprefix[guild.id] == prefix) return reply(`Set a custom prefix for me with \`\`${prefix}chipsprefix set\`\``);
      else return reply(`A prefix has already been set for this server! Check it with __${_.escapeRegExp(client.customprefix[guild.id])}chipsprefix status__`);
    }
  },
};

module.exports = ex;
