var blessed = require('blessed');
var config = require('../../config.js');
var store = require('../../store.js');

var prompt = blessed.prompt ({
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
  }
});

prompt.on('prompt', function(setting, prompt_text, initial_value) {
  prompt.readInput(prompt_text, initial_value, function(err, result) {
    if ( result )
      config.game[setting].value = result;
    store.UI.serverSettings.emit('update');
    store.UI.screen.render();
  });
});

store.UI.prompt = prompt ;
module.exports = prompt;