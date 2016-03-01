// Only a couple of es6 feature are supported!!!
/* eslint-disable no-console */ //This is because we are using console log for communications
const express = require('express');
const dns = require('dns');
const request = require('request');

require('./rest');

const ip = '0.0.0.0';
const portClient = 5000;
const portBackend = 3000;
const backend = `http://${ip}:${portBackend}`;

const runningMode = process.env.NODE_ENV || 'development';

const content = `<ul>
    <li><a href="update-center.json">update-center.json</a></li>
    <li><a href="featured-service.json">featured-service.json</a></li>
  </ul>`;

var
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require(`../webpack.config.${runningMode}`);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/plugin*': backend,
    '/latest*': backend,
    '/getCategories*': backend
  }
}).listen(portClient, ip, (err) => {
  if (err) {
    console.error(err);
  }
  console.log('Listening at port:', portClient);
  console.log('using backEnd:', backend);
});
