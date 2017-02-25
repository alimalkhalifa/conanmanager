var blessed = require('blessed');
var store = require('../store.js');
var config = require('../config.js');

var data1 ;

var table = blessed.listtable ({
  top: '0',
  left: '40%',
  width: '60%',
  height: '50%',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: config.color.primary,
    bg: config.color.secondary,
    border: {
      fg: config.color.primary
    }
  }
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

table.emit('update');

store.UI.eventLog = table ;
module.exports = table;