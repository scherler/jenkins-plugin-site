/* eslint-disable no-console, no-var, strict */ //This is because of node being babel6 ready byet
var express = require('express');
var portServer = 3000;
var portClient = 5000;

const content = `<ul>
    <li><a href="update-center.json">update-center.json</a></li>
    <li><a href="featured-service.json">featured-service.json</a></li>
  </ul>`;

var app = express();
app.use(express.static('server'));
// home page
app.get('/', function(req, res) {
  res.send(content);
});
app.listen(portServer, function () {
  console.log('Listening at port:', portServer);
});

var
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(portClient, '0.0.0.0', function(err) {
  if (err) {
    console.error(err);
  }
  console.log('Listening at port:', portClient);
});
