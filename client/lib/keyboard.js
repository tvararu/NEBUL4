// keyboard.js - Keyboard management objects and functions.

window.App = window.App || {};

// The App.key object is a map that converts human-readable strings to their
// respective keycodes.
// i.e., App.key['up'] and App.key.up are both 38.
App.key = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause': 19,
  'capslock': 20,
  'esc': 27,
  'pageup': 33,
  'pagedown': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'a': 65,
  'b': 66,
  'c': 67,
  'd': 68,
  'e': 69,
  'f': 70,
  'g': 71,
  'h': 72,
  'i': 73,
  'j': 74,
  'k': 75,
  'l': 76,
  'm': 77,
  'n': 78,
  'o': 79,
  'p': 80,
  'q': 81,
  'r': 82,
  's': 83,
  't': 84,
  'u': 85,
  'v': 86,
  'w': 87,
  'x': 88,
  'y': 89,
  'z': 90,
  'numpad0': 96,
  'numpad1': 97,
  'numpad2': 98,
  'numpad3': 99,
  'numpad4': 100,
  'numpad5': 101,
  'numpad6': 102,
  'numpad7': 103,
  'numpad8': 104,
  'numpad9': 105,
  'multiply': 106,
  'plus': 107,
  'minut': 109,
  'dot': 110,
  'slash1': 111,
  'f1': 112,
  'f2': 113,
  'f3': 114,
  'f4': 115,
  'f5': 116,
  'f6': 117,
  'f7': 118,
  'f8': 119,
  'f9': 120,
  'f10': 121,
  'f11': 122,
  'f12': 123,
  'equal': 187,
  'comma': 188,
  'slash': 191,
  'backslash': 220
};

// App.keyCode is the reverse map of App.key.
App.keyCode = {};

// App.keyState tracks which keys are currently held down.
App.keyState = {};

for (var key in App.key) {
  if (App.key.hasOwnProperty(key)) {
    // Define the reverse map. So you can do App.keyCode[38] to get 'up'.
    App.keyCode[App.key[key]] = key;
    
    // Initialize every key as not being pressed initially.
    App.keyState[key] = false;
  }
}

// App.pushKey is a function that takes a human readable keyname (like 'up') and
// programatically simulates a keypress on the game container element.
// Takes optional duration and callback.
App.pushKey = function(keyname, duration, callback) {
  duration = duration || 100;
  
  var e = $.Event('keydown');
  e.which = e.keyCode = App.key[keyname];
  $(document).trigger(e);
  
  setTimeout(function() {
    var e = $.Event('keyup');
    e.which = e.keyCode = App.key[keyname];
    $(document).trigger(e);
    
    if (callback) { callback(); }
  }, duration);
};

// App.pushKeys decomposes a string into pushKey calls.
// i.e. App.pushKeys('up down left right');
// Takes optional duration (for all keys) and callback.
App.pushKeys = function(keys, duration, callback) {
  duration = duration || 100;
  
  if (typeof(keys) === 'string') {
    // Split by non-words.
    keys = keys.split(/\W/);
    
    // Eliminate empty strings and invalid keys.
    keys = _.filter(keys, function(str) {
      return str.length && App.key.hasOwnProperty(key);
    });
    
    var pushEachKey = function(i, len) {
      if (i < len) {
        App.pushKey(keys[i], duration, function() {
          pushEachKey(i + 1, len);
        });
      } else {
        return;
      }
    };
    
    pushEachKey(0, keys.length);
  } else {
    console.error(
      'App.pushKey only works with string arguments. Got this instead:',
      keys
    );
  }
  
  if (callback) { callback(); }
};

// App.keyInit initializes keydown and keyup listeners to update the
// global keyState object.
App.keyInit = function() {
  App.container.on('keydown', function(e) {
    var key = App.keyCode[e.keyCode];
    
    // Mark the key as being held down.
    App.keyState[key] = true;
  });

  App.container.on('keyup', function(e) {
    var key = App.keyCode[e.keyCode];
    
    // Mark the key as up.
    App.keyState[key] = false;
  });
};
