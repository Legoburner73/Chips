const cache = new Map;

module.exports = {
  name: 'invert',
  async func(msg, { send, author, member, Discord, channel, Constants }) {
    channel.startTyping();
    try {
      const target = msg.mentions.users.first() || author;
      const hash = target.avatar || target.id
      if (!cache.has(hash)) {
        const result = await require('snekfetch').get(`${Constants.APIURL}invert`)
          .set('Authorization', process.env.RETHINKPSWD)
          .set('src', target.displayAvatarURL({ format: 'png', size: 2048 }));
        const buffer = result.body instanceof Buffer ? result.body : Buffer.from(result.body, 'base64');
        cache.set(hash, buffer);
      }

      send(new Discord.MessageEmbed()
        .setColor(member ? member.displayColor : 134984)
        .attachFiles([{ attachment: cache.get(hash), name: 'image.png' }])
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
