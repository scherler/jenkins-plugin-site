const createPluginDb = require('./server/createPluginsDb');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.build');

const db = './generated/plugin-site';

createPluginDb(db, (err) => {
  if (err) {
    console.error(err);
  }
});
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      console.error(err);
    }
    console.log("stoped", stats.toString())
  });
