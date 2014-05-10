UI.body.helpers({
  spacebarState: function() {
    return Session.get('spacebarToggleState') ? 'true' : 'false';
  },
  mouseXState: function() {
    return Session.get('mouseX') * 10 || '0';
  },
  mouseYState: function() {
    return Session.get('mouseY') * 10 || '0';
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
        this.camera.position.x += 0.1;
        break;
      case 'right':
        this.ship.position.x -= 0.1;
        this.camera.position.x -= 0.1;
        break;
      case 'up':
        this.ship.position.z += 0.1;
        this.camera.position.z += 0.1;
        break;
      case 'down':
        this.ship.position.z -= 0.1;
        this.camera.position.z -= 0.1;
        break;
      }
      
      App.three.camera.controls.syncTo(App.player.ship);
      
      updateShip(this.ship.position);
    },
    rotate: function(direction, angle) {
      switch(direction) {
      case 'left':
        this.ship.rotation.y += angle;
        break;
      case 'right':
        this.ship.rotation.y -= angle;
        break;
      case 'up':
        this.ship.rotation.x += angle;
        break;
      case 'down':
        this.ship.rotation.x -= angle;
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
  
        App.player.camera.position.x = spaceship.position.x + 0;
        App.player.camera.position.y = spaceship.position.y + 2.3;
        App.player.camera.position.z = spaceship.position.z - 3.5;
  
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
      var x = Session.get('mouseX');
      
      if (Math.abs(x * 10) > 0.5) {
        var angle = Math.PI / (180 / Math.abs(x) / 2);
        
        if (x < 0) {
          App.player.rotate('left', angle);
          App.three.camera.controls.rotateRight(angle);
        } else {
          App.player.rotate('right', angle);
          App.three.camera.controls.rotateLeft(angle);
        }
      }
      
      var y = Session.get('mouseY');
      
      if (Math.abs(y * 10) > 0.5) {
        var angle = Math.PI / (180 / Math.abs(y) / 2);
        
        if (y < 0) {
          App.player.rotate('down', angle);
          App.three.camera.controls.rotateDown(angle);
        } else {
          App.player.rotate('up', angle);
          App.three.camera.controls.rotateUp(angle);
        }
      }
    }
  });
  
  App.container.on('shipLoaded', function (ship) {
    App.three.camera.controls = new THREE.OrbitControls(App.three.camera);
    // Disable directional keys for OrbitControls.
    App.three.camera.controls.noKeys = true;
    App.three.camera.controls.noZoom = true;
    
    App.three.camera.controls.syncTo = function(obj) {
      App.three.camera.controls.target.x = obj.position.x;
      App.three.camera.controls.target.y = obj.position.y;
      App.three.camera.controls.target.z = obj.position.z;
    }
    
    App.three.camera.controls.syncTo(App.player.ship);
    
    App.three.onRenderFcts.push(function () {
      App.three.camera.controls.update();
    });
  });
};
