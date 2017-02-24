var blessed = require('blessed');
var store = require('./store.js');

var root = true ;

var screen = blessed.screen ({
  smartCSR: true,
  terminal: 'windows-ansi'
});

store.UI.screen = screen ;

require('./components/serverStatus.js');
require('./components/serverSettings.js');
require('./components/helpLine.js');
require('./components/serverSettings/prompt.js');

screen.title = 'Conan DS Manager';

screen.key(['C-c', 'q'], function( ch, key ) {
  return process.exit(0);
});

screen.key('f1', function( ch, key ) {
  if ( root ) {
    store.UI.serverSettings.focus();
    root = false ;
  }
});

screen.key('escape', function( ch, key ) {
  if ( !root ) {
    screen.focusPop();
    store.UI.helpLine.emit('content', '<F1-4> Focus         <Ctrl-C> Exit');
    root = true ;
  }
});

screen.append(store.UI.serverStatus);
screen.append(store.UI.serverSettings);
screen.append(store.UI.helpLine);
screen.append(store.UI.prompt);

screen.render() ;
store.UI.serverSettings.emit('label');
screen.render();

module.exports = screen ;