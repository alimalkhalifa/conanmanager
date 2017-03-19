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
    fg: config.color.primaryColor,
    bg: config.color.secondaryColor,
    border: {
      fg: config.color.primaryColor
    },
    header: {
      fg: config.color.primaryColor,
      bold: true
    },
    cell: {
      fg: config.color.primaryColor,
      selected: {
        bg: config.color.primaryColor,
        fg: config.color.secondaryColor
      }
    }
  }
});

if ( fs.existsSync('events.json') ) {
  try {
    store.events = JSON.parse(fs.readFileSync('events.json')) ;
  } catch (err) {
    fs.unlink('events.json');
  }
}

table.on('newEvent', function(e_name, e_desc) {
  if ( e_name == config.event.ERROR ) {
    e_log = fs.readFileSync(config.game.serverDir.value + '\\ConanSandbox\\Saved\\Logs\\ConanSandbox.log', 'utf-8');
    store.events.push([moment().format(), e_name, e_desc, e_log]);
  } else {
  store.events.push([moment().format(), e_name, e_desc, ""]);
  }
  fs.writeFile('events.json', JSON.stringify(store.events), { flag: 'w' }, function(err) {
    if ( err ) {
      store.UI.terminalLog.emit('log', '[ERROR] ' + err);
      store.UI.eventLog.emit('newEvent', config.event.errorColor, 'Error writing events to file');
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
  table.setLabel(' {bold}F6: Events log{/} ');
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

table.key('enter', function( ch, key ) {
   var log = table.selected - 1 ;
   if ( store.events[log][3] != "" ) {
     store.UI.log_detail.emit('detail', store.events[log][0], store.events[log][1], store.events[log][2], store.events[log][3]);
   }
});

table.on('focus', function() {
  store.UI.helpLine.emit('content', '<Escape> Unfocus       <Enter> Details          <Ctrl-P> Clear Log       <Ctrl-C> Exit');
  table.style.border.fg = config.color.alertColor;
  store.UI.screen.render();
});

table.on('blur', function() {
  table.style.border.fg = config.color.primaryColor;
  store.UI.screen.render();
});

table.emit('update');

store.UI.eventLog = table ;
module.exports = table;