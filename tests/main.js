describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    // Get the title with some Laika mumbo jumbo and a dash of jQuery:
    var title = client.evalSync(function() {
      var titleText = $('title').text();
      
      // Laika test functions don't end with a return call. Instead, they use
      // emit('return', anything);
      
      // You can pass anything, object or whatever you want.
      emit('return', titleText);
    });
    
    // Check if it's correct.
    title.should.equal('mds');
    
    // All tests end with the 'done' callback.
    done();
  });
  
  it('should display "Hello world!"', function(done, server, client) {
    var paragraph = client.evalSync(function() {
      emit('return', $('p').text());
    });
    
    paragraph.should.equal('Hello world!');
    done();
  });
});