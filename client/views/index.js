UI.body.rendered = function() {
  // The global application namespace.
  window.App = window.App || {};
  
  // Grab the main game container.
  App.container = $(document);
  
  // Initialize listeners for keyboard events.
  App.keyinit();
  
  // Another namespace to hold all the graphics stuff.
  App.three = App.three || App.THREEinit();

  Ships.find().observe({
    added: function(ship) {
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        var spaceship = App.three.spaceship = object3d;
  
        spaceship._id = ship._id;
        spaceship.position = ship.position;
        App.three.scene.add(App.three.spaceship);
  
        App.triggerEvent('shipLoaded', ship);
  
        setInterval(function() {
          var spaceship = _.pick(App.three.spaceship, '_id', 'position');
          Ships.update(spaceship._id, spaceship);
        }, 1000);
      });
  
      App.triggerEvent('shipAdded', ship);
    }
  });
  
  var updateShip = function(ship) {
    App.three.spaceship.position = ship.position;
    shipStream.emit('updateShip', ship);
  
    App.triggerEvent('shipChanged', ship);
  };
  
  shipStream.on('updateShip', function(ship) {
    App.three.spaceship.position = ship.position;
  
    App.triggerEvent('shipChanged', ship);
  });
  
  App.three.onRenderFcts.push(function() {
    if (App.three.spaceship) {
      var spaceship = _.pick(App.three.spaceship, '_id', 'position');
      var camera = App.three.camera;
      
      if (App.keyState.left || App.keyState.a) {
        spaceship.position.x += 0.1;
        camera.position.x += 0.1;
      }
      
      if (App.keyState.right || App.keyState.d) {
        spaceship.position.x -= 0.1;
        camera.position.x -= 0.1;
      }
      
      if (App.keyState.up || App.keyState.w) {
        spaceship.position.z += 0.1;
        camera.position.z += 0.1;
      }
      
      if (App.keyState.down || App.keyState.s) {
        spaceship.position.z -= 0.1;
        camera.position.z -= 0.1;
      }
      
      updateShip(spaceship);
    }
  });
};
