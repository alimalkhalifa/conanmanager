var screen = require('./screen.js');

var store = require('./store.js');

var intervals = require('./intervals.js');
intervals(screen);

screen.render();