let capitalize = require('./capitalize');

module.exports = function callbackName(string) {
  return 'on' + capitalize(string);
};

