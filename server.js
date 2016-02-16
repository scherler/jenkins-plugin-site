/* eslint-disable no-console, no-var, strict */ //This is because of node being babel6 ready byet
const express = require('express');
const dns = require('dns');
const request = require('request');
const portServer = 3000;
const portClient = 5000;

const content = `<ul>
    <li><a href="update-center.json">update-center.json</a></li>
    <li><a href="featured-service.json">featured-service.json</a></li>
  </ul>`;

const app = express();
// home page
app.get('/', function (req, res) {
  res.send(content);
});

const host = 'updates.jenkins-ci.org';

dns.resolve4(host, (err, addresses) => {
  if (err) {
    app.use(express.static('server'));
    console.log('Using local plugin list');
  } else {
    app.use('/update-center.json', function (req, res) {
      const url = `https://${host}/current/update-center.json`;
      req.pipe(request(url)).pipe(res);
    });
  }
  app.listen(portServer, function () {
    console.log('Listening at port:', portServer);
  });
});


var
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(portClient, '0.0.0.0', function (err) {
  if (err) {
    console.error(err);
  }
  console.log('Listening at port:', portClient);
});
