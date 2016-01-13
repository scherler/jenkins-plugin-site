/* eslint-disable no-console, no-var, strict *///This is because of node being babel6 ready yet
var
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(5000, '0.0.0.0', function (err) {
    if (err) {
      console.error(err);
    }
    console.log('Listening at localhost:5000');
  });
