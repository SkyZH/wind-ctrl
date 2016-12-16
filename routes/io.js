module.exports = function(io) {
  io.on('connection', function(client){
    console.log(client);
  });
};
