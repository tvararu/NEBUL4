Package.describe({
  summary: "three.js packaged for use in Meteor. Custom build."
});

Package.on_use(function(api) {
  // Base three.js library.
  api.add_files('lib/three.min.js', 'client');
  
  // Various loaders for various file formats.
  api.add_files('lib/MTLLoader.js', 'client');
  api.add_files('lib/OBJLoader.js', 'client');
  api.add_files('lib/OBJMTLLoader.js', 'client');
  
  // THREEx plugins.
  api.add_files('lib/threex.spaceships.js', 'client');
  api.add_files('lib/threex.windowresize.js', 'client');
});
