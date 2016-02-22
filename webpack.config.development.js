const webpackCommons = require('./webpack.commons');

const
  entryDirectory = webpackCommons.entryDirectory,
  getPlugins = webpackCommons.getPlugins,
  getLoader = webpackCommons.getLoader,
  getOutput = webpackCommons.getOutput,
  extensions = webpackCommons.extensions;

module.exports = {
  debug: true,
  devServer: {
    contentBase: 'build',
    port: 5000
  },
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/dev-server',
    'babel-polyfill',
    `./${entryDirectory}/index`
  ],
  output: getOutput(__dirname),
  resolve: {
    extensions
  },
  plugins: getPlugins('development'),
  module: {
    loaders: getLoader(__dirname)
  }
};
