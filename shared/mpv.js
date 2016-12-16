const mpv = require('node-mpv');
const config = require('../config');

var _player = new mpv(config.mpv.options, config.mpv.commands);

function ext(method, obj = _player) {
  return obj[method].bind(obj);
}

module.exports = {
  "loadFile": ext("loadFile"),
  "play": ext("play"),
  "pause": ext("pause"),
  "stop": ext("stop"),
  "resume": ext("resume"),
  "volume": ext("volume"),
  "loop": ext("loop"),
  "jump": ext("goToPosition"),
  "on": ext("on"),
  "once": ext("once"),
  "removeListener": ext("removeListener")
};
