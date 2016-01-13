import { logger } from '../utils';
const Router = {
  navigate: function (name, params, opts, cb) {
    logger.log('not implemented yet ', name, params, opts, cb);
  },
  parseQS: function (data) {
    if (!data) {return {}; }
    if (data.indexOf('?') === 0) {
      data = data.substring(1, data.length);
    }

    let ret = {};

    data.split('&').forEach(function (pair) {
      let kv = pair.split('='),
          val = kv[1] ? decodeURIComponent(kv[1]) : null;
      if (kv.length > 1) {
        ret[kv[0]] = val;
      }
    });

    return ret;
  }
};
module.export = Router;
