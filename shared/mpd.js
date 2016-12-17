const debug = require('../shared/io').debug('wind-ctrl:mpd');
const debug_stdout = require('../shared/io').debug('wind-ctrl:mpd:stdout');
const debug_stderr = require('../shared/io').debug('wind-ctrl:mpd:stderr');

module.exports = (mpv) => {
  const fire_data = data => debug_stdout(data.toString('utf-8').trim());
  const init = () => {
    mpv.mpv().stdout.on('data', fire_data);
    mpv.mpv().stderr.on('data', fire_data);
    mpv.mpv().on('close', init);
  };
  init();
  mpv.on('statuschange', (status) => {
    debug(status);
  });
  mpv.on("timeposition", (seconds) => {
    debug(seconds);
  });
};
