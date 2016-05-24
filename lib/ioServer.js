'use strict';

const socketio = require("socket.io");

function attach(server) {
  return socketio(server);
}

module.exports = {
  attach
}
