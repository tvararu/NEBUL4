describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var title = client.evalSync(function() {
      var titleText = $('title').text();

      emit('return', titleText);
    });

    title.should.equal('NEBUL4');

    done();
  });

  it('should CHANGEME', function(done, server, c1) {
    var p1Position = c1.evalSync(function() {
      waitForDOM($('#game .ready'), function() {
        initial = App.three.renderer.setFaceCulling.toString();
        // initial = App.three.spaceship.position.z;
        // App.three.spaceship.position.z += 1;

        // // Move the ship forward by pushing the Up arrow.
        // var e = jQuery.Event('keydown');
        // e.which = 38;
        // $(document).trigger(e);

        // var spaceship = _.pick(App.three.spaceship, '_id', 'position');
        // Ships.update(spaceship._id, spaceship);

        emit('return', initial);
      });
    });

    console.log(p1Position);
    // p1Position.should.equal(0);

    // var p2Position = c2.evalSync(function() {
    //   waitForDOM($('#game .ready'), function() {
    //     // var position = App.three.spaceship.position.z;
    //     var position = Ships.findOne().position.z;
    //
    //     emit('return', position);
    //   });
    // });
    //
    // p2Position.should.equal(1);

    // c1.eval(function() {
    //   Ships.find().observe({
    //     added: function(post) {
    //       emit('post', post);
    //     }
    //   });
    //
    //   emit('done');
    // }).once('post', function(post) {
    //   console.log(post);
    //   post.should.have.property('position');
    //   done();
    // }).once('done', function() {
    //   c2.eval(insertPost);
    // });
    //
    // function insertPost() {
    //   Ships.insert({
    //     title: 'from c2'
    //   });
    // }

    done();
  });
});
