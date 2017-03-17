var blessed = require('blessed');
var config = require('../../config.js');
var store = require('../../store.js');

var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 'shrink',
  tags: true,
  scrollable: true,
  label: ' Details ',
  border: {
    type: 'line'
  },
  visible: false,
  style: {
    fg: config.color.primaryColor,
    bg: config.color.secondaryColor,
    border: {
      fg: config.color.primaryColor
    }
  }
});

box.on('detail', function(etime, etype, edesc, elog) {
  store.UI.screen.append(box);
  for ( var l in box.getLines() ) {
    box.deleteTop() ;
  }

  box.pushLine("Time: " + etime);
  box.pushLine("Event Type: " + etype);
  box.pushLine("Event Description: " + edesc);
  box.pushLine("Event Log:\n" + elog);
  box.scrollTo(box.getScrollHeight());

  store.UI.screen.focusPop();
  box.focus() ;
  store.UI.screen.render();
});

box.on('focus', function() {
  store.UI.helpLine.emit('content', '<Enter> Exit      <Up> Scroll up      <Down> Scroll down');
});

box.key('enter', function( ch, key ) {
  store.UI.screen.focusPop();
  store.UI.eventLog.focus();
  store.UI.screen.remove(box);
  store.UI.screen.render() ;
});

box.key('down', function( ch, key ) {
  box.scroll(1);
  store.UI.screen.render();
});

box.key('up', function( ch, key ) {
  box.scroll(-1);
  store.UI.screen.render();
});

store.UI.log_detail = box ;
module.exports = box;