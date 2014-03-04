describe('Project', function() {
  before(function() {
    casper.start('http://localhost:3000/');
  });

  it('should have correct title', function() {
    casper.then(function() {
      'title'.should.contain.text('mds');
    });
  });

  it('should output hello world', function() {
    casper.then(function() {
      'p'.should.contain.text('Hello world!');
    });
  });
});
