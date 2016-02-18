const env = require('targetenv');

env.debug = process.env.debug ? true : false;
if (env.isBrowser) {
  env.browser = {};//FIXME implement browser detection
}
if (env.isBrowser && window.appSettings) {
  const settings = JSON.parse(window.appSettings);
  env.NODE_ENV = (settings.NODE_ENV) ? settings.NODE_ENV : process.env.NODE_ENV;
} else {
  env.NODE_ENV = process.env.NODE_ENV;
}

module.exports = env;
