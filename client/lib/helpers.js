// helpers.js - Miscellaneous helper methods.

window.App = window.App || {};
App.events = {};

// App.triggerEvent will trigger the specified event with the specified payload
// on the game container element.
App.triggerEvent = function(name, payload) {
  App.events[name] = payload || true;
  App.container.trigger(name, payload);
};

// App.after('something', foo() { /* ... */ });
// will trigger foo if the 'something' event has triggered, or wait
// for it to trigger.
App.after = function(name, callback) {
  if (App.events[name]) {
    callback(App.events[name]);
  } else {
    App.container.on(name, callback);
  }
};
