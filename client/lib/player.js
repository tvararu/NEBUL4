window.App = window.App || {};

var Player = THREE.Object3D;

// Array which contains vectors for each corner of a cube
var rayDirections = [
  new THREE.Vector3(1, 1, 1),
  new THREE.Vector3(-1, 1, 1),
  new THREE.Vector3(1, 1, -1),
  new THREE.Vector3(-1, 1, -1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(-1, -1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, -1, -1)
];

Player.prototype.MAXSPEED = 0.1;
Player.prototype.BLINDSPOT = 0.02;
Player.prototype.ACCEL = 0.004;

Player.prototype.acceleration = {
  x: 0,
  y: 0,
  z: 0
};

Player.prototype.move = function(direction) {
  var speed = this.ACCEL;

  switch(direction) {
  case 'up':
    if (this.acceleration.z < this.MAXSPEED) {
      this.acceleration.z += speed;
    }
    break;
  case 'down':
    if (this.acceleration.z > 0) {
      this.acceleration.z -= speed;
    }
    break;
  case 'left':
    this.acceleration.x = (speed * 5);
    break;
  case 'right':
    this.acceleration.x = -(speed * 5); 
    break;
  }       

  Session.set('acceleration', this.acceleration.z);
};

Player.prototype.update = function() {
  var dir = new THREE.Vector3(
    this.acceleration.x,
    this.acceleration.y,
    this.acceleration.z
  );
  
  var matrix = new THREE.Matrix4();
  matrix.extractRotation(this.matrix);

  dir = dir.applyProjection(matrix);

  this.position.x += dir.x;
  this.position.y += dir.y;
  this.position.z += dir.z;
  
  this.acceleration.x = 0;
  
  playerStream.emit('updatePlayerPosition', {
    name: this.name,
    position: this.position
  });
  // App.triggerEvent('playerChanged', this.position);
};

Player.prototype.reset = function() {
  this.position = new THREE.Vector3();
};

Player.prototype.rotate = function(direction, angle) {
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
  case 'rollLeft':
  case 'rollRight':
    axis = new THREE.Vector3(0, 0, 1);
    this.ship.rotateOnAxis(axis, angle);
    // this.camera.rotateOnAxis(axis, angle);
    return;
    break;
  }

  this.rotateOnAxis(axis, angle);
};

App.playerInit = function() {
  var player = {};
  
  Session.set('acceleration', 0);
  
  // App.player is a THREE group containing the ship, the reticle,
  // and the camera.
  player = new Player();
  player.camera = App.three.camera;
  player.add(player.camera);

  playerStream.on('updatePlayerPosition', function(somePlayer) {
    var p = App.three.scene.getObjectByName(somePlayer.name);
    p.position = somePlayer.position;
    // App.triggerEvent('playerChanged', p.position);
  });

  playerStream.on('updatePlayerRotation', function(somePlayer) {
    var p = App.three.scene.getObjectByName(somePlayer.name);
    p.rotate(somePlayer.direction, somePlayer.angle);
  });

  App.players = [];
  App.three.scene.add(new THREE.AxisHelper(100));

  Meteor.users.find().observe({
    added: function(p) {      
      if (p._id === Meteor.user()._id) {
        player.name = p._id;
        player.position = p.profile.position || { x: 0, y: 0, z: 0 };
    
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

          App.players.push(player);
          var buff = "";
          for (var i = App.players.length - 1; i >= 0; i--) {
            buff += App.players[i].name + ' : ' + App.players[i].position.x.toFixed(2) + ' ' + App.players[i].position.y.toFixed(2) + ' ' + App.players[i].position.z.toFixed(2);
          };
          Session.set('players', buff);
        });
      } else {
        var otherPlayer = new Player();
        otherPlayer.name = p._id;
        otherPlayer.position = p.profile.position || { x: 0, y: 0, z: 0 };
      
        App.triggerEvent('playerAdded', otherPlayer);
    
        THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
          var ship = object3d;
        
          otherPlayer.ship = ship;
          otherPlayer.add(ship);
          
          App.three.scene.add(otherPlayer);
      
          App.players.push(otherPlayer);
          var buff = "";
          for (var i = App.players.length - 1; i >= 0; i--) {
            buff += App.players[i].name + ' : ' + App.players[i].position.x.toFixed(2) + ' ' + App.players[i].position.y.toFixed(2) + ' ' + App.players[i].position.z.toFixed(2);
          };
          Session.set('players', buff);
        });
      }
    },
    removed: function(p) {
      var somePlayer = App.three.scene.getObjectByName(p._id);
      App.three.scene.remove(somePlayer);
      App.players.remove(somePlayer);
      var buff = "";
      for (var i = App.players.length - 1; i >= 0; i--) {
        buff += App.players[i].name + ' : ' + App.players[i].position.x.toFixed(2) + ' ' + App.players[i].position.y.toFixed(2) + ' ' + App.players[i].position.z.toFixed(2);
      };
      Session.set('players', buff);
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

      if (App.keyState('q')) {
        player.rotate('rollLeft', -(Math.PI / 180));
      }

      if (App.keyState('e')) {
        player.rotate('rollRight', Math.PI / 180);
      }
    }
    
    App.player.update();
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
    
        if (Math.abs(x) > player.BLINDSPOT) {
          if (x < 0) {
            player.rotate('left', angle);
            playerStream.emit(
              'updatePlayerRotation',
              { name: player.name, angle: angle, direction: 'left' }
            );
          } else {
            player.rotate('right', -angle);
            playerStream.emit(
              'updatePlayerRotation',
              { name: player.name, angle: -angle, direction: 'right' }
            );
          }
        }
    
        var y = Session.get('mouseY');
    
        angle = (Math.PI / 180) * (Math.abs(y) * 5);
        
        if (Math.abs(y) > player.BLINDSPOT) {
          if (y < 0) {
            player.rotate('up', -angle);
            playerStream.emit(
              'updatePlayerRotation',
              { name: player.name, angle: -angle, direction: 'up' }
            );
          } else {
            player.rotate('down', angle);
            playerStream.emit(
              'updatePlayerRotation',
              { name: player.name, angle: angle, direction: 'down' }
            );
          }
        }
      } else {
        // TODO: While the space key is not held down, slowly transition
        // the ship back to horizontal orientation.
      }
    }
  });

  App.container.on('playerLoaded', function() {
    Meteor.setInterval(function() {
      var p = _.pick(player, 'name', 'position');
      Meteor.users.update(p.name, {
        $set: {
          profile: {
            position: p.position
          }
        }
      });
    }, 500);
  });
  
  App.three.onRenderFcts.push(function() {
    for(var j = 0; j < rayDirections.length; j++) {
      var playerPos = new THREE.Vector3(player.position.x, player.position.y, player.position.z);
      var ray = new THREE.Ray(playerPos, rayDirections[j]);
      for (var i = 0; i < App.players.length; i++) {
        if (App.players[i] !== player) {
          var otherPlayer = new THREE.Vector3(App.players[i].position.x, App.players[i].position.y, App.players[i].position.z);
          var coll = ray.distanceToPoint(otherPlayer);
          if (coll.toFixed(0) == 0) {
            console.log('-------MANELE-------');
          }
        }
      }
    } 
  });

  return player;
};