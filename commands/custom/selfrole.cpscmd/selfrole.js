
  module.exports = {
    name: 'selfrole',
    func(msg, { send, args, member, client, guild, content }) {
    let targetR = content.substring(content.indexOf(args[0]));
    
    let targetRole = guild.roles.find('name', `${targetRole}`);
    
      if(!targetRole) {
        let targetR = content.substring(content.indexOf(args[0]));
        let targetRole = guild.roles.find('name', `${targetRole}`);
        return send('Nope.')
      }

      if(!targetR === 'GiveawayNotify', 'D.E.M', 'XP Suspended') {
        return send('That isn\'t a selfrole!')
      }
    
      if(!guild.id === '274260111415836675') {
      return;
      } 
      if (member.roles.some(r=>["GiveawayNotify", "D.E.M", "XP Suspended"].includes(r.name))) {
        return send('You already have this role!');
      }

      if (targetRole) {
        member.addRole(targetRole.id)
      }
    
    },
  };
  