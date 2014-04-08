// easter-egg.js - What's easter without an easter egg?

window.App = window.App || {};

App.easterEgg = {
  sound: new buzz.sound('/sounds/easter-egg/sanic', {
    formats: ['ogg', 'mp3'],
    preload: true,
    autoplay: false,
    loop: true
  }),
  konami: new Konami(function() {
    App.easterEgg.sound.play();
    
    setInterval(function() {
      var randomColor = '#' + Random.hexString(6);
      $('#game').css('background', randomColor);
    
      var randomOne = function() {
        return Random.choice([-1, 1]);
      };
    
      App.three.camera.position.z += randomOne();
      App.three.camera.position.y += randomOne();
      App.three.camera.position.z += randomOne();
      App.three.camera.lookAt(App.three.spaceship.position);
    }, 100);
  })
};