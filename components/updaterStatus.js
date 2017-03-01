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
    fg: config.color.primaryColor,
    bg: config.color.secondaryColor,
    border: {
      fg: config.color.primaryColor
    }
  }
});

box.on('update', function() {
  var text = 'Autoupdate is {' + config.color.alertColor + '-fg}{bold}' ;
  if ( config.autoUpdate ) {
    text += 'ON';
  } else {
    text += 'OFF';
  }
  text += '{/}\nAutorestart is {' + config.color.alertColor + '-fg}{bold}' ;
  if ( config.autoRestart ) {
    text += 'ON';
  } else {
    text += 'OFF';
  }
  text += '{/}';
  if ( config.needUpdate ) {
    text += '\n{' + config.color.alertColor + '-fg}{bold}PENDING UPDATE{/}'
  }
  box.setContent(text);

  store.UI.screen.render();
});

box.emit('update');

store.UI.updaterStatus = box ;
module.exports = box;