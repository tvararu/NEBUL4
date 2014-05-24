Meteor.publish('userStatus', function() {
  return Meteor.users.find({
    'status.online': true
  });
});

var createPosition = function() {
  return {
    x: 0,
    y: 0,
    z: 0
  }
};

var randomShipType = function() {
  var random = parseInt(Math.random() * 3) + 3;
  return random;
};

Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    user.profile = options.profile;
  }
  user.profile.position = createPosition();
  user.profile.shipType = randomShipType();
  return user;
});
