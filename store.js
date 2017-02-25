var timer = require('timers');
var moment = require('moment');
var wincmd = require('node-windows');
var config = require('./config.js');

var store = {
  UI: {
    
  },
  events: []
};

timer.setInterval(function() { // Server Status check
  var status = false ;
  wincmd.list(function(svc){
    for ( var s in svc ) {
      if ( svc[s].ImageName == config.imageName) {
        status = true ;
        break;
      }
    }
    store.changeStatus(status);
  }, false);
}, 1 * 1000 );

store.changeStatus = function(status) {
  if ( store.status != status ) {
    store.status = status ;
    store.UI.serverStatus.emit('status', status);
  }
};

module.exports = store ;