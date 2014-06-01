// Configure accounts to require username instead of email.
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Meteor.subscribe('userStatus');

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
  },
  acceleration: function() {
    var accel = parseFloat(Session.get('acceleration'));
    return (accel < 0) ? 0.00 : parseInt(accel * 1000);
  },
  players: function() {
    return Meteor.users.find();
  }
});

Template.player.helpers({
  positionX: function() {
    if (this.profile.position) {
      return this.profile.position.x.toFixed(2);
    }
    return 0;
  },
  positionY: function() {
    if (this.profile.position) {
      return this.profile.position.y.toFixed(2);
    }
    return 0;
  },
  positionZ: function() {
    if (this.profile.position) {
      return this.profile.position.z.toFixed(2);
    }
    return 0;
  }
});

UI.body.rendered = function() {
  // The global application namespace.
  window.App = window.App || {};
  
  // Grab the main game container.
  App.container = $(document);
  
  // Initialize listeners for keyboard events.
  App.keyInit();
  
  // Initialize easter egg.
  App.easterEgg.init();
  
  // Initialize touchscreen gestures.
  App.hammerInit();
};

Template._loginButtonsLoggedOutDropdown.rendered = function() {
  App.container = App.container || $(document);
  App.triggerEvent('loginRendered');
};

Template.game.rendered = function() {
  // Another namespace to hold all the graphics stuff.
  App.three = App.THREEinit();
  
  // Initialize player and camera.
  App.player = App.playerInit();

  // Initialize stars.
  App.enviromentInit();
};
