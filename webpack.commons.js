const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const poly = require('babel-polyfill');
const stylusLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader');
const entryDirectory = 'app';

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

function getOutput(dirname) {
  return {
    path: dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  };
}

function getLoader(dirname) {
  return [
    {
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(dirname, entryDirectory)
    },
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: path.join(dirname, 'node_modules')
    },
    {
      test: /\.styl?$/,
      loader: stylusLoader
    },
    {
      test: /\.css$/,
      loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
      exclude: path.join(dirname, 'node_modules')
    }
  ];
}

const
  plugins = {
    production: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          debug: false,
          NODE_ENV: 'production'
        })
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ],
    development: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          debug: true,
          NODE_ENV: 'development',
          buildRevisionInfo: getJenkinsBuildInformation()
        })
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    commons: [
      new ExtractTextPlugin('styles.css'),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        inject: true
      }),
      new webpack.NoErrorsPlugin()
    ]
  },
  extensions = ['', '.js', '.jsx']
;

function getPlugins(environment) {
  return plugins.commons.concat(plugins[environment]);
}

module.exports = {
  webpack,
  path,
  ExtractTextPlugin,
  HtmlWebpackPlugin,
  poly,
  stylusLoader,
  getJenkinsBuildInformation,
  entryDirectory,
  plugins,
  getPlugins,
  getLoader,
  getOutput,
  extensions
};
