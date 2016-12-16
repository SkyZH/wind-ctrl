const debug = require('debug');
module.exports = {
  "debug": (name) => {
    const m_debug = debug(name);
    return (message) => {
      m_debug(message);
    };
  }
};
