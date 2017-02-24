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
  content: 'Waiting for Server Status...',
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.fg_primary,
    bg: config.color.bg_primary,
    border: {
      fg: config.color.fg_primary
    }
  }
});

box.on('status', function(status) {
  if ( status != store.status ) {
    store.status = status ;
    if ( status ) {
      box.setContent('Server is Running');
    } else {
      box.setContent('Server is {'+ config.color.fg_error + '-fg}{bold}NOT{/} Running');
    }
    store.UI.screen.render();
  }
})

store.UI.serverStatus = box ;
module.exports = box;