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
    fg: config.color.primaryColor,
    bg: config.color.secondaryColor,
    border: {
      fg: config.color.primaryColor
    },
    buttons: {
      fg: config.color.seconndary,
      bg: config.color.primaryColor
    }
  }
});

prompt.on('prompt', function(setting, prompt_text, initial_value, no_space) {
  prompt.readInput(prompt_text, initial_value, function(err, result) {
    if ( result ) {
      if ( no_space ) {
        result = result.replace(' ', '_');
      }
      config.game[setting].value = result;
    }
    config.save() ;
    store.UI.serverSettings.emit('update');
    store.UI.updaterStatus.emit('update');
    store.UI.screen.render();
  });
});

store.UI.prompt = prompt ;
module.exports = prompt;