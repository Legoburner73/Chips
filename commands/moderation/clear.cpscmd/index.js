let clear = require('./clear');
let bc = require('./botclear');

console.log('[CPSCMD][MODERATION][clear] Building objects...');
let cmds = [clear, bc];
cmds.forEach(cmd => {
  cmd.metadata = {};
  cmd.metadata.category = require('../').category;
  cmd.metadata.customperm = ['MANAGE_MESSAGES'];
});

clear.metadata.description = 'This command clears chat messages!';
bc.metadata.description = 'This command clears bot-related msgs';

clear.metadata.usage = 'clear <number 1-99>';
bc.metadata.usage = 'botclear <number 1-99>';

clear.metadata.example = 'clear 22';
bc.metadata.example = 'botclear 22';

clear.metadata.perm = [['global.moderation.clear.clear']];
bc.metadata.perm = [['global.moderation.clear.botclear']];

console.log('[CPSCMD][MODERATION][clear] Build objects complete!');
module.exports = [
  [clear.name, clear],
  [bc.name, bc],
  ['bc', bc],
];
