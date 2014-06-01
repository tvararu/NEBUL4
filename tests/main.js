describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var titleText = client.evalSync(function() {
      var titleText = $('title').text();

      emit('return', titleText);
    });

    titleText.should.equal('NEBUL4');

    done();
  });

  it('should show the login button', function(done, server, client) {
    var loginText = client.evalSync(function() {
      App.after('loginRendered', function() {
        var loginText = $('#login-dropdown-list .dropdown-toggle').text().trim();

        emit('return', loginText);
      });
    });

    loginText.should.equal('Sign In / Up');
    done();
  });
});

describe('Gameplay', function() {
  // it('up arrow should move ship forwards', function(done, server, client) {
  //   var position = client.evalSync(function() {
  //     var initial = 0, after = 0;
  // 
  //     if (App.container) {
  //       emit('return', { initial: initial, after: 0.1 });
  //     }
  // 
  //     App.container.on('keyboardInitialized', function(e, player) {
  //       emit('return', { initial: initial, after: 0.1 });
  //     });
  // 
  //     App.container.on('playerLoaded', function(e, player) {
  //       initial = player.position.z;
  // 
  //       emit('return', { initial: initial, after: after });
  //     });
  // 
  //     App.container.on('playerChanged', function(e, player) {
  //       after = player.position.z;
  // 
  //       emit('return', { initial: initial, after: after });
  //     });
  //   });
  // 
  //   console.log(position);
  //   position.initial.should.be.exactly(0);
  //   position.after.should.be.above(0);
  // 
  //   done();
  // });
  // 
  // it('konami code should work', function(done, server, client) {
  //   var codeDidTrigger = client.evalSync(function() {
  // 
  //     App.container.on('playerLoaded', function() {
  //       App.pushKeys('up up down down left right left right b a', 1);
  //     });
  // 
  //     App.container.on('konami', function() {
  //       emit('return', true);
  //     });
  //   });
  // 
  //   codeDidTrigger.should.equal(true);
  // 
  //   done();
  // });
});
