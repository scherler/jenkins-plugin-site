/* eslint-disable no-console, no-var, strict */ //This is because of node being babel6 ready byet
var http = require('http');
var express = require('express');
var path = require('path');
var fs = require('fs');
var port = 1337;

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
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

http.createServer(function(req, res) {
  var usersFilePath = path.join(__dirname, 'server/update-center.json');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  });
  var readable = fs.createReadStream(usersFilePath);
  readable.pipe(res);
}).listen(port, '0.0.0.0', function(err) {
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
}).listen(5000, '0.0.0.0', function(err) {
  if (err) {
    console.error(err);
  }
  console.log('Listening at localhost:5000');
});
