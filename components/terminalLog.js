var blessedc = require('blessed-contrib');
var store = require('../store.js');
var config = require('../config.js');

var log = blessedc.log ({
  top: '50%',
  left: '0',
  width: '80%',
  height: '45%',
  tags: true,
  label: ' {bold}F3: Server log{/} ',
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.primary,
    bg: config.color.secondary,
    border: {
      fg: config.color.primary
    }
  }
});

log.on('log', function(text) {
});

store.UI.terminalLog = log ;
module.exports = log;