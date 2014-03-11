if (Posts.find().count() === 0) {
  Posts.insert({ 'position': { 'x': 0, 'y': 0, 'z': 0 } });
}