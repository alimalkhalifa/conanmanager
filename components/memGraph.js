var blessedc = require('blessed-contrib');
var config = require('../config.js');
var store = require('../store.js');

var graph = blessedc.stackedBar ({
  top: '50%',
  left: '80%',
  width: '20%',
  height: '45%',
  tags: true,
  label: ' {bold}Memory (MB){/} ',
  barWidth: 12,
  barSpacing: 2,
  xOffset: 4,
  barBgColor: [ 'red', 'green' ],
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

store.UI.screen.append(graph);

graph.on('update', function() {
  if ( store.pid >= 0 ) {
    graph.setData( {
      barCategory: ['MB'],
      stackedCategory: ['Server', 'Free'],
      data: [
        [ parseInt(store.servermem), parseInt(store.freemem)]
      ]
    });
  } else {
    graph.setData( {
      barCategory: ['MB'],
      stackedCategory: ['Server', 'Free'],
      data: [
        [ 0, parseInt(store.freemem)]
      ]
    });
  }

  store.UI.screen.render();
});

graph.emit('update');

store.UI.memGraph = graph ;
module.exports = graph;