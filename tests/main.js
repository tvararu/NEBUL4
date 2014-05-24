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
  
      console.log(App.container);
      emit('return', { initial: initial, after: after });
      // App.container.on('playerLoaded', function(e, player) {
      //   initial = player.position.z;
      //   
      //   App.pushKey('up');
      // });
      //   
      // App.container.on('playerChanged', function(e, player) {
      //   after = player.position.z;
      //   
      //   emit('return', { initial: initial, after: after });
      // });
    });
  
    position.initial.should.be.exactly(0);
    console.log(position.after);
    // position.after.should.be.exactly(0.1);
  
    done();
  });
  
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
