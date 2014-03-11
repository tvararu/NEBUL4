UI.body.rendered = function() {
  // The global application namespace.
  var App = window.App || {};
  App.three = App.three || {};
  
  // Initialize rendering engine.
  // WebGLRenderer()  - the fastest and prettiest, but doesn't work on
  // most phones and older browsers.
  // CanvasRenderer() - much wider support, but much slower.
  // SVGRenderer()    - generally terrible in my own experience.
  var renderer = App.three.renderer = null;
  if (!!window.WebGLRenderingContext) {
    // TODO: this ends up being a false positive on my Galaxy Nexus.
    // Need a better conditional.
    renderer = new THREE.WebGLRenderer();
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  
  // Set the renderer size to the entire available width and height.
  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
  $('#game').append(renderer.domElement);
  
  // Create a new scene.
  var scene = App.three.scene = new THREE.Scene();
  
  // Create a new PerspectiveCamera:
  // http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
  var camera = App.three.camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.01, 1000
  );
  // Align the camera to view our spaceship from roughly isometric perspective.
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 2;
  
  camera.rotation.x = -1.0;
  camera.rotation.y = 0.7;
  camera.rotation.z = 0.5;
  
  // Automagically resize the renderer and update the camera on window resize:
  // http://learningthreejs.com/blog/2011/08/30/window-resize-for-your-demos/
  THREEx.WindowResize(renderer, camera);
  
  // A vector of functions to execute each time the render loop is executed.
  var onRenderFcts = App.three.onRenderFcts = [];
  
  // The main render function.
  onRenderFcts.push(function() {
    renderer.render(scene, camera);
  });
  
  // The render loop.
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
  
  // // Camera Controls.
  // var mouse = {
  //   x: 0,
  //   y: 0
  // };
  // 
  // document.addEventListener('mousemove', function(event) {
  //   mouse.x = (event.clientX / window.innerWidth) - 0.5;
  //   mouse.y = (event.clientY / window.innerHeight) - 0.5;
  // }, false);
  // 
  // onRenderFcts.push(function(delta, now) {
  //   camera.position.x += (mouse.x * 5 - camera.position.x) * (delta * 3);
  //   camera.position.y += (mouse.y * 5 - camera.position.y) * (delta * 3);
  //   camera.lookAt(scene.position);
  // });
  
  Ships.find().observe({
    added: function(ship) {
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        App.three.spaceship = object3d;
        
        App.three.spaceship._id = ship._id;
        App.three.spaceship.position = ship.position;
        scene.add(App.three.spaceship);
      });
    },
    changed: function(ship) {
      App.three.spaceship.position = ship.position;
    }
  });
  
  $(document).keydown(function(e) {
    var spaceship = _.pick(App.three.spaceship, '_id', 'position');
    
    switch(e.keyCode) {
    case 37: // left
      spaceship.position.x += 0.1;
      break;
    case 39: // right
      spaceship.position.x -= 0.1;
      break;
    case 38: // up
      spaceship.position.z += 0.1;
      break;
    case 40: // down
      spaceship.position.z -= 0.1;
      break;
    }
    
    Ships.update(spaceship._id, spaceship);
  });
};
