Package.describe({
  summary: "three.js packaged for use in Meteor. Custom build."
});

Package.on_use(function(api) {
  api.add_files('lib/three.min.js', 'client');
  api.add_files('lib/MTLLoader.js', 'client');
  api.add_files('lib/OBJLoader.js', 'client');
  api.add_files('lib/OBJMTLLoader.js', 'client');
  
  api.add_files('lib/threex.spaceships.js', 'client');
});
