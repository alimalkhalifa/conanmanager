var blessed = require('blessed');
var config = require('../config.js');
var store = require('../store.js');

var text = blessed.text ({
  top: '95%',
  left: '0',
  width: '100%',
  height: '5%',
  tags: true,
  content: '<F1>Settings    <Ctrl-C>Exit',
  style: {
    fg: config.color.secondary,
    bg: config.color.primary,
  }
});

text.on('content', function(_content) {
  text.setContent(_content);
  store.UI.screen.render();
});

store.UI.helpLine = text ;
module.exports = text;