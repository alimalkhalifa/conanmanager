var blessed = require('blessed');
var store = require('./store.js');
var config = require('./config.js');

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
require('./components/memGraph.js')

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
  config.autoUpdate = !config.autoUpdate;
  store.UI.updaterStatus.emit('update');
  config.save() 
});

screen.key(['r', 'R'], function( ch, key ) {
  config.autoRestart = !config.autoRestart;
  store.UI.updaterStatus.emit('update');
  config.save() ;
});

screen.key(['C-u'], function( ch, key ) {
  config.needUpdate = true ;
  config.save() ;
  store.UI.updaterStatus.emit('update');
  store.shouldUpdate();
});

screen.key(['C-r'], function( ch, key ) {
  if ( !store.starting ) {
    if ( !store.updating ) {
      if ( !store.killing ) {
        if ( store.pid < 0 ) {
          store.startServer()
        }
      }
    }
  }
});

screen.key(['x', 'X'], function( ch, key ) {
  if ( config.needUpdate ) {
    config.needUpdate = false ;
    config.save() ;
    store.UI.updaterStatus.emit('update');
  }
});

screen.key('C-k', function( ch, key ) {
  if ( !store.starting ) {
    if ( !store.killing ) {
      store.killServer() ;
    }
  }
});

screen.on('helpline', function() {
  store.UI.helpLine.emit('content', '<F-keys> Focus Element      <U> Enable auto updater       <R> Update auto restarter       <Ctrl-R> Start server      <Ctrl-U> Immediate Update      <X> Cancel pending update        <Crtl-K> Kill Server      <Ctrl-C> Exit');
});

screen.append(store.UI.serverStatus);
screen.append(store.UI.updaterStatus);
screen.append(store.UI.serverSettings);
screen.append(store.UI.helpLine);
screen.append(store.UI.eventLog);
screen.append(store.UI.terminalLog);
// screen.append(store.UI.memGraph); // Appended in module

screen.append(store.UI.prompt);

screen.emit('helpline');
screen.render() ;
store.UI.serverSettings.emit('label');
store.UI.eventLog.emit('label');
screen.render();

module.exports = screen ;