var assert = require('assert');

describe('Landing page', function() {
  it('should display "Hello world!"', function(done, server, client) {
    var paragraph = client.evalSync(function() {
      emit('return', $('p').text());
    });
    
    assert.equal(paragraph, "Hello world!");
    done();
  });
});