var blessed = require('blessed');
var config = require('../config.js');
var store = require('../store.js');

var data1 = [
    ['Name','Value'],
] ;

var table = blessed.listtable ({
  top: '10%',
  left: '0',
  width: '40%',
  height: '40%',
  tags: true,
  data: null,
  align: 'center',
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

table.setData(data1);

table.on('label', function() {
  table.setLabel(" {bold}F1: Server Settings{/} ");
  table.emit('update');
});

table.on('update', function() {
  data1 = [
    ['Name','Value'],
  ] ;
  for ( var setting in config.game ) {
    data1.push([ setting, config.game[setting].value ]);
  }
  table.setData(data1);
  store.UI.screen.render();
})

table.key('down', function( ch, key ) {
  table.down(1);
});

table.key('up', function( ch, key ) {
  table.up(1);
});

table.key('enter', function( ch, key ) {
  var setting = data1[table.selected][0] ;

  if ( config.game[setting].no_space ) {
    if ( config.game[setting].value == '' )
      store.UI.prompt.emit('prompt', setting, config.game[setting].prompt_text, config.game[setting].initial_value, true );
    else
      store.UI.prompt.emit('prompt', setting, config.game[setting].prompt_text, config.game[setting].value, true );
  } else {
    if ( config.game[setting].value == '' )
      store.UI.prompt.emit('prompt', setting, config.game[setting].prompt_text, config.game[setting].initial_value );
    else
      store.UI.prompt.emit('prompt', setting, config.game[setting].prompt_text, config.game[setting].value );
  }
});

table.key(['d', 'D'], function( ch, key ) {
  var setting = data1[table.selected][0] ;

  config.game[setting].value = config.game[setting].initial_value;

  table.emit('update');
});

table.key(['s', 'S'], function( ch, key ) {
  config.save() ;
  store.UI.updaterStatus.emit('update');
});

table.key(['l', 'L'], function( ch, key ) {
  config.load() ;
  table.emit('update');
});

table.on('focus', function() {
  store.UI.helpLine.emit('content', '<Escape> Unfocus       <Enter> Edit Setting         <D> Default Value        <S> Save Config       <L> Load Config       <Ctrl-C> Exit');
  table.style.border.fg = config.color.alert;
  store.UI.screen.render();
});

table.on('blur', function() {
  table.style.border.fg = config.color.primary;
  store.UI.screen.render();
})

store.UI.serverSettings = table ;
module.exports = table;