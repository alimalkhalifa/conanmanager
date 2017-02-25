var blessed = require('blessed');
var store = require('../store.js');
var config = require('../config.js');
var moment = require('moment');

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

table.on('newEvent', function(e_name, e_desc) {
  store.events.push([moment().format(), e_name, e_desc]);
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

table.on('focus', function() {
  store.UI.helpLine.emit('content', '<Escape> Unfocus          <Ctrl-C> Exit');
  table.style.border.fg = config.color.alert;
  store.UI.screen.render();
});

table.on('blur', function() {
  table.style.border.fg = config.color.primary;
  store.UI.screen.render();
})

table.emit('update');

store.UI.eventLog = table ;
module.exports = table;