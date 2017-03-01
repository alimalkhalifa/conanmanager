var blessed = require('blessed');
var config = require('../config.js');
var store = require('../store.js');

var box = blessed.box ({
  top: '0',
  left: '0',
  width: '20%',
  height: '10%',
  tags: true,
  label: ' {bold}Server Status{/} ',
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
  if ( store.killing ) {
    box.setContent('Killing Server');
  } else if ( store.pid >= 0 ) {
    box.setContent('Server is Running at PID ' + store.pid);
  } else if ( store.updating ) {
    box.setContent('Server is updating');
  } else if ( store.starting ) {
    box.setContent('Server is starting...');
  } else {
    box.setContent('Server is {'+ config.color.errorColor + '-fg}{bold}NOT{/} Running');
  }
  store.UI.screen.render();
});

box.emit('update');

store.UI.serverStatus = box ;
module.exports = box;