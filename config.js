var fs = require('fs');

var config = {
  color: {
    primaryColor: 'green',
    secondaryColor: 'black',
    successColor: 'green',
    errorColor: 'red',
    alertColor: 'yellow',
  },
  event: {
    STATUS: '{bold}{green-fg}STATUS{/}',
    ALERT: '{bold}{yellow-fg}ALERT{/}',
    ERROR: '{bold}{red-fg}ERROR{/}'
  },
  imageName: 'ConanSandboxServer-Win64-Test.exe',
  exeName: 'ConanSandboxServer.exe',
  steamExeName: 'steamcmd.exe',
  app_id: '443030',
  app_id_news: '440900',
  apiKey: 'F8D756B20828053B061B1F5467961F63',
  game: {
    serverName: {
      value: '',
      prompt_text: 'Server Name',
      initial_value: ''
    },
    maxPlayers: {
      value: '',
      prompt_text: 'Maximum Players',
      initial_value: '40'
    },
    port: {
      value: '',
      prompt_text: 'Game port (UDP)',
      initial_value: '7777'
    },
    queryPort: {
      value: '',
      prompt_text: 'Steam port (UDP)',
      initial_value: '27015'
    },
    steamCMDDir: {
      value: '',
      prompt_text: 'SteamCMD Directory',
      initial_value: ''
    },
    serverDir: {
      value: '',
      prompt_text: 'Server EXE Directory',
      initial_value: '',
      no_space: true
    }
  },
  autoUpdate: false,
  autoRestart: false,
  needUpdate: false
}

config.save = function() {
  var configToSave = {} ;
  configToSave.game = {} ;
  configToSave.game.serverName = {}
  configToSave.game.serverName.value = config.game.serverName.value ;
  configToSave.game.maxPlayers = {}
  configToSave.game.maxPlayers.value = config.game.maxPlayers.value ;
  configToSave.game.port = {}
  configToSave.game.port.value = config.game.port.value ;
  configToSave.game.queryPort = {}
  configToSave.game.queryPort.value = config.game.queryPort.value ;
  configToSave.game.steamCMDDir = {}
  configToSave.game.steamCMDDir.value = config.game.steamCMDDir.value ;
  configToSave.game.serverDir = {}
  configToSave.game.serverDir.value = config.game.serverDir.value;
  configToSave.autoUpdate = config.autoUpdate ;
  configToSave.autoRestart = config.autoRestart ;
  configToSave.needUpdate = config.needUpdate ;

  fs.writeFile('config.json', JSON.stringify(configToSave), {flag: 'w'}, function() {
    
  });
}

config.load = function() {
  if ( fs.existsSync( 'config.json' ) ) {
    var savedConfig = JSON.parse(fs.readFileSync('config.json')) ;
    if ( savedConfig.game.serverName )
      config.game.serverName.value = savedConfig.game.serverName.value ;
    if ( savedConfig.game.maxPlayers )
      config.game.maxPlayers.value = savedConfig.game.maxPlayers.value ;
    if ( savedConfig.game.port )
      config.game.port.value = savedConfig.game.port.value ;
    if ( savedConfig.game.queryPort )
      config.game.queryPort.value = savedConfig.game.queryPort.value ;
    if ( savedConfig.game.steamCMDDir )
      config.game.steamCMDDir.value = savedConfig.game.steamCMDDir.value ;
    if ( savedConfig.game.serverDir )
      config.game.serverDir.value = savedConfig.game.serverDir.value;
    if ( savedConfig.autoUpdate )
      config.autoUpdate = savedConfig.autoUpdate ;
    if ( savedConfig.autoRestart )
      config.autoRestart = savedConfig.autoRestart ;
    if ( savedConfig.needUpdate )
      config.needUpdate = savedConfig.needUpdate ;
  }
}

config.load();

module.exports = config ;