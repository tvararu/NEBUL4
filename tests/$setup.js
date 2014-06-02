// Set up some dependencies so we can use certain gimmicks within tests.
should = require('../.node_modules/should').should;
assert = require('assert');

// You can define global methods for all tests right here, if you want.
signup = function(client, username) {
  username = username || 'test';

  var gameVisible = client.evalSync(function(username) {
    App.after('loginRendered', function() {
      $('#login-dropdown-list .dropdown-toggle').click();

      Meteor.setTimeout(function() {
        $('#signup-link').click();

        $('#login-username').val(username);
        $('#login-password').val('qwerty');
        $('#login-password-again').val('qwerty');

        $('#login-buttons-password').click();
      }, 1);
    });

    App.after('gameRendered', function() {
      emit('return', true);
    });
  }, username);

  gameVisible.should.be.ok;
};
