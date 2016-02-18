const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const poly = require ('babel-polyfill');

const stylusLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader');

function getJenkinsBuildInformation() {
  return {
    timeStamp: new Date().toISOString(),
    revision: process.env.GIT_COMMIT || 'HEAD',
    branch: process.env.GIT_BRANCH || 'develop',
    jenkinsTag: process.env.BUILD_TAG || 'local',
    jenkinsUrl: process.env.BUILD_URL || undefined,
    version: require('./package.json').version
  };
}

const entryDirectory = 'app';

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
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        debug: true,
        NODE_ENV: 'development',
        buildRevisionInfo: getJenkinsBuildInformation()
      })
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true
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
        test: /\.js$/,
        loader: 'babel',
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
