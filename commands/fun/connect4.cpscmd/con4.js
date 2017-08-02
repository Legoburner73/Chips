const CON4 = require('connect-four');
const EventEmitter = require('events');

const EMPTY = '⚫', BLUE = '🔵', RED = '🔴';

const games = new WeakMap();

const ex = {
  name: "con4",
  customperm: ['SEND_MESSAGES'],
  async func(msg, {Discord, member, channel }) {
    const currentGame = new C4Game(channel, member);
    games.set(channel, currentGame);

    const mCol = channel.createMessageCollector(
      query => !!query.content.match(/\d+/g)&&query.content.match(/\d+/g)[0]&&query.content.match(/\d+/g)[0].length===query.content.length,
      { max: 1, time: TIME2, errors: ['time'] }
    );

    mCol.on('collect', async m => {
      if(!m.content) return;
      if(/^quit$/i.test(m.content)) currentGame.game.end();

      const num = m.content.match(/\d+/)?m.content.match(/\d+/)[0]:0;
      try {
        await currentGame.playCol(num);
      }catch(err){
        m.delete();
      }
    });

    mCol.on('end', collected => {
      if(collected.size===0){
        return this._msg.reply('Timed out, game was not saved to memory');
      }
    });

    currentGame.on('ended', async game=>{
      game.embed = new Discord.RichEmbed()
        .setTitle('Connect Four')
        .setColor(game.player=='red'?16711680:255)
        .setAuthor(`${game.player1?'('+game.player1.tag+')':''}Red vs ${game.player2?'('+game.player2.tag+')':''}Blue`)
        .setDescription(game.toString())
        .addField(`Game ended!`,'\u200B');
      await game.send();
      games.delete(channel);
    });
  }
};

const C4Game = class C4Game extends EventEmitter {
  constructor(tc, player1, player2, row=6, col=7){
    super();
    this.tc = tc;
    this.player1 = player1;
    this.player2 = player2;
    this.game = new CON4;
    this.board = this.createBoard(col,row);
  }

  createBoard (c=7,r=6) {
    this.board = new Array(r);
    for(let i=0; i< this.board.length; i++)
      this.board[i]=new Array(c).fill(EMPTY);

    this._columns = new Array(c+1).fill(0);
    this._columns[0] = r+1;
    return this.board;
  }

  setC (r,c, color) {
    let b = this.board.reverse();
    color=='red'?b[r-1][c-1]=RED:b[r-1][c-1]=BLUE;
    b = this.board.reverse();
    this._columns[c]++;
    return b;
  }

  playCol (col, color) {
    if(this._columns[col]>this._columns[0]) return false;
    return this.setC(this._columns[col]+1,col, color);
  }

  playGame (col) {
    if(!this.updatable) return 'Woah too fast!';
    this.updatable = false;
    if(this.checkEnded()) return;
    this.player= (!this.player||this.player==='blue')?'red':'blue';
    if(!this.game.validMove(col-1)) return 'Invalid move!';
    this.game.play(this.player, col-1);
    this.playCol(col, this.player);
    this.checkEnded();
    return this.send().then(()=>this.updatable = true);
  }

  checkEnded () {
    if(this.game.ended){
      this.ended = true;
      this.emit('ended', this);
      return 'Game has ended!';
    }
    return false;
  }

  toString () {
    return this.board.map(r=>r.join('')).join('\n');
  }

  embedify () {
    this.embed = new Discord.RichEmbed()
      .setTitle('Connect Four')
      .setColor(this.player=='red'?16711680:255)
      .setAuthor(`${this.player1?'('+this.player1.tag+')':''}Red vs ${this.player2?'('+this.player2.tag+')':''}Blue`)
      .setDescription(this.toString())
      .addField(`${this.player?this.player.substring(0,1).toUpperCase():'Red'}${this.player?this.player.substring(1):''} to move.`,'\u200B');
  }

  send () {
    return new Promise( async res => {
      if(!this.tc) return res(false);
      this.embedify();
      await this.currentMsg.delete();
      this.currentMsg = await tc.send('',{embed: this.embed});
      res(this.currentMsg);
    });
  }
};

module.exports = ex;