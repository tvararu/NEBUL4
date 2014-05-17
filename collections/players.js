Meteor.users.allow({
  update: function(userId, user) {
    console.log(user.profile.position)
    return user && user._id === userId;
  }
});

playerStream = new Meteor.Stream('players');
