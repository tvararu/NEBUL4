if (Players.find().count() === 0) {
  Players.insert({ 'position': { 'x': 0, 'y': 0, 'z': 0 } });
}
