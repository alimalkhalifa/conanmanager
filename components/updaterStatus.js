var blessed = require('blessed');
var config = require('../config.js');
var store = require('../store.js');

var box = blessed.box ({
  top: '0',
  left: '20%',
  width: '20%',
  height: '10%',
  tags: true,
  label: ' {bold}Updater Status{/} ',
  content: 'Not functional yet',
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

store.UI.updaterStatus = box ;
module.exports = box;