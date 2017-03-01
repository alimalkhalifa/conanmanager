var timer = require('timers');
var wincmd = require('node-windows');
var config = require('./config.js');
var spawn = require('child_process').spawn ;
var os = require('os');
var fs = require('fs');
var Steam = require('steam-web');
var steam = new Steam({
  apiKey: config.apiKey,
  format: 'json'
});

var store = {
  UI: {
    
  },
  pid: -1,
  events: [],
  announcements: [],
  commandLine: '',
  freemem: 0,
  servermem: 0,
  timers: {

  }
};

if ( fs.existsSync('announcements.json') ) {
  store.announcements = JSON.parse(fs.readFileSync('announcements.json'));
}

store.timers.serverStatus = timer.setInterval(function() { // Server Status check
  var pid = -1 ;
  wincmd.list(function(svc){
    for ( var s in svc ) {
      if ( svc[s].ImageName == config.imageName) {
        pid = svc[s].PID ;
        store.servermem = String(Number(parseInt(svc[s].MemUsage.replace(/,/gi,'').split(' ')[0]) / 1024).toFixed(0)) ;
        break;
      }
    }
    store.changeStatus(pid);
  }, false);
}, 1 * 1000 );

store.enableServerRestarterTimer = function() {
  config.autoRestart = true ;
  config.save() ;
  store.timers.serverRestarter = timer.setInterval(function() { // Server restarter
    if ( config.autoRestart && !store.starting && !store.updating && !store.killing && store.pid < 0 ) {
      store.startServer();
    }
  }, 10 * 1000 );
};

store.disableServerRestarterTimer = function() {
  config.autoRestart = false ;
  config.save() ;
  timer.clearInterval(store.timers.serverRestarter);
};

if ( config.autoRestart ) {
  store.enableServerRestarterTimer() ;
}

store.enableServerUpdaterTimer = function() {
  config.autoUpdate = true ;
  config.save() ;
  store.timers.serverUpdater = timer.setInterval(function () { // Server updater
    steam.getNewsForApp({
      appid: config.app_id_news,
      maxlength: 300,
      count: 10,
      callback: store.checkNews
    });
    if ( config.autoUpdate ) {
      store.shouldUpdate();
    }
  }, 60 * 1000 );
};

store.disableServerUpdaterTimer = function() {
  config.autoUpdate = false ;
  config.save() ;
  timer.clearInterval(store.timers.serverUpdater);
};

if ( config.autoUpdate ) {
  store.enableServerUpdaterTimer() ;
}

store.timers.memoryGet = timer.setInterval(function () { // System memory get
  store.freemem = Number(os.freemem() / 1024 / 1024).toFixed(0) ;
  store.UI.memGraph.emit('update');
}, 5 * 1000 );

store.changeStatus = function(pid) {
  if ( store.pid != pid ) {
    store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Server PID: ' + pid );
    store.pid = pid ;
    store.UI.serverStatus.emit('update');
  }
  if ( store.pid >= 0 ) {
    store.starting = false ;
  }
}

store.checkNews = function( err, data ) {
  var newnews = false ;
  if ( err ) {
     store.UI.terminalLog.emit('log', '[NEWSERROR] ' + err);
     store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Error checking news');
    return ;
  }
  var news = data.appnews.newsitems;
  for ( var n in news ) {
    if ( news[n].feedname != 'steam_community_announcements' )
      news.splice(n,1);
  }
  for ( n = news.length-1; n >= 0 ; n-- ) {
    var match = false;
    for ( var a in store.announcements ) {
      if ( news[n].gid == store.announcements[a].gid ) {
        match = true ;
        break ;
      }
    }
    if ( match == false ) {
      store.announcements.splice(0,0,news[n]);
      store.UI.terminalLog.emit('log', '[NEWS]: ' + news[n].title);
      newnews = true ;
    }
  }

  if ( newnews ) {
    fs.writeFile('announcements.json', JSON.stringify(store.announcements), { flag: 'w' }, function(err) {
      if ( err ) {
        store.UI.terminalLog.emit('log', '[ERROR] ' + err);
        store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Error writing announcements');
        return ;
      }
    });
    store.UI.terminalLog.emit('log', '[UPDATE]: Queuing update due to new News');
    store.UI.eventLog.emit('newEvent', config.event.alertColor, 'Queue Server Update - News');
    config.needUpdate = true ;
    config.save() ;
    store.UI.updaterStatus.emit('update');
	}
}

store.buildExeOptions = function() {
  var options = [] ;
  options.push('-log');
  if ( config.game.maxPlayers.value != '' )
    options.push('MaxPlayers=' + config.game.maxPlayers.value);
  if ( config.game.port.value != '' )
    options.push('Port=' + config.game.port.value);
  if ( config.game.queryPort.value != '' )
    options.push('QueryPort=' + config.game.queryPort.value);
  if ( config.game.serverName.value != '' )
    options.push('ServerName=' + config.game.serverName.value);
  return options ;
}

