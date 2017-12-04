const JR = require('util').promisify(require('jimp').read);
const fs = require('fs');
const [a_, b_, c_, d_, e_, f_] = [612, 860, 348, 132, 272, 2048];

let mm;

module.exports = {
  name: 'wanted',
  async func(msg, { member, send, channel, author, Discord }) {
    if (!mm) mm = (await JR('https://imgur.com/a/696eq')).resize(a_, b_);
    const ava = (await JR(
      (msg.mentions.users.first() || author)
        .displayAvatarURL({ format: 'jpg', size: f_ }))
    ).resize(c_, c_);

    const photo = await mm.clone().blit(ava, d_, e_);
    const f = `${author.id}|${channel.id}.${Date.now()}.wanted.png`;
    return new Promise(r => photo.write(f,
      () => r(send(new Discord.MessageEmbed()
        .attachFiles([f])
        .setImage(`attachment://${f}`)
        .setTitle(`${(msg.mentions.users.first() || author).tag} wanted dead or alive`)
        .setColor(member ? member.displayColor : 1349842)
      ).then(() => fs.unlinkSync(f)))
    ));
  },
};
