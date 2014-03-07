describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    var title = client.evalSync(function() {
      var titleText = $('title').text();
      
      emit('return', titleText);
    });
    
    title.should.equal('mds');
    
    done();
  });
});