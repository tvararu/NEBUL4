UI.body.helpers({
  spacebarState: function() {
    return Session.get('spacebarToggleState') ? 'true' : 'false';
  },
  mouseXState: function() {
    return Session.get('mouseX') || '0.0';
  },
  mouseYState: function() {
    return Session.get('mouseY') || '0.0';
  },
  reticleState: function() {
    return Session.get('spacebarToggleState') ? 'active' : '';
  }
});

UI.body.rendered = function() {
  // The global application namespace.
  window.App = window.App || {};
  
  // Grab the main game container.
  App.container = $(document);
  
  // Initialize listeners for keyboard events.
  App.keyInit();
  
  // Another namespace to hold all the graphics stuff.
  App.three = App.three || App.THREEinit();
  
  App.player = {
    camera: App.three.camera,
    ship: null,
    move: function(direction) {
      switch(direction) {
      case 'left':
        this.ship.position.x += 0.1;
        if (this.ship.rotation.z > -0.7) {
          this.ship.rotation.z -= 0.06 ;
        }
        this.camera.position.x += 0.1;
        break;
      case 'right':
        this.ship.position.x -= 0.1;
        if (this.ship.rotation.z < 0.7) {
          this.ship.rotation.z += 0.06 ;
        }
        this.camera.position.x -= 0.1;
        break;
      case 'up':
        this.ship.position.z += 0.1;
        if (this.ship.rotation.x < 0.3) {
          this.ship.rotation.x += 0.06 ;
        }
        this.camera.position.z += 0.1;
        break;
      case 'down':
        this.ship.position.z -= 0.1;
        if (this.ship.rotation.x > -0.2) {
          this.ship.rotation.x -= 0.06 ;
        }
        this.camera.position.z -= 0.1;
        break;
      case 'default':
          var shipX = this.ship.rotation.x;
          var tween = new TWEEN.Tween({x : shipX})
            .to({x : 0}, 2000)
            .easing(TWEEN.Easing.Quadratic.EaseOut)
            .onUpdate(function() {
              shipX = this.x;
            })
            .start();
          // this.ship.rotation.x = 0 ;
          // this.ship.rotation.y = 0 ;
          // this.ship.rotation.z = 0 ;
        break;
      }

      updateShip(this.ship.position);
    }
  };
  
  // Initialize easter egg.
  App.easterEgg.init();
  
  // Initialize touchscreen gestures.
  App.hammerInit();

  Ships.find().observe({
    added: function(ship) {
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        var spaceship = App.player.ship = object3d;
  
        spaceship._id = ship._id;
        spaceship.position = ship.position;
        App.three.scene.add(App.player.ship);
        
        // Align camera correctly.
        App.player.camera.position.x = spaceship.position.x + 0;
        App.player.camera.position.y = spaceship.position.y + 2.3;
        App.player.camera.position.z = spaceship.position.z - 3.5;
  
        App.player.camera.rotation.x = spaceship.rotation.x + 0.4;
        App.player.camera.rotation.y = spaceship.rotation.y + 3.15;
        App.player.camera.rotation.z = spaceship.rotation.z + 0.0;
  
        App.triggerEvent('shipLoaded', ship);
  
        setInterval(function() {
          var spaceship = _.pick(App.player.ship, '_id', 'position');
          Ships.update(spaceship._id, spaceship);
        }, 500);
      });
  
      App.triggerEvent('shipAdded', ship);
    }
  });
  
  var updateShip = function(position) {
    shipStream.emit('updateShip', position);
  
    App.triggerEvent('shipChanged', position);
  };
  
  shipStream.on('updateShip', function(position) {
    App.player.ship.position = position;
  
    App.triggerEvent('shipChanged', position);
  });
  
  App.three.onRenderFcts.push(function() {
    if (App.player.ship) {
      if (!App.keyState('down') && !App.keyState('left') && !App.keyState('right') && !App.keyState('up')) { App.player.move('default'); }

      if (App.keyState('left') || App.keyState('a'))  { App.player.move('left'); }
      
      if (App.keyState('right') || App.keyState('d')) { App.player.move('right'); }
      
      if (App.keyState('up') || App.keyState('w'))    { App.player.move('up'); }
      
      if (App.keyState('down') || App.keyState('s'))  { App.player.move('down'); }
    }
  });
  
  // Camera Controls.
  var mouse = {
    x: 0,
    y: 0
  };
  
  document.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) - 0.5;
    Session.set('mouseX', mouse.x);
    
    mouse.y = (event.clientY / window.innerHeight) - 0.5;
    Session.set('mouseY', mouse.y);
  }, false);
  
  App.three.onRenderFcts.push(function(delta) {
    if (App.player.ship && App.keyToggleState('spacebar')) {
      
      // App.player.camera.position.x += (mouse.x * 5 - App.player.camera.position.x) * (delta * 3);
      // App.player.camera.position.y += (mouse.y * 5 - App.player.camera.position.y) * (delta * 3);
      
      // App.player.camera.lookAt(App.player.ship.position);
    }
  });
};
