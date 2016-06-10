let env = {};
if(window) {
  env = require('targetenv');
  if (env.isBrowser) {
    env.browser = {};//FIXME implement browser detection
  }
  if (env.isBrowser && window.appSettings) {
    const settings = JSON.parse(window.appSettings);
    env.NODE_ENV = (settings.NODE_ENV) ? settings.NODE_ENV : process.env.NODE_ENV;
  } else {
    env.NODE_ENV = process.env.NODE_ENV;
  }
}

env.debug = process.env.debug ? true : false;
// revision info is gathered during webpack build and set to "process.env" (display this in development footer)
env.revisionInfo = process.env.buildRevisionInfo;

export default env;
