
let fakeban = require('./-ban');

console.log('[CPSCMD][FUN][fakeban] Building objects...');
fakeban.category = require('../').category;

fakeban.description = 'This command fake bans someone!';

fakeban.usage = '-ban <user> <reason>';

fakeban.example = '-ban @周珺 • WillyZ#6686 Letting Chips be eaten';

console.log('[CPSCMD][FUN][fakeban] Build objects complete!');
module.exports = [
  [fakeban.name,fakeban],
];
