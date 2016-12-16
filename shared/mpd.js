const debug = require('../shared/io').debug('wind-ctrl:mpd');

module.exports = (mpv) => {
  mpv.mpv.stdout.on('data', (data) => {
    debug(data.toString('utf-8'));
  });
  mpv.mpv.stderr.on('data', (data) => {
    debug(data.toString('utf-8'));
  });
  mpv.on('statuschange', (status) => {
    debug(status);
  });
  mpv.on("timeposition", (seconds) => {
    debug(seconds);
  });
};
