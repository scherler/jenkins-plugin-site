const webpackCommons = require('./webpack.commons');
var ejs = require('ejs');
const
  path = webpackCommons.path,
  entryDirectory = webpackCommons.entryDirectory,
  getPlugins = webpackCommons.getPlugins,
  getOutput = webpackCommons.getOutput,
  extensions = webpackCommons.extensions,
  getLoader = webpackCommons.getLoader;

const locals = {
  paths: [
    '/'
  ]
};

module.exports = {
  debug: false,
  cache: true,
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: 'css',
    port: 5000
  },
  entry: [
    `./${entryDirectory}/index`
  ],
  output: {
    path: path.join(__dirname, 'generated'),
    filename: 'bundle.js',
    publicPath: '/static/',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions
  },
  plugins: getPlugins('production'),
  module: {
    loaders: getLoader(__dirname)
  }
};
