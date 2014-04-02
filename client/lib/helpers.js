// helpers.js - Miscellaneous helper methods.

window.App = window.App || {};

// App.triggerEvent will trigger the specified event with the specified payload
// on the game container element.
App.triggerEvent = function(name, payload) {
  App.container.trigger(name, payload);
};