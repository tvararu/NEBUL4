window.App = window.App || {};

var Player = THREE.Object3D;

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

  App.three.scene.add(new THREE.AxisHelper(100));

  var getRandomShip = function(){
    var random = Math.floor(Math.random()*4 +1);
    return random;
  };

  Meteor.users.find().observe({
    added: function(p) {
      // console.log(p._id);


      p.profile.shipType = p.profile.shipType || (getRandomShip());
      var shipFunc = null;
      switch(p.profile.shipType){
        case 1: shipFunc = THREEx.SpaceShips.loadSpaceFighter01; break;
        case 2: shipFunc = THREEx.SpaceShips.loadSpaceFighter02; break;
        case 3: shipFunc = THREEx.SpaceShips.loadSpaceFighter03; break;
        case 4: shipFunc = THREEx.SpaceShips.loadSpaceFighter04; break;
        case 5: shipFunc = THREEx.SpaceShips.loadSpaceFighter05; break;
      }
      if (p._id === Meteor.user()._id) {
        player.name = p._id;
        player.shipType = p.profile.shipType;
        player.position = p.profile.position || { x: 0, y: 0, z: 0 };
    
        App.triggerEvent('playerAdded', p);
    
        shipFunc(function(object3d) {
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
      } else {
        var otherPlayer = new Player();
        otherPlayer.name = p._id;
        otherPlayer.position = p.profile.position || { x: 0, y: 0, z: 0 };
      
        App.triggerEvent('playerAdded', otherPlayer);
    
        shipFunc(function(object3d) {
          var ship = object3d;
        
          otherPlayer.ship = ship;
          otherPlayer.add(ship);
          
          App.three.scene.add(otherPlayer);
        });
      }
    },
    removed: function(p) {
      var somePlayer = App.three.scene.getObjectByName(p._id);
      App.three.scene.remove(somePlayer);
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
      var p = _.pick(player, 'name', 'position','shipType');
      // console.log(p);
      Meteor.users.update(p.name, {
        $set: {
          profile: {
            position: p.position,
            shipType: p.shipType
          }
        }
      });
    }, 500);
  });
  
  return player;
};