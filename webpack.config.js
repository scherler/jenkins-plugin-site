
/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");

function getJenkinsBuildInformation() {
  return {
    timeStamp: new Date().toISOString(),
    revision: process.env.GIT_COMMIT || 'HEAD',
    branch: process.env.GIT_BRANCH || 'develop',
    jenkinsTag: process.env.BUILD_TAG || 'local',
    //jenkinsUrl: process.env.BUILD_URL || undefined,
    version: require('./package.json').version
  };
}

const entryDirectory = 'scripts';

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/dev-server',
    './' + entryDirectory + '/index'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
    'process.env': JSON.stringify({
      debug: true,
      NODE_ENV: 'development',
      buildRevisionInfo: getJenkinsBuildInformation()
    })
  }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, entryDirectory)
      },
      {
        test: /\.js?$/,
        loaders: ['babel'],
        include: path.join(__dirname, entryDirectory),
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.styl?$/,
        loader: stylusLoader
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  }
};
