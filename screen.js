var blessed = require('blessed');
var store = require('./store.js');

var root = true ;

var screen = blessed.screen ({
  smartCSR: true,
  terminal: 'windows-ansi'
});

store.UI.screen = screen ;

require('./components/serverStatus.js');
require('./components/updaterStatus.js');
require('./components/serverSettings.js');
require('./components/helpLine.js');
require('./components/serverSettings/prompt.js');
require('./components/eventLog.js');
require('./components/terminalLog.js');

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

screen.key('f2', function( ch, key ) {
  if ( root ) {
    store.UI.eventLog.focus();
    root = false ;
  }
});

screen.key('escape', function( ch, key ) {
  if ( !root ) {
    screen.focusPop();
    screen.emit('helpline');
    root = true ;
  }
});

screen.key(['u', 'U'], function( ch, key ) {
  store.autoUpdate = !store.autoUpdate;
  store.UI.updaterStatus.emit('update');
});

screen.key(['r', 'R'], function( ch, key ) {
  store.autoRestart = !store.autoRestart;
  store.UI.updaterStatus.emit('update');
})

screen.on('helpline', function() {
  store.UI.helpLine.emit('content', '<F1> Settings        <F2> Event Log        <U> Enable auto updater        <R> Update auto restarter        <Ctrl-C> Exit');
})

screen.append(store.UI.serverStatus);
screen.append(store.UI.updaterStatus);
screen.append(store.UI.serverSettings);
screen.append(store.UI.helpLine);
screen.append(store.UI.prompt);
screen.append(store.UI.eventLog);
screen.append(store.UI.terminalLog);

screen.emit('helpline');
screen.render() ;
store.UI.serverSettings.emit('label');
store.UI.eventLog.emit('label');
screen.render();

module.exports = screen ;