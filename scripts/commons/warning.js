import env from './utils/env';

module.exports = {
  deprecated: function (text) {
    if (env.isBrowser && env.debug && window.console && window.console.warn) {
      window.console.warn('WARNING DEPRECATED: (commons) ' + text);
    }
  },

  warn: function (text) {
    if (env.isBrowser && env.debug && window.console && window.console.warn) {
      window.console.warn('WARNING: (commons) ' + text);
    }
  }
};
