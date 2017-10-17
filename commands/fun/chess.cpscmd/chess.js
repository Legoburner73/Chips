const CHESS = require('../../../rewrite-all/src/struct/games/chess/ChessGame.js');
const CG = CHESS.ChessGame;
const Paginator = require('../../../rewrite-all/src/struct/client/Paginator').Paginator;

const TIME = 5*60*10e3;
const STARTWAIT = 10*60*10e3;
const games = new Map();
const prompting = new Map();
const promptingAll = new Map();
const fill = '▓', unf = '░', mult = 2;
const check = '✅';
const difficultyArr = new Array(5).fill(0).map((e, i, a) =>
  `\`${fill.repeat(mult).repeat(i)}${unf.repeat(mult).repeat(a.length-1-i)} (${i+1})\``
);

const ex = {
  name: "chess",
  async func(msg, ctx) {
    let { author, reply, member, send, channel, args, prefix, client } = ctx;

    if(args[0]&&args[0]==='help'){
      const embed = new Discord.MessageEmbed;
      new CG({newFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3B1N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', channel: msg.channel, players: [author, client.user]}).updateAll();

      [
        ['Moving pawns: ', [
          'To move a pawn forward simply type the target square.',
          'To move a pawn from e7 to e5 just type `e5`',
          'To take another piece with a pawn type the previous file (letter) followed by `x` and the square you are taking.',
          'In this board for white to take d5 with a pawn, white would type `exd5`',
        ].join('\n')],
        ['Non-pawn pieces: ', [
          'To move another piece like the knight in this example from f6 to g2 then Nf6g4 or simply Ng4',
          'If there is another piece at where you want to move that you want to take:',
          '\tNxe4, Nf6e4 Nf6-e4 would work',
          'In this example, to take e4 with the knight, black would type `Nxe4`'
        ].join('\n')],
        ['Castling and promotions: ', [
          'Ke1g1 and O-O do the same thing. To castle queenside it would be O-O-O',
          'Promotions are always from pawn to queen',
        ].join('\n')],
        ['"Sloppy moves": ', [
          "When in doubt with FEN notation or if something doesn't work you can try just specifying the \"before\" and \"after\" squares.",
          'In this example, instead of typing `Nxe4`, black could move `f6e4` to achieve the same result',
        ].join('\n')],
        ['Usage:', [
          'Click on 🔄 when it is your turn to rotate the board while in game.',
          'Type __quit__ to forfeit the game when it is your turn.',
          `Type __${_.escapeRegExp(prefix)}${this.name}__ to start a new game.`,
          '\tWhen prompted mention someone to challenge, or me to play against my AI.',
        ].join('\n')],
      ].forEach(f=>embed.addField(...f));
      send(embed);
      return;
    }

    let mCol, silentQuit = false;
    if(args[0]&&args[0].toLowerCase()==='join') return !0;

    if(prompting.get(author.id)) return;
    if(promptingAll.get(channel.id)) return;
    if(games.get(channel.id)) return send('There is already a game going on.');

    let othermember, difficulty, botting = false;

    games.set(channel.id, channel);
    try{
      othermember = await promptInvitee(ctx);
      if(othermember&&othermember.user.bot&&othermember.user.id!==client.user.id){
        send('You cannot invite that bot!');
        throw new Error('Bot invitee');
      }
      if(!othermember||!othermember.user||othermember.user.id!==client.user.id)
        othermember = await promptPlayer (ctx);
      else if(othermember&&othermember.user&&othermember.user.id===client.user.id) {
        difficulty = await promptDifficulty (msg, ctx);
        send('Difficulty set to '+(+difficulty+1));
        botting = true;
      }
    }catch(err){
      games.delete(channel.id);
      prompting.delete(othermember?othermember.id:0);
      promptingAll.delete(channel.id);
      prompting.delete(author.id);
      silentQuit = true;
      mCol&&mCol.stop();
      return console.error(err);
    }
    if(othermember=='decline') {
      games.delete(channel.id);
      prompting.delete(othermember.id);
      promptingAll.delete(channel.id);
      prompting.delete(author.id);
      silentQuit = true;
      mCol&&mCol.stop();
      return reply('Game was declined!');
    }
    if(othermember&&othermember.id) setTimeout(()=>{
      prompting.delete(othermember.id);
      prompting.delete(author.id);
      promptingAll.delete(channel.id);
    },1000);

    send('Creating a chess game... Type __`quit`__ when it is your move to forfeit.');

    console.log(`Creating a chess game for channel ${channel.id}...`);

    const currentGame = await CG.factory({ client, channel, players: _.shuffle([member.user, othermember.user]), aiOptions: botting?CHESS.difficulties[difficulty]||CG.difficulties[2]||1<<3:null });

    currentGame.game.header(
      'white',
      currentGame.movers.get('white')?currentGame.movers.get('white').tag:'Player1',
      'black',
      currentGame.movers.get('black')?currentGame.movers.get('black').tag:'Player2',
    );
    currentGame.once('end', game => {
      game.ended = true;
      game.lastM.delete();
      game.lastM = null;
      game.updateAll(currentGame.game.fen().split(/\s+/)[0], true);
    });
    games.set(channel.id, currentGame);
    console.log('Creating collector...');
    mCol = channel.createMessageCollector(
      q => [member.user, othermember.user].some(e => q.author.id === e.id),
      { time: TIME, errors: ['time'] }
    );
    console.log('Adding on-collect...');
    mCol.on('collect', async m => {
      if(m.author.id !== currentGame.movers.get(currentGame.turn.toLowerCase()).id) return;

      if(!m.content) return;
      //console.log(m.content);
      if(/quit/i.test(m.content)||(currentGame.isOver()&&!currentGame.ended)) {
        //currentGame.game.end();
        send('Ending…');
        currentGame.emit('ended', currentGame);
        mCol.stop();
      }

      let move = m.content
          .trim();
      let result;
      try {
        result = currentGame.go(move);
        console.log(`Pre-auto: ${move}`);
        //console.log('Game: '+result);
        if(result == 'Woah too fast!')
          return send('Too fast...');

        !currentGame.isOver() && !currentGame.ended && m.delete().catch(_=>_);
      }catch(errA){ //'Invalid move!'
        try{
          move = move.replace(/^([RNKQB])([a-h])(\w)/i, (match, a, b, c)=>a.toUpperCase()+b.toLowerCase()+c)
          .replace(/^([a-h])(\d)/i, (match, a, b) => a.toLowerCase()+b)
          .trim();

          result = currentGame.go(move);
          console.log(`Pre-auto: ${move}`);
          if(result == 'Woah too fast!')
            return send('Too fast...');
          !currentGame.isOver() && !currentGame.ended && m.delete().catch(_=>_);
        }catch(errB){
          try{
            move = move.replace(/^([RNKQB])([a-hx])(\w)/i, (match, a, b, c)=>a.toUpperCase()+b.toLowerCase()+c)
              .replace(/^([a-h])(\d)/i, (match, a, b) => a.toLowerCase()+b)
              .trim();
            result = currentGame.go(move);
            if(result == 'Woah too fast!')
              return send('Too fast...');
            !currentGame.isOver() && !currentGame.ended && m.delete().catch(_=>_);
          }catch(errC){
            if(move.length < 6)
              console.log(`Autocomplete: ${move}`);
            if(move.match(/^[RNKQB][a-h0-9]{3,4}$/))
              send('Ensure you have given a valid move');
            if(!~errB.message.indexOf('Move not completed'))
              console.error(err);
          }
        }
      }
    });

    mCol.once('end', collected => {
      if(collected.size===0)
        !silentQuit&&reply('Timed out, game was not saved to memory');

      prompting.delete(othermember.id);
      games.delete(channel.id);
      promptingAll.delete(channel.id);
      prompting.delete(author.id);
      currentGame.emit('ended', currentGame);
      console.log('MCol ended');
    });

    currentGame.once('ended', async () => { //game=>{
      console.log('Chess game ended');
      // game.updateFrontEnd('end');
      // game.embed = new Discord.MessageEmbed()
      //   .setTitle('Connect Four')
      //   .setColor(game.player=='red'?16711680:255)
      //   .setDescription(game.toString())
      //   .addField(`Game ended!`,'\u200B');
      // await send('', {embed: game.embed});
      games.delete(channel.id);
      games.delete(channel.id);
      prompting.delete(othermember.id);
      promptingAll.delete(channel.id);
      prompting.delete(author.id);
      silentQuit = true;
      mCol.stop();
    });
    currentGame.updateAll();
    console.log('Chess game setup complete');
  }
};

const promptDifficulty = (msg, { author, reply }) => new Promise (async (res) => {
  const p = new Paginator ( msg,  {
    type:'paged',
    embedding: true,
    fielding: false,
    title: 'Chess AI Difficulty',
    text: 'React with <{}> to select your difficulty.',
    pages: difficultyArr,
    footer: 'Level {pagenum}'
    }, Discord
  );
  try{
    let sentMsg = await p.sendFirst();
    if(!sentMsg) reply('Cannot find sentmsg');
    console.log(sentMsg.constructor.name);
    const f = (r, u) => {
      if(!u.bot&&u.id === author.id&&r.emoji.name === check){
        r.remove(u).catch(_=>_);
        return true;
      }
      return false;
    };
    const rCol = sentMsg.createReactionCollector(f, { time: 15e3, errors: ['time'] });
    rCol.on('collect', ()=>{
      res(p.currentPage);
      p.collector.stop();
    });
    rCol.on('end', () => res(p.currentPage));

    await sentMsg.react(check);
  }catch(err){
    console.error(err);
    return reply ('Something went wrong...');
  }
});

const promptPlayer = ({ author, send, prefix, channel, targetMember, client }) => {
  targetMember!=null&&targetMember.id!=null&&prompting.set(targetMember.id, true);
  targetMember==null&&promptingAll.set(channel.id, true);
  return new Promise( async (res,rej) => {
    const startFilter = (m) => {
      if(m.author.id === client.user.id) return res(targetMember||m.member);

      if(m.author.bot) return false;
      if((new RegExp(`${_.escapeRegExp(prefix)}chess(join|decline)`,'gi')).test(m.content.toLowerCase().replace(/\s+/g,'')))
        if(m.author.id !== author.id) {
            if((!targetMember)||targetMember.id===m.author.id)
              if(~m.content.toLowerCase().indexOf('join'))
                return res(targetMember||m.member);
              else if(targetMember&&!!~m.content.toLowerCase().indexOf('decline'))
                return res('decline');
          return false;
        }

      return false;
    };

    let startCol;
    try{
      let str = `${targetMember||''} Please type __${_.escapeRegExp(prefix)}chess join__ to join the game`;
      if(targetMember) str+=` or __${_.escapeRegExp(prefix)}chess decline__`;
      await send(str);
      startCol = await channel.awaitMessages(startFilter, { max: 1, time: STARTWAIT, errors: ['time'] });
    }catch(err){
      console.error(err);
      return rej('Timed out');
    }

    !startCol.first() && rej(null);
  });
};

const promptInvitee = ({ send, channel, author }) => {
  return new Promise ( async (res,rej) => {
    let targetMember;

    const startFilter = (m) => {
      if(m.author.bot) return false;
      if(m.author.id === author.id) {
        targetMember=m.mentions.members.first();
        if(targetMember){
          if(targetMember.id===author.id) {
            send("You can't really be inviting yourself?");
            return false;
          }
          return res(targetMember);
        }
        else if(~m.content.indexOf('none')){
          res(null);
          return true;
        }
        return false;
      }
      return false;
    };

    let startCol;
    try{
      await send(`${author||''} Please mention who you want to invite to this game, or __none__ to allow anyone to join`);
      startCol = await channel.awaitMessages(startFilter, { max: 1, time: STARTWAIT, errors: ['time'] });
    }catch(err){
      console.error(err);
      return rej('Timed out');
    }

    if(!startCol.first()) return rej(null);
    res(startCol.first().mentions.members.first()||startCol.first().content);
  });
};

ex._games = games;
ex._prompting = prompting;
ex._promptingAll = promptingAll;

module.exports = ex;
