window.App = window.App || {};

App.playerInit = function() {
  var player = {};
  
  // App.player is a THREE group containing the ship, the reticle,
  // and the camera.
  player = new THREE.Object3D();
  player.camera = App.three.camera;
  player.add(player.camera);

  App.three.scene.add(new THREE.AxisHelper(20));

  player.move = function(direction) {
    var distance = 0.1;

    var dir;

    switch(direction) {
    case 'left':
      dir = new THREE.Vector3(distance, 0, 0);
      break;
    case 'right':
      dir = new THREE.Vector3(-distance, 0, 0);
      break;
    case 'up':
      dir = new THREE.Vector3(0, 0, distance);
      break;
    case 'down':
      dir = new THREE.Vector3(0, 0, -distance);
      break;
    }

    var matrix = new THREE.Matrix4();
    matrix.extractRotation(this.matrix);
  
    dir = dir.applyProjection(matrix);
  

    this.position.x += dir.x;
    this.position.y += dir.y;
    this.position.z += dir.z;

    this.update();
  };

  player.update = function() {
    playerStream.emit('updatePlayerPosition', this.position);
    App.triggerEvent('playerChanged', this.position);
  };

  player.reset = function() {
    this.position = new THREE.Vector3();
  };

  playerStream.on('updatePlayerPosition', function(position) {
    player.position = position;

    App.triggerEvent('playerChanged', position);
  });

  playerStream.on('updatePlayerRotation', function(cacat) {
    player.rotate(cacat.direction, cacat.angle);
  });

  player.rotate = function(direction, angle) {
    var axis;
  
    switch(direction) {
    case 'left':
    case 'right':
      axis = new THREE.Vector3(0, 1, 0);
      break;
    case 'up':
    case 'down':
      axis = new THREE.Vector3(1, 0, 0);
      break;
    }
  
    this.rotateOnAxis(axis, angle);
  };

  Players.find().observe({
    added: function(p) {
      player._id = p._id;
      player.position = p.position;
    
      App.triggerEvent('playerAdded', p);
    
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        var ship = object3d;
        
        player.ship = ship;
        player.add(ship);
      
        player.camera.position.x = ship.position.x + 0;
        player.camera.position.y = ship.position.y + 2.3;
        player.camera.position.z = ship.position.z - 3.5;
      
        player.reticle = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.12, 20),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
          })
        );
      
        player.reticle.position.x = ship.position.x;
        player.reticle.position.y = ship.position.y;
        player.reticle.position.z = ship.position.z + 2.0;
      
        player.reticle.lookAt(player.camera.position);
        player.camera.lookAt(player.reticle.position);
      
        player.add(player.reticle);
      
        App.three.scene.add(player);
      
        App.triggerEvent('playerLoaded', player);
      });
    }
  });

  App.three.onRenderFcts.push(function() {
    if (player.ship) {
      if (App.keyState('left') || App.keyState('a')) {
        player.move('left');
      }
    
      if (App.keyState('right') || App.keyState('d')) {
        player.move('right');
      }
    
      if (App.keyState('up') || App.keyState('w')) {
        player.move('up');
      }
    
      if (App.keyState('down') || App.keyState('s')) {
        player.move('down');
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

  App.three.onRenderFcts.push(function() {
    if (player.ship) {
      if (App.keyToggleState('spacebar')) {
        var x = Session.get('mouseX');
    
        var angle = (Math.PI / 180) * (Math.abs(x) * 5);
    
        if (x < 0) {
          player.rotate('left', angle);
          playerStream.emit(
            'updatePlayerRotation',
            { angle: angle, direction: 'left' }
          );
        } else {
          player.rotate('right', -angle);
          playerStream.emit(
            'updatePlayerRotation',
            { angle: -angle, direction: 'right' }
          );
        }
    
        var y = Session.get('mouseY');
    
        angle = (Math.PI / 180) * (Math.abs(y) * 5);
    
        if (y < 0) {
          player.rotate('up', -angle);
          playerStream.emit(
            'updatePlayerRotation',
            { angle: -angle, direction: 'up' }
          );
        } else {
          player.rotate('down', angle);
          playerStream.emit(
            'updatePlayerRotation',
            { angle: angle, direction: 'down' }
          );
        }
      } else {
        // TODO: While the space key is not held down, slowly transition
        // the ship back to horizontal orientation.
      }
    }
  });
  

  App.container.on('playerLoaded', function() {
    Meteor.setInterval(function() {
      var p = _.pick(player, '_id', 'position');
      Players.update(p._id, p);
    }, 500);
  });
  
  return player;
};