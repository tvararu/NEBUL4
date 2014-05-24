// easter-egg.js - What's easter without an easter egg?

window.App = window.App || {};

App.easterEgg = {
  sound: new buzz.sound('/sounds/easter-egg/sanic', {
    formats: ['ogg', 'mp3'],
    preload: true,
    autoplay: false,
    loop: true
  }),
  init: function() {
    App.container.konami({
      cheat: function() {
        App.triggerEvent('konami', true);
        
        App.easterEgg.sound.play();
        
        setInterval(function() {
          var randomColor = '#' + Random.hexString(6);
          $('#game').css('background', randomColor);
          
          var randomOne = function() {
            return Random.choice([-1, 1]);
          };
          
          App.three.camera.position.x += randomOne();
          App.three.camera.position.y += randomOne();
          App.three.camera.position.z += randomOne();
          App.three.camera.lookAt(App.three.spaceship.position);
        }, 100);
      }
    });
    
    // Speed of light cheat code.
    App.container.konami({
      code: [
        App.key['s'],
        App.key['p'],
        App.key['e'],
        App.key['e'],
        App.key['d'],
        App.key['o'],
        App.key['f'],
        App.key['l'],
        App.key['i'],
        App.key['g'],
        App.key['h'],
        App.key['t']
      ],
      cheat: function() {
        alert('Speed of light on.');
        App.player.MAXSPEED = 1.0;
        App.player.ACCEL = 0.008;
      }
    });
  }
};