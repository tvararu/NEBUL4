window.App = window.App || {};

var Player = THREE.Object3D;

// Array which contains vectors for each corner of a cube
var rayDirections = [
  new THREE.Vector3(0.5, 0.5, 0.5),
  new THREE.Vector3(-0.5, 0.5, 0.5),
  new THREE.Vector3(0.5, 0.5, -0.5),
  new THREE.Vector3(-0.5, 0.5, -0.5),
  new THREE.Vector3(0.5, -0.5, 0.5),
  new THREE.Vector3(-0.5, -0.5, 0.5),
  new THREE.Vector3(0.5, -0.5, -0.5),
  new THREE.Vector3(-0.5, -0.5, -0.5)
];

var computeDirection = function(object, dir) {
  var matrix = new THREE.Matrix4();
  matrix.extractRotation(object.matrix);
  dir = dir.applyProjection(matrix);
  return dir;
};

Player.prototype.MAXSPEED = 0.1;
Player.prototype.BLINDSPOT = 0.02;
Player.prototype.ACCEL = 0.004;
Player.prototype.CANSHOOT = true;

Player.prototype.acceleration = {
  x: 0,
  y: 0,
  z: 0
};

Player.prototype.move = function(direction) {
  var speed = this.ACCEL;

  switch (direction) {
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

Player.prototype.shoot = function() {
  if (this.CANSHOOT) {
    this.CANSHOOT = false;
    Meteor.setTimeout(function() {
      App.player.CANSHOOT = true;
    }, 1000/8);

    var laserBeam = new THREEx.LaserBeam({color: 'magenta', len: 0.5, radius: 0.05});
    laserBeam.object3d.position.x = this.position.x;
    laserBeam.object3d.position.y = this.position.y;
    laserBeam.object3d.position.z = this.position.z;

    var dir = computeDirection(App.player, new THREE.Vector3(0, 0, 1));
    laserBeam.object3d.position.x += dir.x;
    laserBeam.object3d.position.y += dir.y;
    laserBeam.object3d.position.z += dir.z;

    laserBeam.object3d.rotation.x = this.rotation.x;
    laserBeam.object3d.rotation.y = this.rotation.y;
    laserBeam.object3d.rotation.z = this.rotation.z;
    laserBeam.object3d.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);
    App.three.scene.add(laserBeam.object3d);

    var endPosition = new THREE.Vector3(
      laserBeam.object3d.position.x,
      laserBeam.object3d.position.y,
      laserBeam.object3d.position.z
    );
    dir = computeDirection(App.player, new THREE.Vector3(0, 0, 35));
    endPosition.x += dir.x;
    endPosition.y += dir.y;
    endPosition.z += dir.z;

    dir = computeDirection(App.player, new THREE.Vector3(0, 0, 1));
    
    playerStream.emit('addBullet', {
      position: {
        x: laserBeam.object3d.position.x,
        y: laserBeam.object3d.position.y,
        z: laserBeam.object3d.position.z
      },
      rotation: {
        x: laserBeam.object3d.rotation.x,
        y: laserBeam.object3d.rotation.y,
        z: laserBeam.object3d.rotation.z
      },
      dir: {
        x: dir.x,
        y: dir.y,
        z: dir.z
      },
      endPosition: {
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z
      }
    });
    
    App.coli.push(laserBeam.object3d);

    App.three.onRenderFcts.push(function() {
      if (laserBeam.object3d.position.distanceTo(endPosition) > 1) {
        laserBeam.object3d.position.x += dir.x;
        laserBeam.object3d.position.y += dir.y;
        laserBeam.object3d.position.z += dir.z;
      } else {
        App.three.scene.remove(laserBeam.object3d);
      
        // var index = App.coli.indexOf(laserBeam.object3d);
        // App.coli.splice(index, 1);
      }
    });
  }
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

  switch (direction) {
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

window.createText = function(text) {
  var group = new THREE.Object3D();

  var height = 0.01,
    size = 0.1,
    hover = 0,

    curveSegments = 4,

    bevelThickness = 0.5,
    bevelSize = 1.0,
    bevelEnabled = false,

    font = 'droid sans',
    weight = 'normal',
    style = 'normal';

  var material = new THREE.MeshFaceMaterial([
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      shading: THREE.SmoothShading
    }), // front
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      shading: THREE.SmoothShading
    }) // side
  ]);

  var textGeo = new THREE.TextGeometry(text, {

    size: size,
    height: height,
    curveSegments: curveSegments,

    font: font,
    weight: weight,
    style: style,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled,

    material: 0,
    extrudeMaterial: 1

  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  var centerOffset = -0.5 * (
    textGeo.boundingBox.max.x - textGeo.boundingBox.min.x
  );

  textMesh1 = new THREE.Mesh(textGeo, material);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);

  return group;
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
    if (p) {
      p.position = somePlayer.position;
    }
  });

  playerStream.on('updatePlayerRotation', function(somePlayer) {
    var p = App.three.scene.getObjectByName(somePlayer.name);
    if (p) {
      p.rotate(somePlayer.direction, somePlayer.angle);
    }
  });

  playerStream.on('addBullet', function(bullet) {
    var laserBeam = new THREEx.LaserBeam({color: 'magenta', len: 0.5, radius: 0.05});
    laserBeam.object3d.position = new THREE.Vector3(
      bullet.position.x,
      bullet.position.y,
      bullet.position.z
    );
    
    laserBeam.object3d.rotateOnAxis(
      new THREE.Vector3(1, 0, 0),
      bullet.rotation.x
    );
    laserBeam.object3d.rotateOnAxis(
      new THREE.Vector3(0, 1, 0),
      bullet.rotation.y
    );
    laserBeam.object3d.rotateOnAxis(
      new THREE.Vector3(0, 0, 1),
      bullet.rotation.z
    );
    
    bullet.endPosition = new THREE.Vector3(
      bullet.endPosition.x,
      bullet.endPosition.y,
      bullet.endPosition.z
    );
    
    App.three.scene.add(laserBeam.object3d);
    App.coli.push(laserBeam.object3d);
    
    App.three.onRenderFcts.push(function() {
      if (laserBeam.object3d.position.distanceTo(bullet.endPosition) > 1) {
        laserBeam.object3d.position.x += bullet.dir.x;
        laserBeam.object3d.position.y += bullet.dir.y;
        laserBeam.object3d.position.z += bullet.dir.z;
      } else {
        App.three.scene.remove(laserBeam.object3d);        // 
        //       
        // var index = App.coli.indexOf(laserBeam.object3d);
        // App.coli.splice(index, 1);
      }
    });
  });

  App.coli = [];
  App.three.scene.add(new THREE.AxisHelper(100));

  Meteor.users.find().observe({
    added: function(p) {
      var shipFunc = null;
      switch (p.profile.shipType) {
        case 1:
          shipFunc = THREEx.SpaceShips.loadSpaceFighter01;
          break;
        case 2:
          shipFunc = THREEx.SpaceShips.loadSpaceFighter02;
          break;
        case 3:
          shipFunc = THREEx.SpaceShips.loadSpaceFighter03;
          break;
        case 4:
          shipFunc = THREEx.SpaceShips.loadSpaceFighter04;
          break;
        case 5:
          shipFunc = THREEx.SpaceShips.loadSpaceFighter05;
          break;
      }
      
      if (p._id === Meteor.user()._id) {
        player._id = p._id;
        player.name = p.username;
        player.position = p.profile.position;
      
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
        otherPlayer._id = p._id;
        otherPlayer.name = p.username;
        otherPlayer.position = p.profile.position;
              
        App.triggerEvent('playerAdded', otherPlayer);
              
        shipFunc(function(object3d) {
          var ship = object3d;
              
          otherPlayer.ship = ship;
          otherPlayer.add(ship);
              
          App.three.scene.add(otherPlayer);
              
          App.coli.push(otherPlayer);
        });
      }
    },
    removed: function(p) {
      var somePlayer = App.three.scene.getObjectByName(p.username);
      App.three.scene.remove(somePlayer);
      
      var index = App.coli.indexOf(somePlayer);
      App.coli.splice(index, 1);
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

      if (App.keyState('shift')) {
        player.shoot();
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
              'updatePlayerRotation', {
                name: player.name,
                angle: angle,
                direction: 'left'
              }
            );
          } else {
            player.rotate('right', -angle);
            playerStream.emit(
              'updatePlayerRotation', {
                name: player.name,
                angle: -angle,
                direction: 'right'
              }
            );
          }
        }

        var y = Session.get('mouseY');

        angle = (Math.PI / 180) * (Math.abs(y) * 5);

        if (Math.abs(y) > player.BLINDSPOT) {
          if (y < 0) {
            player.rotate('up', -angle);
            playerStream.emit(
              'updatePlayerRotation', {
                name: player.name,
                angle: -angle,
                direction: 'up'
              }
            );
          } else {
            player.rotate('down', angle);
            playerStream.emit(
              'updatePlayerRotation', {
                name: player.name,
                angle: angle,
                direction: 'down'
              }
            );
          }
        }
      }
    }
  });

  App.container.on('playerLoaded', function() {
    Meteor.setInterval(function() {
      var p = _.pick(player, '_id', 'position');
      Meteor.users.update(p._id, {
        $set: {
          'profile.position': p.position
        }
      });
    }, 500);
  });

  App.container.on('playerAdded', function(event, p) {
    var text = createText(p.name);
    text.position.y = 0.3;
    p.add(text);

    App.three.onRenderFcts.push(function() {
      var pos = {
        x: App.player.position.x,
        y: App.player.position.y,
        z: App.player.position.z
      };

      var dir = new THREE.Vector3(
        App.player.camera.position.x,
        App.player.camera.position.y,
        App.player.camera.position.z
      );

      var matrix = new THREE.Matrix4();
      matrix.extractRotation(player.matrix);

      dir = dir.applyProjection(matrix);

      pos.x += dir.x;
      pos.y += dir.y;
      pos.z += dir.z;

      text.lookAt(pos);
    });
  });

  App.three.onRenderFcts.push(function() {
    var playerPos = new THREE.Vector3(
      App.player.position.x,
      App.player.position.y,
      App.player.position.z
    );
    for (var j = 0; j < rayDirections.length; j++) {
      var ray = new THREE.Ray(playerPos, rayDirections[j]);
      for (var i = 0; i < App.coli.length; i++) {
        var otherObject = new THREE.Vector3(
          App.coli[i].position.x,
          App.coli[i].position.y,
          App.coli[i].position.z
        );
        var dist = ray.distanceToPoint(otherObject);
        if (dist.toFixed(1) < 0.3) {
          console.log('-------MANELE-------');
        }
      }
    }
  });

  return player;
};
