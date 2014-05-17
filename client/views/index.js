Meteor.subscribe('players');

Template.game.helpers({
  spacebarState: function() {
    return Session.get('spacebarToggleState') ? 'true' : 'false';
  },
  mouseXState: function() {
    return Session.get('mouseX') * 10 || '0';
  },
  mouseYState: function() {
    return Session.get('mouseY') * 10 || '0';
  },
  reticleState: function() {
    return Session.get('spacebarToggleState') ? 'active' : '';
  }
});

Template.game.rendered = function() {
  // The global application namespace.
  window.App = window.App || {};
  
  // Grab the main game container.
  App.container = $(document);
  
  // Initialize listeners for keyboard events.
  App.keyInit();
  
  // Another namespace to hold all the graphics stuff.
  App.three = App.THREEinit();
  
  // Initialize easter egg.
  App.easterEgg.init();
  
  // Initialize touchscreen gestures.
  App.hammerInit();
  
  // Initialize player and camera.
  App.player = App.playerInit();
};
