const debug = require('debug')('wind-ctrl:mpm');

module.exports = (mpv, options) => {
  var tpEventListener = (seconds) => {
    debug(seconds);
    if (options.repeat) {
      if (seconds < options.repeat[0] || seconds > options.repeat[1]) {
        mpv.jump(options.repeat[0]);
      }
    }
  };

  mpv.on("timeposition", tpEventListener);

  mpv.once("started", () => {
    if (options.repeat) {
      mpv.jump(options.repeat[0]);
    }
    mpv.play();
  });

  return {
    "release": () => {
      if (options.repeat) {
        mpv.removeListener("timeposition", tpEventListener);
      }
    }
  };
};
