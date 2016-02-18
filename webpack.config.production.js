const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const poly = require ('babel-polyfill');

const stylusLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader');

const entryDirectory = 'app';

module.exports = {
  debug: false,
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    `./${entryDirectory}/index`
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        debug: false,
        NODE_ENV: 'production'
      })
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
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
