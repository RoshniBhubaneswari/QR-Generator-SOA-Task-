// Register new adapters here — nothing else in the service changes.
module.exports = {
  upi: require('./upi'),
  signedOrder: require('./signedOrder'),
  url: require('./url'),
};
