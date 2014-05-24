window.App = window.App || {};

App.planetsInit = function () {
  var planetTexture   = THREE.ImageUtils.loadTexture( "textures/planets/earth_atmos_2048.jpg" );
  var cloudsTexture   = THREE.ImageUtils.loadTexture( "textures/planets/earth_clouds_1024.png" );
  var normalTexture   = THREE.ImageUtils.loadTexture( "textures/planets/earth_normal_2048.jpg" );
  var specularTexture = THREE.ImageUtils.loadTexture( "textures/planets/earth_specular_2048.jpg" );

  //var moonTexture = THREE.ImageUtils.loadTexture( "textures/planets/moon_1024.jpg" );

  var radius = 10;
  var tilt = 0.41;
  var rotationSpeed = 0.02;

  var cloudsScale = 1.005;
  var planetX = 30;
  var planetY = 30;
  var planetZ = 30;
  var shader = THREE.ShaderLib[ "normalmap" ];
  var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  uniforms[ "tNormal" ].value = normalTexture;
  uniforms[ "uNormalScale" ].value.set( 0.85, 0.85 );

  uniforms[ "tDiffuse" ].value = planetTexture;
  uniforms[ "tSpecular" ].value = specularTexture;

  uniforms[ "enableAO" ].value = false;
  uniforms[ "enableDiffuse" ].value = true;
  uniforms[ "enableSpecular" ].value = true;

  // uniforms[ "diffuse" ].value.setHex( 0xffffff );
  // uniforms[ "specular" ].value.setHex( 0x333333 );
  // uniforms[ "ambient" ].value.setHex( 0x000000 );

  //uniforms[ "shininess" ].value = 15;

  var parameters = {

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: uniforms,
    lights: true,
    fog: true

  };

  var materialNormalMap = new THREE.ShaderMaterial( parameters );

  // planet

  geometry = new THREE.SphereGeometry( radius, 100, 50 );
  geometry.computeTangents();

  meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
  // meshPlanet.position.x = planetX;
  // meshPlanet.position.y = planetY;
  // meshPlanet.position.z = planetZ;
  meshPlanet.rotation.y = 0;
  meshPlanet.rotation.z = tilt;
  console.log(meshPlanet);

  // clouds

  var materialClouds = new THREE.MeshLambertMaterial( { color: 0xffffff, map: cloudsTexture, transparent: true } );

  meshClouds = new THREE.Mesh( geometry, materialClouds );
  meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
  // meshClouds.position.x = planetX;
  // meshClouds.position.y = planetY;
  // meshClouds.position.z = planetZ;
  meshClouds.rotation.z = tilt;

  var planet = new THREE.Object3D();
  planet.add(meshPlanet);
  planet.add(meshClouds);
  planet.position.x = planetX;
  planet.position.y = planetY;
  planet.position.z = planetZ;
  App.three.scene.add( planet );




};

App.starsInit = function () {
  var radius = 0.6;
  var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

  for ( i = 0; i < 250; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );

    starsGeometry[ 0 ].vertices.push( vertex );
  }

  for ( i = 0; i < 1500; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );

    starsGeometry[ 1 ].vertices.push( vertex );
  }
  
  var stars;
  var starsMaterials = [
    new THREE.ParticleBasicMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
    new THREE.ParticleBasicMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
    new THREE.ParticleBasicMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
    new THREE.ParticleBasicMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
    new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
    new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
  ];

  for ( i = 10; i < 30; i ++ ) {
    stars = new THREE.ParticleSystem( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

    stars.rotation.x = Math.random() * 6;
    stars.rotation.y = Math.random() * 6;
    stars.rotation.z = Math.random() * 6;

    s = i * 10;
    stars.scale.set( s, s, s );

    stars.matrixAutoUpdate = false;
    stars.updateMatrix();

    App.three.scene.add( stars );
  }
};


App.enviromentInit = function() {
  App.planetsInit();
  App.starsInit();
}