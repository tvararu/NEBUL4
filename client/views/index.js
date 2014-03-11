UI.body.rendered = function() {
  // $('body').waitForImages(function() {
  //   $('.title-block').addClass('animate');
  // });
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#game').append(renderer.domElement);

  var onRenderFcts = [];
  var scene = new THREE.Scene();
  window.camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.01, 1000
  );
  camera.position.z = 2;
  
  Posts.find().observe({
    added: function(ship) {
      window.ship = ship;
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        window.spaceship = object3d;
        spaceship.position.x = ship.position.x;
        spaceship.position.y = ship.position.y;
        spaceship.position.z = ship.position.z;
        scene.add(spaceship);
      });
    },
    changed: function(ship) {
      ship = ship;
      spaceship.position.x = ship.position.x;
      spaceship.position.y = ship.position.y;
      spaceship.position.z = ship.position.z;
    }
  });

  // Camera Controls.
  var mouse = {
    x: 0,
    y: 0
  };
  
  document.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) - 0.5;
    mouse.y = (event.clientY / window.innerHeight) - 0.5;
  }, false);
  
  onRenderFcts.push(function(delta, now) {
    camera.position.x += (mouse.x * 5 - camera.position.x) * (delta * 3);
    camera.position.y += (mouse.y * 5 - camera.position.y) * (delta * 3);
    camera.lookAt(scene.position);
  });
  
  // Render the scene.
  onRenderFcts.push(function() {
    renderer.render(scene, camera);
  });
  
  // Loop runner.
  var lastTimeMsec = null;
  requestAnimationFrame(function animate(nowMsec) {
    // Keep looping.
    requestAnimationFrame(animate);
    // Measure time.
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // Call each update function.
    onRenderFcts.forEach(function(onRenderFct) {
      onRenderFct(deltaMsec / 1000, nowMsec / 1000);
    });
  });
  
  $(document).keydown(function(e) {
    console.log(e.keyCode);
    if (e.keyCode === 37) { // left
      window.ship.position.x += 0.1;
    }
    if (e.keyCode === 39) { // right
      window.ship.position.x -= 0.1;
    }
    if (e.keyCode === 38) { // up
      window.ship.position.z += 0.1;
    }
    if (e.keyCode === 40) { // down
      window.ship.position.z -= 0.1;
    }
    Posts.update(ship._id, window.ship);
  });
};