store.buildUpdateOptions = function() {
  var options = [] ;
  options.push('+login anonymous');
  options.push('+force_install_dir ' + config.game.serverDir.value.replace(' ', '\ '));
  options.push('+app_update ' + config.app_id);
  options.push('+quit');
  return options ;
}

store.startServer = function() {
  store.starting = true ;
  store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Starting Server');
  store.serverProc = spawn(config.exeName, store.buildExeOptions(), {cwd: config.game.serverDir.value, detached: true});
  store.serverProc.on('error', function(err) {
    store.UI.terminalLog.emit('log', '[ERROR] EXE ' + config.exeName + ' not found in ' + config.game.serverDir.value + ' -err- ' + err );
    store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Exe not found');
    store.starting = false ;
    store.disableServerRestarterTimer();
    store.UI.updaterStatus.emit('update');
  });
  store.serverProc.stdout.on('data', function(data) {
    store.UI.terminalLog.emit('log', data.toString());
  });
  store.serverProc.stderr.on('data', function(data) {
    store.UI.terminalLog.emit('log', '[ERROR] ' + data.toString());
  });
  timer.setTimeout( function() {
    store.starting = false ;
  }, 60 * 1000 );
}

store.updateServer = function() { // CHECK redundant function?
  store.updating = true ;
  if ( store.pid >= 0 ) {
    store.killing = true ;
    store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Killing server at PID ' + store.pid);
    var killServerProc = spawn('taskkill.exe', ['/PID', store.pid]);
    killServerProc.on('error', function(err) {
      store.UI.terminalLog.emit('log', '[KILLERROR] command taskkill.exe not available on your server -err- ' + err);
      store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Unable to kill server');
    });
    killServerProc.stdout.on('data', function(data) {
    store.UI.terminalLog.emit('log', '[KILL] ' + data.toString());
    });
    killServerProc.stderr.on('data', function(data) {
      store.UI.terminalLog.emit('log', '[KILLERROR] ' + data.toString());
    });
    killServerProc.on('close', function(code) {
      store.killing = false ;
      if ( code != 0 ) {
        store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Unable to kill server');
      } else {
        store.updateServerProc() ;
      }
    });
  } else {
    store.updateServerProc() ;
  }
}

store.killServer = function() { // CHECK redundant function?
  if ( store.pid >= 0 ) {
    store.killing = true ;
    store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Killing server at PID ' + store.pid);
    var killServerProc = spawn('taskkill.exe', ['/PID', store.pid]);
    killServerProc.on('error', function(err) {
      store.UI.terminalLog.emit('log', '[KILLERROR] command taskkill.exe not available on your server -err- ' + err);
      store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Unable to kill server');
    });
    killServerProc.stdout.on('data', function(data) {
    store.UI.terminalLog.emit('log', '[KILL] ' + data.toString());
    });
    killServerProc.stderr.on('data', function(data) {
      store.UI.terminalLog.emit('log', '[KILLERROR] ' + data.toString());
    });
    killServerProc.on('close', function() {
      store.killing = false ;
    });
  }
}

store.updateServerProc = function() {
  store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Updating Server');
  store.updateProc = spawn(config.steamExeName, store.buildUpdateOptions(), {cwd: config.game.steamCMDDir.value});
  store.updateProc.on('error', function(err) {
    store.UI.terminalLog.emit('log', '[STEAMERR] EXE ' + config.steamExeName + ' not found in ' + config.steamCMDDir + ' -err- ' + err);
    store.UI.eventLog.emit('newEvent', config.event.errorColor, 'SteamExe not found');
    store.updating = false ;
    store.disableServerUpdaterTimer() ;
    store.UI.updaterStatus.emit('update');
  });
  store.updateProc.stdout.on('data', function( data) {
    store.UI.terminalLog.emit('log', '[STEAM] ' + data.toString());
  });
  store.updateProc.stderr.on('data', function( data) {
    store.UI.terminalLog.emit('log', '[STEAMERROR] ' + data.toString());
  });
  store.updateProc.on('close', function(code) {
    store.UI.terminalLog.emit('log', '[STEAM] Exited with code ' + code);
    if ( code == 0 ) {
      store.updating = false ;
      config.needUpdate = false ;
      config.save() ;
      store.UI.updaterStatus.emit('update');
      store.UI.eventLog.emit('newEvent', config.event.STATUS, 'Done Updating');
    }
  });
}

store.shouldUpdate = function() {
  if ( !store.starting ) {
    if ( !store.updating ) {
      if ( config.needUpdate ) {
        store.updateServer() ;
      }
    }
  }
}


module.exports = store ;