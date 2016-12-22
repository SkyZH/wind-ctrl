const debug = require('debug');
const _ = require('lodash');

const MAX_MESSAGE_COUNT = 1000;
var io = require('socket.io')();
var clients = [];
var logs = [];

module.exports.debug = __io_debug = (name) => {
  const m_debug = debug(name);
  return (message) => {
    m_debug(message);
    const __log = make_log(name, message);
    logs.push(__log);
    logs = _.takeRight(logs, MAX_MESSAGE_COUNT);
    if (io) io.emit('log', __log);
  };
};

const io_debug = __io_debug('wind-ctrl:io');

const make_log = (name, message) => {
  return {
    name: name,
    message: message,
    time: Date.now()
  };
};

io.on('connection', (client) => {
  clients.push(client);
  _(logs).forEach((log) => {
    client.emit('log', log);
  });
  io_debug('new connection from client ' + client.id);
  client.on('disconnect', () => {
    io_debug('disconnected from client ' + client.id);
  });
});

module.exports.init = (server) => {
  io.attach(server);
};
