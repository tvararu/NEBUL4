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
    rotate: function(direction, magnitude) {
      if (magnitude) {
        magnitude = Math.abs(magnitude) / 100;
      } else {
        magnitude = 0.01;
      }
      
      switch(direction) {
      case 'left':
        this.ship.rotation.y += magnitude;
        this.camera.rotation.y += magnitude;
        break;
      case 'right':
        this.ship.rotation.y -= magnitude;
        this.camera.rotation.y -= magnitude;
        break;
      case 'up':
        this.ship.rotation.x += magnitude;
        this.camera.rotation.x += magnitude;
        break;
      case 'down':
        this.ship.rotation.x -= magnitude;
        this.camera.rotation.x -= magnitude;
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
  // var mouse = {
  //   x: 0,
  //   y: 0
  // };
  // 
  // document.addEventListener('mousemove', function(event) {
  //   mouse.x = (event.clientX / window.innerWidth) - 0.5;
  //   Session.set('mouseX', mouse.x);
  //   
  //   mouse.y = (event.clientY / window.innerHeight) - 0.5;
  //   Session.set('mouseY', mouse.y);
  // }, false);
  
  // App.three.onRenderFcts.push(function(delta) {
  //   if (App.player.ship && App.keyToggleState('spacebar')) {
  //     // var x = Session.get('mouseX');
  //     // 
  //     // if (Math.abs(x * 10) > 0.5) {
  //     //   if (x < 0) {
  //     //     App.player.rotate('left', x);
  //     //   } else {
  //     //     App.player.rotate('right', x);
  //     //   }
  //     // }
  //     
  //     // var y = Session.get('mouseY');
  //     // 
  //     // if (Math.abs(y * 10) > 0.5) {
  //     //   if (y < 0) {
  //     //     App.player.rotate('down');
  //     //   } else {
  //     //     App.player.rotate('up');
  //     //   }
  //     // }
  //     
  //     // App.player.camera.position.x += (mouse.x * 5 - App.player.camera.position.x) * (delta * 3);
  //     // App.player.camera.position.y += (mouse.y * 5 - App.player.camera.position.y) * (delta * 3);
  //     
  //     // App.player.camera.lookAt(App.player.ship.position);
  //   }
  // });
  
  App.container.on('shipLoaded', function (ship) {
    App.three.camera.controls = new THREE.OrbitControls(App.three.camera);
    // Disable directional keys for OrbitControls.
    App.three.camera.controls.noKeys = true;
    
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
