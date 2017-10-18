const reg = /^(https?:\/\/[^.]+\.[^]+)$/;

module.exports = {
  name: "addemoji",
  async func(msg, { send, args, member, guild, author }) {

    if(guild.emojis.size>=50)
      return send('Maximum number of emojis reached (50)');
    
    if(author.id==='205608598233939970'==null&&!member.hasPermission('MANAGE_EMOJIS'))
      return send('no');

    if (!args[0])
      return send("No emoji name given :(");

    let name = args[0];

    if(!args[1])
      return send('No url given :(');

    const emojiurl = (args[1].match(reg)||[0,null])[1];

    if(!args[1].match(reg))
      return send("Ensure you've given a url!");

    let emoji;
    try {
      emoji = await guild.createEmoji(emojiurl, name);
      send(`Created new emoji with name ${emoji.name}!`);
    }catch(err){
      send('The emoji could not be created…');
      throw err;
    }
  }
};
