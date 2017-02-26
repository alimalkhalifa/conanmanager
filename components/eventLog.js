var blessed = require('blessed');
var store = require('../store.js');
var config = require('../config.js');
var moment = require('moment');
var fs = require('fs');

var data1 ;

var table = blessed.listtable ({
  top: '0',
  left: '40%',
  width: '60%',
  height: '50%',
  tags: true,
  data: null,
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.primary,
    bg: config.color.secondary,
    border: {
      fg: config.color.primary
    },
    header: {
      fg: config.color.primary,
      bold: true
    },
    cell: {
      fg: config.color.primary,
      selected: {
        bg: config.color.primary,
        fg: config.color.secondary
      }
    }
  }
});

if ( fs.existsSync('events.json') ) {
  store.events = JSON.parse(fs.readFileSync('events.json')) ;
}

table.on('newEvent', function(e_name, e_desc) {
  store.events.push([moment().format(), e_name, e_desc]);
  fs.writeFile('events.json', JSON.stringify(store.events), { flag: 'w' }, function(err) {
    if ( err ) {
      store.UI.terminalLog.emit('log', '[ERROR] ' + err);
      store.UI.eventLog.emit('newEvent', config.event.ERROR, 'Error writing events to file');
      return ;
    }
  });
  table.emit('update');
  store.UI.screen.render();
});

table.on('update', function() {
  data1 = [
    ['Time', 'Event', 'Description']
  ] ;
  for ( var e in store.events ) {
    data1.push([store.events[e][0], store.events[e][1], store.events[e][2]]);
  }
  table.setData(data1);
  if ( !table.focused ) {
    table.scrollTo(data1.length);
    table.select(data1.length);
  }
});

table.on('label', function() {
  table.setLabel(' {bold}F2: Events log{/} ');
});

table.key('down', function( ch, key ) {
  table.down(1);
});

table.key('up', function( ch, key ) {
  table.up(1);
});

table.key('C-p', function( ch, key ) {
  store.events = [] ;
  fs.unlinkSync('events.json') ;
  table.emit('update');
});

table.on('focus', function() {
  store.UI.helpLine.emit('content', '<Escape> Unfocus          <Ctrl-P> Clear Log       <Ctrl-C> Exit');
  table.style.border.fg = config.color.alert;
  store.UI.screen.render();
});

table.on('blur', function() {
  table.style.border.fg = config.color.primary;
  store.UI.screen.render();
});

table.emit('update');

store.UI.eventLog = table ;
module.exports = table;