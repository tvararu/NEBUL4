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
  
  // Make some spheres for testing purposes.
  // Set up the sphere vars.
  var radius = 0.01, segments = 1, rings = 1;
  
  // Create the sphere's material.
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
  
      // Add the sphere to the scene.
      scene.add(sphere);
    }
  }
  
  // Create a point light.
  var pointLight = new THREE.PointLight(0xFFFFFF);
  
  // Set its position.
  pointLight.position.x = 0;
  pointLight.position.y = 50;
  pointLight.position.z = 0;
  
  // Add it to the scene.
  scene.add(pointLight);
  
  // Automagically resize the renderer and update the camera on window resize:
  // http://learningthreejs.com/blog/2011/08/30/window-resize-for-your-demos/
  THREEx.WindowResize(renderer, camera);
  
  // A vector of functions to execute each time the render loop is executed.
  var onRenderFcts = three.onRenderFcts = [];
  
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