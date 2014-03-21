UI.body.rendered = function() {
  // The global application namespace.
  window.App = window.App || {};

  App.container = $(document);

  App.triggerEvent = function(name, object) {
    App.container.trigger(name, object);
  };

  App.pushKey = function(keycode) {
    var e = $.Event('keydown');
    e.which = e.keyCode = App.key[keycode];
    App.container.trigger(e);
  };

  // Another namespace to hold all the graphics stuff.
  var three = App.three = App.three || {};

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

  // // Set the renderer size to the entire available width and height.
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
  var radius = 0.01,
    segments = 16,
    rings = 16;

  // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial({
      color: 0xFFFFFF
    });

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
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

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

  Ships.find().observe({
    added: function(ship) {
      THREEx.SpaceShips.loadSpaceFighter03(function(object3d) {
        var spaceship = App.three.spaceship = object3d;

        spaceship._id = ship._id;
        spaceship.position = ship.position;
        scene.add(App.three.spaceship);

        App.triggerEvent('shipLoaded', ship);

        setInterval(function() {
          var spaceship = _.pick(App.three.spaceship, '_id', 'position');
          Ships.update(spaceship._id, spaceship);
        }, 1000);
      });

      App.triggerEvent('shipAdded', ship);
    }
  });

  updateShip = function(ship) {
    App.three.spaceship.position = ship.position;
    shipStream.emit('updateShip', ship);

    App.triggerEvent('shipChanged', ship);
  };

  shipStream.on('updateShip', function(ship) {
    App.three.spaceship.position = ship.position;

    App.triggerEvent('shipChanged', ship);
  });

  App.container.keydown(function(e) {
    var spaceship = _.pick(App.three.spaceship, '_id', 'position');
    var camera = App.three.camera;

    switch (e.keyCode) {
      case App.key.left:
      case App.key.a:
        spaceship.position.x += 0.1;
        camera.position.x += 0.1;
        break;
      case App.key.right:
      case App.key.d:
        spaceship.position.x -= 0.1;
        camera.position.x -= 0.1;
        break;
      case App.key.up:
      case App.key.w:
        spaceship.position.z += 0.1;
        camera.position.z += 0.1;
        break;
      case App.key.down:
      case App.key.s:
        spaceship.position.z -= 0.1;
        camera.position.z -= 0.1;
        break;
    }

    updateShip(spaceship);
  });
};
