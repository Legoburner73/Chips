
module.exports = {
  name: "-blacklist",
  async func(msg, {send, member, author, content, channel, guild, args, gMember, Discord, reply, bot}) {
    const used = member || author;

    if(!used.hasPermission("ADMINISTRATOR")){
      switch (used.id) {
        case Constants.users.WILLYZ:
        case Constants.users.PGSUPER:
        case Constants.users.ZALGO:
        case Constants.users.XZLQ:
        case Constants.users.KONEKO:
        case Constants.users.NELYN:
        case Constants.users.LOAF:
        case Constants.users.ARX:
          break;
        default:
          return reply('You must have Administrator perms to use this command!');
      }
    }

    let action;
    if (!args[0]) return send("No action given :(");
    else action = args[0];

    console.log("[Blacklist] Action: "+action);
    if(blacklist[guild.id]==null){
      console.log("[Filter] Creating new blacklist for guild " + guild.id);
      blacklist[guild.id]=['ok'];
    }

    if(action=="add"){
      if (!args[1]) return send("No keyword given to add to the blacklist");
      else{
        let keyword = content.slice(('-blacklist '+ action + ' ').length).toLowerCase();
        blacklist[guild.id].push(keyword);
        console.log(`New blacklist: ${blacklist}`);
        database.sheets['filter'].addRow({guildid: guild.id, keyword: keyword});
        return reply(`Keyword ${keyword} blacklisted successfully`);
      }
    }else if(action=="toggle"){
      onFilter[guild.id]=!onFilter[guild.id];
      reply(`Filter status toggled!: ${onFilter[guild.id]}`);
    }
  }
};
