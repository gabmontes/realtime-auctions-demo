'use strict';

const httpServer = require('./lib/httpServer');
const ioServer = require('./lib/ioServer');
const auctionsManager = require('./lib/auctionsManager');

const HTTP_SERVER_PORT = 4000;

const server = httpServer.start(HTTP_SERVER_PORT);
const io = ioServer.attach(server.http);

auctionsManager.attach(server.express, io);
