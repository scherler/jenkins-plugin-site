const webpackCommons = require('./webpack.commons');

const
  path = webpackCommons.path,
  entryDirectory = webpackCommons.entryDirectory,
  getPlugins = webpackCommons.getPlugins,
  getOutput = webpackCommons.getOutput,
  extensions = webpackCommons.extensions,
  getLoader = webpackCommons.getLoader;

module.exports = {
  debug: false,
  cache: true,
  devtool: 'cheap-source-map',
  devServer: {
    contentBase: 'css',
    port: 5000
  },
  entry: [
    'babel-polyfill',
    `./${entryDirectory}/index`
  ],
  output: getOutput(path.join(__dirname, 'dist')),
  resolve: {
    extensions
  },
  plugins: getPlugins('production'),
  module: {
    loaders: getLoader(__dirname)
  }
};
