
let Reflux = require('reflux');

let actions = {

  server: Reflux.createActions([
    'offline',
    'online'
  ])

};

module.exports = actions;
