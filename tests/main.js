describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var title = client.evalSync(function() {
      var titleText = $('title').text();
      
      emit('return', titleText);
    });
    
    title.should.equal('NEBUL4');
    
    done();
  });
  
  it('should display four <h1> tags', function(done, server, client) {
    var h1s = client.evalSync(function() {
      var h1s = $('h1').length;
      
      emit('return', h1s);
    });
    
    h1s.should.be.exactly(4);
    
    done();
  });
});