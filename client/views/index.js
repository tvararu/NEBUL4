UI.body.rendered = function() {
  // $('body').waitForImages(function() {
  //   $('.title-block').addClass('animate');
  // });
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#game').append(renderer.domElement);

  var onRenderFcts = [];
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.01, 1000
  );
  camera.position.z = 2;
  
  THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
    window.spaceship = object3d;
    scene.add(spaceship);
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
      window.spaceship.position.x += 0.1;
    }
    if (e.keyCode === 39) { // right
      window.spaceship.position.x -= 0.1;
    }
    if (e.keyCode === 38) { // up
      window.spaceship.position.z += 0.1;
    }
    if (e.keyCode === 40) { // down
      window.spaceship.position.z -= 0.1;
    }
  });
};
