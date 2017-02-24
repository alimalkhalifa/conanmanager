var timer = require('timers');
var wincmd = require('node-windows');
var config = require('./config');
var store = require('./store.js');

var intervals = function () {
  timer.setInterval(function() { // Server Status check
    var status = false ;
    wincmd.list(function(svc){
      for ( var s in svc ) {
        if ( svc[s].ImageName == config.imageName) {
          status = true ;
          break;
        }
      }
      store.UI.serverStatus.emit('status', status);
    }, false);
  }, 1 * 1000 );
};

module.exports = intervals ;