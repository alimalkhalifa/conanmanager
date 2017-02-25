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
    fg: config.color.primary,
    bg: config.color.secondary,
    border: {
      fg: config.color.primary
    }
  }
});

box.on('update', function() {
  if ( store.pid >= 0 ) {
    box.setContent('Server is Running at PID ' + store.pid);
  } else {
    box.setContent('Server is {'+ config.color.error + '-fg}{bold}NOT{/} Running');
  }
  store.UI.screen.render();
});

box.emit('update');

store.UI.serverStatus = box ;
module.exports = box;