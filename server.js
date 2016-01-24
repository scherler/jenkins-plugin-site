/* eslint-disable no-console, no-var, strict *///This is because of node being babel6 ready yet
  var http = require('http');
  var path = require('path');
  var fs = require('fs');
  var port = 1337;
  http.createServer(function(req, res) {
      var usersFilePath = path.join(__dirname, 'server/update-center.json');
      res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin":"*" });
      var readable = fs.createReadStream(usersFilePath);
      readable.pipe(res);
  }).listen(port, '0.0.0.0', function (err) {
    if (err) {
      console.error(err);
    }
    console.log('Listening at port:', port);
  });

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
