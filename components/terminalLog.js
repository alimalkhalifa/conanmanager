var blessedc = require('blessed-contrib');
var store = require('../store.js');
var config = require('../config.js');

var log = blessedc.log ({
  top: '50%',
  left: '0',
  width: '80%',
  height: '45%',
  tags: true,
  label: ' {bold}Server log{/} ',
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.primaryColor,
    bg: config.color.secondaryColor,
    border: {
      fg: config.color.primaryColor
    }
  }
});

log.on('log', function(text) {
  var textArray = text.split('\n');
  for ( var t in textArray ) {
    log.log(textArray[t]);
  }
});

store.UI.terminalLog = log ;
module.exports = log;