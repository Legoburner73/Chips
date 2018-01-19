const cache = new Map;

module.exports = {
  name: 'invert',
  async func(msg, { send, author, member, Discord, channel, Constants }) {
    channel.startTyping();
    try {
      const target = msg.mentions.users.first() || author;

      if (!cache.has(target.id)) {
        const result = await require('snekfetch').get(`${Constants.APIURL}invert`)
          .set('src', target.displayAvatarURL({ format: 'png', size: 2048 }));
        const buffer = result.body instanceof Buffer ? result.body : Buffer.from(result.body, 'base64');
        cache.set(target.id, buffer);
      }

      send(new Discord.MessageEmbed()
        .setColor(member ? member.displayColor : 134984)
        .attachFiles([{ attachment: cache.get(target.id), name: 'image.png' }])
        .setImage('attachment://image.png')
        .setFooter(`Requested by: ${author.tag}`));
      return channel.stopTyping();
    } catch (err) {
      send('Inverted avatar generation failed...');
      channel.stopTyping();
      throw err;
    }
  },
};
