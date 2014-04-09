// hammer-init.js - Initialize hammer.js touchscreen gestures.

window.App = window.App || {};

App.hammerInit = function() {
  var hammer = App.container.hammer();
  
  hammer.on('swipeup',    function() { App.pushKey('up'); });
  hammer.on('swipedown',  function() { App.pushKey('down'); });
  hammer.on('swipeleft',  function() { App.pushKey('left'); });
  hammer.on('swiperight', function() { App.pushKey('right'); });
};