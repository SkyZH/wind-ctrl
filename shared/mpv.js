const _ = require('lodash');
const io = require('./io');
const os = require('os');

const debug = require('debug')('wind-ctrl:mpv');
const debug_stdout = require('./io').debug('wind-ctrl:mpv:stdout');
const debug_stderr = require('./io').debug('wind-ctrl:mpv:stderr');
const mpv = require('node-mpv');
const config = require('../config');

let _player = new mpv(config.mpv.options, config.mpv.commands);
let __repeat = null;

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

module.exports.loadFile = (resource) => {
  __data.resource = resource;
  update_status();

  _player.loadFile(resource.path);

  __repeat = resource.repeat;
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

let __status = {
  duration: 1,
  pause: true
};
let __data = {
  position: 0,
  resource: {},
  start_time: Date.now(),
  device: config.device,
  free_mem: 0,
  total_mem: 1,
  cpus: [],
  cpu_avg: 0
};

const update_status = () => {
  io.update_status(_.merge(__status, __data));
};

_player.on('statuschange', (status) => {
  __status = status;
  update_status();
});

_player.on("timeposition", (seconds) => {
  __data.position = seconds;
  update_status();
  if (__repeat) {
    if (seconds < __repeat[0] || seconds > __repeat[1]) {
      _player.goToPosition(__repeat[0]);
    }
  }
});


let __lst_cpu = null;

const update_os = () => {
  __data.free_mem = os.freemem();
  __data.total_mem = os.totalmem();
  if (__lst_cpu) {
    let __cpu = os.cpus();
    let __avg = [];
    for (let i = 0; i < __cpu.length; i++) {
      let totalTick = 0;
      let cpu = __cpu[i], lst_cpu = __lst_cpu[i];
      for (let type in cpu.times) {
        totalTick += cpu.times[type] - lst_cpu.times[type];
      }
      __avg.push(1.0 - (cpu.times.idle - lst_cpu.times.idle) / totalTick);
    }
    __data.cpus = __avg;
    __data.cpu_avg = _.sum(__avg) / __avg.length;
    update_status();
  }
  __lst_cpu = os.cpus();
};

update_std();
update_status();

setInterval(update_os, 500);
