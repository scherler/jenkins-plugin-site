
let Reflux = require('reflux'),
    actions = require('./actions');

let store = Reflux.createStore({
    init: function () {
      this.offline = false;

      this.listenToMany(actions.server);
    },

    onOnline: function () {
      if (!this.offline) {
        return;
      }
      this.offline = false;
      this.trigger(this.offline);
    },

    onOffline: function () {
      if (this.offline) {
        return;
      }
      this.offline = true;
      this.trigger(this.offline);
    },

    isOffline: function () {
      return this.offline;
    }
});

module.exports = store;
