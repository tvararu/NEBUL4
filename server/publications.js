Meteor.publish('players', function(limit) {
  return Players.find();
});
