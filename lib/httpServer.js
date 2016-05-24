'use strict';

const express = require("express");

const app = express();

app.use(express.static("public"));

function bind(port) {
  return app.listen(port, function () {
    console.log("HTTP server listening on port %s", port);
  });
}

function start(port) {
  return {
    http: bind(port),
    express: app
  }
}

module.exports = {
  start
}
