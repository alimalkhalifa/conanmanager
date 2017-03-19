var execSync = require('child_process').execSync;

execSync("mode con:cols=240 lines=85");
console.log("Configuring command prompt window...");

setTimeout(function() {
  require('./config.js');
  require('./store.js');
  var screen = require('./screen.js');

  screen.render();
}, 1500 );
