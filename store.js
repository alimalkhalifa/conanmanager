var timer = require('timers');
var moment = require('moment');
var wincmd = require('node-windows');
var config = require('./config.js');
var spawn = require('child_process').spawn ;

var store = {
  UI: {
    
  },
  pid: -1,
  events: [],
  log: [],
  commandLine: '',
};

timer.setInterval(function() { // Server Status check
  var pid = -1 ;
  wincmd.list(function(svc){
    for ( var s in svc ) {
      if ( svc[s].ImageName == config.imageName) {
        pid = svc[s].PID ;
        break;
      }
    }
    store.changeStatus(pid);
  }, false);
}, 1 * 1000 );

timer.setInterval(function() { // Server restarter
  if ( store.autoRestart ) {
    if ( !store.starting ) {
      if ( !store.updating ) {
        if ( store.pid < 0 ) {
          store.startServer()
        }
      }
    }
  }
}, 10 * 1000 );

timer.setInterval(function () {
  store.shouldUpdate();
}, 60 * 1000 );

store.changeStatus = function(pid) {
  if ( store.pid != pid ) {
    store.UI.eventLog.emit('newEvent', 'StatusChange', 'Server PID: ' + pid );
    store.pid = pid ;
    store.UI.serverStatus.emit('update');
  }
  if ( store.pid >= 0 ) {
    store.starting = false ;
  }
}

store.buildCommand = function() {
  var command = '' ;
  store.commandLine = command ;
  return command ;
}

store.startServer = function() {
  store.starting = true ;
  store.UI.eventLog.emit('newEvent', 'ServerStart', 'Starting Server');
  store.serverProc = spawn('notepad.exe', []);
  store.serverProc.stdout.on('data', function(data) {
    store.UI.terminalLog.insertBottom(data.toString());
  });
  timer.setTimeout( function() {
    store.starting = false ;
  }, 60 * 1000 );
}

store.updateServer = function() {
  store.updating = true ;
  store.UI.eventLog.emit('newEvent', 'UpdateServer', 'Updating Server');
  store.updateProc = spawn('ps', []);
  store.updateProc.stdout.on('data', function( data) {
    store.UI.terminalLog.insertBottom('[STEAM] ' + data.toString());
  });
  store.updateProc.on('close', function(code) {
    store.updating = false ;
    store.UI.eventLog.emit('newEvent', 'UpdateServer', 'Done Updating');
  });
}

store.shouldUpdate = function() {
  if ( store.autoUpdate ) {
    if ( !store.starting ) {
      if ( !store.updating ) {
        store.updateServer() ;
      }
    }
  }
}


module.exports = store ;