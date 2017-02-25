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

box.on('update', function() {
  var text = 'Autoupdate is {' + config.color.alert + '-fg}{bold}' ;
  if ( store.autoUpdate ) {
    text += 'ON';
  } else {
    text += 'OFF';
  }
  text += '{/}\nAutorestart is {' + config.color.alert + '-fg}{bold}' ;
  if ( store.autoRestart ) {
    text += 'ON';
  } else {
    text += 'OFF';
  }
  text += '{/}';
  box.setContent(text);

  store.UI.screen.render();
});

box.emit('update');

store.UI.updaterStatus = box ;
module.exports = box;