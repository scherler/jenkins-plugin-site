
let env = require('./env');

let localforage = {
  getItem: function (key, cb) { if (cb) {cb('not in browser'); } },
  setItem: function (key, data, cb) { if (cb) {cb('not in browser'); } },
  removeItem: function (key, cb) { if (cb) {cb('not in browser'); } },
  clear: function () { },
  length: function (cb) { if (cb) {cb(0); } }
};

if (env.isBrowser) {
  require('script!localforage/dist/localforage.nopromises.js');

  localforage = window.localforage;

  localforage.config({
    name: 'jenkinsPlugins',
    version: 1.0,
    storeName: 'readstores'
  });
}

module.exports = localforage;
