'use strict';

function getRandomId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

const currentAuction = {
  id: getRandomId(),
  item: {
    description: 'Meissen Plate with Chinoiserie after Hoeroldt, Germany, c. 1735',
    imageSrc: 'https://d2c2dsgt13elzw.cloudfront.net/resources/300x300-tyc/eb/01/f43b-14a8-4402-95ab-a86018866235.jpg'
  },
  rules: {
    step: 100000
  },
  highest: {},
  next: {
    id: getRandomId(),
    price: 300000
  }
};

function getCurrent(callback) {
  const data = {
    id: currentAuction.id,
    item: currentAuction.item
  };
  callback(null, data);
}

function getCurrentState(callback) {
  const state = {
    highest: currentAuction.highest,
    next: currentAuction.next
  };
  callback(null, state);
}

function increaseBidPrice() {
  currentAuction.highest.price = currentAuction.next.price;
  currentAuction.next.price += currentAuction.rules.step;
  currentAuction.next.id = getRandomId();
}

function processBid(auctionId, bidId, callback) {
  if (currentAuction.id !== auctionId || currentAuction.next.id !== bidId) {
    callback(null, false);
    return;
  }
  increaseBidPrice();
  callback(null, true);
}

module.exports = {
  getCurrent,
  getCurrentState,
  processBid
}
