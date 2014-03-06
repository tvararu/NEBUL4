describe('Landing page', function() {
  it('Should load for unauthenticated users', function(done, server, client) {
    client.eval(function() {
      waitForDOM('h1', function() {
        emit('login-link-text', $('#login-sign-in-link').text());
        var h1 = $('h1');
        emit('h1-len', h1.length);
        emit('full-text', $('body').text());
        emit('return');
      });
    }).once('login-link-text', function(text) {
      return assert.equal(text, 'Sign in ▾');
    }).once('h1-len', function(len) {
      return assert.equal(len, 1);
    }).once('full-text', function(text) {
      return assert.equal(text.match(/my games/i), null);
    }).once('return', function() {
      return done();
    });
  });
});

// var assert = require('assert');
// 
// suite('Posts', function() {
//   test('in the server', function(done, server) {
//     server.eval(function() {
//       Posts.insert({
//         title: 'hello title'
//       });
//       var docs = Posts.find().fetch();
//       emit('docs', docs);
//     });
// 
//     server.once('docs', function(docs) {
//       assert.equal(docs.length, 1);
//       done();
//     });
//   });
// 
//   test('using both client and the server', function(done, server, client) {
//     server.eval(function() {
//       Posts.find().observe({
//         added: addedNewPost
//       });
// 
//       function addedNewPost(post) {
//         emit('post', post);
//       }
//     }).once('post', function(post) {
//       assert.equal(post.title, 'hello title');
//       done();
//     });
// 
//     client.eval(function() {
//       Posts.insert({
//         title: 'hello title'
//       });
//     });
//   });
// 
//   test('using two clients', function(done, server, c1, c2) {
//     c1.eval(function() {
//       Posts.find().observe({
//         added: addedNewPost
//       });
// 
//       function addedNewPost(post) {
//         emit('post', post);
//       }
//       emit('done');
//     }).once('post', function(post) {
//       assert.equal(post.title, 'from c2');
//       done();
//     }).once('done', function() {
//       c2.eval(insertPost);
//     });
// 
//     function insertPost() {
//       Posts.insert({
//         title: 'from c2'
//       });
//     }
//   });
// 
// });
