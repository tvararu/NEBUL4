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
  
  // App.player is a THREE group containing the ship, the reticle,
  // and the camera.
  App.player = new THREE.Object3D();
  App.player.camera = App.three.camera;
  App.player.add(App.player.camera);
  
  App.three.scene.add(new THREE.AxisHelper(20));
  
  App.player.move = function(direction) {
    switch(direction) {
    case 'left':
      this.position.x += 0.1;
      break;
    case 'right':
      this.position.x -= 0.1;
      break;
    case 'up':
      this.position.z += 0.1;
      break;
    case 'down':
      this.position.z -= 0.1;
      break;
    }
    
    this.update();
  };
  
  App.player.update = function() {
    playerStream.emit('updatePlayer', this.position);
    // TODO: check if this is necessary.
    App.triggerEvent('playerChanged', this.position);
  };
  
  playerStream.on('updatePlayer', function(position) {
    App.player.position = position;
  
    App.triggerEvent('playerChanged', position);
  });
  
  App.player.rotate = function(direction, angle) {
    angle = angle || Math.PI / 180;
    
    switch(direction) {
    case 'left':
      this.rotation.y += angle;
      break;
    case 'right':
      this.rotation.y -= angle;
      break;
    case 'up':
      this.rotation.x -= angle;
      break;
    case 'down':
      this.rotation.x += angle;
      break;
    }
  };
  
  // Initialize easter egg.
  App.easterEgg.init();
  
  // Initialize touchscreen gestures.
  App.hammerInit();

  Players.find().observe({
    added: function(player) {
      App.player._id = player._id;
      App.player.position = player.position;
      
      App.triggerEvent('playerAdded', App.player);
      
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        var ship = object3d;
          
        App.player.ship = ship;
        App.player.add(ship);
        
        App.player.camera.position.x = ship.position.x + 0;
        App.player.camera.position.y = ship.position.y + 2.3;
        App.player.camera.position.z = ship.position.z - 3.5;
        
        App.player.reticle = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.12, 20),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
          })
        );
        
        App.player.reticle.position.x = ship.position.x;
        App.player.reticle.position.y = ship.position.y;
        App.player.reticle.position.z = ship.position.z + 2.0;
        
        App.player.reticle.lookAt(App.player.camera.position);
        App.player.camera.lookAt(App.player.reticle.position);
        
        App.player.add(App.player.reticle);
        
        App.three.scene.add(App.player);
        
        App.triggerEvent('playerLoaded', App.player);
        
        setInterval(function() {
          var player = _.pick(App.player, '_id', 'position');
          Players.update(player._id, player);
        }, 500);
      });
    }
  });
  
  App.three.onRenderFcts.push(function() {
    if (App.player.ship) {
      if (App.keyState('left') || App.keyState('a')) {
        App.player.move('left');
      }
      
      if (App.keyState('right') || App.keyState('d')) {
        App.player.move('right');
      }
      
      if (App.keyState('up') || App.keyState('w')) {
        App.player.move('up');
      }
      
      if (App.keyState('down') || App.keyState('s')) {
        App.player.move('down');
      }
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
      
      if (Math.abs(x * 10) > 0.2) {
        var angle = (Math.PI / 180) * (Math.abs(x) * 5);
        
        if (x < 0) {
          App.player.rotate('left', angle);
        } else {
          App.player.rotate('right', angle);
        }
      }
      
      var y = Session.get('mouseY');
      
      if (Math.abs(y * 10) > 0.2) {
        var angle = (Math.PI / 180) * (Math.abs(y) * 5);
        
        if (y < 0) {
          App.player.rotate('up', angle);
        } else {
          App.player.rotate('down', angle);
        }
      }
    }
  });
  
  // App.container.on('shipLoaded', function (ship) {
  //   App.three.camera.controls = new THREE.OrbitControls(App.three.camera);
  //   // Disable directional keys for OrbitControls.
  //   App.three.camera.controls.noKeys = true;
  //   App.three.camera.controls.noZoom = true;
  //   
  //   App.three.camera.controls.syncTo = function(obj) {
  //     App.three.camera.controls.target.x = obj.position.x;
  //     App.three.camera.controls.target.y = obj.position.y;
  //     App.three.camera.controls.target.z = obj.position.z;
  //   }
  //   
  //   App.three.camera.controls.syncTo(App.player.ship);
  //   
  //   App.three.onRenderFcts.push(function () {
  //     App.three.camera.controls.update();
  //   });
  // });
};
