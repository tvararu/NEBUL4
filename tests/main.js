var assert = require('assert');

describe('Landing page', function() {
  it('should have the correct title', function(done, server, client) {
    // Get the title with some Laika mumbo jumbo and a dash of jQuery:
    var title = client.evalSync(function() {
      var titleText = $('title').text();
      
      emit('return', titleText);
    });
    
    // Check if it's correct.
    assert.equal(title, 'mds');
    
    // All tests end with the 'done' callback.
    done();
  });
  
  it('should display "Hello world!"', function(done, server, client) {
    var paragraph = client.evalSync(function() {
      emit('return', $('p').text());
    });
    
    assert.equal(paragraph, "Hello world!");
    done();
  });
});