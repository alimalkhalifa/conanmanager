var blessed = require('blessed');
var store = require('./store.js');

var screen = blessed.screen ({
  smartCSR: true,
  terminal: 'windows-ansi'
});

var serverStatus = require('./components/serverStatus.js');

screen.title = 'Conan DS Manager';

screen.key(['C-c', 'q'], function( ch, key ) {
  return process.exit(0);
});

screen.append(serverStatus);

screen.render() ;

store.UI.screen = screen ;
module.exports = screen ;