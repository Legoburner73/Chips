module.exports = {
  name: 'support',
  async func(msg, { author, send, guild }) {
    if (guild) return send('The support command must be used in dms with `-` as the prefix!').then(mm => mm.delete({ timeout: 10000 }));
    const used = author;
    return used.send(`**As you requested (msg id: ${msg.id}), here is the Support Server link: https://discord.gg/jj5FzF7**`);
    // Return send(`Support server link has been sent to ${used}'s direct messages!`);
  },
};
