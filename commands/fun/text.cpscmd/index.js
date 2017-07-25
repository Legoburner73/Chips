
let spooky = require('./spooky');
let reverse = require('./reverse');
let rotate = require('./rotate');
let randomCaps = require('./randomCaps');
let big = require('./big');
let threed = require('./3d');

console.log('[CPSCMD][INFO][text] Building objects...');

reverse.metadata = {
  category: require('../').category,
  description: ['Reverses an input string'],
  usage: ['reverse <text>'],
  example: ['reverse some text','reverse some text --keepwordorder'],
  perm: [['global.fun.text.reverse']],
};
spooky.metadata = {
  category: require('../').category,
  description: 'Prints your text with spooky formatting!',
  usage: 'spooky <text> <optional flag>',
  example: 'spooky testing numspaces: 5',
  perm: [['global.fun.text.spooky']]
};
rotate.metadata = {
  category: require('../').category,
  description: 'Rotates your text',
  usage: 'rotate <\\ or /> <text>',
  example: 'rotate \\ hello!',
  perm: [['global.fun.text.rotate']]
};
randomCaps.metadata = {
  category: require('../').category,
  description: 'Randomly caps your text',
  usage: 'randomcaps <text>',
  example: 'randomcaps hello!',
  perm: [['global.fun.text.rotate']]
};
big.metadata = {
  category: require('../').category,
  description: 'Enlarges a given emoji!',
  usage: 'big <emoji>',
  example: 'big :heart:',
  perm: [['global.fun.text.rotate']]
};
threed.metadata = {
  category: require('../').category,
  description: 'Enlarges a given emoji!',
  usage: 'big <emoji>',
  example: 'big :heart:',
  perm: [['global.fun.text.rotate']]
};

console.log('[CPSCMD][INFO][text] Build objects complete!');
module.exports = [
  [spooky.name,spooky],
  [reverse.name, reverse],
  [rotate.name, rotate],
  [randomCaps.name, randomCaps],
  [big.name, big],
  [threed.name,threed],
];
