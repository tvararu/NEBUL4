describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var title = client.evalSync(function() {
      var titleText = $('title').text();

      emit('return', titleText);
    });

    title.should.equal('NEBUL4');

    done();
  });
});

describe('Gameplay', function() {
  it('up arrow should move ship forwards', function(done, server, client) {
    var position = client.evalSync(function() {
      var initial = 0, after = 0;

      App.container.on('shipLoaded', function() {
        initial = App.three.spaceship.position.z;

        App.pushKey('up');
      });

      App.container.on('shipChanged', function() {
        after = App.three.spaceship.position.z;

        emit('return', { initial: initial, after: after });
      });
    });

    position.initial.should.be.exactly(0);
    position.after.should.be.exactly(0.1);

    done();
  });
});
