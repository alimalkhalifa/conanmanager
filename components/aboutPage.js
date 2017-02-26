var blessed = require('blessed');
var store = require('../store.js');
var config = require('../config.js');

var message = blessed.message ({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 'shrink',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.primary,
    bg: config.color.secondary,
    border: {
      fg: config.color.primary
    },
    buttons: {
      fg: config.color.seconndary,
      bg: config.color.primary
    }
  },
  hidden: true
});

message.on('display', function() {
  var text = '{center}{bold}Conan Server Manager{/}\n';
  text += '{center}{white-fg}Ali Al-Khalifa <alimalkhalifa>{/}\n'
  text += '{center}https://github.com/alimalkhalifa/conanmanager{/}';
  message.display(text, function() {
  });
});

store.UI.aboutPage = message ;
module.exports = message;