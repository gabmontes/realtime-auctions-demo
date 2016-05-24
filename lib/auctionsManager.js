'use strict';

const auctionsStore = require('./auctionsStore');

function getCurrentAuction (req, res, next) {
  console.log('Responding with current auction data');
  auctionsStore.getCurrent(function (err, data) {
    if (err) {
      console.log('Could not get current auction data');
      next(err);
      return;
    }
    res.json(data);
  });
}

function getCurrentAuctionState(callback) {
  console.log('Sending current auction state');
  auctionsStore.getCurrentState(callback);
}

function bidOnCurrentAuction(io) {
  return function (data) {
    console.log('Received new bid for auction %j', data.id);
    auctionsStore.processBid(data.id, data.bidId, function (err, accepted) {
      if (err) {
        console.log('Could not process bid');
        return;
      }
      if (!accepted) {
        console.log('Bid rejected');
        return;
      }
      console.log('Bid accepted!');
      getCurrentAuctionState(function (err, data) {
        if (err) {
          console.log('Could not get auction state');
          return;
        }
        io.emit('update', data);
      });
    });
  }
}

function attach(app, io) {
  app.get('/api/auctions/current', getCurrentAuction);

  io.on('connection', function (socket) {
    console.log('New bidder connected');
    getCurrentAuctionState(function (err, data) {
      if (err) {
        console.log('Could not get auction state');
        return;
      }
      socket.emit('update', data);
    });

    socket.on('bid', bidOnCurrentAuction(io));
  });
}

module.exports = {
  attach
}
