const debug = require('debug')('wind-ctrl:mpv');
const debug_stdout = require('./io').debug('wind-ctrl:mpv:stdout');
const debug_stderr = require('./io').debug('wind-ctrl:mpv:stderr');
const mpv = require('node-mpv');
const config = require('../config');

var _player = new mpv(config.mpv.options, config.mpv.commands);
var __repeat = null;

function ext(method, obj = _player) {
  return obj[method].bind(obj);
}

module.exports = {
  "play": ext("play"),
  "pause": ext("pause"),
  "stop": ext("stop"),
  "resume": ext("resume"),
  "volume": ext("volume"),
  "loop": ext("loop"),
  "jump": ext("goToPosition")
};

module.exports.loadFile = (path, range = null) => {
  _player.loadFile(path);

  __repeat = range;
  _player.once("started", () => {
    if (__repeat) {
      _player.goToPosition(__repeat[0]);
    }
    _player.play();
  });
};

const update_std = () => {
  const __mpv = _player.mpvPlayer;
  debug_stdout("--------------------------------");
  debug_stdout("mpv instance is restarted");
  debug_stderr("--------------------------------");
  debug_stderr("mpv instance is restarted");
  __mpv.stdout.on('data', data => debug_stdout(data.toString('utf-8').trim()));
  __mpv.stderr.on('data', data => debug_stderr(data.toString('utf-8').trim()));
  __mpv.on('close', update_std);
};

_player.on('statuschange', (status) => {
  debug(status);
});

_player.on("timeposition", (seconds) => {
  debug(seconds);
  if (__repeat) {
    if (seconds < __repeat[0] || seconds > __repeat[1]) {
      _player.goToPosition(__repeat[0]);
    }
  }
});

update_std();
