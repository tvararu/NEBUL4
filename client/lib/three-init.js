// three-init.js - THREE.js initial setup.

window.App = window.App || {};

App.THREEinit = function() {
  var three = {};
  
  // Initialize rendering engine.
  // WebGLRenderer()  - the fastest and prettiest, but doesn't work on
  // most phones and older browsers.
  // CanvasRenderer() - much wider support, but much slower.
  // SVGRenderer()    - generally terrible in my own experience.
  var renderer = three.renderer = null;
  if ( !! window.WebGLRenderingContext) {
    // TODO: this ends up being a false positive on my Galaxy Nexus.
    // Needs a better conditional.
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
  var scene = three.scene = new THREE.Scene();
  
  // Create a new PerspectiveCamera:
  // http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
  var camera = three.camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.01, 1000
  );
  camera.position.x = 0;
  camera.position.y = 2.5;
  camera.position.z = -3.5;
  
  camera.rotation.x = 0.4;
  camera.rotation.y = 3.15;
  camera.rotation.z = 0.0;
  
  // set up the sphere vars
  var radius = 0.01, segments = 1, rings = 1;
  
  // create the sphere's material
  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  
  for (var i = -15; i < 15; i++) {
    for (var j = -15; j < 15; j++) {
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(
          radius,
          segments,
          rings),
        sphereMaterial);
  
      sphere.position.x = i;
      sphere.position.z = j;
  
      // add the sphere to the scene
      scene.add(sphere);
    }
  }
  
  // create a point light
  var pointLight = new THREE.PointLight(0xFFFFFF);
  
  // set its position
  pointLight.position.x = 0;
  pointLight.position.y = 50;
  pointLight.position.z = 0;
  
  // add to the scene
  scene.add(pointLight);
  
  // Automagically resize the renderer and update the camera on window resize:
  // http://learningthreejs.com/blog/2011/08/30/window-resize-for-your-demos/
  THREEx.WindowResize(renderer, camera);
  
  // A vector of functions to execute each time the render loop is executed.
  var onRenderFcts = three.onRenderFcts = [];
  
  // Camera Controls.
  var mouse = {
    x: 0,
    y: 0
  };
  
  document.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) - 0.5;
    mouse.y = (event.clientY / window.innerHeight) - 0.5;
  }, false);
  
  onRenderFcts.push(function(delta) {
    camera.position.x += (mouse.x * 5 - camera.position.x) * (delta * 3);
    camera.position.y += (mouse.y * 5 - camera.position.y) * (delta * 3);
    if (App.three.spaceship) {
      camera.lookAt(App.three.spaceship.position);
    }
  });
  
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
  
  return three;
};