describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var title = client.evalSync(function() {
      var titleText = $('title').text();
      
      emit('return', titleText);
    });
    
    title.should.equal('NEBUL4');
    
    done();
  });
  
  it('should CHANGEME', function(done, server, c1, c2) {
    var game1 = c1.evalSync(function() {
      waitForDOM($('#game #ready'), function() {
        // var spaceship = window.App.three.spaceship;
        
        emit('return', window.App.three.execTime);
      });
    });
    
    var game2 = c2.evalSync(function() {
      emit('return', 'lel');
    });
    
    console.log(game1);
    console.log(game2);
    
    done();
  });
});